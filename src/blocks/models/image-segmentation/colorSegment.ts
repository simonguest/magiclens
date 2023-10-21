import Blockly from "blockly";

export let colorSegment = {
  init: function () {
    this.appendValueInput("OBJECT")
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
    this.setColour(250);
  },

  transpile: function (block, generator) {
    let object = generator.valueToCode(block, 'OBJECT', generator.ORDER_NONE);
    if (object === "") return "";

    // convert hex color and transparency to rgb array
    let color = block.getFieldValue("COLOR");
    const rgb = color.match(/[A-Za-z0-9]{2}/g).map((v) => parseInt(v, 16));
    let transparency = block.getFieldValue("TRANSPARENCY");
    rgb.push(Math.round(transparency * 255));

    return `await cv.colorSegment(${object}, [${rgb}]);`;
  }
};