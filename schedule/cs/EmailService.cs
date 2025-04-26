using MailKit.Net.Smtp;
using MimeKit;
using Microsoft.Extensions.Logging;

namespace LoginSystem.Services
{
    public class EmailService
    {
        private readonly ILogger<EmailService> _logger;

        // 直接在构造函数中初始化配置

        private readonly SmtpConfig _config = new SmtpConfig
        {
            Host = "smtp.example.com",         // 邮箱SMTP服务器
            Port = 587,                   // 邮箱端口
            Username = "your_email@example.com",   // 邮箱
            Password = "your_email_password",       // 邮箱授权码(不是密码)
            FromEmail = "noreply@yourdomain.com",  // 发件人邮箱
            FromName = "Your Application Name",   // 发件人名称
            EnableSsl = true              // 启用SSL
        };


        public EmailService(ILogger<EmailService> logger)
        {
            _logger = logger;
        }

        public async Task SendVerificationCode(string email, string code)
        {
            try
            {
                var message = new MimeMessage();
                message.From.Add(new MailboxAddress(_config.FromName, _config.FromEmail));
                message.To.Add(MailboxAddress.Parse(email));
                message.Subject = "您的验证码";
                message.Body = new TextPart("plain")
                {
                    Text = $"您的验证码是: {code}，有效期为5分钟。"
                };

                using var client = new SmtpClient();

                _logger.LogInformation($"尝试连接到SMTP服务器: {_config.Host}:{_config.Port}");

                await client.ConnectAsync(
                    _config.Host,
                    _config.Port,
                    MailKit.Security.SecureSocketOptions.StartTls);

                _logger.LogInformation("SMTP连接成功，尝试认证...");
                await client.AuthenticateAsync(_config.Username, _config.Password);
                _logger.LogInformation("SMTP认证成功，发送邮件...");

                await client.SendAsync(message);
                await client.DisconnectAsync(true);

                _logger.LogInformation($"邮件已成功发送至: {email}");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "邮件发送失败");
                throw new ApplicationException($"邮件发送失败: {ex.Message}", ex);
            }
        }

        // SMTP配置类
        private class SmtpConfig
        {
            public string Host { get; set; }
            public int Port { get; set; }
            public string Username { get; set; }
            public string Password { get; set; }
            public string FromEmail { get; set; }
            public string FromName { get; set; }
            public bool EnableSsl { get; set; }
        }
    }
}