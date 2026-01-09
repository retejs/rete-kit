import { InstructionStrategy } from '../../strategies';
import { BaseTool } from '../base';
export declare class WindsurfTool extends BaseTool {
    constructor();
    protected getStrategy(): InstructionStrategy | undefined;
}
