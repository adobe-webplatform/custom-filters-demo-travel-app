/*
 * Copyright (c) 2013 Adobe Systems Incorporated. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

define(function() {

    function customFilterGenerator(template) {
        return function(fn, keys) {
            var index = 0;
            return _.map(template, function(value) {
                if (value.charAt(0) == "?")
                    return fn[keys[index++]].toFixed(6);
                return value;
            }).join("");
        };
    }

    function generateFunction(name, parameters, units) {
        if (!_.isArray(parameters))
            parameters = parameters.split(" ");
        var cssGeneartor;
        if (_.isFunction(units))
            cssGeneartor = units;
        var keys = _.map(parameters, function(name) {
            return "_" + name;
        });
        var fn = function() {
            var self = this, args = arguments;
            _.each(parameters, function(parameter, i) {
                self[keys[i]] = (i < args.length) ? args[i] : 0;
            });
        };
        _.extend(fn, {
            create: function() {
                var self = new fn(), args = arguments;
                _.each(parameters, function(parameter, i) {
                    self[keys[i]] = (i < args.length) ? args[i] : 0;
                });
                return self;
            }
        });
        _.extend(fn.prototype, Backbone.Events, {
            type: fn,
            toString: function() {
                if (cssGeneartor)
                    return cssGeneartor(this, keys);
                var self = this, args = [];
                _.each(parameters, function(parameter, i) {
                    args.push(self[keys[i]].toFixed(6) + units);
                });
                return name + "(" + args.join(", ") + ")";
            },
            blend: function(percent, other) {
                var result = new fn();
                var self = this;
                _.each(parameters, function(parameter, i) {
                    var currentValue = self[keys[i]];
                    if (_.isString(currentValue)) {
                        result[keys[i]] = currentValue;
                        return;
                    }
                    result[keys[i]] = currentValue * (1 - percent) + other[keys[i]] * percent;
                });
                return result;
            },
            multiply: function(percent) {
                var result = new fn();
                var self = this;
                _.each(parameters, function(parameter, i) {
                    result[keys[i]] = self[keys[i]] * percent;
                });
                return result;
            },
            clone: function() {
                var result = new fn(), self = this;
                _.each(parameters, function(parameter, i) {
                    result[keys[i]] = self[keys[i]];
                });
                return result;
            },
            _onValueChanged: function() {
                this.trigger("change");
            }
        });
        _.each(parameters, function(parameter, i) {
            fn.prototype["set" + _.string.capitalize(parameter)] = function(value) {
                if (value == this[keys[i]])
                    return this;
                this[keys[i]] = value;
                this._onValueChanged();
                return this;
            };
            fn.prototype["add" + _.string.capitalize(parameter)] = function(value) {
                this[keys[i]] += value;
                this._onValueChanged();
                return this;
            };
            fn.prototype["mul" + _.string.capitalize(parameter)] = function(value) {
                this[keys[i]] *= value;
                this._onValueChanged();
                return this;
            };
            fn.prototype[parameter] = function() {
                return this[keys[i]];
            };
        });
        return fn;
    }

    var Filters = {
        blur: generateFunction("blur", "radius", "px"),
        brightness: generateFunction("brightness", "intensity", "%"),
        grayscale: generateFunction("grayscale", "intensity", "%"),
        opacity: generateFunction("opacity", "intensity", "%"),
        dropShadow: generateFunction("drop-shadow", "x y radius color", function(fn) {
            return "drop-shadow(" + fn._x.toFixed(6) + "px " + fn._y.toFixed(6) + "px " + fn._radius.toFixed(6) + "px rgba(0, 0, 0, " + 
                fn._color + "))";
        })
    };

    var Filter = function() {
        if (!(this instanceof Filter))
            return new Filter();
        this._data = [];
    };

    _.extend(Filter.prototype, Backbone.Events, {
        search: function(type) {
            if (_.isString(type))
                type = Filters[type];
            var data = this._data;
            for (var i = 0; i < data.length; ++i)
                if (data[i].type === type)
                    return data[i];
            return null;
        },

        get: function(type) {
            if (_.isString(type))
                type = Filters[type];
            var fn = this.search(type);
            if (!fn) {
                fn = type.create();
                this.append(fn);
            }
            return fn;
        },

        isEmpty: function() {
            return !this._data.length;
        },

        append: function(fn) {
            fn.on("change", this._onFunctionValueChange, this);
            this._data.push(fn);
            this._onFunctionValueChange();
            return this;
        },

        insert: function(fn, i) {
            fn.on("change", this._onFunctionValueChange, this);
            this._data.splice(i, 0, fn);
            this._onFunctionValueChange();
            return this;
        },

        remove: function(fn) {
            var index = this._data.indexOf(fn);
            if (index == -1)
                return this;
            fn.off("change", this._onFunctionValueChange, this);
            this._data.splice(i, 1);
            this._onFunctionValueChange();
            return this;
        },

        clear: function() {
            _.each(this._data, function(fn) {
                fn.off("change", self._onFunctionValueChange, self);
            });
            this._data = [];
            this._onFunctionValueChange();
            return this;
        },

        set: function(other) {
            var self = this;
            _.each(this._data, function(fn) {
                fn.off("change", self._onFunctionValueChange, self);
            });
            this._data = [];
            _.each(other._data, function(fn) {
                self.append(fn.clone());
            });
            this._onFunctionValueChange();
        },

        take: function(other) {
            var self = this;
            _.each(this._data, function(fn) {
                fn.off("change", self._onFunctionValueChange, self);
            });
            this._data = other._data;
            other._data = [];
            _.each(this._data, function(fn) {
                fn.off("change", other._onFunctionValueChange, other);
                fn.on("change", self._onFunctionValueChange, self);
            });
            other._onFunctionValueChange();
            this._onFunctionValueChange();
        },

        toString: function() {
            return this._data.join(" ");
        },

        toMatrix: function() {
            var matrix = Matrix.I(4);
            _.each(this._data, function(fn) {
                matrix = matrix.multiply(fn.toMatrix());
            });
            return matrix;
        },

        toMatrix3d: function() {
            return Filter.matrix3d.fromMatrix(this.toMatrix());
        },

        _onFunctionValueChange: function() {
            this.trigger("change");
        },

        clone: function() {
            var filter = new Filter();
            _.each(this._data, function(fn) {
                filter.append(fn.clone());
            });
            return filter;
        },

        canBlendFunctionsWith: function(other) {
            if (other._data.length != this._data.length)
                return false;
            return _.every(this._data, function(fn, i) {
                return fn.type === other._data[i].type;
            });
        },

        _fromZeroBlend: function(percent, other) {
            var filter = new Filter();
            _.each(other._data, function(fn, i) {
                filter.append(fn.multiply(percent));
            });
            return filter;
        },

        _toZeroBlend: function(percent) {
            var filter = new Filter();
            _.each(this._data, function(fn, i) {
                filter.append(fn.multiply(percent));
            });
            return filter;
        },

        blend: function(percent, other) {
            if (!this._data.length)
                return this._fromZeroBlend(percent, other);
            if (!other._data.length)
                return this._toZeroBlend(1 - percent);
            var filter = new Filter();
            if (this.canBlendFunctionsWith(other)) {
                _.each(this._data, function(fn, i) {
                    filter.append(fn.blend(percent, other._data[i]));
                });
            } else {
                // no alternative?
            }
            return filter;
        },

        concat: function(other) {
            var filter = new Filter();
            _.each(this._data, function(fn) {
                filter.append(fn);
            });
            _.each(other._data, function(fn) {
                filter.append(fn);
            });
            return filter;
        }
    });

    function injectCSSFilterShorthand(name, type) {
        Filter.prototype[name] = function() {
            var fn = type.create.apply(null, Array.prototype.slice.call(arguments));
            this.append(fn);
            return this;
        };
    }

    _.extend(Filter, Filters, {
        registerCustomFilter: function(name, parameters, cssGenerator) {
            var type = Filters[name] = generateFunction(name, parameters, cssGenerator);
            injectCSSFilterShorthand(name, type);
            return type;
        },
        createCustomFilterGenerator: customFilterGenerator,

        // FIXME: Using the PrefixFree.prefixProperty as a workaround for the the 
        // "filter" property issue in PrefixFree & WebKit.
        // https://github.com/LeaVerou/prefixfree/issues/76
        propertyName: PrefixFree.prefixProperty("filter"),
        camelCasePropertyName: PrefixFree.prefixProperty("filter", true)
    });

    function detectFilterSupport(filter, checker) {
        var style = document.createElement("div").style;
        style[Filter.camelCasePropertyName] = filter;
        var value = style[Filter.camelCasePropertyName];
        return value ? checker.test(value) : false;
    }
    Filter.supportsCustomFilters = detectFilterSupport("custom(url(empty))", /^custom\(/);

    _.each(Filters, function(type, name) {
        injectCSSFilterShorthand(name, type);
    });

    return Filter;

});