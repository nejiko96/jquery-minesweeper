//�R���e�L�X�g���j���[�}�~�L����
function startDisableContextMenu() {
	if (
		navigator.appName == "Netscape"
		&& !(navigator.platform.indexOf("Mac") >= 0)
	) {
		document.captureEvents(Event.MOUSEDOWN);
	}
	document.onmousedown = disableContextMenu;
}

//�E�N���b�N�}�~
function disableContextMenu(ev) {

	if (ev) {

		//NN�̏ꍇ�A�R���|�[�l���g�Ƀ}�E�X�_�E���C�x���g��ʒm
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

//�}�E�X�_�E���C�x���g���L���v�`���[�����Ƃ��̏���(NN�p)
function captureMouseDownNN(ev) {
	

	if (!ev.which) {
		return;
	}
	
	//button�v���p�e�B������Ȃ��NN����Ȃ�����IFirefox�H
	if ("undefined" != typeof(ev.button)) {
		return;
	}
	
	document.firemousedown(ev);
}

//�}�E�X�_�E�����X�i�̏�����
document.firemousedown = function (ev) {
}

//�}�E�X�_�E�����X�i�̓o�^
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

