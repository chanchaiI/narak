/* global malarkey:false, moment:false */

import {config} from './app.config';
import {routerConfig} from './app.route';
import {runBlock} from './app.run';
import {constant} from './app.constant';
import {DataService} from './services/data.service';
import {IntroController} from './intro/intro.controller';
import {DataCaptureController} from './data-capture/data-capture.controller';
import {SelectTemplateController} from './select-template/select-template.controller';
import {MainController} from './main/main.controller';
import {ShareController} from './share/share.controller';
import {HowToPlayController} from './how-to-play/how-to-play.controller'
import {PostService} from './services/post.service';
import {PostAdminService} from './services/post.admin.service';
import {AuthService} from './services/auth.service';
import {FacebookService} from './services/facebook.service';
import {ImageDialogController} from './vote/image.dialog.controller'
import {VoteController} from './vote/vote.controller';
import {AdminLoginController} from './admin/login.controller';
import {AdminMainController} from './admin/main.controller';
import {} from './components/narak.fileupload/narak.fileupload';
import {AwardController} from "./award/award.controller";

angular.module('narak', ['ngAnimate', 'ngSanitize', 'ngMessages', 'ngAria', 'ui.router', 'ngMaterial', 'md.data.table',
    'facebook', 'narakFileUpload', 'angular-loading-bar', 'infinite-scroll', 'angular-clipboard', 'LocalStorageModule'])
    .constant('malarkey', malarkey)
    .constant('moment', moment)
    .constant('CONSTANT', constant)
    .config(config)
    .config(routerConfig)
    .run(runBlock)
    .service('DataService', DataService)
    .controller('IntroController', IntroController)
    .controller('DataCaptureController', DataCaptureController)
    .controller('SelectTemplateController', SelectTemplateController)
    .controller('MainController', MainController)
    .controller('ShareController', ShareController)
    .controller('HowToPlayController', HowToPlayController)
    .service('PostService', PostService)
    .service('PostAdminService', PostAdminService)
    .service('AuthService', AuthService)
    .service('FacebookService', FacebookService)
    .controller('ImageDialogController', ImageDialogController)
    .controller('VoteController', VoteController)
    .controller('AwardController', AwardController)
    .controller('AdminLoginController', AdminLoginController)
    .controller('AdminMainController', AdminMainController)
;
