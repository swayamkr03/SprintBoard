using System.ComponentModel.DataAnnotations;

namespace SprintBoard.DTOs
{
    public class CreateCommentDto
    {
        [Required]
        [StringLength(1000)]
        public string Body { get; set; } = string.Empty;

        [Required]
        public int UserId { get; set; }
    }
}
