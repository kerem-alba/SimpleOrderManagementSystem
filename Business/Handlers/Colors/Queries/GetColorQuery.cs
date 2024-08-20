
using Business.BusinessAspects;
using Core.Utilities.Results;
using DataAccess.Abstract;
using Entities.Concrete;
using MediatR;
using System.Threading;
using System.Threading.Tasks;
using Core.Aspects.Autofac.Logging;
using Core.CrossCuttingConcerns.Logging.Serilog.Loggers;


namespace Business.Handlers.Colors.Queries
{
    public class GetColorQuery : IRequest<IDataResult<Color>>
    {
        public int Id { get; set; }

        public class GetColorQueryHandler : IRequestHandler<GetColorQuery, IDataResult<Color>>
        {
            private readonly IColorRepository _colorRepository;
            private readonly IMediator _mediator;

            public GetColorQueryHandler(IColorRepository colorRepository, IMediator mediator)
            {
                _colorRepository = colorRepository;
                _mediator = mediator;
            }
            [LogAspect(typeof(FileLogger))]
            [SecuredOperation(Priority = 1)]
            public async Task<IDataResult<Color>> Handle(GetColorQuery request, CancellationToken cancellationToken)
            {
                var color = await _colorRepository.GetAsync(p => p.Id == request.Id);
                return new SuccessDataResult<Color>(color);
            }
        }
    }
}
