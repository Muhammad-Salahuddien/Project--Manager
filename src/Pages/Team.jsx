import { useEffect, useState } from "react";

const defaultTeams = [
  {
    id: 1,
    name: "Frontend Development",
    leader: null,
    members: []
  },
  {
    id: 2,
    name: "Backend Development",
    leader: null,
    members: []
  },
  {
    id: 3,
    name: "Design",
    leader: null,
    members: []
  }
];

function Team() {
  const [teams, setTeams] = useState(() => {
    const savedTeams = localStorage.getItem("teams");

    return savedTeams
      ? JSON.parse(savedTeams)
      : defaultTeams;
  });

  const [showForm, setShowForm] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [memberType, setMemberType] = useState("member");

  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    localStorage.setItem("teams", JSON.stringify(teams));
  }, [teams]);

  function openAddForm(teamId, type) {
    setSelectedTeam(teamId);
    setMemberType(type);

    setName("");
    setRole("");
    setEmail("");
    setPassword("");

    setShowForm(true);
  }

  function addPerson(e) {
    e.preventDefault();

    if (
      !name.trim() ||
      !email.trim() ||
      !password.trim()
    ) {
      alert("Please fill in all fields.");
      return;
    }

    const users = JSON.parse(
      localStorage.getItem("users") || "[]"
    );

    const emailExists = users.some(
      (user) =>
        user.email.toLowerCase() === email.toLowerCase()
    );

    if (emailExists) {
      alert("This email is already registered.");
      return;
    }

    const selectedTeamData = teams.find(
      (team) => team.id === selectedTeam
    );

    if (!selectedTeamData) {
      return;
    }

    const newPerson = {
      id: Date.now(),
      name: name.trim(),
      role:
        memberType === "leader"
          ? "Team Leader"
          : role.trim() || "Team Member",
      email: email.trim(),
      teamId: selectedTeam,
      teamName: selectedTeamData.name
    };

    const newUser = {
      ...newPerson,
      password,
      userRole: memberType
    };

    localStorage.setItem(
      "users",
      JSON.stringify([...users, newUser])
    );

    setTeams(
      teams.map((team) => {
        if (team.id !== selectedTeam) {
          return team;
        }

        if (memberType === "leader") {
          return {
            ...team,
            leader: newPerson
          };
        }

        return {
          ...team,
          members: [...team.members, newPerson]
        };
      })
    );

    setName("");
    setRole("");
    setEmail("");
    setPassword("");
    setShowForm(false);
    setSelectedTeam(null);
  }

  function removeUserAccount(userId) {
    const users = JSON.parse(
      localStorage.getItem("users") || "[]"
    );

    const updatedUsers = users.filter(
      (user) => user.id !== userId
    );

    localStorage.setItem(
      "users",
      JSON.stringify(updatedUsers)
    );
  }

  function deleteLeader(teamId) {
    const confirmDelete = window.confirm(
      "Are you sure you want to remove this team leader?"
    );

    if (!confirmDelete) return;

    const team = teams.find(
      (team) => team.id === teamId
    );

    if (team?.leader) {
      removeUserAccount(team.leader.id);
    }

    setTeams(
      teams.map((team) =>
        team.id === teamId
          ? { ...team, leader: null }
          : team
      )
    );
  }

  function deleteMember(teamId, memberId) {
    const confirmDelete = window.confirm(
      "Are you sure you want to remove this team member?"
    );

    if (!confirmDelete) return;

    removeUserAccount(memberId);

    setTeams(
      teams.map((team) =>
        team.id === teamId
          ? {
              ...team,
              members: team.members.filter(
                (member) => member.id !== memberId
              )
            }
          : team
      )
    );
  }

  return (
    <div className="team-page">
      <div className="team-header">
        <div>
          <h1>Our Teams</h1>

          <p>
            Manage your development and design teams.
          </p>
        </div>
      </div>

      <div className="teams-grid">
        {teams.map((team) => (
          <div className="team-card" key={team.id}>
            <div className="team-card-header">
              <div>
                <h2>{team.name}</h2>

                <span>
                  {team.members.length +
                    (team.leader ? 1 : 0)}{" "}
                  Members
                </span>
              </div>
            </div>

            <div className="leader-section">
              <div className="section-title">
                <h3>Team Leader</h3>
              </div>

              {team.leader ? (
                <div className="leader-card">
                  <div className="member-avatar leader-avatar">
                    {team.leader.name
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  <div className="member-info">
                    <h4>{team.leader.name}</h4>

                    <span className="leader-badge">
                      Team Leader
                    </span>

                    <p>{team.leader.email}</p>
                  </div>

                  <button
                    className="remove-button"
                    onClick={() =>
                      deleteLeader(team.id)
                    }
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="no-leader">
                  <p>No team leader assigned.</p>

                  <button
                    onClick={() =>
                      openAddForm(team.id, "leader")
                    }
                  >
                    + Add Team Leader
                  </button>
                </div>
              )}
            </div>

            <div className="members-section">
              <div className="section-title">
                <h3>Team Members</h3>

                <button
                  className="add-member-button"
                  onClick={() =>
                    openAddForm(team.id, "member")
                  }
                >
                  + Add Member
                </button>
              </div>

              {team.members.length === 0 ? (
                <div className="no-members">
                  <p>No members added yet.</p>
                </div>
              ) : (
                <div className="members-list">
                  {team.members.map((member) => (
                    <div
                      className="member-card"
                      key={member.id}
                    >
                      <div className="member-avatar">
                        {member.name
                          .charAt(0)
                          .toUpperCase()}
                      </div>

                      <div className="member-info">
                        <h4>{member.name}</h4>

                        <span>{member.role}</span>

                        <p>{member.email}</p>
                      </div>

                      <button
                        className="remove-button"
                        onClick={() =>
                          deleteMember(
                            team.id,
                            member.id
                          )
                        }
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="team-form-overlay">
          <form
            className="team-form"
            onSubmit={addPerson}
          >
            <div className="team-form-header">
              <div>
                <h2>
                  {memberType === "leader"
                    ? "Add Team Leader"
                    : "Add Team Member"}
                </h2>

                <p>
                  {memberType === "leader"
                    ? "Create a login account for the team leader."
                    : "Create a login account for the team member."}
                </p>
              </div>

              <button
                type="button"
                className="close-form"
                onClick={() => setShowForm(false)}
              >
                ×
              </button>
            </div>

            <div className="form-group">
              <label>Full Name</label>

              <input
                type="text"
                placeholder="Enter full name"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
              />
            </div>

            {memberType === "member" && (
              <div className="form-group">
                <label>Role</label>

                <input
                  type="text"
                  placeholder="e.g. React Developer"
                  value={role}
                  onChange={(e) =>
                    setRole(e.target.value)
                  }
                />
              </div>
            )}

            <div className="form-group">
              <label>Email Address</label>

              <input
                type="email"
                placeholder="example@email.com"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
              />
            </div>

            <div className="form-group">
              <label>Password</label>

              <input
                type="password"
                placeholder="Create login password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
              />
            </div>

            <div className="team-form-buttons">
              <button
                type="submit"
                className="save-member"
              >
                {memberType === "leader"
                  ? "Add Team Leader"
                  : "Add Member"}
              </button>

              <button
                type="button"
                className="cancel-member"
                onClick={() =>
                  setShowForm(false)
                }
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default Team;