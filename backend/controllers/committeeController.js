const Committee = require('../models/Committee'); // Assuming you have a Committee model defined in models/Committee.js

// Validation function for committee data
const validateCommitteeData = (data) => {
  const errors = [];
  
  // Term and year validations
  if (!data.term) errors.push("Term is required");
  if (!data.year) {
    errors.push("Year is required");
  } else if (isNaN(data.year) || data.year < 1900 || data.year > new Date().getFullYear() + 1) {
    errors.push("Year must be a valid number between 1900 and next year");
  }
  
  // High ranking members validation
  const highRankingRoles = ['president', 'vicePresident', 'secretary', 'assistantSecretary', 'treasurer'];
  
  highRankingRoles.forEach(role => {
    if (!data[role]) {
      errors.push(`${role.charAt(0).toUpperCase() + role.slice(1)} information is required`);
      return;
    }
    
    // Check required fields for each high ranking member
    if (!data[role].name) errors.push(`${role.charAt(0).toUpperCase() + role.slice(1)} name is required`);
    
    if (!data[role].email) {
      errors.push(`${role.charAt(0).toUpperCase() + role.slice(1)} email is required`);
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data[role].email)) {
      errors.push(`${role.charAt(0).toUpperCase() + role.slice(1)} email format is invalid`);
    }
    
    if (!data[role].phone) {
      errors.push(`${role.charAt(0).toUpperCase() + role.slice(1)} phone is required`);
    } else if (!/^[0-9+\-() ]{7,15}$/.test(data[role].phone)) {
      errors.push(`${role.charAt(0).toUpperCase() + role.slice(1)} phone format is invalid`);
    }
  });
  
  // Members validation
  if (data.members && Array.isArray(data.members)) {
    data.members.forEach((member, index) => {
      if (!member.name) errors.push(`Member ${index + 1}: Name is required`);
      if (!member.role) errors.push(`Member ${index + 1}: Role is required`);
      
      if (!member.email) {
        errors.push(`Member ${index + 1}: Email is required`);
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(member.email)) {
        errors.push(`Member ${index + 1}: Email format is invalid`);
      }
      
      if (!member.phone) {
        errors.push(`Member ${index + 1}: Phone number is required`);
      } else if (!/^[0-9+\-() ]{7,15}$/.test(member.phone)) {
        errors.push(`Member ${index + 1}: Phone format is invalid`);
      }
    });
  }
  
  return errors;
};

// Create a new committee
const createCommittee = async (req, res) => {
  try {
    // Validate the committee data
    const validationErrors = validateCommitteeData(req.body);
    
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        errors: validationErrors,
        message: 'Validation failed'
      });
    }
    
    // Check if committee with same term and year already exists
    const existingCommittee = await Committee.findOne({
      term: req.body.term,
      year: req.body.year
    });
    
    if (existingCommittee) {
      return res.status(400).json({
        success: false,
        message: `A committee for ${req.body.term} ${req.body.year} already exists`
      });
    }
    
    const newCommittee = new Committee(req.body);
    const savedCommittee = await newCommittee.save();
    
    res.status(201).json({
      success: true,
      data: savedCommittee,
      message: 'Committee created successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Get all committees
const getAllCommittees = async (req, res) => {
  try {
    const committees = await Committee.find().sort({ year: -1, term: 1 });
    res.status(200).json({
      success: true,
      count: committees.length,
      data: committees
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get a specific committee by ID
const getCommitteeById = async (req, res) => {
  try {
    const committee = await Committee.findById(req.params.id);
    
    if (!committee) {
      return res.status(404).json({
        success: false,
        message: 'Committee not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: committee
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update a committee
const updateCommittee = async (req, res) => {
  try {
    // First check if the committee exists
    const committee = await Committee.findById(req.params.id);
    
    if (!committee) {
      return res.status(404).json({
        success: false,
        message: 'Committee not found'
      });
    }
    
    // Validate the committee data
    const validationErrors = validateCommitteeData(req.body);
    
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        errors: validationErrors,
        message: 'Validation failed'
      });
    }
    
    // Check if the updated term+year combo would conflict with another committee
    if (req.body.term && req.body.year) {
      const conflictCommittee = await Committee.findOne({
        _id: { $ne: req.params.id }, // Not the current committee
        term: req.body.term,
        year: req.body.year
      });
      
      if (conflictCommittee) {
        return res.status(400).json({
          success: false,
          message: `Another committee for ${req.body.term} ${req.body.year} already exists`
        });
      }
    }
    
    const updatedCommittee = await Committee.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    res.status(200).json({
      success: true,
      data: updatedCommittee,
      message: 'Committee updated successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Delete a committee
const deleteCommittee = async (req, res) => {
  try {
    const deletedCommittee = await Committee.findByIdAndDelete(req.params.id);
    
    if (!deletedCommittee) {
      return res.status(404).json({
        success: false,
        message: 'Committee not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Committee deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get the current committee (most recent by year)
const getCurrentCommittee = async (req, res) => {
  try {
    const currentCommittee = await Committee.findOne()
      .sort({ year: -1, createdAt: -1 })
      .limit(1);
    
    if (!currentCommittee) {
      return res.status(404).json({
        success: false,
        message: 'No committee found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: currentCommittee
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get committees by year
const getCommitteesByYear = async (req, res) => {
  try {
    const { year } = req.params;
    
    // Validate year parameter
    if (isNaN(year) || parseInt(year) < 1900 || parseInt(year) > new Date().getFullYear() + 1) {
      return res.status(400).json({
        success: false,
        message: 'Invalid year parameter'
      });
    }
    
    const committees = await Committee.find({ year: parseInt(year) }).sort({ term: 1 });
    
    res.status(200).json({
      success: true,
      count: committees.length,
      data: committees
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get committees by organization ID
const getCommitteesByOrganizationId = async (req, res) => {
  try {
    const { id } = req.params;
    
    const committees = await Committee.find({ organizationId: id }).sort({ year: -1, term: 1 });
    
    res.status(200).json({
      success: true,
      count: committees.length,
      data: committees
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Export the controller functions
module.exports = {
  createCommittee,
  getAllCommittees,
  getCommitteeById,
  updateCommittee,
  deleteCommittee,
  getCurrentCommittee,
  getCommitteesByYear,
  getCommitteesByOrganizationId
};