/**
 * Created by zhanghui
 * Author: zhanghui9700@gmail.com
 * Date: 2015-05-04
 * Description: Main Cloud App
 */

'use strict';

function template(name){
    return "/static/management/views/" + name + ".html";
}
/* Cloud App */
var CloudApp = angular.module("CloudApp", [
    "ui.router",
    "ui.bootstrap",
    "oc.lazyLoad",
    "ngSanitize",
    "ngTable",
    "ngResource",
    "ngCookies",
    "jm.i18next"
]);

CloudApp.config(function ($i18nextProvider) {
    $i18nextProvider.options = {
        lng: 'cn',
        fallbackLng: 'en',
        useCookie: false,
        useLocalStorage: false,
        resGetPath: '/static/cloud/locales/__lng__/__ns__.json'
    };
});

CloudApp.config(['$resourceProvider', function ($resourceProvider) {
    $resourceProvider.defaults.stripTrailingSlashes = false;
}]);

CloudApp.config(['$interpolateProvider', function ($interpolateProvider) {
    $interpolateProvider.startSymbol("{[{");
    $interpolateProvider.endSymbol("}]}");
}]);

CloudApp.config(['$httpProvider', function($httpProvider){
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Request-Width'];
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
    $httpProvider.interceptors.push('AuthInterceptor');
}]);

CloudApp.config(['$ocLazyLoadProvider', function ($ocLazyLoadProvider) {
    $ocLazyLoadProvider.config({});
}]);

/* Setup global settings */
CloudApp.factory('settings', ['$rootScope', function ($rootScope) {
    var settings = {
        layout: {
            pageSidebarClosed: false, // sidebar menu state
            pageBodySolid: false, // solid body color state
            pageAutoScrollOnLoad: 1000 // auto scroll to top on page load
        },
        layoutImgPath: Metronic.getAssetsPath() + 'admin/layout/img/',
        layoutCssPath: Metronic.getAssetsPath() + 'admin/layout/css/'
    };

    $rootScope.settings = settings;

    return settings;
}]);

CloudApp.factory("AuthInterceptor", [function($q){
    return {
        'responseError': function(rejection){
            if (rejection.status == 403 || rejection.status == 401) {
                window.location.href = "/login/";
                return $q.reject(rejection);
            }
            return rejection;
        }
    }
}]);

CloudApp.factory("CommonHttpService", function($http, $q){
    return {
        'get': function(api_url){
            var defer = $q.defer();
            $http({
                method: 'GET',
                url: api_url
            }).success(function(data, status, headers, config){
                defer.resolve(data);
            }).error(function(data, status, headers, config){
                defer.reject(data);
            });
            return defer.promise;
        },
        'post': function(api_url, post_data){
            var defer = $q.defer();
            $http({
                method: 'POST',
                url: api_url,
                data: $.param(post_data)
            }).success(function(data, status, headers,config){
                defer.resolve(data);
            }).error(function(data, status, headers, config){
                defer.reject(data);
            });
            return defer.promise;
        }
    };
});

CloudApp.factory('ResourceTool', function(){
  return {
    'copy_only_data': function(data){

      var result = {};

      for(var attr in data){
        if(attr.startsWith('$') || attr == 'toJSON'){
          continue;
        }
        result[attr] = data[attr];
      }

      return result;
    }
  }
});

CloudApp.factory('ToastrService', function () {
    toastr.options = {
        "closeButton": true,
        "debug": false,
        "positionClass": "toast-top-right",
        "onclick": null,
        "showDuration": "1000",
        "hideDuration": "1000",
        "timeOut": "5000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    };
    return {
        success: function (message, title) {
            toastr.success(message, title);
        },
        error: function (message, title) {
            toastr.error(message, title);
        }
    };
});

CloudApp.factory("BoxService", function(){
    return {
        "alert": function(message){
            bootbox.alert(message);
        },
        "confirm": function(message){
            bootbox.confirm(message, function(result) {
                return result;
            });
        }
    };
});

CloudApp.factory('ValidationTool', function(){

    var defaultConfig = {
        doNotHideMessage: true,
        errorElement: 'span',
        errorClass: 'help-block',
        focusInvalid: false,
        errorPlacement: function (error, element) {
            error.insertAfter(element);
        },

        highlight: function (element) {
            $(element).closest('.form-group').removeClass('has-success').addClass('has-error');
        },

        unhighlight: function (element) {
            $(element).closest('.form-group').removeClass('has-error').addClass('has-success');
        }
    };

    return {
        init: function(selector, config){
            for(var attr in defaultConfig){
                if(config[attr] === undefined){
                    config[attr] = defaultConfig[attr];
                }
            }
            $(selector).validate(config);
        }
    }
});


/* Setup image */
CloudApp.factory('Image', ['$resource', function ($resource) {
    return $resource("/api/images/:id");
}]);

/*  Setup contract */
CloudApp.factory('Contract', ['$resource', function($resource){
    return $resource("/api/contracts/:id");
}]);


CloudApp.factory('Quota', ['$resource', function($resource){
    return $resource("/api/quotas/:id") ;
}]);

/* Setup instance */
CloudApp.factory('Instance', ['$resource', function ($resource) {
    return $resource("/api/instances/:id");
}]);

/* Setup flavor */
CloudApp.factory('Flavor', ['$resource', function ($resource) {
    return $resource("/api/flavors/:id");
}]);

/* Setup network */
CloudApp.factory('Network', ['$resource', function ($resource) {
    return $resource("/api/networks/:id");
}]);

/* Setup volume */
CloudApp.factory('Volume', ['$resource', function ($resource) {
    return $resource("/api/volumes/:id");
}]);
/* Setup router */
CloudApp.factory('Router', ['$resource', function ($resource) {
    return $resource("/api/routers/:id");
}]);

/* Setup firewall */
CloudApp.factory('Firewall', ['$resource', function ($resource) {
    return $resource("/api/firewall/:id");
}]);

/* Setup Operation */
CloudApp.factory('Operation', ['$resource', function ($resource) {
    return $resource("/api/operation/:id");
}]);

CloudApp.factory('User', ['$resource', function($resource){
   return $resource("/api/users/:id")
}]);

CloudApp.factory('UserDataCenter', ['$resource', function($resource){
   return $resource("/api/user-data-centers/:id")
}]);


CloudApp.factory('DataCenter', ['$resource', function($resource){
  return $resource("/api/data-centers/:id")
}]);

/* Setup App Main Controller */
CloudApp.controller('AppController', ['$scope', '$rootScope', function ($scope, $rootScope) {
    $scope.$on('$viewContentLoaded', function () {
        Metronic.initComponents(); // init core components
    });
}]);

/***
 Layout Partials.
 By default the partials are loaded through AngularJS ng-include directive. In case they loaded in server side(e.g: PHP include function) then below partial
 initialization can be disabled and Layout.init() should be called on page load complete as explained above.
 ***/

/* Setup Layout Part - Header */
CloudApp.controller('HeaderController', ['$rootScope', '$scope', '$http', function ($rootScope, $scope, $http) {
    $scope.$on('$includeContentLoaded', function () {
        Layout.initHeader(); // init header
    });

    $http({"method": "GET", "url": "/current_user/"}).success(function (data) {
        $rootScope.current_user = data;
    });
}]);

/* Setup Layout Part - Sidebar */
CloudApp.controller('SidebarController', ['$scope', function ($scope) {
    $scope.$on('$includeContentLoaded', function () {
        Layout.initSidebar(); // init sidebar
    });
}]);

/* Setup Layout Part - Footer */
CloudApp.controller('FooterController', ['$scope', function ($scope) {
    $scope.$on('$includeContentLoaded', function () {
        Layout.initFooter(); // init footer
    });
}]);


/* Setup Rounting For All Pages */
CloudApp.config(['$stateProvider', '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider,$stateParams) {
        $urlRouterProvider.otherwise("/overview/");

        $stateProvider
            // Overview
            .state('overview', {
                url: "/overview/",
                templateUrl: template('overview'),
                data: {pageTitle: 'Overview'},
                controller: "OverviewController",
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'CloudApp',
                            insertBefore: '#ng_load_plugins_before',
                            files: [
                                '/static/assets/admin/pages/css/timeline.css',
                                '/static/management/controllers/overview_ctl.js'
                            ]
                        });
                    }],
                    accountSummary: function(CommonHttpService){
                        return CommonHttpService.get("/api/account/summary");
                    },
                    instanceSummary: function(CommonHttpService){
                        return CommonHttpService.get("/api/instances/summary");
                    }
                }
            })

            // contract
            .state("contract", {
                url: "/contract/",
                templateUrl: template('contract'),
                data: {pageTitle: "Contract"},
                controller: "ContractController",
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'CloudApp',
                            insertBefore: '#ng_load_plugins_before',
                            files: [
                                '/static/assets/global/plugins/bootstrap-datepicker/css/datepicker3.css',
                                '/static/assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js',
                                '/static/assets/admin/layout/scripts/components-pickers.js',
                                '/static/management/controllers/contract_ctrl.js'
                            ]
                        });
                    }]
                }
            })

            // data center
            .state("data_center", {
                url: "/data-center/",
                templateUrl: template('data_center'),
                data: {pageTitle: "Data Center"},
                controller: "DataCenterController",
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'CloudApp',
                            insertBefore: '#ng_load_plugins_before',
                            files: [
                                '/static/management/controllers/data_center_ctrl.js'
                            ]
                        });
                    }]
                }
            })

            // data center
            .state("flavor", {
                url: "/flavor/",
                templateUrl: template('flavor'),
                data: {pageTitle: "Flavor"},
                controller: "FlavorController",
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'CloudApp',
                            insertBefore: '#ng_load_plugins_before',
                            files: [
                                '/static/management/controllers/flavor_ctrl.js'
                            ]
                        });
                    }]
                }
            })

            // instance
            .state("instance", {
                url: "/instance/",
                templateUrl: "/static/cloud/views/instance.html",
                data: {pageTitle: 'Instance'},
                controller: "InstanceController",
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'CloudApp',
                            insertBefore: '#ng_load_plugins_before',
                            files: [
                                '/static/assets/global/plugins/bootstrap-wizard/jquery.bootstrap.wizard.min.js',
                                '/static/cloud/scripts/create_instance_wizard.js',
                                '/static/cloud/controllers/instance_ctl.js'
                            ]
                        });
                    }],
                    status_desc: function(CommonHttpService){
                        return CommonHttpService.get("/api/instances/status/")
                    }
                }

            })

            // image
            .state("image", {
                url: "/image/",
                templateUrl: "/static/cloud/views/image.html",
                data: {pageTitle: 'Image'},
                controller: "ImageController",
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'CloudApp',
                            insertBefore: '#ng_load_plugins_before',
                            files: [
                                '/static/cloud/controllers/image_ctl.js'
                            ]
                        });
                    }]
                }
            })

            // volume
            .state("volume", {
                url: "/volume/",
                templateUrl: "/static/cloud/views/volume.html",
                data: {pageTitle: 'Volume'},
                controller: "VolumeController",
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'CloudApp',
                            insertBefore: '#ng_load_plugins_before',
                            files: [

                                '/static/cloud/controllers/volume_ctl.js'
                            ]
                        });
                    }],
                    status_desc: function(CommonHttpService){
                        return CommonHttpService.get("/api/volumes/status/")
                    }
                }
            })

            // floating ip
            .state("floating", {
                url: "/floating/",
                templateUrl: "/static/cloud/views/floating.html",
                data: {pageTitle: 'FloatingIP'},
                controller: "FloatingController",
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'CloudApp',
                            insertBefore: '#ng_load_plugins_before',
                            files: [

                                '/static/cloud/controllers/floating_ctl.js'
                            ]
                        });
                    }],
                    status_desc: function(CommonHttpService){
                        return CommonHttpService.get("/api/floatings/status/")
                    }
                }
            })

            // firewall
            .state("firewall", {
                url: "/firewall/",
                templateUrl: "/static/cloud/views/firewall.html",
                data: {pageTitle: 'Firewall'},
                controller: "FirewallController",
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'CloudApp',
                            insertBefore: '#ng_load_plugins_before',
                            files: [
                                '/static/cloud/controllers/firewall_ctl.js'
                            ]
                        });
                    }]
                }
            })

            // firewall.addrule
            .state("firewallrules", {
                url: "/firewallrules/:firewall_id",
                templateUrl: "/static/cloud/views/firewall_rules.html",
                data: {pageTitle: 'Firewall'},
                controller: "FirewallRulesController",
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'CloudApp',
                            insertBefore: '#ng_load_plugins_before',
                            files: [
                                '/static/cloud/controllers/firewall_ctl.js'
                            ]
                        });
                    }],
                    firewall_id:function($stateParams){
                        return $stateParams.firewall_id;
                    }
                }
            })

            // network
            .state("network", {
                url: "/network/",
                templateUrl: "/static/cloud/views/network.html",
                data: {pageTitle: 'Firewall'},
                controller: "NetworkController",
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'CloudApp',
                            insertBefore: '#ng_load_plugins_before',
                            files: [
                                '/static/cloud/controllers/network_ctl.js'
                            ]
                        });
                    }],
                    status_desc: function(CommonHttpService){
                        return CommonHttpService.get("/api/networks/status/")
                    }
                }
            })

            // router
            .state("router", {
                url: "/router/",
                templateUrl: "/static/cloud/views/router.html",
                data: {pageTitle: 'Firewall'},
                controller: "RouterController",
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'CloudApp',
                            insertBefore: '#ng_load_plugins_before',
                            files: [

                                '/static/cloud/controllers/router_ctl.js'
                            ]
                        });
                    }],
                    status_desc: function(CommonHttpService){
                        return CommonHttpService.get("/api/networks/status/")
                    }
                }
            })
            // forum
            .state("forum", {
                url: "/forum/",
                templateUrl: "/static/cloud/views/forum.html",
                data: {pageTitle: 'forum'},
                controller: "ForumController",
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'CloudApp',
                            insertBefore: '#ng_load_plugins_before',
                            files: [

                                '/static/cloud/controllers/forum_ctl.js'
                            ]
                        });
                    }]
                }
            })
            // operation
            .state("operation", {
                url: "/operation/",
                templateUrl: "/static/cloud/views/operation.html",
                data: {pageTitle: 'Operation'},
                controller: "OperationController",
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'CloudApp',
                            insertBefore: '#ng_load_plugins_before',
                            files: [
                                '/static/cloud/controllers/operation_ctl.js'
                            ]
                        });
                    }]
                }
            })
        ;
    }]);

/* Init global settings and run the app */
CloudApp.run(["$rootScope", "settings", "$state", "$http", "$cookies", "$interval",
    function ($rootScope, settings, $state, $http, $cookies, $interval) {
        $http.defaults.headers.common['X-CSRFToken'] = $cookies['csrftoken'];
        $rootScope.$state = $state;
        $rootScope.timer_list = [];

        $rootScope.$on("$stateChangeStart", function(e, toState, toParams, fromState, fromParams){
            while($rootScope.timer_list.length > 0){
                var t = $rootScope.timer_list.pop();
                $interval.cancel(t);
            }
        });
    }]);
