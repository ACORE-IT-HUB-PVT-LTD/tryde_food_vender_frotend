import React, { useEffect, useState } from "react";

function Support() {
  const [activeTab, setActiveTab] = useState("driverToUser");
  const [driverToUser, setDriverToUser] = useState([]);
  const [vendorComplaints, setVendorComplaints] = useState([]);
  const [driverComplaints, setDriverComplaints] = useState([]);
  const [loading, setLoading] = useState(false);

  // New states for raise complaint modal
  const [showModal, setShowModal] = useState(false);
  const [complaintForm, setComplaintForm] = useState({
    subject: "",
    description: "",
    priority: "medium",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState(null);

  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const brandColor = "#ff5656";
  const validStatuses = ["open", "in_progress", "resolved", "rejected"];

  useEffect(() => {
    fetchDriverToUser();
    fetchVendorComplaints();
    fetchDriverComplaints();
  }, []);

  const fetchDriverToUser = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        "https://api.tryde.in/kitchen/complaints/vendor/driver-to-user",
        { method: "GET", headers }
      );
      const data = await res.json();
      setDriverToUser(data.data || []);
    } catch (err) {
      console.error("Driver→User fetch failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchVendorComplaints = async () => {
    try {
      const res = await fetch(
        "https://api.tryde.in/kitchen/complaints/vendor/vendorcomplaints?vendorPhone=85195474657427",
        { method: "GET", headers }
      );
      const data = await res.json();
      setVendorComplaints(data.data || []);
    } catch (err) {
      console.error("Vendor complaints fetch failed:", err);
    }
  };

  const fetchDriverComplaints = async () => {
    try {
      const res = await fetch(
        "https://api.tryde.in/kitchen/complaints/vendor/drivercomplaints?driverPhone=85195474657427",
        { method: "GET", headers }
      );
      const data = await res.json();
      setDriverComplaints(data.data || []);
    } catch (err) {
      console.error("Driver complaints fetch failed:", err);
    }
  };

  const updateComplaintStatus = async (complaintId, newStatus) => {
    if (!validStatuses.includes(newStatus)) {
      alert("Invalid status");
      return;
    }

    const statusNames = {
      open: "Open",
      in_progress: "In Progress",
      resolved: "Resolved",
      rejected: "Rejected",
    };

    const action = {
      in_progress: "mark as In Progress",
      resolved: "mark as Resolved",
      rejected: "reject this complaint",
    }[newStatus] || "update";

    if (!window.confirm(`Are you sure you want to ${action}?`)) return;

    try {
      const res = await fetch(
        `https://api.tryde.in/kitchen/complaints/vendor/${complaintId}/status`,
        {
          method: "PATCH",
          headers,
          body: JSON.stringify({ status: newStatus }),
        }
      );

      const result = await res.json();

      if (result.success) {
        alert(`Success! Status changed to ${statusNames[newStatus]}`);
        fetchVendorComplaints();
      } else {
        alert(result.message || "Failed to update status");
      }
    } catch (err) {
      console.error(err);
      alert("Network / server error while updating status");
    }
  };

  // New: Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setComplaintForm((prev) => ({ ...prev, [name]: value }));
  };

  // New: Submit complaint to admin
  const handleSubmitComplaint = async (e) => {
    e.preventDefault();

    if (!complaintForm.subject.trim() || !complaintForm.description.trim()) {
      setSubmitMessage({ type: "error", text: "Subject and description are required" });
      return;
    }

    setSubmitting(true);
    setSubmitMessage(null);

    try {
      const res = await fetch("https://api.tryde.in/kitchen/complaints/vendor-to-admin", {
        method: "POST",
        headers,
        body: JSON.stringify(complaintForm),
      });

      const result = await res.json();

      if (result.success) {
        setSubmitMessage({ type: "success", text: "Complaint submitted successfully!" });
        // Reset form
        setComplaintForm({ subject: "", description: "", priority: "medium" });
        // Optional: close modal after 2 seconds
        setTimeout(() => {
          setShowModal(false);
          setSubmitMessage(null);
        }, 1800);
      } else {
        setSubmitMessage({ type: "error", text: result.message || "Failed to submit complaint" });
      }
    } catch (err) {
      console.error("Submit complaint error:", err);
      setSubmitMessage({ type: "error", text: "Network error. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  const getPriorityStyle = (priority) => {
    const p = (priority || "").toLowerCase();
    if (p === "high") return "bg-red-100 text-red-700 border-red-300";
    if (p === "medium") return "bg-orange-100 text-orange-700 border-orange-300";
    if (p === "low") return "bg-green-100 text-green-700 border-green-300";
    return "bg-gray-100 text-gray-600 border-gray-300";
  };

  const getStatusStyle = (status) => {
    const s = (status || "open").toLowerCase().trim();
    if (s === "open") return "bg-red-100 text-red-700";
    if (s === "in_progress") return "bg-yellow-100 text-yellow-800";
    if (s === "resolved") return "bg-green-100 text-green-700";
    if (s === "rejected") return "bg-gray-200 text-gray-700";
    return "bg-gray-100 text-gray-600";
  };

  const getReadableStatus = (status) => {
    const s = (status || "open").toLowerCase().trim();
    if (s === "in_progress") return "In Progress";
    return (s.charAt(0).toUpperCase() + s.slice(1)).replace("_", " ");
  };

  const renderDirectionBadge = (type) => {
    if (type === "driverToUser")
      return (
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-50 text-red-700 rounded-full text-sm font-medium mb-3">
          <span>DRIVER → USER</span>
        </div>
      );
    if (type === "vendor")
      return (
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium mb-3">
          <span>USER → VENDOR</span>
        </div>
      );
    if (type === "driver")
      return (
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm font-medium mb-3">
          <span>USER → DRIVER</span>
        </div>
      );
    return null;
  };

  const renderPersonInfo = (type, item) => {
    if (type === "vendor") {
      return (
        <>
          <div>
            <span className="text-gray-500 block text-xs">From (User)</span>
            <span className="font-medium">{item.user?.name || "—"}</span>
          </div>
          <div>
            <span className="text-gray-500 block text-xs">To (Vendor)</span>
            <span className="font-medium">You</span>
          </div>
          <div className="col-span-2">
            <span className="text-gray-500 block text-xs">User City</span>
            <span className="font-medium">{item.user?.address?.city || "—"}</span>
          </div>
        </>
      );
    }

    if (type === "driverToUser") {
      return (
        <>
          <div>
            <span className="text-gray-500 block text-xs">From (Driver)</span>
            <span className="font-medium">{item.driver?.name || "—"}</span>
          </div>
          <div>
            <span className="text-gray-500 block text-xs">To (User)</span>
            <span className="font-medium">{item.user?.name || "—"}</span>
          </div>
        </>
      );
    }

    if (type === "driver") {
      return (
        <>
          <div>
            <span className="text-gray-500 block text-xs">From (User)</span>
            <span className="font-medium">{item.user?.name || "—"}</span>
          </div>
          <div>
            <span className="text-gray-500 block text-xs">To (Driver)</span>
            <span className="font-medium">{item.driver?.name || "—"}</span>
          </div>
        </>
      );
    }

    return null;
  };

  const renderCard = (item, type) => {
    const isVendorTab = type === "vendor";
    const status = (item.status || "open").toLowerCase().trim();
    const isActionable = isVendorTab && (status === "open" || status === "in_progress");

    return (
      <div
        key={item.id}
        className="group bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-[#ff5656]/40 transition-all duration-200"
      >
        {renderDirectionBadge(type)}

        <div className="flex items-start justify-between mb-3 flex-wrap gap-2">
          <h3 className="font-semibold text-gray-900 text-lg leading-tight pr-4">
            {item.subject || "Untitled Complaint"}
          </h3>
          <div className="flex gap-2 flex-wrap justify-end">
            <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getPriorityStyle(item.priority)}`}>
              {item.priority?.toUpperCase() || "NORMAL"}
            </span>
            <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusStyle(item.status)}`}>
              {getReadableStatus(item.status)}
            </span>
          </div>
        </div>

        <p className="text-gray-700 mb-5 line-clamp-3 leading-relaxed">
          {item.description || "No description available."}
        </p>

        <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm mb-5">
          {renderPersonInfo(type, item)}
        </div>

        <div className="text-xs text-gray-400 flex items-center gap-2 mb-5">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {new Date(item.created_at).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
        </div>

        {isActionable && (
          <div className="pt-4 border-t border-gray-100 flex flex-wrap gap-3">
            {status === "open" && (
              <button
                onClick={() => updateComplaintStatus(item.id, "in_progress")}
                className="px-5 py-2 bg-yellow-600 hover:bg-yellow-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
              >
                In Progress
              </button>
            )}
            <button
              onClick={() => updateComplaintStatus(item.id, "resolved")}
              className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
            >
              Resolve
            </button>
            <button
              onClick={() => updateComplaintStatus(item.id, "rejected")}
              className="px-5 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
            >
              Reject
            </button>
          </div>
        )}

        {!isActionable && isVendorTab && (
          <div className="pt-4 border-t border-gray-100 text-sm text-gray-600 italic">
            This complaint is {getReadableStatus(item.status).toLowerCase()}.
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold" style={{ color: brandColor }}>
              Support & Complaints
            </h1>
            <p className="text-gray-600 mt-1">Review and manage incoming complaints</p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="px-6 py-3 bg-[#ff5656] hover:bg-[#e04b4b] text-white font-medium rounded-lg shadow-md transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Raise Complaint to Admin
          </button>
        </div>

        <div className="flex flex-wrap gap-3 mb-8 border-b border-gray-200 pb-5">
          {[
            { id: "driverToUser", label: "Driver → User" },
            { id: "vendor", label: "User → Vendor" },
            { id: "driver", label: "User → Driver" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-lg font-medium text-sm sm:text-base transition-all ${
                activeTab === tab.id
                  ? "text-white shadow-md"
                  : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
              }`}
              style={{ backgroundColor: activeTab === tab.id ? brandColor : undefined }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[#ff5656]"></div>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {activeTab === "driverToUser" && driverToUser.map((item) => renderCard(item, "driverToUser"))}
            {activeTab === "vendor" && vendorComplaints.map((item) => renderCard(item, "vendor"))}
            {activeTab === "driver" && driverComplaints.map((item) => renderCard(item, "driver"))}

            {((activeTab === "driverToUser" && !driverToUser.length) ||
              (activeTab === "vendor" && !vendorComplaints.length) ||
              (activeTab === "driver" && !driverComplaints.length)) && (
              <div className="col-span-full py-20 text-center text-gray-500">
                <div className="text-6xl mb-4 opacity-40">📭</div>
                <p className="text-lg">No complaints in this category</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Raise Complaint Modal */}
      {showModal && (
     <div className="fixed inset-0 backdrop-blur-sm bg-black/10 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Raise Complaint to Admin</h2>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setSubmitMessage(null);
                    setComplaintForm({ subject: "", description: "", priority: "medium" });
                  }}
                  className="text-gray-500 hover:text-gray-800 text-2xl"
                >
                  ×
                </button>
              </div>

              {submitMessage && (
                <div
                  className={`mb-5 p-3 rounded-lg ${
                    submitMessage.type === "success"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {submitMessage.text}
                </div>
              )}

              <form onSubmit={handleSubmitComplaint} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subject <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={complaintForm.subject}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff5656] focus:border-[#ff5656] outline-none"
                    placeholder="e.g. Payment delay / Order issue"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description <span className="text-red-600">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={complaintForm.description}
                    onChange={handleInputChange}
                    rows={5}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff5656] focus:border-[#ff5656] outline-none resize-none"
                    placeholder="Please describe the issue in detail..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <select
                    name="priority"
                    value={complaintForm.priority}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff5656] focus:border-[#ff5656] outline-none bg-white"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setSubmitMessage(null);
                      setComplaintForm({ subject: "", description: "", priority: "medium" });
                    }}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className={`px-6 py-2 bg-[#ff5656] text-white rounded-lg font-medium transition-colors flex items-center gap-2 ${
                      submitting ? "opacity-70 cursor-not-allowed" : "hover:bg-[#e04b4b]"
                    }`}
                  >
                    {submitting ? (
                      <>
                        <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                        Submitting...
                      </>
                    ) : (
                      "Submit Complaint"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Support;