
const JsonStore = require('./json-store');
const _ = require('lodash');

const bookingStore = {

  store: new JsonStore('./models/booking-store.json', { assessmentBookings: [] }),
  collection: 'assessmentBookings',


  getAllBookings() {
    return this.store.findAll(this.collection);
  },


  addBooking(booking) {
    this.store.add(this.collection, booking);
    this.store.save();
  },

  getBookingById(id) {
    return this.store.findOneBy(this.collection, { id: id });
  },

  
  removeBooking(bookingId) {
    const booking = this.getBookingById(bookingId);
    this.store.remove(this.collection, booking);
    this.store.save();
  },

  
  getAllUserBookings(userId) {
    return this.store.findBy(this.collection, { userid: userId });
  },

  
  getAllTrainerBookings(trainerId) {
    return this.store.findBy(this.collection, { trainerid: trainerId });
  },


  removeAllMemberBookings(memberId) {
    while (this.store.findOneBy(this.collection, { userid: memberId })) {
      this.store.remove(this.collection, this.store.findOneBy(this.collection, { userid: memberId }));
      this.store.save();
    }
  },


  getBookingByDate(trainerId, date) {
    const trainerBookings = this.getAllTrainerBookings(trainerId);
    return _.find(trainerBookings, { dateTime: date });
  },
};

module.exports = bookingStore;
