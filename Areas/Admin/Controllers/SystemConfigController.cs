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
    public class SystemConfigController : BaseController
    {
        // GET: Admin/Video

        private ISystemConfigService _systemConfigService;

        public SystemConfigController(ISystemConfigService systemConfigService)
        {
            this._systemConfigService = systemConfigService;
        }

        [HttpGet]
        public JsonResult CheckExist(string code)
        {
            var result = true;
            var data = _systemConfigService.GetByName(code);
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
            var target = _systemConfigService.Delete(id);
            _systemConfigService.Save();
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
                _systemConfigService.Delete(id);
            }
            _systemConfigService.Save();
            return Json(new
            {
                message = ResultState.Delete_SUCCESS + count + " bản ghi"
            }, JsonRequestBehavior.AllowGet);
        }

        // GET: Admin/Video
        [HttpGet]
        public JsonResult GetAll(string searchstr, int page, int pageSize = 5)
        {
            var model = _systemConfigService.GetAll(searchstr);
            var configList = Mapper.Map<IEnumerable<SystemConfig>, IEnumerable<SystemConfigViewModel>>(model);
            var data = configList.
                Skip((page - 1) * pageSize).
                Take(pageSize);
            int totalRow = configList.Count();

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
            var model = _systemConfigService.GetById(id);
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
        public JsonResult Post(string config)
        {
            string message = string.Empty;
            var jsonObj = new JavaScriptSerializer();
            var model = jsonObj.Deserialize<SystemConfig>(config);

            _systemConfigService.Add(model);
            _systemConfigService.Save();
            message = ResultState.Add_SUCCESS;
            return Json(new
            {
                message = message,
                status = true,
            }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult Put(string config)
        {
            string message = string.Empty;
            var jsonObj = new JavaScriptSerializer();
            var model = jsonObj.Deserialize<SystemConfigViewModel>(config);

            var check = _systemConfigService.GetById(model.ID);
            if (check != null)
            {
                check.UpdateSystemConfig(model);
                _systemConfigService.Update(check);
                _systemConfigService.Save();
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