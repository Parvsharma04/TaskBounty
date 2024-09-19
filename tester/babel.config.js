module.exports = {
  presets: ["next/babel"],
  plugins: [["styled-components", { "ssr": true, "displayName": true }]],
  ignore: ["node_modules/lodash"]
};
