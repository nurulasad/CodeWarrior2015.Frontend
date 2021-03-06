﻿/// <reference path="../reference.ts" />

module Controllers {
    export class LoginController {
        private loginServicve = new LoginService();
        private $scope;
        private $localStorage;
        private $location;
        private loginMessage = '';
        private signupMessage = '';
        private loginModel = { userName: 'tanjeer369', password: 'tanjeer369' };
        private signupModel = {
            userName: 'tanjeer369', fullName: 'Tanjeer', sex: '',
            addressLine1: '', addressLine2: '', mobile: '31351351',
            email: 'tbh.tilok@live.com', password: 'tanjeer369', confirmPassword: 'tanjeer369'
        };

        //static $inject = ['$scope', '$rootScope', '$localStorage', '$location'];

        constructor($scope, $rootScope, $localStorage, $location) {
            $scope.vm = this;
            this.$scope = $scope;
            this.$localStorage = $localStorage;
            this.$location = $location;
            this.init();
        }

        public init() {
            jQuery('#home-id').removeClass('active');
            if (this.$localStorage.accessToken && this.$localStorage.accessToken != 'null') {
                jQuery('#login-id').hide();
                jQuery('#logout-id').show();
                jQuery('#user-id').show();
                jQuery('#account-id').show();
            } else {
                jQuery('#login-id').show();
                jQuery('#logout-id').hide();
                jQuery('#user-id').hide();
                jQuery('#account-id').hide();
            } 
        }

        public login() {
            if (this.validateLogin()) {
                this.loginMessage = '';
                this.callLoginService(this.loginModel.userName, this.loginModel.password, this.loginModel.password);
            }
        }

        public signup() {
            if (this.validateSingup()) {
                this.signupMessage = '';
                this.callRegisterService();
            }

        }

        private callLoginService(userName, password, confirmPassowrd) {
            var pub = this;
            this.loginMessage = 'logging in..';
            var data = 'userName=' + userName + '&password=' + password + '&confirmPassword=' + confirmPassowrd + '&grant_type=password';
            this.loginServicve.login(data).done(function (response) {
                pub.$localStorage.accessToken = response.access_token;
                pub.$localStorage.userName = userName;
                pub.showLoginMenu();
                pub.$scope.$apply(function () {
                    pub.$location.path('/home');
                });
            }).fail(function (response) {
                pub.$scope.$apply(function () {
                    pub.loginMessage = 'invalid user name or password';
                });
            });
        }

        private callRegisterService() {
            var pub = this;
            this.signupMessage = 'Registering..';
            var data = 'userName=' + this.signupModel.userName + '&password=' + this.signupModel.password +
                '&confirmPassword=' + this.signupModel.confirmPassword +
                '&fullName=' + this.signupModel.fullName + '&sex=' + this.signupModel.sex +
                "&address=" + this.signupModel.addressLine1 + '|' + this.signupModel.addressLine2 +
                '&phoneNumber=' + this.signupModel.mobile + '&email=' + this.signupModel.email;
            this.loginServicve.register(data).done(function (response) {
                pub.$scope.$apply(function () {
                    pub.clearRegisterModel();
                    pub.signupMessage = 'Registration successful';
                });
            }).fail(function (response) {
                pub.$scope.$apply(function () {
                    pub.signupMessage = 'Invalid request, please check all the fields again';
                });
            });
        }

        private validateLogin() {
            if (!this.loginModel.userName) {
                this.loginMessage = 'User name field is empty';
                return false;
            }
            if (!this.loginModel.password) {
                this.loginMessage = 'password field is empty';
                return false;
            }
            return true;
        }

        private validateSingup() {
            if (!this.signupModel.userName) {
                this.signupMessage = 'user name field is empty';
                return false;
            }
            if (!this.signupModel.fullName) {
                this.signupMessage = 'name field is empty';
                return false;
            }
            if (!this.signupModel.mobile) {
                this.signupMessage = 'mobile number field is empty';
                return false;
            }
            if (!this.checkPhoneNumber(this.signupModel.mobile)) {
                this.signupMessage = 'invalid mobile number';
                return false;
            }
            if (!this.signupModel.email) {
                this.signupMessage = 'email field is empty';
                return false;
            }
            if (!this.signupModel.password) {
                this.signupMessage = 'password field is empty';
                return false;
            }
            if (this.signupModel.password.length < 6) {
                this.signupMessage = 'passowrd must be atleast 6 character/digit long';
                return false;
            }
            if (this.signupModel.password != this.signupModel.confirmPassword) {
                this.signupMessage = 'passowrd not matched';
                return false;
            }
            return true;
        }

        private clearRegisterModel() {
            this.signupModel.userName = '';
            this.signupModel.password = '';
            this.signupModel.confirmPassword = '';
            this.signupModel.fullName = '';
            this.signupModel.sex = '';
            this.signupModel.addressLine1 = '';
            this.signupModel.addressLine2 = '';
            this.signupModel.mobile = '';
            this.signupModel.email = '';
        }

        private showLoginMenu() {
            jQuery('#login-id').hide();
            jQuery('#logout-id').show();
            jQuery('#user-id').show();
            jQuery('#account-id').show();
            jQuery('#user-id a').text(this.$localStorage.userName);
        }

        private checkPhoneNumber(phone:string)
        {
            var regex = /^[\d\.\-]+$/;
            if (!regex.test(phone)) {
                return false;
            }
            return true;
        }
    }
}