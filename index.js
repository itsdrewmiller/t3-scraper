var request = require('request');
var fs = require('fs');
var _ = require('lodash');
var cheerio = require('cheerio');

crawlYear(2000);

function crawlYear(year) {
	var url = 'https://triticeaetoolbox.org/barley/view_search_yr2.php?table=experiments&year=' + year;
	request(url, function (err, response, body) {
		var $ = cheerio.load(body);
		$('#main a').each(function(i, elem) {
		  var href = $(this).attr('href');
		  var url = 'https://triticeaetoolbox.org/barley/' + href;
		  request(url, function(err, response, body) {
		  	var filename = href.replace('display_genotype.php?trial_code=', '') + '.html';
		  	fs.writeFile('./' + filename, body);
		  });
		});

	});
}