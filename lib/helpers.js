// @ts-check

/**
 * Utility functions.
 */

const crypto = require("crypto");
const config = require("../config");

const helpers = {};

helpers.hash = (str) => {
  if (typeof str === "string" && str.length > 0) {
    const hash = crypto
      .createHmac("sha256", config.hashingSecret)
      .update(str)
      .digest("hex");
    return hash;
  } else {
    return false;
  }
};

/**
 * Parses a JSON string to an object without throwing an error.
 * @param {*} str The string to parse.
 * @returns Empty object if parsing fails, otherwise the parsed object
 */
helpers.parseJsonToObject = (str) => {
  try {
    const obj = JSON.parse(str);
    return obj;
  } catch (error) {
    return {};
  }
};

module.exports = helpers;
