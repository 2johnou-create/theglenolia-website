// WebKit can add EXIF and Photoshop headers to an otherwise fresh canvas JPEG.
// Only run this on the canvas encoder's output, after decoding the source photo.
export async function cleanCanvasJpeg(blob) {
  const bytes = new Uint8Array(await blob.arrayBuffer());
  const invalid = () => Error('This browser could not prepare the photo. Please choose another image.');
  if (bytes[0] !== 0xff || bytes[1] !== 0xd8) throw invalid();
  const parts = [];
  let offset = 2, keepFrom = 0;
  while (offset < bytes.length) {
    const start = offset;
    if (bytes[offset++] !== 0xff) throw invalid();
    while (bytes[offset] === 0xff) offset++;
    const marker = bytes[offset++];
    // The compressed scan must be copied byte for byte.
    if (marker === 0xda) {
      if (!parts.length) return blob;
      parts.push(bytes.subarray(keepFrom));
      return new Blob(parts,{type:'image/jpeg'});
    }
    if (offset + 2 > bytes.length) throw invalid();
    const length = bytes[offset] * 256 + bytes[offset+1];
    if (length < 2 || length > bytes.length - offset) throw invalid();
    offset += length;
    if ((marker >= 0xe0 && marker <= 0xef) || marker === 0xfe) {
      parts.push(bytes.subarray(keepFrom,start));
      keepFrom = offset;
    }
  }
  throw invalid();
}

// Only decoded pixels are drawn to a fresh canvas. Camera metadata never enters the journal.
export async function prepareFieldPhoto(file, allowPhoneFormats = false){
  const usual = ['image/jpeg','image/png','image/webp'].includes(file.type);
  const phone = allowPhoneFormats && (['image/heic','image/heif','image/avif'].includes(file.type) || (!file.type && /\.(jpe?g|png|webp|heic|heif|avif)$/i.test(file.name)));
  if ((!usual && !phone) || !file.size || file.size > 20*1024*1024) throw Error('Choose a photo under 20 MB. JPEG, PNG and WebP work in most browsers.');
  const url=URL.createObjectURL(file),image=new Image();
  try{
   image.src=url;await image.decode();const width=image.naturalWidth,height=image.naturalHeight;
   if(!width||!height||width*height>60000000)throw Error('Choose an image smaller than 60 megapixels. Your notes remain in the editor.');
   const scale=Math.min(1,1600/Math.max(width,height)),canvas=document.createElement('canvas');let edgeScale=scale;
   for(let pass=0;pass<5;pass++){
    canvas.width=Math.max(1,Math.round(width*edgeScale));canvas.height=Math.max(1,Math.round(height*edgeScale));
    const context=canvas.getContext('2d',{alpha:false});if(!context)throw Error('Image preparation is unavailable in this browser. Try a different browser.');
    context.fillStyle='#F5F1E8';context.fillRect(0,0,canvas.width,canvas.height);context.drawImage(image,0,0,canvas.width,canvas.height);
    for(const quality of [.84,.72,.6,.48]){
     let blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/webp',quality));
     if(blob?.type!=='image/webp')blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/jpeg',quality));
     if (blob?.size && blob.size <= 307200) {
       if (blob.type === 'image/webp') return blob;
       if (blob.type === 'image/jpeg') return await cleanCanvasJpeg(blob);
     }
    }
    edgeScale*=.78;
   }
   throw Error('This image could not be reduced below 300 KB. Choose a simpler or smaller image. Your notes remain in the editor.');
  }catch(error){if(error.name==='EncodingError')throw Error('This browser cannot open that photo. Choose a JPEG or take a new photo. Your note is still here.');throw error;}
  finally{URL.revokeObjectURL(url);}
 }
