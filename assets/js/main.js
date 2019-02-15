$(function() {
	// var watcherScroll = new WatcherScrollPage();

	var callbackForm = new SmartFormValidator('.js-modal-form-callback');
	var orderForm = new SmartFormValidator('.js-form-order');

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

	var navDiv = document.querySelector('.js-header-nav');
	var burger = document.querySelector('.js-burger'),
		burgerBtn = document.querySelector('button'),
		burgerLabel = burger.querySelector('span');
	burgerBtn.addEventListener('click', function (e) {
		e.preventDefault();
		classie.toggle(this, '_opened');
		burgerLabel.innerText = classie.has(this, '_opened') ? 'закрыть' : 'меню';
		classie.toggle(navDiv, '_opened');
	});

	$('.js-form-submit').on('click', function(event) {
		event.preventDefault();
		var error = 0;
		var form = $(this).parent().parent();
		var $name = form.find('[name="name"]');
		// if (!name) {
		// 	classie.add(name, '_error');
		// 	error++;
		// };
		var $email = form.find('[name="email"]');
		var $msg = form.find('[name="msg"]');

		var requestParams = {
			name: $name.val(),
			email: $email.val(),
			msg: $msg.val()
		};

		if(!error) {
			$.ajax({
				async: true,
				type: "POST",
				url: "/ajax/feedback.php",
				dataType: "json",
				data: requestParams,
				success: function(response) {
					console.log(response)
				},
				error: function(error) {
					console.log(error)
				}
			});
		};

		(function() {
			requestParams = {};
			$name.val('');
			$email.val('');
			$msg.val('');
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