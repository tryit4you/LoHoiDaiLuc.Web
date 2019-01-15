using AutoMapper;
using LoHoiDaiLuc.Common;
using LoHoiDaiLuc.Models.Models;
using LoHoiDaiLuc.Services;
using LoHoiDaiLuc.Web.Models;
using PagedList;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace LoHoiDaiLuc.Web.Controllers
{

    public class PostController : Controller
    {
        IPostService _postService;
        IPostCategoryService _postCategoryService;
        public PostController(IPostService postService, IPostCategoryService postCategoryService)
        {
            this._postService = postService;
            this._postCategoryService = postCategoryService;
        }
        // GET: Post
        public ActionResult Index()
        {
            return View();
        }
        [ChildActionOnly]
        public ActionResult getPostAtHome()
        {
            var postCategoryModel = _postCategoryService.GetAll();

            var postmodel = _postService.GetAll().OrderByDescending(x => x.CreatedDate)
                .Where(x => x.Status == true && x.HomeFlag == true)
                .Take(int.Parse(ConfigHelper.postItem("postItem"))).ToList();
            
            return PartialView(postmodel);
        }
        public ActionResult getAllPost(int? page)
        {
            int pageNumber = (page ?? 1);
            var postCategoryModel = _postCategoryService.GetAll();
            var postModel = _postService.GetAll();
            var postList = Mapper.Map<IEnumerable<Post>, IEnumerable<PostViewModel>>(postModel);
            ViewBag.PostCategory=Mapper.Map<IEnumerable<PostCategory>,IEnumerable<PostCategoryViewModel>>(postCategoryModel);

            return View(postList.ToPagedList(pageNumber, ConfigHelper.getByKey("pageSize")));
        }
        public ActionResult GetPostByCategory(int? page, int cateId)
        {
            var postCategoryModel = _postCategoryService.GetById(cateId);
            var model = _postService.GetAllByCategory(cateId);
            var listPost = Mapper.Map<IEnumerable<Post>, IEnumerable<PostViewModel>>(model);
            var postCategory = Mapper.Map<PostCategory, PostCategoryViewModel>(postCategoryModel);

            ViewBag.categoryData = postCategory;

            int pageNumber = (page ?? 1);
            return View(listPost.ToPagedList(pageNumber, ConfigHelper.getByKey("pageSize")));
        }
        public ActionResult GetDetail(int id)
        {
            var model = _postService.GetByID(id);
            var post = Mapper.Map<Post, PostViewModel>(model);

            return View(post);
        }

        [ChildActionOnly]
        public ActionResult getNewsTop()
        {
            var postNewModel = _postService.GetAll().Where(x=>x.Status==true).
                OrderByDescending(x => x.CreatedDate).
                Take(10).
                ToList();
            var postNewList = Mapper.Map<IEnumerable<Post>, IEnumerable<PostViewModel>>(postNewModel);

            return PartialView(postNewList);
        }
    }
}