"use client";

import React from 'react';

const AccountSettingsPage: React.FC = () => {

  const handleDeleteAccount = () => {
    // Implement account deletion logic here
    console.log('Account deletion initiated');
    // You would typically show a confirmation dialog
    // and then call an API to delete the account
  };

  const handleRequestPasswordChange = () => {
    // Implement password change request logic here
    console.log('Password change request initiated');
    // You would typically call an API to send a password reset email
    // or redirect the user to a password change form
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Account Settings</h1>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Account Actions</h2>

        <div className="flex flex-col space-y-4">
          <button
            onClick={handleRequestPasswordChange}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Request Password Change
          </button>

          <button
            onClick={handleDeleteAccount}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountSettingsPage;