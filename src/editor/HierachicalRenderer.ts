export abstract class HierarchicalRenderer<T> {
    private readonly _top: T;
    private readonly _id: string;

    public constructor(top: T, id: string) {
        this._top = top;
        this._id = id;
    }

    protected abstract getName(object: T): string;
    protected abstract getChildren(object: T): T[];

    public render(): string {
        return `
            <ul class="hierarchy" id="${this._id}">
                ${this.renderObject(this._top)}
            </ul> 
        `;
    }

    private renderObject(object: T): string {
        const children = this.getChildren(object);
        console.log("Children length: " + children.length);
        if (children.length > 0) {
            return `
                <li><div class="hierarchy_element"><span class="caret">${this.getName(object)}</span></div>
                <ul class="nested">
                    ${this.renderObjectList(children)}
                </ul>
                </li>
            `;
        } else {
            return `<li><div class="hierarchy_element">${this.getName(object)}</div></li>`;
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