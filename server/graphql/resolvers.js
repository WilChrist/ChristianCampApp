const bcrypt = require('bcryptjs');
const validator = require('validator');
const jwt = require('jsonwebtoken');
var mongoose = require('mongoose');

const User = require('../models/user');
const City = require('../models/city');
const Church = require('../models/church');
const Role = require('../models/role');
const { clearImage } = require('../util/file');

module.exports = {
  createUser: async function({ userInput }, req) {
    
    const errors = [];
    if (!validator.isEmail(userInput.email)) {
      errors.push({ message: 'E-Mail is invalid.' });
    }
    if (validator.isEmpty(userInput.firstName) || !validator.isLength(userInput.firstName, { min: 3 })) {
      errors.push({ message: 'First Name is invalid.' });
    }
    if (validator.isEmpty(userInput.lastName) || !validator.isLength(userInput.lastName, { min: 3 })) {
      errors.push({ message: 'Last Name is invalid.' });
    }
    if (validator.isEmpty(userInput.numberOfParticipation.toString()) || !validator.isInt(userInput.numberOfParticipation.toString())) {
      errors.push({ message: 'Number Of Participation is invalid.' });
    }
    if (validator.isEmpty(userInput.actualYearOfStudy.toString()) || !validator.isInt(userInput.actualYearOfStudy.toString())) {
      errors.push({ message: 'Actual Year of Study is invalid.' });
    }
    if (validator.isEmpty(userInput.city) ) {
      errors.push({ message: 'city is mandatory.' });
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
    let existingRole=null;
    let existingCity=null;
    let existingChurch=null;

    
    if(userInput.role)
      {
        existingRole = await Role.findOne({name: userInput.role});
        if (!existingRole) {
          const error = new Error('A Role named like this doesn t exist');
          error.code = 404;
          throw error;
        }
    }
    
    if(userInput.city){
      existingCity = await City.findById(mongoose.Types.ObjectId(userInput.city));
      if (!existingCity) {
        const error = new Error('A City named like this doesn t exist');
        error.code = 409;
        throw error;
      }
    }

    if(userInput.church){
      existingChurch = await Church.findOne({name: userInput.church});
      if (!existingChurch) {
        const error = new Error('A Church named like this doesn t exist');
        error.code = 409;
        throw error;
      }
    }
    const hashedPw=null;
    if(userInput.password){
        hashedPw = await bcrypt.hash(userInput.password, 12);
    }
    
    const defaultRole = await Role.findOne({name: 'Participant'});
    const user = new User({
      firstName: userInput.firstName,
      lastName: userInput.lastName,
      email: userInput.email,
      password: hashedPw,
      imageUrl: userInput.imageUrl?userInput.imageUrl:'/images/placeholder.jpg',
      birthDate: userInput.birthDate,
      numberOfParticipation: userInput.numberOfParticipation,
      actualYearOfStudy: userInput.actualYearOfStudy,
      isInLastYearOfStudy: userInput.isInLastYearOfStudy?userInput.isInLastYearOfStudy:false,
      hasTotalyPayed: userInput.hasTotalyPayed ?userInput.hasTotalyPayed :false,
      amountPayed: userInput.amountPayed?userInput.amountPayed:0,
      city: existingCity,
      church: existingChurch,
      role: existingRole?existingRole:defaultRole
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
      'GBUM@APP$Secret',
      { expiresIn: '1h' }
    );
    return { token: token, userId: user._id.toString() };
  },
 




  //******************** Resolve City ***********************/
  
  /**
   * create a new city
   * @param {*} param0 
   * @param {*} req 
   */
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

  /**
   * get all cities
   * @param {*} page number of the page for pagination
   * @param {*} req 
   */
  cities: async function({ page }, req) {
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
      throw error;
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
      throw error;
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

  //******************** Resolve Church ***********************/
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
    const existingChurch = await Church.findOne({name : churchInput.name});
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
    const church = await Church.findById(id).populate('city').populate('users');
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
    const city = await City.findById(churchInput.city).populate('churches').populate('users');
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
  },

  //******************** Resolve Role ***********************/
  
  /**
   * create a new role
   * @param {*} roleInput role data from client 
   * @param {*} req 
   */
  createRole: async function({ roleInput }, req) {
    if (!req.isAuth) {
      const error = new Error('Not authenticated!');
      error.code = 401;
      throw error;
    }
    const errors = [];
    if (
      validator.isEmpty(roleInput.name) ||
      !validator.isLength(roleInput.name, { min: 3 })
    ) {
      errors.push({ message: 'Name is invalid.' });
    }
    if (errors.length > 0) {
      const error = new Error('Invalid input.');
      error.data = errors;
      error.code = 422;
      throw error;
    }
    const existingRole = await Role.findOne({name: roleInput.name});
    if (existingRole) {
      const error = new Error('A role named like this already exist');
      error.code = 409;
      throw error;
    }
    const role = new Role({
      name: roleInput.name,
      description: roleInput.description
    });
    const createdRole = await role.save();
    
    return {
      ...createdRole._doc,
      _id: createdRole._id.toString(),
      createdAt: createdRole.createdAt.toISOString(),
      updatedAt: createdRole.updatedAt.toISOString()
    };
  },

  /**
   * get all Roles
   * @param {*} page number of the page for pagination
   * @param {*} req 
   */
  roles: async function({ page }, req) {
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
    
    const totalRoles = await Role.find().countDocuments();
    const roles = await Role.find()
      .sort({ name: 1 })
      .skip((page - 1) * perPage)
      .limit(perPage)
      .populate('users');
    return {
      roles: roles.map(p => {
        return {
          ...p._doc,
          _id: p._id.toString(),
          createdAt: p.createdAt.toISOString(),
          updatedAt: p.updatedAt.toISOString()
        };
      }),
      totalRoles: totalRoles
    };
  },
  role: async function({ id }, req) {
    if (!req.isAuth) {
      const error = new Error('Not authenticated!');
      error.code = 401;
      throw error;
    }
    const role = await Role.findById(id).populate('users');
    if (!role) {
      const error = new Error('No role found!');
      error.code = 404;
      throw error;
    }
    return {
      ...role._doc,
      _id: role._id.toString(),
      createdAt: role.createdAt.toISOString(),
      updatedAt: role.updatedAt.toISOString()
    };
  },
  updateRole: async function({ id, roleInput }, req) {
    if (!req.isAuth) {
      const error = new Error('Not authenticated!');
      error.code = 401;
      throw error;
    }
    const role = await Role.findById(id).populate('users');
    if (!role) {
      const error = new Error('No role found!');
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
      validator.isEmpty(roleInput.name) ||
      !validator.isLength(roleInput.name, { min: 3 })
    ) {
      errors.push({ message: 'Name is invalid.' });
    }
    if (errors.length > 0) {
      const error = new Error('Invalid input.');
      error.data = errors;
      error.code = 422;
      throw error;
    }
    role.name = roleInput.name;
    role.description = roleInput.description;

    const updatedRole = await role.save();
    return {
      ...updatedRole._doc,
      _id: updatedRole._id.toString(),
      createdAt: updatedRole.createdAt.toISOString(),
      updatedAt: updatedRole.updatedAt.toISOString()
    };
  }
};
