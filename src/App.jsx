import { BrowserRouter, Routes, Route } from "react-router-dom";

import Sidebar from "./Components/Sidebar";
import Dashboard from "./Pages/Dashboard";
import Projects from "./Pages/Projects";
import Tasks from "./Pages/Tasks";
import Team from "./Pages/Team";
import Calendar from "./Pages/Calendar";
import Settings from "./Pages/Settings";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/signup"
          element={<Signup />}
        />

        <Route
          path="/dashboard"
          element={
            <div className="app-layout">
              <Sidebar />

              <main className="main-content">
                <Dashboard />
              </main>
            </div>
          }
        />

        <Route
          path="/projects"
          element={
            <div className="app-layout">
              <Sidebar />

              <main className="main-content">
                <Projects />
              </main>
            </div>
          }
        />

        <Route
          path="/tasks"
          element={
            <div className="app-layout">
              <Sidebar />

              <main className="main-content">
                <Tasks />
              </main>
            </div>
          }
        />

        <Route
          path="/team"
          element={
            <div className="app-layout">
              <Sidebar />

              <main className="main-content">
                <Team />
              </main>
            </div>
          }
        />

        <Route
          path="/calendar"
          element={
            <div className="app-layout">
              <Sidebar />

              <main className="main-content">
                <Calendar />
              </main>
            </div>
          }
        />

        <Route
          path="/settings"
          element={
            <div className="app-layout">
              <Sidebar />

              <main className="main-content">
                <Settings />
              </main>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;