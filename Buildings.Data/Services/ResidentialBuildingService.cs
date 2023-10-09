using AutoMapper;
using Buildings.Data.Helpers;
using Buildings.Domain.DTOs;
using Buildings.Domain.Exceptions;
using Buildings.Domain.Models;
using Microsoft.EntityFrameworkCore;

namespace Buildings.Data.Services
{
    public interface IResidentialBuildingService
    {
        Task<List<ResidentialBuildingDto>> GetResidentialBuildings(AppUser user);
        Task<ResidentialBuildingDto> GetResidentialBuildingByGuid(Guid guid);
        Task CreateResidentialBuilding(NewResidentialBuildingDto dto, AppUser user);
    }

    public class ResidentialBuildingService : IResidentialBuildingService
    {
        private readonly IMapper mapper;
        private readonly BuildingsContext context;
        private readonly AppUserManager userManager;
        public ResidentialBuildingService(IMapper mapper, BuildingsContext context, AppUserManager userManager)
        {
            this.mapper = mapper;
            this.context = context;
            this.userManager = userManager;
        }

        public async Task<List<ResidentialBuildingDto>> GetResidentialBuildings(AppUser user)
        {
            List<ResidentialBuilding> buildings = await context.ResidentialBuildings.Where(rb => rb.CreatedById == user.Id).ToListAsync();
            return mapper.Map<List<ResidentialBuildingDto>>(buildings);
        }
        public async Task<ResidentialBuildingDto> GetResidentialBuildingByGuid(Guid guid)
        {
            ResidentialBuilding building = await context.ResidentialBuildings.SingleOrDefaultAsync(rb => rb.Guid == guid);
            ResidentialBuildingDto dto = mapper.Map<ResidentialBuildingDto>(building);
            return dto;
        }
        public async Task CreateResidentialBuilding(NewResidentialBuildingDto dto, AppUser user)
        {
            ResidentialBuilding residentialBuilding = mapper.Map<ResidentialBuilding>(dto);
            residentialBuilding.CreatedById = user.Id;
            await context.ResidentialBuildings.AddAsync(residentialBuilding);

            AppUser newUser = new()
            {
                UserName = dto.UserName,
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                ResidentialBuilding = residentialBuilding
            };

            try
            {
                AppUser newAdmin = await userManager.CreateUserAsync(newUser, dto.AdminPassword, new List<string> { "Admin" });
            }
            catch
            {
                throw new AppException("User and company cannot be created");
            }
        }

    }
}