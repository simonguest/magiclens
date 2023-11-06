import Blockly from "blockly";

export let detectObjects = {
  init: function () {
    this.appendValueInput("IMAGE")
      .setCheck("Image")
      .appendField("detect objects in image ");
    this.appendValueInput("MODEL")
      .setCheck("ObjectDetectionModel")
      .appendField("using model");
    this.appendDummyInput()
      .appendField("running on")
      .appendField(
        new Blockly.FieldDropdown([["GPU", "GPU"], ["CPU", "CPU"]]),
        "DELEGATE"
      )
    this.setInputsInline(false);
    this.setOutput(true, "Objects");
    this.setPreviousStatement(false, null);
    this.setNextStatement(false, null);
    this.setColour("%{BKY_MODELS_HUE}");
  },

  transpile: function (block, generator) {
    let image = generator.valueToCode(block, 'IMAGE', generator.ORDER_NONE);
    let model = generator.valueToCode(block, 'MODEL', generator.ORDER_NONE);

    if (image === "") return "";
    if (model === "") return "";

    return [`await cv.detectObjects(${image}, ${model}, "${block.getFieldValue("DELEGATE")}")`, generator.ORDER_NONE];
  }
};