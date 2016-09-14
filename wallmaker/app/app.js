

var app = angular.module('AngularAuthApp', ['ui.router', 'LocalStorageModule', 'angular-loading-bar','ngRoute']);



app.config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
    $stateProvider

        .state('Home', {
            url: '/Home',
            templateUrl: '/app/views/home.html?v=1',
            controller: 'Home'
        })

        .state('Admin', {
            url: '/Admin',
            templateUrl: '/app/views/admin.html',
            controller: 'Admin'
        })

        .state('login', {
            url: '/login',
            templateUrl: '/app/views/login.html',
            controller: 'loginController'
        })
    $urlRouterProvider.otherwise('Home');
    if (window.history && window.history.pushState) {
        $locationProvider.html5Mode(true);
    }
});



var serviceBase = "http://radacode.net/";

app.constant('ngAuthSettings', {
    apiServiceBaseUri: serviceBase,
    clientId: 'ngAuthApp'
});
app.config(function ($httpProvider) {
    $httpProvider.interceptors.push('authInterceptorService');
});

var locat;
app.run(['authService', '$location', function (authService, $rootScope) {
    locat = $rootScope;
    authService.fillAuthData();
}]);






app.controller('Admin', function ($scope, $http) {

    drawImg();

    function drawImg() {
        $http({
            method: "GET",
            url: "api/Admin/getImage/"
        }).then(function mySucces(response) {
            $scope.images = response.data;
        }, function myError(response) {
            alert("Please,register!");
        });
    }
   
    $scope.updateSelection = function (position, entities, name) {


        angular.forEach(entities, function (x, index) {
            if (position != index) {
                x.checked = false;
            }
        });
        var data = new FormData();
        data.append("ChangeFile", name);

        var ChangeImage = new XMLHttpRequest();

        ChangeImage.open("POST", "api/Admin/ChangeImage/");
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

        AddImage.open("POST", "api/Admin/PostImage/");
        AddImage.send(data);

        setTimeout(function () { drawImg(); }, 500)
    }


    $scope.removeItem = function (x, name) {
        var data = new FormData();
        data.append("deletedFile", $scope.images[x].name);
        var deleteImage = new XMLHttpRequest();
        deleteImage.open("POST", "api/Admin/DeleteImage/");
        deleteImage.send(data);
        $scope.images.splice(x, 1);
    }
    
});

app.config(['$compileProvider',
    function ($compileProvider) {
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|tel|file|blob):/);
    }]);


app.controller('Home', function ($scope, $http) {
    var image = document.getElementById("image");
    var download_button = document.getElementById("Download_button");
    image.style.display = "none";
    download_button.style.display = "none";
    var serverName;
    $scope.Generate_Background = function () {
        serverName = document.getElementById("ServerName").value;
        $http.post('api/Home/getFile', '"' + serverName + '"').then(function mySucces(response) {
            $scope.Image = response.data;
            image.style.display = "block";
            download_button.style.display = "block";
        }, function myError(response) {
            alert("Bad!");
        });;
    };
    $scope.Download_Background = function () {
        var content = $scope.Image;
        var byteArray = Base64Binary.decodeArrayBuffer(content);
        var blob = new Blob([byteArray], {
            type: "image/jpeg"
        });
        saveAs(blob, serverName + '.jpg');
    }
});
   

app.controller('Index', function ($scope, $http) {

   $scope.checkAccess = function () {
        $http({
            method: "GET",
            url: "api/Admin/Check/"
        }).then(function mySucces(response) {
            if (response.data == true) {
                  locat.path("Admin");
            }
            else {
                locat.path("login");
            }
        }, function myError(response) {
            alert("Bad!");
        });
    };
});




var Base64Binary = {
    _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

    /* will return a  Uint8Array type */
    decodeArrayBuffer: function (input) {
        var bytes = (input.length / 4) * 3;
        var ab = new ArrayBuffer(bytes);
        this.decode(input, ab);

        return ab;
    },

    removePaddingChars: function (input) {
        var lkey = this._keyStr.indexOf(input.charAt(input.length - 1));
        if (lkey == 64) {
            return input.substring(0, input.length - 1);
        }
        return input;
    },

    decode: function (input, arrayBuffer) {
        //get last chars to see if are valid
        input = this.removePaddingChars(input);
        input = this.removePaddingChars(input);

        var bytes = parseInt((input.length / 4) * 3, 10);

        var uarray;
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;
        var j = 0;

        if (arrayBuffer)
            uarray = new Uint8Array(arrayBuffer);
        else
            uarray = new Uint8Array(bytes);

        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

        for (i = 0; i < bytes; i += 3) {
            //get the 3 octects in 4 ascii chars
            enc1 = this._keyStr.indexOf(input.charAt(j++));
            enc2 = this._keyStr.indexOf(input.charAt(j++));
            enc3 = this._keyStr.indexOf(input.charAt(j++));
            enc4 = this._keyStr.indexOf(input.charAt(j++));

            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;

            uarray[i] = chr1;
            if (enc3 != 64) uarray[i + 1] = chr2;
            if (enc4 != 64) uarray[i + 2] = chr3;
        }

        return uarray;
    }
}