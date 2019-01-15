using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace LoHoiDaiLuc.Web.Models
{
    public class VideoViewModel
    {
        public int ID { get; set; }
 
        public string Name { get; set; }
        public string Alias { get; set; }
        public string Code { get; set; }
        public bool HomeFlag { get; set; }
        public bool Status { get; set; }
    }
}