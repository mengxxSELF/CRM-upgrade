## CRM �ͻ�����ϵͳ

### ϵͳʹ�÷�ʽ
#### ��github��ַ����Ŀ���ص����� Ȼ���ļ����ڴ������� ִ�д���
```
node server.js
```
����������ڴ򿪵�ַ [http://localhost:9999/index.html](http://localhost:9999/index.html)
���ɽ�����Ŀ��ҳ


### API�ӿ�
### 1��չʾ���еĿͻ���Ϣ

   * URL:/getAllList  GET
   * ����:��
   * ����:
   ```
   '{
        code:0,//->0�ɹ� 1ʧ��
        msg:'',//->��CODE������
        data:[
           {
             id:1,
             name:'xxx'
           },
           ...
        ]
      }'
   ```

### 2�����ӿͻ���Ϣ
   * URL:/addInfo POST
   * ����:'name=xxx'
   * ����:
   ```
    '{
         code:0,
         msg:''
      }'
   ```

### 4���޸Ŀͻ���Ϣ
  * URL:/updateInfo POST
  * ����:'id=xxx&name=xxx'
  * ����:
  ```
  '{
       code:0,
       msg:''
    }'

  ```
### 3����ȡָ���ͻ�����Ϣ
   * URL:/getInfo GET
   * ����:?id=1 ���ݸ���������Ӧ�Ŀͻ���ID
   * ����:
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

### 5��ɾ���ͻ���Ϣ
   * URL:/removeInfo GET
   * ����:?id=1
   * ����:
   ```
   '{
        code:0,
        msg:''
      }'
   ```






