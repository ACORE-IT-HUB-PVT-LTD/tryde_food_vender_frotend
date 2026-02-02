import React, { useContext, useState, useEffect } from 'react';
import { Star, MapPin, Clock, Phone, Globe, Save, Edit2, Upload, Utensils } from 'lucide-react';
import { RestaurantContext } from '../context/getRestaurant';
import axios from 'axios';
import axiosInstance from '../api/axiosInstance';

function RestaurantProfile() {
  const { restaurant: contextRestaurant, loading, setRestaurant: updateContextRestaurant } = useContext(RestaurantContext);
  const [restaurant, setRestaurant] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Initialize local state when context restaurant data is available
  useEffect(() => {
    if (contextRestaurant) {
      setRestaurant(contextRestaurant);
    }
  }, [contextRestaurant]);

  // Format time from 24-hour format to 12-hour format
  const formatTime = (time) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setRestaurant((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Show preview immediately
    const previewUrl = URL.createObjectURL(file);
    setRestaurant((prev) => ({ ...prev, restaurent_images: previewUrl }));
    
    // Upload to backend
    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      const token = localStorage.getItem("token");

      // Note: You may need to adjust this endpoint based on your backend
      // This assumes you have an endpoint to upload images\
      const response = await axiosInstance.post(`/restaurants/${restaurant.id}`,formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${token}`,

          },
        }
      );
      
      // Update with the actual uploaded image URL
      if (response.data && response.data.imageUrl) {
        setRestaurant((prev) => ({ 
          ...prev, 
          restaurent_images: response.data.imageUrl 
        }));
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
      // Revert to original image on error
      setRestaurant((prev) => ({ 
        ...prev, 
        restaurent_images: contextRestaurant.restaurent_images 
      }));
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      // Prepare the data for the PUT request
      const updateData = {
        restaurent_name: restaurant.restaurent_name,
        description: restaurant.description,
        food_type: restaurant.food_type,
        restaurent_images: restaurant.restaurent_images,
        address: restaurant.address,
        city: restaurant.city,
        state: restaurant.state,
        pincode: restaurant.pincode,
        latitude: restaurant.latitude,
        longitude: restaurant.longitude,
        opening_time: restaurant.opening_time,
        closing_time: restaurant.closing_time,
        is_open: restaurant.is_open,
      };

      const token=localStorage.getItem("token")
      // Make PUT request to update restaurant
      const response = await axiosInstance.put(
        `/restaurants/${restaurant.id}`,
        updateData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        }
      );

      if (response.data && response.data.restaurant) {
        // Update both local state and context with the response data
        setRestaurant(response.data.restaurant);
        if (updateContextRestaurant) {
          updateContextRestaurant(response.data.restaurant);
        }
        
        setIsEditing(false);
        alert('Profile updated successfully!');
      }
    } catch (error) {
      console.error('Error updating restaurant:', error);
      
      // Show more detailed error message
      if (error.response) {
        alert(`Failed to update profile: ${error.response.data.message || error.response.statusText}`);
      } else if (error.request) {
        alert('Failed to update profile: No response from server');
      } else {
        alert('Failed to update profile: ' + error.message);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset to original context data
    if (contextRestaurant) {
      setRestaurant(contextRestaurant);
    }
    setIsEditing(false);
  };

  // Loading state
  if (loading || !restaurant) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-[#FF5252] border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Loading restaurant profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-['Poppins']">
      <div className="mx-auto max-w-6xl px-4 py-8 md:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900 md:text-4xl">
              Restaurant Profile
            </h1>
            <p className="mt-2 text-gray-600">
              Update your restaurant details visible to customers on the app
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            {isEditing ? (
              <>
                <button
                  onClick={handleCancel}
                  disabled={isSaving}
                  className="rounded-xl border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving || uploadingImage}
                  className="flex items-center gap-2.5 rounded-xl bg-[#FF5252] px-7 py-3 text-sm font-medium text-white shadow-md hover:bg-[#e63939] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? (
                    <>
                      <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-r-transparent"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={18} />
                      Save Changes
                    </>
                  )}
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2.5 rounded-xl border-2 border-[#FF5252] bg-white px-7 py-3 text-sm font-medium text-[#FF5252] shadow-sm hover:bg-[#FF5252]/5 transition-all duration-200"
              >
                <Edit2 size={18} />
                Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* Status Badge */}
        {restaurant.status && (
          <div className="mb-6">
            <span className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-medium ${
              restaurant.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
              restaurant.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              Status: {restaurant.status}
            </span>
            {restaurant.is_active && (
              <span className="ml-3 inline-flex items-center rounded-full px-4 py-2 text-sm font-medium bg-green-100 text-green-800">
                Active
              </span>
            )}
          </div>
        )}

        {/* Main Card */}
        <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-xl">
          {/* Hero Banner */}
          <div className="relative h-64 overflow-hidden bg-gradient-to-br from-[#FF5252] to-[#ff7a7a] md:h-72">
            {restaurant.restaurent_images && (
              <>
                <img
                  src={restaurant.restaurent_images}
                  alt="Restaurant Banner"
                  className="absolute inset-0 h-full w-full object-cover opacity-90"
                />
                <div className="absolute inset-0 bg-black/30" />
              </>
            )}
            {uploadingImage && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-20">
                <div className="text-center text-white">
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-white border-r-transparent mb-2"></div>
                  <p>Uploading image...</p>
                </div>
              </div>
            )}
            <div className="relative z-10 flex h-full flex-col justify-end p-6 md:p-10 text-white">
              {isEditing && (
                <label className="mb-4 flex cursor-pointer items-center gap-2 rounded-lg bg-white/20 px-4 py-2 text-sm backdrop-blur-sm hover:bg-white/30 transition w-fit">
                  <Upload size={18} />
                  {uploadingImage ? 'Uploading...' : 'Change Banner Photo'}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    disabled={uploadingImage}
                    className="hidden"
                  />
                </label>
              )}
              {isEditing ? (
                <input
                  type="text"
                  name="restaurent_name"
                  value={restaurant.restaurent_name}
                  onChange={handleChange}
                  className="w-full bg-transparent text-4xl font-bold tracking-tight outline-none placeholder:text-white/60 focus:border-b-2 focus:border-white/70"
                  placeholder="Restaurant Name"
                />
              ) : (
                <h2 className="text-4xl font-bold tracking-tight drop-shadow-lg md:text-5xl">
                  {restaurant.restaurent_name}
                </h2>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="grid gap-8 p-6 md:grid-cols-2 md:p-10">
            {/* Left Column */}
            <div className="space-y-8">
              {/* Description */}
              {(restaurant.description || isEditing) && (
                <div>
                  <label className="block text-sm font-medium text-gray-600">Description</label>
                  {isEditing ? (
                    <textarea
                      name="description"
                      value={restaurant.description || ''}
                      onChange={handleChange}
                      rows={3}
                      className="mt-2 w-full rounded-xl border-gray-300 shadow-sm focus:border-[#FF5252] focus:ring-[#FF5252]/30 transition resize-none"
                      placeholder="Enter restaurant description"
                    />
                  ) : (
                    <p className="mt-2 text-lg font-medium text-gray-800">{restaurant.description}</p>
                  )}
                </div>
              )}

              {/* Rating */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 rounded-xl bg-[#FF5252] px-4 py-2 text-white shadow-sm">
                  <Star size={18} fill="white" />
                  <span className="font-semibold">{parseFloat(restaurant.rating || 0).toFixed(1)}</span>
                </div>
                <span className="text-sm text-gray-600">
                  ({restaurant.total_reviews || 0} reviews)
                </span>
              </div>

              {/* Food Type */}
              {(restaurant.food_type || isEditing) && (
                <div>
                  <label className="block text-sm font-medium text-gray-600">Food Type</label>
                  {isEditing ? (
                    <select
                      name="food_type"
                      value={restaurant.food_type || ''}
                      onChange={handleChange}
                      className="mt-2 w-full rounded-xl border-gray-300 shadow-sm focus:border-[#FF5252] focus:ring-[#FF5252]/30 transition"
                    >
                      <option value="">Select Food Type</option>
                      <option value="VEG">VEG</option>
                      <option value="NON_VEG">NON_VEG</option>
                      <option value="BOTH">BOTH</option>
                    </select>
                  ) : (
                    <div className="mt-2 flex items-center gap-2 text-gray-700">
                      <Utensils size={18} className="text-[#FF5252]" />
                      {restaurant.food_type}
                    </div>
                  )}
                </div>
              )}

              {/* Full Address */}
              <div>
                <label className="block text-sm font-medium text-gray-600">Address</label>
                {isEditing ? (
                  <>
                    <input
                      type="text"
                      name="address"
                      value={restaurant.address || ''}
                      onChange={handleChange}
                      placeholder="Street Address"
                      className="mt-2 w-full rounded-xl border-gray-300 shadow-sm focus:border-[#FF5252] focus:ring-[#FF5252]/30 transition"
                    />
                    <div className="grid grid-cols-3 gap-3 mt-3">
                      <input
                        type="text"
                        name="city"
                        value={restaurant.city || ''}
                        onChange={handleChange}
                        placeholder="City"
                        className="w-full rounded-xl border-gray-300 shadow-sm focus:border-[#FF5252] focus:ring-[#FF5252]/30 transition"
                      />
                      <input
                        type="text"
                        name="state"
                        value={restaurant.state || ''}
                        onChange={handleChange}
                        placeholder="State"
                        className="w-full rounded-xl border-gray-300 shadow-sm focus:border-[#FF5252] focus:ring-[#FF5252]/30 transition"
                      />
                      <input
                        type="text"
                        name="pincode"
                        value={restaurant.pincode || ''}
                        onChange={handleChange}
                        placeholder="Pincode"
                        className="w-full rounded-xl border-gray-300 shadow-sm focus:border-[#FF5252] focus:ring-[#FF5252]/30 transition"
                      />
                    </div>
                  </>
                ) : (
                  <div className="mt-2 flex items-start gap-3 text-gray-700">
                    <MapPin size={20} className="mt-1 flex-shrink-0 text-[#FF5252]" />
                    <span>
                      {restaurant.address}
                      {restaurant.city && `, ${restaurant.city}`}
                      {restaurant.state && `, ${restaurant.state}`}
                      {restaurant.pincode && ` - ${restaurant.pincode}`}
                    </span>
                  </div>
                )}
              </div>

              {/* Location Coordinates */}
              {(restaurant.latitude || restaurant.longitude || isEditing) && (
                <div>
                  <label className="block text-sm font-medium text-gray-600">Location Coordinates</label>
                  {isEditing ? (
                    <div className="grid grid-cols-2 gap-3 mt-2">
                      <input
                        type="text"
                        name="latitude"
                        value={restaurant.latitude || ''}
                        onChange={handleChange}
                        placeholder="Latitude"
                        className="w-full rounded-xl border-gray-300 shadow-sm focus:border-[#FF5252] focus:ring-[#FF5252]/30 transition"
                      />
                      <input
                        type="text"
                        name="longitude"
                        value={restaurant.longitude || ''}
                        onChange={handleChange}
                        placeholder="Longitude"
                        className="w-full rounded-xl border-gray-300 shadow-sm focus:border-[#FF5252] focus:ring-[#FF5252]/30 transition"
                      />
                    </div>
                  ) : (
                    <div className="mt-2 text-sm text-gray-700">
                      <p>Latitude: {restaurant.latitude}</p>
                      <p>Longitude: {restaurant.longitude}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              {/* Operating Hours */}
              {(restaurant.opening_time || restaurant.closing_time || isEditing) && (
                <div>
                  <label className="block text-sm font-medium text-gray-600">Operating Hours</label>
                  {isEditing ? (
                    <>
                      <div className="grid grid-cols-2 gap-3 mt-2">
                        <input
                          type="time"
                          name="opening_time"
                          value={restaurant.opening_time || ''}
                          onChange={handleChange}
                          className="w-full rounded-xl border-gray-300 shadow-sm focus:border-[#FF5252] focus:ring-[#FF5252]/30 transition"
                        />
                        <input
                          type="time"
                          name="closing_time"
                          value={restaurant.closing_time || ''}
                          onChange={handleChange}
                          className="w-full rounded-xl border-gray-300 shadow-sm focus:border-[#FF5252] focus:ring-[#FF5252]/30 transition"
                        />
                      </div>
                      <div className="mt-3">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            name="is_open"
                            checked={restaurant.is_open || false}
                            onChange={handleChange}
                            className="rounded border-gray-300 text-[#FF5252] focus:ring-[#FF5252]/30"
                          />
                          <span className="text-sm text-gray-700">Currently Open</span>
                        </label>
                      </div>
                    </>
                  ) : (
                    <div className="mt-2 flex items-center gap-3 text-gray-700">
                      <Clock size={20} className="text-[#FF5252]" />
                      <span className={restaurant.is_open ? "font-medium text-green-600" : "font-medium text-red-600"}>
                        {restaurant.is_open ? "Open Now" : "Closed"}
                      </span>
                      <span>• {formatTime(restaurant.opening_time)} – {formatTime(restaurant.closing_time)}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Documents Section */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-3">Documents</label>
                <div className="space-y-3">
                  {restaurant.fssai_license && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">FSSAI License</p>
                      <a 
                        href={restaurant.fssai_license} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="block text-sm text-[#FF5252] hover:underline break-all"
                      >
                        📄 View Document
                      </a>
                    </div>
                  )}
                  
                  {restaurant.business_license && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Business License</p>
                      <a 
                        href={restaurant.business_license} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="block text-sm text-[#FF5252] hover:underline break-all"
                      >
                        📄 View Document
                      </a>
                    </div>
                  )}
                  
                  {restaurant.pan_card && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">PAN Card</p>
                      <a 
                        href={restaurant.pan_card} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="block text-sm text-[#FF5252] hover:underline break-all"
                      >
                        📄 View Document
                      </a>
                    </div>
                  )}
                  
                  {restaurant.aadhar_card && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Aadhar Card</p>
                      <a 
                        href={restaurant.aadhar_card} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="block text-sm text-[#FF5252] hover:underline break-all"
                      >
                        📄 View Document
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Rejection Reason (if any) */}
          {restaurant.rejection_reason && (
            <div className="border-t bg-red-50 p-6 md:p-10">
              <h3 className="text-lg font-semibold text-red-800 mb-2">Rejection Reason</h3>
              <p className="text-red-700">{restaurant.rejection_reason}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default RestaurantProfile;