

const accounts = require('./accounts.js');
const classStore = require('../models/class-store.js');
const trainerStore = require('../models/trainer-store');
const memberStore = require('../models/member-store');
const analytics = require('../utils/analytics');
const assessmentStore = require('../models/assessment-store');
const bookingStore = require('../models/booking-store');
const goalStore = require('../models/goal-store');
const fitnessStore = require('../models/fitness-store');
const sort = require('../utils/sort');
const goalHelpers = require('../utils/goalHelpers');
const _ = require('lodash');
const settings = require('./settings');
const trainerHelper = require('../utils/trainerHelpers');

const trainerDashboard = {

  index(request, response) {
 
    const loggedInUser = accounts.getCurrentUser(request);
    const viewData = {
      title: 'Trainer Dashboard',
      user: loggedInUser,
      bookings: sort.sortDateTimeOldToNew(bookingStore.getAllTrainerBookings(loggedInUser.id)),
      isTrainer: accounts.userIsTrainer(request),
      allTrainers: trainerStore.getAllTrainers(),
      allMembers: memberStore.getAllMembers(),
      nextClassList: sort.sortDateTimeOldToNew(trainerHelper.getNextSessionClass(loggedInUser.id)),
    };
   
    response.render('trainerDashboard', viewData);
  },


  listAllMembers(request, response) {
   
    const viewData = {
      title: 'Trainer Members',
      user: accounts.getCurrentUser(request),
      isTrainer: accounts.userIsTrainer(request),
      allTrainers: trainerStore.getAllTrainers(),
      allMembers: memberStore.getAllMembers(),
      allClasses: classStore.getAllNonHiddenClasses(),
      allRoutines: fitnessStore.getAllProgrammes(),
    };
    if (accounts.userIsTrainer(request)) {
      response.render('trainerMembers', viewData);
    } else {
      response.redirect('back');
    }
  },


  viewSpecificMember(request, response) {
    const userId = request.params.id;
   
    if (goalStore.getGoalList(userId)) {
      sort.sortDateTimeNewToOld(goalStore.getGoalList(userId).goals);
      goalHelpers.setGoalStatusChecks(userId);
    }

    const viewData = {
      title: 'Trainer Members',
      user: memberStore.getMemberById(userId),
      isTrainer: accounts.userIsTrainer(request),
      allTrainers: trainerStore.getAllTrainers(),
      assessmentlist: assessmentStore.getAssessmentList(userId),
      stats: analytics.generateMemberStats(memberStore.getMemberById(userId)),
      goals: goalStore.getGoalList(userId),
      bookings: sort.sortDateTimeOldToNew(bookingStore.getAllUserBookings(userId)),
      allClasses: classStore.getAllNonHiddenClasses(),
      allRoutines: fitnessStore.getAllProgrammes(),
    };
    if (accounts.userIsTrainer(request)) {
      response.render('dashboard', viewData);
    } else {
      response.redirect('back');
    }
  },

 
  buildFitnessProgramme(request, response) {
    const userId = request.params.id;
    const member = memberStore.getMemberById(userId);
   
    const program = [];
    program.push(trainerHelper.getClassOrRoutine(request.body.first));
    program.push(trainerHelper.getClassOrRoutine(request.body.second));
    program.push(trainerHelper.getClassOrRoutine(request.body.third));
    program.push(trainerHelper.getClassOrRoutine(request.body.fourth));
    program.push(trainerHelper.getClassOrRoutine(request.body.fifth));

    // compact - to remove null objects if less than 5 exercise sessions were selected
    member.program = _.compact(program);
    memberStore.store.save();
    response.redirect('back');
  },


  deleteFitnessProgramme(request, response) {
    const userId = request.params.id;
    const member = memberStore.getMemberById(userId);
    member.program.length = 0;
    memberStore.store.save();
    response.redirect('back');
  },


  deleteFitnessRoutine(request, response) {
    const userId = request.params.userid;
    const routineId = request.params.id;
    const member = memberStore.getMemberById(userId);
    _.remove(member.program, { id: routineId });
    memberStore.store.save();
    response.redirect('back');
  },

 
  editFitnessRoutine(request, response) {
    const userId = request.params.userid;
    const routineId = request.params.id;
    let routine = _.find(memberStore.getMemberById(userId).program, { id: routineId });
    routine.name = request.body.name;
    routine.image = request.body.image;
    if (routine.description) {
      routine.description = request.body.description;
    }

    memberStore.store.save();
    response.redirect('back');
  },


  deleteMember(request, response) {
    const userId = request.params.id;
    const member = memberStore.getMemberById(userId);
    memberStore.removeMember(member);
    assessmentStore.removeAssessmentList(userId);
    bookingStore.removeAllMemberBookings(userId);
    goalStore.removeGoalList(userId);
    settings.deleteFromCloud(member);
    response.redirect('back');
  },
};

module.exports = trainerDashboard;
