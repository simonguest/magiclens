import Blockly from "blockly";
import { javascriptGenerator } from "blockly/javascript";
import { CV } from "./cv";

// Initialize Blockly and the workspace
import { blocklyInit, workspace } from "./blocks/initializer";
blocklyInit();

// Initiatlize all of the CV libs
const cv = new CV()

// Code execution
async function run() {
  // Execute the required code
  let code = javascriptGenerator.workspaceToCode(workspace);
  console.log(`CODE: ${code}`);
  try {
    eval(
      `const run = async () => { ${code} }; run();`
    );
  } catch (err) {
    console.error(err);
  }
}

// Setup the UI
async function init() {
  console.log("Loading workspace from session storage");
  let jsonStr = sessionStorage.getItem("workspace");
  if (jsonStr) {
    Blockly.serialization.workspaces.load(JSON.parse(jsonStr), workspace);
  } else {
    // Load the sample workspace
    // console.log("Loading starter workspace...");
    // const response = await fetch(`./examples/starter.json`);
    // const json = await response.json();
    // Blockly.serialization.workspaces.load(json, workspace);
  }

  document.getElementById("run").onclick = async () => {
    console.log("run button pressed");
    await run();
  };

  document.getElementById("clear").onclick = () => {
    console.log("clear session button pressed");
    if (confirm("Clearing the workspace will lose all unsaved work. Continue?")) {
      sessionStorage.removeItem("workspace");
      location.reload();
    }
  };

  document.getElementById("download").onclick = () => {
    console.log("download workspace button pressed");
    let file = new Blob([sessionStorage.getItem("workspace")], {
      type: "text/json",
    });
    let a = document.createElement("a"),
      url = URL.createObjectURL(file);
    a.href = url;
    a.download = "cv-workspace.json";
    document.body.appendChild(a);
    a.click();
    setTimeout(function () {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 0);
  };

  document.getElementById("upload").onchange = async (e) => {
    console.log("upload workspace from file");
    let file = e.target["files"][0];
    if (!file) {
      return;
    }
    let reader = new FileReader();
    reader.onload = function (e) {
      let json = e.target.result;
      Blockly.serialization.workspaces.load(JSON.parse(json.toString()), workspace);
      sessionStorage.setItem("workspace", json.toString());
    };
    reader.readAsText(file);
  };

  const broadcastColumnResize = (e) => {
    // Add some hard limits to the column resizing
    if (e.clientX < 200 || e.clientX > window.innerWidth - 200) return;

    let windowWidth = window.innerWidth;
    let runArea = document.getElementById("runArea");
    runArea.style.width = `${((window.innerWidth - e.clientX) / windowWidth) * 100}%`;


    let blocklyArea = document.getElementById("blocklyArea");
    blocklyArea.style.width = `${(e.clientX / windowWidth) * 100}%`;
    
    let columnResizedEvent = new Event("resize");
    window.dispatchEvent(columnResizedEvent);
  };

  // Column resizer control using pointer events to support mouse and touch
  document.getElementById("columnResizer").onpointerdown = () => {
    document.addEventListener("pointermove", broadcastColumnResize);
    document.onpointerup = () => {
      console.log("resize complete");
      document.removeEventListener("pointermove", broadcastColumnResize);
    };
  };
}




init().then();