/*!
 * classie v1.0.1
 * class helper functions
 * from bonzo https://github.com/ded/bonzo
 * MIT license
 * 
 * classie.has( elem, 'my-class' ) -> true/false
 * classie.add( elem, 'my-new-class' )
 * classie.remove( elem, 'my-unwanted-class' )
 * classie.toggle( elem, 'my-class' )
 */

(function( window ) {

	'use strict';
	
	// class helper functions from bonzo https://github.com/ded/bonzo
	
	function classReg( className ) {
	  return new RegExp("(^|\\s+)" + className + "(\\s+|$)");
	}
	
	// classList support for class management
	// altho to be fair, the api sucks because it won't accept multiple classes at once
	var hasClass, addClass, removeClass;
	
	if ( 'classList' in document.documentElement ) {
	  hasClass = function( elem, c ) {
		return elem.classList.contains( c );
	  };
	  addClass = function( elem, c ) {
		elem.classList.add( c );
	  };
	  removeClass = function( elem, c ) {
		elem.classList.remove( c );
	  };
	}
	else {
	  hasClass = function( elem, c ) {
		return classReg( c ).test( elem.className );
	  };
	  addClass = function( elem, c ) {
		if ( !hasClass( elem, c ) ) {
		  elem.className = elem.className + ' ' + c;
		}
	  };
	  removeClass = function( elem, c ) {
		elem.className = elem.className.replace( classReg( c ), ' ' );
	  };
	}
	
	function toggleClass( elem, c ) {
	  var fn = hasClass( elem, c ) ? removeClass : addClass;
	  fn( elem, c );
	}
	
	var classie = {
	  // full names
	  hasClass: hasClass,
	  addClass: addClass,
	  removeClass: removeClass,
	  toggleClass: toggleClass,
	  // short names
	  has: hasClass,
	  add: addClass,
	  remove: removeClass,
	  toggle: toggleClass
	};
	
	// transport
	if ( typeof define === 'function' && define.amd ) {
	  // AMD
	  define( classie );
	} else if ( typeof exports === 'object' ) {
	  // CommonJS
	  module.exports = classie;
	} else {
	  // browser global
	  window.classie = classie;
	}
	
})(window);

// форматирует число, разделяя на триады
var formatNumber = function (number, round) {
	var result1 = 0;
	var i1 = 0;
	var i2 = 0;
	var result1str = '';
	var result1fin = '';
	var i = 0;
	var str = '';
	var delimiter;
	var rounded = 0;

	if (round !== false)
		result1 = Math.round(number);
	else {
		result1 = Math.floor(number);
		rounded = number - result1;
		rounded = rounded.toFixed(2);
	}

	result1str = result1 + '';
	i1 = result1str.length % 3;
	i2 = result1str.length - i1;
	if (i1 > 0)
		result1fin = result1str.substring(0, i1);
	i = i1;
	while (i < result1str.length) {
		delimiter = ' ';
		if (i === 0) {
			delimiter = '';
		}
		result1fin = result1fin + delimiter + result1str.substring(i, i + 3);
		i = i + 3;
	}
	if (result1fin.substring(0, 1) == ' ')
		result1fin = result1fin.substring(1, result1fin.length);
	str = result1fin;

	if (round === false && rounded > 0) {
		str += rounded.substring(1);
	}

	return str.trim();
}