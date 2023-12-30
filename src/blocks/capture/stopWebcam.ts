export const stopWebcam = {
  init: function () {
    this.appendDummyInput()
      .appendField("stop webcam")
    this.setInputsInline(false);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour("%{BKY_CAPTURE_HUE}");
  },

  transpile: function () {
    return `await cv.stopWebcam();`;
  },
};