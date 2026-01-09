import { InstructionStrategy } from '../../strategies';
import { BaseTool } from '../base';
export declare class GithubTool extends BaseTool {
    constructor();
    protected getStrategy(): InstructionStrategy | undefined;
}
