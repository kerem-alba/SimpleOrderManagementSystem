
using Business.Handlers.Customers.Commands;
using FluentValidation;

namespace Business.Handlers.Customers.ValidationRules
{

    public class CreateCustomerValidator : AbstractValidator<CreateCustomerCommand>
    {
        public CreateCustomerValidator()
        {
            RuleFor(x => x.Customer.CustomerName).NotEmpty();
            RuleFor(x => x.Customer.Address).NotEmpty();
            RuleFor(x => x.Customer.PhoneNumber).NotEmpty();
            RuleFor(x => x.Customer.Email).NotEmpty();
        }
    }
    public class UpdateCustomerValidator : AbstractValidator<UpdateCustomerCommand>
    {
        public UpdateCustomerValidator()
        {
            RuleFor(x => x.Customer.CustomerCode).NotEmpty();
            RuleFor(x => x.Customer.Address).NotEmpty();
            RuleFor(x => x.Customer.PhoneNumber).NotEmpty();
            RuleFor(x => x.Customer.Email).NotEmpty();
            RuleFor(x => x.Customer.CustomerName).NotEmpty();
            RuleFor(x => x.Customer.CreatedUserId).NotEmpty();

        }
    }
}