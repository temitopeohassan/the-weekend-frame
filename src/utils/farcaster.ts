import { createSignature } from '@farcaster/core';

export async function generateAccountAssociation(domain: string, privateKey: string) {
  const timestamp = Math.floor(Date.now() / 1000);
  
  const header = Buffer.from(JSON.stringify({
    t: "farcaster.domain",
    v: 1,
    ts: timestamp,
  })).toString('base64url');

  const payload = Buffer.from(JSON.stringify({
    domain
  })).toString('base64url');

  // Generate signature using your private key
  const signature = await createSignature(
    Buffer.from(`${header}.${payload}`),
    privateKey
  );

  return {
    header,
    payload,
    signature: signature.toString('base64url')
  };
} 