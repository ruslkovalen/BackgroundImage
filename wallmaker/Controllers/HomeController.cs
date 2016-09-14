using CreateBackDb.Modelshj;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Web.Hosting;
using System.Web.Http;


namespace CreateBackDb.Controllers
{
    public class HomeController : ApiController
    {
        [HttpPost]
        public string getFile([FromBody] string serverName)
        {
            ServerBackgroundGenerator serverGenerator = new ServerBackgroundGenerator();
            return serverGenerator.GenerateBackground(serverName);
        }
        
        public HttpResponseMessage Start()
        {
            HttpResponseMessage message = new HttpResponseMessage();
            string viewPath = HostingEnvironment.MapPath(@"~/Index.html");
            var template = File.ReadAllText(viewPath);
            message.Content = new StringContent(template);
            message.Content.Headers.ContentType = new MediaTypeHeaderValue("text/html");
            return message;
        }
    }
}
