import { InstructionStrategy } from '../../strategies';
import { BaseTool } from '../base';
export declare class AmazonQTool extends BaseTool {
    constructor();
    protected getStrategy(): InstructionStrategy | undefined;
}
