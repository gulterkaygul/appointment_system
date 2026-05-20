import { useEffect, useState } from "react";
import { getTodayAppointments } from "../../services/doctorApi";
import { motion } from "framer-motion";

export default function TodayAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadToday = async () => {
      try {
        const res = await getTodayAppointments();
        setAppointments(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadToday();
  }, []);

  if (loading)
    return (
      <div className="min-h-screen bg-[#0B2A4A] flex items-center justify-center text-blue-300 text-2xl">
        Loading appointments...
      </div>
    );

  return (
    <div className="min-h-screen bg-[#0B2A4A] text-white overflow-x-hidden">

      {/* HERO */}
      <div className="relative overflow-hidden border-b border-white/10 bg-gradient-to-br from-[#0F3A5F] to-[#0B2A4A]">

        <div className="absolute inset-0 opacity-10">
          <img
            src="https://images.unsplash.com/photo-1584515933487-779824d29309?q=80&w=2070&auto=format&fit=crop"
            alt="today appointments"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-8 py-16">

          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-bold mb-4"
          >
            Today’s Appointments
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-[#D6E9F8] text-lg max-w-2xl"
          >
            Manage today's patient schedule, appointment status,
            and clinical workflow efficiently.
          </motion.p>

        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto px-6 py-14">

        {/* TOP STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-[#0F3A5F] border border-white/10 rounded-3xl p-6 shadow-2xl"
          >
            <p className="text-[#CFE6F7] text-sm">
              Total Appointments
            </p>

            <h2 className="text-5xl font-bold mt-3">
              {appointments.length}
            </h2>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-[#0F3A5F] border border-white/10 rounded-3xl p-6 shadow-2xl"
          >
            <p className="text-[#CFE6F7] text-sm">
              Current Date
            </p>

            <h2 className="text-2xl font-bold mt-3">
              {new Date().toLocaleDateString()}
            </h2>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-[#0F3A5F] border border-white/10 rounded-3xl p-6 shadow-2xl"
          >
            <p className="text-[#CFE6F7] text-sm">
              Active Schedule
            </p>

            <h2 className="text-2xl font-bold mt-3 text-green-300">
              Running
            </h2>
          </motion.div>

        </div>

        {/* EMPTY */}
        {appointments.length === 0 ? (
          <div className="bg-[#0F3A5F] p-12 rounded-3xl border border-white/10 shadow-2xl text-center">

            <div className="text-7xl mb-4">
              📅
            </div>

            <h2 className="text-3xl font-bold mb-3">
              No Appointments Today
            </h2>

            <p className="text-[#CFE6F7]">
              There are currently no appointments scheduled for today.
            </p>

          </div>
        ) : (
          <>
            {/* TABLE */}
            <div className="bg-[#0F3A5F] rounded-3xl shadow-2xl border border-blue-500/10 overflow-hidden">

              <div className="flex items-center justify-between px-8 py-6 border-b border-white/10">

                <div>
                  <h2 className="text-2xl font-bold text-[#EAF4FF]">
                    Daily Appointment List
                  </h2>

                  <p className="text-[#CFE6F7] mt-1 text-sm">
                    Monitor patient flow and treatment schedule
                  </p>
                </div>

                <div className="text-5xl">
                  🦷
                </div>

              </div>

              <div className="overflow-x-auto">

                <table className="w-full text-left border-collapse">

                  <thead>
                    <tr className="border-b border-blue-500/20 text-blue-300 bg-[#0B2A4A]/40">

                      <th className="py-5 px-6 font-semibold">
                        Time
                      </th>

                      <th className="py-5 px-6 font-semibold">
                        Patient Name
                      </th>

                      <th className="py-5 px-6 font-semibold">
                        Department
                      </th>

                      <th className="py-5 px-6 font-semibold">
                        Status
                      </th>

                    </tr>
                  </thead>

                  <tbody>
                    {appointments.map((a, index) => (
                      <motion.tr
                        key={a.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b border-blue-500/10 hover:bg-[#0B2A4A]/50 transition"
                      >

                        <td className="py-6 px-6">

                          <div className="bg-[#0B2A4A] rounded-2xl px-4 py-3 w-fit">
                            <span className="text-[#EAF4FF] font-semibold">
                              {new Date(a.appointment_time).toLocaleTimeString(
                                [],
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </span>
                          </div>

                        </td>

                        <td className="py-6 px-6">

                          <div>
                            <p className="font-semibold text-lg">
                              {a.patient
                                ? a.patient.name
                                : `Patient #${a.patient_id}`}
                            </p>

                            <p className="text-sm text-[#CFE6F7] mt-1">
                              ID: #{a.patient_id}
                            </p>
                          </div>

                        </td>

                        <td className="py-6 px-6">

                          <div className="bg-[#0B2A4A] rounded-2xl px-4 py-3 w-fit text-blue-200">
                            {a.department}
                          </div>

                        </td>

                        <td className="py-6 px-6">

                          <span
                            className={`px-4 py-2 rounded-full text-sm font-semibold border ${
                              a.status === "approved"
                                ? "bg-green-500/20 text-green-300 border-green-500/20"
                                : a.status === "pending"
                                ? "bg-yellow-500/20 text-yellow-300 border-yellow-500/20"
                                : "bg-red-500/20 text-red-300 border-red-500/20"
                            }`}
                          >
                            {a.status}
                          </span>

                        </td>

                      </motion.tr>
                    ))}
                  </tbody>

                </table>

              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
}