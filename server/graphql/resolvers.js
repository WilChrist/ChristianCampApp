const bcrypt = require('bcryptjs');
const validator = require('validator');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const City = require('../models/city');
const Church = require('../models/church');
const { clearImage } = require('../util/file');

module.exports = {
  /*createUser: async function({ userInput }, req) {
    //   const email = args.userInput.email;
    const errors = [];
    if (!validator.isEmail(userInput.email)) {
      errors.push({ message: 'E-Mail is invalid.' });
    }
    if (
      validator.isEmpty(userInput.password) ||
      !validator.isLength(userInput.password, { min: 5 })
    ) {
      errors.push({ message: 'Password too short!' });
    }
    if (errors.length > 0) {
      const error = new Error('Invalid input.');
      error.data = errors;
      error.code = 422;
      throw error;
    }
    const existingUser = await User.findOne({ email: userInput.email });
    if (existingUser) {
      const error = new Error('User exists already!');
      throw error;
    }
    const hashedPw = await bcrypt.hash(userInput.password, 12);
    const user = new User({
      email: userInput.email,
      name: userInput.name,
      password: hashedPw
    });
    const createdUser = await user.save();
    return { ...createdUser._doc, _id: createdUser._id.toString() };
  },
  login: async function({ email, password }) {
    const user = await User.findOne({ email: email });
    if (!user) {
      const error = new Error('User not found.');
      error.code = 401;
      throw error;
    }
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      const error = new Error('Password is incorrect.');
      error.code = 401;
      throw error;
    }
    const token = jwt.sign(
      {
        userId: user._id.toString(),
        email: user.email
      },
      'somesupersecretsecret',
      { expiresIn: '1h' }
    );
    return { token: token, userId: user._id.toString() };
  },
  createPost: async function({ postInput }, req) {
    if (!req.isAuth) {
      const error = new Error('Not authenticated!');
      error.code = 401;
      throw error;
    }
    const errors = [];
    if (
      validator.isEmpty(postInput.title) ||
      !validator.isLength(postInput.title, { min: 5 })
    ) {
      errors.push({ message: 'Title is invalid.' });
    }
    if (
      validator.isEmpty(postInput.content) ||
      !validator.isLength(postInput.content, { min: 5 })
    ) {
      errors.push({ message: 'Content is invalid.' });
    }
    if (errors.length > 0) {
      const error = new Error('Invalid input.');
      error.data = errors;
      error.code = 422;
      throw error;
    }
    const user = await User.findById(req.userId);
    if (!user) {
      const error = new Error('Invalid user.');
      error.code = 401;
      throw error;
    }
    const post = new Post({
      title: postInput.title,
      content: postInput.content,
      imageUrl: postInput.imageUrl,
      creator: user
    });
    const createdPost = await post.save();
    user.posts.push(createdPost);
    await user.save();
    return {
      ...createdPost._doc,
      _id: createdPost._id.toString(),
      createdAt: createdPost.createdAt.toISOString(),
      updatedAt: createdPost.updatedAt.toISOString()
    };
  },
  posts: async function({ page }, req) {
    if (!req.isAuth) {
      const error = new Error('Not authenticated!');
      error.code = 401;
      throw error;
    }
    if (!page) {
      page = 1;
    }
    const perPage = 2;
    const totalPosts = await Post.find().countDocuments();
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * perPage)
      .limit(perPage)
      .populate('creator');
    return {
      posts: posts.map(p => {
        return {
          ...p._doc,
          _id: p._id.toString(),
          createdAt: p.createdAt.toISOString(),
          updatedAt: p.updatedAt.toISOString()
        };
      }),
      totalPosts: totalPosts
    };
  },
  post: async function({ id }, req) {
    if (!req.isAuth) {
      const error = new Error('Not authenticated!');
      error.code = 401;
      throw error;
    }
    const post = await Post.findById(id).populate('creator');
    if (!post) {
      const error = new Error('No post found!');
      error.code = 404;
      throw error;
    }
    return {
      ...post._doc,
      _id: post._id.toString(),
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString()
    };
  },
  updatePost: async function({ id, postInput }, req) {
    if (!req.isAuth) {
      const error = new Error('Not authenticated!');
      error.code = 401;
      throw error;
    }
    const post = await Post.findById(id).populate('creator');
    if (!post) {
      const error = new Error('No post found!');
      error.code = 404;
      throw error;
    }
    if (post.creator._id.toString() !== req.userId.toString()) {
      const error = new Error('Not authorized!');
      error.code = 403;
      throw error;
    }
    const errors = [];
    if (
      validator.isEmpty(postInput.title) ||
      !validator.isLength(postInput.title, { min: 5 })
    ) {
      errors.push({ message: 'Title is invalid.' });
    }
    if (
      validator.isEmpty(postInput.content) ||
      !validator.isLength(postInput.content, { min: 5 })
    ) {
      errors.push({ message: 'Content is invalid.' });
    }
    if (errors.length > 0) {
      const error = new Error('Invalid input.');
      error.data = errors;
      error.code = 422;
      throw error;
    }
    post.title = postInput.title;
    post.content = postInput.content;
    if (postInput.imageUrl !== 'undefined') {
      post.imageUrl = postInput.imageUrl;
    }
    const updatedPost = await post.save();
    return {
      ...updatedPost._doc,
      _id: updatedPost._id.toString(),
      createdAt: updatedPost.createdAt.toISOString(),
      updatedAt: updatedPost.updatedAt.toISOString()
    };
  },
  deletePost: async function({ id }, req) {
    if (!req.isAuth) {
      const error = new Error('Not authenticated!');
      error.code = 401;
      throw error;
    }
    const post = await Post.findById(id);
    if (!post) {
      const error = new Error('No post found!');
      error.code = 404;
      throw error;
    }
    if (post.creator.toString() !== req.userId.toString()) {
      const error = new Error('Not authorized!');
      error.code = 403;
      throw error;
    }
    clearImage(post.imageUrl);
    await Post.findByIdAndRemove(id);
    const user = await User.findById(req.userId);
    user.posts.pull(id);
    await user.save();
    return true;
  },
  user: async function(args, req) {
    if (!req.isAuth) {
      const error = new Error('Not authenticated!');
      error.code = 401;
      throw error;
    }
    const user = await User.findById(req.userId);
    if (!user) {
      const error = new Error('No user found!');
      error.code = 404;
      throw error;
    }
    return { ...user._doc, _id: user._id.toString() };
  },
  updateStatus: async function({ status }, req) {
    if (!req.isAuth) {
      const error = new Error('Not authenticated!');
      error.code = 401;
      throw error;
    }
    const user = await User.findById(req.userId);
    if (!user) {
      const error = new Error('No user found!');
      error.code = 404;
      throw error;
    }
    user.status = status;
    await user.save();
    return { ...user._doc, _id: user._id.toString() };
  },*/




  /******************** Resolve City ***********************/
  createCity: async function({ cityInput }, req) {
    if (!req.isAuth) {
      const error = new Error('Not authenticated!');
      error.code = 401;
      throw error;
    }
    const errors = [];
    if (
      validator.isEmpty(cityInput.name) ||
      !validator.isLength(cityInput.name, { min: 3 })
    ) {
      errors.push({ message: 'Name is invalid.' });
    }
    if (errors.length > 0) {
      const error = new Error('Invalid input.');
      error.data = errors;
      error.code = 422;
      throw error;
    }
    const existingCity = await City.findOne({name: cityInput.name});
    if (existingCity) {
      const error = new Error('A city named like this already exist');
      error.code = 409;
      throw error;
    }
    const city = new City({
      name: cityInput.name,
      description: cityInput.description
    });
    const createdCity = await city.save();
    
    return {
      ...createdCity._doc,
      _id: createdCity._id.toString(),
      createdAt: createdCity.createdAt.toISOString(),
      updatedAt: createdCity.updatedAt.toISOString()
    };
  },
  cities: async function({ page }, req) {
    if (!req.isAuth) {
      const error = new Error('Not authenticated!');
      error.code = 401;
      //throw error;
    }
    
    const perPage = 2;

    if (!page) {
      page = 1;
      perPage=2147483647;
    }
    
    const totalCities = await City.find().countDocuments();
    const cities = await City.find()
      .sort({ name: 1 })
      .skip((page - 1) * perPage)
      .limit(perPage)
      .populate('churches')
      .populate('users');
    return {
      cities: cities.map(p => {
        return {
          ...p._doc,
          _id: p._id.toString(),
          createdAt: p.createdAt.toISOString(),
          updatedAt: p.updatedAt.toISOString()
        };
      }),
      totalCities: totalCities
    };
  },
  city: async function({ id }, req) {
    if (!req.isAuth) {
      const error = new Error('Not authenticated!');
      error.code = 401;
     // throw error;
    }
    const city = await City.findById(id).populate('churches').populate('users');
    if (!city) {
      const error = new Error('No city found!');
      error.code = 404;
      throw error;
    }
    return {
      ...city._doc,
      _id: city._id.toString(),
      createdAt: city.createdAt.toISOString(),
      updatedAt: city.updatedAt.toISOString()
    };
  },
  updateCity: async function({ id, cityInput }, req) {
    if (!req.isAuth) {
      const error = new Error('Not authenticated!');
      error.code = 401;
      //throw error;
    }
    const city = await City.findById(id).populate('churches').populate('users');
    if (!city) {
      const error = new Error('No city found!');
      error.code = 404;
      throw error;
    }
    const user = await User.findById(req.userId);
    if (!user) {
      const error = new Error('Invalid user.');
      error.code = 401;
      throw error;
    }
    if (user.role.name !== 'admin') {
      const error = new Error('Not authorized!');
      error.code = 403;
      throw error;
    }
    const errors = [];
    if (
      validator.isEmpty(cityInput.name) ||
      !validator.isLength(cityInput.name, { min: 3 })
    ) {
      errors.push({ message: 'Name is invalid.' });
    }
    if (errors.length > 0) {
      const error = new Error('Invalid input.');
      error.data = errors;
      error.code = 422;
      throw error;
    }
    city.name = cityInput.name;
    city.description = cityInput.description;

    const updatedCity = await city.save();
    return {
      ...updatedCity._doc,
      _id: updatedCity._id.toString(),
      createdAt: updatedCity.createdAt.toISOString(),
      updatedAt: updatedCity.updatedAt.toISOString()
    };
  },

  /******************** Resolve Church ***********************/
  createChurch: async function({ churchInput }, req) {
    if (!req.isAuth) {
      const error = new Error('Not authenticated!');
      error.code = 401;
      throw error;
    }
    const errors = [];
    if (
      validator.isEmpty(churchInput.name) ||
      !validator.isLength(churchInput.name, { min: 2 })
    ) {
      errors.push({ message: 'Name is invalid.' });
    }
    if (errors.length > 0) {
      const error = new Error('Invalid input.');
      error.data = errors;
      error.code = 422;
      throw error;
    }
    const existingChurch = await Church.fintOne({name : churchInput.name});
    if (existingChurch) {
      const error = new Error('A church named like this already exist');
      error.code = 409;
      throw error;
    }
    const city = await City.findById(churchInput.city);
    if (!city) {
      const error = new Error('The City associated to this church doesn t exist!');
      error.code = 409;
      throw error;
    }
    const church = new Church({
      name: churchInput.name,
      fullName: churchInput.name +" "+ city.name,
      description: churchInput.description,
      city: churchInput.city
    });
    const createdChurch = await church.save();
    
    return {
      ...createdChurch._doc,
      _id: createdChurch._id.toString(),
      createdAt: createdChurch.createdAt.toISOString(),
      updatedAt: createdChurch.updatedAt.toISOString()
    };
  },
  churches: async function({ page }, req) {
    if (!req.isAuth) {
      const error = new Error('Not authenticated!');
      error.code = 401;
      throw error;
    }
    
    const perPage = 2;

    if (!page) {
      page = 1;
      perPage=2147483647;
    }
    
    const totalChurches = await Church.find().countDocuments();
    const churches = await Church.find()
      .sort({ name: 1 })
      .skip((page - 1) * perPage)
      .limit(perPage)
      .populate('city')
      .populate('users');
    return {
      churches: churches.map(p => {
        return {
          ...p._doc,
          _id: p._id.toString(),
          createdAt: p.createdAt.toISOString(),
          updatedAt: p.updatedAt.toISOString()
        };
      }),
      totalChurches: totalChurches
    };
  },
  church: async function({ id }, req) {
    if (!req.isAuth) {
      const error = new Error('Not authenticated!');
      error.code = 401;
      throw error;
    }
    const church = await City.findById(id).populate('city').populate('users');
    if (!church) {
      const error = new Error('No church found!');
      error.code = 404;
      throw error;
    }
    return {
      ...church._doc,
      _id: church._id.toString(),
      createdAt: church.createdAt.toISOString(),
      updatedAt: church.updatedAt.toISOString()
    };
  },
  updateChurch: async function({ id, churchInput }, req) {
    if (!req.isAuth) {
      const error = new Error('Not authenticated!');
      error.code = 401;
      throw error;
    }
    const church = await Church.findById(id).populate('city').populate('users');
    if (!church) {
      const error = new Error('No church found!');
      error.code = 404;
      throw error;
    }
    const user = await User.findById(req.userId);
    if (!user) {
      const error = new Error('Invalid user.');
      error.code = 401;
      throw error;
    }
    if (user.role.name !== 'admin') {
      const error = new Error('Not authorized!');
      error.code = 403;
      throw error;
    }
    const errors = [];
    if (
      validator.isEmpty(churchInput.name) ||
      !validator.isLength(churchInput.name, { min: 2 })
    ) {
      errors.push({ message: 'Name is invalid.' });
    }
    if (errors.length > 0) {
      const error = new Error('Invalid input.');
      error.data = errors;
      error.code = 422;
      throw error;
    }
    const city = await city.findById(churchInput.city).populate('churches').populate('users');
    if (!city) {
      const error = new Error('city Not found!');
      error.code = 404;
      throw error;
    }
    church.name = churchInput.name;
    church.fullName = churchInput.name +" "+city.name;
    church.description = churchInput.description;
    church.city = churchInput.city;

    const updatedChurch = await church.save();
    return {
      ...updatedChurch._doc,
      _id: updatedChurch._id.toString(),
      createdAt: updatedChurch.createdAt.toISOString(),
      updatedAt: updatedChurch.updatedAt.toISOString()
    };
  }
};
