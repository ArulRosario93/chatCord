const moment = require("moment");

function userNamenTime(userName, text) {
    return {
        userName: userName,
        text: text,
        time: moment().format('h:mm a')
    }
}

module.exports = userNamenTime;