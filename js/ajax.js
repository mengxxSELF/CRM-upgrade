/*
 * ajax：package a AJAX method library, data request
 * @parameter：
 *  url：[string] address of request data
 *  options：[object] some parameters of our own configuration
 * by team on 2017/01/21
 */
~function () {
    /*
     * check：检测数据类型
     * @parameter：
     *  val：要检测的数据值
     *  type：检测是否为这个类型，例如:'string'、'array'...
     * @return：boolean
     */
    function check(val, type) {
        var curType = Object.prototype.toString.call(val);//->'[object xxx]'
        type = '[object ' + type + ']';
        return curType.toUpperCase() === type.toUpperCase();
    }

    /*
     * format：把一个对象转换为xx=xx&xx=xx...形式的字符串
     * @parameter：
     *   obj：要转换的对象
     * @return：
     *   转换完的字符串
     */
    function format(obj) {
        var res = '';
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                res += key + '=' + obj[key] + '&';
            }
        }
        res = res.substring(0, res.length - 1);
        return res;
    }


    function ajax(url, options) {

        var _default = {
            url: null,
            method: 'get',
            data: null,
            dataType: 'json',
            async: true,
            cache: true,
            success: null
        };
        //->1、对于传递的是一个参数还是两个参数进行处理
        if (typeof url === 'string') {
            _default.url = url;
        } else if (check(url, 'object')) {
            options = url;
            url = undefined;
        }

        //->2、把传递进来的参数配置信息替换原有的默认信息:需要单独处理TYPE和METHOD之间的关系,我们传递的是TYPE,我们需要把值赋值给METHOD
        for (var key in options) {
            if (options.hasOwnProperty(key)) {
                if (key === 'type') {
                    _default['method'] = options['type'];
                    continue;
                }
                _default[key] = options[key];
            }
        }

        //->3、发送AJAX请求
        /*
         * DATA参数的处理:
         * 1.验证当前URL中是否存在问号 isMark
         * 2.分不同的请求和传递的内容不相同,我们做不同的处理
         *  GET
         *    字符串:直接拼在URL的末尾
         *    对象:把对象首先转换为xxx=xxx&xxx=xxx的形式,然后在拼接在末尾
         *  POST
         *    对象需要转为xxx=xxx的字符串,然后整体都放在主体重传递给服务即可，非对象给我们的是什么，我们就给服务器传递什么
         */
        var isMark = false;
        _default.url.indexOf('?') >= 0 ? isMark = true : null;
        var chart = '?';
        isMark ? chart = '&' : null;

        if (_default.data) {
            check(_default.data, 'object') ? _default.data = format(_default.data) : null;
            if (/^(GET|DELETE|HEAD)$/i.test(_default.method)) {
                _default.url += chart + _default.data;
                _default.data = null;

                isMark = true;
                chart = '&';
            }
        }

        /*
         * CACHE参数的处理
         *  如果是GET系列的请求,并且CACHE设置为FALSE,我们需要在URL的末尾追加随机数
         */
        if (/^(GET|DELETE|HEAD)$/i.test(_default.method) && _default.cache === false) {
            _default.url += chart + '_=' + Math.random();
        }

        var xhr = new XMLHttpRequest;
        xhr.open(_default.method, _default.url, _default.async);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                var result = xhr.responseText;
                /*
                 * DADA TYPE：把从服务器获取的数据转换为我们期望的格式TEXT、JSON、XML...
                 */
                switch (_default.dataType.toUpperCase()) {
                    case 'JSON':
                        result = 'JSON' in window ? JSON.parse(result) : eval('(' + result + ')');
                        break;
                    case 'XML':
                        result = xhr.responseXML;
                        break;
                }
                /*成功触发回调函数*/
                _default.success && _default.success.call(xhr, result);
            }
        };
        xhr.send(_default.data);
    }

    window.ajax = ajax;
}();