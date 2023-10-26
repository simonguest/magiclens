export let displayFrame = {
  init: function () {
    this.appendDummyInput()
      .appendField("display frame");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(250);
  },

  transpile: function () {
    return `await cv.displayFrame();`;
  }
};