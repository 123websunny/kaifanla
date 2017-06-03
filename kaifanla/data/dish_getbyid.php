<?php
/**
*用途：为detail.html返回某一道菜品的详情
*数据格式：JSON格式，形如：
*  [
*      {"did":18,"name":"菜名",price:35.5,material:"原材料",img_lg:"img/1.jpg","detail":"菜品详情"}
*   ]
*详细说明：根据客户端提交的菜品编号(did)，返回该菜品的详情；若客户端未提交did，则返回空数组
*作者： 杨靖
*创建时间：  2016-03-14 10:10:25
*最后修改时间：2016-03-15 20:10:33
**/
header('Content-Type: application/json; charset=UTF-8');
$output = [];

@$did = $_REQUEST['did'];  //@符号用于压制当前行代码抛出的警告消息
if($did===NULL){
   echo '[]'; //若客户端未提交请求参数did
   return;
}

include('config.php');      //在当前位置包含另一个PHP文件的内容
$conn = mysqli_connect($db_host, $db_user, $db_pwd, $db_name, $db_port);
$sql = "SET NAMES UTF8";
mysqli_query($conn, $sql);
$sql = "SELECT did,name,img_lg,price,material,detail FROM kf_dish WHERE did=$did";
$result = mysqli_query($conn, $sql);
//根据主键来查询，最多只能返回一行记录——无需循环读取记录
$row=mysqli_fetch_assoc($result);
$output[] = $row;


echo json_encode($output);
?>