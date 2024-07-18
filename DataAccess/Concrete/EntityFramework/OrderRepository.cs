
using System;
using System.Linq;
using Core.DataAccess.EntityFramework;
using Entities.Concrete;
using DataAccess.Concrete.EntityFramework.Contexts;
using DataAccess.Abstract;
using Entities.Dtos;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
namespace DataAccess.Concrete.EntityFramework
{
    public class OrderRepository : EfEntityRepositoryBase<Order, ProjectDbContext>, IOrderRepository
    {
        public OrderRepository(ProjectDbContext context) : base(context)
        {

        }
        public async Task<IEnumerable<OrderDto>> GetOrderDetailsAsync()
        {
            var result = await Context.Orders
                .Include(o => o.Customer)
                .Include(o => o.Product)
                .Select(o => new OrderDto
                {
                    Id = o.Id,
                    CustomerName = o.Customer.CustomerName,
                    ProductName = o.Product.Name,
                    Quantity = o.Quantity,
                    Status = o.Status
                }).ToListAsync();

            return result;
        }
    }
}
