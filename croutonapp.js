//var http = require("http");
var programs = require("./programs.json");
var system = require("child_process").exec;
var dweetClient = require("node-dweetio");
var dweetio = new dweetClient();
var fullscreen_apps = {kde: "xinit /usr/local/bin/startkde", lxde: "startlxde", gnome: "startgnome", unity: "startunity", xfce: "startxfce4"};

/*server = http.createServer( function(req, res) {

    console.dir(req.param);

        console.log("POST");
        var body = '';
        req.on('data', function (data) {
            body += data;
            console.log("Partial body: " + body);
        });
        req.on('end', function () {
            console.log("Body: " + body);
	        var data = JSON.parse(body);
	        for (var key in programs.keys) {
		        if (data.program == key) {
		            system("sudo enter-chroot sudo xiwi " + programs[key], function() {});
		        }
            }
        });
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end('post received');

});
server.listen("localhost", 3000);
console.log("Hosting on 127.0.0.1:3000");
*/
dweetio.listen_for("jmw_croutonapp" + programs.id, function(dweet) {
    //console.log("Got dweet " + dweet.content.program);
    for (var a in fullscreen_apps) {
        if (dweet.content.program == a) {
            console.log("Running " + a);
            system(fullscreen_apps[a], function(err, stdout, stderr) {
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
    for (var key in programs.keys) {
        //console.log(programs.keys[key]);
        if (dweet.content.program == programs.keys[key]) {
            console.log("Running " + programs.keys[key]);
            system("sudo xiwi " + programs[programs.keys[key]], function(err, stdout, stderr) {
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
