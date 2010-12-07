//コンテキストメニュー抑止有効化
function startDisableContextMenu() {
	if (
		navigator.appName == "Netscape"
		&& !(navigator.platform.indexOf("Mac") >= 0)
	) {
		document.captureEvents(Event.MOUSEDOWN);
	}
	document.onmousedown = disableContextMenu;
}

//右クリック抑止
function disableContextMenu(ev) {

	if (ev) {

		//NNの場合、コンポーネントにマウスダウンイベントを通知
		captureMouseDownNN(ev);
		
		if (ev.button && ev.button == 2) {  // W3C DOM2
			return false;
		} else if (ev.which && ev.which == 3) {  // N4
			return false;
		} else if (
			navigator.platform.indexOf("Mac") >= 0
			&& navigator.appName == "Netscape"
		) {
			return false;
		}
	} else if (event) {
		if (event.button && event.button == 2) {  // IE
			return false;
		}
	}
}

//マウスダウンイベントをキャプチャーしたときの処理(NN用)
function captureMouseDownNN(ev) {
	

	if (!ev.which) {
		return;
	}
	
	//buttonプロパティがあるなんてNNじゃないだろ！Firefox？
	if ("undefined" != typeof(ev.button)) {
		return;
	}
	
	document.firemousedown(ev);
}

//マウスダウンリスナの初期化
document.firemousedown = function (ev) {
}

//マウスダウンリスナの登録
document.addFiremousedown = function (oListener) {

	if (!document.oArrFiremousedown) {
		document.oArrFiremousedown = new Array();
		document.firemousedown = function (ev) {
			var n;
			for (n = 0; n < document.oArrFiremousedown.length; n++) {
				document.tmpFiremousedown = document.oArrFiremousedown[n];
				document.tmpFiremousedown(ev);
			}
		}
	}
	document.oArrFiremousedown.push(oListener);
}

startDisableContextMenu();

