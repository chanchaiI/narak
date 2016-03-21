export class AdminMainController {
    constructor($http, CONSTANT, $scope, $mdDialog, $document, PostAdminService, AuthService, $state) {
        'ngInject';

        this.$http = $http;
        this.constant = CONSTANT;
        this.$scope = $scope;
        this.$mdDialog = $mdDialog;
        this.$document = $document;
        this.postService = PostAdminService;
        this.authService = AuthService;

        this.authService.checkLogin().catch(()=>{
            $state.go('admin-login');
        });

        this.selected = [];
        this.query = {
            order: 'id',
            limit: 10,
            page: 1
        };

        this.options = {
            autoSelect: true,
            boundaryLinks: false,
            largeEditDialog: false,
            pageSelector: false,
            rowSelection: true
        };

        this.$scope.onPaginate = (page, limit)=>{
            let query = angular.extend({}, this.query, {page: page, limit: limit});
            this.getPosts(query);
        };
        this.$scope.onReorder = (order)=>{
            let query = angular.extend({}, this.query, {order: order});
            this.getPosts(query);
        };

        this.getPosts(this.query);

    }

    getPosts(query) {
        this.postService.getPosts(query).then((response)=>{
            this.posts = response.data;
        });
    }

    unPublish(){
        let confirm = this.$mdDialog.confirm()
            .title('Confirmation')
            .textContent('Are you sure to unpublish these posts?')
            .ariaLabel('Confirmation')
            .ok('Yes')
            .cancel('No');
        this.$mdDialog.show(confirm).then(() =>{
            this.postService.unpublish(this.selected).then(()=>{
                this.$mdDialog.show(
                    this.$mdDialog.alert()
                        .parent(angular.element(this.$document.body))
                        .clickOutsideToClose(true)
                        .title('Success')
                        .textContent('Unpublished post successfully!')
                        .ariaLabel('Success')
                        .ok('OK')
                );
                this.selected = [];
                this.getPosts(this.query);
            })
        });
    }

    publish(){
        let confirm = this.$mdDialog.confirm()
            .title('Confirmation')
            .textContent('Are you sure to publish these posts?')
            .ariaLabel('Confirmation')
            .ok('Yes')
            .cancel('No');
        this.$mdDialog.show(confirm).then(() =>{
            this.postService.publish(this.selected).then(()=>{
                this.$mdDialog.show(
                    this.$mdDialog.alert()
                        .parent(angular.element(this.$document.body))
                        .clickOutsideToClose(true)
                        .title('Success')
                        .textContent('Published post successfully!')
                        .ariaLabel('Success')
                        .ok('OK')
                );
                this.selected = [];
                this.getPosts(this.query);
            })
        });
    }

    showImage(post){
        let imgUrl = this.constant.domainUrl + this.constant.uploadedPath + post.image_path;
        this.$mdDialog.show(
            this.$mdDialog.alert()
                .parent(angular.element(this.$document.body))
                .clickOutsideToClose(true)
                .htmlContent('<img src="'+ imgUrl +'">')
                .ariaLabel('Image')
                .ok('OK')
        );
    }
}