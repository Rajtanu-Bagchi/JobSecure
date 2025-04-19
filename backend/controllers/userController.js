const User = require('../models/User');
const Job = require('../models/Job');

// @desc    Get all users
// @route   GET /api/users
// @access  Private (Admin only)
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();

    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: `User not found with id of ${req.params.id}`
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    // Fields to update
    const fieldsToUpdate = {
      name: req.body.name
    };

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get user's jobs (posted by employer or applied by freelancer)
// @route   GET /api/users/jobs
// @access  Private
exports.getUserJobs = async (req, res) => {
  try {
    let jobs;

    if (req.user.userType === 'employer') {
      // Get jobs posted by the employer
      jobs = await Job.find({ employer: req.user.id });
    } else {
      // Get jobs applied by the freelancer
      jobs = await Job.find({
        'applicants.user': req.user.id
      });
    }

    res.status(200).json({
      success: true,
      count: jobs.length,
      data: jobs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get user's active jobs
// @route   GET /api/users/jobs/active
// @access  Private
exports.getUserActiveJobs = async (req, res) => {
  try {
    let jobs;

    if (req.user.userType === 'employer') {
      // Get active jobs posted by the employer
      jobs = await Job.find({
        employer: req.user.id,
        status: 'in-progress'
      });
    } else {
      // Get active jobs where the freelancer is hired
      jobs = await Job.find({
        hiredFreelancer: req.user.id,
        status: 'in-progress'
      });
    }

    res.status(200).json({
      success: true,
      count: jobs.length,
      data: jobs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get user's completed jobs
// @route   GET /api/users/jobs/completed
// @access  Private
exports.getUserCompletedJobs = async (req, res) => {
  try {
    let jobs;

    if (req.user.userType === 'employer') {
      // Get completed jobs posted by the employer
      jobs = await Job.find({
        employer: req.user.id,
        status: 'completed'
      });
    } else {
      // Get completed jobs where the freelancer was hired
      jobs = await Job.find({
        hiredFreelancer: req.user.id,
        status: 'completed'
      });
    }

    res.status(200).json({
      success: true,
      count: jobs.length,
      data: jobs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get user's dashboard stats
// @route   GET /api/users/dashboard
// @access  Private
exports.getDashboardStats = async (req, res) => {
  try {
    let stats = {};

    if (req.user.userType === 'employer') {
      // Get employer stats
      const totalJobs = await Job.countDocuments({ employer: req.user.id });
      const activeJobs = await Job.countDocuments({
        employer: req.user.id,
        status: 'in-progress'
      });
      const completedJobs = await Job.countDocuments({
        employer: req.user.id,
        status: 'completed'
      });
      const openJobs = await Job.countDocuments({
        employer: req.user.id,
        status: 'open'
      });

      stats = {
        totalJobs,
        activeJobs,
        completedJobs,
        openJobs
      };
    } else {
      // Get freelancer stats
      const appliedJobs = await Job.countDocuments({
        'applicants.user': req.user.id
      });
      const activeJobs = await Job.countDocuments({
        hiredFreelancer: req.user.id,
        status: 'in-progress'
      });
      const completedJobs = await Job.countDocuments({
        hiredFreelancer: req.user.id,
        status: 'completed'
      });
      const pendingApplications = await Job.countDocuments({
        'applicants.user': req.user.id,
        'applicants.status': 'pending'
      });

      stats = {
        appliedJobs,
        activeJobs,
        completedJobs,
        pendingApplications
      };
    }

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
