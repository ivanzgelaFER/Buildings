using Buildings.Domain.Enums;
using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Buildings.Domain.Models
{
    public class AppUser : IdentityUser<long>
    {
        [Required]
        public Guid Guid { get; set; } = Guid.NewGuid();
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string? PasswordRecoveryToken { get; set; }
        public UserEnabled IsEnabled { get; set; }
        public ResidentialBuilding ResidentialBuilding { get; set; }
        [ForeignKey("ResidentialBuilding")]
        public long ResidentialBuildingId { get; set; }
    }
}
