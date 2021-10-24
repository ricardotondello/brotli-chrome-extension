import React, { useState } from 'react';
import decompress from 'brotli/decompress';
import {Buffer} from 'buffer/';
import ReactJson from 'react-json-view';

const App = () => {
  const [valueDecompressed, setValueDecompressed] = useState('');
  const [valuePretified, setPretify] = useState('');

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

  function arrayToJson(decompressed){
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

      return arrayToJson(decompressed);
    } catch (e) {
    }

    try {
      //try with base64
      var bufferArray = base64ToHex(str);
      
      var decompressed = decompress(bufferArray);

      return arrayToJson(decompressed);
    } catch (error) { 
      return 'Could not decompress: ' + error.message;
    }
  }

  function toJsonObject(value)
  {
    try {
      return JSON.parse(value);
    } catch (error) {
      return;
    }
  }

  const handleClickDecompress = () => { setValueDecompressed(decompressFunction) }

  const handleClickJson = () => { setPretify(decompressFunction) }

  const handleOnChange = () => { }

  return (
    <div>
      <h4>Brotli decompress</h4>
      <div style={{ display: "flex", justifyContent: "left", alignItems: "left" }}>
          <textarea id="hash" name="hash" rows="10" cols="100" placeholder="Paste your array of bytes here or base64..." onChange={handleClickDecompress}></textarea>
      </div>
      
      <div style={{ display: "flex", justifyContent: "right", alignItems: "right" }}>
        <button id="decompress_btn" onClick={handleClickDecompress} >Decompress</button>
        <button id="decompress_asJson_btn" onClick={handleClickJson} >Pretify</button>
      </div>

      <div style={{ display: "flex", justifyContent: "left", alignItems: "left" }}>
        <textarea id="hashdecompressed" name="hashdecompressed" rows="10" cols="100" placeholder="Result" value={valueDecompressed} onChange={handleOnChange}></textarea>
      </div>
      
      <div style={{ display: "flex", justifyContent: "left", alignItems: "left" }}>
        <ReactJson src={toJsonObject(valuePretified)} name={false} displayDataTypes={false} groupArraysAfterLength={false}/>
      </div>

      <div style={{fontSize: "8px"}}>
        <p>Ricardo Tondello (@rito01)</p>
      </div>
    </div>
  );
};

export default App;
