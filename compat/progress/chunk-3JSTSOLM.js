var Kn={LEFT:0,MIDDLE:1,RIGHT:2,ROTATE:0,DOLLY:1,PAN:2},jn={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},Rh=0,Ql=1,Ch=2;var tc=1,Ph=2,An=3,Fn=0,Ce=1,ke=2,ye=0,ci=1,ec=2,nc=3,ic=4,zo=5,Je=100,Ih=101,Dh=102,Lh=103,Uh=104,_i=200,Nh=201,Fh=202,Oh=203,ro=204,oo=205,hr=206,Bh=207,ur=208,zh=209,kh=210,Vh=211,Hh=212,Gh=213,Wh=214,ko=0,Vo=1,Ho=2,hi=3,Go=4,Wo=5,Xo=6,qo=7,Yo=0,Xh=1,qh=2,zn=0,Zo=1,Jo=2,$o=3,os=4,Ko=5,jo=6,Qo=7;var sc=300,xi=301,vi=302,ta=303,ea=304,dr=306,He=1e3,Zn=1001,ao=1002,Re=1003,Yh=1004;var fr=1005;var $e=1006,na=1007;var Rn=1008;var tn=1009,rc=1010,oc=1011,as=1012,ia=1013,Qn=1014,xn=1015,vn=1016,sa=1017,ra=1018,ti=1020,ac=35902,lc=35899,cc=1021,hc=1022,Ue=1023,Gi=1026,ei=1027,oa=1028,aa=1029,uc=1030,la=1031;var ca=1033,pr=33776,mr=33777,gr=33778,_r=33779,ha=35840,ua=35841,da=35842,fa=35843,pa=36196,ma=37492,ga=37496,_a=37808,xa=37809,va=37810,ya=37811,Ma=37812,Sa=37813,ba=37814,Ea=37815,Ta=37816,wa=37817,Aa=37818,Ra=37819,Ca=37820,Pa=37821,Ia=36492,Da=36494,La=36495,Ua=36283,Na=36284,Fa=36285,Oa=36286;var Ps=2300,lo=2301,io=2302,Pl=2400,Il=2401,Dl=2402;var Zh=3200,Jh=3201;var xr=0,$h=1,kn="",Me="srgb",ui="srgb-linear",Is="linear",ne="srgb";var li=7680;var Ll=519,Kh=512,jh=513,Qh=514,dc=515,tu=516,eu=517,nu=518,iu=519,Ul=35044;var fc="300 es",gn=2e3,Ds=2001;var Sn=class{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){let n=this._listeners;return n===void 0?!1:n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){let n=this._listeners;if(n===void 0)return;let s=n[t];if(s!==void 0){let r=s.indexOf(e);r!==-1&&s.splice(r,1)}}dispatchEvent(t){let e=this._listeners;if(e===void 0)return;let n=e[t.type];if(n!==void 0){t.target=this;let s=n.slice(0);for(let r=0,o=s.length;r<o;r++)s[r].call(this,t);t.target=null}}},Pe=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Yc=1234567,ws=Math.PI/180,Wi=180/Math.PI;function yi(){let i=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Pe[i&255]+Pe[i>>8&255]+Pe[i>>16&255]+Pe[i>>24&255]+"-"+Pe[t&255]+Pe[t>>8&255]+"-"+Pe[t>>16&15|64]+Pe[t>>24&255]+"-"+Pe[e&63|128]+Pe[e>>8&255]+"-"+Pe[e>>16&255]+Pe[e>>24&255]+Pe[n&255]+Pe[n>>8&255]+Pe[n>>16&255]+Pe[n>>24&255]).toLowerCase()}function Yt(i,t,e){return Math.max(t,Math.min(e,i))}function pc(i,t){return(i%t+t)%t}function nd(i,t,e,n,s){return n+(i-t)*(s-n)/(e-t)}function id(i,t,e){return i!==t?(e-i)/(t-i):0}function As(i,t,e){return(1-e)*i+e*t}function sd(i,t,e,n){return As(i,t,1-Math.exp(-e*n))}function rd(i,t=1){return t-Math.abs(pc(i,t*2)-t)}function od(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*(3-2*i))}function ad(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*i*(i*(i*6-15)+10))}function ld(i,t){return i+Math.floor(Math.random()*(t-i+1))}function cd(i,t){return i+Math.random()*(t-i)}function hd(i){return i*(.5-Math.random())}function ud(i){i!==void 0&&(Yc=i);let t=Yc+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function dd(i){return i*ws}function fd(i){return i*Wi}function pd(i){return(i&i-1)===0&&i!==0}function md(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function gd(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function _d(i,t,e,n,s){let r=Math.cos,o=Math.sin,a=r(e/2),c=o(e/2),l=r((t+n)/2),h=o((t+n)/2),d=r((t-n)/2),f=o((t-n)/2),u=r((n-t)/2),g=o((n-t)/2);switch(s){case"XYX":i.set(a*h,c*d,c*f,a*l);break;case"YZY":i.set(c*f,a*h,c*d,a*l);break;case"ZXZ":i.set(c*d,c*f,a*h,a*l);break;case"XZX":i.set(a*h,c*g,c*u,a*l);break;case"YXY":i.set(c*u,a*h,c*g,a*l);break;case"ZYZ":i.set(c*g,c*u,a*h,a*l);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function Vi(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function Oe(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}var yn={DEG2RAD:ws,RAD2DEG:Wi,generateUUID:yi,clamp:Yt,euclideanModulo:pc,mapLinear:nd,inverseLerp:id,lerp:As,damp:sd,pingpong:rd,smoothstep:od,smootherstep:ad,randInt:ld,randFloat:cd,randFloatSpread:hd,seededRandom:ud,degToRad:dd,radToDeg:fd,isPowerOfTwo:pd,ceilPowerOfTwo:md,floorPowerOfTwo:gd,setQuaternionFromProperEuler:_d,normalize:Oe,denormalize:Vi},lt=class i{constructor(t=0,e=0){i.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){let e=this.x,n=this.y,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6],this.y=s[1]*e+s[4]*n+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Yt(this.x,t.x,e.x),this.y=Yt(this.y,t.y,e.y),this}clampScalar(t,e){return this.x=Yt(this.x,t,e),this.y=Yt(this.y,t,e),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Yt(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let n=this.dot(t)/e;return Math.acos(Yt(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){let n=Math.cos(e),s=Math.sin(e),r=this.x-t.x,o=this.y-t.y;return this.x=r*n-o*s+t.x,this.y=r*s+o*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},cn=class{constructor(t=0,e=0,n=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=s}static slerpFlat(t,e,n,s,r,o,a){let c=n[s+0],l=n[s+1],h=n[s+2],d=n[s+3],f=r[o+0],u=r[o+1],g=r[o+2],_=r[o+3];if(a===0){t[e+0]=c,t[e+1]=l,t[e+2]=h,t[e+3]=d;return}if(a===1){t[e+0]=f,t[e+1]=u,t[e+2]=g,t[e+3]=_;return}if(d!==_||c!==f||l!==u||h!==g){let m=1-a,p=c*f+l*u+h*g+d*_,E=p>=0?1:-1,M=1-p*p;if(M>Number.EPSILON){let R=Math.sqrt(M),A=Math.atan2(R,p*E);m=Math.sin(m*A)/R,a=Math.sin(a*A)/R}let y=a*E;if(c=c*m+f*y,l=l*m+u*y,h=h*m+g*y,d=d*m+_*y,m===1-a){let R=1/Math.sqrt(c*c+l*l+h*h+d*d);c*=R,l*=R,h*=R,d*=R}}t[e]=c,t[e+1]=l,t[e+2]=h,t[e+3]=d}static multiplyQuaternionsFlat(t,e,n,s,r,o){let a=n[s],c=n[s+1],l=n[s+2],h=n[s+3],d=r[o],f=r[o+1],u=r[o+2],g=r[o+3];return t[e]=a*g+h*d+c*u-l*f,t[e+1]=c*g+h*f+l*d-a*u,t[e+2]=l*g+h*u+a*f-c*d,t[e+3]=h*g-a*d-c*f-l*u,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,s){return this._x=t,this._y=e,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){let n=t._x,s=t._y,r=t._z,o=t._order,a=Math.cos,c=Math.sin,l=a(n/2),h=a(s/2),d=a(r/2),f=c(n/2),u=c(s/2),g=c(r/2);switch(o){case"XYZ":this._x=f*h*d+l*u*g,this._y=l*u*d-f*h*g,this._z=l*h*g+f*u*d,this._w=l*h*d-f*u*g;break;case"YXZ":this._x=f*h*d+l*u*g,this._y=l*u*d-f*h*g,this._z=l*h*g-f*u*d,this._w=l*h*d+f*u*g;break;case"ZXY":this._x=f*h*d-l*u*g,this._y=l*u*d+f*h*g,this._z=l*h*g+f*u*d,this._w=l*h*d-f*u*g;break;case"ZYX":this._x=f*h*d-l*u*g,this._y=l*u*d+f*h*g,this._z=l*h*g-f*u*d,this._w=l*h*d+f*u*g;break;case"YZX":this._x=f*h*d+l*u*g,this._y=l*u*d+f*h*g,this._z=l*h*g-f*u*d,this._w=l*h*d-f*u*g;break;case"XZY":this._x=f*h*d-l*u*g,this._y=l*u*d-f*h*g,this._z=l*h*g+f*u*d,this._w=l*h*d+f*u*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){let n=e/2,s=Math.sin(n);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){let e=t.elements,n=e[0],s=e[4],r=e[8],o=e[1],a=e[5],c=e[9],l=e[2],h=e[6],d=e[10],f=n+a+d;if(f>0){let u=.5/Math.sqrt(f+1);this._w=.25/u,this._x=(h-c)*u,this._y=(r-l)*u,this._z=(o-s)*u}else if(n>a&&n>d){let u=2*Math.sqrt(1+n-a-d);this._w=(h-c)/u,this._x=.25*u,this._y=(s+o)/u,this._z=(r+l)/u}else if(a>d){let u=2*Math.sqrt(1+a-n-d);this._w=(r-l)/u,this._x=(s+o)/u,this._y=.25*u,this._z=(c+h)/u}else{let u=2*Math.sqrt(1+d-n-a);this._w=(o-s)/u,this._x=(r+l)/u,this._y=(c+h)/u,this._z=.25*u}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<1e-8?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(Yt(this.dot(t),-1,1)))}rotateTowards(t,e){let n=this.angleTo(t);if(n===0)return this;let s=Math.min(1,e/n);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){let n=t._x,s=t._y,r=t._z,o=t._w,a=e._x,c=e._y,l=e._z,h=e._w;return this._x=n*h+o*a+s*l-r*c,this._y=s*h+o*c+r*a-n*l,this._z=r*h+o*l+n*c-s*a,this._w=o*h-n*a-s*c-r*l,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);let n=this._x,s=this._y,r=this._z,o=this._w,a=o*t._w+n*t._x+s*t._y+r*t._z;if(a<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,a=-a):this.copy(t),a>=1)return this._w=o,this._x=n,this._y=s,this._z=r,this;let c=1-a*a;if(c<=Number.EPSILON){let u=1-e;return this._w=u*o+e*this._w,this._x=u*n+e*this._x,this._y=u*s+e*this._y,this._z=u*r+e*this._z,this.normalize(),this}let l=Math.sqrt(c),h=Math.atan2(l,a),d=Math.sin((1-e)*h)/l,f=Math.sin(e*h)/l;return this._w=o*d+this._w*f,this._x=n*d+this._x*f,this._y=s*d+this._y*f,this._z=r*d+this._z*f,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){let t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(t),s*Math.cos(t),r*Math.sin(e),r*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},C=class i{constructor(t=0,e=0,n=0){i.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(Zc.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(Zc.setFromAxisAngle(t,e))}applyMatrix3(t){let e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6]*s,this.y=r[1]*e+r[4]*n+r[7]*s,this.z=r[2]*e+r[5]*n+r[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){let e=this.x,n=this.y,s=this.z,r=t.elements,o=1/(r[3]*e+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*e+r[4]*n+r[8]*s+r[12])*o,this.y=(r[1]*e+r[5]*n+r[9]*s+r[13])*o,this.z=(r[2]*e+r[6]*n+r[10]*s+r[14])*o,this}applyQuaternion(t){let e=this.x,n=this.y,s=this.z,r=t.x,o=t.y,a=t.z,c=t.w,l=2*(o*s-a*n),h=2*(a*e-r*s),d=2*(r*n-o*e);return this.x=e+c*l+o*d-a*h,this.y=n+c*h+a*l-r*d,this.z=s+c*d+r*h-o*l,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){let e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*s,this.y=r[1]*e+r[5]*n+r[9]*s,this.z=r[2]*e+r[6]*n+r[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Yt(this.x,t.x,e.x),this.y=Yt(this.y,t.y,e.y),this.z=Yt(this.z,t.z,e.z),this}clampScalar(t,e){return this.x=Yt(this.x,t,e),this.y=Yt(this.y,t,e),this.z=Yt(this.z,t,e),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Yt(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){let n=t.x,s=t.y,r=t.z,o=e.x,a=e.y,c=e.z;return this.x=s*c-r*a,this.y=r*o-n*c,this.z=n*a-s*o,this}projectOnVector(t){let e=t.lengthSq();if(e===0)return this.set(0,0,0);let n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return il.copy(this).projectOnVector(t),this.sub(il)}reflect(t){return this.sub(il.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let n=this.dot(t)/e;return Math.acos(Yt(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,n=this.y-t.y,s=this.z-t.z;return e*e+n*n+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){let s=Math.sin(e)*t;return this.x=s*Math.sin(n),this.y=Math.cos(e)*t,this.z=s*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){let e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){let e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let t=Math.random()*Math.PI*2,e=Math.random()*2-1,n=Math.sqrt(1-e*e);return this.x=n*Math.cos(t),this.y=e,this.z=n*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},il=new C,Zc=new cn,Zt=class i{constructor(t,e,n,s,r,o,a,c,l){i.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,o,a,c,l)}set(t,e,n,s,r,o,a,c,l){let h=this.elements;return h[0]=t,h[1]=s,h[2]=a,h[3]=e,h[4]=r,h[5]=c,h[6]=n,h[7]=o,h[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){let e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){let e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let n=t.elements,s=e.elements,r=this.elements,o=n[0],a=n[3],c=n[6],l=n[1],h=n[4],d=n[7],f=n[2],u=n[5],g=n[8],_=s[0],m=s[3],p=s[6],E=s[1],M=s[4],y=s[7],R=s[2],A=s[5],P=s[8];return r[0]=o*_+a*E+c*R,r[3]=o*m+a*M+c*A,r[6]=o*p+a*y+c*P,r[1]=l*_+h*E+d*R,r[4]=l*m+h*M+d*A,r[7]=l*p+h*y+d*P,r[2]=f*_+u*E+g*R,r[5]=f*m+u*M+g*A,r[8]=f*p+u*y+g*P,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){let t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],c=t[6],l=t[7],h=t[8];return e*o*h-e*a*l-n*r*h+n*a*c+s*r*l-s*o*c}invert(){let t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],c=t[6],l=t[7],h=t[8],d=h*o-a*l,f=a*c-h*r,u=l*r-o*c,g=e*d+n*f+s*u;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);let _=1/g;return t[0]=d*_,t[1]=(s*l-h*n)*_,t[2]=(a*n-s*o)*_,t[3]=f*_,t[4]=(h*e-s*c)*_,t[5]=(s*r-a*e)*_,t[6]=u*_,t[7]=(n*c-l*e)*_,t[8]=(o*e-n*r)*_,this}transpose(){let t,e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){let e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,s,r,o,a){let c=Math.cos(r),l=Math.sin(r);return this.set(n*c,n*l,-n*(c*o+l*a)+o+t,-s*l,s*c,-s*(-l*o+c*a)+a+e,0,0,1),this}scale(t,e){return this.premultiply(sl.makeScale(t,e)),this}rotate(t){return this.premultiply(sl.makeRotation(-t)),this}translate(t,e){return this.premultiply(sl.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){let e=this.elements,n=t.elements;for(let s=0;s<9;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){let n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}},sl=new Zt;function mc(i){for(let t=i.length-1;t>=0;--t)if(i[t]>=65535)return!0;return!1}function Xi(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function su(){let i=Xi("canvas");return i.style.display="block",i}var Jc={};function qi(i){i in Jc||(Jc[i]=!0,console.warn(i))}function ru(i,t,e){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(t,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,e);break;default:n()}}setTimeout(r,e)})}var $c=new Zt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Kc=new Zt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function xd(){let i={enabled:!0,workingColorSpace:ui,spaces:{},convert:function(s,r,o){return this.enabled===!1||r===o||!r||!o||(this.spaces[r].transfer===ne&&(s.r=Nn(s.r),s.g=Nn(s.g),s.b=Nn(s.b)),this.spaces[r].primaries!==this.spaces[o].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[o].fromXYZ)),this.spaces[o].transfer===ne&&(s.r=Hi(s.r),s.g=Hi(s.g),s.b=Hi(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===kn?Is:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,o){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[o].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return qi("THREE.ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),i.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return qi("THREE.ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),i.colorSpaceToWorking(s,r)}},t=[.64,.33,.3,.6,.15,.06],e=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[ui]:{primaries:t,whitePoint:n,transfer:Is,toXYZ:$c,fromXYZ:Kc,luminanceCoefficients:e,workingColorSpaceConfig:{unpackColorSpace:Me},outputColorSpaceConfig:{drawingBufferColorSpace:Me}},[Me]:{primaries:t,whitePoint:n,transfer:ne,toXYZ:$c,fromXYZ:Kc,luminanceCoefficients:e,outputColorSpaceConfig:{drawingBufferColorSpace:Me}}}),i}var te=xd();function Nn(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function Hi(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}var Ai,co=class{static getDataURL(t,e="image/png"){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let n;if(t instanceof HTMLCanvasElement)n=t;else{Ai===void 0&&(Ai=Xi("canvas")),Ai.width=t.width,Ai.height=t.height;let s=Ai.getContext("2d");t instanceof ImageData?s.putImageData(t,0,0):s.drawImage(t,0,0,t.width,t.height),n=Ai}return n.toDataURL(e)}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){let e=Xi("canvas");e.width=t.width,e.height=t.height;let n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);let s=n.getImageData(0,0,t.width,t.height),r=s.data;for(let o=0;o<r.length;o++)r[o]=Nn(r[o]/255)*255;return n.putImageData(s,0,0),e}else if(t.data){let e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(Nn(e[n]/255)*255):e[n]=Nn(e[n]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}},vd=0,Yi=class{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:vd++}),this.uuid=yi(),this.data=t,this.dataReady=!0,this.version=0}getSize(t){let e=this.data;return typeof HTMLVideoElement<"u"&&e instanceof HTMLVideoElement?t.set(e.videoWidth,e.videoHeight,0):e instanceof VideoFrame?t.set(e.displayHeight,e.displayWidth,0):e!==null?t.set(e.width,e.height,e.depth||0):t.set(0,0,0),t}set needsUpdate(t){t===!0&&this.version++}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];let n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let o=0,a=s.length;o<a;o++)s[o].isDataTexture?r.push(rl(s[o].image)):r.push(rl(s[o]))}else r=rl(s);n.url=r}return e||(t.images[this.uuid]=n),n}};function rl(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?co.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}var yd=0,ol=new C,Le=class i extends Sn{constructor(t=i.DEFAULT_IMAGE,e=i.DEFAULT_MAPPING,n=Zn,s=Zn,r=$e,o=Rn,a=Ue,c=tn,l=i.DEFAULT_ANISOTROPY,h=kn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:yd++}),this.uuid=yi(),this.name="",this.source=new Yi(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=o,this.anisotropy=l,this.format=a,this.internalFormat=null,this.type=c,this.offset=new lt(0,0),this.repeat=new lt(1,1),this.center=new lt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Zt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(ol).x}get height(){return this.source.getSize(ol).y}get depth(){return this.source.getSize(ol).z}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.renderTarget=t.renderTarget,this.isRenderTargetTexture=t.isRenderTargetTexture,this.isArrayTexture=t.isArrayTexture,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}setValues(t){for(let e in t){let n=t[e];if(n===void 0){console.warn(`THREE.Texture.setValues(): parameter '${e}' has value of undefined.`);continue}let s=this[e];if(s===void 0){console.warn(`THREE.Texture.setValues(): property '${e}' does not exist.`);continue}s&&n&&s.isVector2&&n.isVector2||s&&n&&s.isVector3&&n.isVector3||s&&n&&s.isMatrix3&&n.isMatrix3?s.copy(n):this[e]=n}}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];let n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==sc)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case He:t.x=t.x-Math.floor(t.x);break;case Zn:t.x=t.x<0?0:1;break;case ao:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case He:t.y=t.y-Math.floor(t.y);break;case Zn:t.y=t.y<0?0:1;break;case ao:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}};Le.DEFAULT_IMAGE=null;Le.DEFAULT_MAPPING=sc;Le.DEFAULT_ANISOTROPY=1;var se=class i{constructor(t=0,e=0,n=0,s=1){i.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,s){return this.x=t,this.y=e,this.z=n,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){let e=this.x,n=this.y,s=this.z,r=this.w,o=t.elements;return this.x=o[0]*e+o[4]*n+o[8]*s+o[12]*r,this.y=o[1]*e+o[5]*n+o[9]*s+o[13]*r,this.z=o[2]*e+o[6]*n+o[10]*s+o[14]*r,this.w=o[3]*e+o[7]*n+o[11]*s+o[15]*r,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);let e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,s,r,c=t.elements,l=c[0],h=c[4],d=c[8],f=c[1],u=c[5],g=c[9],_=c[2],m=c[6],p=c[10];if(Math.abs(h-f)<.01&&Math.abs(d-_)<.01&&Math.abs(g-m)<.01){if(Math.abs(h+f)<.1&&Math.abs(d+_)<.1&&Math.abs(g+m)<.1&&Math.abs(l+u+p-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;let M=(l+1)/2,y=(u+1)/2,R=(p+1)/2,A=(h+f)/4,P=(d+_)/4,D=(g+m)/4;return M>y&&M>R?M<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(M),s=A/n,r=P/n):y>R?y<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(y),n=A/s,r=D/s):R<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(R),n=P/r,s=D/r),this.set(n,s,r,e),this}let E=Math.sqrt((m-g)*(m-g)+(d-_)*(d-_)+(f-h)*(f-h));return Math.abs(E)<.001&&(E=1),this.x=(m-g)/E,this.y=(d-_)/E,this.z=(f-h)/E,this.w=Math.acos((l+u+p-1)/2),this}setFromMatrixPosition(t){let e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Yt(this.x,t.x,e.x),this.y=Yt(this.y,t.y,e.y),this.z=Yt(this.z,t.z,e.z),this.w=Yt(this.w,t.w,e.w),this}clampScalar(t,e){return this.x=Yt(this.x,t,e),this.y=Yt(this.y,t,e),this.z=Yt(this.z,t,e),this.w=Yt(this.w,t,e),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Yt(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},ho=class extends Sn{constructor(t=1,e=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:$e,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},n),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=n.depth,this.scissor=new se(0,0,t,e),this.scissorTest=!1,this.viewport=new se(0,0,t,e);let s={width:t,height:e,depth:n.depth},r=new Le(s);this.textures=[];let o=n.count;for(let a=0;a<o;a++)this.textures[a]=r.clone(),this.textures[a].isRenderTargetTexture=!0,this.textures[a].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview}_setTextureOptions(t={}){let e={minFilter:$e,generateMipmaps:!1,flipY:!1,internalFormat:null};t.mapping!==void 0&&(e.mapping=t.mapping),t.wrapS!==void 0&&(e.wrapS=t.wrapS),t.wrapT!==void 0&&(e.wrapT=t.wrapT),t.wrapR!==void 0&&(e.wrapR=t.wrapR),t.magFilter!==void 0&&(e.magFilter=t.magFilter),t.minFilter!==void 0&&(e.minFilter=t.minFilter),t.format!==void 0&&(e.format=t.format),t.type!==void 0&&(e.type=t.type),t.anisotropy!==void 0&&(e.anisotropy=t.anisotropy),t.colorSpace!==void 0&&(e.colorSpace=t.colorSpace),t.flipY!==void 0&&(e.flipY=t.flipY),t.generateMipmaps!==void 0&&(e.generateMipmaps=t.generateMipmaps),t.internalFormat!==void 0&&(e.internalFormat=t.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(e)}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}set depthTexture(t){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),t!==null&&(t.renderTarget=this),this._depthTexture=t}get depthTexture(){return this._depthTexture}setSize(t,e,n=1){if(this.width!==t||this.height!==e||this.depth!==n){this.width=t,this.height=e,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=t,this.textures[s].image.height=e,this.textures[s].image.depth=n,this.textures[s].isArrayTexture=this.textures[s].image.depth>1;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let e=0,n=t.textures.length;e<n;e++){this.textures[e]=t.textures[e].clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;let s=Object.assign({},t.textures[e].image);this.textures[e].source=new Yi(s)}return this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}},ze=class extends ho{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}},Ls=class extends Le{constructor(t=null,e=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=Re,this.minFilter=Re,this.wrapR=Zn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}};var uo=class extends Le{constructor(t=null,e=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=Re,this.minFilter=Re,this.wrapR=Zn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var bn=class{constructor(t=new C(1/0,1/0,1/0),e=new C(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(fn.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(fn.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){let n=fn.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);let n=t.geometry;if(n!==void 0){let r=n.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)t.isMesh===!0?t.getVertexPosition(o,fn):fn.fromBufferAttribute(r,o),fn.applyMatrix4(t.matrixWorld),this.expandByPoint(fn);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),Ir.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Ir.copy(n.boundingBox)),Ir.applyMatrix4(t.matrixWorld),this.union(Ir)}let s=t.children;for(let r=0,o=s.length;r<o;r++)this.expandByObject(s[r],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,fn),fn.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(_s),Dr.subVectors(this.max,_s),Ri.subVectors(t.a,_s),Ci.subVectors(t.b,_s),Pi.subVectors(t.c,_s),Vn.subVectors(Ci,Ri),Hn.subVectors(Pi,Ci),si.subVectors(Ri,Pi);let e=[0,-Vn.z,Vn.y,0,-Hn.z,Hn.y,0,-si.z,si.y,Vn.z,0,-Vn.x,Hn.z,0,-Hn.x,si.z,0,-si.x,-Vn.y,Vn.x,0,-Hn.y,Hn.x,0,-si.y,si.x,0];return!al(e,Ri,Ci,Pi,Dr)||(e=[1,0,0,0,1,0,0,0,1],!al(e,Ri,Ci,Pi,Dr))?!1:(Lr.crossVectors(Vn,Hn),e=[Lr.x,Lr.y,Lr.z],al(e,Ri,Ci,Pi,Dr))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,fn).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(fn).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(Pn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),Pn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),Pn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),Pn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),Pn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),Pn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),Pn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),Pn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(Pn),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(t){return this.min.fromArray(t.min),this.max.fromArray(t.max),this}},Pn=[new C,new C,new C,new C,new C,new C,new C,new C],fn=new C,Ir=new bn,Ri=new C,Ci=new C,Pi=new C,Vn=new C,Hn=new C,si=new C,_s=new C,Dr=new C,Lr=new C,ri=new C;function al(i,t,e,n,s){for(let r=0,o=i.length-3;r<=o;r+=3){ri.fromArray(i,r);let a=s.x*Math.abs(ri.x)+s.y*Math.abs(ri.y)+s.z*Math.abs(ri.z),c=t.dot(ri),l=e.dot(ri),h=n.dot(ri);if(Math.max(-Math.max(c,l,h),Math.min(c,l,h))>a)return!1}return!0}var Md=new bn,xs=new C,ll=new C,En=class{constructor(t=new C,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){let n=this.center;e!==void 0?n.copy(e):Md.setFromPoints(t).getCenter(n);let s=0;for(let r=0,o=t.length;r<o;r++)s=Math.max(s,n.distanceToSquared(t[r]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){let e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){let n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;xs.subVectors(t,this.center);let e=xs.lengthSq();if(e>this.radius*this.radius){let n=Math.sqrt(e),s=(n-this.radius)*.5;this.center.addScaledVector(xs,s/n),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(ll.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(xs.copy(t.center).add(ll)),this.expandByPoint(xs.copy(t.center).sub(ll))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(t){return this.radius=t.radius,this.center.fromArray(t.center),this}},In=new C,cl=new C,Ur=new C,Gn=new C,hl=new C,Nr=new C,ul=new C,On=class{constructor(t=new C,e=new C(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,In)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);let n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){let e=In.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(In.copy(this.origin).addScaledVector(this.direction,e),In.distanceToSquared(t))}distanceSqToSegment(t,e,n,s){cl.copy(t).add(e).multiplyScalar(.5),Ur.copy(e).sub(t).normalize(),Gn.copy(this.origin).sub(cl);let r=t.distanceTo(e)*.5,o=-this.direction.dot(Ur),a=Gn.dot(this.direction),c=-Gn.dot(Ur),l=Gn.lengthSq(),h=Math.abs(1-o*o),d,f,u,g;if(h>0)if(d=o*c-a,f=o*a-c,g=r*h,d>=0)if(f>=-g)if(f<=g){let _=1/h;d*=_,f*=_,u=d*(d+o*f+2*a)+f*(o*d+f+2*c)+l}else f=r,d=Math.max(0,-(o*f+a)),u=-d*d+f*(f+2*c)+l;else f=-r,d=Math.max(0,-(o*f+a)),u=-d*d+f*(f+2*c)+l;else f<=-g?(d=Math.max(0,-(-o*r+a)),f=d>0?-r:Math.min(Math.max(-r,-c),r),u=-d*d+f*(f+2*c)+l):f<=g?(d=0,f=Math.min(Math.max(-r,-c),r),u=f*(f+2*c)+l):(d=Math.max(0,-(o*r+a)),f=d>0?r:Math.min(Math.max(-r,-c),r),u=-d*d+f*(f+2*c)+l);else f=o>0?-r:r,d=Math.max(0,-(o*f+a)),u=-d*d+f*(f+2*c)+l;return n&&n.copy(this.origin).addScaledVector(this.direction,d),s&&s.copy(cl).addScaledVector(Ur,f),u}intersectSphere(t,e){In.subVectors(t.center,this.origin);let n=In.dot(this.direction),s=In.dot(In)-n*n,r=t.radius*t.radius;if(s>r)return null;let o=Math.sqrt(r-s),a=n-o,c=n+o;return c<0?null:a<0?this.at(c,e):this.at(a,e)}intersectsSphere(t){return t.radius<0?!1:this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){let e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){let n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){let e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,s,r,o,a,c,l=1/this.direction.x,h=1/this.direction.y,d=1/this.direction.z,f=this.origin;return l>=0?(n=(t.min.x-f.x)*l,s=(t.max.x-f.x)*l):(n=(t.max.x-f.x)*l,s=(t.min.x-f.x)*l),h>=0?(r=(t.min.y-f.y)*h,o=(t.max.y-f.y)*h):(r=(t.max.y-f.y)*h,o=(t.min.y-f.y)*h),n>o||r>s||((r>n||isNaN(n))&&(n=r),(o<s||isNaN(s))&&(s=o),d>=0?(a=(t.min.z-f.z)*d,c=(t.max.z-f.z)*d):(a=(t.max.z-f.z)*d,c=(t.min.z-f.z)*d),n>c||a>s)||((a>n||n!==n)&&(n=a),(c<s||s!==s)&&(s=c),s<0)?null:this.at(n>=0?n:s,e)}intersectsBox(t){return this.intersectBox(t,In)!==null}intersectTriangle(t,e,n,s,r){hl.subVectors(e,t),Nr.subVectors(n,t),ul.crossVectors(hl,Nr);let o=this.direction.dot(ul),a;if(o>0){if(s)return null;a=1}else if(o<0)a=-1,o=-o;else return null;Gn.subVectors(this.origin,t);let c=a*this.direction.dot(Nr.crossVectors(Gn,Nr));if(c<0)return null;let l=a*this.direction.dot(hl.cross(Gn));if(l<0||c+l>o)return null;let h=-a*Gn.dot(ul);return h<0?null:this.at(h/o,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},jt=class i{constructor(t,e,n,s,r,o,a,c,l,h,d,f,u,g,_,m){i.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,o,a,c,l,h,d,f,u,g,_,m)}set(t,e,n,s,r,o,a,c,l,h,d,f,u,g,_,m){let p=this.elements;return p[0]=t,p[4]=e,p[8]=n,p[12]=s,p[1]=r,p[5]=o,p[9]=a,p[13]=c,p[2]=l,p[6]=h,p[10]=d,p[14]=f,p[3]=u,p[7]=g,p[11]=_,p[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new i().fromArray(this.elements)}copy(t){let e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){let e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){let e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){let e=this.elements,n=t.elements,s=1/Ii.setFromMatrixColumn(t,0).length(),r=1/Ii.setFromMatrixColumn(t,1).length(),o=1/Ii.setFromMatrixColumn(t,2).length();return e[0]=n[0]*s,e[1]=n[1]*s,e[2]=n[2]*s,e[3]=0,e[4]=n[4]*r,e[5]=n[5]*r,e[6]=n[6]*r,e[7]=0,e[8]=n[8]*o,e[9]=n[9]*o,e[10]=n[10]*o,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){let e=this.elements,n=t.x,s=t.y,r=t.z,o=Math.cos(n),a=Math.sin(n),c=Math.cos(s),l=Math.sin(s),h=Math.cos(r),d=Math.sin(r);if(t.order==="XYZ"){let f=o*h,u=o*d,g=a*h,_=a*d;e[0]=c*h,e[4]=-c*d,e[8]=l,e[1]=u+g*l,e[5]=f-_*l,e[9]=-a*c,e[2]=_-f*l,e[6]=g+u*l,e[10]=o*c}else if(t.order==="YXZ"){let f=c*h,u=c*d,g=l*h,_=l*d;e[0]=f+_*a,e[4]=g*a-u,e[8]=o*l,e[1]=o*d,e[5]=o*h,e[9]=-a,e[2]=u*a-g,e[6]=_+f*a,e[10]=o*c}else if(t.order==="ZXY"){let f=c*h,u=c*d,g=l*h,_=l*d;e[0]=f-_*a,e[4]=-o*d,e[8]=g+u*a,e[1]=u+g*a,e[5]=o*h,e[9]=_-f*a,e[2]=-o*l,e[6]=a,e[10]=o*c}else if(t.order==="ZYX"){let f=o*h,u=o*d,g=a*h,_=a*d;e[0]=c*h,e[4]=g*l-u,e[8]=f*l+_,e[1]=c*d,e[5]=_*l+f,e[9]=u*l-g,e[2]=-l,e[6]=a*c,e[10]=o*c}else if(t.order==="YZX"){let f=o*c,u=o*l,g=a*c,_=a*l;e[0]=c*h,e[4]=_-f*d,e[8]=g*d+u,e[1]=d,e[5]=o*h,e[9]=-a*h,e[2]=-l*h,e[6]=u*d+g,e[10]=f-_*d}else if(t.order==="XZY"){let f=o*c,u=o*l,g=a*c,_=a*l;e[0]=c*h,e[4]=-d,e[8]=l*h,e[1]=f*d+_,e[5]=o*h,e[9]=u*d-g,e[2]=g*d-u,e[6]=a*h,e[10]=_*d+f}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(Sd,t,bd)}lookAt(t,e,n){let s=this.elements;return Ye.subVectors(t,e),Ye.lengthSq()===0&&(Ye.z=1),Ye.normalize(),Wn.crossVectors(n,Ye),Wn.lengthSq()===0&&(Math.abs(n.z)===1?Ye.x+=1e-4:Ye.z+=1e-4,Ye.normalize(),Wn.crossVectors(n,Ye)),Wn.normalize(),Fr.crossVectors(Ye,Wn),s[0]=Wn.x,s[4]=Fr.x,s[8]=Ye.x,s[1]=Wn.y,s[5]=Fr.y,s[9]=Ye.y,s[2]=Wn.z,s[6]=Fr.z,s[10]=Ye.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let n=t.elements,s=e.elements,r=this.elements,o=n[0],a=n[4],c=n[8],l=n[12],h=n[1],d=n[5],f=n[9],u=n[13],g=n[2],_=n[6],m=n[10],p=n[14],E=n[3],M=n[7],y=n[11],R=n[15],A=s[0],P=s[4],D=s[8],b=s[12],v=s[1],L=s[5],O=s[9],W=s[13],Z=s[2],j=s[6],$=s[10],dt=s[14],X=s[3],pt=s[7],St=s[11],wt=s[15];return r[0]=o*A+a*v+c*Z+l*X,r[4]=o*P+a*L+c*j+l*pt,r[8]=o*D+a*O+c*$+l*St,r[12]=o*b+a*W+c*dt+l*wt,r[1]=h*A+d*v+f*Z+u*X,r[5]=h*P+d*L+f*j+u*pt,r[9]=h*D+d*O+f*$+u*St,r[13]=h*b+d*W+f*dt+u*wt,r[2]=g*A+_*v+m*Z+p*X,r[6]=g*P+_*L+m*j+p*pt,r[10]=g*D+_*O+m*$+p*St,r[14]=g*b+_*W+m*dt+p*wt,r[3]=E*A+M*v+y*Z+R*X,r[7]=E*P+M*L+y*j+R*pt,r[11]=E*D+M*O+y*$+R*St,r[15]=E*b+M*W+y*dt+R*wt,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){let t=this.elements,e=t[0],n=t[4],s=t[8],r=t[12],o=t[1],a=t[5],c=t[9],l=t[13],h=t[2],d=t[6],f=t[10],u=t[14],g=t[3],_=t[7],m=t[11],p=t[15];return g*(+r*c*d-s*l*d-r*a*f+n*l*f+s*a*u-n*c*u)+_*(+e*c*u-e*l*f+r*o*f-s*o*u+s*l*h-r*c*h)+m*(+e*l*d-e*a*u-r*o*d+n*o*u+r*a*h-n*l*h)+p*(-s*a*h-e*c*d+e*a*f+s*o*d-n*o*f+n*c*h)}transpose(){let t=this.elements,e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){let s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=n),this}invert(){let t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],c=t[6],l=t[7],h=t[8],d=t[9],f=t[10],u=t[11],g=t[12],_=t[13],m=t[14],p=t[15],E=d*m*l-_*f*l+_*c*u-a*m*u-d*c*p+a*f*p,M=g*f*l-h*m*l-g*c*u+o*m*u+h*c*p-o*f*p,y=h*_*l-g*d*l+g*a*u-o*_*u-h*a*p+o*d*p,R=g*d*c-h*_*c-g*a*f+o*_*f+h*a*m-o*d*m,A=e*E+n*M+s*y+r*R;if(A===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let P=1/A;return t[0]=E*P,t[1]=(_*f*r-d*m*r-_*s*u+n*m*u+d*s*p-n*f*p)*P,t[2]=(a*m*r-_*c*r+_*s*l-n*m*l-a*s*p+n*c*p)*P,t[3]=(d*c*r-a*f*r-d*s*l+n*f*l+a*s*u-n*c*u)*P,t[4]=M*P,t[5]=(h*m*r-g*f*r+g*s*u-e*m*u-h*s*p+e*f*p)*P,t[6]=(g*c*r-o*m*r-g*s*l+e*m*l+o*s*p-e*c*p)*P,t[7]=(o*f*r-h*c*r+h*s*l-e*f*l-o*s*u+e*c*u)*P,t[8]=y*P,t[9]=(g*d*r-h*_*r-g*n*u+e*_*u+h*n*p-e*d*p)*P,t[10]=(o*_*r-g*a*r+g*n*l-e*_*l-o*n*p+e*a*p)*P,t[11]=(h*a*r-o*d*r-h*n*l+e*d*l+o*n*u-e*a*u)*P,t[12]=R*P,t[13]=(h*_*s-g*d*s+g*n*f-e*_*f-h*n*m+e*d*m)*P,t[14]=(g*a*s-o*_*s-g*n*c+e*_*c+o*n*m-e*a*m)*P,t[15]=(o*d*s-h*a*s+h*n*c-e*d*c-o*n*f+e*a*f)*P,this}scale(t){let e=this.elements,n=t.x,s=t.y,r=t.z;return e[0]*=n,e[4]*=s,e[8]*=r,e[1]*=n,e[5]*=s,e[9]*=r,e[2]*=n,e[6]*=s,e[10]*=r,e[3]*=n,e[7]*=s,e[11]*=r,this}getMaxScaleOnAxis(){let t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,s))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){let e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){let n=Math.cos(e),s=Math.sin(e),r=1-n,o=t.x,a=t.y,c=t.z,l=r*o,h=r*a;return this.set(l*o+n,l*a-s*c,l*c+s*a,0,l*a+s*c,h*a+n,h*c-s*o,0,l*c-s*a,h*c+s*o,r*c*c+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,s,r,o){return this.set(1,n,r,0,t,1,o,0,e,s,1,0,0,0,0,1),this}compose(t,e,n){let s=this.elements,r=e._x,o=e._y,a=e._z,c=e._w,l=r+r,h=o+o,d=a+a,f=r*l,u=r*h,g=r*d,_=o*h,m=o*d,p=a*d,E=c*l,M=c*h,y=c*d,R=n.x,A=n.y,P=n.z;return s[0]=(1-(_+p))*R,s[1]=(u+y)*R,s[2]=(g-M)*R,s[3]=0,s[4]=(u-y)*A,s[5]=(1-(f+p))*A,s[6]=(m+E)*A,s[7]=0,s[8]=(g+M)*P,s[9]=(m-E)*P,s[10]=(1-(f+_))*P,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,n){let s=this.elements,r=Ii.set(s[0],s[1],s[2]).length(),o=Ii.set(s[4],s[5],s[6]).length(),a=Ii.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),t.x=s[12],t.y=s[13],t.z=s[14],pn.copy(this);let l=1/r,h=1/o,d=1/a;return pn.elements[0]*=l,pn.elements[1]*=l,pn.elements[2]*=l,pn.elements[4]*=h,pn.elements[5]*=h,pn.elements[6]*=h,pn.elements[8]*=d,pn.elements[9]*=d,pn.elements[10]*=d,e.setFromRotationMatrix(pn),n.x=r,n.y=o,n.z=a,this}makePerspective(t,e,n,s,r,o,a=gn,c=!1){let l=this.elements,h=2*r/(e-t),d=2*r/(n-s),f=(e+t)/(e-t),u=(n+s)/(n-s),g,_;if(c)g=r/(o-r),_=o*r/(o-r);else if(a===gn)g=-(o+r)/(o-r),_=-2*o*r/(o-r);else if(a===Ds)g=-o/(o-r),_=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return l[0]=h,l[4]=0,l[8]=f,l[12]=0,l[1]=0,l[5]=d,l[9]=u,l[13]=0,l[2]=0,l[6]=0,l[10]=g,l[14]=_,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(t,e,n,s,r,o,a=gn,c=!1){let l=this.elements,h=2/(e-t),d=2/(n-s),f=-(e+t)/(e-t),u=-(n+s)/(n-s),g,_;if(c)g=1/(o-r),_=o/(o-r);else if(a===gn)g=-2/(o-r),_=-(o+r)/(o-r);else if(a===Ds)g=-1/(o-r),_=-r/(o-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return l[0]=h,l[4]=0,l[8]=0,l[12]=f,l[1]=0,l[5]=d,l[9]=0,l[13]=u,l[2]=0,l[6]=0,l[10]=g,l[14]=_,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(t){let e=this.elements,n=t.elements;for(let s=0;s<16;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){let n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}},Ii=new C,pn=new jt,Sd=new C(0,0,0),bd=new C(1,1,1),Wn=new C,Fr=new C,Ye=new C,jc=new jt,Qc=new cn,hn=class i{constructor(t=0,e=0,n=0,s=i.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,s=this._order){return this._x=t,this._y=e,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){let s=t.elements,r=s[0],o=s[4],a=s[8],c=s[1],l=s[5],h=s[9],d=s[2],f=s[6],u=s[10];switch(e){case"XYZ":this._y=Math.asin(Yt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-h,u),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(f,l),this._z=0);break;case"YXZ":this._x=Math.asin(-Yt(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(a,u),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-d,r),this._z=0);break;case"ZXY":this._x=Math.asin(Yt(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-d,u),this._z=Math.atan2(-o,l)):(this._y=0,this._z=Math.atan2(c,r));break;case"ZYX":this._y=Math.asin(-Yt(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(f,u),this._z=Math.atan2(c,r)):(this._x=0,this._z=Math.atan2(-o,l));break;case"YZX":this._z=Math.asin(Yt(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-h,l),this._y=Math.atan2(-d,r)):(this._x=0,this._y=Math.atan2(a,u));break;case"XZY":this._z=Math.asin(-Yt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(f,l),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-h,u),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return jc.makeRotationFromQuaternion(t),this.setFromRotationMatrix(jc,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return Qc.setFromEuler(this),this.setFromQuaternion(Qc,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};hn.DEFAULT_ORDER="XYZ";var Zi=class{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}},Ed=0,th=new C,Di=new cn,Dn=new jt,Or=new C,vs=new C,Td=new C,wd=new cn,eh=new C(1,0,0),nh=new C(0,1,0),ih=new C(0,0,1),sh={type:"added"},Ad={type:"removed"},Li={type:"childadded",child:null},dl={type:"childremoved",child:null},ge=class i extends Sn{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Ed++}),this.uuid=yi(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=i.DEFAULT_UP.clone();let t=new C,e=new hn,n=new cn,s=new C(1,1,1);function r(){n.setFromEuler(e,!1)}function o(){e.setFromQuaternion(n,void 0,!1)}e._onChange(r),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new jt},normalMatrix:{value:new Zt}}),this.matrix=new jt,this.matrixWorld=new jt,this.matrixAutoUpdate=i.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=i.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Zi,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return Di.setFromAxisAngle(t,e),this.quaternion.multiply(Di),this}rotateOnWorldAxis(t,e){return Di.setFromAxisAngle(t,e),this.quaternion.premultiply(Di),this}rotateX(t){return this.rotateOnAxis(eh,t)}rotateY(t){return this.rotateOnAxis(nh,t)}rotateZ(t){return this.rotateOnAxis(ih,t)}translateOnAxis(t,e){return th.copy(t).applyQuaternion(this.quaternion),this.position.add(th.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(eh,t)}translateY(t){return this.translateOnAxis(nh,t)}translateZ(t){return this.translateOnAxis(ih,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(Dn.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?Or.copy(t):Or.set(t,e,n);let s=this.parent;this.updateWorldMatrix(!0,!1),vs.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Dn.lookAt(vs,Or,this.up):Dn.lookAt(Or,vs,this.up),this.quaternion.setFromRotationMatrix(Dn),s&&(Dn.extractRotation(s.matrixWorld),Di.setFromRotationMatrix(Dn),this.quaternion.premultiply(Di.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(sh),Li.child=t,this.dispatchEvent(Li),Li.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(Ad),dl.child=t,this.dispatchEvent(dl),dl.child=null),this}removeFromParent(){let t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),Dn.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),Dn.multiply(t.parent.matrixWorld)),t.applyMatrix4(Dn),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(sh),Li.child=t,this.dispatchEvent(Li),Li.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,s=this.children.length;n<s;n++){let o=this.children[n].getObjectByProperty(t,e);if(o!==void 0)return o}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);let s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(vs,t,Td),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(vs,wd,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);let e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);let e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);let e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverseVisible(t)}traverseAncestors(t){let e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);let e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].updateMatrixWorld(t)}updateWorldMatrix(t,e){let n=this.parent;if(t===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){let s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(t){let e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});let s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(a=>({...a,boundingBox:a.boundingBox?a.boundingBox.toJSON():void 0,boundingSphere:a.boundingSphere?a.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(a=>({...a})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(t),s.indirectTexture=this._indirectTexture.toJSON(t),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(a,c){return a[c.uuid]===void 0&&(a[c.uuid]=c.toJSON(t)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(t.geometries,this.geometry);let a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){let c=a.shapes;if(Array.isArray(c))for(let l=0,h=c.length;l<h;l++){let d=c[l];r(t.shapes,d)}else r(t.shapes,c)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let a=[];for(let c=0,l=this.material.length;c<l;c++)a.push(r(t.materials,this.material[c]));s.material=a}else s.material=r(t.materials,this.material);if(this.children.length>0){s.children=[];for(let a=0;a<this.children.length;a++)s.children.push(this.children[a].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let a=0;a<this.animations.length;a++){let c=this.animations[a];s.animations.push(r(t.animations,c))}}if(e){let a=o(t.geometries),c=o(t.materials),l=o(t.textures),h=o(t.images),d=o(t.shapes),f=o(t.skeletons),u=o(t.animations),g=o(t.nodes);a.length>0&&(n.geometries=a),c.length>0&&(n.materials=c),l.length>0&&(n.textures=l),h.length>0&&(n.images=h),d.length>0&&(n.shapes=d),f.length>0&&(n.skeletons=f),u.length>0&&(n.animations=u),g.length>0&&(n.nodes=g)}return n.object=s,n;function o(a){let c=[];for(let l in a){let h=a[l];delete h.metadata,c.push(h)}return c}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){let s=t.children[n];this.add(s.clone())}return this}};ge.DEFAULT_UP=new C(0,1,0);ge.DEFAULT_MATRIX_AUTO_UPDATE=!0;ge.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var mn=new C,Ln=new C,fl=new C,Un=new C,Ui=new C,Ni=new C,rh=new C,pl=new C,ml=new C,gl=new C,_l=new se,xl=new se,vl=new se,Yn=class i{constructor(t=new C,e=new C,n=new C){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,s){s.subVectors(n,e),mn.subVectors(t,e),s.cross(mn);let r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(t,e,n,s,r){mn.subVectors(s,e),Ln.subVectors(n,e),fl.subVectors(t,e);let o=mn.dot(mn),a=mn.dot(Ln),c=mn.dot(fl),l=Ln.dot(Ln),h=Ln.dot(fl),d=o*l-a*a;if(d===0)return r.set(0,0,0),null;let f=1/d,u=(l*c-a*h)*f,g=(o*h-a*c)*f;return r.set(1-u-g,g,u)}static containsPoint(t,e,n,s){return this.getBarycoord(t,e,n,s,Un)===null?!1:Un.x>=0&&Un.y>=0&&Un.x+Un.y<=1}static getInterpolation(t,e,n,s,r,o,a,c){return this.getBarycoord(t,e,n,s,Un)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(r,Un.x),c.addScaledVector(o,Un.y),c.addScaledVector(a,Un.z),c)}static getInterpolatedAttribute(t,e,n,s,r,o){return _l.setScalar(0),xl.setScalar(0),vl.setScalar(0),_l.fromBufferAttribute(t,e),xl.fromBufferAttribute(t,n),vl.fromBufferAttribute(t,s),o.setScalar(0),o.addScaledVector(_l,r.x),o.addScaledVector(xl,r.y),o.addScaledVector(vl,r.z),o}static isFrontFacing(t,e,n,s){return mn.subVectors(n,e),Ln.subVectors(t,e),mn.cross(Ln).dot(s)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,s){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,n,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return mn.subVectors(this.c,this.b),Ln.subVectors(this.a,this.b),mn.cross(Ln).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return i.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return i.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,n,s,r){return i.getInterpolation(t,this.a,this.b,this.c,e,n,s,r)}containsPoint(t){return i.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return i.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){let n=this.a,s=this.b,r=this.c,o,a;Ui.subVectors(s,n),Ni.subVectors(r,n),pl.subVectors(t,n);let c=Ui.dot(pl),l=Ni.dot(pl);if(c<=0&&l<=0)return e.copy(n);ml.subVectors(t,s);let h=Ui.dot(ml),d=Ni.dot(ml);if(h>=0&&d<=h)return e.copy(s);let f=c*d-h*l;if(f<=0&&c>=0&&h<=0)return o=c/(c-h),e.copy(n).addScaledVector(Ui,o);gl.subVectors(t,r);let u=Ui.dot(gl),g=Ni.dot(gl);if(g>=0&&u<=g)return e.copy(r);let _=u*l-c*g;if(_<=0&&l>=0&&g<=0)return a=l/(l-g),e.copy(n).addScaledVector(Ni,a);let m=h*g-u*d;if(m<=0&&d-h>=0&&u-g>=0)return rh.subVectors(r,s),a=(d-h)/(d-h+(u-g)),e.copy(s).addScaledVector(rh,a);let p=1/(m+_+f);return o=_*p,a=f*p,e.copy(n).addScaledVector(Ui,o).addScaledVector(Ni,a)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}},ou={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Xn={h:0,s:0,l:0},Br={h:0,s:0,l:0};function yl(i,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?i+(t-i)*6*e:e<1/2?t:e<2/3?i+(t-i)*6*(2/3-e):i}var zt=class{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){let s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=Me){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,te.colorSpaceToWorking(this,e),this}setRGB(t,e,n,s=te.workingColorSpace){return this.r=t,this.g=e,this.b=n,te.colorSpaceToWorking(this,s),this}setHSL(t,e,n,s=te.workingColorSpace){if(t=pc(t,1),e=Yt(e,0,1),n=Yt(n,0,1),e===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+e):n+e-n*e,o=2*n-r;this.r=yl(o,r,t+1/3),this.g=yl(o,r,t),this.b=yl(o,r,t-1/3)}return te.colorSpaceToWorking(this,s),this}setStyle(t,e=Me){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let r,o=s[1],a=s[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){let r=s[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(o===6)return this.setHex(parseInt(r,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=Me){let n=ou[t.toLowerCase()];return n!==void 0?this.setHex(n,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=Nn(t.r),this.g=Nn(t.g),this.b=Nn(t.b),this}copyLinearToSRGB(t){return this.r=Hi(t.r),this.g=Hi(t.g),this.b=Hi(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=Me){return te.workingToColorSpace(Ie.copy(this),t),Math.round(Yt(Ie.r*255,0,255))*65536+Math.round(Yt(Ie.g*255,0,255))*256+Math.round(Yt(Ie.b*255,0,255))}getHexString(t=Me){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=te.workingColorSpace){te.workingToColorSpace(Ie.copy(this),e);let n=Ie.r,s=Ie.g,r=Ie.b,o=Math.max(n,s,r),a=Math.min(n,s,r),c,l,h=(a+o)/2;if(a===o)c=0,l=0;else{let d=o-a;switch(l=h<=.5?d/(o+a):d/(2-o-a),o){case n:c=(s-r)/d+(s<r?6:0);break;case s:c=(r-n)/d+2;break;case r:c=(n-s)/d+4;break}c/=6}return t.h=c,t.s=l,t.l=h,t}getRGB(t,e=te.workingColorSpace){return te.workingToColorSpace(Ie.copy(this),e),t.r=Ie.r,t.g=Ie.g,t.b=Ie.b,t}getStyle(t=Me){te.workingToColorSpace(Ie.copy(this),t);let e=Ie.r,n=Ie.g,s=Ie.b;return t!==Me?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(t,e,n){return this.getHSL(Xn),this.setHSL(Xn.h+t,Xn.s+e,Xn.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(Xn),t.getHSL(Br);let n=As(Xn.h,Br.h,e),s=As(Xn.s,Br.s,e),r=As(Xn.l,Br.l,e);return this.setHSL(n,s,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){let e=this.r,n=this.g,s=this.b,r=t.elements;return this.r=r[0]*e+r[3]*n+r[6]*s,this.g=r[1]*e+r[4]*n+r[7]*s,this.b=r[2]*e+r[5]*n+r[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},Ie=new zt;zt.NAMES=ou;var Rd=0,Ke=class extends Sn{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Rd++}),this.uuid=yi(),this.name="",this.type="Material",this.blending=ci,this.side=Fn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=ro,this.blendDst=oo,this.blendEquation=Je,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new zt(0,0,0),this.blendAlpha=0,this.depthFunc=hi,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Ll,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=li,this.stencilZFail=li,this.stencilZPass=li,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(let e in t){let n=t[e];if(n===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}let s=this[e];if(s===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[e]=n}}toJSON(t){let e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});let n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(t).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(t).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==ci&&(n.blending=this.blending),this.side!==Fn&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==ro&&(n.blendSrc=this.blendSrc),this.blendDst!==oo&&(n.blendDst=this.blendDst),this.blendEquation!==Je&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==hi&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Ll&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==li&&(n.stencilFail=this.stencilFail),this.stencilZFail!==li&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==li&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){let o=[];for(let a in r){let c=r[a];delete c.metadata,o.push(c)}return o}if(e){let r=s(t.textures),o=s(t.images);r.length>0&&(n.textures=r),o.length>0&&(n.images=o)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;let e=t.clippingPlanes,n=null;if(e!==null){let s=e.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=e[r].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}},Us=class extends Ke{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new zt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new hn,this.combine=Yo,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}};var ve=new C,zr=new lt,Cd=0,De=class{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Cd++}),this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=Ul,this.updateRanges=[],this.gpuType=xn,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[t+s]=e.array[n+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)zr.fromBufferAttribute(this,e),zr.applyMatrix3(t),this.setXY(e,zr.x,zr.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)ve.fromBufferAttribute(this,e),ve.applyMatrix3(t),this.setXYZ(e,ve.x,ve.y,ve.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)ve.fromBufferAttribute(this,e),ve.applyMatrix4(t),this.setXYZ(e,ve.x,ve.y,ve.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)ve.fromBufferAttribute(this,e),ve.applyNormalMatrix(t),this.setXYZ(e,ve.x,ve.y,ve.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)ve.fromBufferAttribute(this,e),ve.transformDirection(t),this.setXYZ(e,ve.x,ve.y,ve.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=Vi(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=Oe(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=Vi(e,this.array)),e}setX(t,e){return this.normalized&&(e=Oe(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=Vi(e,this.array)),e}setY(t,e){return this.normalized&&(e=Oe(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=Vi(e,this.array)),e}setZ(t,e){return this.normalized&&(e=Oe(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=Vi(e,this.array)),e}setW(t,e){return this.normalized&&(e=Oe(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=Oe(e,this.array),n=Oe(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,s){return t*=this.itemSize,this.normalized&&(e=Oe(e,this.array),n=Oe(n,this.array),s=Oe(s,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this}setXYZW(t,e,n,s,r){return t*=this.itemSize,this.normalized&&(e=Oe(e,this.array),n=Oe(n,this.array),s=Oe(s,this.array),r=Oe(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==Ul&&(t.usage=this.usage),t}};var Ns=class extends De{constructor(t,e,n){super(new Uint16Array(t),e,n)}};var Fs=class extends De{constructor(t,e,n){super(new Uint32Array(t),e,n)}};var kt=class extends De{constructor(t,e,n){super(new Float32Array(t),e,n)}},Pd=0,on=new jt,Ml=new ge,Fi=new C,Ze=new bn,ys=new bn,Ae=new C,oe=class i extends Sn{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Pd++}),this.uuid=yi(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(mc(t)?Fs:Ns)(t,1):this.index=t,this}setIndirect(t){return this.indirect=t,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){let e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let r=new Zt().getNormalMatrix(t);n.applyNormalMatrix(r),n.needsUpdate=!0}let s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return on.makeRotationFromQuaternion(t),this.applyMatrix4(on),this}rotateX(t){return on.makeRotationX(t),this.applyMatrix4(on),this}rotateY(t){return on.makeRotationY(t),this.applyMatrix4(on),this}rotateZ(t){return on.makeRotationZ(t),this.applyMatrix4(on),this}translate(t,e,n){return on.makeTranslation(t,e,n),this.applyMatrix4(on),this}scale(t,e,n){return on.makeScale(t,e,n),this.applyMatrix4(on),this}lookAt(t){return Ml.lookAt(t),Ml.updateMatrix(),this.applyMatrix4(Ml.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Fi).negate(),this.translate(Fi.x,Fi.y,Fi.z),this}setFromPoints(t){let e=this.getAttribute("position");if(e===void 0){let n=[];for(let s=0,r=t.length;s<r;s++){let o=t[s];n.push(o.x,o.y,o.z||0)}this.setAttribute("position",new kt(n,3))}else{let n=Math.min(t.length,e.count);for(let s=0;s<n;s++){let r=t[s];e.setXYZ(s,r.x,r.y,r.z||0)}t.length>e.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new bn);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new C(-1/0,-1/0,-1/0),new C(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,s=e.length;n<s;n++){let r=e[n];Ze.setFromBufferAttribute(r),this.morphTargetsRelative?(Ae.addVectors(this.boundingBox.min,Ze.min),this.boundingBox.expandByPoint(Ae),Ae.addVectors(this.boundingBox.max,Ze.max),this.boundingBox.expandByPoint(Ae)):(this.boundingBox.expandByPoint(Ze.min),this.boundingBox.expandByPoint(Ze.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new En);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new C,1/0);return}if(t){let n=this.boundingSphere.center;if(Ze.setFromBufferAttribute(t),e)for(let r=0,o=e.length;r<o;r++){let a=e[r];ys.setFromBufferAttribute(a),this.morphTargetsRelative?(Ae.addVectors(Ze.min,ys.min),Ze.expandByPoint(Ae),Ae.addVectors(Ze.max,ys.max),Ze.expandByPoint(Ae)):(Ze.expandByPoint(ys.min),Ze.expandByPoint(ys.max))}Ze.getCenter(n);let s=0;for(let r=0,o=t.count;r<o;r++)Ae.fromBufferAttribute(t,r),s=Math.max(s,n.distanceToSquared(Ae));if(e)for(let r=0,o=e.length;r<o;r++){let a=e[r],c=this.morphTargetsRelative;for(let l=0,h=a.count;l<h;l++)Ae.fromBufferAttribute(a,l),c&&(Fi.fromBufferAttribute(t,l),Ae.add(Fi)),s=Math.max(s,n.distanceToSquared(Ae))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let n=e.position,s=e.normal,r=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new De(new Float32Array(4*n.count),4));let o=this.getAttribute("tangent"),a=[],c=[];for(let D=0;D<n.count;D++)a[D]=new C,c[D]=new C;let l=new C,h=new C,d=new C,f=new lt,u=new lt,g=new lt,_=new C,m=new C;function p(D,b,v){l.fromBufferAttribute(n,D),h.fromBufferAttribute(n,b),d.fromBufferAttribute(n,v),f.fromBufferAttribute(r,D),u.fromBufferAttribute(r,b),g.fromBufferAttribute(r,v),h.sub(l),d.sub(l),u.sub(f),g.sub(f);let L=1/(u.x*g.y-g.x*u.y);isFinite(L)&&(_.copy(h).multiplyScalar(g.y).addScaledVector(d,-u.y).multiplyScalar(L),m.copy(d).multiplyScalar(u.x).addScaledVector(h,-g.x).multiplyScalar(L),a[D].add(_),a[b].add(_),a[v].add(_),c[D].add(m),c[b].add(m),c[v].add(m))}let E=this.groups;E.length===0&&(E=[{start:0,count:t.count}]);for(let D=0,b=E.length;D<b;++D){let v=E[D],L=v.start,O=v.count;for(let W=L,Z=L+O;W<Z;W+=3)p(t.getX(W+0),t.getX(W+1),t.getX(W+2))}let M=new C,y=new C,R=new C,A=new C;function P(D){R.fromBufferAttribute(s,D),A.copy(R);let b=a[D];M.copy(b),M.sub(R.multiplyScalar(R.dot(b))).normalize(),y.crossVectors(A,b);let L=y.dot(c[D])<0?-1:1;o.setXYZW(D,M.x,M.y,M.z,L)}for(let D=0,b=E.length;D<b;++D){let v=E[D],L=v.start,O=v.count;for(let W=L,Z=L+O;W<Z;W+=3)P(t.getX(W+0)),P(t.getX(W+1)),P(t.getX(W+2))}}computeVertexNormals(){let t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new De(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let f=0,u=n.count;f<u;f++)n.setXYZ(f,0,0,0);let s=new C,r=new C,o=new C,a=new C,c=new C,l=new C,h=new C,d=new C;if(t)for(let f=0,u=t.count;f<u;f+=3){let g=t.getX(f+0),_=t.getX(f+1),m=t.getX(f+2);s.fromBufferAttribute(e,g),r.fromBufferAttribute(e,_),o.fromBufferAttribute(e,m),h.subVectors(o,r),d.subVectors(s,r),h.cross(d),a.fromBufferAttribute(n,g),c.fromBufferAttribute(n,_),l.fromBufferAttribute(n,m),a.add(h),c.add(h),l.add(h),n.setXYZ(g,a.x,a.y,a.z),n.setXYZ(_,c.x,c.y,c.z),n.setXYZ(m,l.x,l.y,l.z)}else for(let f=0,u=e.count;f<u;f+=3)s.fromBufferAttribute(e,f+0),r.fromBufferAttribute(e,f+1),o.fromBufferAttribute(e,f+2),h.subVectors(o,r),d.subVectors(s,r),h.cross(d),n.setXYZ(f+0,h.x,h.y,h.z),n.setXYZ(f+1,h.x,h.y,h.z),n.setXYZ(f+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)Ae.fromBufferAttribute(t,e),Ae.normalize(),t.setXYZ(e,Ae.x,Ae.y,Ae.z)}toNonIndexed(){function t(a,c){let l=a.array,h=a.itemSize,d=a.normalized,f=new l.constructor(c.length*h),u=0,g=0;for(let _=0,m=c.length;_<m;_++){a.isInterleavedBufferAttribute?u=c[_]*a.data.stride+a.offset:u=c[_]*h;for(let p=0;p<h;p++)f[g++]=l[u++]}return new De(f,h,d)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let e=new i,n=this.index.array,s=this.attributes;for(let a in s){let c=s[a],l=t(c,n);e.setAttribute(a,l)}let r=this.morphAttributes;for(let a in r){let c=[],l=r[a];for(let h=0,d=l.length;h<d;h++){let f=l[h],u=t(f,n);c.push(u)}e.morphAttributes[a]=c}e.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let a=0,c=o.length;a<c;a++){let l=o[a];e.addGroup(l.start,l.count,l.materialIndex)}return e}toJSON(){let t={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){let c=this.parameters;for(let l in c)c[l]!==void 0&&(t[l]=c[l]);return t}t.data={attributes:{}};let e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});let n=this.attributes;for(let c in n){let l=n[c];t.data.attributes[c]=l.toJSON(t.data)}let s={},r=!1;for(let c in this.morphAttributes){let l=this.morphAttributes[c],h=[];for(let d=0,f=l.length;d<f;d++){let u=l[d];h.push(u.toJSON(t.data))}h.length>0&&(s[c]=h,r=!0)}r&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);let o=this.groups;o.length>0&&(t.data.groups=JSON.parse(JSON.stringify(o)));let a=this.boundingSphere;return a!==null&&(t.data.boundingSphere=a.toJSON()),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let e={};this.name=t.name;let n=t.index;n!==null&&this.setIndex(n.clone());let s=t.attributes;for(let l in s){let h=s[l];this.setAttribute(l,h.clone(e))}let r=t.morphAttributes;for(let l in r){let h=[],d=r[l];for(let f=0,u=d.length;f<u;f++)h.push(d[f].clone(e));this.morphAttributes[l]=h}this.morphTargetsRelative=t.morphTargetsRelative;let o=t.groups;for(let l=0,h=o.length;l<h;l++){let d=o[l];this.addGroup(d.start,d.count,d.materialIndex)}let a=t.boundingBox;a!==null&&(this.boundingBox=a.clone());let c=t.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}},oh=new jt,oi=new On,kr=new En,ah=new C,Vr=new C,Hr=new C,Gr=new C,Sl=new C,Wr=new C,lh=new C,Xr=new C,ie=class extends ge{constructor(t=new oe,e=new Us){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){let e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){let s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(t,e){let n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,o=n.morphTargetsRelative;e.fromBufferAttribute(s,t);let a=this.morphTargetInfluences;if(r&&a){Wr.set(0,0,0);for(let c=0,l=r.length;c<l;c++){let h=a[c],d=r[c];h!==0&&(Sl.fromBufferAttribute(d,t),o?Wr.addScaledVector(Sl,h):Wr.addScaledVector(Sl.sub(e),h))}e.add(Wr)}return e}raycast(t,e){let n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),kr.copy(n.boundingSphere),kr.applyMatrix4(r),oi.copy(t.ray).recast(t.near),!(kr.containsPoint(oi.origin)===!1&&(oi.intersectSphere(kr,ah)===null||oi.origin.distanceToSquared(ah)>(t.far-t.near)**2))&&(oh.copy(r).invert(),oi.copy(t.ray).applyMatrix4(oh),!(n.boundingBox!==null&&oi.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,oi)))}_computeIntersections(t,e,n){let s,r=this.geometry,o=this.material,a=r.index,c=r.attributes.position,l=r.attributes.uv,h=r.attributes.uv1,d=r.attributes.normal,f=r.groups,u=r.drawRange;if(a!==null)if(Array.isArray(o))for(let g=0,_=f.length;g<_;g++){let m=f[g],p=o[m.materialIndex],E=Math.max(m.start,u.start),M=Math.min(a.count,Math.min(m.start+m.count,u.start+u.count));for(let y=E,R=M;y<R;y+=3){let A=a.getX(y),P=a.getX(y+1),D=a.getX(y+2);s=qr(this,p,t,n,l,h,d,A,P,D),s&&(s.faceIndex=Math.floor(y/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{let g=Math.max(0,u.start),_=Math.min(a.count,u.start+u.count);for(let m=g,p=_;m<p;m+=3){let E=a.getX(m),M=a.getX(m+1),y=a.getX(m+2);s=qr(this,o,t,n,l,h,d,E,M,y),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}else if(c!==void 0)if(Array.isArray(o))for(let g=0,_=f.length;g<_;g++){let m=f[g],p=o[m.materialIndex],E=Math.max(m.start,u.start),M=Math.min(c.count,Math.min(m.start+m.count,u.start+u.count));for(let y=E,R=M;y<R;y+=3){let A=y,P=y+1,D=y+2;s=qr(this,p,t,n,l,h,d,A,P,D),s&&(s.faceIndex=Math.floor(y/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{let g=Math.max(0,u.start),_=Math.min(c.count,u.start+u.count);for(let m=g,p=_;m<p;m+=3){let E=m,M=m+1,y=m+2;s=qr(this,o,t,n,l,h,d,E,M,y),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}}};function Id(i,t,e,n,s,r,o,a){let c;if(t.side===Ce?c=n.intersectTriangle(o,r,s,!0,a):c=n.intersectTriangle(s,r,o,t.side===Fn,a),c===null)return null;Xr.copy(a),Xr.applyMatrix4(i.matrixWorld);let l=e.ray.origin.distanceTo(Xr);return l<e.near||l>e.far?null:{distance:l,point:Xr.clone(),object:i}}function qr(i,t,e,n,s,r,o,a,c,l){i.getVertexPosition(a,Vr),i.getVertexPosition(c,Hr),i.getVertexPosition(l,Gr);let h=Id(i,t,e,n,Vr,Hr,Gr,lh);if(h){let d=new C;Yn.getBarycoord(lh,Vr,Hr,Gr,d),s&&(h.uv=Yn.getInterpolatedAttribute(s,a,c,l,d,new lt)),r&&(h.uv1=Yn.getInterpolatedAttribute(r,a,c,l,d,new lt)),o&&(h.normal=Yn.getInterpolatedAttribute(o,a,c,l,d,new C),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));let f={a,b:c,c:l,normal:new C,materialIndex:0};Yn.getNormal(Vr,Hr,Gr,f.normal),h.face=f,h.barycoord=d}return h}var Tn=class i extends oe{constructor(t=1,e=1,n=1,s=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:s,heightSegments:r,depthSegments:o};let a=this;s=Math.floor(s),r=Math.floor(r),o=Math.floor(o);let c=[],l=[],h=[],d=[],f=0,u=0;g("z","y","x",-1,-1,n,e,t,o,r,0),g("z","y","x",1,-1,n,e,-t,o,r,1),g("x","z","y",1,1,t,n,e,s,o,2),g("x","z","y",1,-1,t,n,-e,s,o,3),g("x","y","z",1,-1,t,e,n,s,r,4),g("x","y","z",-1,-1,t,e,-n,s,r,5),this.setIndex(c),this.setAttribute("position",new kt(l,3)),this.setAttribute("normal",new kt(h,3)),this.setAttribute("uv",new kt(d,2));function g(_,m,p,E,M,y,R,A,P,D,b){let v=y/P,L=R/D,O=y/2,W=R/2,Z=A/2,j=P+1,$=D+1,dt=0,X=0,pt=new C;for(let St=0;St<$;St++){let wt=St*L-W;for(let Et=0;Et<j;Et++){let Ot=Et*v-O;pt[_]=Ot*E,pt[m]=wt*M,pt[p]=Z,l.push(pt.x,pt.y,pt.z),pt[_]=0,pt[m]=0,pt[p]=A>0?1:-1,h.push(pt.x,pt.y,pt.z),d.push(Et/P),d.push(1-St/D),dt+=1}}for(let St=0;St<D;St++)for(let wt=0;wt<P;wt++){let Et=f+wt+j*St,Ot=f+wt+j*(St+1),Gt=f+(wt+1)+j*(St+1),Ft=f+(wt+1)+j*St;c.push(Et,Ot,Ft),c.push(Ot,Gt,Ft),X+=6}a.addGroup(u,X,b),u+=X,f+=dt}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}};function Mi(i){let t={};for(let e in i){t[e]={};for(let n in i[e]){let s=i[e][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=s.clone():Array.isArray(s)?t[e][n]=s.slice():t[e][n]=s}}return t}function Ne(i){let t={};for(let e=0;e<i.length;e++){let n=Mi(i[e]);for(let s in n)t[s]=n[s]}return t}function Dd(i){let t=[];for(let e=0;e<i.length;e++)t.push(i[e].clone());return t}function gc(i){let t=i.getRenderTarget();return t===null?i.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:te.workingColorSpace}var un={clone:Mi,merge:Ne},Ld=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Ud=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,xe=class extends Ke{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Ld,this.fragmentShader=Ud,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=Mi(t.uniforms),this.uniformsGroups=Dd(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){let e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(let s in this.uniforms){let o=this.uniforms[s].value;o&&o.isTexture?e.uniforms[s]={type:"t",value:o.toJSON(t).uuid}:o&&o.isColor?e.uniforms[s]={type:"c",value:o.getHex()}:o&&o.isVector2?e.uniforms[s]={type:"v2",value:o.toArray()}:o&&o.isVector3?e.uniforms[s]={type:"v3",value:o.toArray()}:o&&o.isVector4?e.uniforms[s]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?e.uniforms[s]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?e.uniforms[s]={type:"m4",value:o.toArray()}:e.uniforms[s]={value:o}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;let n={};for(let s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}},Os=class extends ge{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new jt,this.projectionMatrix=new jt,this.projectionMatrixInverse=new jt,this.coordinateSystem=gn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}},qn=new C,ch=new lt,hh=new lt,Be=class extends Os{constructor(t=50,e=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){let e=.5*this.getFilmHeight()/t;this.fov=Wi*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){let t=Math.tan(ws*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return Wi*2*Math.atan(Math.tan(ws*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,n){qn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(qn.x,qn.y).multiplyScalar(-t/qn.z),qn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(qn.x,qn.y).multiplyScalar(-t/qn.z)}getViewSize(t,e){return this.getViewBounds(t,ch,hh),e.subVectors(hh,ch)}setViewOffset(t,e,n,s,r,o){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=this.near,e=t*Math.tan(ws*.5*this.fov)/this.zoom,n=2*e,s=this.aspect*n,r=-.5*s,o=this.view;if(this.view!==null&&this.view.enabled){let c=o.fullWidth,l=o.fullHeight;r+=o.offsetX*s/c,e-=o.offsetY*n/l,s*=o.width/c,n*=o.height/l}let a=this.filmOffset;a!==0&&(r+=t*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,e,e-n,t,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}},Oi=-90,Bi=1,fo=class extends ge{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let s=new Be(Oi,Bi,t,e);s.layers=this.layers,this.add(s);let r=new Be(Oi,Bi,t,e);r.layers=this.layers,this.add(r);let o=new Be(Oi,Bi,t,e);o.layers=this.layers,this.add(o);let a=new Be(Oi,Bi,t,e);a.layers=this.layers,this.add(a);let c=new Be(Oi,Bi,t,e);c.layers=this.layers,this.add(c);let l=new Be(Oi,Bi,t,e);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){let t=this.coordinateSystem,e=this.children.concat(),[n,s,r,o,a,c]=e;for(let l of e)this.remove(l);if(t===gn)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(t===Ds)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(let l of e)this.add(l),l.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());let[r,o,a,c,l,h]=this.children,d=t.getRenderTarget(),f=t.getActiveCubeFace(),u=t.getActiveMipmapLevel(),g=t.xr.enabled;t.xr.enabled=!1;let _=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0,s),t.render(e,r),t.setRenderTarget(n,1,s),t.render(e,o),t.setRenderTarget(n,2,s),t.render(e,a),t.setRenderTarget(n,3,s),t.render(e,c),t.setRenderTarget(n,4,s),t.render(e,l),n.texture.generateMipmaps=_,t.setRenderTarget(n,5,s),t.render(e,h),t.setRenderTarget(d,f,u),t.xr.enabled=g,n.texture.needsPMREMUpdate=!0}},Bs=class extends Le{constructor(t=[],e=xi,n,s,r,o,a,c,l,h){super(t,e,n,s,r,o,a,c,l,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}},po=class extends ze{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;let n={width:t,height:t,depth:1},s=[n,n,n,n,n,n];this.texture=new Bs(s),this._setTextureOptions(e),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new Tn(5,5,5),r=new xe({name:"CubemapFromEquirect",uniforms:Mi(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Ce,blending:ye});r.uniforms.tEquirect.value=e;let o=new ie(s,r),a=e.minFilter;return e.minFilter===Rn&&(e.minFilter=$e),new fo(1,10,this).update(t,o),e.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(t,e=!0,n=!0,s=!0){let r=t.getRenderTarget();for(let o=0;o<6;o++)t.setRenderTarget(this,o),t.clear(e,n,s);t.setRenderTarget(r)}},ln=class extends ge{constructor(){super(),this.isGroup=!0,this.type="Group"}},Nd={type:"move"},Ji=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new ln,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new ln,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new C,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new C),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new ln,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new C,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new C),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){let e=this._hand;if(e)for(let n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let s=null,r=null,o=null,a=this._targetRay,c=this._grip,l=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(l&&t.hand){o=!0;for(let _ of t.hand.values()){let m=e.getJointPose(_,n),p=this._getHandJoint(l,_);m!==null&&(p.matrix.fromArray(m.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=m.radius),p.visible=m!==null}let h=l.joints["index-finger-tip"],d=l.joints["thumb-tip"],f=h.position.distanceTo(d.position),u=.02,g=.005;l.inputState.pinching&&f>u+g?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!l.inputState.pinching&&f<=u-g&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else c!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,n),r!==null&&(c.matrix.fromArray(r.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,r.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(r.linearVelocity)):c.hasLinearVelocity=!1,r.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(r.angularVelocity)):c.hasAngularVelocity=!1));a!==null&&(s=e.getPose(t.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(a.matrix.fromArray(s.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,s.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(s.linearVelocity)):a.hasLinearVelocity=!1,s.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(s.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(Nd)))}return a!==null&&(a.visible=s!==null),c!==null&&(c.visible=r!==null),l!==null&&(l.visible=o!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){let n=new ln;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}};var zs=class extends ge{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new hn,this.environmentIntensity=1,this.environmentRotation=new hn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){let e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}};var wn=class extends Le{constructor(t=null,e=1,n=1,s,r,o,a,c,l=Re,h=Re,d,f){super(null,o,a,c,l,h,s,r,d,f),this.isDataTexture=!0,this.image={data:t,width:e,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var $i=class extends De{constructor(t,e,n,s=1){super(t,e,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}toJSON(){let t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t}},zi=new jt,uh=new jt,Yr=[],dh=new bn,Fd=new jt,Ms=new ie,Ss=new En,_n=class extends ie{constructor(t,e,n){super(t,e),this.isInstancedMesh=!0,this.instanceMatrix=new $i(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<n;s++)this.setMatrixAt(s,Fd)}computeBoundingBox(){let t=this.geometry,e=this.count;this.boundingBox===null&&(this.boundingBox=new bn),t.boundingBox===null&&t.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,zi),dh.copy(t.boundingBox).applyMatrix4(zi),this.boundingBox.union(dh)}computeBoundingSphere(){let t=this.geometry,e=this.count;this.boundingSphere===null&&(this.boundingSphere=new En),t.boundingSphere===null&&t.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,zi),Ss.copy(t.boundingSphere).applyMatrix4(zi),this.boundingSphere.union(Ss)}copy(t,e){return super.copy(t,e),this.instanceMatrix.copy(t.instanceMatrix),t.morphTexture!==null&&(this.morphTexture=t.morphTexture.clone()),t.instanceColor!==null&&(this.instanceColor=t.instanceColor.clone()),this.count=t.count,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}getColorAt(t,e){e.fromArray(this.instanceColor.array,t*3)}getMatrixAt(t,e){e.fromArray(this.instanceMatrix.array,t*16)}getMorphAt(t,e){let n=e.morphTargetInfluences,s=this.morphTexture.source.data.data,r=n.length+1,o=t*r+1;for(let a=0;a<n.length;a++)n[a]=s[o+a]}raycast(t,e){let n=this.matrixWorld,s=this.count;if(Ms.geometry=this.geometry,Ms.material=this.material,Ms.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Ss.copy(this.boundingSphere),Ss.applyMatrix4(n),t.ray.intersectsSphere(Ss)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,zi),uh.multiplyMatrices(n,zi),Ms.matrixWorld=uh,Ms.raycast(t,Yr);for(let o=0,a=Yr.length;o<a;o++){let c=Yr[o];c.instanceId=r,c.object=this,e.push(c)}Yr.length=0}}setColorAt(t,e){this.instanceColor===null&&(this.instanceColor=new $i(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),e.toArray(this.instanceColor.array,t*3)}setMatrixAt(t,e){e.toArray(this.instanceMatrix.array,t*16)}setMorphAt(t,e){let n=e.morphTargetInfluences,s=n.length+1;this.morphTexture===null&&(this.morphTexture=new wn(new Float32Array(s*this.count),s,this.count,oa,xn));let r=this.morphTexture.source.data.data,o=0;for(let l=0;l<n.length;l++)o+=n[l];let a=this.geometry.morphTargetsRelative?1:1-o,c=s*t;r[c]=a,r.set(n,c+1)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}},bl=new C,Od=new C,Bd=new Zt,an=class{constructor(t=new C(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,s){return this.normal.set(t,e,n),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){let s=bl.subVectors(n,e).cross(Od.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){let t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){let n=t.delta(bl),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;let r=-(t.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:e.copy(t.start).addScaledVector(n,r)}intersectsLine(t){let e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){let n=e||Bd.getNormalMatrix(t),s=this.coplanarPoint(bl).applyMatrix4(t),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}},ai=new En,zd=new lt(.5,.5),Zr=new C,Ki=class{constructor(t=new an,e=new an,n=new an,s=new an,r=new an,o=new an){this.planes=[t,e,n,s,r,o]}set(t,e,n,s,r,o){let a=this.planes;return a[0].copy(t),a[1].copy(e),a[2].copy(n),a[3].copy(s),a[4].copy(r),a[5].copy(o),this}copy(t){let e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=gn,n=!1){let s=this.planes,r=t.elements,o=r[0],a=r[1],c=r[2],l=r[3],h=r[4],d=r[5],f=r[6],u=r[7],g=r[8],_=r[9],m=r[10],p=r[11],E=r[12],M=r[13],y=r[14],R=r[15];if(s[0].setComponents(l-o,u-h,p-g,R-E).normalize(),s[1].setComponents(l+o,u+h,p+g,R+E).normalize(),s[2].setComponents(l+a,u+d,p+_,R+M).normalize(),s[3].setComponents(l-a,u-d,p-_,R-M).normalize(),n)s[4].setComponents(c,f,m,y).normalize(),s[5].setComponents(l-c,u-f,p-m,R-y).normalize();else if(s[4].setComponents(l-c,u-f,p-m,R-y).normalize(),e===gn)s[5].setComponents(l+c,u+f,p+m,R+y).normalize();else if(e===Ds)s[5].setComponents(c,f,m,y).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),ai.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{let e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),ai.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(ai)}intersectsSprite(t){ai.center.set(0,0,0);let e=zd.distanceTo(t.center);return ai.radius=.7071067811865476+e,ai.applyMatrix4(t.matrixWorld),this.intersectsSphere(ai)}intersectsSphere(t){let e=this.planes,n=t.center,s=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(t){let e=this.planes;for(let n=0;n<6;n++){let s=e[n];if(Zr.x=s.normal.x>0?t.max.x:t.min.x,Zr.y=s.normal.y>0?t.max.y:t.min.y,Zr.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(Zr)<0)return!1}return!0}containsPoint(t){let e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};var mo=class extends Ke{constructor(t){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new zt(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}},go=new C,_o=new C,fh=new jt,bs=new On,Jr=new En,El=new C,ph=new C,xo=class extends ge{constructor(t=new oe,e=new mo){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){let t=this.geometry;if(t.index===null){let e=t.attributes.position,n=[0];for(let s=1,r=e.count;s<r;s++)go.fromBufferAttribute(e,s-1),_o.fromBufferAttribute(e,s),n[s]=n[s-1],n[s]+=go.distanceTo(_o);t.setAttribute("lineDistance",new kt(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(t,e){let n=this.geometry,s=this.matrixWorld,r=t.params.Line.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Jr.copy(n.boundingSphere),Jr.applyMatrix4(s),Jr.radius+=r,t.ray.intersectsSphere(Jr)===!1)return;fh.copy(s).invert(),bs.copy(t.ray).applyMatrix4(fh);let a=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=a*a,l=this.isLineSegments?2:1,h=n.index,f=n.attributes.position;if(h!==null){let u=Math.max(0,o.start),g=Math.min(h.count,o.start+o.count);for(let _=u,m=g-1;_<m;_+=l){let p=h.getX(_),E=h.getX(_+1),M=$r(this,t,bs,c,p,E,_);M&&e.push(M)}if(this.isLineLoop){let _=h.getX(g-1),m=h.getX(u),p=$r(this,t,bs,c,_,m,g-1);p&&e.push(p)}}else{let u=Math.max(0,o.start),g=Math.min(f.count,o.start+o.count);for(let _=u,m=g-1;_<m;_+=l){let p=$r(this,t,bs,c,_,_+1,_);p&&e.push(p)}if(this.isLineLoop){let _=$r(this,t,bs,c,g-1,u,g-1);_&&e.push(_)}}}updateMorphTargets(){let e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){let s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}};function $r(i,t,e,n,s,r,o){let a=i.geometry.attributes.position;if(go.fromBufferAttribute(a,s),_o.fromBufferAttribute(a,r),e.distanceSqToSegment(go,_o,El,ph)>n)return;El.applyMatrix4(i.matrixWorld);let l=t.ray.origin.distanceTo(El);if(!(l<t.near||l>t.far))return{distance:l,point:ph.clone().applyMatrix4(i.matrixWorld),index:o,face:null,faceIndex:null,barycoord:null,object:i}}var mh=new C,gh=new C,Nl=class extends xo{constructor(t,e){super(t,e),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){let t=this.geometry;if(t.index===null){let e=t.attributes.position,n=[];for(let s=0,r=e.count;s<r;s+=2)mh.fromBufferAttribute(e,s),gh.fromBufferAttribute(e,s+1),n[s]=s===0?0:n[s-1],n[s+1]=n[s]+mh.distanceTo(gh);t.setAttribute("lineDistance",new kt(n,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}};var vo=class extends Ke{constructor(t){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new zt(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.size=t.size,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}},_h=new jt,Fl=new On,Kr=new En,jr=new C,Ol=class extends ge{constructor(t=new oe,e=new vo){super(),this.isPoints=!0,this.type="Points",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}raycast(t,e){let n=this.geometry,s=this.matrixWorld,r=t.params.Points.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Kr.copy(n.boundingSphere),Kr.applyMatrix4(s),Kr.radius+=r,t.ray.intersectsSphere(Kr)===!1)return;_h.copy(s).invert(),Fl.copy(t.ray).applyMatrix4(_h);let a=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=a*a,l=n.index,d=n.attributes.position;if(l!==null){let f=Math.max(0,o.start),u=Math.min(l.count,o.start+o.count);for(let g=f,_=u;g<_;g++){let m=l.getX(g);jr.fromBufferAttribute(d,m),xh(jr,m,c,s,t,e,this)}}else{let f=Math.max(0,o.start),u=Math.min(d.count,o.start+o.count);for(let g=f,_=u;g<_;g++)jr.fromBufferAttribute(d,g),xh(jr,g,c,s,t,e,this)}}updateMorphTargets(){let e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){let s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}};function xh(i,t,e,n,s,r,o){let a=Fl.distanceSqToPoint(i);if(a<e){let c=new C;Fl.closestPointToPoint(i,c),c.applyMatrix4(n);let l=s.ray.origin.distanceTo(c);if(l<s.near||l>s.far)return;r.push({distance:l,distanceToRay:Math.sqrt(a),point:c,index:t,face:null,faceIndex:null,barycoord:null,object:o})}}var ks=class extends Le{constructor(t,e,n,s,r,o,a,c,l){super(t,e,n,s,r,o,a,c,l),this.isCanvasTexture=!0,this.needsUpdate=!0}},di=class extends Le{constructor(t,e,n=Qn,s,r,o,a=Re,c=Re,l,h=Gi,d=1){if(h!==Gi&&h!==ei)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");let f={width:t,height:e,depth:d};super(f,s,r,o,a,c,h,n,l),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.source=new Yi(Object.assign({},t.image)),this.compareFunction=t.compareFunction,this}toJSON(t){let e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}},Vs=class extends Le{constructor(t=null){super(),this.sourceTexture=t,this.isExternalTexture=!0}copy(t){return super.copy(t),this.sourceTexture=t.sourceTexture,this}},Hs=class i extends oe{constructor(t=1,e=1,n=4,s=8,r=1){super(),this.type="CapsuleGeometry",this.parameters={radius:t,height:e,capSegments:n,radialSegments:s,heightSegments:r},e=Math.max(0,e),n=Math.max(1,Math.floor(n)),s=Math.max(3,Math.floor(s)),r=Math.max(1,Math.floor(r));let o=[],a=[],c=[],l=[],h=e/2,d=Math.PI/2*t,f=e,u=2*d+f,g=n*2+r,_=s+1,m=new C,p=new C;for(let E=0;E<=g;E++){let M=0,y=0,R=0,A=0;if(E<=n){let b=E/n,v=b*Math.PI/2;y=-h-t*Math.cos(v),R=t*Math.sin(v),A=-t*Math.cos(v),M=b*d}else if(E<=n+r){let b=(E-n)/r;y=-h+b*e,R=t,A=0,M=d+b*f}else{let b=(E-n-r)/n,v=b*Math.PI/2;y=h+t*Math.sin(v),R=t*Math.cos(v),A=t*Math.sin(v),M=d+f+b*d}let P=Math.max(0,Math.min(1,M/u)),D=0;E===0?D=.5/s:E===g&&(D=-.5/s);for(let b=0;b<=s;b++){let v=b/s,L=v*Math.PI*2,O=Math.sin(L),W=Math.cos(L);p.x=-R*W,p.y=y,p.z=R*O,a.push(p.x,p.y,p.z),m.set(-R*W,A,R*O),m.normalize(),c.push(m.x,m.y,m.z),l.push(v+D,P)}if(E>0){let b=(E-1)*_;for(let v=0;v<s;v++){let L=b+v,O=b+v+1,W=E*_+v,Z=E*_+v+1;o.push(L,O,W),o.push(O,Z,W)}}}this.setIndex(o),this.setAttribute("position",new kt(a,3)),this.setAttribute("normal",new kt(c,3)),this.setAttribute("uv",new kt(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.radius,t.height,t.capSegments,t.radialSegments,t.heightSegments)}},Bl=class i extends oe{constructor(t=1,e=32,n=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:e,thetaStart:n,thetaLength:s},e=Math.max(3,e);let r=[],o=[],a=[],c=[],l=new C,h=new lt;o.push(0,0,0),a.push(0,0,1),c.push(.5,.5);for(let d=0,f=3;d<=e;d++,f+=3){let u=n+d/e*s;l.x=t*Math.cos(u),l.y=t*Math.sin(u),o.push(l.x,l.y,l.z),a.push(0,0,1),h.x=(o[f]/t+1)/2,h.y=(o[f+1]/t+1)/2,c.push(h.x,h.y)}for(let d=1;d<=e;d++)r.push(d,d+1,0);this.setIndex(r),this.setAttribute("position",new kt(o,3)),this.setAttribute("normal",new kt(a,3)),this.setAttribute("uv",new kt(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.radius,t.segments,t.thetaStart,t.thetaLength)}},Ge=class i extends oe{constructor(t=1,e=1,n=1,s=32,r=1,o=!1,a=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:n,radialSegments:s,heightSegments:r,openEnded:o,thetaStart:a,thetaLength:c};let l=this;s=Math.floor(s),r=Math.floor(r);let h=[],d=[],f=[],u=[],g=0,_=[],m=n/2,p=0;E(),o===!1&&(t>0&&M(!0),e>0&&M(!1)),this.setIndex(h),this.setAttribute("position",new kt(d,3)),this.setAttribute("normal",new kt(f,3)),this.setAttribute("uv",new kt(u,2));function E(){let y=new C,R=new C,A=0,P=(e-t)/n;for(let D=0;D<=r;D++){let b=[],v=D/r,L=v*(e-t)+t;for(let O=0;O<=s;O++){let W=O/s,Z=W*c+a,j=Math.sin(Z),$=Math.cos(Z);R.x=L*j,R.y=-v*n+m,R.z=L*$,d.push(R.x,R.y,R.z),y.set(j,P,$).normalize(),f.push(y.x,y.y,y.z),u.push(W,1-v),b.push(g++)}_.push(b)}for(let D=0;D<s;D++)for(let b=0;b<r;b++){let v=_[b][D],L=_[b+1][D],O=_[b+1][D+1],W=_[b][D+1];(t>0||b!==0)&&(h.push(v,L,W),A+=3),(e>0||b!==r-1)&&(h.push(L,O,W),A+=3)}l.addGroup(p,A,0),p+=A}function M(y){let R=g,A=new lt,P=new C,D=0,b=y===!0?t:e,v=y===!0?1:-1;for(let O=1;O<=s;O++)d.push(0,m*v,0),f.push(0,v,0),u.push(.5,.5),g++;let L=g;for(let O=0;O<=s;O++){let Z=O/s*c+a,j=Math.cos(Z),$=Math.sin(Z);P.x=b*$,P.y=m*v,P.z=b*j,d.push(P.x,P.y,P.z),f.push(0,v,0),A.x=j*.5+.5,A.y=$*.5*v+.5,u.push(A.x,A.y),g++}for(let O=0;O<s;O++){let W=R+O,Z=L+O;y===!0?h.push(Z,Z+1,W):h.push(Z+1,Z,W),D+=3}l.addGroup(p,D,y===!0?1:2),p+=D}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},zl=class i extends Ge{constructor(t=1,e=1,n=32,s=1,r=!1,o=0,a=Math.PI*2){super(0,t,e,n,s,r,o,a),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:n,heightSegments:s,openEnded:r,thetaStart:o,thetaLength:a}}static fromJSON(t){return new i(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},yo=class i extends oe{constructor(t=[],e=[],n=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:n,detail:s};let r=[],o=[];a(s),l(n),h(),this.setAttribute("position",new kt(r,3)),this.setAttribute("normal",new kt(r.slice(),3)),this.setAttribute("uv",new kt(o,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function a(E){let M=new C,y=new C,R=new C;for(let A=0;A<e.length;A+=3)u(e[A+0],M),u(e[A+1],y),u(e[A+2],R),c(M,y,R,E)}function c(E,M,y,R){let A=R+1,P=[];for(let D=0;D<=A;D++){P[D]=[];let b=E.clone().lerp(y,D/A),v=M.clone().lerp(y,D/A),L=A-D;for(let O=0;O<=L;O++)O===0&&D===A?P[D][O]=b:P[D][O]=b.clone().lerp(v,O/L)}for(let D=0;D<A;D++)for(let b=0;b<2*(A-D)-1;b++){let v=Math.floor(b/2);b%2===0?(f(P[D][v+1]),f(P[D+1][v]),f(P[D][v])):(f(P[D][v+1]),f(P[D+1][v+1]),f(P[D+1][v]))}}function l(E){let M=new C;for(let y=0;y<r.length;y+=3)M.x=r[y+0],M.y=r[y+1],M.z=r[y+2],M.normalize().multiplyScalar(E),r[y+0]=M.x,r[y+1]=M.y,r[y+2]=M.z}function h(){let E=new C;for(let M=0;M<r.length;M+=3){E.x=r[M+0],E.y=r[M+1],E.z=r[M+2];let y=m(E)/2/Math.PI+.5,R=p(E)/Math.PI+.5;o.push(y,1-R)}g(),d()}function d(){for(let E=0;E<o.length;E+=6){let M=o[E+0],y=o[E+2],R=o[E+4],A=Math.max(M,y,R),P=Math.min(M,y,R);A>.9&&P<.1&&(M<.2&&(o[E+0]+=1),y<.2&&(o[E+2]+=1),R<.2&&(o[E+4]+=1))}}function f(E){r.push(E.x,E.y,E.z)}function u(E,M){let y=E*3;M.x=t[y+0],M.y=t[y+1],M.z=t[y+2]}function g(){let E=new C,M=new C,y=new C,R=new C,A=new lt,P=new lt,D=new lt;for(let b=0,v=0;b<r.length;b+=9,v+=6){E.set(r[b+0],r[b+1],r[b+2]),M.set(r[b+3],r[b+4],r[b+5]),y.set(r[b+6],r[b+7],r[b+8]),A.set(o[v+0],o[v+1]),P.set(o[v+2],o[v+3]),D.set(o[v+4],o[v+5]),R.copy(E).add(M).add(y).divideScalar(3);let L=m(R);_(A,v+0,E,L),_(P,v+2,M,L),_(D,v+4,y,L)}}function _(E,M,y,R){R<0&&E.x===1&&(o[M]=E.x-1),y.x===0&&y.z===0&&(o[M]=R/2/Math.PI+.5)}function m(E){return Math.atan2(E.z,-E.x)}function p(E){return Math.atan2(-E.y,Math.sqrt(E.x*E.x+E.z*E.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.vertices,t.indices,t.radius,t.details)}};var je=class{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){console.warn("THREE.Curve: .getPoint() not implemented.")}getPointAt(t,e){let n=this.getUtoTmapping(t);return this.getPoint(n,e)}getPoints(t=5){let e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return e}getSpacedPoints(t=5){let e=[];for(let n=0;n<=t;n++)e.push(this.getPointAt(n/t));return e}getLength(){let t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let e=[],n,s=this.getPoint(0),r=0;e.push(0);for(let o=1;o<=t;o++)n=this.getPoint(o/t),r+=n.distanceTo(s),e.push(r),s=n;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e=null){let n=this.getLengths(),s=0,r=n.length,o;e?o=e:o=t*n[r-1];let a=0,c=r-1,l;for(;a<=c;)if(s=Math.floor(a+(c-a)/2),l=n[s]-o,l<0)a=s+1;else if(l>0)c=s-1;else{c=s;break}if(s=c,n[s]===o)return s/(r-1);let h=n[s],f=n[s+1]-h,u=(o-h)/f;return(s+u)/(r-1)}getTangent(t,e){let s=t-1e-4,r=t+1e-4;s<0&&(s=0),r>1&&(r=1);let o=this.getPoint(s),a=this.getPoint(r),c=e||(o.isVector2?new lt:new C);return c.copy(a).sub(o).normalize(),c}getTangentAt(t,e){let n=this.getUtoTmapping(t);return this.getTangent(n,e)}computeFrenetFrames(t,e=!1){let n=new C,s=[],r=[],o=[],a=new C,c=new jt;for(let u=0;u<=t;u++){let g=u/t;s[u]=this.getTangentAt(g,new C)}r[0]=new C,o[0]=new C;let l=Number.MAX_VALUE,h=Math.abs(s[0].x),d=Math.abs(s[0].y),f=Math.abs(s[0].z);h<=l&&(l=h,n.set(1,0,0)),d<=l&&(l=d,n.set(0,1,0)),f<=l&&n.set(0,0,1),a.crossVectors(s[0],n).normalize(),r[0].crossVectors(s[0],a),o[0].crossVectors(s[0],r[0]);for(let u=1;u<=t;u++){if(r[u]=r[u-1].clone(),o[u]=o[u-1].clone(),a.crossVectors(s[u-1],s[u]),a.length()>Number.EPSILON){a.normalize();let g=Math.acos(Yt(s[u-1].dot(s[u]),-1,1));r[u].applyMatrix4(c.makeRotationAxis(a,g))}o[u].crossVectors(s[u],r[u])}if(e===!0){let u=Math.acos(Yt(r[0].dot(r[t]),-1,1));u/=t,s[0].dot(a.crossVectors(r[0],r[t]))>0&&(u=-u);for(let g=1;g<=t;g++)r[g].applyMatrix4(c.makeRotationAxis(s[g],u*g)),o[g].crossVectors(s[g],r[g])}return{tangents:s,normals:r,binormals:o}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){let t={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}},ji=class extends je{constructor(t=0,e=0,n=1,s=1,r=0,o=Math.PI*2,a=!1,c=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=n,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=o,this.aClockwise=a,this.aRotation=c}getPoint(t,e=new lt){let n=e,s=Math.PI*2,r=this.aEndAngle-this.aStartAngle,o=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(o?r=0:r=s),this.aClockwise===!0&&!o&&(r===s?r=-s:r=r-s);let a=this.aStartAngle+t*r,c=this.aX+this.xRadius*Math.cos(a),l=this.aY+this.yRadius*Math.sin(a);if(this.aRotation!==0){let h=Math.cos(this.aRotation),d=Math.sin(this.aRotation),f=c-this.aX,u=l-this.aY;c=f*h-u*d+this.aX,l=f*d+u*h+this.aY}return n.set(c,l)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){let t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}},Mo=class extends ji{constructor(t,e,n,s,r,o){super(t,e,n,n,s,r,o),this.isArcCurve=!0,this.type="ArcCurve"}};function _c(){let i=0,t=0,e=0,n=0;function s(r,o,a,c){i=r,t=a,e=-3*r+3*o-2*a-c,n=2*r-2*o+a+c}return{initCatmullRom:function(r,o,a,c,l){s(o,a,l*(a-r),l*(c-o))},initNonuniformCatmullRom:function(r,o,a,c,l,h,d){let f=(o-r)/l-(a-r)/(l+h)+(a-o)/h,u=(a-o)/h-(c-o)/(h+d)+(c-a)/d;f*=h,u*=h,s(o,a,f,u)},calc:function(r){let o=r*r,a=o*r;return i+t*r+e*o+n*a}}}var Qr=new C,Tl=new _c,wl=new _c,Al=new _c,fi=class extends je{constructor(t=[],e=!1,n="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=n,this.tension=s}getPoint(t,e=new C){let n=e,s=this.points,r=s.length,o=(r-(this.closed?0:1))*t,a=Math.floor(o),c=o-a;this.closed?a+=a>0?0:(Math.floor(Math.abs(a)/r)+1)*r:c===0&&a===r-1&&(a=r-2,c=1);let l,h;this.closed||a>0?l=s[(a-1)%r]:(Qr.subVectors(s[0],s[1]).add(s[0]),l=Qr);let d=s[a%r],f=s[(a+1)%r];if(this.closed||a+2<r?h=s[(a+2)%r]:(Qr.subVectors(s[r-1],s[r-2]).add(s[r-1]),h=Qr),this.curveType==="centripetal"||this.curveType==="chordal"){let u=this.curveType==="chordal"?.5:.25,g=Math.pow(l.distanceToSquared(d),u),_=Math.pow(d.distanceToSquared(f),u),m=Math.pow(f.distanceToSquared(h),u);_<1e-4&&(_=1),g<1e-4&&(g=_),m<1e-4&&(m=_),Tl.initNonuniformCatmullRom(l.x,d.x,f.x,h.x,g,_,m),wl.initNonuniformCatmullRom(l.y,d.y,f.y,h.y,g,_,m),Al.initNonuniformCatmullRom(l.z,d.z,f.z,h.z,g,_,m)}else this.curveType==="catmullrom"&&(Tl.initCatmullRom(l.x,d.x,f.x,h.x,this.tension),wl.initCatmullRom(l.y,d.y,f.y,h.y,this.tension),Al.initCatmullRom(l.z,d.z,f.z,h.z,this.tension));return n.set(Tl.calc(c),wl.calc(c),Al.calc(c)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let s=t.points[e];this.points.push(s.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){let t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){let s=this.points[e];t.points.push(s.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let s=t.points[e];this.points.push(new C().fromArray(s))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}};function vh(i,t,e,n,s){let r=(n-t)*.5,o=(s-e)*.5,a=i*i,c=i*a;return(2*e-2*n+r+o)*c+(-3*e+3*n-2*r-o)*a+r*i+e}function kd(i,t){let e=1-i;return e*e*t}function Vd(i,t){return 2*(1-i)*i*t}function Hd(i,t){return i*i*t}function Rs(i,t,e,n){return kd(i,t)+Vd(i,e)+Hd(i,n)}function Gd(i,t){let e=1-i;return e*e*e*t}function Wd(i,t){let e=1-i;return 3*e*e*i*t}function Xd(i,t){return 3*(1-i)*i*i*t}function qd(i,t){return i*i*i*t}function Cs(i,t,e,n,s){return Gd(i,t)+Wd(i,e)+Xd(i,n)+qd(i,s)}var Gs=class extends je{constructor(t=new lt,e=new lt,n=new lt,s=new lt){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new lt){let n=e,s=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(Cs(t,s.x,r.x,o.x,a.x),Cs(t,s.y,r.y,o.y,a.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}},So=class extends je{constructor(t=new C,e=new C,n=new C,s=new C){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new C){let n=e,s=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(Cs(t,s.x,r.x,o.x,a.x),Cs(t,s.y,r.y,o.y,a.y),Cs(t,s.z,r.z,o.z,a.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}},Ws=class extends je{constructor(t=new lt,e=new lt){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new lt){let n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new lt){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},bo=class extends je{constructor(t=new C,e=new C){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new C){let n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new C){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},Xs=class extends je{constructor(t=new lt,e=new lt,n=new lt){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new lt){let n=e,s=this.v0,r=this.v1,o=this.v2;return n.set(Rs(t,s.x,r.x,o.x),Rs(t,s.y,r.y,o.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},qs=class extends je{constructor(t=new C,e=new C,n=new C){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new C){let n=e,s=this.v0,r=this.v1,o=this.v2;return n.set(Rs(t,s.x,r.x,o.x),Rs(t,s.y,r.y,o.y),Rs(t,s.z,r.z,o.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},Ys=class extends je{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new lt){let n=e,s=this.points,r=(s.length-1)*t,o=Math.floor(r),a=r-o,c=s[o===0?o:o-1],l=s[o],h=s[o>s.length-2?s.length-1:o+1],d=s[o>s.length-3?s.length-1:o+2];return n.set(vh(a,c.x,l.x,h.x,d.x),vh(a,c.y,l.y,h.y,d.y)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let s=t.points[e];this.points.push(s.clone())}return this}toJSON(){let t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){let s=this.points[e];t.points.push(s.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let s=t.points[e];this.points.push(new lt().fromArray(s))}return this}},Eo=Object.freeze({__proto__:null,ArcCurve:Mo,CatmullRomCurve3:fi,CubicBezierCurve:Gs,CubicBezierCurve3:So,EllipseCurve:ji,LineCurve:Ws,LineCurve3:bo,QuadraticBezierCurve:Xs,QuadraticBezierCurve3:qs,SplineCurve:Ys}),To=class extends je{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){let t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){let n=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new Eo[n](e,t))}return this}getPoint(t,e){let n=t*this.getLength(),s=this.getCurveLengths(),r=0;for(;r<s.length;){if(s[r]>=n){let o=s[r]-n,a=this.curves[r],c=a.getLength(),l=c===0?0:1-o/c;return a.getPointAt(l,e)}r++}return null}getLength(){let t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;let t=[],e=0;for(let n=0,s=this.curves.length;n<s;n++)e+=this.curves[n].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){let e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){let e=[],n;for(let s=0,r=this.curves;s<r.length;s++){let o=r[s],a=o.isEllipseCurve?t*2:o.isLineCurve||o.isLineCurve3?1:o.isSplineCurve?t*o.points.length:t,c=o.getPoints(a);for(let l=0;l<c.length;l++){let h=c[l];n&&n.equals(h)||(e.push(h),n=h)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){let s=t.curves[e];this.curves.push(s.clone())}return this.autoClose=t.autoClose,this}toJSON(){let t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,n=this.curves.length;e<n;e++){let s=this.curves[e];t.curves.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){let s=t.curves[e];this.curves.push(new Eo[s.type]().fromJSON(s))}return this}},Zs=class extends To{constructor(t){super(),this.type="Path",this.currentPoint=new lt,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,n=t.length;e<n;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){let n=new Ws(this.currentPoint.clone(),new lt(t,e));return this.curves.push(n),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,n,s){let r=new Xs(this.currentPoint.clone(),new lt(t,e),new lt(n,s));return this.curves.push(r),this.currentPoint.set(n,s),this}bezierCurveTo(t,e,n,s,r,o){let a=new Gs(this.currentPoint.clone(),new lt(t,e),new lt(n,s),new lt(r,o));return this.curves.push(a),this.currentPoint.set(r,o),this}splineThru(t){let e=[this.currentPoint.clone()].concat(t),n=new Ys(e);return this.curves.push(n),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,n,s,r,o){let a=this.currentPoint.x,c=this.currentPoint.y;return this.absarc(t+a,e+c,n,s,r,o),this}absarc(t,e,n,s,r,o){return this.absellipse(t,e,n,n,s,r,o),this}ellipse(t,e,n,s,r,o,a,c){let l=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(t+l,e+h,n,s,r,o,a,c),this}absellipse(t,e,n,s,r,o,a,c){let l=new ji(t,e,n,s,r,o,a,c);if(this.curves.length>0){let d=l.getPoint(0);d.equals(this.currentPoint)||this.lineTo(d.x,d.y)}this.curves.push(l);let h=l.getPoint(1);return this.currentPoint.copy(h),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){let t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}},Bn=class extends Zs{constructor(t){super(t),this.uuid=yi(),this.type="Shape",this.holes=[]}getPointsHoles(t){let e=[];for(let n=0,s=this.holes.length;n<s;n++)e[n]=this.holes[n].getPoints(t);return e}extractPoints(t){return{shape:this.getPoints(t),holes:this.getPointsHoles(t)}}copy(t){super.copy(t),this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){let s=t.holes[e];this.holes.push(s.clone())}return this}toJSON(){let t=super.toJSON();t.uuid=this.uuid,t.holes=[];for(let e=0,n=this.holes.length;e<n;e++){let s=this.holes[e];t.holes.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.uuid=t.uuid,this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){let s=t.holes[e];this.holes.push(new Zs().fromJSON(s))}return this}};function Yd(i,t,e=2){let n=t&&t.length,s=n?t[0]*e:i.length,r=au(i,0,s,e,!0),o=[];if(!r||r.next===r.prev)return o;let a,c,l;if(n&&(r=jd(i,t,r,e)),i.length>80*e){a=1/0,c=1/0;let h=-1/0,d=-1/0;for(let f=e;f<s;f+=e){let u=i[f],g=i[f+1];u<a&&(a=u),g<c&&(c=g),u>h&&(h=u),g>d&&(d=g)}l=Math.max(h-a,d-c),l=l!==0?32767/l:0}return Js(r,o,e,a,c,l,0),o}function au(i,t,e,n,s){let r;if(s===hf(i,t,e,n)>0)for(let o=t;o<e;o+=n)r=yh(o/n|0,i[o],i[o+1],r);else for(let o=e-n;o>=t;o-=n)r=yh(o/n|0,i[o],i[o+1],r);return r&&Qi(r,r.next)&&(Ks(r),r=r.next),r}function pi(i,t){if(!i)return i;t||(t=i);let e=i,n;do if(n=!1,!e.steiner&&(Qi(e,e.next)||fe(e.prev,e,e.next)===0)){if(Ks(e),e=t=e.prev,e===e.next)break;n=!0}else e=e.next;while(n||e!==t);return t}function Js(i,t,e,n,s,r,o){if(!i)return;!o&&r&&sf(i,n,s,r);let a=i;for(;i.prev!==i.next;){let c=i.prev,l=i.next;if(r?Jd(i,n,s,r):Zd(i)){t.push(c.i,i.i,l.i),Ks(i),i=l.next,a=l.next;continue}if(i=l,i===a){o?o===1?(i=$d(pi(i),t),Js(i,t,e,n,s,r,2)):o===2&&Kd(i,t,e,n,s,r):Js(pi(i),t,e,n,s,r,1);break}}}function Zd(i){let t=i.prev,e=i,n=i.next;if(fe(t,e,n)>=0)return!1;let s=t.x,r=e.x,o=n.x,a=t.y,c=e.y,l=n.y,h=Math.min(s,r,o),d=Math.min(a,c,l),f=Math.max(s,r,o),u=Math.max(a,c,l),g=n.next;for(;g!==t;){if(g.x>=h&&g.x<=f&&g.y>=d&&g.y<=u&&Ts(s,a,r,c,o,l,g.x,g.y)&&fe(g.prev,g,g.next)>=0)return!1;g=g.next}return!0}function Jd(i,t,e,n){let s=i.prev,r=i,o=i.next;if(fe(s,r,o)>=0)return!1;let a=s.x,c=r.x,l=o.x,h=s.y,d=r.y,f=o.y,u=Math.min(a,c,l),g=Math.min(h,d,f),_=Math.max(a,c,l),m=Math.max(h,d,f),p=kl(u,g,t,e,n),E=kl(_,m,t,e,n),M=i.prevZ,y=i.nextZ;for(;M&&M.z>=p&&y&&y.z<=E;){if(M.x>=u&&M.x<=_&&M.y>=g&&M.y<=m&&M!==s&&M!==o&&Ts(a,h,c,d,l,f,M.x,M.y)&&fe(M.prev,M,M.next)>=0||(M=M.prevZ,y.x>=u&&y.x<=_&&y.y>=g&&y.y<=m&&y!==s&&y!==o&&Ts(a,h,c,d,l,f,y.x,y.y)&&fe(y.prev,y,y.next)>=0))return!1;y=y.nextZ}for(;M&&M.z>=p;){if(M.x>=u&&M.x<=_&&M.y>=g&&M.y<=m&&M!==s&&M!==o&&Ts(a,h,c,d,l,f,M.x,M.y)&&fe(M.prev,M,M.next)>=0)return!1;M=M.prevZ}for(;y&&y.z<=E;){if(y.x>=u&&y.x<=_&&y.y>=g&&y.y<=m&&y!==s&&y!==o&&Ts(a,h,c,d,l,f,y.x,y.y)&&fe(y.prev,y,y.next)>=0)return!1;y=y.nextZ}return!0}function $d(i,t){let e=i;do{let n=e.prev,s=e.next.next;!Qi(n,s)&&cu(n,e,e.next,s)&&$s(n,s)&&$s(s,n)&&(t.push(n.i,e.i,s.i),Ks(e),Ks(e.next),e=i=s),e=e.next}while(e!==i);return pi(e)}function Kd(i,t,e,n,s,r){let o=i;do{let a=o.next.next;for(;a!==o.prev;){if(o.i!==a.i&&af(o,a)){let c=hu(o,a);o=pi(o,o.next),c=pi(c,c.next),Js(o,t,e,n,s,r,0),Js(c,t,e,n,s,r,0);return}a=a.next}o=o.next}while(o!==i)}function jd(i,t,e,n){let s=[];for(let r=0,o=t.length;r<o;r++){let a=t[r]*n,c=r<o-1?t[r+1]*n:i.length,l=au(i,a,c,n,!1);l===l.next&&(l.steiner=!0),s.push(of(l))}s.sort(Qd);for(let r=0;r<s.length;r++)e=tf(s[r],e);return e}function Qd(i,t){let e=i.x-t.x;if(e===0&&(e=i.y-t.y,e===0)){let n=(i.next.y-i.y)/(i.next.x-i.x),s=(t.next.y-t.y)/(t.next.x-t.x);e=n-s}return e}function tf(i,t){let e=ef(i,t);if(!e)return t;let n=hu(e,i);return pi(n,n.next),pi(e,e.next)}function ef(i,t){let e=t,n=i.x,s=i.y,r=-1/0,o;if(Qi(i,e))return e;do{if(Qi(i,e.next))return e.next;if(s<=e.y&&s>=e.next.y&&e.next.y!==e.y){let d=e.x+(s-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(d<=n&&d>r&&(r=d,o=e.x<e.next.x?e:e.next,d===n))return o}e=e.next}while(e!==t);if(!o)return null;let a=o,c=o.x,l=o.y,h=1/0;e=o;do{if(n>=e.x&&e.x>=c&&n!==e.x&&lu(s<l?n:r,s,c,l,s<l?r:n,s,e.x,e.y)){let d=Math.abs(s-e.y)/(n-e.x);$s(e,i)&&(d<h||d===h&&(e.x>o.x||e.x===o.x&&nf(o,e)))&&(o=e,h=d)}e=e.next}while(e!==a);return o}function nf(i,t){return fe(i.prev,i,t.prev)<0&&fe(t.next,i,i.next)<0}function sf(i,t,e,n){let s=i;do s.z===0&&(s.z=kl(s.x,s.y,t,e,n)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==i);s.prevZ.nextZ=null,s.prevZ=null,rf(s)}function rf(i){let t,e=1;do{let n=i,s;i=null;let r=null;for(t=0;n;){t++;let o=n,a=0;for(let l=0;l<e&&(a++,o=o.nextZ,!!o);l++);let c=e;for(;a>0||c>0&&o;)a!==0&&(c===0||!o||n.z<=o.z)?(s=n,n=n.nextZ,a--):(s=o,o=o.nextZ,c--),r?r.nextZ=s:i=s,s.prevZ=r,r=s;n=o}r.nextZ=null,e*=2}while(t>1);return i}function kl(i,t,e,n,s){return i=(i-e)*s|0,t=(t-n)*s|0,i=(i|i<<8)&16711935,i=(i|i<<4)&252645135,i=(i|i<<2)&858993459,i=(i|i<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,i|t<<1}function of(i){let t=i,e=i;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==i);return e}function lu(i,t,e,n,s,r,o,a){return(s-o)*(t-a)>=(i-o)*(r-a)&&(i-o)*(n-a)>=(e-o)*(t-a)&&(e-o)*(r-a)>=(s-o)*(n-a)}function Ts(i,t,e,n,s,r,o,a){return!(i===o&&t===a)&&lu(i,t,e,n,s,r,o,a)}function af(i,t){return i.next.i!==t.i&&i.prev.i!==t.i&&!lf(i,t)&&($s(i,t)&&$s(t,i)&&cf(i,t)&&(fe(i.prev,i,t.prev)||fe(i,t.prev,t))||Qi(i,t)&&fe(i.prev,i,i.next)>0&&fe(t.prev,t,t.next)>0)}function fe(i,t,e){return(t.y-i.y)*(e.x-t.x)-(t.x-i.x)*(e.y-t.y)}function Qi(i,t){return i.x===t.x&&i.y===t.y}function cu(i,t,e,n){let s=eo(fe(i,t,e)),r=eo(fe(i,t,n)),o=eo(fe(e,n,i)),a=eo(fe(e,n,t));return!!(s!==r&&o!==a||s===0&&to(i,e,t)||r===0&&to(i,n,t)||o===0&&to(e,i,n)||a===0&&to(e,t,n))}function to(i,t,e){return t.x<=Math.max(i.x,e.x)&&t.x>=Math.min(i.x,e.x)&&t.y<=Math.max(i.y,e.y)&&t.y>=Math.min(i.y,e.y)}function eo(i){return i>0?1:i<0?-1:0}function lf(i,t){let e=i;do{if(e.i!==i.i&&e.next.i!==i.i&&e.i!==t.i&&e.next.i!==t.i&&cu(e,e.next,i,t))return!0;e=e.next}while(e!==i);return!1}function $s(i,t){return fe(i.prev,i,i.next)<0?fe(i,t,i.next)>=0&&fe(i,i.prev,t)>=0:fe(i,t,i.prev)<0||fe(i,i.next,t)<0}function cf(i,t){let e=i,n=!1,s=(i.x+t.x)/2,r=(i.y+t.y)/2;do e.y>r!=e.next.y>r&&e.next.y!==e.y&&s<(e.next.x-e.x)*(r-e.y)/(e.next.y-e.y)+e.x&&(n=!n),e=e.next;while(e!==i);return n}function hu(i,t){let e=Vl(i.i,i.x,i.y),n=Vl(t.i,t.x,t.y),s=i.next,r=t.prev;return i.next=t,t.prev=i,e.next=s,s.prev=e,n.next=e,e.prev=n,r.next=n,n.prev=r,n}function yh(i,t,e,n){let s=Vl(i,t,e);return n?(s.next=n.next,s.prev=n,n.next.prev=s,n.next=s):(s.prev=s,s.next=s),s}function Ks(i){i.next.prev=i.prev,i.prev.next=i.next,i.prevZ&&(i.prevZ.nextZ=i.nextZ),i.nextZ&&(i.nextZ.prevZ=i.prevZ)}function Vl(i,t,e){return{i,x:t,y:e,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function hf(i,t,e,n){let s=0;for(let r=t,o=e-n;r<e;r+=n)s+=(i[o]-i[r])*(i[r+1]+i[o+1]),o=r;return s}var Hl=class{static triangulate(t,e,n=2){return Yd(t,e,n)}},Mn=class i{static area(t){let e=t.length,n=0;for(let s=e-1,r=0;r<e;s=r++)n+=t[s].x*t[r].y-t[r].x*t[s].y;return n*.5}static isClockWise(t){return i.area(t)<0}static triangulateShape(t,e){let n=[],s=[],r=[];Mh(t),Sh(n,t);let o=t.length;e.forEach(Mh);for(let c=0;c<e.length;c++)s.push(o),o+=e[c].length,Sh(n,e[c]);let a=Hl.triangulate(n,s);for(let c=0;c<a.length;c+=3)r.push(a.slice(c,c+3));return r}};function Mh(i){let t=i.length;t>2&&i[t-1].equals(i[0])&&i.pop()}function Sh(i,t){for(let e=0;e<t.length;e++)i.push(t[e].x),i.push(t[e].y)}var js=class i extends oe{constructor(t=new Bn([new lt(.5,.5),new lt(-.5,.5),new lt(-.5,-.5),new lt(.5,-.5)]),e={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:t,options:e},t=Array.isArray(t)?t:[t];let n=this,s=[],r=[];for(let a=0,c=t.length;a<c;a++){let l=t[a];o(l)}this.setAttribute("position",new kt(s,3)),this.setAttribute("uv",new kt(r,2)),this.computeVertexNormals();function o(a){let c=[],l=e.curveSegments!==void 0?e.curveSegments:12,h=e.steps!==void 0?e.steps:1,d=e.depth!==void 0?e.depth:1,f=e.bevelEnabled!==void 0?e.bevelEnabled:!0,u=e.bevelThickness!==void 0?e.bevelThickness:.2,g=e.bevelSize!==void 0?e.bevelSize:u-.1,_=e.bevelOffset!==void 0?e.bevelOffset:0,m=e.bevelSegments!==void 0?e.bevelSegments:3,p=e.extrudePath,E=e.UVGenerator!==void 0?e.UVGenerator:uf,M,y=!1,R,A,P,D;p&&(M=p.getSpacedPoints(h),y=!0,f=!1,R=p.computeFrenetFrames(h,!1),A=new C,P=new C,D=new C),f||(m=0,u=0,g=0,_=0);let b=a.extractPoints(l),v=b.shape,L=b.holes;if(!Mn.isClockWise(v)){v=v.reverse();for(let ct=0,it=L.length;ct<it;ct++){let et=L[ct];Mn.isClockWise(et)&&(L[ct]=et.reverse())}}function W(ct){let et=10000000000000001e-36,Q=ct[0];for(let xt=1;xt<=ct.length;xt++){let ut=xt%ct.length,gt=ct[ut],z=gt.x-Q.x,q=gt.y-Q.y,S=z*z+q*q,x=Math.max(Math.abs(gt.x),Math.abs(gt.y),Math.abs(Q.x),Math.abs(Q.y)),I=et*x*x;if(S<=I){ct.splice(ut,1),xt--;continue}Q=gt}}W(v),L.forEach(W);let Z=L.length,j=v;for(let ct=0;ct<Z;ct++){let it=L[ct];v=v.concat(it)}function $(ct,it,et){return it||console.error("THREE.ExtrudeGeometry: vec does not exist"),ct.clone().addScaledVector(it,et)}let dt=v.length;function X(ct,it,et){let Q,xt,ut,gt=ct.x-it.x,z=ct.y-it.y,q=et.x-ct.x,S=et.y-ct.y,x=gt*gt+z*z,I=gt*S-z*q;if(Math.abs(I)>Number.EPSILON){let N=Math.sqrt(x),V=Math.sqrt(q*q+S*S),k=it.x-z/N,ht=it.y+gt/N,at=et.x-S/V,vt=et.y+q/V,Mt=((at-k)*S-(vt-ht)*q)/(gt*S-z*q);Q=k+gt*Mt-ct.x,xt=ht+z*Mt-ct.y;let st=Q*Q+xt*xt;if(st<=2)return new lt(Q,xt);ut=Math.sqrt(st/2)}else{let N=!1;gt>Number.EPSILON?q>Number.EPSILON&&(N=!0):gt<-Number.EPSILON?q<-Number.EPSILON&&(N=!0):Math.sign(z)===Math.sign(S)&&(N=!0),N?(Q=-z,xt=gt,ut=Math.sqrt(x)):(Q=gt,xt=z,ut=Math.sqrt(x/2))}return new lt(Q/ut,xt/ut)}let pt=[];for(let ct=0,it=j.length,et=it-1,Q=ct+1;ct<it;ct++,et++,Q++)et===it&&(et=0),Q===it&&(Q=0),pt[ct]=X(j[ct],j[et],j[Q]);let St=[],wt,Et=pt.concat();for(let ct=0,it=Z;ct<it;ct++){let et=L[ct];wt=[];for(let Q=0,xt=et.length,ut=xt-1,gt=Q+1;Q<xt;Q++,ut++,gt++)ut===xt&&(ut=0),gt===xt&&(gt=0),wt[Q]=X(et[Q],et[ut],et[gt]);St.push(wt),Et=Et.concat(wt)}let Ot;if(m===0)Ot=Mn.triangulateShape(j,L);else{let ct=[],it=[];for(let et=0;et<m;et++){let Q=et/m,xt=u*Math.cos(Q*Math.PI/2),ut=g*Math.sin(Q*Math.PI/2)+_;for(let gt=0,z=j.length;gt<z;gt++){let q=$(j[gt],pt[gt],ut);bt(q.x,q.y,-xt),Q===0&&ct.push(q)}for(let gt=0,z=Z;gt<z;gt++){let q=L[gt];wt=St[gt];let S=[];for(let x=0,I=q.length;x<I;x++){let N=$(q[x],wt[x],ut);bt(N.x,N.y,-xt),Q===0&&S.push(N)}Q===0&&it.push(S)}}Ot=Mn.triangulateShape(ct,it)}let Gt=Ot.length,Ft=g+_;for(let ct=0;ct<dt;ct++){let it=f?$(v[ct],Et[ct],Ft):v[ct];y?(P.copy(R.normals[0]).multiplyScalar(it.x),A.copy(R.binormals[0]).multiplyScalar(it.y),D.copy(M[0]).add(P).add(A),bt(D.x,D.y,D.z)):bt(it.x,it.y,0)}for(let ct=1;ct<=h;ct++)for(let it=0;it<dt;it++){let et=f?$(v[it],Et[it],Ft):v[it];y?(P.copy(R.normals[ct]).multiplyScalar(et.x),A.copy(R.binormals[ct]).multiplyScalar(et.y),D.copy(M[ct]).add(P).add(A),bt(D.x,D.y,D.z)):bt(et.x,et.y,d/h*ct)}for(let ct=m-1;ct>=0;ct--){let it=ct/m,et=u*Math.cos(it*Math.PI/2),Q=g*Math.sin(it*Math.PI/2)+_;for(let xt=0,ut=j.length;xt<ut;xt++){let gt=$(j[xt],pt[xt],Q);bt(gt.x,gt.y,d+et)}for(let xt=0,ut=L.length;xt<ut;xt++){let gt=L[xt];wt=St[xt];for(let z=0,q=gt.length;z<q;z++){let S=$(gt[z],wt[z],Q);y?bt(S.x,S.y+M[h-1].y,M[h-1].x+et):bt(S.x,S.y,d+et)}}}tt(),ot();function tt(){let ct=s.length/3;if(f){let it=0,et=dt*it;for(let Q=0;Q<Gt;Q++){let xt=Ot[Q];Tt(xt[2]+et,xt[1]+et,xt[0]+et)}it=h+m*2,et=dt*it;for(let Q=0;Q<Gt;Q++){let xt=Ot[Q];Tt(xt[0]+et,xt[1]+et,xt[2]+et)}}else{for(let it=0;it<Gt;it++){let et=Ot[it];Tt(et[2],et[1],et[0])}for(let it=0;it<Gt;it++){let et=Ot[it];Tt(et[0]+dt*h,et[1]+dt*h,et[2]+dt*h)}}n.addGroup(ct,s.length/3-ct,0)}function ot(){let ct=s.length/3,it=0;At(j,it),it+=j.length;for(let et=0,Q=L.length;et<Q;et++){let xt=L[et];At(xt,it),it+=xt.length}n.addGroup(ct,s.length/3-ct,1)}function At(ct,it){let et=ct.length;for(;--et>=0;){let Q=et,xt=et-1;xt<0&&(xt=ct.length-1);for(let ut=0,gt=h+m*2;ut<gt;ut++){let z=dt*ut,q=dt*(ut+1),S=it+Q+z,x=it+xt+z,I=it+xt+q,N=it+Q+q;Wt(S,x,I,N)}}}function bt(ct,it,et){c.push(ct),c.push(it),c.push(et)}function Tt(ct,it,et){Kt(ct),Kt(it),Kt(et);let Q=s.length/3,xt=E.generateTopUV(n,s,Q-3,Q-2,Q-1);U(xt[0]),U(xt[1]),U(xt[2])}function Wt(ct,it,et,Q){Kt(ct),Kt(it),Kt(Q),Kt(it),Kt(et),Kt(Q);let xt=s.length/3,ut=E.generateSideWallUV(n,s,xt-6,xt-3,xt-2,xt-1);U(ut[0]),U(ut[1]),U(ut[3]),U(ut[1]),U(ut[2]),U(ut[3])}function Kt(ct){s.push(c[ct*3+0]),s.push(c[ct*3+1]),s.push(c[ct*3+2])}function U(ct){r.push(ct.x),r.push(ct.y)}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){let t=super.toJSON(),e=this.parameters.shapes,n=this.parameters.options;return df(e,n,t)}static fromJSON(t,e){let n=[];for(let r=0,o=t.shapes.length;r<o;r++){let a=e[t.shapes[r]];n.push(a)}let s=t.options.extrudePath;return s!==void 0&&(t.options.extrudePath=new Eo[s.type]().fromJSON(s)),new i(n,t.options)}},uf={generateTopUV:function(i,t,e,n,s){let r=t[e*3],o=t[e*3+1],a=t[n*3],c=t[n*3+1],l=t[s*3],h=t[s*3+1];return[new lt(r,o),new lt(a,c),new lt(l,h)]},generateSideWallUV:function(i,t,e,n,s,r){let o=t[e*3],a=t[e*3+1],c=t[e*3+2],l=t[n*3],h=t[n*3+1],d=t[n*3+2],f=t[s*3],u=t[s*3+1],g=t[s*3+2],_=t[r*3],m=t[r*3+1],p=t[r*3+2];return Math.abs(a-h)<Math.abs(o-l)?[new lt(o,1-c),new lt(l,1-d),new lt(f,1-g),new lt(_,1-p)]:[new lt(a,1-c),new lt(h,1-d),new lt(u,1-g),new lt(m,1-p)]}};function df(i,t,e){if(e.shapes=[],Array.isArray(i))for(let n=0,s=i.length;n<s;n++){let r=i[n];e.shapes.push(r.uuid)}else e.shapes.push(i.uuid);return e.options=Object.assign({},t),t.extrudePath!==void 0&&(e.options.extrudePath=t.extrudePath.toJSON()),e}var ts=class i extends yo{constructor(t=1,e=0){let n=(1+Math.sqrt(5))/2,s=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(s,r,t,e),this.type="IcosahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new i(t.radius,t.detail)}},es=class i extends oe{constructor(t=[new lt(0,-.5),new lt(.5,0),new lt(0,.5)],e=12,n=0,s=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:t,segments:e,phiStart:n,phiLength:s},e=Math.floor(e),s=Yt(s,0,Math.PI*2);let r=[],o=[],a=[],c=[],l=[],h=1/e,d=new C,f=new lt,u=new C,g=new C,_=new C,m=0,p=0;for(let E=0;E<=t.length-1;E++)switch(E){case 0:m=t[E+1].x-t[E].x,p=t[E+1].y-t[E].y,u.x=p*1,u.y=-m,u.z=p*0,_.copy(u),u.normalize(),c.push(u.x,u.y,u.z);break;case t.length-1:c.push(_.x,_.y,_.z);break;default:m=t[E+1].x-t[E].x,p=t[E+1].y-t[E].y,u.x=p*1,u.y=-m,u.z=p*0,g.copy(u),u.x+=_.x,u.y+=_.y,u.z+=_.z,u.normalize(),c.push(u.x,u.y,u.z),_.copy(g)}for(let E=0;E<=e;E++){let M=n+E*h*s,y=Math.sin(M),R=Math.cos(M);for(let A=0;A<=t.length-1;A++){d.x=t[A].x*y,d.y=t[A].y,d.z=t[A].x*R,o.push(d.x,d.y,d.z),f.x=E/e,f.y=A/(t.length-1),a.push(f.x,f.y);let P=c[3*A+0]*y,D=c[3*A+1],b=c[3*A+0]*R;l.push(P,D,b)}}for(let E=0;E<e;E++)for(let M=0;M<t.length-1;M++){let y=M+E*t.length,R=y,A=y+t.length,P=y+t.length+1,D=y+1;r.push(R,A,D),r.push(P,D,A)}this.setIndex(r),this.setAttribute("position",new kt(o,3)),this.setAttribute("uv",new kt(a,2)),this.setAttribute("normal",new kt(l,3))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.points,t.segments,t.phiStart,t.phiLength)}};var Qs=class i extends oe{constructor(t=1,e=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:s};let r=t/2,o=e/2,a=Math.floor(n),c=Math.floor(s),l=a+1,h=c+1,d=t/a,f=e/c,u=[],g=[],_=[],m=[];for(let p=0;p<h;p++){let E=p*f-o;for(let M=0;M<l;M++){let y=M*d-r;g.push(y,-E,0),_.push(0,0,1),m.push(M/a),m.push(1-p/c)}}for(let p=0;p<c;p++)for(let E=0;E<a;E++){let M=E+l*p,y=E+l*(p+1),R=E+1+l*(p+1),A=E+1+l*p;u.push(M,y,A),u.push(y,R,A)}this.setIndex(u),this.setAttribute("position",new kt(g,3)),this.setAttribute("normal",new kt(_,3)),this.setAttribute("uv",new kt(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.width,t.height,t.widthSegments,t.heightSegments)}};var tr=class i extends oe{constructor(t=new Bn([new lt(0,.5),new lt(-.5,-.5),new lt(.5,-.5)]),e=12){super(),this.type="ShapeGeometry",this.parameters={shapes:t,curveSegments:e};let n=[],s=[],r=[],o=[],a=0,c=0;if(Array.isArray(t)===!1)l(t);else for(let h=0;h<t.length;h++)l(t[h]),this.addGroup(a,c,h),a+=c,c=0;this.setIndex(n),this.setAttribute("position",new kt(s,3)),this.setAttribute("normal",new kt(r,3)),this.setAttribute("uv",new kt(o,2));function l(h){let d=s.length/3,f=h.extractPoints(e),u=f.shape,g=f.holes;Mn.isClockWise(u)===!1&&(u=u.reverse());for(let m=0,p=g.length;m<p;m++){let E=g[m];Mn.isClockWise(E)===!0&&(g[m]=E.reverse())}let _=Mn.triangulateShape(u,g);for(let m=0,p=g.length;m<p;m++){let E=g[m];u=u.concat(E)}for(let m=0,p=u.length;m<p;m++){let E=u[m];s.push(E.x,E.y,0),r.push(0,0,1),o.push(E.x,E.y)}for(let m=0,p=_.length;m<p;m++){let E=_[m],M=E[0]+d,y=E[1]+d,R=E[2]+d;n.push(M,y,R),c+=3}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){let t=super.toJSON(),e=this.parameters.shapes;return ff(e,t)}static fromJSON(t,e){let n=[];for(let s=0,r=t.shapes.length;s<r;s++){let o=e[t.shapes[s]];n.push(o)}return new i(n,t.curveSegments)}};function ff(i,t){if(t.shapes=[],Array.isArray(i))for(let e=0,n=i.length;e<n;e++){let s=i[e];t.shapes.push(s.uuid)}else t.shapes.push(i.uuid);return t}var ns=class i extends oe{constructor(t=1,e=32,n=16,s=0,r=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:n,phiStart:s,phiLength:r,thetaStart:o,thetaLength:a},e=Math.max(3,Math.floor(e)),n=Math.max(2,Math.floor(n));let c=Math.min(o+a,Math.PI),l=0,h=[],d=new C,f=new C,u=[],g=[],_=[],m=[];for(let p=0;p<=n;p++){let E=[],M=p/n,y=0;p===0&&o===0?y=.5/e:p===n&&c===Math.PI&&(y=-.5/e);for(let R=0;R<=e;R++){let A=R/e;d.x=-t*Math.cos(s+A*r)*Math.sin(o+M*a),d.y=t*Math.cos(o+M*a),d.z=t*Math.sin(s+A*r)*Math.sin(o+M*a),g.push(d.x,d.y,d.z),f.copy(d).normalize(),_.push(f.x,f.y,f.z),m.push(A+y,1-M),E.push(l++)}h.push(E)}for(let p=0;p<n;p++)for(let E=0;E<e;E++){let M=h[p][E+1],y=h[p][E],R=h[p+1][E],A=h[p+1][E+1];(p!==0||o>0)&&u.push(M,y,A),(p!==n-1||c<Math.PI)&&u.push(y,R,A)}this.setIndex(u),this.setAttribute("position",new kt(g,3)),this.setAttribute("normal",new kt(_,3)),this.setAttribute("uv",new kt(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}};var er=class i extends oe{constructor(t=1,e=.4,n=12,s=48,r=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:n,tubularSegments:s,arc:r},n=Math.floor(n),s=Math.floor(s);let o=[],a=[],c=[],l=[],h=new C,d=new C,f=new C;for(let u=0;u<=n;u++)for(let g=0;g<=s;g++){let _=g/s*r,m=u/n*Math.PI*2;d.x=(t+e*Math.cos(m))*Math.cos(_),d.y=(t+e*Math.cos(m))*Math.sin(_),d.z=e*Math.sin(m),a.push(d.x,d.y,d.z),h.x=t*Math.cos(_),h.y=t*Math.sin(_),f.subVectors(d,h).normalize(),c.push(f.x,f.y,f.z),l.push(g/s),l.push(u/n)}for(let u=1;u<=n;u++)for(let g=1;g<=s;g++){let _=(s+1)*u+g-1,m=(s+1)*(u-1)+g-1,p=(s+1)*(u-1)+g,E=(s+1)*u+g;o.push(_,m,E),o.push(m,p,E)}this.setIndex(o),this.setAttribute("position",new kt(a,3)),this.setAttribute("normal",new kt(c,3)),this.setAttribute("uv",new kt(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}};var Gl=class i extends oe{constructor(t=new qs(new C(-1,-1,0),new C(-1,1,0),new C(1,1,0)),e=64,n=1,s=8,r=!1){super(),this.type="TubeGeometry",this.parameters={path:t,tubularSegments:e,radius:n,radialSegments:s,closed:r};let o=t.computeFrenetFrames(e,r);this.tangents=o.tangents,this.normals=o.normals,this.binormals=o.binormals;let a=new C,c=new C,l=new lt,h=new C,d=[],f=[],u=[],g=[];_(),this.setIndex(g),this.setAttribute("position",new kt(d,3)),this.setAttribute("normal",new kt(f,3)),this.setAttribute("uv",new kt(u,2));function _(){for(let M=0;M<e;M++)m(M);m(r===!1?e:0),E(),p()}function m(M){h=t.getPointAt(M/e,h);let y=o.normals[M],R=o.binormals[M];for(let A=0;A<=s;A++){let P=A/s*Math.PI*2,D=Math.sin(P),b=-Math.cos(P);c.x=b*y.x+D*R.x,c.y=b*y.y+D*R.y,c.z=b*y.z+D*R.z,c.normalize(),f.push(c.x,c.y,c.z),a.x=h.x+n*c.x,a.y=h.y+n*c.y,a.z=h.z+n*c.z,d.push(a.x,a.y,a.z)}}function p(){for(let M=1;M<=e;M++)for(let y=1;y<=s;y++){let R=(s+1)*(M-1)+(y-1),A=(s+1)*M+(y-1),P=(s+1)*M+y,D=(s+1)*(M-1)+y;g.push(R,A,D),g.push(A,P,D)}}function E(){for(let M=0;M<=e;M++)for(let y=0;y<=s;y++)l.x=M/e,l.y=y/s,u.push(l.x,l.y)}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){let t=super.toJSON();return t.path=this.parameters.path.toJSON(),t}static fromJSON(t){return new i(new Eo[t.path.type]().fromJSON(t.path),t.tubularSegments,t.radius,t.radialSegments,t.closed)}};var Wl=class extends Ke{constructor(t){super(),this.isShadowMaterial=!0,this.type="ShadowMaterial",this.color=new zt(0),this.transparent=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.fog=t.fog,this}},nr=class extends xe{constructor(t){super(t),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}},Se=class extends Ke{constructor(t){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new zt(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new zt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=xr,this.normalScale=new lt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new hn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}},ir=class extends Se{constructor(t){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new lt(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return Yt(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(e){this.ior=(1+.4*e)/(1-.4*e)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new zt(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new zt(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new zt(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._sheen=0,this._transmission=0,this.setValues(t)}get anisotropy(){return this._anisotropy}set anisotropy(t){this._anisotropy>0!=t>0&&this.version++,this._anisotropy=t}get clearcoat(){return this._clearcoat}set clearcoat(t){this._clearcoat>0!=t>0&&this.version++,this._clearcoat=t}get iridescence(){return this._iridescence}set iridescence(t){this._iridescence>0!=t>0&&this.version++,this._iridescence=t}get dispersion(){return this._dispersion}set dispersion(t){this._dispersion>0!=t>0&&this.version++,this._dispersion=t}get sheen(){return this._sheen}set sheen(t){this._sheen>0!=t>0&&this.version++,this._sheen=t}get transmission(){return this._transmission}set transmission(t){this._transmission>0!=t>0&&this.version++,this._transmission=t}copy(t){return super.copy(t),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=t.anisotropy,this.anisotropyRotation=t.anisotropyRotation,this.anisotropyMap=t.anisotropyMap,this.clearcoat=t.clearcoat,this.clearcoatMap=t.clearcoatMap,this.clearcoatRoughness=t.clearcoatRoughness,this.clearcoatRoughnessMap=t.clearcoatRoughnessMap,this.clearcoatNormalMap=t.clearcoatNormalMap,this.clearcoatNormalScale.copy(t.clearcoatNormalScale),this.dispersion=t.dispersion,this.ior=t.ior,this.iridescence=t.iridescence,this.iridescenceMap=t.iridescenceMap,this.iridescenceIOR=t.iridescenceIOR,this.iridescenceThicknessRange=[...t.iridescenceThicknessRange],this.iridescenceThicknessMap=t.iridescenceThicknessMap,this.sheen=t.sheen,this.sheenColor.copy(t.sheenColor),this.sheenColorMap=t.sheenColorMap,this.sheenRoughness=t.sheenRoughness,this.sheenRoughnessMap=t.sheenRoughnessMap,this.transmission=t.transmission,this.transmissionMap=t.transmissionMap,this.thickness=t.thickness,this.thicknessMap=t.thicknessMap,this.attenuationDistance=t.attenuationDistance,this.attenuationColor.copy(t.attenuationColor),this.specularIntensity=t.specularIntensity,this.specularIntensityMap=t.specularIntensityMap,this.specularColor.copy(t.specularColor),this.specularColorMap=t.specularColorMap,this}};var sr=class extends Ke{constructor(t){super(),this.isMeshNormalMaterial=!0,this.type="MeshNormalMaterial",this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=xr,this.normalScale=new lt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.flatShading=!1,this.setValues(t)}copy(t){return super.copy(t),this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.flatShading=t.flatShading,this}},rr=class extends Ke{constructor(t){super(),this.isMeshLambertMaterial=!0,this.type="MeshLambertMaterial",this.color=new zt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new zt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=xr,this.normalScale=new lt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new hn,this.combine=Yo,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}},wo=class extends Ke{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Zh,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}},Ao=class extends Ke{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}};function no(i,t){return!i||i.constructor===t?i:typeof t.BYTES_PER_ELEMENT=="number"?new t(i):Array.prototype.slice.call(i)}function pf(i){return ArrayBuffer.isView(i)&&!(i instanceof DataView)}var mi=class{constructor(t,e,n,s){this.parameterPositions=t,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new e.constructor(n),this.sampleValues=e,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(t){let e=this.parameterPositions,n=this._cachedIndex,s=e[n],r=e[n-1];n:{t:{let o;e:{i:if(!(t<s)){for(let a=n+2;;){if(s===void 0){if(t<r)break i;return n=e.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(r=s,s=e[++n],t<s)break t}o=e.length;break e}if(!(t>=r)){let a=e[1];t<a&&(n=2,r=a);for(let c=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===c)break;if(s=r,r=e[--n-1],t>=r)break t}o=n,n=0;break e}break n}for(;n<o;){let a=n+o>>>1;t<e[a]?o=a:n=a+1}if(s=e[n],r=e[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return n=e.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,s)}return this.interpolate_(n,r,t,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(t){let e=this.resultBuffer,n=this.sampleValues,s=this.valueSize,r=t*s;for(let o=0;o!==s;++o)e[o]=n[r+o];return e}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}},Ro=class extends mi{constructor(t,e,n,s){super(t,e,n,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Pl,endingEnd:Pl}}intervalChanged_(t,e,n){let s=this.parameterPositions,r=t-2,o=t+1,a=s[r],c=s[o];if(a===void 0)switch(this.getSettings_().endingStart){case Il:r=t,a=2*e-n;break;case Dl:r=s.length-2,a=e+s[r]-s[r+1];break;default:r=t,a=n}if(c===void 0)switch(this.getSettings_().endingEnd){case Il:o=t,c=2*n-e;break;case Dl:o=1,c=n+s[1]-s[0];break;default:o=t-1,c=e}let l=(n-e)*.5,h=this.valueSize;this._weightPrev=l/(e-a),this._weightNext=l/(c-n),this._offsetPrev=r*h,this._offsetNext=o*h}interpolate_(t,e,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=t*a,l=c-a,h=this._offsetPrev,d=this._offsetNext,f=this._weightPrev,u=this._weightNext,g=(n-e)/(s-e),_=g*g,m=_*g,p=-f*m+2*f*_-f*g,E=(1+f)*m+(-1.5-2*f)*_+(-.5+f)*g+1,M=(-1-u)*m+(1.5+u)*_+.5*g,y=u*m-u*_;for(let R=0;R!==a;++R)r[R]=p*o[h+R]+E*o[l+R]+M*o[c+R]+y*o[d+R];return r}},Co=class extends mi{constructor(t,e,n,s){super(t,e,n,s)}interpolate_(t,e,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=t*a,l=c-a,h=(n-e)/(s-e),d=1-h;for(let f=0;f!==a;++f)r[f]=o[l+f]*d+o[c+f]*h;return r}},Po=class extends mi{constructor(t,e,n,s){super(t,e,n,s)}interpolate_(t){return this.copySampleValue_(t-1)}},Qe=class{constructor(t,e,n,s){if(t===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(e===void 0||e.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+t);this.name=t,this.times=no(e,this.TimeBufferType),this.values=no(n,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(t){let e=t.constructor,n;if(e.toJSON!==this.toJSON)n=e.toJSON(t);else{n={name:t.name,times:no(t.times,Array),values:no(t.values,Array)};let s=t.getInterpolation();s!==t.DefaultInterpolation&&(n.interpolation=s)}return n.type=t.ValueTypeName,n}InterpolantFactoryMethodDiscrete(t){return new Po(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodLinear(t){return new Co(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodSmooth(t){return new Ro(this.times,this.values,this.getValueSize(),t)}setInterpolation(t){let e;switch(t){case Ps:e=this.InterpolantFactoryMethodDiscrete;break;case lo:e=this.InterpolantFactoryMethodLinear;break;case io:e=this.InterpolantFactoryMethodSmooth;break}if(e===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(t!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return console.warn("THREE.KeyframeTrack:",n),this}return this.createInterpolant=e,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Ps;case this.InterpolantFactoryMethodLinear:return lo;case this.InterpolantFactoryMethodSmooth:return io}}getValueSize(){return this.values.length/this.times.length}shift(t){if(t!==0){let e=this.times;for(let n=0,s=e.length;n!==s;++n)e[n]+=t}return this}scale(t){if(t!==1){let e=this.times;for(let n=0,s=e.length;n!==s;++n)e[n]*=t}return this}trim(t,e){let n=this.times,s=n.length,r=0,o=s-1;for(;r!==s&&n[r]<t;)++r;for(;o!==-1&&n[o]>e;)--o;if(++o,r!==0||o!==s){r>=o&&(o=Math.max(o,1),r=o-1);let a=this.getValueSize();this.times=n.slice(r,o),this.values=this.values.slice(r*a,o*a)}return this}validate(){let t=!0,e=this.getValueSize();e-Math.floor(e)!==0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),t=!1);let n=this.times,s=this.values,r=n.length;r===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),t=!1);let o=null;for(let a=0;a!==r;a++){let c=n[a];if(typeof c=="number"&&isNaN(c)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,a,c),t=!1;break}if(o!==null&&o>c){console.error("THREE.KeyframeTrack: Out of order keys.",this,a,c,o),t=!1;break}o=c}if(s!==void 0&&pf(s))for(let a=0,c=s.length;a!==c;++a){let l=s[a];if(isNaN(l)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,a,l),t=!1;break}}return t}optimize(){let t=this.times.slice(),e=this.values.slice(),n=this.getValueSize(),s=this.getInterpolation()===io,r=t.length-1,o=1;for(let a=1;a<r;++a){let c=!1,l=t[a],h=t[a+1];if(l!==h&&(a!==1||l!==t[0]))if(s)c=!0;else{let d=a*n,f=d-n,u=d+n;for(let g=0;g!==n;++g){let _=e[d+g];if(_!==e[f+g]||_!==e[u+g]){c=!0;break}}}if(c){if(a!==o){t[o]=t[a];let d=a*n,f=o*n;for(let u=0;u!==n;++u)e[f+u]=e[d+u]}++o}}if(r>0){t[o]=t[r];for(let a=r*n,c=o*n,l=0;l!==n;++l)e[c+l]=e[a+l];++o}return o!==t.length?(this.times=t.slice(0,o),this.values=e.slice(0,o*n)):(this.times=t,this.values=e),this}clone(){let t=this.times.slice(),e=this.values.slice(),n=this.constructor,s=new n(this.name,t,e);return s.createInterpolant=this.createInterpolant,s}};Qe.prototype.ValueTypeName="";Qe.prototype.TimeBufferType=Float32Array;Qe.prototype.ValueBufferType=Float32Array;Qe.prototype.DefaultInterpolation=lo;var Jn=class extends Qe{constructor(t,e,n){super(t,e,n)}};Jn.prototype.ValueTypeName="bool";Jn.prototype.ValueBufferType=Array;Jn.prototype.DefaultInterpolation=Ps;Jn.prototype.InterpolantFactoryMethodLinear=void 0;Jn.prototype.InterpolantFactoryMethodSmooth=void 0;var Io=class extends Qe{constructor(t,e,n,s){super(t,e,n,s)}};Io.prototype.ValueTypeName="color";var Do=class extends Qe{constructor(t,e,n,s){super(t,e,n,s)}};Do.prototype.ValueTypeName="number";var Lo=class extends mi{constructor(t,e,n,s){super(t,e,n,s)}interpolate_(t,e,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=(n-e)/(s-e),l=t*a;for(let h=l+a;l!==h;l+=4)cn.slerpFlat(r,0,o,l-a,o,l,c);return r}},or=class extends Qe{constructor(t,e,n,s){super(t,e,n,s)}InterpolantFactoryMethodLinear(t){return new Lo(this.times,this.values,this.getValueSize(),t)}};or.prototype.ValueTypeName="quaternion";or.prototype.InterpolantFactoryMethodSmooth=void 0;var $n=class extends Qe{constructor(t,e,n){super(t,e,n)}};$n.prototype.ValueTypeName="string";$n.prototype.ValueBufferType=Array;$n.prototype.DefaultInterpolation=Ps;$n.prototype.InterpolantFactoryMethodLinear=void 0;$n.prototype.InterpolantFactoryMethodSmooth=void 0;var Uo=class extends Qe{constructor(t,e,n,s){super(t,e,n,s)}};Uo.prototype.ValueTypeName="vector";var so={enabled:!1,files:{},add:function(i,t){this.enabled!==!1&&(this.files[i]=t)},get:function(i){if(this.enabled!==!1)return this.files[i]},remove:function(i){delete this.files[i]},clear:function(){this.files={}}},No=class{constructor(t,e,n){let s=this,r=!1,o=0,a=0,c,l=[];this.onStart=void 0,this.onLoad=t,this.onProgress=e,this.onError=n,this.abortController=new AbortController,this.itemStart=function(h){a++,r===!1&&s.onStart!==void 0&&s.onStart(h,o,a),r=!0},this.itemEnd=function(h){o++,s.onProgress!==void 0&&s.onProgress(h,o,a),o===a&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(h){s.onError!==void 0&&s.onError(h)},this.resolveURL=function(h){return c?c(h):h},this.setURLModifier=function(h){return c=h,this},this.addHandler=function(h,d){return l.push(h,d),this},this.removeHandler=function(h){let d=l.indexOf(h);return d!==-1&&l.splice(d,2),this},this.getHandler=function(h){for(let d=0,f=l.length;d<f;d+=2){let u=l[d],g=l[d+1];if(u.global&&(u.lastIndex=0),u.test(h))return g}return null},this.abort=function(){return this.abortController.abort(),this.abortController=new AbortController,this}}},uu=new No,is=class{constructor(t){this.manager=t!==void 0?t:uu,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(t,e){let n=this;return new Promise(function(s,r){n.load(t,s,e,r)})}parse(){}setCrossOrigin(t){return this.crossOrigin=t,this}setWithCredentials(t){return this.withCredentials=t,this}setPath(t){return this.path=t,this}setResourcePath(t){return this.resourcePath=t,this}setRequestHeader(t){return this.requestHeader=t,this}abort(){return this}};is.DEFAULT_MATERIAL_NAME="__DEFAULT";var ki=new WeakMap,Fo=class extends is{constructor(t){super(t)}load(t,e,n,s){this.path!==void 0&&(t=this.path+t),t=this.manager.resolveURL(t);let r=this,o=so.get(`image:${t}`);if(o!==void 0){if(o.complete===!0)r.manager.itemStart(t),setTimeout(function(){e&&e(o),r.manager.itemEnd(t)},0);else{let d=ki.get(o);d===void 0&&(d=[],ki.set(o,d)),d.push({onLoad:e,onError:s})}return o}let a=Xi("img");function c(){h(),e&&e(this);let d=ki.get(this)||[];for(let f=0;f<d.length;f++){let u=d[f];u.onLoad&&u.onLoad(this)}ki.delete(this),r.manager.itemEnd(t)}function l(d){h(),s&&s(d),so.remove(`image:${t}`);let f=ki.get(this)||[];for(let u=0;u<f.length;u++){let g=f[u];g.onError&&g.onError(d)}ki.delete(this),r.manager.itemError(t),r.manager.itemEnd(t)}function h(){a.removeEventListener("load",c,!1),a.removeEventListener("error",l,!1)}return a.addEventListener("load",c,!1),a.addEventListener("error",l,!1),t.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(a.crossOrigin=this.crossOrigin),so.add(`image:${t}`,a),r.manager.itemStart(t),a.src=t,a}};var Xl=class extends is{constructor(t){super(t)}load(t,e,n,s){let r=new Le,o=new Fo(this.manager);return o.setCrossOrigin(this.crossOrigin),o.setPath(this.path),o.load(t,function(a){r.image=a,r.needsUpdate=!0,e!==void 0&&e(r)},n,s),r}},ss=class extends ge{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new zt(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){let e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(e.object.target=this.target.uuid),e}},ql=class extends ss{constructor(t,e,n){super(t,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(ge.DEFAULT_UP),this.updateMatrix(),this.groundColor=new zt(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}},Rl=new jt,bh=new C,Eh=new C,Oo=class{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new lt(512,512),this.mapType=tn,this.map=null,this.mapPass=null,this.matrix=new jt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Ki,this._frameExtents=new lt(1,1),this._viewportCount=1,this._viewports=[new se(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){let e=this.camera,n=this.matrix;bh.setFromMatrixPosition(t.matrixWorld),e.position.copy(bh),Eh.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(Eh),e.updateMatrixWorld(),Rl.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Rl,e.coordinateSystem,e.reversedDepth),e.reversedDepth?n.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(Rl)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.autoUpdate=t.autoUpdate,this.needsUpdate=t.needsUpdate,this.normalBias=t.normalBias,this.blurSamples=t.blurSamples,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){let t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}};var Th=new jt,Es=new C,Cl=new C,Yl=class extends Oo{constructor(){super(new Be(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new lt(4,2),this._viewportCount=6,this._viewports=[new se(2,1,1,1),new se(0,1,1,1),new se(3,1,1,1),new se(1,1,1,1),new se(3,0,1,1),new se(1,0,1,1)],this._cubeDirections=[new C(1,0,0),new C(-1,0,0),new C(0,0,1),new C(0,0,-1),new C(0,1,0),new C(0,-1,0)],this._cubeUps=[new C(0,1,0),new C(0,1,0),new C(0,1,0),new C(0,1,0),new C(0,0,1),new C(0,0,-1)]}updateMatrices(t,e=0){let n=this.camera,s=this.matrix,r=t.distance||n.far;r!==n.far&&(n.far=r,n.updateProjectionMatrix()),Es.setFromMatrixPosition(t.matrixWorld),n.position.copy(Es),Cl.copy(n.position),Cl.add(this._cubeDirections[e]),n.up.copy(this._cubeUps[e]),n.lookAt(Cl),n.updateMatrixWorld(),s.makeTranslation(-Es.x,-Es.y,-Es.z),Th.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Th,n.coordinateSystem,n.reversedDepth)}},ar=class extends ss{constructor(t,e,n=0,s=2){super(t,e),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=s,this.shadow=new Yl}get power(){return this.intensity*4*Math.PI}set power(t){this.intensity=t/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.decay=t.decay,this.shadow=t.shadow.clone(),this}},gi=class extends Os{constructor(t=-1,e=1,n=1,s=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=s,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,s,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2,r=n-t,o=n+t,a=s+e,c=s-e;if(this.view!==null&&this.view.enabled){let l=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=l*this.view.offsetX,o=r+l*this.view.width,a-=h*this.view.offsetY,c=a-h*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,c,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}},Zl=class extends Oo{constructor(){super(new gi(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},Jl=class extends ss{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(ge.DEFAULT_UP),this.updateMatrix(),this.target=new ge,this.shadow=new Zl}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}};var Bo=class extends Be{constructor(t=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=t}},lr=class{constructor(t=!0){this.autoStart=t,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=performance.now(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let t=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){let e=performance.now();t=(e-this.oldTime)/1e3,this.oldTime=e,this.elapsedTime+=t}return t}};var xc="\\[\\]\\.:\\/",mf=new RegExp("["+xc+"]","g"),vc="[^"+xc+"]",gf="[^"+xc.replace("\\.","")+"]",_f=/((?:WC+[\/:])*)/.source.replace("WC",vc),xf=/(WCOD+)?/.source.replace("WCOD",gf),vf=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",vc),yf=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",vc),Mf=new RegExp("^"+_f+xf+vf+yf+"$"),Sf=["material","materials","bones","map"],$l=class{constructor(t,e,n){let s=n||he.parseTrackName(e);this._targetGroup=t,this._bindings=t.subscribe_(e,s)}getValue(t,e){this.bind();let n=this._targetGroup.nCachedObjects_,s=this._bindings[n];s!==void 0&&s.getValue(t,e)}setValue(t,e){let n=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=n.length;s!==r;++s)n[s].setValue(t,e)}bind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,n=t.length;e!==n;++e)t[e].bind()}unbind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,n=t.length;e!==n;++e)t[e].unbind()}},he=class i{constructor(t,e,n){this.path=e,this.parsedPath=n||i.parseTrackName(e),this.node=i.findNode(t,this.parsedPath.nodeName),this.rootNode=t,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(t,e,n){return t&&t.isAnimationObjectGroup?new i.Composite(t,e,n):new i(t,e,n)}static sanitizeNodeName(t){return t.replace(/\s/g,"_").replace(mf,"")}static parseTrackName(t){let e=Mf.exec(t);if(e===null)throw new Error("PropertyBinding: Cannot parse trackName: "+t);let n={nodeName:e[2],objectName:e[3],objectIndex:e[4],propertyName:e[5],propertyIndex:e[6]},s=n.nodeName&&n.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){let r=n.nodeName.substring(s+1);Sf.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,s),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+t);return n}static findNode(t,e){if(e===void 0||e===""||e==="."||e===-1||e===t.name||e===t.uuid)return t;if(t.skeleton){let n=t.skeleton.getBoneByName(e);if(n!==void 0)return n}if(t.children){let n=function(r){for(let o=0;o<r.length;o++){let a=r[o];if(a.name===e||a.uuid===e)return a;let c=n(a.children);if(c)return c}return null},s=n(t.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(t,e){t[e]=this.targetObject[this.propertyName]}_getValue_array(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)t[e++]=n[s]}_getValue_arrayElement(t,e){t[e]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(t,e){this.resolvedProperty.toArray(t,e)}_setValue_direct(t,e){this.targetObject[this.propertyName]=t[e]}_setValue_direct_setNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=t[e++]}_setValue_array_setNeedsUpdate(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=t[e++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=t[e++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(t,e){this.resolvedProperty[this.propertyIndex]=t[e]}_setValue_arrayElement_setNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(t,e){this.resolvedProperty.fromArray(t,e)}_setValue_fromArray_setNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(t,e){this.bind(),this.getValue(t,e)}_setValue_unbound(t,e){this.bind(),this.setValue(t,e)}bind(){let t=this.node,e=this.parsedPath,n=e.objectName,s=e.propertyName,r=e.propertyIndex;if(t||(t=i.findNode(this.rootNode,e.nodeName),this.node=t),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!t){console.warn("THREE.PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let l=e.objectIndex;switch(n){case"materials":if(!t.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.materials){console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}t=t.material.materials;break;case"bones":if(!t.skeleton){console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}t=t.skeleton.bones;for(let h=0;h<t.length;h++)if(t[h].name===l){l=h;break}break;case"map":if("map"in t){t=t.map;break}if(!t.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.map){console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}t=t.material.map;break;default:if(t[n]===void 0){console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);return}t=t[n]}if(l!==void 0){if(t[l]===void 0){console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,t);return}t=t[l]}}let o=t[s];if(o===void 0){let l=e.nodeName;console.error("THREE.PropertyBinding: Trying to update property for track: "+l+"."+s+" but it wasn't found.",t);return}let a=this.Versioning.None;this.targetObject=t,t.isMaterial===!0?a=this.Versioning.NeedsUpdate:t.isObject3D===!0&&(a=this.Versioning.MatrixWorldNeedsUpdate);let c=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!t.geometry){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!t.geometry.morphAttributes){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}t.morphTargetDictionary[r]!==void 0&&(r=t.morphTargetDictionary[r])}c=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=r}else o.fromArray!==void 0&&o.toArray!==void 0?(c=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(c=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=s;this.getValue=this.GetterByBindingType[c],this.setValue=this.SetterByBindingTypeAndVersioning[c][a]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};he.Composite=$l;he.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};he.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};he.prototype.GetterByBindingType=[he.prototype._getValue_direct,he.prototype._getValue_array,he.prototype._getValue_arrayElement,he.prototype._getValue_toArray];he.prototype.SetterByBindingTypeAndVersioning=[[he.prototype._setValue_direct,he.prototype._setValue_direct_setNeedsUpdate,he.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[he.prototype._setValue_array,he.prototype._setValue_array_setNeedsUpdate,he.prototype._setValue_array_setMatrixWorldNeedsUpdate],[he.prototype._setValue_arrayElement,he.prototype._setValue_arrayElement_setNeedsUpdate,he.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[he.prototype._setValue_fromArray,he.prototype._setValue_fromArray_setNeedsUpdate,he.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var E_=new Float32Array(1);var wh=new jt,Kl=class{constructor(t,e,n=0,s=1/0){this.ray=new On(t,e),this.near=n,this.far=s,this.camera=null,this.layers=new Zi,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,(e.near+e.far)/(e.near-e.far)).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):console.error("THREE.Raycaster: Unsupported camera type: "+e.type)}setFromXRController(t){return wh.identity().extractRotation(t.matrixWorld),this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(wh),this}intersectObject(t,e=!0,n=[]){return jl(t,this,n,e),n.sort(Ah),n}intersectObjects(t,e=!0,n=[]){for(let s=0,r=t.length;s<r;s++)jl(t[s],this,n,e);return n.sort(Ah),n}};function Ah(i,t){return i.distance-t.distance}function jl(i,t,e,n){let s=!0;if(i.layers.test(t.layers)&&i.raycast(t,e)===!1&&(s=!1),s===!0&&n===!0){let r=i.children;for(let o=0,a=r.length;o<a;o++)jl(r[o],t,e,!0)}}var rs=class{constructor(t=1,e=0,n=0){this.radius=t,this.phi=e,this.theta=n}set(t,e,n){return this.radius=t,this.phi=e,this.theta=n,this}copy(t){return this.radius=t.radius,this.phi=t.phi,this.theta=t.theta,this}makeSafe(){return this.phi=Yt(this.phi,1e-6,Math.PI-1e-6),this}setFromVector3(t){return this.setFromCartesianCoords(t.x,t.y,t.z)}setFromCartesianCoords(t,e,n){return this.radius=Math.sqrt(t*t+e*e+n*n),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(t,n),this.phi=Math.acos(Yt(e/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}};var cr=class extends Sn{constructor(t,e=null){super(),this.object=t,this.domElement=e,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(t){if(t===void 0){console.warn("THREE.Controls: connect() now requires an element.");return}this.domElement!==null&&this.disconnect(),this.domElement=t}disconnect(){}dispose(){}update(){}};function yc(i,t,e,n){let s=bf(n);switch(e){case cc:return i*t;case oa:return i*t/s.components*s.byteLength;case aa:return i*t/s.components*s.byteLength;case uc:return i*t*2/s.components*s.byteLength;case la:return i*t*2/s.components*s.byteLength;case hc:return i*t*3/s.components*s.byteLength;case Ue:return i*t*4/s.components*s.byteLength;case ca:return i*t*4/s.components*s.byteLength;case pr:case mr:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case gr:case _r:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case ua:case fa:return Math.max(i,16)*Math.max(t,8)/4;case ha:case da:return Math.max(i,8)*Math.max(t,8)/2;case pa:case ma:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case ga:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case _a:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case xa:return Math.floor((i+4)/5)*Math.floor((t+3)/4)*16;case va:return Math.floor((i+4)/5)*Math.floor((t+4)/5)*16;case ya:return Math.floor((i+5)/6)*Math.floor((t+4)/5)*16;case Ma:return Math.floor((i+5)/6)*Math.floor((t+5)/6)*16;case Sa:return Math.floor((i+7)/8)*Math.floor((t+4)/5)*16;case ba:return Math.floor((i+7)/8)*Math.floor((t+5)/6)*16;case Ea:return Math.floor((i+7)/8)*Math.floor((t+7)/8)*16;case Ta:return Math.floor((i+9)/10)*Math.floor((t+4)/5)*16;case wa:return Math.floor((i+9)/10)*Math.floor((t+5)/6)*16;case Aa:return Math.floor((i+9)/10)*Math.floor((t+7)/8)*16;case Ra:return Math.floor((i+9)/10)*Math.floor((t+9)/10)*16;case Ca:return Math.floor((i+11)/12)*Math.floor((t+9)/10)*16;case Pa:return Math.floor((i+11)/12)*Math.floor((t+11)/12)*16;case Ia:case Da:case La:return Math.ceil(i/4)*Math.ceil(t/4)*16;case Ua:case Na:return Math.ceil(i/4)*Math.ceil(t/4)*8;case Fa:case Oa:return Math.ceil(i/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function bf(i){switch(i){case tn:case rc:return{byteLength:1,components:1};case as:case oc:case vn:return{byteLength:2,components:1};case sa:case ra:return{byteLength:2,components:4};case Qn:case ia:case xn:return{byteLength:4,components:1};case ac:case lc:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"180"}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="180");function Fu(){let i=null,t=!1,e=null,n=null;function s(r,o){e(r,o),n=i.requestAnimationFrame(s)}return{start:function(){t!==!0&&e!==null&&(n=i.requestAnimationFrame(s),t=!0)},stop:function(){i.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){i=r}}}function Pf(i){let t=new WeakMap;function e(a,c){let l=a.array,h=a.usage,d=l.byteLength,f=i.createBuffer();i.bindBuffer(c,f),i.bufferData(c,l,h),a.onUploadCallback();let u;if(l instanceof Float32Array)u=i.FLOAT;else if(typeof Float16Array<"u"&&l instanceof Float16Array)u=i.HALF_FLOAT;else if(l instanceof Uint16Array)a.isFloat16BufferAttribute?u=i.HALF_FLOAT:u=i.UNSIGNED_SHORT;else if(l instanceof Int16Array)u=i.SHORT;else if(l instanceof Uint32Array)u=i.UNSIGNED_INT;else if(l instanceof Int32Array)u=i.INT;else if(l instanceof Int8Array)u=i.BYTE;else if(l instanceof Uint8Array)u=i.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)u=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:f,type:u,bytesPerElement:l.BYTES_PER_ELEMENT,version:a.version,size:d}}function n(a,c,l){let h=c.array,d=c.updateRanges;if(i.bindBuffer(l,a),d.length===0)i.bufferSubData(l,0,h);else{d.sort((u,g)=>u.start-g.start);let f=0;for(let u=1;u<d.length;u++){let g=d[f],_=d[u];_.start<=g.start+g.count+1?g.count=Math.max(g.count,_.start+_.count-g.start):(++f,d[f]=_)}d.length=f+1;for(let u=0,g=d.length;u<g;u++){let _=d[u];i.bufferSubData(l,_.start*h.BYTES_PER_ELEMENT,h,_.start,_.count)}c.clearUpdateRanges()}c.onUploadCallback()}function s(a){return a.isInterleavedBufferAttribute&&(a=a.data),t.get(a)}function r(a){a.isInterleavedBufferAttribute&&(a=a.data);let c=t.get(a);c&&(i.deleteBuffer(c.buffer),t.delete(a))}function o(a,c){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){let h=t.get(a);(!h||h.version<a.version)&&t.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}let l=t.get(a);if(l===void 0)t.set(a,e(a,c));else if(l.version<a.version){if(l.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(l.buffer,a,c),l.version=a.version}}return{get:s,remove:r,update:o}}var If=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Df=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,Lf=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Uf=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Nf=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Ff=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Of=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,Bf=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,zf=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,kf=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Vf=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Hf=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Gf=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,Wf=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,Xf=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,qf=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,Yf=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Zf=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Jf=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,$f=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Kf=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,jf=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,Qf=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,tp=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,ep=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,np=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,ip=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,sp=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,rp=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,op=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,ap="gl_FragColor = linearToOutputTexel( gl_FragColor );",lp=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,cp=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,hp=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,up=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,dp=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,fp=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,pp=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,mp=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,gp=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,_p=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,xp=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,vp=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,yp=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Mp=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Sp=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,bp=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,Ep=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Tp=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,wp=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Ap=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Rp=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,Cp=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,Pp=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,Ip=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,Dp=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Lp=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Up=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Np=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Fp=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Op=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Bp=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,zp=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,kp=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Vp=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Hp=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Gp=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Wp=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Xp=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,qp=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,Yp=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Zp=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,Jp=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,$p=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Kp=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,jp=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Qp=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,tm=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,em=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,nm=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,im=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,sm=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,rm=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,om=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,am=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,lm=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,cm=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,hm=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,um=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,dm=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		float depth = unpackRGBAToDepth( texture2D( depths, uv ) );
		#ifdef USE_REVERSED_DEPTH_BUFFER
			return step( depth, compare );
		#else
			return step( compare, depth );
		#endif
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow( sampler2D shadow, vec2 uv, float compare ) {
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		#ifdef USE_REVERSED_DEPTH_BUFFER
			float hard_shadow = step( distribution.x, compare );
		#else
			float hard_shadow = step( compare, distribution.x );
		#endif
		if ( hard_shadow != 1.0 ) {
			float distance = compare - distribution.x;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,fm=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,pm=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,mm=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,gm=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,_m=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,xm=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,vm=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,ym=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Mm=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Sm=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,bm=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,Em=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,Tm=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,wm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Am=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Rm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,Cm=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,Pm=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Im=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Dm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Lm=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Um=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Nm=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Fm=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,Om=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,Bm=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,zm=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,km=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Vm=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Hm=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Gm=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Wm=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,Xm=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,qm=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Ym=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Zm=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,Jm=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,$m=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,Km=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,jm=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Qm=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,tg=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,eg=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,ng=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,ig=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,sg=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,rg=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,og=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,ag=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,lg=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,cg=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,$t={alphahash_fragment:If,alphahash_pars_fragment:Df,alphamap_fragment:Lf,alphamap_pars_fragment:Uf,alphatest_fragment:Nf,alphatest_pars_fragment:Ff,aomap_fragment:Of,aomap_pars_fragment:Bf,batching_pars_vertex:zf,batching_vertex:kf,begin_vertex:Vf,beginnormal_vertex:Hf,bsdfs:Gf,iridescence_fragment:Wf,bumpmap_pars_fragment:Xf,clipping_planes_fragment:qf,clipping_planes_pars_fragment:Yf,clipping_planes_pars_vertex:Zf,clipping_planes_vertex:Jf,color_fragment:$f,color_pars_fragment:Kf,color_pars_vertex:jf,color_vertex:Qf,common:tp,cube_uv_reflection_fragment:ep,defaultnormal_vertex:np,displacementmap_pars_vertex:ip,displacementmap_vertex:sp,emissivemap_fragment:rp,emissivemap_pars_fragment:op,colorspace_fragment:ap,colorspace_pars_fragment:lp,envmap_fragment:cp,envmap_common_pars_fragment:hp,envmap_pars_fragment:up,envmap_pars_vertex:dp,envmap_physical_pars_fragment:bp,envmap_vertex:fp,fog_vertex:pp,fog_pars_vertex:mp,fog_fragment:gp,fog_pars_fragment:_p,gradientmap_pars_fragment:xp,lightmap_pars_fragment:vp,lights_lambert_fragment:yp,lights_lambert_pars_fragment:Mp,lights_pars_begin:Sp,lights_toon_fragment:Ep,lights_toon_pars_fragment:Tp,lights_phong_fragment:wp,lights_phong_pars_fragment:Ap,lights_physical_fragment:Rp,lights_physical_pars_fragment:Cp,lights_fragment_begin:Pp,lights_fragment_maps:Ip,lights_fragment_end:Dp,logdepthbuf_fragment:Lp,logdepthbuf_pars_fragment:Up,logdepthbuf_pars_vertex:Np,logdepthbuf_vertex:Fp,map_fragment:Op,map_pars_fragment:Bp,map_particle_fragment:zp,map_particle_pars_fragment:kp,metalnessmap_fragment:Vp,metalnessmap_pars_fragment:Hp,morphinstance_vertex:Gp,morphcolor_vertex:Wp,morphnormal_vertex:Xp,morphtarget_pars_vertex:qp,morphtarget_vertex:Yp,normal_fragment_begin:Zp,normal_fragment_maps:Jp,normal_pars_fragment:$p,normal_pars_vertex:Kp,normal_vertex:jp,normalmap_pars_fragment:Qp,clearcoat_normal_fragment_begin:tm,clearcoat_normal_fragment_maps:em,clearcoat_pars_fragment:nm,iridescence_pars_fragment:im,opaque_fragment:sm,packing:rm,premultiplied_alpha_fragment:om,project_vertex:am,dithering_fragment:lm,dithering_pars_fragment:cm,roughnessmap_fragment:hm,roughnessmap_pars_fragment:um,shadowmap_pars_fragment:dm,shadowmap_pars_vertex:fm,shadowmap_vertex:pm,shadowmask_pars_fragment:mm,skinbase_vertex:gm,skinning_pars_vertex:_m,skinning_vertex:xm,skinnormal_vertex:vm,specularmap_fragment:ym,specularmap_pars_fragment:Mm,tonemapping_fragment:Sm,tonemapping_pars_fragment:bm,transmission_fragment:Em,transmission_pars_fragment:Tm,uv_pars_fragment:wm,uv_pars_vertex:Am,uv_vertex:Rm,worldpos_vertex:Cm,background_vert:Pm,background_frag:Im,backgroundCube_vert:Dm,backgroundCube_frag:Lm,cube_vert:Um,cube_frag:Nm,depth_vert:Fm,depth_frag:Om,distanceRGBA_vert:Bm,distanceRGBA_frag:zm,equirect_vert:km,equirect_frag:Vm,linedashed_vert:Hm,linedashed_frag:Gm,meshbasic_vert:Wm,meshbasic_frag:Xm,meshlambert_vert:qm,meshlambert_frag:Ym,meshmatcap_vert:Zm,meshmatcap_frag:Jm,meshnormal_vert:$m,meshnormal_frag:Km,meshphong_vert:jm,meshphong_frag:Qm,meshphysical_vert:tg,meshphysical_frag:eg,meshtoon_vert:ng,meshtoon_frag:ig,points_vert:sg,points_frag:rg,shadow_vert:og,shadow_frag:ag,sprite_vert:lg,sprite_frag:cg},Ct={common:{diffuse:{value:new zt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Zt},alphaMap:{value:null},alphaMapTransform:{value:new Zt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Zt}},envmap:{envMap:{value:null},envMapRotation:{value:new Zt},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Zt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Zt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Zt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Zt},normalScale:{value:new lt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Zt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Zt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Zt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Zt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new zt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new zt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Zt},alphaTest:{value:0},uvTransform:{value:new Zt}},sprite:{diffuse:{value:new zt(16777215)},opacity:{value:1},center:{value:new lt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Zt},alphaMap:{value:null},alphaMapTransform:{value:new Zt},alphaTest:{value:0}}},Cn={basic:{uniforms:Ne([Ct.common,Ct.specularmap,Ct.envmap,Ct.aomap,Ct.lightmap,Ct.fog]),vertexShader:$t.meshbasic_vert,fragmentShader:$t.meshbasic_frag},lambert:{uniforms:Ne([Ct.common,Ct.specularmap,Ct.envmap,Ct.aomap,Ct.lightmap,Ct.emissivemap,Ct.bumpmap,Ct.normalmap,Ct.displacementmap,Ct.fog,Ct.lights,{emissive:{value:new zt(0)}}]),vertexShader:$t.meshlambert_vert,fragmentShader:$t.meshlambert_frag},phong:{uniforms:Ne([Ct.common,Ct.specularmap,Ct.envmap,Ct.aomap,Ct.lightmap,Ct.emissivemap,Ct.bumpmap,Ct.normalmap,Ct.displacementmap,Ct.fog,Ct.lights,{emissive:{value:new zt(0)},specular:{value:new zt(1118481)},shininess:{value:30}}]),vertexShader:$t.meshphong_vert,fragmentShader:$t.meshphong_frag},standard:{uniforms:Ne([Ct.common,Ct.envmap,Ct.aomap,Ct.lightmap,Ct.emissivemap,Ct.bumpmap,Ct.normalmap,Ct.displacementmap,Ct.roughnessmap,Ct.metalnessmap,Ct.fog,Ct.lights,{emissive:{value:new zt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:$t.meshphysical_vert,fragmentShader:$t.meshphysical_frag},toon:{uniforms:Ne([Ct.common,Ct.aomap,Ct.lightmap,Ct.emissivemap,Ct.bumpmap,Ct.normalmap,Ct.displacementmap,Ct.gradientmap,Ct.fog,Ct.lights,{emissive:{value:new zt(0)}}]),vertexShader:$t.meshtoon_vert,fragmentShader:$t.meshtoon_frag},matcap:{uniforms:Ne([Ct.common,Ct.bumpmap,Ct.normalmap,Ct.displacementmap,Ct.fog,{matcap:{value:null}}]),vertexShader:$t.meshmatcap_vert,fragmentShader:$t.meshmatcap_frag},points:{uniforms:Ne([Ct.points,Ct.fog]),vertexShader:$t.points_vert,fragmentShader:$t.points_frag},dashed:{uniforms:Ne([Ct.common,Ct.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:$t.linedashed_vert,fragmentShader:$t.linedashed_frag},depth:{uniforms:Ne([Ct.common,Ct.displacementmap]),vertexShader:$t.depth_vert,fragmentShader:$t.depth_frag},normal:{uniforms:Ne([Ct.common,Ct.bumpmap,Ct.normalmap,Ct.displacementmap,{opacity:{value:1}}]),vertexShader:$t.meshnormal_vert,fragmentShader:$t.meshnormal_frag},sprite:{uniforms:Ne([Ct.sprite,Ct.fog]),vertexShader:$t.sprite_vert,fragmentShader:$t.sprite_frag},background:{uniforms:{uvTransform:{value:new Zt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:$t.background_vert,fragmentShader:$t.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Zt}},vertexShader:$t.backgroundCube_vert,fragmentShader:$t.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:$t.cube_vert,fragmentShader:$t.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:$t.equirect_vert,fragmentShader:$t.equirect_frag},distanceRGBA:{uniforms:Ne([Ct.common,Ct.displacementmap,{referencePosition:{value:new C},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:$t.distanceRGBA_vert,fragmentShader:$t.distanceRGBA_frag},shadow:{uniforms:Ne([Ct.lights,Ct.fog,{color:{value:new zt(0)},opacity:{value:1}}]),vertexShader:$t.shadow_vert,fragmentShader:$t.shadow_frag}};Cn.physical={uniforms:Ne([Cn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Zt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Zt},clearcoatNormalScale:{value:new lt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Zt},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Zt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Zt},sheen:{value:0},sheenColor:{value:new zt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Zt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Zt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Zt},transmissionSamplerSize:{value:new lt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Zt},attenuationDistance:{value:0},attenuationColor:{value:new zt(0)},specularColor:{value:new zt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Zt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Zt},anisotropyVector:{value:new lt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Zt}}]),vertexShader:$t.meshphysical_vert,fragmentShader:$t.meshphysical_frag};var Ba={r:0,b:0,g:0},Si=new hn,hg=new jt;function ug(i,t,e,n,s,r,o){let a=new zt(0),c=r===!0?0:1,l,h,d=null,f=0,u=null;function g(M){let y=M.isScene===!0?M.background:null;return y&&y.isTexture&&(y=(M.backgroundBlurriness>0?e:t).get(y)),y}function _(M){let y=!1,R=g(M);R===null?p(a,c):R&&R.isColor&&(p(R,1),y=!0);let A=i.xr.getEnvironmentBlendMode();A==="additive"?n.buffers.color.setClear(0,0,0,1,o):A==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,o),(i.autoClear||y)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function m(M,y){let R=g(y);R&&(R.isCubeTexture||R.mapping===dr)?(h===void 0&&(h=new ie(new Tn(1,1,1),new xe({name:"BackgroundCubeMaterial",uniforms:Mi(Cn.backgroundCube.uniforms),vertexShader:Cn.backgroundCube.vertexShader,fragmentShader:Cn.backgroundCube.fragmentShader,side:Ce,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(A,P,D){this.matrixWorld.copyPosition(D.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(h)),Si.copy(y.backgroundRotation),Si.x*=-1,Si.y*=-1,Si.z*=-1,R.isCubeTexture&&R.isRenderTargetTexture===!1&&(Si.y*=-1,Si.z*=-1),h.material.uniforms.envMap.value=R,h.material.uniforms.flipEnvMap.value=R.isCubeTexture&&R.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=y.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=y.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(hg.makeRotationFromEuler(Si)),h.material.toneMapped=te.getTransfer(R.colorSpace)!==ne,(d!==R||f!==R.version||u!==i.toneMapping)&&(h.material.needsUpdate=!0,d=R,f=R.version,u=i.toneMapping),h.layers.enableAll(),M.unshift(h,h.geometry,h.material,0,0,null)):R&&R.isTexture&&(l===void 0&&(l=new ie(new Qs(2,2),new xe({name:"BackgroundMaterial",uniforms:Mi(Cn.background.uniforms),vertexShader:Cn.background.vertexShader,fragmentShader:Cn.background.fragmentShader,side:Fn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(l)),l.material.uniforms.t2D.value=R,l.material.uniforms.backgroundIntensity.value=y.backgroundIntensity,l.material.toneMapped=te.getTransfer(R.colorSpace)!==ne,R.matrixAutoUpdate===!0&&R.updateMatrix(),l.material.uniforms.uvTransform.value.copy(R.matrix),(d!==R||f!==R.version||u!==i.toneMapping)&&(l.material.needsUpdate=!0,d=R,f=R.version,u=i.toneMapping),l.layers.enableAll(),M.unshift(l,l.geometry,l.material,0,0,null))}function p(M,y){M.getRGB(Ba,gc(i)),n.buffers.color.setClear(Ba.r,Ba.g,Ba.b,y,o)}function E(){h!==void 0&&(h.geometry.dispose(),h.material.dispose(),h=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return a},setClearColor:function(M,y=1){a.set(M),c=y,p(a,c)},getClearAlpha:function(){return c},setClearAlpha:function(M){c=M,p(a,c)},render:_,addToRenderList:m,dispose:E}}function dg(i,t){let e=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=f(null),r=s,o=!1;function a(v,L,O,W,Z){let j=!1,$=d(W,O,L);r!==$&&(r=$,l(r.object)),j=u(v,W,O,Z),j&&g(v,W,O,Z),Z!==null&&t.update(Z,i.ELEMENT_ARRAY_BUFFER),(j||o)&&(o=!1,y(v,L,O,W),Z!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,t.get(Z).buffer))}function c(){return i.createVertexArray()}function l(v){return i.bindVertexArray(v)}function h(v){return i.deleteVertexArray(v)}function d(v,L,O){let W=O.wireframe===!0,Z=n[v.id];Z===void 0&&(Z={},n[v.id]=Z);let j=Z[L.id];j===void 0&&(j={},Z[L.id]=j);let $=j[W];return $===void 0&&($=f(c()),j[W]=$),$}function f(v){let L=[],O=[],W=[];for(let Z=0;Z<e;Z++)L[Z]=0,O[Z]=0,W[Z]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:L,enabledAttributes:O,attributeDivisors:W,object:v,attributes:{},index:null}}function u(v,L,O,W){let Z=r.attributes,j=L.attributes,$=0,dt=O.getAttributes();for(let X in dt)if(dt[X].location>=0){let St=Z[X],wt=j[X];if(wt===void 0&&(X==="instanceMatrix"&&v.instanceMatrix&&(wt=v.instanceMatrix),X==="instanceColor"&&v.instanceColor&&(wt=v.instanceColor)),St===void 0||St.attribute!==wt||wt&&St.data!==wt.data)return!0;$++}return r.attributesNum!==$||r.index!==W}function g(v,L,O,W){let Z={},j=L.attributes,$=0,dt=O.getAttributes();for(let X in dt)if(dt[X].location>=0){let St=j[X];St===void 0&&(X==="instanceMatrix"&&v.instanceMatrix&&(St=v.instanceMatrix),X==="instanceColor"&&v.instanceColor&&(St=v.instanceColor));let wt={};wt.attribute=St,St&&St.data&&(wt.data=St.data),Z[X]=wt,$++}r.attributes=Z,r.attributesNum=$,r.index=W}function _(){let v=r.newAttributes;for(let L=0,O=v.length;L<O;L++)v[L]=0}function m(v){p(v,0)}function p(v,L){let O=r.newAttributes,W=r.enabledAttributes,Z=r.attributeDivisors;O[v]=1,W[v]===0&&(i.enableVertexAttribArray(v),W[v]=1),Z[v]!==L&&(i.vertexAttribDivisor(v,L),Z[v]=L)}function E(){let v=r.newAttributes,L=r.enabledAttributes;for(let O=0,W=L.length;O<W;O++)L[O]!==v[O]&&(i.disableVertexAttribArray(O),L[O]=0)}function M(v,L,O,W,Z,j,$){$===!0?i.vertexAttribIPointer(v,L,O,Z,j):i.vertexAttribPointer(v,L,O,W,Z,j)}function y(v,L,O,W){_();let Z=W.attributes,j=O.getAttributes(),$=L.defaultAttributeValues;for(let dt in j){let X=j[dt];if(X.location>=0){let pt=Z[dt];if(pt===void 0&&(dt==="instanceMatrix"&&v.instanceMatrix&&(pt=v.instanceMatrix),dt==="instanceColor"&&v.instanceColor&&(pt=v.instanceColor)),pt!==void 0){let St=pt.normalized,wt=pt.itemSize,Et=t.get(pt);if(Et===void 0)continue;let Ot=Et.buffer,Gt=Et.type,Ft=Et.bytesPerElement,tt=Gt===i.INT||Gt===i.UNSIGNED_INT||pt.gpuType===ia;if(pt.isInterleavedBufferAttribute){let ot=pt.data,At=ot.stride,bt=pt.offset;if(ot.isInstancedInterleavedBuffer){for(let Tt=0;Tt<X.locationSize;Tt++)p(X.location+Tt,ot.meshPerAttribute);v.isInstancedMesh!==!0&&W._maxInstanceCount===void 0&&(W._maxInstanceCount=ot.meshPerAttribute*ot.count)}else for(let Tt=0;Tt<X.locationSize;Tt++)m(X.location+Tt);i.bindBuffer(i.ARRAY_BUFFER,Ot);for(let Tt=0;Tt<X.locationSize;Tt++)M(X.location+Tt,wt/X.locationSize,Gt,St,At*Ft,(bt+wt/X.locationSize*Tt)*Ft,tt)}else{if(pt.isInstancedBufferAttribute){for(let ot=0;ot<X.locationSize;ot++)p(X.location+ot,pt.meshPerAttribute);v.isInstancedMesh!==!0&&W._maxInstanceCount===void 0&&(W._maxInstanceCount=pt.meshPerAttribute*pt.count)}else for(let ot=0;ot<X.locationSize;ot++)m(X.location+ot);i.bindBuffer(i.ARRAY_BUFFER,Ot);for(let ot=0;ot<X.locationSize;ot++)M(X.location+ot,wt/X.locationSize,Gt,St,wt*Ft,wt/X.locationSize*ot*Ft,tt)}}else if($!==void 0){let St=$[dt];if(St!==void 0)switch(St.length){case 2:i.vertexAttrib2fv(X.location,St);break;case 3:i.vertexAttrib3fv(X.location,St);break;case 4:i.vertexAttrib4fv(X.location,St);break;default:i.vertexAttrib1fv(X.location,St)}}}}E()}function R(){D();for(let v in n){let L=n[v];for(let O in L){let W=L[O];for(let Z in W)h(W[Z].object),delete W[Z];delete L[O]}delete n[v]}}function A(v){if(n[v.id]===void 0)return;let L=n[v.id];for(let O in L){let W=L[O];for(let Z in W)h(W[Z].object),delete W[Z];delete L[O]}delete n[v.id]}function P(v){for(let L in n){let O=n[L];if(O[v.id]===void 0)continue;let W=O[v.id];for(let Z in W)h(W[Z].object),delete W[Z];delete O[v.id]}}function D(){b(),o=!0,r!==s&&(r=s,l(r.object))}function b(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:a,reset:D,resetDefaultState:b,dispose:R,releaseStatesOfGeometry:A,releaseStatesOfProgram:P,initAttributes:_,enableAttribute:m,disableUnusedAttributes:E}}function fg(i,t,e){let n;function s(l){n=l}function r(l,h){i.drawArrays(n,l,h),e.update(h,n,1)}function o(l,h,d){d!==0&&(i.drawArraysInstanced(n,l,h,d),e.update(h,n,d))}function a(l,h,d){if(d===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,h,0,d);let u=0;for(let g=0;g<d;g++)u+=h[g];e.update(u,n,1)}function c(l,h,d,f){if(d===0)return;let u=t.get("WEBGL_multi_draw");if(u===null)for(let g=0;g<l.length;g++)o(l[g],h[g],f[g]);else{u.multiDrawArraysInstancedWEBGL(n,l,0,h,0,f,0,d);let g=0;for(let _=0;_<d;_++)g+=h[_]*f[_];e.update(g,n,1)}}this.setMode=s,this.render=r,this.renderInstances=o,this.renderMultiDraw=a,this.renderMultiDrawInstances=c}function pg(i,t,e,n){let s;function r(){if(s!==void 0)return s;if(t.has("EXT_texture_filter_anisotropic")===!0){let P=t.get("EXT_texture_filter_anisotropic");s=i.getParameter(P.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function o(P){return!(P!==Ue&&n.convert(P)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(P){let D=P===vn&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(P!==tn&&n.convert(P)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&P!==xn&&!D)}function c(P){if(P==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";P="mediump"}return P==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=e.precision!==void 0?e.precision:"highp",h=c(l);h!==l&&(console.warn("THREE.WebGLRenderer:",l,"not supported, using",h,"instead."),l=h);let d=e.logarithmicDepthBuffer===!0,f=e.reversedDepthBuffer===!0&&t.has("EXT_clip_control"),u=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),g=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=i.getParameter(i.MAX_TEXTURE_SIZE),m=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),p=i.getParameter(i.MAX_VERTEX_ATTRIBS),E=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),M=i.getParameter(i.MAX_VARYING_VECTORS),y=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),R=g>0,A=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:c,textureFormatReadable:o,textureTypeReadable:a,precision:l,logarithmicDepthBuffer:d,reversedDepthBuffer:f,maxTextures:u,maxVertexTextures:g,maxTextureSize:_,maxCubemapSize:m,maxAttributes:p,maxVertexUniforms:E,maxVaryings:M,maxFragmentUniforms:y,vertexTextures:R,maxSamples:A}}function mg(i){let t=this,e=null,n=0,s=!1,r=!1,o=new an,a=new Zt,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(d,f){let u=d.length!==0||f||n!==0||s;return s=f,n=d.length,u},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(d,f){e=h(d,f,0)},this.setState=function(d,f,u){let g=d.clippingPlanes,_=d.clipIntersection,m=d.clipShadows,p=i.get(d);if(!s||g===null||g.length===0||r&&!m)r?h(null):l();else{let E=r?0:n,M=E*4,y=p.clippingState||null;c.value=y,y=h(g,f,M,u);for(let R=0;R!==M;++R)y[R]=e[R];p.clippingState=y,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=E}};function l(){c.value!==e&&(c.value=e,c.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function h(d,f,u,g){let _=d!==null?d.length:0,m=null;if(_!==0){if(m=c.value,g!==!0||m===null){let p=u+_*4,E=f.matrixWorldInverse;a.getNormalMatrix(E),(m===null||m.length<p)&&(m=new Float32Array(p));for(let M=0,y=u;M!==_;++M,y+=4)o.copy(d[M]).applyMatrix4(E,a),o.normal.toArray(m,y),m[y+3]=o.constant}c.value=m,c.needsUpdate=!0}return t.numPlanes=_,t.numIntersection=0,m}}function gg(i){let t=new WeakMap;function e(o,a){return a===ta?o.mapping=xi:a===ea&&(o.mapping=vi),o}function n(o){if(o&&o.isTexture){let a=o.mapping;if(a===ta||a===ea)if(t.has(o)){let c=t.get(o).texture;return e(c,o.mapping)}else{let c=o.image;if(c&&c.height>0){let l=new po(c.height);return l.fromEquirectangularTexture(i,o),t.set(o,l),o.addEventListener("dispose",s),e(l.texture,o.mapping)}else return null}}return o}function s(o){let a=o.target;a.removeEventListener("dispose",s);let c=t.get(a);c!==void 0&&(t.delete(a),c.dispose())}function r(){t=new WeakMap}return{get:n,dispose:r}}var cs=4,du=[.125,.215,.35,.446,.526,.582],Ti=20,Mc=new gi,fu=new zt,Sc=null,bc=0,Ec=0,Tc=!1,Ei=(1+Math.sqrt(5))/2,ls=1/Ei,pu=[new C(-Ei,ls,0),new C(Ei,ls,0),new C(-ls,0,Ei),new C(ls,0,Ei),new C(0,Ei,-ls),new C(0,Ei,ls),new C(-1,1,-1),new C(1,1,-1),new C(-1,1,1),new C(1,1,1)],_g=new C,us=class{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,n=.1,s=100,r={}){let{size:o=256,position:a=_g}=r;Sc=this._renderer.getRenderTarget(),bc=this._renderer.getActiveCubeFace(),Ec=this._renderer.getActiveMipmapLevel(),Tc=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(o);let c=this._allocateTargets();return c.depthBuffer=!0,this._sceneToCubeUV(t,n,s,c,a),e>0&&this._blur(c,0,0,e),this._applyPMREM(c),this._cleanup(c),c}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=_u(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=gu(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(Sc,bc,Ec),this._renderer.xr.enabled=Tc,t.scissorTest=!1,za(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===xi||t.mapping===vi?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),Sc=this._renderer.getRenderTarget(),bc=this._renderer.getActiveCubeFace(),Ec=this._renderer.getActiveMipmapLevel(),Tc=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:$e,minFilter:$e,generateMipmaps:!1,type:vn,format:Ue,colorSpace:ui,depthBuffer:!1},s=mu(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=mu(t,e,n);let{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=xg(r)),this._blurMaterial=vg(r,t,e)}return s}_compileMaterial(t){let e=new ie(this._lodPlanes[0],t);this._renderer.compile(e,Mc)}_sceneToCubeUV(t,e,n,s,r){let c=new Be(90,1,e,n),l=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],d=this._renderer,f=d.autoClear,u=d.toneMapping;d.getClearColor(fu),d.toneMapping=zn,d.autoClear=!1,d.state.buffers.depth.getReversed()&&(d.setRenderTarget(s),d.clearDepth(),d.setRenderTarget(null));let _=new Us({name:"PMREM.Background",side:Ce,depthWrite:!1,depthTest:!1}),m=new ie(new Tn,_),p=!1,E=t.background;E?E.isColor&&(_.color.copy(E),t.background=null,p=!0):(_.color.copy(fu),p=!0);for(let M=0;M<6;M++){let y=M%3;y===0?(c.up.set(0,l[M],0),c.position.set(r.x,r.y,r.z),c.lookAt(r.x+h[M],r.y,r.z)):y===1?(c.up.set(0,0,l[M]),c.position.set(r.x,r.y,r.z),c.lookAt(r.x,r.y+h[M],r.z)):(c.up.set(0,l[M],0),c.position.set(r.x,r.y,r.z),c.lookAt(r.x,r.y,r.z+h[M]));let R=this._cubeSize;za(s,y*R,M>2?R:0,R,R),d.setRenderTarget(s),p&&d.render(m,c),d.render(t,c)}m.geometry.dispose(),m.material.dispose(),d.toneMapping=u,d.autoClear=f,t.background=E}_textureToCubeUV(t,e){let n=this._renderer,s=t.mapping===xi||t.mapping===vi;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=_u()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=gu());let r=s?this._cubemapMaterial:this._equirectMaterial,o=new ie(this._lodPlanes[0],r),a=r.uniforms;a.envMap.value=t;let c=this._cubeSize;za(e,0,0,3*c,2*c),n.setRenderTarget(e),n.render(o,Mc)}_applyPMREM(t){let e=this._renderer,n=e.autoClear;e.autoClear=!1;let s=this._lodPlanes.length;for(let r=1;r<s;r++){let o=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),a=pu[(s-r-1)%pu.length];this._blur(t,r-1,r,o,a)}e.autoClear=n}_blur(t,e,n,s,r){let o=this._pingPongRenderTarget;this._halfBlur(t,o,e,n,s,"latitudinal",r),this._halfBlur(o,t,n,n,s,"longitudinal",r)}_halfBlur(t,e,n,s,r,o,a){let c=this._renderer,l=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");let h=3,d=new ie(this._lodPlanes[s],l),f=l.uniforms,u=this._sizeLods[n]-1,g=isFinite(r)?Math.PI/(2*u):2*Math.PI/(2*Ti-1),_=r/g,m=isFinite(r)?1+Math.floor(h*_):Ti;m>Ti&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${Ti}`);let p=[],E=0;for(let P=0;P<Ti;++P){let D=P/_,b=Math.exp(-D*D/2);p.push(b),P===0?E+=b:P<m&&(E+=2*b)}for(let P=0;P<p.length;P++)p[P]=p[P]/E;f.envMap.value=t.texture,f.samples.value=m,f.weights.value=p,f.latitudinal.value=o==="latitudinal",a&&(f.poleAxis.value=a);let{_lodMax:M}=this;f.dTheta.value=g,f.mipInt.value=M-n;let y=this._sizeLods[s],R=3*y*(s>M-cs?s-M+cs:0),A=4*(this._cubeSize-y);za(e,R,A,3*y,2*y),c.setRenderTarget(e),c.render(d,Mc)}};function xg(i){let t=[],e=[],n=[],s=i,r=i-cs+1+du.length;for(let o=0;o<r;o++){let a=Math.pow(2,s);e.push(a);let c=1/a;o>i-cs?c=du[o-i+cs-1]:o===0&&(c=0),n.push(c);let l=1/(a-2),h=-l,d=1+l,f=[h,h,d,h,d,d,h,h,d,d,h,d],u=6,g=6,_=3,m=2,p=1,E=new Float32Array(_*g*u),M=new Float32Array(m*g*u),y=new Float32Array(p*g*u);for(let A=0;A<u;A++){let P=A%3*2/3-1,D=A>2?0:-1,b=[P,D,0,P+2/3,D,0,P+2/3,D+1,0,P,D,0,P+2/3,D+1,0,P,D+1,0];E.set(b,_*g*A),M.set(f,m*g*A);let v=[A,A,A,A,A,A];y.set(v,p*g*A)}let R=new oe;R.setAttribute("position",new De(E,_)),R.setAttribute("uv",new De(M,m)),R.setAttribute("faceIndex",new De(y,p)),t.push(R),s>cs&&s--}return{lodPlanes:t,sizeLods:e,sigmas:n}}function mu(i,t,e){let n=new ze(i,t,e);return n.texture.mapping=dr,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function za(i,t,e,n,s){i.viewport.set(t,e,n,s),i.scissor.set(t,e,n,s)}function vg(i,t,e){let n=new Float32Array(Ti),s=new C(0,1,0);return new xe({name:"SphericalGaussianBlur",defines:{n:Ti,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:Nc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:ye,depthTest:!1,depthWrite:!1})}function gu(){return new xe({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Nc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:ye,depthTest:!1,depthWrite:!1})}function _u(){return new xe({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Nc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:ye,depthTest:!1,depthWrite:!1})}function Nc(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function yg(i){let t=new WeakMap,e=null;function n(a){if(a&&a.isTexture){let c=a.mapping,l=c===ta||c===ea,h=c===xi||c===vi;if(l||h){let d=t.get(a),f=d!==void 0?d.texture.pmremVersion:0;if(a.isRenderTargetTexture&&a.pmremVersion!==f)return e===null&&(e=new us(i)),d=l?e.fromEquirectangular(a,d):e.fromCubemap(a,d),d.texture.pmremVersion=a.pmremVersion,t.set(a,d),d.texture;if(d!==void 0)return d.texture;{let u=a.image;return l&&u&&u.height>0||h&&u&&s(u)?(e===null&&(e=new us(i)),d=l?e.fromEquirectangular(a):e.fromCubemap(a),d.texture.pmremVersion=a.pmremVersion,t.set(a,d),a.addEventListener("dispose",r),d.texture):null}}}return a}function s(a){let c=0,l=6;for(let h=0;h<l;h++)a[h]!==void 0&&c++;return c===l}function r(a){let c=a.target;c.removeEventListener("dispose",r);let l=t.get(c);l!==void 0&&(t.delete(c),l.dispose())}function o(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:o}}function Mg(i){let t={};function e(n){if(t[n]!==void 0)return t[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return t[n]=s,s}return{has:function(n){return e(n)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(n){let s=e(n);return s===null&&qi("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function Sg(i,t,e,n){let s={},r=new WeakMap;function o(d){let f=d.target;f.index!==null&&t.remove(f.index);for(let g in f.attributes)t.remove(f.attributes[g]);f.removeEventListener("dispose",o),delete s[f.id];let u=r.get(f);u&&(t.remove(u),r.delete(f)),n.releaseStatesOfGeometry(f),f.isInstancedBufferGeometry===!0&&delete f._maxInstanceCount,e.memory.geometries--}function a(d,f){return s[f.id]===!0||(f.addEventListener("dispose",o),s[f.id]=!0,e.memory.geometries++),f}function c(d){let f=d.attributes;for(let u in f)t.update(f[u],i.ARRAY_BUFFER)}function l(d){let f=[],u=d.index,g=d.attributes.position,_=0;if(u!==null){let E=u.array;_=u.version;for(let M=0,y=E.length;M<y;M+=3){let R=E[M+0],A=E[M+1],P=E[M+2];f.push(R,A,A,P,P,R)}}else if(g!==void 0){let E=g.array;_=g.version;for(let M=0,y=E.length/3-1;M<y;M+=3){let R=M+0,A=M+1,P=M+2;f.push(R,A,A,P,P,R)}}else return;let m=new(mc(f)?Fs:Ns)(f,1);m.version=_;let p=r.get(d);p&&t.remove(p),r.set(d,m)}function h(d){let f=r.get(d);if(f){let u=d.index;u!==null&&f.version<u.version&&l(d)}else l(d);return r.get(d)}return{get:a,update:c,getWireframeAttribute:h}}function bg(i,t,e){let n;function s(f){n=f}let r,o;function a(f){r=f.type,o=f.bytesPerElement}function c(f,u){i.drawElements(n,u,r,f*o),e.update(u,n,1)}function l(f,u,g){g!==0&&(i.drawElementsInstanced(n,u,r,f*o,g),e.update(u,n,g))}function h(f,u,g){if(g===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,u,0,r,f,0,g);let m=0;for(let p=0;p<g;p++)m+=u[p];e.update(m,n,1)}function d(f,u,g,_){if(g===0)return;let m=t.get("WEBGL_multi_draw");if(m===null)for(let p=0;p<f.length;p++)l(f[p]/o,u[p],_[p]);else{m.multiDrawElementsInstancedWEBGL(n,u,0,r,f,0,_,0,g);let p=0;for(let E=0;E<g;E++)p+=u[E]*_[E];e.update(p,n,1)}}this.setMode=s,this.setIndex=a,this.render=c,this.renderInstances=l,this.renderMultiDraw=h,this.renderMultiDrawInstances=d}function Eg(i){let t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,o,a){switch(e.calls++,o){case i.TRIANGLES:e.triangles+=a*(r/3);break;case i.LINES:e.lines+=a*(r/2);break;case i.LINE_STRIP:e.lines+=a*(r-1);break;case i.LINE_LOOP:e.lines+=a*r;break;case i.POINTS:e.points+=a*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:n}}function Tg(i,t,e){let n=new WeakMap,s=new se;function r(o,a,c){let l=o.morphTargetInfluences,h=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,d=h!==void 0?h.length:0,f=n.get(a);if(f===void 0||f.count!==d){let b=function(){P.dispose(),n.delete(a),a.removeEventListener("dispose",b)};f!==void 0&&f.texture.dispose();let u=a.morphAttributes.position!==void 0,g=a.morphAttributes.normal!==void 0,_=a.morphAttributes.color!==void 0,m=a.morphAttributes.position||[],p=a.morphAttributes.normal||[],E=a.morphAttributes.color||[],M=0;u===!0&&(M=1),g===!0&&(M=2),_===!0&&(M=3);let y=a.attributes.position.count*M,R=1;y>t.maxTextureSize&&(R=Math.ceil(y/t.maxTextureSize),y=t.maxTextureSize);let A=new Float32Array(y*R*4*d),P=new Ls(A,y,R,d);P.type=xn,P.needsUpdate=!0;let D=M*4;for(let v=0;v<d;v++){let L=m[v],O=p[v],W=E[v],Z=y*R*4*v;for(let j=0;j<L.count;j++){let $=j*D;u===!0&&(s.fromBufferAttribute(L,j),A[Z+$+0]=s.x,A[Z+$+1]=s.y,A[Z+$+2]=s.z,A[Z+$+3]=0),g===!0&&(s.fromBufferAttribute(O,j),A[Z+$+4]=s.x,A[Z+$+5]=s.y,A[Z+$+6]=s.z,A[Z+$+7]=0),_===!0&&(s.fromBufferAttribute(W,j),A[Z+$+8]=s.x,A[Z+$+9]=s.y,A[Z+$+10]=s.z,A[Z+$+11]=W.itemSize===4?s.w:1)}}f={count:d,texture:P,size:new lt(y,R)},n.set(a,f),a.addEventListener("dispose",b)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)c.getUniforms().setValue(i,"morphTexture",o.morphTexture,e);else{let u=0;for(let _=0;_<l.length;_++)u+=l[_];let g=a.morphTargetsRelative?1:1-u;c.getUniforms().setValue(i,"morphTargetBaseInfluence",g),c.getUniforms().setValue(i,"morphTargetInfluences",l)}c.getUniforms().setValue(i,"morphTargetsTexture",f.texture,e),c.getUniforms().setValue(i,"morphTargetsTextureSize",f.size)}return{update:r}}function wg(i,t,e,n){let s=new WeakMap;function r(c){let l=n.render.frame,h=c.geometry,d=t.get(c,h);if(s.get(d)!==l&&(t.update(d),s.set(d,l)),c.isInstancedMesh&&(c.hasEventListener("dispose",a)===!1&&c.addEventListener("dispose",a),s.get(c)!==l&&(e.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,i.ARRAY_BUFFER),s.set(c,l))),c.isSkinnedMesh){let f=c.skeleton;s.get(f)!==l&&(f.update(),s.set(f,l))}return d}function o(){s=new WeakMap}function a(c){let l=c.target;l.removeEventListener("dispose",a),e.remove(l.instanceMatrix),l.instanceColor!==null&&e.remove(l.instanceColor)}return{update:r,dispose:o}}var Ou=new Le,xu=new di(1,1),Bu=new Ls,zu=new uo,ku=new Bs,vu=[],yu=[],Mu=new Float32Array(16),Su=new Float32Array(9),bu=new Float32Array(4);function ds(i,t,e){let n=i[0];if(n<=0||n>0)return i;let s=t*e,r=vu[s];if(r===void 0&&(r=new Float32Array(s),vu[s]=r),t!==0){n.toArray(r,0);for(let o=1,a=0;o!==t;++o)a+=e,i[o].toArray(r,a)}return r}function be(i,t){if(i.length!==t.length)return!1;for(let e=0,n=i.length;e<n;e++)if(i[e]!==t[e])return!1;return!0}function Ee(i,t){for(let e=0,n=t.length;e<n;e++)i[e]=t[e]}function Va(i,t){let e=yu[t];e===void 0&&(e=new Int32Array(t),yu[t]=e);for(let n=0;n!==t;++n)e[n]=i.allocateTextureUnit();return e}function Ag(i,t){let e=this.cache;e[0]!==t&&(i.uniform1f(this.addr,t),e[0]=t)}function Rg(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(be(e,t))return;i.uniform2fv(this.addr,t),Ee(e,t)}}function Cg(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(i.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(be(e,t))return;i.uniform3fv(this.addr,t),Ee(e,t)}}function Pg(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(be(e,t))return;i.uniform4fv(this.addr,t),Ee(e,t)}}function Ig(i,t){let e=this.cache,n=t.elements;if(n===void 0){if(be(e,t))return;i.uniformMatrix2fv(this.addr,!1,t),Ee(e,t)}else{if(be(e,n))return;bu.set(n),i.uniformMatrix2fv(this.addr,!1,bu),Ee(e,n)}}function Dg(i,t){let e=this.cache,n=t.elements;if(n===void 0){if(be(e,t))return;i.uniformMatrix3fv(this.addr,!1,t),Ee(e,t)}else{if(be(e,n))return;Su.set(n),i.uniformMatrix3fv(this.addr,!1,Su),Ee(e,n)}}function Lg(i,t){let e=this.cache,n=t.elements;if(n===void 0){if(be(e,t))return;i.uniformMatrix4fv(this.addr,!1,t),Ee(e,t)}else{if(be(e,n))return;Mu.set(n),i.uniformMatrix4fv(this.addr,!1,Mu),Ee(e,n)}}function Ug(i,t){let e=this.cache;e[0]!==t&&(i.uniform1i(this.addr,t),e[0]=t)}function Ng(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(be(e,t))return;i.uniform2iv(this.addr,t),Ee(e,t)}}function Fg(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(be(e,t))return;i.uniform3iv(this.addr,t),Ee(e,t)}}function Og(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(be(e,t))return;i.uniform4iv(this.addr,t),Ee(e,t)}}function Bg(i,t){let e=this.cache;e[0]!==t&&(i.uniform1ui(this.addr,t),e[0]=t)}function zg(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(be(e,t))return;i.uniform2uiv(this.addr,t),Ee(e,t)}}function kg(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(be(e,t))return;i.uniform3uiv(this.addr,t),Ee(e,t)}}function Vg(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(be(e,t))return;i.uniform4uiv(this.addr,t),Ee(e,t)}}function Hg(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(xu.compareFunction=dc,r=xu):r=Ou,e.setTexture2D(t||r,s)}function Gg(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture3D(t||zu,s)}function Wg(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTextureCube(t||ku,s)}function Xg(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture2DArray(t||Bu,s)}function qg(i){switch(i){case 5126:return Ag;case 35664:return Rg;case 35665:return Cg;case 35666:return Pg;case 35674:return Ig;case 35675:return Dg;case 35676:return Lg;case 5124:case 35670:return Ug;case 35667:case 35671:return Ng;case 35668:case 35672:return Fg;case 35669:case 35673:return Og;case 5125:return Bg;case 36294:return zg;case 36295:return kg;case 36296:return Vg;case 35678:case 36198:case 36298:case 36306:case 35682:return Hg;case 35679:case 36299:case 36307:return Gg;case 35680:case 36300:case 36308:case 36293:return Wg;case 36289:case 36303:case 36311:case 36292:return Xg}}function Yg(i,t){i.uniform1fv(this.addr,t)}function Zg(i,t){let e=ds(t,this.size,2);i.uniform2fv(this.addr,e)}function Jg(i,t){let e=ds(t,this.size,3);i.uniform3fv(this.addr,e)}function $g(i,t){let e=ds(t,this.size,4);i.uniform4fv(this.addr,e)}function Kg(i,t){let e=ds(t,this.size,4);i.uniformMatrix2fv(this.addr,!1,e)}function jg(i,t){let e=ds(t,this.size,9);i.uniformMatrix3fv(this.addr,!1,e)}function Qg(i,t){let e=ds(t,this.size,16);i.uniformMatrix4fv(this.addr,!1,e)}function t0(i,t){i.uniform1iv(this.addr,t)}function e0(i,t){i.uniform2iv(this.addr,t)}function n0(i,t){i.uniform3iv(this.addr,t)}function i0(i,t){i.uniform4iv(this.addr,t)}function s0(i,t){i.uniform1uiv(this.addr,t)}function r0(i,t){i.uniform2uiv(this.addr,t)}function o0(i,t){i.uniform3uiv(this.addr,t)}function a0(i,t){i.uniform4uiv(this.addr,t)}function l0(i,t,e){let n=this.cache,s=t.length,r=Va(e,s);be(n,r)||(i.uniform1iv(this.addr,r),Ee(n,r));for(let o=0;o!==s;++o)e.setTexture2D(t[o]||Ou,r[o])}function c0(i,t,e){let n=this.cache,s=t.length,r=Va(e,s);be(n,r)||(i.uniform1iv(this.addr,r),Ee(n,r));for(let o=0;o!==s;++o)e.setTexture3D(t[o]||zu,r[o])}function h0(i,t,e){let n=this.cache,s=t.length,r=Va(e,s);be(n,r)||(i.uniform1iv(this.addr,r),Ee(n,r));for(let o=0;o!==s;++o)e.setTextureCube(t[o]||ku,r[o])}function u0(i,t,e){let n=this.cache,s=t.length,r=Va(e,s);be(n,r)||(i.uniform1iv(this.addr,r),Ee(n,r));for(let o=0;o!==s;++o)e.setTexture2DArray(t[o]||Bu,r[o])}function d0(i){switch(i){case 5126:return Yg;case 35664:return Zg;case 35665:return Jg;case 35666:return $g;case 35674:return Kg;case 35675:return jg;case 35676:return Qg;case 5124:case 35670:return t0;case 35667:case 35671:return e0;case 35668:case 35672:return n0;case 35669:case 35673:return i0;case 5125:return s0;case 36294:return r0;case 36295:return o0;case 36296:return a0;case 35678:case 36198:case 36298:case 36306:case 35682:return l0;case 35679:case 36299:case 36307:return c0;case 35680:case 36300:case 36308:case 36293:return h0;case 36289:case 36303:case 36311:case 36292:return u0}}var Ac=class{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=qg(e.type)}},Rc=class{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=d0(e.type)}},Cc=class{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){let s=this.seq;for(let r=0,o=s.length;r!==o;++r){let a=s[r];a.setValue(t,e[a.id],n)}}},wc=/(\w+)(\])?(\[|\.)?/g;function Eu(i,t){i.seq.push(t),i.map[t.id]=t}function f0(i,t,e){let n=i.name,s=n.length;for(wc.lastIndex=0;;){let r=wc.exec(n),o=wc.lastIndex,a=r[1],c=r[2]==="]",l=r[3];if(c&&(a=a|0),l===void 0||l==="["&&o+2===s){Eu(e,l===void 0?new Ac(a,i,t):new Rc(a,i,t));break}else{let d=e.map[a];d===void 0&&(d=new Cc(a),Eu(e,d)),e=d}}}var hs=class{constructor(t,e){this.seq=[],this.map={};let n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){let r=t.getActiveUniform(e,s),o=t.getUniformLocation(e,r.name);f0(r,o,this)}}setValue(t,e,n,s){let r=this.map[e];r!==void 0&&r.setValue(t,n,s)}setOptional(t,e,n){let s=e[n];s!==void 0&&this.setValue(t,n,s)}static upload(t,e,n,s){for(let r=0,o=e.length;r!==o;++r){let a=e[r],c=n[a.id];c.needsUpdate!==!1&&a.setValue(t,c.value,s)}}static seqWithValue(t,e){let n=[];for(let s=0,r=t.length;s!==r;++s){let o=t[s];o.id in e&&n.push(o)}return n}};function Tu(i,t,e){let n=i.createShader(t);return i.shaderSource(n,e),i.compileShader(n),n}var p0=37297,m0=0;function g0(i,t){let e=i.split(`
`),n=[],s=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let o=s;o<r;o++){let a=o+1;n.push(`${a===t?">":" "} ${a}: ${e[o]}`)}return n.join(`
`)}var wu=new Zt;function _0(i){te._getMatrix(wu,te.workingColorSpace,i);let t=`mat3( ${wu.elements.map(e=>e.toFixed(4))} )`;switch(te.getTransfer(i)){case Is:return[t,"LinearTransferOETF"];case ne:return[t,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",i),[t,"LinearTransferOETF"]}}function Au(i,t,e){let n=i.getShaderParameter(t,i.COMPILE_STATUS),r=(i.getShaderInfoLog(t)||"").trim();if(n&&r==="")return"";let o=/ERROR: 0:(\d+)/.exec(r);if(o){let a=parseInt(o[1]);return e.toUpperCase()+`

`+r+`

`+g0(i.getShaderSource(t),a)}else return r}function x0(i,t){let e=_0(t);return[`vec4 ${i}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}function v0(i,t){let e;switch(t){case Zo:e="Linear";break;case Jo:e="Reinhard";break;case $o:e="Cineon";break;case os:e="ACESFilmic";break;case jo:e="AgX";break;case Qo:e="Neutral";break;case Ko:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+i+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}var ka=new C;function y0(){te.getLuminanceCoefficients(ka);let i=ka.x.toFixed(4),t=ka.y.toFixed(4),e=ka.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function M0(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(vr).join(`
`)}function S0(i){let t=[];for(let e in i){let n=i[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function b0(i,t){let e={},n=i.getProgramParameter(t,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){let r=i.getActiveAttrib(t,s),o=r.name,a=1;r.type===i.FLOAT_MAT2&&(a=2),r.type===i.FLOAT_MAT3&&(a=3),r.type===i.FLOAT_MAT4&&(a=4),e[o]={type:r.type,location:i.getAttribLocation(t,o),locationSize:a}}return e}function vr(i){return i!==""}function Ru(i,t){let e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Cu(i,t){return i.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}var E0=/^[ \t]*#include +<([\w\d./]+)>/gm;function Pc(i){return i.replace(E0,w0)}var T0=new Map;function w0(i,t){let e=$t[t];if(e===void 0){let n=T0.get(t);if(n!==void 0)e=$t[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return Pc(e)}var A0=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Pu(i){return i.replace(A0,R0)}function R0(i,t,e,n){let s="";for(let r=parseInt(t);r<parseInt(e);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function Iu(i){let t=`precision ${i.precision} float;
	precision ${i.precision} int;
	precision ${i.precision} sampler2D;
	precision ${i.precision} samplerCube;
	precision ${i.precision} sampler3D;
	precision ${i.precision} sampler2DArray;
	precision ${i.precision} sampler2DShadow;
	precision ${i.precision} samplerCubeShadow;
	precision ${i.precision} sampler2DArrayShadow;
	precision ${i.precision} isampler2D;
	precision ${i.precision} isampler3D;
	precision ${i.precision} isamplerCube;
	precision ${i.precision} isampler2DArray;
	precision ${i.precision} usampler2D;
	precision ${i.precision} usampler3D;
	precision ${i.precision} usamplerCube;
	precision ${i.precision} usampler2DArray;
	`;return i.precision==="highp"?t+=`
#define HIGH_PRECISION`:i.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}function C0(i){let t="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===tc?t="SHADOWMAP_TYPE_PCF":i.shadowMapType===Ph?t="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===An&&(t="SHADOWMAP_TYPE_VSM"),t}function P0(i){let t="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case xi:case vi:t="ENVMAP_TYPE_CUBE";break;case dr:t="ENVMAP_TYPE_CUBE_UV";break}return t}function I0(i){let t="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case vi:t="ENVMAP_MODE_REFRACTION";break}return t}function D0(i){let t="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case Yo:t="ENVMAP_BLENDING_MULTIPLY";break;case Xh:t="ENVMAP_BLENDING_MIX";break;case qh:t="ENVMAP_BLENDING_ADD";break}return t}function L0(i){let t=i.envMapCubeUVHeight;if(t===null)return null;let e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),112)),texelHeight:n,maxMip:e}}function U0(i,t,e,n){let s=i.getContext(),r=e.defines,o=e.vertexShader,a=e.fragmentShader,c=C0(e),l=P0(e),h=I0(e),d=D0(e),f=L0(e),u=M0(e),g=S0(r),_=s.createProgram(),m,p,E=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(m=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(vr).join(`
`),m.length>0&&(m+=`
`),p=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(vr).join(`
`),p.length>0&&(p+=`
`)):(m=[Iu(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(vr).join(`
`),p=[Iu(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+l:"",e.envMap?"#define "+h:"",e.envMap?"#define "+d:"",f?"#define CUBEUV_TEXEL_WIDTH "+f.texelWidth:"",f?"#define CUBEUV_TEXEL_HEIGHT "+f.texelHeight:"",f?"#define CUBEUV_MAX_MIP "+f.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==zn?"#define TONE_MAPPING":"",e.toneMapping!==zn?$t.tonemapping_pars_fragment:"",e.toneMapping!==zn?v0("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",$t.colorspace_pars_fragment,x0("linearToOutputTexel",e.outputColorSpace),y0(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(vr).join(`
`)),o=Pc(o),o=Ru(o,e),o=Cu(o,e),a=Pc(a),a=Ru(a,e),a=Cu(a,e),o=Pu(o),a=Pu(a),e.isRawShaderMaterial!==!0&&(E=`#version 300 es
`,m=[u,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,p=["#define varying in",e.glslVersion===fc?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===fc?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);let M=E+m+o,y=E+p+a,R=Tu(s,s.VERTEX_SHADER,M),A=Tu(s,s.FRAGMENT_SHADER,y);s.attachShader(_,R),s.attachShader(_,A),e.index0AttributeName!==void 0?s.bindAttribLocation(_,0,e.index0AttributeName):e.morphTargets===!0&&s.bindAttribLocation(_,0,"position"),s.linkProgram(_);function P(L){if(i.debug.checkShaderErrors){let O=s.getProgramInfoLog(_)||"",W=s.getShaderInfoLog(R)||"",Z=s.getShaderInfoLog(A)||"",j=O.trim(),$=W.trim(),dt=Z.trim(),X=!0,pt=!0;if(s.getProgramParameter(_,s.LINK_STATUS)===!1)if(X=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,_,R,A);else{let St=Au(s,R,"vertex"),wt=Au(s,A,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(_,s.VALIDATE_STATUS)+`

Material Name: `+L.name+`
Material Type: `+L.type+`

Program Info Log: `+j+`
`+St+`
`+wt)}else j!==""?console.warn("THREE.WebGLProgram: Program Info Log:",j):($===""||dt==="")&&(pt=!1);pt&&(L.diagnostics={runnable:X,programLog:j,vertexShader:{log:$,prefix:m},fragmentShader:{log:dt,prefix:p}})}s.deleteShader(R),s.deleteShader(A),D=new hs(s,_),b=b0(s,_)}let D;this.getUniforms=function(){return D===void 0&&P(this),D};let b;this.getAttributes=function(){return b===void 0&&P(this),b};let v=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return v===!1&&(v=s.getProgramParameter(_,p0)),v},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(_),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=m0++,this.cacheKey=t,this.usedTimes=1,this.program=_,this.vertexShader=R,this.fragmentShader=A,this}var N0=0,Ic=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){let e=t.vertexShader,n=t.fragmentShader,s=this._getShaderStage(e),r=this._getShaderStage(n),o=this._getShaderCacheForMaterial(t);return o.has(s)===!1&&(o.add(s),s.usedTimes++),o.has(r)===!1&&(o.add(r),r.usedTimes++),this}remove(t){let e=this.materialCache.get(t);for(let n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){let e=this.materialCache,n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){let e=this.shaderCache,n=e.get(t);return n===void 0&&(n=new Dc(t),e.set(t,n)),n}},Dc=class{constructor(t){this.id=N0++,this.code=t,this.usedTimes=0}};function F0(i,t,e,n,s,r,o){let a=new Zi,c=new Ic,l=new Set,h=[],d=s.logarithmicDepthBuffer,f=s.vertexTextures,u=s.precision,g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(b){return l.add(b),b===0?"uv":`uv${b}`}function m(b,v,L,O,W){let Z=O.fog,j=W.geometry,$=b.isMeshStandardMaterial?O.environment:null,dt=(b.isMeshStandardMaterial?e:t).get(b.envMap||$),X=dt&&dt.mapping===dr?dt.image.height:null,pt=g[b.type];b.precision!==null&&(u=s.getMaxPrecision(b.precision),u!==b.precision&&console.warn("THREE.WebGLProgram.getParameters:",b.precision,"not supported, using",u,"instead."));let St=j.morphAttributes.position||j.morphAttributes.normal||j.morphAttributes.color,wt=St!==void 0?St.length:0,Et=0;j.morphAttributes.position!==void 0&&(Et=1),j.morphAttributes.normal!==void 0&&(Et=2),j.morphAttributes.color!==void 0&&(Et=3);let Ot,Gt,Ft,tt;if(pt){let qt=Cn[pt];Ot=qt.vertexShader,Gt=qt.fragmentShader}else Ot=b.vertexShader,Gt=b.fragmentShader,c.update(b),Ft=c.getVertexShaderID(b),tt=c.getFragmentShaderID(b);let ot=i.getRenderTarget(),At=i.state.buffers.depth.getReversed(),bt=W.isInstancedMesh===!0,Tt=W.isBatchedMesh===!0,Wt=!!b.map,Kt=!!b.matcap,U=!!dt,ct=!!b.aoMap,it=!!b.lightMap,et=!!b.bumpMap,Q=!!b.normalMap,xt=!!b.displacementMap,ut=!!b.emissiveMap,gt=!!b.metalnessMap,z=!!b.roughnessMap,q=b.anisotropy>0,S=b.clearcoat>0,x=b.dispersion>0,I=b.iridescence>0,N=b.sheen>0,V=b.transmission>0,k=q&&!!b.anisotropyMap,ht=S&&!!b.clearcoatMap,at=S&&!!b.clearcoatNormalMap,vt=S&&!!b.clearcoatRoughnessMap,Mt=I&&!!b.iridescenceMap,st=I&&!!b.iridescenceThicknessMap,mt=N&&!!b.sheenColorMap,Lt=N&&!!b.sheenRoughnessMap,It=!!b.specularMap,yt=!!b.specularColorMap,F=!!b.specularIntensityMap,T=V&&!!b.transmissionMap,B=V&&!!b.thicknessMap,J=!!b.gradientMap,ft=!!b.alphaMap,rt=b.alphaTest>0,nt=!!b.alphaHash,Rt=!!b.extensions,Ut=zn;b.toneMapped&&(ot===null||ot.isXRRenderTarget===!0)&&(Ut=i.toneMapping);let Jt={shaderID:pt,shaderType:b.type,shaderName:b.name,vertexShader:Ot,fragmentShader:Gt,defines:b.defines,customVertexShaderID:Ft,customFragmentShaderID:tt,isRawShaderMaterial:b.isRawShaderMaterial===!0,glslVersion:b.glslVersion,precision:u,batching:Tt,batchingColor:Tt&&W._colorsTexture!==null,instancing:bt,instancingColor:bt&&W.instanceColor!==null,instancingMorph:bt&&W.morphTexture!==null,supportsVertexTextures:f,outputColorSpace:ot===null?i.outputColorSpace:ot.isXRRenderTarget===!0?ot.texture.colorSpace:ui,alphaToCoverage:!!b.alphaToCoverage,map:Wt,matcap:Kt,envMap:U,envMapMode:U&&dt.mapping,envMapCubeUVHeight:X,aoMap:ct,lightMap:it,bumpMap:et,normalMap:Q,displacementMap:f&&xt,emissiveMap:ut,normalMapObjectSpace:Q&&b.normalMapType===$h,normalMapTangentSpace:Q&&b.normalMapType===xr,metalnessMap:gt,roughnessMap:z,anisotropy:q,anisotropyMap:k,clearcoat:S,clearcoatMap:ht,clearcoatNormalMap:at,clearcoatRoughnessMap:vt,dispersion:x,iridescence:I,iridescenceMap:Mt,iridescenceThicknessMap:st,sheen:N,sheenColorMap:mt,sheenRoughnessMap:Lt,specularMap:It,specularColorMap:yt,specularIntensityMap:F,transmission:V,transmissionMap:T,thicknessMap:B,gradientMap:J,opaque:b.transparent===!1&&b.blending===ci&&b.alphaToCoverage===!1,alphaMap:ft,alphaTest:rt,alphaHash:nt,combine:b.combine,mapUv:Wt&&_(b.map.channel),aoMapUv:ct&&_(b.aoMap.channel),lightMapUv:it&&_(b.lightMap.channel),bumpMapUv:et&&_(b.bumpMap.channel),normalMapUv:Q&&_(b.normalMap.channel),displacementMapUv:xt&&_(b.displacementMap.channel),emissiveMapUv:ut&&_(b.emissiveMap.channel),metalnessMapUv:gt&&_(b.metalnessMap.channel),roughnessMapUv:z&&_(b.roughnessMap.channel),anisotropyMapUv:k&&_(b.anisotropyMap.channel),clearcoatMapUv:ht&&_(b.clearcoatMap.channel),clearcoatNormalMapUv:at&&_(b.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:vt&&_(b.clearcoatRoughnessMap.channel),iridescenceMapUv:Mt&&_(b.iridescenceMap.channel),iridescenceThicknessMapUv:st&&_(b.iridescenceThicknessMap.channel),sheenColorMapUv:mt&&_(b.sheenColorMap.channel),sheenRoughnessMapUv:Lt&&_(b.sheenRoughnessMap.channel),specularMapUv:It&&_(b.specularMap.channel),specularColorMapUv:yt&&_(b.specularColorMap.channel),specularIntensityMapUv:F&&_(b.specularIntensityMap.channel),transmissionMapUv:T&&_(b.transmissionMap.channel),thicknessMapUv:B&&_(b.thicknessMap.channel),alphaMapUv:ft&&_(b.alphaMap.channel),vertexTangents:!!j.attributes.tangent&&(Q||q),vertexColors:b.vertexColors,vertexAlphas:b.vertexColors===!0&&!!j.attributes.color&&j.attributes.color.itemSize===4,pointsUvs:W.isPoints===!0&&!!j.attributes.uv&&(Wt||ft),fog:!!Z,useFog:b.fog===!0,fogExp2:!!Z&&Z.isFogExp2,flatShading:b.flatShading===!0&&b.wireframe===!1,sizeAttenuation:b.sizeAttenuation===!0,logarithmicDepthBuffer:d,reversedDepthBuffer:At,skinning:W.isSkinnedMesh===!0,morphTargets:j.morphAttributes.position!==void 0,morphNormals:j.morphAttributes.normal!==void 0,morphColors:j.morphAttributes.color!==void 0,morphTargetsCount:wt,morphTextureStride:Et,numDirLights:v.directional.length,numPointLights:v.point.length,numSpotLights:v.spot.length,numSpotLightMaps:v.spotLightMap.length,numRectAreaLights:v.rectArea.length,numHemiLights:v.hemi.length,numDirLightShadows:v.directionalShadowMap.length,numPointLightShadows:v.pointShadowMap.length,numSpotLightShadows:v.spotShadowMap.length,numSpotLightShadowsWithMaps:v.numSpotLightShadowsWithMaps,numLightProbes:v.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:b.dithering,shadowMapEnabled:i.shadowMap.enabled&&L.length>0,shadowMapType:i.shadowMap.type,toneMapping:Ut,decodeVideoTexture:Wt&&b.map.isVideoTexture===!0&&te.getTransfer(b.map.colorSpace)===ne,decodeVideoTextureEmissive:ut&&b.emissiveMap.isVideoTexture===!0&&te.getTransfer(b.emissiveMap.colorSpace)===ne,premultipliedAlpha:b.premultipliedAlpha,doubleSided:b.side===ke,flipSided:b.side===Ce,useDepthPacking:b.depthPacking>=0,depthPacking:b.depthPacking||0,index0AttributeName:b.index0AttributeName,extensionClipCullDistance:Rt&&b.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Rt&&b.extensions.multiDraw===!0||Tt)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:b.customProgramCacheKey()};return Jt.vertexUv1s=l.has(1),Jt.vertexUv2s=l.has(2),Jt.vertexUv3s=l.has(3),l.clear(),Jt}function p(b){let v=[];if(b.shaderID?v.push(b.shaderID):(v.push(b.customVertexShaderID),v.push(b.customFragmentShaderID)),b.defines!==void 0)for(let L in b.defines)v.push(L),v.push(b.defines[L]);return b.isRawShaderMaterial===!1&&(E(v,b),M(v,b),v.push(i.outputColorSpace)),v.push(b.customProgramCacheKey),v.join()}function E(b,v){b.push(v.precision),b.push(v.outputColorSpace),b.push(v.envMapMode),b.push(v.envMapCubeUVHeight),b.push(v.mapUv),b.push(v.alphaMapUv),b.push(v.lightMapUv),b.push(v.aoMapUv),b.push(v.bumpMapUv),b.push(v.normalMapUv),b.push(v.displacementMapUv),b.push(v.emissiveMapUv),b.push(v.metalnessMapUv),b.push(v.roughnessMapUv),b.push(v.anisotropyMapUv),b.push(v.clearcoatMapUv),b.push(v.clearcoatNormalMapUv),b.push(v.clearcoatRoughnessMapUv),b.push(v.iridescenceMapUv),b.push(v.iridescenceThicknessMapUv),b.push(v.sheenColorMapUv),b.push(v.sheenRoughnessMapUv),b.push(v.specularMapUv),b.push(v.specularColorMapUv),b.push(v.specularIntensityMapUv),b.push(v.transmissionMapUv),b.push(v.thicknessMapUv),b.push(v.combine),b.push(v.fogExp2),b.push(v.sizeAttenuation),b.push(v.morphTargetsCount),b.push(v.morphAttributeCount),b.push(v.numDirLights),b.push(v.numPointLights),b.push(v.numSpotLights),b.push(v.numSpotLightMaps),b.push(v.numHemiLights),b.push(v.numRectAreaLights),b.push(v.numDirLightShadows),b.push(v.numPointLightShadows),b.push(v.numSpotLightShadows),b.push(v.numSpotLightShadowsWithMaps),b.push(v.numLightProbes),b.push(v.shadowMapType),b.push(v.toneMapping),b.push(v.numClippingPlanes),b.push(v.numClipIntersection),b.push(v.depthPacking)}function M(b,v){a.disableAll(),v.supportsVertexTextures&&a.enable(0),v.instancing&&a.enable(1),v.instancingColor&&a.enable(2),v.instancingMorph&&a.enable(3),v.matcap&&a.enable(4),v.envMap&&a.enable(5),v.normalMapObjectSpace&&a.enable(6),v.normalMapTangentSpace&&a.enable(7),v.clearcoat&&a.enable(8),v.iridescence&&a.enable(9),v.alphaTest&&a.enable(10),v.vertexColors&&a.enable(11),v.vertexAlphas&&a.enable(12),v.vertexUv1s&&a.enable(13),v.vertexUv2s&&a.enable(14),v.vertexUv3s&&a.enable(15),v.vertexTangents&&a.enable(16),v.anisotropy&&a.enable(17),v.alphaHash&&a.enable(18),v.batching&&a.enable(19),v.dispersion&&a.enable(20),v.batchingColor&&a.enable(21),v.gradientMap&&a.enable(22),b.push(a.mask),a.disableAll(),v.fog&&a.enable(0),v.useFog&&a.enable(1),v.flatShading&&a.enable(2),v.logarithmicDepthBuffer&&a.enable(3),v.reversedDepthBuffer&&a.enable(4),v.skinning&&a.enable(5),v.morphTargets&&a.enable(6),v.morphNormals&&a.enable(7),v.morphColors&&a.enable(8),v.premultipliedAlpha&&a.enable(9),v.shadowMapEnabled&&a.enable(10),v.doubleSided&&a.enable(11),v.flipSided&&a.enable(12),v.useDepthPacking&&a.enable(13),v.dithering&&a.enable(14),v.transmission&&a.enable(15),v.sheen&&a.enable(16),v.opaque&&a.enable(17),v.pointsUvs&&a.enable(18),v.decodeVideoTexture&&a.enable(19),v.decodeVideoTextureEmissive&&a.enable(20),v.alphaToCoverage&&a.enable(21),b.push(a.mask)}function y(b){let v=g[b.type],L;if(v){let O=Cn[v];L=un.clone(O.uniforms)}else L=b.uniforms;return L}function R(b,v){let L;for(let O=0,W=h.length;O<W;O++){let Z=h[O];if(Z.cacheKey===v){L=Z,++L.usedTimes;break}}return L===void 0&&(L=new U0(i,v,b,r),h.push(L)),L}function A(b){if(--b.usedTimes===0){let v=h.indexOf(b);h[v]=h[h.length-1],h.pop(),b.destroy()}}function P(b){c.remove(b)}function D(){c.dispose()}return{getParameters:m,getProgramCacheKey:p,getUniforms:y,acquireProgram:R,releaseProgram:A,releaseShaderCache:P,programs:h,dispose:D}}function O0(){let i=new WeakMap;function t(o){return i.has(o)}function e(o){let a=i.get(o);return a===void 0&&(a={},i.set(o,a)),a}function n(o){i.delete(o)}function s(o,a,c){i.get(o)[a]=c}function r(){i=new WeakMap}return{has:t,get:e,remove:n,update:s,dispose:r}}function B0(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.material.id!==t.material.id?i.material.id-t.material.id:i.z!==t.z?i.z-t.z:i.id-t.id}function Du(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.z!==t.z?t.z-i.z:i.id-t.id}function Lu(){let i=[],t=0,e=[],n=[],s=[];function r(){t=0,e.length=0,n.length=0,s.length=0}function o(d,f,u,g,_,m){let p=i[t];return p===void 0?(p={id:d.id,object:d,geometry:f,material:u,groupOrder:g,renderOrder:d.renderOrder,z:_,group:m},i[t]=p):(p.id=d.id,p.object=d,p.geometry=f,p.material=u,p.groupOrder=g,p.renderOrder=d.renderOrder,p.z=_,p.group=m),t++,p}function a(d,f,u,g,_,m){let p=o(d,f,u,g,_,m);u.transmission>0?n.push(p):u.transparent===!0?s.push(p):e.push(p)}function c(d,f,u,g,_,m){let p=o(d,f,u,g,_,m);u.transmission>0?n.unshift(p):u.transparent===!0?s.unshift(p):e.unshift(p)}function l(d,f){e.length>1&&e.sort(d||B0),n.length>1&&n.sort(f||Du),s.length>1&&s.sort(f||Du)}function h(){for(let d=t,f=i.length;d<f;d++){let u=i[d];if(u.id===null)break;u.id=null,u.object=null,u.geometry=null,u.material=null,u.group=null}}return{opaque:e,transmissive:n,transparent:s,init:r,push:a,unshift:c,finish:h,sort:l}}function z0(){let i=new WeakMap;function t(n,s){let r=i.get(n),o;return r===void 0?(o=new Lu,i.set(n,[o])):s>=r.length?(o=new Lu,r.push(o)):o=r[s],o}function e(){i=new WeakMap}return{get:t,dispose:e}}function k0(){let i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new C,color:new zt};break;case"SpotLight":e={position:new C,direction:new C,color:new zt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new C,color:new zt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new C,skyColor:new zt,groundColor:new zt};break;case"RectAreaLight":e={color:new zt,position:new C,halfWidth:new C,halfHeight:new C};break}return i[t.id]=e,e}}}function V0(){let i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new lt};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new lt};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new lt,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[t.id]=e,e}}}var H0=0;function G0(i,t){return(t.castShadow?2:0)-(i.castShadow?2:0)+(t.map?1:0)-(i.map?1:0)}function W0(i){let t=new k0,e=V0(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)n.probe.push(new C);let s=new C,r=new jt,o=new jt;function a(l){let h=0,d=0,f=0;for(let b=0;b<9;b++)n.probe[b].set(0,0,0);let u=0,g=0,_=0,m=0,p=0,E=0,M=0,y=0,R=0,A=0,P=0;l.sort(G0);for(let b=0,v=l.length;b<v;b++){let L=l[b],O=L.color,W=L.intensity,Z=L.distance,j=L.shadow&&L.shadow.map?L.shadow.map.texture:null;if(L.isAmbientLight)h+=O.r*W,d+=O.g*W,f+=O.b*W;else if(L.isLightProbe){for(let $=0;$<9;$++)n.probe[$].addScaledVector(L.sh.coefficients[$],W);P++}else if(L.isDirectionalLight){let $=t.get(L);if($.color.copy(L.color).multiplyScalar(L.intensity),L.castShadow){let dt=L.shadow,X=e.get(L);X.shadowIntensity=dt.intensity,X.shadowBias=dt.bias,X.shadowNormalBias=dt.normalBias,X.shadowRadius=dt.radius,X.shadowMapSize=dt.mapSize,n.directionalShadow[u]=X,n.directionalShadowMap[u]=j,n.directionalShadowMatrix[u]=L.shadow.matrix,E++}n.directional[u]=$,u++}else if(L.isSpotLight){let $=t.get(L);$.position.setFromMatrixPosition(L.matrixWorld),$.color.copy(O).multiplyScalar(W),$.distance=Z,$.coneCos=Math.cos(L.angle),$.penumbraCos=Math.cos(L.angle*(1-L.penumbra)),$.decay=L.decay,n.spot[_]=$;let dt=L.shadow;if(L.map&&(n.spotLightMap[R]=L.map,R++,dt.updateMatrices(L),L.castShadow&&A++),n.spotLightMatrix[_]=dt.matrix,L.castShadow){let X=e.get(L);X.shadowIntensity=dt.intensity,X.shadowBias=dt.bias,X.shadowNormalBias=dt.normalBias,X.shadowRadius=dt.radius,X.shadowMapSize=dt.mapSize,n.spotShadow[_]=X,n.spotShadowMap[_]=j,y++}_++}else if(L.isRectAreaLight){let $=t.get(L);$.color.copy(O).multiplyScalar(W),$.halfWidth.set(L.width*.5,0,0),$.halfHeight.set(0,L.height*.5,0),n.rectArea[m]=$,m++}else if(L.isPointLight){let $=t.get(L);if($.color.copy(L.color).multiplyScalar(L.intensity),$.distance=L.distance,$.decay=L.decay,L.castShadow){let dt=L.shadow,X=e.get(L);X.shadowIntensity=dt.intensity,X.shadowBias=dt.bias,X.shadowNormalBias=dt.normalBias,X.shadowRadius=dt.radius,X.shadowMapSize=dt.mapSize,X.shadowCameraNear=dt.camera.near,X.shadowCameraFar=dt.camera.far,n.pointShadow[g]=X,n.pointShadowMap[g]=j,n.pointShadowMatrix[g]=L.shadow.matrix,M++}n.point[g]=$,g++}else if(L.isHemisphereLight){let $=t.get(L);$.skyColor.copy(L.color).multiplyScalar(W),$.groundColor.copy(L.groundColor).multiplyScalar(W),n.hemi[p]=$,p++}}m>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=Ct.LTC_FLOAT_1,n.rectAreaLTC2=Ct.LTC_FLOAT_2):(n.rectAreaLTC1=Ct.LTC_HALF_1,n.rectAreaLTC2=Ct.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=d,n.ambient[2]=f;let D=n.hash;(D.directionalLength!==u||D.pointLength!==g||D.spotLength!==_||D.rectAreaLength!==m||D.hemiLength!==p||D.numDirectionalShadows!==E||D.numPointShadows!==M||D.numSpotShadows!==y||D.numSpotMaps!==R||D.numLightProbes!==P)&&(n.directional.length=u,n.spot.length=_,n.rectArea.length=m,n.point.length=g,n.hemi.length=p,n.directionalShadow.length=E,n.directionalShadowMap.length=E,n.pointShadow.length=M,n.pointShadowMap.length=M,n.spotShadow.length=y,n.spotShadowMap.length=y,n.directionalShadowMatrix.length=E,n.pointShadowMatrix.length=M,n.spotLightMatrix.length=y+R-A,n.spotLightMap.length=R,n.numSpotLightShadowsWithMaps=A,n.numLightProbes=P,D.directionalLength=u,D.pointLength=g,D.spotLength=_,D.rectAreaLength=m,D.hemiLength=p,D.numDirectionalShadows=E,D.numPointShadows=M,D.numSpotShadows=y,D.numSpotMaps=R,D.numLightProbes=P,n.version=H0++)}function c(l,h){let d=0,f=0,u=0,g=0,_=0,m=h.matrixWorldInverse;for(let p=0,E=l.length;p<E;p++){let M=l[p];if(M.isDirectionalLight){let y=n.directional[d];y.direction.setFromMatrixPosition(M.matrixWorld),s.setFromMatrixPosition(M.target.matrixWorld),y.direction.sub(s),y.direction.transformDirection(m),d++}else if(M.isSpotLight){let y=n.spot[u];y.position.setFromMatrixPosition(M.matrixWorld),y.position.applyMatrix4(m),y.direction.setFromMatrixPosition(M.matrixWorld),s.setFromMatrixPosition(M.target.matrixWorld),y.direction.sub(s),y.direction.transformDirection(m),u++}else if(M.isRectAreaLight){let y=n.rectArea[g];y.position.setFromMatrixPosition(M.matrixWorld),y.position.applyMatrix4(m),o.identity(),r.copy(M.matrixWorld),r.premultiply(m),o.extractRotation(r),y.halfWidth.set(M.width*.5,0,0),y.halfHeight.set(0,M.height*.5,0),y.halfWidth.applyMatrix4(o),y.halfHeight.applyMatrix4(o),g++}else if(M.isPointLight){let y=n.point[f];y.position.setFromMatrixPosition(M.matrixWorld),y.position.applyMatrix4(m),f++}else if(M.isHemisphereLight){let y=n.hemi[_];y.direction.setFromMatrixPosition(M.matrixWorld),y.direction.transformDirection(m),_++}}}return{setup:a,setupView:c,state:n}}function Uu(i){let t=new W0(i),e=[],n=[];function s(h){l.camera=h,e.length=0,n.length=0}function r(h){e.push(h)}function o(h){n.push(h)}function a(){t.setup(e)}function c(h){t.setupView(e,h)}let l={lightsArray:e,shadowsArray:n,camera:null,lights:t,transmissionRenderTarget:{}};return{init:s,state:l,setupLights:a,setupLightsView:c,pushLight:r,pushShadow:o}}function X0(i){let t=new WeakMap;function e(s,r=0){let o=t.get(s),a;return o===void 0?(a=new Uu(i),t.set(s,[a])):r>=o.length?(a=new Uu(i),o.push(a)):a=o[r],a}function n(){t=new WeakMap}return{get:e,dispose:n}}var q0=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Y0=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function Z0(i,t,e){let n=new Ki,s=new lt,r=new lt,o=new se,a=new wo({depthPacking:Jh}),c=new Ao,l={},h=e.maxTextureSize,d={[Fn]:Ce,[Ce]:Fn,[ke]:ke},f=new xe({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new lt},radius:{value:4}},vertexShader:q0,fragmentShader:Y0}),u=f.clone();u.defines.HORIZONTAL_PASS=1;let g=new oe;g.setAttribute("position",new De(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let _=new ie(g,f),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=tc;let p=this.type;this.render=function(A,P,D){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||A.length===0)return;let b=i.getRenderTarget(),v=i.getActiveCubeFace(),L=i.getActiveMipmapLevel(),O=i.state;O.setBlending(ye),O.buffers.depth.getReversed()===!0?O.buffers.color.setClear(0,0,0,0):O.buffers.color.setClear(1,1,1,1),O.buffers.depth.setTest(!0),O.setScissorTest(!1);let W=p!==An&&this.type===An,Z=p===An&&this.type!==An;for(let j=0,$=A.length;j<$;j++){let dt=A[j],X=dt.shadow;if(X===void 0){console.warn("THREE.WebGLShadowMap:",dt,"has no shadow.");continue}if(X.autoUpdate===!1&&X.needsUpdate===!1)continue;s.copy(X.mapSize);let pt=X.getFrameExtents();if(s.multiply(pt),r.copy(X.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/pt.x),s.x=r.x*pt.x,X.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/pt.y),s.y=r.y*pt.y,X.mapSize.y=r.y)),X.map===null||W===!0||Z===!0){let wt=this.type!==An?{minFilter:Re,magFilter:Re}:{};X.map!==null&&X.map.dispose(),X.map=new ze(s.x,s.y,wt),X.map.texture.name=dt.name+".shadowMap",X.camera.updateProjectionMatrix()}i.setRenderTarget(X.map),i.clear();let St=X.getViewportCount();for(let wt=0;wt<St;wt++){let Et=X.getViewport(wt);o.set(r.x*Et.x,r.y*Et.y,r.x*Et.z,r.y*Et.w),O.viewport(o),X.updateMatrices(dt,wt),n=X.getFrustum(),y(P,D,X.camera,dt,this.type)}X.isPointLightShadow!==!0&&this.type===An&&E(X,D),X.needsUpdate=!1}p=this.type,m.needsUpdate=!1,i.setRenderTarget(b,v,L)};function E(A,P){let D=t.update(_);f.defines.VSM_SAMPLES!==A.blurSamples&&(f.defines.VSM_SAMPLES=A.blurSamples,u.defines.VSM_SAMPLES=A.blurSamples,f.needsUpdate=!0,u.needsUpdate=!0),A.mapPass===null&&(A.mapPass=new ze(s.x,s.y)),f.uniforms.shadow_pass.value=A.map.texture,f.uniforms.resolution.value=A.mapSize,f.uniforms.radius.value=A.radius,i.setRenderTarget(A.mapPass),i.clear(),i.renderBufferDirect(P,null,D,f,_,null),u.uniforms.shadow_pass.value=A.mapPass.texture,u.uniforms.resolution.value=A.mapSize,u.uniforms.radius.value=A.radius,i.setRenderTarget(A.map),i.clear(),i.renderBufferDirect(P,null,D,u,_,null)}function M(A,P,D,b){let v=null,L=D.isPointLight===!0?A.customDistanceMaterial:A.customDepthMaterial;if(L!==void 0)v=L;else if(v=D.isPointLight===!0?c:a,i.localClippingEnabled&&P.clipShadows===!0&&Array.isArray(P.clippingPlanes)&&P.clippingPlanes.length!==0||P.displacementMap&&P.displacementScale!==0||P.alphaMap&&P.alphaTest>0||P.map&&P.alphaTest>0||P.alphaToCoverage===!0){let O=v.uuid,W=P.uuid,Z=l[O];Z===void 0&&(Z={},l[O]=Z);let j=Z[W];j===void 0&&(j=v.clone(),Z[W]=j,P.addEventListener("dispose",R)),v=j}if(v.visible=P.visible,v.wireframe=P.wireframe,b===An?v.side=P.shadowSide!==null?P.shadowSide:P.side:v.side=P.shadowSide!==null?P.shadowSide:d[P.side],v.alphaMap=P.alphaMap,v.alphaTest=P.alphaToCoverage===!0?.5:P.alphaTest,v.map=P.map,v.clipShadows=P.clipShadows,v.clippingPlanes=P.clippingPlanes,v.clipIntersection=P.clipIntersection,v.displacementMap=P.displacementMap,v.displacementScale=P.displacementScale,v.displacementBias=P.displacementBias,v.wireframeLinewidth=P.wireframeLinewidth,v.linewidth=P.linewidth,D.isPointLight===!0&&v.isMeshDistanceMaterial===!0){let O=i.properties.get(v);O.light=D}return v}function y(A,P,D,b,v){if(A.visible===!1)return;if(A.layers.test(P.layers)&&(A.isMesh||A.isLine||A.isPoints)&&(A.castShadow||A.receiveShadow&&v===An)&&(!A.frustumCulled||n.intersectsObject(A))){A.modelViewMatrix.multiplyMatrices(D.matrixWorldInverse,A.matrixWorld);let W=t.update(A),Z=A.material;if(Array.isArray(Z)){let j=W.groups;for(let $=0,dt=j.length;$<dt;$++){let X=j[$],pt=Z[X.materialIndex];if(pt&&pt.visible){let St=M(A,pt,b,v);A.onBeforeShadow(i,A,P,D,W,St,X),i.renderBufferDirect(D,null,W,St,A,X),A.onAfterShadow(i,A,P,D,W,St,X)}}}else if(Z.visible){let j=M(A,Z,b,v);A.onBeforeShadow(i,A,P,D,W,j,null),i.renderBufferDirect(D,null,W,j,A,null),A.onAfterShadow(i,A,P,D,W,j,null)}}let O=A.children;for(let W=0,Z=O.length;W<Z;W++)y(O[W],P,D,b,v)}function R(A){A.target.removeEventListener("dispose",R);for(let D in l){let b=l[D],v=A.target.uuid;v in b&&(b[v].dispose(),delete b[v])}}}var J0={[ko]:Vo,[Ho]:Xo,[Go]:qo,[hi]:Wo,[Vo]:ko,[Xo]:Ho,[qo]:Go,[Wo]:hi};function $0(i,t){function e(){let T=!1,B=new se,J=null,ft=new se(0,0,0,0);return{setMask:function(rt){J!==rt&&!T&&(i.colorMask(rt,rt,rt,rt),J=rt)},setLocked:function(rt){T=rt},setClear:function(rt,nt,Rt,Ut,Jt){Jt===!0&&(rt*=Ut,nt*=Ut,Rt*=Ut),B.set(rt,nt,Rt,Ut),ft.equals(B)===!1&&(i.clearColor(rt,nt,Rt,Ut),ft.copy(B))},reset:function(){T=!1,J=null,ft.set(-1,0,0,0)}}}function n(){let T=!1,B=!1,J=null,ft=null,rt=null;return{setReversed:function(nt){if(B!==nt){let Rt=t.get("EXT_clip_control");nt?Rt.clipControlEXT(Rt.LOWER_LEFT_EXT,Rt.ZERO_TO_ONE_EXT):Rt.clipControlEXT(Rt.LOWER_LEFT_EXT,Rt.NEGATIVE_ONE_TO_ONE_EXT),B=nt;let Ut=rt;rt=null,this.setClear(Ut)}},getReversed:function(){return B},setTest:function(nt){nt?ot(i.DEPTH_TEST):At(i.DEPTH_TEST)},setMask:function(nt){J!==nt&&!T&&(i.depthMask(nt),J=nt)},setFunc:function(nt){if(B&&(nt=J0[nt]),ft!==nt){switch(nt){case ko:i.depthFunc(i.NEVER);break;case Vo:i.depthFunc(i.ALWAYS);break;case Ho:i.depthFunc(i.LESS);break;case hi:i.depthFunc(i.LEQUAL);break;case Go:i.depthFunc(i.EQUAL);break;case Wo:i.depthFunc(i.GEQUAL);break;case Xo:i.depthFunc(i.GREATER);break;case qo:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}ft=nt}},setLocked:function(nt){T=nt},setClear:function(nt){rt!==nt&&(B&&(nt=1-nt),i.clearDepth(nt),rt=nt)},reset:function(){T=!1,J=null,ft=null,rt=null,B=!1}}}function s(){let T=!1,B=null,J=null,ft=null,rt=null,nt=null,Rt=null,Ut=null,Jt=null;return{setTest:function(qt){T||(qt?ot(i.STENCIL_TEST):At(i.STENCIL_TEST))},setMask:function(qt){B!==qt&&!T&&(i.stencilMask(qt),B=qt)},setFunc:function(qt,_e,we){(J!==qt||ft!==_e||rt!==we)&&(i.stencilFunc(qt,_e,we),J=qt,ft=_e,rt=we)},setOp:function(qt,_e,we){(nt!==qt||Rt!==_e||Ut!==we)&&(i.stencilOp(qt,_e,we),nt=qt,Rt=_e,Ut=we)},setLocked:function(qt){T=qt},setClear:function(qt){Jt!==qt&&(i.clearStencil(qt),Jt=qt)},reset:function(){T=!1,B=null,J=null,ft=null,rt=null,nt=null,Rt=null,Ut=null,Jt=null}}}let r=new e,o=new n,a=new s,c=new WeakMap,l=new WeakMap,h={},d={},f=new WeakMap,u=[],g=null,_=!1,m=null,p=null,E=null,M=null,y=null,R=null,A=null,P=new zt(0,0,0),D=0,b=!1,v=null,L=null,O=null,W=null,Z=null,j=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS),$=!1,dt=0,X=i.getParameter(i.VERSION);X.indexOf("WebGL")!==-1?(dt=parseFloat(/^WebGL (\d)/.exec(X)[1]),$=dt>=1):X.indexOf("OpenGL ES")!==-1&&(dt=parseFloat(/^OpenGL ES (\d)/.exec(X)[1]),$=dt>=2);let pt=null,St={},wt=i.getParameter(i.SCISSOR_BOX),Et=i.getParameter(i.VIEWPORT),Ot=new se().fromArray(wt),Gt=new se().fromArray(Et);function Ft(T,B,J,ft){let rt=new Uint8Array(4),nt=i.createTexture();i.bindTexture(T,nt),i.texParameteri(T,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(T,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let Rt=0;Rt<J;Rt++)T===i.TEXTURE_3D||T===i.TEXTURE_2D_ARRAY?i.texImage3D(B,0,i.RGBA,1,1,ft,0,i.RGBA,i.UNSIGNED_BYTE,rt):i.texImage2D(B+Rt,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,rt);return nt}let tt={};tt[i.TEXTURE_2D]=Ft(i.TEXTURE_2D,i.TEXTURE_2D,1),tt[i.TEXTURE_CUBE_MAP]=Ft(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),tt[i.TEXTURE_2D_ARRAY]=Ft(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),tt[i.TEXTURE_3D]=Ft(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),o.setClear(1),a.setClear(0),ot(i.DEPTH_TEST),o.setFunc(hi),et(!1),Q(Ql),ot(i.CULL_FACE),ct(ye);function ot(T){h[T]!==!0&&(i.enable(T),h[T]=!0)}function At(T){h[T]!==!1&&(i.disable(T),h[T]=!1)}function bt(T,B){return d[T]!==B?(i.bindFramebuffer(T,B),d[T]=B,T===i.DRAW_FRAMEBUFFER&&(d[i.FRAMEBUFFER]=B),T===i.FRAMEBUFFER&&(d[i.DRAW_FRAMEBUFFER]=B),!0):!1}function Tt(T,B){let J=u,ft=!1;if(T){J=f.get(B),J===void 0&&(J=[],f.set(B,J));let rt=T.textures;if(J.length!==rt.length||J[0]!==i.COLOR_ATTACHMENT0){for(let nt=0,Rt=rt.length;nt<Rt;nt++)J[nt]=i.COLOR_ATTACHMENT0+nt;J.length=rt.length,ft=!0}}else J[0]!==i.BACK&&(J[0]=i.BACK,ft=!0);ft&&i.drawBuffers(J)}function Wt(T){return g!==T?(i.useProgram(T),g=T,!0):!1}let Kt={[Je]:i.FUNC_ADD,[Ih]:i.FUNC_SUBTRACT,[Dh]:i.FUNC_REVERSE_SUBTRACT};Kt[Lh]=i.MIN,Kt[Uh]=i.MAX;let U={[_i]:i.ZERO,[Nh]:i.ONE,[Fh]:i.SRC_COLOR,[ro]:i.SRC_ALPHA,[kh]:i.SRC_ALPHA_SATURATE,[ur]:i.DST_COLOR,[hr]:i.DST_ALPHA,[Oh]:i.ONE_MINUS_SRC_COLOR,[oo]:i.ONE_MINUS_SRC_ALPHA,[zh]:i.ONE_MINUS_DST_COLOR,[Bh]:i.ONE_MINUS_DST_ALPHA,[Vh]:i.CONSTANT_COLOR,[Hh]:i.ONE_MINUS_CONSTANT_COLOR,[Gh]:i.CONSTANT_ALPHA,[Wh]:i.ONE_MINUS_CONSTANT_ALPHA};function ct(T,B,J,ft,rt,nt,Rt,Ut,Jt,qt){if(T===ye){_===!0&&(At(i.BLEND),_=!1);return}if(_===!1&&(ot(i.BLEND),_=!0),T!==zo){if(T!==m||qt!==b){if((p!==Je||y!==Je)&&(i.blendEquation(i.FUNC_ADD),p=Je,y=Je),qt)switch(T){case ci:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case ec:i.blendFunc(i.ONE,i.ONE);break;case nc:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case ic:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:console.error("THREE.WebGLState: Invalid blending: ",T);break}else switch(T){case ci:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case ec:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case nc:console.error("THREE.WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case ic:console.error("THREE.WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:console.error("THREE.WebGLState: Invalid blending: ",T);break}E=null,M=null,R=null,A=null,P.set(0,0,0),D=0,m=T,b=qt}return}rt=rt||B,nt=nt||J,Rt=Rt||ft,(B!==p||rt!==y)&&(i.blendEquationSeparate(Kt[B],Kt[rt]),p=B,y=rt),(J!==E||ft!==M||nt!==R||Rt!==A)&&(i.blendFuncSeparate(U[J],U[ft],U[nt],U[Rt]),E=J,M=ft,R=nt,A=Rt),(Ut.equals(P)===!1||Jt!==D)&&(i.blendColor(Ut.r,Ut.g,Ut.b,Jt),P.copy(Ut),D=Jt),m=T,b=!1}function it(T,B){T.side===ke?At(i.CULL_FACE):ot(i.CULL_FACE);let J=T.side===Ce;B&&(J=!J),et(J),T.blending===ci&&T.transparent===!1?ct(ye):ct(T.blending,T.blendEquation,T.blendSrc,T.blendDst,T.blendEquationAlpha,T.blendSrcAlpha,T.blendDstAlpha,T.blendColor,T.blendAlpha,T.premultipliedAlpha),o.setFunc(T.depthFunc),o.setTest(T.depthTest),o.setMask(T.depthWrite),r.setMask(T.colorWrite);let ft=T.stencilWrite;a.setTest(ft),ft&&(a.setMask(T.stencilWriteMask),a.setFunc(T.stencilFunc,T.stencilRef,T.stencilFuncMask),a.setOp(T.stencilFail,T.stencilZFail,T.stencilZPass)),ut(T.polygonOffset,T.polygonOffsetFactor,T.polygonOffsetUnits),T.alphaToCoverage===!0?ot(i.SAMPLE_ALPHA_TO_COVERAGE):At(i.SAMPLE_ALPHA_TO_COVERAGE)}function et(T){v!==T&&(T?i.frontFace(i.CW):i.frontFace(i.CCW),v=T)}function Q(T){T!==Rh?(ot(i.CULL_FACE),T!==L&&(T===Ql?i.cullFace(i.BACK):T===Ch?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):At(i.CULL_FACE),L=T}function xt(T){T!==O&&($&&i.lineWidth(T),O=T)}function ut(T,B,J){T?(ot(i.POLYGON_OFFSET_FILL),(W!==B||Z!==J)&&(i.polygonOffset(B,J),W=B,Z=J)):At(i.POLYGON_OFFSET_FILL)}function gt(T){T?ot(i.SCISSOR_TEST):At(i.SCISSOR_TEST)}function z(T){T===void 0&&(T=i.TEXTURE0+j-1),pt!==T&&(i.activeTexture(T),pt=T)}function q(T,B,J){J===void 0&&(pt===null?J=i.TEXTURE0+j-1:J=pt);let ft=St[J];ft===void 0&&(ft={type:void 0,texture:void 0},St[J]=ft),(ft.type!==T||ft.texture!==B)&&(pt!==J&&(i.activeTexture(J),pt=J),i.bindTexture(T,B||tt[T]),ft.type=T,ft.texture=B)}function S(){let T=St[pt];T!==void 0&&T.type!==void 0&&(i.bindTexture(T.type,null),T.type=void 0,T.texture=void 0)}function x(){try{i.compressedTexImage2D(...arguments)}catch(T){console.error("THREE.WebGLState:",T)}}function I(){try{i.compressedTexImage3D(...arguments)}catch(T){console.error("THREE.WebGLState:",T)}}function N(){try{i.texSubImage2D(...arguments)}catch(T){console.error("THREE.WebGLState:",T)}}function V(){try{i.texSubImage3D(...arguments)}catch(T){console.error("THREE.WebGLState:",T)}}function k(){try{i.compressedTexSubImage2D(...arguments)}catch(T){console.error("THREE.WebGLState:",T)}}function ht(){try{i.compressedTexSubImage3D(...arguments)}catch(T){console.error("THREE.WebGLState:",T)}}function at(){try{i.texStorage2D(...arguments)}catch(T){console.error("THREE.WebGLState:",T)}}function vt(){try{i.texStorage3D(...arguments)}catch(T){console.error("THREE.WebGLState:",T)}}function Mt(){try{i.texImage2D(...arguments)}catch(T){console.error("THREE.WebGLState:",T)}}function st(){try{i.texImage3D(...arguments)}catch(T){console.error("THREE.WebGLState:",T)}}function mt(T){Ot.equals(T)===!1&&(i.scissor(T.x,T.y,T.z,T.w),Ot.copy(T))}function Lt(T){Gt.equals(T)===!1&&(i.viewport(T.x,T.y,T.z,T.w),Gt.copy(T))}function It(T,B){let J=l.get(B);J===void 0&&(J=new WeakMap,l.set(B,J));let ft=J.get(T);ft===void 0&&(ft=i.getUniformBlockIndex(B,T.name),J.set(T,ft))}function yt(T,B){let ft=l.get(B).get(T);c.get(B)!==ft&&(i.uniformBlockBinding(B,ft,T.__bindingPointIndex),c.set(B,ft))}function F(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),o.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),h={},pt=null,St={},d={},f=new WeakMap,u=[],g=null,_=!1,m=null,p=null,E=null,M=null,y=null,R=null,A=null,P=new zt(0,0,0),D=0,b=!1,v=null,L=null,O=null,W=null,Z=null,Ot.set(0,0,i.canvas.width,i.canvas.height),Gt.set(0,0,i.canvas.width,i.canvas.height),r.reset(),o.reset(),a.reset()}return{buffers:{color:r,depth:o,stencil:a},enable:ot,disable:At,bindFramebuffer:bt,drawBuffers:Tt,useProgram:Wt,setBlending:ct,setMaterial:it,setFlipSided:et,setCullFace:Q,setLineWidth:xt,setPolygonOffset:ut,setScissorTest:gt,activeTexture:z,bindTexture:q,unbindTexture:S,compressedTexImage2D:x,compressedTexImage3D:I,texImage2D:Mt,texImage3D:st,updateUBOMapping:It,uniformBlockBinding:yt,texStorage2D:at,texStorage3D:vt,texSubImage2D:N,texSubImage3D:V,compressedTexSubImage2D:k,compressedTexSubImage3D:ht,scissor:mt,viewport:Lt,reset:F}}function K0(i,t,e,n,s,r,o){let a=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new lt,h=new WeakMap,d,f=new WeakMap,u=!1;try{u=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(S,x){return u?new OffscreenCanvas(S,x):Xi("canvas")}function _(S,x,I){let N=1,V=q(S);if((V.width>I||V.height>I)&&(N=I/Math.max(V.width,V.height)),N<1)if(typeof HTMLImageElement<"u"&&S instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&S instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&S instanceof ImageBitmap||typeof VideoFrame<"u"&&S instanceof VideoFrame){let k=Math.floor(N*V.width),ht=Math.floor(N*V.height);d===void 0&&(d=g(k,ht));let at=x?g(k,ht):d;return at.width=k,at.height=ht,at.getContext("2d").drawImage(S,0,0,k,ht),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+V.width+"x"+V.height+") to ("+k+"x"+ht+")."),at}else return"data"in S&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+V.width+"x"+V.height+")."),S;return S}function m(S){return S.generateMipmaps}function p(S){i.generateMipmap(S)}function E(S){return S.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:S.isWebGL3DRenderTarget?i.TEXTURE_3D:S.isWebGLArrayRenderTarget||S.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function M(S,x,I,N,V=!1){if(S!==null){if(i[S]!==void 0)return i[S];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+S+"'")}let k=x;if(x===i.RED&&(I===i.FLOAT&&(k=i.R32F),I===i.HALF_FLOAT&&(k=i.R16F),I===i.UNSIGNED_BYTE&&(k=i.R8)),x===i.RED_INTEGER&&(I===i.UNSIGNED_BYTE&&(k=i.R8UI),I===i.UNSIGNED_SHORT&&(k=i.R16UI),I===i.UNSIGNED_INT&&(k=i.R32UI),I===i.BYTE&&(k=i.R8I),I===i.SHORT&&(k=i.R16I),I===i.INT&&(k=i.R32I)),x===i.RG&&(I===i.FLOAT&&(k=i.RG32F),I===i.HALF_FLOAT&&(k=i.RG16F),I===i.UNSIGNED_BYTE&&(k=i.RG8)),x===i.RG_INTEGER&&(I===i.UNSIGNED_BYTE&&(k=i.RG8UI),I===i.UNSIGNED_SHORT&&(k=i.RG16UI),I===i.UNSIGNED_INT&&(k=i.RG32UI),I===i.BYTE&&(k=i.RG8I),I===i.SHORT&&(k=i.RG16I),I===i.INT&&(k=i.RG32I)),x===i.RGB_INTEGER&&(I===i.UNSIGNED_BYTE&&(k=i.RGB8UI),I===i.UNSIGNED_SHORT&&(k=i.RGB16UI),I===i.UNSIGNED_INT&&(k=i.RGB32UI),I===i.BYTE&&(k=i.RGB8I),I===i.SHORT&&(k=i.RGB16I),I===i.INT&&(k=i.RGB32I)),x===i.RGBA_INTEGER&&(I===i.UNSIGNED_BYTE&&(k=i.RGBA8UI),I===i.UNSIGNED_SHORT&&(k=i.RGBA16UI),I===i.UNSIGNED_INT&&(k=i.RGBA32UI),I===i.BYTE&&(k=i.RGBA8I),I===i.SHORT&&(k=i.RGBA16I),I===i.INT&&(k=i.RGBA32I)),x===i.RGB&&(I===i.UNSIGNED_INT_5_9_9_9_REV&&(k=i.RGB9_E5),I===i.UNSIGNED_INT_10F_11F_11F_REV&&(k=i.R11F_G11F_B10F)),x===i.RGBA){let ht=V?Is:te.getTransfer(N);I===i.FLOAT&&(k=i.RGBA32F),I===i.HALF_FLOAT&&(k=i.RGBA16F),I===i.UNSIGNED_BYTE&&(k=ht===ne?i.SRGB8_ALPHA8:i.RGBA8),I===i.UNSIGNED_SHORT_4_4_4_4&&(k=i.RGBA4),I===i.UNSIGNED_SHORT_5_5_5_1&&(k=i.RGB5_A1)}return(k===i.R16F||k===i.R32F||k===i.RG16F||k===i.RG32F||k===i.RGBA16F||k===i.RGBA32F)&&t.get("EXT_color_buffer_float"),k}function y(S,x){let I;return S?x===null||x===Qn||x===ti?I=i.DEPTH24_STENCIL8:x===xn?I=i.DEPTH32F_STENCIL8:x===as&&(I=i.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):x===null||x===Qn||x===ti?I=i.DEPTH_COMPONENT24:x===xn?I=i.DEPTH_COMPONENT32F:x===as&&(I=i.DEPTH_COMPONENT16),I}function R(S,x){return m(S)===!0||S.isFramebufferTexture&&S.minFilter!==Re&&S.minFilter!==$e?Math.log2(Math.max(x.width,x.height))+1:S.mipmaps!==void 0&&S.mipmaps.length>0?S.mipmaps.length:S.isCompressedTexture&&Array.isArray(S.image)?x.mipmaps.length:1}function A(S){let x=S.target;x.removeEventListener("dispose",A),D(x),x.isVideoTexture&&h.delete(x)}function P(S){let x=S.target;x.removeEventListener("dispose",P),v(x)}function D(S){let x=n.get(S);if(x.__webglInit===void 0)return;let I=S.source,N=f.get(I);if(N){let V=N[x.__cacheKey];V.usedTimes--,V.usedTimes===0&&b(S),Object.keys(N).length===0&&f.delete(I)}n.remove(S)}function b(S){let x=n.get(S);i.deleteTexture(x.__webglTexture);let I=S.source,N=f.get(I);delete N[x.__cacheKey],o.memory.textures--}function v(S){let x=n.get(S);if(S.depthTexture&&(S.depthTexture.dispose(),n.remove(S.depthTexture)),S.isWebGLCubeRenderTarget)for(let N=0;N<6;N++){if(Array.isArray(x.__webglFramebuffer[N]))for(let V=0;V<x.__webglFramebuffer[N].length;V++)i.deleteFramebuffer(x.__webglFramebuffer[N][V]);else i.deleteFramebuffer(x.__webglFramebuffer[N]);x.__webglDepthbuffer&&i.deleteRenderbuffer(x.__webglDepthbuffer[N])}else{if(Array.isArray(x.__webglFramebuffer))for(let N=0;N<x.__webglFramebuffer.length;N++)i.deleteFramebuffer(x.__webglFramebuffer[N]);else i.deleteFramebuffer(x.__webglFramebuffer);if(x.__webglDepthbuffer&&i.deleteRenderbuffer(x.__webglDepthbuffer),x.__webglMultisampledFramebuffer&&i.deleteFramebuffer(x.__webglMultisampledFramebuffer),x.__webglColorRenderbuffer)for(let N=0;N<x.__webglColorRenderbuffer.length;N++)x.__webglColorRenderbuffer[N]&&i.deleteRenderbuffer(x.__webglColorRenderbuffer[N]);x.__webglDepthRenderbuffer&&i.deleteRenderbuffer(x.__webglDepthRenderbuffer)}let I=S.textures;for(let N=0,V=I.length;N<V;N++){let k=n.get(I[N]);k.__webglTexture&&(i.deleteTexture(k.__webglTexture),o.memory.textures--),n.remove(I[N])}n.remove(S)}let L=0;function O(){L=0}function W(){let S=L;return S>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+S+" texture units while this GPU supports only "+s.maxTextures),L+=1,S}function Z(S){let x=[];return x.push(S.wrapS),x.push(S.wrapT),x.push(S.wrapR||0),x.push(S.magFilter),x.push(S.minFilter),x.push(S.anisotropy),x.push(S.internalFormat),x.push(S.format),x.push(S.type),x.push(S.generateMipmaps),x.push(S.premultiplyAlpha),x.push(S.flipY),x.push(S.unpackAlignment),x.push(S.colorSpace),x.join()}function j(S,x){let I=n.get(S);if(S.isVideoTexture&&gt(S),S.isRenderTargetTexture===!1&&S.isExternalTexture!==!0&&S.version>0&&I.__version!==S.version){let N=S.image;if(N===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(N.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{tt(I,S,x);return}}else S.isExternalTexture&&(I.__webglTexture=S.sourceTexture?S.sourceTexture:null);e.bindTexture(i.TEXTURE_2D,I.__webglTexture,i.TEXTURE0+x)}function $(S,x){let I=n.get(S);if(S.isRenderTargetTexture===!1&&S.version>0&&I.__version!==S.version){tt(I,S,x);return}e.bindTexture(i.TEXTURE_2D_ARRAY,I.__webglTexture,i.TEXTURE0+x)}function dt(S,x){let I=n.get(S);if(S.isRenderTargetTexture===!1&&S.version>0&&I.__version!==S.version){tt(I,S,x);return}e.bindTexture(i.TEXTURE_3D,I.__webglTexture,i.TEXTURE0+x)}function X(S,x){let I=n.get(S);if(S.version>0&&I.__version!==S.version){ot(I,S,x);return}e.bindTexture(i.TEXTURE_CUBE_MAP,I.__webglTexture,i.TEXTURE0+x)}let pt={[He]:i.REPEAT,[Zn]:i.CLAMP_TO_EDGE,[ao]:i.MIRRORED_REPEAT},St={[Re]:i.NEAREST,[Yh]:i.NEAREST_MIPMAP_NEAREST,[fr]:i.NEAREST_MIPMAP_LINEAR,[$e]:i.LINEAR,[na]:i.LINEAR_MIPMAP_NEAREST,[Rn]:i.LINEAR_MIPMAP_LINEAR},wt={[Kh]:i.NEVER,[iu]:i.ALWAYS,[jh]:i.LESS,[dc]:i.LEQUAL,[Qh]:i.EQUAL,[nu]:i.GEQUAL,[tu]:i.GREATER,[eu]:i.NOTEQUAL};function Et(S,x){if(x.type===xn&&t.has("OES_texture_float_linear")===!1&&(x.magFilter===$e||x.magFilter===na||x.magFilter===fr||x.magFilter===Rn||x.minFilter===$e||x.minFilter===na||x.minFilter===fr||x.minFilter===Rn)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(S,i.TEXTURE_WRAP_S,pt[x.wrapS]),i.texParameteri(S,i.TEXTURE_WRAP_T,pt[x.wrapT]),(S===i.TEXTURE_3D||S===i.TEXTURE_2D_ARRAY)&&i.texParameteri(S,i.TEXTURE_WRAP_R,pt[x.wrapR]),i.texParameteri(S,i.TEXTURE_MAG_FILTER,St[x.magFilter]),i.texParameteri(S,i.TEXTURE_MIN_FILTER,St[x.minFilter]),x.compareFunction&&(i.texParameteri(S,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(S,i.TEXTURE_COMPARE_FUNC,wt[x.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(x.magFilter===Re||x.minFilter!==fr&&x.minFilter!==Rn||x.type===xn&&t.has("OES_texture_float_linear")===!1)return;if(x.anisotropy>1||n.get(x).__currentAnisotropy){let I=t.get("EXT_texture_filter_anisotropic");i.texParameterf(S,I.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(x.anisotropy,s.getMaxAnisotropy())),n.get(x).__currentAnisotropy=x.anisotropy}}}function Ot(S,x){let I=!1;S.__webglInit===void 0&&(S.__webglInit=!0,x.addEventListener("dispose",A));let N=x.source,V=f.get(N);V===void 0&&(V={},f.set(N,V));let k=Z(x);if(k!==S.__cacheKey){V[k]===void 0&&(V[k]={texture:i.createTexture(),usedTimes:0},o.memory.textures++,I=!0),V[k].usedTimes++;let ht=V[S.__cacheKey];ht!==void 0&&(V[S.__cacheKey].usedTimes--,ht.usedTimes===0&&b(x)),S.__cacheKey=k,S.__webglTexture=V[k].texture}return I}function Gt(S,x,I){return Math.floor(Math.floor(S/I)/x)}function Ft(S,x,I,N){let k=S.updateRanges;if(k.length===0)e.texSubImage2D(i.TEXTURE_2D,0,0,0,x.width,x.height,I,N,x.data);else{k.sort((st,mt)=>st.start-mt.start);let ht=0;for(let st=1;st<k.length;st++){let mt=k[ht],Lt=k[st],It=mt.start+mt.count,yt=Gt(Lt.start,x.width,4),F=Gt(mt.start,x.width,4);Lt.start<=It+1&&yt===F&&Gt(Lt.start+Lt.count-1,x.width,4)===yt?mt.count=Math.max(mt.count,Lt.start+Lt.count-mt.start):(++ht,k[ht]=Lt)}k.length=ht+1;let at=i.getParameter(i.UNPACK_ROW_LENGTH),vt=i.getParameter(i.UNPACK_SKIP_PIXELS),Mt=i.getParameter(i.UNPACK_SKIP_ROWS);i.pixelStorei(i.UNPACK_ROW_LENGTH,x.width);for(let st=0,mt=k.length;st<mt;st++){let Lt=k[st],It=Math.floor(Lt.start/4),yt=Math.ceil(Lt.count/4),F=It%x.width,T=Math.floor(It/x.width),B=yt,J=1;i.pixelStorei(i.UNPACK_SKIP_PIXELS,F),i.pixelStorei(i.UNPACK_SKIP_ROWS,T),e.texSubImage2D(i.TEXTURE_2D,0,F,T,B,J,I,N,x.data)}S.clearUpdateRanges(),i.pixelStorei(i.UNPACK_ROW_LENGTH,at),i.pixelStorei(i.UNPACK_SKIP_PIXELS,vt),i.pixelStorei(i.UNPACK_SKIP_ROWS,Mt)}}function tt(S,x,I){let N=i.TEXTURE_2D;(x.isDataArrayTexture||x.isCompressedArrayTexture)&&(N=i.TEXTURE_2D_ARRAY),x.isData3DTexture&&(N=i.TEXTURE_3D);let V=Ot(S,x),k=x.source;e.bindTexture(N,S.__webglTexture,i.TEXTURE0+I);let ht=n.get(k);if(k.version!==ht.__version||V===!0){e.activeTexture(i.TEXTURE0+I);let at=te.getPrimaries(te.workingColorSpace),vt=x.colorSpace===kn?null:te.getPrimaries(x.colorSpace),Mt=x.colorSpace===kn||at===vt?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,x.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,x.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,x.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Mt);let st=_(x.image,!1,s.maxTextureSize);st=z(x,st);let mt=r.convert(x.format,x.colorSpace),Lt=r.convert(x.type),It=M(x.internalFormat,mt,Lt,x.colorSpace,x.isVideoTexture);Et(N,x);let yt,F=x.mipmaps,T=x.isVideoTexture!==!0,B=ht.__version===void 0||V===!0,J=k.dataReady,ft=R(x,st);if(x.isDepthTexture)It=y(x.format===ei,x.type),B&&(T?e.texStorage2D(i.TEXTURE_2D,1,It,st.width,st.height):e.texImage2D(i.TEXTURE_2D,0,It,st.width,st.height,0,mt,Lt,null));else if(x.isDataTexture)if(F.length>0){T&&B&&e.texStorage2D(i.TEXTURE_2D,ft,It,F[0].width,F[0].height);for(let rt=0,nt=F.length;rt<nt;rt++)yt=F[rt],T?J&&e.texSubImage2D(i.TEXTURE_2D,rt,0,0,yt.width,yt.height,mt,Lt,yt.data):e.texImage2D(i.TEXTURE_2D,rt,It,yt.width,yt.height,0,mt,Lt,yt.data);x.generateMipmaps=!1}else T?(B&&e.texStorage2D(i.TEXTURE_2D,ft,It,st.width,st.height),J&&Ft(x,st,mt,Lt)):e.texImage2D(i.TEXTURE_2D,0,It,st.width,st.height,0,mt,Lt,st.data);else if(x.isCompressedTexture)if(x.isCompressedArrayTexture){T&&B&&e.texStorage3D(i.TEXTURE_2D_ARRAY,ft,It,F[0].width,F[0].height,st.depth);for(let rt=0,nt=F.length;rt<nt;rt++)if(yt=F[rt],x.format!==Ue)if(mt!==null)if(T){if(J)if(x.layerUpdates.size>0){let Rt=yc(yt.width,yt.height,x.format,x.type);for(let Ut of x.layerUpdates){let Jt=yt.data.subarray(Ut*Rt/yt.data.BYTES_PER_ELEMENT,(Ut+1)*Rt/yt.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,rt,0,0,Ut,yt.width,yt.height,1,mt,Jt)}x.clearLayerUpdates()}else e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,rt,0,0,0,yt.width,yt.height,st.depth,mt,yt.data)}else e.compressedTexImage3D(i.TEXTURE_2D_ARRAY,rt,It,yt.width,yt.height,st.depth,0,yt.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else T?J&&e.texSubImage3D(i.TEXTURE_2D_ARRAY,rt,0,0,0,yt.width,yt.height,st.depth,mt,Lt,yt.data):e.texImage3D(i.TEXTURE_2D_ARRAY,rt,It,yt.width,yt.height,st.depth,0,mt,Lt,yt.data)}else{T&&B&&e.texStorage2D(i.TEXTURE_2D,ft,It,F[0].width,F[0].height);for(let rt=0,nt=F.length;rt<nt;rt++)yt=F[rt],x.format!==Ue?mt!==null?T?J&&e.compressedTexSubImage2D(i.TEXTURE_2D,rt,0,0,yt.width,yt.height,mt,yt.data):e.compressedTexImage2D(i.TEXTURE_2D,rt,It,yt.width,yt.height,0,yt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):T?J&&e.texSubImage2D(i.TEXTURE_2D,rt,0,0,yt.width,yt.height,mt,Lt,yt.data):e.texImage2D(i.TEXTURE_2D,rt,It,yt.width,yt.height,0,mt,Lt,yt.data)}else if(x.isDataArrayTexture)if(T){if(B&&e.texStorage3D(i.TEXTURE_2D_ARRAY,ft,It,st.width,st.height,st.depth),J)if(x.layerUpdates.size>0){let rt=yc(st.width,st.height,x.format,x.type);for(let nt of x.layerUpdates){let Rt=st.data.subarray(nt*rt/st.data.BYTES_PER_ELEMENT,(nt+1)*rt/st.data.BYTES_PER_ELEMENT);e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,nt,st.width,st.height,1,mt,Lt,Rt)}x.clearLayerUpdates()}else e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,st.width,st.height,st.depth,mt,Lt,st.data)}else e.texImage3D(i.TEXTURE_2D_ARRAY,0,It,st.width,st.height,st.depth,0,mt,Lt,st.data);else if(x.isData3DTexture)T?(B&&e.texStorage3D(i.TEXTURE_3D,ft,It,st.width,st.height,st.depth),J&&e.texSubImage3D(i.TEXTURE_3D,0,0,0,0,st.width,st.height,st.depth,mt,Lt,st.data)):e.texImage3D(i.TEXTURE_3D,0,It,st.width,st.height,st.depth,0,mt,Lt,st.data);else if(x.isFramebufferTexture){if(B)if(T)e.texStorage2D(i.TEXTURE_2D,ft,It,st.width,st.height);else{let rt=st.width,nt=st.height;for(let Rt=0;Rt<ft;Rt++)e.texImage2D(i.TEXTURE_2D,Rt,It,rt,nt,0,mt,Lt,null),rt>>=1,nt>>=1}}else if(F.length>0){if(T&&B){let rt=q(F[0]);e.texStorage2D(i.TEXTURE_2D,ft,It,rt.width,rt.height)}for(let rt=0,nt=F.length;rt<nt;rt++)yt=F[rt],T?J&&e.texSubImage2D(i.TEXTURE_2D,rt,0,0,mt,Lt,yt):e.texImage2D(i.TEXTURE_2D,rt,It,mt,Lt,yt);x.generateMipmaps=!1}else if(T){if(B){let rt=q(st);e.texStorage2D(i.TEXTURE_2D,ft,It,rt.width,rt.height)}J&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,mt,Lt,st)}else e.texImage2D(i.TEXTURE_2D,0,It,mt,Lt,st);m(x)&&p(N),ht.__version=k.version,x.onUpdate&&x.onUpdate(x)}S.__version=x.version}function ot(S,x,I){if(x.image.length!==6)return;let N=Ot(S,x),V=x.source;e.bindTexture(i.TEXTURE_CUBE_MAP,S.__webglTexture,i.TEXTURE0+I);let k=n.get(V);if(V.version!==k.__version||N===!0){e.activeTexture(i.TEXTURE0+I);let ht=te.getPrimaries(te.workingColorSpace),at=x.colorSpace===kn?null:te.getPrimaries(x.colorSpace),vt=x.colorSpace===kn||ht===at?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,x.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,x.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,x.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,vt);let Mt=x.isCompressedTexture||x.image[0].isCompressedTexture,st=x.image[0]&&x.image[0].isDataTexture,mt=[];for(let nt=0;nt<6;nt++)!Mt&&!st?mt[nt]=_(x.image[nt],!0,s.maxCubemapSize):mt[nt]=st?x.image[nt].image:x.image[nt],mt[nt]=z(x,mt[nt]);let Lt=mt[0],It=r.convert(x.format,x.colorSpace),yt=r.convert(x.type),F=M(x.internalFormat,It,yt,x.colorSpace),T=x.isVideoTexture!==!0,B=k.__version===void 0||N===!0,J=V.dataReady,ft=R(x,Lt);Et(i.TEXTURE_CUBE_MAP,x);let rt;if(Mt){T&&B&&e.texStorage2D(i.TEXTURE_CUBE_MAP,ft,F,Lt.width,Lt.height);for(let nt=0;nt<6;nt++){rt=mt[nt].mipmaps;for(let Rt=0;Rt<rt.length;Rt++){let Ut=rt[Rt];x.format!==Ue?It!==null?T?J&&e.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+nt,Rt,0,0,Ut.width,Ut.height,It,Ut.data):e.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+nt,Rt,F,Ut.width,Ut.height,0,Ut.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):T?J&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+nt,Rt,0,0,Ut.width,Ut.height,It,yt,Ut.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+nt,Rt,F,Ut.width,Ut.height,0,It,yt,Ut.data)}}}else{if(rt=x.mipmaps,T&&B){rt.length>0&&ft++;let nt=q(mt[0]);e.texStorage2D(i.TEXTURE_CUBE_MAP,ft,F,nt.width,nt.height)}for(let nt=0;nt<6;nt++)if(st){T?J&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+nt,0,0,0,mt[nt].width,mt[nt].height,It,yt,mt[nt].data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+nt,0,F,mt[nt].width,mt[nt].height,0,It,yt,mt[nt].data);for(let Rt=0;Rt<rt.length;Rt++){let Jt=rt[Rt].image[nt].image;T?J&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+nt,Rt+1,0,0,Jt.width,Jt.height,It,yt,Jt.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+nt,Rt+1,F,Jt.width,Jt.height,0,It,yt,Jt.data)}}else{T?J&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+nt,0,0,0,It,yt,mt[nt]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+nt,0,F,It,yt,mt[nt]);for(let Rt=0;Rt<rt.length;Rt++){let Ut=rt[Rt];T?J&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+nt,Rt+1,0,0,It,yt,Ut.image[nt]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+nt,Rt+1,F,It,yt,Ut.image[nt])}}}m(x)&&p(i.TEXTURE_CUBE_MAP),k.__version=V.version,x.onUpdate&&x.onUpdate(x)}S.__version=x.version}function At(S,x,I,N,V,k){let ht=r.convert(I.format,I.colorSpace),at=r.convert(I.type),vt=M(I.internalFormat,ht,at,I.colorSpace),Mt=n.get(x),st=n.get(I);if(st.__renderTarget=x,!Mt.__hasExternalTextures){let mt=Math.max(1,x.width>>k),Lt=Math.max(1,x.height>>k);V===i.TEXTURE_3D||V===i.TEXTURE_2D_ARRAY?e.texImage3D(V,k,vt,mt,Lt,x.depth,0,ht,at,null):e.texImage2D(V,k,vt,mt,Lt,0,ht,at,null)}e.bindFramebuffer(i.FRAMEBUFFER,S),ut(x)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,N,V,st.__webglTexture,0,xt(x)):(V===i.TEXTURE_2D||V>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&V<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,N,V,st.__webglTexture,k),e.bindFramebuffer(i.FRAMEBUFFER,null)}function bt(S,x,I){if(i.bindRenderbuffer(i.RENDERBUFFER,S),x.depthBuffer){let N=x.depthTexture,V=N&&N.isDepthTexture?N.type:null,k=y(x.stencilBuffer,V),ht=x.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,at=xt(x);ut(x)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,at,k,x.width,x.height):I?i.renderbufferStorageMultisample(i.RENDERBUFFER,at,k,x.width,x.height):i.renderbufferStorage(i.RENDERBUFFER,k,x.width,x.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,ht,i.RENDERBUFFER,S)}else{let N=x.textures;for(let V=0;V<N.length;V++){let k=N[V],ht=r.convert(k.format,k.colorSpace),at=r.convert(k.type),vt=M(k.internalFormat,ht,at,k.colorSpace),Mt=xt(x);I&&ut(x)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,Mt,vt,x.width,x.height):ut(x)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Mt,vt,x.width,x.height):i.renderbufferStorage(i.RENDERBUFFER,vt,x.width,x.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function Tt(S,x){if(x&&x.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(i.FRAMEBUFFER,S),!(x.depthTexture&&x.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");let N=n.get(x.depthTexture);N.__renderTarget=x,(!N.__webglTexture||x.depthTexture.image.width!==x.width||x.depthTexture.image.height!==x.height)&&(x.depthTexture.image.width=x.width,x.depthTexture.image.height=x.height,x.depthTexture.needsUpdate=!0),j(x.depthTexture,0);let V=N.__webglTexture,k=xt(x);if(x.depthTexture.format===Gi)ut(x)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,V,0,k):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,V,0);else if(x.depthTexture.format===ei)ut(x)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,V,0,k):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,V,0);else throw new Error("Unknown depthTexture format")}function Wt(S){let x=n.get(S),I=S.isWebGLCubeRenderTarget===!0;if(x.__boundDepthTexture!==S.depthTexture){let N=S.depthTexture;if(x.__depthDisposeCallback&&x.__depthDisposeCallback(),N){let V=()=>{delete x.__boundDepthTexture,delete x.__depthDisposeCallback,N.removeEventListener("dispose",V)};N.addEventListener("dispose",V),x.__depthDisposeCallback=V}x.__boundDepthTexture=N}if(S.depthTexture&&!x.__autoAllocateDepthBuffer){if(I)throw new Error("target.depthTexture not supported in Cube render targets");let N=S.texture.mipmaps;N&&N.length>0?Tt(x.__webglFramebuffer[0],S):Tt(x.__webglFramebuffer,S)}else if(I){x.__webglDepthbuffer=[];for(let N=0;N<6;N++)if(e.bindFramebuffer(i.FRAMEBUFFER,x.__webglFramebuffer[N]),x.__webglDepthbuffer[N]===void 0)x.__webglDepthbuffer[N]=i.createRenderbuffer(),bt(x.__webglDepthbuffer[N],S,!1);else{let V=S.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,k=x.__webglDepthbuffer[N];i.bindRenderbuffer(i.RENDERBUFFER,k),i.framebufferRenderbuffer(i.FRAMEBUFFER,V,i.RENDERBUFFER,k)}}else{let N=S.texture.mipmaps;if(N&&N.length>0?e.bindFramebuffer(i.FRAMEBUFFER,x.__webglFramebuffer[0]):e.bindFramebuffer(i.FRAMEBUFFER,x.__webglFramebuffer),x.__webglDepthbuffer===void 0)x.__webglDepthbuffer=i.createRenderbuffer(),bt(x.__webglDepthbuffer,S,!1);else{let V=S.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,k=x.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,k),i.framebufferRenderbuffer(i.FRAMEBUFFER,V,i.RENDERBUFFER,k)}}e.bindFramebuffer(i.FRAMEBUFFER,null)}function Kt(S,x,I){let N=n.get(S);x!==void 0&&At(N.__webglFramebuffer,S,S.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),I!==void 0&&Wt(S)}function U(S){let x=S.texture,I=n.get(S),N=n.get(x);S.addEventListener("dispose",P);let V=S.textures,k=S.isWebGLCubeRenderTarget===!0,ht=V.length>1;if(ht||(N.__webglTexture===void 0&&(N.__webglTexture=i.createTexture()),N.__version=x.version,o.memory.textures++),k){I.__webglFramebuffer=[];for(let at=0;at<6;at++)if(x.mipmaps&&x.mipmaps.length>0){I.__webglFramebuffer[at]=[];for(let vt=0;vt<x.mipmaps.length;vt++)I.__webglFramebuffer[at][vt]=i.createFramebuffer()}else I.__webglFramebuffer[at]=i.createFramebuffer()}else{if(x.mipmaps&&x.mipmaps.length>0){I.__webglFramebuffer=[];for(let at=0;at<x.mipmaps.length;at++)I.__webglFramebuffer[at]=i.createFramebuffer()}else I.__webglFramebuffer=i.createFramebuffer();if(ht)for(let at=0,vt=V.length;at<vt;at++){let Mt=n.get(V[at]);Mt.__webglTexture===void 0&&(Mt.__webglTexture=i.createTexture(),o.memory.textures++)}if(S.samples>0&&ut(S)===!1){I.__webglMultisampledFramebuffer=i.createFramebuffer(),I.__webglColorRenderbuffer=[],e.bindFramebuffer(i.FRAMEBUFFER,I.__webglMultisampledFramebuffer);for(let at=0;at<V.length;at++){let vt=V[at];I.__webglColorRenderbuffer[at]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,I.__webglColorRenderbuffer[at]);let Mt=r.convert(vt.format,vt.colorSpace),st=r.convert(vt.type),mt=M(vt.internalFormat,Mt,st,vt.colorSpace,S.isXRRenderTarget===!0),Lt=xt(S);i.renderbufferStorageMultisample(i.RENDERBUFFER,Lt,mt,S.width,S.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+at,i.RENDERBUFFER,I.__webglColorRenderbuffer[at])}i.bindRenderbuffer(i.RENDERBUFFER,null),S.depthBuffer&&(I.__webglDepthRenderbuffer=i.createRenderbuffer(),bt(I.__webglDepthRenderbuffer,S,!0)),e.bindFramebuffer(i.FRAMEBUFFER,null)}}if(k){e.bindTexture(i.TEXTURE_CUBE_MAP,N.__webglTexture),Et(i.TEXTURE_CUBE_MAP,x);for(let at=0;at<6;at++)if(x.mipmaps&&x.mipmaps.length>0)for(let vt=0;vt<x.mipmaps.length;vt++)At(I.__webglFramebuffer[at][vt],S,x,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+at,vt);else At(I.__webglFramebuffer[at],S,x,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+at,0);m(x)&&p(i.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(ht){for(let at=0,vt=V.length;at<vt;at++){let Mt=V[at],st=n.get(Mt),mt=i.TEXTURE_2D;(S.isWebGL3DRenderTarget||S.isWebGLArrayRenderTarget)&&(mt=S.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(mt,st.__webglTexture),Et(mt,Mt),At(I.__webglFramebuffer,S,Mt,i.COLOR_ATTACHMENT0+at,mt,0),m(Mt)&&p(mt)}e.unbindTexture()}else{let at=i.TEXTURE_2D;if((S.isWebGL3DRenderTarget||S.isWebGLArrayRenderTarget)&&(at=S.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(at,N.__webglTexture),Et(at,x),x.mipmaps&&x.mipmaps.length>0)for(let vt=0;vt<x.mipmaps.length;vt++)At(I.__webglFramebuffer[vt],S,x,i.COLOR_ATTACHMENT0,at,vt);else At(I.__webglFramebuffer,S,x,i.COLOR_ATTACHMENT0,at,0);m(x)&&p(at),e.unbindTexture()}S.depthBuffer&&Wt(S)}function ct(S){let x=S.textures;for(let I=0,N=x.length;I<N;I++){let V=x[I];if(m(V)){let k=E(S),ht=n.get(V).__webglTexture;e.bindTexture(k,ht),p(k),e.unbindTexture()}}}let it=[],et=[];function Q(S){if(S.samples>0){if(ut(S)===!1){let x=S.textures,I=S.width,N=S.height,V=i.COLOR_BUFFER_BIT,k=S.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ht=n.get(S),at=x.length>1;if(at)for(let Mt=0;Mt<x.length;Mt++)e.bindFramebuffer(i.FRAMEBUFFER,ht.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Mt,i.RENDERBUFFER,null),e.bindFramebuffer(i.FRAMEBUFFER,ht.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Mt,i.TEXTURE_2D,null,0);e.bindFramebuffer(i.READ_FRAMEBUFFER,ht.__webglMultisampledFramebuffer);let vt=S.texture.mipmaps;vt&&vt.length>0?e.bindFramebuffer(i.DRAW_FRAMEBUFFER,ht.__webglFramebuffer[0]):e.bindFramebuffer(i.DRAW_FRAMEBUFFER,ht.__webglFramebuffer);for(let Mt=0;Mt<x.length;Mt++){if(S.resolveDepthBuffer&&(S.depthBuffer&&(V|=i.DEPTH_BUFFER_BIT),S.stencilBuffer&&S.resolveStencilBuffer&&(V|=i.STENCIL_BUFFER_BIT)),at){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,ht.__webglColorRenderbuffer[Mt]);let st=n.get(x[Mt]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,st,0)}i.blitFramebuffer(0,0,I,N,0,0,I,N,V,i.NEAREST),c===!0&&(it.length=0,et.length=0,it.push(i.COLOR_ATTACHMENT0+Mt),S.depthBuffer&&S.resolveDepthBuffer===!1&&(it.push(k),et.push(k),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,et)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,it))}if(e.bindFramebuffer(i.READ_FRAMEBUFFER,null),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),at)for(let Mt=0;Mt<x.length;Mt++){e.bindFramebuffer(i.FRAMEBUFFER,ht.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Mt,i.RENDERBUFFER,ht.__webglColorRenderbuffer[Mt]);let st=n.get(x[Mt]).__webglTexture;e.bindFramebuffer(i.FRAMEBUFFER,ht.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Mt,i.TEXTURE_2D,st,0)}e.bindFramebuffer(i.DRAW_FRAMEBUFFER,ht.__webglMultisampledFramebuffer)}else if(S.depthBuffer&&S.resolveDepthBuffer===!1&&c){let x=S.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[x])}}}function xt(S){return Math.min(s.maxSamples,S.samples)}function ut(S){let x=n.get(S);return S.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&x.__useRenderToTexture!==!1}function gt(S){let x=o.render.frame;h.get(S)!==x&&(h.set(S,x),S.update())}function z(S,x){let I=S.colorSpace,N=S.format,V=S.type;return S.isCompressedTexture===!0||S.isVideoTexture===!0||I!==ui&&I!==kn&&(te.getTransfer(I)===ne?(N!==Ue||V!==tn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",I)),x}function q(S){return typeof HTMLImageElement<"u"&&S instanceof HTMLImageElement?(l.width=S.naturalWidth||S.width,l.height=S.naturalHeight||S.height):typeof VideoFrame<"u"&&S instanceof VideoFrame?(l.width=S.displayWidth,l.height=S.displayHeight):(l.width=S.width,l.height=S.height),l}this.allocateTextureUnit=W,this.resetTextureUnits=O,this.setTexture2D=j,this.setTexture2DArray=$,this.setTexture3D=dt,this.setTextureCube=X,this.rebindTextures=Kt,this.setupRenderTarget=U,this.updateRenderTargetMipmap=ct,this.updateMultisampleRenderTarget=Q,this.setupDepthRenderbuffer=Wt,this.setupFrameBufferTexture=At,this.useMultisampledRTT=ut}function j0(i,t){function e(n,s=kn){let r,o=te.getTransfer(s);if(n===tn)return i.UNSIGNED_BYTE;if(n===sa)return i.UNSIGNED_SHORT_4_4_4_4;if(n===ra)return i.UNSIGNED_SHORT_5_5_5_1;if(n===ac)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===lc)return i.UNSIGNED_INT_10F_11F_11F_REV;if(n===rc)return i.BYTE;if(n===oc)return i.SHORT;if(n===as)return i.UNSIGNED_SHORT;if(n===ia)return i.INT;if(n===Qn)return i.UNSIGNED_INT;if(n===xn)return i.FLOAT;if(n===vn)return i.HALF_FLOAT;if(n===cc)return i.ALPHA;if(n===hc)return i.RGB;if(n===Ue)return i.RGBA;if(n===Gi)return i.DEPTH_COMPONENT;if(n===ei)return i.DEPTH_STENCIL;if(n===oa)return i.RED;if(n===aa)return i.RED_INTEGER;if(n===uc)return i.RG;if(n===la)return i.RG_INTEGER;if(n===ca)return i.RGBA_INTEGER;if(n===pr||n===mr||n===gr||n===_r)if(o===ne)if(r=t.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===pr)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===mr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===gr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===_r)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=t.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===pr)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===mr)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===gr)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===_r)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===ha||n===ua||n===da||n===fa)if(r=t.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===ha)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===ua)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===da)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===fa)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===pa||n===ma||n===ga)if(r=t.get("WEBGL_compressed_texture_etc"),r!==null){if(n===pa||n===ma)return o===ne?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===ga)return o===ne?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===_a||n===xa||n===va||n===ya||n===Ma||n===Sa||n===ba||n===Ea||n===Ta||n===wa||n===Aa||n===Ra||n===Ca||n===Pa)if(r=t.get("WEBGL_compressed_texture_astc"),r!==null){if(n===_a)return o===ne?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===xa)return o===ne?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===va)return o===ne?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===ya)return o===ne?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===Ma)return o===ne?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===Sa)return o===ne?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===ba)return o===ne?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===Ea)return o===ne?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===Ta)return o===ne?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===wa)return o===ne?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Aa)return o===ne?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===Ra)return o===ne?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===Ca)return o===ne?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===Pa)return o===ne?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===Ia||n===Da||n===La)if(r=t.get("EXT_texture_compression_bptc"),r!==null){if(n===Ia)return o===ne?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===Da)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===La)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===Ua||n===Na||n===Fa||n===Oa)if(r=t.get("EXT_texture_compression_rgtc"),r!==null){if(n===Ua)return r.COMPRESSED_RED_RGTC1_EXT;if(n===Na)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===Fa)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===Oa)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===ti?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:e}}var Q0=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,t_=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,Lc=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e){if(this.texture===null){let n=new Vs(t.texture);(t.depthNear!==e.depthNear||t.depthFar!==e.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=n}}getMesh(t){if(this.texture!==null&&this.mesh===null){let e=t.cameras[0].viewport,n=new xe({vertexShader:Q0,fragmentShader:t_,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new ie(new Qs(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},Uc=class extends Sn{constructor(t,e){super();let n=this,s=null,r=1,o=null,a="local-floor",c=1,l=null,h=null,d=null,f=null,u=null,g=null,_=typeof XRWebGLBinding<"u",m=new Lc,p={},E=e.getContextAttributes(),M=null,y=null,R=[],A=[],P=new lt,D=null,b=new Be;b.viewport=new se;let v=new Be;v.viewport=new se;let L=[b,v],O=new Bo,W=null,Z=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(tt){let ot=R[tt];return ot===void 0&&(ot=new Ji,R[tt]=ot),ot.getTargetRaySpace()},this.getControllerGrip=function(tt){let ot=R[tt];return ot===void 0&&(ot=new Ji,R[tt]=ot),ot.getGripSpace()},this.getHand=function(tt){let ot=R[tt];return ot===void 0&&(ot=new Ji,R[tt]=ot),ot.getHandSpace()};function j(tt){let ot=A.indexOf(tt.inputSource);if(ot===-1)return;let At=R[ot];At!==void 0&&(At.update(tt.inputSource,tt.frame,l||o),At.dispatchEvent({type:tt.type,data:tt.inputSource}))}function $(){s.removeEventListener("select",j),s.removeEventListener("selectstart",j),s.removeEventListener("selectend",j),s.removeEventListener("squeeze",j),s.removeEventListener("squeezestart",j),s.removeEventListener("squeezeend",j),s.removeEventListener("end",$),s.removeEventListener("inputsourceschange",dt);for(let tt=0;tt<R.length;tt++){let ot=A[tt];ot!==null&&(A[tt]=null,R[tt].disconnect(ot))}W=null,Z=null,m.reset();for(let tt in p)delete p[tt];t.setRenderTarget(M),u=null,f=null,d=null,s=null,y=null,Ft.stop(),n.isPresenting=!1,t.setPixelRatio(D),t.setSize(P.width,P.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(tt){r=tt,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(tt){a=tt,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||o},this.setReferenceSpace=function(tt){l=tt},this.getBaseLayer=function(){return f!==null?f:u},this.getBinding=function(){return d===null&&_&&(d=new XRWebGLBinding(s,e)),d},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(tt){if(s=tt,s!==null){if(M=t.getRenderTarget(),s.addEventListener("select",j),s.addEventListener("selectstart",j),s.addEventListener("selectend",j),s.addEventListener("squeeze",j),s.addEventListener("squeezestart",j),s.addEventListener("squeezeend",j),s.addEventListener("end",$),s.addEventListener("inputsourceschange",dt),E.xrCompatible!==!0&&await e.makeXRCompatible(),D=t.getPixelRatio(),t.getSize(P),_&&"createProjectionLayer"in XRWebGLBinding.prototype){let At=null,bt=null,Tt=null;E.depth&&(Tt=E.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,At=E.stencil?ei:Gi,bt=E.stencil?ti:Qn);let Wt={colorFormat:e.RGBA8,depthFormat:Tt,scaleFactor:r};d=this.getBinding(),f=d.createProjectionLayer(Wt),s.updateRenderState({layers:[f]}),t.setPixelRatio(1),t.setSize(f.textureWidth,f.textureHeight,!1),y=new ze(f.textureWidth,f.textureHeight,{format:Ue,type:tn,depthTexture:new di(f.textureWidth,f.textureHeight,bt,void 0,void 0,void 0,void 0,void 0,void 0,At),stencilBuffer:E.stencil,colorSpace:t.outputColorSpace,samples:E.antialias?4:0,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}else{let At={antialias:E.antialias,alpha:!0,depth:E.depth,stencil:E.stencil,framebufferScaleFactor:r};u=new XRWebGLLayer(s,e,At),s.updateRenderState({baseLayer:u}),t.setPixelRatio(1),t.setSize(u.framebufferWidth,u.framebufferHeight,!1),y=new ze(u.framebufferWidth,u.framebufferHeight,{format:Ue,type:tn,colorSpace:t.outputColorSpace,stencilBuffer:E.stencil,resolveDepthBuffer:u.ignoreDepthValues===!1,resolveStencilBuffer:u.ignoreDepthValues===!1})}y.isXRRenderTarget=!0,this.setFoveation(c),l=null,o=await s.requestReferenceSpace(a),Ft.setContext(s),Ft.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function dt(tt){for(let ot=0;ot<tt.removed.length;ot++){let At=tt.removed[ot],bt=A.indexOf(At);bt>=0&&(A[bt]=null,R[bt].disconnect(At))}for(let ot=0;ot<tt.added.length;ot++){let At=tt.added[ot],bt=A.indexOf(At);if(bt===-1){for(let Wt=0;Wt<R.length;Wt++)if(Wt>=A.length){A.push(At),bt=Wt;break}else if(A[Wt]===null){A[Wt]=At,bt=Wt;break}if(bt===-1)break}let Tt=R[bt];Tt&&Tt.connect(At)}}let X=new C,pt=new C;function St(tt,ot,At){X.setFromMatrixPosition(ot.matrixWorld),pt.setFromMatrixPosition(At.matrixWorld);let bt=X.distanceTo(pt),Tt=ot.projectionMatrix.elements,Wt=At.projectionMatrix.elements,Kt=Tt[14]/(Tt[10]-1),U=Tt[14]/(Tt[10]+1),ct=(Tt[9]+1)/Tt[5],it=(Tt[9]-1)/Tt[5],et=(Tt[8]-1)/Tt[0],Q=(Wt[8]+1)/Wt[0],xt=Kt*et,ut=Kt*Q,gt=bt/(-et+Q),z=gt*-et;if(ot.matrixWorld.decompose(tt.position,tt.quaternion,tt.scale),tt.translateX(z),tt.translateZ(gt),tt.matrixWorld.compose(tt.position,tt.quaternion,tt.scale),tt.matrixWorldInverse.copy(tt.matrixWorld).invert(),Tt[10]===-1)tt.projectionMatrix.copy(ot.projectionMatrix),tt.projectionMatrixInverse.copy(ot.projectionMatrixInverse);else{let q=Kt+gt,S=U+gt,x=xt-z,I=ut+(bt-z),N=ct*U/S*q,V=it*U/S*q;tt.projectionMatrix.makePerspective(x,I,N,V,q,S),tt.projectionMatrixInverse.copy(tt.projectionMatrix).invert()}}function wt(tt,ot){ot===null?tt.matrixWorld.copy(tt.matrix):tt.matrixWorld.multiplyMatrices(ot.matrixWorld,tt.matrix),tt.matrixWorldInverse.copy(tt.matrixWorld).invert()}this.updateCamera=function(tt){if(s===null)return;let ot=tt.near,At=tt.far;m.texture!==null&&(m.depthNear>0&&(ot=m.depthNear),m.depthFar>0&&(At=m.depthFar)),O.near=v.near=b.near=ot,O.far=v.far=b.far=At,(W!==O.near||Z!==O.far)&&(s.updateRenderState({depthNear:O.near,depthFar:O.far}),W=O.near,Z=O.far),O.layers.mask=tt.layers.mask|6,b.layers.mask=O.layers.mask&3,v.layers.mask=O.layers.mask&5;let bt=tt.parent,Tt=O.cameras;wt(O,bt);for(let Wt=0;Wt<Tt.length;Wt++)wt(Tt[Wt],bt);Tt.length===2?St(O,b,v):O.projectionMatrix.copy(b.projectionMatrix),Et(tt,O,bt)};function Et(tt,ot,At){At===null?tt.matrix.copy(ot.matrixWorld):(tt.matrix.copy(At.matrixWorld),tt.matrix.invert(),tt.matrix.multiply(ot.matrixWorld)),tt.matrix.decompose(tt.position,tt.quaternion,tt.scale),tt.updateMatrixWorld(!0),tt.projectionMatrix.copy(ot.projectionMatrix),tt.projectionMatrixInverse.copy(ot.projectionMatrixInverse),tt.isPerspectiveCamera&&(tt.fov=Wi*2*Math.atan(1/tt.projectionMatrix.elements[5]),tt.zoom=1)}this.getCamera=function(){return O},this.getFoveation=function(){if(!(f===null&&u===null))return c},this.setFoveation=function(tt){c=tt,f!==null&&(f.fixedFoveation=tt),u!==null&&u.fixedFoveation!==void 0&&(u.fixedFoveation=tt)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(O)},this.getCameraTexture=function(tt){return p[tt]};let Ot=null;function Gt(tt,ot){if(h=ot.getViewerPose(l||o),g=ot,h!==null){let At=h.views;u!==null&&(t.setRenderTargetFramebuffer(y,u.framebuffer),t.setRenderTarget(y));let bt=!1;At.length!==O.cameras.length&&(O.cameras.length=0,bt=!0);for(let U=0;U<At.length;U++){let ct=At[U],it=null;if(u!==null)it=u.getViewport(ct);else{let Q=d.getViewSubImage(f,ct);it=Q.viewport,U===0&&(t.setRenderTargetTextures(y,Q.colorTexture,Q.depthStencilTexture),t.setRenderTarget(y))}let et=L[U];et===void 0&&(et=new Be,et.layers.enable(U),et.viewport=new se,L[U]=et),et.matrix.fromArray(ct.transform.matrix),et.matrix.decompose(et.position,et.quaternion,et.scale),et.projectionMatrix.fromArray(ct.projectionMatrix),et.projectionMatrixInverse.copy(et.projectionMatrix).invert(),et.viewport.set(it.x,it.y,it.width,it.height),U===0&&(O.matrix.copy(et.matrix),O.matrix.decompose(O.position,O.quaternion,O.scale)),bt===!0&&O.cameras.push(et)}let Tt=s.enabledFeatures;if(Tt&&Tt.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&_){d=n.getBinding();let U=d.getDepthInformation(At[0]);U&&U.isValid&&U.texture&&m.init(U,s.renderState)}if(Tt&&Tt.includes("camera-access")&&_){t.state.unbindTexture(),d=n.getBinding();for(let U=0;U<At.length;U++){let ct=At[U].camera;if(ct){let it=p[ct];it||(it=new Vs,p[ct]=it);let et=d.getCameraImage(ct);it.sourceTexture=et}}}}for(let At=0;At<R.length;At++){let bt=A[At],Tt=R[At];bt!==null&&Tt!==void 0&&Tt.update(bt,ot,l||o)}Ot&&Ot(tt,ot),ot.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:ot}),g=null}let Ft=new Fu;Ft.setAnimationLoop(Gt),this.setAnimationLoop=function(tt){Ot=tt},this.dispose=function(){}}},bi=new hn,e_=new jt;function n_(i,t){function e(m,p){m.matrixAutoUpdate===!0&&m.updateMatrix(),p.value.copy(m.matrix)}function n(m,p){p.color.getRGB(m.fogColor.value,gc(i)),p.isFog?(m.fogNear.value=p.near,m.fogFar.value=p.far):p.isFogExp2&&(m.fogDensity.value=p.density)}function s(m,p,E,M,y){p.isMeshBasicMaterial||p.isMeshLambertMaterial?r(m,p):p.isMeshToonMaterial?(r(m,p),d(m,p)):p.isMeshPhongMaterial?(r(m,p),h(m,p)):p.isMeshStandardMaterial?(r(m,p),f(m,p),p.isMeshPhysicalMaterial&&u(m,p,y)):p.isMeshMatcapMaterial?(r(m,p),g(m,p)):p.isMeshDepthMaterial?r(m,p):p.isMeshDistanceMaterial?(r(m,p),_(m,p)):p.isMeshNormalMaterial?r(m,p):p.isLineBasicMaterial?(o(m,p),p.isLineDashedMaterial&&a(m,p)):p.isPointsMaterial?c(m,p,E,M):p.isSpriteMaterial?l(m,p):p.isShadowMaterial?(m.color.value.copy(p.color),m.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function r(m,p){m.opacity.value=p.opacity,p.color&&m.diffuse.value.copy(p.color),p.emissive&&m.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(m.map.value=p.map,e(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.bumpMap&&(m.bumpMap.value=p.bumpMap,e(p.bumpMap,m.bumpMapTransform),m.bumpScale.value=p.bumpScale,p.side===Ce&&(m.bumpScale.value*=-1)),p.normalMap&&(m.normalMap.value=p.normalMap,e(p.normalMap,m.normalMapTransform),m.normalScale.value.copy(p.normalScale),p.side===Ce&&m.normalScale.value.negate()),p.displacementMap&&(m.displacementMap.value=p.displacementMap,e(p.displacementMap,m.displacementMapTransform),m.displacementScale.value=p.displacementScale,m.displacementBias.value=p.displacementBias),p.emissiveMap&&(m.emissiveMap.value=p.emissiveMap,e(p.emissiveMap,m.emissiveMapTransform)),p.specularMap&&(m.specularMap.value=p.specularMap,e(p.specularMap,m.specularMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest);let E=t.get(p),M=E.envMap,y=E.envMapRotation;M&&(m.envMap.value=M,bi.copy(y),bi.x*=-1,bi.y*=-1,bi.z*=-1,M.isCubeTexture&&M.isRenderTargetTexture===!1&&(bi.y*=-1,bi.z*=-1),m.envMapRotation.value.setFromMatrix4(e_.makeRotationFromEuler(bi)),m.flipEnvMap.value=M.isCubeTexture&&M.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=p.reflectivity,m.ior.value=p.ior,m.refractionRatio.value=p.refractionRatio),p.lightMap&&(m.lightMap.value=p.lightMap,m.lightMapIntensity.value=p.lightMapIntensity,e(p.lightMap,m.lightMapTransform)),p.aoMap&&(m.aoMap.value=p.aoMap,m.aoMapIntensity.value=p.aoMapIntensity,e(p.aoMap,m.aoMapTransform))}function o(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,p.map&&(m.map.value=p.map,e(p.map,m.mapTransform))}function a(m,p){m.dashSize.value=p.dashSize,m.totalSize.value=p.dashSize+p.gapSize,m.scale.value=p.scale}function c(m,p,E,M){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.size.value=p.size*E,m.scale.value=M*.5,p.map&&(m.map.value=p.map,e(p.map,m.uvTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function l(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.rotation.value=p.rotation,p.map&&(m.map.value=p.map,e(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function h(m,p){m.specular.value.copy(p.specular),m.shininess.value=Math.max(p.shininess,1e-4)}function d(m,p){p.gradientMap&&(m.gradientMap.value=p.gradientMap)}function f(m,p){m.metalness.value=p.metalness,p.metalnessMap&&(m.metalnessMap.value=p.metalnessMap,e(p.metalnessMap,m.metalnessMapTransform)),m.roughness.value=p.roughness,p.roughnessMap&&(m.roughnessMap.value=p.roughnessMap,e(p.roughnessMap,m.roughnessMapTransform)),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)}function u(m,p,E){m.ior.value=p.ior,p.sheen>0&&(m.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),m.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(m.sheenColorMap.value=p.sheenColorMap,e(p.sheenColorMap,m.sheenColorMapTransform)),p.sheenRoughnessMap&&(m.sheenRoughnessMap.value=p.sheenRoughnessMap,e(p.sheenRoughnessMap,m.sheenRoughnessMapTransform))),p.clearcoat>0&&(m.clearcoat.value=p.clearcoat,m.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(m.clearcoatMap.value=p.clearcoatMap,e(p.clearcoatMap,m.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,e(p.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(m.clearcoatNormalMap.value=p.clearcoatNormalMap,e(p.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===Ce&&m.clearcoatNormalScale.value.negate())),p.dispersion>0&&(m.dispersion.value=p.dispersion),p.iridescence>0&&(m.iridescence.value=p.iridescence,m.iridescenceIOR.value=p.iridescenceIOR,m.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(m.iridescenceMap.value=p.iridescenceMap,e(p.iridescenceMap,m.iridescenceMapTransform)),p.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=p.iridescenceThicknessMap,e(p.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),p.transmission>0&&(m.transmission.value=p.transmission,m.transmissionSamplerMap.value=E.texture,m.transmissionSamplerSize.value.set(E.width,E.height),p.transmissionMap&&(m.transmissionMap.value=p.transmissionMap,e(p.transmissionMap,m.transmissionMapTransform)),m.thickness.value=p.thickness,p.thicknessMap&&(m.thicknessMap.value=p.thicknessMap,e(p.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=p.attenuationDistance,m.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(m.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(m.anisotropyMap.value=p.anisotropyMap,e(p.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=p.specularIntensity,m.specularColor.value.copy(p.specularColor),p.specularColorMap&&(m.specularColorMap.value=p.specularColorMap,e(p.specularColorMap,m.specularColorMapTransform)),p.specularIntensityMap&&(m.specularIntensityMap.value=p.specularIntensityMap,e(p.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,p){p.matcap&&(m.matcap.value=p.matcap)}function _(m,p){let E=t.get(p).light;m.referencePosition.value.setFromMatrixPosition(E.matrixWorld),m.nearDistance.value=E.shadow.camera.near,m.farDistance.value=E.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function i_(i,t,e,n){let s={},r={},o=[],a=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function c(E,M){let y=M.program;n.uniformBlockBinding(E,y)}function l(E,M){let y=s[E.id];y===void 0&&(g(E),y=h(E),s[E.id]=y,E.addEventListener("dispose",m));let R=M.program;n.updateUBOMapping(E,R);let A=t.render.frame;r[E.id]!==A&&(f(E),r[E.id]=A)}function h(E){let M=d();E.__bindingPointIndex=M;let y=i.createBuffer(),R=E.__size,A=E.usage;return i.bindBuffer(i.UNIFORM_BUFFER,y),i.bufferData(i.UNIFORM_BUFFER,R,A),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,M,y),y}function d(){for(let E=0;E<a;E++)if(o.indexOf(E)===-1)return o.push(E),E;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function f(E){let M=s[E.id],y=E.uniforms,R=E.__cache;i.bindBuffer(i.UNIFORM_BUFFER,M);for(let A=0,P=y.length;A<P;A++){let D=Array.isArray(y[A])?y[A]:[y[A]];for(let b=0,v=D.length;b<v;b++){let L=D[b];if(u(L,A,b,R)===!0){let O=L.__offset,W=Array.isArray(L.value)?L.value:[L.value],Z=0;for(let j=0;j<W.length;j++){let $=W[j],dt=_($);typeof $=="number"||typeof $=="boolean"?(L.__data[0]=$,i.bufferSubData(i.UNIFORM_BUFFER,O+Z,L.__data)):$.isMatrix3?(L.__data[0]=$.elements[0],L.__data[1]=$.elements[1],L.__data[2]=$.elements[2],L.__data[3]=0,L.__data[4]=$.elements[3],L.__data[5]=$.elements[4],L.__data[6]=$.elements[5],L.__data[7]=0,L.__data[8]=$.elements[6],L.__data[9]=$.elements[7],L.__data[10]=$.elements[8],L.__data[11]=0):($.toArray(L.__data,Z),Z+=dt.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,O,L.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function u(E,M,y,R){let A=E.value,P=M+"_"+y;if(R[P]===void 0)return typeof A=="number"||typeof A=="boolean"?R[P]=A:R[P]=A.clone(),!0;{let D=R[P];if(typeof A=="number"||typeof A=="boolean"){if(D!==A)return R[P]=A,!0}else if(D.equals(A)===!1)return D.copy(A),!0}return!1}function g(E){let M=E.uniforms,y=0,R=16;for(let P=0,D=M.length;P<D;P++){let b=Array.isArray(M[P])?M[P]:[M[P]];for(let v=0,L=b.length;v<L;v++){let O=b[v],W=Array.isArray(O.value)?O.value:[O.value];for(let Z=0,j=W.length;Z<j;Z++){let $=W[Z],dt=_($),X=y%R,pt=X%dt.boundary,St=X+pt;y+=pt,St!==0&&R-St<dt.storage&&(y+=R-St),O.__data=new Float32Array(dt.storage/Float32Array.BYTES_PER_ELEMENT),O.__offset=y,y+=dt.storage}}}let A=y%R;return A>0&&(y+=R-A),E.__size=y,E.__cache={},this}function _(E){let M={boundary:0,storage:0};return typeof E=="number"||typeof E=="boolean"?(M.boundary=4,M.storage=4):E.isVector2?(M.boundary=8,M.storage=8):E.isVector3||E.isColor?(M.boundary=16,M.storage=12):E.isVector4?(M.boundary=16,M.storage=16):E.isMatrix3?(M.boundary=48,M.storage=48):E.isMatrix4?(M.boundary=64,M.storage=64):E.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",E),M}function m(E){let M=E.target;M.removeEventListener("dispose",m);let y=o.indexOf(M.__bindingPointIndex);o.splice(y,1),i.deleteBuffer(s[M.id]),delete s[M.id],delete r[M.id]}function p(){for(let E in s)i.deleteBuffer(s[E]);o=[],s={},r={}}return{bind:c,update:l,dispose:p}}var Nu=class{constructor(t={}){let{canvas:e=su(),context:n=null,depth:s=!0,stencil:r=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:d=!1,reversedDepthBuffer:f=!1}=t;this.isWebGLRenderer=!0;let u;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");u=n.getContextAttributes().alpha}else u=o;let g=new Uint32Array(4),_=new Int32Array(4),m=null,p=null,E=[],M=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=zn,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let y=this,R=!1;this._outputColorSpace=Me;let A=0,P=0,D=null,b=-1,v=null,L=new se,O=new se,W=null,Z=new zt(0),j=0,$=e.width,dt=e.height,X=1,pt=null,St=null,wt=new se(0,0,$,dt),Et=new se(0,0,$,dt),Ot=!1,Gt=new Ki,Ft=!1,tt=!1,ot=new jt,At=new C,bt=new se,Tt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},Wt=!1;function Kt(){return D===null?X:1}let U=n;function ct(w,H){return e.getContext(w,H)}try{let w={alpha:!0,depth:s,stencil:r,antialias:a,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:h,failIfMajorPerformanceCaveat:d};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${"180"}`),e.addEventListener("webglcontextlost",J,!1),e.addEventListener("webglcontextrestored",ft,!1),e.addEventListener("webglcontextcreationerror",rt,!1),U===null){let H="webgl2";if(U=ct(H,w),U===null)throw ct(H)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(w){throw console.error("THREE.WebGLRenderer: "+w.message),w}let it,et,Q,xt,ut,gt,z,q,S,x,I,N,V,k,ht,at,vt,Mt,st,mt,Lt,It,yt,F;function T(){it=new Mg(U),it.init(),It=new j0(U,it),et=new pg(U,it,t,It),Q=new $0(U,it),et.reversedDepthBuffer&&f&&Q.buffers.depth.setReversed(!0),xt=new Eg(U),ut=new O0,gt=new K0(U,it,Q,ut,et,It,xt),z=new gg(y),q=new yg(y),S=new Pf(U),yt=new dg(U,S),x=new Sg(U,S,xt,yt),I=new wg(U,x,S,xt),st=new Tg(U,et,gt),at=new mg(ut),N=new F0(y,z,q,it,et,yt,at),V=new n_(y,ut),k=new z0,ht=new X0(it),Mt=new ug(y,z,q,Q,I,u,c),vt=new Z0(y,I,et),F=new i_(U,xt,et,Q),mt=new fg(U,it,xt),Lt=new bg(U,it,xt),xt.programs=N.programs,y.capabilities=et,y.extensions=it,y.properties=ut,y.renderLists=k,y.shadowMap=vt,y.state=Q,y.info=xt}T();let B=new Uc(y,U);this.xr=B,this.getContext=function(){return U},this.getContextAttributes=function(){return U.getContextAttributes()},this.forceContextLoss=function(){let w=it.get("WEBGL_lose_context");w&&w.loseContext()},this.forceContextRestore=function(){let w=it.get("WEBGL_lose_context");w&&w.restoreContext()},this.getPixelRatio=function(){return X},this.setPixelRatio=function(w){w!==void 0&&(X=w,this.setSize($,dt,!1))},this.getSize=function(w){return w.set($,dt)},this.setSize=function(w,H,Y=!0){if(B.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}$=w,dt=H,e.width=Math.floor(w*X),e.height=Math.floor(H*X),Y===!0&&(e.style.width=w+"px",e.style.height=H+"px"),this.setViewport(0,0,w,H)},this.getDrawingBufferSize=function(w){return w.set($*X,dt*X).floor()},this.setDrawingBufferSize=function(w,H,Y){$=w,dt=H,X=Y,e.width=Math.floor(w*Y),e.height=Math.floor(H*Y),this.setViewport(0,0,w,H)},this.getCurrentViewport=function(w){return w.copy(L)},this.getViewport=function(w){return w.copy(wt)},this.setViewport=function(w,H,Y,K){w.isVector4?wt.set(w.x,w.y,w.z,w.w):wt.set(w,H,Y,K),Q.viewport(L.copy(wt).multiplyScalar(X).round())},this.getScissor=function(w){return w.copy(Et)},this.setScissor=function(w,H,Y,K){w.isVector4?Et.set(w.x,w.y,w.z,w.w):Et.set(w,H,Y,K),Q.scissor(O.copy(Et).multiplyScalar(X).round())},this.getScissorTest=function(){return Ot},this.setScissorTest=function(w){Q.setScissorTest(Ot=w)},this.setOpaqueSort=function(w){pt=w},this.setTransparentSort=function(w){St=w},this.getClearColor=function(w){return w.copy(Mt.getClearColor())},this.setClearColor=function(){Mt.setClearColor(...arguments)},this.getClearAlpha=function(){return Mt.getClearAlpha()},this.setClearAlpha=function(){Mt.setClearAlpha(...arguments)},this.clear=function(w=!0,H=!0,Y=!0){let K=0;if(w){let G=!1;if(D!==null){let _t=D.texture.format;G=_t===ca||_t===la||_t===aa}if(G){let _t=D.texture.type,Pt=_t===tn||_t===Qn||_t===as||_t===ti||_t===sa||_t===ra,Nt=Mt.getClearColor(),Dt=Mt.getClearAlpha(),Ht=Nt.r,Xt=Nt.g,Bt=Nt.b;Pt?(g[0]=Ht,g[1]=Xt,g[2]=Bt,g[3]=Dt,U.clearBufferuiv(U.COLOR,0,g)):(_[0]=Ht,_[1]=Xt,_[2]=Bt,_[3]=Dt,U.clearBufferiv(U.COLOR,0,_))}else K|=U.COLOR_BUFFER_BIT}H&&(K|=U.DEPTH_BUFFER_BIT),Y&&(K|=U.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),U.clear(K)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",J,!1),e.removeEventListener("webglcontextrestored",ft,!1),e.removeEventListener("webglcontextcreationerror",rt,!1),Mt.dispose(),k.dispose(),ht.dispose(),ut.dispose(),z.dispose(),q.dispose(),I.dispose(),yt.dispose(),F.dispose(),N.dispose(),B.dispose(),B.removeEventListener("sessionstart",we),B.removeEventListener("sessionend",pe),nn.stop()};function J(w){w.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),R=!0}function ft(){console.log("THREE.WebGLRenderer: Context Restored."),R=!1;let w=xt.autoReset,H=vt.enabled,Y=vt.autoUpdate,K=vt.needsUpdate,G=vt.type;T(),xt.autoReset=w,vt.enabled=H,vt.autoUpdate=Y,vt.needsUpdate=K,vt.type=G}function rt(w){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",w.statusMessage)}function nt(w){let H=w.target;H.removeEventListener("dispose",nt),Rt(H)}function Rt(w){Ut(w),ut.remove(w)}function Ut(w){let H=ut.get(w).programs;H!==void 0&&(H.forEach(function(Y){N.releaseProgram(Y)}),w.isShaderMaterial&&N.releaseShaderCache(w))}this.renderBufferDirect=function(w,H,Y,K,G,_t){H===null&&(H=Tt);let Pt=G.isMesh&&G.matrixWorld.determinant()<0,Nt=$u(w,H,Y,K,G);Q.setMaterial(K,Pt);let Dt=Y.index,Ht=1;if(K.wireframe===!0){if(Dt=x.getWireframeAttribute(Y),Dt===void 0)return;Ht=2}let Xt=Y.drawRange,Bt=Y.attributes.position,Qt=Xt.start*Ht,re=(Xt.start+Xt.count)*Ht;_t!==null&&(Qt=Math.max(Qt,_t.start*Ht),re=Math.min(re,(_t.start+_t.count)*Ht)),Dt!==null?(Qt=Math.max(Qt,0),re=Math.min(re,Dt.count)):Bt!=null&&(Qt=Math.max(Qt,0),re=Math.min(re,Bt.count));let me=re-Qt;if(me<0||me===1/0)return;yt.setup(G,K,Nt,Y,Dt);let ce,le=mt;if(Dt!==null&&(ce=S.get(Dt),le=Lt,le.setIndex(ce)),G.isMesh)K.wireframe===!0?(Q.setLineWidth(K.wireframeLinewidth*Kt()),le.setMode(U.LINES)):le.setMode(U.TRIANGLES);else if(G.isLine){let Vt=K.linewidth;Vt===void 0&&(Vt=1),Q.setLineWidth(Vt*Kt()),G.isLineSegments?le.setMode(U.LINES):G.isLineLoop?le.setMode(U.LINE_LOOP):le.setMode(U.LINE_STRIP)}else G.isPoints?le.setMode(U.POINTS):G.isSprite&&le.setMode(U.TRIANGLES);if(G.isBatchedMesh)if(G._multiDrawInstances!==null)qi("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),le.renderMultiDrawInstances(G._multiDrawStarts,G._multiDrawCounts,G._multiDrawCount,G._multiDrawInstances);else if(it.get("WEBGL_multi_draw"))le.renderMultiDraw(G._multiDrawStarts,G._multiDrawCounts,G._multiDrawCount);else{let Vt=G._multiDrawStarts,ue=G._multiDrawCounts,ee=G._multiDrawCount,Xe=Dt?S.get(Dt).bytesPerElement:1,wi=ut.get(K).currentProgram.getUniforms();for(let qe=0;qe<ee;qe++)wi.setValue(U,"_gl_DrawID",qe),le.render(Vt[qe]/Xe,ue[qe])}else if(G.isInstancedMesh)le.renderInstances(Qt,me,G.count);else if(Y.isInstancedBufferGeometry){let Vt=Y._maxInstanceCount!==void 0?Y._maxInstanceCount:1/0,ue=Math.min(Y.instanceCount,Vt);le.renderInstances(Qt,me,ue)}else le.render(Qt,me)};function Jt(w,H,Y){w.transparent===!0&&w.side===ke&&w.forceSinglePass===!1?(w.side=Ce,w.needsUpdate=!0,Pr(w,H,Y),w.side=Fn,w.needsUpdate=!0,Pr(w,H,Y),w.side=ke):Pr(w,H,Y)}this.compile=function(w,H,Y=null){Y===null&&(Y=w),p=ht.get(Y),p.init(H),M.push(p),Y.traverseVisible(function(G){G.isLight&&G.layers.test(H.layers)&&(p.pushLight(G),G.castShadow&&p.pushShadow(G))}),w!==Y&&w.traverseVisible(function(G){G.isLight&&G.layers.test(H.layers)&&(p.pushLight(G),G.castShadow&&p.pushShadow(G))}),p.setupLights();let K=new Set;return w.traverse(function(G){if(!(G.isMesh||G.isPoints||G.isLine||G.isSprite))return;let _t=G.material;if(_t)if(Array.isArray(_t))for(let Pt=0;Pt<_t.length;Pt++){let Nt=_t[Pt];Jt(Nt,Y,G),K.add(Nt)}else Jt(_t,Y,G),K.add(_t)}),p=M.pop(),K},this.compileAsync=function(w,H,Y=null){let K=this.compile(w,H,Y);return new Promise(G=>{function _t(){if(K.forEach(function(Pt){ut.get(Pt).currentProgram.isReady()&&K.delete(Pt)}),K.size===0){G(w);return}setTimeout(_t,10)}it.get("KHR_parallel_shader_compile")!==null?_t():setTimeout(_t,10)})};let qt=null;function _e(w){qt&&qt(w)}function we(){nn.stop()}function pe(){nn.start()}let nn=new Fu;nn.setAnimationLoop(_e),typeof self<"u"&&nn.setContext(self),this.setAnimationLoop=function(w){qt=w,B.setAnimationLoop(w),w===null?nn.stop():nn.start()},B.addEventListener("sessionstart",we),B.addEventListener("sessionend",pe),this.render=function(w,H){if(H!==void 0&&H.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(R===!0)return;if(w.matrixWorldAutoUpdate===!0&&w.updateMatrixWorld(),H.parent===null&&H.matrixWorldAutoUpdate===!0&&H.updateMatrixWorld(),B.enabled===!0&&B.isPresenting===!0&&(B.cameraAutoUpdate===!0&&B.updateCamera(H),H=B.getCamera()),w.isScene===!0&&w.onBeforeRender(y,w,H,D),p=ht.get(w,M.length),p.init(H),M.push(p),ot.multiplyMatrices(H.projectionMatrix,H.matrixWorldInverse),Gt.setFromProjectionMatrix(ot,gn,H.reversedDepth),tt=this.localClippingEnabled,Ft=at.init(this.clippingPlanes,tt),m=k.get(w,E.length),m.init(),E.push(m),B.enabled===!0&&B.isPresenting===!0){let _t=y.xr.getDepthSensingMesh();_t!==null&&el(_t,H,-1/0,y.sortObjects)}el(w,H,0,y.sortObjects),m.finish(),y.sortObjects===!0&&m.sort(pt,St),Wt=B.enabled===!1||B.isPresenting===!1||B.hasDepthSensing()===!1,Wt&&Mt.addToRenderList(m,w),this.info.render.frame++,Ft===!0&&at.beginShadows();let Y=p.state.shadowsArray;vt.render(Y,w,H),Ft===!0&&at.endShadows(),this.info.autoReset===!0&&this.info.reset();let K=m.opaque,G=m.transmissive;if(p.setupLights(),H.isArrayCamera){let _t=H.cameras;if(G.length>0)for(let Pt=0,Nt=_t.length;Pt<Nt;Pt++){let Dt=_t[Pt];Gc(K,G,w,Dt)}Wt&&Mt.render(w);for(let Pt=0,Nt=_t.length;Pt<Nt;Pt++){let Dt=_t[Pt];Hc(m,w,Dt,Dt.viewport)}}else G.length>0&&Gc(K,G,w,H),Wt&&Mt.render(w),Hc(m,w,H);D!==null&&P===0&&(gt.updateMultisampleRenderTarget(D),gt.updateRenderTargetMipmap(D)),w.isScene===!0&&w.onAfterRender(y,w,H),yt.resetDefaultState(),b=-1,v=null,M.pop(),M.length>0?(p=M[M.length-1],Ft===!0&&at.setGlobalState(y.clippingPlanes,p.state.camera)):p=null,E.pop(),E.length>0?m=E[E.length-1]:m=null};function el(w,H,Y,K){if(w.visible===!1)return;if(w.layers.test(H.layers)){if(w.isGroup)Y=w.renderOrder;else if(w.isLOD)w.autoUpdate===!0&&w.update(H);else if(w.isLight)p.pushLight(w),w.castShadow&&p.pushShadow(w);else if(w.isSprite){if(!w.frustumCulled||Gt.intersectsSprite(w)){K&&bt.setFromMatrixPosition(w.matrixWorld).applyMatrix4(ot);let Pt=I.update(w),Nt=w.material;Nt.visible&&m.push(w,Pt,Nt,Y,bt.z,null)}}else if((w.isMesh||w.isLine||w.isPoints)&&(!w.frustumCulled||Gt.intersectsObject(w))){let Pt=I.update(w),Nt=w.material;if(K&&(w.boundingSphere!==void 0?(w.boundingSphere===null&&w.computeBoundingSphere(),bt.copy(w.boundingSphere.center)):(Pt.boundingSphere===null&&Pt.computeBoundingSphere(),bt.copy(Pt.boundingSphere.center)),bt.applyMatrix4(w.matrixWorld).applyMatrix4(ot)),Array.isArray(Nt)){let Dt=Pt.groups;for(let Ht=0,Xt=Dt.length;Ht<Xt;Ht++){let Bt=Dt[Ht],Qt=Nt[Bt.materialIndex];Qt&&Qt.visible&&m.push(w,Pt,Qt,Y,bt.z,Bt)}}else Nt.visible&&m.push(w,Pt,Nt,Y,bt.z,null)}}let _t=w.children;for(let Pt=0,Nt=_t.length;Pt<Nt;Pt++)el(_t[Pt],H,Y,K)}function Hc(w,H,Y,K){let G=w.opaque,_t=w.transmissive,Pt=w.transparent;p.setupLightsView(Y),Ft===!0&&at.setGlobalState(y.clippingPlanes,Y),K&&Q.viewport(L.copy(K)),G.length>0&&Cr(G,H,Y),_t.length>0&&Cr(_t,H,Y),Pt.length>0&&Cr(Pt,H,Y),Q.buffers.depth.setTest(!0),Q.buffers.depth.setMask(!0),Q.buffers.color.setMask(!0),Q.setPolygonOffset(!1)}function Gc(w,H,Y,K){if((Y.isScene===!0?Y.overrideMaterial:null)!==null)return;p.state.transmissionRenderTarget[K.id]===void 0&&(p.state.transmissionRenderTarget[K.id]=new ze(1,1,{generateMipmaps:!0,type:it.has("EXT_color_buffer_half_float")||it.has("EXT_color_buffer_float")?vn:tn,minFilter:Rn,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:te.workingColorSpace}));let _t=p.state.transmissionRenderTarget[K.id],Pt=K.viewport||L;_t.setSize(Pt.z*y.transmissionResolutionScale,Pt.w*y.transmissionResolutionScale);let Nt=y.getRenderTarget(),Dt=y.getActiveCubeFace(),Ht=y.getActiveMipmapLevel();y.setRenderTarget(_t),y.getClearColor(Z),j=y.getClearAlpha(),j<1&&y.setClearColor(16777215,.5),y.clear(),Wt&&Mt.render(Y);let Xt=y.toneMapping;y.toneMapping=zn;let Bt=K.viewport;if(K.viewport!==void 0&&(K.viewport=void 0),p.setupLightsView(K),Ft===!0&&at.setGlobalState(y.clippingPlanes,K),Cr(w,Y,K),gt.updateMultisampleRenderTarget(_t),gt.updateRenderTargetMipmap(_t),it.has("WEBGL_multisampled_render_to_texture")===!1){let Qt=!1;for(let re=0,me=H.length;re<me;re++){let ce=H[re],le=ce.object,Vt=ce.geometry,ue=ce.material,ee=ce.group;if(ue.side===ke&&le.layers.test(K.layers)){let Xe=ue.side;ue.side=Ce,ue.needsUpdate=!0,Wc(le,Y,K,Vt,ue,ee),ue.side=Xe,ue.needsUpdate=!0,Qt=!0}}Qt===!0&&(gt.updateMultisampleRenderTarget(_t),gt.updateRenderTargetMipmap(_t))}y.setRenderTarget(Nt,Dt,Ht),y.setClearColor(Z,j),Bt!==void 0&&(K.viewport=Bt),y.toneMapping=Xt}function Cr(w,H,Y){let K=H.isScene===!0?H.overrideMaterial:null;for(let G=0,_t=w.length;G<_t;G++){let Pt=w[G],Nt=Pt.object,Dt=Pt.geometry,Ht=Pt.group,Xt=Pt.material;Xt.allowOverride===!0&&K!==null&&(Xt=K),Nt.layers.test(Y.layers)&&Wc(Nt,H,Y,Dt,Xt,Ht)}}function Wc(w,H,Y,K,G,_t){w.onBeforeRender(y,H,Y,K,G,_t),w.modelViewMatrix.multiplyMatrices(Y.matrixWorldInverse,w.matrixWorld),w.normalMatrix.getNormalMatrix(w.modelViewMatrix),G.onBeforeRender(y,H,Y,K,w,_t),G.transparent===!0&&G.side===ke&&G.forceSinglePass===!1?(G.side=Ce,G.needsUpdate=!0,y.renderBufferDirect(Y,H,K,G,w,_t),G.side=Fn,G.needsUpdate=!0,y.renderBufferDirect(Y,H,K,G,w,_t),G.side=ke):y.renderBufferDirect(Y,H,K,G,w,_t),w.onAfterRender(y,H,Y,K,G,_t)}function Pr(w,H,Y){H.isScene!==!0&&(H=Tt);let K=ut.get(w),G=p.state.lights,_t=p.state.shadowsArray,Pt=G.state.version,Nt=N.getParameters(w,G.state,_t,H,Y),Dt=N.getProgramCacheKey(Nt),Ht=K.programs;K.environment=w.isMeshStandardMaterial?H.environment:null,K.fog=H.fog,K.envMap=(w.isMeshStandardMaterial?q:z).get(w.envMap||K.environment),K.envMapRotation=K.environment!==null&&w.envMap===null?H.environmentRotation:w.envMapRotation,Ht===void 0&&(w.addEventListener("dispose",nt),Ht=new Map,K.programs=Ht);let Xt=Ht.get(Dt);if(Xt!==void 0){if(K.currentProgram===Xt&&K.lightsStateVersion===Pt)return qc(w,Nt),Xt}else Nt.uniforms=N.getUniforms(w),w.onBeforeCompile(Nt,y),Xt=N.acquireProgram(Nt,Dt),Ht.set(Dt,Xt),K.uniforms=Nt.uniforms;let Bt=K.uniforms;return(!w.isShaderMaterial&&!w.isRawShaderMaterial||w.clipping===!0)&&(Bt.clippingPlanes=at.uniform),qc(w,Nt),K.needsLights=ju(w),K.lightsStateVersion=Pt,K.needsLights&&(Bt.ambientLightColor.value=G.state.ambient,Bt.lightProbe.value=G.state.probe,Bt.directionalLights.value=G.state.directional,Bt.directionalLightShadows.value=G.state.directionalShadow,Bt.spotLights.value=G.state.spot,Bt.spotLightShadows.value=G.state.spotShadow,Bt.rectAreaLights.value=G.state.rectArea,Bt.ltc_1.value=G.state.rectAreaLTC1,Bt.ltc_2.value=G.state.rectAreaLTC2,Bt.pointLights.value=G.state.point,Bt.pointLightShadows.value=G.state.pointShadow,Bt.hemisphereLights.value=G.state.hemi,Bt.directionalShadowMap.value=G.state.directionalShadowMap,Bt.directionalShadowMatrix.value=G.state.directionalShadowMatrix,Bt.spotShadowMap.value=G.state.spotShadowMap,Bt.spotLightMatrix.value=G.state.spotLightMatrix,Bt.spotLightMap.value=G.state.spotLightMap,Bt.pointShadowMap.value=G.state.pointShadowMap,Bt.pointShadowMatrix.value=G.state.pointShadowMatrix),K.currentProgram=Xt,K.uniformsList=null,Xt}function Xc(w){if(w.uniformsList===null){let H=w.currentProgram.getUniforms();w.uniformsList=hs.seqWithValue(H.seq,w.uniforms)}return w.uniformsList}function qc(w,H){let Y=ut.get(w);Y.outputColorSpace=H.outputColorSpace,Y.batching=H.batching,Y.batchingColor=H.batchingColor,Y.instancing=H.instancing,Y.instancingColor=H.instancingColor,Y.instancingMorph=H.instancingMorph,Y.skinning=H.skinning,Y.morphTargets=H.morphTargets,Y.morphNormals=H.morphNormals,Y.morphColors=H.morphColors,Y.morphTargetsCount=H.morphTargetsCount,Y.numClippingPlanes=H.numClippingPlanes,Y.numIntersection=H.numClipIntersection,Y.vertexAlphas=H.vertexAlphas,Y.vertexTangents=H.vertexTangents,Y.toneMapping=H.toneMapping}function $u(w,H,Y,K,G){H.isScene!==!0&&(H=Tt),gt.resetTextureUnits();let _t=H.fog,Pt=K.isMeshStandardMaterial?H.environment:null,Nt=D===null?y.outputColorSpace:D.isXRRenderTarget===!0?D.texture.colorSpace:ui,Dt=(K.isMeshStandardMaterial?q:z).get(K.envMap||Pt),Ht=K.vertexColors===!0&&!!Y.attributes.color&&Y.attributes.color.itemSize===4,Xt=!!Y.attributes.tangent&&(!!K.normalMap||K.anisotropy>0),Bt=!!Y.morphAttributes.position,Qt=!!Y.morphAttributes.normal,re=!!Y.morphAttributes.color,me=zn;K.toneMapped&&(D===null||D.isXRRenderTarget===!0)&&(me=y.toneMapping);let ce=Y.morphAttributes.position||Y.morphAttributes.normal||Y.morphAttributes.color,le=ce!==void 0?ce.length:0,Vt=ut.get(K),ue=p.state.lights;if(Ft===!0&&(tt===!0||w!==v)){let Fe=w===v&&K.id===b;at.setState(K,w,Fe)}let ee=!1;K.version===Vt.__version?(Vt.needsLights&&Vt.lightsStateVersion!==ue.state.version||Vt.outputColorSpace!==Nt||G.isBatchedMesh&&Vt.batching===!1||!G.isBatchedMesh&&Vt.batching===!0||G.isBatchedMesh&&Vt.batchingColor===!0&&G.colorTexture===null||G.isBatchedMesh&&Vt.batchingColor===!1&&G.colorTexture!==null||G.isInstancedMesh&&Vt.instancing===!1||!G.isInstancedMesh&&Vt.instancing===!0||G.isSkinnedMesh&&Vt.skinning===!1||!G.isSkinnedMesh&&Vt.skinning===!0||G.isInstancedMesh&&Vt.instancingColor===!0&&G.instanceColor===null||G.isInstancedMesh&&Vt.instancingColor===!1&&G.instanceColor!==null||G.isInstancedMesh&&Vt.instancingMorph===!0&&G.morphTexture===null||G.isInstancedMesh&&Vt.instancingMorph===!1&&G.morphTexture!==null||Vt.envMap!==Dt||K.fog===!0&&Vt.fog!==_t||Vt.numClippingPlanes!==void 0&&(Vt.numClippingPlanes!==at.numPlanes||Vt.numIntersection!==at.numIntersection)||Vt.vertexAlphas!==Ht||Vt.vertexTangents!==Xt||Vt.morphTargets!==Bt||Vt.morphNormals!==Qt||Vt.morphColors!==re||Vt.toneMapping!==me||Vt.morphTargetsCount!==le)&&(ee=!0):(ee=!0,Vt.__version=K.version);let Xe=Vt.currentProgram;ee===!0&&(Xe=Pr(K,H,G));let wi=!1,qe=!1,gs=!1,de=Xe.getUniforms(),sn=Vt.uniforms;if(Q.useProgram(Xe.program)&&(wi=!0,qe=!0,gs=!0),K.id!==b&&(b=K.id,qe=!0),wi||v!==w){Q.buffers.depth.getReversed()&&w.reversedDepth!==!0&&(w._reversedDepth=!0,w.updateProjectionMatrix()),de.setValue(U,"projectionMatrix",w.projectionMatrix),de.setValue(U,"viewMatrix",w.matrixWorldInverse);let Ve=de.map.cameraPosition;Ve!==void 0&&Ve.setValue(U,At.setFromMatrixPosition(w.matrixWorld)),et.logarithmicDepthBuffer&&de.setValue(U,"logDepthBufFC",2/(Math.log(w.far+1)/Math.LN2)),(K.isMeshPhongMaterial||K.isMeshToonMaterial||K.isMeshLambertMaterial||K.isMeshBasicMaterial||K.isMeshStandardMaterial||K.isShaderMaterial)&&de.setValue(U,"isOrthographic",w.isOrthographicCamera===!0),v!==w&&(v=w,qe=!0,gs=!0)}if(G.isSkinnedMesh){de.setOptional(U,G,"bindMatrix"),de.setOptional(U,G,"bindMatrixInverse");let Fe=G.skeleton;Fe&&(Fe.boneTexture===null&&Fe.computeBoneTexture(),de.setValue(U,"boneTexture",Fe.boneTexture,gt))}G.isBatchedMesh&&(de.setOptional(U,G,"batchingTexture"),de.setValue(U,"batchingTexture",G._matricesTexture,gt),de.setOptional(U,G,"batchingIdTexture"),de.setValue(U,"batchingIdTexture",G._indirectTexture,gt),de.setOptional(U,G,"batchingColorTexture"),G._colorsTexture!==null&&de.setValue(U,"batchingColorTexture",G._colorsTexture,gt));let rn=Y.morphAttributes;if((rn.position!==void 0||rn.normal!==void 0||rn.color!==void 0)&&st.update(G,Y,Xe),(qe||Vt.receiveShadow!==G.receiveShadow)&&(Vt.receiveShadow=G.receiveShadow,de.setValue(U,"receiveShadow",G.receiveShadow)),K.isMeshGouraudMaterial&&K.envMap!==null&&(sn.envMap.value=Dt,sn.flipEnvMap.value=Dt.isCubeTexture&&Dt.isRenderTargetTexture===!1?-1:1),K.isMeshStandardMaterial&&K.envMap===null&&H.environment!==null&&(sn.envMapIntensity.value=H.environmentIntensity),qe&&(de.setValue(U,"toneMappingExposure",y.toneMappingExposure),Vt.needsLights&&Ku(sn,gs),_t&&K.fog===!0&&V.refreshFogUniforms(sn,_t),V.refreshMaterialUniforms(sn,K,X,dt,p.state.transmissionRenderTarget[w.id]),hs.upload(U,Xc(Vt),sn,gt)),K.isShaderMaterial&&K.uniformsNeedUpdate===!0&&(hs.upload(U,Xc(Vt),sn,gt),K.uniformsNeedUpdate=!1),K.isSpriteMaterial&&de.setValue(U,"center",G.center),de.setValue(U,"modelViewMatrix",G.modelViewMatrix),de.setValue(U,"normalMatrix",G.normalMatrix),de.setValue(U,"modelMatrix",G.matrixWorld),K.isShaderMaterial||K.isRawShaderMaterial){let Fe=K.uniformsGroups;for(let Ve=0,nl=Fe.length;Ve<nl;Ve++){let ii=Fe[Ve];F.update(ii,Xe),F.bind(ii,Xe)}}return Xe}function Ku(w,H){w.ambientLightColor.needsUpdate=H,w.lightProbe.needsUpdate=H,w.directionalLights.needsUpdate=H,w.directionalLightShadows.needsUpdate=H,w.pointLights.needsUpdate=H,w.pointLightShadows.needsUpdate=H,w.spotLights.needsUpdate=H,w.spotLightShadows.needsUpdate=H,w.rectAreaLights.needsUpdate=H,w.hemisphereLights.needsUpdate=H}function ju(w){return w.isMeshLambertMaterial||w.isMeshToonMaterial||w.isMeshPhongMaterial||w.isMeshStandardMaterial||w.isShadowMaterial||w.isShaderMaterial&&w.lights===!0}this.getActiveCubeFace=function(){return A},this.getActiveMipmapLevel=function(){return P},this.getRenderTarget=function(){return D},this.setRenderTargetTextures=function(w,H,Y){let K=ut.get(w);K.__autoAllocateDepthBuffer=w.resolveDepthBuffer===!1,K.__autoAllocateDepthBuffer===!1&&(K.__useRenderToTexture=!1),ut.get(w.texture).__webglTexture=H,ut.get(w.depthTexture).__webglTexture=K.__autoAllocateDepthBuffer?void 0:Y,K.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(w,H){let Y=ut.get(w);Y.__webglFramebuffer=H,Y.__useDefaultFramebuffer=H===void 0};let Qu=U.createFramebuffer();this.setRenderTarget=function(w,H=0,Y=0){D=w,A=H,P=Y;let K=!0,G=null,_t=!1,Pt=!1;if(w){let Dt=ut.get(w);if(Dt.__useDefaultFramebuffer!==void 0)Q.bindFramebuffer(U.FRAMEBUFFER,null),K=!1;else if(Dt.__webglFramebuffer===void 0)gt.setupRenderTarget(w);else if(Dt.__hasExternalTextures)gt.rebindTextures(w,ut.get(w.texture).__webglTexture,ut.get(w.depthTexture).__webglTexture);else if(w.depthBuffer){let Bt=w.depthTexture;if(Dt.__boundDepthTexture!==Bt){if(Bt!==null&&ut.has(Bt)&&(w.width!==Bt.image.width||w.height!==Bt.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");gt.setupDepthRenderbuffer(w)}}let Ht=w.texture;(Ht.isData3DTexture||Ht.isDataArrayTexture||Ht.isCompressedArrayTexture)&&(Pt=!0);let Xt=ut.get(w).__webglFramebuffer;w.isWebGLCubeRenderTarget?(Array.isArray(Xt[H])?G=Xt[H][Y]:G=Xt[H],_t=!0):w.samples>0&&gt.useMultisampledRTT(w)===!1?G=ut.get(w).__webglMultisampledFramebuffer:Array.isArray(Xt)?G=Xt[Y]:G=Xt,L.copy(w.viewport),O.copy(w.scissor),W=w.scissorTest}else L.copy(wt).multiplyScalar(X).floor(),O.copy(Et).multiplyScalar(X).floor(),W=Ot;if(Y!==0&&(G=Qu),Q.bindFramebuffer(U.FRAMEBUFFER,G)&&K&&Q.drawBuffers(w,G),Q.viewport(L),Q.scissor(O),Q.setScissorTest(W),_t){let Dt=ut.get(w.texture);U.framebufferTexture2D(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_CUBE_MAP_POSITIVE_X+H,Dt.__webglTexture,Y)}else if(Pt){let Dt=H;for(let Ht=0;Ht<w.textures.length;Ht++){let Xt=ut.get(w.textures[Ht]);U.framebufferTextureLayer(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0+Ht,Xt.__webglTexture,Y,Dt)}}else if(w!==null&&Y!==0){let Dt=ut.get(w.texture);U.framebufferTexture2D(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_2D,Dt.__webglTexture,Y)}b=-1},this.readRenderTargetPixels=function(w,H,Y,K,G,_t,Pt,Nt=0){if(!(w&&w.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Dt=ut.get(w).__webglFramebuffer;if(w.isWebGLCubeRenderTarget&&Pt!==void 0&&(Dt=Dt[Pt]),Dt){Q.bindFramebuffer(U.FRAMEBUFFER,Dt);try{let Ht=w.textures[Nt],Xt=Ht.format,Bt=Ht.type;if(!et.textureFormatReadable(Xt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!et.textureTypeReadable(Bt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}H>=0&&H<=w.width-K&&Y>=0&&Y<=w.height-G&&(w.textures.length>1&&U.readBuffer(U.COLOR_ATTACHMENT0+Nt),U.readPixels(H,Y,K,G,It.convert(Xt),It.convert(Bt),_t))}finally{let Ht=D!==null?ut.get(D).__webglFramebuffer:null;Q.bindFramebuffer(U.FRAMEBUFFER,Ht)}}},this.readRenderTargetPixelsAsync=async function(w,H,Y,K,G,_t,Pt,Nt=0){if(!(w&&w.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Dt=ut.get(w).__webglFramebuffer;if(w.isWebGLCubeRenderTarget&&Pt!==void 0&&(Dt=Dt[Pt]),Dt)if(H>=0&&H<=w.width-K&&Y>=0&&Y<=w.height-G){Q.bindFramebuffer(U.FRAMEBUFFER,Dt);let Ht=w.textures[Nt],Xt=Ht.format,Bt=Ht.type;if(!et.textureFormatReadable(Xt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!et.textureTypeReadable(Bt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");let Qt=U.createBuffer();U.bindBuffer(U.PIXEL_PACK_BUFFER,Qt),U.bufferData(U.PIXEL_PACK_BUFFER,_t.byteLength,U.STREAM_READ),w.textures.length>1&&U.readBuffer(U.COLOR_ATTACHMENT0+Nt),U.readPixels(H,Y,K,G,It.convert(Xt),It.convert(Bt),0);let re=D!==null?ut.get(D).__webglFramebuffer:null;Q.bindFramebuffer(U.FRAMEBUFFER,re);let me=U.fenceSync(U.SYNC_GPU_COMMANDS_COMPLETE,0);return U.flush(),await ru(U,me,4),U.bindBuffer(U.PIXEL_PACK_BUFFER,Qt),U.getBufferSubData(U.PIXEL_PACK_BUFFER,0,_t),U.deleteBuffer(Qt),U.deleteSync(me),_t}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(w,H=null,Y=0){let K=Math.pow(2,-Y),G=Math.floor(w.image.width*K),_t=Math.floor(w.image.height*K),Pt=H!==null?H.x:0,Nt=H!==null?H.y:0;gt.setTexture2D(w,0),U.copyTexSubImage2D(U.TEXTURE_2D,Y,0,0,Pt,Nt,G,_t),Q.unbindTexture()};let td=U.createFramebuffer(),ed=U.createFramebuffer();this.copyTextureToTexture=function(w,H,Y=null,K=null,G=0,_t=null){_t===null&&(G!==0?(qi("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),_t=G,G=0):_t=0);let Pt,Nt,Dt,Ht,Xt,Bt,Qt,re,me,ce=w.isCompressedTexture?w.mipmaps[_t]:w.image;if(Y!==null)Pt=Y.max.x-Y.min.x,Nt=Y.max.y-Y.min.y,Dt=Y.isBox3?Y.max.z-Y.min.z:1,Ht=Y.min.x,Xt=Y.min.y,Bt=Y.isBox3?Y.min.z:0;else{let rn=Math.pow(2,-G);Pt=Math.floor(ce.width*rn),Nt=Math.floor(ce.height*rn),w.isDataArrayTexture?Dt=ce.depth:w.isData3DTexture?Dt=Math.floor(ce.depth*rn):Dt=1,Ht=0,Xt=0,Bt=0}K!==null?(Qt=K.x,re=K.y,me=K.z):(Qt=0,re=0,me=0);let le=It.convert(H.format),Vt=It.convert(H.type),ue;H.isData3DTexture?(gt.setTexture3D(H,0),ue=U.TEXTURE_3D):H.isDataArrayTexture||H.isCompressedArrayTexture?(gt.setTexture2DArray(H,0),ue=U.TEXTURE_2D_ARRAY):(gt.setTexture2D(H,0),ue=U.TEXTURE_2D),U.pixelStorei(U.UNPACK_FLIP_Y_WEBGL,H.flipY),U.pixelStorei(U.UNPACK_PREMULTIPLY_ALPHA_WEBGL,H.premultiplyAlpha),U.pixelStorei(U.UNPACK_ALIGNMENT,H.unpackAlignment);let ee=U.getParameter(U.UNPACK_ROW_LENGTH),Xe=U.getParameter(U.UNPACK_IMAGE_HEIGHT),wi=U.getParameter(U.UNPACK_SKIP_PIXELS),qe=U.getParameter(U.UNPACK_SKIP_ROWS),gs=U.getParameter(U.UNPACK_SKIP_IMAGES);U.pixelStorei(U.UNPACK_ROW_LENGTH,ce.width),U.pixelStorei(U.UNPACK_IMAGE_HEIGHT,ce.height),U.pixelStorei(U.UNPACK_SKIP_PIXELS,Ht),U.pixelStorei(U.UNPACK_SKIP_ROWS,Xt),U.pixelStorei(U.UNPACK_SKIP_IMAGES,Bt);let de=w.isDataArrayTexture||w.isData3DTexture,sn=H.isDataArrayTexture||H.isData3DTexture;if(w.isDepthTexture){let rn=ut.get(w),Fe=ut.get(H),Ve=ut.get(rn.__renderTarget),nl=ut.get(Fe.__renderTarget);Q.bindFramebuffer(U.READ_FRAMEBUFFER,Ve.__webglFramebuffer),Q.bindFramebuffer(U.DRAW_FRAMEBUFFER,nl.__webglFramebuffer);for(let ii=0;ii<Dt;ii++)de&&(U.framebufferTextureLayer(U.READ_FRAMEBUFFER,U.COLOR_ATTACHMENT0,ut.get(w).__webglTexture,G,Bt+ii),U.framebufferTextureLayer(U.DRAW_FRAMEBUFFER,U.COLOR_ATTACHMENT0,ut.get(H).__webglTexture,_t,me+ii)),U.blitFramebuffer(Ht,Xt,Pt,Nt,Qt,re,Pt,Nt,U.DEPTH_BUFFER_BIT,U.NEAREST);Q.bindFramebuffer(U.READ_FRAMEBUFFER,null),Q.bindFramebuffer(U.DRAW_FRAMEBUFFER,null)}else if(G!==0||w.isRenderTargetTexture||ut.has(w)){let rn=ut.get(w),Fe=ut.get(H);Q.bindFramebuffer(U.READ_FRAMEBUFFER,td),Q.bindFramebuffer(U.DRAW_FRAMEBUFFER,ed);for(let Ve=0;Ve<Dt;Ve++)de?U.framebufferTextureLayer(U.READ_FRAMEBUFFER,U.COLOR_ATTACHMENT0,rn.__webglTexture,G,Bt+Ve):U.framebufferTexture2D(U.READ_FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_2D,rn.__webglTexture,G),sn?U.framebufferTextureLayer(U.DRAW_FRAMEBUFFER,U.COLOR_ATTACHMENT0,Fe.__webglTexture,_t,me+Ve):U.framebufferTexture2D(U.DRAW_FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_2D,Fe.__webglTexture,_t),G!==0?U.blitFramebuffer(Ht,Xt,Pt,Nt,Qt,re,Pt,Nt,U.COLOR_BUFFER_BIT,U.NEAREST):sn?U.copyTexSubImage3D(ue,_t,Qt,re,me+Ve,Ht,Xt,Pt,Nt):U.copyTexSubImage2D(ue,_t,Qt,re,Ht,Xt,Pt,Nt);Q.bindFramebuffer(U.READ_FRAMEBUFFER,null),Q.bindFramebuffer(U.DRAW_FRAMEBUFFER,null)}else sn?w.isDataTexture||w.isData3DTexture?U.texSubImage3D(ue,_t,Qt,re,me,Pt,Nt,Dt,le,Vt,ce.data):H.isCompressedArrayTexture?U.compressedTexSubImage3D(ue,_t,Qt,re,me,Pt,Nt,Dt,le,ce.data):U.texSubImage3D(ue,_t,Qt,re,me,Pt,Nt,Dt,le,Vt,ce):w.isDataTexture?U.texSubImage2D(U.TEXTURE_2D,_t,Qt,re,Pt,Nt,le,Vt,ce.data):w.isCompressedTexture?U.compressedTexSubImage2D(U.TEXTURE_2D,_t,Qt,re,ce.width,ce.height,le,ce.data):U.texSubImage2D(U.TEXTURE_2D,_t,Qt,re,Pt,Nt,le,Vt,ce);U.pixelStorei(U.UNPACK_ROW_LENGTH,ee),U.pixelStorei(U.UNPACK_IMAGE_HEIGHT,Xe),U.pixelStorei(U.UNPACK_SKIP_PIXELS,wi),U.pixelStorei(U.UNPACK_SKIP_ROWS,qe),U.pixelStorei(U.UNPACK_SKIP_IMAGES,gs),_t===0&&H.generateMipmaps&&U.generateMipmap(ue),Q.unbindTexture()},this.initRenderTarget=function(w){ut.get(w).__webglFramebuffer===void 0&&gt.setupRenderTarget(w)},this.initTexture=function(w){w.isCubeTexture?gt.setTextureCube(w,0):w.isData3DTexture?gt.setTexture3D(w,0):w.isDataArrayTexture||w.isCompressedArrayTexture?gt.setTexture2DArray(w,0):gt.setTexture2D(w,0),Q.unbindTexture()},this.resetState=function(){A=0,P=0,D=null,Q.reset(),yt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return gn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;let e=this.getContext();e.drawingBufferColorSpace=te._getDrawingBufferColorSpace(t),e.unpackColorSpace=te._getUnpackColorSpace()}};var Vu={type:"change"},Bc={type:"start"},Wu={type:"end"},Ha=new On,Hu=new an,s_=Math.cos(70*yn.DEG2RAD),Te=new C,We=2*Math.PI,ae={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},Oc=1e-6,Gu=class extends cr{constructor(t,e=null){super(t,e),this.state=ae.NONE,this.target=new C,this.cursor=new C,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.keyRotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:Kn.ROTATE,MIDDLE:Kn.DOLLY,RIGHT:Kn.PAN},this.touches={ONE:jn.ROTATE,TWO:jn.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this._lastPosition=new C,this._lastQuaternion=new cn,this._lastTargetPosition=new C,this._quat=new cn().setFromUnitVectors(t.up,new C(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new rs,this._sphericalDelta=new rs,this._scale=1,this._panOffset=new C,this._rotateStart=new lt,this._rotateEnd=new lt,this._rotateDelta=new lt,this._panStart=new lt,this._panEnd=new lt,this._panDelta=new lt,this._dollyStart=new lt,this._dollyEnd=new lt,this._dollyDelta=new lt,this._dollyDirection=new C,this._mouse=new lt,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=o_.bind(this),this._onPointerDown=r_.bind(this),this._onPointerUp=a_.bind(this),this._onContextMenu=p_.bind(this),this._onMouseWheel=h_.bind(this),this._onKeyDown=u_.bind(this),this._onTouchStart=d_.bind(this),this._onTouchMove=f_.bind(this),this._onMouseDown=l_.bind(this),this._onMouseMove=c_.bind(this),this._interceptControlDown=m_.bind(this),this._interceptControlUp=g_.bind(this),this.domElement!==null&&this.connect(this.domElement),this.update()}connect(t){super.connect(t),this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents(),this.domElement.getRootNode().removeEventListener("keydown",this._interceptControlDown,{capture:!0}),this.domElement.style.touchAction="auto"}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(t){t.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=t}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(Vu),this.update(),this.state=ae.NONE}update(t=null){let e=this.object.position;Te.copy(e).sub(this.target),Te.applyQuaternion(this._quat),this._spherical.setFromVector3(Te),this.autoRotate&&this.state===ae.NONE&&this._rotateLeft(this._getAutoRotationAngle(t)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let n=this.minAzimuthAngle,s=this.maxAzimuthAngle;isFinite(n)&&isFinite(s)&&(n<-Math.PI?n+=We:n>Math.PI&&(n-=We),s<-Math.PI?s+=We:s>Math.PI&&(s-=We),n<=s?this._spherical.theta=Math.max(n,Math.min(s,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(n+s)/2?Math.max(n,this._spherical.theta):Math.min(s,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let r=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{let o=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),r=o!=this._spherical.radius}if(Te.setFromSpherical(this._spherical),Te.applyQuaternion(this._quatInverse),e.copy(this.target).add(Te),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let o=null;if(this.object.isPerspectiveCamera){let a=Te.length();o=this._clampDistance(a*this._scale);let c=a-o;this.object.position.addScaledVector(this._dollyDirection,c),this.object.updateMatrixWorld(),r=!!c}else if(this.object.isOrthographicCamera){let a=new C(this._mouse.x,this._mouse.y,0);a.unproject(this.object);let c=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),r=c!==this.object.zoom;let l=new C(this._mouse.x,this._mouse.y,0);l.unproject(this.object),this.object.position.sub(l).add(a),this.object.updateMatrixWorld(),o=Te.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;o!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(o).add(this.object.position):(Ha.origin.copy(this.object.position),Ha.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(Ha.direction))<s_?this.object.lookAt(this.target):(Hu.setFromNormalAndCoplanarPoint(this.object.up,this.target),Ha.intersectPlane(Hu,this.target))))}else if(this.object.isOrthographicCamera){let o=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),o!==this.object.zoom&&(this.object.updateProjectionMatrix(),r=!0)}return this._scale=1,this._performCursorZoom=!1,r||this._lastPosition.distanceToSquared(this.object.position)>Oc||8*(1-this._lastQuaternion.dot(this.object.quaternion))>Oc||this._lastTargetPosition.distanceToSquared(this.target)>Oc?(this.dispatchEvent(Vu),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(t){return t!==null?We/60*this.autoRotateSpeed*t:We/60/60*this.autoRotateSpeed}_getZoomScale(t){let e=Math.abs(t*.01);return Math.pow(.95,this.zoomSpeed*e)}_rotateLeft(t){this._sphericalDelta.theta-=t}_rotateUp(t){this._sphericalDelta.phi-=t}_panLeft(t,e){Te.setFromMatrixColumn(e,0),Te.multiplyScalar(-t),this._panOffset.add(Te)}_panUp(t,e){this.screenSpacePanning===!0?Te.setFromMatrixColumn(e,1):(Te.setFromMatrixColumn(e,0),Te.crossVectors(this.object.up,Te)),Te.multiplyScalar(t),this._panOffset.add(Te)}_pan(t,e){let n=this.domElement;if(this.object.isPerspectiveCamera){let s=this.object.position;Te.copy(s).sub(this.target);let r=Te.length();r*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*t*r/n.clientHeight,this.object.matrix),this._panUp(2*e*r/n.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(t*(this.object.right-this.object.left)/this.object.zoom/n.clientWidth,this.object.matrix),this._panUp(e*(this.object.top-this.object.bottom)/this.object.zoom/n.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(t){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=t:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(t){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=t:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(t,e){if(!this.zoomToCursor)return;this._performCursorZoom=!0;let n=this.domElement.getBoundingClientRect(),s=t-n.left,r=e-n.top,o=n.width,a=n.height;this._mouse.x=s/o*2-1,this._mouse.y=-(r/a)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(t){return Math.max(this.minDistance,Math.min(this.maxDistance,t))}_handleMouseDownRotate(t){this._rotateStart.set(t.clientX,t.clientY)}_handleMouseDownDolly(t){this._updateZoomParameters(t.clientX,t.clientX),this._dollyStart.set(t.clientX,t.clientY)}_handleMouseDownPan(t){this._panStart.set(t.clientX,t.clientY)}_handleMouseMoveRotate(t){this._rotateEnd.set(t.clientX,t.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);let e=this.domElement;this._rotateLeft(We*this._rotateDelta.x/e.clientHeight),this._rotateUp(We*this._rotateDelta.y/e.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(t){this._dollyEnd.set(t.clientX,t.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(t){this._panEnd.set(t.clientX,t.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(t){this._updateZoomParameters(t.clientX,t.clientY),t.deltaY<0?this._dollyIn(this._getZoomScale(t.deltaY)):t.deltaY>0&&this._dollyOut(this._getZoomScale(t.deltaY)),this.update()}_handleKeyDown(t){let e=!1;switch(t.code){case this.keys.UP:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateUp(We*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,this.keyPanSpeed),e=!0;break;case this.keys.BOTTOM:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateUp(-We*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,-this.keyPanSpeed),e=!0;break;case this.keys.LEFT:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateLeft(We*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(this.keyPanSpeed,0),e=!0;break;case this.keys.RIGHT:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateLeft(-We*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(-this.keyPanSpeed,0),e=!0;break}e&&(t.preventDefault(),this.update())}_handleTouchStartRotate(t){if(this._pointers.length===1)this._rotateStart.set(t.pageX,t.pageY);else{let e=this._getSecondPointerPosition(t),n=.5*(t.pageX+e.x),s=.5*(t.pageY+e.y);this._rotateStart.set(n,s)}}_handleTouchStartPan(t){if(this._pointers.length===1)this._panStart.set(t.pageX,t.pageY);else{let e=this._getSecondPointerPosition(t),n=.5*(t.pageX+e.x),s=.5*(t.pageY+e.y);this._panStart.set(n,s)}}_handleTouchStartDolly(t){let e=this._getSecondPointerPosition(t),n=t.pageX-e.x,s=t.pageY-e.y,r=Math.sqrt(n*n+s*s);this._dollyStart.set(0,r)}_handleTouchStartDollyPan(t){this.enableZoom&&this._handleTouchStartDolly(t),this.enablePan&&this._handleTouchStartPan(t)}_handleTouchStartDollyRotate(t){this.enableZoom&&this._handleTouchStartDolly(t),this.enableRotate&&this._handleTouchStartRotate(t)}_handleTouchMoveRotate(t){if(this._pointers.length==1)this._rotateEnd.set(t.pageX,t.pageY);else{let n=this._getSecondPointerPosition(t),s=.5*(t.pageX+n.x),r=.5*(t.pageY+n.y);this._rotateEnd.set(s,r)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);let e=this.domElement;this._rotateLeft(We*this._rotateDelta.x/e.clientHeight),this._rotateUp(We*this._rotateDelta.y/e.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(t){if(this._pointers.length===1)this._panEnd.set(t.pageX,t.pageY);else{let e=this._getSecondPointerPosition(t),n=.5*(t.pageX+e.x),s=.5*(t.pageY+e.y);this._panEnd.set(n,s)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(t){let e=this._getSecondPointerPosition(t),n=t.pageX-e.x,s=t.pageY-e.y,r=Math.sqrt(n*n+s*s);this._dollyEnd.set(0,r),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);let o=(t.pageX+e.x)*.5,a=(t.pageY+e.y)*.5;this._updateZoomParameters(o,a)}_handleTouchMoveDollyPan(t){this.enableZoom&&this._handleTouchMoveDolly(t),this.enablePan&&this._handleTouchMovePan(t)}_handleTouchMoveDollyRotate(t){this.enableZoom&&this._handleTouchMoveDolly(t),this.enableRotate&&this._handleTouchMoveRotate(t)}_addPointer(t){this._pointers.push(t.pointerId)}_removePointer(t){delete this._pointerPositions[t.pointerId];for(let e=0;e<this._pointers.length;e++)if(this._pointers[e]==t.pointerId){this._pointers.splice(e,1);return}}_isTrackingPointer(t){for(let e=0;e<this._pointers.length;e++)if(this._pointers[e]==t.pointerId)return!0;return!1}_trackPointer(t){let e=this._pointerPositions[t.pointerId];e===void 0&&(e=new lt,this._pointerPositions[t.pointerId]=e),e.set(t.pageX,t.pageY)}_getSecondPointerPosition(t){let e=t.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[e]}_customWheelEvent(t){let e=t.deltaMode,n={clientX:t.clientX,clientY:t.clientY,deltaY:t.deltaY};switch(e){case 1:n.deltaY*=16;break;case 2:n.deltaY*=100;break}return t.ctrlKey&&!this._controlActive&&(n.deltaY*=10),n}};function r_(i){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(i.pointerId),this.domElement.addEventListener("pointermove",this._onPointerMove),this.domElement.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(i)&&(this._addPointer(i),i.pointerType==="touch"?this._onTouchStart(i):this._onMouseDown(i)))}function o_(i){this.enabled!==!1&&(i.pointerType==="touch"?this._onTouchMove(i):this._onMouseMove(i))}function a_(i){switch(this._removePointer(i),this._pointers.length){case 0:this.domElement.releasePointerCapture(i.pointerId),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(Wu),this.state=ae.NONE;break;case 1:let t=this._pointers[0],e=this._pointerPositions[t];this._onTouchStart({pointerId:t,pageX:e.x,pageY:e.y});break}}function l_(i){let t;switch(i.button){case 0:t=this.mouseButtons.LEFT;break;case 1:t=this.mouseButtons.MIDDLE;break;case 2:t=this.mouseButtons.RIGHT;break;default:t=-1}switch(t){case Kn.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(i),this.state=ae.DOLLY;break;case Kn.ROTATE:if(i.ctrlKey||i.metaKey||i.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(i),this.state=ae.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(i),this.state=ae.ROTATE}break;case Kn.PAN:if(i.ctrlKey||i.metaKey||i.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(i),this.state=ae.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(i),this.state=ae.PAN}break;default:this.state=ae.NONE}this.state!==ae.NONE&&this.dispatchEvent(Bc)}function c_(i){switch(this.state){case ae.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(i);break;case ae.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(i);break;case ae.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(i);break}}function h_(i){this.enabled===!1||this.enableZoom===!1||this.state!==ae.NONE||(i.preventDefault(),this.dispatchEvent(Bc),this._handleMouseWheel(this._customWheelEvent(i)),this.dispatchEvent(Wu))}function u_(i){this.enabled!==!1&&this._handleKeyDown(i)}function d_(i){switch(this._trackPointer(i),this._pointers.length){case 1:switch(this.touches.ONE){case jn.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(i),this.state=ae.TOUCH_ROTATE;break;case jn.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(i),this.state=ae.TOUCH_PAN;break;default:this.state=ae.NONE}break;case 2:switch(this.touches.TWO){case jn.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(i),this.state=ae.TOUCH_DOLLY_PAN;break;case jn.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(i),this.state=ae.TOUCH_DOLLY_ROTATE;break;default:this.state=ae.NONE}break;default:this.state=ae.NONE}this.state!==ae.NONE&&this.dispatchEvent(Bc)}function f_(i){switch(this._trackPointer(i),this.state){case ae.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(i),this.update();break;case ae.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(i),this.update();break;case ae.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(i),this.update();break;case ae.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(i),this.update();break;default:this.state=ae.NONE}}function p_(i){this.enabled!==!1&&i.preventDefault()}function m_(i){i.key==="Control"&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function g_(i){i.key==="Control"&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}var Ga=class extends zs{constructor(){super();let t=new Tn;t.deleteAttribute("uv");let e=new Se({side:Ce}),n=new Se,s=new ar(16777215,900,28,2);s.position.set(.418,16.199,.3),this.add(s);let r=new ie(t,e);r.position.set(-.757,13.219,.717),r.scale.set(31.713,28.305,28.591),this.add(r);let o=new _n(t,n,6),a=new ge;a.position.set(-10.906,2.009,1.846),a.rotation.set(0,-.195,0),a.scale.set(2.328,7.905,4.651),a.updateMatrix(),o.setMatrixAt(0,a.matrix),a.position.set(-5.607,-.754,-.758),a.rotation.set(0,.994,0),a.scale.set(1.97,1.534,3.955),a.updateMatrix(),o.setMatrixAt(1,a.matrix),a.position.set(6.167,.857,7.803),a.rotation.set(0,.561,0),a.scale.set(3.927,6.285,3.687),a.updateMatrix(),o.setMatrixAt(2,a.matrix),a.position.set(-2.017,.018,6.124),a.rotation.set(0,.333,0),a.scale.set(2.002,4.566,2.064),a.updateMatrix(),o.setMatrixAt(3,a.matrix),a.position.set(2.291,-.756,-2.621),a.rotation.set(0,-.286,0),a.scale.set(1.546,1.552,1.496),a.updateMatrix(),o.setMatrixAt(4,a.matrix),a.position.set(-2.193,-.369,-5.547),a.rotation.set(0,.516,0),a.scale.set(3.875,3.487,2.986),a.updateMatrix(),o.setMatrixAt(5,a.matrix),this.add(o);let c=new ie(t,fs(50));c.position.set(-16.116,14.37,8.208),c.scale.set(.1,2.428,2.739),this.add(c);let l=new ie(t,fs(50));l.position.set(-16.109,18.021,-8.207),l.scale.set(.1,2.425,2.751),this.add(l);let h=new ie(t,fs(17));h.position.set(14.904,12.198,-1.832),h.scale.set(.15,4.265,6.331),this.add(h);let d=new ie(t,fs(43));d.position.set(-.462,8.89,14.52),d.scale.set(4.38,5.441,.088),this.add(d);let f=new ie(t,fs(20));f.position.set(3.235,11.486,-12.541),f.scale.set(2.5,2,.1),this.add(f);let u=new ie(t,fs(100));u.position.set(0,20,0),u.scale.set(1,.1,1),this.add(u)}dispose(){let t=new Set;this.traverse(e=>{e.isMesh&&(t.add(e.geometry),t.add(e.material))});for(let e of t)e.dispose()}};function fs(i){return new rr({color:0,emissive:16777215,emissiveIntensity:i})}var ps={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;


		}`};var en=class{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}},__=new gi(-1,1,1,-1,0,1),zc=class extends oe{constructor(){super(),this.setAttribute("position",new kt([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new kt([0,2,0,0,2,0],2))}},x_=new zc,ni=class{constructor(t){this._mesh=new ie(x_,t)}dispose(){this._mesh.geometry.dispose()}render(t){t.render(this._mesh,__)}get material(){return this._mesh.material}set material(t){this._mesh.material=t}};var Wa=class extends en{constructor(t,e="tDiffuse"){super(),this.textureID=e,this.uniforms=null,this.material=null,t instanceof xe?(this.uniforms=t.uniforms,this.material=t):t&&(this.uniforms=un.clone(t.uniforms),this.material=new xe({name:t.name!==void 0?t.name:"unspecified",defines:Object.assign({},t.defines),uniforms:this.uniforms,vertexShader:t.vertexShader,fragmentShader:t.fragmentShader})),this._fsQuad=new ni(this.material)}render(t,e,n){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=n.texture),this._fsQuad.material=this.material,this.renderToScreen?(t.setRenderTarget(null),this._fsQuad.render(t)):(t.setRenderTarget(e),this.clear&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),this._fsQuad.render(t))}dispose(){this.material.dispose(),this._fsQuad.dispose()}};var yr=class extends en{constructor(t,e){super(),this.scene=t,this.camera=e,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(t,e,n){let s=t.getContext(),r=t.state;r.buffers.color.setMask(!1),r.buffers.depth.setMask(!1),r.buffers.color.setLocked(!0),r.buffers.depth.setLocked(!0);let o,a;this.inverse?(o=0,a=1):(o=1,a=0),r.buffers.stencil.setTest(!0),r.buffers.stencil.setOp(s.REPLACE,s.REPLACE,s.REPLACE),r.buffers.stencil.setFunc(s.ALWAYS,o,4294967295),r.buffers.stencil.setClear(a),r.buffers.stencil.setLocked(!0),t.setRenderTarget(n),this.clear&&t.clear(),t.render(this.scene,this.camera),t.setRenderTarget(e),this.clear&&t.clear(),t.render(this.scene,this.camera),r.buffers.color.setLocked(!1),r.buffers.depth.setLocked(!1),r.buffers.color.setMask(!0),r.buffers.depth.setMask(!0),r.buffers.stencil.setLocked(!1),r.buffers.stencil.setFunc(s.EQUAL,1,4294967295),r.buffers.stencil.setOp(s.KEEP,s.KEEP,s.KEEP),r.buffers.stencil.setLocked(!0)}},Xa=class extends en{constructor(){super(),this.needsSwap=!1}render(t){t.state.buffers.stencil.setLocked(!1),t.state.buffers.stencil.setTest(!1)}};var qa=class{constructor(t,e){if(this.renderer=t,this._pixelRatio=t.getPixelRatio(),e===void 0){let n=t.getSize(new lt);this._width=n.width,this._height=n.height,e=new ze(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:vn}),e.texture.name="EffectComposer.rt1"}else this._width=e.width,this._height=e.height;this.renderTarget1=e,this.renderTarget2=e.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new Wa(ps),this.copyPass.material.blending=ye,this.clock=new lr}swapBuffers(){let t=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=t}addPass(t){this.passes.push(t),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(t,e){this.passes.splice(e,0,t),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(t){let e=this.passes.indexOf(t);e!==-1&&this.passes.splice(e,1)}isLastEnabledPass(t){for(let e=t+1;e<this.passes.length;e++)if(this.passes[e].enabled)return!1;return!0}render(t){t===void 0&&(t=this.clock.getDelta());let e=this.renderer.getRenderTarget(),n=!1;for(let s=0,r=this.passes.length;s<r;s++){let o=this.passes[s];if(o.enabled!==!1){if(o.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(s),o.render(this.renderer,this.writeBuffer,this.readBuffer,t,n),o.needsSwap){if(n){let a=this.renderer.getContext(),c=this.renderer.state.buffers.stencil;c.setFunc(a.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,t),c.setFunc(a.EQUAL,1,4294967295)}this.swapBuffers()}yr!==void 0&&(o instanceof yr?n=!0:o instanceof Xa&&(n=!1))}}this.renderer.setRenderTarget(e)}reset(t){if(t===void 0){let e=this.renderer.getSize(new lt);this._pixelRatio=this.renderer.getPixelRatio(),this._width=e.width,this._height=e.height,t=this.renderTarget1.clone(),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=t,this.renderTarget2=t.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(t,e){this._width=t,this._height=e;let n=this._width*this._pixelRatio,s=this._height*this._pixelRatio;this.renderTarget1.setSize(n,s),this.renderTarget2.setSize(n,s);for(let r=0;r<this.passes.length;r++)this.passes[r].setSize(n,s)}setPixelRatio(t){this._pixelRatio=t,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}};var Ya=class extends en{constructor(t,e,n=null,s=null,r=null){super(),this.scene=t,this.camera=e,this.overrideMaterial=n,this.clearColor=s,this.clearAlpha=r,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this._oldClearColor=new zt}render(t,e,n){let s=t.autoClear;t.autoClear=!1;let r,o;this.overrideMaterial!==null&&(o=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(t.getClearColor(this._oldClearColor),t.setClearColor(this.clearColor,t.getClearAlpha())),this.clearAlpha!==null&&(r=t.getClearAlpha(),t.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&t.clearDepth(),t.setRenderTarget(this.renderToScreen?null:n),this.clear===!0&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),t.render(this.scene,this.camera),this.clearColor!==null&&t.setClearColor(this._oldClearColor),this.clearAlpha!==null&&t.setClearAlpha(r),this.overrideMaterial!==null&&(this.scene.overrideMaterial=o),t.autoClear=s}};var Mr={name:"GTAOShader",defines:{PERSPECTIVE_CAMERA:1,SAMPLES:16,NORMAL_VECTOR_TYPE:1,DEPTH_SWIZZLING:"x",SCREEN_SPACE_RADIUS:0,SCREEN_SPACE_RADIUS_SCALE:100,SCENE_CLIP_BOX:0},uniforms:{tNormal:{value:null},tDepth:{value:null},tNoise:{value:null},resolution:{value:new lt},cameraNear:{value:null},cameraFar:{value:null},cameraProjectionMatrix:{value:new jt},cameraProjectionMatrixInverse:{value:new jt},cameraWorldMatrix:{value:new jt},radius:{value:.25},distanceExponent:{value:1},thickness:{value:1},distanceFallOff:{value:1},scale:{value:1},sceneBoxMin:{value:new C(-1,-1,-1)},sceneBoxMax:{value:new C(1,1,1)}},vertexShader:`

		varying vec2 vUv;

		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}`,fragmentShader:`
		varying vec2 vUv;
		uniform highp sampler2D tNormal;
		uniform highp sampler2D tDepth;
		uniform sampler2D tNoise;
		uniform vec2 resolution;
		uniform float cameraNear;
		uniform float cameraFar;
		uniform mat4 cameraProjectionMatrix;
		uniform mat4 cameraProjectionMatrixInverse;
		uniform mat4 cameraWorldMatrix;
		uniform float radius;
		uniform float distanceExponent;
		uniform float thickness;
		uniform float distanceFallOff;
		uniform float scale;
		#if SCENE_CLIP_BOX == 1
			uniform vec3 sceneBoxMin;
			uniform vec3 sceneBoxMax;
		#endif

		#include <common>
		#include <packing>

		#ifndef FRAGMENT_OUTPUT
		#define FRAGMENT_OUTPUT vec4(vec3(ao), 1.)
		#endif

		vec3 getViewPosition(const in vec2 screenPosition, const in float depth) {
			vec4 clipSpacePosition = vec4(vec3(screenPosition, depth) * 2.0 - 1.0, 1.0);
			vec4 viewSpacePosition = cameraProjectionMatrixInverse * clipSpacePosition;
			return viewSpacePosition.xyz / viewSpacePosition.w;
		}

		float getDepth(const vec2 uv) {
			return textureLod(tDepth, uv.xy, 0.0).DEPTH_SWIZZLING;
		}

		float fetchDepth(const ivec2 uv) {
			return texelFetch(tDepth, uv.xy, 0).DEPTH_SWIZZLING;
		}

		float getViewZ(const in float depth) {
			#if PERSPECTIVE_CAMERA == 1
				return perspectiveDepthToViewZ(depth, cameraNear, cameraFar);
			#else
				return orthographicDepthToViewZ(depth, cameraNear, cameraFar);
			#endif
		}

		vec3 computeNormalFromDepth(const vec2 uv) {
			vec2 size = vec2(textureSize(tDepth, 0));
			ivec2 p = ivec2(uv * size);
			float c0 = fetchDepth(p);
			float l2 = fetchDepth(p - ivec2(2, 0));
			float l1 = fetchDepth(p - ivec2(1, 0));
			float r1 = fetchDepth(p + ivec2(1, 0));
			float r2 = fetchDepth(p + ivec2(2, 0));
			float b2 = fetchDepth(p - ivec2(0, 2));
			float b1 = fetchDepth(p - ivec2(0, 1));
			float t1 = fetchDepth(p + ivec2(0, 1));
			float t2 = fetchDepth(p + ivec2(0, 2));
			float dl = abs((2.0 * l1 - l2) - c0);
			float dr = abs((2.0 * r1 - r2) - c0);
			float db = abs((2.0 * b1 - b2) - c0);
			float dt = abs((2.0 * t1 - t2) - c0);
			vec3 ce = getViewPosition(uv, c0).xyz;
			vec3 dpdx = (dl < dr) ? ce - getViewPosition((uv - vec2(1.0 / size.x, 0.0)), l1).xyz : -ce + getViewPosition((uv + vec2(1.0 / size.x, 0.0)), r1).xyz;
			vec3 dpdy = (db < dt) ? ce - getViewPosition((uv - vec2(0.0, 1.0 / size.y)), b1).xyz : -ce + getViewPosition((uv + vec2(0.0, 1.0 / size.y)), t1).xyz;
			return normalize(cross(dpdx, dpdy));
		}

		vec3 getViewNormal(const vec2 uv) {
			#if NORMAL_VECTOR_TYPE == 2
				return normalize(textureLod(tNormal, uv, 0.).rgb);
			#elif NORMAL_VECTOR_TYPE == 1
				return unpackRGBToNormal(textureLod(tNormal, uv, 0.).rgb);
			#else
				return computeNormalFromDepth(uv);
			#endif
		}

		vec3 getSceneUvAndDepth(vec3 sampleViewPos) {
			vec4 sampleClipPos = cameraProjectionMatrix * vec4(sampleViewPos, 1.);
			vec2 sampleUv = sampleClipPos.xy / sampleClipPos.w * 0.5 + 0.5;
			float sampleSceneDepth = getDepth(sampleUv);
			return vec3(sampleUv, sampleSceneDepth);
		}

		void main() {
			float depth = getDepth(vUv.xy);
			if (depth >= 1.0) {
				discard;
				return;
			}
			vec3 viewPos = getViewPosition(vUv, depth);
			vec3 viewNormal = getViewNormal(vUv);

			float radiusToUse = radius;
			float distanceFalloffToUse = thickness;
			#if SCREEN_SPACE_RADIUS == 1
				float radiusScale = getViewPosition(vec2(0.5 + float(SCREEN_SPACE_RADIUS_SCALE) / resolution.x, 0.0), depth).x;
				radiusToUse *= radiusScale;
				distanceFalloffToUse *= radiusScale;
			#endif

			#if SCENE_CLIP_BOX == 1
				vec3 worldPos = (cameraWorldMatrix * vec4(viewPos, 1.0)).xyz;
				float boxDistance = length(max(vec3(0.0), max(sceneBoxMin - worldPos, worldPos - sceneBoxMax)));
				if (boxDistance > radiusToUse) {
					discard;
					return;
				}
			#endif

			vec2 noiseResolution = vec2(textureSize(tNoise, 0));
			vec2 noiseUv = vUv * resolution / noiseResolution;
			vec4 noiseTexel = textureLod(tNoise, noiseUv, 0.0);
			vec3 randomVec = noiseTexel.xyz * 2.0 - 1.0;
			vec3 tangent = normalize(vec3(randomVec.xy, 0.));
			vec3 bitangent = vec3(-tangent.y, tangent.x, 0.);
			mat3 kernelMatrix = mat3(tangent, bitangent, vec3(0., 0., 1.));

			const int DIRECTIONS = SAMPLES < 30 ? 3 : 5;
			const int STEPS = (SAMPLES + DIRECTIONS - 1) / DIRECTIONS;
			float ao = 0.0;
			for (int i = 0; i < DIRECTIONS; ++i) {

				float angle = float(i) / float(DIRECTIONS) * PI;
				vec4 sampleDir = vec4(cos(angle), sin(angle), 0., 0.5 + 0.5 * noiseTexel.w);
				sampleDir.xyz = normalize(kernelMatrix * sampleDir.xyz);

				vec3 viewDir = normalize(-viewPos.xyz);
				vec3 sliceBitangent = normalize(cross(sampleDir.xyz, viewDir));
				vec3 sliceTangent = cross(sliceBitangent, viewDir);
				vec3 normalInSlice = normalize(viewNormal - sliceBitangent * dot(viewNormal, sliceBitangent));

				vec3 tangentToNormalInSlice = cross(normalInSlice, sliceBitangent);
				vec2 cosHorizons = vec2(dot(viewDir, tangentToNormalInSlice), dot(viewDir, -tangentToNormalInSlice));

				for (int j = 0; j < STEPS; ++j) {
					vec3 sampleViewOffset = sampleDir.xyz * radiusToUse * sampleDir.w * pow(float(j + 1) / float(STEPS), distanceExponent);

					vec3 sampleSceneUvDepth = getSceneUvAndDepth(viewPos + sampleViewOffset);
					vec3 sampleSceneViewPos = getViewPosition(sampleSceneUvDepth.xy, sampleSceneUvDepth.z);
					vec3 viewDelta = sampleSceneViewPos - viewPos;
					if (abs(viewDelta.z) < thickness) {
						float sampleCosHorizon = dot(viewDir, normalize(viewDelta));
						cosHorizons.x += max(0., (sampleCosHorizon - cosHorizons.x) * mix(1., 2. / float(j + 2), distanceFallOff));
					}

					sampleSceneUvDepth = getSceneUvAndDepth(viewPos - sampleViewOffset);
					sampleSceneViewPos = getViewPosition(sampleSceneUvDepth.xy, sampleSceneUvDepth.z);
					viewDelta = sampleSceneViewPos - viewPos;
					if (abs(viewDelta.z) < thickness) {
						float sampleCosHorizon = dot(viewDir, normalize(viewDelta));
						cosHorizons.y += max(0., (sampleCosHorizon - cosHorizons.y) * mix(1., 2. / float(j + 2), distanceFallOff));
					}
				}

				vec2 sinHorizons = sqrt(1. - cosHorizons * cosHorizons);
				float nx = dot(normalInSlice, sliceTangent);
				float ny = dot(normalInSlice, viewDir);
				float nxb = 1. / 2. * (acos(cosHorizons.y) - acos(cosHorizons.x) + sinHorizons.x * cosHorizons.x - sinHorizons.y * cosHorizons.y);
				float nyb = 1. / 2. * (2. - cosHorizons.x * cosHorizons.x - cosHorizons.y * cosHorizons.y);
				float occlusion = nx * nxb + ny * nyb;
				ao += occlusion;
			}

			ao = clamp(ao / float(DIRECTIONS), 0., 1.);
		#if SCENE_CLIP_BOX == 1
			ao = mix(ao, 1., smoothstep(0., radiusToUse, boxDistance));
		#endif
			ao = pow(ao, scale);

			gl_FragColor = FRAGMENT_OUTPUT;
		}`},Sr={name:"GTAODepthShader",defines:{PERSPECTIVE_CAMERA:1},uniforms:{tDepth:{value:null},cameraNear:{value:null},cameraFar:{value:null}},vertexShader:`
		varying vec2 vUv;

		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}`,fragmentShader:`
		uniform sampler2D tDepth;
		uniform float cameraNear;
		uniform float cameraFar;
		varying vec2 vUv;

		#include <packing>

		float getLinearDepth( const in vec2 screenPosition ) {
			#if PERSPECTIVE_CAMERA == 1
				float fragCoordZ = texture2D( tDepth, screenPosition ).x;
				float viewZ = perspectiveDepthToViewZ( fragCoordZ, cameraNear, cameraFar );
				return viewZToOrthographicDepth( viewZ, cameraNear, cameraFar );
			#else
				return texture2D( tDepth, screenPosition ).x;
			#endif
		}

		void main() {
			float depth = getLinearDepth( vUv );
			gl_FragColor = vec4( vec3( 1.0 - depth ), 1.0 );

		}`},Za={name:"GTAOBlendShader",uniforms:{tDiffuse:{value:null},intensity:{value:1}},vertexShader:`
		varying vec2 vUv;

		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}`,fragmentShader:`
		uniform float intensity;
		uniform sampler2D tDiffuse;
		varying vec2 vUv;

		void main() {
			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = vec4(mix(vec3(1.), texel.rgb, intensity), texel.a);
		}`};function Xu(i=5){let t=Math.floor(i)%2===0?Math.floor(i)+1:Math.floor(i),e=v_(t),n=e.length,s=new Uint8Array(n*4);for(let o=0;o<n;++o){let a=e[o],c=2*Math.PI*a/n,l=new C(Math.cos(c),Math.sin(c),0).normalize();s[o*4]=(l.x*.5+.5)*255,s[o*4+1]=(l.y*.5+.5)*255,s[o*4+2]=127,s[o*4+3]=255}let r=new wn(s,t,t);return r.wrapS=He,r.wrapT=He,r.needsUpdate=!0,r}function v_(i){let t=Math.floor(i)%2===0?Math.floor(i)+1:Math.floor(i),e=t*t,n=Array(e).fill(0),s=Math.floor(t/2),r=t-1;for(let o=1;o<=e;){if(s===-1&&r===t?(r=t-2,s=0):(r===t&&(r=0),s<0&&(s=t-1)),n[s*t+r]!==0){r-=2,s++;continue}else n[s*t+r]=o++;r++,s--}return n}var br={name:"PoissonDenoiseShader",defines:{SAMPLES:16,SAMPLE_VECTORS:kc(16,2,1),NORMAL_VECTOR_TYPE:1,DEPTH_VALUE_SOURCE:0},uniforms:{tDiffuse:{value:null},tNormal:{value:null},tDepth:{value:null},tNoise:{value:null},resolution:{value:new lt},cameraProjectionMatrixInverse:{value:new jt},lumaPhi:{value:5},depthPhi:{value:5},normalPhi:{value:5},radius:{value:4},index:{value:0}},vertexShader:`

		varying vec2 vUv;

		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}`,fragmentShader:`

		varying vec2 vUv;

		uniform sampler2D tDiffuse;
		uniform sampler2D tNormal;
		uniform sampler2D tDepth;
		uniform sampler2D tNoise;
		uniform vec2 resolution;
		uniform mat4 cameraProjectionMatrixInverse;
		uniform float lumaPhi;
		uniform float depthPhi;
		uniform float normalPhi;
		uniform float radius;
		uniform int index;

		#include <common>
		#include <packing>

		#ifndef SAMPLE_LUMINANCE
		#define SAMPLE_LUMINANCE dot(vec3(0.2125, 0.7154, 0.0721), a)
		#endif

		#ifndef FRAGMENT_OUTPUT
		#define FRAGMENT_OUTPUT vec4(denoised, 1.)
		#endif

		float getLuminance(const in vec3 a) {
			return SAMPLE_LUMINANCE;
		}

		const vec3 poissonDisk[SAMPLES] = SAMPLE_VECTORS;

		vec3 getViewPosition(const in vec2 screenPosition, const in float depth) {
			vec4 clipSpacePosition = vec4(vec3(screenPosition, depth) * 2.0 - 1.0, 1.0);
			vec4 viewSpacePosition = cameraProjectionMatrixInverse * clipSpacePosition;
			return viewSpacePosition.xyz / viewSpacePosition.w;
		}

		float getDepth(const vec2 uv) {
		#if DEPTH_VALUE_SOURCE == 1
			return textureLod(tDepth, uv.xy, 0.0).a;
		#else
			return textureLod(tDepth, uv.xy, 0.0).r;
		#endif
		}

		float fetchDepth(const ivec2 uv) {
			#if DEPTH_VALUE_SOURCE == 1
				return texelFetch(tDepth, uv.xy, 0).a;
			#else
				return texelFetch(tDepth, uv.xy, 0).r;
			#endif
		}

		vec3 computeNormalFromDepth(const vec2 uv) {
			vec2 size = vec2(textureSize(tDepth, 0));
			ivec2 p = ivec2(uv * size);
			float c0 = fetchDepth(p);
			float l2 = fetchDepth(p - ivec2(2, 0));
			float l1 = fetchDepth(p - ivec2(1, 0));
			float r1 = fetchDepth(p + ivec2(1, 0));
			float r2 = fetchDepth(p + ivec2(2, 0));
			float b2 = fetchDepth(p - ivec2(0, 2));
			float b1 = fetchDepth(p - ivec2(0, 1));
			float t1 = fetchDepth(p + ivec2(0, 1));
			float t2 = fetchDepth(p + ivec2(0, 2));
			float dl = abs((2.0 * l1 - l2) - c0);
			float dr = abs((2.0 * r1 - r2) - c0);
			float db = abs((2.0 * b1 - b2) - c0);
			float dt = abs((2.0 * t1 - t2) - c0);
			vec3 ce = getViewPosition(uv, c0).xyz;
			vec3 dpdx = (dl < dr) ?  ce - getViewPosition((uv - vec2(1.0 / size.x, 0.0)), l1).xyz
									: -ce + getViewPosition((uv + vec2(1.0 / size.x, 0.0)), r1).xyz;
			vec3 dpdy = (db < dt) ?  ce - getViewPosition((uv - vec2(0.0, 1.0 / size.y)), b1).xyz
									: -ce + getViewPosition((uv + vec2(0.0, 1.0 / size.y)), t1).xyz;
			return normalize(cross(dpdx, dpdy));
		}

		vec3 getViewNormal(const vec2 uv) {
		#if NORMAL_VECTOR_TYPE == 2
			return normalize(textureLod(tNormal, uv, 0.).rgb);
		#elif NORMAL_VECTOR_TYPE == 1
			return unpackRGBToNormal(textureLod(tNormal, uv, 0.).rgb);
		#else
			return computeNormalFromDepth(uv);
		#endif
		}

		void denoiseSample(in vec3 center, in vec3 viewNormal, in vec3 viewPos, in vec2 sampleUv, inout vec3 denoised, inout float totalWeight) {
			vec4 sampleTexel = textureLod(tDiffuse, sampleUv, 0.0);
			float sampleDepth = getDepth(sampleUv);
			vec3 sampleNormal = getViewNormal(sampleUv);
			vec3 neighborColor = sampleTexel.rgb;
			vec3 viewPosSample = getViewPosition(sampleUv, sampleDepth);

			float normalDiff = dot(viewNormal, sampleNormal);
			float normalSimilarity = pow(max(normalDiff, 0.), normalPhi);
			float lumaDiff = abs(getLuminance(neighborColor) - getLuminance(center));
			float lumaSimilarity = max(1.0 - lumaDiff / lumaPhi, 0.0);
			float depthDiff = abs(dot(viewPos - viewPosSample, viewNormal));
			float depthSimilarity = max(1. - depthDiff / depthPhi, 0.);
			float w = lumaSimilarity * depthSimilarity * normalSimilarity;

			denoised += w * neighborColor;
			totalWeight += w;
		}

		void main() {
			float depth = getDepth(vUv.xy);
			vec3 viewNormal = getViewNormal(vUv);
			if (depth == 1. || dot(viewNormal, viewNormal) == 0.) {
				discard;
				return;
			}
			vec4 texel = textureLod(tDiffuse, vUv, 0.0);
			vec3 center = texel.rgb;
			vec3 viewPos = getViewPosition(vUv, depth);

			vec2 noiseResolution = vec2(textureSize(tNoise, 0));
			vec2 noiseUv = vUv * resolution / noiseResolution;
			vec4 noiseTexel = textureLod(tNoise, noiseUv, 0.0);
      		vec2 noiseVec = vec2(sin(noiseTexel[index % 4] * 2. * PI), cos(noiseTexel[index % 4] * 2. * PI));
    		mat2 rotationMatrix = mat2(noiseVec.x, -noiseVec.y, noiseVec.x, noiseVec.y);

			float totalWeight = 1.0;
			vec3 denoised = texel.rgb;
			for (int i = 0; i < SAMPLES; i++) {
				vec3 sampleDir = poissonDisk[i];
				vec2 offset = rotationMatrix * (sampleDir.xy * (1. + sampleDir.z * (radius - 1.)) / resolution);
				vec2 sampleUv = vUv + offset;
				denoiseSample(center, viewNormal, viewPos, sampleUv, denoised, totalWeight);
			}

			if (totalWeight > 0.) {
				denoised /= totalWeight;
			}
			gl_FragColor = FRAGMENT_OUTPUT;
		}`};function kc(i,t,e){let n=y_(i,t,e),s="vec3[SAMPLES](";for(let r=0;r<i;r++){let o=n[r];s+=`vec3(${o.x}, ${o.y}, ${o.z})${r<i-1?",":")"}`}return s}function y_(i,t,e){let n=[];for(let s=0;s<i;s++){let r=2*Math.PI*t*s/i,o=Math.pow(s/(i-1),e);n.push(new C(Math.cos(r),Math.sin(r),o))}return n}var Ja=class{constructor(t=Math){this.grad3=[[1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],[1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],[0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1]],this.grad4=[[0,1,1,1],[0,1,1,-1],[0,1,-1,1],[0,1,-1,-1],[0,-1,1,1],[0,-1,1,-1],[0,-1,-1,1],[0,-1,-1,-1],[1,0,1,1],[1,0,1,-1],[1,0,-1,1],[1,0,-1,-1],[-1,0,1,1],[-1,0,1,-1],[-1,0,-1,1],[-1,0,-1,-1],[1,1,0,1],[1,1,0,-1],[1,-1,0,1],[1,-1,0,-1],[-1,1,0,1],[-1,1,0,-1],[-1,-1,0,1],[-1,-1,0,-1],[1,1,1,0],[1,1,-1,0],[1,-1,1,0],[1,-1,-1,0],[-1,1,1,0],[-1,1,-1,0],[-1,-1,1,0],[-1,-1,-1,0]],this.p=[];for(let e=0;e<256;e++)this.p[e]=Math.floor(t.random()*256);this.perm=[];for(let e=0;e<512;e++)this.perm[e]=this.p[e&255];this.simplex=[[0,1,2,3],[0,1,3,2],[0,0,0,0],[0,2,3,1],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,2,3,0],[0,2,1,3],[0,0,0,0],[0,3,1,2],[0,3,2,1],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,3,2,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,2,0,3],[0,0,0,0],[1,3,0,2],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,3,0,1],[2,3,1,0],[1,0,2,3],[1,0,3,2],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,0,3,1],[0,0,0,0],[2,1,3,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,0,1,3],[0,0,0,0],[0,0,0,0],[0,0,0,0],[3,0,1,2],[3,0,2,1],[0,0,0,0],[3,1,2,0],[2,1,0,3],[0,0,0,0],[0,0,0,0],[0,0,0,0],[3,1,0,2],[0,0,0,0],[3,2,0,1],[3,2,1,0]]}noise(t,e){let n,s,r,o=.5*(Math.sqrt(3)-1),a=(t+e)*o,c=Math.floor(t+a),l=Math.floor(e+a),h=(3-Math.sqrt(3))/6,d=(c+l)*h,f=c-d,u=l-d,g=t-f,_=e-u,m,p;g>_?(m=1,p=0):(m=0,p=1);let E=g-m+h,M=_-p+h,y=g-1+2*h,R=_-1+2*h,A=c&255,P=l&255,D=this.perm[A+this.perm[P]]%12,b=this.perm[A+m+this.perm[P+p]]%12,v=this.perm[A+1+this.perm[P+1]]%12,L=.5-g*g-_*_;L<0?n=0:(L*=L,n=L*L*this._dot(this.grad3[D],g,_));let O=.5-E*E-M*M;O<0?s=0:(O*=O,s=O*O*this._dot(this.grad3[b],E,M));let W=.5-y*y-R*R;return W<0?r=0:(W*=W,r=W*W*this._dot(this.grad3[v],y,R)),70*(n+s+r)}noise3d(t,e,n){let s,r,o,a,l=(t+e+n)*.3333333333333333,h=Math.floor(t+l),d=Math.floor(e+l),f=Math.floor(n+l),u=1/6,g=(h+d+f)*u,_=h-g,m=d-g,p=f-g,E=t-_,M=e-m,y=n-p,R,A,P,D,b,v;E>=M?M>=y?(R=1,A=0,P=0,D=1,b=1,v=0):E>=y?(R=1,A=0,P=0,D=1,b=0,v=1):(R=0,A=0,P=1,D=1,b=0,v=1):M<y?(R=0,A=0,P=1,D=0,b=1,v=1):E<y?(R=0,A=1,P=0,D=0,b=1,v=1):(R=0,A=1,P=0,D=1,b=1,v=0);let L=E-R+u,O=M-A+u,W=y-P+u,Z=E-D+2*u,j=M-b+2*u,$=y-v+2*u,dt=E-1+3*u,X=M-1+3*u,pt=y-1+3*u,St=h&255,wt=d&255,Et=f&255,Ot=this.perm[St+this.perm[wt+this.perm[Et]]]%12,Gt=this.perm[St+R+this.perm[wt+A+this.perm[Et+P]]]%12,Ft=this.perm[St+D+this.perm[wt+b+this.perm[Et+v]]]%12,tt=this.perm[St+1+this.perm[wt+1+this.perm[Et+1]]]%12,ot=.6-E*E-M*M-y*y;ot<0?s=0:(ot*=ot,s=ot*ot*this._dot3(this.grad3[Ot],E,M,y));let At=.6-L*L-O*O-W*W;At<0?r=0:(At*=At,r=At*At*this._dot3(this.grad3[Gt],L,O,W));let bt=.6-Z*Z-j*j-$*$;bt<0?o=0:(bt*=bt,o=bt*bt*this._dot3(this.grad3[Ft],Z,j,$));let Tt=.6-dt*dt-X*X-pt*pt;return Tt<0?a=0:(Tt*=Tt,a=Tt*Tt*this._dot3(this.grad3[tt],dt,X,pt)),32*(s+r+o+a)}noise4d(t,e,n,s){let r=this.grad4,o=this.simplex,a=this.perm,c=(Math.sqrt(5)-1)/4,l=(5-Math.sqrt(5))/20,h,d,f,u,g,_=(t+e+n+s)*c,m=Math.floor(t+_),p=Math.floor(e+_),E=Math.floor(n+_),M=Math.floor(s+_),y=(m+p+E+M)*l,R=m-y,A=p-y,P=E-y,D=M-y,b=t-R,v=e-A,L=n-P,O=s-D,W=b>v?32:0,Z=b>L?16:0,j=v>L?8:0,$=b>O?4:0,dt=v>O?2:0,X=L>O?1:0,pt=W+Z+j+$+dt+X,St=o[pt][0]>=3?1:0,wt=o[pt][1]>=3?1:0,Et=o[pt][2]>=3?1:0,Ot=o[pt][3]>=3?1:0,Gt=o[pt][0]>=2?1:0,Ft=o[pt][1]>=2?1:0,tt=o[pt][2]>=2?1:0,ot=o[pt][3]>=2?1:0,At=o[pt][0]>=1?1:0,bt=o[pt][1]>=1?1:0,Tt=o[pt][2]>=1?1:0,Wt=o[pt][3]>=1?1:0,Kt=b-St+l,U=v-wt+l,ct=L-Et+l,it=O-Ot+l,et=b-Gt+2*l,Q=v-Ft+2*l,xt=L-tt+2*l,ut=O-ot+2*l,gt=b-At+3*l,z=v-bt+3*l,q=L-Tt+3*l,S=O-Wt+3*l,x=b-1+4*l,I=v-1+4*l,N=L-1+4*l,V=O-1+4*l,k=m&255,ht=p&255,at=E&255,vt=M&255,Mt=a[k+a[ht+a[at+a[vt]]]]%32,st=a[k+St+a[ht+wt+a[at+Et+a[vt+Ot]]]]%32,mt=a[k+Gt+a[ht+Ft+a[at+tt+a[vt+ot]]]]%32,Lt=a[k+At+a[ht+bt+a[at+Tt+a[vt+Wt]]]]%32,It=a[k+1+a[ht+1+a[at+1+a[vt+1]]]]%32,yt=.6-b*b-v*v-L*L-O*O;yt<0?h=0:(yt*=yt,h=yt*yt*this._dot4(r[Mt],b,v,L,O));let F=.6-Kt*Kt-U*U-ct*ct-it*it;F<0?d=0:(F*=F,d=F*F*this._dot4(r[st],Kt,U,ct,it));let T=.6-et*et-Q*Q-xt*xt-ut*ut;T<0?f=0:(T*=T,f=T*T*this._dot4(r[mt],et,Q,xt,ut));let B=.6-gt*gt-z*z-q*q-S*S;B<0?u=0:(B*=B,u=B*B*this._dot4(r[Lt],gt,z,q,S));let J=.6-x*x-I*I-N*N-V*V;return J<0?g=0:(J*=J,g=J*J*this._dot4(r[It],x,I,N,V)),27*(h+d+f+u+g)}_dot(t,e,n){return t[0]*e+t[1]*n}_dot3(t,e,n,s){return t[0]*e+t[1]*n+t[2]*s}_dot4(t,e,n,s,r){return t[0]*e+t[1]*n+t[2]*s+t[3]*r}};var Er=class i extends en{constructor(t,e,n=512,s=512,r,o,a){super(),this.width=n,this.height=s,this.clear=!0,this.camera=e,this.scene=t,this.output=0,this._renderGBuffer=!0,this._visibilityCache=[],this.blendIntensity=1,this.pdRings=2,this.pdRadiusExponent=2,this.pdSamples=16,this.gtaoNoiseTexture=Xu(),this.pdNoiseTexture=this._generateNoise(),this.gtaoRenderTarget=new ze(this.width,this.height,{type:vn}),this.pdRenderTarget=this.gtaoRenderTarget.clone(),this.gtaoMaterial=new xe({defines:Object.assign({},Mr.defines),uniforms:un.clone(Mr.uniforms),vertexShader:Mr.vertexShader,fragmentShader:Mr.fragmentShader,blending:ye,depthTest:!1,depthWrite:!1}),this.gtaoMaterial.defines.PERSPECTIVE_CAMERA=this.camera.isPerspectiveCamera?1:0,this.gtaoMaterial.uniforms.tNoise.value=this.gtaoNoiseTexture,this.gtaoMaterial.uniforms.resolution.value.set(this.width,this.height),this.gtaoMaterial.uniforms.cameraNear.value=this.camera.near,this.gtaoMaterial.uniforms.cameraFar.value=this.camera.far,this.normalMaterial=new sr,this.normalMaterial.blending=ye,this.pdMaterial=new xe({defines:Object.assign({},br.defines),uniforms:un.clone(br.uniforms),vertexShader:br.vertexShader,fragmentShader:br.fragmentShader,depthTest:!1,depthWrite:!1}),this.pdMaterial.uniforms.tDiffuse.value=this.gtaoRenderTarget.texture,this.pdMaterial.uniforms.tNoise.value=this.pdNoiseTexture,this.pdMaterial.uniforms.resolution.value.set(this.width,this.height),this.pdMaterial.uniforms.lumaPhi.value=10,this.pdMaterial.uniforms.depthPhi.value=2,this.pdMaterial.uniforms.normalPhi.value=3,this.pdMaterial.uniforms.radius.value=8,this.depthRenderMaterial=new xe({defines:Object.assign({},Sr.defines),uniforms:un.clone(Sr.uniforms),vertexShader:Sr.vertexShader,fragmentShader:Sr.fragmentShader,blending:ye}),this.depthRenderMaterial.uniforms.cameraNear.value=this.camera.near,this.depthRenderMaterial.uniforms.cameraFar.value=this.camera.far,this.copyMaterial=new xe({uniforms:un.clone(ps.uniforms),vertexShader:ps.vertexShader,fragmentShader:ps.fragmentShader,transparent:!0,depthTest:!1,depthWrite:!1,blendSrc:ur,blendDst:_i,blendEquation:Je,blendSrcAlpha:hr,blendDstAlpha:_i,blendEquationAlpha:Je}),this.blendMaterial=new xe({uniforms:un.clone(Za.uniforms),vertexShader:Za.vertexShader,fragmentShader:Za.fragmentShader,transparent:!0,depthTest:!1,depthWrite:!1,blending:zo,blendSrc:ur,blendDst:_i,blendEquation:Je,blendSrcAlpha:hr,blendDstAlpha:_i,blendEquationAlpha:Je}),this._fsQuad=new ni(null),this._originalClearColor=new zt,this.setGBuffer(r?r.depthTexture:void 0,r?r.normalTexture:void 0),o!==void 0&&this.updateGtaoMaterial(o),a!==void 0&&this.updatePdMaterial(a)}setSize(t,e){this.width=t,this.height=e,this.gtaoRenderTarget.setSize(t,e),this.normalRenderTarget.setSize(t,e),this.pdRenderTarget.setSize(t,e),this.gtaoMaterial.uniforms.resolution.value.set(t,e),this.gtaoMaterial.uniforms.cameraProjectionMatrix.value.copy(this.camera.projectionMatrix),this.gtaoMaterial.uniforms.cameraProjectionMatrixInverse.value.copy(this.camera.projectionMatrixInverse),this.pdMaterial.uniforms.resolution.value.set(t,e),this.pdMaterial.uniforms.cameraProjectionMatrixInverse.value.copy(this.camera.projectionMatrixInverse)}dispose(){this.gtaoNoiseTexture.dispose(),this.pdNoiseTexture.dispose(),this.normalRenderTarget.dispose(),this.gtaoRenderTarget.dispose(),this.pdRenderTarget.dispose(),this.normalMaterial.dispose(),this.pdMaterial.dispose(),this.copyMaterial.dispose(),this.depthRenderMaterial.dispose(),this._fsQuad.dispose()}get gtaoMap(){return this.pdRenderTarget.texture}setGBuffer(t,e){t!==void 0?(this.depthTexture=t,this.normalTexture=e,this._renderGBuffer=!1):(this.depthTexture=new di,this.depthTexture.format=ei,this.depthTexture.type=ti,this.normalRenderTarget=new ze(this.width,this.height,{minFilter:Re,magFilter:Re,type:vn,depthTexture:this.depthTexture}),this.normalTexture=this.normalRenderTarget.texture,this._renderGBuffer=!0);let n=this.normalTexture?1:0,s=this.depthTexture===this.normalTexture?"w":"x";this.gtaoMaterial.defines.NORMAL_VECTOR_TYPE=n,this.gtaoMaterial.defines.DEPTH_SWIZZLING=s,this.gtaoMaterial.uniforms.tNormal.value=this.normalTexture,this.gtaoMaterial.uniforms.tDepth.value=this.depthTexture,this.pdMaterial.defines.NORMAL_VECTOR_TYPE=n,this.pdMaterial.defines.DEPTH_SWIZZLING=s,this.pdMaterial.uniforms.tNormal.value=this.normalTexture,this.pdMaterial.uniforms.tDepth.value=this.depthTexture,this.depthRenderMaterial.uniforms.tDepth.value=this.normalRenderTarget.depthTexture}setSceneClipBox(t){t?(this.gtaoMaterial.needsUpdate=this.gtaoMaterial.defines.SCENE_CLIP_BOX!==1,this.gtaoMaterial.defines.SCENE_CLIP_BOX=1,this.gtaoMaterial.uniforms.sceneBoxMin.value.copy(t.min),this.gtaoMaterial.uniforms.sceneBoxMax.value.copy(t.max)):(this.gtaoMaterial.needsUpdate=this.gtaoMaterial.defines.SCENE_CLIP_BOX===0,this.gtaoMaterial.defines.SCENE_CLIP_BOX=0)}updateGtaoMaterial(t){t.radius!==void 0&&(this.gtaoMaterial.uniforms.radius.value=t.radius),t.distanceExponent!==void 0&&(this.gtaoMaterial.uniforms.distanceExponent.value=t.distanceExponent),t.thickness!==void 0&&(this.gtaoMaterial.uniforms.thickness.value=t.thickness),t.distanceFallOff!==void 0&&(this.gtaoMaterial.uniforms.distanceFallOff.value=t.distanceFallOff,this.gtaoMaterial.needsUpdate=!0),t.scale!==void 0&&(this.gtaoMaterial.uniforms.scale.value=t.scale),t.samples!==void 0&&t.samples!==this.gtaoMaterial.defines.SAMPLES&&(this.gtaoMaterial.defines.SAMPLES=t.samples,this.gtaoMaterial.needsUpdate=!0),t.screenSpaceRadius!==void 0&&(t.screenSpaceRadius?1:0)!==this.gtaoMaterial.defines.SCREEN_SPACE_RADIUS&&(this.gtaoMaterial.defines.SCREEN_SPACE_RADIUS=t.screenSpaceRadius?1:0,this.gtaoMaterial.needsUpdate=!0)}updatePdMaterial(t){let e=!1;t.lumaPhi!==void 0&&(this.pdMaterial.uniforms.lumaPhi.value=t.lumaPhi),t.depthPhi!==void 0&&(this.pdMaterial.uniforms.depthPhi.value=t.depthPhi),t.normalPhi!==void 0&&(this.pdMaterial.uniforms.normalPhi.value=t.normalPhi),t.radius!==void 0&&t.radius!==this.radius&&(this.pdMaterial.uniforms.radius.value=t.radius),t.radiusExponent!==void 0&&t.radiusExponent!==this.pdRadiusExponent&&(this.pdRadiusExponent=t.radiusExponent,e=!0),t.rings!==void 0&&t.rings!==this.pdRings&&(this.pdRings=t.rings,e=!0),t.samples!==void 0&&t.samples!==this.pdSamples&&(this.pdSamples=t.samples,e=!0),e&&(this.pdMaterial.defines.SAMPLES=this.pdSamples,this.pdMaterial.defines.SAMPLE_VECTORS=kc(this.pdSamples,this.pdRings,this.pdRadiusExponent),this.pdMaterial.needsUpdate=!0)}render(t,e,n){switch(this._renderGBuffer&&(this._overrideVisibility(),this._renderOverride(t,this.normalMaterial,this.normalRenderTarget,7829503,1),this._restoreVisibility()),this.gtaoMaterial.uniforms.cameraNear.value=this.camera.near,this.gtaoMaterial.uniforms.cameraFar.value=this.camera.far,this.gtaoMaterial.uniforms.cameraProjectionMatrix.value.copy(this.camera.projectionMatrix),this.gtaoMaterial.uniforms.cameraProjectionMatrixInverse.value.copy(this.camera.projectionMatrixInverse),this.gtaoMaterial.uniforms.cameraWorldMatrix.value.copy(this.camera.matrixWorld),this._renderPass(t,this.gtaoMaterial,this.gtaoRenderTarget,16777215,1),this.pdMaterial.uniforms.cameraProjectionMatrixInverse.value.copy(this.camera.projectionMatrixInverse),this._renderPass(t,this.pdMaterial,this.pdRenderTarget,16777215,1),this.output){case i.OUTPUT.Off:break;case i.OUTPUT.Diffuse:this.copyMaterial.uniforms.tDiffuse.value=n.texture,this.copyMaterial.blending=ye,this._renderPass(t,this.copyMaterial,this.renderToScreen?null:e);break;case i.OUTPUT.AO:this.copyMaterial.uniforms.tDiffuse.value=this.gtaoRenderTarget.texture,this.copyMaterial.blending=ye,this._renderPass(t,this.copyMaterial,this.renderToScreen?null:e);break;case i.OUTPUT.Denoise:this.copyMaterial.uniforms.tDiffuse.value=this.pdRenderTarget.texture,this.copyMaterial.blending=ye,this._renderPass(t,this.copyMaterial,this.renderToScreen?null:e);break;case i.OUTPUT.Depth:this.depthRenderMaterial.uniforms.cameraNear.value=this.camera.near,this.depthRenderMaterial.uniforms.cameraFar.value=this.camera.far,this._renderPass(t,this.depthRenderMaterial,this.renderToScreen?null:e);break;case i.OUTPUT.Normal:this.copyMaterial.uniforms.tDiffuse.value=this.normalRenderTarget.texture,this.copyMaterial.blending=ye,this._renderPass(t,this.copyMaterial,this.renderToScreen?null:e);break;case i.OUTPUT.Default:this.copyMaterial.uniforms.tDiffuse.value=n.texture,this.copyMaterial.blending=ye,this._renderPass(t,this.copyMaterial,this.renderToScreen?null:e),this.blendMaterial.uniforms.intensity.value=this.blendIntensity,this.blendMaterial.uniforms.tDiffuse.value=this.pdRenderTarget.texture,this._renderPass(t,this.blendMaterial,this.renderToScreen?null:e);break;default:console.warn("THREE.GTAOPass: Unknown output type.")}}_renderPass(t,e,n,s,r){t.getClearColor(this._originalClearColor);let o=t.getClearAlpha(),a=t.autoClear;t.setRenderTarget(n),t.autoClear=!1,s!=null&&(t.setClearColor(s),t.setClearAlpha(r||0),t.clear()),this._fsQuad.material=e,this._fsQuad.render(t),t.autoClear=a,t.setClearColor(this._originalClearColor),t.setClearAlpha(o)}_renderOverride(t,e,n,s,r){t.getClearColor(this._originalClearColor);let o=t.getClearAlpha(),a=t.autoClear;t.setRenderTarget(n),t.autoClear=!1,s=e.clearColor||s,r=e.clearAlpha||r,s!=null&&(t.setClearColor(s),t.setClearAlpha(r||0),t.clear()),this.scene.overrideMaterial=e,t.render(this.scene,this.camera),this.scene.overrideMaterial=null,t.autoClear=a,t.setClearColor(this._originalClearColor),t.setClearAlpha(o)}_overrideVisibility(){let t=this.scene,e=this._visibilityCache;t.traverse(function(n){(n.isPoints||n.isLine||n.isLine2)&&n.visible&&(n.visible=!1,e.push(n))})}_restoreVisibility(){let t=this._visibilityCache;for(let e=0;e<t.length;e++)t[e].visible=!0;t.length=0}_generateNoise(t=64){let e=new Ja,n=t*t*4,s=new Uint8Array(n);for(let o=0;o<t;o++)for(let a=0;a<t;a++){let c=o,l=a;s[(o*t+a)*4]=(e.noise(c,l)*.5+.5)*255,s[(o*t+a)*4+1]=(e.noise(c+t,l)*.5+.5)*255,s[(o*t+a)*4+2]=(e.noise(c,l+t)*.5+.5)*255,s[(o*t+a)*4+3]=(e.noise(c+t,l+t)*.5+.5)*255}let r=new wn(s,t,t,Ue,tn);return r.wrapS=He,r.wrapT=He,r.needsUpdate=!0,r}};Er.OUTPUT={Off:-1,Default:0,Diffuse:1,Depth:2,Normal:3,AO:4,Denoise:5};var Tr={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
		precision highp float;

		uniform mat4 modelViewMatrix;
		uniform mat4 projectionMatrix;

		attribute vec3 position;
		attribute vec2 uv;

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		precision highp float;

		uniform sampler2D tDiffuse;

		#include <tonemapping_pars_fragment>
		#include <colorspace_pars_fragment>

		varying vec2 vUv;

		void main() {

			gl_FragColor = texture2D( tDiffuse, vUv );

			// tone mapping

			#ifdef LINEAR_TONE_MAPPING

				gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );

			#elif defined( REINHARD_TONE_MAPPING )

				gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );

			#elif defined( CINEON_TONE_MAPPING )

				gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );

			#elif defined( ACES_FILMIC_TONE_MAPPING )

				gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );

			#elif defined( AGX_TONE_MAPPING )

				gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );

			#elif defined( NEUTRAL_TONE_MAPPING )

				gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );

			#elif defined( CUSTOM_TONE_MAPPING )

				gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );

			#endif

			// color space

			#ifdef SRGB_TRANSFER

				gl_FragColor = sRGBTransferOETF( gl_FragColor );

			#endif

		}`};var $a=class extends en{constructor(){super(),this.uniforms=un.clone(Tr.uniforms),this.material=new nr({name:Tr.name,uniforms:this.uniforms,vertexShader:Tr.vertexShader,fragmentShader:Tr.fragmentShader}),this._fsQuad=new ni(this.material),this._outputColorSpace=null,this._toneMapping=null}render(t,e,n){this.uniforms.tDiffuse.value=n.texture,this.uniforms.toneMappingExposure.value=t.toneMappingExposure,(this._outputColorSpace!==t.outputColorSpace||this._toneMapping!==t.toneMapping)&&(this._outputColorSpace=t.outputColorSpace,this._toneMapping=t.toneMapping,this.material.defines={},te.getTransfer(this._outputColorSpace)===ne&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===Zo?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===Jo?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===$o?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===os?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===jo?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===Qo?this.material.defines.NEUTRAL_TONE_MAPPING="":this._toneMapping===Ko&&(this.material.defines.CUSTOM_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(t.setRenderTarget(null),this._fsQuad.render(t)):(t.setRenderTarget(e),this.clear&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),this._fsQuad.render(t))}dispose(){this.material.dispose(),this._fsQuad.dispose()}};function Vy(i,t,e,{mobile:n=!1}={}){let s=()=>n||typeof window<"u"&&window.innerWidth<600,r=i.domElement;i.setPixelRatio(Math.min(globalThis.devicePixelRatio||1,s()?1.35:1.65)),i.outputColorSpace=Me,i.toneMapping=os,i.toneMappingExposure=1.02,i.info.autoReset=!1;let o=new us(i),a=new Ga,c=o.fromScene(a,.03);a.dispose(),t.environment=c.texture,t.environmentIntensity=.4;let l=null,h=null,d=!1;try{l=new qa(i),l.addPass(new Ya(t,e)),h=new Er(t,e,512,512,void 0,{radius:.4,distanceExponent:1.2,thickness:1.1,scale:1,samples:8},{lumaPhi:10,depthPhi:2,normalPhi:3,radius:5,samples:8}),h.blendIntensity=.62,l.addPass(h),l.addPass(new $a),h.enabled=!s()}catch{l?.dispose(),l=null,h=null}function f(){r.dataset.renderQuality=h?.enabled?"diorama-contact":"diorama-light",r.dataset.diorama="true"}return f(),{render(){if(!d)if(i.info.reset(),l&&h?.enabled)try{l.render()}catch{h.enabled=!1,f(),i.render(t,e)}else i.render(t,e)},resize(u,g){if(d||!(u>0&&g>0))return;let _=Math.min(globalThis.devicePixelRatio||1,s()?1.35:1.65);i.setPixelRatio(_),i.setSize(u,g,!1),l&&(l.setPixelRatio(_),l.setSize(u,g)),h&&(h.enabled=!s()),f()},dispose(){if(!d){d=!0;for(let u of l?.passes||[])u.dispose?.();l?.dispose(),c.dispose(),o.dispose(),t.environment===c.texture&&(t.environment=null)}}}}function Hy(i,t,e,n,s,{padding:r=1.1,resetZoom:o=!0}={}){if(!(n>0&&s>0)||!e||e.isEmpty()||![...e.min.toArray(),...e.max.toArray()].every(Number.isFinite))return!1;let c=t.target,l=i.position.clone().sub(c);l.lengthSq()<1e-8&&l.set(1,1,1),l.normalize();let h=new C(0,1,0).cross(l);h.lengthSq()<1e-8?h.set(1,0,0):h.normalize();let d=l.clone().cross(h).normalize(),f=n/s,u=1/0,g=-1/0,_=1/0,m=-1/0,p=1,E=i.isPerspectiveCamera?Math.tan(yn.degToRad(i.fov/2)):0;for(let M of[e.min.x,e.max.x])for(let y of[e.min.y,e.max.y])for(let R of[e.min.z,e.max.z]){let A=new C(M,y,R).sub(c),P=A.dot(h),D=A.dot(d);if(u=Math.min(u,P),g=Math.max(g,P),_=Math.min(_,D),m=Math.max(m,D),i.isPerspectiveCamera){let b=A.dot(l);p=Math.max(p,Math.abs(P)/(E*f)+b,Math.abs(D)/E+b)}}if(i.isOrthographicCamera){let M=Math.max(.1,(m-_)/2,(g-u)/(2*f))*r,y=(u+g)/2,R=(_+m)/2;i.left=y-M*f,i.right=y+M*f,i.top=R+M,i.bottom=R-M,o&&(i.zoom=1)}else if(i.isPerspectiveCamera)p*=r,i.aspect=f,i.position.copy(c).addScaledVector(l,p),Number.isFinite(t.maxDistance)&&(t.maxDistance=Math.max(t.maxDistance,p*1.05));else return!1;return i.lookAt(c),i.updateProjectionMatrix(),i.updateMatrixWorld(!0),!0}function Yu(i,t=!1){let e=i[0].index!==null,n=new Set(Object.keys(i[0].attributes)),s=new Set(Object.keys(i[0].morphAttributes)),r={},o={},a=i[0].morphTargetsRelative,c=new oe,l=0;for(let h=0;h<i.length;++h){let d=i[h],f=0;if(e!==(d.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(let u in d.attributes){if(!n.has(u))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+'. All geometries must have compatible attributes; make sure "'+u+'" attribute exists among all geometries, or in none of them.'),null;r[u]===void 0&&(r[u]=[]),r[u].push(d.attributes[u]),f++}if(f!==n.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". Make sure all geometries have the same number of attributes."),null;if(a!==d.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(let u in d.morphAttributes){if(!s.has(u))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+".  .morphAttributes must be consistent throughout all geometries."),null;o[u]===void 0&&(o[u]=[]),o[u].push(d.morphAttributes[u])}if(t){let u;if(e)u=d.index.count;else if(d.attributes.position!==void 0)u=d.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". The geometry must have either an index or a position attribute"),null;c.addGroup(l,u,h),l+=u}}if(e){let h=0,d=[];for(let f=0;f<i.length;++f){let u=i[f].index;for(let g=0;g<u.count;++g)d.push(u.getX(g)+h);h+=i[f].attributes.position.count}c.setIndex(d)}for(let h in r){let d=qu(r[h]);if(!d)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" attribute."),null;c.setAttribute(h,d)}for(let h in o){let d=o[h][0].length;if(d===0)break;c.morphAttributes=c.morphAttributes||{},c.morphAttributes[h]=[];for(let f=0;f<d;++f){let u=[];for(let _=0;_<o[h].length;++_)u.push(o[h][_][f]);let g=qu(u);if(!g)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" morphAttribute."),null;c.morphAttributes[h].push(g)}}return c}function qu(i){let t,e,n,s=-1,r=0;for(let l=0;l<i.length;++l){let h=i[l];if(t===void 0&&(t=h.array.constructor),t!==h.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(e===void 0&&(e=h.itemSize),e!==h.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(n===void 0&&(n=h.normalized),n!==h.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(s===-1&&(s=h.gpuType),s!==h.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;r+=h.count*e}let o=new t(r),a=new De(o,e,n),c=0;for(let l=0;l<i.length;++l){let h=i[l];if(h.isInterleavedBufferAttribute){let d=c/e;for(let f=0,u=h.count;f<u;f++)for(let g=0;g<e;g++){let _=h.getComponent(f,g);a.setComponent(f+d,g,_)}}else o.set(h.array,c);c+=h.count*e}return s!==void 0&&(a.gpuType=s),a}var tl=9,ms=7,Ka=.6,wr=yn.clamp,Rr=(i,t,e)=>{let n=wr((e-i)/(t-i),0,1);return n*n*(3-2*n)};function Ju(i=11871){let t=i>>>0;return()=>(t=Math.imul(t,1664525)+1013904223>>>0,t/4294967296)}function ja(i,t){let e=Math.sin(i*127.1+t*311.7)*43758.5453123;return e-Math.floor(e)}function dn(i,t){let e=Math.floor(i),n=Math.floor(t),s=Rr(0,1,i-e),r=Rr(0,1,t-n);return yn.lerp(yn.lerp(ja(e,n),ja(e+1,n),s),yn.lerp(ja(e,n+1),ja(e+1,n+1),s),r)}function M_(i,t,e,n,s,r,o=.65){let a=Math.max(Math.abs(i-e)-s,Math.abs(t-n)-r);return 1-Rr(0,o,a)}function Qa(i){let t=Math.max(0,Math.abs(i)-(ms-Ka));return t>0?tl-Ka+Math.sqrt(Math.max(0,Ka*Ka-t*t)):tl}function Vc(i,t,e=0){return Math.abs(t)>ms-e?!1:Math.abs(i)<Qa(t)-e}function Zu(i,t,e=!1){let n=Ju(t),s=new Uint8Array(i*i*4);for(let o=0;o<i;o++)for(let a=0;a<i;a++){let c=dn(a/19,o/19),l=n(),h=wr(.63+.23*c+.14*l,0,1),d=(o*i+a)*4;s[d]=Math.round(h*255),s[d+1]=Math.round(h*(e?.985:1)*255),s[d+2]=Math.round(h*(e?.94:1)*255),s[d+3]=255}let r=new wn(s,i,i,Ue);return r.wrapS=r.wrapT=He,r.magFilter=$e,r.minFilter=Rn,r.generateMipmaps=!0,r.needsUpdate=!0,e&&(r.colorSpace=Me),r}function Ar(i,t,e,n){let s=new oe;return s.setAttribute("position",new kt(i,3)),t&&s.setIndex(t),e&&s.setAttribute("color",new kt(e,3)),n&&s.setAttribute("uv",new kt(n,2)),s.computeVertexNormals(),s.computeBoundingSphere(),s}function S_(){let i=[],t=[],e=[];for(let s=0;s<=5;s++){let r=s/5,o=Math.sin(Math.PI*r)**.78*.48;for(let a=0;a<3;a++){let c=a-1;i.push(c*o,.12*Math.sin(Math.PI*r)-Math.abs(c)*.085*Math.sin(Math.PI*r),r-.18),t.push(a/2,r)}}for(let s=0;s<5;s++)for(let r=0;r<2;r++){let o=s*3+r;e.push(o,o+3,o+1,o+1,o+3,o+4)}return Ar(i,e,null,t)}function b_(){return Ar([-.028,0,0,.028,0,0,.015,.45,.025,.07,.78,.07,0,0,-.025,0,0,.025,-.025,.37,.015,-.07,.66,.06],[0,1,2,0,2,3,4,6,5,4,7,6])}function qy({width:i=30,depth:t=24,groundY:e=.43,pads:n=[],seed:s=11871}={}){if(!Number.isFinite(i)||i<10||i>80||!Number.isFinite(t)||t<8||t>80||!Number.isFinite(e))throw new TypeError("Invalid diorama terrain dimensions");if(!Array.isArray(n)||n.length>20)throw new TypeError("Invalid diorama terrain pads");let r=i/18,o=t/14,a=e-2.6,c=n.map(F=>{if(!F||!["x","z","w","d"].every(T=>Number.isFinite(F[T]))||F.w<=0||F.d<=0)throw new TypeError("Invalid diorama terrain pad");return{x:F.x/r,z:F.z/o,hx:F.w/r/2,hz:F.d/o/2}}),l=Number.isFinite(s)?s>>>0:11871;function h(F,T,B=.12){return c.some(J=>Math.abs(F-J.x)<J.hx+B&&Math.abs(T-J.z)<J.hz+B)}function d(F,T){F=wr(F,-tl,tl),T=wr(T,-ms,ms);let B=.3*Math.exp(-((F+6.7)**2/6+(T+5.4)**2/3.8))+.23*Math.exp(-((F-6.5)**2/5+(T+4.8)**2/7))+1.72*Math.exp(-((F-6.4)**2/6.2+(T+5.6)**2/2.7)),J=e+B+.16*(dn(F*.34,T*.34)-.35)+.075*(dn(F*1.1,T*1.1)-.5)+.025*(dn(F*4.1,T*4.1)-.5);for(let ft of c)J=yn.lerp(J,e,M_(F,T,ft.x,ft.z,ft.hx,ft.hz,.55));return J}let f=new ln;f.name="Original illustrative planted terrain";let u=Ju(l),g=new ge,_=new zt,m=Zu(128,881);m.repeat.set(11,9);let p=Zu(128,234);p.repeat.set(13,3);let E=new Se({color:16381421,vertexColors:!0,roughness:.98,metalness:0,bumpMap:m,bumpScale:.08}),M=new Se({color:16777215,vertexColors:!0,roughness:1,bumpMap:p,bumpScale:.1}),y=new Se({color:16777215,vertexColors:!1,roughness:.94,bumpMap:p,bumpScale:.035,flatShading:!0}),R=new Se({color:16777215,roughness:.9,side:ke}),A=new Se({color:16777215,roughness:.96,bumpMap:p,bumpScale:.055}),P=new Se({color:16777215,roughness:.83,side:ke}),D=new Se({color:16118248,roughness:.75}),b={value:.45},v={value:0};function L(F,T){F.onBeforeCompile=B=>{B.uniforms.uLandscapeTime=v,B.uniforms.uLandscapeWind=b,B.vertexShader=`uniform float uLandscapeTime;
uniform float uLandscapeWind;
`+B.vertexShader,B.vertexShader=B.vertexShader.replace("#include <begin_vertex>",`#include <begin_vertex>
#ifdef USE_INSTANCING
float phase = instanceMatrix[3].x * .83 + instanceMatrix[3].z * .71;
transformed.x += sin(uLandscapeTime * 1.8 + phase + position.y) * uLandscapeWind * ${T.toFixed(3)} * max(position.y,position.z*.6);
transformed.z += cos(uLandscapeTime * 1.3 + phase) * uLandscapeWind * ${(T*.55).toFixed(3)} * max(position.y,position.z*.6);
#endif`)},F.customProgramCacheKey=()=>`glenolia-landscape-wind-${T}`}L(P,.1),L(R,.13);let O=144,W=112,Z=[],j=[],$=[],dt=[],X=new zt(8227927),pt=new zt(9870698),St=new zt(11115388);for(let F=0;F<=W;F++){let T=-ms+F/W*ms*2,B=Qa(T);for(let J=0;J<=O;J++){let ft=(-1+J/O*2)*B,rt=d(ft,T),nt=dn(ft*.8,T*.8),Rt=dn(ft*7,T*7);Z.push(ft,rt,T),$.push(ft/18,T/14),_.copy(X).lerp(pt,nt*.8).lerp(St,Math.max(0,dn(ft*1.3+20,T*1.3)-.58)*.38);let Ut=Math.hypot(d(ft+.12,T)-d(ft-.12,T),d(ft,T+.12)-d(ft,T-.12))/.24,Jt=Rr(.28,.85,Ut)*Rr(e+.27,e+.92,rt);_.lerp(new zt(9538422),Jt*.88),_.multiplyScalar(.94+Rt*.13),j.push(_.r,_.g,_.b)}}for(let F=0;F<W;F++)for(let T=0;T<O;T++){let B=F*(O+1)+T;dt.push(B,B+O+1,B+1,B+1,B+O+1,B+O+2)}let wt=new ie(Ar(Z,dt,j,$),E);wt.name="Fine contoured meadow surface",wt.receiveShadow=!0,f.add(wt);let Et=[],Ot=96;for(let F=0;F<=Ot;F++)Et.push([-8.4+16.8*F/Ot,-7]);for(let F=1;F<=Ot;F++){let T=-7+14*F/Ot;Et.push([Qa(T),T])}for(let F=1;F<=Ot;F++)Et.push([8.4-16.8*F/Ot,7]);for(let F=1;F<Ot;F++){let T=7-14*F/Ot;Et.push([-Qa(T),T])}let Gt=[{col:11182734},{col:10852994},{col:12037269},{col:11114621},{col:7431244}];function Ft(F,T,B,J){return F===0?a:F===5?J:F===4?J-.17-.035*dn(T*2.4,B*2.4):[a,e-1.91,e-1.32,e-.71][F]+Math.sin(T*.61+B*.43+F*.8)*.13+Math.sin(T*1.7-B*.8+F*2.6)*.05+(dn(T*.65+F*11,B*.7)-.5)*.11}for(let F=0;F<Gt.length;F++){let T=Gt[F],B=[],J=[],ft=[],rt=[];for(let Rt=0;Rt<=Et.length;Rt++){let[Ut,Jt]=Et[Rt%Et.length],qt=d(Ut,Jt),_e=Ft(F,Ut,Jt,qt),we=Ft(F+1,Ut,Jt,qt);for(let[pe,nn]of[[_e,0],[we,1]])B.push(Ut,pe,Jt),ft.push(Rt/Et.length*8,(pe+1.7)/3),_.set(T.col).multiplyScalar(.88+dn(Ut*3.9+F*8,Jt*3.9+pe*2)*.2),J.push(_.r,_.g,_.b);if(Rt<Et.length){let pe=Rt*2;rt.push(pe,pe+1,pe+2,pe+1,pe+3,pe+2)}}let nt=new ie(Ar(B,rt,J,ft),M);nt.name=`Exposed illustrative earth layer ${F+1}`,nt.receiveShadow=!0,nt.castShadow=!0,f.add(nt)}let tt=new Bn;Et.forEach(([F,T],B)=>B?tt.lineTo(F,-T):tt.moveTo(F,-T)),tt.closePath();let ot=new ie(new tr(tt),new Se({color:11840147,roughness:1}));ot.rotation.x=Math.PI/2,ot.position.y=a,f.add(ot);let At=[new fi([new C(-8.75,0,.18),new C(-4.5,0,-.1),new C(0,0,.18),new C(4.5,0,-.16),new C(8.75,0,.18)]),new fi([new C(.13,0,-6.75),new C(-.15,0,-3.4),new C(.15,0,0),new C(-.11,0,3.4),new C(.13,0,6.75)])],bt=[],Tt=[],Wt=[],Kt=[],U=[],ct=[];for(let F of At){let T=F.getPoints(144),B=Tt.length/3,J=[];for(let ft=0;ft<T.length;ft++){let rt=T[ft],nt=F.getTangent(ft/(T.length-1)),Rt=new C(-nt.z,0,nt.x).normalize();bt.push(rt),ct.push(Rt),J.push(!h(rt.x,rt.z,.7));for(let Ut=0;Ut<3;Ut++){let Jt=(Ut-1)*(.43+.035*Math.sin(ft*.11)),qt=rt.x+Rt.x*Jt,_e=rt.z+Rt.z*Jt;Tt.push(qt,d(qt,_e)+.024,_e),Kt.push(Ut/2,ft/12),_.set(13221540).multiplyScalar(.93+dn(qt*5,_e*5)*.1),Wt.push(_.r,_.g,_.b)}}for(let ft=0;ft<T.length-1;ft++)if(J[ft]&&J[ft+1])for(let rt=0;rt<2;rt++){let nt=B+ft*3+rt;U.push(nt,nt+1,nt+3,nt+1,nt+4,nt+3)}}let it=new Se({color:16777215,vertexColors:!0,roughness:1,bumpMap:m,bumpScale:.045}),et=new ie(Ar(Tt,U,Wt,Kt),it);et.name="Curved fine-gravel connecting path",et.receiveShadow=!0,f.add(et);function Q(F,T){let B=100;for(let J=0;J<bt.length;J+=5)B=Math.min(B,Math.hypot(bt[J].x-F,bt[J].z-T));return B}let xt=new ts(1,1),ut=[];for(let F=2;F<bt.length-2;F+=2)for(let T of[-1,1]){let B=bt[F],J=ct[F],ft=B.x+J.x*T*(.5+u()*.1),rt=B.z+J.z*T*(.5+u()*.1);h(ft,rt,.2)||ut.push({x:ft,z:rt,y:d(ft,rt)+.025,sx:.035+u()*.035,sy:.025+u()*.02,sz:.045+u()*.05})}for(let F=0;F<90;F++){let T=(u()-.5)*17.5,B=(u()-.5)*13.3;h(T,B,.35)||Q(T,B)<1||!Vc(T,B,.2)||(Math.abs(T)>6.2||Math.abs(B)>4.2)&&ut.push({x:T,z:B,y:d(T,B)+.04,sx:.12+u()*.36,sy:.1+u()*.22,sz:.1+u()*.32})}for(let F=0;F<28;F++){let T=4.45+u()*3.5,B=-5.25+u()*1.8;h(T,B,.4)||ut.push({x:T,z:B,y:d(T,B)+.035,sx:.22+u()*.34,sy:.15+u()*.24,sz:.15+u()*.3})}for(let F=0;F<56;F++){let T=F%4,B=u(),J=a+.3+u()*1.9,ft=T<2?-7.95+B*15.9:T===2?-8.96:8.96,rt=T<2?T===0?-6.97:6.97:-5.95+B*11.9;ut.push({x:ft,z:rt,y:J,sx:.055+u()*.12,sy:.04+u()*.09,sz:.045+u()*.1})}let gt=new _n(xt,y,ut.length);gt.name="Varied pebbles and dry-stacked terrace stone";let z=[8617067,10128758,8027504,11049858];ut.forEach((F,T)=>{g.position.set(F.x,F.y,F.z),g.rotation.set(u()*.8,u()*Math.PI,u()*.7),g.scale.set(F.sx,F.sy,F.sz),g.updateMatrix(),gt.setMatrixAt(T,g.matrix),_.set(z[Math.floor(u()*z.length)]).multiplyScalar(.82+u()*.24),gt.setColorAt(T,_)}),gt.castShadow=!0,gt.receiveShadow=!0,f.add(gt);let q=[[-7.8,-5.9,.88],[-6.8,-5.25,1.18],[-5.55,-6.1,.72],[-4.35,-5.75,.89],[-1.75,-5.9,.94],[4.2,-5.9,.72],[6.1,-5.7,1.18],[7.75,-5.85,.69],[7.15,-4.35,.86],[-8,-2.7,.91],[-7.55,-1.25,.64],[-7.7,5.85,.78],[-6.6,5.35,.61],[.8,5.9,.69],[6.5,5.75,.93],[7.7,4.95,.64],[8,.2,.75]].filter(([F,T,B])=>!h(F,T,B*.85)),S=[],x=[];function I(F,T,B,J){S.push({a:F,b:T,r1:B,r2:J})}for(let[F,T,B]of q){let J=d(F,T),ft=(2.6+u()*.7)*B,rt=(u()-.5)*.28,nt=new C(F,J,T),Rt=new C(F+rt,J+ft*.6,T+.08),Ut=new C(F+rt*.7,J+ft,T-.05);I(nt,Rt,.105*B,.07*B),I(Rt,Ut,.07*B,.027*B);let Jt=[{x:Ut.x,y:Ut.y-.04,z:Ut.z,r:.83*B}];for(let qt=0;qt<4;qt++){let _e=qt*Math.PI*.5+u()*.9,we=(.58+u()*.3)*B,pe=new C(F+Math.cos(_e)*we,J+ft*(.76+u()*.16),T+Math.sin(_e)*we);I(Rt,pe,.052*B,.016*B),Jt.push({x:pe.x,y:pe.y+.04,z:pe.z,r:.64*B})}for(let qt of Jt)for(let _e=0;_e<43;_e++){let we=u()*Math.PI*2,pe=Math.acos(u()*2-1),nn=Math.cbrt(u())*qt.r;x.push({x:qt.x+Math.sin(pe)*Math.cos(we)*nn,y:qt.y+Math.cos(pe)*nn*.62,z:qt.z+Math.sin(pe)*Math.sin(we)*nn,s:.25+u()*.22,rot:u()*Math.PI*2,tilt:(u()-.5)*1.5,type:0})}}let N=new Ge(.6,1,1,9,1),V=new _n(N,A,S.length);V.name="Tapered branching shade-tree trunks";let k=new C(0,1,0),ht=new C;S.forEach((F,T)=>{ht.copy(F.b).sub(F.a),g.position.copy(F.a).add(F.b).multiplyScalar(.5),g.quaternion.setFromUnitVectors(k,ht.clone().normalize()),g.scale.set(F.r1,ht.length(),F.r1),g.updateMatrix(),V.setMatrixAt(T,g.matrix),_.set(10193264).multiplyScalar(.9+u()*.18),V.setColorAt(T,_)}),V.castShadow=!0,V.receiveShadow=!0,f.add(V);let at=[];for(let F=0;F<95;F++){let T=(u()-.5)*17.3,B=(u()-.5)*12.9;!Vc(T,B,.4)||h(T,B,.4)||Q(T,B)<.92||Math.abs(T)<6.3&&Math.abs(B)<4.3&&u()<.8||at.push({x:T,z:B,y:d(T,B),s:.18+u()*.28})}for(let F of at)for(let T=0;T<38;T++){let B=u()*Math.PI*2,J=Math.sqrt(u())*F.s;x.push({x:F.x+Math.cos(B)*J,y:F.y+.06+u()*F.s*.9,z:F.z+Math.sin(B)*J,s:.14+u()*.12,rot:B,tilt:-.6+u()*1.2,type:1})}let vt=new _n(S_(),P,x.length);vt.name="Individual curved canopy and garden leaves";let Mt=[2705199,4020537,5401154,6059080,3494464];x.forEach((F,T)=>{g.position.set(F.x,F.y,F.z),g.rotation.set(F.tilt,F.rot,(u()-.5)*.8),g.scale.set(F.s*.48,F.s,F.s),g.updateMatrix(),vt.setMatrixAt(T,g.matrix),_.set(Mt[Math.floor(u()*Mt.length)]).multiplyScalar(.89+u()*.19),vt.setColorAt(T,_)}),vt.castShadow=!0,vt.receiveShadow=!0,f.add(vt);let st=[];for(let F=0;F<7200;F++){let T=(u()-.5)*17.8,B=(u()-.5)*13.8;!Vc(T,B,.16)||h(T,B,.18)||Q(T,B)<.76||dn(T*1.6+9,B*1.6)<.25||st.push({x:T,z:B,y:d(T,B),s:.09+u()*.2})}let mt=new _n(b_(),R,st.length);mt.name="Fine native-style meadow texture",st.forEach((F,T)=>{g.position.set(F.x,F.y+.008,F.z),g.rotation.set(0,u()*Math.PI*2,0),g.scale.set(F.s,F.s,F.s),g.updateMatrix(),mt.setMatrixAt(T,g.matrix),_.set(u()>.75?10264940:6519630).multiplyScalar(.85+u()*.3),mt.setColorAt(T,_)}),mt.receiveShadow=!0,mt.castShadow=!1,f.add(mt);let Lt=[];at.forEach((F,T)=>{if(T%5===0)for(let B=0;B<5;B++){let J=u()*Math.PI*2;Lt.push([F.x+Math.cos(J)*F.s*.7,F.y+F.s*.7,F.z+Math.sin(J)*F.s*.7])}});let It=new _n(new ts(.027,0),D,Lt.length);It.name="Restrained pale garden blossoms",Lt.forEach(([F,T,B],J)=>{g.position.set(F,T,B),g.rotation.set(0,0,0),g.scale.set(1,1,1),g.updateMatrix(),It.setMatrixAt(J,g.matrix)}),f.add(It),f.scale.set(r,1,o),f.updateMatrixWorld(!0);let yt={meshes:0,drawCalls:0,triangles:0,treeCount:q.length,individualLeaves:x.length,grassTufts:st.length,rockCount:ut.length,illustrative:!0,width:i,depth:t,groundY:e,padCount:c.length,seed:l};return f.traverse(F=>{if(F.isMesh){yt.meshes++,yt.drawCalls+=Array.isArray(F.material)?F.material.length:1;let T=F.geometry;yt.triangles+=(T.index?T.index.count:T.attributes.position.count)/3*(F.isInstancedMesh?F.count:1)}}),{root:f,heightAt:(F,T)=>d(F/r,T/o),stats:yt,update(F,T={}){v.value=Number.isFinite(F)?F:0;let B=Number(T.wind??.45);b.value=wr(Number.isFinite(B)?B>2?B/35:B:.45,0,1.8);let J=Number(T.rain??0)>0;E.roughness=J?.74:.98,E.color.setScalar(J?.82:1),it.roughness=J?.58:1,it.color.setScalar(J?.82:1),M.color.setScalar(J?.9:1)}}}function Jy({heightAt:i=()=>.43,includeActors:t=!0}={}){let e=new ln;e.name="Glenolia detailed cafe and nursery \u2014 illustrative";let n=new Set,s=[],r=new Map,o={},a={green:3099196,ivory:16118248,sage:14278608,copper:11893594,ink:3879725},c=53931;function l(){return c=1664525*c+1013904223>>>0,c/4294967296}function h(z){if(typeof document>"u")return null;let q=document.createElement("canvas");q.width=q.height=256;let S=q.getContext("2d");if(!S)return null;if(S.fillStyle=z==="wood"?"#8c6546":z==="soil"?"#514133":"#e8e3d7",S.fillRect(0,0,256,256),z==="wood"){for(let I=0;I<140;I++){let N=l()*256;S.strokeStyle=`rgba(${l()>.5?"48,29,16":"207,173,126"},${.05+l()*.13})`,S.lineWidth=.25+l()*1.5,S.beginPath(),S.moveTo(N,-10);for(let V=0;V<=270;V+=18)S.lineTo(N+Math.sin(V*.025+I)*(.6+l()*2.4),V);S.stroke()}for(let I=0;I<4;I++)S.strokeStyle="rgba(45,28,15,.10)",S.lineWidth=.7,S.beginPath(),S.ellipse(l()*256,l()*256,3+l()*6,10+l()*20,.05,0,Math.PI*2),S.stroke()}else for(let I=0;I<5200;I++){let N=l()>.5?255:0;S.fillStyle=`rgba(${N},${N},${N},${z==="soil"?.05+l()*.12:.012+l()*.025})`,S.fillRect(l()*256,l()*256,.3+l()*1.8,.3+l()*1.8)}let x=new ks(q);return x.colorSpace=Me,x.wrapS=x.wrapT=He,x.anisotropy=4,x.needsUpdate=!0,x}let d=h("wood"),f=h("soil"),u=h("plaster");function g(z,q,S=.75,x=0,I={}){let N=I.clearcoat===void 0?Se:ir;return o[z]||=new N({color:q,roughness:S,metalness:x,...I})}let _={plaster:g("plaster",a.ivory,.91,0,{map:u}),tile:g("tile",a.green,.22),tile2:g("tile2",4744017,.27),tile3:g("tile3",3494723,.2),grout:g("grout",7700593,.91),stone:g("stone",15262679,.56),wood:g("wood",16777215,.62,0,{map:d}),woodEdge:g("woodEdge",7952446,.68),ink:g("ink",a.ink,.65),metal:g("metal",12633535,.24,.78),brass:g("brass",10978141,.3,.62),ceramic:g("ceramic",15855072,.23,0,{clearcoat:.8,clearcoatRoughness:.14}),sageCeramic:g("sageCeramic",12898492,.26,0,{clearcoat:.7,clearcoatRoughness:.17}),terra:g("terra",10907985,.87),terraLight:g("terraLight",12158561,.83),soil:g("soil",16777215,1,0,{map:f}),leaf:g("leaf",3233596,.54),leafLight:g("leafLight",5404232,.58),leafVein:g("leafVein",7442525,.75),dark:g("dark",1516059,.5),coffee:g("coffee",3875865,.3),paper:g("paper",15327178,.92),apron:g("apron",a.green,.89),shirt:g("shirt",15065036,.94),shirtSage:g("shirtSage",11122075,.92),shirtCopper:g("shirtCopper",11499610,.91),hair:g("hair",3484453,.88),hair2:g("hair2",6899763,.88),skin:g("skin",13869434,.82),skin2:g("skin2",9988423,.83),skin3:g("skin3",14924950,.82),lips:g("lips",10315091,.9),glass:g("glass",11389124,.16,.12,{transparent:!0,opacity:.52,depthWrite:!1})};function m(z,q=0,S=0,x=0){let I=new ln;return I.position.set(q,S,x),z.add(I),I}function p(z,q,S,x=0,I=0,N=0){let V=new ie(q,S);return V.position.set(x,I,N),V.castShadow=!0,V.receiveShadow=!0,z.add(V),V}let E=new Tn(1,1,1),M=new ns(1,12,9),y=new Ge(1,1,1,16);function R(z,q,S,x,I,N=0,V=0,k=0){let ht=p(z,E,I,N,V,k);return ht.scale.set(q,S,x),ht}function A(z,q,S,x,I,N=0,V=0,k=0){let ht=p(z,M,I,N,V,k);return ht.scale.set(q,S,x),ht}function P(z,q,S,x,I=0,N=0,V=0){let k=p(z,y,x,I,N,V);return k.scale.set(q,S,q),k}function D(z,q,S,x,I){let N=new C(...q),V=new C(...S),k=V.sub(N),ht=P(z,x,k.length(),I);return ht.position.copy(N.addScaledVector(k,.5)),ht.quaternion.setFromUnitVectors(new C(0,1,0),k.normalize()),ht}let b=new Map;function v(z,q,S,x,I,N,V=0,k=0,ht=0){let at=[q,S,x,I].join(":"),vt=b.get(at);if(!vt){let Mt=new Bn,st=-q/2,mt=-x/2;Mt.moveTo(st+I,mt),Mt.lineTo(st+q-I,mt),Mt.quadraticCurveTo(st+q,mt,st+q,mt+I),Mt.lineTo(st+q,mt+x-I),Mt.quadraticCurveTo(st+q,mt+x,st+q-I,mt+x),Mt.lineTo(st+I,mt+x),Mt.quadraticCurveTo(st,mt+x,st,mt+x-I),Mt.lineTo(st,mt+I),Mt.quadraticCurveTo(st,mt,st+I,mt),vt=new js(Mt,{depth:S,bevelEnabled:!0,bevelThickness:Math.min(.018,S*.18),bevelSize:Math.min(.018,I*.3),bevelSegments:2,curveSegments:4,steps:1}),vt.rotateX(-Math.PI/2),vt.translate(0,-S/2,0),b.set(at,vt)}return p(z,vt,N,V,k,ht)}function L(z,q,S,x,I=0,N=0,V=0,k=Math.PI*2){return p(z,new er(q,S,5,18,k),x,I,N,V)}function O(z,q,S,x,I=1,N=_.ceramic){let V=m(z,q,S,x);V.scale.setScalar(I);let k=[[.046,0],[.059,.013],[.069,.109],[.067,.121],[.056,.121],[.053,.105],[.049,.02]].map(([at,vt])=>new lt(at,vt));p(V,new es(k,20),N),P(V,.054,.004,_.coffee,0,.112,0);let ht=L(V,.041,.009,N,.076,.066,0,Math.PI*1.64);return ht.rotation.z=-Math.PI*.82,P(V,.102,.012,N,0,-.006,0),L(V,.079,.003,N,0,.002,0).rotation.x=Math.PI/2,V}function W(z=.32,q=.13){let S=[],x=[],I=[];for(let V=0;V<=7;V++){let k=V/7,ht=Math.pow(Math.sin(k*Math.PI),.8)*q,at=Math.sin(k*Math.PI)*.025,vt=k*z;for(let Mt of[-1,0,1])S.push(Mt*ht,at-(Mt?.012:0),vt),x.push((Mt+1)/2,k)}for(let V=0;V<7;V++)for(let k=0;k<2;k++){let ht=V*3+k;I.push(ht,ht+3,ht+1,ht+1,ht+3,ht+4)}let N=new oe;return N.setAttribute("position",new kt(S,3)),N.setAttribute("uv",new kt(x,2)),N.setIndex(I),N.computeVertexNormals(),N}let Z=W();_.leaf.side=_.leafLight.side=ke;function j(z,q,S,x,I=.62,N=1){let V=m(z,q,S,x);D(V,[0,0,0],[.015,I,0],.012,_.woodEdge);let k=N===0?2:4;for(let ht=0;ht<k;ht++)for(let at of[-1,1]){let vt=.12+ht*(I-.18)/Math.max(1,k-1),Mt=ht*.82+(at===1?0:Math.PI),st=(.72+(k-ht)*.1)*I/.6,mt=m(V,Math.sin(Mt)*.045,vt,Math.cos(Mt)*.045);mt.rotation.y=Mt,mt.rotation.x=-.06+ht*.08,p(mt,Z,ht%3===0?_.leafLight:_.leaf,0,0,0).scale.setScalar(st),D(mt,[0,.002,0],[0,.02,.3*st],.0025,_.leafVein)}return V}let $=[[.125,0],[.139,.015],[.176,.225],[.187,.229],[.19,.264],[.175,.27],[.163,.245],[.139,.025]].map(([z,q])=>new lt(z,q)),dt=new es($,18);function X(z,q,S,x,I=1,N=.62){let V=m(z,q,S,x);return V.scale.setScalar(I),p(V,dt,l()>.6?_.terraLight:_.terra),P(V,.16,.018,_.soil,0,.242,0),j(V,0,.246,0,N),V}function pt(z,q,S,x,I=0){let N=m(z,q,S,x);N.rotation.y=I,v(N,.42,.055,.43,.065,_.wood,0,.45,0);for(let V of[-1,1])for(let k of[-1,1])D(N,[V*.155,.43,k*.15],[V*.19,0,k*.18],.018,_.woodEdge);for(let V of[-1,1])D(N,[V*.16,.42,-.16],[V*.17,.87,-.2],.019,_.woodEdge),D(N,[V*.18,.17,-.17],[V*.18,.17,.17],.012,_.woodEdge);return v(N,.39,.115,.045,.018,_.wood,0,.78,-.2),v(N,.39,.075,.045,.014,_.wood,0,.64,-.18),N}function St(z,q,S,x,I=.45){let N=m(z,q,S,x);P(N,I,.065,_.wood,0,.7,0),L(N,I-.018,.014,_.woodEdge,0,.717,0).rotation.x=Math.PI/2,P(N,.035,.65,_.ink,0,.34,0),P(N,.2,.026,_.ink,0,.025,0);for(let V=0;V<3;V++){let k=V*Math.PI*2/3;D(N,[0,.08,0],[Math.sin(k)*.31,.015,Math.cos(k)*.31],.016,_.ink)}return O(N,-.14,.742,.08,.75),O(N,.17,.742,-.11,.75,_.sageCeramic),v(N,.17,.008,.22,.008,_.paper,.1,.741,.12).rotation.y=.23,N}let wt=i(-3,-1)+.07,Et=m(e,-3,wt,-1);v(Et,5,.16,4,.12,_.woodEdge,0,-.08,0);for(let z=0;z<16;z++){let q=v(Et,4.94,.055,.239,.008,_.wood,0,.025,-1.85+z*.245);z%3===0&&(q.rotation.y=.001)}v(Et,4.95,1.4,.13,.025,_.plaster,0,.7,-1.94),v(Et,.13,.95,3.35,.025,_.plaster,-2.45,.475,-.27),v(Et,4.98,.055,.18,.018,_.stone,0,1.425,-1.94),v(Et,.18,.055,3.4,.018,_.stone,-2.45,.975,-.27);let Ot=m(Et,.82,.98,-1.78);v(Ot,1.35,.045,.26,.016,_.wood),D(Ot,[-.5,-.18,-.06],[-.5,0,.08],.015,_.brass),D(Ot,[.5,-.18,-.06],[.5,0,.08],.015,_.brass);for(let z=0;z<5;z++)O(Ot,-.48+z*.23,.03,0,.65,z%2?_.ceramic:_.sageCeramic);let Gt=m(Et,-.35,0,-.73);v(Gt,3.45,.75,.87,.045,_.grout,0,.425,0);for(let z=0;z<4;z++)for(let q=0;q<15;q++){let S=[_.tile,_.tile2,_.tile3][(q*5+z*3)%3];v(Gt,.219,.167,.023,.012,S,-1.6+q*.229,.14+z*.178,.45)}for(let z=0;z<4;z++)v(Gt,.025,.167,.79,.01,_.tile3,1.74,.14+z*.178,0);v(Gt,3.59,.085,1.02,.055,_.stone,0,.843,0),D(Gt,[-1.6,.27,.53],[1.6,.27,.53],.016,_.brass);for(let z of[-1.35,1.35])D(Gt,[z,.27,.45],[z,.27,.53],.017,_.brass);let Ft=m(Gt,-.42,.89,-.1);v(Ft,1.18,.065,.53,.045,_.ink,0,.032,0),v(Ft,1.13,.43,.47,.055,_.tile,0,.27,0),v(Ft,1.22,.07,.55,.04,_.metal,0,.515,0),v(Ft,1.18,.055,.58,.03,_.metal,0,.08,.1),v(Ft,1.04,.025,.21,.015,_.ink,0,.115,.24);for(let z=0;z<13;z++)R(Ft,.012,.008,.18,_.metal,-.46+z*.077,.132,.25);for(let z of[-.29,.29]){let q=L(Ft,.044,.006,_.metal,z,.37,.244);P(Ft,.034,.009,_.ink,z,.37,.249).rotation.x=Math.PI/2,q.rotation.x=0,P(Ft,.034,.085,_.metal,z,.22,.29),D(Ft,[z,.2,.27],[z+.15,.2,.37],.015,_.ink),D(Ft,[z,.19,.27],[z,.15,.27],.011,_.metal),O(Ft,z,.145,.24,.7);for(let S of[-.055,0,.055])A(Ft,.01,.01,.007,_.ceramic,z+S,.45,.242)}D(Ft,[.49,.32,.19],[.58,.25,.27],.012,_.metal),D(Ft,[.58,.25,.27],[.58,.1,.32],.01,_.metal);for(let z of[-.25,0,.25])O(Ft,z,.56,0,.6);let tt=m(Gt,.67,.89,-.13);v(tt,.3,.28,.31,.035,_.tile,0,.15,0),P(tt,.1,.1,_.metal,0,.36,0),p(tt,new Ge(.155,.09,.22,18),_.glass,0,.5,0),P(tt,.16,.024,_.ink,0,.621,0),P(tt,.115,.11,_.coffee,0,.47,0),R(tt,.07,.035,.13,_.metal,0,.25,.19);let ot=m(Gt,.98,.89,.13);p(ot,new Ge(.085,.065,.18,18,1,!0),_.metal,0,.09,0),L(ot,.064,.009,_.metal,.085,.095,0,Math.PI*1.5).rotation.z=-Math.PI*.75;for(let z=0;z<3;z++)O(Gt,1.34,.9+z*.018,-.12,.78,_.sageCeramic);St(Et,-1.3,0,1.02,.43),pt(Et,-1.85,0,1,Math.PI/2),pt(Et,-.76,0,1.18,-Math.PI/2),St(Et,1.2,0,.86,.45),pt(Et,1.9,0,.89,-Math.PI/2),pt(Et,1.08,0,1.55,Math.PI),X(Et,-2.1,.06,1.5,.96,.65),X(Et,2.12,.06,-1.45,.9,.7);let At=i(3.3,1.5)+.05,bt=m(e,3.3,At,1.5),Tt=m(bt,0,0,-.58);for(let z of[-1.5,1.5])for(let q of[-.32,.32])D(Tt,[z,0,q],[z,.69,q],.03,_.woodEdge);for(let z=0;z<5;z++)v(Tt,3.35,.055,.15,.008,_.wood,0,.72,-.32+z*.16);for(let z of[-1.45,1.45])D(Tt,[z,.12,-.33],[z,.12,.33],.02,_.woodEdge);v(Tt,3.25,.035,.61,.01,_.wood,0,.23,0);for(let z=0;z<6;z++)X(Tt,-1.2+z*.47,.755,.03,.73,.43+z%3*.055);for(let z=0;z<5;z++)X(Tt,-1.15+z*.52,.25,0,.57,.28);let Wt=m(bt,-1.06,.02,.73);v(Wt,1.54,.13,.91,.035,_.ink,0,.065,0);for(let z=0;z<3;z++)for(let q=0;q<5;q++){let S=-.6+q*.3,x=-.3+z*.3;p(Wt,new Ge(.116,.084,.1,10),_.terraLight,S,.12,x),P(Wt,.105,.012,_.soil,S,.173,x),j(Wt,S,.18,x,.16+q%2*.04,0)}let Kt=m(bt,.86,0,.86);v(Kt,1.7,.2,1.11,.025,_.woodEdge,0,.1,0),v(Kt,1.59,.05,1,.018,_.soil,0,.205,0);for(let z=0;z<2;z++)for(let q=0;q<3;q++)j(Kt,-.52+q*.52,.23,-.26+z*.52,.35+(q+z)%2*.08,0);for(let z of[-.76,.76])v(Kt,.065,.06,1.12,.01,_.wood,z,.24,0);for(let z of[-.54,.54])v(Kt,1.72,.06,.065,.01,_.wood,0,.24,z);let U=m(bt,1.62,.03,-.11);p(U,new Ge(.15,.18,.3,18),_.sageCeramic,0,.17,0),D(U,[.1,.17,0],[.39,.29,0],.035,_.sageCeramic),p(U,new Ge(.057,.031,.055,12),_.sageCeramic,.4,.3,0).rotation.z=-.85,L(U,.18,.018,_.ink,0,.22,-.03).rotation.y=Math.PI/2,D(bt,[1.78,.02,-1.3],[1.92,1.15,-1.32],.017,_.woodEdge),v(bt,.17,.21,.028,.025,_.metal,1.77,.13,-1.3);for(let z=0;z<3;z++){let q=v(bt,.35,.38,.27,.09,_.paper,1.35+z*.08,.2,-1.31+z*.04);q.rotation.y=.1+z*.2}function ct(z,q,S,x,{skin:I=_.skin,shirt:N=_.shirt,hat:V=!1}={}){let k=m(z,q,S,x),ht=m(k,0,0,0);n.add(k),v(ht,.31,.4,.22,.08,N,0,.67,0),v(ht,.25,.3,.027,.025,_.apron,0,.62,.126),v(ht,.11,.055,.013,.005,_.woodEdge,0,.56,.146);let at=m(ht,0,1.03,0);A(at,.172,.193,.163,I);for(let Lt of[-1,1])A(at,.03,.046,.028,I,Lt*.169,-.01,0),A(at,.012,.017,.008,_.dark,Lt*.056,.008,.155);A(at,.025,.031,.031,I,0,-.022,.158);let vt=L(at,.028,.003,_.lips,0,-.066,.151,Math.PI);vt.rotation.z=Math.PI,p(at,new ns(.177,16,8,0,Math.PI*2,0,Math.PI*.48),I===_.skin2?_.hair:_.hair2,0,.015,-.01),V&&(P(at,.225,.025,_.terraLight,0,.172,0),p(at,new Ge(.13,.16,.12,16),_.paper,0,.232,0),L(at,.157,.008,_.woodEdge,0,.189,0).rotation.x=Math.PI/2);let Mt=[],st=[];for(let Lt of[-1,1]){let It=m(ht,Lt*.19,.82,0);p(It,new Hs(.046,.19,3,8),N,0,-.12,0),A(It,.046,.058,.043,I,0,-.26,0),Mt.push(It);let yt=m(ht,Lt*.09,.46,0);v(yt,.11,.3,.12,.035,_.ink,0,-.15,0),v(yt,.125,.1,.2,.034,_.woodEdge,0,-.35,.035),st.push(yt)}let mt={root:k,body:ht,head:at,arms:Mt,legs:st,baseX:q,baseZ:x};return s.push(mt),mt}let it=null,et=null,Q=null;if(t){it=ct(Et,-.65,.07,-1.35,{skin:_.skin2,shirt:_.shirt}),it.root.rotation.y=Math.PI*.1,it.arms[0].rotation.x=-.9,it.arms[1].rotation.x=-.8,et=ct(bt,.58,0,-1.28,{skin:_.skin3,shirt:_.shirtSage,hat:!0}),et.root.rotation.y=Math.PI,Q=ct(bt,-1.95,0,.11,{skin:_.skin,shirt:_.shirtCopper}),Q.root.rotation.y=Math.PI*.7;let z=m(Q.body,0,.67,.32);X(z,0,0,0,.49,.25),Q.arms.forEach((q,S)=>{q.rotation.x=-.9,q.rotation.z=S?-.16:.16})}e.updateMatrixWorld(!0);for(let z of[Et,bt]){let q=new jt().copy(z.matrixWorld).invert(),S=[],x=new Map;z.traverse(I=>{if(!I.isMesh||I.isInstancedMesh)return;for(let k=I;k&&k!==z;k=k.parent)if(n.has(k))return;let N=I.material.uuid;x.has(N)||x.set(N,{material:I.material,geos:[]});let V=I.geometry.index?I.geometry.toNonIndexed():I.geometry.clone();V.applyMatrix4(new jt().multiplyMatrices(q,I.matrixWorld)),x.get(N).geos.push(V),S.push(I)});for(let[I,{material:N,geos:V}]of x){let k=Yu(V,!1);V.forEach(ht=>ht.dispose()),k&&p(z,k,N),r.set(z.uuid+":"+I,{material:N})}S.forEach(I=>I.removeFromParent())}let xt={cafe:new C(-3,wt+1.5,-1),garden:new C(3.3,At+1.2,1.5)},ut={meshCount:0,triangles:0,staticMaterialBatches:r.size,characters:s.length};e.traverse(z=>{z.isMesh&&(ut.meshCount++,ut.triangles+=(z.geometry.index?z.geometry.index.count:z.geometry.attributes.position.count)/3)});function gt(z){if(!t)return;let q=Number.isFinite(z)?z:0;it.head.rotation.y=Math.sin(q*.48)*.15,it.arms[1].rotation.x=-.9+Math.sin(q*1.8)*.11,it.arms[0].rotation.x=-.82+Math.sin(q*.9)*.04,et.body.rotation.x=.1+Math.sin(q*.8)*.025,et.arms[0].rotation.x=-.83+Math.sin(q*1.7)*.1,et.arms[1].rotation.x=-.93+Math.sin(q*1.7+.7)*.1,et.head.rotation.x=.12;let S=q*.1%1,x=S<.5?S*2:(1-S)*2,I=x*x*(3-2*x);Q.root.position.x=Q.baseX+.65*I,Q.root.position.z=Q.baseZ+.26*Math.sin(I*Math.PI);let N=S>.05&&S<.45||S>.55&&S<.95;Q.root.rotation.y=S<.5?Math.PI*.68:-Math.PI*.32,Q.legs.forEach((V,k)=>V.rotation.x=N?Math.sin(q*5.7+k*Math.PI)*.25:0),Q.body.position.y=N?Math.abs(Math.sin(q*5.7))*.012:0,Q.head.rotation.y=Math.sin(q*.5)*.08}return gt(0),{root:e,update:gt,anchors:xt,stats:ut,cafeRoot:Et,gardenRoot:bt}}export{Ph as a,ke as b,ec as c,os as d,He as e,$e as f,Rn as g,Ue as h,Me as i,yn as j,lt as k,C as l,bn as m,jt as n,ge as o,zt as p,Us as q,De as r,kt as s,oe as t,ie as u,Tn as v,ln as w,zs as x,wn as y,_n as z,mo as A,Nl as B,vo as C,Ol as D,ks as E,Hs as F,Bl as G,Ge as H,zl as I,fi as J,Bn as K,js as L,es as M,Qs as N,ns as O,er as P,Gl as Q,Wl as R,Se as S,Xl as T,ql as U,ar as V,gi as W,Jl as X,Kl as Y,rs as Z,Nu as _,Gu as $,Vy as aa,Hy as ba,Yu as ca,qy as da,Jy as ea};
/*! For license information please see chunk-3JSTSOLM.js.LEGAL.txt */
