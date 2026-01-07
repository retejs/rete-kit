import { InstructionData } from '../filesystem'

export type F = Pick<InstructionData, 'content' | 'file'>

export interface InstructionStrategy {
  transform(instructions: F[]): F[]
}
