using Core.Entities;
using Core.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entities.Dtos
{
    public class ProductDto : IDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public SizeEnum Size { get; set; }
        public int ColorId { get; set; }
        public string ColorCode { get; set; }
        public string ColorName { get; set; }
    }
}
