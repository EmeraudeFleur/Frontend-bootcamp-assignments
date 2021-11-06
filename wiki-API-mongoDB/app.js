//atlas admin-ewu  SIYb80szRNAf2EDB
const express = require('express');
const app = express();

//require mongoose
const mongoose = require('mongoose');

app.use(express.urlencoded({
  extended: true
}));

app.set('view engine', 'ejs');

mongoose.connect('mongodb://localhost:27017/wikiDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});

const articlesSchema = {
  title: String,
  content: String
};

const Article = mongoose.model('Article', articlesSchema);

/////////////request targeting all articles/////////////////////////
app.route('/articles')
  .get(function(req, res) {
    Article.find(function(err, docs) {
      if (!err) {
        res.send(docs);
      } else {
        res.send(err);
      }
    });
  })

  .post(function(req, res) {
    const article = new Article({
      title: req.body.title,
      content: req.body.content
    });
    article.save(function(err) {
      if (!err) {
        res.send('success');
      } else {
        res.send(err);
      }
    });
  })

  .delete(function(req, res) {
    Article.deleteMany(function(err) {
      if (!err) {
        res.send('deleted all');
      } else {
        res.send(err);
      }
    });
  })

/////////////request targeting specific article/////////////////////////

app.route('/articles/:articleTitle')

  .get(function(req, res) {

    Article.findOne({
      title: req.params.articleTitle
    }, function(err, foundArticle) {
      if (!err) {
        if (foundArticle) {
          res.send(foundArticle);
        } else {
          res.send('no matching article');
        }
      }
    })
  })

  .put(function(req, res) {
    Article.replaceOne({
      title: req.params.articleTitle
    }, {
      title: req.body.title,
      content: req.body.content
    }, function(err) {
      if (!err) {
        res.send('updated');
      }
    });
  })
//if change put one key value, the other original key and value would disappear, in this case, updating piece of key, use patch

//req.body = {
//  title: '...'
//  content: '...'
//}
.patch(function(req, res) {
  Article.update({
    title: req.params.articleTitle
  }, {
    $set: req.body
  }, function(err) {
    if (!err) {
      res.send('updated');
    }
  });
})

.delete(function(req,res){
  Article.deleteOne({title: req.params.articleTitle}, function(err){
    if (!err) {
      res.send('deleted');
    } else {
      res.send(err);
    }
  });
});


app.listen(3000, () => {
  console.log('server is running on port 3000');
});
