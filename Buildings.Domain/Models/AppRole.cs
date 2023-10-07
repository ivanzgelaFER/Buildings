using Microsoft.AspNetCore.Identity;

namespace Buildings.Domain.Models
{
    public class AppRole : IdentityRole<long>
    {
        public AppRole() : base() { }
        public AppRole(string roleName) : base(roleName) { }
    }
}

