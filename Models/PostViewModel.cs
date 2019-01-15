using System;
using System.Collections.Generic;
using System.ComponentModel;

namespace LoHoiDaiLuc.Web.Models
{
    public class PostViewModel
    {
        public int ID { set; get; }

        [DisplayName("Tên bài viết")]
        public string Name { set; get; }

        [DisplayName("Tiêu đề SEO")]
        public string Alias { set; get; }

        [DisplayName("Tên danh mục")]
        public int CategoryID { set; get; }

        [DisplayName("Hình đại diện")]
        public string Image { set; get; }

        [DisplayName("Miêu tả")]
        public string Description { set; get; }

        [DisplayName("Nội dung bài viết")]
        public string Content { set; get; }


        [DisplayName("Hiển thị trang chủ")]
        public bool HomeFlag { set; get; }


        [DisplayName("Bài viết nổi bật")]
        public bool HotFlag { set; get; }


        [DisplayName("Lượt xem")]
        public int? ViewCount { set; get; }

        public DateTime? CreatedDate { set; get; }

        public string CreatedBy { set; get; }

        public DateTime? UpdatedDate { set; get; }

        public string UpdatedBy { set; get; }

        public string MetaKeyword { set; get; }

        public string MetaDescription { set; get; }

        [DisplayName("Trạng thái")]
        public bool Status { set; get; }

        [DisplayName("Tags:")]
        public string Tags { get; set; }

        public virtual ProductCategoryViewModel ProductCategory { set; get; }

        public virtual IEnumerable<ProductTagViewModel> ProductTags { set; get; }
    }
}