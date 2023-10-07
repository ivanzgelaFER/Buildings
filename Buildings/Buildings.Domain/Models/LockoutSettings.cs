namespace Buildings.Domain.Models
{
    public class LockoutSettings
    {
        public bool Enabled { get; set; }
        public int Duration { get; set; }
        public int Attempts { get; set; }
        public LockoutUnit Units { get; set; }
        public TimeSpan LockoutTimespan { 
            get {
                return Units switch
                {
                    LockoutUnit.min => TimeSpan.FromMinutes(Duration),
                    LockoutUnit.hour => TimeSpan.FromHours(Duration),
                    LockoutUnit.day => TimeSpan.FromDays(Duration),
                    _ => TimeSpan.FromMinutes(30),
                };
            } 
        }
        public string UnitString
        {
            get
            {
                string unitString = Enum.GetName(typeof(LockoutUnit), Units);
                return Duration == 1 ? unitString : $"{unitString}s";
            }
        }
    }

    public enum LockoutUnit
    {
        min, hour, day
    }
}
