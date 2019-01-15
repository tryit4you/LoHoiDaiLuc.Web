using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace LoHoiDaiLuc.Web.Models
{
    public class ProductCategoryViewModel
    {
        public int ID { set; get; }

        [Required(ErrorMessage = "Yêu cầu nhập tên danh mục")]
        public string cateName { set; get; }

        [Required(ErrorMessage = "Yêu cầu nhập tiêu đề SEO")]
        public string cateAlias { set; get; }

        public int? ParentID { set; get; }
        public string Description { set; get; }

        public int? DisplayOrder { set; get; }

        public string Image { set; get; }

        public bool? HomeFlag { set; get; }

        public virtual IEnumerable<PostViewModel> Posts { set; get; }

        public DateTime? CreatedDate { set; get; }

        public string CreatedBy { set; get; }

        public DateTime? UpdatedDate { set; get; }

        public string UpdatedBy { set; get; }

        public string MetaKeyword { set; get; }

        public string MetaDescription { set; get; }

        [Required(ErrorMessage = "Yêu cầu nhập trạng thái")]
        public bool Status { set; get; }
    }
}