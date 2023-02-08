using AutoMapper;
using Buildings.Data;
using Buildings.Data.Helpers;
using Buildings.Domain.Models;
using Buildings.Extensions;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Microsoft.EntityFrameworkCore;
using System.Text;
using System;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Primitives;
using Microsoft.Extensions.DependencyInjection;
using Aconto.Domain.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Mvc.Versioning.Conventions;
using Aconto.Domain.Enums;

namespace Buildings
{
    public class Startup
    {
        public IConfiguration Configuration { get; }
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        /* Transient-This lifestyle services are created each time they are requested (database access, file access, when you need a fresh instance of an object every single time)
           Scoped-Scoped lifestyle services are created once per request
           Singleton-A singleton service is created once at first time it is requested and this instance of service is used by every sub-requests(useful for global configuration, business rules, persisting state)*/

        // This method gets called by the runtime. Use this method to add services to the container
        public void ConfigureServices(IServiceCollection services)
        {
            ConfigureDatabase(services);
            services.Configure<FormOptions>(x => x.MultipartBodyLengthLimit = int.MaxValue);

            IMapper mapper = new MapperConfiguration(mc => mc.AddProfile(new AutoMapperProfile())).CreateMapper();
            services.AddSingleton(mapper);  //mapper has been added as singleton because this service won't change in the future through application runtime)

            LockoutSettings lockoutSettings = ConfigurationBinder.Get<LockoutSettings>(Configuration.GetSection("Lockout"));

            services.AddIdentity<AppUser, AppRole>(options =>
            {
                options.Password.RequireDigit = true;
                options.Password.RequiredLength = 8;
                options.Password.RequireUppercase = true;
                options.Password.RequireLowercase = true;
                options.Password.RequireNonAlphanumeric = false;

                options.Lockout.AllowedForNewUsers = lockoutSettings.Enabled;
                options.Lockout.MaxFailedAccessAttempts = lockoutSettings.Attempts;
                options.Lockout.DefaultLockoutTimeSpan = lockoutSettings.LockoutTimespan;
            })
                .AddUserManager<AppUserManager>()
                .AddEntityFrameworkStores<BuildingsContext>()
                .AddDefaultTokenProviders();

            byte[] key = Encoding.ASCII.GetBytes(Configuration["Secret"]);
            services.AddAuthentication(x =>
            {
                x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(x =>
            {
                x.Events = new JwtBearerEvents
                {
                    OnMessageReceived = context =>
                    {
                        StringValues accessToken = context.Request.Query["access_token"];

                        PathString path = context.HttpContext.Request.Path;
                        if (!string.IsNullOrEmpty(accessToken) && path.StartsWithSegments("/hubs"))
                        {
                            context.Token = accessToken;
                        }
                        return Task.CompletedTask;
                    },
                    OnTokenValidated = context =>
                    {
                        AppUserManager userManager = context.HttpContext.RequestServices.GetRequiredService<AppUserManager>();
                        Guid userGuid = Guid.Parse(context.Principal.FindFirst("guid").Value);
                        AppUser user = userManager.GetUserByGuidAsync(userGuid).Result;
                        if (user == null || user.IsEnabled != UserEnabled.IsEnabled) context.Fail("Unauthorized");
                        return Task.CompletedTask;
                    }
                };
                x.RequireHttpsMetadata = false;
                x.SaveToken = true;
                x.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = false,
                    ValidateAudience = false
                };
            });
            /*
            ISignalRServerBuilder signalRBuilder = services.AddSignalR(options =>
            {
                options.EnableDetailedErrors = true;
            });
            string azureConnection = Configuration.GetConnectionString("AzureSignalRConnection");
            if (!string.IsNullOrEmpty(azureConnection))
            {
                signalRBuilder.AddAzureSignalR(azureConnection);
            }

            services.AddScoped<IMailService, MailService>();
            */
            services.AddControllersWithViews().AddNewtonsoftJson(options => options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore);
            services.AddSpaStaticFiles(configuration => configuration.RootPath = "ClientApp/build");

            services.AddApiVersioning(options =>
            {
                options.Conventions.Add(new VersionByNamespaceConvention());
            });

            services.AddCustomSwagger();

            //services.AddScoped<IProjectsService, ProjectsService>();   here is scope for services

            /*
            services = Configuration["Store"] switch
            {
                "DO" => services.AddScoped<ICloudService, DigitalOceanService>(),
                "Azure" => services.AddScoped<ICloudService, AzureService>(),
                _ => services.AddScoped<ICloudService, LocalService>()
            };
            */
            Environment.SetEnvironmentVariable("AWS_ACCESS_KEY_ID", Configuration["AWS:AccessKey"]);
            Environment.SetEnvironmentVariable("AWS_SECRET_ACCESS_KEY", Configuration["AWS:SecretKey"]);
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
