;(function($) {
if ($.xNet) {
	return;
}

function isString(obj) {
	return typeof obj == "string" || Object.prototype.toString.call(obj) === "[object String]";
}


/*
 * jQuery.xNet:  Wrap "jQuery.ajax" method with JSON response style.
 *               Support all ajax parameters as default. Extending or Changing below parameters' usage.
 * @dataType:    Optional. The value is "JSON" forever. You can't override it.
 * @traditional: Optional. Defaut value is "true". Same explanation as "jQuery.ajax" method.
 * @errorCodes:  Optional. Extended property, which used for list error codes you want to catching.
 *               Codes list will separate by comma, or use "*" as the wildcard.
 *               The default HTTP error code is -1. So, you can catch HTTP error also.
 *               Example:
 *                 errorCodes: "2,3,4", or errorCodes: "*"
 * @success:     Optional. Callback for the Ajax response, when "code" value is "0".
 * @error:       Optional. Callback for the Ajax response, when "code" value other than "0".
 */
$.xNet = function(settings) {

	// It's used for handling "success" and "error" callback.
	function callback(result) {
		if (!$.isPlainObject(result) || !$.isNumeric(result["code"]) ||
			(result["code"] != 0 && !result["message"]) ||
			(result["code"] != 0 && !isString(result["message"]))) {
			result = {
				code: -6,
				message: "Network response is illegal."
			};
		}

		if (result.code == 0) {
			if ($.isFunction(settings.success)) {
				settings.success(result);
			}
		}
		else if (settings.errorCodes == "*" ||
				(settings.errorCodes && new RegExp( "^" + result.code + "$|" +
											"^" + result.code + "[\s,]+|" +
											"[\s,]+" + result.code + "$|" +
											"[\s,]+" + result.code + "[\s,]+", "i").
											test(settings.errorCodes + ""))) {
			if ($.isFunction(settings.error)) {
				settings.error(result);
			}
		}
		else {
			// Below alert popup maybe not good for your project.
			// So, you can change the alert to any other warning way.
			alert(result.message);
		}
	}

	var options = $.extend({traditional: true}, settings, {
		dataType: "json",
		success: callback,
		error: function(xhr, status) {
			var map = {
				"abort": {
					code: -1,
					message: "Network request is aborted."
				},
				"parsererror": {
					code: -2,
					message: "Network response is parsing error."
				},
				"timeout": {
					code: -3,
					message: "Network request is timeout."
				},
				"error": {
					code: -4,
					message: "Network error."
				}
			};

			var result = map[status];
			if (!result) {
				result = {
					code: -5,
					message: "Unknown network error."
				}
			}

			// You can change the default HTTP error code if it conflict.
			callback(result);
		}
	});

	return $.ajax(options);
}
})(jQuery);
