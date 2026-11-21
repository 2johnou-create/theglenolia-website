// Prefix and suffix are independent, edition-fixed DEFLATE blocks compiled with the artwork.
// Only the personalised band is rebuilt. A single indexed PNG never requires decoding the photo.
const mod=65521;
const table=Uint32Array.from({length:256},(_,i)=>{let n=i;for(let k=0;k<8;k++)n=n&1?0xedb88320^(n>>>1):n>>>1;return n>>>0;});
export function crc32(bytes){
 let sum=0xffffffff;for(const x of bytes)sum=(sum>>>8)^table[(sum^x)&255];return (sum^0xffffffff)>>>0;
}
function uint(n){return Uint8Array.of(n>>>24,n>>>16&255,n>>>8&255,n&255);}
function join(parts){
 const result=new Uint8Array(parts.reduce((n,p)=>n+p.length,0));let off=0;for(const p of parts){result.set(p,off);off+=p.length;}return result;
}
function chunk(name,data){const contents=join([new TextEncoder().encode(name),data]);return join([uint(data.length),contents,uint(crc32(contents))]);}
function wrap(w,h,palette,idat){
 return join([Uint8Array.of(137,80,78,71,13,10,26,10),chunk('IHDR',join([uint(w),uint(h),Uint8Array.of(8,3,0,0,0)])),chunk('PLTE',palette),chunk('IDAT',idat),chunk('IEND',new Uint8Array())]);
}
function adler(bytes){let a=1,b=0;for(let i=0;i<bytes.length;){const end=Math.min(i+4096,bytes.length);for(;i<end;i++){a+=bytes[i];b+=a;}a%=mod;b%=mod;}return [a,b];}
function combine([a,b],[c,d],length){return [((a+c-1)%mod+mod)%mod,((b+d+(length%mod)*(a-1))%mod+mod)%mod];}
export function indexedPng(w,h,info,prefix,band,suffix){
 const blocks=[];
 for(let at=0;at<band.length;at+=65535){
  const part=band.subarray(at,at+65535),n=part.length;
  blocks.push(Uint8Array.of(0,n&255,n>>8,(~n)&255,(~n>>8)&255),part);
 }
 const [a,b]=combine(combine(info.top,adler(band),band.length),info.bottom,info.bottomLength);
 return wrap(w,h,Uint8Array.from(info.palette),join([Uint8Array.of(0x78,0x01),prefix,...blocks,suffix,uint((b<<16)|a)]));
}
