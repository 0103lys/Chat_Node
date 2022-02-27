// 서버와 소켓이 연결되었을 때 id가 test인 요소의 값을 '접속 됨'으로 설정
// send() : 버튼을 클릭했을 때 호출 됨. id가 test인 요소의 값을 서버로 전송. 
// send라는 이름의 이벤트를 전송했으면 받는 곳에서 on('send')가 있어야 받을 수 있음. 이벤트명이 동일한 것 끼리만 데이터의 송수신이 가능함

var socket = io()

/* 접속되었을 때 실행 */
socket.on('connect', function(){
    // 이름 입력 받기
    var name = prompt('반갑습니다!', '')

    // 이름이 빈칸인 경우
    if(!name) {
        name = '익명'
    }

    // 서버에 새로운 유저가 왔다고 알림
    socket.emit('newUser', name);
})

/* 서버로부터 데이터 받은 경우 */
socket.on('update', function(data){
    var chat = document.getElementById('chat')

    var message = document.createElement('div')
    var node = document.createTextNode(`${data.name}: ${data.message}`)
    var className = ''

    // 타입에 따라 적용할 클래스를 다르게 지정
    switch(data.type) {
        case 'message':
            className = 'other'
            break

        case 'connect':
            className = 'connect'
            break

        case 'disconnect':
            className = 'disconnect'
            break
    }
    message.classList.add(className)
    message.appendChild(node)
    chat.appendChild(message)
})

/* 메세지 전송 함수 */
function send() {
    // 입력되어있는 데이터 가져오기
    var message = document.getElementById('test').value

    // 가져온 데이터 칸 빈칸으로 바꿔주기
    document.getElementById('test').value = ''

    // 내가 전송할 메세지 클라이언트에게 표시
    var chat = document.getElementById('chat')
    var msg = document.createElement('div')
    var node = document.createTextNode(message)
    msg.classList.add('me')
    msg.appendChild(node)
    chat.appendChild(msg)

    // 서버로 send 이벤트 전달 + 데이터와 함께
    // on : 수신 / emit : 전송
    socket.emit('message', {type: 'message', message: message})
}
