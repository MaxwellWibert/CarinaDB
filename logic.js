//parser function will take in a file path to a text document containing elsets, return an array of Satellite objects
var parser = require("./elsetParse.js");
var mysql = require("mysql");
var inquirer = require("inquirer");
var connection;
var data;

connectToDB();

function connectToDB(){
	connection = mysql.createConnection({
	  	host: "localhost",
	 	port: 3306,
		// Your username
		user: "root",
		// Your password
		password: "Sdfjkl3ed",
		database: "carinaDB"
	});

	connection.connect((err) => {
		if(err) throw err
		else{
			console.log("Connected to database");
			flowControl();
		}
	});
}

function flowControl(){
	inquirer.prompt({
		type: "list",
		message: "Choose a command: ",
		choices: ["Import File into Database", "Change Database Structure", "Retrieve Data"],
		name: "flow"
	}).then(response => {
		switch(response.flow){
			case "Import File into Database":
			{
				importFile();
			}
			break;
			case "Change Database Structure":
			{
				alter();
			}
			break;
			case "Retrieve Data":
			{
				retrieve();
			}
		}
	});
}

function importFile(){
	inquirer.prompt({
		type: "input",
		message: "Enter Relative File Path: ",
		name: "path",
		default: "./testElSet.txt"
	}).then(response =>{
		parser(response.path, dumpData);
		console.log("Import complete: " + data.length + " rows inserted");
		flowControl();
	});
}

function alter(){

}

function retrieve(){
	connection.QUERY("SELECT * FROM constellation", (error, results, fields)=>{
		if(error) throw error;
		console.log(fields);
		flowControl();
	});
}

var dumpData = function(load){
	data = load;
	data.forEach(Satellite =>{
	connection.query("INSERT INTO constellation SET ?",
		{
			noradNum: Satellite.noradNum, classifier: Satellite.classifier,
			launchYear: Satellite.launchYear, launchNum: Satellite.launchNum, launchPiece: Satellite.launchPiece,
			bStar: Satellite.BSTAR, 
			inclination: Satellite.inclination, rightAscencion: Satellite.RAAN, argPerigee: Satellite.argPerigee,
			meanAnomaly: Satellite.meanAnomaly, meanMotion: Satellite.motionSeries[0], halfMeanMotionPrime: Satellite.motionSeries[1], sixthMeanMotionDoublePrime: Satellite.motionSeries[2],
			unixEpoch: Satellite.epoch.valueOf()
		},
		(error) =>{
			if(error) throw error;
		});
	});
}