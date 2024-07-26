
using Business.Constants;
using Business.BusinessAspects;
using Core.Aspects.Autofac.Caching;
using Core.Aspects.Autofac.Logging;
using Core.CrossCuttingConcerns.Logging.Serilog.Loggers;
using Core.Utilities.Results;
using DataAccess.Abstract;
using Entities.Concrete;
using MediatR;
using System.Threading;
using System.Threading.Tasks;
using System.Linq;
using Core.Aspects.Autofac.Validation;
using Business.Handlers.Stocks.ValidationRules;


namespace Business.Handlers.Stocks.Commands
{


    public class UpdateStockCommand : IRequest<IResult>
    {
        public int Id { get; set; }
        public bool IsDeleted { get; set; }
        public int Quantity { get; set; }
        public bool IsReadyForSale { get; set; }

        public class UpdateStockCommandHandler : IRequestHandler<UpdateStockCommand, IResult>
        {
            private readonly IStockRepository _stockRepository;
            private readonly IMediator _mediator;

            public UpdateStockCommandHandler(IStockRepository stockRepository, IMediator mediator)
            {
                _stockRepository = stockRepository;
                _mediator = mediator;
            }

            [ValidationAspect(typeof(UpdateStockValidator), Priority = 1)]
            [CacheRemoveAspect("Get")]
            [LogAspect(typeof(FileLogger))]
            [SecuredOperation(Priority = 1)]
            public async Task<IResult> Handle(UpdateStockCommand request, CancellationToken cancellationToken)
            {
                var isThereStockRecord = await _stockRepository.GetAsync(u => u.Id == request.Id);


                isThereStockRecord.LastUpdatedUserId = 0;
                isThereStockRecord.LastUpdatedDate = System.DateTime.Now;
                isThereStockRecord.IsDeleted = request.IsDeleted;
                isThereStockRecord.Quantity = request.Quantity;
                isThereStockRecord.IsReadyForSale = request.IsReadyForSale;


                _stockRepository.Update(isThereStockRecord);
                await _stockRepository.SaveChangesAsync();
                return new SuccessResult(Messages.Updated);
            }
        }
    }
}

