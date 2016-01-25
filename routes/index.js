var express = require('express');
var router = express.Router();

var comments = [

];

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/api/comments', function(req, res){
    res.json(
        [
            {author: "Pete Hunt", text: "This is one comment"},
            {author: "Jordan Walke", text: "This is *another* comment"}
        ]
    );
});

router.post('/api/comments', function(req, res){
    var author = req.body.name;
    var text = req.body.text;
    comments.push({
        author : author,
        text : text
    })
    res.json(
        comments
    );
});

module.exports = router;
