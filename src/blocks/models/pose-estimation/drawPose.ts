
export const drawPose = {
  init: function () {
      this.appendValueInput("POSE")
        .setCheck("Pose")
          .appendField("draw pose");
      this.setInputsInline(false);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
    this.setColour("%{BKY_DRAW_HUE}");
  },

  transpile: function (block, generator) {
      const pose = generator.valueToCode(block, 'POSE', generator.ORDER_NONE);
      if (pose === "") return "";

      return `await cv.drawPose(${pose});`;
  }
};