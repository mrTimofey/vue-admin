import { convert2date } from 'src/utils';
import pad from 'src/filters/pad';

export default (v, seconds) => {
	if (!(v instanceof Date)) v = convert2date(v);
	if (!v) return '';
	let time = [v.getHours(), v.getMinutes()];
	if (seconds) time.push(v.getSeconds());
	return time.map(v => pad(v)).join(':');
};
