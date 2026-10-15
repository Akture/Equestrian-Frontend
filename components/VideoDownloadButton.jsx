'use client';

import { useState } from 'react';
import JSZip from 'jszip';
import { feeds } from '@/lib/media';

export default function VideoDownloadButton({
  folder,
  folders,
  buttonClassName = '',
  children,
  buttonLabel = 'Download',
}) {
  const downloads = (folders || (folder ? [folder] : [])).filter(Boolean);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');

  async function downloadAngles(angleIds) {
    setBusy(true);
    setMessage('');
    try {
      const archive = new JSZip();
      for (const item of downloads) {
        for (const angleId of angleIds) {
          const feed = feeds.find((candidate) => candidate.id === angleId);
          const source = item.videos?.[angleId];
          if (!feed || !source) {
            throw new Error(`${item.names.display}: ${feed?.label || angleId} footage is unavailable.`);
          }
          const response = await fetch(source);
          if (!response.ok) {
            throw new Error(`${feed.label} could not be downloaded (HTTP ${response.status}).`);
          }
          const filename = item.names.files.find((file) => file.id === angleId)?.filename || `${angleId}.mp4`;
          archive.file(filename, await response.blob());
        }
      }
      setMessage('Creating ZIP archive…');
      const zipBlob = await archive.generateAsync({
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: { level: 1 },
      });
      const first = downloads[0];
      const zipFilename = downloads.length === 1
        ? first.names.zip
        : `${first.iso || first.dayKey}_AllFootage_${downloads.length}Segments.zip`;
      const blobUrl = URL.createObjectURL(zipBlob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = zipFilename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
      setMessage(`${zipFilename} is ready to download.`);
    } catch (error) {
      setMessage(error instanceof Error ? `Download failed: ${error.message}` : 'Download failed unexpectedly.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => { setMessage(''); setOpen(true); }}
        className={buttonClassName}
        aria-label={buttonLabel}
        title={buttonLabel}
        disabled={!downloads.length}
      >
        {children || <><i className="ph-bold ph-download-simple text-sm" />{buttonLabel}</>}
      </button>
      {open && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-ink/75 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !busy) setOpen(false);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="download-options-title"
            className="w-full max-w-md rounded-2xl border border-brass/30 bg-navy-panel p-6 text-oat shadow-rail"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-label text-[0.85rem] uppercase tracking-[0.2em] text-hermes-light">Keep your footage</p>
                <h2 id="download-options-title" className="mt-2 font-display text-2xl">Choose camera angles</h2>
                <p className="mt-2 text-[0.84rem] leading-relaxed text-oat/65">
                  {downloads.length > 1
                    ? `Choose all three angles or one angle for each of the ${downloads.length} selected footage chunks.`
                    : 'Create a ZIP with all three camera angles, or choose a single angle.'}
                </p>
              </div>
              <button
                type="button"
                aria-label="Close download options"
                disabled={busy}
                onClick={() => setOpen(false)}
                className="w-8 h-8 shrink-0 rounded-full border border-oat/20 text-oat/70 hover:text-oat disabled:opacity-40"
              >
                <i className="ph-bold ph-x" />
              </button>
            </div>

            <div className="mt-6 space-y-2">
              <button
                type="button"
                disabled={busy}
                onClick={() => downloadAngles(feeds.map((feed) => feed.id))}
                className="w-full rounded-xl border border-hermes/60 bg-hermes/10 px-4 py-3 text-left font-label text-[0.82rem] font-semibold text-hermes-light hover:bg-hermes/20 disabled:opacity-50"
              >
                <i className="ph-bold ph-download-simple mr-2" />
                Download all 3 angles
              </button>
              {feeds.map((feed) => (
                <button
                  key={feed.id}
                  type="button"
                  disabled={busy}
                  onClick={() => downloadAngles([feed.id])}
                  className="w-full rounded-xl border border-oat/15 px-4 py-3 text-left font-label text-[0.82rem] text-oat/80 hover:border-brass/50 disabled:opacity-50"
                >
                  <i className="ph-bold ph-download-simple mr-2 text-oat/50" />
                  {feed.label} only
                </button>
              ))}
            </div>
            {busy && <p className="mt-4 text-[0.78rem] text-oat/60" role="status">Preparing downloads…</p>}
            {message && <p className="mt-4 text-[0.78rem] text-hermes-light" role="status">{message}</p>}
          </section>
        </div>
      )}
    </>
  );
}
