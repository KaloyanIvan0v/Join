/**
 * The base URL of the remote storage API.
 * @constant {string}
 */
const STORAGE_URL = 'https://join-6783b-default-rtdb.europe-west1.firebasedatabase.app/'

/**
 * Stores a key-value pair in the remote storage.
 *
 * @param {string} key - The key under which the value is stored.
 * @param {any} value - The value to be stored. It can be any serializable object.
 * @returns {Promise<any>} - The JSON response from the remote storage API.
 */
async function setItem(path = '', data = {}) {
  await fetch(STORAGE_URL + path + '.json', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
}

/**
 * Retrieves the value associated with a key from the remote storage.
 *
 * @param {string} key - The key for which to retrieve the value.
 * @returns {Promise<any>} - The value associated with the provided key.
 * @throws {Error} - Throws an error if the key is not found in the storage.
 */
async function getItem(path = '') {
  try {
    let response = await fetch(STORAGE_URL + path + '.json')
    let data = await response.json()
    return data !== '' && data !== null ? data : []
  } catch (error) {
    console.error('Error fetching data:', error)
    return []
  }
}
