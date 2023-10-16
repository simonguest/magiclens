import Blockly from "blockly";

const modelTypes = [
  {
    id: "./models/object-detection/EfficientDet-Lite0/float16/efficientdet_lite0.tflite", title: "float16"
  },
  {
    id: "./models/object-detection/EfficientDet-Lite0/float32/efficientdet_lite0.tflite", title: "float32"
  }]

export let efficientdet_lite0 = {
  init: function () {
    this.appendDummyInput()
      .appendField("EfficientDet-Lite0")
      .appendField(
        new Blockly.FieldDropdown(modelTypes.map(l => [l.title, l.id])),
        "MODEL"
      )
    this.setInputsInline(false);
    this.setOutput(true, "MODEL");
    this.setPreviousStatement(false, null);
    this.setNextStatement(false, null);
    this.setColour(100);
  },

  transpile: function (block, generator) {
    let model = `[{name: "EfficientDet-Lite0", path: "${block.getFieldValue("MODEL")}"}]`;
    return [model, generator.ORDER_NONE];
  },
};