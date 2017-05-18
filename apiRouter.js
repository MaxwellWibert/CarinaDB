var express = require("express");
var mysql = require("mysql");

var app = express();

var port = process.env.port || 3000;

var connection = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "Sdfjkl3ed",
	database: "carinaDB"
});

connection.connect(err=>{
	if(err){
		console.error("error connecting: " + err.stack);
		return;
	}
	console.log("connected as id " + connection.threadId);
});

app.get("/all", (req, res) =>{
	connection.query("SELECT * FROM constellation ORDER BY unixEpoch DESC", (err, result)=>{
		if(err) console.log(err);
		var html = "<h1> Satellites: </h1>";

		html += "<ul>";

		for (var i = 0; i< result.length; i++){
			html+= `<li><p> NORAD ID: ${result[i].noradNum}</p>`;
			html+= `<p> Classifier: ${result[i].classifier}</p>`;
			html+= `<p> Launch Year: ${result[i].launchYear}</p>`;
			html+= `<p> Launch Number: ${result[i].launchNum}</p>`;
			html+= `<p> Launch Piece: ${result[i].launchPiece}</p>`;
			html+= `<p> B* Drag Coefficient: ${result[i].bStar}</p>`;
			html+= `<p> Inclination: ${result[i].inclination}</p>`;
			html+= `<p> RAAN: ${result[i].rightAscencion}</p>`;
			html+= `<p> Argument of Perigee: ${result[i].argPerigee}`;
			html+= `<p> Mean Anomaly: ${result[i].meanAnomaly}</p>`;
			html+= `<p> Mean Motion: ${result[i].meanMotion}</p>`;
			html+= `<p> Mean Motion Prime: ${2*result[i].halfMeanMotionPrime}</p>`;
			html+= `<p> Mean Motion Double Prime: ${6*result[i].sixthMeanMotionDoublePrime}</p>`;
			html+= `<p> Epoch Unix Time (milliseconds): ${result[i].unixEpoch}</p></li>`;
		}

		html += "</ul>";

		return res.send(html);

	});
});

app.get("/:element/:lowerLimit/:upperLimit", (req, res) =>{
	let element = req.params.element;
	let lower = req.params.lowerLimit;
	let upper = req.params.upperLimit

	connection.query("SELECT * FROM constellation WHERE ?? >= ? AND ?? <= ? ORDER BY unixEpoch DESC", [element, lower, element, upper], (err, result) =>{
		if(err) console.log(err);
				if(err) console.log(err);
		var html = "<h1> Satellites: </h1>";

		html += "<ul>";

		for (var i = 0; i< result.length; i++){
			html+= `<li><p> NORAD ID: ${result[i].noradNum}</p>`;
			html+= `<p> Classifier: ${result[i].classifier}</p>`;
			html+= `<p> Launch Year: ${result[i].launchYear}</p>`;
			html+= `<p> Launch Number: ${result[i].launchNum}</p>`;
			html+= `<p> Launch Piece: ${result[i].launchPiece}</p>`;
			html+= `<p> B* Drag Coefficient: ${result[i].bStar}</p>`;
			html+= `<p> Inclination: ${result[i].inclination}</p>`;
			html+= `<p> RAAN: ${result[i].rightAscencion}</p>`;
			html+= `<p> Argument of Perigee: ${result[i].argPerigee}`;
			html+= `<p> Mean Anomaly: ${result[i].meanAnomaly}</p>`;
			html+= `<p> Mean Motion: ${result[i].meanMotion}</p>`;
			html+= `<p> Mean Motion Prime: ${2*result[i].halfMeanMotionPrime}</p>`;
			html+= `<p> Mean Motion Double Prime: ${6*result[i].sixthMeanMotionDoublePrime}</p>`;
			html+= `<p> Epoch Unix Time (milliseconds): ${result[i].unixEpoch}</p></li>`;
		}

		html += "</ul>";

		return res.send(html);

	});
});

app.listen(port)