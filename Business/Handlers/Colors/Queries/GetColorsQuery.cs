
using Business.BusinessAspects;
using Core.Aspects.Autofac.Performance;
using Core.Utilities.Results;
using DataAccess.Abstract;
using Entities.Concrete;
using MediatR;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Core.Aspects.Autofac.Logging;
using Core.CrossCuttingConcerns.Logging.Serilog.Loggers;
using Core.Aspects.Autofac.Caching;

namespace Business.Handlers.Colors.Queries
{

    public class GetColorsQuery : IRequest<IDataResult<IEnumerable<Color>>>
    {
        public class GetColorsQueryHandler : IRequestHandler<GetColorsQuery, IDataResult<IEnumerable<Color>>>
        {
            private readonly IColorRepository _colorRepository;
            private readonly IMediator _mediator;

            public GetColorsQueryHandler(IColorRepository colorRepository, IMediator mediator)
            {
                _colorRepository = colorRepository;
                _mediator = mediator;
            }

            [PerformanceAspect(5)]
            [CacheAspect(10)]
            [LogAspect(typeof(FileLogger))]
            [SecuredOperation(Priority = 1)]
            public async Task<IDataResult<IEnumerable<Color>>> Handle(GetColorsQuery request, CancellationToken cancellationToken)
            {
                return new SuccessDataResult<IEnumerable<Color>>(await _colorRepository.GetListAsync());
            }
        }
    }
}