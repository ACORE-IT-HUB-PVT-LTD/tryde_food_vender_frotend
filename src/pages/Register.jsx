import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Check, Store, User, FileText, Clock, MapPin, Upload, X } from 'lucide-react';
import axiosInstance from '../api/axiosInstance';

export default function Register() {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    // Vendor Details
    name: '',
    email: '',
    phone: '',
    alternate_phone: '',
    password: '',
    confirmPassword: '',
    description: '',
    vendor_profile: null,
    
    // Restaurant Details
    rejection_reason:'',
    restaurant_name: '',
    restaurant_description: '',
    food_type: '',
    restaurant_address: '',
    restaurant_city: '',
    restaurant_state: '',
    restaurant_pincode: '',
    restaurant_latitude: '',
    restaurant_longitude: '',
    opening_time: '',
    closing_time: '',
    
    // Images - Multiple restaurant images
    restaurant_images: [],
    
    // Legal Documents Images
    fssai_license: null,
    pan_card: null,
    aadhar_card: null,
    business_license: null
  });

  // Preview URLs for images
  const [previews, setPreviews] = useState({
    vendor_profile: null,
    restaurant_images: [],
    fssai_license: null,
    pan_card: null,
    aadhar_card: null,
    business_license: null
  });

  const steps = [
    { id: 1, title: 'Owner Details', icon: User },
    { id: 2, title: 'Restaurant Info', icon: Store },
    { id: 3, title: 'Legal Documents', icon: FileText },
    { id: 4, title: 'Operating Hours', icon: Clock }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  // Handle single image upload
  const handleImageChange = (e, fieldName) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ ...errors, [fieldName]: 'File size should be less than 5MB' });
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors({ ...errors, [fieldName]: 'Please upload only image files' });
        return;
      }

      setFormData({ ...formData, [fieldName]: file });
      setErrors({ ...errors, [fieldName]: '' });
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews({ ...previews, [fieldName]: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle multiple restaurant images
  const handleMultipleImages = (e) => {
    const files = Array.from(e.target.files);
    
    // Limit to 5 images
    if (files.length > 5) {
      setErrors({ ...errors, restaurant_images: 'You can upload maximum 5 images' });
      return;
    }

    // Validate each file
    for (let file of files) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ ...errors, restaurant_images: 'Each file should be less than 5MB' });
        return;
      }
      if (!file.type.startsWith('image/')) {
        setErrors({ ...errors, restaurant_images: 'Please upload only image files' });
        return;
      }
    }

    setFormData({ ...formData, restaurant_images: files });
    setErrors({ ...errors, restaurant_images: '' });

    // Create previews
    const previewUrls = [];
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        previewUrls.push(reader.result);
        if (previewUrls.length === files.length) {
          setPreviews({ ...previews, restaurant_images: previewUrls });
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // Remove image
  const removeImage = (fieldName, index = null) => {
    if (fieldName === 'restaurant_images' && index !== null) {
      const newImages = [...formData.restaurant_images];
      newImages.splice(index, 1);
      const newPreviews = [...previews.restaurant_images];
      newPreviews.splice(index, 1);
      setFormData({ ...formData, restaurant_images: newImages });
      setPreviews({ ...previews, restaurant_images: newPreviews });
    } else {
      setFormData({ ...formData, [fieldName]: null });
      setPreviews({ ...previews, [fieldName]: null });
    }
  };

  // Get current location
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setErrors({ ...errors, location: 'Geolocation is not supported by your browser' });
      return;
    }

    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData({
          ...formData,
          restaurant_latitude: position.coords.latitude.toFixed(8),
          restaurant_longitude: position.coords.longitude.toFixed(8)
        });
        setErrors({ ...errors, location: '' });
        setLocationLoading(false);
        alert('Location captured successfully!');
      },
      (error) => {
        setLocationLoading(false);
        setErrors({ ...errors, location: 'Unable to get location: ' + error.message });
      }
    );
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.name.trim()) newErrors.name = 'Full name is required';
      if (!formData.email.trim()) newErrors.email = 'Email is required';
      if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
      if (formData.phone && formData.phone.length !== 10) newErrors.phone = 'Phone number must be 10 digits';
      if (!formData.password) newErrors.password = 'Password is required';
      if (formData.password && formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
      if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
      if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    }

    if (step === 2) {
      if (!formData.restaurant_name.trim()) newErrors.restaurant_name = 'Restaurant name is required';
      if (!formData.food_type) newErrors.food_type = 'Please select food type';
      if (!formData.restaurant_address.trim()) newErrors.restaurant_address = 'Address is required';
      if (!formData.restaurant_city.trim()) newErrors.restaurant_city = 'City is required';
      if (!formData.restaurant_state.trim()) newErrors.restaurant_state = 'State is required';
      if (!formData.restaurant_pincode.trim()) newErrors.restaurant_pincode = 'Pincode is required';
      if (formData.restaurant_pincode && formData.restaurant_pincode.length !== 6) newErrors.restaurant_pincode = 'Pincode must be 6 digits';
      if (!formData.restaurant_latitude || !formData.restaurant_longitude) {
        newErrors.location = 'Please capture your restaurant location';
      }
    }

    if (step === 4) {
      if (!formData.opening_time) newErrors.opening_time = 'Opening time is required';
      if (!formData.closing_time) newErrors.closing_time = 'Closing time is required';
      if (formData.opening_time && formData.closing_time && formData.opening_time >= formData.closing_time) {
        newErrors.closing_time = 'Closing time must be after opening time';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setErrors({});
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    // Validate final step
    if (!validateStep(4)) {
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      // Create FormData for file upload
      const formDataToSend = new FormData();

      // Append vendor data
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('phone', formData.phone);
      formDataToSend.append('alternate_phone', formData.alternate_phone || '');
      formDataToSend.append('password', formData.password);
      formDataToSend.append('description', formData.description || '');
      
      // Append vendor profile image
      if (formData.vendor_profile) {
        formDataToSend.append('vendor_profile', formData.vendor_profile);
      }

      // Append restaurant data
      formDataToSend.append('restaurant_name', formData.restaurant_name);
      formDataToSend.append('restaurant_description', formData.restaurant_description || '');
      formDataToSend.append('food_type', formData.food_type);
      formDataToSend.append('restaurant_address', formData.restaurant_address);
      formDataToSend.append('restaurant_city', formData.restaurant_city);
      formDataToSend.append('restaurant_state', formData.restaurant_state);
      formDataToSend.append('restaurant_pincode', formData.restaurant_pincode);
      formDataToSend.append('restaurant_latitude', formData.restaurant_latitude);
      formDataToSend.append('restaurant_longitude', formData.restaurant_longitude);
      formDataToSend.append('opening_time', formData.opening_time);
      formDataToSend.append('closing_time', formData.closing_time);

      // Append multiple restaurant images
      if (formData.restaurant_images && formData.restaurant_images.length > 0) {
        formData.restaurant_images.forEach((image) => {
          formDataToSend.append('restaurant_images', image);
        });
      }

      // Append legal document images
      if (formData.fssai_license) {
        formDataToSend.append('fssai_license', formData.fssai_license);
      }
      if (formData.pan_card) {
        formDataToSend.append('pan_card', formData.pan_card);
      }
      if (formData.aadhar_card) {
        formDataToSend.append('aadhar_card', formData.aadhar_card);
      }
      if (formData.business_license) {
        formDataToSend.append('business_license', formData.business_license);
      }

      console.log("Sending registration data...");

      const result = await axiosInstance.post('/restaurants/register', formDataToSend, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log("Registration Response:", result.data);
      
      alert('Registration Successful! Redirecting to login...');
      
      setTimeout(() => {
        navigate('/login');
      }, 1200);
    } catch (error) {
      console.error("Registration Error:", error);
      
      // Handle backend validation errors
      if (error.response?.data?.errors) {
        // If backend returns field-specific errors object
        const backendErrors = {};
        Object.keys(error.response.data.errors).forEach(key => {
          // Handle if error is array (Laravel style) or string
          const errorValue = error.response.data.errors[key];
          backendErrors[key] = Array.isArray(errorValue) ? errorValue[0] : errorValue;
        });
        setErrors(backendErrors);
      } else if (error.response?.data?.message) {
        // If backend returns a general message
        setErrors({ submit: error.response.data.message });
        alert(error.response.data.message);
      } else if (error.message) {
        // Network or other errors
        setErrors({ submit: error.message });
        alert(error.message);
      } else {
        setErrors({ submit: 'Registration failed. Please try again.' });
        alert('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 py-8 px-4 sm:px-6 lg:px-8 font-['Poppins']">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#FF5252] rounded-full mb-4">
            <Store className="text-white" size={32} />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Join Our Platform</h1>
          <p className="text-gray-600">Register your restaurant in just 4 simple steps</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              
              return (
                <React.Fragment key={step.id}>
                  <div className="flex flex-col items-center flex-1">
                    <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all ${
                      isCompleted ? 'bg-green-500' : isActive ? 'bg-[#FF5252]' : 'bg-gray-200'
                    }`}>
                      {isCompleted ? (
                        <Check className="text-white" size={24} />
                      ) : (
                        <Icon className={isActive ? 'text-white' : 'text-gray-400'} size={24} />
                      )}
                    </div>
                    <span className={`text-xs sm:text-sm mt-2 font-medium text-center ${
                      isActive ? 'text-[#FF5252]' : isCompleted ? 'text-green-500' : 'text-gray-400'
                    }`}>
                      {step.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`flex-1 h-1 mx-2 transition-all ${
                      currentStep > step.id ? 'bg-green-500' : 'bg-gray-200'
                    }`} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
          <form onSubmit={handleRegister}>
            
            {/* Step 1: Owner/Vendor Details */}
            {currentStep === 1 && (
              <div className="space-y-4 animate-fadeIn">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Owner Details</h2>
                
                {/* Rejection Reason - Show if exists */}
                {formData.rejection_reason && (
                  <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg mb-6">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        <svg className="w-5 h-5 text-red-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-red-800 mb-1">Previous Registration Rejected</h4>
                        <p className="text-sm text-red-700">
                          <strong>Reason:</strong> {formData.rejection_reason}
                        </p>
                        <p className="text-xs text-red-600 mt-2">
                          Please address the above issue(s) in this registration.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className={`w-full px-4 py-3 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-[#FF5252] focus:border-[#FF5252] outline-none transition-all`}
                    required
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      className={`w-full px-4 py-3 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-[#FF5252] focus:border-[#FF5252] outline-none transition-all`}
                      required
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="10-digit mobile number"
                      maxLength="10"
                      className={`w-full px-4 py-3 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-[#FF5252] focus:border-[#FF5252] outline-none transition-all`}
                      required
                    />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Alternate Phone</label>
                  <input
                    type="tel"
                    name="alternate_phone"
                    value={formData.alternate_phone}
                    onChange={handleChange}
                    placeholder="10-digit alternate number (optional)"
                    maxLength="10"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF5252] focus:border-[#FF5252] outline-none transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Password *</label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Create password (min 6 characters)"
                      className={`w-full px-4 py-3 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-[#FF5252] focus:border-[#FF5252] outline-none transition-all`}
                      required
                    />
                    {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password *</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Re-enter password"
                      className={`w-full px-4 py-3 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-[#FF5252] focus:border-[#FF5252] outline-none transition-all`}
                      required
                    />
                    {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">About You</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Brief description about yourself"
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF5252] focus:border-[#FF5252] outline-none transition-all"
                  />
                </div>

                {/* Profile Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Profile Image</label>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg cursor-pointer hover:bg-gray-200 transition-all">
                      <Upload size={20} />
                      Upload Photo
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageChange(e, 'vendor_profile')}
                        className="hidden"
                      />
                    </label>
                    {previews.vendor_profile && (
                      <div className="relative">
                        <img src={previews.vendor_profile} alt="Profile" className="w-20 h-20 rounded-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeImage('vendor_profile')}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                  {errors.vendor_profile && <p className="text-red-500 text-xs mt-1">{errors.vendor_profile}</p>}
                </div>
              </div>
            )}

            {/* Step 2: Restaurant Info */}
            {currentStep === 2 && (
              <div className="space-y-4 animate-fadeIn">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Restaurant Information</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Restaurant Name *</label>
                  <input
                    type="text"
                    name="restaurant_name"
                    value={formData.restaurant_name}
                    onChange={handleChange}
                    placeholder="Enter your restaurant name"
                    className={`w-full px-4 py-3 border ${errors.restaurant_name ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-[#FF5252] focus:border-[#FF5252] outline-none transition-all`}
                    required
                  />
                  {errors.restaurant_name && <p className="text-red-500 text-xs mt-1">{errors.restaurant_name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Restaurant Description</label>
                  <textarea
                    name="restaurant_description"
                    value={formData.restaurant_description}
                    onChange={handleChange}
                    placeholder="Describe your restaurant (e.g., Mountain Restaurant, Eat and enjoy)"
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF5252] focus:border-[#FF5252] outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Food Type *</label>
                  <select
                    name="food_type"
                    value={formData.food_type}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border ${errors.food_type ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-[#FF5252] focus:border-[#FF5252] outline-none transition-all`}
                    required
                  >
                    <option value="">Select food type</option>
                    <option value="VEG">Veg</option>
                    <option value="NON_VEG">Non-Veg</option>
                    <option value="(veg,non-veg) BOTH">Both (Veg & Non-Veg)</option>
                  </select>
                  {errors.food_type && <p className="text-red-500 text-xs mt-1">{errors.food_type}</p>}
                </div>

                {/* Restaurant Images */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Restaurant Images (Max 5)</label>
                  <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg cursor-pointer hover:bg-gray-200 transition-all w-fit">
                    <Upload size={20} />
                    Upload Images
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleMultipleImages}
                      className="hidden"
                    />
                  </label>
                  {previews.restaurant_images.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 mt-3">
                      {previews.restaurant_images.map((preview, index) => (
                        <div key={index} className="relative">
                          <img src={preview} alt={`Restaurant ${index + 1}`} className="w-full h-24 object-cover rounded-lg" />
                          <button
                            type="button"
                            onClick={() => removeImage('restaurant_images', index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  {errors.restaurant_images && <p className="text-red-500 text-xs mt-1">{errors.restaurant_images}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Address *</label>
                  <textarea
                    name="restaurant_address"
                    value={formData.restaurant_address}
                    onChange={handleChange}
                    placeholder="Enter complete address (e.g., Near D Mart)"
                    rows="3"
                    className={`w-full px-4 py-3 border ${errors.restaurant_address ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-[#FF5252] focus:border-[#FF5252] outline-none transition-all`}
                    required
                  />
                  {errors.restaurant_address && <p className="text-red-500 text-xs mt-1">{errors.restaurant_address}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                    <input
                      type="text"
                      name="restaurant_city"
                      value={formData.restaurant_city}
                      onChange={handleChange}
                      placeholder="City"
                      className={`w-full px-4 py-3 border ${errors.restaurant_city ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-[#FF5252] focus:border-[#FF5252] outline-none transition-all`}
                      required
                    />
                    {errors.restaurant_city && <p className="text-red-500 text-xs mt-1">{errors.restaurant_city}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
                    <input
                      type="text"
                      name="restaurant_state"
                      value={formData.restaurant_state}
                      onChange={handleChange}
                      placeholder="State"
                      className={`w-full px-4 py-3 border ${errors.restaurant_state ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-[#FF5252] focus:border-[#FF5252] outline-none transition-all`}
                      required
                    />
                    {errors.restaurant_state && <p className="text-red-500 text-xs mt-1">{errors.restaurant_state}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Pincode *</label>
                  <input
                    type="text"
                    name="restaurant_pincode"
                    value={formData.restaurant_pincode}
                    onChange={handleChange}
                    placeholder="6-digit pincode"
                    maxLength="6"
                    className={`w-full px-4 py-3 border ${errors.restaurant_pincode ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-[#FF5252] focus:border-[#FF5252] outline-none transition-all`}
                    required
                  />
                  {errors.restaurant_pincode && <p className="text-red-500 text-xs mt-1">{errors.restaurant_pincode}</p>}
                </div>

                {/* Location Capture */}
                <div className={`bg-blue-50 border ${errors.location ? 'border-red-500' : 'border-blue-200'} rounded-lg p-4`}>
                  <div className="flex items-start gap-3">
                    <MapPin className="text-blue-600 mt-1" size={24} />
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-2">Restaurant Location *</h4>
                      <p className="text-sm text-gray-600 mb-3">
                        Click the button below to automatically capture your restaurant's GPS coordinates
                      </p>
                      <button
                        type="button"
                        onClick={getCurrentLocation}
                        disabled={locationLoading}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all disabled:bg-gray-400"
                      >
                        {locationLoading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                            Getting Location...
                          </>
                        ) : (
                          <>
                            <MapPin size={18} />
                            Capture Current Location
                          </>
                        )}
                      </button>
                      {formData.restaurant_latitude && formData.restaurant_longitude && (
                        <div className="mt-3 text-sm text-green-700 bg-green-50 p-2 rounded">
                          ✓ Location captured: {formData.restaurant_latitude}, {formData.restaurant_longitude}
                        </div>
                      )}
                      {errors.location && <p className="text-red-500 text-xs mt-2">{errors.location}</p>}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Latitude *</label>
                    <input
                      type="text"
                      name="restaurant_latitude"
                      value={formData.restaurant_latitude}
                      onChange={handleChange}
                      placeholder="Auto-filled from GPS"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-[#FF5252] focus:border-[#FF5252] outline-none transition-all"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Longitude *</label>
                    <input
                      type="text"
                      name="restaurant_longitude"
                      value={formData.restaurant_longitude}
                      onChange={handleChange}
                      placeholder="Auto-filled from GPS"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-[#FF5252] focus:border-[#FF5252] outline-none transition-all"
                      readOnly
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Legal Documents */}
            {currentStep === 3 && (
              <div className="space-y-6 animate-fadeIn">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Legal Documents</h2>
                
                {/* FSSAI License */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">FSSAI License</label>
                  <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg cursor-pointer hover:bg-gray-200 transition-all w-fit">
                    <Upload size={20} />
                    Upload FSSAI License
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageChange(e, 'fssai_license')}
                      className="hidden"
                    />
                  </label>
                  {previews.fssai_license && (
                    <div className="relative mt-3 w-40">
                      <img src={previews.fssai_license} alt="FSSAI" className="w-full h-32 object-cover rounded-lg" />
                      <button
                        type="button"
                        onClick={() => removeImage('fssai_license')}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )}
                  {errors.fssai_license && <p className="text-red-500 text-xs mt-1">{errors.fssai_license}</p>}
                  <p className="text-xs text-gray-500 mt-1">Required for food business operations</p>
                </div>

                {/* PAN Card */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">PAN Card</label>
                  <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg cursor-pointer hover:bg-gray-200 transition-all w-fit">
                    <Upload size={20} />
                    Upload PAN Card
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageChange(e, 'pan_card')}
                      className="hidden"
                    />
                  </label>
                  {previews.pan_card && (
                    <div className="relative mt-3 w-40">
                      <img src={previews.pan_card} alt="PAN" className="w-full h-32 object-cover rounded-lg" />
                      <button
                        type="button"
                        onClick={() => removeImage('pan_card')}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )}
                  {errors.pan_card && <p className="text-red-500 text-xs mt-1">{errors.pan_card}</p>}
                </div>

                {/* Aadhar Card */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Aadhar Card</label>
                  <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg cursor-pointer hover:bg-gray-200 transition-all w-fit">
                    <Upload size={20} />
                    Upload Aadhar Card
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageChange(e, 'aadhar_card')}
                      className="hidden"
                    />
                  </label>
                  {previews.aadhar_card && (
                    <div className="relative mt-3 w-40">
                      <img src={previews.aadhar_card} alt="Aadhar" className="w-full h-32 object-cover rounded-lg" />
                      <button
                        type="button"
                        onClick={() => removeImage('aadhar_card')}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )}
                  {errors.aadhar_card && <p className="text-red-500 text-xs mt-1">{errors.aadhar_card}</p>}
                </div>

                {/* Business License */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Business License</label>
                  <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg cursor-pointer hover:bg-gray-200 transition-all w-fit">
                    <Upload size={20} />
                    Upload Business License
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageChange(e, 'business_license')}
                      className="hidden"
                    />
                  </label>
                  {previews.business_license && (
                    <div className="relative mt-3 w-40">
                      <img src={previews.business_license} alt="Business License" className="w-full h-32 object-cover rounded-lg" />
                      <button
                        type="button"
                        onClick={() => removeImage('business_license')}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )}
                  {errors.business_license && <p className="text-red-500 text-xs mt-1">{errors.business_license}</p>}
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-6">
                  <p className="text-sm text-yellow-800">
                    <strong>Note:</strong> Document uploads can be completed later from your dashboard. You can proceed without uploading now.
                  </p>
                </div>
              </div>
            )}

            {/* Step 4: Operating Hours */}
            {currentStep === 4 && (
              <div className="space-y-4 animate-fadeIn">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Operating Hours & Review</h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Opening Time *</label>
                    <input
                      type="time"
                      name="opening_time"
                      value={formData.opening_time}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border ${errors.opening_time ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-[#FF5252] focus:border-[#FF5252] outline-none transition-all`}
                      required
                    />
                    {errors.opening_time && <p className="text-red-500 text-xs mt-1">{errors.opening_time}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Closing Time *</label>
                    <input
                      type="time"
                      name="closing_time"
                      value={formData.closing_time}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border ${errors.closing_time ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-[#FF5252] focus:border-[#FF5252] outline-none transition-all`}
                      required
                    />
                    {errors.closing_time && <p className="text-red-500 text-xs mt-1">{errors.closing_time}</p>}
                  </div>
                </div>

                {/* General submit error */}
                {errors.submit && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-sm text-red-700">{errors.submit}</p>
                  </div>
                )}

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                  <p className="text-sm text-blue-800">
                    <strong>Ready to Submit!</strong> Your restaurant will be reviewed by our team. You'll receive a confirmation email once approved.
                  </p>
                </div>

                <div className="mt-6 space-y-2">
                  <h3 className="font-semibold text-gray-900">Review Your Information:</h3>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
                    <p><strong>Owner:</strong> {formData.name}</p>
                    <p><strong>Email:</strong> {formData.email}</p>
                    <p><strong>Phone:</strong> {formData.phone}</p>
                    <p><strong>Restaurant:</strong> {formData.restaurant_name}</p>
                    <p><strong>Location:</strong> {formData.restaurant_city}, {formData.restaurant_state} - {formData.restaurant_pincode}</p>
                    <p><strong>Food Type:</strong> {formData.food_type}</p>
                    <p><strong>Coordinates:</strong> {formData.restaurant_latitude}, {formData.restaurant_longitude}</p>
                    <p><strong>Timings:</strong> {formData.opening_time || 'Not set'} - {formData.closing_time || 'Not set'}</p>
                    <p><strong>Profile Image:</strong> {formData.vendor_profile ? '✓ Uploaded' : '✗ Not uploaded'}</p>
                    <p><strong>Restaurant Images:</strong> {formData.restaurant_images.length} image(s)</p>
                    <p><strong>Documents:</strong> 
                      {formData.fssai_license && ' FSSAI ✓'}
                      {formData.pan_card && ' PAN ✓'}
                      {formData.aadhar_card && ' Aadhar ✓'}
                      {formData.business_license && ' Business License ✓'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handlePrev}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                  currentStep === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                disabled={currentStep === 1}
              >
                <ArrowLeft size={20} />
                Previous
              </button>

              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex items-center gap-2 px-6 py-3 bg-[#FF5252] text-white rounded-lg font-semibold hover:bg-[#ff3838] transition-all hover:shadow-lg"
                >
                  Next
                  <ArrowRight size={20} />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-all hover:shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Check size={20} />
                      Submit Registration
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Footer Note */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Already registered? <a href="/login" className="text-[#FF5252] font-semibold hover:underline">Login here</a>
        </p>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}























// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { ArrowRight, ArrowLeft, Check, Store, User, FileText, Clock, MapPin, Upload, X } from 'lucide-react';
// import axiosInstance from '../api/axiosInstance';

// export default function Register() {
//   const [currentStep, setCurrentStep] = useState(1);
//   const [loading, setLoading] = useState(false);
//   const [locationLoading, setLocationLoading] = useState(false);
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     // Vendor fields
//     name: '',
//     email: '',
//     phone: '',
//     alternate_phone: '',
//     password: '',
//     confirmPassword: '',
//     description: '', // vendor description ("hiii")

//     // Restaurant fields – exact backend names
//     restaurant_name: '',
//     restaurant_description: '', // restaurant description
//     food_type: '',
//     restaurant_address: '',
//     restaurant_city: '',
//     restaurant_state: '',
//     restaurant_pincode: '',
//     restaurant_latitude: '',
//     restaurant_longitude: '',
//     opening_time: '08:00',
//     closing_time: '22:00',

//     // Files
//     vendor_profile: null,
//     restaurant_images: [], // multiple
//     aadhar_card: null,
//     pan_card: null,
//     business_license: null,
//     fssai_license: null,

//     // Only for display if rejected before
//     rejection_reason: '',
//   });

//   const [previews, setPreviews] = useState({
//     vendor_profile: null,
//     restaurant_images: [],
//     aadhar_card: null,
//     pan_card: null,
//     business_license: null,
//     fssai_license: null,
//   });

//   const steps = [
//     { id: 1, title: 'Owner Details', icon: User },
//     { id: 2, title: 'Restaurant Info', icon: Store },
//     { id: 3, title: 'Legal Documents', icon: FileText },
//     { id: 4, title: 'Operating Hours', icon: Clock },
//   ];

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSingleFile = (e, field) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     if (file.size > 5 * 1024 * 1024) return alert('File too large (max 5MB)');
//     if (!file.type.startsWith('image/')) return alert('Only images allowed');

//     setFormData(prev => ({ ...prev, [field]: file }));

//     const reader = new FileReader();
//     reader.onloadend = () => {
//       setPreviews(prev => ({ ...prev, [field]: reader.result }));
//     };
//     reader.readAsDataURL(file);
//   };

//   const handleMultipleFiles = (e) => {
//     const files = Array.from(e.target.files || []);
//     if (files.length > 5) return alert('Maximum 5 images allowed');

//     for (const file of files) {
//       if (file.size > 5 * 1024 * 1024) return alert('Each file max 5MB');
//       if (!file.type.startsWith('image/')) return alert('Only images allowed');
//     }

//     setFormData(prev => ({ ...prev, restaurant_images: files }));

//     const previewsList = [];
//     let loaded = 0;

//     files.forEach(file => {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         previewsList.push(reader.result);
//         loaded++;
//         if (loaded === files.length) {
//           setPreviews(prev => ({ ...prev, restaurant_images: previewsList }));
//         }
//       };
//       reader.readAsDataURL(file);
//     });
//   };

//   const removeFile = (field, index = null) => {
//     if (field === 'restaurant_images' && index !== null) {
//       setFormData(prev => ({
//         ...prev,
//         restaurant_images: prev.restaurant_images.filter((_, i) => i !== index),
//       }));
//       setPreviews(prev => ({
//         ...prev,
//         restaurant_images: prev.restaurant_images.filter((_, i) => i !== index),
//       }));
//     } else {
//       setFormData(prev => ({ ...prev, [field]: null }));
//       setPreviews(prev => ({ ...prev, [field]: null }));
//     }
//   };

//   const getCurrentLocation = () => {
//     if (!navigator.geolocation) return alert('Geolocation not supported');

//     setLocationLoading(true);
//     navigator.geolocation.getCurrentPosition(
//       pos => {
//         setFormData({
//           ...formData,
//           restaurant_latitude: pos.coords.latitude.toFixed(8),
//           restaurant_longitude: pos.coords.longitude.toFixed(8),
//         });
//         setLocationLoading(false);
//       },
//       err => {
//         alert(`Location error: ${err.message}`);
//         setLocationLoading(false);
//       }
//     );
//   };

//   const handleNext = () => setCurrentStep(p => Math.min(p + 1, 4));
//   const handlePrev = () => setCurrentStep(p => Math.max(p - 1, 1));

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (formData.password !== formData.confirmPassword) {
//       alert("Passwords don't match");
//       return;
//     }

//     if (!formData.restaurant_latitude || !formData.restaurant_longitude) {
//       alert('Please capture restaurant location');
//       return;
//     }

//     setLoading(true);

//     try {
//       const fd = new FormData();

//       // Vendor
//       fd.append('name', formData.name);
//       fd.append('email', formData.email);
//       fd.append('phone', formData.phone);
//       fd.append('alternate_phone', formData.alternate_phone || '');
//       fd.append('password', formData.password);
//       fd.append('description', formData.description || '');

//       if (formData.vendor_profile) {
//         fd.append('vendor_profile', formData.vendor_profile);
//       }

//       // Restaurant
//       fd.append('restaurant_name', formData.restaurant_name);
//       fd.append('restaurant_description', formData.restaurant_description || '');
//       fd.append('food_type', formData.food_type);
//       fd.append('restaurant_address', formData.restaurant_address);
//       fd.append('restaurant_city', formData.restaurant_city);
//       fd.append('restaurant_state', formData.restaurant_state);
//       fd.append('restaurant_pincode', formData.restaurant_pincode);
//       fd.append('restaurant_latitude', formData.restaurant_latitude);
//       fd.append('restaurant_longitude', formData.restaurant_longitude);
//       fd.append('opening_time', formData.opening_time);
//       fd.append('closing_time', formData.closing_time);

//       formData.restaurant_images.forEach(file => {
//         fd.append('restaurant_images', file);
//       });

//       // Documents
//       if (formData.aadhar_card)       fd.append('aadhar_card', formData.aadhar_card);
//       if (formData.pan_card)          fd.append('pan_card', formData.pan_card);
//       if (formData.business_license)  fd.append('business_license', formData.business_license);
//       if (formData.fssai_license)     fd.append('fssai_license', formData.fssai_license);

//       const response = await axiosInstance.post('/restaurants/register', fd, {
//         headers: { 'Content-Type': 'multipart/form-data' },
//       });
//      console.log(response.data);
//       alert(
//         `Registration successful!\n\n${response.data.message}\nRestaurant: ${response.data.restaurant?.restaurent_name || formData.restaurant_name}\nStatus: Under review\n\nRedirecting to login...`
//       );

//       setTimeout(() => navigate('/login'), 1800);
//     } catch (err) {
//       console.error(err);
//       const msg = err.response?.data?.message || 'Registration failed. Please check all fields and try again.';
//       alert(msg);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 py-8 px-4 sm:px-6 lg:px-8 font-['Poppins']">
//       <div className="max-w-4xl mx-auto">
//         {/* Header */}
//         <div className="text-center mb-8">
//           <div className="inline-flex items-center justify-center w-16 h-16 bg-[#FF5252] rounded-full mb-4">
//             <Store className="text-white" size={32} />
//           </div>
//           <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Join Our Platform</h1>
//           <p className="text-gray-600">Register your restaurant in just 4 simple steps</p>
//         </div>

//         {/* Progress */}
//         <div className="mb-8">
//           <div className="flex items-center justify-between">
//             {steps.map((step, idx) => {
//               const Icon = step.icon;
//               const isActive = currentStep === step.id;
//               const isDone = currentStep > step.id;
//               return (
//                 <React.Fragment key={step.id}>
//                   <div className="flex flex-col items-center flex-1">
//                     <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all ${
//                       isDone ? 'bg-green-500' : isActive ? 'bg-[#FF5252]' : 'bg-gray-200'
//                     }`}>
//                       {isDone ? <Check className="text-white" size={24} /> : <Icon className={isActive ? 'text-white' : 'text-gray-400'} size={24} />}
//                     </div>
//                     <span className={`text-xs sm:text-sm mt-2 font-medium ${isActive ? 'text-[#FF5252]' : isDone ? 'text-green-500' : 'text-gray-400'}`}>
//                       {step.title}
//                     </span>
//                   </div>
//                   {idx < steps.length - 1 && (
//                     <div className={`flex-1 h-1 mx-2 ${currentStep > step.id ? 'bg-green-500' : 'bg-gray-200'}`} />
//                   )}
//                 </React.Fragment>
//               );
//             })}
//           </div>
//         </div>

//         <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
//           <form onSubmit={handleSubmit}>

//             {currentStep === 1 && (
//               <div className="space-y-5 animate-fadeIn">
//                 <h2 className="text-2xl font-bold mb-6">Owner Details</h2>

//                 {formData.rejection_reason && (
//                   <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
//                     <p className="font-medium text-red-800">Rejection reason:</p>
//                     <p className="text-red-700">{formData.rejection_reason}</p>
//                   </div>
//                 )}

//                 <div>
//                   <label className="block text-sm font-medium mb-1.5">Full Name *</label>
//                   <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF5252] focus:border-transparent" />
//                 </div>

//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium mb-1.5">Email *</label>
//                     <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF5252] focus:border-transparent" />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium mb-1.5">Phone *</label>
//                     <input type="tel" name="phone" maxLength={10} value={formData.phone} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF5252] focus:border-transparent" />
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium mb-1.5">Alternate Phone</label>
//                   <input type="tel" name="alternate_phone" maxLength={10} value={formData.alternate_phone} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF5252] focus:border-transparent" />
//                 </div>

//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium mb-1.5">Password *</label>
//                     <input type="password" name="password" value={formData.password} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF5252] focus:border-transparent" />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium mb-1.5">Confirm Password *</label>
//                     <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF5252] focus:border-transparent" />
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium mb-1.5">About You (Vendor Description)</label>
//                   <textarea name="description" value={formData.description} onChange={handleChange} rows={3} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF5252] focus:border-transparent" placeholder="hiii..." />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium mb-1.5">Profile Photo</label>
//                   <div className="flex items-center gap-4">
//                     <label className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200">
//                       <Upload size={18} /> Upload
//                       <input type="file" accept="image/*" className="hidden" onChange={e => handleSingleFile(e, 'vendor_profile')} />
//                     </label>
//                     {previews.vendor_profile && (
//                       <div className="relative">
//                         <img src={previews.vendor_profile} alt="profile" className="w-16 h-16 rounded-full object-cover" />
//                         <button type="button" onClick={() => removeFile('vendor_profile')} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1">
//                           <X size={14} />
//                         </button>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             )}

//             {currentStep === 2 && (
//               <div className="space-y-5 animate-fadeIn">
//                 <h2 className="text-2xl font-bold mb-6">Restaurant Information</h2>

//                 <div>
//                   <label className="block text-sm font-medium mb-1.5">Restaurant Name *</label>
//                   <input type="text" name="restaurant_name" value={formData.restaurant_name} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF5252] focus:border-transparent" />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium mb-1.5">Restaurant Description</label>
//                   <textarea name="restaurant_description" value={formData.restaurant_description} onChange={handleChange} rows={3} placeholder="Mountain Restaurant, Eat and enjoy" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF5252] focus:border-transparent" />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium mb-1.5">Food Type *</label>
//                   <select name="food_type" value={formData.food_type} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF5252] focus:border-transparent">
//                     <option value="">Select type</option>
//                     <option value="VEG">Veg Only</option>
//                     <option value="NON_VEG">Non-Veg Only</option>
//                     <option value="(veg,non-veg) BOTH">Both Veg & Non-Veg</option>
//                   </select>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium mb-1.5">Restaurant Images (max 5)</label>
//                   <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200">
//                     <Upload size={18} /> Upload Images
//                     <input type="file" accept="image/*" multiple className="hidden" onChange={handleMultipleFiles} />
//                   </label>
//                   {previews.restaurant_images.length > 0 && (
//                     <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-4">
//                       {previews.restaurant_images.map((src, i) => (
//                         <div key={i} className="relative">
//                           <img src={src} alt={`img-${i}`} className="w-full h-24 object-cover rounded-lg" />
//                           <button type="button" onClick={() => removeFile('restaurant_images', i)} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1">
//                             <X size={14} />
//                           </button>
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium mb-1.5">Full Address *</label>
//                   <textarea name="restaurant_address" value={formData.restaurant_address} onChange={handleChange} required rows={3} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF5252] focus:border-transparent" />
//                 </div>

//                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium mb-1.5">City *</label>
//                     <input type="text" name="restaurant_city" value={formData.restaurant_city} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF5252] focus:border-transparent" />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium mb-1.5">State *</label>
//                     <input type="text" name="restaurant_state" value={formData.restaurant_state} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF5252] focus:border-transparent" />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium mb-1.5">Pincode *</label>
//                     <input type="text" name="restaurant_pincode" maxLength={6} value={formData.restaurant_pincode} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF5252] focus:border-transparent" />
//                   </div>
//                 </div>

//                 <div className="bg-blue-50 p-5 rounded-xl border border-blue-100">
//                   <div className="flex items-start gap-3">
//                     <MapPin className="text-blue-600 mt-1" size={24} />
//                     <div className="flex-1">
//                       <h4 className="font-semibold">Restaurant Location *</h4>
//                       <button
//                         type="button"
//                         onClick={getCurrentLocation}
//                         disabled={locationLoading}
//                         className={`mt-3 flex items-center gap-2 px-5 py-2.5 rounded-lg text-white font-medium ${
//                           locationLoading ? 'bg-blue-400 cursor-wait' : 'bg-blue-600 hover:bg-blue-700'
//                         }`}
//                       >
//                         {locationLoading ? 'Fetching...' : 'Get Current Location'}
//                       </button>
//                       {formData.restaurant_latitude && formData.restaurant_longitude && (
//                         <div className="mt-3 text-sm text-green-700">
//                           Location set: {formData.restaurant_latitude}, {formData.restaurant_longitude}
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium mb-1.5">Latitude</label>
//                     <input type="text" value={formData.restaurant_latitude} readOnly className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg" />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium mb-1.5">Longitude</label>
//                     <input type="text" value={formData.restaurant_longitude} readOnly className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg" />
//                   </div>
//                 </div>
//               </div>
//             )}

//             {currentStep === 3 && (
//               <div className="space-y-6 animate-fadeIn">
//                 <h2 className="text-2xl font-bold mb-6">Legal Documents</h2>

//                 {['aadhar_card', 'pan_card', 'business_license', 'fssai_license'].map(field => (
//                   <div key={field}>
//                     <label className="block text-sm font-medium mb-2 capitalize">{field.replace('_', ' ')}</label>
//                     <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 bg-gray-100 rounded-lg hover:bg-gray-200">
//                       <Upload size={18} /> Upload
//                       <input type="file" accept="image/*" className="hidden" onChange={e => handleSingleFile(e, field)} />
//                     </label>
//                     {previews[field] && (
//                       <div className="mt-3 relative inline-block">
//                         <img src={previews[field]} alt={field} className="max-h-40 rounded-lg shadow-sm" />
//                         <button type="button" onClick={() => removeFile(field)} className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1.5">
//                           <X size={14} />
//                         </button>
//                       </div>
//                     )}
//                   </div>
//                 ))}

//                 <div className="bg-yellow-50 border border-yellow-200 p-4 rounded text-sm text-yellow-800">
//                   Documents are required for approval but can be added later from dashboard.
//                 </div>
//               </div>
//             )}

//             {currentStep === 4 && (
//               <div className="space-y-6 animate-fadeIn">
//                 <h2 className="text-2xl font-bold mb-6">Operating Hours & Review</h2>

//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
//                   <div>
//                     <label className="block text-sm font-medium mb-1.5">Opening Time *</label>
//                     <input type="time" name="opening_time" value={formData.opening_time} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF5252] focus:border-transparent" />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium mb-1.5">Closing Time *</label>
//                     <input type="time" name="closing_time" value={formData.closing_time} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF5252] focus:border-transparent" />
//                   </div>
//                 </div>

//                 <div className="bg-green-50 border border-green-100 p-5 rounded-xl mt-6">
//                   <h3 className="font-semibold text-green-800 mb-3">Ready to Submit</h3>
//                   <p className="text-green-700 text-sm">
//                     Your restaurant will be reviewed by our team. You will receive update via email.
//                   </p>
//                 </div>

//                 <div className="mt-6">
//                   <h3 className="font-semibold mb-3">Quick Review:</h3>
//                   <div className="bg-gray-50 p-5 rounded-xl text-sm space-y-2">
//                     <p><strong>Owner:</strong> {formData.name || '—'}</p>
//                     <p><strong>Restaurant:</strong> {formData.restaurant_name || '—'}</p>
//                     <p><strong>Description:</strong> {formData.restaurant_description || '—'}</p>
//                     <p><strong>Food Type:</strong> {formData.food_type || '—'}</p>
//                     <p><strong>Address:</strong> {formData.restaurant_address ? `${formData.restaurant_address}, ${formData.restaurant_city}, ${formData.restaurant_state} ${formData.restaurant_pincode}` : '—'}</p>
//                     <p><strong>Timings:</strong> {formData.opening_time} – {formData.closing_time}</p>
//                     <p><strong>Coordinates:</strong> {formData.restaurant_latitude || '—'}, {formData.restaurant_longitude || '—'}</p>
//                     <p><strong>Images:</strong> {formData.restaurant_images.length} uploaded</p>
//                   </div>
//                 </div>
//               </div>
//             )}

//             <div className="flex justify-between mt-10 pt-6 border-t">
//               <button
//                 type="button"
//                 onClick={handlePrev}
//                 disabled={currentStep === 1}
//                 className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium ${
//                   currentStep === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-200 hover:bg-gray-300'
//                 }`}
//               >
//                 <ArrowLeft size={18} /> Previous
//               </button>

//               {currentStep < 4 ? (
//                 <button
//                   type="button"
//                   onClick={handleNext}
//                   className="flex items-center gap-2 px-6 py-3 bg-[#FF5252] text-white rounded-lg hover:bg-red-600 font-medium"
//                 >
//                   Next <ArrowRight size={18} />
//                 </button>
//               ) : (
//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className={`flex items-center gap-2 px-8 py-3 rounded-lg font-medium text-white ${
//                     loading ? 'bg-green-400 cursor-wait' : 'bg-green-600 hover:bg-green-700'
//                   }`}
//                 >
//                   {loading ? (
//                     <>
//                       <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
//                       Submitting...
//                     </>
//                   ) : (
//                     <>
//                       <Check size={18} /> Submit Registration
//                     </>
//                   )}
//                 </button>
//               )}
//             </div>
//           </form>
//         </div>

//         <p className="text-center text-sm text-gray-500 mt-8">
//           Already have an account? <a href="/login" className="text-[#FF5252] font-medium hover:underline">Login</a>
//         </p>
//       </div>

//       <style>{`
//         .animate-fadeIn {
//           animation: fadeIn 0.4s ease-out;
//         }
//         @keyframes fadeIn {
//           from { opacity: 0; transform: translateY(8px); }
//           to { opacity: 1; transform: translateY(0); }
//         }
//       `}</style>
//     </div>
//   );
// }