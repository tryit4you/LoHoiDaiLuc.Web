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
    public class ProductCategoryController : BaseController
    {
        private IProductCategoryService _productCategoryService;

        public ProductCategoryController(IProductCategoryService productCategorySevice)
        {
            this._productCategoryService = productCategorySevice;
        }

        // GET: Admin/ProductCategory
        public ActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public JsonResult GetAll(string searchstr, int page, int pageSize = 5, int option = 2)
        {
            var model = _productCategoryService.GetAll(searchstr);
            if (option == 1)
                model = model.Where(x => x.Status == true);
            else if (option == 0)
                model = model.Where(x => x.Status == false);

            var data = model.OrderByDescending(x => x.CreatedDate).Skip((page - 1) * pageSize).Take(pageSize);

            int totalCount = model.Count();

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
            var target = _productCategoryService.Delete(id);
            _productCategoryService.Save();
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
                _productCategoryService.Delete(id);
            }
            _productCategoryService.Save();
            return Json(new
            {
                message = ResultState.Delete_SUCCESS + count + " bản ghi"
            }, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public ActionResult GetDetail(int id)
        {
            var model = _productCategoryService.GetById(id);
            return Json(new
            {
                status = true,
                data = model
            }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult Put(string productCategory)
        {
            string message = string.Empty;
            var jsonObj = new JavaScriptSerializer();
            var model = jsonObj.Deserialize<ProductCategoryViewModel>(productCategory);

            var check = _productCategoryService.GetById(model.ID);
            if (check != null)
            {
                check.UpdateProductCategory(model);
                _productCategoryService.Update(check);
                _productCategoryService.Save();
                message = ResultState.Update_SUCCESS;
            }
            return Json(new
            {
                message = message,
                status = true,
            }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult Post(string productCategory)
        {
            string message = string.Empty;
            var jsonObj = new JavaScriptSerializer();
            var model = jsonObj.Deserialize<ProductCategory>(productCategory);
            model.CreatedDate = DateTime.Now;
            _productCategoryService.Add(model);
            _productCategoryService.Save();

            message = ResultState.Add_SUCCESS;
            return Json(new
            {
                message = message,
                status = true,
            }, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult LoadParentList()
        {
            var model = _productCategoryService.GetAll();
            var data = Mapper.Map<IEnumerable<ProductCategory>, IEnumerable<ProductCategoryViewModel>>(model);
            return Json(new
            {
                data = data
            }, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult CheckExist(string name)
        {
            var result = true;
            var data = _productCategoryService.GetByName(name);
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
            var target = _productCategoryService.GetById(id);
            target.Status = !target.Status;
            _productCategoryService.Save();
            return Json(new
            {
                status = target.Status
            }, JsonRequestBehavior.AllowGet);
        }
    }
}