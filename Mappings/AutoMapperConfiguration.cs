using AutoMapper;
using LoHoiDaiLuc.Models.Models;
using LoHoiDaiLuc.Web.Models;


namespace LoHoiDaiLuc.Web.Mappings
{
    public class AutoMapperConfiguration
    {
        public static void Configure()
        {
            Mapper.CreateMap<Product, ProductViewModel>();
            Mapper.CreateMap<ProductCategory, ProductCategoryViewModel>();
            Mapper.CreateMap<Tag, TagViewModel>();
            Mapper.CreateMap<Product, ProductViewModel>();
            Mapper.CreateMap<ProductTag, ProductTagViewModel>();
            Mapper.CreateMap<Post, PostViewModel>();
            Mapper.CreateMap<Menu, MenuViewModel>();
            Mapper.CreateMap<MenuGroup, MenuGroupViewModel>();
            Mapper.CreateMap<PostCategory, PostCategoryViewModel>();
            Mapper.CreateMap<Slide, SlideViewModel>();
            Mapper.CreateMap<Page, PageViewModel>();
            Mapper.CreateMap<ContactDetail, ContactDetailViewModel>();
            Mapper.CreateMap<Video, VideoViewModel>();
            Mapper.CreateMap<Feedback, FeedbackViewModel>();
            Mapper.CreateMap<SystemConfig, SystemConfigViewModel>();
            Mapper.CreateMap<SystemConfig, SystemConfigViewModel>();
            Mapper.CreateMap<Footer, FooterViewModel>();
        }
    }
}