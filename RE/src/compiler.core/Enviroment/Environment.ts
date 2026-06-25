export class Enviroment {
    // 1. Here we save all the variables there user declared
    // Map is like a objet in JS, but more efficent
    // Save couples key fir example: Value (example : 'x' : 5)

    private record: Map<string, any> = new Map();

    // 2. Here we save the reference of the Environment of the block from outside (the father)
    private parent : Enviroment | null = null;

    // 2. The constructor: Is the function thats execute when you create a new block
    // If you dont pass it on a father, default is null
    constructor(parent: Enviroment | null = null)
    {
        this.parent = parent;
    }

    // 4. METHOD TO CREATE VARIABLES (Example: int = 5;)
    public define(name : string, value : any) : void {
        this.record.set(name, value);
    }

    // 5. METHOD TO FIND A VALUE OF SOME VAARIABLE
    public lookup(name : string): any { 

        // The variable is in this actuall block?
        if(this.record.has(name)) {
            return this.record.get(name);
        }

        // If not here, there had a father block?
        if(this.parent !== null){
            return this.parent.lookup(name);
        }

        // If not here and neither in any father the variable dont exits...
        throw new Error(`Variable not defined: '${name}'`);
    }

    public assign(name : string, value : any) : void {
        
        // If the variable alredy existed in this part of block, we update
        if(this.record.has(name)) {
            this.record.set(name, value);
            return;
        }

        // If its not here but they have a fathers block, we lets try update the father
        if(this.parent !== null){
            this.parent.assign(name, value);
            return;
        }

        throw new Error(`Variable not defined: '${name}'`);
    }
}