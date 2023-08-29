const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");

const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");

const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#Numbers");

const symbolsCheck = document.querySelector("#Symbols");
const indicator = document.querySelector("[data-indicator]");

const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");

const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();
// Set Strength Circle Color to grey
setIndicator("#ccc");
// Set Password Length
// function handleSlider() {
//   inputSlider.value = passwordLength;
//   lengthDisplay.innerText = passwordLength;
 
//   const min = parseFloat(inputSlider.min);
//   const max = parseFloat(inputSlider.max);
//   const range = max - min;
//   const valueInRange = passwordLength - min;
//   const percentage = (valueInRange / range) * 100;

//   inputSlider.style.backgroundSize = `${percentage}% 100%`;
// }

function handleSlider()
{
  inputSlider.value = passwordLength;
  lengthDisplay.innerText = passwordLength;
  const min = inputSlider.min;
  const max = inputSlider.max;

  inputSlider.style.backgroundSize = ( (passwordLength - min) * 100 / (max - min)) + "% 100%";
}

// Set Indicator

function setIndicator(color) {
  indicator.style.backgroundColor = color;
  indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function getRandInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomNumbers() {
  return getRandInteger(0,9);
}

function generateRandomLowerCase() {
  return String.fromCharCode(getRandInteger(97, 123));
}

function generateRandomUpperCase() {
  return String.fromCharCode(getRandInteger(65, 91));
}

function generateSymbol() {
  let randNum = getRandInteger(0, symbols.length);
  return symbols.charAt(randNum);
}

function calcStrength() {
  let hasUpper = false;
  let hasLower = false;
  let hasNumber = false;
  let hasSymbol = false;

  if (uppercaseCheck.checked) hasUpper = true;
  if (lowercaseCheck.checked) hasLower = true;
  if (numbersCheck.checked) hasNumber = true;
  if (symbolsCheck.checked) hasSymbol = true;

  if (hasUpper && hasLower && (hasNumber || hasSymbol) && passwordLength >= 8) {
    setIndicator("#0f0");
  } else if (
    (hasLower || hasUpper) &&
    (hasNumber || hasSymbol) &&
    passwordLength >= 6
  ) {
    setIndicator("#ff0");
  } else {
    setIndicator("#f00");
  }
}

async function copyContent() {
  try {
    await navigator.clipboard.writeText(passwordDisplay.value);
    copyMsg.innerText = "copied";
  } catch (e) {
    copyMsg.innerText = "Failed";
  }
  // To Make Copy wala span visible
  copyMsg.classList.add("active");

  setTimeout(() => {
    copyMsg.classList.remove("active");
  }, 2000);
}

inputSlider.addEventListener("input", (e) => {
  passwordLength = e.target.value;
  handleSlider();
});

copyBtn.addEventListener("click", () => {
  if (passwordDisplay.value) {
    copyContent();
  }
});

function shufflePassword(array)
{
    // Fisher Yates Method
    for(let i = array.length - 1; i > 0; i--)
    {
        const j = Math.floor(Math.random() * (i+1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

// CheckBoxes;
function handleCheckBoxChange() {
  checkCount = 0;
  allCheckBox.forEach((checkbox) => {
    if (checkbox.checked) checkCount++;
  });

  // Edge Case;

  if (passwordLength < checkCount) {
    passwordLength = checkCount;
    handleSlider();
  }
}

allCheckBox.forEach((checkbox) => {
  checkbox.addEventListener("change", handleCheckBoxChange);
});

// Generate Password
generateBtn.addEventListener("click", () => {
  // None of the Checkbox are Selected;
  if (checkCount <= 0) return;

  if (passwordLength < checkCount) {
    passwordLength = checkCount;
    handleSlider();
  }

  // Let's start the journey to find new password

  // Remove old password
  password = "";

  let funcArr = [];

  if (uppercaseCheck.checked) funcArr.push(generateRandomUpperCase);
  if (lowercaseCheck.checked) funcArr.push(generateRandomLowerCase);
  if (numbersCheck.checked) funcArr.push(generateRandomNumbers);
  if (symbolsCheck.checked) funcArr.push(generateSymbol);

  // Compulsory Addition
  for (let i = 0; i < funcArr.length; i++) {
    password += funcArr[i]();
  }
  console.log(password);
  // Remaining Addition
  for (let i = 0; i < passwordLength - funcArr.length; i++) {
    let randIndex = getRandInteger(0, funcArr.length);
    password += funcArr[randIndex]();
  }
  // Shuffle The password
  password = shufflePassword(Array.from(password));
  passwordDisplay.value = password;

  // calculate Strength;
  calcStrength();
});
