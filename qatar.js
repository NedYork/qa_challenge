var Nightmare = require('./lib/nightmare');
var vo = require('vo');
var fs = require('fs');

const airportCityNameMapping = {
  'DXB': 'Dubai',
  'RKT': 'Ras Al Khaimah',
  'EVN': 'Yerevan',
  'SEZ': 'Seychelles',
  'TBS': 'Tbilisi',
  'CPT': 'Cape Town'
}

const airportMonthMapping = {
  'DXB': ['Feb', 'Mar', 'Apr'],
  'RKT': ['Feb', 'Mar'],
  'EVN': ['Feb', 'Apr'],
  'SEZ': ['Feb', 'Apr'],
  'TBS': ['Feb'],
  'CPT': ['Mar']
}

const monthLastDayMapping = {
  'Feb': 28,
  'Mar': 31,
  'Apr': 30
}

vo(run)(function(err) {
  if (err) throw err
});

function* run() {
  const airports = Object.keys(airportCityNameMapping);
  const results = yield * forEach(airports, gen);
  console.log(results);
}

function* forEach(airports, func) { // NEEDED BECAUSE FOREACH DOESN'T WORK IN GENERATORS
  let i;
  const results = [];
  for (i = 0; i < airports.length; i++) {
    // "19-Jan-2017"
    const currentAirport = airports[i];
    const currentDestinationCity = airportCityNameMapping[currentAirport];
    const availableMonths = airportMonthMapping[airports[i]];
    let j;
    for (j = 0; j < availableMonths.length; j++) {
      const currentMonth = availableMonths[j];
      const lastDayOfCurrentMonth = monthLastDayMapping[currentMonth];
      // for (k = 1; k < lastDayOfCurrentMonth; k++) {
        // const dateStr = "";
          results.push(yield * func(currentAirport, currentDestinationCity, "19-Jan-2017", "29-Jan-2017"));
      // }
    }
  }
  return results;
}

// function* forEach(arr, fn) { // NEEDED BECAUSE FOREACH DOESN'T WORK IN GENERATORS
//   let i;
//   var results = [];
//   for (i = 0; i < arr.length; i++) {
//     results.push(yield * fn(arr[i]));
//   }
//   return results;
// }

function* gen(destinationAirport, destinationCity, departureDate, returnDate) {
  const nbot = Nightmare({
    show: true
  });

  yield nbot.goto('http://www.qatarairways.com/de/en/homepage.page');

  var value = yield nbot.wait('form[id="homeSearch"]')
    .evaluate(() => {
      document.getElementById("fromStation").value = "JFK";
      document.getElementById("autocompleteFrom").value = "New York";
      document.getElementById("toStation").value = 'DXB';
      document.getElementById("autocompleteTo").value = 'Dubai';
      document.getElementById("departing").value = '02-Feb-2017';
      document.getElementById("returning").value = '13-Feb-2017';
    })
    .click('form[id="homeSearch"] [id=bookFlight]')
    .wait('button[id="indexItinerarayContinue"]')
    .evaluate(() => {
      var list = document.getElementsByClassName("price");
      for (var i = 0; i < list.length; i++) {
        // If the innerText HTML is less than specified amount aka price is sub-100,
        if (Number(list[i].innerText) < 100) {
          return list;
          // then write down Date and Destination into file
          // http://stackoverflow.com/questions/2496710/writing-files-in-node-js
          // fs.writeFile("/tmp/test", "Hey there!", function(err) {
          //   if(err) {
          //     return console.log(err);
          //   }
          //   console.log("The file was saved!");
          // });
        }
      }
      return list;
    })
    .then(function (res) {
      console.log('completed this round', res)
    })
    .catch(function (error) {
      console.error('failed this round', error);
    });

  yield nbot.end();
}
