let { Schema, model } = require('mongoose');
const { AppError } = require('../../lib');

const schema = new Schema(
  {
    chatName : {
        type : String,
        trim : true,
        default : 'new chat'
    },
    groupAdmin : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',        
    },
    users : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
    }],
    lastMessage : { 
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Message',
    },
    chat : {
      type : mongoose.Schema.Types.ObjectId,
      ref : 'Chat',
      required : true
    },  
    isGroupChat : {
        type : Boolean, 
        default : false 
    },
  },
  {
    timestamps : true,
  }
);

schema.methods.toJSON = function () {
  const chat = this;
  const chatObject = chat.toObject();
  delete chatObject.__v;
  return chatObject;
};

const Chat = model('Chat', schema);

module.exports = Chat;

