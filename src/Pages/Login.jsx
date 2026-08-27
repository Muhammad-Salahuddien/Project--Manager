import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  function handleLogin(e) {
    e.preventDefault();

    const users = JSON.parse(
      localStorage.getItem("users") || "[]"
    );

    // Old account ko admin account mein convert karna
    const oldUser = JSON.parse(
      localStorage.getItem("user")
    );

    if (oldUser && users.length === 0) {
      const adminUser = {
        ...oldUser,
        id: oldUser.id || Date.now(),
        userRole: "admin",
        teamId: null
      };

      users.push(adminUser);

      localStorage.setItem(
        "users",
        JSON.stringify(users)
      );
    }

    const user = users.find(
      (user) =>
        user.email.toLowerCase() ===
          email.toLowerCase() &&
        user.password === password
    );

    if (!user) {
      alert("Email or password is incorrect.");
      return;
    }

    localStorage.setItem(
      "currentUser",
      JSON.stringify(user)
    );

    localStorage.setItem("loggedIn", "true");

    navigate("/dashboard");
  }

  return (
    <div className="auth-page">
      <div className="auth-card">

        <h1>Welcome Back</h1>

        <p>
          Login to manage your projects and tasks.
        </p>

        <form onSubmit={handleLogin}>

          <label>Email</label>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            required
          />

          <label>Password</label>

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            required
          />

          <button type="submit">
            Login
          </button>

        </form>

        <p className="auth-link">
          Don't have an account?{" "}
          <Link to="/signup">
            Sign Up
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Login;