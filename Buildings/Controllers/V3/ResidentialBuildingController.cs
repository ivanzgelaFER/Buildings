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
        [HttpGet("all")]
        [Authorize(Roles = "SuperAdmin")]
        public async Task<IActionResult> GetResidentialBuildings()
        {
            AppUser user = await context.Users.SingleOrDefaultAsync(u => u.Guid == Guid.Parse(User.FindFirstValue("guid")));
            return Ok(await residentialBuildingService.GetResidentialBuildings(user));
        }

        [HttpGet("{guid}")]
        [Authorize(Roles = "SuperAdmin")]
        public async Task<IActionResult> GetResidentialBuildingByGuid([FromRoute] Guid guid)
        {
            return Ok(await residentialBuildingService.GetResidentialBuildingByGuid(guid));
        }

        [HttpPost]
        [Authorize(Roles = "SuperAdmin")]
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
