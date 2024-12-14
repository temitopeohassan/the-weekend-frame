import fetch from 'node-fetch';
import { verifyFarcasterFrameMessageSignature } from '@farcaster/core';

async function verifyManifest() {
  const appUrl = process.env.NEXT_PUBLIC_URL;
  if (!appUrl) throw new Error('NEXT_PUBLIC_URL not set');

  const response = await fetch(`${appUrl}/.well-known/farcaster.json`);
  const manifest = await response.json();

  try {
    const isValid = await verifyFarcasterFrameMessageSignature(
      manifest.accountAssociation.header,
      manifest.accountAssociation.payload,
      manifest.accountAssociation.signature
    );

    console.log('Manifest verification:', isValid ? 'SUCCESS' : 'FAILED');
    console.log('Manifest:', JSON.stringify(manifest, null, 2));
  } catch (error) {
    console.error('Verification error:', error);
  }
}

verifyManifest().catch(console.error); 