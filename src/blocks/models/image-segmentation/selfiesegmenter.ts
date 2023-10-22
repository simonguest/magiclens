import Blockly from "blockly";

const categories = [
  {
    id: "255", title: "background"
  },
  {
    id: "0", title: "person"
  }
]

export let selfiesegmenter = {
  init: function () {
    this.appendDummyInput()
      .appendField("Selfie")
      .appendField(
        new Blockly.FieldDropdown(categories.map(l => [l.title, l.id])),
        "CATEGORY"
      )
    this.setInputsInline(false);
    this.setOutput(true, "MODEL");
    this.setPreviousStatement(false, null);
    this.setNextStatement(false, null);
    this.setColour(100);
  },

  transpile: function (block, generator) {
    let model = `({name: "SelfieSegmenter", path: "./models/image-segmentation/SelfieSegmentation/float16/selfie_segmenter.tflite", category: ${block.getFieldValue("CATEGORY")}})`;
    return [model, generator.ORDER_NONE];
  },
};