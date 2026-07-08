namespace SprintBoard.Models
{
    public class User
    {
        public int Id {get;set;}
        public string Name {get;set;} = string.Empty;
        public string Email {get;set;} = string.Empty;
        public DateTime CreatedAt {get;set;} =DateTime.UtcNow;
        public List<ProjectIssue> AssignedIssues {get;set;} =new();
        public List<Comment> Comments {get;set;} =new();
    }
}
