export class ImageDialogController {

    constructor($scope, $mdDialog, imgUrl, nickname, voteCount, $mdMedia) {
        'ngInject';
        this.$scope = $scope;
        this.$mdDialog = $mdDialog;
        this.imgUrl = imgUrl;
        this.nickname = nickname;
        this.voteCount = voteCount;
        this.isFullScreen = $mdMedia('sm') || $mdMedia('xs');
    }

    hide() {
        this.$mdDialog.hide();
    }

    cancel() {
        this.$mdDialog.cancel();
    }

    answer(answer) {
        this.$mdDialog.hide(answer);
    }
}
