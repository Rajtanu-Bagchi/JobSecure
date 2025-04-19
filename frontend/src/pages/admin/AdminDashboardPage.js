import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { ShieldCheckIcon, LockClosedIcon, BanknotesIcon, UserGroupIcon, ChartBarIcon, FlagIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';

const AdminDashboardPage = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector(state => state.auth);
  const { jobs, isLoading } = useSelector(state => state.jobs);

  // Mock data for demonstration
  const stats = {
    totalUsers: 150,
    activeJobs: 75,
    completedJobs: 120,
    totalPayments: '$45,000',
    flaggedAccounts: 5,
    reportedJobs: 3,
    verifiedEmployers: 45,
  };

  const reports = [
    {
      id: 1,
      type: 'Employer',
      name: 'TechSolutions Inc',
      reason: 'Late payment',
      status: 'Pending',
      date: '2024-03-15',
    },
    {
      id: 2,
      type: 'Job',
      title: 'Full Stack Developer',
      reason: 'Scam listing',
      status: 'Reviewed',
      date: '2024-03-14',
    },
    {
      id: 3,
      type: 'Employer',
      name: 'Digital Agency',
      reason: 'Fake company',
      status: 'Pending',
      date: '2024-03-13',
    },
  ];

  const userActivity = [
    {
      id: 1,
      type: 'Registration',
      user: 'John Doe',
      date: '2024-03-15',
      status: 'Verified',
    },
    {
      id: 2,
      type: 'Payment',
      amount: '$500',
      date: '2024-03-15',
      status: 'Completed',
    },
    {
      id: 3,
      type: 'Job Posting',
      title: 'UI Designer',
      date: '2024-03-15',
      status: 'Active',
    },
  ];

  return (
    <div className="bg-gray-50 dark:bg-secondary-900 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-secondary-900 dark:text-white">Admin Dashboard</h1>
              <p className="mt-1 text-sm text-secondary-600 dark:text-secondary-400">
                Manage and monitor the platform's activities
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/admin/users"
                className="btn-secondary"
              >
                Manage Users
              </Link>
              <Link
                to="/admin/reports"
                className="btn-primary"
              >
                View Reports
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <UserGroupIcon className="h-6 w-6 text-primary-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-secondary-600 dark:text-secondary-400">Total Users</p>
                <p className="text-2xl font-bold text-secondary-900 dark:text-white">{stats.totalUsers}</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <ChartBarIcon className="h-6 w-6 text-green-600 mr-3" />
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
                <p className="text-sm font-medium text-secondary-600 dark:text-secondary-400">Total Payments</p>
                <p className="text-2xl font-bold text-secondary-900 dark:text-white">{stats.totalPayments}</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <FlagIcon className="h-6 w-6 text-yellow-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-secondary-600 dark:text-secondary-400">Flagged Accounts</p>
                <p className="text-2xl font-bold text-secondary-900 dark:text-white">{stats.flaggedAccounts}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Reports Section */}
        <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">Pending Reports</h2>
          <div className="space-y-4">
            {reports.map((report) => (
              <div
                key={report.id}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-secondary-700 rounded-lg"
              >
                <div>
                  <h3 className="text-sm font-medium text-secondary-900 dark:text-white">
                    {report.type}: {report.name}
                  </h3>
                  <p className="text-sm text-secondary-600 dark:text-secondary-400">
                    Reason: {report.reason}
                  </p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    report.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                    report.status === 'Reviewed' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {report.status}
                  </span>
                </div>
                <span className="text-sm text-secondary-500 dark:text-secondary-400">
                  {new Date(report.date).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* User Activity */}
        <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {userActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-secondary-700 rounded-lg"
              >
                <div>
                  <h3 className="text-sm font-medium text-secondary-900 dark:text-white">
                    {activity.type}: {activity.user || activity.title}
                  </h3>
                  {activity.amount && (
                    <p className="text-sm text-secondary-600 dark:text-secondary-400">
                      Amount: {activity.amount}
                    </p>
                  )}
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    activity.status === 'Verified' ? 'bg-green-100 text-green-800' :
                    activity.status === 'Completed' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {activity.status}
                  </span>
                </div>
                <span className="text-sm text-secondary-500 dark:text-secondary-400">
                  {new Date(activity.date).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
