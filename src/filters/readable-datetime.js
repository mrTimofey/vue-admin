import { convert2date } from 'src/utils';
import i18n from 'src/i18n';

export default v => {
	if (!(v instanceof Date)) v = convert2date(v);
	if (!v) return '';
	return i18n.d(v, 'long') || (v.toLocaleDateString() + ' ' + v.toLocaleTimeString());
};
