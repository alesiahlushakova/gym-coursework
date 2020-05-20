
const conversion = require('./conversion');
let memberStats = require('./memberStats');
const assessmentStore = require('../models/assessment-store');

const analytics = {


  generateMemberStats(member) {
    let weight = member.startingweight;
    let assessmentlist = assessmentStore.getAssessmentList(member.id);
    if (assessmentlist) {
      if (assessmentlist.assessments.length > 0) {
        weight = assessmentlist.assessments[0].weight;
      }

      if (assessmentlist.assessments.length === 1) {
        if (member.startingweight > assessmentlist.assessments[0].weight) {
          memberStats.trend = true;
        }
      } else if (assessmentlist.assessments.length > 1) {
        if (weight < assessmentlist.assessments[1].weight) {
          memberStats.trend = true;
        }
      }
    }

   
    memberStats.bmi = this.calculateBMI(member, weight);
    memberStats.bmiCategory = this.determineBMICategory(member, weight);
    memberStats.isIdealBodyweight = this.isIdealBodyWeight(member, weight);

    return memberStats;
  },

 
  calculateBMI(member, weight) {
    if (member.height <= 0)
      return 0;
    else
      return conversion.round((weight / (member.height * member.height)), 2);
  },


  determineBMICategory(member, weight) {
    let bmi = this.calculateBMI(member, weight);

    if (bmi < 15) return 'VERY SEVERELY UNDERWEIGHT';
    else if (bmi < 16) return 'SEVERELY UNDERWEIGHT';
    else if (bmi < 18.5) return 'UNDERWEIGHT';
    else if (bmi < 25) return 'NORMAL';
    else if (bmi < 30) return 'OVERWEIGHT';
    else if (bmi < 35) return 'MODERATELY OBESE';
    else if (bmi < 40) return 'SEVERELY OBESE';
    else return 'VERY SEVERELY OBESE';
  },

 
  isIdealBodyWeight(member, weight) {
    let fiveFeet = 60.0;
    let idealBodyWeight;

    let inches = conversion.convertMetresToInches(member.height, 2);

    if (inches <= fiveFeet) {
      if (member.gender === 'Male') {
        idealBodyWeight = 50;
      } else {
        idealBodyWeight = 45.5;
      }
    } else {
      if (member.gender === 'Male') {
        idealBodyWeight = 50 + ((inches - fiveFeet) * 2.3);
      } else {
        idealBodyWeight = 45.5 + ((inches - fiveFeet) * 2.3);
      }
    }

  
    return ((idealBodyWeight <= (weight + 2.0))
      && (idealBodyWeight >= (weight - 2.0))
    );
  },
};

module.exports = analytics;
