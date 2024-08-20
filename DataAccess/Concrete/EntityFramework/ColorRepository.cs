
using System;
using System.Linq;
using Core.DataAccess.EntityFramework;
using Entities.Concrete;
using DataAccess.Concrete.EntityFramework.Contexts;
using DataAccess.Abstract;
namespace DataAccess.Concrete.EntityFramework
{
    public class ColorRepository : EfEntityRepositoryBase<Color, ProjectDbContext>, IColorRepository
    {
        public ColorRepository(ProjectDbContext context) : base(context)
        {
        }
    }
}
