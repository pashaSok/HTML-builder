const fs = require("fs");
const path = require("path");
const { stdin, stdout, exit } = process;

let writeStream = fs.createWriteStream(
  path.join(__dirname, "text.txt"),
  "utf8"
);

stdin.on("data", (chunk) => {
  chunk.toString().trim() === "exit" ? exit() : writeStream.write(chunk);
});
