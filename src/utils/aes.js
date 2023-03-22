import { enc, AES, mode, pad } from 'crypto-js'

const secretKey = '2589633659865985'
const iv = '3698525248485266'

/**
 * ASE加密
 * @param {string} word - 需要加密的参数
 * @param {string} key - 加密密钥（16位16进制数）
 * @param {string} offset - 偏移量（16位16进制数）
 */
export function encrypt(word, key = secretKey, offset = iv) {
  // 未加密的参数 从UTF-8编码解析出原始字符串
  const wordUTF8 = enc.Utf8.parse(word)
  // 密钥 从UTF-8编码解析出原始字符串
  const keyUTF8 = enc.Utf8.parse(key)
  // 偏移量 从UTF-8编码解析出原始字符串
  const offsetUTF8 = enc.Utf8.parse(offset)

  const encrypted = AES.encrypt(wordUTF8, keyUTF8, {
    iv: offsetUTF8,
    mode: mode.CBC,
    padding: pad.Pkcs7,
  })

  return encrypted.toString()
}

/**
 * ASE解密
 * @param {string} encryptedWord - 需要解密的参数
 * @param {string} key - 加密密钥（16位16进制数）
 * @param {string} offset - 偏移量（16位16进制数）
 */
export function decrypt(encryptedWord, key = secretKey, offset = iv) {
  const keyUTF8 = enc.Utf8.parse(key)
  const offsetUTF8 = enc.Utf8.parse(offset)

  const bytes = AES.decrypt(encryptedWord, keyUTF8, {
    iv: offsetUTF8,
    mode: mode.CBC,
    padding: pad.Pkcs7,
  })

  return bytes.toString(enc.Utf8)
}
