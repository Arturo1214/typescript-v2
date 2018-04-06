// Created by: Arturo Herrera O.
var Controller = /** @class */ (function () {
    function Controller() {
        var _this = this;
        this.amountMen = document.getElementById("amountMen");
        this.amountWoman = document.getElementById("amountWoman");
        this.amountChildren = document.getElementById("amountChildren");
        this.selectMeat = document.getElementById("meatSelect");
        this.amountMen.value = 0;
        this.amountWoman.value = 0;
        this.amountChildren.value = 0;
        var biz = new SteakBiz();
        this.meatList = biz.getMeatList();
        this.selectMeat = document.getElementById("meatSelect");
        this.meatList.forEach(function (i) {
            var opt = document.createElement('option');
            opt.value = i.id.toString();
            opt.text = i.name;
            _this.selectMeat.appendChild(opt);
        });
    }
    Controller.prototype.calculateAmount = function () {
        this.amountMen = document.getElementById("amountMen");
        this.amountWoman = document.getElementById("amountWoman");
        this.amountChildren = document.getElementById("amountChildren");
        this.selectMeat = document.getElementById("meatSelect");
        var resultContent = document.getElementById("result");
        while (resultContent.hasChildNodes()) {
            resultContent.removeChild(resultContent.lastChild);
        }
        var biz = new SteakBiz();
        var men = this.amountMen.value;
        var woman = this.amountWoman.value;
        var children = this.amountChildren.value;
        var meatIdList = [];
        for (var i = 0; i < this.selectMeat.options.length; i++) {
            if (this.selectMeat.options[i].selected == true) {
                var value = this.selectMeat.options[i].value;
                meatIdList.push(parseInt(value));
                console.log(value);
            }
        }
        var resultTotal = biz.calculateTotalMeat(parseInt(men), parseInt(woman), parseInt(children), meatIdList);
        var resultTotalMeatType = biz.calculateTotalMeatType(parseInt(men), parseInt(woman), parseInt(children), meatIdList);
        var resultTotalKindPerson = biz.calculateTotalKindPerson(parseInt(men), parseInt(woman), parseInt(children), meatIdList);
        if (resultTotal) {
            var elementLavel = document.createElement("label");
            elementLavel.textContent = 'Total de carne: ';
            elementLavel.style.fontWeight = 'bold';
            resultContent.appendChild(elementLavel);
            var elementLavelResultTotal = document.createElement("label");
            elementLavelResultTotal.textContent = resultTotal;
            resultContent.appendChild(elementLavelResultTotal);
            resultContent.appendChild(document.createElement("br"));
        }
        if (resultTotalMeatType) {
            resultTotalMeatType.forEach(function (i) {
                var data = i.split(':');
                if (data.length > 1) {
                    var elementLavel = document.createElement("label");
                    elementLavel.textContent = 'Total ' + data[0] + ': ';
                    elementLavel.style.fontWeight = 'bold';
                    resultContent.appendChild(elementLavel);
                    var elementLavelResult = document.createElement("label");
                    elementLavelResult.textContent = data[1];
                    resultContent.appendChild(elementLavelResult);
                    resultContent.appendChild(document.createElement("br"));
                }
            });
        }
        if (resultTotalKindPerson) {
            resultTotalKindPerson.forEach(function (i) {
                var data = i.split(':');
                if (data.length > 1) {
                    var elementLavel = document.createElement("label");
                    elementLavel.textContent = 'Total ' + data[0] + ': ';
                    elementLavel.style.fontWeight = 'bold';
                    resultContent.appendChild(elementLavel);
                    var elementLavelResult = document.createElement("label");
                    elementLavelResult.textContent = data[1];
                    resultContent.appendChild(elementLavelResult);
                    resultContent.appendChild(document.createElement("br"));
                }
            });
        }
    };
    ;
    return Controller;
}());
var SteakBiz = /** @class */ (function () {
    function SteakBiz() {
        var loadData = new LoadedData();
        this.meatKindPersonList = loadData.getListMeatKindPerson();
        this.meatList = loadData.getListMeat();
        this.kindPersonList = loadData.getListKindPerson();
    }
    SteakBiz.prototype.calculateTotalMeat = function (_menAmount, _womanAmount, _childrenAmount, _meatIdList) {
        var _this = this;
        var totalMeat = 0.0;
        _meatIdList.forEach(function (i) {
            // calculation men
            var totalMen = _this.calculateQuantity(i, 1, _menAmount);
            // calculation woman
            var totalWoman = _this.calculateQuantity(i, 2, _womanAmount);
            // calculation children
            var totalChildren = _this.calculateQuantity(i, 3, _childrenAmount);
            totalMeat += totalMen + totalWoman + totalChildren;
        });
        var integer = Math.floor(totalMeat);
        var decimal = totalMeat % 1;
        var result = integer + ' Kg';
        if (decimal > 0) {
            result = result + ' con ' + (Math.round(decimal * 10) * 100) + ' gramos';
        }
        return result;
    };
    SteakBiz.prototype.calculateTotalMeatType = function (_menAmount, _womanAmount, _childrenAmount, _meatIdList) {
        var _this = this;
        var result = [];
        _meatIdList.forEach(function (i) {
            // calculation men
            var totalMen = _this.calculateQuantity(i, 1, _menAmount);
            // calculation woman
            var totalWoman = _this.calculateQuantity(i, 2, _womanAmount);
            // calculation children
            var totalChildren = _this.calculateQuantity(i, 3, _childrenAmount);
            var totalMeat = totalMen + totalWoman + totalChildren;
            var meat = _this.meatSearch(i);
            var integer = Math.floor(totalMeat);
            var decimal = totalMeat % 1;
            if (totalMeat > 0) {
                var resultItem = meat.name + ': ' + integer + ' Kg';
                if (decimal > 0) {
                    resultItem = resultItem + ' con ' + (Math.round(decimal * 10) * 100) + ' gramos';
                }
                result.push(resultItem);
            }
        });
        return result;
    };
    SteakBiz.prototype.calculateTotalKindPerson = function (_menAmount, _womanAmount, _childrenAmount, _meatIdList) {
        var _this = this;
        var result = [];
        var totalMen = 0;
        var totalWoman = 0;
        var totalChildren = 0;
        _meatIdList.forEach(function (i) {
            // calculation men
            totalMen += _this.calculateQuantity(i, 1, _menAmount);
            // calculation woman
            totalWoman += _this.calculateQuantity(i, 2, _womanAmount);
            // calculation children
            totalChildren += _this.calculateQuantity(i, 3, _childrenAmount);
        });
        var resultItem = '';
        var kindPerson;
        var integer;
        var decimal;
        if (totalMen > 0) {
            kindPerson = this.kindPersonSearch(1);
            integer = Math.floor(totalMen);
            decimal = totalMen % 1;
            resultItem = kindPerson.name + ': ' + integer + ' Kg';
            if (decimal > 0) {
                resultItem = resultItem + ' con ' + (Math.round(decimal * 10) * 100) + ' gramos';
            }
            result.push(resultItem);
        }
        if (totalWoman > 0) {
            kindPerson = this.kindPersonSearch(2);
            integer = Math.floor(totalWoman);
            decimal = totalWoman % 1;
            resultItem = kindPerson.name + ': ' + integer + ' Kg';
            if (decimal > 0) {
                resultItem = resultItem + ' con ' + (Math.round(decimal * 10) * 100) + ' gramos';
            }
            result.push(resultItem);
        }
        if (totalChildren > 0) {
            kindPerson = this.kindPersonSearch(3);
            integer = Math.floor(totalChildren);
            decimal = totalChildren % 1;
            resultItem = kindPerson.name + ': ' + integer + ' Kg';
            if (decimal > 0) {
                resultItem = resultItem + ' con ' + (Math.round(decimal * 10) * 100) + ' gramos';
            }
            result.push(resultItem);
        }
        return result;
    };
    SteakBiz.prototype.calculateQuantity = function (_meatId, _kindPersonID, _amount) {
        var loadData = new LoadedData();
        this.meatKindPersonList = loadData.getListMeatKindPerson();
        var meatKindPerson;
        this.meatKindPersonList.forEach(function (i) {
            if (i.meat.id === _meatId && i.kindPerson.id === _kindPersonID) {
                meatKindPerson = i;
            }
        });
        if (meatKindPerson)
            return (meatKindPerson.amount * _amount);
        else
            return 0;
    };
    SteakBiz.prototype.meatSearch = function (_meatId) {
        var loadData = new LoadedData();
        this.meatList = loadData.getListMeat();
        var meat = new Meat(0, '', '');
        this.meatList.forEach(function (i) {
            if (i.id == _meatId) {
                meat = i;
                return meat;
            }
        });
        return meat;
    };
    SteakBiz.prototype.kindPersonSearch = function (_kindPersonId) {
        var loadData = new LoadedData();
        this.kindPersonList = loadData.getListKindPerson();
        var kindPerson = new KindPerson(0, '');
        this.kindPersonList.forEach(function (i) {
            if (i.id == _kindPersonId) {
                kindPerson = i;
            }
        });
        return kindPerson;
    };
    SteakBiz.prototype.getMeatList = function () {
        var loadData = new LoadedData();
        return loadData.getListMeat();
    };
    SteakBiz.prototype.getKingPersonList = function () {
        var loadData = new LoadedData();
        return loadData.getListKindPerson();
    };
    SteakBiz.prototype.getMeatKingPersonList = function () {
        var loadData = new LoadedData();
        return loadData.getListMeatKindPerson();
    };
    return SteakBiz;
}());
var LoadedData = /** @class */ (function () {
    function LoadedData() {
    }
    LoadedData.prototype.getListMeat = function () {
        var meatList;
        meatList = [];
        var lowLoin = new Meat(1, 'Lomo Bajo', 'https://s3.amazonaws.com/academiadacarne/content/3751-maminha.png');
        var highLoin = new Meat(2, 'Lomo Alto', 'https://s3.amazonaws.com/academiadacarne/content/3751-maminha.png');
        var rib = new Meat(3, 'Costilla', 'https://s3.amazonaws.com/academiadacarne/content/3751-maminha.png');
        var skirt = new Meat(4, 'Falda', 'https://s3.amazonaws.com/academiadacarne/content/3751-maminha.png');
        meatList.push(lowLoin);
        meatList.push(highLoin);
        meatList.push(rib);
        meatList.push(skirt);
        return meatList;
    };
    LoadedData.prototype.getListKindPerson = function () {
        var kindPersonList;
        kindPersonList = [];
        var men = new KindPerson(1, 'Hombre');
        var woman = new KindPerson(2, "Mujer");
        var children = new KindPerson(3, "Niño");
        kindPersonList.push(men);
        kindPersonList.push(woman);
        kindPersonList.push(children);
        return kindPersonList;
    };
    LoadedData.prototype.getListMeatKindPerson = function () {
        var meatKindPersonList;
        meatKindPersonList = [];
        var men = new KindPerson(1, 'Hombre');
        var woman = new KindPerson(2, "Mujer");
        var children = new KindPerson(3, "Niño");
        var lowLoin = new Meat(1, 'Lomo Bajo', 'https://s3.amazonaws.com/academiadacarne/content/3751-maminha.png');
        var highLoin = new Meat(2, 'Lomo Alto', 'https://s3.amazonaws.com/academiadacarne/content/3751-maminha.png');
        var rib = new Meat(3, 'Costilla', 'https://s3.amazonaws.com/academiadacarne/content/3751-maminha.png');
        var skirt = new Meat(4, 'Falda', 'https://s3.amazonaws.com/academiadacarne/content/3751-maminha.png');
        meatKindPersonList.push(new MeatKindPerson(1, lowLoin, men, 5.2));
        meatKindPersonList.push(new MeatKindPerson(2, lowLoin, woman, 4.3));
        meatKindPersonList.push(new MeatKindPerson(3, lowLoin, children, 3.3));
        meatKindPersonList.push(new MeatKindPerson(4, highLoin, men, 8.2));
        meatKindPersonList.push(new MeatKindPerson(5, highLoin, woman, 5.4));
        meatKindPersonList.push(new MeatKindPerson(6, highLoin, children, 2.5));
        meatKindPersonList.push(new MeatKindPerson(7, rib, men, 6.1));
        meatKindPersonList.push(new MeatKindPerson(8, rib, woman, 3.4));
        meatKindPersonList.push(new MeatKindPerson(9, rib, children, 1.1));
        meatKindPersonList.push(new MeatKindPerson(10, skirt, men, 4.3));
        meatKindPersonList.push(new MeatKindPerson(11, skirt, woman, 2.2));
        meatKindPersonList.push(new MeatKindPerson(12, skirt, children, 1.4));
        return meatKindPersonList;
    };
    return LoadedData;
}());
var Meat = /** @class */ (function () {
    function Meat(id, name, imageUrl) {
        this._id = id;
        this._name = name;
        this._imageUrl = imageUrl;
    }
    Object.defineProperty(Meat.prototype, "id", {
        get: function () {
            return this._id;
        },
        set: function (value) {
            this._id = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Meat.prototype, "name", {
        get: function () {
            return this._name;
        },
        set: function (value) {
            this._name = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Meat.prototype, "imageUrl", {
        get: function () {
            return this._imageUrl;
        },
        set: function (value) {
            this._imageUrl = value;
        },
        enumerable: true,
        configurable: true
    });
    return Meat;
}());
var KindPerson = /** @class */ (function () {
    function KindPerson(id, name) {
        this._id = id;
        this._name = name;
    }
    Object.defineProperty(KindPerson.prototype, "id", {
        get: function () {
            return this._id;
        },
        set: function (value) {
            this._id = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(KindPerson.prototype, "name", {
        get: function () {
            return this._name;
        },
        set: function (value) {
            this._name = value;
        },
        enumerable: true,
        configurable: true
    });
    return KindPerson;
}());
var MeatKindPerson = /** @class */ (function () {
    function MeatKindPerson(id, meat, kindPerson, amount) {
        this._id = id;
        this._meat = meat;
        this._kindPerson = kindPerson;
        this._amount = amount;
    }
    Object.defineProperty(MeatKindPerson.prototype, "id", {
        get: function () {
            return this._id;
        },
        set: function (value) {
            this._id = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MeatKindPerson.prototype, "meat", {
        get: function () {
            return this._meat;
        },
        set: function (value) {
            this._meat = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MeatKindPerson.prototype, "kindPerson", {
        get: function () {
            return this._kindPerson;
        },
        set: function (value) {
            this._kindPerson = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MeatKindPerson.prototype, "amount", {
        get: function () {
            return this._amount;
        },
        set: function (value) {
            this._amount = value;
        },
        enumerable: true,
        configurable: true
    });
    return MeatKindPerson;
}());
var controller = new Controller();
