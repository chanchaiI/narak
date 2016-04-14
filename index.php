<?php

$SITE_ROOT = "https://narakclub.com/";

$jsonData = getData($SITE_ROOT);
makePage($jsonData, $SITE_ROOT);
function getData($siteRoot) {
    if($_GET['id']){
    	$id = ctype_digit($_GET['id']) ? $_GET['id'] : 1;
    	$rawData = file_get_contents($siteRoot.'api/public/v1/post/'.$id);
    	return json_decode($rawData);
    }else if($_GET['token']){
        $id = ctype_digit($_GET['token']) ? $_GET['token'] : 1;
        $rawData = file_get_contents($siteRoot.'api/public/v1/post/random/'.$id);
        return json_decode($rawData);
    }else{
    	return null;
    }
}

function makePage($data, $siteRoot) {
	$title = 'Narakjung2 โดย น่ารัก';
	$description = 'ร่วมสนุกส่งรูปลูกน้อย เพื่อลุ้นรับของรางวัลมากมายที่นี่เลย';
	$image = $siteRoot . 'assets/images/narakjung.png';
	if($data){
		$title = 'โหวตให้กับ น้อง'.$data->kid_nickname;
		$description = 'ร่วมสนุกส่งรูปลูกน้อยแบบ &quot;น่ารักจัง&quot; เหมือนน้อง'.$data->kid_nickname.' เพื่อลุ้นรับของรางวัลมากมายที่นี่เลย';
		$image = $siteRoot . 'uploads/images/' . $data->image_path;
	}
    ?>

<!doctype html><html ng-app="narak">
     <head>
       <meta property="og:title" content="<?php echo $title; ?>"/>
       <meta property="og:description" content="<?php echo $description; ?>" />
       <meta property="og:image" content="<?php echo $image; ?>" />
       <meta charset="utf-8"><title>Narak Tiara - Narakjung ปี 2</title><meta name="description" content=""><meta name="viewport" content="width=device-width"><link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"><link rel="stylesheet" href="/styles/vendor-5fd4111c2c.css"><link rel="stylesheet" href="/styles/app-a085a0b657.css"><script type="text/javascript">
      WebFontConfig = {
        custom: { families: [ 'db_helvethaicamon_x75_bd' ] }
      };
      (function() {
        var wf = document.createElement('script');
        wf.src = ('https:' == document.location.protocol ? 'https' : 'http') +
                '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
        wf.type = 'text/javascript';
        wf.async = 'true';
        var s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(wf, s);
      })(); </script><base href="/"></head><body><!--[if lt IE 10]>
 <p class="browsehappy">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> to improve your experience.</p>
 <![endif]--><div class="page {{ vm.pageClass }}" ui-view=""></div><script src="/scripts/vendor-e3299b9be1.js"></script><script src="/scripts/app-124d81ecc2.js"></script></body></html>

     <?php
}
