<?php
/**
*用途：为main.html分页返回菜品列表
*数据格式：JSON格式，形如：
*  [
*      {"did":18,"name":"菜名",price:35.5,material:"原材料",img_sm:"img/1.jpg"},
*      {...},
*      {...}
*   ]
*详细说明：分页显示，每次最多返回5条记录；需要客户端提交从哪条记录开始显示，若客户端未提交，则默认从第0条记录开始返回数据
*作者： 杨靖
*创建时间：  2016-03-14 10:10:25
*最后修改时间：2016-03-15 20:10:33
**/
header('Content-Type: application/json; charset=UTF-8');
$output = [];

@$start = $_REQUEST['start'];  //@符号用于压制当前行代码抛出的警告消息
if($start===NULL){  //若客户端未提交请求参数start，则赋默认值0
    $start = 0;
}
$count = 5;  //一次响应最多向客户端返回5条记录

include('config.php');      //在当前位置包含另一个PHP文件的内容
$conn = mysqli_connect($db_host, $db_user, $db_pwd, $db_name, $db_port);
$sql = "SET NAMES UTF8";
mysqli_query($conn, $sql);
$sql = "SELECT did,name,img_sm,img_lg,price,material FROM kf_dish LIMIT $start,$count ";

$result = mysqli_query($conn, $sql);
while( ($row=mysqli_fetch_assoc($result))!==NULL ){
    $output[] = $row;
}

echo json_encode($output);
?>