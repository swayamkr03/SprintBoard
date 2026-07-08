using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SprintBoard.Data;
using SprintBoard.DTOs;
using SprintBoard.Models;

namespace SprintBoard.Controllers
{
    [ApiController]
    [Route("api")]
    public class ProjectIssuesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ProjectIssuesController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("projects/{projectId}/issues")]
        public async Task<ActionResult<List<ProjectIssue>>> GetIssuesForProject(int projectId)
        {
            var issues = await _context.ProjectIssues
                .Where(issue => issue.ProjectId == projectId)
                .Include(issue => issue.Assignee)
                .ToListAsync();

            return Ok(issues);
        }

        [HttpGet("issues/{id}")]
        public async Task<ActionResult<ProjectIssue>> GetIssueById(int id)
        {
            var issue = await _context.ProjectIssues
                .Include(issue => issue.Assignee)
                .Include(issue => issue.Comments)
                .FirstOrDefaultAsync(issue => issue.Id == id);

            if (issue == null)
            {
                return NotFound();
            }

            return Ok(issue);
        }

        [HttpPost("projects/{projectId}/issues")]
        public async Task<ActionResult<ProjectIssue>> CreateIssue(int projectId, CreateProjectIssueDto createIssueDto)
        {
            var projectExists = await _context.Projects.AnyAsync(project => project.Id == projectId);

            if (!projectExists)
            {
                return NotFound("Project not found");
            }

            if (createIssueDto.AssigneeId.HasValue)
            {
                var assigneeExists = await _context.Users.AnyAsync(user => user.Id == createIssueDto.AssigneeId.Value);

                if (!assigneeExists)
                {
                    return NotFound("Assignee not found");
                }
            }

            var issue = new ProjectIssue
            {
                Title = createIssueDto.Title,
                Description = createIssueDto.Description,
                Status = createIssueDto.Status,
                Priority = createIssueDto.Priority,
                AssigneeId = createIssueDto.AssigneeId,
                ProjectId = projectId,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = null
            };

            _context.ProjectIssues.Add(issue);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetIssueById), new { id = issue.Id }, issue);
        }

        [HttpPut("issues/{id}")]
        public async Task<ActionResult<ProjectIssue>> UpdateIssue(int id, UpdateProjectIssueDto updatedIssue)
        {
            var issue = await _context.ProjectIssues.FindAsync(id);

            if (issue == null)
            {
                return NotFound();
            }

            if (updatedIssue.AssigneeId.HasValue)
            {
                var assigneeExists = await _context.Users.AnyAsync(user => user.Id == updatedIssue.AssigneeId.Value);

                if (!assigneeExists)
                {
                    return NotFound("Assignee not found");
                }
            }

            issue.Title = updatedIssue.Title;
            issue.Description = updatedIssue.Description;
            issue.Status = updatedIssue.Status;
            issue.Priority = updatedIssue.Priority;
            issue.AssigneeId = updatedIssue.AssigneeId;
            issue.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return Ok(issue);
        }

        [HttpDelete("issues/{id}")]
        public async Task<ActionResult> DeleteIssue(int id)
        {
            var issue = await _context.ProjectIssues.FindAsync(id);

            if (issue == null)
            {
                return NotFound();
            }

            _context.ProjectIssues.Remove(issue);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
