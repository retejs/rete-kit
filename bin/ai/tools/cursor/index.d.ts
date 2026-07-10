import { InstructionStrategy } from '../../strategies';
import { BaseTool } from '../base';
export declare class CursorTool extends BaseTool {
    constructor();
    protected getStrategy(): InstructionStrategy | undefined;
}
