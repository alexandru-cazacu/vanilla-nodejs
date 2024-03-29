// @ts-check

/*
 * Library for storing and rotating logs
 */

// Dependencies
const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

// Container for module (to be exported)
const lib = {};

// Base directory of data folder
lib.baseDir = path.join(__dirname, "../.logs/");

/**
 * Append a string to a file. Create the file if it does not exist
 * @param {string} file
 * @param {string} str
 * @param {function(boolean|string):void} callback
 */
lib.append = (file, str, callback) => {
  // Open the file for appending
  fs.open(lib.baseDir + file + ".log", "a", (err, fileDescriptor) => {
    if (!err && fileDescriptor) {
      // Append to file and close it
      fs.appendFile(fileDescriptor, str + "\n", (err) => {
        if (!err) {
          fs.close(fileDescriptor, (err) => {
            if (!err) {
              callback(false);
            } else {
              callback("Error closing file that was being appended");
            }
          });
        } else {
          callback("Error appending to file");
        }
      });
    } else {
      callback("Could not open file for appending");
    }
  });
};

/**
 * List all the logs, and optionally include the compressed logs
 * @param {boolean} includeCompressedLogs
 * @param {(error:boolean|Error|null, logs:string[])=>void} callback
 */
lib.list = (includeCompressedLogs, callback) => {
  fs.readdir(lib.baseDir, (err, data) => {
    if (!err && data && data.length > 0) {
      const trimmedFileNames = [];
      data.forEach((fileName) => {
        // Add the .log files
        if (fileName.indexOf(".log") > -1) {
          trimmedFileNames.push(fileName.replace(".log", ""));
        }

        // Add the .gz files
        if (fileName.indexOf(".gz.b64") > -1 && includeCompressedLogs) {
          trimmedFileNames.push(fileName.replace(".gz.b64", ""));
        }
      });
      callback(false, trimmedFileNames);
    } else {
      callback(err, data);
    }
  });
};

/**
 * Compress the contents of one .log file into a .gz.b64 file within the same directory
 * @param {string} logId
 * @param {string} newFileId
 * @param {(error:boolean|Error|null)=>void} callback
 */
lib.compress = (logId, newFileId, callback) => {
  const sourceFile = logId + ".log";
  const destFile = newFileId + ".gz.b64";

  // Read the source file
  fs.readFile(lib.baseDir + sourceFile, "utf8", (err, inputString) => {
    if (!err && inputString) {
      // Compress the data using gzip
      zlib.gzip(inputString, (err, buffer) => {
        if (!err && buffer) {
          // Send the data to the destination file
          fs.open(lib.baseDir + destFile, "wx", (err, fileDescriptor) => {
            if (!err && fileDescriptor) {
              // Write to the destination file
              fs.writeFile(fileDescriptor, buffer.toString("base64"), (err) => {
                if (!err) {
                  // Close the destination file
                  fs.close(fileDescriptor, (err) => {
                    if (!err) {
                      callback(false);
                    } else {
                      callback(err);
                    }
                  });
                } else {
                  callback(err);
                }
              });
            } else {
              callback(err);
            }
          });
        } else {
          callback(err);
        }
      });
    } else {
      callback(err);
    }
  });
};

/**
 * Decompress the contents of a .gz file into a string variable
 * @param {string} fileId
 * @param {(error:boolean|Error|null, value?:string)=>void} callback
 */
lib.decompress = (fileId, callback) => {
  const fileName = fileId + ".gz.b64";
  fs.readFile(lib.baseDir + fileName, "utf8", (err, str) => {
    if (!err && str) {
      // Inflate the data
      const inputBuffer = Buffer.from(str, "base64");
      zlib.unzip(inputBuffer, (err, outputBuffer) => {
        if (!err && outputBuffer) {
          // Callback
          const str = outputBuffer.toString();
          callback(false, str);
        } else {
          callback(err);
        }
      });
    } else {
      callback(err);
    }
  });
};

/**
 * Truncate a log file
 * @param {string} logId
 * @param {(error:boolean|Error|null)=>void} callback
 */
lib.truncate = (logId, callback) => {
  fs.truncate(lib.baseDir + logId + ".log", 0, (err) => {
    if (!err) {
      callback(false);
    } else {
      callback(err);
    }
  });
};

// Export the module
module.exports = lib;
