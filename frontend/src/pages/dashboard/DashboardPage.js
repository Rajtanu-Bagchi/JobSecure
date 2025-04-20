import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { ShieldCheckIcon, LockClosedIcon, BanknotesIcon, UserGroupIcon, ChartBarIcon } from '@heroicons/react/24/outline';

const DashboardPage = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector(state => state.auth);
  const { jobs, isLoading } = useSelector(state => state.jobs);

  // Mock data for demonstration
  const stats = {
    totalJobs: 15,
    activeJobs: 1,
    completedJobs: 8,
    totalEarnings: '₹384,242',
    trustScore: '92%',
    verified: true,
    escrowEnabled: true,
  };

  const recentActivity = [
    {
      title: 'New Job Application',
      description: 'You applied for Frontend Developer position at TechSolutions',
      date: '2 hours ago',
      type: 'success',
    },
    {
      title: 'Job Offer Received',
      description: 'Received offer for Mobile App Development project',
      date: '5 hours ago',
      type: 'info',
    },
    {
      title: 'Payment Received',
      description: 'Received payment for completed project',
      date: '1 day ago',
      type: 'success',
    },
  ];

  const jobCategories = [
    'Web Development',
    'Mobile Development',
    'UI/UX Design',
    'Graphic Design',
    'Content Writing',
    'Digital Marketing',
    'Data Entry',
    'Virtual Assistant',
    'Customer Service',
  ];

  return (
    <div className="bg-gray-50 dark:bg-secondary-900 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-secondary-900 dark:text-white">Welcome back, {user?.name}</h1>
              <p className="mt-1 text-sm text-secondary-600 dark:text-secondary-400">
                Here's what's happening with your jobs today
              </p>
            </div>
            <div className="flex items-center">
              <Link
                to="/jobs"
                className="btn-primary"
              >
                Browse Jobs
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <ChartBarIcon className="h-6 w-6 text-primary-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-secondary-600 dark:text-secondary-400">Total Jobs</p>
                <p className="text-2xl font-bold text-secondary-900 dark:text-white">{stats.totalJobs}</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <ShieldCheckIcon className="h-6 w-6 text-green-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-secondary-600 dark:text-secondary-400">Active Jobs</p>
                <p className="text-2xl font-bold text-secondary-900 dark:text-white">{stats.activeJobs}</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <BanknotesIcon className="h-6 w-6 text-blue-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-secondary-600 dark:text-secondary-400">Total Earnings</p>
                <p className="text-2xl font-bold text-secondary-900 dark:text-white">{stats.totalEarnings}</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <UserGroupIcon className="h-6 w-6 text-yellow-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-secondary-600 dark:text-secondary-400">Trust Score</p>
                <p className="text-2xl font-bold text-secondary-900 dark:text-white">{stats.trustScore}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-secondary-700 rounded-lg"
              >
                <div>
                  <h3 className={`text-sm font-medium ${
                    activity.type === 'success' ? 'text-green-600' : 'text-blue-600'
                  }`}>
                    {activity.title}
                  </h3>
                  <p className="text-sm text-secondary-600 dark:text-secondary-400">
                    {activity.description}
                  </p>
                </div>
                <span className="text-sm text-secondary-500 dark:text-secondary-400">
                  {activity.date}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Job Categories */}
        <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">Popular Job Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {jobCategories.map((category) => (
              <Link
                key={category}
                to={`/jobs?category=${category}`}
                className="flex flex-col items-center p-4 text-center bg-gray-50 dark:bg-secondary-700 rounded-lg hover:bg-gray-100 dark:hover:bg-secondary-600 transition-colors"
              >
                <div className="h-12 w-12 rounded-full bg-primary-600 flex items-center justify-center text-white mb-2">
                  {category.charAt(0)}
                </div>
                <p className="text-sm font-medium text-secondary-900 dark:text-white">
                  {category}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
