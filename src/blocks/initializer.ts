import { Debug } from "../debug";

import Blockly from "blockly";
import { javascriptGenerator } from "blockly/javascript";

import * as capture from "./capture";
import * as filters from "./filters";
import * as models from "./models";
import * as display from "./display";

import { toolbox } from "./toolbox";

const workspace = Blockly.inject("blockly-div", {
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
  zoom: { controls: true, wheel: true, startScale: 1.0, maxScale: 3, minScale: 0.3, scaleSpeed: 1.2 },
  trashcan: false,
});

// Define colours for blocks
Blockly.Msg.CAPTURE_HUE = "0";
Blockly.Msg.FILTERS_HUE = "180";
Blockly.Msg.MODELS_HUE = "60";
Blockly.Msg.DRAW_HUE = "250";
Blockly.Msg.POSITION_HUE = "130";

const createCustomBlock = (name, blockType) => {
  Blockly.Blocks[name] = blockType;
  javascriptGenerator.forBlock[name] = function (block, generator) {
    return blockType["transpile"](block, generator);
  };
};

const createCustomBlocks = () => {
  createCustomBlock("start_webcam", capture.startWebcam);
  createCustomBlock("stop_webcam", capture.stopWebcam);
  createCustomBlock("webcam_image", capture.webcamImage);
  createCustomBlock("sample_image", capture.sampleImage);
  createCustomBlock("background", capture.background);

  createCustomBlock("convert_to_grayscale", filters.convertToGrayscale);
  createCustomBlock("rotate_right", filters.rotateRight);
  createCustomBlock("rotate_left", filters.rotateLeft);
  createCustomBlock("rotate_180", filters.rotate180);
  createCustomBlock("flip_horizontal", filters.flipHorizontal);
  createCustomBlock("flip_vertical", filters.flipVertical);
  createCustomBlock("invert", filters.invert);
  createCustomBlock("blur", filters.blur);

  createCustomBlock("display_frame", display.displayFrame);
  createCustomBlock("draw_text_at", display.drawTextAt);
  createCustomBlock("draw_emoji_at", display.drawEmojiAt);
  createCustomBlock("position", display.position);
  createCustomBlock("prefixed_position", display.prefixedPosition);
  createCustomBlock("add_image_to_frame", display.addImageToFrame);

  createCustomBlock("detect_objects", models.detectObjects);
  createCustomBlock("efficientdet_lite0", models.efficientdet_lite0);
  createCustomBlock("efficientdet_lite2", models.efficientdet_lite2);
  createCustomBlock("ssdmobilenet-v2", models.ssdmobilenet_v2);
  createCustomBlock("draw_bounding_boxes", models.drawBoundingBoxes);
  createCustomBlock("objects_contain", models.objectsContain)
  createCustomBlock("segment", models.segment);

  createCustomBlock("selfiesegmenter", models.selfiesegmenter);
  createCustomBlock("hairsegmenter", models.hairsegmenter);
  createCustomBlock("selfiemulticlass", models.selfiemulticlass);
  createCustomBlock("color_segment", models.colorSegment);
  createCustomBlock("replace_segment_with_image", models.replaceSegmentWithImage);
  createCustomBlock("detect_pose", models.detectPose);
  createCustomBlock("in_proximity_of", models.inProximityOf);

  createCustomBlock("poselandmarker_lite", models.poselandmarker_lite);
  createCustomBlock("poselandmarker_full", models.poselandmarker_full);
  createCustomBlock("poselandmarker_heavy", models.poselandmarker_heavy);
  createCustomBlock("draw_pose", models.drawPose);
  createCustomBlock("get_position_of", models.getPositionOf);

  createCustomBlock("detect_face", models.detectFace);
  createCustomBlock("facelandmarker_fp16", models.facelandmarker_fp16);
  createCustomBlock("draw_face", models.drawFace);

};

const handleBlocklyResize = () => {
  const blocklyArea = document.getElementById("blockly-area");
  const blocklyDiv = document.getElementById("blockly-div");

  const onresize = function () {
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
      const json = Blockly.serialization.workspaces.save(workspace);
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