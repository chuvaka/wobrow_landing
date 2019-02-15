/**
 * @author Aleksey Kondratyev
 */
(function(window) {

	'use strict';

	var extend = function (a, b) {
		for (var key in b) {
			if (b.hasOwnProperty(key)) {
				a[key] = b[key];
			}
		}
		return a;
	};

	/**
	 * Табы
	 * @param {*} selector 
	 * @param {*} params 
	 */
	var Tabs = function (selector, params) {

		this._params = extend({}, this._params);
		extend(this._params, params);

		this.$el = document.querySelector(selector);

		this.$tabs = [].slice.call(this.$el.querySelectorAll('.tab'));
		this.$tabContentList = [].slice.call(this.$el.querySelectorAll('.tabs__content-item'));

		this._init();
	};

	Tabs.prototype._params = {
		activeClass: '_active'
	};

	Tabs.prototype._init = function () {
		this._initTabs();
		this._initEvents();
	};

	Tabs.prototype._initEvents = function () {
		var self = this;

		this.$tabs.forEach(function(tab) {
			tab.addEventListener('click', function() {
				if (!classie.has(this, self._params.activeClass)) {
					var tabIndex = this.dataset.tab;
					self.setActiveTab(tabIndex);
				}
			});
		});
	};

	Tabs.prototype._initTabs = function () {
		classie.add(this.$tabs[0], this._params.activeClass);
		classie.add(this.$tabContentList[0], this._params.activeClass);
	};

	Tabs.prototype.getActiveTab = function () {
		var self = this
		return this.$tabs.filter(function (tab) {
			return classie.has(tab, self._params.activeClass);
		})
	};

	Tabs.prototype.setActiveTab = function (tabIndex) {
		this.deactiveTab();
		classie.add(this.$tabs[tabIndex], this._params.activeClass);
		classie.add(this.$tabContentList[tabIndex], this._params.activeClass);
	};

	Tabs.prototype.deactiveTab = function () {
		var activeTab = this.getActiveTab()[0];
		if (activeTab) {
			classie.remove(activeTab, this._params.activeClass);
			classie.remove(this.$tabContentList[activeTab.dataset.tab], this._params.activeClass);
		}
	};

	window.Tabs = Tabs;

})(window);
