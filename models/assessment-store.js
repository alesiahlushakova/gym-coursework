
const _ = require('lodash');

const JsonStore = require('./json-store');
const moment = require('moment');


const assessmentStore = {
  store: new JsonStore('./models/assessment-store.json', { assessmentListCollection: [] }),
  collection: 'assessmentListCollection',


  addAssessment(userId, assessment) {
    let assessmentList = this.getAssessmentList(userId);
    if (!assessmentList) {
      assessmentList = {
        userid: userId,
        assessments: [],
      };
      this.store.add(this.collection, assessmentList);
      this.store.save();
    }

    assessmentList.assessments.unshift(assessment);
    this.store.save();
  },


  removeAssessment(userId, assessmentId) {
    let assessmentList = this.getAssessmentList(userId);
    _.remove(assessmentList.assessments, { id: assessmentId });
    this.store.save();
  },

  getAssessmentList(userid) {
    return this.store.findOneBy(this.collection, { userid: userid });
  },

 
  getAssessmentById(userid, assessmentid) {
    const assessmentlist = this.getAssessmentList(userid).assessments;
   
    return _.find(assessmentlist, { id: assessmentid });
  },

 
  removeAssessmentList(userid) {
    let assessmentList = this.getAssessmentList(userid);
    if (assessmentList) {
      this.store.remove(this.collection, assessmentList);
      this.store.save();
    }

   
  },

 
  getFirstAssessmentWithinThreeDays(userId, goalTime) {
    let assessmentList = this.getAssessmentList(userId);
    if (assessmentList) {
      const goalDate = new Date(goalTime);
      const threeDaysBefore = moment(goalDate).subtract(3, 'days').toDate();
     
      let findAssessment = _.find(assessmentList.assessments, function (assessment) {
        let assessmentDate = new Date(new Date(assessment.date).setHours(0, 0, 0, 0));
        return (threeDaysBefore <= assessmentDate) && (assessmentDate <= goalDate);
      });

    
      return findAssessment;
    }

  },
};

module.exports = assessmentStore;
