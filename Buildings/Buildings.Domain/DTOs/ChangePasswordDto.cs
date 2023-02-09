namespace Buildings.Domain.Dtos
{
    public class ChangePasswordDto
    {
        public string Token { get; set; }
        public string Password { get; set; }
        public string NewPassword { get; set; }
    }
}
