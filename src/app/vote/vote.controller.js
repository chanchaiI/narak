export class VoteController {
    constructor(toastr, $scope, $window, Facebook, $state, $log, $http, CONSTANT, DataService) {
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
        this.popularVotes = [];

        this.$scope.$watch(() => {
            return this.facebook.isReady();
        }, () => {
            this.isFacebookReady = true;
            this.getLoginStatus();
        });

        this.activate();
    }

    activate(){
        this.getPopularVotes(3);
        this.getPosts('all', 1);
    }

    getPopularVotes(size){
        var getPopularVoteUrl = this.constant.serviceBaseUrl + 'post/'+ size +'/popular';
        this.$http.get(getPopularVoteUrl).success((response)=>{
            this.popularVotes = response;
        });
    }

    getPosts(category_id, pageNumber){
        var getPostUrl = this.constant.serviceBaseUrl + 'post/' + category_id + '/page/' + pageNumber;
        this.$http.get(getPostUrl).success((response)=>{
            this.posts = response.data;
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