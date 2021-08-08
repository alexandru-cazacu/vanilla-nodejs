/**
 * Fake fs based DB.
 */

const fs = require("fs");
const path = require("path");

const lib = {};

lib.baseDir = path.join(__dirname, "../.data/");

lib.create = (dir, file, data, callback) => {
  fs.open(newFilePath, "wx", (err, fileDescriptor) => {
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

lib.read = (dir, file, callback) => {
  const filePath = `${lib.baseDir}${dir}\\${file}.json`;

  fs.readFile(filePath, "utf8", (err, data) => {
    callback(err, data);
  });
};

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

module.exports = lib;
