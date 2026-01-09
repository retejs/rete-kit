"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Scopes = exports.Area3D = exports.Selectable = exports.Reroute = exports.Minimap = exports.ContextMenu = exports.Readonly = exports.Dataflow = exports.Arrange = exports.ZoomAt = exports.OrderNodes = exports.Lit = exports.Svelte = exports.Vue = exports.React = exports.Angular = exports.Default = void 0;
exports.validateFeatures = validateFeatures;
exports.getDependencies = getDependencies;
function ver(name, next) {
    return `${name}@${next
        ? 'next'
        : 2}`;
}
class Default {
    constructor(stack, next) {
        this.name = 'Default';
        this.mandatory = true;
        this.templateKeys = [];
        this.requiredDependencies = [];
        this.templateKeys.push(`stack-${stack}`);
        this.requiredDependencies.push(ver('rete', next), ver('rete-area-plugin', next), ver('rete-connection-plugin', next));
    }
}
exports.Default = Default;
class Angular {
    constructor(version, next) {
        this.name = 'Angular render';
        this.templateKeys = ['angular-render'];
        this.requiredDependencies = [];
        if (version !== null)
            this.templateKeys.push(`angular${version}`);
        this.requiredDependencies.push(`@angular/elements@${version}`, ver('rete-render-utils', next), ver('rete-angular-plugin', next));
    }
}
exports.Angular = Angular;
class React {
    constructor(version, stack, next) {
        this.name = 'React render';
        this.templateKeys = ['react-render'];
        this.requiredDependencies = [
            'styled-components@5',
            '@types/styled-components@5'
        ];
        this.templateKeys.push(`react${version}`);
        this.requiredDependencies.push(ver('rete-render-utils', next), ver('rete-react-plugin', next));
        if (stack !== 'react') {
            this.requiredDependencies.push(`react@${version}`, `react-dom@${version}`, `@types/react-dom@${version}`);
        }
    }
}
exports.React = React;
class Vue {
    constructor(version, next) {
        this.name = 'Vue render';
        this.templateKeys = ['vue-render'];
        this.requiredDependencies = ['sass-loader', 'sass'];
        this.templateKeys.push(`vue${version}`);
        this.requiredDependencies.push(ver('rete-render-utils', next), ver('rete-vue-plugin', next));
    }
}
exports.Vue = Vue;
class Svelte {
    constructor(version, next) {
        this.name = 'Svelte render';
        this.templateKeys = ['svelte-render'];
        this.requiredDependencies = ['sass'];
        this.templateKeys.push(`svelte${version}`);
        this.requiredDependencies.push(ver('rete-render-utils', next), ver('rete-svelte-plugin', next));
    }
}
exports.Svelte = Svelte;
class Lit {
    constructor(version, next) {
        this.name = 'Lit render';
        this.templateKeys = ['lit-render'];
        this.requiredDependencies = [];
        this.templateKeys.push(`lit${version}`);
        this.requiredDependencies.push(ver('rete-render-utils', next), ver('@retejs/lit-plugin', next));
    }
}
exports.Lit = Lit;
class OrderNodes {
    constructor() {
        this.name = 'Order nodes';
        this.templateKeys = ['import-area-extensions', 'order-nodes'];
    }
}
exports.OrderNodes = OrderNodes;
class ZoomAt {
    constructor() {
        this.name = 'Zoom at';
        this.templateKeys = ['import-area-extensions', 'zoom-at'];
    }
}
exports.ZoomAt = ZoomAt;
class Arrange {
    constructor(next) {
        this.name = 'Auto arrange';
        this.templateKeys = ['arrange', 'sizes'];
        this.requiredDependencies = [
            'elkjs',
            'web-worker'
        ];
        this.requiredDependencies.push(ver('rete-auto-arrange-plugin', next));
    }
}
exports.Arrange = Arrange;
class Dataflow {
    constructor(next) {
        this.name = 'Dataflow engine';
        this.templateKeys = ['dataflow'];
        this.requiredDependencies = [];
        this.requiredDependencies.push(ver('rete-engine', next));
    }
}
exports.Dataflow = Dataflow;
class Readonly {
    constructor(next) {
        this.name = 'Readonly';
        this.templateKeys = ['readonly'];
        this.requiredDependencies = [];
        this.requiredDependencies.push(ver('rete-readonly-plugin', next));
    }
}
exports.Readonly = Readonly;
class ContextMenu {
    constructor(next) {
        this.name = 'Context menu';
        this.templateKeys = ['context-menu'];
        this.requiredDependencies = [];
        this.requiredDependencies.push(ver('rete-context-menu-plugin', next));
    }
}
exports.ContextMenu = ContextMenu;
class Minimap {
    constructor(next) {
        this.name = 'Minimap';
        this.templateKeys = ['minimap', 'sizes'];
        this.requiredDependencies = [];
        this.requiredDependencies.push(ver('rete-minimap-plugin', next));
    }
}
exports.Minimap = Minimap;
class Reroute {
    constructor(next) {
        this.name = 'Reroute';
        this.templateKeys = ['reroute'];
        this.requiredDependencies = [];
        this.requiredDependencies.push(ver('rete-connection-reroute-plugin', next));
    }
}
exports.Reroute = Reroute;
class Selectable {
    constructor() {
        this.name = 'Selectable nodes';
        this.templateKeys = ['import-area-extensions', 'selectable'];
    }
}
exports.Selectable = Selectable;
class Area3D {
    constructor(typings, next) {
        this.name = '3D';
        this.mandatory = true;
        this.templateKeys = [];
        this.requiredDependencies = [];
        const version = '0.156';
        if (typings)
            this.requiredDependencies.push(`@types/three@${version}`);
        this.requiredDependencies.push(ver('rete-area-3d-plugin', next), `three@${version}`);
    }
}
exports.Area3D = Area3D;
class Scopes {
    constructor(next) {
        this.name = 'Scopes';
        this.mandatory = true;
        this.templateKeys = [];
        this.requiredDependencies = [];
        this.requiredDependencies.push(ver('rete-scopes-plugin', next));
    }
}
exports.Scopes = Scopes;
function validateFeatures(features, options) {
    if (!features.some(feature => {
        return feature instanceof Angular
            || feature instanceof React
            || feature instanceof Vue
            || feature instanceof Svelte
            || feature instanceof Lit;
    })) {
        return {
            issue: 'At least one render plugin should be selected'
        };
    }
    if (options.stack !== 'angular' && features.some(feature => feature instanceof Angular)) {
        return {
            issue: 'Angular render plugin is only allowed in Angular app stack'
        };
    }
    return {
        issue: null
    };
}
function getDependencies(features) {
    return features.map(feature => feature.requiredDependencies || []).flat();
}
