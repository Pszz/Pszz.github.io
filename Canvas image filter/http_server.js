// ����һ���򵥵�Node HTTP������,�ܴ���ǰĿ¼���ļ�
// ����ʵ�����������URL���ڲ���
// ��HTTP://localhost:80��http://127.0.0.1:80�������������

// ���ȼ���������Ҫ�õ���ģ��
var http = require('http');        // Http������API
var fs = require('fs');            // ���ڴ������ļ�
var server = new http.Server();    // �����µ�HTTP������
server.listen(1688);            // �����˿�8000

// ʹ��on����ע��ʱ�䴦��
server.on('request', function(request, response) { // ����request�����ʱ�򴥷�������
    console.log('request');
    // ���������URL
    var url = require('url').parse(request.url);
    // ����URL���÷������ڷ�����Ӧǰ�ȵȴ�
    switch(url.pathname) {    
    case ''||'/' : // ģ�⻶ӭҳ,nodejs�Ǹ�Ч������ķ���,Ҳ����ͨ�������ļ�������
        fs.readFile('./index.html', function(err, content){
            if(err) {
                response.writeHead(404, { 'Content-Type':'text/plain; charset="UTF-8"' });
                response.write(err.message);
                response.end();
            } else {
                response.writeHead(200, { 'Content-Type' : 'text/html; charset=UTF-8' });
                response.write(content);
                response.end();
            }
        });
        break;
    case '/test/delay':// �˴�����ģ�⻺������������
        // ʹ�ò�ѯ�ַ�������ȡ�ӳ�ʱ��,����2000����
        var delay = parseInt(url.query) || 2000;
        // ������Ӧ״̬��ͷ
        response.writeHead(200, {'Content-type':'text/plain; charset=UTF-8'});
        // ������ʼ��д��Ӧ����
        response.write('Sleeping for' + delay + ' milliseconds...');
        // ��֮����õ���һ�������������Ӧ
        setTimeout(function(){
            response.write('done.');
            response.end();
        }, delay);
        break;
    case '/test/mirror':// ���������test/mirror,��ԭ�ķ�����
        // ��Ӧ״̬��ͷ
        response.writeHead(200, {'Content-type':'text/plain; charset=UTF-8'});
        // ����������ݿ�ʼ��д��Ӧ����
        response.write(request.mothod + ' ' + request.url + ' HTTP/' + request.httpVersion + '\r\n');
        // ���е�����ͷ
        for (var h in request.headers) {
            response.write(h + ':' + request.headers[h] + '\r\n');
        }
        response.write('\r\n');// ʹ�ö���Ŀհ���������ͷ
        // ����Щ�¼�����������������Ӧ
        // ��������������ݿ����ʱ,����д����Ӧ��
        request.on('data', function(chunk) { response.write(chunk); });
        // ���������ʱ,��ӦҲ���
        request.on('end', function(chunk){ response.end(); });
        break;
    case '/json' : // ģ��JSON���ݷ���
        // ��Ӧ״̬��ͷ
        response.writeHead(200, {'Content-type':'application/json; charset=UTF-8'});
        response.write(JSON.stringify({test:'success'}));
        response.end();
        break;
    default:// �������Ա���Ŀ¼���ļ�
        var filename = url.pathname.substring(1);    // ȥ��ǰ��'/'
        var type = getType(filename.substring(filename.lastIndexOf('.')+1));
        // �첽��ȡ�ļ�,����������Ϊ����������ģ�鴫���ص�����
        // ����ȷʵ�ܴ���ļ�,ʹ����API fs.createReadStream()����
        fs.readFile(filename, function(err, content){
            if(err) {
                response.writeHead(404, { 'Content-Type':'text/plain; charset="UTF-8"' });
                response.write(err.message);
                response.end();
            } else {
                response.writeHead(200, { 'Content-Type' : type });
                response.write(content);
                response.end();
            }
        });
        break;
    } 
    
});
function getType(endTag){
    var type=null;
    switch(endTag){
    case 'html' :
    case 'htm' :
        type = 'text/html; charset=UTF-8';
        break;
    case 'js' : 
        type = 'application/javascript; charset="UTF-8"';
        break;
    case 'css' :
        type = 'text/css; charset="UTF-8"';
        break;
    case 'txt' :
        type = 'text/plain; charset="UTF-8"';
        break;
    case 'manifest' :
        type = 'text/cache-manifest; charset="UTF-8"';
        break;
    default :
        type = 'application/octet-stream';
        break;
    }
    return type;
}