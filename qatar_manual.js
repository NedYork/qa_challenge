var Nightmare = require('./lib/nightmare');
var vo = require('vo');

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

ARRIVAL_AIRPORT = 'DXB';
ARRIVAL_CITY = airportCityNameMapping[ARRIVAL_AIRPORT];
DEPARTURE_DATE = '01-Feb-2017';
ARRIVAL_DATE = '10-Feb-2017';

vo(gen)(function(err) {
  if (err) throw err
});


function* gen() {
  const nbot = Nightmare({
    show: false
  });

  yield nbot.goto('http://www.qatarairways.com/de/en/homepage.page');

  var value = yield nbot.wait('form[id="homeSearch"]')
    .evaluate(() => {
      document.getElementById("fromStation").value = "JFK";
      document.getElementById("autocompleteFrom").value = "New York";
      document.getElementById("toStation").value = ARRIVAL_AIRPORT;
      document.getElementById("autocompleteTo").value = airportCityNameMapping[ARRIVAL_AIRPORT];
      document.getElementById("departing").value = DEPARTURE_DATE;
      document.getElementById("returning").value = ARRIVAL_DATE;
    })
    .click('form[id="homeSearch"] [id=bookFlight]')
    .wait('button[id="indexItinerarayContinue"]')
    .evaluate(() => {
      var list = document.getElementsByClassName("price");
      for (var i = 0; i < list.length; i++) {
        // If the innerText HTML is zero aka price is zero,
        if (Number(list[i].innerText) === 0) {
          return 'Zero found!';
          // then write down Date and Destination into file
        }
      }
      return 'None found';
    })
    .then(function (res) {
      console.log('completed this round', res)
    })
    .catch(function (error) {
      console.error('failed this round', error);
    });

  yield nbot.end();
}
