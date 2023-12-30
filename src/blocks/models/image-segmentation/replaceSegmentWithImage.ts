import Blockly from "blockly";

export const replaceSegmentWithImage = {
  init: function () {
    this.appendValueInput("SEGMENT")
      .setCheck("Segment")
      .appendField("replace segment");
    this.appendValueInput("IMAGE")
      .setCheck("Image")
      .appendField("with image");
    this.appendDummyInput()
      .appendField("transparency")
      .appendField(new Blockly.FieldNumber(0, 0, 1, 0.01), "TRANSPARENCY");
    this.setInputsInline(false);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("%{BKY_DRAW_HUE}");
  },

  transpile: function (block, generator) {
    const segment = generator.valueToCode(block, 'SEGMENT', generator.ORDER_NONE);
    if (segment === "") return "";

    const image = generator.valueToCode(block, 'IMAGE', generator.ORDER_NONE);
    if (image === "") return "";

    const transparency = block.getFieldValue("TRANSPARENCY");

    return `await cv.replaceSegmentWithImage(${segment}, ${image}, ${(1 - transparency) * 255});`;
  }
};