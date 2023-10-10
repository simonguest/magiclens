export let startWebcam = {
  init: function () {
    this.appendDummyInput()
      .appendField("start webcam")
    this.setInputsInline(false);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(295);
  },

  transpile: function (block, generator) {
    return `await cv.startWebcam();`;
  },
};