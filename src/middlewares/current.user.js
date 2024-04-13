const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const redisClient = require('../utils/redis.client')

const currentUser = async (req, res, next) => {
  if (!req.session || !req.cookies._my_drive_session) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const sessionId = req.cookies._my_drive_session;
  try {
    // Retrieve userInfo from Redis using the sessionId
    const userInfoString = await redisClient.get(sessionId);
    if (!userInfoString) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    // Parse the JSON string to get the userInfo object
    const userInfo = JSON.parse(userInfoString);

    // Attach the userInfo to the request object
    req.userInfo = userInfo;
    next();
  } catch (error) {
    console.error('Error retrieving userInfo from Redis:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

module.exports = currentUser;
