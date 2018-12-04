using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Newtonsoft.Json;
using System.IO;

namespace LvUpdate.Controllers
{
    public class HomeController : Controller
    {
        // GET: Home
        public ActionResult Index()
        {
            return View();
        }

        public string Upload(bool? start, bool? end, string guid, string filename)
        {
            if (start != null && start.Value)
            {
                return JsonConvert.SerializeObject(new
                {
                    guid = Guid.NewGuid().ToString().Replace("-", "")
                });
            }
            if(end != null && end.Value)
            {
                return JsonConvert.SerializeObject(new
                {
                    msg = "finish"
                });
            }
            else
            {
                if (Request.Files.Count > 0)
                {
                    HttpPostedFileBase uploadFile = Request.Files[0] as HttpPostedFileBase;
                    if (uploadFile != null && uploadFile.ContentLength > 0)
                    {
                        string path = Server.MapPath("/Content/uploads");
                        using (FileStream writer = new FileStream(Path.Combine(path, filename), 
                            FileMode.Append))
                        {
                            int nread = 0;
                            byte[] buf = new byte[1024];
                            while ((nread = uploadFile.InputStream.Read(buf, 0, 1024)) > 0)
                            {
                                writer.Write(buf, 0, nread);
                            }
                        }
                    }
                }
                return JsonConvert.SerializeObject(new
                {
                    msg = "success"
                });
            }
            
        }
    }
}