// Convert Blob to ArrayBuffer and then to Uint8Array
export const getUint8Array = (blob: Blob): Promise<Uint8Array> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
  
      reader.onload = () => {
        const arrayBuffer = reader.result;
        if (arrayBuffer instanceof ArrayBuffer) {
          const uint8Array = new Uint8Array(arrayBuffer);
          resolve(uint8Array);
        } else {
          reject(new Error("Error reading Blob as ArrayBuffer"));
        }
      };
  
      reader.onerror = reject;
      reader.readAsArrayBuffer(blob);
    });
  };
  