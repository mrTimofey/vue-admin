export default (str, length = 2, char = '0') => {
	if (!str) str = '';
	else str = str.toString();
	return str.length >= length ? str : (new Array(length - str.length + 1).join(char) + str);
};
