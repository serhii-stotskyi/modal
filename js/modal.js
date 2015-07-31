var Modal = function (parameters) {
    var defaultSettings = {
        width: 'auto',
        height: 'auto',
        lock: false,
        hideClose: false,
        afterOpen: false,
        afterClose: false,
        hideOverlay: true,
        content: '',
        ajaxContent: '',
        contentLoaded: null,
        modalOverlay :document.createElement('div'),
        modalContainer :document.createElement('div'),
        modalHeader :document.createElement('div'),
        modalContent : document.createElement('div'),
        modalClose : document.createElement('div')
    };

    this.properties = parameters;
    for (var n in defaultSettings) {
        if (!this.properties[n]) {
            this.properties[n] = defaultSettings[n];
        }
    }

    this.properties.modalOverlay.setAttribute('id', 'modal-overlay');
    this.properties.modalContainer.setAttribute('id', 'modal-container');
    this.properties.modalHeader.setAttribute('id', 'modal-header');
    this.properties.modalContent.setAttribute('id', 'modal-content');
    this.properties.modalClose.setAttribute('id', 'modal-close');
    this.properties.modalHeader.appendChild(this.properties.modalClose);
    this.properties.modalContainer.appendChild(this.properties.modalHeader);
    this.properties.modalContainer.appendChild(this.properties.modalContent);

    this.properties.modalOverlay.style.visibility = 'hidden';
    this.properties.modalContainer.style.visibility = 'hidden';
    if (window.addEventListener) {
        window.addEventListener('load', function () {
            document.body.appendChild(parameters.modalOverlay);
            document.body.appendChild(parameters.modalContainer);
        }, false);
    }

};

Modal.prototype.open = function () {
    var _this = this;
    var properties = this.properties;


    if (this.properties && !this.properties.ajaxContent) {
        properties.modalContent.innerHTML = this.properties.content;
    } else if (this.properties.ajaxContent && !this.properties.content) {
        properties.modalContainer.className = 'modal-loading';
        this.ajax(this.properties.ajaxContent, function insertAjaxResult(ajaxResult) {
            properties.modalContent.innerHTML = ajaxResult;
            if ((properties.contentLoaded) && (typeof properties.contentLoaded == 'function')) {
                properties.contentLoaded();
            }
        });
    } else {
        properties.modalContent.innerHTML = '';
    }


    properties.modalContainer.style.width = this.properties.width;
    properties.modalContainer.style.height = this.properties.height;


    this.centering();


    if (this.properties.lock || this.properties.hideClose) {
        properties.modalClose.style.visibility = 'hidden';
    }

    function open(){
        if (properties.hideOverlay) {
            properties.modalOverlay.style.visibility = 'visible';
        }

        properties.modalContainer.style.visibility = 'visible';

        if ((properties.afterOpen) && (typeof properties.afterOpen == 'function')) {
            properties.afterOpen();
        }
    }

    document.addEventListener("keydown", function(e){
        console.log(e);
        if (e.keyCode === 27 && properties.lock !== true) {
            _this.close();
        }
    });


    properties.modalOverlay.onclick = function () {
        if (!properties.lock) {
            _this.close();
        } else {
            return false;
        }
    };

    if (window.addEventListener) {
        window.addEventListener('resize', function(){
            _this.centering();
        }, false);
    } else if (window.attachEvent) {
        window.attachEvent('onresize', function(){
            _this.centering();
        });
    }

    if(this.properties.openTimeout){
        setTimeout(function(){
            open();
        }, this.properties.openTimeout);
    }else{
        open();
    }

};


Modal.prototype.centering = function (){
    var props = this.properties;
    var documentHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight),

        modalWidth = Math.max(props.modalContainer.clientWidth, props.modalContainer.offsetWidth),
        modalHeight = Math.max(props.modalContainer.clientHeight, props.modalContainer.offsetHeight),

        browserWidth = 0,
        browserHeight = 0,

        amountScrolledX = 0,
        amountScrolledY = 0;

    if (typeof (window.innerWidth) === 'number') {
        browserWidth = window.innerWidth;
        browserHeight = window.innerHeight;
    } else if (document.documentElement && document.documentElement.clientWidth) {
        browserWidth = document.documentElement.clientWidth;
        browserHeight = document.documentElement.clientHeight;
    }

    if (typeof (window.pageYOffset) === 'number') {
        amountScrolledY = window.pageYOffset;
        amountScrolledX = window.pageXOffset;
    } else if (document.body && document.body.scrollLeft) {
        amountScrolledY = document.body.scrollTop;
        amountScrolledX = document.body.scrollLeft;
    } else if (document.documentElement && document.documentElement.scrollLeft) {
        amountScrolledY = document.documentElement.scrollTop;
        amountScrolledX = document.documentElement.scrollLeft;
    }

    if (!this.properties.horizontalOnly) {
        this.properties.modalContainer.style.top = amountScrolledY + (browserHeight / 2) - (modalHeight / 2) + 'px';
    }

    this.properties.modalContainer.style.left = amountScrolledX + (browserWidth / 2) - (modalWidth / 2) + 'px';

    this.properties.modalOverlay.style.height = documentHeight + 'px';
    this.properties.modalOverlay.style.width = '100%';
};


Modal.prototype.ajax = function (url, successCallback) {
    var _this = this;
    var i,
        XMLHttpRequestObject = false,
        XMLHttpRequestObjects = [
            function () {
                return new window.XMLHttpRequest();  // IE7+, Firefox, Chrome, Opera, Safari
            },
            function () {
                return new window.ActiveXObject('Msxml2.XMLHTTP.6.0');
            },
            function () {
                return new window.ActiveXObject('Msxml2.XMLHTTP.3.0');
            },
            function () {
                return new window.ActiveXObject('Msxml2.XMLHTTP');
            }
        ];

    for (i = 0; i < XMLHttpRequestObjects.length; i += 1) {
        try {
            XMLHttpRequestObject = XMLHttpRequestObjects[i]();
        } catch (ignore) {
        }

        if (XMLHttpRequestObject !== false) {
            break;
        }
    }

    XMLHttpRequestObject.open('GET', url, true);

    XMLHttpRequestObject.onreadystatechange = function () {
        if (XMLHttpRequestObject.readyState === 4) {
            if (XMLHttpRequestObject.status === 200) {
                successCallback(XMLHttpRequestObject.responseText);
                _this.properties.modalContainer.removeAttribute('class');
            } else {
                alert("Error with ajax was found");
            }
        }
    };


    XMLHttpRequestObject.send(null);
};

Modal.prototype.close = function () {
    this.properties.modalContent.innerHTML = '';
    this.properties.modalOverlay.setAttribute('style', '');
    this.properties.modalOverlay.style.cssText = '';
    this.properties.modalOverlay.style.visibility = 'hidden';
    this.properties.modalContainer.setAttribute('style', '');
    this.properties.modalContainer.style.cssText = '';
    this.properties.modalContainer.style.visibility = 'hidden';
    this.properties.modalHeader.style.cursor = 'default';
    this.properties.modalClose.setAttribute('style', '');
    this.properties.modalClose.style.cssText = '';


    if ((this.properties.afterClose()) && (typeof this.properties.afterClose() == 'function')) {
        this.properties.afterClose();
    }

    if (window.removeEventListener) {
        window.removeEventListener('resize', this.center, false);
    } else if (window.detachEvent) {
        window.detachEvent('onresize', this.center);
    }
};
