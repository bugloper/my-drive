const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

//CRUD operations for files


//Post /files
router.post('/api/v1/files', async (req, res) => {
    try {
        const createdFile = await prisma.file.create({
            data: { ...req.body }
        });
        res.status(201).json({
            msg: "File creation successful",
            data: createdFile
        });
    }
    catch (error) {
        console.error('Error creating file:', error);
        res.status(500).json({ error: error.message });
    }
})

//Put /files
router.put('/api/v1/files/:id', async (req, res) => {
    const fileId = parseInt(req.params.id)
    try {
        const updatedFile = await prisma.file.update({
            where: {
                id: fileId
            },
            data: {
                ...req.body
            }
        });
        res.status(200).json(updatedFile)
    } catch (error) {
        console.error('Error updating file:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

//Get /files
router.get('/api/v1/files', async (req, res) => {
    try {
        const file = await prisma.file.findMany();
        res.status(200).json(file)
    } catch (error) {
        console.error('Error getting file:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }

})

//Get specific /files
router.get('/api/v1/files/:id', async (req, res) => {
    const fileId = parseInt(req.params.id);
    try {
        const specificFile = await prisma.file.findUnique({
            where: {
                id: fileId
            }
        })
        if (specificFile) {
            res.status(200).json(specificFile);
        } else {
            res.status(404).json({ message: `Folder with ID ${fileId} does not exist.` })
        }
    } catch (error) {
        console.error('Error retrieving specific file:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

//Delete /files
router.delete("/api/v1/files/:id", async (req, res) => {
    const fileId = parseInt(req.params.id);
    try {
        await prisma.file.delete({
            where: {
                id: fileId
            }
        });
        res.status(200).json({ message: 'Folder deleted successfully' });
    } catch (error) {
        console.error('Error deleting file:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;