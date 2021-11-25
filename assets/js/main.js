var sec1 = false,
	gisv = false;
S(window).event().add('scroll', function (ev) {
	if (window.scrollY > 150 && !sec1) {
		sec1 = true;
		setTimeout(function () {
			var lss1 = S('#sec1 .seccont li .sccont');
			lss1.each(function (e) {
				e.countup(parseInt(e.attr().getData('i')), parseInt(e.attr().getData('e')), 50, 2000);
			});
		}, 500);
	}
	// Back to top button
	var g = S('#gototop');
	if (window.scrollY > 300) {
		if (!gisv) {
			g.css('display', 'flex');
			setTimeout(function () {
				g.class().add('open');
			}, 500);
		}
		gisv = true;
	} else {
		if (gisv) {
			g.class().remove('open');
			setTimeout(function () {
				g.css('display', 'none');
			}, 500);
		}
		gisv = false;
	}
});
S('.slider').slider(10, 2);
S('#jointop').event().add('click', function (ev) {
	S('#sec4').scrollTo();
});
S('#usermenutrigger').event().add('click', function (ev) {
	ev.preventDefault();
	var um = S('.usermenu'),
		cl = um.class().contains('open');
	um.class().toggle('open');
	if (!cl) {
		um.attr().set('tabindex', '1');
		um[0].focus();
	}
});
S('.usermenu').event().add('focusout', function () {
	setTimeout(function () {
		S('.usermenu.open').class().remove('open');
	}, 300);
});
S('#gototop').event().add('click', function (ev) {
	ev.preventDefault();
	S('.header-top').scrollTo();
});