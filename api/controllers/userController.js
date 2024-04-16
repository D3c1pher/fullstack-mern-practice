const bcrypt = require('bcrypt');
const User = require('../models/User');
const auth = require('../middlewares/authentication');
const { createError } = require('../middlewares/errorHandler');
const { registerSchema, updateProfileSchema } = require('../schemas/userSchema');

module.exports.register = async (req, res, next) => {
  try {
    const { firstName, lastName, email, username, password, mobileNumber } = req.body;

    const { error } = registerSchema.validate(req.body);
    if (error) {
      throw createError(400, error.details[0].message);
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      const field = existingUser.email === email ? 'Email' : 'Username';
      throw createError(400, `${field} already exists`);
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({
      firstName,
      lastName,
      email,
      username,
      password: hashedPassword,
      mobileNumber,
    });

    const savedUser = await newUser.save();

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: savedUser._id,
        firstName: savedUser.firstName,
        lastName: savedUser.lastName,
        email: savedUser.email,
        username: savedUser.username,
      },
    });
  } catch(err) {
    console.error('Error in user registration: ', err);
    next(err); 
  }
};

module.exports.login = async (req, res, next) => {
  try {
    const { emailOrUsername, password } = req.body;

    let user = await User.findOne({ $or: [{ email: emailOrUsername }, { username: emailOrUsername }] });
    if (!user) {
      throw createError(401, 'Invalid email or username');
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw createError(401, 'Invalid password');
    }

    const accessToken = auth.createAccessToken(user);

    res.status(200).json({
      message: 'Login successful',
      access:  accessToken
    })
  }
  catch(err) {
    console.error('Error in logging in: ', err);
    next(err); 
  }
};

exports.viewProfile = async (req, res, next) => {
  try {
    const userId = req.params.userId;

    const user = await User.findById(userId).select('-password -isAdmin').lean();

    if (!user) {
      throw createError(404, 'User not found');
    }

    res.status(200).json({
      message: 'Profile retrieved successfully',
      user,
    });
  } catch (err) {
    console.error('Error in viewing profile: ', err);
    next(err);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const { firstName, lastName, email, username, mobileNumber } = req.body;

    const { error } = updateProfileSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      const field = existingUser.email === email ? 'Email' : 'Username';
      return createError(400, `${field} already exists`);
    }

    const user = await User.findById(userId);
    if (!user) {
      throw createError(404, 'User not found');
    }

    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.email = email || user.email;
    user.username = username || user.username;
    user.mobileNumber = mobileNumber || user.mobileNumber;

    const updatedUser = await user.save();

    res.status(200).json({
      message: 'Profile updated successfully',
      user: updatedUser,
    });
  } catch (err) {
    console.error('Error in updating profile: ', err);
    next(err);
  }
};