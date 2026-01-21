// src/pages/Register.jsx (Added for flow)
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = ({ setIsAuthenticated }) => {
  const [formData, setFormData] = useState({
    restaurantName: '', ownerName: '', mobile: '', email: '', password: '', address: '', city: '', gst: '', fssai: '', bankDetails: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = (e) => {
    e.preventDefault();
    // Mock OTP verify and register
    localStorage.setItem('token', 'mock-token');
    setIsAuthenticated(true);
    navigate('/profile'); // Go to profile setup after register
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleRegister} className="bg-white p-8 rounded-lg shadow-md w-96 overflow-y-auto max-h-[80vh]">
        <h2 className="text-2xl font-bold mb-6 text-[#FF5252]">Register</h2>
        {Object.keys(formData).map((key) => (
          <input key={key} name={key} value={formData[key]} onChange={handleChange} placeholder={key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')} className="w-full p-2 mb-4 border rounded" required={key !== 'gst'} />
        ))}
        <button type="submit" className="w-full bg-[#FF5252] text-white p-2 rounded">Register & Verify OTP</button>
      </form>
    </div>
  );
};

export default Register;