import Blockly from "blockly";

export const colorSegment = {
  init: function () {
    this.appendValueInput("SEGMENT")
      .setCheck("Segment")
      .appendField("color segment");
    this.appendDummyInput()
      .appendField("with color")
      .appendField(new Blockly.FieldColour("#F0F", null), "COLOR");
    this.appendDummyInput()
      .appendField("transparency")
      .appendField(new Blockly.FieldNumber(0.5, 0, 1, 0.01), "TRANSPARENCY");
    this.setInputsInline(false);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("%{BKY_DRAW_HUE}");
  },

  transpile: function (block, generator) {
    const segment = generator.valueToCode(block, 'SEGMENT', generator.ORDER_NONE);
    if (segment === "") return "";

    // convert hex color and transparency to rgb array - more efficient to do here vs. every frame
    const color = block.getFieldValue("COLOR");
    const rgb = color.match(/[A-Za-z0-9]{2}/g).map((v) => parseInt(v, 16));
    const transparency = block.getFieldValue("TRANSPARENCY");
    rgb.push(Math.round((1 - transparency) * 255));

    return `await cv.colorSegment(${segment}, [${rgb}]);`;
  }
};