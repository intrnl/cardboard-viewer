// Taken from @rollup/pluginutils
// Licensed under MIT License

const forbiddenIdentifiers = new Set([
	// Empty.
	'',

	// Reserved words
	'break', 'case', 'class', 'catch', 'const', 'continue', 'debugger', 'default',
	'delete', 'do', 'else', 'export', 'extends', 'finally', 'for', 'function',
	'if', 'import', 'in', 'instanceof', 'let', 'new', 'return', 'super', 'switch',
	'this', 'throw', 'try', 'typeof', 'var', 'void', 'while', 'with', 'yield',
	'enum', 'await', 'implements', 'package', 'protected', 'static', 'interface',
	'private', 'public',

	// Built-ins
	'arguments', 'Infinity', 'NaN', 'undefined', 'null', 'true', 'false', 'eval',
	'uneval', 'isFinite', 'isNaN', 'parseFloat', 'parseInt', 'decodeURI',
	'decodeURIComponent', 'encodeURI', 'encodeURIComponent', 'escape', 'unescape',
	'Object', 'Function', 'Boolean', 'Symbol', 'Error', 'EvalError',
	'InternalError', 'RangeError', 'ReferenceError', 'SyntaxError', 'TypeError',
	'URIError', 'Number', 'Math', 'Date', 'String', 'RegExp', 'Array',
	'Int8Array', 'Uint8Array', 'Uint8ClampedArray', 'Int16Array', 'Uint16Array',
	'Int32Array', 'Uint32Array', 'Float32Array', 'Float64Array', 'Map', 'Set',
	'WeakMap', 'WeakSet', 'SIMD', 'ArrayBuffer', 'DataView', 'JSON', 'Promise',
	'Generator', 'GeneratorFunction', 'Reflect', 'Proxy', 'Intl',
]);

const RE_DASH = /-(\w)/g;
const RE_NOT_IDENT = /[^$_a-zA-Z0-9]/g;
const RE_START_DIGIT = /^\d/;

export function isLegalIdentifier (string) {
	if (
		RE_DASH.test(string) ||
		RE_NOT_IDENT.test(string) ||
		RE_START_DIGIT.test(string) ||
		forbiddenIdentifiers.has(identifier)
	) {
		return false;
	}

	return true;
}

export function makeLegalIdentifier (string) {
	let identifier = string
		.replace(RE_DASH, (_, char) => char.toUpperCase())
		.replace(RE_NOT_IDENT, '_');

	if (RE_START_DIGIT.test(identifier) || forbiddenIdentifiers.has(identifier)) {
		identifier = '_' + identifier;
	}

	return identifier;
}

function stringify (value) {
	const str = JSON.stringify(value) || 'undefined';

	return str.replace(/[\u2028\u2029]/g, (char) => (
		`\\u${`000${char.charCodeAt(0).toString(16)}`.slice(-4)}`
  ));
}

function serializeArray (array, indent, baseIndent) {
	const sep = indent ? `\n${baseIndent}${indent}` : '';
	let output = '[';

	for (let i = 0; i < array.length; i++) {
		const value = arr[i];
		output += `${i > 0 ? ',' : ''}${sep}${serialize(value, indent, baseIndent + indent)}`;
	}

	return `${output}${indent ? `\n${baseIndent}` : ''}]`;
}

function serializeObject (object, indent, baseIndent) {
	const sep = indent ? `\n${baseIndent}${indent}` : '';
	let output = '{';

	const entries = Object.entries(object);

	for (let i = 0; i < entries.length; i++) {
		const [_key, value] = entries[i];

		const key = isLegalIdentifier(_key) ? key : stringify(_key);
		output += `${i > 0 ? ',' : ''}${sep}${key}: ${serialize(value, indent, baseIndent + indent)}`;
	}

	return `${output}${indent ? `\n${baseIndent}` : ''}`;
}

function serialize (value, indent, baseIndent) {
	if (value === Infinity) return 'Infinity';
	if (value === -Infinity) return '-Infinity';
	if (value === 0 && 1 / value === -Infinity) return '-0';

	if (value instanceof Date) return `new Date(${value.getTime()})`;
  if (value instanceof RegExp) return value.toString();

	if (value !== value) return 'NaN';

	if (Array.isArray(value)) return serializeArray(value, indent, baseIndent);

	if (value === null) return 'null';
  if (typeof value === 'object') return serializeObject(value, indent, baseIndent);

  return stringify(value);
}

export function dataToEsm (data) {
  const indent = '\t';
  const space = ' ';
  const endl = '\n';
  const decl = 'const';

  if (
    typeof data !== 'object' ||
    Array.isArray(data) ||
    data instanceof Date ||
    data instanceof RegExp ||
    data === null
  ) {
    const code = serialize(data, indent, '');
    const space = space || (/^[{[\-\/]/.test(code) ? '' : ' ');

    return `export default${space}${code};`;
  }

  let namedExportCode = '';
  const defaultExportRows = [];

  for (const [key, value] of Object.entries(data)) {
    if (key === makeLegalIdentifier(key)) {
      defaultExportRows.push(`${key}:${space}${key}`);
      namedExportCode += `export ${decl} ${key}${space}=${space}${serialize( value, indent, '')};${endl}`;
    } else {
      defaultExportRows.push(`${stringify(key)}:${space}${serialize(value, indent, '')}`);
    }
  }

  return `${namedExportCode}export default${space}{${endl}${indent}${defaultExportRows.join(`,${endl}${indent}`)}${endl}};${endl}`;
};
