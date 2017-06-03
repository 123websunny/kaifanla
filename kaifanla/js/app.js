angular.module('kaifanla',['ng'])
  .controller('parentCtrl',function($scope){
    console.log('parentCtrl开始创建了...');
    //当一个新的Page被加载时，编译并连接其内容
    angular.element(document).on('pagecreate',function(event){
      //console.log('一个新的Page被创建了')
      var target=event.target;  //事件源即被加载的Page
      //console.log(target);
      var scope=angular.element(target).scope();
      angular.element(target).injector().invoke(function($compile){
        $compile(angular.element(target))(scope);
        scope.$digest();
      });
    }),

    $(document).delegate('#pageStart','swipeleft',function(){
      $.mobile.changePage('main.html',{transition:'slide'});
    })
  })
  .controller('startCtrl',function($scope,$timeout){
    console.log('startCtrl开始创建了...');

    $scope.msg='Hello START！';
    $timeout(function(){
      $.mobile.changePage('main.html',{transition:'slide'})
    },3000)
  })
  .controller('mainCtrl',function($scope,$http){
    console.log('mainCtrl开始创建了...');
    $scope.hasMore=true;
    $http.get('data/dish_getbypage.php')
      .success(function(data){
        console.log('读取到服务器返回的响应数据：');
        console.log(data);
        $scope.dishList = data;  //把服务器端返回的数据上升为Model变量，就可以进行双向数据绑定
      });
    $scope.jump2Detail=function(did){
      sessionStorage.setItem('did',did);
      $.mobile.changePage('detail.html',{transition:'filp'})
    }
    $scope.showImgLg=function(imgLg){
      event.stopPropagation();
      $scope.imgLgSrc=imgLg;
      $scope.showMask=true;
    }
    $scope.hideMask=function(){
      $scope.showMask=false;
    };
    //为加载更多按钮添加事件监听函数
    $scope.loadMore = function(){
      $http.get('data/dish_getbypage.php?start='+$scope.dishList.length)
        .success(function(data){
          console.log('加载到更多数据：')
          console.log(data);
          if(data.length<5){
            $scope.hasMore = false;
          }
          $scope.dishList = $scope.dishList.concat(data);
        });
    }
    //当搜索关键字发生改变，则立即向服务器发起请求
    $scope.$watch('kw', function(){
      if($scope.kw){  //若输入框内容不为空
        $http.get('data/dish_getbykw.php?kw='+$scope.kw)
          .success(function(data){
            $scope.dishList = data;
          });
      }
    })
  })
  .controller('detailCtrl',function($scope,$http){
    var did=sessionStorage.getItem('did');
    $http.get('data/dish_getbyid.php?did='+did)
      .success(function(data){
        console.log(data);
        $scope.dish=data;
      })
  })
  .controller('orderCtrl', function($scope,$rootScope,$http){
    var did=sessionStorage.getItem('did');
    console.log('order.html接收到如下路由参数：');
    $scope.order = {did:did};

    $scope.order.user_name = '赵大旭';
    $scope.order.sex = '1';
    $scope.order.phone = '13501234567';
    $scope.order.addr = '万寿路2号';
    /****测试数据*****/

    $scope.submitOrder = function(){
      $rootScope.phone = $scope.order.phone;
      console.log('当前表单中的数据：')
      console.log($scope.order);
      var requestData = jQuery.param($scope.order);
      //console.log(typeof result);
      //console.log(result);
      $http.post('data/order_add.php?',requestData,{headers:{'Content-Type':'application/x-www-form-urlencoded'}})
        .success(function(data){
          if(data.result==200){
            $scope.succMsg = '订餐成功！您的订单编号为：'+data.oid+'。您可以在用户中心查看订单状态。'
            $rootScope.phone = $scope.order.phone;
          }else {
            $scope.errMsg = '订餐失败！错误码为：'+data.result ;
          }
        })
    }
  })
  .controller('myorderCtrl',function($scope,$http,$rootScope){
    if($rootScope.phone){
      $http.get('data/order_getbyphone.php?phone='+$rootScope.phone)
        .success(function(data){
            $scope.orderList=data;
        })
    }else {
      console.log('您尚未下单！尚未记录电话号码！');
    }
  })
  .run(function($http){
    $http.defaults.headers.post = {'Content-Type':'application/x-www-form-urlencoded'};
  })