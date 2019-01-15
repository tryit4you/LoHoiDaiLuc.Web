using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace LoHoiDaiLuc.Web.Models
{
    public class SystemConfigViewModel
    {
        public int ID { set; get; }

        public string Code { set; get; }

        public string ValueString { set; get; }

        public int? ValueInt { set; get; }
    }
}