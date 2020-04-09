const getCleanStrings = ($, selector, context = null, additionalCleaners = []) => $(selector, context || undefined)
  .map(function() {
    let res = $(this)
      .text()
      .trim()
      .replace(/\s+/g, ` `)

    additionalCleaners.forEach(([filter, replacer = ``]) => {
      res = res.replace(filter, replacer)
    })

    return res
  })
  .get()
  .filter(string => Boolean(string))

const getRecipe = (url, title, ingredients, instructions) => [
  `Source: ${url}`,
  ``,
  ...title,
  ``,
  `Ingredients`,
  ``,
  ...ingredients,
  ``,
  `Instructions`,
  ``,
  ...instructions.reduce((formattedInstructions, instruction) => {
    formattedInstructions.push(instruction)
    formattedInstructions.push(``)
    return formattedInstructions
  }, []), // each instruction with a line break between
].join(`\n`)

module.exports = {
  getCleanStrings,
  getRecipe,
}
