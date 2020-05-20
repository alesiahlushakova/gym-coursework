const bookingStore = require('../models/booking-store');
const classStore = require('../models/class-store.js');
const uuid = require('uuid');
const _ = require('lodash');
const fitnessStore = require('../models/fitness-store');


const trainerHelper = {
 
  isTrainerFree(trainerId, dateTimeString) {
    let trainerIsFree = (bookingStore.getBookingByDate(trainerId, dateTimeString)
      || classStore.getClassSessionByDate(trainerId, dateTimeString));
    return !trainerIsFree;
  },

  
  getClassOrRoutine(id) {
    const classFound = classStore.getClassById(id);
    const routineFound = fitnessStore.getProgrammeById(id);
    if (classFound) {
     
      return {
        id: uuid(),
        classId: classFound.id,
        image: classFound.image,
        name: classFound.name,
        type: 'classes',
      };
    } else if (routineFound) {
    

      let routineToAdd = _.cloneDeep(routineFound);
      routineToAdd.id = uuid();
      return routineToAdd;
    } else if (id === 'other') {
     
      return {
        id: uuid(),
        name: 'Custom Routine',
        description: 'A custom routine just for you',
        exercises: [],
      };
    }
  },

  
  getNextSessionClass(trainerId) {
    let trainerClasses = classStore.getAllTrainerClasses(trainerId);
    let nextClassList = [];
    trainerClasses.forEach(function (specificClass) {
      let firstSessionInFuture = _.find(specificClass.sessions, function (specificSession) {
        return (new Date() < new Date(specificSession.dateTime));
      });

      if (firstSessionInFuture) {
        // push new object instead of the session found to avoid adding new properties to the session found
        nextClassList.push({
          name: specificClass.name,
          classId: specificClass.id,
          dateTime: firstSessionInFuture.dateTime,
          capacity: firstSessionInFuture.capacity,
          availability: firstSessionInFuture.availability,
        });
      } else {
        nextClassList.push({
          name: specificClass.name,
          classId: specificClass.id,
          dateTime: 'No future session scheduled',
        });
      }
    });

    return nextClassList;
  },
};

module.exports = trainerHelper;
