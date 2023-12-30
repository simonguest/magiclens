import Blockly from "blockly";

const modelTypes = [
  {
    id: "./models/object-detection/SSDMobileNet-V2/float16/ssd_mobilenet_v2.tflite", title: "fp16"
  },
  {
    id: "./models/object-detection/SSDMobileNet-V2/float32/ssd_mobilenet_v2.tflite", title: "fp32"
  }]

export const ssdmobilenet_v2 = {
  init: function () {
    this.appendDummyInput()
      .appendField("SSD MobileNet V2")
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
    const model = `({name: "SSDMobileNet-V2", path: "${block.getFieldValue("MODEL")}"})`;
    return [model, generator.ORDER_NONE];
  },
};