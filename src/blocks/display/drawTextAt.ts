import Blockly from "blockly";

const fonts = [
  {
    id: "Arial", title: "Arial"
  },
  {
    id: "Courier", title: "Courier"
  }]

export const drawTextAt = {
  init: function () {
    this.appendValueInput("TEXT")
      .setCheck("String")
      .appendField("draw text")
    this.appendValueInput("POSITION")
      .setCheck("Position")
      .appendField("at");
    this.appendDummyInput()
      .appendField("with font")
      .appendField(
        new Blockly.FieldDropdown(fonts.map(l => [l.title, l.id])),
        "FONT"
      )
    this.appendDummyInput()
      .appendField("size")
      .appendField(new Blockly.FieldNumber(20, 1, 100), "FONT_SIZE")
      .appendField("color")
      .appendField(new Blockly.FieldColour("#FFF", null), "FONT_COLOR");
    this.setInputsInline(false);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("%{BKY_DRAW_HUE}");
  },

  transpile: function (block, generator) {
    const text = generator.valueToCode(block, 'TEXT', generator.ORDER_NONE);
    if (text === "") return "";

    const position = generator.valueToCode(block, 'POSITION', generator.ORDER_NONE);
    if (position === "") return "";

    return `cv.drawTextAt(${text},${position}, "${block.getFieldValue('FONT')}", ${block.getFieldValue('FONT_SIZE')}, "${block.getFieldValue('FONT_COLOR')}");`;
  }
};