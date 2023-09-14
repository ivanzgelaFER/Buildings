using System.Security.Claims;
using AutoMapper;
using Buildings.Data;
using Buildings.Data.Helpers;
using Buildings.Data.Services;
using Buildings.Domain.DTOs;
using Buildings.Domain.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Buildings.Controllers.V3
{
    [Authorize]
    [ApiController]
    [Route("api/v{version:apiVersion}/[controller]")]
    public class ResidentialBuildingController : ControllerBase
    {
        private readonly AppUserManager userManager;
        private readonly IMapper mapper;
        private readonly BuildingsContext context;
        private readonly IResidentialBuildingService residentialBuildingService;

        public ResidentialBuildingController(AppUserManager userManager, BuildingsContext context, IMapper mapper, IResidentialBuildingService residentialBuildingService)
        {
            this.mapper = mapper;
            this.userManager = userManager;
            this.context = context;
            this.residentialBuildingService = residentialBuildingService;
        }
        [HttpGet]
        public async Task<IActionResult> GetResidentialBuilding()
        {
            return Empty;
        }

        [HttpPost]
        //[Authorize(Roles = "SuperAdmin")]
        public async Task<IActionResult> CreateResidentialBuilding([FromBody] NewResidentialBuildingDto dto)
        {
            AppUser user = await context.Users.SingleOrDefaultAsync(u => u.Guid == Guid.Parse(User.FindFirstValue("guid")));
            await residentialBuildingService.CreateResidentialBuilding(dto, user);
            return Ok();
        }
        /*
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
        */
    }
}
