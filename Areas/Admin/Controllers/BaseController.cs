using System.Web.Mvc;

namespace LoHoiDaiLuc.Web.Areas.Admin.Controllers
{
    public class BaseController : Controller
    {
        // GET: Admin/Base
        protected override void OnActionExecuted(ActionExecutedContext filterContext)
        {
            var sess = Session["USER_SESSION"];
            if (sess == null)
            {
                filterContext.Result = new RedirectToRouteResult(new System.Web.Routing.RouteValueDictionary(new
                { Controller = "Account", Action = "Login" }));
            }
            base.OnActionExecuted(filterContext);
        }
    }
}