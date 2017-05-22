# CarinaDB
App will pull data on Earth satellites and space junk from online resource in document form, parse with regex into orbital element components, and load components into a SQL database


____________________________________
For mySQL Assignment.
------------------------------------
Open schema.sql in mySQL workbench and run the script. This will set up the database with the absolute bare minimum amount of information we use to track orbital data on satellites and space junk. This includes noradNum, classifier, launchYear, launchNum, launchPiece, BStar, inclination, rightAscension, argPerigee, meanAnomaly, meanMotion, halfMeanMotionPrime, sixthMeanMotionDoublePrime, and unixEpoch. Below is a brief explanation of each of these components, and a screenshot of the schema and sql logs from mysql workbench.
------------------------------------
noradNum - a unique ID number given to each individual tracked item in orbit, whether satellite or space junk.

classifier - a legal classification. U for unclassified, S for secret, C for classified

launchYear - last two digits of the year the item entered orbit.

launchNum - describes how many launches came before this piece during that year.

launchPiece - describes how important this piece is. A for primary payload, then B, C, D, ..., Z, AA, AB, ..., AZ, BC, ... , ZZ, AAA, ..., in 
descending order of importance. 

bStar - Describes how much drag this piece experiences at any given altitude. Fatter, flatter pieces with more drag have higher BStar.

inclination: Angle between equatorial plane and orbital plane, presented here in radians for convenience of calculation. 0 means the orbit is in the equatorial plane and moving in the same direction as earth's rotation. pi/2 (aka 90 degrees) means the orbit moves over the north pole, and pi (aka 180 degrees) means that the orbit is in the equatorial plane moving in the opposite direction of earth's rotation.

rightAscension - longitude (in radians) of the point where the orbit crosses the equatorial plane from south to north (aka the ascending node).

argPerigee - describes the location of the point where the orbit is closest to the earth (called perigee), as an angle (in radians) relative to ascending node. 

meanAnomaly - basically describes what percentage of one orbit is complete, measured in time, written as an angle in radians. 0 means that the satellite is at the closest point to the earth (perigee), pi means that the satellite is at the farthest point to the earth (apogee).

meanMotion: Describes the angle travelled by the satellite in one full day. This is the average speed of the satellite and also describes how close the satellite is to earth.

halfMeanMotionPrime: mean motion prime is the change in mean motion that occurs due to gravity influences like the moon, jupiter, or the slight oblateness of earth. We use half of this value to calculate a taylor series--a very useful formula to describe the long term behavior of the satellite. Large values indicate a rapidly decaying orbit or an active orbital maneuver.

sixthMeanMotionDoublePrime: Also used in the taylor series described above. nonzero values indicate a decaying orbit or orbital maneuver

unixEpoch: The number of milliseconds since 1970 at epoch (the time at which these measurements were made.)

![Screenshot of schema.sql + mySQL logs]
(./screenshots/schema.png)

------------------------------------
Open a console or bash window and navigate to the root direcotry of CarinaDB.
Once in the root directory, enter "node console.js" and hit enter.
The console will prompt you to enter the password associated with their database.

![Screenshot of password screen]
(./screenshots/console-password.png)

If successfully connected to database, the console will allow the use to enter the main flow of the program, and prompt you for a command.

![Screenshot of command prompt]
(./screenshots/console-flow.png)

If this is the first time you're running the console in this app, it is best to load some data into the database. Select "Import File into Database" and hit enter. The app will then prompt you for a relative file path. Either insert your own file path, or hit enter to load in the default document that comes with this program, "testElSet.txt". The program will import my regex powered module "elsetParse.js" and use this module to parse the document, and construct an array of Satellite objects. If the import is successful, you should see something like this: 

![Screenshot of successful import]
(./console-imported.png)

Now it makes sense to alter the structure of the database. Scroll down to the "Change database structure"

![Screenshot of next command]
(./screenshots/console-alter.png)

Choose a column to insert into the table. Here we choose Delta V Budget, which describes how much the ship can accelerate with its current fuel capacity and weight.

If the alteration is successful, you should see this:

![Alteration Success]
(./screenshots/console-alter-success.png)

Otherwise, you've likely already added the column to the table, in which case, you should probably see this:

![Alteration Failure]
(./screenshots/console-alter-failure.png)

Lastly, we may want to display some data on the console. In this case scroll down to "Retrieve Data". Enter a search parameter, as well as limits on that parameter. Entering nothing will provide the program with a default parameter of inclination and default search range of 0 to 1 radians. The response will display an array of all satellite objects in the range of values specified. 

![Retrieve data]
(./screenshots/console-retrieve.png)

When you're good and satisfied, close the program by scrolling down to the Quit command and hitting enter.