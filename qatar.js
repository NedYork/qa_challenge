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
// Date Format
// 08-Apr-2017

// vo(run)(function(err) {
//   if (err) throw err
// });
vo(gen)(function(err) {
  if (err) throw err
});

// function* run() {
//   var results = yield * forEach(validEmails, gen);
//   console.log(results);
// }
//
// function* forEach(arr, fn) { // NEEDED BECAUSE FOREACH DOESN'T WORK IN GENERATORS
//   let i;
//   var results = [];
//   for (i = 0; i < arr.length; i++) {
//     results.push(yield * fn(arr[i]));
//   }
//   return results;
// }

function* gen() {
  const nbot = Nightmare({
    show: true
  });
  yield nbot.goto('http://www.qatarairways.com/de/en/homepage.page');
  // var timeA = Math.floor((Math.random() * 1000) + (Math.random() * 2000));
  // var timeB = Math.floor((Math.random() * 1000) + (Math.random() * 2000));
  // var timeC = Math.floor((Math.random() * 1000) + (Math.random() * 2000));
  // var timeD = Math.floor((Math.random() * 1000) + (Math.random() * 2000));
  // var timeE = Math.floor((Math.random() * 1000) + (Math.random() * 2000));
  // var timeF = Math.floor((Math.random() * 1000) + (Math.random() * 2000));

  var value = yield nbot.wait('form[id="homeSearch"]')
    .evaluate(() => {
      document.getElementById("fromStation").value="JFK";
      document.getElementById("autocompleteFrom").value="New York"
      document.getElementById("toStation").value="DXB";
      document.getElementById("autocompleteFrom").value="Dubai"
    })
    // .type('form[id*="homeSearch"] [id=FromTemp]', "NYC")
    // .wait(timeB)
    .wait('form[id="homeSearcha"]')
    .check('form[action*="/create_entry"] [id=email_user_gender_m]')
    // .wait(timeC)
    .select('form[action*="/create_entry"] [id=email_user_birth_date_2i]', 5)
    // .wait(timeD)
    .select('form[action*="/create_entry"] [id=email_user_birth_date_3i]', 2)
    // .wait(timeE)
    .select('form[action*="/create_entry"] [id=email_user_birth_date_1i]', 1993)
    // .wait(timeF)
    .click('form[action*="/create_entry"] [type=submit]')
    .evaluate(function () {
      return document.querySelector('#sweeps-thankyou .sweeps-header h1')
    })
    .wait(15000)
    .then(function (result) {
      console.log('Success:', num)
    })
    .catch(function (error) {
      console.error('Failed:', error);
    });

  yield nbot.end();
}

// nightmare
//   .goto('http://yahoo.com')
//   .type('form[action*="/search"] [name=p]', 'github nightmare')
//   .click('form[action*="/search"] [type=submit]')
//   .wait('#main')
//   .evaluate(function () {
//     return document.querySelector('#main .searchCenterMiddle li a').href
//   })
//   .end()
//   .then(function (result) {
//     console.log(result)
//   })
//   .catch(function (error) {
//     console.error('Search failed:', error);
//   });
