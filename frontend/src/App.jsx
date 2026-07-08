import { useEffect, useState } from "react";
import Dashboard from "./components/Dashboard";
import ProjectForm from "./components/ProjectForm";
import UserForm from "./components/UserForm";
import IssueForm from "./components/IssueForm";
import UsersList from "./components/UsersList";
import ProjectsIssuesList from "./components/ProjectsIssuesList";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5063";

const emptyProjectForm = {
  name: "",
  description: ""
};

const emptyUserForm = {
  name: "",
  email: ""
};

const emptyIssueForm = {
  projectId: "",
  title: "",
  description: "",
  status: "Todo",
  priority: "Medium",
  assigneeId: ""
};

function App() {
  const [summary, setSummary] = useState(null);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [issuesByProject, setIssuesByProject] = useState({});
  const [commentsByIssue, setCommentsByIssue] = useState({});
  const [commentForms, setCommentForms] = useState({});

  const [projectForm, setProjectForm] = useState(emptyProjectForm);
  const [editingProjectId, setEditingProjectId] = useState(null);

  const [userForm, setUserForm] = useState(emptyUserForm);
  const [editingUserId, setEditingUserId] = useState(null);

  const [issueForm, setIssueForm] = useState(emptyIssueForm);
  const [editingIssueId, setEditingIssueId] = useState(null);
  const [editingIssueProjectId, setEditingIssueProjectId] = useState(null);

  const [filters, setFilters] = useState({
    search: "",
    status: "All",
    priority: "All",
    assigneeId: "All",
    projectId: "All"
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadInitialData();
  }, []);

  async function loadInitialData() {
    await loadSummary();
    const loadedProjects = await loadProjects();
    await loadUsers();

    if (loadedProjects.length > 0) {
      await loadAllIssues(loadedProjects);
    }
  }

  async function loadSummary() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/dashboard/summary`);

      if (!response.ok) {
        throw new Error("Failed to load dashboard summary");
      }

      const data = await response.json();
      setSummary(data);
    } catch (err) {
      setError(err.message);
    }
  }

  async function loadProjects() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_BASE_URL}/api/projects`);

      if (!response.ok) {
        throw new Error("Failed to load projects");
      }

      const data = await response.json();
      setProjects(data);
      return data;
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  }

  async function loadUsers() {
    try {
      setError("");

      const response = await fetch(`${API_BASE_URL}/api/users`);

      if (!response.ok) {
        throw new Error("Failed to load users");
      }

      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    }
  }

  async function loadIssuesForProject(projectId) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/projects/${projectId}/issues`
      );

      if (!response.ok) {
        throw new Error("Failed to load issues");
      }

      const data = await response.json();

      setIssuesByProject((current) => ({
        ...current,
        [projectId]: data
      }));

      for (const issue of data) {
        await loadCommentsForIssue(issue.id);
      }

      return data;
    } catch (err) {
      setError(err.message);
      return [];
    }
  }

  async function loadAllIssues(projectsToLoad = projects) {
    for (const project of projectsToLoad) {
      await loadIssuesForProject(project.id);
    }
  }

  async function loadCommentsForIssue(issueId) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/issues/${issueId}/comments`
      );

      if (!response.ok) {
        throw new Error("Failed to load comments");
      }

      const data = await response.json();

      setCommentsByIssue((current) => ({
        ...current,
        [issueId]: data
      }));

      return data;
    } catch (err) {
      setError(err.message);
      return [];
    }
  }

  function handleProjectChange(e) {
    setProjectForm({
      ...projectForm,
      [e.target.name]: e.target.value
    });
  }

  function handleUserChange(e) {
    setUserForm({
      ...userForm,
      [e.target.name]: e.target.value
    });
  }

  function handleIssueChange(e) {
    setIssueForm({
      ...issueForm,
      [e.target.name]: e.target.value
    });
  }

  function handleCommentChange(issueId, e) {
    const currentForm = commentForms[issueId] || {
      body: "",
      userId: ""
    };

    setCommentForms({
      ...commentForms,
      [issueId]: {
        ...currentForm,
        [e.target.name]: e.target.value
      }
    });
  }

  function handleFilterChange(e) {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  }

  async function handleProjectSubmit(e) {
    e.preventDefault();

    try {
      setError("");

      const isEditing = editingProjectId !== null;
      const response = await fetch(
        isEditing
          ? `${API_BASE_URL}/api/projects/${editingProjectId}`
          : `${API_BASE_URL}/api/projects`,
        {
          method: isEditing ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(projectForm)
        }
      );

      if (!response.ok) {
        throw new Error(
          isEditing ? "Failed to update project" : "Failed to create project"
        );
      }

      setProjectForm(emptyProjectForm);
      setEditingProjectId(null);

      const loadedProjects = await loadProjects();
      await loadAllIssues(loadedProjects);
      await loadSummary();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleUserSubmit(e) {
    e.preventDefault();

    try {
      setError("");

      const isEditing = editingUserId !== null;
      const response = await fetch(
        isEditing
          ? `${API_BASE_URL}/api/users/${editingUserId}`
          : `${API_BASE_URL}/api/users`,
        {
          method: isEditing ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(userForm)
        }
      );

      if (!response.ok) {
        throw new Error(
          isEditing ? "Failed to update user" : "Failed to create user"
        );
      }

      setUserForm(emptyUserForm);
      setEditingUserId(null);

      await loadUsers();
      await loadAllIssues(projects);
      await loadSummary();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleIssueSubmit(e) {
    e.preventDefault();

    if (!issueForm.projectId && editingIssueId === null) {
      setError("Please select a project");
      return;
    }

    try {
      setError("");

      const issueToSave = {
        title: issueForm.title,
        description: issueForm.description,
        status: issueForm.status,
        priority: issueForm.priority,
        assigneeId: issueForm.assigneeId ? Number(issueForm.assigneeId) : null
      };

      const isEditing = editingIssueId !== null;
      const response = await fetch(
        isEditing
          ? `${API_BASE_URL}/api/issues/${editingIssueId}`
          : `${API_BASE_URL}/api/projects/${issueForm.projectId}/issues`,
        {
          method: isEditing ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(issueToSave)
        }
      );

      if (!response.ok) {
        throw new Error(
          isEditing ? "Failed to update issue" : "Failed to create issue"
        );
      }

      const projectId = isEditing ? editingIssueProjectId : issueForm.projectId;

      setIssueForm(emptyIssueForm);
      setEditingIssueId(null);
      setEditingIssueProjectId(null);

      await loadIssuesForProject(projectId);
      await loadSummary();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleCommentSubmit(issueId, e) {
    e.preventDefault();

    const form = commentForms[issueId];

    if (!form?.body || !form?.userId) {
      setError("Please select a user and enter a comment");
      return;
    }

    try {
      setError("");

      const response = await fetch(
        `${API_BASE_URL}/api/issues/${issueId}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            body: form.body,
            userId: Number(form.userId)
          })
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create comment");
      }

      setCommentForms({
        ...commentForms,
        [issueId]: {
          body: "",
          userId: ""
        }
      });

      await loadCommentsForIssue(issueId);
      await loadSummary();
    } catch (err) {
      setError(err.message);
    }
  }

  async function updateIssue(issue, updates) {
    try {
      setError("");

      const updatedIssue = {
        title: issue.title,
        description: issue.description,
        status: updates.status ?? issue.status,
        priority: updates.priority ?? issue.priority,
        assigneeId:
          updates.assigneeId !== undefined ? updates.assigneeId : issue.assigneeId
      };

      const response = await fetch(`${API_BASE_URL}/api/issues/${issue.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(updatedIssue)
      });

      if (!response.ok) {
        throw new Error("Failed to update issue");
      }

      await loadIssuesForProject(issue.projectId);
      await loadSummary();
    } catch (err) {
      setError(err.message);
    }
  }

  async function deleteProject(project) {
    try {
      setError("");

      const response = await fetch(`${API_BASE_URL}/api/projects/${project.id}`, {
        method: "DELETE"
      });

      if (!response.ok) {
        throw new Error("Failed to delete project");
      }

      const loadedProjects = await loadProjects();
      await loadAllIssues(loadedProjects);
      await loadSummary();
    } catch (err) {
      setError(err.message);
    }
  }

  async function deleteUser(user) {
    try {
      setError("");

      const response = await fetch(`${API_BASE_URL}/api/users/${user.id}`, {
        method: "DELETE"
      });

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      await loadUsers();
      await loadAllIssues(projects);
      await loadSummary();
    } catch (err) {
      setError(err.message);
    }
  }

  async function deleteIssue(issue) {
    try {
      setError("");

      const response = await fetch(`${API_BASE_URL}/api/issues/${issue.id}`, {
        method: "DELETE"
      });

      if (!response.ok) {
        throw new Error("Failed to delete issue");
      }

      setCommentsByIssue((current) => {
        const updated = { ...current };
        delete updated[issue.id];
        return updated;
      });

      await loadIssuesForProject(issue.projectId);
      await loadSummary();
    } catch (err) {
      setError(err.message);
    }
  }

  async function deleteComment(comment) {
    try {
      setError("");

      const response = await fetch(`${API_BASE_URL}/api/comments/${comment.id}`, {
        method: "DELETE"
      });

      if (!response.ok) {
        throw new Error("Failed to delete comment");
      }

      await loadCommentsForIssue(comment.projectIssueId);
      await loadSummary();
    } catch (err) {
      setError(err.message);
    }
  }

  function editProject(project) {
    setProjectForm({
      name: project.name,
      description: project.description
    });
    setEditingProjectId(project.id);
  }

  function cancelProjectEdit() {
    setProjectForm(emptyProjectForm);
    setEditingProjectId(null);
  }

  function editUser(user) {
    setUserForm({
      name: user.name,
      email: user.email
    });
    setEditingUserId(user.id);
  }

  function cancelUserEdit() {
    setUserForm(emptyUserForm);
    setEditingUserId(null);
  }

  function editIssue(issue) {
    setIssueForm({
      projectId: String(issue.projectId),
      title: issue.title,
      description: issue.description,
      status: issue.status,
      priority: issue.priority,
      assigneeId: issue.assigneeId ? String(issue.assigneeId) : ""
    });
    setEditingIssueId(issue.id);
    setEditingIssueProjectId(issue.projectId);
  }

  function cancelIssueEdit() {
    setIssueForm(emptyIssueForm);
    setEditingIssueId(null);
    setEditingIssueProjectId(null);
  }

  function getUserName(userId) {
    const user = users.find((user) => user.id === userId);
    return user ? user.name : "Unassigned";
  }

  function getVisibleIssues(project) {
    const issues = issuesByProject[project.id] || [];
    const query = filters.search.trim().toLowerCase();

    return issues.filter((issue) => {
      const matchesSearch =
        !query ||
        issue.title.toLowerCase().includes(query) ||
        issue.description.toLowerCase().includes(query);
      const matchesStatus =
        filters.status === "All" || issue.status === filters.status;
      const matchesPriority =
        filters.priority === "All" || issue.priority === filters.priority;
      const matchesAssignee =
        filters.assigneeId === "All" ||
        (filters.assigneeId === "Unassigned" && !issue.assigneeId) ||
        String(issue.assigneeId) === filters.assigneeId;
      const matchesProject =
        filters.projectId === "All" || String(project.id) === filters.projectId;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPriority &&
        matchesAssignee &&
        matchesProject
      );
    });
  }

  const totalLoadedIssues = Object.values(issuesByProject).reduce(
    (count, issues) => count + issues.length,
    0
  );

  return (
    <div className="blueprint-shell">
      <header className="topbar">
        <div className="brand-lockup">
          <span className="brand-mark">SB</span>
          <span className="brand-name">SPRINTBOARD_CORE</span>
        </div>

        <nav className="topnav" aria-label="Primary navigation">
          <a href="#dashboard">Dashboard</a>
          <a href="#projects">Issues</a>
          <a href="#team">Team</a>
        </nav>

        <div className="topbar-actions">
          <span className="session-pill">API: {API_BASE_URL.replace(/^https?:\/\//, "")}</span>
          <span className="avatar-chip">S</span>
        </div>
      </header>

      <aside className="sidebar">
        <div className="sidebar-card">
          <span className="terminal-icon">▣</span>
          <div>
            <strong>PROJECT_MGMT</strong>
            <small>v2.0-live</small>
          </div>
        </div>

        <nav className="side-nav" aria-label="Workspace navigation">
          <a href="#dashboard" className="active">◈ Metrics</a>
          <a href="#create">▦ Create</a>
          <a href="#team">◎ Team</a>
          <a href="#projects">☷ Log Tracker</a>
        </nav>

        <div className="sidebar-footer">
          <span>LOADED_ISSUES</span>
          <strong>{totalLoadedIssues}</strong>
        </div>
      </aside>

      <main className="workspace">
        <header className="workspace-header">
          <div>
            <p className="eyebrow">Issue Tracker</p>
            <h1>SprintBoard</h1>
            <p className="header-copy">
              Track projects, assign issues, and keep delivery status visible.
            </p>
          </div>
          <div className="header-actions">
            <button type="button" onClick={loadInitialData}>Refresh Data</button>
            <a className="primary-link" href="#create">+ New Initiative</a>
          </div>
        </header>

        {error && <p className="error-banner">{error}</p>}

        <div id="dashboard">
          <Dashboard summary={summary} />
        </div>

        <div className="content-grid" id="create">
          <ProjectForm
            projectForm={projectForm}
            onChange={handleProjectChange}
            onSubmit={handleProjectSubmit}
            isEditing={editingProjectId !== null}
            onCancel={cancelProjectEdit}
          />

          <UserForm
            userForm={userForm}
            onChange={handleUserChange}
            onSubmit={handleUserSubmit}
            isEditing={editingUserId !== null}
            onCancel={cancelUserEdit}
          />

          <IssueForm
            issueForm={issueForm}
            projects={projects}
            users={users}
            onChange={handleIssueChange}
            onSubmit={handleIssueSubmit}
            isEditing={editingIssueId !== null}
            onCancel={cancelIssueEdit}
          />
        </div>

        <div id="team">
          <UsersList users={users} onEdit={editUser} onDelete={deleteUser} />
        </div>

        <div id="projects">
          <ProjectsIssuesList
            projects={projects}
            commentsByIssue={commentsByIssue}
            commentForms={commentForms}
            users={users}
            filters={filters}
            loading={loading}
            getUserName={getUserName}
            getVisibleIssues={getVisibleIssues}
            onFilterChange={handleFilterChange}
            onEditProject={editProject}
            onDeleteProject={deleteProject}
            onEditIssue={editIssue}
            onUpdateIssue={updateIssue}
            onDeleteIssue={deleteIssue}
            onCommentChange={handleCommentChange}
            onCommentSubmit={handleCommentSubmit}
            onDeleteComment={deleteComment}
          />
        </div>
      </main>
    </div>
  );
}

export default App;
