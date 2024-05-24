const mysql = require('mysql2')

/*

CREATE TABLE users (
    deviceId VARCHAR(255) PRIMARY KEY,
    fullName VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    status ENUM('active', 'pending', 'subscription', 'admin'),
    package VARCHAR(255),
    paymentMethod VARCHAR(255),
    transactionId VARCHAR(255),
    expiration INT,
    startedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_deviceId (deviceId),
    UNIQUE KEY unique_phone (phone),
    UNIQUE KEY unique_email (email)
);

*/

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'uflixinf_user_admin_db',
  password: '[{(Hello8920)}]',
  database: 'uflixinf_user_admin_db',
  waitForConnections: true,
  connectionLimit: 1000,
  queueLimit: 1000,
});

connection.connect(error => {
  if (error) throw error;
  console.log("Successfully connected to the database.");
});

module.exports = connection;
