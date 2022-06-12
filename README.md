# scottylol

Scottylol is an exciting search tool for CMU. It is ScottyLabs' implementation of Facebook's internal bunnylol search tool.

### Deployment

```
npm run build
npm start
```

### Development Testing
```
npm run dev
```

### Adding new commands

Create a new YAML file in the `commands/` directory with the following syntax
```yaml
name: Command Name
description: Command Description
author: Your AndrewID
matches:
  - command
  - comm
  - c
home: https://google.com
searchUrl: https://google.com/search?q=
```

If you are not in ScottyLabs, please submit an issue to request a new command.
