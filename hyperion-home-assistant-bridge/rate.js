let rate = 500;

module.exports = {
    get: () => {
      return rate;
    },
  
    set: (new_rate) => {
      rate = new_rate;
    },
  };