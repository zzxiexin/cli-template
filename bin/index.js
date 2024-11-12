#!/usr/bin/env node

const { program } = require("commander");
const getHelpOptions = require("./options");
const createCommands = require("./create.js");
getHelpOptions();
createCommands();
program.parse();
