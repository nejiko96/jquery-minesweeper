/* =========================================================

	$Id$

========================================================= */

/***********************************************************
 *
 * �N���X���C�u�����̒�`
 *
 ***********************************************************/

if (typeof IKARUGA == "undefined") {
	IKARUGA = {};
}

/***********************************************************
 *
 * �}�C���X�C�[�p�N���X
 *
 ***********************************************************/

//�R���X�g���N�^
IKARUGA.MineSweeper = function (sName) {

	//�Q�[����
	this.sName = sName;

	/*
	 * GUI�֘A�t�B�[���h
	 */
	
	//�Ֆ�
	this.oBoard = null;

	//�^�C�}�[�\���t�B�[���h
	this.oTimer = null;
	
	/*
	 * �Q�[���p�����[�^�֘A�t�B�[���h
	 */
	
	//��
	this.nWidth = 0;
	
	//����
	this.nHeight = 0;
	
	//�}�X��
	this.nCells = 0;
	
	//�n����
	this.nBoms = 0;
	
	/*
	 * �Q�[����Ԋ֘A�t�B�[���h
	 */
	
	//�B��Ă���󂫃}�X��
	this.nHiddenCells = 0;
	
	//�n���ʒu
	this.oMinePosition = null;
	
	//�����ʒu
	this.nArrExplosion = null;
	
};

/***********************************************************
 *
 * �i�C���i�[�N���X�j�Q�����x�N�g��
 *
 ***********************************************************/

//�R���X�g���N�^
IKARUGA.MineSweeper.Vector2D = function (nX, nY) {

	//X����
	this.nX = nX;

	//Y����
	this.nY = nY;

};

/***********************************************************
 *
 * �}�C���X�C�[�p�N���X
 *
 ***********************************************************/

/***********************************************************
 * �萔
 ***********************************************************/

//���̉���
IKARUGA.MineSweeper.WIDTH_MIN = 9;
//���̏��
IKARUGA.MineSweeper.WIDTH_MAX = 30;
//�����̉���
IKARUGA.MineSweeper.HEIGHT_MIN = 9;
//�����̏��
IKARUGA.MineSweeper.HEIGHT_MAX = 24;
//�n�����̉���
IKARUGA.MineSweeper.BOMS_MIN = 10;

//�אڂ���}�X�̕���
IKARUGA.MineSweeper.NEIGHBOR_DIRECTIONS = new Array(
	new IKARUGA.MineSweeper.Vector2D(-1, -1),
	new IKARUGA.MineSweeper.Vector2D(0, -1),
	new IKARUGA.MineSweeper.Vector2D(1, -1),
	new IKARUGA.MineSweeper.Vector2D(1, 0),
	new IKARUGA.MineSweeper.Vector2D(1, 1),
	new IKARUGA.MineSweeper.Vector2D(0, 1),
	new IKARUGA.MineSweeper.Vector2D(-1, 1),
	new IKARUGA.MineSweeper.Vector2D(-1, 0)
);

/***********************************************************
 * �N���X���\�b�h
 ***********************************************************/

//�摜�t�@�C���p�X�̐ݒ�
IKARUGA.MineSweeper.setImagePath = function (sPath) {
	IKARUGA.MineSweeper.Board.setImagePath(sPath);
};

/***********************************************************
 * �C���X�^���X���\�b�h
 ***********************************************************/

//��ʂ�����������
IKARUGA.MineSweeper.prototype.init = function (nW, nH, nB) {

	window.status = "���΂炭���҂����������D�D�D";

	//�O���[�o���ϐ�������������
	this.initGlobals(nW, nH, nB);

	//�Ֆʂ�`�悷��
	this.oBoard = new IKARUGA.MineSweeper.Board(this);
	this.oBoard.paint();
	
	//�ՖʂɃ��X�i��o�^
	this.registListeners();

	//�^�C�}�[�\���t�B�[���h���쐬
	this.oTimer = new IKARUGA.MineSweeper.TimerBox(this.oBoard.getTxtTimer());
	
	//�Q�[��������������
	this.resetGame();
	
	window.status = "";
};

//���X�i�o�^����
IKARUGA.MineSweeper.prototype.registListeners = function () {

	var oGame = this;
	var oBoard = this.oBoard;
	var oListener = new IKARUGA.MineSweeper.Listener(this);

	oBoard.getBtnRestart().onclick = function () {
		oGame.restart();
	};
	oBoard.registListeners();
	//�C�x���g���X�i��ՖʂɕR�t��
	oBoard.imgCell_firemousedown = function (ev, nIndex) {
		oListener.imgCell_onmousedown(ev, nIndex);
	};
	oBoard.imgCell_firemouseup = function (ev, nIndex) {
		oListener.imgCell_onmouseup(ev, nIndex);
	};

	//�R���e�L�X�g���j���[��}�~����
	oBoard.getForm().oncontextmenu = function () { return false };

};

//�O���[�o���ϐ�������������
IKARUGA.MineSweeper.prototype.initGlobals = function (nW, nH, nB) {

	//�n��������l
	var nMaxBoms;

	//��������������
	this.nWidth = nW;
	if (this.nWidth < IKARUGA.MineSweeper.WIDTH_MIN) {
		this.nWidth = IKARUGA.MineSweeper.WIDTH_MIN;
	}
	if (this.nWidth > IKARUGA.MineSweeper.WIDTH_MAX) {
		this.nWidth = IKARUGA.MineSweeper.WIDTH_MAX;
	}
	
	//����������������
	this.nHeight = nH;
	if (this.nHeight < IKARUGA.MineSweeper.HEIGHT_MIN) {
		this.nHeight = IKARUGA.MineSweeper.HEIGHT_MIN;
	}
	if (this.nHeight > IKARUGA.MineSweeper.HEIGHT_MAX) {
		this.nHeight = IKARUGA.MineSweeper.HEIGHT_MAX;
	}

	//�n����������������
	nMaxBoms = (this.nWidth - 1) * (this.nHeight - 1);
	this.nBoms = nB;
	if (this.nBoms < IKARUGA.MineSweeper.BOMS_MIN) {
		this.nBoms = IKARUGA.MineSweeper.BOMS_MIN;
	}
	if (this.nBoms > nMaxBoms) {
		this.nBoms = nMaxBoms;
	}

	//�}�X��������������
	this.nCells = this.nWidth * this.nHeight;
	
};

//�Q�[������蒼��
IKARUGA.MineSweeper.prototype.restart = function () {

	window.status = "���΂炭���҂����������D�D�D";

	//�Q�[����ʂ��ĕ`�悷��
	this.oBoard.repaint();
	
	//�Q�[��������������
	this.resetGame();

	window.status = "";
};

//�Q�[���̃��Z�b�g
IKARUGA.MineSweeper.prototype.resetGame = function () {

	//�^�C�}�[�����Z�b�g
	this.oTimer.reset();

	//�B���ꂽ�}�X�̐���������
	this.nHiddenCells = this.nCells - this.nBoms;

	//�c��n������������
	this.oBoard.getTxtRemainder().value = this.nBoms;

	//�n���ʒu���N���A
	this.oMinePosition = null;

	//�����ʒu���N���A
	this.nArrExplosion = new Array();
	
	//�C�x���g�n���h�����Đݒ�
	this.oBoard.activateListeners();
};

//�Q�[���̊J�n
IKARUGA.MineSweeper.prototype.startGame = function (nStartIndex) {

	//�n���ʒu��������
	this.oMinePosition = new IKARUGA.MineSweeper.MinePosition();
	this.oMinePosition.init(this.nCells, this.nBoms, nStartIndex);

	//�^�C�}�[���J�n
	this.oTimer.start();
	
};

//�Q�[���̒�~
IKARUGA.MineSweeper.prototype.stopGame = function () {

	//�^�C�}�[���~
	this.oTimer.stop();
	
	//�C�x���g�n���h��������
	this.oBoard.inactivateListeners();

};

//�摜��}�E�X���N���b�N���̏���
IKARUGA.MineSweeper.prototype.imgCell_onMouseLeftClick = function (nIndex) {

	//�Q�[�����n�܂��Ă��Ȃ��ꍇ�A�J�n����B
	if (this.oMinePosition == null) {
		this.startGame(nIndex);
	}

	//���łɊJ���Ă����牽�����Ȃ�
	if (this.oBoard.isOpened(nIndex)) {
		return;
	}
	
	//���������Ă���ꍇ�������Ȃ�
	if (this.oBoard.isFlagged(nIndex)) {
		return;
	}
		
	//�n����I�񂾏ꍇ
	if (this.oMinePosition.hasBomAt(nIndex)) {
		//�Q�[���I�[�o�[
		this.nArrExplosion.push(nIndex);
		this.gameOver();
		return;
	}
	
	//�}�X���J��
	this.openSafe(nIndex);
	
};

//�摜��}�E�X�E�N���b�N���̏���
IKARUGA.MineSweeper.prototype.imgCell_onMouseRightClick = function (nIndex) {

	//�J���Ă���}�X�ł͉������Ȃ�
	if (this.oBoard.isOpened(nIndex)) {
		return;
	}
	
	//���݂̏�Ԃɉ����ď�ԑJ�ڂ�����
	if (this.oBoard.isNotMarked(nIndex)) {
		//���󁨊�
		this.oBoard.setFlagged(nIndex);
		this.oBoard.getTxtRemainder().value--;
	} else if (this.oBoard.isFlagged(nIndex)) {
		//�����s��
		this.oBoard.setUncertain(nIndex);
		this.oBoard.getTxtRemainder().value++;
	} else if (this.oBoard.isUncertain(nIndex)) {
		//�s��������
		this.oBoard.setNotMarked(nIndex);
	}
};

//�摜��}�E�X���N���b�N���̏���
IKARUGA.MineSweeper.prototype.imgCell_onMouseBothClick = function (nIndex) {

	var n;
	var nNeighbor;

	var nFlagCount;
	var nBomCount;

	var nArrSafe;
	var nArrExplosion;

	//�܂��J���Ă��Ȃ��}�X�������牽�����Ȃ�
	if (this.oBoard.isHidden(nIndex)) {
		return;
	}

	nFlagCount = 0;
	nBomCount = this.oBoard.getBomCount(nIndex);
	
	nArrSafe = new Array();
	nArrExplosion = new Array();

	//�אڂ���}�X��S�Ē��ׂ�
	for (n = 0; n < IKARUGA.MineSweeper.NEIGHBOR_DIRECTIONS.length; n++) {

		//�אڂ���}�X�̈ʒu�����߂�
		nNeighbor = this.calcNeighborPos(nIndex, IKARUGA.MineSweeper.NEIGHBOR_DIRECTIONS[n]);
		//�Ֆʂ̊O���̏ꍇ�������Ȃ�
		if (nNeighbor < 0) {
			continue;
		}
		
		//�J���Ă���}�X�͑ΏۊO
		if (this.oBoard.isOpened(nNeighbor)) {
			continue;
		}
		
		if (this.oBoard.isFlagged(nNeighbor)) {
			//�����J�E���g����
			nFlagCount++;
			continue;
		}
		
		//�n��������ꍇ
		if (this.oMinePosition.hasBomAt(nNeighbor)) {
			//�����}�X�̃��X�g�ɉ�����
			nArrExplosion.push(nNeighbor);
			continue;
		}
		
		//���S�ȃ}�X�̃��X�g�ɉ�����
		nArrSafe.push(nNeighbor);
	}
	
	//�אڂ���n���̐��Ɗ��̐�����v���Ȃ���΁A�������Ȃ�
	if (nFlagCount != nBomCount) {
		return;
	}

	//���S�ȃ}�X�͊J���Ă���
	for (n = 0; n < nArrSafe.length; n++) {
		this.openSafe(nArrSafe[n]);
	}

	//�n����I��ł��܂����ꍇ
	if (nArrExplosion.length > 0) {
		//�Q�[���I�[�o�[
		this.nArrExplosion = nArrExplosion;
		this.gameOver();
	}
};

//���S�ȃ}�X���J��
IKARUGA.MineSweeper.prototype.openSafe = function (nIndex) {

	var n;
	var nNeighbor;
	
	var nBomCount;
	var nArrNeighbors;

	//���łɊJ���Ă����牽�����Ȃ�
	if (this.oBoard.isOpened(nIndex)) {
		return;
	}

	//���͂̒n�����ƊJ����}�X�����߂�
	nBomCount = 0;
	nArrNeighbors = new Array();
	
	for (n = 0; n < IKARUGA.MineSweeper.NEIGHBOR_DIRECTIONS.length; n++) {
	
		//�אڂ���}�X�̈ʒu�����߂�
		nNeighbor = this.calcNeighborPos(nIndex, IKARUGA.MineSweeper.NEIGHBOR_DIRECTIONS[n]);
		//�Ֆʂ̊O���̏ꍇ�������Ȃ�
		if (nNeighbor < 0) {
			continue;
		}
		
		//�J���Ă���}�X�͑ΏۊO
		if (this.oBoard.isOpened(nNeighbor)) {
			continue;
		}
		
		//�n��������ꍇ�̓J�E���g�A�b�v����
		if (this.oMinePosition.hasBomAt(nNeighbor)) {
			nBomCount++;
			continue;
		}

		//���������Ă���ꍇ�͉������Ȃ�
		if (this.oBoard.isFlagged(nNeighbor)) {
			continue;
		}
		
		//�󂯂�}�X�ɒǉ�
		nArrNeighbors.push(nNeighbor);
	}
	
	//���͂̒n���̐���\������
	this.oBoard.setBomCount(nIndex, nBomCount);
	
	//�B���}�X�̃J�E���g�����炷
	this.nHiddenCells--;
	//�N���A���������
	if (this.nHiddenCells <= 0) {
		this.gameClear();
		return;
	}

	//���͂ɂP���n�����Ȃ��ꍇ
	if (nBomCount == 0) {
		//���͂̃}�X�������悤�ɊJ��
		for (n = 0; n < nArrNeighbors.length; n++) {
			this.openSafe(nArrNeighbors[n]);
		}
	}

};

//�אڂ���}�X�̈ʒu���v�Z����
IKARUGA.MineSweeper.prototype.calcNeighborPos = function (nIndex, oDir) {

	var nX;
	
	nX = nIndex % this.nWidth;

	if (oDir.nX < 0 && nX == 0) {
		return -1;
	}
	if (oDir.nX > 0 && nX + 1 == this.nWidth) {
		return -1;
	}
	if (oDir.nY < 0 && nIndex < this.nWidth) {
		return -1;
	}
	if (oDir.nY > 0 && nIndex + this.nWidth >= this.nCells) {
		return -1;
	}
	return nIndex + oDir.nY * this.nWidth + oDir.nX;
};

//�Q�[���N���A
IKARUGA.MineSweeper.prototype.gameClear = function () {

	var n;
	var nIndex;

	//�n���̈ʒu�ɑS�Ċ��𗧂Ă�
	for (n = 0; n < this.nBoms; n++) {
		nIndex = this.oMinePosition.getPosition(n);
		this.oBoard.setFlagged(nIndex);
	}
	this.oBoard.getTxtRemainder().value = "0";
	
	this.stopGame();
	alert("�N���A�I");
	
	//�����L���O�@�\������ꍇ�̓����L���O�ɓo�^
	if (document.frmRanking) {
		updateRanking(this.oTimer.getValue());
	}
};


//�Q�[���I�[�o�[
IKARUGA.MineSweeper.prototype.gameOver = function () {

	var n;
	var nIndex;

	//�n���̈ʒu�Ɗ����ԈႦ�ė��Ă��ӏ���\��
	for (nIndex = 0; nIndex < this.nCells; nIndex++) {
		if (this.oMinePosition.hasBomAt(nIndex)) {
			if (this.oBoard.isFlagged(nIndex)) {
			} else {
				this.oBoard.setBom(nIndex);
			}
		} else if (this.oBoard.isFlagged(nIndex)) {
			this.oBoard.setMistake(nIndex);
		}
	}

	//�����ʒu��\��
	for (n = 0; n < this.nArrExplosion.length; n++) {
		this.oBoard.setExplosion(this.nArrExplosion[n]);
	}
	
	this.stopGame();
};

/***********************************************************
 *
 * �i�C���i�[�N���X�j�}�C���X�C�[�p�C�x���g�n���h��
 *
 ***********************************************************/

//�R���X�g���N�^
IKARUGA.MineSweeper.Listener = function (oGame) {

	//�Q�[�����
	this.oGame = oGame;

	//�{�^�������ʒu
	this.nButtonIndex = -1;
	
	//�_�E���{�^���L�[
	this.nButtonKey = 0;

};

/***********************************************************
 * �萔
 ***********************************************************/

//���{�^��
IKARUGA.MineSweeper.Listener.EVENT_BUTTON_LEFT = 1;
//�E�{�^��
IKARUGA.MineSweeper.Listener.EVENT_BUTTON_RIGHT = 2;
//���{�^��
IKARUGA.MineSweeper.Listener.EVENT_BUTTON_BOTH = 3;

//���{�^��
IKARUGA.MineSweeper.Listener.EVENT_WHICH_LEFT = 1;
//�E�{�^��
IKARUGA.MineSweeper.Listener.EVENT_WHICH_RIGHT = 3;

/***********************************************************
 * �C���X�^���X���\�b�h
 ***********************************************************/

//�摜��}�E�X�_�E�����̏���
IKARUGA.MineSweeper.Listener.prototype.imgCell_onmousedown = function (ev, nIndex) {

	var nButton;

	//which���Ɍ���iFirefox�Ή��j
	if (ev.which) {
		if (ev.which == IKARUGA.MineSweeper.Listener.EVENT_WHICH_LEFT) {
			nButton = IKARUGA.MineSweeper.Listener.EVENT_BUTTON_LEFT;
		} else if (ev.which == IKARUGA.MineSweeper.Listener.EVENT_WHICH_RIGHT) {
			nButton = IKARUGA.MineSweeper.Listener.EVENT_BUTTON_RIGHT;
		} else {
			nButton = 0;
		}
		if (nIndex != this.nButtonIndex) {
			this.nButtonIndex = nIndex;
			this.nButtonKey = nButton;
		} else {
			this.nButtonKey = this.nButtonKey | nButton;
		}
	} else if (ev.button) {
		//�����ꂽ�{�^���ƃ_�E���ʒu���L��
		this.nButtonIndex = nIndex;
		this.nButtonKey = ev.button & IKARUGA.MineSweeper.Listener.EVENT_BUTTON_BOTH;
	}

};

//�摜��}�E�X�A�b�v���̏���
IKARUGA.MineSweeper.Listener.prototype.imgCell_onmouseup = function (ev, nIndex) {

	//�ʒu���_�E�����ƈقȂ�ꍇ�͏������Ȃ�
	if (nIndex != this.nButtonIndex) {
		this.nButtonIndex = -1;
		return;
	}
	this.nButtonIndex = -1;

	//�����ꂽ�{�^������
	if (this.nButtonKey == IKARUGA.MineSweeper.Listener.EVENT_BUTTON_LEFT) {
		this.oGame.imgCell_onMouseLeftClick(nIndex);
	} else if (this.nButtonKey == IKARUGA.MineSweeper.Listener.EVENT_BUTTON_RIGHT) {
		this.oGame.imgCell_onMouseRightClick(nIndex);
	} else if (this.nButtonKey == IKARUGA.MineSweeper.Listener.EVENT_BUTTON_BOTH) {
		this.oGame.imgCell_onMouseBothClick(nIndex);
	} else {
		this.oGame.imgCell_onMouseLeftClick(nIndex);
	}
};

/***********************************************************
 *
 * �i�C���i�[�N���X�j�}�C���X�C�[�p�ՖʃN���X
 *
 ***********************************************************/

//�R���X�g���N�^
IKARUGA.MineSweeper.Board = function (oGame) {

	//�t�H�[����
	this.sFrmName = "frmMineSweeper_" + oGame.sName;
	
	//�摜��
	this.sImgName = this.sFrmName + ".imgCell_";
	
	//�摜���̐��K�\���p�^�[��
	this.regImgPattern = new RegExp('^' + this.sFrmName + '\\.imgCell_(\\d+)$');
	
	//�Ֆʂ̕�
	this.nWidth = oGame.nWidth;

	//�Ֆʂ̍���
	this.nHeight = oGame.nHeight;
	
	//�}�X�̐�
	this.nCells = oGame.nCells;
	
	//�}�X�̏��
	this.sArrState = new Array(this.nCells);
	
};

/***********************************************************
 * �萔
 ***********************************************************/

//�摜�t�@�C���̃p�X
IKARUGA.MineSweeper.Board.DEFAULT_IMAGE_PATH = "./";

//�}�X�̏�ԁ|�B
IKARUGA.MineSweeper.Board.STATE_HIDDEN = "0";
//�}�X�̏�ԁ|�B�i����j
IKARUGA.MineSweeper.Board.STATE_NOT_MARKED = "01";
//�}�X�̏�ԁ|�B�i���j
IKARUGA.MineSweeper.Board.STATE_FLAGGED = "0f";
//�}�X�̏�ԁ|�B�i�H�j
IKARUGA.MineSweeper.Board.STATE_UNCERTAIN = "0h";

//�}�X�̏�ԁ|�J
IKARUGA.MineSweeper.Board.STATE_OPENED = "1";
//�}�X�̏�ԁ|�J�i��j
IKARUGA.MineSweeper.Board.STATE_VACANT = "10";
//�}�X�̏�ԁ|�J�i�n���j
IKARUGA.MineSweeper.Board.STATE_BOM = "19";
//�}�X�̏�ԁ|�J�i�����j
IKARUGA.MineSweeper.Board.STATE_EXPLOSION = "1a";
//�}�X�̏�ԁ|�J�i�~�X�j
IKARUGA.MineSweeper.Board.STATE_MISTAKE = "1b";

/***********************************************************
 * �N���X�ϐ�
 ***********************************************************/

//�摜�t�@�C���̃p�X�i�ύX�\�j
IKARUGA.MineSweeper.Board.sImagePath = IKARUGA.MineSweeper.Board.DEFAULT_IMAGE_PATH;

//�摜�L���b�V��
IKARUGA.MineSweeper.Board.oArrImage = null;

/***********************************************************
 * �N���X���\�b�h
 ***********************************************************/

//�摜�t�@�C���p�X�̐ݒ�
IKARUGA.MineSweeper.Board.setImagePath = function (sPath) {
	IKARUGA.MineSweeper.Board.sImagePath = sPath;
};

//�摜�L���b�V���̏�����
IKARUGA.MineSweeper.Board.initImageCache = function () {
	
	var n;
	
	if (IKARUGA.MineSweeper.Board.oArrImage != null) {
		return;
	}
	
	IKARUGA.MineSweeper.Board.oArrImage = new Array();

	IKARUGA.MineSweeper.Board.loadImage(IKARUGA.MineSweeper.Board.STATE_NOT_MARKED);
	IKARUGA.MineSweeper.Board.loadImage(IKARUGA.MineSweeper.Board.STATE_FLAGGED);
	IKARUGA.MineSweeper.Board.loadImage(IKARUGA.MineSweeper.Board.STATE_UNCERTAIN);

	for (n = 0; n <= 8; n++) {
		IKARUGA.MineSweeper.Board.loadImage(IKARUGA.MineSweeper.Board.STATE_OPENED + n);
	}
	IKARUGA.MineSweeper.Board.loadImage(IKARUGA.MineSweeper.Board.STATE_BOM);
	IKARUGA.MineSweeper.Board.loadImage(IKARUGA.MineSweeper.Board.STATE_EXPLOSION);
	IKARUGA.MineSweeper.Board.loadImage(IKARUGA.MineSweeper.Board.STATE_MISTAKE);
};

//�摜�����[�h����
IKARUGA.MineSweeper.Board.loadImage = function (sSrc) {

	var oImage = new Image();
	
	oImage.src = IKARUGA.MineSweeper.Board.sImagePath + sSrc + ".PNG";
	IKARUGA.MineSweeper.Board.oArrImage.push(oImage);

};

//��̊֐�
IKARUGA.MineSweeper.Board.doNothing = function () {
};

/***********************************************************
 * �C���X�^���X���\�b�h
 ***********************************************************/

//�Q�[����ʂ�`�悷��
IKARUGA.MineSweeper.Board.prototype.paint = function () {

	var nIndex;
	var sHtml;

	//�摜������������
	IKARUGA.MineSweeper.Board.initImageCache();
	
	sHtml = '';
	sHtml += '<div class="divMineSweeper" >\n';
	sHtml += '  <form name="' + this.sFrmName + '">\n';
	sHtml += '    <nobr>\n';
	sHtml += '    ����<input name="txtRemainder" type="text" size="3" value="0" readonly />��\n';
	sHtml += '    �@�@�@�@�@\n';
	sHtml += '    <input name="txtTimer" type="text" size="3" value="0" readonly />�b�o��\n';
	for (nIndex = 0; nIndex < this.nCells; nIndex++) {
		this.sArrState[nIndex] = IKARUGA.MineSweeper.Board.STATE_NOT_MARKED;
		if (nIndex % this.nWidth == 0) {
			sHtml += '<br />';
		}
		sHtml += '<img\n';
		sHtml += ' name="' + this.sImgName + nIndex + '"\n';
		sHtml += ' width="32"\n';
		sHtml += ' height="32"\n';
		sHtml += ' src="' + IKARUGA.MineSweeper.Board.sImagePath + IKARUGA.MineSweeper.Board.STATE_NOT_MARKED + '.PNG"\n';
		sHtml += ' onmousedown="this.firemousedown(event)"\n';
		sHtml += ' onmouseup="this.firemouseup(event)"\n';
		sHtml += '/>';
	}
	sHtml += '<br />';
	sHtml += '    <input type="button" name="btnRestart" value="�����P��H" />\n';
	sHtml += '    </nobr>\n';
	sHtml += '  </form>\n';
	sHtml += '</div>\n';

	document.write(sHtml);
};

//�Q�[����ʂ��ĕ`�悷��
IKARUGA.MineSweeper.Board.prototype.repaint = function () {

	var nIndex;

	//�}�X�̏�Ԃ�������
	for (nIndex = 0; nIndex < this.nCells; nIndex++) {
		this.setNotMarked(nIndex);
	}

};

//���X�i��o�^����
IKARUGA.MineSweeper.Board.prototype.registListeners = function () {

	var oBoard = this;
	var nIndex;
	var imgCell;
	
	for (nIndex = 0; nIndex < this.nCells; nIndex++) {
		imgCell = this.getImgCell(nIndex);
		imgCell.nIndex = nIndex;
		imgCell.firemousedown = function (ev) {
			oBoard.imgCell_onmousedown(ev, this.nIndex);
		};
		imgCell.firemouseup = function (ev) {
			oBoard.imgCell_onmouseup(ev, this.nIndex);
		};
	}
	//NN�p�̉E�N���b�N�}�~�����ŃL���v�`�������C�x���g�̏���
	document.addFiremousedown(
		function (ev) {
			var sTarget;
			var sArrMatches;
			var nIndex;
			
			if (!ev.target) {
				return;
			}
			if (!ev.target.name) {
				return;
			}
			
			sTarget = ev.target.name;
			sArrMatches = sTarget.match(oBoard.regImgPattern);
			
			if (!sArrMatches) {
				return;
			}
			
			nIndex = parseInt(sArrMatches[1], 10);
			oBoard.imgCell_onmousedown(ev, nIndex);
		}
	);
	
};

//���X�i����������
IKARUGA.MineSweeper.Board.prototype.activateListeners = function () {
	this.imgCell_onmousedown = this.imgCell_firemousedown;
	this.imgCell_onmouseup = this.imgCell_firemouseup;
};

//���X�i�񊈐�������
IKARUGA.MineSweeper.Board.prototype.inactivateListeners = function () {
	this.imgCell_onmousedown = IKARUGA.MineSweeper.Board.doNothing;
	this.imgCell_onmouseup = IKARUGA.MineSweeper.Board.doNothing;
};

//�t�H�[���̎擾
IKARUGA.MineSweeper.Board.prototype.getForm = function () {
	return document.forms[this.sFrmName];
};

//�c��n�����t�B�[���h�̎擾
IKARUGA.MineSweeper.Board.prototype.getTxtRemainder = function () {
	return this.getForm().txtRemainder;
};

//�^�C�}�[�t�B�[���h�̎擾
IKARUGA.MineSweeper.Board.prototype.getTxtTimer = function () {
	return this.getForm().txtTimer;
};

//�ĊJ�{�^���̎擾
IKARUGA.MineSweeper.Board.prototype.getBtnRestart = function () {
	return this.getForm().btnRestart;
};

//�}�X�ډ摜�̎擾
IKARUGA.MineSweeper.Board.prototype.getImgCell = function (nIndex) {
	return document.images[this.sImgName + nIndex];
};

//�}�X���J���Ă��邩�ǂ������肷��
IKARUGA.MineSweeper.Board.prototype.isHidden = function (nIndex) {
	return this.sArrState[nIndex].charAt(0) == IKARUGA.MineSweeper.Board.STATE_HIDDEN;
};

//�}�X�Ɉ󂪂��Ă��Ȃ��ǂ������肷��
IKARUGA.MineSweeper.Board.prototype.isNotMarked = function (nIndex) {
	return this.sArrState[nIndex] == IKARUGA.MineSweeper.Board.STATE_NOT_MARKED;
};

//���������Ă��邩�ǂ������肷��
IKARUGA.MineSweeper.Board.prototype.isFlagged = function (nIndex) {
	return this.sArrState[nIndex] == IKARUGA.MineSweeper.Board.STATE_FLAGGED;
};

//�s����Ԃǂ������肷��
IKARUGA.MineSweeper.Board.prototype.isUncertain = function (nIndex) {
	return this.sArrState[nIndex] == IKARUGA.MineSweeper.Board.STATE_UNCERTAIN;
};

//�}�X���J���Ă��邩�ǂ������肷��
IKARUGA.MineSweeper.Board.prototype.isOpened = function (nIndex) {
	return this.sArrState[nIndex].charAt(0) == IKARUGA.MineSweeper.Board.STATE_OPENED;
};

//���͂̒n�������擾����
IKARUGA.MineSweeper.Board.prototype.getBomCount = function (nIndex) {
	return parseInt(this.sArrState[nIndex], 10) - 10;
};

//�}�X�̏�Ԃ�ݒ肷��
IKARUGA.MineSweeper.Board.prototype.setState = function (nIndex, sNewState) {

	if (this.sArrState[nIndex] == sNewState) {
		return;
	}

	this.sArrState[nIndex] = sNewState;
	this.getImgCell(nIndex).src = IKARUGA.MineSweeper.Board.sImagePath + sNewState + ".PNG";
};

//�}�X�𖳈�ɐݒ肷��
IKARUGA.MineSweeper.Board.prototype.setNotMarked = function (nIndex) {
	this.setState(nIndex, IKARUGA.MineSweeper.Board.STATE_NOT_MARKED);
};

//�}�X������ɐݒ肷��
IKARUGA.MineSweeper.Board.prototype.setFlagged = function (nIndex) {
	this.setState(nIndex, IKARUGA.MineSweeper.Board.STATE_FLAGGED);
};

//�}�X���H��ɐݒ肷��
IKARUGA.MineSweeper.Board.prototype.setUncertain = function (nIndex) {
	this.setState(nIndex, IKARUGA.MineSweeper.Board.STATE_UNCERTAIN);
};

//���͂̒n������ݒ肷��
IKARUGA.MineSweeper.Board.prototype.setBomCount = function (nIndex, nCount) {
	this.setState(nIndex, IKARUGA.MineSweeper.Board.STATE_OPENED + nCount);
};

//�n���������Ԃɐݒ肷��
IKARUGA.MineSweeper.Board.prototype.setBom = function (nIndex) {
	this.setState(nIndex, IKARUGA.MineSweeper.Board.STATE_BOM);
};

//�n��������Ԃɐݒ肷��
IKARUGA.MineSweeper.Board.prototype.setExplosion = function (nIndex) {
	this.setState(nIndex, IKARUGA.MineSweeper.Board.STATE_EXPLOSION);
};

//�Ԉ���Ă��Ԃɐݒ肷��
IKARUGA.MineSweeper.Board.prototype.setMistake = function (nIndex) {
	this.setState(nIndex, IKARUGA.MineSweeper.Board.STATE_MISTAKE);
};

/***********************************************************
 *
 * �i�C���i�[�N���X�j�n���ʒu�i�[�N���X
 *
 ***********************************************************/
 
//�R���X�g���N�^
IKARUGA.MineSweeper.MinePosition = function () {
	
	//�n���ʒu
	this.nArrBoms = null;
	
	//�󂫃}�X��
	this.nEmptyCells = 0;
};
 
/***********************************************************
 * �C���X�^���X���\�b�h
 ***********************************************************/

//�Q�[���̊J�n
IKARUGA.MineSweeper.MinePosition.prototype.init = function (nCells, nBoms, nStartIndex) {

	var n;
	var nIndex;

	//�n���ʒu��������
	this.nArrBoms = new Array();
	this.nEmptyCells = nCells;

	//�ŏ��ɑI�񂾃}�X�ɒn�����u����Ȃ��悤�ɂ���
	this.insertBomAt(nStartIndex);

	//�󂢂Ă���}�X�̒����烉���_���ɒn����z�u����
	for (n = 0; n < nBoms; n++) {
		nIndex = Math.floor(Math.random() * this.nEmptyCells);
		this.insertBomAt(nIndex);
	}
	
	//�ŏ��ɑI�񂾃}�X����n������菜��
	this.removeBomAt(nStartIndex);
	
};

//�n����ǉ�����
IKARUGA.MineSweeper.MinePosition.prototype.insertBomAt = function (nIndex) {

	var nInsert;
	var nBoms;

	//�z�񒆂̑}���ʒu�����肵�A������������
	nBoms = this.nArrBoms.length;
	for (nInsert = 0; nInsert < nBoms; nInsert++) {
		if (this.nArrBoms[nInsert] > nIndex) {
			break;
		}
		nIndex++;
	}
	
	//�}��
	this[nIndex] = true;
	this.nArrBoms.splice(nInsert, 0, nIndex);
	this.nEmptyCells--;
};

//�n������菜��
IKARUGA.MineSweeper.MinePosition.prototype.removeBomAt = function (nIndex) {

	var nRemove;
	var nBoms;

	//�폜�ʒu������
	nBoms = this.nArrBoms.length;
	for (nRemove = 0; nRemove < nBoms; nRemove++) {
		if (this.nArrBoms[nRemove] == nIndex) {
			break;
		}
	}
	
	//�폜
	this[nIndex] = false;
	this.nArrBoms.splice(nRemove, 1);
	this.nEmptyCells++;
};

//�n���L���𔻒肷��
IKARUGA.MineSweeper.MinePosition.prototype.hasBomAt = function (nIndex) {

	return (this[nIndex] == true);

};

//�n���ʒu���擾����
IKARUGA.MineSweeper.MinePosition.prototype.getPosition = function (n) {

	return this.nArrBoms[n];
};

/***********************************************************
 *
 * �i�C���i�[�N���X�j�^�C�}�[�\��
 *
 ***********************************************************/

//�R���X�g���N�^
IKARUGA.MineSweeper.TimerBox = function (txt) {
	
	//�\���p�e�L�X�g�{�b�N�X
	this.txtTimer = txt;
	
	//�^�C�}�[ID
	this.nTimerId = 0;
	
};

/***********************************************************
 * �萔
 ***********************************************************/

//�X�V�C���^�[�o��
IKARUGA.MineSweeper.TimerBox.UPDATE_INTERVAL = 1000;

//�\���ő�J�E���g
IKARUGA.MineSweeper.TimerBox.MAX_CONT = "999";

/***********************************************************
 * �C���X�^���X���\�b�h
 ***********************************************************/

//�^�C�}�[�̃��Z�b�g
IKARUGA.MineSweeper.TimerBox.prototype.reset = function () {
	clearInterval(this.nTimerId);
	this.nTimerId = 0;
	this.txtTimer.value = "0";
};

//�^�C�}�[�̊J�n
IKARUGA.MineSweeper.TimerBox.prototype.start = function () {
	var oTimer = this;
	
	this.txtTimer.value = "1";
	this.nTimerId = setInterval(function () { oTimer.update() }, IKARUGA.MineSweeper.TimerBox.UPDATE_INTERVAL);
};

//�^�C�}�[�̏I��
IKARUGA.MineSweeper.TimerBox.prototype.stop = function () {
	clearInterval(this.nTimerId);
};

//�^�C�}�[�̍X�V
IKARUGA.MineSweeper.TimerBox.prototype.update = function () {
	this.txtTimer.value++;
	if (this.txtTimer.value >= IKARUGA.MineSweeper.TimerBox.MAX_CONT) {
		clearInterval(this.nTimerId);
	}
};

//�^�C�}�[�̒l���擾
IKARUGA.MineSweeper.TimerBox.prototype.getValue = function () {
	return this.txtTimer.value;
};

