using Core.Entities;
using System;
using System.Collections.Generic;

namespace Entities.Concrete
{
    public class Customer : BaseEntity, IEntity
    {
        public string CustomerName { get; set; }
        public string CustomerCode { get; set; }
        public string Address { get; set; }
        public string PhoneNumber { get; set; }
        public string Email { get; set; }

    }
}