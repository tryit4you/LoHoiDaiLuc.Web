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
    public class VideoController : BaseController
    {
        // GET: Admin/Video

        private IVideoService _VideoService;

        public VideoController(IVideoService VideoService)
        {
            this._VideoService = VideoService;
        }

        [HttpPost]
        public JsonResult ChangeStatus(int id)
        {
            var target = _VideoService.GetById(id);
            target.Status = !target.Status;
            _VideoService.Save();
            return Json(new
            {
                status = target.Status
            }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult HomeFlagStatus(int id)
        {
            var target = _VideoService.GetById(id);
            target.HomeFlag = !target.HomeFlag;
            _VideoService.Save();
            return Json(new
            {
                status = target.HomeFlag
            }, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult CheckExist(string name)
        {
            var result = true;
            var data = _VideoService.GetByName(name);
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
            var target = _VideoService.Delete(id);
            _VideoService.Save();
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
                _VideoService.Delete(id);
            }
            _VideoService.Save();
            return Json(new
            {
                message = ResultState.Delete_SUCCESS + count + " bản ghi"
            }, JsonRequestBehavior.AllowGet);
        }

        // GET: Admin/Video
        [HttpGet]
        public JsonResult GetAll(string searchstr, int page, int pageSize = 5)
        {
            var model = _VideoService.GetAll(searchstr);
            var VideoList = Mapper.Map<IEnumerable<Video>, IEnumerable<VideoViewModel>>(model);
            var data = VideoList.
                Skip((page - 1) * pageSize).
                Take(pageSize);
            int totalRow = VideoList.Count();

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
            var model = _VideoService.GetById(id);
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
        public JsonResult Post(string Video)
        {
            string message = string.Empty;
            var jsonObj = new JavaScriptSerializer();
            var model = jsonObj.Deserialize<Video>(Video);

            _VideoService.Add(model);
            _VideoService.Save();
            message = ResultState.Add_SUCCESS;
            return Json(new
            {
                message = message,
                status = true,
            }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult Put(string Video)
        {
            string message = string.Empty;
            var jsonObj = new JavaScriptSerializer();
            var model = jsonObj.Deserialize<VideoViewModel>(Video);

            var check = _VideoService.GetById(model.ID);
            if (check != null)
            {
                check.UpdateVideo(model);
                _VideoService.Update(check);
                _VideoService.Save();
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