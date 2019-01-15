using AutoMapper;
using LoHoiDaiLuc.Common;
using LoHoiDaiLuc.Models.Models;
using LoHoiDaiLuc.Services;
using LoHoiDaiLuc.Web.Infrastructure.Extensions;
using LoHoiDaiLuc.Web.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using System.Web.Script.Serialization;

namespace LoHoiDaiLuc.Web.Areas.Admin.Controllers
{
    public class MenuGroupController : BaseController
    {
        private IMenuGroupService _menuGroupService;

        public MenuGroupController(IMenuGroupService menuGroupService)
        {
            this._menuGroupService = menuGroupService;
        }

        [HttpGet]
        public JsonResult CheckExist(string name)
        {
            var result = true;
            var data = _menuGroupService.GetByName(name);
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
            var target = _menuGroupService.Delete(id);
            _menuGroupService.Save();
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
                _menuGroupService.Delete(id);
            }
            _menuGroupService.Save();
            return Json(new
            {
                message = ResultState.Delete_SUCCESS + count + " bản ghi"
            }, JsonRequestBehavior.AllowGet);
        }

        // GET: Admin/Menu
        [HttpGet]
        public JsonResult GetAll(string searchstr, int page, int pageSize = 5)
        {
            var model = _menuGroupService.GetAll(searchstr);
            var menuList = Mapper.Map<IEnumerable<MenuGroup>, IEnumerable<MenuGroupViewModel>>(model);
            var data = menuList.
                Skip((page - 1) * pageSize).
                Take(pageSize);
            int totalRow = menuList.Count();

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
            var model = _menuGroupService.GetById(id);
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
        public JsonResult Post(string menuGroup)
        {
            string message = string.Empty;
            var jsonObj = new JavaScriptSerializer();
            var model = jsonObj.Deserialize<MenuGroup>(menuGroup);

            _menuGroupService.Add(model);
            _menuGroupService.Save();
            message = ResultState.Add_SUCCESS;
            return Json(new
            {
                message = message,
                status = true,
            }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult Put(string menuGroup)
        {
            string message = string.Empty;
            var jsonObj = new JavaScriptSerializer();
            var model = jsonObj.Deserialize<MenuGroupViewModel>(menuGroup);

            var check = _menuGroupService.GetById(model.ID);
            if (check != null)
            {
                check.UpdateMenuGroup(model);
                _menuGroupService.Update(check);
                _menuGroupService.Save();
                message = ResultState.Update_SUCCESS;
            }
            return Json(new
            {
                message = message,
                status = true,
            }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult ChangeStatus(int id)
        {
            var target = _menuGroupService.GetById(id);
            target.Status = !target.Status;
            _menuGroupService.Save();
            return Json(new
            {
                status = target.Status
            }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult UpdateOrder(int id, int DisplayOrder)
        {
            var message = string.Empty;
            var status = false;
            var model = _menuGroupService.GetById(id);
            model.DisplayOrder = DisplayOrder;
            try
            {
                _menuGroupService.Save();
                message = ResultState.Update_SUCCESS;
                status = true;
            }
            catch (Exception)
            {
                message = ResultState.Update_FALSE;
            }
            return Json(new
            {
                message = message,
                result = status
            }, JsonRequestBehavior.AllowGet);
        }
    }
}