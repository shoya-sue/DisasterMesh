/**
 * Type declarations for crypto libraries
 */

declare module 'react-native-crypto-js' {
  export interface Encoder {
    parse(str: string): WordArray;
    stringify(wordArray: WordArray): string;
  }

  export interface WordArray {
    toString(encoder?: Encoder): string;
  }

  export interface CipherParams {
    toString(): string;
  }

  const CryptoJS: {
    AES: {
      encrypt(message: string, key: string): CipherParams;
      decrypt(ciphertext: string, key: string): WordArray;
    };
    HmacSHA256(message: string, key: string): WordArray;
    SHA256(message: string): WordArray;
    enc: {
      Utf8: Encoder;
      Hex: Encoder;
      Base64: Encoder;
    };
  };

  export default CryptoJS;
}

declare module 'react-native-get-random-values' {
  export function getRandomValues<T extends ArrayBufferView>(array: T): T;
}
