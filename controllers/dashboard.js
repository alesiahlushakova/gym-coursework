
const _ = require('lodash');

const accounts = require('./accounts.js');
const classStore = require('../models/class-store.js');
const trainers = require('../models/trainer-store');
const members = require('../models/member-store');
const analytics = require('../utils/analytics');
const assessmentStore = require('../models/assessment-store');
const bookingStore = require('../models/booking-store');
const goalStore = require('../models/goal-store');
const sort = require('../utils/sort');
const goalHelpers = require('../utils/goalHelpers');

const dashboard = {

  index(request, response) {
  
    const loggedInUser = accounts.getCurrentUser(request);
    if (goalStore.getGoalList(loggedInUser.id)) {
      sort.sortDateTimeNewToOld(goalStore.getGoalList(loggedInUser.id).goals);
      goalHelpers.setGoalStatusChecks(loggedInUser.id);
    }

    const viewData = {
      title: 'Member Dashboard',
      bookings: sort.sortDateTimeNewToOld(bookingStore.getAllUserBookings(loggedInUser.id)),
      allTrainers: trainers.getAllTrainers(),
      assessmentlist: assessmentStore.getAssessmentList(loggedInUser.id),
      user: loggedInUser,
      stats: analytics.generateMemberStats(loggedInUser),
      goals: goalStore.getGoalList(loggedInUser.id),
    };
    response.render('dashboard', viewData);
  },


  enrollAllSessions(request, response) {
    const loggedInUserId = accounts.getCurrentUser(request).id;

    let classes = classStore.getClassById(request.params.id);
    
    let message = [];

    // For each session loop
    classes.sessions.forEach(function (session) {
      // Call function that checks whether member should be enrolled or not
      message.push(enrollChecksHelper(session, loggedInUserId));
    });

    saveAndRedirectHelper(classes.id, response, message, request);
  
  },

  
  enrollSpecificSession(request, response) {
    const loggedInUserId = accounts.getCurrentUser(request).id;
   
    const classId = request.params.id;
    const sessionId = request.params.sessionid;
    let specificSession = classStore.getSessionById(classId, sessionId);
   
    // Call function that checks whether member should be enrolled or not
    let message = [];
    message.push(enrollChecksHelper(specificSession, loggedInUserId));
    saveAndRedirectHelper(classId, response, message, request);
  },

  
  unEnrollAllSession(request, response) {
    const loggedInUserId = accounts.getCurrentUser(request).id;
    let classes = classStore.getClassById(request.params.id);
    let message = [];
    classes.sessions.forEach(function (session) {
      message.push(unEnrollChecksHelper(session, loggedInUserId));
    });

    saveAndRedirectHelper(classes.id, response, message, request);
  },

  unEnrollSpecificSession(request, response) {
    const loggedInUserId = accounts.getCurrentUser(request).id;
  
    const classId = request.params.id;
    const sessionId = request.params.sessionid;

    let specificSession = classStore.getSessionById(classId, sessionId);
  
    let message = [];
    message.push(unEnrollChecksHelper(specificSession, loggedInUserId));

    saveAndRedirectHelper(classId, response, message, request);
  },


  viewPersonalRoutine(request, response) {
    const routineId = request.params.id;
    const userId = request.params.userid;
    const isTrainer = accounts.userIsTrainer(request);
    let user = members.getMemberById(userId);
    let routine = _.find(user.program, { id: routineId });

  
    const viewData = {
      title: 'Fitness Routine',
      routine: routine,
      isTrainer: isTrainer,
      userId: userId,
      user: user,
    };

    response.render('fitnessExercises', viewData);
  },
};


const enrollChecksHelper = function (specificSession, loggedInUserId) {
  let result = specificSession.enrolled.indexOf(loggedInUserId);

  // if user id is not found (result is -1) and session date is in the future
  if (result === -1 && specificSession.availability > 0 && new Date() < new Date(specificSession.dateTime)) {
    specificSession.enrolled.push(loggedInUserId);
    specificSession.availability--;
   
    return {
      messageType: 'positive',
      message: 'You have just enrolled to class session on ' + specificSession.dateTime,
    };
  }
};


const unEnrollChecksHelper = function (specificSession, loggedInUserId) {
  let result = specificSession.enrolled.indexOf(loggedInUserId);
  if (result > -1 && new Date() < new Date(specificSession.dateTime)) {
    specificSession.enrolled.splice(result, 1);
    specificSession.availability++;
   
    return {
      message: '\nYou have unenrolled from the class session on ' + specificSession.dateTime,
      messageType: 'positive',
    };
  }
};


const saveAndRedirectHelper = function (classId, response, message, request) {
  classStore.store.save();
 
  const viewData = {
    title: 'Classes',
    classes: classStore.getClassById(classId),
    message: message,
    user: accounts.getCurrentUser(request),
  };
  response.render('memberClassSessions', viewData);
};

module.exports = dashboard;
