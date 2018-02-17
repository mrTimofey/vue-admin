import pad from './pad';
export default (v, precision) => {
	if (!v) return '0';
	if (!precision) precision = 2;
	const divider = Math.pow(10, precision);
	let str = parseInt(v).toLocaleString('en').replace(',', ' '),
		decs = parseInt(v * divider % divider);
	if (decs) str += '.' + pad(decs, precision);
	return str;
};
