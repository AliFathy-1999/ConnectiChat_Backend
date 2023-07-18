const Joi = require('joi');
const { AppError } = require('../lib');

const signUp = {
    body : Joi.object().keys({
        firstName : Joi.string().trim().pattern(/^[a-zA-Z\s]+$/).min(3).max(15)
        .messages({
            'string.pattern.base' : 'First name must contain only alphabet letter ',
            'string.min' :          'First name must be at least 3 characters',
            'string.max' :          'First name must be at most 15 characters',
        }),
        lastName : Joi.string().trim().pattern(/^[a-zA-Z\s]+$/).min(3).max(15)
        .messages({
            'string.pattern.base' : 'Last name must contain only alphabet letter ',
            'string.min' :          'Last name must be at least 3 characters',
            'string.max' :          'Last name must be at most 15 characters',
        }),
        DOB : Joi.date()
        .custom((birthDate) => {
          const newyear = new Date(); 
          const userBirthdate = new Date(birthDate);
          const age = (newyear.getFullYear() - userBirthdate.getFullYear());
          if(age < 18)
            throw new AppError('User must be at least 18 years old.', 400)
        })
        .messages({
          'date.base' :   'Date of Birth is a required field',
          'date.format' : 'Date of Birth must be a valid date',
          'any.custom' :  'Date of birth is invalid, User must be at least 18 years old'
        }),
        email : Joi.string().email() 
        .messages({
            'string.email' : 'Invalid email format',
        }),
        userName : Joi.string().trim().pattern(/^[a-zA-Z0-9\s]+$/).min(3).max(30)
        .messages({
            'string.min' :          'Username must be at least 3 characters',
            'string.max' :          'Username must be at most 30 characters',
            'string.pattern.base' : 'Username can only contain letters and numbers.',
        }),       
        password : Joi.string().min(8).pattern(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]/).messages({
            'string.min' :          'Password must be at least 8 characters',
            'string.pattern.base' : 'Password must contain at least one number , Capital letter and one special character',
        }), 
        gender : Joi.string().valid('male', 'female')
        .messages({
          'any.only' : 'Gender must be one of the following Male or Female',
        }),
        phoneNumber : Joi.string().pattern(/^(00201|\+201|01)[0-2,5]{1}[0-9]{8}$/)
        .messages({
          'string.pattern.base' : 'Invalid Egyptian phone number',
        }),
        address : Joi.string().trim().regex(/[a-zA-Z]+/).min(5).max(150)
        .messages({
              'string.min' :          'Username must be at least 3 characters',
              'string.max' :          'Username must be at most 30 characters',
              'string.pattern.base' : 'Address must contain at least one alphabetic characters',
        }),    
        role :   Joi.string().valid('ADMIN', 'USER').default('USER'),
        pImage : Joi.any(),
    }),  
}

const signIn = {
    body : Joi.object().keys({
        userName : Joi.string().trim(),
        password : Joi.string().trim(),
    }),
};

const checkvalidID = {
  params : Joi.object().keys({
      id : Joi.string().pattern(/^[0-9a-fA-F]{24}$/).length(24).messages({
        'string.empty' :        'Invalid ID',
        'string.pattern.base' : 'Invalid ObjectID',
      }), 
  })
};

module.exports = {
    signUp,
    signIn,
    checkvalidID
};
