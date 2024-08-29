
using Business.Constants;
using Core.Aspects.Autofac.Caching;
using Business.BusinessAspects;
using Core.Aspects.Autofac.Logging;
using Core.CrossCuttingConcerns.Logging.Serilog.Loggers;
using Core.Utilities.Results;
using DataAccess.Abstract;
using System.Threading;
using System.Threading.Tasks;
using Core.Enums;
using Nest;
using MediatR;

namespace Business.Handlers.Orders.Commands
{


    public class UpdateOrderStatusCommand : MediatR.IRequest<IResult>
    {
        public int Id { get; set; }
        public string OrderStatus { get; set; }
        public int Quantity { get; set; }

        public class UpdateProductStatusCommandHandler : IRequestHandler<UpdateOrderStatusCommand, IResult>
        {
            private readonly IOrderRepository _orderRepository;
            private readonly IMediator _mediator;

            public UpdateProductStatusCommandHandler(IOrderRepository orderRepository, IMediator mediator)
            {
                _orderRepository = orderRepository;
                _mediator = mediator;
            }

            [CacheRemoveAspect("Get")]
            [LogAspect(typeof(FileLogger))]
            [SecuredOperation(Priority = 1)]
            public async Task<IResult> Handle(UpdateOrderStatusCommand request, CancellationToken cancellationToken)
            {
                var order = await _orderRepository.GetAsync(p => p.Id == request.Id);
                if (order == null)
                {
                    return new ErrorResult(Messages.UserNotFound);
                }
                await _orderRepository.UpdateOrderStatus(request.Id, request.OrderStatus, request.Quantity);

                await _orderRepository.SaveChangesAsync();
                return new SuccessResult(string.Empty);
            }
        }
    }
}

