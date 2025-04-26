using Microsoft.EntityFrameworkCore;
using LoginSystem.Models;

namespace LoginSystem.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<VerificationCode> VerificationCodes { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // 用户表配置
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(u => u.UserId);
                entity.Property(u => u.UserId).ValueGeneratedOnAdd();
                entity.Property(u => u.Username).IsRequired().HasMaxLength(50);
                entity.Property(u => u.Password).IsRequired().HasMaxLength(100);
                entity.Property(u => u.Nickname).IsRequired().HasMaxLength(50);
                entity.Property(u => u.Email).HasMaxLength(100);
                entity.Property(u => u.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
            });

            // 验证码表配置
            modelBuilder.Entity<VerificationCode>(entity =>
            {
                entity.HasKey(v => v.CodeId);
                entity.Property(v => v.CodeId).ValueGeneratedOnAdd();
                entity.Property(v => v.Email).IsRequired().HasMaxLength(100);
                entity.Property(v => v.Code).IsRequired().HasMaxLength(10);
                entity.Property(v => v.ExpirationTime).IsRequired();
                entity.Property(v => v.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
                entity.HasIndex(v => v.Email); // 为Email添加索引
            });

   

        }
    }
}