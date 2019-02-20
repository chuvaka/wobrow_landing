/**
 * Умный валидатор форм
 * @author Aleksey Kondratyev
 */
;(function(window) {

	'use strict';

	var extend = function (a, b) {
		for (var key in b) {
			a[key] = b[key];
		}
		return a;
	};

	/**
	 * 
	 * @param {*} selector селектор формы
	 * @param {*} params наименование селекторов для контролов, лейблов и т.д.
	 * @param {*} settings дополнительные настройки
	 */
	var SmartFormValidator = function (selector, params, settings) {
		if (!this._checkSelector(selector)) {
			return;
		}

		this.$el = document.querySelector(selector);

		this._params = extend(this._params, params);

		// лейблы у контролов
		this.$formLabels = [].slice.call(this.$el.querySelectorAll(this._params.selectorFormLabels));

		// инпуты, селекты, чекбоксы, радиобатоны
		this.$formControls = [].slice.call(this.$el.querySelectorAll(this._params.selectorFormControls));
		this.inputs = {};

		this.$submitBtn;

		this.errors = 0;

		// console.log(this._params.customValidation)

		this._init();
	};

	SmartFormValidator.prototype._checkSelector = function (selector) {
		return document.querySelector(selector);
	};

	SmartFormValidator.prototype._params = {
		selectorFormLabels: '.form__label',
		selectorFormControls: '.form__control',
		selectorErrorDiv: '.form__error',
		selectorSubmitBtn: '.js-form-submit',
		classNameActive: 'form__item_active',
		classNameFocused: 'form__item_focused',
		classNameError: 'form__item_error',
		defaultErrorText: 'необходимо заполнить',
		customValidation: {},
		displayError: false
	};

	SmartFormValidator.prototype._settings = {

	};

	SmartFormValidator.prototype._init = function () {
		this._initEventForLabels();
		this._initSubmitBtn();
		this._initFormCtrls();
	};

	SmartFormValidator.prototype._initEventForLabels = function () {
		var self = this;
		this.$formLabels.forEach(function (label) {
			self._addEventForLabel(label);
		});
	};

	SmartFormValidator.prototype._addEventForLabel = function (label) {
		var self = this;
		label.addEventListener('click', function () {
			var parent = this.parentNode;
			classie.add(parent, self._params.classNameActive);
			classie.add(parent, self._params.classNameFocused);

			var input = this.previousElementSibling;
			input.focus();
		});
	};

	SmartFormValidator.prototype._initSubmitBtn = function () {
		this.$submitBtn = this.$el.querySelector(this._params.selectorSubmitBtn);
		this.$submitBtn.disabled = true;
	};


	// создаст для каждого элемента формы свой объект
	SmartFormValidator.prototype._initFormCtrls = function () {
		var self = this;
		this.$formControls.forEach(function (el, id) {
			if (!self.inputs.hasOwnProperty(el.name)) {
				var input = {
					id: id,
					$el: el,
					type: el.type, // text, select, checkbox
					field: el.getAttribute('data-field'), // тип поля: телефон, email и т.д.
					name: el.name,
					value: el.value,
					required: el.hasAttribute('_required'),
					rule: null,
					error: false,
					changed: false, // прим. при валидации, чтобы не проставлять ошибку у других элементов, значение которых не менялось)
					active: false, // инпут в фокусе или имеет значение
					valid: false
				}
				self.inputs[el.name] = input
			}

			self._addInputEvent(el);
		});

		// console.log('_initinputs', this.inputs)ы
	};

	SmartFormValidator.prototype._addInputEvent = function (el) {
		var self = this;

		if (el.type === 'text') {
			el.addEventListener('focus', function () {
				var parent = this.parentNode;
				if (!classie.has(parent, self._params.classNameActive)) {
					classie.add(parent, self._params.classNameActive);
				}
				if (!classie.has(parent, self._params.classNameFocused)) {
					classie.add(parent, self._params.classNameFocused);
				}
			});
			
			el.addEventListener('keyup', function () {
				self._setInputStatusChanged(this.name);
				self._validate();
			});
	
			el.addEventListener('blur', function () {
				if (!this.value) {
					var parent = this.parentNode;
					classie.remove(parent, self._params.classNameActive);
					classie.remove(parent, self._params.classNameFocused);
				}
			});
		} else if (el.type === 'checkbox') {
			el.addEventListener('change', function () {
				self._validate();
			});
		}
	};

	SmartFormValidator.prototype._setInputStatusChanged = function (inputName) {
		if (!this.inputs[inputName].changed) {
			this.inputs[inputName].changed = true;
		}
	};

	// запускает валидацию инпутов и в случае успешной проверки разблокирует кнопку отправки формы
	SmartFormValidator.prototype._validate = function () {
		for (var inputName in this.inputs) {
			var input = this.inputs[inputName];
			
			if (input.required) {
				// console.log(input.name, this._validateInput(input))
				if (!this._validateInput(input)) {
					input.error = true;
					input.valid = false;
				} else {
					input.error = false;
					input.valid = true;
				}
			}
		}

		this._outErrors();
	};

	// проверяет инпуты, в зависимости от их типа (емаил, телефон, урл и т.д.)
	SmartFormValidator.prototype._validateInput = function (el) {
		switch (el.field) {
			case 'checkbox':
				return (function(value) {
					return value;
				})(el.$el.checked);
			default:
				return (function(value) {
					if (el.field === 'email') {
						var regExp = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
						return value ? regExp.test(value) : null;
					}
					return value;
				})(el.$el.value);
		}
	};

	// выводит ошибки и проставляет классы родительскому контейнеру
	SmartFormValidator.prototype._outErrors = function () {
		this.errors = 0;

		for (var inputName in this.inputs) {
			var input = this.inputs[inputName];
			var parent = input.$el.parentNode;
			var $errorDiv = parent.querySelector(this._params.selectorErrorDiv);

			if (input.error) {
				this.errors++;
			}

			if (input.error && input.changed) {
				if ($errorDiv && this._params.displayError) {
					if (this._params.customValidation.hasOwnProperty(input.name)) {
						$errorDiv.innerText = this._params.customValidation[inputName].errorText;
					} else {
						$errorDiv.innerText = this._params.defaultErrorText;
					}
				}
				classie.add(parent, this._params.classNameError);
				classie.add(input.$el, '_error');
			} else {
				if ($errorDiv) {
					$errorDiv.innerText = '';
				}
				classie.remove(parent, this._params.classNameError);
				classie.remove(input.$el, '_error');
			}

			if (!input.error && input.valid && input.changed) {
				classie.add(parent, this._params.classNameActive);
			}
		}

		this.$submitBtn.disabled = this.errors > 0;
	};

	// сбрасывает значения формы и все классы с ошибками (example: может быть вызвана после успешной отправки формы)
	SmartFormValidator.prototype.resetForm = function () {
		var self = this;
		this.$formControls.forEach(function(el) {
			el.value = '';
			classie.remove(el, '_error');
			classie.remove(el.$el.parentNode, self._params.classNameError);
		});
		this.$submitBtn.disabled = true;
	};

	window.SmartFormValidator = SmartFormValidator;

})(window);