import Blockly from "blockly";

const sampleImages = [{
  id: "dogs_walking_in_park.png", title: "Dogs walking in park"
},
{
  id: "cat_sitting_on_chair.png", title: "Cat sitting on a chair"
},
{
  id: "skateboarder.png", title: "Skateboarder"
}]

export let loadSampleImage = {
  init: function () {
    this.appendDummyInput()
      .appendField("Sample Image")
      .appendField(
        new Blockly.FieldDropdown(sampleImages.map(l => [l.title, l.id])),
        "IMAGE"
      )
    this.setInputsInline(false);
    this.setOutput(true, "IMAGE");
    this.setPreviousStatement(false, null);
    this.setNextStatement(false, null);
    this.setColour(295);
    this.setTooltip("A sample image");
  },

  transpile: function (block, generator) {
    let image = block.getFieldValue("IMAGE");
    return [`await cv.loadSampleImage("${image}")`, generator.ORDER_NONE];
  },
};