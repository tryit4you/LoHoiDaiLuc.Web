using System;
using System.ComponentModel;

namespace LoHoiDaiLuc.Web.Models
{
    [Serializable]
    public class ProductViewModel
    {
        public int ID { set; get; }

        [DisplayName("Tên sản phẩm")]
        public string Name { set; get; }

        [DisplayName("Tiêu đề SEO")]
        public string Alias { set; get; }

        [DisplayName("Danh mục")]
        public int CategoryID { set; get; }
        [DisplayName("Hình ảnh")]
        public string Image { set; get; }

        public string MoreImages { set; get; }
        [DisplayName("Giá ")]
        public decimal Price { set; get; }

        public decimal? PromotionPrice { set; get; }

        public int? Warranty { set; get; }

        [DisplayName("Miêu tả sản phẩm")]

        public string Description { set; get; }


        [DisplayName("Nội dung")]

        public string Content { set; get; }

        [DisplayName("Hiển thị trang chủ")]

        public bool HomeFlag { set; get; }

        [DisplayName("Sản phẩm hot")]

        public bool HotFlag { set; get; }

        public int? ViewCount { set; get; }

        [DisplayName("Ngày tạo")]
        public DateTime? CreatedDate { set; get; }

        public string CreatedBy { set; get; }

        public DateTime? UpdatedDate { set; get; }

        public string UpdatedBy { set; get; }

        public string MetaKeyword { set; get; }

        public string MetaDescription { set; get; }

        public bool Status { set; get; }

        public string Tags { set; get; }

        public int Quantity { set; get; }

        public decimal OriginalPrice { set; get; }
        public virtual ProductCategoryViewModel ProductCategory { set; get; }
    }
}