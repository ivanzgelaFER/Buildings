using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace Buildings.Domain.Models
{
    public class Fingerprint
    {
        public DateTime Created { get; set; } = DateTime.UtcNow;
        [Required]
        public AppUser CreatedBy { get; set; }
        [ForeignKey("CreatedBy")]
        public long CreatedById { get; set; }
    }
}