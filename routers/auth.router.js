const express = require("express");
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const hashPassword = require("../utils/password.hasher");
const bcrypt = require('bcrypt');

// Register a new user
router.post("/register", async (req, res) => {
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


router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (user) {
      // await bcrypt.compare(plainPassword, passwordHash);
      const isPasswordMatch = await bcrypt.compare(password, user.password);

      if (isPasswordMatch) {
        res.cookie("_my_drive_session", `some_random_value-${user.id}`);
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


router.delete('/logout', async (req, res) => {
  try {
      res.clearCookie("login_cookie");
      res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
      res.status(500).json('Internal Server Error');
  }
})

module.exports = router;


// Server/Redis
// const sessionData = {
//   sessionId: userId
// }

const sessionData = {
  "27523ba6-ec91-4fb2-bc0d-76dbf3a61e7d": {
    userId: 1,
    email: 'ny@gmail.com'
  }
}

// 27523ba6-ec91-4fb2-bc0d-76dbf3a61e7d

// 27523ba6-ec91-4fb2-bc0d-76dbf3a61e7d

// query from Redis
// 27523ba6-ec91-4fb2-bc0d-76dbf3a61e7d = {
//   userId: 1,
//   email: 'ny@gmail.com'
// }
