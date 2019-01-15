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
    public class PageController : BaseController
    {
        private IPageService _pageService;

        public PageController(IPageService pageService)
        {
            this._pageService = pageService;
        }

        // GET: Admin/Post
        public ActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public JsonResult GetAll(string searchstr, int page, int pageSize = 5, int option = 2)
        {
            var pageModel = _pageService.GetAll(searchstr).OrderByDescending(x => x.CreatedDate).ToList();
            if (option == 1)
                pageModel = pageModel.Where(x => x.Status == true).ToList();
            else if (option == 0)
                pageModel = pageModel.Where(x => x.Status == false).ToList();
            var listPost = Mapper.Map<IEnumerable<Page>, IEnumerable<PageViewModel>>(pageModel);

            var data = listPost.Skip((page - 1) * pageSize).Take(pageSize);

            int totalCount = listPost.Count();

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
            return View();
        }

        [HttpPost]
        [ValidateInput(false)]
        public ActionResult Post(Page page)
        {
            if (ModelState.IsValid)
            {
                page.CreatedDate = DateTime.Now;
                _pageService.Add(page);
                _pageService.Save();
                return RedirectToAction("Index", "Page");
            }
            else
            {
                ModelState.AddModelError("", ResultState.Add_FALSE);
            }

            return View(page);
        }

        [HttpGet]
        public JsonResult GetDetail(int id)
        {
            var model = _pageService.GetById(id);
            return Json(new
            {
                status = true,
                data = model
            }, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public ActionResult Put(int id)
        {
            var pageModel = _pageService.GetById(id);
            var post = Mapper.Map<Page, PageViewModel>(pageModel);

            return View(post);
        }

        [HttpPost]
        [ValidateInput(false)]
        public ActionResult Put(PageViewModel pageVm)
        {
            var message = string.Empty;
            if (ModelState.IsValid)
            {
                var page = _pageService.GetById(pageVm.ID);
                if (page != null)
                {
                    page.UpdatePage(pageVm);
                    _pageService.Update(page);
                    _pageService.Save();
                    message = ResultState.Update_SUCCESS;
                    return RedirectToAction("Index", "Page");
                }
                else
                {
                    ModelState.AddModelError("", "Không tìm dữ liệu nào!");
                }
            }
            else
            {
                ModelState.AddModelError("", ResultState.Update_FALSE);
            }

            return View(pageVm);
        }

        [HttpPost]
        public JsonResult delete(int id)
        {
            string message = string.Empty;
            bool status = false;
            _pageService.Delete(id);

            message = ResultState.Delete_SUCCESS;
            status = true;
            _pageService.Save();

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
                _pageService.Delete(id);
            }
            _pageService.Save();
            return Json(new
            {
                message = ResultState.Delete_SUCCESS + count + " bản ghi"
            }, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult CheckExist(string name)
        {
            var result = true;
            var data = _pageService.GetByName(name);
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
            var target = _pageService.GetById(id);
            target.Status = !target.Status;
            _pageService.Save();
            return Json(new
            {
                status = target.Status
            }, JsonRequestBehavior.AllowGet);
        }
    }
}