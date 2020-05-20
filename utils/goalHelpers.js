
const goalStore = require('../models/goal-store');
const assessmentStore = require('../models/assessment-store');


const goalHelpers = {
 
  setGoalStatusChecks(userId) {
    let today = new Date().setHours(0, 0, 0, 0);
  
    let userGoalList = goalStore.getGoalList(userId);
    if (userGoalList) {
      userGoalList.goals.forEach(function (goal) {
        let goalDate = new Date(goal.date).getTime();
      
        let assessment = assessmentStore.getFirstAssessmentWithinThreeDays(userId, goalDate);
        if (goalDate > today) {
          goal.status = 'Open';
        
        } else if (!assessment && (goalDate === today)) {
          goal.status = 'Awaiting Processing';
         
        } else if (assessment) {
          if (compareGoalToAssessment(assessment, goal)) {
            goal.status = 'Achieved';
            
          } else {
            goal.status = 'Missed';
            
          }
        } else if (!assessment && (goalDate < today)) {
         
          goal.status = 'Missed';
        }
      });
    }

    goalStore.store.save();
  },
};


const compareGoalToAssessment = function (assessment, goal) {
  let totalAssessment = assessment.weight + assessment.chest + assessment.thigh + assessment.upperArm +
    assessment.waist + assessment.hips;
  let totalGoal = goal.weight + goal.chest + goal.thigh + goal.upperArm + goal.waist + goal.hips;
  return (totalAssessment <= totalGoal);
};

module.exports = goalHelpers;
