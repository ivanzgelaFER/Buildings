using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;

namespace Buildings
{
    public class Startup
    {
        public IConfiguration Configuration { get; }
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public void Configure(IApplicationBuilder app)
        {

        }
    }
}
