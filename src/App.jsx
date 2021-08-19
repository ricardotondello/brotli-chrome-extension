import React, { useState } from 'react';
import decompress from 'brotli/decompress';
import {Buffer} from 'buffer/';
import ReactJson from 'react-json-view';

const App = () => {
  const [valueDecompressed, setValueDecompressed] = useState('')

  function xToBuffer(str) {
    let result = '';

    for(var i = 0; i < str.length;) {
      if (str.substr(i, 2) == "\\x") {
        result += str.substr(i + 2, 2);
        i+=4;
      }
      else {
        result += Buffer.from(str[i++]).toString('hex')
      }
    }
    
    return Buffer.from(result, 'hex');
  }

  function base64ToHex(str) {
    const raw = atob(str);
    let result = '';
    for (let i = 0; i < raw.length; i++) {
      const hex = raw.charCodeAt(i).toString(16);
      result += (hex.length === 2 ? hex : '0' + hex);
    }
    var resultString = result.toUpperCase();
    return Buffer.from(resultString, "hex");
  }

  function ArrayToJson(decompressed){
    var res = '';
    var chunk = 8 * 1024;
    var i;
    for (i = 0; i < decompressed.length / chunk; i++) {
      res += String.fromCharCode.apply(null, decompressed.slice(i * chunk, (i + 1) * chunk));
    }
    res += String.fromCharCode.apply(null, decompressed.slice(i * chunk));
    return res;
  }

  function decompressFunction() {
    var str = document.getElementById("hash").value;

    try {
      //try array of string first
      var bufferArray = xToBuffer(str);
      var decompressed = decompress(bufferArray);

      return ArrayToJson(decompressed);
    } catch (e) {
    }

    try {
      //try with base64
      var bufferArray = base64ToHex(str);
      
      var decompressed = decompress(bufferArray);

      return ArrayToJson(decompressed);
    } catch (error) { 
      return 'Could not decompress: ' + error.message;
    }
  }

  function ToJsonObject(value)
  {
    if (value === '') return;
    return JSON.parse(value);
  }
  return (
    <div>
      <h4>Brotli decompress</h4>
      <br />
      <textarea id="hash" name="hash" rows="10" cols="100" placeholder="Paste your array of bytes here or base64..."></textarea>
      
      <ReactJson src={ToJsonObject(valueDecompressed)} name={false} displayDataTypes={false}/>
      <button id="decompress_btn" onClick={() => { setValueDecompressed(decompressFunction) }}>Decompress</button>
      <p><i>Powered by Ricardo Tondello (@rito01)</i></p>
    </div>
  );
};

export default App;
