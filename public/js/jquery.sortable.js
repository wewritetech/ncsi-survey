/**
 * jQuery sorTable.js
 *
 * Version: 0.1.0
 * Sources: https://github.com/miriti/jquery.sortable.js
 *
 * License:
 * --------
 * Copyright Â© 2014 Michael Miriti, Poly Ploy
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to
 * deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * The Software is provided "as is", without warranty of any kind, express or
 * implied, including but not limited to the warranties of merchantability,
 * fitness for a particular purpose and noninfringement. In no event shall the
 * authors or copyright holders be liable for any claim, damages or other
 * liability, whether in an action of contract, tort or otherwise, arising
 * from, out of or in connection with the software or the use or other dealings
 * in the Software.
 */
 (function($) {
	$.fn.sortable = function () {
		var tbody = this.find('tbody[data-body=true]');
		var thead = $(this).find('thead[data-header=true] th[data-sort-column=true]');

		function sort_by_column(col_num, desc) {

			function extract_value(tr) {
				var td = $(tr).find('td')[col_num];

				var sort_value = $(td).html();

				var data_sort_value = $(td).attr('data-sort-value');
				if(typeof data_sort_value !== "undefined") {
					sort_value = data_sort_value;
				}

				return sort_value;
			}

			var allTrs = tbody.find('tr');

			tbody.find('tr').remove();

			allTrs.sort(function(tr_a, tr_b) {
				var aval = extract_value(tr_a);
				var bval = extract_value(tr_b);

				if(isNaN(aval) || isNaN(bval))
				{
					return aval.localeCompare(bval);
				}else{
					aval = parseFloat(aval);
					bval = parseFloat(bval);
					return (aval > bval ? 1 : (bval > aval) ? -1 : 0);
				}
			});

			if(desc)
			{
				for (var i = allTrs.length-1; i >= 0; i--) {				
					$(allTrs[i]).appendTo(tbody);
				};
			}else{
				for (var i = 0; i < allTrs.length; i++) {				
					$(allTrs[i]).appendTo(tbody);
				};
			}
		}		

		$.each(thead, function (i, th) {
			var linkText = $(th).html();
			$(th).html('');

			var reverse = false;

			$('<a/>', {
				'text': linkText + ' >',
				'data-base-text': linkText,
				'href': '#',
				'class': 'sortable-header-link',
				'click': function () {
					sort_by_column(i, reverse);
					reverse = !reverse;

					$.each($('a.sortable-header-link'), function(i, a) {
						$(a).html($(a).attr('data-base-text') + ' >');
					});

					var baseText = $(this).attr('data-base-text');					
					$(this).html(baseText + ( reverse ? " <" : " >"));

					return false;
				}
			}).appendTo(th);

		});
	}
})(jQuery);