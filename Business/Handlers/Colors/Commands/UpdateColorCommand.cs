
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
using Business.Handlers.Colors.ValidationRules;


namespace Business.Handlers.Colors.Commands
{


    public class UpdateColorCommand : IRequest<IResult>
    {
        public int Id { get; set; }
        public int CreatedUserId { get; set; }
        public System.DateTime CreatedDate { get; set; }
        public int LastUpdatedUserId { get; set; }
        public System.DateTime LastUpdatedDate { get; set; }
        public bool Status { get; set; }
        public bool IsDeleted { get; set; }
        public string Name { get; set; }
        public string Code { get; set; }

        public class UpdateColorCommandHandler : IRequestHandler<UpdateColorCommand, IResult>
        {
            private readonly IColorRepository _colorRepository;
            private readonly IMediator _mediator;

            public UpdateColorCommandHandler(IColorRepository colorRepository, IMediator mediator)
            {
                _colorRepository = colorRepository;
                _mediator = mediator;
            }

            [ValidationAspect(typeof(UpdateColorValidator), Priority = 1)]
            [CacheRemoveAspect("Get")]
            [LogAspect(typeof(FileLogger))]
            [SecuredOperation(Priority = 1)]
            public async Task<IResult> Handle(UpdateColorCommand request, CancellationToken cancellationToken)
            {
                var isThereColorRecord = await _colorRepository.GetAsync(u => u.Id == request.Id);


                isThereColorRecord.CreatedUserId = request.CreatedUserId;
                isThereColorRecord.CreatedDate = request.CreatedDate;
                isThereColorRecord.LastUpdatedUserId = request.LastUpdatedUserId;
                isThereColorRecord.LastUpdatedDate = request.LastUpdatedDate;
                isThereColorRecord.Status = request.Status;
                isThereColorRecord.IsDeleted = request.IsDeleted;
                isThereColorRecord.Name = request.Name;
                isThereColorRecord.Code = request.Code;


                _colorRepository.Update(isThereColorRecord);
                await _colorRepository.SaveChangesAsync();
                return new SuccessResult(Messages.Updated);
            }
        }
    }
}

