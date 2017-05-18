var fs = require("fs");
var moment = require("moment")
//regular expression finds matches for "two line element set" (aka "elSet", a standard format of storing data on satellites and orbital debris, or space junk)
//then parses this data using parenthetical match groups, which are accessible from the return of regexp.prototype.exec()
//see bottom of page for documentation on the order and meaning of the match groups described in the regexp
var elsetExp= /1 ([\d ]{5})([US]) *(\d{2})(\d{3})([A-Za-z ]{0,3}) *(\d{2})(\d{3})(\.[\d ]{8}) *([\+\- ]\.[\d ]{8}) ?([\+\- ][\d ]{5}[\+\-]?[\d ]) ([\+\- ][\d ]{5}[\+\-]?[\d ]) \d [\d ]{5} *\r?\n? *2 [\d ]{5} ([\d ]{3}\.[\d ]{4}) ([\d ]{3}\.[\d ]{4}) ([\d ]{7}) ([\d ]{3}\.[\d ]{4}) ([\d ]{3}\.[\d ]{4}) ([\d ]{2}\.[\d ]{8})([\d ]{5})/g;
//global variable stores match groups for one elSet while parsed data is processed into more accessible forms
var match;
//array will be populated by one satellite or one piece of space junk for every elset in the input document.
var satsAndJunk = [];
const pi = Math.PI;

var parser = function(filePath, callback){
	fs.readFile(filePath, 'utf8', (err, data) =>{
	if(err) throw err;
	while((match = elsetExp.exec(data))!== null){
		satsAndJunk.push(new Satellite(match[1], match[2],
			match[3], match[4], match[5],
			match[6], match[7], match[8],
			match[9], match[10], match[11],
			match[12], match[13], match[14], match[15], match[16], match[17],
			match[18]));
	}
	console.log("Document parsing complete. " + satsAndJunk.length + " matches found");
	
	callback(satsAndJunk);
	});
}
//constructor processes all relevant parsed stringified data from a single elSet into easily accessible qualitative and quantitative data
function Satellite(noradNum, classifier, 
	launchYear, launchNum, launchPiece, 
	epochYear, epochDay, epochFractionalDay, 
	halfMMPrime, sixthMMDoublePrime, BSTAR, 
	inclination, RAAN, eccentricity, argPerigee, meanAnomaly, meanMotion,
	revNum){
	//classifier info
	this.noradNum = parseInt(noradNum.trim());
	this.classifier = classifier.trim();
	//launch info
	this.launchYear = parseInt(yearConverter(launchYear.trim()));
	this.launchNum = parseInt(launchNum.trim());
	this.launchPiece = launchPiece.trim();
	this.BSTAR = parsePowerNotation(BSTAR);
	//angles converted from degrees to radians, which are much easier for calculations later on, when it is time to graphically display data
	this.inclination = degreesToRadians(parseFloat(inclination.trim()));
	this.RAAN = degreesToRadians(parseFloat(RAAN.trim()));
	this.argPerigee = degreesToRadians(parseFloat(argPerigee.trim()));
	this.meanAnomaly = degreesToRadians(parseFloat(meanAnomaly.trim()));
	//these angles are in rotations, so they require a different conversion factor to radians
	this.motionSeries = [rotesToRadians(parseFloat(meanMotion.trim())), rotesToRadians(parseFloat(halfMMPrime.trim())), rotesToRadians(parsePowerNotation(sixthMMDoublePrime))];
	this.eccentricity = eccentricityConverter(eccentricity);
	this.epoch = epochConverter(epochYear, epochDay, epochFractionalDay);
	let that = this;
	this.display = function(){
		console.log(JSON.stringify(that, null, 3));
	}

	console.log("constructor successful for satellite " +  this.noradNum);
}

//takes in strings for BSTAR drag coefficient or second derivative of mean motion (over 6), outputs a sensible decimal. See match array terms [9] and [10] for string format details
//[\+\- ][\d ]{5}[\+\-]?[\d ] associated match group with format
//+30197-6 example input
function parsePowerNotation(wonkyString){
	let string = wonkyString.trim();
	let sliceIndex;
	//if there is a plus or minus before the power be sure to include it into the power string
	if(string.lastIndexOf("+")>0 || string.lastIndexOf("-")>0){
		sliceIndex = -2;
	}else{
		sliceIndex = -1;
	}
	let sigString = string.slice(0, sliceIndex);
	let powString = string.slice(sliceIndex);
	let sigArray = sigString.split("");
	//must add "0." before all digits, but after + or -, if either symbol is present before the digits
	if(sigArray[0] === "+" || sigArray[0] === "-"){
		sigArray.splice(1,0, "0", ".");
	}else{
		sigArray.splice(0,0, "0", ".");
	}
	let significand = parseFloat(sigArray.join(""));
	let power = parseInt(powString);
	let decimal = significand * Math.pow(10, power);
	return decimal;
}

//standard trig conversion functions come in handy
function degreesToRadians(degrees){
	return degrees*pi/180;
}

function radiansToDegrees(radians){
	return radians*180/pi;
}

function rotesToRadians(rotations){
	return rotations*2*pi;
}

function radiansToRotes(radians){
	return radians/(2*pi);
}

function eccentricityConverter(string){
	eccentricityString = "0." + string;
	eccentricity = parseFloat(eccentricityString);
	return eccentricity;
}

//takes string forms of year, day, and fractional day, returns Moment object
function epochConverter(epochYear, epochDay, epochFractionalDay){
	let fractional = parseFloat(epochFractionalDay);
	let fractionalHours = fractional*24;
	let hours = Math.floor(fractionalHours);
	fractional = fractionalHours - hours;
	let fractionalMinutes = fractional * 60;
	let minutes = Math.floor(fractionalMinutes);
	fractional = fractionalMinutes - minutes;
	let fractionalSeconds = fractional*60;
	let seconds = Math.floor(fractionalSeconds);
	fractional = fractionalSeconds - seconds;
	let fractionalMilliseconds = fractional*1000;
	let milliseconds = Math.floor(fractionalMilliseconds);
	epoch = new moment(epochYear + "-" + epochDay + "-" + hours + "-" + minutes + "-" + seconds + "-" + milliseconds,"YYYY-DDD-H-m-s-S");
	return epoch;
}

//takes two digits string, returns most likely year as a 4 digit string
function yearConverter(twoDigitString){
	let twoDigitNum = parseInt(twoDigitString.trim());
	let fourDigitString;
	if(twoDigitNum <= 50){
		fourDigitString = "20" + twoDigitString;
	}else{
		fourDigitString = "19" + twoDigitString;
	}
	return fourDigitString;
}

//match array terms:
//[1]-NORAD number, used as a unique ID for individual satellite or piece of space junk, 
//[2]-Elset classification U for Unclassified, C for classified, S for secret
//[3]-last two digits of launch year
//[4]-Launch number
//[5]-Launch piece: A is primary payload, B secondary, C tertiary, etc. After Z, we have AA, AB, AC, ... BA BB, BC... etc. Two digits or more suggests space junk, not valuable.
//[6]-last two digits of epoch year
//[7]-epoch--day of the year
//[8]-epoch--fractional day, just a decimal fraction of a single day
//[9]-first derivative of mean motion over two in revolutions/day/day-- used in taylor series for motion equations
//[10]-second derivative of mean motion over 6 in revolutions/day/day/day-- used in taylor series ... (+-)12345(+-)6 means (+-)0.12345 * 10 ^((+-)6)
//[11]-BSTAR drag term in inverse Earth radii. multiply by speed squared times air density over reference (0.157kg/meter squared/Earth radius) density to get acceleration due to drag
//[12]-Inclination in degrees--angle between orbital plane and equatorial plane. Always between 0 and 180. 0 is equatorial prograde, 0.00..1-89.99.. indicates prograde, 90 is polar, 90.0...1-179.99 is retrograde, 180 is equatorial retrograde
//[13]-Right Ascenscion of Ascending Node (RAAN) in degrees-- Longitude of intersection between equatorial plane and northbound path (aka ascending node)-- can range from 0 - 360-- COMPLETELY MEANINGLESS IF INCLINATION = 0 OR 180
//[14]-Eccentricity--dimensionless quantity determines shape of orbit. format: 0007976 means 0.0007976. Values range from 0 to 1, with 0 being perfectly circular, 1 being parabolic escape trajectory, and values in between being elliptical
//[15]-Argument of perigee in degrees--angle from ascending node to perigee, where orbit is closest to earth, measured inside orbit plane along the path of the orbit.
//[16]-Mean Anomaly in degrees--basically think of it as what percentage of the current orbit is complete, only instead of 0-100, measured from 0-360 degrees.
//[17]-Mean Motion in revolutions per day-- literally the number of orbits completed in a day
//[18]-Revolution number at epoch--literally the number of full orbits complete since launch the epoch time described by [6] and [7]


module.exports = parser;