using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Buildings.Domain.Models
{
    public class ResidentialBuilding
    {
        [Key]
        public long Id { get; set; }
        [Required]
        public Guid Guid { get; set; } = Guid.NewGuid();
        public string Name { get; set; }
        public string Address { get; set; }
        
        public List<AppUser> Users { get; set; } = new List<AppUser>();

    }
}
