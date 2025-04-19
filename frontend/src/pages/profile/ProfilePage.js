import React from 'react';
import { useSelector } from 'react-redux';
import { ShieldCheckIcon, UserGroupIcon, BanknotesIcon } from '@heroicons/react/24/outline';

const ProfilePage = () => {
  const { user } = useSelector(state => state.auth);

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
                    <span className="text-4xl">{user?.name?.charAt(0)?.toUpperCase()}</span>
                  )}
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-secondary-900 dark:text-white">Personal Information</h3>
                  <p className="mt-1 text-secondary-600 dark:text-secondary-400">{user?.name}</p>
                  <p className="mt-1 text-secondary-600 dark:text-secondary-400">{user?.email}</p>
                  <p className="mt-1 text-secondary-600 dark:text-secondary-400">{user?.phone}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-secondary-900 dark:text-white">Account Type</h3>
                  <p className="mt-1 text-secondary-600 dark:text-secondary-400 capitalize">
                    {user?.role}
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
                      {user?.totalJobs || 0}
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
                      {user?.activeProjects || 0}
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
                      ${user?.totalEarnings || 0}
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
