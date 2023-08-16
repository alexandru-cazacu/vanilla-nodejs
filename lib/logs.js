// @ts-check

/**
 * Store and rotate logs.
 */

const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

const lib = {};

/**
 * Base directory of the logs folder.
*/
lib.baseDir = path.join(__dirname, "../.logs/");

module.exports = lib;
