export class ShareController {
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
            this.getLoginStatus(()=>{
                this.share();
            });
        })

    }

    getLoginStatus(callback) {
        this.facebook.getLoginStatus(callback);
    }

    me(callback) {
        this.facebook.api('/me?locale=en_US&fields=name,email', callback);
    }

    share(){
        var post = this.dataService.get('post');
        var sharingUrl = '';
        if(!!post){
            sharingUrl = this.constant.domainUrl + 'post/' + post.id;
        }else{
            sharingUrl = this.constant.domainUrl;
        }

        this.facebook.ui({
            method: 'share',
            href: sharingUrl
        }, (response)=>{

        })
    }
}