/*
 * MIT License
 *
 * Copyright (c) 2021 gh0$t
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
javascript:
(function (window) {

	/** reset html_css_xtractr **/
	if (document.getElementById('html_css_xtractrWrapper')) {
		document.body.removeChild(html_css_xtractrWrapper);
		delete window.html_css_xtractr;
	}

	/** CONFIG **/
	window.html_css_xtractr = {};
	var winhtml_css_xtractr = window.html_css_xtractr;
	winhtml_css_xtractr.config = {
		html_css_xtractr_zIndex: 9999,
		html_css_xtractr_Height: 514,
		html_css_xtractr_Width: 350,
		extractorTimer: 1,
		extractorIndicatorWidth: 3
	};

	var iframeElement = null;
	var iframeChildElement = null;
	var iframeElementEventListenerFunction;
	var iframeChildElementEventListenerFunction;

	/** debug stats - number of times data extraction is performed **/
	winhtml_css_xtractr.interactionIndex = 0;

	/** html_css_xtractr interaction - drag & drop **/
	winhtml_css_xtractr.mydragg = function () {
		return {
			move: function (divid, xpos, ypos) {
				divid.style.left = xpos + 'px';
				divid.style.top = ypos + 'px';
			},
			startMoving: function (divid, evt) {
				evt = evt || window.event;
				var posX = evt.clientX,
					posY = evt.clientY,
					divTop = divid.style.top,
					divLeft = divid.style.left,
					eWi = parseInt(divid.style.width),
					eHe = parseInt(divid.style.height),
					cWi = parseInt(document.body.style.width),
					cHe = parseInt(document.body.style.height);
				document.body.style.cursor = 'move';
				divTop = divTop.replace('px', '');
				divLeft = divLeft.replace('px', '');
				var diffX = posX - divLeft,
					diffY = posY - divTop;
				document.onmousemove = function (evt) {
					evt = evt || window.event;
					var posX = evt.clientX,
						posY = evt.clientY,
						aX = posX - diffX,
						aY = posY - diffY;
					if (aX < 0) aX = 0;
					if (aY < 0) aY = 0;
					if (aX + eWi > cWi) aX = cWi - eWi;
					if (aY + eHe > cHe) aY = cHe - eHe;
					winhtml_css_xtractr.mydragg.move(divid, aX, aY);
				}
			},
			stopMoving: function () {
				var a = document.createElement('script');
				document.body.style.cursor = 'default';
				document.onmousemove = function () { }
			},
		}
	}();

	/** html_css_xtractr container **/
	winhtml_css_xtractr.html_css_xtractrWrapper = document.createElement('DIV');
	var winhtml_css_xtractrWrapper = winhtml_css_xtractr.html_css_xtractrWrapper;
	winhtml_css_xtractrWrapper.className = 'html_css_xtractrClass';
	winhtml_css_xtractrWrapper.id = 'html_css_xtractrWrapper';
	winhtml_css_xtractrWrapper.setAttribute('onmousedown', 'window.html_css_xtractr.mydragg.startMoving(this,event);');
	winhtml_css_xtractrWrapper.setAttribute('onmouseup', 'window.html_css_xtractr.mydragg.stopMoving();');
	document.body.appendChild(winhtml_css_xtractrWrapper);

	/** html_css_xtractr styles **/
	winhtml_css_xtractr.style = document.createElement('STYLE');
	winhtml_css_xtractr.style.className = 'html_css_xtractrClass';
	winhtml_css_xtractr.style.textContent = `
	/** html_css_xtractr styles (start) **/
	.html_css_xtractrFocus:not(.html_css_xtractrClass) {
		outline : ` + winhtml_css_xtractr.config.extractorIndicatorWidth + `px dashed pink !important;
	}
	#html_css_xtractrWrapper {
		position : fixed !important;
		z-index : ` + winhtml_css_xtractr.config.html_css_xtractr_zIndex + ` !important;
		height : ` + winhtml_css_xtractr.config.html_css_xtractr_Height + `px !important;
		width : ` + winhtml_css_xtractr.config.html_css_xtractr_Width + `px !important;
		padding : 10px !important;
		top : 0;
		left : 0;
		background-color : #0a0a0a !important;
		border : 5px solid red !important;
		color : #fff !important;
		text-align: left !important;
	}
	#html_css_xtractrHeader {
		display: inline-block !important;
		width: 90% !important;
	}
	#html_css_xtractrClose {
		float : right !important;
		background-color : transparent !important;
		border : none !important;
		padding-right : 7px !important;
		color : #fff !important;
		cursor : pointer !important;
	}
	#html_css_xtractrDivider {
		margin : 5px 0 !important;
	}
	#html_css_xtractrContentLeft {
		display: inline-block !important;
		vertical-align: top !important;
		padding: 1rem !important;
		width: calc(100% - 2*(1rem)) !important;
	}
	br.html_css_xtractrClass {
		display: block !important;
		line-height: 1.5rem !important;
	}
	#elementsExtractedLabel,
	#elementStructureLabel,
	#elementIDLabel,
	#elementClassesLabel,
	#logLabel {
		color: #fff !important;
	}
	#elementsExtracted,
	#elementID,
	#elementClasses {
		font-family: monospace;
		font-size: 15px;
		height: 25px !important;
		width: calc(100% - 22px) !important;
		padding: 0 11px;
	}
	#elementStructure,
	#log {
		font-family: monospace;
		font-size: 15px;
		height : 100px !important;
		width : calc(100% - 22px) !important;
		padding: 0 11px;
		overflow : auto !important;
	}
	/** html_css_xtractr styles (end) **/
	`;
	winhtml_css_xtractrWrapper.appendChild(winhtml_css_xtractr.style);

	/** html_css_xtractr header **/
	winhtml_css_xtractr.header = document.createElement('SPAN');
	winhtml_css_xtractr.header.className = 'html_css_xtractrClass';
	winhtml_css_xtractr.header.id = 'html_css_xtractrHeader';
	winhtml_css_xtractr.header.textContent = 'HTML & CSS Xtractr Tool (hover on elements for atleast ' + winhtml_css_xtractr.config.extractorTimer + ' sec. to extract styles from non-iframe pages, and atleast ' + (winhtml_css_xtractr.config.extractorTimer * 2 + 1) + ' sec. from iframes.)';
	winhtml_css_xtractrWrapper.appendChild(winhtml_css_xtractr.header);

	/** DESTROY : html_css_xtractr interaction - close **/
	winhtml_css_xtractr.html_css_xtractrClose = document.createElement('SPAN');
	winhtml_css_xtractr.html_css_xtractrClose.className = 'html_css_xtractrClass';
	winhtml_css_xtractr.html_css_xtractrClose.id = 'html_css_xtractrClose';
	winhtml_css_xtractr.html_css_xtractrClose.textContent = 'x';
	winhtml_css_xtractr.html_css_xtractrClose.onclick = function () {
		clearTimeout(winhtml_css_xtractr.extractorTimeout);
		document.body.removeEventListener('onmouseover', winhtml_css_xtractr.mouseHandler, false);
		document.body.removeEventListener('onmouseout', winhtml_css_xtractr.mouseHandler, false);
		if (iframeElement) {
			iframeElement.removeEventListener('onmouseover', iframeElementEventListenerFunction, false);
			iframeChildElement.removeEventListener('onmouseout', iframeChildElementEventListenerFunction, false);
		}
		document.body.removeChild(html_css_xtractrWrapper);
		delete window.html_css_xtractr;
	};
	winhtml_css_xtractrWrapper.appendChild(winhtml_css_xtractr.html_css_xtractrClose);

	/** html_css_xtractr horizontal divider **/
	winhtml_css_xtractr.html_css_xtractrDivider = document.createElement('HR');
	winhtml_css_xtractr.html_css_xtractrDivider.className = 'html_css_xtractrClass';
	winhtml_css_xtractr.html_css_xtractrDivider.id = 'html_css_xtractrDivider';
	winhtml_css_xtractrWrapper.appendChild(winhtml_css_xtractr.html_css_xtractrDivider);

	/** html_css_xtractr content main **/
	winhtml_css_xtractr.html_css_xtractrContentMain = document.createElement('DIV');
	var winhtml_css_xtractrContentMain = winhtml_css_xtractr.html_css_xtractrContentMain;
	winhtml_css_xtractrContentMain.className = 'html_css_xtractrClass';
	winhtml_css_xtractrContentMain.id = 'html_css_xtractrContentMain';
	winhtml_css_xtractrWrapper.appendChild(winhtml_css_xtractrContentMain);

	/** html_css_xtractr content left **/
	winhtml_css_xtractr.html_css_xtractrContentLeft = document.createElement('DIV');
	var winhtml_css_xtractrContentLeft = winhtml_css_xtractr.html_css_xtractrContentLeft;
	winhtml_css_xtractrContentLeft.className = 'html_css_xtractrClass';
	winhtml_css_xtractrContentLeft.id = 'html_css_xtractrContentLeft';
	winhtml_css_xtractrContentMain.appendChild(winhtml_css_xtractrContentLeft);

	/** fields in left panel **/
	var leftPanelFields = {
		'interactionCount' : {
			'labelID':'elementsExtractedLabel',
			'labelText':'Interaction Count',
			'inputFieldID':'elementsExtracted'
		},
		'DOMStructure' : {
			'labelID':'elementStructureLabel',
			'labelText':'DOM Structure',
			'inputFieldID':'elementStructure'
		},
		'elementId' : {
			'labelID':'elementIDLabel',
			'labelText':'Element ID',
			'inputFieldID':'elementID'
		},
		'elementClasses' : {
			'labelID':'elementClassesLabel',
			'labelText':'Element Classes',
			'inputFieldID':'elementClasses'
		},
		'computedStyles' : {
			'labelID':'logLabel',
			'labelText':'Computed Styles',
			'inputFieldID':'log'
		}
	};

	for(var leftPanelField in leftPanelFields){
		winhtml_css_xtractr[leftPanelFields[leftPanelField]['labelID']] = document.createElement('LABEL');
		winhtml_css_xtractr[leftPanelFields[leftPanelField]['labelID']].className = 'html_css_xtractrClass';
		winhtml_css_xtractr[leftPanelFields[leftPanelField]['labelID']].id = leftPanelFields[leftPanelField]['labelID'];
		winhtml_css_xtractr[leftPanelFields[leftPanelField]['labelID']].textContent = leftPanelFields[leftPanelField]['labelText'];
		winhtml_css_xtractrContentLeft.appendChild(winhtml_css_xtractr[leftPanelFields[leftPanelField]['labelID']]);

		winhtml_css_xtractr[leftPanelFields[leftPanelField]['inputFieldID']] = document.createElement('TEXTAREA');
		winhtml_css_xtractr[leftPanelFields[leftPanelField]['inputFieldID']].className = 'html_css_xtractrClass';
		winhtml_css_xtractr[leftPanelFields[leftPanelField]['inputFieldID']].id = leftPanelFields[leftPanelField]['inputFieldID'];
		winhtml_css_xtractrContentLeft.appendChild(winhtml_css_xtractr[leftPanelFields[leftPanelField]['inputFieldID']]);
	}

	/** page interaction - on mouseover & mouseout **/
	document.body.onmouseover =
	document.body.onmouseout =
	winhtml_css_xtractr.mouseHandler = function (event) {
			if (window.html_css_xtractr) {
				var et = event.target;
				if (!et.classList.contains('html_css_xtractrClass')) {
					if (event.type == 'mouseover') {

						/** html_css_xtractr & page interaction - check for iframes, non-iframes, and set the html_css_xtractr Page Name field **/
						var iframeChecker = function (targetElement) {
							if (targetElement.tagName === 'IFRAME') {
								iframeElement = targetElement;
								targetElement.contentDocument.body.onmouseover = targetElement.contentDocument.body.onmouseout = winhtml_css_xtractr.mouseHandler;
								iframeElementEventListenerFunction = function (iframeEvent) {
									iframeEvent.preventDefault();
									iframeEvent.stopPropagation();
									et = iframeEvent.target;
									iframeChildElement = et;
									if (!targetElement.contentDocument.head.querySelector('.html_css_xtractrClass')) {
										var styleToBeInjected = document.createElement('STYLE');
										styleToBeInjected.className = 'html_css_xtractrClass';
										styleToBeInjected.textContent = `
									.html_css_xtractrFocus {
										outline : ` + winhtml_css_xtractr.config.extractorIndicatorWidth + `px dashed pink !important;
									}
									`;
										targetElement.contentDocument.head.appendChild(styleToBeInjected);
									}
									iframeChildElementEventListenerFunction = function (iframeEvent) {
										var removeElementsByClass = function (className) {
											var elements = targetElement.contentDocument.getElementsByClassName(className);
											while (elements.length > 0) {
												elements[0].parentNode.removeChild(elements[0]);
											}
										};
										removeElementsByClass('html_css_xtractrClass');
									};
									et.addEventListener('mouseout', iframeChildElementEventListenerFunction);
								};
								targetElement.contentDocument.body.addEventListener('mouseover', iframeElementEventListenerFunction);
							}
						};
						iframeChecker(et); 
						
						/** page interaction - visual indicator for hovered element **/
						et.classList.add('html_css_xtractrFocus'); 
						
						/** html_css_xtractr & page interaction - data extraction from hovered elements and setting of respective fields in the html_css_xtractr tool **/
						winhtml_css_xtractr.html_css_xtractrFocusedElementPropertyExtractorFunction = function () {
							log.value = '';
							winhtml_css_xtractr.interactionIndex++;
							console.log(et);
							elementsExtracted.value = winhtml_css_xtractr.interactionIndex;
							elementStructure.value = et.outerHTML.replace('html_css_xtractrFocus', '');
							elementID.value = et.id;
							elementClasses.value = et.className.replace('html_css_xtractrFocus', '');
							var styles = window.getComputedStyle(et, null);
							for (style in styles) {
								if (styles.hasOwnProperty(style)) {
									log.value += style + ':  ' + styles[style] + '\n';
								}
							}

						};
						winhtml_css_xtractr.extractorTimeout = setTimeout(winhtml_css_xtractr.html_css_xtractrFocusedElementPropertyExtractorFunction, winhtml_css_xtractr.config.extractorTimer * 1000);
					}

					/** page interaction - remove visual indicator once hovered out of an element **/
					if (event.type == 'mouseout') {
						clearTimeout(winhtml_css_xtractr.extractorTimeout);
						et.classList.remove('html_css_xtractrFocus');
					}
				}
			}
		}

})(window);