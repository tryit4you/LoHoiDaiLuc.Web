using System.Web.Mvc;
using System.Web.Routing;

namespace LoHoiDaiLuc.Web
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");
            routes.IgnoreRoute("{*botdetect}",
      new { botdetect = @"(.*)BotDetectCaptcha\.ashx" });
            routes.MapRoute(
               name: "timkiem",
               url: "tim-kiem",
               defaults: new { controller = "Home", action = "Search", id = UrlParameter.Optional }
            , namespaces: new[] { "LohoiDaiLuc.Web.Controllers" }
               );

            routes.MapRoute(
               name: "tatcabaiviet",
               url: "tin-tuc-tu-lieu",
               defaults: new { controller = "Post", action = "getAllPost", id = UrlParameter.Optional }
            , namespaces: new[] { "LohoiDaiLuc.Web.Controllers" }
               );

            routes.MapRoute(
               name: "danhsachbaiviet",
               url: "bai-viet/{alias}-pos-{cateId}",
               defaults: new { controller = "Post", action = "GetPostByCategory", cateId = UrlParameter.Optional }
            , namespaces: new[] { "LohoiDaiLuc.Web.Controllers" }
               );
            routes.MapRoute(
           name: "taglist",
           url: "tags/{tagID}",
           defaults: new { controller = "Product", action = "ProductByTag", tagID = UrlParameter.Optional }
        , namespaces: new[] { "LohoiDaiLuc.Web.Controllers" }
           );
            routes.MapRoute(
             name: "noidungbaiviet",
             url: "bai-viet/{alias}-{id}",
             defaults: new { controller = "Post", action = "GetDetail", id = UrlParameter.Optional }
          , namespaces: new[] { "LohoiDaiLuc.Web.Controllers" }
             );

            routes.MapRoute(
               name: "tatcalohoi",
               url: "lo-hoi",
               defaults: new { controller = "Product", action = "LoadAllProduct", id = UrlParameter.Optional }
            , namespaces: new[] { "LohoiDaiLuc.Web.Controllers" }
               );

            routes.MapRoute(
              name: "danhmucsanpham",
              url: "lo-hoi/{cateAlias}-pc-{cateId}",
              defaults: new { controller = "Product", action = "LoadProductByCategory", cateId = UrlParameter.Optional }
           , namespaces: new[] { "LohoiDaiLuc.Web.Controllers" }
              );

            routes.MapRoute(
              name: "chitietsanpham",
              url: "lo-hoi/{alias}-{id}",
              defaults: new { controller = "Product", action = "GetProductDetail", id = UrlParameter.Optional }
            , namespaces: new[] { "LohoiDaiLuc.Web.Controllers" }
              );

            routes.MapRoute(
                name: "trang",
                url: "trang",
                defaults: new { controller = "Home", action = "Page", id = UrlParameter.Optional }
             , namespaces: new[] { "LohoiDaiLuc.Web.Controllers" }
                );

            routes.MapRoute(
                name: "Default",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "Home", action = "Index", id = UrlParameter.Optional }
                , namespaces: new[] { "LohoiDaiLuc.Web.Controllers" }
            );
        }
    }
}