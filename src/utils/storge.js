
function set(key, data) {
  window.sessionStorage.setItem(key, JSON.stringify(data))
}

function get(key) {
  return JSON.parse(window.sessionStorage.getItem(key))
}

const storge = {
  set,
  get
}
export default storge
