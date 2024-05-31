namespace Core.Entities.Concrete
{
    public class UserGroup : BaseEntity, IEntity
    {
        public int GroupId { get; set; }
        public int UserId { get; set; }
    }
}