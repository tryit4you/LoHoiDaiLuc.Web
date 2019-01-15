using AutoMapper;
using BotDetect.Web.Mvc;
using LoHoiDaiLuc.Common;
using LoHoiDaiLuc.Models.Models;
using LoHoiDaiLuc.Services;
using LoHoiDaiLuc.Web.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Web.Mvc;

namespace LoHoiDaiLuc.Web.Controllers
{
    public class HomeController : Controller
    {
        private ICommonService _commonService;
        private IProductService _productService;
        private IPostService _postService;
        private IFeedbackService _feedbackService;
        private ISystemConfigService _systemConfigService;
        public HomeController(ICommonService commonService,
            IProductService productService,
            IPostService postService,
            IFeedbackService feedbackService,
            ISystemConfigService systemConfigService)
        {
            this._commonService = commonService;
            this._productService = productService;
            this._postService = postService;
            this._feedbackService = feedbackService;
            this._systemConfigService = systemConfigService;
        }

        // GET: Home
        public ActionResult Index()
        {
            var metakeyword= _commonService.GetSystemConfig("MetaKeyword");
            var metadescription= _commonService.GetSystemConfig("MetaDescription");

            if (metakeyword!=null)
                ViewBag.MetaKeyword = metakeyword;
            else
                ViewBag.MetaKeyword = "Lò hơi nồi hơi uy tín chất lượng";

            if (metadescription != null)
                ViewBag.MetaDescription = metadescription;
            else
                ViewBag.MetaDescription = "Lò hơi nồi hơi uy tín chất lượng";
            return View();
        }

        public ActionResult Contact()
        {
            return View();
        }

        [HttpPost]
        [CaptchaValidation("CaptchaCode", "ExampleCaptcha", "Mã CAPCHA không đúng!")]
        public ActionResult Contact(Feedback model)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    model.CreatedDate = DateTime.Now;
                    var result = _feedbackService.Add(model);
                    _feedbackService.Save();
                    ViewBag.result = "Gửi thông tin thành công!";
                    return View();
                }
                catch (Exception)
                {
                    ViewBag.result = "Gửi thông tin không thành công!";
                    return View();
                }

            }
            else
            {
                ModelState.AddModelError("capchaIsValid", "Mã capcha không đúng!");
                MvcCaptcha.ResetCaptcha("ExampleCaptcha");
            }
            return View();
        }

        public ActionResult Page(string p)
        {
            var model = _commonService.GetPage(p);
            var service = Mapper.Map<Page, PageViewModel>(model);

            return View(service);
        }
      

        [ChildActionOnly]
        public ActionResult getFeaturedNews()
        {
            return PartialView();
        }

        public ActionResult Search( string keyword)
        {
            ViewBag.Keyword = keyword;
            if (!string.IsNullOrEmpty(keyword))
            {
              
                    var productModel = _productService.GetAll(keyword);
                    var productList = Mapper.Map<IEnumerable<Product>, IEnumerable<ProductViewModel>>(productModel);
                    ViewData["ProductModel"] = productList;
                    return View();
              
            }
            return View();
        }

        public JsonResult SearchEngine(string search, int option = 1)
        {
            if (option == 1)
            {
                var productModel = _productService.GetAllByName(search);
                return Json(new
                {
                    data = productModel
                }, JsonRequestBehavior.AllowGet);
            }
            else

           if (option == 2)
            {
                var postModel = _postService.GetAllByName(search);
                return Json(new
                {
                    data = postModel
                }, JsonRequestBehavior.AllowGet);
            }

            return Json(new
            {
                data = "Không có dữ liệu"
            }, JsonRequestBehavior.AllowGet);
        }
    }
}