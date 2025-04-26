namespace LoginSystem.Models
{
    public class VerificationCode
    {
        public int CodeId { get; set; }
        public string Email { get; set; }
        public string Code { get; set; }
        public DateTime ExpirationTime { get; set; }
        public bool IsUsed { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}