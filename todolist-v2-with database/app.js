const express = require('express');
const app = express();

//require mongoose
const mongoose = require('mongoose');
const _ = require('lodash');


//atlas admin-ewu  SIYb80szRNAf2EDB
//url: https://hidden-stream-01817.herokuapp.com


app.use(express.urlencoded({
  extended: true
}));

app.use(express.static('public'));

app.set('view engine', 'ejs');

mongoose.connect('mongodb+srv://admin-ewu:SIYb80szRNAf2EDB@cluster0.7aii8.mongodb.net/todolistDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
})

//严格写法是 constant itemsSchema = new mongoose.Schema({...}); 下面写法随意够用:
const itemsSchema = {
  name: String
}

const Item = mongoose.model('Item', itemsSchema);

const item1 = new Item({
  name: 'Welcome to your todolist!'
});
const item2 = new Item({
  name: 'Hit the + button to add a new item.'
});
const item3 = new Item({
  name: '<-- Check this to delete an item.'
});

const defaultItems = [item1,item2,item3];

      //% custom list database:
      const listSchema = {
        name: String,
        items: [itemsSchema]
      };
      const List = mongoose.model('List', listSchema);


//* find and show results:

// model.find({conditions}, function(err, results) {
//   //use the found results docs.
// })

app.get('/', (req, res) => {

  Item.find(function(err, foundItems) {
    if (foundItems.length === 0) {
      Item.insertMany(defaultItems,
        function(err) {
          if (err) {
            console.log(err);
          } else {
            console.log('added');
          }
        });
        res.redirect('/');
    } else {
      // console.log(foundItems);
      // log to the web page:
      res.render('list', {listTitle: 'Today',newListItems: foundItems});
    }
  });

});

app.post('/', (req, res) => {

  const itemName = req.body.newItem;
  const item = new Item ({
    name: itemName
  });

//从button链接name识别页面title，把添加的任务添加到items 或者lists 对应数据库中
  const listName = req.body.list;
  if (listName==='Today') {
    item.save();
    res.redirect('/');
  } else {
    //如果页面不是主页面，则为custom页面，则需要定位到该页面名字对应的数据，再把新item添加到具体的custom list数据库中
    List.findOne({name: listName},function(err, foundList) {
      foundList.items.push(item);
      foundList.save();
      res.redirect('/'+listName); //程序引导到下面app.get('/listName'),把页面刷新贴出来
    });
  };

});


app.post('/delete',(req,res)=>{
  //1. add onChange="this.form.submit()"
  // console.log(req.body);  => { checkbox: 'on' }
  //2. add name="checkbox" to target using method
  // console.log(req.body.checkbox); => on
  //3. added a value="<%=item._id%>" to the checkbox input in list.ejs to identify the item that's deleted
  // console.log(req.body.checkbox); => get value 对应值 60ba89c326931b1e4586fb35

  //Model.findByIdAndRemove(<id>, function(err){...});
  const checkedItemId = req.body.checkbox

  //delete 也要识别主页面还是custom页面，把相应的checkbox checked从对应的数据库下面删掉.同上面app.get添加item时区分页面和数据库的方法
  const listName = req.body.listName;

  if (listName ==='Today') {
    Item.findByIdAndRemove(checkedItemId,function(err){
      if (!err) {
        console.log('deleted the checked item');
        res.redirect('/');
      }
    });
  } else {
    //mongoose Model.findOneAndUpdate({conditions},{updates},function(err,results){...});
    //$pull loop through the objects and delete item from array: $pull: {field: {key:value}}
    List.findOneAndUpdate({name: listName},{$pull: {items: {_id: checkedItemId}}}, function(err,foundList){
      if (!err) {
        res.redirect('/'+listName);
      }
    });
  };


});

//dynamic routes-custom lists pages using Express Route Parameters
//app.get('/category/:<paramName>', function(req,res){// Access req.params.paramName});
//同时通过EJS 文件实现活性输送 html 页面
//在上面创建区别开的database,见//%
app.get('/:customListName',function(req,res){

//use the show and find results mongoose function again, 以防每次输入route paramName,创建重复的collections within lists db
//lodash capitalize route parameters
const customListName = _.capitalize(req.params.customListName);

  List.findOne({name: customListName}, function(err, foundList) {
    if (!err) {
      if (!foundList) {
        //create new list
        //instance List item
          const list = new List ({
            name: customListName,
            items: defaultItems
          });
          list.save();
          //没有redirect,页面不会跳转到custom页面
          res.redirect('/'+customListName);
      } else {
        //show existing list
        res.render('list',{listTitle:foundList.name, newListItems: foundList.items})
      }
    }
  });
//到这里，页面都成功跳转到新custom页面，但是添加新任务，会添加到主route，也就是listTitle==='Today',即需要在
//app.post里进一步改进。

});



app.get('/about', (req, res) => {
  res.render('about');
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port, () => {
  console.log('server is running on port 3000');
});
