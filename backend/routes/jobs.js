const express = require('express');
const {
  getJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
  applyForJob,
  getJobApplicants,
  hireFreelancer,
  completeJob
} = require('../controllers/jobController');

const { protect, authorize, verifiedOnly } = require('../middleware/auth');

const router = express.Router();

router.route('/')
  .get(getJobs)
  .post(protect, verifiedOnly, authorize('employer'), createJob);

router.route('/:id')
  .get(getJob)
  .put(protect, verifiedOnly, updateJob)
  .delete(protect, verifiedOnly, deleteJob);

router.route('/:id/apply')
  .post(protect, verifiedOnly, authorize('freelancer'), applyForJob);

router.route('/:id/applicants')
  .get(protect, verifiedOnly, getJobApplicants);

router.route('/:id/hire/:userId')
  .put(protect, verifiedOnly, authorize('employer'), hireFreelancer);

router.route('/:id/complete')
  .put(protect, verifiedOnly, authorize('employer'), completeJob);

module.exports = router;
