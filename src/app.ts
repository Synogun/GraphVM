// import { Config } from './graphConfig';
import { Graph } from './graph.js';
import { UserInterface } from './userInterface.js';

export class App {

    public graph;
    public userInterface;
    // private logger = new Logger(config), // TODO: Implement logger

    constructor() {
        this.graph = new Graph({ containerId: 'graph' });
        this.userInterface = new UserInterface(this.graph);
    }

    init() {
        this.userInterface.init();
    }
}
