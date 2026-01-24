/**
 * Renders the given data into a DOM element
 *
 * @param {string} state - whether the data is an array or a single element
 * @param {function} htmlStructure - the function to render the data into a DOM element
 * @param {*} data - the data to render into a DOM element
 * @returns {HTMLElement} - the rendered DOM element
 */
export const DomRenderHtml = (state = "el", htmlStructure, data) => {
  let dummyEl = document.createElement("div");

  // If the data is an array, map over it and render each item
  if (state === "array") {
    const html = data.map((item) => htmlStructure(item)).join("");
    dummyEl.innerHTML = html;
  } else if (state === "array as table") {
    dummyEl = document.createElement("table");
    const html = data.map((item) => htmlStructure(item)).join("");
    dummyEl.innerHTML = html;
  }
  // Otherwise, render the single item
  else {
    dummyEl.innerHTML = htmlStructure(data);
  }

  // Return the rendered DOM element
  return dummyEl.innerHTML;
};

export const DomRenderText = (textData) => {
  const dummyEl = document.createElement("div");
  dummyEl.innerHTML = textData;
  return dummyEl.children[0];
};
