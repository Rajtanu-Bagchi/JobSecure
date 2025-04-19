const express = require('express');
const {
  getUsers,
  getUser,
  updateProfile,
  getUserJobs,
  getUserActiveJobs,
  getUserCompletedJobs,
  getDashboardStats
} = require('../controllers/userController');

const { protect, authorize, verifiedOnly } = require('../middleware/auth');

const router = express.Router();

router.route('/')
  .get(protect, authorize('admin'), getUsers);

router.route('/:id')
  .get(protect, getUser);

router.route('/profile')
  .put(protect, updateProfile);

router.route('/jobs')
  .get(protect, verifiedOnly, getUserJobs);

router.route('/jobs/active')
  .get(protect, verifiedOnly, getUserActiveJobs);

router.route('/jobs/completed')
  .get(protect, verifiedOnly, getUserCompletedJobs);

router.route('/dashboard')
  .get(protect, verifiedOnly, getDashboardStats);

module.exports = router;
