import Blockly from "blockly";

export const emojis = [
  {
    id: "slightly-smiling-face", title: "🙂"
  },
  {
    id: "thinking-face", title: "🤔"
  },
  {
    id: "money-bag", title: "💰"
  }]

export let drawEmojiAt = {
  init: function () {
    this.appendValueInput("POSITION")
      .appendField("draw emoji")
      .appendField(
        new Blockly.FieldDropdown(emojis.map(l => [l.title, l.id])),
        "EMOJI"
      )
      .appendField("at");
    this.setInputsInline(false);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(250);
  },

  transpile: function (block, generator) {
    let position = generator.valueToCode(block, 'POSITION', generator.ORDER_NONE);
    if (position === "") return "";

    return `cv.drawEmojiAt("${block.getFieldValue('EMOJI')}",${position});`;
  }
};