export class BodyLimitError extends Error {}

/** Enforce the byte ceiling while reading, before materializing an untrusted body. */
export async function readLimitedBody(
  body: ReadableStream<Uint8Array> | null,
  maxBytes: number
): Promise<string> {
  if (!body) return '';
  const reader = body.getReader();
  const decoder = new TextDecoder();
  const chunks: string[] = [];
  let size = 0;
  try {
    let chunk = await reader.read();
    while (!chunk.done) {
      size += chunk.value.byteLength;
      if (size > maxBytes) {
        await reader.cancel();
        throw new BodyLimitError('Response exceeds the permitted size.');
      }
      chunks.push(decoder.decode(chunk.value, { stream: true }));
      chunk = await reader.read();
    }
    chunks.push(decoder.decode());
    return chunks.join('');
  } finally {
    reader.releaseLock();
  }
}
