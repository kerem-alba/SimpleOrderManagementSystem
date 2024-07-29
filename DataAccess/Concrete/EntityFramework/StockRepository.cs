
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
namespace DataAccess.Concrete.EntityFramework
{
    public class StockRepository : EfEntityRepositoryBase<Stock, ProjectDbContext>, IStockRepository
    {
        public StockRepository(ProjectDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<StockDto>> GetStockDetailsAsync()
        {
            var result = await Context.Stocks
                .Include(s => s.Product)
                .Select(s => new StockDto
                {
                    Id = s.Id,
                    ProductName = s.Product.Name,
                    ProductId = s.ProductId,
                    Quantity = s.Quantity,
                    IsReadyForSale = s.IsReadyForSale,
                    IsDeleted = s.IsDeleted
                }).ToListAsync();

            return result;
        }
    }
}
