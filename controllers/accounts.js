
const memberstore = require('../models/member-store');
const trainerstore = require('../models/trainer-store');
const bcrypt =  require('bcrypt');
const uuid = require('uuid');

const accounts = {

  index(request, response) {
    const viewData = {
      title: 'Login or Signup',
    };
    response.render('start', viewData);
  },


  login(request, response) {
    const viewData = {
      title: 'Login to the Service',
    };
    response.render('login', viewData);
  },

  logout(request, response) {
    response.cookie('user', '');
    response.redirect('/');
  },

 
  signup(request, response) {
    const viewData = {
      title: 'Sign Up to the Service',
    };
    response.render('signup', viewData);
  },

  register(request, response) {
    const member = request.body;
    member.id = uuid();
    member.startingweight = Number(member.startingweight);
    member.height = Number(member.height);
    member.email = member.email.toLowerCase();
 let hash = bcrypt.hashSync(member.password,10);
  member.password =hash;
  member.confirmPassword=hash;
  member.program = [];
  if (memberstore.getMemberByEmail(member.email) || trainerstore.getTrainerByEmail(member.email)) {
    response.render('signup', {
      messageType: 'negative',
      message: 'Email is not unique. Please use another email to sign up',
    });
  } else {
    memberstore.addMember(member);
  
    response.render('login', {
      messageType: 'positive',
      message: 'Successfully signed up. Login to begin !',
    });
  }

  },

 
  authenticate(request, response) {
    const theEmailToLowerCase = request.body.email.toLowerCase();
    const member = memberstore.getMemberByEmail(theEmailToLowerCase);
    const trainer = trainerstore.getTrainerByEmail(theEmailToLowerCase);


      if (member &&  bcrypt.compareSync(request.body.password, member.password)) {
  
        response.cookie('user', member.id);
       
        response.redirect('/dashboard');
      } else if (trainer && bcrypt.compareSync(request.body.password, trainer.password)) {
        response.cookie('user', trainer.id);
       
        response.redirect('/trainerDashboard');
      } else {
        response.render('login', {
          messageType: 'negative',
          message: 'Email/Password do not match. Please try again.',
        });
      }

   
  },

  getCurrentUser(request) {
    const userId = request.cookies.user;
    let user = memberstore.getMemberById(userId);
    if (!user) {
      user = trainerstore.getTrainerById(userId);
    }

    return user;
  },

  userIsTrainer(request) {
    return !!trainerstore.getTrainerById(request.cookies.user);
  },
};

module.exports = accounts;
