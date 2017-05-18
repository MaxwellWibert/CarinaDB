CREATE DATABASE carinaDB;
USE carinaDB;

CREATE TABLE constellation(
	noradNum INTEGER(5) not null,
    classifier VARCHAR(1) not null,
    launchYear INTEGER(4) not null,
    launchNum INTEGER(3) not null,
    launchPiece VARCHAR(3) not null,
    bStar DECIMAL(11,10),
    inclination DECIMAL(11,10) not null,
    rightAscencion DECIMAL(11,10) not null,
    argPerigee DECIMAL(11,10) not null,
    meanAnomaly DECIMAL(11,10) not null,
    meanMotion DECIMAL(13, 10) not null,
    halfMeanMotionPrime DECIMAL(11, 10),
    sixthMeanMotionDoublePrime DECIMAL (11, 10),
    unixEpoch BIGINT not null,
    primary key (noradNum)
);