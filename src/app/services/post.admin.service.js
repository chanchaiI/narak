export class PostAdminService {
    constructor($log, $http, CONSTANT, $q, localStorageService) {
        'ngInject';
        this.constant = CONSTANT;
        this.$http = $http;
        this.$log = $log;
        this.$q = $q;
        this.localStorageService = localStorageService;
    }


    getPosts(query) {
        let token = this.localStorageService.get('token');
        if (token) {
            let getUrl = this.constant.serviceBaseUrl + 'post/' + query.order + '/' + query.limit + '/' + query.page;
            return this.$http.get(getUrl, {headers: {token: token}});
        } else {
            throw 'No Token';
        }
    }

    publish(selected) {

        let token = this.localStorageService.get('token');
        if (token) {
            let publishUrl = this.constant.serviceBaseUrl + 'post/publish';
            let selectedId = [];
            for (var i = 0; i < selected.length; i++) {
                selectedId.push(selected[i].id);
            }
            return this.$http.put(publishUrl, {idList: selectedId}, {headers: {token: token}});
        } else {
            throw 'No Token';
        }
    }

    unpublish(selected) {
        let token = this.localStorageService.get('token');
        if (token) {
            let unpublishUrl = this.constant.serviceBaseUrl + 'post/unpublish';
            let selectedId = [];
            for (var i = 0; i < selected.length; i++) {
                selectedId.push(selected[i].id);
            }
            let token = this.localStorageService.get('token');
            return this.$http.put(unpublishUrl, {idList: selectedId}, {headers: {token: token}});
        } else {
            throw 'No Token';
        }
    }
}