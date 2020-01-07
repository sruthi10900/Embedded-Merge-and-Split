class GlobalVariables {
}

/**Third parameter:
 * 1. If it is 1, then it means horizontal resize. 
 *    If it is 0, then it means vertical resize
 * 
 * Fourth parameter:
 * 1. If it is 1, then left/top side will be fixed while resizing. 
 *    If it is 0, then right/bottom side will be fixed while resizing.
 * 
 * Fifth and Sixth parameter:
 * 1. Fifth is the element on left extreme that doesnt move
 *    Sixth is the right extreme
 * 
 * Seventh parameter:
 * 1. For horizontal resize, if widthRightExtreme is different from rightExtreme then provide additional parameter for widthRightextreme
 */

GlobalVariables.minPanelSize = 120

GlobalVariables.lftPanel = "outer_filter_panel"
GlobalVariables.topPanel = "top_cluster_panel"
GlobalVariables.midPanel = "middle_graph_panel"
GlobalVariables.ritPanel = "right_map_panel"
GlobalVariables.btmPanel = "bottom_graph_panel"

GlobalVariables.dragLftPanel = "draggableObjectFilterPanel";
GlobalVariables.dragTopPanel = "draggableObjectTopCluster";
GlobalVariables.dragMidPanel = "draggableObjectMiddle";
GlobalVariables.dragRitPanel = "draggableObjectMapPanel";
GlobalVariables.dragBtmPanel = "draggableObjectBottomGraph";

GlobalVariables.filterHeading = "filterHeading"
GlobalVariables.categoricalDataContainer = "CategoricalDataContainer"
GlobalVariables.numericDataContainer = "NumericDataContainer"

// horizontal issue when 7th parameter same, vertical issue when 6th parameter same

GlobalVariables.resizerDependents = [
    [GlobalVariables.btmPanel, GlobalVariables.dragBtmPanel, 1, 0, GlobalVariables.lftPanel, "resizer3", GlobalVariables.btmPanel], 
    ["resizer2", "random", 1, 0, GlobalVariables.lftPanel, "resizer3", "resizer2"], 
    [GlobalVariables.lftPanel, GlobalVariables.dragLftPanel, 1, 1, GlobalVariables.lftPanel, "resizer3"],
    [GlobalVariables.topPanel, GlobalVariables.dragTopPanel, 1, 0, GlobalVariables.lftPanel, "resizer3"],
    ["resizer4", "random", 1, 0, GlobalVariables.lftPanel, "resizer3"],
    [GlobalVariables.midPanel, GlobalVariables.dragMidPanel, 1, 0, GlobalVariables.lftPanel, "resizer3"],
    [GlobalVariables.filterHeading, GlobalVariables.dragLftPanel, 1, 1, GlobalVariables.lftPanel, "resizer3"],
    [GlobalVariables.categoricalDataContainer, GlobalVariables.dragLftPanel, 1, 1, GlobalVariables.lftPanel, "resizer3"],
    [GlobalVariables.numericDataContainer, GlobalVariables.dragLftPanel, 1, 1, GlobalVariables.lftPanel, "resizer3"]
]

GlobalVariables.resizer2Dependents = [
    [GlobalVariables.btmPanel, GlobalVariables.dragBtmPanel, 0, 0, GlobalVariables.midPanel, GlobalVariables.btmPanel],
    [GlobalVariables.ritPanel, GlobalVariables.dragRitPanel, 0, 1, GlobalVariables.midPanel, GlobalVariables.btmPanel, GlobalVariables.ritPanel],
    ["resizer3", "random", 0, 1, GlobalVariables.midPanel, GlobalVariables.btmPanel, "resizer3"],
    [GlobalVariables.midPanel, GlobalVariables.dragMidPanel, 0, 1, GlobalVariables.midPanel, GlobalVariables.btmPanel]
]

GlobalVariables.resizer3Dependents = [
    [GlobalVariables.ritPanel, GlobalVariables.dragRitPanel, 1, 0, "resizer", GlobalVariables.ritPanel],
    [GlobalVariables.topPanel, GlobalVariables.dragTopPanel, 1, 1, "resizer", GlobalVariables.ritPanel],
    ["resizer4", "random", 1, 1, "resizer", GlobalVariables.ritPanel],
    [GlobalVariables.midPanel, GlobalVariables.dragMidPanel, 1, 1, "resizer", GlobalVariables.ritPanel]
]

GlobalVariables.resizer4Dependents = [
    [GlobalVariables.topPanel, GlobalVariables.dragTopPanel, 0, 1, GlobalVariables.topPanel, GlobalVariables.midPanel],
    [GlobalVariables.midPanel, GlobalVariables.dragMidPanel, 0, 0, GlobalVariables.topPanel, "resizer2"]
]