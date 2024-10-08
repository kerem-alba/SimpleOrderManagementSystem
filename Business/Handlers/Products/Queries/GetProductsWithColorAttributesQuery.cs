﻿
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
using Entities.Dtos;

namespace Business.Handlers.Products.Queries
{

    public class GetProductsWithColorAttributesQuery : IRequest<IDataResult<IEnumerable<ProductDto>>>
    {
        public class GetProductsWithColorAttributesQueryHandler : IRequestHandler<GetProductsWithColorAttributesQuery, IDataResult<IEnumerable<ProductDto>>>
        {
            private readonly IProductRepository _productRepository;
            private readonly IMediator _mediator;

            public GetProductsWithColorAttributesQueryHandler(IProductRepository productRepository, IMediator mediator)
            {
                _productRepository = productRepository;
                _mediator = mediator;
            }

            [PerformanceAspect(5)]
            [CacheAspect(10)]
            [LogAspect(typeof(FileLogger))]
            [SecuredOperation(Priority = 1)]
            public async Task<IDataResult<IEnumerable<ProductDto>>> Handle(GetProductsWithColorAttributesQuery request, CancellationToken cancellationToken)
            {
                var products = await _productRepository.GetProductsWithColorAttributesQuery();
                return new SuccessDataResult<IEnumerable<ProductDto>>(products);
            }
        }
    }
}