DROP DATABASE IF EXISTS blog_db;

CREATE DATABASE blog_db;

USE blog_db;

CREATE TABLE User (
    id INT NOT NULL AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL,
    password VARCHAR(6) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE Post (
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(50) NOT NULL,
    Post_text VARCHAR(255) NOT NULL,
    User_id INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (User_id) REFERENCES User(id)
);

CREATE TABLE Comment (
    id INT NOT NULL AUTO_INCREMENT,
    comment_text VARCHAR(255) NOT NULL,
    User_id INT NOT NULL,
    Post_id INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (User_id) REFERENCES User(id),
    FOREIGN KEY (Post_id) REFERENCES Post(id)
);

