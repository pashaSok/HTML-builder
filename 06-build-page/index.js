const fs = require("fs");
const path = require("path");
const { copyFile } = require("node:fs/promises");
const { stdin, stdout, exit } = process;

const distPath = path.join(__dirname, "project-dist/style.css");
const dist = path.join(__dirname, "project-dist");
const srcDir = path.join(__dirname, "assets");
const stylesPath = path.join(__dirname, "styles");
const distAssets = path.join(__dirname, "project-dist/assets");
const componentsHtml = path.join(__dirname, "components");

async function createProjectFolder() {
  fs.mkdir(dist, { recursive: true }, (err) => {
    if (err) {
      throw err;
    }
  });
}

async function copyDir(srcDir, distAssets) {
  await fs.mkdir(distAssets, { recursive: true }, (err) => {
    if (err) throw err;
  });
  await fs.readdir(srcDir, { withFileTypes: true }, (err, files) => {
    if (err) {
      throw err;
    }
    files.forEach(async (file) => {
      if (file.isFile()) {
        const fileSrc = path.join(srcDir, file.name);
        const dest = path.join(distAssets, file.name);
        await copyFile(fileSrc, dest);
      } else if (file.isDirectory()) {
        copyDir(path.join(srcDir, file.name), path.join(distAssets, file.name));
      }
    });
  });
}

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

function buildHtml(template, index) {
  let html = "";
  const templateReadStream = fs.createReadStream(template, "utf8");
  templateReadStream.on("data", (data) => {
    html = data.toString();
  });
  templateReadStream.on("end", () => {
    replaceHtml(html, index);
  });
}

function replaceHtml(html, index) {
  let objHtml = {};
  let count = 0;
  fs.promises.readdir(componentsHtml).then((files) => {
    files.forEach((file) => {
      const pathFile = path.join(componentsHtml, file);
      const pathFileCount = file.replace(path.extname(file), "");
      objHtml[pathFileCount] = "";
      fs.createReadStream(path.join(pathFile))
        .on("data", (data) => {
          objHtml[pathFileCount] += data.toString();
        })
        .on("end", () => {
          count++;
          if (count >= files.length) {
            for (let i in objHtml) {
              html = html.replace("{{" + i + "}}", objHtml[i]);
            }
            let htmlStream = fs.createWriteStream(index, { encoding: "utf8" });
            htmlStream.write(html);
          }
        });
    });
  });
}

function buildPage() {
  createProjectFolder();
  createBundle();
  copyDir(srcDir, distAssets);
  buildHtml(
    path.join(__dirname, "template.html"),
    path.join(dist, "index.html")
  );
}

buildPage();
