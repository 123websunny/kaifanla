<?php
/**
*用途：为myorder.html返回指定电话号码的所有订单
*数据格式：JSON格式，形如：
*  [
*      {"oid":18,"order_time":23423423434,"user_name":"收货人", "did":3, "img_sm":"img/1.jpg", "name":"菜名"},
*      {...},
*      {...}
*   ]
*详细说明：根据客户端提交的电话号码，返回该电话所下的所有订单；若客户端未提交电话，则返回空数组
*作者： 杨靖
*创建时间：  2016-03-14 10:10:25
*最后修改时间：2016-03-15 20:10:33
**/
header('Content-Type: application/json; charset=UTF-8');
$output = [];

@$phone = $_REQUEST['phone'];  //@符号用于压制当前行代码抛出的警告消息
if($phone===NULL){
    echo '[]';
    return;
}

include('config.php');      //在当前位置包含另一个PHP文件的内容
$conn = mysqli_connect($db_host, $db_user, $db_pwd, $db_name, $db_port);
$sql = "SET NAMES UTF8";
mysqli_query($conn, $sql);
$sql = "SELECT oid,user_name,order_time,kf_order.did,img_sm,name FROM kf_order,kf_dish WHERE phone='$phone' AND kf_order.did=kf_dish.did";
$result = mysqli_query($conn, $sql);
while( ($row=mysqli_fetch_assoc($result))!==NULL ){
    $output[] = $row;
}

echo json_encode($output);
?>