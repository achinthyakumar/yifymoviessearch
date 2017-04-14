/*global $, jQuery*/
(function () {
	'use strict'; // this function is strict...
	$(document).ready(function () {
		
	});
	var ytsApp = angular.module('ytsApp', []);
	ytsApp.config(function($routeProvider) {
    $routeProvider
		.when("/", {
			templateUrl : "index.html"
		})
	});
	
}());
