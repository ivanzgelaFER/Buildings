using AutoMapper;
using Buildings.Domain.Exceptions;
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

        public async Task<string> CheckPasswordError(string pass)
        {
            if (string.IsNullOrWhiteSpace(pass)) return "Password field is mandatory.";
            foreach (IPasswordValidator<AppUser> validator in PasswordValidators)
            {
                IdentityResult result = await validator.ValidateAsync(this, null, pass);
                if (!result.Succeeded) return result.Errors.FirstOrDefault()?.Description;
            }
            return null;
        }

        public async Task<AppUser> CreateUserAsync(AppUser newUser, string password, IEnumerable<string> roles)
        {
            string passError = await CheckPasswordError(password);
            if (!string.IsNullOrEmpty(passError)) throw new AppException(passError);
            IdentityResult result = await CreateAsync(newUser, password);
            if (result.Succeeded)
            {
                if (roles != null && roles.Any()) await AddToRolesAsync(newUser, roles);
                newUser.PasswordRecoveryToken = await GeneratePasswordResetTokenAsync(newUser);
                await UpdateAsync(newUser);
                return newUser;
            }
            else
            {
                if (result.Errors.Any(error => error.Code.Contains("DuplicateUserName"))) throw new AppException("Duplicate username");
                throw new AppException("Unable to create new user");
            }
        }
    }
}
