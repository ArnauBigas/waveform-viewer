export abstract class HierarchicalRenderer<T> {
    private readonly _top: T;

    public constructor(top: T) { this._top = top; }

    protected abstract getName(object: T): string;
    protected abstract getChildren(object: T): T[];

    public render(): string {
        return `
            <ul class="hierarchy">
                ${this.renderObject(this._top)}
            </ul> 
        `;
    }

    private renderObject(object: T): string {
        const children = this.getChildren(object);
        console.log("Children length: " + children.length);
        if (children.length > 0) {
            return `
                <li><span class="caret">${this.getName(object)}</span>
                <ul class="nested">
                    ${this.renderObjectList(children)}
                </ul> 
            `;
        } else {
            return `<li>${this.getName(object)}</li>`;
        }
    }

    private renderObjectList(objects: T[]): string {
        let result = "";
        for (const obj of objects) {
            result += this.renderObject(obj);
        }
        return result;
    }
}