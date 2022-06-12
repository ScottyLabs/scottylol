import express from 'express';
import fs from 'fs';

const app = express();

(async () => {
  const commandDir = fs.readdirSync('./commands');
  console.log(commandDir);
})();
