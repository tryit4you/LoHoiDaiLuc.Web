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
    public class SlideController : BaseController
    {
        private ISlideService _SlideService;

        public SlideController(ISlideService SlideService)
        {
            this._SlideService = SlideService;
        }

        [HttpPost]
        public JsonResult ChangeStatus(int id)
        {
            var target = _SlideService.GetById(id);
            target.Status = !target.Status;
            _SlideService.Save();
            return Json(new
            {
                status = target.Status
            }, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult CheckExist(string name)
        {
            var result = true;
            var data = _SlideService.GetByName(name);
            if (data != null)
                result = false;
            return Json(new
            {
                result = result
            }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult DeleteMul(int[] ids)
        {
            var count = ids.Count();
            foreach (var id in ids)
            {
                _SlideService.Delete(id);
            }
            _SlideService.Save();
            return Json(new
            {
                message = ResultState.Delete_SUCCESS + count + " bản ghi"
            }, JsonRequestBehavior.AllowGet);
        }

        // GET: Admin/Slide
        [HttpGet]
        public JsonResult GetAll(string searchstr, int page, int pageSize = 5)
        {
            var model = _SlideService.GetAll(searchstr);
            var SlideList = Mapper.Map<IEnumerable<Slide>, IEnumerable<SlideViewModel>>(model);
            var data = SlideList.
                Skip((page - 1) * pageSize).
                Take(pageSize);
            int totalRow = SlideList.Count();

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
            var model = _SlideService.GetById(id);
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

        [HttpGet]
        public ActionResult Post()
        {
            return View();
        }

        [HttpPost]
        [ValidateInput(false)]
        public ActionResult Post(Slide slide)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    _SlideService.Add(slide);
                    _SlideService.Save();
                    return RedirectToAction("Index", "Slide");
                }
                catch (Exception e)
                {
                    ModelState.AddModelError("", e.Message);
                }
            }
            else
            {
                ModelState.AddModelError("", ResultState.Add_FALSE);
            }

            return View(slide);
        }

        [HttpGet]
        public ActionResult Put(int id)
        {
            var slideModel = _SlideService.GetById(id);
            var slide = Mapper.Map<Slide, SlideViewModel>(slideModel);
            return View(slide);
        }

        [HttpPost]
        [ValidateInput(false)]
        public ActionResult Put(SlideViewModel slideVm)
        {
            var message = string.Empty;
            if (ModelState.IsValid)
            {
                var slide = _SlideService.GetById(slideVm.ID);
                if (slide != null)
                {
                    try
                    {
                        slide.UpdateSlide(slideVm);
                        _SlideService.Update(slide);
                        _SlideService.Save();
                        message = ResultState.Update_SUCCESS;
                        return RedirectToAction("Index", "Slide");
                    }
                    catch (Exception e)
                    {
                        ModelState.AddModelError("", e.Message);
                    }
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

            return View(slideVm);
        }

        [HttpPost]
        public JsonResult Delete(int id)
        {
            string message = string.Empty;
            bool status = false;
            _SlideService.Delete(id);

            message = ResultState.Delete_SUCCESS;
            status = true;
            _SlideService.Save();

            return Json(new
            {
                status = status,
                message = message
            }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult UpdateOrder(int id, int DisplayOrder)
        {
            var message = string.Empty;
            var status = false;
            var model = _SlideService.GetById(id);
            model.DisplayOrder = DisplayOrder;
            try
            {
                _SlideService.Save();
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