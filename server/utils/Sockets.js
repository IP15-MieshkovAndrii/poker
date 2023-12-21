class Sockets {
    constructor() {
        this.rooms = {};
    }
  
    joinRoom(room, nickname, ws) {
        if (!this.rooms[room]) {
            this.rooms[room] = {
                users: [],
                game: false,
                poker: null,
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

        let pokerTable = this.getPokerGame(room);
        if (pokerTable) pokerTable.leaveGame(nickname);

        if (this.rooms[room] && this.rooms[room].users) {
            const userIndex = this.rooms[room].users.findIndex(user => user.ws === ws);
            if (userIndex !== -1) {
                this.rooms[room].users.splice(userIndex, 1);
                console.log(`${nickname} left room ${room}`);
                console.log(`${this.rooms[room].users.length} in room`);
            }
            if (this.rooms[room].users.length === 0) {
                delete this.rooms[room];
                console.log(`Room ${room} removed`);
            }
        }
  

    }

    getUsersInRoom(room) {
        return this.rooms[room] || [];
    }

    setBegun(room, flag) {
        this.rooms[room].game = flag;
    }

    isBegun(room) {
        return this.rooms[room].game
    }

    setPokerGame(room, poker) {
        this.rooms[room].poker = poker;
    }

    getPokerGame(room) {
        if(!this.rooms[room]) return null;
        return this.rooms[room].poker;
    }

    isClientInRoom(client, room) {
        if (this.rooms[room] && this.rooms[room].users) {
            return this.rooms[room].users.some(user => user.ws === client);
        }
        return false;
    }

    isNicknameExist(nickname, room) {
        if (this.rooms[room] && this.rooms[room].users) {
            return this.rooms[room].users.some(user => user.nickname === nickname);
        }
        return false;
    }
}
  
module.exports = Sockets;
  