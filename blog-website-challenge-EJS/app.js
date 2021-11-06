const express = require("express");
const app = express();
const _ = require('lodash');
const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

//1. get to different routes, just change the href in header hyperlinks

app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));

app.set('view engine', 'ejs');

const posts = [];

app.get('/',(req,res)=>{
  res.render('home',{
    homeStartingContent:homeStartingContent,
    posts: posts
  });//{}中要指明每次js,ejs互相运用的key: value，不然没用

});

//EXPRESS route parameters
//Routing refers to how an application’s endpoints (URIs) respond to client requests.
//instead of write each route like so app.get('/forum/technology',(req,res)=>{}); app.get('/forum/philosophy',(req,res)=>{});
//do this: app.get('/forum/:theme',(req,res)=>{console.log(req.params.topic);})
//故，如果一个URL参数是变化的，可以使用参数方法，通往同级的不同paths
//eg. 某route path: '/users/:userId/books/:bookId'；users/books定，userId/bookId变。

app.get('/about',(req,res)=>{
  res.render('about',{aboutContent:aboutContent});
});

app.get('/contact',(req,res)=>{
  res.render('contact',{contactContent:contactContent});
});

app.get('/compose',(req,res)=>{
  res.render('compose');
});

  //同样三种循环方法，找帖子
  // app.get('/posts/:post',(req,res)=>{
  // for (var i=0;i<posts.length;i++) {
  //   if (req.params.post===posts[i].postTitle) {
  //     console.log('match found');
  //   }
  // }
  // });

  // app.get('/posts/:post',(req,res)=>{
  // posts.forEach((post)=>{
  //   if (post.postTitle===req.params.post) {
  //     console.log('match found');
  //   };
  // });


          //kebab case is consistent lower or upper case, connected with dash/hyphen -
          //下面是接着上面两种的第三种方法，同时解决route path 输入大小写，连字符等不严格匹配post.postTitle而出错的问题
          //Lodash install: npm i --save lodash then require above
          //统一字符串格式，lowerCase or kebabCase

//跳转到相应的单独post页面
  app.get('/posts/:post',(req,res)=>{
  posts.map((post)=>{
    if (_.kebabCase(post.postTitle)===_.kebabCase(req.params.post)) {
      res.render('post',{postTitle: post.postTitle, postBody: post.postBody});

    }
  });
  });



app.post('/compose',(req,res)=>{
  //create js object containing both postTitle & postBody: const object = {key: value, key: {key: value}};
  const post = {
    postTitle: req.body.postTitle,
    postBody: req.body.postBody
  };
  posts.push(post);
  res.redirect('/');
});

// document.querySelector('home')
//
// document.querySelector('about')
// document.querySelector('contact')






app.listen(3000, function() {
  console.log("Server started on port 3000");
});
