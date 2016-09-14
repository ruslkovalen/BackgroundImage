using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Hosting;
using System.Web.Http;
using System.Web.Script.Serialization;

namespace CreateBackDb.Controllers
{
    
    public class AdminController : ApiController
    {

        [HttpGet]
        public bool Check()
        {
            bool check;
            if (User.Identity.IsAuthenticated)
            {
                check=true;
            }
            else
            {
                check = false;
            }
            return check;
        }

        [HttpPost]
        public void PostImage()
        {
            var httpRequest = HttpContext.Current.Request;
            if (httpRequest.Files.Count > 0)
            {
                for (int i = 0; i < httpRequest.Files.Count; i++)
                {
                    var FileName = Path.GetFileName(httpRequest.Files[i].FileName);
                    var path = Path.Combine(HostingEnvironment.MapPath("~/Content/Images"), FileName);
                    httpRequest.Files[i].SaveAs(path);
                }

            }
        }

        [HttpGet]
        public List<object> getImage()
        {
            bool dfsd = User.Identity.IsAuthenticated;
            DirectoryInfo dinfo = new DirectoryInfo(HostingEnvironment.MapPath("~/Content/Images"));

            string[] extensions = new[] { ".jpg", ".tiff", ".bmp", ".png", ".gif", ".jpeg" };

            FileInfo[] files =
                dinfo.GetFiles()
                     .Where(f => extensions.Contains(f.Extension.ToLower()))
                     .ToArray();
            List<object> images = new List<object>();
            foreach (FileInfo file in files)
            {
                string name = file.Name;
                bool check = false;
                if (name == GetCurrentFile())
                {
                    check = true;
                }
                images.Add(new { Name = name, Checked = check });
            }
            return images;
        }


        public string GetCurrentFile()
        {
            string src = HostingEnvironment.MapPath("~/Content/HomeImage.txt");
            StreamReader sr = new StreamReader(src);
            string CurrFileName = sr.ReadToEnd();
            sr.Close();
            return CurrFileName;
        }

        [HttpPost]
        public void DeleteImage()
        {
            var httpRequest = HttpContext.Current.Request; ;
            string name = httpRequest.Form["deletedFile"];
            string src = HostingEnvironment.MapPath("~/Content/Images/" + name);
            System.IO.File.Delete(src);
        }

        [HttpPost]
        public void ChangeImage()
        {
            var httpRequest = HttpContext.Current.Request;
            string src = httpRequest.Form["ChangeFile"];
            string path = HostingEnvironment.MapPath("~/Content/HomeImage.txt");
            StreamWriter sw = new StreamWriter(path);
            sw.Write(src, false);
            sw.Close();
        }
    }
}
