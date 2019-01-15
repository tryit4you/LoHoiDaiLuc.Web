using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace LoHoiDaiLuc.Web.Models
{
    public class MenuGroupViewModel
    {

        public int ID { set; get; }

        public string GroupName { set; get; }

        public string Alias { set; get; }

      
        public string Link { set; get; }

        public int? DisplayOrder { set; get; }

        public bool Status { get; set; }
        public virtual IEnumerable<MenuViewModel> Menus { set; get; }
    }
}