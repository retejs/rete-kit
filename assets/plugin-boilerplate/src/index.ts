import { BaseSchemes, NodeEditor, Root, Scope } from 'rete'

export class {{namespace}}<Schemes extends BaseSchemes> extends Scope<never, [Root<Schemes>]> {
    constructor() {
        super('{{id}}')
    }

    setParent(scope: Scope<Root<Schemes>>): void {
        super.setParent(scope)

        const editor = this.parentScope<NodeEditor<Schemes>>(NodeEditor)

        console.log('Rete.js plugin boilerplate installed', { editor })
    }
}
