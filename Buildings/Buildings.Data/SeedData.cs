using Buildings.Data.Helpers;
using Buildings.Domain.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Serilog;

namespace Buildings.Data
{
    public static class SeedData
    {
        public static async Task InitializeAsync(BuildingsContext ctx, AppUserManager userManager, RoleManager<AppRole> roleManager, IConfiguration config)
        {

            try
            {
                await ctx.Database.MigrateAsync();
            }
            catch (Exception ex)
            {
                Log.Error(ex.Message);
            }

            string adminPassword = config.GetSection("SeedPasswordAdmin").Value;
            string superAdminPassword = config.GetSection("SeedPasswordSuperAdmin").Value;
            if (!await ctx.Roles.AnyAsync()) await SeedRolesAsync(roleManager);
            if (!await ctx.Users.AnyAsync()) await SeedUsersAsync(userManager, adminPassword, superAdminPassword, ctx);
        }

        private static async Task SeedRolesAsync(RoleManager<AppRole> roleManager)
        {
            await roleManager.CreateAsync(new AppRole("SuperAdmin"));
            await roleManager.CreateAsync(new AppRole("Admin"));
            await roleManager.CreateAsync(new AppRole("Tenant"));
        }

        private static async Task SeedUsersAsync(UserManager<AppUser> userManager, string adminPassword, string superAdminPassword, BuildingsContext context)
        {
            AppUser superAdmin = new()
            {
                UserName = "super_admin@aconto.app",
                Email = "super_admin@aconto.app",
                FirstName = "AcontoSuper",
                LastName = "AdminSuper",
            };
            await userManager.CreateAsync(superAdmin, superAdminPassword);
            await userManager.AddToRoleAsync(superAdmin, "SuperAdmin");

            superAdmin.PasswordRecoveryToken = await userManager.GeneratePasswordResetTokenAsync(superAdmin);
            await userManager.UpdateAsync(superAdmin);
        }
    }
}
