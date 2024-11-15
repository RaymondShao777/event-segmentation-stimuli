export const wait = ms => new Promise(res => setTimeout(res, ms));

export const recordKeyPress = async () => {
  const keyStart = Date.now();
  document.getElementById('label').style.display = 'block';
  await new Promise(resolve => window.addEventListener('keydown', resolve, { once: true }));
  document.getElementById('label').style.display = 'none';
  console.log((Date.now()-keyStart)/1000);
  return Date.now()-keyStart;
}

export const getDateISO = (date) => {
  return new Date(date).toJSON();
}

export const rgbString = (rgb) => {
  return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
}

export const fileName = (path) => {
  return path.replace(/(^.*\/.*\/)|(\..*)/g, "");
}

export const revealLabel = (label) => {
  document.getElementById('label').innerHTML = label;
  document.getElementById('label').style.display = 'block';
}

export const hideLabel = () => {
  document.getElementById('label').style.display = 'none';
}

//export const fetchURL = "http://localhost:3000/";
export const fetchURL = "https://studyfall24ax.psych.ucla.edu:3000/";
