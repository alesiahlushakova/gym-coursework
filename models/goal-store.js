
const _ = require('lodash');

const JsonStore = require('./json-store');


const goalStore = {
  store: new JsonStore('./models/goal-store.json', { goalListCollection: [] }),
  collection: 'goalListCollection',

  addGoal(userId, goal) {
    let goalList = this.getGoalList(userId);
    if (!goalList) {
      goalList = {
        userid: userId,
        goals: [],
      };
      this.store.add(this.collection, goalList);
      this.store.save();
    }

    goalList.goals.unshift(goal);
    this.store.save();
  },

 
  removeGoal(userId, goalId) {
    let goalList = this.getGoalList(userId);
    _.remove(goalList.goals, { id: goalId });
    this.store.save();
  },


  getGoalList(userid) {
    return this.store.findOneBy(this.collection, { userid: userid });
  },

 
  getGoalById(userid, goalid) {
    const goallist = this.getGoalList(userid).goals;
   
    return _.find(goallist, { id: goalid });
  },

 
  removeGoalList(userid) {
    let goalList = this.getGoalList(userid);
    if (goalList) {
      this.store.remove(this.collection, goalList);
      this.store.save();
    }

   
  },
};

module.exports = goalStore;
