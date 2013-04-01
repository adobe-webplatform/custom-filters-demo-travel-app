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

    function matrixKeyGenerator(parameters) {
        return _.map(parameters, function(name, i) {
            return i;
        });
    }

    function generateFunction(name, parameters, units, is3DTransform, keysGenerator) {
        if (!_.isArray(parameters))
            parameters = parameters.split(" ");
        var keys = keysGenerator ? keysGenerator(parameters) : _.map(parameters, function(name) {
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
            is3DTransform: is3DTransform,
            toString: function() {
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
                    result[keys[i]] = self[keys[i]] * (1 - percent) + other[keys[i]] * percent;
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

    var Transforms = {
        rotate: generateFunction("rotate", "angle", "deg", false),
        rotateX: generateFunction("rotateX", "angle", "deg", true),
        rotateY: generateFunction("rotateY", "angle", "deg", true),
        rotateZ: generateFunction("rotateZ", "angle", "deg", false),
        translate: generateFunction("translate", "x y", "px", false),
        translateX: generateFunction("translateX", "x", "px", false),
        translateY: generateFunction("translateY", "y", "px", false),
        translateZ: generateFunction("translateZ", "z", "px", true),
        translate3d: generateFunction("translate3d", "x y z", "px", true),
        scale: generateFunction("scale", "x y", "", false),
        perspective: generateFunction("perspective", "depth", "", true),
        matrix: generateFunction("matrix", "a b c d e f", "", false, matrixKeyGenerator),
        matrix3d: generateFunction("matrix3d",
            "a11 a21 a31 a41 a21 a22 a23 a24 a31 a32 a33 a34 a41 a42 a43 a44", "",
            true, matrixKeyGenerator)
    };

    var Transform = function() {
        if (!(this instanceof Transform))
            return new Transform();
        this._data = [];
    };

    _.extend(Transform.prototype, Backbone.Events, {
        search: function(type) {
            if (_.isString(type))
                type = Transforms[type];
            var data = this._data;
            for (var i = 0; i < data.length; ++i)
                if (data[i].type === type)
                    return data[i];
            return null;
        },

        get: function(type) {
            if (_.isString(type))
                type = Transforms[type];
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
            if (!this._data.length)
                return;
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

        has3DTransforms: function() {
            return _.some(this._data, function(fn, i) {
                return fn.is3DTransform;
            });
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
            return Transform.matrix3d.fromMatrix(this.toMatrix());
        },

        _onFunctionValueChange: function() {
            this.trigger("change");
        },

        clone: function() {
            var transform = new Transform();
            _.each(this._data, function(fn) {
                transform.append(fn.clone());
            });
            return transform;
        },

        canBlendFunctionsWith: function(other) {
            if (other._data.length != this._data.length)
                return false;
            return _.every(this._data, function(fn, i) {
                return fn.type === other._data[i].type;
            });
        },

        _fromZeroBlend: function(percent, other) {
            var transform = new Transform();
            _.each(other._data, function(fn, i) {
                transform.append(fn.multiply(percent));
            });
            return transform;
        },

        _toZeroBlend: function(percent) {
            var transform = new Transform();
            _.each(this._data, function(fn, i) {
                transform.append(fn.multiply(percent));
            });
            return transform;
        },

        blend: function(percent, other) {
            if (!this._data.length)
                return this._fromZeroBlend(percent, other);
            if (!other._data.length)
                return this._toZeroBlend(1 - percent);
            var transform = new Transform();
            if (this.canBlendFunctionsWith(other)) {
                _.each(this._data, function(fn, i) {
                    transform.append(fn.blend(percent, other._data[i]));
                });
            } else {
                var matrix = new Transforms.matrix3d();
                matrix.fromMatrix(this.toMatrix().multiply(percent)
                    .add(other.toMatrix().multiply(1 - percent)));
                transform.append(matrix);
            }
            return transform;
        },

        concat: function(other) {
            var transform = new Transform();
            _.each(this._data, function(fn) {
                transform.append(fn);
            });
            _.each(other._data, function(fn) {
                transform.append(fn);
            });
            return transform;
        }
    });
    
    _.extend(Transform, Transforms, {
        rads: function(degs) {
            return degs * Math.PI / 180;
        },

        degs: function(rads) {
            return rads * 180 / Math.PI;
        }
    });

    _.each(Transforms, function(type, name) {
        Transform.prototype[name] = function() {
            var fn = type.create.apply(null, Array.prototype.slice.call(arguments));
            this.append(fn);
            return this;
        };
    });

    function rotationMatrix3d(rad, x, y, z) {
        var halfRad = rad / 2,
            radSin = Math.sin(halfRad),
            sc = radSin * Math.cos(halfRad),
            sq = radSin * radSin;
        return Matrix.create([
            [1 - 2 * (y * y + z * z) * sq, 
                2 * (x * y * sq - z * sc),
                    2 * (x * z * sq + y * sc), 0],
            [2 * (x * y * sq + z * sc),
                1 - 2 * (x * x + z * z) * sq,
                    2 * (y * z * sq - x * sq), 0],
            [2 * (x * z *sq - y * sc),
                2 * (y * z * sq + x * sc),
                    1 - 2 * (x * x + y * y) * sq, 0],
            [0, 0, 0, 1]
        ]);
    }

    function rotationMatrixAxis(rad, axis) {
        return rotationMatrix3d(rad, axis[0], axis[1], axis[2]);
    }

    _.extend(Transform.rotate.prototype, {
        vector: [0, 0, 1],
        toMatrix: function() {
            return rotationMatrixAxis(Transform.rads(this.angle()), this.vector);
        }
    });

    _.extend(Transform.rotateX.prototype, {
        vector: [1, 0, 0],
        toMatrix: function() {
            return rotationMatrixAxis(Transform.rads(this.angle()), this.vector);
        }
    });

    _.extend(Transform.rotateY.prototype, {
        vector: [0, 1, 0],
        toMatrix: function() {
            return rotationMatrixAxis(Transform.rads(this.angle()), this.vector);
        }
    });

    _.extend(Transform.rotateZ.prototype, {
        vector: [0, 0, 1],
        toMatrix: function() {
            return rotationMatrixAxis(Transform.rads(this.angle()), this.vector);
        }
    });

    _.extend(Transform.translate.prototype, {
        toMatrix: function() {
            return Matrix.create([
                [1, 0, 0, this.x()],
                [0, 1, 0, this.y()],
                [0, 0, 1, 0],
                [0, 0, 0, 1]
            ]);
        }
    });

    _.extend(Transform.translateX.prototype, {
        toMatrix: function() {
            return Matrix.create([
                [1, 0, 0, this.x()],
                [0, 1, 0, 0],
                [0, 0, 1, 0],
                [0, 0, 0, 1]
            ]);
        }
    });

    _.extend(Transform.translateY.prototype, {
        toMatrix: function() {
            return Matrix.create([
                [1, 0, 0, 0],
                [0, 1, 0, this.y()],
                [0, 0, 1, 0],
                [0, 0, 0, 1]
            ]);
        }
    });

    _.extend(Transform.translateZ.prototype, {
        toMatrix: function() {
            return Matrix.create([
                [1, 0, 0, 0],
                [0, 1, 0, 0],
                [0, 0, 1, this.z()],
                [0, 0, 0, 1]
            ]);
        }
    });

    _.extend(Transform.translate3d.prototype, {
        toMatrix: function() {
            return Matrix.create([
                [1, 0, 0, this.x()],
                [0, 1, 0, this.y()],
                [0, 0, 1, this.z()],
                [0, 0, 0, 1]
            ]);
        }
    });

    _.extend(Transform.perspective.prototype, {
        toMatrix: function() {
            return Matrix.create([
                [1, 0, 0, 0],
                [0, 1, 0, 0],
                [0, 0, 1, 0],
                [0, 0, -1 / this.depth(), 1]
            ]);
        }
    });

    _.extend(Transform.scale.prototype, {
        toMatrix: function() {
            return Matrix.create([
                [this.x(), 0, 0, 0],
                [0, this.y(), 0, 0],
                [0, 0, 1, 0],
                [0, 0, 0, 1]
            ]);
        }
    });

    _.extend(Transform.matrix3d.prototype, {
        toMatrix: function() {
            return Matrix.create([
                [this.a(), this.c(), 0, this.e()],
                [this.b(), this.d(), 0, this.f()],
                [0, 0, 1, 0],
                [0, 0, 0, 1]
            ]);
        },
        fromMatrix: function(m) {
            this.setA(m.e(1, 1))
                .setB(m.e(2, 1))
                .setC(m.e(1, 2))
                .setD(m.e(2, 2))
                .setE(m.e(1, 4))
                .setF(m.e(2, 4));
            return this;
        }
    });

    Transform.matrix.fromMatrix = function(matrix) {
        var fn = new Transform.matrix();
        fn.fromMatrix(matrix);
        return fn;
    };

    _.extend(Transform.matrix3d.prototype, {
        toMatrix: function() {
            return Matrix.create([
                [this.a11(), this.a12(), this.a13(), this.a14()],
                [this.a21(), this.a22(), this.a23(), this.a24()],
                [this.a31(), this.a32(), this.a33(), this.a34()],
                [this.a41(), this.a42(), this.a43(), this.a44()]
            ]);
        },
        fromMatrix: function(m) {
            var index = 0, changed = false;
            for (var j = 1; j <= 4; ++j) {
                for (var i = 1; i <= 4; ++i, index++) {
                    var value = m.e(i, j);
                    if (this[index] == value)
                        continue;
                    this[index] = value;
                    changed = true;
                }
            }
            if (this.changed)
                this._onValueChanged();
            return this;
        }
    });

    Transform.matrix3d.fromMatrix = function(matrix) {
        var fn = new Transform.matrix3d();
        fn.fromMatrix(matrix);
        return fn;
    };


    return Transform;

});