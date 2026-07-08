function IssueForm({ issueForm, projects, users, onChange, onSubmit, isEditing, onCancel }) {
  return (
    <section className="panel form-wide">
      <h2>{isEditing ? "Edit Issue" : "Create Issue"}</h2>

      <form className="stacked-form issue-form" onSubmit={onSubmit}>
        <select
          name="projectId"
          value={issueForm.projectId}
          onChange={onChange}
        >
          <option value="">Select project</option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>

        <input
          type="text"
          name="title"
          value={issueForm.title}
          onChange={onChange}
          placeholder="Issue title"
        />

        <input
          type="text"
          name="description"
          value={issueForm.description}
          onChange={onChange}
          placeholder="Issue description"
        />

        <select name="status" value={issueForm.status} onChange={onChange}>
          <option value="Todo">Todo</option>
          <option value="InProgress">In Progress</option>
          <option value="Review">Review</option>
          <option value="Done">Done</option>
        </select>

        <select name="priority" value={issueForm.priority} onChange={onChange}>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
          <option value="Critical">Critical</option>
        </select>

        <select
          name="assigneeId"
          value={issueForm.assigneeId}
          onChange={onChange}
        >
          <option value="">Unassigned</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>

        <button type="submit">{isEditing ? "Update Issue" : "Create Issue"}</button>
        {isEditing && (
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
        )}
      </form>
    </section>
  );
}

export default IssueForm;
