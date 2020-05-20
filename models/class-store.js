
const _ = require('lodash');
const JsonStore = require('./json-store');


const classStore = {

  store: new JsonStore('./models/class-store.json', { classes: [] }),
  collection: 'classes',


  getAllClasses() {
    return this.store.findAll(this.collection);
  },


  addClass(classes) {
    this.store.add(this.collection, classes);
    this.store.save();
  },

  getClassById(id) {
    return this.store.findOneBy(this.collection, { id: id });
  },

  
  removeClass(classId) {
    const classList = this.getClassById(classId);
    this.store.remove(this.collection, classList);
    this.store.save();
  },

 
  addSession(id, session) {
    const classes = this.getClassById(id);
    classes.sessions.push(session);

    classes.numSessions = classes.sessions.length;
    this.store.save();
  },


  getAllNonHiddenClasses() {
    return this.store.findBy(this.collection, { hidden: false });
  },

  
  removeSession(id, sessionId) {
    const classes = this.getClassById(id);
    const sessions = classes.sessions;
    _.remove(sessions, { id: sessionId });
    classes.numSessions = classes.sessions.length;
    this.store.save();
  },


  getSessionById(classId, sessionId) {
    const classes = this.getClassById(classId);
    return _.find(classes.sessions, { id: sessionId });
  },

  getClassByName(name) {
    return this.store.findOneBy(this.collection, { name: name });
  },

  
  getAllTrainerClasses(id) {
    return this.store.findBy(this.collection, { userid: id });
  },

 
  getClassSessionByDate(id, date) {
    const trainerClasses = this.getAllTrainerClasses(id);
    let sessionMatch = null;
    trainerClasses.forEach(function (classes) {
      if (!sessionMatch) {
        sessionMatch = _.find(classes.sessions, { dateTime: date });
      }
    });

    return sessionMatch;
  },
};

module.exports = classStore;
