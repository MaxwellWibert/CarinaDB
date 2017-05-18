//parser function will take in a file path to a text document containing elsets, return an array of Satellite objects
var parser = require("./elsetParse.js");
var mysql = require("mysql");
var inquirer = require("inquirer");
var table;
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
		choices: ["Import File into Database", "Change Database Structure", "Retrieve Data", "Quit"],
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
			break;
			case "Quit":
			{
				quitScript();
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
		flowControl();
	});
}

function alter(){
	inquirer.prompt({
		type: "list",
		message: "What would you like to add to the table?",
		choices: ["Delta V Budget", "Perigee and Apogee radii", "Lattitude and Longitude", "Altitude"],
		name: "attribute"
	}).then(response => {
		switch(response.attribute){
			case "Delta V Budget":{
				connection.query("ALTER TABLE constellation ADD deltaV DECIMAL(13,11)", err =>{
					if(err) console.log("Delta V Budget already exists on the table");
				});
			}
			break;
			case "Perigee and Apogee radii":{
				connection.query("ALTER TABLE constellation ADD periR DECIMAL(18,11)", err =>{
					if(err) console.log("Perigee radius already exists on the table");
				});
				connection.query("ALTER TABLE constellation ADD apoR DECIMAL(18,11)", err =>{
					if(err) console.log("Apogee radius already exists on the table");
				});
			} 
			break;
			case "Lattitude and Longitude":{
				connection.query("ALTER TABLE constellation ADD lat DECIMAL(18,11)", err =>{
					if(err) console.log("Lattitude already exists on the table");
				});
				connection.query("ALTER TABLE constellation ADD longitude DECIMAL(18,11)", err =>{
					if(err) console.log("Longitude already exists on the table");
				});
			}
			break;
			case "Altitude":{
				connection.query("ALTER TABLE constellation ADD altitude DECIMAL(18,11)", err =>{
					if(err) console.log("Altitude already exists on the table");
				});
			}
		}
		flowControl();
	});
}

function retrieve(){
	inquirer.prompt([
		{
			type: "input",
			message: "What parameter would you like to search with?",
			name: "param",
			default: "inclination"
		},
		{
			type: "input",
			message: "Enter the lower limit of this search parameter",
			name: "lower",
			default: "0"
		},
		{
			type: "input",
			message: "Enter the upper limit of this search parameter",
			name: "upper",
			default: "1"
		}
	]).then(response => {
		connection.query("SELECT * FROM constellation WHERE ?? >= ? AND ?? <= ?", 
			[response.param, response.lower, response.param, response.upper],
			(error, results, fields)=>{
			if(error) throw error;
			console.log(results);
			flowControl();
		});
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
			unixEpoch: parseInt(Satellite.epoch.valueOf())
		},
		(error) =>{
			if(error) console.log("NORAD data collision at " + Satellite.noradNum);
		});
	});
}

function quitScript(){
	console.log("Connection Ending...");
	connection.end(err =>{
		if(err) throw err;
		console.log("Scripts Terminated");
	});
}