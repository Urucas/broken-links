#!/usr/bin/env node
'use strict'

var co = require('co');

co(function* () {

	var	request = require('co-request'),
		pkg = require('./package.json'),
		colors = require('colors'),
		argv = process.argv.slice(2),
		params = {};

	if(argv.indexOf("--help") !== -1){
		console.log([	
		'',
		pkg.description,
		'Example:',
		'broken-links -s http://kuesty.com -404 http://kuesty.com/error/404'
		].join("\n"));
		return;
	}
	
	for(var i=0; i<argv.length;i+=2){
		params[argv[i]] = argv[i+1];
	}
	if(params["-s"] == undefined) {
		console.log("You must provide the site name".red);
		return;
	}
	if(params["-404"] == undefined) {
		console.log("You must provide your 404 page to compare".red);
		return;
	}
	
	var base_uri = params["-s"];
			base_uri = base_uri.indexOf("http") === -1 ? "http://"+base_uri : base_uri;

	var uri = params["-404"];
			uri = uri.indexOf("http") === -1 ? "http://"+uri : uri;
			
	console.log("Getting 404 source: ".white+ params["-404"].yellow);
	var result = yield request(uri);
	var body404 = result.body;
			body404 = body404.replace(/\s+/g,"");

	console.log("Getting page source: ".white+params["-s"].yellow);
	var result = yield request(base_uri);
	var response = result.body;

	console.log("Getting page links".white);
	var allLinks = response.match(/href="[a-zA-Z\:\/\.\-0-9\@\#\&\;]+/g);
	var links = {};
	
	var relative_uri = base_uri.match(/https?:\/\/[a-zA-Z\.\-0-9]+/)[0];

	for(var i=0;i<allLinks.length;i++) {
		var a = allLinks[i].replace(/href="/,"");
		if(a.indexOf(".css") !== -1) continue;
		if(a.indexOf(".ico") !== -1) continue;
		if(a.indexOf("#") == 0) continue;
		if(a == "/") continue;
		if(a.match(/https?:/)) continue;
		if(links[a] != undefined) continue;
		
		links[a] = relative_uri + a;
		var result = yield request(links[a]);
		console.log(result.statusCode);
		if(result.statusCode == 404) {
			console.log("|_ "+links[a].yellow + " -> BROKEN".red);	
			continue;
		}
		var body = result.body;
		    body = body.replace(/\s+/g,"");

		if(body == body404){
			console.log("|_ "+links[a].yellow + " -> BROKEN".red);
		}else{
			console.log("|_ " +links[a].yellow + " -> OK".cyan);
		}
	}

})();
