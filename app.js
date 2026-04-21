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

class RPNEngine {
    // Definiujemy priorytety operatorów jako pole statyczne
    static #precedence = {
        '+': 2, '-': 2,
        '*': 3, '/': 3
    };

    /**
     * Główna metoda przetwarzająca ciąg znaków na wynik
     */
    static execute(expression) {
        const tokens = this.#tokenize(expression);
        const rpn = this.#shuntingYard(tokens);
        return this.#evaluateRPN(rpn);
    }

    static #tokenize(str) {
        // Regex wyłapujący liczby (w tym dziesiętne) oraz operatory/nawiasy
        const tokens = str.match(/\d+\.\d+|\d+|[\+\-\*\/\(\)]/g);
        if (!tokens) throw new Error("Puste wyrażenie");
        return tokens.map(t => isNaN(t) ? t : parseFloat(t));
    }

    static #shuntingYard(tokens) {
        const output = [];
        const stack = [];

        tokens.forEach(token => {
            if (typeof token === 'number') {
                output.push(token);
            } else if (token === '(') {
                stack.push(token);
            } else if (token === ')') {
                while (stack.length && stack[stack.length - 1] !== '(') {
                    output.push(stack.pop());
                }
                stack.pop(); // Usuń '('
            } else {
                while (stack.length && this.#precedence[stack[stack.length - 1]] >= this.#precedence[token]) {
                    output.push(stack.pop());
                }
                stack.push(token);
            }
        });

        while (stack.length) output.push(stack.pop());
        return output;
    }

    static #evaluateRPN(rpn) {
        const stack = [];
        rpn.forEach(token => {
            if (typeof token === 'number') {
                stack.push(token);
            } else {
                const b = stack.pop();
                const a = stack.pop();
                switch (token) {
                    case '+': stack.push(a + b); break;
                    case '-': stack.push(a - b); break;
                    case '*': stack.push(a * b); break;
                    case '/': 
                        if (b === 0) throw new Error("Dzielenie przez zero");
                        stack.push(a / b); 
                        break;
                }
            }
        });
        return stack[0];
    }
}

class CalculatorUI {
    constructor(displayElement) {
        this.display = displayElement;
    }

    append(value) {
        this.display.value += value;
    }

    clear() {
        this.display.value = "";
    }

    delete() {
        this.display.value = this.display.value.slice(0, -1);
    }

    renderResult() {
        try {
            const expression = this.display.value;
            const result = RPNEngine.execute(expression);
            
            // Formatowanie wyniku: max 4 miejsca po przecinku
            this.display.value = Number(Math.round(result + 'e4') + 'e-4');
        } catch (error) {
            this.display.value = "Błąd";
            console.error(error.message);
            setTimeout(() => this.clear(), 1500);
        }
    }
}

// Inicjalizacja aplikacji
const calcUI = new CalculatorUI(document.getElementById("display"));

// Mapowanie funkcji globalnych na metody klasy dla przycisków HTML
window.appendValue = (val) => calcUI.append(val);
window.clearDisplay = () => calcUI.clear();
window.deleteLast = () => calcUI.delete();
window.calculate = () => calcUI.renderResult();