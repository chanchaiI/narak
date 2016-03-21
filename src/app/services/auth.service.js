export class AuthService {
    constructor($http, CONSTANT, localStorageService, $q) {
        'ngInject';

        this.constant = CONSTANT;
        this.$http = $http;
        this.localStorageService = localStorageService;
        this.$q = $q;
    }

    login(user){
        let authUrl = this.constant.serviceBaseUrl + 'auth/login';
        return this.$http.post(authUrl, user).then((response)=>{
            this.localStorageService.set('token', response.data);
        }, ()=>{
            throw 'Login Failed!';
        });
    }

    checkLogin(){
        var token = this.localStorageService.get('token');
        var deferred = this.$q.defer();
        if(token){
            let authUrl = this.constant.serviceBaseUrl + 'auth';
            this.$http.get(authUrl, {headers: {token: token}}).then(()=>{
                deferred.resolve('OK');
            }, ()=>{
                deferred.reject('Invalid Token');
            });
        }else{
            deferred.reject('Invalid Token');
        }

        return deferred.promise;
    }
}
