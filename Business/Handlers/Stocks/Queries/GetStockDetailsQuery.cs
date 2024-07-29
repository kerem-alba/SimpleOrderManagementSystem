using AutoMapper;
using Business.Handlers.Stocks.Queries;
using Core.Utilities.Results;
using DataAccess.Abstract;
using DataAccess.Concrete.EntityFramework;
using Entities.Dtos;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Business.Handlers.Stocks.Queries
{
    public class GetStockDetailsQuery : IRequest<IDataResult<IEnumerable<StockDto>>>
    {

    }

    public class GetStockDetailsQueryHandler : IRequestHandler<GetStockDetailsQuery, IDataResult<IEnumerable<StockDto>>>
    {
        private readonly IStockRepository _stockRepository;
        private readonly IMapper _mapper;


        public GetStockDetailsQueryHandler(IStockRepository StockRepository, IMapper mapper)
        {
            _stockRepository = StockRepository;
            _mapper = mapper;
        }

        public async Task<IDataResult<IEnumerable<StockDto>>> Handle(GetStockDetailsQuery request, CancellationToken cancellationToken)
        {
            var stocks = await _stockRepository.GetStockDetailsAsync();
            var stockDtos = _mapper.Map<IEnumerable<StockDto>>(stocks);
            return new SuccessDataResult<IEnumerable<StockDto>>(stockDtos);
        }
    }
}
