export class VoteController {
    constructor($scope, $document, Facebook, $location, $state, $log, $http, CONSTANT, DataService, PostService, $mdDialog, $mdMedia, $timeout, FacebookService, $rootScope) {
        'ngInject';

        this.pageClass = 'page-vote';
        this.facebook = Facebook;
        this.$scope = $scope;
        this.loggedIn = false;
        this.isFacebookReady = false;
        this.$state = $state;
        this.$location = $location;
        this.$log = $log;
        this.$http = $http;
        this.constant = CONSTANT;
        this.dataService = DataService;
        this.postService = PostService;
        this.$mdDialog = $mdDialog;
        this.customFullscreen = $mdMedia('xs') || $mdMedia('sm');
        this.$document = $document;
        this.popularVotes = [];
        this.posts = [];
        this.currentPage = 0;
        this.empty = false;
        this.selectedCategory = 'all';
        this.$timeout = $timeout;
        this.facebookService = FacebookService;
        this.$rootScope = $rootScope;

        this.$scope.$watch(() => {
            return this.facebook.isReady();
        }, () => {
            this.isFacebookReady = true;
        });

        this.activate();
    }

    activate() {
        this.getPopularVotes(3);
        this.nextPage();
        this.openDetail();
    }

    getPopularVotes(size) {
        this.postService.getPopular(size).then((response)=> {
            this.popularVotes = response.data;
        });
    }

    changeCategory() {
        this.posts = [];
        this.currentPage = 0;
        this.empty = false;
        this.nextPage();
    }

    nextPage() {
        if (this.busy) return;
        this.busy = true;

        var pageNumber = this.currentPage + 1;

        if (!this.empty) {
            this.postService.getPosts(this.selectedCategory, pageNumber)
                .then((response)=> {
                    if (response.data.length > 0) {
                        this.posts = this.posts.concat(response.data);
                        this.currentPage = pageNumber;
                    } else {
                        this.empty = true;
                    }
                    this.busy = false;
                }, ()=> {
                    this.busy = false;
                });
        } else {
            this.busy = false;
        }
    }

    openDetail() {
        if (this.$location.search().id) {
            this.postService.getPostById(this.$location.search().id).then((response)=> {
                if (response.data) {
                    this.showImageDialog(response.data);
                }
            })
        }else if(this.$location.search().token){
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
            })
            .then((answer) => {
                if (answer === 'vote')
                    this.vote(post);
            }, ()=> {
            });
    }

    vote(post) {

        if(confirm('คุณสามารถทำการโหวตได้เพียงหนึ่งครั้ง คุณยังคงยืนยันที่จะโหวตรูปภาพนี้?')){
            this.facebookLoginForVote(post);
        }

        //let confirm = this.$mdDialog.confirm()
        //    .title('ยืนยัน')
        //    .textContent('คุณสามารถทำการโหวตได้เพียงหนึ่งครั้ง คุณยังคงยืนยันที่จะโหวตรูปภาพนี้?')
        //    .ariaLabel('Confirmation')
        //    .targetEvent(ev)
        //    .ok('Yes')
        //    .cancel('No');
        //this.$mdDialog.show(confirm).then(()=> {
        //    this.$mdDialog.destroy();
        //    this.$rootScope.$broadcast('facebook.login', post);
        //});
    }

    confirmVote() {
        let confirm = this.$mdDialog.confirm()
            .title('ยืนยัน')
            .textContent('คุณสามารถทำการโหวตได้เพียงหนึ่งครั้ง คุณยังคงยืนยันที่จะโหวตรูปภาพนี้?')
            .ariaLabel('Confirmation')
            .ok('Yes')
            .cancel('No');
        return this.$mdDialog.show(confirm);
    }

    facebookLoginForVote(post) {
        this.$timeout(()=> {
            this.$log.info("press ok");
            this.facebookService.login({scope: 'public_profile,email'}).then((loginResponse) => {
                if (loginResponse.authResponse) {
                    this.facebookService.me().then((response)=> {
                        this.doVote(response, post);
                    });
                }
                else {
                    this.$mdDialog.show(
                        this.$mdDialog.alert()
                            .parent(angular.element(this.$document.body))
                            .clickOutsideToClose(true)
                            .title('ไม่สำเร็จ!')
                            .textContent('ทำการล็อคอินด้วย Facebook ไม่สำเร็จ')
                            .ariaLabel('Error')
                            .ok('OK')
                    );
                }

            });
        });
    }

    doVote(user, post) {
        if (user.id) {
            var voteUrl = this.constant.serviceBaseUrl + 'vote/' + post.id;
            this.$http.post(voteUrl, {
                facebook_id: user.id,
                email: user.email
            }).then(()=> {
                post.vote_count += 1;
                this.$mdDialog.show(
                    this.$mdDialog.alert()
                        .parent(angular.element(this.$document.body))
                        .clickOutsideToClose(true)
                        .title('สำเร็จ!')
                        .textContent('ทำการโหวตเรียบร้อย')
                        .ariaLabel('Success')
                        .ok('OK')
                );
            }, (response)=> {
                if (response.status === 400) {
                    this.$mdDialog.show(
                        this.$mdDialog.alert()
                            .parent(angular.element(this.$document.body))
                            .clickOutsideToClose(true)
                            .title('ไม่สำเร็จ!')
                            .textContent('คุณได้ทำการโหวตไปแล้ว')
                            .ariaLabel('Error')
                            .ok('OK')
                    );
                }
            });
        } else {
            this.$mdDialog.show(
                this.$mdDialog.alert()
                    .parent(angular.element(this.$document.body))
                    .clickOutsideToClose(true)
                    .title('ไม่สำเร็จ!')
                    .textContent('ทำการล็อคอินด้วย Facebook ไม่สำเร็จ')
                    .ariaLabel('Error')
                    .ok('OK')
            );
        }
    }

    share(post) {
        var sharingUrl = '';
        if (post) {
            sharingUrl = this.constant.domainUrl + '?id=' + post.id;
        } else {
            sharingUrl = this.constant.domainUrl;
        }

        this.facebook.ui({
            method: 'share',
            href: sharingUrl
        }, ()=> {

        })
    }

    go(stateName) {
        this.$state.go(stateName);
    }
}