import { useEffect, useState } from "react";

function Projects() {
  const today = new Date().toISOString().split("T")[0];

  const [projects, setProjects] = useState(() => {
    const savedProjects = localStorage.getItem("projects");
    return savedProjects ? JSON.parse(savedProjects) : [];
  });

  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Active");
  const [startDate, setStartDate] = useState(today);
  const [dueDate, setDueDate] = useState("");
  const [dueTime, setDueTime] = useState("");

  useEffect(() => {
    localStorage.setItem("projects", JSON.stringify(projects));

    window.dispatchEvent(new Event("projectsUpdated"));
  }, [projects]);

  function addProject(e) {
    e.preventDefault();

    if (!name.trim()) {
      alert("Please enter a project name.");
      return;
    }

    const newProject = {
      id: Date.now(),
      name,
      description,
      status,
      startDate,
      dueDate,
      dueTime
    };

    setProjects([...projects, newProject]);

    setName("");
    setDescription("");
    setStatus("Active");
    setStartDate(today);
    setDueDate("");
    setDueTime("");
    setShowForm(false);
  }

  function deleteProject(id) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this project?"
    );

    if (!confirmDelete) return;

    setProjects(
      projects.filter((project) => project.id !== id)
    );
  }

  function updateStatus(id, status) {
    setProjects(
      projects.map((project) =>
        project.id === id
          ? { ...project, status }
          : project
      )
    );
  }

  function formatTime(time) {
    if (!time) return "No time";

    const [hours, minutes] = time.split(":");
    const hour = Number(hours);

    const formattedHour = hour % 12 || 12;
    const period = hour >= 12 ? "PM" : "AM";

    return `${String(formattedHour).padStart(2, "0")}:${minutes} ${period}`;
  } 

  return (
    <div className="projects-page">
      <div className="projects-header">
        <div>
          <h1>Projects</h1>
          <p>Manage and track all your projects.</p>
        </div>

        <button onClick={() => setShowForm(true)}>
          + New Project
        </button>
      </div>

      {showForm && (
        <form
          className="project-form"
          onSubmit={addProject}
        >
          <h2>Create New Project</h2>

          <input
            type="text"
            placeholder="Project name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <textarea
            placeholder="Project description"
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
          />

          <div className="project-form-row">
            <select
              value={status}
              onChange={(e) =>
                setStatus(e.target.value)
              }
            >
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
              <option value="Completed">
                Completed
              </option>
            </select>

            <input
              type="date"
              value={startDate}
              onChange={(e) =>
                setStartDate(e.target.value)
              }
            />

            <input
              type="date"
              value={dueDate}
              onChange={(e) =>
                setDueDate(e.target.value)
              }
            />

            <input
              type="time"
              value={dueTime}
              onChange={(e) =>
                setDueTime(e.target.value)
              }
            />
          </div>

          <div className="project-form-buttons">
            <button type="submit">
              Create Project
            </button>

            <button
              type="button"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="project-cards">
        {projects.length === 0 ? (
          <div className="empty-projects">
            <h3>No projects yet</h3>
            <p>
              Create your first project to get started.
            </p>
          </div>
        ) : (
          projects.map((project) => (
            <div
              className="project-card"
              key={project.id}
            >
              <div className="project-card-header">
                <div>
                  <h2>{project.name}</h2>

                  <select
                    className={`project-status ${project.status.toLowerCase()}`}
                    value={project.status}
                    onChange={(e) =>
                      updateStatus(
                        project.id,
                        e.target.value
                      )
                    }
                  >
                    <option value="Active">
                      Active
                    </option>

                    <option value="Pending">
                      Pending
                    </option>

                    <option value="Completed">
                      Completed
                    </option>
                  </select>
                </div>

                <button
                  className="delete-project"
                  onClick={() =>
                    deleteProject(project.id)
                  }
                >
                  Delete
                </button>
              </div>

              <p className="project-description">
                {project.description ||
                  "No description added."}
              </p>

              <div className="project-dates">
                <span>
                  Start:{" "}
                  {project.startDate || "Not set"}
                </span>

                <span>
                  Due:{" "}
                  {project.dueDate || "Not set"}
                </span>

                <span>
                 Time: {formatTime(project.dueTime)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Projects;