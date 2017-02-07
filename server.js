var http  = require('http'),
    fs=require('fs'),
    url=require('url');
var port = 9999;


// 开启服务
// 静态资源文件处理
// 根据API设置接口服务

http.createServer(function (req,res) {
    var urlObj = url.parse(req.url,true),
        pathname= urlObj.pathname,
        query=urlObj.query;

    // 1 静态资源文件处理

    // .css .html .mp4  匹配后缀 查找文件
    var reg = /\.([a-zA-Z0-9]+)/i;
    var status = cont =null;
    var mime='text/plain';
    if(reg.exec(pathname)){
        try{
            cont = fs.readFileSync('.'+pathname);
            status=200;
        }catch (e){
            status=404;
            cont = 'not content';
        }

        // 根据后缀修改mime
        var end = RegExp.$1.toLowerCase();
        switch (end){
            case 'css':
                mime='text/css';
                break;
            case 'html':
                mime='text/html';
                break;
            case 'js':
                mime='text/javascript';
                break;
        }
        // 重写头部
        res.writeHeader(status,{'content-type':mime+';charset=utf-8;'});
        res.end(cont);

    }
    // 2 编写对应端口 服务  主要是对于json数据文件进行操作
    var dataPath = './json/custom.json';
    var userIn= fs.readFileSync(dataPath);
    var userInfo = userIn.length==0?[]:JSON.parse(userIn); // 转为json格式的数组对象

    var result = { code:1 ,msg:'error',data:null};
//  获取所有的用户信息
    if(pathname=='/getAllList'){
        result={code:0 ,msg:'success' ,data:userInfo};
        res.writeHead(200,{'content-type':'application/json;charset=utf-8;'});
        res.end(JSON.stringify(result));
        return;
    };
//    增加用户信息  post方式  处理请求体 将其格式化
    if(pathname=='/addInfo'){
        // 接收请求体使用的是事件监听
        var user ='';
        req.on('data', function (data) {
            user+=data;
        });
        req.on('end', function () {
            // 处理数据
            user= format(user);// {name:ggg}
            // 为其增加一个ID 查找原数据中最大ID 加1
            user['id'] =  userInfo.length==0?1: Number(userInfo[userInfo.length-1]['id'])+1;
            userInfo.push(user);
            fs.writeFileSync(dataPath,JSON.stringify(userInfo));
            addEnd();
            return;
        })
    };
    // 修改客户信息  post  修改请求体
    if(pathname=='/updateInfo'){
        var user = '';
        req.on('data', function (data) {
            user+=data;
        });
        req.on('end', function () {
            user = format(user);
            var userId = user['id'];
            // 遍历数组进行修改
            var findUser = userInfo.filter(function (item,index) {
                return (item['id']==userId);
            });
            if(findUser.length>0){
                userInfo[userInfo.indexOf(findUser[0])] = user;
                // 重新写入文档
                fs.writeFileSync(dataPath,JSON.stringify(userInfo));
                addEnd(userInfo);
            }else{
                res.writeHead(200,{'content-type':'application/json;charset=utf-8;'})
                res.end(JSON.stringify(result));
            }
        })
    };
    // 获取指定客户的信息  get  问号传参
    if(pathname=='/getInfo'){
        var userId = query['id'];
        var getUser = userInfo.filter(function (item) {
            return (item['id']==userId);
        });
        if(getUser.length>0){
            var data = getUser[0];
            addEnd(data);
        }else{
            // 没有找到
            res.writeHead(200,{'content-type':'application/json;charset=utf-8;'})
            res.end(JSON.stringify(result));
        }

    }
    // 删除用户信息 get 问号传参
    if(pathname=='/removeInfo'){
        var userId = query['id'];
        userInfo.forEach(function (item,index) {
            if(item['id']==userId){
                userInfo.splice(index,1);
            }
        });
        // 重新写入
        fs.writeFileSync(dataPath,JSON.stringify(userInfo));
        addEnd();
    }

    // 正确的返回
    function addEnd(data){
        data=data||null;
        result={code:0 ,msg:'success' ,data:data};
        res.writeHead(200,{'content-type':'application/json;charset=utf-8;'})
        res.end(JSON.stringify(result));
    }


}).listen(port, function () {
    console.log('the port is',port);
});


//请求体 格式化  ?name=xxx&age=45
function format(str){
    var reg = /([^?=&]+)=([^?=&]+)/g;
    var obj={};
    str.replace(reg, function ($0,$1,$2) {
        obj[$1]=$2;
    });
    return obj;
}



