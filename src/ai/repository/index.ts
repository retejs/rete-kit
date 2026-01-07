import { isTTY } from '../../shared/tty'
import { select } from '../../shared/inquirer'

export interface SelectionChoice<T> {
  name: string
  value: T
}

export interface Identifiable {
  getName(): string
}

export class Repository<T extends Identifiable> {
  private itemsMap = new Map<string, T>()

  constructor(
    private type: string,
    private items: T[]
  ) {
    items.forEach(item => {
      this.itemsMap.set(item.getName(), item)
    })
  }

  async select(selectedName?: string): Promise<T> {
    if (selectedName) {
      return this.validate(selectedName)
    }

    // In non-interactive mode (no TTY), require the selection to be provided
    if (!isTTY()) {
      const available = this.items.map(item => item.getName()).join(', ')
      throw new Error(`No ${this.type} specified. Available ${this.type}s: ${available}. Use --${this.type} option in non-interactive mode.`)
    }

    return await this.prompt()
  }

  private validate(selectedName: string): T {
    const item = this.itemsMap.get(selectedName)

    if (!item) {
      throw this.createNotFoundError(selectedName)
    }

    return item
  }

  private async prompt(): Promise<T> {
    const choices: SelectionChoice<T>[] = this.items.map(item => ({
      name: item.getName(),
      value: item
    }))

    const selectedItem = await select(`Select a ${this.type}:`, choices)

    if (!selectedItem) {
      throw new Error(`No ${this.type} selected`)
    }

    return selectedItem
  }

  private createNotFoundError(itemName: string): Error {
    const available = this.items.map(item => item.getName()).join(', ')

    return new Error(`Invalid ${this.type} "${itemName}". Available ${this.type}s: ${available}`)
  }
}
