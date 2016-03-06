export class VoteDetailController {
    constructor(toastr, $scope, $window, Facebook, $state, $log, $http, CONSTANT, DataService, $stateParams) {
        'ngInject';

        this.pageClass = 'page-vote';
        this.facebook = Facebook;
        this.$scope = $scope;
        this.loggedIn = false;
        this.isFacebookReady = false;
        this.$state = $state;
        this.$log = $log;
        this.$http = $http;
        this.constant = CONSTANT;
        this.dataService = DataService;
        this.postId = $stateParams.postId;

        this.$scope.$watch(() => {
            return this.facebook.isReady();
        }, () => {
            this.isFacebookReady = true;
            this.getLoginStatus();
        });

        this.activate();
    }

    activate(){
        this.getPost();
    }

    getPost(){
        var getPostUrl = this.constant.serviceBaseUrl + 'post/' + this.postId;
        this.$http.get(getPostUrl).success((response)=>{
            this.post = response;
        });
    }

    vote(){
        var voteUrl = this.constant.serviceBaseUrl + 'vote';

        this.$http.put(voteUrl).success((response)=>{

        });
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
    }

    getLoginStatus() {
        this.facebook.getLoginStatus((response) => {
            this.loggedIn = response.status === 'connected';
            if(this.loggedIn){
                this.me((response)=>{

                });
            }
        })
    }

    me(callback) {
        this.facebook.api('/me?locale=en_US&fields=name,email', callback);
    }
}