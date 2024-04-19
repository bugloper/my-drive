const express = require("express");
const router = express.Router();
const prisma = require('../../../utils/prisma.client');

router.get("/api/v1/root", async (req, res) => {
  try {
    const rootFolders = await prisma.folder.findMany({
      where: {
        userId: req.userInfo.id,
        parentId: null
      },
    });

    res.status(200).json(rootFolders);
  } catch (error) {
    console.error('Error retrieving folders:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
