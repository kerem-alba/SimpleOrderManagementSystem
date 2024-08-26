using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Core.DataAccess;
using Entities.Concrete;
namespace DataAccess.Abstract
{
    public interface IProductRepository : IEntityRepository<Product>
    {
        Task<IEnumerable<Color>> GetColorsByProductNameAndSize(string productName, string size);
        Task<Product> GetProductsByAttributes(string productName, string size, int ColorId);

    }
}