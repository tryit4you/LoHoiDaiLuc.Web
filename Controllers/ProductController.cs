using AutoMapper;
using LoHoiDaiLuc.Common;
using LoHoiDaiLuc.Models.Models;
using LoHoiDaiLuc.Services;
using LoHoiDaiLuc.Web.Infrastructure.core;
using LoHoiDaiLuc.Web.Models;
using PagedList;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace LoHoiDaiLuc.Web.Controllers
{
    public class ProductController : Controller
    {
        IProductService _productService;
        IProductCategoryService _productCategoryService;
        public ProductController(IProductService productService, IProductCategoryService productCategoryService)
        {
            this._productService = productService;
            this._productCategoryService = productCategoryService;
        }
        // GET: Product
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult ProductByTag(string tagID, int? page=1)
        {
            int pageNumber = (page ?? 1);
            int pageSize = ConfigHelper.getByKey("pageSize");
            var productModel = _productService.GetListProductByTag(tagID);
            var productList = Mapper.Map<IEnumerable<Product>, IEnumerable<ProductViewModel>>(productModel);

            var cateModel = _productCategoryService.GetAll();
            var productCategoryList = Mapper.Map<IEnumerable<ProductCategory>, IEnumerable<ProductCategoryViewModel>>(cateModel);
            ViewBag.ProductCategory = productCategoryList;

            return View(productList.ToPagedList(pageNumber,ConfigHelper.getByKey("pageSize")));
        }

        [ChildActionOnly]
        public ActionResult productAtHome()
        {
            var model = _productService.GetAll().OrderBy(x => x.CreatedDate)
                .Where(x => x.HomeFlag == true && x.Status == true).Take(int.Parse(ConfigHelper.productItem("ProductItem"))).ToList();
            var productList = Mapper.Map<IEnumerable<Product>, IEnumerable<ProductViewModel>>(model);

            var cateModel = _productCategoryService.GetAll();
            var productCategoryList = Mapper.Map<IEnumerable<ProductCategory>, IEnumerable<ProductCategoryViewModel>>(cateModel);
            ViewBag.ProductCategory = productCategoryList;
            return PartialView(productList);
        }
        public ActionResult LoadAllProduct(int? page)
        {

            int pageNumber = (page ?? 1);
            var productModel = _productService.GetAll();
            var productList = Mapper.Map<IEnumerable<Product>, IEnumerable<ProductViewModel>>(productModel);
            
            return View(productList.ToPagedList(pageNumber, 8));

        }
        public ActionResult LoadProductByCategory(int cateId)
        {

            var model = _productService.GetByParentID(cateId);
            var product = Mapper.Map<Product, ProductViewModel>(model);
            return View(product);
        }
        public ActionResult GetProductDetail(int id)
        {

            var productModel = _productService.GetById(id);
            var productDetail = Mapper.Map<Product, ProductViewModel>(productModel);
            var tagModel = _productService.GetListTagByProductID(id);

            ViewBag.ListTags = Mapper.Map<IEnumerable<Tag>, IEnumerable<TagViewModel>>(tagModel);

            return View(productDetail);
        }
        [ChildActionOnly]
        public ActionResult GetNewProduct()
        {
            var model = _productService.GetAll().OrderBy(x => x.CreatedDate)
                .Where(x=>x.Status == true).Take(10).ToList();
            var productList = Mapper.Map<IEnumerable<Product>, IEnumerable<ProductViewModel>>(model);

            var cateModel = _productCategoryService.GetAll();
            var productCategoryList = Mapper.Map<IEnumerable<ProductCategory>, IEnumerable<ProductCategoryViewModel>>(cateModel);
            ViewBag.ProductCategory = productCategoryList;
            return PartialView(productList);
        }
    }

}