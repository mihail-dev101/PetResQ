﻿using System;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;


namespace Domain
{
    // data type od userId might be string instead of guid, keep in mind
    public class Post
    {
        public Guid ID { get; set; }
        public string Location { get; set; }
        public Guid UserID { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public PetType PetType { get; set; }
        public StatusType StatusType { get; set; }
    }
    
}