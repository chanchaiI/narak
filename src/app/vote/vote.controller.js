export class VoteController {
    constructor($scope, $document, Facebook, $location, $state, $log, $http, CONSTANT,
                DataService, PostService, $mdDialog, $mdMedia, $timeout, FacebookService, $rootScope, clipboard) {
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
        this.posts = [];
        this.currentPage = 0;
        this.empty = false;
        this.selectedCategory = 'all';
        this.$timeout = $timeout;
        this.facebookService = FacebookService;
        this.$rootScope = $rootScope;
        this.clipboard = clipboard;
        this.showSearch = false;
        this.keyword = '';

        this.$scope.$watch(() => {
            return this.facebook.isReady();
        }, () => {
            this.isFacebookReady = true;
        });

        this.activate();
    }

    activate() {
        this.nextPage();
        this.openDetail();
    }

    changeCategory() {
        if(this.selectedCategory === 'search'){
            this.showSearch = true;
            this.selectedCategory = 'all';
            this.keyword = '';
        }else{
            this.posts = [];
            this.currentPage = 0;
            this.empty = false;
            this.nextPage();
        }
    }

    cancelSearch(){
        this.showSearch = false;
        this.keyword = '';
        this.selectedCategory = 'all';
        this.changeCategory();
    }

    keywordChange(){
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
            if(this.showSearch && this.keyword.length > 0){
                this.postService.getPostsByKeyword(this.keyword, pageNumber)
                    .then((response)=> {
                        if (response.data.length > 0) {
                            this.posts = this.posts.concat(response.data);
                            this.currentPage = pageNumber;
                        } else {
                            this.empty = true;
                        }
                        this.busy = false;
                        this.$timeout(()=>{
                            this.$document[0].body.querySelector('#keyword').focus();
                        });
                    }, ()=> {
                        this.busy = false;
                        this.$timeout(()=>{
                            this.$document[0].body.querySelector('#keyword').focus();
                        });
                    });
            }else if (this.selectedCategory === 'popular') {
                this.postService.getPopular(pageNumber)
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
            }else
            {
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
            }
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
            })
            .then((answer) => {
                if (answer === 'vote')
                    this.vote(post);
            }, ()=> {
            });
    }

    vote(post) {
        this.$mdDialog.show({
            clickOutsideToClose: true,
            parent: angular.element(this.$document.body),
            template: `<md-dialog aria-label="Vote" ng-cloak>
                            <md-toolbar style="background-color: #0a9bcb;">
                                <div class="md-toolbar-tools">
                                    <h2 style="color:white;">ยืนยัน</h2>
                                    <span flex></span>
                                    <md-button class="md-icon-button" ng-click="answer(false)">
                                        <md-icon md-font-library="material-icons" aria-label="Close dialog">close</md-icon>
                                    </md-button>
                                </div>
                            </md-toolbar>
                            <md-dialog-content style="background-color: white; color:#464646;">
                                <section layout="column" layout-align="center stretch" class="md-dialog-content" style="padding: 10px;">
                                    <div style="text-align: left;">
                                        คุณสามารถทำการโหวตได้เพียงหนึ่งครั้ง คุณยังคงยืนยันที่จะโหวตรูปภาพนี้?
                                    </div>
                                    <div layout="row" layout-align="end end">
                                        <md-button ng-click="answer(false)" style="color:#E91E63;">
                                            ปิด
                                        </md-button>
                                        <md-button ng-click="answer(true)" style="color:white; background-color: #E91E63">
                                            ยืนยัน
                                        </md-button>
                                    </div>
                                </section>
                            </md-dialog-content>
                        </md-dialog>`,
            controller: ['$scope', '$mdDialog', ($scope, $mdDialog) => {
                $scope.answer = (answer) => {
                    if (answer) {
                        this.facebookLoginForVote(post);
                    }
                    $mdDialog.hide(answer);
                }
            }]
        });
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
            sharingUrl = this.constant.domainUrl + '?token=' + post.random_no + '&' + new Date().getTime();
        } else {
            sharingUrl = this.constant.domainUrl;
        }

        this.facebook.ui({
            method: 'share',
            href: sharingUrl
        }, ()=> {

        })
    }

    copyLink(post) {

        let sharingUrl = this.constant.domainUrl + '?token=' + post.random_no + '&' + new Date().getTime();

        this.$mdDialog.show({
            clickOutsideToClose: true,
            parent: angular.element(this.$document.body),
            templateUrl: 'app/vote/copy-link.dialog.html',
            locals: {
                linkUrl: sharingUrl
            },
            controller: ['$scope', '$mdDialog', 'linkUrl', 'clipboard',
                ($scope, $mdDialog, linkUrl, clipboard) => {
                    $scope.linkUrl = linkUrl;
                    $scope.showCopyTooltip = false;
                    $scope.answer = (answer) => {
                        $mdDialog.hide(answer);
                    };
                    $scope.copyToClipboard = () => {
                        clipboard.copyText($scope.linkUrl);
                        $scope.showCopyTooltip = true;
                    }
                }]
        });

        // this.clipboard.copyText(sharingUrl);
        // post.showCopyTooltip = true;
    }


    go(stateName) {
        this.$state.go(stateName);
    }

    termClick() {
        this.$mdDialog.show({
            // clickOutsideToClose: true,
            parent: angular.element(this.$document.body),
            templateUrl: 'app/term/term.html',
            fullscreen: this.customFullscreen,
            controller: ['$scope', '$mdDialog', ($scope, $mdDialog) => {
                $scope.answer = (answer) => {
                    if (answer) {
                        this.login();
                    }
                    $mdDialog.hide(answer);
                }
            }]
        });
    }

    login() {
        if (this.loggedIn) {
            this.register();
        } else {
            // From now on you can use the Facebook service just as Facebook api says
            this.facebook.login((login_response) => {
                if (login_response.authResponse) {
                    this.register();
                }
            }, {scope: 'public_profile,email'});
        }

    }

    register() {

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

    me(callback) {
        this.facebook.api('/me?locale=en_US&fields=name,email', callback);
    }
}