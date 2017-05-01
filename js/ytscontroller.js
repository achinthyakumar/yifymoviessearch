// Define the `phonecatApp` module
angular.module('ytsApp', []).controller('YTSController', function YTSController($scope, $http, $sce) {
    
	$scope.searchParams = {
        searchTerm:"",
		pageLimit: [10, 20, 30, 40, 50],
        selectedPageLimit: 20,
		minimumRatings: [9, 8, 7, 6, 5, 4, 3, 2, 1],
		selectedMinimumRating: 0,
		page: 1,
		rottenTomatoesRating: true,
		quality: ["720p", "1080p", "3D"],
		selectedQuality: "",
        genre: [{key:"all", value:"All"}, {key:"action", value:"Action"},{key:"adventure", "value" :"Adventure"} ,{key:"animation", "value"  :"Animation"} ,{key:"biography", "value" :"Biography"} ,{key: "comedy", "value" :"Comedy"} ,{key:"crime", "value" :"Crime"} ,{key:"documentary", "value" :"Documentary"} ,{key:"drama", "value" :"Drama"} ,{key:"family", value: "Family"},{key:"fantasy", "value" :"Fantasy"} ,{key:"film-noir", "value" :"Film-noir"} ,{key:"game-show", "value" :"Game-show"} ,{key:"history", "value" :"History"} ,{key:"horror", "value" :"Horror"} ,{key: "music", value: "Music"} ,{key:"musical", "value" :"Musical"} ,{key:"mystery", "value" :"Mystery"} ,{key:"news", "value" :"News"},{key: "reality-tv", "value" :"Reality-tv"} ,{key:"romance", "value" :"Romance"} ,{key:"sci-fi", "value" :"Sci-fi"} ,{key:"sport", "value" :"Sport"} ,{key:"talk-show", "value" :"Talk-show"} ,{key: "thriller", "value" :"Thriller"} ,{key:"war", "value" :"War"} ,{key:"western", "value" :"Western"}],
        selectedGenre: {key:"all", value:"All"},
        sortBy: [{key:"latest", value:"Latest"}, {key:"title", value:"Title"},{key:"year", value:"Year"},{key:"rating", value:"Rating"}, {key:"peers", value: "Peers"},{key: "seeds", value:"Seeds"}, {key: "download_count", value:"Download Count"},{key:"like_count", value:"Like Count"}],
        selectedSortBy: {key:"latest", value:"Latest"},
        selectedViewBy: "tile",
        orderBy: "asc"
	};
	$scope.showResults = false;
	$scope.toggleSort = function (resultSortBy) {
		$scope.resultSortBy = resultSortBy;
		$scope.resultOrderBy = !$scope.resultOrderBy;
	};
	$scope.performSearch = function () {
        $scope.data = undefined;
        /*sessionStorage.clear();
		if (sessionStorage.data) {
			$scope.data = JSON.parse(sessionStorage.data);
		} else {*/
			// Simple GET request example:
			$http({
				method: 'GET',
				url: 'https://yts.ag/api/v2/list_movies.json',
				params: {
					limit: $scope.searchParams.selectedPageLimit,
					page: $scope.searchParams.page,
					minimum_rating: $scope.searchParams.selectedMinimumRating,
					with_rt_ratings: $scope.searchParams.rottenTomatoesRating,
					quality: $scope.searchParams.selectedQuality,
                    genre: $scope.searchParams.selectedGenre.key,
                    sort_by: $scope.searchParams.selectedSortBy.key,
                    order_by: $scope.searchParams.orderBy,
					query_term: $scope.searchParams.searchTerm
				},
                timeout: 3000
			}).then(function successCallback(response) {
				if (response.data.data.movie_count > 0) {
					$scope.data = {
						moviesCount: response.data.data.movie_count,
						movies: response.data.data.movies
					};
                    $scope.resultSortBy = $scope.searchParams.selectedSortBy.key;
                    $scope.resultOrderBy = $scope.searchParams.orderBy === "desc";
					sessionStorage.data = JSON.stringify($scope.data);
				} else {
					$scope.data = {
						moviesCount: 0,
						message: "No movies found"
					};
					//sessionStorage.clear();
				}
			}, function errorCallback(response) {
				console.log("Error call back" + response.status);
                $scope.data = {
				    error: true,
					message: "API is not accessible due to firewall or proxy or no internet connection."
				};
			});
		//}
	};
    $scope.performSearch();
    
    $scope.moviedetailModal = function (id) {
        $scope.searchMovieById(id);
        $('#moviedetail-modal').modal();          
    };
    
    $scope.previousMovie = function (id) {
        var previousMovieRow = $('#' + id).prev('tr');
        if (previousMovieRow.hasClass('movieRow')) {
            $scope.searchMovieById(previousMovieRow.attr('id'));
        };
    }
    
    $scope.nextMovie = function (id) {
        var nextMovieRow = $('#' + id).next('tr');
        if (nextMovieRow.hasClass('movieRow')) {
            $scope.searchMovieById(nextMovieRow.attr('id'));
        };
    }
    
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
				},
                timeout: 3000
			}).then(function successCallback(response) {
				if (response.data.data.movie) {
					$scope.selectedMovie = response.data.data.movie;
                    $scope.selectedMovie.error = false;
				} 
			}, function errorCallback(response) {
				console.log("Error call back" + response.status);
                 $scope.selectedMovie = {
				    error: true,
					message: "API is not accessible due to firewall or proxy or no internet connection."
				};
			});
        }
    };
    
    $scope.getYoutubeURL = function (yt_trailer_code) {
        return $sce.trustAsResourceUrl('https://www.youtube.com/embed/' + yt_trailer_code + '?rel=0&enablejsapi=1');
    };
    
    $("#moviedetail-modal").on("hidden.bs.modal", function () {
       $('#moviedetail-modal iframe.embed-responsive-item').attr('src', '')
    });

});
