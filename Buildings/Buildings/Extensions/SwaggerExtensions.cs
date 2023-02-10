using Microsoft.AspNetCore.Mvc.ApiExplorer;
using Microsoft.Extensions.Options;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.Filters;
using Swashbuckle.AspNetCore.SwaggerGen;
using System.Reflection;

namespace Buildings.Extensions
{
    public static class SwaggerExtensions
    {
        public static string ApiName = null;

        public static void AddCustomSwagger(this IServiceCollection services, string name = null)
        {
            ApiName = name ?? $"{Assembly.GetEntryAssembly().GetName().Name} API";

            services.AddVersionedApiExplorer(setup =>
            {
                setup.GroupNameFormat = "'v'VVV";
                setup.SubstituteApiVersionInUrl = true;
            });

            services.AddSwaggerGen();
            services.ConfigureOptions<ConfigureSwaggerOptions>();
        }
        public static void UseCustomSwagger(this IApplicationBuilder app)
        {
            IApiVersionDescriptionProvider versions = app.ApplicationServices.GetRequiredService<IApiVersionDescriptionProvider>();

            app.UseSwagger();
            app.UseSwaggerUI(options =>
            {
                foreach (var description in versions.ApiVersionDescriptions)
                {
                    options.SwaggerEndpoint($"/swagger/{description.GroupName}/swagger.json", description.GroupName.ToUpperInvariant());
                }
            });
        }
    }

    class ConfigureSwaggerOptions : IConfigureNamedOptions<SwaggerGenOptions>
    {
        private readonly IApiVersionDescriptionProvider versions;

        public ConfigureSwaggerOptions(IApiVersionDescriptionProvider versions)
        {
            this.versions = versions;
        }

        public void Configure(SwaggerGenOptions options)
        {
            options.AddSecurityDefinition("oauth2", new OpenApiSecurityScheme()
            {
                Name = "Authorization",
                Description = "JWT Authorization token",
                Type = SecuritySchemeType.Http,
                In = ParameterLocation.Header,
                Scheme = "bearer",
                BearerFormat = "JWT"
            });
            options.OperationFilter<SecurityRequirementsOperationFilter>();
            options.OperationFilter<AppendAuthorizeToSummaryOperationFilter>();

            foreach (ApiVersionDescription description in versions.ApiVersionDescriptions)
            {
                options.SwaggerDoc(description.GroupName, CreateVersionInfo(description));
            }
        }

        public void Configure(string name, SwaggerGenOptions options)
        {
            Configure(options);
        }

        private OpenApiInfo CreateVersionInfo(ApiVersionDescription description)
        {
            OpenApiInfo info = new()
            {
                Title = SwaggerExtensions.ApiName,
                Version = description.ApiVersion.ToString()
            };

            if (description.IsDeprecated)
            {
                info.Description += " This API version has been deprecated.";
            }

            return info;
        }
    }
}
