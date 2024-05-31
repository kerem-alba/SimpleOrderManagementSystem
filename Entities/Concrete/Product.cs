using Core.Entities;
using Core.Enums;
using System;

namespace Entities.Concrete
{
    public class Product : BaseEntity, IEntity
    {

        public string Name { get; set; }
        public int ColorId { get; set; }
        public SizeEnum Size { get; set; }
    }
}