const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages")
const rooName = document.getElementById("room-name");
const users = document.getElementById("users");

var socket = io();

var qs = (function(a) {
    if (a == "") return {};
    var b = {};
    for (var i = 0; i < a.length; ++i)
    {
        var p=a[i].split('=', 2);
        if (p.length == 1)
            b[p[0]] = "";
        else
            b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
    }
    return b;
})(window.location.search.substr(1).split('&'));

const username = qs['username'];
const room = qs['room']
socket.emit('joinRoom', ({username, room}))

// const queryString = require("query-string")

// const { username, room } = queryString.parse(location.search);
// console.log(username, room);

console.log(window.location.pathname, "link");

chatForm.addEventListener("submit", (e) => {
    e.preventDefault();

    //emiting chat to server
    const meg = e.target.elements.msg.value;
    socket.emit('chatMessage', meg)

    e.target.elements.msg.value = "";
    e.target.elements.msg.focus();
})

//show online users in that room
socket.on('roomUsers', ({ room, users }) => {
    ouputRoomUser(room);
    outputUsers(users);
})

socket.on('message', message => {
    console.log(message);
    updateMessage(message);
    chatMessages.scrollTop = chatMessages.scrollHeight;
})

function updateMessage(messagee) {
    const divv = document.createElement("div");
    divv.classList.add("message");
    document.querySelector(".chat-messages").appendChild(divv)
    divv.innerHTML = `<div style='padding:10px;box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;'><p class="meta">${messagee.userName} <span>${messagee.time} </span></p><p class="text">${messagee.text}</p></div>`;
}

//ouputRoomUser

function ouputRoomUser(room) {
    rooName.innerHTML = room;
}

// outputUsers

function outputUsers(user){
    users.innerHTML = `${user.map(use => `<li>${use.username}</li>`).join("")}`
}