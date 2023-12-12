class Sockets {
    constructor() {
        this.rooms = {};
    }
  
    joinRoom(room, nickname, ws) {
        if (!this.rooms[room]) {
            this.rooms[room] = {
            users: [],
            };
        }

        const userExists = this.rooms[room].users.some(user => user.ws === ws);
        const nameExists = this.rooms[room].users.some(user => user.nickname === nickname);

        if (!userExists || !nameExists) {
            let user = { ws, nickname };
            this.rooms[room].users.push(user);
    
            ws.room = room;
            ws.nickname = nickname;
        } else {
            console.log(`User with WebSocket connection ${ws} already exists in room ${room}`);
        }
    }
  
    leaveRoom(ws) {
        const {room, nickname} = ws;
        if (this.rooms[room] && this.rooms[room].users) {
            const userIndex = this.rooms[room].users.findIndex(user => user.ws === ws);
            if (userIndex !== -1) {
                this.rooms[room].users.splice(userIndex, 1);
                console.log(`${nickname} left room ${room}`);
            }
            // if (this.rooms[room].users.length === 0) {
            //     delete this.rooms[room];
            //     console.log(`Room ${room} removed`);
            // }
        }
  

    }

    getUsersInRoom(room) {
        return this.rooms[room] || [];
      }
  }
  
  module.exports = Sockets;
  