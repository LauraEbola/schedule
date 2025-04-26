using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using LoginSystem.Data;
using LoginSystem.Models;
using LoginSystem.Services;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Http;

namespace LoginSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly EmailService _emailService;

        public AuthController(AppDbContext context, EmailService emailService)
        {
            _context = context;
            _emailService = emailService;
        }

        // POST: api/Auth/Login
        [HttpPost("Login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == request.Username);

            if (user == null)
            {
                return BadRequest(new { message = "账号不存在！" });
            }

            if (user.Password != request.Password)
            {
                return BadRequest(new { message = "密码错误！" });
            }

            HttpContext.Session.SetInt32("UserId", user.UserId); 
            return Ok(new
            {
                message = "登录成功！",
                user = new
                {
                    user.Username,
                    user.Nickname,
                    user.Email,
                    user.IsAdmin
                }
            });
        }

        // POST: api/Auth/Register
        [HttpPost("Register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            if (await _context.Users.AnyAsync(u => u.Username == request.Username))
            {
                return BadRequest(new { message = "该用户名已存在！" });
            }

            var user = new User
            {
                Username = request.Username,
                Password = request.Password,
                Nickname = request.Nickname,
                Email = request.Email,
                IsAdmin = false
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = "注册成功，请使用您的账号登录！" });
        }

        // POST: api/Auth/Guest
        [HttpPost("Guest")]
        public IActionResult GuestAccess()
        {
            return Ok(new { message = "以游客身份访问" });
        }

        // 发送验证码
        [HttpPost("SendVerificationCode")]
        public async Task<IActionResult> SendVerificationCode([FromBody] EmailRequest request)
        {
            // 检查邮箱是否已注册
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
            if (user == null)
            {
                return BadRequest(new { message = "该邮箱未注册" });
            }

            // 生成随机6位验证码
            var random = new Random();
            var code = random.Next(100000, 999999).ToString();

            // 设置过期时间(5分钟后)
            var expirationTime = DateTime.UtcNow.AddMinutes(5);

            // 保存验证码到数据库
            _context.VerificationCodes.Add(new VerificationCode
            {
                Email = request.Email,
                Code = code,
                ExpirationTime = expirationTime
            });

            await _context.SaveChangesAsync();

            // 发送邮件
            try
            {
                await _emailService.SendVerificationCode(request.Email, code);
                return Ok(new { message = "验证码已发送" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "发送验证码失败", error = ex.Message });
            }
        }

        // 邮箱验证码登录
        [HttpPost("LoginWithEmail")]
        public async Task<IActionResult> LoginWithEmail([FromBody] EmailLoginRequest request)
        {
            // 查找有效的验证码
            var validCode = await _context.VerificationCodes
                .FirstOrDefaultAsync(v =>
                    v.Email == request.Email &&
                    v.Code == request.Code &&
                    v.ExpirationTime > DateTime.UtcNow &&
                    !v.IsUsed);

            if (validCode == null)
            {
                return BadRequest(new { message = "验证码无效或已过期" });
            }

            // 标记验证码为已使用
            validCode.IsUsed = true;
            _context.VerificationCodes.Update(validCode);

            // 查找用户
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
            if (user == null)
            {
                return BadRequest(new { message = "用户不存在" });
            }

            await _context.SaveChangesAsync();

            HttpContext.Session.SetInt32("UserId", user.UserId); 


            return Ok(new
            {
                message = "登录成功",
                user = new
                {
                    user.Username,
                    user.Nickname,
                    user.IsAdmin
                }
            });

        }

        

        public class LoginRequest
        {
            public string Username { get; set; }
            public string Password { get; set; }
        }

        public class RegisterRequest
        {
            public string Username { get; set; }
            public string Password { get; set; }
            public string Nickname { get; set; }
            public string? Email { get; set; }
        }

        public class EmailRequest
        {
            public string Email { get; set; }
        }

        public class EmailLoginRequest
        {
            public string Email { get; set; }
            public string Code { get; set; }
        }

    }
}