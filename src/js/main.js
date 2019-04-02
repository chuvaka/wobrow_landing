$(function() {
	var callbackForm = new SmartFormValidator('.js-modal-form-callback');
	var orderForm = new SmartFormValidator(
		'.js-form-order',
		{
			customValidation: {
				phone: {
					empty: {
						errorText: 'необходимо заполнить поле Телефон'
					},
					invalid: {
						errorText: 'неверно введён номер телефона "+79991234567"'
					}
				},
				email: {
					empty: {
						errorText: 'необходимо заполнить поле Email'
					},
					invalid: {
						errorText: 'не сможем отправить письмо по этому адресу. email должен быть следующего формата, например, mymail@mailbox.ru'
					}
				}
			},
			disableSubmitBtn: true,
			displayError: true
		});

	// if (document.querySelector('.js-tabs')) {
	// 	var tabs = new Tabs('.js-tabs');
	// }

	// var slider = $('#slider');
	// slider.slick({
	// 	arrow: false,
	// 	autoplay: true,
	// 	autoplaySpeed: 5000,
	// 	dots: true,
	// 	infinite: true,
	// 	slidesToShow: 1,
	// 	slidesToScroll: 1,
	// 	focusOnSelect: false
	// });

	var headerHeight = $('.js-header').height(),
		$nav = $('.js-nav'),
		$navLinks = $nav.find('.nav__link'),
		$scrollItems = $navLinks.map(function () {
			var item = $($(this).attr('href'));
			if (item.length) {
				return item;
			}
		});

	var $logo = $('.js-logo');
	$logo.on('click', function (ev) {
		ev.preventDefault();
		$('html, body').animate({scrollTop: 0}, 750);
	});

	// скролинг страницы и установка активного пункта навигации
	window.addEventListener( 'scroll', function( event ) {
		var scrollTop = $(this).scrollTop(),
			fromTop = scrollTop + $nav.outerHeight() + headerHeight,
			cur = $scrollItems.map(function () {
				if ($(this).offset().top < (fromTop + 100))
					return this;
			});

		cur = cur[cur.length - 1];
		var id = (cur && cur.length) ? cur.prop('id') : '';

		$navLinks.removeClass('_active').filter("[href='#" + id + "']").addClass('_active');
	}, false );

	// ПРОКРУТКА ПО SECTION
	$navLinks.on('click', function (e) {
		e.preventDefault();
		var target = $(this).attr('href'),
			offset,
			delta;

		if (!target.length)
			return false;
		delta = ($(this).data('delta-offset')) ? parseInt($(this).data('delta-offset')) : 0;
		offset = $(target).offset().top - headerHeight + delta;

		if (target == '#hello') {
			offset -= 100;
		}

		classie.remove(document.body, 'body-md');
		classie.remove(burgerBtn, '_opened');
		burgerLabel.innerText = classie.has(burgerBtn, '_opened') ? 'закрыть' : 'меню';
		classie.remove(navDiv, '_opened');

		$('html, body').animate({scrollTop: offset}, 750);
	});

	$('.js-scroll-to').on('click', function (e) {
		e.preventDefault();
		var target = '#order',
			offset,
			delta;

		if (!target.length)
			return false;
		delta = ($(this).data('delta-offset')) ? parseInt($(this).data('delta-offset')) : 0;
		offset = $(target).offset().top - headerHeight + delta;

		$('html, body').animate({scrollTop: offset}, 750);
		$('#order-input').focus();
	});

	var navDiv = document.querySelector('.js-header-nav');
	var burger = document.querySelector('.js-burger'),
		burgerBtn = document.querySelector('button'),
		burgerLabel = burger.querySelector('span');

	var burgerFunc = function (event) {
		event.preventDefault();
		classie.toggle(document.body, 'body-md');
		classie.toggle(this, '_opened');
		burgerLabel.innerText = classie.has(this, '_opened') ? 'закрыть' : 'меню';
		classie.toggle(navDiv, '_opened');
	}
	burgerBtn.addEventListener('click', burgerFunc);

	$('.js-phone').mask('+79999999999');

	var orderForm = $('.order__form');

	$('.js-order-submit').on('click', function(event) {
		event.preventDefault();
		var form = $(this).parent().parent();
		var $name = form.find('[name="name"]');
		var $phone = form.find('[name="phone"]');
		var $email = form.find('[name="email"]');

		var $formItems = form.find('.form__item');

		var requestParams = {
			name: $name.val(),
			phone: $phone.val(),
			email: $email.val(),
		};

		$.ajax({
			async: true,
			type: "POST",
			url: "/ajax/order.php",
			dataType: "json",
			data: requestParams,
			success: function(response) {
				console.log(response)
				orderForm.find('.order__form-answer').removeClass('hide');
				orderForm.find('.order__form-answer > .ttl').text(response.message);
				form.addClass('hide');
				setTimeout(function() {
					orderForm.find('.order__form-answer').fadeOut('slow');
				}, 3000);
			},
			error: function(error) {
				console.log(error)
			}
		});

		orderForm.find('.order__form-answer').removeClass('hide');
		orderForm.find('.order__form-answer > .ttl').text('Спасибо! Ваша заявка отправлена.');
		form.addClass('hide');
		setTimeout(function() {
			orderForm.find('.order__form-answer').fadeOut('slow');
		}, 3000);

		(function() {
			requestParams = {};
			$name.val('');
			$phone.val('');
			$email.val('');
			$formItems.removeClass('form__item_active', 'form__item_focused');
		})();

		return false;
	});

	// var url = 'api/ip_adress.php';
	// var json = getFormValues('form-feedback');

	// makeRequest('POST', url, json).then(function (response) {
	// 	var res = JSON.parse(response);
	// }).catch(function (err) {
	// 	console.error('Упс! Что-то пошло не так.', err.statusText);
	// });

	var $stages = document.querySelector('.js-stages'),
		$stagesItemList = [].slice.call($stages.querySelectorAll('.stage__item'));

	$stagesItemList.forEach(function (el) {
		var head = el.querySelector('.stage__item-header');
		if (head) {
			head.addEventListener('click', function (e) {
				var isActive = classie.has(this.parentElement, 'active');
				clearActiveClass($stagesItemList);
				if (!isActive) {
					classie.add(this.parentElement, 'active');
				}
			});
		}
	});

	var clearActiveClass = function ($el, list) {
		$stagesItemList.forEach(function (el) {
			classie.remove(el, 'active');
		});
	};

	var $mdCallback = $('.js-md_callback'); // модалка с формой
	$('.js-show_md_callback').on('click', function (e) {
		e.preventDefault();
		$('body').addClass('body-md');
		$mdCallback.addClass('_show');
	});

	// закрытие модалки при нажатие на overlay
	$('.js-md-close').on('click', function() {
		$('body').removeClass('body-md');
		$(this).parent().parent().parent().removeClass('_show');
	});

	// закрытие модалки при нажатие на крестик
	$('.md__overlay').on('click', function() {
		$('body').removeClass('body-md');
		$(this).parent().removeClass('_show');
	});

	// var pathToPlaceMarkIcon = './img/';
	// var yaMapCenter = [55.714082548110134,37.66964849734497];
	// var yaMap;
	// ymaps.ready(initMap);
	// function initMap() { 
	// 	yaMap = new ymaps.Map('map', {
	// 		center: yaMapCenter,
	// 		zoom: 16,
	// 		controls: ['zoomControl']
	// 	});
	// 	var placeMark = new ymaps.Placemark(
	// 		[55.71419156901884,37.67091449999999],
	// 		{
	// 			hideIcon: false,
	// 			hintContent: 'Эксперт грин, 1-я улица Машиностроения, 10',
	// 			// balloonContent: 'Содержимое метки' + index
	// 		},
	// 		{
	// 			iconLayout: 'default#image',
	// 			iconImageHref: pathToPlaceMarkIcon + 'metka.png',
	// 			iconImageSize: [46, 63],
	// 			iconImageOffset: [-20, -54]
	// 		}
	// 	);
	// 	yaMap.geoObjects.add(placeMark);
	// 	yaMap.behaviors.disable('scrollZoom');
	// }
});