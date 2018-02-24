/*#include <iostream>
#include <fstream>
#include <sstream>
#include <string>
#include <cstring>
#include <jsoncpp/json/json.h>*/
var fs = require("fs");
var exec = require("child_process").execSync;
var root = require("./programs.json");
var argv = process.argv.slice(1);

var deleteFolderRecursive = function(path) {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach(function(file, index){
      var curPath = path + "/" + file;
      if (fs.lstatSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};

function base64_encode(file) {
    if (file == "default") return "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";
    else return fs.readFileSync(file).toString('base64');
}

function main(argc, argv) {
    if (argc < 4) {
        console.log("Usage: addprogram <program name> <program path> [-n app name] [-i icon path] [-f|-w]");
        return 1;
    }
    var icon;
    if (argc > 4) {
        icon = argv[4];
    } else {
        icon = "default";
    }
    var id = root["id"];
    root[argv[1]] = {path: argv[2], fullscreen: (argv[0] == "-f")};
    fs.writeFileSync("programs.json", JSON.stringify(root, null, 4));
    fs.unlink(argv[1] + ".crx", function(err) {return;});
    fs.unlink(argv[1] + ".pem", function(err) {return;});
    var dir = argv[1] + "/";
    fs.mkdirSync(dir);
    var manifest = {};
    manifest["name"] = argv[3];
    manifest["description"] = "Crouton app wrapper";
    manifest["version"] = "1.0";
    manifest["manifest_version"] = 2;
    manifest["icons"] = {};
    manifest["icons"]["128"] = "icon_128.png";
    manifest["app"] = {};
    manifest["app"]["background"] = {};
    manifest["app"]["background"]["scripts"] = ["background.js"];
    fs.writeFileSync(dir + "manifest.json", JSON.stringify(manifest));
    var script = "chrome.runtime.sendMessage(\"gcpneefbbnfalgjniomfjknbcgkbijom\", {name: \"" + argv[2] + "\", data: \"" + base64_encode(icon) + "\"}, function(response) {return;});\nvar xhr = new XMLHttpRequest();\nxhr.onreadystatechange = function() {if (xhr.readyState == XMLHttpRequest.DONE) console.log(xhr.responseText);}\nxhr.open(\"POST\", \"http://dweet.io/dweet/for/jmw_croutonapp" + id + "?program=" + argv[1] + "\", true);\nxhr.setRequestHeader(\"Content-Type\", \"text/json; charset=UTF-8\");\nxhr.send();";
    fs.writeFileSync(dir + "background.js", script);
    if (icon != "default") fs.copyFileSync(icon, dir + "icon_128.png");
    exec("crxmake --pack-extension=" + dir);
    deleteFolderRecursive(dir.substr(0, dir.length - 1));
    console.log("programs.json has been updated, and the extension has been created as " + argv[1] + ".crx.");
    return 0;
}

// addprogram program path [-n name] [-i icon] [-f|-w]

if (require.main === module) {
    var args = new Array();
    args[3] = "empty";
    args[0] = "-w";
    for (var a in argv) {
        if (a < 3) args[a] = argv[a];
        else {
            if (argv[a] == "-n") args[3] = argv[++a];
            else if (argv[a] == "-i") args[4] = argv[++a];
            else if (argv[a] == "-f") args[0] = "-f";
            else if (argv[a] == "-w") args[0] = "-w";
        }
    }
    if (args[3] == "empty") args[3] = args[1];
    main(args.length, args);
} else module.exports = main;
