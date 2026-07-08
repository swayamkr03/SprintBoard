function UsersList({ users, onEdit, onDelete }) {
  return (
    <section className="panel">
      <h2>Users</h2>

      <div className="user-list">
        {users.map((user) => (
          <div className="user-row" key={user.id}>
            <strong>{user.name}</strong>
            <span>{user.email}</span>
            <div className="row-actions">
              <button onClick={() => onEdit(user)}>Edit</button>
              <button className="danger-button" onClick={() => onDelete(user)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default UsersList;
