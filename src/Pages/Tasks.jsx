import { useEffect, useState } from "react";

function Tasks() {
  const [projects] = useState(() => {
    const savedProjects = localStorage.getItem("projects");

    return savedProjects
      ? JSON.parse(savedProjects)
      : [];
  });

  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("tasks");

    return savedTasks
      ? JSON.parse(savedTasks)
      : [];
  });

  const [teams] = useState(() => {
    const savedTeams = localStorage.getItem("teams");

    return savedTeams
      ? JSON.parse(savedTeams)
      : [];
  });

  const [currentUser] = useState(() => {
    const savedUser = localStorage.getItem("currentUser");

    return savedUser
      ? JSON.parse(savedUser)
      : null;
  });

  const [selectedProject, setSelectedProject] =
    useState("");

  const [showForm, setShowForm] = useState(false);

  const [taskName, setTaskName] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [dueDate, setDueDate] = useState("");
  const [dueTime, setDueTime] = useState("");

  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);

  const [assignedTo, setAssignedTo] = useState("");

  /*
    ------------------------------------------------
    CURRENT USER ROLE
    ------------------------------------------------
  */

  const isAdmin =
    currentUser?.userRole === "admin";

  const isLeader =
    currentUser?.userRole === "leader";

  const isMember =
    currentUser?.userRole === "member";

  const canCreateTask =
    isAdmin || isLeader;

  /*
    ------------------------------------------------
    CURRENT TEAM
    ------------------------------------------------
  */

  const currentTeam = teams.find(
    (team) =>
      team.id === currentUser?.teamId
  );

  /*
    ------------------------------------------------
    TEAM MEMBERS
    ------------------------------------------------
  */

  const currentTeamMembers =
    currentTeam?.members || [];

  /*
    ------------------------------------------------
    MEMBERS AVAILABLE FOR ASSIGNMENT
    ------------------------------------------------

    Admin:
    All team members

    Team Leader:
    Only his/her team members

    Member:
    Cannot create tasks
  */

  const assignableMembers = isAdmin
    ? teams.flatMap((team) =>
        team.members.map((member) => ({
          ...member,
          teamName: team.name
        }))
      )
    : currentTeamMembers;

  /*
    ------------------------------------------------
    SELECT FIRST PROJECT
    ------------------------------------------------
  */

  useEffect(() => {
    if (
      projects.length > 0 &&
      !selectedProject
    ) {
      setSelectedProject(projects[0].id);
    }
  }, [
    projects,
    selectedProject
  ]);

  /*
    ------------------------------------------------
    SAVE TASKS
    ------------------------------------------------
  */

  useEffect(() => {
    localStorage.setItem(
      "tasks",
      JSON.stringify(tasks)
    );

    window.dispatchEvent(
      new Event("tasksUpdated")
    );
  }, [tasks]);

  /*
    ------------------------------------------------
    VISIBLE TASKS
    ------------------------------------------------

    Admin:
    All tasks

    Leader:
    Only team tasks

    Member:
    Only assigned tasks
  */

  const visibleTasks = tasks.filter(
    (task) => {
      if (isAdmin) {
        return true;
      }

      if (isLeader) {
        return (
          task.teamId ===
          currentUser?.teamId
        );
      }

      if (isMember) {
        return (
          task.assignedTo ===
          currentUser?.id
        );
      }

      return false;
    }
  );

  /*
    ------------------------------------------------
    PROJECT TASKS
    ------------------------------------------------
  */

  const projectTasks =
    visibleTasks.filter(
      (task) =>
        task.projectId ===
        Number(selectedProject)
    );

  /*
    ------------------------------------------------
    CREATE TASK
    ------------------------------------------------
  */

  function addTask(e) {
    e.preventDefault();

    if (!taskName.trim()) {
      alert("Please enter task name.");
      return;
    }

    if (!selectedProject) {
      alert("Please select a project.");
      return;
    }

    if (!assignedTo) {
      alert(
        "Please select a team member."
      );
      return;
    }

    const selectedMember =
      assignableMembers.find(
        (member) =>
          member.id ===
          Number(assignedTo)
      );

    if (!selectedMember) {
      alert(
        "Please select a valid team member."
      );
      return;
    }

    const newTask = {
      id: Date.now(),

      projectId:
        Number(selectedProject),

      name: taskName.trim(),

      description: description.trim(),

      priority,

      dueDate,

      dueTime,

      status: "Pending",

      image,

      video,

      assignedTo:
        selectedMember.id,

      assignedToName:
        selectedMember.name,

      teamId:
        selectedMember.teamId ||
        currentUser?.teamId ||
        null,

      createdBy:
        currentUser?.id || null,

      createdByName:
        currentUser?.name || null
    };

    setTasks([
      ...tasks,
      newTask
    ]);

    /*
      Reset form
    */

    setTaskName("");
    setDescription("");
    setPriority("Medium");
    setDueDate("");
    setDueTime("");
    setImage(null);
    setVideo(null);
    setAssignedTo("");

    setShowForm(false);
  }

  /*
    ------------------------------------------------
    DELETE TASK
    ------------------------------------------------
  */

  function deleteTask(id) {
    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this task?"
      );

    if (!confirmDelete) {
      return;
    }

    setTasks(
      tasks.filter(
        (task) => task.id !== id
      )
    );
  }

  /*
    ------------------------------------------------
    UPDATE STATUS
    ------------------------------------------------
  */

  function updateStatus(id, status) {
    setTasks(
      tasks.map((task) =>
        task.id === id
          ? {
              ...task,
              status
            }
          : task
      )
    );
  }

  /*
    ------------------------------------------------
    FORMAT TIME
    ------------------------------------------------
  */

  function formatTime(time) {
    if (!time) {
      return "Not set";
    }

    const [hours, minutes] =
      time.split(":");

    const hour = Number(hours);

    const formattedHour =
      hour % 12 || 12;

    const period =
      hour >= 12
        ? "PM"
        : "AM";

    return `${String(
      formattedHour
    ).padStart(
      2,
      "0"
    )}:${minutes} ${period}`;
  }

  /*
    ------------------------------------------------
    IMAGE UPLOAD
    ------------------------------------------------
  */

  function handleImage(e) {
    const file =
      e.target.files[0];

    if (!file) {
      return;
    }

    const reader =
      new FileReader();

    reader.onload = () => {
      setImage(
        reader.result
      );
    };

    reader.readAsDataURL(file);
  }

  /*
    ------------------------------------------------
    VIDEO UPLOAD
    ------------------------------------------------
  */

  function handleVideo(e) {
    const file =
      e.target.files[0];

    if (!file) {
      return;
    }

    const reader =
      new FileReader();

    reader.onload = () => {
      setVideo(
        reader.result
      );
    };

    reader.readAsDataURL(file);
  }

  return (
    <div className="tasks-page">

      {/* HEADER */}

      <div className="tasks-header">

        <div>
          <h1>Tasks</h1>

          <p>
            Manage tasks and issues for your projects.
          </p>
        </div>

        {/* NEW TASK BUTTON */}

        {canCreateTask && (
          <button
            onClick={() =>
              setShowForm(true)
            }
          >
            + New Task
          </button>
        )}

      </div>

      {/* PROJECT SELECTOR */}

      <div className="project-selector">

        <label>
          Select Project
        </label>

        <select
          value={selectedProject}
          onChange={(e) =>
            setSelectedProject(
              Number(e.target.value)
            )
          }
        >

          {projects.length === 0 ? (

            <option value="">
              No projects available
            </option>

          ) : (

            projects.map(
              (project) => (
                <option
                  key={project.id}
                  value={project.id}
                >
                  {project.name}
                </option>
              )
            )

          )}

        </select>

      </div>

      {/* CREATE TASK FORM */}

      {showForm && canCreateTask && (

        <form
          className="task-form"
          onSubmit={addTask}
        >

          <h2>
            Create New Task
          </h2>

          {/* TASK NAME */}

          <input
            type="text"
            placeholder="Task name"
            value={taskName}
            onChange={(e) =>
              setTaskName(
                e.target.value
              )
            }
          />

          {/* DESCRIPTION */}

          <textarea
            placeholder="Describe the task or issue..."
            value={description}
            onChange={(e) =>
              setDescription(
                e.target.value
              )
            }
          />

          {/* PRIORITY / DATE / TIME */}

          <div className="task-form-row">

            <select
              value={priority}
              onChange={(e) =>
                setPriority(
                  e.target.value
                )
              }
            >

              <option value="Low">
                Low Priority
              </option>

              <option value="Medium">
                Medium Priority
              </option>

              <option value="High">
                High Priority
              </option>

            </select>

            <input
              type="date"
              value={dueDate}
              onChange={(e) =>
                setDueDate(
                  e.target.value
                )
              }
            />

            <input
              type="time"
              value={dueTime}
              onChange={(e) =>
                setDueTime(
                  e.target.value
                )
              }
            />

          </div>

          {/* ASSIGN MEMBER */}

          <div className="form-group">

            <label>
              Assign Task To
            </label>

            <select
              value={assignedTo}
              onChange={(e) =>
                setAssignedTo(
                  e.target.value
                )
              }
            >

              <option value="">
                Select Team Member
              </option>

              {assignableMembers.map(
                (member) => (

                  <option
                    key={member.id}
                    value={member.id}
                  >
                    {member.name}
                    {" - "}
                    {member.role}

                    {isAdmin &&
                      member.teamName
                      ? ` (${member.teamName})`
                      : ""}
                  </option>

                )
              )}

            </select>

          </div>

          {/* IMAGE */}

          <div className="file-upload">

            <label>
              Upload Image
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={handleImage}
            />

            {image && (
              <img
                src={image}
                alt="Task preview"
                className="image-preview"
              />
            )}

          </div>

          {/* VIDEO */}

          <div className="file-upload">

            <label>
              Upload Video
            </label>

            <input
              type="file"
              accept="video/*"
              onChange={handleVideo}
            />

            {video && (
              <video
                src={video}
                controls
                className="video-preview"
              />
            )}

          </div>

          {/* FORM BUTTONS */}

          <div className="task-form-buttons">

            <button type="submit">
              Create Task
            </button>

            <button
              type="button"
              onClick={() =>
                setShowForm(false)
              }
            >
              Cancel
            </button>

          </div>

        </form>

      )}

      {/* TASK LIST */}

      <div className="task-list">

        {projects.length === 0 ? (

          <div className="empty-tasks">

            <h3>
              No projects yet
            </h3>

            <p>
              Create a project first before
              adding tasks.
            </p>

          </div>

        ) : projectTasks.length === 0 ? (

          <div className="empty-tasks">

            <h3>
              No tasks yet
            </h3>

            <p>
              There are no tasks assigned
              to you for this project.
            </p>

          </div>

        ) : (

          projectTasks.map(
            (task) => (

              <div
                className="task-card"
                key={task.id}
              >

                {/* TASK HEADER */}

                <div className="task-card-header">

                  <div>

                    <h3>
                      {task.name}
                    </h3>

                    <p>
                      {task.description}
                    </p>

                  </div>

                  {/* DELETE */}

                  {(isAdmin ||
                    isLeader) && (

                    <button
                      className="delete-task"
                      onClick={() =>
                        deleteTask(
                          task.id
                        )
                      }
                    >
                      Delete
                    </button>

                  )}

                </div>

                {/* TASK DETAILS */}

                <div className="task-details">

                  <span
                    className={`priority-${task.priority.toLowerCase()}`}
                  >
                    {task.priority}
                  </span>

                  <span>
                    Assigned To:{" "}
                    {task.assignedToName ||
                      "Not assigned"}
                  </span>

                  <span>
                    Due:{" "}
                    {task.dueDate ||
                      "No date"}
                  </span>

                  <span>
                    Time:{" "}
                    {formatTime(
                      task.dueTime
                    )}
                  </span>

                  {/* STATUS */}

                  <select
                    value={
                      task.status
                    }
                    onChange={(e) =>
                      updateStatus(
                        task.id,
                        e.target.value
                      )
                    }
                  >

                    <option value="Pending">
                      Pending
                    </option>

                    <option value="In Progress">
                      In Progress
                    </option>

                    <option value="Completed">
                      Completed
                    </option>

                  </select>

                </div>

                {/* IMAGE */}

                {task.image && (

                  <img
                    src={task.image}
                    alt={task.name}
                    className="task-image"
                  />

                )}

                {/* VIDEO */}

                {task.video && (

                  <video
                    src={task.video}
                    controls
                    className="task-video"
                  />

                )}

              </div>

            )
          )

        )}

      </div>

    </div>
  );
}

export default Tasks;