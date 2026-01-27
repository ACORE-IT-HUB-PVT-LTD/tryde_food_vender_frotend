import React, { useState } from 'react';
import { Star, MapPin, Clock, Phone, Globe, Save, Edit2, Upload, DollarSign, Utensils } from 'lucide-react';

function RestaurantProfile() {
  const [restaurant, setRestaurant] = useState({
    name: "Shreeji Pure Veg",
    tagline: "Pure Vegetarian • Family Friendly • Home Delivery",
    rating: 4.6,
    reviewCount: 1248,
    cuisine: "North Indian • Chinese • South Indian • Fast Food",
    address: "Scheme No. 54, Vijay Nagar, Near Bombay Hospital, Indore, Madhya Pradesh 452010",
    timing: "11:00 AM – 11:00 PM (All Days)",
    phone: "+91 731-1234567",
    alternatePhone: "+91 98260 12345",
    website: "www.shreejirestaurant.in",
    isOpen: true,
    minOrder: 149,
    deliveryTime: "25-35 mins",
    packingCharges: 0,
    avgCostForTwo: 400,
    restaurantType: "Pure Veg • Delivery + Takeaway",
    fssai: "12345678901234",
    gst: "23ABCDE1234F1Z5",
    bannerImage: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4", // placeholder
    tags: ["Pure Veg", "Family Friendly", "AC Dining", "Best Seller: Paneer Tikka", "Party Orders"],
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setRestaurant((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setRestaurant((prev) => ({ ...prev, bannerImage: previewUrl }));
    }
  };

  const handleSave = () => {
    console.log("Saving updated restaurant profile:", restaurant);
    setIsEditing(false);
    alert("Profile updated successfully! (Connect to your API here)");
  };

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
                  onClick={() => setIsEditing(false)}
                  className="rounded-xl border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2.5 rounded-xl bg-[#FF5252] px-7 py-3 text-sm font-medium text-white shadow-md hover:bg-[#e63939] transition-all duration-200"
                >
                  <Save size={18} />
                  Save Changes
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

        {/* Main Card */}
        <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-xl">
          {/* Hero Banner */}
          <div className="relative h-64 overflow-hidden bg-gradient-to-br from-[#FF5252] to-[#ff7a7a] md:h-72">
            <img
              src={restaurant.bannerImage}
              alt="Restaurant Banner"
              className="absolute inset-0 h-full w-full object-cover opacity-90"
            />
            <div className="absolute inset-0 bg-black/30" />
            <div className="relative z-10 flex h-full flex-col justify-end p-6 md:p-10 text-white">
              {isEditing && (
                <label className="mb-4 flex cursor-pointer items-center gap-2 rounded-lg bg-white/20 px-4 py-2 text-sm backdrop-blur-sm hover:bg-white/30 transition">
                  <Upload size={18} />
                  Change Banner Photo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={restaurant.name}
                  onChange={handleChange}
                  className="w-full bg-transparent text-4xl font-bold tracking-tight outline-none placeholder:text-white/60 focus:border-b-2 focus:border-white/70"
                  placeholder="Restaurant Name"
                />
              ) : (
                <h2 className="text-4xl font-bold tracking-tight drop-shadow-lg md:text-5xl">
                  {restaurant.name}
                </h2>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="grid gap-8 p-6 md:grid-cols-2 md:p-10">
            {/* Left Column */}
            <div className="space-y-8">
              <div>
                <label className="block text-sm font-medium text-gray-600">Tagline / Short Description</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="tagline"
                    value={restaurant.tagline}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-xl border-gray-300 shadow-sm focus:border-[#FF5252] focus:ring-[#FF5252]/30 transition"
                  />
                ) : (
                  <p className="mt-2 text-lg font-medium text-gray-800">{restaurant.tagline}</p>
                )}
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 rounded-xl bg-[#FF5252] px-4 py-2 text-white shadow-sm">
                  <Star size={18} fill="white" />
                  <span className="font-semibold">{restaurant.rating}</span>
                </div>
                <span className="text-sm text-gray-600">
                  ({restaurant.reviewCount}+ ratings & reviews)
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600">Cuisine Types</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="cuisine"
                    value={restaurant.cuisine}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-xl border-gray-300 shadow-sm focus:border-[#FF5252] focus:ring-[#FF5252]/30 transition"
                  />
                ) : (
                  <p className="mt-2 text-gray-700 leading-relaxed">{restaurant.cuisine}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600">Restaurant Type</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="restaurantType"
                    value={restaurant.restaurantType}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-xl border-gray-300 shadow-sm focus:border-[#FF5252] focus:ring-[#FF5252]/30 transition"
                    placeholder="e.g. Pure Veg • Delivery + Takeaway"
                  />
                ) : (
                  <div className="mt-2 flex items-center gap-2 text-gray-700">
                    <Utensils size={18} className="text-[#FF5252]" />
                    {restaurant.restaurantType}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600">Full Address</label>
                {isEditing ? (
                  <textarea
                    name="address"
                    value={restaurant.address}
                    onChange={handleChange}
                    rows={3}
                    className="mt-2 w-full rounded-xl border-gray-300 shadow-sm focus:border-[#FF5252] focus:ring-[#FF5252]/30 transition resize-none"
                  />
                ) : (
                  <div className="mt-2 flex items-start gap-3 text-gray-700">
                    <MapPin size={20} className="mt-1 flex-shrink-0 text-[#FF5252]" />
                    <span>{restaurant.address}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              <div>
                <label className="block text-sm font-medium text-gray-600">Operating Hours</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="timing"
                    value={restaurant.timing}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-xl border-gray-300 shadow-sm focus:border-[#FF5252] focus:ring-[#FF5252]/30 transition"
                  />
                ) : (
                  <div className="mt-2 flex items-center gap-3 text-gray-700">
                    <Clock size={20} className="text-[#FF5252]" />
                    <span className={restaurant.isOpen ? "font-medium text-green-600" : "font-medium text-red-600"}>
                      {restaurant.isOpen ? "Open Now" : "Closed"}
                    </span>
                    <span>• {restaurant.timing}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600">Contact Numbers</label>
                <div className="mt-2 space-y-2">
                  {isEditing ? (
                    <>
                      <input
                        type="tel"
                        name="phone"
                        value={restaurant.phone}
                        onChange={handleChange}
                        className="w-full rounded-xl border-gray-300 shadow-sm focus:border-[#FF5252] focus:ring-[#FF5252]/30 transition"
                        placeholder="Primary Phone"
                      />
                      <input
                        type="tel"
                        name="alternatePhone"
                        value={restaurant.alternatePhone || ""}
                        onChange={handleChange}
                        className="w-full rounded-xl border-gray-300 shadow-sm focus:border-[#FF5252] focus:ring-[#FF5252]/30 transition"
                        placeholder="Alternate / WhatsApp"
                      />
                    </>
                  ) : (
                    <div className="flex items-center gap-3 text-gray-700">
                      <Phone size={20} className="text-[#FF5252]" />
                      <div>
                        <div>{restaurant.phone}</div>
                        {restaurant.alternatePhone && (
                          <div className="text-sm text-gray-500">Alt: {restaurant.alternatePhone}</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600">Website / Online Ordering</label>
                {isEditing ? (
                  <input
                    type="url"
                    name="website"
                    value={restaurant.website}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-xl border-gray-300 shadow-sm focus:border-[#FF5252] focus:ring-[#FF5252]/30 transition"
                  />
                ) : (
                  restaurant.website && (
                    <a
                      href={`https://${restaurant.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex items-center gap-2.5 text-[#FF5252] hover:text-[#e63939] hover:underline transition"
                    >
                      <Globe size={20} />
                      Visit Website
                    </a>
                  )
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600">FSSAI License Number</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="fssai"
                    value={restaurant.fssai}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-xl border-gray-300 shadow-sm focus:border-[#FF5252] focus:ring-[#FF5252]/30 transition"
                  />
                ) : (
                  <p className="mt-2 font-mono text-gray-700 tracking-wide">{restaurant.fssai}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600">GST Number</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="gst"
                    value={restaurant.gst}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-xl border-gray-300 shadow-sm focus:border-[#FF5252] focus:ring-[#FF5252]/30 transition"
                  />
                ) : (
                  <p className="mt-2 font-mono text-gray-700 tracking-wide">{restaurant.gst}</p>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Quick Settings */}
          <div className="border-t bg-gray-50/70 p-6 md:p-10">
            <h3 className="mb-6 text-xl font-semibold text-gray-800">Quick Business Settings</h3>

            <div className="grid gap-8 md:grid-cols-3">
              <div>
                <label className="block text-sm font-medium text-gray-600">Minimum Order Value</label>
                {isEditing ? (
                  <input
                    type="number"
                    name="minOrder"
                    value={restaurant.minOrder}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-xl border-gray-300 shadow-sm focus:border-[#FF5252] focus:ring-[#FF5252]/30 transition"
                  />
                ) : (
                  <p className="mt-2 text-xl font-semibold text-gray-900">₹{restaurant.minOrder}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600">Avg. Delivery Time</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="deliveryTime"
                    value={restaurant.deliveryTime}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-xl border-gray-300 shadow-sm focus:border-[#FF5252] focus:ring-[#FF5252]/30 transition"
                  />
                ) : (
                  <p className="mt-2 text-xl font-semibold text-gray-900">{restaurant.deliveryTime}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600">Avg Cost for Two</label>
                {isEditing ? (
                  <input
                    type="number"
                    name="avgCostForTwo"
                    value={restaurant.avgCostForTwo}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-xl border-gray-300 shadow-sm focus:border-[#FF5252] focus:ring-[#FF5252]/30 transition"
                  />
                ) : (
                  <p className="mt-2 text-xl font-semibold text-gray-900">₹{restaurant.avgCostForTwo}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600">Packing Charges</label>
                {isEditing ? (
                  <input
                    type="number"
                    name="packingCharges"
                    value={restaurant.packingCharges}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-xl border-gray-300 shadow-sm focus:border-[#FF5252] focus:ring-[#FF5252]/30 transition"
                  />
                ) : (
                  <p className="mt-2 text-xl font-semibold text-gray-900">
                    {restaurant.packingCharges === 0 ? "Free" : `₹${restaurant.packingCharges}`}
                  </p>
                )}
              </div>
            </div>

            {/* Tags */}
            <div className="mt-10">
              <label className="block text-sm font-medium text-gray-600 mb-4">Popular Tags / Highlights</label>
              <div className="flex flex-wrap gap-3">
                {restaurant.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="rounded-full bg-[#FF5252]/10 px-5 py-2 text-sm font-medium text-[#FF5252] border border-[#FF5252]/20"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              {isEditing && (
                <p className="mt-4 text-xs text-gray-500 italic">
                  (Add/remove tags feature coming soon – multi-input support)
                </p>
              )}
            </div>
          </div>
        </div>

        <p className="mt-10 text-center text-sm text-gray-500">
          Next steps: Menu Management • Photo Gallery Upload • Analytics Dashboard • Bank/Payout Details
        </p>
      </div>
    </div>
  );
}

export default RestaurantProfile;