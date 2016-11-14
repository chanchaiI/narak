export class AwardController {
    constructor($scope, $document, Facebook, $location, $state, $http, CONSTANT, $window,
                DataService, PostService, $mdDialog, $mdMedia, $timeout, FacebookService, $rootScope) {
        'ngInject';

        this.pageClass = 'page-award';
        this.facebook = Facebook;
        this.$scope = $scope;
        this.loggedIn = false;
        this.isFacebookReady = false;
        this.$state = $state;
        this.$location = $location;
        this.$http = $http;
        this.constant = CONSTANT;
        this.dataService = DataService;
        this.postService = PostService;
        this.$mdDialog = $mdDialog;
        this.customFullscreen = $mdMedia('xs') || $mdMedia('sm');
        this.$document = $document;
        this.$window = $window;
        this.posts = [];
        this.filteredPosts = [];
        this.selectedCategory = 'committee';
        this.$timeout = $timeout;
        this.facebookService = FacebookService;
        this.$rootScope = $rootScope;
        this.showSearch = false;
        this.keyword = '';
        this.busy = false;
        this.categories = [
          {
            value: 'committee',
            label: 'รางวัลหนูน้อยน่ารักจัง 2'
          },
          {
            value: 'popular',
            label: 'รางวัลหนูน้อย Popular Vote'
          },
          {
            value: 'luckyvote',
            label: 'รางวัลสำหรับผู้ร่วมโหวต'
          }
        ]

        this.$scope.$watch(() => {
            return this.facebook.isReady();
        }, () => {
            this.isFacebookReady = true;
        });

        this.activate();
    }

    activate() {
      this.showIntroDialog();
      this.getData();
    }

  showIntroDialog(){
    this.$mdDialog.show({
      templateUrl: 'app/award/intro.dialog.html',
      parent: angular.element(this.$document.body),
      clickOutsideToClose: true,
      fullscreen: this.customFullscreen,
      controller: function($scope, $mdDialog){
        $scope.close = function(){
          $mdDialog.hide();
        }
      }
    })
  }

    changeCategory() {
        this.posts = [];
        this.getData();
    }

    openSearch(){
      this.showSearch = true;
      this.keyword = '';
      this.filteredPosts = angular.copy(this.posts);
    }

    cancelSearch(){
      this.showSearch = false;
      this.busy = false;
      this.keyword = '';
      this.filteredPosts = [];
      this.changeCategory();
    }

    keywordChange(){
      this.filteredPosts = [];
      if(this.keyword.length > 0 && !this.busy) {
        this.busy = true;
        for(var i = 0; i < this.posts.length; i++){
          if((this.posts[i].kid_name && this.posts[i].kid_name.indexOf(this.keyword) > -1)
            || (this.posts[i].kid_nickname && this.posts[i].kid_nickname.indexOf(this.keyword) > -1)){
            this.filteredPosts.push(this.posts[i])
          }
        }
        this.busy = false;
      }else{
        this.filteredPosts = angular.copy(this.posts);
      }
    }

    getData() {
      this.postService.getAwardPostByType(this.selectedCategory)
        .then((response)=> {
          this.posts = [];
          for(var i=0; i < response.data.length; i++){
            this.posts.push(response.data[i]);
          }
          this.$scope.$applyAsync();
        });
    }

    openDetail() {
        if (this.$location.search().id) {
            this.postService.getPostById(this.$location.search().id).then((response)=> {
                if (response.data) {
                    this.showImageDialog(response.data);
                }
            })
        } else if (this.$location.search().token) {
            this.postService.getPostByRandomNO(this.$location.search().token).then((response)=> {
                if (response.data) {
                    this.showImageDialog(response.data);
                }
            })
        }
    }


    showImageDialog(post) {
        var imgUrl = this.constant.uploadedPath + post.image_path;
        var nickname = post.kid_nickname;

        this.$mdDialog.show({
                controller: 'ImageDialogController',
                controllerAs: 'im',
                templateUrl: 'app/vote/image.dialog.html',
                parent: angular.element(this.$document.body),
                clickOutsideToClose: true,
                fullscreen: this.customFullscreen,
                locals: {
                    imgUrl: imgUrl,
                    nickname: nickname,
                    voteCount: post.vote_count
                }
            });
    }

    getCategoryName(){
      if(this.selectedCategory === 'committee'){
        return 'รางวัลหนูน้อยน่ารักจัง 2';
      }else if(this.selectedCategory === 'popular'){
        return 'รางวัลหนูน้อย Popular Vote';
      }
    }

    goConfirm() {
        this.$window.open('https://www.formpl.us/form/6472614811795456','_blank');
    }
}
