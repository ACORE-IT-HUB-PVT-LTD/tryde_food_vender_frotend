import React, { useEffect, useState } from "react";

function Support() {
  const [activeTab, setActiveTab] = useState("myComplaints");
  const [driverToUser, setDriverToUser] = useState([]);
  const [vendorComplaints, setVendorComplaints] = useState([]);
  const [driverComplaints, setDriverComplaints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [myComplaints, setMyComplaints] = useState([]);

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

  const validStatuses = ["open", "in_progress", "resolved", "rejected"];

  useEffect(() => {
    fetchMyComplaints();
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

  const fetchMyComplaints = async () => {
    try {
      const res = await fetch(
        "https://api.tryde.in/kitchen/complaints/get-complaint-vendor",
        { method: "GET", headers }
      );
      const data = await res.json();
      setMyComplaints(data.data || []);
    } catch (err) {
      console.error("My complaints fetch failed:", err);
    }
  };

  const updateComplaintStatus = async (complaintId, newStatus) => {
    if (!validStatuses.includes(newStatus)) {
      alert("Invalid status");
      return;
    }

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
        alert(`Status updated successfully!`);
        fetchVendorComplaints();
      } else {
        alert(result.message || "Failed to update status");
      }
    } catch (err) {
      alert("Network / server error while updating status");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setComplaintForm((prev) => ({ ...prev, [name]: value }));
  };

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
        setComplaintForm({ subject: "", description: "", priority: "medium" });
        setTimeout(() => {
          setShowModal(false);
          setSubmitMessage(null);
          fetchMyComplaints();
        }, 1800);
      } else {
        setSubmitMessage({ type: "error", text: result.message || "Failed to submit complaint" });
      }
    } catch (err) {
      setSubmitMessage({ type: "error", text: "Network error. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  const getPriorityConfig = (priority) => {
    const p = (priority || "").toLowerCase();
    if (p === "high")   return { cls: "bg-red-50 text-red-600 border border-red-200",       dot: "bg-red-500" };
    if (p === "medium") return { cls: "bg-orange-50 text-orange-600 border border-orange-200", dot: "bg-orange-500" };
    if (p === "low")    return { cls: "bg-green-50 text-green-600 border border-green-200",  dot: "bg-green-500" };
    return { cls: "bg-gray-100 text-gray-500 border border-gray-200", dot: "bg-gray-400" };
  };

  const getStatusConfig = (status) => {
    const s = (status || "open").toLowerCase().trim();
    if (s === "open")        return { cls: "bg-red-50 text-red-600",         label: "Open",        dot: "bg-red-500" };
    if (s === "in_progress") return { cls: "bg-amber-50 text-amber-700",     label: "In Progress", dot: "bg-amber-500" };
    if (s === "resolved")    return { cls: "bg-emerald-50 text-emerald-700", label: "Resolved",    dot: "bg-emerald-500" };
    if (s === "rejected")    return { cls: "bg-gray-100 text-gray-600",      label: "Rejected",    dot: "bg-gray-400" };
    return { cls: "bg-gray-100 text-gray-500", label: status, dot: "bg-gray-400" };
  };

  const TABS = [
    { id: "myComplaints", label: "My Complaints", badge: myComplaints.length },
    { id: "driverToUser", label: "Driver → User",  badge: driverToUser.length },
    { id: "vendor",       label: "User → Vendor",  badge: vendorComplaints.length },
    { id: "driver",       label: "User → Driver",  badge: driverComplaints.length },
  ];

  const directionBadge = {
    myComplaints: { label: "VENDOR → ADMIN", cls: "bg-emerald-50 text-emerald-700 border border-emerald-200" },
    driverToUser: { label: "DRIVER → USER",  cls: "bg-red-50 text-[#E53935] border border-red-200" },
    vendor:       { label: "USER → VENDOR",  cls: "bg-blue-50 text-blue-700 border border-blue-200" },
    driver:       { label: "USER → DRIVER",  cls: "bg-purple-50 text-purple-700 border border-purple-200" },
  };

  const renderPersonInfo = (type, item) => {
    if (type === "vendor") return (
      <>
        <div>
          <span className="text-xs text-gray-400 block mb-0.5">From (User)</span>
          <span className="text-sm font-semibold text-gray-800">{item.user?.name || "—"}</span>
        </div>
        <div>
          <span className="text-xs text-gray-400 block mb-0.5">To (Vendor)</span>
          <span className="text-sm font-semibold text-gray-800">You</span>
        </div>
      </>
    );
    if (type === "driverToUser") return (
      <>
        <div>
          <span className="text-xs text-gray-400 block mb-0.5">From (Driver)</span>
          <span className="text-sm font-semibold text-gray-800">{item.driver?.name || "—"}</span>
        </div>
        <div>
          <span className="text-xs text-gray-400 block mb-0.5">To (User)</span>
          <span className="text-sm font-semibold text-gray-800">{item.user?.name || "—"}</span>
        </div>
      </>
    );
    if (type === "driver") return (
      <>
        <div>
          <span className="text-xs text-gray-400 block mb-0.5">From (User)</span>
          <span className="text-sm font-semibold text-gray-800">{item.user?.name || "—"}</span>
        </div>
        <div>
          <span className="text-xs text-gray-400 block mb-0.5">To (Driver)</span>
          <span className="text-sm font-semibold text-gray-800">{item.driver?.name || "—"}</span>
        </div>
      </>
    );
    return null;
  };

  const renderCard = (item, type) => {
    const isVendorTab  = type === "vendor";
    const status       = (item.status || "open").toLowerCase().trim();
    const isActionable = isVendorTab && (status === "open" || status === "in_progress");
    const statusCfg    = getStatusConfig(item.status);
    const priorityCfg  = getPriorityConfig(item.priority);
    const dir          = directionBadge[type];

    return (
      <div
        key={item.id}
        className="group bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-[#E53935]/30 transition-all duration-200 overflow-hidden flex flex-col"
      >
        {/* Top accent */}
        <div
          className="h-1 w-full"
          style={{ background: "linear-gradient(90deg, #E53935, #FF7043)" }}
        />

        <div className="p-5 sm:p-6 flex flex-col flex-1">

          {/* Direction + Priority + Status */}
          <div className="flex items-center flex-wrap gap-2 mb-4">
            <span className={`text-[10px] font-bold tracking-widest px-2.5 py-1 rounded-full ${dir.cls}`}>
              {dir.label}
            </span>
            <span className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${priorityCfg.cls}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${priorityCfg.dot}`} />
              {(item.priority || "normal").toUpperCase()}
            </span>
            <span className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ml-auto ${statusCfg.cls}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`} />
              {statusCfg.label}
            </span>
          </div>

          {/* Subject */}
          <h3 className="font-bold text-gray-900 text-[15px] leading-snug mb-2 group-hover:text-[#E53935] transition-colors">
            {item.subject || "Untitled Complaint"}
          </h3>

          {/* Description */}
          <p className="text-[15px] text-gray-700 leading-relaxed line-clamp-3 mb-4">
            {item.description || "No description available."}
          </p>

          {/* Person info */}
          {type !== "myComplaints" && (
            <div className="grid grid-cols-2 gap-3 bg-gray-50 rounded-xl p-3 mb-4">
              {renderPersonInfo(type, item)}
            </div>
          )}

          {/* Date */}
          <div className="flex items-center gap-2 text-sm text-gray-600 mt-auto">
            <svg className="w-4 h-4 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {new Date(item.created_at).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
          </div>

          {/* Action Buttons */}
          {isActionable && (
            <div className="mt-5 pt-4 border-t border-gray-100 flex flex-wrap gap-2">
              {status === "open" && (
                <button
                  onClick={() => updateComplaintStatus(item.id, "in_progress")}
                  className="flex-1 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold rounded-lg transition-colors shadow-sm"
                >
                  In Progress
                </button>
              )}
              <button
                onClick={() => updateComplaintStatus(item.id, "resolved")}
                className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-sm"
              >
                Resolve
              </button>
              <button
                onClick={() => updateComplaintStatus(item.id, "rejected")}
                className="flex-1 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white text-xs font-semibold rounded-lg transition-colors shadow-sm"
              >
                Reject
              </button>
            </div>
          )}

          {!isActionable && isVendorTab && (
            <div className="mt-5 pt-4 border-t border-gray-100 text-sm text-gray-500 italic">
              This complaint is {statusCfg.label.toLowerCase()}.
            </div>
          )}
        </div>
      </div>
    );
  };

  const activeData = {
    myComplaints: myComplaints,
    driverToUser: driverToUser,
    vendor:       vendorComplaints,
    driver:       driverComplaints,
  }[activeTab] || [];

  return (
    <div className="min-h-screen bg-gray-50/60 py-8 px-4 sm:px-6 lg:px-8 font-['Plus_Jakarta_Sans']">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div
              className="p-4 rounded-2xl shadow-lg"
              style={{
                background: "linear-gradient(135deg, #E53935, #FF7043)",
                boxShadow: "0 8px 24px rgba(229,57,53,0.25)",
              }}
            >
              {/* Headphones icon — inline SVG, no external lib */}
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.2">
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M3 18v-6a9 9 0 0118 0v6M3 18a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3v5zM21 18a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3v5z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                Support & Complaints
              </h1>
              <p className="text-gray-600 mt-1 text-[15px]">
                Review, manage and raise complaints
              </p>
            </div>
          </div>

          <div className="text-sm font-medium text-gray-600 bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm">
            {activeData.length} {activeData.length === 1 ? "complaint" : "complaints"}
          </div>
        </div>

        {/* ── Raise Complaint button (below header, full width on mobile) ── */}
        <div className="flex justify-end">
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 px-6 py-3 text-white font-medium rounded-xl shadow-md transition-all hover:opacity-90 hover:shadow-lg"
            style={{ background: "linear-gradient(135deg, #E53935, #FF7043)" }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Raise Complaint to Admin
          </button>
        </div>

        {/* ── Tabs ── */}
        <div className="flex flex-wrap gap-3 border-b border-gray-200 pb-5">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                  isActive
                    ? "text-white shadow-md"
                    : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                }`}
                style={isActive
                  ? { background: "linear-gradient(135deg, #E53935, #FF7043)", boxShadow: "0 4px 14px rgba(229,57,53,0.3)" }
                  : {}}
              >
                {tab.label}
                {tab.badge > 0 && (
                  <span
                    className={`ml-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isActive
                        ? "bg-white/25 text-white"
                        : "bg-[#E53935]/10 text-[#E53935]"
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ── Content ── */}
        {loading ? (
          <div className="min-h-[40vh] flex flex-col items-center justify-center gap-5 text-gray-500">
            <svg
              className="w-12 h-12 animate-spin text-[#E53935]"
              fill="none" viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            <p className="text-lg font-medium">Loading complaints...</p>
          </div>
        ) : activeData.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-12 text-center">
            <div className="mx-auto w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-5">
              <svg className="w-10 h-10 text-[#E53935] opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M20 13V7a2 2 0 00-2-2H6a2 2 0 00-2 2v6m16 0v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6m16 0H4m8-5v5" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">No complaints here</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              {activeTab === "myComplaints"
                ? "You haven't raised any complaints yet."
                : "No complaints in this category."}
            </p>
            {activeTab === "myComplaints" && (
              <button
                onClick={() => setShowModal(true)}
                className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 text-white font-medium rounded-xl"
                style={{ background: "linear-gradient(135deg, #E53935, #FF7043)" }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Raise a Complaint
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {activeData.map((item) => renderCard(item, activeTab))}
            </div>
            <p className="text-center text-sm text-gray-400 pt-4">• End of complaints •</p>
          </div>
        )}
      </div>

      {/* ── Modal ── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/10">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">

            {/* Modal Header */}
            <div
              className="px-6 py-5 flex items-center justify-between"
              style={{ background: "linear-gradient(135deg, #E53935, #FF7043)" }}
            >
              <div>
                <h2 className="text-lg font-bold text-white">Raise Complaint to Admin</h2>
                <p className="text-xs text-white/75 mt-0.5">This will be sent directly to Admin</p>
              </div>
              <button
                onClick={() => {
                  setShowModal(false);
                  setSubmitMessage(null);
                  setComplaintForm({ subject: "", description: "", priority: "medium" });
                }}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center text-xl transition-colors"
              >
                ×
              </button>
            </div>

            <div className="p-6 max-h-[75vh] overflow-y-auto">

              {submitMessage && (
                <div className={`mb-5 p-3.5 rounded-xl text-sm font-medium flex items-center gap-2 ${
                  submitMessage.type === "success"
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-red-50 text-[#E53935] border border-red-200"
                }`}>
                  {submitMessage.type === "success" ? (
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                  {submitMessage.text}
                </div>
              )}

              <form onSubmit={handleSubmitComplaint} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5">
                    Subject <span className="text-[#E53935]">*</span>
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={complaintForm.subject}
                    onChange={handleInputChange}
                    placeholder="e.g. Payment delay / Order issue"
                    required
                    className="w-full px-4 py-2.5 text-[15px] border border-gray-300 rounded-xl outline-none transition-all focus:border-[#E53935] focus:ring-2 focus:ring-[#E53935]/10"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5">
                    Description <span className="text-[#E53935]">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={complaintForm.description}
                    onChange={handleInputChange}
                    rows={5}
                    placeholder="Describe the issue in detail..."
                    required
                    className="w-full px-4 py-2.5 text-[15px] border border-gray-300 rounded-xl outline-none resize-none transition-all focus:border-[#E53935] focus:ring-2 focus:ring-[#E53935]/10"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5">
                    Priority
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {["low", "medium", "high"].map((p) => {
                      const colors = {
                        low:    "border-emerald-300 bg-emerald-50 text-emerald-700",
                        medium: "border-amber-300 bg-amber-50 text-amber-700",
                        high:   "border-red-300 bg-red-50 text-[#E53935]",
                      };
                      const selected = complaintForm.priority === p;
                      return (
                        <button
                          type="button"
                          key={p}
                          onClick={() => setComplaintForm((prev) => ({ ...prev, priority: p }))}
                          className={`py-2 text-xs font-bold rounded-xl border-2 capitalize transition-all ${
                            selected
                              ? colors[p] + " scale-105 shadow-sm"
                              : "border-gray-200 text-gray-400 hover:border-gray-300"
                          }`}
                        >
                          {p}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setSubmitMessage(null);
                      setComplaintForm({ subject: "", description: "", priority: "medium" });
                    }}
                    className="flex-1 py-2.5 border border-gray-300 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className={`flex-1 py-2.5 text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-2 transition-all ${
                      submitting ? "opacity-70 cursor-not-allowed" : "hover:opacity-90 hover:shadow-md"
                    }`}
                    style={{ background: "linear-gradient(135deg, #E53935, #FF7043)" }}
                  >
                    {submitting ? (
                      <>
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                        </svg>
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

      {/* Font import — same as Announcement */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
      `}</style>
    </div>
  );
}

export default Support;