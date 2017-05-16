//parser function will take in a file path to a text document containing elsets, return an array of Satellite objects
var parser = require("./elsetParse.js");
var mysql = require("mysql");
var inquirer = require("inquirer");
var connection;

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
		
	});
}