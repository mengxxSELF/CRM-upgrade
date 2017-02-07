/* ��˷�����  */
// ��������

var http = require('http'),
    fs = require('fs'),
    url = require('url');

var port =8090;
http.createServer(function (req,res) {
// ��̬��Դ����  �����ļ�����ȡ�ļ�  ���ݺ�׺�޸�mime����
    var urlObj = url.parse(req.url,true);
    var pathname = urlObj.pathname; // '/css.css'
    var urlQuery = urlObj.query; // �ʺŴ���
    // �жϺ�׺��
    var reg = /\.([a-zA-Z0-9]+)/i;
    var mime ='text/plain';
    var cont;
    var status; // ��¼�ĵ�״̬
    if(reg.exec(pathname)){
        try{
            cont  = fs.readFileSync('.'+pathname);
            status =200;
        }catch (e){
            cont = '�ļ����ݲ�����';
            status =404;
        }
        // ���ݺ�׺��д��Ӧͷ
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
//  ��Ҫ��������json����  �����̨���ݽӿ�
    var jsonPath = './json/custom.json'; // json�ļ�Ŀ¼
    var jsonData = fs.readFileSync(jsonPath,'utf-8'); // �����������ַ��� ��ҪתΪ json����
    var jsonObj = JSON.parse(jsonData); //  ���� תΪ json����
    // ���صĶ���
    var result = {code: 1 , msg:'error',data:null };

    //  ��ȡ���еĿͻ���Ϣ
    if(pathname=='/getAllList'){
        var data = jsonObj;
        if(data.length>=0){
            result = {code:0 , mag:'success' ,data: data};
            // ��д��Ӧͷ
            res.writeHead(200,{ 'content-type':'application/json;charset=utf-8;' })
            res.end(JSON.stringify(result)); // ע����json�ַ�����ʽ���
        }
        return;
    };

// �����û���Ϣ  ����ʹ�õ���post ���������� ����������Ϣ���������е�  ��ͨ������data �� end �¼�
    if(pathname=='/addInfo'){
        var getData='';
        req.on('data', function (getD) {
            getData+=getD;
        });
        req.on('end', function () {
            // ��Ҫ��ʽ������ ���ܵ����ַ��� name=234&sex=boy
            getData = changeData(getData); // ת��Ϊһ������
            // ����Ҫ��������û�����һ��id Ѱ��ԭ������������ID�� Ȼ����м�һ����
            getData['id'] = jsonObj.length==0?1:jsonObj[jsonObj.length-1]['id']+1 ;
            jsonObj.push(getData);
            // ����������д��
            fs.writeFileSync(jsonPath , JSON.stringify(jsonObj),'utf-8');
            resSend(0);
        });
    }

    // ɾ���û���Ϣ   ��Ҫ���ʺŴ��� ��ȡid
    if(pathname=='/removeInfo'){
        var id = urlQuery.id;
        jsonObj.forEach(function (item,index) {
            if(item.id==id){
                jsonObj.splice(index,1);
                // ����д��
                fs.writeFileSync(jsonPath,JSON.stringify(jsonObj),'utf-8');
            }
        });
        resSend(0);
    }

    // ��ȡ�û�������Ϣ   ��Ҫ���ʺŴ��� ��ȡid
    if(pathname=='/getInfo'){
        var id = urlQuery.id;
        jsonObj.forEach(function (item,index) {
            if(item.id==id){
                // ����ID ���ҵ�������Ϣ
                resSend(0,item);
            }
        });
    }

    // �޸��û���Ϣ   Ҳ���������ȡ��Ϣ
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
                    // ����ID ���ҵ�������Ϣ �����޸�
                    jsonObj[index] =getData;
                    // ����д��
                    fs.writeFileSync(jsonPath,JSON.stringify(jsonObj),'utf-8');
                    resSend(0);
                }
            });



        });



    }


    // �����Ӧ��
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



//��Ҫ��ʽ������  ���ص��Ƕ���
function changeData(str){
    var obj={};
    var reg = /([^&]+)=([^&]+)/g;
    str.replace(reg, function ($0, $1, $2) {
        obj[$1]=$2;
    });
    return obj;
};



