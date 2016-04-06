var express = require('express');
var router = express.Router();

var entries = [];

/* READ all: GET entries listing. */
router.get('/', function(req, res, next) {
  console.log(req.cookies.username);
  var name = req.cookies.username || 'anonymous';
  req.db.driver.execQuery(
    "SELECT * FROM entries;",
    function(err, data){
      if(err)
      {
        console.log(err);
      }

      res.render('entries/index', { title: 'Today I Learned ', entries: data, name: name });
    }
  );

});

/* CREATE entry form: GET /entries/new */
router.get('/new', function(req, res, next) {
  res.render('entries/new', {title: "Create new entry"});
});

/*CREATE entry: POST /entries/ */
router.post('/', function(req, res, next) {
  req.db.driver.execQuery(
    "INSERT INTO entries (slug,body) VALUES (?,?);",
    [req.body.slug, req.body.body],
    function(err, data){
      if(err)
      {
        console.log(err);
      }

      res.redirect(303, '/entries/');
    }
  );
});

/* UPDATE entry form: GET /entries/1/edit */
router.get('/:id/edit', function(req, res, next) {

  req.db.driver.execQuery(
    'SELECT * FROM entries WHERE id=?;',
    [parseInt(req.params.id)],
    function(err, data){
      if(err)
      {
        console.log(err);
      }

      res.render('entries/update',
      {
        title: 'Update an entry',
        entry: data[0]
      });
    }
  );

});

/* UPDATE entry: POST /entries/1 */
router.post('/:id', function(req, res, next) {
  var id=parseInt(req.params.id);

  req.db.driver.execQuery(
    "UPDATE entries SET slug=? ,body=? WHERE id=?;",
    [req.body.slug, req.body.body, parseInt(req.params.id)],
    function(err, data){
      if(err)
      {
        console.log(err);
      }

      res.redirect(303, '/entries/' + id);
    }
  );

});

/* DELETE entry: GET /entries/1/delete  */
router.get('/:id/delete', function(req, res, next) {
  req.db.driver.execQuery(
    'DELETE FROM entries WHERE id=?;',
    [parseInt(req.params.id)],
    function(err, data){
      if(err)
      {
        console.log(err);
      }

      res.redirect(303, '/entries/');
    }
  );
});

/* THIS NEEDS TO BE LAST or /new goes here rather than where it should */
/* READ one entry: GET /entries/0 */
router.get('/:id', function(req, res, next) {
  console.log("GET entry id");
  req.db.driver.execQuery(
    'SELECT * FROM entries WHERE id=?;',
    [parseInt(req.params.id)],
    function(err, data){
      if(err)
      {
        console.log(err);
      }

      res.render('entries/entry', {title: "a entry", entry: data[0]});
    }
  );

});

module.exports = router;
