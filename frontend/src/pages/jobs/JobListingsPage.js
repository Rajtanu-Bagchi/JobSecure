import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getJobs, setFilters } from '../../store/slices/jobsSlice';
import { ShieldCheckIcon, LockClosedIcon, BanknotesIcon } from '@heroicons/react/24/outline';

const JobListingsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { jobs, isLoading, totalPages, currentPage, filters } = useSelector(state => state.jobs);
  const { isAuthenticated } = useSelector(state => state.auth);
  
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  
  // Job categories
  const categories = [
    'Web Development',
    'Mobile Development',
    'UI/UX Design',
    'Graphic Design',
    'Content Writing',
    'Digital Marketing',
    'Data Entry',
    'Virtual Assistant',
    'Customer Service',
    'Other'
  ];
  
  // Payment types
  const paymentTypes = [
    'Fixed Price',
    'Hourly Rate',
    'Project Based'
  ];

  useEffect(() => {
    // Redirect unauthenticated users to the registration page
    if (!isAuthenticated) {
      navigate('/register');
    }
    // Fetch jobs when component mounts
    dispatch(getJobs({ page: 1, ...filters }));
  }, [dispatch, filters, isAuthenticated, navigate]);

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(setFilters({ search: searchTerm }));
  };

  const handleCategoryChange = (e) => {
    dispatch(setFilters({ category: e.target.value }));
  };

  const handlePaymentTypeChange = (e) => {
    dispatch(setFilters({ paymentType: e.target.value }));
  };

  const handleVerifiedOnlyChange = (e) => {
    dispatch(setFilters({ verifiedOnly: e.target.checked }));
  };

  const handleEscrowEnabledChange = (e) => {
    dispatch(setFilters({ escrowEnabled: e.target.checked }));
  };

  const handlePageChange = (page) => {
    dispatch(getJobs({ page, ...filters }));
  };

  // Generate pagination buttons
  const renderPagination = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-1 rounded-md ${
            currentPage === i
              ? 'bg-primary-600 text-white'
              : 'bg-white dark:bg-secondary-800 text-secondary-700 dark:text-secondary-300 hover:bg-gray-50 dark:hover:bg-secondary-700'
          }`}
        >
          {i}
        </button>
      );
    }
    return pages;
  };

  // Mock job data for demonstration (will be replaced with actual API data)
  const mockJobs = [
    {
      id: '1',
      title: 'Full Stack Web Developer Needed',
      description: 'Looking for an experienced full stack developer for an e-commerce project...',
      category: 'Web Development',
      paymentType: 'Fixed Price',
      budget: '$2000',
      isVerified: true,
      hasEscrow: true,
      employer: {
        name: 'TechSolutions Inc.',
        rating: 4.8,
        jobsPosted: 15
      },
      postedAt: '2023-08-10T10:30:00Z'
    },
    {
      id: '2',
      title: 'Mobile App UI Designer',
      description: 'Need a talented UI designer for a fitness tracking mobile application...',
      category: 'UI/UX Design',
      paymentType: 'Hourly Rate',
      budget: '$30-50/hr',
      isVerified: true,
      hasEscrow: true,
      employer: {
        name: 'FitTech Startup',
        rating: 4.5,
        jobsPosted: 7
      },
      postedAt: '2023-08-09T14:15:00Z'
    },
    {
      id: '3',
      title: 'Content Writer for Tech Blog',
      description: 'Looking for a content writer with knowledge of AI and machine learning...',
      category: 'Content Writing',
      paymentType: 'Project Based',
      budget: '$500',
      isVerified: false,
      hasEscrow: false,
      employer: {
        name: 'TechBlogger',
        rating: 3.9,
        jobsPosted: 3
      },
      postedAt: '2023-08-08T09:45:00Z'
    },
    {
      id: '4',
      title: 'WordPress Website Maintenance',
      description: 'Need ongoing maintenance and updates for an existing WordPress site...',
      category: 'Web Development',
      paymentType: 'Hourly Rate',
      budget: '$20-25/hr',
      isVerified: true,
      hasEscrow: false,
      employer: {
        name: 'Local Business Solutions',
        rating: 4.2,
        jobsPosted: 10
      },
      postedAt: '2023-08-07T16:20:00Z'
    },
    {
      id: '5',
      title: 'Logo Design for New Startup',
      description: 'Need a modern, minimalist logo for a tech startup in the education space...',
      category: 'Graphic Design',
      paymentType: 'Fixed Price',
      budget: '$300',
      isVerified: true,
      hasEscrow: true,
      employer: {
        name: 'EduTech Innovations',
        rating: 4.7,
        jobsPosted: 5
      },
      postedAt: '2023-08-06T11:10:00Z'
    }
  ];

  // Format date to readable format
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="bg-gray-50 dark:bg-secondary-900 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-secondary-900 dark:text-white">Find Secure Freelance Jobs</h1>
          <p className="mt-2 text-lg text-secondary-600 dark:text-secondary-400">Browse verified jobs with secure payment options</p>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-md p-6 mb-8">
          <form onSubmit={handleSearch} className="mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-grow">
                <input
                  type="text"
                  placeholder="Search for jobs..."
                  className="input-field"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button type="submit" className="btn-primary whitespace-nowrap">
                Search Jobs
              </button>
            </div>
          </form>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Category Filter */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                Category
              </label>
              <select
                id="category"
                className="input-field"
                value={filters.category}
                onChange={handleCategoryChange}
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Payment Type Filter */}
            <div>
              <label htmlFor="paymentType" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                Payment Type
              </label>
              <select
                id="paymentType"
                className="input-field"
                value={filters.paymentType}
                onChange={handlePaymentTypeChange}
              >
                <option value="">All Payment Types</option>
                {paymentTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Security Filters */}
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  id="verifiedOnly"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  checked={filters.verifiedOnly}
                  onChange={handleVerifiedOnlyChange}
                />
                <label htmlFor="verifiedOnly" className="ml-2 block text-sm text-secondary-700 dark:text-secondary-300">
                  Verified Employers Only
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="escrowEnabled"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  checked={filters.escrowEnabled}
                  onChange={handleEscrowEnabledChange}
                />
                <label htmlFor="escrowEnabled" className="ml-2 block text-sm text-secondary-700 dark:text-secondary-300">
                  Escrow Payment Enabled
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Job Listings */}
        <div className="space-y-6">
          {isLoading ? (
            <div className="text-center py-12">
              <svg className="animate-spin h-12 w-12 text-primary-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="mt-4 text-secondary-600 dark:text-secondary-400">Loading jobs...</p>
            </div>
          ) : mockJobs.length > 0 ? (
            mockJobs.map((job) => (
              <div key={job.id} className="bg-white dark:bg-secondary-800 rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                      <Link to={`/jobs/${job.id}`} className="text-xl font-semibold text-secondary-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400">
                        {job.title}
                      </Link>
                      <div className="mt-1 flex items-center">
                        <span className="text-sm text-secondary-600 dark:text-secondary-400">{job.employer.name}</span>
                        <span className="mx-2 text-secondary-300 dark:text-secondary-600">•</span>
                        <div className="flex items-center">
                          <svg className="h-4 w-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span className="ml-1 text-sm text-secondary-600 dark:text-secondary-400">{job.employer.rating}</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 md:mt-0">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-secondary-100 dark:bg-secondary-700 text-secondary-800 dark:text-secondary-200">
                        {job.category}
                      </span>
                      <div className="mt-2 text-sm font-medium text-secondary-900 dark:text-white">
                        {job.budget} • {job.paymentType}
                      </div>
                    </div>
                  </div>
                  <p className="mt-4 text-secondary-600 dark:text-secondary-400 line-clamp-2">
                    {job.description}
                  </p>
                  <div className="mt-6 flex flex-wrap items-center justify-between">
                    <div className="flex flex-wrap items-center gap-3">
                      {job.isVerified && (
                        <div className="flex items-center text-green-600 dark:text-green-400 text-sm">
                          <ShieldCheckIcon className="h-5 w-5 mr-1" />
                          <span>Verified Employer</span>
                        </div>
                      )}
                      {job.hasEscrow && (
                        <div className="flex items-center text-blue-600 dark:text-blue-400 text-sm">
                          <LockClosedIcon className="h-5 w-5 mr-1" />
                          <span>Escrow Enabled</span>
                        </div>
                      )}
                    </div>
                    <div className="mt-4 sm:mt-0 text-sm text-secondary-500 dark:text-secondary-400">
                      Posted {formatDate(job.postedAt)}
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-secondary-700 px-6 py-3">
                  <Link
                    to={`/jobs/${job.id}`}
                    className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
                  >
                    View Details & Apply
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 bg-white dark:bg-secondary-800 rounded-lg shadow-md">
              <div className="mx-auto h-24 w-24 text-secondary-400">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="mt-2 text-lg font-medium text-secondary-900 dark:text-white">No jobs found</h3>
              <p className="mt-1 text-secondary-600 dark:text-secondary-400">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <nav className="flex items-center justify-between">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded-md ${
                  currentPage === 1
                    ? 'bg-gray-100 dark:bg-secondary-700 text-secondary-400 dark:text-secondary-500 cursor-not-allowed'
                    : 'bg-white dark:bg-secondary-800 text-secondary-700 dark:text-secondary-300 hover:bg-gray-50 dark:hover:bg-secondary-700'
                }`}
              >
                Previous
              </button>
              <div className="mx-4 flex space-x-2">
                {renderPagination()}
              </div>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded-md ${
                  currentPage === totalPages
                    ? 'bg-gray-100 dark:bg-secondary-700 text-secondary-400 dark:text-secondary-500 cursor-not-allowed'
                    : 'bg-white dark:bg-secondary-800 text-secondary-700 dark:text-secondary-300 hover:bg-gray-50 dark:hover:bg-secondary-700'
                }`}
              >
                Next
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobListingsPage;
