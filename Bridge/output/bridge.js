/**
 * @version   : 15.7.0 - Bridge.NET
 * @author    : Object.NET, Inc. http://bridge.net/
 * @date      : 2017-01-16
 * @copyright : Copyright 2008-2017 Object.NET, Inc. http://object.net/
 * @license   : See license.txt and https://github.com/bridgedotnet/Bridge/blob/master/LICENSE.md
 */

    // @source Init.js

(function (globals) {
    "use strict";

    // @source Core.js

    var core = {
        global: globals,

        emptyFn: function () { },

        identity: function (x) {
            return x;
        },

        geti: function (scope, name1, name2) {
            if (Bridge.hasValue(scope[name1])) {
                return name1;
            }

            return name2;
        },

        safe: function(fn) {
            try {
                return fn();
            } catch (ex) {
            }

            return false;
        },

        literal: function (type, obj) {
            obj.$getType = function () { return type };
            return obj;
        },

        isPlainObject: function (obj) {
            if (typeof obj == 'object' && obj !== null) {
                if (typeof Object.getPrototypeOf == 'function') {
                    var proto = Object.getPrototypeOf(obj);

                    return proto === Object.prototype || proto === null;
                }

                return Object.prototype.toString.call(obj) === '[object Object]';
            }

            return false;
        },

        toPlain: function (o) {
            if (!o || Bridge.isPlainObject(o) || typeof o != "object") {
                return o;
            }

            if (typeof o.toJSON == 'function') {
                return o.toJSON();
            }

            if (Bridge.isArray(o)) {
                var arr = [];

                for (var i = 0; i < o.length; i++) {
                    arr.push(Bridge.toPlain(o[i]));
                }

                return arr;
            }

            var newo = {},
                m;

            for (var key in o) {
                m = o[key];

                if (!Bridge.isFunction(m)) {
                    newo[key] = m;
                }
            }

            return newo;
        },

        ref: function (o, n) {
            if (Bridge.isArray(n)) {
                n = System.Array.toIndex(o, n);
            }

            var proxy = {};

            Object.defineProperty(proxy, "v", {
                get: function () {
                    return o[n];
                },

                set: function (value) {
                    o[n] = value;
                }
            });

            return proxy;
        },

        property: function (scope, name, v, statics) {
            scope[name] = v;

            var rs = name.charAt(0) === "$",
                cap = rs ? name.slice(1) : name,
                getName = "get" + cap,
                setName = "set" + cap,
                lastSep = name.lastIndexOf("$"),
                endsNum = lastSep > 0 && ((name.length - lastSep - 1) > 0) && !isNaN(parseInt(name.substr(lastSep + 1)));

            if (endsNum) {
                lastSep = name.substring(0, lastSep - 1).lastIndexOf("$");
            }

            if (lastSep > 0 && lastSep !== (name.length - 1)) {
                getName = name.substring(0, lastSep) + "get" + name.substr(lastSep + 1);
                setName = name.substring(0, lastSep) + "set" + name.substr(lastSep + 1);
            }

            scope[getName] = (function (name, scope, statics) {
                return statics ? function () {
                    return scope[name];
                } : function () {
                    return this[name];
                };
            })(name, scope, statics);

            scope[setName] = (function (name, scope, statics) {
                return statics ? function (value) {
                    scope[name] = value;
                } : function (value) {
                    this[name] = value;
                };
            })(name, scope, statics);
        },

        event: function (scope, name, v, statics) {
            scope[name] = v;

            var rs = name.charAt(0) === "$",
                cap = rs ? name.slice(1) : name,
                addName = "add" + cap,
                removeName = "remove" + cap,
                lastSep = name.lastIndexOf("$"),
                endsNum = lastSep > 0 && ((name.length - lastSep - 1) > 0) && !isNaN(parseInt(name.substr(lastSep + 1)));

            if (endsNum) {
                lastSep = name.substring(0, lastSep - 1).lastIndexOf("$");
            }

            if (lastSep > 0 && lastSep !== (name.length - 1)) {
                addName = name.substring(0, lastSep) + "add" + name.substr(lastSep + 1);
                removeName = name.substring(0, lastSep) + "remove" + name.substr(lastSep + 1);
            }

            scope[addName] = (function (name, scope, statics) {
                return statics ? function (value) {
                    scope[name] = Bridge.fn.combine(scope[name], value);
                } : function (value) {
                    this[name] = Bridge.fn.combine(this[name], value);
                };
            })(name, scope, statics);

            scope[removeName] = (function (name, scope, statics) {
                return statics ? function (value) {
                    scope[name] = Bridge.fn.remove(scope[name], value);
                } : function (value) {
                    this[name] = Bridge.fn.remove(this[name], value);
                };
            })(name, scope, statics);
        },

        createInstance: function (type, args) {
            if (type === System.Decimal) {
                return System.Decimal.Zero;
            }

            if (type === System.Int64) {
                return System.Int64.Zero;
            }

            if (type === System.UInt64) {
                return System.UInt64.Zero;
            }

            if (type === System.Double ||
                type === System.Single ||
                type === System.Byte ||
                type === System.SByte ||
                type === System.Int16 ||
                type === System.UInt16 ||
                type === System.Int32 ||
                type === System.UInt32 ||
                type === Bridge.Int) {
                return 0;
            }

            if (typeof (type.createInstance) === 'function') {
                return type.createInstance();
            } else if (typeof (type.getDefaultValue) === 'function') {
                return type.getDefaultValue();
            } else if (type === Boolean) {
                return false;
            } else if (type === Date) {
                return new Date(0);
            } else if (type === Number) {
                return 0;
            } else if (type === String) {
                return '';
            } else if (type && type.$literal) {
                return type.ctor();
            } else if (args && args.length > 0) {
                return Bridge.Reflection.applyConstructor(type, args);
            } else {
                return new type();
            }
        },

        clone: function (obj) {
            if (Bridge.isArray(obj)) {
                return System.Array.clone(obj);
            }

            if (Bridge.isString(obj)) {
                return obj;
            }

            var name;

            if (Bridge.isFunction(obj[name = "System$ICloneable$clone"])) {
                return obj[name]();
            }

            if (Bridge.is(obj, System.ICloneable)) {
                return obj.clone();
            }

            return null;
        },

        copy: function (to, from, keys, toIf) {
            if (typeof keys === "string") {
                keys = keys.split(/[,;\s]+/);
            }

            for (var name, i = 0, n = keys ? keys.length : 0; i < n; i++) {
                name = keys[i];

                if (toIf !== true || to[name] == undefined) {
                    if (Bridge.is(from[name], System.ICloneable)) {
                        to[name] = Bridge.clone(from[name]);
                    } else {
                        to[name] = from[name];
                    }
                }
            }

            return to;
        },

        get: function (t) {
            if (t && t.$staticInit !== null) {
                t.$staticInit();
            }

            return t;
        },

        ns: function (ns, scope) {
            var nsParts = ns.split("."),
                i = 0;

            if (!scope) {
                scope = Bridge.global;
            }

            for (i = 0; i < nsParts.length; i++) {
                if (typeof scope[nsParts[i]] === "undefined") {
                    scope[nsParts[i]] = {};
                }

                scope = scope[nsParts[i]];
            }

            return scope;
        },

        ready: function (fn, scope) {
            var delayfn = function () {
                if (scope) {
                    fn.apply(scope);
                } else {
                    fn();
                }
            };

            if (typeof Bridge.global.jQuery !== "undefined") {
                Bridge.global.jQuery(delayfn);
            } else {
                if (typeof Bridge.global.document === "undefined" || Bridge.global.document.readyState === "complete" || Bridge.global.document.readyState === "loaded") {
                    delayfn();
                } else {
                    Bridge.on("DOMContentLoaded", Bridge.global.document, delayfn);
                }
            }
        },

        on: function (event, elem, fn, scope) {
            var listenHandler = function (e) {
                var ret = fn.apply(scope || this, arguments);

                if (ret === false) {
                    e.stopPropagation();
                    e.preventDefault();
                }

                return (ret);
            };

            var attachHandler = function () {
                var ret = fn.call(scope || elem, Bridge.global.event);

                if (ret === false) {
                    Bridge.global.event.returnValue = false;
                    Bridge.global.event.cancelBubble = true;
                }

                return (ret);
            };

            if (elem.addEventListener) {
                elem.addEventListener(event, listenHandler, false);
            } else {
                elem.attachEvent("on" + event, attachHandler);
            }
        },

        addHash: function (v, r, m) {
            if (isNaN(r)) {
                r = 17;
            }

            if (isNaN(m)) {
                m = 23;
            }

            if (Bridge.isArray(v)) {
                for (var i = 0; i < v.length; i++) {
                    r = r + ((r * m | 0) + (v[i] == null ? 0 : Bridge.getHashCode(v[i]))) | 0;
                }

                return r;
            }

            return r = r + ((r * m | 0) + (v == null ? 0 : Bridge.getHashCode(v))) | 0;
        },

        getHashCode: function (value, safe, deep) {
            // In CLR: mutable object should keep on returning same value
            // Bridge.NET goals: make it deterministic (to make testing easier) without breaking CLR contracts
            //     for value types it returns deterministic values (f.e. for int 3 it returns 3)
            //     for reference types it returns random value

            if (Bridge.isEmpty(value, true)) {
                if (safe) {
                    return 0;
                }

                throw new System.InvalidOperationException("HashCode cannot be calculated for empty value");
            }

            if (deep !== false && value.hasOwnProperty("item1") && Bridge.isPlainObject(value)) {
                deep = true;
            }

            if (value.getHashCode && Bridge.isFunction(value.getHashCode) && !value.__insideHashCode && value.getHashCode.length === 0) {
                value.__insideHashCode = true;
                var r = value.getHashCode();

                delete value.__insideHashCode;

                return r;
            }

            if (Bridge.isBoolean(value)) {
                return value ? 1 : 0;
            }

            if (Bridge.isDate(value)) {
                return value.valueOf() & 0xFFFFFFFF;
            }

            if (value === Number.POSITIVE_INFINITY) {
                return 0x7FF00000;
            }

            if (value === Number.NEGATIVE_INFINITY) {
                return 0xFFF00000;
            }

            if (Bridge.isNumber(value)) {
                if (Math.floor(value) === value) {
                    return value;
                }

                value = value.toExponential();
            }

            if (Bridge.isString(value)) {
                var hash = 0,
                    i;

                for (i = 0; i < value.length; i++) {
                    hash = (((hash << 5) - hash) + value.charCodeAt(i)) & 0xFFFFFFFF;
                }

                return hash;
            }

            if (value.$$hashCode) {
                return value.$$hashCode;
            }

            if (deep && typeof value == "object") {
                var result = 0,
                    temp;

                for (var property in value) {
                    if (value.hasOwnProperty(property)) {
                        temp = Bridge.isEmpty(value[property], true) ? 0 : Bridge.getHashCode(value[property]);
                        result = 29 * result + temp;
                    }
                }

                if (result !== 0) {
                    value.$$hashCode = result;

                    return result;
                }
            }

            value.$$hashCode = (Math.random() * 0x100000000) | 0;

            return value.$$hashCode;
        },

        getDefaultValue: function (type) {
            if (type == null) {
                throw new System.ArgumentNullException("type");
            } else if ((type.getDefaultValue) && type.getDefaultValue.length === 0) {
                return type.getDefaultValue();
            } else if (type === Boolean) {
                return false;
            } else if (type === Date) {
                return new Date(-864e13);
            } else if (type === Number) {
                return 0;
            }

            return null;
        },

        getTypeAlias: function (obj) {
            var name = obj.$$name || Bridge.getTypeName(obj);

            return name.replace(/[\.\(\)\,]/g, "$");
        },

        getTypeName: function (obj) {
            return Bridge.Reflection.getTypeFullName(obj);
        },

        hasValue: function (obj) {
            return obj != null;
        },

        hasValue$1: function () {
            if (arguments.length === 0) {
                return false;
            }

            var i = 0;

            for (i; i < arguments.length; i++) {
                if (arguments[i] == null) {
                    return false;
                }
            }

            return true;
        },

        is: function (obj, type, ignoreFn, allowNull) {
            if (obj == null) {
                return !!allowNull;
            }

            var ctor = obj.constructor;
            if (type.constructor === Function && obj instanceof type || ctor === type) {
                return true;
            }

            var hasObjKind = ctor.$kind || ctor.$$inherits,
                hasTypeKind = type.$kind;
            if (hasObjKind || hasTypeKind) {
                var isInterface = type.$isInterface;

                if (isInterface) {
                    if (hasObjKind) {
                        if (ctor.$isArrayEnumerator) {
                            return System.Array.is(obj, type);
                        }

                        return type.isAssignableFrom ? type.isAssignableFrom(ctor) : Bridge.Reflection.getInterfaces(ctor).indexOf(type) >= 0;
                    }

                    if (Bridge.isArray(obj, ctor)) {
                        return System.Array.is(obj, type);
                    }

                    if (ctor === String) {
                        return System.String.is(obj, type);
                    }
                }

                if (ignoreFn !== true && type.$is) {
                    return type.$is(obj);
                }

                if (type.$literal) {
                    if (Bridge.isPlainObject(obj)) {
                        if (obj.$getType) {
                            return Bridge.Reflection.isAssignableFrom(type, obj.$getType());
                        }

                        return true;
                    }
                }

                return false;
            }

            var tt = typeof type;

            if (tt === "boolean") {
                return type;
            }

            if (tt === "string") {
                type = Bridge.unroll(type);
            }

            if (tt === "function" && (Bridge.getType(obj).prototype instanceof type)) {
                return true;
            }

            if (ignoreFn !== true) {
                if (typeof (type.$is) === "function") {
                    return type.$is(obj);
                }

                if (typeof (type.isAssignableFrom) === "function") {
                    return type.isAssignableFrom(Bridge.getType(obj));
                }
            }

            if (Bridge.isArray(obj)) {
                return System.Array.is(obj, type);
            }

            return tt === "object" && ((ctor === type) || (obj instanceof type));
        },

        as: function (obj, type, allowNull) {
            return Bridge.is(obj, type, false, allowNull) ? obj : null;
        },

        cast: function (obj, type, allowNull) {
            if (obj == null) {
                return obj;
            }

            var result = Bridge.is(obj, type, false, allowNull) ? obj : null;

            if (result === null) {
                throw new System.InvalidCastException("Unable to cast type " + (obj ? Bridge.getTypeName(obj) : "'null'") + " to type " + Bridge.getTypeName(type));
            }

            return result;
        },

        apply: function (obj, values) {
            var names = Bridge.getPropertyNames(values, true),
                i;

            for (i = 0; i < names.length; i++) {
                var name = names[i];

                if (typeof obj[name] === "function" && typeof values[name] !== "function") {
                    obj[name](values[name]);
                } else {
                    obj[name] = values[name];
                }
            }

            return obj;
        },

        merge: function (to, from, callback, elemFactory) {
            if (to == null) {
                return from;
            }

            // Maps instance of plain JS value or Object into Bridge object.
            // Used for deserialization. Proper deserialization requires reflection that is currently not supported in Bridge.
            // It currently is only capable to deserialize:
            // -instance of single class or primitive
            // -array of primitives
            // -array of single class
            if (to instanceof System.Decimal && Bridge.isNumber(from)) {
                return new System.Decimal(from);
            }

            if (to instanceof System.Int64 && Bridge.isNumber(from)) {
                return new System.Int64(from);
            }

            if (to instanceof System.UInt64 && Bridge.isNumber(from)) {
                return new System.UInt64(from);
            }

            if (to instanceof Boolean || Bridge.isBoolean(to) ||
                to instanceof Number || Bridge.isNumber(to) ||
                to instanceof String || Bridge.isString(to) ||
                to instanceof Function || Bridge.isFunction(to) ||
                to instanceof Date || Bridge.isDate(to) ||
                Bridge.isNumber(to) ||
                to instanceof System.Double ||
                to instanceof System.Single ||
                to instanceof System.Byte ||
                to instanceof System.SByte ||
                to instanceof System.Int16 ||
                to instanceof System.UInt16 ||
                to instanceof System.Int32 ||
                to instanceof System.UInt32 ||
                to instanceof Bridge.Int ||
                to instanceof System.Decimal) {
                return from;
            }

            var key,
                i,
                value,
                toValue,
                fn;

            if (Bridge.isArray(from) && Bridge.isFunction(to.add || to.push)) {
                fn = Bridge.isArray(to) ? to.push : to.add;

                for (i = 0; i < from.length; i++) {
                    var item = from[i];

                    if (!Bridge.isArray(item)) {
                        item = [typeof elemFactory === 'undefined' ? item : Bridge.merge(elemFactory(), item)];
                    }

                    fn.apply(to, item);
                }
            } else {
                for (key in from) {
                    value = from[key];

                    if (typeof to[key] === "function") {
                        if (key.match(/^\s*get[A-Z]/)) {
                            Bridge.merge(to[key](), value);
                        } else {
                            to[key](value);
                        }
                    } else {
                        var setter1 = "set" + key.charAt(0).toUpperCase() + key.slice(1),
                            setter2 = "set" + key,
                            getter;

                        if (typeof to[setter1] === "function" && typeof value !== "function") {
                            getter = "g" + setter1.slice(1);
                            if (typeof to[getter] === "function") {
                                to[setter1](Bridge.merge(to[getter](), value));
                            } else {
                                to[setter1](value);
                            }
                        } else if (typeof to[setter2] === "function" && typeof value !== "function") {
                            getter = "g" + setter2.slice(1);
                            if (typeof to[getter] === "function") {
                                to[setter2](Bridge.merge(to[getter](), value));
                            } else {
                                to[setter2](value);
                            }
                        } else if (value && value.constructor === Object && to[key]) {
                            toValue = to[key];
                            Bridge.merge(toValue, value);
                        } else {
                            to[key] = Bridge.merge(to[key], value);
                        }
                    }
                }
            }

            if (callback) {
                callback.call(to, to);
            }

            return to;
        },

        getEnumerator: function (obj, fnName, T) {
            if (typeof obj === "string") {
                obj = System.String.toCharArray(obj);
            }

            if (arguments.length === 2 && Bridge.isFunction(fnName)) {
                T = fnName;
                fnName = null;
            }

            if (fnName && obj && obj[fnName]) {
                return obj[fnName].call(obj);
            }

            if (!T && obj && obj.getEnumerator) {
                return obj.getEnumerator();
            }

            var name;

            if (T && Bridge.isFunction(obj[name = "System$Collections$Generic$IEnumerable$1$" + Bridge.getTypeAlias(T) + "$getEnumerator"])) {
                return obj[name]();
            }

            if (Bridge.isFunction(obj[name = "System$Collections$IEnumerable$getEnumerator"])) {
                return obj[name]();
            }

            if (T && obj && obj.getEnumerator) {
                return obj.getEnumerator();
            }

            if ((Object.prototype.toString.call(obj) === "[object Array]") ||
                (obj && Bridge.isDefined(obj.length))) {
                return new Bridge.ArrayEnumerator(obj, T);
            }

            throw new System.InvalidOperationException("Cannot create enumerator");
        },

        getPropertyNames: function (obj, includeFunctions) {
            var names = [],
                name;

            for (name in obj) {
                if (includeFunctions || typeof obj[name] !== "function") {
                    names.push(name);
                }
            }

            return names;
        },

        isDefined: function (value, noNull) {
            return typeof value !== "undefined" && (noNull ? value !== null : true);
        },

        isEmpty: function (value, allowEmpty) {
            return (typeof value === "undefined" || value === null) || (!allowEmpty ? value === "" : false) || ((!allowEmpty && Bridge.isArray(value)) ? value.length === 0 : false);
        },

        toArray: function (ienumerable) {
            var i,
                item,
                len,
                result = [];

            if (Bridge.isArray(ienumerable)) {
                for (i = 0, len = ienumerable.length; i < len; ++i) {
                    result.push(ienumerable[i]);
                }
            } else {
                i = Bridge.getEnumerator(ienumerable);

                while (i.moveNext()) {
                    item = i.getCurrent();
                    result.push(item);
                }
            }

            return result;
        },

        toList: function (ienumerable, T) {
            return new (System.Collections.Generic.List$1(T || Object))(ienumerable);
        },

        arrayTypes: [globals.Array, globals.Uint8Array, globals.Int8Array, globals.Int16Array, globals.Uint16Array, globals.Int32Array, globals.Uint32Array, globals.Float32Array, globals.Float64Array, globals.Uint8ClampedArray],

        isArray: function (obj, ctor) {
            var c = ctor || (obj != null ? obj.constructor : null);

            if (!c) {
                return false;
            }

            return Bridge.arrayTypes.indexOf(c) >= 0 || c.$isArray;
        },

        isFunction: function (obj) {
            return typeof (obj) === "function";
        },

        isDate: function (obj) {
            return Object.prototype.toString.call(obj) === "[object Date]";
        },

        isNull: function (value) {
            return (value === null) || (value === undefined);
        },

        isBoolean: function (value) {
            return typeof value === "boolean";
        },

        isNumber: function (value) {
            return typeof value === "number" && isFinite(value);
        },

        isString: function (value) {
            return typeof value === "string";
        },

        unroll: function (value) {
            var d = value.split("."),
                o = Bridge.global[d[0]],
                i = 1;

            for (i; i < d.length; i++) {
                if (!o) {
                    return null;
                }

                o = o[d[i]];
            }

            return o;
        },

        referenceEquals: function (a, b) {
            return Bridge.hasValue(a) ? a === b : !Bridge.hasValue(b);
        },

        staticEquals: function (a, b) {
            if (!Bridge.hasValue(a)) {
                return !Bridge.hasValue(b);
            }

            return Bridge.hasValue(b) ? Bridge.equals(a, b) : false;
        },

        equals: function (a, b) {
            if (a == null && b == null) {
                return true;
            }

            if (a && Bridge.isFunction(a.equals) && a.equals.length === 1) {
                return a.equals(b);
            }

            if (b && Bridge.isFunction(b.equals) && b.equals.length === 1) {
                return b.equals(a);
            } else if (Bridge.isDate(a) && Bridge.isDate(b)) {
                return a.valueOf() === b.valueOf();
            } else if (Bridge.isNull(a) && Bridge.isNull(b)) {
                return true;
            } else if (Bridge.isNull(a) !== Bridge.isNull(b)) {
                return false;
            }

            var eq = a === b;

            if (!eq && typeof a === "object" && typeof b === "object" && a !== null && b !== null && a.$kind === "struct" && b.$kind === "struct" && a.$$name === b.$$name) {
                return Bridge.getHashCode(a) === Bridge.getHashCode(b) && Bridge.objectEquals(a, b);
            }

            if (!eq && a && b && a.hasOwnProperty("item1") && Bridge.isPlainObject(a) && b.hasOwnProperty("item1") && Bridge.isPlainObject(b)) {
                return Bridge.objectEquals(a, b);
            }

            return eq;
        },

        objectEquals: function (a, b) {
            Bridge.$$leftChain = [];
            Bridge.$$rightChain = [];

            var result = Bridge.deepEquals(a, b);

            delete Bridge.$$leftChain;
            delete Bridge.$$rightChain;

            return result;
        },

        deepEquals: function (a, b) {
            if (typeof a === "object" && typeof b === "object") {
                if (a === b) {
                    return true;
                }

                if (Bridge.$$leftChain.indexOf(a) > -1 || Bridge.$$rightChain.indexOf(b) > -1) {
                    return false;
                }

                var p;

                for (p in b) {
                    if (b.hasOwnProperty(p) !== a.hasOwnProperty(p)) {
                        return false;
                    } else if (typeof b[p] !== typeof a[p]) {
                        return false;
                    }
                }

                for (p in a) {
                    if (b.hasOwnProperty(p) !== a.hasOwnProperty(p)) {
                        return false;
                    } else if (typeof a[p] !== typeof b[p]) {
                        return false;
                    }

                    if (a[p] === b[p]) {
                        continue;
                    } else if (typeof (a[p]) === "object") {
                        Bridge.$$leftChain.push(a);
                        Bridge.$$rightChain.push(b);

                        if (!Bridge.deepEquals(a[p], b[p])) {
                            return false;
                        }

                        Bridge.$$leftChain.pop();
                        Bridge.$$rightChain.pop();
                    } else {
                        if (!Bridge.equals(a[p], b[p])) {
                            return false;
                        }
                    }
                }

                return true;
            } else {
                return Bridge.equals(a, b);
            }
        },

        compare: function (a, b, safe, T) {
            if (!Bridge.isDefined(a, true)) {
                if (safe) {
                    return 0;
                }

                throw new System.NullReferenceException();
            } else if (Bridge.isNumber(a) || Bridge.isString(a) || Bridge.isBoolean(a)) {
                if (Bridge.isString(a) && !Bridge.hasValue(b)) {
                    return 1;
                }

                return a < b ? -1 : (a > b ? 1 : 0);
            } else if (Bridge.isDate(a)) {
                return Bridge.compare(a.valueOf(), b.valueOf());
            }

            var name;

            if (T && Bridge.isFunction(a[name = "System$IComparable$1$" + Bridge.getTypeAlias(T) + "$compareTo"])) {
                return a[name](b);
            }

            if (Bridge.isFunction(a[name = "System$IComparable$compareTo"])) {
                return a[name](b);
            }

            if (Bridge.isFunction(a.compareTo)) {
                return a.compareTo(b);
            }

            if (T && Bridge.isFunction(b[name = "System$IComparable$1$" + Bridge.getTypeAlias(T) + "$compareTo"])) {
                return -b[name](a);
            }

            if (Bridge.isFunction(b[name = "System$IComparable$compareTo"])) {
                return -b[name](a);
            }

            if (Bridge.isFunction(b.compareTo)) {
                return -b.compareTo(a);
            }

            if (safe) {
                return 0;
            }

            throw new System.Exception("Cannot compare items");
        },

        equalsT: function (a, b, T) {
            if (!Bridge.isDefined(a, true)) {
                throw new System.NullReferenceException();
            } else if (Bridge.isNumber(a) || Bridge.isString(a) || Bridge.isBoolean(a)) {
                return a === b;
            } else if (Bridge.isDate(a)) {
                return a.valueOf() === b.valueOf();
            }

            var name;

            if (T && a != null && Bridge.isFunction(a[name = "System$IEquatable$1$" + Bridge.getTypeAlias(T) + "$equalsT"])) {
                return a[name](b);
            }

            if (T && b != null && Bridge.isFunction(b[name = "System$IEquatable$1$" + Bridge.getTypeAlias(T) + "$equalsT"])) {
                return b[name](a);
            }

            return a.equalsT ? a.equalsT(b) : b.equalsT(a);
        },

        format: function (obj, formatString, provider) {
            if (Bridge.isNumber(obj)) {
                return Bridge.Int.format(obj, formatString, provider);
            } else if (Bridge.isDate(obj)) {
                return Bridge.Date.format(obj, formatString, provider);
            }

            var name;

            if (Bridge.isFunction(obj[name = "System$IFormattable$format"])) {
                return obj[name](formatString, provider);
            }

            return obj.format(formatString, provider);
        },

        getType: function (instance, T) {
            if (instance == null) {
                throw new System.NullReferenceException("instance is null");
            }

            if (T && Bridge.Reflection.getBaseType(T) === Object) {
                return T;
            }

            if (typeof (instance) === "number") {
                if (!isNaN(instance) && isFinite(instance) && Math.floor(instance, 0) === instance) {
                    return System.Int32;
                } else {
                    return System.Double;
                }
            }

            if (instance.$type) {
                return instance.$type;
            }

            if (instance.$getType) {
                return instance.$getType();
            }

            try {
                return instance.constructor;
            } catch (ex) {
                return Object;
            }
        },

        isLower: function (c) {
            var s = String.fromCharCode(c);

            return s === s.toLowerCase() && s !== s.toUpperCase();
        },

        isUpper: function (c) {
            var s = String.fromCharCode(c);

            return s !== s.toLowerCase() && s === s.toUpperCase();
        },

        coalesce: function (a, b) {
            return Bridge.hasValue(a) ? a : b;
        },

        fn: {
            equals: function (fn) {
                if (this === fn) {
                    return true;
                }

                if (fn == null || (this.constructor !== fn.constructor)) {
                    return false;
                }

                return this.equals === fn.equals && this.$method === fn.$method && this.$scope === fn.$scope;
            },

            call: function (obj, fnName) {
                var args = Array.prototype.slice.call(arguments, 2);

                obj = obj || Bridge.global;

                return obj[fnName].apply(obj, args);
            },

            makeFn: function (fn, length) {
                switch (length) {
                    case 0:
                        return function () {
                            return fn.apply(this, arguments);
                        };
                    case 1:
                        return function (a) {
                            return fn.apply(this, arguments);
                        };
                    case 2:
                        return function (a, b) {
                            return fn.apply(this, arguments);
                        };
                    case 3:
                        return function (a, b, c) {
                            return fn.apply(this, arguments);
                        };
                    case 4:
                        return function (a, b, c, d) {
                            return fn.apply(this, arguments);
                        };
                    case 5:
                        return function (a, b, c, d, e) {
                            return fn.apply(this, arguments);
                        };
                    case 6:
                        return function (a, b, c, d, e, f) {
                            return fn.apply(this, arguments);
                        };
                    case 7:
                        return function (a, b, c, d, e, f, g) {
                            return fn.apply(this, arguments);
                        };
                    case 8:
                        return function (a, b, c, d, e, f, g, h) {
                            return fn.apply(this, arguments);
                        };
                    case 9:
                        return function (a, b, c, d, e, f, g, h, i) {
                            return fn.apply(this, arguments);
                        };
                    case 10:
                        return function (a, b, c, d, e, f, g, h, i, j) {
                            return fn.apply(this, arguments);
                        };
                    case 11:
                        return function (a, b, c, d, e, f, g, h, i, j, k) {
                            return fn.apply(this, arguments);
                        };
                    case 12:
                        return function (a, b, c, d, e, f, g, h, i, j, k, l) {
                            return fn.apply(this, arguments);
                        };
                    case 13:
                        return function (a, b, c, d, e, f, g, h, i, j, k, l, m) {
                            return fn.apply(this, arguments);
                        };
                    case 14:
                        return function (a, b, c, d, e, f, g, h, i, j, k, l, m, n) {
                            return fn.apply(this, arguments);
                        };
                    case 15:
                        return function (a, b, c, d, e, f, g, h, i, j, k, l, m, n, o) {
                            return fn.apply(this, arguments);
                        };
                    case 16:
                        return function (a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p) {
                            return fn.apply(this, arguments);
                        };
                    case 17:
                        return function (a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q) {
                            return fn.apply(this, arguments);
                        };
                    case 18:
                        return function (a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r) {
                            return fn.apply(this, arguments);
                        };
                    case 19:
                        return function (a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s) {
                            return fn.apply(this, arguments);
                        };
                    default:
                        return function (a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t) {
                            return fn.apply(this, arguments);
                        };
                }
            },

            cacheBind: function (obj, method, args, appendArgs) {
                return Bridge.fn.bind(obj, method, args, appendArgs, true);
            },

            bind: function (obj, method, args, appendArgs, cache) {
                if (method && method.$method === method && method.$scope === obj) {
                    return method;
                }

                if (obj && cache && obj.$$bind) {
                    for (var i = 0; i < obj.$$bind.length; i++) {
                        if (obj.$$bind[i].$method === method) {
                            return obj.$$bind[i];
                        }
                    }
                }

                var fn;

                if (arguments.length === 2) {
                    fn = Bridge.fn.makeFn(function () {
                        Bridge.caller.unshift(this);

                        var result = method.apply(obj, arguments);

                        Bridge.caller.shift(this);

                        return result;
                    }, method.length);
                } else {
                    fn = Bridge.fn.makeFn(function () {
                        var callArgs = args || arguments;

                        if (appendArgs === true) {
                            callArgs = Array.prototype.slice.call(arguments, 0);
                            callArgs = callArgs.concat(args);
                        } else if (typeof appendArgs === "number") {
                            callArgs = Array.prototype.slice.call(arguments, 0);

                            if (appendArgs === 0) {
                                callArgs.unshift.apply(callArgs, args);
                            } else if (appendArgs < callArgs.length) {
                                callArgs.splice.apply(callArgs, [appendArgs, 0].concat(args));
                            } else {
                                callArgs.push.apply(callArgs, args);
                            }
                        }
                        Bridge.caller.unshift(this);

                        var result = method.apply(obj, callArgs);

                        Bridge.caller.shift(this);

                        return result;
                    }, method.length);
                }

                if (obj && cache) {
                    obj.$$bind = obj.$$bind || [];
                    obj.$$bind.push(fn);
                }

                fn.$method = method;
                fn.$scope = obj;
                fn.equals = Bridge.fn.equals;

                return fn;
            },

            bindScope: function (obj, method) {
                var fn = Bridge.fn.makeFn(function () {
                    var callArgs = Array.prototype.slice.call(arguments, 0);

                    callArgs.unshift.apply(callArgs, [obj]);

                    Bridge.caller.unshift(this);

                    var result = method.apply(obj, callArgs);

                    Bridge.caller.shift(this);

                    return result;
                }, method.length);

                fn.$method = method;
                fn.$scope = obj;
                fn.equals = Bridge.fn.equals;

                return fn;
            },

            $build: function (handlers) {
                var fn = function () {
                    var list = fn.$invocationList,
                        result = null,
                        i,
                        handler;

                    for (i = 0; i < list.length; i++) {
                        handler = list[i];
                        result = handler.apply(null, arguments);
                    }

                    return result;
                };

                fn.$invocationList = handlers ? Array.prototype.slice.call(handlers, 0) : [];

                if (fn.$invocationList.length === 0) {
                    return null;
                }

                return fn;
            },

            combine: function (fn1, fn2) {
                if (!fn1 || !fn2) {
                    return fn1 || fn2;
                }

                var list1 = fn1.$invocationList ? fn1.$invocationList : [fn1],
                    list2 = fn2.$invocationList ? fn2.$invocationList : [fn2];

                return Bridge.fn.$build(list1.concat(list2));
            },

            getInvocationList: function () {
            },

            remove: function (fn1, fn2) {
                if (!fn1 || !fn2) {
                    return fn1 || null;
                }

                var list1 = fn1.$invocationList ? fn1.$invocationList : [fn1],
                    list2 = fn2.$invocationList ? fn2.$invocationList : [fn2],
                    result = [],
                    exclude,
                    i, j;

                for (i = list1.length - 1; i >= 0; i--) {
                    exclude = false;

                    for (j = 0; j < list2.length; j++) {
                        if (list1[i] === list2[j] ||
                            ((list1[i].$method && (list1[i].$method === list2[j].$method)) && (list1[i].$scope && (list1[i].$scope === list2[j].$scope)))) {
                            exclude = true;

                            break;
                        }
                    }

                    if (!exclude) {
                        result.push(list1[i]);
                    }
                }

                result.reverse();

                return Bridge.fn.$build(result);
            }
        },

        sleep: function (ms, timeout) {
            if (Bridge.hasValue(timeout)) {
                ms = timeout.getTotalMilliseconds();
            }

            if (isNaN(ms) || ms < -1 || ms > 2147483647) {
                throw new System.ArgumentOutOfRangeException("timeout", "Number must be either non-negative and less than or equal to Int32.MaxValue or -1");
            }

            if (ms == -1) {
                ms = 2147483647;
            }

            var start = new Date().getTime();

            while ((new Date().getTime() - start) < ms) {
                if ((new Date().getTime() - start) > 2147483647) {
                    break;
                }
            }
        },

        getMetadata: function (t) {
            var m = t.$getMetadata ? t.$getMetadata() : t.$metadata;

            return m;
        }
    };

    globals.Bridge = core;
    globals.Bridge.caller = [];

    globals.System = {};
    globals.System.Diagnostics = {};
    globals.System.Diagnostics.Contracts = {};
    globals.System.Threading = {};

    // @source String.js

    var string = {
        is: function (obj, type) {
            if (!Bridge.isString(obj)) {
                return false;
            }

            if ((obj.constructor === type) || (obj instanceof type)) {
                return true;
            }

            if (type === System.ICloneable ||
                type === System.Collections.IEnumerable ||
                type === System.Collections.Generic.IEnumerable$1(System.Char) ||
                type === System.IComparable$1(String) ||
                type === System.IEquatable$1(String)) {
                return true;
            }

            return false;
        },

        lastIndexOf: function (s, search, startIndex, count) {
            var index = s.lastIndexOf(search, startIndex);

            return (index < (startIndex - count + 1)) ? -1 : index;
        },

        lastIndexOfAny: function (s, chars, startIndex, count) {
            var length = s.length;

            if (!length) {
                return -1;
            }

            chars = String.fromCharCode.apply(null, chars);
            startIndex = startIndex || length - 1;
            count = count || length;

            var endIndex = startIndex - count + 1;

            if (endIndex < 0) {
                endIndex = 0;
            }

            for (var i = startIndex; i >= endIndex; i--) {
                if (chars.indexOf(s.charAt(i)) >= 0) {
                    return i;
                }
            }

            return -1;
        },

        isNullOrWhiteSpace: function (s) {
            if (!s) {
                return true;
            }

            return System.Char.isWhiteSpace(s);
        },

        isNullOrEmpty: function (s) {
            return !s;
        },

        fromCharCount: function (c, count) {
            if (count >= 0) {
                return String(Array(count + 1).join(String.fromCharCode(c)));
            } else {
                throw new System.ArgumentOutOfRangeException("count", "cannot be less than zero");
            }
        },

        format: function (format) {
            return System.String._format(System.Globalization.CultureInfo.getCurrentCulture(), format, Array.prototype.slice.call(arguments, 1));
        },

        formatProvider: function (provider, format) {
            return System.String._format(provider, format, Array.prototype.slice.call(arguments, 2));
        },

        _format: function (provider, format, values) {
            var me = this,
                _formatRe = /(\{+)((\d+|[a-zA-Z_$]\w+(?:\.[a-zA-Z_$]\w+|\[\d+\])*)(?:\,(-?\d*))?(?:\:([^\}]*))?)(\}+)|(\{+)|(\}+)/g,
                args = values,
                fn = this.decodeBraceSequence;

            return format.replace(_formatRe, function (m, openBrace, elementContent, index, align, format, closeBrace, repeatOpenBrace, repeatCloseBrace) {
                if (repeatOpenBrace) {
                    return fn(repeatOpenBrace);
                }

                if (repeatCloseBrace) {
                    return fn(repeatCloseBrace);
                }

                if (openBrace.length % 2 === 0 || closeBrace.length % 2 === 0) {
                    return fn(openBrace) + elementContent + fn(closeBrace);
                }

                return fn(openBrace, true) + me.handleElement(provider, index, align, format, args) + fn(closeBrace, true);
            });
        },

        handleElement: function (provider, index, alignment, formatStr, args) {
            var value;

            index = parseInt(index, 10);

            if (index > args.length - 1) {
                throw new System.FormatException("Input string was not in a correct format.");
            }

            value = args[index];

            if (value == null) {
                value = "";
            }

            if (formatStr && Bridge.is(value, System.IFormattable)) {
                value = Bridge.format(value, formatStr, provider);
            } else {
                value = "" + value;
            }

            if (alignment) {
                alignment = parseInt(alignment, 10);

                if (!Bridge.isNumber(alignment)) {
                    alignment = null;
                }
            }

            return System.String.alignString(value.toString(), alignment);
        },

        decodeBraceSequence: function (braces, remove) {
            return braces.substr(0, (braces.length + (remove ? 0 : 1)) / 2);
        },

        alignString: function (str, alignment, pad, dir, cut) {
            if (str == null || !alignment) {
                return str;
            }

            if (!pad) {
                pad = " ";
            }

            if (Bridge.isNumber(pad)) {
                pad = String.fromCharCode(pad);
            }

            if (!dir) {
                dir = alignment < 0 ? 1 : 2;
            }

            alignment = Math.abs(alignment);

            if (cut && (str.length > alignment))
            {
                str = str.substring(0, alignment);
            }

            if (alignment + 1 >= str.length) {
                switch (dir) {
                    case 2:
                        str = Array(alignment + 1 - str.length).join(pad) + str;
                        break;

                    case 3:
                        var padlen = alignment - str.length,
                            right = Math.ceil(padlen / 2),
                            left = padlen - right;

                        str = Array(left + 1).join(pad) + str + Array(right + 1).join(pad);
                        break;

                    case 1:
                    default:
                        str = str + Array(alignment + 1 - str.length).join(pad);
                        break;
                }
            }

            return str;
        },

        startsWith: function (str, prefix) {
            if (!prefix.length) {
                return true;
            }

            if (prefix.length > str.length) {
                return false;
            }

            prefix = System.String.escape(prefix);

            return str.match("^" + prefix) !== null;
        },

        endsWith: function (str, suffix) {
            if (!suffix.length) {
                return true;
            }

            if (suffix.length > str.length) {
                return false;
            }

            suffix = System.String.escape(suffix);

            return str.match(suffix + "$") !== null;
        },

        contains: function (str, value) {
            if (value == null) {
                throw new System.ArgumentNullException();
            }

            if (str == null) {
                return false;
            }

            return str.indexOf(value) > -1;
        },

        indexOfAny: function (str, anyOf) {
            if (anyOf == null) {
                throw new System.ArgumentNullException();
            }

            if (str == null || str === "") {
                return -1;
            }

            var startIndex = (arguments.length > 2) ? arguments[2] : 0;

            if (startIndex < 0) {
                throw new System.ArgumentOutOfRangeException("startIndex", "startIndex cannot be less than zero");
            }

            var length = (arguments.length > 3) ? arguments[3] : str.length - startIndex;

            if (length < 0) {
                throw new System.ArgumentOutOfRangeException("length", "must be non-negative");
            }

            if (length > str.length - startIndex) {
                throw new System.ArgumentOutOfRangeException("Index and length must refer to a location within the string");
            }

            var s = str.substr(startIndex, length);

            for (var i = 0; i < anyOf.length; i++) {
                var c = String.fromCharCode(anyOf[i]),
                    index = s.indexOf(c);

                if (index > -1) {
                    return index + startIndex;
                }
            }

            return -1;
        },

        indexOf: function (str, value) {
            if (value == null) {
                throw new System.ArgumentNullException();
            }

            if (str == null || str === "") {
                return -1;
            }

            var startIndex = (arguments.length > 2) ? arguments[2] : 0;

            if (startIndex < 0 || startIndex > str.length) {
                throw new System.ArgumentOutOfRangeException("startIndex", "startIndex cannot be less than zero and must refer to a location within the string");
            }

            if (value === "") {
                return (arguments.length > 2) ? startIndex : 0;
            }

            var length = (arguments.length > 3) ? arguments[3] : str.length - startIndex;

            if (length < 0) {
                throw new System.ArgumentOutOfRangeException("length", "must be non-negative");
            }

            if (length > str.length - startIndex) {
                throw new System.ArgumentOutOfRangeException("Index and length must refer to a location within the string");
            }

            var s = str.substr(startIndex, length),
                index = (arguments.length === 5 && arguments[4] % 2 !== 0) ? s.toLocaleUpperCase().indexOf(value.toLocaleUpperCase()) : s.indexOf(value);

            if (index > -1) {
                if (arguments.length === 5) {
                    // StringComparison
                    return (System.String.compare(value, s.substr(index, value.length), arguments[4]) === 0) ? index + startIndex : -1;
                } else {
                    return index + startIndex;
                }
            }

            return -1;
        },

        equals: function () {
            return System.String.compare.apply(this, arguments) === 0;
        },

        compare: function (strA, strB) {
            if (strA == null) {
                return (strB == null) ? 0 : -1;
            }

            if (strB == null) {
                return 1;
            }

            if (arguments.length >= 3) {
                if (!Bridge.isBoolean(arguments[2])) {
                    // StringComparison
                    switch (arguments[2]) {
                        case 1: // CurrentCultureIgnoreCase
                            return strA.localeCompare(strB, System.Globalization.CultureInfo.getCurrentCulture().name, {
                                sensitivity: "accent"
                            });
                        case 2: // InvariantCulture
                            return strA.localeCompare(strB, System.Globalization.CultureInfo.invariantCulture.name);
                        case 3: // InvariantCultureIgnoreCase
                            return strA.localeCompare(strB, System.Globalization.CultureInfo.invariantCulture.name, {
                                sensitivity: "accent"
                            });
                        case 4: // Ordinal
                            return (strA === strB) ? 0 : ((strA > strB) ? 1 : -1);
                        case 5: // OrdinalIgnoreCase
                            return (strA.toUpperCase() === strB.toUpperCase()) ? 0 : ((strA.toUpperCase() > strB.toUpperCase()) ? 1 : -1);
                        case 0: // CurrentCulture
                        default:
                            break;
                    }
                } else {
                    // ignoreCase
                    if (arguments[2]) {
                        strA = strA.toLocaleUpperCase();
                        strB = strB.toLocaleUpperCase();
                    }

                    if (arguments.length === 4) {
                        // CultureInfo
                        return strA.localeCompare(strB, arguments[3].name);
                    }
                }
            }

            return strA.localeCompare(strB);
        },

        toCharArray: function (str, startIndex, length) {
            if (startIndex < 0 || startIndex > str.length || startIndex > str.length - length) {
                throw new System.ArgumentOutOfRangeException("startIndex", "startIndex cannot be less than zero and must refer to a location within the string");
            }

            if (length < 0) {
                throw new System.ArgumentOutOfRangeException("length", "must be non-negative");
            }

            if (!Bridge.hasValue(startIndex)) {
                startIndex = 0;
            }

            if (!Bridge.hasValue(length)) {
                length = str.length;
            }

            var arr = [];

            for (var i = startIndex; i < startIndex + length; i++) {
                arr.push(str.charCodeAt(i));
            }

            return arr;
        },

        escape: function (str) {
            return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
        },

        replaceAll: function (str, a, b) {
            var reg = new RegExp(System.String.escape(a), "g");

            return str.replace(reg, b);
        },

        insert: function (index, strA, strB) {
            return index > 0 ? (strA.substring(0, index) + strB + strA.substring(index, strA.length)) : (strB + strA);
        },

        remove: function (s, index, count) {
            if (s == null) {
                throw new System.NullReferenceException();
            }

            if (index < 0) {
                throw new System.ArgumentOutOfRangeException("startIndex", "StartIndex cannot be less than zero");
            }

            if (count != null) {
                if (count < 0) {
                    throw new System.ArgumentOutOfRangeException("count", "Count cannot be less than zero");
                }

                if (count > s.length - index) {
                    throw new System.ArgumentOutOfRangeException("count", "Index and count must refer to a location within the string");
                }
            } else {
                if (index >= s.length) {
                    throw new System.ArgumentOutOfRangeException("startIndex", "startIndex must be less than length of string");
                }
            }

            if (count == null || ((index + count) > s.length)) {
                return s.substr(0, index);
            }

            return s.substr(0, index) + s.substr(index + count);
        },

        split: function (s, strings, limit, options) {
            var re = (!Bridge.hasValue(strings) || strings.length === 0) ? new RegExp("\\s", "g") : new RegExp(strings.map(System.String.escape).join('|'), 'g'),
                res = [],
                m,
                i;

            for (i = 0;; i = re.lastIndex) {
                if (m = re.exec(s)) {
                    if (options !== 1 || m.index > i) {
                        if (res.length === limit - 1) {
                            res.push(s.substr(i));

                            return res;
                        } else {
                            res.push(s.substring(i, m.index));
                        }
                    }
                } else {
                    if (options !== 1 || i !== s.length) {
                        res.push(s.substr(i));
                    }

                    return res;
                }
            }
        },

        trimEnd: function (s, chars) {
            return s.replace(chars ? new RegExp('[' + System.String.escape(String.fromCharCode.apply(null, chars)) + ']+$') : /\s*$/, '');
        },

        trimStart: function (s, chars) {
            return s.replace(chars ? new RegExp('^[' + System.String.escape(String.fromCharCode.apply(null, chars)) + ']+') : /^\s*/, '');
        },

        trim: function (s, chars) {
            return System.String.trimStart(System.String.trimEnd(s, chars), chars);
        },

        concat: function () {
            var s = "";
            for (var i = 0; i < arguments.length; i++) {
                var tmp = arguments[i];
                s += tmp == null ? "" : tmp;
            }

            return s;
        }
    };

    System.String = string;

    // @source Enum.js

    var enumMethods = {
        nameEquals: function (n1, n2, ignoreCase) {
            if (ignoreCase) {
                return n1.toLowerCase() === n2.toLowerCase();
            }

            return (n1.charAt(0).toLowerCase() + n1.slice(1)) === (n2.charAt(0).toLowerCase() + n2.slice(1));
        },

        checkEnumType: function (enumType) {
            if (!enumType) {
                throw new System.ArgumentNullException("enumType");
            }

            if (enumType.prototype && enumType.$kind !== "enum") {
                throw new System.ArgumentException("", "enumType");
            }
        },

        getUnderlyingType: function (type) {
            System.Enum.checkEnumType(type);
            return type.prototype.$utype || System.Int32;
        },

        toName: function (name) {
            return name;
        },

        parse: function (enumType, s, ignoreCase, silent) {
            System.Enum.checkEnumType(enumType);

            var intValue = {};

            if (System.Int32.tryParse(s, intValue)) {
                return intValue.v;
            }

            var values = enumType;

            if (!enumType.prototype || !enumType.prototype.$flags) {
                for (var f in values) {
                    if (enumMethods.nameEquals(f, s, ignoreCase)) {
                        return values[f];
                    }
                }
            } else {
                var parts = s.split(','),
                    value = 0,
                    parsed = true;

                for (var i = parts.length - 1; i >= 0; i--) {
                    var part = parts[i].trim(),
                        found = false;

                    for (var f in values) {
                        if (enumMethods.nameEquals(f, part, ignoreCase)) {
                            value |= values[f];
                            found = true;

                            break;
                        }
                    }

                    if (!found) {
                        parsed = false;

                        break;
                    }
                }

                if (parsed) {
                    return value;
                }
            }

            if (silent !== true) {
                throw new System.ArgumentException('Invalid Enumeration Value');
            }

            return null;
        },

        toString: function (enumType, value, forceFlags) {
            if (enumType === Number) {
                return value.toString();
            }

            System.Enum.checkEnumType(enumType);

            var values = enumType,
                isLong = System.Int64.is64Bit(value);

            if (((!enumType.prototype || !enumType.prototype.$flags) && forceFlags !== true) || (value === 0)) {
                for (var i in values) {
                    if (isLong && System.Int64.is64Bit(values[i]) ? (values[i].eq(value)) : (values[i] === value)) {
                        return enumMethods.toName(i);
                    }
                }

                //throw new System.ArgumentException('Invalid Enumeration Value');
                return value.toString();
            } else {
                var parts = [];

                for (var i in values) {
                    if (isLong && System.Int64.is64Bit(values[i]) ? (!values[i].and(value).isZero()) : (values[i] & value)) {
                        parts.push(enumMethods.toName(i));
                    }
                }

                if (!parts.length) {
                    //throw new System.ArgumentException('Invalid Enumeration Value');
                    return value.toString();
                }

                return parts.join(', ');
            }
        },

        getValues: function (enumType) {
            System.Enum.checkEnumType(enumType);

            var parts = [],
                values = enumType;

            for (var i in values) {
                if (values.hasOwnProperty(i) && i.indexOf("$") < 0 && typeof values[i] !== "function") {
                    parts.push(values[i]);
                }
            }

            return parts.sort(function (i1, i2) {
                return i1 - i2;
            });
        },

        format: function (enumType, value, format) {
            System.Enum.checkEnumType(enumType);

            var name;

            if (!Bridge.hasValue(value) && (name = "value") || !Bridge.hasValue(format) && (name = "format")) {
                throw new System.ArgumentNullException(name);
            }

            switch (format) {
                case "G":
                case "g":
                    return System.Enum.toString(enumType, value);
                case "x":
                case "X":
                    return value.toString(16);
                case "d":
                case "D":
                    return value.toString();
                case "f":
                case "F":
                    return System.Enum.toString(enumType, value, true);
                default:
                    throw new System.FormatException();
            }
        },

        getNames: function (enumType) {
            System.Enum.checkEnumType(enumType);

            var parts = [],
                values = enumType;

            for (var i in values) {
                if (values.hasOwnProperty(i) && i.indexOf("$") < 0 && typeof values[i] !== "function") {
                    parts.push([enumMethods.toName(i), values[i]]);
                }
            }

            return parts.sort(function (i1, i2) {
                return i1[1] - i2[1];
            }).map(function (i) {
                return i[0];
            });
        },

        getName: function (enumType, value) {
            if (value == null) {
                throw new System.ArgumentNullException("value");
            }

            if (!(typeof (value) === "number" && Math.floor(value, 0) === value)) {
                throw new System.ArgumentException("Argument must be integer", "value");
            }

            System.Enum.checkEnumType(enumType);

            var values = enumType;

            for (var i in values) {
                if (values[i] === value) {
                    return i;
                }
            }

            return null;
        },

        hasFlag: function (value, flag) {
            return !!(value & flag);
        },

        isDefined: function (enumType, value) {
            System.Enum.checkEnumType(enumType);

            var values = enumType,
                isString = Bridge.isString(value);

            for (var i in values) {
                if (isString ? enumMethods.nameEquals(i, value, false) : values[i] === value) {
                    return true;
                }
            }

            return false;
        },

        tryParse: function (enumType, value, result, ignoreCase) {
            result.v = 0;
            result.v = enumMethods.parse(enumType, value, ignoreCase, true);

            if (result.v == null) {
                return false;
            }

            return true;
        }
    };

    System.Enum = enumMethods;

    // @source Browser.js

    var check = function (regex) {
            return regex.test(navigator.userAgent.toLowerCase());
        },

        isStrict = Bridge.global.document && Bridge.global.document.compatMode === "CSS1Compat",

        version = function (is, regex) {
            var m;

            return (is && (m = regex.exec(navigator.userAgent.toLowerCase()))) ? parseFloat(m[1]) : 0;
        },

        docMode = Bridge.global.document ? Bridge.global.document.documentMode : null,
        isOpera = check(/opera/),
        isOpera10_5 = isOpera && check(/version\/10\.5/),
        isChrome = check(/\bchrome\b/),
        isWebKit = check(/webkit/),
        isSafari = !isChrome && check(/safari/),
        isSafari2 = isSafari && check(/applewebkit\/4/),
        isSafari3 = isSafari && check(/version\/3/),
        isSafari4 = isSafari && check(/version\/4/),
        isSafari5_0 = isSafari && check(/version\/5\.0/),
        isSafari5 = isSafari && check(/version\/5/),
        isIE = !isOpera && (check(/msie/) || check(/trident/)),
        isIE7 = isIE && ((check(/msie 7/) && docMode !== 8 && docMode !== 9 && docMode !== 10) || docMode === 7),
        isIE8 = isIE && ((check(/msie 8/) && docMode !== 7 && docMode !== 9 && docMode !== 10) || docMode === 8),
        isIE9 = isIE && ((check(/msie 9/) && docMode !== 7 && docMode !== 8 && docMode !== 10) || docMode === 9),
        isIE10 = isIE && ((check(/msie 10/) && docMode !== 7 && docMode !== 8 && docMode !== 9) || docMode === 10),
        isIE11 = isIE && ((check(/trident\/7\.0/) && docMode !== 7 && docMode !== 8 && docMode !== 9 && docMode !== 10) || docMode === 11),
        isIE6 = isIE && check(/msie 6/),
        isGecko = !isWebKit && !isIE && check(/gecko/),
        isGecko3 = isGecko && check(/rv:1\.9/),
        isGecko4 = isGecko && check(/rv:2\.0/),
        isGecko5 = isGecko && check(/rv:5\./),
        isGecko10 = isGecko && check(/rv:10\./),
        isFF3_0 = isGecko3 && check(/rv:1\.9\.0/),
        isFF3_5 = isGecko3 && check(/rv:1\.9\.1/),
        isFF3_6 = isGecko3 && check(/rv:1\.9\.2/),
        isWindows = check(/windows|win32/),
        isMac = check(/macintosh|mac os x/),
        isLinux = check(/linux/),
        scrollbarSize = null,
        chromeVersion = version(true, /\bchrome\/(\d+\.\d+)/),
        firefoxVersion = version(true, /\bfirefox\/(\d+\.\d+)/),
        ieVersion = version(isIE, /msie (\d+\.\d+)/),
        operaVersion = version(isOpera, /version\/(\d+\.\d+)/),
        safariVersion = version(isSafari, /version\/(\d+\.\d+)/),
        webKitVersion = version(isWebKit, /webkit\/(\d+\.\d+)/),
        isSecure = Bridge.global.location ? /^https/i.test(Bridge.global.location.protocol) : false,
        isiPhone = /iPhone/i.test(navigator.platform),
        isiPod = /iPod/i.test(navigator.platform),
        isiPad = /iPad/i.test(navigator.userAgent),
        isBlackberry = /Blackberry/i.test(navigator.userAgent),
        isAndroid = /Android/i.test(navigator.userAgent),
        isDesktop = isMac || isWindows || (isLinux && !isAndroid),
        isTablet = isiPad,
        isPhone = !isDesktop && !isTablet;

    var browser = {
        isStrict: isStrict,
        isIEQuirks: isIE && (!isStrict && (isIE6 || isIE7 || isIE8 || isIE9)),
        isOpera: isOpera,
        isOpera10_5: isOpera10_5,
        isWebKit: isWebKit,
        isChrome: isChrome,
        isSafari: isSafari,
        isSafari3: isSafari3,
        isSafari4: isSafari4,
        isSafari5: isSafari5,
        isSafari5_0: isSafari5_0,
        isSafari2: isSafari2,
        isIE: isIE,
        isIE6: isIE6,
        isIE7: isIE7,
        isIE7m: isIE6 || isIE7,
        isIE7p: isIE && !isIE6,
        isIE8: isIE8,
        isIE8m: isIE6 || isIE7 || isIE8,
        isIE8p: isIE && !(isIE6 || isIE7),
        isIE9: isIE9,
        isIE9m: isIE6 || isIE7 || isIE8 || isIE9,
        isIE9p: isIE && !(isIE6 || isIE7 || isIE8),
        isIE10: isIE10,
        isIE10m: isIE6 || isIE7 || isIE8 || isIE9 || isIE10,
        isIE10p: isIE && !(isIE6 || isIE7 || isIE8 || isIE9),
        isIE11: isIE11,
        isIE11m: isIE6 || isIE7 || isIE8 || isIE9 || isIE10 || isIE11,
        isIE11p: isIE && !(isIE6 || isIE7 || isIE8 || isIE9 || isIE10),
        isGecko: isGecko,
        isGecko3: isGecko3,
        isGecko4: isGecko4,
        isGecko5: isGecko5,
        isGecko10: isGecko10,
        isFF3_0: isFF3_0,
        isFF3_5: isFF3_5,
        isFF3_6: isFF3_6,
        isFF4: 4 <= firefoxVersion && firefoxVersion < 5,
        isFF5: 5 <= firefoxVersion && firefoxVersion < 6,
        isFF10: 10 <= firefoxVersion && firefoxVersion < 11,
        isLinux: isLinux,
        isWindows: isWindows,
        isMac: isMac,
        chromeVersion: chromeVersion,
        firefoxVersion: firefoxVersion,
        ieVersion: ieVersion,
        operaVersion: operaVersion,
        safariVersion: safariVersion,
        webKitVersion: webKitVersion,
        isSecure: isSecure,
        isiPhone: isiPhone,
        isiPod: isiPod,
        isiPad: isiPad,
        isBlackberry: isBlackberry,
        isAndroid: isAndroid,
        isDesktop: isDesktop,
        isTablet: isTablet,
        isPhone: isPhone,
        iOS: isiPhone || isiPad || isiPod,
        standalone: Bridge.global.navigator ? !!Bridge.global.navigator.standalone : false
    };

    Bridge.Browser = browser;

    // @source Class.js

    var base = {
        _initialize: function () {
            if (this.$initialized) {
                return;
            }

            this.$initialized = Bridge.emptyFn;

            if (this.$staticInit) {
                this.$staticInit();
            }

            if (this.$initMembers) {
                this.$initMembers();
            }
        },

        initConfig: function (extend, base, config, statics, scope, prototype) {
            var initFn,
                name;

            if (config.fields) {
                for (name in config.fields) {
                    scope[name] = config.fields[name];
                }
            }

            if (config.properties) {
                for (name in config.properties) {
                    Bridge.property(scope, name, config.properties[name], statics);
                }
            }

            if (config.events) {
                for (name in config.events) {
                    Bridge.event(scope, name, config.events[name], statics);
                }
            }

            if (config.alias) {
                for (var i = 0; i < config.alias.length; i++) {
                    var m = scope[config.alias[i]];

                    if (m === undefined && prototype) {
                        m = prototype[config.alias[i]];
                    }

                    scope[config.alias[i + 1]] = m;
                    i++;
                }
            }

            if (config.init) {
                initFn = config.init;
            }

            if (initFn || (extend && !statics && base.$initMembers)) {
                scope.$initMembers = function () {
                    if (extend && !statics && base.$initMembers) {
                        base.$initMembers.call(this);
                    }

                    if (initFn) {
                        initFn.call(this);
                    }
                };
            }
        },

        definei: function (className, gscope, prop) {
            if ((prop === true || !prop) && gscope) {
                gscope.$kind = "interface";
            } else if (prop) {
                prop.$kind = "interface";
            } else {
                gscope = { $kind: "interface" };
            }

            var c = Bridge.define(className, gscope, prop);

            c.$kind = "interface";
            c.$isInterface = true;

            return c;
        },

        // Create a new Class that inherits from this class
        define: function (className, gscope, prop, gCfg) {
            var isGenericInstance = false;

            if (prop === true) {
                isGenericInstance = true;
                prop = gscope;
                gscope = Bridge.global;
            } else if (!prop) {
                prop = gscope;
                gscope = Bridge.global;
            }

            var fn;

            if (Bridge.isFunction(prop)) {
                fn = function () {
                    var args,
                        key,
                        obj,
                        c;

                    key = Bridge.Class.getCachedType(fn, arguments);

                    if (key) {
                        return key.type;
                    }

                    args = Array.prototype.slice.call(arguments);
                    obj = prop.apply(null, args);
                    c = Bridge.define(Bridge.Class.genericName(className, args), obj, true, { fn: fn, args: args });

                    if (!Bridge.Class.staticInitAllow) {
                        Bridge.Class.$queue.push(c);
                    }

                    return Bridge.get(c);
                };

                fn.$cache = [];

                return Bridge.Class.generic(className, gscope, fn, prop);
            }

            if (!isGenericInstance) {
                Bridge.Class.staticInitAllow = false;
            }

            prop = prop || {};

            var extend = prop.$inherits || prop.inherits,
                statics = prop.$statics || prop.statics,
                isEntryPoint = prop.$entryPoint,
                base,
                prototype,
                scope = prop.$scope || gscope || Bridge.global,
                i,
                v,
                isCtor,
                ctorName,
                name,
                registerT = true;

            prop.$kind = prop.$kind || "class";

            if (prop.$noRegister === true) {
                registerT = false;
                delete prop.$noRegister;
            }

            if (prop.$inherits) {
                delete prop.$inherits;
            } else {
                delete prop.inherits;
            }

            if (isEntryPoint) {
                delete prop.$entryPoint;
            }

            if (Bridge.isFunction(statics)) {
                statics = null;
            } else if (prop.$statics) {
                delete prop.$statics;
            } else {
                delete prop.statics;
            }

            var Class,
                cls = prop.hasOwnProperty("ctor") && prop.ctor;

            if (!cls) {
                if (prop.$literal) {
                    Class = function (obj) {
                        obj = obj || {};
                        obj.$getType = function () { return Class };
                        return obj;
                    };
                } else {
                    Class = function () {
                        this.$initialize();
                        if (Class.$base) {
                            if (Class.$$inherits && Class.$$inherits.length > 0 && Class.$$inherits[0].$staticInit) {
                                Class.$$inherits[0].$staticInit();
                            }
                            Class.$base.ctor.call(this);
                        }
                    };
                }

                prop.ctor = Class;
            } else {
                Class = cls;
            }

            if (prop.$literal) {
                if ((!statics || !statics.getDefaultValue)) {
                    Class.getDefaultValue = function() {
                        var obj = {};
                        obj.$getType = function() { return Class };
                        return obj;
                    };
                }

                Class.$literal = true;
                delete prop.$literal;
            }

            if (!isGenericInstance && registerT) {
                scope = Bridge.Class.set(scope, className, Class);
            }

            if (gCfg) {
                gCfg.fn.$cache.push({ type: Class, args: gCfg.args });
            }

            Class.$$name = className;
            Class.$kind = prop.$kind;

            if (gCfg && isGenericInstance) {
                Class.$genericTypeDefinition = gCfg.fn;
                Class.$typeArguments = gCfg.args;
                Class.$assembly = gCfg.fn.$assembly || Bridge.$currentAssembly;

                var result = Bridge.Reflection.getTypeFullName(gCfg.fn);

                for (i = 0; i < gCfg.args.length; i++) {
                    result += (i === 0 ? '[' : ',') + '[' + Bridge.Reflection.getTypeQName(gCfg.args[i]) + ']';
                }

                result += ']';

                Class.$$fullname = result;
            } else {
                Class.$$fullname = Class.$$name;
            }

            if (extend && Bridge.isFunction(extend)) {
                extend = extend();
            }

            Bridge.Class.createInheritors(Class, extend);

            var noBase = extend ? extend[0].$kind === "interface" : true;

            if (noBase) {
                extend = null;
            }

            base = extend ? extend[0].prototype : this.prototype;
            Class.$base = base;
            prototype = extend ? (extend[0].$$initCtor ? new extend[0].$$initCtor() : new extend[0]()) : new Object();

            Class.$$initCtor = function () { };
            Class.$$initCtor.prototype = prototype;
            Class.$$initCtor.prototype.constructor = Class;
            Class.$$initCtor.prototype.$$fullname = gCfg && isGenericInstance ? Class.$$fullname : Class.$$name;

            if (statics) {
                var staticsConfig = statics.$config || statics.config;

                if (staticsConfig && !Bridge.isFunction(staticsConfig)) {
                    Bridge.Class.initConfig(extend, base, staticsConfig, true, Class);

                    if (statics.$config) {
                        delete statics.$config;
                    } else {
                        delete statics.config;
                    }
                }
            }

            var instanceConfig = prop.$config || prop.config;

            if (instanceConfig && !Bridge.isFunction(instanceConfig)) {
                Bridge.Class.initConfig(extend, base, instanceConfig, false, prop, prototype);

                if (prop.$config) {
                    delete prop.$config;
                } else {
                    delete prop.config;
                }
            } else if (extend && base.$initMembers) {
                prop.$initMembers = function () {
                    base.$initMembers.call(this);
                };
            }

            prop.$initialize = Bridge.Class._initialize;

            var keys = [];

            for (name in prop) {
                keys.push(name);
            }

            for (i = 0; i < keys.length; i++) {
                name = keys[i];

                v = prop[name];
                isCtor = name === "ctor";
                ctorName = name;

                if (Bridge.isFunction(v) && (isCtor || name.match("^\\$ctor") !== null)) {
                    isCtor = true;
                }

                if (isCtor) {
                    Class[ctorName] = prop[name];
                    Class[ctorName].prototype = prototype;
                    Class[ctorName].prototype.constructor = Class;
                    prototype[ctorName] = prop[name];
                } else {
                    prototype[ctorName] = prop[name];
                }
            }

            prototype.$$name = className;

            if (statics) {
                for (name in statics) {
                    if (name === "ctor") {
                        Class["$ctor"] = statics[name];
                    } else {
                        Class[name] = statics[name];
                    }
                }
            }

            if (!extend) {
                extend = [Object].concat(Class.$interfaces);
            }

            Bridge.Class.setInheritors(Class, extend);

            fn = function () {
                if (Bridge.Class.staticInitAllow) {
                    Class.$staticInit = null;

                    if (Class.$initMembers) {
                        Class.$initMembers();
                    }

                    if (Class.$ctor) {
                        Class.$ctor();
                    }
                }
            };

            if (isEntryPoint || Bridge.isFunction(prototype.$main)) {
                Bridge.Class.$queueEntry.push(Class);
            }

            Class.$staticInit = fn;

            if (!isGenericInstance && registerT) {
                Bridge.Class.registerType(className, Class);
            }

            if (Bridge.Reflection) {
                Class.$getMetadata = Bridge.Reflection.getMetadata;
            }

            if (Class.$kind === "enum") {
                Class.$is = function (instance) {
                    var utype = Class.prototype.$utype;

                    if (utype === System.String) {
                        return typeof (instance) == "string";
                    }

                    if (utype && utype.$is) {
                        return utype.$is(instance);
                    }

                    return typeof (instance) == "number";
                };

                Class.getDefaultValue = function () {
                    var utype = Class.prototype.$utype;

                    if (utype === System.String) {
                        return null;
                    }

                    return 0;
                };
            }

            if (Class.$kind === "interface") {
                if (Class.prototype.$variance) {
                    Class.isAssignableFrom = Bridge.Class.varianceAssignable;
                }

                Class.$isInterface = true;
            }

            return Class;
        },

        createInheritors: function(cls, extend) {
            var interfaces = [],
                baseInterfaces = [];

            if (extend) {
                for (var j = 0; j < extend.length; j++) {
                    var baseType = extend[j],
                        baseI = (baseType.$interfaces || []).concat(baseType.$baseInterfaces || []);

                    if (baseI.length > 0) {
                        for (var k = 0; k < baseI.length; k++) {
                            if (baseInterfaces.indexOf(baseI[k]) < 0) {
                                baseInterfaces.push(baseI[k]);
                            }
                        }
                    }

                    if (baseType.$kind === "interface") {
                        interfaces.push(baseType);
                    }
                }
            }

            cls.$baseInterfaces = baseInterfaces;
            cls.$interfaces = interfaces;
            cls.$allInterfaces = interfaces.concat(baseInterfaces);
        },

        setInheritors: function(cls, extend) {
            cls.$$inherits = extend;

            for (var i = 0; i < extend.length; i++) {
                var scope = extend[i];

                if (!scope.$$inheritors) {
                    scope.$$inheritors = [];
                }

                scope.$$inheritors.push(cls);
            }
        },

        varianceAssignable: function (source) {
            var check = function (target, type) {
                if (type.$genericTypeDefinition === target.$genericTypeDefinition && type.$typeArguments.length === target.$typeArguments.length) {
                    for (var i = 0; i < target.$typeArguments.length; i++) {
                        var v = target.prototype.$variance[i], t = target.$typeArguments[i], s = type.$typeArguments[i];

                        switch (v) {
                            case 1: if (!Bridge.Reflection.isAssignableFrom(t, s))
                                return false;
                                break;
                            case 2: if (!Bridge.Reflection.isAssignableFrom(s, t))
                                return false;
                                break;
                            default: if (s !== t)
                                return false;
                        }
                    }

                    return true;
                }

                return false;
            };

            if (source.$kind === "interface" && check(this, source)) {
                return true;
            }

            var ifs = Bridge.Reflection.getInterfaces(source);

            for (var i = 0; i < ifs.length; i++) {
                if (ifs[i] === this || check(this, ifs[i])) {
                    return true;
                }
            }
            return false;
        },

        registerType: function (className, cls) {
            if (Bridge.$currentAssembly) {
                Bridge.$currentAssembly.$types[className] = cls;
                cls.$assembly = Bridge.$currentAssembly;
            }
        },

        addExtend: function (cls, extend) {
            var i,
                scope;

            Array.prototype.push.apply(cls.$$inherits, extend);
            cls.$interfaces = cls.$interfaces || [];
            cls.$baseInterfaces = cls.$baseInterfaces || [];

            for (i = 0; i < extend.length; i++) {
                scope = extend[i];

                if (!scope.$$inheritors) {
                    scope.$$inheritors = [];
                }

                scope.$$inheritors.push(cls);

                var baseI = (scope.$interfaces || []).concat(scope.$baseInterfaces || []);

                if (baseI.length > 0) {
                    for (var k = 0; k < baseI.length; k++) {
                        if (cls.$baseInterfaces.indexOf(baseI[k]) < 0) {
                            cls.$baseInterfaces.push(baseI[k]);
                        }
                    }
                }

                if (scope.$kind === "interface") {
                    cls.$interfaces.push(scope);
                }
            }

            cls.$allInterfaces = cls.$interfaces.concat(cls.$baseInterfaces);
        },

        set: function (scope, className, cls, noDefineProp) {
            var nameParts = className.split("."),
                name,
                key,
                exists,
                i;

            for (i = 0; i < (nameParts.length - 1) ; i++) {
                if (typeof scope[nameParts[i]] == "undefined") {
                    scope[nameParts[i]] = {};
                }

                scope = scope[nameParts[i]];
            }

            name = nameParts[nameParts.length - 1];
            exists = scope[name];

            if (exists) {
                if (exists.$$name === className) {
                    throw "Class '" + className + "' is already defined";
                }

                for (key in exists) {
                    var o = exists[key];

                    if (typeof o === "function" && o.$$name) {
                        (function (cls, key, o) {
                            Object.defineProperty(cls, key, {
                                get: function () {
                                    if (Bridge.Class.staticInitAllow) {
                                        if (o.$staticInit) {
                                            o.$staticInit();
                                        }

                                        Bridge.Class.defineProperty(cls, key, o);
                                    }

                                    return o;
                                },

                                set: function (newValue) {
                                    o = newValue;
                                },

                                enumerable: true,

                                configurable: true
                            });
                        })(cls, key, o);
                    }
                }
            }

            if (noDefineProp !== true) {
                (function (scope, name, cls) {
                    Object.defineProperty(scope, name, {
                        get: function () {
                            if (Bridge.Class.staticInitAllow) {
                                if (cls.$staticInit) {
                                    cls.$staticInit();
                                }

                                Bridge.Class.defineProperty(scope, name, cls);
                            }

                            return cls;
                        },

                        set: function (newValue) {
                            cls = newValue;
                        },

                        enumerable: true,

                        configurable: true
                    });
                })(scope, name, cls);
            } else {
                scope[name] = cls;
            }

            return scope;
        },

        defineProperty: function (scope, name, cls) {
            Object.defineProperty(scope, name, {
                value: cls,
                enumerable: true,
                configurable: true
            });
        },

        genericName: function (name, typeArguments) {
            var gName = name;

            for (var i = 0; i < typeArguments.length; i++) {
                var ta = typeArguments[i];

                gName += "$" + (ta.$$name || Bridge.getTypeName(ta));
            }

            return gName;
        },

        getCachedType: function (fn, args) {
            var arr = fn.$cache,
                len = arr.length,
                key,
                found,
                i, g;

            for (i = 0; i < len; i++) {
                key = arr[i];

                if (key.args.length === args.length) {
                    found = true;

                    for (g = 0; g < key.args.length; g++) {
                        if (key.args[g] !== args[g]) {
                            found = false;

                            break;
                        }
                    }

                    if (found) {
                        return key;
                    }
                }
            }

            return null;
        },

        generic: function (className, scope, fn, prop) {
            fn.$$name = className;
            fn.$kind = "class";

            Bridge.Class.set(scope, className, fn, true);
            Bridge.Class.registerType(className, fn);

            fn.$typeArgumentCount = prop.length;
            fn.$isGenericTypeDefinition = true;
            fn.$getMetadata = Bridge.Reflection.getMetadata;

            fn.$staticInit = function() {
                fn.$typeArguments = Bridge.Reflection.createTypeParams(prop);

                var cfg = prop.apply(null, fn.$typeArguments),
                    extend = cfg.$inherits || cfg.inherits;

                if (extend && Bridge.isFunction(extend)) {
                    extend = extend();
                }

                Bridge.Class.createInheritors(fn, extend);

                if (!extend) {
                    extend = [Object].concat(fn.$interfaces);
                }

                Bridge.Class.setInheritors(fn, extend);

                var prototype = extend ? (extend[0].$$initCtor ? new extend[0].$$initCtor() : new extend[0]()) : new Object();
                fn.prototype = prototype;
                fn.prototype.constructor = fn;
            };

            Bridge.Class.$queue.push(fn);

            return fn;
        },

        init: function (fn) {
            Bridge.Class.staticInitAllow = true;

            var queue = Bridge.Class.$queue.concat(Bridge.Class.$queueEntry);
            Bridge.Class.$queue.length = 0;
            Bridge.Class.$queueEntry.length = 0;

            for (var i = 0; i < queue.length; i++) {
                var t = queue[i];

                if (t.$staticInit) {
                    t.$staticInit();
                }

                if (t.prototype.$main) {
                    Bridge.ready(t.prototype.$main);
                }
            }

            if (fn) {
                fn();
            }
        }
    };

    Bridge.Class = base;
    Bridge.Class.$queue = [];
    Bridge.Class.$queueEntry = [];
    Bridge.define = Bridge.Class.define;
    Bridge.definei = Bridge.Class.definei;
    Bridge.init = Bridge.Class.init;

    // @source ReflectionAssembly.js

    Bridge.assembly = function (assemblyName, res, callback) {
        if (!callback) {
            callback = res;
            res = {};
        }

        assemblyName = assemblyName || "Bridge.$Unknown";

        var asm = System.Reflection.Assembly.assemblies[assemblyName];

        if (!asm) {
            asm = new System.Reflection.Assembly(assemblyName, res);
        } else {
            Bridge.apply(asm.res, res || {});
        }

        Bridge.$currentAssembly = asm;

        if (callback) {
            callback.call(Bridge.global, asm, Bridge.global);
        }

        Bridge.init();
    };

    Bridge.define("System.Reflection.Assembly", {
        statics: {
            assemblies: {}
        },

        ctor: function (name, res) {
            this.$initialize();
            this.name = name;
            this.res = res || {};
            this.$types = {};
            this.$ = {};

            System.Reflection.Assembly.assemblies[name] = this;
        },

        toString: function () {
            return this.name;
        },

        getManifestResourceNames: function () {
            return Object.keys(this.res);
        },

        getManifestResourceDataAsBase64: function (type, name) {
            if (arguments.length === 1) {
                name = type;
                type = null;
            }

            if (type) {
                name = Bridge.Reflection.getTypeNamespace(type) + "." + name;
            }

            return this.res[name] || null;
        },

        getManifestResourceData: function (type, name) {
            if (arguments.length === 1) {
                name = type;
                type = null;
            }

            if (type) {
                name = Bridge.Reflection.getTypeNamespace(type) + '.' + name;
            }

            var r = this.res[name];

            return r ? System.Convert.fromBase64String(r) : null;
        },

        getCustomAttributes: function (attributeType) {
            if (attributeType && !Bridge.isBoolean(attributeType)) {
                return this.attr.filter(function (a) {
                    return Bridge.is(a, attributeType);
                });
            }

            return this.attr;
        }
    });

    Bridge.$currentAssembly = new System.Reflection.Assembly("mscorlib");
    Bridge.SystemAssembly = Bridge.$currentAssembly;
    Bridge.SystemAssembly.$types["System.Reflection.Assembly"] = System.Reflection.Assembly;
    System.Reflection.Assembly.$assembly = Bridge.SystemAssembly;
    var $asm = Bridge.$currentAssembly;

    // @source systemAssemblyVersion.js

    (function(){
        Bridge.SystemAssembly.version = "15.7.0";
        Bridge.SystemAssembly.compiler = "15.7.0";
    })();

    Bridge.define("Bridge.Utils.SystemAssemblyVersion");

    // @source Reflection.js

    Bridge.Reflection = {
        setMetadata: function (type, metadata) {
            type.$getMetadata = Bridge.Reflection.getMetadata;
            type.$metadata = metadata;
        },

        initMetaData: function (type, metadata) {
            if (metadata.m) {
                for (var i = 0; i < metadata.m.length; i++) {
                    var m = metadata.m[i];

                    m.td = type;

                    if (m.ad) {
                        m.ad.td = type;
                    }

                    if (m.r) {
                        m.r.td = type;
                    }

                    if (m.g) {
                        m.g.td = type;
                    }

                    if (m.s) {
                        m.s.td = type;
                    }

                    if (m.tprm && Bridge.isArray(m.tprm)) {
                        for (var j = 0; j < m.tprm.length; j++) {
                            m.tprm[j] = Bridge.Reflection.createTypeParam(m.tprm[j], type);
                        }
                    }
                }
            }

            type.$metadata = metadata;
            type.$initMetaData = true;
        },

        getMetadata: function () {
            if (!this.$metadata && this.$genericTypeDefinition) {
                this.$metadata = this.$genericTypeDefinition.$factoryMetadata || this.$genericTypeDefinition.$metadata;
            }

            var metadata = this.$metadata;

            if (typeof (metadata) === "function") {
                if (this.$isGenericTypeDefinition && !this.$factoryMetadata) {
                    this.$factoryMetadata = this.$metadata;
                }

                if (this.$typeArguments) {
                    metadata = this.$metadata.apply(null, this.$typeArguments);
                } else if (this.$isGenericTypeDefinition) {
                    var arr = Bridge.Reflection.createTypeParams(this.$metadata);
                    this.$typeArguments = arr;
                    metadata = this.$metadata.apply(null, arr);
                } else {
                    metadata = this.$metadata();
                }
            }

            if (!this.$initMetaData && metadata) {
                Bridge.Reflection.initMetaData(this, metadata);
            }

            return metadata;
        },

        createTypeParams: function (fn, t) {
            var args,
                names = [],
                fnStr = fn.toString();

            args = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(/([^\s,]+)/g) || [];
            for (var i = 0; i < args.length; i++) {
                names.push(Bridge.Reflection.createTypeParam(args[i], t));
            }

            return names;
        },

        createTypeParam: function (name, t) {
            var fn = function TypeParameter() { };
            fn.$$name = name;
            fn.$isTypeParameter = true;
            if (t) {
                fn.td = t;
            }
            return fn;
        },

        load: function (name) {
            return System.Reflection.Assembly.assemblies[name] || require(name);
        },

        getGenericTypeDefinition: function (type) {
            if (type.$isGenericTypeDefinition) {
                return type;
            }

            if (!type.$genericTypeDefinition) {
                throw new System.InvalidOperationException("This operation is only valid on generic types.");
            }

            return type.$genericTypeDefinition;
        },

        getGenericParameterCount: function (type) {
            return type.$typeArgumentCount || 0;
        },

        getGenericArguments: function (type) {
            return type.$typeArguments || [];
        },

        getMethodGenericArguments: function (m) {
            return m.tprm || [];
        },

        isGenericTypeDefinition: function (type) {
            return type.$isGenericTypeDefinition || false;
        },

        isGenericType: function (type) {
            return type.$genericTypeDefinition != null || Bridge.Reflection.isGenericTypeDefinition(type);
        },

        getBaseType: function (type) {
            if (type === Object || type.$kind === "interface" || type.prototype == null) {
                return null;
            } else if (Object.getPrototypeOf) {
                return Object.getPrototypeOf(type.prototype).constructor;
            } else {
                var p = type.prototype;

                if (Object.prototype.hasOwnProperty.call(p, "constructor")) {
                    var ownValue;

                    try {
                        ownValue = p.constructor;
                        delete p.constructor;
                        return p.constructor;
                    }
                    finally {
                        p.constructor = ownValue;
                    }
                }

                return p.constructor;
            }
        },

        getTypeFullName: function (obj) {
            var str;

            if (obj.$$fullname) {
                return obj.$$fullname;
            }

            if (obj.$$name) {
                return obj.$$name;
            }

            if ((obj).constructor === Function) {
                str = (obj).toString();
            } else {
                str = (obj).constructor.toString();
            }

            var results = (/function (.{1,})\(/).exec(str);

            return (results && results.length > 1) ? results[1] : "Object";
        },

        _makeQName: function (name, asm) {
            return name + (asm ? ', ' + asm.name : '');
        },

        getTypeQName: function (type) {
            return Bridge.Reflection._makeQName(Bridge.Reflection.getTypeFullName(type), type.$assembly);
        },

        getTypeName: function (type) {
            var fullName = Bridge.Reflection.getTypeFullName(type),
                bIndex = fullName.indexOf('['),
                nsIndex = fullName.lastIndexOf('.', bIndex >= 0 ? bIndex : fullName.length);

            return nsIndex > 0 ? (bIndex >= 0 ? fullName.substring(nsIndex + 1, bIndex) : fullName.substr(nsIndex + 1)) : fullName;
        },

        getTypeNamespace: function (type) {
            var fullName = Bridge.Reflection.getTypeFullName(type),
                bIndex = fullName.indexOf('['),
                nsIndex = fullName.lastIndexOf('.', bIndex >= 0 ? bIndex : fullName.length),
                ns = nsIndex > 0 ? fullName.substr(0, nsIndex) : '';

            if (type.$assembly) {
                var parentType = Bridge.Reflection._getAssemblyType(type.$assembly, ns);

                if (parentType) {
                    ns = Bridge.Reflection.getTypeNamespace(parentType);
                }
            }

            return ns;
        },

        getTypeAssembly: function (type) {
            if (System.Array.contains([Date, Number, Boolean, String, Function, Array], type) || type.$isArray) {
                return Bridge.SystemAssembly;
            } else {
                return type.$assembly || Bridge.SystemAssembly;
            }
        },

        _getAssemblyType: function (asm, name) {
            var noAsm = false;

            if (!asm) {
                asm = Bridge.SystemAssembly;
                noAsm = true;
            }

            if (asm.$types) {
                var t = asm.$types[name] || null;

                if (t) {
                    return t;
                }

                if (asm.name === "mscorlib") {
                    asm = Bridge.global;
                } else {
                    return null;
                }
            }

            var a = name.split('.'),
                scope = asm;

            for (var i = 0; i < a.length; i++) {
                scope = scope[a[i]];

                if (!scope) {
                    return null;
                }
            }

            if (typeof scope !== 'function' || !noAsm && scope.$assembly && asm.name !== scope.$assembly.name) {
                return null;
            }

            return scope;
        },

        getAssemblyTypes: function (asm) {
            var result = [];

            if (asm.$types) {
                for (var t in asm.$types) {
                    if (asm.$types.hasOwnProperty(t)) {
                        result.push(asm.$types[t]);
                    }
                }
            } else {
                var traverse = function (s, n) {
                    for (var c in s) {
                        if (s.hasOwnProperty(c)) {
                            traverse(s[c], c);
                        }
                    }

                    if (typeof (s) === 'function' && Bridge.isUpper(n.charCodeAt(0))) {
                        result.push(s);
                    }
                };

                traverse(asm, '');
            }

            return result;
        },

        createAssemblyInstance: function (asm, typeName) {
            var t = Bridge.Reflection.getType(typeName, asm);

            return t ? Bridge.createInstance(t) : null;
        },

        getInterfaces: function (type) {
            if (type.$allInterfaces) {
                return type.$allInterfaces;
            } else if (type === Date) {
                return [System.IComparable$1(Date), System.IEquatable$1(Date), System.IComparable, System.IFormattable];
            } else if (type === Number) {
                return [System.IComparable$1(Bridge.Int), System.IEquatable$1(Bridge.Int), System.IComparable, System.IFormattable];
            } else if (type === Boolean) {
                return [System.IComparable$1(Boolean), System.IEquatable$1(Boolean), System.IComparable];
            } else if (type === String) {
                return [System.IComparable$1(String), System.IEquatable$1(String), System.IComparable, System.ICloneable, System.Collections.IEnumerable, System.Collections.Generic.IEnumerable$1(System.Char)];
            } else if (type === Array || type.$isArray || System.Array._typedArrays[Bridge.getTypeName(type)]) {
                var t = type.$elementType || Object;
                return [System.Collections.IEnumerable, System.Collections.ICollection, System.ICloneable, System.Collections.IList, System.Collections.Generic.IEnumerable$1(t), System.Collections.Generic.ICollection$1(t), System.Collections.Generic.IList$1(t)];
            } else {
                return [];
            }
        },

        isInstanceOfType: function (instance, type) {
            return Bridge.is(instance, type);
        },

        isAssignableFrom: function (baseType, type) {
            if (baseType == null) {
                throw new System.NullReferenceException();
            }

            if (type == null) {
                return false;
            }

            if (baseType === type || baseType === Object) {
                return true;
            }

            if (Bridge.isFunction(baseType.isAssignableFrom)) {
                return baseType.isAssignableFrom(type);
            }

            if (type === Array) {
                return System.Array.is([], baseType);
            }

            if (Bridge.Reflection.isInterface(baseType) && System.Array.contains(Bridge.Reflection.getInterfaces(type), baseType)) {
                return true;
            }

            var inheritors = type.$$inherits,
                i,
                r;

            if (inheritors) {
                for (i = 0; i < inheritors.length; i++) {
                    r = Bridge.Reflection.isAssignableFrom(baseType, inheritors[i]);

                    if (r) {
                        return true;
                    }
                }
            }

            return false;
        },

        isClass: function (type) {
            return (type.$kind === "class" || type === Array || type === Function || type === RegExp || type === String || type === Error || type === Object);
        },

        isEnum: function (type) {
            return type.$kind === "enum";
        },

        isFlags: function (type) {
            return !!(type.prototype && type.prototype.$flags);
        },

        isInterface: function (type) {
            return type.$kind === "interface";
        },

        _getType: function (typeName, asm, re) {
            var outer = !re;

            re = re || /[[,\]]/g;

            var last = re.lastIndex,
                m = re.exec(typeName),
                tname,
                targs = [],
                t;

            if (m) {
                tname = typeName.substring(last, m.index);

                switch (m[0]) {
                    case '[':
                        if (typeName[m.index + 1] !== '[') {
                            return null;
                        }

                        for (; ;) {
                            re.exec(typeName);
                            t = Bridge.Reflection._getType(typeName, Bridge.SystemAssembly, re);

                            if (!t) {
                                return null;
                            }

                            targs.push(t);
                            m = re.exec(typeName);

                            if (m[0] === ']') {
                                break;
                            } else if (m[0] !== ',') {
                                return null;
                            }
                        }

                        m = re.exec(typeName);

                        if (m && m[0] === ',') {
                            re.exec(typeName);

                            if (!(asm = System.Reflection.Assembly.assemblies[(re.lastIndex > 0 ? typeName.substring(m.index + 1, re.lastIndex - 1) : typeName.substring(m.index + 1)).trim()])) {
                                return null;
                            }
                        }
                        break;

                    case ']':
                        break;

                    case ',':
                        re.exec(typeName);

                        if (!(asm = System.Reflection.Assembly.assemblies[(re.lastIndex > 0 ? typeName.substring(m.index + 1, re.lastIndex - 1) : typeName.substring(m.index + 1)).trim()])) {
                            return null;
                        }

                        break;
                }
            } else {
                tname = typeName.substring(last);
            }

            if (outer && re.lastIndex) {
                return null;
            }

            t = Bridge.Reflection._getAssemblyType(asm, tname.trim());

            t = targs.length ? t.apply(null, targs) : t;
            if (t && t.$staticInit) {
                t.$staticInit();
            }
            return t;
        },

        getType: function (typeName, asm) {
            if (typeName == null) {
                throw new System.ArgumentNullException("typeName");
            }
            return typeName ? Bridge.Reflection._getType(typeName, asm) : null;
        },

        canAcceptNull: function (type) {
            if (type.$kind === "struct" ||
                type === System.Decimal ||
                type === System.Int64 ||
                type === System.UInt64 ||
                type === System.Double ||
                type === System.Single ||
                type === System.Byte ||
                type === System.SByte ||
                type === System.Int16 ||
                type === System.UInt16 ||
                type === System.Int32 ||
                type === System.UInt32 ||
                type === Bridge.Int ||
                type === Boolean ||
                type === Date ||
                type === Number) {
                return false;
            }

            return true;
        },

        applyConstructor: function (constructor, args) {
            if (!args || args.length === 0) {
                return new constructor();
            }

            if (constructor.$$initCtor && constructor.$kind !== "anonymous") {
                var md = Bridge.getMetadata(constructor),
                    count = 0;

                if (md) {
                    var ctors = Bridge.Reflection.getMembers(constructor, 1, 28),
                        found;

                    for (var j = 0; j < ctors.length; j++) {
                        var ctor = ctors[j];

                        if (ctor.p && ctor.p.length === args.length) {
                            found = true;

                            for (var k = 0; k < ctor.p.length; k++) {
                                var p = ctor.p[k];

                                if (!Bridge.is(args[k], p) || args[k] == null && !Bridge.Reflection.canAcceptNull(p)) {
                                    found = false;
                                    break;
                                }
                            }

                            if (found) {
                                constructor = constructor[ctor.sn];
                                count++;
                            }
                        }
                    }
                } else {
                    if (Bridge.isFunction(constructor.ctor) && constructor.ctor.length === args.length) {
                        constructor = constructor.ctor;
                    } else {
                        var name = "$ctor",
                            i = 1;

                        while (Bridge.isFunction(constructor[name + i])) {
                            if (constructor[name + i].length === args.length) {
                                constructor = constructor[name + i];
                                count++;
                            }

                            i++;
                        }
                    }
                }

                if (count > 1) {
                    throw new System.Exception("The ambiguous constructor call");
                }
            }

            var f = function () {
                constructor.apply(this, args);
            };

            f.prototype = constructor.prototype;

            return new f();
        },

        getAttributes: function (type, attrType, inherit) {
            var result = [],
                i,
                t,
                a,
                md,
                type_md;

            if (inherit) {
                var b = Bridge.Reflection.getBaseType(type);

                if (b) {
                    a = Bridge.Reflection.getAttributes(b, attrType, true);

                    for (i = 0; i < a.length; i++) {
                        t = Bridge.getType(a[i]);
                        md = Bridge.getMetadata(t);

                        if (!md || !md.ni) {
                            result.push(a[i]);
                        }
                    }
                }
            }

            type_md = Bridge.getMetadata(type);

            if (type_md && type_md.at) {
                for (i = 0; i < type_md.at.length; i++) {
                    a = type_md.at[i];

                    if (attrType == null || Bridge.Reflection.isInstanceOfType(a, attrType)) {
                        t = Bridge.getType(a);
                        md = Bridge.getMetadata(t);

                        if (!md || !md.am) {
                            for (var j = result.length - 1; j >= 0; j--) {
                                if (Bridge.Reflection.isInstanceOfType(result[j], t)) {
                                    result.splice(j, 1);
                                }
                            }
                        }

                        result.push(a);
                    }
                }
            }

            return result;
        },

        getMembers: function (type, memberTypes, bindingAttr, name, params) {
            var result = [];

            if ((bindingAttr & 72) === 72 || (bindingAttr & 6) === 4) {
                var b = Bridge.Reflection.getBaseType(type);

                if (b) {
                    result = Bridge.Reflection.getMembers(b, memberTypes & ~1, bindingAttr & (bindingAttr & 64 ? 255 : 247) & (bindingAttr & 2 ? 251 : 255), name, params);
                }
            }

            var f = function (m) {
                if ((memberTypes & m.t) && (((bindingAttr & 4) && !m.is) || ((bindingAttr & 8) && m.is)) && (!name || m.n === name)) {
                    if (params) {
                        if ((m.p || []).length !== params.length) {
                            return;
                        }

                        for (var i = 0; i < params.length; i++) {
                            if (params[i] !== m.p[i]) {
                                return;
                            }
                        }
                    }

                    result.push(m);
                }
            };

            var type_md = Bridge.getMetadata(type);

            if (type_md && type_md.m) {
                var mNames = ['g', 's', 'ad', 'r'];

                for (var i = 0; i < type_md.m.length; i++) {
                    var m = type_md.m[i];

                    f(m);

                    for (var j = 0; j < 4; j++) {
                        var a = mNames[j];

                        if (m[a]) {
                            f(m[a]);
                        }
                    }
                }
            }

            if (bindingAttr & 256) {
                while (type) {
                    var r = [];

                    for (var i = 0; i < result.length; i++) {
                        if (result[i].td === type) {
                            r.push(result[i]);
                        }
                    }

                    if (r.length > 1) {
                        throw new System.Reflection.AmbiguousMatchException('Ambiguous match');
                    } else if (r.length === 1) {
                        return r[0];
                    }

                    type = Bridge.Reflection.getBaseType(type);
                }

                return null;
            }

            return result;
        },

        midel: function (mi, target, typeArguments) {
            if (mi.is && !!target) {
                throw new System.ArgumentException('Cannot specify target for static method');
            } else if (!mi.is && !target)
                throw new System.ArgumentException('Must specify target for instance method');

            var method;

            if (mi.fg) {
                method = function () { return (mi.is ? mi.td : this)[mi.fg]; };
            } else if (mi.fs) {
                method = function (v) { (mi.is ? mi.td : this)[mi.fs] = v; };
            } else {
                method = mi.def || (mi.is || mi.sm ? mi.td[mi.sn] : target[mi.sn]);

                if (mi.tpc) {
                    if (!typeArguments || typeArguments.length !== mi.tpc) {
                        throw new System.ArgumentException('Wrong number of type arguments');
                    }

                    var gMethod = method;

                    method = function () {
                        return gMethod.apply(this, typeArguments.concat(Array.prototype.slice.call(arguments)));
                    }
                } else {
                    if (typeArguments && typeArguments.length) {
                        throw new System.ArgumentException('Cannot specify type arguments for non-generic method');
                    }
                }

                if (mi.exp) {
                    var _m1 = method;

                    method = function () { return _m1.apply(this, Array.prototype.slice.call(arguments, 0, arguments.length - 1).concat(arguments[arguments.length - 1])); };
                }

                if (mi.sm) {
                    var _m2 = method;

                    method = function () { return _m2.apply(null, [this].concat(Array.prototype.slice.call(arguments))); };
                }
            }

            return Bridge.fn.bind(target, method);
        },

        invokeCI: function (ci, args) {
            if (ci.exp) {
                args = args.slice(0, args.length - 1).concat(args[args.length - 1]);
            }

            if (ci.def) {
                return ci.def.apply(null, args);
            } else if (ci.sm) {
                return ci.td[ci.sn].apply(null, args);
            } else {
                return Bridge.Reflection.applyConstructor(ci.sn ? ci.td[ci.sn] : ci.td, args);
            }
        },

        fieldAccess: function (fi, obj) {
            if (fi.is && !!obj) {
                throw new System.ArgumentException('Cannot specify target for static field');
            } else if (!fi.is && !obj) {
                throw new System.ArgumentException('Must specify target for instance field');
            }

            obj = fi.is ? fi.td : obj;

            if (arguments.length === 3) {
                obj[fi.sn] = arguments[2];
            } else {
                return obj[fi.sn];
            }
        },

        getMetaValue: function (type, name, dv) {
            var md = type.$isTypeParameter ? type : Bridge.getMetadata(type);
            return md ? (md[name] || dv) : dv;
        },

        isArray: function (type) {
            return Bridge.arrayTypes.indexOf(type) >= 0;
        },

        hasGenericParameters: function (type) {
            if (type.$typeArguments) {
                for (var i = 0; i < type.$typeArguments.length; i++) {
                    if (type.$typeArguments[i].$isTypeParameter) {
                        return true;
                    }
                }
            }

            return false;
        }
    };

    Bridge.setMetadata = Bridge.Reflection.setMetadata;

    System.Reflection.ConstructorInfo = {
        $is: function (obj) {
            return obj != null && obj.t === 1;
        }
    };

    System.Reflection.EventInfo = {
        $is: function (obj) {
            return obj != null && obj.t === 2;
        }
    };

    System.Reflection.FieldInfo = {
        $is: function (obj) {
            return obj != null && obj.t === 4;
        }
    };

    System.Reflection.MethodBase = {
        $is: function (obj) {
            return obj != null && (obj.t === 1 || obj.t === 8);
        }
    };

    System.Reflection.MethodInfo = {
        $is: function (obj) {
            return obj != null && obj.t === 8;
        }
    };

    System.Reflection.PropertyInfo = {
        $is: function (obj) {
            return obj != null && obj.t === 16;
        }
    };

    System.AppDomain = {
        getAssemblies: function () {
            return Object.keys(System.Reflection.Assembly.assemblies).map(function (n) { return System.Reflection.Assembly.assemblies[n]; });
        }
    };

    // @source Interfaces.js

    Bridge.define("System.IFormattable", {
        $kind: "interface",
        statics: {
            $is: function (obj) {
                if (Bridge.isNumber(obj) || Bridge.isDate(obj)) {
                    return true;
                }

                return Bridge.is(obj, System.IFormattable, true);
            }
        }
    });

    Bridge.define("System.IComparable", {
        $kind: "interface",

        statics: {
            $is: function (obj) {
                if (Bridge.isNumber(obj) || Bridge.isDate(obj) || Bridge.isBoolean(obj) || Bridge.isString(obj)) {
                    return true;
                }

                return Bridge.is(obj, System.IComparable, true);
            }
        }
    });

    Bridge.define("System.IFormatProvider", {
        $kind: "interface"
    });

    Bridge.define("System.ICloneable", {
        $kind: "interface"
    });

    Bridge.define('System.IComparable$1', function (T) {
        return {
            $kind: "interface",

            statics: {
                $is: function (obj) {
                    if (Bridge.isNumber(obj) && T.$number && T.$is(obj) || Bridge.isDate(obj) && T === Date || Bridge.isBoolean(obj) && T === Boolean || Bridge.isString(obj) && T === String) {
                        return true;
                    }

                    return Bridge.is(obj, System.IComparable$1(T), true);
                }
            }
        };
    });

    Bridge.define('System.IEquatable$1', function (T) {
        return {
            $kind: "interface",

            statics: {
                $is: function (obj) {
                    if (Bridge.isNumber(obj) && T.$number && T.$is(obj) || Bridge.isDate(obj) && T === Date || Bridge.isBoolean(obj) && T === Boolean || Bridge.isString(obj) && T === String) {
                        return true;
                    }

                    return Bridge.is(obj, System.IEquatable$1(T), true);
                }
            }
        };
    });

    Bridge.define("Bridge.IPromise", {
        $kind: "interface"
    });

    Bridge.define("System.IDisposable", {
        $kind: "interface"
    });

    // @source Nullable.js

    var nullable = {
        hasValue: Bridge.hasValue,

        getValue: function (obj) {
            if (!Bridge.hasValue(obj)) {
                throw new System.InvalidOperationException("Nullable instance doesn't have a value.");
            }

            return obj;
        },

        getValueOrDefault: function (obj, defValue) {
            return Bridge.hasValue(obj) ? obj : defValue;
        },

        add: function (a, b) {
            return Bridge.hasValue$1(a, b) ? a + b : null;
        },

        band: function (a, b) {
            return Bridge.hasValue$1(a, b) ? a & b : null;
        },

        bor: function (a, b) {
            return Bridge.hasValue$1(a, b) ? a | b : null;
        },

        and: function (a, b) {
            if (a === true && b === true) {
                return true;
            } else if (a === false || b === false) {
                return false;
            }

            return null;
        },

        or: function (a, b) {
            if (a === true || b === true) {
                return true;
            } else if (a === false && b === false) {
                return false;
            }

            return null;
        },

        div: function (a, b) {
            return Bridge.hasValue$1(a, b) ? a / b : null;
        },

        eq: function (a, b) {
            return !Bridge.hasValue(a) ? !Bridge.hasValue(b) : (a === b);
        },

        equals: function (a, b, fn) {
            return !Bridge.hasValue(a) ? !Bridge.hasValue(b) : (fn ? fn(a, b) : Bridge.equals(a, b));
        },

        toString: function (a, fn) {
            return !Bridge.hasValue(a) ? "" : (fn ? fn(a) : a.toString());
        },

        getHashCode: function (a, fn) {
            return !Bridge.hasValue(a) ? 0 : (fn ? fn(a) : Bridge.getHashCode(a));
        },

        xor: function (a, b) {
            return Bridge.hasValue$1(a, b) ? a ^ b : null;
        },

        gt: function (a, b) {
            return Bridge.hasValue$1(a, b) && a > b;
        },

        gte: function (a, b) {
            return Bridge.hasValue$1(a, b) && a >= b;
        },

        neq: function (a, b) {
            return !Bridge.hasValue(a) ? Bridge.hasValue(b) : (a !== b);
        },

        lt: function (a, b) {
            return Bridge.hasValue$1(a, b) && a < b;
        },

        lte: function (a, b) {
            return Bridge.hasValue$1(a, b) && a <= b;
        },

        mod: function (a, b) {
            return Bridge.hasValue$1(a, b) ? a % b : null;
        },

        mul: function (a, b) {
            return Bridge.hasValue$1(a, b) ? a * b : null;
        },

        sl: function (a, b) {
            return Bridge.hasValue$1(a, b) ? a << b : null;
        },

        sr: function (a, b) {
            return Bridge.hasValue$1(a, b) ? a >> b : null;
        },

        srr: function (a, b) {
            return Bridge.hasValue$1(a, b) ? a >>> b : null;
        },

        sub: function (a, b) {
            return Bridge.hasValue$1(a, b) ? a - b : null;
        },

        bnot: function (a) {
            return Bridge.hasValue(a) ? ~a : null;
        },

        neg: function (a) {
            return Bridge.hasValue(a) ? -a : null;
        },

        not: function (a) {
            return Bridge.hasValue(a) ? !a : null;
        },

        pos: function (a) {
            return Bridge.hasValue(a) ? +a : null;
        },

        lift: function () {
            for (var i = 1; i < arguments.length; i++) {
                if (!Bridge.hasValue(arguments[i])) {
                    return null;
                }
            }

            if (arguments[0] == null) {
                return null;
            }

            if (arguments[0].apply == undefined) {
                return arguments[0];
            }

            return arguments[0].apply(null, Array.prototype.slice.call(arguments, 1));
        },

        lift1: function (f, o) {
            return Bridge.hasValue(o) ? (typeof f === "function" ? f.apply(null, Array.prototype.slice.call(arguments, 1)) : o[f].apply(o, Array.prototype.slice.call(arguments, 2))) : null;
        },

        lift2: function (f, a, b) {
            return Bridge.hasValue$1(a, b) ? (typeof f === "function" ? f.apply(null, Array.prototype.slice.call(arguments, 1)) : a[f].apply(a, Array.prototype.slice.call(arguments, 2))) : null;
        },

        liftcmp: function (f, a, b) {
            return Bridge.hasValue$1(a, b) ? (typeof f === "function" ? f.apply(null, Array.prototype.slice.call(arguments, 1)) : a[f].apply(a, Array.prototype.slice.call(arguments, 2))) : false;
        },

        lifteq: function (f, a, b) {
            var va = Bridge.hasValue(a),
                vb = Bridge.hasValue(b);

            return (!va && !vb) || (va && vb && (typeof f === "function" ? f.apply(null, Array.prototype.slice.call(arguments, 1)) : a[f].apply(a, Array.prototype.slice.call(arguments, 2))));
        },

        liftne: function (f, a, b) {
            var va = Bridge.hasValue(a),
                vb = Bridge.hasValue(b);

            return (va !== vb) || (va && (typeof f === "function" ? f.apply(null, Array.prototype.slice.call(arguments, 1)) : a[f].apply(a, Array.prototype.slice.call(arguments, 2))));
        }
    };

    System.Nullable = nullable;

    Bridge.define('System.Nullable$1', function (T) {
        return {
            $kind: "struct",

            statics: {
                getDefaultValue: function () {
                    return null;
                },

                $is: function(obj) {
                    return Bridge.is(obj, T);
                }
            }
        };
    });
    // @source Char.js

    Bridge.define("System.Char", {
        inherits: [System.IComparable, System.IFormattable],
        $kind: "struct",
        statics: {
            min: 0,

            max: 65535,

            $is: function (instance) {
                return typeof (instance) === "number" && Math.round(instance, 0) == instance && instance >= System.Char.min && instance <= System.Char.max;
            },

            getDefaultValue: function () {
                return 0;
            },

            parse: function (s) {
                if (!Bridge.hasValue(s)) {
                    throw new System.ArgumentNullException("s");
                }

                if (s.length !== 1) {
                    throw new System.FormatException();
                }

                return s.charCodeAt(0);
            },

            tryParse: function (s, result) {
                var b = s && s.length === 1;

                result.v = b ? s.charCodeAt(0) : 0;

                return b;
            },

            format: function (number, format, provider) {
                return Bridge.Int.format(number, format, provider);
            },

            charCodeAt: function (str, index) {
                if (str == null) {
                    throw new System.ArgumentNullException();
                }

                if (str.length != 1) {
                    throw new System.FormatException("String must be exactly one character long");
                }

                return str.charCodeAt(index);
            },

            isWhiteSpace: function (s) {
                return !/[^\s\x09-\x0D\x85\xA0]/.test(s);
            },

            isDigit: function (value) {
                if (value < 256) {
                    return (value >= 48 && value <= 57);
                }

                return new RegExp("[0-9\u0030-\u0039\u0660-\u0669\u06F0-\u06F9\u07C0-\u07C9\u0966-\u096F\u09E6-\u09EF\u0A66-\u0A6F\u0AE6-\u0AEF\u0B66-\u0B6F\u0BE6-\u0BEF\u0C66-\u0C6F\u0CE6-\u0CEF\u0D66-\u0D6F\u0E50-\u0E59\u0ED0-\u0ED9\u0F20-\u0F29\u1040-\u1049\u1090-\u1099\u17E0-\u17E9\u1810-\u1819\u1946-\u194F\u19D0-\u19D9\u1A80-\u1A89\u1A90-\u1A99\u1B50-\u1B59\u1BB0-\u1BB9\u1C40-\u1C49\u1C50-\u1C59\uA620-\uA629\uA8D0-\uA8D9\uA900-\uA909\uA9D0-\uA9D9\uAA50-\uAA59\uABF0-\uABF9\uFF10-\uFF19]").test(String.fromCharCode(value));
            },

            isLetter: function (value) {
                if (value < 256) {
                    return (value >= 65 && value <= 90) || (value >= 97 && value <= 122);
                }

                return new RegExp("[A-Za-z\u0061-\u007A\u00B5\u00DF-\u00F6\u00F8-\u00FF\u0101\u0103\u0105\u0107\u0109\u010B\u010D\u010F\u0111\u0113\u0115\u0117\u0119\u011B\u011D\u011F\u0121\u0123\u0125\u0127\u0129\u012B\u012D\u012F\u0131\u0133\u0135\u0137\u0138\u013A\u013C\u013E\u0140\u0142\u0144\u0146\u0148\u0149\u014B\u014D\u014F\u0151\u0153\u0155\u0157\u0159\u015B\u015D\u015F\u0161\u0163\u0165\u0167\u0169\u016B\u016D\u016F\u0171\u0173\u0175\u0177\u017A\u017C\u017E-\u0180\u0183\u0185\u0188\u018C\u018D\u0192\u0195\u0199-\u019B\u019E\u01A1\u01A3\u01A5\u01A8\u01AA\u01AB\u01AD\u01B0\u01B4\u01B6\u01B9\u01BA\u01BD-\u01BF\u01C6\u01C9\u01CC\u01CE\u01D0\u01D2\u01D4\u01D6\u01D8\u01DA\u01DC\u01DD\u01DF\u01E1\u01E3\u01E5\u01E7\u01E9\u01EB\u01ED\u01EF\u01F0\u01F3\u01F5\u01F9\u01FB\u01FD\u01FF\u0201\u0203\u0205\u0207\u0209\u020B\u020D\u020F\u0211\u0213\u0215\u0217\u0219\u021B\u021D\u021F\u0221\u0223\u0225\u0227\u0229\u022B\u022D\u022F\u0231\u0233-\u0239\u023C\u023F\u0240\u0242\u0247\u0249\u024B\u024D\u024F-\u0293\u0295-\u02AF\u0371\u0373\u0377\u037B-\u037D\u0390\u03AC-\u03CE\u03D0\u03D1\u03D5-\u03D7\u03D9\u03DB\u03DD\u03DF\u03E1\u03E3\u03E5\u03E7\u03E9\u03EB\u03ED\u03EF-\u03F3\u03F5\u03F8\u03FB\u03FC\u0430-\u045F\u0461\u0463\u0465\u0467\u0469\u046B\u046D\u046F\u0471\u0473\u0475\u0477\u0479\u047B\u047D\u047F\u0481\u048B\u048D\u048F\u0491\u0493\u0495\u0497\u0499\u049B\u049D\u049F\u04A1\u04A3\u04A5\u04A7\u04A9\u04AB\u04AD\u04AF\u04B1\u04B3\u04B5\u04B7\u04B9\u04BB\u04BD\u04BF\u04C2\u04C4\u04C6\u04C8\u04CA\u04CC\u04CE\u04CF\u04D1\u04D3\u04D5\u04D7\u04D9\u04DB\u04DD\u04DF\u04E1\u04E3\u04E5\u04E7\u04E9\u04EB\u04ED\u04EF\u04F1\u04F3\u04F5\u04F7\u04F9\u04FB\u04FD\u04FF\u0501\u0503\u0505\u0507\u0509\u050B\u050D\u050F\u0511\u0513\u0515\u0517\u0519\u051B\u051D\u051F\u0521\u0523\u0525\u0527\u0561-\u0587\u1D00-\u1D2B\u1D6B-\u1D77\u1D79-\u1D9A\u1E01\u1E03\u1E05\u1E07\u1E09\u1E0B\u1E0D\u1E0F\u1E11\u1E13\u1E15\u1E17\u1E19\u1E1B\u1E1D\u1E1F\u1E21\u1E23\u1E25\u1E27\u1E29\u1E2B\u1E2D\u1E2F\u1E31\u1E33\u1E35\u1E37\u1E39\u1E3B\u1E3D\u1E3F\u1E41\u1E43\u1E45\u1E47\u1E49\u1E4B\u1E4D\u1E4F\u1E51\u1E53\u1E55\u1E57\u1E59\u1E5B\u1E5D\u1E5F\u1E61\u1E63\u1E65\u1E67\u1E69\u1E6B\u1E6D\u1E6F\u1E71\u1E73\u1E75\u1E77\u1E79\u1E7B\u1E7D\u1E7F\u1E81\u1E83\u1E85\u1E87\u1E89\u1E8B\u1E8D\u1E8F\u1E91\u1E93\u1E95-\u1E9D\u1E9F\u1EA1\u1EA3\u1EA5\u1EA7\u1EA9\u1EAB\u1EAD\u1EAF\u1EB1\u1EB3\u1EB5\u1EB7\u1EB9\u1EBB\u1EBD\u1EBF\u1EC1\u1EC3\u1EC5\u1EC7\u1EC9\u1ECB\u1ECD\u1ECF\u1ED1\u1ED3\u1ED5\u1ED7\u1ED9\u1EDB\u1EDD\u1EDF\u1EE1\u1EE3\u1EE5\u1EE7\u1EE9\u1EEB\u1EED\u1EEF\u1EF1\u1EF3\u1EF5\u1EF7\u1EF9\u1EFB\u1EFD\u1EFF-\u1F07\u1F10-\u1F15\u1F20-\u1F27\u1F30-\u1F37\u1F40-\u1F45\u1F50-\u1F57\u1F60-\u1F67\u1F70-\u1F7D\u1F80-\u1F87\u1F90-\u1F97\u1FA0-\u1FA7\u1FB0-\u1FB4\u1FB6\u1FB7\u1FBE\u1FC2-\u1FC4\u1FC6\u1FC7\u1FD0-\u1FD3\u1FD6\u1FD7\u1FE0-\u1FE7\u1FF2-\u1FF4\u1FF6\u1FF7\u210A\u210E\u210F\u2113\u212F\u2134\u2139\u213C\u213D\u2146-\u2149\u214E\u2184\u2C30-\u2C5E\u2C61\u2C65\u2C66\u2C68\u2C6A\u2C6C\u2C71\u2C73\u2C74\u2C76-\u2C7B\u2C81\u2C83\u2C85\u2C87\u2C89\u2C8B\u2C8D\u2C8F\u2C91\u2C93\u2C95\u2C97\u2C99\u2C9B\u2C9D\u2C9F\u2CA1\u2CA3\u2CA5\u2CA7\u2CA9\u2CAB\u2CAD\u2CAF\u2CB1\u2CB3\u2CB5\u2CB7\u2CB9\u2CBB\u2CBD\u2CBF\u2CC1\u2CC3\u2CC5\u2CC7\u2CC9\u2CCB\u2CCD\u2CCF\u2CD1\u2CD3\u2CD5\u2CD7\u2CD9\u2CDB\u2CDD\u2CDF\u2CE1\u2CE3\u2CE4\u2CEC\u2CEE\u2CF3\u2D00-\u2D25\u2D27\u2D2D\uA641\uA643\uA645\uA647\uA649\uA64B\uA64D\uA64F\uA651\uA653\uA655\uA657\uA659\uA65B\uA65D\uA65F\uA661\uA663\uA665\uA667\uA669\uA66B\uA66D\uA681\uA683\uA685\uA687\uA689\uA68B\uA68D\uA68F\uA691\uA693\uA695\uA697\uA723\uA725\uA727\uA729\uA72B\uA72D\uA72F-\uA731\uA733\uA735\uA737\uA739\uA73B\uA73D\uA73F\uA741\uA743\uA745\uA747\uA749\uA74B\uA74D\uA74F\uA751\uA753\uA755\uA757\uA759\uA75B\uA75D\uA75F\uA761\uA763\uA765\uA767\uA769\uA76B\uA76D\uA76F\uA771-\uA778\uA77A\uA77C\uA77F\uA781\uA783\uA785\uA787\uA78C\uA78E\uA791\uA793\uA7A1\uA7A3\uA7A5\uA7A7\uA7A9\uA7FA\uFB00-\uFB06\uFB13-\uFB17\uFF41-\uFF5A\u0041-\u005A\u00C0-\u00D6\u00D8-\u00DE\u0100\u0102\u0104\u0106\u0108\u010A\u010C\u010E\u0110\u0112\u0114\u0116\u0118\u011A\u011C\u011E\u0120\u0122\u0124\u0126\u0128\u012A\u012C\u012E\u0130\u0132\u0134\u0136\u0139\u013B\u013D\u013F\u0141\u0143\u0145\u0147\u014A\u014C\u014E\u0150\u0152\u0154\u0156\u0158\u015A\u015C\u015E\u0160\u0162\u0164\u0166\u0168\u016A\u016C\u016E\u0170\u0172\u0174\u0176\u0178\u0179\u017B\u017D\u0181\u0182\u0184\u0186\u0187\u0189-\u018B\u018E-\u0191\u0193\u0194\u0196-\u0198\u019C\u019D\u019F\u01A0\u01A2\u01A4\u01A6\u01A7\u01A9\u01AC\u01AE\u01AF\u01B1-\u01B3\u01B5\u01B7\u01B8\u01BC\u01C4\u01C7\u01CA\u01CD\u01CF\u01D1\u01D3\u01D5\u01D7\u01D9\u01DB\u01DE\u01E0\u01E2\u01E4\u01E6\u01E8\u01EA\u01EC\u01EE\u01F1\u01F4\u01F6-\u01F8\u01FA\u01FC\u01FE\u0200\u0202\u0204\u0206\u0208\u020A\u020C\u020E\u0210\u0212\u0214\u0216\u0218\u021A\u021C\u021E\u0220\u0222\u0224\u0226\u0228\u022A\u022C\u022E\u0230\u0232\u023A\u023B\u023D\u023E\u0241\u0243-\u0246\u0248\u024A\u024C\u024E\u0370\u0372\u0376\u0386\u0388-\u038A\u038C\u038E\u038F\u0391-\u03A1\u03A3-\u03AB\u03CF\u03D2-\u03D4\u03D8\u03DA\u03DC\u03DE\u03E0\u03E2\u03E4\u03E6\u03E8\u03EA\u03EC\u03EE\u03F4\u03F7\u03F9\u03FA\u03FD-\u042F\u0460\u0462\u0464\u0466\u0468\u046A\u046C\u046E\u0470\u0472\u0474\u0476\u0478\u047A\u047C\u047E\u0480\u048A\u048C\u048E\u0490\u0492\u0494\u0496\u0498\u049A\u049C\u049E\u04A0\u04A2\u04A4\u04A6\u04A8\u04AA\u04AC\u04AE\u04B0\u04B2\u04B4\u04B6\u04B8\u04BA\u04BC\u04BE\u04C0\u04C1\u04C3\u04C5\u04C7\u04C9\u04CB\u04CD\u04D0\u04D2\u04D4\u04D6\u04D8\u04DA\u04DC\u04DE\u04E0\u04E2\u04E4\u04E6\u04E8\u04EA\u04EC\u04EE\u04F0\u04F2\u04F4\u04F6\u04F8\u04FA\u04FC\u04FE\u0500\u0502\u0504\u0506\u0508\u050A\u050C\u050E\u0510\u0512\u0514\u0516\u0518\u051A\u051C\u051E\u0520\u0522\u0524\u0526\u0531-\u0556\u10A0-\u10C5\u10C7\u10CD\u1E00\u1E02\u1E04\u1E06\u1E08\u1E0A\u1E0C\u1E0E\u1E10\u1E12\u1E14\u1E16\u1E18\u1E1A\u1E1C\u1E1E\u1E20\u1E22\u1E24\u1E26\u1E28\u1E2A\u1E2C\u1E2E\u1E30\u1E32\u1E34\u1E36\u1E38\u1E3A\u1E3C\u1E3E\u1E40\u1E42\u1E44\u1E46\u1E48\u1E4A\u1E4C\u1E4E\u1E50\u1E52\u1E54\u1E56\u1E58\u1E5A\u1E5C\u1E5E\u1E60\u1E62\u1E64\u1E66\u1E68\u1E6A\u1E6C\u1E6E\u1E70\u1E72\u1E74\u1E76\u1E78\u1E7A\u1E7C\u1E7E\u1E80\u1E82\u1E84\u1E86\u1E88\u1E8A\u1E8C\u1E8E\u1E90\u1E92\u1E94\u1E9E\u1EA0\u1EA2\u1EA4\u1EA6\u1EA8\u1EAA\u1EAC\u1EAE\u1EB0\u1EB2\u1EB4\u1EB6\u1EB8\u1EBA\u1EBC\u1EBE\u1EC0\u1EC2\u1EC4\u1EC6\u1EC8\u1ECA\u1ECC\u1ECE\u1ED0\u1ED2\u1ED4\u1ED6\u1ED8\u1EDA\u1EDC\u1EDE\u1EE0\u1EE2\u1EE4\u1EE6\u1EE8\u1EEA\u1EEC\u1EEE\u1EF0\u1EF2\u1EF4\u1EF6\u1EF8\u1EFA\u1EFC\u1EFE\u1F08-\u1F0F\u1F18-\u1F1D\u1F28-\u1F2F\u1F38-\u1F3F\u1F48-\u1F4D\u1F59\u1F5B\u1F5D\u1F5F\u1F68-\u1F6F\u1FB8-\u1FBB\u1FC8-\u1FCB\u1FD8-\u1FDB\u1FE8-\u1FEC\u1FF8-\u1FFB\u2102\u2107\u210B-\u210D\u2110-\u2112\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u2130-\u2133\u213E\u213F\u2145\u2183\u2C00-\u2C2E\u2C60\u2C62-\u2C64\u2C67\u2C69\u2C6B\u2C6D-\u2C70\u2C72\u2C75\u2C7E-\u2C80\u2C82\u2C84\u2C86\u2C88\u2C8A\u2C8C\u2C8E\u2C90\u2C92\u2C94\u2C96\u2C98\u2C9A\u2C9C\u2C9E\u2CA0\u2CA2\u2CA4\u2CA6\u2CA8\u2CAA\u2CAC\u2CAE\u2CB0\u2CB2\u2CB4\u2CB6\u2CB8\u2CBA\u2CBC\u2CBE\u2CC0\u2CC2\u2CC4\u2CC6\u2CC8\u2CCA\u2CCC\u2CCE\u2CD0\u2CD2\u2CD4\u2CD6\u2CD8\u2CDA\u2CDC\u2CDE\u2CE0\u2CE2\u2CEB\u2CED\u2CF2\uA640\uA642\uA644\uA646\uA648\uA64A\uA64C\uA64E\uA650\uA652\uA654\uA656\uA658\uA65A\uA65C\uA65E\uA660\uA662\uA664\uA666\uA668\uA66A\uA66C\uA680\uA682\uA684\uA686\uA688\uA68A\uA68C\uA68E\uA690\uA692\uA694\uA696\uA722\uA724\uA726\uA728\uA72A\uA72C\uA72E\uA732\uA734\uA736\uA738\uA73A\uA73C\uA73E\uA740\uA742\uA744\uA746\uA748\uA74A\uA74C\uA74E\uA750\uA752\uA754\uA756\uA758\uA75A\uA75C\uA75E\uA760\uA762\uA764\uA766\uA768\uA76A\uA76C\uA76E\uA779\uA77B\uA77D\uA77E\uA780\uA782\uA784\uA786\uA78B\uA78D\uA790\uA792\uA7A0\uA7A2\uA7A4\uA7A6\uA7A8\uA7AA\uFF21-\uFF3A\u01C5\u01C8\u01CB\u01F2\u1F88-\u1F8F\u1F98-\u1F9F\u1FA8-\u1FAF\u1FBC\u1FCC\u1FFC\u02B0-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0374\u037A\u0559\u0640\u06E5\u06E6\u07F4\u07F5\u07FA\u081A\u0824\u0828\u0971\u0E46\u0EC6\u10FC\u17D7\u1843\u1AA7\u1C78-\u1C7D\u1D2C-\u1D6A\u1D78\u1D9B-\u1DBF\u2071\u207F\u2090-\u209C\u2C7C\u2C7D\u2D6F\u2E2F\u3005\u3031-\u3035\u303B\u309D\u309E\u30FC-\u30FE\uA015\uA4F8-\uA4FD\uA60C\uA67F\uA717-\uA71F\uA770\uA788\uA7F8\uA7F9\uA9CF\uAA70\uAADD\uAAF3\uAAF4\uFF70\uFF9E\uFF9F\u00AA\u00BA\u01BB\u01C0-\u01C3\u0294\u05D0-\u05EA\u05F0-\u05F2\u0620-\u063F\u0641-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u0800-\u0815\u0840-\u0858\u08A0\u08A2-\u08AC\u0904-\u0939\u093D\u0950\u0958-\u0961\u0972-\u0977\u0979-\u097F\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C33\u0C35-\u0C39\u0C3D\u0C58\u0C59\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D60\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E45\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10D0-\u10FA\u10FD-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17DC\u1820-\u1842\u1844-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191C\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19C1-\u19C7\u1A00-\u1A16\u1A20-\u1A54\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C77\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u2135-\u2138\u2D30-\u2D67\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u3006\u303C\u3041-\u3096\u309F\u30A1-\u30FA\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA014\uA016-\uA48C\uA4D0-\uA4F7\uA500-\uA60B\uA610-\uA61F\uA62A\uA62B\uA66E\uA6A0-\uA6E5\uA7FB-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA6F\uAA71-\uAA76\uAA7A\uAA80-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB\uAADC\uAAE0-\uAAEA\uAAF2\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uABC0-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF66-\uFF6F\uFF71-\uFF9D\uFFA0-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]").test(String.fromCharCode(value));
            },

            isHighSurrogate: function (value) {
                return new RegExp("[\uD800-\uDBFF]").test(String.fromCharCode(value));
            },

            isLowSurrogate: function (value) {
                return new RegExp("[\uDC00-\uDFFF]").test(String.fromCharCode(value));
            },

            isSurrogate: function (value) {
                return new RegExp("[\uD800-\uDFFF]").test(String.fromCharCode(value));
            },

            isNull: function (value) {
                return new RegExp("\u0000").test(String.fromCharCode(value));
            },

            isSymbol: function (value) {
                if (value < 256) {
                    return ([36, 43, 60, 61, 62, 94, 96, 124, 126, 162, 163, 164, 165, 166, 167, 168, 169, 172, 174, 175, 176, 177, 180, 182, 184, 215, 247].indexOf(value) != -1);
                }

                return new RegExp("[\u20A0-\u20CF\u20D0-\u20FF\u2100-\u214F\u2150-\u218F\u2190-\u21FF\u2200-\u22FF\u2300-\u23FF\u25A0-\u25FF\u2600-\u26FF\u2700-\u27BF\u27C0-\u27EF\u27F0-\u27FF\u2800-\u28FF\u2900-\u297F\u2980-\u29FF\u2A00-\u2AFF\u2B00-\u2BFF]").test(String.fromCharCode(value));
            },

            isSeparator: function (value) {
                if (value < 256) {
                    return (value == 32 || value == 160);
                }

                return new RegExp("[\u2028\u2029\u0020\u00A0\u1680\u180E\u2000-\u200A\u202F\u205F\u3000]").test(String.fromCharCode(value));
            },

            isPunctuation: function (value) {
                if (value < 256) {
                    return ([33, 34, 35, 37, 38, 39, 40, 41, 42, 44, 45, 46, 47, 58, 59, 63, 64, 91, 92, 93, 95, 123, 125, 161, 171, 173, 183, 187, 191].indexOf(value) != -1);
                }

                return new RegExp("[\u0021-\u0023\u0025-\u002A\u002C-\u002F\u003A\u003B\u003F\u0040\u005B-\u005D\u005F\u007B\u007D\u00A1\u00A7\u00AB\u00B6\u00B7\u00BB\u00BF\u037E\u0387\u055A-\u055F\u0589\u058A\u05BE\u05C0\u05C3\u05C6\u05F3\u05F4\u0609\u060A\u060C\u060D\u061B\u061E\u061F\u066A-\u066D\u06D4\u0700-\u070D\u07F7-\u07F9\u0830-\u083E\u085E\u0964\u0965\u0970\u0AF0\u0DF4\u0E4F\u0E5A\u0E5B\u0F04-\u0F12\u0F14\u0F3A-\u0F3D\u0F85\u0FD0-\u0FD4\u0FD9\u0FDA\u104A-\u104F\u10FB\u1360-\u1368\u1400\u166D\u166E\u169B\u169C\u16EB-\u16ED\u1735\u1736\u17D4-\u17D6\u17D8-\u17DA\u1800-\u180A\u1944\u1945\u1A1E\u1A1F\u1AA0-\u1AA6\u1AA8-\u1AAD\u1B5A-\u1B60\u1BFC-\u1BFF\u1C3B-\u1C3F\u1C7E\u1C7F\u1CC0-\u1CC7\u1CD3\u2010-\u2027\u2030-\u2043\u2045-\u2051\u2053-\u205E\u207D\u207E\u208D\u208E\u2329\u232A\u2768-\u2775\u27C5\u27C6\u27E6-\u27EF\u2983-\u2998\u29D8-\u29DB\u29FC\u29FD\u2CF9-\u2CFC\u2CFE\u2CFF\u2D70\u2E00-\u2E2E\u2E30-\u2E3B\u3001-\u3003\u3008-\u3011\u3014-\u301F\u3030\u303D\u30A0\u30FB\uA4FE\uA4FF\uA60D-\uA60F\uA673\uA67E\uA6F2-\uA6F7\uA874-\uA877\uA8CE\uA8CF\uA8F8-\uA8FA\uA92E\uA92F\uA95F\uA9C1-\uA9CD\uA9DE\uA9DF\uAA5C-\uAA5F\uAADE\uAADF\uAAF0\uAAF1\uABEB\uFD3E\uFD3F\uFE10-\uFE19\uFE30-\uFE52\uFE54-\uFE61\uFE63\uFE68\uFE6A\uFE6B\uFF01-\uFF03\uFF05-\uFF0A\uFF0C-\uFF0F\uFF1A\uFF1B\uFF1F\uFF20\uFF3B-\uFF3D\uFF3F\uFF5B\uFF5D\uFF5F-\uFF65\u002D\u058A\u05BE\u1400\u1806\u2010-\u2015\u2E17\u2E1A\u2E3A\u2E3B\u301C\u3030\u30A0\uFE31\uFE32\uFE58\uFE63\uFF0D\u0028\u005B\u007B\u0F3A\u0F3C\u169B\u201A\u201E\u2045\u207D\u208D\u2329\u2768\u276A\u276C\u276E\u2770\u2772\u2774\u27C5\u27E6\u27E8\u27EA\u27EC\u27EE\u2983\u2985\u2987\u2989\u298B\u298D\u298F\u2991\u2993\u2995\u2997\u29D8\u29DA\u29FC\u2E22\u2E24\u2E26\u2E28\u3008\u300A\u300C\u300E\u3010\u3014\u3016\u3018\u301A\u301D\uFD3E\uFE17\uFE35\uFE37\uFE39\uFE3B\uFE3D\uFE3F\uFE41\uFE43\uFE47\uFE59\uFE5B\uFE5D\uFF08\uFF3B\uFF5B\uFF5F\uFF62\u0029\u005D\u007D\u0F3B\u0F3D\u169C\u2046\u207E\u208E\u232A\u2769\u276B\u276D\u276F\u2771\u2773\u2775\u27C6\u27E7\u27E9\u27EB\u27ED\u27EF\u2984\u2986\u2988\u298A\u298C\u298E\u2990\u2992\u2994\u2996\u2998\u29D9\u29DB\u29FD\u2E23\u2E25\u2E27\u2E29\u3009\u300B\u300D\u300F\u3011\u3015\u3017\u3019\u301B\u301E\u301F\uFD3F\uFE18\uFE36\uFE38\uFE3A\uFE3C\uFE3E\uFE40\uFE42\uFE44\uFE48\uFE5A\uFE5C\uFE5E\uFF09\uFF3D\uFF5D\uFF60\uFF63\u00AB\u2018\u201B\u201C\u201F\u2039\u2E02\u2E04\u2E09\u2E0C\u2E1C\u2E20\u00BB\u2019\u201D\u203A\u2E03\u2E05\u2E0A\u2E0D\u2E1D\u2E21\u005F\u203F\u2040\u2054\uFE33\uFE34\uFE4D-\uFE4F\uFF3F\u0021-\u0023\u0025-\u0027\u002A\u002C\u002E\u002F\u003A\u003B\u003F\u0040\u005C\u00A1\u00A7\u00B6\u00B7\u00BF\u037E\u0387\u055A-\u055F\u0589\u05C0\u05C3\u05C6\u05F3\u05F4\u0609\u060A\u060C\u060D\u061B\u061E\u061F\u066A-\u066D\u06D4\u0700-\u070D\u07F7-\u07F9\u0830-\u083E\u085E\u0964\u0965\u0970\u0AF0\u0DF4\u0E4F\u0E5A\u0E5B\u0F04-\u0F12\u0F14\u0F85\u0FD0-\u0FD4\u0FD9\u0FDA\u104A-\u104F\u10FB\u1360-\u1368\u166D\u166E\u16EB-\u16ED\u1735\u1736\u17D4-\u17D6\u17D8-\u17DA\u1800-\u1805\u1807-\u180A\u1944\u1945\u1A1E\u1A1F\u1AA0-\u1AA6\u1AA8-\u1AAD\u1B5A-\u1B60\u1BFC-\u1BFF\u1C3B-\u1C3F\u1C7E\u1C7F\u1CC0-\u1CC7\u1CD3\u2016\u2017\u2020-\u2027\u2030-\u2038\u203B-\u203E\u2041-\u2043\u2047-\u2051\u2053\u2055-\u205E\u2CF9-\u2CFC\u2CFE\u2CFF\u2D70\u2E00\u2E01\u2E06-\u2E08\u2E0B\u2E0E-\u2E16\u2E18\u2E19\u2E1B\u2E1E\u2E1F\u2E2A-\u2E2E\u2E30-\u2E39\u3001-\u3003\u303D\u30FB\uA4FE\uA4FF\uA60D-\uA60F\uA673\uA67E\uA6F2-\uA6F7\uA874-\uA877\uA8CE\uA8CF\uA8F8-\uA8FA\uA92E\uA92F\uA95F\uA9C1-\uA9CD\uA9DE\uA9DF\uAA5C-\uAA5F\uAADE\uAADF\uAAF0\uAAF1\uABEB\uFE10-\uFE16\uFE19\uFE30\uFE45\uFE46\uFE49-\uFE4C\uFE50-\uFE52\uFE54-\uFE57\uFE5F-\uFE61\uFE68\uFE6A\uFE6B\uFF01-\uFF03\uFF05-\uFF07\uFF0A\uFF0C\uFF0E\uFF0F\uFF1A\uFF1B\uFF1F\uFF20\uFF3C\uFF61\uFF64\uFF65]").test(String.fromCharCode(value));
            },

            isNumber: function (value) {
                if (value < 256) {
                    return ([48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 178, 179, 185, 188, 189, 190].indexOf(value) != -1);
                }

                return new RegExp("[\u0030-\u0039\u00B2\u00B3\u00B9\u00BC-\u00BE\u0660-\u0669\u06F0-\u06F9\u07C0-\u07C9\u0966-\u096F\u09E6-\u09EF\u09F4-\u09F9\u0A66-\u0A6F\u0AE6-\u0AEF\u0B66-\u0B6F\u0B72-\u0B77\u0BE6-\u0BF2\u0C66-\u0C6F\u0C78-\u0C7E\u0CE6-\u0CEF\u0D66-\u0D75\u0E50-\u0E59\u0ED0-\u0ED9\u0F20-\u0F33\u1040-\u1049\u1090-\u1099\u1369-\u137C\u16EE-\u16F0\u17E0-\u17E9\u17F0-\u17F9\u1810-\u1819\u1946-\u194F\u19D0-\u19DA\u1A80-\u1A89\u1A90-\u1A99\u1B50-\u1B59\u1BB0-\u1BB9\u1C40-\u1C49\u1C50-\u1C59\u2070\u2074-\u2079\u2080-\u2089\u2150-\u2182\u2185-\u2189\u2460-\u249B\u24EA-\u24FF\u2776-\u2793\u2CFD\u3007\u3021-\u3029\u3038-\u303A\u3192-\u3195\u3220-\u3229\u3248-\u324F\u3251-\u325F\u3280-\u3289\u32B1-\u32BF\uA620-\uA629\uA6E6-\uA6EF\uA830-\uA835\uA8D0-\uA8D9\uA900-\uA909\uA9D0-\uA9D9\uAA50-\uAA59\uABF0-\uABF9\uFF10-\uFF19\u0030-\u0039\u0660-\u0669\u06F0-\u06F9\u07C0-\u07C9\u0966-\u096F\u09E6-\u09EF\u0A66-\u0A6F\u0AE6-\u0AEF\u0B66-\u0B6F\u0BE6-\u0BEF\u0C66-\u0C6F\u0CE6-\u0CEF\u0D66-\u0D6F\u0E50-\u0E59\u0ED0-\u0ED9\u0F20-\u0F29\u1040-\u1049\u1090-\u1099\u17E0-\u17E9\u1810-\u1819\u1946-\u194F\u19D0-\u19D9\u1A80-\u1A89\u1A90-\u1A99\u1B50-\u1B59\u1BB0-\u1BB9\u1C40-\u1C49\u1C50-\u1C59\uA620-\uA629\uA8D0-\uA8D9\uA900-\uA909\uA9D0-\uA9D9\uAA50-\uAA59\uABF0-\uABF9\uFF10-\uFF19\u16EE-\u16F0\u2160-\u2182\u2185-\u2188\u3007\u3021-\u3029\u3038-\u303A\uA6E6-\uA6EF\u00B2\u00B3\u00B9\u00BC-\u00BE\u09F4-\u09F9\u0B72-\u0B77\u0BF0-\u0BF2\u0C78-\u0C7E\u0D70-\u0D75\u0F2A-\u0F33\u1369-\u137C\u17F0-\u17F9\u19DA\u2070\u2074-\u2079\u2080-\u2089\u2150-\u215F\u2189\u2460-\u249B\u24EA-\u24FF\u2776-\u2793\u2CFD\u3192-\u3195\u3220-\u3229\u3248-\u324F\u3251-\u325F\u3280-\u3289\u32B1-\u32BF\uA830-\uA835]").test(String.fromCharCode(value));
            },

            isControl: function (value) {
                if (value < 256) {
                    return (value >= 0 && value <= 31) || (value >= 127 && value <= 159);
                }

                return new RegExp("[\u0000-\u001F\u007F\u0080-\u009F]").test(String.fromCharCode(value));
            }
        }
    });

    Bridge.Class.addExtend(System.Char, [System.IComparable$1(System.Char), System.IEquatable$1(System.Char)]);

    // @source formattableString.js

    Bridge.define("System.FormattableString", {
        inherits: [System.IFormattable],
        statics: {
            invariant: function (formattable) {
                return formattable.toString$1(System.Globalization.CultureInfo.invariantCulture);
            }
        },
        toString: function () {
            return this.toString$1(System.Globalization.CultureInfo.getCurrentCulture());
        },
        System$IFormattable$format: function (format, formatProvider) {
            return this.toString$1(formatProvider);
        }
    });

    // @source formattableStringImpl.js

    Bridge.define("System.FormattableStringImpl", {
        inherits: [System.FormattableString],
        args: null,
        format: null,
        ctor: function (format, args) {
            if (args === void 0) { args = []; }

            this.$initialize();
            System.FormattableString.ctor.call(this);
            this.format = format;
            this.args = args;
        },
        getArgumentCount: function () {
            return this.args.length;
        },
        getFormat: function () {
            return this.format;
        },
        getArgument: function (index) {
            return this.args[index];
        },
        getArguments: function () {
            return this.args;
        },
        toString$1: function (formatProvider) {
            return System.String.formatProvider.apply(System.String, [formatProvider, this.format].concat(this.args));
        }
    });

    // @source formattableStringFactory.js

    Bridge.define("System.Runtime.CompilerServices.FormattableStringFactory", {
        statics: {
            create: function (format, args) {
                if (args === void 0) { args = []; }
                return new System.FormattableStringImpl(format, args);
            }
        }
    });

    // @source Exception.js

    Bridge.define("System.Exception", {
        ctor: function (message, innerException) {
            this.$initialize();
            this.message = message ? message : ("Exception of type '" + Bridge.getTypeName(this) + "' was thrown.");
            this.innerException = innerException ? innerException : null;
            this.errorStack = new Error();
            this.data = new(System.Collections.Generic.Dictionary$2(Object, Object))();
        },

        getMessage: function () {
            return this.message;
        },

        getInnerException: function () {
            return this.innerException;
        },

        getStackTrace: function () {
            return this.errorStack.stack;
        },

        getData: function () {
            return this.data;
        },

        toString: function () {
            return this.getMessage();
        },

        statics: {
            create: function (error) {
                if (Bridge.is(error, System.Exception)) {
                    return error;
                }

                if (error instanceof TypeError) {
                    return new System.NullReferenceException(error.message, new Bridge.ErrorException(error));
                } else if (error instanceof RangeError) {
                    return new System.ArgumentOutOfRangeException(null, error.message, new Bridge.ErrorException(error));
                } else if (error instanceof Error) {
                    return new Bridge.ErrorException(error);
                } else {
                    return new System.Exception(error ? error.toString() : null);
                }
            }
        }
    });

    Bridge.define("System.SystemException", {
        inherits: [System.Exception],

        ctor: function (message, innerException) {
            this.$initialize();
            System.Exception.ctor.call(this, message || "System error.", innerException);
        }
    });

    Bridge.define("System.OutOfMemoryException", {
        inherits: [System.SystemException],

        ctor: function (message, innerException) {
            this.$initialize();

            if (!message) {
                message = "Insufficient memory to continue the execution of the program.";
            }

            System.SystemException.ctor.call(this, message, innerException);
        }
    });

    Bridge.define("System.IndexOutOfRangeException", {
        inherits: [System.SystemException],

        ctor: function (message, innerException) {
            this.$initialize();

            if (!message) {
                message = "Index was outside the bounds of the array.";
            }

            System.SystemException.ctor.call(this, message, innerException);
        }
    });

    Bridge.define("System.TimeoutException", {
        inherits: [System.SystemException],

        ctor: function (message, innerException) {
            this.$initialize();

            if (!message) {
                message = "The operation has timed out.";
            }

            System.SystemException.ctor.call(this, message, innerException);
        }
    });

    Bridge.define("System.RegexMatchTimeoutException", {
        inherits: [System.TimeoutException],

        _regexInput: "",

        _regexPattern: "",

        _matchTimeout: null,

        config: {
            init: function () {
                this._matchTimeout = System.TimeSpan.fromTicks(-1);
            }
        },

        ctor: function () {
            this.$initialize();
            System.TimeoutException.ctor.call(this);
        },

        $ctor1: function (message) {
            this.$initialize();
            System.TimeoutException.ctor.call(this, message);
        },

        $ctor2: function (message, innerException) {
            this.$initialize();
            System.TimeoutException.ctor.call(this, message, innerException);
        },

        $ctor3: function (regexInput, regexPattern, matchTimeout) {
            this.$initialize();
            this._regexInput = regexInput;
            this._regexPattern = regexPattern;
            this._matchTimeout = matchTimeout;

            var message = "The RegEx engine has timed out while trying to match a pattern to an input string. This can occur for many reasons, including very large inputs or excessive backtracking caused by nested quantifiers, back-references and other factors.";
            this.$ctor1(message);
        },

        getPattern: function () {
            return this._regexPattern;
        },

        getInput: function () {
            return this._regexInput;
        },

        getMatchTimeout: function () {
            return this._matchTimeout;
        }
    });

    Bridge.define("Bridge.ErrorException", {
        inherits: [System.Exception],

        ctor: function (error) {
            this.$initialize();
            System.Exception.ctor.call(this, error.message);
            this.errorStack = error;
            this.error = error;
        },

        getError: function () {
            return this.error;
        }
    });

    Bridge.define("System.ArgumentException", {
        inherits: [System.Exception],

        ctor: function (message, paramName, innerException) {
            this.$initialize();
            System.Exception.ctor.call(this, message || "Value does not fall within the expected range.", innerException);
            this.paramName = paramName ? paramName : null;
        },

        getParamName: function () {
            return this.paramName;
        }
    });

    Bridge.define("System.ArgumentNullException", {
        inherits: [System.ArgumentException],

        ctor: function (paramName, message, innerException) {
            this.$initialize();

            if (!message) {
                message = "Value cannot be null.";

                if (paramName) {
                    message += "\nParameter name: " + paramName;
                }
            }

            System.ArgumentException.ctor.call(this, message, paramName, innerException);
        }
    });

    Bridge.define("System.ArgumentOutOfRangeException", {
        inherits: [System.ArgumentException],

        ctor: function (paramName, message, innerException, actualValue) {
            this.$initialize();

            if (!message) {
                message = "Value is out of range.";

                if (paramName) {
                    message += "\nParameter name: " + paramName;
                }
            }

            System.ArgumentException.ctor.call(this, message, paramName, innerException);

            this.actualValue = actualValue ? actualValue : null;
        },

        getActualValue: function () {
            return this.actualValue;
        }
    });

    Bridge.define("System.Globalization.CultureNotFoundException", {
        inherits: [System.ArgumentException],

        ctor: function (paramName, invalidCultureName, message, innerException, invalidCultureId) {
            this.$initialize();

            if (!message) {
                message = "Culture is not supported.";

                if (paramName) {
                    message += "\nParameter name: " + paramName;
                }

                if (invalidCultureName) {
                    message += "\n" + invalidCultureName + " is an invalid culture identifier.";
                }
            }

            System.ArgumentException.ctor.call(this, message, paramName, innerException);

            this.invalidCultureName = invalidCultureName ? invalidCultureName : null;
            this.invalidCultureId = invalidCultureId ? invalidCultureId : null;
        },

        getInvalidCultureName: function () {
            return this.invalidCultureName;
        },

        getInvalidCultureId: function () {
            return this.invalidCultureId;
        }
    });

    Bridge.define("System.Collections.Generic.KeyNotFoundException", {
        inherits: [System.Exception],

        ctor: function (message, innerException) {
            this.$initialize();
            System.Exception.ctor.call(this, message || "Key not found.", innerException);
        }
    });

    Bridge.define("System.ArithmeticException", {
        inherits: [System.Exception],

        ctor: function (message, innerException) {
            this.$initialize();
            System.Exception.ctor.call(this, message || "Overflow or underflow in the arithmetic operation.", innerException);
        }
    });

    Bridge.define("System.DivideByZeroException", {
        inherits: [System.ArithmeticException],

        ctor: function (message, innerException) {
            this.$initialize();
            System.ArithmeticException.ctor.call(this, message || "Division by 0.", innerException);
        }
    });

    Bridge.define("System.OverflowException", {
        inherits: [System.ArithmeticException],

        ctor: function (message, innerException) {
            this.$initialize();
            System.ArithmeticException.ctor.call(this, message || "Arithmetic operation resulted in an overflow.", innerException);
        }
    });

    Bridge.define("System.FormatException", {
        inherits: [System.Exception],

        ctor: function (message, innerException) {
            this.$initialize();
            System.Exception.ctor.call(this, message || "Invalid format.", innerException);
        }
    });

    Bridge.define("System.InvalidCastException", {
        inherits: [System.Exception],

        ctor: function (message, innerException) {
            this.$initialize();
            System.Exception.ctor.call(this, message || "The cast is not valid.", innerException);
        }
    });

    Bridge.define("System.InvalidOperationException", {
        inherits: [System.Exception],

        ctor: function (message, innerException) {
            this.$initialize();
            System.Exception.ctor.call(this, message || "Operation is not valid due to the current state of the object.", innerException);
        }
    });

    Bridge.define("System.NotImplementedException", {
        inherits: [System.Exception],

        ctor: function (message, innerException) {
            this.$initialize();
            System.Exception.ctor.call(this, message || "The method or operation is not implemented.", innerException);
        }
    });

    Bridge.define("System.NotSupportedException", {
        inherits: [System.Exception],

        ctor: function (message, innerException) {
            this.$initialize();
            System.Exception.ctor.call(this, message || "Specified method is not supported.", innerException);
        }
    });

    Bridge.define("System.NullReferenceException", {
        inherits: [System.Exception],

        ctor: function (message, innerException) {
            this.$initialize();
            System.Exception.ctor.call(this, message || "Object is null.", innerException);
        }
    });

    Bridge.define("System.RankException", {
        inherits: [System.Exception],

        ctor: function (message, innerException) {
            this.$initialize();
            System.Exception.ctor.call(this, message || "Attempted to operate on an array with the incorrect number of dimensions.", innerException);
        }
    });

    Bridge.define("Bridge.PromiseException", {
        inherits: [System.Exception],

        ctor: function (args, message, innerException) {
            this.$initialize();
            this.arguments = System.Array.clone(args);

            if (message == null) {
                message = "Promise exception: [";
                message += this.arguments.map(function (item) { return item == null ? "null" : item.toString(); }).join(", ");
                message += "]";
            }

            System.Exception.ctor.call(this, message, innerException);
        },

        getArguments: function () {
            return this.arguments;
        }
    });

    Bridge.define("System.OperationCanceledException", {
        inherits: [System.Exception],

        ctor: function (message, token, innerException) {
            this.$initialize();
            System.Exception.ctor.call(this, message || "Operation was canceled.", innerException);
            this.cancellationToken = token || System.Threading.CancellationToken.none;
        }
    });

    Bridge.define("System.Threading.Tasks.TaskCanceledException", {
        inherits: [System.OperationCanceledException],

        ctor: function (message, task, innerException) {
            this.$initialize();
            System.OperationCanceledException.ctor.call(this, message || "A task was canceled.", null, innerException);
            this.task = task || null;
        }
    });

    Bridge.define("System.AggregateException", {
        inherits: [System.Exception],

        ctor: function (message, innerExceptions) {
            this.$initialize();
            this.innerExceptions = new(System.Collections.ObjectModel.ReadOnlyCollection$1(System.Exception))(Bridge.hasValue(innerExceptions) ? Bridge.toArray(innerExceptions) : []);
            System.Exception.ctor.call(this, message || 'One or more errors occurred.', this.innerExceptions.items.length ? this.innerExceptions.items[0] : null);
        },

        handle: function (predicate) {
            if (!Bridge.hasValue(predicate)) {
                throw new System.ArgumentNullException("predicate");
            }

            var count = this.innerExceptions.getCount(),
                unhandledExceptions = [];

            for (var i = 0; i < count; i++) {
                if (!predicate(this.innerExceptions.get(i))) {
                    unhandledExceptions.push(this.innerExceptions.get(i));
                }
            }

            if (unhandledExceptions.length > 0) {
                throw new System.AggregateException(this.getMessage(), unhandledExceptions);
            }
        },

        flatten: function () {
            // Initialize a collection to contain the flattened exceptions.
            var flattenedExceptions = new(System.Collections.Generic.List$1(System.Exception))();

            // Create a list to remember all aggregates to be flattened, this will be accessed like a FIFO queue
            var exceptionsToFlatten = new(System.Collections.Generic.List$1(System.AggregateException))();
            exceptionsToFlatten.add(this);
            var nDequeueIndex = 0;

            // Continue removing and recursively flattening exceptions, until there are no more.
            while (exceptionsToFlatten.getCount() > nDequeueIndex) {
                // dequeue one from exceptionsToFlatten
                var currentInnerExceptions = exceptionsToFlatten.getItem(nDequeueIndex++).innerExceptions;

                for (var i = 0; i < currentInnerExceptions.getCount(); i++) {
                    var currentInnerException = currentInnerExceptions.get(i);

                    if (!Bridge.hasValue(currentInnerException)) {
                        continue;
                    }

                    var currentInnerAsAggregate = Bridge.as(currentInnerException, System.AggregateException);

                    // If this exception is an aggregate, keep it around for later.  Otherwise,
                    // simply add it to the list of flattened exceptions to be returned.
                    if (Bridge.hasValue(currentInnerAsAggregate)) {
                        exceptionsToFlatten.add(currentInnerAsAggregate);
                    } else {
                        flattenedExceptions.add(currentInnerException);
                    }
                }
            }

            return new System.AggregateException(this.getMessage(), flattenedExceptions);
        }
    });

    Bridge.define("System.Reflection.AmbiguousMatchException", {
        inherits: [System.Exception],

        ctor: function (message, innerException) {
            this.$initialize();
            System.Exception.ctor.call(this, message || "Ambiguous match.", innerException);
        }
    });

    // @source Globalization.js

    Bridge.define("System.Globalization.DateTimeFormatInfo", {
        inherits: [System.IFormatProvider, System.ICloneable],

        config: {
            alias: {
                getFormat: "System$IFormatProvider$getFormat"
            }
        },

        statics: {
            $allStandardFormats: {
                "d": "shortDatePattern",
                "D": "longDatePattern",
                "f": "longDatePattern shortTimePattern",
                "F": "longDatePattern longTimePattern",
                "g": "shortDatePattern shortTimePattern",
                "G": "shortDatePattern longTimePattern",
                "m": "monthDayPattern",
                "M": "monthDayPattern",
                "o": "roundtripFormat",
                "O": "roundtripFormat",
                "r": "rfc1123",
                "R": "rfc1123",
                "s": "sortableDateTimePattern",
                "S": "sortableDateTimePattern1",
                "t": "shortTimePattern",
                "T": "longTimePattern",
                "u": "universalSortableDateTimePattern",
                "U": "longDatePattern longTimePattern",
                "y": "yearMonthPattern",
                "Y": "yearMonthPattern"
            },

            ctor: function () {
                this.invariantInfo = Bridge.merge(new System.Globalization.DateTimeFormatInfo(), {
                    abbreviatedDayNames: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
                    abbreviatedMonthGenitiveNames: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", ""],
                    abbreviatedMonthNames: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", ""],
                    amDesignator: "AM",
                    dateSeparator: "/",
                    dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                    firstDayOfWeek: 0,
                    fullDateTimePattern: "dddd, dd MMMM yyyy HH:mm:ss",
                    longDatePattern: "dddd, dd MMMM yyyy",
                    longTimePattern: "HH:mm:ss",
                    monthDayPattern: "MMMM dd",
                    monthGenitiveNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December", ""],
                    monthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December", ""],
                    pmDesignator: "PM",
                    rfc1123: "ddd, dd MMM yyyy HH':'mm':'ss 'GMT'",
                    shortDatePattern: "MM/dd/yyyy",
                    shortestDayNames: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
                    shortTimePattern: "HH:mm",
                    sortableDateTimePattern: "yyyy'-'MM'-'dd'T'HH':'mm':'ss",
                    sortableDateTimePattern1: "yyyy'-'MM'-'dd",
                    timeSeparator: ":",
                    universalSortableDateTimePattern: "yyyy'-'MM'-'dd HH':'mm':'ss'Z'",
                    yearMonthPattern: "yyyy MMMM",
                    roundtripFormat: "yyyy'-'MM'-'dd'T'HH':'mm':'ss.uzzz"
                });
            }
        },

        getFormat: function (type) {
            switch (type) {
                case System.Globalization.DateTimeFormatInfo:
                    return this;
                default:
                    return null;
            }
        },

        getAbbreviatedDayName: function (dayofweek) {
            if (dayofweek < 0 || dayofweek > 6) {
                throw new System.ArgumentOutOfRangeException("dayofweek");
            }

            return this.abbreviatedDayNames[dayofweek];
        },

        getAbbreviatedMonthName: function (month) {
            if (month < 1 || month > 13) {
                throw new System.ArgumentOutOfRangeException("month");
            }

            return this.abbreviatedMonthNames[month - 1];
        },

        getAllDateTimePatterns: function (format, returnNull) {
            var f = System.Globalization.DateTimeFormatInfo.$allStandardFormats,
                formats,
                names,
                pattern,
                i,
                result = [];

            if (format) {
                if (!f[format]) {
                    if (returnNull) {
                        return null;
                    }

                    throw new System.ArgumentException(null, "format");
                }

                formats = {};
                formats[format] = f[format];
            } else {
                formats = f;
            }

            for (f in formats) {
                names = formats[f].split(" ");
                pattern = "";

                for (i = 0; i < names.length; i++) {
                    pattern = (i === 0 ? "" : (pattern + " ")) + this[names[i]];
                }

                result.push(pattern);
            }

            return result;
        },

        getDayName: function (dayofweek) {
            if (dayofweek < 0 || dayofweek > 6) {
                throw new System.ArgumentOutOfRangeException("dayofweek");
            }

            return this.dayNames[dayofweek];
        },

        getMonthName: function (month) {
            if (month < 1 || month > 13) {
                throw new System.ArgumentOutOfRangeException("month");
            }

            return this.monthNames[month - 1];
        },

        getShortestDayName: function (dayOfWeek) {
            if (dayOfWeek < 0 || dayOfWeek > 6) {
                throw new System.ArgumentOutOfRangeException("dayOfWeek");
            }

            return this.shortestDayNames[dayOfWeek];
        },

        clone: function () {
            return Bridge.copy(new System.Globalization.DateTimeFormatInfo(), this, [
                "abbreviatedDayNames",
                "abbreviatedMonthGenitiveNames",
                "abbreviatedMonthNames",
                "amDesignator",
                "dateSeparator",
                "dayNames",
                "firstDayOfWeek",
                "fullDateTimePattern",
                "longDatePattern",
                "longTimePattern",
                "monthDayPattern",
                "monthGenitiveNames",
                "monthNames",
                "pmDesignator",
                "rfc1123",
                "shortDatePattern",
                "shortestDayNames",
                "shortTimePattern",
                "sortableDateTimePattern",
                "timeSeparator",
                "universalSortableDateTimePattern",
                "yearMonthPattern",
                "roundtripFormat"
            ]);
        }
    });

    Bridge.define("System.Globalization.NumberFormatInfo", {
        inherits: [System.IFormatProvider, System.ICloneable],

        config: {
            alias: {
                getFormat: "System$IFormatProvider$getFormat"
            }
        },

        statics: {
            ctor: function () {
                this.numberNegativePatterns = ["(n)", "-n", "- n", "n-", "n -"];
                this.currencyNegativePatterns = ["($n)", "-$n", "$-n", "$n-", "(n$)", "-n$", "n-$", "n$-", "-n $", "-$ n", "n $-", "$ n-", "$ -n", "n- $", "($ n)", "(n $)"];
                this.currencyPositivePatterns = ["$n", "n$", "$ n", "n $"];
                this.percentNegativePatterns = ["-n %", "-n%", "-%n", "%-n", "%n-", "n-%", "n%-", "-% n", "n %-", "% n-", "% -n", "n- %"];
                this.percentPositivePatterns = ["n %", "n%", "%n", "% n"];

                this.invariantInfo = Bridge.merge(new System.Globalization.NumberFormatInfo(), {
                    nanSymbol: "NaN",
                    negativeSign: "-",
                    positiveSign: "+",
                    negativeInfinitySymbol: "-Infinity",
                    positiveInfinitySymbol: "Infinity",

                    percentSymbol: "%",
                    percentGroupSizes: [3],
                    percentDecimalDigits: 2,
                    percentDecimalSeparator: ".",
                    percentGroupSeparator: ",",
                    percentPositivePattern: 0,
                    percentNegativePattern: 0,

                    currencySymbol: "¤",
                    currencyGroupSizes: [3],
                    currencyDecimalDigits: 2,
                    currencyDecimalSeparator: ".",
                    currencyGroupSeparator: ",",
                    currencyNegativePattern: 0,
                    currencyPositivePattern: 0,

                    numberGroupSizes: [3],
                    numberDecimalDigits: 2,
                    numberDecimalSeparator: ".",
                    numberGroupSeparator: ",",
                    numberNegativePattern: 1
                });
            }
        },

        getFormat: function (type) {
            switch (type) {
                case System.Globalization.NumberFormatInfo:
                    return this;
                default:
                    return null;
            }
        },

        clone: function () {
            return Bridge.copy(new System.Globalization.NumberFormatInfo(), this, [
                "nanSymbol",
                "negativeSign",
                "positiveSign",
                "negativeInfinitySymbol",
                "positiveInfinitySymbol",
                "percentSymbol",
                "percentGroupSizes",
                "percentDecimalDigits",
                "percentDecimalSeparator",
                "percentGroupSeparator",
                "percentPositivePattern",
                "percentNegativePattern",
                "currencySymbol",
                "currencyGroupSizes",
                "currencyDecimalDigits",
                "currencyDecimalSeparator",
                "currencyGroupSeparator",
                "currencyNegativePattern",
                "currencyPositivePattern",
                "numberGroupSizes",
                "numberDecimalDigits",
                "numberDecimalSeparator",
                "numberGroupSeparator",
                "numberNegativePattern"
            ]);
        }
    });

    Bridge.define("System.Globalization.CultureInfo", {
        inherits: [System.IFormatProvider, System.ICloneable],

        config: {
            alias: {
                getFormat: "System$IFormatProvider$getFormat"
            }
        },

        $entryPoint: true,

        statics: {
            ctor: function () {
                this.cultures = this.cultures || {};

                this.invariantCulture = Bridge.merge(new System.Globalization.CultureInfo("iv", true), {
                    englishName: "Invariant Language (Invariant Country)",
                    nativeName: "Invariant Language (Invariant Country)",
                    numberFormat: System.Globalization.NumberFormatInfo.invariantInfo,
                    dateTimeFormat: System.Globalization.DateTimeFormatInfo.invariantInfo
                });

                this.setCurrentCulture(System.Globalization.CultureInfo.invariantCulture);
            },

            getCurrentCulture: function () {
                return this.currentCulture;
            },

            setCurrentCulture: function (culture) {
                this.currentCulture = culture;

                System.Globalization.DateTimeFormatInfo.currentInfo = culture.dateTimeFormat;
                System.Globalization.NumberFormatInfo.currentInfo = culture.numberFormat;
            },

            getCultureInfo: function (name) {
                if (!name) {
                    throw new System.ArgumentNullException("name");
                }

                return this.cultures[name];
            },

            getCultures: function () {
                var names = Bridge.getPropertyNames(this.cultures),
                    result = [],
                    i;

                for (i = 0; i < names.length; i++) {
                    result.push(this.cultures[names[i]]);
                }

                return result;
            }
        },

        ctor: function (name, create) {
            this.$initialize();
            this.name = name;

            if (!System.Globalization.CultureInfo.cultures) {
                System.Globalization.CultureInfo.cultures = {};
            }

            if (System.Globalization.CultureInfo.cultures[name]) {
                Bridge.copy(this, System.Globalization.CultureInfo.cultures[name], [
                    "englishName",
                    "nativeName",
                    "numberFormat",
                    "dateTimeFormat"
                ]);
            } else {
                if (!create) {
                    throw new System.Globalization.CultureNotFoundException("name", name);
                }

                System.Globalization.CultureInfo.cultures[name] = this;
            }
        },

        getFormat: function (type) {
            switch (type) {
                case System.Globalization.NumberFormatInfo:
                    return this.numberFormat;
                case System.Globalization.DateTimeFormatInfo:
                    return this.dateTimeFormat;
                default:
                    return null;
            }
        },

        clone: function () {
            return new System.Globalization.CultureInfo(this.name);
        }
    });

    // @source Math.js

    Bridge.Math = {
        divRem: function (a, b, result) {
            var remainder = a % b;

            result.v = remainder;

            return (a - remainder) / b;
        },

        round: function (n, d, rounding) {
            var m = Math.pow(10, d || 0);

            n *= m;

            var sign = (n > 0) | -(n < 0);

            if (n % 1 === 0.5 * sign) {
                var f = Math.floor(n);

                return (f + (rounding === 4 ? (sign > 0) : (f % 2 * sign))) / m;
            }

            return Math.round(n) / m;
        },

        log10: Math.log10 || function (x) {
            return Math.log(x) / Math.LN10;
        },

        logWithBase: function (x, newBase) {
            if (isNaN(x)) {
                return x;
            }

            if (isNaN(newBase)) {
                return newBase;
            }

            if (newBase === 1) {
                return NaN
            }

            if (x !== 1 && (newBase === 0 || newBase === Number.POSITIVE_INFINITY)) {
                return NaN;
            }

            return Bridge.Math.log10(x) / Bridge.Math.log10(newBase);
        },

        log: function (x) {
            if (x === 0.0) {
                return Number.NEGATIVE_INFINITY;
            }

            if (x < 0.0 || isNaN(x)) {
                return NaN;
            }

            if (x === Number.POSITIVE_INFINITY) {
                return Number.POSITIVE_INFINITY;
            }

            if (x === Number.NEGATIVE_INFINITY) {
                return NaN;
            }

            return Math.log(x);
        },

        sinh: Math.sinh || function (x) {
            return (Math.exp(x) - Math.exp(-x)) / 2;
        },

        cosh: Math.cosh || function (x) {
            return (Math.exp(x) + Math.exp(-x)) / 2;
        },

        tanh: Math.tanh || function (x) {
            if (x === Infinity) {
                return 1;
            } else if (x === -Infinity) {
                return -1;
            } else {
                var y = Math.exp(2 * x);
                return (y - 1) / (y + 1);
            }
        }
    };

    // @source Bool.js

    var _boolean = {
        trueString: "True",
        falseString: "False",

        is: function (obj, type) {
            if (type === System.IComparable ||
                type === System.IEquatable$1(Boolean) ||
                type === System.IComparable$1(Boolean)) {
                return true;
            }

            return false;
        },

        $is: function (instance) {
            return typeof (instance) === "boolean";
        },

        getDefaultValue: function () {
            return false;
        },

        toString: function (v) {
            return v ? System.Boolean.trueString : System.Boolean.falseString;
        },

        parse: function (value) {
            if (!Bridge.hasValue(value)) {
                throw new System.ArgumentNullException("value");
            }

            var result = {
                v: false
            };

            if (!System.Boolean.tryParse(value, result)) {
                throw new System.FormatException("Bad format for Boolean value");
            }

            return result.v;
        },

        tryParse: function (value, result) {
            result.v = false;

            if (!Bridge.hasValue(value)) {
                return false;
            }

            if (System.String.equals(System.Boolean.trueString, value, 5)) {
                result.v = true;
                return true;
            }

            if (System.String.equals(System.Boolean.falseString, value, 5)) {
                result.v = false;
                return true;
            }

            var start = 0,
                end = value.length - 1;

            while (start < value.length) {
                if (!System.Char.isWhiteSpace(value[start]) && !System.Char.isNull(value.charCodeAt(start))) {
                    break;
                }

                start++;
            }

            while (end >= start) {
                if (!System.Char.isWhiteSpace(value[end]) && !System.Char.isNull(value.charCodeAt(end))) {
                    break;
                }

                end--;
            }

            value = value.substr(start, end - start + 1);

            if (System.String.equals(System.Boolean.trueString, value, 5)) {
                result.v = true;
                return true;
            }

            if (System.String.equals(System.Boolean.falseString, value, 5)) {
                result.v = false;
                return true;
            }

            return false;
        }
    };

    System.Boolean = _boolean;

    // @source Integer.js

    (function () {
        var createIntType = function (name, min, max, precision) {
            var type = Bridge.define(name, {
                inherits: [System.IComparable, System.IFormattable],

                statics: {
                    $number: true,
                    min: min,
                    max: max,
                    precision: precision,

                    $is: function (instance) {
                        return typeof (instance) === "number" && Math.floor(instance, 0) === instance && instance >= min && instance <= max;
                    },
                    getDefaultValue: function () {
                        return 0;
                    },
                    parse: function (s, radix) {
                        return Bridge.Int.parseInt(s, min, max, radix);
                    },
                    tryParse: function (s, result, radix) {
                        return Bridge.Int.tryParseInt(s, result, min, max, radix);
                    },
                    format: function (number, format, provider) {
                        return Bridge.Int.format(number, format, provider, type);
                    }
                }
            });

            type.$kind = "";
            Bridge.Class.addExtend(type, [System.IComparable$1(type), System.IEquatable$1(type)]);
        };

        createIntType("System.Byte", 0, 255, 3);
        createIntType("System.SByte", -128, 127, 3);
        createIntType("System.Int16", -32768, 32767, 5);
        createIntType("System.UInt16", 0, 65535, 5);
        createIntType("System.Int32", -2147483648, 2147483647, 10);
        createIntType("System.UInt32", 0, 4294967295, 10);
    })();

    Bridge.define("Bridge.Int", {
        inherits: [System.IComparable, System.IFormattable],
        statics: {
            $number: true,

            $is: function (instance) {
                return typeof (instance) === "number" && isFinite(instance) && Math.floor(instance, 0) === instance;
            },

            getDefaultValue: function () {
                return 0;
            },

            format: function (number, format, provider, T) {
                var nf = (provider || System.Globalization.CultureInfo.getCurrentCulture()).getFormat(System.Globalization.NumberFormatInfo),
                    decimalSeparator = nf.numberDecimalSeparator,
                    groupSeparator = nf.numberGroupSeparator,
                    isDecimal = number instanceof System.Decimal,
                    isLong = number instanceof System.Int64 || number instanceof System.UInt64,
                    isNeg = isDecimal || isLong ? (number.isZero() ? false : number.isNegative()) : number < 0,
                    match,
                    precision,
                    groups,
                    fs;

                if (!isLong && (isDecimal ? !number.isFinite() : !isFinite(number))) {
                    return Number.NEGATIVE_INFINITY === number || (isDecimal && isNeg) ? nf.negativeInfinitySymbol : (isNaN(number) ? nf.nanSymbol : nf.positiveInfinitySymbol);
                }

                if (!format) {
                    format = "G";
                }

                match = format.match(/^([a-zA-Z])(\d*)$/);

                if (match) {
                    fs = match[1].toUpperCase();
                    precision = parseInt(match[2], 10);
                    precision = precision > 15 ? 15 : precision;

                    switch (fs) {
                        case "D":
                            return this.defaultFormat(number, isNaN(precision) ? 1 : precision, 0, 0, nf, true);
                        case "F":
                        case "N":
                            if (isNaN(precision)) {
                                precision = nf.numberDecimalDigits;
                            }

                            return this.defaultFormat(number, 1, precision, precision, nf, fs === "F");
                        case "G":
                        case "E":
                            var exponent = 0,
                                coefficient = isDecimal || isLong ? (isLong && number.eq(System.Int64.MinValue) ? System.Int64(number.value.toUnsigned()) : number.abs()) : Math.abs(number),
                                exponentPrefix = match[1],
                                exponentPrecision = 3,
                                minDecimals,
                                maxDecimals;

                            while (isDecimal || isLong ? coefficient.gte(10) : (coefficient >= 10)) {
                                if (isDecimal || isLong) {
                                    coefficient = coefficient.div(10);
                                } else {
                                    coefficient /= 10;
                                }

                                exponent++;
                            }

                            while (isDecimal || isLong ? (coefficient.ne(0) && coefficient.lt(1)) : (coefficient !== 0 && coefficient < 1)) {
                                if (isDecimal || isLong) {
                                    coefficient = coefficient.mul(10);
                                } else {
                                    coefficient *= 10;
                                }
                                exponent--;
                            }

                            if (fs === "G") {
                                var noPrecision = isNaN(precision);

                                if (noPrecision) {
                                    if (isDecimal) {
                                        precision = 29;
                                    } else if (isLong) {
                                        precision = number instanceof System.Int64 ? 19 : 20;
                                    } else if (T && T.precision) {
                                        precision = T.precision;
                                    } else {
                                        precision = 15;
                                    }
                                }

                                if ((exponent > -5 && exponent < precision) || isDecimal && noPrecision) {
                                    minDecimals = 0;
                                    maxDecimals = precision - (exponent > 0 ? exponent + 1 : 1);
                                    return this.defaultFormat(number, 1, minDecimals, maxDecimals, nf, true);
                                }

                                exponentPrefix = exponentPrefix === "G" ? "E" : "e";
                                exponentPrecision = 2;
                                minDecimals = 0;
                                maxDecimals = (precision || 15) - 1;
                            } else {
                                minDecimals = maxDecimals = isNaN(precision) ? 6 : precision;
                            }

                            if (exponent >= 0) {
                                exponentPrefix += nf.positiveSign;
                            } else {
                                exponentPrefix += nf.negativeSign;
                                exponent = -exponent;
                            }

                            if (isNeg) {
                                if (isDecimal || isLong) {
                                    coefficient = coefficient.mul(-1);
                                } else {
                                    coefficient *= -1;
                                }
                            }

                            return this.defaultFormat(coefficient, 1, minDecimals, maxDecimals, nf) + exponentPrefix + this.defaultFormat(exponent, exponentPrecision, 0, 0, nf, true);
                        case "P":
                            if (isNaN(precision)) {
                                precision = nf.percentDecimalDigits;
                            }

                            return this.defaultFormat(number * 100, 1, precision, precision, nf, false, "percent");
                        case "X":
                            var result = isDecimal ? number.round().value.toHex().substr(2) : (isLong ? number.toString(16) : Math.round(number).toString(16));

                            if (match[1] === "X") {
                                result = result.toUpperCase();
                            }

                            precision -= result.length;

                            while (precision-- > 0) {
                                result = "0" + result;
                            }

                            return result;
                        case "C":
                            if (isNaN(precision)) {
                                precision = nf.currencyDecimalDigits;
                            }

                            return this.defaultFormat(number, 1, precision, precision, nf, false, "currency");
                        case "R":
                            var r_result = isDecimal || isLong ? (number.toString()) : ("" + number);

                            if (decimalSeparator !== ".") {
                                r_result = r_result.replace(".", decimalSeparator);
                            }

                            r_result = r_result.replace("e", "E");

                            return r_result;
                    }
                }

                if (format.indexOf(",.") !== -1 || System.String.endsWith(format, ",")) {
                    var count = 0,
                        index = format.indexOf(",.");

                    if (index === -1) {
                        index = format.length - 1;
                    }

                    while (index > -1 && format.charAt(index) === ",") {
                        count++;
                        index--;
                    }

                    if (isDecimal || isLong) {
                        number = number.div(Math.pow(1000, count));
                    } else {
                        number /= Math.pow(1000, count);
                    }
                }

                if (format.indexOf("%") !== -1) {
                    if (isDecimal || isLong) {
                        number = number.mul(100);
                    } else {
                        number *= 100;
                    }
                }

                if (format.indexOf("‰") !== -1) {
                    if (isDecimal || isLong) {
                        number = number.mul(1000);
                    } else {
                        number *= 1000;
                    }
                }

                groups = format.split(";");

                if ((isDecimal || isLong ? number.lt(0) : (number < 0)) && groups.length > 1) {
                    if (isDecimal || isLong) {
                        number = number.mul(-1);
                    } else {
                        number *= -1;
                    }

                    format = groups[1];
                } else {
                    format = groups[(isDecimal || isLong ? number.ne(0) : !number) && groups.length > 2 ? 2 : 0];
                }

                return this.customFormat(number, format, nf, !format.match(/^[^\.]*[0#],[0#]/));
            },

            defaultFormat: function (number, minIntLen, minDecLen, maxDecLen, provider, noGroup, name) {
                name = name || "number";

                var nf = (provider || System.Globalization.CultureInfo.getCurrentCulture()).getFormat(System.Globalization.NumberFormatInfo),
                    str,
                    decimalIndex,
                    pattern,
                    roundingFactor,
                    groupIndex,
                    groupSize,
                    groups = nf[name + "GroupSizes"],
                    decimalPart,
                    index,
                    done,
                    startIndex,
                    length,
                    part,
                    sep,
                    buffer = "",
                    isDecimal = number instanceof System.Decimal,
                    isLong = number instanceof System.Int64 || number instanceof System.UInt64,
                    isNeg = isDecimal || isLong ? (number.isZero() ? false : number.isNegative()) : number < 0,
                    isZero = false;

                roundingFactor = Math.pow(10, maxDecLen);

                if (isDecimal) {
                    str = number.abs().toDecimalPlaces(maxDecLen).toFixed();
                } else if (isLong) {
                    str = number.eq(System.Int64.MinValue) ? number.value.toUnsigned().toString() : number.abs().toString();
                } else {
                    str = "" + (+Math.abs(number).toFixed(maxDecLen));
                }

                isZero = str.split('').every(function (s) { return s === '0' || s === '.'; });

                decimalIndex = str.indexOf(".");

                if (decimalIndex > 0) {
                    decimalPart = nf[name + "DecimalSeparator"] + str.substr(decimalIndex + 1);
                    str = str.substr(0, decimalIndex);
                }

                if (str.length < minIntLen) {
                    str = Array(minIntLen - str.length + 1).join("0") + str;
                }

                if (decimalPart) {
                    if ((decimalPart.length - 1) < minDecLen) {
                        decimalPart += Array(minDecLen - decimalPart.length + 2).join("0");
                    }

                    if (maxDecLen === 0) {
                        decimalPart = null;
                    } else if ((decimalPart.length - 1) > maxDecLen) {
                        decimalPart = decimalPart.substr(0, maxDecLen + 1);
                    }
                } else if (minDecLen > 0) {
                    decimalPart = nf[name + "DecimalSeparator"] + Array(minDecLen + 1).join("0");
                }

                groupIndex = 0;
                groupSize = groups[groupIndex];

                if (str.length < groupSize) {
                    buffer = str;

                    if (decimalPart) {
                        buffer += decimalPart;
                    }
                } else {
                    index = str.length;
                    done = false;
                    sep = noGroup ? "" : nf[name + "GroupSeparator"];

                    while (!done) {
                        length = groupSize;
                        startIndex = index - length;

                        if (startIndex < 0) {
                            groupSize += startIndex;
                            length += startIndex;
                            startIndex = 0;
                            done = true;
                        }

                        if (!length) {
                            break;
                        }

                        part = str.substr(startIndex, length);

                        if (buffer.length) {
                            buffer = part + sep + buffer;
                        } else {
                            buffer = part;
                        }

                        index -= length;

                        if (groupIndex < groups.length - 1) {
                            groupIndex++;
                            groupSize = groups[groupIndex];
                        }
                    }

                    if (decimalPart) {
                        buffer += decimalPart;
                    }
                }

                if (isNeg && !isZero) {
                    pattern = System.Globalization.NumberFormatInfo[name + "NegativePatterns"][nf[name + "NegativePattern"]];

                    return pattern.replace("-", nf.negativeSign).replace("%", nf.percentSymbol).replace("$", nf.currencySymbol).replace("n", buffer);
                } else if (System.Globalization.NumberFormatInfo[name + "PositivePatterns"]) {
                    pattern = System.Globalization.NumberFormatInfo[name + "PositivePatterns"][nf[name + "PositivePattern"]];

                    return pattern.replace("%", nf.percentSymbol).replace("$", nf.currencySymbol).replace("n", buffer);
                }

                return buffer;
            },

            customFormat: function (number, format, nf, noGroup) {
                var digits = 0,
                    forcedDigits = -1,
                    integralDigits = -1,
                    decimals = 0,
                    forcedDecimals = -1,
                    atDecimals = 0,
                    unused = 1,
                    c, i, f,
                    endIndex,
                    roundingFactor,
                    decimalIndex,
                    isNegative = false,
                    isZero = false,
                    name,
                    groupCfg,
                    buffer = "",
                    isZeroInt = false,
                    wasSeparator = false,
                    wasIntPart = false,
                    isDecimal = number instanceof System.Decimal,
                    isLong = number instanceof System.Int64 || number instanceof System.UInt64,
                    isNeg = isDecimal || isLong ? (number.isZero() ? false : number.isNegative()) : number < 0;

                name = "number";

                if (format.indexOf("%") !== -1) {
                    name = "percent";
                } else if (format.indexOf("$") !== -1) {
                    name = "currency";
                }

                for (i = 0; i < format.length; i++) {
                    c = format.charAt(i);

                    if (c === "'" || c === '"') {
                        i = format.indexOf(c, i + 1);

                        if (i < 0) {
                            break;
                        }
                    } else if (c === "\\") {
                        i++;
                    } else {
                        if (c === "0" || c === "#") {
                            decimals += atDecimals;

                            if (c === "0") {
                                if (atDecimals) {
                                    forcedDecimals = decimals;
                                } else if (forcedDigits < 0) {
                                    forcedDigits = digits;
                                }
                            }

                            digits += !atDecimals;
                        }

                        atDecimals = atDecimals || c === ".";
                    }
                }
                forcedDigits = forcedDigits < 0 ? 1 : digits - forcedDigits;

                if (isNeg) {
                    isNegative = true;
                }

                roundingFactor = Math.pow(10, decimals);

                if (isDecimal) {
                    number = System.Decimal.round(number.abs().mul(roundingFactor), 4).div(roundingFactor).toString();
                } else if (isLong) {
                    number = (number.eq(System.Int64.MinValue) ? System.Int64(number.value.toUnsigned()) : number.abs()).mul(roundingFactor).div(roundingFactor).toString();
                } else {
                    number = "" + (Math.round(Math.abs(number) * roundingFactor) / roundingFactor);
                }

                isZero = number.split('').every(function (s) { return s === '0' || s === '.'; });

                decimalIndex = number.indexOf(".");
                integralDigits = decimalIndex < 0 ? number.length : decimalIndex;
                i = integralDigits - digits;

                groupCfg = {
                    groupIndex: Math.max(integralDigits, forcedDigits),
                    sep: noGroup ? "" : nf[name + "GroupSeparator"]
                };

                if (integralDigits === 1 && number.charAt(0) === "0") {
                    isZeroInt = true;
                }

                for (f = 0; f < format.length; f++) {
                    c = format.charAt(f);

                    if (c === "'" || c === '"') {
                        endIndex = format.indexOf(c, f + 1);

                        buffer += format.substring(f + 1, endIndex < 0 ? format.length : endIndex);

                        if (endIndex < 0) {
                            break;
                        }

                        f = endIndex;
                    } else if (c === "\\") {
                        buffer += format.charAt(f + 1);
                        f++;
                    } else if (c === "#" || c === "0") {
                        wasIntPart = true;

                        if (!wasSeparator && isZeroInt && c === "#") {
                            i++;
                        } else {
                            groupCfg.buffer = buffer;

                            if (i < integralDigits) {
                                if (i >= 0) {
                                    if (unused) {
                                        this.addGroup(number.substr(0, i), groupCfg);
                                    }

                                    this.addGroup(number.charAt(i), groupCfg);
                                } else if (i >= integralDigits - forcedDigits) {
                                    this.addGroup("0", groupCfg);
                                }

                                unused = 0;
                            } else if (forcedDecimals-- > 0 || i < number.length) {
                                this.addGroup(i >= number.length ? "0" : number.charAt(i), groupCfg);
                            }

                            buffer = groupCfg.buffer;

                            i++;
                        }
                    } else if (c === ".") {
                        if (!wasIntPart && !isZeroInt) {
                            buffer += number.substr(0, integralDigits);
                            wasIntPart = true;
                        }

                        if (number.length > ++i || forcedDecimals > 0) {
                            wasSeparator = true;
                            buffer += nf[name + "DecimalSeparator"];
                        }
                    } else if (c !== ",") {
                        buffer += c;
                    }
                }

                if (isNegative && !isZero) {
                    buffer = "-" + buffer;
                }

                return buffer;
            },

            addGroup: function (value, cfg) {
                var buffer = cfg.buffer,
                    sep = cfg.sep,
                    groupIndex = cfg.groupIndex;

                for (var i = 0, length = value.length; i < length; i++) {
                    buffer += value.charAt(i);

                    if (sep && groupIndex > 1 && groupIndex-- % 3 === 1) {
                        buffer += sep;
                    }
                }

                cfg.buffer = buffer;
                cfg.groupIndex = groupIndex;
            },

            parseFloat: function (s, provider) {
                var res = { };

                Bridge.Int.tryParseFloat(s, provider, res, false);

                return res.v;
            },

            tryParseFloat: function (s, provider, result, safe) {
                result.v = 0;

                if (safe == null) {
                    safe = true;
                }

                if (s == null) {
                    if (safe) {
                        return false;
                    }
                    throw new System.ArgumentNullException("s");
                }

                s = s.trim();

                var nfInfo = (provider || System.Globalization.CultureInfo.getCurrentCulture()).getFormat(System.Globalization.NumberFormatInfo),
                    point = nfInfo.numberDecimalSeparator,
                    thousands = nfInfo.numberGroupSeparator;

                var errMsg = "Input string was not in a correct format.";

                var pointIndex = s.indexOf(point);
                var thousandIndex = thousands ? s.indexOf(thousands) : -1;

                if (pointIndex > -1) {
                    // point before thousands is not allowed
                    // "10.2,5" -> FormatException
                    // "1,0.2,5" -> FormatException
                    if (((pointIndex < thousandIndex) || ((thousandIndex > -1) && (pointIndex < s.indexOf(thousands, pointIndex))))
                        // only one point is allowed
                        || (s.indexOf(point, pointIndex + 1) > -1)) {
                        if (safe) {
                            return false;
                        }
                        throw new System.FormatException(errMsg);
                    }
                }

                if ((point !== ".") && (thousands !== ".") && (s.indexOf(".") > -1)) {
                    if (safe) {
                        return false;
                    }
                    throw new System.FormatException(errMsg);
                }

                if (thousandIndex > -1) {
                    // mutiple thousands are allowed, so we remove them before going further
                    var tmpStr = "";

                    for (var i = 0; i < s.length; i++) {
                        if (s[i] !== thousands) {
                            tmpStr += s[i];
                        }
                    }

                    s = tmpStr;
                }

                if (s === nfInfo.negativeInfinitySymbol) {
                    result.v = Number.NEGATIVE_INFINITY;
                    return true;
                } else if (s === nfInfo.positiveInfinitySymbol) {
                    result.v = Number.POSITIVE_INFINITY;
                    return true;
                } else if (s === nfInfo.nanSymbol) {
                    result.v = Number.NaN;
                    return true;
                }

                var countExp = 0;

                for (var i = 0; i < s.length; i++) {
                    if (System.Char.isLetter(s[i].charCodeAt(0))) {
                        if (s[i].toLowerCase() === "e") {
                            countExp++;
                            if (countExp > 1) {
                                if (safe) {
                                    return false;
                                }
                                throw new System.FormatException(errMsg);
                            }
                        }
                        else {
                            if (safe) {
                                return false;
                            }
                            throw new System.FormatException(errMsg);
                        }
                    }
                }

                var r = parseFloat(s.replace(point, "."));

                if (isNaN(r)) {
                    if (safe) {
                        return false;
                    }
                    throw new System.FormatException(errMsg);
                }

                result.v = r;
                return true;
            },

            parseInt: function (str, min, max, radix) {
                radix = radix || 10;

                if (str == null) {
                    throw new System.ArgumentNullException("str");
                }

                if ((radix <= 10 && !/^[+-]?[0-9]+$/.test(str))
                    || (radix == 16 && !/^[+-]?[0-9A-F]+$/gi.test(str))) {
                    throw new System.FormatException("Input string was not in a correct format.");
                }

                var result = parseInt(str, radix);

                if (isNaN(result)) {
                    throw new System.FormatException("Input string was not in a correct format.");
                }

                if (result < min || result > max) {
                    throw new System.OverflowException();
                }

                return result;
            },

            tryParseInt: function (str, result, min, max, radix) {
                result.v = 0;
                radix = radix || 10;

                if ((radix <= 10 && !/^[+-]?[0-9]+$/.test(str))
                    || (radix == 16 && !/^[+-]?[0-9A-F]+$/gi.test(str))) {
                    return false;
                }

                result.v = parseInt(str, radix);

                if (result.v < min || result.v > max) {
                    return false;
                }

                return true;
            },

            isInfinite: function (x) {
                return x === Number.POSITIVE_INFINITY || x === Number.NEGATIVE_INFINITY;
            },

            trunc: function (num) {
                if (!Bridge.isNumber(num)) {
                    return Bridge.Int.isInfinite(num) ? num : null;
                }

                return num > 0 ? Math.floor(num) : Math.ceil(num);
            },

            div: function (x, y) {
                if (!Bridge.isNumber(x) || !Bridge.isNumber(y)) {
                    return null;
                }

                if (y === 0) {
                    throw new System.DivideByZeroException();
                }

                return this.trunc(x / y);
            },

            mod: function (x, y) {
                if (!Bridge.isNumber(x) || !Bridge.isNumber(y)) {
                    return null;
                }

                if (y === 0) {
                    throw new System.DivideByZeroException();
                }

                return x % y;
            },

            check: function (x, type) {
                if (System.Int64.is64Bit(x)) {
                    return System.Int64.check(x, type);
                } else if (x instanceof System.Decimal) {
                    return System.Decimal.toInt(x, type);
                }

                if (Bridge.isNumber(x)) {
                    if (System.Int64.is64BitType(type)) {
                        if (type === System.UInt64 && x < 0) {
                            throw new System.OverflowException();
                        }

                        return type === System.Int64 ? System.Int64(x) : System.UInt64(x);
                    }
                    else if (!type.$is(x)) {
                        throw new System.OverflowException();
                    }
                }

                if (Bridge.Int.isInfinite(x)) {
                    if (System.Int64.is64BitType(type)) {
                        return type.MinValue;
                    }

                    return type.min;
                }

                return x;
            },

            sxb: function (x) {
                return Bridge.isNumber(x) ? (x | (x & 0x80 ? 0xffffff00 : 0)) : (Bridge.Int.isInfinite(x) ? System.SByte.min : null);
            },

            sxs: function (x) {
                return Bridge.isNumber(x) ? (x | (x & 0x8000 ? 0xffff0000 : 0)) : (Bridge.Int.isInfinite(x) ? System.Int16.min : null);
            },

            clip8: function (x) {
                return Bridge.isNumber(x) ? Bridge.Int.sxb(x & 0xff) : (Bridge.Int.isInfinite(x) ? System.SByte.min : null);
            },

            clipu8: function (x) {
                return Bridge.isNumber(x) ? x & 0xff : (Bridge.Int.isInfinite(x) ? System.Byte.min : null);
            },

            clip16: function (x) {
                return Bridge.isNumber(x) ? Bridge.Int.sxs(x & 0xffff) : (Bridge.Int.isInfinite(x) ? System.Int16.min : null);
            },

            clipu16: function (x) {
                return Bridge.isNumber(x) ? x & 0xffff : (Bridge.Int.isInfinite(x) ? System.UInt16.min : null);
            },

            clip32: function (x) {
                return Bridge.isNumber(x) ? x | 0 : (Bridge.Int.isInfinite(x) ? System.Int32.min : null);
            },

            clipu32: function (x) {
                return Bridge.isNumber(x) ? x >>> 0 : (Bridge.Int.isInfinite(x) ? System.UInt32.min : null);
            },

            clip64: function (x) {
                return Bridge.isNumber(x) ? System.Int64(Bridge.Int.trunc(x)) : (Bridge.Int.isInfinite(x) ? System.Int64.MinValue : null);
            },

            clipu64: function (x) {
                return Bridge.isNumber(x) ? System.UInt64(Bridge.Int.trunc(x)) : (Bridge.Int.isInfinite(x) ? System.UInt64.MinValue : null);
            },

            sign: function (x) {
                return Bridge.isNumber(x) ? (x === 0 ? 0 : (x < 0 ? -1 : 1)) : null;
            }
        }
    });

    Bridge.Int.$kind = "";
    Bridge.Class.addExtend(Bridge.Int, [System.IComparable$1(Bridge.Int), System.IEquatable$1(Bridge.Int)]);

    Bridge.define("System.Double", {
        inherits: [System.IComparable, System.IFormattable],
        statics: {
            min: -Number.MAX_VALUE,

            max: Number.MAX_VALUE,

            precision: 15,

            $number: true,

            $is: function (instance) {
                return typeof (instance) === "number";
            },

            getDefaultValue: function () {
                return 0;
            },

            parse: function (s, provider) {
                return Bridge.Int.parseFloat(s, provider);
            },

            tryParse: function (s, provider, result) {
                return Bridge.Int.tryParseFloat(s, provider, result);
            },

            format: function (number, format, provider) {
                return Bridge.Int.format(number, format, provider, System.Double);
            }
        }
    });

    System.Double.$kind = "";
    Bridge.Class.addExtend(System.Double, [System.IComparable$1(System.Double), System.IEquatable$1(System.Double)]);

    Bridge.define("System.Single", {
        inherits: [System.IComparable, System.IFormattable],
        statics: {
            min: -3.40282346638528859e+38,

            max: 3.40282346638528859e+38,

            precision: 7,

            $number: true,

            $is: System.Double.$is,

            getDefaultValue: System.Double.getDefaultValue,

            parse: System.Double.parse,

            tryParse: System.Double.tryParse,

            format: function (number, format, provider) {
                return Bridge.Int.format(number, format, provider, System.Single);
            }
        }
    });

    System.Single.$kind = "";
    Bridge.Class.addExtend(System.Single, [System.IComparable$1(System.Single), System.IEquatable$1(System.Single)]);

    // @source Long.js

/* long.js https://github.com/dcodeIO/long.js/blob/master/LICENSE */
(function (b) {
    function d(a, b, c) { this.low = a | 0; this.high = b | 0; this.unsigned = !!c } function g(a) { return !0 === (a && a.__isLong__) } function m(a, b) { var c, u; if (b) { a >>>= 0; if (u = 0 <= a && 256 > a) if (c = A[a]) return c; c = e(a, 0 > (a | 0) ? -1 : 0, !0); u && (A[a] = c) } else { a |= 0; if (u = -128 <= a && 128 > a) if (c = B[a]) return c; c = e(a, 0 > a ? -1 : 0, !1); u && (B[a] = c) } return c } function n(a, b) {
        if (isNaN(a) || !isFinite(a)) return b ? p : k; if (b) { if (0 > a) return p; if (a >= C) return D } else { if (a <= -E) return l; if (a + 1 >= E) return F } return 0 > a ? n(-a, b).neg() : e(a % 4294967296 | 0, a / 4294967296 |
        0, b)
    } function e(a, b, c) { return new d(a, b, c) } function y(a, b, c) {
        if (0 === a.length) throw Error("empty string"); if ("NaN" === a || "Infinity" === a || "+Infinity" === a || "-Infinity" === a) return k; "number" === typeof b ? (c = b, b = !1) : b = !!b; c = c || 10; if (2 > c || 36 < c) throw RangeError("radix"); var u; if (0 < (u = a.indexOf("-"))) throw Error("interior hyphen"); if (0 === u) return y(a.substring(1), b, c).neg(); u = n(w(c, 8)); for (var e = k, f = 0; f < a.length; f += 8) {
            var d = Math.min(8, a.length - f), g = parseInt(a.substring(f, f + d), c); 8 > d ? (d = n(w(c, d)), e = e.mul(d).add(n(g))) :
            (e = e.mul(u), e = e.add(n(g)))
        } e.unsigned = b; return e
    } function q(a) { return a instanceof d ? a : "number" === typeof a ? n(a) : "string" === typeof a ? y(a) : e(a.low, a.high, a.unsigned) } b.Bridge.$Long = d; d.__isLong__; Object.defineProperty(d.prototype, "__isLong__", { value: !0, enumerable: !1, configurable: !1 }); d.isLong = g; var B = {}, A = {}; d.fromInt = m; d.fromNumber = n; d.fromBits = e; var w = Math.pow; d.fromString = y; d.fromValue = q; var C = 4294967296 * 4294967296, E = C / 2, G = m(16777216), k = m(0); d.ZERO = k; var p = m(0, !0); d.UZERO = p; var r = m(1); d.ONE = r; var H =
    m(1, !0); d.UONE = H; var z = m(-1); d.NEG_ONE = z; var F = e(-1, 2147483647, !1); d.MAX_VALUE = F; var D = e(-1, -1, !0); d.MAX_UNSIGNED_VALUE = D; var l = e(0, -2147483648, !1); d.MIN_VALUE = l; b = d.prototype; b.toInt = function () { return this.unsigned ? this.low >>> 0 : this.low }; b.toNumber = function () { return this.unsigned ? 4294967296 * (this.high >>> 0) + (this.low >>> 0) : 4294967296 * this.high + (this.low >>> 0) }; b.toString = function (a) {
        a = a || 10; if (2 > a || 36 < a) throw RangeError("radix"); if (this.isZero()) return "0"; if (this.isNegative()) {
            if (this.eq(l)) {
                var b =
                n(a), c = this.div(b), b = c.mul(b).sub(this); return c.toString(a) + b.toInt().toString(a)
            } return ("undefined" === typeof a || 10 === a ? "-" : "") + this.neg().toString(a)
        } for (var c = n(w(a, 6), this.unsigned), b = this, e = ""; ;) { var d = b.div(c), f = (b.sub(d.mul(c)).toInt() >>> 0).toString(a), b = d; if (b.isZero()) return f + e; for (; 6 > f.length;) f = "0" + f; e = "" + f + e }
    }; b.getHighBits = function () { return this.high }; b.getHighBitsUnsigned = function () { return this.high >>> 0 }; b.getLowBits = function () { return this.low }; b.getLowBitsUnsigned = function () {
        return this.low >>>
        0
    }; b.getNumBitsAbs = function () { if (this.isNegative()) return this.eq(l) ? 64 : this.neg().getNumBitsAbs(); for (var a = 0 != this.high ? this.high : this.low, b = 31; 0 < b && 0 == (a & 1 << b) ; b--); return 0 != this.high ? b + 33 : b + 1 }; b.isZero = function () { return 0 === this.high && 0 === this.low }; b.isNegative = function () { return !this.unsigned && 0 > this.high }; b.isPositive = function () { return this.unsigned || 0 <= this.high }; b.isOdd = function () { return 1 === (this.low & 1) }; b.isEven = function () { return 0 === (this.low & 1) }; b.equals = function (a) {
        g(a) || (a = q(a)); return this.unsigned !==
        a.unsigned && 1 === this.high >>> 31 && 1 === a.high >>> 31 ? !1 : this.high === a.high && this.low === a.low
    }; b.eq = b.equals; b.notEquals = function (a) { return !this.eq(a) }; b.neq = b.notEquals; b.lessThan = function (a) { return 0 > this.comp(a) }; b.lt = b.lessThan; b.lessThanOrEqual = function (a) { return 0 >= this.comp(a) }; b.lte = b.lessThanOrEqual; b.greaterThan = function (a) { return 0 < this.comp(a) }; b.gt = b.greaterThan; b.greaterThanOrEqual = function (a) { return 0 <= this.comp(a) }; b.gte = b.greaterThanOrEqual; b.compare = function (a) {
        g(a) || (a = q(a)); if (this.eq(a)) return 0;
        var b = this.isNegative(), c = a.isNegative(); return b && !c ? -1 : !b && c ? 1 : this.unsigned ? a.high >>> 0 > this.high >>> 0 || a.high === this.high && a.low >>> 0 > this.low >>> 0 ? -1 : 1 : this.sub(a).isNegative() ? -1 : 1
    }; b.comp = b.compare; b.negate = function () { return !this.unsigned && this.eq(l) ? l : this.not().add(r) }; b.neg = b.negate; b.add = function (a) {
        g(a) || (a = q(a)); var b = this.high >>> 16, c = this.high & 65535, d = this.low >>> 16, l = a.high >>> 16, f = a.high & 65535, n = a.low >>> 16, k; k = 0 + ((this.low & 65535) + (a.low & 65535)); a = 0 + (k >>> 16); a += d + n; d = 0 + (a >>> 16); d += c + f; c =
        0 + (d >>> 16); c = c + (b + l) & 65535; return e((a & 65535) << 16 | k & 65535, c << 16 | d & 65535, this.unsigned)
    }; b.subtract = function (a) { g(a) || (a = q(a)); return this.add(a.neg()) }; b.sub = b.subtract; b.multiply = function (a) {
        if (this.isZero()) return k; g(a) || (a = q(a)); if (a.isZero()) return k; if (this.eq(l)) return a.isOdd() ? l : k; if (a.eq(l)) return this.isOdd() ? l : k; if (this.isNegative()) return a.isNegative() ? this.neg().mul(a.neg()) : this.neg().mul(a).neg(); if (a.isNegative()) return this.mul(a.neg()).neg(); if (this.lt(G) && a.lt(G)) return n(this.toNumber() *
        a.toNumber(), this.unsigned); var b = this.high >>> 16, c = this.high & 65535, d = this.low >>> 16, x = this.low & 65535, f = a.high >>> 16, m = a.high & 65535, p = a.low >>> 16; a = a.low & 65535; var v, h, t, r; r = 0 + x * a; t = 0 + (r >>> 16); t += d * a; h = 0 + (t >>> 16); t = (t & 65535) + x * p; h += t >>> 16; t &= 65535; h += c * a; v = 0 + (h >>> 16); h = (h & 65535) + d * p; v += h >>> 16; h &= 65535; h += x * m; v += h >>> 16; h &= 65535; v = v + (b * a + c * p + d * m + x * f) & 65535; return e(t << 16 | r & 65535, v << 16 | h, this.unsigned)
    }; b.mul = b.multiply; b.divide = function (a) {
        g(a) || (a = q(a)); if (a.isZero()) throw Error("division by zero"); if (this.isZero()) return this.unsigned ?
                p : k; var b, c, d; if (this.unsigned) a.unsigned || (a = a.toUnsigned()); else { if (this.eq(l)) { if (a.eq(r) || a.eq(z)) return l; if (a.eq(l)) return r; b = this.shr(1).div(a).shl(1); if (b.eq(k)) return a.isNegative() ? r : z; c = this.sub(a.mul(b)); return d = b.add(c.div(a)) } if (a.eq(l)) return this.unsigned ? p : k; if (this.isNegative()) return a.isNegative() ? this.neg().div(a.neg()) : this.neg().div(a).neg(); if (a.isNegative()) return this.div(a.neg()).neg() } if (this.unsigned) { if (a.gt(this)) return p; if (a.gt(this.shru(1))) return H; d = p } else d =
                k; for (c = this; c.gte(a) ;) { b = Math.max(1, Math.floor(c.toNumber() / a.toNumber())); for (var e = Math.ceil(Math.log(b) / Math.LN2), e = 48 >= e ? 1 : w(2, e - 48), f = n(b), m = f.mul(a) ; m.isNegative() || m.gt(c) ;) b -= e, f = n(b, this.unsigned), m = f.mul(a); f.isZero() && (f = r); d = d.add(f); c = c.sub(m) } return d
    }; b.div = b.divide; b.modulo = function (a) { g(a) || (a = q(a)); return this.sub(this.div(a).mul(a)) }; b.mod = b.modulo; b.not = function () { return e(~this.low, ~this.high, this.unsigned) }; b.and = function (a) {
        g(a) || (a = q(a)); return e(this.low & a.low, this.high &
        a.high, this.unsigned)
    }; b.or = function (a) { g(a) || (a = q(a)); return e(this.low | a.low, this.high | a.high, this.unsigned) }; b.xor = function (a) { g(a) || (a = q(a)); return e(this.low ^ a.low, this.high ^ a.high, this.unsigned) }; b.shiftLeft = function (a) { g(a) && (a = a.toInt()); return 0 === (a &= 63) ? this : 32 > a ? e(this.low << a, this.high << a | this.low >>> 32 - a, this.unsigned) : e(0, this.low << a - 32, this.unsigned) }; b.shl = b.shiftLeft; b.shiftRight = function (a) {
        g(a) && (a = a.toInt()); return 0 === (a &= 63) ? this : 32 > a ? e(this.low >>> a | this.high << 32 - a, this.high >>
        a, this.unsigned) : e(this.high >> a - 32, 0 <= this.high ? 0 : -1, this.unsigned)
    }; b.shr = b.shiftRight; b.shiftRightUnsigned = function (a) { g(a) && (a = a.toInt()); a &= 63; if (0 === a) return this; var b = this.high; return 32 > a ? e(this.low >>> a | b << 32 - a, b >>> a, this.unsigned) : 32 === a ? e(b, 0, this.unsigned) : e(b >>> a - 32, 0, this.unsigned) }; b.shru = b.shiftRightUnsigned; b.toSigned = function () { return this.unsigned ? e(this.low, this.high, !1) : this }; b.toUnsigned = function () { return this.unsigned ? this : e(this.low, this.high, !0) }
})(Bridge.global);

    System.Int64 = function (l) {
        if (this.constructor !== System.Int64) {
            return new System.Int64(l);
        }

        if (!Bridge.hasValue(l)) {
            l = 0;
        }

        this.T = System.Int64;
        this.unsigned = false;
        this.value = System.Int64.getValue(l);
    }

    System.Int64.$$name = "System.Int64";
    System.Int64.prototype.$$name = "System.Int64";
    System.Int64.$kind = "struct";
    System.Int64.prototype.$kind = "struct";

    System.Int64.$$inherits = [];
    Bridge.Class.addExtend(System.Int64, [System.IComparable, System.IFormattable, System.IComparable$1(System.Int64), System.IEquatable$1(System.Int64)]);

    System.Int64.$is = function (instance) {
        return instance instanceof System.Int64;
    };

    System.Int64.is64Bit = function (instance) {
        return instance instanceof System.Int64 || instance instanceof System.UInt64;
    };

    System.Int64.is64BitType = function (type) {
        return type === System.Int64 || type === System.UInt64;
    };

    System.Int64.getDefaultValue = function () {
        return System.Int64.Zero;
    };

    System.Int64.getValue = function (l) {
        if (!Bridge.hasValue(l)) {
            return null;
        }

        if (l instanceof Bridge.$Long) {
            return l;
        }

        if (l instanceof System.Int64) {
            return l.value;
        }

        if (l instanceof System.UInt64) {
            return l.value.toSigned();
        }

        if (Bridge.isArray(l)) {
            return new Bridge.$Long(l[0], l[1]);
        }

        if (Bridge.isString(l)) {
            return Bridge.$Long.fromString(l);
        }

        if (Bridge.isNumber(l)) {
            return Bridge.$Long.fromNumber(l);
        }

        if (l instanceof System.Decimal) {
            return Bridge.$Long.fromString(l.toString());
        }

        return Bridge.$Long.fromValue(l);
    };

    System.Int64.create = function (l) {
        if (!Bridge.hasValue(l)) {
            return null;
        }

        if (l instanceof System.Int64) {
            return l;
        }

        return new System.Int64(l);
    };

    System.Int64.lift = function (l) {
        if (!Bridge.hasValue(l)) {
            return null;
        }
        return System.Int64.create(l);
    };

    System.Int64.toNumber = function (value) {
        if (!value) {
            return null;
        }

        return value.toNumber();
    };

    System.Int64.prototype.toNumberDivided = function (divisor) {
        var integral = this.div(divisor),
            remainder = this.mod(divisor),
            scaledRemainder = remainder.toNumber() / divisor;

        return integral.toNumber() + scaledRemainder;
    };

    System.Int64.prototype.toJSON = function () {
        return this.toNumber();
    };

    System.Int64.prototype.toString = function (format, provider) {
        if (!format && !provider) {
            return this.value.toString();
        }

        if (Bridge.isNumber(format) && !provider) {
            return this.value.toString(format);
        }

        return Bridge.Int.format(this, format, provider);
    };

    System.Int64.prototype.format = function (format, provider) {
        return Bridge.Int.format(this, format, provider);
    };

    System.Int64.prototype.isNegative = function () {
        return this.value.isNegative();
    };

    System.Int64.prototype.abs = function () {
        if (this.T === System.Int64 && this.eq(System.Int64.MinValue)) {
            throw new System.OverflowException();
        }
        return new this.T(this.value.isNegative() ? this.value.neg() : this.value);
    };

    System.Int64.prototype.compareTo = function (l) {
        return this.value.compare(this.T.getValue(l));
    };

    System.Int64.prototype.add = function (l, overflow) {
        var addl = this.T.getValue(l),
            r = new this.T(this.value.add(addl));

        if (overflow) {
            var neg1 = this.value.isNegative(),
                neg2 = addl.isNegative(),
                rneg = r.value.isNegative();

            if ((neg1 && neg2 && !rneg) ||
                (!neg1 && !neg2 && rneg) ||
                (this.T === System.UInt64 && r.lt(System.UInt64.max(this, addl)))) {
                throw new System.OverflowException();
            }
        }

        return r;
    };

    System.Int64.prototype.sub = function (l, overflow) {
        var subl = this.T.getValue(l),
            r = new this.T(this.value.sub(subl));

        if (overflow) {
            var neg1 = this.value.isNegative(),
                neg2 = subl.isNegative(),
                rneg = r.value.isNegative();

            if ((neg1 && !neg2 && !rneg) ||
                (!neg1 && neg2 && rneg) ||
                (this.T === System.UInt64 && this.value.lt(subl))) {
                throw new System.OverflowException();
            }
        }

        return r;
    };

    System.Int64.prototype.isZero = function () {
        return this.value.isZero();
    };

    System.Int64.prototype.mul = function (l, overflow) {
        var arg = this.T.getValue(l),
            r = new this.T(this.value.mul(arg));

        if (overflow) {
            var s1 = this.sign(),
                s2 = arg.isZero() ? 0 : (arg.isNegative() ? -1 : 1),
                rs = r.sign();

            if (this.T === System.Int64) {
                if (this.eq(System.Int64.MinValue) || this.eq(System.Int64.MaxValue)) {
                    if (arg.neq(1) && arg.neq(0)) {
                        throw new System.OverflowException();
                    }

                    return r;
                }

                if (arg.eq(Bridge.$Long.MIN_VALUE) || arg.eq(Bridge.$Long.MAX_VALUE)) {
                    if (this.neq(1) && this.neq(0)) {
                        throw new System.OverflowException();
                    }

                    return r;
                }

                if ((s1 === -1 && s2 === -1 && rs !== 1) ||
                    (s1 === 1 && s2 === 1 && rs !== 1) ||
                    (s1 === -1 && s2 === 1 && rs !== -1) ||
                    (s1 === 1 && s2 === -1 && rs !== -1)) {
                    throw new System.OverflowException();
                }

                var r_abs = r.abs();

                if (r_abs.lt(this.abs()) || r_abs.lt(System.Int64(arg).abs())) {
                    throw new System.OverflowException();
                }
            } else {
                if (this.eq(System.UInt64.MaxValue)) {
                    if (arg.neq(1) && arg.neq(0)) {
                        throw new System.OverflowException();
                    }

                    return r;
                }

                if (arg.eq(Bridge.$Long.MAX_UNSIGNED_VALUE)) {
                    if (this.neq(1) && this.neq(0)) {
                        throw new System.OverflowException();
                    }

                    return r;
                }

                var r_abs = r.abs();

                if (r_abs.lt(this.abs()) || r_abs.lt(System.Int64(arg).abs())) {
                    throw new System.OverflowException();
                }
            }
        }

        return r;
    };

    System.Int64.prototype.div = function (l) {
        return new this.T(this.value.div(this.T.getValue(l)));
    };

    System.Int64.prototype.mod = function (l) {
        return new this.T(this.value.mod(this.T.getValue(l)));
    };

    System.Int64.prototype.neg = function (overflow) {
        if (overflow && this.T === System.Int64 && this.eq(System.Int64.MinValue)) {
            throw new System.OverflowException();
        }
        return new this.T(this.value.neg());
    };

    System.Int64.prototype.inc = function (overflow) {
        return this.add(1, overflow);
    };

    System.Int64.prototype.dec = function (overflow) {
        return this.sub(1, overflow);
    };

    System.Int64.prototype.sign = function () {
        return this.value.isZero() ? 0 : (this.value.isNegative() ? -1 : 1);
    };

    System.Int64.prototype.clone = function () {
        return new this.T(this);
    };

    System.Int64.prototype.ne = function (l) {
        return this.value.neq(this.T.getValue(l));
    };

    System.Int64.prototype.neq = function (l) {
        return this.value.neq(this.T.getValue(l));
    };

    System.Int64.prototype.eq = function (l) {
        return this.value.eq(this.T.getValue(l));
    };

    System.Int64.prototype.lt = function (l) {
        return this.value.lt(this.T.getValue(l));
    };

    System.Int64.prototype.lte = function (l) {
        return this.value.lte(this.T.getValue(l));
    };

    System.Int64.prototype.gt = function (l) {
        return this.value.gt(this.T.getValue(l));
    };

    System.Int64.prototype.gte = function (l) {
        return this.value.gte(this.T.getValue(l));
    };

    System.Int64.prototype.equals = function (l) {
        return this.value.eq(this.T.getValue(l));
    };

    System.Int64.prototype.equalsT = function (l) {
        return this.equals(l);
    };

    System.Int64.prototype.getHashCode = function () {
        var n = (this.sign() * 397 + this.value.high) | 0;
        n = (n * 397 + this.value.low) | 0;

        return n;
    };

    System.Int64.prototype.toNumber = function () {
        return this.value.toNumber();
    };

    System.Int64.parse = function (str) {
        if (str == null) {
            throw new System.ArgumentNullException("str");
        }

        if (!/^[+-]?[0-9]+$/.test(str)) {
            throw new System.FormatException("Input string was not in a correct format.");
        }

        var result = new System.Int64(str);

        if (str !== result.toString()) {
            throw new System.OverflowException();
        }

        return result;
    };

    System.Int64.tryParse = function (str, v) {
        try {
            if (str == null || !/^[+-]?[0-9]+$/.test(str)) {
                v.v = System.Int64(Bridge.$Long.ZERO);
                return false;
            }

            v.v = new System.Int64(str);

            if (str !== v.v.toString()) {
                v.v = System.Int64(Bridge.$Long.ZERO);
                return false;
            }

            return true;
        } catch (e) {
            v.v = System.Int64(Bridge.$Long.ZERO);
            return false;
        }
    };

    System.Int64.divRem = function (a, b, result) {
        a = System.Int64(a);
        b = System.Int64(b);
        var remainder = a.mod(b);
        result.v = remainder;
        return a.sub(remainder).div(b);
    };

    System.Int64.min = function () {
        var values = [],
            min, i, len;

        for (i = 0, len = arguments.length; i < len; i++) {
            values.push(System.Int64.getValue(arguments[i]));
        }

        i = 0;
        min = values[0];
        for (; ++i < values.length;) {
            if (values[i].lt(min)) {
                min = values[i];
            }
        }

        return new System.Int64(min);
    };

    System.Int64.max = function () {
        var values = [],
            max, i, len;

        for (i = 0, len = arguments.length; i < len; i++) {
            values.push(System.Int64.getValue(arguments[i]));
        }

        i = 0;
        max = values[0];
        for (; ++i < values.length;) {
            if (values[i].gt(max)) {
                max = values[i];
            }
        }

        return new System.Int64(max);
    };

    System.Int64.prototype.and = function (l) {
        return new this.T(this.value.and(this.T.getValue(l)));
    };

    System.Int64.prototype.not = function () {
        return new this.T(this.value.not());
    };

    System.Int64.prototype.or = function (l) {
        return new this.T(this.value.or(this.T.getValue(l)));
    };

    System.Int64.prototype.shl = function (l) {
        return new this.T(this.value.shl(l));
    };

    System.Int64.prototype.shr = function (l) {
        return new this.T(this.value.shr(l));
    };

    System.Int64.prototype.shru = function (l) {
        return new this.T(this.value.shru(l));
    };

    System.Int64.prototype.xor = function (l) {
        return new this.T(this.value.xor(this.T.getValue(l)));
    };

    System.Int64.check = function (v, tp) {
        if (Bridge.Int.isInfinite(v)) {
            if (tp === System.Int64 || tp === System.UInt64) {
                return tp.MinValue;
            }
            return tp.min;
        }

        if (!v) {
            return null;
        }

        var str, r;
        if (tp === System.Int64) {
            if (v instanceof System.Int64) {
                return v;
            }

            str = v.value.toString();
            r = new System.Int64(str);

            if (str !== r.value.toString()) {
                throw new System.OverflowException();
            }

            return r;
        }

        if (tp === System.UInt64) {
            if (v instanceof System.UInt64) {
                return v;
            }

            if (v.value.isNegative()) {
                throw new System.OverflowException();
            }
            str = v.value.toString();
            r = new System.UInt64(str);

            if (str !== r.value.toString()) {
                throw new System.OverflowException();
            }

            return r;
        }

        return Bridge.Int.check(v.toNumber(), tp);
    };

    System.Int64.clip8 = function (x) {
        return x ? Bridge.Int.sxb(x.value.low & 0xff) : (Bridge.Int.isInfinite(x) ? System.SByte.min : null);
    };

    System.Int64.clipu8 = function (x) {
        return x ? x.value.low & 0xff : (Bridge.Int.isInfinite(x) ? System.Byte.min : null);
    };

    System.Int64.clip16 = function (x) {
        return x ? Bridge.Int.sxs(x.value.low & 0xffff) : (Bridge.Int.isInfinite(x) ? System.Int16.min : null);
    };

    System.Int64.clipu16 = function (x) {
        return x ? x.value.low & 0xffff : (Bridge.Int.isInfinite(x) ? System.UInt16.min : null);
    };

    System.Int64.clip32 = function (x) {
        return x ? x.value.low | 0 : (Bridge.Int.isInfinite(x) ? System.Int32.min : null);
    };

    System.Int64.clipu32 = function (x) {
        return x ? x.value.low >>> 0 : (Bridge.Int.isInfinite(x) ? System.UInt32.min : null);
    };

    System.Int64.clip64 = function (x) {
        return x ? new System.Int64(x.value.toSigned()) : (Bridge.Int.isInfinite(x) ? System.Int64.MinValue : null);
    };

    System.Int64.clipu64 = function (x) {
        return x ? new System.UInt64(x.value.toUnsigned()) : (Bridge.Int.isInfinite(x) ? System.UInt64.MinValue : null);
    };

    System.Int64.Zero = System.Int64(Bridge.$Long.ZERO);
    System.Int64.MinValue = System.Int64(Bridge.$Long.MIN_VALUE);
    System.Int64.MaxValue = System.Int64(Bridge.$Long.MAX_VALUE);
    System.Int64.precision = 19;

    /* ULONG */

    System.UInt64 = function (l) {
        if (this.constructor !== System.UInt64) {
            return new System.UInt64(l);
        }

        if (!Bridge.hasValue(l)) {
            l = 0;
        }

        this.T = System.UInt64;
        this.unsigned = true;
        this.value = System.UInt64.getValue(l, true);
    }

    System.UInt64.$$name = "System.UInt64";
    System.UInt64.prototype.$$name = "System.UInt64";
    System.UInt64.$kind = "struct";
    System.UInt64.prototype.$kind = "struct";
    System.UInt64.$$inherits = [];
    Bridge.Class.addExtend(System.UInt64, [System.IComparable, System.IFormattable, System.IComparable$1(System.UInt64), System.IEquatable$1(System.UInt64)]);

    System.UInt64.$is = function (instance) {
        return instance instanceof System.UInt64;
    };

    System.UInt64.getDefaultValue = function () {
        return System.UInt64.Zero;
    };

    System.UInt64.getValue = function (l) {
        if (!Bridge.hasValue(l)) {
            return null;
        }

        if (l instanceof Bridge.$Long) {
            return l;
        }

        if (l instanceof System.UInt64) {
            return l.value;
        }

        if (l instanceof System.Int64) {
            return l.value.toUnsigned();
        }

        if (Bridge.isArray(l)) {
            return new Bridge.$Long(l[0], l[1], true);
        }

        if (Bridge.isString(l)) {
            return Bridge.$Long.fromString(l, true);
        }

        if (Bridge.isNumber(l)) {
            return Bridge.$Long.fromNumber(l, true);
        }

        if (l instanceof System.Decimal) {
            return Bridge.$Long.fromString(l.toString(), true);
        }

        return Bridge.$Long.fromValue(l);
    };

    System.UInt64.create = function (l) {
        if (!Bridge.hasValue(l)) {
            return null;
        }

        if (l instanceof System.UInt64) {
            return l;
        }

        return new System.UInt64(l);
    };

    System.UInt64.lift = function (l) {
        if (!Bridge.hasValue(l)) {
            return null;
        }
        return System.UInt64.create(l);
    };

    System.UInt64.prototype.toJSON = System.Int64.prototype.toJSON;
    System.UInt64.prototype.toString = System.Int64.prototype.toString;
    System.UInt64.prototype.format = System.Int64.prototype.format;
    System.UInt64.prototype.isNegative = System.Int64.prototype.isNegative;
    System.UInt64.prototype.abs = System.Int64.prototype.abs;
    System.UInt64.prototype.compareTo = System.Int64.prototype.compareTo;
    System.UInt64.prototype.add = System.Int64.prototype.add;
    System.UInt64.prototype.sub = System.Int64.prototype.sub;
    System.UInt64.prototype.isZero = System.Int64.prototype.isZero;
    System.UInt64.prototype.mul = System.Int64.prototype.mul;
    System.UInt64.prototype.div = System.Int64.prototype.div;
    System.UInt64.prototype.toNumberDivided = System.Int64.prototype.toNumberDivided;
    System.UInt64.prototype.mod = System.Int64.prototype.mod;
    System.UInt64.prototype.neg = System.Int64.prototype.neg;
    System.UInt64.prototype.inc = System.Int64.prototype.inc;
    System.UInt64.prototype.dec = System.Int64.prototype.dec;
    System.UInt64.prototype.sign = System.Int64.prototype.sign;
    System.UInt64.prototype.clone = System.Int64.prototype.clone;
    System.UInt64.prototype.ne = System.Int64.prototype.ne;
    System.UInt64.prototype.neq = System.Int64.prototype.neq;
    System.UInt64.prototype.eq = System.Int64.prototype.eq;
    System.UInt64.prototype.lt = System.Int64.prototype.lt;
    System.UInt64.prototype.lte = System.Int64.prototype.lte;
    System.UInt64.prototype.gt = System.Int64.prototype.gt;
    System.UInt64.prototype.gte = System.Int64.prototype.gte;
    System.UInt64.prototype.equals = System.Int64.prototype.equals;
    System.UInt64.prototype.equalsT = System.Int64.prototype.equalsT;
    System.UInt64.prototype.getHashCode = System.Int64.prototype.getHashCode;
    System.UInt64.prototype.toNumber = System.Int64.prototype.toNumber;

    System.UInt64.parse = function (str) {
        if (str == null) {
            throw new System.ArgumentNullException("str");
        }

        if (!/^[+-]?[0-9]+$/.test(str)) {
            throw new System.FormatException("Input string was not in a correct format.");
        }

        var result = new System.UInt64(str);

        if (result.value.isNegative()) {
            throw new System.OverflowException();
        }

        if (str !== result.toString()) {
            throw new System.OverflowException();
        }

        return result;
    };

    System.UInt64.tryParse = function (str, v) {
        try {
            if (str == null || !/^[+-]?[0-9]+$/.test(str)) {
                v.v = System.UInt64(Bridge.$Long.UZERO);
                return false;
            }

            v.v = new System.UInt64(str);

            if (v.v.isNegative()) {
                v.v = System.UInt64(Bridge.$Long.UZERO);
                return false;
            }

            if (str !== v.v.toString()) {
                v.v = System.UInt64(Bridge.$Long.UZERO);
                return false;
            }

            return true;
        } catch (e) {
            v.v = System.UInt64(Bridge.$Long.UZERO);
            return false;
        }
    };

    System.UInt64.min = function () {
        var values = [],
            min, i, len;

        for (i = 0, len = arguments.length; i < len; i++) {
            values.push(System.UInt64.getValue(arguments[i]));
        }

        i = 0;
        min = values[0];
        for (; ++i < values.length;) {
            if (values[i].lt(min)) {
                min = values[i];
            }
        }

        return new System.UInt64(min);
    };

    System.UInt64.max = function () {
        var values = [],
            max, i, len;

        for (i = 0, len = arguments.length; i < len; i++) {
            values.push(System.UInt64.getValue(arguments[i]));
        }

        i = 0;
        max = values[0];
        for (; ++i < values.length;) {
            if (values[i].gt(max)) {
                max = values[i];
            }
        }

        return new System.UInt64(max);
    };

    System.UInt64.divRem = function (a, b, result) {
        a = System.UInt64(a);
        b = System.UInt64(b);
        var remainder = a.mod(b);
        result.v = remainder;
        return a.sub(remainder).div(b);
    };

    System.UInt64.prototype.and = System.Int64.prototype.and;
    System.UInt64.prototype.not = System.Int64.prototype.not;
    System.UInt64.prototype.or = System.Int64.prototype.or;
    System.UInt64.prototype.shl = System.Int64.prototype.shl;
    System.UInt64.prototype.shr = System.Int64.prototype.shr;
    System.UInt64.prototype.shru = System.Int64.prototype.shru;
    System.UInt64.prototype.xor = System.Int64.prototype.xor;

    System.UInt64.Zero = System.UInt64(Bridge.$Long.UZERO);
    System.UInt64.MinValue = System.UInt64.Zero;
    System.UInt64.MaxValue = System.UInt64(Bridge.$Long.MAX_UNSIGNED_VALUE);
    System.UInt64.precision = 20;

    // @source Decimal.js

    /* decimal.js v7.1.0 https://github.com/MikeMcl/decimal.js/LICENCE */
    !function (n) { "use strict"; function e(n) { var e, i, t, r = n.length - 1, s = "", o = n[0]; if (r > 0) { for (s += o, e = 1; r > e; e++) t = n[e] + "", i = Rn - t.length, i && (s += l(i)), s += t; o = n[e], t = o + "", i = Rn - t.length, i && (s += l(i)) } else if (0 === o) return "0"; for (; o % 10 === 0;) o /= 10; return s + o } function i(n, e, i) { if (n !== ~~n || e > n || n > i) throw Error(En + n) } function t(n, e, i, t) { var r, s, o, u; for (s = n[0]; s >= 10; s /= 10)--e; return --e < 0 ? (e += Rn, r = 0) : (r = Math.ceil((e + 1) / Rn), e %= Rn), s = On(10, Rn - e), u = n[r] % s | 0, null == t ? 3 > e ? (0 == e ? u = u / 100 | 0 : 1 == e && (u = u / 10 | 0), o = 4 > i && 99999 == u || i > 3 && 49999 == u || 5e4 == u || 0 == u) : o = (4 > i && u + 1 == s || i > 3 && u + 1 == s / 2) && (n[r + 1] / s / 100 | 0) == On(10, e - 2) - 1 || (u == s / 2 || 0 == u) && 0 == (n[r + 1] / s / 100 | 0) : 4 > e ? (0 == e ? u = u / 1e3 | 0 : 1 == e ? u = u / 100 | 0 : 2 == e && (u = u / 10 | 0), o = (t || 4 > i) && 9999 == u || !t && i > 3 && 4999 == u) : o = ((t || 4 > i) && u + 1 == s || !t && i > 3 && u + 1 == s / 2) && (n[r + 1] / s / 1e3 | 0) == On(10, e - 3) - 1, o } function r(n, e, i) { for (var t, r, s = [0], o = 0, u = n.length; u > o;) { for (r = s.length; r--;) s[r] *= e; for (s[0] += wn.indexOf(n.charAt(o++)), t = 0; t < s.length; t++) s[t] > i - 1 && (void 0 === s[t + 1] && (s[t + 1] = 0), s[t + 1] += s[t] / i | 0, s[t] %= i) } return s.reverse() } function s(n, e) { var i, t, r = e.d.length; 32 > r ? (i = Math.ceil(r / 3), t = Math.pow(4, -i).toString()) : (i = 16, t = "2.3283064365386962890625e-10"), n.precision += i, e = E(n, 1, e.times(t), new n(1)); for (var s = i; s--;) { var o = e.times(e); e = o.times(o).minus(o).times(8).plus(1) } return n.precision -= i, e } function o(n, e, i, t) { var r, s, o, u, c, f, a, h, l, d = n.constructor; n: if (null != e) { if (h = n.d, !h) return n; for (r = 1, u = h[0]; u >= 10; u /= 10) r++; if (s = e - r, 0 > s) s += Rn, o = e, a = h[l = 0], c = a / On(10, r - o - 1) % 10 | 0; else if (l = Math.ceil((s + 1) / Rn), u = h.length, l >= u) { if (!t) break n; for (; u++ <= l;) h.push(0); a = c = 0, r = 1, s %= Rn, o = s - Rn + 1 } else { for (a = u = h[l], r = 1; u >= 10; u /= 10) r++; s %= Rn, o = s - Rn + r, c = 0 > o ? 0 : a / On(10, r - o - 1) % 10 | 0 } if (t = t || 0 > e || void 0 !== h[l + 1] || (0 > o ? a : a % On(10, r - o - 1)), f = 4 > i ? (c || t) && (0 == i || i == (n.s < 0 ? 3 : 2)) : c > 5 || 5 == c && (4 == i || t || 6 == i && (s > 0 ? o > 0 ? a / On(10, r - o) : 0 : h[l - 1]) % 10 & 1 || i == (n.s < 0 ? 8 : 7)), 1 > e || !h[0]) return h.length = 0, f ? (e -= n.e + 1, h[0] = On(10, (Rn - e % Rn) % Rn), n.e = -e || 0) : h[0] = n.e = 0, n; if (0 == s ? (h.length = l, u = 1, l--) : (h.length = l + 1, u = On(10, Rn - s), h[l] = o > 0 ? (a / On(10, r - o) % On(10, o) | 0) * u : 0), f) for (; ;) { if (0 == l) { for (s = 1, o = h[0]; o >= 10; o /= 10) s++; for (o = h[0] += u, u = 1; o >= 10; o /= 10) u++; s != u && (n.e++, h[0] == Pn && (h[0] = 1)); break } if (h[l] += u, h[l] != Pn) break; h[l--] = 0, u = 1 } for (s = h.length; 0 === h[--s];) h.pop() } return bn && (n.e > d.maxE ? (n.d = null, n.e = NaN) : n.e < d.minE && (n.e = 0, n.d = [0])), n } function u(n, i, t) { if (!n.isFinite()) return v(n); var r, s = n.e, o = e(n.d), u = o.length; return i ? (t && (r = t - u) > 0 ? o = o.charAt(0) + "." + o.slice(1) + l(r) : u > 1 && (o = o.charAt(0) + "." + o.slice(1)), o = o + (n.e < 0 ? "e" : "e+") + n.e) : 0 > s ? (o = "0." + l(-s - 1) + o, t && (r = t - u) > 0 && (o += l(r))) : s >= u ? (o += l(s + 1 - u), t && (r = t - s - 1) > 0 && (o = o + "." + l(r))) : ((r = s + 1) < u && (o = o.slice(0, r) + "." + o.slice(r)), t && (r = t - u) > 0 && (s + 1 === u && (o += "."), o += l(r))), o } function c(n, e) { for (var i = 1, t = n[0]; t >= 10; t /= 10) i++; return i + e * Rn - 1 } function f(n, e, i) { if (e > Un) throw bn = !0, i && (n.precision = i), Error(Mn); return o(new n(mn), e, 1, !0) } function a(n, e, i) { if (e > _n) throw Error(Mn); return o(new n(vn), e, i, !0) } function h(n) { var e = n.length - 1, i = e * Rn + 1; if (e = n[e]) { for (; e % 10 == 0; e /= 10) i--; for (e = n[0]; e >= 10; e /= 10) i++ } return i } function l(n) { for (var e = ""; n--;) e += "0"; return e } function d(n, e, i, t) { var r, s = new n(1), o = Math.ceil(t / Rn + 4); for (bn = !1; ;) { if (i % 2 && (s = s.times(e), q(s.d, o) && (r = !0)), i = qn(i / 2), 0 === i) { i = s.d.length - 1, r && 0 === s.d[i] && ++s.d[i]; break } e = e.times(e), q(e.d, o) } return bn = !0, s } function p(n) { return 1 & n.d[n.d.length - 1] } function g(n, e, i) { for (var t, r = new n(e[0]), s = 0; ++s < e.length;) { if (t = new n(e[s]), !t.s) { r = t; break } r[i](t) && (r = t) } return r } function w(n, i) { var r, s, u, c, f, a, h, l = 0, d = 0, p = 0, g = n.constructor, w = g.rounding, m = g.precision; if (!n.d || !n.d[0] || n.e > 17) return new g(n.d ? n.d[0] ? n.s < 0 ? 0 : 1 / 0 : 1 : n.s ? n.s < 0 ? 0 : n : NaN); for (null == i ? (bn = !1, h = m) : h = i, a = new g(.03125) ; n.e > -2;) n = n.times(a), p += 5; for (s = Math.log(On(2, p)) / Math.LN10 * 2 + 5 | 0, h += s, r = c = f = new g(1), g.precision = h; ;) { if (c = o(c.times(n), h, 1), r = r.times(++d), a = f.plus(Sn(c, r, h, 1)), e(a.d).slice(0, h) === e(f.d).slice(0, h)) { for (u = p; u--;) f = o(f.times(f), h, 1); if (null != i) return g.precision = m, f; if (!(3 > l && t(f.d, h - s, w, l))) return o(f, g.precision = m, w, bn = !0); g.precision = h += 10, r = c = a = new g(1), d = 0, l++ } f = a } } function m(n, i) { var r, s, u, c, a, h, l, d, p, g, w, v = 1, N = 10, b = n, x = b.d, E = b.constructor, M = E.rounding, y = E.precision; if (b.s < 0 || !x || !x[0] || !b.e && 1 == x[0] && 1 == x.length) return new E(x && !x[0] ? -1 / 0 : 1 != b.s ? NaN : x ? 0 : b); if (null == i ? (bn = !1, p = y) : p = i, E.precision = p += N, r = e(x), s = r.charAt(0), !(Math.abs(c = b.e) < 15e14)) return d = f(E, p + 2, y).times(c + ""), b = m(new E(s + "." + r.slice(1)), p - N).plus(d), E.precision = y, null == i ? o(b, y, M, bn = !0) : b; for (; 7 > s && 1 != s || 1 == s && r.charAt(1) > 3;) b = b.times(n), r = e(b.d), s = r.charAt(0), v++; for (c = b.e, s > 1 ? (b = new E("0." + r), c++) : b = new E(s + "." + r.slice(1)), g = b, l = a = b = Sn(b.minus(1), b.plus(1), p, 1), w = o(b.times(b), p, 1), u = 3; ;) { if (a = o(a.times(w), p, 1), d = l.plus(Sn(a, new E(u), p, 1)), e(d.d).slice(0, p) === e(l.d).slice(0, p)) { if (l = l.times(2), 0 !== c && (l = l.plus(f(E, p + 2, y).times(c + ""))), l = Sn(l, new E(v), p, 1), null != i) return E.precision = y, l; if (!t(l.d, p - N, M, h)) return o(l, E.precision = y, M, bn = !0); E.precision = p += N, d = a = b = Sn(g.minus(1), g.plus(1), p, 1), w = o(b.times(b), p, 1), u = h = 1 } l = d, u += 2 } } function v(n) { return String(n.s * n.s / 0) } function N(n, e) { var i, t, r; for ((i = e.indexOf(".")) > -1 && (e = e.replace(".", "")), (t = e.search(/e/i)) > 0 ? (0 > i && (i = t), i += +e.slice(t + 1), e = e.substring(0, t)) : 0 > i && (i = e.length), t = 0; 48 === e.charCodeAt(t) ; t++); for (r = e.length; 48 === e.charCodeAt(r - 1) ; --r); if (e = e.slice(t, r)) { if (r -= t, n.e = i = i - t - 1, n.d = [], t = (i + 1) % Rn, 0 > i && (t += Rn), r > t) { for (t && n.d.push(+e.slice(0, t)), r -= Rn; r > t;) n.d.push(+e.slice(t, t += Rn)); e = e.slice(t), t = Rn - e.length } else t -= r; for (; t--;) e += "0"; n.d.push(+e), bn && (n.e > n.constructor.maxE ? (n.d = null, n.e = NaN) : n.e < n.constructor.minE && (n.e = 0, n.d = [0])) } else n.e = 0, n.d = [0]; return n } function b(n, e) { var i, t, s, o, u, f, a, h, l; if ("Infinity" === e || "NaN" === e) return +e || (n.s = NaN), n.e = NaN, n.d = null, n; if (An.test(e)) i = 16, e = e.toLowerCase(); else if (Fn.test(e)) i = 2; else { if (!Dn.test(e)) throw Error(En + e); i = 8 } for (o = e.search(/p/i), o > 0 ? (a = +e.slice(o + 1), e = e.substring(2, o)) : e = e.slice(2), o = e.indexOf("."), u = o >= 0, t = n.constructor, u && (e = e.replace(".", ""), f = e.length, o = f - o, s = d(t, new t(i), o, 2 * o)), h = r(e, i, Pn), l = h.length - 1, o = l; 0 === h[o]; --o) h.pop(); return 0 > o ? new t(0 * n.s) : (n.e = c(h, l), n.d = h, bn = !1, u && (n = Sn(n, s, 4 * f)), a && (n = n.times(Math.abs(a) < 54 ? Math.pow(2, a) : Nn.pow(2, a))), bn = !0, n) } function x(n, e) { var i, t = e.d.length; if (3 > t) return E(n, 2, e, e); i = 1.4 * Math.sqrt(t), i = i > 16 ? 16 : 0 | i, e = e.times(Math.pow(5, -i)), e = E(n, 2, e, e); for (var r, s = new n(5), o = new n(16), u = new n(20) ; i--;) r = e.times(e), e = e.times(s.plus(r.times(o.times(r).minus(u)))); return e } function E(n, e, i, t, r) { var s, o, u, c, f = 1, a = n.precision, h = Math.ceil(a / Rn); for (bn = !1, c = i.times(i), u = new n(t) ; ;) { if (o = Sn(u.times(c), new n(e++ * e++), a, 1), u = r ? t.plus(o) : t.minus(o), t = Sn(o.times(c), new n(e++ * e++), a, 1), o = u.plus(t), void 0 !== o.d[h]) { for (s = h; o.d[s] === u.d[s] && s--;); if (-1 == s) break } s = u, u = t, t = o, o = s, f++ } return bn = !0, o.d.length = h + 1, o } function M(n, e) { var i, t = e.s < 0, r = a(n, n.precision, 1), s = r.times(.5); if (e = e.abs(), e.lte(s)) return dn = t ? 4 : 1, e; if (i = e.divToInt(r), i.isZero()) dn = t ? 3 : 2; else { if (e = e.minus(i.times(r)), e.lte(s)) return dn = p(i) ? t ? 2 : 3 : t ? 4 : 1, e; dn = p(i) ? t ? 1 : 4 : t ? 3 : 2 } return e.minus(r).abs() } function y(n, e, t, s) { var o, c, f, a, h, l, d, p, g, w = n.constructor, m = void 0 !== t; if (m ? (i(t, 1, gn), void 0 === s ? s = w.rounding : i(s, 0, 8)) : (t = w.precision, s = w.rounding), n.isFinite()) { for (d = u(n), f = d.indexOf("."), m ? (o = 2, 16 == e ? t = 4 * t - 3 : 8 == e && (t = 3 * t - 2)) : o = e, f >= 0 && (d = d.replace(".", ""), g = new w(1), g.e = d.length - f, g.d = r(u(g), 10, o), g.e = g.d.length), p = r(d, 10, o), c = h = p.length; 0 == p[--h];) p.pop(); if (p[0]) { if (0 > f ? c-- : (n = new w(n), n.d = p, n.e = c, n = Sn(n, g, t, s, 0, o), p = n.d, c = n.e, l = hn), f = p[t], a = o / 2, l = l || void 0 !== p[t + 1], l = 4 > s ? (void 0 !== f || l) && (0 === s || s === (n.s < 0 ? 3 : 2)) : f > a || f === a && (4 === s || l || 6 === s && 1 & p[t - 1] || s === (n.s < 0 ? 8 : 7)), p.length = t, l) for (; ++p[--t] > o - 1;) p[t] = 0, t || (++c, p.unshift(1)); for (h = p.length; !p[h - 1]; --h); for (f = 0, d = ""; h > f; f++) d += wn.charAt(p[f]); if (m) { if (h > 1) if (16 == e || 8 == e) { for (f = 16 == e ? 4 : 3, --h; h % f; h++) d += "0"; for (p = r(d, o, e), h = p.length; !p[h - 1]; --h); for (f = 1, d = "1."; h > f; f++) d += wn.charAt(p[f]) } else d = d.charAt(0) + "." + d.slice(1); d = d + (0 > c ? "p" : "p+") + c } else if (0 > c) { for (; ++c;) d = "0" + d; d = "0." + d } else if (++c > h) for (c -= h; c--;) d += "0"; else h > c && (d = d.slice(0, c) + "." + d.slice(c)) } else d = m ? "0p+0" : "0"; d = (16 == e ? "0x" : 2 == e ? "0b" : 8 == e ? "0o" : "") + d } else d = v(n); return n.s < 0 ? "-" + d : d } function q(n, e) { return n.length > e ? (n.length = e, !0) : void 0 } function O(n) { return new this(n).abs() } function F(n) { return new this(n).acos() } function A(n) { return new this(n).acosh() } function D(n, e) { return new this(n).plus(e) } function Z(n) { return new this(n).asin() } function P(n) { return new this(n).asinh() } function R(n) { return new this(n).atan() } function L(n) { return new this(n).atanh() } function U(n, e) { n = new this(n), e = new this(e); var i, t = this.precision, r = this.rounding, s = t + 4; return n.s && e.s ? n.d || e.d ? !e.d || n.isZero() ? (i = e.s < 0 ? a(this, t, r) : new this(0), i.s = n.s) : !n.d || e.isZero() ? (i = a(this, s, 1).times(.5), i.s = n.s) : e.s < 0 ? (this.precision = s, this.rounding = 1, i = this.atan(Sn(n, e, s, 1)), e = a(this, s, 1), this.precision = t, this.rounding = r, i = n.s < 0 ? i.minus(e) : i.plus(e)) : i = this.atan(Sn(n, e, s, 1)) : (i = a(this, s, 1).times(e.s > 0 ? .25 : .75), i.s = n.s) : i = new this(NaN), i } function _(n) { return new this(n).cbrt() } function k(n) { return o(n = new this(n), n.e + 1, 2) } function S(n) { if (!n || "object" != typeof n) throw Error(xn + "Object expected"); var e, i, t, r = ["precision", 1, gn, "rounding", 0, 8, "toExpNeg", -pn, 0, "toExpPos", 0, pn, "maxE", 0, pn, "minE", -pn, 0, "modulo", 0, 9]; for (e = 0; e < r.length; e += 3) if (void 0 !== (t = n[i = r[e]])) { if (!(qn(t) === t && t >= r[e + 1] && t <= r[e + 2])) throw Error(En + i + ": " + t); this[i] = t } if (void 0 !== (t = n[i = "crypto"])) { if (t !== !0 && t !== !1 && 0 !== t && 1 !== t) throw Error(En + i + ": " + t); if (t) { if ("undefined" == typeof crypto || !crypto || !crypto.getRandomValues && !crypto.randomBytes) throw Error(yn); this[i] = !0 } else this[i] = !1 } return this } function T(n) { return new this(n).cos() } function C(n) { return new this(n).cosh() } function I(n) { function e(n) { var i, t, r, s = this; if (!(s instanceof e)) return new e(n); if (s.constructor = e, n instanceof e) return s.s = n.s, s.e = n.e, void (s.d = (n = n.d) ? n.slice() : n); if (r = typeof n, "number" === r) { if (0 === n) return s.s = 0 > 1 / n ? -1 : 1, s.e = 0, void (s.d = [0]); if (0 > n ? (n = -n, s.s = -1) : s.s = 1, n === ~~n && 1e7 > n) { for (i = 0, t = n; t >= 10; t /= 10) i++; return s.e = i, void (s.d = [n]) } return 0 * n !== 0 ? (n || (s.s = NaN), s.e = NaN, void (s.d = null)) : N(s, n.toString()) } if ("string" !== r) throw Error(En + n); return 45 === n.charCodeAt(0) ? (n = n.slice(1), s.s = -1) : s.s = 1, Zn.test(n) ? N(s, n) : b(s, n) } var i, t, r; if (e.prototype = kn, e.ROUND_UP = 0, e.ROUND_DOWN = 1, e.ROUND_CEIL = 2, e.ROUND_FLOOR = 3, e.ROUND_HALF_UP = 4, e.ROUND_HALF_DOWN = 5, e.ROUND_HALF_EVEN = 6, e.ROUND_HALF_CEIL = 7, e.ROUND_HALF_FLOOR = 8, e.EUCLID = 9, e.config = e.set = S, e.clone = I, e.abs = O, e.acos = F, e.acosh = A, e.add = D, e.asin = Z, e.asinh = P, e.atan = R, e.atanh = L, e.atan2 = U, e.cbrt = _, e.ceil = k, e.cos = T, e.cosh = C, e.div = H, e.exp = B, e.floor = V, e.hypot = $, e.ln = j, e.log = W, e.log10 = z, e.log2 = J, e.max = G, e.min = K, e.mod = Q, e.mul = X, e.pow = Y, e.random = nn, e.round = en, e.sign = tn, e.sin = rn, e.sinh = sn, e.sqrt = on, e.sub = un, e.tan = cn, e.tanh = fn, e.trunc = an, void 0 === n && (n = {}), n) for (r = ["precision", "rounding", "toExpNeg", "toExpPos", "maxE", "minE", "modulo", "crypto"], i = 0; i < r.length;) n.hasOwnProperty(t = r[i++]) || (n[t] = this[t]); return e.config(n), e } function H(n, e) { return new this(n).div(e) } function B(n) { return new this(n).exp() } function V(n) { return o(n = new this(n), n.e + 1, 3) } function $() { var n, e, i = new this(0); for (bn = !1, n = 0; n < arguments.length;) if (e = new this(arguments[n++]), e.d) i.d && (i = i.plus(e.times(e))); else { if (e.s) return bn = !0, new this(1 / 0); i = e } return bn = !0, i.sqrt() } function j(n) { return new this(n).ln() } function W(n, e) { return new this(n).log(e) } function J(n) { return new this(n).log(2) } function z(n) { return new this(n).log(10) } function G() { return g(this, arguments, "lt") } function K() { return g(this, arguments, "gt") } function Q(n, e) { return new this(n).mod(e) } function X(n, e) { return new this(n).mul(e) } function Y(n, e) { return new this(n).pow(e) } function nn(n) { var e, t, r, s, o = 0, u = new this(1), c = []; if (void 0 === n ? n = this.precision : i(n, 1, gn), r = Math.ceil(n / Rn), this.crypto) if (crypto.getRandomValues) for (e = crypto.getRandomValues(new Uint32Array(r)) ; r > o;) s = e[o], s >= 429e7 ? e[o] = crypto.getRandomValues(new Uint32Array(1))[0] : c[o++] = s % 1e7; else { if (!crypto.randomBytes) throw Error(yn); for (e = crypto.randomBytes(r *= 4) ; r > o;) s = e[o] + (e[o + 1] << 8) + (e[o + 2] << 16) + ((127 & e[o + 3]) << 24), s >= 214e7 ? crypto.randomBytes(4).copy(e, o) : (c.push(s % 1e7), o += 4); o = r / 4 } else for (; r > o;) c[o++] = 1e7 * Math.random() | 0; for (r = c[--o], n %= Rn, r && n && (s = On(10, Rn - n), c[o] = (r / s | 0) * s) ; 0 === c[o]; o--) c.pop(); if (0 > o) t = 0, c = [0]; else { for (t = -1; 0 === c[0]; t -= Rn) c.shift(); for (r = 1, s = c[0]; s >= 10; s /= 10) r++; Rn > r && (t -= Rn - r) } return u.e = t, u.d = c, u } function en(n) { return o(n = new this(n), n.e + 1, this.rounding) } function tn(n) { return n = new this(n), n.d ? n.d[0] ? n.s : 0 * n.s : n.s || NaN } function rn(n) { return new this(n).sin() } function sn(n) { return new this(n).sinh() } function on(n) { return new this(n).sqrt() } function un(n, e) { return new this(n).sub(e) } function cn(n) { return new this(n).tan() } function fn(n) { return new this(n).tanh() } function an(n) { return o(n = new this(n), n.e + 1, 1) } var hn, ln, dn, pn = 9e15, gn = 1e9, wn = "0123456789abcdef", mn = "2.3025850929940456840179914546843642076011014886287729760333279009675726096773524802359972050895982983419677840422862486334095254650828067566662873690987816894829072083255546808437998948262331985283935053089653777326288461633662222876982198867465436674744042432743651550489343149393914796194044002221051017141748003688084012647080685567743216228355220114804663715659121373450747856947683463616792101806445070648000277502684916746550586856935673420670581136429224554405758925724208241314695689016758940256776311356919292033376587141660230105703089634572075440370847469940168269282808481184289314848524948644871927809676271275775397027668605952496716674183485704422507197965004714951050492214776567636938662976979522110718264549734772662425709429322582798502585509785265383207606726317164309505995087807523710333101197857547331541421808427543863591778117054309827482385045648019095610299291824318237525357709750539565187697510374970888692180205189339507238539205144634197265287286965110862571492198849978748873771345686209167058", vn = "3.1415926535897932384626433832795028841971693993751058209749445923078164062862089986280348253421170679821480865132823066470938446095505822317253594081284811174502841027019385211055596446229489549303819644288109756659334461284756482337867831652712019091456485669234603486104543266482133936072602491412737245870066063155881748815209209628292540917153643678925903600113305305488204665213841469519415116094330572703657595919530921861173819326117931051185480744623799627495673518857527248912279381830119491298336733624406566430860213949463952247371907021798609437027705392171762931767523846748184676694051320005681271452635608277857713427577896091736371787214684409012249534301465495853710507922796892589235420199561121290219608640344181598136297747713099605187072113499999983729780499510597317328160963185950244594553469083026425223082533446850352619311881710100031378387528865875332083814206171776691473035982534904287554687311595628638823537875937519577818577805321712268066130019278766111959092164201989380952572010654858632789", Nn = { precision: 20, rounding: 4, modulo: 1, toExpNeg: -7, toExpPos: 21, minE: -pn, maxE: pn, crypto: !1 }, bn = !0, xn = "[DecimalError] ", En = xn + "Invalid argument: ", Mn = xn + "Precision limit exceeded", yn = xn + "crypto unavailable", qn = Math.floor, On = Math.pow, Fn = /^0b([01]+(\.[01]*)?|\.[01]+)(p[+-]?\d+)?$/i, An = /^0x([0-9a-f]+(\.[0-9a-f]*)?|\.[0-9a-f]+)(p[+-]?\d+)?$/i, Dn = /^0o([0-7]+(\.[0-7]*)?|\.[0-7]+)(p[+-]?\d+)?$/i, Zn = /^(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i, Pn = 1e7, Rn = 7, Ln = 9007199254740991, Un = mn.length - 1, _n = vn.length - 1, kn = {}; kn.absoluteValue = kn.abs = function () { var n = new this.constructor(this); return n.s < 0 && (n.s = 1), o(n) }, kn.ceil = function () { return o(new this.constructor(this), this.e + 1, 2) }, kn.comparedTo = kn.cmp = function (n) { var e, i, t, r, s = this, o = s.d, u = (n = new s.constructor(n)).d, c = s.s, f = n.s; if (!o || !u) return c && f ? c !== f ? c : o === u ? 0 : !o ^ 0 > c ? 1 : -1 : NaN; if (!o[0] || !u[0]) return o[0] ? c : u[0] ? -f : 0; if (c !== f) return c; if (s.e !== n.e) return s.e > n.e ^ 0 > c ? 1 : -1; for (t = o.length, r = u.length, e = 0, i = r > t ? t : r; i > e; ++e) if (o[e] !== u[e]) return o[e] > u[e] ^ 0 > c ? 1 : -1; return t === r ? 0 : t > r ^ 0 > c ? 1 : -1 }, kn.cosine = kn.cos = function () { var n, e, i = this, t = i.constructor; return i.d ? i.d[0] ? (n = t.precision, e = t.rounding, t.precision = n + Math.max(i.e, i.sd()) + Rn, t.rounding = 1, i = s(t, M(t, i)), t.precision = n, t.rounding = e, o(2 == dn || 3 == dn ? i.neg() : i, n, e, !0)) : new t(1) : new t(NaN) }, kn.cubeRoot = kn.cbrt = function () { var n, i, t, r, s, u, c, f, a, h, l = this, d = l.constructor; if (!l.isFinite() || l.isZero()) return new d(l); for (bn = !1, u = l.s * Math.pow(l.s * l, 1 / 3), u && Math.abs(u) != 1 / 0 ? r = new d(u.toString()) : (t = e(l.d), n = l.e, (u = (n - t.length + 1) % 3) && (t += 1 == u || -2 == u ? "0" : "00"), u = Math.pow(t, 1 / 3), n = qn((n + 1) / 3) - (n % 3 == (0 > n ? -1 : 2)), u == 1 / 0 ? t = "5e" + n : (t = u.toExponential(), t = t.slice(0, t.indexOf("e") + 1) + n), r = new d(t), r.s = l.s), c = (n = d.precision) + 3; ;) if (f = r, a = f.times(f).times(f), h = a.plus(l), r = Sn(h.plus(l).times(f), h.plus(a), c + 2, 1), e(f.d).slice(0, c) === (t = e(r.d)).slice(0, c)) { if (t = t.slice(c - 3, c + 1), "9999" != t && (s || "4999" != t)) { (!+t || !+t.slice(1) && "5" == t.charAt(0)) && (o(r, n + 1, 1), i = !r.times(r).times(r).eq(l)); break } if (!s && (o(f, n + 1, 0), f.times(f).times(f).eq(l))) { r = f; break } c += 4, s = 1 } return bn = !0, o(r, n, d.rounding, i) }, kn.decimalPlaces = kn.dp = function () { var n, e = this.d, i = NaN; if (e) { if (n = e.length - 1, i = (n - qn(this.e / Rn)) * Rn, n = e[n]) for (; n % 10 == 0; n /= 10) i--; 0 > i && (i = 0) } return i }, kn.dividedBy = kn.div = function (n) { return Sn(this, new this.constructor(n)) }, kn.dividedToIntegerBy = kn.divToInt = function (n) { var e = this, i = e.constructor; return o(Sn(e, new i(n), 0, 1, 1), i.precision, i.rounding) }, kn.equals = kn.eq = function (n) { return 0 === this.cmp(n) }, kn.floor = function () { return o(new this.constructor(this), this.e + 1, 3) }, kn.greaterThan = kn.gt = function (n) { return this.cmp(n) > 0 }, kn.greaterThanOrEqualTo = kn.gte = function (n) { var e = this.cmp(n); return 1 == e || 0 === e }, kn.hyperbolicCosine = kn.cosh = function () { var n, e, i, t, r, s = this, u = s.constructor, c = new u(1); if (!s.isFinite()) return new u(s.s ? 1 / 0 : NaN); if (s.isZero()) return c; i = u.precision, t = u.rounding, u.precision = i + Math.max(s.e, s.sd()) + 4, u.rounding = 1, r = s.d.length, 32 > r ? (n = Math.ceil(r / 3), e = Math.pow(4, -n).toString()) : (n = 16, e = "2.3283064365386962890625e-10"), s = E(u, 1, s.times(e), new u(1), !0); for (var f, a = n, h = new u(8) ; a--;) f = s.times(s), s = c.minus(f.times(h.minus(f.times(h)))); return o(s, u.precision = i, u.rounding = t, !0) }, kn.hyperbolicSine = kn.sinh = function () { var n, e, i, t, r = this, s = r.constructor; if (!r.isFinite() || r.isZero()) return new s(r); if (e = s.precision, i = s.rounding, s.precision = e + Math.max(r.e, r.sd()) + 4, s.rounding = 1, t = r.d.length, 3 > t) r = E(s, 2, r, r, !0); else { n = 1.4 * Math.sqrt(t), n = n > 16 ? 16 : 0 | n, r = r.times(Math.pow(5, -n)), r = E(s, 2, r, r, !0); for (var u, c = new s(5), f = new s(16), a = new s(20) ; n--;) u = r.times(r), r = r.times(c.plus(u.times(f.times(u).plus(a)))) } return s.precision = e, s.rounding = i, o(r, e, i, !0) }, kn.hyperbolicTangent = kn.tanh = function () { var n, e, i = this, t = i.constructor; return i.isFinite() ? i.isZero() ? new t(i) : (n = t.precision, e = t.rounding, t.precision = n + 7, t.rounding = 1, Sn(i.sinh(), i.cosh(), t.precision = n, t.rounding = e)) : new t(i.s) }, kn.inverseCosine = kn.acos = function () { var n, e = this, i = e.constructor, t = e.abs().cmp(1), r = i.precision, s = i.rounding; return -1 !== t ? 0 === t ? e.isNeg() ? a(i, r, s) : new i(0) : new i(NaN) : e.isZero() ? a(i, r + 4, s).times(.5) : (i.precision = r + 6, i.rounding = 1, e = e.asin(), n = a(i, r + 4, s).times(.5), i.precision = r, i.rounding = s, n.minus(e)) }, kn.inverseHyperbolicCosine = kn.acosh = function () { var n, e, i = this, t = i.constructor; return i.lte(1) ? new t(i.eq(1) ? 0 : NaN) : i.isFinite() ? (n = t.precision, e = t.rounding, t.precision = n + Math.max(Math.abs(i.e), i.sd()) + 4, t.rounding = 1, bn = !1, i = i.times(i).minus(1).sqrt().plus(i), bn = !0, t.precision = n, t.rounding = e, i.ln()) : new t(i) }, kn.inverseHyperbolicSine = kn.asinh = function () { var n, e, i = this, t = i.constructor; return !i.isFinite() || i.isZero() ? new t(i) : (n = t.precision, e = t.rounding, t.precision = n + 2 * Math.max(Math.abs(i.e), i.sd()) + 6, t.rounding = 1, bn = !1, i = i.times(i).plus(1).sqrt().plus(i), bn = !0, t.precision = n, t.rounding = e, i.ln()) }, kn.inverseHyperbolicTangent = kn.atanh = function () { var n, e, i, t, r = this, s = r.constructor; return r.isFinite() ? r.e >= 0 ? new s(r.abs().eq(1) ? r.s / 0 : r.isZero() ? r : NaN) : (n = s.precision, e = s.rounding, t = r.sd(), Math.max(t, n) < 2 * -r.e - 1 ? o(new s(r), n, e, !0) : (s.precision = i = t - r.e, r = Sn(r.plus(1), new s(1).minus(r), i + n, 1), s.precision = n + 4, s.rounding = 1, r = r.ln(), s.precision = n, s.rounding = e, r.times(.5))) : new s(NaN) }, kn.inverseSine = kn.asin = function () { var n, e, i, t, r = this, s = r.constructor; return r.isZero() ? new s(r) : (e = r.abs().cmp(1), i = s.precision, t = s.rounding, -1 !== e ? 0 === e ? (n = a(s, i + 4, t).times(.5), n.s = r.s, n) : new s(NaN) : (s.precision = i + 6, s.rounding = 1, r = r.div(new s(1).minus(r.times(r)).sqrt().plus(1)).atan(), s.precision = i, s.rounding = t, r.times(2))) }, kn.inverseTangent = kn.atan = function () { var n, e, i, t, r, s, u, c, f, h = this, l = h.constructor, d = l.precision, p = l.rounding; if (h.isFinite()) { if (h.isZero()) return new l(h); if (h.abs().eq(1) && _n >= d + 4) return u = a(l, d + 4, p).times(.25), u.s = h.s, u } else { if (!h.s) return new l(NaN); if (_n >= d + 4) return u = a(l, d + 4, p).times(.5), u.s = h.s, u } for (l.precision = c = d + 10, l.rounding = 1, i = Math.min(28, c / Rn + 2 | 0), n = i; n; --n) h = h.div(h.times(h).plus(1).sqrt().plus(1)); for (bn = !1, e = Math.ceil(c / Rn), t = 1, f = h.times(h), u = new l(h), r = h; -1 !== n;) if (r = r.times(f), s = u.minus(r.div(t += 2)), r = r.times(f), u = s.plus(r.div(t += 2)), void 0 !== u.d[e]) for (n = e; u.d[n] === s.d[n] && n--;); return i && (u = u.times(2 << i - 1)), bn = !0, o(u, l.precision = d, l.rounding = p, !0) }, kn.isFinite = function () { return !!this.d }, kn.isInteger = kn.isInt = function () { return !!this.d && qn(this.e / Rn) > this.d.length - 2 }, kn.isNaN = function () { return !this.s }, kn.isNegative = kn.isNeg = function () { return this.s < 0 }, kn.isPositive = kn.isPos = function () { return this.s > 0 }, kn.isZero = function () { return !!this.d && 0 === this.d[0] }, kn.lessThan = kn.lt = function (n) { return this.cmp(n) < 0 }, kn.lessThanOrEqualTo = kn.lte = function (n) { return this.cmp(n) < 1 }, kn.logarithm = kn.log = function (n) { var i, r, s, u, c, a, h, l, d = this, p = d.constructor, g = p.precision, w = p.rounding, v = 5; if (null == n) n = new p(10), i = !0; else { if (n = new p(n), r = n.d, n.s < 0 || !r || !r[0] || n.eq(1)) return new p(NaN); i = n.eq(10) } if (r = d.d, d.s < 0 || !r || !r[0] || d.eq(1)) return new p(r && !r[0] ? -1 / 0 : 1 != d.s ? NaN : r ? 0 : 1 / 0); if (i) if (r.length > 1) c = !0; else { for (u = r[0]; u % 10 === 0;) u /= 10; c = 1 !== u } if (bn = !1, h = g + v, a = m(d, h), s = i ? f(p, h + 10) : m(n, h), l = Sn(a, s, h, 1), t(l.d, u = g, w)) do if (h += 10, a = m(d, h), s = i ? f(p, h + 10) : m(n, h), l = Sn(a, s, h, 1), !c) { +e(l.d).slice(u + 1, u + 15) + 1 == 1e14 && (l = o(l, g + 1, 0)); break } while (t(l.d, u += 10, w)); return bn = !0, o(l, g, w) }, kn.minus = kn.sub = function (n) { var e, i, t, r, s, u, f, a, h, l, d, p, g = this, w = g.constructor; if (n = new w(n), !g.d || !n.d) return g.s && n.s ? g.d ? n.s = -n.s : n = new w(n.d || g.s !== n.s ? g : NaN) : n = new w(NaN), n; if (g.s != n.s) return n.s = -n.s, g.plus(n); if (h = g.d, p = n.d, f = w.precision, a = w.rounding, !h[0] || !p[0]) { if (p[0]) n.s = -n.s; else { if (!h[0]) return new w(3 === a ? -0 : 0); n = new w(g) } return bn ? o(n, f, a) : n } if (i = qn(n.e / Rn), l = qn(g.e / Rn), h = h.slice(), s = l - i) { for (d = 0 > s, d ? (e = h, s = -s, u = p.length) : (e = p, i = l, u = h.length), t = Math.max(Math.ceil(f / Rn), u) + 2, s > t && (s = t, e.length = 1), e.reverse(), t = s; t--;) e.push(0); e.reverse() } else { for (t = h.length, u = p.length, d = u > t, d && (u = t), t = 0; u > t; t++) if (h[t] != p[t]) { d = h[t] < p[t]; break } s = 0 } for (d && (e = h, h = p, p = e, n.s = -n.s), u = h.length, t = p.length - u; t > 0; --t) h[u++] = 0; for (t = p.length; t > s;) { if (h[--t] < p[t]) { for (r = t; r && 0 === h[--r];) h[r] = Pn - 1; --h[r], h[t] += Pn } h[t] -= p[t] } for (; 0 === h[--u];) h.pop(); for (; 0 === h[0]; h.shift())--i; return h[0] ? (n.d = h, n.e = c(h, i), bn ? o(n, f, a) : n) : new w(3 === a ? -0 : 0) }, kn.modulo = kn.mod = function (n) { var e, i = this, t = i.constructor; return n = new t(n), !i.d || !n.s || n.d && !n.d[0] ? new t(NaN) : !n.d || i.d && !i.d[0] ? o(new t(i), t.precision, t.rounding) : (bn = !1, 9 == t.modulo ? (e = Sn(i, n.abs(), 0, 3, 1), e.s *= n.s) : e = Sn(i, n, 0, t.modulo, 1), e = e.times(n), bn = !0, i.minus(e)) }, kn.naturalExponential = kn.exp = function () { return w(this) }, kn.naturalLogarithm = kn.ln = function () { return m(this) }, kn.negated = kn.neg = function () { var n = new this.constructor(this); return n.s = -n.s, o(n) }, kn.plus = kn.add = function (n) { var e, i, t, r, s, u, f, a, h, l, d = this, p = d.constructor; if (n = new p(n), !d.d || !n.d) return d.s && n.s ? d.d || (n = new p(n.d || d.s === n.s ? d : NaN)) : n = new p(NaN), n; if (d.s != n.s) return n.s = -n.s, d.minus(n); if (h = d.d, l = n.d, f = p.precision, a = p.rounding, !h[0] || !l[0]) return l[0] || (n = new p(d)), bn ? o(n, f, a) : n; if (s = qn(d.e / Rn), t = qn(n.e / Rn), h = h.slice(), r = s - t) { for (0 > r ? (i = h, r = -r, u = l.length) : (i = l, t = s, u = h.length), s = Math.ceil(f / Rn), u = s > u ? s + 1 : u + 1, r > u && (r = u, i.length = 1), i.reverse() ; r--;) i.push(0); i.reverse() } for (u = h.length, r = l.length, 0 > u - r && (r = u, i = l, l = h, h = i), e = 0; r;) e = (h[--r] = h[r] + l[r] + e) / Pn | 0, h[r] %= Pn; for (e && (h.unshift(e), ++t), u = h.length; 0 == h[--u];) h.pop(); return n.d = h, n.e = c(h, t), bn ? o(n, f, a) : n }, kn.precision = kn.sd = function (n) { var e, i = this; if (void 0 !== n && n !== !!n && 1 !== n && 0 !== n) throw Error(En + n); return i.d ? (e = h(i.d), n && i.e + 1 > e && (e = i.e + 1)) : e = NaN, e }, kn.round = function () { var n = this, e = n.constructor; return o(new e(n), n.e + 1, e.rounding) }, kn.sine = kn.sin = function () { var n, e, i = this, t = i.constructor; return i.isFinite() ? i.isZero() ? new t(i) : (n = t.precision, e = t.rounding, t.precision = n + Math.max(i.e, i.sd()) + Rn, t.rounding = 1, i = x(t, M(t, i)), t.precision = n, t.rounding = e, o(dn > 2 ? i.neg() : i, n, e, !0)) : new t(NaN) }, kn.squareRoot = kn.sqrt = function () { var n, i, t, r, s, u, c = this, f = c.d, a = c.e, h = c.s, l = c.constructor; if (1 !== h || !f || !f[0]) return new l(!h || 0 > h && (!f || f[0]) ? NaN : f ? c : 1 / 0); for (bn = !1, h = Math.sqrt(+c), 0 == h || h == 1 / 0 ? (i = e(f), (i.length + a) % 2 == 0 && (i += "0"), h = Math.sqrt(i), a = qn((a + 1) / 2) - (0 > a || a % 2), h == 1 / 0 ? i = "1e" + a : (i = h.toExponential(), i = i.slice(0, i.indexOf("e") + 1) + a), r = new l(i)) : r = new l(h.toString()), t = (a = l.precision) + 3; ;) if (u = r, r = u.plus(Sn(c, u, t + 2, 1)).times(.5), e(u.d).slice(0, t) === (i = e(r.d)).slice(0, t)) { if (i = i.slice(t - 3, t + 1), "9999" != i && (s || "4999" != i)) { (!+i || !+i.slice(1) && "5" == i.charAt(0)) && (o(r, a + 1, 1), n = !r.times(r).eq(c)); break } if (!s && (o(u, a + 1, 0), u.times(u).eq(c))) { r = u; break } t += 4, s = 1 } return bn = !0, o(r, a, l.rounding, n) }, kn.tangent = kn.tan = function () { var n, e, i = this, t = i.constructor; return i.isFinite() ? i.isZero() ? new t(i) : (n = t.precision, e = t.rounding, t.precision = n + 10, t.rounding = 1, i = i.sin(), i.s = 1, i = Sn(i, new t(1).minus(i.times(i)).sqrt(), n + 10, 0), t.precision = n, t.rounding = e, o(2 == dn || 4 == dn ? i.neg() : i, n, e, !0)) : new t(NaN) }, kn.times = kn.mul = function (n) { var e, i, t, r, s, u, f, a, h, l = this, d = l.constructor, p = l.d, g = (n = new d(n)).d; if (n.s *= l.s, !(p && p[0] && g && g[0])) return new d(!n.s || p && !p[0] && !g || g && !g[0] && !p ? NaN : p && g ? 0 * n.s : n.s / 0); for (i = qn(l.e / Rn) + qn(n.e / Rn), a = p.length, h = g.length, h > a && (s = p, p = g, g = s, u = a, a = h, h = u), s = [], u = a + h, t = u; t--;) s.push(0); for (t = h; --t >= 0;) { for (e = 0, r = a + t; r > t;) f = s[r] + g[t] * p[r - t - 1] + e, s[r--] = f % Pn | 0, e = f / Pn | 0; s[r] = (s[r] + e) % Pn | 0 } for (; !s[--u];) s.pop(); for (e ? ++i : s.shift(), t = s.length; !s[--t];) s.pop(); return n.d = s, n.e = c(s, i), bn ? o(n, d.precision, d.rounding) : n }, kn.toBinary = function (n, e) { return y(this, 2, n, e) }, kn.toDecimalPlaces = kn.toDP = function (n, e) { var t = this, r = t.constructor; return t = new r(t), void 0 === n ? t : (i(n, 0, gn), void 0 === e ? e = r.rounding : i(e, 0, 8), o(t, n + t.e + 1, e)) }, kn.toExponential = function (n, e) { var t, r = this, s = r.constructor; return void 0 === n ? t = u(r, !0) : (i(n, 0, gn), void 0 === e ? e = s.rounding : i(e, 0, 8), r = o(new s(r), n + 1, e), t = u(r, !0, n + 1)), r.isNeg() && !r.isZero() ? "-" + t : t }, kn.toFixed = function (n, e) { var t, r, s = this, c = s.constructor; return void 0 === n ? t = u(s) : (i(n, 0, gn), void 0 === e ? e = c.rounding : i(e, 0, 8), r = o(new c(s), n + s.e + 1, e), t = u(r, !1, n + r.e + 1)), s.isNeg() && !s.isZero() ? "-" + t : t }, kn.toFraction = function (n) { var i, t, r, s, o, u, c, f, a, l, d, p, g = this, w = g.d, m = g.constructor; if (!w) return new m(g); if (a = t = new m(1), r = f = new m(0), i = new m(r), o = i.e = h(w) - g.e - 1, u = o % Rn, i.d[0] = On(10, 0 > u ? Rn + u : u), null == n) n = o > 0 ? i : a; else { if (c = new m(n), !c.isInt() || c.lt(a)) throw Error(En + c); n = c.gt(i) ? o > 0 ? i : a : c } for (bn = !1, c = new m(e(w)), l = m.precision, m.precision = o = w.length * Rn * 2; d = Sn(c, i, 0, 1, 1), s = t.plus(d.times(r)), 1 != s.cmp(n) ;) t = r, r = s, s = a, a = f.plus(d.times(s)), f = s, s = i, i = c.minus(d.times(s)), c = s; return s = Sn(n.minus(t), r, 0, 1, 1), f = f.plus(s.times(a)), t = t.plus(s.times(r)), f.s = a.s = g.s, p = Sn(a, r, o, 1).minus(g).abs().cmp(Sn(f, t, o, 1).minus(g).abs()) < 1 ? [a, r] : [f, t], m.precision = l, bn = !0, p }, kn.toHexadecimal = kn.toHex = function (n, e) { return y(this, 16, n, e) }, kn.toNearest = function (n, e) { var t = this, r = t.constructor; if (t = new r(t), null == n) { if (!t.d) return t; n = new r(1), e = r.rounding } else { if (n = new r(n), void 0 !== e && i(e, 0, 8), !t.d) return n.s ? t : n; if (!n.d) return n.s && (n.s = t.s), n } return n.d[0] ? (bn = !1, 4 > e && (e = [4, 5, 7, 8][e]), t = Sn(t, n, 0, e, 1).times(n), bn = !0, o(t)) : (n.s = t.s, t = n), t }, kn.toNumber = function () { return +this }, kn.toOctal = function (n, e) { return y(this, 8, n, e) }, kn.toPower = kn.pow = function (n) { var i, r, s, u, c, f, a, h = this, l = h.constructor, p = +(n = new l(n)); if (!(h.d && n.d && h.d[0] && n.d[0])) return new l(On(+h, p)); if (h = new l(h), h.eq(1)) return h; if (s = l.precision, c = l.rounding, n.eq(1)) return o(h, s, c); if (i = qn(n.e / Rn), r = n.d.length - 1, a = i >= r, f = h.s, a) { if ((r = 0 > p ? -p : p) <= Ln) return u = d(l, h, r, s), n.s < 0 ? new l(1).div(u) : o(u, s, c) } else if (0 > f) return new l(NaN); return f = 0 > f && 1 & n.d[Math.max(i, r)] ? -1 : 1, r = On(+h, p), i = 0 != r && isFinite(r) ? new l(r + "").e : qn(p * (Math.log("0." + e(h.d)) / Math.LN10 + h.e + 1)), i > l.maxE + 1 || i < l.minE - 1 ? new l(i > 0 ? f / 0 : 0) : (bn = !1, l.rounding = h.s = 1, r = Math.min(12, (i + "").length), u = w(n.times(m(h, s + r)), s), u = o(u, s + 5, 1), t(u.d, s, c) && (i = s + 10, u = o(w(n.times(m(h, i + r)), i), i + 5, 1), +e(u.d).slice(s + 1, s + 15) + 1 == 1e14 && (u = o(u, s + 1, 0))), u.s = f, bn = !0, l.rounding = c, o(u, s, c)) }, kn.toPrecision = function (n, e) { var t, r = this, s = r.constructor; return void 0 === n ? t = u(r, r.e <= s.toExpNeg || r.e >= s.toExpPos) : (i(n, 1, gn), void 0 === e ? e = s.rounding : i(e, 0, 8), r = o(new s(r), n, e), t = u(r, n <= r.e || r.e <= s.toExpNeg, n)), r.isNeg() && !r.isZero() ? "-" + t : t }, kn.toSignificantDigits = kn.toSD = function (n, e) { var t = this, r = t.constructor; return void 0 === n ? (n = r.precision, e = r.rounding) : (i(n, 1, gn), void 0 === e ? e = r.rounding : i(e, 0, 8)), o(new r(t), n, e) }, kn.toString = function () { var n = this, e = n.constructor, i = u(n, n.e <= e.toExpNeg || n.e >= e.toExpPos); return n.isNeg() && !n.isZero() ? "-" + i : i }, kn.truncated = kn.trunc = function () { return o(new this.constructor(this), this.e + 1, 1) }, kn.valueOf = kn.toJSON = function () { var n = this, e = n.constructor, i = u(n, n.e <= e.toExpNeg || n.e >= e.toExpPos); return n.isNeg() ? "-" + i : i }; var Sn = function () { function n(n, e, i) { var t, r = 0, s = n.length; for (n = n.slice() ; s--;) t = n[s] * e + r, n[s] = t % i | 0, r = t / i | 0; return r && n.unshift(r), n } function e(n, e, i, t) { var r, s; if (i != t) s = i > t ? 1 : -1; else for (r = s = 0; i > r; r++) if (n[r] != e[r]) { s = n[r] > e[r] ? 1 : -1; break } return s } function i(n, e, i, t) { for (var r = 0; i--;) n[i] -= r, r = n[i] < e[i] ? 1 : 0, n[i] = r * t + n[i] - e[i]; for (; !n[0] && n.length > 1;) n.shift() } return function (t, r, s, u, c, f) { var a, h, l, d, p, g, w, m, v, N, b, x, E, M, y, q, O, F, A, D, Z = t.constructor, P = t.s == r.s ? 1 : -1, R = t.d, L = r.d; if (!(R && R[0] && L && L[0])) return new Z(t.s && r.s && (R ? !L || R[0] != L[0] : L) ? R && 0 == R[0] || !L ? 0 * P : P / 0 : NaN); for (f ? (p = 1, h = t.e - r.e) : (f = Pn, p = Rn, h = qn(t.e / p) - qn(r.e / p)), A = L.length, O = R.length, v = new Z(P), N = v.d = [], l = 0; L[l] == (R[l] || 0) ; l++); if (L[l] > (R[l] || 0) && h--, null == s ? (M = s = Z.precision, u = Z.rounding) : M = c ? s + (t.e - r.e) + 1 : s, 0 > M) N.push(1), g = !0; else { if (M = M / p + 2 | 0, l = 0, 1 == A) { for (d = 0, L = L[0], M++; (O > l || d) && M--; l++) y = d * f + (R[l] || 0), N[l] = y / L | 0, d = y % L | 0; g = d || O > l } else { for (d = f / (L[0] + 1) | 0, d > 1 && (L = n(L, d, f), R = n(R, d, f), A = L.length, O = R.length), q = A, b = R.slice(0, A), x = b.length; A > x;) b[x++] = 0; D = L.slice(), D.unshift(0), F = L[0], L[1] >= f / 2 && ++F; do d = 0, a = e(L, b, A, x), 0 > a ? (E = b[0], A != x && (E = E * f + (b[1] || 0)), d = E / F | 0, d > 1 ? (d >= f && (d = f - 1), w = n(L, d, f), m = w.length, x = b.length, a = e(w, b, m, x), 1 == a && (d--, i(w, m > A ? D : L, m, f))) : (0 == d && (a = d = 1), w = L.slice()), m = w.length, x > m && w.unshift(0), i(b, w, x, f), -1 == a && (x = b.length, a = e(L, b, A, x), 1 > a && (d++, i(b, x > A ? D : L, x, f))), x = b.length) : 0 === a && (d++, b = [0]), N[l++] = d, a && b[0] ? b[x++] = R[q] || 0 : (b = [R[q]], x = 1); while ((q++ < O || void 0 !== b[0]) && M--); g = void 0 !== b[0] } N[0] || N.shift() } if (1 == p) v.e = h, hn = g; else { for (l = 1, d = N[0]; d >= 10; d /= 10) l++; v.e = l + h * p - 1, o(v, c ? s + v.e + 1 : s, u, g) } return v } }(); Nn = I(Nn), mn = new Nn(mn), vn = new Nn(vn), Bridge.$Decimal = Nn, "function" == typeof define && define.amd ? define(function () { return Nn }) : "undefined" != typeof module && module.exports ? module.exports = Nn["default"] = Nn.Decimal = Nn : (n || (n = "undefined" != typeof self && self && self.self == self ? self : Function("return this")()), ln = n.Decimal, Nn.noConflict = function () { return n.Decimal = ln, Nn }/*, n.Decimal = Nn*/) }(Bridge.global);

    System.Decimal = function (v, provider, T) {
        if (this.constructor !== System.Decimal) {
            return new System.Decimal(v, provider, T);
        }

        if (v == null) {
            v = 0;
        }

        if (typeof v === "string") {
            provider = provider || System.Globalization.CultureInfo.getCurrentCulture();

            var nfInfo = provider && provider.getFormat(System.Globalization.NumberFormatInfo);

            if (nfInfo && nfInfo.numberDecimalSeparator !== ".") {
                v = v.replace(nfInfo.numberDecimalSeparator, ".");
            }

            if (!/^\s*[+-]?(\d+|\d+.|\d*\.\d+)((e|E)[+-]?\d+)?\s*$/.test(v)) {
                throw new System.FormatException();
            }

            v = v.replace(/\s/g, "");
        }

        if (T && T.precision && typeof v === "number") {
            var i = Bridge.Int.trunc(v);
            var length = (i + '').length;
            var p = T.precision - length;
            if (p < 0) {
                p = 0;
            }
            v = v.toFixed(p);
        }

        this.value = System.Decimal.getValue(v);
    }

    System.Decimal.$$name = "System.Decimal";
    System.Decimal.prototype.$$name = "System.Decimal";
    System.Decimal.$kind = "struct";
    System.Decimal.prototype.$kind = "struct";
    System.Decimal.$$inherits = [];
    Bridge.Class.addExtend(System.Decimal, [System.IComparable, System.IFormattable, System.IComparable$1(System.Decimal), System.IEquatable$1(System.Decimal)]);

    System.Decimal.$is = function (instance) {
        return instance instanceof System.Decimal;
    };

    System.Decimal.getDefaultValue = function () {
        return new System.Decimal(0);
    };

    System.Decimal.getValue = function (d) {
        if (!Bridge.hasValue(d)) {
            return this.getDefaultValue();
        }

        if (d instanceof System.Decimal) {
            return d.value;
        }

        if (d instanceof System.Int64 || d instanceof System.UInt64) {
            return new Bridge.$Decimal(d.toString());
        }

        return new Bridge.$Decimal(d);
    };

    System.Decimal.create = function (d) {
        if (!Bridge.hasValue(d)) {
            return null;
        }

        if (d instanceof System.Decimal) {
            return d;
        }

        return new System.Decimal(d);
    };

    System.Decimal.lift = function (d) {
        return d == null ? null : System.Decimal.create(d);
    };

    System.Decimal.prototype.toString = function (format, provider) {
        if (!format && !provider) {
            return this.value.toString();
        }

        return Bridge.Int.format(this, format, provider);
    };

    System.Decimal.prototype.toFloat = function () {
        return this.value.toNumber();
    };

    System.Decimal.prototype.toJSON = function () {
        return this.value.toNumber();
    };

    System.Decimal.prototype.format = function (format, provider) {
        return Bridge.Int.format(this, format, provider);
    };

    System.Decimal.prototype.decimalPlaces = function () {
        return this.value.decimalPlaces();
    };

    System.Decimal.prototype.dividedToIntegerBy = function (d) {
        return new System.Decimal(this.value.dividedToIntegerBy(System.Decimal.getValue(d)));
    };

    System.Decimal.prototype.exponential = function () {
        return new System.Decimal(this.value.exponential());
    };

    System.Decimal.prototype.abs = function () {
        return new System.Decimal(this.value.abs());
    };

    System.Decimal.prototype.floor = function () {
        return new System.Decimal(this.value.floor());
    };

    System.Decimal.prototype.ceil = function () {
        return new System.Decimal(this.value.ceil());
    };

    System.Decimal.prototype.trunc = function () {
        return new System.Decimal(this.value.trunc());
    };

    System.Decimal.round = function (obj, mode) {
        obj = System.Decimal.create(obj);

        var old = Bridge.$Decimal.rounding;

        Bridge.$Decimal.rounding = mode;

        var d = new System.Decimal(obj.value.round());

        Bridge.$Decimal.rounding = old;

        return d;
    };

    System.Decimal.toDecimalPlaces = function (obj, decimals, mode) {
        obj = System.Decimal.create(obj);
        var d = new System.Decimal(obj.value.toDecimalPlaces(decimals, mode));
        return d;
    };

    System.Decimal.prototype.compareTo = function (another) {
        return this.value.comparedTo(System.Decimal.getValue(another));
    };

    System.Decimal.prototype.add = function (another) {
        return new System.Decimal(this.value.plus(System.Decimal.getValue(another)));
    };

    System.Decimal.prototype.sub = function (another) {
        return new System.Decimal(this.value.minus(System.Decimal.getValue(another)));
    };

    System.Decimal.prototype.isZero = function () {
        return this.value.isZero;
    };

    System.Decimal.prototype.mul = function (another) {
        return new System.Decimal(this.value.times(System.Decimal.getValue(another)));
    };

    System.Decimal.prototype.div = function (another) {
        return new System.Decimal(this.value.dividedBy(System.Decimal.getValue(another)));
    };

    System.Decimal.prototype.mod = function (another) {
        return new System.Decimal(this.value.modulo(System.Decimal.getValue(another)));
    };

    System.Decimal.prototype.neg = function () {
        return new System.Decimal(this.value.negated());
    };

    System.Decimal.prototype.inc = function () {
        return new System.Decimal(this.value.plus(System.Decimal.getValue(1)));
    };

    System.Decimal.prototype.dec = function () {
        return new System.Decimal(this.value.minus(System.Decimal.getValue(1)));
    };

    System.Decimal.prototype.sign = function () {
        return this.value.isZero() ? 0 : (this.value.isNegative() ? -1 : 1);
    };

    System.Decimal.prototype.clone = function () {
        return new System.Decimal(this);
    };

    System.Decimal.prototype.ne = function (v) {
        return !!this.compareTo(v);
    };

    System.Decimal.prototype.lt = function (v) {
        return this.compareTo(v) < 0;
    };

    System.Decimal.prototype.lte = function (v) {
        return this.compareTo(v) <= 0;
    };

    System.Decimal.prototype.gt = function (v) {
        return this.compareTo(v) > 0;
    };

    System.Decimal.prototype.gte = function (v) {
        return this.compareTo(v) >= 0;
    };

    System.Decimal.prototype.equals = function (v) {
        return !this.compareTo(v);
    };

    System.Decimal.prototype.equalsT = function (v) {
        return !this.compareTo(v);
    };

    System.Decimal.prototype.getHashCode = function () {
        var n = (this.sign() * 397 + this.value.e) | 0;

        for (var i = 0; i < this.value.d.length; i++) {
            n = (n * 397 + this.value.d[i]) | 0;
        }

        return n;
    };

    System.Decimal.toInt = function (v, tp) {
        if (!v) {
            return null;
        }

        if (tp) {
            var str,
                r;

            if (tp === System.Int64) {
                str = v.value.trunc().toString();
                r = new System.Int64(str);

                if (str !== r.value.toString()) {
                    throw new System.OverflowException();
                }

                return r;
            }

            if (tp === System.UInt64) {
                if (v.value.isNegative()) {
                    throw new System.OverflowException();
                }

                str = v.value.trunc().toString();
                r = new System.UInt64(str);

                if (str !== r.value.toString()) {
                    throw new System.OverflowException();
                }

                return r;
            }

            return Bridge.Int.check(Bridge.Int.trunc(v.value.toNumber()), tp);
        }

        var i = Bridge.Int.trunc(System.Decimal.getValue(v).toNumber());

        if (!Bridge.Int.$is(i)) {
            throw new System.OverflowException();
        }

        return i;
    };

    System.Decimal.tryParse = function (s, provider, v) {
        try {
            v.v = new System.Decimal(s, provider);

            return true;
        } catch (e) {
            v.v = new System.Decimal(0);

            return false;
        }
    };

    System.Decimal.toFloat = function (v) {
        if (!v) {
            return null;
        }

        return System.Decimal.getValue(v).toNumber();
    };

    System.Decimal.setConfig = function (config) {
        Bridge.$Decimal.config(config);
    };

    System.Decimal.min = function () {
        var values = [];

        for (var i = 0, len = arguments.length; i < len; i++) {
            values.push(System.Decimal.getValue(arguments[i]));
        }

        return new System.Decimal(Bridge.$Decimal.min.apply(Bridge.$Decimal, values));
    };

    System.Decimal.max = function () {
        var values = [];

        for (var i = 0, len = arguments.length; i < len; i++) {
            values.push(System.Decimal.getValue(arguments[i]));
        }

        return new System.Decimal(Bridge.$Decimal.max.apply(Bridge.$Decimal, values));
    };

    System.Decimal.random = function (dp) {
        return new System.Decimal(Bridge.$Decimal.random(dp));
    };

    System.Decimal.exp = function (d) {
        return new System.Decimal(System.Decimal.getValue(d).exp());
    };

    System.Decimal.exp = function (d) {
        return new System.Decimal(System.Decimal.getValue(d).exp());
    };

    System.Decimal.ln = function (d) {
        return new System.Decimal(System.Decimal.getValue(d).ln());
    };

    System.Decimal.log = function (d, logBase) {
        return new System.Decimal(System.Decimal.getValue(d).log(logBase));
    };

    System.Decimal.pow = function (d, exponent) {
        return new System.Decimal(System.Decimal.getValue(d).pow(exponent));
    };

    System.Decimal.sqrt = function (d) {
        return new System.Decimal(System.Decimal.getValue(d).sqrt());
    };

    System.Decimal.prototype.isFinite = function () {
        return this.value.isFinite();
    };

    System.Decimal.prototype.isInteger = function () {
        return this.value.isInteger();
    };

    System.Decimal.prototype.isNaN = function () {
        return this.value.isNaN();
    };

    System.Decimal.prototype.isNegative = function () {
        return this.value.isNegative();
    };

    System.Decimal.prototype.isZero = function () {
        return this.value.isZero();
    };

    System.Decimal.prototype.log = function (logBase) {
        return new System.Decimal(this.value.log(logBase));
    };

    System.Decimal.prototype.ln = function () {
        return new System.Decimal(this.value.ln());
    };

    System.Decimal.prototype.precision = function () {
        return this.value.precision();
    };

    System.Decimal.prototype.round = function () {
        var old = Bridge.$Decimal.rounding,
            r;

        Bridge.$Decimal.rounding = 6;
        r = new System.Decimal(this.value.round());
        Bridge.$Decimal.rounding = old;

        return r;
    };

    System.Decimal.prototype.sqrt = function () {
        return new System.Decimal(this.value.sqrt());
    };

    System.Decimal.prototype.toDecimalPlaces = function (dp, rm) {
        return new System.Decimal(this.value.toDecimalPlaces(dp, rm));
    };

    System.Decimal.prototype.toExponential = function (dp, rm) {
        return this.value.toExponential(dp, rm);
    };

    System.Decimal.prototype.toFixed = function (dp, rm) {
        return this.value.toFixed(dp, rm);
    };

    System.Decimal.prototype.pow = function (n) {
        return new System.Decimal(this.value.pow(n));
    };

    System.Decimal.prototype.toPrecision = function (dp, rm) {
        return this.value.toPrecision(dp, rm);
    };

    System.Decimal.prototype.toSignificantDigits = function (dp, rm) {
        return new System.Decimal(this.value.toSignificantDigits(dp, rm));
    };

    System.Decimal.prototype.valueOf = function () {
        return this.value.valueOf();
    };

    System.Decimal.prototype._toFormat = function(dp, rm, f) {
        var x = this.value;

        if (!x.isFinite()) {
            return x.toString();
        }

        var i,
            isNeg = x.isNeg(),
            groupSeparator = f.groupSeparator,
            g1 = +f.groupSize,
            g2 = +f.secondaryGroupSize,
            arr = x.toFixed(dp, rm).split('.'),
            intPart = arr[0],
            fractionPart = arr[1],
            intDigits = isNeg ? intPart.slice(1) : intPart,
            len = intDigits.length;

        if (g2) {
            len -= (i = g1, g1 = g2, g2 = i);
        }

        if (g1 > 0 && len > 0) {
            i = len % g1 || g1;
            intPart = intDigits.substr(0, i);

            for (; i < len; i += g1) {
                intPart += groupSeparator + intDigits.substr(i, g1);
            }

            if (g2 > 0) {
                intPart += groupSeparator + intDigits.slice(i);
            }

            if (isNeg) {
                intPart = '-' + intPart;
            }
        }

        return fractionPart
            ? intPart + f.decimalSeparator + ((g2 = +f.fractionGroupSize)
                ? fractionPart.replace(new RegExp('\\d{' + g2 + '}\\B', 'g'),
                    '$&' + f.fractionGroupSeparator)
                : fractionPart)
            : intPart;
    };

    System.Decimal.prototype.toFormat = function (dp, rm, provider) {
        var config = {
                decimalSeparator : '.',
                groupSeparator : ',',
                groupSize : 3,
                secondaryGroupSize : 0,
                fractionGroupSeparator : '\xA0',
                fractionGroupSize : 0
            },
            d;

        if (provider && !provider.getFormat) {
            config = Bridge.merge(config, provider);
            d = this._toFormat(dp, rm, config);
        } else {
            provider = provider || System.Globalization.CultureInfo.getCurrentCulture();

            var nfInfo = provider && provider.getFormat(System.Globalization.NumberFormatInfo);

            if (nfInfo) {
                config.decimalSeparator = nfInfo.numberDecimalSeparator;
                config.groupSeparator = nfInfo.numberGroupSeparator;
                config.groupSize = nfInfo.numberGroupSizes[0];
            }

            d = this._toFormat(dp, rm, config);
        }

        return d;
    };

    Bridge.$Decimal.config({ precision: 29 });

    System.Decimal.Zero = System.Decimal(0);
    System.Decimal.One = System.Decimal(1);
    System.Decimal.MinusOne = System.Decimal(-1);
    System.Decimal.MinValue = System.Decimal("-79228162514264337593543950335");
    System.Decimal.MaxValue = System.Decimal("79228162514264337593543950335");
    System.Decimal.precision = 29;

    // @source Date.js

    Bridge.define("System.DayOfWeek", {
        $kind: "enum",
        $statics: {
            Sunday: 0,
            Monday: 1,
            Tuesday: 2,
            Wednesday: 3,
            Thursday: 4,
            Friday: 5,
            Saturday: 6
        }
    });

    var date = {
        getDefaultValue: function () {
            return new Date(-864e13);
        },

        utcNow: function () {
            var d = new Date();

            return new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), d.getUTCHours(), d.getUTCMinutes(), d.getUTCSeconds(), d.getUTCMilliseconds());
        },

        today: function () {
            var d = new Date();

            return new Date(d.getFullYear(), d.getMonth(), d.getDate());
        },

        timeOfDay: function (dt) {
            return new System.TimeSpan((dt - new Date(dt.getFullYear(), dt.getMonth(), dt.getDate())) * 10000);
        },

        isUseGenitiveForm: function (format, index, tokenLen, patternToMatch) {
            var i,
                repeat = 0;

            for (i = index - 1; i >= 0 && format[i] !== patternToMatch; i--) {}

            if (i >= 0) {
                while (--i >= 0 && format[i] === patternToMatch) {
                    repeat++;
                }

                if (repeat <= 1) {
                    return true;
                }
            }

            for (i = index + tokenLen; i < format.length && format[i] !== patternToMatch; i++) {}

            if (i < format.length) {
                repeat = 0;

                while (++i < format.length && format[i] === patternToMatch) {
                    repeat++;
                }

                if (repeat <= 1) {
                    return true;
                }
            }

            return false;
        },

        format: function (date, format, provider) {
            var me = this,
                df = (provider || System.Globalization.CultureInfo.getCurrentCulture()).getFormat(System.Globalization.DateTimeFormatInfo),
                year = date.getFullYear(),
                month = date.getMonth(),
                dayOfMonth = date.getDate(),
                dayOfWeek = date.getDay(),
                hour = date.getHours(),
                minute = date.getMinutes(),
                second = date.getSeconds(),
                millisecond = date.getMilliseconds(),
                timezoneOffset = date.getTimezoneOffset(),
                formats;

            format = format || "G";

            if (format.length === 1) {
                formats = df.getAllDateTimePatterns(format, true);
                format = formats ? formats[0] : format;
            } else if (format.length === 2 && format.charAt(0) === "%") {
                format = format.charAt(1);
            }

            return format.replace(/(\\.|'[^']*'|"[^"]*"|d{1,4}|M{1,4}|yyyy|yy|y|HH?|hh?|mm?|ss?|tt?|f{1,3}|z{1,3}|\:|\/)/g,
                function (match, group, index) {
                    var part = match;

                    switch (match) {
                        case "dddd":
                            part = df.dayNames[dayOfWeek];

                            break;
                        case "ddd":
                            part = df.abbreviatedDayNames[dayOfWeek];

                            break;
                        case "dd":
                            part = dayOfMonth < 10 ? "0" + dayOfMonth : dayOfMonth;

                            break;
                        case "d":
                            part = dayOfMonth;

                            break;
                        case "MMMM":
                            if (me.isUseGenitiveForm(format, index, 4, "d")) {
                                part = df.monthGenitiveNames[month];
                            } else {
                                part = df.monthNames[month];
                            }

                            break;
                        case "MMM":
                            if (me.isUseGenitiveForm(format, index, 3, "d")) {
                                part = df.abbreviatedMonthGenitiveNames[month];
                            } else {
                                part = df.abbreviatedMonthNames[month];
                            }

                            break;
                        case "MM":
                            part = (month + 1) < 10 ? "0" + (month + 1) : (month + 1);

                            break;
                        case "M":
                            part = month + 1;

                            break;
                        case "yyyy":
                            part = year;

                            break;
                        case "yy":
                            part = (year % 100).toString();

                            if (part.length === 1) {
                                part = "0" + part;
                            }

                            break;
                        case "y":
                            part = year % 100;

                            break;
                        case "h":
                        case "hh":
                            part = hour % 12;

                            if (!part) {
                                part = "12";
                            } else if (match === "hh" && part.length === 1) {
                                part = "0" + part;
                            }

                            break;
                        case "HH":
                            part = hour.toString();

                            if (part.length === 1) {
                                part = "0" + part;
                            }

                            break;
                        case "H":
                            part = hour;
                            break;
                        case "mm":
                            part = minute.toString();

                            if (part.length === 1) {
                                part = "0" + part;
                            }

                            break;
                        case "m":
                            part = minute;

                            break;
                        case "ss":
                            part = second.toString();

                            if (part.length === 1) {
                                part = "0" + part;
                            }

                            break;
                        case "s":
                            part = second;
                            break;
                        case "t":
                        case "tt":
                            part = (hour < 12) ? df.amDesignator : df.pmDesignator;

                            if (match === "t") {
                                part = part.charAt(0);
                            }

                            break;
                        case "f":
                        case "ff":
                        case "fff":
                            part = millisecond.toString();

                            if (part.length < 3) {
                                part = Array(3 - part.length).join("0") + part;
                            }

                            if (match === "ff") {
                                part = part.substr(0, 2);
                            } else if (match === "f") {
                                part = part.charAt(0);
                            }

                            break;
                        case "z":
                            part = timezoneOffset / 60;
                            part = ((part >= 0) ? "-" : "+") + Math.floor(Math.abs(part));

                            break;
                        case "zz":
                        case "zzz":
                            part = timezoneOffset / 60;
                            part = ((part >= 0) ? "-" : "+") + System.String.alignString(Math.floor(Math.abs(part)).toString(), 2, "0", 2);

                            if (match === "zzz") {
                                part += df.timeSeparator + System.String.alignString(Math.floor(Math.abs(timezoneOffset % 60)).toString(), 2, "0", 2);
                            }

                            break;
                        case ":":
                            part = df.timeSeparator;

                            break;
                        case "/":
                            part = df.dateSeparator;

                            break;
                        default:
                            part = match.substr(1, match.length - 1 - (match.charAt(0) !== "\\"));

                            break;
                    }

                    return part;
                });
        },

        parse: function (value, provider, utc, silent) {
            var dt = this.parseExact(value, null, provider, utc, true);

            if (dt !== null) {
                return dt;
            }

            dt = Date.parse(value);

            if (!isNaN(dt)) {
                return new Date(dt);
            } else if (!silent) {
                throw new System.FormatException("String does not contain a valid string representation of a date and time.");
            }
        },

        parseExact: function (str, format, provider, utc, silent) {
            if (!format) {
                format = ["G", "g", "F", "f", "D", "d", "R", "r", "s", "S", "U", "u", "O", "o", "Y", "y", "M", "m", "T", "t"];
            }

            if (Bridge.isArray(format)) {
                var j = 0,
                    d;

                for (j; j < format.length; j++) {
                    d = Bridge.Date.parseExact(str, format[j], provider, utc, true);

                    if (d != null) {
                        return d;
                    }
                }

                if (silent) {
                    return null;
                }

                throw new System.FormatException("String does not contain a valid string representation of a date and time.");
            }

            var df = (provider || System.Globalization.CultureInfo.getCurrentCulture()).getFormat(System.Globalization.DateTimeFormatInfo),
                am = df.amDesignator,
                pm = df.pmDesignator,
                idx = 0,
                index = 0,
                i = 0,
                c,
                token,
                year = 0,
                month = 1,
                date = 1,
                hh = 0,
                mm = 0,
                ss = 0,
                ff = 0,
                tt = "",
                zzh = 0,
                zzm = 0,
                zzi,
                sign,
                neg,
                names,
                name,
                invalid = false,
                inQuotes = false,
                tokenMatched,
                formats;

            if (str == null) {
                throw new System.ArgumentNullException("str");
            }

            format = format || "G";

            if (format.length === 1) {
                formats = df.getAllDateTimePatterns(format, true);
                format = formats ? formats[0] : format;
            } else if (format.length === 2 && format.charAt(0) === "%") {
                format = format.charAt(1);
            }

            while (index < format.length) {
                c = format.charAt(index);
                token = "";

                if (inQuotes === "\\") {
                    token += c;
                    index++;
                } else {
                    while ((format.charAt(index) === c) && (index < format.length)) {
                        token += c;
                        index++;
                    }
                }

                tokenMatched = true;

                if (!inQuotes) {
                    if (token === "yyyy" || token === "yy" || token === "y") {
                        if (token === "yyyy") {
                            year = this.subparseInt(str, idx, 4, 4);
                        } else if (token === "yy") {
                            year = this.subparseInt(str, idx, 2, 2);
                        } else if (token === "y") {
                            year = this.subparseInt(str, idx, 2, 4);
                        }

                        if (year == null) {
                            invalid = true;
                            break;
                        }

                        idx += year.length;

                        if (year.length === 2) {
                            year = ~~year;
                            year = (year > 30 ? 1900 : 2000) + year;
                        }
                    } else if (token === "MMM" || token === "MMMM") {
                        month = 0;

                        if (token === "MMM") {
                            if (this.isUseGenitiveForm(format, index, 3, "d")) {
                                names = df.abbreviatedMonthGenitiveNames;
                            } else {
                                names = df.abbreviatedMonthNames;
                            }
                        } else {
                            if (this.isUseGenitiveForm(format, index, 4, "d")) {
                                names = df.monthGenitiveNames;
                            } else {
                                names = df.monthNames;
                            }
                        }

                        for (i = 0; i < names.length; i++) {
                            name = names[i];

                            if (str.substring(idx, idx + name.length).toLowerCase() === name.toLowerCase()) {
                                month = (i % 12) + 1;
                                idx += name.length;

                                break;
                            }
                        }

                        if ((month < 1) || (month > 12)) {
                            invalid = true;

                            break;
                        }
                    } else if (token === "MM" || token === "M") {
                        month = this.subparseInt(str, idx, token.length, 2);

                        if (month == null || month < 1 || month > 12) {
                            invalid = true;

                            break;
                        }

                        idx += month.length;
                    } else if (token === "dddd" || token === "ddd") {
                        names = token === "ddd" ? df.abbreviatedDayNames : df.dayNames;

                        for (i = 0; i < names.length; i++) {
                            name = names[i];

                            if (str.substring(idx, idx + name.length).toLowerCase() === name.toLowerCase()) {
                                idx += name.length;

                                break;
                            }
                        }
                    } else if (token === "dd" || token === "d") {
                        date = this.subparseInt(str, idx, token.length, 2);

                        if (date == null || date < 1 || date > 31) {
                            invalid = true;

                            break;
                        }

                        idx += date.length;
                    } else if (token === "hh" || token === "h") {
                        hh = this.subparseInt(str, idx, token.length, 2);

                        if (hh == null || hh < 1 || hh > 12) {
                            invalid = true;

                            break;
                        }

                        idx += hh.length;
                    } else if (token === "HH" || token === "H") {
                        hh = this.subparseInt(str, idx, token.length, 2);

                        if (hh == null || hh < 0 || hh > 23) {
                            invalid = true;

                            break;
                        }

                        idx += hh.length;
                    } else if (token === "mm" || token === "m") {
                        mm = this.subparseInt(str, idx, token.length, 2);

                        if (mm == null || mm < 0 || mm > 59) {
                            return null;
                        }

                        idx += mm.length;
                    } else if (token === "ss" || token === "s") {
                        ss = this.subparseInt(str, idx, token.length, 2);

                        if (ss == null || ss < 0 || ss > 59) {
                            invalid = true;

                            break;
                        }

                        idx += ss.length;
                    } else if (token === "u") {
                        ff = this.subparseInt(str, idx, 1, 7);

                        if (ff == null) {
                            invalid = true;

                            break;
                        }

                        idx += ff.length;

                        if (ff.length > 3) {
                            ff = ff.substring(0, 3);
                        }
                    } else if (token === "fffffff" || token === "ffffff" || token === "fffff" || token === "ffff" || token === "fff" || token === "ff" || token === "f") {
                        ff = this.subparseInt(str, idx, token.length, 7);

                        if (ff == null) {
                            invalid = true;

                            break;
                        }

                        idx += ff.length;

                        if (ff.length > 3) {
                            ff = ff.substring(0, 3);
                        }
                    } else if (token === "t") {
                        if (str.substring(idx, idx + 1).toLowerCase() === am.charAt(0).toLowerCase()) {
                            tt = am;
                        } else if (str.substring(idx, idx + 1).toLowerCase() === pm.charAt(0).toLowerCase()) {
                            tt = pm;
                        } else {
                            invalid = true;

                            break;
                        }

                        idx += 1;
                    } else if (token === "tt") {
                        if (str.substring(idx, idx + 2).toLowerCase() === am.toLowerCase()) {
                            tt = am;
                        } else if (str.substring(idx, idx + 2).toLowerCase() === pm.toLowerCase()) {
                            tt = pm;
                        } else {
                            invalid = true;

                            break;
                        }

                        idx += 2;
                    } else if (token === "z" || token === "zz") {
                        sign = str.charAt(idx);

                        if (sign === "-") {
                            neg = true;
                        } else if (sign === "+") {
                            neg = false;
                        } else {
                            invalid = true;

                            break;
                        }

                        idx++;

                        zzh = this.subparseInt(str, idx, 1, 2);

                        if (zzh == null || zzh > 14) {
                            invalid = true;

                            break;
                        }

                        idx += zzh.length;

                        if (neg) {
                            zzh = -zzh;
                        }
                    } else if (token === "zzz") {
                        name = str.substring(idx, idx + 6);
                        idx += 6;

                        if (name.length !== 6) {
                            invalid = true;

                            break;
                        }

                        sign = name.charAt(0);

                        if (sign === "-") {
                            neg = true;
                        } else if (sign === "+") {
                            neg = false;
                        } else {
                            invalid = true;

                            break;
                        }

                        zzi = 1;
                        zzh = this.subparseInt(name, zzi, 1, 2);

                        if (zzh == null || zzh > 14) {
                            invalid = true;

                            break;
                        }

                        zzi += zzh.length;

                        if (neg) {
                            zzh = -zzh;
                        }

                        if (name.charAt(zzi) !== df.timeSeparator) {
                            invalid = true;

                            break;
                        }

                        zzi++;

                        zzm = this.subparseInt(name, zzi, 1, 2);

                        if (zzm == null || zzh > 59) {
                            invalid = true;

                            break;
                        }
                    } else {
                        tokenMatched = false;
                    }
                }

                if (inQuotes || !tokenMatched) {
                    name = str.substring(idx, idx + token.length);

                    if ((!inQuotes && ((token === ":" && name !== df.timeSeparator) ||
                        (token === "/" && name !== df.dateSeparator))) ||
                        (name !== token && token !== "'" && token !== '"' && token !== "\\")) {
                        invalid = true;

                        break;
                    }

                    if (inQuotes === "\\") {
                        inQuotes = false;
                    }

                    if (token !== "'" && token !== '"' && token !== "\\") {
                        idx += token.length;
                    } else {
                        if (inQuotes === false) {
                            inQuotes = token;
                        } else {
                            if (inQuotes !== token) {
                                invalid = true;
                                break;
                            }

                            inQuotes = false;
                        }
                    }
                }
            }

            if (inQuotes) {
                invalid = true;
            }

            if (!invalid) {
                if (idx !== str.length) {
                    invalid = true;
                } else if (month === 2) {
                    if (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0)) {
                        if (date > 29) {
                            invalid = true;
                        }
                    } else if (date > 28) {
                        invalid = true;
                    }
                } else if ((month === 4) || (month === 6) || (month === 9) || (month === 11)) {
                    if (date > 30) {
                        invalid = true;
                    }
                }
            }

            if (invalid) {
                if (silent) {
                    return null;
                }

                throw new System.FormatException("String does not contain a valid string representation of a date and time.");
            }

            if (hh < 12 && tt === pm) {
                hh = hh - 0 + 12;
            } else if (hh > 11 && tt === am) {
                hh -= 12;
            }

            if (zzh === 0 && zzm === 0 && !utc) {
                return new Date(year, month - 1, date, hh, mm, ss, ff);
            }

            return new Date(Date.UTC(year, month - 1, date, hh - zzh, mm - zzm, ss, ff));
        },

        subparseInt: function (str, index, min, max) {
            var x,
                token;

            for (x = max; x >= min; x--) {
                token = str.substring(index, index + x);

                if (token.length < min) {
                    return null;
                }

                if (/^\d+$/.test(token)) {
                    return token;
                }
            }

            return null;
        },

        tryParse: function (value, provider, result, utc) {
            result.v = this.parse(value, provider, utc, true);

            if (result.v == null) {
                result.v = new Date(-864e13);

                return false;
            }

            return true;
        },

        tryParseExact: function (value, format, provider, result, utc) {
            result.v = this.parseExact(value, format, provider, utc, true);

            if (result.v == null) {
                result.v = new Date(-864e13);

                return false;
            }

            return true;
        },

        isDaylightSavingTime: function (dt) {
            var temp = Bridge.Date.today();

            temp.setMonth(0);
            temp.setDate(1);

            return temp.getTimezoneOffset() !== dt.getTimezoneOffset();
        },

        toUTC: function (date) {
            return new Date(date.getUTCFullYear(),
                date.getUTCMonth(),
                date.getUTCDate(),
                date.getUTCHours(),
                date.getUTCMinutes(),
                date.getUTCSeconds(),
                date.getUTCMilliseconds());
        },

        toLocal: function (date) {
            return new Date(Date.UTC(date.getFullYear(),
                date.getMonth(),
                date.getDate(),
                date.getHours(),
                date.getMinutes(),
                date.getSeconds(),
                date.getMilliseconds()));
        },

        dateAddSubTimespan: function (d, t, direction) {
            var result = new Date(d.getTime());

            result.setDate(result.getDate() + (direction * t.getDays()));
            result.setHours(result.getHours() + (direction * t.getHours()));
            result.setMinutes(result.getMinutes() + (direction * t.getMinutes()));
            result.setSeconds(result.getSeconds() + (direction * t.getSeconds()));
            result.setMilliseconds(result.getMilliseconds() + (direction * t.getMilliseconds()));

            return result;
        },

        subdt: function (d, t) {
            return Bridge.hasValue$1(d, t) ? this.dateAddSubTimespan(d, t, -1) : null;
        },

        adddt: function (d, t) {
            return Bridge.hasValue$1(d, t) ? this.dateAddSubTimespan(d, t, 1) : null;
        },

        subdd: function (a, b) {
            return Bridge.hasValue$1(a, b) ? (new System.TimeSpan((a - b) * 10000)) : null;
        },

        gt: function (a, b) {
            return Bridge.hasValue$1(a, b) ? (a > b) : false;
        },

        gte: function (a, b) {
            return Bridge.hasValue$1(a, b) ? (a >= b) : false;
        },

        lt: function (a, b) {
            return Bridge.hasValue$1(a, b) ? (a < b) : false;
        },

        lte: function (a, b) {
            return Bridge.hasValue$1(a, b) ? (a <= b) : false;
        }
    };

    Bridge.Date = date;

    // @source TimeSpan.js

    Bridge.define("System.TimeSpan", {
        inherits: [System.IComparable],

        config: {
            alias: [
                "compareTo", "System$IComparable$compareTo"
            ]
        },

        $kind: "struct",
        statics: {
            fromDays: function (value) {
                return new System.TimeSpan(value * 864e9);
            },

            fromHours: function (value) {
                return new System.TimeSpan(value * 36e9);
            },

            fromMilliseconds: function (value) {
                return new System.TimeSpan(value * 1e4);
            },

            fromMinutes: function (value) {
                return new System.TimeSpan(value * 6e8);
            },

            fromSeconds: function (value) {
                return new System.TimeSpan(value * 1e7);
            },

            fromTicks: function (value) {
                return new System.TimeSpan(value);
            },

            ctor: function () {
                this.zero = new System.TimeSpan(System.Int64.Zero);
                this.maxValue = new System.TimeSpan(System.Int64.MaxValue);
                this.minValue = new System.TimeSpan(System.Int64.MinValue);
            },

            getDefaultValue: function () {
                return new System.TimeSpan(System.Int64.Zero);
            },

            neg: function (t) {
                return Bridge.hasValue(t) ? (new System.TimeSpan(t.ticks.neg())) : null;
            },

            sub: function (t1, t2) {
                return Bridge.hasValue$1(t1, t2) ? (new System.TimeSpan(t1.ticks.sub(t2.ticks))) : null;
            },

            eq: function (t1, t2) {
                return Bridge.hasValue$1(t1, t2) ? (t1.ticks.eq(t2.ticks)) : null;
            },

            neq: function (t1, t2) {
                return Bridge.hasValue$1(t1, t2) ? (t1.ticks.ne(t2.ticks)) : null;
            },

            plus: function (t) {
                return Bridge.hasValue(t) ? (new System.TimeSpan(t.ticks)) : null;
            },

            add: function (t1, t2) {
                return Bridge.hasValue$1(t1, t2) ? (new System.TimeSpan(t1.ticks.add(t2.ticks))) : null;
            },

            gt: function (a, b) {
                return Bridge.hasValue$1(a, b) ? (a.ticks.gt(b.ticks)) : false;
            },

            gte: function (a, b) {
                return Bridge.hasValue$1(a, b) ? (a.ticks.gte(b.ticks)) : false;
            },

            lt: function (a, b) {
                return Bridge.hasValue$1(a, b) ? (a.ticks.lt(b.ticks)) : false;
            },

            lte: function (a, b) {
                return Bridge.hasValue$1(a, b) ? (a.ticks.lte(b.ticks)) : false;
            }
        },

        ctor: function () {
            this.$initialize();
            this.ticks = System.Int64.Zero;

            if (arguments.length === 1) {
                this.ticks = arguments[0] instanceof System.Int64 ? arguments[0] : new System.Int64(arguments[0]);
            } else if (arguments.length === 3) {
                this.ticks = new System.Int64(arguments[0]).mul(60).add(arguments[1]).mul(60).add(arguments[2]).mul(1e7);
            } else if (arguments.length === 4) {
                this.ticks = new System.Int64(arguments[0]).mul(24).add(arguments[1]).mul(60).add(arguments[2]).mul(60).add(arguments[3]).mul(1e7);
            } else if (arguments.length === 5) {
                this.ticks = new System.Int64(arguments[0]).mul(24).add(arguments[1]).mul(60).add(arguments[2]).mul(60).add(arguments[3]).mul(1e3).add(arguments[4]).mul(1e4);
            }
        },

        getTicks: function () {
            return this.ticks;
        },

        getDays: function () {
            return this.ticks.div(864e9).toNumber();
        },

        getHours: function () {
            return this.ticks.div(36e9).mod(24).toNumber();
        },

        getMilliseconds: function () {
            return this.ticks.div(1e4).mod(1e3).toNumber();
        },

        getMinutes: function () {
            return this.ticks.div(6e8).mod(60).toNumber();
        },

        getSeconds: function () {
            return this.ticks.div(1e7).mod(60).toNumber();
        },

        getTotalDays: function () {
            return this.ticks.toNumberDivided(864e9);
        },

        getTotalHours: function () {
            return this.ticks.toNumberDivided(36e9);
        },

        getTotalMilliseconds: function () {
            return this.ticks.toNumberDivided(1e4);
        },

        getTotalMinutes: function () {
            return this.ticks.toNumberDivided(6e8);
        },

        getTotalSeconds: function () {
            return this.ticks.toNumberDivided(1e7);
        },

        get12HourHour: function () {
            return (this.getHours() > 12) ? this.getHours() - 12 : (this.getHours() === 0) ? 12 : this.getHours();
        },

        add: function (ts) {
            return new System.TimeSpan(this.ticks.add(ts.ticks));
        },

        subtract: function (ts) {
            return new System.TimeSpan(this.ticks.sub(ts.ticks));
        },

        duration: function () {
            return new System.TimeSpan(this.ticks.abs());
        },

        negate: function () {
            return new System.TimeSpan(this.ticks.neg());
        },

        compareTo: function (other) {
            return this.ticks.compareTo(other.ticks);
        },

        equals: function (other) {
            return other.ticks.eq(this.ticks);
        },

        equalsT: function (other) {
            return other.ticks.eq(this.ticks);
        },

        format: function (formatStr, provider) {
            return this.toString(formatStr, provider);
        },

        getHashCode: function () {
            return this.ticks.getHashCode();
        },

        toString: function (formatStr, provider) {
            var ticks = this.ticks,
                result = "",
                me = this,
                dtInfo = (provider || System.Globalization.CultureInfo.getCurrentCulture()).getFormat(System.Globalization.DateTimeFormatInfo),
                format = function (t, n, dir, cut) {
                    return System.String.alignString((t | 0).toString(), n || 2, "0", dir || 2, cut || false);
                };

            if (formatStr) {
                return formatStr.replace(/(\\.|'[^']*'|"[^"]*"|dd?|HH?|hh?|mm?|ss?|tt?|f{1,7}|\:|\/)/g,
                    function (match, group, index) {
                        var part = match;

                        switch (match) {
                            case "d":
                                return me.getDays();
                            case "dd":
                                return format(me.getDays());
                            case "H":
                                return me.getHours();
                            case "HH":
                                return format(me.getHours());
                            case "h":
                                return me.get12HourHour();
                            case "hh":
                                return format(me.get12HourHour());
                            case "m":
                                return me.getMinutes();
                            case "mm":
                                return format(me.getMinutes());
                            case "s":
                                return me.getSeconds();
                            case "ss":
                                return format(me.getSeconds());
                            case "t":
                                return ((me.getHours() < 12) ? dtInfo.amDesignator : dtInfo.pmDesignator).substring(0, 1);
                            case "tt":
                                return (me.getHours() < 12) ? dtInfo.amDesignator : dtInfo.pmDesignator;
                            case "f":
                            case "ff":
                            case "fff":
                            case "ffff":
                            case "fffff":
                            case "ffffff":
                            case "fffffff":
                                return format(me.getMilliseconds(), match.length, 1, true);
                            default:
                                return match.substr(1, match.length - 1 - (match.charAt(0) !== "\\"));
                        }
                    }
                );
            }

            if (ticks.abs().gte(864e9)) {
                result += format(ticks.toNumberDivided(864e9)) + ".";
                ticks = ticks.mod(864e9);
            }

            result += format(ticks.toNumberDivided(36e9)) + ":";
            ticks = ticks.mod(36e9);
            result += format(ticks.toNumberDivided(6e8) | 0) + ":";
            ticks = ticks.mod(6e8);
            result += format(ticks.toNumberDivided(1e7));
            ticks = ticks.mod(1e7);

            if (ticks.gt(0)) {
                result += "." + format(ticks.toNumber(), 7);
            }

            return result;
        }
    });

    Bridge.Class.addExtend(System.TimeSpan, [System.IComparable$1(System.TimeSpan), System.IEquatable$1(System.TimeSpan)]);

    // @source StringBuilder.js

    Bridge.define("System.Text.StringBuilder", {
        ctor: function () {
            this.$initialize();
            this.buffer = [],
            this.capacity = 16;

            if (arguments.length === 1) {
                this.append(arguments[0]);
            } else if (arguments.length === 2) {
                this.append(arguments[0]);
                this.setCapacity(arguments[1]);
            } else if (arguments.length === 3) {
                this.append(arguments[0], arguments[1], arguments[2]);
            }
        },

        getLength: function () {
            if (this.buffer.length < 2) {
                return this.buffer[0] ? this.buffer[0].length : 0;
            }

            var s = this.buffer.join("");

            this.buffer = [];
            this.buffer[0] = s;

            return s.length;
        },

        getCapacity: function () {
            var length = this.getLength();

            return (this.capacity > length) ? this.capacity : length;
        },

        setCapacity: function (value) {
            var length = this.getLength();

            if (value > length) {
                this.capacity = value;
            }
        },

        toString: function () {
            var s = this.buffer.join("");

            this.buffer = [];
            this.buffer[0] = s;

            if (arguments.length === 2) {
                var startIndex = arguments[0],
                    length = arguments[1];

                this.checkLimits(s, startIndex, length);

                return s.substr(startIndex, length);
            }

            return s;
        },

        append: function (value) {
            if (value == null) {
                return this;
            }

            if (arguments.length === 2) {
                // append a char repeated count times
                var count = arguments[1];

                if (count === 0) {
                    return this;
                } else if (count < 0) {
                    throw new System.ArgumentOutOfRangeException("count", "cannot be less than zero");
                }

                value = Array(count + 1).join(value).toString();
            } else if (arguments.length === 3) {
                // append a (startIndex, count) substring of value
                var startIndex = arguments[1],
                    count = arguments[2];

                if (count === 0) {
                    return this;
                }

                this.checkLimits(value, startIndex, count);
                value = value.substr(startIndex, count);
            }

            this.buffer[this.buffer.length] = value;

            return this;
        },

        appendFormat: function (format) {
            return this.append(System.String.format.apply(System.String, arguments));
        },

        clear: function () {
            this.buffer = [];

            return this;
        },

        appendLine: function () {
            if (arguments.length === 1) {
                this.append(arguments[0]);
            }

            return this.append("\r\n");
        },

        equals: function (sb) {
            if (sb == null) {
                return false;
            }

            if (sb === this) {
                return true;
            }

            return this.toString() === sb.toString();
        },

        remove: function (startIndex, length) {
            var s = this.buffer.join("");

            this.checkLimits(s, startIndex, length);

            if (s.length === length && startIndex === 0) {
                // Optimization.  If we are deleting everything
                return this.clear();
            }

            if (length > 0) {
                this.buffer = [];
                this.buffer[0] = s.substring(0, startIndex);
                this.buffer[1] = s.substring(startIndex + length, s.length);
            }

            return this;
        },

        insert: function (index, value) {
            if (value == null) {
                return this;
            }

            if (arguments.length === 3) {
                // insert value repeated count times
                var count = arguments[2];

                if (count === 0) {
                    return this;
                } else if (count < 0) {
                    throw new System.ArgumentOutOfRangeException("count", "cannot be less than zero");
                }

                value = Array(count + 1).join(value).toString();
            }

            var s = this.buffer.join("");
            this.buffer = [];

            if (index < 1) {
                this.buffer[0] = value;
                this.buffer[1] = s;
            } else if (index >= s.length) {
                this.buffer[0] = s;
                this.buffer[1] = value;
            } else {
                this.buffer[0] = s.substring(0, index);
                this.buffer[1] = value;
                this.buffer[2] = s.substring(index, s.length);
            }

            return this;
        },

        replace: function (oldValue, newValue) {
            var r = new RegExp(oldValue, "g"),
                s = this.buffer.join("");

            this.buffer = [];

            if (arguments.length === 4) {
                var startIndex = arguments[2],
                    count = arguments[3],
                    b = s.substr(startIndex, count);

                this.checkLimits(s, startIndex, count);

                this.buffer[0] = s.substring(0, startIndex);
                this.buffer[1] = b.replace(r, newValue);
                this.buffer[2] = s.substring(startIndex + count, s.length);
            } else {
                this.buffer[0] = s.replace(r, newValue);
            }

            return this;
        },

        checkLimits: function (value, startIndex, length) {
            if (length < 0) {
                throw new System.ArgumentOutOfRangeException("length", "must be non-negative");
            }

            if (startIndex < 0) {
                throw new System.ArgumentOutOfRangeException("startIndex", "startIndex cannot be less than zero");
            }

            if (length > value.length - startIndex) {
                throw new System.ArgumentOutOfRangeException("Index and length must refer to a location within the string");
            }
        }
    });

    // @source BridgeRegex.js

    (function () {
        var specials = [
                // order matters for these
                  "-"
                , "["
                , "]"
                // order doesn't matter for any of these
                , "/"
                , "{"
                , "}"
                , "("
                , ")"
                , "*"
                , "+"
                , "?"
                , "."
                , "\\"
                , "^"
                , "$"
                , "|"
        ],

        regex = RegExp("[" + specials.join("\\") + "]", "g"),

        regexpEscape = function (s) {
            return s.replace(regex, "\\$&");
        };

        Bridge.regexpEscape = regexpEscape;
    })();

    // @source Diagnostics.js

    System.Diagnostics.Debug = {
        writeln: function (text) {
            Bridge.Console.debug(text);
        },

        _fail: function (message) {
            System.Diagnostics.Debug.writeln(message);
            debugger;
        },

        assert: function (condition, message) {
            if (!condition) {
                message = 'Assert failed: ' + message;

                if (confirm(message + '\r\n\r\nBreak into debugger?')) {
                    System.Diagnostics.Debug._fail(message);
                }
            }
        },

        fail: function (message) {
            System.Diagnostics.Debug._fail(message);
        }
    }

    Bridge.define("System.Diagnostics.Stopwatch", {
        ctor: function () {
            this.$initialize();
            this._stopTime = System.Int64.Zero;
            this._startTime = System.Int64.Zero;
            this.isRunning = false;
        },

        reset: function () {
            this._stopTime = this._startTime = System.Diagnostics.Stopwatch.getTimestamp();
            this.isRunning = false;
        },

        ticks: function () {
            return (this.isRunning ? System.Diagnostics.Stopwatch.getTimestamp() : this._stopTime).sub(this._startTime);
        },

        milliseconds: function () {
            return this.ticks().mul(1000).div(System.Diagnostics.Stopwatch.frequency);
        },

        timeSpan: function () {
            return new System.TimeSpan(this.milliseconds().mul(10000));
        },

        start: function () {
            if (this.isRunning) {
                return;
            }

            this._startTime = System.Diagnostics.Stopwatch.getTimestamp();
            this.isRunning = true;
        },

        stop: function () {
            if (!this.isRunning) {
                return;
            }

            this._stopTime = System.Diagnostics.Stopwatch.getTimestamp();
            this.isRunning = false;
        },

        restart: function () {
            this.isRunning = false;
            this.start();
        },

        statics: {
            startNew: function () {
                var s = new System.Diagnostics.Stopwatch();

                s.start();

                return s;
            }
        }
    });

    if (typeof (window) !== 'undefined' && window.performance && window.performance.now) {
        System.Diagnostics.Stopwatch.frequency = new System.Int64(1e6);
        System.Diagnostics.Stopwatch.isHighResolution = true;
        System.Diagnostics.Stopwatch.getTimestamp = function () {
            return new System.Int64(Math.round(window.performance.now() * 1000));
        };
    } else if (typeof (process) !== 'undefined' && process.hrtime) {
        System.Diagnostics.Stopwatch.frequency = new System.Int64(1e9);
        System.Diagnostics.Stopwatch.isHighResolution = true;
        System.Diagnostics.Stopwatch.getTimestamp = function () {
            var hr = process.hrtime();
            return new System.Int64(hr[0]).mul(1e9).add(hr[1]);
        };
    } else {
        System.Diagnostics.Stopwatch.frequency = new System.Int64(1e3);
        System.Diagnostics.Stopwatch.isHighResolution = false;
        System.Diagnostics.Stopwatch.getTimestamp = function () {
            return new System.Int64(new Date().valueOf());
        };
    }

    System.Diagnostics.Contracts.Contract = {
        reportFailure: function (failureKind, userMessage, condition, innerException, TException) {
            var conditionText = condition.toString();

            conditionText = conditionText.substring(conditionText.indexOf("return") + 7);
            conditionText = conditionText.substr(0, conditionText.lastIndexOf(";"));

            var failureMessage = (conditionText) ? "Contract '" + conditionText + "' failed" : "Contract failed",
                displayMessage = (userMessage) ? failureMessage + ": " + userMessage : failureMessage;

            if (TException) {
                throw new TException(conditionText, userMessage);
            } else {
                throw new System.Diagnostics.Contracts.ContractException(failureKind, displayMessage, userMessage, conditionText, innerException);
            }
        },
        assert: function (failureKind, condition, message) {
            if (!condition()) {
                System.Diagnostics.Contracts.Contract.reportFailure(failureKind, message, condition, null);
            }
        },
        requires: function (TException, condition, message) {
            if (!condition()) {
                System.Diagnostics.Contracts.Contract.reportFailure(0, message, condition, null, TException);
            }
        },
        forAll: function (fromInclusive, toExclusive, predicate) {
            if (!predicate) {
                throw new System.ArgumentNullException("predicate");
            }

            for (; fromInclusive < toExclusive; fromInclusive++) {
                if (!predicate(fromInclusive)) {
                    return false;
                }
            }

            return true;
        },
        forAll$1: function (collection, predicate) {
            if (!collection) {
                throw new System.ArgumentNullException("collection");
            }

            if (!predicate) {
                throw new System.ArgumentNullException("predicate");
            }

            var enumerator = Bridge.getEnumerator(collection);

            try {
                while (enumerator.moveNext()) {
                    if (!predicate(enumerator.getCurrent())) {
                        return false;
                    }
                }
                return true;
            } finally {
                enumerator.dispose();
            }
        },
        exists: function (fromInclusive, toExclusive, predicate) {
            if (!predicate) {
                throw new System.ArgumentNullException("predicate");
            }

            for (; fromInclusive < toExclusive; fromInclusive++) {
                if (predicate(fromInclusive)) {
                    return true;
                }
            }

            return false;
        },
        exists$1: function (collection, predicate) {
            if (!collection) {
                throw new System.ArgumentNullException("collection");
            }

            if (!predicate) {
                throw new System.ArgumentNullException("predicate");
            }

            var enumerator = Bridge.getEnumerator(collection);

            try {
                while (enumerator.moveNext()) {
                    if (predicate(enumerator.getCurrent())) {
                        return true;
                    }
                }
                return false;
            } finally {
                enumerator.dispose();
            }
        }
    };

    Bridge.define("System.Diagnostics.Contracts.ContractFailureKind", {
        $kind: "enum",
        $statics: {
            precondition: 0,
            postcondition: 1,
            postconditionOnException: 2,
            invarian: 3,
            assert: 4,
            assume: 5
        }
    });

    Bridge.define("System.Diagnostics.Contracts.ContractException", {
        inherits: [System.Exception],

        ctor: function (failureKind, failureMessage, userMessage, condition, innerException) {
            this.$initialize();
            System.Exception.ctor.call(this, failureMessage, innerException);
            this._kind = failureKind;
            this._failureMessage = failureMessage || null;
            this._userMessage = userMessage || null;
            this._condition = condition || null;
        },

        getKind: function () {
            return this._kind;
        },
        getFailure: function () {
            return this._failureMessage;
        },
        getUserMessage: function () {
            return this._userMessage;
        },
        getCondition: function () {
            return this._condition;
        }
    });

    // @source Array.js

    var array = {
        toIndex: function (arr, indices) {
            if (indices.length !== (arr.$s ? arr.$s.length : 1)) {
                throw new System.ArgumentException("Invalid number of indices");
            }

            if (indices[0] < 0 || indices[0] >= (arr.$s ? arr.$s[0] : arr.length)) {
                throw new System.ArgumentException("Index 0 out of range");
            }

            var idx = indices[0],
                i;

            if (arr.$s) {
                for (i = 1; i < arr.$s.length; i++) {
                    if (indices[i] < 0 || indices[i] >= arr.$s[i]) {
                        throw new System.ArgumentException("Index " + i + " out of range");
                    }

                    idx = idx * arr.$s[i] + indices[i];
                }
            }

            return idx;
        },

        $get: function (indices) {
            var r = this[System.Array.toIndex(this, indices)];

            return typeof r !== "undefined" ? r : this.$v;
        },

        get: function (arr) {
            if (arguments.length < 2) {
                throw new System.ArgumentNullException("indices");
            }

            var idx = Array.prototype.slice.call(arguments, 1);

            for (var i = 0; i < idx.length; i++) {
                if (!Bridge.hasValue(idx[i])) {
                    throw new System.ArgumentNullException("indices");
                }
            }

            var r = arr[System.Array.toIndex(arr, idx)];

            return typeof r !== "undefined" ? r : arr.$v;
        },

        $set: function (indices, value) {
            this[System.Array.toIndex(this, Array.prototype.slice.call(indices, 0))] = value;
        },

        set: function (arr, value) {
            var indices = Array.prototype.slice.call(arguments, 2);

            arr[System.Array.toIndex(arr, indices)] = value;
        },

        getLength: function (arr, dimension) {
            if (dimension < 0 || dimension >= (arr.$s ? arr.$s.length : 1)) {
                throw new System.IndexOutOfRangeException();
            }

            return arr.$s ? arr.$s[dimension] : arr.length;
        },

        getRank: function (arr) {
            return arr.$s ? arr.$s.length : 1;
        },

        getLower: function (arr, d) {
            System.Array.getLength(arr, d);

            return 0;
        },

        create: function (defvalue, initValues, T, sizes) {
            if (sizes === null) {
                throw new System.ArgumentNullException("length");
            }

            var arr = [],
                length = arguments.length > 3 ? 1 : 0,
                i, s, v, j,
                idx,
                indices,
                flatIdx;

            arr.$v = defvalue;
            arr.$s = [];
            arr.get = System.Array.$get;
            arr.set = System.Array.$set;

            if (sizes && Bridge.isArray(sizes)) {
                for (i = 0; i < sizes.length; i++) {
                    j = sizes[i];
                    if (isNaN(j) || j < 0) {
                        throw new System.ArgumentOutOfRangeException("length");
                    }
                    length *= j;
                    arr.$s[i] = j;
                }
            } else {
                for (i = 3; i < arguments.length; i++) {
                    j = arguments[i];
                    if (isNaN(j) || j < 0) {
                        throw new System.ArgumentOutOfRangeException("length");
                    }
                    length *= j;
                    arr.$s[i - 3] = j;
                }
            }

            arr.length = length;

            if (initValues) {
                for (i = 0; i < arr.length; i++) {
                    indices = [];
                    flatIdx = i;

                    for (s = arr.$s.length - 1; s >= 0; s--) {
                        idx = flatIdx % arr.$s[s];
                        indices.unshift(idx);
                        flatIdx = Bridge.Int.div(flatIdx - idx, arr.$s[s]);
                    }

                    v = initValues;

                    for (idx = 0; idx < indices.length; idx++) {
                        v = v[indices[idx]];
                    }

                    arr[i] = v;
                }
            }

            System.Array.init(arr, T, arr.$s.length);

            return arr;
        },

        init: function (length, value, T, addFn) {
            if (length == null) {
                throw new System.ArgumentNullException("length");
            }

            if (Bridge.isArray(length)) {
                var elementType = value,
                    rank = T || 1;
                System.Array.type(elementType, rank, length);
                return length;
            }

            if (isNaN(length) || length < 0) {
                throw new System.ArgumentOutOfRangeException("length");
            }

            var arr = new Array(length),
                isFn = addFn !== true && Bridge.isFunction(value);

            for (var i = 0; i < length; i++) {
                arr[i] = isFn ? value() : value;
            }

            return System.Array.init(arr, T, 1);
        },

        toEnumerable: function (array) {
            return new Bridge.ArrayEnumerable(array);
        },

        toEnumerator: function (array, T) {
            return new Bridge.ArrayEnumerator(array, T);
        },

        _typedArrays: {
            Float32Array: true,
            Float64Array: true,
            Int8Array: true,
            Int16Array: true,
            Int32Array: true,
            Uint8Array: true,
            Uint8ClampedArray: true,
            Uint16Array: true,
            Uint32Array: true
        },

        is: function (obj, type) {
            if (obj instanceof Bridge.ArrayEnumerator) {
                if ((obj.constructor === type) || (obj instanceof type) ||
                    type === Bridge.ArrayEnumerator ||
                    type.$$name && System.String.startsWith(type.$$name, "System.Collections.IEnumerator") ||
                    type.$$name && System.String.startsWith(type.$$name, "System.Collections.Generic.IEnumerator")) {
                    return true;
                }

                return false;
            }

            if (!Bridge.isArray(obj)) {
                return false;
            }

            if (type.$elementType && type.$isArray) {
                var et = Bridge.getType(obj).$elementType;
                if (et) {
                    return System.Array.getRank(obj) === type.$rank && Bridge.Reflection.isAssignableFrom(type.$elementType, et);
                }
                type = Array;
            }

            if ((obj.constructor === type) || (obj instanceof type)) {
                return true;
            }

            if (type === System.Collections.IEnumerable ||
                type === System.Collections.ICollection ||
                type === System.ICloneable ||
                type === System.Collections.IList ||
                type.$$name && System.String.startsWith(type.$$name, "System.Collections.Generic.IEnumerable$1") ||
                type.$$name && System.String.startsWith(type.$$name, "System.Collections.Generic.ICollection$1") ||
                type.$$name && System.String.startsWith(type.$$name, "System.Collections.Generic.IList$1")) {
                return true;
            }

            return !!System.Array._typedArrays[String.prototype.slice.call(Object.prototype.toString.call(obj), 8, -1)];
        },

        clone: function (arr) {
            var newArr;
            if (arr.length === 1) {
                newArr = [arr[0]];
            } else {
                newArr = arr.slice(0);
            }
            newArr.$type = arr.$type;
            return newArr;
        },

        getCount: function (obj, T) {
            var name;
            if (Bridge.isArray(obj)) {
                return obj.length;
            } else if (T && Bridge.isFunction(obj[name = "System$Collections$Generic$ICollection$1$" + Bridge.getTypeAlias(T) + "$getCount"])) {
                return obj[name]();
            } else if (Bridge.isFunction(obj[name = "System$Collections$ICollection$getCount"])) {
                return obj[name]();
            } else if (Bridge.isFunction(obj.getCount)) {
                return obj.getCount();
            }

            return 0;
        },

        getIsReadOnly: function (obj, T) {
            var name;

            if (Bridge.isArray(obj)) {
                return T ? true : false;
            } else if (T && Bridge.isFunction(obj[name = "System$Collections$Generic$ICollection$1$" + Bridge.getTypeAlias(T) + "$getIsReadOnly"])) {
                return obj[name]();
            } else if (Bridge.isFunction(obj[name = "System$Collections$IList$getIsReadOnly"])) {
                return obj[name]();
            } else if (Bridge.isFunction(obj.getIsReadOnly)) {
                return obj.getIsReadOnly();
            }

            return 0;
        },

        add: function (obj, item, T) {
            var name;

            if (Bridge.isArray(obj)) {
                obj.push(item);
            } else if (T && Bridge.isFunction(obj[name = "System$Collections$Generic$ICollection$1$" + Bridge.getTypeAlias(T) + "$add"])) {
                obj[name](item);
            } else if (Bridge.isFunction(obj[name = "System$Collections$IList$add"])) {
                obj[name](item);
            } else if (Bridge.isFunction(obj.add)) {
                obj.add(item);
            }
        },

        clear: function (obj, T) {
            var name;

            if (Bridge.isArray(obj)) {
                System.Array.fill(obj, T ? (T.getDefaultValue || Bridge.getDefaultValue(T)) : null, 0, obj.length);
            } else if (T && Bridge.isFunction(obj[name = "System$Collections$Generic$ICollection$1$" + Bridge.getTypeAlias(T) + "$clear"])) {
                obj[name]();
            } else if (Bridge.isFunction(obj[name = "System$Collections$IList$clear"])) {
                obj[name]();
            } else if (Bridge.isFunction(obj.clear)) {
                obj.clear();
            }
        },

        fill: function (dst, val, index, count) {
            if (!Bridge.hasValue(dst)) {
                throw new System.ArgumentNullException("dst");
            }

            if (index < 0 || count < 0 || (index + count) > dst.length) {
                throw new System.IndexOutOfRangeException();
            }

            var isFn = Bridge.isFunction(val);

            while (--count >= 0) {
                dst[index + count] = isFn ? val() : val;
            }
        },

        copy: function (src, spos, dest, dpos, len) {
            if (!dest) {
                throw new System.ArgumentNullException("dest", "Value cannot be null");
            }

            if (!src) {
                throw new System.ArgumentNullException("src", "Value cannot be null");
            }

            if (spos < 0 || dpos < 0 || len < 0) {
                throw new System.ArgumentOutOfRangeException("Number was less than the array's lower bound in the first dimension");
            }

            if (len > (src.length - spos) || len > (dest.length - dpos)) {
                throw new System.ArgumentException("Destination array was not long enough. Check destIndex and length, and the array's lower bounds");
            }

            if (spos < dpos && src === dest) {
                while (--len >= 0) {
                    dest[dpos + len] = src[spos + len];
                }
            } else {
                for (var i = 0; i < len; i++) {
                    dest[dpos + i] = src[spos + i];
                }
            }
        },

        copyTo: function (obj, dest, index, T) {
            var name;

            if (Bridge.isArray(obj)) {
                System.Array.copy(obj, 0, dest, index, obj ? obj.length : 0);
            } else if (Bridge.isFunction(obj.copyTo)) {
                obj.copyTo(dest, index);
            } else if (T && Bridge.isFunction(obj[name = "System$Collections$Generic$ICollection$1$" + Bridge.getTypeAlias(T) + "$copyTo"])) {
                obj[name](dest, index);
            } else if (Bridge.isFunction(obj[name = "System$Collections$ICollection$copyTo"])) {
                obj[name](dest, index);
            } else {
                throw new System.NotImplementedException("copyTo");
            }
        },

        indexOf: function (arr, item, startIndex, count, T) {
            var name;

            if (Bridge.isArray(arr)) {
                var i,
                    el,
                    endIndex;

                startIndex = startIndex || 0;
                count = count || arr.length;
                endIndex = startIndex + count;

                for (i = startIndex; i < endIndex; i++) {
                    el = arr[i];

                    if (el === item || System.Collections.Generic.EqualityComparer$1.$default.equals2(el, item)) {
                        return i;
                    }
                }
            } else if (T && Bridge.isFunction(arr[name = "System$Collections$Generic$IList$1$" + Bridge.getTypeAlias(T) + "$indexOf"])) {
                return arr[name](item);
            } else if (Bridge.isFunction(arr[name = "System$Collections$IList$indexOf"])) {
                return arr[name](item);
            } else if (Bridge.isFunction(arr.indexOf)) {
                return arr.indexOf(item);
            }

            return -1;
        },

        contains: function (obj, item, T) {
            var name;

            if (Bridge.isArray(obj)) {
                return System.Array.indexOf(obj, item) > -1;
            } else if (T && Bridge.isFunction(obj[name = "System$Collections$Generic$ICollection$1$" + Bridge.getTypeAlias(T) + "$contains"])) {
                return obj[name](item);
            } else if (Bridge.isFunction(obj[name = "System$Collections$IList$contains"])) {
                return obj[name](item);
            } else if (Bridge.isFunction(obj.contains)) {
                return obj.contains(item);
            }

            return false;
        },

        remove: function (obj, item, T) {
            var name;

            if (Bridge.isArray(obj)) {
                var index = System.Array.indexOf(obj, item);

                if (index > -1) {
                    obj.splice(index, 1);

                    return true;
                }
            } else if (T && Bridge.isFunction(obj[name = "System$Collections$Generic$ICollection$1$" + Bridge.getTypeAlias(T) + "$remove"])) {
                return obj[name](item);
            } else if (Bridge.isFunction(obj[name = "System$Collections$IList$remove"])) {
                return obj[name](item);
            } else if (Bridge.isFunction(obj.remove)) {
                return obj.remove(item);
            }

            return false;
        },

        insert: function (obj, index, item, T) {
            var name;

            if (Bridge.isArray(obj)) {
                obj.splice(index, 0, item);
            } else if (T && Bridge.isFunction(obj[name = "System$Collections$Generic$IList$1$" + Bridge.getTypeAlias(T) + "$insert"])) {
                obj[name](index, item);
            } else if (Bridge.isFunction(obj[name = "System$Collections$IList$insert"])) {
                obj[name](index, item);
            } else if (Bridge.isFunction(obj.insert)) {
                obj.insert(index, item);
            }
        },

        removeAt: function (obj, index, T) {
            var name;

            if (Bridge.isArray(obj)) {
                obj.splice(index, 1);
            } else if (T && Bridge.isFunction(obj[name = "System$Collections$Generic$IList$1$" + Bridge.getTypeAlias(T) + "$removeAt"])) {
                obj[name](index);
            } else if (Bridge.isFunction(obj[name = "System$Collections$IList$removeAt"])) {
                obj[name](index);
            } else if (Bridge.isFunction(obj.removeAt)) {
                obj.removeAt(index);
            }
        },

        getItem: function (obj, idx, T) {
            var name;

            if (Bridge.isArray(obj)) {
                return obj[idx];
            } else if (Bridge.isFunction(obj.get)) {
                return obj.get(idx);
            } else if (Bridge.isFunction(obj.getItem)) {
                return obj.getItem(idx);
            } else if (T && Bridge.isFunction(obj[name = "System$Collections$Generic$IList$1$" + Bridge.getTypeAlias(T) + "$getItem"])) {
                return obj[name](idx);
            } else if (Bridge.isFunction(obj[name = "System$Collections$IList$$getItem"])) {
                return obj[name](idx);
            } else if (Bridge.isFunction(obj.get_Item)) {
                return obj.get_Item(idx);
            }
        },

        setItem: function (obj, idx, value, T) {
            var name;

            if (Bridge.isArray(obj)) {
                obj[idx] = value;
            } else if (Bridge.isFunction(obj.set)) {
                obj.set(idx, value);
            } else if (Bridge.isFunction(obj.setItem)) {
                obj.setItem(idx, value);
            } else if (T && Bridge.isFunction(obj[name = "System$Collections$Generic$IList$1$" + Bridge.getTypeAlias(T) + "$setItem"])) {
                return obj[name](idx, value);
            } else if (T && Bridge.isFunction(obj[name = "System$Collections$IList$setItem"])) {
                return obj[name](idx, value);
            } else if (Bridge.isFunction(obj.set_Item)) {
                obj.set_Item(idx, value);
            }
        },

        resize: function (arr, newSize, val) {
            if (newSize < 0) {
                throw new System.ArgumentOutOfRangeException("newSize", null, null, newSize);
            }

            var oldSize = 0,
                isFn = Bridge.isFunction(val),
                ref = arr.v;

            if (!ref) {
                ref = new Array(newSize);
            } else {
                oldSize = ref.length;
                ref.length = newSize;
            }

            for (var i = oldSize; i < newSize; i++) {
                ref[i] = isFn ? val() : val;
            }

            arr.v = ref;
        },

        reverse: function (arr, index, length) {
            if (!array) {
                throw new System.ArgumentNullException("arr");
            }

            if (!index && index !== 0) {
                index = 0;
                length = arr.length;
            }

            if (index < 0 || length < 0) {
                throw new System.ArgumentOutOfRangeException((index < 0 ? "index" : "length"), "Non-negative number required.");
            }

            if ((array.length - index) < length) {
                throw new System.ArgumentException("Offset and length were out of bounds for the array or count is greater than the number of elements from index to the end of the source collection.");
            }

            if (System.Array.getRank(arr) !== 1) {
                throw new System.Exception("Only single dimension arrays are supported here.");
            }

            var i = index,
                j = index + length - 1;

            while (i < j) {
                var temp = arr[i];
                arr[i] = arr[j];
                arr[j] = temp;
                i++;
                j--;
            }
        },

        binarySearch: function (array, index, length, value, comparer) {
            if (!array) {
                throw new System.ArgumentNullException("array");
            }

            var lb = 0;

            if (index < lb || length < 0) {
                throw new System.ArgumentOutOfRangeException(index < lb ? "index" : "length", "Non-negative number required.");
            }

            if (array.length - (index - lb) < length) {
                throw new System.ArgumentException("Offset and length were out of bounds for the array or count is greater than the number of elements from index to the end of the source collection.");
            }

            if (System.Array.getRank(array) !== 1) {
                throw new System.RankException("Only single dimensional arrays are supported for the requested action.");
            }

            if (!comparer) {
                comparer = System.Collections.Generic.Comparer$1.$default;
            }

            var lo = index,
                hi = index + length - 1,
                i,
                c;

            while (lo <= hi) {
                i = lo + ((hi - lo) >> 1);

                try {
                    c = comparer.compare(array[i], value);
                } catch (e) {
                    throw new System.InvalidOperationException("Failed to compare two elements in the array.", e);
                }

                if (c === 0) {
                    return i;
                }

                if (c < 0) {
                    lo = i + 1;
                } else {
                    hi = i - 1;
                }
            }

            return ~lo;
        },

        sort: function (array, index, length, comparer) {
            if (!array) {
                throw new System.ArgumentNullException("array");
            }

            if (arguments.length === 2 && typeof index === "object") {
                comparer = index;
                index = null;
            }

            if (!Bridge.isNumber(index)) {
                index = 0;
            }

            if (!Bridge.isNumber(length)) {
                length = array.length;
            }

            if (!comparer) {
                comparer = System.Collections.Generic.Comparer$1.$default;
            }

            if (index === 0 && length === array.length) {
                array.sort(Bridge.fn.bind(comparer, comparer.compare));
            } else {
                var newarray = array.slice(index, index + length);

                newarray.sort(Bridge.fn.bind(comparer, comparer.compare));

                for (var i = index; i < (index + length) ; i++) {
                    array[i] = newarray[i - index];
                }
            }
        },

        min: function (arr, minValue) {
            var min = arr[0],
                len = arr.length;

            for (var i = 0; i < len; i++) {
                if ((arr[i] < min || min < minValue) && !(arr[i] < minValue)) {
                    min = arr[i];
                }
            }

            return min;
        },

        max: function (arr, maxValue) {
            var max = arr[0],
                len = arr.length;

            for (var i = 0; i < len; i++) {
                if ((arr[i] > max || max > maxValue) && !(arr[i] > maxValue)) {
                    max = arr[i];
                }
            }

            return max;
        },

        addRange: function (arr, items) {
            if (Bridge.isArray(items)) {
                arr.push.apply(arr, items);
            } else {
                var e = Bridge.getEnumerator(items);

                try {
                    while (e.moveNext()) {
                        arr.push(e.getCurrent());
                    }
                } finally {
                    if (Bridge.is(e, System.IDisposable)) {
                        e.dispose();
                    }
                }
            }
        },

        convertAll: function (array, converter) {
            if (!Bridge.hasValue(array)) {
                throw new System.ArgumentNullException("array");
            }

            if (!Bridge.hasValue(converter)) {
                throw new System.ArgumentNullException("converter");
            }

            var array2 = array.map(converter);

            return array2;
        },

        find: function (T, array, match) {
            if (!Bridge.hasValue(array)) {
                throw new System.ArgumentNullException("array");
            }

            if (!Bridge.hasValue(match)) {
                throw new System.ArgumentNullException("match");
            }

            for (var i = 0; i < array.length; i++) {
                if (match(array[i])) {
                    return array[i];
                }
            }

            return Bridge.getDefaultValue(T);
        },

        findAll: function (array, match) {
            if (!Bridge.hasValue(array)) {
                throw new System.ArgumentNullException("array");
            }

            if (!Bridge.hasValue(match)) {
                throw new System.ArgumentNullException("match");
            }

            var list = [];

            for (var i = 0; i < array.length; i++) {
                if (match(array[i])) {
                    list.push(array[i]);
                }
            }

            return list;
        },

        findIndex: function (array, startIndex, count, match) {
            if (!Bridge.hasValue(array)) {
                throw new System.ArgumentNullException("array");
            }

            if (arguments.length === 2) {
                match = startIndex;
                startIndex = 0;
                count = array.length;
            } else if (arguments.length === 3) {
                match = count;
                count = array.length - startIndex;
            }

            if (startIndex < 0 || startIndex > array.length) {
                throw new System.ArgumentOutOfRangeException("startIndex");
            }

            if (count < 0 || startIndex > array.length - count) {
                throw new System.ArgumentOutOfRangeException("count");
            }

            if (!Bridge.hasValue(match)) {
                throw new System.ArgumentNullException("match");
            }

            var endIndex = startIndex + count;

            for (var i = startIndex; i < endIndex; i++) {
                if (match(array[i])) {
                    return i;
                }
            }

            return -1;
        },

        findLast: function (T, array, match) {
            if (!Bridge.hasValue(array)) {
                throw new System.ArgumentNullException("array");
            }

            if (!Bridge.hasValue(match)) {
                throw new System.ArgumentNullException("match");
            }

            for (var i = array.length - 1; i >= 0; i--) {
                if (match(array[i])) {
                    return array[i];
                }
            }

            return Bridge.getDefaultValue(T);
        },

        findLastIndex: function (array, startIndex, count, match) {
            if (!Bridge.hasValue(array)) {
                throw new System.ArgumentNullException("array");
            }

            if (arguments.length === 2) {
                match = startIndex;
                startIndex = array.length - 1;
                count = array.length;
            } else if (arguments.length === 3) {
                match = count;
                count = startIndex + 1;
            }

            if (!Bridge.hasValue(match)) {
                throw new System.ArgumentNullException("match");
            }

            if (array.length === 0) {
                if (startIndex !== -1) {
                    throw new System.ArgumentOutOfRangeException("startIndex");
                }
            } else {
                if (startIndex < 0 || startIndex >= array.length) {
                    throw new System.ArgumentOutOfRangeException("startIndex");
                }
            }

            if (count < 0 || startIndex - count + 1 < 0) {
                throw new System.ArgumentOutOfRangeException("count");
            }

            var endIndex = startIndex - count;

            for (var i = startIndex; i > endIndex; i--) {
                if (match(array[i])) {
                    return i;
                }
            }

            return -1;
        },

        forEach: function (array, action) {
            if (!Bridge.hasValue(array)) {
                throw new System.ArgumentNullException("array");
            }

            if (!Bridge.hasValue(action)) {
                throw new System.ArgumentNullException("action");
            }

            for (var i = 0; i < array.length; i++) {
                action(array[i], i, array);
            }
        },

        indexOfT: function (array, value, startIndex, count) {
            if (!Bridge.hasValue(array)) {
                throw new System.ArgumentNullException("array");
            }

            if (arguments.length === 2) {
                startIndex = 0;
                count = array.length;
            } else if (arguments.length === 3) {
                count = array.length - startIndex;
            }

            if (startIndex < 0 || (startIndex >= array.length && array.length > 0)) {
                throw new System.ArgumentOutOfRangeException("startIndex", "out of range");
            }

            if (count < 0 || count > array.length - startIndex) {
                throw new System.ArgumentOutOfRangeException("count", "out of range");
            }

            return System.Array.indexOf(array, value, startIndex, count);
        },

        lastIndexOfT: function (array, value, startIndex, count) {
            if (!Bridge.hasValue(array)) {
                throw new System.ArgumentNullException("array");
            }

            if (arguments.length === 2) {
                startIndex = array.length - 1;
                count = array.length;
            } else if (arguments.length === 3) {
                count = (array.length === 0) ? 0 : (startIndex + 1);
            }

            if (startIndex < 0 || (startIndex >= array.length && array.length > 0)) {
                throw new System.ArgumentOutOfRangeException("startIndex", "out of range");
            }

            if (count < 0 || startIndex - count + 1 < 0) {
                throw new System.ArgumentOutOfRangeException("count", "out of range");
            }

            var endIndex = startIndex - count + 1;

            for (var i = startIndex; i >= endIndex; i--) {
                var el = array[i];

                if (el === value || System.Collections.Generic.EqualityComparer$1.$default.equals2(el, value)) {
                    return i;
                }
            }

            return -1;
        },

        trueForAll: function (array, match) {
            if (!Bridge.hasValue(array)) {
                throw new System.ArgumentNullException("array");
            }

            if (!Bridge.hasValue(match)) {
                throw new System.ArgumentNullException("match");
            }

            for (var i = 0; i < array.length; i++) {
                if (!match(array[i])) {
                    return false;
                }
            }

            return true;
        },

        type: function (t, rank, arr) {
            rank = rank || 1;

            var typeCache = System.Array.$cache[rank],
                result,
                name;

            if (!typeCache) {
                typeCache = [];
                System.Array.$cache[rank] = typeCache;
            }

            for (var i = 0; i < typeCache.length; i++) {
                if (typeCache[i].$elementType === t) {
                    result = typeCache[i];
                    break;
                }
            }

            if (!result) {
                name = Bridge.getTypeName(t) + "[" + System.String.fromCharCount(",".charCodeAt(0), rank - 1) + "]";

                result = Bridge.define(name, {
                    $inherits: [Array, System.Collections.ICollection, System.ICloneable, System.Collections.Generic.IList$1(t)],
                    $noRegister: true,
                    statics: {
                        $elementType: t,
                        $rank: rank,
                        $isArray: true,
                        $is: function(obj) {
                            return System.Array.is(obj, this);
                        },
                        getDefaultValue: function() {
                            return null;
                        },
                        createInstance: function() {
                            var arr;
                            if (this.$rank === 1) {
                                arr = [];
                            } else {
                                var args = [Bridge.getDefaultValue(this.$elementType), null, this.$elementType];
                                for (var j = 0; j < this.$rank; j++) {
                                    args.push(0);
                                }
                                arr = System.Array.create.apply(System.Array, args);
                            }

                            arr.$type = this;
                            return arr;
                        }
                    }
                });

                typeCache.push(result);
                Bridge.init();
            }

            if (arr) {
                arr.$type = result;
            }

            return arr || result;
        }
    };

    System.Array = array;
    System.Array.$cache = {};

    // @source ArraySegment.js

    Bridge.define('System.ArraySegment', {
        ctor: function (array, offset, count) {
            this.$initialize();
            this.array = array;
            this.offset = offset || 0;
            this.count = count || array.length;
        },

        getArray: function () {
            return this.array;
        },

        getCount: function () {
            return this.count;
        },

        getOffset: function () {
            return this.offset;
        }
    });

    // @source KeyValuePair.js

    Bridge.define('System.Collections.Generic.KeyValuePair$2', function (TKey, TValue) {
        return {
            $kind: "struct",

            statics: {
                getDefaultValue: function () {
                    return new (System.Collections.Generic.KeyValuePair$2(TKey, TValue))(Bridge.getDefaultValue(TKey), Bridge.getDefaultValue(TValue));
                }
            },

            ctor: function (key, value) {
                if (key === undefined) {
                    key = Bridge.getDefaultValue(TKey);
                }

                if (value === undefined) {
                    value = Bridge.getDefaultValue(TValue);
                }

                this.$initialize();
                this.key = key;
                this.value = value;
            },

            toString: function () {
                var s = "[";

                if (this.key != null) {
                    s += this.key.toString();
                }

                s += ", ";

                if (this.value != null) {
                    s += this.value.toString();
                }

                s += "]";

                return s;
            }
        };
    });
    // @source Interfaces.js

    Bridge.define('System.Collections.IEnumerable', {
        $kind: "interface"
    });
    Bridge.define('System.Collections.IEnumerator', {
        $kind: "interface"
    });
    Bridge.define('System.Collections.IEqualityComparer', {
        $kind: "interface"
    });
    Bridge.define('System.Collections.ICollection', {
        inherits: [System.Collections.IEnumerable],
        $kind: "interface"
    });
    Bridge.define('System.Collections.IList', {
        inherits: [System.Collections.ICollection],
        $kind: "interface"
    });
    Bridge.define('System.Collections.IDictionary', {
        inherits: [System.Collections.ICollection],
        $kind: "interface"
    });

    Bridge.define('System.Collections.Generic.IEnumerator$1', function (T) {
        return {
            inherits: [System.Collections.IEnumerator],
            $kind: "interface"
        };
    });

    Bridge.define('System.Collections.Generic.IEnumerable$1', function (T) {
        return {
            inherits: [System.Collections.IEnumerable],
            $kind: "interface"
        };
    });

    Bridge.define('System.Collections.Generic.ICollection$1', function (T) {
        return {
            inherits: [System.Collections.Generic.IEnumerable$1(T)],
            $kind: "interface"
        };
    });

    Bridge.define('System.Collections.Generic.IEqualityComparer$1', function (T) {
        return {
            $kind: "interface"
        };
    });

    Bridge.define('System.Collections.Generic.IDictionary$2', function (TKey, TValue) {
        return {
            inherits: [System.Collections.Generic.IEnumerable$1(System.Collections.Generic.KeyValuePair$2(TKey, TValue))],
            $kind: "interface"
        };
    });

    Bridge.define('System.Collections.Generic.IList$1', function (T) {
        return {
            inherits: [System.Collections.Generic.ICollection$1(T)],
            $kind: "interface"
        };
    });

    Bridge.define('System.Collections.Generic.IComparer$1', function (T) {
        return {
            $kind: "interface"
        };
    });

    Bridge.define('System.Collections.Generic.ISet$1', function (T) {
        return {
            inherits: [System.Collections.Generic.ICollection$1(T)],
            $kind: "interface"
        };
    });

    Bridge.define('System.Collections.Generic.IReadOnlyCollection$1', function (T) {
        return {
            inherits: [System.Collections.Generic.IEnumerable$1(T)],
            $kind: "interface"
        };
    });

    Bridge.define('System.Collections.Generic.IReadOnlyList$1', function (T) {
        return {
            inherits: [System.Collections.Generic.IReadOnlyCollection$1(T)],
            $kind: "interface"
        };
    });

    // @source CustomEnumerator.js

    Bridge.define('Bridge.CustomEnumerator', {
        inherits: [System.Collections.IEnumerator],

        config: {
            alias: [
                "getCurrent", "System$Collections$IEnumerator$getCurrent",
                "moveNext", "System$Collections$IEnumerator$moveNext",
                "reset", "System$Collections$IEnumerator$reset"
            ]
        },

        ctor: function (moveNext, getCurrent, reset, dispose, scope) {
            this.$initialize();
            this.$moveNext = moveNext;
            this.$getCurrent = getCurrent;
            this.$dispose = dispose;
            this.$reset = reset;
            this.scope = scope;
        },

        moveNext: function () {
            try {
                return this.$moveNext.call(this.scope);
            }
            catch (ex) {
                this.dispose.call(this.scope);

                throw ex;
            }
        },

        getCurrent: function () {
            return this.$getCurrent.call(this.scope);
        },

        getCurrent$1: function () {
            return this.$getCurrent.call(this.scope);
        },

        reset: function () {
            if (this.$reset) {
                this.$reset.call(this.scope);
            }
        },

        dispose: function () {
            if (this.$dispose) {
                this.$dispose.call(this.scope);
            }
        }
    });

    // @source ArrayEnumerator.js

    Bridge.define('Bridge.ArrayEnumerator', {
        inherits: [System.Collections.IEnumerator, System.IDisposable],

        statics: {
            $isArrayEnumerator: true
        },

        config: {
            alias: [
                "getCurrent", "System$Collections$IEnumerator$getCurrent",
                "moveNext", "System$Collections$IEnumerator$moveNext",
                "reset", "System$Collections$IEnumerator$reset",
                "dispose", "System$IDisposable$dispose"
            ]
        },

        ctor: function (array, T) {
            this.$initialize();
            this.array = array;
            this.reset();

            if (T) {
                this["System$Collections$Generic$IEnumerator$1$" + Bridge.getTypeAlias(T) + "$getCurrent$1"] = this.getCurrent;
            }
        },

        moveNext: function () {
            this.index++;

            return this.index < this.array.length;
        },

        getCurrent: function () {
            return this.array[this.index];
        },

        getCurrent$1: function () {
            return this.array[this.index];
        },

        reset: function () {
            this.index = -1;
        },

        dispose: Bridge.emptyFn
    });

    Bridge.define('Bridge.ArrayEnumerable', {
        inherits: [System.Collections.IEnumerable],

        config: {
            alias: [
                "getEnumerator", "System$Collections$IEnumerable$getEnumerator"
            ]
        },

        ctor: function (array) {
            this.$initialize();
            this.array = array;
        },

        getEnumerator: function () {
            return new Bridge.ArrayEnumerator(this.array);
        }
    });

    // @source EqualityComparer.js

    Bridge.define('System.Collections.Generic.EqualityComparer$1', function (T) {
        return {
            inherits: [System.Collections.Generic.IEqualityComparer$1(T)],

            statics: {
                config: {
                    init: function () {
                        this.def = new (System.Collections.Generic.EqualityComparer$1(T))();
                    }
                }
            },

            config: {
                alias: [
                    "equals2", "System$Collections$Generic$IEqualityComparer$1$" + Bridge.getTypeAlias(T) + "$equals2",
                    "getHashCode2", "System$Collections$Generic$IEqualityComparer$1$" + Bridge.getTypeAlias(T) + "$getHashCode2"
                ]
            },

            equals2: function (x, y) {
                if (!Bridge.isDefined(x, true)) {
                    return !Bridge.isDefined(y, true);
                } else if (Bridge.isDefined(y, true)) {
                    var isBridge = x && x.$$name;

                    if (!isBridge) {
                        return Bridge.equals(x, y);
                    }
                    else if (Bridge.isFunction(x.equalsT)) {
                        return Bridge.equalsT(x, y);
                    }
                    else if (Bridge.isFunction(x.equals)) {
                        return Bridge.equals(x, y);
                    }

                    return x === y;
                }

                return false;
            },

            getHashCode2: function (obj) {
                return Bridge.isDefined(obj, true) ? Bridge.getHashCode(obj) : 0;
            }
        };
    });

    System.Collections.Generic.EqualityComparer$1.$default = new (System.Collections.Generic.EqualityComparer$1(Object))();

    // @source Comparer.js

    Bridge.define('System.Collections.Generic.Comparer$1', function (T) {
        return {
            inherits: [System.Collections.Generic.IComparer$1(T)],

            ctor: function (fn) {
                this.$initialize();
                this.fn = fn;
                this.compare = fn;
                this["System$Collections$Generic$IComparer$1$" + Bridge.getTypeAlias(T) + "$compare"] = fn;
            }
        }
    });

    System.Collections.Generic.Comparer$1.$default = new (System.Collections.Generic.Comparer$1(Object))(function (x, y) {
        if (!Bridge.hasValue(x)) {
            return !Bridge.hasValue(y) ? 0 : -1;
        } else if (!Bridge.hasValue(y)) {
            return 1;
        }

        return Bridge.compare(x, y);
    });

    // @source Dictionary.js

    Bridge.define('System.Collections.Generic.Dictionary$2', function (TKey, TValue) {
        return {
            inherits: [System.Collections.Generic.IDictionary$2(TKey, TValue), System.Collections.IDictionary],

            config: {
                alias: [
                    "getCount", "System$Collections$Generic$ICollection$1$" + Bridge.getTypeAlias(System.Collections.Generic.KeyValuePair$2(TKey, TValue)) + "$getCount",
                    "getKeys", "System$Collections$Generic$IDictionary$2$" + Bridge.getTypeAlias(TKey) + "$" + Bridge.getTypeAlias(TValue) + "$getKeys",
                    "getValues", "System$Collections$Generic$IDictionary$2$" + Bridge.getTypeAlias(TKey) + "$" + Bridge.getTypeAlias(TValue) + "$getValues",
                    "get", "System$Collections$Generic$IDictionary$2$" + Bridge.getTypeAlias(TKey) + "$" + Bridge.getTypeAlias(TValue) + "$getItem",
                    "set", "System$Collections$Generic$IDictionary$2$" + Bridge.getTypeAlias(TKey) + "$" + Bridge.getTypeAlias(TValue) + "$setItem",
                    "add", "System$Collections$Generic$IDictionary$2$" + Bridge.getTypeAlias(TKey) + "$" + Bridge.getTypeAlias(TValue) + "$add",
                    "containsKey", "System$Collections$Generic$IDictionary$2$" + Bridge.getTypeAlias(TKey) + "$" + Bridge.getTypeAlias(TValue) + "$containsKey",
                    "getEnumerator", "System$Collections$Generic$IEnumerable$1$System$Collections$Generic$KeyValuePair$2$" + Bridge.getTypeAlias(TKey) + "$" + Bridge.getTypeAlias(TValue) + "$getEnumerator",
                    "remove", "System$Collections$Generic$IDictionary$2$" + Bridge.getTypeAlias(TKey) + "$" + Bridge.getTypeAlias(TValue) + "$remove",
                    "tryGetValue", "System$Collections$Generic$IDictionary$2$" + Bridge.getTypeAlias(TKey) + "$" + Bridge.getTypeAlias(TValue) + "$tryGetValue",
                    "getIsReadOnly", "System$Collections$Generic$ICollection$1$" + Bridge.getTypeAlias(System.Collections.Generic.KeyValuePair$2(TKey, TValue)) + "$getIsReadOnly",
                    "addPair", "System$Collections$Generic$ICollection$1$" + Bridge.getTypeAlias(System.Collections.Generic.KeyValuePair$2(TKey, TValue)) + "$add",
                    "copyTo", "System$Collections$Generic$ICollection$1$" + Bridge.getTypeAlias(System.Collections.Generic.KeyValuePair$2(TKey, TValue)) + "$copyTo",
                    "clear", "System$Collections$Generic$ICollection$1$" + Bridge.getTypeAlias(System.Collections.Generic.KeyValuePair$2(TKey, TValue)) + "$clear",
                    "containsPair", "System$Collections$Generic$ICollection$1$" + Bridge.getTypeAlias(System.Collections.Generic.KeyValuePair$2(TKey, TValue)) + "$contains",
                    "removePair", "System$Collections$Generic$ICollection$1$" + Bridge.getTypeAlias(System.Collections.Generic.KeyValuePair$2(TKey, TValue)) + "$remove",
                    "copyTo", "System$Collections$ICollection$copyTo",
                    "get", "System$Collections$IDictionary$getItem",
                    "set", "System$Collections$IDictionary$setItem",
                    "getValues", "System$Collections$IDictionary$getValues",
                    "containsKey", "System$Collections$IDictionary$containsKey",
                    "add", "System$Collections$IDictionary$add",
                    "remove", "System$Collections$IDictionary$remove",
                    "getIsReadOnly", "System$Collections$IDictionary$getIsReadOnly",
                    "getKeys", "System$Collections$IDictionary$getKeys"
                ]
            },

            ctor: function (obj, comparer) {
                this.$initialize();
                this.comparer = comparer || System.Collections.Generic.EqualityComparer$1(TKey).def;
                this.clear();

                if (Bridge.is(obj, System.Collections.Generic.Dictionary$2(TKey, TValue))) {
                    var e = Bridge.getEnumerator(obj),
                        c;

                    while (e.moveNext()) {
                        c = e.getCurrent();
                        this.add(c.key, c.value);
                    }
                } else if (Object.prototype.toString.call(obj) === '[object Object]') {
                    var names = Object.keys(obj),
                        name;

                    for (var i = 0; i < names.length; i++) {
                        name = names[i];
                        this.add(name, obj[name]);
                    }
                }
            },

            containsPair: function(pair) {
                var entry = this.findEntry(pair.key);
                return entry && this.comparer.equals2(entry.value, pair.value);
            },

            removePair: function (pair) {
                var entry = this.findEntry(pair.key);
                if (entry && this.comparer.equals2(entry.value, pair.value)) {
                    this.remove(pair.key);
                    return true;
                }

                return false;
            },

            copyTo: function (array, arrayIndex) {
                var items = System.Linq.Enumerable.from(this).toArray();
                System.Array.copy(items, 0, array, arrayIndex, items.length);
            },

            getIsReadOnly: function () {
                return !!this.readOnly;
            },

            getKeys: function () {
                return new (System.Collections.Generic.DictionaryCollection$1(TKey))(this, true);
            },

            getValues: function () {
                return new (System.Collections.Generic.DictionaryCollection$1(TValue))(this, false);
            },

            clear: function () {
                this.entries = { };
                this.count = 0;
            },

            findEntry: function (key) {
                var hash = this.comparer.getHashCode2(key),
                    entries,
                    i;

                if (Bridge.isDefined(this.entries[hash])) {
                    entries = this.entries[hash];

                    for (i = 0; i < entries.length; i++) {
                        if (this.comparer.equals2(entries[i].key, key)) {
                            return entries[i];
                        }
                    }
                }
            },

            containsKey: function (key) {
                return !!this.findEntry(key);
            },

            containsValue: function (value) {
                var e, i;

                for (e in this.entries) {
                    if (this.entries.hasOwnProperty(e)) {
                        var entries = this.entries[e];

                        for (i = 0; i < entries.length; i++) {
                            if (this.comparer.equals2(entries[i].value, value)) {
                                return true;
                            }
                        }
                    }
                }

                return false;
            },

            get: function (key) {
                var entry = this.findEntry(key);

                if (!entry) {
                    throw new System.Collections.Generic.KeyNotFoundException('Key ' + key + ' does not exist.');
                }

                return entry.value;
            },

            getItem: function (key) {
                return this.get(key);
            },

            set: function (key, value, add) {
                var entry = this.findEntry(key),
                    hash;

                if (entry) {
                    if (add) {
                        throw new System.ArgumentException('Key ' + key + ' already exists.');
                    }

                    entry.value = value;
                    return;
                }

                hash = this.comparer.getHashCode2(key);
                entry = new (System.Collections.Generic.KeyValuePair$2(TKey, TValue))(key, value);

                if (this.entries[hash]) {
                    this.entries[hash].push(entry);
                } else {
                    this.entries[hash] = [entry];
                }

                this.count++;
            },

            setItem: function (key, value, add) {
                this.set(key, value, add);
            },

            add: function (key, value) {
                this.set(key, value, true);
            },

            addPair: function (pair) {
                this.set(pair.key, pair.value, true);
            },

            remove: function (key) {
                var hash = this.comparer.getHashCode2(key),
                    entries,
                    i;

                if (!this.entries[hash]) {
                    return false;
                }

                entries = this.entries[hash];

                for (i = 0; i < entries.length; i++) {
                    if (this.comparer.equals2(entries[i].key, key)) {
                        entries.splice(i, 1);

                        if (entries.length == 0) {
                            delete this.entries[hash];
                        }

                        this.count--;

                        return true;
                    }
                }

                return false;
            },

            getCount: function () {
                return this.count;
            },

            getComparer: function () {
                return this.comparer;
            },

            tryGetValue: function (key, value) {
                var entry = this.findEntry(key);

                value.v = entry ? entry.value : Bridge.getDefaultValue(TValue);

                return !!entry;
            },

            getCustomEnumerator: function (fn) {
                var hashes = Bridge.getPropertyNames(this.entries),
                    hashIndex = -1,
                    keyIndex;

                return new Bridge.CustomEnumerator(function () {
                    if (hashIndex < 0 || keyIndex >= (this.entries[hashes[hashIndex]].length - 1)) {
                        keyIndex = -1;
                        hashIndex++;
                    }

                    if (hashIndex >= hashes.length) {
                        return false;
                    }

                    keyIndex++;

                    return true;
                }, function () {
                    return fn(this.entries[hashes[hashIndex]][keyIndex]);
                }, function () {
                    hashIndex = -1;
                }, null, this);
            },

            getEnumerator: function () {
                return this.getCustomEnumerator(function (e) {
                     return e;
                });
            }
        };
    });

    Bridge.define('System.Collections.Generic.DictionaryCollection$1', function (T) {
        return {
            inherits: [System.Collections.Generic.ICollection$1(T)],

            config: {
                alias: [
                  "getEnumerator", "System$Collections$Generic$IEnumerable$1$" + Bridge.getTypeAlias(T) + "$getEnumerator",
                  "getCount", "System$Collections$Generic$ICollection$1$" + Bridge.getTypeAlias(T) + "$getCount",
                  "add", "System$Collections$Generic$ICollection$1$" + Bridge.getTypeAlias(T) + "$add",
                  "clear", "System$Collections$Generic$ICollection$1$" + Bridge.getTypeAlias(T) + "$clear",
                  "contains", "System$Collections$Generic$ICollection$1$" + Bridge.getTypeAlias(T) + "$contains",
                  "remove", "System$Collections$Generic$ICollection$1$" + Bridge.getTypeAlias(T) + "$remove"
                ]
            },

            ctor: function (dictionary, keys) {
                this.$initialize();
                this.dictionary = dictionary;
                this.keys = keys;
            },

            getCount: function () {
                return this.dictionary.getCount();
            },

            getEnumerator: function () {
                return this.dictionary.getCustomEnumerator(this.keys ? function (e) {
                    return e.key;
                } : function (e) {
                    return e.value;
                });
            },

            contains: function (value) {
                return this.keys ? this.dictionary.containsKey(value) : this.dictionary.containsValue(value);
            },

            add: function (v) {
                throw new System.NotSupportedException();
            },

            clear: function () {
                throw new System.NotSupportedException();
            },

            remove: function () {
                throw new System.NotSupportedException();
            }
        };
    });

    // @source List.js

    Bridge.define('System.Collections.Generic.List$1', function (T) {
        return {
            inherits: [System.Collections.Generic.IList$1(T), System.Collections.IList],

            config: {
                alias: [
                "getItem", "System$Collections$Generic$IList$1$" + Bridge.getTypeAlias(T) + "$getItem",
                "getItem", "System$Collections$IList$getItem",
                "setItem", "System$Collections$Generic$IList$1$" + Bridge.getTypeAlias(T) + "$setItem",
                "setItem", "System$Collections$IList$setItem",
                "getCount", "System$Collections$Generic$ICollection$1$" + Bridge.getTypeAlias(T) + "$getCount",
                "getCount", "System$Collections$ICollection$getCount",
                "getIsReadOnly", "System$Collections$Generic$ICollection$1$" + Bridge.getTypeAlias(T) + "$getIsReadOnly",
                "getIsReadOnly", "System$Collections$IList$getIsReadOnly",
                "add", "System$Collections$Generic$ICollection$1$" + Bridge.getTypeAlias(T) + "$add",
                "add", "System$Collections$IList$add",
                "clear", "System$Collections$Generic$ICollection$1$" + Bridge.getTypeAlias(T) + "$clear",
                "clear", "System$Collections$IList$clear",
                "contains", "System$Collections$Generic$ICollection$1$" + Bridge.getTypeAlias(T) + "$contains",
                "contains", "System$Collections$IList$contains",
                "copyTo", "System$Collections$Generic$ICollection$1$" + Bridge.getTypeAlias(T) + "$copyTo",
                "copyTo", "System$Collections$ICollection$copyTo",
                "getEnumerator", "System$Collections$Generic$IEnumerable$1$" + Bridge.getTypeAlias(T) + "$getEnumerator",
                "getEnumerator", "System$Collections$IEnumerable$getEnumerator",
                "indexOf", "System$Collections$Generic$IList$1$" + Bridge.getTypeAlias(T) + "$indexOf",
                "indexOf", "System$Collections$IList$indexOf",
                "insert", "System$Collections$Generic$IList$1$" + Bridge.getTypeAlias(T) + "$insert",
                "insert", "System$Collections$IList$insert",
                "remove", "System$Collections$Generic$ICollection$1$" + Bridge.getTypeAlias(T) + "$remove",
                "remove", "System$Collections$IList$remove",
                "removeAt", "System$Collections$Generic$IList$1$" + Bridge.getTypeAlias(T) + "$removeAt",
                "removeAt", "System$Collections$IList$removeAt"
                ]
            },

            ctor: function (obj) {
                this.$initialize();
                if (Object.prototype.toString.call(obj) === '[object Array]') {
                    this.items = System.Array.clone(obj);
                } else if (Bridge.is(obj, System.Collections.IEnumerable)) {
                    this.items = Bridge.toArray(obj);
                } else {
                    this.items = [];
                }

                this.clear.$clearCallbacks = [];
            },

            checkIndex: function (index) {
                if (index < 0 || index > (this.items.length - 1)) {
                    throw new System.ArgumentOutOfRangeException('Index out of range');
                }
            },

            getCount: function () {
                return this.items.length;
            },

            getIsReadOnly: function () {
                return !!this.readOnly;
            },

            get: function (index) {
                this.checkIndex(index);

                return this.items[index];
            },

            getItem: function (index) {
                return this.get(index);
            },

            set: function (index, value) {
                this.checkReadOnly();
                this.checkIndex(index);
                this.items[index] = value;
            },

            setItem: function (index, value) {
                this.set(index, value);
            },

            add: function (value) {
                this.checkReadOnly();
                this.items.push(value);
            },

            addRange: function (items) {
                this.checkReadOnly();

                var array = Bridge.toArray(items),
                    i,
                    len;

                for (i = 0, len = array.length; i < len; ++i) {
                    this.items.push(array[i]);
                }
            },

            clear: function () {
                this.checkReadOnly();
                this.items = [];

                for (var i = 0; i < this.clear.$clearCallbacks.length; i++) {
                    this.clear.$clearCallbacks[i](this);
                }
            },

            onClear: function(callback) {
                this.clear.$clearCallbacks.push(callback);
            },

            indexOf: function (item, startIndex) {
                var i, el;

                if (!Bridge.isDefined(startIndex)) {
                    startIndex = 0;
                }

                if (startIndex !== 0) {
                    this.checkIndex(startIndex);
                }

                for (i = startIndex; i < this.items.length; i++) {
                    el = this.items[i];

                    if (System.Collections.Generic.EqualityComparer$1.$default.equals2(el, item)) {
                        return i;
                    }
                }

                return -1;
            },

            insertRange: function (index, items) {
                this.checkReadOnly();

                if (index !== this.items.length) {
                    this.checkIndex(index);
                }

                var array = Bridge.toArray(items);

                for (var i = 0; i < array.length; i++) {
                    this.insert(index++, array[i]);
                }
            },

            contains: function (item) {
                return this.indexOf(item) > -1;
            },

            copyTo: function (array, arrayIndex) {
                System.Array.copy(this.items, 0, array, arrayIndex, this.items.length);
            },

            getEnumerator: function () {
                return new Bridge.ArrayEnumerator(this.items, T);
            },

            getRange: function (index, count) {
                if (!Bridge.isDefined(index)) {
                    index = 0;
                }

                if (!Bridge.isDefined(count)) {
                    count = this.items.length;
                }

                if (index !== 0) {
                    this.checkIndex(index);
                }

                this.checkIndex(index + count - 1);

                var result = [],
                    i,
                    maxIndex = index + count;

                for (i = index; i < maxIndex; i++) {
                    result.push(this.items[i]);
                }

                return new (System.Collections.Generic.List$1(T))(result);
            },

            insert: function (index, item) {
                this.checkReadOnly();

                if (index !== this.items.length) {
                    this.checkIndex(index);
                }

                if (Bridge.isArray(item)) {
                    for (var i = 0; i < item.length; i++) {
                        this.insert(index++, item[i]);
                    }
                } else {
                    this.items.splice(index, 0, item);
                }
            },

            join: function (delimeter) {
                return this.items.join(delimeter);
            },

            lastIndexOf: function (item, fromIndex) {
                if (!Bridge.isDefined(fromIndex)) {
                    fromIndex = this.items.length - 1;
                }

                if (fromIndex !== 0) {
                    this.checkIndex(fromIndex);
                }

                for (var i = fromIndex; i >= 0; i--) {
                    if (item === this.items[i]) {
                        return i;
                    }
                }

                return -1;
            },

            remove: function (item) {
                this.checkReadOnly();

                var index = this.indexOf(item);

                if (index < 0) {
                    return false;
                }

                this.checkIndex(index);
                this.items.splice(index, 1);
                return true;
            },

            removeAt: function (index) {
                this.checkReadOnly();
                this.checkIndex(index);
                this.items.splice(index, 1);
            },

            removeRange: function (index, count) {
                this.checkReadOnly();
                this.checkIndex(index);
                this.items.splice(index, count);
            },

            reverse: function () {
                this.checkReadOnly();
                this.items.reverse();
            },

            slice: function (start, end) {
                this.checkReadOnly();

                var gName = this.$$name.substr(this.$$name.lastIndexOf('$') + 1);

                return new (System.Collections.Generic.List$1(Bridge.unroll(gName)))(this.items.slice(start, end));
            },

            sort: function (comparison) {
                this.checkReadOnly();
                this.items.sort(comparison || System.Collections.Generic.Comparer$1.$default.compare);
            },

            splice: function (start, count, items) {
                this.checkReadOnly();
                this.items.splice(start, count, items);
            },

            unshift: function () {
                this.checkReadOnly();
                this.items.unshift();
            },

            toArray: function () {
                return Bridge.toArray(this);
            },

            checkReadOnly: function () {
                if (this.readOnly) {
                    throw new System.NotSupportedException();
                }
            },

            binarySearch: function (index, length, value, comparer) {
                if (arguments.length === 1) {
                    value = index;
                    index = null;
                }

                if (arguments.length === 2) {
                    value = index;
                    comparer = length;
                    index = null;
                    length = null;
                }

                if (!Bridge.isNumber(index)) {
                    index = 0;
                }

                if (!Bridge.isNumber(length)) {
                    length = this.items.length;
                }

                if (!comparer) {
                    comparer = System.Collections.Generic.Comparer$1.$default;
                }

                return System.Array.binarySearch(this.items, index, length, value, comparer);
            },

            convertAll: function (TOutput, converter) {
                if (!Bridge.hasValue(converter)) {
                    throw new System.ArgumentNullException("converter is null.");
                }

                var list = new (System.Collections.Generic.List$1(TOutput))(this.items.length);
                for (var i = 0; i < this.items.length; i++) {
                    list.items[i] = converter(this.items[i]);
                }

                return list;
            }
        };
    });

    Bridge.define('System.Collections.ObjectModel.ReadOnlyCollection$1', function (T) {
        return {
            inherits: [System.Collections.Generic.List$1(T), System.Collections.Generic.IReadOnlyList$1(T)],
            ctor: function (list) {
                this.$initialize();
                if (list == null) {
                    throw new System.ArgumentNullException("list");
                }

                System.Collections.Generic.List$1(T).ctor.call(this, []);
                this.readOnly = true;

                if (Object.prototype.toString.call(list) === '[object Array]') {
                    this.items = list;
                } else if (Bridge.is(list, System.Collections.Generic.List$1(T))) {
                    var me = this;
                    this.items = list.items;
                    list.onClear(function(l) {
                        me.items = l.items;
                    });
                } else if (Bridge.is(list, System.Collections.IEnumerable)) {
                    this.items = Bridge.toArray(list);
                }
            }
        };
    });

    // @source Task.js

    Bridge.define("System.Threading.Tasks.Task", {
        inherits: [System.IDisposable],

        config: {
            alias: [
                "dispose", "System$IDisposable$dispose"
            ]
        },

        ctor: function (action, state) {
            this.$initialize();
            this.action = action;
            this.state = state;
            this.exception = null;
            this.status = System.Threading.Tasks.TaskStatus.created;
            this.callbacks = [];
            this.result = null;
        },

        statics: {
            delay: function (delay, state) {
                var tcs = new System.Threading.Tasks.TaskCompletionSource();

                setTimeout(function () {
                    tcs.setResult(state);
                }, delay);

                return tcs.task;
            },

            fromResult: function (result) {
                var t = new System.Threading.Tasks.Task();

                t.status = System.Threading.Tasks.TaskStatus.ranToCompletion;
                t.result = result;

                return t;
            },

            run: function (fn) {
                var tcs = new System.Threading.Tasks.TaskCompletionSource();

                setTimeout(function () {
                    try {
                        tcs.setResult(fn());
                    } catch (e) {
                        tcs.setException(System.Exception.create(e));
                    }
                }, 0);

                return tcs.task;
            },

            whenAll: function (tasks) {
                var tcs = new System.Threading.Tasks.TaskCompletionSource(),
                    result,
                    executing,
                    cancelled = false,
                    exceptions = [],
                    i;

                if (Bridge.is(tasks, System.Collections.IEnumerable)) {
                    tasks = Bridge.toArray(tasks);
                } else if (!Bridge.isArray(tasks)) {
                    tasks = Array.prototype.slice.call(arguments, 0);
                }

                if (tasks.length === 0) {
                    tcs.setResult([]);

                    return tcs.task;
                }

                executing = tasks.length;
                result = new Array(tasks.length);

                for (i = 0; i < tasks.length; i++) {
                    (function (i) {
                        tasks[i].continueWith(function (t) {
                            switch (t.status) {
                                case System.Threading.Tasks.TaskStatus.ranToCompletion:
                                    result[i] = t.getResult();
                                    break;
                                case System.Threading.Tasks.TaskStatus.canceled:
                                    cancelled = true;
                                    break;
                                case System.Threading.Tasks.TaskStatus.faulted:
                                    System.Array.addRange(exceptions, t.exception.innerExceptions);
                                    break;
                                default:
                                    throw new System.InvalidOperationException("Invalid task status: " + t.status);
                            }

                            if (--executing === 0) {
                                if (exceptions.length > 0) {
                                    tcs.setException(exceptions);
                                } else if (cancelled) {
                                    tcs.setCanceled();
                                } else {
                                    tcs.setResult(result);
                                }
                            }
                        });
                    })(i);
                }

                return tcs.task;
            },

            whenAny: function (tasks) {
                if (Bridge.is(tasks, System.Collections.IEnumerable)) {
                    tasks = Bridge.toArray(tasks);
                } else if (!Bridge.isArray(tasks)) {
                    tasks = Array.prototype.slice.call(arguments, 0);
                }

                if (!tasks.length) {
                    throw new System.ArgumentException("At least one task is required");
                }

                var tcs = new System.Threading.Tasks.TaskCompletionSource(),
                    i;

                for (i = 0; i < tasks.length; i++) {
                    tasks[i].continueWith(function (t) {
                        switch (t.status) {
                            case System.Threading.Tasks.TaskStatus.ranToCompletion:
                                tcs.trySetResult(t);
                                break;
                            case System.Threading.Tasks.TaskStatus.canceled:
                                tcs.trySetCanceled();
                                break;
                            case System.Threading.Tasks.TaskStatus.faulted:
                                tcs.trySetException(t.exception.innerExceptions);
                                break;
                            default:
                                throw new System.InvalidOperationException("Invalid task status: " + t.status);
                        }
                    });
                }

                return tcs.task;
            },

            fromCallback: function (target, method) {
                var tcs = new System.Threading.Tasks.TaskCompletionSource(),
                    args = Array.prototype.slice.call(arguments, 2),
                    callback;

                callback = function (value) {
                    tcs.setResult(value);
                };

                args.push(callback);

                target[method].apply(target, args);

                return tcs.task;
            },

            fromCallbackResult: function (target, method, resultHandler) {
                var tcs = new System.Threading.Tasks.TaskCompletionSource(),
                    args = Array.prototype.slice.call(arguments, 3),
                    callback;

                callback = function (value) {
                    tcs.setResult(value);
                };

                resultHandler(args, callback);

                target[method].apply(target, args);

                return tcs.task;
            },

            fromCallbackOptions: function (target, method, name) {
                var tcs = new System.Threading.Tasks.TaskCompletionSource(),
                    args = Array.prototype.slice.call(arguments, 3),
                    callback;

                callback = function (value) {
                    tcs.setResult(value);
                };

                args[0] = args[0] || {};
                args[0][name] = callback;

                target[method].apply(target, args);

                return tcs.task;
            },

            fromPromise: function (promise, handler, errorHandler, progressHandler) {
                var tcs = new System.Threading.Tasks.TaskCompletionSource();

                if (!promise.then) {
                    promise = promise.promise();
                }

                if (typeof (handler) === 'number') {
                    handler = (function (i) {
                        return function () {
                            return arguments[i >= 0 ? i : (arguments.length + i)];
                        };
                    })(handler);
                } else if (typeof (handler) !== 'function') {
                    handler = function () {
                        return Array.prototype.slice.call(arguments, 0);
                    };
                }

                promise.then(function () {
                    tcs.setResult(handler ? handler.apply(null, arguments) : Array.prototype.slice.call(arguments, 0));
                }, function () {
                    tcs.setException(errorHandler ? errorHandler.apply(null, arguments) : new Bridge.PromiseException(Array.prototype.slice.call(arguments, 0)));
                }, progressHandler);

                return tcs.task;
            }
        },

        continueWith: function (continuationAction, raise) {
            var tcs = new System.Threading.Tasks.TaskCompletionSource(),
                me = this,
                fn = raise ? function () {
                    tcs.setResult(continuationAction(me));
                } : function () {
                    try {
                        tcs.setResult(continuationAction(me));
                    } catch (e) {
                        tcs.setException(System.Exception.create(e));
                    }
                };

            if (this.isCompleted()) {
                setTimeout(fn, 0);
            } else {
                this.callbacks.push(fn);
            }

            return tcs.task;
        },

        start: function () {
            if (this.status !== System.Threading.Tasks.TaskStatus.created) {
                throw new System.InvalidOperationException("Task was already started.");
            }

            var me = this;

            this.status = System.Threading.Tasks.TaskStatus.running;

            setTimeout(function () {
                try {
                    var result = me.action(me.state);

                    delete me.action;
                    delete me.state;

                    me.complete(result);
                } catch (e) {
                    me.fail(new System.AggregateException(null, [System.Exception.create(e)]));
                }
            }, 0);
        },

        runCallbacks: function () {
            var me = this;

            setTimeout(function () {
                for (var i = 0; i < me.callbacks.length; i++) {
                    me.callbacks[i](me);
                }

                delete me.callbacks;
            }, 0);
        },

        complete: function (result) {
            if (this.isCompleted()) {
                return false;
            }

            this.result = result;
            this.status = System.Threading.Tasks.TaskStatus.ranToCompletion;
            this.runCallbacks();

            return true;
        },

        fail: function (error) {
            if (this.isCompleted()) {
                return false;
            }

            this.exception = error;
            this.status = System.Threading.Tasks.TaskStatus.faulted;
            this.runCallbacks();

            return true;
        },

        cancel: function () {
            if (this.isCompleted()) {
                return false;
            }

            this.status = System.Threading.Tasks.TaskStatus.canceled;
            this.runCallbacks();

            return true;
        },

        isCanceled: function () {
            return this.status === System.Threading.Tasks.TaskStatus.canceled;
        },

        isCompleted: function () {
            return this.status === System.Threading.Tasks.TaskStatus.ranToCompletion || this.status === System.Threading.Tasks.TaskStatus.canceled || this.status === System.Threading.Tasks.TaskStatus.faulted;
        },

        isFaulted: function () {
            return this.status === System.Threading.Tasks.TaskStatus.faulted;
        },

        _getResult: function (awaiting) {
            switch (this.status) {
                case System.Threading.Tasks.TaskStatus.ranToCompletion:
                    return this.result;
                case System.Threading.Tasks.TaskStatus.canceled:
                    var ex = new System.Threading.Tasks.TaskCanceledException(null, this);

                    throw awaiting ? ex : new System.AggregateException(null, [ex]);
                case System.Threading.Tasks.TaskStatus.faulted:
                    throw awaiting ? (this.exception.innerExceptions.getCount() > 0 ? this.exception.innerExceptions.get(0) : null) : this.exception;
                default:
                    throw new System.InvalidOperationException("Task is not yet completed.");
            }
        },

        getResult: function () {
            return this._getResult(false);
        },

        dispose: function () {},

        getAwaiter: function () {
            return this;
        },

        getAwaitedResult: function () {
            return this._getResult(true);
        }
    });

    Bridge.define("System.Threading.Tasks.TaskStatus", {
        $kind: "enum",
        $statics: {
            created: 0,
            waitingForActivation: 1,
            waitingToRun: 2,
            running: 3,
            waitingForChildrenToComplete: 4,
            ranToCompletion: 5,
            canceled: 6,
            faulted: 7
        }
    });

    Bridge.define("System.Threading.Tasks.TaskCompletionSource", {
        ctor: function () {
            this.$initialize();
            this.task = new System.Threading.Tasks.Task();
            this.task.status = System.Threading.Tasks.TaskStatus.running;
        },

        setCanceled: function () {
            if (!this.task.cancel()) {
                throw new System.InvalidOperationException("Task was already completed.");
            }
        },

        setResult: function (result) {
            if (!this.task.complete(result)) {
                throw new System.InvalidOperationException("Task was already completed.");
            }
        },

        setException: function (exception) {
            if (!this.trySetException(exception)) {
                throw new System.InvalidOperationException("Task was already completed.");
            }
        },

        trySetCanceled: function () {
            return this.task.cancel();
        },

        trySetResult: function (result) {
            return this.task.complete(result);
        },

        trySetException: function (exception) {
            if (Bridge.is(exception, System.Exception)) {
                exception = [exception];
            }

            return this.task.fail(new System.AggregateException(null, exception));
        }
    });

    Bridge.define("System.Threading.CancellationTokenSource", {
        inherits: [System.IDisposable],

        config: {
            alias: [
                "dispose", "System$IDisposable$dispose"
            ]
        },

        ctor: function (delay) {
            this.$initialize();
            this.timeout = typeof delay === "number" && delay >= 0 ? setTimeout(Bridge.fn.bind(this, this.cancel), delay, -1) : null;
            this.isCancellationRequested = false;
            this.token = new System.Threading.CancellationToken(this);
            this.handlers = [];
        },

        cancel: function (throwFirst) {
            if (this.isCancellationRequested) {
                return;
            }

            this.isCancellationRequested = true;

            var x = [],
                h = this.handlers;

            this.clean();

            for (var i = 0; i < h.length; i++) {
                try {
                    h[i].f(h[i].s);
                } catch (ex) {
                    if (throwFirst && throwFirst !== -1) {
                        throw ex;
                    }

                    x.push(ex);
                }
            }

            if (x.length > 0 && throwFirst !== -1) {
                throw new System.AggregateException(null, x);
            }
        },

        cancelAfter: function (delay) {
            if (this.isCancellationRequested) {
                return;
            }

            if (this.timeout) {
                clearTimeout(this.timeout);
            }

            this.timeout = setTimeout(Bridge.fn.bind(this, this.cancel), delay, -1);
        },

        register: function (f, s) {
            if (this.isCancellationRequested) {
                f(s);

                return new System.Threading.CancellationTokenRegistration();
            } else {
                var o = {
                    f: f,
                    s: s
                };
                this.handlers.push(o);

                return new System.Threading.CancellationTokenRegistration(this, o);
            }
        },

        deregister: function (o) {
            var ix = this.handlers.indexOf(o);

            if (ix >= 0) {
                this.handlers.splice(ix, 1);
            }
        },

        dispose: function () {
            this.clean();
        },

        clean: function () {
            if (this.timeout) {
                clearTimeout(this.timeout);
            }

            this.timeout = null;
            this.handlers = [];

            if (this.links) {
                for (var i = 0; i < this.links.length; i++) {
                    this.links[i].dispose();
                }

                this.links = null;
            }
        },

        statics: {
            createLinked: function () {
                var cts = new System.Threading.CancellationTokenSource();

                cts.links = [];

                var d = Bridge.fn.bind(cts, cts.cancel);

                for (var i = 0; i < arguments.length; i++) {
                    cts.links.push(arguments[i].register(d));
                }

                return cts;
            }
        }
    });

    Bridge.define("System.Threading.CancellationToken", {
         $kind: "struct",

        ctor: function (source) {
            this.$initialize();

            if (!Bridge.is(source, System.Threading.CancellationTokenSource)) {
                source = source ? System.Threading.CancellationToken.sourceTrue : System.Threading.CancellationToken.sourceFalse;
            }

            this.source = source;
        },

        getCanBeCanceled: function () {
            return !this.source.uncancellable;
        },

        getIsCancellationRequested: function () {
            return this.source.isCancellationRequested;
        },

        throwIfCancellationRequested: function () {
            if (this.source.isCancellationRequested) {
                throw new System.OperationCanceledException(this);
            }
        },

        register: function (cb, s) {
            return this.source.register(cb, s);
        },

        getHashCode: function () {
            return Bridge.getHashCode(this.source);
        },

        equals: function (other) {
            return other.source === this.source;
        },

        equalsT: function (other) {
            return other.source === this.source;
        },

        statics: {
            sourceTrue: {
                isCancellationRequested: true,
                register: function (f, s) {
                    f(s);

                    return new System.Threading.CancellationTokenRegistration();
                }
            },
            sourceFalse: {
                uncancellable: true,
                isCancellationRequested: false,
                register: function () {
                    return new System.Threading.CancellationTokenRegistration();
                }
            },
            getDefaultValue: function () {
                return new System.Threading.CancellationToken();
            }
        }
    });

    System.Threading.CancellationToken.none = new System.Threading.CancellationToken();

    Bridge.define("System.Threading.CancellationTokenRegistration", {
        inherits: function () {
            return [System.IDisposable, System.IEquatable$1(System.Threading.CancellationTokenRegistration)];
        },

        $kind: "struct",

        config: {
            alias: [
                "dispose", "System$IDisposable$dispose"
            ]
        },

        ctor: function (cts, o) {
            this.$initialize();
            this.cts = cts;
            this.o = o;
        },

        dispose: function () {
            if (this.cts) {
                this.cts.deregister(this.o);
                this.cts = this.o = null;
            }
        },

        equalsT: function (o) {
            return this === o;
        },

        equals: function (o) {
            return this === o;
        },

        statics: {
            getDefaultValue: function () {
                return new System.Threading.CancellationTokenRegistration();
            }
        }
    });
    // @source Validation.js

    var validation = {
        isNull: function (value) {
            return !Bridge.isDefined(value, true);
        },

        isEmpty: function (value) {
            return value == null || value.length === 0 || Bridge.is(value, System.Collections.ICollection) ? value.getCount() === 0 : false;
        },

        isNotEmptyOrWhitespace: function (value) {
            return Bridge.isDefined(value, true) && !(/^$|\s+/.test(value));
        },

        isNotNull: function (value) {
            return Bridge.isDefined(value, true);
        },

        isNotEmpty: function (value) {
            return !Bridge.Validation.isEmpty(value);
        },

        email: function (value) {
            var re = /^(")?(?:[^\."])(?:(?:[\.])?(?:[\w\-!#$%&'*+/=?^_`{|}~]))*\1@(\w[\-\w]*\.){1,5}([A-Za-z]){2,6}$/;

            return re.test(value);
        },

        url: function (value) {
            var re = /(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:\.\d{1,3}){3})(?!(?:\.\d{1,3}){2})(?!\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/;
            return re.test(value);
        },

        alpha: function (value) {
            var re = /^[a-zA-Z_]+$/;

            return re.test(value);
        },

        alphaNum: function (value) {
            var re = /^[a-zA-Z_]+$/;

            return re.test(value);
        },

        creditCard: function (value, type) {
            var re,
                checksum,
                i,
                digit,
                notype = false;

            if (type === "Visa") {
                // Visa: length 16, prefix 4, dashes optional.
                re = /^4\d{3}[- ]?\d{4}[- ]?\d{4}[- ]?\d{4}$/;
            } else if (type === "MasterCard") {
                // Mastercard: length 16, prefix 51-55, dashes optional.
                re = /^5[1-5]\d{2}[- ]?\d{4}[- ]?\d{4}[- ]?\d{4}$/;
            } else if (type === "Discover") {
                // Discover: length 16, prefix 6011, dashes optional.
                re = /^6011[- ]?\d{4}[- ]?\d{4}[- ]?\d{4}$/;
            } else if (type === "AmericanExpress") {
                // American Express: length 15, prefix 34 or 37.
                re = /^3[4,7]\d{13}$/;
            } else if (type === "DinersClub") {
                // Diners: length 14, prefix 30, 36, or 38.
                re = /^(3[0,6,8]\d{12})|(5[45]\d{14})$/;
            } else {
                // Basing min and max length on
                // http://developer.ean.com/general_info/Valid_Credit_Card_Types
                if (!value || value.length < 13 || value.length > 19) {
                    return false;
                }

                re = /[^0-9 \-]+/;
                notype = true;
            }

            if (!re.test(value)) {
                return false;
            }

            // Remove all dashes for the checksum checks to eliminate negative numbers
            value = value.split(notype ? "-" : /[- ]/).join("");

            // Checksum ("Mod 10")
            // Add even digits in even length strings or odd digits in odd length strings.
            checksum = 0;

            for (i = (2 - (value.length % 2)); i <= value.length; i += 2) {
                checksum += parseInt(value.charAt(i - 1));
            }

            // Analyze odd digits in even length strings or even digits in odd length strings.
            for (i = (value.length % 2) + 1; i < value.length; i += 2) {
                digit = parseInt(value.charAt(i - 1)) * 2;

                if (digit < 10) {
                    checksum += digit;
                } else {
                    checksum += (digit - 9);
                }
            }

            return (checksum % 10) === 0;
        }
    };

    Bridge.Validation = validation;

    // @source version.js

    Bridge.define("System.Version", {
        inherits: function () { return [System.ICloneable,System.IComparable$1(System.Version),System.IEquatable$1(System.Version)]; },
        statics: {
            separatorsArray: ".",
            ZERO_CHAR_VALUE: 48,
            appendPositiveNumber: function (num, sb) {
                var index = sb.getLength();
                var reminder;

                do {
                    reminder = num % 10;
                    num = (Bridge.Int.div(num, 10)) | 0;
                    sb.insert(index, String.fromCharCode(((((System.Version.ZERO_CHAR_VALUE + reminder) | 0)) & 65535)));
                } while (num > 0);
            },
            parse: function (input) {
                if (input == null) {
                    throw new System.ArgumentNullException("input");
                }

                var r = { v : new System.Version.VersionResult() };
                r.v.init("input", true);
                if (!System.Version.tryParseVersion(input, r)) {
                    throw r.v.getVersionParseException();
                }
                return r.v.m_parsedVersion;
            },
            tryParse: function (input, result) {
                var r = { v : new System.Version.VersionResult() };
                r.v.init("input", false);
                var b = System.Version.tryParseVersion(input, r);
                result.v = r.v.m_parsedVersion;
                return b;
            },
            tryParseVersion: function (version, result) {
                var major = { }, minor = { }, build = { }, revision = { };

                if (version == null) {
                    result.v.setFailure(System.Version.ParseFailureKind.ArgumentNullException);
                    return false;
                }

                var parsedComponents = version.split(System.Version.separatorsArray);
                var parsedComponentsLength = parsedComponents.length;
                if ((parsedComponentsLength < 2) || (parsedComponentsLength > 4)) {
                    result.v.setFailure(System.Version.ParseFailureKind.ArgumentException);
                    return false;
                }

                if (!System.Version.tryParseComponent(parsedComponents[0], "version", result, major)) {
                    return false;
                }

                if (!System.Version.tryParseComponent(parsedComponents[1], "version", result, minor)) {
                    return false;
                }

                parsedComponentsLength = (parsedComponentsLength - 2) | 0;

                if (parsedComponentsLength > 0) {
                    if (!System.Version.tryParseComponent(parsedComponents[2], "build", result, build)) {
                        return false;
                    }

                    parsedComponentsLength = (parsedComponentsLength - 1) | 0;

                    if (parsedComponentsLength > 0) {
                        if (!System.Version.tryParseComponent(parsedComponents[3], "revision", result, revision)) {
                            return false;
                        } else {
                            result.v.m_parsedVersion = new System.Version.$ctor3(major.v, minor.v, build.v, revision.v);
                        }
                    } else {
                        result.v.m_parsedVersion = new System.Version.$ctor2(major.v, minor.v, build.v);
                    }
                } else {
                    result.v.m_parsedVersion = new System.Version.$ctor1(major.v, minor.v);
                }

                return true;
            },
            tryParseComponent: function (component, componentName, result, parsedComponent) {
                if (!System.Int32.tryParse(component, parsedComponent)) {
                    result.v.setFailure$1(System.Version.ParseFailureKind.FormatException, component);
                    return false;
                }

                if (parsedComponent.v < 0) {
                    result.v.setFailure$1(System.Version.ParseFailureKind.ArgumentOutOfRangeException, componentName);
                    return false;
                }

                return true;
            },
            op_Equality: function (v1, v2) {
                if (Bridge.referenceEquals(v1, null)) {
                    return Bridge.referenceEquals(v2, null);
                }

                return v1.equalsT(v2);
            },
            op_Inequality: function (v1, v2) {
                return !(System.Version.op_Equality(v1, v2));
            },
            op_LessThan: function (v1, v2) {
                if (v1 == null) {
                    throw new System.ArgumentNullException("v1");
                }

                return (v1.compareTo(v2) < 0);
            },
            op_LessThanOrEqual: function (v1, v2) {
                if (v1 == null) {
                    throw new System.ArgumentNullException("v1");
                }

                return (v1.compareTo(v2) <= 0);
            },
            op_GreaterThan: function (v1, v2) {
                return (System.Version.op_LessThan(v2, v1));
            },
            op_GreaterThanOrEqual: function (v1, v2) {
                return (System.Version.op_LessThanOrEqual(v2, v1));
            }
        },
        _Major: 0,
        _Minor: 0,
        _Build: -1,
        _Revision: -1,
        config: {
            alias: [
            "clone", "System$ICloneable$clone",
            "compareTo", "System$IComparable$1$System$Version$compareTo",
            "equalsT", "System$IEquatable$1$System$Version$equalsT"
            ]
        },
        $ctor3: function (major, minor, build, revision) {
            this.$initialize();
            if (major < 0) {
                throw new System.ArgumentOutOfRangeException("major", "Cannot be < 0");
            }

            if (minor < 0) {
                throw new System.ArgumentOutOfRangeException("minor", "Cannot be < 0");
            }

            if (build < 0) {
                throw new System.ArgumentOutOfRangeException("build", "Cannot be < 0");
            }

            if (revision < 0) {
                throw new System.ArgumentOutOfRangeException("revision", "Cannot be < 0");
            }

            this._Major = major;
            this._Minor = minor;
            this._Build = build;
            this._Revision = revision;
        },
        $ctor2: function (major, minor, build) {
            this.$initialize();
            if (major < 0) {
                throw new System.ArgumentOutOfRangeException("major", "Cannot be < 0");
            }

            if (minor < 0) {
                throw new System.ArgumentOutOfRangeException("minor", "Cannot be < 0");
            }

            if (build < 0) {
                throw new System.ArgumentOutOfRangeException("build", "Cannot be < 0");
            }

            this._Major = major;
            this._Minor = minor;
            this._Build = build;
        },
        $ctor1: function (major, minor) {
            this.$initialize();
            if (major < 0) {
                throw new System.ArgumentOutOfRangeException("major", "Cannot be < 0");
            }

            if (minor < 0) {
                throw new System.ArgumentOutOfRangeException("minor", "Cannot be < 0");
            }

            this._Major = major;
            this._Minor = minor;
        },
        $ctor4: function (version) {
            this.$initialize();
            var v = System.Version.parse(version);
            this._Major = v.getMajor();
            this._Minor = v.getMinor();
            this._Build = v.getBuild();
            this._Revision = v.getRevision();
        },
        ctor: function () {
            this.$initialize();
            this._Major = 0;
            this._Minor = 0;
        },
        getMajor: function () {
            return this._Major;
        },
        getMinor: function () {
            return this._Minor;
        },
        getBuild: function () {
            return this._Build;
        },
        getRevision: function () {
            return this._Revision;
        },
        getMajorRevision: function () {
            return Bridge.Int.sxs((this._Revision >> 16) & 65535);
        },
        getMinorRevision: function () {
            return Bridge.Int.sxs((this._Revision & 65535) & 65535);
        },
        clone: function () {
            var v = new System.Version.ctor();
            v._Major = this._Major;
            v._Minor = this._Minor;
            v._Build = this._Build;
            v._Revision = this._Revision;
            return (v);
        },
        compareTo$1: function (version) {
            if (version == null) {
                return 1;
            }

            var v = Bridge.as(version, System.Version);
            if (System.Version.op_Equality(v, null)) {
                throw new System.ArgumentException("version should be of System.Version type");
            }

            if (this._Major !== v._Major) {
                if (this._Major > v._Major) {
                    return 1;
                } else {
                    return -1;
                }
            }

            if (this._Minor !== v._Minor) {
                if (this._Minor > v._Minor) {
                    return 1;
                } else {
                    return -1;
                }
            }

            if (this._Build !== v._Build) {
                if (this._Build > v._Build) {
                    return 1;
                } else {
                    return -1;
                }
            }

            if (this._Revision !== v._Revision) {
                if (this._Revision > v._Revision) {
                    return 1;
                } else {
                    return -1;
                }
            }

            return 0;
        },
        compareTo: function (value) {
            if (System.Version.op_Equality(value, null)) {
                return 1;
            }

            if (this._Major !== value._Major) {
                if (this._Major > value._Major) {
                    return 1;
                } else {
                    return -1;
                }
            }

            if (this._Minor !== value._Minor) {
                if (this._Minor > value._Minor) {
                    return 1;
                } else {
                    return -1;
                }
            }

            if (this._Build !== value._Build) {
                if (this._Build > value._Build) {
                    return 1;
                } else {
                    return -1;
                }
            }

            if (this._Revision !== value._Revision) {
                if (this._Revision > value._Revision) {
                    return 1;
                } else {
                    return -1;
                }
            }

            return 0;
        },
        equals: function (obj) {
            return this.equalsT(Bridge.as(obj, System.Version));
        },
        equalsT: function (obj) {
            if (System.Version.op_Equality(obj, null)) {
                return false;
            }

            // check that major, minor, build & revision numbers match
            if ((this._Major !== obj._Major) || (this._Minor !== obj._Minor) || (this._Build !== obj._Build) || (this._Revision !== obj._Revision)) {
                return false;
            }

            return true;
        },
        getHashCode: function () {
            // Let's assume that most version numbers will be pretty small and just
            // OR some lower order bits together.

            var accumulator = 0;

            accumulator = accumulator | ((this._Major & 15) << 28);
            accumulator = accumulator | ((this._Minor & 255) << 20);
            accumulator = accumulator | ((this._Build & 255) << 12);
            accumulator = accumulator | (this._Revision & 4095);

            return accumulator;
        },
        toString: function () {
            if (this._Build === -1) {
                return (this.toString$1(2));
            }
            if (this._Revision === -1) {
                return (this.toString$1(3));
            }
            return (this.toString$1(4));
        },
        toString$1: function (fieldCount) {
            var sb;
            switch (fieldCount) {
                case 0: 
                    return ("");
                case 1: 
                    return (this._Major.toString());
                case 2: 
                    sb = new System.Text.StringBuilder();
                    System.Version.appendPositiveNumber(this._Major, sb);
                    sb.append(String.fromCharCode(46));
                    System.Version.appendPositiveNumber(this._Minor, sb);
                    return sb.toString();
                default: 
                    if (this._Build === -1) {
                        throw new System.ArgumentException("Build should be > 0 if fieldCount > 2", "fieldCount");
                    }
                    if (fieldCount === 3) {
                        sb = new System.Text.StringBuilder();
                        System.Version.appendPositiveNumber(this._Major, sb);
                        sb.append(String.fromCharCode(46));
                        System.Version.appendPositiveNumber(this._Minor, sb);
                        sb.append(String.fromCharCode(46));
                        System.Version.appendPositiveNumber(this._Build, sb);
                        return sb.toString();
                    }
                    if (this._Revision === -1) {
                        throw new System.ArgumentException("Revision should be > 0 if fieldCount > 3", "fieldCount");
                    }
                    if (fieldCount === 4) {
                        sb = new System.Text.StringBuilder();
                        System.Version.appendPositiveNumber(this._Major, sb);
                        sb.append(String.fromCharCode(46));
                        System.Version.appendPositiveNumber(this._Minor, sb);
                        sb.append(String.fromCharCode(46));
                        System.Version.appendPositiveNumber(this._Build, sb);
                        sb.append(String.fromCharCode(46));
                        System.Version.appendPositiveNumber(this._Revision, sb);
                        return sb.toString();
                    }
                    throw new System.ArgumentException("Should be < 5", "fieldCount");
            }
        }
    });

    // @source parseFailureKind.js

    Bridge.define("System.Version.ParseFailureKind", {
        $kind: "enum",
        statics: {
            ArgumentNullException: 0,
            ArgumentException: 1,
            ArgumentOutOfRangeException: 2,
            FormatException: 3
        }
    });

    // @source versionResult.js

    Bridge.define("System.Version.VersionResult", {
        $kind: "struct",
        statics: {
            getDefaultValue: function () { return new System.Version.VersionResult(); }
        },
        m_parsedVersion: null,
        m_failure: 0,
        m_exceptionArgument: null,
        m_argumentName: null,
        m_canThrow: false,
        ctor: function () {
            this.$initialize();
        },
        init: function (argumentName, canThrow) {
            this.m_canThrow = canThrow;
            this.m_argumentName = argumentName;
        },
        setFailure: function (failure) {
            this.setFailure$1(failure, "");
        },
        setFailure$1: function (failure, argument) {
            this.m_failure = failure;
            this.m_exceptionArgument = argument;
            if (this.m_canThrow) {
                throw this.getVersionParseException();
            }
        },
        getVersionParseException: function () {
            switch (this.m_failure) {
                case System.Version.ParseFailureKind.ArgumentNullException: 
                    return new System.ArgumentNullException(this.m_argumentName);
                case System.Version.ParseFailureKind.ArgumentException: 
                    return new System.ArgumentException("VersionString");
                case System.Version.ParseFailureKind.ArgumentOutOfRangeException: 
                    return new System.ArgumentOutOfRangeException(this.m_exceptionArgument, "Cannot be < 0");
                case System.Version.ParseFailureKind.FormatException: 
                    // Regenerate the FormatException as would be thrown by Int32.Parse()
                    try {
                        System.Int32.parse(this.m_exceptionArgument);
                    }
                    catch ($e1) {
                        $e1 = System.Exception.create($e1);
                        var e;
                        if (Bridge.is($e1, System.FormatException)) {
                            e = $e1;
                            return e;
                        } else if (Bridge.is($e1, System.OverflowException)) {
                            e = $e1;
                            return e;
                        } else {
                            throw $e1;
                        }
                    }
                    return new System.FormatException("InvalidString");
                default: 
                    return new System.ArgumentException("VersionString");
            }
        },
        getHashCode: function () {
            var h = Bridge.addHash([5139482776, this.m_parsedVersion, this.m_failure, this.m_exceptionArgument, this.m_argumentName, this.m_canThrow]);
            return h;
        },
        equals: function (o) {
            if (!Bridge.is(o, System.Version.VersionResult)) {
                return false;
            }
            return Bridge.equals(this.m_parsedVersion, o.m_parsedVersion) && Bridge.equals(this.m_failure, o.m_failure) && Bridge.equals(this.m_exceptionArgument, o.m_exceptionArgument) && Bridge.equals(this.m_argumentName, o.m_argumentName) && Bridge.equals(this.m_canThrow, o.m_canThrow);
        },
        $clone: function (to) {
            var s = to || new System.Version.VersionResult();
            s.m_parsedVersion = this.m_parsedVersion;
            s.m_failure = this.m_failure;
            s.m_exceptionArgument = this.m_exceptionArgument;
            s.m_argumentName = this.m_argumentName;
            s.m_canThrow = this.m_canThrow;
            return s;
        }
    });

    // @source Attribute.js

    Bridge.define("System.Attribute", {
        statics: {
            getCustomAttributes: function (o, t, b) {
                if (o == null) {
                    throw new System.ArgumentNullException("element");
                }

                if (t == null)
                {
                    throw new System.ArgumentNullException("attributeType");
                }

                var r = o.at || [];

                if (!t) {
                    return r;
                }

                return r.filter(function (a) { return Bridge.is(a, t); });
            },

            getCustomAttributes$1: function (a, t, b) {
                if (a == null) {
                    throw new System.ArgumentNullException("element");
                }

                if (t == null)
                {
                    throw new System. ArgumentNullException("attributeType");
                }

                return a.getCustomAttributes(t || b);
            }
        }
    });

    // @source INotifyPropertyChanged.js

    Bridge.define("System.ComponentModel.INotifyPropertyChanged", {
        $kind: "interface",
    });

    Bridge.define("System.ComponentModel.PropertyChangedEventArgs", {
        ctor: function (propertyName, newValue, oldValue) {
            this.$initialize();
            this.propertyName = propertyName;
            this.newValue = newValue;
            this.oldValue = oldValue;
        }
    });

    // @source Convert.js

    var scope = {};

    scope.convert = {
        typeCodes: {
            Empty: 0,
            Object: 1,
            DBNull: 2,
            Boolean: 3,
            Char: 4,
            SByte: 5,
            Byte: 6,
            Int16: 7,
            UInt16: 8,
            Int32: 9,
            UInt32: 10,
            Int64: 11,
            UInt64: 12,
            Single: 13,
            Double: 14,
            Decimal: 15,
            DateTime: 16,
            String: 18
        },

        toBoolean: function (value, formatProvider) {
            switch (typeof (value)) {
                case "boolean":
                    return value;

                case "number":
                    return value !== 0; // non-zero int/float value is always converted to True;

                case "string":
                    var lowCaseVal = value.toLowerCase().trim();

                    if (lowCaseVal === "true") {
                        return true;
                    } else if (lowCaseVal === "false") {
                        return false;
                    } else {
                        throw new System.FormatException("String was not recognized as a valid Boolean.");
                    }

                case "object":
                    if (value == null) {
                        return false;
                    }

                    if (value instanceof System.Decimal) {
                        return !value.isZero();
                    }

                    if (System.Int64.is64Bit(value)) {
                        return value.ne(0);
                    }

                    break;
            }

            // TODO: #822 When IConvertible is implemented, try it before throwing InvalidCastEx
            var typeCode = scope.internal.suggestTypeCode(value);
            scope.internal.throwInvalidCastEx(typeCode, scope.convert.typeCodes.Boolean);

            // try converting using IConvertible
            return scope.convert.convertToType(scope.convert.typeCodes.Boolean, value, formatProvider || null);
        },

        toChar: function (value, formatProvider, valueTypeCode) {
            var typeCodes = scope.convert.typeCodes;

            if (value instanceof System.Decimal) {
                value = value.toFloat();
            }

            if (value instanceof System.Int64 || value instanceof System.UInt64) {
                value = value.toNumber();
            }

            var type = typeof (value);

            valueTypeCode = valueTypeCode || scope.internal.suggestTypeCode(value);

            if (valueTypeCode === typeCodes.String && value == null) {
                type = "string";
            }

            if (valueTypeCode !== typeCodes.Object) {
                switch (type) {
                    case "boolean":
                        scope.internal.throwInvalidCastEx(typeCodes.Boolean, typeCodes.Char);

                    case "number":
                        var isFloatingType = scope.internal.isFloatingType(valueTypeCode);

                        if (isFloatingType || value % 1 !== 0) {
                            scope.internal.throwInvalidCastEx(valueTypeCode, typeCodes.Char);
                        }

                        scope.internal.validateNumberRange(value, typeCodes.Char, true);

                        return value;

                    case "string":
                        if (value == null) {
                            throw new System.ArgumentNullException("value");
                        }

                        if (value.length !== 1) {
                            throw new System.FormatException("String must be exactly one character long.");
                        }

                        return value.charCodeAt(0);
                }
            }

            if (valueTypeCode === typeCodes.Object || type === "object") {
                if (value == null) {
                    return 0;
                }

                if (Bridge.isDate(value)) {
                    scope.internal.throwInvalidCastEx(typeCodes.DateTime, typeCodes.Char);
                }
            }

            // TODO: #822 When IConvertible is implemented, try it before throwing InvalidCastEx
            scope.internal.throwInvalidCastEx(valueTypeCode, scope.convert.typeCodes.Char);

            // try converting using IConvertible
            return scope.convert.convertToType(typeCodes.Char, value, formatProvider || null);
        },

        toSByte: function (value, formatProvider, valueTypeCode) {
            return scope.internal.toNumber(value, formatProvider || null, scope.convert.typeCodes.SByte, valueTypeCode || null);
        },

        toByte: function (value, formatProvider) {
            return scope.internal.toNumber(value, formatProvider || null, scope.convert.typeCodes.Byte);
        },

        toInt16: function (value, formatProvider) {
            return scope.internal.toNumber(value, formatProvider || null, scope.convert.typeCodes.Int16);
        },

        toUInt16: function (value, formatProvider) {
            return scope.internal.toNumber(value, formatProvider || null, scope.convert.typeCodes.UInt16);
        },

        toInt32: function (value, formatProvider) {
            return scope.internal.toNumber(value, formatProvider || null, scope.convert.typeCodes.Int32);
        },

        toUInt32: function (value, formatProvider) {
            return scope.internal.toNumber(value, formatProvider || null, scope.convert.typeCodes.UInt32);
        },

        toInt64: function (value, formatProvider) {
            var result = scope.internal.toNumber(value, formatProvider || null, scope.convert.typeCodes.Int64);
            return new System.Int64(result);
        },

        toUInt64: function (value, formatProvider) {
            var result = scope.internal.toNumber(value, formatProvider || null, scope.convert.typeCodes.UInt64);
            return new System.UInt64(result);
        },

        toSingle: function (value, formatProvider) {
            return scope.internal.toNumber(value, formatProvider || null, scope.convert.typeCodes.Single);
        },

        toDouble: function (value, formatProvider) {
            return scope.internal.toNumber(value, formatProvider || null, scope.convert.typeCodes.Double);
        },

        toDecimal: function (value, formatProvider) {
            if (value instanceof System.Decimal) {
                return value;
            }

            return new System.Decimal(scope.internal.toNumber(value, formatProvider || null, scope.convert.typeCodes.Decimal));
        },

        toDateTime: function (value, formatProvider) {
            var typeCodes = scope.convert.typeCodes;

            switch (typeof (value)) {
                case "boolean":
                    scope.internal.throwInvalidCastEx(typeCodes.Boolean, typeCodes.DateTime);

                case "number":
                    var fromType = scope.internal.suggestTypeCode(value);
                    scope.internal.throwInvalidCastEx(fromType, typeCodes.DateTime);

                case "string":
                    value = Bridge.Date.parse(value, formatProvider || null);

                    return value;

                case "object":
                    if (value == null) {
                        return scope.internal.getMinValue(typeCodes.DateTime);
                    }

                    if (Bridge.isDate(value)) {
                        return value;
                    }

                    if (value instanceof System.Decimal) {
                        scope.internal.throwInvalidCastEx(typeCodes.Decimal, typeCodes.DateTime);
                    }

                    if (value instanceof System.Int64) {
                        scope.internal.throwInvalidCastEx(typeCodes.Int64, typeCodes.DateTime);
                    }

                    if (value instanceof System.UInt64) {
                        scope.internal.throwInvalidCastEx(typeCodes.UInt64, typeCodes.DateTime);
                    }

                    break;
            }

            // TODO: #822 When IConvertible is implemented, try it before throwing InvalidCastEx
            var valueTypeCode = scope.internal.suggestTypeCode(value);

            scope.internal.throwInvalidCastEx(valueTypeCode, scope.convert.typeCodes.DateTime);

            // try converting using IConvertible
            return scope.convert.convertToType(typeCodes.DateTime, value, formatProvider || null);
        },

        toString: function (value, formatProvider, valueTypeCode) {
            var typeCodes = scope.convert.typeCodes,
                type = typeof (value);

            switch (type) {
                case "boolean":
                    return value ? "True" : "False";

                case "number":
                    if ((valueTypeCode || null) === typeCodes.Char) {
                        return String.fromCharCode(value);
                    }

                    if (isNaN(value)) {
                        return "NaN";
                    }

                    if (value % 1 !== 0) {
                        value = parseFloat(value.toPrecision(15));
                    }

                    return value.toString();

                case "string":
                    return value;

                case "object":
                    if (value == null) {
                        return "";
                    }

                    if (Bridge.isDate(value)) {
                        return Bridge.Date.format(value, null, formatProvider || null);
                    }

                    if (value instanceof System.Decimal) {
                        if (value.isInteger()) {
                            return value.toFixed(0, 4);
                        }
                        return value.toPrecision(value.precision());
                    }

                    if (System.Int64.is64Bit(value)) {
                        return value.toString();
                    }

                    if (value.format) {
                        return value.format(null, formatProvider || null);
                    }

                    var typeName = Bridge.getTypeName(value);

                    return typeName;
            }

            // try converting using IConvertible
            return scope.convert.convertToType(scope.convert.typeCodes.String, value, formatProvider || null);
        },

        toNumberInBase: function (str, fromBase, typeCode) {
            if (fromBase !== 2 && fromBase !== 8 && fromBase !== 10 && fromBase !== 16) {
                throw new System.ArgumentException("Invalid Base.");
            }

            var typeCodes = scope.convert.typeCodes;

            if (str == null) {
                if (typeCode === typeCodes.Int64) {
                    return System.Int64.Zero;
                }

                if (typeCode === typeCodes.UInt64) {
                    return System.UInt64.Zero;
                }

                return 0;
            }

            if (str.length === 0) {
                throw new System.ArgumentOutOfRangeException("Index was out of range. Must be non-negative and less than the size of the collection.");
            }

            // Let's process the string in lower case.
            str = str.toLowerCase();

            var minValue = scope.internal.getMinValue(typeCode),
                maxValue = scope.internal.getMaxValue(typeCode);

            // Calculate offset (start index)
            var isNegative = false,
                startIndex = 0;

            if (str[startIndex] === "-") {
                if (fromBase !== 10) {
                    throw new System.ArgumentException("String cannot contain a minus sign if the base is not 10.");
                }

                if (minValue >= 0) {
                    throw new System.OverflowException("The string was being parsed as an unsigned number and could not have a negative sign.");
                }

                isNegative = true;
                ++startIndex;
            } else if (str[startIndex] === "+") {
                ++startIndex;
            }

            if (fromBase === 16 && str.length >= 2 && str[startIndex] === "0" && str[startIndex + 1] === "x") {
                startIndex += 2;
            }

            // Fill allowed codes for the specified base:
            var allowedCodes;

            if (fromBase === 2) {
                allowedCodes = scope.internal.charsToCodes("01");
            } else if (fromBase === 8) {
                allowedCodes = scope.internal.charsToCodes("01234567");
            } else if (fromBase === 10) {
                allowedCodes = scope.internal.charsToCodes("0123456789");
            } else if (fromBase === 16) {
                allowedCodes = scope.internal.charsToCodes("0123456789abcdef");
            } else {
                throw new System.ArgumentException("Invalid Base.");
            }

            // Create charCode-to-Value map
            var codeValues = {};

            for (var i = 0; i < allowedCodes.length; i++) {
                var allowedCode = allowedCodes[i];

                codeValues[allowedCode] = i;
            }

            var firstAllowed = allowedCodes[0],
                lastAllowed = allowedCodes[allowedCodes.length - 1],
                res,
                totalMax,
                code,
                j;

            if (typeCode === typeCodes.Int64 || typeCode === typeCodes.UInt64) {
                for (j = startIndex; j < str.length; j++) {
                    code = str[j].charCodeAt(0);

                    if (!(code >= firstAllowed && code <= lastAllowed)) {
                        if (j === startIndex) {
                            throw new System.FormatException("Could not find any recognizable digits.");
                        } else {
                            throw new System.FormatException("Additional non-parsable characters are at the end of the string.");
                        }
                    }
                }

                var isSign = typeCode === typeCodes.Int64;

                if (isSign) {
                    res = new System.Int64(Bridge.$Long.fromString(str, false, fromBase));
                } else {
                    res = new System.UInt64(Bridge.$Long.fromString(str, true, fromBase));
                }

                if (res.toString(fromBase) !== str) {
                    throw new System.OverflowException("Value was either too large or too small.");
                }

                return res;
            } else {
                // Parse the number:
                res = 0;
                totalMax = maxValue - minValue + 1;

                for (j = startIndex; j < str.length; j++) {
                    code = str[j].charCodeAt(0);

                    if (code >= firstAllowed && code <= lastAllowed) {
                        res *= fromBase;
                        res += codeValues[code];

                        if (res > scope.internal.typeRanges.Int64_MaxValue) {
                            throw new System.OverflowException("Value was either too large or too small.");
                        }
                    } else {
                        if (j === startIndex) {
                            throw new System.FormatException("Could not find any recognizable digits.");
                        } else {
                            throw new System.FormatException("Additional non-parsable characters are at the end of the string.");
                        }
                    }
                }

                if (isNegative) {
                    res *= -1;
                }

                if (res > maxValue && fromBase !== 10 && minValue < 0) {
                    // Assume that the value is negative, transform it:
                    res = res - totalMax;
                }

                if (res < minValue || res > maxValue) {
                    throw new System.OverflowException("Value was either too large or too small.");
                }

                return res;
            }
        },

        toStringInBase: function (value, toBase, typeCode) {
            var typeCodes = scope.convert.typeCodes;

            if (toBase !== 2 && toBase !== 8 && toBase !== 10 && toBase !== 16) {
                throw new System.ArgumentException("Invalid Base.");
            }

            var minValue = scope.internal.getMinValue(typeCode),
                maxValue = scope.internal.getMaxValue(typeCode),
                special = System.Int64.is64Bit(value);

            if (special) {
                if (value.lt(minValue) || value.gt(maxValue)) {
                    throw new System.OverflowException("Value was either too large or too small for an unsigned byte.");
                }
            } else if (value < minValue || value > maxValue) {
                throw new System.OverflowException("Value was either too large or too small for an unsigned byte.");
            }

            // Handle negative numbers:
            var isNegative = false;

            if (special) {
                if (toBase === 10) {
                    return value.toString();
                } else {
                    return value.value.toUnsigned().toString(toBase);
                }
            } else if (value < 0) {
                if (toBase === 10) {
                    isNegative = true;
                    value *= -1;
                } else {
                    value = (maxValue + 1 - minValue) + value;
                }
            }

            // Fill allowed codes for the specified base:
            var allowedChars;

            if (toBase === 2) {
                allowedChars = "01";
            } else if (toBase === 8) {
                allowedChars = "01234567";
            } else if (toBase === 10) {
                allowedChars = "0123456789";
            } else if (toBase === 16) {
                allowedChars = "0123456789abcdef";
            } else {
                throw new System.ArgumentException("Invalid Base.");
            }

            // Fill Value-To-Char map:
            var charByValues = {},
                allowedCharArr = allowedChars.split(""),
                allowedChar;

            for (var i = 0; i < allowedCharArr.length; i++) {
                allowedChar = allowedCharArr[i];

                charByValues[i] = allowedChar;
            }

            // Parse the number:
            var res = "";

            if (value === 0 || (special && value.eq(0))) {
                res = "0";
            } else {
                var mod, char;

                if (special) {
                    while (value.gt(0)) {
                        mod = value.mod(toBase);
                        value = value.sub(mod).div(toBase);

                        char = charByValues[mod.toNumber()];
                        res += char;
                    }
                } else {
                    while (value > 0) {
                        mod = value % toBase;
                        value = (value - mod) / toBase;

                        char = charByValues[mod];
                        res += char;
                    }
                }
            }

            if (isNegative) {
                res += "-";
            }

            res = res.split("").reverse().join("");

            return res;
        },

        toBase64String: function (inArray, offset, length, options) {
            if (inArray == null) {
                throw new System.ArgumentNullException("inArray");
            }

            offset = offset || 0;
            length = length != null ? length : inArray.length;
            options = options || 0; // 0 - means "None", 1 - stands for "InsertLineBreaks"

            if (length < 0) {
                throw new System.ArgumentOutOfRangeException("length", "Index was out of range. Must be non-negative and less than the size of the collection.");
            }

            if (offset < 0) {
                throw new System.ArgumentOutOfRangeException("offset", "Value must be positive.");
            }

            if (options < 0 || options > 1) {
                throw new System.ArgumentException("Illegal enum value.");
            }

            var inArrayLength = inArray.length;

            if (offset > (inArrayLength - length)) {
                throw new System.ArgumentOutOfRangeException("offset", "Offset and length must refer to a position in the string.");
            }

            if (inArrayLength === 0) {
                return "";
            }

            var insertLineBreaks = (options === 1),
                strArrayLen = scope.internal.toBase64_CalculateAndValidateOutputLength(length, insertLineBreaks);

            var strArray = [];
            strArray.length = strArrayLen;

            scope.internal.convertToBase64Array(strArray, inArray, offset, length, insertLineBreaks);

            var str = strArray.join("");

            return str;
        },

        toBase64CharArray: function (inArray, offsetIn, length, outArray, offsetOut, options) {
            if (inArray == null) {
                throw new System.ArgumentNullException("inArray");
            }

            if (outArray == null) {
                throw new System.ArgumentNullException("outArray");
            }

            if (length < 0) {
                throw new System.ArgumentOutOfRangeException("length", "Index was out of range. Must be non-negative and less than the size of the collection.");
            }

            if (offsetIn < 0) {
                throw new System.ArgumentOutOfRangeException("offsetIn", "Value must be positive.");
            }

            if (offsetOut < 0) {
                throw new System.ArgumentOutOfRangeException("offsetOut", "Value must be positive.");
            }

            options = options || 0; // 0 - means "None", 1 - stands for "InsertLineBreaks"

            if (options < 0 || options > 1) {
                throw new System.ArgumentException("Illegal enum value.");
            }
            var inArrayLength = inArray.length;

            if (offsetIn > inArrayLength - length) {
                throw new System.ArgumentOutOfRangeException("offsetIn", "Offset and length must refer to a position in the string.");
            }

            if (inArrayLength === 0) {
                return 0;
            }

            var insertLineBreaks = options === 1,
                outArrayLength = outArray.length; //This is the maximally required length that must be available in the char array

            // Length of the char buffer required
            var numElementsToCopy = scope.internal.toBase64_CalculateAndValidateOutputLength(length, insertLineBreaks);

            if (offsetOut > (outArrayLength - numElementsToCopy)) {
                throw new System.ArgumentOutOfRangeException("offsetOut", "Either offset did not refer to a position in the string, or there is an insufficient length of destination character array.");
            }

            var charsArr = [],
                charsArrLength = scope.internal.convertToBase64Array(charsArr, inArray, offsetIn, length, insertLineBreaks);

            scope.internal.charsToCodes(charsArr, outArray, offsetOut);

            return charsArrLength;
        },

        fromBase64String: function (s) {
            // "s" is an unfortunate parameter name, but we need to keep it for backward compat.

            if (s == null) {
                throw new System.ArgumentNullException("s");
            }

            var sChars = s.split(""),
                bytes = scope.internal.fromBase64CharPtr(sChars, 0, sChars.length);

            return bytes;
        },

        fromBase64CharArray: function (inArray, offset, length) {
            if (inArray == null) {
                throw new System.ArgumentNullException("inArray");
            }

            if (length < 0) {
                throw new System.ArgumentOutOfRangeException("length", "Index was out of range. Must be non-negative and less than the size of the collection.");
            }

            if (offset < 0) {
                throw new System.ArgumentOutOfRangeException("offset", "Value must be positive.");
            }

            if (offset > (inArray.length - length)) {
                throw new System.ArgumentOutOfRangeException("offset", "Offset and length must refer to a position in the string.");
            }

            var chars = scope.internal.codesToChars(inArray),
                bytes = scope.internal.fromBase64CharPtr(chars, offset, length);

            return bytes;
        },

        convertToType: function (typeCode, value, formatProvider) {
            //TODO: #822 IConvertible
            throw new System.NotSupportedException("IConvertible interface is not supported.");
        }
    };

    scope.internal = {
        base64Table: [
            "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O",
            "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d",
            "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s",
            "t", "u", "v", "w", "x", "y", "z", "0", "1", "2", "3", "4", "5", "6", "7",
            "8", "9", "+", "/", "="
        ],

        typeRanges: {
            Char_MinValue: 0,
            Char_MaxValue: 65535,

            Byte_MinValue: 0,
            Byte_MaxValue: 255,

            SByte_MinValue: -128,
            SByte_MaxValue: 127,

            Int16_MinValue: -32768,
            Int16_MaxValue: 32767,

            UInt16_MinValue: 0,
            UInt16_MaxValue: 65535,

            Int32_MinValue: -2147483648,
            Int32_MaxValue: 2147483647,

            UInt32_MinValue: 0,
            UInt32_MaxValue: 4294967295,

            Int64_MinValue: System.Int64.MinValue,
            Int64_MaxValue: System.Int64.MaxValue,

            UInt64_MinValue: System.UInt64.MinValue,
            UInt64_MaxValue: System.UInt64.MaxValue,

            Single_MinValue: -3.40282347e+38,
            Single_MaxValue: 3.40282347e+38,

            Double_MinValue: -1.7976931348623157e+308,
            Double_MaxValue: 1.7976931348623157e+308,

            Decimal_MinValue: System.Decimal.MinValue,
            Decimal_MaxValue: System.Decimal.MaxValue
        },

        base64LineBreakPosition: 76,

        getTypeCodeName: function (typeCode) {
            var typeCodes = scope.convert.typeCodes;

            if (scope.internal.typeCodeNames == null) {
                var names = {};

                for (var codeName in typeCodes) {
                    if (!typeCodes.hasOwnProperty(codeName)) {
                        continue;
                    }

                    var codeValue = typeCodes[codeName];

                    names[codeValue] = codeName;
                }
                scope.internal.typeCodeNames = names;
            }

            var name = scope.internal.typeCodeNames[typeCode];

            if (name == null) {
                throw System.ArgumentOutOfRangeException("typeCode", "The specified typeCode is undefined.");
            }

            return name;
        },

        suggestTypeCode: function (value) {
            var typeCodes = scope.convert.typeCodes,                type = typeof (value);

            switch (type) {
                case "boolean":
                    return typeCodes.Boolean;

                case "number":
                    if (value % 1 !== 0)
                        return typeCodes.Double;

                    return typeCodes.Int32;

                case "string":
                    return typeCodes.String;

                case "object":
                    if (Bridge.isDate(value)) {
                        return typeCodes.DateTime;
                    }

                    if (value != null) {
                        return typeCodes.Object;
                    }

                    break;
            }
            return null;
        },

        getMinValue: function (typeCode) {
            var typeCodes = scope.convert.typeCodes;

            switch (typeCode) {
                case typeCodes.Char:
                    return scope.internal.typeRanges.Char_MinValue;
                case typeCodes.SByte:
                    return scope.internal.typeRanges.SByte_MinValue;
                case typeCodes.Byte:
                    return scope.internal.typeRanges.Byte_MinValue;
                case typeCodes.Int16:
                    return scope.internal.typeRanges.Int16_MinValue;
                case typeCodes.UInt16:
                    return scope.internal.typeRanges.UInt16_MinValue;
                case typeCodes.Int32:
                    return scope.internal.typeRanges.Int32_MinValue;
                case typeCodes.UInt32:
                    return scope.internal.typeRanges.UInt32_MinValue;
                case typeCodes.Int64:
                    return scope.internal.typeRanges.Int64_MinValue;
                case typeCodes.UInt64:
                    return scope.internal.typeRanges.UInt64_MinValue;
                case typeCodes.Single:
                    return scope.internal.typeRanges.Single_MinValue;
                case typeCodes.Double:
                    return scope.internal.typeRanges.Double_MinValue;
                case typeCodes.Decimal:
                    return scope.internal.typeRanges.Decimal_MinValue;
                case typeCodes.DateTime:
                    var date = new Date(0);
                    date.setFullYear(1);
                    return date;

                default:
                    return null;
            }
        },

        getMaxValue: function (typeCode) {
            var typeCodes = scope.convert.typeCodes;

            switch (typeCode) {
                case typeCodes.Char:
                    return scope.internal.typeRanges.Char_MaxValue;
                case typeCodes.SByte:
                    return scope.internal.typeRanges.SByte_MaxValue;
                case typeCodes.Byte:
                    return scope.internal.typeRanges.Byte_MaxValue;
                case typeCodes.Int16:
                    return scope.internal.typeRanges.Int16_MaxValue;
                case typeCodes.UInt16:
                    return scope.internal.typeRanges.UInt16_MaxValue;
                case typeCodes.Int32:
                    return scope.internal.typeRanges.Int32_MaxValue;
                case typeCodes.UInt32:
                    return scope.internal.typeRanges.UInt32_MaxValue;
                case typeCodes.Int64:
                    return scope.internal.typeRanges.Int64_MaxValue;
                case typeCodes.UInt64:
                    return scope.internal.typeRanges.UInt64_MaxValue;
                case typeCodes.Single:
                    return scope.internal.typeRanges.Single_MaxValue;
                case typeCodes.Double:
                    return scope.internal.typeRanges.Double_MaxValue;
                case typeCodes.Decimal:
                    return scope.internal.typeRanges.Decimal_MaxValue;
                default:
                    throw new System.ArgumentOutOfRangeException("typeCode", "The specified typeCode is undefined.");
            }
        },

        isFloatingType: function (typeCode) {
            var typeCodes = scope.convert.typeCodes;
            var isFloatingType =
                typeCode === typeCodes.Single ||
                typeCode === typeCodes.Double ||
                typeCode === typeCodes.Decimal;

            return isFloatingType;
        },

        toNumber: function (value, formatProvider, typeCode, valueTypeCode) {
            var typeCodes = scope.convert.typeCodes,
                type = typeof (value),
                isFloating = scope.internal.isFloatingType(typeCode);

            if (valueTypeCode === typeCodes.String) {
                type = "string";
            }

            if (System.Int64.is64Bit(value) || value instanceof System.Decimal) {
                type = "number";
            }

            switch (type) {
                case "boolean":
                    return value ? 1 : 0;

                case "number":
                    if (typeCode === typeCodes.Decimal) {
                        scope.internal.validateNumberRange(value, typeCode, true);

                        return new System.Decimal(value, formatProvider);
                    }

                    if (typeCode === typeCodes.Int64) {
                        scope.internal.validateNumberRange(value, typeCode, true);

                        return new System.Int64(value);
                    }

                    if (typeCode === typeCodes.UInt64) {
                        scope.internal.validateNumberRange(value, typeCode, true);

                        return new System.UInt64(value);
                    }

                    if (System.Int64.is64Bit(value)) {
                        value = value.toNumber();
                    } else if (value instanceof System.Decimal) {
                        value = value.toFloat();
                    }

                    if (!isFloating && (value % 1 !== 0)) {
                        value = scope.internal.roundToInt(value, typeCode);
                    }

                    if (isFloating) {
                        var minValue = scope.internal.getMinValue(typeCode),
                            maxValue = scope.internal.getMaxValue(typeCode);

                        if (value > maxValue) {
                            value = Infinity;
                        } else if (value < minValue) {
                            value = -Infinity;
                        }
                    }

                    scope.internal.validateNumberRange(value, typeCode, false);
                    return value;

                case "string":
                    if (value == null) {
                        if (formatProvider != null) {
                            throw new System.ArgumentNullException("String", "Value cannot be null.");
                        }

                        return 0;
                    }

                    if (isFloating) {
                        if (typeCode === typeCodes.Decimal) {
                            if (!/^[+-]?(\d+|\d+.|\d*\.\d+)$/.test(value)) {
                                if (!/^[+-]?[0-9]+$/.test(value)) {
                                    throw new System.FormatException("Input string was not in a correct format.");
                                }
                            }

                            value = System.Decimal(value, formatProvider);
                        } else {
                            if (!/^[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?$/.test(value)) {
                                throw new System.FormatException("Input string was not in a correct format.");
                            }

                            value = parseFloat(value);
                        }
                    } else {
                        if (!/^[+-]?[0-9]+$/.test(value)) {
                            throw new System.FormatException("Input string was not in a correct format.");
                        }

                        var str = value;

                        if (typeCode === typeCodes.Int64) {
                            value = new System.Int64(value);

                            if (str !== value.toString()) {
                                this.throwOverflow(scope.internal.getTypeCodeName(typeCode));
                            }
                        } else if (typeCode === typeCodes.UInt64) {
                            value = new System.UInt64(value);

                            if (str !== value.toString()) {
                                this.throwOverflow(scope.internal.getTypeCodeName(typeCode));
                            }
                        } else {
                            value = parseInt(value, 10);
                        }
                    }

                    if (isNaN(value)) {
                        throw new System.FormatException("Input string was not in a correct format.");
                    }

                    scope.internal.validateNumberRange(value, typeCode, true);

                    return value;

                case "object":
                    if (value == null) {
                        return 0;
                    }

                    if (Bridge.isDate(value)) {
                        scope.internal.throwInvalidCastEx(scope.convert.typeCodes.DateTime, typeCode);
                    }

                    break;
            }

            // TODO: #822 When IConvertible is implemented, try it before throwing InvalidCastEx
            valueTypeCode = valueTypeCode || scope.internal.suggestTypeCode(value);
            scope.internal.throwInvalidCastEx(valueTypeCode, typeCode);

            // try converting using IConvertible
            return scope.convert.convertToType(typeCode, value, formatProvider);
        },

        validateNumberRange: function (value, typeCode, denyInfinity) {
            var typeCodes = scope.convert.typeCodes,
                minValue = scope.internal.getMinValue(typeCode),
                maxValue = scope.internal.getMaxValue(typeCode),
                typeName = scope.internal.getTypeCodeName(typeCode);

            if (typeCode === typeCodes.Single ||
                typeCode === typeCodes.Double) {
                if (!denyInfinity && (value === Infinity || value === -Infinity)) {
                    return;
                }
            }

            if (typeCode === typeCodes.Decimal || typeCode === typeCodes.Int64 || typeCode === typeCodes.UInt64) {
                if (typeCode === typeCodes.Decimal) {
                    if (!System.Int64.is64Bit(value)) {
                        if (minValue.gt(value) || maxValue.lt(value)) {
                            this.throwOverflow(typeName);
                        }
                    }

                    value = new System.Decimal(value);
                } else if (typeCode === typeCodes.Int64) {
                    if (value instanceof System.UInt64) {
                        if (value.gt(System.Int64.MaxValue)) {
                            this.throwOverflow(typeName);
                        }
                    } else if (value instanceof System.Decimal) {
                        if ((value.gt(new System.Decimal(maxValue)) || value.lt(new System.Decimal(minValue)))) {
                            this.throwOverflow(typeName);
                        }
                    } else if (!(value instanceof System.Int64)) {
                        if (minValue.toNumber() > value || maxValue.toNumber() < value) {
                            this.throwOverflow(typeName);
                        }
                    }

                    value = new System.Int64(value);
                } else if (typeCode === typeCodes.UInt64) {
                    if (value instanceof System.Int64) {
                        if (value.isNegative()) {
                            this.throwOverflow(typeName);
                        }
                    } else if (value instanceof System.Decimal) {
                        if ((value.gt(new System.Decimal(maxValue)) || value.lt(new System.Decimal(minValue)))) {
                            this.throwOverflow(typeName);
                        }
                    } else if (!(value instanceof System.UInt64)) {
                        if (minValue.toNumber() > value || maxValue.toNumber() < value) {
                            this.throwOverflow(typeName);
                        }
                    }

                    value = new System.UInt64(value);
                }
            } else if (value < minValue || value > maxValue) {
                this.throwOverflow(typeName);
            }
        },

        throwOverflow: function (typeName) {
            throw new System.OverflowException("Value was either too large or too small for '" + typeName + "'.");
        },

        roundToInt: function (value, typeCode) {
            if (value % 1 === 0) {
                return value;
            }

            var intPart;

            if (value >= 0) {
                intPart = Math.floor(value);
            } else {
                intPart = -1 * Math.floor(-value);
            }

            var floatPart = value - intPart,
                minValue = scope.internal.getMinValue(typeCode),
                maxValue = scope.internal.getMaxValue(typeCode);

            if (value >= 0.0) {
                if (value < (maxValue + 0.5)) {
                    if (floatPart > 0.5 || floatPart === 0.5 && (intPart & 1) !== 0) {
                        ++intPart;
                    }

                    return intPart;
                }
            } else if (value >= (minValue - 0.5)) {
                if (floatPart < -0.5 || floatPart === -0.5 && (intPart & 1) !== 0) {
                    --intPart;
                }

                return intPart;
            }

            var typeName = scope.internal.getTypeCodeName(typeCode);

            throw new System.OverflowException("Value was either too large or too small for an '" + typeName + "'.");
        },

        toBase64_CalculateAndValidateOutputLength: function (inputLength, insertLineBreaks) {
            var base64LineBreakPosition = scope.internal.base64LineBreakPosition,
                outlen = ~~(inputLength / 3) * 4; // the base length - we want integer division here.

            outlen += ((inputLength % 3) !== 0) ? 4 : 0; // at most 4 more chars for the remainder

            if (outlen === 0) {
                return 0;
            }

            if (insertLineBreaks) {
                var newLines = ~~(outlen / base64LineBreakPosition);

                if ((outlen % base64LineBreakPosition) === 0) {
                    --newLines;
                }

                outlen += newLines * 2; // the number of line break chars we'll add, "\r\n"
            }

            // If we overflow an int then we cannot allocate enough
            // memory to output the value so throw
            if (outlen > 2147483647) {
                throw new System.OutOfMemoryException();
            }

            return outlen;
        },

        convertToBase64Array: function (outChars, inData, offset, length, insertLineBreaks) {
            var base64Table = scope.internal.base64Table,
                base64LineBreakPosition = scope.internal.base64LineBreakPosition,
                lengthmod3 = length % 3,
                calcLength = offset + (length - lengthmod3),
                charCount = 0,
                j = 0;

            // Convert three bytes at a time to base64 notation.  This will consume 4 chars.
            var i;

            for (i = offset; i < calcLength; i += 3) {
                if (insertLineBreaks) {
                    if (charCount === base64LineBreakPosition) {
                        outChars[j++] = "\r";
                        outChars[j++] = "\n";
                        charCount = 0;
                    }

                    charCount += 4;
                }

                outChars[j] = base64Table[(inData[i] & 0xfc) >> 2];
                outChars[j + 1] = base64Table[((inData[i] & 0x03) << 4) | ((inData[i + 1] & 0xf0) >> 4)];
                outChars[j + 2] = base64Table[((inData[i + 1] & 0x0f) << 2) | ((inData[i + 2] & 0xc0) >> 6)];
                outChars[j + 3] = base64Table[(inData[i + 2] & 0x3f)];
                j += 4;
            }

            //Where we left off before
            i = calcLength;

            if (insertLineBreaks && (lengthmod3 !== 0) && (charCount === scope.internal.base64LineBreakPosition)) {
                outChars[j++] = "\r";
                outChars[j++] = "\n";
            }

            switch (lengthmod3) {
                case 2: //One character padding needed
                    outChars[j] = base64Table[(inData[i] & 0xfc) >> 2];
                    outChars[j + 1] = base64Table[((inData[i] & 0x03) << 4) | ((inData[i + 1] & 0xf0) >> 4)];
                    outChars[j + 2] = base64Table[(inData[i + 1] & 0x0f) << 2];
                    outChars[j + 3] = base64Table[64]; //Pad
                    j += 4;
                    break;

                case 1: // Two character padding needed
                    outChars[j] = base64Table[(inData[i] & 0xfc) >> 2];
                    outChars[j + 1] = base64Table[(inData[i] & 0x03) << 4];
                    outChars[j + 2] = base64Table[64]; //Pad
                    outChars[j + 3] = base64Table[64]; //Pad
                    j += 4;
                    break;
            }

            return j;
        },

        fromBase64CharPtr: function (input, offset, inputLength) {
            if (inputLength < 0) {
                throw new System.ArgumentOutOfRangeException("inputLength", "Index was out of range. Must be non-negative and less than the size of the collection.");
            }

            if (offset < 0) {
                throw new System.ArgumentOutOfRangeException("offset", "Value must be positive.");
            }

            // We need to get rid of any trailing white spaces.
            // Otherwise we would be rejecting input such as "abc= ":
            while (inputLength > 0) {
                var lastChar = input[offset + inputLength - 1];

                if (lastChar !== " " && lastChar !== "\n" && lastChar !== "\r" && lastChar !== "\t") {
                    break;
                }

                inputLength--;
            }

            // Compute the output length:
            var resultLength = scope.internal.fromBase64_ComputeResultLength(input, offset, inputLength);

            if (0 > resultLength) {
                throw new System.InvalidOperationException("Contract voilation: 0 <= resultLength.");
            }

            // resultLength can be zero. We will still enter FromBase64_Decode and process the input.
            // It may either simply write no bytes (e.g. input = " ") or throw (e.g. input = "ab").

            // Create result byte blob:
            var decodedBytes = [];
            decodedBytes.length = resultLength;

            // Convert Base64 chars into bytes:
            scope.internal.fromBase64_Decode(input, offset, inputLength, decodedBytes, 0, resultLength);

            // We are done:
            return decodedBytes;
        },

        fromBase64_Decode: function (input, inputIndex, inputLength, dest, destIndex, destLength) {
            var startDestIndex = destIndex;

            // You may find this method weird to look at. Its written for performance, not aesthetics.
            // You will find unrolled loops label jumps and bit manipulations.

            var intA = "A".charCodeAt(0),
                inta = "a".charCodeAt(0),
                int0 = "0".charCodeAt(0),
                intEq = "=".charCodeAt(0),
                intPlus = "+".charCodeAt(0),
                intSlash = "/".charCodeAt(0),
                intSpace = " ".charCodeAt(0),
                intTab = "\t".charCodeAt(0),
                intNLn = "\n".charCodeAt(0),
                intCRt = "\r".charCodeAt(0),
                intAtoZ = ("Z".charCodeAt(0) - "A".charCodeAt(0)),
                int0To9 = ("9".charCodeAt(0) - "0".charCodeAt(0));

            var endInputIndex = inputIndex + inputLength,
                endDestIndex = destIndex + destLength;

            // Current char code/value:
            var currCode;

            // This 4-byte integer will contain the 4 codes of the current 4-char group.
            // Eeach char codes for 6 bits = 24 bits.
            // The remaining byte will be FF, we use it as a marker when 4 chars have been processed.
            var currBlockCodes = 0x000000FF;

            var allInputConsumed = false,
                equalityCharEncountered = false;

            while (true) {
                // break when done:
                if (inputIndex >= endInputIndex) {
                    allInputConsumed = true;
                    break;
                }

                // Get current char:
                currCode = input[inputIndex].charCodeAt(0);
                inputIndex++;

                // Determine current char code (unsigned Int comparison):
                if (((currCode - intA) >>> 0) <= intAtoZ) {
                    currCode -= intA;
                } else if (((currCode - inta) >>> 0) <= intAtoZ) {
                    currCode -= (inta - 26);
                } else if (((currCode - int0) >>> 0) <= int0To9) {
                    currCode -= (int0 - 52);
                } else {
                    // Use the slower switch for less common cases:
                    switch (currCode) {
                        // Significant chars:
                        case intPlus:
                            currCode = 62;
                            break;

                        case intSlash:
                            currCode = 63;
                            break;

                            // Legal no-value chars (we ignore these):
                        case intCRt:
                        case intNLn:
                        case intSpace:
                        case intTab:
                            continue;

                            // The equality char is only legal at the end of the input.
                            // Jump after the loop to make it easier for the JIT register predictor to do a good job for the loop itself:
                        case intEq:
                            equalityCharEncountered = true;
                            break;

                            // Other chars are illegal:
                        default:
                            throw new System.FormatException("The input is not a valid Base-64 string as it contains a non-base 64 character, more than two padding characters, or an illegal character among the padding characters.");
                    }
                }

                if (equalityCharEncountered) {
                    break;
                }

                // Ok, we got the code. Save it:
                currBlockCodes = (currBlockCodes << 6) | currCode;

                // Last bit in currBlockCodes will be on after in shifted right 4 times:
                if ((currBlockCodes & 0x80000000) !== 0) {
                    if ((endDestIndex - destIndex) < 3) {
                        return -1;
                    }

                    dest[destIndex] = 0xFF & (currBlockCodes >> 16);
                    dest[destIndex + 1] = 0xFF & (currBlockCodes >> 8);
                    dest[destIndex + 2] = 0xFF & (currBlockCodes);
                    destIndex += 3;

                    currBlockCodes = 0x000000FF;
                }
            } // end of while

            if (!allInputConsumed && !equalityCharEncountered) {
                throw new System.InvalidOperationException("Contract violation: should never get here.");
            }

            if (equalityCharEncountered) {
                if (currCode !== intEq) {
                    throw new System.InvalidOperationException("Contract violation: currCode == intEq.");
                }

                // Recall that inputIndex is now one position past where '=' was read.
                // '=' can only be at the last input pos:
                if (inputIndex === endInputIndex) {
                    // Code is zero for trailing '=':
                    currBlockCodes <<= 6;

                    // The '=' did not complete a 4-group. The input must be bad:
                    if ((currBlockCodes & 0x80000000) === 0) {
                        throw new System.FormatException("Invalid length for a Base-64 char array or string.");
                    }

                    if ((endDestIndex - destIndex) < 2) {
                        // Autch! We underestimated the output length!
                        return -1;
                    }

                    // We are good, store bytes form this past group. We had a single "=", so we take two bytes:
                    dest[destIndex] = 0xFF & (currBlockCodes >> 16);
                    dest[destIndex + 1] = 0xFF & (currBlockCodes >> 8);
                    destIndex += 2;

                    currBlockCodes = 0x000000FF;
                } else { // '=' can also be at the pre-last position iff the last is also a '=' excluding the white spaces:
                    // We need to get rid of any intermediate white spaces.
                    // Otherwise we would be rejecting input such as "abc= =":
                    while (inputIndex < (endInputIndex - 1)) {
                        var lastChar = input[inputIndex];

                        if (lastChar !== " " && lastChar !== "\n" && lastChar !== "\r" && lastChar !== "\t") {
                            break;
                        }

                        inputIndex++;
                    }

                    if (inputIndex === (endInputIndex - 1) && input[inputIndex] === "=") {
                        // Code is zero for each of the two '=':
                        currBlockCodes <<= 12;

                        // The '=' did not complete a 4-group. The input must be bad:
                        if ((currBlockCodes & 0x80000000) === 0) {
                            throw new System.FormatException("Invalid length for a Base-64 char array or string.");
                        }

                        if ((endDestIndex - destIndex) < 1) {
                            // Autch! We underestimated the output length!
                            return -1;
                        }

                        // We are good, store bytes form this past group. We had a "==", so we take only one byte:
                        dest[destIndex] = 0xFF & (currBlockCodes >> 16);
                        destIndex++;

                        currBlockCodes = 0x000000FF;
                    } else {
                        // '=' is not ok at places other than the end:
                        throw new System.FormatException("The input is not a valid Base-64 string as it contains a non-base 64 character, more than two padding characters, or an illegal character among the padding characters.");
                    }
                }
            }

            // We get here either from above or by jumping out of the loop:
            // The last block of chars has less than 4 items
            if (currBlockCodes !== 0x000000FF) {
                throw new System.FormatException("Invalid length for a Base-64 char array or string.");
            }

            // Return how many bytes were actually recovered:
            return (destIndex - startDestIndex);
        },

        fromBase64_ComputeResultLength: function (input, startIndex, inputLength) {
            var intEq = "=",
                intSpace = " ";

            if (inputLength < 0) {
                throw new System.ArgumentOutOfRangeException("inputLength", "Index was out of range. Must be non-negative and less than the size of the collection.");
            }

            var endIndex = startIndex + inputLength,
                usefulInputLength = inputLength,
                padding = 0;

            while (startIndex < endIndex) {
                var c = input[startIndex];

                startIndex++;

                // We want to be as fast as possible and filter out spaces with as few comparisons as possible.
                // We end up accepting a number of illegal chars as legal white-space chars.
                // This is ok: as soon as we hit them during actual decode we will recognise them as illegal and throw.
                if (c <= intSpace) {
                    usefulInputLength--;
                } else if (c === intEq) {
                    usefulInputLength--;
                    padding++;
                }
            }

            if (0 > usefulInputLength) {
                throw new System.InvalidOperationException("Contract violation: 0 <= usefulInputLength.");
            }

            if (0 > padding) {
                // For legal input, we can assume that 0 <= padding < 3. But it may be more for illegal input.
                // We will notice it at decode when we see a '=' at the wrong place.
                throw new System.InvalidOperationException("Contract violation: 0 <= padding.");
            }

            // Perf: reuse the variable that stored the number of '=' to store the number of bytes encoded by the
            // last group that contains the '=':
            if (padding !== 0) {
                if (padding === 1) {
                    padding = 2;
                } else if (padding === 2) {
                    padding = 1;
                } else {
                    throw new System.FormatException("The input is not a valid Base-64 string as it contains a non-base 64 character, more than two padding characters, or an illegal character among the padding characters.");
                }
            }

            // Done:
            return ~~(usefulInputLength / 4) * 3 + padding;
        },

        charsToCodes: function (chars, codes, codesOffset) {
            if (chars == null) {
                return null;
            }

            codesOffset = codesOffset || 0;

            if (codes == null) {
                codes = [];
                codes.length = chars.length;
            }

            for (var i = 0; i < chars.length; i++) {
                codes[i + codesOffset] = chars[i].charCodeAt(0);
            }

            return codes;
        },

        codesToChars: function (codes, chars) {
            if (codes == null) {
                return null;
            }

            chars = chars || [];

            for (var i = 0; i < codes.length; i++) {
                var code = codes[i];

                chars[i] = String.fromCharCode(code);
            }

            return chars;
        },

        throwInvalidCastEx: function (fromTypeCode, toTypeCode) {
            var fromType = scope.internal.getTypeCodeName(fromTypeCode),                toType = scope.internal.getTypeCodeName(toTypeCode);

            throw new System.InvalidCastException("Invalid cast from '" + fromType + "' to '" + toType + "'.");
        }
    };

    System.Convert = scope.convert;

    // @source ClientWebSocket.js

    Bridge.define("System.Net.WebSockets.ClientWebSocket", {
        inherits: [System.IDisposable],

        ctor: function () {
            this.$initialize();
            this.messageBuffer = [];
            this.state = "none";
            this.options = new System.Net.WebSockets.ClientWebSocketOptions();
            this.disposed = false;
            this.closeStatus = null;
            this.closeStatusDescription = null;
        },

        getCloseStatus: function () {
            return this.closeStatus;
        },

        getState: function () {
            return this.state;
        },

        getCloseStatusDescription: function () {
            return this.closeStatusDescription;
        },

        getSubProtocol: function () {
            return this.socket ? this.socket.protocol : null;
        },

        connectAsync: function (uri, cancellationToken) {
            if (this.state !== "none") {
                throw new System.InvalidOperationException("Socket is not in initial state");
            }

            this.options.setToReadOnly();
            this.state = "connecting";

            var tcs = new System.Threading.Tasks.TaskCompletionSource(),
                self = this;

            try {
                this.socket = new WebSocket(uri.getAbsoluteUri(), this.options.requestedSubProtocols);
                this.socket.binaryType = "arraybuffer";
                this.socket.onopen = function () {
                    self.state = "open";
                    tcs.setResult(null);
                };

                this.socket.onmessage = function (e) {
                    var data = e.data,
                        message = {},
                        i;

                    message.bytes = [];

                    if (typeof (data) === "string") {
                        for (i = 0; i < data.length; ++i) {
                            message.bytes.push(data.charCodeAt(i));
                        }

                        message.messageType = "text";
                        self.messageBuffer.push(message);

                        return;
                    }

                    if (data instanceof ArrayBuffer) {
                        var dataView = new Uint8Array(data);

                        for (i = 0; i < dataView.length; i++) {
                            message.bytes.push(dataView[i]);
                        }

                        message.messageType = "binary";
                        self.messageBuffer.push(message);

                        return;
                    }

                    throw new System.ArgumentException("Invalid message type.");
                };

                this.socket.onclose = function (e) {
                    self.state = "closed";
                    self.closeStatus = e.code;
                    self.closeStatusDescription = e.reason;
                }
            } catch (e) {
                tcs.setException(System.Exception.create(e));
            }

            return tcs.task;
        },

        sendAsync: function (buffer, messageType, endOfMessage, cancellationToken) {
            this.throwIfNotConnected();

            var tcs = new System.Threading.Tasks.TaskCompletionSource();

            try {
                var array = buffer.getArray(),
                    data;

                switch (messageType) {
                case "binary":
                    data = new ArrayBuffer(array.length);
                    var dataView = new Int8Array(data);

                    for (var i = 0; i < array.length; i++) {
                        dataView[i] = array[i];
                    }

                    break;
                case "text":
                    data = String.fromCharCode.apply(null, array);
                    break;
                }

                if (messageType === "close") {
                    this.socket.close();
                } else {
                    this.socket.send(data);
                }

                tcs.setResult(null);
            } catch (e) {
                tcs.setException(System.Exception.create(e));
            }

            return tcs.task;
        },

        receiveAsync: function (buffer, cancellationToken) {
            this.throwIfNotConnected();

            var task,
                tcs = new System.Threading.Tasks.TaskCompletionSource(),
                self = this,
                asyncBody = Bridge.fn.bind(this, function () {
                    try {
                        if (cancellationToken.getIsCancellationRequested()) {
                            tcs.setException(new System.Threading.Tasks.TaskCanceledException("Receive has been cancelled.", tcs.task));
                            return;
                        }

                        if (self.messageBuffer.length === 0) {
                            task = System.Threading.Tasks.Task.delay(0);
                            task.continueWith(asyncBody);
                            return;
                        }

                        var message = self.messageBuffer[0],
                            array = buffer.getArray(),
                            resultBytes,
                            endOfMessage;

                        if (message.bytes.length <= array.length) {
                            self.messageBuffer.shift();
                            resultBytes = message.bytes;
                            endOfMessage = true;
                        } else {
                            resultBytes = message.bytes.slice(0, array.length);
                            message.bytes = message.bytes.slice(array.length, message.bytes.length);
                            endOfMessage = false;
                        }

                        for (var i = 0; i < resultBytes.length; i++) {
                            array[i] = resultBytes[i];
                        }

                        tcs.setResult(new System.Net.WebSockets.WebSocketReceiveResult(
                            resultBytes.length, message.messageType, endOfMessage));
                    } catch (e) {
                        tcs.setException(System.Exception.create(e));
                    }
                }, arguments);

            asyncBody();

            return tcs.task;
        },

        closeAsync: function (closeStatus, statusDescription, cancellationToken) {
            this.throwIfNotConnected();

            if (this.state !== "open") {
                throw new System.InvalidOperationException("Socket is not in connected state");
            }

            var tcs = new System.Threading.Tasks.TaskCompletionSource(),
                self = this,
                task,
                asyncBody = function () {
                    if (self.state === "closed") {
                        tcs.setResult(null);
                        return;
                    }

                    if (cancellationToken.getIsCancellationRequested()) {
                        tcs.setException(new System.Threading.Tasks.TaskCanceledException("Closing has been cancelled.", tcs.task));
                        return;
                    }

                    task = System.Threading.Tasks.Task.delay(0);
                    task.continueWith(asyncBody);
                };
            try {
                this.state = "closesent";
                this.socket.close(closeStatus, statusDescription);
            } catch (e) {
                tcs.setException(System.Exception.create(e));
            }

            asyncBody();

            return tcs.task;
        },

        closeOutputAsync: function (closeStatus, statusDescription, cancellationToken) {
            this.throwIfNotConnected();

            if (this.state !== "open") {
                throw new System.InvalidOperationException("Socket is not in connected state");
            }

            var tcs = new System.Threading.Tasks.TaskCompletionSource();

            try {
                this.state = "closesent";
                this.socket.close(closeStatus, statusDescription);
                tcs.setResult(null);
            } catch (e) {
                tcs.setException(System.Exception.create(e));
            }

            return tcs.task;
        },

        abort: function () {
            this.dispose();
        },

        dispose: function () {
            if (this.disposed) {
                return;
            }

            this.disposed = true;
            this.messageBuffer = [];

            if (state === "open") {
                this.state = "closesent";
                this.socket.close();
            }
        },

        throwIfNotConnected: function () {
            if (this.disposed) {
                throw new System.InvalidOperationException("Socket is disposed.");
            }

            if (this.socket.readyState !== 1) {
                throw new System.InvalidOperationException("Socket is not connected.");
            }
        }
    });

    Bridge.define("System.Net.WebSockets.ClientWebSocketOptions", {
        ctor: function () {
            this.$initialize();
            this.isReadOnly = false;
            this.requestedSubProtocols = [];
        },

        setToReadOnly: function () {
            if (this.isReadOnly) {
                throw new System.InvalidOperationException("Options are already readonly.");
            }

            this.isReadOnly = true;
        },

        addSubProtocol: function (subProtocol) {
            if (this.isReadOnly) {
                throw new System.InvalidOperationException("Socket already started.");
            }

            if (this.requestedSubProtocols.indexOf(subProtocol) > -1) {
                throw new System.ArgumentException("Socket cannot have duplicate sub-protocols.", "subProtocol");
            }

            this.requestedSubProtocols.push(subProtocol);
        }
    });

    Bridge.define("System.Net.WebSockets.WebSocketReceiveResult", {
        ctor: function (count, messageType, endOfMessage, closeStatus, closeStatusDescription) {
            this.$initialize();
            this.count = count;
            this.messageType = messageType;
            this.endOfMessage = endOfMessage;
            this.closeStatus = closeStatus;
            this.closeStatusDescription = closeStatusDescription;
        },

        getCount: function () {
            return this.count;
        },

        getMessageType: function () {
            return this.messageType;
        },

        getEndOfMessage: function () {
            return this.endOfMessage;
        },

        getCloseStatus: function () {
            return this.closeStatus;
        },

        getCloseStatusDescription: function () {
            return this.closeStatusDescription;
        }
    });

    // @source Uri.js

    Bridge.define("System.Uri", {
        ctor: function (uriString) {
            this.$initialize();
            this.absoluteUri = uriString;
        },

        getAbsoluteUri: function () {
            return this.absoluteUri;
        }
    });

    // @source linq.js

/*--------------------------------------------------------------------------
 * linq.js - LINQ for JavaScript
 * ver 3.0.4-Beta5 (Jun. 20th, 2013)
 *
 * created and maintained by neuecc <ils@neue.cc>
 * licensed under MIT License
 * http://linqjs.codeplex.com/
 *------------------------------------------------------------------------*/

(function (root, undefined) {
    // ReadOnly Function
    var Functions = {
        Identity: function (x) { return x; },
        True: function () { return true; },
        Blank: function () { }
    };

    // const Type
    var Types = {
        Boolean: typeof true,
        Number: typeof 0,
        String: typeof "",
        Object: typeof {},
        Undefined: typeof undefined,
        Function: typeof function () { }
    };

    // createLambda cache
    var funcCache = { "": Functions.Identity };

    // private utility methods
    var Utils = {
        // Create anonymous function from lambda expression string
        createLambda: function (expression) {
            if (expression == null) return Functions.Identity;
            if (typeof expression === Types.String) {
                // get from cache
                var f = funcCache[expression];
                if (f != null) {
                    return f;
                }

                if (expression.indexOf("=>") === -1) {
                    var regexp = new RegExp("[$]+", "g");

                    var maxLength = 0;
                    var match;
                    while ((match = regexp.exec(expression)) != null) {
                        var paramNumber = match[0].length;
                        if (paramNumber > maxLength) {
                            maxLength = paramNumber;
                        }
                    }

                    var argArray = [];
                    for (var i = 1; i <= maxLength; i++) {
                        var dollar = "";
                        for (var j = 0; j < i; j++) {
                            dollar += "$";
                        }
                        argArray.push(dollar);
                    }

                    var args = Array.prototype.join.call(argArray, ",");

                    f = new Function(args, "return " + expression);
                    funcCache[expression] = f;
                    return f;
                }
                else {
                    var expr = expression.match(/^[(\s]*([^()]*?)[)\s]*=>(.*)/);
                    f = new Function(expr[1], "return " + expr[2]);
                    funcCache[expression] = f;
                    return f;
                }
            }
            return expression;
        },

        isIEnumerable: function (obj) {
            if (typeof Enumerator !== Types.Undefined) {
                try {
                    new Enumerator(obj); // check JScript(IE)'s Enumerator
                    return true;
                }
                catch (e) { }
            }

            return false;
        },

        // IE8's defineProperty is defined but cannot use, therefore check defineProperties
        defineProperty: (Object.defineProperties != null)
            ? function (target, methodName, value) {
                Object.defineProperty(target, methodName, {
                    enumerable: false,
                    configurable: true,
                    writable: true,
                    value: value
                })
            }
            : function (target, methodName, value) {
                target[methodName] = value;
            },

        compare: function (a, b) {
            return (a === b) ? 0
                 : (a > b) ? 1
                 : -1;
        },

        dispose: function (obj) {
            if (obj != null) obj.dispose();
        }
    };

    // IEnumerator State
    var State = { Before: 0, Running: 1, After: 2 };

    // "Enumerator" is conflict JScript's "Enumerator"
    var IEnumerator = function (initialize, tryGetNext, dispose) {
        var yielder = new Yielder();
        var state = State.Before;

        this.getCurrent = yielder.getCurrent;
        this.reset = function () { throw new Error('Reset is not supported'); };

        this.moveNext = function () {
            try {
                switch (state) {
                    case State.Before:
                        state = State.Running;
                        initialize();
                        // fall through
                    case State.Running:
                        if (tryGetNext.apply(yielder)) {
                            return true;
                        }
                        else {
                            this.dispose();
                            return false;
                        }
                    case State.After:
                        return false;
                }
            }
            catch (e) {
                this.dispose();
                throw e;
            }
        };

        this.dispose = function () {
            if (state != State.Running) return;

            try {
                dispose();
            }
            finally {
                state = State.After;
            }
        };

        this.getCurrent$1 = this.getCurrent;
        this.System$Collections$IEnumerator$getCurrent = this.getCurrent;
        this.System$Collections$IEnumerator$moveNext = this.moveNext;
        this.System$Collections$IEnumerator$reset = this.reset;
    };

    IEnumerator.$$inherits = [];
    Bridge.Class.addExtend(IEnumerator, [System.IDisposable, System.Collections.IEnumerator]);

    // for tryGetNext
    var Yielder = function () {
        var current = null;
        this.getCurrent = function () { return current; };
        this.yieldReturn = function (value) {
            current = value;
            return true;
        };
        this.yieldBreak = function () {
            return false;
        };
    };

    // Enumerable constuctor
    var Enumerable = function (getEnumerator) {
        this.getEnumerator = getEnumerator;
    };

    Enumerable.$$inherits = [];
    Bridge.Class.addExtend(Enumerable, [System.Collections.IEnumerable]);

    // Utility

    Enumerable.Utils = {}; // container

    Enumerable.Utils.createLambda = function (expression) {
        return Utils.createLambda(expression);
    };

    Enumerable.Utils.createEnumerable = function (getEnumerator) {
        return new Enumerable(getEnumerator);
    };

    Enumerable.Utils.createEnumerator = function (initialize, tryGetNext, dispose) {
        return new IEnumerator(initialize, tryGetNext, dispose);
    };

    Enumerable.Utils.extendTo = function (type) {
        var typeProto = type.prototype;
        var enumerableProto;

        if (type === Array) {
            enumerableProto = ArrayEnumerable.prototype;
            Utils.defineProperty(typeProto, "getSource", function () {
                return this;
            });
        }
        else {
            enumerableProto = Enumerable.prototype;
            Utils.defineProperty(typeProto, "getEnumerator", function () {
                return Enumerable.from(this).getEnumerator();
            });
        }

        for (var methodName in enumerableProto) {
            var func = enumerableProto[methodName];

            // already extended
            if (typeProto[methodName] == func) continue;

            // already defined(example Array#reverse/join/forEach...)
            if (typeProto[methodName] != null) {
                methodName = methodName + "ByLinq";
                if (typeProto[methodName] == func) continue; // recheck
            }

            if (func instanceof Function) {
                Utils.defineProperty(typeProto, methodName, func);
            }
        }
    };

    // Generator

    Enumerable.choice = function () // variable argument
    {
        var args = arguments;

        return new Enumerable(function () {
            return new IEnumerator(
                function () {
                    args = (args[0] instanceof Array) ? args[0]
                        : (args[0].getEnumerator != null) ? args[0].toArray()
                        : args;
                },
                function () {
                    return this.yieldReturn(args[Math.floor(Math.random() * args.length)]);
                },
                Functions.Blank);
        });
    };

    Enumerable.cycle = function () // variable argument
    {
        var args = arguments;

        return new Enumerable(function () {
            var index = 0;
            return new IEnumerator(
                function () {
                    args = (args[0] instanceof Array) ? args[0]
                        : (args[0].getEnumerator != null) ? args[0].toArray()
                        : args;
                },
                function () {
                    if (index >= args.length) index = 0;
                    return this.yieldReturn(args[index++]);
                },
                Functions.Blank);
        });
    };

    // private singleton
    var emptyEnumerable = new Enumerable(function () {
            return new IEnumerator(
                Functions.Blank,
                function () { return false; },
                Functions.Blank);
        });
    Enumerable.empty = function () {
        return emptyEnumerable;
    };

    Enumerable.from = function (obj) {
        if (obj == null) {
            return Enumerable.empty();
        }
        if (obj instanceof Enumerable) {
            return obj;
        }
        if (typeof obj == Types.Number || typeof obj == Types.Boolean) {
            return Enumerable.repeat(obj, 1);
        }
        if (typeof obj == Types.String) {
            return new Enumerable(function () {
                var index = 0;
                return new IEnumerator(
                    Functions.Blank,
                    function () {
                        return (index < obj.length) ? this.yieldReturn(obj.charCodeAt(index++)) : false;
                    },
                    Functions.Blank);
            });
        }
        var ienum = Bridge.as(obj, System.Collections.IEnumerable);
        if (ienum) {
            return new Enumerable(function () {
                var enumerator;
                return new IEnumerator(
                    function () { enumerator = Bridge.getEnumerator(ienum); },
                    function () {
                        var ok = enumerator.moveNext();
                        return ok ? this.yieldReturn(enumerator.getCurrent()) : false;
                    },
                    function () {
                        var disposable = Bridge.as(enumerator, System.IDisposable);
                        if (disposable) {
                            disposable.dispose();
                        }
                    }
                );
            });
        }
        if (typeof obj != Types.Function) {
            // array or array like object
            if (typeof obj.length == Types.Number) {
                return new ArrayEnumerable(obj);
            }

            // JScript's IEnumerable
            if (!(obj instanceof Object) && Utils.isIEnumerable(obj)) {
                return new Enumerable(function () {
                    var isFirst = true;
                    var enumerator;
                    return new IEnumerator(
                        function () { enumerator = new Enumerator(obj); },
                        function () {
                            if (isFirst) isFirst = false;
                            else enumerator.moveNext();

                            return (enumerator.atEnd()) ? false : this.yieldReturn(enumerator.item());
                        },
                        Functions.Blank);
                });
            }

            // WinMD IIterable<T>
            if (typeof Windows === Types.Object && typeof obj.first === Types.Function) {
                return new Enumerable(function () {
                    var isFirst = true;
                    var enumerator;
                    return new IEnumerator(
                        function () { enumerator = obj.first(); },
                        function () {
                            if (isFirst) isFirst = false;
                            else enumerator.moveNext();

                            return (enumerator.hasCurrent) ? this.yieldReturn(enumerator.current) : this.yieldBreak();
                        },
                        Functions.Blank);
                });
            }
        }

        // case function/object : Create keyValuePair[]
        return new Enumerable(function () {
            var array = [];
            var index = 0;

            return new IEnumerator(
                function () {
                    for (var key in obj) {
                        var value = obj[key];
                        if (!(value instanceof Function) && Object.prototype.hasOwnProperty.call(obj, key)) {
                            array.push({ key: key, value: value });
                        }
                    }
                },
                function () {
                    return (index < array.length)
                        ? this.yieldReturn(array[index++])
                        : false;
                },
                Functions.Blank);
        });
    },

    Enumerable.make = function (element) {
        return Enumerable.repeat(element, 1);
    };

    // Overload:function (input, pattern)
    // Overload:function (input, pattern, flags)
    Enumerable.matches = function (input, pattern, flags) {
        if (flags == null) flags = "";
        if (pattern instanceof RegExp) {
            flags += (pattern.ignoreCase) ? "i" : "";
            flags += (pattern.multiline) ? "m" : "";
            pattern = pattern.source;
        }
        if (flags.indexOf("g") === -1) flags += "g";

        return new Enumerable(function () {
            var regex;
            return new IEnumerator(
                function () { regex = new RegExp(pattern, flags); },
                function () {
                    var match = regex.exec(input);
                    return (match) ? this.yieldReturn(match) : false;
                },
                Functions.Blank);
        });
    };

    // Overload:function (start, count)
    // Overload:function (start, count, step)
    Enumerable.range = function (start, count, step) {
        if (step == null) step = 1;

        return new Enumerable(function () {
            var value;
            var index = 0;

            return new IEnumerator(
                function () { value = start - step; },
                function () {
                    return (index++ < count)
                        ? this.yieldReturn(value += step)
                        : this.yieldBreak();
                },
                Functions.Blank);
        });
    };

    // Overload:function (start, count)
    // Overload:function (start, count, step)
    Enumerable.rangeDown = function (start, count, step) {
        if (step == null) step = 1;

        return new Enumerable(function () {
            var value;
            var index = 0;

            return new IEnumerator(
                function () { value = start + step; },
                function () {
                    return (index++ < count)
                        ? this.yieldReturn(value -= step)
                        : this.yieldBreak();
                },
                Functions.Blank);
        });
    };

    // Overload:function (start, to)
    // Overload:function (start, to, step)
    Enumerable.rangeTo = function (start, to, step) {
        if (step == null) step = 1;

        if (start < to) {
            return new Enumerable(function () {
                var value;

                return new IEnumerator(
                function () { value = start - step; },
                function () {
                    var next = value += step;
                    return (next <= to)
                        ? this.yieldReturn(next)
                        : this.yieldBreak();
                },
                Functions.Blank);
            });
        }
        else {
            return new Enumerable(function () {
                var value;

                return new IEnumerator(
                function () { value = start + step; },
                function () {
                    var next = value -= step;
                    return (next >= to)
                        ? this.yieldReturn(next)
                        : this.yieldBreak();
                },
                Functions.Blank);
            });
        }
    };

    // Overload:function (element)
    // Overload:function (element, count)
    Enumerable.repeat = function (element, count) {
        if (count != null) return Enumerable.repeat(element).take(count);

        return new Enumerable(function () {
            return new IEnumerator(
                Functions.Blank,
                function () { return this.yieldReturn(element); },
                Functions.Blank);
        });
    };

    Enumerable.repeatWithFinalize = function (initializer, finalizer) {
        initializer = Utils.createLambda(initializer);
        finalizer = Utils.createLambda(finalizer);

        return new Enumerable(function () {
            var element;
            return new IEnumerator(
                function () { element = initializer(); },
                function () { return this.yieldReturn(element); },
                function () {
                    if (element != null) {
                        finalizer(element);
                        element = null;
                    }
                });
        });
    };

    // Overload:function (func)
    // Overload:function (func, count)
    Enumerable.generate = function (func, count) {
        if (count != null) return Enumerable.generate(func).take(count);
        func = Utils.createLambda(func);

        return new Enumerable(function () {
            return new IEnumerator(
                Functions.Blank,
                function () { return this.yieldReturn(func()); },
                Functions.Blank);
        });
    };

    // Overload:function ()
    // Overload:function (start)
    // Overload:function (start, step)
    Enumerable.toInfinity = function (start, step) {
        if (start == null) start = 0;
        if (step == null) step = 1;

        return new Enumerable(function () {
            var value;
            return new IEnumerator(
                function () { value = start - step; },
                function () { return this.yieldReturn(value += step); },
                Functions.Blank);
        });
    };

    // Overload:function ()
    // Overload:function (start)
    // Overload:function (start, step)
    Enumerable.toNegativeInfinity = function (start, step) {
        if (start == null) start = 0;
        if (step == null) step = 1;

        return new Enumerable(function () {
            var value;
            return new IEnumerator(
                function () { value = start + step; },
                function () { return this.yieldReturn(value -= step); },
                Functions.Blank);
        });
    };

    Enumerable.unfold = function (seed, func) {
        func = Utils.createLambda(func);

        return new Enumerable(function () {
            var isFirst = true;
            var value;
            return new IEnumerator(
                Functions.Blank,
                function () {
                    if (isFirst) {
                        isFirst = false;
                        value = seed;
                        return this.yieldReturn(value);
                    }
                    value = func(value);
                    return this.yieldReturn(value);
                },
                Functions.Blank);
        });
    };

    Enumerable.defer = function (enumerableFactory) {
        return new Enumerable(function () {
            var enumerator;

            return new IEnumerator(
                function () { enumerator = Enumerable.from(enumerableFactory()).getEnumerator(); },
                function () {
                    return (enumerator.moveNext())
                        ? this.yieldReturn(enumerator.getCurrent())
                        : this.yieldBreak();
                },
                function () {
                    Utils.dispose(enumerator);
                });
        });
    };

    // Extension Methods

    /* Projection and Filtering Methods */

    // Overload:function (func)
    // Overload:function (func, resultSelector<element>)
    // Overload:function (func, resultSelector<element, nestLevel>)
    Enumerable.prototype.traverseBreadthFirst = function (func, resultSelector) {
        var source = this;
        func = Utils.createLambda(func);
        resultSelector = Utils.createLambda(resultSelector);

        return new Enumerable(function () {
            var enumerator;
            var nestLevel = 0;
            var buffer = [];

            return new IEnumerator(
                function () { enumerator = source.getEnumerator(); },
                function () {
                    while (true) {
                        if (enumerator.moveNext()) {
                            buffer.push(enumerator.getCurrent());
                            return this.yieldReturn(resultSelector(enumerator.getCurrent(), nestLevel));
                        }

                        var next = Enumerable.from(buffer).selectMany(function (x) { return func(x); });
                        if (!next.any()) {
                            return false;
                        }
                        else {
                            nestLevel++;
                            buffer = [];
                            Utils.dispose(enumerator);
                            enumerator = next.getEnumerator();
                        }
                    }
                },
                function () { Utils.dispose(enumerator); });
        });
    };

    // Overload:function (func)
    // Overload:function (func, resultSelector<element>)
    // Overload:function (func, resultSelector<element, nestLevel>)
    Enumerable.prototype.traverseDepthFirst = function (func, resultSelector) {
        var source = this;
        func = Utils.createLambda(func);
        resultSelector = Utils.createLambda(resultSelector);

        return new Enumerable(function () {
            var enumeratorStack = [];
            var enumerator;

            return new IEnumerator(
                function () { enumerator = source.getEnumerator(); },
                function () {
                    while (true) {
                        if (enumerator.moveNext()) {
                            var value = resultSelector(enumerator.getCurrent(), enumeratorStack.length);
                            enumeratorStack.push(enumerator);
                            enumerator = Enumerable.from(func(enumerator.getCurrent())).getEnumerator();
                            return this.yieldReturn(value);
                        }

                        if (enumeratorStack.length <= 0) return false;
                        Utils.dispose(enumerator);
                        enumerator = enumeratorStack.pop();
                    }
                },
                function () {
                    try {
                        Utils.dispose(enumerator);
                    }
                    finally {
                        Enumerable.from(enumeratorStack).forEach(function (s) { s.dispose(); });
                    }
                });
        });
    };

    Enumerable.prototype.flatten = function () {
        var source = this;

        return new Enumerable(function () {
            var enumerator;
            var middleEnumerator = null;

            return new IEnumerator(
                function () { enumerator = source.getEnumerator(); },
                function () {
                    while (true) {
                        if (middleEnumerator != null) {
                            if (middleEnumerator.moveNext()) {
                                return this.yieldReturn(middleEnumerator.getCurrent());
                            }
                            else {
                                middleEnumerator = null;
                            }
                        }

                        if (enumerator.moveNext()) {
                            if (enumerator.getCurrent() instanceof Array) {
                                Utils.dispose(middleEnumerator);
                                middleEnumerator = Enumerable.from(enumerator.getCurrent())
                                    .selectMany(Functions.Identity)
                                    .flatten()
                                    .getEnumerator();
                                continue;
                            }
                            else {
                                return this.yieldReturn(enumerator.getCurrent());
                            }
                        }

                        return false;
                    }
                },
                function () {
                    try {
                        Utils.dispose(enumerator);
                    }
                    finally {
                        Utils.dispose(middleEnumerator);
                    }
                });
        });
    };

    Enumerable.prototype.pairwise = function (selector) {
        var source = this;
        selector = Utils.createLambda(selector);

        return new Enumerable(function () {
            var enumerator;

            return new IEnumerator(
                function () {
                    enumerator = source.getEnumerator();
                    enumerator.moveNext();
                },
                function () {
                    var prev = enumerator.getCurrent();
                    return (enumerator.moveNext())
                        ? this.yieldReturn(selector(prev, enumerator.getCurrent()))
                        : false;
                },
                function () { Utils.dispose(enumerator); });
        });
    };

    // Overload:function (func)
    // Overload:function (seed,func<value,element>)
    Enumerable.prototype.scan = function (seed, func) {
        var isUseSeed;
        if (func == null) {
            func = Utils.createLambda(seed); // arguments[0]
            isUseSeed = false;
        } else {
            func = Utils.createLambda(func);
            isUseSeed = true;
        }
        var source = this;

        return new Enumerable(function () {
            var enumerator;
            var value;
            var isFirst = true;

            return new IEnumerator(
                function () { enumerator = source.getEnumerator(); },
                function () {
                    if (isFirst) {
                        isFirst = false;
                        if (!isUseSeed) {
                            if (enumerator.moveNext()) {
                                return this.yieldReturn(value = enumerator.getCurrent());
                            }
                        }
                        else {
                            return this.yieldReturn(value = seed);
                        }
                    }

                    return (enumerator.moveNext())
                        ? this.yieldReturn(value = func(value, enumerator.getCurrent()))
                        : false;
                },
                function () { Utils.dispose(enumerator); });
        });
    };

    // Overload:function (selector<element>)
    // Overload:function (selector<element,index>)
    Enumerable.prototype.select = function (selector) {
        selector = Utils.createLambda(selector);

        if (selector.length <= 1) {
            return new WhereSelectEnumerable(this, null, selector);
        }
        else {
            var source = this;

            return new Enumerable(function () {
                var enumerator;
                var index = 0;

                return new IEnumerator(
                    function () { enumerator = source.getEnumerator(); },
                    function () {
                        return (enumerator.moveNext())
                            ? this.yieldReturn(selector(enumerator.getCurrent(), index++))
                            : false;
                    },
                    function () { Utils.dispose(enumerator); });
            });
        }
    };

    // Overload:function (collectionSelector<element>)
    // Overload:function (collectionSelector<element,index>)
    // Overload:function (collectionSelector<element>,resultSelector)
    // Overload:function (collectionSelector<element,index>,resultSelector)
    Enumerable.prototype.selectMany = function (collectionSelector, resultSelector) {
        var source = this;
        collectionSelector = Utils.createLambda(collectionSelector);
        if (resultSelector == null) resultSelector = function (a, b) { return b; };
        resultSelector = Utils.createLambda(resultSelector);

        return new Enumerable(function () {
            var enumerator;
            var middleEnumerator = undefined;
            var index = 0;

            return new IEnumerator(
                function () { enumerator = source.getEnumerator(); },
                function () {
                    if (middleEnumerator === undefined) {
                        if (!enumerator.moveNext()) return false;
                    }
                    do {
                        if (middleEnumerator == null) {
                            var middleSeq = collectionSelector(enumerator.getCurrent(), index++);
                            middleEnumerator = Enumerable.from(middleSeq).getEnumerator();
                        }
                        if (middleEnumerator.moveNext()) {
                            return this.yieldReturn(resultSelector(enumerator.getCurrent(), middleEnumerator.getCurrent()));
                        }
                        Utils.dispose(middleEnumerator);
                        middleEnumerator = null;
                    } while (enumerator.moveNext());
                    return false;
                },
                function () {
                    try {
                        Utils.dispose(enumerator);
                    }
                    finally {
                        Utils.dispose(middleEnumerator);
                    }
                });
        });
    };

    // Overload:function (predicate<element>)
    // Overload:function (predicate<element,index>)
    Enumerable.prototype.where = function (predicate) {
        predicate = Utils.createLambda(predicate);

        if (predicate.length <= 1) {
            return new WhereEnumerable(this, predicate);
        }
        else {
            var source = this;

            return new Enumerable(function () {
                var enumerator;
                var index = 0;

                return new IEnumerator(
                    function () { enumerator = source.getEnumerator(); },
                    function () {
                        while (enumerator.moveNext()) {
                            if (predicate(enumerator.getCurrent(), index++)) {
                                return this.yieldReturn(enumerator.getCurrent());
                            }
                        }
                        return false;
                    },
                    function () { Utils.dispose(enumerator); });
            });
        }
    };

    // Overload:function (selector<element>)
    // Overload:function (selector<element,index>)
    Enumerable.prototype.choose = function (selector) {
        selector = Utils.createLambda(selector);
        var source = this;

        return new Enumerable(function () {
            var enumerator;
            var index = 0;

            return new IEnumerator(
                function () { enumerator = source.getEnumerator(); },
                function () {
                    while (enumerator.moveNext()) {
                        var result = selector(enumerator.getCurrent(), index++);
                        if (result != null) {
                            return this.yieldReturn(result);
                        }
                    }
                    return this.yieldBreak();
                },
                function () { Utils.dispose(enumerator); });
        });
    };

    Enumerable.prototype.ofType = function (type) {
        var source = this;

        return new Enumerable(function () {
            var enumerator;

            return new IEnumerator(
                function () {
					enumerator = Bridge.getEnumerator(source);
				},
                function () {
                    while (enumerator.moveNext()) {
                        var v = Bridge.as(enumerator.getCurrent(), type);
                        if (Bridge.hasValue(v)) {
                            return this.yieldReturn(v);
                        }
                    }
                    return false;
                },
                function () {
					Utils.dispose(enumerator);
				});
        });
    };

    // mutiple arguments, last one is selector, others are enumerable
    Enumerable.prototype.zip = function () {
        var args = arguments;
        var selector = Utils.createLambda(arguments[arguments.length - 1]);

        var source = this;
        // optimized case:argument is 2
        if (arguments.length == 2) {
            var second = arguments[0];

            return new Enumerable(function () {
                var firstEnumerator;
                var secondEnumerator;
                var index = 0;

                return new IEnumerator(
                function () {
                    firstEnumerator = source.getEnumerator();
                    secondEnumerator = Enumerable.from(second).getEnumerator();
                },
                function () {
                    if (firstEnumerator.moveNext() && secondEnumerator.moveNext()) {
                        return this.yieldReturn(selector(firstEnumerator.getCurrent(), secondEnumerator.getCurrent(), index++));
                    }
                    return false;
                },
                function () {
                    try {
                        Utils.dispose(firstEnumerator);
                    } finally {
                        Utils.dispose(secondEnumerator);
                    }
                });
            });
        }
        else {
            return new Enumerable(function () {
                var enumerators;
                var index = 0;

                return new IEnumerator(
                function () {
                    var array = Enumerable.make(source)
                        .concat(Enumerable.from(args).takeExceptLast().select(Enumerable.from))
                        .select(function (x) { return x.getEnumerator() })
                        .toArray();
                    enumerators = Enumerable.from(array);
                },
                function () {
                    if (enumerators.all(function (x) { return x.moveNext() })) {
                        var array = enumerators
                            .select(function (x) { return x.getCurrent() })
                            .toArray();
                        array.push(index++);
                        return this.yieldReturn(selector.apply(null, array));
                    }
                    else {
                        return this.yieldBreak();
                    }
                },
                function () {
                    Enumerable.from(enumerators).forEach(Utils.dispose);
                });
            });
        }
    };

    // mutiple arguments
    Enumerable.prototype.merge = function () {
        var args = arguments;
        var source = this;

        return new Enumerable(function () {
            var enumerators;
            var index = -1;

            return new IEnumerator(
                function () {
                    enumerators = Enumerable.make(source)
                        .concat(Enumerable.from(args).select(Enumerable.from))
                        .select(function (x) { return x.getEnumerator() })
                        .toArray();
                },
                function () {
                    while (enumerators.length > 0) {
                        index = (index >= enumerators.length - 1) ? 0 : index + 1;
                        var enumerator = enumerators[index];

                        if (enumerator.moveNext()) {
                            return this.yieldReturn(enumerator.getCurrent());
                        }
                        else {
                            enumerator.dispose();
                            enumerators.splice(index--, 1);
                        }
                    }
                    return this.yieldBreak();
                },
                function () {
                    Enumerable.from(enumerators).forEach(Utils.dispose);
                });
        });
    };

    /* Join Methods */

    // Overload:function (inner, outerKeySelector, innerKeySelector, resultSelector)
    // Overload:function (inner, outerKeySelector, innerKeySelector, resultSelector, compareSelector)
    Enumerable.prototype.join = function (inner, outerKeySelector, innerKeySelector, resultSelector, comparer) {
        outerKeySelector = Utils.createLambda(outerKeySelector);
        innerKeySelector = Utils.createLambda(innerKeySelector);
        resultSelector = Utils.createLambda(resultSelector);

        var source = this;

        return new Enumerable(function () {
            var outerEnumerator;
            var lookup;
            var innerElements = null;
            var innerCount = 0;

            return new IEnumerator(
                function () {
                    outerEnumerator = source.getEnumerator();
                    lookup = Enumerable.from(inner).toLookup(innerKeySelector, Functions.Identity, comparer);
                },
                function () {
                    while (true) {
                        if (innerElements != null) {
                            var innerElement = innerElements[innerCount++];
                            if (innerElement !== undefined) {
                                return this.yieldReturn(resultSelector(outerEnumerator.getCurrent(), innerElement));
                            }

                            innerElement = null;
                            innerCount = 0;
                        }

                        if (outerEnumerator.moveNext()) {
                            var key = outerKeySelector(outerEnumerator.getCurrent());
                            innerElements = lookup.get(key).toArray();
                        } else {
                            return false;
                        }
                    }
                },
                function () { Utils.dispose(outerEnumerator); });
        });
    };

    // Overload:function (inner, outerKeySelector, innerKeySelector, resultSelector)
    // Overload:function (inner, outerKeySelector, innerKeySelector, resultSelector, compareSelector)
    Enumerable.prototype.groupJoin = function (inner, outerKeySelector, innerKeySelector, resultSelector, comparer) {
        outerKeySelector = Utils.createLambda(outerKeySelector);
        innerKeySelector = Utils.createLambda(innerKeySelector);
        resultSelector = Utils.createLambda(resultSelector);
        var source = this;

        return new Enumerable(function () {
            var enumerator = source.getEnumerator();
            var lookup = null;

            return new IEnumerator(
                function () {
                    enumerator = source.getEnumerator();
                    lookup = Enumerable.from(inner).toLookup(innerKeySelector, Functions.Identity, comparer);
                },
                function () {
                    if (enumerator.moveNext()) {
                        var innerElement = lookup.get(outerKeySelector(enumerator.getCurrent()));
                        return this.yieldReturn(resultSelector(enumerator.getCurrent(), innerElement));
                    }
                    return false;
                },
                function () { Utils.dispose(enumerator); });
        });
    };

    /* Set Methods */

    Enumerable.prototype.all = function (predicate) {
        predicate = Utils.createLambda(predicate);

        var result = true;
        this.forEach(function (x) {
            if (!predicate(x)) {
                result = false;
                return false; // break
            }
        });
        return result;
    };

    // Overload:function ()
    // Overload:function (predicate)
    Enumerable.prototype.any = function (predicate) {
        predicate = Utils.createLambda(predicate);

        var enumerator = this.getEnumerator();
        try {
            if (arguments.length == 0) return enumerator.moveNext(); // case:function ()

            while (enumerator.moveNext()) // case:function (predicate)
            {
                if (predicate(enumerator.getCurrent())) return true;
            }
            return false;
        }
        finally {
            Utils.dispose(enumerator);
        }
    };

    Enumerable.prototype.isEmpty = function () {
        return !this.any();
    };

    // multiple arguments
    Enumerable.prototype.concat = function () {
        var source = this;

        if (arguments.length == 1) {
            var second = arguments[0];

            return new Enumerable(function () {
                var firstEnumerator;
                var secondEnumerator;

                return new IEnumerator(
                function () { firstEnumerator = source.getEnumerator(); },
                function () {
                    if (secondEnumerator == null) {
                        if (firstEnumerator.moveNext()) return this.yieldReturn(firstEnumerator.getCurrent());
                        secondEnumerator = Enumerable.from(second).getEnumerator();
                    }
                    if (secondEnumerator.moveNext()) return this.yieldReturn(secondEnumerator.getCurrent());
                    return false;
                },
                function () {
                    try {
                        Utils.dispose(firstEnumerator);
                    }
                    finally {
                        Utils.dispose(secondEnumerator);
                    }
                });
            });
        }
        else {
            var args = arguments;

            return new Enumerable(function () {
                var enumerators;

                return new IEnumerator(
                    function () {
                        enumerators = Enumerable.make(source)
                            .concat(Enumerable.from(args).select(Enumerable.from))
                            .select(function (x) { return x.getEnumerator() })
                            .toArray();
                    },
                    function () {
                        while (enumerators.length > 0) {
                            var enumerator = enumerators[0];

                            if (enumerator.moveNext()) {
                                return this.yieldReturn(enumerator.getCurrent());
                            }
                            else {
                                enumerator.dispose();
                                enumerators.splice(0, 1);
                            }
                        }
                        return this.yieldBreak();
                    },
                    function () {
                        Enumerable.from(enumerators).forEach(Utils.dispose);
                    });
            });
        }
    };

    Enumerable.prototype.insert = function (index, second) {
        var source = this;

        return new Enumerable(function () {
            var firstEnumerator;
            var secondEnumerator;
            var count = 0;
            var isEnumerated = false;

            return new IEnumerator(
                function () {
                    firstEnumerator = source.getEnumerator();
                    secondEnumerator = Enumerable.from(second).getEnumerator();
                },
                function () {
                    if (count == index && secondEnumerator.moveNext()) {
                        isEnumerated = true;
                        return this.yieldReturn(secondEnumerator.getCurrent());
                    }
                    if (firstEnumerator.moveNext()) {
                        count++;
                        return this.yieldReturn(firstEnumerator.getCurrent());
                    }
                    if (!isEnumerated && secondEnumerator.moveNext()) {
                        return this.yieldReturn(secondEnumerator.getCurrent());
                    }
                    return false;
                },
                function () {
                    try {
                        Utils.dispose(firstEnumerator);
                    }
                    finally {
                        Utils.dispose(secondEnumerator);
                    }
                });
        });
    };

    Enumerable.prototype.alternate = function (alternateValueOrSequence) {
        var source = this;

        return new Enumerable(function () {
            var buffer;
            var enumerator;
            var alternateSequence;
            var alternateEnumerator;

            return new IEnumerator(
                function () {
                    if (alternateValueOrSequence instanceof Array || alternateValueOrSequence.getEnumerator != null) {
                        alternateSequence = Enumerable.from(Enumerable.from(alternateValueOrSequence).toArray()); // freeze
                    }
                    else {
                        alternateSequence = Enumerable.make(alternateValueOrSequence);
                    }
                    enumerator = source.getEnumerator();
                    if (enumerator.moveNext()) buffer = enumerator.getCurrent();
                },
                function () {
                    while (true) {
                        if (alternateEnumerator != null) {
                            if (alternateEnumerator.moveNext()) {
                                return this.yieldReturn(alternateEnumerator.getCurrent());
                            }
                            else {
                                alternateEnumerator = null;
                            }
                        }

                        if (buffer == null && enumerator.moveNext()) {
                            buffer = enumerator.getCurrent(); // hasNext
                            alternateEnumerator = alternateSequence.getEnumerator();
                            continue; // GOTO
                        }
                        else if (buffer != null) {
                            var retVal = buffer;
                            buffer = null;
                            return this.yieldReturn(retVal);
                        }

                        return this.yieldBreak();
                    }
                },
                function () {
                    try {
                        Utils.dispose(enumerator);
                    }
                    finally {
                        Utils.dispose(alternateEnumerator);
                    }
                });
        });
    };

    // Overload:function (value)
    // Overload:function (value, compareSelector)
    Enumerable.prototype.contains = function (value, comparer) {
        comparer = comparer || System.Collections.Generic.EqualityComparer$1.$default;
        var enumerator = this.getEnumerator();
        try {
            while (enumerator.moveNext()) {
                if (comparer.equals2(enumerator.getCurrent(), value)) return true;
            }
            return false;
        }
        finally {
            Utils.dispose(enumerator);
        }
    };

    Enumerable.prototype.defaultIfEmpty = function (defaultValue) {
        var source = this;
        if (defaultValue === undefined) defaultValue = null;

        return new Enumerable(function () {
            var enumerator;
            var isFirst = true;

            return new IEnumerator(
                function () { enumerator = source.getEnumerator(); },
                function () {
                    if (enumerator.moveNext()) {
                        isFirst = false;
                        return this.yieldReturn(enumerator.getCurrent());
                    }
                    else if (isFirst) {
                        isFirst = false;
                        return this.yieldReturn(defaultValue);
                    }
                    return false;
                },
                function () { Utils.dispose(enumerator); });
        });
    };

    // Overload:function ()
    // Overload:function (compareSelector)
    Enumerable.prototype.distinct = function (comparer) {
        return this.except(Enumerable.empty(), comparer);
    };

    Enumerable.prototype.distinctUntilChanged = function (compareSelector) {
        compareSelector = Utils.createLambda(compareSelector);
        var source = this;

        return new Enumerable(function () {
            var enumerator;
            var compareKey;
            var initial;

            return new IEnumerator(
                function () {
                    enumerator = source.getEnumerator();
                },
                function () {
                    while (enumerator.moveNext()) {
                        var key = compareSelector(enumerator.getCurrent());

                        if (initial) {
                            initial = false;
                            compareKey = key;
                            return this.yieldReturn(enumerator.getCurrent());
                        }

                        if (compareKey === key) {
                            continue;
                        }

                        compareKey = key;
                        return this.yieldReturn(enumerator.getCurrent());
                    }
                    return this.yieldBreak();
                },
                function () { Utils.dispose(enumerator); });
        });
    };

    // Overload:function (second)
    // Overload:function (second, compareSelector)
    Enumerable.prototype.except = function (second, comparer) {
        var source = this;

        return new Enumerable(function () {
            var enumerator;
            var keys;

            return new IEnumerator(
                function () {
                    enumerator = source.getEnumerator();
                    keys = new (System.Collections.Generic.Dictionary$2(Object, Object))(null, comparer);
                    Enumerable.from(second).forEach(function (key) { if (!keys.containsKey(key)) { keys.add(key); } });
                },
                function () {
                    while (enumerator.moveNext()) {
                        var current = enumerator.getCurrent();
                        if (!keys.containsKey(current)) {
                            keys.add(current);
                            return this.yieldReturn(current);
                        }
                    }
                    return false;
                },
                function () { Utils.dispose(enumerator); });
        });
    };

    // Overload:function (second)
    // Overload:function (second, compareSelector)
    Enumerable.prototype.intersect = function (second, comparer) {
        var source = this;

        return new Enumerable(function () {
            var enumerator;
            var keys;
            var outs;

            return new IEnumerator(
                function () {
                    enumerator = source.getEnumerator();

                    keys = new (System.Collections.Generic.Dictionary$2(Object, Object))(null, comparer);
                    Enumerable.from(second).forEach(function (key) { if (!keys.containsKey(key)) { keys.add(key); } });
                    outs = new (System.Collections.Generic.Dictionary$2(Object, Object))(null, comparer);
                },
                function () {
                    while (enumerator.moveNext()) {
                        var current = enumerator.getCurrent();
                        if (!outs.containsKey(current) && keys.containsKey(current)) {
                            outs.add(current);
                            return this.yieldReturn(current);
                        }
                    }
                    return false;
                },
                function () { Utils.dispose(enumerator); });
        });
    };

    // Overload:function (second)
    // Overload:function (second, compareSelector)
    Enumerable.prototype.sequenceEqual = function (second, comparer) {
        comparer = comparer || System.Collections.Generic.EqualityComparer$1.$default;

        var firstEnumerator = this.getEnumerator();
        try {
            var secondEnumerator = Enumerable.from(second).getEnumerator();
            try {
                while (firstEnumerator.moveNext()) {
                    if (!secondEnumerator.moveNext()
                    || !comparer.equals2(firstEnumerator.getCurrent(), secondEnumerator.getCurrent())) {
                        return false;
                    }
                }

                if (secondEnumerator.moveNext()) return false;
                return true;
            }
            finally {
                Utils.dispose(secondEnumerator);
            }
        }
        finally {
            Utils.dispose(firstEnumerator);
        }
    };

    Enumerable.prototype.union = function (second, comparer) {
        var source = this;

        return new Enumerable(function () {
            var firstEnumerator;
            var secondEnumerator;
            var keys;

            return new IEnumerator(
                function () {
                    firstEnumerator = source.getEnumerator();
                    keys = new (System.Collections.Generic.Dictionary$2(Object, Object))(null, comparer);
                },
                function () {
                    var current;
                    if (secondEnumerator === undefined) {
                        while (firstEnumerator.moveNext()) {
                            current = firstEnumerator.getCurrent();
                            if (!keys.containsKey(current)) {
                                keys.add(current);
                                return this.yieldReturn(current);
                            }
                        }
                        secondEnumerator = Enumerable.from(second).getEnumerator();
                    }
                    while (secondEnumerator.moveNext()) {
                        current = secondEnumerator.getCurrent();
                        if (!keys.containsKey(current)) {
                            keys.add(current);
                            return this.yieldReturn(current);
                        }
                    }
                    return false;
                },
                function () {
                    try {
                        Utils.dispose(firstEnumerator);
                    }
                    finally {
                        Utils.dispose(secondEnumerator);
                    }
                });
        });
    };

    /* Ordering Methods */

    Enumerable.prototype.orderBy = function (keySelector, comparer) {
        return new OrderedEnumerable(this, keySelector, comparer, false);
    };

    Enumerable.prototype.orderByDescending = function (keySelector, comparer) {
        return new OrderedEnumerable(this, keySelector, comparer, true);
    };

    Enumerable.prototype.reverse = function () {
        var source = this;

        return new Enumerable(function () {
            var buffer;
            var index;

            return new IEnumerator(
                function () {
                    buffer = source.toArray();
                    index = buffer.length;
                },
                function () {
                    return (index > 0)
                        ? this.yieldReturn(buffer[--index])
                        : false;
                },
                Functions.Blank);
        });
    };

    Enumerable.prototype.shuffle = function () {
        var source = this;

        return new Enumerable(function () {
            var buffer;

            return new IEnumerator(
                function () { buffer = source.toArray(); },
                function () {
                    if (buffer.length > 0) {
                        var i = Math.floor(Math.random() * buffer.length);
                        return this.yieldReturn(buffer.splice(i, 1)[0]);
                    }
                    return false;
                },
                Functions.Blank);
        });
    };

    Enumerable.prototype.weightedSample = function (weightSelector) {
        weightSelector = Utils.createLambda(weightSelector);
        var source = this;

        return new Enumerable(function () {
            var sortedByBound;
            var totalWeight = 0;

            return new IEnumerator(
                function () {
                    sortedByBound = source
                        .choose(function (x) {
                            var weight = weightSelector(x);
                            if (weight <= 0) return null; // ignore 0

                            totalWeight += weight;
                            return { value: x, bound: totalWeight };
                        })
                        .toArray();
                },
                function () {
                    if (sortedByBound.length > 0) {
                        var draw = Math.floor(Math.random() * totalWeight) + 1;

                        var lower = -1;
                        var upper = sortedByBound.length;
                        while (upper - lower > 1) {
                            var index = Math.floor((lower + upper) / 2);
                            if (sortedByBound[index].bound >= draw) {
                                upper = index;
                            }
                            else {
                                lower = index;
                            }
                        }

                        return this.yieldReturn(sortedByBound[upper].value);
                    }

                    return this.yieldBreak();
                },
                Functions.Blank);
        });
    };

    /* Grouping Methods */

    // Overload:function (keySelector)
    // Overload:function (keySelector,elementSelector)
    // Overload:function (keySelector,elementSelector,resultSelector)
    // Overload:function (keySelector,elementSelector,resultSelector,compareSelector)
    Enumerable.prototype.groupBy = function (keySelector, elementSelector, resultSelector, comparer) {
        var source = this;
        keySelector = Utils.createLambda(keySelector);
        elementSelector = Utils.createLambda(elementSelector);
        if (resultSelector != null) resultSelector = Utils.createLambda(resultSelector);

        return new Enumerable(function () {
            var enumerator;

            return new IEnumerator(
                function () {
                    enumerator = source.toLookup(keySelector, elementSelector, comparer)
                        .toEnumerable()
                        .getEnumerator();
                },
                function () {
                    while (enumerator.moveNext()) {
                        return (resultSelector == null)
                            ? this.yieldReturn(enumerator.getCurrent())
                            : this.yieldReturn(resultSelector(enumerator.getCurrent().key(), enumerator.getCurrent()));
                    }
                    return false;
                },
                function () { Utils.dispose(enumerator); });
        });
    };

    // Overload:function (keySelector)
    // Overload:function (keySelector,elementSelector)
    // Overload:function (keySelector,elementSelector,resultSelector)
    // Overload:function (keySelector,elementSelector,resultSelector,compareSelector)
    Enumerable.prototype.partitionBy = function (keySelector, elementSelector, resultSelector, comparer) {
        var source = this;
        keySelector = Utils.createLambda(keySelector);
        elementSelector = Utils.createLambda(elementSelector);
        comparer = comparer || System.Collections.Generic.EqualityComparer$1.$default;
        var hasResultSelector;
        if (resultSelector == null) {
            hasResultSelector = false;
            resultSelector = function (key, group) { return new Grouping(key, group); };
        }
        else {
            hasResultSelector = true;
            resultSelector = Utils.createLambda(resultSelector);
        }

        return new Enumerable(function () {
            var enumerator;
            var key;
            var group = [];

            return new IEnumerator(
                function () {
                    enumerator = source.getEnumerator();
                    if (enumerator.moveNext()) {
                        key = keySelector(enumerator.getCurrent());
                        group.push(elementSelector(enumerator.getCurrent()));
                    }
                },
                function () {
                    var hasNext;
                    while ((hasNext = enumerator.moveNext()) == true) {
                        if (comparer.equals2(key, keySelector(enumerator.getCurrent()))) {
                            group.push(elementSelector(enumerator.getCurrent()));
                        }
                        else break;
                    }

                    if (group.length > 0) {
                        var result = (hasResultSelector)
                            ? resultSelector(key, Enumerable.from(group))
                            : resultSelector(key, group);
                        if (hasNext) {
                            key = keySelector(enumerator.getCurrent());
                            group = [elementSelector(enumerator.getCurrent())];
                        }
                        else group = [];

                        return this.yieldReturn(result);
                    }

                    return false;
                },
                function () { Utils.dispose(enumerator); });
        });
    };

    Enumerable.prototype.buffer = function (count) {
        var source = this;

        return new Enumerable(function () {
            var enumerator;

            return new IEnumerator(
                function () { enumerator = source.getEnumerator(); },
                function () {
                    var array = [];
                    var index = 0;
                    while (enumerator.moveNext()) {
                        array.push(enumerator.getCurrent());
                        if (++index >= count) return this.yieldReturn(array);
                    }
                    if (array.length > 0) return this.yieldReturn(array);
                    return false;
                },
                function () { Utils.dispose(enumerator); });
        });
    };

    /* Aggregate Methods */

    // Overload:function (func)
    // Overload:function (seed,func)
    // Overload:function (seed,func,resultSelector)
    Enumerable.prototype.aggregate = function (seed, func, resultSelector) {
        resultSelector = Utils.createLambda(resultSelector);
        return resultSelector(this.scan(seed, func, resultSelector).last());
    };

    // Overload:function ()
    // Overload:function (selector)
    Enumerable.prototype.average = function (selector, def) {
        if (selector && !def && !Bridge.isFunction(selector)) {
            def = selector;
            selector = null;
        }

        selector = Utils.createLambda(selector);

        var sum = def || 0;
        var count = 0;
        this.forEach(function (x) {
            x = selector(x);

            if (x instanceof System.Decimal || System.Int64.is64Bit(x)) {
                sum = x.add(sum);
            }
            else if (sum instanceof System.Decimal || System.Int64.is64Bit(sum)) {
                sum = sum.add(x);
            } else {
                sum += x;
            }

            ++count;
        });

        if (count === 0) {
            throw new System.InvalidOperationException("Sequence contains no elements");
        }

        return (sum instanceof System.Decimal || System.Int64.is64Bit(sum)) ? sum.div(count) : (sum / count);
    };

    Enumerable.prototype.nullableAverage = function (selector, def) {
        if (this.any(Bridge.isNull)) {
            return null;
        }

        return this.average(selector, def);
    };

    // Overload:function ()
    // Overload:function (predicate)
    Enumerable.prototype.count = function (predicate) {
        predicate = (predicate == null) ? Functions.True : Utils.createLambda(predicate);

        var count = 0;
        this.forEach(function (x, i) {
            if (predicate(x, i))++count;
        });
        return count;
    };

    // Overload:function ()
    // Overload:function (selector)
    Enumerable.prototype.max = function (selector) {
        if (selector == null) selector = Functions.Identity;
        return this.select(selector).aggregate(function (a, b) {
            return (Bridge.compare(a, b, true) === 1) ? a : b;
        });
    };

    Enumerable.prototype.nullableMax = function (selector) {
        if (this.any(Bridge.isNull)) {
            return null;
        }

        return this.max(selector);
    };

    // Overload:function ()
    // Overload:function (selector)
    Enumerable.prototype.min = function (selector) {
        if (selector == null) selector = Functions.Identity;
        return this.select(selector).aggregate(function (a, b) {
            return (Bridge.compare(a, b, true) === -1) ? a : b;
        });
    };

    Enumerable.prototype.nullableMin = function (selector) {
        if (this.any(Bridge.isNull)) {
            return null;
        }

        return this.min(selector);
    };

    Enumerable.prototype.maxBy = function (keySelector) {
        keySelector = Utils.createLambda(keySelector);
        return this.aggregate(function (a, b) {
            return (Bridge.compare(keySelector(a), keySelector(b), true) === 1) ? a : b;
        });
    };

    Enumerable.prototype.minBy = function (keySelector) {
        keySelector = Utils.createLambda(keySelector);
        return this.aggregate(function (a, b) {
            return (Bridge.compare(keySelector(a), keySelector(b), true) === -1) ? a : b;
        });
    };

    // Overload:function ()
    // Overload:function (selector)
    Enumerable.prototype.sum = function (selector, def) {
        if (selector && !def && !Bridge.isFunction(selector)) {
            def = selector;
            selector = null;
        }

        if (selector == null) selector = Functions.Identity;
        var s = this.select(selector).aggregate(0, function (a, b) {
             if (a instanceof System.Decimal || System.Int64.is64Bit(a)) {
                 return a.add(b);
             }
             if (b instanceof System.Decimal || System.Int64.is64Bit(b)) {
                 return b.add(a);
             }
             return a + b;
        });

        if (s === 0 && def) {
            return def;
        }

        return s;
    };

    Enumerable.prototype.nullableSum = function (selector, def) {
        if (this.any(Bridge.isNull)) {
            return null;
        }

        return this.sum(selector, def);
    };

    /* Paging Methods */

    Enumerable.prototype.elementAt = function (index) {
        var value;
        var found = false;
        this.forEach(function (x, i) {
            if (i == index) {
                value = x;
                found = true;
                return false;
            }
        });

        if (!found) throw new Error("index is less than 0 or greater than or equal to the number of elements in source.");
        return value;
    };

    Enumerable.prototype.elementAtOrDefault = function (index, defaultValue) {
        if (defaultValue === undefined) defaultValue = null;
        var value;
        var found = false;
        this.forEach(function (x, i) {
            if (i == index) {
                value = x;
                found = true;
                return false;
            }
        });

        return (!found) ? defaultValue : value;
    };

    // Overload:function ()
    // Overload:function (predicate)
    Enumerable.prototype.first = function (predicate) {
        if (predicate != null) return this.where(predicate).first();

        var value;
        var found = false;
        this.forEach(function (x) {
            value = x;
            found = true;
            return false;
        });

        if (!found) throw new Error("first:No element satisfies the condition.");
        return value;
    };

    Enumerable.prototype.firstOrDefault = function (predicate, defaultValue) {
        if (defaultValue === undefined) defaultValue = null;
        if (predicate != null) return this.where(predicate).firstOrDefault(null, defaultValue);

        var value;
        var found = false;
        this.forEach(function (x) {
            value = x;
            found = true;
            return false;
        });
        return (!found) ? defaultValue : value;
    };

    // Overload:function ()
    // Overload:function (predicate)
    Enumerable.prototype.last = function (predicate) {
        if (predicate != null) return this.where(predicate).last();

        var value;
        var found = false;
        this.forEach(function (x) {
            found = true;
            value = x;
        });

        if (!found) throw new Error("last:No element satisfies the condition.");
        return value;
    };

    // Overload:function (defaultValue)
    // Overload:function (defaultValue,predicate)
    Enumerable.prototype.lastOrDefault = function (predicate, defaultValue) {
        if (defaultValue === undefined) defaultValue = null;
        if (predicate != null) return this.where(predicate).lastOrDefault(null, defaultValue);

        var value;
        var found = false;
        this.forEach(function (x) {
            found = true;
            value = x;
        });
        return (!found) ? defaultValue : value;
    };

    // Overload:function ()
    // Overload:function (predicate)
    Enumerable.prototype.single = function (predicate) {
        if (predicate != null) return this.where(predicate).single();

        var value;
        var found = false;
        this.forEach(function (x) {
            if (!found) {
                found = true;
                value = x;
            } else throw new Error("single:sequence contains more than one element.");
        });

        if (!found) throw new Error("single:No element satisfies the condition.");
        return value;
    };

    // Overload:function (defaultValue)
    // Overload:function (defaultValue,predicate)
    Enumerable.prototype.singleOrDefault = function (predicate, defaultValue) {
        if (defaultValue === undefined) defaultValue = null;
        if (predicate != null) return this.where(predicate).singleOrDefault(null, defaultValue);

        var value;
        var found = false;
        this.forEach(function (x) {
            if (!found) {
                found = true;
                value = x;
            } else throw new Error("single:sequence contains more than one element.");
        });

        return (!found) ? defaultValue : value;
    };

    Enumerable.prototype.skip = function (count) {
        var source = this;

        return new Enumerable(function () {
            var enumerator;
            var index = 0;

            return new IEnumerator(
                function () {
                    enumerator = source.getEnumerator();
                    while (index++ < count && enumerator.moveNext()) {
                    }
                    ;
                },
                function () {
                    return (enumerator.moveNext())
                        ? this.yieldReturn(enumerator.getCurrent())
                        : false;
                },
                function () { Utils.dispose(enumerator); });
        });
    };

    // Overload:function (predicate<element>)
    // Overload:function (predicate<element,index>)
    Enumerable.prototype.skipWhile = function (predicate) {
        predicate = Utils.createLambda(predicate);
        var source = this;

        return new Enumerable(function () {
            var enumerator;
            var index = 0;
            var isSkipEnd = false;

            return new IEnumerator(
                function () { enumerator = source.getEnumerator(); },
                function () {
                    while (!isSkipEnd) {
                        if (enumerator.moveNext()) {
                            if (!predicate(enumerator.getCurrent(), index++)) {
                                isSkipEnd = true;
                                return this.yieldReturn(enumerator.getCurrent());
                            }
                            continue;
                        } else return false;
                    }

                    return (enumerator.moveNext())
                        ? this.yieldReturn(enumerator.getCurrent())
                        : false;
                },
                function () { Utils.dispose(enumerator); });
        });
    };

    Enumerable.prototype.take = function (count) {
        var source = this;

        return new Enumerable(function () {
            var enumerator;
            var index = 0;

            return new IEnumerator(
                function () { enumerator = source.getEnumerator(); },
                function () {
                    return (index++ < count && enumerator.moveNext())
                        ? this.yieldReturn(enumerator.getCurrent())
                        : false;
                },
                function () { Utils.dispose(enumerator); }
            );
        });
    };

    // Overload:function (predicate<element>)
    // Overload:function (predicate<element,index>)
    Enumerable.prototype.takeWhile = function (predicate) {
        predicate = Utils.createLambda(predicate);
        var source = this;

        return new Enumerable(function () {
            var enumerator;
            var index = 0;

            return new IEnumerator(
                function () { enumerator = source.getEnumerator(); },
                function () {
                    return (enumerator.moveNext() && predicate(enumerator.getCurrent(), index++))
                        ? this.yieldReturn(enumerator.getCurrent())
                        : false;
                },
                function () { Utils.dispose(enumerator); });
        });
    };

    // Overload:function ()
    // Overload:function (count)
    Enumerable.prototype.takeExceptLast = function (count) {
        if (count == null) count = 1;
        var source = this;

        return new Enumerable(function () {
            if (count <= 0) return source.getEnumerator(); // do nothing

            var enumerator;
            var q = [];

            return new IEnumerator(
                function () { enumerator = source.getEnumerator(); },
                function () {
                    while (enumerator.moveNext()) {
                        if (q.length == count) {
                            q.push(enumerator.getCurrent());
                            return this.yieldReturn(q.shift());
                        }
                        q.push(enumerator.getCurrent());
                    }
                    return false;
                },
                function () { Utils.dispose(enumerator); });
        });
    };

    Enumerable.prototype.takeFromLast = function (count) {
        if (count <= 0 || count == null) return Enumerable.empty();
        var source = this;

        return new Enumerable(function () {
            var sourceEnumerator;
            var enumerator;
            var q = [];

            return new IEnumerator(
                function () { sourceEnumerator = source.getEnumerator(); },
                function () {
                    if (enumerator == null) {
	                    while (sourceEnumerator.moveNext()) {
	                        if (q.length == count) q.shift();
	                        q.push(sourceEnumerator.getCurrent());
	                    }
                        enumerator = Enumerable.from(q).getEnumerator();
                    }
                    return (enumerator.moveNext())
                        ? this.yieldReturn(enumerator.getCurrent())
                        : false;
                },
                function () { Utils.dispose(enumerator); });
        });
    };

    // Overload:function (item)
    // Overload:function (predicate)
    Enumerable.prototype.indexOf = function (item, comparer) {
        var found = null;

        // item as predicate
        if (typeof (item) === Types.Function) {
            this.forEach(function (x, i) {
                if (item(x, i)) {
                    found = i;
                    return false;
                }
            });
        }
        else {
            comparer = comparer || System.Collections.Generic.EqualityComparer$1.$default;
            this.forEach(function (x, i) {
                if (comparer.equals2(x, item)) {
                    found = i;
                    return false;
                }
            });
        }

        return (found !== null) ? found : -1;
    };

    // Overload:function (item)
    // Overload:function (predicate)
    Enumerable.prototype.lastIndexOf = function (item, comparer) {
        var result = -1;

        // item as predicate
        if (typeof (item) === Types.Function) {
            this.forEach(function (x, i) {
                if (item(x, i)) result = i;
            });
        }
        else {
            comparer = comparer || System.Collections.Generic.EqualityComparer$1.$default;
            this.forEach(function (x, i) {
                if (comparer.equals2(x, item)) result = i;
            });
        }

        return result;
    };

    /* Convert Methods */

    Enumerable.prototype.asEnumerable = function () {
        return Enumerable.from(this);
    };

    Enumerable.prototype.toArray = function () {
        var array = [];
        this.forEach(function (x) { array.push(x); });
        return array;
    };

    Enumerable.prototype.toList = function (T) {
        var array = [];
        this.forEach(function (x) { array.push(x); });
        return new (System.Collections.Generic.List$1(T || Object))(array);
    };

    // Overload:function (keySelector)
    // Overload:function (keySelector, elementSelector)
    // Overload:function (keySelector, elementSelector, compareSelector)
    Enumerable.prototype.toLookup = function (keySelector, elementSelector, comparer) {
        keySelector = Utils.createLambda(keySelector);
        elementSelector = Utils.createLambda(elementSelector);

        var dict = new (System.Collections.Generic.Dictionary$2(Object, Object))(null, comparer);
        var order = [];
        this.forEach(function (x) {
            var key = keySelector(x);
            var element = elementSelector(x);

            var array = { v: null };
            if (dict.tryGetValue(key, array)) {
                array.v.push(element);
            }
            else {
                order.push(key);
                dict.add(key, [element]);
            }
        });
        return new Lookup(dict, order);
    };

    Enumerable.prototype.toObject = function (keySelector, elementSelector) {
        keySelector = Utils.createLambda(keySelector);
        elementSelector = Utils.createLambda(elementSelector);

        var obj = {};
        this.forEach(function (x) {
            obj[keySelector(x)] = elementSelector(x);
        });
        return obj;
    };

    // Overload:function (keySelector, elementSelector)
    // Overload:function (keySelector, elementSelector, compareSelector)
    Enumerable.prototype.toDictionary = function (keySelector, elementSelector, keyType, valueType, comparer) {
        keySelector = Utils.createLambda(keySelector);
        elementSelector = Utils.createLambda(elementSelector);

        var dict = new (System.Collections.Generic.Dictionary$2(keyType, valueType))(null, comparer);
        this.forEach(function (x) {
            dict.add(keySelector(x), elementSelector(x));
        });
        return dict;
    };

    // Overload:function ()
    // Overload:function (replacer)
    // Overload:function (replacer, space)
    Enumerable.prototype.toJSONString = function (replacer, space) {
        if (typeof JSON === Types.Undefined || JSON.stringify == null) {
            throw new Error("toJSONString can't find JSON.stringify. This works native JSON support Browser or include json2.js");
        }
        return JSON.stringify(this.toArray(), replacer, space);
    };

    // Overload:function ()
    // Overload:function (separator)
    // Overload:function (separator,selector)
    Enumerable.prototype.toJoinedString = function (separator, selector) {
        if (separator == null) separator = "";
        if (selector == null) selector = Functions.Identity;

        return this.select(selector).toArray().join(separator);
    };

    /* Action Methods */

    // Overload:function (action<element>)
    // Overload:function (action<element,index>)
    Enumerable.prototype.doAction = function (action) {
        var source = this;
        action = Utils.createLambda(action);

        return new Enumerable(function () {
            var enumerator;
            var index = 0;

            return new IEnumerator(
                function () { enumerator = source.getEnumerator(); },
                function () {
                    if (enumerator.moveNext()) {
                        action(enumerator.getCurrent(), index++);
                        return this.yieldReturn(enumerator.getCurrent());
                    }
                    return false;
                },
                function () { Utils.dispose(enumerator); });
        });
    };

    // Overload:function (action<element>)
    // Overload:function (action<element,index>)
    // Overload:function (func<element,bool>)
    // Overload:function (func<element,index,bool>)
    Enumerable.prototype.forEach = function (action) {
        action = Utils.createLambda(action);

        var index = 0;
        var enumerator = this.getEnumerator();
        try {
            while (enumerator.moveNext()) {
                if (action(enumerator.getCurrent(), index++) === false) break;
            }
        } finally {
            Utils.dispose(enumerator);
        }
    };

    // Overload:function ()
    // Overload:function (separator)
    // Overload:function (separator,selector)
    Enumerable.prototype.write = function (separator, selector) {
        if (separator == null) separator = "";
        selector = Utils.createLambda(selector);

        var isFirst = true;
        this.forEach(function (item) {
            if (isFirst) isFirst = false;
            else document.write(separator);
            document.write(selector(item));
        });
    };

    // Overload:function ()
    // Overload:function (selector)
    Enumerable.prototype.writeLine = function (selector) {
        selector = Utils.createLambda(selector);

        this.forEach(function (item) {
            document.writeln(selector(item) + "<br />");
        });
    };

    Enumerable.prototype.force = function () {
        var enumerator = this.getEnumerator();

        try {
            while (enumerator.moveNext()) {
            }
        }
        finally {
            Utils.dispose(enumerator);
        }
    };

    /* Functional Methods */

    Enumerable.prototype.letBind = function (func) {
        func = Utils.createLambda(func);
        var source = this;

        return new Enumerable(function () {
            var enumerator;

            return new IEnumerator(
                function () {
                    enumerator = Enumerable.from(func(source)).getEnumerator();
                },
                function () {
                    return (enumerator.moveNext())
                        ? this.yieldReturn(enumerator.getCurrent())
                        : false;
                },
                function () { Utils.dispose(enumerator); });
        });
    };

    Enumerable.prototype.share = function () {
        var source = this;
        var sharedEnumerator;
        var disposed = false;

        return new DisposableEnumerable(function () {
            return new IEnumerator(
                function () {
                    if (sharedEnumerator == null) {
                        sharedEnumerator = source.getEnumerator();
                    }
                },
                function () {
                    if (disposed) throw new Error("enumerator is disposed");

                    return (sharedEnumerator.moveNext())
                        ? this.yieldReturn(sharedEnumerator.getCurrent())
                        : false;
                },
                Functions.Blank
            );
        }, function () {
            disposed = true;
            Utils.dispose(sharedEnumerator);
        });
    };

    Enumerable.prototype.memoize = function () {
        var source = this;
        var cache;
        var enumerator;
        var disposed = false;

        return new DisposableEnumerable(function () {
            var index = -1;

            return new IEnumerator(
                function () {
                    if (enumerator == null) {
                        enumerator = source.getEnumerator();
                        cache = [];
                    }
                },
                function () {
                    if (disposed) throw new Error("enumerator is disposed");

                    index++;
                    if (cache.length <= index) {
                        return (enumerator.moveNext())
                            ? this.yieldReturn(cache[index] = enumerator.getCurrent())
                            : false;
                    }

                    return this.yieldReturn(cache[index]);
                },
                Functions.Blank
            );
        }, function () {
            disposed = true;
            Utils.dispose(enumerator);
            cache = null;
        });
    };

    /* Error Handling Methods */

    Enumerable.prototype.catchError = function (handler) {
        handler = Utils.createLambda(handler);
        var source = this;

        return new Enumerable(function () {
            var enumerator;

            return new IEnumerator(
                function () { enumerator = source.getEnumerator(); },
                function () {
                    try {
                        return (enumerator.moveNext())
                            ? this.yieldReturn(enumerator.getCurrent())
                            : false;
                    } catch (e) {
                        handler(e);
                        return false;
                    }
                },
                function () { Utils.dispose(enumerator); });
        });
    };

    Enumerable.prototype.finallyAction = function (finallyAction) {
        finallyAction = Utils.createLambda(finallyAction);
        var source = this;

        return new Enumerable(function () {
            var enumerator;

            return new IEnumerator(
                function () { enumerator = source.getEnumerator(); },
                function () {
                    return (enumerator.moveNext())
                        ? this.yieldReturn(enumerator.getCurrent())
                        : false;
                },
                function () {
                    try {
                        Utils.dispose(enumerator);
                    } finally {
                        finallyAction();
                    }
                });
        });
    };

    /* For Debug Methods */

    // Overload:function ()
    // Overload:function (selector)
    Enumerable.prototype.log = function (selector) {
        selector = Utils.createLambda(selector);

        return this.doAction(function (item) {
            if (typeof console !== Types.Undefined) {
                console.log(selector(item));
            }
        });
    };

    // Overload:function ()
    // Overload:function (message)
    // Overload:function (message,selector)
    Enumerable.prototype.trace = function (message, selector) {
        if (message == null) message = "Trace";
        selector = Utils.createLambda(selector);

        return this.doAction(function (item) {
            if (typeof console !== Types.Undefined) {
                console.log(message, selector(item));
            }
        });
    };

    // private

    var OrderedEnumerable = function (source, keySelector, comparer, descending, parent) {
        this.source = source;
        this.keySelector = Utils.createLambda(keySelector);
        this.comparer = comparer || System.Collections.Generic.Comparer$1.$default;
        this.descending = descending;
        this.parent = parent;
    };
    OrderedEnumerable.prototype = new Enumerable();

    OrderedEnumerable.prototype.createOrderedEnumerable = function (keySelector, comparer, descending) {
        return new OrderedEnumerable(this.source, keySelector, comparer, descending, this);
    };

    OrderedEnumerable.prototype.thenBy = function (keySelector, comparer) {
        return this.createOrderedEnumerable(keySelector, comparer, false);
    };

    OrderedEnumerable.prototype.thenByDescending = function (keySelector, comparer) {
        return this.createOrderedEnumerable(keySelector, comparer, true);
    };

    OrderedEnumerable.prototype.getEnumerator = function () {
        var self = this;
        var buffer;
        var indexes;
        var index = 0;

        return new IEnumerator(
            function () {
                buffer = [];
                indexes = [];
                self.source.forEach(function (item, index) {
                    buffer.push(item);
                    indexes.push(index);
                });
                var sortContext = SortContext.create(self, null);
                sortContext.GenerateKeys(buffer);

                indexes.sort(function (a, b) { return sortContext.compare(a, b); });
            },
            function () {
                return (index < indexes.length)
                    ? this.yieldReturn(buffer[indexes[index++]])
                    : false;
            },
            Functions.Blank
        );
    };

    var SortContext = function (keySelector, comparer, descending, child) {
        this.keySelector = keySelector;
        this.comparer = comparer;
        this.descending = descending;
        this.child = child;
        this.keys = null;
    };

    SortContext.create = function (orderedEnumerable, currentContext) {
        var context = new SortContext(orderedEnumerable.keySelector, orderedEnumerable.comparer, orderedEnumerable.descending, currentContext);
        if (orderedEnumerable.parent != null) return SortContext.create(orderedEnumerable.parent, context);
        return context;
    };

    SortContext.prototype.GenerateKeys = function (source) {
        var len = source.length;
        var keySelector = this.keySelector;
        var keys = new Array(len);
        for (var i = 0; i < len; i++) keys[i] = keySelector(source[i]);
        this.keys = keys;

        if (this.child != null) this.child.GenerateKeys(source);
    };

    SortContext.prototype.compare = function (index1, index2) {
        var comparison = this.comparer.compare(this.keys[index1], this.keys[index2]);

        if (comparison == 0) {
            if (this.child != null) return this.child.compare(index1, index2);
            return Utils.compare(index1, index2);
        }

        return (this.descending) ? -comparison : comparison;
    };

    var DisposableEnumerable = function (getEnumerator, dispose) {
        this.dispose = dispose;
        Enumerable.call(this, getEnumerator);
    };
    DisposableEnumerable.prototype = new Enumerable();

    // optimize array or arraylike object

    var ArrayEnumerable = function (source) {
        this.getSource = function () { return source; };
    };
    ArrayEnumerable.prototype = new Enumerable();

    ArrayEnumerable.prototype.any = function (predicate) {
        return (predicate == null)
            ? (this.getSource().length > 0)
            : Enumerable.prototype.any.apply(this, arguments);
    };

    ArrayEnumerable.prototype.count = function (predicate) {
        return (predicate == null)
            ? this.getSource().length
            : Enumerable.prototype.count.apply(this, arguments);
    };

    ArrayEnumerable.prototype.elementAt = function (index) {
        var source = this.getSource();
        return (0 <= index && index < source.length)
            ? source[index]
            : Enumerable.prototype.elementAt.apply(this, arguments);
    };

    ArrayEnumerable.prototype.elementAtOrDefault = function (index, defaultValue) {
        if (defaultValue === undefined) defaultValue = null;
        var source = this.getSource();
        return (0 <= index && index < source.length)
            ? source[index]
            : defaultValue;
    };

    ArrayEnumerable.prototype.first = function (predicate) {
        var source = this.getSource();
        return (predicate == null && source.length > 0)
            ? source[0]
            : Enumerable.prototype.first.apply(this, arguments);
    };

    ArrayEnumerable.prototype.firstOrDefault = function (predicate, defaultValue) {
        if (defaultValue === undefined) defaultValue = null;
        if (predicate != null) {
            return Enumerable.prototype.firstOrDefault.apply(this, arguments);
        }

        var source = this.getSource();
        return source.length > 0 ? source[0] : defaultValue;
    };

    ArrayEnumerable.prototype.last = function (predicate) {
        var source = this.getSource();
        return (predicate == null && source.length > 0)
            ? source[source.length - 1]
            : Enumerable.prototype.last.apply(this, arguments);
    };

    ArrayEnumerable.prototype.lastOrDefault = function (predicate, defaultValue) {
        if (defaultValue === undefined) defaultValue = null;
        if (predicate != null) {
            return Enumerable.prototype.lastOrDefault.apply(this, arguments);
        }

        var source = this.getSource();
        return source.length > 0 ? source[source.length - 1] : defaultValue;
    };

    ArrayEnumerable.prototype.skip = function (count) {
        var source = this.getSource();

        return new Enumerable(function () {
            var index;

            return new IEnumerator(
                function () { index = (count < 0) ? 0 : count; },
                function () {
                    return (index < source.length)
                        ? this.yieldReturn(source[index++])
                        : false;
                },
                Functions.Blank);
        });
    };

    ArrayEnumerable.prototype.takeExceptLast = function (count) {
        if (count == null) count = 1;
        return this.take(this.getSource().length - count);
    };

    ArrayEnumerable.prototype.takeFromLast = function (count) {
        return this.skip(this.getSource().length - count);
    };

    ArrayEnumerable.prototype.reverse = function () {
        var source = this.getSource();

        return new Enumerable(function () {
            var index;

            return new IEnumerator(
                function () {
                    index = source.length;
                },
                function () {
                    return (index > 0)
                        ? this.yieldReturn(source[--index])
                        : false;
                },
                Functions.Blank);
        });
    };

    ArrayEnumerable.prototype.sequenceEqual = function (second, comparer) {
        if ((second instanceof ArrayEnumerable || second instanceof Array)
            && comparer == null
            && Enumerable.from(second).count() != this.count()) {
            return false;
        }

        return Enumerable.prototype.sequenceEqual.apply(this, arguments);
    };

    ArrayEnumerable.prototype.toJoinedString = function (separator, selector) {
        var source = this.getSource();
        if (selector != null || !(source instanceof Array)) {
            return Enumerable.prototype.toJoinedString.apply(this, arguments);
        }

        if (separator == null) separator = "";
        return source.join(separator);
    };

    ArrayEnumerable.prototype.getEnumerator = function () {
        return new Bridge.ArrayEnumerator(this.getSource());
    };

    // optimization for multiple where and multiple select and whereselect

    var WhereEnumerable = function (source, predicate) {
        this.prevSource = source;
        this.prevPredicate = predicate; // predicate.length always <= 1
    };
    WhereEnumerable.prototype = new Enumerable();

    WhereEnumerable.prototype.where = function (predicate) {
        predicate = Utils.createLambda(predicate);

        if (predicate.length <= 1) {
            var prevPredicate = this.prevPredicate;
            var composedPredicate = function (x) { return prevPredicate(x) && predicate(x); };
            return new WhereEnumerable(this.prevSource, composedPredicate);
        }
        else {
            // if predicate use index, can't compose
            return Enumerable.prototype.where.call(this, predicate);
        }
    };

    WhereEnumerable.prototype.select = function (selector) {
        selector = Utils.createLambda(selector);

        return (selector.length <= 1)
            ? new WhereSelectEnumerable(this.prevSource, this.prevPredicate, selector)
            : Enumerable.prototype.select.call(this, selector);
    };

    WhereEnumerable.prototype.getEnumerator = function () {
        var predicate = this.prevPredicate;
        var source = this.prevSource;
        var enumerator;

        return new IEnumerator(
            function () { enumerator = source.getEnumerator(); },
            function () {
                while (enumerator.moveNext()) {
                    if (predicate(enumerator.getCurrent())) {
                        return this.yieldReturn(enumerator.getCurrent());
                    }
                }
                return false;
            },
            function () { Utils.dispose(enumerator); });
    };

    var WhereSelectEnumerable = function (source, predicate, selector) {
        this.prevSource = source;
        this.prevPredicate = predicate; // predicate.length always <= 1 or null
        this.prevSelector = selector; // selector.length always <= 1
    };
    WhereSelectEnumerable.prototype = new Enumerable();

    WhereSelectEnumerable.prototype.where = function (predicate) {
        predicate = Utils.createLambda(predicate);

        return (predicate.length <= 1)
            ? new WhereEnumerable(this, predicate)
            : Enumerable.prototype.where.call(this, predicate);
    };

    WhereSelectEnumerable.prototype.select = function (selector) {
        selector = Utils.createLambda(selector);

        if (selector.length <= 1) {
            var prevSelector = this.prevSelector;
            var composedSelector = function (x) { return selector(prevSelector(x)); };
            return new WhereSelectEnumerable(this.prevSource, this.prevPredicate, composedSelector);
        }
        else {
            // if selector use index, can't compose
            return Enumerable.prototype.select.call(this, selector);
        }
    };

    WhereSelectEnumerable.prototype.getEnumerator = function () {
        var predicate = this.prevPredicate;
        var selector = this.prevSelector;
        var source = this.prevSource;
        var enumerator;

        return new IEnumerator(
            function () { enumerator = source.getEnumerator(); },
            function () {
                while (enumerator.moveNext()) {
                    if (predicate == null || predicate(enumerator.getCurrent())) {
                        return this.yieldReturn(selector(enumerator.getCurrent()));
                    }
                }
                return false;
            },
            function () { Utils.dispose(enumerator); });
    };

    // Collections

    // dictionary = Dictionary<TKey, TValue[]>
    var Lookup = function (dictionary, order) {
        this.count = function () {
            return dictionary.getCount();
        };
        this.get = function (key) {
            var value = { v: null };
            var success = dictionary.tryGetValue(key, value);
            return Enumerable.from(success ? value.v : []);
        };
        this.contains = function (key) {
            return dictionary.containsKey(key);
        };
        this.toEnumerable = function () {
            return Enumerable.from(order).select(function (key) {
                return new Grouping(key, dictionary.get(key));
            });
        };
        this.getEnumerator = function () {
            return this.toEnumerable().getEnumerator();
        };
    };

    Lookup.$$inherits = [];
    Bridge.Class.addExtend(Lookup, [System.Collections.IEnumerable]);

    var Grouping = function (groupKey, elements) {
        this.key = function () {
            return groupKey;
        };
        ArrayEnumerable.call(this, elements);
    };
    Grouping.prototype = new ArrayEnumerable();

    Grouping.$$inherits = [];
    Bridge.Class.addExtend(Grouping, [System.Collections.IEnumerable]);

    // module export
    /*if (typeof define === Types.Function && define.amd) { // AMD
        define("linqjs", [], function () { return Enumerable; });
    } else if (typeof module !== Types.Undefined && module.exports) { // Node
        module.exports = Enumerable;
    } else {
        root.Enumerable = Enumerable;
    }*/

    Bridge.Linq = {};
    Bridge.Linq.Enumerable = Enumerable;

    System.Linq = {};
    System.Linq.Enumerable = Enumerable;
})(Bridge.global);

    // @source guid.js

    Bridge.define("System.Guid", {
        inherits: function () { return [System.IEquatable$1(System.Guid),System.IComparable$1(System.Guid),System.IFormattable]; },
        $kind: "struct",
        statics: {
            error1: "Byte array for GUID must be exactly {0} bytes long",
            valid: null,
            split: null,
            nonFormat: null,
            replace: null,
            rnd: null,
            config: {
                init: function () {
                    this.valid = new RegExp("^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$", "i");
                    this.split = new RegExp("^(.{8})(.{4})(.{4})(.{4})(.{12})$");
                    this.nonFormat = new RegExp("^[{(]?([0-9a-f]{8})-?([0-9a-f]{4})-?([0-9a-f]{4})-?([0-9a-f]{4})-?([0-9a-f]{12})[)}]?$", "i");
                    this.replace = new RegExp("-", "g");
                    this.rnd = new System.Random.ctor();
                    this.empty = new System.Guid.ctor();
                }
            },
            parse: function (input) {
                return System.Guid.parseExact(input, null);
            },
            parseExact: function (input, format) {
                var r = new System.Guid.ctor();
                r.parseInternal(input, format, true);
                return r;
            },
            tryParse: function (input, result) {
                return System.Guid.tryParseExact(input, null, result);
            },
            tryParseExact: function (input, format, result) {
                result.v = new System.Guid.ctor();
                return result.v.parseInternal(input, format, false);
            },
            newGuid: function () {
                var a = System.Array.init(16, 0, System.Byte);

                System.Guid.rnd.nextBytes(a);

                a[7] = (a[7] & 15 | 64) & 255;
                a[8] = (a[8] & 191 | 128) & 255;

                return new System.Guid.$ctor1(a);
            },
            makeBinary: function (x) {
                return System.Int32.format((x & 255), "x2");
            },
            op_Equality: function (a, b) {
                if (Bridge.referenceEquals(a, null)) {
                    return Bridge.referenceEquals(b, null);
                }

                return a.equalsT(b);
            },
            op_Inequality: function (a, b) {
                return !(System.Guid.op_Equality(a, b));
            },
            getDefaultValue: function () { return new System.Guid(); }
        },
        _a: 0,
        _b: 0,
        _c: 0,
        _d: 0,
        _e: 0,
        _f: 0,
        _g: 0,
        _h: 0,
        _i: 0,
        _j: 0,
        _k: 0,
        config: {
            alias: [
            "equalsT", "System$IEquatable$1$System$Guid$equalsT",
            "compareTo", "System$IComparable$1$System$Guid$compareTo",
            "format", "System$IFormattable$format"
            ]
        },
        $ctor4: function (uuid) {
            this.$initialize();
            (new System.Guid.ctor()).$clone(this);

            this.parseInternal(uuid, null, true);
        },
        $ctor1: function (b) {
            this.$initialize();
            if (b == null) {
                throw new System.ArgumentNullException("b");
            }

            if (b.length !== 16) {
                throw new System.ArgumentException(System.String.format(System.Guid.error1, 16));
            }

            this._a = (b[3] << 24) | (b[2] << 16) | (b[1] << 8) | b[0];
            this._b = Bridge.Int.sxs(((b[5] << 8) | b[4]) & 65535);
            this._c = Bridge.Int.sxs(((b[7] << 8) | b[6]) & 65535);
            this._d = b[8];
            this._e = b[9];
            this._f = b[10];
            this._g = b[11];
            this._h = b[12];
            this._i = b[13];
            this._j = b[14];
            this._k = b[15];
        },
        $ctor5: function (a, b, c, d, e, f, g, h, i, j, k) {
            this.$initialize();
            this._a = a | 0;
            this._b = Bridge.Int.sxs(b & 65535);
            this._c = Bridge.Int.sxs(c & 65535);
            this._d = d;
            this._e = e;
            this._f = f;
            this._g = g;
            this._h = h;
            this._i = i;
            this._j = j;
            this._k = k;
        },
        $ctor3: function (a, b, c, d) {
            this.$initialize();
            if (d == null) {
                throw new System.ArgumentNullException("d");
            }

            if (d.length !== 8) {
                throw new System.ArgumentException(System.String.format(System.Guid.error1, 8));
            }

            this._a = a;
            this._b = b;
            this._c = c;
            this._d = d[0];
            this._e = d[1];
            this._f = d[2];
            this._g = d[3];
            this._h = d[4];
            this._i = d[5];
            this._j = d[6];
            this._k = d[7];
        },
        $ctor2: function (a, b, c, d, e, f, g, h, i, j, k) {
            this.$initialize();
            this._a = a;
            this._b = b;
            this._c = c;
            this._d = d;
            this._e = e;
            this._f = f;
            this._g = g;
            this._h = h;
            this._i = i;
            this._j = j;
            this._k = k;
        },
        ctor: function () {
            this.$initialize();
        },
        equalsT: function (o) {
            if ((this._a !== o._a) || (this._b !== o._b) || (this._c !== o._c) || (this._d !== o._d) || (this._e !== o._e) || (this._f !== o._f) || (this._g !== o._g) || (this._h !== o._h) || (this._i !== o._i) || (this._j !== o._j) || (this._k !== o._k)) {
                return false;
            }

            return true;
        },
        compareTo: function (value) {
            return System.String.compare(this.toString(), value.toString());
        },
        toString: function () {
            return this.format$1(null);
        },
        toString$1: function (format) {
            return this.format$1(format);
        },
        format: function (format, formatProvider) {
            return this.format$1(format);
        },
        toByteArray: function () {
            var g = System.Array.init(16, 0, System.Byte);

            g[0] = this._a & 255;
            g[1] = (this._a >> 8) & 255;
            g[2] = (this._a >> 16) & 255;
            g[3] = (this._a >> 24) & 255;
            g[4] = this._b & 255;
            g[5] = (this._b >> 8) & 255;
            g[6] = this._c & 255;
            g[7] = (this._c >> 8) & 255;
            g[8] = this._d;
            g[9] = this._e;
            g[10] = this._f;
            g[11] = this._g;
            g[12] = this._h;
            g[13] = this._i;
            g[14] = this._j;
            g[15] = this._k;

            return g;
        },
        parseInternal: function (input, format, check) {
            var r = null;

            if (System.String.isNullOrEmpty(input)) {
                throw new System.ArgumentNullException("input");
            }

            if (System.String.isNullOrEmpty(format)) {
                var m = System.Guid.nonFormat.exec(input);

                if (m != null) {
                    r = m.slice(1).join("-").toLowerCase();
                }
            } else {
                format = format.toUpperCase();

                var p = false;

                if (Bridge.referenceEquals(format, "N")) {
                    var m1 = System.Guid.split.exec(input);

                    if (m1 != null) {
                        p = true;
                        input = m1.slice(1).join("-");
                    }
                } else if (Bridge.referenceEquals(format, "B") || Bridge.referenceEquals(format, "P")) {
                    var b = Bridge.referenceEquals(format, "B") ? System.Array.init([123, 125], System.Char) : System.Array.init([40, 41], System.Char);

                    if ((input.charCodeAt(0) === b[0]) && (input.charCodeAt(((input.length - 1) | 0)) === b[1])) {
                        p = true;
                        input = input.substr(1, ((input.length - 2) | 0));
                    }
                } else {
                    p = true;
                }

                if (p && input.match(System.Guid.valid) != null) {
                    r = input.toLowerCase();
                }
            }

            if (r != null) {
                this.fromString(r);
                return true;
            }

            if (check) {
                throw new System.FormatException("input is not in a recognized format");
            }

            return false;
        },
        format$1: function (format) {
            var s = System.String.concat(System.UInt32.format((this._a >>> 0), "x8"), System.UInt16.format((this._b & 65535), "x4"), System.UInt16.format((this._c & 65535), "x4"));
            s = System.String.concat(s, (System.Array.init([this._d, this._e, this._f, this._g, this._h, this._i, this._j, this._k], System.Byte)).map(System.Guid.makeBinary).join(""));

            s = System.Guid.split.exec(s).slice(1).join("-");

            switch (format) {
                case "n": 
                case "N": 
                    return s.replace(System.Guid.replace, "");
                case "b": 
                case "B": 
                    return System.String.concat(String.fromCharCode(123), s, String.fromCharCode(125));
                case "p": 
                case "P": 
                    return System.String.concat(String.fromCharCode(40), s, String.fromCharCode(41));
                default: 
                    return s;
            }
        },
        fromString: function (s) {
            if (System.String.isNullOrEmpty(s)) {
                return;
            }

            s = s.replace(System.Guid.replace, "");

            var r = System.Array.init(8, 0, System.Byte);

            this._a = (System.UInt32.parse(s.substr(0, 8), 16)) | 0;
            this._b = Bridge.Int.sxs((System.UInt16.parse(s.substr(8, 4), 16)) & 65535);
            this._c = Bridge.Int.sxs((System.UInt16.parse(s.substr(12, 4), 16)) & 65535);
            for (var i = 8; i < 16; i = (i + 1) | 0) {
                r[((i - 8) | 0)] = System.Byte.parse(s.substr(((i * 2) | 0), 2), 16);
            }

            this._d = r[0];
            this._e = r[1];
            this._f = r[2];
            this._g = r[3];
            this._h = r[4];
            this._i = r[5];
            this._j = r[6];
            this._k = r[7];
        },
        getHashCode: function () {
            var h = Bridge.addHash([1684632903, this._a, this._b, this._c, this._d, this._e, this._f, this._g, this._h, this._i, this._j, this._k]);
            return h;
        },
        $clone: function (to) { return this; }
    });

    // @source Regex.js

    Bridge.define("System.Text.RegularExpressions.Regex", {
        statics: {
            _cacheSize: 15,
            _defaultMatchTimeout: System.TimeSpan.fromMilliseconds(-1),

            getCacheSize: function () {
                return System.Text.RegularExpressions.Regex._cacheSize;
            },

            setCacheSize: function (value) {
                if (value < 0) {
                    throw new System.ArgumentOutOfRangeException("value");
                }

                System.Text.RegularExpressions.Regex._cacheSize = value;
                //TODO: remove extra items from cache
            },

            escape: function (str) {
                if (str == null) {
                    throw new System.ArgumentNullException("str");
                }

                return System.Text.RegularExpressions.RegexParser.escape(str);
            },

            unescape: function (str) {
                if (str == null) {
                    throw new System.ArgumentNullException("str");
                }

                return System.Text.RegularExpressions.RegexParser.unescape(str);
            },

            isMatch: function (input, pattern) {
                var scope = System.Text.RegularExpressions;
                return scope.Regex.isMatch$2(input, pattern, scope.RegexOptions.None, scope.Regex._defaultMatchTimeout);
            },

            isMatch$1: function (input, pattern, options) {
                var scope = System.Text.RegularExpressions;
                return scope.Regex.isMatch$2(input, pattern, options, scope.Regex._defaultMatchTimeout);
            },

            isMatch$2: function (input, pattern, options, matchTimeout) {
                var regex = new System.Text.RegularExpressions.Regex.$ctor3(pattern, options, matchTimeout, true);
                return regex.isMatch(input);
            },

            match: function (input, pattern) {
                var scope = System.Text.RegularExpressions;
                return scope.Regex.match$2(input, pattern, scope.RegexOptions.None, scope.Regex._defaultMatchTimeout);
            },

            match$1: function (input, pattern, options) {
                var scope = System.Text.RegularExpressions;
                return scope.Regex.match$2(input, pattern, options, scope.Regex._defaultMatchTimeout);
            },

            match$2: function (input, pattern, options, matchTimeout) {
                var regex = new System.Text.RegularExpressions.Regex.$ctor3(pattern, options, matchTimeout, true);
                return regex.match(input);
            },

            matches: function (input, pattern) {
                var scope = System.Text.RegularExpressions;
                return scope.Regex.matches$2(input, pattern, scope.RegexOptions.None, scope.Regex._defaultMatchTimeout);
            },

            matches$1: function (input, pattern, options) {
                var scope = System.Text.RegularExpressions;
                return scope.Regex.matches$2(input, pattern, options, scope.Regex._defaultMatchTimeout);
            },

            matches$2: function (input, pattern, options, matchTimeout) {
                var regex = new System.Text.RegularExpressions.Regex.$ctor3(pattern, options, matchTimeout, true);
                return regex.matches(input);
            },

            replace: function (input, pattern, replacement) {
                var scope = System.Text.RegularExpressions;
                return scope.Regex.replace$2(input, pattern, replacement, scope.RegexOptions.None, scope.Regex._defaultMatchTimeout);
            },

            replace$1: function (input, pattern, replacement, options) {
                var scope = System.Text.RegularExpressions;
                return scope.Regex.replace$2(input, pattern, replacement, options, scope.Regex._defaultMatchTimeout);
            },

            replace$2: function (input, pattern, replacement, options, matchTimeout) {
                var regex = new System.Text.RegularExpressions.Regex.$ctor3(pattern, options, matchTimeout, true);
                return regex.replace(input, replacement);
            },

            replace$3: function (input, pattern, evaluator) {
                var scope = System.Text.RegularExpressions;
                return scope.Regex.replace$5(input, pattern, evaluator, scope.RegexOptions.None, scope.Regex._defaultMatchTimeout);
            },

            replace$4: function (input, pattern, evaluator, options) {
                var scope = System.Text.RegularExpressions;
                return scope.Regex.replace$5(input, pattern, evaluator, options, scope.Regex._defaultMatchTimeout);
            },

            replace$5: function (input, pattern, evaluator, options, matchTimeout) {
                var regex = new System.Text.RegularExpressions.Regex.$ctor3(pattern, options, matchTimeout, true);
                return regex.replace$3(input, evaluator);
            },

            split: function (input, pattern) {
                var scope = System.Text.RegularExpressions;
                return scope.Regex.split$2(input, pattern, scope.RegexOptions.None, scope.Regex._defaultMatchTimeout);
            },

            split$1: function (input, pattern, options) {
                var scope = System.Text.RegularExpressions;
                return scope.Regex.split$2(input, pattern, options, scope.Regex._defaultMatchTimeout);
            },

            split$2: function (input, pattern, options, matchTimeout) {
                var regex = new System.Text.RegularExpressions.Regex.$ctor3(pattern, options, matchTimeout, true);
                return regex.split(input);
            }
        },

        _pattern: "",
        _matchTimeout: System.TimeSpan.fromMilliseconds(-1),
        _runner: null,
        _caps: null,
        _capsize: 0,
        _capnames: null,
        _capslist: null,

        config: {
            init: function () {
                this._options = System.Text.RegularExpressions.RegexOptions.None;
            }
        },

        ctor: function (pattern) {
            this.$ctor1(pattern, System.Text.RegularExpressions.RegexOptions.None);
        },

        $ctor1: function (pattern, options) {
            this.$ctor2(pattern, options, System.TimeSpan.fromMilliseconds(-1));
        },

        $ctor2: function (pattern, options, matchTimeout) {
            this.$ctor3(pattern, options, matchTimeout, false);
        },

        $ctor3: function (pattern, options, matchTimeout, useCache) {
            this.$initialize();
            var scope = System.Text.RegularExpressions;

            if (pattern == null) {
                throw new System.ArgumentNullException("pattern");
            }

            if (options < scope.RegexOptions.None || ((options >> 10) !== 0)) {
                throw new System.ArgumentOutOfRangeException("options");
            }

            if (((options & scope.RegexOptions.ECMAScript) !== 0) &&
                ((options & ~(scope.RegexOptions.ECMAScript |
                    scope.RegexOptions.IgnoreCase |
                    scope.RegexOptions.Multiline |
                    scope.RegexOptions.CultureInvariant
                )) !== 0)) {
                throw new System.ArgumentOutOfRangeException("options");
            }

            // Check if the specified options are supported.
            var supportedOptions =
                System.Text.RegularExpressions.RegexOptions.IgnoreCase |
                System.Text.RegularExpressions.RegexOptions.Multiline |
                System.Text.RegularExpressions.RegexOptions.Singleline |
                System.Text.RegularExpressions.RegexOptions.IgnorePatternWhitespace |
                System.Text.RegularExpressions.RegexOptions.ExplicitCapture;

            if ((options | supportedOptions) !== supportedOptions) {
                throw new System.NotSupportedException("Specified Regex options are not supported.");
            }

            this._validateMatchTimeout(matchTimeout);

            this._pattern = pattern;
            this._options = options;
            this._matchTimeout = matchTimeout;
            this._runner = new scope.RegexRunner(this);

            //TODO: cache
            var patternInfo = this._runner.parsePattern();

            this._capnames = patternInfo.sparseSettings.sparseSlotNameMap;
            this._capslist = patternInfo.sparseSettings.sparseSlotNameMap.keys;
            this._capsize = this._capslist.length;
        },

        getMatchTimeout: function () {
            return this._matchTimeout;
        },

        getOptions: function () {
            return this._options;
        },

        getRightToLeft: function () {
            return (this._options & System.Text.RegularExpressions.RegexOptions.RightToLeft) !== 0;
        },

        isMatch: function (input) {
            if (input == null) {
                throw new System.ArgumentNullException("input");
            }

            var startat = this.getRightToLeft() ? input.length : 0;

            return this.isMatch$1(input, startat);
        },

        isMatch$1: function (input, startat) {
            if (input == null) {
                throw new System.ArgumentNullException("input");
            }

            var match = this._runner.run(true, -1, input, 0, input.length, startat);

            return match == null;
        },

        match: function (input) {
            if (input == null) {
                throw new System.ArgumentNullException("input");
            }

            var startat = this.getRightToLeft() ? input.length : 0;

            return this.match$1(input, startat);
        },

        match$1: function (input, startat) {
            if (input == null) {
                throw new System.ArgumentNullException("input");
            }

            return this._runner.run(false, -1, input, 0, input.length, startat);
        },

        match$2: function (input, beginning, length) {
            if (input == null) {
                throw new System.ArgumentNullException("input");
            }

            var startat = this.getRightToLeft() ? beginning + length : beginning;

            return this._runner.run(false, -1, input, beginning, length, startat);
        },

        matches: function (input) {
            if (input == null) {
                throw new System.ArgumentNullException("input");
            }

            var startat = this.getRightToLeft() ? input.length : 0;

            return this.matches$1(input, startat);
        },

        matches$1: function (input, startat) {
            if (input == null) {
                throw new System.ArgumentNullException("input");
            }

            return new System.Text.RegularExpressions.MatchCollection(this, input, 0, input.length, startat);
        },

        getGroupNames: function () {
            if (this._capslist == null) {
                var invariantCulture = System.Globalization.CultureInfo.invariantCulture;

                var result = [];
                var max = this._capsize;
                var i;

                for (i = 0; i < max; i++) {
                    result[i] = System.Convert.toString(i, invariantCulture, System.Convert.typeCodes.Int32);
                }

                return result;
            } else {
                return this._capslist.slice();
            }
        },

        getGroupNumbers: function () {
            var caps = this._caps;
            var result;
            var key;
            var max;
            var i;

            if (caps == null) {
                result = [];
                max = this._capsize;
                for (i = 0; i < max; i++) {
                    result.push(i);
                }
            } else {
                result = [];
                for (key in caps) {
                    if (caps.hasOwnProperty(key)) {
                        result[caps[key]] = key;
                    }
                }
            }

            return result;
        },

        groupNameFromNumber: function (i) {
            if (this._capslist == null) {
                if (i >= 0 && i < this._capsize) {
                    var invariantCulture = System.Globalization.CultureInfo.invariantCulture;

                    return System.Convert.toString(i, invariantCulture, System.Convert.typeCodes.Int32);
                }

                return "";
            } else {
                if (this._caps != null) {
                    var obj = this._caps[i];

                    if (obj == null) {
                        return "";
                    }

                    return parseInt(obj);
                }

                if (i >= 0 && i < this._capslist.length) {
                    return this._capslist[i];
                }

                return "";
            }
        },

        groupNumberFromName: function (name) {
            if (name == null) {
                throw new System.ArgumentNullException("name");
            }

            // look up name if we have a hashtable of names
            if (this._capnames != null) {
                var ret = this._capnames[name];

                if (ret == null) {
                    return -1;
                }

                return parseInt(ret);
            }

            // convert to an int if it looks like a number
            var result = 0;
            var ch;
            var i;

            for (i = 0; i < name.Length; i++) {
                ch = name[i];

                if (ch > "9" || ch < "0") {
                    return -1;
                }

                result *= 10;
                result += (ch - "0");
            }

            // return int if it's in range
            if (result >= 0 && result < this._capsize) {
                return result;
            }

            return -1;
        },

        replace: function (input, replacement) {
            if (input == null) {
                throw new System.ArgumentNullException("input");
            }

            var startat = this.getRightToLeft() ? input.length : 0;

            return this.replace$2(input, replacement, -1, startat);
        },

        replace$1: function (input, replacement, count) {
            if (input == null) {
                throw new System.ArgumentNullException("input");
            }

            var startat = this.getRightToLeft() ? input.length : 0;

            return this.replace$2(input, replacement, count, startat);
        },

        replace$2: function (input, replacement, count, startat) {
            if (input == null) {
                throw new System.ArgumentNullException("input");
            }

            if (replacement == null) {
                throw new System.ArgumentNullException("replacement");
            }

            var repl = System.Text.RegularExpressions.RegexParser.parseReplacement(replacement, this._caps, this._capsize, this._capnames, this._options);
            //TODO: Cache

            return repl.replace(this, input, count, startat);
        },

        replace$3: function (input, evaluator) {
            if (input == null) {
                throw new System.ArgumentNullException("input");
            }

            var startat = this.getRightToLeft() ? input.length : 0;
            return this.replace$5(input, evaluator, -1, startat);
        },

        replace$4: function (input, evaluator, count) {
            if (input == null) {
                throw new System.ArgumentNullException("input");
            }

            var startat = this.getRightToLeft() ? input.length : 0;

            return this.replace$5(input, evaluator, count, startat);
        },

        replace$5: function (input, evaluator, count, startat) {
            if (input == null) {
                throw new System.ArgumentNullException("input");
            }

            return System.Text.RegularExpressions.RegexReplacement.replace(evaluator, this, input, count, startat);
        },

        split: function (input) {
            if (input == null) {
                throw new System.ArgumentNullException("input");
            }

            var startat = this.getRightToLeft() ? input.length : 0;

            return this.split$2(input, 0, startat);
        },

        split$1: function (input, count) {
            if (input == null) {
                throw new System.ArgumentNullException("input");
            }

            var startat = this.getRightToLeft() ? input.length : 0;

            return this.split$2(input, count, startat);
        },

        split$2: function (input, count, startat) {
            if (input == null) {
                throw new System.ArgumentNullException("input");
            }

            return System.Text.RegularExpressions.RegexReplacement.split(this, input, count, startat);
        },

        _validateMatchTimeout: function (matchTimeout) {
            var ms = matchTimeout.getTotalMilliseconds();

            if (-1 === ms) {
                return;
            }

            if (ms > 0 && ms <= 2147483646) {
                return;
            }

            throw new System.ArgumentOutOfRangeException("matchTimeout");
        }
    });

    // @source RegexCapture.js

    Bridge.define("System.Text.RegularExpressions.Capture", {
        _text: "",
        _index: 0,
        _length: 0,

        ctor: function (text, i, l) {
            this.$initialize();
            this._text = text;
            this._index = i;
            this._length = l;
        },

        getIndex: function () {
            return this._index;
        },

        getLength: function () {
            return this._length;
        },

        getValue: function () {
            return this._text.substr(this._index, this._length);
        },

        toString: function () {
            return this.getValue();
        },

        _getOriginalString: function () {
            return this._text;
        },

        _getLeftSubstring: function () {
            return this._text.slice(0, _index);
        },

        _getRightSubstring: function () {
            return this._text.slice(this._index + this._length, this._text.length);
        }
    });

    // @source RegexCaptureCollection.js

    Bridge.define("System.Text.RegularExpressions.CaptureCollection", {
        inherits: function () {
            return [System.Collections.ICollection];
        },

        config: {
            alias: [
            "getEnumerator", "System$Collections$IEnumerable$getEnumerator",
            "getCount", "System$Collections$ICollection$getCount"
            ]
        },

        _group: null,
        _capcount: 0,
        _captures: null,

        ctor: function (group) {
            this.$initialize();
            this._group = group;
            this._capcount = group._capcount;
        },

        getSyncRoot: function () {
            return this._group;
        },

        getIsSynchronized: function () {
            return false;
        },

        getIsReadOnly: function () {
            return true;
        },

        getCount: function () {
            return this._capcount;
        },

        get: function (i) {
            if (i === this._capcount - 1 && i >= 0) {
                return this._group;
            }

            if (i >= this._capcount || i < 0) {
                throw new System.ArgumentOutOfRangeException("i");
            }

            this._ensureCapturesInited();

            return this._captures[i];
        },

        copyTo: function (array, arrayIndex) {
            if (array == null) {
                throw new System.ArgumentNullException("array");
            }

            if (array.length < arrayIndex + this._capcount) {
                throw new System.IndexOutOfRangeException();
            }

            var capture;
            var i;
            var j;

            for (i = arrayIndex, j = 0; j < this._capcount; i++, j++) {
                capture = this.get(j);
                System.Array.set(array, capture, [i]);
            }
        },

        getEnumerator: function () {
            return new System.Text.RegularExpressions.CaptureEnumerator(this);
        },

        _ensureCapturesInited: function () {
            // first time a capture is accessed, compute them all
            if (this._captures == null) {
                var captures = [];
                var j;

                captures.length = this._capcount;
                for (j = 0; j < this._capcount - 1; j++) {
                    var index = this._group._caps[j * 2];
                    var length = this._group._caps[j * 2 + 1];

                    captures[j] = new System.Text.RegularExpressions.Capture(this._group._text, index, length);
                }

                if (this._capcount > 0) {
                    captures[this._capcount - 1] = this._group;
                }

                this._captures = captures;
            }
        }
    });

    Bridge.define("System.Text.RegularExpressions.CaptureEnumerator", {
        inherits: function () {
            return [System.Collections.IEnumerator];
        },

        config: {
            alias: [
                "getCurrent", "System$Collections$IEnumerator$getCurrent",
                "moveNext", "System$Collections$IEnumerator$moveNext",
                "reset", "System$Collections$IEnumerator$reset"
            ]
        },

        _captureColl: null,
        _curindex: 0,

        ctor: function (captureColl) {
            this.$initialize();
            this._curindex = -1;
            this._captureColl = captureColl;
        },

        moveNext: function () {
            var size = this._captureColl.getCount();

            if (this._curindex >= size) {
                return false;
            }

            this._curindex++;
            return (this._curindex < size);
        },

        getCurrent: function () {
            return this.getCapture();
        },

        getCapture: function () {
            if (this._curindex < 0 || this._curindex >= this._captureColl.getCount()) {
                throw new System.InvalidOperationException("Enumeration has either not started or has already finished.");
            }

            return this._captureColl.get(this._curindex);
        },

        reset: function () {
            this._curindex = -1;
        }
    });

    // @source RegexGroup.js

    Bridge.define("System.Text.RegularExpressions.Group", {
        inherits: function () {
            return [System.Text.RegularExpressions.Capture];
        },

        statics: {
            config: {
                init: function () {
                    var empty = new System.Text.RegularExpressions.Group("", [], 0);

                    this.getEmpty = function () {
                        return empty;
                    }
                }
            },

            synchronized: function (group) {
                if (group == null) {
                    throw new System.ArgumentNullException("group");
                }

                // force Captures to be computed.
                var captures = group.getCaptures();

                if (captures.getCount() > 0) {
                    captures.get(0);
                }

                return group;
            }
        },

        _caps: null,
        _capcount: 0,
        _capColl: null,

        ctor: function (text, caps, capcount) {
            this.$initialize();
            var scope = System.Text.RegularExpressions;
            var index = capcount === 0 ? 0 : caps[(capcount - 1) * 2];
            var length = capcount === 0 ? 0 : caps[(capcount * 2) - 1];

            scope.Capture.ctor.call(this, text, index, length);

            this._caps = caps;
            this._capcount = capcount;
        },

        getSuccess: function () {
            return this._capcount !== 0;
        },

        getCaptures: function () {
            if (this._capColl == null) {
                this._capColl = new System.Text.RegularExpressions.CaptureCollection(this);
            }

            return this._capColl;
        }
    });

    // @source RegexGroupCollection.js

    Bridge.define("System.Text.RegularExpressions.GroupCollection", {
        inherits: function () {
            return [System.Collections.ICollection];
        },

        config: {
            alias: [
            "getEnumerator", "System$Collections$IEnumerable$getEnumerator",
            "getCount", "System$Collections$ICollection$getCount"
            ]
        },

        _match: null,
        _captureMap: null,
        _groups: null,

        ctor: function (match, caps) {
            this.$initialize();
            this._match = match;
            this._captureMap = caps;
        },

        getSyncRoot: function () {
            return this._match;
        },

        getIsSynchronized: function () {
            return false;
        },

        getIsReadOnly: function () {
            return true;
        },

        getCount: function () {
            return this._match._matchcount.length;
        },

        get: function (groupnum) {
            return this._getGroup(groupnum);
        },

        getByName: function (groupname) {
            if (this._match._regex == null) {
                return System.Text.RegularExpressions.Group.getEmpty();
            }

            var groupnum = this._match._regex.groupNumberFromName(groupname);

            return this._getGroup(groupnum);
        },

        copyTo: function (array, arrayIndex) {
            if (array == null) {
                throw new System.ArgumentNullException("array");
            }

            var count = this.getCount();

            if (array.length < arrayIndex + count) {
                throw new System.IndexOutOfRangeException();
            }

            var group;
            var i;
            var j;

            for (i = arrayIndex, j = 0; j < count; i++, j++) {
                group = this._getGroup(j);
                System.Array.set(array, group, [i]);
            }
        },

        getEnumerator: function () {
            return new System.Text.RegularExpressions.GroupEnumerator(this);
        },

        _getGroup: function (groupnum) {
            var group;

            if (this._captureMap != null) {
                var num = this._captureMap[groupnum];

                if (num == null) {
                    group = System.Text.RegularExpressions.Group.getEmpty();
                } else {
                    group = this._getGroupImpl(num);
                }
            } else {
                if (groupnum >= this._match._matchcount.length || groupnum < 0) {
                    group = System.Text.RegularExpressions.Group.getEmpty();
                } else {
                    group = this._getGroupImpl(groupnum);
                }
            }

            return group;
        },

        _getGroupImpl: function (groupnum) {
            if (groupnum === 0) {
                return this._match;
            }

            this._ensureGroupsInited();

            return this._groups[groupnum];
        },

        _ensureGroupsInited: function () {
            // Construct all the Group objects the first time GetGroup is called
            if (this._groups == null) {
                var groups = [];

                groups.length = this._match._matchcount.length;

                if (groups.length > 0) {
                    groups[0] = this._match;
                }

                var matchText;
                var matchCaps;
                var matchCapcount;
                var i;

                for (i = 0; i < groups.length - 1; i++) {
                    matchText = this._match._text;
                    matchCaps = this._match._matches[i + 1];
                    matchCapcount = this._match._matchcount[i + 1];
                    groups[i + 1] = new System.Text.RegularExpressions.Group(matchText, matchCaps, matchCapcount);
                }
                this._groups = groups;
            }
        }
    });

    Bridge.define("System.Text.RegularExpressions.GroupEnumerator", {
        inherits: function () {
            return [System.Collections.IEnumerator];
        },

        config: {
            alias: [
                "getCurrent", "System$Collections$IEnumerator$getCurrent",
                "moveNext", "System$Collections$IEnumerator$moveNext",
                "reset", "System$Collections$IEnumerator$reset"
            ]
        },

        _groupColl: null,
        _curindex: 0,

        ctor: function (groupColl) {
            this.$initialize();
            this._curindex = -1;
            this._groupColl = groupColl;
        },

        moveNext: function () {
            var size = this._groupColl.getCount();

            if (this._curindex >= size) {
                return false;
            }

            this._curindex++;

            return (this._curindex < size);
        },

        getCurrent: function () {
            return this.getCapture();
        },

        getCapture: function () {
            if (this._curindex < 0 || this._curindex >= this._groupColl.getCount()) {
                throw new System.InvalidOperationException("Enumeration has either not started or has already finished.");
            }

            return this._groupColl.get(this._curindex);
        },

        reset: function () {
            this._curindex = -1;
        }
    });

    // @source RegexMatch.js

    Bridge.define("System.Text.RegularExpressions.Match", {
        inherits: function () {
            return [System.Text.RegularExpressions.Group];
        },

        statics: {
            config: {
                init: function () {
                    var empty = new System.Text.RegularExpressions.Match(null, 1, "", 0, 0, 0);

                    this.getEmpty = function () {
                        return empty;
                    }
                }
            },

            synchronized: function (match) {
                if (match == null) {
                    throw new System.ArgumentNullException("match");
                }

                // Populate all groups by looking at each one
                var groups = match.getGroups();
                var groupsCount = groups.getCount();
                var group;
                var i;

                for (i = 0; i < groupsCount; i++) {
                    group = groups.get(i);
                    System.Text.RegularExpressions.Group.synchronized(group);
                }

                return match;
            }
        },

        _regex: null,
        _matchcount: null,
        _matches: null,
        _textbeg: 0,
        _textend: 0,
        _textstart: 0,
        _groupColl: null,
        _textpos: 0,

        ctor: function (regex, capcount, text, begpos, len, startpos) {
            this.$initialize();
            var scope = System.Text.RegularExpressions;
            var caps = [0, 0];

            scope.Group.ctor.call(this, text, caps, 0);

            this._regex = regex;

            this._matchcount = [];
            this._matchcount.length = capcount;

            var i;
            for (i = 0; i < capcount; i++) {
                this._matchcount[i] = 0;
            }

            this._matches = [];
            this._matches.length = capcount;
            this._matches[0] = caps;

            this._textbeg = begpos;
            this._textend = begpos + len;
            this._textstart = startpos;
        },

        getGroups: function () {
            if (this._groupColl == null) {
                this._groupColl = new System.Text.RegularExpressions.GroupCollection(this, null);
            }

            return this._groupColl;
        },

        nextMatch: function () {
            if (this._regex == null) {
                return this;
            }

            return this._regex._runner.run(false, this._length, this._text, this._textbeg, this._textend - this._textbeg, this._textpos);
        },

        result: function (replacement) {
            if (replacement == null) {
                throw new System.ArgumentNullException("replacement");
            }

            if (this._regex == null) {
                throw new System.NotSupportedException("Result cannot be called on a failed Match.");
            }

            var repl = System.Text.RegularExpressions.RegexParser.parseReplacement(replacement, this._regex._caps, this._regex._capsize, this._regex._capnames, this._regex._options);
            //TODO: cache

            return repl.replacement(this);
        },

        _isMatched: function (cap) {
            return cap < this._matchcount.length && this._matchcount[cap] > 0 && this._matches[cap][this._matchcount[cap] * 2 - 1] !== (-3 + 1);
        },

        _addMatch: function (cap, start, len) {
            if (this._matches[cap] == null) {
                this._matches[cap] = new Array(2);
            }

            var capcount = this._matchcount[cap];

            if (capcount * 2 + 2 > this._matches[cap].length) {
                var oldmatches = this._matches[cap];
                var newmatches = new Array(capcount * 8);
                var j;

                for (j = 0; j < capcount * 2; j++) {
                    newmatches[j] = oldmatches[j];
                }

                this._matches[cap] = newmatches;
            }

            this._matches[cap][capcount * 2] = start;
            this._matches[cap][capcount * 2 + 1] = len;
            this._matchcount[cap] = capcount + 1;
        },

        _tidy: function (textpos) {
            var interval = this._matches[0];
            this._index = interval[0];
            this._length = interval[1];
            this._textpos = textpos;
            this._capcount = this._matchcount[0];
        },

        _groupToStringImpl: function (groupnum) {
            var c = this._matchcount[groupnum];

            if (c === 0) {
                return "";
            }

            var matches = this._matches[groupnum];
            var capIndex = matches[(c - 1) * 2];
            var capLength = matches[(c * 2) - 1];

            return this._text.slice(capIndex, capIndex + capLength);
        },

        _lastGroupToStringImpl: function () {
            return this._groupToStringImpl(this._matchcount.length - 1);
        }
    });

    Bridge.define("System.Text.RegularExpressions.MatchSparse", {
        inherits: function () {
            return [System.Text.RegularExpressions.Match];
        },

        _caps: null,

        ctor: function (regex, caps, capcount, text, begpos, len, startpos) {
            this.$initialize();
            var scope = System.Text.RegularExpressions;
            scope.Match.ctor.call(this, regex, capcount, text, begpos, len, startpos);

            this._caps = caps;
        },

        getGroups: function () {
            if (this._groupColl == null) {
                this._groupColl = new System.Text.RegularExpressions.GroupCollection(this, this._caps);
            }
            return this._groupColl;
        },
    });

    // @source RegexMatchCollection.js

    Bridge.define("System.Text.RegularExpressions.MatchCollection", {
        inherits: function () {
            return [System.Collections.ICollection];
        },

        config: {
            alias: [
            "getEnumerator", "System$Collections$IEnumerable$getEnumerator",
            "getCount", "System$Collections$ICollection$getCount"
            ]
        },

        _regex: null,
        _input: null,
        _beginning: 0,
        _length: 0,
        _startat: 0,
        _prevlen: 0,
        _matches: null,
        _done: false,

        ctor: function (regex, input, beginning, length, startat) {
            this.$initialize();
            if (startat < 0 || startat > input.Length) {
                throw new System.ArgumentOutOfRangeException("startat");
            }

            this._regex = regex;
            this._input = input;
            this._beginning = beginning;
            this._length = length;
            this._startat = startat;
            this._prevlen = -1;
            this._matches = [];
        },

        getCount: function () {
            if (!this._done) {
                this._getMatch(0x7FFFFFFF);
            }

            return this._matches.length;
        },

        getSyncRoot: function () {
            return this;
        },

        getIsSynchronized: function () {
            return false;
        },

        getIsReadOnly: function () {
            return true;
        },

        get: function (i) {
            var match = this._getMatch(i);

            if (match == null) {
                throw new System.ArgumentOutOfRangeException("i");
            }

            return match;
        },

        copyTo: function (array, arrayIndex) {
            if (array == null) {
                throw new System.ArgumentNullException("array");
            }

            var count = this.getCount();

            if (array.length < arrayIndex + count) {
                throw new System.IndexOutOfRangeException();
            }

            var match;
            var i;
            var j;

            for (i = arrayIndex, j = 0; j < count; i++, j++) {
                match = this._getMatch(j);
                System.Array.set(array, match, [i]);
            }
        },

        getEnumerator: function () {
            return new System.Text.RegularExpressions.MatchEnumerator(this);
        },

        _getMatch: function (i) {
            if (i < 0) {
                return null;
            }

            if (this._matches.length > i) {
                return this._matches[i];
            }

            if (this._done) {
                return null;
            }

            var match;

            do {
                match = this._regex._runner.run(false, this._prevLen, this._input, this._beginning, this._length, this._startat);
                if (!match.getSuccess()) {
                    this._done = true;
                    return null;
                }

                this._matches.push(match);

                this._prevLen = match._length;
                this._startat = match._textpos;
            } while (this._matches.length <= i);

            return match;
        }
    });

    Bridge.define("System.Text.RegularExpressions.MatchEnumerator", {
        inherits: function () {
            return [System.Collections.IEnumerator];
        },

        config: {
            alias: [
                "getCurrent", "System$Collections$IEnumerator$getCurrent",
                "moveNext", "System$Collections$IEnumerator$moveNext",
                "reset", "System$Collections$IEnumerator$reset"
            ]
        },

        _matchcoll: null,
        _match: null,
        _curindex: 0,
        _done: false,

        ctor: function (matchColl) {
            this.$initialize();
            this._matchcoll = matchColl;
        },

        moveNext: function () {
            if (this._done) {
                return false;
            }

            this._match = this._matchcoll._getMatch(this._curindex);
            this._curindex++;

            if (this._match == null) {
                this._done = true;

                return false;
            }

            return true;
        },

        getCurrent: function () {
            if (this._match == null) {
                throw new System.InvalidOperationException("Enumeration has either not started or has already finished.");
            }

            return this._match;
        },

        reset: function () {
            this._curindex = 0;
            this._done = false;
            this._match = null;
        }
    });

    // @source RegexOptions.js

    Bridge.define("System.Text.RegularExpressions.RegexOptions", {
        statics: {
            None: 0x0000,
            IgnoreCase: 0x0001,
            Multiline: 0x0002,
            ExplicitCapture: 0x0004,
            Compiled: 0x0008,
            Singleline: 0x0010,
            IgnorePatternWhitespace: 0x0020,
            RightToLeft: 0x0040,
            ECMAScript: 0x0100,
            CultureInvariant: 0x0200
        },

        $kind: "enum",
        $flags: true
    });

    // @source RegexRunner.js

    Bridge.define("System.Text.RegularExpressions.RegexRunner", {
        statics: {},

        _runregex: null,
        _netEngine: null,

        _runtext: "", // text to search
        _runtextpos: 0, // current position in text

        _runtextbeg: 0, // beginning of text to search
        _runtextend: 0, // end of text to search
        _runtextstart: 0, // starting point for search
        _quick: false, // true value means IsMatch method call
        _prevlen: 0,

        ctor: function (regex) {
            this.$initialize();
            if (regex == null) {
                throw new System.ArgumentNullException("regex");
            }

            this._runregex = regex;

            var options = regex.getOptions();
            var optionsEnum = System.Text.RegularExpressions.RegexOptions;

            var isCaseInsensitive = (options & optionsEnum.IgnoreCase) === optionsEnum.IgnoreCase;
            var isMultiline = (options & optionsEnum.Multiline) === optionsEnum.Multiline;
            var isSingleline = (options & optionsEnum.Singleline) === optionsEnum.Singleline;
            var isIgnoreWhitespace = (options & optionsEnum.IgnorePatternWhitespace) === optionsEnum.IgnorePatternWhitespace;
            var isExplicitCapture = (options & optionsEnum.ExplicitCapture) === optionsEnum.ExplicitCapture;

            var timeoutMs = regex._matchTimeout.getTotalMilliseconds();

            this._netEngine = new System.Text.RegularExpressions.RegexEngine(regex._pattern, isCaseInsensitive, isMultiline, isSingleline, isIgnoreWhitespace, isExplicitCapture, timeoutMs);
        },

        run: function (quick, prevlen, input, beginning, length, startat) {
            if (startat < 0 || startat > input.Length) {
                throw new System.ArgumentOutOfRangeException("start", "Start index cannot be less than 0 or greater than input length.");
            }

            if (length < 0 || length > input.Length) {
                throw new ArgumentOutOfRangeException("length", "Length cannot be less than 0 or exceed input length.");
            }

            this._runtext = input;
            this._runtextbeg = beginning;
            this._runtextend = beginning + length;
            this._runtextstart = startat;
            this._quick = quick;
            this._prevlen = prevlen;

            var stoppos;
            var bump;

            if (this._runregex.getRightToLeft()) {
                stoppos = this._runtextbeg;
                bump = -1;
            } else {
                stoppos = this._runtextend;
                bump = 1;
            }

            if (this._prevlen === 0) {
                if (this._runtextstart === stoppos) {
                    return System.Text.RegularExpressions.Match.getEmpty();
                }

                this._runtextstart += bump;
            }

            // Execute Regex:
            var jsMatch = this._netEngine.match(this._runtext, this._runtextstart);

            // Convert the results:
            var result = this._convertNetEngineResults(jsMatch);
            return result;
        },

        parsePattern: function () {
            var result = this._netEngine.parsePattern();
            return result;
        },

        _convertNetEngineResults: function (jsMatch) {
            if (jsMatch.success && this._quick) {
                return null; // in quick mode, a successful match returns null
            }

            if (!jsMatch.success) {
                return System.Text.RegularExpressions.Match.getEmpty();
            }

            var patternInfo = this.parsePattern();
            var match;

            if (patternInfo.sparseSettings.isSparse) {
                match = new System.Text.RegularExpressions.MatchSparse(this._runregex, patternInfo.sparseSettings.sparseSlotMap, jsMatch.groups.length, this._runtext, 0, this._runtext.length, this._runtextstart);
            } else {
                match = new System.Text.RegularExpressions.Match(this._runregex, jsMatch.groups.length, this._runtext, 0, this._runtext.length, this._runtextstart);
            }

            var jsGroup;
            var jsCapture;
            var grOrder;
            var i;
            var j;

            for (i = 0; i < jsMatch.groups.length; i++) {
                jsGroup = jsMatch.groups[i];

                // Paste group index/length according to group ordering:
                grOrder = 0;
                if (jsGroup.descriptor != null) {
                    grOrder = this._runregex.groupNumberFromName(jsGroup.descriptor.name);
                }

                for (j = 0; j < jsGroup.captures.length; j++) {
                    jsCapture = jsGroup.captures[j];
                    match._addMatch(grOrder, jsCapture.capIndex, jsCapture.capLength);
                }
            }

            var textEndPos = jsMatch.capIndex + jsMatch.capLength;
            match._tidy(textEndPos);

            return match;
        }
    });

    // @source RegexParser.js

Bridge.define("System.Text.RegularExpressions.RegexParser", {
    statics: {
        _Q: 5, // quantifier
        _S: 4, // ordinary stoppper
        _Z: 3, // ScanBlank stopper
        _X: 2, // whitespace
        _E: 1, // should be escaped

        _category: [
            //0 1 2  3  4  5  6  7  8  9  A  B  C  D  E  F  0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F
            0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            //! " #  $  %  &  '  (  )  *  +  ,  -  .  /  0  1  2  3  4  5  6  7  8  9  :  ;  <  =  >  ?
            2, 0, 0, 3, 4, 0, 0, 0, 4, 4, 5, 5, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5,
            //@ A B  C  D  E  F  G  H  I  J  K  L  M  N  O  P  Q  R  S  T  U  V  W  X  Y  Z  [  \  ]  ^  _
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 0, 4, 0,
            //' a b  c  d  e  f  g  h  i  j  k  l  m  n  o  p  q  r  s  t  u  v  w  x  y  z  {  |  }  ~
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 4, 0, 0, 0
        ],

        escape: function (input) {
            var sb;
            var ch;
            var lastpos;
            var i;

            for (i = 0; i < input.length; i++) {
                if (System.Text.RegularExpressions.RegexParser._isMetachar(input[i])) {
                    sb = "";
                    ch = input[i];

                    sb += input.slice(0, i);

                    do {
                        sb += "\\";

                        switch (ch) {
                            case "\n":
                                ch = "n";
                                break;
                            case "\r":
                                ch = "r";
                                break;
                            case "\t":
                                ch = "t";
                                break;
                            case "\f":
                                ch = "f";
                                break;
                        }

                        sb += ch;
                        i++;
                        lastpos = i;

                        while (i < input.length) {
                            ch = input[i];

                            if (System.Text.RegularExpressions.RegexParser._isMetachar(ch)) {
                                break;
                            }

                            i++;
                        }

                        sb += input.slice(lastpos, i);
                    } while (i < input.length);

                    return sb;
                }
            }

            return input;
        },

        unescape: function (input) {
            var culture = System.Globalization.CultureInfo.invariantCulture;
            var sb;
            var lastpos;
            var i;
            var p;

            for (i = 0; i < input.length; i++) {
                if (input[i] === "\\") {
                    sb = "";
                    p = new System.Text.RegularExpressions.RegexParser(culture);
                    p._setPattern(input);

                    sb += input.slice(0, i);

                    do {
                        i++;

                        p._textto(i);

                        if (i < input.length) {
                            sb += p._scanCharEscape();
                        }

                        i = p._textpos();
                        lastpos = i;

                        while (i < input.length && input[i] !== "\\") {
                            i++;
                        }

                        sb += input.slice(lastpos, i);
                    } while (i < input.length);

                    return sb;
                }
            }

            return input;
        },

        parseReplacement: function (rep, caps, capsize, capnames, op) {
            var culture = System.Globalization.CultureInfo.getCurrentCulture(); // TODO: InvariantCulture
            var p = new System.Text.RegularExpressions.RegexParser(culture);

            p._options = op;
            p._noteCaptures(caps, capsize, capnames);
            p._setPattern(rep);

            var root = p._scanReplacement();

            return new System.Text.RegularExpressions.RegexReplacement(rep, root, caps);
        },

        _isMetachar: function (ch) {
            var code = ch.charCodeAt(0);

            return (code <= "|".charCodeAt(0) && System.Text.RegularExpressions.RegexParser._category[code] >= System.Text.RegularExpressions.RegexParser._E);
        }
    },

    _caps: null,
    _capsize: 0,
    _capnames: null,
    _pattern: "",
    _currentPos: 0,
    _concatenation: null,
    _culture: null,

    config: {
        init: function () {
            this._options = System.Text.RegularExpressions.RegexOptions.None;
        }
    },

    ctor: function (culture) {
		this.$initialize();
        this._culture = culture;
        this._caps = {};
    },

    _noteCaptures: function (caps, capsize, capnames) {
        this._caps = caps;
        this._capsize = capsize;
        this._capnames = capnames;
    },

    _setPattern: function (pattern) {
        if (pattern == null) {
            pattern = "";
        }

        this._pattern = pattern || "";
        this._currentPos = 0;
    },

    _scanReplacement: function () {
        this._concatenation = new System.Text.RegularExpressions.RegexNode(System.Text.RegularExpressions.RegexNode.Concatenate, this._options);
        var c;
        var startpos;
        var dollarNode;

        while (true) {
            c = this._charsRight();
            if (c === 0) {
                break;
            }

            startpos = this._textpos();
            while (c > 0 && this._rightChar() !== "$") {
                this._moveRight();
                c--;
            }

            this._addConcatenate(startpos, this._textpos() - startpos);

            if (c > 0) {
                if (this._moveRightGetChar() === "$") {
                    dollarNode = this._scanDollar();
                    this._concatenation.addChild(dollarNode);
                }
            }
        }

        return this._concatenation;
    },

    _addConcatenate: function (pos, cch /*, bool isReplacement*/ ) {
        if (cch === 0) {
            return;
        }

        var node;

        if (cch > 1) {
            var str = this._pattern.slice(pos, pos + cch);

            node = new System.Text.RegularExpressions.RegexNode(System.Text.RegularExpressions.RegexNode.Multi, this._options, str);
        } else {
            var ch = this._pattern[pos];

            node = new System.Text.RegularExpressions.RegexNode(System.Text.RegularExpressions.RegexNode.One, this._options, ch);
        }

        this._concatenation.addChild(node);
    },

    _useOptionE: function () {
        return (this._options & System.Text.RegularExpressions.RegexOptions.ECMAScript) !== 0;
    },

    _makeException: function (message) {
        return new System.ArgumentException("Incorrect pattern. " + message);
    },

    _scanDollar: function () {
        var maxValueDiv10 = 214748364; // Int32.MaxValue / 10;
        var maxValueMod10 = 7; // Int32.MaxValue % 10;

        if (this._charsRight() === 0) {
            return new System.Text.RegularExpressions.RegexNode(System.Text.RegularExpressions.RegexNode.One, this._options, "$");
        }

        var ch = this._rightChar();
        var angled;
        var backpos = this._textpos();
        var lastEndPos = backpos;

        // Note angle
        if (ch === "{" && this._charsRight() > 1) {
            angled = true;
            this._moveRight();
            ch = this._rightChar();
        } else {
            angled = false;
        }

        // Try to parse backreference: \1 or \{1} or \{cap}

        var capnum;
        var digit;

        if (ch >= "0" && ch <= "9") {
            if (!angled && this._useOptionE()) {
                capnum = -1;
                var newcapnum = ch - "0";

                this._moveRight();

                if (this._isCaptureSlot(newcapnum)) {
                    capnum = newcapnum;
                    lastEndPos = this._textpos();
                }

                while (this._charsRight() > 0 && (ch = this._rightChar()) >= "0" && ch <= "9") {
                    digit = ch - "0";
                    if (newcapnum > (maxValueDiv10) || (newcapnum === (maxValueDiv10) && digit > (maxValueMod10))) {
                        throw this._makeException("Capture group is out of range.");
                    }

                    newcapnum = newcapnum * 10 + digit;

                    this._moveRight();

                    if (this._isCaptureSlot(newcapnum)) {
                        capnum = newcapnum;
                        lastEndPos = this._textpos();
                    }
                }
                this._textto(lastEndPos);

                if (capnum >= 0) {
                    return new System.Text.RegularExpressions.RegexNode(System.Text.RegularExpressions.RegexNode.Ref, this._options, capnum);
                }
            } else {
                capnum = this._scanDecimal();
                if (!angled || this._charsRight() > 0 && this._moveRightGetChar() === "}") {
                    if (this._isCaptureSlot(capnum)) {
                        return new System.Text.RegularExpressions.RegexNode(System.Text.RegularExpressions.RegexNode.Ref, this._options, capnum);
                    }
                }
            }
        } else if (angled && this._isWordChar(ch)) {
            var capname = this._scanCapname();

            if (this._charsRight() > 0 && this._moveRightGetChar() === "}") {
                if (this._isCaptureName(capname)) {
                    var captureSlot = this._captureSlotFromName(capname);

                    return new System.Text.RegularExpressions.RegexNode(System.Text.RegularExpressions.RegexNode.Ref, this._options, captureSlot);
                }
            }
        } else if (!angled) {
            capnum = 1;

            switch (ch) {
                case "$":
                    this._moveRight();
                    return new System.Text.RegularExpressions.RegexNode(System.Text.RegularExpressions.RegexNode.One, this._options, "$");

                case "&":
                    capnum = 0;
                    break;

                case "`":
                    capnum = System.Text.RegularExpressions.RegexReplacement.LeftPortion;
                    break;

                case "\'":
                    capnum = System.Text.RegularExpressions.RegexReplacement.RightPortion;
                    break;

                case "+":
                    capnum = System.Text.RegularExpressions.RegexReplacement.LastGroup;
                    break;

                case "_":
                    capnum = System.Text.RegularExpressions.RegexReplacement.WholeString;
                    break;
            }

            if (capnum !== 1) {
                this._moveRight();

                return new System.Text.RegularExpressions.RegexNode(System.Text.RegularExpressions.RegexNode.Ref, this._options, capnum);
            }
        }

        // unrecognized $: literalize

        this._textto(backpos);

        return new System.Text.RegularExpressions.RegexNode(System.Text.RegularExpressions.RegexNode.One, this._options, "$");
    },

    _scanDecimal: function () {
        // Scans any number of decimal digits (pegs value at 2^31-1 if too large)

        var maxValueDiv10 = 214748364; // Int32.MaxValue / 10;
        var maxValueMod10 = 7; // Int32.MaxValue % 10;
        var i = 0;
        var ch;
        var d;

        while (this._charsRight() > 0) {
            ch = this._rightChar();
            if (ch < "0" || ch > "9") {
                break;
            }

            d = ch - "0";

            this._moveRight();

            if (i > (maxValueDiv10) || (i === (maxValueDiv10) && d > (maxValueMod10))) {
                throw this._makeException("Capture group is out of range.");
            }

            i *= 10;
            i += d;
        }

        return i;
    },

    _scanOctal: function () {
        var d;
        var i;
        var c;

        // Consume octal chars only up to 3 digits and value 0377

        c = 3;

        if (c > this._charsRight()) {
            c = this._charsRight();
        }

        for (i = 0; c > 0 && (d = this._rightChar() - "0") <= 7; c -= 1) {
            this._moveRight();

            i *= 8;
            i += d;

            if (this._useOptionE() && i >= 0x20) {
                break;
            }
        }

        // Octal codes only go up to 255.  Any larger and the behavior that Perl follows
        // is simply to truncate the high bits.
        i &= 0xFF;

        return String.fromCharCode(i);
    },

    _scanHex: function (c) {
        var i;
        var d;

        i = 0;

        if (this._charsRight() >= c) {
            for (; c > 0 && ((d = this._hexDigit(this._moveRightGetChar())) >= 0); c -= 1) {
                i *= 0x10;
                i += d;
            }
        }

        if (c > 0) {
            throw this._makeException("Insufficient hexadecimal digits.");
        }

        return i;
    },

    _hexDigit: function (ch) {
        var d;

        var code = ch.charCodeAt(0);

        if ((d = code - "0".charCodeAt(0)) <= 9) {
            return d;
        }

        if ((d = code - "a".charCodeAt(0)) <= 5) {
            return d + 0xa;
        }

        if ((d = code - "A".charCodeAt(0)) <= 5) {
            return d + 0xa;
        }

        return -1;
    },

    _scanControl: function () {
        if (this._charsRight() <= 0) {
            throw this._makeException("Missing control character.");
        }

        var ch = this._moveRightGetChar();

        // \ca interpreted as \cA

        var code = ch.charCodeAt(0);

        if (code >= "a".charCodeAt(0) && code <= "z".charCodeAt(0)) {
            code = code - ("a".charCodeAt(0) - "A".charCodeAt(0));
        }

        if ((code = (code - "@".charCodeAt(0))) < " ".charCodeAt(0)) {
            return String.fromCharCode(code);
        }

        throw this._makeException("Unrecognized control character.");
    },

    _scanCapname: function () {
        var startpos = this._textpos();

        while (this._charsRight() > 0) {
            if (!this._isWordChar(this._moveRightGetChar())) {
                this._moveLeft();

                break;
            }
        }

        return _pattern.slice(startpos, this._textpos());
    },

    _scanCharEscape: function () {
        var ch = this._moveRightGetChar();

        if (ch >= "0" && ch <= "7") {
            this._moveLeft();

            return this._scanOctal();
        }

        switch (ch) {
            case "x":
                return this._scanHex(2);
            case "u":
                return this._scanHex(4);
            case "a":
                return "\u0007";
            case "b":
                return "\b";
            case "e":
                return "\u001B";
            case "f":
                return "\f";
            case "n":
                return "\n";
            case "r":
                return "\r";
            case "t":
                return "\t";
            case "v":
                return "\u000B";
            case "c":
                return this._scanControl();
            default:
                var isInvalidBasicLatin = ch === '8' || ch === '9' || ch === '_';
                if (isInvalidBasicLatin || (!this._useOptionE() && this._isWordChar(ch))) {
                    throw this._makeException("Unrecognized escape sequence \\" + ch + ".");
                }
                return ch;
        }
    },

    _captureSlotFromName: function (capname) {
        return this._capnames[capname];
    },

    _isCaptureSlot: function (i) {
        if (this._caps != null) {
            return this._caps[i] != null;
        }

        return (i >= 0 && i < this._capsize);
    },

    _isCaptureName: function (capname) {
        if (this._capnames == null) {
            return false;
        }

        return _capnames[capname] != null;
    },

    _isWordChar: function (ch) {
        // Partial implementation,
        // see the link for more details (http://referencesource.microsoft.com/#System/regex/system/text/regularexpressions/RegexParser.cs,1156)
        return System.Char.isLetter(ch.charCodeAt(0));
    },

    _charsRight: function () {
        return this._pattern.length - this._currentPos;
    },

    _rightChar: function () {
        return this._pattern[this._currentPos];
    },

    _moveRightGetChar: function () {
        return this._pattern[this._currentPos++];
    },

    _moveRight: function () {
        this._currentPos++;
    },

    _textpos: function () {
        return this._currentPos;
    },

    _textto: function (pos) {
        this._currentPos = pos;
    },

    _moveLeft: function () {
        this._currentPos--;
    }
});

    // @source RegexNode.js

    Bridge.define("System.Text.RegularExpressions.RegexNode", {
        statics: {
            One: 9, // char     a
            Multi: 12, // string   abcdef
            Ref: 13, // index    \1
            Empty: 23, //          ()
            Concatenate: 25 //          ab
        },

        _type: 0,
        _str: null,
        _children: null,
        _next: null,
        _m: 0,

        config: {
            init: function () {
                this._options = System.Text.RegularExpressions.RegexOptions.None;
            }
        },

        ctor: function (type, options, arg) {
            this.$initialize();
            this._type = type;
            this._options = options;

            if (type === System.Text.RegularExpressions.RegexNode.Ref) {
                this._m = arg;
            } else {
                this._str = arg || null;
            }
        },

        addChild: function (newChild) {
            if (this._children == null) {
                this._children = [];
            }

            var reducedChild = newChild._reduce();
            this._children.push(reducedChild);
            reducedChild._next = this;
        },

        childCount: function () {
            return this._children == null ? 0 : this._children.length;
        },

        child: function (i) {
            return this._children[i];
        },

        _reduce: function () {
            // Warning: current implementation is just partial (for Replacement servicing)

            var n;

            switch (this._type) {
                case System.Text.RegularExpressions.RegexNode.Concatenate:
                    n = this._reduceConcatenation();
                    break;

                default:
                    n = this;
                    break;
            }

            return n;
        },

        _reduceConcatenation: function () {
            var wasLastString = false;
            var optionsLast = 0;
            var optionsAt;
            var at;
            var prev;
            var i;
            var j;
            var k;

            if (this._children == null) {
                return new System.Text.RegularExpressions.RegexNode(System.Text.RegularExpressions.RegexNode.Empty, this._options);
            }

            for (i = 0, j = 0; i < this._children.length; i++, j++) {
                at = this._children[i];

                if (j < i) {
                    this._children[j] = at;
                }

                if (at._type === System.Text.RegularExpressions.RegexNode.Concatenate && at._isRightToLeft()) {
                    for (k = 0; k < at._children.length; k++) {
                        at._children[k]._next = this;
                    }

                    this._children.splice.apply(this._children, [i + 1, 0].concat(at._children)); // _children.InsertRange(i + 1, at._children);
                    j--;
                } else if (at._type === System.Text.RegularExpressions.RegexNode.Multi || at._type === System.Text.RegularExpressions.RegexNode.One) {
                    // Cannot merge strings if L or I options differ
                    optionsAt = at._options & (System.Text.RegularExpressions.RegexOptions.RightToLeft | System.Text.RegularExpressions.RegexOptions.IgnoreCase);

                    if (!wasLastString || optionsLast !== optionsAt) {
                        wasLastString = true;
                        optionsLast = optionsAt;
                        continue;
                    }

                    prev = this._children[--j];

                    if (prev._type === System.Text.RegularExpressions.RegexNode.One) {
                        prev._type = System.Text.RegularExpressions.RegexNode.Multi;
                        prev._str = prev._str;
                    }

                    if ((optionsAt & System.Text.RegularExpressions.RegexOptions.RightToLeft) === 0) {
                        prev._str += at._str;
                    } else {
                        prev._str = at._str + prev._str;
                    }
                } else if (at._type === System.Text.RegularExpressions.RegexNode.Empty) {
                    j--;
                } else {
                    wasLastString = false;
                }
            }

            if (j < i) {
                this._children.splice(j, i - j);
            }

            return this._stripEnation(System.Text.RegularExpressions.RegexNode.Empty);
        },

        _stripEnation: function (emptyType) {
            switch (this.childCount()) {
                case 0:
                    return new scope.RegexNode(emptyType, this._options);
                case 1:
                    return this.child(0);
                default:
                    return this;
            }
        },

        _isRightToLeft: function () {
            if ((this._options & System.Text.RegularExpressions.RegexOptions.RightToLeft) > 0) {
                return true;
            }

            return false;
        },
    });

    // @source RegexReplacement.js

    Bridge.define("System.Text.RegularExpressions.RegexReplacement", {
        statics: {
            replace: function (evaluator, regex, input, count, startat) {
                if (evaluator == null) {
                    throw new System.ArgumentNullException("evaluator");
                }

                if (count < -1) {
                    throw new System.ArgumentOutOfRangeException("count", "Count cannot be less than -1.");
                }

                if (startat < 0 || startat > input.length) {
                    throw new System.ArgumentOutOfRangeException("startat", "Start index cannot be less than 0 or greater than input length.");
                }

                if (count === 0) {
                    return input;
                }

                var match = regex.match$1(input, startat);

                if (!match.getSuccess()) {
                    return input;
                } else {
                    var sb = "";
                    var prevat;
                    var matchIndex;
                    var matchLength;

                    if (!regex.getRightToLeft()) {
                        prevat = 0;

                        do {
                            matchIndex = match.getIndex();
                            matchLength = match.getLength();

                            if (matchIndex !== prevat) {
                                sb += input.slice(prevat, matchIndex);
                            }

                            prevat = matchIndex + matchLength;
                            sb += evaluator(match);

                            if (--count === 0) {
                                break;
                            }

                            match = match.nextMatch();
                        } while (match.getSuccess());

                        if (prevat < input.length) {
                            sb += input.slice(prevat, input.length);
                        }
                    } else {
                        var al = [];

                        prevat = input.length;

                        do {
                            matchIndex = match.getIndex();
                            matchLength = match.getLength();

                            if (matchIndex + matchLength !== prevat) {
                                al.push(input.slice(matchIndex + matchLength, prevat));
                            }

                            prevat = matchIndex;
                            al.push(evaluator(match));

                            if (--count === 0) {
                                break;
                            }

                            match = match.nextMatch();
                        } while (match.getSuccess());

                        sb = new StringBuilder();

                        if (prevat > 0) {
                            sb += sb.slice(0, prevat);
                        }

                        var i;
                        for (i = al.length - 1; i >= 0; i--) {
                            sb += al[i];
                        }
                    }

                    return sb;
                }
            },

            split: function (regex, input, count, startat) {
                if (count < 0) {
                    throw new System.ArgumentOutOfRangeException("count", "Count can't be less than 0.");
                }

                if (startat < 0 || startat > input.length) {
                    throw new System.ArgumentOutOfRangeException("startat", "Start index cannot be less than 0 or greater than input length.");
                }

                var result = [];

                if (count === 1) {
                    result.push(input);

                    return result;
                }

                --count;
                var match = regex.match$1(input, startat);

                if (!match.getSuccess()) {
                    result.push(input);
                } else {
                    var i;
                    var prevat;
                    var matchIndex;
                    var matchLength;
                    var matchGroups;
                    var matchGroupsCount;

                    if (!regex.getRightToLeft()) {
                        prevat = 0;

                        for (;;) {
                            matchIndex = match.getIndex();
                            matchLength = match.getLength();
                            matchGroups = match.getGroups();
                            matchGroupsCount = matchGroups.getCount();

                            result.push(input.slice(prevat, matchIndex));
                            prevat = matchIndex + matchLength;

                            // add all matched capture groups to the list.
                            for (i = 1; i < matchGroupsCount; i++) {
                                if (match._isMatched(i)) {
                                    result.push(matchGroups.get(i).toString());
                                }
                            }

                            --count;
                            if (count === 0) {
                                break;
                            }

                            match = match.nextMatch();

                            if (!match.getSuccess()) {
                                break;
                            }
                        }

                        result.push(input.slice(prevat, input.length));
                    } else {
                        prevat = input.length;

                        for (;;) {
                            matchIndex = match.getIndex();
                            matchLength = match.getLength();
                            matchGroups = match.getGroups();
                            matchGroupsCount = matchGroups.getCount();

                            result.push(input.slice(matchIndex + matchLength, prevat));
                            prevat = matchIndex;

                            // add all matched capture groups to the list.
                            for (i = 1; i < matchGroupsCount; i++) {
                                if (match._isMatched(i)) {
                                    result.push(matchGroups.get(i).toString());
                                }
                            }

                            --count;
                            if (count === 0) {
                                break;
                            }

                            match = match.nextMatch();
                            if (!match.getSuccess()) {
                                break;
                            }
                        }

                        result.push(input.slice(0, prevat));
                        result.reverse();
                    }
                }

                return result;
            },

            Specials: 4,
            LeftPortion: -1,
            RightPortion: -2,
            LastGroup: -3,
            WholeString: -4
        },

        _rep: "",
        _strings: [], // table of string constants
        _rules: [], // negative -> group #, positive -> string #

        ctor: function (rep, concat, caps) {
            this.$initialize();
            this._rep = rep;

            if (concat._type !== System.Text.RegularExpressions.RegexNode.Concatenate) {
                throw new System.ArgumentException("Replacement error.");
            }

            var sb = "";
            var strings = [];
            var rules = [];
            var slot;
            var child;
            var i;

            for (i = 0; i < concat.childCount(); i++) {
                child = concat.child(i);

                switch (child._type) {
                    case System.Text.RegularExpressions.RegexNode.Multi:
                    case System.Text.RegularExpressions.RegexNode.One:
                        sb += child._str;
                        break;

                    case System.Text.RegularExpressions.RegexNode.Ref:
                        if (sb.length > 0) {
                            rules.push(strings.length);
                            strings.push(sb);
                            sb = "";
                        }

                        slot = child._m;

                        if (caps != null && slot >= 0) {
                            slot = caps[slot];
                        }

                        rules.push(-System.Text.RegularExpressions.RegexReplacement.Specials - 1 - slot);
                        break;
                    default:
                        throw new System.ArgumentException("Replacement error.");
                }
            }

            if (sb.length > 0) {
                rules.push(strings.length);
                strings.push(sb);
            }

            this._strings = strings;
            this._rules = rules;
        },

        getPattern: function () {
            return _rep;
        },

        replacement: function (match) {
            return this._replacementImpl("", match);
        },

        replace: function (regex, input, count, startat) {
            if (count < -1) {
                throw new System.ArgumentOutOfRangeException("count", "Count cannot be less than -1.");
            }
            if (startat < 0 || startat > input.length) {
                throw new System.ArgumentOutOfRangeException("startat", "Start index cannot be less than 0 or greater than input length.");
            }

            if (count === 0) {
                return input;
            }

            var match = regex.match$1(input, startat);

            if (!match.getSuccess()) {
                return input;
            } else {
                var sb = "";
                var prevat;
                var matchIndex;
                var matchLength;

                if (!regex.getRightToLeft()) {
                    prevat = 0;

                    do {
                        matchIndex = match.getIndex();
                        matchLength = match.getLength();

                        if (matchIndex !== prevat) {
                            sb += input.slice(prevat, matchIndex);
                        }

                        prevat = matchIndex + matchLength;
                        sb = this._replacementImpl(sb, match);

                        if (--count === 0) {
                            break;
                        }

                        match = match.nextMatch();
                    } while (match.getSuccess());

                    if (prevat < input.length) {
                        sb += input.slice(prevat, input.length);
                    }
                } else {
                    var al = [];
                    prevat = input.length;

                    do {
                        matchIndex = match.getIndex();
                        matchLength = match.getLength();

                        if (matchIndex + matchLength !== prevat) {
                            al.push(input.slice(matchIndex + matchLength, prevat));
                        }

                        prevat = matchIndex;
                        this._replacementImplRTL(al, match);

                        if (--count === 0) {
                            break;
                        }

                        match = match.nextMatch();
                    } while (match.getSuccess());

                    if (prevat > 0) {
                        sb += sb.slice(0, prevat);
                    }

                    var i;
                    for (i = al.length - 1; i >= 0; i--) {
                        sb += al[i];
                    }
                }

                return sb;
            }
        },

        _replacementImpl: function (sb, match) {
            var specials = System.Text.RegularExpressions.RegexReplacement.Specials;
            var r;
            var i;

            for (i = 0; i < this._rules.length; i++) {
                r = this._rules[i];

                if (r >= 0) {
                    // string lookup
                    sb += this._strings[r];
                } else if (r < -specials) {
                    // group lookup
                    sb += match._groupToStringImpl(-specials - 1 - r);
                } else {
                    // special insertion patterns
                    switch (-specials - 1 - r) {
                        case System.Text.RegularExpressions.RegexReplacement.LeftPortion:
                            sb += match._getLeftSubstring();
                            break;
                        case System.Text.RegularExpressions.RegexReplacement.RightPortion:
                            sb += match._getRightSubstring();
                            break;
                        case System.Text.RegularExpressions.RegexReplacement.LastGroup:
                            sb += match._lastGroupToStringImpl();
                            break;
                        case System.Text.RegularExpressions.RegexReplacement.WholeString:
                            sb += match._getOriginalString();
                            break;
                    }
                }
            }

            return sb;
        },

        _replacementImplRTL: function (al, match) {
            var specials = System.Text.RegularExpressions.RegexReplacement.Specials;
            var r;
            var i;

            for (i = _rules.length - 1; i >= 0; i--) {
                r = this._rules[i];

                if (r >= 0) {
                    // string lookup
                    al.push(this._strings[r]);
                } else if (r < -specials) {
                    // group lookup
                    al.push(match._groupToStringImpl(-specials - 1 - r));
                } else {
                    // special insertion patterns
                    switch (-specials - 1 - r) {
                        case System.Text.RegularExpressions.RegexReplacement.LeftPortion:
                            al.push(match._getLeftSubstring());
                            break;
                        case System.Text.RegularExpressions.RegexReplacement.RightPortion:
                            al.push(match._getRightSubstring());
                            break;
                        case System.Text.RegularExpressions.RegexReplacement.LastGroup:
                            al.push(match._lastGroupToStringImpl());
                            break;
                        case System.Text.RegularExpressions.RegexReplacement.WholeString:
                            al.push(match._getOriginalString());
                            break;
                    }
                }
            }
        }
    });

    // @source RegexEngine.js

    Bridge.define("System.Text.RegularExpressions.RegexEngine", {
        _pattern: "",
        _patternInfo: null,

        _text: "",
        _textStart: 0,
        _timeoutMs: -1,
        _timeoutTime: -1,
        _settings: null,

        _branchType: {
            base: 0,
            offset: 1,
            lazy: 2,
            greedy: 3,
            or: 4
        },

        _branchResultKind: {
            ok: 1,
            endPass: 2,
            nextPass: 3,
            nextBranch: 4
        },

        // ============================================================================================
        // Public functions
        // ============================================================================================
        ctor: function (pattern, isCaseInsensitive, isMultiLine, isSingleline, isIgnoreWhitespace, isExplicitCapture, timeoutMs) {
            this.$initialize();

            if (pattern == null) {
                throw new System.ArgumentNullException("pattern");
            }

            this._pattern = pattern;
            this._timeoutMs = timeoutMs;
            this._settings = {
                ignoreCase: isCaseInsensitive,
                multiline: isMultiLine,
                singleline: isSingleline,
                ignoreWhitespace: isIgnoreWhitespace,
                explicitCapture: isExplicitCapture
            };
        },

        match: function (text, textStart) {
            if (text == null) {
                throw new System.ArgumentNullException("text");
            }

            if (textStart != null && (textStart < 0 || textStart > text.length)) {
                throw new System.ArgumentOutOfRangeException("textStart", "Start index cannot be less than 0 or greater than input length.");
            }

            this._text = text;
            this._textStart = textStart;
            this._timeoutTime = this._timeoutMs > 0 ? new Date().getTime() + System.Convert.toInt32(this._timeoutMs + 0.5) : -1;

            // Get group descriptors
            var patternInfo = this.parsePattern();
            if (patternInfo.shouldFail) {
                return this._getEmptyMatch();
            }

            this._checkTimeout();

            var scanRes = this._scanAndTransformResult(textStart, patternInfo.tokens, false, null);
            return scanRes;
        },

        parsePattern: function () {
            if (this._patternInfo == null) {
                var parser = System.Text.RegularExpressions.RegexEngineParser;
                var patternInfo = parser.parsePattern(this._pattern, this._cloneSettings(this._settings));
                this._patternInfo = patternInfo;
            }
            return this._patternInfo;
        },

        // ============================================================================================
        // Engine main logic
        // ============================================================================================
        _scanAndTransformResult: function (textPos, tokens, noOffset, desiredLen) {
            var state = this._scan(textPos, this._text.length, tokens, noOffset, desiredLen);
            var transformedRes = this._collectScanResults(state, textPos);
            return transformedRes;
        },

        _scan: function (textPos, textEndPos, tokens, noOffset, desiredLen) {
            var resKind = this._branchResultKind;
            var branches = [];
            branches.grCaptureCache = {};

            var branch = null;
            var res = null;

            // Empty pattern case:
            if (tokens.length === 0) {
                var state = new System.Text.RegularExpressions.RegexEngineState();
                state.capIndex = textPos;
                state.txtIndex = textPos;
                state.capLength = 0;
                return state;
            }

            // Init base branch:
            var baseBranchType = noOffset ? this._branchType.base : this._branchType.offset;

            var endPos = this._patternInfo.isContiguous ? textPos : textEndPos;
            var baseBranch = new System.Text.RegularExpressions.RegexEngineBranch(baseBranchType, textPos, textPos, endPos);
            baseBranch.pushPass(0, tokens, this._cloneSettings(this._settings));
            baseBranch.started = true;
            baseBranch.state.txtIndex = textPos;
            branches.push(baseBranch);

            while (branches.length) {
                branch = branches[branches.length - 1];

                res = this._scanBranch(textEndPos, branches, branch);
                if (res === resKind.ok && (desiredLen == null || branch.state.capLength === desiredLen)) {
                    return branch.state;
                }

                //if (!this.branchLimit) {
                //    this.branchLimit = 1;
                //} else {
                //    this.branchLimit++;
                //    if (this.branchLimit > 200000) {
                //        alert("Too many branches :(");
                //        break;
                //    }
                //}

                this._advanceToNextBranch(branches, branch);
                this._checkTimeout();
            }

            return null;
        },

        _scanBranch: function (textEndPos, branches, branch) {
            var resKind = this._branchResultKind;
            var pass;
            var res;

            if (branch.mustFail) {
                branch.mustFail = false;
                return resKind.nextBranch;
            }

            while (branch.hasPass()) {
                pass = branch.peekPass();

                if (pass.tokens == null || pass.tokens.length === 0) {
                    res = resKind.endPass;
                } else {
                    // Add alternation branches before scanning:
                    if (this._addAlternationBranches(branches, branch, pass) === resKind.nextBranch) {
                        return resKind.nextBranch;
                    }

                    // Scan:
                    res = this._scanPass(textEndPos, branches, branch, pass);
                }

                switch (res) {
                    case resKind.nextBranch:
                        // Move to the next branch:
                        return res;

                    case resKind.nextPass:
                        // switch to the recently added pass
                        continue;

                    case resKind.endPass:
                    case resKind.ok:
                        // End of pass has been reached:
                        branch.popPass();
                        break;

                    default:
                        throw new System.InvalidOperationException("Unexpected branch result.");
                }
            }

            return resKind.ok;
        },

        _scanPass: function (textEndPos, branches, branch, pass) {
            var resKind = this._branchResultKind;
            var passEndIndex = pass.tokens.length;
            var token;
            var probe;
            var res;

            while (pass.index < passEndIndex) {
                token = pass.tokens[pass.index];
                probe = pass.probe;

                // Add probing:
                if (probe == null) {
                    if (this._addBranchBeforeProbing(branches, branch, pass, token)) {
                        return resKind.nextBranch;
                    }
                } else {
                    if (probe.value < probe.min || probe.forced) {
                        res = this._scanToken(textEndPos, branches, branch, pass, token);
                        if (res !== resKind.ok) {
                            return res;
                        }
                        probe.value += 1;
                        probe.forced = false;
                        continue;
                    }

                    this._addBranchAfterProbing(branches, branch, pass, probe);
                    if (probe.forced) {
                        continue;
                    }

                    pass.probe = null;
                    pass.index++;
                    continue;
                }

                // Process the token:
                res = this._scanToken(textEndPos, branches, branch, pass, token);

                // Process the result of the token scan:
                switch (res) {
                    case resKind.nextBranch:
                    case resKind.nextPass:
                    case resKind.endPass:
                        return res;

                    case resKind.ok:
                        // Advance to the next token within the current pass:
                        pass.index++;
                        break;

                    default:
                        throw new System.InvalidOperationException("Unexpected branch-pass result.");
                }
            }

            return resKind.ok;
        },

        _addAlternationBranches: function (branches, branch, pass) {
            var tokenTypes = System.Text.RegularExpressions.RegexEngineParser.tokenTypes;
            var branchTypes = this._branchType;
            var passEndIndex = pass.tokens.length;
            var resKind = this._branchResultKind;
            var orIndexes;
            var newBranch;
            var newPass;
            var token;
            var i;

            // Scan potential alternations:
            if (!pass.alternationHandled && !pass.tokens.noAlternation) {
                orIndexes = [-1];
                for (i = 0; i < passEndIndex; i++) {
                    token = pass.tokens[i];
                    if (token.type === tokenTypes.alternation) {
                        orIndexes.push(i);
                    }
                }

                if (orIndexes.length > 1) {
                    for (i = 0; i < orIndexes.length; i++) {
                        newBranch = new System.Text.RegularExpressions.RegexEngineBranch(branchTypes.or, i, 0, orIndexes.length, branch.state);
                        newBranch.isNotFailing = true;
                        newPass = newBranch.peekPass();
                        newPass.alternationHandled = true;
                        newPass.index = orIndexes[i] + 1;
                        branches.splice(branches.length - i, 0, newBranch);
                    }

                    // The last branch must fail:
                    branches[branches.length - orIndexes.length].isNotFailing = false;

                    // The parent branch must be ended up immediately:
                    branch.mustFail = true;

                    pass.alternationHandled = true;
                    return resKind.nextBranch;
                } else {
                    pass.tokens.noAlternation = true;
                }
            }

            return resKind.ok;
        },

        _addBranchBeforeProbing: function (branches, branch, pass, token) {
            // Add +, *, ? branches:
            var probe = this._tryGetTokenProbe(token);
            if (probe == null) {
                return false;
            }

            pass.probe = probe;

            var branchType = probe.isLazy ? this._branchType.lazy : this._branchType.greedy;
            var newBranch = new System.Text.RegularExpressions.RegexEngineBranch(branchType, probe.value, probe.min, probe.max, branch.state);
            branches.push(newBranch);
            return true;
        },

        _addBranchAfterProbing: function (branches, branch, pass, probe) {
            if (probe.isLazy) {
                if (probe.value + 1 <= probe.max) {
                    var lazyBranch = branch.clone();
                    var lazyProbe = lazyBranch.peekPass().probe;
                    lazyBranch.value += 1;
                    lazyProbe.forced = true;

                    // add to the left from the current branch
                    branches.splice(branches.length - 1, 0, lazyBranch);
                    branch.isNotFailing = true;
                }
            } else {
                if (probe.value + 1 <= probe.max) {
                    var greedyBranch = branch.clone();
                    greedyBranch.started = true;
                    greedyBranch.peekPass().probe = null;
                    greedyBranch.peekPass().index++;
                    branches.splice(branches.length - 1, 0, greedyBranch);

                    probe.forced = true;
                    branch.value += 1;
                    branch.isNotFailing = true;
                }
            }
        },

        _tryGetTokenProbe: function (token) {
            var qtoken = token.qtoken;
            if (qtoken == null) {
                return null;
            }

            var tokenTypes = System.Text.RegularExpressions.RegexEngineParser.tokenTypes;
            var min;
            var max;

            if (qtoken.type === tokenTypes.quantifier) {
                switch (qtoken.value) {
                    case "*":
                    case "*?":
                        min = 0;
                        max = 2147483647;
                        break;

                    case "+":
                    case "+?":
                        min = 1;
                        max = 2147483647;
                        break;

                    case "?":
                    case "??":
                        min = 0;
                        max = 1;
                        break;

                    default:
                        throw new System.InvalidOperationException("Unexpected quantifier value.");
                }
            } else if (qtoken.type === tokenTypes.quantifierN) {
                min = qtoken.data.n;
                max = qtoken.data.n;
            } else if (qtoken.type === tokenTypes.quantifierNM) {
                min = qtoken.data.n;
                max = qtoken.data.m != null ? qtoken.data.m : 2147483647;
            } else {
                return null;
            }

            var probe = new System.Text.RegularExpressions.RegexEngineProbe(min, max, 0, qtoken.data.isLazy);
            return probe;
        },

        _advanceToNextBranch: function (branches, branch) {
            if (branches.length === 0) {
                return;
            }

            var lastBranch = branches[branches.length - 1];
            if (!lastBranch.started) {
                lastBranch.started = true;
                return;
            }

            if (branch !== lastBranch) {
                throw new System.InvalidOperationException("Current branch is supposed to be the last one.");
            }

            if (branches.length === 1 && branch.type === this._branchType.offset) {
                branch.value++;
                branch.state.txtIndex = branch.value;
                branch.mustFail = false;

                // clear state:
                branch.state.capIndex = null;
                branch.state.capLength = 0;
                branch.state.groups.length = 0;
                branch.state.passes.length = 1;
                branch.state.passes[0].clearState(this._cloneSettings(this._settings));

                if (branch.value > branch.max) {
                    branches.pop();
                }
            } else {
                branches.pop();

                if (!branch.isNotFailing) {
                    lastBranch = branches[branches.length - 1];
                    this._advanceToNextBranch(branches, lastBranch);
                    return;
                }
            }
        },

        _collectScanResults: function (state, textPos) {
            var groupDescs = this._patternInfo.groups;
            var text = this._text;
            var processedGroupNames = {};
            var capGroups;
            var capGroup;
            var groupsMap = {};
            var groupDesc;
            var capture;
            var group;
            var i;

            // Create Empty match object:
            var match = this._getEmptyMatch();

            if (state != null) {
                capGroups = state.groups;

                // For successful match fill Match object:
                this._fillMatch(match, state.capIndex, state.capLength, textPos);

                // Fill group captures:
                for (i = 0; i < capGroups.length; i++) {
                    capGroup = capGroups[i];
                    groupDesc = groupDescs[capGroup.rawIndex - 1];
                    if (groupDesc.constructs.skipCapture) {
                        continue;
                    }

                    capture = {
                        capIndex: capGroup.capIndex,
                        capLength: capGroup.capLength,
                        value: text.slice(capGroup.capIndex, capGroup.capIndex + capGroup.capLength)
                    };

                    group = groupsMap[groupDesc.name];
                    if (group == null) {
                        group = {
                            capIndex: 0,
                            capLength: 0,
                            value: "",
                            success: false,
                            captures: [capture]
                        };

                        groupsMap[groupDesc.name] = group;
                    } else {
                        group.captures.push(capture);
                    }
                }

                // Add groups to Match in the required order:
                for (i = 0; i < groupDescs.length; i++) {
                    groupDesc = groupDescs[i];
                    if (groupDesc.constructs.skipCapture) {
                        continue;
                    }

                    if (processedGroupNames[groupDesc.name] === true) {
                        continue;
                    }

                    group = groupsMap[groupDesc.name];
                    if (group == null) {
                        group = {
                            capIndex: 0,
                            capLength: 0,
                            value: "",
                            success: false,
                            captures: []
                        };
                    } else {
                        // Update group values with the last capture info:
                        if (group.captures.length > 0) {
                            capture = group.captures[group.captures.length - 1];

                            group.capIndex = capture.capIndex;
                            group.capLength = capture.capLength;
                            group.value = capture.value;
                            group.success = true;
                        }
                    }

                    processedGroupNames[groupDesc.name] = true;
                    group.descriptor = groupDesc; // TODO: check if we can get rid of this
                    match.groups.push(group);
                }
            }

            return match;
        },

        // ============================================================================================
        // Token processing
        // ============================================================================================
        _scanToken: function (textEndPos, branches, branch, pass, token) {
            var tokenTypes = System.Text.RegularExpressions.RegexEngineParser.tokenTypes;
            var resKind = this._branchResultKind;

            switch (token.type) {
                case tokenTypes.group:
                case tokenTypes.groupImnsx:
                case tokenTypes.alternationGroup:
                    return this._scanGroupToken(textEndPos, branches, branch, pass, token);

                case tokenTypes.groupImnsxMisc:
                    return this._scanGroupImnsxToken(token.group.constructs, pass.settings);

                case tokenTypes.charGroup:
                    return this._scanCharGroupToken(branches, branch, pass, token, false);

                case tokenTypes.charNegativeGroup:
                    return this._scanCharNegativeGroupToken(branches, branch, pass, token, false);

                case tokenTypes.escChar:
                case tokenTypes.escCharOctal:
                case tokenTypes.escCharHex:
                case tokenTypes.escCharUnicode:
                case tokenTypes.escCharCtrl:
                    return this._scanLiteral(textEndPos, branches, branch, pass, token.data.ch);

                case tokenTypes.escCharOther:
                case tokenTypes.escCharClass:
                    return this._scanEscapeToken(branches, branch, pass, token);

                case tokenTypes.escCharClassCategory:
                    throw new System.NotSupportedException("Unicode Category constructions are not supported.");

                case tokenTypes.escCharClassBlock:
                    throw new System.NotSupportedException("Unicode Named block constructions are not supported.");

                case tokenTypes.escCharClassDot:
                    return this._scanDotToken(textEndPos, branches, branch, pass);

                case tokenTypes.escBackrefNumber:
                    return this._scanBackrefNumberToken(textEndPos, branches, branch, pass, token);

                case tokenTypes.escBackrefName:
                    return this._scanBackrefNameToken(textEndPos, branches, branch, pass, token);

                case tokenTypes.anchor:
                case tokenTypes.escAnchor:
                    return this._scanAnchorToken(textEndPos, branches, branch, pass, token);

                case tokenTypes.groupConstruct:
                case tokenTypes.groupConstructName:
                case tokenTypes.groupConstructImnsx:
                case tokenTypes.groupConstructImnsxMisc:
                    return resKind.ok;

                case tokenTypes.alternationGroupCondition:
                case tokenTypes.alternationGroupRefNameCondition:
                case tokenTypes.alternationGroupRefNumberCondition:
                    return this._scanAlternationConditionToken(textEndPos, branches, branch, pass, token);

                case tokenTypes.alternation:
                    return resKind.endPass;

                case tokenTypes.commentInline:
                case tokenTypes.commentXMode:
                    return resKind.ok;

                default:
                    return this._scanLiteral(textEndPos, branches, branch, pass, token.value);
            }
        },

        _scanGroupToken: function (textEndPos, branches, branch, pass, token) {
            var tokenTypes = System.Text.RegularExpressions.RegexEngineParser.tokenTypes;
            var resKind = this._branchResultKind;
            var textIndex = branch.state.txtIndex;

            if (pass.onHold) {
                if (token.type === tokenTypes.group) {
                    var rawIndex = token.group.rawIndex;
                    var capIndex = pass.onHoldTextIndex;
                    var capLength = textIndex - capIndex;

                    // Cache value to avoid proceeding with the already checked route:
                    var tokenCache = branches.grCaptureCache[rawIndex];
                    if (tokenCache == null) {
                        tokenCache = {};
                        branches.grCaptureCache[rawIndex] = tokenCache;
                    }

                    var key = capIndex.toString() + "_" + capLength.toString();
                    if (tokenCache[key] == null) {
                        tokenCache[key] = true;
                    } else {
                        return resKind.nextBranch;
                    }

                    if (!token.group.constructs.emptyCapture) {
                        if (token.group.isBalancing) {
                            branch.state.logCaptureGroupBalancing(token.group, capIndex);
                        } else {
                            branch.state.logCaptureGroup(token.group, capIndex, capLength);
                        }
                    }
                }

                pass.onHold = false;
                pass.onHoldTextIndex = -1;
                return resKind.ok;
            }

            if (token.type === tokenTypes.group ||
                token.type === tokenTypes.groupImnsx) {
                var constructs = token.group.constructs;

                // Update Pass settings:
                this._scanGroupImnsxToken(constructs, pass.settings);

                // Scan Grouping constructs:
                if (constructs.isPositiveLookahead || constructs.isNegativeLookahead ||
                    constructs.isPositiveLookbehind || constructs.isNegativeLookbehind) {
                    var scanLookRes = this._scanLook(branch, textIndex, textEndPos, token);
                    return scanLookRes;
                } else if (constructs.isNonbacktracking) {
                    var scanNonBacktrackingRes = this._scanNonBacktracking(branch, textIndex, textEndPos, token);
                    return scanNonBacktrackingRes;
                }
            }

            // Continue scanning a regular group:
            pass.onHoldTextIndex = textIndex;
            pass.onHold = true;

            branch.pushPass(0, token.children, this._cloneSettings(pass.settings));
            return resKind.nextPass;
        },

        _scanGroupImnsxToken: function (constructs, settings) {
            var resKind = this._branchResultKind;

            if (constructs.isIgnoreCase != null) {
                settings.ignoreCase = constructs.isIgnoreCase;
            }

            if (constructs.isMultiline != null) {
                settings.multiline = constructs.isMultiline;
            }

            if (constructs.isSingleLine != null) {
                settings.singleline = constructs.isSingleLine;
            }

            if (constructs.isIgnoreWhitespace != null) {
                settings.ignoreWhitespace = constructs.isIgnoreWhitespace;
            }

            if (constructs.isExplicitCapture != null) {
                settings.explicitCapture = constructs.isExplicitCapture;
            }

            return resKind.ok;
        },

        _scanAlternationConditionToken: function (textEndPos, branches, branch, pass, token) {
            var tokenTypes = System.Text.RegularExpressions.RegexEngineParser.tokenTypes;
            var resKind = this._branchResultKind;
            var children = token.children;
            var textIndex = branch.state.txtIndex;
            var res = resKind.nextBranch;

            if (token.type === tokenTypes.alternationGroupRefNameCondition ||
                token.type === tokenTypes.alternationGroupRefNumberCondition) {
                var grCapture = branch.state.resolveBackref(token.data.packedSlotId);
                if (grCapture != null) {
                    res = resKind.ok;
                } else {
                    res = resKind.nextBranch;
                }
            } else {
                // Resolve expression:
                var state = this._scan(textIndex, textEndPos, children, true, null);
                if (this._combineScanResults(branch, state)) {
                    res = resKind.ok;
                }
            }

            if (res === resKind.nextBranch && pass.tokens.noAlternation) {
                res = resKind.endPass;
            }

            return res;
        },

        _scanLook: function (branch, textIndex, textEndPos, token) {
            var constructs = token.group.constructs;
            var resKind = this._branchResultKind;
            var children = token.children;
            var expectedRes;
            var actualRes;

            var isLookahead = constructs.isPositiveLookahead || constructs.isNegativeLookahead;
            var isLookbehind = constructs.isPositiveLookbehind || constructs.isNegativeLookbehind;

            if (isLookahead || isLookbehind) {
                children = children.slice(1, children.length); // remove constructs

                expectedRes = constructs.isPositiveLookahead || constructs.isPositiveLookbehind;
                if (isLookahead) {
                    actualRes = this._scanLookAhead(branch, textIndex, textEndPos, children);
                } else {
                    actualRes = this._scanLookBehind(branch, textIndex, textEndPos, children);
                }

                if (expectedRes === actualRes) {
                    return resKind.ok;
                } else {
                    return resKind.nextBranch;
                }
            }

            return null;
        },

        _scanLookAhead: function (branch, textIndex, textEndPos, tokens) {
            var state = this._scan(textIndex, textEndPos, tokens, true, null);
            return this._combineScanResults(branch, state);
        },

        _scanLookBehind: function (branch, textIndex, textEndPos, tokens) {
            var currIndex = textIndex;
            var strLen;
            var state;

            while (currIndex >= 0) {
                strLen = textIndex - currIndex;
                state = this._scan(currIndex, textEndPos, tokens, true, strLen);

                if (this._combineScanResults(branch, state)) {
                    return true;
                }

                --currIndex;
            }

            return false;
        },

        _scanNonBacktracking: function (branch, textIndex, textEndPos, token) {
            var resKind = this._branchResultKind;
            var children = token.children;
            children = children.slice(1, children.length); // remove constructs

            var state = this._scan(textIndex, textEndPos, children, true, null);
            if (!state) {
                return resKind.nextBranch;
            }

            branch.state.logCapture(state.capLength);

            return resKind.ok;
        },

        _scanLiteral: function (textEndPos, branches, branch, pass, literal) {
            var resKind = this._branchResultKind;
            var index = branch.state.txtIndex;

            if (index + literal.length > textEndPos) {
                return resKind.nextBranch;
            }

            var i;
            if (pass.settings.ignoreCase) {
                for (i = 0; i < literal.length; i++) {
                    if (this._text[index + i].toLowerCase() !== literal[i].toLowerCase()) {
                        return resKind.nextBranch;
                    }
                }
            } else {
                for (i = 0; i < literal.length; i++) {
                    if (this._text[index + i] !== literal[i]) {
                        return resKind.nextBranch;
                    }
                }
            }

            branch.state.logCapture(literal.length);
            return resKind.ok;
        },

        _scanWithJsRegex: function (branches, branch, pass, token, tokenValue) {
            var resKind = this._branchResultKind;
            var index = branch.state.txtIndex;
            var ch = this._text[index];
            if (ch == null) {
                ch = "";
            }

            var options = pass.settings.ignoreCase ? "i" : "";

            var rgx = token.rgx;
            if (rgx == null) {
                if (tokenValue == null) {
                    tokenValue = token.value;
                }
                rgx = new RegExp(tokenValue, options);
                token.rgx = rgx;
            }

            if (rgx.test(ch)) {
                branch.state.logCapture(ch.length);
                return resKind.ok;
            }

            return resKind.nextBranch;
        },

        _scanWithJsRegex2: function (textIndex, pattern) {
            var resKind = this._branchResultKind;
            var ch = this._text[textIndex];
            if (ch == null) {
                ch = "";
            }

            var rgx = new RegExp(pattern, "");
            if (rgx.test(ch)) {
                return resKind.ok;
            }

            return resKind.nextBranch;
        },

        _scanCharGroupToken: function (branches, branch, pass, token, skipLoggingCapture) {
            var tokenTypes = System.Text.RegularExpressions.RegexEngineParser.tokenTypes;
            var resKind = this._branchResultKind;
            var index = branch.state.txtIndex;
            var ch = this._text[index];
            if (ch == null) {
                return resKind.nextBranch;
            }

            var i;
            var j;
            var n = ch.charCodeAt(0);
            var ranges = token.data.ranges;
            var range;
            var upperCh;

            // Check susbstruct group:
            if (token.data.substractToken != null) {
                var substractRes;
                if (token.data.substractToken.type === tokenTypes.charGroup) {
                    substractRes = this._scanCharGroupToken(branches, branch, pass, token.data.substractToken, true);
                } else if (token.data.substractToken.type === tokenTypes.charNegativeGroup) {
                    substractRes = this._scanCharNegativeGroupToken(branches, branch, pass, token.data.substractToken, true);
                } else {
                    throw new System.InvalidOperationException("Unexpected substuct group token.");
                }

                if (substractRes === resKind.ok) {
                    return token.type === tokenTypes.charGroup ? resKind.nextBranch : resKind.ok;
                }
            }

            // Try CharClass tokens like: \s \S \d \D
            if (ranges.charClassToken != null) {
                var charClassRes = this._scanWithJsRegex(branches, branch, pass, ranges.charClassToken);
                if (charClassRes === resKind.ok) {
                    return resKind.ok;
                }
            }

            // 2 iterations - to handle both cases: upper and lower
            for (j = 0; j < 2; j++) {
                //TODO: [Performance] Use binary search
                for (i = 0; i < ranges.length; i++) {
                    range = ranges[i];

                    if (range.n > n) {
                        break;
                    }

                    if (n <= range.m) {
                        if (!skipLoggingCapture) {
                            branch.state.logCapture(1);
                        }
                        return resKind.ok;
                    }
                }

                if (upperCh == null && pass.settings.ignoreCase) {
                    upperCh = ch.toUpperCase();

                    // Invert case for the 2nd attempt;
                    if (ch === upperCh) {
                        ch = ch.toLowerCase();
                    } else {
                        ch = upperCh;
                    }

                    n = ch.charCodeAt(0);
                }
            }

            return resKind.nextBranch;
        },

        _scanCharNegativeGroupToken: function (branches, branch, pass, token, skipLoggingCapture) {
            var resKind = this._branchResultKind;
            var index = branch.state.txtIndex;
            var ch = this._text[index];
            if (ch == null) {
                return resKind.nextBranch;
            }

            // Get result for positive group:
            var positiveRes = this._scanCharGroupToken(branches, branch, pass, token, true);

            // Inverse the positive result:
            if (positiveRes === resKind.ok) {
                return resKind.nextBranch;
            }

            if (!skipLoggingCapture) {
                branch.state.logCapture(1);
            }

            return resKind.ok;
        },

        _scanEscapeToken: function (branches, branch, pass, token) {
            return this._scanWithJsRegex(branches, branch, pass, token);
        },

        _scanDotToken: function (textEndPos, branches, branch, pass) {
            var resKind = this._branchResultKind;
            var index = branch.state.txtIndex;

            if (pass.settings.singleline) {
                if (index < textEndPos) {
                    branch.state.logCapture(1);
                    return resKind.ok;
                }
            } else {
                if (index < textEndPos && this._text[index] !== "\n") {
                    branch.state.logCapture(1);
                    return resKind.ok;
                }
            }

            return resKind.nextBranch;
        },

        _scanBackrefNumberToken: function (textEndPos, branches, branch, pass, token) {
            var resKind = this._branchResultKind;

            var grCapture = branch.state.resolveBackref(token.data.slotId);
            if (grCapture == null) {
                return resKind.nextBranch;
            }

            var grCaptureTxt = this._text.slice(grCapture.capIndex, grCapture.capIndex + grCapture.capLength);
            return this._scanLiteral(textEndPos, branches, branch, pass, grCaptureTxt);
        },

        _scanBackrefNameToken: function (textEndPos, branches, branch, pass, token) {
            var resKind = this._branchResultKind;

            var grCapture = branch.state.resolveBackref(token.data.slotId);
            if (grCapture == null) {
                return resKind.nextBranch;
            }

            var grCaptureTxt = this._text.slice(grCapture.capIndex, grCapture.capIndex + grCapture.capLength);
            return this._scanLiteral(textEndPos, branches, branch, pass, grCaptureTxt);
        },

        _scanAnchorToken: function (textEndPos, branches, branch, pass, token) {
            var resKind = this._branchResultKind;
            var index = branch.state.txtIndex;

            if (token.value === "\\b" || token.value === "\\B") {
                var prevIsWord = index > 0 && this._scanWithJsRegex2(index - 1, "\\w") === resKind.ok;
                var currIsWord = this._scanWithJsRegex2(index, "\\w") === resKind.ok;
                if ((prevIsWord === currIsWord) === (token.value === "\\B")) {
                    return resKind.ok;
                }
            } else if (token.value === "^") {
                if (index === 0) {
                    return resKind.ok;
                }
                if (pass.settings.multiline && this._text[index - 1] === "\n") {
                    return resKind.ok;
                }
            } else if (token.value === "$") {
                if (index === textEndPos) {
                    return resKind.ok;
                }
                if (pass.settings.multiline && this._text[index] === "\n") {
                    return resKind.ok;
                }
            } else if (token.value === "\\A") {
                if (index === 0) {
                    return resKind.ok;
                }
            } else if (token.value === "\\z") {
                if (index === textEndPos) {
                    return resKind.ok;
                }
            } else if (token.value === "\\Z") {
                if (index === textEndPos) {
                    return resKind.ok;
                }
                if (index === textEndPos - 1 && this._text[index] === "\n") {
                    return resKind.ok;
                }
            } else if (token.value === "\\G") {
                return resKind.ok;
            }

            return resKind.nextBranch;
        },

        // ============================================================================================
        // Auxiliary functions
        // ============================================================================================
        _cloneSettings: function (settings) {
            var cloned = {
                ignoreCase: settings.ignoreCase,
                multiline: settings.multiline,
                singleline: settings.singleline,
                ignoreWhitespace: settings.ignoreWhitespace,
                explicitCapture: settings.explicitCapture
            };
            return cloned;
        },

        _combineScanResults: function (branch, srcState) {
            if (srcState != null) {
                var dstGroups = branch.state.groups;
                var srcGroups = srcState.groups;
                var srcGroupsLen = srcGroups.length;
                var i;

                for (i = 0; i < srcGroupsLen; ++i) {
                    dstGroups.push(srcGroups[i]);
                    }

                return true;
            }
            return false;
        },

        _getEmptyMatch: function () {
            var match = {
                capIndex: 0,    // start index of total capture
                capLength: 0,   // length of total capture
                success: false,
                value: "",
                groups: [],
                captures: []
            };

            return match;
        },

        _fillMatch: function (match, capIndex, capLength, textPos) {
            if (capIndex == null) {
                capIndex = textPos;
            }

            match.capIndex = capIndex;
            match.capLength = capLength;
            match.success = true;
            match.value = this._text.slice(capIndex, capIndex + capLength);

            match.groups.push({
                capIndex: capIndex,
                capLength: capLength,
                value: match.value,
                success: true,
                captures: [
                    {
                        capIndex: capIndex,
                        capLength: capLength,
                        value: match.value
                    }
                ]
            });

            match.captures.push(match.groups[0].captures[0]);
        },

        _checkTimeout: function () {
            if (this._timeoutTime < 0) {
                return;
            }

            var time = new Date().getTime();

            if (time >= this._timeoutTime) {
                throw new System.RegexMatchTimeoutException(this._text, this._pattern, System.TimeSpan.fromMilliseconds(this._timeoutMs));
            }
        }
    });

    // @source RegexEngineBranch.js

    Bridge.define("System.Text.RegularExpressions.RegexEngineBranch", {
        type: 0,
        value: 0,
        min: 0,
        max: 0,

        isStarted: false,
        isNotFailing: false,

        state: null,

        ctor: function (branchType, currVal, minVal, maxVal, parentState) {
            this.$initialize();

            this.type = branchType;

            this.value = currVal;
            this.min = minVal;
            this.max = maxVal;

            this.state = parentState != null ? parentState.clone() : new System.Text.RegularExpressions.RegexEngineState();
        },

        pushPass: function (index, tokens, settings) {
            var pass = new System.Text.RegularExpressions.RegexEnginePass(index, tokens, settings);
            this.state.passes.push(pass);
        },

        peekPass: function () {
            return this.state.passes[this.state.passes.length - 1];
        },

        popPass: function () {
            return this.state.passes.pop();
        },

        hasPass: function () {
            return this.state.passes.length > 0;
        },

        clone: function () {
            var cloned = new System.Text.RegularExpressions.RegexEngineBranch(this.type, this.value, this.min, this.max, this.state);
            cloned.isNotFailing = this.isNotFailing;
            return cloned;
        }
    });

    // @source RegexEngineState.js

    Bridge.define("System.Text.RegularExpressions.RegexEngineState", {
        txtIndex: 0, // current index
        capIndex: null, // first index of captured text
        capLength: 0, // current length
        passes: null,
        groups: null, // captured groups

        ctor: function () {
            this.$initialize();

            this.passes = [];
            this.groups = [];
        },

        logCapture: function (length) {
            if (this.capIndex == null) {
                this.capIndex = this.txtIndex;
            }

            this.txtIndex += length;
            this.capLength += length;
        },

        logCaptureGroup: function (group, index, length) {
            this.groups.push({ rawIndex: group.rawIndex, slotId: group.packedSlotId, capIndex: index, capLength: length });
        },

        logCaptureGroupBalancing: function (group, capIndex) {
            var balancingSlotId = group.balancingSlotId;
            var groups = this.groups;
            var index = groups.length - 1;
            var group2;
            var group2Index;

            while (index >= 0) {
                if (groups[index].slotId === balancingSlotId) {
                    group2 = groups[index];
                    group2Index = index;
                    break;
                }
                --index;
            }

            if (group2 != null && group2Index != null) {
                groups.splice(group2Index, 1); // remove group2 from the collection

                // Add balancing group value:
                if (group.constructs.name1 != null) {
                    var balCapIndex = group2.capIndex + group2.capLength;
                    var balCapLength = capIndex - balCapIndex;

                    this.logCaptureGroup(group, balCapIndex, balCapLength);
                }

                return true;
            }

            return false;
        },

        resolveBackref: function (packedSlotId) {
            var groups = this.groups;
            var index = groups.length - 1;

            while (index >= 0) {
                if (groups[index].slotId === packedSlotId) {
                    return groups[index];
                }
                --index;
            }

            return null;
        },

        clone: function () {
            var cloned = new System.Text.RegularExpressions.RegexEngineState();
            cloned.txtIndex = this.txtIndex;
            cloned.capIndex = this.capIndex;
            cloned.capLength = this.capLength;

            // Clone passes:
            var clonedPasses = cloned.passes;
            var thisPasses = this.passes;
            var len = thisPasses.length;
            var clonedItem;
            var i;

            for (i = 0; i < len; i++) {
                clonedItem = thisPasses[i].clone();
                clonedPasses.push(clonedItem);
            }

            // Clone groups:
            var clonedGroups = cloned.groups;
            var thisGroups = this.groups;
            len = thisGroups.length;

            for (i = 0; i < len; i++) {
                clonedItem = thisGroups[i];
                clonedGroups.push(clonedItem);
            }

            return cloned;
        }
    });

    // @source RegexEnginePass.js

    Bridge.define("System.Text.RegularExpressions.RegexEnginePass", {
        index: 0,
        tokens: null,
        probe: null,

        onHold: false,
        onHoldTextIndex: -1,
        alternationHandled: false,

        settings: null,

        ctor: function (index, tokens, settings) {
            this.$initialize();

            this.index = index;
            this.tokens = tokens;
            this.settings = settings;
        },

        clearState: function (settings) {
            this.index = 0;
            this.probe = null;
            this.onHold = false;
            this.onHoldTextIndex = -1;
            this.alternationHandled = false;
            this.settings = settings;
        },

        clone: function () {
            var cloned = new System.Text.RegularExpressions.RegexEnginePass(this.index, this.tokens, this.settings);
            cloned.onHold = this.onHold;
            cloned.onHoldTextIndex = this.onHoldTextIndex;
            cloned.alternationHandled = this.alternationHandled;
            cloned.probe = this.probe != null ? this.probe.clone() : null;
            return cloned;
        }
    });

    // @source RegexEngineProbe.js

    Bridge.define("System.Text.RegularExpressions.RegexEngineProbe", {
        min: 0,
        max: 0,
        value: 0,
        isLazy: false,
        forced: false,

        ctor: function (min, max, value, isLazy) {
            this.$initialize();

            this.min = min;
            this.max = max;
            this.value = value;
            this.isLazy = isLazy;
            this.forced = false;
        },

        clone: function () {
            var cloned = new System.Text.RegularExpressions.RegexEngineProbe(this.min, this.max, this.value, this.isLazy);
            cloned.forced = this.forced;
            return cloned;
        }
    });

    // @source RegexEngineParser.js

    Bridge.define("System.Text.RegularExpressions.RegexEngineParser", {
        statics: {
            _hexSymbols: "0123456789abcdefABCDEF",
            _octSymbols: "01234567",
            _decSymbols: "0123456789",

            _escapedChars: "abtrvfnexcu",
            _escapedCharClasses: "pPwWsSdD",
            _escapedAnchors: "AZzGbB",
            _escapedSpecialSymbols: " .,$^{}[]()|*+-=?\\|/\"':;~!@#%&",

            _whiteSpaceChars: " \r\n\t\v\f\u00A0\uFEFF", //TODO: This is short version of .NET WhiteSpace category.
            _unicodeCategories: ["Lu", "Ll", "Lt", "Lm", "Lo", "L", "Mn", "Mc", "Me", "M", "Nd", "Nl", "No", "N", "Pc", "Pd", "Ps", "Pe", "Pi", "Pf", "Po", "P", "Sm", "Sc", "Sk", "So", "S", "Zs", "Zl", "Zp", "Z", "Cc", "Cf", "Cs", "Co", "Cn", "C"],
            _namedCharBlocks: ["IsBasicLatin", "IsLatin-1Supplement", "IsLatinExtended-A", "IsLatinExtended-B", "IsIPAExtensions", "IsSpacingModifierLetters", "IsCombiningDiacriticalMarks", "IsGreek", "IsGreekandCoptic", "IsCyrillic", "IsCyrillicSupplement", "IsArmenian", "IsHebrew", "IsArabic", "IsSyriac", "IsThaana", "IsDevanagari", "IsBengali", "IsGurmukhi", "IsGujarati", "IsOriya", "IsTamil", "IsTelugu", "IsKannada", "IsMalayalam", "IsSinhala", "IsThai", "IsLao", "IsTibetan", "IsMyanmar", "IsGeorgian", "IsHangulJamo", "IsEthiopic", "IsCherokee", "IsUnifiedCanadianAboriginalSyllabics", "IsOgham", "IsRunic", "IsTagalog", "IsHanunoo", "IsBuhid", "IsTagbanwa", "IsKhmer", "IsMongolian", "IsLimbu", "IsTaiLe", "IsKhmerSymbols", "IsPhoneticExtensions", "IsLatinExtendedAdditional", "IsGreekExtended", "IsGeneralPunctuation", "IsSuperscriptsandSubscripts", "IsCurrencySymbols", "IsCombiningDiacriticalMarksforSymbols", "IsCombiningMarksforSymbols", "IsLetterlikeSymbols", "IsNumberForms", "IsArrows", "IsMathematicalOperators", "IsMiscellaneousTechnical", "IsControlPictures", "IsOpticalCharacterRecognition", "IsEnclosedAlphanumerics", "IsBoxDrawing", "IsBlockElements", "IsGeometricShapes", "IsMiscellaneousSymbols", "IsDingbats", "IsMiscellaneousMathematicalSymbols-A", "IsSupplementalArrows-A", "IsBraillePatterns", "IsSupplementalArrows-B", "IsMiscellaneousMathematicalSymbols-B", "IsSupplementalMathematicalOperators", "IsMiscellaneousSymbolsandArrows", "IsCJKRadicalsSupplement", "IsKangxiRadicals", "IsIdeographicDescriptionCharacters", "IsCJKSymbolsandPunctuation", "IsHiragana", "IsKatakana", "IsBopomofo", "IsHangulCompatibilityJamo", "IsKanbun", "IsBopomofoExtended", "IsKatakanaPhoneticExtensions", "IsEnclosedCJKLettersandMonths", "IsCJKCompatibility", "IsCJKUnifiedIdeographsExtensionA", "IsYijingHexagramSymbols", "IsCJKUnifiedIdeographs", "IsYiSyllables", "IsYiRadicals", "IsHangulSyllables", "IsHighSurrogates", "IsHighPrivateUseSurrogates", "IsLowSurrogates", "IsPrivateUse or IsPrivateUseArea", "IsCJKCompatibilityIdeographs", "IsAlphabeticPresentationForms", "IsArabicPresentationForms-A", "IsVariationSelectors", "IsCombiningHalfMarks", "IsCJKCompatibilityForms", "IsSmallFormVariants", "IsArabicPresentationForms-B", "IsHalfwidthandFullwidthForms", "IsSpecials"],
            _controlChars: ["@", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "[", "\\", "]", "^", "_"],

            tokenTypes: {
                literal: 0,

                escChar: 110,
                escCharOctal: 111,
                escCharHex: 112,
                escCharCtrl: 113,
                escCharUnicode: 114,
                escCharOther: 115,

                escCharClass: 120,
                escCharClassCategory: 121,
                escCharClassBlock: 122,
                escCharClassDot: 123,

                escAnchor: 130,

                escBackrefNumber: 140,
                escBackrefName: 141,

                charGroup: 200,
                charNegativeGroup: 201,
                charInterval: 202,

                anchor: 300,

                group: 400,
                groupImnsx: 401,
                groupImnsxMisc: 402,

                groupConstruct: 403,
                groupConstructName: 404,
                groupConstructImnsx: 405,
                groupConstructImnsxMisc: 406,

                quantifier: 500,
                quantifierN: 501,
                quantifierNM: 502,

                alternation: 600,
                alternationGroup: 601,
                alternationGroupCondition: 602,
                alternationGroupRefNumberCondition: 603,
                alternationGroupRefNameCondition: 604,

                commentInline: 700,
                commentXMode: 701
            },

            parsePattern: function (pattern, settings) {
                var scope = System.Text.RegularExpressions.RegexEngineParser;

                // Parse tokens in the original pattern:
                var tokens = scope._parsePatternImpl(pattern, settings, 0, pattern.length);

                // Collect and fill group descriptors into Group tokens.
                // We need do it before any token modification.
                var groups = [];
                scope._fillGroupDescriptors(tokens, groups);

                // Fill Sparse Info:
                var sparseSettings = scope._getGroupSparseInfo(groups);

                // Fill balancing info for the groups with "name2":
                scope._fillBalancingGroupInfo(groups, sparseSettings);

                // Transform tokens for usage in JS RegExp:
                scope._preTransformBackrefTokens(pattern, tokens, sparseSettings);
                scope._transformRawTokens(settings, tokens, sparseSettings, [], [], 0);

                // Update group descriptors as tokens have been transformed (at least indexes were changed):
                scope._updateGroupDescriptors(tokens);

                var result = {
                    groups: groups,
                    sparseSettings: sparseSettings,
                    isContiguous: settings.isContiguous || false,
                    shouldFail: settings.shouldFail || false,
                    tokens: tokens
                };

                return result;
            },

            _transformRawTokens: function (settings, tokens, sparseSettings, allowedPackedSlotIds, nestedGroupIds, nestingLevel) {
                var scope = System.Text.RegularExpressions.RegexEngineParser;
                var tokenTypes = scope.tokenTypes;
                var prevToken;
                var token;
                var value;
                var packedSlotId;
                var groupNumber;
                var matchRes;
                var localNestedGroupIds;
                var localSettings;
                var qtoken;
                var i;

                // Transform/adjust tokens collection to work with JS RegExp:
                for (i = 0; i < tokens.length; i++) {
                    token = tokens[i];

                    if (i < tokens.length - 1) {
                        qtoken = tokens[i + 1];
                        switch (qtoken.type) {
                            case tokenTypes.quantifier:
                            case tokenTypes.quantifierN:
                            case tokenTypes.quantifierNM:
                                token.qtoken = qtoken;
                                tokens.splice(i + 1, 1);
                                --i;
                        }
                    }

                    if (token.type === tokenTypes.escBackrefNumber) {
                        groupNumber = token.data.number;
                        packedSlotId = sparseSettings.getPackedSlotIdBySlotNumber(groupNumber);
                        if (packedSlotId == null) {
                            throw new System.ArgumentException("Reference to undefined group number " + groupNumber.toString() + ".");
                        }
                        if (allowedPackedSlotIds.indexOf(packedSlotId) < 0) {
                            settings.shouldFail = true; // Backreferences to unreachable group number lead to an empty match.
                            continue;
                        }

                        token.data.slotId = packedSlotId;
                    } else if (token.type === tokenTypes.escBackrefName) {
                        value = token.data.name;
                        packedSlotId = sparseSettings.getPackedSlotIdBySlotName(value);
                        if (packedSlotId == null) {
                            // TODO: Move this code to earlier stages
                            // If the name is number, treat the backreference as a numbered:
                            matchRes = scope._matchChars(value, 0, value.length, scope._decSymbols);
                            if (matchRes.matchLength === value.length) {
                                value = "\\" + value;
                                scope._updatePatternToken(token, tokenTypes.escBackrefNumber, token.index, value.length, value);
                                --i; // process the token again
                                continue;
                            }
                            throw new System.ArgumentException("Reference to undefined group name '" + value + "'.");
                        }

                        if (allowedPackedSlotIds.indexOf(packedSlotId) < 0) {
                            settings.shouldFail = true; // Backreferences to unreachable group number lead to an empty match.
                            continue;
                        }

                        token.data.slotId = packedSlotId;
                    } else if (token.type === tokenTypes.anchor || token.type === tokenTypes.escAnchor) {
                        if (token.value === "\\G") {
                            if (nestingLevel === 0 && i === 0) {
                                settings.isContiguous = true;
                            } else {
                                settings.shouldFail = true;
                            }

                            tokens.splice(i, 1);
                            --i;
                            continue;
                        }
                    } else if (token.type === tokenTypes.commentInline || token.type === tokenTypes.commentXMode) {
                        // We can safely remove comments from the pattern
                        tokens.splice(i, 1);
                        --i;
                        continue;
                    } else if (token.type === tokenTypes.literal) {
                        // Combine literal tokens for better performance:
                        if (i > 0 && !token.qtoken) {
                            prevToken = tokens[i - 1];
                            if (prevToken.type === tokenTypes.literal && !prevToken.qtoken) {
                                prevToken.value += token.value;
                                prevToken.length += token.length;

                                tokens.splice(i, 1);
                                --i;
                                continue;
                            }
                        }
                    } else if (token.type === tokenTypes.alternationGroupCondition) {
                        if (token.data != null) {
                            if (token.data.number != null) {
                                packedSlotId = sparseSettings.getPackedSlotIdBySlotNumber(token.data.number);
                                if (packedSlotId == null) {
                                    throw new System.ArgumentException("Reference to undefined group number " + value + ".");
                                }
                                token.data.packedSlotId = packedSlotId;
                                scope._updatePatternToken(token, tokenTypes.alternationGroupRefNumberCondition, token.index, token.length, token.value);
                            } else {
                                packedSlotId = sparseSettings.getPackedSlotIdBySlotName(token.data.name);
                                if (packedSlotId != null) {
                                    token.data.packedSlotId = packedSlotId;
                                    scope._updatePatternToken(token, tokenTypes.alternationGroupRefNameCondition, token.index, token.length, token.value);
                                } else {
                                    delete token.data;
                                }
                            }
                        }
                    }

                    // Update children tokens:
                    if (token.children && token.children.length) {
                        localNestedGroupIds = token.type === tokenTypes.group ? [token.group.rawIndex] : [];
                        localNestedGroupIds = localNestedGroupIds.concat(nestedGroupIds);

                        localSettings = token.localSettings || settings;
                        scope._transformRawTokens(localSettings, token.children, sparseSettings, allowedPackedSlotIds, localNestedGroupIds, nestingLevel + 1);
                        settings.shouldFail = settings.shouldFail || localSettings.shouldFail;
                        settings.isContiguous = settings.isContiguous || localSettings.isContiguous;
                    }

                    // Group is processed. Now it can be referenced with Backref:
                    if (token.type === tokenTypes.group) {
                        allowedPackedSlotIds.push(token.group.packedSlotId);
                    }
                }
            },

            _fillGroupDescriptors: function (tokens, groups) {
                var scope = System.Text.RegularExpressions.RegexEngineParser;
                var group;
                var i;

                // Fill group structure:
                scope._fillGroupStructure(groups, tokens, null);

                // Assign name or id:
                var groupId = 1;
                for (i = 0; i < groups.length; i++) {
                    group = groups[i];

                    if (group.constructs.name1 != null) {
                        group.name = group.constructs.name1;
                        group.hasName = true;
                    } else {
                        group.hasName = false;
                        group.name = groupId.toString();
                        ++groupId;
                    }
                }
            },

            _fillGroupStructure: function (groups, tokens, parentGroup) {
                var scope = System.Text.RegularExpressions.RegexEngineParser;
                var tokenTypes = scope.tokenTypes;
                var group;
                var token;
                var constructs;
                var constructCandidateToken;
                var hasChildren;
                var i;

                for (i = 0; i < tokens.length; i++) {
                    token = tokens[i];
                    hasChildren = token.children && token.children.length;

                    if (token.type === tokenTypes.group || token.type === tokenTypes.groupImnsx || token.type === tokenTypes.groupImnsxMisc) {
                        group = {
                            rawIndex: groups.length + 1,
                            number: -1,

                            parentGroup: null,
                            innerGroups: [],

                            name: null,
                            hasName: false,

                            constructs: null,
                            quantifier: null,

                            exprIndex: -1,
                            exprLength: 0,
                            expr: null,
                            exprFull: null
                        };

                        token.group = group;

                        if (token.type === tokenTypes.group) {
                            groups.push(group);

                            if (parentGroup != null) {
                                token.group.parentGroup = parentGroup;
                                parentGroup.innerGroups.push(group);
                            }
                        }

                        // fill group constructs:
                        constructCandidateToken = hasChildren ? token.children[0] : null;
                        group.constructs = scope._fillGroupConstructs(constructCandidateToken);
                        constructs = group.constructs;

                        if (token.isNonCapturingExplicit) {
                            delete token.isNonCapturingExplicit;
                            constructs.isNonCapturingExplicit = true;
                        }

                        if (token.isEmptyCapturing) {
                            delete token.isEmptyCapturing;
                            constructs.emptyCapture = true;
                        }

                        constructs.skipCapture =
                            constructs.isNonCapturing ||
                            constructs.isNonCapturingExplicit ||
                            constructs.isNonbacktracking ||
                            constructs.isPositiveLookahead ||
                            constructs.isNegativeLookahead ||
                            constructs.isPositiveLookbehind ||
                            constructs.isNegativeLookbehind ||
                            (constructs.name1 == null && constructs.name2 != null);
                    }

                    // fill group descriptors for inner tokens:
                    if (hasChildren) {
                        scope._fillGroupStructure(groups, token.children, token.group);
                    }
                }
            },

            _getGroupSparseInfo: function (groups) {
                var scope = System.Text.RegularExpressions.RegexEngineParser;

                var explNumberedGroups = {};
                var explNumberedGroupKeys = [];
                var explNamedGroups = {};
                var explGroups;

                var numberedGroups;
                var slotNumber;
                var slotName;
                var group;
                var i;
                var j;

                var sparseSlotMap = { 0: 0 };
                sparseSlotMap.lastSlot = 0;

                var sparseSlotNameMap = { "0": 0 };
                sparseSlotNameMap.keys = ["0"];

                // Fill Explicit Numbers:
                for (i = 0; i < groups.length; i++) {
                    group = groups[i];
                    if (group.constructs.skipCapture) {
                        continue;
                    }

                    if (group.constructs.isNumberName1) {
                        slotNumber = parseInt(group.constructs.name1);
                        explNumberedGroupKeys.push(slotNumber);

                        if (explNumberedGroups[slotNumber]) {
                            explNumberedGroups[slotNumber].push(group);
                        } else {
                            explNumberedGroups[slotNumber] = [group];
                        }
                    } else {
                        slotName = group.constructs.name1;

                        if (explNamedGroups[slotName]) {
                            explNamedGroups[slotName].push(group);
                        } else {
                            explNamedGroups[slotName] = [group];
                        }
                    }
                }

                // Sort explicitly set Number names:
                var sortNum = function (a, b) {
                    return a - b;
                };
                explNumberedGroupKeys.sort(sortNum);

                // Add group without names first (emptyCapture = false first, than emptyCapture = true):
                var allowEmptyCapture = false;
                for (j = 0; j < 2; j++) {
                    for (i = 0; i < groups.length; i++) {
                        group = groups[i];
                        if (group.constructs.skipCapture) {
                            continue;
                        }

                        if ((group.constructs.emptyCapture === true) !== allowEmptyCapture) {
                            continue;
                        }

                        slotNumber = sparseSlotNameMap.keys.length;
                        if (!group.hasName) {
                            numberedGroups = [group];
                            explGroups = explNumberedGroups[slotNumber];
                            if (explGroups != null) {
                                numberedGroups = numberedGroups.concat(explGroups);
                                explNumberedGroups[slotNumber] = null;
                            }

                            scope._addSparseSlotForSameNamedGroups(numberedGroups, slotNumber, sparseSlotMap, sparseSlotNameMap);
                        }
                    }
                    allowEmptyCapture = true;
                }

                // Then add named groups:
                for (i = 0; i < groups.length; i++) {
                    group = groups[i];
                    if (group.constructs.skipCapture) {
                        continue;
                    }

                    if (!group.hasName || group.constructs.isNumberName1) {
                        continue;
                    }

                    // If the slot is already occupied by an explicitly numbered group,
                    // add this group to the slot:
                    slotNumber = sparseSlotNameMap.keys.length;
                    explGroups = explNumberedGroups[slotNumber];
                    while (explGroups != null) {
                        scope._addSparseSlotForSameNamedGroups(explGroups, slotNumber, sparseSlotMap, sparseSlotNameMap);

                        explNumberedGroups[slotNumber] = null; // Group is processed.
                        slotNumber = sparseSlotNameMap.keys.length;
                        explGroups = explNumberedGroups[slotNumber];
                    }

                    if (!group.constructs.isNumberName1) {
                        slotNumber = sparseSlotNameMap.keys.length;
                        explGroups = explNumberedGroups[slotNumber];
                        while (explGroups != null) {
                            scope._addSparseSlotForSameNamedGroups(explGroups, slotNumber, sparseSlotMap, sparseSlotNameMap);

                            explNumberedGroups[slotNumber] = null; // Group is processed.
                            slotNumber = sparseSlotNameMap.keys.length;
                            explGroups = explNumberedGroups[slotNumber];
                        }
                    }

                    // Add the named group(s) to the 1st free slot:
                    slotName = group.constructs.name1;
                    explGroups = explNamedGroups[slotName];
                    if (explGroups != null) {
                        scope._addSparseSlotForSameNamedGroups(explGroups, slotNumber, sparseSlotMap, sparseSlotNameMap);
                        explNamedGroups[slotName] = null;  // Group is processed.
                    }
                }

                // Add the rest explicitly numbered groups:
                for (i = 0; i < explNumberedGroupKeys.length; i++) {
                    slotNumber = explNumberedGroupKeys[i];
                    explGroups = explNumberedGroups[slotNumber];
                    if (explGroups != null) {
                        scope._addSparseSlotForSameNamedGroups(explGroups, slotNumber, sparseSlotMap, sparseSlotNameMap);

                        explNumberedGroups[slotNumber] = null; // Group is processed.
                    }
                }

                return {
                    isSparse: sparseSlotMap.isSparse || false, //sparseSlotNumbers.length !== (1 + sparseSlotNumbers[sparseSlotNumbers.length - 1]),
                    sparseSlotMap: sparseSlotMap,           // <SlotNumber, PackedSlotId>
                    sparseSlotNameMap: sparseSlotNameMap,   // <SlotName, PackedSlotId>

                    getPackedSlotIdBySlotNumber: function(slotNumber) {
                        return this.sparseSlotMap[slotNumber];
                    },

                    getPackedSlotIdBySlotName: function (slotName) {
                        return this.sparseSlotNameMap[slotName];
                    }
                };
            },

            _addSparseSlot: function (group, slotNumber, sparseSlotMap, sparseSlotNameMap) {
                var packedSlotId = sparseSlotNameMap.keys.length; // 0-based index. Raw Slot number, 0,1..n (without gaps)

                group.packedSlotId = packedSlotId;

                sparseSlotMap[slotNumber] = packedSlotId;
                sparseSlotNameMap[group.name] = packedSlotId;
                sparseSlotNameMap.keys.push(group.name);

                if (!sparseSlotMap.isSparse && ((slotNumber - sparseSlotMap.lastSlot) > 1)) {
                    sparseSlotMap.isSparse = true;
                }

                sparseSlotMap.lastSlot = slotNumber;
            },

            _addSparseSlotForSameNamedGroups: function (groups, slotNumber, sparseSlotMap, sparseSlotNameMap) {
                var scope = System.Text.RegularExpressions.RegexEngineParser;
                var i;

                scope._addSparseSlot(groups[0], slotNumber, sparseSlotMap, sparseSlotNameMap);
                var sparseSlotId = groups[0].sparseSlotId;
                var packedSlotId = groups[0].packedSlotId;

                // Assign SlotID for all expl. named groups in this slot.
                if (groups.length > 1) {
                    for (i = 1; i < groups.length; i++) {
                        groups[i].sparseSlotId = sparseSlotId;
                        groups[i].packedSlotId = packedSlotId;
                    }
                }
            },

            _fillGroupConstructs: function (childToken) {
                var scope = System.Text.RegularExpressions.RegexEngineParser;
                var tokenTypes = scope.tokenTypes;
                var constructs = {
                    name1: null,
                    name2: null,

                    isNumberName1: false,
                    isNumberName2: false,

                    isNonCapturing: false,
                    isNonCapturingExplicit: false,

                    isIgnoreCase: null,
                    isMultiline: null,
                    isExplicitCapture: null,
                    isSingleLine: null,
                    isIgnoreWhitespace: null,

                    isPositiveLookahead: false,
                    isNegativeLookahead: false,
                    isPositiveLookbehind: false,
                    isNegativeLookbehind: false,

                    isNonbacktracking: false
                };

                if (childToken == null) {
                    return constructs;
                }

                if (childToken.type === tokenTypes.groupConstruct) {
                    // ?:
                    // ?=
                    // ?!
                    // ?<=
                    // ?<!
                    // ?>

                    switch (childToken.value) {
                        case "?:":
                            constructs.isNonCapturing = true;
                            break;

                        case "?=":
                            constructs.isPositiveLookahead = true;
                            break;

                        case "?!":
                            constructs.isNegativeLookahead = true;
                            break;

                        case "?>":
                            constructs.isNonbacktracking = true;
                            break;

                        case "?<=":
                            constructs.isPositiveLookbehind = true;
                            break;

                        case "?<!":
                            constructs.isNegativeLookbehind = true;
                            break;

                        default:
                            throw new System.ArgumentException("Unrecognized grouping construct.");
                    }
                } else if (childToken.type === tokenTypes.groupConstructName) {
                    // ?<name1>
                    // ?'name1'
                    // ?<name1-name2>
                    // ?'name1-name2'

                    var nameExpr = childToken.value.slice(2, childToken.length - 1);
                    var groupNames = nameExpr.split("-");
                    if (groupNames.length === 0 || groupNames.length > 2) {
                        throw new System.ArgumentException("Invalid group name.");
                    }

                    if (groupNames[0].length) {
                        constructs.name1 = groupNames[0];
                        var nameRes1 = scope._validateGroupName(groupNames[0]);
                        constructs.isNumberName1 = nameRes1.isNumberName;
                    }

                    if (groupNames.length === 2) {
                        constructs.name2 = groupNames[1];
                        var nameRes2 = scope._validateGroupName(groupNames[1]);
                        constructs.isNumberName2 = nameRes2.isNumberName;
                    }
                } else if (childToken.type === tokenTypes.groupConstructImnsx || childToken.type === tokenTypes.groupConstructImnsxMisc) {
                    // ?imnsx-imnsx:
                    var imnsxPostfixLen = childToken.type === tokenTypes.groupConstructImnsx ? 1 : 0;
                    var imnsxExprLen = childToken.length - 1 - imnsxPostfixLen; // - prefix - postfix
                    var imnsxVal = true;
                    var ch;
                    var i;

                    for (i = 1; i <= imnsxExprLen; i++) {
                        ch = childToken.value[i];

                        if (ch === "-") {
                            imnsxVal = false;
                        } else if (ch === "i") {
                            constructs.isIgnoreCase = imnsxVal;
                        } else if (ch === "m") {
                            constructs.isMultiline = imnsxVal;
                        } else if (ch === "n") {
                            constructs.isExplicitCapture = imnsxVal;
                        } else if (ch === "s") {
                            constructs.isSingleLine = imnsxVal;
                        } else if (ch === "x") {
                            constructs.isIgnoreWhitespace = imnsxVal;
                        }
                    }
                }

                return constructs;
            },

            _validateGroupName: function (name) {
                if (!name || !name.length) {
                    throw new System.ArgumentException("Invalid group name: Group names must begin with a word character.");
                }

                var isDigit = name[0] >= "0" && name[0] <= "9";
                if (isDigit) {
                    var scope = System.Text.RegularExpressions.RegexEngineParser;
                    var res = scope._matchChars(name, 0, name.length, scope._decSymbols);
                    if (res.matchLength !== name.length) {
                        throw new System.ArgumentException("Invalid group name: Group names must begin with a word character.");
                    }
                }

                return {
                    isNumberName: isDigit
                };
            },

            _fillBalancingGroupInfo: function (groups, sparseSettings) {
                var group;
                var i;

                // Assign name or id:
                for (i = 0; i < groups.length; i++) {
                    group = groups[i];

                    if (group.constructs.name2 != null) {
                        group.isBalancing = true;

                        group.balancingSlotId = sparseSettings.getPackedSlotIdBySlotName(group.constructs.name2);
                        if (group.balancingSlotId == null) {
                            throw new System.ArgumentException("Reference to undefined group name '" + group.constructs.name2 + "'.");
                        }
                    }
                }
            },

            _preTransformBackrefTokens: function (pattern, tokens, sparseSettings) {
                var scope = System.Text.RegularExpressions.RegexEngineParser;
                var tokenTypes = scope.tokenTypes;

                var groupNumber;
                var octalCharToken;
                var extraLength;
                var literalToken;
                var token;
                var i;

                for (i = 0; i < tokens.length; i++) {
                    token = tokens[i];
                    if (token.type === tokenTypes.escBackrefNumber) {
                        groupNumber = token.data.number;

                        if (groupNumber >= 1 && sparseSettings.getPackedSlotIdBySlotNumber(groupNumber) != null) {
                            // Expressions from \10 and greater are considered backreferences
                            // if there is a group corresponding to that number;
                            // otherwise, they are interpreted as octal codes.
                            continue; // validated
                        }

                        if (groupNumber <= 9) {
                            // The expressions \1 through \9 are always interpreted as backreferences, and not as octal codes.
                            throw new System.ArgumentException("Reference to undefined group number " + groupNumber.toString() + ".");
                        }

                        // Otherwise, transform the token to OctalNumber:
                        octalCharToken = scope._parseOctalCharToken(token.value, 0, token.length);
                        if (octalCharToken == null) {
                            throw new System.ArgumentException("Unrecognized escape sequence " + token.value.slice(0, 2) + ".");
                        }

                        extraLength = token.length - octalCharToken.length;
                        scope._modifyPatternToken(token, pattern, tokenTypes.escCharOctal, null, octalCharToken.length);
                        token.data = octalCharToken.data;

                        if (extraLength > 0) {
                            literalToken = scope._createPatternToken(pattern, tokenTypes.literal, token.index + token.length, extraLength);
                            tokens.splice(i + 1, 0, literalToken);
                        }
                    }

                    if (token.children && token.children.length) {
                        scope._preTransformBackrefTokens(pattern, token.children, sparseSettings);
                    }
                }
            },

            _updateGroupDescriptors: function (tokens, parentIndex) {
                var scope = System.Text.RegularExpressions.RegexEngineParser;
                var tokenTypes = scope.tokenTypes;
                var group;
                var token;
                var quantCandidateToken;
                var childrenValue;
                var childrenIndex;
                var i;

                var index = parentIndex || 0;
                for (i = 0; i < tokens.length; i++) {
                    token = tokens[i];
                    token.index = index;

                    // Calculate children indexes/lengths to update parent length:
                    if (token.children) {
                        childrenIndex = token.childrenPostfix.length;
                        scope._updateGroupDescriptors(token.children, index + childrenIndex);

                        // Update parent value if children have been changed:
                        childrenValue = scope._constructPattern(token.children);
                        token.value = token.childrenPrefix + childrenValue + token.childrenPostfix;
                        token.length = token.value.length;
                    }

                    // Update group information:
                    if (token.type === tokenTypes.group && token.group) {
                        group = token.group;
                        group.exprIndex = token.index;
                        group.exprLength = token.length;

                        if (i + 1 < tokens.length) {
                            quantCandidateToken = tokens[i + 1];
                            if (quantCandidateToken.type === tokenTypes.quantifier ||
                                quantCandidateToken.type === tokenTypes.quantifierN ||
                                quantCandidateToken.type === tokenTypes.quantifierNM) {
                                group.quantifier = quantCandidateToken.value;
                            }
                        }

                        group.expr = token.value;
                        group.exprFull = group.expr + (group.quantifier != null ? group.quantifier : "");
                    }

                    // Update current index:
                    index += token.length;
                }
            },

            _constructPattern: function (tokens) {
                var pattern = "";
                var token;
                var i;

                for (i = 0; i < tokens.length; i++) {
                    token = tokens[i];
                    pattern += token.value;
                }

                return pattern;
            },

            _parsePatternImpl: function (pattern, settings, startIndex, endIndex) {
                if (pattern == null) {
                    throw new System.ArgumentNullException("pattern");
                }
                if (startIndex < 0 || startIndex > pattern.length) {
                    throw new System.ArgumentOutOfRangeException("startIndex");
                }
                if (endIndex < startIndex || endIndex > pattern.length) {
                    throw new System.ArgumentOutOfRangeException("endIndex");
                }

                var scope = System.Text.RegularExpressions.RegexEngineParser;
                var tokenTypes = scope.tokenTypes;
                var tokens = [];
                var token;
                var ch;
                var i;

                i = startIndex;
                while (i < endIndex) {
                    ch = pattern[i];

                    // Ignore whitespaces (if it was requested):
                    if (settings.ignoreWhitespace && scope._whiteSpaceChars.indexOf(ch) >= 0) {
                        ++i;
                        continue;
                    }

                    if (ch === ".") {
                        token = scope._parseDotToken(pattern, i, endIndex);
                    } else if (ch === "\\") {
                        token = scope._parseEscapeToken(pattern, i, endIndex);
                    } else if (ch === "[") {
                        token = scope._parseCharRangeToken(pattern, i, endIndex);
                    } else if (ch === "^" || ch === "$") {
                        token = scope._parseAnchorToken(pattern, i);
                    } else if (ch === "(") {
                        token = scope._parseGroupToken(pattern, settings, i, endIndex);
                    } else if (ch === "|") {
                        token = scope._parseAlternationToken(pattern, i);
                    } else if (ch === "#" && settings.ignoreWhitespace) {
                        token = scope._parseXModeCommentToken(pattern, i, endIndex);
                    } else {
                        token = scope._parseQuantifierToken(pattern, i, endIndex);
                    }

                    if (token == null) {
                        token = scope._createPatternToken(pattern, tokenTypes.literal, i, 1);
                    }

                    if (token != null) {
                        tokens.push(token);
                        i += token.length;
                    }
                }

                return tokens;
            },

            _parseEscapeToken: function (pattern, i, endIndex) {
                var scope = System.Text.RegularExpressions.RegexEngineParser;
                var tokenTypes = scope.tokenTypes;

                var ch = pattern[i];
                if (ch !== "\\") {
                    return null;
                }
                if (i + 1 >= endIndex) {
                    throw new System.ArgumentException("Illegal \\ at end of pattern.");
                }

                ch = pattern[i + 1];

                // Parse a sequence for a numbered reference ("Backreference Constructs")
                if (ch >= "1" && ch <= "9") {
                    // check if the number is a group backreference
                    var groupDigits = scope._matchChars(pattern, i + 1, endIndex, scope._decSymbols, 3); // assume: there are not more than 999 groups
                    var backrefNumberToken = scope._createPatternToken(pattern, tokenTypes.escBackrefNumber, i, 1 + groupDigits.matchLength); // "\nnn"
                    backrefNumberToken.data = { number: parseInt(groupDigits.match, 10) };
                    return backrefNumberToken;
                }

                // Parse a sequence for "Anchors"
                if (scope._escapedAnchors.indexOf(ch) >= 0) {
                    return scope._createPatternToken(pattern, tokenTypes.escAnchor, i, 2); // "\A" or "\Z" or "\z" or "\G" or "\b" or "\B"
                }

                // Parse a sequence for "Character Escapes" or "Character Classes"
                var escapedCharToken = scope._parseEscapedChar(pattern, i, endIndex);
                if (escapedCharToken != null) {
                    return escapedCharToken;
                }

                // Parse a sequence for a named backreference ("Backreference Constructs")
                if (ch === "k") {
                    if (i + 2 < endIndex) {
                        var nameQuoteCh = pattern[i + 2];
                        if (nameQuoteCh === "'" || nameQuoteCh === "<") {
                            var closingCh = nameQuoteCh === "<" ? ">" : "'";
                            var refNameChars = scope._matchUntil(pattern, i + 3, endIndex, closingCh);
                            if (refNameChars.unmatchLength === 1 && refNameChars.matchLength > 0) {
                                var backrefNameToken = scope._createPatternToken(pattern, tokenTypes.escBackrefName, i, 3 + refNameChars.matchLength + 1); // "\k<Name>" or "\k'Name'"
                                backrefNameToken.data = { name: refNameChars.match };
                                return backrefNameToken;
                            }
                        }
                    }

                    throw new System.ArgumentException("Malformed \\k<...> named back reference.");
                }

                // Temp fix (until IsWordChar is not supported):
                // See more: https://referencesource.microsoft.com/#System/regex/system/text/regularexpressions/RegexParser.cs,1414
                // Unescaping of any of the following ASCII characters results in the character itself
                var code = ch.charCodeAt(0);
                if ((code >= 0 && code < 48) ||
                    (code > 57 && code < 65) ||
                    (code > 90 && code < 95) ||
                    (code === 96) ||
                    (code > 122 && code < 128)) {
                    var token = scope._createPatternToken(pattern, tokenTypes.escChar, i, 2);
                    token.data = { n: code, ch: ch };
                    return token;
                }

                // Unrecognized escape sequence:
                throw new System.ArgumentException("Unrecognized escape sequence \\" + ch + ".");
            },

            _parseOctalCharToken: function (pattern, i, endIndex) {
                var scope = System.Text.RegularExpressions.RegexEngineParser;
                var tokenTypes = scope.tokenTypes;

                var ch = pattern[i];
                if (ch === "\\" && i + 1 < endIndex) {
                    ch = pattern[i + 1];

                    if (ch >= "0" && ch <= "7") {
                        var octalDigits = scope._matchChars(pattern, i + 1, endIndex, scope._octSymbols, 3);
                        var octalVal = parseInt(octalDigits.match, 8);
                        var token = scope._createPatternToken(pattern, tokenTypes.escCharOctal, i, 1 + octalDigits.matchLength); // "\0" or "\nn" or "\nnn"
                        token.data = { n: octalVal, ch: String.fromCharCode(octalVal) };
                        return token;
                    }
                }

                return null;
            },

            _parseEscapedChar: function (pattern, i, endIndex) {
                var scope = System.Text.RegularExpressions.RegexEngineParser;
                var tokenTypes = scope.tokenTypes;
                var token;

                var ch = pattern[i];
                if (ch !== "\\" || i + 1 >= endIndex) {
                    return null;
                }

                ch = pattern[i + 1];

                // Parse a sequence for "Character Escapes"
                if (scope._escapedChars.indexOf(ch) >= 0) {
                    if (ch === "x") {
                        var hexDigits = scope._matchChars(pattern, i + 2, endIndex, scope._hexSymbols, 2);
                        if (hexDigits.matchLength !== 2) {
                            throw new System.ArgumentException("Insufficient hexadecimal digits.");
                        }

                        var hexVal = parseInt(hexDigits.match, 16);
                        token = scope._createPatternToken(pattern, tokenTypes.escCharHex, i, 4); // "\xnn"
                        token.data = { n: hexVal, ch: String.fromCharCode(hexVal) };
                        return token;
                    } else if (ch === "c") {
                        if (i + 2 >= endIndex) {
                            throw new System.ArgumentException("Missing control character.");
                        }

                        var ctrlCh = pattern[i + 2];
                        ctrlCh = ctrlCh.toUpperCase();
                        var ctrlIndex = this._controlChars.indexOf(ctrlCh);
                        if (ctrlIndex >= 0) {
                            token = scope._createPatternToken(pattern, tokenTypes.escCharCtrl, i, 3); // "\cx" or "\cX"
                            token.data = { n: ctrlIndex, ch: String.fromCharCode(ctrlIndex) };
                            return token;
                        }

                        throw new System.ArgumentException("Unrecognized control character.");
                    } else if (ch === "u") {
                        var ucodeDigits = scope._matchChars(pattern, i + 2, endIndex, scope._hexSymbols, 4);
                        if (ucodeDigits.matchLength !== 4) {
                            throw new System.ArgumentException("Insufficient hexadecimal digits.");
                        }

                        var ucodeVal = parseInt(ucodeDigits.match, 16);
                        token = scope._createPatternToken(pattern, tokenTypes.escCharUnicode, i, 6); // "\unnnn"
                        token.data = { n: ucodeVal, ch: String.fromCharCode(ucodeVal) };
                        return token;
                    }

                    token = scope._createPatternToken(pattern, tokenTypes.escChar, i, 2); // "\a" or "\b" or "\t" or "\r" or "\v" or "f" or "n" or "e"-
                    var escVal;
                    switch (ch) {
                        case "a":
                            escVal = 7;
                            break;
                        case "b":
                            escVal = 8;
                            break;
                        case "t":
                            escVal = 9;
                            break;
                        case "r":
                            escVal = 13;
                            break;
                        case "v":
                            escVal = 11;
                            break;
                        case "f":
                            escVal = 12;
                            break;
                        case "n":
                            escVal = 10;
                            break;
                        case "e":
                            escVal = 27;
                            break;

                        default:
                            throw new System.ArgumentException("Unexpected escaped char: '" + ch + "'.");
                    }

                    token.data = { n: escVal, ch: String.fromCharCode(escVal) };
                    return token;
                }

                // Parse a sequence for an octal character("Character Escapes")
                if (ch >= "0" && ch <= "7") {
                    var octalCharToken = scope._parseOctalCharToken(pattern, i, endIndex);
                    return octalCharToken;
                }

                // Parse a sequence for "Character Classes"
                if (scope._escapedCharClasses.indexOf(ch) >= 0) {
                    if (ch === "p" || ch === "P") {
                        var catNameChars = scope._matchUntil(pattern, i + 2, endIndex, "}"); // the longest category name is 37 + 2 brackets, but .NET does not limit the value on this step
                        if (catNameChars.matchLength < 2 || catNameChars.match[0] !== "{" || catNameChars.unmatchLength !== 1) {
                            throw new System.ArgumentException("Incomplete \p{X} character escape.");
                        }

                        var catName = catNameChars.match.slice(1);

                        if (scope._unicodeCategories.indexOf(catName) >= 0) {
                            return scope._createPatternToken(pattern, tokenTypes.escCharClassCategory, i, 2 + catNameChars.matchLength + 1); // "\p{Name}" or "\P{Name}"
                        }

                        if (scope._namedCharBlocks.indexOf(catName) >= 0) {
                            return scope._createPatternToken(pattern, tokenTypes.escCharClassBlock, i, 2 + catNameChars.matchLength + 1); // "\p{Name}" or "\P{Name}"
                        }

                        throw new System.ArgumentException("Unknown property '" + catName + "'.");
                    }

                    return scope._createPatternToken(pattern, tokenTypes.escCharClass, i, 2); // "\w" or "\W" or "\s" or "\S" or "\d" or "\D"
                }

                // Some other literal
                if (scope._escapedSpecialSymbols.indexOf(ch) >= 0) {
                    token = scope._createPatternToken(pattern, tokenTypes.escCharOther, i, 2); // "\." or "\$" or ... "\\"
                    token.data = { n: ch.charCodeAt(0), ch: ch };
                    return token;
                }

                return null;
            },

            _parseCharRangeToken: function (pattern, i, endIndex) {
                var scope = System.Text.RegularExpressions.RegexEngineParser;
                var tokenTypes = scope.tokenTypes;
                var tokens = [];
                var intervalToken;
                var substractToken;
                var token;
                var isNegative = false;
                var noMoreTokenAllowed = false;
                var hasSubstractToken = false;

                var ch = pattern[i];
                if (ch !== "[") {
                    return null;
                }

                var index = i + 1;
                var closeBracketIndex = -1;
                var toInc;

                if (index < endIndex && pattern[index] === "^") {
                    isNegative = true;
                    index ++;
                }

                var startIndex = index;
                while (index < endIndex) {
                    ch = pattern[index];

                    noMoreTokenAllowed = hasSubstractToken;

                    if (ch === "-" && index + 1 < endIndex && pattern[index + 1] === "[") {
                        substractToken = scope._parseCharRangeToken(pattern, index + 1, endIndex);
                        substractToken.childrenPrefix = "-" + substractToken.childrenPrefix;
                        substractToken.length ++;
                        token = substractToken;
                        toInc = substractToken.length;
                        hasSubstractToken = true;
                    } else if (ch === "\\") {
                        token = scope._parseEscapedChar(pattern, index, endIndex);
                        if (token == null) {
                            throw new System.ArgumentException("Unrecognized escape sequence \\" + ch + ".");
                        }
                        toInc = token.length;
                    } else if (ch === "]" && index > startIndex) {
                        closeBracketIndex = index;
                        break;
                    } else {
                        token = scope._createPatternToken(pattern, tokenTypes.literal, index, 1);
                        toInc = 1;
                    }

                    if (noMoreTokenAllowed) {
                        throw new System.ArgumentException("A subtraction must be the last element in a character class.");
                    }

                    // Check for interval:
                    if (tokens.length > 1) {
                        intervalToken = scope._parseCharIntervalToken(pattern, tokens[tokens.length - 2], tokens[tokens.length - 1], token);
                        if (intervalToken != null) {
                            tokens.pop(); //pop Dush
                            tokens.pop(); //pop Interval start
                            token = intervalToken;
                        }
                    }

                    // Add token:
                    if (token != null) {
                        tokens.push(token);
                        index += toInc;
                    }
                }

                if (closeBracketIndex < 0 || tokens.length < 1) {
                    throw new System.ArgumentException("Unterminated [] set.");
                }

                var groupToken;
                if (!isNegative) {
                    groupToken = scope._createPatternToken(pattern, tokenTypes.charGroup, i, 1 + closeBracketIndex - i, tokens, "[", "]");
                } else {
                    groupToken = scope._createPatternToken(pattern, tokenTypes.charNegativeGroup, i, 1 + closeBracketIndex - i, tokens, "[^", "]");
                }

                // Create full range data:
                var ranges = scope._tidyCharRange(tokens);
                groupToken.data = { ranges: ranges };
                if (substractToken != null) {
                    groupToken.data.substractToken = substractToken;
                }

                return groupToken;
            },

            _parseCharIntervalToken: function (pattern, intervalStartToken, dashToken, intervalEndToken) {
                var scope = System.Text.RegularExpressions.RegexEngineParser;
                var tokenTypes = scope.tokenTypes;

                if (dashToken.type !== tokenTypes.literal || dashToken.value !== "-") {
                    return null;
                }

                if (intervalStartToken.type !== tokenTypes.literal &&
                    intervalStartToken.type !== tokenTypes.escChar &&
                    intervalStartToken.type !== tokenTypes.escCharOctal &&
                    intervalStartToken.type !== tokenTypes.escCharHex &&
                    intervalStartToken.type !== tokenTypes.escCharCtrl &&
                    intervalStartToken.type !== tokenTypes.escCharUnicode &&
                    intervalStartToken.type !== tokenTypes.escCharOther) {
                    return null;
                }

                if (intervalEndToken.type !== tokenTypes.literal &&
                    intervalEndToken.type !== tokenTypes.escChar &&
                    intervalEndToken.type !== tokenTypes.escCharOctal &&
                    intervalEndToken.type !== tokenTypes.escCharHex &&
                    intervalEndToken.type !== tokenTypes.escCharCtrl &&
                    intervalEndToken.type !== tokenTypes.escCharUnicode &&
                    intervalEndToken.type !== tokenTypes.escCharOther) {
                    return null;
                }

                var startN;
                var startCh;
                if (intervalStartToken.type === tokenTypes.literal) {
                    startN = intervalStartToken.value.charCodeAt(0);
                    startCh = intervalStartToken.value;
                } else {
                    startN = intervalStartToken.data.n;
                    startCh = intervalStartToken.data.ch;
                }

                var endN;
                var endCh;
                if (intervalEndToken.type === tokenTypes.literal) {
                    endN = intervalEndToken.value.charCodeAt(0);
                    endCh = intervalEndToken.value;
                } else {
                    endN = intervalEndToken.data.n;
                    endCh = intervalEndToken.data.ch;
                }

                if (startN > endN) {
                    throw new System.NotSupportedException("[x-y] range in reverse order.");
                }

                var index = intervalStartToken.index;
                var length = intervalStartToken.length + dashToken.length + intervalEndToken.length;
                var intervalToken = scope._createPatternToken(pattern, tokenTypes.charInterval, index, length, [intervalStartToken, dashToken, intervalEndToken], "", "");

                intervalToken.data = {
                    startN: startN,
                    startCh: startCh,
                    endN: endN,
                    endCh: endCh
                };

                return intervalToken;
            },

            _tidyCharRange: function (tokens) {
                var scope = System.Text.RegularExpressions.RegexEngineParser;
                var tokenTypes = scope.tokenTypes;

                var j;
                var k;
                var n;
                var m;
                var token;
                var ranges = [];
                var classTokens = [];

                var range;
                var nextRange;
                var toSkip;

                for (j = 0; j < tokens.length; j++) {
                    token = tokens[j];

                    if (token.type === tokenTypes.literal) {
                        n = token.value.charCodeAt(0);
                        m = n;
                    } else if (token.type === tokenTypes.charInterval) {
                        n = token.data.startN;
                        m = token.data.endN;
                    } else if (token.type === tokenTypes.literal ||
                        token.type === tokenTypes.escChar ||
                        token.type === tokenTypes.escCharOctal ||
                        token.type === tokenTypes.escCharHex ||
                        token.type === tokenTypes.escCharCtrl ||
                        token.type === tokenTypes.escCharUnicode ||
                        token.type === tokenTypes.escCharOther) {
                        n = token.data.n;
                        m = n;
                    } else if (
                        token.type === tokenTypes.charGroup ||
                        token.type === tokenTypes.charNegativeGroup) {
                        continue;
                    } else {
                        classTokens.push(token);
                        continue;
                    }

                    if (ranges.length === 0) {
                        ranges.push({ n: n, m: m });
                        continue;
                    }

                    //TODO: [Performance] Use binary search
                    for (k = 0; k < ranges.length; k++) {
                        if (ranges[k].n > n) {
                            break;
                        }
                    }

                    ranges.splice(k, 0, { n: n, m: m });
                }

                // Combine ranges:
                for (j = 0; j < ranges.length; j++) {
                    range = ranges[j];

                    toSkip = 0;
                    for (k = j + 1; k < ranges.length; k++) {
                        nextRange = ranges[k];
                        if (nextRange.n > 1 + range.m) {
                            break;
                        }
                        toSkip++;
                        if (nextRange.m > range.m) {
                            range.m = nextRange.m;
                        }
                    }
                    if (toSkip > 0) {
                        ranges.splice(j + 1, toSkip);
                    }
                }

                if (classTokens.length > 0) {
                    var charClassStr = "[" + scope._constructPattern(classTokens) + "]";
                    ranges.charClassToken = scope._createPatternToken(charClassStr, tokenTypes.charGroup, 0, charClassStr.length, tokens, "[", "]");
                }

                return ranges;
            },

            _parseDotToken: function (pattern, i) {
                var scope = System.Text.RegularExpressions.RegexEngineParser;
                var tokenTypes = scope.tokenTypes;

                var ch = pattern[i];
                if (ch !== ".") {
                    return null;
                }

                return scope._createPatternToken(pattern, tokenTypes.escCharClassDot, i, 1);
            },

            _parseAnchorToken: function (pattern, i) {
                var scope = System.Text.RegularExpressions.RegexEngineParser;
                var tokenTypes = scope.tokenTypes;

                var ch = pattern[i];
                if (ch !== "^" && ch !== "$") {
                    return null;
                }

                return scope._createPatternToken(pattern, tokenTypes.anchor, i, 1);
            },

            _updateSettingsFromConstructs: function (settings, constructs) {
                if (constructs.isIgnoreWhitespace != null) {
                    settings.ignoreWhitespace = constructs.isIgnoreWhitespace;
                }
                if (constructs.isExplicitCapture != null) {
                    settings.explicitCapture = constructs.isExplicitCapture;
                }
            },

            _parseGroupToken: function (pattern, settings, i, endIndex) {
                var scope = System.Text.RegularExpressions.RegexEngineParser;
                var tokenTypes = scope.tokenTypes;
                var groupSettings = {
                    ignoreWhitespace: settings.ignoreWhitespace,
                    explicitCapture: settings.explicitCapture
                };

                var ch = pattern[i];
                if (ch !== "(") {
                    return null;
                }

                var bracketLvl = 1;
                var sqBracketCtx = false;
                var bodyIndex = i + 1;
                var closeBracketIndex = -1;

                var isComment = false;
                var isAlternation = false;
                var isInlineOptions = false;
                var isImnsxConstructed = false;
                var isNonCapturingExplicit = false;

                var grConstructs = null;

                // Parse the Group construct, if any:
                var constructToken = scope._parseGroupConstructToken(pattern, groupSettings, i + 1, endIndex);
                if (constructToken != null) {
                    grConstructs = this._fillGroupConstructs(constructToken);

                    bodyIndex += constructToken.length;
                    if (constructToken.type === tokenTypes.commentInline) {
                        isComment = true;
                    } else if (constructToken.type === tokenTypes.alternationGroupCondition) {
                        isAlternation = true;
                    } else if (constructToken.type === tokenTypes.groupConstructImnsx) {
                        this._updateSettingsFromConstructs(groupSettings, grConstructs);
                        isImnsxConstructed = true;
                    } else if (constructToken.type === tokenTypes.groupConstructImnsxMisc) {
                        this._updateSettingsFromConstructs(settings, grConstructs); // parent settings!
                        isInlineOptions = true;
                    }
                }

                if (groupSettings.explicitCapture && (grConstructs == null || grConstructs.name1 == null)) {
                    isNonCapturingExplicit = true;
                }

                var index = bodyIndex;
                while (index < endIndex) {
                    ch = pattern[index];

                    if (ch === "\\") {
                        index ++; // skip the escaped char
                    } else if (ch === "[") {
                        sqBracketCtx = true;
                    } else if (ch === "]" && sqBracketCtx) {
                        sqBracketCtx = false;
                    } else if (!sqBracketCtx) {
                        if (ch === "(" && !isComment) {
                            ++bracketLvl;
                        } else if (ch === ")") {
                            --bracketLvl;
                            if (bracketLvl === 0) {
                                closeBracketIndex = index;
                                break;
                            }
                        }
                    }

                    ++index;
                }

                var result = null;

                if (isComment) {
                    if (closeBracketIndex < 0) {
                        throw new System.ArgumentException("Unterminated (?#...) comment.");
                    }

                    result = scope._createPatternToken(pattern, tokenTypes.commentInline, i, 1 + closeBracketIndex - i);
                } else {
                    if (closeBracketIndex < 0) {
                        throw new System.ArgumentException("Not enough )'s.");
                    }

                    // Parse the "Body" of the group
                    var innerTokens = scope._parsePatternImpl(pattern, groupSettings, bodyIndex, closeBracketIndex);
                    if (constructToken != null) {
                        innerTokens.splice(0, 0, constructToken);
                    }

                    // If there is an Alternation expression, treat the group as Alternation group
                    if (isAlternation) {
                        var innerTokensLen = innerTokens.length;
                        var innerToken;
                        var j;

                        // Check that there is only 1 alternation symbol:
                        var altCount = 0;
                        for (j = 0; j < innerTokensLen; j++) {
                            innerToken = innerTokens[j];
                            if (innerToken.type === tokenTypes.alternation) {
                                ++altCount;
                                if (altCount > 1) {
                                    throw new System.ArgumentException("Too many | in (?()|).");
                                }
                            }
                        }
                        if (altCount === 0) {
                            // Though .NET works with this case, it ends up with unexpected result. Let's avoid this behaviour.
                            throw new System.NotSupportedException("Alternation group without | is not supported.");
                        }

                        var altGroupToken = scope._createPatternToken(pattern, tokenTypes.alternationGroup, i, 1 + closeBracketIndex - i, innerTokens, "(", ")");
                        result = altGroupToken;
                    } else {
                        // Create Group token:
                        var tokenType = tokenTypes.group;
                        if (isInlineOptions) {
                            tokenType = tokenTypes.groupImnsxMisc;
                        } else if (isImnsxConstructed) {
                            tokenType = tokenTypes.groupImnsx;
                        }

                        var groupToken = scope._createPatternToken(pattern, tokenType, i, 1 + closeBracketIndex - i, innerTokens, "(", ")");
                        groupToken.localSettings = groupSettings;
                        result = groupToken;
                    }
                }

                if (isNonCapturingExplicit) {
                    result.isNonCapturingExplicit = true;
                }

                return result;
            },

            _parseGroupConstructToken: function (pattern, settings, i, endIndex) {
                // ?<name1>
                // ?'name1'
                // ?<name1-name2>
                // ?'name1-name2'
                // ?:
                // ?imnsx-imnsx
                // ?=
                // ?!
                // ?<=
                // ?<!
                // ?>
                // ?#

                var scope = System.Text.RegularExpressions.RegexEngineParser;
                var tokenTypes = scope.tokenTypes;

                var ch = pattern[i];
                if (ch !== "?" || i + 1 >= endIndex) {
                    return null;
                }

                ch = pattern[i + 1];
                if (ch === ":" || ch === "=" || ch === "!" || ch === ">") {
                    return scope._createPatternToken(pattern, tokenTypes.groupConstruct, i, 2);
                }

                if (ch === "#") {
                    return scope._createPatternToken(pattern, tokenTypes.commentInline, i, 2);
                }

                if (ch === "(") {
                    return scope._parseAlternationGroupConditionToken(pattern, settings, i, endIndex);
                }

                if (ch === "<" && i + 2 < endIndex) {
                    var ch3 = pattern[i + 2];
                    if (ch3 === "=" || ch3 === "!") {
                        return scope._createPatternToken(pattern, tokenTypes.groupConstruct, i, 3);
                    }
                }

                if (ch === "<" || ch === "'") {
                    var closingCh = ch === "<" ? ">" : ch;
                    var nameChars = scope._matchUntil(pattern, i + 2, endIndex, closingCh);
                    if (nameChars.unmatchLength !== 1 || nameChars.matchLength === 0) {
                        throw new System.ArgumentException("Unrecognized grouping construct.");
                    }

                    var nameFirstCh = nameChars.match.slice(0, 1);
                    if ("`~@#$%^&*()+{}[]|\\/|'\";:,.?".indexOf(nameFirstCh) >= 0) {
                        // TODO: replace the "black list" of wrong characters with char class check:
                        // According to UTS#18 Unicode Regular Expressions (http://www.unicode.org/reports/tr18/)
                        // RL 1.4 Simple Word Boundaries  The class of <word_character> includes all Alphabetic
                        // values from the Unicode character database, from UnicodeData.txt [UData], plus the U+200C
                        // ZERO WIDTH NON-JOINER and U+200D ZERO WIDTH JOINER.
                        throw new System.ArgumentException("Invalid group name: Group names must begin with a word character.");
                    }

                    return scope._createPatternToken(pattern, tokenTypes.groupConstructName, i, 2 + nameChars.matchLength + 1);
                }

                var imnsxChars = scope._matchChars(pattern, i + 1, endIndex, "imnsx-");
                if (imnsxChars.matchLength > 0 && (imnsxChars.unmatchCh === ":" || imnsxChars.unmatchCh === ")")) {
                    var imnsxTokenType = imnsxChars.unmatchCh === ":" ? tokenTypes.groupConstructImnsx : tokenTypes.groupConstructImnsxMisc;
                    var imnsxPostfixLen = imnsxChars.unmatchCh === ":" ? 1 : 0;
                    return scope._createPatternToken(pattern, imnsxTokenType, i, 1 + imnsxChars.matchLength + imnsxPostfixLen);
                }

                throw new System.ArgumentException("Unrecognized grouping construct.");
            },

            _parseQuantifierToken: function (pattern, i, endIndex) {
                var scope = System.Text.RegularExpressions.RegexEngineParser;
                var tokenTypes = scope.tokenTypes;
                var token = null;

                var ch = pattern[i];

                if (ch === "*" || ch === "+" || ch === "?") {
                    token = scope._createPatternToken(pattern, tokenTypes.quantifier, i, 1);
                    token.data = { val: ch };
                } else if (ch === "{") {
                    var dec1Chars = scope._matchChars(pattern, i + 1, endIndex, scope._decSymbols);
                    if (dec1Chars.matchLength !== 0) {
                        if (dec1Chars.unmatchCh === "}") {
                            token = scope._createPatternToken(pattern, tokenTypes.quantifierN, i, 1 + dec1Chars.matchLength + 1);
                            token.data = {
                                n: parseInt(dec1Chars.match, 10)
                            };
                        } else if (dec1Chars.unmatchCh === ",") {
                            var dec2Chars = scope._matchChars(pattern, dec1Chars.unmatchIndex + 1, endIndex, scope._decSymbols);
                            if (dec2Chars.unmatchCh === "}") {
                                token = scope._createPatternToken(pattern, tokenTypes.quantifierNM, i, 1 + dec1Chars.matchLength + 1 + dec2Chars.matchLength + 1);
                                token.data = {
                                    n: parseInt(dec1Chars.match, 10),
                                    m: null
                                };
                                if (dec2Chars.matchLength !== 0) {
                                    token.data.m = parseInt(dec2Chars.match, 10);
                                    if (token.data.n > token.data.m) {
                                        throw new System.ArgumentException("Illegal {x,y} with x > y.");
                                    }
                                }
                            }
                        }
                    }
                }

                if (token != null) {
                    var nextChIndex = i + token.length;
                    if (nextChIndex < endIndex) {
                        var nextCh = pattern[nextChIndex];
                        if (nextCh === "?") {
                            this._modifyPatternToken(token, pattern, token.type, token.index, token.length + 1);
                            token.data.isLazy = true;
                        }
                    }
                }

                return token;
            },

            _parseAlternationToken: function (pattern, i) {
                var scope = System.Text.RegularExpressions.RegexEngineParser;
                var tokenTypes = scope.tokenTypes;

                var ch = pattern[i];
                if (ch !== "|") {
                    return null;
                }

                return scope._createPatternToken(pattern, tokenTypes.alternation, i, 1);
            },

            _parseAlternationGroupConditionToken: function (pattern, settings, i, endIndex) {
                var scope = System.Text.RegularExpressions.RegexEngineParser;
                var tokenTypes = scope.tokenTypes;
                var constructToken;
                var childToken;
                var data = null;

                var ch = pattern[i];
                if (ch !== "?" || i + 1 >= endIndex || pattern[i + 1] !== "(") {
                    return null;
                }

                // Parse Alternation condition as a group:
                var expr = scope._parseGroupToken(pattern, settings, i + 1, endIndex);
                if (expr == null) {
                    return null;
                }
                if (expr.type === tokenTypes.commentInline) {
                    throw new System.ArgumentException("Alternation conditions cannot be comments.");
                }

                var children = expr.children;
                if (children && children.length) {
                    constructToken = children[0];
                    if (constructToken.type === tokenTypes.groupConstructName) {
                        throw new System.ArgumentException("Alternation conditions do not capture and cannot be named.");
                    }

                    if (constructToken.type === tokenTypes.groupConstruct || constructToken.type === tokenTypes.groupConstructImnsx) {
                        childToken = scope._findFirstGroupWithoutConstructs(children);
                        if (childToken != null) {
                            childToken.isEmptyCapturing = true;
                        }
                    }

                    if (constructToken.type === tokenTypes.literal) {
                        var literalVal = expr.value.slice(1, expr.value.length - 1);
                        var isDigit = literalVal[0] >= "0" && literalVal[0] <= "9";
                        if (isDigit) {
                            var res = scope._matchChars(literalVal, 0, literalVal.length, scope._decSymbols);
                            if (res.matchLength !== literalVal.length) {
                                throw new System.ArgumentException("Malformed Alternation group number: " + literalVal + ".");
                            }

                            var number = parseInt(literalVal, 10);
                            data = { number: number };
                        } else {
                            data = { name: literalVal };
                        }
                    }
                }

                // Add "Noncapturing" construct if there are no other ones.
                if (!children.length || (children[0].type !== tokenTypes.groupConstruct && children[0].type !== tokenTypes.groupConstructImnsx)) {
                    constructToken = scope._createPatternToken("?:", tokenTypes.groupConstruct, 0, 2);
                    children.splice(0, 0, constructToken);
                }

                // Transform Group token to Alternation expression token:
                var token = scope._createPatternToken(pattern, tokenTypes.alternationGroupCondition, expr.index - 1, 1 + expr.length, [expr], "?", "");
                if (data != null) {
                    token.data = data;
                }
                return token;
            },

            _findFirstGroupWithoutConstructs: function (tokens) {
                var scope = System.Text.RegularExpressions.RegexEngineParser;
                var tokenTypes = scope.tokenTypes;
                var result = null;
                var token;
                var i;

                for (i = 0; i < tokens.length; ++i) {
                    token = tokens[i];
                    if (token.type === tokenTypes.group && token.children && token.children.length) {
                        if (token.children[0].type !== tokenTypes.groupConstruct && token.children[0].type !== tokenTypes.groupConstructImnsx) {
                            result = token;
                            break;
                        }

                        if (token.children && token.children.length) {
                            result = scope._findFirstGroupWithoutConstructs(token.children);
                            if (result != null) {
                                break;
                            }
                        }
                    }
                }

                return result;
            },

            _parseXModeCommentToken: function (pattern, i, endIndex) {
                var scope = System.Text.RegularExpressions.RegexEngineParser;
                var tokenTypes = scope.tokenTypes;

                var ch = pattern[i];
                if (ch !== "#") {
                    return null;
                }

                var index = i + 1;
                while (index < endIndex) {
                    ch = pattern[index];
                    ++index; // index should be changed before breaking

                    if (ch === "\n") {
                        break;
                    }
                }

                return scope._createPatternToken(pattern, tokenTypes.commentXMode, i, index - i);
            },

            _createLiteralToken: function (body) {
                var scope = System.Text.RegularExpressions.RegexEngineParser;
                var token = scope._createPatternToken(body, scope.tokenTypes.literal, 0, body.length);
                return token;
            },

            _createPositiveLookaheadToken: function (body, settings) {
                var scope = System.Text.RegularExpressions.RegexEngineParser;

                var pattern = "(?=" + body + ")";
                var groupToken = scope._parseGroupToken(pattern, settings, 0, pattern.length);

                return groupToken;
            },

            _createPatternToken: function (pattern, type, i, len, innerTokens, innerTokensPrefix, innerTokensPostfix) {
                var token = {
                    type: type,
                    index: i,
                    length: len,
                    value: pattern.slice(i, i + len)
                };

                if (innerTokens != null && innerTokens.length > 0) {
                    token.children = innerTokens;
                    token.childrenPrefix = innerTokensPrefix;
                    token.childrenPostfix = innerTokensPostfix;
                }

                return token;
            },

            _modifyPatternToken: function (token, pattern, type, i, len) {
                if (type != null) {
                    token.type = type;
                }

                if (i != null || len != null) {
                    if (i != null) {
                        token.index = i;
                    }
                    if (len != null) {
                        token.length = len;
                    }

                    token.value = pattern.slice(token.index, token.index + token.length);
                }
            },

            _updatePatternToken: function (token, type, i, len, value) {
                token.type = type;
                token.index = i;
                token.length = len;
                token.value = value;
            },

            _matchChars: function (str, startIndex, endIndex, allowedChars, maxLength) {
                var res = {
                    match: "",
                    matchIndex: -1,
                    matchLength: 0,
                    unmatchCh: "",
                    unmatchIndex: -1,
                    unmatchLength: 0
                };

                var index = startIndex;
                var ch;

                if (maxLength != null && maxLength >= 0) {
                    endIndex = startIndex + maxLength;
                }

                while (index < endIndex) {
                    ch = str[index];

                    if (allowedChars.indexOf(ch) < 0) {
                        res.unmatchCh = ch;
                        res.unmatchIndex = index;
                        res.unmatchLength = 1;
                        break;
                    }

                    index++;
                }

                if (index > startIndex) {
                    res.match = str.slice(startIndex, index);
                    res.matchIndex = startIndex;
                    res.matchLength = index - startIndex;
                }

                return res;
            },

            _matchUntil: function (str, startIndex, endIndex, unallowedChars, maxLength) {
                var res = {
                    match: "",
                    matchIndex: -1,
                    matchLength: 0,
                    unmatchCh: "",
                    unmatchIndex: -1,
                    unmatchLength: 0
                };

                var index = startIndex;
                var ch;

                if (maxLength != null && maxLength >= 0) {
                    endIndex = startIndex + maxLength;
                }

                while (index < endIndex) {
                    ch = str[index];

                    if (unallowedChars.indexOf(ch) >= 0) {
                        res.unmatchCh = ch;
                        res.unmatchIndex = index;
                        res.unmatchLength = 1;
                        break;
                    }

                    index++;
                }

                if (index > startIndex) {
                    res.match = str.slice(startIndex, index);
                    res.matchIndex = startIndex;
                    res.matchLength = index - startIndex;
                }

                return res;
            }
        }
    });

    // @source random.js

    Bridge.define("System.Random", {
        statics: {
            MBIG: 2147483647,
            MSEED: 161803398,
            MZ: 0
        },
        inext: 0,
        inextp: 0,
        seedArray: null,
        config: {
            init: function () {
                this.seedArray = System.Array.init(56, 0, System.Int32);
            }
        },
        ctor: function () {
            System.Random.$ctor1.call(this, System.Int64.clip32(System.Int64((new Date()).getTime()).mul(10000)));
        },
        $ctor1: function (seed) {
            this.$initialize();
            var ii;
            var mj, mk;

            //Initialize our Seed array.
            //This algorithm comes from Numerical Recipes in C (2nd Ed.)
            var subtraction = (seed === -2147483648) ? 2147483647 : Math.abs(seed);
            mj = (System.Random.MSEED - subtraction) | 0;
            this.seedArray[55] = mj;
            mk = 1;
            for (var i = 1; i < 55; i = (i + 1) | 0) { //Apparently the range [1..55] is special (Knuth) and so we're wasting the 0'th position.
                ii = (((21 * i) | 0)) % 55;
                this.seedArray[ii] = mk;
                mk = (mj - mk) | 0;
                if (mk < 0) {
                    mk = (mk + System.Random.MBIG) | 0;
                }
                mj = this.seedArray[ii];
            }
            for (var k = 1; k < 5; k = (k + 1) | 0) {
                for (var i1 = 1; i1 < 56; i1 = (i1 + 1) | 0) {
                    this.seedArray[i1] = (this.seedArray[i1] - this.seedArray[((1 + (((i1 + 30) | 0)) % 55) | 0)]) | 0;
                    if (this.seedArray[i1] < 0) {
                        this.seedArray[i1] = (this.seedArray[i1] + System.Random.MBIG) | 0;
                    }
                }
            }
            this.inext = 0;
            this.inextp = 21;
            seed = 1;
        },
        sample: function () {
            //Including this division at the end gives us significantly improved
            //random number distribution.
            return (this.internalSample() * (4.6566128752457969E-10));
        },
        internalSample: function () {
            var retVal;
            var locINext = this.inext;
            var locINextp = this.inextp;

            if (((locINext = (locINext + 1) | 0)) >= 56) {
                locINext = 1;
            }

            if (((locINextp = (locINextp + 1) | 0)) >= 56) {
                locINextp = 1;
            }

            retVal = (this.seedArray[locINext] - this.seedArray[locINextp]) | 0;

            if (retVal === System.Random.MBIG) {
                retVal = (retVal - 1) | 0;
            }

            if (retVal < 0) {
                retVal = (retVal + System.Random.MBIG) | 0;
            }

            this.seedArray[locINext] = retVal;

            this.inext = locINext;
            this.inextp = locINextp;

            return retVal;
        },
        next: function () {
            return this.internalSample();
        },
        next$2: function (minValue, maxValue) {
            if (minValue > maxValue) {
                throw new System.ArgumentOutOfRangeException("minValue", "'minValue' cannot be greater than maxValue.");
            }

            var range = System.Int64(maxValue).sub(System.Int64(minValue));
            if (range.lte(System.Int64(2147483647))) {
                return (((Bridge.Int.clip32(this.sample() * System.Int64.toNumber(range)) + minValue) | 0));
            } else {
                return System.Int64.clip32(Bridge.Int.clip64(this.getSampleForLargeRange() * System.Int64.toNumber(range)).add(System.Int64(minValue)));
            }
        },
        next$1: function (maxValue) {
            if (maxValue < 0) {
                throw new System.ArgumentOutOfRangeException("maxValue", "'maxValue' must be greater than zero.");
            }
            return Bridge.Int.clip32(this.sample() * maxValue);
        },
        getSampleForLargeRange: function () {
            // The distribution of double value returned by Sample
            // is not distributed well enough for a large range.
            // If we use Sample for a range [Int32.MinValue..Int32.MaxValue)
            // We will end up getting even numbers only.

            var result = this.internalSample();
            // Note we can't use addition here. The distribution will be bad if we do that.
            var negative = (this.internalSample() % 2 === 0) ? true : false; // decide the sign based on second sample
            if (negative) {
                result = (-result) | 0;
            }
            var d = result;
            d += (2147483646); // get a number in range [0 .. 2 * Int32MaxValue - 1)
            d /= 4294967293;
            return d;
        },
        nextDouble: function () {
            return this.sample();
        },
        nextBytes: function (buffer) {
            if (buffer == null) {
                throw new System.ArgumentNullException("buffer");
            }
            for (var i = 0; i < buffer.length; i = (i + 1) | 0) {
                buffer[i] = (this.internalSample() % (256)) & 255;
            }
        }
    });

    // @source timer.js

    Bridge.define("System.Threading.Timer", {
        inherits: [System.IDisposable],
        statics: {
            MAX_SUPPORTED_TIMEOUT: 4294967294,
            EXC_LESS: "Number must be either non-negative and less than or equal to Int32.MaxValue or -1.",
            EXC_MORE: "Time-out interval must be less than 2^32-2.",
            EXC_DISPOSED: "The timer has been already disposed."
        },
        dueTime: System.Int64(0),
        period: System.Int64(0),
        timerCallback: null,
        state: null,
        id: null,
        disposed: false,
        config: {
            alias: [
            "dispose", "System$IDisposable$dispose"
            ]
        },
        $ctor1: function (callback, state, dueTime, period) {
            this.$initialize();
            this.timerSetup(callback, state, System.Int64(dueTime), System.Int64(period));
        },
        $ctor3: function (callback, state, dueTime, period) {
            this.$initialize();
            var dueTm = Bridge.Int.clip64(dueTime.getTotalMilliseconds());
            var periodTm = Bridge.Int.clip64(period.getTotalMilliseconds());

            this.timerSetup(callback, state, dueTm, periodTm);
        },
        $ctor4: function (callback, state, dueTime, period) {
            this.$initialize();
            this.timerSetup(callback, state, System.Int64(dueTime), System.Int64(period));
        },
        $ctor2: function (callback, state, dueTime, period) {
            this.$initialize();
            this.timerSetup(callback, state, dueTime, period);
        },
        ctor: function (callback) {
            this.$initialize();
            var dueTime = -1; // we want timer to be registered, but not activated.  Requires caller to call
            var period = -1; // Change after a timer instance is created.  This is to avoid the potential
            // for a timer to be fired before the returned value is assigned to the variable,
            // potentially causing the callback to reference a bogus value (if passing the timer to the callback).

            this.timerSetup(callback, this, System.Int64(dueTime), System.Int64(period));
        },
        timerSetup: function (callback, state, dueTime, period) {
            if (this.disposed) {
                throw new System.InvalidOperationException(System.Threading.Timer.EXC_DISPOSED);
            }

            if (Bridge.staticEquals(callback, null)) {
                throw new System.ArgumentNullException("TimerCallback");
            }

            if (dueTime.lt(System.Int64(-1))) {
                throw new System.ArgumentOutOfRangeException("dueTime", System.Threading.Timer.EXC_LESS);
            }
            if (period.lt(System.Int64(-1))) {
                throw new System.ArgumentOutOfRangeException("period", System.Threading.Timer.EXC_LESS);
            }
            if (dueTime.gt(System.Int64(System.Threading.Timer.MAX_SUPPORTED_TIMEOUT))) {
                throw new System.ArgumentOutOfRangeException("dueTime", System.Threading.Timer.EXC_MORE);
            }
            if (period.gt(System.Int64(System.Threading.Timer.MAX_SUPPORTED_TIMEOUT))) {
                throw new System.ArgumentOutOfRangeException("period", System.Threading.Timer.EXC_MORE);
            }

            this.dueTime = dueTime;
            this.period = period;

            this.state = state;
            this.timerCallback = callback;

            return this.runTimer(this.dueTime);
        },
        handleCallback: function () {
            if (this.disposed) {
                return;
            }

            if (!Bridge.staticEquals(this.timerCallback, null)) {
                var myId = this.id;
                this.timerCallback(this.state);

                // timerCallback may call Change(). To prevent double call we can check if timer changed
                if (System.Nullable.eq(this.id, myId)) {
                    this.runTimer(this.period, false);
                }
            }
        },
        runTimer: function (period, checkDispose) {
            if (checkDispose === void 0) { checkDispose = true; }
            if (checkDispose && this.disposed) {
                throw new System.InvalidOperationException(System.Threading.Timer.EXC_DISPOSED);
            }

            if (period.ne(System.Int64(-1)) && !this.disposed) {
                var p = period.toNumber();
                this.id = Bridge.global.setTimeout(Bridge.fn.cacheBind(this, this.handleCallback), p);
                return true;
            }

            return false;
        },
        change: function (dueTime, period) {
            return this.changeTimer(System.Int64(dueTime), System.Int64(period));
        },
        change$2: function (dueTime, period) {
            return this.changeTimer(Bridge.Int.clip64(dueTime.getTotalMilliseconds()), Bridge.Int.clip64(period.getTotalMilliseconds()));
        },
        change$3: function (dueTime, period) {
            return this.changeTimer(System.Int64(dueTime), System.Int64(period));
        },
        change$1: function (dueTime, period) {
            return this.changeTimer(dueTime, period);
        },
        changeTimer: function (dueTime, period) {
            this.clearTimeout();
            return this.timerSetup(this.timerCallback, this.state, dueTime, period);
        },
        clearTimeout: function () {
            if (System.Nullable.hasValue(this.id)) {
                Bridge.global.clearTimeout(System.Nullable.getValue(this.id));
                this.id = null;
            }
        },
        dispose: function () {
            this.clearTimeout();
            this.disposed = true;
        }
    });

    // @source console.js

    Bridge.define("Bridge.Console", {
        statics: {
            BODY_WRAPPER_ID: "bridge-body-wrapper",
            CONSOLE_MESSAGES_ID: "bridge-console-messages",
            position: "horizontal",
            instance: null,
            getInstance: function () {
                if (Bridge.Console.instance == null) {
                    Bridge.Console.instance = new Bridge.Console();
                }

                return Bridge.Console.instance;
            },
            logBase: function (value, messageType) {
                if (messageType === void 0) { messageType = 0; }
                var self = Bridge.Console.getInstance();

                var v = value != null ? value.toString() : "";

                if (self.bufferedOutput != null) {
                    self.bufferedOutput = System.String.concat(self.bufferedOutput, v);
                    return;
                }

                Bridge.Console.show();

                var m = self.buildConsoleMessage(v, messageType);
                self.consoleMessages.appendChild(m);

                self.currentMessageElement = m;

                if (self.consoleDefined) {
                    if (messageType === 1 && self.consoleDebugDefined) {
                        Bridge.global.console.debug(v);
                    } else {
                        Bridge.global.console.log(v);
                    }
                } else if (self.operaPostErrorDefined) {
                    Bridge.global.opera.postError(v);
                }
            },
            error: function (value) {
                Bridge.Console.logBase(value, 2);
            },
            debug: function (value) {
                Bridge.Console.logBase(value, 1);
            },
            log: function (value) {
                Bridge.Console.logBase(value);
            },
            hide: function () {
                if (Bridge.Console.instance == null) {
                    return;
                }

                var self = Bridge.Console.getInstance();

                if (self.hidden) {
                    return;
                }

                self.close();
            },
            show: function () {
                var self = Bridge.Console.getInstance();

                if (!self.hidden) {
                    return;
                }

                self.init(true);
            },
            toggle: function () {
                if (Bridge.Console.getInstance().hidden) {
                    Bridge.Console.show();
                } else {
                    Bridge.Console.hide();
                }
            }
        },
        svgNS: "http://www.w3.org/2000/svg",
        consoleHeight: "300px",
        consoleHeaderHeight: "35px",
        tooltip: null,
        consoleWrapper: null,
        consoleMessages: null,
        bridgeIcon: null,
        bridgeIconPath: null,
        bridgeConsoleLabel: null,
        closeBtn: null,
        closeIcon: null,
        closeIconPath: null,
        consoleHeader: null,
        consoleBody: null,
        hidden: true,
        consoleDefined: false,
        consoleDebugDefined: false,
        operaPostErrorDefined: false,
        currentMessageElement: null,
        bufferedOutput: null,
        ctor: function () {
            this.$initialize();
            this.init();
        },
        init: function (reinit) {
            if (reinit === void 0) { reinit = false; }
            this.hidden = false;

            var consoleWrapperStyles = Bridge.fn.bind(this, $asm.$.Bridge.Console.f1)(new (System.Collections.Generic.Dictionary$2(String,String))());

            var consoleHeaderStyles = $asm.$.Bridge.Console.f2(new (System.Collections.Generic.Dictionary$2(String,String))());

            var consoleBodyStyles = $asm.$.Bridge.Console.f3(new (System.Collections.Generic.Dictionary$2(String,String))());

            // Bridge Icon
            this.bridgeIcon = this.bridgeIcon || document.createElementNS(this.svgNS, "svg");

            var items = Bridge.fn.bind(this, $asm.$.Bridge.Console.f4)(new (System.Collections.Generic.Dictionary$2(String,String))());

            this.setAttributes(this.bridgeIcon, items);

            this.bridgeIconPath = this.bridgeIconPath || document.createElementNS(this.svgNS, "path");

            var items2 = new (System.Collections.Generic.Dictionary$2(String,String))();
            items2.set("d", "M19 14.4h2.2V9.6L19 7.1v7.3zm4.3-2.5v2.5h2.2l-2.2-2.5zm-8.5 2.5H17V4.8l-2.2-2.5v12.1zM0 14.4h3l7.5-8.5v8.5h2.2V0L0 14.4z");
            items2.set("fill", "#555");

            this.setAttributes(this.bridgeIconPath, items2);

            // Bridge Console Label
            this.bridgeConsoleLabel = this.bridgeConsoleLabel || document.createElement("span");
            this.bridgeConsoleLabel.innerHTML = "Bridge Console";

            // Close Button
            this.closeBtn = this.closeBtn || document.createElement("span");
            this.closeBtn.setAttribute("style", "position: relative;display: inline-block;float: right;cursor: pointer");

            this.closeIcon = this.closeIcon || document.createElementNS(this.svgNS, "svg");

            var items3 = Bridge.fn.bind(this, $asm.$.Bridge.Console.f5)(new (System.Collections.Generic.Dictionary$2(String,String))());

            this.setAttributes(this.closeIcon, items3);

            this.closeIconPath = this.closeIconPath || document.createElementNS(this.svgNS, "path");

            var items4 = $asm.$.Bridge.Console.f6(new (System.Collections.Generic.Dictionary$2(String,String))());

            this.setAttributes(this.closeIconPath, items4);

            this.tooltip = this.tooltip || document.createElement("div");
            this.tooltip.innerHTML = "Refresh page to open Bridge Console";

            this.tooltip.setAttribute("style", "position: absolute;right: 30px;top: -6px;white-space: nowrap;padding: 7px;border-radius: 3px;background-color: rgba(0, 0, 0, 0.75);color: #eee;text-align: center;visibility: hidden;opacity: 0;-webkit-transition: all 0.25s ease-in-out;transition: all 0.25s ease-in-out;z-index: 1;");

            // Styles and other stuff based on position
            // Force to horizontal for now
            Bridge.Console.position = "horizontal";

            if (Bridge.referenceEquals(Bridge.Console.position, "horizontal")) {
                this.wrapBodyContent();

                consoleWrapperStyles.set("right", "0");
                consoleHeaderStyles.set("border-top", "1px solid #a3a3a3");
                consoleBodyStyles.set("height", this.consoleHeight);
            } else if (Bridge.referenceEquals(Bridge.Console.position, "vertical")) {
                var consoleWidth = "400px";
                document.body.style.marginLeft = consoleWidth;

                consoleWrapperStyles.set("top", "0");
                consoleWrapperStyles.set("width", consoleWidth);
                consoleWrapperStyles.set("border-right", "1px solid #a3a3a3");
                consoleBodyStyles.set("height", "100%");
            }

            // Console wrapper
            this.consoleWrapper = this.consoleWrapper || document.createElement("div");
            this.consoleWrapper.setAttribute("style", this.obj2Css(consoleWrapperStyles));

            // Console Header
            this.consoleHeader = this.consoleHeader || document.createElement("div");
            this.consoleHeader.setAttribute("style", this.obj2Css(consoleHeaderStyles));

            // Console Body Wrapper
            this.consoleBody = this.consoleBody || document.createElement("div");
            this.consoleBody.setAttribute("style", this.obj2Css(consoleBodyStyles));

            // Console Messages Unordered List Element
            this.consoleMessages = this.consoleMessages || document.createElement("ul");
            var cm = this.consoleMessages;
            cm.id = Bridge.Console.CONSOLE_MESSAGES_ID;

            cm.setAttribute("style", "margin: 0;padding: 0;list-style: none;");

            if (!reinit) {
                this.bridgeIcon.appendChild(this.bridgeIconPath);
                this.closeIcon.appendChild(this.closeIconPath);
                this.closeBtn.appendChild(this.closeIcon);
                this.closeBtn.appendChild(this.tooltip);

                // Add child elements into console header
                this.consoleHeader.appendChild(this.bridgeIcon);
                this.consoleHeader.appendChild(this.bridgeConsoleLabel);
                this.consoleHeader.appendChild(this.closeBtn);

                // Add messages to console body
                this.consoleBody.appendChild(cm);

                // Add console header and console body into console wrapper
                this.consoleWrapper.appendChild(this.consoleHeader);
                this.consoleWrapper.appendChild(this.consoleBody);

                // Finally add console to body
                document.body.appendChild(this.consoleWrapper);

                // Close console
                this.closeBtn.addEventListener("click", Bridge.fn.cacheBind(this, this.close));

                // Show/hide Tooltip
                this.closeBtn.addEventListener("mouseover", Bridge.fn.cacheBind(this, this.showTooltip));
                this.closeBtn.addEventListener("mouseout", Bridge.fn.cacheBind(this, this.hideTooltip));

                this.consoleDefined = Bridge.isDefined(Bridge.global) && Bridge.isDefined(Bridge.global.console);
                this.consoleDebugDefined = this.consoleDefined && Bridge.isDefined(Bridge.global.console.debug);
                this.operaPostErrorDefined = Bridge.isDefined(Bridge.global.opera) && Bridge.isDefined(Bridge.global.opera.postError);
            }
        },
        showTooltip: function () {
            var self = Bridge.Console.getInstance();
            self.tooltip.style.right = "20px";
            self.tooltip.style.visibility = "visible";
            self.tooltip.style.opacity = "1";
        },
        hideTooltip: function () {
            var self = Bridge.Console.getInstance();
            self.tooltip.style.right = "30px";
            self.tooltip.style.opacity = "0";
        },
        close: function () {
            this.hidden = true;

            this.consoleWrapper.style.display = "none";

            if (Bridge.referenceEquals(Bridge.Console.position, "horizontal")) {
                this.unwrapBodyContent();
            } else if (Bridge.referenceEquals(Bridge.Console.position, "vertical")) {
                document.body.removeAttribute("style");
            }
        },
        wrapBodyContent: function () {
            if (document.body == null) {
                return;
            }

            // get body margin and padding for proper alignment of scroll if a body margin/padding is used.
            var bodyStyle = document.defaultView.getComputedStyle(document.body, null);

            var bodyPaddingTop = bodyStyle.paddingTop;
            var bodyPaddingRight = bodyStyle.paddingRight;
            var bodyPaddingBottom = bodyStyle.paddingBottom;
            var bodyPaddingLeft = bodyStyle.paddingLeft;

            var bodyMarginTop = bodyStyle.marginTop;
            var bodyMarginRight = bodyStyle.marginRight;
            var bodyMarginBottom = bodyStyle.marginBottom;
            var bodyMarginLeft = bodyStyle.marginLeft;

            var div = document.createElement("div");
            div.id = Bridge.Console.BODY_WRAPPER_ID;
            div.setAttribute("style", System.String.concat("height: calc(100vh - ", this.consoleHeight, " - ", this.consoleHeaderHeight, ");", "margin-top: calc(-1 * ", "(", (System.String.concat(bodyMarginTop, " + ", bodyPaddingTop)), "));", "margin-right: calc(-1 * ", "(", (System.String.concat(bodyMarginRight, " + ", bodyPaddingRight)), "));", "margin-left: calc(-1 * ", "(", (System.String.concat(bodyMarginLeft, " + ", bodyPaddingLeft)), "));", "padding-top: calc(", (System.String.concat(bodyMarginTop, " + ", bodyPaddingTop)), ");", "padding-right: calc(", (System.String.concat(bodyMarginRight, " + ", bodyPaddingRight)), ");", "padding-bottom: calc(", (System.String.concat(bodyMarginBottom, " + ", bodyPaddingBottom)), ");", "padding-left: calc(", (System.String.concat(bodyMarginLeft, " + ", bodyPaddingLeft)), ");", "overflow-x: auto;", "box-sizing: border-box !important;"));

            while (document.body.firstChild != null) {
                div.appendChild(document.body.firstChild);
            }

            document.body.appendChild(div);
        },
        unwrapBodyContent: function () {
            var bridgeBodyWrapper = document.getElementById(Bridge.Console.BODY_WRAPPER_ID);

            if (bridgeBodyWrapper == null) {
                return;
            }

            while (bridgeBodyWrapper.firstChild != null) {
                document.body.insertBefore(bridgeBodyWrapper.firstChild, bridgeBodyWrapper);
            }

            document.body.removeChild(bridgeBodyWrapper);
        },
        buildConsoleMessage: function (message, messageType) {
            var messageItem = document.createElement("li");
            messageItem.setAttribute("style", "padding: 5px 10px;border-bottom: 1px solid #f0f0f0;");

            var messageIcon = document.createElementNS(this.svgNS, "svg");

            var items5 = Bridge.fn.bind(this, $asm.$.Bridge.Console.f7)(new (System.Collections.Generic.Dictionary$2(String,String))());

            this.setAttributes(messageIcon, items5);

            var color = "#555";

            if (messageType === 2) {
                color = "#d65050";
            } else if (messageType === 1) {
                color = "#1800FF";
            }

            var messageIconPath = document.createElementNS(this.svgNS, "path");

            var items6 = new (System.Collections.Generic.Dictionary$2(String,String))();

            items6.set("d", "M3.8 3.5L.7 6.6s-.1.1-.2.1-.1 0-.2-.1l-.2-.3C0 6.2 0 6.2 0 6.1c0 0 0-.1.1-.1l2.6-2.6L.1.7C0 .7 0 .6 0 .6 0 .5 0 .5.1.4L.4.1c0-.1.1-.1.2-.1s.1 0 .2.1l3.1 3.1s.1.1.1.2-.1.1-.2.1z");
            items6.set("fill", color);

            this.setAttributes(messageIconPath, items6);

            messageIcon.appendChild(messageIconPath);

            var messageContainer = document.createElement("span");
            messageContainer.innerHTML = message;
            messageContainer.setAttribute("style", System.String.concat("color: ", color, "; white-space: pre;"));

            messageItem.appendChild(messageIcon);
            messageItem.appendChild(messageContainer);

            return messageItem;
        },
        setAttributes: function (el, attrs) {
            var $t;
            $t = Bridge.getEnumerator(attrs);
            while ($t.moveNext()) {
                var item = $t.getCurrent();
                el.setAttribute(item.key, item.value);
            }
        },
        obj2Css: function (obj) {
            var $t;
            var str = "";

            $t = Bridge.getEnumerator(obj);
            while ($t.moveNext()) {
                var item = $t.getCurrent();
                str = System.String.concat(str, (System.String.concat(item.key.toLowerCase(), ":", item.value, ";")));
            }

            return str;
        }
    });

    Bridge.ns("Bridge.Console", $asm.$);

    Bridge.apply($asm.$.Bridge.Console, {
        f1: function (_o1) {
            _o1.add("position", "fixed");
            _o1.add("left", "0");
            _o1.add("bottom", "0");
            _o1.add("padding-top", this.consoleHeaderHeight);
            _o1.add("background-color", "#fff");
            _o1.add("font", "normal normal normal 13px/1 sans-serif");
            _o1.add("color", "#555");
            return _o1;
        },
        f2: function (_o2) {
            _o2.add("position", "absolute");
            _o2.add("top", "0");
            _o2.add("left", "0");
            _o2.add("right", "0");
            _o2.add("height", "35px");
            _o2.add("padding", "9px 15px 7px 10px");
            _o2.add("border-bottom", "1px solid #ccc");
            _o2.add("background-color", "#f3f3f3");
            _o2.add("box-sizing", "border-box");
            return _o2;
        },
        f3: function (_o3) {
            _o3.add("overflow-x", "auto");
            _o3.add("font-family", "Menlo, Monaco, Consolas, 'Courier New', monospace");
            return _o3;
        },
        f4: function (_o4) {
            _o4.add("xmlns", this.svgNS);
            _o4.add("width", "25.5");
            _o4.add("height", "14.4");
            _o4.add("viewBox", "0 0 25.5 14.4");
            _o4.add("style", "margin: 0 3px 3px 0;vertical-align:middle;");
            return _o4;
        },
        f5: function (_o5) {
            _o5.add("xmlns", this.svgNS);
            _o5.add("width", "11.4");
            _o5.add("height", "11.4");
            _o5.add("viewBox", "0 0 11.4 11.4");
            _o5.add("style", "vertical-align: middle;");
            return _o5;
        },
        f6: function (_o6) {
            _o6.add("d", "M11.4 1.4L10 0 5.7 4.3 1.4 0 0 1.4l4.3 4.3L0 10l1.4 1.4 4.3-4.3 4.3 4.3 1.4-1.4-4.3-4.3");
            _o6.add("fill", "#555");
            return _o6;
        },
        f7: function (_o7) {
            _o7.add("xmlns", this.svgNS);
            _o7.add("width", "3.9");
            _o7.add("height", "6.7");
            _o7.add("viewBox", "0 0 3.9 6.7");
            _o7.add("style", "margin-right: 7px; vertical-align: middle;");
            return _o7;
        }
    });

    // @source End.js

    // module export
    if (typeof define === "function" && define.amd) {
        // AMD
        define("bridge", [], function () { return Bridge; });
    } else if (typeof module !== "undefined" && module.exports) {
        // Node
        module.exports = Bridge;
    }

    // @source Finally.js

})(this);
