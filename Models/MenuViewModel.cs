using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace LoHoiDaiLuc.Web.Models
{
    public class MenuViewModel
    {
        public int ID { set; get; }

        public string Name { set; get; }

        public string Alias { set; get; }

        public string Link { set; get; }

        public int? DisplayOrder { set; get; }

        public int? GroupID { set; get; }

        public virtual MenuGroupViewModel MenuGroup { set; get; }

        public int ParentID { get; set; }

        public string Target { set; get; }

        public bool Status { set; get; }
    }
}