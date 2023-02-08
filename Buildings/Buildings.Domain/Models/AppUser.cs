using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;
using Aconto.Domain.Enums;

namespace Buildings.Domain.Models
{
    public class AppUser : IdentityUser<long>
    {
        [Required]
        public Guid Guid { get; set; } = Guid.NewGuid();
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string PasswordRecoveryToken { get; set; }
        public UserEnabled IsEnabled { get; set; }
    }
}
