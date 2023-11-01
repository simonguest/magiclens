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
    this.setOutput(true, "POSITION");
    this.setPreviousStatement(false, null);
    this.setNextStatement(false, null);
    this.setColour(100);
  },

  transpile: function (block, generator) {
    let x = generator.valueToCode(block, 'X', generator.ORDER_NONE);
    if (x === "") return "";
    let y = generator.valueToCode(block, 'Y', generator.ORDER_NONE);
    if (y === "") return "";

    let model = `({x: ${x}, y: ${y}})`;
    return [model, generator.ORDER_NONE];
  },
};