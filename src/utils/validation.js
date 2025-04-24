//function to validate that a phone number contains exactly 10 digits
const validatePhoneNumbers = (phoneNumbers) => {
  const phoneFormat = /^\d{10}$/;
  for (let phoneNumb of phoneNumbers) {
    if (!phoneFormat.test(phoneNumb)) {
      return {
        isValid: false,
        message: "Phone number must have exactly 10 digits",
      };
    }
  }
  return { isValid: true };
};

//validates that the chassis number matches the standard 17-character VIN format:
//the first 3 characters must be letters (excluding I, O, Q) and the remaining 14 characters can be letters (excluding I, O, Q) or digits
const validateChassisNumber = (chassisNumber) => {
  const chassisNumberFormat = /^[A-HJ-NPR-Z]{3}[A-HJ-NPR-Z0-9]{14}$/;
  return chassisNumberFormat.test(chassisNumber);
};

//format a date object as a string in the format "dd.mm.yyyy"
const parseDate = (dateString) => {
  const [datePart, timePart] = dateString.split(" ");
  const [day, month, year] = datePart.split(".");
  const [hours, minutes] = timePart.split(":");

  const date = new Date(year, month - 1, day, hours, minutes);
  return date;
};

//function to validate appointment time to be between 8 and 17 - multiple of 30 minutes
const isValidAppointmentTime = (date) => {
  const hour = date.getHours();
  const minutes = date.getMinutes();
  return hour >= 8 && hour < 17 && (minutes === 0 || minutes === 30);
};

module.exports = {
  validatePhoneNumbers,
  validateChassisNumber,
  parseDate,
  isValidAppointmentTime,
};
