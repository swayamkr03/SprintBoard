function Dashboard({ summary }) {
  return (
    <section className="panel">
      <h2>Dashboard</h2>

      {summary && (
        <div className="dashboard-grid">
          <div className="metric-card">
            <span>Total Projects</span>
            <strong>{summary.totalProjects}</strong>
          </div>
          <div className="metric-card">
            <span>Total Issues</span>
            <strong>{summary.totalIssues}</strong>
          </div>
          <div className="metric-card">
            <span>Todo</span>
            <strong>{summary.todoIssues}</strong>
          </div>
          <div className="metric-card">
            <span>In Progress</span>
            <strong>{summary.inProgressIssues}</strong>
          </div>
          <div className="metric-card">
            <span>Review</span>
            <strong>{summary.reviewIssues}</strong>
          </div>
          <div className="metric-card">
            <span>Done</span>
            <strong>{summary.doneIssues}</strong>
          </div>
          <div className="metric-card">
            <span>High Priority</span>
            <strong>{summary.highPriorityIssues}</strong>
          </div>
          <div className="metric-card">
            <span>Users</span>
            <strong>{summary.totalUsers}</strong>
          </div>
          <div className="metric-card">
            <span>Comments</span>
            <strong>{summary.totalComments}</strong>
          </div>
        </div>
      )}
    </section>
  );
}

export default Dashboard;
