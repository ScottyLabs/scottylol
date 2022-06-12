import express from 'express';
import fs from 'fs';
import yaml from 'yaml';

const app = express();
const COMMAND_DIR = './commands';

type CommandConfig = {
  name: string;
  description: string;
  author: string;
  matches: string[];
  redirect: string;
  param?: string;
}

type CommandMapping = {[key: string]: string};

const readCommands = () => {
  const commandDir = fs.readdirSync(COMMAND_DIR);
  const result: CommandMapping = {};
  for (const filename of commandDir) {
    const file = fs.readFileSync(COMMAND_DIR + '/' + filename).toString();
    const fileYaml: CommandConfig = yaml.parse(file);
    const redirectEndpoint = fileYaml.redirect;
    const queryParam = fileYaml.param;
    const redirectUrl = queryParam !== undefined ? `${redirectEndpoint}?${queryParam}=` : `${redirectEndpoint}/`;

    try {
      new URL(redirectUrl + 'test');
    } catch (e) {
      console.error(e);
      console.log(`${fileYaml.name} in ${filename} has an invalid URL`);
      continue;
    }

    for (const command of fileYaml['matches']) {
      if (command in result) {
        console.log("${command} already declared!");
        continue;
      }
      result[command] = redirectUrl;
    }
  }
  return result;
}

(async () => {
  const mappings = readCommands();
  console.log(mappings);
})();
