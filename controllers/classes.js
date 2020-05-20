

const classStore = require('../models/class-store');
const uuid = require('uuid');
const accounts = require('./accounts');
const sort = require('../utils/sort');
const moment = require('moment');
const trainerStore = require('../models/trainer-store');
const trainerHelper = require('../utils/trainerHelpers');

const classes = {

  index(request, response) {
  
    if (accounts.userIsTrainer(request)) {
      const viewData = {
        title: 'Trainer Classes',
        classes: classStore.getAllClasses(),
        user: accounts.getCurrentUser(request),
        allTrainers: trainerStore.getAllTrainers(),
      };
      response.render('trainerClasses', viewData);
     
    } else {
      const viewData = {
        title: 'Member Classes',
        classes: classStore.getAllNonHiddenClasses(),
        user: accounts.getCurrentUser(request),
      };
      response.render('memberClasses', viewData);
     
    }
  },

 
  addClass(request, response) {
    const loggedInUser = accounts.getCurrentUser(request);
    const newClass = {
      id: uuid(),
      userid: loggedInUser.id,
      name: request.body.name,
      description: request.body.description,
      duration: Number(request.body.duration),
      difficulty: request.body.difficulty,
      hidden: true,
      numSessions: 0,
      sessions: [],
      image: request.body.image,
    };
 
    classStore.addClass(newClass);
    response.redirect('/classes');
  },

 
  deleteClass(request, response) {
  
    classStore.removeClass(request.params.id);
    response.redirect('/classes');
  },

 
  hideOrUnhideClass(request, response) {
    const classId = request.params.id;
    let classes = classStore.getClassById(classId);
    classes.hidden = !classes.hidden;
    classStore.store.save();
  
    response.redirect('/classes');
  },


  addSession(request, response) {
    const classId = request.params.id;
    let messages = [];
    let weeksRun = Number(request.body.weeks);
    for (let i = 0; i < weeksRun; i++) {
      let weeklyDate = moment(new Date(request.body.dateTime)).add(7 * i, 'days').format('LLL');
      if (trainerHelper.isTrainerFree(accounts.getCurrentUser(request).id, weeklyDate)) {
        const newSession = {
          id: uuid(),
          location: request.body.location,
          dateTime: weeklyDate,
          capacity: Number(request.body.capacity),
          enrolled: [],
          availability: Number(request.body.capacity),
        };
    
        classStore.addSession(classId, newSession);
      } else {
        messages.push({
          messageType: 'negative',
          message: 'Class not added. You have a booking/class at: ' + weeklyDate,
        });
      
      }
    }

    response.render('trainerClassSessions', getClassSessionData(request, messages));
  },

  
  listClassSessions(request, response) {
    const viewData = getClassSessionData(request);
    if (accounts.userIsTrainer(request)) {
      viewData.title = 'Trainer Class Sessions';
      response.render('trainerClassSessions', viewData);
    } else {
      viewData.title = 'Member Class Sessions';
      response.render('memberClassSessions', viewData);
    }
  },

  
  deleteSession(request, response) {
    const classId = request.params.id;
    const sessionId = request.params.sessionid;
    
    classStore.removeSession(classId, sessionId);
    response.redirect('/classes/' + classId);
  },


  updateClass(request, response) {
    let classes = classStore.getClassById(request.params.id);
    classes.name = request.body.name;
    classes.difficulty = request.body.difficulty;
    classes.duration = Number(request.body.duration);
    classes.description = request.body.description;
    classes.image = request.body.image;
    classes.userid = request.body.trainer;
 
    classStore.store.save();
    response.redirect('/classes/');
  },

  updateClassSession(request, response) {
    const classId = request.params.id;
    const sessionId = request.params.sessionid;
    const newDateTime = request.body.dateTime;
    let messages = [];
    let specificSession = classStore.getSessionById(classId, sessionId);
    if (trainerHelper.isTrainerFree(accounts.getCurrentUser(request).id, newDateTime)
    || specificSession.dateTime === newDateTime) {
      specificSession.dateTime = newDateTime;
    } else {
      messages.push({
        messageType: 'negative',
        message: 'You have a booking/class at: ' + newDateTime + '. Other changes are updated',
      });
     
    }

    specificSession.location = request.body.location;
    specificSession.capacity = Number(request.body.capacity);
    specificSession.availability = (specificSession.capacity - specificSession.enrolled.length);
    classStore.store.save();
    response.render('trainerClassSessions', getClassSessionData(request, messages));
  },
};


const getClassSessionData = function (request, messageData) {
  const classId = request.params.id;
  
  sort.sortDateTimeOldToNew(classStore.getClassById(classId).sessions);
  return {
    title: 'Classes',
    classes: classStore.getClassById(classId),
    isTrainer: accounts.userIsTrainer(request),
    user: accounts.getCurrentUser(request),
    message: messageData,
  };
};

module.exports = classes;
