/* eslint-disable init-declarations */

const SUCCESS = `SUCCESS`
const ERROR = `ERROR`

const createTestInstance = async (model, isTesting, ...inputParams) => {
  let res
  const instanceParams = {}
  inputParams.forEach(inputParam => {
    instanceParams[inputParam[0]] = inputParam[1]
  })
  try{
    const testModel = await model.create(instanceParams)
    if(isTesting === SUCCESS){
      res = testModel
    }else{
      console.log(`EXPECTED ERROR, BUT SUCCEEDED`)
    }
  }catch(err){
    if(isTesting === ERROR){
      res = err
    }else{
      console.log(`EXPECTED SUCCESS, BUT ERRORED:`, err)
    }
  }
  return res
}

module.exports = {
  SUCCESS,
  ERROR,
  createTestInstance,
}
