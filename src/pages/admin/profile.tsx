import React, { useState, useEffect } from 'react';
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
import { getProfile, updateProfile, updateProfileAvatar, UserProfile } from '@/services/profile';
import { toast } from 'react-toastify';

// Transform API data to UI format
const transformProfileData = (apiProfile: UserProfile) => ({
  name: apiProfile.name || '',
  email: apiProfile.email || '',
  phone: apiProfile.phone || '',
  emailVerified: !!apiProfile.email_verified_at,
  phoneVerified: true, // API doesn't have phone verification field
  businessName: apiProfile.business?.name || 'N/A',
  businessAddress: apiProfile.business?.address || 'N/A',
  businessDescription: apiProfile.business?.description || 'N/A',
  brandIdentity: apiProfile.avatar || 'https://via.placeholder.com/200x100?text=Brand+Logo',
  tags: apiProfile.tags?.join(', ') || ''
});

// Define form data interface
interface FormData {
  name: string;
  email: string;
  phone: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  businessName: string;
  businessAddress: string;
  businessDescription: string;
  brandIdentity: string;
  tags: string;
}

export default function Profile() {
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState<FormData | null>(null);
  const [brandPreview, setBrandPreview] = useState('');
  const [brandFile, setBrandFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch profile data on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const profileData = await getProfile();
        if (profileData) {
          setProfile(profileData);
          const transformedData = transformProfileData(profileData);
          setFormData(transformedData);
          setBrandPreview(transformedData.brandIdentity);
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => prev ? { ...prev, [name]: value } : null);
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

  const handleSave = async () => {
    try {
      if (!profile) return;

      // Update avatar if changed
      let avatarUrl = profile.avatar;
      if (brandFile) {
        const newAvatarUrl = await updateProfileAvatar(brandFile);
        if (newAvatarUrl) {
          avatarUrl = newAvatarUrl;
        }
      }

      // Update profile data
      const updatedProfile = await updateProfile({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        avatar: avatarUrl
      });

      if (updatedProfile) {
        setProfile(updatedProfile);
        const transformedData = transformProfileData(updatedProfile);
        setFormData(transformedData);
        setBrandPreview(transformedData.brandIdentity);
        setBrandFile(null);
        setEditing(false);
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error('Failed to update profile');
    }
  };

  const handleCancel = () => {
    if (profile) {
      const transformedData = transformProfileData(profile);
      setFormData(transformedData);
      setBrandPreview(transformedData.brandIdentity);
    }
    setBrandFile(null);
    setEditing(false);
  };

  if (loading) {
    return (
      <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
          <p className="ml-2 text-sm text-gray-500">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile || !formData) {
    return (
      <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
        <div className="flex items-center justify-center py-12">
          <p className="text-sm text-gray-500">Failed to load profile data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6  bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-1 flex items-center gap-2">
            Profile <span className="text-green-500"></span>
          </h1>
          <p className="text-sm text-gray-500">Manage your profile settings</p>
          {profile && (
            <div className="mt-2 flex items-center gap-4 text-xs text-gray-400">
              <span>User ID: {profile.id}</span>
              <span>•</span>
              <span>Type: {profile.type}</span>
              <span>•</span>
              <span>Products: {profile.product_count}</span>
              {profile.is_admin && (
                <>
                  <span>•</span>
                  <span className="text-green-600 font-medium">Admin</span>
                </>
              )}
            </div>
          )}
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
              <label className="block text-sm font-medium text-gray-700 mb-1 items-center gap-2">
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
              <label className="block text-sm font-medium text-gray-700 mb-1 items-center gap-2">
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
              <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
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
                  {formData.phoneVerified && <FaCheck className="text-green-500 w-4 h-4" />}
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
                  <p className="text-sm text-gray-900">{formData.businessName}</p>
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
                  <p className="text-sm text-gray-900">{formData.businessAddress}</p>
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
                  <p className="text-sm text-gray-900">{formData.businessDescription}</p>
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