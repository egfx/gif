angular.element(document).ready(function() {
  angular.bootstrap(document, ["MainModule"]);
});

if (!Array.prototype.some) {
  Array.prototype.some = function(f) {
    if (this === null) throw new TypeError();
    var t = Object(this);
    var len = t.length || 0;
    if (typeof f != "function") throw new TypeError();
    for (var i = 0; i < len; i++) {
      if (i in t && f.call(this, t[i], i, t)) return true;
    }
    return false;
  };
}

var MainModule = angular.module('MainModule', [
  'ngRoute', 
  'ngResource',
  'ngSanitize',
  'ngTouch',
  'ngCookies',
  'gridster',
  'oc.lazyLoad',
  'angular.filter',
  'ngLodash',
  'ng.deviceDetector',
  'ui.bootstrap.contextMenu'
]).

config(['$routeProvider', '$sceDelegateProvider', '$httpProvider', '$compileProvider', '$controllerProvider', '$locationProvider', '$ocLazyLoadProvider', function($routeProvider, $sceDelegateProvider, $httpProvider, $compileProvider, $controllerProvider, $locationProvider, $ocLazyLoadProvider) {
  $routeProvider.
    when('/post', {
      templateUrl: 'static/partials/home.html',
      controller: 'GridCtrl',
      reloadOnSearch: false
    }).
    when('/plan', {
      templateUrl: 'static/partials/stripesplash.html',
      controller: 'StripePlanCtrl'
    }).
    otherwise({
        controller : function(){
            window.location.replace('https://egfx.github.io/gif');
        }, 
        template : "<div></div>"
    });

  $sceDelegateProvider.resourceUrlWhitelist(['**']);
  
  $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|javascript|tel):/);
  $compileProvider.debugInfoEnabled(false);
  
  $locationProvider.html5Mode({enabled: true, requireBase: false});

  MainModule.lazyController = $controllerProvider.register;
  MainModule.lazyDirective = $compileProvider.directive;

}]).

controller('StripePlanCtrl', ['WidgetSrvc', 'deviceDetector', '$scope', '$routeParams', '$location', '$timeout', '$window', '$interval', 'BreezeDataContext', 'Myself', function(WidgetSrvc, deviceDetector, $scope, $routeParams, $location, $timeout, $window, $interval, BreezeDataContext, Myself){

  $scope.deviceDetector = deviceDetector;

  $scope.plans = [
    {
      type: 'Bronze', 
      price: 49.00,
      stripe: {
        //id: 'GBviMm18pfbNqe' /* test */
        //id: 'GBvaTniLsPO7XS' /* $4.99 */
        //id: 'GzW3RTQ88zcV9f' /* 6.95 */
        //id: 'H80BiSuNi0La8T' /* 8.95 */
        id: '1IMnI0EbDWNKCFPNiNkAo0xw' /* 49.00 */
      },
      thumbs: [
        'b1.jpg',
        'b2.jpg',
        'b3.jpg',
        'b4.jpg',
        'b5.jpg',
        'b6.jpg',
        'b7.jpg',
        'b8.jpg',
        'b9.jpg',
        'b10.jpg',
        'b11.jpg',
        'b12.jpg',
        'b13.jpg',
        'b14.jpg',
        'b15.jpg',
        'b16.jpg',
        'b17.jpg'
      ],
      quotes: [
        '✓ Make GIFs without watermarks',
        '✓ Get 1,500 tokens to spend each month'
      ],
      headline: ''
    }, 
    {
      type: 'Silver', 
      price: 99.00,
      stripe: {
        //id: 'GzWB5AQKkiY7Q9' /* 24.95 */
        id: '1IMnIJEbDWNKCFPN6wD2guCp' /* 99.00 */
      },
      thumbs: [
        's1.jpg',
        's2.jpg',
        's3.jpg',
        's4.jpg',
        's5.jpg',
        's6.jpg',
        's7.jpg',
        's8.jpg',
        's9.jpg',
        's10.jpg',
        's11.jpg',
        's12.jpg',
        's13.jpg',
        's14.jpg',
        's15.jpg',
        's16.jpg',
      ],
      quotes: [
          '✓ Make GIFs without watermarks',
          '✓ Spend tokens in the GifShop™',
          '✓ Get 75,000 tokens to spend each month'
      ],
      headline: ''
    }, 
    {
      type: 'Gold', 
      price: 299.00,
      stripe: {
        //id: 'H8f76vmTXeHr41' /* 99.95 */
        id: '1IMnIYEbDWNKCFPN0Uri9Osr' /* 299.00 */
      },
      thumbs: [
        'g1.jpg',
        'g2.jpg',
        'g3.jpg',
        'g4.jpg',
        'g5.jpg',
        'g6.jpg',
        'g7.jpg',
        'g8.jpg',
        'g9.jpg',
        'g10.jpg',
        'g11.jpg',
        'g12.jpg',
        'g13.jpg',
        'g14.jpg',
        'g15.jpg'
      ],
      quotes: [
          '✓ Make GIFs without watermarks',
          '✓ Spend tokens in the GifShop™',
          '✓ Introducing LimeText™ IDE for coders',
          '✓ Get 250,000 tokens to spend each month'
      ],
      headline: ''
    },
    {
      type: 'Goldplus',
      price: 399.00,
      stripe: {
        //id: 'GaDby7ukz94bRb' /* 99.99 */
        id: '1IMyGBEbDWNKCFPNJ8Jkg7Ql' /* 399.00 */
      },
      thumbs: [
        'g1.jpg',
        'g2.jpg',
        'g3.jpg',
        'g4.jpg',
        'g5.jpg',
        'g6.jpg',
        'g7.jpg',
        'g8.jpg',
        'g9.jpg',
        'g10.jpg',
        'g11.jpg',
      ],
      quotes: [
          '✓ Make GIFs without watermarks',
          '✓ Spend tokens in the GifShop™',
          '✓ Introducing LimeText™ IDE for coders',
          '✓ Get Unlimited tokens to spend each month'
      ],
      headline: ''
    },
  ];

  var typeParam = $routeParams.type.toLowerCase();
  $scope.currentPlan = $scope.plans[$scope.plans.findIndex(x => x.type.toLowerCase() == typeParam)];
  var nextPlanIndex = $scope.plans.findIndex(x => x.type.toLowerCase() == typeParam);
  nextPlanIndex = nextPlanIndex + 1;
  $scope.nextPlan = $scope.plans[nextPlanIndex];

  /* ------- Set up Stripe Elements to use in checkout form ------- */

  $scope.orderData = {
    items: [{plan: 'price_'+$scope.currentPlan.stripe.id, price: $scope.currentPlan.price, quantity: 1}],
    currency: "usd"
  };
  
  var stripe = Stripe('pk_live_xcLmEp02dMgFWZxIs2Wy2WGu');
  //var stripe = Stripe('pk_test_pkLIRMEaA3vLt3fVbraOVSGf');
  var elements = stripe.elements();
  var style = {
    base: {
      color: "#32325d",
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: "antialiased",
      fontSize: "16px",
      "::placeholder": {
        color: "#aab7c4"
      }
    },
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a"
    }
  };

  $scope.card = elements.create("card", { style: style });
  $scope.card.mount("#card-element");
  
  $scope.updatePlan = function(){
    $timeout(function(){
      delete $scope.featuredLabel;
      $location.search({type: $scope.nextPlan.type});
    },650);
  }

  $scope.getRandomThumbA = $scope.currentPlan.thumbs[Math.floor(Math.random()*$scope.currentPlan.thumbs.length)];
  $scope.getRandomThumbB = $scope.currentPlan.thumbs[Math.floor(Math.random()*$scope.currentPlan.thumbs.length)];
  $scope.getRandomThumbC = $scope.currentPlan.thumbs[Math.floor(Math.random()*$scope.currentPlan.thumbs.length)];

    //$scope.featuredLabel = $scope.currentPlan.quotes[$scope.currentPlan.quotes.length-1];
    $scope.featuredLabel = $scope.currentPlan.headline;

    switch($scope.currentPlan.type){
      case 'Goldplus':
        $scope.featuredLabel = '(Unlimited tokens / Unlimited minutes)';
      break;
      case 'Gold':
        $scope.featuredLabel = '(250,000 tokens / 8,300 minutes)';
      break;
      case 'Silver':
        $scope.featuredLabel = '(75,000 tokens / 2,500 minutes)';
      break;
      case 'Bronze':
        $scope.featuredLabel = '(1,500 tokens / 60 minutes)';
      break;
      default:
        $scope.featuredLabel = '(0 tokens / 0 minutes)';
      break;
    }

    var openDetailsTimer,closeDetailsTimer;

    $scope.openDetails = function(e, tags, pad){    
      openDetailsTimer = $timeout(function(){
        angular.forEach(tags, function(tag){
          $(tag).find('.content').stop().animate({
            height: $('.hover-div').find('.content')[0].scrollHeight + pad
          }, 200);
        });
      }, 500);
    };

    $scope.closeDetails = function(e, tags){
      $timeout.cancel(openDetailsTimer);
      closeDetailsTimer = $timeout(function(){
        angular.forEach(tags, function(tag){
          $(tag).find('.content').stop().animate({
            height: '0px'
          }, 200);
        });
      }, 500);
    };

    $scope.showError = function(errorMsgText){
      var errorMsg = document.querySelector(".sr-field-error");
      errorMsg.textContent = errorMsgText;
      setTimeout(function() {
        errorMsg.textContent = "";
      }, 4000);
    }

    $scope.orderComplete = function(clientSecret){
      stripe.retrievePaymentIntent(clientSecret).then(function(result) {
        var paymentIntent = result.paymentIntent;
        var paymentIntentJson = JSON.stringify(paymentIntent, null, 2);

        switch(paymentIntent.amount){
          case 895:
            $window.localStorage.setItem('tk', 1500);
            $window.localStorage.setItem('_plan', 'bronze');
              break;
          case 2495:
            $window.localStorage.setItem('tk', 75000);
            $window.localStorage.setItem('_plan', 'silver');
              break;
          case 9995:
            $window.localStorage.setItem('tk', 250000);
            $window.localStorage.setItem('_plan', 'gold');
              break;
          case 9999:
            $window.localStorage.setItem('tk', 999999999);
            $window.localStorage.setItem('_plan', 'goldplus');
              break;
          default:
            $window.localStorage.setItem('tk', 10);
            $window.localStorage.setItem('_plan', 'default');
              break;
        }
        $window.location.pathname = '/post';
      });
    }

    $scope.handleAction = function(clientSecret){
      stripe.handleCardAction(clientSecret).then(function(data) {
        if (data.error) {
          $scope.showError("Your card was not authenticated, please try again");
        } else if (data.paymentIntent.status === "requires_confirmation") {
          WidgetSrvc.post("pay", JSON.stringify({paymentIntentId: data.paymentIntent.id}))
            .then(function(json) {
              if (json.error) {
                $scope.showError(json.error);
              } else {
                $scope.orderComplete(clientSecret);
              }
          })
        }
      });
    }

    $scope.goPay = function(){

      var cardholderName = document.querySelector("#name").value;
      var data = {
        billing_details: {}
      };

      if (cardholderName) {
        data["billing_details"]["name"] = cardholderName;
      }

      // Initiate the payment. handleCardPayment will display a modal
      stripe
        .createPaymentMethod("card", $scope.card, data)
        .then(function(result) {
          if (result.error) {
            $scope.showError(result.error.message);
          } else {
            $scope.orderData.paymentMethodId = result.paymentMethod.id;
            return WidgetSrvc.post("pay", JSON.stringify($scope.orderData));
          }
        })
        .then(function(paymentData) {
          paymentData = paymentData.data;
          console.log(paymentData);
          if (paymentData.requiresAction) {
            // Request authentication
            $scope.handleAction(paymentData.clientSecret);
          } else if (paymentData.error) {
            $scope.showError(paymentData.error);
          } else {
            $scope.orderComplete(paymentData.clientSecret);
          }
        });
      $window.onbeforeunload = function (e) {
        $window.location.replace('https://gif.com.ai/');
      };
    }
}]).

controller('GridCtrl', ['$q', '$rootScope', '$scope', '$compile','$log', '$timeout', '$interval', '$filter', '$window', '$document', '$routeParams', '$httpParamSerializer', '$location', '$sce', '$ocLazyLoad', '$http', '$injector', 'BreezeDataContext', 'WidgetSrvc', 'lodash', 'deviceDetector', 'Myself', function($q,$rootScope,$scope,$compile,$log,$timeout,$interval,$filter,$window,$document,$routeParams,$httpParamSerializer,$location,$sce,$ocLazyLoad,$http,$injector,BreezeDataContext,WidgetSrvc,lodash,deviceDetector,Myself) {
       
      //BreezeDataContext.clearEverything();
       
      $scope.myself = {
        loading: true
      };
      Myself.then(function(myself) {
        $scope.myself = myself;
        //console.log($scope.myself);
      });

      $scope.deviceDetector = deviceDetector;

      $scope.goToUrl = function(url){
        $window.location.replace(url);
      }

      $scope.signup = function(){

        $scope.anonUserData = {
          username: Date.now(),
          password: 'freebirds'
        }
        WidgetSrvc.post('adduser/local', JSON.stringify($scope.anonUserData)).then(function(ret){
          if(!$window.localStorage.getItem('tk')){
            $scope.tokenAmount = 100;
          } else {
            $scope.tokenAmount = 100 + $window.localStorage.getItem('tk');  
          }
          $window.localStorage.setItem('tk', $window.localStorage.getItem('tk'));
          $window.location.href = 'https://2fb.me/https://gif.com.ai';
        })
      }

      $window.isPost = $scope.ispost = ($location.path() == '/post') ? true : false;
      //$window.isMoment = $scope.ismoment = ($routeParams.moment) ? true : false;
      //$window.channel = $scope.channel = $routeParams.channel;

      if($window.localStorage.getItem('import') && $window.localStorage.getItem('import') !== 'undefined'){
        angular.forEach(
          $filter('unique')(JSON.parse($window.localStorage.getItem('import')), 'url'),
            function(file){
              BreezeDataContext.addFile(file).then(function(){
                $window.localStorage.removeItem('import');
                $scope.imports = BreezeDataContext.getMyFiles();
              })
            }
        )
        $window.localStorage.removeItem('import');
      } else {
        $window.localStorage.removeItem('import');
      }

      if($window.localStorage.getItem('tk')){
        $scope.tokenAmount = WidgetSrvc.kFormatter(parseInt($window.localStorage.getItem('tk')));
      }
      
      if(!$window.localStorage.getItem('tk')){
        $scope.tokenAmount = 100;
        $window.localStorage.setItem('tk', $scope.tokenAmount);
      } else {
        $scope.tokenAmount = WidgetSrvc.kFormatter(parseInt($window.localStorage.getItem('tk')));
      }
      
      $scope.isHost = $routeParams.host;

      $scope.referrer = document.referrer;

      $rootScope.$on('gifRecordDone', function(){
        $scope.tokenAmount = $window.localStorage.getItem('tk');
      });

      $scope.trash = [];

      $scope.castType = 'cast_connected';

      $scope.notes = [];

      $scope.loginType = ['facebook', 'google', 'custom'];

      $scope.ids = [];

      $scope.tags = [];

      if($routeParams.files){
        var fileBucket = $routeParams.files.split(',');

        var file1 = new Image();
        file1.onload = function(){  
          BreezeDataContext.addFile({
            realHeight: fe1.height,
            realWidth: fe1.width,
            html: `<img src="${self.file.url}" />`,
            css: '',
            settings: '',
            url: self.file.url
          }).then(function(){
            $scope.imports = BreezeDataContext.getMyFiles();
          });
        }

        file1.src = urlFile[i];
      }

      $scope.selectedElements = [];

      $scope.stateMode = $routeParams.mode;

      $scope.importer = function(){
        var currentnotes = BreezeDataContext.getMyNotes();
        for (let i = currentnotes.length - 1; i >= 0; i--){
          BreezeDataContext.delElement(currentnotes[i]);
        };
        $scope.imports = BreezeDataContext.getMyFiles();
      }

      $scope.initExplore = function(){
        var closeCtrl = document.getElementById('btn-search-close'),
          searchContainer = document.querySelector('#myExplore .search'),
          inputSearch = searchContainer.querySelector('#myExplore .search__input');

        function initExplore() {
          initExploreEvents(); 
        }

        function initExploreEvents() {
          inputSearch.addEventListener('focus', openSearch);
          inputSearch.addEventListener('focusout', closeSearch);
          closeCtrl.addEventListener('click', closeSearch);
          document.addEventListener('keyup', function(ev) {
            // escape key.
            if( ev.keyCode == 27 ) {
              closeSearch();
            }
          });
        }

        function openSearch() {
          $('.horizontal-scroll-wrapper').addClass('transgray');
          searchContainer.classList.add('search--open');
          inputSearch.focus();
        }

        function closeSearch() {
          $('.horizontal-scroll-wrapper').removeClass('transgray');
          searchContainer.classList.remove('search--open');
          inputSearch.blur();
          if($scope.checkInputValue != $('#search-input').val()){
            $scope.explore($('#search-input').val());
            $scope.checkInputValue = $('#search-input').val();
          }
        }

        if($('.horizontal-scroll-wrapper').hasClass('transgray')){
          closeSearch();
        } else {
          openSearch();
        }

        initExplore();
      }

      $scope.exploreImport = function(index){
        BreezeDataContext.addFile({
            realHeight: $('.explore_gif').get(index).height,
            realWidth: $('.explore_gif').get(index).width,
            html: $($('.explore_gif').get(index)).prop('outerHTML'),
            css: '',
            settings: '',
            url: $($('.explore_gif').get(index)).prop('src')
        }).then(function(){
            $scope.imports = BreezeDataContext.getMyFiles();
          });
      }

      $scope.explore = function(value = 'click'){
        var displayIt = displayIt || 0;
        $scope.exploreArr = [];
        $('#myExplore').fadeTo(1250, 1);
        $http.get('https://gifcities.archive.org/api/v1/gifsearch', {params: {q: value }}).then(function(response){
          $scope.exploreArr = response.data;
        });
      }

      $scope.loadMoreLimit = 10; // initial value for limit
      $scope.loadMore = function (last, inview) {
        if (last && inview) {
          $scope.loadMoreLimit += 10
        }
      }

      $scope.getFileDate = function(i){
        $scope.panelMod[i] = $filter('date')($scope.imports[i]['last_modified'], 'medium');
      }
      
      $scope.setSelectScreenImport = function(i, ev, toggle){
        var portBucket = [];
        if(toggle) {
          $scope.selectedElements.push($scope.imports[i]);
        } else {
          $scope.selectedElements.forEach(function(imp){
            portBucket.push(imp.url);
          });
          var matchIdx = $.inArray($(ev.target).attr('src'), portBucket);
          $scope.selectedElements.splice(matchIdx, 1);
        }
        if($scope.selectedElements.length){
          $scope.showPlus = true;
        } else {
          $scope.showPlus = false;
        }
      }

      $scope.sendImportedToWebtop = function(){
        WidgetSrvc.form('https://gif.com.ai/post/', {'clips': JSON.stringify($scope.selectedElements)});
      }

      $scope.loadDrop = function(){
        $("body").filedrop({
          dragOver: function(allowed) {
            $scope.filedrop = true;
            if(allowed){
              $scope.dropAllowed = true;
              $timeout(function(){  
                $('#dropzone').addClass('dropzone').css('background-color', 'rgba(0,0,0,.9)');
                $('#droptarget').css({'border': '2px dashed #3aa8ff', 'display': 'flex'});
              },250);
            } else {
              $scope.dropAllowed = false;
              $timeout(function(){
                $('#dropzone').addClass('dropzone').css('background-color', 'rgba(0,0,0,.9)');                  
                $('#droptarget').css({'border': '2px dashed #ea1612', 'display': 'flex'});
              },250);
            }
          },
          dragLeave: function() {
            $timeout(function(){
              $('#dropzone').removeClass('dropzone').css('background-color', '');
              $('#droptarget').css({'border': '', 'display': 'none'});
              $scope.filedrop = false;
            },2500);
          },
          callback: function(fileEncryptedData, eventData, source){

            $scope.selectScreen = true;

            var self = this;

            $('#dropzone').removeClass('dropzone').css('background-color', '');
            $('#droptarget').css('border', '');
            $timeout(function(){
              $scope.filedrop = false;
            },500);

            if(source == 'dragurl') {

              console.log(self.file);

              var fe1 = new Image();

              fe1.onload = function() {
                BreezeDataContext.addFile({
                    realHeight: fe1.height,
                    realWidth: fe1.width,
                    html: `<img src="${self.file.url}" />`,
                    css: '',
                    settings: '',
                    url: self.file.url
                  }).then(function(){
                    $scope.imports = BreezeDataContext.getMyFiles();
                    //$scope.selectScreen = true;
                  });
              }

              fe1.src = self.file.url;
            
            } else if(source == 'file' || source == 'paste') {

              var fe2 = new Image(); 

                fe2.onload = function(){
                   WidgetSrvc.storeBase64Imgur(fe2.src, fe2.width, fe2.height).then(function(payload){
                      var pldata = payload;
                      BreezeDataContext.addFile({
                          realHeight: pldata.height,
                          realWidth: pldata.width,
                          html: `<img src="${pldata.link}" />`,
                          css: '',
                          settings: '',
                          url: pldata.link
                      }).then(function(){
                        $scope.imports = BreezeDataContext.getMyFiles();
                        //$scope.selectScreen = true;
                      });
                   });
                };

                fe2.src = fileEncryptedData;
            }
          }
        });
      }

      $scope.$watch('imports', function(){
        if($scope.imports.length) {
          $scope.selectScreen = true;
        }
      });

      $scope.handlePaste = function(event){
        $timeout(function(){
          var pasteInputUrl = event.target.value;
          WidgetSrvc.getMetaFromUrl(pasteInputUrl).then(function(imgMeta){
            BreezeDataContext.addFile({
              realHeight: imgMeta.height,
              realWidth: imgMeta.width,
              html: `<img src="${pasteInputUrl}" />`,
              css: '',
              settings: '',
              url: pasteInputUrl
            }).then(function(){
              event.target.value = '';
              //$scope.imports = $filter('unique')(JSON.parse($window.localStorage.getItem('import')), 'url');
              $scope.imports = BreezeDataContext.getMyFiles();
              $scope.selectScreen = true;
            });
          });
        });
      }

      $scope.removeSelectScreenItem = function(idx){
        swal({
            title: "Remove",
            text: "Are you sure you want to delete this?",
            type: "warning",
            showCancelButton: true,
            animation: "slide-from-left",
            confirmButtonText: "Yes",
            cancelButtonText: "No",
            allowEscapeKey: false,
            allowOutsideClick: false
          }).then(function(isConfirm){
            if(isConfirm.value){
              BreezeDataContext.delElement($scope.imports[idx]);
              BreezeDataContext.syncFiles().then(function(){
                $timeout(function(){
                  $scope.imports = BreezeDataContext.getMyFiles();
                });
              });
            } else {
              return false;
            }
        });
      }

      $scope.showTutorial = false;
      $scope.showTutorial2 = !Boolean($window.localStorage.getItem('tutorial'));

      $scope.tutorial = function(){
        $window.localStorage.setItem('tutorial', true);
      }
      
      var accesstype = $location.$$path.substr($location.$$path.lastIndexOf('/') + 1);
      $scope.accesspoint = {type: accesstype, path: '/' + accesstype};
      
      if($routeParams.col)
        $scope.col = $routeParams.col;

      $scope.col = ($scope.col) ? $scope.col : 12;

      $scope.addWidget = function(widget){
        if(widget){
          
          if(!widget.hasOwnProperty('guid')){
            return BreezeDataContext.addNote(widget);
          }
        }
      };

      $scope.reload = function(){
        $window.location.reload();
      }

      $scope.renderWidgets = function(widgets){
        var deferred = $q.defer();
        $scope.notes = (widgets) ? widgets : BreezeDataContext.getMyNotes();
        deferred.resolve($scope.notes);
        return deferred.promise;
      }

      $scope.addRender = function(preset, is, cb){  
        var deferred = $q.defer();
        deferred.resolve($scope.addWidget(preset).then(function(wData){
          $scope.renderWidgets().then(function(){
            if(cb && typeof cb === "function") {
              cb(wData);
            }
          });
        }));
        $scope.apps = [];
        return deferred.promise;
      }

      $scope.gridsterOpts = {
            columns: $scope.col, 
            pushing: true,
            floating: true,
            width: 'auto',
            colWidth: 'auto',
            rowHeight: 'match', 
            margins: [10, 10],
            isMobile: false,
            minColumns: 1,
            minRows: 1,
            maxRows: 100,
            defaultSizeX: 2,
            defaultSizeY: 2,
            mobileBreakPoint: 600,
            mobileModeEnabled: false,
            avoid_overlapped_widgets: true,
            resizable: {
               enabled: false,
               //handles: ['e', 's', 'w', 'se', 'sw'],
               //handles: ($window.isPost) ? 'all' : 'none',
               handles: 'none',
               start: function(event, uiWidget, $element) {
               },
               resize: function(event, uiWidget, $element) {
                  $scope.$broadcast('busy', true);
               },
               stop: function(event, uiWidget, $element) {
                var index = $element.index();
                var itm = $scope.notes[index];
                var data = {
                  'sizeX': itm.sizeX,
                  'sizeY': itm.sizeY,
                  'realWidth': uiWidget.size.width,
                  'realHeight': uiWidget.size.height
                };
                $scope.save('resize', data, index);
               }
            },
            draggable: {
               enabled: true,
               start: function(event, uiWidget, $element) {
                 // add class 'drag-active' to body
                 classie.add( document.body, 'drag-active' );
                 // clear timeout: dropAreaTimeout (toggle drop area)
                 $timeout.cancel( $scope.dropAreaTimeout );
                 // show dropArea
                 classie.add( document.getElementById( 'drop-area' ), 'show' );
                 $scope.dropped = false;
                 $scope.$broadcast('grid.start', $element);
               },
               drag: function(event, uiWidget, $element) {
                  $scope.currentElementIndex = $element.index();
                  //$scope.showBottomTools = true;
                  $scope.$broadcast('busy', true);
               },
               stop: function(event, uiWidget, $element) {
                  //$scope.showBottomTools = false;
                  if($element.hasClass('stitched')){
                    var GridsterCtrl = angular.element('.gm-gridster').controller('gridster');
                    var gridsterItems = angular.element('.gm-gridster').find('*[gridster-item]');
                    gridsterItems.each(function (index, node) {
                      var itemCtrl = angular.element(node).controller('gridsterItem');
                      var mainCtrl = angular.element(node).controller('gridster');
                      GridsterCtrl.autoSetItemPosition(itemCtrl);
                    });
                  }
                  var index = $scope.currentElementIndex;
                  var itm = $scope.notes[index];
                    var data = {
                      'row': itm.row,
                      'col': itm.col
                    };

                      var afterDropFn = function() {
                        // hide dropArea
                        classie.remove( document.getElementById( 'drop-area' ), 'show' );
                        // remove class 'drag-active' from body
                        classie.remove( document.body, 'drag-active' );
                      };

                      if( !$scope.dropped ) {
                        afterDropFn();
                      }
                      else {
                        // after some time hide drop area and remove class 'drag-active' from body
                        $timeout.cancel( $scope.dropAreaTimeout );
                        $scope.dropAreaTimeout = $timeout( afterDropFn, 400 );
                      }

                      $scope.$broadcast('grid.stop', $element);
               }
            }
      }

          $scope.userplan = $window.localStorage.getItem('_plan');

          $scope.bottomToolButtons = ['code'];

          $scope.initDroppable = function(type, evt) {
            $scope.dropped = true;
                // show checkmark inside the droppabe element
                classie.add( evt.target, 'drop-feedback' );
                //classie.add( evt.target.firstChild, 'drop-feedback' );
                $timeout.cancel( $scope.checkmarkTimeout );
                $scope.checkmarkTimeout = $timeout( function() { 
                  classie.remove( evt.target, 'drop-feedback' );
                  evt.stopPropagation();
                }, 800 );

            if($window.localStorage.getItem('tk') > 0){
              switch(type) {
                case 'trash':
                  $rootScope.$broadcast('deleteMe', {'item': $scope.notes[$scope.currentElementIndex], 'index': $scope.currentElementIndex, 'confirm': true});
                break;
                case 'code':
                  $window.localStorage.setItem('LimeTextTarget', $scope.notes[$scope.currentElementIndex]['guid']);
                  $rootScope.$broadcast('addOneByGistId', 'bfac0df8ac88916c9dfff21ca20230b6');
                break;
                default:
                  console.log(type);
                break;
              }
            } else {
              $scope.payTokens('gold');
            }

            return false;
          }

      $scope.pushpin = function(item, event){
        if(event){
          event.stopPropagation();
            jQuery('.morphsearch-close').trigger('click');
        }
        if($window.localStorage.getItem('pinned')){
          var pins = $window.localStorage.getItem('pinned').split(',').concat([item]).filter(Boolean);
          pins = lodash.uniq(pins);
          $window.localStorage.setItem('pinned', pins.join(','));
        } else {
          $window.localStorage.setItem('pinned', item);
        }
        BreezeDataContext.getWidgetByGuidRemote(item).then(function(widget){
          WidgetSrvc.parseSettings(widget[0]).then(function(data){
            if(!data){
              return false;
            }
            $scope.pinned.push({
              'guid': item,
              'images': data.thumbnail,
              'title': data.title
            });
          });
        });
      }

      $scope.stringify = function(data){
        return JSON.stringify(data);
      }

      $scope.pinned = [];

      if(typeof $window.localStorage.getItem('pinned') === 'string'){
        var prelocal = $window.localStorage.getItem('pinned').split(',');
        angular.forEach(prelocal, function(guid){
          $scope.pushpin(guid);
        });
      }

      $scope.save = function(type,data,idx){
        switch(type){
          case 'html':
            $scope.notes[idx]['text'] = data;
          break;
          case 'css':
            $scope.notes[idx]['css'] = data;
          break;
          case 'js':
            $scope.notes[idx]['js'] = data;
          break;
          case 'settings':
            $scope.notes[idx]['settings'] = data;
          case 'resize':
            $scope.notes[idx]['sizeX'] = data.sizeX;
            $scope.notes[idx]['sizeY'] = data.sizeY;
            $scope.notes[idx]['realWidth'] = data.realWidth;
            $scope.notes[idx]['realHeight'] = data.realHeight;
          break;
          // case 'move':
          //   $scope.notes[idx]['row'] = data.row;
          //   $scope.notes[idx]['col'] = data.col;
          // break;
          case 'pinned':
            $scope.notes[idx].pinned = data.pinned;
          break;
          case 'all':
            $scope.notes[idx]['text'] = data.text;
            $scope.notes[idx]['css'] = data.css;
            $scope.notes[idx]['js'] = data.js;
            $scope.notes[idx]['settings'] = data.settings;
            $scope.notes[idx]['sizeX'] = data.sizeX;
            $scope.notes[idx]['sizeY'] = data.sizeY;
            $scope.notes[idx]['realWidth'] = data.realWidth;
            $scope.notes[idx]['realHeight'] = data.realHeight;
            $scope.notes[idx]['row'] = data.row;
            $scope.notes[idx]['col'] = data.col;
            $scope.notes[idx]['url'] = data.url;
            $scope.notes[idx]['active'] = data.active;
            $scope.notes[idx]['tags'] = data.tags;
            $scope.notes[idx]['owner'] = data.owner;
          break;
          case 'gist':
            $scope.notes[idx]['text'] = data.text;
            $scope.notes[idx]['css'] = data.css;
            $scope.notes[idx]['js'] = data.js;
          break;
        }

        if($scope.notes[idx]['active']){
          angular.copy($scope.notes[idx], BreezeDataContext.getFile($scope.notes[idx]['guid']))
          //angular.copy($scope.notes[idx], $scope.imports[$scope.fileWidgetIndex]);
        }

        return $q.all([
          BreezeDataContext.modElement($scope.notes[idx]),
          BreezeDataContext.modElement($scope.notes[idx]['guid'])
        ]);
      
      };

      $scope.settings = function(){
        $scope.showSettings = true;
      }

      $scope.getBackgroundPosition = function(){
        var pos = [
          'top left','top right','top center',
          'center left', 'center right',
          'bottom left', 'bottom center', 'bottom right'
        ];
        return pos[Math.floor(Math.random()*pos.length)];
      }

      // gif.com.ai store background grpahics system
        /* start gif shop */
      $scope.$watch('gifshop', function(){
          if($scope.gifshop){
            var cloudsBg = $interval(function(){
                angular.element('.clouds').css('background-position',$scope.getBackgroundPosition());
            },18000);
          } else {
            $interval.cancel(cloudsBg);
            if($scope.notes.length){
              $scope.payTokens('silver');
            }
          }
      });

    $scope.compileGalleryItem = function(item){

      $scope.sold = [];
          
      angular.forEach($scope.pinned, function(pin){
        $scope.sold.push(pin.guid);  
      });

      $('#cards').fadeOut('slow', function() {
          $('#cards').fadeIn('slow');
      });

      var isSold = $scope.sold.includes(item.guid);

      $scope.app = {
        'title': item.title,
        'images': item.images,
        'price': item.price,
        'guid': item.guid,
        'sold': isSold
      }
    }

    /*BreezeDataContext.getAllGifShopWidgets().then(function(widgets){
        
        Array.prototype.swapItems = function(a, b){
            this[a] = this.splice(b, 1, this[a])[0];
            return this;
        }

        Array.prototype.move = function(from, to) {
            this.splice(to, 0, this.splice(from, 1)[0]);
        };

        Array.prototype.insert = function ( index, item ) {
            this.splice( index, 0, item );
        };
        
        $scope.wdgts = widgets.results;
  
        
        var gallery_index = -1;

        function galleryNext(wait){
          gallery_index = (gallery_index + 1) % $scope.wdgts.length;
          $scope.currentGalleryItem = $scope.wdgts[gallery_index];
          $scope.compileGalleryItem($scope.currentGalleryItem);
        }

        galleryNext();
        
        timer = $interval(galleryNext, 12000);

        $scope.buyWidget = function(widget){
          if(parseInt($window.localStorage.getItem('tk')) > widget.price){
            $window.localStorage.setItem('tk', parseInt($window.localStorage.getItem('tk')) - widget.price);
            $scope.tokenAmount = $window.localStorage.getItem('tk');
            $scope.pushpin(widget.guid);
          } else {
            $scope.payTokens();
          }
        }
        
    });

    $scope.addWebtopClone = function(){
      var promises = [];
      $scope.selectedElements.forEach(function(element, index){
        angular.extend(element,
          {
            text: (() => element.text ? element.text : `<img src="${element.url}"/>`)(),
            active: true
          }
        )
        promises.push($scope.addWidget(element));
      });
      $q.all(promises).finally(function(){
        console.log('cloned elements to webtop for editing...');
      });
    }*/

        $scope.addLimeText = function(guid){
            $scope.gifCanvasSwitch = false;
            var finalNote =  BreezeDataContext.getFile(guid) ? 
              BreezeDataContext.getFile(guid) : 
              $scope.notes[$scope.notes.findIndex(x => x.guid == guid)];

            angular.extend(finalNote, 
              {
                text: (() => finalNote.text ? finalNote.text : `<img src="${finalNote.url}"/>`)(),
                css: (() => finalNote.css ? finalNote.css : ``)(),
                js: (() => finalNote.js ? finalNote.js : ``)(),
                settings: (() => finalNote.settings ? finalNote.settings : `{}`)(),
                active: true
              }
            )

            if(!BreezeDataContext.getMyNotes().length){
              $scope.addWidget(finalNote).then(function(result){
                $scope.renderWidgets().then(function(notes){
                  $scope.currentElementIndex = notes.length-1;
                  $window.localStorage.setItem('LimeTextTarget', notes[$scope.currentElementIndex]['guid']);
                  $rootScope.$broadcast('addOneByGistId', 'bfac0df8ac88916c9dfff21ca20230b6');
                });
              });
            } else if($window.localStorage.getItem('LimeTextTarget')) {
              $scope.renderWidgets().then(function(notes){
                $scope.currentElementIndex = notes.length-1;
                $rootScope.$broadcast('addOneByGistId', 'bfac0df8ac88916c9dfff21ca20230b6');
              })
            }
        }

        $scope.menuOptions = [
          {
              text: 'Edit in LimeText™',
              click: function (itemScope, event) {
                $scope.addLimeText($(event.target).data('guid'));
              },
              hasBottomDivider: true
          },
          {
              text: 'Move to front',
              click: function (itemScope, event) {
                var $zTarget = $(event.target);
                $zTarget.zIndex(2);
                $zTarget.siblings().zIndex(1);
              },
              hasTopDivider: true
          },
          {
              text: 'Move to back',
              click: function (itemScope, event) {
                var $zTarget = $(event.target);
                $zTarget.zIndex(1);
                $zTarget.siblings().zIndex(2);
              }
          }
        ];

        $scope.payTokens = function(type, ev){
          if(ev){
            ev.stopPropagation();
          }
          WidgetSrvc.payTokens(type).then(function(path){
            if(path){
              var url = `https://gif.com.ai/plan?type=${type}`;
              $window.location.href = url;
            }
          });
        }

        /* end gif shop */

      // end gif.com.ai addons

      $scope.addImage = function(image){
        if(image){
          BreezeDataContext.addImage({
            link: image.link,
            size: image.size,
            height: image.height,
            width: image.width,
            title: image.title
          }).then(function(img){
                BreezeDataContext.syncImages().then(function(data){
                  var url = 'http://imgur.com/' + image.id;
                  console.log(url);
                  $window.location.href = url;
                });
              });
        }
      }

      $scope.execWidget = function(newWidget){
        try {
          eval($sce.trustAsJs(newWidget.js).toString());
        } catch(e){
          console.log('error below...');
          console.log(e);    
        }
      };

      $scope.deleteWidget = function(widget, idx){
        widget['index'] = idx;
        WidgetSrvc.removeCss(idx);
        BreezeDataContext.getWidgetByGuid(widget.guid).then(function(data){
          BreezeDataContext.delElement(data[0]);
          $scope.save('all', widget, idx);
        });
      };

      $scope.googleAnalytics = function(...analytics){
        ga(analytics);
      }
      
      $scope.bouncetype = 'zerogravity';
      $scope.doEvent = true;

      $scope.removeFromSearch = function(idx){
        swal({
          title: 'Remove?',
          text: 'This widget will be removed from the bar immediately',   
          type: 'warning',
          showCancelButton: true,
          allowOutsideClick: true
        }).then(function(isConfirm){
          if(isConfirm){
            $scope.pinned.splice(idx, 1);
            var newpins = '';
            angular.forEach($scope.pinned, function(pin){
              newpins += pin.guid + ',';
            });
            $window.localStorage.setItem('pinned', newpins);
          } else {
            return false;
          }
        }).done();
      }

      $scope.getDataUri = function (targetUrl, callback) {
          var xhr = new XMLHttpRequest();
              xhr.onload = function () {
                  var reader = new FileReader();
                  reader.onloadend = function () {
                      callback(reader.result);
                  };
                  reader.readAsDataURL(xhr.response);
              };
          try {
              $window.atob(targetUrl.replace(/^data:image\/(png|jpg|gif);base64,/, ""));
              callback(targetUrl);
          } catch(e) {
              var proxyUrl = 'https://cors.bridged.cc/';
              //var proxyUrl = 'https://cors-anywhere.herokuapp.com/';
              //var proxyUrl = 'https://secret-ocean-49799.herokuapp.com/';
              //var proxyUrl = 'https://api.codetabs.com/v1/proxy/';
              xhr.open('GET', proxyUrl + targetUrl);
              xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
              xhr.responseType = 'blob';
              xhr.send();
          }
      };

      /* Gif Canvas Controls */
      $scope.addCanvasSelectors = function($selector, guid, notes){
        var tempGuid = guid;
        return $selector
          .draggable({
            containment: "parent",
            zIndex: 999999
          })
          .css({'position':'absolute','z-index':'1', 'margin':'0','padding':'0'})
          .dblclick(function(event, ui){
            $scope.resizeIt(event, ui)
          })
          //.mousewheel((event, ui) => $scope.changeLayers(event))
          .attr(
            {
              'context-menu': 'menuOptions', 
              'data-guid': tempGuid
            }
          );
      }

      $scope.resizeIt = function(event, ui) {

        //let resizeTimer;

        $timeout(function(){
          $('.ui-wrapper').zIndex(9999999999);
        });

        $(event.target)
          .resizable({
            aspectRatio: true,
            handles: 'se',
            stop: function() {
              $(event.target).resizable('destroy');
            }
        })
        .on('click', function(event, ui){
          $(event.target).resizable("destroy");
        });
      }

      $scope.$watch(
          function () {
              return $window.fixFreeze
          }, function(n,o){
            if($window.fixFreeze === true){
              $timeout(function() {
                angular.element('#exitBtn').triggerHandler('click');
                swal({
                    title: "Bad Piece!",
                    text: "Right-click on the element to remove it from the canvas.",
                    type: "error",
                    showCancelButton: false,
                    allowOutsideClick: true,
                    animation: "slide-from-top",
                    allowEscapeKey: true,
                    confirmButtonText: "Thanks"
                  }).then(function(isConfirm){
                    if(isConfirm){
                      $window.fixFreeze = false;
                    } else {
                      return;
                    }
                  });
              }, 0);
            }
          }
      );
      /*  End Gif Canvas Controls */

      $scope.$on('delete', function(scope){
        var target = scope.targetScope;
        $scope.guids = WidgetSrvc.getGuids($scope.notes);
        target.$destroy();
        target.deleteWidget(target.notes[target.$index], target.$index);
        WidgetSrvc.delete(target.notes, target.$index);
      });

      $scope.$on('grid.start', function(){
        $('.gifcomai_footer').hide();
      });

      $scope.$on('grid.stop', function(){
        $('.gifcomai_footer').fadeIn(600);
      });

      $rootScope.$on('addOneByGuid', function(event, data){
        BreezeDataContext.getWidgetByGuidRemote(data).then(function(widget){
          $scope.addWidget(widget[0]).then(function(result){
            $scope.renderWidgets();
          });
        });
      });

      $rootScope.$on('addOneByGistId', function(event, payloadA){
        BreezeDataContext.getGistById(payloadA).then(function(payloadB){
          let data = payloadB['data'];
          let widget = {
            'text': data.files["main.html"].content,
            'css': data.files["main.css"].content,
            'js': data.files["main.js"].content,
            'settings': data.files["settings.json"].content,
            'sizeX': 1,
            'sizeY': 1,
            'row': 1,
            'col': 1,
            'searchable': true,
            'price': 0,
            'active': false
          };
          $scope.addWidget(widget).then(function(result){
            $scope.renderWidgets().then(function(notes){
              $scope.execWidget(notes[notes.length-1]);
            });
          });
        });
      });

      $scope.getSearched = function(input){
        BreezeDataContext.getSearchedWidgets(input).then(function(widgets){
          $scope.apps = widgets;
          var results = $scope.apps.results;
          var promise = $q.all([]);
          angular.forEach(results, function(item){
            promise = promise.then(function (data) {
                return $timeout(function () {
                  WidgetSrvc.parseSettings(item).then(function(data){
                    console.log('running parse settings');
                    if(!data){
                      return false;
                    }
                    if(data.hasOwnProperty('thumbnail'))
                      angular.extend(item, {'images': data.thumbnail});
                    if(data.hasOwnProperty('title'))
                      angular.extend(item, {'title': data.title});
                  });
                });
            });
          });

          promise.finally(function () {
            console.log('parse settings chain finished!');
          });

        });
      };

      $timeout(function(){
        jQuery('#demo-menu-top-right, .btm-controls').addClass('fadeout');
      }, 4000);


    if($routeParams.add){
       
        var sids = $routeParams.add.split(',');
        $rootScope.$broadcast('addOneByGuid', sids[0]);
      
    }

}]).

directive('search', ['$compile', '$timeout', 'BreezeDataContext', 'WidgetSrvc', function($compile, $timeout, BreezeDataContext, WidgetSrvc){
  return {
    restrict: 'E',
    transclude: false,
    scope: true,
    compile: function(element, attributes){
      return {
        pre: function(scope, element, attributes, controller, transcludeFn){
          WidgetSrvc.execSearch();
        },
        post: function(scope, element, attributes, controller, transcludeFn){
          scope.$watch('search', function(val, oldVal){
            if(val)
              scope.getSearched(val);
          });
        }
      }
    },
    link: function(scope, $element){
      // nothing to see here
    }
  }
}]).

directive('editor', ['$compile', '$rootScope', '$window', '$document', '$filter', '$sce', '$timeout', '$ocLazyLoad', '$cacheFactory', 'WidgetSrvc', function($compile, $rootScope, $window, $document, $filter, $sce, $timeout, $ocLazyLoad, $cacheFactory, WidgetSrvc) {
  return {
    restrict:  'A',
    replace: false,
    transclude: true,
    scope: true,
    controller: function(){},
    require: '^gridster',
    link: function($scope, $element, attr, ctrl){

      $scope.$on('destroy', function(){
        $scope.delete();
      });

      WidgetSrvc.parseSettings($scope.notes[$scope.$index]).then(function(data){
          if(!data){
            return false;
          }
          if(data.hasOwnProperty('thumbnail')){
            $scope.notes[$scope.$index].images = data.thumbnail;
          }
          if(data.hasOwnProperty('include')){
            for (var i = data.include.length - 1; i >= 0; i--) {
                $rootScope.$broadcast('addOneByGuid', data.include[i]);
            };
          }
          if(data.hasOwnProperty('title')){
             $scope.notes[$scope.$index].title = data.title;
          }
          if(data.hasOwnProperty('sizeX')){
            $scope.notes[$scope.$index].sizeX = data.sizeX;
          }
          if(data.hasOwnProperty('sizeY')){
             $scope.notes[$scope.$index].sizeY = data.sizeY;
          }
          if(data.hasOwnProperty('price')){
             $scope.notes[$scope.$index].price = data.price;
          }
          if(data.hasOwnProperty('inactive')){
            if(data.inactive){
              $rootScope.$broadcast('deleteMe', {'item': $scope.notes[$scope.$index], 'index': $scope.$index, 'confirm': false});
            }
          }
      });

      var tmp;
      tmp = 'preview.html';

      var colNum = ctrl.pixelsToColumns($scope.notes[$scope.$index].realWidth, 'ceil');
      var rowNum = ctrl.pixelsToRows($scope.notes[$scope.$index].realHeight, 'ceil');
      $scope.notes[$scope.$index].sizeX = colNum;
      $scope.notes[$scope.$index].sizeY = rowNum;
      
      $scope.mode = 'widget';
      $scope.renderMode = 'widget';
      WidgetSrvc.appendCss($sce.trustAsCss($scope.notes[$scope.$index].css), $scope.$index);
      $scope.trustedHtml = $sce.trustAsHtml($scope.notes[$scope.$index].text);
      
      $scope.tmp = 'preview.html';

      WidgetSrvc.gridster = ctrl;
      WidgetSrvc.setScope($scope);

      $scope.busy = false;
      $scope.scopes = [];

      var widget = angular.element('<div class="widget-wrap">' +
        '<div class="wframe"><div ng-include src="::tmp"></div></div>');

      $element.append(widget);
      $compile(widget)($scope);

      angular.element('.forkme').hide();

      $scope.guid = $scope.item.guid;

      var clone = false;

      var gridBtns = $element.find('.gridBtns');

      gridBtns.hide();

      $scope.$on('busy', function(e,d){
        $scope.busy = d;
      });

      $scope.move = function(e){
        gridBtns.hide();
      }

      $scope.deleteMe = function(itm, idx, confirm, callback){
        if(confirm){
          swal({
            title: "Remove",
            text: "Are you sure you want to delete this?",
            type: "warning",
            showCancelButton: true,
            animation: "slide-from-left",
            confirmButtonText: "Yes",
            cancelButtonText: "No",
            allowEscapeKey: false,
            allowOutsideClick: false
          }).then(function(isConfirm){
            if(isConfirm.value){
              $scope.deleteMeNow(itm, idx, callback);
            } else {
              return false;
            }
          });
        } else {
          $scope.deleteMeNow(itm, idx, callback);
        }
      }

      $scope.deleteMeNow = function(itm, idx, callback){
        $scope.deleteWidget(itm, idx);
        $scope.$emit('delete', $scope);
        if(callback){
          callback();
        }
      }

      $rootScope.$on('deleteMe', function(evt, opt){
        if($scope.$index == opt.index) {
          $scope.deleteMe(opt.item, opt.index, opt.confirm);
        }
      });

      $rootScope.$on('exec', function(){
        if(typeof $scope.notes[$scope.$index] != 'undefined'){
          if($element.hasClass('edit')){
            $element.removeClass('edit');
          } else {
            $scope.mode = 'widget';
            $scope.tmp = 'preview.html';
          }
        }
      });
    }
  }
}]).

directive('gridControls', ['$timeout', function($timeout){
  return {
    restrict: "A",
    link: function(scope, elem, attrs){
      
      // graph drag handler movement cursor

          var isDragging = false;
            elem
            .mousedown(function(evt) {
              if(!$('.rotatingblock').hasClass('clicked'))
                $('.rotatingblock').toggleClass('clicked');
              if(evt.target != evt.currentTarget){
                evt.stopPropagation();
                return;
              }
                
            })
            .mouseup(function() {
                var wasDragging = isDragging;
                isDragging = false;
                $('.rotatingblock').toggleClass('clicked');
            });
            $(document).mousemove(function(event){
              // origin lines
              var posX = event.pageX;
              var posY = event.pageY;
              $('.block').css({
                'top': posY - $('.horizontalstripe').height()/2 -8,
                'left': posX -  $('.verticalstripe').width()/2 -8
              });
              $('.horizontalstripe').css('top', posY - $('.horizontalstripe').height()/2);
              $('.verticalstripe').css('left', posX - $('.verticalstripe').width()/2);
            });
      }
  }
}]).

directive('ngRightClick', ['$parse', function($parse) {
    return function(scope, element, attrs) {
        var fn = $parse(attrs.ngRightClick);
        element.bind('contextmenu', function(event) {
            scope.$apply(function() {
                event.preventDefault();
                fn(scope, {$event:event});
            });
        });
    };
}]).

directive('ngMobileClick', [function () {
    return function (scope, elem, attrs) {
       
        elem.bind('touchend mouseup', function (e) {
          e.preventDefault();
          e.stopPropagation();

          scope.$apply(attrs['ngMobileClick'])
        });
    }
}]).

directive('compileTemplate', ['$compile', '$parse', function($compile, $parse){
    return {
        link: function(scope, element, attr){
            var parsed = $parse(attr.ngBindHtml);
            function getStringValue() { return (parsed(scope) || '').toString(); }

            scope.$watch(getStringValue, function() {
                $compile(element, null, -9999)(scope);
            }, true);

        }
    }
}]).

directive('backgroundMover', ['$timeout', function($timeout){
  return {
    restrict: "A",
    link: function(scope, elem, attrs){
      // graph drag handler
          var isDragging = false;
            elem
            .mousedown(function(evt) {
              if(evt.target != evt.currentTarget){
                evt.stopPropagation();
                return;
              }
                elem.mousemove(function(evt) {
                    isDragging = true;
                    elem.css({backgroundPosition: evt.pageX + 'px ' + evt.pageY + 'px' });
                });
            })
            .mouseup(function() {
                var wasDragging = isDragging;
                isDragging = false;
                $(elem).unbind("mousemove");
            });
    }
  }
}]).

directive('gifcanvas', ['$q', '$window', '$http', '$rootScope', '$timeout', '$interval', '$compile', 'giftop', 'deviceDetector', 'BreezeDataContext', function($q, $window, $http, $rootScope, $timeout, $interval, $compile, giftop, deviceDetector, BreezeDataContext){
  return {
    restrict: 'A',
    scope: true,
    link: function(scope, elem, attrs){

      scope.setCnvBg = function() {
        $('#gifcanvas').removeClass('watermark');
      }

      scope.resetGifCanvas = function(cb) {
        $('img#config,img#play,img#stop').hide();
        $('img#record').show().addClass('enabled').removeClass('disabled').on('click', () => $('#exitBtn').hide());
        $('#status').text('ready');
              cb();
      }

      scope.getGifAsCanvas = function(uri, imgtag){
        return new Promise((resolve, reject) => {
          var supergif = new SuperGif({ gif: imgtag });
          supergif.load(function(){
            var gifCanvasEl = $(supergif.get_canvas()).addClass('anic');
            resolve(gifCanvasEl);
          });
        });
      }

      scope.isLast = {
        check: false,
        it: 0
      }

      scope.makeGifCanvas = function(obj, last){
          return new Promise((resolve, reject) => {
              var tag = obj.data.get(0);
              if(obj.type == 'image' && tag.nodeType == 1){
                  scope.getDataUri(tag.src, function (base64) {
                      // base64 availlable here
                      var img = new Image;
                      img.crossOrigin = "Anonymous";
                      var canvas = document.createElement("canvas"),
                          ctx = canvas.getContext("2d"),
                          src =  base64;

                      img.src = src;
                      // make sure the load event fires for cached images too
                      if ( img.complete || img.complete === undefined ) {
                          img.src = src;
                      }
                      img.onload = function() {
                          canvas.width = img.width;
                          canvas.height = img.height;
                          ctx.drawImage( img, 0, 0 );
                          tag.src = img.src;
                          giftop.getBase64FromUrl(src)
                              .then(result => {

                                  //// TODO: Continue integrating gify js to count frames in individual gifs
                                  //var gifInfo = gify.getInfo(Uint8Array.from(atob(result), c => c.charCodeAt(0)));
                                  
                                  if(giftop.base64MimeType(result.img) == 'image/gif'){
                                      t1 = performance.now();
                                      console.log("Call took " + (t1 - t0) + " milliseconds.");
                                      resolve({'data':result,'type':'gif'});
                                  } else {
                                      resolve({'data':result,'type':'default'});
                                  }
                              })
                                  .catch(err => console.error(err));
                      }
                  });
              }
          })
      }


      scope.share = function(img){
        swal({
          title: "Gif Title",
          text: "when your ready click done",
          input: "text",
          showCancelButton: false,
          allowOutsideClick: false,
          animation: "slide-from-bottom",
          inputPlaceholder: "enter title here",
          allowEscapeKey: false,
          confirmButtonText: "Done"
        }).then(function(result){
          $('#record').removeClass('enabled').addClass('disabled');
          $('#status').text('finalizing');
          $.ajax({
              url: 'https://api.imgur.com/3/upload.json',
              type: 'POST',
              headers: {
                  Authorization: 'Client-ID 797f0be369944e6'
              },
              data: {
                  type: 'base64',
                  name: 'qk.gif',
                  title: result.value,
                  description: 'Source: ' + deviceDetector.browser + ' using https:\/\/gif.com.ai',
                  image: img
              },
              dataType: 'json'
          }).success(function(data) {
              scope.addImage(data.data);
          }).error(function() {
              scope.resetGifCanvas(() => alert('Your gif is too heavy! Try again with a smaller canvas area.'));
          });
        });
      }

      scope.compileToCanvas = function(media, guid){
        $compile($('#gifcanvas')
          //.html($(scope.gifIds.join(','))
          .append(media)
          //.html(media)
          .contents()
          .css({'max-width':'100%', 'max-height':'100%'})
          //.children()
          .draggable({
            containment: 'parent',
            stop: ( event, ui) => {
              if(!scope.tokenAmount){
                if(Math.random() < 0.15) {
                  scope.payTokens('bronze');
                }
                $(event.target).addClass('ui-state-disabled'); 
              }
            }
        })
        .dblclick((event, ui) => scope.resizeIt(event, ui))
        .attr({'context-menu': 'menuOptions', 'data-guid': guid || $(this).attr('data-guid')})
        .zIndex(1)
        )(scope);
        $('a').click(function() { return false; }); // disable pointer-events on anchor tags in canvas
        if(!$('#anigif_wrapper').hasClass('anigif_wrapper') && !$window.gifctrl){
          $('#anigif_wrapper').addClass('anigif_wrapper').attr('style', '');
          $window.gifctrl = $('#anigif_wrapper').detach();
          $('#gifheadline').before($window.gifctrl);
        } else {
          $('#gifheadline').before($window.gifctrl);
        }
      }

      scope.parseGifGfx = function(gifMedia, resolve){
          if(!gifMedia.length){
              gifMedia = $([]);
            }
            var promiseB = $q.all(gifMedia);
            var srcData;
            t0 = performance.now();
            if(gifMedia.length){
              scope.hideCanvasOverlay = false;
              angular.forEach(gifMedia, function(data, i, more){
                //data = $(data).clone();
                var videoSource = function(){
                    var theHref = $(data).attr('src') || '';
                    if($(data).is('video') && theHref.length){
                        return $(data);
                    } else {
                        var source = $(data).find('> source');
                        var newSrc = source.attr('src');
                        $(data).attr('src', newSrc);
                        return $(data);
                    }
                }

                srcData = $(data).is('video') ?
                    {
                        type: 'video',
                        data: videoSource()
                    } :
                    {
                        type: 'image',
                        data: $(data)
                    };
                promiseB = scope.makeGifCanvas(srcData).then(function(file){
                    scope.isLast.it++;
                    scope.isLast.check = (scope.isLast.it == more.length);
                    if(file.type == 'gif'){
                        return scope.getGifAsCanvas(file.data, $(data).get(0)).then(function(dta){
                          $(dta).closest('.jsgif').replaceWith(function() {
                            var newCanvas = $(dta).closest('.anic');
                            //nawCanvas = scope.addCanvasSelectors(newCanvas.parent());
                            nawCanvas = (scope.notes.length) ? 
                              scope.addCanvasSelectors(newCanvas, scope.notes[0]['guid']) : 
                              scope.addCanvasSelectors(newCanvas, scope.selectedElements[0]['guid']);
                            return $(newCanvas, this);
                          });
                          console.log($(dta).outerHTML);
                          $compile($(dta))(scope);
                            if(scope.isLast.check){
                              scope.$apply(function(){
                                scope.hideCanvasOverlay = true;
                                $('#anigif_wrapper,#gifheadline').css('display','block');
                              });
                            }
                        })
                    } else {
                        if(scope.isLast.check){
                          scope.$apply(function(){
                                scope.hideCanvasOverlay = true;
                                $('#anigif_wrapper,#gifheadline').css('display','block');
                              });
                        }
                    }
                });
              });

              promiseB.then(function(file) {
                console.log('parsing gif finished! Moving on...');
                if(scope.isLast.check || !gifMedia.length){
                    scope.hideCanvasOverlay = true;
                    $('#anigif_wrapper,#gifheadline').css('display','block');
                }
              });
              
            }

            resolve(gifMedia);
      }

      /* end on scope functions */

      scope.startIt = function(){
        if(!scope.notes.length){
            var allHTMLArr = scope.selectedElements.map(x => x.text ? `${x.text}` : `<img src="${x.url}" data-guid="${x.guid}" />`).join('');
            scope.parseGifGfx($($.parseHTML(allHTMLArr)), function(gifMedia){
              Array.from(gifMedia).forEach(function(tag, index, arr){
                if(tag.tagName != undefined){
                  scope.compileToCanvas($(tag), $window.localStorage.getItem('LimeTextTarget'));
                }
              });
            });
        } else {
          var allHTMLArr = scope.notes.map(x => `${x.text}`).join('');
          scope.parseGifGfx($($.parseHTML(allHTMLArr)), function(gifMedia){
            Array.from(gifMedia).forEach(function(tag, index, arr){
              if(tag.tagName != undefined){
                scope.compileToCanvas($(tag), $window.localStorage.getItem('LimeTextTarget'));
              }
              if(index === arr.length - 1){
                $timeout(function(){
                  scope.hideCanvasOverlay = true;
                }, 3500);
              }
            });
          });
        }
      }

      if(scope.tokenAmount) {
        scope.setCnvBg();
      }
      
      var recInterval;
      $rootScope.$on('anigif', function(eventdata, status){
        if(status == 'start'){
          $('#exitBtn').hide();
          $('img.crosshair').hide();
          $('img#record').hide();
          $('img#stop').show();
          $('#mainbox > *').position().left - 2 + "px";
          $('#mainbox > *').position().top + 2 + "px";
          //// re-introduce if making gif recording a paid service --->
          recInterval = $interval(function(){
            if($window.localStorage.getItem('tk') > 0){
              $window.localStorage.setItem('tk', parseInt($window.localStorage.getItem('tk')) - 1);
              scope.tokenAmount = $window.localStorage.getIem('tk');
            }
          },1000);
        }
        //if(status == 'done' && LS.getData() > 0){
        if(status == 'done'){
          $('#exitBtn').show();
          $interval.cancel(recInterval);
          recInterval = undefined;
          $rootScope.$broadcast('gifRecordDone');
          giftop.getBase64FromUrl($window.anigif.img)
            .then(result => {
                if(!result.size.valid) {
                  scope.resetGifCanvas(() => alert('Your gif is too large! Please try again...'));
                } else {
                  scope.share(result.img.replace(/^data:image\/(png|jpg|gif);base64,/, ""))
                }
             })
            .catch(err => console.error(err));
        }
      });

      $window.addEventListener('message', function(event) {
        console.log(event.data);
        // We only accept messages from ourselves
        if (event.source != $window)
          return;
        if (event.data.type && (event.data.type == 'anirecord')) {
          switch(event.data.key) {
            case "start":
              $rootScope.$broadcast('anigif', 'start');
                break;
            case "stop":
              $rootScope.$broadcast('anigif', 'done');
                break;
            default:
              return;
                break;
          }
        }
      }, false);

      scope.resetGifCanvas(() => { 
        scope.startIt();
        console.log('gif controls ready...')
      });

      scope.$watch('gifCanvasSwitch', function(oldValue, newValue){
          if(scope.selectScreen){
            scope.startIt();
            BreezeDataContext.clearCachedNotes();
          }
      });

    } // end link
  } //end return
}]).

directive('watermark', ['WidgetSrvc', function(WidgetSrvc){
  return {
    restrict:  'A',
    replace: false,
    transclude: false,
    scope: true,
    link: function($scope, $element, attr, ctrl){
      var setBackground = function() {

        var marktext = "gif.com.ai";
        var svgstring = '<svg id="diagtext" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><pattern id="marktext" patternUnits="userSpaceOnUse" width="150" height="125"><text y="30" fill="white" font-size="24" id="name" font-family="Comic Sans MS,cursive" opacity="0.175" class="textStyle">' + marktext + '</text></pattern>      <pattern id="combo" xlink:href="#marktext" patternTransform="rotate(-15)" /></defs><rect width="100%" height="100%" fill="url(#combo)" /></svg>';

        var customform = document.getElementsByClassName("watermark");
        var i;
        for (i = 0; i < customform.length; i++) {
          customform[i].style.backgroundImage = "url('data:image/svg+xml;base64,"+window.btoa(svgstring)+"')";
        }    
      }
      setBackground();
    }
  }
}]).

directive('file', ['$q', function($q) {
    return {
        require:"ngModel",
        restrict: 'A',
        link: function($scope, el, attrs, ngModel){
            el.bind('change', function(event){
                var files = event.target.files;
                var file = files[0];

                ngModel.$setViewValue(file);
                $scope.$apply();
            });
        }
    };
}]).

factory('giftop', ['$q', function($q){
  async function getBase64FromUrl(file) {
    var res = await fetch(file);
    var blob = await res.blob();

    return new Promise((resolve, reject) => {
      var reader  = new FileReader();
      reader.addEventListener("load", function () {
          resolve({
            img: reader.result,
            size: {
              byte: blob.size,
              valid: blob.size < 10000000
            } 
          });
      }, false);

      reader.onerror = () => {
        return reject(this);
      };
      reader.readAsDataURL(blob);
    })
  };
  function base64MimeType(encoded) {
    var result = null;

    if (typeof encoded !== 'string') {
      return result;
    }

    var mime = encoded.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/);

    if (mime && mime.length) {
      result = mime[1];
    }

    return result;
  };
  function createVideoTag(source){
    var videlem = document.createElement("video");
    /// ... some setup like poster image, size, position etc. goes here...
    /// now, add sources:
    var sourceMP4 = document.createElement("source"); 
    sourceMP4.type = "video/mp4";
    sourceMP4.src = source;
    videlem.appendChild(sourceMP4);
    //// same approach add ogg/ogv and webm sources
    return videlem;
  }

  function resetCursor(selector){
      selector.css('cursor', 'default').unbind('click');        
  }

  return {
    getBase64FromUrl: getBase64FromUrl,
    base64MimeType: base64MimeType,
    createVideoTag: createVideoTag,
    //isCanvasBlank: isCanvasBlank,
    resetCursor: resetCursor
  };

}]).

factory('WidgetSrvc', ['$q', '$window', '$timeout', '$rootScope', '$http', '$filter', '$ocLazyLoad', function($q, $window, $timeout, $rootScope, $http, $filter, $ocLazyLoad) {
    return {
        post: function(type, send){
          var deferred = $q.defer();
          deferred.resolve($http.post(type, send));
          return deferred.promise;
        },
        form: function(path, params, method){
            method = method || "post"; // Set method to post by default if n`ot specified.

            // The rest of this code assumes you are not using a library.
            // It can be made less wordy if you use one.
            var form = document.createElement("form");
            form.setAttribute("method", method);
            form.setAttribute("action", path);
            form.setAttribute("target", "_self");

            for(var key in params) {
                if(params.hasOwnProperty(key)) {
                    var hiddenField = document.createElement("input");
                    hiddenField.setAttribute("type", "hidden");
                    hiddenField.setAttribute("name", key);
                    hiddenField.setAttribute("value", params[key]);

                    form.appendChild(hiddenField);
                 }
            }

            document.body.appendChild(form);
            form.submit();
        },
        duplicate: function(orig, copy, index){
          if(orig){
            //this.holder(orig, 'duplicated');
            orig.push(copy[index]);
          }
        },
        mirror: function(orig, copy, index){
          if(copy){
            for (var i = orig.length - 1; i >= 0; i--) {
              orig[i].widget = copy[index].widget;
            };
          }
        },
        delete: function(obj, index){
          var deferred = $q.defer();
          if(obj){
            //this.holder(obj, 'deleted');
            deferred.resolve(obj.splice(index, 1));
            return deferred.promise;
          }
        },
        appendCss: function(css, idx){
          if(css && !document.getElementById('widgetcss' + idx)){
            css = css,
            head = document.head || document.getElementsByTagName('head')[0],
            style = document.createElement('style');
            style.type = 'text/css';
            style.id = 'widgetcss' + idx;
            if (style.styleSheet){
              style.styleSheet.cssText = css;
            } else {
              style.appendChild(document.createTextNode(css));
            }

            head.appendChild(style);
          } else if(css){
            document.getElementById('widgetcss' + idx).textContent = css;
          }
        },
        removeCss: function(idx){
          angular.element('#widgetcss'+idx).remove();
        },
        reloadStylesheets: function(){
          var queryString = '?reload=' + new Date().getTime();
          $('link[rel="stylesheet"]').each(function () {
              this.href = this.href.replace(/\?.*|$/, queryString);
          });
        },
        execSearch: function(){
            var morphSearch = document.getElementById( 'morphsearch' ),
              input = morphSearch.querySelector( 'input.morphsearch-input' ),
              ctrlClose = morphSearch.querySelector( 'span.morphsearch-close' ),
              isOpen = isAnimating = false,
              toggleSearch = function(evt) {
                if( evt.type.toLowerCase() === 'focus' && isOpen ) return false;

                if( isOpen ) {
                  classie.remove( morphSearch, 'open' );

                  if( input.value !== '' ) {
                      classie.add( morphSearch, 'hideInput' );
                      $timeout(function() {
                        classie.remove( morphSearch, 'hideInput' );
                        input.value = '';
                      });
                  }
                  
                  input.blur();
                }
                else {
                  classie.add( morphSearch, 'open' );
                }
                isOpen = !isOpen;
              };

            input.addEventListener( 'focus', toggleSearch );
            ctrlClose.addEventListener( 'click', toggleSearch );
        },
        make: function(objs){

          var clone = true;
          var c = [];

          angular.forEach(objs, function(ent){
            var es = ent.entityAspect.entityState;
            if(clone && (!es.isDeleted()) || $scope.found){
              c.push(ent);
            } else if(!clone && !es.isDeleted() && !ent.clone){
              c.push(ent);
            }
          });

          return c;

        },
        selectElementContents: function(el) {
          var range = document.createRange();
          range.selectNodeContents(el);
          var sel = window.getSelection();
          sel.removeAllRanges();
          sel.addRange(range);
        },
        setEditorLineNumber: function(line){
          this.editorLineNumber = line;
        },
        getEditorLineNumber: function(){
          return this.editorLineNumber;
        },
        gridster: null,
        getScope: function(scope){
          return this.scope;
        },
        setScope: function(scope){
          this.scope = scope;
        },
        parseSettings: function(note){
          var deferred = $q.defer();
          try {
            
            var settings = (new Function("return " + note.settings))();
            deferred.resolve(settings);

          } catch(e){
            console.log(e, 'cannot parse settings!');
          }
          return deferred.promise;
        },
        broadcasting: null,
        getGuids: function(notes){
          arr = [];
          for (var i = notes.length - 1; i >= 0; i--) {
            arr.push(notes[i]['guid']);
          };
          return arr;
        },
        getAttrIndex: function(array, attr, value){
          for(var i = 0; i < array.length; i++) {
              if(array[i].hasOwnProperty(attr) && array[i][attr] === value) {
                  return i;
              }
          }
          return -1;
        },
        getEvents: function(){
          return Object.getOwnPropertyNames(document)
            .concat(Object.getOwnPropertyNames(Object.getPrototypeOf(Object.getPrototypeOf(document))))
            .concat(Object.getOwnPropertyNames(Object.getPrototypeOf(window)))
            .filter(function(i){return !i.indexOf('on')&&(document[i]==null||typeof document[i]=='function');})
            .filter(function(elem, pos, self){return self.indexOf(elem) == pos;})
        },
        genRandomId: function(N){
          Array(N).join().split(',').map(function(s) { return s.charAt(Math.floor(Math.random() * s.length)); }).join('');
        },
        isJson: function(str){
          try {
              JSON.parse(str);
          } catch (e) {
              return false;
          }
          return true;
        },
        chunk: function chunk(arr, chunkSize) {
          var R = [];
          for (var i=0,len=arr.length; i<len; i+=chunkSize)
            R.push(arr.slice(i,i+chunkSize));
          return R;
        },
        storeBase64Imgur: function(fed, width, height){

          var deferred = $q.defer();

          var rawdata = fed.replace(/^data:image\/(png|jpg|gif|jpeg|svg);base64,/, "");
          var filetype = fed.substring(fed.indexOf(":")+1, fed.indexOf(";")).split('/')[1];

          $.ajax({
              url: 'https://api.imgur.com/3/upload.json',
              type: 'POST',
              headers: {
                  Authorization: 'Client-ID 797f0be369944e6'
              },
              data: {
                  type: 'base64',
                  name: 'base.' + filetype,
                  title: '',
                  description: 'Source: https:\/\/gif.com.ai',
                  image: rawdata
              },
              dataType: 'json'
          }).success(function(data) {
            data = arguments[0].data;
            deferred.resolve({
              'link': data.link,
              'width': data.width,
              'height': data.height
            });
          }).error(function(error) {
            console.log(error);
          });
          return deferred.promise;
        },
        getMetaFromUrl: function(url){
          let deferred = $q.defer();
          let img = new Image();
          img.onload = function(){
            let newObj = (({height, width}) => ({height, width}))(this);
            console.log(newObj);
            deferred.resolve(newObj);  
          };
          img.src = url;
          return deferred.promise;
        },
        video2gif: function(width, height, videos){
          var deferred = $q.defer();
          gifshot.createGIF({
              gifWidth: width,
              gifHeight: height,
              video: videos, // array of video files
              interval: 0.1,
              numFrames: 10,
              frameDuration: 1,
              fontWeight: 'normal',
              fontSize: '16px',
              fontFamily: 'sans-serif',
              fontColor: '#ffffff',
              textAlign: 'center',
              textBaseline: 'bottom',
              sampleInterval: 10,
              numWorkers: 2
          }, function (obj) {
              deferred.resolve({
                gif: obj.image
              });
          });
          return deferred.promise;
        },
        charCount: function(str){
          return Array.from(str).reduce((counts, char) => {
            counts[char] = (counts[char] || 0) + 1
            return counts
          }, Object.create(null))
        },
        kFormatter: function(num) {
            return num > 999 ? (num/1000).toFixed(1) + 'k' : num
        },
        addAttr: function(scope, el, attrName, attrValue) {
          el.replaceWith($compile(el.clone().attr(attrName, attrValue))(scope));
        },
        payTokens: function(type){

          var deferred = $q.defer();

          let activeTmpl, activeModalBg, planprice, planheadline, planbtn, stripePlan = {key: '', id: ''};

          $('.gifshopBtn').hide();

          switch(type){
            case 'bronze':
              activeTmpl = `
                <div class="ribbon ribbon-top-right bronze-bg"><span>Bronze</span></div>
                <table id="pricetable" class="table-fill" style="width: 100%;">
                    <thead>
                      <tr>
                        <th class="text-left">Feature</th>
                        <th class="text-center">Benefit</th>
                      </tr>
                    </thead>
                    <tbody class="table-hover bronze-theme">
                      <tr>
                        <td class="text-left">No Watermarks</td>
                        <td class="text-left">✓ Make GIFs without watermarks</td>
                      </tr>
                      <tr>
                        <td class="text-left">1.5k tokens</td>
                        <td class="text-left">✓ Get 1,500 tokens to spend</td>
                      </tr>
                    </tbody>
                </table>
              `;
              planprice = '$49.00';
              planheadline = 'Bronze boost includes 60 minutes of recording time';
              plansubline = '~ $0.03 / second';
              planbtn = 'Bronze';
              activeModalBg = 'url("static/images/payment-modal-background-bronze.jpg")';
                break;
            case 'silver':  
              activeTmpl = `
                <div class="ribbon ribbon-top-right silver-bg"><span>Silver</span></div>
                <table id="pricetable" class="table-fill" style="width: 100%;">
                    <thead>
                      <tr>
                        <th class="text-left">Feature</th>
                        <th class="text-center">Benefit</th>
                      </tr>
                    </thead>
                    <tbody class="table-hover silver-theme">
                      <tr>
                        <td class="text-left">No Watermarks</td>
                        <td class="text-left">✓ Make GIFs without watermarks</td>
                      </tr>
                      <tr>
                        <td class="text-left">GifShop™</td>
                        <td class="text-left">✓ Get access to custom apps in the GifShop™</td>
                      </tr>
                      <tr>
                        <td class="text-left">75k tokens</td>
                        <td class="text-left">✓ Get 75,000 tokens to spend</td>
                      </tr>
                    </tbody>
                </table>
              `;
              planprice = '$99.00';
              planheadline = 'Silver boost includes up to 2,500 minutes of recording time';
              plansubline = '~ $0.01 / second';
              planbtn = 'Silver';
              activeModalBg = 'url("static/images/payment-modal-background-silver.jpg")';
                break;
            case 'gold':
              activeTmpl = `
                <div class="ribbon ribbon-top-right gold-bg"><span>Gold</span></div>
                <table id="pricetable" class="table-fill" style="width: 100%;">
                    <thead>
                      <tr>
                        <th class="text-left">Feature</th>
                        <th class="text-center">Benefit</th>
                      </tr>
                    </thead>
                    <tbody class="table-hover gold-theme">
                      <tr>
                        <td class="text-left">No Watermarks</td>
                        <td class="text-left">✓ Make GIFs without watermarks</td>
                      </tr>
                      <tr>
                        <td class="text-left">GifShop™ access</td>
                        <td class="text-left">✓ Get access to custom apps in the GifShop™</td>
                      </tr>
                      <tr>
                        <td class="text-left">LimeText™ IDE</td>
                        <td class="text-left">✓ Introducing LimeText™ IDE for coders</td>
                      </tr>
                      <tr>
                        <td class="text-left">250k tokens</td>
                        <td class="text-left">✓ Get 250,000 tokens to spend</td>
                      </tr>
                    </tbody>
                </table>
              `;
              planprice = '$299.00';
              planheadline = 'Gold boost includes up to 8,300 minutes of recording time';
              plansubline = '~ $0.01 / second';
              planbtn = 'Gold';
              activeModalBg = 'url("static/images/payment-modal-background-gold.jpg")';
                break;
          }

          swal({
              title: 'GET MORE GIF',
              html: `
                <p><b style='color:#222;'>${planheadline}</b></p>
                ${activeTmpl}
              `,
              //text: 'Silver Pack includes 250 minutes of recording time.',
              //imageUrl: 'https://i.imgur.com/oxVfOni.gif',
              background: `${activeModalBg}`,
              imageWidth: 163,
              imageHeight: 120,
              width: 800,
              customClass: 'swal-max',
              confirmButtonText: `Get ${planbtn}`,
              showCancelButton: false,
              showConfirmButton: true,
              animation: "slide-from-bottom",
              allowOutsideClick: true,
              allowEscapeKey: true,
              footer: 
                `<b style="color: darkslategrey;font-size: large;">${plansubline}</b>
                 <div style="flex-basis: 100%;height: 0;"></div>
                 <span>${planprice} / Month</span>`
            }).then(function(isConfirm, item){
              $('.gifshopBtn').show();
              if(isConfirm.value){
                deferred.resolve(planbtn);
                //deferred.resolve(settings);
              
              } else {
                //return false;
                deferred.resolve(null);
              }
          });
          
          $timeout(function(){
            $('.swal2-footer').css('flex-wrap', 'wrap');
            $('.swal2-show').addClass(`plan-modal-border-${planbtn.toLowerCase()}`);
            //$('.swal2-confirm').attr({id: `checkout-button-price_${stripePlan.id}`, role:'link'});
          });
                        
          return deferred.promise;

        }
    };
}]).

service('Engine', ['WidgetSrvc', function(WidgetSrvc){

  this.$influence = function($scope) {
      var self = WidgetSrvc.gridster;
          try {
            return {
              'self': self.getItem($scope.item.row, $scope.item.col),
              'top': self.getItem($scope.item.row-1, $scope.item.col),
              'bottom': self.getItem(($scope.item.sizeY + $scope.item.row), $scope.item.col),
              'left': self.getItem($scope.item.row, ($scope.item.col-1)),
              'right': self.getItem($scope.item.row, ($scope.item.sizeX + $scope.item.col))
            };
          } catch(e){
            return {'error': e};
          }
  };
}]).

factory('BreezeDataContext', ['$rootScope', '$filter', '$window', '$q', '$http', function($rootScope, $filter, $window, $q, $http) {

  breeze.config.initializeAdapterInstance("modelLibrary", "backingStore", true);
  breeze.config.initializeAdapterInstance("dataService", "mongo", true);
  breeze.config.initializeAdapterInstance("ajax", "angular", true);

  var DT = breeze.DataType;

  var ownerType = new breeze.ComplexType({
    shortName: 'owner',
    dataProperties: {
      user_id: {
        dataType: DT.Int32
      },
      widgets: {
        dataType: DT.String,
        isNullable: true
      }
    }
  });

  var BreezeModel = {
    initialize: function(metadataStore) {
      metadataStore.addEntityType({
        shortName: 'image',
        namespace: 'gridme',
        defaultResourceName: 'image',
        dataProperties: {
          _id: {
            dataType: DT.Int32
          },
          last_modified: {
            dataType: DT.DateTime,
            isNullable: false
          },
          guid: {
            dataType: DT.Guid,
            isNullable: false,
            isPartOfKey: true
          },
          scope: {
            dataType: ownerType,
            isScalar: false
          },
          link: {
            dataType: DT.String
          },
          size: {
            dataType: DT.Int32
          },
          height: {
            dataType: DT.Int32
          },
          width: {
            dataType: DT.Int32
          }
        }
      });
      metadataStore.addEntityType({
        shortName: 'note',
        namespace: 'gridme',
        defaultResourceName: 'note',
        dataProperties: {
          _id: {
            dataType: DT.Int32
          },
          guid: {
            dataType: DT.Guid,
            isNullable: false,
            isPartOfKey: true
          },
          owner: {
            dataType: ownerType
          },
          scope: {
            dataType: ownerType,
            isScalar: false
          },
          last_modified: {
            dataType: DT.DateTime,
            isNullable: false
          },
          clone: {
            dataType: DT.Boolean
          },
          searchable: {
            dataType: DT.Boolean
          },
          price: {
            dataType: DT.Int32
          },
          url: {
            dataType: DT.String
          },
          images: {
            dataType: DT.String
          },
          screenshot: {
            dataType: DT.String,
            isNullable: true
          },
          text: {
            dataType: DT.String
          },
          css: {
            dataType: DT.String
          },
          js: {
            dataType: DT.String
          },
          settings: {
            dataType: DT.String
          },
          title: {
            dataType: DT.String
          },
          row: {
            dataType: DT.Int32
          },
          col: {
            dataType: DT.Int32
          },
          sizeX: {
            dataType: DT.Int32
          },
          sizeY: {
            dataType: DT.Int32
          },
          realHeight: {
            dataType: DT.Int32
          },
          realWidth: {
            dataType: DT.Int32
          },
          pinned: {
            dataType: DT.String
          },
          active: {
            dataType: DT.Boolean
          },
          tags: {
            dataType: DT.String
          }
        }
      });
      metadataStore.addEntityType({
        shortName: 'file',
        namespace: 'gridme',
        defaultResourceName: 'file',
        dataProperties: {
          _id: {
            dataType: DT.Int32
          },
          guid: {
            dataType: DT.Guid,
            isNullable: false,
            isPartOfKey: true
          },
          owner: {
            dataType: ownerType
          },
          scope: {
            dataType: ownerType,
            isScalar: false
          },
          last_modified: {
            dataType: DT.DateTime,
            isNullable: false
          },
          clone: {
            dataType: DT.Boolean
          },
          searchable: {
            dataType: DT.Boolean
          },
          url: {
            dataType: DT.String,
            isNullable: true
          },
          text: {
            dataType: DT.String
          },
          css: {
            dataType: DT.String
          },
          js: {
            dataType: DT.String
          },
          settings: {
            dataType: DT.String
          },
          title: {
            dataType: DT.String
          },
          realHeight: {
            dataType: DT.Int32
          },
          realWidth: {
            dataType: DT.Int32
          },
          active: {
            dataType: DT.Boolean
          },
          tags: {
            dataType: DT.String
          }
        },
        navigationProperties: {
          revisions: { entityTypeName: 'note' }
        }
      });
    }
  };

  var ds = new breeze.DataService({
    serviceName: 'breeze',
    hasServerMetadata: false
  });

  var manager = new breeze.EntityManager({
    dataService: ds
  });

  BreezeModel.initialize(manager.metadataStore);

  var savedEntities = $window.localStorage.getItem('breezeSavedEntities');
  if (savedEntities) {
    manager.importEntities(savedEntities);
  }

  function saveEntitiesLocally() {
    $window.localStorage.setItem('breezeSavedEntities', manager.exportEntities());
  }

  function importEntity(data){
    manager.importEntities(data);
  }

  var noteType = manager.metadataStore.getEntityType('note');
  var imgType = manager.metadataStore.getEntityType('image');
  var fileType = manager.metadataStore.getEntityType('file');

  function syncNotes(cont) {
    
    //var noteEntities = getAddedNotes();
    var noteEntities = getMyNotes();
    
    if(cont){
      var deferred = $q.defer();
      deferred.resolve(false);
      return deferred.promise.then(function(){
        return true;
      });
    } else if(manager.hasChanges()) {
      return manager.saveChanges(noteEntities).then(function() {
        manager.acceptChanges();
        return true;
      }, function(e) {
        console.log(e);
        return false;
      });
    }
  }

  function syncImages() {

    var imageEntities = getMyImages();
    var lastEntity = imageEntities[imageEntities.length-1];

    if(manager.hasChanges()) {
      return manager.saveChanges([lastEntity]).then(function() {
        manager.acceptChanges();
        return true;
      }, function(e) {
        console.log(e);
        return false;
      });
    }
  }

  function syncFiles() {

    var fileEntities = getMyFiles();
    var lastEntity = fileEntities[fileEntities.length-1];

    if(manager.hasChanges()) {
      return manager.saveChanges([lastEntity]).then(function() {
        manager.acceptChanges();
        return true;
      }, function(e) {
        console.log(e);
        return false;
      });
    }
  }

  function getMyNotes() {
    var states = [breeze.EntityState.Added, breeze.EntityState.Modified, breeze.EntityState.Unchanged];
    return manager.getEntities(noteType, states);
  }

  function getMyImages(){
    var states = [breeze.EntityState.Added, breeze.EntityState.Modified, breeze.EntityState.Unchanged];
    return manager.getEntities(imgType, states);
  } 

  function getMyFiles(){
    var states = [breeze.EntityState.Added, breeze.EntityState.Modified, breeze.EntityState.Unchanged];
    return manager.getEntities(fileType, states);
  }

  /*function getAddedNotes() {
    var states = [breeze.EntityState.Added, breeze.EntityState.Modified, breeze.EntityState.Unchanged];
    return manager.getEntities(noteType, states);
  }*/

  function getMyFilesAndRevisions() {
    var promise = breeze.EntityQuery.from('files')
      .orderBy('last_modified')
      .expand('revisions')
      .inlineCount()
      .noTracking()
      .using(manager)
      .execute();
    return promise;
  }

  function getAllSearchableWidgets(query, count) {
    var promise = breeze.EntityQuery.from('widgets')
      .orderBy('last_modified')
      .where('searchable', '==', true)
      .inlineCount()
      .noTracking()
      .using(manager)
      .execute();
    return promise;
  }

  /*function getAllGifShopWidgets(query, count) {
    var promise = breeze.EntityQuery.from('widgets')
      .orderBy('last_modified')
      .where('price', '!=', null)
      .inlineCount()
      .noTracking()
      .using(manager)
      .execute();
    return promise;
  }*/

  function getSearchedWidgets(query) {
    var p1 = breeze.Predicate('searchable', '==', true);
    var p2 = breeze.Predicate('settings', 'contains', query);
    var promise = breeze.EntityQuery.from('widgets')
      .where(p1.and(p2))
      .inlineCount()
      .orderBy('last_modified')
      .take(100)
      .noTracking()
      .using(manager)
      .execute();
    return promise;
  }

  function getWidgetByGuidRemote(guid) {
    return _fetchMetadata().then(function(){
      var query = breeze.EntityQuery
        .from('widgets')
        .orderBy('last_modified')
        .take(1)
        .where('guid', '==', guid)
        .inlineCount()
        .using(manager);
      return manager.executeQuery(query)
        .then(function(data){
          return data.results;
        })
        .catch(function(error){
          throw error;
        });
    });
  }

  function getGistById(id) {
    return $http.get('https://api.github.com/gists/' + id).success(function(results){
      return results;
    });
  }

  function getNote(guid) {
    return manager.getEntityByKey('note', guid);
  }

  function getFile(guid) {
    return manager.getEntityByKey('file', guid);
  }

  function addNote(obj, guid) {
    var deferred = $q.defer();
    obj.guid = (guid) ? guid : DT.Guid.getNext();
    obj.last_modified = new Date();
    //obj.active = obj.active ? obj.active : true;
    var ent = manager.createEntity(noteType, obj);
    manager.addEntity(ent);
    saveEntitiesLocally();
    deferred.resolve(ent);
    return deferred.promise;
  }

  function addFile(obj, guid) {
    var deferred = $q.defer();
    obj.guid = (guid) ? guid : DT.Guid.getNext();
    obj.last_modified = new Date();
    //obj.active = obj.active ? obj.active : true;
    var ent = manager.createEntity(fileType, obj);
    manager.addEntity(ent);
    saveEntitiesLocally();
    deferred.resolve(ent);
    return deferred.promise;
  }

  function addImage(obj, guid){
    var deferred = $q.defer();
    obj.guid = (guid) ? guid : DT.Guid.getNext();
    obj.last_modified = new Date();
    var ent = manager.createEntity(imgType, obj);
    manager.addEntity(ent);
    saveEntitiesLocally();
    deferred.resolve(ent);
    return deferred.promise;
  }

  function modElement(ent) {
    var deferred = $q.defer();
    ent.last_modified = new Date();
    saveEntitiesLocally();
    deferred.resolve(ent);
    return deferred.promise;
  }

  function delElement(ent, detach) {
    if(detach){
      manager.detachEntity(ent);
    } else {
      ent.entityAspect.setDeleted();
    }
    saveEntitiesLocally();
  }

  function _fetchMetadata() {
    if (manager.metadataStore.isEmpty()) {
        return manager.fetchMetadata();
    }
    return Q.resolve();
  };

  function getWidgetByGuid(guid){
      return _fetchMetadata().then(function(){
        var query = 
          breeze.EntityQuery
            .from('notes')
            .orderBy('guid')
            .toType('note')
            .where('guid', '==', guid)
            .using(breeze.MergeStrategy.OverwriteChanges)
            .using(breeze.FetchStrategy.FromLocalCache)
            .using(manager);
        
        return manager.executeQuery(query)
        .then(function(data){
          return data.results;
        })
        .catch(function(error){
          throw error;
        });
      });
  };

  function modUser(ent){
    var deferred = $q.defer();
    ent.last_modified = new Date();
    ent.owner.plan = ent.plan;
    ent.owner.widgets = ent.widgets;
    ent.owner.tokens = ent.tokens;
    saveEntitiesLocally();
    deferred.resolve(ent);
    return deferred.promise;
  }

  function cloneEntity(sourceEntity, keyName) {
     var sourceEntityType = sourceEntity.entityType;

     var sourceDataProperties = sourceEntityType.dataProperties;
     var configEntity = {};
     sourceDataProperties.forEach(function(dp) {
          if(dp.name === 'clone'){
            configEntity[dp.name] = true;
          } else {
            configEntity[dp.name] = sourceEntity.getProperty(dp.name);
          }
     });

     newKeyValue = DT.Guid.getNext();
     configEntity[keyName] = newKeyValue;

     var cloneEntity = manager.createEntity(noteType, configEntity, breeze.EntityState.Added);
     return cloneEntity;
  };


  function clearCachedNotes() {
    var cachedNotes = manager.getEntities('note');
    cachedNotes.forEach(function (entity) { manager.detachEntity(entity); });
  }

  function clearEverything() {
    manager.clear();
  }

  function getFreshGuid() {
    return DT.Guid.getNext();
  }

  return {
    importEntity: importEntity,
    
    syncNotes: syncNotes,
    syncFiles: syncFiles,
    syncImages: syncImages,

    getMyNotes: getMyNotes,
    getMyImages: getMyImages,
    getMyFiles: getMyFiles,
    getMyFilesAndRevisions: getMyFilesAndRevisions,
    //getAddedNotes: getAddedNotes,
          
    getNote: getNote,
    addNote: addNote,

    getFile: getFile,
    addFile: addFile,

    delElement: delElement,
            
    addImage: addImage,
    
    modUser: modUser,
    modElement: modElement,
    
    getWidgetByGuid: getWidgetByGuid,
    getWidgetByGuidRemote: getWidgetByGuidRemote,

    getGistById: getGistById,
    
    getAllSearchableWidgets: getAllSearchableWidgets,
    //getAllGifShopWidgets: getAllGifShopWidgets,
    getSearchedWidgets: getSearchedWidgets,

    cloneEntity: cloneEntity,
    
    clearCachedNotes: clearCachedNotes,
    
    clearEverything: clearEverything,
    
    getFreshGuid: getFreshGuid
  };
}]).

factory('User',  ['$resource', function($resource) {
  return $resource('users/:id');
}]).

factory('Myself', ['$window', '$location', '$q', 'User', function($window, $location, $q, User) {
  var deferred = $q.defer();
  if($window.localStorage.getItem('myChannel')){
    var uid = +JSON.parse($window.localStorage.getItem('myChannel'))['user_id'];
  } else {
    var uid = 'myself';
  }
  User.query({
    //id: 'myself'
    id: uid
  }, function(data) {
    //if (data.length === 1) {
    if (data.length) {
      //deferred.resolve(data[0]);
      deferred.resolve(data[data.length-1]);
    } else {
      //not logged in
      deferred.resolve(null);
    }
  }, function() {
    //no network
    deferred.resolve(null);
  });
  return deferred.promise;
}]).

run(['$window', '$interval', '$document', '$rootScope', '$route', '$location', '$routeParams', '$timeout', '$ocLazyLoad', '$http', 'BreezeDataContext', 'deviceDetector', 'WidgetSrvc', function($window, $interval, $document, $rootScope, $route, $location, $routeParams, $timeout, $ocLazyLoad, $http, BreezeDataContext, deviceDetector, WidgetSrvc) {

  var anigifCheck = $interval(function(){
    if($window.hasOwnProperty('anigif_bar')){
      try{
        $window.anigif_bar.el.style.display = 'none';
        //$('#anigif_bar').append('<button id="script_button" disabled onclick="stopMode()" style="float:right;">Autostop OFF</button>')
        $('#anigif_bar')
         .bind('DOMSubtreeModified', function(){
           setTimeout(function(){
             if($('#status').text() !== 'ready'){
               $('#script_button').hide();
             }
           });
         });
        $interval.cancel(anigifCheck);
      } catch(e){
        console.log('Still loading...');
      }
    }
  },10);

  $rootScope.$on('$viewContentLoaded', function(event, data) {

      $window.anigif.options.selector = "#gifcanvas";
      $window.anigif.options.quality = "High";
      $window.anigif.options.cores = 4;
      $window.anigif.options.onlyLastFrames = 50;
      $window.anigif.options.framesPerSecond = 8;
      $window.anigif.options.period = "Online";

      //componentHandler.upgradeAllRegistered();

      if($("html").hasClass("no-touch")){
        $(".post_tags_inner").draggable({
          axis: "x",
          scroll: false,
          stop: function() {
            var __left = $(this).css("left").replace(/[^-\d\.]/g, '');
            if (__left > 0) {
              $(this).animate({
                left: 0
              }, 400, 'easeOutExpo');
            }
            var __width = $(this).outerWidth();
            var __parentWidth = $(".post_tags.draggable").outerWidth();
            if (__width > __parentWidth) {
              if (__left < __parentWidth - __width) {
                $(this).animate({
                  left: __parentWidth - __width
                }, 400, 'easeOutExpo');
              }
            } else {
              $(this).animate({
                left: 0
              }, 400, 'easeOutExpo');
            }
          }
        });
      }
  });

  $rootScope.$on('$locationChangeStart', function (event, current, previous) {
    console.log("Previous URL" +previous);
  });

  !(function ($, undefined) {
        var get_selector = function (element) {
            var pieces = [];
            for (; element && element.tagName !== undefined; element = element.parentNode) {
                if (element.className) {
                    var classes = element.className.split(' ');
                    for (var i in classes) {
                        if (classes.hasOwnProperty(i) && classes[i]) {
                            pieces.unshift(classes[i]);
                            pieces.unshift('.');
                        }
                    }
                }
                if (element.id && !/\s/.test(element.id)) {
                    pieces.unshift(element.id);
                    pieces.unshift('#');
                }
                pieces.unshift(element.tagName);
                pieces.unshift(' > ');
            }
            return pieces.slice(1).join('');
        };
        $.fn.getSelector = function (only_one) {
            if (true === only_one) {
                return get_selector(this[0]);
            } else {
                return $.map(this, function (el) {
                    return get_selector(el);
                });
            }
        };
    })(window.jQuery);

    // add data-tooltip attribute to element to make tooltips
    $('[data-tooltip]').hover(function(){
      $('<div class="div-tooltip"></div>').text($(this).attr('data-tooltip')).appendTo('body').fadeIn('slow');
    }, function() { 
      $('.div-tooltip').remove();
    }).mousemove(function(e) {
      $('.div-tooltip').css({ top: e.pageY + 10, left:  e.pageX + 20 })
    });
}]);
