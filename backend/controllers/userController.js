import Role from '../models/roleModel.js';
import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import joi from 'joi';


const signup = async (req, res) => {
  // Validate request body
  const schema = joi.object({
      username: joi.string().required(),
      email: joi.string().email().required(),
      password: joi.string().min(6).required(),
      role: joi.string()
  });
  const { error, value } = schema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
      // Check if the email is already registered
      const existingUser = await User.findOne({ email: value.email });
      if (existingUser) return res.status(400).send('Email already exists');

      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(value.password, salt);
      const findRole = await Role.findOne({ name: value.role });
      // Create a new user
      const newUser = new User({
          username: value.username,
          email: value.email,
          password: hashedPassword,
          role: findRole._id
      });
      const data = await newUser.save();

      res.status(201).send({ status: 1, message: 'User registered successfully', data: data });
  } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
  }

  };

const login = async (req, res) => {
  // Validate request body
  const schema = joi.object({
      email: joi.string().email().required(),
      password: joi.string().required()
  });
  const { error, value } = schema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
      // Check if the user exists
      const user = await User.findOne({ email: value.email });
      if (!user) return res.status(400).send('Invalid email or password');

      // Verify the password
      const validPassword = await bcrypt.compare(value.password, user.password);
      if (!validPassword) return res.status(400).send('Invalid email or password');

      // Generate JWT token
      const token = jwt.sign({ _id: user._id, email: user.email }, "mysecretkeyyyyyyyyyyyyyyyy");
      res.status(200).send({ status: 1, message: 'User Login successfully', data: user, token: token });

  } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
  }
 };

 const getUsers =  async (req, res) => {
  try {
      const data = await User.find()
      return res.send(data)
  } catch (error) {
      return res.send(error)
  }
}

  export  {signup,login,getUsers}