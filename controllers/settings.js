

const accounts = require('./accounts.js');
const memberstore = require('../models/member-store');
const trainerstore = require('../models/trainer-store');


const settings = {

  index(request, response) {
   
    const viewData = {
      title: 'Settings',
      user: accounts.getCurrentUser(request),
      isTrainer: accounts.userIsTrainer(request),
    };
    response.render('settings', viewData);
  },

 
  updateSettings(request, response) {
    let loggedInUser = accounts.getCurrentUser(request);
    const newEmail = request.body.email.toLowerCase();
    const newEmailIsUsed = function () {
      return (trainerstore.getTrainerByEmail(newEmail) || memberstore.getMemberByEmail(newEmail));
    };

    loggedInUser.name = request.body.name;
    if (!newEmailIsUsed()) {
      loggedInUser.email = newEmail;
    }

    loggedInUser.password = request.body.password;
    loggedInUser.gender = request.body.gender;
    loggedInUser.address = request.body.address;
    loggedInUser.height = Number(request.body.height);
    loggedInUser.startingweight = Number(request.body.startingweight);
    if (accounts.userIsTrainer(request)) {
    
      trainerstore.store.save();
    } else {
    
      memberstore.store.save();
    }

    if (newEmailIsUsed() && (newEmail !== loggedInUser.email)) {
      response.render('settings', {
        messageType: 'negative',
        message: 'Cannot update to new email. New email already used by another member/trainer. Other settings are updated',
        user: loggedInUser,
        isTrainer: accounts.userIsTrainer(request),
      });
    } else {
      response.render('settings', {
        messageType: 'positive',
        message: 'Settings successfully updated',
        user: loggedInUser,
        isTrainer: accounts.userIsTrainer(request),
      });
    }

  },




};

module.exports = settings;
