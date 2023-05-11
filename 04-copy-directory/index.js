const fs = require("fs");
const path = require("path");
const { copyFile } = require("node:fs/promises");
const { stdin, stdout, exit } = process;

function copyDir() {
  const srcDir = path.join(__dirname, "files");
  const newDir = path.join(__dirname, "files-copy");

  fs.rm(newDir, { recursive: true }, (err) => {
    if (err) console.log(err);

    fs.mkdir(newDir, { recursive: true }, (err) => {
      if (err) console.log(err);

      fs.readdir(srcDir, { withFileTypes: true }, (err, files) => {
        if (err) console.log(err);
        files.forEach((file) => {
          const fileSrc = path.join(__dirname, "files", file.name);
          const dest = path.join(__dirname, "files-copy", file.name);
          copyFile(fileSrc, dest);
        });
      });
    });
  });
}

copyDir();
