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

namespace LoHoiDaiLuc.Web.Areas.Admin.Controllers
{
    public class ProductController : BaseController
    {
        private IProductService _productService;
        private IProductCategoryService _productCategoryService;

        public ProductController(IProductService productService, IProductCategoryService productCategoryService)
        {
            this._productService = productService;
            this._productCategoryService = productCategoryService;
        }

        // GET: Admin/Product
        public ActionResult Index()
        {
            return View();
        }

        private Object getListCategory()
        {
            var listProductCategory = _productCategoryService.GetAll();
            try
            {
                var loadCateName = (from c in listProductCategory
                                    where c.Status == true
                                    orderby c.cateName ascending
                                    select new
                                    {
                                        c.cateName,
                                        c.ID
                                    }).ToList();
                return loadCateName;
            }
            catch (Exception)
            {
                Dictionary<int, string> dictionary = new Dictionary<int, string>();
                dictionary.Add(0, "Không có bản ghi");
                return dictionary;
            }
        }

        [HttpGet]
        public JsonResult GetAll(string searchstr, int page, int pageSize = 5, int option = 2)
        {
            var productModel = _productService.GetAll(searchstr);
            if (option == 1)
            {
                productModel = productModel.Where(x => x.Status == true);
            }
            else if (option == 0)
            {
                productModel = productModel.Where(x => x.Status == false);
            }
            var categoryModel = _productCategoryService.GetAll();
            var listProductbyCate = from p in productModel
                                    join c in categoryModel on p.CategoryID equals c.ID
                                    select new
                                    {
                                        p.ID,
                                        p.Name,
                                        p.Image,
                                        p.Price,
                                        p.CreatedDate,
                                        p.Status,
                                        p.HomeFlag,
                                        c.cateName
                                    };

            var data = listProductbyCate.OrderByDescending(x => x.CreatedDate).Skip((page - 1) * pageSize).Take(pageSize);

            int totalCount = listProductbyCate.Count();

            return Json(new
            {
                data = data,
                status = true,
                total = totalCount
            }, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public ActionResult Post()
        {
            ViewBag.ProductCategoryName = getListCategory();
            return View();
        }

        [HttpPost]
        [ValidateInput(false)]
        public ActionResult Post(Product product)
        {
            if (ModelState.IsValid)
            {
                product.CreatedDate = DateTime.Now;
                _productService.Add(product);
                _productService.Save();
                return RedirectToAction("Index", "Product");
            }
            else
            {
                ModelState.AddModelError("", "Thêm mới không thành công!");
            }

            ViewBag.ProductCategoryName = getListCategory();
            return View(product);
        }

        [HttpGet]
        public ActionResult GetDetail(int id)
        {
            var model = _productService.GetById(id);
            var data = Mapper.Map<Product, ProductViewModel>(model);
            return Json(new
            {
                status = true,
                data = data
            }, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public ActionResult Put(int id)
        {
            var productModel = _productService.GetById(id);
            var productDetail = Mapper.Map<Product, ProductViewModel>(productModel);
            ViewBag.ProductCategoryName = getListCategory();
            return View(productDetail);
        }

        [HttpPost]
        [ValidateInput(false)]
        public ActionResult Put(ProductViewModel productVm)
        {
            var message = string.Empty;
            if (ModelState.IsValid)
            {
                var product = _productService.GetById(productVm.ID);
                if (product != null)
                {
                    product.UpdateProduct(productVm);
                    _productService.Update(product);
                    _productService.Save();
                    message = ResultState.Update_SUCCESS;
                    return RedirectToAction("Index", "Product");
                }
                else
                {
                    ModelState.AddModelError("", "Không tìm thấy sản phẩm nào!");
                }
            }
            else
            {
                ModelState.AddModelError("", ResultState.Update_FALSE);
            }
            ViewBag.ProductCategoryName = getListCategory();
            return View(productVm);
        }

        [HttpPost]
        public JsonResult delete(int id)
        {
            string message = string.Empty;
            bool status = false;
            var result = _productService.Delete(id);
            if (result != null)
            {
                message = ResultState.Delete_SUCCESS;
                status = true;
                _productService.Save();
            }
            else
                message = ResultState.Delete_FALSE;
            return Json(new
            {
                status = status,
                message = message
            }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult DeleteMul(int[] ids)
        {
            var count = ids.Count();
            foreach (var id in ids)
            {
                _productService.Delete(id);
            }
            _productService.Save();
            return Json(new
            {
                message = ResultState.Delete_SUCCESS + count + " bản ghi"
            }, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult CheckExist(string name)
        {
            var result = true;
            var data = _productService.GetByName(name);
            if (data != null)
                result = false;
            return Json(new
            {
                result = result
            }, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult ChangeStatus(int id)
        {
            var target = _productService.GetById(id);
            target.Status = !target.Status;
            _productCategoryService.Save();
            return Json(new
            {
                status = target.Status
            }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult ChangeHomeFlag(int id)
        {
            var target = _productService.GetById(id);
            target.HomeFlag = !target.HomeFlag;
            _productCategoryService.Save();
            return Json(new
            {
                status = target.HomeFlag
            }, JsonRequestBehavior.AllowGet);
        }
    }
}