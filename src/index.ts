import express from 'express';
import fs from 'fs';
import yaml from 'yaml';

const app = express();
const COMMAND_DIR = './commands';

const readCommands = () => {
  const commandDir = fs.readdirSync(COMMAND_DIR);
  const result: {[string: any]} = {};
  for (const filename of commandDir) {
    const file = fs.readFileSync(COMMAND_DIR + '/' + filename).toString();
    const fileYaml = yaml.parse(file);
    
    for (const command of fileYaml['matches']) {
      result[command] = {
        
      }
    }
  }
}

(async () => {
  readCommands();
})();
