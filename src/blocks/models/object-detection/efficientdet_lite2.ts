import Blockly from "blockly";

const modelTypes = [
  {
    id: "./models/object-detection/EfficientDet-Lite2/float16/efficientdet_lite2.tflite", title: "fp16"
  },
  {
    id: "./models/object-detection/EfficientDet-Lite2/float32/efficientdet_lite2.tflite", title: "fp32"
  }]

export let efficientdet_lite2 = {
  init: function () {
    this.appendDummyInput()
      .appendField("EfficientDet Lite 2")
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
    let model = `({name: "EfficientDet-Lite2", path: "${block.getFieldValue("MODEL")}"})`;
    return [model, generator.ORDER_NONE];
  },
};