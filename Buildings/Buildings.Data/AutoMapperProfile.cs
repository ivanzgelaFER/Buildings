using AutoMapper;
using Buildings.Data.Migrations;
using Buildings.Domain.DTOs;

namespace Buildings.Data
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<NewResidentialBuildingDto, ResidentialBuilding>();
        }
    }
}
