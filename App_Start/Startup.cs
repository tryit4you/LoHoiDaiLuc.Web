using Autofac;
using Autofac.Integration.Mvc;
using LoHoiDaiLuc.Data;
using LoHoiDaiLuc.Data.Infrastructure;
using LoHoiDaiLuc.Data.Repositories;
using LoHoiDaiLuc.Services;
using LoHoiDaiLuc.Web.Models.Identity;
using Microsoft.Owin;
using Owin;
using System.Reflection;
using System.Web.Mvc;

[assembly: OwinStartup(typeof(LoHoiDaiLuc.Web.App_Start.Startup))]

namespace LoHoiDaiLuc.Web.App_Start
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
            AutofacConfig(app);
        }

        private void AutofacConfig(IAppBuilder app)
        {
            var builder = new ContainerBuilder();
            builder.RegisterControllers(Assembly.GetExecutingAssembly());

            builder.RegisterType<UnitOfWork>().As<IUnitOfWork>().InstancePerRequest();
            builder.RegisterType<DbFactory>().As<IDbFactory>().InstancePerRequest();

            builder.RegisterType<LoHoiDaiLucDbContext>().AsSelf().InstancePerRequest();
            builder.RegisterType<LoHoiDaiLucIdentityContext>().AsSelf().InstancePerRequest();
            //repository
            builder.RegisterAssemblyTypes(typeof(ProductRepository).Assembly)
                .Where(t => t.Name.EndsWith("Repository"))
                .AsImplementedInterfaces().InstancePerRequest();

            //service

            builder.RegisterAssemblyTypes(typeof(ProductService).Assembly)
                .Where(t => t.Name.EndsWith("Service"))
                .AsImplementedInterfaces().InstancePerRequest();
            Autofac.IContainer container = builder.Build();
            DependencyResolver.SetResolver(new AutofacDependencyResolver(container));
        }
    }
}