export let addImageToFrame = {
  init: function () {
    this.appendValueInput("IMAGE")
      .appendField("add image");
    this.appendDummyInput()
      .appendField("to frame");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(250);
  },

  transpile: function (block, generator) {
    let image = generator.valueToCode(block, 'IMAGE', generator.ORDER_NONE);
    if (image === "") return "";

    return `await cv.addImageToFrame(${image});`;
  }
};