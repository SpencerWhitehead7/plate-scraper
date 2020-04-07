const chowhound = (recipe, html) => {
  recipe.title = html(`h1`).text()
  html(`.freyja_box.freyja_box81 ul li`).each(function() {
    recipe.ingredients.push(`${html(this).text().trim()}`)
  })
  html(`.freyja_box.freyja_box82 ol li`).each(function() {
    let instruction = `${html(this).text().trim()}`
    let count = 0
    while ((/[0-9]/).test(instruction[count])) {
      count++
    }
    instruction = instruction.slice(count).trim()
    recipe.instructions.push(instruction) // to deal with some html BS
  })
}

module.exports = chowhound
