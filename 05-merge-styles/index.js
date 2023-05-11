const fs = require("fs");
const path = require("path");
const distPath = path.join(__dirname, "project-dist/bundle.css");
const stylesPath = path.join(__dirname, "styles");

function createBundle() {
  fs.readdir(stylesPath, { withFileTypes: true }, (err, files) => {
    if (err) throw err;

    const styleFiles = files.filter(
      (file) => path.extname(file.name) === ".css"
    );
    const writeStream = fs.createWriteStream(distPath);

    styleFiles.forEach((file) => {
      const readStream = fs.createReadStream(path.join(stylesPath, file.name));
      readStream.on("data", (data) => {
        writeStream.write(data + "\n");
      });
    });
  });
}

createBundle();
