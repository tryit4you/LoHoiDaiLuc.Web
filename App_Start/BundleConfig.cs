using System.Web.Optimization;

namespace LoHoiDaiLuc.Web
{
    public class BundleConfig
    {
        public static void RegisterBundles(BundleCollection bundles)
        {
            #region bundleClient

            bundles.Add(new ScriptBundle("~/js/jquery").Include(
                "~/Assets/Clients/js/jquery-3.2.1.min.js",
                "~/Assets/Clients/js/jquery-ui-1.12.1.min.js"
                ));

            bundles.Add(new ScriptBundle("~/js/lohoidailuc").Include(
                   "~/Assets/Clients/js/movetop.js",
                  "~/Assets/Clients/js/jquery-1.11.1.js",
                   "~/Assets/Clients/js/slider.js",
                   "~/Assets/Clients/js/bootstrap.min.js",
                   "~/Assets/Clients/js/common.js"

                ));

            bundles.Add(new StyleBundle("~/css/lohoidailuc")
                .Include("~/Assets/Clients/css/bootstrap.css", new CssRewriteUrlTransform())

                .Include("~/Content/Clients/themes/base/jquery-ui.css", new CssRewriteUrlTransform())
                .Include("~/Assets/Clients/css/hover.css", new CssRewriteUrlTransform())
                .Include("~/Assets/Clients/css/style.css", new CssRewriteUrlTransform())
                );

            #endregion bundleClient

            #region bundelAdmin

            bundles.Add(new ScriptBundle("~/js/admin/jquery")
                .Include("~/Assets/Admin/dist/js/plugins/jquery-3.2.1.min.js"));

            bundles.Add(new ScriptBundle("~/js/admin/mustache")
                .Include("~/Assets/Admin/dist/js/plugins/mustache.min.js")
                .Include("~/Assets/Admin/dist/js/plugins/pagination.js"));

            bundles.Add(new ScriptBundle("~/js/admin/moment")
                .Include("~/Assets/Admin/dist/js/plugins/moment.min.js")
                .Include("~/Assets/Admin/dist/js/plugins/bootstrap-datetimepicker.js")
                .Include("~/Assets/Admin//dist/js/plugins/locale.js")
                .Include("~/Assets/Admin/dist/js/plugins/datetimeCustom.js"));

            bundles.Add(new ScriptBundle("~/js/admin/common")
                .Include("~/Assets/Admin/dist/js/controller/commonController.js"));

            bundles.Add(new ScriptBundle("~/js/admin/lohoidailuc")
                .Include("~/Assets/Admin/dist/js/plugins/bootstrap.min.js")
                .Include("~/Assets/Admin/bower_components/jquery-ui/jquery-ui.min.js")

                .Include("~/Assets/Admin/dist/js/plugins/bootbox.min.js")
                .Include("~/Assets/Admin/dist/js/plugins/jquery.unobtrusive-ajax.min.js")
                .Include("~/Assets/Admin/dist/js/plugins/jquery-ui-1.12.1.min.js")
                .Include("~/Assets/Admin/dist/js/plugins/jquery.validate.min.js")
                .Include("~/Assets/Admin/dist/js/plugins/adminlte.min.js")

                .Include("~/Assets/Admin/dist/js/plugins/toastr/toastr.js")

                ///

                );
            bundles.Add(new StyleBundle("~/css/admin/style")
                .Include("~/Assets/Admin/bower_components/bootstrap/dist/css/bootstrap.min.css", new CssRewriteUrlTransform())
                .Include("~/Assets/Admin/themes/base/jquery-ui.min.css")
                .Include("~/Assets/Admin/dist/css/bootstrap-datetimepicker.min.css", new CssRewriteUrlTransform())
                .Include("~/Assets/Admin/bower_components/font-awesome/css/font-awesome.min.css", new CssRewriteUrlTransform())
                .Include("~/Assets/Admin/bower_components/Ionicons/css/ionicons.min.css", new CssRewriteUrlTransform())
                .Include("~/Assets/Admin/dist/css/AdminLTE.css", new CssRewriteUrlTransform())
                .Include("~/Assets/Admin/dist/css/skins/_all-skins.min.css", new CssRewriteUrlTransform())
                .Include("~/Assets/Admin/dist/js/plugins/toastr/build/toastr.css", new CssRewriteUrlTransform())
                .Include("~/Assets/Admin/dist/css/customStyle.css", new CssRewriteUrlTransform())
                );

            #endregion bundelAdmin

            BundleTable.EnableOptimizations = true;
        }
    }
}