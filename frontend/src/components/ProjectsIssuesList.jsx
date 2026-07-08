function ProjectsIssuesList({
  projects,
  commentsByIssue,
  commentForms,
  users,
  filters,
  loading,
  getUserName,
  getVisibleIssues,
  onFilterChange,
  onEditProject,
  onDeleteProject,
  onEditIssue,
  onUpdateIssue,
  onDeleteIssue,
  onCommentChange,
  onCommentSubmit,
  onDeleteComment
}) {
  return (
    <section className="panel">
      <h2>Projects & Issues</h2>

      <div className="filters-grid">
        <input
          type="search"
          name="search"
          value={filters.search}
          onChange={onFilterChange}
          placeholder="Search issue title or description"
        />

        <select name="projectId" value={filters.projectId} onChange={onFilterChange}>
          <option value="All">All projects</option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>

        <select name="status" value={filters.status} onChange={onFilterChange}>
          <option value="All">All statuses</option>
          <option value="Todo">Todo</option>
          <option value="InProgress">In Progress</option>
          <option value="Review">Review</option>
          <option value="Done">Done</option>
        </select>

        <select name="priority" value={filters.priority} onChange={onFilterChange}>
          <option value="All">All priorities</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
          <option value="Critical">Critical</option>
        </select>

        <select name="assigneeId" value={filters.assigneeId} onChange={onFilterChange}>
          <option value="All">All assignees</option>
          <option value="Unassigned">Unassigned</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>
      </div>

      {loading && <p>Loading projects...</p>}

      {projects.map((project) => (
        <article className="project-card" key={project.id}>
          <div className="project-header">
            <div>
              <h3>{project.name}</h3>
              <p>{project.description}</p>
            </div>
            <small>{new Date(project.createdAt).toLocaleDateString()}</small>
          </div>
          <div className="button-row">
            <button onClick={() => onEditProject(project)}>Edit Project</button>
            <button className="danger-button" onClick={() => onDeleteProject(project)}>
              Delete Project
            </button>
          </div>

          <h4>Issues</h4>

          {getVisibleIssues(project).length === 0 && (
            <p className="empty-state">No issues yet.</p>
          )}

          {getVisibleIssues(project).map((issue) => (
            <div className="issue-card" key={issue.id}>
              <div className="issue-heading">
                <strong>{issue.title}</strong>
                <span className={`badge priority-${issue.priority.toLowerCase()}`}>
                  {issue.priority}
                </span>
              </div>
              <p>{issue.description}</p>
              <div className="issue-meta">
                <span className={`badge status-${issue.status.toLowerCase()}`}>
                  {issue.status}
                </span>
                <span>Assignee: {getUserName(issue.assigneeId)}</span>
              </div>

              <div className="button-row">
                <button onClick={() => onEditIssue(issue)}>Edit Issue</button>

                <button onClick={() => onUpdateIssue(issue, { status: "Todo" })}>
                  Todo
                </button>

                <button
                  onClick={() =>
                    onUpdateIssue(issue, { status: "InProgress" })
                  }
                >
                  In Progress
                </button>

                <button
                  onClick={() => onUpdateIssue(issue, { status: "Review" })}
                >
                  Review
                </button>

                <button onClick={() => onUpdateIssue(issue, { status: "Done" })}>
                  Done
                </button>

                <button onClick={() => onUpdateIssue(issue, { priority: "Low" })}>
                  Low
                </button>

                <button
                  onClick={() => onUpdateIssue(issue, { priority: "Medium" })}
                >
                  Medium
                </button>

                <button onClick={() => onUpdateIssue(issue, { priority: "High" })}>
                  High
                </button>

                <button
                  onClick={() => onUpdateIssue(issue, { priority: "Critical" })}
                >
                  Critical
                </button>

                <button className="danger-button" onClick={() => onDeleteIssue(issue)}>Delete</button>
              </div>

              <div className="comments-panel">
                <h5>Comments</h5>

                {(commentsByIssue[issue.id] || []).length === 0 && (
                  <p className="empty-state">No comments yet.</p>
                )}

                {(commentsByIssue[issue.id] || []).map((comment) => (
                  <div className="comment-row" key={comment.id}>
                    <div>
                      <strong>{comment.user?.name || getUserName(comment.userId)}</strong>
                      <p>{comment.body}</p>
                      <small>{new Date(comment.createdAt).toLocaleString()}</small>
                    </div>
                    <button
                      className="danger-button"
                      onClick={() => onDeleteComment(comment)}
                    >
                      Delete
                    </button>
                  </div>
                ))}

                <form
                  className="comment-form"
                  onSubmit={(e) => onCommentSubmit(issue.id, e)}
                >
                  <select
                    name="userId"
                    value={(commentForms[issue.id] || {}).userId || ""}
                    onChange={(e) => onCommentChange(issue.id, e)}
                  >
                    <option value="">Select user</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name}
                      </option>
                    ))}
                  </select>

                  <input
                    type="text"
                    name="body"
                    value={(commentForms[issue.id] || {}).body || ""}
                    onChange={(e) => onCommentChange(issue.id, e)}
                    placeholder="Add a comment"
                  />

                  <button type="submit">Add Comment</button>
                </form>
              </div>
            </div>
          ))}
        </article>
      ))}
    </section>
  );
}

export default ProjectsIssuesList;
