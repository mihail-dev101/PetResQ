using System;

namespace Domain
{
    public class PetPhoto
    {
        public string Id { get; set; }
        public string Url { get; set; }
        public bool IsMain { get; set; }
        public string PostId { get; set; }
    }
}
