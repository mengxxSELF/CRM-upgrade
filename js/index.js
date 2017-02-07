// 单例模式    形成私有作用域
// 命令模式  提供唯一入口  规划所有功能的先后顺序以及依赖关系
var indexRender = (function () {
    var oBody = document.getElementsByTagName('tbody')[0];
    // 根据数据渲染页面
    function renderDom(data){
        var str='';
        for(var i=0 ,len=data.length;i<len;i++){
            var cur = data[i];
            str+='<tr>\
                <td>'+cur.id+'</td>\
                <td>'+cur.name+'</td>\
                <td>\
                <button class="btn btn-info"><a href="../detail.html?id='+cur.id+'">修改</a></button>\
                <button class="btn btn-default" data-id="'+cur.id+'" >删除</button>\
                </td>\
                </tr>';
        };
        oBody.innerHTML=str;
    }
    // 删除用户  点击的时候判断用户是否确认删除
    function deleteUser(){
        oBody.onclick = function (e) {
            e=e||window.event;
            var target = e.target||e.srcElement;
            if(target.tagName.toLowerCase()== 'button'&&target.innerHTML=='删除'){
                var userId = target.getAttribute('data-id');
                var flag = confirm('确认删除ID为'+userId+'的用户信息吗？');
                if(!flag) return;
                // ajax 删除用户
                ajax('/removeInfo?id='+userId,{
                    success: function (res) {
                        if(res.code==0){
                            // 本地删除用户信息
                            oBody.removeChild(target.parentNode.parentNode);
                        };
                    }
                })


            };
        };
    };
    function init(){
    // ajax获取所有用户信息  ajax已经默认get  数据方式获取为json 所以这里不再重复
        ajax('/getAllList',{
            cache:false,
            success: function (res) {
                if(res.code!=0) return;
                var data = res.data;
                // 渲染DOM
                renderDom(data);
            //    删除用户
                deleteUser();
            }
        })
    };
    return {
        init:init
    };
})();
indexRender.init();