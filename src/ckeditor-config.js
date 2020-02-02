/* eslint-disable camelcase */
export default {
	ckfinder: {
		uploadUrl: '/api/upload',
		options: {
			resourceType: 'Images',
		},
	},
	heading: {
		options: [
			{ model: 'paragraph', title: 'Абзац', view: 'p' },
			{ model: 'heading2', title: 'Заголовок 2', view: 'h2' },
			{ model: 'heading3', title: 'Заголовок 3', view: 'h3' },
			{ model: 'heading4', title: 'Заголовок 4', view: 'h4' },
		],
	},
	toolbar: {
		items: [
			'heading',
			'|',
			'removeFormat',
			'|',
			'bold',
			'italic',
			'link',
			'bulletedList',
			'numberedList',
			'codeBlock',
			'blockQuote',
			'insertTable',
			'highlight',
			'strikethrough',
			'subscript',
			'superscript',
			'underline',
			'|',
			'alignment',
			'|',
			'horizontalLine',
			'|',
			'indent',
			'outdent',
			'|',
			'mediaEmbed',
			'CKFinder',
			'|',
			'undo',
			'redo',
		],
	},
	image: {
		toolbar: [
			'imageTextAlternative',
			'imageStyle:full',
			'imageStyle:side',
		],
	},
	table: {
		contentToolbar: [
			'tableColumn',
			'tableRow',
			'mergeTableCells',
		],
	},
};
