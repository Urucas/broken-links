#!/usr/bin/env node
'use strict'

module.exports = function() {
	this.pkg = require('./package.json'),
	this.colors = require('colors'),
	this.isup = require('is-up'),
	this.argv = process.argv.slice(2);

	this.params = {};
	this.parseParams = function(argv) {
		if(argv.indexOf("--help") !== -1){
			console.log([	
					'',
					pkg.description,
					'Example:',
					'broken-links -s http://kuesty.com -404 http://kuesty.com/error/404'
					].join("\n"));
		}
		for(var i=0; i<argv.length;i+=2){
			this.params[argv[i]] = argv[i+1];
		}
		if(this.params["-s"] == undefined) {
			console.log("You must provide the site name".red);
			return;
		}
		if(this.params["-404"] == -1) {
			console.log("You must provide your 404 page to compare".red);
			return;
		}
	}

	this.testIsUp = function(uri){
		console.log("Checking your site is up");
		var isUp = require('is-up');
		isUp(params["-s"], function(err, up){
			if(!up){
				console.log("Your site is down".red);
				return;
			}
			read404(params["-404"]);
		});
	}

	this.read404 = function(uri) {
		console.log("Getting 404");
		readPage(params['-404'], function(err, response){
			response = response.replace(/\s+/g,"");
			hash = md5(response);
		});
	}	

	this.searchLinks = function(response) {
		var allLinks = response.match(/href="[a-zA-Z\:\/\.\-0-9\@\#\&\;]+/g);
		var links = {};
		for(var i=0;i<allLinks.length;i++) {
			var a = allLinks[i].replace(/href="/,"");
			if(a.indexOf(".css") !== -1) continue;
			if(a.indexOf(".ico") !== -1) continue;
			if(a.indexOf("#") == 0) continue;
			if(a.match(/https?:/)) continue;
			if(links[a] != undefined) continue;
			links[a] = "TESTING";
		}
	}

};

var request = require('monocle-request')
, fs = require('monocle-fs')
, monocle = require('monocle-js')
, o_O = monocle.o_O;

var readPage = o_O(function*(uri) {
	var uri = uri.indexOf("http://") !== -1 || uri.indexOf("https://") !== -1 ? uri : "http://"+uri;
	console.log(uri);
	var data = yield request(uri);
	return data;
});

var main = o_O(function*() {
	try {
		var data = yield readPage("http://google.com");
		console.log(data);
	} catch (err) {
		console.log(err);
	}
});

if(require.main === module){
	monocle.launch(main);
}

