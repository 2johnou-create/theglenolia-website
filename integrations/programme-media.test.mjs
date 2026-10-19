import test from 'node:test';
import assert from 'node:assert/strict';
import {validateProgrammeImage, normaliseProgrammeImage, programmeImageResponse, IMAGE_MAX_BYTES, IMAGE_MAX_EDGE} from './programme-media.mjs';

// Real, decoded/re-encoded 2×3 sRGB solid-colour fixtures generated with Pillow.
// These tests check the accepted structural profile, not full entropy decoding.
const decode = value => Uint8Array.from(Buffer.from(value, 'base64'));
const JPEG = decode('/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAADAAIDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwCGiiisjkP/2Q==');
const VP8 = decode('UklGRiwAAABXRUJQVlA4ICAAAABwAQCdASoCAAMAAgA0JYwCdAG+gAD+y6qk40YTSR2AAA==');
const VP8L = decode('UklGRh4AAABXRUJQVlA4TBEAAAAvAYAAAAdQwqb1rf+BiOh/AAA=');
const WIDTH_1600 = decode('UklGRiQAAABXRUJQVlA4TBcAAAAvPwYAAAdQwqb1rf8BICH8P69G9D81AAA=');
const WIDTH_1601 = decode('UklGRiQAAABXRUJQVlA4TBcAAAAvQAYAAAdQwqb1rf8BICH8P69G9D89AAA=');
const HEIGHT_1600 = decode('UklGRiQAAABXRUJQVlA4TBcAAAAvAMCPAQdQwqb1rf9hABLC//9KRP9DHwA=');
const HEIGHT_1601 = decode('UklGRiQAAABXRUJQVlA4TBcAAAAvAACQAQdQwqb1rf9hABLC//9KRP/DHwA=');
// Only the standard 456-byte sRGB ICC profile from the browser encoder capture.
// No production photograph pixels are embedded in these fixtures.
const SRGB_ICC = decode('AAAByAAAAAAEMAAAbW50clJHQiBYWVogB+AAAQABAAAAAAAAYWNzcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAPbWAAEAAAAA0y0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJZGVzYwAAAPAAAAAkclhZWgAAARQAAAAUZ1hZWgAAASgAAAAUYlhZWgAAATwAAAAUd3RwdAAAAVAAAAAUclRSQwAAAWQAAAAoZ1RSQwAAAWQAAAAoYlRSQwAAAWQAAAAoY3BydAAAAYwAAAA8bWx1YwAAAAAAAAABAAAADGVuVVMAAAAIAAAAHABzAFIARwBCWFlaIAAAAAAAAG+iAAA49QAAA5BYWVogAAAAAAAAYpkAALeFAAAY2lhZWiAAAAAAAAAkoAAAD4QAALbPWFlaIAAAAAAAAPbWAAEAAAAA0y1wYXJhAAAAAAAEAAAAAmZmAADypwAADVkAABPQAAAKWwAAAAAAAAAAbWx1YwAAAAAAAAABAAAADGVuVVMAAAAgAAAAHABHAG8AbwBnAGwAZQAgAEkAbgBjAC4AIAAyADAAMQA2');
const ascii = value => new TextEncoder().encode(value);
const join = (...parts) => {
  const output = new Uint8Array(parts.reduce((size, part) => size + part.length, 0));
  let offset = 0;
  for (const part of parts) {output.set(part, offset); offset += part.length;}
  return output;
};
const changed = (bytes, at, ...values) => {const result = bytes.slice(); result.set(values, at); return result;};
const rejected = (bytes, mime, label) => assert.throws(() => validateProgrammeImage(bytes, mime), label);
function little32(value) {
  const bytes = new Uint8Array(4); new DataView(bytes.buffer).setUint32(0, value, true); return bytes;
}
function chunk(name, payload) {
  return join(ascii(name), little32(payload.length), payload, payload.length % 2 ? Uint8Array.of(0) : new Uint8Array());
}
function webp(...chunks) {
  const body = join(ascii('WEBP'), ...chunks);
  return join(ascii('RIFF'), little32(body.length), body);
}
function extendedHeader({flags = 0x20, width = 2, height = 3} = {}) {
  const payload = new Uint8Array(10); payload[0] = flags;
  for (let index = 0; index < 3; index++) {
    payload[4 + index] = ((width - 1) >>> (index * 8)) & 255;
    payload[7 + index] = ((height - 1) >>> (index * 8)) & 255;
  }
  return chunk('VP8X', payload);
}
const normalizedRejected = (bytes, mime = 'image/webp', label) => assert.throws(() => normaliseProgrammeImage(bytes, mime), label);
function segment(marker, payload) {
  const size = payload.length + 2;
  return join(Uint8Array.of(0xff, marker, size >>> 8, size & 255), payload);
}
function jpegHeaders(bytes = JPEG) {
  const headers = [];
  for (let offset = 2; offset < bytes.length;) {
    assert.equal(bytes[offset], 0xff, 'fixture header begins at a marker');
    const marker = bytes[offset + 1], length = (bytes[offset + 2] << 8) | bytes[offset + 3];
    headers.push({marker, start:offset, end:offset + 2 + length});
    if (marker === 0xda) break;
    offset += 2 + length;
  }
  return headers;
}
const header = marker => jpegHeaders().find(item => item.marker === marker);
function withoutJpegMarker(marker) {
  const omitted = jpegHeaders().filter(item => item.marker === marker);
  const parts = []; let offset = 0;
  for (const item of omitted) {parts.push(JPEG.slice(offset, item.start)); offset = item.end;}
  return join(...parts, JPEG.slice(offset));
}
const injectJpeg = (marker, payload) => join(JPEG.slice(0, 2), segment(marker, payload), JPEG.slice(2));

test('the public upload contract has a 300 KiB body ceiling and 1600-pixel edge ceiling', () => {
  assert.equal(IMAGE_MAX_BYTES, 307200);
  assert.equal(IMAGE_MAX_EDGE, 1600);
});

for (const [name, bytes, mime] of [['baseline JPEG', JPEG, 'image/jpeg'], ['lossy WebP', VP8, 'image/webp'], ['lossless WebP', VP8L, 'image/webp']]) {
  test(`accepts a real tiny ${name} and reports server-derived metadata`, () => {
    assert.deepEqual(validateProgrammeImage(bytes, mime), {mime, width:2, height:3, byteLength:bytes.length});
  });
  test(`${name} validation respects a typed-array byte offset and does not mutate input`, () => {
    const padded = join(Uint8Array.of(71, 72, 73), bytes, Uint8Array.of(74, 75));
    const view = padded.subarray(3, 3 + bytes.length), before = padded.slice();
    assert.equal(validateProgrammeImage(view, mime).byteLength, bytes.length);
    assert.deepEqual(padded, before);
  });
  test(`every truncated prefix of the ${name} fixture is rejected`, () => {
    for (let length = 0; length < bytes.length; length++) rejected(bytes.subarray(0, length), mime, `truncated at ${length}`);
  });
  test(`${name} cannot carry appended HTML, another image or a zero byte`, () => {
    for (const extra of [ascii('<html><script>alert(1)</script></html>'), bytes, Uint8Array.of(0)]) rejected(join(bytes, extra), mime);
  });
}

test('declared MIME cannot turn another format or text into an image', () => {
  rejected(JPEG, 'image/webp'); rejected(VP8, 'image/jpeg');
  for (const mime of ['image/png', 'image/svg+xml', 'image/jpg', 'text/html', '', null, undefined]) rejected(JPEG, mime);
  for (const bytes of [ascii('<svg xmlns="http://www.w3.org/2000/svg"/>'), ascii('RIFFxxxxWEBP'), Uint8Array.of(0xff, 0xd8, 0xff, 0xd9)]) {
    rejected(bytes, 'image/jpeg'); rejected(bytes, 'image/webp');
  }
});

test('invalid binary inputs and bodies above the byte ceiling are rejected', () => {
  for (const value of [null, undefined, '', 'JPEG', {}, []]) rejected(value, 'image/jpeg');
  for (const size of [IMAGE_MAX_BYTES + 1, IMAGE_MAX_BYTES * 2]) {
    const bytes = new Uint8Array(size); bytes.set(JPEG);
    rejected(bytes, 'image/jpeg'); rejected(bytes, 'image/webp');
  }
});

test('real images at the inclusive edge ceiling are accepted, and 1601 is rejected in either axis', () => {
  assert.deepEqual(validateProgrammeImage(WIDTH_1600, 'image/webp'), {mime:'image/webp', width:1600, height:1, byteLength:WIDTH_1600.length});
  assert.deepEqual(validateProgrammeImage(HEIGHT_1600, 'image/webp'), {mime:'image/webp', width:1, height:1600, byteLength:HEIGHT_1600.length});
  rejected(WIDTH_1601, 'image/webp'); rejected(HEIGHT_1601, 'image/webp');
});

test('WebP checks the full RIFF length, WEBP tag and bounded chunk size', () => {
  for (const value of [0, VP8.length - 9, VP8.length - 7, 0xffffffff]) {
    const bytes = VP8.slice(); new DataView(bytes.buffer).setUint32(4, value, true); rejected(bytes, 'image/webp');
  }
  rejected(changed(VP8, 0, 0x58), 'image/webp'); rejected(changed(VP8, 8, 0x58), 'image/webp');
  for (const value of [0, 1, 0xffffffff]) {
    const bytes = VP8.slice(); new DataView(bytes.buffer).setUint32(16, value, true); rejected(bytes, 'image/webp');
  }
});

test('lossless WebP requires its bitstream signature, supported version and zero RIFF padding', () => {
  rejected(changed(VP8L, 20, 0), 'image/webp');
  rejected(changed(VP8L, 24, VP8L[24] | 0x20), 'image/webp');
  assert.equal(VP8L.at(-1), 0, 'fixture contains its odd-length chunk padding');
  rejected(changed(VP8L, VP8L.length - 1, 1), 'image/webp');
});

test('lossy WebP must be a shown key frame with a valid start code and positive bounded dimensions', () => {
  rejected(changed(VP8, 20, VP8[20] | 1), 'image/webp');
  rejected(changed(VP8, 20, VP8[20] & ~0x10), 'image/webp');
  rejected(changed(VP8, 20, (VP8[20] & ~0x0e) | 0x08), 'image/webp', 'unsupported VP8 version');
  rejected(changed(VP8, 23, 0), 'image/webp');
  rejected(changed(VP8, 26, 0, 0), 'image/webp'); rejected(changed(VP8, 28, 0, 0), 'image/webp');
  rejected(changed(VP8, 26, 0x41, 0x06), 'image/webp'); rejected(changed(VP8, 28, 0x41, 0x06), 'image/webp');
});

test('WebP bitstream headers alone cannot establish an image payload', () => {
  rejected(webp(chunk('VP8 ', VP8.slice(20, 30))), 'image/webp', 'VP8 header without its first partition');
  rejected(webp(chunk('VP8L', VP8L.slice(20, 25))), 'image/webp', 'VP8L header without compressed pixels');
  const invalidPartition = VP8.slice();
  // Declares a first partition larger than every byte left in this RIFF chunk.
  invalidPartition.set([0xf0, 0xff, 0xff], 20);
  rejected(invalidPartition, 'image/webp', 'first partition exceeds the bounded chunk');
});

test('WebP rejects metadata, animation, extended and unknown chunks even with a valid image present', () => {
  const image = VP8.slice(12);
  for (const name of ['EXIF', 'XMP ', 'ICCP', 'ANIM', 'ANMF', 'VP8X', 'JUNK']) {
    const extra = chunk(name, ascii('private metadata must not be stored'));
    rejected(webp(extra, image), 'image/webp', name + ' before image');
    rejected(webp(image, extra), 'image/webp', name + ' after image');
  }
  rejected(webp(image, image), 'image/webp', 'a second image bitstream');
  rejected(webp(), 'image/webp', 'a RIFF container without an image');
});

test('JPEG rejects metadata/comment segments rather than preserving EXIF GPS or opaque fields', () => {
  for (let marker = 0xe1; marker <= 0xef; marker++) rejected(injectJpeg(marker, ascii('Exif\0\0GPSLatitude=33;GPSLongitude=151')), 'image/jpeg');
  rejected(injectJpeg(0xfe, ascii('Private camera comment')), 'image/jpeg');
});

test('JPEG accepts only the fixed safe JFIF APP0 shape', () => {
  const app = header(0xe0);
  rejected(changed(JPEG, app.start + 4, ...ascii('JFXX\0')), 'image/jpeg');
  rejected(changed(JPEG, app.end - 2, 1, 1), 'image/jpeg', 'embedded thumbnail is not allowed');
  const payload = join(JPEG.slice(app.start + 4, app.end), ascii('opaque APP0 tail'));
  rejected(join(JPEG.slice(0, app.start), segment(0xe0, payload), JPEG.slice(app.end)), 'image/jpeg');
});

test('JPEG requires frame, quantisation, Huffman and scan headers', () => {
  for (const marker of [0xc0, 0xdb, 0xc4, 0xda]) rejected(withoutJpegMarker(marker), 'image/jpeg', 'missing marker ' + marker.toString(16));
  const sof = header(0xc0);
  rejected(join(JPEG.slice(0, sof.end), JPEG.slice(sof.start, sof.end), JPEG.slice(sof.end)), 'image/jpeg', 'duplicate frame header');
});

test('empty JPEG table segments cannot satisfy required quantisation or Huffman tables', () => {
  for (const marker of [0xdb, 0xc4]) {
    const without = withoutJpegMarker(marker);
    rejected(join(without.slice(0, 2), segment(marker, new Uint8Array()), without.slice(2)), 'image/jpeg');
  }
});

test('baseline JPEG rejects a structurally complete 16-bit quantisation table', () => {
  const table = header(0xdb), coefficients = JPEG.slice(table.start + 5, table.end);
  assert.equal(coefficients.length, 64);
  const wide = new Uint8Array(129);
  wide[0] = 0x10 | (JPEG[table.start + 4] & 15);
  coefficients.forEach((coefficient, index) => {wide[2 + index * 2] = coefficient;});
  const bytes = join(JPEG.slice(0, table.start), segment(0xdb, wide), JPEG.slice(table.end));
  rejected(bytes, 'image/jpeg', '16-bit DQT is not legal for the accepted 8-bit baseline frame');
});

test('every JPEG frame component must reference a defined quantisation table', () => {
  const frame = header(0xc0);
  rejected(changed(JPEG, frame.start + 12, 3), 'image/jpeg', 'component selects absent table 3');
  const tables = jpegHeaders().filter(item => item.marker === 0xdb);
  assert.equal(tables.length, 2);
  for (const table of tables) {
    const bytes = join(JPEG.slice(0, table.start), JPEG.slice(table.end));
    rejected(bytes, 'image/jpeg', 'another DQT exists, but the selected table is absent');
  }
});

test('JPEG scan selectors require the matching DC and AC Huffman tables, not merely any DHT', () => {
  const scan = header(0xda);
  for (const selector of [0x30, 0x03]) rejected(changed(JPEG, scan.start + 6, selector), 'image/jpeg', 'undefined DC/AC selector');
  const tables = jpegHeaders().filter(item => item.marker === 0xc4);
  assert.equal(tables.length, 4);
  for (const table of tables) {
    const bytes = join(JPEG.slice(0, table.start), JPEG.slice(table.end));
    rejected(bytes, 'image/jpeg', 'other DHT segments cannot replace this referenced table');
  }
});

test('JPEG Huffman tables reject oversubscribed prefix lengths even when segment sizes and symbol totals match', () => {
  const table = header(0xc4), originalCount = JPEG.slice(table.start + 5, table.start + 21).reduce((sum, value) => sum + value, 0);
  assert.equal(originalCount, 12);
  for (const prefixCounts of [[3, 9], [1, 3, 8]]) {
    const counts = new Uint8Array(16); counts.set(prefixCounts);
    assert.equal(counts.reduce((sum, value) => sum + value, 0), originalCount);
    rejected(changed(JPEG, table.start + 5, ...counts), 'image/jpeg', 'more prefix codes than the available binary branches');
  }
});

test('JPEG rejects progressive/arithmetic frames, unsupported precision and components, and invalid dimensions', () => {
  const sof = header(0xc0);
  for (const marker of [0xc1, 0xc2, 0xc3, 0xc9, 0xca]) rejected(changed(JPEG, sof.start + 1, marker), 'image/jpeg');
  rejected(changed(JPEG, sof.start + 4, 12), 'image/jpeg');
  rejected(changed(JPEG, sof.start + 9, 4), 'image/jpeg');
  for (const offset of [sof.start + 5, sof.start + 7]) {
    rejected(changed(JPEG, offset, 0, 0), 'image/jpeg');
    rejected(changed(JPEG, offset, 0x06, 0x41), 'image/jpeg');
    rejected(changed(JPEG, offset, 0xff, 0xff), 'image/jpeg');
  }
});

test('JPEG checks segment lengths and scan parameters before examining entropy', () => {
  for (const item of jpegHeaders()) {
    for (const size of [0, 1, 0xffff]) rejected(changed(JPEG, item.start + 2, size >>> 8, size & 255), 'image/jpeg');
  }
  const scan = header(0xda);
  rejected(changed(JPEG, scan.end - 3, 1), 'image/jpeg', 'baseline spectral start must be zero');
  rejected(changed(JPEG, scan.end - 2, 62), 'image/jpeg', 'baseline spectral end must be 63');
  rejected(changed(JPEG, scan.end - 1, 1), 'image/jpeg', 'successive approximation is not baseline');
  rejected(join(JPEG.slice(0, scan.end), Uint8Array.of(0xff, 0xd9)), 'image/jpeg', 'empty entropy scan');
});

test('JPEG rejects unexpected markers or additional scans inside image entropy', () => {
  const scan = header(0xda), end = JPEG.length - 2;
  for (const extra of [Uint8Array.of(0xff, 0xd8), segment(0xfe, ascii('comment')), JPEG.slice(scan.start, scan.end), segment(0xdc, Uint8Array.of(0, 3))]) {
    rejected(join(JPEG.slice(0, end), extra, JPEG.slice(end)), 'image/jpeg');
  }
});

test('D1 BLOB number arrays are returned as exact binary bytes with private/public cache boundaries', async () => {
  // The real D1 Workers binding returns a BLOB as Array, unlike node:sqlite's Uint8Array.
  const image = {mime:'image/jpeg', width:2, height:3, byte_length:JPEG.length, sha256:'a'.repeat(64), bytes:Array.from(JPEG)};
  for (const publicOnly of [false, true]) {
    const response = programmeImageResponse(image, {publicOnly});
    const body = new Uint8Array(await response.arrayBuffer());
    assert.equal(Buffer.from(body).equals(Buffer.from(JPEG)), true, 'D1 number arrays must produce binary, not comma-separated text');
    assert.equal(response.headers.get('Content-Type'), 'image/jpeg');
    assert.equal(Number(response.headers.get('Content-Length')), JPEG.length);
    assert.equal(response.headers.get('X-Content-Type-Options'), 'nosniff');
    assert.match(response.headers.get('Content-Security-Policy'), /default-src 'none'/);
    assert.equal(response.headers.get('Cache-Control'), publicOnly ? 'public, max-age=31536000, immutable' : 'no-store');
    assert.equal(response.headers.get('Access-Control-Allow-Origin'), publicOnly ? '*' : null);
  }
});

test('browser VP8X plus the captured sRGB ICC profile normalizes to the identical simple image chunk', () => {
  assert.equal(SRGB_ICC.length, 456);
  for (const image of [VP8, VP8L]) {
    const raw = webp(extendedHeader(), chunk('ICCP', SRGB_ICC), image.slice(12)), before = raw.slice();
    rejected(raw, 'image/webp', 'strict storage validator still rejects the unnormalized wrapper');
    const result = normaliseProgrammeImage(raw, 'image/webp');
    assert.deepEqual(result.bytes, image, 'stored bytes are the original simple image, without wrapper or ICC profile');
    const {bytes, ...metadata} = result;
    assert.deepEqual(metadata, {mime:'image/webp', width:2, height:3, byteLength:image.length});
    assert.deepEqual(validateProgrammeImage(bytes, result.mime), metadata);
    assert.deepEqual(raw, before, 'normalization must not mutate the uploaded buffer');
    assert.equal(Buffer.from(bytes).includes(Buffer.from('ICCP')), false);
  }
});

test('normalization preserves already canonical JPEG/WebP and accepts a metadata-free still wrapper', () => {
  for (const [image, mime] of [[JPEG, 'image/jpeg'], [VP8, 'image/webp'], [VP8L, 'image/webp']]) {
    const result = normaliseProgrammeImage(image, mime);
    assert.deepEqual(result.bytes, image);
    assert.equal(result.byteLength, image.length);
  }
  const raw = webp(extendedHeader({flags:0}), VP8.slice(12));
  assert.deepEqual(normaliseProgrammeImage(raw, 'image/webp').bytes, VP8);
  const padded = join(Uint8Array.of(1, 2, 3), raw, Uint8Array.of(4));
  assert.deepEqual(normaliseProgrammeImage(padded.subarray(3, 3 + raw.length), 'image/webp').bytes, VP8);
  normalizedRejected(raw, 'image/jpeg', 'MIME must not be rewritten based on a WebP wrapper');
});

test('WebP normalization never strips EXIF/XMP, animation, alpha or unknown chunks into an accepted upload', () => {
  const header = extendedHeader(), profile = chunk('ICCP', SRGB_ICC), image = VP8.slice(12);
  for (const tag of ['EXIF', 'XMP ', 'ANIM', 'ANMF', 'ALPH', 'JUNK']) {
    const extra = chunk(tag, ascii('not an accepted still-picture chunk'));
    normalizedRejected(webp(header, profile, extra, image), 'image/webp', tag);
    normalizedRejected(webp(header, profile, image, extra), 'image/webp', tag);
  }
  normalizedRejected(webp(header, profile, profile, image), 'image/webp', 'duplicate ICC profile');
  normalizedRejected(webp(header, profile, image, image), 'image/webp', 'duplicate image');
  normalizedRejected(webp(header, image, profile), 'image/webp', 'ICC profile is out of order');
  normalizedRejected(webp(header, profile), 'image/webp', 'no image');
});

test('WebP normalization requires consistent ICC flags and zero reserved wrapper bits', () => {
  const profile = chunk('ICCP', SRGB_ICC), image = VP8.slice(12);
  for (const flags of [1, 2, 4, 8, 0x10, 0x40, 0x80, 0x21, 0x22, 0x30]) normalizedRejected(webp(extendedHeader({flags}), profile, image));
  normalizedRejected(webp(extendedHeader({flags:0}), profile, image), 'image/webp', 'ICCP without the ICC flag');
  normalizedRejected(webp(extendedHeader(), image), 'image/webp', 'ICC flag without ICCP');
  for (const reserved of [9, 10, 11]) normalizedRejected(webp(changed(extendedHeader(), reserved, 1), profile, image));
  normalizedRejected(webp(chunk('VP8X', new Uint8Array(9)), profile, image), 'image/webp', 'wrapper header must be exactly ten bytes');
});

test('WebP normalization enforces actual canvas dimensions, RIFF size and bounded chunks', () => {
  const profile = chunk('ICCP', SRGB_ICC), image = VP8.slice(12);
  for (const dimensions of [{width:3}, {height:4}, {width:1601}, {height:1601}]) normalizedRejected(webp(extendedHeader(dimensions), profile, image));
  const raw = webp(extendedHeader(), profile, image);
  for (let length = 0; length < raw.length; length++) normalizedRejected(raw.subarray(0, length), 'image/webp', 'truncated at ' + length);
  for (const declared of [0, raw.length - 9, raw.length - 7, 0xffffffff]) {
    const bytes = raw.slice(); new DataView(bytes.buffer).setUint32(4, declared, true); normalizedRejected(bytes);
  }
  const malformed = raw.slice(); new DataView(malformed.buffer).setUint32(34, 0xffffffff, true); normalizedRejected(malformed);
  normalizedRejected(join(raw, ascii('<script>appended</script>')));
  const oversized = new Uint8Array(IMAGE_MAX_BYTES + 1); oversized.set(raw); normalizedRejected(oversized);
});

test('only a bounded well-formed RGB monitor ICC profile may be discarded during normalization', () => {
  const header = extendedHeader(), image = VP8.slice(12);
  const profiles = [
    SRGB_ICC.subarray(0, 131),
    changed(SRGB_ICC, 0, 0, 0, 0, 1),
    changed(SRGB_ICC, 12, ...ascii('scnr')),
    changed(SRGB_ICC, 16, ...ascii('CMYK')),
    changed(SRGB_ICC, 20, ...ascii('Lab ')),
    changed(SRGB_ICC, 36, ...ascii('bad!')),
    changed(SRGB_ICC, 128, 0, 0, 0, 0),
    changed(SRGB_ICC, 128, 0, 0, 0, 65),
    changed(SRGB_ICC, 136, 0, 0, 0xff, 0xff),
    changed(SRGB_ICC, 140, 0, 0, 0xff, 0xff),
  ];
  for (const profile of profiles) normalizedRejected(webp(header, chunk('ICCP', profile), image));
});

test('browser JPEG single-segment sRGB APP2 normalizes to byte-identical baseline JPEG', () => {
  const payload = join(ascii('ICC_PROFILE\0'), Uint8Array.of(1, 1), SRGB_ICC);
  const raw = injectJpeg(0xe2, payload), before = raw.slice();
  rejected(raw, 'image/jpeg', 'the strict storage validator never accepts unnormalized APP2');
  const result = normaliseProgrammeImage(raw, 'image/jpeg'), {bytes, ...metadata} = result;
  assert.deepEqual(bytes, JPEG, 'only the recognized ICC APP2 segment is removed');
  assert.deepEqual(metadata, {mime:'image/jpeg', width:2, height:3, byteLength:JPEG.length});
  assert.deepEqual(validateProgrammeImage(bytes, 'image/jpeg'), metadata);
  assert.deepEqual(raw, before, 'the original upload is unchanged');
});

test('JPEG ICC normalization rejects unknown signatures, split sequences, duplicates and invalid profiles', () => {
  const signature = ascii('ICC_PROFILE\0');
  for (const [sequence, count] of [[0, 1], [2, 1], [1, 0], [1, 2], [2, 2]]) {
    normalizedRejected(injectJpeg(0xe2, join(signature, Uint8Array.of(sequence, count), SRGB_ICC)), 'image/jpeg');
  }
  for (const prefix of [ascii('MPF\0'), ascii('ICC_PROFILEX'), signature]) {
    const payload = prefix.length === signature.length && prefix.at(-1) === 0
      ? prefix // Signature without sequence/count or profile is incomplete.
      : join(prefix, Uint8Array.of(1, 1), SRGB_ICC);
    normalizedRejected(injectJpeg(0xe2, payload), 'image/jpeg');
  }
  for (const profile of [SRGB_ICC.subarray(0, 131), changed(SRGB_ICC, 36, ...ascii('bad!')), changed(SRGB_ICC, 16, ...ascii('CMYK'))]) {
    normalizedRejected(injectJpeg(0xe2, join(signature, Uint8Array.of(1, 1), profile)), 'image/jpeg');
  }
  const app2 = segment(0xe2, join(signature, Uint8Array.of(1, 1), SRGB_ICC));
  normalizedRejected(join(JPEG.slice(0, 2), app2, app2, JPEG.slice(2)), 'image/jpeg');
  normalizedRejected(join(JPEG.slice(0, -2), app2, JPEG.slice(-2)), 'image/jpeg', 'APP2 inside entropy must not be stripped');
});

test('a valid JPEG ICC APP2 does not permit EXIF, XMP, Photoshop data, comments or unknown APP2', () => {
  const icc = segment(0xe2, join(ascii('ICC_PROFILE\0'), Uint8Array.of(1, 1), SRGB_ICC));
  for (const [marker, payload] of [
    [0xe1, ascii('Exif\0\0GPSLatitude=33;GPSLongitude=151')],
    [0xe1, ascii('http://ns.adobe.com/xap/1.0/\0<xmp>private</xmp>')],
    [0xed, ascii('Photoshop 3.0\0private image resources')],
    [0xfe, ascii('private comment')],
    [0xe2, ascii('MPF\0unknown application data')],
  ]) {
    const forbidden = segment(marker, payload);
    normalizedRejected(join(JPEG.slice(0, 2), icc, forbidden, JPEG.slice(2)), 'image/jpeg');
    normalizedRejected(join(JPEG.slice(0, 2), forbidden, icc, JPEG.slice(2)), 'image/jpeg');
  }
});
