import { useEffect, useMemo, useState } from "react";
import api from "../../services/api";
import { motion } from "framer-motion";

export default function MyAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchMyAppointments();
  }, []);

  const fetchMyAppointments = async () => {
    try {
      const res = await api.get("/appointments/my");
      setAppointments(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  const filteredAppointments = useMemo(() => {
    return appointments.filter((a) => {
      const patientName = a.patient?.name?.toLowerCase() || "";
      const department = a.department?.toLowerCase() || "";
      const complaint = a.complaint?.toLowerCase() || "";

      return (
        patientName.includes(search.toLowerCase()) ||
        department.includes(search.toLowerCase()) ||
        complaint.includes(search.toLowerCase())
      );
    });
  }, [appointments, search]);

  const statusColor = (status) => {
    if (status === "approved") {
      return "bg-green-500/20 text-green-300 border border-green-400/20";
    }

    if (status === "cancelled") {
      return "bg-red-500/20 text-red-300 border border-red-400/20";
    }

    return "bg-yellow-500/20 text-yellow-300 border border-yellow-400/20";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B2A4A] flex items-center justify-center text-white text-2xl">
        Loading appointments...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0B2A4A] flex items-center justify-center text-red-300 text-xl">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B2A4A] text-white overflow-x-hidden">

      {/* HERO */}
      <div className="relative overflow-hidden border-b border-white/10 bg-gradient-to-br from-[#0F3A5F] to-[#0B2A4A]">

        <div className="absolute inset-0 opacity-10">
          <img
            src="https://images.unsplash.com/photo-1588776814546-bf8f8f4a4c7f?q=80&w=2070&auto=format&fit=crop"
            alt="appointments"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-8 py-16">

          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-bold mb-4"
          >
            My Appointments
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-[#D6E9F8] text-lg max-w-2xl"
          >
            Manage patient records, appointment history, x-rays,
            and treatment information in one place.
          </motion.p>

        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto px-6 py-14">

        {/* SEARCH */}
        <div className="mb-10">
          <div className="bg-[#0F3A5F] border border-white/10 rounded-3xl p-5 shadow-2xl">

            <p className="text-[#CFE6F7] mb-3 text-sm">
              Search by patient name, department or complaint
            </p>

            <input
              type="text"
              placeholder="Search patient..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#0B2A4A] border border-white/10 rounded-2xl p-4 outline-none text-white"
            />

          </div>
        </div>

        {/* EMPTY */}
        {filteredAppointments.length === 0 ? (
          <div className="bg-[#0F3A5F] border border-white/10 rounded-3xl p-10 text-center shadow-2xl">

            <div className="text-7xl mb-4">
              📅
            </div>

            <h2 className="text-3xl font-bold mb-3">
              No Appointments Found
            </h2>

            <p className="text-[#CFE6F7]">
              There are no matching patient appointments.
            </p>

          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

            {filteredAppointments.map((a, index) => (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.06 }}
                whileHover={{ scale: 1.01 }}
                className="bg-[#0F3A5F] border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
              >

                {/* TOP */}
                <div className="p-8 border-b border-white/10 flex items-center justify-between">

                  <div>
                    <h2 className="text-3xl font-bold">
                      {a.patient?.name || "Unknown Patient"}
                    </h2>

                    <p className="text-[#CFE6F7] mt-2">
                      Patient ID: #{a.patient?.id || a.patient_id}
                    </p>
                  </div>

                  <div className="w-20 h-20 rounded-3xl bg-[#0A66C2]/20 flex items-center justify-center text-5xl">
                    🦷
                  </div>

                </div>

                {/* BODY */}
                <div className="p-8 space-y-5">

                  {/* PATIENT INFO */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <div className="bg-[#0B2A4A] rounded-2xl p-5">
                      <p className="text-sm text-[#CFE6F7]">
                        Phone Number
                      </p>

                      <p className="font-semibold mt-2 text-lg">
                        {a.patient?.phone || "Not Available"}
                      </p>
                    </div>

                    <div className="bg-[#0B2A4A] rounded-2xl p-5">
                      <p className="text-sm text-[#CFE6F7]">
                        Department
                      </p>

                      <p className="font-semibold mt-2 text-lg">
                        {a.department || "Not Specified"}
                      </p>
                    </div>

                  </div>

                  {/* DATE */}
                  <div className="bg-[#0B2A4A] rounded-2xl p-5">

                    <p className="text-sm text-[#CFE6F7]">
                      Appointment Date
                    </p>

                    <p className="font-semibold mt-2 text-lg">
                      {new Date(a.appointment_time).toLocaleString()}
                    </p>

                  </div>

                  {/* COMPLAINT */}
                  <div className="bg-[#0B2A4A] rounded-2xl p-5">

                    <div className="flex items-center justify-between mb-3">

                      <h3 className="text-lg font-semibold">
                        Patient Complaint
                      </h3>

                      <span className="text-2xl">
                        🩺
                      </span>

                    </div>

                    <p className="text-[#D6E9F8] leading-relaxed">
                      {a.complaint ||
                        "No complaint information available."}
                    </p>

                  </div>

                  {/* X-RAY */}
                  <div className="bg-[#0B2A4A] rounded-2xl p-5">

                    <div className="flex items-center justify-between mb-4">

                      <div>
                        <h3 className="text-lg font-semibold">
                          Panoramic X-Ray
                        </h3>

                        <p className="text-sm text-[#CFE6F7] mt-1">
                          Patient dental imaging
                        </p>
                      </div>

                      <span className="text-3xl">
                        🩻
                      </span>

                    </div>

                    {a.xray_image ? (
                      <img
                        src={a.xray_image}
                        alt="xray"
                        className="w-full h-64 object-cover rounded-2xl border border-white/10"
                      />
                    ) : (
                      <div className="h-64 rounded-2xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center text-center text-[#CFE6F7]">

                        <div className="text-6xl mb-3">
                          🦷
                        </div>

                        <p className="font-medium">
                          No X-Ray Uploaded
                        </p>

                        <p className="text-sm mt-1">
                          Patient panoramic image will appear here.
                        </p>

                      </div>
                    )}

                  </div>

                  {/* STATUS */}
                  <div className="bg-[#0B2A4A] rounded-2xl p-5 flex items-center justify-between">

                    <div>
                      <p className="text-sm text-[#CFE6F7]">
                        Appointment Status
                      </p>

                      <p className="font-semibold mt-2 capitalize text-lg">
                        {a.status}
                      </p>
                    </div>

                    <div
                      className={`px-5 py-2 rounded-full text-sm font-bold ${statusColor(
                        a.status
                      )}`}
                    >
                      {a.status}
                    </div>

                  </div>

                </div>
              </motion.div>
            ))}

          </div>
        )}

      </div>
    </div>
  );
}