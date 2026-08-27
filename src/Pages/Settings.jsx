import { useState } from "react";

function Settings() {
  const [name, setName] = useState("Salahuddien");
  const [email, setEmail] = useState("salahuddien@example.com");
  const [notifications, setNotifications] = useState(true);

  function saveSettings() {
    alert("Settings saved successfully!");
  }

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h1>Settings</h1>
        <p>Manage your account and application preferences.</p>
      </div>

      <div className="settings-card">
        <h2>Profile</h2>

        <label>Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="settings-card">
        <h2>Notifications</h2>

        <div className="setting-option">
          <div>
            <h3>Email Notifications</h3>
            <p>Receive updates about your projects and tasks.</p>
          </div>

          <input
            type="checkbox"
            checked={notifications}
            onChange={() => setNotifications(!notifications)}
          />
        </div>
      </div>

      <button className="save-settings" onClick={saveSettings}>
        Save Changes
      </button>
    </div>
  );
}

export default Settings;