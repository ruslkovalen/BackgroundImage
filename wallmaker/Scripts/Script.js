

var myApp = angular.module('App', ['ngRoute']);

myApp.config(function ($routeProvider) {
    $routeProvider

            // route for the home page
            .when('/', {
                templateUrl: '/Home/Index',
                controller: 'Home'
            })

            // route for the about page
            .when('/Admin', {
                templateUrl: '/Admin/Admin',
                controller: 'Admin'
            })
});

    myApp.controller('Admin', function ($scope, $http) {
        $scope.images = [];
        var processing = document.getElementById("proces");
        drawImg();
        function drawImg() {
            setTimeout(function () { processing.style.display = "block"; }, 300)
            $http({
                method: "GET",
                url: "/Admin/getImage/"
            }).then(function mySucces(response) {
                $scope.images = response.data;
                processing.style.display = "none";
            }, function myError(response) {
                alert("Bad!");
            });
        }
       

        $scope.updateSelection = function (position, entities, name) {


            angular.forEach(entities, function (x, index) {
                if (position != index) {
                    x.Checked = false;
                }
            });
            var data = new FormData();
            data.append("ChangeFile", name);

            var ChangeImage = new XMLHttpRequest();

            ChangeImage.open("POST", "/Admin/ChangeImage/");
            ChangeImage.send(data);

        }


        $scope.getFileDetails = function (e) {
            $scope.files = [];
            $scope.$apply(function () {
                for (var i = 0; i < e.files.length; i++) {
                    $scope.files.push(e.files[i])
    
                }
            });
        };


        $scope.uploadFiles = function () {

            var data = new FormData();
            
            for (var i in $scope.files) {
                data.append("uploadedFile", $scope.files[i]);
                $scope.images.push($scope.files.length);
                

            }
            var AddImage = new XMLHttpRequest();

            AddImage.open("POST", "/Admin/PostImage/");
            AddImage.send(data);

            setTimeout(function () { drawImg(); }, 500)
        }

        $scope.removeItem = function (x, name) {
            var data = new FormData();
            data.append("deletedFile", $scope.images[x].Name);
            var deleteImage = new XMLHttpRequest();
            deleteImage.open("POST", "/Admin/DeleteImage/");
            deleteImage.send(data);
            $scope.images.splice(x, 1);
        }
    });


    myApp.controller('Home', function ($scope, $http) {
        var image = document.getElementById("image");
        image.style.display = "none";
        $scope.button_click = function () {
            var processing = document.getElementById("proces");
            
            setTimeout(function () { processing.style.display = "block"; }, 300)
            var textbox = document.getElementById("value").value;
            $http({
                method: "POST",
                url: "/Home/getFile",
                data: { text: textbox }
            }).then(function mySucces(response) {
                $scope.Image = response.data;
                image.style.display = "block";
                processing.style.display = "none";
            }, function myError(response) {
                alert("Bad!");
            });
        };
    });
