
using Business.Handlers.Stocks.Commands;
using FluentValidation;

namespace Business.Handlers.Stocks.ValidationRules
{

    public class CreateStockValidator : AbstractValidator<CreateStockCommand>
    {
        public CreateStockValidator()
        {
            RuleFor(x => x.Quantity).NotEmpty();

        }
    }
    public class UpdateStockValidator : AbstractValidator<UpdateStockCommand>
    {
        public UpdateStockValidator()
        {
            RuleFor(x => x.Quantity).NotEmpty();

        }
    }
}