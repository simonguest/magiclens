import Blockly from "blockly";

const modelTypes = [
  {
    id: "./models/object-detection/EfficientDet-Lite0/float16/efficientdet_lite0.tflite", title: "fp16"
  },
  {
    id: "./models/object-detection/EfficientDet-Lite0/float32/efficientdet_lite0.tflite", title: "fp32"
  }]

export const efficientdet_lite0 = {
  init: function () {
    this.appendDummyInput()
      .appendField("EfficientDet Lite 0")
      .appendField(
        new Blockly.FieldDropdown(modelTypes.map(l => [l.title, l.id])),
        "MODEL"
      )
    this.setInputsInline(false);
    this.setOutput(true, "ObjectDetectionModel");
    this.setPreviousStatement(false, null);
    this.setNextStatement(false, null);
    this.setColour("%{BKY_MODELS_HUE}");
  },

  transpile: function (block, generator) {
    const model = `({name: "EfficientDet-Lite0", path: "${block.getFieldValue("MODEL")}"})`;
    return [model, generator.ORDER_NONE];
  },
};