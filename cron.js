
var http = require('http'),
	fs = require('fs'),
	path = require('path'),
	cronJob = require('cron').CronJob,
	parseString = require('xml2js').parseString,
	Firebase = require('./firebase-node'),
	ore = require('./ore.js'),
	mineral = require('./minerals.js');
	
console.log("Starting Cron Jobs...");	
	
/*
	CRON JOBS
*/

var fireBaseRoot = "https://tcwtest.firebaseIO.com/";

var mineralJob = new cronJob(
	'0 0 * * * *', 
	function(){
		var options = {
			host: 'api.eve-central.com',
			path: '/api/marketstat'
		};
		console.log("Minerals - Date: " + new Date());
		getData(options, "minerals");
	}, 
	function () {
		console.log("end");
	}, 
	true 
);

var oreJob = new cronJob(
	'0 0 * * * *', 
	function(){
		var options = {
			host: 'api.eve-central.com',
			path: '/api/marketstat'
		};
		console.log("Ore - Date: " + new Date());
		getData(options, "ore");
	}, 
	function () {
		console.log("end");
	}, 
	true 
);
	
var getData = function(options, path){
	
	switch(path){
		case "minerals":
			setData(options, mineral);
			break;
			
		case "ore":
			setData(options, ore);
			break;
			
		default:
			console.log("undefined type");
	}
};


var setData = function(options, type){
	
	var data = {},
		path = options.path.toString(),
		name = "",
		typeRoot = (type === ore ? "Ore" : "Minerals");
	
	var d = getDateObject();
	
	for(var o in type){
		for(var i = 0; i < type[o].length; i++){
			
			var tempOptions = {};
			
			tempOptions = options;
			tempOptions.path = path + "?typeid=" + type[o][i].typeId;
			tempOptions.name = type[o][i].name;
			
			http.get(tempOptions, function(res) {
				res.on('data', function (chunk) {
					parseString(chunk, function (err, result) {
						
						var typeId = result["evec_api"]["marketstat"][0]["type"][0]["$"]["id"];
						var name = getNameById(typeId, type);
						
						var fireBaseSavePath = [typeRoot, name, d.year, d.month, d.day, d.hour].join("/");
						
						data = {
							"buy": result["evec_api"]["marketstat"][0]["type"][0]["buy"][0]["avg"][0],
							"sell": result["evec_api"]["marketstat"][0]["type"][0]["sell"][0]["avg"][0]
						};	
						
						saveData(data, fireBaseSavePath);

					});	
				});
				
				res.on('error', function(e) {
					console.log("Got error: " + e.message);
				});
			});


		}
	}	
};

var saveData = function(data, path){

	var myFireBaseRef = new Firebase(fireBaseRoot + path);
	
	myFireBaseRef.update(data, function(error, dummy) {
	  if (error) {
		console.log('Data could not be saved.' + error);
	  } else {
		//console.log('Data saved successfully.');
	  }
	});

};

var getNameById = function(id, type){
	var name = "";
	for(var o in type){
		for(var i = 0; i < type[o].length; i++){	
			if(type[o][i].typeId == id){
				name = type[o][i].name;
			}
		}
	}

    return name;	
};


var getDateObject = function(){
	var date = new Date();
	
	return dateObj = {
		"year": date.getFullYear(),
		"month": date.getMonth()+1,
		"day": date.getDate(),
		"hour": date.getHours()
	};
};