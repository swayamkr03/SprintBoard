function ProjectForm({ projectForm, onChange, onSubmit, isEditing, onCancel }) {
  return (
    <section className="panel">
      <h2>{isEditing ? "Edit Project" : "Create Project"}</h2>

      <form className="stacked-form" onSubmit={onSubmit}>
        <input
          type="text"
          name="name"
          value={projectForm.name}
          onChange={onChange}
          placeholder="Project name"
        />

        <input
          type="text"
          name="description"
          value={projectForm.description}
          onChange={onChange}
          placeholder="Project description"
        />

        <button type="submit">{isEditing ? "Update Project" : "Create Project"}</button>
        {isEditing && (
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
        )}
      </form>
    </section>
  );
}

export default ProjectForm;
