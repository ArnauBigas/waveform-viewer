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

    private renderObject(object: T, hierarchicalPath: string = ""): string {
        const name = this.getName(object);
        const children = this.getChildren(object);
        const objectPath = (hierarchicalPath === "" ? "" : hierarchicalPath + ".") + name;

        if (children.length > 0) {
            return `
                <li><div class="hierarchy_element" data-hierarchical-path=${objectPath}><span class="caret">${name}</span></div>
                <ul class="nested">
                    ${this.renderObjectList(children, objectPath)}
                </ul>
                </li>
            `;
        } else {
            return `<li><div class="hierarchy_element" data-hierarchical-path=${objectPath}>${name}</div></li>`;
        }
    }

    private renderObjectList(objects: T[], hierarchicalPath: string = ""): string {
        let result = "";
        for (const obj of objects) {
            result += this.renderObject(obj, hierarchicalPath);
        }
        return result;
    }
}