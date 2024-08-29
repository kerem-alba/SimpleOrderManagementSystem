
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
using Nest;
using Core.Enums;
using ServiceStack;
namespace DataAccess.Concrete.EntityFramework
{
    public class OrderRepository : EfEntityRepositoryBase<Order, ProjectDbContext>, IOrderRepository
    {
        private readonly IStockRepository _stockRepository;
        public OrderRepository(ProjectDbContext context, IStockRepository stockRepository) : base(context)
        {
            _stockRepository = stockRepository;
        }
        public async Task<IEnumerable<OrderDto>> GetOrderDetailsAsync()
        {
            var orders = await (from o in Context.Orders
                                join p in Context.Products on o.ProductId equals p.Id
                                join c in Context.Color on p.ColorId equals c.Id
                                select new OrderDto
                                {
                                    OrderId = o.Id,
                                    CustomerName = o.Customer.CustomerName,
                                    IsDeleted = o.IsDeleted,
                                    ProductName = p.Name,
                                    ProductSize = p.Size,
                                    ProductColor = c.Name,
                                    Quantity = o.Quantity,
                                    OrderStatus = o.OrderStatus
                                }).ToListAsync();

            return orders;
        }

        public async Task UpdateOrderStatus(int orderId, string OrderStatus)
        {
            var order = await GetAsync(p => p.Id == orderId);
            if (order == null)
            {
                throw new InvalidOperationException("Order not found.");
            }

            var stock = await _stockRepository.GetAsync(s => s.ProductId == order.ProductId);


            if (OrderStatus == "Approved")
            {
                if (stock == null)
                {
                    throw new InvalidOperationException("No stocks for this product.");
                }
                if (stock.Quantity >= order.Quantity && stock.IsReadyForSale)
                {
                    stock.Quantity -= order.Quantity;
                    _stockRepository.Update(stock);
                    order.OrderStatus = StatusEnum.Approved;
                }
                else
                {
                    throw new InvalidOperationException("Insufficient stocks.");
                }
            }
            else if (OrderStatus == "Cancelled")
            {
                if (order.OrderStatus == StatusEnum.Approved)
                {
                    stock.Quantity += order.Quantity;
                    _stockRepository.Update(stock);
                }
                order.OrderStatus = StatusEnum.Cancelled;
            }
            else if (OrderStatus == "Rejected")
            {
                if (order.OrderStatus == StatusEnum.Approved)
                {
                    stock.Quantity += order.Quantity;
                    _stockRepository.Update(stock);
                }
                order.OrderStatus = StatusEnum.Rejected;
            }
            else
            {
                throw new InvalidOperationException("Invalid status.");
            }

            Update(order);
            await SaveChangesAsync();
        }


    }
}
