using System.ComponentModel.DataAnnotations;

namespace LoHoiDaiLuc.Areas.Admin.Models
{
    public class LoginModels
    {
        public string UserName { get; set; }

        [MinLength(8, ErrorMessage = "Mật khẩu phải ít nhất 8 kí tự.")]
        public string Password { get; set; }

        public bool RememberMe { get; set; }
    }
}