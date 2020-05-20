
const uuid = require('uuid');
const accounts = require('./accounts');
const fitnessStore = require('../models/fitness-store');
const membersStore = require('../models/member-store');
const _ = require('lodash');

const fitness = {
 
  index(request, response) {
    const user = accounts.getCurrentUser(request);
    const isTrainer = accounts.userIsTrainer(request);
  
    if (isTrainer) {
      const viewData = {
        title: 'Trainer Workout Routines',
        user: user,
        isTrainer: isTrainer,
        routines: fitnessStore.getAllProgrammes(),
      };
      response.render('fitness', viewData);
    
    } else {
      const viewData = {
        title: 'Member Fitness Programme',
        user: user,
      };
      response.render('fitness', viewData);
    
    }
  },


  addRoutine(request, response) {
    const newProgramme = {
      id: uuid(),
      name: request.body.name,
      image: request.body.image,
      description: request.body.description,
      exercises: [],
    };
    fitnessStore.addProgramme(newProgramme);
   
    response.redirect('back');
  },

  deleteRoutine(request, response) {
   
    fitnessStore.removeProgramme(request.params.id);
    response.redirect('/fitness');
  },

  
  updateRoutine(request, response) {
    let routine = fitnessStore.getProgrammeById(request.params.id);
    routine.name = request.body.name;
    routine.description = request.body.description;
    routine.image = request.body.image;
   
    fitnessStore.store.save();
    response.redirect('/fitness/');
  },

 
  listRoutineExercises(request, response) {
    const isTrainer = accounts.userIsTrainer(request);
    const routineId = request.params.id;
   
    const viewData = {
      title: 'Trainer Routine Exercises',
      routine: fitnessStore.getProgrammeById(routineId),
      isTrainer: isTrainer,
      userId: accounts.getCurrentUser(request).id,
      user: accounts.getCurrentUser(request),
    };
    response.render('fitnessExercises', viewData);
  },

 
  addExercise(request, response) {
    const routineId = request.params.id;
    const userId = request.params.userid;
    const newExercise = {
      id: uuid(),
      name: request.body.name,
      type: request.body.type,
      reps: Number(request.body.reps),
      sets: Number(request.body.sets),
      duration: Number(request.body.duration),
      rest: Number(request.body.rest),
    };
  
    if (membersStore.getMemberById(userId)) {
      let user = membersStore.getMemberById(userId);
      let routine = _.find(user.program, { id: routineId });
      routine.exercises.push(newExercise);
      membersStore.store.save();
      response.redirect('back');
    } else {
      fitnessStore.addExercise(routineId, newExercise);
      response.redirect('/fitness/' + routineId);
    }

  },

  deleteExercise(request, response) {
    const routineId = request.params.id;
    const exerciseId = request.params.exerciseid;
    const userId = request.params.userid;
    let isMember = membersStore.getMemberById(userId);
    if (isMember) {
      let routine = _.find(isMember.program, { id: routineId });
      _.remove(routine.exercises, { id: exerciseId });
      membersStore.store.save();
    } else {
      fitnessStore.removeExercise(routineId, exerciseId);
    }

   
    response.redirect('back');
  },


  updateExercise(request, response) {
    const routineId = request.params.id;
    const exerciseId = request.params.exerciseid;
    const userId = request.params.userid;
    let exercise = null;
    let isMember = membersStore.getMemberById(userId);
    if (isMember) {
      let routine = _.find(isMember.program, { id: routineId });
      exercise = _.find(routine.exercises, { id: exerciseId });
    } else {
      exercise = fitnessStore.getExerciseFromRoutine(routineId, exerciseId);
    }

    exercise.name = request.body.name;
    exercise.type = request.body.type;
    exercise.sets = Number(request.body.sets);
    exercise.reps = Number(request.body.reps);
    exercise.duration = Number(request.body.duration);
    exercise.rest = Number(request.body.rest);
    isMember ? membersStore.store.save() : fitnessStore.store.save();
    response.redirect('back');
  },
};

module.exports = fitness;
