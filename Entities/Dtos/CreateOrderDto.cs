using Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entities.Dtos
{
    public class CreateOrderDto : IDto
    {
        public int Quantity { get; set; }
        public int CustomerId { get; set; }
        public int ProductId { get; set; }
    }
}
