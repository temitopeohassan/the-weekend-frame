import fetch from 'node-fetch';
import { ed25519 } from "@noble/curves/ed25519";

async function verifyManifest() {
  const appUrl = process.env.NEXT_PUBLIC_URL;
  if (!appUrl) throw new Error('NEXT_PUBLIC_URL not set');

  const response = await fetch(`${appUrl}/.well-known/farcaster.json`);
  const manifest = await response.json();

  try {
    const signedInput = new TextEncoder().encode(
      manifest.accountAssociation.header + "." + manifest.accountAssociation.payload
    );
    const signature = Buffer.from(manifest.accountAssociation.signature, 'base64url');
    const headerData = JSON.parse(
      Buffer.from(manifest.accountAssociation.header, 'base64url').toString()
    );
    const publicKey = Buffer.from(headerData.key.slice(2), 'hex');

    const isValid = ed25519.verify(signature, signedInput, publicKey);

    console.log('Manifest verification:', isValid ? 'SUCCESS' : 'FAILED');
    console.log('Manifest:', JSON.stringify(manifest, null, 2));
  } catch (error) {
    console.error('Verification error:', error);
  }
}

verifyManifest().catch(console.error); 