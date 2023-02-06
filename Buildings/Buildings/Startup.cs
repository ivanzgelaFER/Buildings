using Buildings.Data;
using Buildings.Extensions;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Microsoft.EntityFrameworkCore;

namespace Buildings
{
    public class Startup
    {
        public IConfiguration Configuration { get; }
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public virtual void ConfigureDatabase(IServiceCollection services)
        {
            services.AddDbContext<BuildingsContext>(options => options.UseNpgsql(Configuration.GetConnectionString("DefaultConnection"), o => o.CommandTimeout(1800)));
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public virtual void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment()) app.UseDeveloperExceptionPage();
            else
            {
                app.UseExceptionHandler("/Error");
                app.UseHsts();
            }

            app.ConfigureCustomExceptionMiddleware();

            if (Configuration.GetSection("UseSwagger").Get<bool>())
            {
                app.UseCustomSwagger();
            }

            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseSpaStaticFiles();

            app.UseRouting();

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(name: "default", pattern: "{controller}/{action=Index}/{id?}");
                //endpoints.MapHub<NotificationHub>("/hubs/notification");
                //endpoints.MapHub<NewsFeedHub>("/hubs/newsFeed");
            });

            app.UseSpa(spa => //spa(single page application)
            {
                spa.Options.SourcePath = "ClientApp";
                if (env.IsDevelopment()) spa.UseReactDevelopmentServer(npmScript: "start");
            });
        }


    }
}
