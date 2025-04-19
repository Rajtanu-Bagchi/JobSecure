import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getJobById, applyForJob, reportJob } from '../../store/slices/jobsSlice';
import { ShieldCheckIcon, LockClosedIcon, BanknotesIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';

const ApplicationSchema = Yup.object().shape({
  coverLetter: Yup.string()
    .required('Cover letter is required')
    .min(100, 'Cover letter must be at least 100 characters'),
  bidAmount: Yup.number()
    .required('Bid amount is required')
    .positive('Bid amount must be positive'),
  estimatedTime: Yup.string()
    .required('Estimated completion time is required'),
});

const ReportSchema = Yup.object().shape({
  reason: Yup.string()
    .required('Reason is required')
    .min(20, 'Please provide more details about the issue'),
  evidence: Yup.string()
    .required('Evidence is required')
    .min(50, 'Please provide more details as evidence'),
});

const JobDetailsPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { job, isLoading, error } = useSelector(state => state.jobs);
  const { isAuthenticated, user } = useSelector(state => state.auth);
  
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(getJobById(id));
    }
  }, [dispatch, id]);

  // Mock job data for demonstration
  const mockJob = {
    id: '1',
    title: 'Full Stack Web Developer Needed',
    description: 'Looking for an experienced full stack developer for an e-commerce project. The ideal candidate should have experience with React, Node.js, and MongoDB. The project involves building a complete e-commerce platform with user authentication, product catalog, shopping cart, and payment processing integration.\n\nResponsibilities:\n- Develop frontend using React and modern CSS frameworks\n- Build backend API with Node.js and Express\n- Implement database schema and queries with MongoDB\n- Integrate payment gateway (Stripe)\n- Ensure mobile responsiveness and cross-browser compatibility\n\nThe project timeline is approximately 2 months with possibility of ongoing maintenance work.',
    category: 'Web Development',
    paymentType: 'Fixed Price',
    budget: '$2000',
    isVerified: true,
    hasEscrow: true,
    skills: ['React', 'Node.js', 'MongoDB', 'Express', 'JavaScript', 'CSS', 'Responsive Design'],
    employer: {
      id: 'emp123',
      name: 'TechSolutions Inc.',
      rating: 4.8,
      jobsPosted: 15,
      memberSince: '2022-03-15T00:00:00Z',
      location: 'United States',
      description: 'TechSolutions is a software development company specializing in web and mobile applications for small to medium businesses.',
      verificationBadge: true
    },
    postedAt: '2023-08-10T10:30:00Z',
    deadline: '2023-09-10T10:30:00Z',
    applicants: 7
  };

  const handleApply = (values, { resetForm }) => {
    dispatch(applyForJob({ jobId: id, applicationData: values }))
      .unwrap()
      .then(() => {
        toast.success('Application submitted successfully!');
        setShowApplicationModal(false);
        resetForm();
      })
      .catch((error) => {
        toast.error(error || 'Failed to submit application. Please try again.');
      });
  };

  const handleReport = (values, { resetForm }) => {
    dispatch(reportJob({ jobId: id, reportData: values }))
      .unwrap()
      .then(() => {
        toast.success('Report submitted successfully. Our team will review it shortly.');
        setShowReportModal(false);
        resetForm();
      })
      .catch((error) => {
        toast.error(error || 'Failed to submit report. Please try again.');
      });
  };

  // Format date to readable format
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <svg className="animate-spin h-12 w-12 text-primary-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="mt-4 text-secondary-600 dark:text-secondary-400">Loading job details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
          <ExclamationTriangleIcon className="h-12 w-12 text-red-500 mx-auto" />
          <h3 className="mt-2 text-lg font-medium text-red-800 dark:text-red-400">Error Loading Job</h3>
          <p className="mt-1 text-red-700 dark:text-red-300">{error}</p>
          <div className="mt-6">
            <Link to="/jobs" className="btn-primary">
              Back to Job Listings
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Use mock data for now
  const jobData = mockJob;

  return (
    <div className="bg-gray-50 dark:bg-secondary-900 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link to="/jobs" className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 flex items-center">
            <svg className="h-5 w-5 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Back to Jobs
          </Link>
        </div>

        <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">{jobData.title}</h1>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-secondary-100 dark:bg-secondary-700 text-secondary-800 dark:text-secondary-200">
                    {jobData.category}
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400">
                    {jobData.paymentType}
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400">
                    {jobData.budget}
                  </span>
                </div>
              </div>
              <div className="mt-4 lg:mt-0 flex flex-col sm:flex-row gap-3">
                {isAuthenticated && user?.userType === 'freelancer' && (
                  <button
                    onClick={() => setShowApplicationModal(true)}
                    className="btn-primary"
                  >
                    Apply Now
                  </button>
                )}
                <button
                  onClick={() => setShowReportModal(true)}
                  className="text-red-600 dark:text-red-400 border border-red-300 dark:border-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 font-semibold py-2 px-4 rounded-md transition duration-200"
                >
                  Report Job
                </button>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-4">
              {jobData.isVerified && (
                <div className="flex items-center text-green-600 dark:text-green-400 text-sm">
                  <ShieldCheckIcon className="h-5 w-5 mr-1" />
                  <span>Verified Employer</span>
                </div>
              )}
              {jobData.hasEscrow && (
                <div className="flex items-center text-blue-600 dark:text-blue-400 text-sm">
                  <LockClosedIcon className="h-5 w-5 mr-1" />
                  <span>Escrow Enabled</span>
                </div>
              )}
              <div className="text-sm text-secondary-600 dark:text-secondary-400">
                Posted {formatDate(jobData.postedAt)}
              </div>
              <div className="text-sm text-secondary-600 dark:text-secondary-400">
                Deadline: {formatDate(jobData.deadline)}
              </div>
              <div className="text-sm text-secondary-600 dark:text-secondary-400">
                {jobData.applicants} applicants
              </div>
            </div>

            <div className="mt-8">
              <h2 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">Job Description</h2>
              <div className="prose prose-secondary dark:prose-invert max-w-none">
                {jobData.description.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="mb-4 text-secondary-700 dark:text-secondary-300">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            <div className="mt-8">
              <h2 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">Required Skills</h2>
              <div className="flex flex-wrap gap-2">
                {jobData.skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-secondary-100 dark:bg-secondary-700 text-secondary-800 dark:text-secondary-200"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white dark:bg-secondary-800 rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">About the Employer</h2>
            
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 rounded-full bg-primary-600 flex items-center justify-center text-white text-lg font-semibold">
                  {jobData.employer.name.charAt(0)}
                </div>
              </div>
              <div className="ml-4">
                <div className="flex items-center">
                  <h3 className="text-lg font-medium text-secondary-900 dark:text-white">
                    {jobData.employer.name}
                  </h3>
                  {jobData.employer.verificationBadge && (
                    <ShieldCheckIcon className="ml-2 h-5 w-5 text-green-500" aria-hidden="true" />
                  )}
                </div>
                <div className="mt-1 flex items-center">
                  <div className="flex items-center">
                    <svg className="h-4 w-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="ml-1 text-sm text-secondary-600 dark:text-secondary-400">{jobData.employer.rating} rating</span>
                  </div>
                  <span className="mx-2 text-secondary-300 dark:text-secondary-600">•</span>
                  <span className="text-sm text-secondary-600 dark:text-secondary-400">{jobData.employer.jobsPosted} jobs posted</span>
                  <span className="mx-2 text-secondary-300 dark:text-secondary-600">•</span>
                  <span className="text-sm text-secondary-600 dark:text-secondary-400">{jobData.employer.location}</span>
                </div>
                <p className="mt-2 text-secondary-600 dark:text-secondary-400">
                  Member since {formatDate(jobData.employer.memberSince)}
                </p>
                <p className="mt-2 text-secondary-700 dark:text-secondary-300">
                  {jobData.employer.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Application Modal */}
      {showApplicationModal && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white dark:bg-secondary-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white dark:bg-secondary-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-secondary-900 dark:text-white">
                      Apply for: {jobData.title}
                    </h3>
                    <div className="mt-2">
                      <Formik
                        initialValues={{
                          coverLetter: '',
                          bidAmount: '',
                          estimatedTime: '',
                        }}
                        validationSchema={ApplicationSchema}
                        onSubmit={handleApply}
                      >
                        {({ errors, touched, isSubmitting }) => (
                          <Form className="space-y-4">
                            <div>
                              <label htmlFor="coverLetter" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">
                                Cover Letter
                              </label>
                              <div className="mt-1">
                                <Field
                                  as="textarea"
                                  id="coverLetter"
                                  name="coverLetter"
                                  rows={6}
                                  className={`input-field ${
                                    errors.coverLetter && touched.coverLetter ? 'border-red-500' : ''
                                  }`}
                                  placeholder="Introduce yourself and explain why you're a good fit for this job..."
                                />
                                <ErrorMessage name="coverLetter" component="div" className="mt-1 text-sm text-red-600" />
                              </div>
                            </div>

                            <div>
                              <label htmlFor="bidAmount" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">
                                Your Bid ({jobData.paymentType})
                              </label>
                              <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                  <span className="text-secondary-500 sm:text-sm">$</span>
                                </div>
                                <Field
                                  type="number"
                                  id="bidAmount"
                                  name="bidAmount"
                                  className={`input-field pl-7 ${
                                    errors.bidAmount && touched.bidAmount ? 'border-red-500' : ''
                                  }`}
                                  placeholder="0.00"
                                />
                              </div>
                              <ErrorMessage name="bidAmount" component="div" className="mt-1 text-sm text-red-600" />
                            </div>

                            <div>
                              <label htmlFor="estimatedTime" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">
                                Estimated Completion Time
                              </label>
                              <div className="mt-1">
                                <Field
                                  type="text"
                                  id="estimatedTime"
                                  name="estimatedTime"
                                  className={`input-field ${
                                    errors.estimatedTime && touched.estimatedTime ? 'border-red-500' : ''
                                  }`}
                                  placeholder="e.g., 2 weeks, 1 month"
                                />
                                <ErrorMessage name="estimatedTime" component="div" className="mt-1 text-sm text-red-600" />
                              </div>
                            </div>

                            <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                              <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                              >
                                {isSubmitting ? 'Submitting...' : 'Submit Application'}
                              </button>
                              <button
                                type="button"
                                onClick={() => setShowApplicationModal(false)}
                                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-secondary-600 shadow-sm px-4 py-2 bg-white dark:bg-secondary-700 text-base font-medium text-secondary-700 dark:text-secondary-300 hover:bg-gray-50 dark:hover:bg-secondary-600 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm"
                              >
                                Cancel
                              </button>
                            </div>
                          </Form>
                        )}
                      </Formik>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white dark:bg-secondary-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white dark:bg-secondary-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900 sm:mx-0 sm:h-10 sm:w-10">
                    <ExclamationTriangleIcon className="h-6 w-6 text-red-600 dark:text-red-400" aria-hidden="true" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-secondary-900 dark:text-white">
                      Report this Job
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-secondary-600 dark:text-secondary-400">
                        If you believe this job posting violates our terms or may be a scam, please submit a report. Your report will be kept confidential.
                      </p>
                      <Formik
                        initialValues={{
                          reason: '',
                          evidence: '',
                        }}
                        validationSchema={ReportSchema}
                        onSubmit={handleReport}
                      >
                        {({ errors, touched, isSubmitting }) => (
                          <Form className="mt-4 space-y-4">
                            <div>
                              <label htmlFor="reason" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">
                                Reason for Report
                              </label>
                              <div className="mt-1">
                                <Field
                                  as="select"
                                  id="reason"
                                  name="reason"
                                  className={`input-field ${
                                    errors.reason && touched.reason ? 'border-red-500' : ''
                                  }`}
                                >
                                  <option value="">Select a reason</option>
                                  <option value="scam">Potential Scam</option>
                                  <option value="inappropriate">Inappropriate Content</option>
                                  <option value="misleading">Misleading Information</option>
                                  <option value="duplicate">Duplicate Posting</option>
                                  <option value="other">Other</option>
                                </Field>
                                <ErrorMessage name="reason" component="div" className="mt-1 text-sm text-red-600" />
                              </div>
                            </div>

                            <div>
                              <label htmlFor="evidence" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">
                                Evidence or Details
                              </label>
                              <div className="mt-1">
                                <Field
                                  as="textarea"
                                  id="evidence"
                                  name="evidence"
                                  rows={4}
                                  className={`input-field ${
                                    errors.evidence && touched.evidence ? 'border-red-500' : ''
                                  }`}
                                  placeholder="Please provide details about why you believe this job should be reported..."
                                />
                                <ErrorMessage name="evidence" component="div" className="mt-1 text-sm text-red-600" />
                              </div>
                            </div>

                            <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                              <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                              >
                                {isSubmitting ? 'Submitting...' : 'Submit Report'}
                              </button>
                              <button
                                type="button"
                                onClick={() => setShowReportModal(false)}
                                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-secondary-600 shadow-sm px-4 py-2 bg-white dark:bg-secondary-700 text-base font-medium text-secondary-700 dark:text-secondary-300 hover:bg-gray-50 dark:hover:bg-secondary-600 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm"
                              >
                                Cancel
                              </button>
                            </div>
                          </Form>
                        )}
                      </Formik>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetailsPage;
