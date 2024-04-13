const express = require("express");
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const hashPassword = require("../../../utils/password.hasher");
const bcrypt = require('bcrypt');
const session = require('express-session');
const secureRandom = require('../../../utils/secure.random')
// Middlewares
router.use(session({
  secret: 'very-secure-secret', // a secret string used to sign the session ID cookie
  resave: false, // don't save session if unmodified
  saveUninitialized: false, // don't create session until something stored
}));

const redisClient = require('../../../utils/redis.client')

// Register a new user
router.post("/api/v1/register", async (req, res) => {
  console.log("req.demo", req.demo)
  try { 
    // Grab email, name, password from req.body
    const { email, name, password } = req.body;
    // Hash password
    const hashedPassword = await hashPassword(password);

    const createdUser = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });

    res.status(201).json(createdUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

router.post("/api/v1/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (user) {
      // await bcrypt.compare(plainPassword, passwordHash);
      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (isPasswordMatch) {
        const userInfo = {
          id: user.id,
          email: user.email
        }
        const sessionId = secureRandom.randomString();
        res.cookie("_my_drive_session", sessionId);
        try {
          await redisClient.setEx(sessionId, 3600, JSON.stringify(userInfo)); // Caching in Redis
          console.log("Redis setEx successful");
        } catch (redisError) {
          console.error("Redis setEx error:", redisError);
        }
        res.status(200).json({ message: "Login successful", user });
      } else {
        res.status(401).json({ error: "Invalid email or password" });
      }
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

router.delete('/api/v1/logout', async (req, res) => {
  try {
    res.clearCookie("login_cookie");
    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    res.status(500).json('Internal Server Error');
  }
})

module.exports = router;
