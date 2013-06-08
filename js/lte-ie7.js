/* Load this script using conditional IE comments if you need to support IE 7 and IE 6. */

window.onload = function() {
	function addIcon(el, entity) {
		var html = el.innerHTML;
		el.innerHTML = '<span style="font-family: \'Flat-UI-Icons\'">' + entity + '</span>' + html;
	}
	var icons = {
			'fui-facebook' : '&#xe03f;',
			'fui-twitter' : '&#xe042;',
			'fui-skype' : '&#xe045;',
			'fui-linkedin' : '&#xe049;',
			'fui-googleplus' : '&#xe04a;',
			'fui-dribbble' : '&#xe04c;',
			'fui-behance' : '&#xe04e;',
			'fui-github' : '&#xe000;'
		},
		els = document.getElementsByTagName('*'),
		i, attr, html, c, el;
	for (i = 0; ; i += 1) {
		el = els[i];
		if(!el) {
			break;
		}
		attr = el.getAttribute('data-icon');
		if (attr) {
			addIcon(el, attr);
		}
		c = el.className;
		c = c.match(/fui-[^\s'"]+/);
		if (c && icons[c[0]]) {
			addIcon(el, icons[c[0]]);
		}
	}
};