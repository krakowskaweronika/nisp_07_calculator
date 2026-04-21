const display = document.getElementById("display");

function appendNumber(value) {
  display.value += value;
}

function add() {
  const values = display.value.split("+");
  if (values.length === 2) {
    display.value = Number(values[0]) + Number(values[1]);
  }
}

function subtract() {
  const values = display.value.split("-");
  if (values.length === 2) {
    display.value = Number(values[0]) - Number(values[1]);
  }
}

function multiply() {
  const values = display.value.split("*");
  if (values.length === 2) {
    display.value = Number(values[0]) * Number(values[1]);
  }
}

function divide() {
  const values = display.value.split("/");
  if (values.length === 2) {
    display.value = Number(values[0]) / Number(values[1]);
  }
}