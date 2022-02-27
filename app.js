/* 설치한 express 모듈 불러오기 */
const express = require('express');

/* 설치한 socket.io 모듈 불러오기 */
const socket = require('socket.io');

/* Node.js 기본 내장 모듈 불러오기 */
const http = require('http');

/* Node.js 기본 내장 모듈 불러오기 */
const fs = require('fs');

/* express 객체 생성  */
const app = express();

/* express http 서버 생성 */
const server = http.createServer(app);

/* 생성된 서버를 socket.io에 바인딩 */
const io = socket(server);

// app.use() : 정적파일을 제공하기 위해 미들웨어를 사용하는 코드
/* 기본적으로는 클라이언트가 http://서버주소/css 로 액세스 할 경우 액세스가 거부됨. 서버측에서 아무런 작업을 하지않았기 때문!
app.use('/css', express.static('./static/css')) 를 추가해주면 실행되는 서버 코드 기준 디렉토리의 static 폴더 안의 css 폴더는 
외부 클라이언트들이 /css 경로로 액세스할 수 있습니다! */
app.use('/css', express.static('./static/css'))
app.use('/js', express.static('./static/js'))

/* get 방식으로 / 경로에 접속하면 실행 됨 (localhost:8080)
- get('/', ... ) : / 경로를 get 방식으로 접속하면 호출 됨. get(경로, 함수) 경로를 지정 후 함수 작성
- 함수는 request와 response 객체를 받음.
- request는 클라이언트에서 전달된 데이터와 정보들이 담겨있음.
- response에는 클라이언트에게 응답을 위한 정보가 들어있음.
- response.send(전달 데이터) : 전달할 데이터를 send()를 통해 전달하면 다시 클라이언트(웹)으로 서버가 데이터를 돌려줌. */
/* 
- fs모듈(파일과 관련된 처리를 함) : index.html 파일을 읽고 클라이언트로 읽은 내용을 전달해줘야함.
- readFile() : 지정된 파일을 읽어서 데이터를 가져옴. 에러가 발생하면 err에 에러 내용을 담아옴.
- response() : response(응답) 객체를 통해 읽어온 데이터를 전달해주어야함.
- writeHead : HTML 파일을 쓰기 위해 헤더에 내용을 작성해서 보냄.
- write : HTML 데이터를 보냄.
- end : 모두 보내고 완료됨. write로 응답할 경우 꼭 end를 사용해야함.
*/
app.get('/', function(request, response){
    fs.readFile('./static/index.html', function(err, data){
        if(err){
            response.send('에러')
        }else {
            response.writeHead(200, {'Content-Type':'text/html'})
            response.write(data)
            response.end()
        }
    })
    // console.log('user : / 으로 접속 ');
    // response.send('Hello, Express Server!');
})


// io.sockets : 접속된 모든 소켓을 의미함
// io.sockets.on('connection' function(socket)...) : connection 이벤트가 발생하면 콜백함수가 실행됨.
//socket.on('send', function(...)) : 이벤트를 받을 경우 호출됨
//socket.on('disconnect', function(...)) : 연결되어있던 소켓과 접속이 끊겨지면 자동으로 실행됨
io.sockets.on('connection', function(socket){
    
    // 새로운 유저가 접속하면 다른 소켓에서도 알려줌
    socket.on('newUser', function(name){
        console.log(name +' 님이 접속했습니다.')

         // 소켓에 이름 저장
        socket.name = name
    
        // 모든 소켓에게 전송
        io.sockets.emit('update', {type: 'connect', name: 'SERVER', message: name + ' 님이 접속했습니다.'})
    })

   

    // 전송한 메세지 받기
    socket.on('message', function(data){
        // 누가 보냈는지 이름 추가
        data.name = socket.name

        console.log(data);

        // 보낸 사람을 제외한 나머지 유저에게 메세지 전송
        socket.broadcast.emit('update', data);      
    })

    // 접속 종료
    socket.on('disconnect', function(){
        console.log(socket.name + ' 님이 나갔습니다.');

        // 나가는 사람을 제외한 나머지 유저에게 메세지 전송
        socket.broadcast.emit('update', {type: 'disconnect', name: 'SERVER', message: socket.name + ' 님이 나갔습니다.'});
    })
})

/* 서버 8080 port listen */
server.listen(8080, function(){
    console.log('서버 실행 중..');
})

