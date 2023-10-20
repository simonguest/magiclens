import Blockly from "blockly";

const modelTypes = [
  {
    id: "./models/object-detection/SSDMobileNet-V2/float16/ssd_mobilenet_v2.tflite", title: "float16"
  },
  {
    id: "./models/object-detection/SSDMobileNet-V2/float32/ssd_mobilenet_v2.tflite", title: "float32"
  }]

export let ssdmobilenet_v2 = {
  init: function () {
    this.appendDummyInput()
      .appendField("SSDMobileNet-V2")
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
    let model = `({name: "SSDMobileNet-V2", path: "${block.getFieldValue("MODEL")}"})`;
    return [model, generator.ORDER_NONE];
  },
};