const jwt = require('jsonwebtoken');
const User = require('../DB/models/user');
const { AppError } = require('../lib/index');

const createUser = (data) => User.create(data)

const generateToken = (user) => {
  const token = jwt.sign({ userName : user.userName, userId : user._id, role : user.role}, process.env.TOKEN_KEY, { expiresIn : '7d' } )
  return token;
}
const signIn = async (userData) => {
  const user = await User.findOne({ userName : userData.userName})
  if(!user) throw new AppError('Invalid username', 400);
  const valid = user.verifyPassword(userData.password);
  if (!valid) throw new AppError('Invalid password', 400);
  return {token : generateToken(user), user}
}

const getMe = (userId) => User.findOne({_id : userId});

module.exports = {
  createUser,
  signIn,
  getMe
};
