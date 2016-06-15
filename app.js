
var express  = require('express'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    ejs      = require('ejs')


Schema = new mongoose.Schema({
    title : String,
    publisher : String,
    text : String,
    category:String,
    subCategory:String,
    createdOn: Date
}),

Blog = mongoose.model('Blog', Schema);

mongoose.connect('mongodb://man:1003@ds013564.mlab.com:13564/nietsample');


var app = express()

app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({extended: true}));
app.use('/public', express.static(__dirname + '/public'));

app.get('/api', function (req, res) {
    res.json(200, {msg: 'OK' });
})

app.get('/blogs', function (req, res) {
    // http://mongoosejs.com/docs/api.html#query_Query-find
    Blog.find({}, function ( err, blogs ){
        if(!err && blogs){
            res.render('blogs.ejs',{
                data :  blogs
            })
        } else {
            console.log(err)
        }
    });
});

app.get('/addblog', function(req, res){
    res.render('addPost.ejs')
})

app.get('/', function(req, res){
    Blog.find({}).limit(3).exec(function(err, blogs){
        if(!err && blogs){
            res.render('index.ejs',{
                data :  blogs
            })
        } else{
            console.log(err);
            res.status(500).send("something went wrong while fetching blog summary");
        }
    })
})

app.post('/api/addBlog', function (req, res) {
    var blog = new Blog(
        {
            title : req.body.title,
            publisher : req.body.publisher,
            text : req.body.text,
            category : req.body.category,
            subCategory : req.body.subCategory,
            createdOn : Date.now()
        }
    );

    // http://mongoosejs.com/docs/api.html#model_Model-save
    blog.save(function (err, data) {
        if(!err && data){
            console.log('Data added successfully');
            res.redirect('/blogs')
        } else {
            res.json(500, {msg: 'Something went wrong' });
            console.log(err)
        }

    });
})

app.get('/api/blogs', function (req, res) {
    // http://mongoosejs.com/docs/api.html#query_Query-remove
    User.remove({ category: 'music' }, function ( err ) {
        if(!err){
            console.log("User deleted successfully")
        } else{
            console.log(err)
        }
    });
})

app.get('/blog/:id', function(req, res){
    Blog.findById( req.params.id, function ( err, blog ) {
        if(!err && blog){
            res.render('blogDetail.ejs',{
                data : blog
            })
        } else {
            console.log(err)
        }
    });
} )

app.get('/editblog/:id', function(req, res){
    Blog.findById( req.params.id, function ( err, blog ) {
        if(!err && blog){
            res.render('editPost.ejs',{
                data : blog
            })
        } else {
            console.log(err)
        }
    });

})

app.post('/api/editBlog/:id', function (req, res) {
    // http://mongoosejs.com/docs/api.html#model_Model.findById
    Blog.findById( req.params.id, function ( err, blog ) {
            blog.title = req.body.title,
            blog.publisher = req.body.publisher,
            blog.text = req.body.text,
            blog.category = req.body.category,
            blog.subCategory = req.body.subCategory
        // http://mongoosejs.com/docs/api.html#model_Model-save
        blog.save( function ( err, data ){
            if(!err && data){
                res.redirect('/blogs')
            } else {
                console.log(err)
            }

        });
    });
});

app.get('/api/deleteblog/:id', function (req, res) {
    // http://mongoosejs.com/docs/api.html#model_Model.findById
    Blog.findById( req.params.id, function ( err, blog ) {
        // http://mongoosejs.com/docs/api.html#model_Model.remove
        blog.remove( function ( err ){
            res.status(200, {msg: 'User deleted successfully'})
        });
    });
})

app.listen(8080);
console.log('Magic happens on port 8080');

