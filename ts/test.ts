/**
 * 
 */
class Animal {
    private name: string;
    /**
     * 
     * @param theName 
     */
    constructor(theName: string) { this.name = theName; }
}

console.log(new Animal("Cat"))

class Octopus {
    readonly name: string;
    readonly numberOfLegs: number = 8;
    constructor (theName: string) {
        this.name = theName;
    }
}
let dad = new Octopus("Man with the 8 strong legs");
//dad.name="fdf"
console.log(dad,dad.name)