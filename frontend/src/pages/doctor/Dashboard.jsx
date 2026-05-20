import { useEffect, useState } from "react";
import { getDoctorDashboard } from "../../services/doctorApi";
import { Link } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const res = await getDoctorDashboard();
        setData(res);
      } catch (err) {
        console.error("Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B2A4A] flex items-center justify-center text-white text-2xl">
        Loading Dashboard...
      </div>
    );
  }

  const chartData = [
    { name: "Total", value: data.total_appointments },
    { name: "Upcoming", value: data.upcoming_appointments },
  ];

  return (
    <div className="min-h-screen bg-[#0B2A4A] text-white overflow-x-hidden">

      {/* TOP HERO */}
      <div className="relative overflow-hidden border-b border-white/10 bg-gradient-to-br from-[#0F3A5F] to-[#0B2A4A]">

        <div className="absolute inset-0 opacity-10">
          <img
            src="https://images.unsplash.com/photo-1588776814546-bf8f8f4a4c7f?q=80&w=2070&auto=format&fit=crop"
            alt="doctor"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="relative z-10 px-10 py-16 max-w-7xl mx-auto">

          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-bold mb-4"
          >
            Doctor Dashboard
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-[#D6E9F8] text-lg max-w-2xl"
          >
            Manage appointments, monitor patient schedules,
            and track daily activity with a modern healthcare dashboard.
          </motion.p>

        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto px-6 py-14">

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">

          <motion.div
            whileHover={{ scale: 1.03 }}
            className="bg-[#0F3A5F] border border-white/10 rounded-3xl p-8 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-[#CFE6F7] text-sm uppercase tracking-wider">
                  Total Appointments
                </h3>

                <p className="text-5xl font-bold mt-3">
                  {data.total_appointments}
                </p>
              </div>

              <div className="w-16 h-16 rounded-2xl bg-[#0A66C2]/20 flex items-center justify-center text-3xl">
                📅
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.03 }}
            className="bg-[#0F3A5F] border border-white/10 rounded-3xl p-8 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-[#CFE6F7] text-sm uppercase tracking-wider">
                  Upcoming Appointments
                </h3>

                <p className="text-5xl font-bold mt-3">
                  {data.upcoming_appointments}
                </p>
              </div>

              <div className="w-16 h-16 rounded-2xl bg-[#00B894]/20 flex items-center justify-center text-3xl">
                ⏰
              </div>
            </div>
          </motion.div>

        </div>

        {/* CHART */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#0F3A5F] border border-white/10 rounded-3xl p-8 shadow-2xl mb-12"
        >
          <div className="flex items-center justify-between mb-6">

            <div>
              <h3 className="text-2xl font-bold">
                Appointment Activity
              </h3>

              <p className="text-[#CFE6F7] text-sm mt-1">
                Overview of your appointment statistics
              </p>
            </div>

          </div>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <XAxis
                dataKey="name"
                stroke="#CFE6F7"
              />

              <YAxis stroke="#CFE6F7" />

              <Tooltip />

              <Bar
                dataKey="value"
                fill="#0A66C2"
                radius={[10, 10, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* QUICK ACTIONS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          <Link to="/doctor/appointments">
            <motion.div
              whileHover={{ scale: 1.03 }}
              className="bg-gradient-to-br from-[#0A66C2] to-[#084C91] rounded-3xl p-8 shadow-2xl h-full"
            >
              <div className="text-5xl mb-4">
                🦷
              </div>

              <h4 className="text-2xl font-bold mb-2">
                My Appointments
              </h4>

              <p className="text-[#D6E9F8]">
                View and manage all scheduled patient appointments.
              </p>
            </motion.div>
          </Link>

          <Link to="/doctor/today">
            <motion.div
              whileHover={{ scale: 1.03 }}
              className="bg-gradient-to-br from-[#3B1F3F] to-[#241226] rounded-3xl p-8 shadow-2xl h-full"
            >
              <div className="text-5xl mb-4">
                📋
              </div>

              <h4 className="text-2xl font-bold mb-2">
                Today's Schedule
              </h4>

              <p className="text-[#D6E9F8]">
                Check today's appointments and patient queue.
              </p>
            </motion.div>
          </Link>

        </div>

      </div>
    </div>
  );
}