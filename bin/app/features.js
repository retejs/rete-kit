"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Scopes = exports.Area3D = exports.Comments = exports.History = exports.Selectable = exports.Reroute = exports.Minimap = exports.ContextMenu = exports.Readonly = exports.Dataflow = exports.Arrange = exports.ZoomAt = exports.OrderNodes = exports.Lit = exports.Svelte = exports.Vue = exports.React = exports.Angular = exports.Default = void 0;
exports.validateFeatures = validateFeatures;
exports.findFeature = findFeature;
exports.resolveFeatures = resolveFeatures;
exports.featureKeys = featureKeys;
exports.getDependencies = getDependencies;
exports.resolveJobs = resolveJobs;
const throw_1 = require("../shared/throw");
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
class History {
    constructor(next) {
        this.name = 'History';
        this.templateKeys = ['history'];
        this.requiredDependencies = [];
        this.requiredDependencies.push(ver('rete-history-plugin', next));
    }
}
exports.History = History;
class Comments {
    constructor(next) {
        this.name = 'Comments';
        this.templateKeys = ['comments', 'sizes'];
        this.requiredDependencies = [];
        this.requiredDependencies.push(ver('rete-comment-plugin', next));
    }
}
exports.Comments = Comments;
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
function findFeature(name, pool) {
    return pool.find(f => f.name.toLocaleLowerCase() === name.toLocaleLowerCase());
}
function resolveFeatures(names, pool) {
    return names.map(name => {
        const feature = findFeature(name, pool);
        if (!feature)
            (0, throw_1.throwError)(`feature ${name} not found`);
        return feature;
    });
}
function featureKeys(features) {
    return features.map(({ templateKeys }) => templateKeys !== null && templateKeys !== void 0 ? templateKeys : []).flat();
}
function getDependencies(features) {
    const unique = features.filter((feature, index, list) => {
        return list.findIndex(item => item.name === feature.name) === index;
    });
    return unique.map(feature => { var _a; return (_a = feature.requiredDependencies) !== null && _a !== void 0 ? _a : []; }).flat();
}
function parseFeaturesObject(features, sources) {
    let base = null;
    const extras = [];
    for (const [name, value] of Object.entries(features)) {
        if (Array.isArray(value)) {
            if (base)
                (0, throw_1.throwError)('features object can contain only one base features array');
            base = value;
        }
        else {
            if (sources.includes(name))
                (0, throw_1.throwError)(`template "${name}" already exists`);
            if (!sources.includes(value.from))
                (0, throw_1.throwError)(`template "${name}" from unknown "${value.from}"`);
            extras.push({ name, from: value.from, features: value.features });
        }
    }
    if (!base)
        (0, throw_1.throwError)('features object must contain a base features array');
    return { base, extras };
}
function resolveValidated(names, optionalFeatures, stack, label) {
    const resolved = resolveFeatures(names, optionalFeatures);
    const { issue } = validateFeatures(resolved, { stack });
    if (issue) {
        (0, throw_1.throwError)(label
            ? `template "${label}": ${issue}`
            : issue);
    }
    return resolved;
}
/** Build template jobs with resolved features. */
function resolveJobs(sources, optionalFeatures, stack, input) {
    if ('selected' in input) {
        const { issue } = validateFeatures(input.selected, { stack });
        if (issue)
            (0, throw_1.throwError)(issue);
        return sources.map(name => ({ name, from: name, features: input.selected }));
    }
    const { features } = input;
    if (Array.isArray(features)) {
        const resolved = resolveValidated(features, optionalFeatures, stack);
        return sources.map(name => ({ name, from: name, features: resolved }));
    }
    const { base, extras } = parseFeaturesObject(features, sources);
    const shared = resolveValidated(base, optionalFeatures, stack);
    return [
        ...sources.map(name => ({ name, from: name, features: shared })),
        ...extras.map(extra => ({
            name: extra.name,
            from: extra.from,
            features: resolveValidated(extra.features, optionalFeatures, stack, extra.name)
        }))
    ];
}
