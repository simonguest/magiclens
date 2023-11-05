import Blockly from "blockly";

const backgrounds = [
  {
    id: "space_background.png", title: "Space"
  },
  {
    id: "tropical_fish.png", title: "Tropical fish"
  },
  {
    id: "red_material.png", title: "Red material"
  }
]

export let background = {
  init: function () {
    this.appendDummyInput()
      .appendField("background image")
      .appendField(
        new Blockly.FieldDropdown(backgrounds.map(l => [l.title, l.id]).sort()),
        "IMAGE"
      )
    this.setInputsInline(false);
    this.setOutput(true, "Image");
    this.setPreviousStatement(false, null);
    this.setNextStatement(false, null);
    this.setColour("%{BKY_CAPTURE_HUE}");
  },

  transpile: function (block, generator) {
    let image = block.getFieldValue("IMAGE");
    return [`await cv.loadSampleImage("${image}")`, generator.ORDER_NONE];
  },
};