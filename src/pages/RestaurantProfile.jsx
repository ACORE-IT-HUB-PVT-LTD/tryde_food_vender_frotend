import React, { useContext, useState, useEffect } from 'react';
import { Star, MapPin, Clock, Upload, Utensils, Save, Edit2, Navigation, Building2, CheckCircle2, AlertTriangle, X, FileText, Eye, Sparkles } from 'lucide-react';
import { RestaurantContext } from '../context/getRestaurant';
import axiosInstance from '../api/axiosInstance';
import { IoIosDocument } from 'react-icons/io';
import { RxCross1 } from 'react-icons/rx';
import { VscPreview } from 'react-icons/vsc';
import { FaLocationDot, FaLeaf, FaDrumstickBite } from "react-icons/fa6";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

const Toast = ({ msg, type, onClose }) => {
  if (!msg) return null;
  const ok = type === 'success';
  return (
    <div className={`fixed top-5 right-5 z-[200] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl border max-w-sm
        ${ok ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-red-50 border-red-200 text-[#E53935]'}`}
      style={{ animation: 'slideRight 0.3s cubic-bezier(0.16,1,0.3,1)', fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
      {ok ? <CheckCircle2 size={17} className="flex-shrink-0" /> : <AlertTriangle size={17} className="flex-shrink-0" />}
      <p className="text-[13px] font-semibold flex-1">{msg}</p>
      <button onClick={onClose} className="opacity-60 hover:opacity-100"><X size={14} /></button>
    </div>
  );
};

const inputCls = "w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-[13.5px] text-gray-700 placeholder-gray-400 outline-none focus:bg-white focus:border-[#E53935]/50 focus:ring-2 focus:ring-[#E53935]/10 transition-all duration-200";

function RestaurantProfile() {
  const { restaurant: contextRestaurant, loading, setRestaurant: updateContextRestaurant } = useContext(RestaurantContext);
  const [restaurant, setRestaurant] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [showDocument, setShowDocument] = useState(false);
  const [documentUrl, setDocumentUrl] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [toast, setToast] = useState({ msg: '', type: 'success' });

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: '' }), 4000);
  };

  useEffect(() => { if (contextRestaurant) setRestaurant(contextRestaurant); }, [contextRestaurant]);

  const formatTime = (time) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    return `${hour % 12 || 12}:${minutes} ${hour >= 12 ? 'PM' : 'AM'}`;
  };

  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  });

  const redIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41],
  });

  const MapClickHandler = ({ onChange }) => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        onChange({ target: { name: 'latitude', value: lat.toFixed(6) } });
        onChange({ target: { name: 'longitude', value: lng.toFixed(6) } });
      },
    });
    return null;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setRestaurant((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setUploadingImage(!!selectedImage);
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      if (selectedImage) formData.append('restaurant_images', selectedImage);
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
      const response = await axiosInstance.put(`/restaurants/${restaurant.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` },
      });
      if (response.data && response.data.restaurant) {
        setRestaurant(response.data.restaurant);
        if (updateContextRestaurant) updateContextRestaurant(response.data.restaurant);
        setSelectedImage(null); setImagePreview(null); setIsEditing(false);
        showToast('Profile updated successfully!', 'success');
      }
    } catch (error) {
      showToast(error?.response?.data?.message || 'Failed to update profile', 'error');
    } finally { setIsSaving(false); setUploadingImage(false); }
  };

  const handleCancel = () => {
    if (contextRestaurant) setRestaurant(contextRestaurant);
    setSelectedImage(null);
    if (imagePreview) { URL.revokeObjectURL(imagePreview); setImagePreview(null); }
    setIsEditing(false);
  };

  const openDocument = (url) => { setDocumentUrl(url); setShowDocument(true); };
  const closeDocument = () => { setShowDocument(false); setDocumentUrl(null); };

  useEffect(() => { return () => { if (imagePreview) URL.revokeObjectURL(imagePreview); }; }, [imagePreview]);

  const getDisplayImage = () => imagePreview || restaurant.restaurent_images;

  const docs = [
    { label: 'FSSAI License', url: restaurant?.fssai_license },
    { label: 'Business License', url: restaurant?.business_license },
    { label: 'PAN Card', url: restaurant?.pan_card },
    { label: 'Aadhar Card', url: restaurant?.aadhar_card },
  ].filter((d) => d.url);

  if (loading || !restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full border-4 border-red-100 animate-spin border-t-[#E53935]" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Building2 size={20} className="text-[#E53935] animate-pulse" />
            </div>
          </div>
          <p className="text-[13px] text-gray-400 font-medium">Loading restaurant profile…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 sm:p-6" style={{ fontFamily: "'Plus Jakarta Sans','DM Sans',sans-serif" }}>
      <Toast msg={toast.msg} type={toast.type} onClose={() => setToast({ msg: '' })} />

      <div className="max-w-7xl mx-auto space-y-6">

        {/* ── Page Header ── */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#E53935] to-[#FF7043] flex items-center justify-center shadow-md shadow-red-500/25">
              <Building2 size={20} className="text-white" strokeWidth={2} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <div className="w-1 h-5 rounded-full bg-gradient-to-b from-[#E53935] to-[#FF7043]" />
                <h1 className="text-xl font-bold text-gray-900 tracking-tight">Restaurant Profile</h1>
              </div>
              <p className="text-[12.5px] text-gray-400 ml-3">Manage your restaurant details and visibility</p>
            </div>
          </div>
          <div className="flex gap-2.5">
            {isEditing ? (
              <>
                <button onClick={handleCancel} disabled={isSaving}
                  className="px-5 py-2.5 rounded-2xl border border-gray-200 text-gray-600 text-[13px] font-semibold hover:bg-gray-100 transition-all disabled:opacity-50">
                  Cancel
                </button>
                <button onClick={handleSave} disabled={isSaving}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#E53935] to-[#FF7043] text-white text-[13.5px] font-bold rounded-2xl shadow-md shadow-red-500/30 hover:shadow-lg hover:shadow-red-500/40 hover:scale-105 active:scale-95 transition-all disabled:opacity-70">
                  {isSaving ? (
                    <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />{uploadingImage ? 'Uploading…' : 'Saving…'}</>
                  ) : (
                    <><Save size={15} strokeWidth={2.5} />Save Changes</>
                  )}
                </button>
              </>
            ) : (
              <button onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#E53935] to-[#FF7043] text-white text-[13.5px] font-bold rounded-2xl shadow-md shadow-red-500/30 hover:shadow-lg hover:shadow-red-500/40 hover:scale-105 active:scale-95 transition-all">
                <Edit2 size={15} strokeWidth={2.5} />Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* ── Status Badges ── */}
        {restaurant.status && (
          <div className="flex flex-wrap gap-2">
            <span className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-[12px] font-bold border
              ${restaurant.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : restaurant.status === 'PENDING' ? 'bg-amber-50 text-amber-700 border-amber-200'
                : 'bg-red-50 text-red-600 border-red-200'}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${restaurant.status === 'APPROVED' ? 'bg-emerald-500' : restaurant.status === 'PENDING' ? 'bg-amber-400 animate-pulse' : 'bg-red-400'}`} />
              {restaurant.status}
            </span>
            {restaurant.is_active && (
              <span className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-1.5 text-[12px] font-bold text-emerald-700">
                <CheckCircle2 size={12} /> Active
              </span>
            )}
            <span className={`inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-1.5 text-[12px] font-bold
              ${restaurant.is_open ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-100 text-gray-500 border-gray-200'}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${restaurant.is_open ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
              {restaurant.is_open ? 'Open Now' : 'Closed'}
            </span>
          </div>
        )}

        {/* ── Hero Banner ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="relative h-64 sm:h-80 md:h-96 overflow-hidden bg-gradient-to-br from-[#E53935] to-[#FF7043]">
            {getDisplayImage() ? (
              <>
                <img src={getDisplayImage()} alt="Restaurant Banner" className="absolute inset-0 w-full h-full object-cover object-center" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              </>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white/60">
                  <Building2 size={48} className="mx-auto mb-2 opacity-50" />
                  <p className="text-[14px] font-medium">No banner image uploaded</p>
                </div>
              </div>
            )}

            {/* Top accent line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-white/40 via-white/20 to-transparent z-10" />

            {selectedImage && (
              <div className="absolute top-4 right-4 z-20">
                <div className="bg-amber-400 text-white px-3 py-1.5 rounded-xl text-[11.5px] font-bold shadow-lg flex items-center gap-1.5 animate-pulse">
                  <Sparkles size={12} /> New image — Save to upload
                </div>
              </div>
            )}

            <div className="absolute bottom-0 left-0 right-0 z-10 p-6 md:p-8">
              {isEditing && (
                <label className="mb-4 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-white/95 backdrop-blur-md px-4 py-2.5 text-[13px] font-bold text-gray-800 shadow-lg hover:bg-white hover:shadow-xl transition-all">
                  <Upload size={16} className="text-[#E53935]" />
                  {selectedImage ? 'Change Photo' : 'Upload Banner'}
                  <input type="file" accept="image/*" onChange={handleImageChange} disabled={isSaving} className="hidden" />
                </label>
              )}
              <div className="mt-1">
                {isEditing ? (
                  <input type="text" name="restaurent_name" value={restaurant.restaurent_name} onChange={handleChange}
                    className="w-full max-w-2xl bg-white/10 backdrop-blur-sm text-white text-3xl md:text-4xl font-extrabold tracking-tight outline-none placeholder:text-white/40 border-b-2 border-white/40 focus:border-white transition-colors pb-2 px-1"
                    placeholder="Restaurant Name" />
                ) : (
                  <h2 className="text-3xl md:text-4xl font-extrabold text-white drop-shadow-2xl tracking-tight">{restaurant.restaurent_name}</h2>
                )}
              </div>
            </div>
          </div>

          {/* Quick Stats Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-gray-100 border-t border-gray-100">
            {[
              { label: 'Rating', icon: <Star size={14} className="text-amber-400" fill="#f59e0b" />, value: parseFloat(restaurant.rating || 0).toFixed(1), sub: `${restaurant.total_reviews || 0} reviews` },
              { label: 'Hours', icon: <Clock size={14} className="text-blue-500" />, value: restaurant.opening_time ? formatTime(restaurant.opening_time) : '—', sub: restaurant.closing_time ? 'Until ' + formatTime(restaurant.closing_time) : '' },
              { label: 'Food Type', icon: restaurant.food_type === 'VEG' ? <FaLeaf size={13} className="text-emerald-500" /> : <FaDrumstickBite size={13} className="text-red-500" />, value: restaurant.food_type || '—', sub: '' },
              { label: 'City', icon: <MapPin size={14} className="text-[#E53935]" />, value: restaurant.city || '—', sub: restaurant.state || '' },
            ].map((s) => (
              <div key={s.label} className="flex flex-col items-center py-4 px-3 text-center">
                <div className="flex items-center gap-1.5 mb-1">{s.icon}<span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{s.label}</span></div>
                <p className="text-[14px] font-extrabold text-gray-900 leading-tight">{s.value}</p>
                {s.sub && <p className="text-[11px] text-gray-400 mt-0.5">{s.sub}</p>}
              </div>
            ))}
          </div>
        </div>

        {/* ── Main Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

          {/* LEFT COLUMN */}
          <div className="space-y-5">

            {/* Description */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1 h-4 rounded-full bg-gradient-to-b from-[#E53935] to-[#FF7043]" />
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Description</p>
              </div>
              {isEditing ? (
                <textarea name="description" value={restaurant.description || ''} onChange={handleChange} rows={4}
                  className={inputCls + " resize-none"} placeholder="Enter restaurant description" />
              ) : (
                <p className="text-[13.5px] leading-relaxed text-gray-600">{restaurant.description || <em className="text-gray-300">No description added</em>}</p>
              )}
            </div>

            {/* Food Type */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1 h-4 rounded-full bg-gradient-to-b from-[#E53935] to-[#FF7043]" />
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Food Type</p>
              </div>
              {isEditing ? (
                <select name="food_type" value={restaurant.food_type || ''} onChange={handleChange} className={inputCls}>
                  <option value="">Select Food Type</option>
                  <option value="VEG">VEG</option>
                  <option value="NON_VEG">NON VEG</option>
                  <option value="(veg,non-veg) BOTH">BOTH</option>
                </select>
              ) : (
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[12.5px] font-bold
                  ${restaurant.food_type === 'VEG' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : restaurant.food_type === 'NON_VEG' ? 'bg-red-50 text-red-600 border border-red-200'
                    : 'bg-blue-50 text-blue-600 border border-blue-200'}`}>
                  {restaurant.food_type === 'VEG' ? <FaLeaf size={12} /> : <FaDrumstickBite size={12} />}
                  {restaurant.food_type || '—'}
                </span>
              )}
            </div>

            {/* Address */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1 h-4 rounded-full bg-gradient-to-b from-[#E53935] to-[#FF7043]" />
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Address</p>
              </div>
              {isEditing ? (
                <div className="space-y-3">
                  <input type="text" name="address" value={restaurant.address || ''} onChange={handleChange} placeholder="Street Address" className={inputCls} />
                  <div className="grid grid-cols-3 gap-3">
                    <input type="text" name="city" value={restaurant.city || ''} onChange={handleChange} placeholder="City" className={inputCls} />
                    <input type="text" name="state" value={restaurant.state || ''} onChange={handleChange} placeholder="State" className={inputCls} />
                    <input type="text" name="pincode" value={restaurant.pincode || ''} onChange={handleChange} placeholder="Pincode" className={inputCls} />
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#E53935] to-[#FF7043] flex items-center justify-center flex-shrink-0 shadow-sm shadow-red-500/20">
                    <MapPin size={14} className="text-white" />
                  </div>
                  <p className="text-[13.5px] text-gray-700 leading-relaxed font-medium mt-0.5">
                    {restaurant.address}{restaurant.city && `, ${restaurant.city}`}{restaurant.state && `, ${restaurant.state}`}{restaurant.pincode && ` - ${restaurant.pincode}`}
                  </p>
                </div>
              )}
            </div>

            {/* GPS / Map */}
            {(restaurant.latitude || restaurant.longitude || isEditing) && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 bg-gradient-to-br from-[#E53935] to-[#FF7043] rounded-xl flex items-center justify-center shadow-sm shadow-red-500/20">
                      <MapPin size={14} className="text-white" />
                    </div>
                    <div>
                      <p className="text-[13px] font-bold text-gray-800">GPS Location</p>
                      <p className="text-[11px] text-gray-400">{isEditing ? 'Click on map to set location' : 'Restaurant coordinates'}</p>
                    </div>
                  </div>
                  {restaurant.latitude && restaurant.longitude && (
                    <div className="hidden sm:flex items-center gap-1.5 bg-red-50 border border-red-100 rounded-xl px-3 py-1.5 font-mono text-[11px] text-[#E53935]">
                      <Navigation size={10} />
                      {parseFloat(restaurant.latitude).toFixed(4)}, {parseFloat(restaurant.longitude).toFixed(4)}
                    </div>
                  )}
                </div>

                {restaurant.latitude && restaurant.longitude ? (
                  <div className="relative" style={{ height: '260px' }}>
                    <MapContainer
                      key={restaurant.latitude + '-' + restaurant.longitude}
                      center={[parseFloat(restaurant.latitude), parseFloat(restaurant.longitude)]}
                      zoom={15}
                      style={{ height: '100%', width: '100%', zIndex: 0 }}
                      scrollWheelZoom={false}
                      attributionControl={false}
                    >
                      <TileLayer attribution='&copy; OpenStreetMap' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                      {isEditing && <MapClickHandler onChange={handleChange} />}
                      <Marker position={[parseFloat(restaurant.latitude), parseFloat(restaurant.longitude)]} icon={redIcon}>
                        <Popup>
                          <div className="text-[13px] font-medium text-gray-700 flex flex-col items-center gap-1">
                            <div className="flex items-center gap-1.5"><FaLocationDot size={14} className="text-red-500" />{restaurant.restaurent_name || 'Restaurant'}</div>
                            {restaurant.restaurent_images && <img src={restaurant.restaurent_images} alt="restaurant" className="w-24 h-16 object-cover rounded-lg mt-1" />}
                          </div>
                        </Popup>
                      </Marker>
                    </MapContainer>
                    {isEditing && (
                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-[999] bg-black/70 text-white text-[11px] px-3 py-1.5 rounded-full pointer-events-none backdrop-blur-sm">
                        🗺️ Tap on map to change location
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-40 bg-gray-50 text-gray-400">
                    <MapPin size={32} className="mb-2 opacity-30" />
                    <p className="text-[13px] font-semibold">No location set yet</p>
                    <p className="text-[11.5px] mt-0.5">Enter coordinates below</p>
                  </div>
                )}

                <div className="px-5 py-4 border-t border-gray-50">
                  {isEditing ? (
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-bold text-gray-400 mb-1.5 block uppercase tracking-wider">Latitude</label>
                        <input type="text" name="latitude" value={restaurant.latitude || ''} onChange={handleChange} placeholder="e.g. 28.613939" className={inputCls + " font-mono"} />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-gray-400 mb-1.5 block uppercase tracking-wider">Longitude</label>
                        <input type="text" name="longitude" value={restaurant.longitude || ''} onChange={handleChange} placeholder="e.g. 77.209021" className={inputCls + " font-mono"} />
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3">
                      {[{ label: 'Latitude', val: restaurant.latitude }, { label: 'Longitude', val: restaurant.longitude }].map(({ label, val }) => (
                        <div key={label} className="bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">{label}</p>
                          <p className="text-[13px] font-mono font-bold text-gray-700">{val || '—'}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-5">

            {/* Rating Card */}
            <div className="bg-gradient-to-br from-[#E53935] to-[#FF7043] rounded-2xl p-5 shadow-md shadow-red-500/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-bold text-white/70 uppercase tracking-widest mb-1">Overall Rating</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-5xl font-extrabold text-white leading-none">{parseFloat(restaurant.rating || 0).toFixed(1)}</p>
                    <p className="text-white/60 text-[13px] font-medium">/ 5.0</p>
                  </div>
                  <p className="text-white/70 text-[12px] mt-1">{restaurant.total_reviews || 0} customer reviews</p>
                </div>
                <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center">
                  <Star size={32} fill="white" className="text-white" strokeWidth={0} />
                </div>
              </div>
              <div className="mt-4 flex gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <div key={s} className="flex-1 h-1.5 rounded-full overflow-hidden bg-white/20">
                    <div className="h-full bg-white rounded-full transition-all" style={{ width: s <= Math.round(parseFloat(restaurant.rating || 0)) ? '100%' : '0%' }} />
                  </div>
                ))}
              </div>
            </div>

            {/* Operating Hours */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-4 rounded-full bg-gradient-to-b from-[#E53935] to-[#FF7043]" />
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Operating Hours</p>
              </div>
              {isEditing ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-gray-400 mb-1.5 block uppercase tracking-wider">Opening</label>
                      <input type="time" name="opening_time" value={restaurant.opening_time || ''} onChange={handleChange} className={inputCls} />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-gray-400 mb-1.5 block uppercase tracking-wider">Closing</label>
                      <input type="time" name="closing_time" value={restaurant.closing_time || ''} onChange={handleChange} className={inputCls} />
                    </div>
                  </div>
                  <label className="flex items-center gap-3 p-3.5 rounded-xl bg-gray-50 border border-gray-200 cursor-pointer hover:border-[#E53935]/30 transition-all">
                    <div
                      className={`w-10 h-6 rounded-full transition-all duration-200 relative flex-shrink-0 ${restaurant.is_open ? 'bg-gradient-to-r from-[#E53935] to-[#FF7043]' : 'bg-gray-300'}`}
                      onClick={() => setRestaurant((p) => ({ ...p, is_open: !p.is_open }))}>
                      <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-200 ${restaurant.is_open ? 'left-[18px]' : 'left-0.5'}`} />
                    </div>
                    <span className="text-[13px] font-semibold text-gray-700">Currently Open for Business</span>
                    <span className={`ml-auto text-[11px] font-bold px-2 py-0.5 rounded-full ${restaurant.is_open ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-400'}`}>
                      {restaurant.is_open ? 'OPEN' : 'CLOSED'}
                    </span>
                  </label>
                </div>
              ) : (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 border border-gray-100">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${restaurant.is_open ? 'bg-gradient-to-br from-emerald-400 to-teal-500' : 'bg-gray-200'}`}>
                    <Clock size={16} className={restaurant.is_open ? 'text-white' : 'text-gray-400'} />
                  </div>
                  <div>
                    <p className={`text-[13.5px] font-bold ${restaurant.is_open ? 'text-emerald-600' : 'text-gray-500'}`}>
                      {restaurant.is_open ? 'Open Now' : 'Currently Closed'}
                    </p>
                    <p className="text-[12px] text-gray-400 mt-0.5">{formatTime(restaurant.opening_time)} – {formatTime(restaurant.closing_time)}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Documents */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-4 rounded-full bg-gradient-to-b from-[#E53935] to-[#FF7043]" />
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Documents</p>
              </div>
              {docs.length > 0 ? (
                <div className="space-y-2.5">
                  {docs.map((doc) => (
                    <div key={doc.label} className="flex items-center justify-between p-3.5 rounded-xl bg-gray-50 border border-gray-100 hover:border-[#E53935]/25 hover:bg-red-50/30 transition-all group">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#E53935] to-[#FF7043] flex items-center justify-center shadow-sm shadow-red-500/20">
                          <IoIosDocument size={15} className="text-white" />
                        </div>
                        <span className="text-[13px] font-semibold text-gray-700">{doc.label}</span>
                      </div>
                      <button onClick={() => openDocument(doc.url)}
                        className="flex items-center gap-1.5 text-[12px] font-bold text-[#E53935] hover:text-white hover:bg-gradient-to-r hover:from-[#E53935] hover:to-[#FF7043] px-3 py-1.5 rounded-lg transition-all">
                        <Eye size={13} /> View
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-gray-300">
                  <FileText size={32} className="mb-2 opacity-40" />
                  <p className="text-[13px] font-semibold text-gray-400">No documents uploaded</p>
                </div>
              )}
            </div>

            {/* Rejection Reason */}
            {restaurant.rejection_reason && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle size={16} className="text-red-500 flex-shrink-0" />
                  <p className="text-[12px] font-bold text-red-700 uppercase tracking-wider">Rejection Reason</p>
                </div>
                <p className="text-[13px] text-red-600 leading-relaxed">{restaurant.rejection_reason}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Document Modal ── */}
      {showDocument && (
        <>
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm" onClick={closeDocument} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[60] w-[95%] max-w-lg"
            style={{ animation: 'scaleUp 0.22s cubic-bezier(0.16,1,0.3,1)' }} onClick={(e) => e.stopPropagation()}>
            <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: '0 24px 80px rgba(0,0,0,0.25)' }}>
              <div className="flex items-center justify-between px-5 py-3.5 bg-gradient-to-r from-[#E53935] to-[#FF7043]">
                <div className="flex items-center gap-2 text-white">
                  <VscPreview size={18} />
                  <h3 className="text-[14px] font-bold">Document Preview</h3>
                </div>
                <button onClick={closeDocument} className="p-1.5 rounded-xl hover:bg-white/20 transition-colors text-white"><RxCross1 size={15} /></button>
              </div>
              <div className="p-4 bg-gray-100 flex items-center justify-center">
                <img src={documentUrl} alt="Document" className="w-full max-h-[60vh] h-auto object-contain rounded-xl shadow-md border border-gray-200" loading="lazy" />
              </div>
              <div className="px-5 py-3.5 bg-white border-t border-gray-100 flex justify-end">
                <button onClick={closeDocument} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors text-[13px] font-semibold">Close</button>
              </div>
            </div>
          </div>
        </>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        @keyframes slideRight { from{opacity:0;transform:translateX(20px)} to{opacity:1;transform:translateX(0)} }
        @keyframes scaleUp { from{opacity:0;transform:translate(-50%,-48%) scale(0.95)} to{opacity:1;transform:translate(-50%,-50%) scale(1)} }
      `}</style>
    </div>
  );
}

export default RestaurantProfile;