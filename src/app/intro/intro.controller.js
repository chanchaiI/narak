export class IntroController {
    constructor(toastr, $scope, $window, Facebook, $state, $log, $http, CONSTANT, DataService) {
        'ngInject';

        this.facebook = Facebook;
        this.$scope = $scope;
        this.loggedIn = false;
        this.isFacebookReady = false;
        this.$state = $state;
        this.$log = $log;
        this.$http = $http;
        this.constant = CONSTANT;
        this.dataService = DataService;

        this.$scope.$watch(() => {
            return this.facebook.isReady();
        }, () => {
            this.isFacebookReady = true;
            this.getLoginStatus();
        })

    }

    login() {
        var registerUrl = this.constant.serviceBaseUrl + 'auth';

        // From now on you can use the Facebook service just as Facebook api says
        this.facebook.login(() => {
            this.me((response)=>{
                this.$http.post(registerUrl, {name: response.name, id: response.id, email: response.email}).success((user)=>{
                    this.dataService.set('user', user);
                    this.$state.go('data-capture');
                });
            });
        }, { scope: 'public_profile,email' });

        //this.$http.post(registerUrl, {name: 'KraPuem Man', id: '234234234', email: 'asakula@hotmail.com'}).success((user)=>{
        //    this.dataService.set('user', user);
        //    this.$state.go('data-capture');
        //});
    }

    getLoginStatus() {
        this.facebook.getLoginStatus((response) => {
            this.loggedIn = response.status === 'connected';
            if(this.loggedIn){
                this.me((response)=>{
                    //var registerUrl = this.constant.serviceBaseUrl + 'auth';
                    //this.$http.post(registerUrl, {name: response.name, id: response.id, email: response.email}).success((user)=>{
                    //    this.dataService.set('user', user);
                    //    this.$state.go('data-capture');
                    //});
                });
            }
        })
    }

    me(callback) {
        this.facebook.api('/me?locale=en_US&fields=name,email', callback);
    }
}