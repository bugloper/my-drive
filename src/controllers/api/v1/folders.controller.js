const express = require("express");
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Create a new folder
router.post("/api/v1/folders", async (req, res) => {
  try {
    const createdFolder = await prisma.folder.create({
      data: { userId: req.userInfo.id, ...req.body }
    });
    res.status(201).json(createdFolder);
  } catch (error) {
    console.error('Error creating folder:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update an existing folder
router.put("/api/v1/folders/:id", async (req, res) => {
  const folderId = parseInt(req.params.id);
  try {
    const updatedFolder = await prisma.folder.update({
      where: {
        id: folderId
      },
      data: {
        parentId: req.body.parentId,
        name: req.body.name
      }
    });
    res.status(200).json(updatedFolder);
  } catch (error) {
    console.error('Error updating folder:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get all folders
router.get("/api/v1/folders", async (req, res) => {
  try {
    const folders = await prisma.folder.findMany();
    res.status(200).json(folders);
  } catch (error) {
    console.error('Error retrieving folders:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get children folders inside parent
router.get("/api/v1/folders/:id/children", async (req, res) => {
  const folderID = parseInt(req.params.id);
  try {
    const folder = await prisma.folder.findUnique({
      where: {
        id: folderID
      }
    });

    if (folder) {
      try {
        const childrenFolders = await prisma.folder.findMany({  //Children folders
          where: { parentId: folderID }
        });

        if (childrenFolders.length > 0) { //As findMany will always return an array
          res.status(200).json(childrenFolders);
        } else {
          res.status(404).json({ message: `No Folders inside parent folder with ID ${folderID}` });
        }
      }
      catch (error) {
        console.error('Error retrieving children folders:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    } else {
      res.status(404).json({ message: `Folder with ID ${folderID} does not exist.` })
    }
  } catch (error) {
    console.error('Error retrieving specific folder:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get specific folder by ID
router.get("/api/v1/folders/:id", async (req, res) => {
  const folderId = parseInt(req.params.id);
  try {
    const folder = await prisma.folder.findUnique({
      where: {
        id: folderId
      }
    });

    if (folder) {
      res.status(200).json(folder);
    } else {
      res.status(404).json({ message: `Folder with ID ${folderId} does not exist.` })
    }
  } catch (error) {
    console.error('Error retrieving specific folder:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete a folder by ID
router.delete("/api/v1/folders/:id", async (req, res) => {
  const folderId = parseInt(req.params.id);
  try {
    await prisma.folder.delete({
      where: {
        id: folderId
      }
    });
    res.status(200).json({ message: 'Folder deleted successfully' });
  } catch (error) {
    console.error('Error deleting folder:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Get files inside folder
router.get("/api/v1/folders/:id/files", async (req, res) => {
  const folderID = parseInt(req.params.id);
  try {
    const folder = await prisma.folder.findUnique({
      where: {
        id: folderID
      }
    });

    if (folder) {
      try {
        const files = await prisma.file.findMany({  //Files inside the parent folder
          where: {
            folderId: folderID
          }
        });

        if (files.length > 0) { //As findMany will always return an array
          res.status(200).json(files);
        } else {
          res.status(404).json({ message: `No files inside folder with ID ${folderID}` });
        }
      }
      catch (error) {
        console.error('Error retrieving children files:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    } else {
      res.status(404).json({ message: `Folder with ID ${folderID} does not exist.` })
    }
  } catch (error) {
    console.error('Error retrieving specific folder:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
