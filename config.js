// @ts-check

/**
 * Exports the appropriate config vars for the selected env.
 */
const environments = {};

environments.staging = {
  httpPort: 3000,
  httpsPort: 3001,
  envName: "staging",
  hashingSecret: "superSecret",
};

environments.production = {
  httpPort: 5000,
  httpsPort: 5001,
  envName: "production",
  hashingSecret: "superSecret",
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
