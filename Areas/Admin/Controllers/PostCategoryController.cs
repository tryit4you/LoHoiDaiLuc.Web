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
    public class PostCategoryController : BaseController
    {
        private IPostCategoryService _postCategoryService;

        // GET: Admin/Post
        public ActionResult Index()
        {
            return View();
        }

        public PostCategoryController(IPostCategoryService postCategoryService)
        {
            this._postCategoryService = postCategoryService;
        }

        [HttpGet]
        public JsonResult GetAll(string searchstr, int page, int pageSize = 5, int option = 2)
        {
            var model = _postCategoryService.GetAll(searchstr);
            if (option == 1)
                model = model.Where(x => x.Status == true);
            else if (option == 0)
                model = model.Where(x => x.Status == false);

            var listCategory = Mapper.Map<IEnumerable<PostCategory>, IEnumerable<PostCategoryViewModel>>(model);
            var data = listCategory.OrderByDescending(x => x.CreatedDate).Skip((page - 1) * pageSize).Take(pageSize);

            int totalCount = listCategory.Count();

            return Json(new
            {
                data = data,
                status = true,
                total = totalCount
            }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult Delete(int id)
        {
            var target = _postCategoryService.Delete(id);
            _postCategoryService.Save();
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
                _postCategoryService.Delete(id);
            }
            _postCategoryService.Save();
            return Json(new
            {
                message = ResultState.Delete_SUCCESS + count + " bản ghi"
            }, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public ActionResult GetDetail(int id)
        {
            var model = _postCategoryService.GetById(id);
            var postCategory = Mapper.Map<PostCategory, PostCategoryViewModel>(model);
            return Json(new
            {
                status = true,
                data = postCategory
            }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult Put(string postCategoryVm)
        {
            string message = string.Empty;
            var jsonObj = new JavaScriptSerializer();
            var model = jsonObj.Deserialize<PostCategoryViewModel>(postCategoryVm);

            var check = _postCategoryService.GetById(model.ID);

            if (check != null)
            {
                check.UpdatePostCategory(model);
                _postCategoryService.Update(check);
                _postCategoryService.Save();
                message = ResultState.Update_SUCCESS;
            }
            return Json(new
            {
                message = message,
                status = true,
            }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult Post(string postCategory)
        {
            string message = string.Empty;
            var jsonObj = new JavaScriptSerializer();
            var model = jsonObj.Deserialize<PostCategory>(postCategory);
            model.CreatedDate = DateTime.Now;

            _postCategoryService.Add(model);

            _postCategoryService.Save();

            message = ResultState.Add_SUCCESS;
            return Json(new
            {
                message = message,
                status = true,
            }, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult CheckExist(string name)
        {
            var result = true;
            var data = _postCategoryService.GetByName(name);
            if (data != null)
                result = false;
            return Json(new
            {
                result = result
            }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult ChangeStatus(int id)
        {
            var target = _postCategoryService.GetById(id);
            target.Status = !target.Status;
            _postCategoryService.Save();
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
            var model = _postCategoryService.GetById(id);
            model.DisplayOrder = DisplayOrder;
            try
            {
                _postCategoryService.Save();
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