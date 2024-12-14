import { ed25519 } from "@noble/curves/ed25519";

export async function generateAccountAssociation(domain: string, privateKey: string) {
  const timestamp = Math.floor(Date.now() / 1000);
  
  const header = {
    t: "farcaster.domain",
    v: 1,
    ts: timestamp,
  };

  const payload = { domain };

  const headerB64 = Buffer.from(JSON.stringify(header)).toString('base64url');
  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
  
  const message = new TextEncoder().encode(`${headerB64}.${payloadB64}`);
  const privateKeyBytes = Buffer.from(privateKey, 'hex');
  
  const signature = ed25519.sign(message, privateKeyBytes);
  
  return {
    header: headerB64,
    payload: payloadB64,
    signature: Buffer.from(signature).toString('base64url')
  };
} 