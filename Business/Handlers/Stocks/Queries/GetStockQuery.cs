
using Business.BusinessAspects;
using Core.Utilities.Results;
using DataAccess.Abstract;
using Entities.Concrete;
using MediatR;
using System.Threading;
using System.Threading.Tasks;
using Core.Aspects.Autofac.Logging;
using Core.CrossCuttingConcerns.Logging.Serilog.Loggers;


namespace Business.Handlers.Stocks.Queries
{
    public class GetStockQuery : IRequest<IDataResult<Stock>>
    {
        public int Id { get; set; }

        public class GetStockQueryHandler : IRequestHandler<GetStockQuery, IDataResult<Stock>>
        {
            private readonly IStockRepository _stockRepository;
            private readonly IMediator _mediator;

            public GetStockQueryHandler(IStockRepository stockRepository, IMediator mediator)
            {
                _stockRepository = stockRepository;
                _mediator = mediator;
            }
            [LogAspect(typeof(FileLogger))]
            [SecuredOperation(Priority = 1)]
            public async Task<IDataResult<Stock>> Handle(GetStockQuery request, CancellationToken cancellationToken)
            {
                var stock = await _stockRepository.GetAsync(p => p.Id == request.Id);
                return new SuccessDataResult<Stock>(stock);
            }
        }
    }
}
