module.exports = arr => {
  var result = []

  for (var item of arr) {
    if (typeof item === 'string' && item.trim().length > 0) {
      result.push(item.trim())
    }
  }

  return result
}
