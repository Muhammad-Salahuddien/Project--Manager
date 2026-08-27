import { useEffect, useState } from "react";

function Dashboard() {
  const [projects, setProjects] = useState(() => {
    const savedProjects = localStorage.getItem("projects");
    return savedProjects ? JSON.parse(savedProjects) : [];
  });

  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  useEffect(() => {
    function loadProjects() {
      const savedProjects = localStorage.getItem("projects");

      setProjects(savedProjects ? JSON.parse(savedProjects) : []);
    }

    loadProjects();

    window.addEventListener("projectsUpdated", loadProjects);

    return () => {
      window.removeEventListener("projectsUpdated", loadProjects);
    };
  }, []);

  useEffect(() => {
    function loadTasks() {
      const savedTasks = localStorage.getItem("tasks");

      setTasks(savedTasks ? JSON.parse(savedTasks) : []);
    }

    loadTasks();

    window.addEventListener("tasksUpdated", loadTasks);

    return () => {
      window.removeEventListener("tasksUpdated", loadTasks);
    };
  }, []);

  const pendingTasks = tasks.filter(
    (task) => task.status === "Pending"
  );

  const completedTasks = tasks.filter(
    (task) => task.status === "Completed"
  );

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Good evening 👋</h1>
          <p>Here's what's happening with your projects today.</p>
        </div>
      </div>

      {/* Project Stats */}

      <div className="stats">
        <div className="stat-card">
          <span>Total Projects</span>
          <h2>{projects.length}</h2>
        </div>

        <div className="stat-card">
          <span>Active Projects</span>
          <h2>
            {
              projects.filter(
                (project) => project.status === "Active"
              ).length
            }
          </h2>
        </div>

        <div className="stat-card">
          <span>Completed Projects</span>
          <h2>
            {
              projects.filter(
                (project) => project.status === "Completed"
              ).length
            }
          </h2>
        </div>

        <div className="stat-card">
          <span>Pending Projects</span>
          <h2>
            {
              projects.filter(
                (project) => project.status === "Pending"
              ).length
            }
          </h2>
        </div>
      </div>

      {/* Task Stats */}

      <div className="stats">
        <div className="stat-card">
          <span>Total Tasks</span>
          <h2>{tasks.length}</h2>
        </div>

        <div className="stat-card">
          <span>Pending Tasks</span>
          <h2>{pendingTasks.length}</h2>
        </div>

        <div className="stat-card">
          <span>Completed Tasks</span>
          <h2>{completedTasks.length}</h2>
        </div>

        <div className="stat-card">
          <span>In Progress Tasks</span>
          <h2>
            {
              tasks.filter(
                (task) => task.status === "In Progress"
              ).length
            }
          </h2>
        </div>
      </div>

      {/* Recent Projects */}

      <div className="recent-projects">
        <h2>Recent Projects</h2>

        {projects.length === 0 ? (
          <div className="empty-projects">
            <h3>No projects yet</h3>
            <p>Create a project from the Projects page.</p>
          </div>
        ) : (
          projects.map((project) => (
            <div className="project-item" key={project.id}>
              <div>
                <h3>{project.name}</h3>

                <p>
                  {project.description || "No description added."}
                </p>
              </div>

              <span>{project.status}</span>
            </div>
          ))
        )}
      </div>

      {/* Tasks */}

      <div className="recent-projects">
        <h2>Tasks</h2>

        {tasks.length === 0 ? (
          <div className="empty-projects">
            <h3>No tasks yet</h3>
            <p>Create a task from the Tasks page.</p>
          </div>
        ) : (
          tasks.map((task) => (
            <div className="project-item" key={task.id}>
              <div>
                <h3>{task.name}</h3>

                <p>
                  {task.description || "No description added."}
                </p>
              </div>

              <span>{task.status}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Dashboard;