using Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entities.Concrete
{
    public class Color : BaseEntity, IEntity
    {
        public string Name { get; set; }
        public string Code { get; set; }
    }

}
