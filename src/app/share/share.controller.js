export class ShareController {
    constructor($scope, $window, Facebook, $state, $log, $http, CONSTANT, DataService) {
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
        this.post = {};
        this.activate();

        this.$scope.$watch(() => {
            return this.facebook.isReady();
        }, () => {
            this.isFacebookReady = true;
            this.getLoginStatus(()=>{
                this.share();
            });
        });

    }

    activate(){
        this.post = this.dataService.get('post');
        this.imagePath = this.constant.domainUrl + this.constant.uploadedPath + this.post.image_path;
    }
    getLoginStatus(callback) {
        this.facebook.getLoginStatus(callback);
    }

    me(callback) {
        this.facebook.api('/me?locale=en_US&fields=name,email', callback);
    }

    share(){
        var sharingUrl = '';
        if(!!this.post){
            sharingUrl = this.constant.domainUrl + '?id=' + this.post.id;
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