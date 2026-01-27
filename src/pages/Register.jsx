import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';          // ← Yeh line add karo
import { ArrowRight, ArrowLeft, Check, Store, User, FileText, CreditCard } from 'lucide-react';

export default function Register() {
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();                       // ← Hook add kiya

  const [formData, setFormData] = useState({
    restaurantName: '',
    cuisineType: '',
    ownerName: '',
    mobile: '',
    email: '',
    password: '',
    confirmPassword: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    gst: '',
    fssai: '',
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    panNumber: ''
  });

  const steps = [
    { id: 1, title: 'Restaurant Info', icon: Store },
    { id: 2, title: 'Owner Details', icon: User },
    { id: 3, title: 'Legal Documents', icon: FileText },
    { id: 4, title: 'Bank Details', icon: CreditCard }
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleRegister = (e) => {
    e.preventDefault();

    // Yahaan real app mein API call karoge
    // Abhi mock + redirect to login

    alert('Registration Successful! Redirecting to login...');

    // Optional: thoda delay dikhane ke liye (real mein remove kar sakte ho)
    setTimeout(() => {
      navigate('/login');           // ← Yahaan login page pe redirect
    }, 1200);
  };

  return (
    <>
      {/* Poppins font import - ye line index.html ke <head> mein daal dena */}
      {/* <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@500;600;700;800&display=swap" rel="stylesheet"> */}

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
            <form onSubmit={handleRegister}>    {/* ← yahaan <div> ko <form> banaya (better semantics) */}
              
              {/* Step 1: Restaurant Info */}
              {currentStep === 1 && (
                <div className="space-y-4 animate-fadeIn">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Restaurant Information</h2>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Restaurant Name *</label>
                    <input
                      type="text"
                      name="restaurantName"
                      value={formData.restaurantName}
                      onChange={handleChange}
                      placeholder="Enter your restaurant name"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF5252] focus:border-transparent transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Cuisine Type *</label>
                    <select
                      name="cuisineType"
                      value={formData.cuisineType}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF5252] focus:border-transparent transition-all"
                      required
                    >
                      <option value="">Select cuisine type</option>
                      <option value="Indian">Indian</option>
                      <option value="Chinese">Chinese</option>
                      <option value="Italian">Italian</option>
                      <option value="Continental">Continental</option>
                      <option value="Fast Food">Fast Food</option>
                      <option value="Multi-Cuisine">Multi-Cuisine</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="City"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF5252] focus:border-transparent transition-all"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        placeholder="State"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF5252] focus:border-transparent transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Address *</label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Enter complete address"
                      rows="3"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF5252] focus:border-transparent transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Pincode *</label>
                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                      placeholder="6-digit pincode"
                      maxLength="6"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF5252] focus:border-transparent transition-all"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Owner Details */}
              {currentStep === 2 && (
                <div className="space-y-4 animate-fadeIn">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Owner Details</h2>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Owner Name *</label>
                    <input
                      type="text"
                      name="ownerName"
                      value={formData.ownerName}
                      onChange={handleChange}
                      placeholder="Full name"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF5252] focus:border-transparent transition-all"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Number *</label>
                      <input
                        type="tel"
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleChange}
                        placeholder="10-digit mobile number"
                        maxLength="10"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF5252] focus:border-transparent transition-all"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="your@email.com"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF5252] focus:border-transparent transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Password *</label>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Create password"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF5252] focus:border-transparent transition-all"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password *</label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Re-enter password"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF5252] focus:border-transparent transition-all"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Legal Documents */}
              {currentStep === 3 && (
                <div className="space-y-4 animate-fadeIn">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Legal Documents</h2>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">FSSAI License Number *</label>
                    <input
                      type="text"
                      name="fssai"
                      value={formData.fssai}
                      onChange={handleChange}
                      placeholder="14-digit FSSAI number"
                      maxLength="14"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF5252] focus:border-transparent transition-all"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">Required for food business operations</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">GST Number (Optional)</label>
                    <input
                      type="text"
                      name="gst"
                      value={formData.gst}
                      onChange={handleChange}
                      placeholder="15-character GST number"
                      maxLength="15"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF5252] focus:border-transparent transition-all"
                    />
                    <p className="text-xs text-gray-500 mt-1">Required if annual turnover exceeds ₹20 lakhs</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">PAN Number *</label>
                    <input
                      type="text"
                      name="panNumber"
                      value={formData.panNumber}
                      onChange={handleChange}
                      placeholder="10-character PAN"
                      maxLength="10"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF5252] focus:border-transparent transition-all uppercase"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Step 4: Bank Details */}
              {currentStep === 4 && (
                <div className="space-y-4 animate-fadeIn">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Bank Details</h2>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bank Name *</label>
                    <input
                      type="text"
                      name="bankName"
                      value={formData.bankName}
                      onChange={handleChange}
                      placeholder="Enter bank name"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF5252] focus:border-transparent transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Account Number *</label>
                    <input
                      type="text"
                      name="accountNumber"
                      value={formData.accountNumber}
                      onChange={handleChange}
                      placeholder="Bank account number"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF5252] focus:border-transparent transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">IFSC Code *</label>
                    <input
                      type="text"
                      name="ifscCode"
                      value={formData.ifscCode}
                      onChange={handleChange}
                      placeholder="11-character IFSC code"
                      maxLength="11"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF5252] focus:border-transparent transition-all uppercase"
                      required
                    />
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                    <p className="text-sm text-blue-800">
                      <strong>Note:</strong> Bank details are required for receiving payments and settlements. Please ensure the information is accurate.
                    </p>
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
                    type="submit"                    // ← Important: type="submit" rakha
                    className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-all hover:shadow-lg"
                  >
                    <Check size={20} />
                    Submit & Verify
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
    </>
  );
}