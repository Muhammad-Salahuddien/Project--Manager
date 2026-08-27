import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="sidebar">

      <div className="sidebar-logo">
        <h2>TaskFlow</h2>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/dashboard">Dashboard</NavLink>
        <NavLink to="/projects">Projects</NavLink>
        <NavLink to="/tasks">Tasks</NavLink>
        <NavLink to="/team">Team</NavLink>
        <NavLink to="/calendar">Calendar</NavLink>
      </nav>

      <div className="sidebar-bottom">
        <NavLink to="/settings">Settings</NavLink>
        <NavLink to="/login">Logout</NavLink>
      </div>

    </aside>
  );
}

export default Sidebar;