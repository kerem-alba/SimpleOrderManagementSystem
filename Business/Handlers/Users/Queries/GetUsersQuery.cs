using AutoMapper;
using Business.BusinessAspects;
using Core.Aspects.Autofac.Caching;
using Core.Aspects.Autofac.Logging;
using Core.Aspects.Autofac.Performance;
using Core.CrossCuttingConcerns.Logging.Serilog.Loggers;
using Core.Entities.Dtos;
using Core.Utilities.Results;
using DataAccess.Abstract;
using Entities.Dtos;
using MediatR;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Business.Handlers.Users.Queries
{
    public class GetUsersQuery : IRequest<IDataResult<IEnumerable<GetUserDto>>>
    {
        public class GetUsersQueryHandler : IRequestHandler<GetUsersQuery, IDataResult<IEnumerable<GetUserDto>>>
        {
            private readonly IUserRepository _userRepository;
            private readonly IMapper _mapper;

            public GetUsersQueryHandler(IUserRepository userRepository, IMapper mapper)
            {
                _userRepository = userRepository;
                _mapper = mapper;
            }

            [SecuredOperation(Priority = 1)]
            [PerformanceAspect(5)]
            [CacheAspect(10)]
            [LogAspect(typeof(FileLogger))]
            public async Task<IDataResult<IEnumerable<GetUserDto>>> Handle(GetUsersQuery request, CancellationToken cancellationToken)
            {
                var userList = await _userRepository.GetListAsync();

                var filteredUserList = userList.Where(user => !user.IsDeleted).ToList();

                var userDtoList = filteredUserList.Select(user => _mapper.Map<GetUserDto>(user)).ToList();

                return new SuccessDataResult<IEnumerable<GetUserDto>>(userDtoList);
            }
        }
    }
}