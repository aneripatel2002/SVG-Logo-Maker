// Inquirer (node package manager) import
const inquirer = require("inquirer");

// File system module (node package manager) import
const fs = require("fs");

// Importing classes from ./shapes directory
const { Triangle, Square, Circle } = require("./shapes");

// Function writes the SVG file using user answers from inquirer prompts
function writeToFile(fileName, answers) {
  // File starts as an empty string
  let svgString = '<svg version="1.1" width="300" height="200" xmlns="http://www.w3.org/2000/svg">';
  // <g> tag wraps <text> tag so that user font input layers on top of polygon -> not behind
  svgString += "<g>";
  
  let shapeChoice;
  if (answers.shape === "Triangle") {
    shapeChoice = new Triangle();
  } else if (answers.shape === "Square") {
    shapeChoice = new Square();
  } else {
    shapeChoice = new Circle();
  }
  
  shapeChoice.setColor(answers.shapeBackgroundColor);
  svgString += shapeChoice.render();

  // <text> tag gives rise to text alignment, text-content/text-color taken in from user prompt and gives default font size of "40"
  svgString += `<text x="150" y="130" text-anchor="middle" font-size="40" fill="${answers.textColor}">${answers.text}</text>`;
  // Closing </g> tag
  svgString += "</g>";
  // Closing </svg> tag
  svgString += "</svg>";

  // Using file system module to generate svg file, takes in file name given in the promptUser function, the svg string, and a ternary operator which handles logging any errors, or a "Generated logo.svg" message to the console  
  fs.writeFile(fileName, svgString, (err) => {
    err ? console.log(err) : console.log("Generated logo.svg");
  });
}

// This function utilizes inquirer .prompt to prompt the user to answer questions in the command line and save user input
async function promptUser() {
  let validInput = false;
  while (!validInput) {
    const answers = await inquirer.prompt([
      // Text prompt
      {
        type: "input",
        message:
          "What text would you like your logo to display? (Enter up to three characters)",
        name: "text",
      },
      // Text color prompt
      {
        type: "input",
        message:
          "Choose text color (Enter color keyword OR a hexadecimal number)",
        name: "textColor",
      },
      // Shape choice prompt
      {
        type: "list",
        message: "What shape would you like the logo to render?",
        choices: ["Triangle", "Square", "Circle"],
        name: "shape",
      },
      // Shape color prompt
      {
        type: "input",
        message:
          "Choose shape's color (Enter color keyword OR a hexadecimal number)",
        name: "shapeBackgroundColor",
      },
    ]);

    // Error handling for text prompt (user must enter 3 characters or less for logo to generate)
    if (answers.text.length <= 3) {
      writeToFile("logo.svg", answers);
      validInput = true;
    } else {
      console.log("Must enter a value of no more than 3 characters");
    }
  }
}

// Calling promptUser function so inquirer prompts fire off when the application is run
promptUser();
