import Blockly from "blockly";

export let segment = {
  init: function () {
    this.appendValueInput("IMAGE")
      .setCheck("Image")
      .appendField("segment image ");
    this.appendValueInput("MODEL")
      .setCheck("ImageSegmentationModel")
      .appendField("using model");
    this.appendDummyInput()
      .appendField("running on")
      .appendField(
        new Blockly.FieldDropdown([["GPU", "GPU"], ["CPU", "CPU"]]),
        "DELEGATE"
      )
    this.setInputsInline(false);
    this.setOutput(true, "Segment");
    this.setPreviousStatement(false, null);
    this.setNextStatement(false, null);
    this.setColour("%{BKY_MODELS_HUE}");
  },

  transpile: function (block, generator) {
    let image = generator.valueToCode(block, 'IMAGE', generator.ORDER_NONE);
    let model = generator.valueToCode(block, 'MODEL', generator.ORDER_NONE);

    if (image === "") return "";
    if (model === "") return "";

    return [`await cv.segment(${image}, ${model}, "${block.getFieldValue("DELEGATE")}")`, generator.ORDER_NONE];
  }
};