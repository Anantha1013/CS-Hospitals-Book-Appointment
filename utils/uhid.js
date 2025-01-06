const unique_UHID = () => {
    const randomNumber = Math.floor(100000 + Math.random() * 900000); // Generates a number between 100000 and 999999
    return `PAT${randomNumber}`;
  };
  
  module.exports = unique_UHID;
  