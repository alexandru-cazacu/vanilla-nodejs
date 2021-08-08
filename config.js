// @ts-check

/**
 * Exports the appropriate config vars for the selected env.
 */
const environments = {};

environments.staging = {
  port: 3000,
  envName: "staging",
};

environments.production = {
  port: 5000,
  envName: "production",
};

const currEnv =
  typeof process.env.NODE_ENV === "string"
    ? process.env.NODE_ENV.toLowerCase()
    : "";

const envToExport =
  typeof environments[currEnv] === "object"
    ? environments[currEnv]
    : environments.staging;

module.exports = envToExport;
