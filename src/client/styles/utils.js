const path = require("path");

const resources = [
  "variables.scss",
  "animate.scss",
];

module.exports = resources.map(file => path.resolve(__dirname, file));