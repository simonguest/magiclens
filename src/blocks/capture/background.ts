import Blockly, { MenuOption } from "blockly";

const backgrounds = [
  {
    id: "space_background_512x512.png", title: "Space"
  },
  {
    id: "tropical_fish_512x512.png", title: "Tropical fish"
  },
  {
    id: "red_material_512x512.png", title: "Red material"
  }
]

export const background = {
  init: function () {
    this.appendDummyInput()
      .appendField("background image")
      .appendField(
        new Blockly.FieldDropdown(backgrounds.map(l => [l.title, l.id]).sort() as MenuOption[]),
        "IMAGE"
      )
    this.setInputsInline(false);
    this.setOutput(true, "Image");
    this.setPreviousStatement(false, null);
    this.setNextStatement(false, null);
    this.setColour("%{BKY_CAPTURE_HUE}");
  },

  transpile: function (block, generator) {
    const image = block.getFieldValue("IMAGE");
    return [`await cv.loadSampleImage("${image}")`, generator.ORDER_NONE];
  },
};