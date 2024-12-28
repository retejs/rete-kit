"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AngularBuilder = void 0;
const execa_1 = __importDefault(require("execa"));
const fs_1 = __importDefault(require("fs"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = require("path");
const consts_1 = require("../../consts");
const template_builder_helpers_1 = require("../../template-builder-helpers");
const budgets_1 = require("./budgets");
const compatibility_1 = require("./compatibility");
class AngularBuilder {
    constructor() {
        this.name = 'Angular';
        this.versions = [12, 13, 14, 15, 16, 17, 18];
        this.foundation = 'angular';
    }
    async create(name, version) {
        const options = ['--defaults'];
        if ([17, 18].includes(version))
            options.push('--no-standalone');
        await (0, execa_1.default)('npx', ['--package', `@angular/cli@${version}`, 'ng', 'new', name, ...options], { stdio: 'inherit' });
        await (0, execa_1.default)('npx', [
            'npm-check-updates@16',
            '--upgrade',
            '--target',
            'minor',
            '--filter',
            '/@angular.*/'
        ], { stdio: 'inherit', cwd: name });
        await (0, execa_1.default)('npm', ['i'], { cwd: name });
        if (version < 13) {
            await (0, compatibility_1.installCompatibleTS)(name, '4.7');
        }
        await (0, budgets_1.removeBudgets)(name);
    }
    async putAssets(name, version, template) {
        const assets = (0, path_1.join)(consts_1.assetsStack, 'angular', 'modules');
        const src = (0, path_1.join)(name, 'src');
        await fs_extra_1.default.copy(consts_1.assetsCommon, (0, path_1.join)(src, 'app'), {
            recursive: true,
            overwrite: true
        });
        await fs_extra_1.default.promises.rename((0, path_1.join)(src, 'app', 'customization', 'background.css'), (0, path_1.join)(src, 'styles.css'));
        await fs_extra_1.default.copy(assets, src, {
            recursive: true,
            overwrite: true,
            filter(sourcePath) {
                if (version >= 13 && (0, path_1.basename)(sourcePath) === 'shims.d.ts')
                    return false;
                return true;
            }
        });
        const fileTemplate = new template_builder_helpers_1.FileTemplate(template);
        await fileTemplate.apply([
            (0, path_1.join)(src, 'app', 'app.module.ts')
        ]);
    }
    async putScript(name, path, code) {
        const scriptPath = (0, path_1.join)(name, 'src', 'app', 'rete', path);
        await fs_1.default.promises.mkdir((0, path_1.dirname)(scriptPath), { recursive: true });
        await fs_1.default.promises.writeFile(scriptPath, code);
    }
    getStaticPath(name, version) {
        if (version && [17, 18].includes(version))
            return (0, path_1.join)('dist', name, 'browser');
        return (0, path_1.join)('dist', name);
    }
    getBuildCommand() {
        return 'build';
    }
}
exports.AngularBuilder = AngularBuilder;
