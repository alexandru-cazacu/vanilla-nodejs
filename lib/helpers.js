// @ts-check

/**
 * Utility functions.
 */

const crypto = require("crypto");
const config = require("../config");

const helpers = {};

/**
 * Hashes the given string and returns it.
 * @param {string} str String to hash.
 * @returns Hashed string.
 */
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

/**
 * Create a string of random alphanumeric characters, of a given length.
 */
helpers.createRandomString = (length) => {
  const safeLenght = typeof length == "number" && length > 0 ? length : false;
  if (safeLenght) {
    const possibleChars = 'abcdefghijklmnopqrstuvwxyz0123546789';
    let str = '';
    for (let i = 1; i <= safeLenght; i++) {
      const randChar = possibleChars.charAt(Math.floor(Math.random() * possibleChars.length));
      str += randChar;
    }
    return str;
  } else {
    return false;
  }
};

module.exports = helpers;
