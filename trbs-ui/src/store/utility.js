export const updateObject = (oldObject, updatedProperties) => {
  return {
    ...oldObject,
    ...updatedProperties,
  };
};

export const encodeData = (str) => {
  // 1. Check whether the str is already encod0ed
  // 2. if (1) YES then skip
  // 3. if (1) NO then encode the str

  // if (isBase64(str) === true) {
  //   return str;
  // }

  var encoded = "";
  str = btoa(str);
  str = btoa(str);
  for (let i = 0; i < str.length; i++) {
    var a = str.charCodeAt(i);
    var b = a ^ 10; // bitwise XOR with any number, e.g. 123
    encoded = encoded + String.fromCharCode(b);
  }
  encoded = btoa(encoded);
  return encoded;
};

export const dataDecode = (encoded) => {
  // 1. Check whether the str is already decodoed
  // 2. if (1) YES then skip
  // 3. if (1) NO then decode the str

  // if (isBase64(encoded) === false) {
  //   return encoded;
  // }

  encoded = atob(encoded);
  let decoded = "";

  for (let i = 0; i < encoded.length; i++) {
    let b = encoded.charCodeAt(0);
    let a = b ^ 10;
    decoded += String.fromCharCode(a);
  }
  return atob(atob(decoded));
};

// function isBase64(str) {
//   if (str === null || str.trim() === "") {
//     return false;
//   }
//   try {
//     return btoa(atob(str)) === str;
//   } catch (err) {
//     return false;
//   }
// }
