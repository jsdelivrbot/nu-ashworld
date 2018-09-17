(function(scope){
'use strict';

function F(arity, fun, wrapper) {
  wrapper.a = arity;
  wrapper.f = fun;
  return wrapper;
}

function F2(fun) {
  return F(2, fun, function(a) { return function(b) { return fun(a,b); }; })
}
function F3(fun) {
  return F(3, fun, function(a) {
    return function(b) { return function(c) { return fun(a, b, c); }; };
  });
}
function F4(fun) {
  return F(4, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return fun(a, b, c, d); }; }; };
  });
}
function F5(fun) {
  return F(5, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return fun(a, b, c, d, e); }; }; }; };
  });
}
function F6(fun) {
  return F(6, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return fun(a, b, c, d, e, f); }; }; }; }; };
  });
}
function F7(fun) {
  return F(7, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return fun(a, b, c, d, e, f, g); }; }; }; }; }; };
  });
}
function F8(fun) {
  return F(8, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) {
    return fun(a, b, c, d, e, f, g, h); }; }; }; }; }; }; };
  });
}
function F9(fun) {
  return F(9, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) { return function(i) {
    return fun(a, b, c, d, e, f, g, h, i); }; }; }; }; }; }; }; };
  });
}

function A2(fun, a, b) {
  return fun.a === 2 ? fun.f(a, b) : fun(a)(b);
}
function A3(fun, a, b, c) {
  return fun.a === 3 ? fun.f(a, b, c) : fun(a)(b)(c);
}
function A4(fun, a, b, c, d) {
  return fun.a === 4 ? fun.f(a, b, c, d) : fun(a)(b)(c)(d);
}
function A5(fun, a, b, c, d, e) {
  return fun.a === 5 ? fun.f(a, b, c, d, e) : fun(a)(b)(c)(d)(e);
}
function A6(fun, a, b, c, d, e, f) {
  return fun.a === 6 ? fun.f(a, b, c, d, e, f) : fun(a)(b)(c)(d)(e)(f);
}
function A7(fun, a, b, c, d, e, f, g) {
  return fun.a === 7 ? fun.f(a, b, c, d, e, f, g) : fun(a)(b)(c)(d)(e)(f)(g);
}
function A8(fun, a, b, c, d, e, f, g, h) {
  return fun.a === 8 ? fun.f(a, b, c, d, e, f, g, h) : fun(a)(b)(c)(d)(e)(f)(g)(h);
}
function A9(fun, a, b, c, d, e, f, g, h, i) {
  return fun.a === 9 ? fun.f(a, b, c, d, e, f, g, h, i) : fun(a)(b)(c)(d)(e)(f)(g)(h)(i);
}




var _List_Nil = { $: 0 };
var _List_Nil_UNUSED = { $: '[]' };

function _List_Cons(hd, tl) { return { $: 1, a: hd, b: tl }; }
function _List_Cons_UNUSED(hd, tl) { return { $: '::', a: hd, b: tl }; }


var _List_cons = F2(_List_Cons);

function _List_fromArray(arr)
{
	var out = _List_Nil;
	for (var i = arr.length; i--; )
	{
		out = _List_Cons(arr[i], out);
	}
	return out;
}

function _List_toArray(xs)
{
	for (var out = []; xs.b; xs = xs.b) // WHILE_CONS
	{
		out.push(xs.a);
	}
	return out;
}

var _List_map2 = F3(function(f, xs, ys)
{
	for (var arr = []; xs.b && ys.b; xs = xs.b, ys = ys.b) // WHILE_CONSES
	{
		arr.push(A2(f, xs.a, ys.a));
	}
	return _List_fromArray(arr);
});

var _List_map3 = F4(function(f, xs, ys, zs)
{
	for (var arr = []; xs.b && ys.b && zs.b; xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A3(f, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map4 = F5(function(f, ws, xs, ys, zs)
{
	for (var arr = []; ws.b && xs.b && ys.b && zs.b; ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A4(f, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map5 = F6(function(f, vs, ws, xs, ys, zs)
{
	for (var arr = []; vs.b && ws.b && xs.b && ys.b && zs.b; vs = vs.b, ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A5(f, vs.a, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_sortBy = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		return _Utils_cmp(f(a), f(b));
	}));
});

var _List_sortWith = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		var ord = A2(f, a, b);
		return ord === elm$core$Basics$EQ ? 0 : ord === elm$core$Basics$LT ? -1 : 1;
	}));
});



// EQUALITY

function _Utils_eq(x, y)
{
	for (
		var pair, stack = [], isEqual = _Utils_eqHelp(x, y, 0, stack);
		isEqual && (pair = stack.pop());
		isEqual = _Utils_eqHelp(pair.a, pair.b, 0, stack)
		)
	{}

	return isEqual;
}

function _Utils_eqHelp(x, y, depth, stack)
{
	if (depth > 100)
	{
		stack.push(_Utils_Tuple2(x,y));
		return true;
	}

	if (x === y)
	{
		return true;
	}

	if (typeof x !== 'object' || x === null || y === null)
	{
		typeof x === 'function' && _Debug_crash(5);
		return false;
	}

	/**_UNUSED/
	if (x.$ === 'Set_elm_builtin')
	{
		x = elm$core$Set$toList(x);
		y = elm$core$Set$toList(y);
	}
	if (x.$ === 'RBNode_elm_builtin' || x.$ === 'RBEmpty_elm_builtin')
	{
		x = elm$core$Dict$toList(x);
		y = elm$core$Dict$toList(y);
	}
	//*/

	/**/
	if (x.$ < 0)
	{
		x = elm$core$Dict$toList(x);
		y = elm$core$Dict$toList(y);
	}
	//*/

	for (var key in x)
	{
		if (!_Utils_eqHelp(x[key], y[key], depth + 1, stack))
		{
			return false;
		}
	}
	return true;
}

var _Utils_equal = F2(_Utils_eq);
var _Utils_notEqual = F2(function(a, b) { return !_Utils_eq(a,b); });



// COMPARISONS

// Code in Generate/JavaScript.hs, Basics.js, and List.js depends on
// the particular integer values assigned to LT, EQ, and GT.

function _Utils_cmp(x, y, ord)
{
	if (typeof x !== 'object')
	{
		return x === y ? /*EQ*/ 0 : x < y ? /*LT*/ -1 : /*GT*/ 1;
	}

	/**_UNUSED/
	if (x instanceof String)
	{
		var a = x.valueOf();
		var b = y.valueOf();
		return a === b ? 0 : a < b ? -1 : 1;
	}
	//*/

	/**/
	if (!x.$)
	//*/
	/**_UNUSED/
	if (x.$[0] === '#')
	//*/
	{
		return (ord = _Utils_cmp(x.a, y.a))
			? ord
			: (ord = _Utils_cmp(x.b, y.b))
				? ord
				: _Utils_cmp(x.c, y.c);
	}

	// traverse conses until end of a list or a mismatch
	for (; x.b && y.b && !(ord = _Utils_cmp(x.a, y.a)); x = x.b, y = y.b) {} // WHILE_CONSES
	return ord || (x.b ? /*GT*/ 1 : y.b ? /*LT*/ -1 : /*EQ*/ 0);
}

var _Utils_lt = F2(function(a, b) { return _Utils_cmp(a, b) < 0; });
var _Utils_le = F2(function(a, b) { return _Utils_cmp(a, b) < 1; });
var _Utils_gt = F2(function(a, b) { return _Utils_cmp(a, b) > 0; });
var _Utils_ge = F2(function(a, b) { return _Utils_cmp(a, b) >= 0; });

var _Utils_compare = F2(function(x, y)
{
	var n = _Utils_cmp(x, y);
	return n < 0 ? elm$core$Basics$LT : n ? elm$core$Basics$GT : elm$core$Basics$EQ;
});


// COMMON VALUES

var _Utils_Tuple0 = 0;
var _Utils_Tuple0_UNUSED = { $: '#0' };

function _Utils_Tuple2(a, b) { return { a: a, b: b }; }
function _Utils_Tuple2_UNUSED(a, b) { return { $: '#2', a: a, b: b }; }

function _Utils_Tuple3(a, b, c) { return { a: a, b: b, c: c }; }
function _Utils_Tuple3_UNUSED(a, b, c) { return { $: '#3', a: a, b: b, c: c }; }

function _Utils_chr(c) { return c; }
function _Utils_chr_UNUSED(c) { return new String(c); }


// RECORDS

function _Utils_update(oldRecord, updatedFields)
{
	var newRecord = {};

	for (var key in oldRecord)
	{
		newRecord[key] = oldRecord[key];
	}

	for (var key in updatedFields)
	{
		newRecord[key] = updatedFields[key];
	}

	return newRecord;
}


// APPEND

var _Utils_append = F2(_Utils_ap);

function _Utils_ap(xs, ys)
{
	// append Strings
	if (typeof xs === 'string')
	{
		return xs + ys;
	}

	// append Lists
	if (!xs.b)
	{
		return ys;
	}
	var root = _List_Cons(xs.a, ys);
	xs = xs.b
	for (var curr = root; xs.b; xs = xs.b) // WHILE_CONS
	{
		curr = curr.b = _List_Cons(xs.a, ys);
	}
	return root;
}



var _JsArray_empty = [];

function _JsArray_singleton(value)
{
    return [value];
}

function _JsArray_length(array)
{
    return array.length;
}

var _JsArray_initialize = F3(function(size, offset, func)
{
    var result = new Array(size);

    for (var i = 0; i < size; i++)
    {
        result[i] = func(offset + i);
    }

    return result;
});

var _JsArray_initializeFromList = F2(function (max, ls)
{
    var result = new Array(max);

    for (var i = 0; i < max && ls.b; i++)
    {
        result[i] = ls.a;
        ls = ls.b;
    }

    result.length = i;
    return _Utils_Tuple2(result, ls);
});

var _JsArray_unsafeGet = F2(function(index, array)
{
    return array[index];
});

var _JsArray_unsafeSet = F3(function(index, value, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[index] = value;
    return result;
});

var _JsArray_push = F2(function(value, array)
{
    var length = array.length;
    var result = new Array(length + 1);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[length] = value;
    return result;
});

var _JsArray_foldl = F3(function(func, acc, array)
{
    var length = array.length;

    for (var i = 0; i < length; i++)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_foldr = F3(function(func, acc, array)
{
    for (var i = array.length - 1; i >= 0; i--)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_map = F2(function(func, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = func(array[i]);
    }

    return result;
});

var _JsArray_indexedMap = F3(function(func, offset, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = A2(func, offset + i, array[i]);
    }

    return result;
});

var _JsArray_slice = F3(function(from, to, array)
{
    return array.slice(from, to);
});

var _JsArray_appendN = F3(function(n, dest, source)
{
    var destLen = dest.length;
    var itemsToCopy = n - destLen;

    if (itemsToCopy > source.length)
    {
        itemsToCopy = source.length;
    }

    var size = destLen + itemsToCopy;
    var result = new Array(size);

    for (var i = 0; i < destLen; i++)
    {
        result[i] = dest[i];
    }

    for (var i = 0; i < itemsToCopy; i++)
    {
        result[i + destLen] = source[i];
    }

    return result;
});



// LOG

var _Debug_log = F2(function(tag, value)
{
	return value;
});

var _Debug_log_UNUSED = F2(function(tag, value)
{
	console.log(tag + ': ' + _Debug_toString(value));
	return value;
});


// TODOS

function _Debug_todo(moduleName, region)
{
	return function(message) {
		_Debug_crash(8, moduleName, region, message);
	};
}

function _Debug_todoCase(moduleName, region, value)
{
	return function(message) {
		_Debug_crash(9, moduleName, region, value, message);
	};
}


// TO STRING

function _Debug_toString(value)
{
	return '<internals>';
}

function _Debug_toString_UNUSED(value)
{
	return _Debug_toAnsiString(false, value);
}

function _Debug_toAnsiString(ansi, value)
{
	if (typeof value === 'function')
	{
		return _Debug_internalColor(ansi, '<function>');
	}

	if (typeof value === 'boolean')
	{
		return _Debug_ctorColor(ansi, value ? 'True' : 'False');
	}

	if (typeof value === 'number')
	{
		return _Debug_numberColor(ansi, value + '');
	}

	if (value instanceof String)
	{
		return _Debug_charColor(ansi, "'" + _Debug_addSlashes(value, true) + "'");
	}

	if (typeof value === 'string')
	{
		return _Debug_stringColor(ansi, '"' + _Debug_addSlashes(value, false) + '"');
	}

	if (typeof value === 'object' && '$' in value)
	{
		var tag = value.$;

		if (typeof tag === 'number')
		{
			return _Debug_internalColor(ansi, '<internals>');
		}

		if (tag[0] === '#')
		{
			var output = [];
			for (var k in value)
			{
				if (k === '$') continue;
				output.push(_Debug_toAnsiString(ansi, value[k]));
			}
			return '(' + output.join(',') + ')';
		}

		if (tag === 'Set_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Set')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, elm$core$Set$toList(value));
		}

		if (tag === 'RBNode_elm_builtin' || tag === 'RBEmpty_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Dict')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, elm$core$Dict$toList(value));
		}

		if (tag === 'Array_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Array')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, elm$core$Array$toList(value));
		}

		if (tag === '::' || tag === '[]')
		{
			var output = '[';

			value.b && (output += _Debug_toAnsiString(ansi, value.a), value = value.b)

			for (; value.b; value = value.b) // WHILE_CONS
			{
				output += ',' + _Debug_toAnsiString(ansi, value.a);
			}
			return output + ']';
		}

		var output = '';
		for (var i in value)
		{
			if (i === '$') continue;
			var str = _Debug_toAnsiString(ansi, value[i]);
			var c0 = str[0];
			var parenless = c0 === '{' || c0 === '(' || c0 === '[' || c0 === '<' || c0 === '"' || str.indexOf(' ') < 0;
			output += ' ' + (parenless ? str : '(' + str + ')');
		}
		return _Debug_ctorColor(ansi, tag) + output;
	}

	if (typeof value === 'object')
	{
		var output = [];
		for (var key in value)
		{
			var field = key[0] === '_' ? key.slice(1) : key;
			output.push(_Debug_fadeColor(ansi, field) + ' = ' + _Debug_toAnsiString(ansi, value[key]));
		}
		if (output.length === 0)
		{
			return '{}';
		}
		return '{ ' + output.join(', ') + ' }';
	}

	return _Debug_internalColor(ansi, '<internals>');
}

function _Debug_addSlashes(str, isChar)
{
	var s = str
		.replace(/\\/g, '\\\\')
		.replace(/\n/g, '\\n')
		.replace(/\t/g, '\\t')
		.replace(/\r/g, '\\r')
		.replace(/\v/g, '\\v')
		.replace(/\0/g, '\\0');

	if (isChar)
	{
		return s.replace(/\'/g, '\\\'');
	}
	else
	{
		return s.replace(/\"/g, '\\"');
	}
}

function _Debug_ctorColor(ansi, string)
{
	return ansi ? '\x1b[96m' + string + '\x1b[0m' : string;
}

function _Debug_numberColor(ansi, string)
{
	return ansi ? '\x1b[95m' + string + '\x1b[0m' : string;
}

function _Debug_stringColor(ansi, string)
{
	return ansi ? '\x1b[93m' + string + '\x1b[0m' : string;
}

function _Debug_charColor(ansi, string)
{
	return ansi ? '\x1b[92m' + string + '\x1b[0m' : string;
}

function _Debug_fadeColor(ansi, string)
{
	return ansi ? '\x1b[37m' + string + '\x1b[0m' : string;
}

function _Debug_internalColor(ansi, string)
{
	return ansi ? '\x1b[94m' + string + '\x1b[0m' : string;
}



// CRASH


function _Debug_crash(identifier)
{
	throw new Error('https://github.com/elm/core/blob/1.0.0/hints/' + identifier + '.md');
}


function _Debug_crash_UNUSED(identifier, fact1, fact2, fact3, fact4)
{
	switch(identifier)
	{
		case 0:
			throw new Error('What node should I take over? In JavaScript I need something like:\n\n    Elm.Main.init({\n        node: document.getElementById("elm-node")\n    })\n\nYou need to do this with any Browser.sandbox or Browser.element program.');

		case 1:
			throw new Error('Browser.application programs cannot handle URLs like this:\n\n    ' + document.location.href + '\n\nWhat is the root? The root of your file system? Try looking at this program with `elm reactor` or some other server.');

		case 2:
			var jsonErrorString = fact1;
			throw new Error('Problem with the flags given to your Elm program on initialization.\n\n' + jsonErrorString);

		case 3:
			var portName = fact1;
			throw new Error('There can only be one port named `' + portName + '`, but your program has multiple.');

		case 4:
			var portName = fact1;
			var problem = fact2;
			throw new Error('Trying to send an unexpected type of value through port `' + portName + '`:\n' + problem);

		case 5:
			throw new Error('Trying to use `(==)` on functions.\nThere is no way to know if functions are "the same" in the Elm sense.\nRead more about this at https://package.elm-lang.org/packages/elm/core/latest/Basics#== which describes why it is this way and what the better version will look like.');

		case 6:
			var moduleName = fact1;
			throw new Error('Your page is loading multiple Elm scripts with a module named ' + moduleName + '. Maybe a duplicate script is getting loaded accidentally? If not, rename one of them so I know which is which!');

		case 8:
			var moduleName = fact1;
			var region = fact2;
			var message = fact3;
			throw new Error('TODO in module `' + moduleName + '` ' + _Debug_regionToString(region) + '\n\n' + message);

		case 9:
			var moduleName = fact1;
			var region = fact2;
			var value = fact3;
			var message = fact4;
			throw new Error(
				'TODO in module `' + moduleName + '` from the `case` expression '
				+ _Debug_regionToString(region) + '\n\nIt received the following value:\n\n    '
				+ _Debug_toString(value).replace('\n', '\n    ')
				+ '\n\nBut the branch that handles it says:\n\n    ' + message.replace('\n', '\n    ')
			);

		case 10:
			throw new Error('Bug in https://github.com/elm/virtual-dom/issues');

		case 11:
			throw new Error('Cannot perform mod 0. Division by zero error.');
	}
}

function _Debug_regionToString(region)
{
	if (region.ay.X === region.aI.X)
	{
		return 'on line ' + region.ay.X;
	}
	return 'on lines ' + region.ay.X + ' through ' + region.aI.X;
}



// MATH

var _Basics_add = F2(function(a, b) { return a + b; });
var _Basics_sub = F2(function(a, b) { return a - b; });
var _Basics_mul = F2(function(a, b) { return a * b; });
var _Basics_fdiv = F2(function(a, b) { return a / b; });
var _Basics_idiv = F2(function(a, b) { return (a / b) | 0; });
var _Basics_pow = F2(Math.pow);

var _Basics_remainderBy = F2(function(b, a) { return a % b; });

// https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/divmodnote-letter.pdf
var _Basics_modBy = F2(function(modulus, x)
{
	var answer = x % modulus;
	return modulus === 0
		? _Debug_crash(11)
		:
	((answer > 0 && modulus < 0) || (answer < 0 && modulus > 0))
		? answer + modulus
		: answer;
});


// TRIGONOMETRY

var _Basics_pi = Math.PI;
var _Basics_e = Math.E;
var _Basics_cos = Math.cos;
var _Basics_sin = Math.sin;
var _Basics_tan = Math.tan;
var _Basics_acos = Math.acos;
var _Basics_asin = Math.asin;
var _Basics_atan = Math.atan;
var _Basics_atan2 = F2(Math.atan2);


// MORE MATH

function _Basics_toFloat(x) { return x; }
function _Basics_truncate(n) { return n | 0; }
function _Basics_isInfinite(n) { return n === Infinity || n === -Infinity; }

var _Basics_ceiling = Math.ceil;
var _Basics_floor = Math.floor;
var _Basics_round = Math.round;
var _Basics_sqrt = Math.sqrt;
var _Basics_log = Math.log;
var _Basics_isNaN = isNaN;


// BOOLEANS

function _Basics_not(bool) { return !bool; }
var _Basics_and = F2(function(a, b) { return a && b; });
var _Basics_or  = F2(function(a, b) { return a || b; });
var _Basics_xor = F2(function(a, b) { return a !== b; });



function _Char_toCode(char)
{
	var code = char.charCodeAt(0);
	if (0xD800 <= code && code <= 0xDBFF)
	{
		return (code - 0xD800) * 0x400 + char.charCodeAt(1) - 0xDC00 + 0x10000
	}
	return code;
}

function _Char_fromCode(code)
{
	return _Utils_chr(
		(code < 0 || 0x10FFFF < code)
			? '\uFFFD'
			:
		(code <= 0xFFFF)
			? String.fromCharCode(code)
			:
		(code -= 0x10000,
			String.fromCharCode(Math.floor(code / 0x400) + 0xD800)
			+
			String.fromCharCode(code % 0x400 + 0xDC00)
		)
	);
}

function _Char_toUpper(char)
{
	return _Utils_chr(char.toUpperCase());
}

function _Char_toLower(char)
{
	return _Utils_chr(char.toLowerCase());
}

function _Char_toLocaleUpper(char)
{
	return _Utils_chr(char.toLocaleUpperCase());
}

function _Char_toLocaleLower(char)
{
	return _Utils_chr(char.toLocaleLowerCase());
}



var _String_cons = F2(function(chr, str)
{
	return chr + str;
});

function _String_uncons(string)
{
	var word = string.charCodeAt(0);
	return word
		? elm$core$Maybe$Just(
			0xD800 <= word && word <= 0xDBFF
				? _Utils_Tuple2(_Utils_chr(string[0] + string[1]), string.slice(2))
				: _Utils_Tuple2(_Utils_chr(string[0]), string.slice(1))
		)
		: elm$core$Maybe$Nothing;
}

var _String_append = F2(function(a, b)
{
	return a + b;
});

function _String_length(str)
{
	return str.length;
}

var _String_map = F2(function(func, string)
{
	var len = string.length;
	var array = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = string.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			array[i] = func(_Utils_chr(string[i] + string[i+1]));
			i += 2;
			continue;
		}
		array[i] = func(_Utils_chr(string[i]));
		i++;
	}
	return array.join('');
});

var _String_filter = F2(function(isGood, str)
{
	var arr = [];
	var len = str.length;
	var i = 0;
	while (i < len)
	{
		var char = str[i];
		var word = str.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += str[i];
			i++;
		}

		if (isGood(_Utils_chr(char)))
		{
			arr.push(char);
		}
	}
	return arr.join('');
});

function _String_reverse(str)
{
	var len = str.length;
	var arr = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = str.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			arr[len - i] = str[i + 1];
			i++;
			arr[len - i] = str[i - 1];
			i++;
		}
		else
		{
			arr[len - i] = str[i];
			i++;
		}
	}
	return arr.join('');
}

var _String_foldl = F3(function(func, state, string)
{
	var len = string.length;
	var i = 0;
	while (i < len)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += string[i];
			i++;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_foldr = F3(function(func, state, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_split = F2(function(sep, str)
{
	return str.split(sep);
});

var _String_join = F2(function(sep, strs)
{
	return strs.join(sep);
});

var _String_slice = F3(function(start, end, str) {
	return str.slice(start, end);
});

function _String_trim(str)
{
	return str.trim();
}

function _String_trimLeft(str)
{
	return str.replace(/^\s+/, '');
}

function _String_trimRight(str)
{
	return str.replace(/\s+$/, '');
}

function _String_words(str)
{
	return _List_fromArray(str.trim().split(/\s+/g));
}

function _String_lines(str)
{
	return _List_fromArray(str.split(/\r\n|\r|\n/g));
}

function _String_toUpper(str)
{
	return str.toUpperCase();
}

function _String_toLower(str)
{
	return str.toLowerCase();
}

var _String_any = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (isGood(_Utils_chr(char)))
		{
			return true;
		}
	}
	return false;
});

var _String_all = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (!isGood(_Utils_chr(char)))
		{
			return false;
		}
	}
	return true;
});

var _String_contains = F2(function(sub, str)
{
	return str.indexOf(sub) > -1;
});

var _String_startsWith = F2(function(sub, str)
{
	return str.indexOf(sub) === 0;
});

var _String_endsWith = F2(function(sub, str)
{
	return str.length >= sub.length &&
		str.lastIndexOf(sub) === str.length - sub.length;
});

var _String_indexes = F2(function(sub, str)
{
	var subLen = sub.length;

	if (subLen < 1)
	{
		return _List_Nil;
	}

	var i = 0;
	var is = [];

	while ((i = str.indexOf(sub, i)) > -1)
	{
		is.push(i);
		i = i + subLen;
	}

	return _List_fromArray(is);
});


// TO STRING

function _String_fromNumber(number)
{
	return number + '';
}


// INT CONVERSIONS

function _String_toInt(str)
{
	var total = 0;
	var code0 = str.charCodeAt(0);
	var start = code0 == 0x2B /* + */ || code0 == 0x2D /* - */ ? 1 : 0;

	for (var i = start; i < str.length; ++i)
	{
		var code = str.charCodeAt(i);
		if (code < 0x30 || 0x39 < code)
		{
			return elm$core$Maybe$Nothing;
		}
		total = 10 * total + code - 0x30;
	}

	return i == start
		? elm$core$Maybe$Nothing
		: elm$core$Maybe$Just(code0 == 0x2D ? -total : total);
}


// FLOAT CONVERSIONS

function _String_toFloat(s)
{
	// check if it is a hex, octal, or binary number
	if (s.length === 0 || /[\sxbo]/.test(s))
	{
		return elm$core$Maybe$Nothing;
	}
	var n = +s;
	// faster isNaN check
	return n === n ? elm$core$Maybe$Just(n) : elm$core$Maybe$Nothing;
}

function _String_fromList(chars)
{
	return _List_toArray(chars).join('');
}




/**_UNUSED/
function _Json_errorToString(error)
{
	return elm$json$Json$Decode$errorToString(error);
}
//*/


// CORE DECODERS

function _Json_succeed(msg)
{
	return {
		$: 0,
		a: msg
	};
}

function _Json_fail(msg)
{
	return {
		$: 1,
		a: msg
	};
}

var _Json_decodeInt = { $: 2 };
var _Json_decodeBool = { $: 3 };
var _Json_decodeFloat = { $: 4 };
var _Json_decodeValue = { $: 5 };
var _Json_decodeString = { $: 6 };

function _Json_decodeList(decoder) { return { $: 7, b: decoder }; }
function _Json_decodeArray(decoder) { return { $: 8, b: decoder }; }

function _Json_decodeNull(value) { return { $: 9, c: value }; }

var _Json_decodeField = F2(function(field, decoder)
{
	return {
		$: 10,
		d: field,
		b: decoder
	};
});

var _Json_decodeIndex = F2(function(index, decoder)
{
	return {
		$: 11,
		e: index,
		b: decoder
	};
});

function _Json_decodeKeyValuePairs(decoder)
{
	return {
		$: 12,
		b: decoder
	};
}

function _Json_mapMany(f, decoders)
{
	return {
		$: 13,
		f: f,
		g: decoders
	};
}

var _Json_andThen = F2(function(callback, decoder)
{
	return {
		$: 14,
		b: decoder,
		h: callback
	};
});

function _Json_oneOf(decoders)
{
	return {
		$: 15,
		g: decoders
	};
}


// DECODING OBJECTS

var _Json_map1 = F2(function(f, d1)
{
	return _Json_mapMany(f, [d1]);
});

var _Json_map2 = F3(function(f, d1, d2)
{
	return _Json_mapMany(f, [d1, d2]);
});

var _Json_map3 = F4(function(f, d1, d2, d3)
{
	return _Json_mapMany(f, [d1, d2, d3]);
});

var _Json_map4 = F5(function(f, d1, d2, d3, d4)
{
	return _Json_mapMany(f, [d1, d2, d3, d4]);
});

var _Json_map5 = F6(function(f, d1, d2, d3, d4, d5)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5]);
});

var _Json_map6 = F7(function(f, d1, d2, d3, d4, d5, d6)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6]);
});

var _Json_map7 = F8(function(f, d1, d2, d3, d4, d5, d6, d7)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7]);
});

var _Json_map8 = F9(function(f, d1, d2, d3, d4, d5, d6, d7, d8)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7, d8]);
});


// DECODE

var _Json_runOnString = F2(function(decoder, string)
{
	try
	{
		var value = JSON.parse(string);
		return _Json_runHelp(decoder, value);
	}
	catch (e)
	{
		return elm$core$Result$Err(A2(elm$json$Json$Decode$Failure, 'This is not valid JSON! ' + e.message, _Json_wrap(string)));
	}
});

var _Json_run = F2(function(decoder, value)
{
	return _Json_runHelp(decoder, _Json_unwrap(value));
});

function _Json_runHelp(decoder, value)
{
	switch (decoder.$)
	{
		case 3:
			return (typeof value === 'boolean')
				? elm$core$Result$Ok(value)
				: _Json_expecting('a BOOL', value);

		case 2:
			if (typeof value !== 'number') {
				return _Json_expecting('an INT', value);
			}

			if (-2147483647 < value && value < 2147483647 && (value | 0) === value) {
				return elm$core$Result$Ok(value);
			}

			if (isFinite(value) && !(value % 1)) {
				return elm$core$Result$Ok(value);
			}

			return _Json_expecting('an INT', value);

		case 4:
			return (typeof value === 'number')
				? elm$core$Result$Ok(value)
				: _Json_expecting('a FLOAT', value);

		case 6:
			return (typeof value === 'string')
				? elm$core$Result$Ok(value)
				: (value instanceof String)
					? elm$core$Result$Ok(value + '')
					: _Json_expecting('a STRING', value);

		case 9:
			return (value === null)
				? elm$core$Result$Ok(decoder.c)
				: _Json_expecting('null', value);

		case 5:
			return elm$core$Result$Ok(_Json_wrap(value));

		case 7:
			if (!Array.isArray(value))
			{
				return _Json_expecting('a LIST', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _List_fromArray);

		case 8:
			if (!Array.isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _Json_toElmArray);

		case 10:
			var field = decoder.d;
			if (typeof value !== 'object' || value === null || !(field in value))
			{
				return _Json_expecting('an OBJECT with a field named `' + field + '`', value);
			}
			var result = _Json_runHelp(decoder.b, value[field]);
			return (elm$core$Result$isOk(result)) ? result : elm$core$Result$Err(A2(elm$json$Json$Decode$Field, field, result.a));

		case 11:
			var index = decoder.e;
			if (!Array.isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			if (index >= value.length)
			{
				return _Json_expecting('a LONGER array. Need index ' + index + ' but only see ' + value.length + ' entries', value);
			}
			var result = _Json_runHelp(decoder.b, value[index]);
			return (elm$core$Result$isOk(result)) ? result : elm$core$Result$Err(A2(elm$json$Json$Decode$Index, index, result.a));

		case 12:
			if (typeof value !== 'object' || value === null || Array.isArray(value))
			{
				return _Json_expecting('an OBJECT', value);
			}

			var keyValuePairs = _List_Nil;
			// TODO test perf of Object.keys and switch when support is good enough
			for (var key in value)
			{
				if (value.hasOwnProperty(key))
				{
					var result = _Json_runHelp(decoder.b, value[key]);
					if (!elm$core$Result$isOk(result))
					{
						return elm$core$Result$Err(A2(elm$json$Json$Decode$Field, key, result.a));
					}
					keyValuePairs = _List_Cons(_Utils_Tuple2(key, result.a), keyValuePairs);
				}
			}
			return elm$core$Result$Ok(elm$core$List$reverse(keyValuePairs));

		case 13:
			var answer = decoder.f;
			var decoders = decoder.g;
			for (var i = 0; i < decoders.length; i++)
			{
				var result = _Json_runHelp(decoders[i], value);
				if (!elm$core$Result$isOk(result))
				{
					return result;
				}
				answer = answer(result.a);
			}
			return elm$core$Result$Ok(answer);

		case 14:
			var result = _Json_runHelp(decoder.b, value);
			return (!elm$core$Result$isOk(result))
				? result
				: _Json_runHelp(decoder.h(result.a), value);

		case 15:
			var errors = _List_Nil;
			for (var temp = decoder.g; temp.b; temp = temp.b) // WHILE_CONS
			{
				var result = _Json_runHelp(temp.a, value);
				if (elm$core$Result$isOk(result))
				{
					return result;
				}
				errors = _List_Cons(result.a, errors);
			}
			return elm$core$Result$Err(elm$json$Json$Decode$OneOf(elm$core$List$reverse(errors)));

		case 1:
			return elm$core$Result$Err(A2(elm$json$Json$Decode$Failure, decoder.a, _Json_wrap(value)));

		case 0:
			return elm$core$Result$Ok(decoder.a);
	}
}

function _Json_runArrayDecoder(decoder, value, toElmValue)
{
	var len = value.length;
	var array = new Array(len);
	for (var i = 0; i < len; i++)
	{
		var result = _Json_runHelp(decoder, value[i]);
		if (!elm$core$Result$isOk(result))
		{
			return elm$core$Result$Err(A2(elm$json$Json$Decode$Index, i, result.a));
		}
		array[i] = result.a;
	}
	return elm$core$Result$Ok(toElmValue(array));
}

function _Json_toElmArray(array)
{
	return A2(elm$core$Array$initialize, array.length, function(i) { return array[i]; });
}

function _Json_expecting(type, value)
{
	return elm$core$Result$Err(A2(elm$json$Json$Decode$Failure, 'Expecting ' + type, _Json_wrap(value)));
}


// EQUALITY

function _Json_equality(x, y)
{
	if (x === y)
	{
		return true;
	}

	if (x.$ !== y.$)
	{
		return false;
	}

	switch (x.$)
	{
		case 0:
		case 1:
			return x.a === y.a;

		case 3:
		case 2:
		case 4:
		case 6:
		case 5:
			return true;

		case 9:
			return x.c === y.c;

		case 7:
		case 8:
		case 12:
			return _Json_equality(x.b, y.b);

		case 10:
			return x.d === y.d && _Json_equality(x.b, y.b);

		case 11:
			return x.e === y.e && _Json_equality(x.b, y.b);

		case 13:
			return x.f === y.f && _Json_listEquality(x.g, y.g);

		case 14:
			return x.h === y.h && _Json_equality(x.b, y.b);

		case 15:
			return _Json_listEquality(x.g, y.g);
	}
}

function _Json_listEquality(aDecoders, bDecoders)
{
	var len = aDecoders.length;
	if (len !== bDecoders.length)
	{
		return false;
	}
	for (var i = 0; i < len; i++)
	{
		if (!_Json_equality(aDecoders[i], bDecoders[i]))
		{
			return false;
		}
	}
	return true;
}


// ENCODE

var _Json_encode = F2(function(indentLevel, value)
{
	return JSON.stringify(_Json_unwrap(value), null, indentLevel) + '';
});

function _Json_wrap_UNUSED(value) { return { $: 0, a: value }; }
function _Json_unwrap_UNUSED(value) { return value.a; }

function _Json_wrap(value) { return value; }
function _Json_unwrap(value) { return value; }

function _Json_emptyArray() { return []; }
function _Json_emptyObject() { return {}; }

var _Json_addField = F3(function(key, value, object)
{
	object[key] = _Json_unwrap(value);
	return object;
});

function _Json_addEntry(func)
{
	return F2(function(entry, array)
	{
		array.push(_Json_unwrap(func(entry)));
		return array;
	});
}

var _Json_encodeNull = _Json_wrap(null);



// TASKS

function _Scheduler_succeed(value)
{
	return {
		$: 0,
		a: value
	};
}

function _Scheduler_fail(error)
{
	return {
		$: 1,
		a: error
	};
}

function _Scheduler_binding(callback)
{
	return {
		$: 2,
		b: callback,
		c: null
	};
}

var _Scheduler_andThen = F2(function(callback, task)
{
	return {
		$: 3,
		b: callback,
		d: task
	};
});

var _Scheduler_onError = F2(function(callback, task)
{
	return {
		$: 4,
		b: callback,
		d: task
	};
});

function _Scheduler_receive(callback)
{
	return {
		$: 5,
		b: callback
	};
}


// PROCESSES

var _Scheduler_guid = 0;

function _Scheduler_rawSpawn(task)
{
	var proc = {
		$: 0,
		e: _Scheduler_guid++,
		f: task,
		g: null,
		h: []
	};

	_Scheduler_enqueue(proc);

	return proc;
}

function _Scheduler_spawn(task)
{
	return _Scheduler_binding(function(callback) {
		callback(_Scheduler_succeed(_Scheduler_rawSpawn(task)));
	});
}

function _Scheduler_rawSend(proc, msg)
{
	proc.h.push(msg);
	_Scheduler_enqueue(proc);
}

var _Scheduler_send = F2(function(proc, msg)
{
	return _Scheduler_binding(function(callback) {
		_Scheduler_rawSend(proc, msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});

function _Scheduler_kill(proc)
{
	return _Scheduler_binding(function(callback) {
		var task = proc.f;
		if (task.$ === 2 && task.c)
		{
			task.c();
		}

		proc.f = null;

		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
}


/* STEP PROCESSES

type alias Process =
  { $ : tag
  , id : unique_id
  , root : Task
  , stack : null | { $: SUCCEED | FAIL, a: callback, b: stack }
  , mailbox : [msg]
  }

*/


var _Scheduler_working = false;
var _Scheduler_queue = [];


function _Scheduler_enqueue(proc)
{
	_Scheduler_queue.push(proc);
	if (_Scheduler_working)
	{
		return;
	}
	_Scheduler_working = true;
	while (proc = _Scheduler_queue.shift())
	{
		_Scheduler_step(proc);
	}
	_Scheduler_working = false;
}


function _Scheduler_step(proc)
{
	while (proc.f)
	{
		var rootTag = proc.f.$;
		if (rootTag === 0 || rootTag === 1)
		{
			while (proc.g && proc.g.$ !== rootTag)
			{
				proc.g = proc.g.i;
			}
			if (!proc.g)
			{
				return;
			}
			proc.f = proc.g.b(proc.f.a);
			proc.g = proc.g.i;
		}
		else if (rootTag === 2)
		{
			proc.f.c = proc.f.b(function(newRoot) {
				proc.f = newRoot;
				_Scheduler_enqueue(proc);
			});
			return;
		}
		else if (rootTag === 5)
		{
			if (proc.h.length === 0)
			{
				return;
			}
			proc.f = proc.f.b(proc.h.shift());
		}
		else // if (rootTag === 3 || rootTag === 4)
		{
			proc.g = {
				$: rootTag === 3 ? 0 : 1,
				b: proc.f.b,
				i: proc.g
			};
			proc.f = proc.f.d;
		}
	}
}



function _Process_sleep(time)
{
	return _Scheduler_binding(function(callback) {
		var id = setTimeout(function() {
			callback(_Scheduler_succeed(_Utils_Tuple0));
		}, time);

		return function() { clearTimeout(id); };
	});
}




// PROGRAMS


var _Platform_worker = F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.bx,
		impl.bS,
		impl.bP,
		function() { return function() {} }
	);
});



// INITIALIZE A PROGRAM


function _Platform_initialize(flagDecoder, args, init, update, subscriptions, stepperBuilder)
{
	var result = A2(_Json_run, flagDecoder, _Json_wrap(args ? args['flags'] : undefined));
	elm$core$Result$isOk(result) || _Debug_crash(2 /**_UNUSED/, _Json_errorToString(result.a) /**/);
	var managers = {};
	result = init(result.a);
	var model = result.a;
	var stepper = stepperBuilder(sendToApp, model);
	var ports = _Platform_setupEffects(managers, sendToApp);

	function sendToApp(msg, viewMetadata)
	{
		result = A2(update, msg, model);
		stepper(model = result.a, viewMetadata);
		_Platform_dispatchEffects(managers, result.b, subscriptions(model));
	}

	_Platform_dispatchEffects(managers, result.b, subscriptions(model));

	return ports ? { ports: ports } : {};
}



// TRACK PRELOADS
//
// This is used by code in elm/browser and elm/http
// to register any HTTP requests that are triggered by init.
//


var _Platform_preload;


function _Platform_registerPreload(url)
{
	_Platform_preload.add(url);
}



// EFFECT MANAGERS


var _Platform_effectManagers = {};


function _Platform_setupEffects(managers, sendToApp)
{
	var ports;

	// setup all necessary effect managers
	for (var key in _Platform_effectManagers)
	{
		var manager = _Platform_effectManagers[key];

		if (manager.a)
		{
			ports = ports || {};
			ports[key] = manager.a(key, sendToApp);
		}

		managers[key] = _Platform_instantiateManager(manager, sendToApp);
	}

	return ports;
}


function _Platform_createManager(init, onEffects, onSelfMsg, cmdMap, subMap)
{
	return {
		b: init,
		c: onEffects,
		d: onSelfMsg,
		e: cmdMap,
		f: subMap
	};
}


function _Platform_instantiateManager(info, sendToApp)
{
	var router = {
		g: sendToApp,
		h: undefined
	};

	var onEffects = info.c;
	var onSelfMsg = info.d;
	var cmdMap = info.e;
	var subMap = info.f;

	function loop(state)
	{
		return A2(_Scheduler_andThen, loop, _Scheduler_receive(function(msg)
		{
			var value = msg.a;

			if (msg.$ === 0)
			{
				return A3(onSelfMsg, router, value, state);
			}

			return cmdMap && subMap
				? A4(onEffects, router, value.i, value.j, state)
				: A3(onEffects, router, cmdMap ? value.i : value.j, state);
		}));
	}

	return router.h = _Scheduler_rawSpawn(A2(_Scheduler_andThen, loop, info.b));
}



// ROUTING


var _Platform_sendToApp = F2(function(router, msg)
{
	return _Scheduler_binding(function(callback)
	{
		router.g(msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});


var _Platform_sendToSelf = F2(function(router, msg)
{
	return A2(_Scheduler_send, router.h, {
		$: 0,
		a: msg
	});
});



// BAGS


function _Platform_leaf(home)
{
	return function(value)
	{
		return {
			$: 1,
			k: home,
			l: value
		};
	};
}


function _Platform_batch(list)
{
	return {
		$: 2,
		m: list
	};
}


var _Platform_map = F2(function(tagger, bag)
{
	return {
		$: 3,
		n: tagger,
		o: bag
	}
});



// PIPE BAGS INTO EFFECT MANAGERS


function _Platform_dispatchEffects(managers, cmdBag, subBag)
{
	var effectsDict = {};
	_Platform_gatherEffects(true, cmdBag, effectsDict, null);
	_Platform_gatherEffects(false, subBag, effectsDict, null);

	for (var home in managers)
	{
		_Scheduler_rawSend(managers[home], {
			$: 'fx',
			a: effectsDict[home] || { i: _List_Nil, j: _List_Nil }
		});
	}
}


function _Platform_gatherEffects(isCmd, bag, effectsDict, taggers)
{
	switch (bag.$)
	{
		case 1:
			var home = bag.k;
			var effect = _Platform_toEffect(isCmd, home, taggers, bag.l);
			effectsDict[home] = _Platform_insert(isCmd, effect, effectsDict[home]);
			return;

		case 2:
			for (var list = bag.m; list.b; list = list.b) // WHILE_CONS
			{
				_Platform_gatherEffects(isCmd, list.a, effectsDict, taggers);
			}
			return;

		case 3:
			_Platform_gatherEffects(isCmd, bag.o, effectsDict, {
				p: bag.n,
				q: taggers
			});
			return;
	}
}


function _Platform_toEffect(isCmd, home, taggers, value)
{
	function applyTaggers(x)
	{
		for (var temp = taggers; temp; temp = temp.q)
		{
			x = temp.p(x);
		}
		return x;
	}

	var map = isCmd
		? _Platform_effectManagers[home].e
		: _Platform_effectManagers[home].f;

	return A2(map, applyTaggers, value)
}


function _Platform_insert(isCmd, newEffect, effects)
{
	effects = effects || { i: _List_Nil, j: _List_Nil };

	isCmd
		? (effects.i = _List_Cons(newEffect, effects.i))
		: (effects.j = _List_Cons(newEffect, effects.j));

	return effects;
}



// PORTS


function _Platform_checkPortName(name)
{
	if (_Platform_effectManagers[name])
	{
		_Debug_crash(3, name)
	}
}



// OUTGOING PORTS


function _Platform_outgoingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		e: _Platform_outgoingPortMap,
		r: converter,
		a: _Platform_setupOutgoingPort
	};
	return _Platform_leaf(name);
}


var _Platform_outgoingPortMap = F2(function(tagger, value) { return value; });


function _Platform_setupOutgoingPort(name)
{
	var subs = [];
	var converter = _Platform_effectManagers[name].r;

	// CREATE MANAGER

	var init = _Process_sleep(0);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, cmdList, state)
	{
		for ( ; cmdList.b; cmdList = cmdList.b) // WHILE_CONS
		{
			// grab a separate reference to subs in case unsubscribe is called
			var currentSubs = subs;
			var value = _Json_unwrap(converter(cmdList.a));
			for (var i = 0; i < currentSubs.length; i++)
			{
				currentSubs[i](value);
			}
		}
		return init;
	});

	// PUBLIC API

	function subscribe(callback)
	{
		subs.push(callback);
	}

	function unsubscribe(callback)
	{
		// copy subs into a new array in case unsubscribe is called within a
		// subscribed callback
		subs = subs.slice();
		var index = subs.indexOf(callback);
		if (index >= 0)
		{
			subs.splice(index, 1);
		}
	}

	return {
		subscribe: subscribe,
		unsubscribe: unsubscribe
	};
}



// INCOMING PORTS


function _Platform_incomingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		f: _Platform_incomingPortMap,
		r: converter,
		a: _Platform_setupIncomingPort
	};
	return _Platform_leaf(name);
}


var _Platform_incomingPortMap = F2(function(tagger, finalTagger)
{
	return function(value)
	{
		return tagger(finalTagger(value));
	};
});


function _Platform_setupIncomingPort(name, sendToApp)
{
	var subs = _List_Nil;
	var converter = _Platform_effectManagers[name].r;

	// CREATE MANAGER

	var init = _Scheduler_succeed(null);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, subList, state)
	{
		subs = subList;
		return init;
	});

	// PUBLIC API

	function send(incomingValue)
	{
		var result = A2(_Json_run, converter, _Json_wrap(incomingValue));

		elm$core$Result$isOk(result) || _Debug_crash(4, name, result.a);

		var value = result.a;
		for (var temp = subs; temp.b; temp = temp.b) // WHILE_CONS
		{
			sendToApp(temp.a(value));
		}
	}

	return { send: send };
}



// EXPORT ELM MODULES
//
// Have DEBUG and PROD versions so that we can (1) give nicer errors in
// debug mode and (2) not pay for the bits needed for that in prod mode.
//


function _Platform_export(exports)
{
	scope['Elm']
		? _Platform_mergeExportsProd(scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsProd(obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6)
				: _Platform_mergeExportsProd(obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}


function _Platform_export_UNUSED(exports)
{
	scope['Elm']
		? _Platform_mergeExportsDebug('Elm', scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsDebug(moduleName, obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6, moduleName)
				: _Platform_mergeExportsDebug(moduleName + '.' + name, obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}



// SEND REQUEST

var _Http_toTask = F2(function(request, maybeProgress)
{
	return _Scheduler_binding(function(callback)
	{
		var xhr = new XMLHttpRequest();

		_Http_configureProgress(xhr, maybeProgress);

		xhr.addEventListener('error', function() {
			callback(_Scheduler_fail(elm$http$Http$NetworkError));
		});
		xhr.addEventListener('timeout', function() {
			callback(_Scheduler_fail(elm$http$Http$Timeout));
		});
		xhr.addEventListener('load', function() {
			callback(_Http_handleResponse(xhr, request.bq.a));
		});

		try
		{
			xhr.open(request.bB, request.bT, true);
		}
		catch (e)
		{
			return callback(_Scheduler_fail(elm$http$Http$BadUrl(request.bT)));
		}

		_Http_configureRequest(xhr, request);

		var body = request.aE;
		xhr.send(elm$http$Http$Internal$isStringBody(body)
			? (xhr.setRequestHeader('Content-Type', body.a), body.b)
			: body.a
		);

		return function() { xhr.abort(); };
	});
});

function _Http_configureProgress(xhr, maybeProgress)
{
	if (!elm$core$Maybe$isJust(maybeProgress))
	{
		return;
	}

	xhr.addEventListener('progress', function(event) {
		if (!event.lengthComputable)
		{
			return;
		}
		_Scheduler_rawSpawn(maybeProgress.a({
			bk: event.loaded,
			bl: event.total
		}));
	});
}

function _Http_configureRequest(xhr, request)
{
	for (var headers = request.bu; headers.b; headers = headers.b) // WHILE_CONS
	{
		xhr.setRequestHeader(headers.a.a, headers.a.b);
	}

	xhr.responseType = request.bq.b;
	xhr.withCredentials = request.bV;

	elm$core$Maybe$isJust(request.bQ) && (xhr.timeout = request.bQ.a);
}


// RESPONSES

function _Http_handleResponse(xhr, responseToResult)
{
	var response = _Http_toResponse(xhr);

	if (xhr.status < 200 || 300 <= xhr.status)
	{
		response.body = xhr.responseText;
		return _Scheduler_fail(elm$http$Http$BadStatus(response));
	}

	var result = responseToResult(response);

	if (elm$core$Result$isOk(result))
	{
		return _Scheduler_succeed(result.a);
	}
	else
	{
		response.body = xhr.responseText;
		return _Scheduler_fail(A2(elm$http$Http$BadPayload, result.a, response));
	}
}

function _Http_toResponse(xhr)
{
	return {
		bT: xhr.responseURL,
		bO: { bn: xhr.status, q: xhr.statusText },
		bu: _Http_parseHeaders(xhr.getAllResponseHeaders()),
		aE: xhr.response
	};
}

function _Http_parseHeaders(rawHeaders)
{
	var headers = elm$core$Dict$empty;

	if (!rawHeaders)
	{
		return headers;
	}

	var headerPairs = rawHeaders.split('\u000d\u000a');
	for (var i = headerPairs.length; i--; )
	{
		var headerPair = headerPairs[i];
		var index = headerPair.indexOf('\u003a\u0020');
		if (index > 0)
		{
			var key = headerPair.substring(0, index);
			var value = headerPair.substring(index + 2);

			headers = A3(elm$core$Dict$update, key, function(oldValue) {
				return elm$core$Maybe$Just(elm$core$Maybe$isJust(oldValue)
					? value + ', ' + oldValue.a
					: value
				);
			}, headers);
		}
	}

	return headers;
}


// EXPECTORS

function _Http_expectStringResponse(responseToResult)
{
	return {
		$: 0,
		b: 'text',
		a: responseToResult
	};
}

var _Http_mapExpect = F2(function(func, expect)
{
	return {
		$: 0,
		b: expect.b,
		a: function(response) {
			var convertedResponse = expect.a(response);
			return A2(elm$core$Result$map, func, convertedResponse);
		}
	};
});


// BODY

function _Http_multipart(parts)
{


	for (var formData = new FormData(); parts.b; parts = parts.b) // WHILE_CONS
	{
		var part = parts.a;
		formData.append(part.a, part.b);
	}

	return elm$http$Http$Internal$FormDataBody(formData);
}



var _Bitwise_and = F2(function(a, b)
{
	return a & b;
});

var _Bitwise_or = F2(function(a, b)
{
	return a | b;
});

var _Bitwise_xor = F2(function(a, b)
{
	return a ^ b;
});

function _Bitwise_complement(a)
{
	return ~a;
};

var _Bitwise_shiftLeftBy = F2(function(offset, a)
{
	return a << offset;
});

var _Bitwise_shiftRightBy = F2(function(offset, a)
{
	return a >> offset;
});

var _Bitwise_shiftRightZfBy = F2(function(offset, a)
{
	return a >>> offset;
});




// HELPERS


var _VirtualDom_divertHrefToApp;

var _VirtualDom_doc = typeof document !== 'undefined' ? document : {};


function _VirtualDom_appendChild(parent, child)
{
	parent.appendChild(child);
}

var _VirtualDom_init = F4(function(virtualNode, flagDecoder, debugMetadata, args)
{
	// NOTE: this function needs _Platform_export available to work

	/**/
	var node = args['node'];
	//*/
	/**_UNUSED/
	var node = args && args['node'] ? args['node'] : _Debug_crash(0);
	//*/

	node.parentNode.replaceChild(
		_VirtualDom_render(virtualNode, function() {}),
		node
	);

	return {};
});



// TEXT


function _VirtualDom_text(string)
{
	return {
		$: 0,
		a: string
	};
}



// NODE


var _VirtualDom_nodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 1,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_node = _VirtualDom_nodeNS(undefined);



// KEYED NODE


var _VirtualDom_keyedNodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 2,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_keyedNode = _VirtualDom_keyedNodeNS(undefined);



// CUSTOM


function _VirtualDom_custom(factList, model, render, diff)
{
	return {
		$: 3,
		d: _VirtualDom_organizeFacts(factList),
		g: model,
		h: render,
		i: diff
	};
}



// MAP


var _VirtualDom_map = F2(function(tagger, node)
{
	return {
		$: 4,
		j: tagger,
		k: node,
		b: 1 + (node.b || 0)
	};
});



// LAZY


function _VirtualDom_thunk(refs, thunk)
{
	return {
		$: 5,
		l: refs,
		m: thunk,
		k: undefined
	};
}

var _VirtualDom_lazy = F2(function(func, a)
{
	return _VirtualDom_thunk([func, a], function() {
		return func(a);
	});
});

var _VirtualDom_lazy2 = F3(function(func, a, b)
{
	return _VirtualDom_thunk([func, a, b], function() {
		return A2(func, a, b);
	});
});

var _VirtualDom_lazy3 = F4(function(func, a, b, c)
{
	return _VirtualDom_thunk([func, a, b, c], function() {
		return A3(func, a, b, c);
	});
});

var _VirtualDom_lazy4 = F5(function(func, a, b, c, d)
{
	return _VirtualDom_thunk([func, a, b, c, d], function() {
		return A4(func, a, b, c, d);
	});
});

var _VirtualDom_lazy5 = F6(function(func, a, b, c, d, e)
{
	return _VirtualDom_thunk([func, a, b, c, d, e], function() {
		return A5(func, a, b, c, d, e);
	});
});

var _VirtualDom_lazy6 = F7(function(func, a, b, c, d, e, f)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f], function() {
		return A6(func, a, b, c, d, e, f);
	});
});

var _VirtualDom_lazy7 = F8(function(func, a, b, c, d, e, f, g)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g], function() {
		return A7(func, a, b, c, d, e, f, g);
	});
});

var _VirtualDom_lazy8 = F9(function(func, a, b, c, d, e, f, g, h)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g, h], function() {
		return A8(func, a, b, c, d, e, f, g, h);
	});
});



// FACTS


var _VirtualDom_on = F2(function(key, handler)
{
	return {
		$: 'a0',
		n: key,
		o: handler
	};
});
var _VirtualDom_style = F2(function(key, value)
{
	return {
		$: 'a1',
		n: key,
		o: value
	};
});
var _VirtualDom_property = F2(function(key, value)
{
	return {
		$: 'a2',
		n: key,
		o: value
	};
});
var _VirtualDom_attribute = F2(function(key, value)
{
	return {
		$: 'a3',
		n: key,
		o: value
	};
});
var _VirtualDom_attributeNS = F3(function(namespace, key, value)
{
	return {
		$: 'a4',
		n: key,
		o: { f: namespace, o: value }
	};
});



// XSS ATTACK VECTOR CHECKS


function _VirtualDom_noScript(tag)
{
	return tag == 'script' ? 'p' : tag;
}

function _VirtualDom_noOnOrFormAction(key)
{
	return /^(on|formAction$)/i.test(key) ? 'data-' + key : key;
}

function _VirtualDom_noInnerHtmlOrFormAction(key)
{
	return key == 'innerHTML' || key == 'formAction' ? 'data-' + key : key;
}

function _VirtualDom_noJavaScriptUri(value)
{
	return /^javascript:/i.test(value.replace(/\s/g,'')) ? '' : value;
}

function _VirtualDom_noJavaScriptUri_UNUSED(value)
{
	return /^javascript:/i.test(value.replace(/\s/g,''))
		? 'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'
		: value;
}

function _VirtualDom_noJavaScriptOrHtmlUri(value)
{
	return /^\s*(javascript:|data:text\/html)/i.test(value) ? '' : value;
}

function _VirtualDom_noJavaScriptOrHtmlUri_UNUSED(value)
{
	return /^\s*(javascript:|data:text\/html)/i.test(value)
		? 'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'
		: value;
}



// MAP FACTS


var _VirtualDom_mapAttribute = F2(function(func, attr)
{
	return (attr.$ === 'a0')
		? A2(_VirtualDom_on, attr.n, _VirtualDom_mapHandler(func, attr.o))
		: attr;
});

function _VirtualDom_mapHandler(func, handler)
{
	var tag = elm$virtual_dom$VirtualDom$toHandlerInt(handler);

	// 0 = Normal
	// 1 = MayStopPropagation
	// 2 = MayPreventDefault
	// 3 = Custom

	return {
		$: handler.$,
		a:
			!tag
				? A2(elm$json$Json$Decode$map, func, handler.a)
				:
			A3(elm$json$Json$Decode$map2,
				tag < 3
					? _VirtualDom_mapEventTuple
					: _VirtualDom_mapEventRecord,
				elm$json$Json$Decode$succeed(func),
				handler.a
			)
	};
}

var _VirtualDom_mapEventTuple = F2(function(func, tuple)
{
	return _Utils_Tuple2(func(tuple.a), tuple.b);
});

var _VirtualDom_mapEventRecord = F2(function(func, record)
{
	return {
		q: func(record.q),
		az: record.az,
		aw: record.aw
	}
});



// ORGANIZE FACTS


function _VirtualDom_organizeFacts(factList)
{
	for (var facts = {}; factList.b; factList = factList.b) // WHILE_CONS
	{
		var entry = factList.a;

		var tag = entry.$;
		var key = entry.n;
		var value = entry.o;

		if (tag === 'a2')
		{
			(key === 'className')
				? _VirtualDom_addClass(facts, key, _Json_unwrap(value))
				: facts[key] = _Json_unwrap(value);

			continue;
		}

		var subFacts = facts[tag] || (facts[tag] = {});
		(tag === 'a3' && key === 'class')
			? _VirtualDom_addClass(subFacts, key, value)
			: subFacts[key] = value;
	}

	return facts;
}

function _VirtualDom_addClass(object, key, newClass)
{
	var classes = object[key];
	object[key] = classes ? classes + ' ' + newClass : newClass;
}



// RENDER


function _VirtualDom_render(vNode, eventNode)
{
	var tag = vNode.$;

	if (tag === 5)
	{
		return _VirtualDom_render(vNode.k || (vNode.k = vNode.m()), eventNode);
	}

	if (tag === 0)
	{
		return _VirtualDom_doc.createTextNode(vNode.a);
	}

	if (tag === 4)
	{
		var subNode = vNode.k;
		var tagger = vNode.j;

		while (subNode.$ === 4)
		{
			typeof tagger !== 'object'
				? tagger = [tagger, subNode.j]
				: tagger.push(subNode.j);

			subNode = subNode.k;
		}

		var subEventRoot = { j: tagger, p: eventNode };
		var domNode = _VirtualDom_render(subNode, subEventRoot);
		domNode.elm_event_node_ref = subEventRoot;
		return domNode;
	}

	if (tag === 3)
	{
		var domNode = vNode.h(vNode.g);
		_VirtualDom_applyFacts(domNode, eventNode, vNode.d);
		return domNode;
	}

	// at this point `tag` must be 1 or 2

	var domNode = vNode.f
		? _VirtualDom_doc.createElementNS(vNode.f, vNode.c)
		: _VirtualDom_doc.createElement(vNode.c);

	if (_VirtualDom_divertHrefToApp && vNode.c == 'a')
	{
		domNode.addEventListener('click', _VirtualDom_divertHrefToApp(domNode));
	}

	_VirtualDom_applyFacts(domNode, eventNode, vNode.d);

	for (var kids = vNode.e, i = 0; i < kids.length; i++)
	{
		_VirtualDom_appendChild(domNode, _VirtualDom_render(tag === 1 ? kids[i] : kids[i].b, eventNode));
	}

	return domNode;
}



// APPLY FACTS


function _VirtualDom_applyFacts(domNode, eventNode, facts)
{
	for (var key in facts)
	{
		var value = facts[key];

		key === 'a1'
			? _VirtualDom_applyStyles(domNode, value)
			:
		key === 'a0'
			? _VirtualDom_applyEvents(domNode, eventNode, value)
			:
		key === 'a3'
			? _VirtualDom_applyAttrs(domNode, value)
			:
		key === 'a4'
			? _VirtualDom_applyAttrsNS(domNode, value)
			:
		(key !== 'value' || key !== 'checked' || domNode[key] !== value) && (domNode[key] = value);
	}
}



// APPLY STYLES


function _VirtualDom_applyStyles(domNode, styles)
{
	var domNodeStyle = domNode.style;

	for (var key in styles)
	{
		domNodeStyle[key] = styles[key];
	}
}



// APPLY ATTRS


function _VirtualDom_applyAttrs(domNode, attrs)
{
	for (var key in attrs)
	{
		var value = attrs[key];
		value
			? domNode.setAttribute(key, value)
			: domNode.removeAttribute(key);
	}
}



// APPLY NAMESPACED ATTRS


function _VirtualDom_applyAttrsNS(domNode, nsAttrs)
{
	for (var key in nsAttrs)
	{
		var pair = nsAttrs[key];
		var namespace = pair.f;
		var value = pair.o;

		value
			? domNode.setAttributeNS(namespace, key, value)
			: domNode.removeAttributeNS(namespace, key);
	}
}



// APPLY EVENTS


function _VirtualDom_applyEvents(domNode, eventNode, events)
{
	var allCallbacks = domNode.elmFs || (domNode.elmFs = {});

	for (var key in events)
	{
		var newHandler = events[key];
		var oldCallback = allCallbacks[key];

		if (!newHandler)
		{
			domNode.removeEventListener(key, oldCallback);
			allCallbacks[key] = undefined;
			continue;
		}

		if (oldCallback)
		{
			var oldHandler = oldCallback.q;
			if (oldHandler.$ === newHandler.$)
			{
				oldCallback.q = newHandler;
				continue;
			}
			domNode.removeEventListener(key, oldCallback);
		}

		oldCallback = _VirtualDom_makeCallback(eventNode, newHandler);
		domNode.addEventListener(key, oldCallback,
			_VirtualDom_passiveSupported
			&& { passive: elm$virtual_dom$VirtualDom$toHandlerInt(newHandler) < 2 }
		);
		allCallbacks[key] = oldCallback;
	}
}



// PASSIVE EVENTS


var _VirtualDom_passiveSupported;

try
{
	window.addEventListener('t', null, Object.defineProperty({}, 'passive', {
		get: function() { _VirtualDom_passiveSupported = true; }
	}));
}
catch(e) {}



// EVENT HANDLERS


function _VirtualDom_makeCallback(eventNode, initialHandler)
{
	function callback(event)
	{
		var handler = callback.q;
		var result = _Json_runHelp(handler.a, event);

		if (!elm$core$Result$isOk(result))
		{
			return;
		}

		var tag = elm$virtual_dom$VirtualDom$toHandlerInt(handler);

		// 0 = Normal
		// 1 = MayStopPropagation
		// 2 = MayPreventDefault
		// 3 = Custom

		var value = result.a;
		var message = !tag ? value : tag < 3 ? value.a : value.q;
		var stopPropagation = tag == 1 ? value.b : tag == 3 && value.az;
		var currentEventNode = (
			stopPropagation && event.stopPropagation(),
			(tag == 2 ? value.b : tag == 3 && value.aw) && event.preventDefault(),
			eventNode
		);
		var tagger;
		var i;
		while (tagger = currentEventNode.j)
		{
			if (typeof tagger == 'function')
			{
				message = tagger(message);
			}
			else
			{
				for (var i = tagger.length; i--; )
				{
					message = tagger[i](message);
				}
			}
			currentEventNode = currentEventNode.p;
		}
		currentEventNode(message, stopPropagation); // stopPropagation implies isSync
	}

	callback.q = initialHandler;

	return callback;
}

function _VirtualDom_equalEvents(x, y)
{
	return x.$ == y.$ && _Json_equality(x.a, y.a);
}



// DIFF


// TODO: Should we do patches like in iOS?
//
// type Patch
//   = At Int Patch
//   | Batch (List Patch)
//   | Change ...
//
// How could it not be better?
//
function _VirtualDom_diff(x, y)
{
	var patches = [];
	_VirtualDom_diffHelp(x, y, patches, 0);
	return patches;
}


function _VirtualDom_pushPatch(patches, type, index, data)
{
	var patch = {
		$: type,
		r: index,
		s: data,
		t: undefined,
		u: undefined
	};
	patches.push(patch);
	return patch;
}


function _VirtualDom_diffHelp(x, y, patches, index)
{
	if (x === y)
	{
		return;
	}

	var xType = x.$;
	var yType = y.$;

	// Bail if you run into different types of nodes. Implies that the
	// structure has changed significantly and it's not worth a diff.
	if (xType !== yType)
	{
		if (xType === 1 && yType === 2)
		{
			y = _VirtualDom_dekey(y);
			yType = 1;
		}
		else
		{
			_VirtualDom_pushPatch(patches, 0, index, y);
			return;
		}
	}

	// Now we know that both nodes are the same $.
	switch (yType)
	{
		case 5:
			var xRefs = x.l;
			var yRefs = y.l;
			var i = xRefs.length;
			var same = i === yRefs.length;
			while (same && i--)
			{
				same = xRefs[i] === yRefs[i];
			}
			if (same)
			{
				y.k = x.k;
				return;
			}
			y.k = y.m();
			var subPatches = [];
			_VirtualDom_diffHelp(x.k, y.k, subPatches, 0);
			subPatches.length > 0 && _VirtualDom_pushPatch(patches, 1, index, subPatches);
			return;

		case 4:
			// gather nested taggers
			var xTaggers = x.j;
			var yTaggers = y.j;
			var nesting = false;

			var xSubNode = x.k;
			while (xSubNode.$ === 4)
			{
				nesting = true;

				typeof xTaggers !== 'object'
					? xTaggers = [xTaggers, xSubNode.j]
					: xTaggers.push(xSubNode.j);

				xSubNode = xSubNode.k;
			}

			var ySubNode = y.k;
			while (ySubNode.$ === 4)
			{
				nesting = true;

				typeof yTaggers !== 'object'
					? yTaggers = [yTaggers, ySubNode.j]
					: yTaggers.push(ySubNode.j);

				ySubNode = ySubNode.k;
			}

			// Just bail if different numbers of taggers. This implies the
			// structure of the virtual DOM has changed.
			if (nesting && xTaggers.length !== yTaggers.length)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			// check if taggers are "the same"
			if (nesting ? !_VirtualDom_pairwiseRefEqual(xTaggers, yTaggers) : xTaggers !== yTaggers)
			{
				_VirtualDom_pushPatch(patches, 2, index, yTaggers);
			}

			// diff everything below the taggers
			_VirtualDom_diffHelp(xSubNode, ySubNode, patches, index + 1);
			return;

		case 0:
			if (x.a !== y.a)
			{
				_VirtualDom_pushPatch(patches, 3, index, y.a);
			}
			return;

		case 1:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKids);
			return;

		case 2:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKeyedKids);
			return;

		case 3:
			if (x.h !== y.h)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
			factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

			var patch = y.i(x.g, y.g);
			patch && _VirtualDom_pushPatch(patches, 5, index, patch);

			return;
	}
}

// assumes the incoming arrays are the same length
function _VirtualDom_pairwiseRefEqual(as, bs)
{
	for (var i = 0; i < as.length; i++)
	{
		if (as[i] !== bs[i])
		{
			return false;
		}
	}

	return true;
}

function _VirtualDom_diffNodes(x, y, patches, index, diffKids)
{
	// Bail if obvious indicators have changed. Implies more serious
	// structural changes such that it's not worth it to diff.
	if (x.c !== y.c || x.f !== y.f)
	{
		_VirtualDom_pushPatch(patches, 0, index, y);
		return;
	}

	var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
	factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

	diffKids(x, y, patches, index);
}



// DIFF FACTS


// TODO Instead of creating a new diff object, it's possible to just test if
// there *is* a diff. During the actual patch, do the diff again and make the
// modifications directly. This way, there's no new allocations. Worth it?
function _VirtualDom_diffFacts(x, y, category)
{
	var diff;

	// look for changes and removals
	for (var xKey in x)
	{
		if (xKey === 'a1' || xKey === 'a0' || xKey === 'a3' || xKey === 'a4')
		{
			var subDiff = _VirtualDom_diffFacts(x[xKey], y[xKey] || {}, xKey);
			if (subDiff)
			{
				diff = diff || {};
				diff[xKey] = subDiff;
			}
			continue;
		}

		// remove if not in the new facts
		if (!(xKey in y))
		{
			diff = diff || {};
			diff[xKey] =
				!category
					? (typeof x[xKey] === 'string' ? '' : null)
					:
				(category === 'a1')
					? ''
					:
				(category === 'a0' || category === 'a3')
					? undefined
					:
				{ f: x[xKey].f, o: undefined };

			continue;
		}

		var xValue = x[xKey];
		var yValue = y[xKey];

		// reference equal, so don't worry about it
		if (xValue === yValue && xKey !== 'value' && xKey !== 'checked'
			|| category === 'a0' && _VirtualDom_equalEvents(xValue, yValue))
		{
			continue;
		}

		diff = diff || {};
		diff[xKey] = yValue;
	}

	// add new stuff
	for (var yKey in y)
	{
		if (!(yKey in x))
		{
			diff = diff || {};
			diff[yKey] = y[yKey];
		}
	}

	return diff;
}



// DIFF KIDS


function _VirtualDom_diffKids(xParent, yParent, patches, index)
{
	var xKids = xParent.e;
	var yKids = yParent.e;

	var xLen = xKids.length;
	var yLen = yKids.length;

	// FIGURE OUT IF THERE ARE INSERTS OR REMOVALS

	if (xLen > yLen)
	{
		_VirtualDom_pushPatch(patches, 6, index, {
			v: yLen,
			i: xLen - yLen
		});
	}
	else if (xLen < yLen)
	{
		_VirtualDom_pushPatch(patches, 7, index, {
			v: xLen,
			e: yKids
		});
	}

	// PAIRWISE DIFF EVERYTHING ELSE

	for (var minLen = xLen < yLen ? xLen : yLen, i = 0; i < minLen; i++)
	{
		var xKid = xKids[i];
		_VirtualDom_diffHelp(xKid, yKids[i], patches, ++index);
		index += xKid.b || 0;
	}
}



// KEYED DIFF


function _VirtualDom_diffKeyedKids(xParent, yParent, patches, rootIndex)
{
	var localPatches = [];

	var changes = {}; // Dict String Entry
	var inserts = []; // Array { index : Int, entry : Entry }
	// type Entry = { tag : String, vnode : VNode, index : Int, data : _ }

	var xKids = xParent.e;
	var yKids = yParent.e;
	var xLen = xKids.length;
	var yLen = yKids.length;
	var xIndex = 0;
	var yIndex = 0;

	var index = rootIndex;

	while (xIndex < xLen && yIndex < yLen)
	{
		var x = xKids[xIndex];
		var y = yKids[yIndex];

		var xKey = x.a;
		var yKey = y.a;
		var xNode = x.b;
		var yNode = y.b;

		// check if keys match

		if (xKey === yKey)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNode, localPatches, index);
			index += xNode.b || 0;

			xIndex++;
			yIndex++;
			continue;
		}

		// look ahead 1 to detect insertions and removals.

		var xNext = xKids[xIndex + 1];
		var yNext = yKids[yIndex + 1];

		if (xNext)
		{
			var xNextKey = xNext.a;
			var xNextNode = xNext.b;
			var oldMatch = yKey === xNextKey;
		}

		if (yNext)
		{
			var yNextKey = yNext.a;
			var yNextNode = yNext.b;
			var newMatch = xKey === yNextKey;
		}


		// swap x and y
		if (newMatch && oldMatch)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			_VirtualDom_insertNode(changes, localPatches, xKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNextNode, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		// insert y
		if (newMatch)
		{
			index++;
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			index += xNode.b || 0;

			xIndex += 1;
			yIndex += 2;
			continue;
		}

		// remove x
		if (oldMatch)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 1;
			continue;
		}

		// remove x, insert y
		if (xNext && xNextKey === yNextKey)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNextNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		break;
	}

	// eat up any remaining nodes with removeNode and insertNode

	while (xIndex < xLen)
	{
		index++;
		var x = xKids[xIndex];
		var xNode = x.b;
		_VirtualDom_removeNode(changes, localPatches, x.a, xNode, index);
		index += xNode.b || 0;
		xIndex++;
	}

	while (yIndex < yLen)
	{
		var endInserts = endInserts || [];
		var y = yKids[yIndex];
		_VirtualDom_insertNode(changes, localPatches, y.a, y.b, undefined, endInserts);
		yIndex++;
	}

	if (localPatches.length > 0 || inserts.length > 0 || endInserts)
	{
		_VirtualDom_pushPatch(patches, 8, rootIndex, {
			w: localPatches,
			x: inserts,
			y: endInserts
		});
	}
}



// CHANGES FROM KEYED DIFF


var _VirtualDom_POSTFIX = '_elmW6BL';


function _VirtualDom_insertNode(changes, localPatches, key, vnode, yIndex, inserts)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		entry = {
			c: 0,
			z: vnode,
			r: yIndex,
			s: undefined
		};

		inserts.push({ r: yIndex, A: entry });
		changes[key] = entry;

		return;
	}

	// this key was removed earlier, a match!
	if (entry.c === 1)
	{
		inserts.push({ r: yIndex, A: entry });

		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(entry.z, vnode, subPatches, entry.r);
		entry.r = yIndex;
		entry.s.s = {
			w: subPatches,
			A: entry
		};

		return;
	}

	// this key has already been inserted or moved, a duplicate!
	_VirtualDom_insertNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, yIndex, inserts);
}


function _VirtualDom_removeNode(changes, localPatches, key, vnode, index)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		var patch = _VirtualDom_pushPatch(localPatches, 9, index, undefined);

		changes[key] = {
			c: 1,
			z: vnode,
			r: index,
			s: patch
		};

		return;
	}

	// this key was inserted earlier, a match!
	if (entry.c === 0)
	{
		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(vnode, entry.z, subPatches, index);

		_VirtualDom_pushPatch(localPatches, 9, index, {
			w: subPatches,
			A: entry
		});

		return;
	}

	// this key has already been removed or moved, a duplicate!
	_VirtualDom_removeNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, index);
}



// ADD DOM NODES
//
// Each DOM node has an "index" assigned in order of traversal. It is important
// to minimize our crawl over the actual DOM, so these indexes (along with the
// descendantsCount of virtual nodes) let us skip touching entire subtrees of
// the DOM if we know there are no patches there.


function _VirtualDom_addDomNodes(domNode, vNode, patches, eventNode)
{
	_VirtualDom_addDomNodesHelp(domNode, vNode, patches, 0, 0, vNode.b, eventNode);
}


// assumes `patches` is non-empty and indexes increase monotonically.
function _VirtualDom_addDomNodesHelp(domNode, vNode, patches, i, low, high, eventNode)
{
	var patch = patches[i];
	var index = patch.r;

	while (index === low)
	{
		var patchType = patch.$;

		if (patchType === 1)
		{
			_VirtualDom_addDomNodes(domNode, vNode.k, patch.s, eventNode);
		}
		else if (patchType === 8)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var subPatches = patch.s.w;
			if (subPatches.length > 0)
			{
				_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
			}
		}
		else if (patchType === 9)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var data = patch.s;
			if (data)
			{
				data.A.s = domNode;
				var subPatches = data.w;
				if (subPatches.length > 0)
				{
					_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
				}
			}
		}
		else
		{
			patch.t = domNode;
			patch.u = eventNode;
		}

		i++;

		if (!(patch = patches[i]) || (index = patch.r) > high)
		{
			return i;
		}
	}

	var tag = vNode.$;

	if (tag === 4)
	{
		var subNode = vNode.k;

		while (subNode.$ === 4)
		{
			subNode = subNode.k;
		}

		return _VirtualDom_addDomNodesHelp(domNode, subNode, patches, i, low + 1, high, domNode.elm_event_node_ref);
	}

	// tag must be 1 or 2 at this point

	var vKids = vNode.e;
	var childNodes = domNode.childNodes;
	for (var j = 0; j < vKids.length; j++)
	{
		low++;
		var vKid = tag === 1 ? vKids[j] : vKids[j].b;
		var nextLow = low + (vKid.b || 0);
		if (low <= index && index <= nextLow)
		{
			i = _VirtualDom_addDomNodesHelp(childNodes[j], vKid, patches, i, low, nextLow, eventNode);
			if (!(patch = patches[i]) || (index = patch.r) > high)
			{
				return i;
			}
		}
		low = nextLow;
	}
	return i;
}



// APPLY PATCHES


function _VirtualDom_applyPatches(rootDomNode, oldVirtualNode, patches, eventNode)
{
	if (patches.length === 0)
	{
		return rootDomNode;
	}

	_VirtualDom_addDomNodes(rootDomNode, oldVirtualNode, patches, eventNode);
	return _VirtualDom_applyPatchesHelp(rootDomNode, patches);
}

function _VirtualDom_applyPatchesHelp(rootDomNode, patches)
{
	for (var i = 0; i < patches.length; i++)
	{
		var patch = patches[i];
		var localDomNode = patch.t
		var newNode = _VirtualDom_applyPatch(localDomNode, patch);
		if (localDomNode === rootDomNode)
		{
			rootDomNode = newNode;
		}
	}
	return rootDomNode;
}

function _VirtualDom_applyPatch(domNode, patch)
{
	switch (patch.$)
	{
		case 0:
			return _VirtualDom_applyPatchRedraw(domNode, patch.s, patch.u);

		case 4:
			_VirtualDom_applyFacts(domNode, patch.u, patch.s);
			return domNode;

		case 3:
			domNode.replaceData(0, domNode.length, patch.s);
			return domNode;

		case 1:
			return _VirtualDom_applyPatchesHelp(domNode, patch.s);

		case 2:
			if (domNode.elm_event_node_ref)
			{
				domNode.elm_event_node_ref.j = patch.s;
			}
			else
			{
				domNode.elm_event_node_ref = { j: patch.s, p: patch.u };
			}
			return domNode;

		case 6:
			var data = patch.s;
			for (var i = 0; i < data.i; i++)
			{
				domNode.removeChild(domNode.childNodes[data.v]);
			}
			return domNode;

		case 7:
			var data = patch.s;
			var kids = data.e;
			var i = data.v;
			var theEnd = domNode.childNodes[i];
			for (; i < kids.length; i++)
			{
				domNode.insertBefore(_VirtualDom_render(kids[i], patch.u), theEnd);
			}
			return domNode;

		case 9:
			var data = patch.s;
			if (!data)
			{
				domNode.parentNode.removeChild(domNode);
				return domNode;
			}
			var entry = data.A;
			if (typeof entry.r !== 'undefined')
			{
				domNode.parentNode.removeChild(domNode);
			}
			entry.s = _VirtualDom_applyPatchesHelp(domNode, data.w);
			return domNode;

		case 8:
			return _VirtualDom_applyPatchReorder(domNode, patch);

		case 5:
			return patch.s(domNode);

		default:
			_Debug_crash(10); // 'Ran into an unknown patch!'
	}
}


function _VirtualDom_applyPatchRedraw(domNode, vNode, eventNode)
{
	var parentNode = domNode.parentNode;
	var newNode = _VirtualDom_render(vNode, eventNode);

	if (!newNode.elm_event_node_ref)
	{
		newNode.elm_event_node_ref = domNode.elm_event_node_ref;
	}

	if (parentNode && newNode !== domNode)
	{
		parentNode.replaceChild(newNode, domNode);
	}
	return newNode;
}


function _VirtualDom_applyPatchReorder(domNode, patch)
{
	var data = patch.s;

	// remove end inserts
	var frag = _VirtualDom_applyPatchReorderEndInsertsHelp(data.y, patch);

	// removals
	domNode = _VirtualDom_applyPatchesHelp(domNode, data.w);

	// inserts
	var inserts = data.x;
	for (var i = 0; i < inserts.length; i++)
	{
		var insert = inserts[i];
		var entry = insert.A;
		var node = entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u);
		domNode.insertBefore(node, domNode.childNodes[insert.r]);
	}

	// add end inserts
	if (frag)
	{
		_VirtualDom_appendChild(domNode, frag);
	}

	return domNode;
}


function _VirtualDom_applyPatchReorderEndInsertsHelp(endInserts, patch)
{
	if (!endInserts)
	{
		return;
	}

	var frag = _VirtualDom_doc.createDocumentFragment();
	for (var i = 0; i < endInserts.length; i++)
	{
		var insert = endInserts[i];
		var entry = insert.A;
		_VirtualDom_appendChild(frag, entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u)
		);
	}
	return frag;
}


function _VirtualDom_virtualize(node)
{
	// TEXT NODES

	if (node.nodeType === 3)
	{
		return _VirtualDom_text(node.textContent);
	}


	// WEIRD NODES

	if (node.nodeType !== 1)
	{
		return _VirtualDom_text('');
	}


	// ELEMENT NODES

	var attrList = _List_Nil;
	var attrs = node.attributes;
	for (var i = attrs.length; i--; )
	{
		var attr = attrs[i];
		var name = attr.name;
		var value = attr.value;
		attrList = _List_Cons( A2(_VirtualDom_attribute, name, value), attrList );
	}

	var tag = node.tagName.toLowerCase();
	var kidList = _List_Nil;
	var kids = node.childNodes;

	for (var i = kids.length; i--; )
	{
		kidList = _List_Cons(_VirtualDom_virtualize(kids[i]), kidList);
	}
	return A3(_VirtualDom_node, tag, attrList, kidList);
}

function _VirtualDom_dekey(keyedNode)
{
	var keyedKids = keyedNode.e;
	var len = keyedKids.length;
	var kids = new Array(len);
	for (var i = 0; i < len; i++)
	{
		kids[i] = keyedKids[i].b;
	}

	return {
		$: 1,
		c: keyedNode.c,
		d: keyedNode.d,
		e: kids,
		f: keyedNode.f,
		b: keyedNode.b
	};
}



// ELEMENT


var _Debugger_element;

var _Browser_element = _Debugger_element || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.bx,
		impl.bS,
		impl.bP,
		function(sendToApp, initialModel) {
			var view = impl.bU;
			/**/
			var domNode = args['node'];
			//*/
			/**_UNUSED/
			var domNode = args && args['node'] ? args['node'] : _Debug_crash(0);
			//*/
			var currNode = _VirtualDom_virtualize(domNode);

			return _Browser_makeAnimator(initialModel, function(model)
			{
				var nextNode = view(model);
				var patches = _VirtualDom_diff(currNode, nextNode);
				domNode = _VirtualDom_applyPatches(domNode, currNode, patches, sendToApp);
				currNode = nextNode;
			});
		}
	);
});



// DOCUMENT


var _Debugger_document;

var _Browser_document = _Debugger_document || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.bx,
		impl.bS,
		impl.bP,
		function(sendToApp, initialModel) {
			var divertHrefToApp = impl.Z && impl.Z(sendToApp)
			var view = impl.bU;
			var title = _VirtualDom_doc.title;
			var bodyNode = _VirtualDom_doc.body;
			var currNode = _VirtualDom_virtualize(bodyNode);
			return _Browser_makeAnimator(initialModel, function(model)
			{
				_VirtualDom_divertHrefToApp = divertHrefToApp;
				var doc = view(model);
				var nextNode = _VirtualDom_node('body')(_List_Nil)(doc.aE);
				var patches = _VirtualDom_diff(currNode, nextNode);
				bodyNode = _VirtualDom_applyPatches(bodyNode, currNode, patches, sendToApp);
				currNode = nextNode;
				_VirtualDom_divertHrefToApp = 0;
				(title !== doc.bR) && (_VirtualDom_doc.title = title = doc.bR);
			});
		}
	);
});



// ANIMATION


var _Browser_requestAnimationFrame =
	typeof requestAnimationFrame !== 'undefined'
		? requestAnimationFrame
		: function(callback) { setTimeout(callback, 1000 / 60); };


function _Browser_makeAnimator(model, draw)
{
	draw(model);

	var state = 0;

	function updateIfNeeded()
	{
		state = state === 1
			? 0
			: ( _Browser_requestAnimationFrame(updateIfNeeded), draw(model), 1 );
	}

	return function(nextModel, isSync)
	{
		model = nextModel;

		isSync
			? ( draw(model),
				state === 2 && (state = 1)
				)
			: ( state === 0 && _Browser_requestAnimationFrame(updateIfNeeded),
				state = 2
				);
	};
}



// APPLICATION


function _Browser_application(impl)
{
	var onUrlChange = impl.bC;
	var onUrlRequest = impl.bD;
	var key = function() { key.a(onUrlChange(_Browser_getUrl())); };

	return _Browser_document({
		Z: function(sendToApp)
		{
			key.a = sendToApp;
			_Browser_window.addEventListener('popstate', key);
			_Browser_window.navigator.userAgent.indexOf('Trident') < 0 || _Browser_window.addEventListener('hashchange', key);

			return F2(function(domNode, event)
			{
				if (!event.ctrlKey && !event.metaKey && !event.shiftKey && event.button < 1 && !domNode.target && !domNode.download)
				{
					event.preventDefault();
					var href = domNode.href;
					var curr = _Browser_getUrl();
					var next = elm$url$Url$fromString(href).a;
					sendToApp(onUrlRequest(
						(next
							&& curr.a5 === next.a5
							&& curr.aQ === next.aQ
							&& curr.a1.a === next.a1.a
						)
							? elm$browser$Browser$Internal(next)
							: elm$browser$Browser$External(href)
					));
				}
			});
		},
		bx: function(flags)
		{
			return A3(impl.bx, flags, _Browser_getUrl(), key);
		},
		bU: impl.bU,
		bS: impl.bS,
		bP: impl.bP
	});
}

function _Browser_getUrl()
{
	return elm$url$Url$fromString(_VirtualDom_doc.location.href).a || _Debug_crash(1);
}

var _Browser_go = F2(function(key, n)
{
	return A2(elm$core$Task$perform, elm$core$Basics$never, _Scheduler_binding(function() {
		n && history.go(n);
		key();
	}));
});

var _Browser_pushUrl = F2(function(key, url)
{
	return A2(elm$core$Task$perform, elm$core$Basics$never, _Scheduler_binding(function() {
		history.pushState({}, '', url);
		key();
	}));
});

var _Browser_replaceUrl = F2(function(key, url)
{
	return A2(elm$core$Task$perform, elm$core$Basics$never, _Scheduler_binding(function() {
		history.replaceState({}, '', url);
		key();
	}));
});



// GLOBAL EVENTS


var _Browser_fakeNode = { addEventListener: function() {}, removeEventListener: function() {} };
var _Browser_doc = typeof document !== 'undefined' ? document : _Browser_fakeNode;
var _Browser_window = typeof window !== 'undefined' ? window : _Browser_fakeNode;

var _Browser_on = F3(function(node, eventName, sendToSelf)
{
	return _Scheduler_spawn(_Scheduler_binding(function(callback)
	{
		function handler(event)	{ _Scheduler_rawSpawn(sendToSelf(event)); }
		node.addEventListener(eventName, handler, _VirtualDom_passiveSupported && { passive: true });
		return function() { node.removeEventListener(eventName, handler); };
	}));
});

var _Browser_decodeEvent = F2(function(decoder, event)
{
	var result = _Json_runHelp(decoder, event);
	return elm$core$Result$isOk(result) ? elm$core$Maybe$Just(result.a) : elm$core$Maybe$Nothing;
});



// PAGE VISIBILITY


function _Browser_visibilityInfo()
{
	return (typeof _VirtualDom_doc.hidden !== 'undefined')
		? { bv: 'hidden', R: 'visibilitychange' }
		:
	(typeof _VirtualDom_doc.mozHidden !== 'undefined')
		? { bv: 'mozHidden', R: 'mozvisibilitychange' }
		:
	(typeof _VirtualDom_doc.msHidden !== 'undefined')
		? { bv: 'msHidden', R: 'msvisibilitychange' }
		:
	(typeof _VirtualDom_doc.webkitHidden !== 'undefined')
		? { bv: 'webkitHidden', R: 'webkitvisibilitychange' }
		: { bv: 'hidden', R: 'visibilitychange' };
}



// ANIMATION FRAMES


function _Browser_rAF()
{
	return _Scheduler_binding(function(callback)
	{
		var id = requestAnimationFrame(function() {
			callback(_Scheduler_succeed(Date.now()));
		});

		return function() {
			cancelAnimationFrame(id);
		};
	});
}


function _Browser_now()
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(Date.now()));
	});
}



// DOM STUFF


function _Browser_withNode(id, doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			var node = document.getElementById(id);
			callback(node
				? _Scheduler_succeed(doStuff(node))
				: _Scheduler_fail(elm$browser$Browser$Dom$NotFound(id))
			);
		});
	});
}


function _Browser_withWindow(doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(doStuff()));
		});
	});
}


// FOCUS and BLUR


var _Browser_call = F2(function(functionName, id)
{
	return _Browser_withNode(id, function(node) {
		node[functionName]();
		return _Utils_Tuple0;
	});
});



// WINDOW VIEWPORT


function _Browser_getViewport()
{
	return {
		bb: _Browser_getScene(),
		bh: {
			al: _Browser_window.pageXOffset,
			am: _Browser_window.pageYOffset,
			P: _Browser_doc.documentElement.clientWidth,
			J: _Browser_doc.documentElement.clientHeight
		}
	};
}

function _Browser_getScene()
{
	var body = _Browser_doc.body;
	var elem = _Browser_doc.documentElement;
	return {
		P: Math.max(body.scrollWidth, body.offsetWidth, elem.scrollWidth, elem.offsetWidth, elem.clientWidth),
		J: Math.max(body.scrollHeight, body.offsetHeight, elem.scrollHeight, elem.offsetHeight, elem.clientHeight)
	};
}

var _Browser_setViewport = F2(function(x, y)
{
	return _Browser_withWindow(function()
	{
		_Browser_window.scroll(x, y);
		return _Utils_Tuple0;
	});
});



// ELEMENT VIEWPORT


function _Browser_getViewportOf(id)
{
	return _Browser_withNode(id, function(node)
	{
		return {
			bb: {
				P: node.scrollWidth,
				J: node.scrollHeight
			},
			bh: {
				al: node.scrollLeft,
				am: node.scrollTop,
				P: node.clientWidth,
				J: node.clientHeight
			}
		};
	});
}


var _Browser_setViewportOf = F3(function(id, x, y)
{
	return _Browser_withNode(id, function(node)
	{
		node.scrollLeft = x;
		node.scrollTop = y;
		return _Utils_Tuple0;
	});
});



// ELEMENT


function _Browser_getElement(id)
{
	return _Browser_withNode(id, function(node)
	{
		var rect = node.getBoundingClientRect();
		var x = _Browser_window.pageXOffset;
		var y = _Browser_window.pageYOffset;
		return {
			bb: _Browser_getScene(),
			bh: {
				al: x,
				am: y,
				P: _Browser_doc.documentElement.clientWidth,
				J: _Browser_doc.documentElement.clientHeight
			},
			bp: {
				al: x + rect.left,
				am: y + rect.top,
				P: rect.width,
				J: rect.height
			}
		};
	});
}



// LOAD and RELOAD


function _Browser_reload(skipCache)
{
	return A2(elm$core$Task$perform, elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		_VirtualDom_doc.location.reload(skipCache);
	}));
}

function _Browser_load(url)
{
	return A2(elm$core$Task$perform, elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		try
		{
			_Browser_window.location = url;
		}
		catch(err)
		{
			// Only Firefox can throw a NS_ERROR_MALFORMED_URI exception here.
			// Other browsers reload the page, so let's be consistent about that.
			_VirtualDom_doc.location.reload(false);
		}
	}));
}
var author$project$Client$Main$UrlChanged = function (a) {
	return {$: 2, a: a};
};
var author$project$Client$Main$UrlRequested = function (a) {
	return {$: 1, a: a};
};
var author$project$Client$Main$GetAttackResponse = function (a) {
	return {$: 7, a: a};
};
var author$project$Client$Main$GetIncSpecialAttrResponse = function (a) {
	return {$: 10, a: a};
};
var author$project$Client$Main$GetLoginResponse = function (a) {
	return {$: 5, a: a};
};
var author$project$Client$Main$GetLogoutResponse = function (a) {
	return {$: 8, a: a};
};
var author$project$Client$Main$GetRefreshAnonymousResponse = function (a) {
	return {$: 9, a: a};
};
var author$project$Client$Main$GetRefreshResponse = function (a) {
	return {$: 6, a: a};
};
var author$project$Client$Main$GetSignupResponse = function (a) {
	return {$: 4, a: a};
};
var author$project$Client$Main$NoOp = {$: 0};
var elm$core$Basics$apR = F2(
	function (x, f) {
		return f(x);
	});
var elm$core$Result$Err = function (a) {
	return {$: 1, a: a};
};
var elm$core$Result$Ok = function (a) {
	return {$: 0, a: a};
};
var elm$core$Array$branchFactor = 32;
var elm$core$Array$Array_elm_builtin = F4(
	function (a, b, c, d) {
		return {$: 0, a: a, b: b, c: c, d: d};
	});
var elm$core$Basics$EQ = 1;
var elm$core$Basics$GT = 2;
var elm$core$Basics$LT = 0;
var elm$core$Dict$foldr = F3(
	function (func, acc, t) {
		foldr:
		while (true) {
			if (t.$ === -2) {
				return acc;
			} else {
				var key = t.b;
				var value = t.c;
				var left = t.d;
				var right = t.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3(elm$core$Dict$foldr, func, acc, right)),
					$temp$t = left;
				func = $temp$func;
				acc = $temp$acc;
				t = $temp$t;
				continue foldr;
			}
		}
	});
var elm$core$List$cons = _List_cons;
var elm$core$Dict$toList = function (dict) {
	return A3(
		elm$core$Dict$foldr,
		F3(
			function (key, value, list) {
				return A2(
					elm$core$List$cons,
					_Utils_Tuple2(key, value),
					list);
			}),
		_List_Nil,
		dict);
};
var elm$core$Dict$keys = function (dict) {
	return A3(
		elm$core$Dict$foldr,
		F3(
			function (key, value, keyList) {
				return A2(elm$core$List$cons, key, keyList);
			}),
		_List_Nil,
		dict);
};
var elm$core$Set$toList = function (_n0) {
	var dict = _n0;
	return elm$core$Dict$keys(dict);
};
var elm$core$Elm$JsArray$foldr = _JsArray_foldr;
var elm$core$Array$foldr = F3(
	function (func, baseCase, _n0) {
		var tree = _n0.c;
		var tail = _n0.d;
		var helper = F2(
			function (node, acc) {
				if (!node.$) {
					var subTree = node.a;
					return A3(elm$core$Elm$JsArray$foldr, helper, acc, subTree);
				} else {
					var values = node.a;
					return A3(elm$core$Elm$JsArray$foldr, func, acc, values);
				}
			});
		return A3(
			elm$core$Elm$JsArray$foldr,
			helper,
			A3(elm$core$Elm$JsArray$foldr, func, baseCase, tail),
			tree);
	});
var elm$core$Array$toList = function (array) {
	return A3(elm$core$Array$foldr, elm$core$List$cons, _List_Nil, array);
};
var elm$core$Basics$ceiling = _Basics_ceiling;
var elm$core$Basics$fdiv = _Basics_fdiv;
var elm$core$Basics$logBase = F2(
	function (base, number) {
		return _Basics_log(number) / _Basics_log(base);
	});
var elm$core$Basics$toFloat = _Basics_toFloat;
var elm$core$Array$shiftStep = elm$core$Basics$ceiling(
	A2(elm$core$Basics$logBase, 2, elm$core$Array$branchFactor));
var elm$core$Elm$JsArray$empty = _JsArray_empty;
var elm$core$Array$empty = A4(elm$core$Array$Array_elm_builtin, 0, elm$core$Array$shiftStep, elm$core$Elm$JsArray$empty, elm$core$Elm$JsArray$empty);
var elm$core$Array$Leaf = function (a) {
	return {$: 1, a: a};
};
var elm$core$Array$SubTree = function (a) {
	return {$: 0, a: a};
};
var elm$core$Elm$JsArray$initializeFromList = _JsArray_initializeFromList;
var elm$core$List$foldl = F3(
	function (func, acc, list) {
		foldl:
		while (true) {
			if (!list.b) {
				return acc;
			} else {
				var x = list.a;
				var xs = list.b;
				var $temp$func = func,
					$temp$acc = A2(func, x, acc),
					$temp$list = xs;
				func = $temp$func;
				acc = $temp$acc;
				list = $temp$list;
				continue foldl;
			}
		}
	});
var elm$core$List$reverse = function (list) {
	return A3(elm$core$List$foldl, elm$core$List$cons, _List_Nil, list);
};
var elm$core$Array$compressNodes = F2(
	function (nodes, acc) {
		compressNodes:
		while (true) {
			var _n0 = A2(elm$core$Elm$JsArray$initializeFromList, elm$core$Array$branchFactor, nodes);
			var node = _n0.a;
			var remainingNodes = _n0.b;
			var newAcc = A2(
				elm$core$List$cons,
				elm$core$Array$SubTree(node),
				acc);
			if (!remainingNodes.b) {
				return elm$core$List$reverse(newAcc);
			} else {
				var $temp$nodes = remainingNodes,
					$temp$acc = newAcc;
				nodes = $temp$nodes;
				acc = $temp$acc;
				continue compressNodes;
			}
		}
	});
var elm$core$Basics$eq = _Utils_equal;
var elm$core$Tuple$first = function (_n0) {
	var x = _n0.a;
	return x;
};
var elm$core$Array$treeFromBuilder = F2(
	function (nodeList, nodeListSize) {
		treeFromBuilder:
		while (true) {
			var newNodeSize = elm$core$Basics$ceiling(nodeListSize / elm$core$Array$branchFactor);
			if (newNodeSize === 1) {
				return A2(elm$core$Elm$JsArray$initializeFromList, elm$core$Array$branchFactor, nodeList).a;
			} else {
				var $temp$nodeList = A2(elm$core$Array$compressNodes, nodeList, _List_Nil),
					$temp$nodeListSize = newNodeSize;
				nodeList = $temp$nodeList;
				nodeListSize = $temp$nodeListSize;
				continue treeFromBuilder;
			}
		}
	});
var elm$core$Basics$add = _Basics_add;
var elm$core$Basics$apL = F2(
	function (f, x) {
		return f(x);
	});
var elm$core$Basics$floor = _Basics_floor;
var elm$core$Basics$gt = _Utils_gt;
var elm$core$Basics$max = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) > 0) ? x : y;
	});
var elm$core$Basics$mul = _Basics_mul;
var elm$core$Basics$sub = _Basics_sub;
var elm$core$Elm$JsArray$length = _JsArray_length;
var elm$core$Array$builderToArray = F2(
	function (reverseNodeList, builder) {
		if (!builder.e) {
			return A4(
				elm$core$Array$Array_elm_builtin,
				elm$core$Elm$JsArray$length(builder.g),
				elm$core$Array$shiftStep,
				elm$core$Elm$JsArray$empty,
				builder.g);
		} else {
			var treeLen = builder.e * elm$core$Array$branchFactor;
			var depth = elm$core$Basics$floor(
				A2(elm$core$Basics$logBase, elm$core$Array$branchFactor, treeLen - 1));
			var correctNodeList = reverseNodeList ? elm$core$List$reverse(builder.h) : builder.h;
			var tree = A2(elm$core$Array$treeFromBuilder, correctNodeList, builder.e);
			return A4(
				elm$core$Array$Array_elm_builtin,
				elm$core$Elm$JsArray$length(builder.g) + treeLen,
				A2(elm$core$Basics$max, 5, depth * elm$core$Array$shiftStep),
				tree,
				builder.g);
		}
	});
var elm$core$Basics$False = 1;
var elm$core$Basics$idiv = _Basics_idiv;
var elm$core$Basics$lt = _Utils_lt;
var elm$core$Elm$JsArray$initialize = _JsArray_initialize;
var elm$core$Array$initializeHelp = F5(
	function (fn, fromIndex, len, nodeList, tail) {
		initializeHelp:
		while (true) {
			if (fromIndex < 0) {
				return A2(
					elm$core$Array$builderToArray,
					false,
					{h: nodeList, e: (len / elm$core$Array$branchFactor) | 0, g: tail});
			} else {
				var leaf = elm$core$Array$Leaf(
					A3(elm$core$Elm$JsArray$initialize, elm$core$Array$branchFactor, fromIndex, fn));
				var $temp$fn = fn,
					$temp$fromIndex = fromIndex - elm$core$Array$branchFactor,
					$temp$len = len,
					$temp$nodeList = A2(elm$core$List$cons, leaf, nodeList),
					$temp$tail = tail;
				fn = $temp$fn;
				fromIndex = $temp$fromIndex;
				len = $temp$len;
				nodeList = $temp$nodeList;
				tail = $temp$tail;
				continue initializeHelp;
			}
		}
	});
var elm$core$Basics$le = _Utils_le;
var elm$core$Basics$remainderBy = _Basics_remainderBy;
var elm$core$Array$initialize = F2(
	function (len, fn) {
		if (len <= 0) {
			return elm$core$Array$empty;
		} else {
			var tailLen = len % elm$core$Array$branchFactor;
			var tail = A3(elm$core$Elm$JsArray$initialize, tailLen, len - tailLen, fn);
			var initialFromIndex = (len - tailLen) - elm$core$Array$branchFactor;
			return A5(elm$core$Array$initializeHelp, fn, initialFromIndex, len, _List_Nil, tail);
		}
	});
var elm$core$Maybe$Just = function (a) {
	return {$: 0, a: a};
};
var elm$core$Maybe$Nothing = {$: 1};
var elm$core$Basics$True = 0;
var elm$core$Result$isOk = function (result) {
	if (!result.$) {
		return true;
	} else {
		return false;
	}
};
var elm$json$Json$Decode$Failure = F2(
	function (a, b) {
		return {$: 3, a: a, b: b};
	});
var elm$json$Json$Decode$Field = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var elm$json$Json$Decode$Index = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var elm$json$Json$Decode$OneOf = function (a) {
	return {$: 2, a: a};
};
var elm$core$Basics$and = _Basics_and;
var elm$core$Basics$append = _Utils_append;
var elm$core$Basics$or = _Basics_or;
var elm$core$Char$toCode = _Char_toCode;
var elm$core$Char$isLower = function (_char) {
	var code = elm$core$Char$toCode(_char);
	return (97 <= code) && (code <= 122);
};
var elm$core$Char$isUpper = function (_char) {
	var code = elm$core$Char$toCode(_char);
	return (code <= 90) && (65 <= code);
};
var elm$core$Char$isAlpha = function (_char) {
	return elm$core$Char$isLower(_char) || elm$core$Char$isUpper(_char);
};
var elm$core$Char$isDigit = function (_char) {
	var code = elm$core$Char$toCode(_char);
	return (code <= 57) && (48 <= code);
};
var elm$core$Char$isAlphaNum = function (_char) {
	return elm$core$Char$isLower(_char) || (elm$core$Char$isUpper(_char) || elm$core$Char$isDigit(_char));
};
var elm$core$List$length = function (xs) {
	return A3(
		elm$core$List$foldl,
		F2(
			function (_n0, i) {
				return i + 1;
			}),
		0,
		xs);
};
var elm$core$List$map2 = _List_map2;
var elm$core$List$rangeHelp = F3(
	function (lo, hi, list) {
		rangeHelp:
		while (true) {
			if (_Utils_cmp(lo, hi) < 1) {
				var $temp$lo = lo,
					$temp$hi = hi - 1,
					$temp$list = A2(elm$core$List$cons, hi, list);
				lo = $temp$lo;
				hi = $temp$hi;
				list = $temp$list;
				continue rangeHelp;
			} else {
				return list;
			}
		}
	});
var elm$core$List$range = F2(
	function (lo, hi) {
		return A3(elm$core$List$rangeHelp, lo, hi, _List_Nil);
	});
var elm$core$List$indexedMap = F2(
	function (f, xs) {
		return A3(
			elm$core$List$map2,
			f,
			A2(
				elm$core$List$range,
				0,
				elm$core$List$length(xs) - 1),
			xs);
	});
var elm$core$String$all = _String_all;
var elm$core$String$fromInt = _String_fromNumber;
var elm$core$String$join = F2(
	function (sep, chunks) {
		return A2(
			_String_join,
			sep,
			_List_toArray(chunks));
	});
var elm$core$String$uncons = _String_uncons;
var elm$core$String$split = F2(
	function (sep, string) {
		return _List_fromArray(
			A2(_String_split, sep, string));
	});
var elm$json$Json$Decode$indent = function (str) {
	return A2(
		elm$core$String$join,
		'\n    ',
		A2(elm$core$String$split, '\n', str));
};
var elm$json$Json$Encode$encode = _Json_encode;
var elm$json$Json$Decode$errorOneOf = F2(
	function (i, error) {
		return '\n\n(' + (elm$core$String$fromInt(i + 1) + (') ' + elm$json$Json$Decode$indent(
			elm$json$Json$Decode$errorToString(error))));
	});
var elm$json$Json$Decode$errorToString = function (error) {
	return A2(elm$json$Json$Decode$errorToStringHelp, error, _List_Nil);
};
var elm$json$Json$Decode$errorToStringHelp = F2(
	function (error, context) {
		errorToStringHelp:
		while (true) {
			switch (error.$) {
				case 0:
					var f = error.a;
					var err = error.b;
					var isSimple = function () {
						var _n1 = elm$core$String$uncons(f);
						if (_n1.$ === 1) {
							return false;
						} else {
							var _n2 = _n1.a;
							var _char = _n2.a;
							var rest = _n2.b;
							return elm$core$Char$isAlpha(_char) && A2(elm$core$String$all, elm$core$Char$isAlphaNum, rest);
						}
					}();
					var fieldName = isSimple ? ('.' + f) : ('[\'' + (f + '\']'));
					var $temp$error = err,
						$temp$context = A2(elm$core$List$cons, fieldName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 1:
					var i = error.a;
					var err = error.b;
					var indexName = '[' + (elm$core$String$fromInt(i) + ']');
					var $temp$error = err,
						$temp$context = A2(elm$core$List$cons, indexName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 2:
					var errors = error.a;
					if (!errors.b) {
						return 'Ran into a Json.Decode.oneOf with no possibilities' + function () {
							if (!context.b) {
								return '!';
							} else {
								return ' at json' + A2(
									elm$core$String$join,
									'',
									elm$core$List$reverse(context));
							}
						}();
					} else {
						if (!errors.b.b) {
							var err = errors.a;
							var $temp$error = err,
								$temp$context = context;
							error = $temp$error;
							context = $temp$context;
							continue errorToStringHelp;
						} else {
							var starter = function () {
								if (!context.b) {
									return 'Json.Decode.oneOf';
								} else {
									return 'The Json.Decode.oneOf at json' + A2(
										elm$core$String$join,
										'',
										elm$core$List$reverse(context));
								}
							}();
							var introduction = starter + (' failed in the following ' + (elm$core$String$fromInt(
								elm$core$List$length(errors)) + ' ways:'));
							return A2(
								elm$core$String$join,
								'\n\n',
								A2(
									elm$core$List$cons,
									introduction,
									A2(elm$core$List$indexedMap, elm$json$Json$Decode$errorOneOf, errors)));
						}
					}
				default:
					var msg = error.a;
					var json = error.b;
					var introduction = function () {
						if (!context.b) {
							return 'Problem with the given value:\n\n';
						} else {
							return 'Problem with the value at json' + (A2(
								elm$core$String$join,
								'',
								elm$core$List$reverse(context)) + ':\n\n    ');
						}
					}();
					return introduction + (elm$json$Json$Decode$indent(
						A2(elm$json$Json$Encode$encode, 4, json)) + ('\n\n' + msg));
			}
		}
	});
var elm$json$Json$Decode$andThen = _Json_andThen;
var elm$json$Json$Decode$decodeValue = _Json_run;
var elm$json$Json$Decode$fail = _Json_fail;
var elm$json$Json$Decode$succeed = _Json_succeed;
var elm$json$Json$Decode$value = _Json_decodeValue;
var author$project$Client$Main$successOrErrorDecoder = F2(
	function (successDecoder, errorDecoder) {
		return A2(
			elm$json$Json$Decode$andThen,
			function (value) {
				var _n0 = A2(elm$json$Json$Decode$decodeValue, successDecoder, value);
				if (!_n0.$) {
					var response = _n0.a;
					return elm$json$Json$Decode$succeed(
						elm$core$Result$Ok(response));
				} else {
					var _n1 = A2(elm$json$Json$Decode$decodeValue, errorDecoder, value);
					if (!_n1.$) {
						var error = _n1.a;
						return elm$json$Json$Decode$succeed(
							elm$core$Result$Err(error));
					} else {
						return elm$json$Json$Decode$fail('Unknown response');
					}
				}
			},
			elm$json$Json$Decode$value);
	});
var author$project$Server$Route$AttackResponse = F3(
	function (world, messageQueue, fight) {
		return {aM: fight, at: messageQueue, H: world};
	});
var author$project$Shared$Fight$YouLost = 1;
var author$project$Shared$Fight$YouWon = 0;
var elm$json$Json$Decode$string = _Json_decodeString;
var author$project$Shared$Fight$decoder = A2(
	elm$json$Json$Decode$andThen,
	function (string) {
		switch (string) {
			case 'you-won':
				return elm$json$Json$Decode$succeed(0);
			case 'you-lost':
				return elm$json$Json$Decode$succeed(1);
			default:
				return elm$json$Json$Decode$fail('Unknown Fight value');
		}
	},
	elm$json$Json$Decode$string);
var elm$json$Json$Decode$map = _Json_map1;
var elm$json$Json$Decode$oneOf = _Json_oneOf;
var elm$json$Json$Decode$maybe = function (decoder) {
	return elm$json$Json$Decode$oneOf(
		_List_fromArray(
			[
				A2(elm$json$Json$Decode$map, elm$core$Maybe$Just, decoder),
				elm$json$Json$Decode$succeed(elm$core$Maybe$Nothing)
			]));
};
var author$project$Shared$Fight$maybeDecoder = elm$json$Json$Decode$maybe(author$project$Shared$Fight$decoder);
var elm$json$Json$Decode$list = _Json_decodeList;
var author$project$Shared$MessageQueue$decoder = elm$json$Json$Decode$list(elm$json$Json$Decode$string);
var author$project$Shared$Player$ClientPlayer = F6(
	function (hp, maxHp, xp, name, special, availableSpecial) {
		return {aC: availableSpecial, V: hp, bA: maxHp, ai: name, bN: special, af: xp};
	});
var author$project$Shared$Special$Special = F7(
	function (strength, perception, endurance, charisma, intelligence, agility, luck) {
		return {t: agility, u: charisma, w: endurance, y: intelligence, z: luck, C: perception, E: strength};
	});
var elm$json$Json$Decode$field = _Json_decodeField;
var elm$json$Json$Decode$int = _Json_decodeInt;
var elm$json$Json$Decode$map7 = _Json_map7;
var author$project$Shared$Special$decoder = A8(
	elm$json$Json$Decode$map7,
	author$project$Shared$Special$Special,
	A2(elm$json$Json$Decode$field, 'strength', elm$json$Json$Decode$int),
	A2(elm$json$Json$Decode$field, 'perception', elm$json$Json$Decode$int),
	A2(elm$json$Json$Decode$field, 'endurance', elm$json$Json$Decode$int),
	A2(elm$json$Json$Decode$field, 'charisma', elm$json$Json$Decode$int),
	A2(elm$json$Json$Decode$field, 'intelligence', elm$json$Json$Decode$int),
	A2(elm$json$Json$Decode$field, 'agility', elm$json$Json$Decode$int),
	A2(elm$json$Json$Decode$field, 'luck', elm$json$Json$Decode$int));
var elm$json$Json$Decode$map6 = _Json_map6;
var author$project$Shared$Player$decoder = A7(
	elm$json$Json$Decode$map6,
	author$project$Shared$Player$ClientPlayer,
	A2(elm$json$Json$Decode$field, 'hp', elm$json$Json$Decode$int),
	A2(elm$json$Json$Decode$field, 'maxHp', elm$json$Json$Decode$int),
	A2(elm$json$Json$Decode$field, 'xp', elm$json$Json$Decode$int),
	A2(elm$json$Json$Decode$field, 'name', elm$json$Json$Decode$string),
	A2(elm$json$Json$Decode$field, 'special', author$project$Shared$Special$decoder),
	A2(elm$json$Json$Decode$field, 'availableSpecial', elm$json$Json$Decode$int));
var author$project$Shared$Player$ClientOtherPlayer = F3(
	function (hp, xp, name) {
		return {V: hp, ai: name, af: xp};
	});
var elm$json$Json$Decode$map3 = _Json_map3;
var author$project$Shared$Player$otherPlayerDecoder = A4(
	elm$json$Json$Decode$map3,
	author$project$Shared$Player$ClientOtherPlayer,
	A2(elm$json$Json$Decode$field, 'hp', elm$json$Json$Decode$int),
	A2(elm$json$Json$Decode$field, 'xp', elm$json$Json$Decode$int),
	A2(elm$json$Json$Decode$field, 'name', elm$json$Json$Decode$string));
var author$project$Shared$World$ClientWorld = F2(
	function (player, otherPlayers) {
		return {bF: otherPlayers, a0: player};
	});
var elm$json$Json$Decode$map2 = _Json_map2;
var author$project$Shared$World$decoder = A3(
	elm$json$Json$Decode$map2,
	author$project$Shared$World$ClientWorld,
	A2(elm$json$Json$Decode$field, 'player', author$project$Shared$Player$decoder),
	A2(
		elm$json$Json$Decode$field,
		'otherPlayers',
		elm$json$Json$Decode$list(author$project$Shared$Player$otherPlayerDecoder)));
var author$project$Server$Route$attackDecoder = A4(
	elm$json$Json$Decode$map3,
	author$project$Server$Route$AttackResponse,
	A2(elm$json$Json$Decode$field, 'world', author$project$Shared$World$decoder),
	A2(elm$json$Json$Decode$field, 'messageQueue', author$project$Shared$MessageQueue$decoder),
	A2(elm$json$Json$Decode$field, 'fight', author$project$Shared$Fight$maybeDecoder));
var author$project$Shared$Player$serverToClient = function (_n0) {
	var hp = _n0.V;
	var xp = _n0.af;
	var maxHp = _n0.bA;
	var name = _n0.ai;
	var special = _n0.bN;
	var availableSpecial = _n0.aC;
	return {aC: availableSpecial, V: hp, bA: maxHp, ai: name, bN: special, af: xp};
};
var author$project$Shared$Player$serverToClientOther = function (_n0) {
	var hp = _n0.V;
	var xp = _n0.af;
	var name = _n0.ai;
	return {V: hp, ai: name, af: xp};
};
var elm$core$Basics$composeR = F3(
	function (f, g, x) {
		return g(
			f(x));
	});
var elm$core$List$head = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return elm$core$Maybe$Just(x);
	} else {
		return elm$core$Maybe$Nothing;
	}
};
var elm$core$List$foldrHelper = F4(
	function (fn, acc, ctr, ls) {
		if (!ls.b) {
			return acc;
		} else {
			var a = ls.a;
			var r1 = ls.b;
			if (!r1.b) {
				return A2(fn, a, acc);
			} else {
				var b = r1.a;
				var r2 = r1.b;
				if (!r2.b) {
					return A2(
						fn,
						a,
						A2(fn, b, acc));
				} else {
					var c = r2.a;
					var r3 = r2.b;
					if (!r3.b) {
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(fn, c, acc)));
					} else {
						var d = r3.a;
						var r4 = r3.b;
						var res = (ctr > 500) ? A3(
							elm$core$List$foldl,
							fn,
							acc,
							elm$core$List$reverse(r4)) : A4(elm$core$List$foldrHelper, fn, acc, ctr + 1, r4);
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(
									fn,
									c,
									A2(fn, d, res))));
					}
				}
			}
		}
	});
var elm$core$List$foldr = F3(
	function (fn, acc, ls) {
		return A4(elm$core$List$foldrHelper, fn, acc, 0, ls);
	});
var elm$core$List$map = F2(
	function (f, xs) {
		return A3(
			elm$core$List$foldr,
			F2(
				function (x, acc) {
					return A2(
						elm$core$List$cons,
						f(x),
						acc);
				}),
			_List_Nil,
			xs);
	});
var elm$core$List$partition = F2(
	function (pred, list) {
		var step = F2(
			function (x, _n0) {
				var trues = _n0.a;
				var falses = _n0.b;
				return pred(x) ? _Utils_Tuple2(
					A2(elm$core$List$cons, x, trues),
					falses) : _Utils_Tuple2(
					trues,
					A2(elm$core$List$cons, x, falses));
			});
		return A3(
			elm$core$List$foldr,
			step,
			_Utils_Tuple2(_List_Nil, _List_Nil),
			list);
	});
var elm$core$Maybe$map = F2(
	function (f, maybe) {
		if (!maybe.$) {
			var value = maybe.a;
			return elm$core$Maybe$Just(
				f(value));
		} else {
			return elm$core$Maybe$Nothing;
		}
	});
var elm$core$Tuple$mapFirst = F2(
	function (func, _n0) {
		var x = _n0.a;
		var y = _n0.b;
		return _Utils_Tuple2(
			func(x),
			y);
	});
var elm$core$Tuple$mapSecond = F2(
	function (func, _n0) {
		var x = _n0.a;
		var y = _n0.b;
		return _Utils_Tuple2(
			x,
			func(y));
	});
var elm$core$Tuple$second = function (_n0) {
	var y = _n0.b;
	return y;
};
var author$project$Shared$World$serverToClient = F2(
	function (playerName, serverWorld) {
		var _n0 = A2(
			elm$core$Tuple$mapSecond,
			elm$core$List$map(
				A2(elm$core$Basics$composeR, elm$core$Tuple$second, author$project$Shared$Player$serverToClientOther)),
			A2(
				elm$core$Tuple$mapFirst,
				elm$core$List$head,
				A2(
					elm$core$List$partition,
					function (_n1) {
						var name = _n1.a;
						return _Utils_eq(name, playerName);
					},
					elm$core$Dict$toList(serverWorld.bG))));
		var maybePlayer = _n0.a;
		var otherPlayers = _n0.b;
		return A2(
			elm$core$Maybe$map,
			function (_n2) {
				var player = _n2.b;
				return {
					bF: otherPlayers,
					a0: author$project$Shared$Player$serverToClient(player)
				};
			},
			maybePlayer);
	});
var author$project$Server$Route$attackResponse = F4(
	function (messageQueue, name, world, maybeFight) {
		return A2(
			elm$core$Maybe$map,
			function (clientWorld) {
				return A3(author$project$Server$Route$AttackResponse, clientWorld, messageQueue, maybeFight);
			},
			A2(author$project$Shared$World$serverToClient, name, world));
	});
var elm$url$Url$Builder$toQueryPair = function (_n0) {
	var key = _n0.a;
	var value = _n0.b;
	return key + ('=' + value);
};
var elm$url$Url$Builder$toQuery = function (parameters) {
	if (!parameters.b) {
		return '';
	} else {
		return '?' + A2(
			elm$core$String$join,
			'&',
			A2(elm$core$List$map, elm$url$Url$Builder$toQueryPair, parameters));
	}
};
var elm$url$Url$Builder$absolute = F2(
	function (pathSegments, parameters) {
		return '/' + (A2(elm$core$String$join, '/', pathSegments) + elm$url$Url$Builder$toQuery(parameters));
	});
var author$project$Server$Route$attackToUrl = function (theirName) {
	return A2(
		elm$url$Url$Builder$absolute,
		_List_fromArray(
			['attack', theirName]),
		_List_Nil);
};
var author$project$Server$Route$Attack = function (a) {
	return {$: 5, a: a};
};
var elm$core$Basics$identity = function (x) {
	return x;
};
var elm$url$Url$Parser$Parser = elm$core$Basics$identity;
var elm$url$Url$Parser$State = F5(
	function (visited, unvisited, params, frag, value) {
		return {x: frag, B: params, s: unvisited, n: value, G: visited};
	});
var elm$url$Url$Parser$mapState = F2(
	function (func, _n0) {
		var visited = _n0.G;
		var unvisited = _n0.s;
		var params = _n0.B;
		var frag = _n0.x;
		var value = _n0.n;
		return A5(
			elm$url$Url$Parser$State,
			visited,
			unvisited,
			params,
			frag,
			func(value));
	});
var elm$url$Url$Parser$map = F2(
	function (subValue, _n0) {
		var parseArg = _n0;
		return function (_n1) {
			var visited = _n1.G;
			var unvisited = _n1.s;
			var params = _n1.B;
			var frag = _n1.x;
			var value = _n1.n;
			return A2(
				elm$core$List$map,
				elm$url$Url$Parser$mapState(value),
				parseArg(
					A5(elm$url$Url$Parser$State, visited, unvisited, params, frag, subValue)));
		};
	});
var elm$url$Url$Parser$s = function (str) {
	return function (_n0) {
		var visited = _n0.G;
		var unvisited = _n0.s;
		var params = _n0.B;
		var frag = _n0.x;
		var value = _n0.n;
		if (!unvisited.b) {
			return _List_Nil;
		} else {
			var next = unvisited.a;
			var rest = unvisited.b;
			return _Utils_eq(next, str) ? _List_fromArray(
				[
					A5(
					elm$url$Url$Parser$State,
					A2(elm$core$List$cons, next, visited),
					rest,
					params,
					frag,
					value)
				]) : _List_Nil;
		}
	};
};
var elm$core$List$append = F2(
	function (xs, ys) {
		if (!ys.b) {
			return xs;
		} else {
			return A3(elm$core$List$foldr, elm$core$List$cons, ys, xs);
		}
	});
var elm$core$List$concat = function (lists) {
	return A3(elm$core$List$foldr, elm$core$List$append, _List_Nil, lists);
};
var elm$core$List$concatMap = F2(
	function (f, list) {
		return elm$core$List$concat(
			A2(elm$core$List$map, f, list));
	});
var elm$url$Url$Parser$slash = F2(
	function (_n0, _n1) {
		var parseBefore = _n0;
		var parseAfter = _n1;
		return function (state) {
			return A2(
				elm$core$List$concatMap,
				parseAfter,
				parseBefore(state));
		};
	});
var elm$url$Url$Parser$custom = F2(
	function (tipe, stringToSomething) {
		return function (_n0) {
			var visited = _n0.G;
			var unvisited = _n0.s;
			var params = _n0.B;
			var frag = _n0.x;
			var value = _n0.n;
			if (!unvisited.b) {
				return _List_Nil;
			} else {
				var next = unvisited.a;
				var rest = unvisited.b;
				var _n2 = stringToSomething(next);
				if (!_n2.$) {
					var nextValue = _n2.a;
					return _List_fromArray(
						[
							A5(
							elm$url$Url$Parser$State,
							A2(elm$core$List$cons, next, visited),
							rest,
							params,
							frag,
							value(nextValue))
						]);
				} else {
					return _List_Nil;
				}
			}
		};
	});
var elm$url$Url$Parser$string = A2(elm$url$Url$Parser$custom, 'STRING', elm$core$Maybe$Just);
var author$project$Server$Route$attackUrlParser = A2(
	elm$url$Url$Parser$map,
	author$project$Server$Route$Attack,
	A2(
		elm$url$Url$Parser$slash,
		elm$url$Url$Parser$s('attack'),
		elm$url$Url$Parser$string));
var author$project$Server$Route$AuthenticationHeadersMissing = 1;
var author$project$Server$Route$NameAndPasswordDoesntCheckOut = 0;
var author$project$Server$Route$NameNotFound = 2;
var author$project$Server$Route$authErrorFromString = function (string) {
	switch (string) {
		case 'Name and password doesn\'t check out':
			return elm$core$Maybe$Just(0);
		case 'Authentication headers missing':
			return elm$core$Maybe$Just(1);
		case 'Name not found':
			return elm$core$Maybe$Just(2);
		default:
			return elm$core$Maybe$Nothing;
	}
};
var author$project$Server$Route$authErrorDecoder = A2(
	elm$json$Json$Decode$field,
	'error',
	A2(
		elm$json$Json$Decode$andThen,
		function (string) {
			var _n0 = author$project$Server$Route$authErrorFromString(string);
			if (!_n0.$) {
				var error = _n0.a;
				return elm$json$Json$Decode$succeed(error);
			} else {
				return elm$json$Json$Decode$fail('Unknown AuthError');
			}
		},
		elm$json$Json$Decode$string));
var elm$json$Json$Encode$string = _Json_wrap;
var author$project$Shared$Fight$encode = function (fight) {
	return elm$json$Json$Encode$string(
		function () {
			if (!fight) {
				return 'you-won';
			} else {
				return 'you-lost';
			}
		}());
};
var elm$core$Maybe$withDefault = F2(
	function (_default, maybe) {
		if (!maybe.$) {
			var value = maybe.a;
			return value;
		} else {
			return _default;
		}
	});
var elm$json$Json$Encode$null = _Json_encodeNull;
var author$project$Shared$Fight$encodeMaybe = function (maybeFight) {
	return A2(
		elm$core$Maybe$withDefault,
		elm$json$Json$Encode$null,
		A2(elm$core$Maybe$map, author$project$Shared$Fight$encode, maybeFight));
};
var elm$json$Json$Encode$list = F2(
	function (func, entries) {
		return _Json_wrap(
			A3(
				elm$core$List$foldl,
				_Json_addEntry(func),
				_Json_emptyArray(0),
				entries));
	});
var author$project$Shared$MessageQueue$encode = function (messageQueue) {
	return A2(elm$json$Json$Encode$list, elm$json$Json$Encode$string, messageQueue);
};
var elm$json$Json$Encode$int = _Json_wrap;
var elm$json$Json$Encode$object = function (pairs) {
	return _Json_wrap(
		A3(
			elm$core$List$foldl,
			F2(
				function (_n0, obj) {
					var k = _n0.a;
					var v = _n0.b;
					return A3(_Json_addField, k, v, obj);
				}),
			_Json_emptyObject(0),
			pairs));
};
var author$project$Shared$Special$encode = function (special) {
	return elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'strength',
				elm$json$Json$Encode$int(special.E)),
				_Utils_Tuple2(
				'perception',
				elm$json$Json$Encode$int(special.C)),
				_Utils_Tuple2(
				'endurance',
				elm$json$Json$Encode$int(special.w)),
				_Utils_Tuple2(
				'charisma',
				elm$json$Json$Encode$int(special.u)),
				_Utils_Tuple2(
				'intelligence',
				elm$json$Json$Encode$int(special.y)),
				_Utils_Tuple2(
				'agility',
				elm$json$Json$Encode$int(special.t)),
				_Utils_Tuple2(
				'luck',
				elm$json$Json$Encode$int(special.z))
			]));
};
var author$project$Shared$Player$encode = function (_n0) {
	var hp = _n0.V;
	var maxHp = _n0.bA;
	var xp = _n0.af;
	var name = _n0.ai;
	var special = _n0.bN;
	var availableSpecial = _n0.aC;
	return elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'hp',
				elm$json$Json$Encode$int(hp)),
				_Utils_Tuple2(
				'maxHp',
				elm$json$Json$Encode$int(maxHp)),
				_Utils_Tuple2(
				'xp',
				elm$json$Json$Encode$int(xp)),
				_Utils_Tuple2(
				'name',
				elm$json$Json$Encode$string(name)),
				_Utils_Tuple2(
				'special',
				author$project$Shared$Special$encode(special)),
				_Utils_Tuple2(
				'availableSpecial',
				elm$json$Json$Encode$int(availableSpecial))
			]));
};
var author$project$Shared$Player$encodeOtherPlayer = function (_n0) {
	var hp = _n0.V;
	var xp = _n0.af;
	var name = _n0.ai;
	return elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'hp',
				elm$json$Json$Encode$int(hp)),
				_Utils_Tuple2(
				'xp',
				elm$json$Json$Encode$int(xp)),
				_Utils_Tuple2(
				'name',
				elm$json$Json$Encode$string(name))
			]));
};
var author$project$Shared$World$encode = function (world) {
	return elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'player',
				author$project$Shared$Player$encode(world.a0)),
				_Utils_Tuple2(
				'otherPlayers',
				A2(elm$json$Json$Encode$list, author$project$Shared$Player$encodeOtherPlayer, world.bF))
			]));
};
var author$project$Server$Route$encodeAttack = function (_n0) {
	var world = _n0.H;
	var fight = _n0.aM;
	var messageQueue = _n0.at;
	return elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'world',
				author$project$Shared$World$encode(world)),
				_Utils_Tuple2(
				'messageQueue',
				author$project$Shared$MessageQueue$encode(messageQueue)),
				_Utils_Tuple2(
				'fight',
				author$project$Shared$Fight$encodeMaybe(fight))
			]));
};
var author$project$Server$Route$authErrorToString = function (error) {
	switch (error) {
		case 0:
			return 'Name and password doesn\'t check out';
		case 1:
			return 'Authentication headers missing';
		default:
			return 'Name not found';
	}
};
var author$project$Server$Route$encodeAuthError = function (error) {
	return elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'error',
				elm$json$Json$Encode$string(
					author$project$Server$Route$authErrorToString(error)))
			]));
};
var author$project$Server$Route$attack = {v: author$project$Server$Route$attackDecoder, p: author$project$Server$Route$encodeAttack, T: author$project$Server$Route$encodeAuthError, U: author$project$Server$Route$authErrorDecoder, D: author$project$Server$Route$attackResponse, i: author$project$Server$Route$attackToUrl, j: author$project$Server$Route$attackUrlParser};
var author$project$Server$Route$encodeIncSpecialAttr = function (_n0) {
	var world = _n0.H;
	var messageQueue = _n0.at;
	return elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'world',
				author$project$Shared$World$encode(world)),
				_Utils_Tuple2(
				'messageQueue',
				author$project$Shared$MessageQueue$encode(messageQueue))
			]));
};
var author$project$Server$Route$IncSpecialAttrResponse = F2(
	function (world, messageQueue) {
		return {at: messageQueue, H: world};
	});
var author$project$Server$Route$incSpecialAttrDecoder = A3(
	elm$json$Json$Decode$map2,
	author$project$Server$Route$IncSpecialAttrResponse,
	A2(elm$json$Json$Decode$field, 'world', author$project$Shared$World$decoder),
	A2(elm$json$Json$Decode$field, 'messageQueue', author$project$Shared$MessageQueue$decoder));
var author$project$Server$Route$incSpecialAttrResponse = F3(
	function (messageQueue, name, world) {
		return A2(
			elm$core$Maybe$map,
			function (clientWorld) {
				return A2(author$project$Server$Route$IncSpecialAttrResponse, clientWorld, messageQueue);
			},
			A2(author$project$Shared$World$serverToClient, name, world));
	});
var author$project$Shared$Special$label = function (attr) {
	switch (attr) {
		case 0:
			return 'Strength';
		case 1:
			return 'Perception';
		case 2:
			return 'Endurance';
		case 3:
			return 'Charisma';
		case 4:
			return 'intelligence';
		case 5:
			return 'Agility';
		default:
			return 'Luck';
	}
};
var elm$core$String$toLower = _String_toLower;
var author$project$Server$Route$incSpecialAttrToUrl = function (attr) {
	return A2(
		elm$url$Url$Builder$absolute,
		_List_fromArray(
			[
				'inc-special-attr',
				elm$core$String$toLower(
				author$project$Shared$Special$label(attr))
			]),
		_List_Nil);
};
var author$project$Server$Route$IncSpecialAttr = function (a) {
	return {$: 7, a: a};
};
var author$project$Shared$Special$Agility = 5;
var author$project$Shared$Special$Charisma = 3;
var author$project$Shared$Special$Endurance = 2;
var author$project$Shared$Special$Intelligence = 4;
var author$project$Shared$Special$Luck = 6;
var author$project$Shared$Special$Perception = 1;
var author$project$Shared$Special$Strength = 0;
var elm$url$Url$Parser$oneOf = function (parsers) {
	return function (state) {
		return A2(
			elm$core$List$concatMap,
			function (_n0) {
				var parser = _n0;
				return parser(state);
			},
			parsers);
	};
};
var author$project$Shared$Special$urlParser = elm$url$Url$Parser$oneOf(
	_List_fromArray(
		[
			A2(
			elm$url$Url$Parser$map,
			0,
			elm$url$Url$Parser$s('strength')),
			A2(
			elm$url$Url$Parser$map,
			1,
			elm$url$Url$Parser$s('perception')),
			A2(
			elm$url$Url$Parser$map,
			2,
			elm$url$Url$Parser$s('endurance')),
			A2(
			elm$url$Url$Parser$map,
			3,
			elm$url$Url$Parser$s('charisma')),
			A2(
			elm$url$Url$Parser$map,
			4,
			elm$url$Url$Parser$s('intelligence')),
			A2(
			elm$url$Url$Parser$map,
			5,
			elm$url$Url$Parser$s('agility')),
			A2(
			elm$url$Url$Parser$map,
			6,
			elm$url$Url$Parser$s('luck'))
		]));
var author$project$Server$Route$incSpecialAttrUrlParser = A2(
	elm$url$Url$Parser$map,
	author$project$Server$Route$IncSpecialAttr,
	A2(
		elm$url$Url$Parser$slash,
		elm$url$Url$Parser$s('inc-special-attr'),
		author$project$Shared$Special$urlParser));
var author$project$Server$Route$incSpecialAttr = {v: author$project$Server$Route$incSpecialAttrDecoder, p: author$project$Server$Route$encodeIncSpecialAttr, T: author$project$Server$Route$encodeAuthError, U: author$project$Server$Route$authErrorDecoder, D: author$project$Server$Route$incSpecialAttrResponse, i: author$project$Server$Route$incSpecialAttrToUrl, j: author$project$Server$Route$incSpecialAttrUrlParser};
var author$project$Server$Route$encodeLogin = function (_n0) {
	var world = _n0.H;
	var messageQueue = _n0.at;
	return elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'world',
				author$project$Shared$World$encode(world)),
				_Utils_Tuple2(
				'messageQueue',
				author$project$Shared$MessageQueue$encode(messageQueue))
			]));
};
var author$project$Server$Route$LoginResponse = F2(
	function (world, messageQueue) {
		return {at: messageQueue, H: world};
	});
var author$project$Server$Route$loginDecoder = A3(
	elm$json$Json$Decode$map2,
	author$project$Server$Route$LoginResponse,
	A2(elm$json$Json$Decode$field, 'world', author$project$Shared$World$decoder),
	A2(elm$json$Json$Decode$field, 'messageQueue', author$project$Shared$MessageQueue$decoder));
var author$project$Server$Route$loginResponse = F3(
	function (messageQueue, name, world) {
		return A2(
			elm$core$Maybe$map,
			function (clientWorld) {
				return A2(author$project$Server$Route$LoginResponse, clientWorld, messageQueue);
			},
			A2(author$project$Shared$World$serverToClient, name, world));
	});
var author$project$Server$Route$loginToUrl = A2(
	elm$url$Url$Builder$absolute,
	_List_fromArray(
		['login']),
	_List_Nil);
var author$project$Server$Route$Login = {$: 2};
var author$project$Server$Route$loginUrlParser = A2(
	elm$url$Url$Parser$map,
	author$project$Server$Route$Login,
	elm$url$Url$Parser$s('login'));
var author$project$Server$Route$login = {v: author$project$Server$Route$loginDecoder, p: author$project$Server$Route$encodeLogin, T: author$project$Server$Route$encodeAuthError, U: author$project$Server$Route$authErrorDecoder, aJ: author$project$Server$Route$authErrorToString, D: author$project$Server$Route$loginResponse, i: author$project$Server$Route$loginToUrl, j: author$project$Server$Route$loginUrlParser};
var author$project$Shared$World$encodeAnonymous = function (world) {
	return elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'players',
				A2(elm$json$Json$Encode$list, author$project$Shared$Player$encodeOtherPlayer, world.bG))
			]));
};
var author$project$Server$Route$encodeLogout = function (_n0) {
	var world = _n0.H;
	return elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'world',
				author$project$Shared$World$encodeAnonymous(world))
			]));
};
var author$project$Server$Route$LogoutResponse = function (world) {
	return {H: world};
};
var author$project$Shared$World$AnonymousClientWorld = function (players) {
	return {bG: players};
};
var author$project$Shared$World$anonymousDecoder = A2(
	elm$json$Json$Decode$map,
	author$project$Shared$World$AnonymousClientWorld,
	A2(
		elm$json$Json$Decode$field,
		'players',
		elm$json$Json$Decode$list(author$project$Shared$Player$otherPlayerDecoder)));
var author$project$Server$Route$logoutDecoder = A2(
	elm$json$Json$Decode$map,
	author$project$Server$Route$LogoutResponse,
	A2(elm$json$Json$Decode$field, 'world', author$project$Shared$World$anonymousDecoder));
var elm$core$Dict$values = function (dict) {
	return A3(
		elm$core$Dict$foldr,
		F3(
			function (key, value, valueList) {
				return A2(elm$core$List$cons, value, valueList);
			}),
		_List_Nil,
		dict);
};
var author$project$Shared$World$serverToAnonymous = function (world) {
	return {
		bG: A2(
			elm$core$List$map,
			author$project$Shared$Player$serverToClientOther,
			elm$core$Dict$values(world.bG))
	};
};
var author$project$Server$Route$logoutResponse = function (world) {
	return author$project$Server$Route$LogoutResponse(
		author$project$Shared$World$serverToAnonymous(world));
};
var author$project$Server$Route$logoutToUrl = A2(
	elm$url$Url$Builder$absolute,
	_List_fromArray(
		['logout']),
	_List_Nil);
var author$project$Server$Route$Logout = {$: 6};
var author$project$Server$Route$logoutUrlParser = A2(
	elm$url$Url$Parser$map,
	author$project$Server$Route$Logout,
	elm$url$Url$Parser$s('logout'));
var author$project$Server$Route$logout = {v: author$project$Server$Route$logoutDecoder, p: author$project$Server$Route$encodeLogout, D: author$project$Server$Route$logoutResponse, i: author$project$Server$Route$logoutToUrl, j: author$project$Server$Route$logoutUrlParser};
var author$project$Server$Route$encodeNotFound = function (url) {
	return elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'error',
				elm$json$Json$Encode$string('Route \"' + (url + '\" not found.')))
			]));
};
var author$project$Server$Route$notFoundToUrl = A2(
	elm$url$Url$Builder$absolute,
	_List_fromArray(
		['404']),
	_List_Nil);
var author$project$Server$Route$notFound = {p: author$project$Server$Route$encodeNotFound, i: author$project$Server$Route$notFoundToUrl};
var author$project$Server$Route$encodeRefresh = function (_n0) {
	var world = _n0.H;
	var messageQueue = _n0.at;
	return elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'world',
				author$project$Shared$World$encode(world)),
				_Utils_Tuple2(
				'messageQueue',
				author$project$Shared$MessageQueue$encode(messageQueue))
			]));
};
var author$project$Server$Route$RefreshResponse = F2(
	function (world, messageQueue) {
		return {at: messageQueue, H: world};
	});
var author$project$Server$Route$refreshDecoder = A3(
	elm$json$Json$Decode$map2,
	author$project$Server$Route$RefreshResponse,
	A2(elm$json$Json$Decode$field, 'world', author$project$Shared$World$decoder),
	A2(elm$json$Json$Decode$field, 'messageQueue', author$project$Shared$MessageQueue$decoder));
var author$project$Server$Route$refreshResponse = F3(
	function (messageQueue, name, world) {
		return A2(
			elm$core$Maybe$map,
			function (clientWorld) {
				return A2(author$project$Server$Route$RefreshResponse, clientWorld, messageQueue);
			},
			A2(author$project$Shared$World$serverToClient, name, world));
	});
var author$project$Server$Route$refreshToUrl = A2(
	elm$url$Url$Builder$absolute,
	_List_fromArray(
		['refresh']),
	_List_Nil);
var author$project$Server$Route$Refresh = {$: 3};
var author$project$Server$Route$refreshUrlParser = A2(
	elm$url$Url$Parser$map,
	author$project$Server$Route$Refresh,
	elm$url$Url$Parser$s('refresh'));
var author$project$Server$Route$refresh = {v: author$project$Server$Route$refreshDecoder, p: author$project$Server$Route$encodeRefresh, T: author$project$Server$Route$encodeAuthError, U: author$project$Server$Route$authErrorDecoder, D: author$project$Server$Route$refreshResponse, i: author$project$Server$Route$refreshToUrl, j: author$project$Server$Route$refreshUrlParser};
var author$project$Server$Route$encodeRefreshAnonymous = function (_n0) {
	var world = _n0.H;
	return elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'world',
				author$project$Shared$World$encodeAnonymous(world))
			]));
};
var author$project$Server$Route$RefreshAnonymousResponse = function (world) {
	return {H: world};
};
var author$project$Server$Route$refreshAnonymousDecoder = A2(
	elm$json$Json$Decode$map,
	author$project$Server$Route$RefreshAnonymousResponse,
	A2(elm$json$Json$Decode$field, 'world', author$project$Shared$World$anonymousDecoder));
var author$project$Server$Route$refreshAnonymousResponse = function (world) {
	return author$project$Server$Route$RefreshAnonymousResponse(
		author$project$Shared$World$serverToAnonymous(world));
};
var author$project$Server$Route$refreshAnonymousToUrl = A2(
	elm$url$Url$Builder$absolute,
	_List_fromArray(
		['refresh-anonymous']),
	_List_Nil);
var author$project$Server$Route$RefreshAnonymous = {$: 4};
var author$project$Server$Route$refreshAnonymousUrlParser = A2(
	elm$url$Url$Parser$map,
	author$project$Server$Route$RefreshAnonymous,
	elm$url$Url$Parser$s('refresh-anonymous'));
var author$project$Server$Route$refreshAnonymous = {v: author$project$Server$Route$refreshAnonymousDecoder, p: author$project$Server$Route$encodeRefreshAnonymous, D: author$project$Server$Route$refreshAnonymousResponse, i: author$project$Server$Route$refreshAnonymousToUrl, j: author$project$Server$Route$refreshAnonymousUrlParser};
var author$project$Server$Route$encodeSignup = function (_n0) {
	var world = _n0.H;
	var messageQueue = _n0.at;
	return elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'world',
				author$project$Shared$World$encode(world)),
				_Utils_Tuple2(
				'messageQueue',
				author$project$Shared$MessageQueue$encode(messageQueue))
			]));
};
var author$project$Server$Route$signupErrorToString = function (error) {
	switch (error.$) {
		case 0:
			return 'Name already exists';
		case 1:
			return 'Couldn\'t find newly created user';
		default:
			var authError = error.a;
			return author$project$Server$Route$authErrorToString(authError);
	}
};
var author$project$Server$Route$encodeSignupError = function (error) {
	return elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'error',
				elm$json$Json$Encode$string(
					author$project$Server$Route$signupErrorToString(error)))
			]));
};
var author$project$Server$Route$SignupResponse = F2(
	function (world, messageQueue) {
		return {at: messageQueue, H: world};
	});
var author$project$Server$Route$signupDecoder = A3(
	elm$json$Json$Decode$map2,
	author$project$Server$Route$SignupResponse,
	A2(elm$json$Json$Decode$field, 'world', author$project$Shared$World$decoder),
	A2(elm$json$Json$Decode$field, 'messageQueue', author$project$Shared$MessageQueue$decoder));
var author$project$Server$Route$AuthError = function (a) {
	return {$: 2, a: a};
};
var author$project$Server$Route$CouldntFindNewlyCreatedUser = {$: 1};
var author$project$Server$Route$NameAlreadyExists = {$: 0};
var author$project$Server$Route$signupErrorFromString = function (string) {
	switch (string) {
		case 'Name already exists':
			return elm$core$Maybe$Just(author$project$Server$Route$NameAlreadyExists);
		case 'Couldn\'t find newly created user':
			return elm$core$Maybe$Just(author$project$Server$Route$CouldntFindNewlyCreatedUser);
		default:
			return A2(
				elm$core$Maybe$map,
				author$project$Server$Route$AuthError,
				author$project$Server$Route$authErrorFromString(string));
	}
};
var author$project$Server$Route$signupErrorDecoder = A2(
	elm$json$Json$Decode$field,
	'error',
	A2(
		elm$json$Json$Decode$andThen,
		function (string) {
			var _n0 = author$project$Server$Route$signupErrorFromString(string);
			if (!_n0.$) {
				var error = _n0.a;
				return elm$json$Json$Decode$succeed(error);
			} else {
				return elm$json$Json$Decode$fail('Unknown SignupError');
			}
		},
		elm$json$Json$Decode$string));
var elm$core$Result$fromMaybe = F2(
	function (err, maybe) {
		if (!maybe.$) {
			var v = maybe.a;
			return elm$core$Result$Ok(v);
		} else {
			return elm$core$Result$Err(err);
		}
	});
var elm$core$Result$map = F2(
	function (func, ra) {
		if (!ra.$) {
			var a = ra.a;
			return elm$core$Result$Ok(
				func(a));
		} else {
			var e = ra.a;
			return elm$core$Result$Err(e);
		}
	});
var author$project$Server$Route$signupResponse = F3(
	function (messages, name, world) {
		return A2(
			elm$core$Result$map,
			function (clientWorld) {
				return A2(author$project$Server$Route$SignupResponse, clientWorld, messages);
			},
			A2(
				elm$core$Result$fromMaybe,
				author$project$Server$Route$CouldntFindNewlyCreatedUser,
				A2(author$project$Shared$World$serverToClient, name, world)));
	});
var author$project$Server$Route$signupToUrl = A2(
	elm$url$Url$Builder$absolute,
	_List_fromArray(
		['signup']),
	_List_Nil);
var author$project$Server$Route$Signup = {$: 1};
var author$project$Server$Route$signupUrlParser = A2(
	elm$url$Url$Parser$map,
	author$project$Server$Route$Signup,
	elm$url$Url$Parser$s('signup'));
var author$project$Server$Route$signup = {v: author$project$Server$Route$signupDecoder, p: author$project$Server$Route$encodeSignup, T: author$project$Server$Route$encodeSignupError, U: author$project$Server$Route$signupErrorDecoder, aJ: author$project$Server$Route$signupErrorToString, D: author$project$Server$Route$signupResponse, i: author$project$Server$Route$signupToUrl, j: author$project$Server$Route$signupUrlParser};
var author$project$Server$Route$handlers = {aB: author$project$Server$Route$attack, aR: author$project$Server$Route$incSpecialAttr, as: author$project$Server$Route$login, bz: author$project$Server$Route$logout, aY: author$project$Server$Route$notFound, a7: author$project$Server$Route$refresh, bH: author$project$Server$Route$refreshAnonymous, ax: author$project$Server$Route$signup};
var author$project$Server$Route$toString = function (route) {
	switch (route.$) {
		case 0:
			return author$project$Server$Route$handlers.aY.i;
		case 1:
			return author$project$Server$Route$handlers.ax.i;
		case 3:
			return author$project$Server$Route$handlers.a7.i;
		case 4:
			return author$project$Server$Route$handlers.bH.i;
		case 2:
			return author$project$Server$Route$handlers.as.i;
		case 5:
			var theirName = route.a;
			return author$project$Server$Route$handlers.aB.i(theirName);
		case 6:
			return author$project$Server$Route$handlers.bz.i;
		default:
			var attr = route.a;
			return author$project$Server$Route$handlers.aR.i(attr);
	}
};
var author$project$Shared$Password$unwrapHashed = function (_n0) {
	var p = _n0;
	return p;
};
var elm$core$Platform$Cmd$map = _Platform_map;
var elm$http$Http$Internal$EmptyBody = {$: 0};
var elm$http$Http$emptyBody = elm$http$Http$Internal$EmptyBody;
var elm$core$Dict$RBEmpty_elm_builtin = {$: -2};
var elm$core$Dict$empty = elm$core$Dict$RBEmpty_elm_builtin;
var elm$core$Basics$compare = _Utils_compare;
var elm$core$Dict$get = F2(
	function (targetKey, dict) {
		get:
		while (true) {
			if (dict.$ === -2) {
				return elm$core$Maybe$Nothing;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var _n1 = A2(elm$core$Basics$compare, targetKey, key);
				switch (_n1) {
					case 0:
						var $temp$targetKey = targetKey,
							$temp$dict = left;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
					case 1:
						return elm$core$Maybe$Just(value);
					default:
						var $temp$targetKey = targetKey,
							$temp$dict = right;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
				}
			}
		}
	});
var elm$core$Dict$Black = 1;
var elm$core$Dict$RBNode_elm_builtin = F5(
	function (a, b, c, d, e) {
		return {$: -1, a: a, b: b, c: c, d: d, e: e};
	});
var elm$core$Dict$Red = 0;
var elm$core$Dict$balance = F5(
	function (color, key, value, left, right) {
		if ((right.$ === -1) && (!right.a)) {
			var _n1 = right.a;
			var rK = right.b;
			var rV = right.c;
			var rLeft = right.d;
			var rRight = right.e;
			if ((left.$ === -1) && (!left.a)) {
				var _n3 = left.a;
				var lK = left.b;
				var lV = left.c;
				var lLeft = left.d;
				var lRight = left.e;
				return A5(
					elm$core$Dict$RBNode_elm_builtin,
					0,
					key,
					value,
					A5(elm$core$Dict$RBNode_elm_builtin, 1, lK, lV, lLeft, lRight),
					A5(elm$core$Dict$RBNode_elm_builtin, 1, rK, rV, rLeft, rRight));
			} else {
				return A5(
					elm$core$Dict$RBNode_elm_builtin,
					color,
					rK,
					rV,
					A5(elm$core$Dict$RBNode_elm_builtin, 0, key, value, left, rLeft),
					rRight);
			}
		} else {
			if ((((left.$ === -1) && (!left.a)) && (left.d.$ === -1)) && (!left.d.a)) {
				var _n5 = left.a;
				var lK = left.b;
				var lV = left.c;
				var _n6 = left.d;
				var _n7 = _n6.a;
				var llK = _n6.b;
				var llV = _n6.c;
				var llLeft = _n6.d;
				var llRight = _n6.e;
				var lRight = left.e;
				return A5(
					elm$core$Dict$RBNode_elm_builtin,
					0,
					lK,
					lV,
					A5(elm$core$Dict$RBNode_elm_builtin, 1, llK, llV, llLeft, llRight),
					A5(elm$core$Dict$RBNode_elm_builtin, 1, key, value, lRight, right));
			} else {
				return A5(elm$core$Dict$RBNode_elm_builtin, color, key, value, left, right);
			}
		}
	});
var elm$core$Dict$insertHelp = F3(
	function (key, value, dict) {
		if (dict.$ === -2) {
			return A5(elm$core$Dict$RBNode_elm_builtin, 0, key, value, elm$core$Dict$RBEmpty_elm_builtin, elm$core$Dict$RBEmpty_elm_builtin);
		} else {
			var nColor = dict.a;
			var nKey = dict.b;
			var nValue = dict.c;
			var nLeft = dict.d;
			var nRight = dict.e;
			var _n1 = A2(elm$core$Basics$compare, key, nKey);
			switch (_n1) {
				case 0:
					return A5(
						elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						A3(elm$core$Dict$insertHelp, key, value, nLeft),
						nRight);
				case 1:
					return A5(elm$core$Dict$RBNode_elm_builtin, nColor, nKey, value, nLeft, nRight);
				default:
					return A5(
						elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						nLeft,
						A3(elm$core$Dict$insertHelp, key, value, nRight));
			}
		}
	});
var elm$core$Dict$insert = F3(
	function (key, value, dict) {
		var _n0 = A3(elm$core$Dict$insertHelp, key, value, dict);
		if ((_n0.$ === -1) && (!_n0.a)) {
			var _n1 = _n0.a;
			var k = _n0.b;
			var v = _n0.c;
			var l = _n0.d;
			var r = _n0.e;
			return A5(elm$core$Dict$RBNode_elm_builtin, 1, k, v, l, r);
		} else {
			var x = _n0;
			return x;
		}
	});
var elm$core$Dict$getMin = function (dict) {
	getMin:
	while (true) {
		if ((dict.$ === -1) && (dict.d.$ === -1)) {
			var left = dict.d;
			var $temp$dict = left;
			dict = $temp$dict;
			continue getMin;
		} else {
			return dict;
		}
	}
};
var elm$core$Dict$moveRedLeft = function (dict) {
	if (((dict.$ === -1) && (dict.d.$ === -1)) && (dict.e.$ === -1)) {
		if ((dict.e.d.$ === -1) && (!dict.e.d.a)) {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _n1 = dict.d;
			var lClr = _n1.a;
			var lK = _n1.b;
			var lV = _n1.c;
			var lLeft = _n1.d;
			var lRight = _n1.e;
			var _n2 = dict.e;
			var rClr = _n2.a;
			var rK = _n2.b;
			var rV = _n2.c;
			var rLeft = _n2.d;
			var _n3 = rLeft.a;
			var rlK = rLeft.b;
			var rlV = rLeft.c;
			var rlL = rLeft.d;
			var rlR = rLeft.e;
			var rRight = _n2.e;
			return A5(
				elm$core$Dict$RBNode_elm_builtin,
				0,
				rlK,
				rlV,
				A5(
					elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5(elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					rlL),
				A5(elm$core$Dict$RBNode_elm_builtin, 1, rK, rV, rlR, rRight));
		} else {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _n4 = dict.d;
			var lClr = _n4.a;
			var lK = _n4.b;
			var lV = _n4.c;
			var lLeft = _n4.d;
			var lRight = _n4.e;
			var _n5 = dict.e;
			var rClr = _n5.a;
			var rK = _n5.b;
			var rV = _n5.c;
			var rLeft = _n5.d;
			var rRight = _n5.e;
			if (clr === 1) {
				return A5(
					elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5(elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5(elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			} else {
				return A5(
					elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5(elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5(elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			}
		}
	} else {
		return dict;
	}
};
var elm$core$Dict$moveRedRight = function (dict) {
	if (((dict.$ === -1) && (dict.d.$ === -1)) && (dict.e.$ === -1)) {
		if ((dict.d.d.$ === -1) && (!dict.d.d.a)) {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _n1 = dict.d;
			var lClr = _n1.a;
			var lK = _n1.b;
			var lV = _n1.c;
			var _n2 = _n1.d;
			var _n3 = _n2.a;
			var llK = _n2.b;
			var llV = _n2.c;
			var llLeft = _n2.d;
			var llRight = _n2.e;
			var lRight = _n1.e;
			var _n4 = dict.e;
			var rClr = _n4.a;
			var rK = _n4.b;
			var rV = _n4.c;
			var rLeft = _n4.d;
			var rRight = _n4.e;
			return A5(
				elm$core$Dict$RBNode_elm_builtin,
				0,
				lK,
				lV,
				A5(elm$core$Dict$RBNode_elm_builtin, 1, llK, llV, llLeft, llRight),
				A5(
					elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					lRight,
					A5(elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight)));
		} else {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _n5 = dict.d;
			var lClr = _n5.a;
			var lK = _n5.b;
			var lV = _n5.c;
			var lLeft = _n5.d;
			var lRight = _n5.e;
			var _n6 = dict.e;
			var rClr = _n6.a;
			var rK = _n6.b;
			var rV = _n6.c;
			var rLeft = _n6.d;
			var rRight = _n6.e;
			if (clr === 1) {
				return A5(
					elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5(elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5(elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			} else {
				return A5(
					elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5(elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5(elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			}
		}
	} else {
		return dict;
	}
};
var elm$core$Dict$removeHelpPrepEQGT = F7(
	function (targetKey, dict, color, key, value, left, right) {
		if ((left.$ === -1) && (!left.a)) {
			var _n1 = left.a;
			var lK = left.b;
			var lV = left.c;
			var lLeft = left.d;
			var lRight = left.e;
			return A5(
				elm$core$Dict$RBNode_elm_builtin,
				color,
				lK,
				lV,
				lLeft,
				A5(elm$core$Dict$RBNode_elm_builtin, 0, key, value, lRight, right));
		} else {
			_n2$2:
			while (true) {
				if ((right.$ === -1) && (right.a === 1)) {
					if (right.d.$ === -1) {
						if (right.d.a === 1) {
							var _n3 = right.a;
							var _n4 = right.d;
							var _n5 = _n4.a;
							return elm$core$Dict$moveRedRight(dict);
						} else {
							break _n2$2;
						}
					} else {
						var _n6 = right.a;
						var _n7 = right.d;
						return elm$core$Dict$moveRedRight(dict);
					}
				} else {
					break _n2$2;
				}
			}
			return dict;
		}
	});
var elm$core$Dict$removeMin = function (dict) {
	if ((dict.$ === -1) && (dict.d.$ === -1)) {
		var color = dict.a;
		var key = dict.b;
		var value = dict.c;
		var left = dict.d;
		var lColor = left.a;
		var lLeft = left.d;
		var right = dict.e;
		if (lColor === 1) {
			if ((lLeft.$ === -1) && (!lLeft.a)) {
				var _n3 = lLeft.a;
				return A5(
					elm$core$Dict$RBNode_elm_builtin,
					color,
					key,
					value,
					elm$core$Dict$removeMin(left),
					right);
			} else {
				var _n4 = elm$core$Dict$moveRedLeft(dict);
				if (_n4.$ === -1) {
					var nColor = _n4.a;
					var nKey = _n4.b;
					var nValue = _n4.c;
					var nLeft = _n4.d;
					var nRight = _n4.e;
					return A5(
						elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						elm$core$Dict$removeMin(nLeft),
						nRight);
				} else {
					return elm$core$Dict$RBEmpty_elm_builtin;
				}
			}
		} else {
			return A5(
				elm$core$Dict$RBNode_elm_builtin,
				color,
				key,
				value,
				elm$core$Dict$removeMin(left),
				right);
		}
	} else {
		return elm$core$Dict$RBEmpty_elm_builtin;
	}
};
var elm$core$Dict$removeHelp = F2(
	function (targetKey, dict) {
		if (dict.$ === -2) {
			return elm$core$Dict$RBEmpty_elm_builtin;
		} else {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			if (_Utils_cmp(targetKey, key) < 0) {
				if ((left.$ === -1) && (left.a === 1)) {
					var _n4 = left.a;
					var lLeft = left.d;
					if ((lLeft.$ === -1) && (!lLeft.a)) {
						var _n6 = lLeft.a;
						return A5(
							elm$core$Dict$RBNode_elm_builtin,
							color,
							key,
							value,
							A2(elm$core$Dict$removeHelp, targetKey, left),
							right);
					} else {
						var _n7 = elm$core$Dict$moveRedLeft(dict);
						if (_n7.$ === -1) {
							var nColor = _n7.a;
							var nKey = _n7.b;
							var nValue = _n7.c;
							var nLeft = _n7.d;
							var nRight = _n7.e;
							return A5(
								elm$core$Dict$balance,
								nColor,
								nKey,
								nValue,
								A2(elm$core$Dict$removeHelp, targetKey, nLeft),
								nRight);
						} else {
							return elm$core$Dict$RBEmpty_elm_builtin;
						}
					}
				} else {
					return A5(
						elm$core$Dict$RBNode_elm_builtin,
						color,
						key,
						value,
						A2(elm$core$Dict$removeHelp, targetKey, left),
						right);
				}
			} else {
				return A2(
					elm$core$Dict$removeHelpEQGT,
					targetKey,
					A7(elm$core$Dict$removeHelpPrepEQGT, targetKey, dict, color, key, value, left, right));
			}
		}
	});
var elm$core$Dict$removeHelpEQGT = F2(
	function (targetKey, dict) {
		if (dict.$ === -1) {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			if (_Utils_eq(targetKey, key)) {
				var _n1 = elm$core$Dict$getMin(right);
				if (_n1.$ === -1) {
					var minKey = _n1.b;
					var minValue = _n1.c;
					return A5(
						elm$core$Dict$balance,
						color,
						minKey,
						minValue,
						left,
						elm$core$Dict$removeMin(right));
				} else {
					return elm$core$Dict$RBEmpty_elm_builtin;
				}
			} else {
				return A5(
					elm$core$Dict$balance,
					color,
					key,
					value,
					left,
					A2(elm$core$Dict$removeHelp, targetKey, right));
			}
		} else {
			return elm$core$Dict$RBEmpty_elm_builtin;
		}
	});
var elm$core$Dict$remove = F2(
	function (key, dict) {
		var _n0 = A2(elm$core$Dict$removeHelp, key, dict);
		if ((_n0.$ === -1) && (!_n0.a)) {
			var _n1 = _n0.a;
			var k = _n0.b;
			var v = _n0.c;
			var l = _n0.d;
			var r = _n0.e;
			return A5(elm$core$Dict$RBNode_elm_builtin, 1, k, v, l, r);
		} else {
			var x = _n0;
			return x;
		}
	});
var elm$core$Dict$update = F3(
	function (targetKey, alter, dictionary) {
		var _n0 = alter(
			A2(elm$core$Dict$get, targetKey, dictionary));
		if (!_n0.$) {
			var value = _n0.a;
			return A3(elm$core$Dict$insert, targetKey, value, dictionary);
		} else {
			return A2(elm$core$Dict$remove, targetKey, dictionary);
		}
	});
var elm$core$Maybe$isJust = function (maybe) {
	if (!maybe.$) {
		return true;
	} else {
		return false;
	}
};
var elm$http$Http$BadPayload = F2(
	function (a, b) {
		return {$: 4, a: a, b: b};
	});
var elm$http$Http$BadStatus = function (a) {
	return {$: 3, a: a};
};
var elm$http$Http$BadUrl = function (a) {
	return {$: 0, a: a};
};
var elm$http$Http$NetworkError = {$: 2};
var elm$http$Http$Timeout = {$: 1};
var elm$http$Http$Internal$FormDataBody = function (a) {
	return {$: 2, a: a};
};
var elm$http$Http$Internal$isStringBody = function (body) {
	if (body.$ === 1) {
		return true;
	} else {
		return false;
	}
};
var elm$http$Http$expectStringResponse = _Http_expectStringResponse;
var elm$json$Json$Decode$decodeString = _Json_runOnString;
var elm$http$Http$expectJson = function (decoder) {
	return elm$http$Http$expectStringResponse(
		function (response) {
			var _n0 = A2(elm$json$Json$Decode$decodeString, decoder, response.aE);
			if (_n0.$ === 1) {
				var decodeError = _n0.a;
				return elm$core$Result$Err(
					elm$json$Json$Decode$errorToString(decodeError));
			} else {
				var value = _n0.a;
				return elm$core$Result$Ok(value);
			}
		});
};
var elm$http$Http$Internal$Header = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var elm$http$Http$header = elm$http$Http$Internal$Header;
var elm$http$Http$Internal$Request = elm$core$Basics$identity;
var elm$http$Http$request = elm$core$Basics$identity;
var elm$core$Basics$composeL = F3(
	function (g, f, x) {
		return g(
			f(x));
	});
var elm$core$Task$Perform = elm$core$Basics$identity;
var elm$core$Task$andThen = _Scheduler_andThen;
var elm$core$Task$succeed = _Scheduler_succeed;
var elm$core$Task$init = elm$core$Task$succeed(0);
var elm$core$Task$map = F2(
	function (func, taskA) {
		return A2(
			elm$core$Task$andThen,
			function (a) {
				return elm$core$Task$succeed(
					func(a));
			},
			taskA);
	});
var elm$core$Task$map2 = F3(
	function (func, taskA, taskB) {
		return A2(
			elm$core$Task$andThen,
			function (a) {
				return A2(
					elm$core$Task$andThen,
					function (b) {
						return elm$core$Task$succeed(
							A2(func, a, b));
					},
					taskB);
			},
			taskA);
	});
var elm$core$Task$sequence = function (tasks) {
	return A3(
		elm$core$List$foldr,
		elm$core$Task$map2(elm$core$List$cons),
		elm$core$Task$succeed(_List_Nil),
		tasks);
};
var elm$core$Platform$sendToApp = _Platform_sendToApp;
var elm$core$Task$spawnCmd = F2(
	function (router, _n0) {
		var task = _n0;
		return _Scheduler_spawn(
			A2(
				elm$core$Task$andThen,
				elm$core$Platform$sendToApp(router),
				task));
	});
var elm$core$Task$onEffects = F3(
	function (router, commands, state) {
		return A2(
			elm$core$Task$map,
			function (_n0) {
				return 0;
			},
			elm$core$Task$sequence(
				A2(
					elm$core$List$map,
					elm$core$Task$spawnCmd(router),
					commands)));
	});
var elm$core$Task$onSelfMsg = F3(
	function (_n0, _n1, _n2) {
		return elm$core$Task$succeed(0);
	});
var elm$core$Task$cmdMap = F2(
	function (tagger, _n0) {
		var task = _n0;
		return A2(elm$core$Task$map, tagger, task);
	});
_Platform_effectManagers['Task'] = _Platform_createManager(elm$core$Task$init, elm$core$Task$onEffects, elm$core$Task$onSelfMsg, elm$core$Task$cmdMap);
var elm$core$Task$command = _Platform_leaf('Task');
var elm$core$Task$onError = _Scheduler_onError;
var elm$core$Task$attempt = F2(
	function (resultToMessage, task) {
		return elm$core$Task$command(
			A2(
				elm$core$Task$onError,
				A2(
					elm$core$Basics$composeL,
					A2(elm$core$Basics$composeL, elm$core$Task$succeed, resultToMessage),
					elm$core$Result$Err),
				A2(
					elm$core$Task$andThen,
					A2(
						elm$core$Basics$composeL,
						A2(elm$core$Basics$composeL, elm$core$Task$succeed, resultToMessage),
						elm$core$Result$Ok),
					task)));
	});
var elm$http$Http$toTask = function (_n0) {
	var request_ = _n0;
	return A2(_Http_toTask, request_, elm$core$Maybe$Nothing);
};
var elm$http$Http$send = F2(
	function (resultToMessage, request_) {
		return A2(
			elm$core$Task$attempt,
			resultToMessage,
			elm$http$Http$toTask(request_));
	});
var krisajenkins$remotedata$RemoteData$Failure = function (a) {
	return {$: 2, a: a};
};
var krisajenkins$remotedata$RemoteData$Success = function (a) {
	return {$: 3, a: a};
};
var krisajenkins$remotedata$RemoteData$fromResult = function (result) {
	if (result.$ === 1) {
		var e = result.a;
		return krisajenkins$remotedata$RemoteData$Failure(e);
	} else {
		var x = result.a;
		return krisajenkins$remotedata$RemoteData$Success(x);
	}
};
var krisajenkins$remotedata$RemoteData$sendRequest = elm$http$Http$send(krisajenkins$remotedata$RemoteData$fromResult);
var author$project$Client$Main$sendRequest = F3(
	function (serverEndpoint, route, maybeAuth) {
		var authHeaders = A2(
			elm$core$Maybe$withDefault,
			_List_Nil,
			A2(
				elm$core$Maybe$map,
				function (_n2) {
					var name = _n2.ai;
					var password = _n2.ak;
					return _List_fromArray(
						[
							A2(elm$http$Http$header, 'x-username', name),
							A2(
							elm$http$Http$header,
							'x-hashed-password',
							author$project$Shared$Password$unwrapHashed(password))
						]);
				},
				maybeAuth));
		var send = F2(
			function (tagger, decoder) {
				return A2(
					elm$core$Platform$Cmd$map,
					tagger,
					krisajenkins$remotedata$RemoteData$sendRequest(
						elm$http$Http$request(
							{
								aE: elm$http$Http$emptyBody,
								bq: elm$http$Http$expectJson(decoder),
								bu: authHeaders,
								bB: 'GET',
								bQ: elm$core$Maybe$Nothing,
								bT: _Utils_ap(
									serverEndpoint,
									author$project$Server$Route$toString(route)),
								bV: false
							})));
			});
		switch (route.$) {
			case 0:
				return A2(
					send,
					function (_n1) {
						return author$project$Client$Main$NoOp;
					},
					elm$json$Json$Decode$fail('Server route not found'));
			case 1:
				return A2(
					send,
					author$project$Client$Main$GetSignupResponse,
					A2(author$project$Client$Main$successOrErrorDecoder, author$project$Server$Route$handlers.ax.v, author$project$Server$Route$handlers.ax.U));
			case 2:
				return A2(
					send,
					author$project$Client$Main$GetLoginResponse,
					A2(author$project$Client$Main$successOrErrorDecoder, author$project$Server$Route$handlers.as.v, author$project$Server$Route$handlers.as.U));
			case 3:
				return A2(
					send,
					author$project$Client$Main$GetRefreshResponse,
					A2(author$project$Client$Main$successOrErrorDecoder, author$project$Server$Route$handlers.a7.v, author$project$Server$Route$handlers.a7.U));
			case 5:
				return A2(
					send,
					author$project$Client$Main$GetAttackResponse,
					A2(author$project$Client$Main$successOrErrorDecoder, author$project$Server$Route$handlers.aB.v, author$project$Server$Route$handlers.aB.U));
			case 6:
				return A2(send, author$project$Client$Main$GetLogoutResponse, author$project$Server$Route$handlers.bz.v);
			case 4:
				return A2(send, author$project$Client$Main$GetRefreshAnonymousResponse, author$project$Server$Route$handlers.bH.v);
			default:
				return A2(
					send,
					author$project$Client$Main$GetIncSpecialAttrResponse,
					A2(author$project$Client$Main$successOrErrorDecoder, author$project$Server$Route$handlers.aR.v, author$project$Server$Route$handlers.aR.U));
		}
	});
var author$project$Client$User$Anonymous = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var author$project$Shared$Password$Password = elm$core$Basics$identity;
var author$project$Shared$Password$password = function (p) {
	return p;
};
var author$project$Client$User$emptyForm = {
	ai: '',
	ak: author$project$Shared$Password$password('')
};
var krisajenkins$remotedata$RemoteData$NotAsked = {$: 0};
var author$project$Client$User$init = A2(author$project$Client$User$Anonymous, krisajenkins$remotedata$RemoteData$NotAsked, author$project$Client$User$emptyForm);
var author$project$Client$Main$init = F3(
	function (_n0, url, key) {
		var serverEndpoint = _n0.M;
		return _Utils_Tuple2(
			{aX: key, M: serverEndpoint, F: author$project$Client$User$init},
			A3(author$project$Client$Main$sendRequest, serverEndpoint, author$project$Server$Route$RefreshAnonymous, elm$core$Maybe$Nothing));
	});
var elm$core$Platform$Sub$batch = _Platform_batch;
var elm$core$Platform$Sub$none = elm$core$Platform$Sub$batch(_List_Nil);
var author$project$Client$Main$subscriptions = function (model) {
	return elm$core$Platform$Sub$none;
};
var author$project$Client$Main$updateUser = F2(
	function (fn, model) {
		return _Utils_update(
			model,
			{
				F: fn(model.F)
			});
	});
var author$project$Client$User$LoggedIn = function (a) {
	return {$: 6, a: a};
};
var author$project$Client$User$LoggingIn = F2(
	function (a, b) {
		return {$: 4, a: a, b: b};
	});
var author$project$Client$User$LoggingInError = F3(
	function (a, b, c) {
		return {$: 5, a: a, b: b, c: c};
	});
var author$project$Client$User$SigningUp = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var author$project$Client$User$SigningUpError = F3(
	function (a, b, c) {
		return {$: 2, a: a, b: b, c: c};
	});
var author$project$Client$User$UnknownError = F3(
	function (a, b, c) {
		return {$: 3, a: a, b: b, c: c};
	});
var author$project$Client$User$map = F3(
	function (fnLoggedOff, fnLoggedIn, user) {
		var uncurry = F2(
			function (f, _n1) {
				var a = _n1.a;
				var b = _n1.b;
				return A2(f, a, b);
			});
		switch (user.$) {
			case 0:
				var world = user.a;
				var form = user.b;
				return A2(
					uncurry,
					author$project$Client$User$Anonymous,
					fnLoggedOff(
						_Utils_Tuple2(world, form)));
			case 1:
				var world = user.a;
				var form = user.b;
				return A2(
					uncurry,
					author$project$Client$User$SigningUp,
					fnLoggedOff(
						_Utils_Tuple2(world, form)));
			case 2:
				var error = user.a;
				var world = user.b;
				var form = user.c;
				return A2(
					uncurry,
					author$project$Client$User$SigningUpError(error),
					fnLoggedOff(
						_Utils_Tuple2(world, form)));
			case 3:
				var error = user.a;
				var world = user.b;
				var form = user.c;
				return A2(
					uncurry,
					author$project$Client$User$UnknownError(error),
					fnLoggedOff(
						_Utils_Tuple2(world, form)));
			case 4:
				var world = user.a;
				var form = user.b;
				return A2(
					uncurry,
					author$project$Client$User$LoggingIn,
					fnLoggedOff(
						_Utils_Tuple2(world, form)));
			case 5:
				var error = user.a;
				var world = user.b;
				var form = user.c;
				return A2(
					uncurry,
					author$project$Client$User$LoggingInError(error),
					fnLoggedOff(
						_Utils_Tuple2(world, form)));
			default:
				var loggedInUser = user.a;
				return author$project$Client$User$LoggedIn(
					fnLoggedIn(loggedInUser));
		}
	});
var author$project$Client$User$mapLoggedInUser = F2(
	function (fn, user) {
		return A3(author$project$Client$User$map, elm$core$Basics$identity, fn, user);
	});
var author$project$Client$Main$addMessages = F2(
	function (messages, model) {
		return A2(
			author$project$Client$Main$updateUser,
			author$project$Client$User$mapLoggedInUser(
				function (user) {
					return _Utils_update(
						user,
						{
							Y: _Utils_ap(user.Y, messages)
						});
				}),
			model);
	});
var author$project$Client$Main$addMessage = F2(
	function (message, model) {
		return A2(
			author$project$Client$Main$addMessages,
			_List_fromArray(
				[message]),
			model);
	});
var elm$core$String$concat = function (strings) {
	return A2(elm$core$String$join, '', strings);
};
var elm$core$String$cons = _String_cons;
var elm$core$String$fromChar = function (_char) {
	return A2(elm$core$String$cons, _char, '');
};
var elm$core$String$length = _String_length;
var elm$core$Bitwise$and = _Bitwise_and;
var elm$core$Bitwise$shiftRightBy = _Bitwise_shiftRightBy;
var elm$core$String$repeatHelp = F3(
	function (n, chunk, result) {
		return (n <= 0) ? result : A3(
			elm$core$String$repeatHelp,
			n >> 1,
			_Utils_ap(chunk, chunk),
			(!(n & 1)) ? result : _Utils_ap(result, chunk));
	});
var elm$core$String$repeat = F2(
	function (n, chunk) {
		return A3(elm$core$String$repeatHelp, n, chunk, '');
	});
var elm$core$String$padLeft = F3(
	function (n, _char, string) {
		return _Utils_ap(
			A2(
				elm$core$String$repeat,
				n - elm$core$String$length(string),
				elm$core$String$fromChar(_char)),
			string);
	});
var elm$core$Basics$negate = function (n) {
	return -n;
};
var elm$core$String$fromList = _String_fromList;
var elm$core$Basics$modBy = _Basics_modBy;
var rtfeldman$elm_hex$Hex$unsafeToDigit = function (num) {
	unsafeToDigit:
	while (true) {
		switch (num) {
			case 0:
				return '0';
			case 1:
				return '1';
			case 2:
				return '2';
			case 3:
				return '3';
			case 4:
				return '4';
			case 5:
				return '5';
			case 6:
				return '6';
			case 7:
				return '7';
			case 8:
				return '8';
			case 9:
				return '9';
			case 10:
				return 'a';
			case 11:
				return 'b';
			case 12:
				return 'c';
			case 13:
				return 'd';
			case 14:
				return 'e';
			case 15:
				return 'f';
			default:
				var $temp$num = num;
				num = $temp$num;
				continue unsafeToDigit;
		}
	}
};
var rtfeldman$elm_hex$Hex$unsafePositiveToDigits = F2(
	function (digits, num) {
		unsafePositiveToDigits:
		while (true) {
			if (num < 16) {
				return A2(
					elm$core$List$cons,
					rtfeldman$elm_hex$Hex$unsafeToDigit(num),
					digits);
			} else {
				var $temp$digits = A2(
					elm$core$List$cons,
					rtfeldman$elm_hex$Hex$unsafeToDigit(
						A2(elm$core$Basics$modBy, 16, num)),
					digits),
					$temp$num = (num / 16) | 0;
				digits = $temp$digits;
				num = $temp$num;
				continue unsafePositiveToDigits;
			}
		}
	});
var rtfeldman$elm_hex$Hex$toString = function (num) {
	return elm$core$String$fromList(
		(num < 0) ? A2(
			elm$core$List$cons,
			'-',
			A2(rtfeldman$elm_hex$Hex$unsafePositiveToDigits, _List_Nil, -num)) : A2(rtfeldman$elm_hex$Hex$unsafePositiveToDigits, _List_Nil, num));
};
var author$project$Shared$Password$listToHex = function (list) {
	return elm$core$String$concat(
		A2(
			elm$core$List$map,
			A2(
				elm$core$Basics$composeR,
				rtfeldman$elm_hex$Hex$toString,
				A2(elm$core$String$padLeft, 2, '0')),
			list));
};
var author$project$Shared$Password$toByteRange = function (n) {
	var helper = F2(
		function (m, list) {
			helper:
			while (true) {
				if (m < 256) {
					return A2(elm$core$List$cons, m, list);
				} else {
					var rest = m >> 8;
					var lsb = 255 & m;
					var $temp$m = rest,
						$temp$list = A2(elm$core$List$cons, lsb, list);
					m = $temp$m;
					list = $temp$list;
					continue helper;
				}
			}
		});
	return A2(helper, n, _List_Nil);
};
var elm$core$String$foldr = _String_foldr;
var elm$core$String$toList = function (string) {
	return A3(elm$core$String$foldr, elm$core$List$cons, _List_Nil, string);
};
var author$project$Shared$Password$stringToList = function (string) {
	return A2(
		elm$core$List$concatMap,
		author$project$Shared$Password$toByteRange,
		A2(
			elm$core$List$map,
			elm$core$Char$toCode,
			elm$core$String$toList(string)));
};
var elm$core$Basics$always = F2(
	function (a, _n0) {
		return a;
	});
var elm$core$Basics$min = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) < 0) ? x : y;
	});
var elm$core$Basics$neq = _Utils_notEqual;
var elm$core$List$takeReverse = F3(
	function (n, list, kept) {
		takeReverse:
		while (true) {
			if (n <= 0) {
				return kept;
			} else {
				if (!list.b) {
					return kept;
				} else {
					var x = list.a;
					var xs = list.b;
					var $temp$n = n - 1,
						$temp$list = xs,
						$temp$kept = A2(elm$core$List$cons, x, kept);
					n = $temp$n;
					list = $temp$list;
					kept = $temp$kept;
					continue takeReverse;
				}
			}
		}
	});
var elm$core$List$takeTailRec = F2(
	function (n, list) {
		return elm$core$List$reverse(
			A3(elm$core$List$takeReverse, n, list, _List_Nil));
	});
var elm$core$List$takeFast = F3(
	function (ctr, n, list) {
		if (n <= 0) {
			return _List_Nil;
		} else {
			var _n0 = _Utils_Tuple2(n, list);
			_n0$1:
			while (true) {
				_n0$5:
				while (true) {
					if (!_n0.b.b) {
						return list;
					} else {
						if (_n0.b.b.b) {
							switch (_n0.a) {
								case 1:
									break _n0$1;
								case 2:
									var _n2 = _n0.b;
									var x = _n2.a;
									var _n3 = _n2.b;
									var y = _n3.a;
									return _List_fromArray(
										[x, y]);
								case 3:
									if (_n0.b.b.b.b) {
										var _n4 = _n0.b;
										var x = _n4.a;
										var _n5 = _n4.b;
										var y = _n5.a;
										var _n6 = _n5.b;
										var z = _n6.a;
										return _List_fromArray(
											[x, y, z]);
									} else {
										break _n0$5;
									}
								default:
									if (_n0.b.b.b.b && _n0.b.b.b.b.b) {
										var _n7 = _n0.b;
										var x = _n7.a;
										var _n8 = _n7.b;
										var y = _n8.a;
										var _n9 = _n8.b;
										var z = _n9.a;
										var _n10 = _n9.b;
										var w = _n10.a;
										var tl = _n10.b;
										return (ctr > 1000) ? A2(
											elm$core$List$cons,
											x,
											A2(
												elm$core$List$cons,
												y,
												A2(
													elm$core$List$cons,
													z,
													A2(
														elm$core$List$cons,
														w,
														A2(elm$core$List$takeTailRec, n - 4, tl))))) : A2(
											elm$core$List$cons,
											x,
											A2(
												elm$core$List$cons,
												y,
												A2(
													elm$core$List$cons,
													z,
													A2(
														elm$core$List$cons,
														w,
														A3(elm$core$List$takeFast, ctr + 1, n - 4, tl)))));
									} else {
										break _n0$5;
									}
							}
						} else {
							if (_n0.a === 1) {
								break _n0$1;
							} else {
								break _n0$5;
							}
						}
					}
				}
				return list;
			}
			var _n1 = _n0.b;
			var x = _n1.a;
			return _List_fromArray(
				[x]);
		}
	});
var elm$core$List$take = F2(
	function (n, list) {
		return A3(elm$core$List$takeFast, 0, n, list);
	});
var elm$core$List$drop = F2(
	function (n, list) {
		drop:
		while (true) {
			if (n <= 0) {
				return list;
			} else {
				if (!list.b) {
					return list;
				} else {
					var x = list.a;
					var xs = list.b;
					var $temp$n = n - 1,
						$temp$list = xs;
					n = $temp$n;
					list = $temp$list;
					continue drop;
				}
			}
		}
	});
var elm_community$list_extra$List$Extra$greedyGroupsOfWithStep = F3(
	function (size, step, xs) {
		var xs_ = A2(elm$core$List$drop, step, xs);
		var okayXs = elm$core$List$length(xs) > 0;
		var okayArgs = (size > 0) && (step > 0);
		return (okayArgs && okayXs) ? A2(
			elm$core$List$cons,
			A2(elm$core$List$take, size, xs),
			A3(elm_community$list_extra$List$Extra$greedyGroupsOfWithStep, size, step, xs_)) : _List_Nil;
	});
var elm_community$list_extra$List$Extra$greedyGroupsOf = F2(
	function (size, xs) {
		return A3(elm_community$list_extra$List$Extra$greedyGroupsOfWithStep, size, size, xs);
	});
var prozacchiwawa$elm_keccak$Keccak$tupleMap2 = F3(
	function (f, _n0, _n1) {
		var a1 = _n0.a;
		var b1 = _n0.b;
		var a2 = _n1.a;
		var b2 = _n1.b;
		return _Utils_Tuple2(
			A2(f, a1, a2),
			A2(f, b1, b2));
	});
var prozacchiwawa$elm_keccak$Keccak$and64 = F2(
	function (a, b) {
		return A3(prozacchiwawa$elm_keccak$Keccak$tupleMap2, elm$core$Bitwise$and, a, b);
	});
var prozacchiwawa$elm_keccak$Keccak$five = A2(elm$core$List$range, 0, 4);
var prozacchiwawa$elm_keccak$Keccak$gd = F2(
	function (n, _n0) {
		var d0 = _n0.an;
		var d1 = _n0.ao;
		var d2 = _n0.ap;
		var d3 = _n0.aq;
		var d4 = _n0.ar;
		switch (n) {
			case 0:
				return d0;
			case 1:
				return d1;
			case 2:
				return d2;
			case 3:
				return d3;
			default:
				return d4;
		}
	});
var elm$core$Bitwise$complement = _Bitwise_complement;
var prozacchiwawa$elm_keccak$Keccak$elementMask = 4294967295;
var prozacchiwawa$elm_keccak$Keccak$tupleMap = F2(
	function (f, _n0) {
		var a = _n0.a;
		var b = _n0.b;
		return _Utils_Tuple2(
			f(a),
			f(b));
	});
var prozacchiwawa$elm_keccak$Keccak$inv64 = function (a) {
	return A2(
		prozacchiwawa$elm_keccak$Keccak$tupleMap,
		A2(
			elm$core$Basics$composeR,
			elm$core$Bitwise$complement,
			elm$core$Bitwise$and(prozacchiwawa$elm_keccak$Keccak$elementMask)),
		a);
};
var prozacchiwawa$elm_keccak$Keccak$iPerm = F2(
	function (x, y) {
		return (5 * y) + x;
	});
var elm$core$Bitwise$shiftRightZfBy = _Bitwise_shiftRightZfBy;
var elm$core$Array$bitMask = 4294967295 >>> (32 - elm$core$Array$shiftStep);
var elm$core$Elm$JsArray$unsafeGet = _JsArray_unsafeGet;
var elm$core$Array$getHelp = F3(
	function (shift, index, tree) {
		getHelp:
		while (true) {
			var pos = elm$core$Array$bitMask & (index >>> shift);
			var _n0 = A2(elm$core$Elm$JsArray$unsafeGet, pos, tree);
			if (!_n0.$) {
				var subTree = _n0.a;
				var $temp$shift = shift - elm$core$Array$shiftStep,
					$temp$index = index,
					$temp$tree = subTree;
				shift = $temp$shift;
				index = $temp$index;
				tree = $temp$tree;
				continue getHelp;
			} else {
				var values = _n0.a;
				return A2(elm$core$Elm$JsArray$unsafeGet, elm$core$Array$bitMask & index, values);
			}
		}
	});
var elm$core$Bitwise$shiftLeftBy = _Bitwise_shiftLeftBy;
var elm$core$Array$tailIndex = function (len) {
	return (len >>> 5) << 5;
};
var elm$core$Basics$ge = _Utils_ge;
var elm$core$Array$get = F2(
	function (index, _n0) {
		var len = _n0.a;
		var startShift = _n0.b;
		var tree = _n0.c;
		var tail = _n0.d;
		return ((index < 0) || (_Utils_cmp(index, len) > -1)) ? elm$core$Maybe$Nothing : ((_Utils_cmp(
			index,
			elm$core$Array$tailIndex(len)) > -1) ? elm$core$Maybe$Just(
			A2(elm$core$Elm$JsArray$unsafeGet, elm$core$Array$bitMask & index, tail)) : elm$core$Maybe$Just(
			A3(elm$core$Array$getHelp, startShift, index, tree)));
	});
var prozacchiwawa$elm_keccak$Keccak$load64 = F2(
	function (off, arr) {
		var _n0 = A2(elm$core$Array$get, off, arr);
		if (!_n0.$) {
			var a = _n0.a;
			return a;
		} else {
			return _Utils_Tuple2(0, 0);
		}
	});
var prozacchiwawa$elm_keccak$Keccak$readLane = F3(
	function (x, y, state) {
		var off = A2(prozacchiwawa$elm_keccak$Keccak$iPerm, x, y);
		return A2(prozacchiwawa$elm_keccak$Keccak$load64, off, state);
	});
var elm$core$Elm$JsArray$unsafeSet = _JsArray_unsafeSet;
var elm$core$Array$setHelp = F4(
	function (shift, index, value, tree) {
		var pos = elm$core$Array$bitMask & (index >>> shift);
		var _n0 = A2(elm$core$Elm$JsArray$unsafeGet, pos, tree);
		if (!_n0.$) {
			var subTree = _n0.a;
			var newSub = A4(elm$core$Array$setHelp, shift - elm$core$Array$shiftStep, index, value, subTree);
			return A3(
				elm$core$Elm$JsArray$unsafeSet,
				pos,
				elm$core$Array$SubTree(newSub),
				tree);
		} else {
			var values = _n0.a;
			var newLeaf = A3(elm$core$Elm$JsArray$unsafeSet, elm$core$Array$bitMask & index, value, values);
			return A3(
				elm$core$Elm$JsArray$unsafeSet,
				pos,
				elm$core$Array$Leaf(newLeaf),
				tree);
		}
	});
var elm$core$Array$set = F3(
	function (index, value, array) {
		var len = array.a;
		var startShift = array.b;
		var tree = array.c;
		var tail = array.d;
		return ((index < 0) || (_Utils_cmp(index, len) > -1)) ? array : ((_Utils_cmp(
			index,
			elm$core$Array$tailIndex(len)) > -1) ? A4(
			elm$core$Array$Array_elm_builtin,
			len,
			startShift,
			tree,
			A3(elm$core$Elm$JsArray$unsafeSet, elm$core$Array$bitMask & index, value, tail)) : A4(
			elm$core$Array$Array_elm_builtin,
			len,
			startShift,
			A4(elm$core$Array$setHelp, startShift, index, value, tree),
			tail));
	});
var prozacchiwawa$elm_keccak$Keccak$store64 = F3(
	function (off, v, arr) {
		return A3(elm$core$Array$set, off, v, arr);
	});
var prozacchiwawa$elm_keccak$Keccak$writeLane = F4(
	function (x, y, lane, state) {
		var off = A2(prozacchiwawa$elm_keccak$Keccak$iPerm, x, y);
		return A3(prozacchiwawa$elm_keccak$Keccak$store64, off, lane, state);
	});
var elm$core$Bitwise$xor = _Bitwise_xor;
var prozacchiwawa$elm_keccak$Keccak$xor64 = F2(
	function (v, arr) {
		return A3(prozacchiwawa$elm_keccak$Keccak$tupleMap2, elm$core$Bitwise$xor, v, arr);
	});
var prozacchiwawa$elm_keccak$Keccak$chi = function (ss) {
	var newState = A3(
		elm$core$List$foldr,
		F2(
			function (y, state) {
				var temp = {
					an: A3(prozacchiwawa$elm_keccak$Keccak$readLane, 0, y, ss.f),
					ao: A3(prozacchiwawa$elm_keccak$Keccak$readLane, 1, y, ss.f),
					ap: A3(prozacchiwawa$elm_keccak$Keccak$readLane, 2, y, ss.f),
					aq: A3(prozacchiwawa$elm_keccak$Keccak$readLane, 3, y, ss.f),
					ar: A3(prozacchiwawa$elm_keccak$Keccak$readLane, 4, y, ss.f)
				};
				var yupdate = F2(
					function (x, state_) {
						return A4(
							prozacchiwawa$elm_keccak$Keccak$writeLane,
							x,
							y,
							A2(
								prozacchiwawa$elm_keccak$Keccak$xor64,
								A2(prozacchiwawa$elm_keccak$Keccak$gd, x, temp),
								A2(
									prozacchiwawa$elm_keccak$Keccak$and64,
									prozacchiwawa$elm_keccak$Keccak$inv64(
										A2(
											prozacchiwawa$elm_keccak$Keccak$gd,
											A2(elm$core$Basics$modBy, 5, x + 1),
											temp)),
									A2(
										prozacchiwawa$elm_keccak$Keccak$gd,
										A2(elm$core$Basics$modBy, 5, x + 2),
										temp))),
							state_);
					});
				return A2(
					yupdate,
					4,
					A2(
						yupdate,
						3,
						A2(
							yupdate,
							2,
							A2(
								yupdate,
								1,
								A2(yupdate, 0, state)))));
			}),
		ss.f,
		prozacchiwawa$elm_keccak$Keccak$five);
	return _Utils_update(
		ss,
		{f: newState});
};
var prozacchiwawa$elm_keccak$Keccak$zero = _Utils_Tuple2(0, 0);
var prozacchiwawa$elm_keccak$Keccak$initRound = function (state) {
	return {S: prozacchiwawa$elm_keccak$Keccak$zero, W: 1, f: state, al: 1, am: 0};
};
var prozacchiwawa$elm_keccak$Keccak$lfsr86540 = function (lfsr) {
	var result = lfsr & 1;
	return (lfsr & 128) ? _Utils_Tuple2(result, (lfsr << 1) ^ 113) : _Utils_Tuple2(result, lfsr << 1);
};
var prozacchiwawa$elm_keccak$Keccak$one = _Utils_Tuple2(1, 0);
var prozacchiwawa$elm_keccak$Keccak$bitsPerElement = 32;
var elm$core$Bitwise$or = _Bitwise_or;
var prozacchiwawa$elm_keccak$Keccak$rolbytes = F2(
	function (n, _n0) {
		var va = _n0.a;
		var vb = _n0.b;
		return (!n) ? _Utils_Tuple2(va, vb) : _Utils_Tuple2(vb, va);
	});
var prozacchiwawa$elm_keccak$Keccak$rolbits = F2(
	function (n, v) {
		if (!n) {
			return v;
		} else {
			var oneRotated = A2(prozacchiwawa$elm_keccak$Keccak$rolbytes, 1, v);
			return A3(
				prozacchiwawa$elm_keccak$Keccak$tupleMap2,
				F2(
					function (a, b) {
						return prozacchiwawa$elm_keccak$Keccak$elementMask & ((a << n) | (b >>> (prozacchiwawa$elm_keccak$Keccak$bitsPerElement - n)));
					}),
				v,
				oneRotated);
		}
	});
var prozacchiwawa$elm_keccak$Keccak$rol64 = F2(
	function (n, v) {
		var rby = A2(elm$core$Basics$modBy, prozacchiwawa$elm_keccak$Keccak$bitsPerElement, (n / prozacchiwawa$elm_keccak$Keccak$bitsPerElement) | 0);
		var rotated = A2(prozacchiwawa$elm_keccak$Keccak$rolbytes, rby, v);
		var rbi = A2(elm$core$Basics$modBy, prozacchiwawa$elm_keccak$Keccak$bitsPerElement, n);
		return A2(prozacchiwawa$elm_keccak$Keccak$rolbits, rbi, rotated);
	});
var prozacchiwawa$elm_keccak$Keccak$updateArray = F3(
	function (n, f, a) {
		var element = A2(elm$core$Array$get, n, a);
		if (element.$ === 1) {
			return a;
		} else {
			var element_ = element.a;
			return A3(
				elm$core$Array$set,
				n,
				f(element_),
				a);
		}
	});
var prozacchiwawa$elm_keccak$Keccak$storexor64 = F3(
	function (off, v, arr) {
		return A3(
			prozacchiwawa$elm_keccak$Keccak$updateArray,
			off,
			prozacchiwawa$elm_keccak$Keccak$xor64(v),
			arr);
	});
var prozacchiwawa$elm_keccak$Keccak$xorLane = F4(
	function (x, y, lane, state) {
		var off = A2(prozacchiwawa$elm_keccak$Keccak$iPerm, x, y);
		return A3(prozacchiwawa$elm_keccak$Keccak$storexor64, off, lane, state);
	});
var prozacchiwawa$elm_keccak$Keccak$iota = function (ss) {
	return A3(
		elm$core$List$foldl,
		F2(
			function (j, ss_) {
				var bitPosition = (1 << j) - 1;
				var _n0 = prozacchiwawa$elm_keccak$Keccak$lfsr86540(ss_.W);
				var o = _n0.a;
				var lfsr = _n0.b;
				return o ? _Utils_update(
					ss_,
					{
						W: lfsr,
						f: A4(
							prozacchiwawa$elm_keccak$Keccak$xorLane,
							0,
							0,
							A2(prozacchiwawa$elm_keccak$Keccak$rol64, bitPosition, prozacchiwawa$elm_keccak$Keccak$one),
							ss_.f)
					}) : _Utils_update(
					ss_,
					{W: lfsr});
			}),
		ss,
		A2(elm$core$List$range, 0, 6));
};
var prozacchiwawa$elm_keccak$Keccak$twentyThree = A2(elm$core$List$range, 0, 23);
var prozacchiwawa$elm_keccak$Keccak$rhoPi = function (ss) {
	return A3(
		elm$core$List$foldl,
		F2(
			function (t, ss_) {
				var yy = A2(elm$core$Basics$modBy, 5, (2 * ss_.al) + (3 * ss_.am));
				var r = A2(elm$core$Basics$modBy, 64, (((t + 1) * (t + 2)) / 2) | 0);
				return _Utils_update(
					ss_,
					{
						S: A3(prozacchiwawa$elm_keccak$Keccak$readLane, ss_.am, yy, ss_.f),
						f: A4(
							prozacchiwawa$elm_keccak$Keccak$writeLane,
							ss_.am,
							yy,
							A2(prozacchiwawa$elm_keccak$Keccak$rol64, r, ss_.S),
							ss_.f),
						al: ss_.am,
						am: yy
					});
			}),
		_Utils_update(
			ss,
			{
				S: A3(prozacchiwawa$elm_keccak$Keccak$readLane, 1, 0, ss.f),
				al: 1,
				am: 0
			}),
		prozacchiwawa$elm_keccak$Keccak$twentyThree);
};
var prozacchiwawa$elm_keccak$Keccak$cInitX = F2(
	function (x, state) {
		return A2(
			prozacchiwawa$elm_keccak$Keccak$xor64,
			A3(prozacchiwawa$elm_keccak$Keccak$readLane, x, 0, state),
			A2(
				prozacchiwawa$elm_keccak$Keccak$xor64,
				A3(prozacchiwawa$elm_keccak$Keccak$readLane, x, 1, state),
				A2(
					prozacchiwawa$elm_keccak$Keccak$xor64,
					A3(prozacchiwawa$elm_keccak$Keccak$readLane, x, 2, state),
					A2(
						prozacchiwawa$elm_keccak$Keccak$xor64,
						A3(prozacchiwawa$elm_keccak$Keccak$readLane, x, 3, state),
						A3(prozacchiwawa$elm_keccak$Keccak$readLane, x, 4, state)))));
	});
var prozacchiwawa$elm_keccak$Keccak$twentyFive = A2(elm$core$List$range, 0, 25);
var prozacchiwawa$elm_keccak$Keccak$theta = function (ss) {
	var d = function (x) {
		var c4 = A2(
			prozacchiwawa$elm_keccak$Keccak$cInitX,
			A2(elm$core$Basics$modBy, 5, x + 4),
			ss.f);
		var c1 = A2(
			prozacchiwawa$elm_keccak$Keccak$cInitX,
			A2(elm$core$Basics$modBy, 5, x + 1),
			ss.f);
		return A2(
			prozacchiwawa$elm_keccak$Keccak$xor64,
			c4,
			A2(prozacchiwawa$elm_keccak$Keccak$rol64, 1, c1));
	};
	var dx = {
		an: d(0),
		ao: d(1),
		ap: d(2),
		aq: d(3),
		ar: d(4)
	};
	var sd = A3(
		elm$core$List$foldl,
		F2(
			function (n, state) {
				var x = A2(elm$core$Basics$modBy, 5, n);
				var y = (n / 5) | 0;
				return A4(
					prozacchiwawa$elm_keccak$Keccak$xorLane,
					x,
					y,
					A2(prozacchiwawa$elm_keccak$Keccak$gd, x, dx),
					state);
			}),
		ss.f,
		prozacchiwawa$elm_keccak$Keccak$twentyFive);
	return _Utils_update(
		ss,
		{f: sd});
};
var prozacchiwawa$elm_keccak$Keccak$keccakF1600_StatePermute = function (state) {
	var res = A3(
		elm$core$List$foldr,
		function (_n0) {
			return A2(
				elm$core$Basics$composeR,
				prozacchiwawa$elm_keccak$Keccak$theta,
				A2(
					elm$core$Basics$composeR,
					prozacchiwawa$elm_keccak$Keccak$rhoPi,
					A2(elm$core$Basics$composeR, prozacchiwawa$elm_keccak$Keccak$chi, prozacchiwawa$elm_keccak$Keccak$iota)));
		},
		prozacchiwawa$elm_keccak$Keccak$initRound(state),
		prozacchiwawa$elm_keccak$Keccak$twentyThree);
	return res.f;
};
var prozacchiwawa$elm_keccak$Keccak$bytesPerElement = (prozacchiwawa$elm_keccak$Keccak$bitsPerElement / 8) | 0;
var prozacchiwawa$elm_keccak$Keccak$retrieveOutputByte = F2(
	function (i, arr) {
		var shift = 8 * A2(elm$core$Basics$modBy, prozacchiwawa$elm_keccak$Keccak$bytesPerElement, i);
		var e = A2(elm$core$Basics$modBy, 2, (i / prozacchiwawa$elm_keccak$Keccak$bytesPerElement) | 0);
		var _n0 = A2(
			elm$core$Maybe$withDefault,
			_Utils_Tuple2(0, 0),
			A2(elm$core$Array$get, (i / 8) | 0, arr));
		var ea = _n0.a;
		var eb = _n0.b;
		var byi = (!e) ? ea : eb;
		return 255 & (byi >> shift);
	});
var prozacchiwawa$elm_keccak$Keccak$xorFromByte = F3(
	function (shift, sel, by) {
		return (!sel) ? _Utils_Tuple2(by << shift, 0) : _Utils_Tuple2(0, by << shift);
	});
var prozacchiwawa$elm_keccak$Keccak$xorByteIntoState = F3(
	function (i, v, state) {
		var shift = 8 * A2(elm$core$Basics$modBy, prozacchiwawa$elm_keccak$Keccak$bytesPerElement, i);
		var e = A2(elm$core$Basics$modBy, 2, (i / prozacchiwawa$elm_keccak$Keccak$bytesPerElement) | 0);
		var newElt = A3(prozacchiwawa$elm_keccak$Keccak$xorFromByte, shift, e, v);
		return A3(prozacchiwawa$elm_keccak$Keccak$storexor64, (i / 8) | 0, newElt, state);
	});
var prozacchiwawa$elm_keccak$Keccak$xorIntoState = F2(
	function (block, state) {
		return A3(
			elm$core$List$foldl,
			F2(
				function (_n0, s) {
					var i = _n0.a;
					var e = _n0.b;
					return A3(prozacchiwawa$elm_keccak$Keccak$xorByteIntoState, i, e, s);
				}),
			state,
			A2(
				elm$core$List$indexedMap,
				F2(
					function (i, e) {
						return _Utils_Tuple2(i, e);
					}),
				block));
	});
var prozacchiwawa$elm_keccak$Keccak$keccak = F6(
	function (rate, capacity, input, delSuffix, output, outputLen) {
		var rateInBytes = (rate / 8) | 0;
		var state = A3(
			elm$core$List$foldl,
			F2(
				function (inb, state_) {
					var s1 = A2(prozacchiwawa$elm_keccak$Keccak$xorIntoState, inb, state_);
					return _Utils_eq(
						elm$core$List$length(inb),
						rateInBytes) ? prozacchiwawa$elm_keccak$Keccak$keccakF1600_StatePermute(s1) : s1;
				}),
			A2(
				elm$core$Array$initialize,
				25,
				elm$core$Basics$always(prozacchiwawa$elm_keccak$Keccak$zero)),
			A2(elm_community$list_extra$List$Extra$greedyGroupsOf, rateInBytes, input));
		var inputLength = elm$core$List$length(input);
		var blockSize = (!inputLength) ? 0 : ((!A2(elm$core$Basics$modBy, rateInBytes, inputLength)) ? rateInBytes : A2(elm$core$Basics$modBy, rateInBytes, inputLength));
		if (((rate + capacity) !== 1600) || A2(elm$core$Basics$modBy, 8, rate)) {
			return _List_Nil;
		} else {
			var state1 = A3(prozacchiwawa$elm_keccak$Keccak$xorByteIntoState, blockSize, delSuffix, state);
			var state2 = ((delSuffix & 128) && _Utils_eq(blockSize, rateInBytes - 1)) ? prozacchiwawa$elm_keccak$Keccak$keccakF1600_StatePermute(state1) : state1;
			var state3 = A3(prozacchiwawa$elm_keccak$Keccak$xorByteIntoState, rateInBytes - 1, 128, state2);
			var state4 = prozacchiwawa$elm_keccak$Keccak$keccakF1600_StatePermute(state3);
			var processRemainingOutput = F3(
				function (state_, output_, outputByteLen) {
					processRemainingOutput:
					while (true) {
						if (outputByteLen > 0) {
							var blockSize_ = A2(elm$core$Basics$min, outputByteLen, rateInBytes);
							var outputBytes = A2(
								elm$core$List$map,
								function (i) {
									return A2(prozacchiwawa$elm_keccak$Keccak$retrieveOutputByte, i, state4);
								},
								A2(elm$core$List$range, 0, blockSize_));
							var $temp$state_ = prozacchiwawa$elm_keccak$Keccak$keccakF1600_StatePermute(state_),
								$temp$output_ = _Utils_ap(output_, outputBytes),
								$temp$outputByteLen = outputByteLen - blockSize_;
							state_ = $temp$state_;
							output_ = $temp$output_;
							outputByteLen = $temp$outputByteLen;
							continue processRemainingOutput;
						} else {
							return output_;
						}
					}
				});
			return A2(
				elm$core$List$take,
				outputLen,
				A3(processRemainingOutput, state4, output, outputLen));
		}
	});
var prozacchiwawa$elm_keccak$Keccak$fips202_sha3_512 = function (input) {
	return A6(prozacchiwawa$elm_keccak$Keccak$keccak, 576, 1024, input, 6, _List_Nil, 64);
};
var author$project$Shared$Password$hash = function (_n0) {
	var p = _n0;
	return author$project$Shared$Password$listToHex(
		prozacchiwawa$elm_keccak$Keccak$fips202_sha3_512(
			author$project$Shared$Password$stringToList(p)));
};
var author$project$Client$User$formToAuth = function (_n0) {
	var name = _n0.ai;
	var password = _n0.ak;
	return {
		ai: name,
		ak: author$project$Shared$Password$hash(password)
	};
};
var author$project$Client$User$getFrom = F3(
	function (fnLoggedOff, fnLoggedIn, user) {
		switch (user.$) {
			case 0:
				var world = user.a;
				var form = user.b;
				return A2(fnLoggedOff, world, form);
			case 1:
				var world = user.a;
				var form = user.b;
				return A2(fnLoggedOff, world, form);
			case 2:
				var world = user.b;
				var form = user.c;
				return A2(fnLoggedOff, world, form);
			case 3:
				var world = user.b;
				var form = user.c;
				return A2(fnLoggedOff, world, form);
			case 4:
				var world = user.a;
				var form = user.b;
				return A2(fnLoggedOff, world, form);
			case 5:
				var world = user.b;
				var form = user.c;
				return A2(fnLoggedOff, world, form);
			default:
				var loggedInUser = user.a;
				return fnLoggedIn(loggedInUser);
		}
	});
var author$project$Client$User$getFromLoggedOff = F3(
	function (fn, _default, user) {
		return A3(
			author$project$Client$User$getFrom,
			fn,
			function (_n0) {
				return _default;
			},
			user);
	});
var author$project$Client$User$getForm = function (user) {
	return A3(
		author$project$Client$User$getFromLoggedOff,
		F2(
			function (_n0, form) {
				return elm$core$Maybe$Just(form);
			}),
		elm$core$Maybe$Nothing,
		user);
};
var author$project$Client$User$getAuthFromForm = function (user) {
	return A2(
		elm$core$Maybe$map,
		author$project$Client$User$formToAuth,
		author$project$Client$User$getForm(user));
};
var author$project$Client$Main$getAuthFromForm = function (model) {
	return author$project$Client$User$getAuthFromForm(model.F);
};
var author$project$Client$User$getFromLoggedIn = F3(
	function (fn, _default, user) {
		return A3(
			author$project$Client$User$getFrom,
			F2(
				function (_n0, _n1) {
					return _default;
				}),
			fn,
			user);
	});
var author$project$Client$User$getLoggedInUser = function (user) {
	return A3(
		author$project$Client$User$getFromLoggedIn,
		function (loggedInUser) {
			return elm$core$Maybe$Just(loggedInUser);
		},
		elm$core$Maybe$Nothing,
		user);
};
var author$project$Client$User$getAuthFromUser = function (user) {
	return A2(
		elm$core$Maybe$map,
		function (_n0) {
			var name = _n0.ai;
			var password = _n0.ak;
			return {ai: name, ak: password};
		},
		author$project$Client$User$getLoggedInUser(user));
};
var author$project$Client$Main$getAuthFromUser = function (model) {
	return author$project$Client$User$getAuthFromUser(model.F);
};
var krisajenkins$remotedata$RemoteData$Loading = {$: 1};
var krisajenkins$remotedata$RemoteData$map = F2(
	function (f, data) {
		switch (data.$) {
			case 3:
				var value = data.a;
				return krisajenkins$remotedata$RemoteData$Success(
					f(value));
			case 1:
				return krisajenkins$remotedata$RemoteData$Loading;
			case 0:
				return krisajenkins$remotedata$RemoteData$NotAsked;
			default:
				var error = data.a;
				return krisajenkins$remotedata$RemoteData$Failure(error);
		}
	});
var krisajenkins$remotedata$RemoteData$withDefault = F2(
	function (_default, data) {
		if (data.$ === 3) {
			var x = data.a;
			return x;
		} else {
			return _default;
		}
	});
var author$project$Client$Main$handleResponse = F2(
	function (_n0, response) {
		var ok = _n0.aj;
		var err = _n0.ah;
		var _default = _n0.ag;
		return A2(
			krisajenkins$remotedata$RemoteData$withDefault,
			_default,
			A2(
				krisajenkins$remotedata$RemoteData$map,
				function (response_) {
					if (!response_.$) {
						var data = response_.a;
						return ok(data);
					} else {
						var error = response_.a;
						return err(error);
					}
				},
				response));
	});
var author$project$Client$User$mapLoggedOff = F2(
	function (fn, user) {
		return A3(author$project$Client$User$map, fn, elm$core$Basics$identity, user);
	});
var author$project$Client$User$mapForm = F2(
	function (fn, user) {
		return A2(
			author$project$Client$User$mapLoggedOff,
			function (_n0) {
				var world = _n0.a;
				var form = _n0.b;
				return _Utils_Tuple2(
					world,
					fn(form));
			},
			user);
	});
var author$project$Client$Main$setName = F2(
	function (name, model) {
		return A2(
			author$project$Client$Main$updateUser,
			author$project$Client$User$mapForm(
				function (form) {
					return _Utils_update(
						form,
						{ai: name});
				}),
			model);
	});
var author$project$Client$Main$setPassword = F2(
	function (password, model) {
		return A2(
			author$project$Client$Main$updateUser,
			author$project$Client$User$mapForm(
				function (form) {
					return _Utils_update(
						form,
						{ak: password});
				}),
			model);
	});
var author$project$Client$Main$setWorldAsLoading = function (model) {
	return A2(
		author$project$Client$Main$updateUser,
		author$project$Client$User$mapLoggedInUser(
			function (user) {
				return _Utils_update(
					user,
					{H: krisajenkins$remotedata$RemoteData$Loading});
			}),
		model);
};
var author$project$Client$User$mapLoggedOffWorld = F2(
	function (fn, user) {
		return A2(
			author$project$Client$User$mapLoggedOff,
			function (_n0) {
				var world = _n0.a;
				var form = _n0.b;
				return _Utils_Tuple2(
					fn(world),
					form);
			},
			user);
	});
var author$project$Client$Main$updateAnonymousWorld = F2(
	function (_n0, model) {
		var world = _n0.H;
		return A2(
			author$project$Client$Main$updateUser,
			author$project$Client$User$mapLoggedOffWorld(
				function (_n1) {
					return krisajenkins$remotedata$RemoteData$Success(world);
				}),
			model);
	});
var author$project$Client$Main$updateMessages = F2(
	function (_n0, model) {
		var messageQueue = _n0.at;
		return A2(
			author$project$Client$Main$updateUser,
			author$project$Client$User$mapLoggedInUser(
				function (user) {
					return _Utils_update(
						user,
						{
							Y: _Utils_ap(user.Y, messageQueue)
						});
				}),
			model);
	});
var author$project$Client$Main$updateWorld = F2(
	function (_n0, model) {
		var world = _n0.H;
		return A2(
			author$project$Client$Main$updateUser,
			author$project$Client$User$mapLoggedInUser(
				function (user) {
					return _Utils_update(
						user,
						{
							H: krisajenkins$remotedata$RemoteData$Success(world)
						});
				}),
			model);
	});
var author$project$Client$User$loggedIn = F4(
	function (name, password, world, messageQueue) {
		return author$project$Client$User$LoggedIn(
			{
				Y: messageQueue,
				ai: name,
				ak: author$project$Shared$Password$hash(password),
				H: krisajenkins$remotedata$RemoteData$Success(world)
			});
	});
var author$project$Client$User$loggingInError = F3(
	function (error, world, form) {
		return A3(author$project$Client$User$LoggingInError, error, world, form);
	});
var author$project$Shared$Player$toOther = function (_n0) {
	var hp = _n0.V;
	var xp = _n0.af;
	var name = _n0.ai;
	return {V: hp, ai: name, af: xp};
};
var author$project$Shared$World$clientToAnonymous = function (_n0) {
	var player = _n0.a0;
	var otherPlayers = _n0.bF;
	return {
		bG: A2(
			elm$core$List$cons,
			author$project$Shared$Player$toOther(player),
			otherPlayers)
	};
};
var author$project$Client$User$logout = function (user) {
	return A3(
		author$project$Client$User$getFrom,
		F2(
			function (world, form) {
				return A2(author$project$Client$User$Anonymous, world, form);
			}),
		function (_n0) {
			var world = _n0.H;
			return A2(
				author$project$Client$User$Anonymous,
				A2(krisajenkins$remotedata$RemoteData$map, author$project$Shared$World$clientToAnonymous, world),
				author$project$Client$User$emptyForm);
		},
		user);
};
var author$project$Client$User$signingUpError = F3(
	function (error, world, form) {
		return A3(author$project$Client$User$SigningUpError, error, world, form);
	});
var author$project$Client$User$transitionFromLoggedOff = F2(
	function (fn, user) {
		return A3(author$project$Client$User$getFromLoggedOff, fn, user, user);
	});
var author$project$Client$User$unknownError = F3(
	function (error, world, form) {
		return A3(author$project$Client$User$UnknownError, error, world, form);
	});
var author$project$Extra$Http$errorToString = function (error) {
	switch (error.$) {
		case 0:
			var url = error.a;
			return 'Bad URL address: ' + url;
		case 1:
			return 'HTTP Request Timeout';
		case 2:
			return 'Network Error';
		case 3:
			return 'Bad HTTP Status';
		default:
			var jsonError = error.a;
			return 'Bad HTTP Payload: ' + jsonError;
	}
};
var elm$core$Platform$Cmd$batch = _Platform_batch;
var elm$core$Platform$Cmd$none = elm$core$Platform$Cmd$batch(_List_Nil);
var author$project$Client$Main$update = F2(
	function (msg, model) {
		var serverEndpoint = model.M;
		switch (msg.$) {
			case 0:
				return _Utils_Tuple2(model, elm$core$Platform$Cmd$none);
			case 1:
				return _Utils_Tuple2(
					A2(author$project$Client$Main$addMessage, 'UrlRequested TODO', model),
					elm$core$Platform$Cmd$none);
			case 2:
				return _Utils_Tuple2(
					A2(author$project$Client$Main$addMessage, 'UrlChanged TODO', model),
					elm$core$Platform$Cmd$none);
			case 11:
				var name = msg.a;
				return _Utils_Tuple2(
					A2(author$project$Client$Main$setName, name, model),
					elm$core$Platform$Cmd$none);
			case 12:
				var password = msg.a;
				return _Utils_Tuple2(
					A2(
						author$project$Client$Main$setPassword,
						author$project$Shared$Password$password(password),
						model),
					elm$core$Platform$Cmd$none);
			case 3:
				var route = msg.a;
				switch (route.$) {
					case 0:
						return _Utils_Tuple2(model, elm$core$Platform$Cmd$none);
					case 1:
						return _Utils_Tuple2(
							author$project$Client$Main$setWorldAsLoading(model),
							A3(
								author$project$Client$Main$sendRequest,
								serverEndpoint,
								route,
								author$project$Client$Main$getAuthFromForm(model)));
					case 2:
						return _Utils_Tuple2(
							author$project$Client$Main$setWorldAsLoading(model),
							A3(
								author$project$Client$Main$sendRequest,
								serverEndpoint,
								route,
								author$project$Client$Main$getAuthFromForm(model)));
					case 6:
						return _Utils_Tuple2(
							A2(
								author$project$Client$Main$updateUser,
								author$project$Client$User$mapLoggedOffWorld(
									function (_n2) {
										return krisajenkins$remotedata$RemoteData$Loading;
									}),
								model),
							A3(author$project$Client$Main$sendRequest, serverEndpoint, route, elm$core$Maybe$Nothing));
					case 5:
						return _Utils_Tuple2(
							author$project$Client$Main$setWorldAsLoading(model),
							A3(
								author$project$Client$Main$sendRequest,
								serverEndpoint,
								route,
								author$project$Client$Main$getAuthFromUser(model)));
					case 3:
						return _Utils_Tuple2(
							author$project$Client$Main$setWorldAsLoading(model),
							A3(
								author$project$Client$Main$sendRequest,
								serverEndpoint,
								route,
								author$project$Client$Main$getAuthFromUser(model)));
					case 4:
						return _Utils_Tuple2(
							A2(
								author$project$Client$Main$updateUser,
								author$project$Client$User$mapLoggedOffWorld(
									function (_n3) {
										return krisajenkins$remotedata$RemoteData$Loading;
									}),
								model),
							A3(author$project$Client$Main$sendRequest, serverEndpoint, route, elm$core$Maybe$Nothing));
					default:
						var attr = route.a;
						return _Utils_Tuple2(
							model,
							A3(
								author$project$Client$Main$sendRequest,
								serverEndpoint,
								route,
								author$project$Client$Main$getAuthFromUser(model)));
				}
			case 4:
				var response = msg.a;
				return _Utils_Tuple2(
					function () {
						switch (response.$) {
							case 3:
								var response_ = response.a;
								if (!response_.$) {
									var world = response_.a.H;
									var messageQueue = response_.a.at;
									return A2(
										author$project$Client$Main$updateUser,
										author$project$Client$User$transitionFromLoggedOff(
											F2(
												function (_n6, _n7) {
													var name = _n7.ai;
													var password = _n7.ak;
													return A4(author$project$Client$User$loggedIn, name, password, world, messageQueue);
												})),
										model);
								} else {
									var signupError = response_.a;
									return A2(
										author$project$Client$Main$updateUser,
										author$project$Client$User$transitionFromLoggedOff(
											author$project$Client$User$signingUpError(signupError)),
										model);
								}
							case 2:
								var error = response.a;
								return A2(
									author$project$Client$Main$updateUser,
									author$project$Client$User$transitionFromLoggedOff(
										author$project$Client$User$unknownError(
											author$project$Extra$Http$errorToString(error))),
									model);
							case 0:
								return A2(
									author$project$Client$Main$updateUser,
									author$project$Client$User$transitionFromLoggedOff(
										author$project$Client$User$unknownError('Internal error: Signup got into NotAsked state')),
									model);
							default:
								return A2(
									author$project$Client$Main$updateUser,
									author$project$Client$User$transitionFromLoggedOff(
										author$project$Client$User$unknownError('Internal error: Signup got into Loading state')),
									model);
						}
					}(),
					elm$core$Platform$Cmd$none);
			case 5:
				var response = msg.a;
				return _Utils_Tuple2(
					function () {
						switch (response.$) {
							case 3:
								var response_ = response.a;
								if (!response_.$) {
									var world = response_.a.H;
									var messageQueue = response_.a.at;
									return A2(
										author$project$Client$Main$updateUser,
										author$project$Client$User$transitionFromLoggedOff(
											F2(
												function (_n10, _n11) {
													var name = _n11.ai;
													var password = _n11.ak;
													return A4(author$project$Client$User$loggedIn, name, password, world, messageQueue);
												})),
										model);
								} else {
									var authError = response_.a;
									return A2(
										author$project$Client$Main$updateUser,
										author$project$Client$User$transitionFromLoggedOff(
											author$project$Client$User$loggingInError(authError)),
										model);
								}
							case 2:
								var error = response.a;
								return A2(
									author$project$Client$Main$updateUser,
									author$project$Client$User$transitionFromLoggedOff(
										author$project$Client$User$unknownError(
											author$project$Extra$Http$errorToString(error))),
									model);
							case 0:
								return A2(
									author$project$Client$Main$updateUser,
									author$project$Client$User$transitionFromLoggedOff(
										author$project$Client$User$unknownError('Internal error: Login got into NotAsked state')),
									model);
							default:
								return A2(
									author$project$Client$Main$updateUser,
									author$project$Client$User$transitionFromLoggedOff(
										author$project$Client$User$unknownError('Internal error: Login got into Loading state')),
									model);
						}
					}(),
					elm$core$Platform$Cmd$none);
			case 6:
				var response = msg.a;
				return _Utils_Tuple2(
					A2(
						author$project$Client$Main$handleResponse,
						{
							ag: model,
							ah: function (_n12) {
								return model;
							},
							aj: function (response_) {
								return A2(
									author$project$Client$Main$updateMessages,
									response_,
									A2(author$project$Client$Main$updateWorld, response_, model));
							}
						},
						response),
					elm$core$Platform$Cmd$none);
			case 7:
				var response = msg.a;
				return _Utils_Tuple2(
					A2(
						author$project$Client$Main$handleResponse,
						{
							ag: model,
							ah: function (_n13) {
								return model;
							},
							aj: function (response_) {
								return A2(
									author$project$Client$Main$updateMessages,
									response_,
									A2(author$project$Client$Main$updateWorld, response_, model));
							}
						},
						response),
					elm$core$Platform$Cmd$none);
			case 8:
				var response = msg.a;
				return _Utils_Tuple2(
					function () {
						switch (response.$) {
							case 3:
								var response_ = response.a;
								return A2(
									author$project$Client$Main$updateAnonymousWorld,
									response_,
									A2(author$project$Client$Main$updateUser, author$project$Client$User$logout, model));
							case 2:
								var err = response.a;
								return model;
							case 0:
								return model;
							default:
								return model;
						}
					}(),
					elm$core$Platform$Cmd$none);
			case 9:
				var response = msg.a;
				return _Utils_Tuple2(
					A2(
						author$project$Client$Main$updateUser,
						author$project$Client$User$mapLoggedOffWorld(
							function (_n15) {
								return A2(
									krisajenkins$remotedata$RemoteData$map,
									function ($) {
										return $.H;
									},
									response);
							}),
						model),
					elm$core$Platform$Cmd$none);
			default:
				var response = msg.a;
				return _Utils_Tuple2(
					A2(
						author$project$Client$Main$handleResponse,
						{
							ag: model,
							ah: function (_n16) {
								return model;
							},
							aj: function (response_) {
								return A2(
									author$project$Client$Main$updateMessages,
									response_,
									A2(author$project$Client$Main$updateWorld, response_, model));
							}
						},
						response),
					elm$core$Platform$Cmd$none);
		}
	});
var author$project$Client$Main$Request = function (a) {
	return {$: 3, a: a};
};
var author$project$Client$Main$SetName = function (a) {
	return {$: 11, a: a};
};
var author$project$Client$Main$SetPassword = function (a) {
	return {$: 12, a: a};
};
var author$project$Client$Main$userConfig = {bI: author$project$Client$Main$Request, bL: author$project$Client$Main$SetName, bM: author$project$Client$Main$SetPassword};
var elm$virtual_dom$VirtualDom$Normal = function (a) {
	return {$: 0, a: a};
};
var elm$virtual_dom$VirtualDom$toHandlerInt = function (handler) {
	switch (handler.$) {
		case 0:
			return 0;
		case 1:
			return 1;
		case 2:
			return 2;
		default:
			return 3;
	}
};
var elm$virtual_dom$VirtualDom$on = _VirtualDom_on;
var elm$html$Html$Events$on = F2(
	function (event, decoder) {
		return A2(
			elm$virtual_dom$VirtualDom$on,
			event,
			elm$virtual_dom$VirtualDom$Normal(decoder));
	});
var elm$html$Html$Events$onClick = function (msg) {
	return A2(
		elm$html$Html$Events$on,
		'click',
		elm$json$Json$Decode$succeed(msg));
};
var author$project$Client$User$onClickRequest = F2(
	function (_n0, route) {
		var request = _n0.bI;
		return elm$html$Html$Events$onClick(
			request(route));
	});
var elm$html$Html$button = _VirtualDom_node('button');
var elm$html$Html$div = _VirtualDom_node('div');
var elm$virtual_dom$VirtualDom$text = _VirtualDom_text;
var elm$html$Html$text = elm$virtual_dom$VirtualDom$text;
var elm$json$Json$Encode$bool = _Json_wrap;
var elm$html$Html$Attributes$boolProperty = F2(
	function (key, bool) {
		return A2(
			_VirtualDom_property,
			key,
			elm$json$Json$Encode$bool(bool));
	});
var elm$html$Html$Attributes$disabled = elm$html$Html$Attributes$boolProperty('disabled');
var author$project$Client$User$viewButtons = F2(
	function (c, world) {
		return A2(
			elm$html$Html$div,
			_List_Nil,
			_List_fromArray(
				[
					A2(
					elm$html$Html$button,
					_List_fromArray(
						[
							A2(
							krisajenkins$remotedata$RemoteData$withDefault,
							elm$html$Html$Attributes$disabled(true),
							A2(
								krisajenkins$remotedata$RemoteData$map,
								function (_n0) {
									return A2(author$project$Client$User$onClickRequest, c, author$project$Server$Route$Refresh);
								},
								world))
						]),
					_List_fromArray(
						[
							elm$html$Html$text('Refresh')
						])),
					A2(
					elm$html$Html$button,
					_List_fromArray(
						[
							A2(author$project$Client$User$onClickRequest, c, author$project$Server$Route$Logout)
						]),
					_List_fromArray(
						[
							elm$html$Html$text('Logout')
						]))
				]));
	});
var elm$html$Html$li = _VirtualDom_node('li');
var author$project$Client$User$viewMessage = function (message) {
	return A2(
		elm$html$Html$li,
		_List_Nil,
		_List_fromArray(
			[
				elm$html$Html$text(message)
			]));
};
var elm$html$Html$strong = _VirtualDom_node('strong');
var elm$html$Html$ul = _VirtualDom_node('ul');
var author$project$Client$User$viewMessages = function (messages) {
	return A2(
		elm$html$Html$div,
		_List_Nil,
		_List_fromArray(
			[
				A2(
				elm$html$Html$strong,
				_List_Nil,
				_List_fromArray(
					[
						elm$html$Html$text('Messages:')
					])),
				A2(
				elm$html$Html$ul,
				_List_Nil,
				A2(elm$core$List$map, author$project$Client$User$viewMessage, messages))
			]));
};
var author$project$Shared$Level$levelCap = 99;
var author$project$Shared$Level$xpForLevel = function (level) {
	return (((level * (level - 1)) / 2) | 0) * 1000;
};
var author$project$Shared$Level$xpTable = A2(
	elm$core$List$map,
	function (lvl) {
		return _Utils_Tuple2(
			lvl,
			author$project$Shared$Level$xpForLevel(lvl));
	},
	A2(elm$core$List$range, 1, author$project$Shared$Level$levelCap));
var elm_community$list_extra$List$Extra$dropWhile = F2(
	function (predicate, list) {
		dropWhile:
		while (true) {
			if (!list.b) {
				return _List_Nil;
			} else {
				var x = list.a;
				var xs = list.b;
				if (predicate(x)) {
					var $temp$predicate = predicate,
						$temp$list = xs;
					predicate = $temp$predicate;
					list = $temp$list;
					continue dropWhile;
				} else {
					return list;
				}
			}
		}
	});
var author$project$Shared$Level$levelForXp = function (xp) {
	return A2(
		elm$core$Maybe$withDefault,
		author$project$Shared$Level$levelCap,
		A2(
			elm$core$Maybe$map,
			A2(
				elm$core$Basics$composeR,
				elm$core$Tuple$first,
				function (lvl) {
					return lvl - 1;
				}),
			elm$core$List$head(
				A2(
					elm_community$list_extra$List$Extra$dropWhile,
					function (_n0) {
						var lvl = _n0.a;
						var xp_ = _n0.b;
						return _Utils_cmp(xp_, xp) < 1;
					},
					author$project$Shared$Level$xpTable))));
};
var elm$html$Html$td = _VirtualDom_node('td');
var elm$html$Html$tr = _VirtualDom_node('tr');
var author$project$Client$User$viewOtherPlayer = F3(
	function (c, player, otherPlayer) {
		return A2(
			elm$html$Html$tr,
			_List_Nil,
			_List_fromArray(
				[
					A2(
					elm$html$Html$td,
					_List_Nil,
					_List_fromArray(
						[
							elm$html$Html$text(otherPlayer.ai)
						])),
					A2(
					elm$html$Html$td,
					_List_Nil,
					_List_fromArray(
						[
							elm$html$Html$text(
							elm$core$String$fromInt(otherPlayer.V))
						])),
					A2(
					elm$html$Html$td,
					_List_Nil,
					_List_fromArray(
						[
							elm$html$Html$text(
							elm$core$String$fromInt(
								author$project$Shared$Level$levelForXp(otherPlayer.af)))
						])),
					A2(
					elm$html$Html$td,
					_List_Nil,
					_List_fromArray(
						[
							A2(
							elm$html$Html$button,
							_List_fromArray(
								[
									((player.V > 0) && (otherPlayer.V > 0)) ? A2(
									author$project$Client$User$onClickRequest,
									c,
									author$project$Server$Route$Attack(otherPlayer.ai)) : elm$html$Html$Attributes$disabled(true)
								]),
							_List_fromArray(
								[
									elm$html$Html$text('Attack!')
								]))
						]))
				]));
	});
var elm$core$List$isEmpty = function (xs) {
	if (!xs.b) {
		return true;
	} else {
		return false;
	}
};
var elm$html$Html$table = _VirtualDom_node('table');
var elm$html$Html$th = _VirtualDom_node('th');
var author$project$Client$User$viewOtherPlayers = F2(
	function (c, _n0) {
		var player = _n0.a0;
		var otherPlayers = _n0.bF;
		return A2(
			elm$html$Html$div,
			_List_Nil,
			_List_fromArray(
				[
					A2(
					elm$html$Html$strong,
					_List_Nil,
					_List_fromArray(
						[
							elm$html$Html$text('Other players:')
						])),
					elm$core$List$isEmpty(otherPlayers) ? A2(
					elm$html$Html$div,
					_List_Nil,
					_List_fromArray(
						[
							elm$html$Html$text('There are none so far!')
						])) : A2(
					elm$html$Html$table,
					_List_Nil,
					A2(
						elm$core$List$cons,
						A2(
							elm$html$Html$tr,
							_List_Nil,
							_List_fromArray(
								[
									A2(
									elm$html$Html$th,
									_List_Nil,
									_List_fromArray(
										[
											elm$html$Html$text('Player')
										])),
									A2(
									elm$html$Html$th,
									_List_Nil,
									_List_fromArray(
										[
											elm$html$Html$text('HP')
										])),
									A2(
									elm$html$Html$th,
									_List_Nil,
									_List_fromArray(
										[
											elm$html$Html$text('Level')
										])),
									A2(elm$html$Html$th, _List_Nil, _List_Nil)
								])),
						A2(
							elm$core$List$map,
							A2(author$project$Client$User$viewOtherPlayer, c, player),
							otherPlayers)))
				]));
	});
var author$project$Shared$Level$xpToNextLevel = function (currentXp) {
	var currentLevel = author$project$Shared$Level$levelForXp(currentXp);
	var nextLevel = currentLevel + 1;
	var nextXp = author$project$Shared$Level$xpForLevel(nextLevel);
	return nextXp - currentXp;
};
var author$project$Shared$Special$getter = function (attr) {
	switch (attr) {
		case 0:
			return function ($) {
				return $.E;
			};
		case 1:
			return function ($) {
				return $.C;
			};
		case 2:
			return function ($) {
				return $.w;
			};
		case 3:
			return function ($) {
				return $.u;
			};
		case 4:
			return function ($) {
				return $.y;
			};
		case 5:
			return function ($) {
				return $.t;
			};
		default:
			return function ($) {
				return $.z;
			};
	}
};
var elm$html$Html$Attributes$colspan = function (n) {
	return A2(
		_VirtualDom_attribute,
		'colspan',
		elm$core$String$fromInt(n));
};
var author$project$Client$User$viewPlayer = F2(
	function (c, player) {
		var viewSpecialAttr = function (attr) {
			return A2(
				elm$html$Html$tr,
				_List_Nil,
				_List_fromArray(
					[
						A2(
						elm$html$Html$th,
						_List_Nil,
						_List_fromArray(
							[
								elm$html$Html$text(
								author$project$Shared$Special$label(attr))
							])),
						A2(
						elm$html$Html$td,
						_List_Nil,
						_List_fromArray(
							[
								elm$html$Html$text(
								elm$core$String$fromInt(
									A2(author$project$Shared$Special$getter, attr, player.bN)))
							])),
						A2(
						elm$html$Html$td,
						_List_Nil,
						(player.aC > 0) ? _List_fromArray(
							[
								A2(
								elm$html$Html$button,
								_List_fromArray(
									[
										A2(
										author$project$Client$User$onClickRequest,
										c,
										author$project$Server$Route$IncSpecialAttr(attr))
									]),
								_List_fromArray(
									[
										elm$html$Html$text('+')
									]))
							]) : _List_Nil)
					]));
		};
		return A2(
			elm$html$Html$table,
			_List_Nil,
			_List_fromArray(
				[
					A2(
					elm$html$Html$tr,
					_List_Nil,
					_List_fromArray(
						[
							A2(elm$html$Html$td, _List_Nil, _List_Nil),
							A2(
							elm$html$Html$th,
							_List_Nil,
							_List_fromArray(
								[
									elm$html$Html$text('PLAYER STATS')
								])),
							A2(elm$html$Html$td, _List_Nil, _List_Nil)
						])),
					A2(
					elm$html$Html$tr,
					_List_Nil,
					_List_fromArray(
						[
							A2(
							elm$html$Html$th,
							_List_Nil,
							_List_fromArray(
								[
									elm$html$Html$text('Name')
								])),
							A2(
							elm$html$Html$td,
							_List_Nil,
							_List_fromArray(
								[
									elm$html$Html$text(player.ai)
								])),
							A2(elm$html$Html$td, _List_Nil, _List_Nil)
						])),
					A2(
					elm$html$Html$tr,
					_List_Nil,
					_List_fromArray(
						[
							A2(
							elm$html$Html$th,
							_List_Nil,
							_List_fromArray(
								[
									elm$html$Html$text('HP')
								])),
							A2(
							elm$html$Html$td,
							_List_Nil,
							_List_fromArray(
								[
									elm$html$Html$text(
									elm$core$String$fromInt(player.V) + ('/' + elm$core$String$fromInt(player.bA)))
								])),
							A2(elm$html$Html$td, _List_Nil, _List_Nil)
						])),
					A2(
					elm$html$Html$tr,
					_List_Nil,
					_List_fromArray(
						[
							A2(
							elm$html$Html$th,
							_List_Nil,
							_List_fromArray(
								[
									elm$html$Html$text('Level')
								])),
							A2(
							elm$html$Html$td,
							_List_fromArray(
								[
									elm$html$Html$Attributes$colspan(2)
								]),
							_List_fromArray(
								[
									elm$html$Html$text(
									elm$core$String$fromInt(
										author$project$Shared$Level$levelForXp(player.af)) + (' (' + (elm$core$String$fromInt(player.af) + (' XP, ' + (elm$core$String$fromInt(
										author$project$Shared$Level$xpToNextLevel(player.af)) + ' till the next level)')))))
								]))
						])),
					A2(
					elm$html$Html$tr,
					_List_Nil,
					_List_fromArray(
						[
							A2(elm$html$Html$td, _List_Nil, _List_Nil),
							A2(
							elm$html$Html$th,
							_List_fromArray(
								[
									elm$html$Html$Attributes$colspan(2)
								]),
							_List_fromArray(
								[
									elm$html$Html$text(
									'SPECIAL (' + (elm$core$String$fromInt(player.aC) + ' pts available)'))
								]))
						])),
					viewSpecialAttr(0),
					viewSpecialAttr(1),
					viewSpecialAttr(2),
					viewSpecialAttr(3),
					viewSpecialAttr(4),
					viewSpecialAttr(5),
					viewSpecialAttr(6)
				]));
	});
var author$project$Client$User$viewWorld = F2(
	function (c, world) {
		switch (world.$) {
			case 0:
				return elm$html$Html$text('You\'re not logged in!');
			case 1:
				return elm$html$Html$text('Loading');
			case 2:
				var err = world.a;
				return elm$html$Html$text('Error :(');
			default:
				var world_ = world.a;
				return A2(
					elm$html$Html$div,
					_List_Nil,
					_List_fromArray(
						[
							A2(author$project$Client$User$viewPlayer, c, world_.a0),
							A2(author$project$Client$User$viewOtherPlayers, c, world_)
						]));
		}
	});
var author$project$Client$User$viewLoggedIn = F2(
	function (c, user) {
		return _List_fromArray(
			[
				A2(author$project$Client$User$viewButtons, c, user.H),
				A2(author$project$Client$User$viewWorld, c, user.H),
				author$project$Client$User$viewMessages(user.Y)
			]);
	});
var author$project$Client$User$viewOtherPlayerAnonymous = function (_n0) {
	var name = _n0.ai;
	var hp = _n0.V;
	var xp = _n0.af;
	return A2(
		elm$html$Html$tr,
		_List_Nil,
		_List_fromArray(
			[
				A2(
				elm$html$Html$td,
				_List_Nil,
				_List_fromArray(
					[
						elm$html$Html$text(name)
					])),
				A2(
				elm$html$Html$td,
				_List_Nil,
				_List_fromArray(
					[
						elm$html$Html$text(
						elm$core$String$fromInt(hp))
					])),
				A2(
				elm$html$Html$td,
				_List_Nil,
				_List_fromArray(
					[
						elm$html$Html$text(
						elm$core$String$fromInt(
							author$project$Shared$Level$levelForXp(xp)))
					]))
			]));
};
var author$project$Client$User$viewPlayers = function (_n0) {
	var players = _n0.bG;
	return A2(
		elm$html$Html$div,
		_List_Nil,
		_List_fromArray(
			[
				A2(
				elm$html$Html$strong,
				_List_Nil,
				_List_fromArray(
					[
						elm$html$Html$text('Players:')
					])),
				elm$core$List$isEmpty(players) ? A2(
				elm$html$Html$div,
				_List_Nil,
				_List_fromArray(
					[
						elm$html$Html$text('There are none so far!')
					])) : A2(
				elm$html$Html$table,
				_List_Nil,
				A2(
					elm$core$List$cons,
					A2(
						elm$html$Html$tr,
						_List_Nil,
						_List_fromArray(
							[
								A2(
								elm$html$Html$th,
								_List_Nil,
								_List_fromArray(
									[
										elm$html$Html$text('Player')
									])),
								A2(
								elm$html$Html$th,
								_List_Nil,
								_List_fromArray(
									[
										elm$html$Html$text('HP')
									])),
								A2(
								elm$html$Html$th,
								_List_Nil,
								_List_fromArray(
									[
										elm$html$Html$text('Level')
									])),
								A2(elm$html$Html$th, _List_Nil, _List_Nil)
							])),
					A2(elm$core$List$map, author$project$Client$User$viewOtherPlayerAnonymous, players)))
			]));
};
var author$project$Client$User$viewAnonymousWorld = function (world) {
	switch (world.$) {
		case 0:
			return elm$html$Html$text('Eh, the game should probably ask the server for the world data - oops. Can you ping @janiczek?');
		case 1:
			return elm$html$Html$text('Loading');
		case 2:
			var err = world.a;
			return elm$html$Html$text('Error :(');
		default:
			var world_ = world.a;
			return author$project$Client$User$viewPlayers(world_);
	}
};
var author$project$Shared$Password$unwrapPlaintext = function (_n0) {
	var p = _n0;
	return p;
};
var elm$core$Basics$not = _Basics_not;
var elm$core$List$maybeCons = F3(
	function (f, mx, xs) {
		var _n0 = f(mx);
		if (!_n0.$) {
			var x = _n0.a;
			return A2(elm$core$List$cons, x, xs);
		} else {
			return xs;
		}
	});
var elm$core$List$filterMap = F2(
	function (f, xs) {
		return A3(
			elm$core$List$foldr,
			elm$core$List$maybeCons(f),
			_List_Nil,
			xs);
	});
var elm$core$String$isEmpty = function (string) {
	return string === '';
};
var elm$html$Html$input = _VirtualDom_node('input');
var elm$html$Html$Attributes$stringProperty = F2(
	function (key, string) {
		return A2(
			_VirtualDom_property,
			key,
			elm$json$Json$Encode$string(string));
	});
var elm$html$Html$Attributes$placeholder = elm$html$Html$Attributes$stringProperty('placeholder');
var elm$html$Html$Attributes$title = elm$html$Html$Attributes$stringProperty('title');
var elm$html$Html$Attributes$type_ = elm$html$Html$Attributes$stringProperty('type');
var elm$html$Html$Attributes$value = elm$html$Html$Attributes$stringProperty('value');
var elm$html$Html$Events$alwaysStop = function (x) {
	return _Utils_Tuple2(x, true);
};
var elm$virtual_dom$VirtualDom$MayStopPropagation = function (a) {
	return {$: 1, a: a};
};
var elm$html$Html$Events$stopPropagationOn = F2(
	function (event, decoder) {
		return A2(
			elm$virtual_dom$VirtualDom$on,
			event,
			elm$virtual_dom$VirtualDom$MayStopPropagation(decoder));
	});
var elm$json$Json$Decode$at = F2(
	function (fields, decoder) {
		return A3(elm$core$List$foldr, elm$json$Json$Decode$field, decoder, fields);
	});
var elm$html$Html$Events$targetValue = A2(
	elm$json$Json$Decode$at,
	_List_fromArray(
		['target', 'value']),
	elm$json$Json$Decode$string);
var elm$html$Html$Events$onInput = function (tagger) {
	return A2(
		elm$html$Html$Events$stopPropagationOn,
		'input',
		A2(
			elm$json$Json$Decode$map,
			elm$html$Html$Events$alwaysStop,
			A2(elm$json$Json$Decode$map, tagger, elm$html$Html$Events$targetValue)));
};
var author$project$Client$User$viewCredentialsForm = F3(
	function (c, _n0, maybeMessage) {
		var name = _n0.ai;
		var password = _n0.ak;
		var unmetRules = A2(
			elm$core$List$filterMap,
			elm$core$Basics$identity,
			_List_fromArray(
				[
					elm$core$String$isEmpty(name) ? elm$core$Maybe$Just('Name must not be empty') : elm$core$Maybe$Nothing,
					(elm$core$String$length(
					author$project$Shared$Password$unwrapPlaintext(password)) < 5) ? elm$core$Maybe$Just('Password must be 5 or more characters long') : elm$core$Maybe$Nothing
				]));
		var hasUnmetRules = !elm$core$List$isEmpty(unmetRules);
		var button = F2(
			function (route, label) {
				return A2(
					elm$html$Html$button,
					hasUnmetRules ? _List_fromArray(
						[
							elm$html$Html$Attributes$disabled(true),
							elm$html$Html$Attributes$title(
							A2(elm$core$String$join, '; ', unmetRules))
						]) : _List_fromArray(
						[
							A2(author$project$Client$User$onClickRequest, c, route)
						]),
					_List_fromArray(
						[
							elm$html$Html$text(label)
						]));
			});
		return A2(
			elm$html$Html$div,
			_List_Nil,
			_List_fromArray(
				[
					A2(
					elm$html$Html$input,
					_List_fromArray(
						[
							elm$html$Html$Events$onInput(c.bL),
							elm$html$Html$Attributes$value(name),
							elm$html$Html$Attributes$placeholder('Name')
						]),
					_List_Nil),
					A2(
					elm$html$Html$input,
					_List_fromArray(
						[
							elm$html$Html$Events$onInput(c.bM),
							elm$html$Html$Attributes$value(
							author$project$Shared$Password$unwrapPlaintext(password)),
							elm$html$Html$Attributes$type_('password'),
							elm$html$Html$Attributes$placeholder('Password')
						]),
					_List_Nil),
					A2(button, author$project$Server$Route$Signup, 'Signup'),
					A2(button, author$project$Server$Route$Login, 'Login'),
					A2(
					elm$core$Maybe$withDefault,
					elm$html$Html$text(''),
					A2(
						elm$core$Maybe$map,
						function (message) {
							return A2(
								elm$html$Html$div,
								_List_Nil,
								_List_fromArray(
									[
										elm$html$Html$text(message)
									]));
						},
						maybeMessage))
				]));
	});
var author$project$Client$User$viewLoggedOff = F4(
	function (config, world, form, maybeMessage) {
		return _List_fromArray(
			[
				A3(author$project$Client$User$viewCredentialsForm, config, form, maybeMessage),
				author$project$Client$User$viewAnonymousWorld(world)
			]);
	});
var author$project$Client$Main$view = function (model) {
	return {
		aE: function () {
			var _n0 = model.F;
			switch (_n0.$) {
				case 0:
					var world = _n0.a;
					var form = _n0.b;
					return A4(author$project$Client$User$viewLoggedOff, author$project$Client$Main$userConfig, world, form, elm$core$Maybe$Nothing);
				case 1:
					var world = _n0.a;
					var form = _n0.b;
					return A4(
						author$project$Client$User$viewLoggedOff,
						author$project$Client$Main$userConfig,
						world,
						form,
						elm$core$Maybe$Just('Signing up'));
				case 2:
					var error = _n0.a;
					var world = _n0.b;
					var form = _n0.c;
					return A4(
						author$project$Client$User$viewLoggedOff,
						author$project$Client$Main$userConfig,
						world,
						form,
						elm$core$Maybe$Just(
							author$project$Server$Route$handlers.ax.aJ(error)));
				case 3:
					var error = _n0.a;
					var world = _n0.b;
					var form = _n0.c;
					return A4(
						author$project$Client$User$viewLoggedOff,
						author$project$Client$Main$userConfig,
						world,
						form,
						elm$core$Maybe$Just(error));
				case 4:
					var world = _n0.a;
					var form = _n0.b;
					return A4(
						author$project$Client$User$viewLoggedOff,
						author$project$Client$Main$userConfig,
						world,
						form,
						elm$core$Maybe$Just('Logging in'));
				case 5:
					var error = _n0.a;
					var world = _n0.b;
					var form = _n0.c;
					return A4(
						author$project$Client$User$viewLoggedOff,
						author$project$Client$Main$userConfig,
						world,
						form,
						elm$core$Maybe$Just(
							author$project$Server$Route$handlers.as.aJ(error)));
				default:
					var loggedInUser = _n0.a;
					return A2(author$project$Client$User$viewLoggedIn, author$project$Client$Main$userConfig, loggedInUser);
			}
		}(),
		bR: 'NuAshworld'
	};
};
var elm$browser$Browser$External = function (a) {
	return {$: 1, a: a};
};
var elm$browser$Browser$Internal = function (a) {
	return {$: 0, a: a};
};
var elm$browser$Browser$Dom$NotFound = elm$core$Basics$identity;
var elm$core$Basics$never = function (_n0) {
	never:
	while (true) {
		var nvr = _n0;
		var $temp$_n0 = nvr;
		_n0 = $temp$_n0;
		continue never;
	}
};
var elm$core$Task$perform = F2(
	function (toMessage, task) {
		return elm$core$Task$command(
			A2(elm$core$Task$map, toMessage, task));
	});
var elm$core$String$slice = _String_slice;
var elm$core$String$dropLeft = F2(
	function (n, string) {
		return (n < 1) ? string : A3(
			elm$core$String$slice,
			n,
			elm$core$String$length(string),
			string);
	});
var elm$core$String$startsWith = _String_startsWith;
var elm$url$Url$Http = 0;
var elm$url$Url$Https = 1;
var elm$core$String$indexes = _String_indexes;
var elm$core$String$left = F2(
	function (n, string) {
		return (n < 1) ? '' : A3(elm$core$String$slice, 0, n, string);
	});
var elm$core$String$contains = _String_contains;
var elm$core$String$toInt = _String_toInt;
var elm$url$Url$Url = F6(
	function (protocol, host, port_, path, query, fragment) {
		return {aO: fragment, aQ: host, a_: path, a1: port_, a5: protocol, a6: query};
	});
var elm$url$Url$chompBeforePath = F5(
	function (protocol, path, params, frag, str) {
		if (elm$core$String$isEmpty(str) || A2(elm$core$String$contains, '@', str)) {
			return elm$core$Maybe$Nothing;
		} else {
			var _n0 = A2(elm$core$String$indexes, ':', str);
			if (!_n0.b) {
				return elm$core$Maybe$Just(
					A6(elm$url$Url$Url, protocol, str, elm$core$Maybe$Nothing, path, params, frag));
			} else {
				if (!_n0.b.b) {
					var i = _n0.a;
					var _n1 = elm$core$String$toInt(
						A2(elm$core$String$dropLeft, i + 1, str));
					if (_n1.$ === 1) {
						return elm$core$Maybe$Nothing;
					} else {
						var port_ = _n1;
						return elm$core$Maybe$Just(
							A6(
								elm$url$Url$Url,
								protocol,
								A2(elm$core$String$left, i, str),
								port_,
								path,
								params,
								frag));
					}
				} else {
					return elm$core$Maybe$Nothing;
				}
			}
		}
	});
var elm$url$Url$chompBeforeQuery = F4(
	function (protocol, params, frag, str) {
		if (elm$core$String$isEmpty(str)) {
			return elm$core$Maybe$Nothing;
		} else {
			var _n0 = A2(elm$core$String$indexes, '/', str);
			if (!_n0.b) {
				return A5(elm$url$Url$chompBeforePath, protocol, '/', params, frag, str);
			} else {
				var i = _n0.a;
				return A5(
					elm$url$Url$chompBeforePath,
					protocol,
					A2(elm$core$String$dropLeft, i, str),
					params,
					frag,
					A2(elm$core$String$left, i, str));
			}
		}
	});
var elm$url$Url$chompBeforeFragment = F3(
	function (protocol, frag, str) {
		if (elm$core$String$isEmpty(str)) {
			return elm$core$Maybe$Nothing;
		} else {
			var _n0 = A2(elm$core$String$indexes, '?', str);
			if (!_n0.b) {
				return A4(elm$url$Url$chompBeforeQuery, protocol, elm$core$Maybe$Nothing, frag, str);
			} else {
				var i = _n0.a;
				return A4(
					elm$url$Url$chompBeforeQuery,
					protocol,
					elm$core$Maybe$Just(
						A2(elm$core$String$dropLeft, i + 1, str)),
					frag,
					A2(elm$core$String$left, i, str));
			}
		}
	});
var elm$url$Url$chompAfterProtocol = F2(
	function (protocol, str) {
		if (elm$core$String$isEmpty(str)) {
			return elm$core$Maybe$Nothing;
		} else {
			var _n0 = A2(elm$core$String$indexes, '#', str);
			if (!_n0.b) {
				return A3(elm$url$Url$chompBeforeFragment, protocol, elm$core$Maybe$Nothing, str);
			} else {
				var i = _n0.a;
				return A3(
					elm$url$Url$chompBeforeFragment,
					protocol,
					elm$core$Maybe$Just(
						A2(elm$core$String$dropLeft, i + 1, str)),
					A2(elm$core$String$left, i, str));
			}
		}
	});
var elm$url$Url$fromString = function (str) {
	return A2(elm$core$String$startsWith, 'http://', str) ? A2(
		elm$url$Url$chompAfterProtocol,
		0,
		A2(elm$core$String$dropLeft, 7, str)) : (A2(elm$core$String$startsWith, 'https://', str) ? A2(
		elm$url$Url$chompAfterProtocol,
		1,
		A2(elm$core$String$dropLeft, 8, str)) : elm$core$Maybe$Nothing);
};
var elm$browser$Browser$application = _Browser_application;
var author$project$Client$Main$main = elm$browser$Browser$application(
	{bx: author$project$Client$Main$init, bC: author$project$Client$Main$UrlChanged, bD: author$project$Client$Main$UrlRequested, bP: author$project$Client$Main$subscriptions, bS: author$project$Client$Main$update, bU: author$project$Client$Main$view});
_Platform_export({'Client':{'Main':{'init':author$project$Client$Main$main(
	A2(
		elm$json$Json$Decode$andThen,
		function (serverEndpoint) {
			return elm$json$Json$Decode$succeed(
				{M: serverEndpoint});
		},
		A2(elm$json$Json$Decode$field, 'serverEndpoint', elm$json$Json$Decode$string)))(0)}}});}(this));