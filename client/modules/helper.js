export const wait = ms => new Promise(res => setTimeout(res, ms));

export const recordKeyPress = async () => {
  const keyStart = Date.now();
  document.getElementById('instr').style.display = 'block';
  await new Promise(resolve => window.addEventListener('keydown', resolve, { once: true }));
  document.getElementById('instr').style.display = 'none';
  console.log((Date.now()-keyStart)/1000);
  return Date.now()-keyStart;
}

export const getDateISO = (date) => {
  return new Date(date).toJSON();
}
