const Job = require('../models/Job');
const User = require('../models/User');

// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Public
exports.getJobs = async (req, res) => {
  try {
    // Copy req.query
    const reqQuery = { ...req.query };

    // Fields to exclude
    const removeFields = ['select', 'sort', 'page', 'limit', 'search'];

    // Loop over removeFields and delete them from reqQuery
    removeFields.forEach(param => delete reqQuery[param]);

    // Create query string
    let queryStr = JSON.stringify(reqQuery);

    // Create operators ($gt, $gte, etc)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    // Finding resource
    let query = Job.find(JSON.parse(queryStr)).populate({
      path: 'employer',
      select: 'name email'
    });

    // Search functionality
    if (req.query.search) {
      query = query.find({
        $text: { $search: req.query.search }
      });
    }

    // Select Fields
    if (req.query.select) {
      const fields = req.query.select.split(',').join(' ');
      query = query.select(fields);
    }

    // Sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Job.countDocuments(JSON.parse(queryStr));

    query = query.skip(startIndex).limit(limit);

    // Executing query
    const jobs = await query;

    // Pagination result
    const pagination = {};

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      };
    }

    res.status(200).json({
      success: true,
      count: jobs.length,
      pagination,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      data: jobs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single job
// @route   GET /api/jobs/:id
// @access  Public
exports.getJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate({
      path: 'employer',
      select: 'name email'
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: `Job not found with id of ${req.params.id}`
      });
    }

    res.status(200).json({
      success: true,
      data: job
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create new job
// @route   POST /api/jobs
// @access  Private (Employers only)
exports.createJob = async (req, res) => {
  try {
    // Add user to req.body
    req.body.employer = req.user.id;

    // Check if user is an employer
    if (req.user.userType !== 'employer') {
      return res.status(403).json({
        success: false,
        message: 'Only employers can post jobs'
      });
    }

    const job = await Job.create(req.body);

    res.status(201).json({
      success: true,
      data: job
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update job
// @route   PUT /api/jobs/:id
// @access  Private (Job owner only)
exports.updateJob = async (req, res) => {
  try {
    let job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: `Job not found with id of ${req.params.id}`
      });
    }

    // Make sure user is job owner
    if (job.employer.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: `User ${req.user.id} is not authorized to update this job`
      });
    }

    // Don't allow updating if job has applicants or is in progress
    if (job.applicants.length > 0 || job.status !== 'open') {
      return res.status(400).json({
        success: false,
        message: 'Cannot update a job that has applicants or is already in progress'
      });
    }

    job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: job
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete job
// @route   DELETE /api/jobs/:id
// @access  Private (Job owner only)
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: `Job not found with id of ${req.params.id}`
      });
    }

    // Make sure user is job owner
    if (job.employer.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: `User ${req.user.id} is not authorized to delete this job`
      });
    }

    // Don't allow deleting if job is in progress
    if (job.status === 'in-progress') {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete a job that is in progress'
      });
    }

    await job.remove();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Apply for a job
// @route   POST /api/jobs/:id/apply
// @access  Private (Freelancers only)
exports.applyForJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: `Job not found with id of ${req.params.id}`
      });
    }

    // Check if user is a freelancer
    if (req.user.userType !== 'freelancer') {
      return res.status(403).json({
        success: false,
        message: 'Only freelancers can apply for jobs'
      });
    }

    // Check if job is open
    if (job.status !== 'open') {
      return res.status(400).json({
        success: false,
        message: 'This job is not open for applications'
      });
    }

    // Check if user has already applied
    if (job.applicants.some(applicant => applicant.user.toString() === req.user.id)) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied for this job'
      });
    }

    // Add user to applicants array
    job.applicants.push({
      user: req.user.id,
      proposal: req.body.proposal
    });

    await job.save();

    res.status(200).json({
      success: true,
      message: 'Application submitted successfully',
      data: job
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get job applicants
// @route   GET /api/jobs/:id/applicants
// @access  Private (Job owner only)
exports.getJobApplicants = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate({
      path: 'applicants.user',
      select: 'name email'
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: `Job not found with id of ${req.params.id}`
      });
    }

    // Make sure user is job owner
    if (job.employer.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: `User ${req.user.id} is not authorized to view applicants for this job`
      });
    }

    res.status(200).json({
      success: true,
      count: job.applicants.length,
      data: job.applicants
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Hire a freelancer for a job
// @route   PUT /api/jobs/:id/hire/:userId
// @access  Private (Job owner only)
exports.hireFreelancer = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: `Job not found with id of ${req.params.id}`
      });
    }

    // Make sure user is job owner
    if (job.employer.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: `User ${req.user.id} is not authorized to hire for this job`
      });
    }

    // Check if job is open
    if (job.status !== 'open') {
      return res.status(400).json({
        success: false,
        message: 'This job is not open for hiring'
      });
    }

    // Check if user has applied
    const applicant = job.applicants.find(
      applicant => applicant.user.toString() === req.params.userId
    );

    if (!applicant) {
      return res.status(400).json({
        success: false,
        message: 'This user has not applied for the job'
      });
    }

    // Update applicant status to accepted
    applicant.status = 'accepted';
    
    // Update other applicants to rejected
    job.applicants.forEach(app => {
      if (app.user.toString() !== req.params.userId) {
        app.status = 'rejected';
      }
    });

    // Set hired freelancer and update job status
    job.hiredFreelancer = req.params.userId;
    job.status = 'in-progress';

    await job.save();

    res.status(200).json({
      success: true,
      message: 'Freelancer hired successfully',
      data: job
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Mark job as completed
// @route   PUT /api/jobs/:id/complete
// @access  Private (Job owner only)
exports.completeJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: `Job not found with id of ${req.params.id}`
      });
    }

    // Make sure user is job owner
    if (job.employer.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: `User ${req.user.id} is not authorized to complete this job`
      });
    }

    // Check if job is in progress
    if (job.status !== 'in-progress') {
      return res.status(400).json({
        success: false,
        message: 'This job is not in progress'
      });
    }

    // Update job status
    job.status = 'completed';

    await job.save();

    res.status(200).json({
      success: true,
      message: 'Job marked as completed',
      data: job
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
