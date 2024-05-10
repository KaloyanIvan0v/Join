/**
 * A token used for authenticating with the remote storage.
 * @constant {string}
 */
const STORAGE_TOKEN = "XVGgAdqS3oISPZQ7RH089kSBpZO9FuR1CdKlSoExZyPjHKWZmkHEk9QXBcVa6C4r";

/**
 * The base URL of the remote storage API.
 * @constant {string}
 */
const STORAGE_URL = "https://remote-storage.developerakademie.org/item";

/**
 * Stores a key-value pair in the remote storage.
 *
 * @param {string} key - The key under which the value is stored.
 * @param {any} value - The value to be stored. It can be any serializable object.
 * @returns {Promise<any>} - The JSON response from the remote storage API.
 */
async function setItem(key, value) {
  const payload = { key, value, token: STORAGE_TOKEN };
  return fetch(STORAGE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  }).then((res) => res.json());
}

/**
 * Retrieves the value associated with a key from the remote storage.
 *
 * @param {string} key - The key for which to retrieve the value.
 * @returns {Promise<any>} - The value associated with the provided key.
 * @throws {Error} - Throws an error if the key is not found in the storage.
 */
async function getItem(key) {
  const url = `${STORAGE_URL}?key=${key}&token=${STORAGE_TOKEN}`;
  return fetch(url)
    .then((res) => res.json())
    .then((res) => {
      if (res.data) {
        return res.data.value;
      } else {
        throw new Error(`Could not find data with key "${key}".`);
      }
    });
}
