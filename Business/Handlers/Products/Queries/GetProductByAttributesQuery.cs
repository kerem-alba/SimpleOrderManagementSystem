
using Business.BusinessAspects;
using Core.Utilities.Results;
using DataAccess.Abstract;
using Entities.Concrete;
using MediatR;
using System.Threading;
using System.Threading.Tasks;
using Core.CrossCuttingConcerns.Logging.Serilog.Loggers;
using Core.Aspects.Autofac.Logging;
using Core.Enums;
namespace Business.Handlers.Products.Queries
{

    public class GetProductByAttributesQuery : IRequest<IDataResult<Product>>
    {
        public string ProductName { get; set; }
        public string Size { get; set; }
        public int ColorId { get; set; }

        public class GetProductByAttributesQueryHandler : IRequestHandler<GetProductByAttributesQuery, IDataResult<Product>>
        {
            private readonly IProductRepository _productRepository;
            private readonly IMediator _mediator;

            public GetProductByAttributesQueryHandler(IProductRepository productRepository, IMediator mediator)
            {
                _productRepository = productRepository;
                _mediator = mediator;
            }
            [LogAspect(typeof(FileLogger))]
            [SecuredOperation(Priority = 1)]
            public async Task<IDataResult<Product>> Handle(GetProductByAttributesQuery request, CancellationToken cancellationToken)
            {
                var product = await _productRepository.GetProductsByAttributes(request.ProductName, request.Size, request.ColorId);
                return new SuccessDataResult<Product>(product);
            }
        }
    }
}
