/*

  DOM 是使用javascript 操纵html文本,css样式很重要的基础结构知识。
  DOM最首位的是document.所有查看内容都要先选中document.再使用选择方法。

  getElementsByTagName; getElementsByName(应该是className.)得到的是数组，即使文档中只有一个元素，也要加上index,也就是下标序号 [number].
  只有一个元素，或者选择第一个元素，要写getElementByTagName("tagName")[0].
  getElementByID 得到的是单个item.不再需要加index
  querySelector("")(联想CSS 中 selectors，这个方法中可以选单个selector，也可以像CSS中一样联合使用)
  querySelector()如果选择的selectors 对应不止一个item,结果只选择第一个满足条件的。如果选择所有的，则使用 querySelectorAll, 得到所有子节点，
  由此我们可以使用这个方法选择非首位的其他元素，querySelectorAll("")[num].
  还可以使用 children[number].

  上面是选择节点。选择节点就可以查看内容，选择了节点也可以进而改变attribute 样式。比如 querySelectorAll[2].style.color="";
  JS 中names are camel cased. 改变其他样式，名字都要这样写，比如 document.querySelector("").style.fontSize="10rem";
  而css 中写作font-size:10rem; JS camel casing 替代 - ，样式都要转化成字符串，加"".

  如何用JS添加样式？
  先在CSS文档中添加新class selector, 新样式font-size: 10rem;
  console 中 添加这个样式 document.querySelector("h1").classList.add("huge");
  取消这个样式/className, document.querySelector("h1").classList.remove("huge");
  切换设置（已运用的话取消，没有的话运用）document.querySelector("h1").classList.toggle("huge")

  那如何改变文字呢？
    .innerHTML(节点下所有内容,包括别的tag); innerText（节点下所有文字，不包含别的tag）textContent;
    querySelector("").innerHTML="";
    注意：innerHTML只用于需要改变文字内容的时候，而如果需要改变文字样式，只需要定位该object.
    比如用到this（identity of event triggered object)的时候。this.style.color="white";this.innerHTML.style.color没有用。
    attributes 是所有在tag <>内 除tag本身以外的属性。

  如何改变属性呢？
  document.querySelector("a").getAttribute; 查看有哪些属性；
  document.querySelector("a").getAttribute("href"); 查看具体属性；
  document.querySelector("a").setAttribute("href","新网址"); 第一个参数是想要改变的属性名称，第二个参数是想要改变的属性内容。

  ----eventTarget.addEventListener()
  1. document.querySelector("button").addEventListener("click",functionName);
     function functionName(){alert("I got clicked!");}
  2. annoymous function 把函数直接融入该方法：document.querySelector("button").addEventListener("click",function(){alert("I got clicked!")});

# Higher order function/Passing functions as statement（函数级别）:

function add(num1,num2){return num1+num2;}
function subtract(num1,num2){return num1-num2;}
function multiply(num1,num2){return num1*num2;}
function divide(num1,num2){return num1/num2;}
function calculator(num1,num2,operator){return operator(num1,num2);}

call: eg. calculator(2,3,add);

# 下面相当于计算机的addEventListener 的 callback function.
举例 keydown 这一种type of event:
function addAnotherEventListener(typeOfEvent, callback){
//detect event code，计算机更基层编程
//一旦探测到事件，下面的object will be initialised
var eventThatHappend ={
eventType:"keydown",
key:"p",
durationOfKeydown:2
}
if (eventThatHappend.eventType===keydown){
callback(eventThatHappend);
}
}

# creating objects
var objName = {
property1:"",
property2:"",
property3:""
}
//注意:
1. objName 不带（），接 = 。
2. property 之间用逗号，而不是分号。
3. 不同property的类型，包括：string （加""）；number (直接写);
boolean value (写true or false)；array (同数组表达方法，["str1","str2",num1,num2]);

eg. var bellBoy1 {
name: "Tommy",
age: 19,
hasWorkPermit: true,
languages: ["French","English"]
}
# Constructor function

function BellBoy (name, age, hasWorkPermit, languages) {
this.name = name;
this.age = age;
this.hasWorkPermit = hasWorkPermit;
this.languages = languages;
}
constructor function里面甚至可以加别的函数，只要加入 this.functionName = functionName();
单独调用该函数则为 call method. 写成：objName.function();
eg. 添加 this.moveSuitcase = function(){
alert("May I take your suitcase?");
pickUpSuitcase();
move();
}

如果已经initialised an object called bellBoy1, 可以直接 call method:bellBoy1.moveSuitcase();

注意：funciton name is no longer camel cased. 首字母也要大写。

# Initialise object
var bellBoy1 = new BellBoy("Jimmy", 19, true, ["English","Japanese"]);
var bellboy2 = new BellBoy("Timmy", 18, false, ["English","German"]);

*/
