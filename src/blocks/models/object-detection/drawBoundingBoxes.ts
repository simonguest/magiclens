export const drawBoundingBoxes = {
  init: function () {
      this.appendValueInput("OBJECTS")
          .setCheck("Objects")
          .appendField("draw bounding boxes for objects");
      this.setInputsInline(false);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
    this.setColour("%{BKY_DRAW_HUE}");
  },

  transpile: function (block, generator) {
      const objects = generator.valueToCode(block, 'OBJECTS', generator.ORDER_NONE);
      if (objects === "") return "";

      return `await cv.drawBoundingBoxes(${objects});`;
  }
};