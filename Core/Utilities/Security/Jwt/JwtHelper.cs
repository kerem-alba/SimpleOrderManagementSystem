using Core.Entities.Concrete;
using Core.Extensions;
using Core.Utilities.Security.Encyption;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;


namespace Core.Utilities.Security.Jwt
{
    public class JwtHelper : ITokenHelper
    {
        private readonly TokenOptions _tokenOptions;
        private DateTime _accessTokenExpiration;

        public JwtHelper(IConfiguration configuration)
        {
            Configuration = configuration;
            _tokenOptions = Configuration.GetSection("TokenOptions").Get<TokenOptions>();
        }

        public IConfiguration Configuration { get; }

        public static string DecodeToken(string input)
        {
            var handler = new JwtSecurityTokenHandler();
            if (input.StartsWith("Bearer "))
            {
                input = input["Bearer ".Length..];
            }

            return handler.ReadJwtToken(input).ToString();
        }

        public TAccessToken CreateToken<TAccessToken>(User user, IEnumerable<Claim> claims, IEnumerable<string> userGroups)
            where TAccessToken : IAccessToken, new()
        {
            _accessTokenExpiration = DateTime.Now.AddMinutes(_tokenOptions.AccessTokenExpiration);
            var securityKey = SecurityKeyHelper.CreateSecurityKey(_tokenOptions.SecurityKey);
            var signingCredentials = SigningCredentialsHelper.CreateSigningCredentials(securityKey);
            var jwt = CreateJwtSecurityToken(_tokenOptions, user, signingCredentials, userGroups);
            var jwtSecurityTokenHandler = new JwtSecurityTokenHandler();
            var token = jwtSecurityTokenHandler.WriteToken(jwt);

            return new TAccessToken()
            {
                Token = token,
                Expiration = _accessTokenExpiration,
                RefreshToken = GenerateRefreshToken()
            };
        }

        public JwtSecurityToken CreateJwtSecurityToken(
            TokenOptions tokenOptions,
            User user,
            SigningCredentials signingCredentials,
            IEnumerable<string> userGroups
    )
        {
            var jwt = new JwtSecurityToken(
                tokenOptions.Issuer,
                tokenOptions.Audience,
                expires: _accessTokenExpiration,
                notBefore: DateTime.Now,
                claims: SetClaims(user, userGroups),
                signingCredentials: signingCredentials);
            return jwt;
        }
        public string GenerateRefreshToken()
        {
            var randomNumber = new byte[32];

            using var generator = RandomNumberGenerator.Create();
            generator.GetBytes(randomNumber);

            return Convert.ToBase64String(randomNumber);
        }
        private static IEnumerable<Claim> SetClaims(User user, IEnumerable<string> userGroups)
        {
            var claims = new List<Claim>();
            claims.AddNameIdentifier(user.UserId.ToString());
            if (user.CitizenId > 0)
            {
                claims.AddNameUniqueIdentifier(user.CitizenId.ToString());
            }

            if (!string.IsNullOrEmpty(user.FullName))
            {
                claims.AddName($"{user.FullName}");
            }

            claims.Add(new Claim(ClaimTypes.Role, user.AuthenticationProviderType));

            if (userGroups != null && userGroups.Any())
            {
                foreach (var group in userGroups)
                {
                    claims.Add(new Claim("groups", group)); 
                }
            }

            return claims;

        }
    }
}