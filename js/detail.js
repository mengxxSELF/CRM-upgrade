/* 详情页 */
// 根据ID判断是添加用户还是修改
// 点击按钮 进行添加或者修改

var username = document.getElementById('userName');
var submit = document.getElementById('submit');

var detailRender =(function () {
    // 处理字符串为对象
    String.prototype.format= function () {
        var reg = /([^&?=]+)=([^&?=]+)/g;
        var obj={};
        this.replace(reg, function ($0,$1,$2) {
            obj[$1] = $2;
        });
        return obj;
    };

    // 根据ID获取用户信息
    function getInfor(id){
        ajax('/getInfo?id='+id,{
           success: function (res) {
               if(res.code==0){
                   username.value= res.data.name;
               };
           }
        });
    }
    //根据是否有ID 进行增加用户或者修改用户
    function writeUser(id){
        var userN = username.value;
        var url = data =null;
        if(!userN) {
            alert('输入不得为空');
            return;
        };
        // 有ID
        if(id){
            url= '/updateInfo' ;
            data={id:id ,name:userN};
        }else{
            // 无ID
            url= '/addInfo' ;
            data={name:userN};
        };
        ajax(url,{
            method:'post',
            data:data,
            success: function (res) {
                if(res.code==0){
                    alert('成功');
                    window.location.href = './index.html';
                }else{
                    alert('失败');
                }
            }
        })
    }

    function init(){
        // 判断URL 处理URL
        var url = window.location.href;
        var urlObj = url.format();
        // 如果用户ID存在
        var userId = urlObj['id'];
        if(userId){
            getInfor(userId);
        };
    // 按钮点击 根据是否有ID 进行增加用户或者修改用户
        submit.onclick = function () {
            writeUser(userId);
        };


    };
    return {
        init:init
    }
})();
detailRender.init();