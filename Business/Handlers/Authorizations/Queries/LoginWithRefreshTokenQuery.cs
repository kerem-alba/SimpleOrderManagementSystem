using Business.Constants;
using Business.Handlers.UserGroups.Queries;
using Core.Aspects.Autofac.Logging;
using Core.CrossCuttingConcerns.Caching;
using Core.CrossCuttingConcerns.Logging.Serilog.Loggers;
using Core.Entities.Concrete;
using Core.Utilities.Results;
using Core.Utilities.Security.Jwt;
using DataAccess.Abstract;
using MediatR;
using System;
using System.Linq;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;

namespace Business.Handlers.Authorizations.Queries
{
    public class LoginWithRefreshTokenQuery : IRequest<IResult>
    {
        public string RefreshToken { get; set; }

        public class LoginWithRefreshTokenQueryHandler : IRequestHandler<LoginWithRefreshTokenQuery, IResult>
        {
            private readonly IUserRepository _userRepository;
            private readonly ITokenHelper _tokenHelper;
            private readonly ICacheManager _cacheManager;
            private readonly IMediator _mediator;

            public LoginWithRefreshTokenQueryHandler(IUserRepository userRepository, ITokenHelper tokenHelper, ICacheManager cacheManager, IMediator mediator)
            {
                _userRepository = userRepository;
                _tokenHelper = tokenHelper;
                _cacheManager = cacheManager;
                _mediator = mediator;
            }

            [LogAspect(typeof(FileLogger))]
            public async Task<IResult> Handle(LoginWithRefreshTokenQuery request, CancellationToken cancellationToken)
            {
                var userToCheck = await _userRepository.GetByRefreshToken(request.RefreshToken);
                if (userToCheck == null)
                {
                    return new ErrorDataResult<User>(Messages.UserNotFound);
                }


                var claims = _userRepository.GetClaims(userToCheck.UserId);
                _cacheManager.Remove($"{CacheKeys.UserIdForClaim}={userToCheck.UserId}");
                _cacheManager.Add($"{CacheKeys.UserIdForClaim}={userToCheck.UserId}", claims.Select(x => x.Name));
                var userGroups = await _mediator.Send(new GetUserGroupLookupByUserIdQuery { UserId = userToCheck.UserId });
                var accessToken = _tokenHelper.CreateToken<AccessToken>(userToCheck, claims.Select(c => new Claim(ClaimTypes.Role, c.Name)), userGroups.Data.Select(g => g.Label));
                userToCheck.RefreshToken = accessToken.RefreshToken;
                _userRepository.Update(userToCheck);
                await _userRepository.SaveChangesAsync();
                return new SuccessDataResult<AccessToken>(accessToken, Messages.SuccessfulLogin);
            }
        }
    }
}

