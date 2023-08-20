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
  maxChecks: 5,
  twilio: {
    accountSid: "ACb32d411ad7fe886aac54c665d25e5c5d",
    authToken: "9455e3eb3109edc12e3d8c92768f7a67",
    fromPhone: "+15005550006",
  },
  templateGlobals: {
    appName: "UptimeChecker",
    companyName: "NotARealCompany, Inc.",
    yearCreated: "2023",
    baseUrl: "http://localhost:3000/",
  },
};

environments.testing = {
  httpPort: 4000,
  httpsPort: 4001,
  envName: "testing",
  hashingSecret: "superSecret",
  maxChecks: 5,
  twilio: {
    accountSid: "ACb32d411ad7fe886aac54c665d25e5c5d",
    authToken: "9455e3eb3109edc12e3d8c92768f7a67",
    fromPhone: "+15005550006",
  },
  templateGlobals: {
    appName: "UptimeChecker",
    companyName: "NotARealCompany, Inc.",
    yearCreated: "2023",
    baseUrl: "http://localhost:3000/",
  },
};

environments.production = {
  httpPort: 5000,
  httpsPort: 5001,
  envName: "production",
  hashingSecret: "superSecret",
  maxChecks: 5,
  twilio: {
    accountSid: "",
    authToken: "",
    fromPhone: "",
  },
  templateGlobals: {
    appName: "UptimeChecker",
    companyName: "NotARealCompany, Inc.",
    yearCreated: "2023",
    baseUrl: "http://localhost:5000/",
  },
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
