/**
 * Fake fs based DB.
 */

const fs = require("fs");
const path = require("path");
const helpers = require("./helpers");

const lib = {};

lib.baseDir = path.join(__dirname, "../.data/");

/**
 * Write data to a file
 * @param {*} dir
 * @param {*} file
 * @param {*} data
 * @param {*} callback
 */
lib.create = (dir, file, data, callback) => {
  const filePath = `${lib.baseDir}${dir}\\${file}.json`;
  fs.open(filePath, "wx", (err, fileDescriptor) => {
    if (!err && fileDescriptor) {
      const stringData = JSON.stringify(data);
      fs.writeFile(fileDescriptor, stringData, (err) => {
        if (!err) {
          fs.close(fileDescriptor, (err) => {
            if (!err) {
              callback(false);
            } else {
              callback("Error closing file");
            }
          });
        } else {
          callback("Error writing to new file");
        }
      });
    } else {
      callback("Could not create new file, it may already exist");
    }
  });
};

/**
 * Read data from a file.
 * @param {*} dir
 * @param {*} file
 * @param {(error: boolean|Error|null, data: string|Object) => void} callback
 */
lib.read = (dir, file, callback) => {
  const filePath = `${lib.baseDir}${dir}\\${file}.json`;

  fs.readFile(filePath, "utf8", (err, data) => {
    if (!err && data) {
      const parsedData = helpers.parseJsonToObject(data);
      callback(false, parsedData);
    } else {
      callback(err, data);
    }
  });
};

/**
 * Update data in a file.
 * @param {*} dir
 * @param {*} file
 * @param {*} data
 * @param {*} callback
 */
lib.update = (dir, file, data, callback) => {
  const filePath = `${lib.baseDir}${dir}\\${file}.json`;
  fs.open(filePath, "r+", (err, fileDescriptor) => {
    if (!err && fileDescriptor) {
      const stringData = JSON.stringify(data);
      fs.ftruncate(fileDescriptor, (err) => {
        if (!err) {
          fs.writeFile(fileDescriptor, stringData, (err) => {
            if (!err) {
              fs.close(fileDescriptor, (err) => {
                if (!err) {
                  callback(false);
                } else {
                  callback("Error closing existing file");
                }
              });
            } else {
              callback("Error writing to existing file");
            }
          });
        } else {
          callback("Error truncating file");
        }
      });
    } else {
      callback("Could not open the file for updating, it may not exist");
    }
  });
};

/**
 * Delete a file.
 * @param {*} dir
 * @param {*} file
 * @param {*} callback
 */
lib.delete = (dir, file, callback) => {
  const filePath = `${lib.baseDir}${dir}\\${file}.json`;
  fs.unlink(filePath, (err) => {
    if (!err) {
      callback(false);
    } else {
      callback("Error deleting the file");
    }
  });
};

/**
 * List all the items in a directory.
 * @param {string} dir
 * @param {*} callback
 */
lib.list = (dir, callback) => {
  fs.readdir(lib.baseDir + dir + "/", (err, data) => {
    if (!err && data && data.length > 0) {
      const trimmedFileNames = [];
      data.forEach((fileName) => {
        trimmedFileNames.push(fileName.replace(".json", ""));
      });
      callback(false, trimmedFileNames);
    } else {
      callback(err, data);
    }
  });
};

module.exports = lib;
