// src/pages/RestaurantProfile.jsx
import React, { useState } from 'react';
import { Button } from '@mui/material';

const RestaurantProfile = () => {
  const [formData, setFormData] = useState({
    name: '', logo: '', cover: '', description: '', address: '', opening: '', closing: '', type: 'Both', prepTime: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Save profile
    alert('Profile Saved');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-[#FF5252]">Restaurant Profile</h2>
      {Object.keys(formData).map((key) => (
        key === 'type' ? (
          <select key={key} name={key} value={formData[key]} onChange={handleChange} className="w-full p-2 mb-4 border rounded">
            <option>Veg</option>
            <option>Non-Veg</option>
            <option>Both</option>
          </select>
        ) : (
          <input key={key} name={key} value={formData[key]} onChange={handleChange} placeholder={key.charAt(0).toUpperCase() + key.slice(1)} className="w-full p-2 mb-4 border rounded" type={key.includes('Image') || key.includes('logo') ? 'file' : 'text'} />
        )
      ))}
      <Button type="submit" variant="contained" style={{ backgroundColor: '#FF5252' }}>Save</Button>
    </form>
  );
};

export default RestaurantProfile;