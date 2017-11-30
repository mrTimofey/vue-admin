import capitalize from './capitalize';
export default v => {
	if (v === 'id') return 'ID';
	const pieces = v.split(/[-_]/);
	pieces[0] = capitalize(pieces[0]);
	return pieces.join(' ');
};
