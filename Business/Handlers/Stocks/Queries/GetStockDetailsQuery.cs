using Business.Handlers.Stocks.Queries;
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

namespace Business.Handlers.Stocks.Queries
{
    public class GetStockDetailsQuery : IRequest<IDataResult<IEnumerable<StockDto>>>
    {

    }

    public class GetStockDetailsQueryHandler : IRequestHandler<GetStockDetailsQuery, IDataResult<IEnumerable<StockDto>>>
    {
        private readonly IStockRepository _StockRepository;

        public GetStockDetailsQueryHandler(IStockRepository StockRepository)
        {
            _StockRepository = StockRepository;
        }

        public async Task<IDataResult<IEnumerable<StockDto>>> Handle(GetStockDetailsQuery request, CancellationToken cancellationToken)
        {
            var data = await _StockRepository.GetStockDetailsAsync();
            return new SuccessDataResult<IEnumerable<StockDto>>(data);
        }
    }
}
