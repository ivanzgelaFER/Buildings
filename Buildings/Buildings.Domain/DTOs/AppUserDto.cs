namespace Buildings.Domain.DTOs
{
    public class AppUserDto
    {
        public Guid Guid { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? UserName { get; set; }
        public string? Password { get; set; }
        public string[]? Roles { get; set; }
    }
}
