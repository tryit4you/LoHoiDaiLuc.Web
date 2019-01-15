using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.UI;
using AutoMapper;
using LoHoiDaiLuc.Models.Models;
using LoHoiDaiLuc.Services;
using LoHoiDaiLuc.Web.Models;

namespace LoHoiDaiLuc.Web.Controllers
{
    public class PartialController : Controller
    {
        ICommonService _commonService;

        public PartialController(ICommonService commonService)
        {
            this._commonService = commonService;
        }
        // GET: Partial
        public ActionResult Index()
        {
            return View();
        }
        [ChildActionOnly]
        [OutputCache(Duration = 3600)]
        public ActionResult _header_Contact()
        {
            var model = _commonService.GetContact();
            var contactDetail = Mapper.Map<ContactDetail, ContactDetailViewModel>(model);

            return PartialView(contactDetail);
        }
        [ChildActionOnly]
        public ActionResult _navigation()
        {
            var postCateModel = _commonService.GetAllPostCategory()
                .OrderBy(x => x.DisplayOrder).Where(x => x.Status == true).ToList();

            var productCateModel = _commonService.GetAllProductCategory()
              .OrderBy(x => x.DisplayOrder).Where(x => x.Status == true).ToList();

            var menuGroupModel = _commonService.GetAllMenuGroup()
                .OrderBy(x => x.DisplayOrder).Where(x => x.Status == true).ToList();

            var postCateDetail = Mapper.Map<IEnumerable<PostCategory>, IEnumerable<PostCategoryViewModel>>(postCateModel);
            var productCateDetail = Mapper.Map<IEnumerable<ProductCategory>, IEnumerable<ProductCategoryViewModel>>(productCateModel);
            var menuGroupDetail = Mapper.Map<IEnumerable<MenuGroup>, IEnumerable<MenuGroupViewModel>>(menuGroupModel);

            ViewBag.postCateDetail = postCateDetail;
            ViewBag.productCateDetail = productCateDetail;
            return PartialView(menuGroupDetail);
        }
        [ChildActionOnly]
        public ActionResult _slide()
        {
            var model = _commonService.GetAllSlide()
                .OrderBy(x => x.DisplayOrder)
                .Where(x => x.Status == true).ToList();
            var getslideModel = Mapper.Map<IEnumerable<Slide>, IEnumerable<SlideViewModel>>(model);

            return PartialView(getslideModel);
        }
        [ChildActionOnly]
        public ActionResult _video()
        {
            var model = _commonService.GetVideo();
            var getvideoModel = Mapper.Map<Video, VideoViewModel>(model);
            return View(getvideoModel);

        }
        [ChildActionOnly]
        public ActionResult _footer()
        {
            var model = _commonService.GetFooter();
            var getfooterModel = Mapper.Map<Footer, FooterViewModel>(model);
            return PartialView(getfooterModel);
        }
    }
}