using AutoMapper;
using LoHoiDaiLuc.Common;
using LoHoiDaiLuc.Models.Models;
using LoHoiDaiLuc.Services;
using LoHoiDaiLuc.Web.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Web.Mvc;

namespace LoHoiDaiLuc.Web.Areas.Admin.Controllers
{
    public class FeedbackController : BaseController
    {
        // GET: Admin/Contact

        private IFeedbackService _feedbackService;

        public FeedbackController(IFeedbackService feedbackService)
        {
            this._feedbackService = feedbackService;
        }

        [HttpPost]
        public JsonResult ChangeStatus(int id)
        {
            var target = _feedbackService.GetById(id);
            target.Status = !target.Status;
            _feedbackService.Save();
            return Json(new
            {
                status = target.Status
            }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult Delete(int id)
        {
            var target = _feedbackService.Delete(id);
            _feedbackService.Save();
            return Json(new
            {
                message = ResultState.Delete_SUCCESS
            }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public async System.Threading.Tasks.Task<JsonResult> SendAsync(int id)
        {
            string message = string.Empty;
            var feedbackModel = _feedbackService.GetById(id);
            var body = "<p>email from: {0} ({1})</p><p>message:</p><p>{2}</p>";
            var mailmessage = new MailMessage();
            mailmessage.To.Add(new MailAddress(ConfigurationManager.AppSettings["email"]));  // replace with valid value
            mailmessage.From = new MailAddress(feedbackModel.Email);  // replace with valid value
            mailmessage.Subject = "Tin nhắn được gởi từ website www.lohoidailuc.com";
            mailmessage.Body = string.Format(body, feedbackModel.Name, feedbackModel.Email, feedbackModel.Message);
            mailmessage.IsBodyHtml = true;

            using (var smtp = new SmtpClient())
            {
                try
                {
                    var credential = new NetworkCredential
                    {
                        UserName = "vohung.it@gmail.com",  // replace with valid value
                        Password = "hung!@1997"  // replace with valid value
                    };
                    smtp.Credentials = credential;
                    smtp.Host = "smtp-mail.outlook.com";
                    smtp.Port = 587;
                    smtp.EnableSsl = true;
                    await smtp.SendMailAsync(mailmessage);
                }
                catch (Exception e)
                {
                    message = e.Message;
                }
            }

            return Json(new
            {
            });
        }

        [HttpPost]
        public JsonResult DeleteMul(int[] ids)
        {
            var count = ids.Count();
            foreach (var id in ids)
            {
                _feedbackService.Delete(id);
            }
            _feedbackService.Save();
            return Json(new
            {
                message = ResultState.Delete_SUCCESS + count + " bản ghi"
            }, JsonRequestBehavior.AllowGet);
        }

        // GET: Admin/Contact
        [HttpGet]
        public JsonResult GetAll(string searchstr, int page, int pageSize = 5)
        {
            var model = _feedbackService.GetAll(searchstr);
            var feedbackList = Mapper.Map<IEnumerable<Feedback>, IEnumerable<FeedbackViewModel>>(model);
            var data = feedbackList.
                Skip((page - 1) * pageSize).
                Take(pageSize);
            int totalRow = feedbackList.Count();

            return Json(new
            {
                data = data,
                total = totalRow,
                status = true
            }, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public ActionResult GetDetail(int id)
        {
            var model = _feedbackService.GetById(id);
            return Json(new
            {
                status = true,
                data = model
            }, JsonRequestBehavior.AllowGet);
        }

        public ActionResult Index()
        {
            return View();
        }
    }
}