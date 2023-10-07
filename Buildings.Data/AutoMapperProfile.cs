using AutoMapper;
using Buildings.Domain.DTOs;
using Buildings.Domain.Models;

namespace Buildings.Data
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<NewResidentialBuildingDto, ResidentialBuilding>().ForMember(dest => dest.Id, opt => opt.Ignore());
            CreateMap<ResidentialBuilding, ResidentialBuildingDto>();
        }
    }
}
