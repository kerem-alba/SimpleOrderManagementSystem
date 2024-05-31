
using Business.Handlers.Stocks.Queries;
using DataAccess.Abstract;
using Moq;
using NUnit.Framework;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading.Tasks;
using static Business.Handlers.Stocks.Queries.GetStockQuery;
using Entities.Concrete;
using static Business.Handlers.Stocks.Queries.GetStocksQuery;
using static Business.Handlers.Stocks.Commands.CreateStockCommand;
using Business.Handlers.Stocks.Commands;
using Business.Constants;
using static Business.Handlers.Stocks.Commands.UpdateStockCommand;
using static Business.Handlers.Stocks.Commands.DeleteStockCommand;
using MediatR;
using System.Linq;
using FluentAssertions;


namespace Tests.Business.HandlersTest
{
    [TestFixture]
    public class StockHandlerTests
    {
        Mock<IStockRepository> _stockRepository;
        Mock<IMediator> _mediator;
        [SetUp]
        public void Setup()
        {
            _stockRepository = new Mock<IStockRepository>();
            _mediator = new Mock<IMediator>();
        }

        [Test]
        public async Task Stock_GetQuery_Success()
        {
            //Arrange
            var query = new GetStockQuery();

            _stockRepository.Setup(x => x.GetAsync(It.IsAny<Expression<Func<Stock, bool>>>())).ReturnsAsync(new Stock()
//propertyler buraya yazılacak
//{																		
//StockId = 1,
//StockName = "Test"
//}
);

            var handler = new GetStockQueryHandler(_stockRepository.Object, _mediator.Object);

            //Act
            var x = await handler.Handle(query, new System.Threading.CancellationToken());

            //Asset
            x.Success.Should().BeTrue();
            //x.Data.StockId.Should().Be(1);

        }

        [Test]
        public async Task Stock_GetQueries_Success()
        {
            //Arrange
            var query = new GetStocksQuery();

            _stockRepository.Setup(x => x.GetListAsync(It.IsAny<Expression<Func<Stock, bool>>>()))
                        .ReturnsAsync(new List<Stock> { new Stock() { /*TODO:propertyler buraya yazılacak StockId = 1, StockName = "test"*/ } });

            var handler = new GetStocksQueryHandler(_stockRepository.Object, _mediator.Object);

            //Act
            var x = await handler.Handle(query, new System.Threading.CancellationToken());

            //Asset
            x.Success.Should().BeTrue();
            ((List<Stock>)x.Data).Count.Should().BeGreaterThan(1);

        }

        [Test]
        public async Task Stock_CreateCommand_Success()
        {
            Stock rt = null;
            //Arrange
            var command = new CreateStockCommand();
            //propertyler buraya yazılacak
            //command.StockName = "deneme";

            _stockRepository.Setup(x => x.GetAsync(It.IsAny<Expression<Func<Stock, bool>>>()))
                        .ReturnsAsync(rt);

            _stockRepository.Setup(x => x.Add(It.IsAny<Stock>())).Returns(new Stock());

            var handler = new CreateStockCommandHandler(_stockRepository.Object, _mediator.Object);
            var x = await handler.Handle(command, new System.Threading.CancellationToken());

            _stockRepository.Verify(x => x.SaveChangesAsync());
            x.Success.Should().BeTrue();
            x.Message.Should().Be(Messages.Added);
        }

        [Test]
        public async Task Stock_CreateCommand_NameAlreadyExist()
        {
            //Arrange
            var command = new CreateStockCommand();
            //propertyler buraya yazılacak 
            //command.StockName = "test";

            _stockRepository.Setup(x => x.Query())
                                           .Returns(new List<Stock> { new Stock() { /*TODO:propertyler buraya yazılacak StockId = 1, StockName = "test"*/ } }.AsQueryable());

            _stockRepository.Setup(x => x.Add(It.IsAny<Stock>())).Returns(new Stock());

            var handler = new CreateStockCommandHandler(_stockRepository.Object, _mediator.Object);
            var x = await handler.Handle(command, new System.Threading.CancellationToken());

            x.Success.Should().BeFalse();
            x.Message.Should().Be(Messages.NameAlreadyExist);
        }

        [Test]
        public async Task Stock_UpdateCommand_Success()
        {
            //Arrange
            var command = new UpdateStockCommand();
            //command.StockName = "test";

            _stockRepository.Setup(x => x.GetAsync(It.IsAny<Expression<Func<Stock, bool>>>()))
                        .ReturnsAsync(new Stock() { /*TODO:propertyler buraya yazılacak StockId = 1, StockName = "deneme"*/ });

            _stockRepository.Setup(x => x.Update(It.IsAny<Stock>())).Returns(new Stock());

            var handler = new UpdateStockCommandHandler(_stockRepository.Object, _mediator.Object);
            var x = await handler.Handle(command, new System.Threading.CancellationToken());

            _stockRepository.Verify(x => x.SaveChangesAsync());
            x.Success.Should().BeTrue();
            x.Message.Should().Be(Messages.Updated);
        }

        [Test]
        public async Task Stock_DeleteCommand_Success()
        {
            //Arrange
            var command = new DeleteStockCommand();

            _stockRepository.Setup(x => x.GetAsync(It.IsAny<Expression<Func<Stock, bool>>>()))
                        .ReturnsAsync(new Stock() { /*TODO:propertyler buraya yazılacak StockId = 1, StockName = "deneme"*/});

            _stockRepository.Setup(x => x.Delete(It.IsAny<Stock>()));

            var handler = new DeleteStockCommandHandler(_stockRepository.Object, _mediator.Object);
            var x = await handler.Handle(command, new System.Threading.CancellationToken());

            _stockRepository.Verify(x => x.SaveChangesAsync());
            x.Success.Should().BeTrue();
            x.Message.Should().Be(Messages.Deleted);
        }
    }
}

