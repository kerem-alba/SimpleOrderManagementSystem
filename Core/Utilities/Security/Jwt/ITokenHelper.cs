using Core.Entities.Concrete;
using System.Collections.Generic;
using System.Security.Claims;

namespace Core.Utilities.Security.Jwt
{
    public interface ITokenHelper
    {
        TAccessToken CreateToken<TAccessToken>(User user, IEnumerable<Claim> claims, IEnumerable<string> userGroups)
            where TAccessToken : IAccessToken, new();

        string GenerateRefreshToken();
    }
}