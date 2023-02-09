using Buildings.Data;
using Buildings.Data.Helpers;
using Buildings.Domain.Models;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Serilog;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using SignInResult = Microsoft.AspNetCore.Identity.SignInResult;
using Buildings.Domain.DTOs;
using Buildings.Domain.Dtos;
using Buildings.Domain.Enums;

namespace Buildings.Controllers.V3
{
    [Authorize]
    [ApiController]
    [Route("api/v{version:apiVersion}/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly IMapper mapper;
        private readonly AppUserManager userManager;
        private readonly BuildingsContext context;
        private readonly SignInManager<AppUser> signInManager;
        private readonly IConfiguration config;
        private readonly LockoutSettings lockoutSettings;
        private readonly string lockoutMessage;

        public UsersController(AppUserManager userManager, BuildingsContext context, SignInManager<AppUser> signInManager, IMapper mapper, IConfiguration config)
        {
            this.userManager = userManager;
            this.context = context;
            this.signInManager = signInManager;
            this.mapper = mapper;
            this.config = config;
            lockoutSettings = ConfigurationBinder.Get<LockoutSettings>(config.GetSection("Lockout"));
            lockoutMessage = $"Your account has been locked for {lockoutSettings.Duration} {lockoutSettings.UnitString} due to several incorrect login attempts.";
        }

        [AllowAnonymous]
        [HttpPost("authenticate")]
        public async Task<IActionResult> AuthenticateUser([FromBody] AppUserDto userDto)
        {
            AppUser user = await userManager.FindByNameAsync(userDto.UserName);
            if (user == null) return NotFound("Username or password is incorrect");
            if (user.IsEnabled != UserEnabled.IsEnabled) return NotFound("Your account has been disabled. If unsure why, contact your company admin");

            SignInResult passwordCheck = await signInManager.CheckPasswordSignInAsync(user, userDto.Password, lockoutSettings.Enabled);

            if (passwordCheck.IsLockedOut) return NotFound(lockoutMessage);
            if (!passwordCheck.Succeeded) return NotFound("Username or password is incorrect");

            IList<string> roles = await userManager.GetRolesAsync(user);
            IEnumerable<Claim> claims = roles
                .Select(role => new Claim(ClaimTypes.Role, role))
                .Append(new Claim("guid", user.Guid.ToString()));

            JwtSecurityTokenHandler tokenHandler = new();
            byte[] key = Encoding.ASCII.GetBytes(config["Secret"]);
            SecurityTokenDescriptor tokenDescriptor = new()
            {
                Subject = new ClaimsIdentity(claims.ToArray()),
                Expires = DateTime.UtcNow.AddHours(12),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            SecurityToken token = tokenHandler.CreateToken(tokenDescriptor);
            string tokenString = tokenHandler.WriteToken(token);
            Log.Information("User logged in: {0}", user.UserName);
            return Ok(new
            {
                user.Guid,
                user.UserName,
                user.FirstName,
                user.LastName,
                roles,
                Token = tokenString,
                user.PasswordRecoveryToken,
            });
        }

        private async Task<string> CheckPasswordError(string pass)
        {
            if (string.IsNullOrWhiteSpace(pass)) return "Password field is mandatory.";
            foreach (IPasswordValidator<AppUser> validator in userManager.PasswordValidators)
            {
                IdentityResult result = await validator.ValidateAsync(userManager, null, pass);

                if (!result.Succeeded)
                {
                    return result.Errors.FirstOrDefault()?.Description;
                }
            }

            return null;
        }

        [AllowAnonymous]
        [HttpPost("forgotPassword")]
        public async Task<IActionResult> ForgotPassword()
        {
            string host = HttpContext.Request.Host.ToUriComponent();
            using StreamReader reader = new(Request.Body, Encoding.UTF8);
            string username = await reader.ReadToEndAsync();
            AppUser user = await userManager.FindByNameAsync(username);
            if (user == null) return NotFound("Username not found");

            user.PasswordRecoveryToken = await userManager.GeneratePasswordResetTokenAsync(user);
            await userManager.UpdateAsync(user);

            //await mailService.SendForgotPasswordEmailAsync(user, host);
            return Ok();
        }

        [AllowAnonymous]
        [HttpGet("resetPassword")]
        public async Task<IActionResult> CheckPasswordResetToken([FromQuery] string token)
        {
            AppUser user = await userManager.GetByPasswordRecoveryToken(token);
            if (user == null) return NotFound("Invalid token");
            return Ok();
        }

        [HttpGet("changePasswordToken")]
        public async Task<IActionResult> GetPasswordChangeToken()
        {
            AppUser user = await userManager.GetUserByGuidAsync(Guid.Parse(User.FindFirstValue("guid")));
            string token = await userManager.GeneratePasswordResetTokenAsync(user);
            return Ok(token);
        }

        [HttpPost("changePassword")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto changePasswordDto)
        {
            AppUser user = await userManager.GetUserByGuidAsync(Guid.Parse(User.FindFirstValue("guid")));
            if (user == null) return NotFound("Invalid token");
            SignInResult passwordCheck = await signInManager.CheckPasswordSignInAsync(user, changePasswordDto.Password, lockoutSettings.Enabled);

            if (passwordCheck.IsLockedOut) return NotFound(lockoutMessage);
            if (!passwordCheck.Succeeded) return Ok(false);

            IdentityResult result = await userManager.ResetPasswordAsync(user, changePasswordDto.Token, changePasswordDto.NewPassword);
            if (!result.Succeeded) return BadRequest(result.Errors);

            return Ok(true);
        }

        [AllowAnonymous]
        [HttpPost("resetPassword")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto resetPasswordDto)
        {
            AppUser user = await userManager.GetByPasswordRecoveryToken(resetPasswordDto.Token);
            if (user == null) return NotFound("Invalid token");
            if (await userManager.IsLockedOutAsync(user)) return BadRequest(lockoutMessage);

            string passError = await CheckPasswordError(resetPasswordDto.Password);
            if (!string.IsNullOrEmpty(passError))
            {
                return BadRequest(passError);
            }

            user.PasswordRecoveryToken = null;
            await userManager.UpdateAsync(user);

            await userManager.ResetPasswordAsync(user, resetPasswordDto.Token, resetPasswordDto.Password);

            string host = HttpContext.Request.Host.ToUriComponent();
            //await mailService.SendPasswordChangedEmailAsync(user, host);

            return Ok();
        }

        /*
        [HttpPost]
        [Authorize(Roles = "Admin, SuperAdmin")]
        public async Task<IActionResult> CreateUser([FromBody] CreateAppUserDto userDto)
        {
            AppUser appUser = await userManager.GetUserByGuidAsync(Guid.Parse(User.FindFirstValue("guid")));
            AppUser user = mapper.Map<AppUser>(userDto);
            user.CompanyId = appUser.CompanyId;
            user.JobTitle = await context.JobTitles.SingleOrDefaultAsync(jt => jt.Guid == userDto.JobTitleGuid);
            user.Department = await context.Departments.SingleOrDefaultAsync(jt => jt.Guid == userDto.DepartmentGuid);
            AppUser newUser = await userManager.CreateUserAsync(user, userDto.Password, userDto.Roles);
            await mailService.SendUserCreatedEmailAsync(user, userDto.Password, HttpContext.Request.Host.ToUriComponent());
            return Created("", mapper.Map<AppUserDto>(newUser));
        }

        [HttpGet]
        [Authorize(Roles = "Admin, SuperAdmin")]
        public async Task<IActionResult> GetUsers([FromQuery] PrimeQueryDto query)
        {
            AppUser appUser = await userManager.GetUserByGuidAsync(Guid.Parse(User.FindFirstValue("guid")));
            bool isSuperAdmin = await userManager.IsInRoleAsync(appUser, "SuperAdmin");
            (List<AppUser>, int) result = await userManager.GetUsersAsync(query, appUser, isSuperAdmin);
            List<AppUserDto> users = new();
            foreach (AppUser user in result.Item1)
            {
                AppUserDto userDto = mapper.Map<AppUserDto>(user);
                userDto.Roles = (await userManager.GetRolesAsync(user)).ToArray();
                if (isSuperAdmin)
                    userDto.Company = user.Company.Name;
                users.Add(userDto);
            }
            return Ok(new PaginationWrapperDto<AppUserDto>() { Items = users, Total = result.Item2 });
        }

        [HttpGet("companyUsers")]
        public async Task<IActionResult> GetUsersByCompanyGuid([FromQuery] Guid guid, [FromQuery] PrimeQueryDto query)
        {
            (List<AppUser>, int) result;
            if (guid == Guid.Empty)
            {
                AppUser appUser = await userManager.GetUserWithCompanyByGuidAsync(Guid.Parse(User.FindFirstValue("guid")));
                result = await userManager.GetUsersByCompanyGuidAsync(query, appUser.Company.Guid);
            }
            else
            {
                result = await userManager.GetUsersByCompanyGuidAsync(query, guid);
            }

            List<AppUserDto> usersDto = mapper.Map<List<AppUserDto>>(result.Item1);
            int count = 0;
            foreach (AppUser user in result.Item1)
            {
                usersDto[count].Roles = (await userManager.GetRolesAsync(user)).ToArray();
                count++;
            }
            return Ok(new PaginationWrapperDto<AppUserDto>() { Items = usersDto, Total = result.Item2 });
        }

        [HttpGet("props")]
        public async Task<IActionResult> GetStaffAsProps()
        {
            AppUser user = await userManager.GetUserByGuidAsync(Guid.Parse(User.FindFirstValue("guid")));
            return Ok(await userManager.GetCompanyStaffAsPropsAsync(user, userManager));
        }

        [HttpGet("{guid}")]
        public async Task<IActionResult> GetUserByGuid([FromRoute] Guid guid)
        {
            AppUser user = await userManager.Users
                .Include(c => c.Company)
                .Include(j => j.JobTitle)
                .Include(d => d.Department)
                .Include(u => u.Languages)
                .ThenInclude(al => al.Language)
                .Include(u => u.UserAccessRights)
                .ThenInclude(u => u.AccessRight)
                .Include(u => u.Mentor)
                .SingleOrDefaultAsync(u => u.Guid == guid);

            if (user == null)
            {
                return NotFound();
            }
            AppUserDetailsDto userDto = mapper.Map<AppUserDetailsDto>(user);
            userDto.IsEnabled = UpdateHelper.ConvertIsEnabledEnumToBool(user.IsEnabled);
            userDto.Roles = await userManager.GetRolesAsync(user);
            userDto.CompanyName = user.Company.Name;
            userDto.CompanyGuid = user.Company.Guid;
            userDto.Projects = await context.Assignments.Where(x => x.UserId == user.Id).Select(x => x.Project.Name).ToListAsync();
            userDto.Projects = userDto.Projects.Distinct().ToList();
            List<string> accessRights = user.UserAccessRights.Where(ua => !ua.AccessRight.IsArchived).Select(ua => ua.AccessRight.Claim).ToList();
            userDto.AccessRights = string.Join(", ", accessRights);

            return Ok(userDto);
        }

        [HttpPatch("{guid}")]
        public async Task<IActionResult> EditUser([FromRoute] Guid guid, [FromBody] AppUserDetailsDto userDto)
        {
            if (guid != userDto.Guid) return BadRequest("GUIDs do not match.");
            if (userDto.Roles == null) return BadRequest("Roles field missing");

            AppUser user = await userManager.GetUserByGuidAsync(Guid.Parse(User.FindFirstValue("guid")));
            await userManager.EditUserAsync(userDto, user);
            return Ok();
        }

        [HttpDelete("{guid}")]
        [Authorize(Roles = "SuperAdmin")]
        public async Task<IActionResult> DeleteUser([FromRoute] Guid guid)
        {
            AppUser appUser = await userManager.GetUserByGuidAsync(Guid.Parse(User.FindFirstValue("guid")));
            AppUser user = await userManager.GetUserByGuidAsync(guid);
            if (appUser.Guid == guid) return BadRequest();
            if (user == null) return NotFound();

            await userManager.DeleteAsync(user);
            return Ok();
        }


        [HttpGet("vacationsDetails/{guid}")]
        public async Task<IActionResult> GetVacationsDetails([FromRoute] Guid guid)
        {
            AppUser appUser = await userManager.GetUserByGuidAsync(Guid.Parse(User.FindFirstValue("guid")));
            AppUser user = await userManager.Users
                .Include(u => u.VacationsDetails)
                .SingleOrDefaultAsync(u => u.Guid == guid);
            List<VacationsDetail> vacationsDetails = await userManager.GetVacationsDetails(user, appUser);
            return Ok(new { Details = mapper.Map<List<VacationsDetailDto>>(vacationsDetails), DaysLeft = user.GetVacationDaysLeft() });
        }

        [HttpPatch("vacationsDetails/{guid}")]
        public async Task<IActionResult> UpdateVacationsDetails([FromRoute] Guid guid, [FromBody] List<VacationsDetailDto> vacationsDetailDtos)
        {
            AppUser appUser = await userManager.GetUserByGuidAsync(Guid.Parse(User.FindFirstValue("guid")));
            AppUser user = await userManager.Users
                .Include(u => u.VacationsDetails)
                .SingleOrDefaultAsync(u => u.Guid == guid);
            await userManager.EditVacationsDetails(vacationsDetailDtos, user, appUser);
            return Ok();
        }

        [HttpPatch("updateLocale/{locale}")]
        public async Task<IActionResult> UpdateUserLocale([FromRoute] int locale)
        {
            AppUser appUser = await userManager.GetUserByGuidAsync(Guid.Parse(User.FindFirstValue("guid")));
            await userManager.UpdateUserLocale(appUser, (Locale)locale);
            return Ok();
        }*/
    }
}