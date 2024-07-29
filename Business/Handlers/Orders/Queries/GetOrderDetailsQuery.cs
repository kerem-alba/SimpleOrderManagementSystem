using AutoMapper;
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
        private readonly IMapper _mapper;


        public GetOrderDetailsQueryHandler(IOrderRepository orderRepository, IMapper mapper)
        {
            _orderRepository = orderRepository;
            _mapper = mapper;

        }

        public async Task<IDataResult<IEnumerable<OrderDto>>> Handle(GetOrderDetailsQuery request, CancellationToken cancellationToken)
        {
            var orders = await _orderRepository.GetOrderDetailsAsync();
            var orderDtos = _mapper.Map<IEnumerable<OrderDto>>(orders);
            return new SuccessDataResult<IEnumerable<OrderDto>>(orderDtos);
        }
    }
}
