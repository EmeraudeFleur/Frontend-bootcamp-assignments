

exports.getDate = function (){

const today = new Date();

// date format: (没有options will render default format)
const options = {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
};
return today.toLocaleDateString('en-US', options);
}




exports.getDay = function (){

const today = new Date();

// date format: (没有options will render default format)
const options = {
  weekday: 'long',
};
return today.toLocaleDateString('en-US', options);
}
