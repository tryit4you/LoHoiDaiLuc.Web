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
    public class PostController : BaseController
    {
        private IPostService _postService;
        private IPostCategoryService _postCategoryService;

        public PostController(IPostService postService, IPostCategoryService postCategoryService)
        {
            this._postService = postService;
            this._postCategoryService = postCategoryService;
        }

        // GET: Admin/Post
        public ActionResult Index()
        {
            return View();
        }

        private Object getListCategory()
        {
            var listPostCategory = _postCategoryService.GetAll();
            try
            {
                var loadCateName = (from c in listPostCategory
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
            var PostModel = _postService.GetAll(searchstr).OrderByDescending(x => x.CreatedDate).ToList();
            if (option == 1)
                PostModel = PostModel.Where(x => x.Status == true).ToList();
            else if (option == 0)
                PostModel = PostModel.Where(x => x.Status == false).ToList();
            var listPost = Mapper.Map<IEnumerable<Post>, IEnumerable<PostViewModel>>(PostModel);

            var data = listPost.OrderByDescending(x => x.CreatedDate).Skip((page - 1) * pageSize).Take(pageSize);

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
            ViewBag.PostCategoryName = getListCategory();
            return View();
        }

        [HttpPost]
        [ValidateInput(false)]
        public ActionResult Post(Post post)
        {
            if (ModelState.IsValid)
            {
                post.CreatedDate = DateTime.Now;
                _postService.Add(post);
                _postService.SaveChange();
                return RedirectToAction("Index", "Post");
            }
            else
            {
                ModelState.AddModelError("", ResultState.Add_FALSE);
            }

            ViewBag.PostCategoryName = getListCategory();
            return View(post);
        }

        [HttpGet]
        public JsonResult GetDetail(int id)
        {
            var model = _postService.GetByID(id);
            return Json(new
            {
                status = true,
                data = model
            }, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public ActionResult Put(int id)
        {
            var PostModel = _postService.GetByID(id);
            var post = Mapper.Map<Post, PostViewModel>(PostModel);
            ViewBag.PostCategoryName = getListCategory();
            return View(post);
        }

        [HttpPost]
        [ValidateInput(false)]
        public ActionResult Put(PostViewModel PostVm)
        {
            var message = string.Empty;
            if (ModelState.IsValid)
            {
                var Post = _postService.GetByID(PostVm.ID);
                if (Post != null)
                {
                    Post.UpdatePost(PostVm);
                    _postService.Update(Post);
                    _postService.SaveChange();
                    message = ResultState.Update_SUCCESS;
                    return RedirectToAction("Index", "Post");
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
            ViewBag.PostCategoryName = getListCategory();
            return View(PostVm);
        }

        [HttpPost]
        public JsonResult delete(int id)
        {
            string message = string.Empty;
            bool status = false;
            _postService.Delete(id);

            message = ResultState.Delete_SUCCESS;
            status = true;
            _postService.SaveChange();

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
                _postService.Delete(id);
            }
            _postService.SaveChange();
            return Json(new
            {
                message = ResultState.Delete_SUCCESS + count + " bản ghi"
            }, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult CheckExist(string name)
        {
            var result = true;
            var data = _postService.GetByName(name);
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
            var target = _postService.GetByID(id);
            target.Status = !target.Status;
            _postCategoryService.Save();
            return Json(new
            {
                status = target.Status
            }, JsonRequestBehavior.AllowGet);
        }
    }
}