import { Link, Outlet, useNavigate } from "react-router-dom";

export default function DoctorLayout() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("doctor_token");
    navigate("/doctor/login");
  };

  return (
    <div>
      {/* TOP BAR */}
      <div
        style={{
          padding: "15px 30px",
          background: "#1e293b",
          color: "white",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h3>🩺 Doctor Panel</h3>

        <div style={{ display: "flex", gap: "20px" }}>
          <Link to="/doctor/dashboard" style={linkStyle}>Dashboard</Link>
          <Link to="/doctor/appointments" style={linkStyle}>My Appointments</Link>
          <Link to="/doctor/today" style={linkStyle}>Today</Link>
          <button onClick={logout} style={logoutStyle}>Logout</button>
        </div>
      </div>

      {/* PAGE CONTENT */}
      <div style={{ padding: "30px" }}>
        <Outlet />
      </div>
    </div>
  );
}

const linkStyle = {
  color: "white",
  textDecoration: "none",
  fontWeight: "500",
};

const logoutStyle = {
  background: "#ef4444",
  border: "none",
  padding: "6px 12px",
  color: "white",
  cursor: "pointer",
  borderRadius: "4px",
};
