class Calculator {
    constructor(previousOperandTextElement, currentOperandTextElement) {
      this.previousOperandTextElement = previousOperandTextElement
      this.currentOperandTextElement = currentOperandTextElement
      this.clear()
    }
  
    clear() { /*Clears out and resets calculator by removing operands or performed operations.*/
      this.currentOperand = ''
      this.previousOperand = ''
      this.operation = undefined
    }
  
    delete() { /*Removes most recent character from the current operation being performed. */
      this.currentOperand = this.currentOperand.toString().slice(0, -1)
    }
  
    appendNumber(number) { /*Adds number or decimal to current operation.*/
      if (number === '.' && this.currentOperand.includes('.')) 
        return /*Prevents multiple decimals.*/

      if (number === 'π') { /*ENHANCEMENT 2: Adding Pi functionality here so it will be a constant. */
        this.currentOperand = this.currentOperand.toString() + Math.PI.toString()
        return
      }

      if(number === 'e') { /*ENHANCEMENT 2: Adding E as well so it will be a constant. */
        this.currentOperand = this.currentOperand.toString() + Math.E.toString()
        return
      }

      this.currentOperand = this.currentOperand.toString() + number.toString()
    }
  
    chooseOperation(operation) { /*Choose which operation needs to be performed. Move current operand to previous.*/
      if (this.currentOperand === '') return
      if (this.previousOperand !== '') {
        this.compute()
      }
      this.operation = operation
      this.previousOperand = this.currentOperand
      this.currentOperand = ''
    }
  
    compute() {
    let computation
    const prev = parseFloat(this.previousOperand)
    const current = parseFloat(this.currentOperand)
    /*ENHANCEMENT 2: Separated my compute function into 2 main switch cases. The first only takes one input (prev variable) to work while everything after 'else'
    takes two inputs (prev and current). */
    if (['cos', 'sin', 'tan', 'log', 'ln', '√', '%'].includes(this.operation)) { 
      if (isNaN(prev)) return
      switch (this.operation) {
        case 'cos': /*Cosine. */
          computation = Math.cos(prev * Math.PI / 180)
          break
        case 'sin': /*Sine. */
          computation = Math.sin(prev * Math.PI / 180)
          break
        case 'tan': /*Tangent. */
          computation = Math.tan(prev * Math.PI / 180)
          break
        case 'log': /*Log. */
          computation = Math.log10(prev)
          break
        case 'ln': /*Natural log. */
          computation = prev <= 0 ? Error :Math.log(prev)
          break
        case '√': /*Square root. */
          computation = prev < 0 ? Error : Math.sqrt(prev)
          break
        case '%': /*Percent. Coded to work as 10% = .10 or 35% = .35. */
          computation = prev / 100
          break
        }
    } else {
      if (isNaN(prev) || isNaN(current)) return

      switch (this.operation) {
        case '+': /*Addition. */
          computation = prev + current
          break
        case '-': /*Subtraction. */
          computation = prev - current
          break
        case '*': /*Multiplication. */
          computation = prev * current
          break
        case '/': /*Division. */
          computation = current === 0 ? "Error" : prev / current /*Error handling for division by 0.*/
          break
        case '^': /*Power. */
          computation = Math.pow(prev, current)
          break
      }
    }

  this.currentOperand = computation
  this.operation = undefined
  this.previousOperand = ''
}

  
    getDisplayNumber(number) { /*Introducing comma and decimal functionality while formatting numbers to display properly.*/
      if (number === 'Error') {
        return 'Error'; /*Returns "Error" if the result is an error.*/
      }
      const stringNum = number.toString()
      const integerDigits = parseFloat(stringNum.split('.')[0])
      const decimalDigits = stringNum.split('.')[1]
      let integerDisplay
      if (isNaN(integerDigits)) {
        integerDisplay = ''
      } else {
        integerDisplay = integerDigits.toLocaleString('en', { maximumFractionDigits: 0 })
      }
      if (decimalDigits != null) {
        return `${integerDisplay}.${decimalDigits}`
      } else {
        return integerDisplay
      }
    }
  
    updateDisplay() { /*Updates display for operation with current values.*/
      this.currentOperandTextElement.innerText =
        this.getDisplayNumber(this.currentOperand)
      if (this.operation != null) {
        this.previousOperandTextElement.innerText =
          `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`
      } else {
        this.previousOperandTextElement.innerText = ''
      }
    }
  }
  
  /*querySelectors parse html file for associated buttons. */
  const numberButtons = document.querySelectorAll('[data-number]')
  const operationButtons = document.querySelectorAll('[data-operation]')
  const equalsButton = document.querySelector('[data-equals]')
  const deleteButton = document.querySelector('[data-delete]')
  const allClearButton = document.querySelector('[data-all-clear]')
  const previousOperandTextElement = document.querySelector('[data-previous-operand]')
  const currentOperandTextElement = document.querySelector('[data-current-operand]')
  
  const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement)
  
  /*Creating button functionality through mouse clicks.*/
  numberButtons.forEach(button => {/*For number input.*/
    button.addEventListener('click', () => {
      calculator.appendNumber(button.innerText)
      calculator.updateDisplay()
    })
  })
  
  operationButtons.forEach(button => { /*For operand input.*/
    button.addEventListener('click', () => {
      calculator.chooseOperation(button.innerText)
      calculator.updateDisplay()
    })
  })
  
  equalsButton.addEventListener('click', button => { /*For equals (=) input.*/
    calculator.compute()
    calculator.updateDisplay()
  })
  
  allClearButton.addEventListener('click', button => { /*For AC input.*/
    calculator.clear()
    calculator.updateDisplay()
  })
  
  deleteButton.addEventListener('click', button => { /*For Delete input.*/
    calculator.delete()
    calculator.updateDisplay()
  })

/*ENHANCEMENT 1*/
/*Keyboard functionality*/
document.addEventListener('keydown', event => {
  if (!isNaN(event.key) || event.key === '.') { /*If a number or period is pressed.*/
    calculator.appendNumber(event.key)
    calculator.updateDisplay()

  } else if (['+', '-', '*', '/', '^'].includes(event.key)) { /*Operator is chosen by dual-input operator keys (Meaning it takes 2 numbers to work).*/
    calculator.chooseOperation(event.key)
    calculator.updateDisplay()

  } else if (event.key === 'Enter' || event.key === '=') { /*Compute on Enter or Equals key.*/
    calculator.compute()
    calculator.updateDisplay()

  } else if (event.key === 'Backspace') { /*Backspace as delete.*/
    calculator.delete()
    calculator.updateDisplay()

  } else if (event.key === 'Escape') { /*Changed key input to 'esc' from 'c' for clear to make 'c' for cosine.*/
    calculator.clear()
    calculator.updateDisplay()

/*ENHANCEMENT 2: ADDED KEYBOARD FUNCTIONALITY FOR ADDED COMPUTATIONS*/
/*Only one number needs to be input for the functions to work, so they are coded individually */
  } else if (event.key === 'c') { /*Cos*/
    calculator.chooseOperation('cos')
    calculator.updateDisplay()

  } else if (event.key === 's') { /*Sin*/
    calculator.chooseOperation('sin')
    calculator.updateDisplay()

  } else if (event.key === 't') { /*Tan*/
    calculator.chooseOperation('tan')
    calculator.updateDisplay()

  } else if (event.key === 'l') { /*Log*/
    calculator.chooseOperation('log')
    calculator.updateDisplay()

  } else if (event.key === 'n') { /*Natural log.*/
    calculator.chooseOperation('ln')
    calculator.updateDisplay()
 
  } else if (event.key === 'r') { /*Square root*/
    calculator.chooseOperation('√')
    calculator.updateDisplay()
  
  } else if (event.key === 'p') { /*Pi*/
    calculator.appendNumber('π')
    calculator.updateDisplay()
  
  } else if (event.key === 'e') { /*E*/
    calculator.appendNumber('e')
    calculator.updateDisplay()
  
  } else if (event.key === '%') { /*Percentage of number entered. */
    calculator.chooseOperation('%')
    calculator.updateDisplay()

  }
})