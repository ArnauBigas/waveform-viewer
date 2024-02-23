import { WaveformModule } from "../document/WaveformDocument";
import { HierarchicalRenderer } from "./HierachicalRenderer";

export class ModuleHierarchyRenderer extends HierarchicalRenderer<WaveformModule> {

    protected getName(object: WaveformModule): string { return object.name; }
    protected getChildren(object: WaveformModule): WaveformModule[] { return object.modules; }

}