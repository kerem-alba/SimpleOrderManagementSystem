
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
using Business.Handlers.Orders.ValidationRules;
using Core.Extensions;
using System;
using Core.Enums;
using ServiceStack.Messaging;


namespace Business.Handlers.Orders.Commands
{


    public class UpdateOrderCommand : IRequest<IResult>
    {
        public int Id { get; set; }
        public StatusEnum OrderStatus { get; set; }

        public class UpdateOrderCommandHandler : IRequestHandler<UpdateOrderCommand, IResult>
        {
            private readonly IOrderRepository _orderRepository;
            private readonly IStockRepository _stockRepository;
            private readonly IMediator _mediator;

            public UpdateOrderCommandHandler(IOrderRepository orderRepository, IStockRepository stockRepository, IMediator mediator)
            {
                _orderRepository = orderRepository;
                _stockRepository = stockRepository;
                _mediator = mediator;
            }

            [ValidationAspect(typeof(UpdateOrderValidator), Priority = 1)]
            [CacheRemoveAspect("Get")]
            [LogAspect(typeof(FileLogger))]
            [SecuredOperation(Priority = 1)]
            public async Task<IResult> Handle(UpdateOrderCommand request, CancellationToken cancellationToken)
            {

                var userId = UserInfoExtensions.GetUserId();

                if (userId == 0)
                {
                    return new ErrorResult(Messages.UserNotFound);
                }


                var isThereOrderRecord = await _orderRepository.GetAsync(u => u.Id == request.Id);
                var stock = await _stockRepository.GetAsync(x => x.ProductId == isThereOrderRecord.ProductId);
                if (stock == null)
                {
                    return new ErrorResult("Stock not found.");
                }

                isThereOrderRecord.LastUpdatedUserId = userId;
                isThereOrderRecord.LastUpdatedDate = DateTime.Now;
                isThereOrderRecord.OrderStatus = request.OrderStatus;

                _orderRepository.Update(isThereOrderRecord);
                _stockRepository.Update(stock);

                await _orderRepository.SaveChangesAsync();
                await _stockRepository.SaveChangesAsync();

                return new SuccessResult(Messages.Updated);
            }
        }
    }
}

