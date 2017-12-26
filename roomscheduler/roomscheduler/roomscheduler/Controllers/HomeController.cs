using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace roomscheduler.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public ActionResult Contact()
        {

      string conn =
         ConfigurationManager.ConnectionStrings["TestConnectionString"].ConnectionString;
      var data = ReadOrderData<string>(conn);
      ViewBag.Message = "Your contact page.";

            return View();
        }

    private static IEnumerable<T> ReadOrderData<T>(string connectionString)
    {
      string queryString =
          "SELECT * FROM dbo.book;";

      using (SqlConnection connection =
                 new SqlConnection(connectionString))
      {
        SqlCommand command =
            new SqlCommand(queryString, connection);
        connection.Open();

        SqlDataReader reader = command.ExecuteReader();

        // Call Read before accessing data.
        while (reader.Read())
        {
          yield return (T)reader[0];

          //Console.WriteLine(String.Format("{0}, {1}",
          //  reader[0], reader[1]));
        }

        // Call Close when done reading.
        reader.Close();
      }
    }
  }
}
