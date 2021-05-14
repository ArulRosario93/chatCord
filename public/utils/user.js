const users = [];

function getUsertoRoom(id, username, room) {
    const user = { id, username, room }
    users.push(user)
    return user;
}

function togetCurrentUser(id) {
    return users.find(user => user.id === id);
}

function getRoomUsers(room){
    return users.filter(user => user.room === room);
}

function userleaveschat(id) {
    const index = users.findIndex(user => user.id === id)

    if(index !== -1) {
        return users.splice(index, 1)[0]
    }
}

module.exports = {
    getUsertoRoom,
    togetCurrentUser,
    getRoomUsers,
    userleaveschat
}