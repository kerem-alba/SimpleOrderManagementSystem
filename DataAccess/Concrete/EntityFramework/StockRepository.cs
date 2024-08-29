
using System;
using System.Linq;
using Core.DataAccess.EntityFramework;
using Entities.Concrete;
using DataAccess.Concrete.EntityFramework.Contexts;
using DataAccess.Abstract;
using System.Threading.Tasks;
using System.Collections.Generic;
using Entities.Dtos;
using Microsoft.EntityFrameworkCore;
using Nest;
namespace DataAccess.Concrete.EntityFramework
{
    public class StockRepository : EfEntityRepositoryBase<Stock, ProjectDbContext>, IStockRepository
    {
        public StockRepository(ProjectDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<StockDto>> GetStockDetailsAsync()
        {
            var stocks = await (from s in Context.Stocks
                                join p in Context.Products on s.ProductId equals p.Id
                                join c in Context.Color on p.ColorId equals c.Id
                                where !s.IsDeleted && !p.IsDeleted
                                select new StockDto
                                {
                                    Id = s.Id,
                                    ProductName = p.Name,
                                    ProductSize = p.Size,
                                    ProductColor = c.Name,
                                    Quantity = s.Quantity,
                                    IsReadyForSale = s.IsReadyForSale,
                                    IsDeleted = s.IsDeleted
                                }).ToListAsync();

            return stocks;
        }
    }
}
