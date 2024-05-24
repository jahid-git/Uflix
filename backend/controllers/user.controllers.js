const connection = require('../db/config.js');

exports.register = async (req, res) => {
    try {
        const { deviceId, fullName, email, phone, password } = req.body;
        const query = "INSERT INTO users (deviceId, fullName, email, phone, password, status, isLogin) VALUES (?, ?, ?, ?, ?, ?, ?)";
        const values = [deviceId, fullName, email, phone, password, 'subscription', true];

        const user = await new Promise((resolve, reject) => {
            connection.query(query, values, (error, results) => {
                if (error) return reject(error);
                resolve();
            });
        });

        res.status(201).json({ deviceId, fullName, email, phone, password, status: 'subscription' });

    } catch (error) {
        console.log("Error in register controller: ", error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(501).json({
                message: "This user already exists!",
            });
        }
        res.status(501).json({
            message: "Internal server error" + error.message
        });
    }
};

exports.login = async (req, res) => {
    try {
        const { phone, password, isLogin } = req.body;
        const query = "SELECT * FROM users WHERE phone = ? AND password = ?";
        const values = [phone, password];

        const user = await new Promise((resolve, reject) => {
            connection.query(query, values, (error, results) => {
                if (error) return reject(error);
                resolve(results[0]);
            });
        });

        if (!user) {
            return res.status(401).json({ message: "Invalid phone number or password" });
        }
        
        if(isLogin){
            const query2 = "UPDATE users SET isLogin = ? WHERE phone = ?";
            const values2 = [true, phone];
            
            await new Promise((resolve, reject) => {
                connection.query(query2, values2, (error, results) => {
                    if (error) return reject(error);
                    resolve();
                });
            });
        }
        
        res.status(200).json(user);

    } catch (error) {
        console.log("Error in login controller: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.subscription = async (req, res) => {
    try {
        const { phone, password, status, packageName, paymentMethod, transactionId, expiration } = req.body;
        const query = "UPDATE users SET status = ?, package = ?, paymentMethod = ?, transactionId = ?, expiration = ?, isLogin = ? WHERE phone = ?";
        const values = [status, packageName, paymentMethod, transactionId, expiration, true, phone];

        await new Promise((resolve, reject) => {
            connection.query(query, values, (error, results) => {
                if (error) return reject(error);
                resolve();
            });
        });

        await exports.login(req, res);
    } catch (error) {
        console.log("Error in subscription controller: ", error);
        res.status(501).json({
            message: "Internal server error"
        });
    }
};



exports.logout = async (req, res) => {
    try {
        const { phone, password } = req.body;
        const query = "UPDATE users SET isLogin = ? WHERE phone = ? AND password = ?";
        const values = [false, phone, password];

        await new Promise((resolve, reject) => {
            connection.query(query, values, (error, results) => {
                if (error) return reject(error);
                resolve();
            });
        });
        
        res.status(201).json({
            message: "Logout successful"
        });
        
    } catch (error) {
        console.log("Error in logout controller: ", error);
        res.status(501).json({
            message: "Internal server error"
        });
    }
};


exports.getAllUsers = async (req, res) => {
    try {
        const { phone, password } = req.body;
        const queryAdmin = "SELECT * FROM users WHERE phone = ? AND password = ?";
        const valuesAdmin = [phone, password];

        const admin = await new Promise((resolve, reject) => {
            connection.query(queryAdmin, valuesAdmin, (error, results) => {
                if (error) return reject(error);
                resolve(results[0]);
            });
        });

        if (!admin) {
            return res.status(401).json({ message: "Invalid phone number or password" });
        }
        
        const query = "SELECT * FROM users ORDER BY startedAt DESC";
        
        const users = await new Promise((resolve, reject) => {
            connection.query(query, (error, results) => {
                if (error) return reject(error);
                resolve(results);
            });
        });

        res.status(200).json(users);

    } catch (error) {
        console.log("Error in getAllUsers controller: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


exports.updateUser = async (req, res) => {
    try {
        const { phone, password } = req.body;
        
        const updates = {
            fullName: req.body.fullName,
            email: req.body.email,
            status: req.body.status,
            packageName: req.body.package,
            paymentMethod: req.body.paymentMethod,
            transactionId: req.body.transactionId,
            expiration: req.body.expiration,
            isLogin: req.body.isLogin,
            startedAt: req.body.startedAt,
            createdAt: req.body.createdAt
        };


        const query = "UPDATE users SET fullName = ?, email = ?, status = ?, package = ?, paymentMethod = ?, transactionId = ?, expiration = ?, startedAt = ?, createdAt = ? , isLogin = ? WHERE phone = ? AND password = ?";
        const values = [updates.fullName, updates.email, updates.status, updates.packageName, updates.paymentMethod, updates.transactionId, updates.expiration, updates.startedAt, updates.createdAt, updates.isLogin, phone, password];

        await new Promise((resolve, reject) => {
            connection.query(query, values, (error, results) => {
                if (error) {
                    console.log("Error in updateUserRoute: ", error);
                    return res.status(500).json({ message: "Internal server error" });
                }
                res.status(200).json({ message: "User information updated successfully" });
                resolve();
            });
        });
    } catch (error) {
        console.log("Error in updateUser: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
};




