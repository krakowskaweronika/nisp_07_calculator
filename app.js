const display = document.getElementById("display");

function appendValue(value) {
  // Zapobiega zaczynaniu od operatora
  if (display.value === "" && isNaN(value) && value !== '-') return;
  display.value += value;
}

function clearDisplay() {
  display.value = "";
}

function deleteLast() {
  display.value = display.value.slice(0, -1);
}

function calculate() {
  try {
    // eval() obliczy całe wyrażenie matematyczne (np. 2+2*5)
    const result = eval(display.value);
    
    if (result === Infinity || isNaN(result)) {
      display.value = "Błąd";
    } else {
      // Zaokrąglanie do 4 miejsc po przecinku, żeby nie psuć layoutu
      display.value = Number(Math.round(result + 'e4') + 'e-4');
    }
  } catch (error) {
    display.value = "Błąd";
    setTimeout(clearDisplay, 1500); // Czyści błąd po 1.5s
  }
}

// Obsługa klawiatury (bonus dla profesjonalizmu)
document.addEventListener('keydown', (e) => {
  if (e.key >= 0 && e.key <= 9) appendValue(e.key);
  if (['+', '-', '*', '/'].includes(e.key)) appendValue(e.key);
  if (e.key === 'Enter') calculate();
  if (e.key === 'Escape') clearDisplay();
  if (e.key === 'Backspace') deleteLast();
});