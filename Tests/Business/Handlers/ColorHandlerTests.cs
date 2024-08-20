
using Business.Handlers.Colors.Queries;
using DataAccess.Abstract;
using Moq;
using NUnit.Framework;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading.Tasks;
using static Business.Handlers.Colors.Queries.GetColorQuery;
using Entities.Concrete;
using static Business.Handlers.Colors.Queries.GetColorsQuery;
using static Business.Handlers.Colors.Commands.CreateColorCommand;
using Business.Handlers.Colors.Commands;
using Business.Constants;
using static Business.Handlers.Colors.Commands.UpdateColorCommand;
using static Business.Handlers.Colors.Commands.DeleteColorCommand;
using MediatR;
using System.Linq;
using FluentAssertions;


namespace Tests.Business.HandlersTest
{
    [TestFixture]
    public class ColorHandlerTests
    {
        Mock<IColorRepository> _colorRepository;
        Mock<IMediator> _mediator;
        [SetUp]
        public void Setup()
        {
            _colorRepository = new Mock<IColorRepository>();
            _mediator = new Mock<IMediator>();
        }

        [Test]
        public async Task Color_GetQuery_Success()
        {
            //Arrange
            var query = new GetColorQuery();

            _colorRepository.Setup(x => x.GetAsync(It.IsAny<Expression<Func<Color, bool>>>())).ReturnsAsync(new Color()
//propertyler buraya yazılacak
//{																		
//ColorId = 1,
//ColorName = "Test"
//}
);

            var handler = new GetColorQueryHandler(_colorRepository.Object, _mediator.Object);

            //Act
            var x = await handler.Handle(query, new System.Threading.CancellationToken());

            //Asset
            x.Success.Should().BeTrue();
            //x.Data.ColorId.Should().Be(1);

        }

        [Test]
        public async Task Color_GetQueries_Success()
        {
            //Arrange
            var query = new GetColorsQuery();

            _colorRepository.Setup(x => x.GetListAsync(It.IsAny<Expression<Func<Color, bool>>>()))
                        .ReturnsAsync(new List<Color> { new Color() { /*TODO:propertyler buraya yazılacak ColorId = 1, ColorName = "test"*/ } });

            var handler = new GetColorsQueryHandler(_colorRepository.Object, _mediator.Object);

            //Act
            var x = await handler.Handle(query, new System.Threading.CancellationToken());

            //Asset
            x.Success.Should().BeTrue();
            ((List<Color>)x.Data).Count.Should().BeGreaterThan(1);

        }

        [Test]
        public async Task Color_CreateCommand_Success()
        {
            Color rt = null;
            //Arrange
            var command = new CreateColorCommand();
            //propertyler buraya yazılacak
            //command.ColorName = "deneme";

            _colorRepository.Setup(x => x.GetAsync(It.IsAny<Expression<Func<Color, bool>>>()))
                        .ReturnsAsync(rt);

            _colorRepository.Setup(x => x.Add(It.IsAny<Color>())).Returns(new Color());

            var handler = new CreateColorCommandHandler(_colorRepository.Object, _mediator.Object);
            var x = await handler.Handle(command, new System.Threading.CancellationToken());

            _colorRepository.Verify(x => x.SaveChangesAsync());
            x.Success.Should().BeTrue();
            x.Message.Should().Be(Messages.Added);
        }

        [Test]
        public async Task Color_CreateCommand_NameAlreadyExist()
        {
            //Arrange
            var command = new CreateColorCommand();
            //propertyler buraya yazılacak 
            //command.ColorName = "test";

            _colorRepository.Setup(x => x.Query())
                                           .Returns(new List<Color> { new Color() { /*TODO:propertyler buraya yazılacak ColorId = 1, ColorName = "test"*/ } }.AsQueryable());

            _colorRepository.Setup(x => x.Add(It.IsAny<Color>())).Returns(new Color());

            var handler = new CreateColorCommandHandler(_colorRepository.Object, _mediator.Object);
            var x = await handler.Handle(command, new System.Threading.CancellationToken());

            x.Success.Should().BeFalse();
            x.Message.Should().Be(Messages.NameAlreadyExist);
        }

        [Test]
        public async Task Color_UpdateCommand_Success()
        {
            //Arrange
            var command = new UpdateColorCommand();
            //command.ColorName = "test";

            _colorRepository.Setup(x => x.GetAsync(It.IsAny<Expression<Func<Color, bool>>>()))
                        .ReturnsAsync(new Color() { /*TODO:propertyler buraya yazılacak ColorId = 1, ColorName = "deneme"*/ });

            _colorRepository.Setup(x => x.Update(It.IsAny<Color>())).Returns(new Color());

            var handler = new UpdateColorCommandHandler(_colorRepository.Object, _mediator.Object);
            var x = await handler.Handle(command, new System.Threading.CancellationToken());

            _colorRepository.Verify(x => x.SaveChangesAsync());
            x.Success.Should().BeTrue();
            x.Message.Should().Be(Messages.Updated);
        }

        [Test]
        public async Task Color_DeleteCommand_Success()
        {
            //Arrange
            var command = new DeleteColorCommand();

            _colorRepository.Setup(x => x.GetAsync(It.IsAny<Expression<Func<Color, bool>>>()))
                        .ReturnsAsync(new Color() { /*TODO:propertyler buraya yazılacak ColorId = 1, ColorName = "deneme"*/});

            _colorRepository.Setup(x => x.Delete(It.IsAny<Color>()));

            var handler = new DeleteColorCommandHandler(_colorRepository.Object, _mediator.Object);
            var x = await handler.Handle(command, new System.Threading.CancellationToken());

            _colorRepository.Verify(x => x.SaveChangesAsync());
            x.Success.Should().BeTrue();
            x.Message.Should().Be(Messages.Deleted);
        }
    }
}

