// import React, { useContext, useState, useEffect } from 'react';
// import { Star, MapPin, Clock, Upload, Utensils, Save, Edit2 } from 'lucide-react';
// import { RestaurantContext } from '../context/getRestaurant';
// import axiosInstance from '../api/axiosInstance';
// import { IoIosDocument } from 'react-icons/io';
// import { RxCross1 } from 'react-icons/rx';
// import { VscPreview } from 'react-icons/vsc';

// function RestaurantProfile() {
//   const {
//     restaurant: contextRestaurant,
//     loading,
//     setRestaurant: updateContextRestaurant
//   } = useContext(RestaurantContext);

//   const [restaurant, setRestaurant] = useState(null);
//   const [isEditing, setIsEditing] = useState(false);
//   const [isSaving, setIsSaving] = useState(false);
//   const [uploadingImage, setUploadingImage] = useState(false);
//   const [showDocument, setShowDocument] = useState(false);
//   const [documentUrl, setDocumentUrl] = useState(null);

//   // Initialize local state when context restaurant data is available
//   useEffect(() => {
//     if (contextRestaurant) {
//       setRestaurant(contextRestaurant);
//     }
//   }, [contextRestaurant]);

//   // Format time from 24-hour format to 12-hour format
//   const formatTime = (time) => {
//     if (!time) return '';
//     const [hours, minutes] = time.split(':');
//     const hour = parseInt(hours);
//     const ampm = hour >= 12 ? 'PM' : 'AM';
//     const displayHour = hour % 12 || 12;
//     return `${displayHour}:${minutes} ${ampm}`;
//   };

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setRestaurant((prev) => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value,
//     }));
//   };

//   const handleImageChange = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     // Show preview immediately
//     const previewUrl = URL.createObjectURL(file);
//     setRestaurant((prev) => ({ ...prev, restaurent_images: previewUrl }));

//     // Upload to backend
//     setUploadingImage(true);
//     try {
//       const formData = new FormData();
//       formData.append('image', file);

//       const token = localStorage.getItem('token');

//       const response = await axiosInstance.post(
//         `/restaurants/${restaurant.id}`,
//         formData,
//         {
//           headers: {
//             'Content-Type': 'multipart/form-data',
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       // Update with the actual uploaded image URL
//       if (response.data && response.data.imageUrl) {
//         setRestaurant((prev) => ({
//           ...prev,
//           restaurent_images: response.data.imageUrl,
//         }));
//       }
//     } catch (error) {
//       console.error('Error uploading image:', error);
//       alert('Failed to upload image. Please try again.');
//       // Revert to original image on error
//       setRestaurant((prev) => ({
//         ...prev,
//         restaurent_images: contextRestaurant.restaurent_images,
//       }));
//     } finally {
//       setUploadingImage(false);
//     }
//   };

//   const handleSave = async () => {
//     setIsSaving(true);

//     try {
//       const updateData = {
//         restaurent_name: restaurant.restaurent_name,
//         description: restaurant.description,
//         food_type: restaurant.food_type,
//         restaurent_images: restaurant.restaurent_images,
//         address: restaurant.address,
//         city: restaurant.city,
//         state: restaurant.state,
//         pincode: restaurant.pincode,
//         latitude: restaurant.latitude,
//         longitude: restaurant.longitude,
//         opening_time: restaurant.opening_time,
//         closing_time: restaurant.closing_time,
//         is_open: restaurant.is_open,
//       };

//       const token = localStorage.getItem('token');

//       const response = await axiosInstance.put(
//         `/restaurants/${restaurant.id}`,
//         updateData,
//         {
//           headers: {
//             'Content-Type': 'application/json',
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       if (response.data && response.data.restaurant) {
//         setRestaurant(response.data.restaurant);
//         if (updateContextRestaurant) {
//           updateContextRestaurant(response.data.restaurant);
//         }

//         setIsEditing(false);
//         alert('Profile updated successfully!');
//       }
//     } catch (error) {
//       console.error('Error updating restaurant:', error);

//       if (error.response) {
//         alert(
//           `Failed to update profile: ${error.response.data.message || error.response.statusText
//           }`
//         );
//       } else if (error.request) {
//         alert('Failed to update profile: No response from server');
//       } else {
//         alert('Failed to update profile: ' + error.message);
//       }
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   const handleCancel = () => {
//     if (contextRestaurant) {
//       setRestaurant(contextRestaurant);
//     }
//     setIsEditing(false);
//   };

//   const openDocument = (url) => {
//     setDocumentUrl(url);
//     setShowDocument(true);
//   };

//   const closeDocument = () => {
//     setShowDocument(false);
//     setDocumentUrl(null);
//   };

//   // Loading state
//   if (loading || !restaurant) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-[#FF5252] border-r-transparent"></div>
//           <p className="mt-4 text-gray-600">Loading restaurant profile...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 font-['Poppins']">
//       <div className="mx-auto max-w-6xl px-4 py-8 md:px-6 lg:px-8">
//         {/* Header */}
//         <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
//           <div>
//             <h1 className="text-3xl font-semibold text-gray-900 md:text-4xl">
//               Restaurant Profile
//             </h1>
//             <p className="mt-2 text-gray-600">
//               Update your restaurant details visible to customers on the app
//             </p>
//           </div>

//           <div className="flex flex-wrap gap-4">
//             {isEditing ? (
//               <>
//                 <button
//                   onClick={handleCancel}
//                   disabled={isSaving}
//                   className="rounded-xl border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#FF5252]/30 focus:border-[#FF5252]"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleSave}
//                   disabled={isSaving || uploadingImage}
//                   className="flex items-center gap-2.5 rounded-xl bg-[#FF5252] px-7 py-3 text-sm font-medium text-white shadow-md hover:bg-[#e63939] active:bg-[#cc2929] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#FF5252]/40 focus:ring-offset-2"
//                 >
//                   {isSaving ? (
//                     <>
//                       <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-r-transparent"></div>
//                       Saving...
//                     </>
//                   ) : (
//                     <>
//                       <Save size={18} />
//                       Save Changes
//                     </>
//                   )}
//                 </button>
//               </>
//             ) : (
//               <button
//                 onClick={() => setIsEditing(true)}
//                 className="flex items-center gap-2.5 rounded-xl border-2 border-[#FF5252] bg-white px-7 py-3 text-sm font-medium text-[#FF5252] shadow-sm hover:bg-[#FF5252]/5 active:bg-[#FF5252]/10 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#FF5252]/30 focus:ring-offset-2"
//               >
//                 <Edit2 size={18} />
//                 Edit Profile
//               </button>
//             )}
//           </div>
//         </div>

//         {/* Status Badge */}
//         {restaurant.status && (
//           <div className="mb-6 flex flex-wrap gap-3">
//             <span
//               className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-medium ${restaurant.status === 'APPROVED'
//                 ? 'bg-green-100 text-green-800'
//                 : restaurant.status === 'PENDING'
//                   ? 'bg-yellow-100 text-yellow-800'
//                   : 'bg-red-100 text-red-800'
//                 }`}
//             >
//               Status: {restaurant.status}
//             </span>
//             {restaurant.is_active && (
//               <span className="inline-flex items-center rounded-full px-4 py-2 text-sm font-medium bg-green-100 text-green-800">
//                 Active
//               </span>
//             )}
//           </div>
//         )}

//         {/* Main Card */}
//         <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-xl">
//           {/* Hero Banner */}
//           <div className="relative h-64 overflow-hidden bg-gradient-to-br from-[#FF5252] to-[#ff7a7a] md:h-72">
//             {restaurant.restaurent_images && (
//               <>
//                 <img
//                   src={restaurant.restaurent_images}
//                   alt="Restaurant Banner"
//                   className="absolute inset-0 h-full w-full object-cover opacity-90"
//                 />
//                 <div className="absolute inset-0 bg-black/30" />
//               </>
//             )}

//             {uploadingImage && (
//               <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-20">
//                 <div className="text-center text-white">
//                   <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-white border-r-transparent mb-2"></div>
//                   <p>Uploading image...</p>
//                 </div>
//               </div>
//             )}

//             <div className="relative z-10 flex h-full flex-col justify-end p-6 md:p-10 text-white">
//               {isEditing && (
//                 <label className="mb-4 flex cursor-pointer items-center gap-2 rounded-lg bg-white/20 px-4 py-2 text-sm backdrop-blur-sm hover:bg-white/30 active:bg-white/40 transition w-fit focus-within:ring-2 focus-within:ring-white/50 focus-within:outline-none">
//                   <Upload size={18} />
//                   {uploadingImage ? 'Uploading...' : 'Change Banner Photo'}
//                   <input
//                     type="file"
//                     accept="image/*"
//                     onChange={handleImageChange}
//                     disabled={uploadingImage}
//                     className="hidden"
//                   />
//                 </label>
//               )}

//               {isEditing ? (
//                 <input
//                   type="text"
//                   name="restaurent_name"
//                   value={restaurant.restaurent_name}
//                   onChange={handleChange}
//                   className="w-full bg-transparent text-4xl font-bold tracking-tight outline-none placeholder:text-white/60 border-b-2 border-white/60 focus:border-white transition-colors pb-2"
//                   placeholder="Restaurant Name"
//                 />
//               ) : (
//                 <h2 className="text-4xl font-bold tracking-tight drop-shadow-lg md:text-5xl">
//                   {restaurant.restaurent_name}
//                 </h2>
//               )}
//             </div>
//           </div>

//           {/* Main Content */}
//           <div className="grid gap-8 p-6 md:grid-cols-2 md:p-10">
//             {/* Left Column */}
//             <div className="space-y-8">
//               {/* Description */}
//               {(restaurant.description || isEditing) && (
//                 <div>
//                   <label className="block text-sm font-medium text-gray-600 mb-2">
//                     Description
//                   </label>
//                   {isEditing ? (
//                     <textarea
//                       name="description"
//                       value={restaurant.description || ''}
//                       onChange={handleChange}
//                       rows={4}
//                       className="w-full rounded-xl border border-gray-300 px-4 py-3 shadow-sm resize-none transition-all duration-200 placeholder:text-gray-400 hover:border-gray-400 focus:outline-none focus:border-[#FF5252] focus:ring-2 focus:ring-[#FF5252]/30"
//                       placeholder="Enter restaurant description"
//                     />
//                   ) : (
//                     <p className="text-lg leading-relaxed text-gray-800">
//                       {restaurant.description}
//                     </p>
//                   )}
//                 </div>
//               )}

//               {/* Rating */}
//               <div className="flex items-center gap-4">
//                 <div className="flex items-center gap-2 rounded-xl bg-[#FF5252] px-4 py-2 text-white shadow-md">
//                   <Star size={18} fill="white" />
//                   <span className="font-semibold">
//                     {parseFloat(restaurant.rating || 0).toFixed(1)}
//                   </span>
//                 </div>
//                 <span className="text-sm text-gray-600">
//                   ({restaurant.total_reviews || 0} reviews)
//                 </span>
//               </div>

//               {/* Food Type */}
//               {(restaurant.food_type || isEditing) && (
//                 <div>
//                   <label className="block text-sm font-medium text-gray-600 mb-2">
//                     Food Type
//                   </label>
//                   {isEditing ? (
//                     <select
//                       name="food_type"
//                       value={restaurant.food_type || ''}
//                       onChange={handleChange}
//                       className="w-full rounded-xl border border-gray-300 px-4 py-3 shadow-sm transition-all duration-200 hover:border-gray-400 focus:outline-none focus:border-[#FF5252] focus:ring-2 focus:ring-[#FF5252]/30"
//                     >
//                       <option value="">Select Food Type</option>
//                       <option value="VEG">VEG</option>
//                       <option value="NON_VEG">NON_VEG</option>
//                       <option value="(veg,non-veg) BOTH">BOTH</option>
//                     </select>
//                   ) : (
//                     <div className="flex items-center gap-2 text-gray-800 font-medium">
//                       <Utensils size={18} className="text-[#FF5252]" />
//                       {restaurant.food_type}
//                     </div>
//                   )}
//                 </div>
//               )}

//               {/* Full Address */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-600 mb-2">
//                   Address
//                 </label>
//                 {isEditing ? (
//                   <>
//                     <input
//                       type="text"
//                       name="address"
//                       value={restaurant.address || ''}
//                       onChange={handleChange}
//                       placeholder="Street Address"
//                       className="w-full rounded-xl border border-gray-300 px-4 py-3 shadow-sm transition-all duration-200 placeholder:text-gray-400 hover:border-gray-400 focus:outline-none focus:border-[#FF5252] focus:ring-2 focus:ring-[#FF5252]/30"
//                     />
//                     <div className="grid grid-cols-3 gap-3 mt-3">
//                       <input
//                         type="text"
//                         name="city"
//                         value={restaurant.city || ''}
//                         onChange={handleChange}
//                         placeholder="City"
//                         className="w-full rounded-xl border border-gray-300 px-4 py-3 shadow-sm transition-all duration-200 placeholder:text-gray-400 hover:border-gray-400 focus:outline-none focus:border-[#FF5252] focus:ring-2 focus:ring-[#FF5252]/30"
//                       />
//                       <input
//                         type="text"
//                         name="state"
//                         value={restaurant.state || ''}
//                         onChange={handleChange}
//                         placeholder="State"
//                         className="w-full rounded-xl border border-gray-300 px-4 py-3 shadow-sm transition-all duration-200 placeholder:text-gray-400 hover:border-gray-400 focus:outline-none focus:border-[#FF5252] focus:ring-2 focus:ring-[#FF5252]/30"
//                       />
//                       <input
//                         type="text"
//                         name="pincode"
//                         value={restaurant.pincode || ''}
//                         onChange={handleChange}
//                         placeholder="Pincode"
//                         className="w-full rounded-xl border border-gray-300 px-4 py-3 shadow-sm transition-all duration-200 placeholder:text-gray-400 hover:border-gray-400 focus:outline-none focus:border-[#FF5252] focus:ring-2 focus:ring-[#FF5252]/30"
//                       />
//                     </div>
//                   </>
//                 ) : (
//                   <div className="flex items-start gap-3 text-gray-700">
//                     <MapPin size={20} className="mt-1 flex-shrink-0 text-[#FF5252]" />
//                     <span className="leading-relaxed">
//                       {restaurant.address}
//                       {restaurant.city && `, ${restaurant.city}`}
//                       {restaurant.state && `, ${restaurant.state}`}
//                       {restaurant.pincode && ` - ${restaurant.pincode}`}
//                     </span>
//                   </div>
//                 )}
//               </div>

//               {/* Location Coordinates */}
//               {(restaurant.latitude || restaurant.longitude || isEditing) && (
//                 <div>
//                   <label className="block text-sm font-medium text-gray-600 mb-2">
//                     Location Coordinates
//                   </label>
//                   {isEditing ? (
//                     <div className="grid grid-cols-2 gap-3">
//                       <input
//                         type="text"
//                         name="latitude"
//                         value={restaurant.latitude || ''}
//                         onChange={handleChange}
//                         placeholder="Latitude"
//                         className="w-full rounded-xl border border-gray-300 px-4 py-3 shadow-sm transition-all duration-200 placeholder:text-gray-400 hover:border-gray-400 focus:outline-none focus:border-[#FF5252] focus:ring-2 focus:ring-[#FF5252]/30"
//                       />
//                       <input
//                         type="text"
//                         name="longitude"
//                         value={restaurant.longitude || ''}
//                         onChange={handleChange}
//                         placeholder="Longitude"
//                         className="w-full rounded-xl border border-gray-300 px-4 py-3 shadow-sm transition-all duration-200 placeholder:text-gray-400 hover:border-gray-400 focus:outline-none focus:border-[#FF5252] focus:ring-2 focus:ring-[#FF5252]/30"
//                       />
//                     </div>
//                   ) : (
//                     <div className="text-sm text-gray-700 space-y-1">
//                       <p>
//                         <span className="font-medium">Latitude:</span>{' '}
//                         {restaurant.latitude}
//                       </p>
//                       <p>
//                         <span className="font-medium">Longitude:</span>{' '}
//                         {restaurant.longitude}
//                       </p>
//                     </div>
//                   )}
//                 </div>
//               )}
//             </div>

//             {/* Right Column */}
//             <div className="space-y-8">
//               {/* Operating Hours */}
//               {(restaurant.opening_time || restaurant.closing_time || isEditing) && (
//                 <div>
//                   <label className="block text-sm font-medium text-gray-600 mb-2">
//                     Operating Hours
//                   </label>
//                   {isEditing ? (
//                     <>
//                       <div className="grid grid-cols-2 gap-3">
//                         <div>
//                           <label className="block text-xs text-gray-500 mb-1">
//                             Opening Time
//                           </label>
//                           <input
//                             type="time"
//                             name="opening_time"
//                             value={restaurant.opening_time || ''}
//                             onChange={handleChange}
//                             className="w-full rounded-xl border border-gray-300 px-4 py-3 shadow-sm transition-all duration-200 hover:border-gray-400 focus:outline-none focus:border-[#FF5252] focus:ring-2 focus:ring-[#FF5252]/30"
//                           />
//                         </div>
//                         <div>
//                           <label className="block text-xs text-gray-500 mb-1">
//                             Closing Time
//                           </label>
//                           <input
//                             type="time"
//                             name="closing_time"
//                             value={restaurant.closing_time || ''}
//                             onChange={handleChange}
//                             className="w-full rounded-xl border border-gray-300 px-4 py-3 shadow-sm transition-all duration-200 hover:border-gray-400 focus:outline-none focus:border-[#FF5252] focus:ring-2 focus:ring-[#FF5252]/30"
//                           />
//                         </div>
//                       </div>
//                       <div className="mt-4">
//                         <label className="flex items-center gap-2 cursor-pointer group">
//                           <input
//                             type="checkbox"
//                             name="is_open"
//                             checked={restaurant.is_open || false}
//                             onChange={handleChange}
//                             className="rounded border-gray-300 text-[#FF5252] shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#FF5252]/30 focus:ring-offset-0"
//                           />
//                           <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
//                             Currently Open
//                           </span>
//                         </label>
//                       </div>
//                     </>
//                   ) : (
//                     <div className="flex items-center gap-3 text-gray-700">
//                       <Clock size={20} className="text-[#FF5252]" />
//                       <span
//                         className={`font-semibold ${restaurant.is_open ? 'text-green-600' : 'text-red-600'
//                           }`}
//                       >
//                         {restaurant.is_open ? 'Open Now' : 'Closed'}
//                       </span>
//                       <span className="text-gray-500">•</span>
//                       <span>
//                         {formatTime(restaurant.opening_time)} –{' '}
//                         {formatTime(restaurant.closing_time)}
//                       </span>
//                     </div>
//                   )}
//                 </div>
//               )}

//               {/* Documents Section */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-600 mb-3">
//                   Documents
//                 </label>
//                 <div className="space-y-4 rounded-xl border border-gray-200 bg-gray-50/50 p-5">
//                   {restaurant.fssai_license && (
//                     <div>
//                       <p className="text-xs font-medium text-gray-500 mb-1.5">
//                         FSSAI License
//                       </p>
//                       <button
//                         onClick={() => openDocument(restaurant.fssai_license)}
//                         className="flex items-center gap-2 text-sm text-[#FF5252] hover:text-[#e63939] active:text-[#cc2929] font-medium transition-colors focus:outline-none focus:underline"
//                       >
//                         <IoIosDocument size={18} />
//                         View Document
//                       </button>
//                     </div>
//                   )}

//                   {restaurant.business_license && (
//                     <div>
//                       <p className="text-xs font-medium text-gray-500 mb-1.5">
//                         Business License
//                       </p>
//                       <button
//                         onClick={() => openDocument(restaurant.business_license)}
//                         className="flex items-center gap-2 text-sm text-[#FF5252] hover:text-[#e63939] active:text-[#cc2929] font-medium transition-colors focus:outline-none focus:underline"
//                       >
//                         <IoIosDocument size={18} />
//                         View Document
//                       </button>
//                     </div>
//                   )}

//                   {restaurant.pan_card && (
//                     <div>
//                       <p className="text-xs font-medium text-gray-500 mb-1.5">
//                         PAN Card
//                       </p>
//                       <button
//                         onClick={() => openDocument(restaurant.pan_card)}
//                         className="flex items-center gap-2 text-sm text-[#FF5252] hover:text-[#e63939] active:text-[#cc2929] font-medium transition-colors focus:outline-none focus:underline"
//                       >
//                         <IoIosDocument size={18} />
//                         View Document
//                       </button>
//                     </div>
//                   )}

//                   {restaurant.aadhar_card && (
//                     <div>
//                       <p className="text-xs font-medium text-gray-500 mb-1.5">
//                         Aadhar Card
//                       </p>
//                       <button
//                         onClick={() => openDocument(restaurant.aadhar_card)}
//                         className="flex items-center gap-2 text-sm text-[#FF5252] hover:text-[#e63939] active:text-[#cc2929] font-medium transition-colors focus:outline-none focus:underline"
//                       >
//                         <IoIosDocument size={18} />
//                         View Document
//                       </button>
//                     </div>
//                   )}

//                   {!restaurant.fssai_license &&
//                     !restaurant.business_license &&
//                     !restaurant.pan_card &&
//                     !restaurant.aadhar_card && (
//                       <p className="text-sm text-gray-500 italic">
//                         No documents uploaded
//                       </p>
//                     )}
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Rejection Reason (if any) */}
//           {restaurant.rejection_reason && (
//             <div className="border-t border-red-200 bg-red-50 p-6 md:p-10">
//               <h3 className="text-lg font-semibold text-red-800 mb-2">
//                 Rejection Reason
//               </h3>
//               <p className="text-red-700 leading-relaxed">
//                 {restaurant.rejection_reason}
//               </p>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Document Preview Modal */}
//       {showDocument && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
//           <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-300 scale-100 border border-gray-100">
//             {/* Header */}
//             <div className="flex items-center justify-between px-5 sm:px-6 py-4 bg-[#FF5252] text-white">
//               <div className="flex items-center gap-3">
//                 <VscPreview className="text-2xl opacity-90" />
//                 <h3 className="text-lg sm:text-xl font-bold tracking-tight">
//                   Document Preview
//                 </h3>
//               </div>

//               <button
//                 onClick={closeDocument}
//                 className="p-2.5 rounded-full hover:bg-white/20 active:bg-white/30 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white/40"
//                 aria-label="Close preview"
//               >
//                 <RxCross1 className="text-xl" />
//               </button>
//             </div>

//             {/* Content */}
//             <div className="p-6 sm:p-8 md:p-10 bg-gray-50/50 flex items-center justify-center min-h-[50vh] max-h-[70vh] overflow-auto">
//               <div className="w-full">
//                 <img
//                   src={documentUrl}
//                   alt="Document Preview"
//                   className="w-full max-h-[65vh] object-contain rounded-xl shadow-lg border border-gray-200/80 bg-white mx-auto"
//                   loading="lazy"
//                 />
//               </div>
//             </div>

//             {/* Footer */}
//             <div className="px-6 py-4 bg-white border-t border-gray-100 flex justify-end">
//               <button
//                 onClick={closeDocument}
//                 className="px-6 py-2.5 bg-[#FF5252] hover:bg-[#e63939] active:bg-[#cc2929] text-white font-medium rounded-xl transition-all duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FF5252]/40 focus:ring-offset-2"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default RestaurantProfile;



import React, { useContext, useState, useEffect } from 'react';
import { Star, MapPin, Clock, Upload, Utensils, Save, Edit2 } from 'lucide-react';
import { RestaurantContext } from '../context/getRestaurant';
import axiosInstance from '../api/axiosInstance';
import { IoIosDocument } from 'react-icons/io';
import { RxCross1 } from 'react-icons/rx';
import { VscPreview } from 'react-icons/vsc';

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
  const [selectedImage, setSelectedImage] = useState(null); // Store the selected file
  const [imagePreview, setImagePreview] = useState(null); // Store preview URL

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
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Store the file for later upload
    setSelectedImage(file);

    // Create and show preview
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setUploadingImage(selectedImage ? true : false);

    try {
      const token = localStorage.getItem('token');

      // Create FormData for the request
      const formData = new FormData();

      // Add image if selected
      if (selectedImage) {
        formData.append('restaurant_images', selectedImage);
      }

      // Add all other restaurant data
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

      // Send PUT request with FormData
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
        // Update local state with response data
        setRestaurant(response.data.restaurant);
        
        // Update context
        if (updateContextRestaurant) {
          updateContextRestaurant(response.data.restaurant);
        }

        // Clear selected image and preview
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
    
    // Clear image selection and preview
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

  // Cleanup preview URL on unmount
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  // Get display image (preview if selected, otherwise current image)
  const getDisplayImage = () => {
    if (imagePreview) {
      return imagePreview;
    }
    return restaurant.restaurent_images;
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
                  className="rounded-xl border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#FF5252]/30 focus:border-[#FF5252]"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex items-center gap-2.5 rounded-xl bg-[#FF5252] px-7 py-3 text-sm font-medium text-white shadow-md hover:bg-[#e63939] active:bg-[#cc2929] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#FF5252]/40 focus:ring-offset-2"
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
                className="flex items-center gap-2.5 rounded-xl border-2 border-[#FF5252] bg-white px-7 py-3 text-sm font-medium text-[#FF5252] shadow-sm hover:bg-[#FF5252]/5 active:bg-[#FF5252]/10 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#FF5252]/30 focus:ring-offset-2"
              >
                <Edit2 size={18} />
                Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* Status Badge */}
        {restaurant.status && (
          <div className="mb-6 flex flex-wrap gap-3">
            <span
              className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-medium ${
                restaurant.status === 'APPROVED'
                  ? 'bg-green-100 text-green-800'
                  : restaurant.status === 'PENDING'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              Status: {restaurant.status}
            </span>
            {restaurant.is_active && (
              <span className="inline-flex items-center rounded-full px-4 py-2 text-sm font-medium bg-green-100 text-green-800">
                Active
              </span>
            )}
          </div>
        )}

        {/* Main Card */}
        <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-xl">
          {/* Hero Banner */}
          <div className="relative h-64 overflow-hidden bg-gradient-to-br from-[#FF5252] to-[#ff7a7a] md:h-72">
            {getDisplayImage() && (
              <>
                <img
                  src={getDisplayImage()}
                  alt="Restaurant Banner"
                  className="absolute inset-0 h-full w-full object-cover opacity-90"
                />
                <div className="absolute inset-0 bg-black/30" />
              </>
            )}

            {selectedImage && (
              <div className="absolute top-4 right-4 z-20 bg-yellow-500 text-white px-3 py-1.5 rounded-lg text-sm font-medium shadow-lg">
                New image selected - Click Save to upload
              </div>
            )}

            <div className="relative z-10 flex h-full flex-col justify-end p-6 md:p-10 text-white">
              {isEditing && (
                <label className="mb-4 flex cursor-pointer items-center gap-2 rounded-lg bg-white/20 px-4 py-2 text-sm backdrop-blur-sm hover:bg-white/30 active:bg-white/40 transition w-fit focus-within:ring-2 focus-within:ring-white/50 focus-within:outline-none">
                  <Upload size={18} />
                  {selectedImage ? 'Change Selected Photo' : 'Change Banner Photo'}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    disabled={isSaving}
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
                  className="w-full bg-transparent text-4xl font-bold tracking-tight outline-none placeholder:text-white/60 border-b-2 border-white/60 focus:border-white transition-colors pb-2"
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
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Description
                  </label>
                  {isEditing ? (
                    <textarea
                      name="description"
                      value={restaurant.description || ''}
                      onChange={handleChange}
                      rows={4}
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 shadow-sm resize-none transition-all duration-200 placeholder:text-gray-400 hover:border-gray-400 focus:outline-none focus:border-[#FF5252] focus:ring-2 focus:ring-[#FF5252]/30"
                      placeholder="Enter restaurant description"
                    />
                  ) : (
                    <p className="text-lg leading-relaxed text-gray-800">
                      {restaurant.description}
                    </p>
                  )}
                </div>
              )}

              {/* Rating */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 rounded-xl bg-[#FF5252] px-4 py-2 text-white shadow-md">
                  <Star size={18} fill="white" />
                  <span className="font-semibold">
                    {parseFloat(restaurant.rating || 0).toFixed(1)}
                  </span>
                </div>
                <span className="text-sm text-gray-600">
                  ({restaurant.total_reviews || 0} reviews)
                </span>
              </div>

              {/* Food Type */}
              {(restaurant.food_type || isEditing) && (
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Food Type
                  </label>
                  {isEditing ? (
                    <select
                      name="food_type"
                      value={restaurant.food_type || ''}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 shadow-sm transition-all duration-200 hover:border-gray-400 focus:outline-none focus:border-[#FF5252] focus:ring-2 focus:ring-[#FF5252]/30"
                    >
                      <option value="">Select Food Type</option>
                      <option value="VEG">VEG</option>
                      <option value="NON_VEG">NON_VEG</option>
                      <option value="(veg,non-veg) BOTH">BOTH</option>
                    </select>
                  ) : (
                    <div className="flex items-center gap-2 text-gray-800 font-medium">
                      <Utensils size={18} className="text-[#FF5252]" />
                      {restaurant.food_type}
                    </div>
                  )}
                </div>
              )}

              {/* Full Address */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
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
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 shadow-sm transition-all duration-200 placeholder:text-gray-400 hover:border-gray-400 focus:outline-none focus:border-[#FF5252] focus:ring-2 focus:ring-[#FF5252]/30"
                    />
                    <div className="grid grid-cols-3 gap-3 mt-3">
                      <input
                        type="text"
                        name="city"
                        value={restaurant.city || ''}
                        onChange={handleChange}
                        placeholder="City"
                        className="w-full rounded-xl border border-gray-300 px-4 py-3 shadow-sm transition-all duration-200 placeholder:text-gray-400 hover:border-gray-400 focus:outline-none focus:border-[#FF5252] focus:ring-2 focus:ring-[#FF5252]/30"
                      />
                      <input
                        type="text"
                        name="state"
                        value={restaurant.state || ''}
                        onChange={handleChange}
                        placeholder="State"
                        className="w-full rounded-xl border border-gray-300 px-4 py-3 shadow-sm transition-all duration-200 placeholder:text-gray-400 hover:border-gray-400 focus:outline-none focus:border-[#FF5252] focus:ring-2 focus:ring-[#FF5252]/30"
                      />
                      <input
                        type="text"
                        name="pincode"
                        value={restaurant.pincode || ''}
                        onChange={handleChange}
                        placeholder="Pincode"
                        className="w-full rounded-xl border border-gray-300 px-4 py-3 shadow-sm transition-all duration-200 placeholder:text-gray-400 hover:border-gray-400 focus:outline-none focus:border-[#FF5252] focus:ring-2 focus:ring-[#FF5252]/30"
                      />
                    </div>
                  </>
                ) : (
                  <div className="flex items-start gap-3 text-gray-700">
                    <MapPin size={20} className="mt-1 flex-shrink-0 text-[#FF5252]" />
                    <span className="leading-relaxed">
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
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Location Coordinates
                  </label>
                  {isEditing ? (
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        name="latitude"
                        value={restaurant.latitude || ''}
                        onChange={handleChange}
                        placeholder="Latitude"
                        className="w-full rounded-xl border border-gray-300 px-4 py-3 shadow-sm transition-all duration-200 placeholder:text-gray-400 hover:border-gray-400 focus:outline-none focus:border-[#FF5252] focus:ring-2 focus:ring-[#FF5252]/30"
                      />
                      <input
                        type="text"
                        name="longitude"
                        value={restaurant.longitude || ''}
                        onChange={handleChange}
                        placeholder="Longitude"
                        className="w-full rounded-xl border border-gray-300 px-4 py-3 shadow-sm transition-all duration-200 placeholder:text-gray-400 hover:border-gray-400 focus:outline-none focus:border-[#FF5252] focus:ring-2 focus:ring-[#FF5252]/30"
                      />
                    </div>
                  ) : (
                    <div className="text-sm text-gray-700 space-y-1">
                      <p>
                        <span className="font-medium">Latitude:</span>{' '}
                        {restaurant.latitude}
                      </p>
                      <p>
                        <span className="font-medium">Longitude:</span>{' '}
                        {restaurant.longitude}
                      </p>
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
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Operating Hours
                  </label>
                  {isEditing ? (
                    <>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">
                            Opening Time
                          </label>
                          <input
                            type="time"
                            name="opening_time"
                            value={restaurant.opening_time || ''}
                            onChange={handleChange}
                            className="w-full rounded-xl border border-gray-300 px-4 py-3 shadow-sm transition-all duration-200 hover:border-gray-400 focus:outline-none focus:border-[#FF5252] focus:ring-2 focus:ring-[#FF5252]/30"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">
                            Closing Time
                          </label>
                          <input
                            type="time"
                            name="closing_time"
                            value={restaurant.closing_time || ''}
                            onChange={handleChange}
                            className="w-full rounded-xl border border-gray-300 px-4 py-3 shadow-sm transition-all duration-200 hover:border-gray-400 focus:outline-none focus:border-[#FF5252] focus:ring-2 focus:ring-[#FF5252]/30"
                          />
                        </div>
                      </div>
                      <div className="mt-4">
                        <label className="flex items-center gap-2 cursor-pointer group">
                          <input
                            type="checkbox"
                            name="is_open"
                            checked={restaurant.is_open || false}
                            onChange={handleChange}
                            className="rounded border-gray-300 text-[#FF5252] shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#FF5252]/30 focus:ring-offset-0"
                          />
                          <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
                            Currently Open
                          </span>
                        </label>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center gap-3 text-gray-700">
                      <Clock size={20} className="text-[#FF5252]" />
                      <span
                        className={`font-semibold ${
                          restaurant.is_open ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {restaurant.is_open ? 'Open Now' : 'Closed'}
                      </span>
                      <span className="text-gray-500">•</span>
                      <span>
                        {formatTime(restaurant.opening_time)} –{' '}
                        {formatTime(restaurant.closing_time)}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Documents Section */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-3">
                  Documents
                </label>
                <div className="space-y-4 rounded-xl border border-gray-200 bg-gray-50/50 p-5">
                  {restaurant.fssai_license && (
                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-1.5">
                        FSSAI License
                      </p>
                      <button
                        onClick={() => openDocument(restaurant.fssai_license)}
                        className="flex items-center gap-2 text-sm text-[#FF5252] hover:text-[#e63939] active:text-[#cc2929] font-medium transition-colors focus:outline-none focus:underline"
                      >
                        <IoIosDocument size={18} />
                        View Document
                      </button>
                    </div>
                  )}

                  {restaurant.business_license && (
                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-1.5">
                        Business License
                      </p>
                      <button
                        onClick={() => openDocument(restaurant.business_license)}
                        className="flex items-center gap-2 text-sm text-[#FF5252] hover:text-[#e63939] active:text-[#cc2929] font-medium transition-colors focus:outline-none focus:underline"
                      >
                        <IoIosDocument size={18} />
                        View Document
                      </button>
                    </div>
                  )}

                  {restaurant.pan_card && (
                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-1.5">
                        PAN Card
                      </p>
                      <button
                        onClick={() => openDocument(restaurant.pan_card)}
                        className="flex items-center gap-2 text-sm text-[#FF5252] hover:text-[#e63939] active:text-[#cc2929] font-medium transition-colors focus:outline-none focus:underline"
                      >
                        <IoIosDocument size={18} />
                        View Document
                      </button>
                    </div>
                  )}

                  {restaurant.aadhar_card && (
                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-1.5">
                        Aadhar Card
                      </p>
                      <button
                        onClick={() => openDocument(restaurant.aadhar_card)}
                        className="flex items-center gap-2 text-sm text-[#FF5252] hover:text-[#e63939] active:text-[#cc2929] font-medium transition-colors focus:outline-none focus:underline"
                      >
                        <IoIosDocument size={18} />
                        View Document
                      </button>
                    </div>
                  )}

                  {!restaurant.fssai_license &&
                    !restaurant.business_license &&
                    !restaurant.pan_card &&
                    !restaurant.aadhar_card && (
                      <p className="text-sm text-gray-500 italic">
                        No documents uploaded
                      </p>
                    )}
                </div>
              </div>
            </div>
          </div>

          {/* Rejection Reason (if any) */}
          {restaurant.rejection_reason && (
            <div className="border-t border-red-200 bg-red-50 p-6 md:p-10">
              <h3 className="text-lg font-semibold text-red-800 mb-2">
                Rejection Reason
              </h3>
              <p className="text-red-700 leading-relaxed">
                {restaurant.rejection_reason}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Document Preview Modal */}
      {showDocument && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-300 scale-100 border border-gray-100">
            {/* Header */}
            <div className="flex items-center justify-between px-5 sm:px-6 py-4 bg-[#FF5252] text-white">
              <div className="flex items-center gap-3">
                <VscPreview className="text-2xl opacity-90" />
                <h3 className="text-lg sm:text-xl font-bold tracking-tight">
                  Document Preview
                </h3>
              </div>

              <button
                onClick={closeDocument}
                className="p-2.5 rounded-full hover:bg-white/20 active:bg-white/30 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white/40"
                aria-label="Close preview"
              >
                <RxCross1 className="text-xl" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 sm:p-8 md:p-10 bg-gray-50/50 flex items-center justify-center min-h-[50vh] max-h-[70vh] overflow-auto">
              <div className="w-full">
                <img
                  src={documentUrl}
                  alt="Document Preview"
                  className="w-full max-h-[65vh] object-contain rounded-xl shadow-lg border border-gray-200/80 bg-white mx-auto"
                  loading="lazy"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-white border-t border-gray-100 flex justify-end">
              <button
                onClick={closeDocument}
                className="px-6 py-2.5 bg-[#FF5252] hover:bg-[#e63939] active:bg-[#cc2929] text-white font-medium rounded-xl transition-all duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FF5252]/40 focus:ring-offset-2"
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