export class PostService {
    constructor($log, $http, CONSTANT, $q) {
        'ngInject';

        this.constant = CONSTANT;
        this.$http = $http;
        this.$log = $log;
        this.$q = $q;

    }


    getPosts(category_id, pageNumber) {
        var getPostUrl = this.constant.serviceBaseUrl + 'post/' + category_id + '/page/' + pageNumber;
        return this.$http.get(getPostUrl, {
            ignoreLoadingBar: true
        }).catch(function(){
            var result = {data: []};
            //if (pageNumber < 5) {
            //    for (var i = 0; i < 6; i++) {
            //        result.data.push({
            //            image_path: '7279.jpg',
            //            kid_name: 'ด.ญ. น่ารัก เทียร่า',
            //            kid_nickname: 'ณดา',
            //            vote_count: i*30
            //        })
            //    }
            //}
            return result;
        });
    }

    getPostsByKeyword(keyword, pageNumber){
        var getPostUrl = this.constant.serviceBaseUrl + 'post/keyword/' + encodeURI(keyword) + '/page/' + pageNumber;
        return this.$http.get(getPostUrl, {
            ignoreLoadingBar: true
        }).catch(function(){
            var result = {data: []};
            return result;
        });
    }

    getAwardPostByType(type){
      var getPostUrl = this.constant.serviceBaseUrl + 'post/' + type;
      return this.$http.get(getPostUrl, {
        ignoreLoadingBar: true
      }).catch(function(){
        var result = {data: []};
        return result;
      });
    }

    getPostById(id) {
        var getPostUrl = this.constant.serviceBaseUrl + 'post/' + id;
        return this.$http.get(getPostUrl);
    }


    getPostByRandomNO(randomNO) {
        var getPostUrl = this.constant.serviceBaseUrl + 'post/random/' + randomNO;
        return this.$http.get(getPostUrl);
    }

    getPopular(pageNumber) {
        var getPopularVoteUrl = this.constant.serviceBaseUrl + 'post/' + pageNumber + '/popular';
        return this.$http.get(getPopularVoteUrl, {
            ignoreLoadingBar: true
        }).catch(function(){
            var result = {data: []};
            return result;
        });
    }
}
