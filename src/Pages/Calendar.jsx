import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Calendar() {
  const navigate = useNavigate();

  const [selectedDate, setSelectedDate] = useState(new Date());

  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();

  const monthName = selectedDate.toLocaleString("default", {
    month: "long"
  });

  useEffect(() => {
    loadCalendarData();
  }, []);

  function loadCalendarData() {
    const savedProjects = localStorage.getItem("projects");
    const savedTasks = localStorage.getItem("tasks");

    setProjects(
      savedProjects ? JSON.parse(savedProjects) : []
    );

    setTasks(
      savedTasks ? JSON.parse(savedTasks) : []
    );
  }

  function changeMonth(value) {
    setSelectedDate(
      new Date(year, month + value, 1)
    );
  }

  function goToToday() {
    setSelectedDate(new Date());
  }

  function getDateKey(year, month, day) {
    const monthNumber = String(month + 1).padStart(2, "0");
    const dayNumber = String(day).padStart(2, "0");

    return `${year}-${monthNumber}-${dayNumber}`;
  }

  function getProjectsForDate(dateKey) {
    return projects.filter(
      (project) =>
        project.startDate === dateKey ||
        project.dueDate === dateKey
    );
  }

  function getTasksForDate(dateKey) {
    return tasks.filter(
      (task) => task.dueDate === dateKey
    );
  }

  function getStatusClass(status) {
    if (status === "Completed") {
      return "completed";
    }

    if (status === "In Progress") {
      return "in-progress";
    }

    return "pending";
  }

  function formatTime(time) {
    if (!time) return "";

    const [hours, minutes] = time.split(":");

    const hour = Number(hours);

    const formattedHour = hour % 12 || 12;

    const period = hour >= 12 ? "PM" : "AM";

    return `${formattedHour}:${minutes} ${period}`;
  }

  return (
    <div className="calendar-page">

      {/* Header */}

      <div className="calendar-header">

        <div>
          <h1>Calendar</h1>

          <p>
            Manage your projects, tasks and schedule.
          </p>
        </div>

        <div className="calendar-buttons">

          <button
            type="button"
            onClick={() => changeMonth(-1)}
          >
            ←
          </button>

          <button
            type="button"
            onClick={goToToday}
          >
            Today
          </button>

          <button
            type="button"
            onClick={() => changeMonth(1)}
          >
            →
          </button>

        </div>

      </div>


      {/* Calendar */}

      <div className="calendar-box">

        <div className="calendar-title">
          <h2>
            {monthName} {year}
          </h2>
        </div>


        <div className="calendar-grid">

          {/* Days */}

          {days.map((day) => (
            <div
              className="calendar-day-name"
              key={day}
            >
              {day}
            </div>
          ))}


          {/* Empty Days */}

          {Array.from({
            length: firstDay
          }).map((_, index) => (
            <div
              className="calendar-empty"
              key={`empty-${index}`}
            ></div>
          ))}


          {/* Dates */}

          {Array.from(
            { length: totalDays },
            (_, index) => {

              const day = index + 1;

              const dateKey = getDateKey(
                year,
                month,
                day
              );

              const today = new Date();

              const isToday =
                day === today.getDate() &&
                month === today.getMonth() &&
                year === today.getFullYear();

              const dateProjects =
                getProjectsForDate(dateKey);

              const dateTasks =
                getTasksForDate(dateKey);

              return (
                <div
                  className={`calendar-date ${
                    isToday ? "today" : ""
                  }`}
                  key={day}
                >

                  <span className="date-number">
                    {day}
                  </span>


                  {/* Projects */}

                  <div className="calendar-events">

                    {dateProjects.map(
                      (project) => (
                        <button
                          type="button"
                          className={`calendar-event project-event ${getStatusClass(
                            project.status
                          )}`}
                          key={project.id}
                          onClick={() =>
                            navigate("/projects", {
                              state: {
                                projectId: project.id
                              }
                            })
                          }
                        >
                          {project.name}
                        </button>
                      )
                    )}


                    {/* Tasks */}

                    {dateTasks.map((task) => (
                      <button
                        type="button"
                        className={`calendar-event task-event ${getStatusClass(
                          task.status
                        )}`}
                        key={task.id}
                        onClick={() =>
                          navigate("/tasks")
                        }
                      >
                        {task.name}

                        {task.dueTime && (
                          <small>
                            {formatTime(
                              task.dueTime
                            )}
                          </small>
                        )}
                      </button>
                    ))}

                  </div>

                </div>
              );
            }
          )}

        </div>

      </div>

    </div>
  );
}

export default Calendar;