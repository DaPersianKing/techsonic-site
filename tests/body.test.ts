import { describe, expect, it } from 'vitest';
import { BodyLimitError, readLimitedBody } from '../worker/body';
describe('bounded upstream bodies', () => {
  it('decodes streamed UTF-8 at chunk boundaries', async () => {
    const bytes = new TextEncoder().encode('A → B');
    const stream = new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(bytes.slice(0, 3));
        controller.enqueue(bytes.slice(3));
        controller.close();
      },
    });
    expect(await readLimitedBody(stream, bytes.length)).toBe('A → B');
  });
  it('cancels oversized responses instead of buffering them', async () => {
    await expect(readLimitedBody(new Response('12345').body, 4)).rejects.toBeInstanceOf(
      BodyLimitError
    );
  });
});
