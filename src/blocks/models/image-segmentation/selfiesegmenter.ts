import Blockly from "blockly";

const categories = [
  {
    id: "255", title: "background"
  },
  {
    id: "0", title: "person"
  }
]

export const selfiesegmenter = {
  init: function () {
    this.appendDummyInput()
      .appendField("Selfie")
      .appendField(
        new Blockly.FieldDropdown(categories.map(l => [l.title, l.id])),
        "CATEGORY"
      )
    this.setInputsInline(false);
    this.setOutput(true, "ImageSegmentationModel");
    this.setPreviousStatement(false, null);
    this.setNextStatement(false, null);
    this.setColour("%{BKY_MODELS_HUE}");
  },

  transpile: function (block, generator) {
    const model = `({name: "SelfieSegmenter", path: "./models/image-segmentation/SelfieSegmentation/float16/selfie_segmenter.tflite", category: ${block.getFieldValue("CATEGORY")}})`;
    return [model, generator.ORDER_NONE];
  },
};