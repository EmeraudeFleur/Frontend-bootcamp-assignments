const express = require('express');
const https = require('https');
const app = express();

//parse html body,without install body-parser npm.
app.use(express.urlencoded({extended: true }));

//1. 最初页面加载
app.get('/',(req,res)=>{
  res.sendFile(__dirname+'/index.html');
});

//2. 获取用户输入数据：
app.post('/',(req,res)=>{
  const query = req.body.cityName; //index.html中 name
  const units = 'metric';
  const appid = '0e7cec6f96ec8324a5174e7511d2a181';

  const url = 'https://api.openweathermap.org/data/2.5/find?q='+query+'&units='+units+'&appid='+appid;

  //通过endpoint 获取天气信息
  https.get(url,(response)=>{
    console.log(response.statusCode);

    response.on('data',(d)=>{

      //JSON.parse 转换data成json file. 也可以把json 转换成 string: JSON.stringify(object);
      const weatherData = JSON.parse(d);
      const temp = weatherData.list[0].main.temp;
      const description = weatherData.list[0].weather[0].description;

      //获取并展现图片：
      const icon = weatherData.list[0].weather[0].icon; //获取icon数据编号；
      const iconUrl = 'http://openweathermap.org/img/wn/' + icon + '@2x.png';

      //不能多次 res.send,只能写一次；故res.write 多次，再一次性全部send:
      res.write('<h1>The current temperature in '+query+' is '+temp+' degrees Celcius.</h1>');
      res.write('<p>The weather is '+description+'.</p>');
      res.write("<img src="+iconUrl+" alt='weather icon'>");
      res.send();

      });
    });

});

app.listen(3000,()=>{console.log('server is running on port 3000')});
