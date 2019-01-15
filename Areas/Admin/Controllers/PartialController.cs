using System.Web.Mvc;

namespace LoHoiDaiLuc.Web.Areas.Admin.Controllers
{
    public class PartialController : BaseController
    {
        // GET: Admin/Partial
        public ActionResult Index()
        {
            return View();
        }

        [ChildActionOnly]
        public ActionResult _NavigationTop()
        {
            return PartialView();
        }

        [ChildActionOnly]
        public ActionResult _LeftSide()
        {
            return PartialView();
        }
    }
}