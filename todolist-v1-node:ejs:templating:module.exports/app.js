//nodejs module exports
//把 日期 单独放一个module,新建date.js
//主js中调用 const date = require(__dirname + '/date.js')
//date.js中创建该函数，并module.exports = functionName; (不能带括号)
//然后需要用的时候，let day = date(); (对应const 设置值)

//如果date.js中包含了多个方程:
//module.exports 是 js object,所以可以module.exports.function1; module.exports.function2;...
//其他简化。。。


const express = require('express');
const app = express();

//date 代表整个自建的module，选module名字，其中的个别函数调用时写date.getDay(); date.getDate();
const date = require(__dirname + '/date.js')

app.use(express.urlencoded({extended: true}));
// 运用CSS，因为 js 只send html
app.use(express.static('public'));
//npm i ejs
app.set('view engine', 'ejs');

//创建原数组，然后push进新添加的任务，逐个在<li>中表现出来
//var const const. all local variables inside functions, global outside functions.
//in if/else, loops, var variables are global, the other two still local.
//const 不可以改变其变量/object,但是可以改变里面的值.

const items = ['buy food','cook food','eat food'];
const workItems = [];
app.get('/',(req,res)=>{
  const day = date.getDate();

  //'list' 指引程序查看views 目录下的list.ejs文件 {}中:前量为ejs中的对应<% %>中的变量，后量为该js文件中设置的变量。
  res.render('list', {listTitle: day, newListItems: items});

});

app.post('/',(req,res)=>{
  //这里将网页数据输送到 home route,而ejs中<%这些符号将js中变量再运用到页面中
  const item = req.body.newItem;

  if(req.body.list==='Work'){
    workItems.push(item);
    res.redirect('/work');
  }
  else {
    items.push(item);
    res.redirect('/');
  }

});

app.get('/work',(req,res)=>{
  //后量非自定义则表示为字符串
  res.render('list',{listTitle: 'Work List', newListItems: workItems });
});

app.get('/about',(req,res)=>{
  res.render('about');
});

        //create new route/work 但公用一个ejs template
        //下面写的会导致在/work route 中添加新项目，会添加到主页上去，是因为ejs中，数据是post到home route的，
        //如果在app.post('/')下面console.log(req.body);会在terminal 看到{ newItem: 'gg', button: '' }
        // gg是新添加的项目值-value，newItem 是该input name attribute，而button的value 还没设置，故是空的
        //所以可以对该button的属性做些设置(button name > list; button value > listTitle(day/'work list')),
        //这样的情况下，console.log(req.body);会得到{ newItem: 'gg', list: 'work' } 为什么只有work，而不是work list呢？
        //因为 value=<%= listTitle %> 非字符串，work list 分开写的，计算机只取第一个单词。
        //然后以此为根据来区别开来主页和/work页面，把/work页添加的项目添加到/work下.见上面完整版.
        //
        //
        // app.get('/work',(req,res)=>{
        //   //后量非自定义则表示为字符串
        //   res.render('list',{listTitle: 'Work List', newListItems: workItems });
        // });
        // app.post('/work',(req,res)=>{
        //   const workItem = req.body.newItem;
        //   workItems.push(workItem);
        //   res.redirect('/work');
        // });

              //using ejs to layout html pages in different routes
              //parts of html (header/footer) can stay consistent across web pages
              //1. create header.ejs; footer.ejs under folder views, cut the partials to the files
              //2. create an about page(add sth), ejs way include header and footer to list.ejs and about.ejs
              //create new about app.get in app.js

//页面显示星期几的两种方法：
// app.get('/',(req,res)=>{
//   const today =new Date();
  // const i = today.getDay(); //得到数字 1，2，3，4，5，6，0
  // const arr =['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
  // const day = arr[i];
// 另一种方法：
//   const day ='';
//   switch(i){
//     case 0:
//     day = 'Sunday';
//     break;
//     case 1:
//     day = 'Monday';
//     break;
//     case 2:
//     day = 'Tuesday';
//     break;
//     case 3:
//     day = 'Wednesday';
//     break;
//     case 4:
//     day = 'Thursday';
//     break;
//     case 5:
//     day = 'Friday';
//     break;
//     case 6:
//     day = 'Saturday';
//     break;
//   }
//   res.render('list',{day: day});
// });

// app.post('/',(req,res)=>{
//
// });

app.listen(3000,()=>{
  console.log('server is running on port 3000');
});
