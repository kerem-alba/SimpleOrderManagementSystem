
using Business.BusinessAspects;
using Business.Constants;
using Core.Aspects.Autofac.Caching;
using Core.Aspects.Autofac.Logging;
using Core.Aspects.Autofac.Validation;
using Core.CrossCuttingConcerns.Logging.Serilog.Loggers;
using Core.Utilities.Results;
using DataAccess.Abstract;
using Entities.Concrete;
using MediatR;
using System.Threading;
using System.Threading.Tasks;
using System.Linq;
using Business.Handlers.Stocks.ValidationRules;

namespace Business.Handlers.Stocks.Commands
{
    /// <summary>
    /// 
    /// </summary>
    public class CreateStockCommand : IRequest<IResult>
    {

        public int CreatedUserId { get; set; }
        public System.DateTime CreatedDate { get; set; }
        public int LastUpdatedUserId { get; set; }
        public System.DateTime LastUpdatedDate { get; set; }
        public bool Status { get; set; }
        public bool IsDeleted { get; set; }
        public int ProductId { get; set; }
        public int Quantity { get; set; }
        public bool IsReadyForSale { get; set; }


        public class CreateStockCommandHandler : IRequestHandler<CreateStockCommand, IResult>
        {
            private readonly IStockRepository _stockRepository;
            private readonly IMediator _mediator;
            public CreateStockCommandHandler(IStockRepository stockRepository, IMediator mediator)
            {
                _stockRepository = stockRepository;
                _mediator = mediator;
            }

            [ValidationAspect(typeof(CreateStockValidator), Priority = 1)]
            [CacheRemoveAspect("Get")]
            [LogAspect(typeof(FileLogger))]
            [SecuredOperation(Priority = 1)]
            public async Task<IResult> Handle(CreateStockCommand request, CancellationToken cancellationToken)
            {
                var isThereStockRecord = _stockRepository.Query().Any(u => u.CreatedUserId == request.CreatedUserId);

                if (isThereStockRecord == true)
                    return new ErrorResult(Messages.NameAlreadyExist);

                var addedStock = new Stock
                {
                    CreatedUserId = request.CreatedUserId,
                    CreatedDate = request.CreatedDate,
                    LastUpdatedUserId = request.LastUpdatedUserId,
                    LastUpdatedDate = request.LastUpdatedDate,
                    Status = request.Status,
                    IsDeleted = request.IsDeleted,
                    ProductId = request.ProductId,
                    Quantity = request.Quantity,
                    IsReadyForSale = request.IsReadyForSale,

                };

                _stockRepository.Add(addedStock);
                await _stockRepository.SaveChangesAsync();
                return new SuccessResult(Messages.Added);
            }
        }
    }
}