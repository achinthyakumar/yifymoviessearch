// Define the `phonecatApp` module
angular.module('ytsApp', []).controller('YTSController', function YTSController($scope, $http) {
	$scope.sortType = 'rating';
	$scope.sortReverse = true;
	$scope.showMoviesInTable = true;
	$scope.showResults = false;
	$scope.searchParams = {
		limit: 10,
		minimumRatings: [9, 8, 7, 6, 5, 4, 3, 2, 1],
		minimumRating: 0,
		page: 1,
		rottenTomatoesRating: true,
		quality: ["720p", "1080p", "3D"],
		selectedQuality: "",
        genre: [{key:"all", value:"All"}, {key:"action", value:"Action"},{key:"adventure", "value" :"Adventure"} ,{key:"animation", "value"  :"Animation"} ,{key:"biography", "value" :"Biography"} ,{key: "comedy", "value" :"Comedy"} ,{key:"crime", "value" :"Crime"} ,{key:"documentary", "value" :"Documentary"} ,{key:"drama", "value" :"Drama"} ,{key:"family", value: "Family"},{key:"fantasy", "value" :"Fantasy"} ,{key:"film-noir", "value" :"Film-noir"} ,{key:"game-show", "value" :"Game-show"} ,{key:"history", "value" :"History"} ,{key:"horror", "value" :"Horror"} ,{key: "music", value: "Music"} ,{key:"musical", "value" :"Musical"} ,{key:"mystery", "value" :"Mystery"} ,{key:"news", "value" :"News"},{key: "reality-tv", "value" :"Reality-tv"} ,{key:"romance", "value" :"Romance"} ,{key:"sci-fi", "value" :"Sci-fi"} ,{key:"sport", "value" :"Sport"} ,{key:"talk-show", "value" :"Talk-show"} ,{key: "thriller", "value" :"Thriller"} ,{key:"war", "value" :"War"} ,{key:"western", "value" :"Western"}],
        selectedGenre: {key:"all", value:"All"}
	};
	$scope.toggleSort = function (sortType) {
		$scope.sortType = sortType;
		$scope.sortReverse = !$scope.sortReverse;
	};

	$scope.performSearch = function () {
		$scope.showResults = true;
		sessionStorage.clear();
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
					quality: $scope.searchParams.selectedQuality,
                    genre: $scope.searchParams.selectedGenre.key
					//query_term:"sdadasd"
				},
                timeout: 3000
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
                $scope.data = {
				    error: true,
					message: "Network issue - API is not access."
				};
			});
		}
	};
    $scope.performSearch();
    
    $scope.moviedetailModal = function (id) {
        $scope.searchMovieById(id);
        $('#moviedetail-modal').modal();          
    };
    
    $scope.searchMovieById = function (id) {
        $scope.selectedMovie = undefined;
        if(id){
            // Simple GET request example:
			$http({
				method: 'GET',
				url: 'https://yts.ag/api/v2/movie_details.json',
				params: {
					movie_id: id,
                    with_cast: true
				}
			}).then(function successCallback(response) {
				if (response.data.data.movie) {
					$scope.selectedMovie = response.data.data.movie;
				} 
			}, function errorCallback(response) {
				console.log("Error call back" + response.status);
			});
        }
    }

});
