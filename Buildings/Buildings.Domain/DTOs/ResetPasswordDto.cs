namespace Buildings.Domain.Dtos
{
    public class ResetPasswordDto
    {
        public string Token { get; set; }
        public string Password { get; set; }
    }
}