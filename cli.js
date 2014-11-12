#!/usr/bin/env node
'use strict'

var colors = require('colors');
if(process.version < "v0.11.7"){
	console.log("Node v.0.11.7 is required");
	return;
}

var argv = process.argv.slice(2);

var spawn = require('child_process').spawn;
var args = ["--harmony", __dirname+"/index.js"]; 
		for(var i=0;i<argv.length;i++) {
			args.push(argv[i]);
		}

var	child = spawn("node", args, { stdio: 'inherit', stderr: 'inherit' });
		child.on("close", function(code){
			console.log("Finished!");
		});
