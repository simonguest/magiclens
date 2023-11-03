export let displayFrame = {
  init: function () {
    this.appendDummyInput()
      .appendField("display frame");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("%{BKY_DRAW_HUE}");
  },

  transpile: function () {
    return `await cv.displayFrame();`;
  }
};