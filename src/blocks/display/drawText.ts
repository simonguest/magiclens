import Blockly from "blockly";

const fonts = [
  {
    id: "Arial", title: "Arial"
  },
  {
    id: "Courier", title: "Courier"
  }]

export let drawTextAt = {
  init: function () {
    this.appendValueInput("POSITION")
      .appendField("draw text")
      .appendField(new Blockly.FieldTextInput("hello world"), "TEXT")
      .appendField("at");
    this.appendDummyInput()
      .appendField("with font")
      .appendField(
        new Blockly.FieldDropdown(fonts.map(l => [l.title, l.id])),
        "FONT"
      )
      .appendField("font size")
      .appendField(new Blockly.FieldNumber(20, 1, 100), "FONT_SIZE")
    this.appendDummyInput()
      .appendField("font color")
      .appendField(new Blockly.FieldColour("#FFF", null), "FONT_COLOR");
    this.setInputsInline(false);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(250);
  },

  transpile: function (block, generator) {
    let position = generator.valueToCode(block, 'POSITION', generator.ORDER_NONE);
    if (position === "") return "";

    return `cv.drawTextAt("${block.getFieldValue('TEXT')}",${position}, "${block.getFieldValue('FONT')}", ${block.getFieldValue('FONT_SIZE')}, "${block.getFieldValue('FONT_COLOR')}");`;
  }
};