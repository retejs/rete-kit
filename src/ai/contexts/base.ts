export interface InstructionFile {
  filename: string
  title: string
}

export interface Context {
  name: string
  description: string
  getInstructions(): InstructionFile[]
}
