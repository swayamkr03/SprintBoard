using Microsoft.EntityFrameworkCore;
using SprintBoard.Models;

namespace SprintBoard.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {

        }

        public DbSet<User> Users {get;set;}
        public DbSet<Project> Projects {get;set;}
        public DbSet<ProjectIssue> ProjectIssues {get;set;}
        public DbSet<Comment> Comments {get;set;}

    }
}