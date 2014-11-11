#!/usr/bin/env node
'use strict'

var co = require('co'), 
	request = require('co-request'),
	pkg = require('./package.json'),
	colors = require('colors'),
	argv = process.argv.slice(2),
	params = {};

co(function* () {

	if(argv.indexOf("--help") !== -1){
		console.log([	
			'',
			pkg.description,
			'Example:',
			'broken-links -s http://kuesty.com -404 http://kuesty.com/error/404'
		].join("\n"));
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

	// getting 404
	var uri = params["-404"];
			uri = uri.indexOf("http") === -1 ? "http://"+uri : uri;

	var result = yield request(uri);
  var body404 = result.body;
			body404 = body404.replace(/\s+/g,"");

	// getting main page
	var base_uri = params["-s"];
			base_uri = base_uri.indexOf("http") === -1 ? "http://"+base_uri : base_uri;

	var result = yield request(base_uri);
	var response = result.body;

	var allLinks = response.match(/href="[a-zA-Z\:\/\.\-0-9\@\#\&\;]+/g);
	var links = {};
	
	// gettings links on the page
	console.log("Reading links");
	console.log(base_uri.yellow);
	for(var i=0;i<allLinks.length;i++) {
		var a = allLinks[i].replace(/href="/,"");
		if(a.indexOf(".css") !== -1) continue;
		if(a.indexOf(".ico") !== -1) continue;
		if(a.indexOf("#") == 0) continue;
		if(a == "/") continue;
		if(a.match(/https?:/)) continue;
		if(links[a] != undefined) continue;
		
		links[a] = base_uri + a;
		var result = yield request(links[a]);
		var body = result.body;
				body = body.replace(/\s+/g,"");

		if(body == body404){
			console.log("|_ "+a.red + " -> BROKEN".red);
		}else{
			console.log("|_ " +a.cyan + " -> OK".cyan);
		}
	}

})();

