let { Schema, model } = require('mongoose');
const { AppError } = require('../../lib');
const validator = require('validator');
const bcryptjs = require('bcryptjs');
const schema = new Schema(
  {
    firstName : {
      type :      String,
      minLength : [3, 'First name must be at least 3 characters'],
      maxLength : [15, 'First name must be at less than 15 characters'],
      required :  [true, 'First name is a required field'],
      trim :      true,
      match :     /^[A-Za-z\s]+$/,
      validate(value) {
        if (!value.match(/^[A-Za-z\s]+$/)) {
          throw new AppError('First Name should contain alphabetic characters only', 400);
        }
      },
    },
    lastName : {
      type :      String,
      minLength : [3, 'Last name must be at least 3 characters'],
      maxLength : [15, 'Last name must be at less than 15 characters'],
      required :  [true, 'Last name is a required field'],
      trim :      true,
      match :     /^[A-Za-z\s]+$/,
      validate(value) {
        if (!value.match(/^[A-Za-z\s]+$/)) {
          throw new AppError('Last Name should contain alphabetic characters only', 400);
        }
      },
    },
    userName : {
      type :      String,
      minLength : [3, 'Username must be at least 3 characters'],
      maxLength : [30, 'Username must be at less than 30 characters'],
      required :  [true, 'Username is a required field'],
      trim :      true,
      unique :    true,
    },
    email : {
      type :     String,
      required : [true, 'Email is a required field'],
      unique :   true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new AppError('Invalid email', 400);
        }
      },
    },
    password : {
      type :      String,
      required :  [true, 'Password is a required field'],
      trim :      true,
      minlength : [6, 'Password must be at least 6 characters'],
      match :     /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]/,

      //@iti43OS

      validate(value) {
        if (!value.match(/(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]/)) {
          throw new AppError('Password must contain at least one number , Capital letter and one special character', 400);
        }
      },
    },
    DOB : {
      type :      Date,
      required :  [true, 'Date of Birth is a required field'],
        validator : function(birthDate) {
          const newyear = new Date(); 
          const userBirthdate = new Date(birthDate);
          const age = (newyear.getFullYear() - userBirthdate.getFullYear()) - 1;
          if(age < 12)
            throw new AppError('User must be at least 12 years old.', 400)
        },
    },
    phoneNumber : {
      type :     String,
      required : true,
      trim :     true,
      match :    /^(00201|\+201|01)[0-2,5]{1}[0-9]{8}$/,
      validate : {
        validator : function (value) {
          if (!value.match(/^(00201|\+201|01)[0-2,5]{1}[0-9]{8}$/)) {
            throw new AppError('Invalid Egyptian phone number', 400);
          }
        },
      }, 
    },
    pImage : {
      type :    String,
      default : 'https://res.cloudinary.com/dttgbrris/image/upload/v1681003634/3899618_mkmx9b.png',
  },
    role : {
      type :    String,
      enum :    ['ADMIN', 'USER'],
      default : 'USER',
    },
  },
  {
    timestamps : true,
  }
);

schema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  delete userObject.password;
  delete userObject.__v;
  return userObject;
};


schema.pre('save', async function () {
  if (this.isModified('password')) this.password = await bcryptjs.hash(this.password, 10);
});

schema.methods.verifyPassword = function verifyPassword(pass) {
  return bcryptjs.compareSync(pass, this.password);
};

const User = model('User', schema);

module.exports = User;

