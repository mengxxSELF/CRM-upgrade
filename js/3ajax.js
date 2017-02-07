/* 封装ajax */
// 闭包 形成私有作用域
(function () {
    // 检测类型
    function isType(val,type){
        var realType = Object.prototype.toString.call(val);
        var reg = new RegExp('^\\[object '+type+'\\]$','i');
        // 注意这里转义两次
        return reg.test(realType);
    }
    // 通过判断URL是否包含？  返回正确连接符
    function isCode(url){
        return url.indexOf('?')>-1?'&':'?';
    };


    function ajax(url,options){
        // 判断参数形式
        if(isType(url,'object')){
            options=url;
        }
        options = options||{}; // 保证在不传递options 时候 后面循环不出错

        // 默认值
        var _def = {
            url: isType(url,'string')?url:null,
            method:'get',
            dataType:'json',
            async:true,
            cache:true,
            data:null,
            success:null
        };

        //  真实值替换默认值
        for(var attr in options){
            if(options.hasOwnProperty(attr)){
                if(attr=='type'){
                    _def['method'] = options['type'];
                }
                _def[attr] = options[attr];
            }
        }
        var regG = /^(get|delete|head)$/i,
            regP = /^(post|put)$/i;

        // data 处理
        // 1 data是对象的时候  要转为字符串
        if(isType(_def.data,'object')){
            var dataStr ='';
            for(var attr in _def.data){
                if(_def.data.hasOwnProperty(attr)){
                    dataStr += attr+'='+_def.data[attr]+'&';
                }
            }
            dataStr = dataStr.substring(0,dataStr.length-1);
            _def.data= dataStr;
        };
        // 2 在get系列时  有data的时候 进行问号传参
        if(_def.data){
            if(regG.test(_def.method)){
                _def.url+=isCode(_def.url)+_def.data;
                _def.data= null;
            }
        };


        // cache 处理  在get系列 并且传值为false
        if( _def.cache==false  && regG.test(_def.method)){
            _def.url+= isCode(_def.url)+'_='+Math.random().toFixed(2);
            // 这里可能是？ 也可能是& 所以需要判断一下
        };

        // 按照四步进行ajax
        var xhr = new XMLHttpRequest();
        xhr.open(_def.method,_def.url,_def.async);
        xhr.onreadystatechange = function () {

            if(xhr.status!==200){
                _def.error&&_def.error();
                return;
            }

            if(xhr.readyState==4){
                var result = xhr.responseText;
                // dataType
                switch(_def.dataType.toLowerCase()){
                    case 'json':
                        result= 'JSON' in window?JSON.parse(result):eval('('+result+')');
                        break;
                    case 'xml':
                        result=xhr.responseXML;
                        break;
                }
                _def.success&& _def.success.call(xhr,result);// 修改this指向
            }
        };
        xhr.send();
    };
    window.ajax =ajax;
})();
