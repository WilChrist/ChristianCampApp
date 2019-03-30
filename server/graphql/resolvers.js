const bcrypt = require('bcryptjs');
const validator = require('validator');
const jwt = require('jsonwebtoken');
var mongoose = require('mongoose');
var nodemailer = require('nodemailer');

const User = require('../models/user');
const City = require('../models/city');
const Church = require('../models/church');
const Role = require('../models/role');
const { clearImage } = require('../util/file');

var transporter = nodemailer.createTransport({
  host: `${process.env.MAIL_HOST}`,
  port: `${process.env.MAIL_PORT}`,
  secure: `${process.env.MAIL_SECURE}`,
  auth: {
         user: `${process.env.MAIL_USER}`,
         pass: `${process.env.Mail_PASSWORD}`
     },
     tls: {
         rejectUnauthorized: false
     }
 });

 

module.exports = {
  createUser: async function({ userInput }, req) {
    
    const errors = [];
    if (!validator.isEmail(userInput.email)) {
      errors.push({ message: 'E-Mail is invalid.' });
    }
    if (validator.isEmpty(userInput.firstName) || !validator.isLength(userInput.firstName, { min: 3 })) {
      errors.push({ message: 'First Name is invalid.' });
    }
    if (validator.isEmpty(userInput.sexe) || !validator.isIn(userInput.sexe, ["M","F"])) {
      errors.push({ message: 'Sexe is invalid.' });
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
      const error = new Error('A User with this email already exists!');
      throw error;
    }
    let existingRole=null;
    let existingCity=null;
    let existingChurch=null;

    
    if(userInput.role)
      {
        existingRole = await Role.findById(mongoose.Types.ObjectId(userInput.role));
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
      existingChurch = await Church.findById(mongoose.Types.ObjectId(userInput.church));
      if (!existingChurch) {
        const error = new Error('A Church named like this doesn t exist');
        error.code = 409;
        throw error;
      }
    }
    const pass=userInput.password;
    let hashedPw=null;
    if(userInput.password){
        hashedPw = await bcrypt.hash(userInput.password, 12);
    }
    
    const defaultRole = await Role.findOne({name: 'Participant'});
    const user = new User({
      firstName: userInput.firstName,
      lastName: userInput.lastName,
      email: userInput.email,
      sexe: userInput.sexe,
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

    if(existingRole){
      existingRole.users.push(createdUser);
      existingRole.save();
    }else{
      defaultRole.users.push(createdUser);
      defaultRole.save();
    }
    if(existingChurch){
      existingChurch.users.push(createdUser);
      existingChurch.save();
    }
    if(existingCity){
      existingCity.users.push(createdUser);
      existingCity.save();
    }

    /*-------------------------Send MaiL-------------------------- */
    let messageToStaffMember="";
    let greeting=userInput.sexe=="M"?"Cher "+userInput.firstName:"Chère "+userInput.firstName;

    if(existingRole && existingRole.name!=="Participant"){
      messageToStaffMember=`
      <br/><br/>
      <b>Ps : </b>En tant que ${existingRole.name} vous avez le droit d'accéder à l'espace reservé à
      d'administration de cette plateforme pour le bon exercice de vos fonctions à 
      l'adresse suivante : <a href='${process.env.LINK_TO_STAFF_MEMBER_SPACE}'>${process.env.LINK_TO_STAFF_MEMBER_SPACE}</a>
      <br/>
      Votre adresse Email de connexion est : ${createdUser.email}
      et votre mot de passe est : ${pass}
      `;
    }

    const mailOptions = {
      from: `${process.env.MAIL_FROM}`, // sender address
      to: userInput.email, // list of receivers
      subject: "Inscription au Camp d'Ifrane 2019", // Subject line
      html: `
      <h2>Bienvenue au Camp d'Ifrane 2019 ${greeting}</h2>
      <p>
          Le commité d'organisation du Camp d'Ifrane 2019 vous souhaite
          la bienvenu à ce merveilleux rendez-vous divin :).
      </p>
    
       <p>
          Nous espérons que votre coeur est assoifé de recevoir abondament de Jésus.
          Nous vous encourageons dans ce sens à rechercher et à concerver
          cette soif durant toute la durée du camp et même après. En effet, Jésus a dit :

          <br/><center>
          <i>
            Si quelqu'un a soif, qu'il vienne à moi, et qu'il boive. 
            Celui qui croit en moi, des fleuves d'eau vive couleront de son sein, 
            comme dit l'Ecriture.
          </i> <b>Jean 7:37</b></center>
    
          <br/><br/>
          A la fin du camp, vous trouverez à cette adresse
            <a href='${process.env.LINK_TO_PICTURES}'>
            ${process.env.LINK_TO_PICTURES}
            </a> 
          quelque photos du camp. vous devrez les télécharger sur votre PC dans les 1 Mois 
          après le camp si vous voulez les conserver.
    
          <br/><br/>
          Nous vous encourageons aussi une fois de retour dans votre ville à vous 
          engager (encore plus) activement dans le GBU de votre ville afin d'aller 
          plus loin dans votre croissance dans la connaissance et le témoignage de Christ!
    
          <br/><br/>
          Sur ce, nous vous souhaitons un excellent camp d'Ifrane 2019.
          Nous vous aimons!
          ${messageToStaffMember}
          <br/><br/>
          <b> Signé, le Commité d'Organisation du Camp d'Ifrane 2019.</b>
       </p>
      `// plain text body
    };

    console.log(`${process.env.MAIL_PORT}`)
    transporter.sendMail(mailOptions, function (err, info) {
      if(err)
        console.log(err)
      else
        console.log(info);
      
   });

    /*-----------------------END Send MaiL------------------------ */
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
      //throw error;
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
    const existingCity = await City.findById(churchInput.city);
    if (!existingCity) {
      const error = new Error('The City associated to this church doesn t exist!');
      error.code = 409;
      throw error;
    }
    const church = new Church({
      name: churchInput.name,
      fullName: churchInput.name +" "+ existingCity.name,
      description: churchInput.description,
      city: churchInput.city
    });
    const createdChurch = await church.save();

    if(existingCity){
      existingCity.churches.push(createdChurch);
      existingCity.save();

      createdChurch.city=existingCity;
      createdChurch.save();
    }
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
