CREATE DATABASE gimep;
USE gimep;

CREATE TABLE user (
    id UNSIGNED INTEGER AUTO_INCREMENT PRIMARY KEY,
    tp UNSIGNED INTEGER NOT NULL,
    team UNSIGNED INTEGER NOT NULL,
    name VARCHAR(255) NOT NULL,
);

CREATE TABLE milestone (
    id UNSIGNED INTEGER AUTO_INCREMENT PRIMARY KEY,
    team UNSIGNED INTEGER NOT NULL,
    reward VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    tp_needed UNSIGNED INTEGER NOT NULL
);

CREATE TABLE team (
    id UNSIGNED INTEGER AUTO_INCREMENT PRIMARY KEY,
    tp UNSIGNED INTEGER NOT NULL,
    pm UNSIGNED INTEGER NOT NULL,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE task(
    id UNSIGNED INTEGER AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    user UNSIGNED INTEGER
);