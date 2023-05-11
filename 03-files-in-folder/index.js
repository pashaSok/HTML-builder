const fs = require("fs");
const path = require("path");
const { stdin, stdout, exit } = process;

function formatSizeUnits(bytes) {
  if (bytes >= 1024) {
    bytes = (bytes / 1024).toFixed(2) + "kb";
  } else if (bytes > 1) {
    bytes = bytes + "b";
  } else if (bytes == 1) {
    bytes = bytes + "b";
  } else {
    bytes = "0b";
  }
  return bytes;
}

function infoFiles() {
  let dir = fs.readdir(path.join(__dirname, "secret-folder"), (err, files) => {
    files.forEach((file) => {
      const filePath = path.join(__dirname, "secret-folder", file);
      const extFile = path.extname(filePath);
      const fileName = path.basename(filePath, extFile);
      fs.stat(filePath, (err, stats) => {
        console.log(
          `${fileName} - ${extFile.replace(".", "")} - ${formatSizeUnits(
            stats.size
          )}`
        );
      });
    });
  });
}

infoFiles();
