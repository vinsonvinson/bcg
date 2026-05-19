const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { hashPassword, comparePassword } = require("../utils/password");

const AuthController = {
    async login(req, res) {
        try {
            const { username, password } = req.body;

            if (!username || !password) {
                return res
                    .status(400)
                    .json({ error: "Username and password are required" });
            }

            const user = await User.getByUsername(username);

            if (!user) {
                return res.status(401).json({ error: "Invalid credentials" });
            }

            const passwordMatch = await comparePassword(
                password,
                user.password,
            );
            console.log(passwordMatch);

            if (!passwordMatch) {
                return res.status(401).json({ error: "Invalid credentials" });
            }

            const token = jwt.sign(
                { id: user.id, username: user.username, role: user.role },
                process.env.JWT_SECRET || "your_jwt_secret_key_here",
                { expiresIn: "24h" },
            );

            res.json({
                message: "Login successful",
                token,
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    full_name: user.full_name,
                    role: user.role,
                },
            });
        } catch (error) {
            console.error("Login error:", error);
            res.status(500).json({ error: "Login failed" });
        }
    },

    logout(req, res) {
        res.json({ message: "Logout successful" });
    },

    async register(req, res) {
        try {
            const { username, password, email, full_name, role } = req.body;

            if (!username || !password || !email) {
                return res.status(400).json({
                    error: "Username, password, and email are required",
                });
            }

            const existingUser = await User.getByUsername(username);
            if (existingUser) {
                return res
                    .status(400)
                    .json({ error: "Username already exists" });
            }

            const hashedPassword = await hashPassword(password);

            const userId = await User.create({
                username,
                password: hashedPassword,
                email,
                full_name: full_name || "",
                role: role || "analyst",
            });

            res.status(201).json({
                message: "User registered successfully",
                userId,
            });
        } catch (error) {
            console.error("Registration error:", error);
            res.status(500).json({ error: "Registration failed" });
        }
    },
};

module.exports = AuthController;
