namespace LoHoiDaiLuc.Web.Models.Identity
{
    using System;
    using System.Data.Entity;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Linq;

    public partial class LoHoiDaiLucIdentityContext : DbContext
    {
        public LoHoiDaiLucIdentityContext()
            : base("name=LoHoiDaiLucIdentity")
        {
        }

        public virtual DbSet<AspNetRole> AspNetRoles { get; set; }
        public virtual DbSet<AspNetUser> AspNetUsers { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Entity<AspNetRole>()
                .HasMany(e => e.AspNetUsers)
                .WithMany(e => e.AspNetRoles)
                .Map(m => m.ToTable("AspNetUserRoles").MapLeftKey("RoleId").MapRightKey("UserId"));
        }

        public System.Data.Entity.DbSet<LoHoiDaiLuc.Models.Models.Post> Posts { get; set; }

        public System.Data.Entity.DbSet<LoHoiDaiLuc.Models.Models.PostCategory> PostCategories { get; set; }

        public System.Data.Entity.DbSet<LoHoiDaiLuc.Web.Models.FooterViewModel> FooterViewModels { get; set; }
    }
}
