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
            string tenantPassword = config.GetSection("SeedPasswordTenant").Value;

            if (!await ctx.Roles.AnyAsync()) await SeedRolesAsync(roleManager);
            if (!await ctx.Users.AnyAsync()) await SeedUsersAsync(userManager, adminPassword, superAdminPassword, tenantPassword, ctx);
        }

        private static async Task SeedRolesAsync(RoleManager<AppRole> roleManager)
        {
            await roleManager.CreateAsync(new AppRole("SuperAdmin"));
            await roleManager.CreateAsync(new AppRole("Admin"));
            await roleManager.CreateAsync(new AppRole("Tenant"));
        }

        private static async Task SeedUsersAsync(UserManager<AppUser> userManager, string adminPassword, string superAdminPassword, string tenantPassword, BuildingsContext context)
        {
            //SUPERADMIN
            AppUser superAdmin = new()
            {
                UserName = "superAdmin@buildings.app",
                Email = "superAdmin@buildings.app",
                FirstName = "Super",
                LastName = "Admin",
            };
            await userManager.CreateAsync(superAdmin, superAdminPassword);
            await userManager.AddToRoleAsync(superAdmin, "SuperAdmin");

            superAdmin.PasswordRecoveryToken = await userManager.GeneratePasswordResetTokenAsync(superAdmin);
            await userManager.UpdateAsync(superAdmin);

            //ADMIN
            AppUser admin = new()
            {
                UserName = "admin@buildings.app",
                Email = "admin@buildings.app",
                FirstName = "Admin",
                LastName = "Person",
            };
            await userManager.CreateAsync(admin, adminPassword);
            await userManager.AddToRoleAsync(admin, "Admin");

            admin.PasswordRecoveryToken = await userManager.GeneratePasswordResetTokenAsync(admin);
            await userManager.UpdateAsync(admin);
            //TENANT
            AppUser tenant = new()
            {
                UserName = "tenant@buildings.app",
                Email = "tenant@buildings.app",
                FirstName = "Tenant",
                LastName = "Person",
            };
            await userManager.CreateAsync(tenant, tenantPassword);
            await userManager.AddToRoleAsync(tenant, "Tenant");

            tenant.PasswordRecoveryToken = await userManager.GeneratePasswordResetTokenAsync(tenant);
            await userManager.UpdateAsync(tenant);
        }
    }
}
