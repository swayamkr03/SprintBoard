using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SprintBoard.Data;

namespace SprintBoard.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DashboardController : ControllerBase
    {
        private readonly AppDbContext _context;

        public DashboardController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("summary")]
        public async Task<ActionResult> GetSummary()
        {
            var totalProjects = await _context.Projects.CountAsync();

            var totalIssues = await _context.ProjectIssues.CountAsync();

            var todoIssues = await _context.ProjectIssues
                .CountAsync(issue => issue.Status == "Todo");

            var inProgressIssues = await _context.ProjectIssues
                .CountAsync(issue => issue.Status == "InProgress");

            var reviewIssues = await _context.ProjectIssues
                .CountAsync(issue => issue.Status == "Review");

            var doneIssues = await _context.ProjectIssues
                .CountAsync(issue => issue.Status == "Done");

            var highPriorityIssues = await _context.ProjectIssues
                .CountAsync(issue => issue.Priority == "High" || issue.Priority == "Critical");

            var totalUsers = await _context.Users.CountAsync();

            var totalComments = await _context.Comments.CountAsync();

            var summary = new
            {
                TotalProjects = totalProjects,
                TotalIssues = totalIssues,
                TodoIssues = todoIssues,
                InProgressIssues = inProgressIssues,
                ReviewIssues = reviewIssues,
                DoneIssues = doneIssues,
                HighPriorityIssues = highPriorityIssues,
                TotalUsers = totalUsers,
                TotalComments = totalComments
            };

            return Ok(summary);
        }
    }
}