using Buildings.Data;
using Buildings.Data.Helpers;
using Buildings.Domain.Models;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System.Threading.Tasks;

namespace Buildings
{
    public class Program
    {
        public async static Task Main(string[] args)
        {
            IHost host = CreateHostBuilder(args).Build();  
            using IServiceScope scope = host.Services.CreateScope();  //using because IServiceScope implements interface IDisposable
            AppUserManager? userManager = scope.ServiceProvider.GetService<AppUserManager>();
            RoleManager<AppRole> roleManager = scope.ServiceProvider.GetService<RoleManager<AppRole>>();
            BuildingsContext context = scope.ServiceProvider.GetService<BuildingsContext>();
            IConfiguration config = scope.ServiceProvider.GetService<IConfiguration>();
            await SeedData.InitializeAsync(context, userManager, roleManager, config);
            await host.RunAsync();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                });
    }
}
