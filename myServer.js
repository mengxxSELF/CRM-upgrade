/* 后端服务器  */
// 开启服务

var http = require('http'),
    fs = require('fs'),
    url = require('url');

var port =8090;
http.createServer(function (req,res) {
// 静态资源处理  根据文件名读取文件  根据后缀修改mime类型
    var urlObj = url.parse(req.url,true);
    var pathname = urlObj.pathname; // '/css.css'
    var urlQuery = urlObj.query; // 问号传参
    // 判断后缀名
    var reg = /\.([a-zA-Z0-9]+)/i;
    var mime ='text/plain';
    var cont;
    var status; // 记录文档状态
    if(reg.exec(pathname)){
        try{
            cont  = fs.readFileSync('.'+pathname);
            status =200;
        }catch (e){
            cont = '文件内容不存在';
            status =404;
        }
        // 根据后缀重写响应头
        var end = RegExp.$1;
        switch (end.toUpperCase()) {
            case 'HTML':
                mime='text/html';
                break;
            case 'CSS':
                mime='text/css';
                break;
            case 'JAVASCRIPT':
                mime='text/javascript';
                break;
        }
        res.writeHead(status,{
            'content-type':mime+';charset=utf-8;'
        });
        res.end(cont);
    }
//  主要操作的是json数据  处理后台数据接口
    var jsonPath = './json/custom.json'; // json文件目录
    var jsonData = fs.readFileSync(jsonPath,'utf-8'); // 读出来的是字符串 需要转为 json对象
    var jsonObj = JSON.parse(jsonData); //  数据 转为 json对象
    // 返回的对象
    var result = {code: 1 , msg:'error',data:null };

    //  获取所有的客户信息
    if(pathname=='/getAllList'){
        var data = jsonObj;
        if(data.length>=0){
            result = {code:0 , mag:'success' ,data: data};
            // 重写响应头
            res.writeHead(200,{ 'content-type':'application/json;charset=utf-8;' })
            res.end(JSON.stringify(result)); // 注意以json字符串格式输出
        }
        return;
    };

// 增加用户信息  由于使用的是post 请求来处理 所以内容信息在请求体中的  是通过监听data 和 end 事件
    if(pathname=='/addInfo'){
        var getData='';
        req.on('data', function (getD) {
            getData+=getD;
        });
        req.on('end', function () {
            // 需要格式化数据 接受的是字符串 name=234&sex=boy
            getData = changeData(getData); // 转化为一个对象
            // 但是要给这个新用户增加一个id 寻找原来数据中最大的ID数 然后进行加一操作
            getData['id'] = jsonObj.length==0?1:jsonObj[jsonObj.length-1]['id']+1 ;
            jsonObj.push(getData);
            // 将数据重新写入
            fs.writeFileSync(jsonPath , JSON.stringify(jsonObj),'utf-8');
            resSend(0);
        });
    }

    // 删除用户信息   需要从问号传参 获取id
    if(pathname=='/removeInfo'){
        var id = urlQuery.id;
        jsonObj.forEach(function (item,index) {
            if(item.id==id){
                jsonObj.splice(index,1);
                // 重新写入
                fs.writeFileSync(jsonPath,JSON.stringify(jsonObj),'utf-8');
            }
        });
        resSend(0);
    }

    // 获取用户详情信息   需要从问号传参 获取id
    if(pathname=='/getInfo'){
        var id = urlQuery.id;
        jsonObj.forEach(function (item,index) {
            if(item.id==id){
                // 根据ID 查找到对象信息
                resSend(0,item);
            }
        });
    }

    // 修改用户信息   也是请求体获取信息
    if(pathname=='/updateInfo'){
        var getData ='';
        req.on('data', function (getD) {
            getData+=getD;
        });
        req.on('end', function () {
            getData = changeData(getData);
            var id = getData['id'];
            var val = getData['value']
            jsonObj.forEach(function (item,index) {
                if(item.id==id){
                    // 根据ID 查找到对象信息 进行修改
                    jsonObj[index] =getData;
                    // 重新写入
                    fs.writeFileSync(jsonPath,JSON.stringify(jsonObj),'utf-8');
                    resSend(0);
                }
            });



        });



    }


    // 输出响应体
    function resSend(code,data){
        var result={code:code,msg:'success'};
        if(data){
            result['data']=data;
        }
        res.writeHead(200,{'content-type':'application/json;charset=utf-8;'});
        res.end(JSON.stringify(result));
    }
}).listen(port, function () {
   console.log('the port is',port)
});



//需要格式化数据  返回的是对象
function changeData(str){
    var obj={};
    var reg = /([^&]+)=([^&]+)/g;
    str.replace(reg, function ($0, $1, $2) {
        obj[$1]=$2;
    });
    return obj;
};



