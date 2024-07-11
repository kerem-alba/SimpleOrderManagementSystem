using Business.BusinessAspects;
using Business.Constants;
using Core.Aspects.Autofac.Caching;
using Core.Aspects.Autofac.Logging;
using Core.CrossCuttingConcerns.Logging.Serilog.Loggers;
using Core.Entities.Concrete;
using Core.Entities.Dtos;
using Core.Utilities.Results;
using Core.Utilities.Security.Hashing;
using DataAccess.Abstract;
using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace Business.Handlers.Users.Commands
{
    public class CreateUserCommand : IRequest<IResult>
    {
        public CreateUserDto UserDto { get; set; }


        public class CreateUserCommandHandler : IRequestHandler<CreateUserCommand, IResult>
        {
            private readonly IUserRepository _userRepository;

            public CreateUserCommandHandler(IUserRepository userRepository)
            {
                _userRepository = userRepository;
            }

            [SecuredOperation(Priority = 1)]
            [CacheRemoveAspect()]
            [LogAspect(typeof(FileLogger))]
            public async Task<IResult> Handle(CreateUserCommand request, CancellationToken cancellationToken)
            {
                var isThereAnyUser = await _userRepository.GetAsync(u => u.Email == request.UserDto.Email);

                if (isThereAnyUser != null)
                {
                    return new ErrorResult(Messages.NameAlreadyExist);
                }


                var user = new User
                {
                    Email = request.UserDto.Email,
                    FullName = request.UserDto.FullName,
                    Gender = request.UserDto.Gender,
                    MobilePhones = request.UserDto.MobilePhones,
                    Status = true,
                    IsDeleted = false,
                };

                _userRepository.Add(user);
                await _userRepository.SaveChangesAsync();
                return new SuccessResult(Messages.Added);
            }
        }
    }
}