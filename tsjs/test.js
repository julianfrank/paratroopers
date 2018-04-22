"use strict";
/**
 *
 */
class Animal {
    /**
     *
     * @param theName
     */
    constructor(theName) { this.name = theName; }
}
console.log(new Animal("Cat"));
class Octopus {
    constructor(theName) {
        this.numberOfLegs = 8;
        this.name = theName;
    }
}
let dad = new Octopus("Man with the 8 strong legs");
//dad.name="fdf"
console.log(dad, dad.name);
