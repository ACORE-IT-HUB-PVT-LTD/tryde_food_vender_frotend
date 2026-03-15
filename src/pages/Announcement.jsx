import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Bell,
  CheckCircle,
  AlertCircle,
  Calendar,
  Info,
  Loader2,
} from "lucide-react"; // npm install lucide-react

function Announcement() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          "https://api.tryde.in/kitchen/announcements/get",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setAnnouncements(res.data.data || []);
      } catch (err) {
        setError("Failed to load announcements. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-5 text-gray-500">
        <Loader2 className="h-12 w-12 animate-spin text-[#E53935]" />
        <p className="text-lg font-medium">Loading announcements...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center p-4">
        <div className="bg-red-50 border border-red-200 text-[#E53935] rounded-2xl p-8 max-w-md text-center shadow-sm">
          <AlertCircle className="h-12 w-12 mx-auto mb-4 text-[#E53935]" />
          <p className="text-lg font-semibold">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/60 py-8 px-4 sm:px-6 lg:px-8 font-['Plus_Jakarta_Sans']">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-[#E53935] to-[#FF7043] p-4 rounded-2xl shadow-lg shadow-red-500/25">
              <Bell className="h-8 w-8 text-white" strokeWidth={2.2} />
            </div>
            <div>
              <h1 className="text-xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                Announcements
              </h1>
              <p className="text-gray-600 mt-1 text-[15px]">
                Important kitchen updates & notices
              </p>
            </div>
          </div>

          <div className="text-sm font-medium text-gray-600 bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm">
            {announcements.length} {announcements.length === 1 ? "notice" : "notices"}
          </div>
        </div>

        {/* Content */}
        {announcements.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-12 text-center">
            <div className="mx-auto w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-5">
              <Bell className="h-10 w-10 text-[#E53935] opacity-70" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">
              No announcements yet
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Important kitchen updates, offers, or notices will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {announcements.map((item) => (
              <div
                key={item.id}
                className={`
                  group bg-white rounded-2xl border shadow-sm overflow-hidden
                  transition-all duration-200 hover:shadow-md hover:border-[#E53935]/30
                  ${item.is_read
                    ? "border-gray-200"
                    : "border-l-4 border-l-[#E53935] bg-gradient-to-r from-red-50/60 to-white"}
                `}
              >
                <div className="p-5 sm:p-6 flex flex-col sm:flex-row gap-5">
                  {/* Icon */}
                  <div className="flex-shrink-0">
                    {item.type === "info" && (
                      <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                        <Info className="h-6 w-6 text-blue-600" />
                      </div>
                    )}
                    {item.type === "alert" && (
                      <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                        <AlertCircle className="h-6 w-6 text-amber-600" />
                      </div>
                    )}
                    {item.type === "update" && (
                      <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                        <CheckCircle className="h-6 w-6 text-emerald-600" />
                      </div>
                    )}
                    {!["info", "alert", "update"].includes(item.type) && (
                      <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
                        <Bell className="h-6 w-6 text-[#E53935]" />
                      </div>
                    )}
                  </div>

                  {/* Main content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <h3
                        className={`text-lg font-bold leading-tight ${
                          item.is_read ? "text-gray-900" : "text-[#E53935]"
                        } group-hover:text-[#E53935] transition-colors`}
                      >
                        {item.title}
                      </h3>

                      {!item.is_read && (
                        <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-[#E53935]/10 text-[#E53935] whitespace-nowrap">
                          New
                        </span>
                      )}
                    </div>

                    <p className="mt-3 text-gray-700 text-[15px] leading-relaxed">
                      {item.message}
                    </p>

                    <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        {new Date(item.created_at).toLocaleString([], {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>

                      <span className="text-xs bg-gray-100 px-3 py-1 rounded-full font-medium">
                        {item.type}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {announcements.length > 0 && (
        <p className="text-center text-sm text-gray-400 mt-10">
          • End of announcements •
        </p>
      )}

      {/* Keep same font import style as your Category component */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
      `}</style>
    </div>
  );
}

export default Announcement;