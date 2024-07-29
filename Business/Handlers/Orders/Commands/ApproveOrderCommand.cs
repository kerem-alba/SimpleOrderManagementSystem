using Business.BusinessAspects;
using Business.Handlers.Orders.ValidationRules;
using Core.Aspects.Autofac.Caching;
using Core.Aspects.Autofac.Logging;
using Core.Aspects.Autofac.Validation;
using Core.CrossCuttingConcerns.Logging.Serilog.Loggers;
using Core.Enums;
using Core.Utilities.Results;
using DataAccess.Abstract;
using MediatR;
using ServiceStack.Messaging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Business.Handlers.Orders.Commands
{
    public class ApproveOrderCommand : IRequest<IResult>
    {
        public int OrderId { get; set; }

        public class ApproveOrderCommandHandler : IRequestHandler<ApproveOrderCommand, IResult>
        {
            private readonly IOrderRepository _orderRepository;
            private readonly IStockRepository _stockRepository;


            public ApproveOrderCommandHandler(IOrderRepository orderRepository, IStockRepository stockRepository)
            {
                _orderRepository = orderRepository;
                _stockRepository = stockRepository;
            }

            [CacheRemoveAspect("Get")]
            [LogAspect(typeof(FileLogger))]
            [SecuredOperation(Priority = 1)]
            public async Task<IResult> Handle(ApproveOrderCommand request, CancellationToken cancellationToken)
            {
                var order = await _orderRepository.GetAsync(x => x.Id == request.OrderId);
                if (order == null)
                {
                    return new ErrorResult("Order not found.");
                }

                var stock = await _stockRepository.GetAsync(x => x.ProductId == order.ProductId);
                if (stock == null)
                {
                    return new ErrorResult("Stock not found.");
                }

                if (stock.Quantity < order.Quantity)
                {
                    order.OrderStatus = StatusEnum.Rejected;
                    _orderRepository.Update(order);
                    await _orderRepository.SaveChangesAsync();
                    return new ErrorResult("Insufficient stock.");
                }

                order.OrderStatus = StatusEnum.Approved;
                stock.Quantity -= order.Quantity;

                _orderRepository.Update(order);
                _stockRepository.Update(stock);
                await _orderRepository.SaveChangesAsync();
                await _stockRepository.SaveChangesAsync();

                return new SuccessResult("Order approved successfully");
            }
        }
    }
}
