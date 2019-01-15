using AutoMapper;
using LoHoiDaiLuc.Models.Models;
using LoHoiDaiLuc.Services;
using LoHoiDaiLuc.Web.Infrastructure.Extensions;
using LoHoiDaiLuc.Web.Models;
using System.Linq;
using System.Web.Mvc;

namespace LoHoiDaiLuc.Web.Areas.Admin.Controllers
{
    public class FooterController : BaseController
    {
        private IFooterService _FooterService;

        public FooterController(IFooterService FooterService)
        {
            this._FooterService = FooterService;
        }

        [HttpGet]
        public ActionResult GetDetail(string id)
        {
            var model = _FooterService.GetById(id);
            return Json(new
            {
                status = true,
                data = model
            }, JsonRequestBehavior.AllowGet);
        }

        public ActionResult Index()
        {
            var model = _FooterService.GetAll().SingleOrDefault();
            var data = Mapper.Map<Footer, FooterViewModel>(model);

            return View(data);
        }

        [HttpGet]
        public ActionResult Put(string id)
        {
            var model = _FooterService.GetById(id);
            var footerModel = Mapper.Map<Footer, FooterViewModel>(model);
            return View(footerModel);
        }

        [HttpPost]
        [ValidateInput(false)]
        public ActionResult Put(FooterViewModel footer)
        {
            if (ModelState.IsValid)
            {
                var model = _FooterService.GetById(footer.ID);
                if (model == null)
                {
                    ModelState.AddModelError("", "Không tìm thấy nội dung");
                }
                model.UpdateFooter(footer);
                _FooterService.Update(model);
                _FooterService.Save();
                return RedirectToAction("Index");
            }
            else
            {
                ModelState.AddModelError("", "Cập nhật không thành công");
            }
            return View();
        }
    }
}