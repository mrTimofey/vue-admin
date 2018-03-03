module.exports = less => {
	console.log('less2stylus');
	return less
		.replace(/@(.+)\s*:\s*/g, (_, $1) => '$' + $1 + ' = ')
		.replace(/@([\w-]+)/g, (_, $1) => {
			if ($1 === 'import' || $1 === 'media' || $1 === 'font-face' || $1 === 'keyframes') {
				return _;
			}
			else {
				return '$' + $1;
			}
		})
		.replace(/@{(\w+)}/g, (_, $1) => '{$' + $1 + '}')
		.replace(/\.([\w-]+) ?\(/g, '$1(')
		.replace(/\.([a-zA-Z][\w-]+);/g, '$1();')
		.replace(/( *)(.+)> *([\w-]+)\(/g, '$1$2>\n$1  $3(')
		.replace(/filter: ([^'"\n;]+)/g, 'filter: unquote("$1")')
		.replace(/: ?url\((.+):(.+)\)/g, ': url(unquote("$1:$2"))')
		.replace(/\$(.+):/g, '$$$1=')
		.replace(/~'(.+)'/g, 'unquote(\'$1\')')
		.replace(/~"(.+)"/g, 'unquote(\'$1\')')
		.replace(/, */g, ', ')
		.replace(/(: )0\.([0-9])+/g, '.$2 ')
		.replace(/\x20+$/g, '')
		.replace(/\$import/g, '@import')
		.replace(/\$media/g, '@media')
		.replace(/\$font-face/g, '@font-face')
		.replace(/\$keyframes/g, '@keyframes')
		.replace(/\$retina\s*:\s*/g, '$retina = ')
		.replace(/fadeOut/gi, 'fade-out')
		.replace(/fade-out\(#(.+),\s*(.+)\)/g, (_, color, alpha) => 'rgba(#' + color + ',' + (1 - parseFloat(alpha) * 0.01) + ')')
		.replace(/fade\((.+), (.+)\)/g, 'fade-out($1, 100 - $2)');
};
