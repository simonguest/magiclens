import { Debug } from "../debug";

import Blockly from "blockly";
import { javascriptGenerator } from "blockly/javascript";

import * as input from "./input";
import * as math from "./math";
import * as transform from "./transform";
import * as models from "./models";
import * as output from "./output";

import { toolbox } from "./toolbox";
import { create } from "domain";

Blockly.Theme.defineTheme("theme", {
  base: Blockly.Themes.Zelos,
  name: "theme",
  componentStyles: {
    workspaceBackgroundColour: "#ddd",
    toolboxBackgroundColour: "#5d5d73",
    toolboxForegroundColour: "#fff",
    flyoutBackgroundColour: "#3d3d53",
    flyoutForegroundColour: "#ddd",
    flyoutOpacity: 0.7,
    scrollbarColour: "#797979",
    insertionMarkerColour: "#fff",
    insertionMarkerOpacity: 0.3,
    scrollbarOpacity: 0.4,
    cursorColour: "#d0d0d0",
  },
  fontStyle: { family: "Roboto Mono", size: 10 },
});

let workspace = Blockly.inject("blockly-div", {
  toolbox: toolbox,
  horizontalLayout: false,
  toolboxPosition: "start",
  move: {
    scrollbars: {
      horizontal: false,
      vertical: true,
    },
    drag: true,
    wheel: true,
  },
  theme: "theme",
  zoom: { controls: true, wheel: true, startScale: 0.9, maxScale: 3, minScale: 0.3, scaleSpeed: 1.2 },
  trashcan: false,
});

const createCustomBlock = (name, blockType) => {
  Blockly.Blocks[name] = blockType;
  javascriptGenerator.forBlock[name] = function (block, generator) {
    return blockType["transpile"](block, generator);
  };
};

const createCustomBlocks = () => {
  createCustomBlock("debug", math.debug);
  createCustomBlock("input_load_sample_image", input.loadSampleImage);
  createCustomBlock("input_webcam_image", input.webcamImage);
  createCustomBlock("convert_to_gray", transform.convertToGray);
  createCustomBlock("rotate_right", transform.rotateRight);
  createCustomBlock("detect_objects", models.detectObjects);
  createCustomBlock("display", output.display);
  createCustomBlock("display_bounding_boxes", output.displayBoundingBoxes);
  createCustomBlock("display_segmentation", output.displaySegmentation);

};

const handleBlocklyResize = () => {
  let blocklyArea = document.getElementById("blockly-area");
  let blocklyDiv = document.getElementById("blockly-div");

  let onresize = function () {
    // Compute the absolute coordinates and dimensions of blocklyArea.
    let element: HTMLElement = blocklyArea;
    let x = 0;
    let y = 0;
    do {
      x += element.offsetLeft;
      y += element.offsetTop;
      element = element.offsetParent as HTMLElement;
    } while (element);
    // Position blocklyDiv over blocklyArea.
    blocklyDiv.style.left = x + "px";
    blocklyDiv.style.top = y + "px";
    blocklyDiv.style.width = blocklyArea.offsetWidth + "px";
    blocklyDiv.style.height = blocklyArea.offsetHeight + "px";
    Blockly.svgResize(workspace);
  };
  window.addEventListener("resize", onresize, false);
  onresize();
  Blockly.svgResize(workspace);
};

const eventInitializer = () => {

  workspace.addChangeListener(async (ev) => {
    if (
      ev.type === Blockly.Events.BLOCK_MOVE ||
      ev.type === Blockly.Events.BLOCK_CHANGE ||
      ev.type === Blockly.Events.BLOCK_DELETE ||
      ev.type === Blockly.Events.BLOCK_CREATE
    ) {
      // Write to session storage
      Debug.write("Writing workspace to session storage");
      let json = Blockly.serialization.workspaces.save(workspace);
      sessionStorage.setItem("workspace", JSON.stringify(json));
    }
  });
}

const blocklyInit = () => {
  createCustomBlocks();
  handleBlocklyResize();
  eventInitializer();
}

export { blocklyInit, workspace };