using AutoMapper;
using Buildings.Domain.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace Buildings.Data.Helpers
{
    public class AppUserManager : UserManager<AppUser>
    {
        private readonly BuildingsContext ctx;
        private readonly IMapper mapper;
        public AppUserManager(IUserStore<AppUser> store, IMapper mapper, IOptions<IdentityOptions> optionsAccessor, IPasswordHasher<AppUser> passwordHasher, IEnumerable<IUserValidator<AppUser>> userValidators, IEnumerable<IPasswordValidator<AppUser>> passwordValidators, ILookupNormalizer keyNormalizer, IdentityErrorDescriber errors, IServiceProvider services, ILogger<UserManager<AppUser>> logger) : base(store, optionsAccessor, passwordHasher, userValidators, passwordValidators, keyNormalizer, errors, services, logger)
        {
            ctx = services.GetService<BuildingsContext>();
            this.mapper = mapper;
        }

        public async Task<AppUser> GetUserByGuidAsync(Guid guid)
        {
            return await Users.SingleOrDefaultAsync(u => u.Guid == guid);
        }

        public async Task<AppUser> GetByPasswordRecoveryToken(string token)
        {
            return await Users.SingleOrDefaultAsync(u => u.PasswordRecoveryToken == AddMissingBase64Padding(token));
        }

        private static string AddMissingBase64Padding(string token)
        {
            return token.EndsWith("=") ? token : token.PadRight(token.Length + (4 - token.Length % 4) % 4, '=');
        }

        private static void test(string token)
        {
            AppUser user = new AppUser();
            string number = user.FirstName;
        }
    }
}
