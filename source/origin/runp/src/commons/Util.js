function MAX(x, y) {
	return x > y ? x : y;
}

function MIN(x, y) {
	return x < y ? x : y;
}

function RandomExcept(arrin, exp, funequ) {
	funequ = funequ || function(a, b) {
		return a == b;
	}
	var arr = [];
	for(var i = 0; i < arrin.length; i += 1) {
		arr[i] = arrin[i];
	}
	var arrres = [];
	for(var i = 0; i < arr.length; i += 1) {
		if (!funequ(arr[i], exp)) {
			arrres.push(arr[i]);
		}
	}
	return arrres[parseInt(Math.random() * arrres.length)];
}