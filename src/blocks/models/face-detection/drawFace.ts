export const drawFace = {
  init: function () {
      this.appendValueInput("FACE")
        .setCheck("Face")
          .appendField("draw face");
      this.setInputsInline(false);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
    this.setColour("%{BKY_DRAW_HUE}");
  },

  transpile: function (block, generator) {
      const pose = generator.valueToCode(block, 'FACE', generator.ORDER_NONE);
      if (pose === "") return "";

      return `await cv.drawFace(${pose});`;
  }
};