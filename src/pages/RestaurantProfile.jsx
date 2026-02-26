import React, { useContext, useState, useEffect } from 'react';
import { Star, MapPin, Clock, Upload, Utensils, Save, Edit2, Navigation } from 'lucide-react';
import { RestaurantContext } from '../context/getRestaurant';
import axiosInstance from '../api/axiosInstance';
import { IoIosDocument } from 'react-icons/io';
import { RxCross1 } from 'react-icons/rx';
import { VscPreview } from 'react-icons/vsc';
import { FaLocationDot } from "react-icons/fa6";

import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
function RestaurantProfile() {
  const {
    restaurant: contextRestaurant,
    loading,
    setRestaurant: updateContextRestaurant
  } = useContext(RestaurantContext);

  const [restaurant, setRestaurant] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [showDocument, setShowDocument] = useState(false);
  const [documentUrl, setDocumentUrl] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (contextRestaurant) {
      setRestaurant(contextRestaurant);
    }
  }, [contextRestaurant]);

  const formatTime = (time) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  });

  const redIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });


  const MapClickHandler = ({ onChange }) => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        onChange({
          target: { name: 'latitude', value: lat.toFixed(6) }
        });
        onChange({
          target: { name: 'longitude', value: lng.toFixed(6) }
        });
      },
    });
    return null;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setRestaurant((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedImage(file);
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setUploadingImage(selectedImage ? true : false);

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();

      if (selectedImage) {
        formData.append('restaurant_images', selectedImage);
      }

      formData.append('restaurent_name', restaurant.restaurent_name || '');
      formData.append('description', restaurant.description || '');
      formData.append('food_type', restaurant.food_type || '');
      formData.append('address', restaurant.address || '');
      formData.append('city', restaurant.city || '');
      formData.append('state', restaurant.state || '');
      formData.append('pincode', restaurant.pincode || '');
      formData.append('latitude', restaurant.latitude || '');
      formData.append('longitude', restaurant.longitude || '');
      formData.append('opening_time', restaurant.opening_time || '');
      formData.append('closing_time', restaurant.closing_time || '');
      formData.append('is_open', restaurant.is_open ? 'true' : 'false');

      const response = await axiosInstance.put(
        `/restaurants/${restaurant.id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data && response.data.restaurant) {
        setRestaurant(response.data.restaurant);

        if (updateContextRestaurant) {
          updateContextRestaurant(response.data.restaurant);
        }

        setSelectedImage(null);
        setImagePreview(null);
        setIsEditing(false);
        alert('Profile updated successfully!');
      }
    } catch (error) {
      console.error('Error updating restaurant:', error);

      if (error.response) {
        alert(
          `Failed to update profile: ${error.response.data.message || error.response.statusText}`
        );
      } else if (error.request) {
        alert('Failed to update profile: No response from server');
      } else {
        alert('Failed to update profile: ' + error.message);
      }
    } finally {
      setIsSaving(false);
      setUploadingImage(false);
    }
  };

  const handleCancel = () => {
    if (contextRestaurant) {
      setRestaurant(contextRestaurant);
    }

    setSelectedImage(null);
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
      setImagePreview(null);
    }

    setIsEditing(false);
  };

  const openDocument = (url) => {
    setDocumentUrl(url);
    setShowDocument(true);
  };

  const closeDocument = () => {
    setShowDocument(false);
    setDocumentUrl(null);
  };

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const getDisplayImage = () => {
    if (imagePreview) {
      return imagePreview;
    }
    return restaurant.restaurent_images;
  };

  if (loading || !restaurant) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-[#FF5252] border-r-transparent"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading restaurant profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 font-['Poppins']">
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
              Restaurant Profile
            </h1>
            <p className="mt-1.5 text-gray-600">
              Manage your restaurant details and visibility
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {isEditing ? (
              <>
                <button
                  onClick={handleCancel}
                  disabled={isSaving}
                  className="rounded-lg border-2 border-gray-300 bg-white px-6 py-2.5 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 hover:border-gray-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex items-center gap-2 rounded-lg bg-[#FF5252] px-6 py-2.5 text-sm font-semibold text-white shadow-lg hover:bg-[#e63939] hover:shadow-xl active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? (
                    <>
                      <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-r-transparent"></div>
                      {uploadingImage ? 'Uploading...' : 'Saving...'}
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
                className="flex items-center gap-2 rounded-lg bg-[#FF5252] px-6 py-2.5 text-sm font-semibold text-white shadow-lg hover:bg-[#e63939] hover:shadow-xl active:scale-95 transition-all"
              >
                <Edit2 size={18} />
                Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* Status Badges */}
        {restaurant.status && (
          <div className="mb-6 flex flex-wrap gap-2.5">
            <span
              className={`inline-flex items-center rounded-lg px-4 py-2 text-sm font-semibold shadow-sm ${restaurant.status === 'APPROVED'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : restaurant.status === 'PENDING'
                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                  : 'bg-rose-50 text-rose-700 border border-rose-200'
                }`}
            >
              Status: {restaurant.status}
            </span>
            {restaurant.is_active && (
              <span className="inline-flex items-center rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 shadow-sm">
                Active
              </span>
            )}
          </div>
        )}

        {/* Main Card */}
        <div className="overflow-hidden rounded-2xl bg-white shadow-2xl border border-gray-200">
          {/* Hero Banner - Full Width & Height */}
          <div className="relative h-72 sm:h-80 md:h-96 lg:h-[450px] w-full overflow-hidden bg-gradient-to-br from-[#FF5252] to-[#ff8080]">

            {getDisplayImage() ? (
              <>
                <img
                  src={getDisplayImage()}
                  alt="Restaurant Banner"
                  className="absolute inset-0 w-full h-full object-cover object-center"
                  style={{ objectPosition: 'center' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              </>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-white/70 text-lg font-medium">No banner image uploaded</p>
              </div>
            )}

            {/* Upload Badge */}
            {selectedImage && (
              <div className="absolute top-6 right-6 z-20 animate-pulse">
                <div className="bg-amber-500 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-xl border-2 border-white">
                  New Image Selected - Save to Upload
                </div>
              </div>
            )}

            {/* Bottom Content */}
            <div className="absolute bottom-0 left-0 right-0 z-10 p-6 md:p-8 lg:p-10">
              {isEditing && (
                <label className="mb-4 inline-flex cursor-pointer items-center gap-2.5 rounded-lg bg-white/95 backdrop-blur-md px-5 py-2.5 text-sm font-semibold text-gray-800 shadow-lg hover:bg-white hover:shadow-xl transition-all border border-white/40">
                  <Upload size={18} className="text-[#FF5252]" />
                  {selectedImage ? 'Change Photo' : 'Upload Banner'}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    disabled={isSaving}
                    className="hidden"
                  />
                </label>
              )}

              <div className="mt-2">
                {isEditing ? (
                  <input
                    type="text"
                    name="restaurent_name"
                    value={restaurant.restaurent_name}
                    onChange={handleChange}
                    className="w-full max-w-3xl bg-white/10 backdrop-blur-sm text-white text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight outline-none placeholder:text-white/50 border-b-2 border-white/40 focus:border-white transition-colors pb-3 px-2"
                    placeholder="Restaurant Name"
                  />
                ) : (
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white drop-shadow-2xl tracking-tight">
                    {restaurant.restaurent_name}
                  </h2>
                )}
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid gap-8 p-6 md:grid-cols-2 md:p-10 lg:p-12">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Description */}
              {(restaurant.description || isEditing) && (
                <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                  <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">
                    Description
                  </label>
                  {isEditing ? (
                    <textarea
                      name="description"
                      value={restaurant.description || ''}
                      onChange={handleChange}
                      rows={4}
                      className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 shadow-sm resize-none transition-all placeholder:text-gray-400 hover:border-gray-400 focus:outline-none focus:border-[#FF5252] focus:ring-0 text-gray-700"
                      placeholder="Enter restaurant description"
                    />
                  ) : (
                    <p className="text-base leading-relaxed text-gray-700">
                      {restaurant.description}
                    </p>
                  )}
                </div>
              )}

              {/* Rating */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-[#FF5252] to-[#ff6b6b] px-5 py-2.5 text-white shadow-lg">
                  <Star size={20} fill="white" strokeWidth={0} />
                  <span className="text-lg font-bold">
                    {parseFloat(restaurant.rating || 0).toFixed(1)}
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-600">
                  ({restaurant.total_reviews || 0} reviews)
                </span>
              </div>

              {/* Food Type */}
              {(restaurant.food_type || isEditing) && (
                <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                  <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">
                    Food Type
                  </label>
                  {isEditing ? (
                    <select
                      name="food_type"
                      value={restaurant.food_type || ''}
                      onChange={handleChange}
                      className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 shadow-sm transition-all hover:border-gray-400 focus:outline-none focus:border-[#FF5252] focus:ring-0 text-gray-700 font-medium"
                    >
                      <option value="">Select Food Type</option>
                      <option value="VEG">VEG</option>
                      <option value="NON_VEG">NON_VEG</option>
                      <option value="(veg,non-veg) BOTH">BOTH</option>
                    </select>
                  ) : (
                    <div className="flex items-center gap-2.5 text-gray-800 font-semibold">
                      <Utensils size={20} className="text-[#FF5252]" />
                      {restaurant.food_type}
                    </div>
                  )}
                </div>
              )}

              {/* Address */}
              <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">
                  Address
                </label>
                {isEditing ? (
                  <>
                    <input
                      type="text"
                      name="address"
                      value={restaurant.address || ''}
                      onChange={handleChange}
                      placeholder="Street Address"
                      className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 shadow-sm transition-all placeholder:text-gray-400 hover:border-gray-400 focus:outline-none focus:border-[#FF5252] focus:ring-0 text-gray-700"
                    />
                    <div className="grid grid-cols-3 gap-3 mt-3">
                      <input
                        type="text"
                        name="city"
                        value={restaurant.city || ''}
                        onChange={handleChange}
                        placeholder="City"
                        className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 shadow-sm transition-all placeholder:text-gray-400 hover:border-gray-400 focus:outline-none focus:border-[#FF5252] focus:ring-0 text-gray-700"
                      />
                      <input
                        type="text"
                        name="state"
                        value={restaurant.state || ''}
                        onChange={handleChange}
                        placeholder="State"
                        className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 shadow-sm transition-all placeholder:text-gray-400 hover:border-gray-400 focus:outline-none focus:border-[#FF5252] focus:ring-0 text-gray-700"
                      />
                      <input
                        type="text"
                        name="pincode"
                        value={restaurant.pincode || ''}
                        onChange={handleChange}
                        placeholder="Pincode"
                        className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 shadow-sm transition-all placeholder:text-gray-400 hover:border-gray-400 focus:outline-none focus:border-[#FF5252] focus:ring-0 text-gray-700"
                      />
                    </div>
                  </>
                ) : (
                  <div className="flex items-start gap-3 text-gray-700">
                    <MapPin size={22} className="mt-0.5 flex-shrink-0 text-[#FF5252]" />
                    <span className="leading-relaxed font-medium">
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
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

                  {/* Header */}
                  <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-[#E83E3E]/10 rounded-lg flex items-center justify-center">
                        <MapPin size={16} className="text-[#E83E3E]" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-800">GPS Coordinates</p>
                        <p className="text-xs text-gray-400">
                          {isEditing ? 'Map pe click karke location set karo' : 'Restaurant location'}
                        </p>
                      </div>
                    </div>

                    {/* Current coords badge */}
                    {restaurant.latitude && restaurant.longitude && (
                      <div className="hidden sm:flex items-center gap-1.5 bg-gray-50 border border-gray-100 rounded-xl px-3 py-1.5 font-mono text-xs text-gray-500">
                        <Navigation size={11} className="text-[#E83E3E]" />
                        {parseFloat(restaurant.latitude).toFixed(4)},&nbsp;
                        {parseFloat(restaurant.longitude).toFixed(4)}
                      </div>
                    )}
                  </div>

                  {/* Map */}
                  {(restaurant.latitude && restaurant.longitude) ? (
                    <div className="relative" style={{ height: '260px' }}>
                      <MapContainer
                        key={`${restaurant.latitude}-${restaurant.longitude}`}
                        center={[parseFloat(restaurant.latitude), parseFloat(restaurant.longitude)]}
                        zoom={15}
                        style={{ height: '100%', width: '100%', zIndex: 0 }}
                        scrollWheelZoom={false}
                        attributionControl={false}
                      >
                        <TileLayer
                          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        {isEditing && <MapClickHandler onChange={handleChange} />}
                        <Marker
                          position={[parseFloat(restaurant.latitude), parseFloat(restaurant.longitude)]}
                          icon={redIcon}
                        >
                          <Popup>
                            <div className="text-sm font-medium text-gray-700 py-0.5 flex flex-col items-center justify-center">
                              <div className="flex items-center justify-center gap-1.5">
                                <FaLocationDot size={16} className="text-red-500" />
                                <span>{restaurant.name || "Restaurant"}</span>
                              </div>
                              <img src={restaurant.restaurent_images} alt='resaurent image' />
                            </div>
                          </Popup>
                        </Marker>
                      </MapContainer>

                      {/* Edit hint overlay */}
                      {isEditing && (
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-[999] bg-black/70 text-white text-xs px-3 py-1.5 rounded-full pointer-events-none backdrop-blur-sm">
                          🗺️ Tap on the map to change the location
                        </div>
                      )}
                    </div>
                  ) : (
                    /* No coords yet — placeholder */
                    <div className="flex flex-col items-center justify-center h-40 bg-gray-50 text-gray-400">
                      <MapPin size={32} className="mb-2 opacity-30" />
                      <p className="text-sm font-medium">  No location has been set yet.
                      </p>
                      <p className="text-xs mt-0.5">  Please enter the latitude and longitude below.
                      </p>
                    </div>
                  )}

                  {/* Input fields */}
                  <div className="px-5 py-4">
                    {isEditing ? (
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-semibold text-gray-500 mb-1 block">Latitude</label>
                          <input
                            type="text"
                            name="latitude"
                            value={restaurant.latitude || ''}
                            onChange={handleChange}
                            placeholder="e.g. 28.613939"
                            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm font-mono text-gray-700 placeholder:text-gray-300 focus:outline-none focus:border-[#E83E3E] focus:bg-white transition-all"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-gray-500 mb-1 block">Longitude</label>
                          <input
                            type="text"
                            name="longitude"
                            value={restaurant.longitude || ''}
                            onChange={handleChange}
                            placeholder="e.g. 77.209021"
                            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm font-mono text-gray-700 placeholder:text-gray-300 focus:outline-none focus:border-[#E83E3E] focus:bg-white transition-all"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { label: 'Latitude', val: restaurant.latitude },
                          { label: 'Longitude', val: restaurant.longitude },
                        ].map(({ label, val }) => (
                          <div key={label} className="bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
                            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide mb-1">{label}</p>
                            <p className="text-sm font-mono font-semibold text-gray-700">{val || '—'}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Operating Hours */}
              {(restaurant.opening_time || restaurant.closing_time || isEditing) && (
                <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                  <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">
                    Operating Hours
                  </label>
                  {isEditing ? (
                    <>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                            Opening
                          </label>
                          <input
                            type="time"
                            name="opening_time"
                            value={restaurant.opening_time || ''}
                            onChange={handleChange}
                            className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 shadow-sm transition-all hover:border-gray-400 focus:outline-none focus:border-[#FF5252] focus:ring-0 text-gray-700 font-medium"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                            Closing
                          </label>
                          <input
                            type="time"
                            name="closing_time"
                            value={restaurant.closing_time || ''}
                            onChange={handleChange}
                            className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 shadow-sm transition-all hover:border-gray-400 focus:outline-none focus:border-[#FF5252] focus:ring-0 text-gray-700 font-medium"
                          />
                        </div>
                      </div>
                      <div className="mt-4 bg-white rounded-lg p-3 border border-gray-300">
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            name="is_open"
                            checked={restaurant.is_open || false}
                            onChange={handleChange}
                            className="w-5 h-5 rounded border-2 border-gray-300 text-[#FF5252] focus:outline-none focus:ring-2 focus:ring-[#FF5252] focus:ring-offset-0 cursor-pointer"
                          />
                          <span className="text-sm font-semibold text-gray-700">
                            Currently Open for Business
                          </span>
                        </label>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center gap-3 text-gray-700">
                      <Clock size={22} className="text-[#FF5252]" />
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span
                          className={`font-bold text-base ${restaurant.is_open ? 'text-emerald-600' : 'text-rose-600'
                            }`}
                        >
                          {restaurant.is_open ? 'Open Now' : 'Closed'}
                        </span>
                        <span className="text-gray-400">•</span>
                        <span className="font-medium">
                          {formatTime(restaurant.opening_time)} - {formatTime(restaurant.closing_time)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Documents Section */}
              <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                <label className="block text-sm font-bold text-gray-700 mb-4 uppercase tracking-wide">
                  Documents
                </label>
                <div className="space-y-3">
                  {restaurant.fssai_license && (
                    <div className="bg-white rounded-lg p-4 border border-gray-300 hover:border-[#FF5252] transition-colors">
                      <p className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">
                        FSSAI License
                      </p>
                      <button
                        onClick={() => openDocument(restaurant.fssai_license)}
                        className="flex items-center gap-2 text-sm text-[#FF5252] hover:text-[#e63939] font-semibold transition-colors"
                      >
                        <IoIosDocument size={20} />
                        View Document
                      </button>
                    </div>
                  )}

                  {restaurant.business_license && (
                    <div className="bg-white rounded-lg p-4 border border-gray-300 hover:border-[#FF5252] transition-colors">
                      <p className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">
                        Business License
                      </p>
                      <button
                        onClick={() => openDocument(restaurant.business_license)}
                        className="flex items-center gap-2 text-sm text-[#FF5252] hover:text-[#e63939] font-semibold transition-colors"
                      >
                        <IoIosDocument size={20} />
                        View Document
                      </button>
                    </div>
                  )}

                  {restaurant.pan_card && (
                    <div className="bg-white rounded-lg p-4 border border-gray-300 hover:border-[#FF5252] transition-colors">
                      <p className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">
                        PAN Card
                      </p>
                      <button
                        onClick={() => openDocument(restaurant.pan_card)}
                        className="flex items-center gap-2 text-sm text-[#FF5252] hover:text-[#e63939] font-semibold transition-colors"
                      >
                        <IoIosDocument size={20} />
                        View Document
                      </button>
                    </div>
                  )}

                  {restaurant.aadhar_card && (
                    <div className="bg-white rounded-lg p-4 border border-gray-300 hover:border-[#FF5252] transition-colors">
                      <p className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">
                        Aadhar Card
                      </p>
                      <button
                        onClick={() => openDocument(restaurant.aadhar_card)}
                        className="flex items-center gap-2 text-sm text-[#FF5252] hover:text-[#e63939] font-semibold transition-colors"
                      >
                        <IoIosDocument size={20} />
                        View Document
                      </button>
                    </div>
                  )}

                  {!restaurant.fssai_license &&
                    !restaurant.business_license &&
                    !restaurant.pan_card &&
                    !restaurant.aadhar_card && (
                      <p className="text-sm text-gray-500 italic text-center py-4">
                        No documents uploaded yet
                      </p>
                    )}
                </div>
              </div>
            </div>
          </div>

          {/* Rejection Reason */}
          {restaurant.rejection_reason && (
            <div className="border-t-2 border-rose-200 bg-gradient-to-r from-rose-50 to-red-50 p-6 md:p-10">
              <h3 className="text-lg font-bold text-rose-800 mb-3 flex items-center gap-2">
                <span className="inline-block w-2 h-2 bg-rose-600 rounded-full"></span>
                Rejection Reason
              </h3>
              <p className="text-rose-700 leading-relaxed font-medium">
                {restaurant.rejection_reason}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Document Preview Modal */}
      {showDocument && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={closeDocument}
        >
          <div
            className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 bg-gradient-to-r from-[#FF5252] to-[#ff6b6b]">
              <div className="flex items-center gap-2 text-white">
                <VscPreview className="text-xl" />
                <h3 className="text-base font-semibold">Document Preview</h3>
              </div>

              <button
                onClick={closeDocument}
                className="p-1.5 rounded-full hover:bg-white/20 transition-colors text-white"
                aria-label="Close"
              >
                <RxCross1 className="text-lg" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 bg-gray-100 flex items-center justify-center">
              <img
                src={documentUrl}
                alt="Document"
                className="w-full max-h-[60vh] h-auto object-contain rounded-lg shadow-md border border-gray-200"
                loading="lazy"
              />
            </div>

            {/* Footer */}
            <div className="px-5 py-3 bg-white border-t flex justify-end">
              <button
                onClick={closeDocument}
                className="px-4 py-2 bg-gray-200 text-gray-800 hover:bg-gray-300 rounded-lg transition-colors text-sm font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default RestaurantProfile;