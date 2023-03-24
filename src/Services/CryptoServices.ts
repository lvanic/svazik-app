import JSEncrypt from "jsencrypt";


//Encrypt text with public key using RSA algorithm
export const encrypt = async (text: string, publicKey: string) => {
    const encrypt = new JSEncrypt();
    encrypt.setPublicKey(publicKey);
    return encrypt.encrypt(text);
}


