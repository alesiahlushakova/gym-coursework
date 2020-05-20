
const sort = {

  sortDateTimeOldToNew(theArray) {
    let sortedArray = null;
    if (theArray.length === 0) {
      console.log('The array has no entries to sort');
    } else 
    if (theArray[0].dateTime) {
      sortedArray = theArray.sort(function (a, b) {
        return new Date(a.dateTime) - new Date(b.dateTime);
      });
    } else if (theArray[0].date) {
      sortedArray = theArray.sort(function (a, b) {
        return new Date(a.date) - new Date(b.date);
      });
    }

  
    return sortedArray;
  },


  sortDateTimeNewToOld(theArray) {
    let sortedArray = null;
    if (theArray.length === 0) {
      console.log('The array has no entries to sort');
    } else 
   if (theArray[0].dateTime) {
      sortedArray = theArray.sort(function (a, b) {
        return new Date(b.dateTime) - new Date(a.dateTime);
      });
    } else if (theArray[0].date) {
      sortedArray = theArray.sort(function (a, b) {
        return new Date(b.date) - new Date(a.date);
      });
    }

   
    return sortedArray;
  },
};

module.exports = sort;
