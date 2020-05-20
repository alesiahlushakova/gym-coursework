

const bookingStore = require('../models/booking-store');
const trainers = require('../models/trainer-store');
const members = require('../models/member-store');
const uuid = require('uuid');
const trainerHelper = require('../utils/trainerHelpers');

const bookings = {
 
  addBooking(request, response) {
    const newBooking = {
      id: uuid(),
      userid: request.params.id,
      userName: members.getMemberById(request.params.id).name,
      trainerid: trainers.getTrainerByName(request.body.trainer).id,
      trainerName: request.body.trainer,
      dateTime: request.body.dateTime,
      status: 'Pending',
    };
    if (trainerHelper.isTrainerFree(newBooking.trainerid, newBooking.dateTime)) {
      bookingStore.addBooking(newBooking);
      bookingStore.store.save();
    } else {
     
    }

    response.redirect('back');
  },

  
  deleteBooking(request, response) {
    bookingStore.removeBooking(request.params.id);
    response.redirect('back');
  },

  
  updateBooking(request, response) {
    let booking = bookingStore.getBookingById(request.params.id);
    if (trainerHelper.isTrainerFree(trainers.getTrainerByName(request.body.trainer).id, request.body.dateTime)) {
      booking.dateTime = request.body.dateTime;
    } else {
     
    }

    booking.trainerName = request.body.trainer;
    booking.trainerid = trainers.getTrainerByName(request.body.trainer).id;
    booking.comment = request.body.comment;
    booking.status = request.body.status;
    bookingStore.store.save();
    response.redirect('back');
  },
};

module.exports = bookings;
