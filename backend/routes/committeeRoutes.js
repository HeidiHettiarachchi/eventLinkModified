const express = require('express');
const {
    createCommittee,
    getAllCommittees,
    getCurrentCommittee,
    getCommitteesByYear,
    getCommitteeById,
    updateCommittee,
    deleteCommittee,
    getCommitteesByOrganizationId,
} = require('../controllers/committeeController');

const router = express.Router();

// Create a new committee
router.post('/', createCommittee);

// Get all committees
router.get('/', getAllCommittees);

// Get current committee (most recent)
router.get('/current', getCurrentCommittee);

// Get committees by year
router.get('/year/:year', getCommitteesByYear);

// Get a specific committee by ID
router.get('/:id', getCommitteeById);

// get committee by organization ID
router.get('/organization/:id', getCommitteesByOrganizationId);

// Update a committee
router.put('/:id', updateCommittee);

// Delete a committee
router.delete('/:id', deleteCommittee);

module.exports = router;