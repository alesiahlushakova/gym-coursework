
const classStore = require('../models/class-store.js');
const members = require('../models/member-store');


const search = {
  
  searchClassByName(request, response) {
    const searchClass = classStore.getClassByName(request.body.search);
   
    if (searchClass) {
     
      response.redirect('/classes/' + searchClass.id);
    } else {
     
      response.redirect('back');
    }
  },


  searchMember(request, response) {
    let search = request.body.search;
    let email = search.match(/([\w-\.]+)@((?:[\w]+\.)+)([a-zA-Z]{2,4})/g);
    if (email) {
      
      const member = members.getMemberByEmail(email.toString());
     
      response.redirect('/trainerDashboard/members/' + member.id);
    } else {
      response.redirect('back');
    }
  },
};

module.exports = search;
