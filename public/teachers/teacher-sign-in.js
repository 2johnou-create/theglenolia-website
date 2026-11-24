export const TEACHER_CODE_VALID_MS = 15 * 60_000;
export const TEACHER_CODE_RESEND_MS = 90_000;
export const TEACHER_MAIL_SENDER = 'info@theglenolia.com.au';
export const TEACHER_LINK_VALID_MINUTES = 60;

export function validTeacherPassword(value){
 return typeof value==='string'&&/^[0-9]{8}$/.test(value);
}
const commonPasswords = new Set(['01234567','12345678','23456789','98765432','87654321','76543210','11223344','12121212','12341234','12344321']);
export function commonTeacherPassword(value){
 return commonPasswords.has(value)||/^([0-9])\1{7}$/.test(value);
}

export function normaliseTeacherEmail(value){
 if(typeof value!=='string'||/[\r\n]/.test(value))return null;
 const address=value.trim().toLowerCase();
 if(address.length>254)return null;
 const [local,domain,...extra]=address.split('@');
 if(!local||local.length>64||!domain||extra.length)return null;
 if(!/^[a-z0-9.!#$%&'*+\/=?^_`{|}~-]+$/.test(local)||local.startsWith('.')||local.endsWith('.')||local.includes('..'))return null;
 if(!/^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/.test(domain))return null;
 return address;
}
