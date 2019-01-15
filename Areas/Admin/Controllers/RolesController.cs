using LoHoiDaiLuc.Common;
using LoHoiDaiLuc.Web.Models.Identity;
using System.Linq;
using System.Web.Mvc;
using System.Web.Script.Serialization;

namespace LoHoiDaiLuc.Web.Areas.Admin.Controllers
{
    public class RolesController : BaseController
    {
        private LoHoiDaiLucIdentityContext _idenityContext;

        public RolesController(LoHoiDaiLucIdentityContext identityContext)
        {
            this._idenityContext = identityContext;
        }

        public ActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public JsonResult GetAll(int page, int pageSize = 5)
        {
            var rolesModel = _idenityContext.AspNetRoles.ToList();

            int totalCount = rolesModel.Count();

            return Json(new
            {
                data = rolesModel,
                status = true,
                total = totalCount
            }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult Post(string role)
        {
            string message = string.Empty;
            var model = new JavaScriptSerializer().Deserialize<AspNetRole>(role);

            var result = _idenityContext.AspNetRoles.Add(model);
            _idenityContext.SaveChanges();
            message = ResultState.Add_SUCCESS;
            return Json(new
            {
                status = result,
                message = message
            });
        }

        [HttpGet]
        public JsonResult GetDetail(string id)
        {
            var model = _idenityContext.AspNetRoles.Find(id);
            return Json(new
            {
                status = true,
                data = model
            }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult Put(string model)
        {
            string message = string.Empty;
            var role = new JavaScriptSerializer().Deserialize<AspNetRole>(model);
            var roles = _idenityContext.AspNetRoles.Find(role.Id);
            roles.Name = role.Name;
            roles.Id = role.Id;
            _idenityContext.SaveChanges();
            message = ResultState.Update_SUCCESS;
            return Json(new
            {
                status = true,
                message = message
            }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult delete(string id)
        {
            string message = string.Empty;
            var role = _idenityContext.AspNetRoles.Find(id);
            _idenityContext.AspNetRoles.Remove(role);

            message = ResultState.Delete_SUCCESS;
            _idenityContext.SaveChanges();

            return Json(new
            {
                status = true,
                message = message
            }, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult CheckExist(string name)
        {
            var result = true;
            var data = _idenityContext.AspNetRoles.Where(x => x.Id == name).SingleOrDefault();
            if (data != null)
                result = false;
            return Json(new
            {
                result = result
            }, JsonRequestBehavior.AllowGet);
        }
    }
}