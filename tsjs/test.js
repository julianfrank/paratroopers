"use strict";
/**
 *
 */
var Animal = /** @class */ (function () {
    /**
     *
     * @param theName
     */
    function Animal(theName) {
        this.name = theName;
    }
    return Animal;
}());
console.log(new Animal("Cat"));
var Octopus = /** @class */ (function () {
    function Octopus(theName) {
        this.numberOfLegs = 8;
        this.name = theName;
    }
    return Octopus;
}());
var dad = new Octopus("Man with the 8 strong legs");
//dad.name="fdf"
console.log(dad, dad.name);
