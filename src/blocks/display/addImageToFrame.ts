export const addImageToFrame = {
  init: function () {
    this.appendValueInput("IMAGE")
      .setCheck("Image")
      .appendField("add image");
    this.appendDummyInput()
      .appendField("to frame");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("%{BKY_DRAW_HUE}");
  },

  transpile: function (block, generator) {
    const image = generator.valueToCode(block, 'IMAGE', generator.ORDER_NONE);
    if (image === "") return "";

    return `await cv.addImageToFrame(${image});`;
  }
};