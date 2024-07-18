using Core.Utilities.Results;
using DataAccess.Abstract;
using Entities.Dtos;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Business.Handlers.Orders.Queries
{
    public class GetOrderDetailsQuery : IRequest<IDataResult<IEnumerable<OrderDto>>>
    {
    }

    public class GetOrderDetailsQueryHandler : IRequestHandler<GetOrderDetailsQuery, IDataResult<IEnumerable<OrderDto>>>
    {
        private readonly IOrderRepository _orderRepository;

        public GetOrderDetailsQueryHandler(IOrderRepository orderRepository)
        {
            _orderRepository = orderRepository;
        }

        public async Task<IDataResult<IEnumerable<OrderDto>>> Handle(GetOrderDetailsQuery request, CancellationToken cancellationToken)
        {
            var data = await _orderRepository.GetOrderDetailsAsync();
            return new SuccessDataResult<IEnumerable<OrderDto>>(data);
        }
    }
}
