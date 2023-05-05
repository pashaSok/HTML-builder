const fs = require("fs");
const path = require("path");
const { stdout } = process;

let readStream = fs.createReadStream(path.join(__dirname, "text.txt"), "utf8");

readStream.on("data", (chunk) => stdout.write(chunk));
