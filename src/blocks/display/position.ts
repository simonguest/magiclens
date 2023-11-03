export let position = {
  init: function () {
    this.appendDummyInput()

    this.appendValueInput("X")
      .appendField("position x:")
      .setCheck("Number");
    this.appendValueInput("Y")
      .appendField("y:")
      .setCheck("Number");
    this.setInputsInline(true);
    this.setOutput(true, "Position");
    this.setPreviousStatement(false, null);
    this.setNextStatement(false, null);
    this.setColour("%{BKY_POSITION_HUE}");
  },

  transpile: function (block, generator) {
    let x = generator.valueToCode(block, 'X', generator.ORDER_NONE);
    if (x === "") return "";
    let y = generator.valueToCode(block, 'Y', generator.ORDER_NONE);
    if (y === "") return "";

    let position = `({x: ${x}, y: ${y}})`;
    return [position, generator.ORDER_NONE];
  },
};