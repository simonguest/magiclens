import Blockly from "blockly";

const categories = [
  {
    id: "1", title: "hair"
  },
  {
    id: "0", title: "background"
  }
]
export const hairsegmenter = {
  init: function () {
    this.appendDummyInput()
      .appendField("Hair Segmenter")
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
    const model = `({name: "HairSegmenter", path: "./models/image-segmentation/HairSegmenter/float32/hair_segmenter.tflite", category: ${block.getFieldValue("CATEGORY")}})`;
    return [model, generator.ORDER_NONE];
  },
};