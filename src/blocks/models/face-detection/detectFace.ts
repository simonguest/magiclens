import Blockly from "blockly";

export const detectFace = {
  init: function () {
    this.appendValueInput("IMAGE")
      .setCheck("Image")
      .appendField("detect face in image");
    this.appendValueInput("MODEL")
      .setCheck("FaceEstimationModel")
      .appendField("using model");
    this.appendDummyInput()
      .appendField("running on")
      .appendField(
        new Blockly.FieldDropdown([["GPU", "GPU"], ["CPU", "CPU"]]),
        "DELEGATE"
      )
    this.setInputsInline(false);
    this.setOutput(true, "Pose");
    this.setPreviousStatement(false, null);
    this.setNextStatement(false, null);
    this.setColour("%{BKY_MODELS_HUE}");
  },

  transpile: function (block, generator) {
    const image = generator.valueToCode(block, 'IMAGE', generator.ORDER_NONE);
    const model = generator.valueToCode(block, 'MODEL', generator.ORDER_NONE);

    if (image === "") return "";
    if (model === "") return "";

    return [`await cv.detectFace(${image}, ${model}, "${block.getFieldValue("DELEGATE")}")`, generator.ORDER_NONE];
  }
};