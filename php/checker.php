<?php

if(isset($_REQUEST['login']) and strlen($_REQUEST['login'])){
	
	$login = $_REQUEST['login'];
	if(!in_array($login, array('ramon','login1','login2'))){
		echo json_encode(array('valid'=>'valid'));
	}else{
		echo json_encode(array('valid'=>'invalid'));
	}
}
