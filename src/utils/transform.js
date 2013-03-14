define(function() {

    function matrixKeyGenerator(parameters) {
        return _.map(parameters, function(name, i) {
            return i;
        });
    }

    function generateFunction(name, parameters, units, keysGenerator) {
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
            toString: function() {
                var self = this, args = [];
                _.each(parameters, function(parameter, i) {
                    args.push(self["_" + parameter] + units);
                });
                return name + "(" + args.join(", ") + ")";
            },
            blend: function(other, percent) {
                var result = new fn();
                var self = this;
                _.each(parameters, function(parameter, i) {
                    result[keys[i]] = self[keys[i]] * (1 - percent) + other[keys[i]] * percent;
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
                    return;
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
        rotate: generateFunction("rotate", "angle", "deg"),
        rotateX: generateFunction("rotateX", "angle", "deg"),
        rotateY: generateFunction("rotateY", "angle", "deg"),
        rotateZ: generateFunction("rotateZ", "angle", "deg"),
        translate: generateFunction("translate", "x y", "px"),
        translateX: generateFunction("translateX", "x", "px"),
        translateY: generateFunction("translateY", "y", "px"),
        translateZ: generateFunction("translateZ", "z", "px"),
        translate3d: generateFunction("translate3d", "x y z", "px"),
        scale: generateFunction("scale", "x y", ""),
        perspective: generateFunction("perspective", "depth", ""),
        matrix: generateFunction("matrix", "a b c d e f", "px", matrixKeyGenerator),
        matrix3d: generateFunction("matrix", 
            "a11 a21 a31 a41 a21 a22 a23 a24 a31 a32 a33 a34 a41 a42 a43 a44", "px", matrixKeyGenerator)
    };

    var Transform = function() {
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

        set: function(other) {
            var self = this;
            _.each(this._data, function(fn) {
                fn.off("change", self._onFunctionValueChange, self);
            });
            _.each(other._data, function(fn) {
                self.append(fn.clone());
            });
        },

        toString: function() {
            return this._data.join(" ");
        },

        _onFunctionValueChange: function() {
            this.trigger("change");
        }
    });
    
    _.extend(Transform, Transforms, {
        rads: function(degs) {
            return rads * Math.PI / 180;
        },

        degs: function(rads) {
            return degs * 180 / Math.PI;
        }
    });

    _.each(Transforms, function(type, name) {
        Transform.prototype[name] = function() {
            var fn = type.create.apply(null, Array.prototype.slice.call(arguments));
            this.append(fn);
            return this;
        };
    });

    _.extend(Transform.rotate.prototype, {
        toMatrix: function() {
            return Matrix.Rotation(Transform.rads(this.degs()));
        }
    });

    _.extend(Transform.rotateX.prototype, {
        toMatrix: function() {
            return Matrix.RotationX(Transform.rads(this.degs()));
        }
    });

    _.extend(Transform.rotateY.prototype, {
        toMatrix: function() {
            return Matrix.RotationY(Transform.rads(this.degs()));
        }
    });

    _.extend(Transform.rotateZ.prototype, {
        toMatrix: function() {
            return Matrix.RotationZ(Transform.rads(this.degs()));
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


    return Transform;

});