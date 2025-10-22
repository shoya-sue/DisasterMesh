/**
 * Type definitions for react-native-crypto-js
 */

declare module 'react-native-crypto-js' {
  interface WordArray {
    toString(encoder?: any): string;
  }

  interface Encoder {
    Hex: any;
  }

  const CryptoJS: {
    SHA256(message: string): WordArray;
    enc: Encoder;
  };

  export default CryptoJS;
}
