// Created by: Arturo Herrera O.
class Controller {

    amountMen : any = document.getElementById("amountMen");
    amountWoman : any = document.getElementById("amountWoman");
    amountChildren : any = document.getElementById("amountChildren");
    selectMeat : any = document.getElementById("meatSelect");
    meatList : Array<Meat>;
    constructor() {
        this.amountMen.value = 0;
        this.amountWoman.value = 0;
        this.amountChildren.value = 0;
        let biz = new SteakBiz();
        this.meatList = biz.getMeatList();
        this.selectMeat = document.getElementById("meatSelect");
        this.meatList.forEach(i =>{
            let opt = document.createElement('option');
            opt.value = i.id.toString();
            opt.text = i.name;
            this.selectMeat.appendChild(opt);
        });
    }

    calculateAmount()
    {
        this.amountMen  = document.getElementById("amountMen");
        this.amountWoman  = document.getElementById("amountWoman");
        this.amountChildren = document.getElementById("amountChildren");
        this.selectMeat = document.getElementById("meatSelect");
        let resultTotalMeat : any = document.getElementById("lblResultTotal");
        let resultTotalMeatType : any = document.getElementById("lblResultMeat");
        let resultTotalKindPerson : any = document.getElementById("lblResultTypePerson");
        let biz = new  SteakBiz();
        let men = this.amountMen.value;
        let woman = this.amountWoman.value;
        let children = this.amountChildren.value;
        let meatIdList : Array<number> = [];
        for (var i = 0; i < this.selectMeat.options.length; i++) {
            if(this.selectMeat.options[i].selected ==true){
                let value = this.selectMeat.options[i].value;
                meatIdList.push(parseInt(value));
                console.log(value);
            }
        }
        resultTotalMeat.textContent = biz.calculateTotalMeat(parseInt(men), parseInt(woman), parseInt(children), meatIdList);
        resultTotalMeatType.textContent = biz.calculateTotalMeatType(parseInt(men), parseInt(woman), parseInt(children), meatIdList);
        resultTotalKindPerson.textContent = biz.calculateTotalKindPerson(parseInt(men), parseInt(woman), parseInt(children), meatIdList);
    };
}

class SteakBiz {

    meatKindPersonList : Array<MeatKindPerson>;
    meatList : Array<Meat>;
    kindPersonList : Array<KindPerson>;

    constructor() {
        let loadData: LoadedData = new LoadedData();
        this.meatKindPersonList = loadData.getListMeatKindPerson();
        this.meatList = loadData.getListMeat();
        this.kindPersonList = loadData.getListKindPerson();
    }

    calculateTotalMeat(_menAmount: number, _womanAmount: number, _childrenAmount: number, _meatIdList: Array<number>) : string {
        var totalMeat: number = 0.0;
        _meatIdList.forEach( i => {
            // calculation men
            let totalMen: number = this.calculateQuantity(i, 1, _menAmount);
            // calculation woman
            let totalWoman: number = this.calculateQuantity(i, 2, _womanAmount);
            // calculation children
            let totalChildren: number = this.calculateQuantity(i, 3, _childrenAmount);
            totalMeat += totalMen + totalWoman + totalChildren;
        });

        let integer : number = Math.floor(totalMeat);
        let decimal : number = totalMeat % 1;
        let result: string = 'Total de carne: '+ integer + ' Kg';
        if (decimal > 0) {
            result = result + ' con ' + (Math.round(decimal * 10) * 100) + ' gramos';
        }

        return result;
    }

    calculateTotalMeatType(_menAmount: number, _womanAmount: number, _childrenAmount: number, _meatIdList: Array<number>) : string {
        let result: string = '';
        _meatIdList.forEach( i => {
            // calculation men
            let totalMen: number = this.calculateQuantity(i, 1, _menAmount);
            // calculation woman
            let totalWoman: number = this.calculateQuantity(i, 2, _womanAmount);
            // calculation children
            let totalChildren: number = this.calculateQuantity(i, 3, _childrenAmount);
            let totalMeat = totalMen + totalWoman + totalChildren;
            let meat: Meat = this.meatSearch(i);

            let integer : number = Math.floor(totalMeat);
            let decimal : number = totalMeat % 1;
            result += meat.name + ': '+ integer + ' Kg';
            if (decimal > 0) {
                result = result + ' con ' + (Math.round(decimal * 10) * 100) + ' gramos';
            }
            result += '\n';

        });

        return result;
    }

    calculateTotalKindPerson(_menAmount: number, _womanAmount: number, _childrenAmount: number, _meatIdList: Array<number>) : string {
        let result: string = '';
        let totalMen: number = 0;
        let totalWoman: number = 0;
        let totalChildren: number = 0;
        _meatIdList.forEach( i => {
            // calculation men
            totalMen += this.calculateQuantity(i, 1, _menAmount);
            // calculation woman
            totalWoman += this.calculateQuantity(i, 2, _womanAmount);
            // calculation children
            totalChildren += this.calculateQuantity(i, 3, _childrenAmount);
        });

        let kindPerson: KindPerson = this.kindPersonSearch(1);

        let integer : number = Math.floor(totalMen);
        let decimal : number = totalMen % 1;
        result += kindPerson.name + ': '+ integer + ' Kg';
        if (decimal > 0) {
            result = result + ' con ' + (Math.round(decimal * 10) * 100) + ' gramos';
        }
        result += '\n';

        kindPerson = this.kindPersonSearch(2);

        integer = Math.floor(totalWoman);
        decimal = totalWoman % 1;
        result += kindPerson.name + ': '+ integer + ' Kg';
        if (decimal > 0) {
            result = result + ' con ' + (Math.round(decimal * 10) * 100) + ' gramos';
        }
        result += '\n';

        kindPerson = this.kindPersonSearch(3);

        integer = Math.floor(totalChildren);
        decimal = totalChildren % 1;
        result += kindPerson.name + ': '+ integer + ' Kg';
        if (decimal > 0) {
            result = result + ' con ' + (Math.round(decimal * 10) * 100) + ' gramos';
        }
        result += '\n';

        return result;
    }

    calculateQuantityString(_meatId: number, _kindPersonID: number, _amount: number) : string {
        let loadData : LoadedData = new LoadedData();
        this.meatKindPersonList = loadData.getListMeatKindPerson();
        let meatKindPerson: MeatKindPerson;

        this.meatKindPersonList.forEach( i => {
            if (i.meat.id === _meatId && i.kindPerson.id === _kindPersonID) {
                meatKindPerson = i;
                let amountCalculation : number = (meatKindPerson.amount * _amount);
                let integer : number = Math.floor(amountCalculation);
                let decimal : number = amountCalculation % 1;
                let result: string = meatKindPerson.meat.name + ': '+ integer + ' Kg';
                if (decimal > 0) {
                    result = result + ' con ' + (Math.round(decimal * 10) * 100) + ' gramos';
                }

                return result;
            }
        });

        return "No se pudo Calcular el monto total de carne";
    }

    calculateQuantity(_meatId: number, _kindPersonID: number, _amount: number) : number {
        let loadData : LoadedData = new LoadedData();
        this.meatKindPersonList = loadData.getListMeatKindPerson();
        let meatKindPerson: any;

        this.meatKindPersonList.forEach( i => {
            if (i.meat.id === _meatId && i.kindPerson.id === _kindPersonID) {
                meatKindPerson = i;
            }
        });
        if (meatKindPerson)
            return (meatKindPerson.amount * _amount);
        else
            return 0;
    }

    meatSearch(_meatId: number) : Meat {
        let loadData : LoadedData = new LoadedData();
        this.meatList = loadData.getListMeat();
        let meat: Meat = new Meat(0, '', '');
        this.meatList.forEach( i => {
            if (i.id == _meatId) {
                meat = i;
                return meat;
            }
        });
        return meat;
    }

    kindPersonSearch(_kindPersonId: number) : KindPerson {
        let loadData : LoadedData = new LoadedData();
        this.kindPersonList = loadData.getListKindPerson();
        let kindPerson: KindPerson = new KindPerson(0, '');
        this.kindPersonList.forEach( i => {
            if (i.id == _kindPersonId) {
                kindPerson = i;
            }
        });
        return kindPerson;
    }

    getMeatList() : Array<Meat> {
        let loadData : LoadedData = new LoadedData();
        return loadData.getListMeat();
    }

    getKingPersonList() : Array<KindPerson> {
        let loadData : LoadedData = new LoadedData();
        return loadData.getListKindPerson();
    }

    getMeatKingPersonList() : Array<MeatKindPerson> {
        let loadData : LoadedData = new LoadedData();
        return loadData.getListMeatKindPerson();
    }
}


class LoadedData {

    getListMeat() : Array<Meat> {
        let meatList : Array<Meat>;
        meatList = [];

        let lowLoin : Meat = new Meat(1, 'Lomo Bajo', 'https://s3.amazonaws.com/academiadacarne/content/3751-maminha.png');
        let highLoin : Meat = new Meat(2, 'Lomo Alto', 'https://s3.amazonaws.com/academiadacarne/content/3751-maminha.png');
        let rib : Meat = new Meat(3, 'Costilla', 'https://s3.amazonaws.com/academiadacarne/content/3751-maminha.png');
        let skirt : Meat = new Meat(4, 'Falda', 'https://s3.amazonaws.com/academiadacarne/content/3751-maminha.png');

        meatList.push(lowLoin);
        meatList.push(highLoin);
        meatList.push(rib);
        meatList.push(skirt);
        return meatList;
    }


    getListKindPerson() : Array<KindPerson> {
        let kindPersonList : Array<KindPerson>;
        kindPersonList = [];
        let men : KindPerson = new KindPerson(1, 'Hombre');
        let woman : KindPerson = new KindPerson(2, "Mujer");
        let children : KindPerson = new KindPerson(3, "Niño");
        kindPersonList.push(men);
        kindPersonList.push(woman);
        kindPersonList.push(children);
        return kindPersonList;
    }


    getListMeatKindPerson() : Array<MeatKindPerson> {
        let meatKindPersonList : Array<MeatKindPerson>;
        meatKindPersonList = [];
        let men : KindPerson = new KindPerson(1, 'Hombre');
        let woman : KindPerson = new KindPerson(2, "Mujer");
        let children : KindPerson = new KindPerson(3, "Niño");

        let lowLoin : Meat = new Meat(1, 'Lomo Bajo', 'https://s3.amazonaws.com/academiadacarne/content/3751-maminha.png');
        let highLoin : Meat = new Meat(2, 'Lomo Alto', 'https://s3.amazonaws.com/academiadacarne/content/3751-maminha.png');
        let rib : Meat = new Meat(3, 'Costilla', 'https://s3.amazonaws.com/academiadacarne/content/3751-maminha.png');
        let skirt : Meat = new Meat(4, 'Falda', 'https://s3.amazonaws.com/academiadacarne/content/3751-maminha.png');

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
    }
}

class Meat {
    private _id: number;
    private _name: string;
    private _imageUrl: string;


    constructor(id: number, name: string, imageUrl: string) {
        this._id = id;
        this._name = name;
        this._imageUrl = imageUrl;
    }

    get id(): number {
        return this._id;
    }

    set id(value: number) {
        this._id = value;
    }

    get name(): string {
        return this._name;
    }

    set name(value: string) {
        this._name = value;
    }

    get imageUrl(): string {
        return this._imageUrl;
    }

    set imageUrl(value: string) {
        this._imageUrl = value;
    }
}

class KindPerson {
    private _id: number;
    private _name : string;


    constructor(id: number, name: string) {
        this._id = id;
        this._name = name;
    }


    get id(): number {
        return this._id;
    }

    set id(value: number) {
        this._id = value;
    }

    get name(): string {
        return this._name;
    }

    set name(value: string) {
        this._name = value;
    }


}

class MeatKindPerson {
    private _id: number;
    private _meat: Meat;
    private _kindPerson: KindPerson;
    private _amount: number;


    constructor(id: number, meat: Meat, kindPerson: KindPerson, amount: number) {
        this._id = id;
        this._meat = meat;
        this._kindPerson = kindPerson;
        this._amount = amount;
    }


    get id(): number {
        return this._id;
    }

    set id(value: number) {
        this._id = value;
    }

    get meat(): Meat {
        return this._meat;
    }

    set meat(value: Meat) {
        this._meat = value;
    }

    get kindPerson(): KindPerson {
        return this._kindPerson;
    }

    set kindPerson(value: KindPerson) {
        this._kindPerson = value;
    }

    get amount(): number {
        return this._amount;
    }

    set amount(value: number) {
        this._amount = value;
    }
}

let controller = new Controller();

