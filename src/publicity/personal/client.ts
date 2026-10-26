// Runs inside the personal invitation card page, which the edition's page shows in an iframe.
// The parent posts the guest's name in and asks for the PNG; the card is re-fitted for each name.
import { domToBlob } from 'modern-screenshot';
import { fitText, fillFrame } from '../fit';

export type PersonalMessage =
  | { kind: 'personal-guest'; name: string }
  | { kind: 'personal-export' };
export type PersonalReply = { kind: 'personal-png'; blob: Blob };

const guest = document.querySelector<HTMLElement>('[data-guest]')!;
const sample = guest.textContent ?? '';

async function setGuest(name: string) {
  guest.textContent = name.trim() || sample;
  await document.fonts.ready;
  fitText();
  fillFrame();
}

window.addEventListener('message', async (e: MessageEvent<PersonalMessage>) => {
  if (e.origin !== location.origin) return;
  const reply = (m: PersonalReply) => (e.source as Window).postMessage(m, location.origin);
  if (e.data?.kind === 'personal-guest') {
    await setGuest(e.data.name);
  } else if (e.data?.kind === 'personal-export') {
    await document.fonts.ready;
    const blob = await domToBlob(document.getElementById('frame')!, { type: 'image/png', scale: 1 });
    if (blob) reply({ kind: 'personal-png', blob });
  }
});

// Opened on its own: /publicity/2026/grahak-peth/vaiyaktik/whatsapp/?name=…
const name = new URLSearchParams(location.search).get('name');
if (name) setGuest(name);
