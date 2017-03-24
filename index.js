var request = require('request');
var fs = require('fs');
var _ = require('lodash');
var cheerio = require('cheerio');

var years = [];
for (i=1969;i<2018;i++) { 
	years.push(i); 
}

var crops = ['oat','barley','wheat'];

_.forEach(crops, crawlCrop);

function crawlCrop(crop) {
	_.forEach(years, crawlYearGen(crop));	
}


// database is organized by year
// each year gives you a table of links, each link goes to a trial
// each trial is downloaded as an html page (in crawlTrial)
// and the dataset is separately downloaded

function crawlYearGen(crop) {
	return function(year) {
		var url = 'https://triticeaetoolbox.org/' + crop + '/view_search_yr2.php?table=experiments&year=' + year;
		request(url, function (err, response, body) {
			// Some years don't have any data, so let's abort
			if (!body) { return; }
			var $ = cheerio.load(body);
			$('#main a').each(function(i, elem) {
			  var href = $(this).attr('href');
			  var trialCode = href.replace('display_phenotype.php?trial_code=', '');
			  crawlTrial(trialCode, crop);
			});
		});
	};
}


function crawlTrial(trialCode, crop) {
  var url = 'https://triticeaetoolbox.org/' + crop + '/display_phenotype.php?trial_code=' + trialCode;
  request(url, function(err, response, body) {
  	var filename = trialCode + '.html';
  	fs.writeFile('./' + filename, body);

  	while (match = /onclick=.javascript:output_file.'([^']+)'.;./g.exec(body)) {
  		var num = match[1];
  		var url_file = 'https://triticeaetoolbox.org/' + crop + '/' + num;
  		request(url_file, function(err, response, body_file) {
  			fs.writeFile('./file_' + num, body_file);
  		});
  	}

  	while (match = /onclick=.javascript:output_file2.'([^']+)'.;./g.exec(body)) {
  		var num = match[1];		  		
  		var url_file2 = 'https://triticeaetoolbox.org/' + crop + '/download_phenotype.php?function=downloadMean&pi=' + num;
  		request(url_file2, function(err, response, body_file2) {
  			fs.writeFile('./file2_' + num, body_file2);
  		});
  	}

  	while (match = /onclick=.javascript:output_file_plot.'([^']+)'.;./g.exec(body)) {
  		var num = match[1];		  		
  		var url_file_plot = 'https://triticeaetoolbox.org/' + crop + '/download_phenotype.php?function=downloadPlot&pi=' + num;
  		request(url_file_plot, function(err, response, body_file_plot) {
  			fs.writeFile('./plot_' + num, body_file_plot);
  		});
  	}
  });
}