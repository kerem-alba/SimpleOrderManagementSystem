
using Business.BusinessAspects;
using Core.Aspects.Autofac.Performance;
using Core.Utilities.Results;
using DataAccess.Abstract;
using Entities.Concrete;
using MediatR;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Core.Aspects.Autofac.Logging;
using Core.CrossCuttingConcerns.Logging.Serilog.Loggers;
using Core.Aspects.Autofac.Caching;

namespace Business.Handlers.Stocks.Queries
{

    public class GetStocksQuery : IRequest<IDataResult<IEnumerable<Stock>>>
    {
        public class GetStocksQueryHandler : IRequestHandler<GetStocksQuery, IDataResult<IEnumerable<Stock>>>
        {
            private readonly IStockRepository _stockRepository;
            private readonly IMediator _mediator;

            public GetStocksQueryHandler(IStockRepository stockRepository, IMediator mediator)
            {
                _stockRepository = stockRepository;
                _mediator = mediator;
            }

            [PerformanceAspect(5)]
            [CacheAspect(10)]
            [LogAspect(typeof(FileLogger))]
            [SecuredOperation(Priority = 1)]
            public async Task<IDataResult<IEnumerable<Stock>>> Handle(GetStocksQuery request, CancellationToken cancellationToken)
            {
                return new SuccessDataResult<IEnumerable<Stock>>(await _stockRepository.GetListAsync());
            }
        }
    }
}