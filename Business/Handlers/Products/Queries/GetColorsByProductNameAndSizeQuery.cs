
using Business.BusinessAspects;
using Core.Utilities.Results;
using Core.Aspects.Autofac.Performance;
using DataAccess.Abstract;
using Entities.Concrete;
using MediatR;
using System.Threading;
using System.Threading.Tasks;
using System.Collections.Generic;
using Core.CrossCuttingConcerns.Logging.Serilog.Loggers;
using Core.Aspects.Autofac.Logging;
using Core.Aspects.Autofac.Caching;

namespace Business.Handlers.Products.Queries
{

    public class GetColorsByProductNameAndSizeQuery : IRequest<IDataResult<IEnumerable<Color>>>
    {
        public string ProductName { get; set; }
        public string Size { get; set; }

        public class GetColorsByProductNameAndSizeQueryHandler : IRequestHandler<GetColorsByProductNameAndSizeQuery, IDataResult<IEnumerable<Color>>>
        {
            private readonly IProductRepository _productRepository;
            private readonly IMediator _mediator;

            public GetColorsByProductNameAndSizeQueryHandler(IProductRepository productRepository, IMediator mediator)
            {
                _productRepository = productRepository;
                _mediator = mediator;
            }

            [PerformanceAspect(5)]
            [CacheAspect(10)]
            [LogAspect(typeof(FileLogger))]
            [SecuredOperation(Priority = 1)]
            public async Task<IDataResult<IEnumerable<Color>>> Handle(GetColorsByProductNameAndSizeQuery request, CancellationToken cancellationToken)
            {
                var colors = await _productRepository.GetColorsByProductNameAndSize(request.ProductName, request.Size);
                return new SuccessDataResult<IEnumerable<Color>>(colors);
            }
        }
    }
}