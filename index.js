var request = require('request');
 var fs = require('fs');

request('https://triticeaetoolbox.org/barley/display_phenotype.php?trial_code=FHB_2005_Crookston',
 function (err, response, body) {
  if (err) {
  	console.log('error', err);
  }

  fs.writeFile('./FHB_2005_Crookston.html', body);
});