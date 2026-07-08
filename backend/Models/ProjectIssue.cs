namespace SprintBoard.Models
{
    public class ProjectIssue{
        public int Id {get;set;}
        public string Title {get;set;}=string.Empty;
        public string Description {get;set;}=string.Empty;
        public string Status {get;set;} = "Todo";
        public string Priority {get;set;} = "Medium";
        public int ProjectId {get;set;}
        public Project? Project {get;set;}
        public int? AssigneeId {get;set;}
        public User? Assignee {get;set;}
        public DateTime CreatedAt {get;set;}=DateTime.UtcNow;
        public DateTime? UpdatedAt {get;set;}
        public List<Comment> Comments {get;set;}=new(); 
    }
}
