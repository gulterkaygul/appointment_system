import { useEffect, useState } from "react";
import { getDoctorDashboard } from "../../services/doctorApi";
import { Link } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

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

  if (loading) return <p className="p-10">Loading...</p>;

  const chartData = [
    { name: "Total", value: data.total_appointments },
    { name: "Upcoming", value: data.upcoming_appointments },
  ];

  return (
    <div className="min-h-screen bg-[#EAF4FF] p-10">

      {/* HEADER */}
      <h2 className="text-3xl font-bold text-[#0B2A4A] mb-8">
        Doctor Dashboard
      </h2>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">

        <div className="bg-white shadow-md rounded-2xl p-6 border-l-4 border-[#0A66C2]">
          <h3 className="text-gray-500 text-sm">Total Appointments</h3>
          <p className="text-4xl font-bold text-[#0B2A4A] mt-2">
            {data.total_appointments}
          </p>
        </div>

        <div className="bg-white shadow-md rounded-2xl p-6 border-l-4 border-[#3B1F3F]">
          <h3 className="text-gray-500 text-sm">Upcoming Appointments</h3>
          <p className="text-4xl font-bold text-[#0B2A4A] mt-2">
            {data.upcoming_appointments}
          </p>
        </div>

      </div>

      {/* CHART */}
      <div className="bg-white rounded-2xl shadow-md p-6 mb-10">
        <h3 className="text-xl font-semibold text-[#0B2A4A] mb-4">
          Appointment Activity
        </h3>

        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#0A66C2" radius={[6,6,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* QUICK ACTIONS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <Link
          to="/doctor/appointments"
          className="bg-[#0A66C2] text-white p-6 rounded-2xl shadow hover:scale-105 transition"
        >
          <h4 className="text-xl font-semibold">My Appointments</h4>
          <p className="text-sm opacity-90 mt-1">
            View all your scheduled appointments
          </p>
        </Link>

        <Link
          to="/doctor/today"
          className="bg-[#3B1F3F] text-white p-6 rounded-2xl shadow hover:scale-105 transition"
        >
          <h4 className="text-xl font-semibold">Today's Appointments</h4>
          <p className="text-sm opacity-90 mt-1">
            See today's patient schedule
          </p>
        </Link>

      </div>
    </div>
  );
}