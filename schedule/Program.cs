using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using LoginSystem.Data;
using Microsoft.Extensions.Hosting;
using LoginSystem.Services;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// 添加服务到容器
builder.Services.AddControllers();

// 配置数据库上下文
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql("server=localhost;database=your_database;user=your_user;password=your_password",
        new MySqlServerVersion(new Version(8, 0, 21))));

// 注册EmailService
builder.Services.AddScoped<EmailService>();

// 添加服务
builder.Services.AddHttpContextAccessor();
builder.Services.AddLogging(logging =>
{
    logging.AddConsole();
    logging.AddDebug();
});

//  添加分布式内存缓存支持
builder.Services.AddDistributedMemoryCache();

// 添加Session服务
builder.Services.AddSession(options =>
{
    options.Cookie.HttpOnly = true;
    options.Cookie.SameSite = SameSiteMode.Strict;
    options.Cookie.IsEssential = true; // 即使没有同意 cookie，也可以使用
    options.IdleTimeout = TimeSpan.FromMinutes(30);
});

// 配置 CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", builder =>
    {
        builder.AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader();
    });
});

var app = builder.Build();

// 配置 HTTP 请求管道
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}

app.UseSession();
app.UseCors("AllowAll");
app.UseRouting();
app.UseAuthentication();  // 使用身份验证中间件
app.UseAuthorization();  // 使用授权中间件
app.MapControllers();

// 确保数据库创建和迁移
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    dbContext.Database.EnsureCreated();
}

app.Run();
