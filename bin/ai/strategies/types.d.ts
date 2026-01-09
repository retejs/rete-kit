import { InstructionData } from '../filesystem';
export type F = Pick<InstructionData, 'content' | 'file' | 'contextId' | 'title'>;
export interface InstructionStrategy {
    transform(instructions: F[]): F[];
}
