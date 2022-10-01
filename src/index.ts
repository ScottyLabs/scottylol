import express from "express";
import fs from "fs";
import yaml from "yaml";
import { closestMatch } from "closest-match";
import "dotenv/config";

const COMMAND_DIR = process.env.COMMAND_DIR ?? "./commands";
const PORT = process.env.PORT ?? 3000;
type CommandConfig = {
  name: string;
  description: string;
  author: string;
  matches: string[];
  searchUrl?: string;
  home: string;
  examples: string[];
};

type Redirect = {
  searchUrl?: string;
  home: string;
};

type Example = {
  command: string;
  uriCommand: string;
};

type CommandMapping = { [key: string]: Redirect };
type CommandHelpInfo = {
  name: string;
  description: string;
  matches: string[];
  examples: Example[];
};

type CommandData = {
  mapping: CommandMapping;
  helpInfo: CommandHelpInfo[];
};

type SearchErrorParams = {
  token: string;
  closest: string;
  currQuery: string;
  currSearch: string;
};

const readCommands = (): CommandData => {
  const commandDir = fs.readdirSync(COMMAND_DIR);
  const mapping: CommandMapping = {};
  const helpInfo: CommandHelpInfo[] = [];
  for (const filename of commandDir) {
    const file = fs.readFileSync(COMMAND_DIR + "/" + filename).toString();
    const fileYaml: CommandConfig = yaml.parse(file);
    const searchUrl = fileYaml.searchUrl;
    const home = fileYaml.home;
    const name = fileYaml.name;
    const description = fileYaml.description;
    const matches = fileYaml.matches;
    const examples = fileYaml.examples.map((example) => {
      return { command: example, uriCommand: encodeURIComponent(example) };
    });
    const info = { name, description, matches, examples };

    helpInfo.push(info);

    try {
      if (searchUrl) {
        new URL(searchUrl + "test");
      }
      new URL(home);
    } catch (e) {
      console.error(e);
      console.log(`${fileYaml.name} in ${filename} has an invalid URL`);
      continue;
    }

    for (const command of matches) {
      if (command in mapping) {
        console.log("${command} already declared!");
        continue;
      }
      const redirect: Redirect = { searchUrl, home };
      mapping[command] = redirect;
    }
  }
  return { mapping, helpInfo };
};

(async () => {
  const { mapping, helpInfo } = readCommands();
  const app = express();

  function getMapping(token: string, query?: string): URL | null {
    if (!(token in mapping)) {
      return null;
    }

    const config = mapping[token];
    const home = config.home;
    const searchUrl = config.searchUrl;
    const target =
      searchUrl === undefined || query === undefined ? home : searchUrl + encodeURIComponent(query);

    return new URL(target);
  }

  app.set("view engine", "ejs");

  app.get("/search", (req, res, next) => {
    const { q } = req.query;
    if (typeof q !== "string") {
      return res.status(400).send("Bad request");
    }
    const match = q.match(/^(\S*)(?:\s(.*))?$/);
    if (match === null) {
      return res.status(400).send("Bad request");
    }

    const token = match[1].toLowerCase();
    const query = match[2];

    const url = getMapping(token, query);

    // If no matching token is found go to fallback
    if (!url) {
      const closest = closestMatch(token, Object.keys(mapping));
      const currQuery = match[2] ? " " + match[2] : "";
      return next({ token, closest, currQuery, currSearch: q });
    }

    res.redirect(url.toString());
  });

  app.get("/help", (req, res, next) => {
    res.render("pages/help", { helpInfo });
  });

  const errorHandler: express.ErrorRequestHandler = (
    value: SearchErrorParams,
    req,
    res,
    next
  ) => {
    res.status(404).render("pages/404", {
      query: `${value.closest}${value.currQuery}`,
      currSearch: value.currSearch,
    });
    // send(`Command not found: ${value.token}. Did you mean: ${value.closest}?`);
  };
  app.use(errorHandler);

  app.get("/noob", (req, res, next) => {
    const { q } = req.query;
    if (typeof q !== "string") {
      return res.status(400).send("Bad request");
    }
    const match = q.match(/^(\S*)(?:\s(.*))?$/);
    if (match === null) {
      return res.status(400).send("Bad request");
    }

    const token = match[1].toLowerCase();
    const query = match[2];

    const url = getMapping(token, query);

    // If no matching token is found go to fallback
    if (!url) {
      return next(q);
    }

    res.redirect(url.toString());
  });

  app.get("/", (req, res, next) => {
    res.redirect("/help");
  });

  const noobErrorHandler: express.ErrorRequestHandler = (
    currSearch: string,
    req,
    res,
    next
  ) => {
    res.status(404).redirect(`https://google.com/search?q=${currSearch}`);
  };
  app.use(noobErrorHandler);

  app.listen(PORT, () => console.log(`Server is listening at port ${PORT}.`));
})();
