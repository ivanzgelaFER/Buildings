﻿using System;
using System.Globalization;

namespace Buildings.Domain.Exceptions
{
    [Serializable]
    public class ConflictException : Exception
    {
        public ConflictException() : base() { }
        public ConflictException(string message) : base(message) { }
        public ConflictException(string message, params object[] args) : base(string.Format(CultureInfo.CurrentCulture, message, args)) { }
    }
}
