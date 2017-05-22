const pi = Math.PI;
var moment = require("moment");

module.exports = function Satellite(noradNum, classifier, 
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
