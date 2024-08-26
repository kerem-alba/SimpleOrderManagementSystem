
using System;
using System.Linq;
using Core.DataAccess.EntityFramework;
using Entities.Concrete;
using DataAccess.Concrete.EntityFramework.Contexts;
using DataAccess.Abstract;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Core.Enums;
using Nest;
namespace DataAccess.Concrete.EntityFramework
{
    public class ProductRepository : EfEntityRepositoryBase<Product, ProjectDbContext>, IProductRepository
    {
        public ProductRepository(ProjectDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<Color>> GetColorsByProductNameAndSize(string productName, string size)
        {
            if (Enum.TryParse<SizeEnum>(size, out var parsedSize))
            {
                var colors = await Context.Products
                    .Where(p => p.Name == productName && p.Size == parsedSize && !p.IsDeleted)
                    .Select(p => p.Color)  
                    .Distinct()  
                    .ToListAsync();

                return colors;
            }
            else
            {
                return new List<Color>();
            }
        }

        public async Task<Product> GetProductsByAttributes(string productName, string size, int ColorId)
        {
            if (Enum.TryParse<SizeEnum>(size, out var parsedSize))
            {
                var product = await Context.Products
                    .Where(p => p.Name == productName && p.Size == parsedSize && p.ColorId == ColorId && !p.IsDeleted)
                    .FirstOrDefaultAsync();
                return product;
            }
            else
            {
                return new Product();
            }
        }
    }
}
