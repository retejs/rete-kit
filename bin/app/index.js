"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Features = exports.appStacks = exports.builders = void 0;
exports.createApp = createApp;
/* eslint-disable @typescript-eslint/naming-convention */
const inquirer_1 = require("../shared/inquirer");
const throw_1 = require("../shared/throw");
const dependencies_installer_1 = require("./dependencies-installer");
const Features = __importStar(require("./features"));
exports.Features = Features;
const Patch = __importStar(require("./patch"));
const stack_1 = require("./stack");
const template_builder_1 = require("./template-builder");
exports.builders = {
    angular: new stack_1.AngularBuilder(),
    vue: new stack_1.VueBuilder(),
    'vue-vite': new stack_1.VueViteBuilder(),
    react: new stack_1.ReactBuilder(),
    'react-vite': new stack_1.ReactViteBuilder(),
    svelte: new stack_1.SvelteBuilder(),
    vite: new stack_1.ViteBuilder(),
    next: new stack_1.NextBuilder(),
    nuxt: new stack_1.NuxtBuilder(),
    'lit-vite': new stack_1.LitViteBuilder()
};
exports.appStacks = Object.keys(exports.builders);
// eslint-disable-next-line max-statements, complexity
async function createApp({ name, stack, version, features, depsAlias, forceInstall = false, next = false }) {
    const appName = name || await (0, inquirer_1.input)('Name');
    const selectedStack = stack || await (0, inquirer_1.select)('Stack (framework)', exports.appStacks.map(key => ({
        name: exports.builders[key].name,
        value: key
    })));
    if (!exports.appStacks.includes(selectedStack))
        (0, throw_1.throwError)('unknown stack');
    const builder = exports.builders[selectedStack];
    const selectedVersion = version || await (0, inquirer_1.select)('Version', builder.versions.map(value => ({
        name: String(value),
        value: value
    })));
    if (!builder.versions.includes(selectedVersion))
        (0, throw_1.throwError)('specified version is not available for selected stack');
    const featuresList = [
        new Features.Default(builder.foundation, next),
        new Features.Area3D(!(builder instanceof stack_1.AngularBuilder && selectedVersion < 13), next),
        new Features.Angular(builder.foundation === 'angular'
            ? selectedVersion
            : null, next),
        new Features.React(builder.foundation === 'react'
            ? selectedVersion
            : 18, selectedStack, next),
        new Features.Vue(builder.foundation === 'vue'
            ? selectedVersion
            : 3, next),
        new Features.Svelte(builder.foundation === 'svelte'
            ? selectedVersion
            : 4, next),
        new Features.Lit(builder.foundation === 'lit'
            ? selectedVersion
            : 3, next),
        new Features.OrderNodes(),
        new Features.ZoomAt(),
        new Features.Arrange(next),
        new Features.Dataflow(next),
        new Features.Readonly(next),
        new Features.Selectable(),
        new Features.ContextMenu(next),
        new Features.Minimap(next),
        new Features.Reroute(next),
        new Features.Scopes(next)
    ];
    const mandatoryFeatures = featuresList.filter(feature => feature.mandatory);
    const optionalFeatures = featuresList.filter(feature => !feature.mandatory);
    const selectedFeatures = (features === null || features === void 0 ? void 0 : features.length)
        ? features.map(featureName => {
            const feature = optionalFeatures.find(f => f.name.toLocaleLowerCase() === featureName.toLocaleLowerCase());
            if (!feature)
                throw (0, throw_1.throwError)(`feature ${featureName} not found`);
            return feature;
        })
        : await (0, inquirer_1.select)('Select features', optionalFeatures.map(feature => ({
            name: feature.name,
            value: feature
        })), true);
    const { issue } = Features.validateFeatures(selectedFeatures, { stack: selectedStack });
    if (issue)
        (0, throw_1.throwError)(issue);
    const { exists } = await Patch.ensure(appName, selectedStack, selectedVersion);
    if (!exists)
        await builder.create(appName, selectedVersion);
    await Patch.commit(appName, selectedStack, selectedVersion);
    const activeFeatures = [...mandatoryFeatures, ...selectedFeatures];
    const activeFeaturesKeys = activeFeatures.map(({ templateKeys }) => templateKeys || []).flat();
    const templateBuilder = new template_builder_1.TemplateBuilder(activeFeaturesKeys);
    await builder.putAssets(appName, selectedVersion, templateBuilder);
    for (const templateName of await templateBuilder.getTemplates()) {
        const template = await templateBuilder.load(templateName);
        try {
            const code = await templateBuilder.build(template);
            await builder.putScript(appName, `${templateName}.ts`, code);
        }
        catch (e) {
            console.error(e);
            (0, throw_1.throwError)(`failed to build template "${templateName}"`);
        }
    }
    await builder.putScript(appName, `index.ts`, await templateBuilder.getEntryScript());
    await (0, dependencies_installer_1.install)(appName, Features.getDependencies(activeFeatures), depsAlias, forceInstall);
}
