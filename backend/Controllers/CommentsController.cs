using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SprintBoard.Data;
using SprintBoard.DTOs;
using SprintBoard.Models;

namespace SprintBoard.Controllers
{
    [ApiController]
    [Route("api")]
    public class CommentsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CommentsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("issues/{issueId}/comments")]
        public async Task<ActionResult<List<Comment>>> GetCommentsForIssue(int issueId)
        {
            var comments = await _context.Comments
                .Where(comment => comment.ProjectIssueId == issueId)
                .Include(comment => comment.User)
                .ToListAsync();

            return Ok(comments);
        }

        [HttpPost("issues/{issueId}/comments")]
        public async Task<ActionResult<Comment>> CreateComment(int issueId, CreateCommentDto createCommentDto)
        {
            var issueExists = await _context.ProjectIssues
                .AnyAsync(issue => issue.Id == issueId);

            if (!issueExists)
            {
                return NotFound("Issue not found");
            }

            var userExists = await _context.Users
                .AnyAsync(user => user.Id == createCommentDto.UserId);

            if (!userExists)
            {
                return NotFound("User not found");
            }

            var comment = new Comment
            {
                Body = createCommentDto.Body,
                UserId = createCommentDto.UserId,
                ProjectIssueId = issueId,
                CreatedAt = DateTime.UtcNow
            };

            _context.Comments.Add(comment);
            await _context.SaveChangesAsync();

            return CreatedAtAction(
                nameof(GetCommentsForIssue),
                new { issueId = comment.ProjectIssueId },
                comment
            );
        }

        [HttpDelete("comments/{id}")]
        public async Task<ActionResult> DeleteComment(int id)
        {
            var comment = await _context.Comments.FindAsync(id);

            if (comment == null)
            {
                return NotFound();
            }

            _context.Comments.Remove(comment);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
