
const express = require('express');
const router = express.Router();

const dashboard = require('./controllers/dashboard.js');
const trainerDashboard = require('./controllers/trainerDashboard.js');
const accounts = require('./controllers/accounts.js');
const classes = require('./controllers/classes.js');
const assessments = require('./controllers/assessments.js');
const settings = require('./controllers/settings.js');
const bookings = require('./controllers/bookings.js');
const search = require('./controllers/search.js');
const goals = require('./controllers/goals.js');
const handleBarHelpers = require('./controllers/handlebarHelpers.js');
const fitness = require('./controllers/fitness.js');


// Accounts
router.get('/', accounts.index);
router.get('/login', accounts.login);
router.get('/signup', accounts.signup);
router.get('/logout', accounts.logout);
router.post('/register', accounts.register);
router.post('/authenticate', accounts.authenticate);

// Member
router.get('/dashboard', dashboard.index);
router.get('/routine/:userid/:id', dashboard.viewPersonalRoutine);
router.post('/classes/:id/enrolAll', dashboard.enrollAllSessions);
router.post('/classes/:id/enroll/:sessionid', dashboard.enrollSpecificSession);
router.get('/classes/:id/unEnrolAll', dashboard.unEnrollAllSession);
router.get('/classes/:id/unEnroll/:sessionid', dashboard.unEnrollSpecificSession);

// Trainer
router.get('/trainerDashboard', trainerDashboard.index);
router.get('/trainerDashboard/members', trainerDashboard.listAllMembers);
router.get('/trainerDashboard/members/:id', trainerDashboard.viewSpecificMember);
router.get('/trainerDashboard/delete/:id', trainerDashboard.deleteMember);
router.post('/trainerDashboard/buildProgramme/:id', trainerDashboard.buildFitnessProgramme);
router.get('/trainerDashboard/deleteProgramme/:id', trainerDashboard.deleteFitnessProgramme);
router.get('/trainerDashboard/:userid/deleteRoutine/:id', trainerDashboard.deleteFitnessRoutine);
router.post('/trainerDashboard/:userid/editRoutine/:id', trainerDashboard.editFitnessRoutine);

// Classes
router.get('/classes/', classes.index);
router.post('/classes/addclass', classes.addClass);
router.get('/classes/delete/:id', classes.deleteClass);
router.get('/classes/hideOrUnhide/:id', classes.hideOrUnhideClass);
router.get('/classes/:id', classes.listClassSessions);
router.post('/classes/:id/addsession', classes.addSession);
router.get('/classes/:id/deletesession/:sessionid', classes.deleteSession);
router.post('/classes/:id/', classes.updateClass);
router.post('/classes/:id/updateSession/:sessionid', classes.updateClassSession);

// Assessments
router.post('/assessments/addassessment/:id', assessments.addAssessment);
router.get('/assessments/deleteAssessment/:userid/:id', assessments.deleteAssessment);
router.post('/assessments/:userid/update/:id', assessments.updateAssessment);

// Bookings
router.post('/bookings/addbooking/:id', bookings.addBooking);
router.get('/bookings/delete/:id', bookings.deleteBooking);
router.post('/bookings/update/:id', bookings.updateBooking);

// Settings
router.get('/settings/', settings.index);
router.post('/updateSettings', settings.updateSettings);

// Search
router.post('/search/class', search.searchClassByName);
router.post('/search/member', search.searchMember);

// Goals
router.post('/goals/addgoal/:id', goals.addGoal);
router.get('/goals/deleteGoal/:userid/:id', goals.deleteGoal);

// Fitness Programmes
router.get('/fitness', fitness.index);
router.post('/fitness/addroutine', fitness.addRoutine);
router.get('/fitness/delete/:id', fitness.deleteRoutine);
router.post('/fitness/update/:id', fitness.updateRoutine);
router.get('/fitness/:id', fitness.listRoutineExercises);
router.post('/fitness/:userid/addExercise/:id', fitness.addExercise);
router.get('/fitness/:userid/:id/deleteExercise/:exerciseid', fitness.deleteExercise);
router.post('/fitness/:userid/:id/updateExercise/:exerciseid', fitness.updateExercise);

module.exports = router;
