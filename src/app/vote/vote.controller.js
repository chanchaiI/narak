export class VoteController {
    constructor($scope, $document, Facebook, $location, $state, $log, $http, CONSTANT, DataService, PostService, $mdDialog, $mdMedia) {
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

        this.$scope.$watch(() => {
            return this.facebook.isReady();
        }, () => {
            this.isFacebookReady = true;
            this.getLoginStatus();
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

    confirmVote() {
        let confirm = this.$mdDialog.confirm()
            .title('ยืนยัน')
            .textContent('คุณสามารถทำการโหวตได้เพียงหนึ่งครั้ง คุณยังคงยืนยันที่จะโหวตรูปภาพนี้?')
            .ariaLabel('Confirmation')
            .ok('Yes')
            .cancel('No');
        return this.$mdDialog.show(confirm);
    }

    vote(post) {
        this.confirmVote().then(()=> {
                // From now on you can use the Facebook service just as Facebook api says
                this.facebook.login(() => {
                    this.me((response)=> {
                        var voteUrl = this.constant.serviceBaseUrl + 'vote/' + post.id;
                        this.$http.post(voteUrl, {facebook_id: response.id, email: response.email}).then((response)=> {
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
                    });
                }, {scope: 'public_profile,email'})
            }
        );
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
        }, (response)=> {

        })
    }

    login() {
        var registerUrl = this.constant.serviceBaseUrl + 'auth';

        // From now on you can use the Facebook service just as Facebook api says
        this.facebook.login(() => {
            this.me((response)=> {
                this.$http.post(registerUrl, {
                    name: response.name,
                    id: response.id,
                    email: response.email
                }).success((user)=> {
                    this.dataService.set('user', user);
                    this.$state.go('data-capture');
                });
            });
        }, {scope: 'public_profile,email'});
    }

    getLoginStatus() {
        this.facebook.getLoginStatus((response) => {
            this.loggedIn = response.status === 'connected';
            if (this.loggedIn) {
                this.me((response)=> {

                });
            }
        })
    }

    me(callback) {
        this.facebook.api('/me?locale=en_US&fields=name,email', callback);
    }

    go(stateName) {
        this.$state.go(stateName);
    }
}