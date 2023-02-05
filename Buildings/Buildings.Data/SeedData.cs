using Buildings.Data.Helpers;
using Buildings.Domain.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Buildings.Data
{
    public static class SeedData
    {
        public static async Task InitializeAsync(BuildingsContext ctx, AppUserManager userManager, RoleManager<AppRole> roleManager, IConfiguration config)
        {
            /*
            try
            {
                await ctx.Database.MigrateAsync();
            }
            catch (Exception ex)
            {
                Log.Error(ex.Message);
            }
            string adminPassword = config.GetSection("SeedPasswordAdmin").Value;
            string userPassword = config.GetSection("SeedPasswordUser").Value;
            string studentPassword = config.GetSection("SeedPasswordStudent").Value;
            string superAdminPassword = config.GetSection("SeedPasswordSuperAdmin").Value;
            if (!await dbContext.Companies.AnyAsync()) await SeedCompanies(dbContext);
            if (!await dbContext.Roles.AnyAsync()) await SeedRolesAsync(roleManager);
            if (!await dbContext.Users.AnyAsync()) await SeedUsersAsync(userManager, adminPassword, userPassword, studentPassword, superAdminPassword, dbContext);
            if (!await dbContext.ProjectRoles.AnyAsync()) await SeedProjectRoles(dbContext);
            if (!await dbContext.Languages.AnyAsync()) await SeedLanguages(dbContext);

            if (!await dbContext.Projects.AnyAsync()) await SeedProjects(dbContext);
            if (!await dbContext.Partners.AnyAsync()) await SeedPartners(dbContext);
        */
        }
    }
}
