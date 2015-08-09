angular.module('app').provider('$twitter', function(settings){

    this.$get = function($q, $http){

        return {
            getToken: function(){
                return $q.when(null);
            },
            connect: function(){

                var bearerToken = function(){
                    var consumerKey = encodeURIComponent('r9e5QZVVUIu3ChTXr1w08fm5T');
                    var consumerSecret = encodeURIComponent('tWwdJUrW4bnKsfkhXzKpzYw03LYKFZiu3fn2ePA18l2unk6DNN');
                    return btoa(consumerKey + ':' + consumerSecret);
                };
                $http.defaults.useXDomain = true;
                delete $http.defaults.headers.common['X-Requested-With'];
                $http({
                    method: 'POST',
                    url: 'https://api.twitter.com/oauth2/token',
                    data: 'grant_type=client_credentials',
                    headers: {
                        'Authorization': 'Basic ' + bearerToken(),
                        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
                    }
                }).then(function(response){
                    console.log(response);
                });
                return $q.when(null);
            },
            isConnected: function(){
                return false;
            },
            disconnect: function(){

            },
            isImplemented: function(){
                return false;
            }
        };

    };

});