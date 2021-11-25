(function (W, D) {
	function selector (s, parent) {
		var el = [D.createElement('DIV')];
		if (!s) {
			return el;
		}
		if (s.els) {
			return s.els;
		}
		if (s != null && typeof(s) == 'object' && s instanceof Array) {
			var i, sels = [];
			for (i = 0; i < s.length; i++) {
				sels.push(selector(s[i])[0]);
			}
			return sels;
		}
		if (s != null && typeof(s) == 'object') {
			return [s];
		}
		try {
			if (!parent) {
				el = D.querySelectorAll(s);
			} else {
				el = parent.querySelectorAll(s);
			}
		} catch (e) {}
		return el;
	}
	function feach (els, func) {
		if (!els  || typeof(els.length) != 'number' || (typeof(els.length) == 'number' && els.length == 0)) {
			return;
		}
		for (var i = 0; i < els.length; i++) {
			if (els[i] instanceof HTMLElement || els[i] == W || els[i] == D) {
				if (func(els[i])) {
					break;
				}
			}
		}
	}
	function Lib (sel, parent) {
		if (!(this instanceof Lib)) {
			return new Lib(sel, parent);
		}
		this.els = selector(sel, parent);
		for (var i = 0; i < this.els.length; i++) {
			this[i] = this.els[i];
		}
	}
	Lib.prototype.class = function () {
		var t = this;
		return {
			get: function () {
				var c = '';
				t.each(function (e) {
					c = e.className;
					return true;
				}, true);
				return c;
			},
			set: function (c) {
				t.attr().set('class', c);
				return t;
			},
			contains: function (c) {
				var h = false;
				t.each(function (e) {
					h = e.classList.contains(c);
					return true;
				}, true);
				return h;
			},
			toggle: function (c) {
				t.each(function (e) {
					if (e.classList.contains(c)) {
						t.class().remove(c);
					} else {
						t.class().add(c);
					}
				}, true);
				return t;
			},
			remove: function (c) {
				t.each(function (e) {
					if (typeof(c) == 'string') {
						e.classList.remove(c);
					} else if (typeof(c) == 'object' && typeof(c.length) == 'number') {
						for (var i = 0; i < c.length; i++) {
							e.classList.remove(c[i]);
						}
					}
				}, true);
				return t;
			},
			add: function (c) {
				t.each(function (e) {
					if (typeof(c) == 'string') {
						e.classList.add(c);
					} else if (typeof(c) == 'object' && typeof(c.length) == 'number') {
						for (var i = 0; i < c.length; i++) {
							e.classList.add(c[i]);
						}
					}
				}, true);
				return t;
			}
		};
	};
	Lib.prototype.attr = function () {
		var t = this;
		return {
			getData: function (a) {
				return t.attr().get('data-' + a);
			},
			setData: function (a, v) {
				t.attr().set('data-' + a, v);
				return t;
			},
			get: function (a) {
				var vl = '';
				t.each(function (e) {
					vl = e.getAttribute(a);
					return true;
				}, true);
				return vl;
			},
			set: function (a, v) {
				t.each(function (e) {
					e.setAttribute(a, v);
				}, true);
				return t;
			}
		};
	};
	Lib.prototype.each = function (func, ee) {
		feach(this.els, function (el) {
			if (ee) {
				func(el);
			} else {
				func(S(el));
			}
		});
	};
	Lib.prototype.css = function (props, val) {
		if (!props) {
			return;
		}
		if (typeof(props) == 'string' && typeof(val) == 'string') {
			this.each(function (el) {
				el.style[props] = val;
			}, true);
			return;
		}
		if (typeof(props) == 'string') {
			var vl = null;
			feach(this.els, function (el) {
				vl = W.getComputedStyle(el)[props];
				return true;
			});
			return vl;
		}
		this.each(function (el) {
			for (var i in props) {
				el.style[i] = props[i];
			}
		}, true);
	};
	Lib.prototype.event = function () {
		var t = this;
		return {
			add: function (n, f) {
				t.each(function (el) {
					var evs = (el.__events || {});
					var i = 0;
					while (typeof(evs[n + i]) == 'function') {
						i++;
					}
					evs[n + i] = f;
					el.__events = evs;
					el.addEventListener(n, f, false);
				}, true);
			},
			remove: function (n) {
				t.each(function (el) {
					var evs = (el.__events || {});
					for (var i in evs) {
						el.removeEventListener(n, evs[i], false);
					}
				}, true);
			}
		};
	};
	Lib.prototype.countup = function (i, e, d, s) {
		this.each(function (el) {
			var	current = i,
			loops = Math.ceil(s / d),
            increment = (e - i) / loops,
            count = 0,
			timer = setInterval(function () {
				count++;
				current += Math.floor(increment);
				el.innerHTML = '+' + current;
				if (count >= loops) {
					el.innerHTML = e;
					clearInterval(timer);
				}
			}, d);
		}, true);
	};
	Lib.prototype.slider = function (time, tr) {
		var cur = 1;
		var t = this;
		feach(this.els, function (el) {
			S(el).css({'width': S(el).css('width'), 'overflow': 'hidden'});
			var slides = S('.slide', el);
			slides.css('width', S(el).css('width'));
			if (slides.els.length > 0) {
				slides.css('opacity', '0');
				S(slides.els[0]).css('opacity', '1');
			}
			setTimeout (function () {
				slides.css('transition', 'opacity ' + tr + 's ease-in');
			});
			var tot = slides.els.length - 1;
			var timer = setInterval (function () {
				slides.css('opacity', '0');
				S(slides.els[cur]).css('opacity', '1');
				cur = (cur >= tot ? 0 : cur + 1);
			}, time * 1000);
			return true;
		});
	};
	Lib.prototype.scrollTo = function () {
		feach(this.els, function (el) {
			W.scrollTo({
				'behavior': 'smooth',
				'top': el.offsetTop,
				'left': el.offsetLeft
			});
			return true;
		});
	};
	W.S = Lib;
})(window, document);