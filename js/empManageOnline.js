window.onload= async function(){
    //获取到tbody和form的DOM元素
    let form = document.querySelector('.enterRegion');
    let tbody = document.querySelector('.table-tbody');
//                                                     0.获取足够的一些DOM节点

    var dataTableEle=document.getElementById("dataTable");
    //通过dataTable获取到tbody
    var tbodyEle = dataTableEle.tBodies[0];
    //获取到tbody所有的按钮元素
    var tbodyAllBtns=tbodyEle.getElementsByTagName("button");
    //获取添加按钮
    var addBtnEle=document.getElementById("addBtn");
    //获取修改按钮
    var modifyBtnEle=document.getElementById("modifyBtn");
    //获取查询按钮
    var searchBtnEle=document.getElementById("searchBtn");
    //获取到用户ID输入框，用户姓名输入框，用户年龄输入框
    var userIdELe=document.getElementById("userId");
    var realNameELe=document.getElementById("userName");
    var userAgeELe=document.getElementById("userAge");
    var userSexELe=document.getElementById("userSex");
    //获取搜索框
    var searchInput =document.getElementById("searchInput");
    // 获取遮罩层和修改框
    var mask=document.getElementById("mask");
    var updataPanle=document.getElementById("updataPanle");
    //获取到更新面板的关闭按钮
    var closeSpan=document.getElementById("closeSpan");
    // 获取到更新表单的控件
    var updateId=document.getElementById("updateId");
    var updateName=document.getElementById("updateName");
    var updateAge=document.getElementById("updateAge");
    var updateSex=document.getElementById("updateSex");
    //获取到更新表格中的更新按钮
    var updateBtn=document.getElementById("updateBtn");
    

//                            引入http函数的来进行Feach参数的传送

async function http(obj) {
    // 解构赋值
    let { method, url, params, data } = obj;
  
    // 判断是否有params参数
    // 1、如果有params参数，则把params对象转换成 key=value&key=value的形式，并且拼接到url之后
    // 2、如果没有params参数，则不管
    if (params) {
      // 把对象转换成 key=value&key=value 的方法
      // 固定写法：new URLSearchParams(obj).toString()
      let str = new URLSearchParams(params).toString();
      // console.log(str)
      // 拼接到url上
      url += "?" + str;
    }
  
    // 最终的结果
    let res;
    // 判断是否有data参数，如果有，则需要设置给body，否则不需要设置
    if (data) {
      // 如果有data参数，此时直接设置
      res = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
    } else {
      res = await fetch(url);
    }
  
    return res.json();
  }

//                            封装一个Foreach函数来方便后面的使用

  // 将自定义的方法挂载到Object的构造函数中，函数接收一个对象一个回调方法
Object.prototype.constructor.forEach = function(obj,callback){
    // 判断回调是否是一个函数
        if(typeof(callback) === 'function'){
            let i = 0;
            for(let key in obj){
                callback(obj[key],i,key);
                i ++;
            }
            return;
        }
        // 传入的回调如果不是function，那么就抛出错误
        throw new Error	(callback + ' is not a function!,You can use it like this: Object.forEach(obj,(item,index,key)=>{...}) ')
    }
    
    

          
//                                                     1.渲染功能

    // 页面一打开需要首屏加载
    render();

    async function render() {
        // 获取数据
        let res = await http({
          method: 'get',
          url: 'http://101.43.73.152:10101/getUserList',
        });
        // console.log(res);
        // console.log(typeof(res));
        let htmlStr = '';
        // 遍历数组，每遍历一项，就创建一个tr出来，拼接成完整字符串再一起添加到tbody中去
        res.data.forEach( item => {
          // console.log(item)
          htmlStr += `
          <tr>
          <!-- ID单元格 -->
          <th scope="row">${item.id}</th>
          <!-- 姓名单元格 -->
          <td>${item.name}</td>
          <!-- 年龄单元格 -->
          <td>${item.age}</td>
          <!-- 性别单元格 -->
          <td>${item.gender}</td>
          <!-- 操作单元格 -->
          <td>
             <button data-id="${item.id}" class="tableTbodyButton">删除</button>
          </td>
        </tr>
          `
          
  
        });
        // console.log(htmlStr)
        // 把拼接好的数据，设置到tbody中去
        tbody.innerHTML = htmlStr;
        
      };
//                                                      2.添加功能

addBtnEle.addEventListener('click', async function (e) {
  //  阻止浏览器默认行为
  e.preventDefault()

  // 获取表单数据
    let realNameEleValue = realNameELe.value;
    let userAgeELeValue = Number(userAgeELe.value);
    let userSexEleValue = userSexELe.value;
    let newEmpObj = {
        name:realNameEleValue,
        age:userAgeELeValue,
        gender:userSexEleValue,
    }
    let result = newEmpObj
    console.log(result)
if(result.age!=0){
  // 把获取的表单数据，发送给服务器
  let res = await http({
    method: 'post',
    url: 'http://101.43.73.152:10101/addUser',
    data: result
  })
  console.log(res);
  // 通过res的status判断是否添加成功
  if (res.status.code ===0) {//因为status是一个对象，要进行判断的时候，是必须加上.code进行判断
    // 重新渲染
    render();
    // 重置表单
    form.reset();
    Toast(res.status.msg,2000);//添加成功的函数提示
  }else{
    // 重新渲染
    render();
    // 重置表单,将输入框全部变成空
    form.reset();
    Toast(res.status.msg,2000);//添加失败的函数提示
  }
}
else{
  Toast("年龄不能为空，请重新输入",2000);//原来的年龄必填，没有进行合理的判断，所有加上进行·比较合理的判断
}


})
//                                                      3.删除功能
tbody.addEventListener('click', async function (e) {
   //  阻止浏览器默认行为
   e.preventDefault()
   console.log(e.target.tagName)

  // 判断如果点击的是按钮，才进行删除
  if (e.target.tagName === 'BUTTON') {
    let res = await http({
      method: 'post',
      url: 'http://101.43.73.152:10101/deleteUser',
      data: {
        id: e.target.dataset.id
      }//post删除只能使用data去删除，而不是params
    })
    // console.log(res)
    // 判断如果删除成功，此时需要重新加载
   
      render()
    
  }
})
//                                                      4.修改功能
modifyBtnEle.addEventListener('click', async function (e) {
   //  阻止浏览器默认行为,是必须要的，不能直接给你跳转提交拉qwq
   e.preventDefault()
  console.log("点击成功");
  // 获取表单数据
    let userIdELeValue = Number(userIdELe.value);
    let realNameEleValue = realNameELe.value;
    let userAgeELeValue = Number(userAgeELe.value);
    let userSexEleValue = userSexELe.value;
    let newEmpObj = {
        id:userIdELeValue,
        name:realNameEleValue,
        age:userAgeELeValue,
        gender:userSexEleValue,
    }
    let result = newEmpObj
    console.log(result)
if(result.age!=0){//进行年龄不为空的判断，因为服务器设定为当年龄为空的时候，默认为0，所以用0来进行判断
  // 把获取的表单数据，发送给服务器
  let res = await http({
    method: 'post',
    url: 'http://101.43.73.152:10101/editUser',
    data: result
  })
  console.log(res);
  // 通过res的status判断是否添加成功
  if (res.status.code ===0) {//因为status是一个对象，要进行判断的时候，是必须加上.code进行判断
    // 重新渲染
    render();
    // 重置表单
    form.reset();
    Toast(res.status.msg,2000);//修改成功的函数提示
  }else{
    // 重新渲染
    render();
    // 重置表单,将输入框全部变成空
    form.reset();
    Toast(res.status.msg,2000);//修改失败的函数提示
  }
}
else{
  Toast("年龄不能为空，请重新输入",2000);//原来的年龄必填，没有进行合理的判断，所有加上进行·比较合理的判断
}

})
//                                                      5.查询专用的一个渲染函数
async function searchRender(resRec){
  let htmlStr = '';
// 遍历数组，每遍历一项，就创建一个tr出来，拼接成完整字符串再一起添加到tbody中去
resRec.data.forEach( item => {
  // console.log(item)
  htmlStr += `
  <tr>
  <!-- ID单元格 -->
  <th scope="row">${item.id}</th>
  <!-- 姓名单元格 -->
  <td>${item.name}</td>
  <!-- 年龄单元格 -->
  <td>${item.age}</td>
  <!-- 性别单元格 -->
  <td>${item.gender}</td>
  <!-- 操作单元格 -->
  <td>
     <button data-id="${item.id}" class="tableTbodyButton">删除</button>
  </td>
</tr>
  `
});
// console.log(htmlStr)
// 把拼接好的数据，设置到tbody中去
tbody.innerHTML = htmlStr;

 console.log(resRec);//查询之后服务器返回的结果
}

//                                                      6.查询功能
searchBtnEle.addEventListener('click', async function (e) {
  //  阻止浏览器默认行为,是必须要的，不能直接给你跳转提交拉qwq
  e.preventDefault()
 console.log("点击成功");
 // 获取表单数据
   let userIdELeValue = Number(userIdELe.value);
   let realNameEleValue = realNameELe.value;
   let userAgeELeValue = Number(userAgeELe.value);
   let userSexEleValue = userSexELe.value;
   //进行总体判断，保证四个搜索的内容都不能为空
   if(userIdELeValue==0&&realNameEleValue==""&&userAgeELeValue==0&&userSexEleValue==""){
    Toast("请在操作面板输入内容之后再进行查询！",2000);
   }else if(checkDate4(userIdELeValue,realNameEleValue,userAgeELeValue,userSexEleValue)){
    //当用户都输入了
    if(userIdELeValue!=0&&realNameEleValue!=""&&userAgeELeValue!=0&&userSexEleValue!=""){
      var newEmpObj = {
        id:userIdELeValue,
        name:realNameEleValue,
        age:userAgeELeValue,
        gender:userSexEleValue,
    }
     }
   //当用户没有输入Id
   if(userIdELeValue==0&&realNameEleValue!=""&&userAgeELeValue!=0&&userSexEleValue!=""){
    var newEmpObj = {
      name:realNameEleValue,
      age:userAgeELeValue,
      gender:userSexEleValue,
  }
   }
   //当用户没有输入Name
   if(realNameEleValue==""&&userIdELeValue!=0&&userAgeELeValue!=0&&userSexEleValue!=""){
    var newEmpObj = {
      id:userIdELeValue,
      age:userAgeELeValue,
      gender:userSexEleValue,
  }
   }
   //当用户没有输入Age
   if(userAgeELeValue==0&&realNameEleValue!=""&&userIdELeValue!=0&&userSexEleValue!=""){
    var newEmpObj = {
      id:userIdELeValue,
      name:realNameEleValue,
      gender:userSexEleValue,
  }
   }
   //当用户没有输入Gender
   if(userSexEleValue==""&&userAgeELeValue!=0&&realNameEleValue!=""&&userIdELeValue!=0){
    var newEmpObj = {
      id:userIdELeValue,
      name:realNameEleValue,
      age:userAgeELeValue,
  }
   }
   //当用户没有输入Id,Name
   if(realNameEleValue==""&&userIdELeValue==0&&userAgeELeValue!=0&&userSexEleValue!=""){
    var newEmpObj = {
      age:userAgeELeValue,
      gender:userSexEleValue,
  }
   }
   //当用户没有输入Id,Age
   if(userAgeELeValue==0&&userIdELeValue==0&&realNameEleValue!=""&&userSexEleValue!=""){
    var newEmpObj = {
      name:realNameEleValue,
      gender:userSexEleValue,
  }
   }
   //当用户没有输入Id,gender
   if(userIdELeValue==0&&userSexEleValue==""&&userAgeELeValue!=0&&realNameEleValue!=""){
    var newEmpObj = {
      name:realNameEleValue,
      age:userAgeELeValue,
  }
   }
   //当用户没有输入Name,Age
   if(realNameEleValue==""&&userAgeELeValue==0&&userIdELeValue!=0&&userSexEleValue!=""){
    var newEmpObj = {
      gender:userSexEleValue,
      id:userIdELeValue,
  }
   }
   //当用户没有输入Name,Gender
   if(realNameEleValue==""&&userSexEleValue==""&&userAgeELeValue!=0&&userIdELeValue!=0){
    var newEmpObj = {
      age:userAgeELeValue,
      id:userIdELeValue,
  }
   }
   //当用户没有输入Age和Gender
   if(userAgeELeValue==0&&userSexEleValue==""&&realNameEleValue!=""&&userIdELeValue!=0){
    var newEmpObj = {
      name:realNameEleValue,
      id:userIdELeValue,
  }
   }
   //当用户没有输入Name和Age和Gender
   if(userAgeELeValue==0&&userSexEleValue==""&&realNameEleValue==""&&userIdELeValue!=0){
    var newEmpObj = {
      id:userIdELeValue,
  }
   }
   //当用户没有输入Id和Age和Gender
   if(userAgeELeValue==0&&userSexEleValue==""&&userIdELeValue==0&&realNameEleValue!=""){
    var newEmpObj = {
      name:realNameEleValue,
  }
   }
     //当用户没有输入Name和Id和Gender
     if(userIdELeValue==0&&userSexEleValue==""&&realNameEleValue==""&&userAgeELeValue!=0){
      var newEmpObj = {
        age:userAgeELeValue,
    }
     }
      //当用户没有输入Name和Age和Id
      if(userIdELeValue==0&&userAgeELeValue==0&&realNameEleValue==""&&userSexEleValue!=""){
        var newEmpObj = {
          gender:userSexEleValue,
      }
       }

   let result = newEmpObj;
  console.log(result)//这是我传给服务器的查询数据
  
// if(result.age!=0){//进行年龄不为空的判断，因为服务器设定为当年龄为空的时候，默认为0，所以用0来进行判断
 // 把获取的表单数据，发送给服务器
 let res = await http({
   method: 'post',
   url: 'http://101.43.73.152:10101/searchUser',
   data: result
 })
 console.log(res);
 if (res.data !="") {//因为status是一个对象，要进行判断的时候，是必须加上.code进行判断
   // 重新渲染
   searchRender(res);
   // 重置表单
   form.reset();
   Toast(res.status.msg,2000);//查询成功的函数提示
 }else{
   // 重新渲染
   render();
   // 重置表单,将输入框全部变成空
   form.reset();
    Toast("查询失败，数据库中没有你所查询的用户",2000);
   
 }
}else{
  checkDate4(userIdELeValue,realNameEleValue,userAgeELeValue,userSexEleValue);
}

})


/*                                                             7.id和name和age的数据校验函数                                                         */
//校验上层修改功能(id,name,age)和查找时的数据是否输入正确的函数封装
function checkDate4(checkId,checkName,checkAge,checkSex){
  let checkIdBox=checkId;
  let checkNameBox=checkName;
  let checkAgeBox=checkAge;
  let checkSexBox=checkSex;
  if(checkIdBox>=0&&checkIdBox<=1000){//先校验ID，ID合法之后再校验其他的
     if((checkNameBox.length>=2&&checkNameBox.length<=10)||(checkNameBox.length==0)){//校验姓名，姓名合法之后再校验其他的
        if(checkAgeBox>=0&&checkAgeBox<=120){//校验年龄，年龄合法之后再校验其他的
          if(checkSexBox=="male"||checkSexBox=="female"||checkSexBox==""){//校验性别，年龄合法之后再校验其他的
            return true;
          }else{
            Toast("性别输入不合法，请重新输入",3000);
            return false;
          }
        }else{
          Toast("年龄输入不合法，请重新输入",3000);
          return false;
        }
     }else{
      Toast("姓名输入不合法，请重新输入",3000);
      return false;
     }
  }else{
      Toast("ID输入不合法，请重新输入",3000);
      return false;
  }
};
/*                                                             8.数据message提示功能                                                         */

//下面是message提示框的函数封装代码
function Toast(msg,duration){  
  // 如果没有输入提示时间，就默认3s提示
  duration=isNaN(duration)?3000:duration;
    // 创建一个新盒子来装消息
  var m = document.createElement('div');  
  // 把提示内容装进来
  m.innerHTML = msg;  
  // 把给m的div定义盒子样式
  m.style.cssText="font-size: .32rem;color: rgb(255, 255, 255);background-color: rgba(0, 0, 0, 0.6);padding: 10px 15px;margin: 0 0 0 -60px;border-radius: 4px;position: fixed;    top: 50%;left: 50%;width: 230px;text-align: center;z-index:1000;";
  // 将盒子封装好之后，放在body下面，来在HTML中显示
  document.body.appendChild(m);  
  // 设置定时器和透明度显示操作
  setTimeout(function() {  
      var d = 0.5;
      m.style.opacity = '0';  
      setTimeout(function() { document.body.removeChild(m) }, d * 1000);  
  }, duration);  
};
}  