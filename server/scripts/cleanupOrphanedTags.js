const db = require(`../db`)
const Tag = db.model(`tag`)
const RecipeTraits = db.model(`recipeTraits`)

const cleanupOrpanedTags = async () => {
  const tags = await Tag.findAll()
  const tagAssociationsP = []
  tags.forEach(tag => {
    tagAssociationsP.push(RecipeTraits.findOne({where : {tagId : tag.id}}))
  })
  const tagAssociations = await Promise.all(tagAssociationsP)
  const toBeDestroyed = []
  tagAssociations.forEach((association, i) => {
    if(!association){
      toBeDestroyed.push(Tag.destroy({where : {id : tags[i].id}}))
    }
  })
  await Promise.all(toBeDestroyed)
  const updatedTags = await Tag.findAll()
  const removed = tags.length - updatedTags.length
  console.log(`${removed} out of ${tags.length} tag${tags.length > 1 || tags.length === 0 ? `s` : ``} destroyed`)
  console.log(`${updatedTags.length} tag${updatedTags.length > 1 || tags.length === 0 ? `s` : ``} remaining`)
}

if(module === require.main){
  console.log(`Cleaning...\n`);
  (async () => {
    try{
      await cleanupOrpanedTags()
      console.log(`\nCleaning complete`)
    }catch(error){
      console.log(error)
      process.exitCode = 1
    }finally{
      db.close()
    }
  })()
}

module.exports = cleanupOrpanedTags
