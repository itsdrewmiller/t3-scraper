var request = require('request');
var fs = require('fs');
var _ = require('lodash');
var cheerio = require('cheerio');

var years = [2017,2016,2015,2014,2013,2012,2011,2010,2009,2008,2007,2006,2005,2004,2003,2002,2001,2000,1996,1995,1994,1993,1992,1991,1987,1986,1985,1984];
_.forEach(years, crawlYear);

function crawlYear(year) {
	var url = 'https://triticeaetoolbox.org/barley/view_search_yr2.php?table=experiments&year=' + year;
	request(url, function (err, response, body) {
		var $ = cheerio.load(body);
		$('#main a').each(function(i, elem) {
		  var href = $(this).attr('href');
		  var url = 'https://triticeaetoolbox.org/barley/' + href;
		  request(url, function(err, response, body) {
		  	var filename = href;
		  	filename = filename.replace('display_genotype.php?trial_code=', '') + '.html';
		  	fs.writeFile('./' + filename, body);

		  	while (match = /onclick="javascript:output_file.'([^']+)');"/.exec(body)) {
		  		var num = match[1];
		  		var url_file = 'https://triticeaetoolbox.org/barley/' + num;
		  		request(url_file, function(err, response, body_file) {
		  			fs.writeFile('./file_' + num, body);
		  		});
		  	}

		  	while (match = /onclick="javascript:output_file2.'([^']+)');"/.exec(body)) {
		  		var num = match[1];		  		
		  		var url_file2 = 'https://triticeaetoolbox.org/barley/download_phenotype.php?function=downloadMean&pi=' + num;
		  		request(url_file2, function(err, response, body_file2) {
		  			fs.writeFile('./file2_' + num, body);
		  		});
		  	}

		  	while (match = /onclick="javascript:output_file_plot.'([^']+)');"/.exec(body)) {
		  		var num = match[1];		  		
		  		var url_file2 = 'https://triticeaetoolbox.org/barley/download_phenotype.php?function=downloadPlot&pi=' + num;
		  		request(url_file2, function(err, response, body_file2) {
		  			fs.writeFile('./plot_' + num, body);
		  		});
		  	}
		  });
		});

	});
}