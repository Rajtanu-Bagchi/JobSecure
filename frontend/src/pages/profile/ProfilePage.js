import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ShieldCheckIcon, UserGroupIcon, BanknotesIcon } from '@heroicons/react/24/outline';

const ProfilePage = () => {
  const { user } = useSelector(state => state.auth);
  console.log('User data in ProfilePage:', user);

  // Mock data to match dashboard (same as in DashboardPage.js)
  const stats = {
    totalJobs: 15,
    activeJobs: 1,
    totalEarnings: '384,242',
    trustScore: '92%',
    verified: true,
    escrowEnabled: true,
  };

  // Function to safely get user name
  const getUserName = () => {
    if (!user) return 'User';
    // Try different possible locations for the name property
    return user.name || (user.data && user.data.name) || 'User';
  };

  // Function to get first letter of name or default
  const getInitial = () => {
    const name = getUserName();
    return name.charAt(0).toUpperCase();
  };

  return (
    <div className="bg-gray-50 dark:bg-secondary-900 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">My Profile</h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Profile Info */}
            <div className="bg-white dark:bg-secondary-800 rounded-lg shadow p-6">
              <div className="text-center mb-6">
                <div className="h-32 w-32 mx-auto rounded-full bg-gray-200 dark:bg-secondary-700 flex items-center justify-center">
                  {user?.profilePicture ? (
                    <img
                      src={user.profilePicture}
                      alt="Profile"
                      className="h-full w-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-4xl">{getInitial()}</span>
                  )}
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-secondary-900 dark:text-white">Personal Information</h3>
                  <p className="mt-1 text-secondary-600 dark:text-secondary-400">{getUserName()}</p>
                  <p className="mt-1 text-secondary-600 dark:text-secondary-400">{user?.email || (user?.data && user.data.email) || ''}</p>
                  <p className="mt-1 text-secondary-600 dark:text-secondary-400">{user?.phone || (user?.data && user.data.phone) || ''}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-secondary-900 dark:text-white">Account Type</h3>
                  <p className="mt-1 text-secondary-600 dark:text-secondary-400 capitalize">
                    {user?.userType || (user?.data && user.data.userType) || 'freelancer'}
                  </p>
                </div>
              </div>
            </div>

            {/* Statistics */}
            <div className="col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-secondary-800 rounded-lg shadow p-6">
                <div className="flex items-center">
                  <ShieldCheckIcon className="h-6 w-6 text-green-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-secondary-600 dark:text-secondary-400">
                      Total Jobs
                    </p>
                    <p className="text-2xl font-bold text-secondary-900 dark:text-white">
                      {stats.totalJobs}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-secondary-800 rounded-lg shadow p-6">
                <div className="flex items-center">
                  <UserGroupIcon className="h-6 w-6 text-blue-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-secondary-600 dark:text-secondary-400">
                      Active Projects
                    </p>
                    <p className="text-2xl font-bold text-secondary-900 dark:text-white">
                      {stats.activeJobs}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-secondary-800 rounded-lg shadow p-6">
                <div className="flex items-center">
                  <BanknotesIcon className="h-6 w-6 text-yellow-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-secondary-600 dark:text-secondary-400">
                      Total Earnings
                    </p>
                    <p className="text-2xl font-bold text-secondary-900 dark:text-white">
                      ₹{stats.totalEarnings}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
