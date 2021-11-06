const express = require('express');
const app = express();
app.use(express.urlencoded({extended: true})); //body-parser has different modes

//get and post for simple add calculator

app.get('/',(req,res)=>{
  res.sendFile(__dirname+'/index.html'); //__dirname points to the current folder
});
app.post('/',(req,res)=>{
  var n1 = number(req.body.num1);
  var n2 = number(req.body.num2);
  var result = n1 + n2;
  res.send('The result of the calculation is:'+ result);
});

//get and post for bmi Calculator
app.get('/bmiCalculator',(req,res)=>{
  res.sendFile(__dirname+'/bmi-cal.html');
});
app.post('/bmiCalculator',(req,res)=>{
  var weight = parseFloat(req.body.weight); // 转化成小数decimal number.
  var height = parseFloat(req.body.height);
  var bmi = weight / (height * height);
  var interpretation;
  if (bmi < 18.5) {
    interpretation = ("Your BMI is " + bmi + ", so you are underweight.");
  } else if (18.5 <= bmi && bmi <= 24.9) {
    interpretation = ("Your BMI is " + bmi + ", so you have a normal weight.");
  } else {
    interpretation = ("Your BMI is " + bmi + ", so you are overweight.");
  }
  res.send(interpretation);
});



app.listen(3000,()=>{
  console.log('server started on port 3000');
});
