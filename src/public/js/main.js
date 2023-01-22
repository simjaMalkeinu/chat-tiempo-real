const socket = io();

const form = $('#form');
const chat = $('#chat');
const message = $('#message');

const nickname = $('#nickname');
const nickForm = $('#nickForm');
const nickError = $('#nickError');

const users = $('#usernames');

form.submit((e) => {
    e.preventDefault();
    socket.emit('client:newMessage', message.val(), (data) => {
        chat.append(`<p class="error">${data}</p>`);
    });
    message.val('');
})

nickForm.submit((e) => {
    e.preventDefault();
    console.log('new user session');
    socket.emit('client:newUser', nickname.val(), (data) => {
        if(data){
            $('#content-login').hide();
            $('#content-chat').show();
        } else {
            nickError.html(`<div class="alert alert-danger">
                            El nombre de usuario esta en uso
                        </div>`);
        }
    });
})

socket.on('server:newMessage', (data) => {
    chat.append(`<b>${data.nick}</b>: ${data.msg} <br/>`);
});

socket.on('server:usernames', (usernames) =>{
    let html = '';
    for(let i = 0; i < usernames.length; i++){
        html += `<p>${usernames[i]}</p>`;
    }

    users.html(html);
})


socket.on('server:whisper', (whisper) => {
    chat.append(`<p class="whisper"><b>${whisper.nick}: </b>${whisper.msg}</p>`);
})

socket.on('server:whisperMe', (whisper) => {
    chat.append(`<p class="whisper"><b>Me to ${whisper.nick}: </b>${whisper.msg}</p>`);
})