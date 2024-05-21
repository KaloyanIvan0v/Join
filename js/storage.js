/**
 * A token used for authenticating with the remote storage.
 * @constant {string}
 */
const STORAGE_TOKEN = "XVGgAdqS3oISPZQ7RH089kSBpZO9FuR1CdKlSoExZyPjHKWZmkHEk9QXBcVa6C4r";

/**
 * The base URL of the remote storage API.
 * @constant {string}
 */
const STORAGE_URL = "https://join-6783b-default-rtdb.europe-west1.firebasedatabase.app/";

/**
 * Stores a key-value pair in the remote storage.
 *
 * @param {string} key - The key under which the value is stored.
 * @param {any} value - The value to be stored. It can be any serializable object.
 * @returns {Promise<any>} - The JSON response from the remote storage API.
 */
async function setItem(path, data = {}) {
  let response = await fetch(STORAGE_URL + path + ".json", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return (responseToJson = await response.json());
}

/**
 * Retrieves the value associated with a key from the remote storage.
 *
 * @param {string} key - The key for which to retrieve the value.
 * @returns {Promise<any>} - The value associated with the provided key.
 * @throws {Error} - Throws an error if the key is not found in the storage.
 */
async function getItem(path) {
  let response = await fetch(STORAGE_URL + path + ".json");
  return (responseToJson = await response.json());
}
