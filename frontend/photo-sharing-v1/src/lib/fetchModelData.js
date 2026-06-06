/**
 * fetchModel - Fetch a model from the web server.
 *
 * @param {string} url      The URL to issue the GET request.
 * @return {Promise}
 */
function fetchModel(url) {
  return new Promise(async (resolve, reject) => {
    try{
      const response = await fetch(url, {
        credentials: 'include'
      })
      if(!response.ok){
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      resolve(data)
    }
    catch(err){
      console.error("Fetch model error: ", err);
      reject(err)
    }
  })
}

export default fetchModel;
