using AutoMapper;
using LoHoiDaiLuc.Common;
using LoHoiDaiLuc.Models.Models;
using LoHoiDaiLuc.Services;
using LoHoiDaiLuc.Web.Infrastructure.Extensions;
using LoHoiDaiLuc.Web.Models;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using System.Web.Script.Serialization;

namespace LoHoiDaiLuc.Web.Areas.Admin.Controllers
{
    public class ContactController : BaseController
    {
        // GET: Admin/Contact

        private IContactService _ContactService;

        public ContactController(IContactService ContactService)
        {
            this._ContactService = ContactService;
        }

        [HttpPost]
        public JsonResult ChangeStatus(int id)
        {
            var target = _ContactService.GetById(id);
            target.Status = !target.Status;
            _ContactService.Save();
            return Json(new
            {
                status = target.Status
            }, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult CheckExist(string name)
        {
            var result = true;
            var data = _ContactService.GetByName(name);
            if (data != null)
                result = false;
            return Json(new
            {
                result = result
            }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult Delete(int id)
        {
            var target = _ContactService.Delete(id);
            _ContactService.Save();
            return Json(new
            {
                message = ResultState.Delete_SUCCESS
            }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult DeleteMul(int[] ids)
        {
            var count = ids.Count();
            foreach (var id in ids)
            {
                _ContactService.Delete(id);
            }
            _ContactService.Save();
            return Json(new
            {
                message = ResultState.Delete_SUCCESS + count + " bản ghi"
            }, JsonRequestBehavior.AllowGet);
        }

        // GET: Admin/Contact
        [HttpGet]
        public JsonResult GetAll(string searchstr, int page, int pageSize = 5)
        {
            var model = _ContactService.GetAll(searchstr);
            var ContactList = Mapper.Map<IEnumerable<ContactDetail>, IEnumerable<ContactDetailViewModel>>(model);
            var data = ContactList.
                Skip((page - 1) * pageSize).
                Take(pageSize);
            int totalRow = ContactList.Count();

            return Json(new
            {
                data = data,
                total = totalRow,
                status = true
            }, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public ActionResult GetDetail(int id)
        {
            var model = _ContactService.GetById(id);
            return Json(new
            {
                status = true,
                data = model
            }, JsonRequestBehavior.AllowGet);
        }

        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public JsonResult Post(string Contact)
        {
            string message = string.Empty;
            var jsonObj = new JavaScriptSerializer();
            var model = jsonObj.Deserialize<ContactDetail>(Contact);

            _ContactService.Add(model);
            _ContactService.Save();
            message = ResultState.Add_SUCCESS;
            return Json(new
            {
                message = message,
                status = true,
            }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult Put(string Contact)
        {
            string message = string.Empty;
            var jsonObj = new JavaScriptSerializer();
            var model = jsonObj.Deserialize<ContactDetailViewModel>(Contact);

            var check = _ContactService.GetById(model.ID);
            if (check != null)
            {
                check.UpdateContact(model);
                _ContactService.Update(check);
                _ContactService.Save();
                message = ResultState.Update_SUCCESS;
            }
            return Json(new
            {
                message = message,
                status = true,
            }, JsonRequestBehavior.AllowGet);
        }
    }
}