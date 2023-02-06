using Aconto.Domain;
using Aconto.Domain.Exceptions;
using Aconto.Domain.Models;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Serilog;
using System;
using System.Net;
using System.Threading.Tasks;

namespace Aconto.Extensions
{
    public static class ExceptionMiddlewareExtensions
    {
        public static void ConfigureCustomExceptionMiddleware(this IApplicationBuilder app)
        {
            app.UseMiddleware<ExceptionMiddleware>();
        }

        public class ExceptionMiddleware
        {
            private readonly RequestDelegate next;

            public ExceptionMiddleware(RequestDelegate next)
            {
                this.next = next;
            }

            public async Task InvokeAsync(HttpContext httpContext)
            {
                try
                {
                    await next(httpContext);
                }
                catch (Exception ex)
                {
                    Log.Error(ex, ex.Message);
                    await HandleExceptionAsync(httpContext, ex);
                }
            }

            private static async Task HandleExceptionAsync(HttpContext context, Exception exception)
            {
                context.Response.ContentType = "application/json";
                context.Response.StatusCode = exception switch
                {
                    AppException => (int)HttpStatusCode.BadRequest,
                    NotFoundException => (int)HttpStatusCode.NotFound,
                    ConflictException => (int)HttpStatusCode.Conflict,
                    ForbiddenException => (int)HttpStatusCode.Forbidden,
                    _ => (int)HttpStatusCode.InternalServerError
                };
                await context.Response.WriteAsync(new ErrorDetails { StatusCode = context.Response.StatusCode, Message = exception.Message }.ToString());
            }
        }
    }
}
