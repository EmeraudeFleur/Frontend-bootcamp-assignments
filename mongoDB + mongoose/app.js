const mongoose = require('mongoose');

//Refer to database:
mongoose.connect('mongodb://localhost:27017/fruitsDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}); //连接或创建再连接database

//* Create

//3 steps:

//1-Defining a schema

//* Validation, add validators to data in Schema
//eg. min,max to Number, whether required or not,
//data failing these validators would cause error when save and won't be printed out

const fruitSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [1, 'no name']
  },
  rating: {
    type: Number,
    min: 1,
    max: 10
  },
  review: String
});

//2-Model (create collections)
const Fruit = mongoose.model('Fruit', fruitSchema);

//3-Instance, creating objects following the model in the schema

//if there is only one instance, just const fruit = new Fruit({...}); 接着fruit.save();
//if there are many types of fruits, const fruitName =.. 如下：

const apple = new Fruit({
  name: 'apple',
  rating: 6,
  review: 'good'
});

const kiwi = new Fruit({
  name: 'kiwi',
  rating: 7,
  review: 'nice'
});

const banana = new Fruit({
  name: 'banana',
  rating: 6,
  review: 'ok'
})

// 接着保存:
// Fruit.insertMany([apple, kiwi, banana], (err) => {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log('successly save to fruitsDB');
//   }
// })



//* Read

// Fruit.find(function(err, fruits) {
//   if (err) {
//     console.log(err);
//   } else {
//     mongoose.connection.close(); //获取到数据之后就退出，terminal也会退出，不再需要手动control+C
//     fruits.forEach((fruit) => {
//       console.log(fruit.name);
//     });
//   }
// });


//* Update and Delete
//updateOne/updateMany

// Fruit.updateMany({
//   name: 'apple'
// }, {
//   rating: 8
// }, function(err) {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log('updated');
//   }
// });

//deleteOne/deleteMany

// Fruit.deleteMany({name:'Ap'},function(err){
//   if (err) {console.log(err);}
//   else {
//     console.log('deleted');
//   }
// })

//* Embedded document:
//create a new schema for new collections embedding the fruitSchema

// const personSchema = new mongoose.Schema({
//   name: String,
//   age: Number,
//   favoriteFruit: fruitSchema
// });
//
// const Person = mongoose.model('Person', personSchema);


// const pineapple = new Fruit({
//   name: 'pineapple',
//   rating: 9,
//   review: 'great'
// });
// pineapple.save();


// const Kim = new Person({
//   name: 'Kim',
//   age: 20,
//   favoriteFruit: apple
// });
// Kim.save();

//add a favoriteFruit to an existing person:

// Person.updateOne({
//   name: 'John'
// }, {
//   favoriteFruit: banana
// }, function(err){
//   if (err) {
//     console.log(err);
//   } else {
//     console.log('updated');
//   }
// });
