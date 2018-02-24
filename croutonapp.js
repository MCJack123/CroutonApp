//var http = require("http");
var programs = require("./programs.json");
var system = require("child_process").exec;
var dweetClient = require("node-dweetio");
var dweetio = new dweetClient();
//var fullscreen_apps = {kde: "xinit /usr/local/bin/startkde", lxde: "startlxde", gnome: "startgnome", unity: "startunity", xfce: "startxfce4"};

dweetio.listen_for("jmw_croutonapp" + programs.id, function(dweet) {
    console.log("Got dweet " + dweet.content.program);
    for (var key in programs) {
        if (key == "id") continue;
        //console.log(programs.keys[key]);
        if (dweet.content.program == key) {
            console.log("Running " + key);
            system((programs[key].fullscreen ? "" : "xiwi ") + programs[key].path, function(err, stdout, stderr) {
                if (err) {
                    console.log("Error: " + err);
                    return;
                }
                //console.log("stdout: " + stdout);
                //console.log("stderr: " + stderr);
            });
            return;
        }
    }
});
