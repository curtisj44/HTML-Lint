// TODO: keep in sync with `/src/scripts/htmlLint.test.js`
exports.collection = {
	// ---- Tags ----
	'a:empty, b:empty, abbr:empty, acronym:empty, button:empty, dd:empty, div:empty, dl:empty, dt:empty, h1:empty, h2:empty, h3:empty, h4:empty, h5:empty, h6:empty, form:empty, fieldset:empty, label:empty, li:empty, ol:empty, p:empty, span:empty, strong:empty, ul:empty': {
		'label': 'empty tag'
	},
	'applet': {
		'label': '`applet`'
	},
	'center': {
		'label': '`center`'
	},
	'font': {
		'label': '`font`'
	},
	'iframe': {
		'label': '`iframe`'
	},
	'noscript': {
		'label': '`noscript`'
	},
	's': {
		'label': '`s`'
	},
	'strike': {
		'label': '`strike`'
	},
	'u': {
		'label': '`u`'
	},
	'br + br': {
		'label': 'Multiple `br`’s (* not quite accurate)'
	},

	// // ---- Attributes ----
	':contains("=NOTFOUND!")': {
		'label': 'Missing SiteCore resource'
	},

	'abbr:not([title])': {
		'label': '`abbr` missing `title`'
	},
	'acronym:not([title])': {
		'label': '`acronym` missing `title`'
	},
	'a:contains("Click here"), a:contains("click here")': {
		'label': '“Click here” used as link text'
	},
	'a:contains("Read more"), a:contains("Read more")': {
		'label': '“Read more” used as link text'
	},
	'a:not([href])': {
		'label': '`a` missing `href`'
	},
	'a[href=""]': {
		'label': '`a[href=""]`'
	},
	'a[href="#"]': {
		'label': '`a[href="#"]`'
	},
	'a[href*="javascript:"]': {
		'label': '`a[href*="javascript:"]`'
	},
	'a[href*="<"]': {
		'label': '`a[href*="<"]`'
	},
	'a[href*=">"]': {
		'label': '`a[href*=">"]`'
	},
	'a[href*="{"]': {
		'label': '`a[href*="{"]`'
	},
	'a[href*="}"]': {
		'label': '`a[href*="}"]`'
	},
	'a[target]': {
		'label': '`a[target]`'
	},
	//'head script:not([src*="hasJS.js"], [src*="swfobject.js"], [src*="google-analytics.com"])': {
	//	'label': '`script` in the `head`'
	//},
	'fieldset:not(:has(legend))': {
		'label': '`fieldset` missing `legend`'
	},
	'fieldset > *:not(legend):first-child': {
		'label': '`fieldset`’s first child is not `legend`'
	},
	'form[action=""]': {
		'label': '`form[action=""]`'
	},
	'form[action="#"]': {
		'label': '`form[action="#"]`'
	},
	'form:not(:has(fieldset))': {
		'label': '`form` missing `fieldset`'
	},
	'input[type="text"]': {
		'label': '`type="text"` is not needed on `input`'
	},
	'img:not([alt])': {
		'label': '`img` missing `alt` attribute'
	},
	'img:not(".tracking")[alt=""]': {
		'label': '`img[alt=""]`'
	},

	// > Describe the image briefly, but avoid the phrase “image of” or “graphic of”. Because screen readers already know it is a graphic.
	// https://www.marcozehe.de/2015/12/14/the-web-accessibility-basics/
	'img[alt*="graphic of"]': {
		'label': '"graphic of" used in `img` `alt`'
	},
	'img[alt*="image of"]': {
		'label': '"image of" used in `img` `alt`'
	},
	'img[alt*="picture of"]': {
		'label': '"picture of" used in `img` `alt`'
	},

	'img[src=""]': {
		'label': '`img[src=""]`'
	},
	'img[width="1"][height="1"]': {
		'label': 'Tracking pixel `img`'
	},
	// `button` provides more styling options, pseudo elements, and embedding of more than a text string
	'input[type="submit"]': {
		'label': 'Prefer `<button type="submit">` over `<input type="submit">`'
	},
	'label:not([for])': {
		'label': '`label` missing `for`'
	},
	'body link:not("#html-lint-css")': {
		'label': '`link` not in `head`'
	},
	'link:not([rel])': {
		'label': '`link` missing `rel`'
	},
	'link[charset]': {
		'label': '`link[charset]`'
	},
	'link[rel="shortcut icon"][type="image/ico"]': {
		'label': '`type="images/ico"` is not needed on `link`'
	},
	'link[rel="stylesheet"][media="all"]': {
		'label': '`media="all"` is not needed on `link`'
	},
	'link[rel="stylesheet"][type="text/css"]': {
		'label': '`type="text/css"` is not needed on `link`'
	},
	// https://msdn.microsoft.com/en-us/library/jj676915%28v=vs.85%29.aspx?f=255&MSPPError=-2147217396
	'meta[http-equiv="X-UA-Compatible"]': {
		'label': 'Specifying a legacy document mode via `X-UA-Compatible` is considered deprecated and should no longer be used'
	},
	// https://developer.apple.com/library/ios/releasenotes/General/RN-iOSSDK-8.0/
	'meta[name="viewport"][content*="minimal-ui"]': {
		'label': '`minimal-ui` has been retired'
	},
	'nav:not([role])': {
		'label': '`nav` missing `role`'
	},
	'script[charset]': {
		'label': '`script[charset]`'
	},
	'script[language]': {
		'label': '`language` attribute is not valid on `script`'
	},
	'script[type="text/javascript"]': {
		'label': '`type="text/javascript"` is not needed on `script`'
	},
	'style[media="all"]': {
		'label': '`media="all"` is not needed on `style`'
	},
	'style[type="text/css"]': {
		'label': '`type="text/css"` is not needed on `style`'
	},
	'table:not([summary])': {
		'label': '`table` missing `summary`'
	},
	//'table:not(:has(caption))': {
	//	'label': '`table` missing `caption`'
	//},
	'table:not(:has(th))': {
		'label': '`table` missing `th`'
	},
	'table table': {
		'label': '`table` inside `table`'
	},

	// TODO: Currently causes this error: `TypeError: Cannot read property 'type' of undefined`
	// 'th:not([scope])': {
	// 	'label': '`th` missing `scope`'
	// },

	'th[scope=""]': {
		'label': '`th[scope=""]`'
	},

	':not("canvas, img, object, rect, svg")[height]': {
		'label': 'Invalid attribute: `height`'
	},
	':not("canvas, img, object, rect, svg")[width]': {
		'label': 'Invalid attribute: `width`'
	},

	'[align]': {
		'label': 'Invalid attribute: `align`'
	},
	'[alink]': {
		'label': 'Bad attribute: `alink`'
	},
	'[background]': {
		'label': 'Invalid attribute: `background`'
	},
	'[bgcolor]': {
		'label': 'Invalid attribute: `bgcolor`'
	},
	'[border]': {
		'label': 'Bad attribute: `border`'
	},
	'[cellpadding]': {
		'label': 'Bad attribute: `cellpadding`'
	},
	'[cellspacing]': {
		'label': 'Bad attribute: `cellspacing`'
	},
	'[class=""]': {
		'label': '`class=""`'
	},
	'[frameborder]': {
		'label': 'Bad attribute: `frameborder`'
	},
	'[halign]': {
		'label': 'Invalid attribute: `halign`'
	},
	'[id=""]': {
		'label': '`id=""`'
	},
	'[link]': {
		'label': 'Bad attribute: `link`'
	},
	'[marginheight]': {
		'label': 'Bad attribute: `marginheight`'
	},
	'[marginwidth]': {
		'label': 'Bad attribute: `marginwidth`'
	},
	'[name=""]': {
		'label': '`name=""`'
	},
	// https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_button_role
	'[role="button"]': {
		'label': '`[role="button"]`'
	},
	'[shape]': {
		'label': 'Bad attribute: `shape`'
	},
	'[size]': {
		'label': 'Bad attribute: `size`'
	},
	'[src*="javascript:"]': {
		'label': '`[src*="javascript:"]`'
	},
	'[style*="background"]': {
		'label': 'Inline style: `background`'
	},
	'[style*="border"]': {
		'label': 'Inline style: `border`'
	},
	'[style*="font"]': {
		'label': 'Inline style: `font`'
	},
	'[style*="letter-spacing"]': {
		'label': 'Inline style: `letter-spacing`'
	},
	'[style*="line-height"]': {
		'label': 'Inline style: `line-height`'
	},
	'[style*="list-style"]': {
		'label': 'Inline style: `list-style`'
	},
	'[style*="outline"]': {
		'label': 'Inline style: `outline`'
	},
	'[style*="resize"]': {
		'label': 'Inline style: `resize`'
	},
	'[style*="text"]': {
		'label': 'Inline style: `text`'
	},
	'[style*="vertical"]': {
		'label': 'Inline style: `vertical`'
	},
	'[style*="word"]': {
		'label': 'Inline style: `word`'
	},
	'[tabindex]': {
		'label': 'Bad attribute: `tabindex`'
	},
	'[title=""]': {
		'label': '`title` attribute is empty'
	},
	'[valign]': {
		'label': 'Invalid attribute: `valign`'
	},
	'[vlink]': {
		'label': 'Bad attribute: `vlink`'
	},

	// --- Inline event handlers ----

	'[onabort]': {
		'label': 'Inline event handler: `onabort`'
	},
	'[onautocomplete]': {
		'label': 'Inline event handler: `onautocomplete`'
	},
	'[onautocompleteerror]': {
		'label': 'Inline event handler: `onautocompleteerror`'
	},
	'[onafterprint]': {
		'label': 'Inline event handler: `onafterprint`'
	},
	'[onbeforeprint]': {
		'label': 'Inline event handler: `onbeforeprint`'
	},
	'[onbeforeunload]': {
		'label': 'Inline event handler: `onbeforeunload`'
	},
	'[onblur]': {
		'label': 'Inline event handler: `onblur`'
	},
	'[oncancel]': {
		'label': 'Inline event handler: `oncancel`'
	},
	'[oncanplay]': {
		'label': 'Inline event handler: `oncanplay`'
	},
	'[oncanplaythrough]': {
		'label': 'Inline event handler: `oncanplaythrough`'
	},
	'[onchange]': {
		'label': 'Inline event handler: `onchange`'
	},
	'[onclick]': {
		'label': 'Inline event handler: `onclick`'
	},
	'[onclose]': {
		'label': 'Inline event handler: `onclose`'
	},
	'[oncontextmenu]': {
		'label': 'Inline event handler: `oncontextmenu`'
	},
	'[oncopy]': {
		'label': 'Non-standard, inline event handler: `oncopy`'
	},
	'[oncuechange]': {
		'label': 'Inline event handler: `oncuechange`'
	},
	'[oncut]': {
		'label': 'Non-standard, inline event handler: `oncut`'
	},
	'[ondblclick]': {
		'label': 'Inline event handler: `ondblclick`'
	},
	'[ondrag]': {
		'label': 'Inline event handler: `ondrag`'
	},
	'[ondragdrop]': {
		'label': 'Inline event handler: `ondragdrop`'
	},
	'[ondragend]': {
		'label': 'Inline event handler: `ondragend`'
	},
	'[ondragenter]': {
		'label': 'Inline event handler: `ondragenter`'
	},
	'[ondragexit]': {
		'label': 'Inline event handler: `ondragexit`'
	},
	'[ondragleave]': {
		'label': 'Inline event handler: `ondragleave`'
	},
	'[ondragover]': {
		'label': 'Inline event handler: `ondragover`'
	},
	'[ondragstart]': {
		'label': 'Inline event handler: `ondragstart`'
	},
	'[ondrop]': {
		'label': 'Inline event handler: `ondrop`'
	},
	'[ondurationchange]': {
		'label': 'Inline event handler: `ondurationchange`'
	},
	'[onemptied]': {
		'label': 'Inline event handler: `onemptied`'
	},
	'[onended]': {
		'label': 'Inline event handler: `onended`'
	},
	'[onerror]': {
		'label': 'Inline event handler: `onerror`'
	},
	'[onfocus]': {
		'label': 'Inline event handler: `onfocus`'
	},
	'[onhashchange]': {
		'label': 'Inline event handler: `onhashchange`'
	},
	'[oninput]': {
		'label': 'Inline event handler: `oninput`'
	},
	'[oninvalid]': {
		'label': 'Inline event handler: `oninvalid`'
	},
	'[onkeydown]': {
		'label': 'Inline event handler: `onkeydown`'
	},
	'[onkeypress]': {
		'label': 'Inline event handler: `onkeypress`'
	},
	'[onkeyup]': {
		'label': 'Inline event handler: `onkeyup`'
	},
	'[onlanguagechange]': {
		'label': 'Inline event handler: `onlanguagechange`'
	},
	'[onload]': {
		'label': 'Inline event handler: `onload`'
	},
	'[onloadeddata]': {
		'label': 'Inline event handler: `onloadeddata`'
	},
	'[onloadedmetadata]': {
		'label': 'Inline event handler: `onloadedmetadata`'
	},
	'[onloadstart]': {
		'label': 'Inline event handler: `onloadstart`'
	},
	'[onmessage]': {
		'label': 'Inline event handler: `onmessage`'
	},
	'[onmousedown]': {
		'label': 'Inline event handler: `onmousedown`'
	},
	'[onmouseenter]': {
		'label': 'Inline event handler: `onmouseenter`'
	},
	'[onmouseleave]': {
		'label': 'Inline event handler: `onmouseleave`'
	},
	'[onmousemove]': {
		'label': 'Inline event handler: `onmousemove`'
	},
	'[onmouseout]': {
		'label': 'Inline event handler: `onmouseout`'
	},
	'[onmouseover]': {
		'label': 'Inline event handler: `onmouseover`'
	},
	'[onmouseup]': {
		'label': 'Inline event handler: `onmouseup`'
	},
	'[onmousewheel]': {
		'label': 'Inline event handler: `onmousewheel`'
	},
	'[onmove]': {
		'label': 'Inline event handler: `onmove`'
	},
	'[onoffline]': {
		'label': 'Inline event handler: `onoffline`'
	},
	'[ononline]': {
		'label': 'Inline event handler: `ononline`'
	},
	'[onpagehide]': {
		'label': 'Inline event handler: `onpagehide`'
	},
	'[onpageshow]': {
		'label': 'Inline event handler: `onpageshow`'
	},
	'[onpaste]': {
		'label': 'Non-standard, inline event handler: `onpaste`'
	},
	'[onpause]': {
		'label': 'Inline event handler: `onpause`'
	},
	'[onplay]': {
		'label': 'Inline event handler: `onplay`'
	},
	'[onplaying]': {
		'label': 'Inline event handler: `onplaying`'
	},
	'[onpopstate]': {
		'label': 'Inline event handler: `onpopstate`'
	},
	'[onprogress]': {
		'label': 'Inline event handler: `onprogress`'
	},
	'[onreset]': {
		'label': 'Inline event handler: `onreset`'
	},
	'[onresize]': {
		'label': 'Inline event handler: `onresize`'
	},
	'[onscroll]': {
		'label': 'Inline event handler: `onscroll`'
	},
	'[onseeked]': {
		'label': 'Inline event handler: `onseeked`'
	},
	'[onseeking]': {
		'label': 'Inline event handler: `onseeking`'
	},
	'[onselect]': {
		'label': 'Inline event handler: `onselect`'
	},
	'[onshow]': {
		'label': 'Inline event handler: `onshow`'
	},
	'[onsort]': {
		'label': 'Inline event handler: `onsort`'
	},
	'[onstalled]': {
		'label': 'Inline event handler: `onstalled`'
	},
	'[onstorage]': {
		'label': 'Inline event handler: `onstorage`'
	},
	'[onsubmit]': {
		'label': 'Inline event handler: `onsubmit`'
	},
	'[onsuspend]': {
		'label': 'Inline event handler: `onsuspend`'
	},
	'[ontimeupdate]': {
		'label': 'Inline event handler: `ontimeupdate`'
	},
	'[ontoggle]': {
		'label': 'Inline event handler: `ontoggle`'
	},
	'[onunload]': {
		'label': 'Inline event handler: `onunload`'
	},
	'[onvolumechange]': {
		'label': 'Inline event handler: `onvolumechange`'
	},
	'[onwaiting]': {
		'label': 'Inline event handler: `onwaiting`'
	},

	// Ids & Classes
	'#ContentWrapper': {
		'label': 'Bad Id: `ContentWrapper`'
	},
	'.MsoNormal': {
		'label': 'Bad Class: `MsoNormal`'
	},

	// http://guides.rubyonrails.org/i18n.html#adding-translations
	'.translation_missing, [placeholder*="translation_missing"]': {
		'label': 'Missing Rails i18n string'
	}
};
