var modalWindow = {
    _block: null,
    _win: null,

    initBlock: function() {
        _block = document.getElementById('blockscreen'); //�������� ��� ����������� ��� �� ID

        //���� �� �� ���������, �� �������� ���
        if (!_block) {
            var parent = document.getElementsByTagName('body')[0]; //������� ������ ������� ���� body
            var obj = parent.firstChild; //��� ����, ����� �������� ��� ����������� ��� � ����� ������ ���� body
            _block = document.createElement('div'); //������� ������� div
            _block.id = 'blockscreen'; //����������� ��� ��� ID
            parent.insertBefore(_block, obj); //��������� � ������
            _block.onclick = function() { modalWindow.close(); } //������� ���������� ������� �� ������� �� ����������� ����� - ������� ��������� ����.
        }
        _block.style.display = 'inline'; //��������� CSS-��������
    },

    initWin: function(html) {
        _win = document.getElementById('modalwindow'); //�������� ���� ���������� ���� �� ID
        //���� ��� �� ����������, �� ����� �������� ��� �� ��������
        if (!_win) {
            var parent = document.getElementsByTagName('body')[0];
            var obj = parent.firstChild;
            _win = document.createElement('div');
            _win.id = 'modalwindow';
            parent.insertBefore(_win, obj);
        }
        _win.style.width = 'inherit'; //��������� ������ ����
        _win.style.display = 'inline'; //������� CSS-��������

        _win.innerHTML = html; //������� ������ HTML-����� � ���� ���������� ����

        //��������� ������� �� ������ ������

        _win.style.left = '50%'; //������� �� �����������
        _win.style.top = '50%'; //������� �� ���������

        //������������ �� ������ ����� ������� ������������� ��������
        _win.style.marginTop = -(_win.offsetHeight / 2) + 'px';
        _win.style.marginLeft = -(_win.offsetWidth  / 2) + 'px';
    },

    close: function() {
        document.getElementById('blockscreen').style.display = 'none';
        document.getElementById('modalwindow').style.display = 'none';
        modalWindow.afterClose();
    },

    open: function(html) {
        modalWindow.initBlock();
        modalWindow.initWin(html);
        modalWindow.afterOpen();
    },

    afterOpen: function() {
        setTimeout('alert("2 second afterOpen")', 2000)
    },

    afterClose: function() {
        setTimeout('alert("1 second afterClose")', 1000)
    }
}