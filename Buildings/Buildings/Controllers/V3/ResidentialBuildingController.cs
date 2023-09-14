using AutoMapper;
using Buildings.Data;
using Buildings.Data.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Buildings.Controllers.V3
{
    [Authorize]
    [ApiController]
    [Route("api/v{version:apiVersion}/[controller]")]
    public class ResidentialBuildingController : ControllerBase    
    {
        private readonly AppUserManager userManager;
        private readonly IMapper mapper;

        public ResidentialBuildingController(AppUserManager userManager, BuildingsContext context, IMapper mapper)
        {
            this.mapper = mapper;
            this.userManager = userManager;
        }

        [HttpGet]
        public async Task<IActionResult> GetResidentialBuilding()
        {
            return null;
        }

        [HttpPost]
        public async Task<IActionResult> CreateResidentialBuildine()
        {
            return Ok();
        }
        [HttpPatch]
        public async Task<IActionResult> EditResidentialBuilding()
        {
            return Ok();
        }

        [HttpDelete]
        public async Task<IActionResult> DeleteResidentialBuilding()
        {
            return Ok();
        }


    }
}
