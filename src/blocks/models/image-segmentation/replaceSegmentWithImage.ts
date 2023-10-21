import Blockly from "blockly";

export let replaceSegmentWithImage = {
  init: function () {
    this.appendValueInput("OBJECT")
      .appendField("replace segment");
    this.appendValueInput("IMAGE")
      .appendField("with image");
    this.appendDummyInput()
      .appendField("transparency")
      .appendField(new Blockly.FieldNumber(0, 0, 1, 0.01), "TRANSPARENCY");
    this.setInputsInline(false);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(250);
  },

  transpile: function (block, generator) {
    let object = generator.valueToCode(block, 'OBJECT', generator.ORDER_NONE);
    if (object === "") return "";

    let image = generator.valueToCode(block, 'IMAGE', generator.ORDER_NONE);
    if (image === "") return "";

    let transparency = block.getFieldValue("TRANSPARENCY");

    return `await cv.replaceSegmentWithImage(${object}, ${image}, ${(1 - transparency) * 255});`;
  }
};