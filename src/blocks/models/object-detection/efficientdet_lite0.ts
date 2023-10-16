import Blockly from "blockly";

const modelTypes = [{
  id: "./models/object_detection/efficientdet_lite0/int8/efficientdet_lite0.tflite", title: "int8"
},
{
  id: "./models/object_detection/efficientdet_lite0/float16/efficientdet_lite0.tflite", title: "float16"
},
{
  id: "./models/object_detection/efficientdet_lite0/float32/efficientdet_lite0.tflite", title: "float32"
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
    let model = block.getFieldValue("MODEL");
    return [`{model: "${model}"}`, generator.ORDER_NONE];
  },
};