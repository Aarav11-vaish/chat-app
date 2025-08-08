import React, { useState } from 'react';
import { authStore } from '../authStore';
import { toast } from 'react-hot-toast';
import { User, Mail, Lock, Calendar , IdCard} from 'lucide-react';
import Navbar from './Navbar';
function Profile() {
  const { authUser, isProfileUpdated, profileupdate } = authStore();

  const [fullName, setFullName] = useState(authUser?.username || '');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updateData = {};
    if (fullName.trim() !== authUser?.username) {
      updateData.fullName = fullName.trim();
    }
    if (password.trim().length > 0) {
      if (password.length < 6) {
        toast.error("Password must be at least 6 characters");
        return;
      }
      updateData.password = password;
    }

    if (Object.keys(updateData).length === 0) {
      toast.error("No changes to update");
      return;
    }

    await profileupdate(updateData);
    setPassword('');
  };

  return (

    
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-800 pt-20">
      <Navbar/>
      <div className="max-w-4xl mx-auto p-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-8 py-12 text-center">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <User className="w-12 h-12 text-slate-700" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Profile Settings</h1>
            <p className="text-slate-40">Manage your account information and preferences</p>
          </div>

          <div className="p-8 bg-slate-800">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Profile Information */}
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-slate-330 mb-6 flex items-center gap-2">
                    <User className="w-5 h-5 text-slate-400" />
                    Profile Information
                  </h2>
                  
                  <div className="space-y-6">
                    {/* Email Display */}
                      <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-50 flex items-center gap-2">
                        <IdCard className="w-4 h-4" />
                        user ID
                      </label>
                      <div className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700">
                        {authUser?.id}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-50 flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Email Address
                      </label>
                      <div className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700">
                        {authUser?.email}
                      </div>
                    </div>

                    {/* Full Name Field */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-50 flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full px-4 py-3 text-slate-700 border border-slate-800  rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all duration-200 bg-white hover:border-slate-300"
                        placeholder="Enter your full name"
                      />
                    </div>

                    {/* Password Field */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-70 flex items-center gap-2">
                        <Lock className="w-4 h-4" />
                        New Password
                      </label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 border text-slate-800 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all duration-200 bg-white hover:border-slate-300"
                        placeholder="Enter new password (optional)"
                      />
                      <p className="text-xs text-slate-500">Leave blank to keep current password</p>
                    </div>

                    {/* Update Button */}
                    <form onSubmit={handleSubmit}>
                    <button
                      type="submit"
                      disabled={isProfileUpdated}
                      className={`w-full py-3 px-6 rounded-xl font-medium text-slate-600 transition-all duration-200 ${
                        isProfileUpdated 
                          ? 'bg-slate-400 cursor-not-allowed' 
                          : 'bg-slate-800 hover:bg-slate-900 hover:shadow-lg transform hover:-translate-y-0.5'
                      }`}
                    >
                      {isProfileUpdated ? (
                        <span className="flex items-center justify-center gap-2">
                          <div className="w-4 h-4 border-2  rounded-full animate-spin"></div>
                          Updating...
                        </span>
                      ) : (
                        'Update Profile'
                      )}
                    </button>
                    </form>
                  </div>
                </div>
              </div>

              {/* Account Information */}
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-slate-330 mb-6 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-slate-400" />
                    Account Information
                  </h2>
                  
                  <div className="bg-slate-50 rounded-xl p-6 space-y-4">
                    <div className="flex items-center justify-between py-3 border-b border-slate-200 last:border-b-0">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                        <span className="text-slate-700 font-medium">Member Since</span>
                      </div>
                      <span className="text-slate-600 font-mono text-sm">
                        {authUser.createdAt?.split("T")[0]}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-slate-700 font-medium">Account Status</span>
                      </div>
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                        Active
                      </span>
                    </div>
                  </div>
                </div>

                {/* Security Notice */}
                <div className="bg-blue-100 border border-blue-200 rounded-xl p-6">
                  <h3 className="text-blue-800 font-semibold mb-2 flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Security Notice
                  </h3>
                  <p className="text-blue-700 text-sm leading-relaxed">
                    Your account information is encrypted and secure. Any changes to your profile will be logged for security purposes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;