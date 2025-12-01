import React, { useState } from 'react';
import { 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaEdit,
  FaSave,
  FaTimes,
  FaCamera,
  FaCheck
} from 'react-icons/fa';

// Sample profile data based on screenshot
const initialProfile = {
  name: 'Damilare',
  email: 'balogunspam45@gmail.com',
  phone: '+1 (555) 123-4567',
  emailVerified: true,
  phoneVerified: true,
  businessName: 'N/A',
  businessAddress: 'N/A',
  businessDescription: 'N/A',
  brandIdentity: 'https://via.placeholder.com/200x100?text=Brand+Logo', // Placeholder
  tags: ''
};

export default function Profile() {
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState(initialProfile);
  const [formData, setFormData] = useState(initialProfile);
  const [brandPreview, setBrandPreview] = useState(profile.brandIdentity);
  const [brandFile, setBrandFile] = useState<File | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleBrandChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBrandFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setBrandPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    // Simulate API call
    setProfile({
      ...formData,
      brandIdentity: brandPreview
    });
    setEditing(false);
    console.log('Profile updated:', { ...formData, brand: brandFile });
  };

  const handleCancel = () => {
    setFormData(initialProfile);
    setBrandPreview(profile.brandIdentity);
    setBrandFile(null);
    setEditing(false);
  };

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-1 flex items-center gap-2">
            Profile <span className="text-green-500">🍃</span>
          </h1>
          <p className="text-sm text-gray-500">Manage your profile settings</p>
        </div>
      </div>

      {/* Profile About Section */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Profile About</h2>
          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              className="px-3 py-1.5 text-sm font-medium text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
            >
              Edit
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={handleSave}
                className="px-3 py-1.5 text-sm font-medium text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
              >
                <FaSave className="w-3 h-3 inline mr-1" />
                Save
              </button>
              <button
                onClick={handleCancel}
                className="px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <FaTimes className="w-3 h-3 inline mr-1" />
                Cancel
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                <FaUser className="text-gray-400" />
                Name
              </label>
              {editing ? (
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              ) : (
                <p className="text-sm text-gray-900">{profile.name}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                <FaEnvelope className="text-gray-400" />
                Email
              </label>
              {editing ? (
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              ) : (
                <div className="flex items-center gap-2">
                  <p className="text-sm text-gray-900">{profile.email}</p>
                  {profile.emailVerified && <FaCheck className="text-green-500 w-4 h-4" />}
                </div>
              )}
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                <FaPhone className="text-gray-400" />
                Phone Number
              </label>
              {editing ? (
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              ) : (
                <div className="flex items-center gap-2">
                  <p className="text-sm text-gray-900">{profile.phone}</p>
                  {profile.phoneVerified && <FaCheck className="text-green-500 w-4 h-4" />}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Business Profile Section */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Business Profile</h2>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
                {editing ? (
                  <input
                    type="text"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                ) : (
                  <p className="text-sm text-gray-900">{profile.businessName}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Business Address</label>
                {editing ? (
                  <input
                    type="text"
                    name="businessAddress"
                    value={formData.businessAddress}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                ) : (
                  <p className="text-sm text-gray-900">{profile.businessAddress}</p>
                )}
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Business Description</label>
                {editing ? (
                  <textarea
                    name="businessDescription"
                    value={formData.businessDescription}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                  />
                ) : (
                  <p className="text-sm text-gray-900">{profile.businessDescription}</p>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Brand Identity</label>
              <div className="relative">
                <img
                  src={brandPreview}
                  alt="Brand Identity"
                  className="w-full h-24 object-cover rounded-lg border border-gray-300"
                />
                {editing && (
                  <label className="absolute top-2 right-2 bg-green-500 text-white p-1 rounded-full cursor-pointer hover:bg-green-600 transition-colors">
                    <FaCamera className="w-3 h-3" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleBrandChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
              {editing ? (
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  placeholder="Enter tags separated by commas"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              ) : (
                <p className="text-sm text-gray-900">{profile.tags || 'No tags added'}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}