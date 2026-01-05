import { useEffect, useState } from "react";
import { getDoctorDashboard } from "../../services/doctorApi";
import { Link } from "react-router-dom";

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

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2>Doctor Dashboard</h2>

      {/* ---- STAT CARDS ---- */}
      <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
        <div style={cardStyle}>
          <h3>Total Appointments</h3>
          <p style={numberStyle}>{data.total_appointments}</p>
        </div>

        <div style={cardStyle}>
          <h3>Upcoming</h3>
          <p style={numberStyle}>{data.upcoming_appointments}</p>
        </div>
      </div>

      {/* ---- QUICK LINKS ---- */}
      <div style={{ marginTop: "30px" }}>
        <Link to="/doctor/appointments"> My Appointments</Link> <br />
        <Link to="/doctor/today"> Today’s Appointments</Link>
      </div>
    </div>
  );
}

const cardStyle = {
  background: "#f5f5f5",
  padding: "20px",
  borderRadius: "10px",
  width: "200px",
  textAlign: "center",
};

const numberStyle = {
  fontSize: "28px",
  fontWeight: "bold",
};
