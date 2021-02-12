/**
 * Wraps an HTML element so it can be easily shown or hidden.
 * @param {Element} element HTML Element that will have its visibility changed.
 */
export default function makeHideable(element) {
  if (!(element instanceof Element)) {
    console.log('That\'s not an Element');
    throw new TypeError('Expected to be an Element.');
  }

  const hiddenStyle = 'none';
  let isVisible = !(element.style.display === hiddenStyle);
  const visibleStyle = isVisible ? element.style.display : 'block';

  function show() {
    if (isVisible) {
      return;
    }
    element.style.display = visibleStyle;
    isVisible = true;
  }

  function hide() {
    if (!isVisible) {
      return;
    }
    element.style.display = hiddenStyle;
    isVisible = false;
  }

  function toggleVisibility() {
    if (isVisible) {
      hide();
    } else {
      show();
    }
  }

  return {
    element,
    show,
    hide,
    toggleVisibility,
  }
}
