using System.ComponentModel.DataAnnotations;

namespace SprintBoard.DTOs
{
    public class CreateProjectIssueDto
    {
        [Required]
        [StringLength(150)]
        public string Title { get; set; } = string.Empty;

        [StringLength(1000)]
        public string Description { get; set; } = string.Empty;

        [Required]
        [RegularExpression("Todo|InProgress|Review|Done")]
        public string Status { get; set; } = "Todo";

        [Required]
        [RegularExpression("Low|Medium|High|Critical")]
        public string Priority { get; set; } = "Medium";

        public int? AssigneeId { get; set; }
    }

    public class UpdateProjectIssueDto
    {
        [Required]
        [StringLength(150)]
        public string Title { get; set; } = string.Empty;

        [StringLength(1000)]
        public string Description { get; set; } = string.Empty;

        [Required]
        [RegularExpression("Todo|InProgress|Review|Done")]
        public string Status { get; set; } = "Todo";

        [Required]
        [RegularExpression("Low|Medium|High|Critical")]
        public string Priority { get; set; } = "Medium";

        public int? AssigneeId { get; set; }
    }
}
