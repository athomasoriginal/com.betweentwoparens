// -----------------------------------------------------------------------------
// Filters
// -----------------------------------------------------------------------------

// dateFilter
// -----------------------------------------------------------------------------
// Taken from:
// https://github.com/andy-piccalilli/hylia/blob/master/src/filters/date-filter.js
const appendSuffix = (n) => {
  var s = ["th", "st", "nd", "rd"],
    v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};

function dateFilter(value) {
  const dateObject = new Date(value);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const dayWithSuffix = appendSuffix(dateObject.getDate());

  return `${dayWithSuffix} ${
    months[dateObject.getMonth()]
  } ${dateObject.getFullYear()}`;
}

// dateFilter
// -----------------------------------------------------------------------------
// Taken from:
// https://github.com/andy-piccalilli/hylia/blob/master/src/filters/w3-date-filter.js
function w3cDate(value) {
  const dateObject = new Date(value);

  return dateObject.toISOString();
}

module.exports = {
  dateFilter: dateFilter,
  w3cDate: w3cDate,
};
