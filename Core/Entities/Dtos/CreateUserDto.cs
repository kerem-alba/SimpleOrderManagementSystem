using Core.Enums;

namespace Core.Entities.Dtos
{
    public class CreateUserDto : IEntity
    {
        public string FullName { get; set; }
        public string Email { get; set; }
        public string MobilePhones { get; set; }
        public GenderEnum Gender { get; set; }

    }
}