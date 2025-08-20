import * as Crypto from 'expo-crypto';

export async function sha1(text: string) {
  return Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA1,
    text,
    { encoding: Crypto.CryptoEncoding.HEX }
  );
}