"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Repository = void 0;
const inquirer_1 = require("../../shared/inquirer");
class Repository {
    constructor(type, items) {
        this.type = type;
        this.items = items;
        this.itemsMap = new Map();
        items.forEach(item => {
            this.itemsMap.set(item.getName(), item);
        });
    }
    async select(selectedName, interactive = false) {
        if (selectedName) {
            return this.validate(selectedName);
        }
        // If no selection provided and interactive mode is enabled, prompt the user
        if (interactive) {
            return await this.prompt();
        }
        // Otherwise, throw an error
        const available = this.items.map(item => item.getName()).join(', ');
        throw new Error(`No ${this.type} specified. Available ${this.type}s: ${available}`);
    }
    validate(selectedName) {
        const item = this.itemsMap.get(selectedName);
        if (!item) {
            throw this.createNotFoundError(selectedName);
        }
        return item;
    }
    async prompt() {
        const choices = this.items.map(item => ({
            name: item.getName(),
            value: item
        }));
        const selectedItem = await (0, inquirer_1.select)(`Select a ${this.type}:`, choices);
        if (!selectedItem) {
            throw new Error(`No ${this.type} selected`);
        }
        return selectedItem;
    }
    createNotFoundError(itemName) {
        const available = this.items.map(item => item.getName()).join(', ');
        return new Error(`Invalid ${this.type} "${itemName}". Available ${this.type}s: ${available}`);
    }
    getNames() {
        return this.items.map(item => item.getName());
    }
}
exports.Repository = Repository;
