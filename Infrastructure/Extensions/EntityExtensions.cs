using LoHoiDaiLuc.Models.Models;
using LoHoiDaiLuc.Web.Models;
using System;

namespace LoHoiDaiLuc.Web.Infrastructure.Extensions
{
    public static class EntityExtensions
    {
        public static void UpdatePostCategory(this PostCategory postCategory, PostCategoryViewModel postCategoryVm)
        {
            postCategory.ID = postCategoryVm.ID;
            postCategory.cateName = postCategoryVm.cateName;
            postCategory.Description = postCategoryVm.Description;
            postCategory.cateAlias = postCategoryVm.cateAlias;
            postCategory.ParentID = postCategoryVm.ParentID;
            postCategory.DisplayOrder = postCategoryVm.DisplayOrder;
            postCategory.Image = postCategoryVm.Image;
            postCategory.HomeFlag = postCategoryVm.HomeFlag;

            postCategory.CreatedBy = postCategoryVm.CreatedBy;
            postCategory.UpdatedDate = DateTime.Now;
            postCategory.UpdatedBy = postCategoryVm.UpdatedBy;
            postCategory.MetaKeyword = postCategoryVm.MetaKeyword;
            postCategory.MetaDescription = postCategoryVm.MetaDescription;
            postCategory.Status = postCategoryVm.Status;
        }

        public static void UpdateProductCategory(this ProductCategory productCategory, ProductCategoryViewModel productCategoryVm)
        {
            productCategory.ID = productCategoryVm.ID;
            productCategory.cateName = productCategoryVm.cateName;
            productCategory.Description = productCategoryVm.Description;
            productCategory.cateAlias = productCategoryVm.cateAlias;
            productCategory.ParentID = productCategoryVm.ParentID;
            productCategory.DisplayOrder = productCategoryVm.DisplayOrder;
            productCategory.Image = productCategoryVm.Image;
            productCategory.HomeFlag = productCategoryVm.HomeFlag;

            productCategory.CreatedBy = productCategoryVm.CreatedBy;
            productCategory.UpdatedDate = DateTime.Now;
            productCategory.UpdatedBy = productCategoryVm.UpdatedBy;
            productCategory.MetaKeyword = productCategoryVm.MetaKeyword;
            productCategory.MetaDescription = productCategoryVm.MetaDescription;
            productCategory.Status = productCategoryVm.Status;
        }

        public static void UpdateProduct(this Product product, ProductViewModel productVm)
        {
            product.ID = productVm.ID;
            product.Name = productVm.Name;
            product.Description = productVm.Description;
            product.Alias = productVm.Alias;
            product.CategoryID = productVm.CategoryID;
            product.Content = productVm.Content;
            product.Image = productVm.Image;
            product.HomeFlag = productVm.HomeFlag;

            product.CreatedBy = productVm.CreatedBy;
            product.UpdatedDate = DateTime.Now;
            product.UpdatedBy = productVm.UpdatedBy;
            product.MetaKeyword = productVm.MetaKeyword;
            product.MetaDescription = productVm.MetaDescription;
            product.Status = productVm.Status;
        }

        public static void UpdatePost(this Post post, PostViewModel postVm)
        {
            post.ID = postVm.ID;
            post.Name = postVm.Name;
            post.Description = postVm.Description;
            post.Alias = postVm.Alias;
            post.CategoryID = postVm.CategoryID;
            post.Content = postVm.Content;
            post.Image = postVm.Image;
            post.HomeFlag = postVm.HomeFlag;
            post.ViewCount = postVm.ViewCount;
            post.CreatedBy = postVm.CreatedBy;
            post.UpdatedDate = DateTime.Now;
            post.UpdatedBy = postVm.UpdatedBy;
            post.MetaKeyword = postVm.MetaKeyword;
            post.MetaDescription = postVm.MetaDescription;
            post.Status = postVm.Status;
            post.Tags = postVm.Tags;
        }

        public static void UpdateContact(this ContactDetail contact, ContactDetailViewModel contactVm)
        {
            contact.ID = contactVm.ID;
            contact.Name = contactVm.Name;
            contact.Address = contactVm.Address;
            contact.Email = contactVm.Email;
            contact.Phone = contactVm.Phone;
            contact.Other = contactVm.Other;
            contact.Website = contactVm.Website;
            contact.Lat = contactVm.Lat;
            contact.Lng = contactVm.Lng;

            contact.Status = contactVm.Status;
        }

        //public static void UpdateFeedback(this Feedback feedback, FeedbackViewModel feedbackVm)
        //{
        //    feedback.Name = feedbackVm.Name;
        //    feedback.Email = feedbackVm.Email;
        //    feedback.Message = feedbackVm.Message;
        //    feedback.Status = feedbackVm.Status;
        //    feedback.CreatedDate = DateTime.Now;
        //}

        public static void UpdateMenu(this Menu menu, MenuViewModel menuVm)
        {
            menu.ID = menuVm.ID;
            menu.Name = menuVm.Name;
            menu.DisplayOrder = menuVm.DisplayOrder;
            menu.Status = menuVm.Status;
            menu.Target = menuVm.Target;
            menu.Link = menuVm.Link;
            menu.ParentID = menuVm.ParentID;
            menu.Status = menuVm.Status;
        }


        public static void UpdateSystemConfig(this SystemConfig systemConfig, SystemConfigViewModel systemConfigVm)
        {
            systemConfig.ID = systemConfigVm.ID;
            systemConfig.Code= systemConfigVm.Code;
            systemConfig.ValueInt= systemConfigVm.ValueInt;
            systemConfig.ValueString = systemConfigVm.ValueString;
            }

        public static void UpdatePage(this Page page, PageViewModel pageVm)
        {
            page.ID = pageVm.ID;
            page.Name = pageVm.Name;
            page.Status = pageVm.Status;
            page.Alias = pageVm.Alias;
            page.Content = pageVm.Content;
            page.Status = pageVm.Status;
            page.InstanceName = pageVm.InstanceName;
        }
        public static void UpdateVideo(this Video video, VideoViewModel videoVm)
        {
            video.ID = videoVm.ID;
            video.Name = videoVm.Name;
            video.Status = videoVm.Status;
            video.Alias = videoVm.Alias;
            video.HomeFlag = videoVm.HomeFlag;
            video.Status = videoVm.Status;
        }
        public static void UpdateFeedback(this Feedback feedback, FeedbackViewModel feedbackVm)
        {
            feedback.ID = feedbackVm.ID;
            feedback.Name = feedbackVm.Name;
            feedback.Status = feedbackVm.Status;
            feedback.Message = feedbackVm.Message;
            feedback.Email = feedbackVm.Email;
            feedback.Status = feedbackVm.Status;
        }

        public static void UpdateSlide(this Slide slide, SlideViewModel slideVm)
        {
            slide.ID = slideVm.ID;
            slide.Name = slideVm.Name;
            slide.Image = slideVm.Image;
            slide.DisplayOrder = slideVm.DisplayOrder;
            slide.Status = slideVm.Status;
            slide.Content = slideVm.Content;
            slide.Description = slideVm.Description;
            slide.Status = slideVm.Status;
            slide.Url = slideVm.Url;
        }

        public static void UpdateMenuGroup(this MenuGroup menuGroup, MenuGroupViewModel menuGroupVm)
        {
            menuGroup.ID = menuGroupVm.ID;
            menuGroup.GroupName = menuGroupVm.GroupName;
            menuGroup.DisplayOrder = menuGroupVm.DisplayOrder;
            menuGroup.Status = menuGroupVm.Status;
            menuGroup.Link = menuGroupVm.Link;
            menuGroup.Alias= menuGroupVm.Alias;
            menuGroup.Status = menuGroupVm.Status;
        }

        public static void UpdateOrder(this Order order, OrderViewModel orderVm)
        {
            order.CustomerName = orderVm.CustomerName;
            order.CustomerAddress = orderVm.CustomerName;
            order.CustomerEmail = orderVm.CustomerName;
            order.CustomerMobile = orderVm.CustomerName;
            order.CustomerMessage = orderVm.CustomerName;
            order.PaymentMethod = orderVm.CustomerName;
            order.CreatedBy = orderVm.CreatedBy;
            order.Status = orderVm.Status;
            order.CustomerId = orderVm.CustomerId;
        }

        public static void UpdateFooter(this Footer footer, FooterViewModel footerVm)
        {
            footer.ID = footerVm.ID;
            footer.Content= footerVm.Content;
        }

        //public static void UpdateApplicationRole(this ApplicationRole appRole, ApplicationRoleViewModel appRoleViewModel, string action = "add")
        //{
        //    if (action == "update")
        //        appRole.Id = appRoleViewModel.Id;
        //    else
        //        appRole.Id = Guid.NewGuid().ToString();
        //    appRole.Name = appRoleViewModel.Name;
        //    appRole.Description = appRoleViewModel.Description;
        //}
        //public static void UpdateUser(this ApplicationUser appUser, ApplicationUserViewModel appUserViewModel, string action = "add")
        //{
        //    appUser.Id = appUserViewModel.Id;
        //    appUser.FullName = appUserViewModel.FullName;
        //    appUser.BirthDay = appUserViewModel.BirthDay;
        //    appUser.Email = appUserViewModel.Email;
        //    appUser.UserName = appUserViewModel.UserName;
        //    appUser.PhoneNumber = appUserViewModel.PhoneNumber;
        //}
    }
}