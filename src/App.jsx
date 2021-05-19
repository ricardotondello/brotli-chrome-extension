import React, { useState } from 'react';
import decompress from 'brotli/decompress';
import {Buffer} from 'buffer/';

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

  function decompressFunction() {
    try {
      var str = document.getElementById("hash").value;
      var b = xToBuffer(str);
      var decompressed = decompress(b);
      
      var json = String.fromCharCode.apply(String, decompressed);
     
      return json;
    } catch (e) {
      return e.message;
    }
  }

  return (
    <div>
      <h4>Brotli decompress</h4>
      <br />
      <textarea id="hash" name="hash" rows="10" cols="100" placeholder="Paste your array of bytes here..."></textarea>
      <textarea id="hashdecompressed" name="hashdecompressed" rows="10" cols="100" placeholder="Result" value={valueDecompressed}></textarea>
      <button id="decompress_btn" onClick={() => { setValueDecompressed(decompressFunction) }}>Decompress</button>
      <p><i>Powered by Ricardo Tondello (@rito01)</i></p>
    </div>
  );
};

export default App;
