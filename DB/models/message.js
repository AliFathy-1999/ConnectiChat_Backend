let { Schema, model } = require('mongoose');
const { AppError } = require('../../lib');

const schema = new Schema(
  {
    sender : {
      type : Schema.Types.ObjectId,
      ref : 'User',
      required : true
    },
    content : { 
      type : String,
      trim : true,
      required : true
    },
    chat : {
      type : Schema.Types.ObjectId,
      ref : 'Chat',
      required : true
    },  
  },
  {
    timestamps : true,
  }
);

schema.methods.toJSON = function () {
  const message = this;
  const messageObject = message.toObject();
  delete messageObject.__v;
  return messageObject;
};

const Message = model('Message', schema);

module.exports = Message;

