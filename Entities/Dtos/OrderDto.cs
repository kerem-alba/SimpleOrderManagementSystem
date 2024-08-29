using Core.Entities;
using Core.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entities.Dtos
{
    public class OrderDto
    {
        public int OrderId { get; set; }
        public string CustomerName { get; set; }
        public string ProductName { get; set; }
        public SizeEnum ProductSize { get; set; }
        public string ProductColor { get; set; }
        public int Quantity { get; set; }
        public StatusEnum OrderStatus { get; set; }
        public bool IsDeleted { get; set; }

    }

}
