// Define the `phonecatApp` module
angular.module('ytsApp', []).controller('YTSController', function YTSController($scope, $http) {
	$scope.sortType = 'rating';
	$scope.sortReverse = true;
	$scope.showMoviesInTable = false;
	$scope.showResults = false;
	$scope.searchParams = {
		limit: 50,
		minimumRatings: [9, 8, 7, 6, 5, 4, 3, 2, 1],
		minimumRating: 7,
		page: 1,
		rottenTomatoesRating: true,
		quality: ["720p", "1080p", "3D"],
		selectedQuality: ""
	};
	$scope.toggleSort = function (sortType) {
		$scope.sortType = sortType;
		$scope.sortReverse = !$scope.sortReverse;
	};

	$scope.performSearch = function () {
		$scope.showResults = true;
		//sessionStorage.clear();
		if (sessionStorage.data) {
			$scope.data = JSON.parse(sessionStorage.data);
		} else {
			// Simple GET request example:
			$http({
				method: 'GET',
				url: 'https://yts.ag/api/v2/list_movies.json',
				params: {
					limit: $scope.searchParams.limit,
					page: $scope.searchParams.page,
					minimum_rating: $scope.searchParams.minimumRating,
					with_rt_ratings: $scope.searchParams.rottenTomatoesRating,
					quality: $scope.searchParams.selectedQuality //,
					//query_term:"sdadasd"
				}
			}).then(function successCallback(response) {
				if (response.data.data.movie_count > 0) {
					$scope.data = {
						moviesCount: response.data.data.movie_count,
						movies: response.data.data.movies
					};
					sessionStorage.data = JSON.stringify($scope.data);
				} else {
					$scope.data = {
						moviesCount: 0,
						message: "No movies found"
					};
					sessionStorage.clear();
				}
			}, function errorCallback(response) {
				console.log("Error call back" + response.status);
			});
		}
	};

});
