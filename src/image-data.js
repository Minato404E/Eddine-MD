export function decodeGeneratedImage(value){
 if(typeof value!=='string'||!value.length||value.length>14*1024*1024||!/^[A-Za-z0-9+/]+={0,2}$/.test(value))throw Error('Image provider returned invalid or oversized image data.');
 const buffer=Buffer.from(value,'base64');const png=buffer.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]));const jpg=buffer[0]===255&&buffer[1]===216&&buffer[2]===255;const webp=buffer.toString('ascii',0,4)==='RIFF'&&buffer.toString('ascii',8,12)==='WEBP';
 if(!buffer.length||buffer.length>10*1024*1024||!(png||jpg||webp))throw Error('Image provider returned unsupported image data.');return buffer;
}
