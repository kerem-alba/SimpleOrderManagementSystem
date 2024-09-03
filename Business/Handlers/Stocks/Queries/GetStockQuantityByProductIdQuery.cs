
using Business.BusinessAspects;
using Core.Utilities.Results;
using DataAccess.Abstract;
using Entities.Concrete;
using MediatR;
using System.Threading;
using System.Threading.Tasks;
using Core.CrossCuttingConcerns.Logging.Serilog.Loggers;
using Core.Aspects.Autofac.Logging;
using System.Linq;
namespace Business.Handlers.Stocks.Queries
{

    public class GetStockQuantityByProductIdQuery : IRequest<IDataResult<int>>
    {
        public int ProductId { get; set; }

        public class GetStockqQuantityByProductIdQueryHandler : IRequestHandler<GetStockQuantityByProductIdQuery, IDataResult<int>>
        {
            private readonly IStockRepository _stockRepository;
            private readonly IMediator _mediator;

            public GetStockqQuantityByProductIdQueryHandler(IStockRepository stockRepository, IMediator mediator)
            {
                _stockRepository = stockRepository;
                _mediator = mediator;
            }
            [LogAspect(typeof(FileLogger))]
            [SecuredOperation(Priority = 1)]
            public async Task<IDataResult<int>> Handle(GetStockQuantityByProductIdQuery request, CancellationToken cancellationToken)
            {
                var stockList = await _stockRepository.GetListAsync();
                var stock = stockList.FirstOrDefault(s => s.ProductId == request.ProductId);
                if (stock == null)
                {
                    return new SuccessDataResult<int>(0, "Stock not found.");

                }
                return new SuccessDataResult<int>(stock.Quantity);
            }
        }
    }
}
