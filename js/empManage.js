// 关于数据操作的具体业务逻辑
// empData变量，代表的是存储所有员工信息的数据，这个数组存储的是一个个对象
// 员工的信息有id name age creatime

/*                                                             1.数据渲染功能                                                           */

//窗口内容加载完毕事件，当内容加载完毕之后，我们再去执行js代码，就没问题了
window.onload=function(){
    //获取页面中的数据表格dataTable
var dataTableEle=document.getElementById("dataTable");
//通过dataTable获取到tbody
var tbodyEle = dataTableEle.tBodies[0];
//获取添加按钮
var addBtnEle=document.getElementById("addBtn");
//获取每次递增的ID，每次调用新增的时候，就+1，每次调用删除的时候就-1
var incrementID="2";
//获取到用户ID输入框，用户姓名输入框，用户年龄输入框
var userIdELe=document.getElementsByName("userId")[0];
var realNameELe=document.getElementsByName("realName")[0];
var userAgeELe=document.getElementsByName("userAge")[0];
var userSexELe=document.getElementsByName("userSex")[0];
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

//数据渲染，将data.js里面的数据显示在表格里面
for (let i = 0; i < empData.length; i++) {
    //每有一个员工的信息，我们就在tbody里面创建一个tr
    var newTr=tbodyEle.insertRow(i);

    //获取每个员工的对象
    var empObj=empData[i];

    //给newTag创建td单元格
    setTd(empObj,newTr);
};


/*                                                             2.数据添加功能                                                           */

addBtnEle.onclick=function(){
//获取到用户ID输入框，用户姓名输入框，用户年龄输入框的值
    var userIdValue = incrementID;
    var realNameEleValue = realNameELe.value;
    var userAgeELeValue = userAgeELe.value;
    var userSexEleValue = userSexELe.value;
    //进行数据判断，判断输入数据是否合法
if(checkDate2(realNameEleValue,userAgeELeValue)){
        //不为空，我们才将把数据放到empData数组中
        //先把数据封装为js对象
        var newEmpObj = {
            id:userIdValue,
            name:realNameEleValue,
            age:userAgeELeValue,
            sex:userSexEleValue,
            createtime: new Date().toLocaleDateString()
        }
    //把newEmpObj放到数组的末尾,使用push进行插入尾部即可
    empData.push(newEmpObj);
    Toast("添加成功",3000);
    
    //我们直接将数据添加道tbody里面
    var newTr=tbodyEle.insertRow(tbodyEle.rows.length);//再tboy的最后面创建一行
    setTd(newEmpObj,newTr);
    setUpdateDeleteEvent();//每次添加完毕之后，我们都要重新赋予删除和修改事件，不然新加的行，会出现没用事件，点击没用的情况
    incrementID=(Number(incrementID)+1).toString();//每次新增完毕之后，让ID加1即可
    // 注意上面这里使用了，一个很离谱的东西，因为每次输入的ID是递增的，都是递增时要求加1为int型，但是我们搜索的时候，对象的值是string,如果我们不将其转化为字符串型的话，搜索功能会直接无效
    }else{ 
    //提示输入不合法
    checkDate2(realNameEleValue,userAgeELeValue);
};
};
//我们把给tr创建tr并且设置内容的代码给封装道一个方法里
function setTd(empObj,trEle){
    trEle.insertCell(0).innerText=empObj.id;//ID单元格
    trEle.insertCell(1).innerText=empObj.name;//姓名单元格
    trEle.insertCell(2).innerText=empObj.age;//年龄单元格
    trEle.insertCell(3).innerText=empObj.sex;//性别单元格
    trEle.insertCell(4).innerText=empObj.createtime;//时间单元格
    trEle.insertCell(5).innerHTML="<button>修改</button><button>删除</button>";//empObj为数据来源,trEle为给哪个行添加数据
}

/*                                                             3.数据删除功能                                                           */

//获取到tbody所有的按钮元素
var tbodyAllBtns=tbodyEle.getElementsByTagName("button");
//上面数组中的偶数下标的都是修改按钮，其他的都是删除按钮

// 下面给修改和删除按钮添加单击事件
function setUpdateDeleteEvent(){
    for(var i=0;i<tbodyAllBtns.length;i++){
        if(i%2==0){//表示偶数下标
            tbodyAllBtns[i].onclick=function(){
           mask.style.display="block";//使mask遮罩层显示
           updatePanle.style.display="block";//使updatePanle更新面板显示
           //设置updatePanle更新面板的位置
        //    获取页面内容区域的(行和宽-300)/2即可得到中间的
        updatePanle.style.left=(window.innerWidth-300)/2+"px";
        updatePanle.style.top=(window.innerHeight-300)/2+"px";
        //如何设置的？因为我们定义的更新面板为300*300要为其留300空间，并且处于中间的位置,所有长和宽只要减300在除2即可达到要求
           //分别获取到修改按钮行的第一到第三个单元格的内容
        var updataTr = this.parentNode.parentNode;
        // 旧ID
        var oldId = updataTr.cells[0].innerText;
        // 旧name
        var oldName = updataTr.cells[1].innerText;
        // 旧age
        var oldAge = updataTr.cells[2].innerText;
        //旧sex
        var oldSex= updataTr.cells[3].innerText;
        //把旧的值设置给表单中的控件
        updateId.value=oldId;
        updateName.value=oldName;
        updateAge.value=oldAge;
        updateSex.value=oldSex;
         }
        }else{
            tbodyAllBtns[i].onclick=function(){
            //从tbody里面删除
            var tf=confirm("确定删除?");//在这里，我们进行删除的确认，确认是否删除操作
            if(tf){
                //谁触发了点击事件，this就是谁
            var deleteTr=this.parentNode.parentNode;//为什么要二个parentNode?第一个找的是td，第二个找到是tr
    
        //    获取删除行的id，我们必须在删除行之前写这个，因为删除之后就拿不了了
               var deleteId=deleteTr.cells[0].innerText;
             //从Table里面删除
            tbodyEle.removeChild(deleteTr);
            // 从对象数组里面删除
            deleteEmpById(deleteId);
        };
        };
    }
    }
};
setUpdateDeleteEvent();//每次删除完毕之后，我们都要重新赋予删除和修改事件，不然新加的行，会出现没用事件，点击没用的情况

//定义根据id删除用户的方法（从data.js的数组中删除）
function deleteEmpById(deleteId){
    for (let i = 0; i < empData.length; i++) {
        //empData[i]表示拿到每一个员工对象
        if(empData[i].id == deleteId){
           //如果判断相等，循环变量i就是要删除数据的下标
           empData.splice(i,1);
           Toast("删除成功",3000);
        };
        
    };
};
/*                                                             4.数据搜索功能                                                           */
// 给搜索框添加事件，oninput和onchange
//经过实验我们可以知道，onchange是输入之后按回车键了才会调用
//oninput是在输入过程中，只要输入了，就会调用该函数
searchInput.oninput=function(){
 //获取搜索框的值
 var searchValue = this.value;
 console.log(searchValue);
 //只要一改变，我们就需要从数组中去进行判定
 //可以理解成那searchValue和数组里面的内容去进行比较，只要某个字段包含了这个值，就在tbody中马上显示,因为是和数组中的每个元素比较，所以我们一定是循环比较的

//清空tbody的内容,每次使用这个输入调用的事件，在显示匹配的结果之前我们都清空一次
tbodyEle.innerHTML="";
 let count=0;//用来作为符合要求的数据的下标参考
 for (let i = 0; i < empData.length; i++){
    //获取到每个员工对象
    var empObj=empData[i];
//如何通过js判断字段是否包含要查询的值[id,name,age,createtime]
     if(empObj.id.indexOf(searchValue)!=-1||empObj.name.indexOf(searchValue)!=-1||
     empObj.age.indexOf(searchValue)!=-1||empObj.sex.indexOf(searchValue)!=-1||empObj.createtime.indexOf(searchValue)!=-1){
        var newTr=tbodyEle.insertRow(count);//我们这里不能在使用i了，因为i的满足结果的插入会导致出现空行，我们最好定义一个0，在每次循环找到符合要求的结果后，我们就从最上面插入（即0行），这样就不会导致小标乱搞
        setTd(empObj,newTr);
        setUpdateDeleteEvent();

     }
 };
};
/*                                                             5.数据修改功能                                                           */

// 点击修改按钮打开更新面板以及遮罩层
closeSpan.onclick=closeMaskAndUpdatePanel;

function closeMaskAndUpdatePanel(){
    mask.style.display="none";//使mask遮罩层显示
    updatePanle.style.display="none";//使updatePanle更新面板显示
};
//给更新表格中的保存修改按钮加上鼠标点击事件
updateBtn.onclick=function(){
    //一点击修改之后，就获取到表单中的数据
    var newId=updateId.value;
    var newName= updateName.value;
    var newAge=updateAge.value;
    var newSex=updateSex.value;
    //我们可知在数组里面的下标，正好也就是tbody中tr的下标
    for (let i = 0; i < empData.length; i++) {
        //empData[i]表示拿到每一个员工对象
        if(empData[i].id == newId){
          //这个i就表示数组里面的下标，以及tbody中要修改的tr的下标
          var updataTr=tbodyEle.rows[i];
          if(checkDate2(newName,newAge)){
          updataTr.cells[1].innerHTML=newName;
          updataTr.cells[2].innerHTML=newAge;
          updataTr.cells[3].innerHTML=newSex;
        //同时，我们还要把数据里面的数据也必须给改了
        empData[i].name=newName;
        empData[i].age=newAge;
        empData[i].sex=newSex;
        //   点击保存，同时关闭遮罩层和更新面板
        closeMaskAndUpdatePanel();
        Toast("修改成功，请查看具体修改内容",3000);
        }else{
            checkDate2(newName,newAge);
        }
    };
        
    };
};
/*                                                             6.数据message提示功能                                                         */

//下面是message提示框的函数封装代码
function Toast(msg,duration){  
    // 如果没有输入提示时间，就默认3s提示
    duration=isNaN(duration)?3000:duration;
      // 创建一个新盒子来装消息
    var m = document.createElement('div');  
    // 把提示内容装进来
    m.innerHTML = msg;  
    // 把给m的div定义盒子样式
    m.style.cssText="font-size: .32rem;color: rgb(255, 255, 255);background-color: rgba(0, 0, 0, 0.6);padding: 10px 15px;margin: 0 0 0 -60px;border-radius: 4px;position: fixed;    top: 10%;left: 45%;width: 230px;text-align: center;z-index:1000;";
    // 将盒子封装好之后，放在body下面，来在HTML中显示
    document.body.appendChild(m);  
    // 设置定时器和透明度显示操作
    setTimeout(function() {  
        var d = 0.5;
        m.style.opacity = '0';  
        setTimeout(function() { document.body.removeChild(m) }, d * 1000);  
    }, duration);  
};  

/*                                                             7.id和name和age的数据校验函数                                                         */
//校验上层修改功能(id,name,age)和查找时的数据是否输入正确的函数封装
function checkDate3(checkId,checkName,checkAge){
    let checkIdBox=checkId;
    let checkNameBox=checkName;
    let checkAgeBox=checkAge;
    if(checkIdBox>=0&&checkIdBox<=1000){
       if((checkNameBox.length>=2&&checkNameBox.length<=10)||(checkNameBox.length==0)){
          if(checkAgeBox>=0&&checkAgeBox<=120){
            return true;
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
//校验添加,表单修改功能(name,age)的数据是否输入正确的函数封装
function checkDate2(checkName,checkAge){
    let checkNameBox=checkName;
    let checkAgeBox=checkAge;
    if(checkNameBox.length>=2&&checkNameBox.length<=10){
        //先校验姓名,姓名通过之后再校验年龄
       if(checkAgeBox>=0&&checkAgeBox<=120){
         //姓名校验通过，年龄校验通过，返回true
         return true;
       }else{
          //姓名校验通过，年龄校验不通过，返回false，并且弹出message提示框
        Toast("年龄输入不合法，请重新输入",3000);
        return false;
       }
        //姓名校验不通过，我们直接调用message函数弹出错误提示
    }else{
        Toast("姓名输入不合法，请重新输入",3000);
        return false;
    }
};
//校验上层搜索功能(id,name,age)和查找时的数据是否输入正确的函数封装
//校验ID
function checkSearchId(checkId){
    let checkIdBox=checkId;
    if(checkIdBox>=0&&checkIdBox<=1000){
        return true;
    }else{
        Toast("ID输入不合法，请重新输入",3000);
        return false;
    };
};
// 校验姓名
function checkSearchName(checkName){
    let checkNameBox=checkName;
       if((checkNameBox.length>=2&&checkNameBox.length<=10)){
        return true;
       }else{
        Toast("姓名输入不合法，请重新输入",3000);
        return false;
       };
};
//校验年龄
function checkSearchAge(checkAge){
    let checkAgeBox=checkAge;
          if(checkAgeBox>=0&&checkAgeBox<=120){
            return true;
          }else{
            Toast("年龄输入不合法，请重新输入",3000);
            return false;
          }
    };
/*                                                             8.重置按钮功能                                                         */

resetBtn.onclick=function(){
    userIdELe.value="";
    realNameELe.value="";
    userAgeELe.value="";
    //上面是将ID和姓名和年龄输入框进行清空操作，回答无输入状态
    searchInput.value="";
    //上面是将搜索框进行清空操作，回到无输入状态
    tbodyEle.innerHTML="";
    //上面是将整个显示表格进行清空，如果不进行清空，再重新数据渲染进行显示的话，我们上次搜索的项会得到保留
    //下面是重新进行数据渲染，将默认data的数据重新写入，相对于重置
    for (let i = 0; i < empData.length; i++) {
        //每有一个员工的信息，我们就在tbody里面创建一个tr
        var newTr=tbodyEle.insertRow(i);
    
        //获取每个员工的对象
        var empObj=empData[i];
    
        //给newTag创建td单元格
        setTd(empObj,newTr);
        setUpdateDeleteEvent();//记得加上点击事件，不然整个系统的修改和删除直接全部失效
    };
};
/*                                                             9.操作面板修改功能                                                         */
modifyBtn.onclick=function(){
    var modifyId=userIdELe.value;
    var modifyIdName= realNameELe.value;
    var modifyIdAge=userAgeELe.value;
    var modifyIdSex=userSexELe.value;
    let modifyCount=0;//计数是否找到对应的ID，用来进行消息提示的判断
    //上面是获取输入框的值，来保存给修改变量
    if(checkDate3(modifyId,modifyIdName,modifyIdAge)){
    for (let i = 0; i < empData.length; i++) {
        //empData[i]表示拿到每一个员工对象
        if(empData[i].id == modifyId){
          //这个i就表示数组里面的下标，以及tbody中要修改的tr的下标
          var modifyTr=tbodyEle.rows[i];
            modifyTr.cells[1].innerText=modifyIdName;
            modifyTr.cells[2].innerText=modifyIdAge;
            modifyTr.cells[3].innerText=modifyIdSex;
        //同时，我们还要把数据里面的数据也必须给改了
        empData[i].name=modifyIdName;
        empData[i].age=modifyIdAge;
        empData[i].sex=modifyIdSex;
        Toast("修改成功，请查看具体修改内容",3000);
        modifyCount++;
        }else{
             if(modifyCount==0)
                {
                      Toast("没有找到你输入的ID，请重新输入",3000);//根据查找的empData[i].id == modifyId不通过，所给出的错误输入id，提示重新输入
                }
        };
};
}else{
    checkDate3(modifyId,modifyIdName,modifyIdAge);//id或者name或者age检测不通过，进入else，再次调用是为了弹出错误提示
    };
};

/*                                                             10.操作面板查找功能  这个仍存在问题还没修复完毕                                                       */
searchBtn.onclick=function(){
    //下面是将输入框的值再次调用出来，帮助查找
    var searchId=userIdELe.value;
    var searchName= realNameELe.value;
    var searchAge=userAgeELe.value;
    //清空tbody的内容,每次使用这个输入调用的事件，在显示匹配的结果之前我们都清空一次
    tbodyEle.innerHTML="";
    let count=0;//用来作为符合要求的数据的下标参考
    if((searchId == undefined || searchId === '')&&(searchName == undefined || searchName === '')&&(searchAge == undefined || searchAge === '')){
        Toast("搜索框输入为空，查询无结果，请重新输入",3000);
        tbodyEle.innerHTML="";//判断用户是不是没有输入，让用户重新输入,没有输入为空的，在进入下一步
    }else if(checkDate3(searchId,searchName,searchAge)){
        for (let i = 0; i < empData.length; i++){
       //获取到每个员工对象
       let empPanelObj=empData[i];
    // 如何通过js判断字段是否包含要查询的值[id,name,age,createtime]
        if((empPanelObj.id.includes(searchId)==true)&&(empPanelObj.name.includes(searchName)==true)&&(empPanelObj.age.includes(searchAge)==true)&&(typeof searchId == 'string' && searchId.length > 0)&&(((typeof searchAge.toString()) == 'string') && (searchAge.toString).length > 0)&&(typeof searchName == 'string' && searchName.length > 0)){
            var newPanelTr=tbodyEle.insertRow(count);
            setTd(empPanelObj,newPanelTr);
            setUpdateDeleteEvent();
            Toast("搜索成功",3000);//这里是全输入的情况，但是要注意全部没输入的话也包括了，所有我们需要把全部没输入加个判断直接不进入循环,并且我们给其加上了不为空的条件，只要当全部输入之后，才会进行这个判断
        };
        if((searchId == undefined || searchId === '')&&(empPanelObj.name.includes(searchName)==true)&&(empPanelObj.age.includes(searchAge)==true)&&(((typeof searchAge.toString()) == 'string') && (searchAge.toString).length > 0)&&(typeof searchName == 'string' && searchName.length > 0)){
            var newPanelTr=tbodyEle.insertRow(count);
            setTd(empPanelObj,newPanelTr);
            setUpdateDeleteEvent();
            Toast("搜索成功",3000);//这里是Id空到没写的情况，Name和Age输入了进行搜索,Name和Age不能为空
        };
        if((empPanelObj.id.includes(searchId)==true)&&(searchName == undefined || searchName === '')&&(empPanelObj.age.includes(searchAge)==true)&&(typeof searchId == 'string' && searchId.length > 0)&&(((typeof searchAge.toString()) == 'string') && (searchAge.toString).length > 0)){
            var newPanelTr=tbodyEle.insertRow(count);
            setTd(empPanelObj,newPanelTr);
            setUpdateDeleteEvent();
            Toast("搜索成功",3000);//这里是Name空到没写的情况，Id和Age输入了进行搜索,Id和Age不能为空
        };
        if((empPanelObj.id.includes(searchId)==true)&&(empPanelObj.name.includes(searchName)==true)&&(searchAge == undefined || searchAge === '')&&(typeof searchId == 'string' && searchId.length > 0)&&(typeof searchName == 'string' && searchName.length > 0)){
            var newPanelTr=tbodyEle.insertRow(count);
            setTd(empPanelObj,newPanelTr);
            setUpdateDeleteEvent();
            Toast("搜索成功",3000);//这里是Age空到没写的情况，Id和Name输入了进行搜索,Id和Name不能为空
        };
        if((searchId == undefined || searchId === '')&&(searchName == undefined || searchName === '')&&(empPanelObj.age.includes(searchAge)==true)){
            var newPanelTr=tbodyEle.insertRow(count);
            setTd(empPanelObj,newPanelTr);
            setUpdateDeleteEvent();
            Toast("搜索成功",3000);//这里是Id和Name空到没写的情况，用Age输入了进行搜索
        };
        if((empPanelObj.id.includes(searchId)==true)&&(searchName == undefined || searchName === '')&&(searchAge == undefined || searchAge === '')){
            var newPanelTr=tbodyEle.insertRow(count);
            setTd(empPanelObj,newPanelTr);
            setUpdateDeleteEvent();
            Toast("搜索成功",3000);//这里是Age和Name空到没写的情况，用Id输入了进行搜索
        };
        if((searchId == undefined || searchId === '')&&(empPanelObj.name.includes(searchName)==true)&&(searchAge == undefined || searchAge === '')){
            var newPanelTr=tbodyEle.insertRow(count);
            setTd(empPanelObj,newPanelTr);
            setUpdateDeleteEvent();
            Toast("搜索成功",3000);//这里是Id和Age空到没写的情况，用Name输入了进行搜索
        };
        
    };

    if(tbodyEle.innerHTML==""){
        Toast("搜索失败，系统中没有符合条件的用户",3000);
    }
}else{
    checkDate3(searchId,searchName,searchAge);
};
};

};

