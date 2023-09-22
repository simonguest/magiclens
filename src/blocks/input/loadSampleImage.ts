import Blockly from "blockly";

const sampleImages = [{
  id: "dogs_walking_in_park.png", title: "Dogs walking in park"
},
{
  id: "CAT", title: "Cat sitting on a chair"
}]

export let loadSampleImage = {
  init: function () {
    this.appendDummyInput()
      .appendField("Load Sample Image")
      .appendField(
        new Blockly.FieldDropdown(sampleImages.map(l => [l.title, l.id])),
        "IMAGE"
      )
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(295);
  },

  transpile: function (block, generator) {
    let image = block.getFieldValue("IMAGE");
    return `cv.loadSampleImage("${image}");`;
  },
};