using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;
using roomscheduler.Models;

namespace roomscheduler.Controllers
{
    public class booksController : ApiController
    {
        private DBEfCoreEntities db = new DBEfCoreEntities();

        // GET: api/books
        public IQueryable<book> Getbooks()
        {
            return db.books;
        }

        // GET: api/books/5
        [ResponseType(typeof(book))]
        public IHttpActionResult Getbook(int id)
        {
            book book = db.books.Find(id);
            if (book == null)
            {
                return NotFound();
            }

            return Ok(book);
        }

        // PUT: api/books/5
        [ResponseType(typeof(void))]
        public IHttpActionResult Putbook(int id, book book)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != book.id)
            {
                return BadRequest();
            }

            db.Entry(book).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!bookExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST: api/books
        [ResponseType(typeof(book))]
        public IHttpActionResult Postbook(book book)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.books.Add(book);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = book.id }, book);
        }

        // DELETE: api/books/5
        [ResponseType(typeof(book))]
        public IHttpActionResult Deletebook(int id)
        {
            book book = db.books.Find(id);
            if (book == null)
            {
                return NotFound();
            }

            db.books.Remove(book);
            db.SaveChanges();

            return Ok(book);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool bookExists(int id)
        {
            return db.books.Count(e => e.id == id) > 0;
        }
    }
}