export class IntroController {

    constructor($scope, $window, Facebook, $state, $log, $http, CONSTANT, DataService, $mdDialog, $document, $mdMedia, $timeout) {
        'ngInject';

        this.pageClass = 'page-intro';
        this.facebook = Facebook;
        this.$scope = $scope;
        this.loggedIn = false;
        this.isFacebookReady = false;
        this.$state = $state;
        this.$log = $log;
        this.$http = $http;
        this.constant = CONSTANT;
        this.dataService = DataService;
        this.$mdDialog = $mdDialog;
        this.customFullscreen = $mdMedia('xs') || $mdMedia('sm');
        this.$document = $document;
        this.$timeout = $timeout;

        this.$scope.$watch(() => {
            return this.facebook.isReady();
        }, () => {
            this.isFacebookReady = true;
            this.getLoginStatus();
        });

    }

    termClick(){
        this.$mdDialog.show({
            // clickOutsideToClose: true,
            parent: angular.element(this.$document.body),
            templateUrl: 'app/term/term.html',
            fullscreen: this.customFullscreen,
            controller: ['$scope', '$mdDialog', ($scope, $mdDialog) => {
                    $scope.answer = (answer) => {
                        if(answer){
                            this.login();
                        }
                        $mdDialog.hide(answer);
                    }
                }]
        });
    }

    login() {
        if(this.loggedIn){
            this.register();
        }else{
            // From now on you can use the Facebook service just as Facebook api says
            this.facebook.login((login_response) => {
                if (login_response.authResponse) {
                    this.register();
                }
            }, { scope: 'public_profile,email' });
        }

    }

    getLoginStatus() {
        this.facebook.getLoginStatus((response) => {
            this.loggedIn = response.status === 'connected';
        })
    }

    me(callback) {
        this.facebook.api('/me?locale=en_US&fields=name,email', callback);
    }

    register(){

        var registerUrl = this.constant.serviceBaseUrl + 'auth';
        var checkUploadUrl = this.constant.serviceBaseUrl + 'post/';

        this.me((response)=> {
            this.$http.post(registerUrl, {
                name: response.name,
                id: response.id,
                email: response.email
            }).success((user)=> {
                this.dataService.set('user', user);
                this.$http.get(checkUploadUrl + user.id + '/upload', {
                    ignoreLoadingBar: true
                }).success((response)=> {
                    if (!response.result) {
                        this.$state.go('data-capture');
                    } else {
                        this.dataService.set('post', response.data);
                        this.$state.go('share');
                    }
                })
            });
        });
    }

    next(){
        this.$state.go('data-capture');
    }
}