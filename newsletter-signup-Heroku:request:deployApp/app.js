const express = require('express');
const app = express();
const https = require('https');
// app.use(express.json()) // for parsing application/json
// app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(express.urlencoded({extended: true}));

//by default, users cannot download css stylesheet from our server,
//thus, we need to enable access to a public folder
//注意html 文档中 stylesheet href 相对该公开静止目录，/ 已指 public parent folder
app.use(express.static('public'));

app.get('/',(req,res)=>{
  res.sendFile(__dirname+'/signup.html');
});

//注意获取信息要html 文档中 form 里要action="/" method="post"
app.post('/',(req,res)=>{

  //先从用户网页输入获取信息
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;

  //按mailchimp要求格式存起来
  const data = {
    members:[
      {
        email_address: email,
        status: 'subscribed',
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  }

  //JSON.parse() takes a JSON string and transforms it into a JavaScript object.
  //JSON.stringify() takes a JavaScript object and transforms it into a JSON string.
  const jsonData = JSON.stringify(data);

  const url = 'https://us6.api.mailchimp.com/3.0/lists/5c4de6553b';
  const options = {
    method: 'POST',
    auth: 'cuc:c0c02ae0f3575a4bdb47c5a45bd18ca0-us6'
  }

  //通过mailchimp端口向该data center服务器发送用户数据,并回收数据.
  //const request = https.request(options, (response) => { ... });

  const request = https.request(url, options,(response)=>{
    response.on("data",(data)=>{
      console.log(JSON.parse(data)); //这里当request触发后 回执到 nodejs.
      console.log(response.statusCode);

        if (response.statusCode === 200) {
          res.sendFile(__dirname+'/success.html');
          }
        else {
          res.sendFile(__dirname+'/failure.html');
          }

    });
  });

  request.write(jsonData); // 这里发送用户数据
  request.end();

});

app.post('/failure',(req,res)=>{
  res.redirect('/');
});
//api key  c0c02ae0f3575a4bdb47c5a45bd18ca0-us6
//list-id  5c4de6553b

app.listen(process.env.PORT || 3000,()=>{
  console.log('server is running on port 3000');
});
