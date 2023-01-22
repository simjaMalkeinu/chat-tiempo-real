let users = {};

module.exports = function (io) {
    io.on('connection', (socket) => {
        // console.log('new connection');

        socket.on('client:newMessage', (message, cb) => {

            var msg = message.trim();
            if (msg.substr(0, 3) === '/w ') {
                msg = msg.substr(3);

                const index = msg.indexOf(' ');
                if (index !== -1) {
                    var name = msg.substr(0, index);
                    var msg = msg = msg.substr(index + 1);

                    if (name in users) {
                        users[name].emit('server:whisper', {
                            msg,
                            nick: socket.nickname
                        });
                        socket.emit('server:whisperMe', {
                            msg,
                            nick: name,
                        });
                    } else {
                        cb('Error! el usuario no existe');
                    }
                } else {
                    cb('Error! Por favor ingresa tu mensaje');
                }

            } else {
                io.emit('server:newMessage', {
                    msg: message,
                    nick: socket.nickname
                });
            }

        })

        socket.on('client:newUser', (data, cb) => {
            // console.log(nickname);
            if (data in users) {
                cb(false);
            } else {
                cb(true);
                socket.nickname = data;
                users[socket.nickname] = socket;
                uploadNicknames();
            }
        })

        socket.on('disconnect', (data) => {
            if (!socket.nickname) return;
            delete users[socket.nickname];
            uploadNicknames();
        })

        const uploadNicknames = () => {
            io.emit('server:usernames', Object.keys(users));
        }
    })
}