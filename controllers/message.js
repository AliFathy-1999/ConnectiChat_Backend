const Message = require('../DB/models/message');

const sendMessage = (data) => Message.create(data)


module.exports = {
    sendMessage,
};
