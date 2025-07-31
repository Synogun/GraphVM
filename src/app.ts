// import { Config } from './graphConfig';
import { Graph } from './graph/graph.js';
import { UserInterface } from './userInterface/userInterface.js';

export class App {

    public graph;
    public userInterface;
    // private logger = new Logger(config), // TODO: Implement logger

    constructor(graph?: Graph, userInterface?: UserInterface) {
        this.graph = graph ?? new Graph({ containerId: 'graph' });
        this.userInterface = userInterface ?? new UserInterface(this.graph);
    }

    init() {
        this.userInterface.init();
    }
}
