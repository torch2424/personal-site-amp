const fs = require("fs");
const mkdirp = require("mkdirp");
const cpy = require("cpy");
const Mustache = require("mustache");
const CleanCSS = require("clean-css");

console.log("Building...");
console.log(" ");

const cssMinifier = new CleanCSS();
const minifyCss = filePath => {
  const fileString = fs.readFileSync(filePath, "utf8");
  return cssMinifier.minify(fileString).styles;
};

const mustacheData = {
  styles: {
    normalize: minifyCss("node_modules/normalize.css/normalize.css"),
    sakura: minifyCss("node_modules/sakura.css/css/sakura-dark.css"),
    index: minifyCss("./src/index.css")
  }
};

const buildTask = async () => {
  // Create our build output folder
  mkdirp.sync("./dist");

  // Render all the pages
  const pages = ["index.html"];
  pages.forEach(page => {
    const fileContents = fs.readFileSync(`./src/${page}`, "utf8").toString();
    const renderedPage = Mustache.render(fileContents, mustacheData);
    fs.writeFileSync(`./dist/${page}`, renderedPage);
  });

  // Copy over assets
  await cpy(["assets/"], "dist/");

  console.log("Done!");
  console.log(" ");
};
buildTask();
