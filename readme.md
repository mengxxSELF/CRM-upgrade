## CRM 客户管理系统

### 系统使用方式
#### 从github地址将项目下载到本地 然后本文件夹内打开命令行 执行代码
```
node server.js
```
在浏览器窗口打开地址 [http://localhost:9999/index.html](http://localhost:9999/index.html)
即可进入项目首页


### API接口
### 1、展示所有的客户信息

   * URL:/getAllList  GET
   * 参数:无
   * 返回:
   ```
   '{
        code:0,//->0成功 1失败
        msg:'',//->对CODE的描述
        data:[
           {
             id:1,
             name:'xxx'
           },
           ...
        ]
      }'
   ```

### 2、增加客户信息
   * URL:/addInfo POST
   * 参数:'name=xxx'
   * 返回:
   ```
    '{
         code:0,
         msg:''
      }'
   ```

### 4、修改客户信息
  * URL:/updateInfo POST
  * 参数:'id=xxx&name=xxx'
  * 返回:
  ```
  '{
       code:0,
       msg:''
    }'

  ```
### 3、获取指定客户的信息
   * URL:/getInfo GET
   * 参数:?id=1 传递给服务器对应的客户的ID
   * 返回:
   ```
   '{
         code:0,
         msg:'',
         data:{
            id:1,
            name:''
         }
      }'
   ```

### 5、删除客户信息
   * URL:/removeInfo GET
   * 参数:?id=1
   * 返回:
   ```
   '{
        code:0,
        msg:''
      }'
   ```






