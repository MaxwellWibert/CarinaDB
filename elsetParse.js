var fs = require("fs");
var Satellite = require("./Satellite.js");

//regular expression finds matches for "two line element set" (aka "elSet", a standard format of storing data on satellites and orbital debris, or space junk)
//then parses this data using parenthetical match groups, which are accessible from the return of regexp.prototype.exec()
//see bottom of page for documentation on the order and meaning of the match groups described in the regexp
var elsetExp= /1 ([\d ]{5})([US]) *(\d{2})(\d{3})([A-Za-z ]{0,3}) *(\d{2})(\d{3})(\.[\d ]{8}) *([\+\- ]\.[\d ]{8}) ?([\+\- ][\d ]{5}[\+\-]?[\d ]) ([\+\- ][\d ]{5}[\+\-]?[\d ]) \d [\d ]{5} *\r?\n? *2 [\d ]{5} ([\d ]{3}\.[\d ]{4}) ([\d ]{3}\.[\d ]{4}) ([\d ]{7}) ([\d ]{3}\.[\d ]{4}) ([\d ]{3}\.[\d ]{4}) ([\d ]{2}\.[\d ]{8})([\d ]{5})/g;
//global variable stores match groups for one elSet while parsed data is processed into more accessible forms
var match;
//array will be populated by one satellite or one piece of space junk for every elset in the input document.
var satellites = [];

var parser = function(filePath, callback){
	fs.readFile(filePath, 'utf8', (err, data) =>{
	if(err) throw err;
	while((match = elsetExp.exec(data))!== null){
		satellites.push(new Satellite(match[1], match[2],
			match[3], match[4], match[5],
			match[6], match[7], match[8],
			match[9], match[10], match[11],
			match[12], match[13], match[14], match[15], match[16], match[17],
			match[18]));
	}
	console.log("Document parsing complete. " + satellites.length + " matches found");
	
	callback(satellites);
	});
}

module.exports = parser;

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
//[18]-Revolution number at epoch--literally the number of full orbits complete since launch the epoch time described by [6] and [7]s