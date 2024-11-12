const { program } = require("commander");

const getHelpOptions = () => {
  program.version("0.0.1", "-v, --version");
};

module.exports = getHelpOptions;
