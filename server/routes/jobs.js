const express = require('express');
const Job = require('../models/Job');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// Create Job
router.post(
    '/',
    [
        body('jobTitle').notEmpty(),
        body('description').notEmpty(),
        body('requirements').notEmpty(),
        body('salary').isNumeric(),
        body('location').notEmpty(),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { jobTitle, description, requirements, salary, location } = req.body;
        const job = new Job({ jobTitle, description, requirements, salary, location });

        try {
            await job.save();
            res.status(201).json(job);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
);

// Get All Jobs
router.get('/', async (req, res) => {
    try {
        const jobs = await Job.find();
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get Job by ID
router.get('/:id', async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) return res.status(404).json({ message: 'Job not found' });
        res.json(job);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update Job
router.put(
    '/:id',
    [
        body('jobTitle').notEmpty(),
        body('description').notEmpty(),
        body('requirements').notEmpty(),
        body('salary').isNumeric(),
        body('location').notEmpty(),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!job) return res.status(404).json({ message: 'Job not found' });
            res.json(job);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
);

// Delete Job
router.delete('/:id', async (req, res) => {
    try {
        const job = await Job.findByIdAndDelete(req.params.id);
        if (!job) return res.status(404).json({ message: 'Job not found' });
        res.json({ message: 'Job deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
