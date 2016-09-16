using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using System.Drawing.Text;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Hosting;


namespace CreateBackDb.Modelshj
{
    public class ServerBackgroundGenerator
    {
        public string GenerateBackground(string serverName)
        {
            string path = HostingEnvironment.MapPath("~/Content/HomeImage.txt");
            StreamReader sr = new StreamReader(path);
            string src = sr.ReadLine();
            sr.Close();
            src = HostingEnvironment.MapPath("~/Content/Images/" + src);
            //System.Web.UI.WebControls.Label label = new System.Web.UI.WebControls.Label();
            //label.Text = serverName;
            //var w = label.Width;
         
          
            Image image = Image.FromFile(src);
            var pathradimg = HostingEnvironment.MapPath("~/Content/Images/radacodelogo.png");
            Image radacodeimg = Image.FromFile(pathradimg);
            PrivateFontCollection ng = new PrivateFontCollection();
            var pathfont = HostingEnvironment.MapPath("~/Content/fonts/Baron_Neue_Bold.otf");
          
            ng.AddFontFile(pathfont);
           
            Graphics g = Graphics.FromImage(image);
            Font f = new Font(ng.Families[0], 40F, FontStyle.Bold);
            SizeF size = g.MeasureString(serverName,f);
            var w = size.Width;
            RectangleF rectf = new RectangleF(2130-w+190, 1320, w+100, 800);
            RectangleF rectimg = new RectangleF(2100-w+100, 1300, 113, 108);
            g.DrawImage(radacodeimg,rectimg);

            Color col = System.Drawing.ColorTranslator.FromHtml("#fdfdfd");
            g.SmoothingMode = SmoothingMode.AntiAlias;
            g.InterpolationMode = InterpolationMode.HighQualityBicubic;
            g.PixelOffsetMode = PixelOffsetMode.HighQuality;
            g.TextRenderingHint = System.Drawing.Text.TextRenderingHint.AntiAlias;
            g.DrawString(serverName, f, new SolidBrush(col), rectf);
       
            

            g.Flush();
            g.Dispose();

            var stream = new MemoryStream();
            image.Save(stream, ImageFormat.Jpeg);

            byte[] array = stream.ToArray();

            string stringBase64 = Convert.ToBase64String(array);
            return stringBase64;
        }
    }
}