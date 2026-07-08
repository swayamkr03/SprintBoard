function UserForm({ userForm, onChange, onSubmit, isEditing, onCancel }) {
  return (
    <section className="panel">
      <h2>{isEditing ? "Edit User" : "Create User"}</h2>

      <form className="stacked-form" onSubmit={onSubmit}>
        <input
          type="text"
          name="name"
          value={userForm.name}
          onChange={onChange}
          placeholder="User name"
        />

        <input
          type="email"
          name="email"
          value={userForm.email}
          onChange={onChange}
          placeholder="User email"
        />

        <button type="submit">{isEditing ? "Update User" : "Create User"}</button>
        {isEditing && (
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
        )}
      </form>
    </section>
  );
}

export default UserForm;
