import Disableable from "./disableable";

/**
 * Watches the given inputField, making Disableable object disabled whenever
 * the inputField is empty.
 * @param {HTMLInputElement} inputField Input element to watch.
 * @param {Disableable} toDisable Object to disable when input is empty.
 * @throws {TypeError} If inputField or toDisable are not required typed.
 */
export default function disableWhenEmpty(inputField, toDisable) {
  if (!inputField || !(inputField instanceof HTMLInputElement)) {
    throw new TypeError(`Expected inputField to be HTMLInputElement, but got ${inputField}`);
  }
  if (!toDisable || !(toDisable instanceof Disableable)) {
    throw new TypeError(`Expected toDisable to be Disableable, but got ${toDisable}`);
  }

  const disableCause = 'inputFieldEmpty';

  const updateDisabled = () => {
    if (inputField.value.length === 0) {
      toDisable.addDisableCause(disableCause);
    } else {
      toDisable.removeDisableCause(disableCause);
    }
  }

  inputField.addEventListener('input', updateDisabled);

  // run the update once as soon as the link is created
  updateDisabled();
}
