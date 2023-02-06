using System;
using System.Globalization;

namespace Aconto.Domain.Exceptions
{
    public class ForbiddenException : Exception
    {
        public ForbiddenException() : base() { }
        public ForbiddenException(string message) : base(message) { }
        public ForbiddenException(string message, params object[] args) : base(string.Format(CultureInfo.CurrentCulture, message, args)) { }
    }
}
