function mn(s,e){for(var n=0;n<e.length;n++){const t=e[n];if(typeof t!="string"&&!Array.isArray(t)){for(const i in t)if(i!=="default"&&!(i in s)){const r=Object.getOwnPropertyDescriptor(t,i);r&&Object.defineProperty(s,i,r.get?r:{enumerable:!0,get:()=>t[i]})}}}return Object.freeze(Object.defineProperty(s,Symbol.toStringTag,{value:"Module"}))}(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))t(i);new MutationObserver(i=>{for(const r of i)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&t(o)}).observe(document,{childList:!0,subtree:!0});function n(i){const r={};return i.integrity&&(r.integrity=i.integrity),i.referrerPolicy&&(r.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?r.credentials="include":i.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function t(i){if(i.ep)return;i.ep=!0;const r=n(i);fetch(i.href,r)}})();function ae(s,e,n){const t=n*Math.PI/180;return{L:s,a:e*Math.cos(t),b:e*Math.sin(t)}}function gn(s,e,n){const t=Math.sqrt(e*e+n*n);let r=Math.atan2(n,e)*180/Math.PI;return r<0&&(r+=360),{L:s,C:t,H:r}}function vn(s,e,n){const t=s+.3963377774*e+.2158037573*n,i=s-.1055613458*e-.0638541728*n,r=s-.0894841775*e-1.291485548*n,o=t*t*t,a=i*i*i,c=r*r*r,l=4.0767434796*o-3.3077115913*a+.2309699267*c,u=-1.2684380046*o+2.6097574011*a-.3413193965*c,h=-.0041960863*o-.7034186147*a+1.707614701*c;return{r:Math.max(0,l),g:Math.max(0,u),b:Math.max(0,h)}}function At(s,e,n){const t=ae(s,e,n);return vn(t.L,t.a,t.b)}function bn(s,e,n){const t=i=>{const r=Math.max(0,Math.min(1,i)),o=r<=.0031308?r*12.92:1.055*Math.pow(r,1/2.4)-.055;return Math.round(o*255).toString(16).padStart(2,"0")};return`#${t(s)}${t(e)}${t(n)}`}const yn=`
fn oklab_to_linear_rgb(L: f32, a: f32, b: f32) -> vec3<f32> {
  let l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  let m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  let s_ = L - 0.0894841775 * a - 1.2914855480 * b;

  let l = l_ * l_ * l_;
  let m = m_ * m_ * m_;
  let s = s_ * s_ * s_;

  let r =  4.0767434796 * l - 3.3077115913 * m + 0.2309699267 * s;
  let g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  let b_val = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s;

  return max(vec3<f32>(0.0), vec3<f32>(r, g, b_val));
}

fn oklch_to_oklab(L: f32, C: f32, H_rad: f32) -> vec3<f32> {
  return vec3<f32>(L, C * cos(H_rad), C * sin(H_rad));
}

fn oklch_to_linear_rgb(L: f32, C: f32, H_rad: f32) -> vec3<f32> {
  let lab = oklch_to_oklab(L, C, H_rad);
  return oklab_to_linear_rgb(lab.x, lab.y, lab.z);
}
`,xn=`
vec3 oklab_to_linear_rgb(float L, float a, float b) {
  float l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  float m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  float s_ = L - 0.0894841775 * a - 1.2914855480 * b;

  float l = l_ * l_ * l_;
  float m = m_ * m_ * m_;
  float s = s_ * s_ * s_;

  float r =  4.0767434796 * l - 3.3077115913 * m + 0.2309699267 * s;
  float g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  float b_val = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s;

  return max(vec3(0.0), vec3(r, g, b_val));
}

vec3 oklch_to_oklab(float L, float C, float H_rad) {
  return vec3(L, C * cos(H_rad), C * sin(H_rad));
}

vec3 oklch_to_linear_rgb(float L, float C, float H_rad) {
  vec3 lab = oklch_to_oklab(L, C, H_rad);
  return oklab_to_linear_rgb(lab.x, lab.y, lab.z);
}
`,Sn=["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"],Cn=[{name:"Sub-bass",minHz:40,maxHz:75},{name:"Bass Low",minHz:75,maxHz:150},{name:"Bass High",minHz:150,maxHz:300},{name:"Low-mid",minHz:300,maxHz:600},{name:"Mid Low",minHz:600,maxHz:1200},{name:"Mid High",minHz:1200,maxHz:2400},{name:"High-mid",minHz:2400,maxHz:4e3},{name:"Presence",minHz:4e3,maxHz:6500},{name:"Treble Low",minHz:6500,maxHz:9500},{name:"Treble High",minHz:9500,maxHz:12e3}];function Ne(s,e,n){return{L:(1-n)*s.L+n*e.L,a:(1-n)*s.a+n*e.a,b:(1-n)*s.b+n*e.b}}class Tt{smoothedTemperature=-.6;smoothedPitchAngle=0;smoothedMajorMinor=0;static PITCH_TO_FIFTHS=[0,7,2,9,4,11,6,1,8,3,10,5];constructor(){}processBands(e,n,t,i,r,o="shifting",a=1,c=.5,l=.1,u=.5,h=!1,d=0,f){const v=this.analyzeChroma(t,r),y=f?f.dominantHue:30,P=f?f.support1Hue:(y+25)%360,C=f?f.support2Hue:(y-25+360)%360;f?f.accentHue:(y+60)%360;const M=f?f.complementaryHue:(y+180)%360,g=f?f.dissonanceFactor:0,T=ae(.44+c*.04,.33,C),B=ae(.5+c*.05,.36,y),m=ae(.56+c*.06,.35,P),E=ae(.52+c*.05,.36,M),x=[],R=[];for(let F=0;F<10;F++){const A=Cn[F],I=this.computeBandAmplitude(e,A.minHz,A.maxHz,n),V=F/9;let U;if(V<=.5){const O=V/.5;U=Ne(T,B,O)}else{const O=(V-.5)/.5;U=Ne(B,m,O)}if(g>.15&&(F===4||F===7||F===9||g>.5&&F>=5)){const O=Math.min(.85,(g-.15)*1.4);U=Ne(U,E,O)}const G=gn(U.L,U.a,U.b);x.push({index:F,name:A.name,minHz:A.minHz,maxHz:A.maxHz,centerHz:Math.sqrt(A.minHz*A.maxHz),amplitude:I,rawHue:G.H,effectiveHue:G.H,lightness:U.L,chroma:G.C,oklab:[U.L,U.a,U.b]}),I>.04&&R.push({hue:G.H,weight:I})}const L=Math.max(.44,Math.min(.54,.46+c*.05)),_=ae(L,.32,y),b=this.calculateHueSpread(R),p=y>=340||y<=90,S=f?f.colorTempBias:0;let w=`Harmonic: ${v.pitchName} (${Math.round(y)}°) • ${f?f.musicalMode.toUpperCase():"MAJOR"}`;S>.04?w=`Warm Filter (+${Math.round(S*100)}%): ${v.pitchName} (${Math.round(y)}°)`:S<-.04&&(w=`Cool Filter (${Math.round(S*100)}%): ${v.pitchName} (${Math.round(y)}°)`);const z={temperature:S!==0?S:p?.7:-.7,isWarm:S!==0?S>0:p,family:S>0||S===0&&p?"warm":"cold",baseHue:Math.round(y),baseLab:[_.L,_.a,_.b],description:w,rotationAngle:Math.round(y),isShifting:!1};return{bands:x,pitchInfo:v,hueSpreadDeg:Math.round(b),colorTemperature:z}}analyzeChroma(e,n){let t=0,i=0;const r=new Array(12);for(let g=0;g<12;g++){const T=e[g]||0;r[g]=T,T>i&&(i=T,t=g)}const o=Tt.PITCH_TO_FIFTHS[t],a=o*30,c=1-Math.exp(-n/2.8);let l=a-this.smoothedPitchAngle;l>180&&(l-=360),l<-180&&(l+=360),this.smoothedPitchAngle=(this.smoothedPitchAngle+l*c+360)%360;const u=e[t],h=e[(t+4)%12]||0,d=e[(t+3)%12]||0,f=e[(t+7)%12]||0,v=u+h*1.6+f*1.1,y=u+d*1.6+f*1.1,P=(v-y)/Math.max(.01,v+y),C=1-Math.exp(-n/2);this.smoothedMajorMinor+=(P-this.smoothedMajorMinor)*C;const M=Math.max(-.15,Math.min(.15,this.smoothedMajorMinor*.25));return{chroma12:r,dominantPitchClass:t,pitchName:Sn[t],circleOfFifthsIndex:o,pitchRotationAngle:this.smoothedPitchAngle,majorMinorScore:this.smoothedMajorMinor,biasApplied:M}}computeBandAmplitude(e,n,t,i){const r=Math.max(0,Math.floor(n/i)),o=Math.min(e.length-1,Math.ceil(t/i));if(r>o)return 0;let a=0,c=0;for(let l=r;l<=o;l++)a+=e[l],c++;return c>0?a/c:0}calculateHueSpread(e){if(e.length<2)return 50;let n=0,t=0,i=0;for(const a of e){const c=a.hue*Math.PI/180;n+=Math.sin(c)*a.weight,t+=Math.cos(c)*a.weight,i+=a.weight}if(i<=.001)return 50;const r=Math.sqrt(n*n+t*t)/i,o=Math.sqrt(Math.max(0,2*(1-r)));return Math.min(360,o*180/Math.PI)}}const Tn=[30,350,80,300,250,5,180,55,325,215,260,280];class _n{dominantHue=30;isInitialized=!1;streamAge=0;zCoordinate=0;prevAmplitude=0;smoothedAmp=0;fluidVelocity=.25;wanderingAngle=0;beatDanceMomentum=0;burstIntensity=0;burstRadius=0;burstOrigin=[.5,.5];timeSinceLastBurst=999;dissonanceFactor=0;constructor(){}update(e,n,t,i,r,o,a=!1,c=!1,l=0,u=120,h=!1){const d=Math.max(.001,Math.min(.1,r));this.streamAge+=d;let f=0,v=0,y=0;for(let H=0;H<12;H++){const N=t[H];y+=N,N>v&&(v=N,f=H)}if(y>.005){const H=Tn[f];if(!this.isInitialized)this.dominantHue=H,this.isInitialized=!0;else{const N=1-Math.exp(-d/6);let q=H-this.dominantHue;for(;q>180;)q-=360;for(;q<-180;)q+=360;this.dominantHue=(this.dominantHue+q*N+360)%360}}const P=Math.max(-1,Math.min(1,o.colorTempBias??0));let C=this.dominantHue;if(P>.001){let N=40-C;for(;N>180;)N-=360;for(;N<-180;)N+=360;C=(C+N*P+360)%360}else if(P<-.001){const N=Math.abs(P);let q=235-C;for(;q>180;)q-=360;for(;q<-180;)q+=360;C=(C+q*N+360)%360}const M=(C+25)%360,g=(C-25+360)%360,T=(C+60)%360,B=(C+180)%360,m=Math.max(0,Math.min(1,i)),E=1-Math.exp(-d/.4);this.smoothedAmp+=(m-this.smoothedAmp)*E;const x=Math.max(.45,Math.min(2.5,(u||115)/115)),R=Math.max(.35,Math.min(3.2,Math.pow(x,1.75)));a||h||c?this.beatDanceMomentum=Math.min(1.8,this.beatDanceMomentum+.6):this.beatDanceMomentum*=Math.exp(-d/.35);const L=1+this.beatDanceMomentum*.7*Math.min(1.6,x),_=.45*R;this.wanderingAngle+=(Math.sin(this.zCoordinate*.7)*.8+Math.cos(this.zCoordinate*.45+1.2)*.6)*_*d;const b=.36*(1+(o.viscosityBias||0)*-.35),p=(o.sensitivity||1)*1.1;this.fluidVelocity=(b+this.smoothedAmp*p)*R*L,this.zCoordinate+=this.fluidVelocity*d;const S=(m-this.prevAmplitude)/d;this.prevAmplitude=m,this.timeSinceLastBurst+=d;const z=this.streamAge>1&&(S>3.2&&m>.4||a&&l>.42||c);let F=!1;if(z&&this.timeSinceLastBurst>.28){this.burstIntensity=1,this.burstRadius=.04,this.timeSinceLastBurst=0,F=!0;const H=Math.sin(this.wanderingAngle)*.1,N=Math.cos(this.wanderingAngle)*.1;this.burstOrigin=[.5+H,.5+N]}else this.burstIntensity*=Math.exp(-d/.75),this.burstRadius+=d*1.55,this.burstIntensity<.005&&(this.burstIntensity=0);const A=f,I=(A+4)%12,V=(A+3)%12,U=(A+7)%12,G=(A+6)%12,O=t[A]+1.4*t[I]+t[U],j=t[A]+1.4*t[V]+t[U],K=1.6*t[G];let ie=0;K>O*.7&&K>j*.7?ie=.85:j>O*1.05?ie=.5:ie=0;const X=1-Math.exp(-d/.65);this.dissonanceFactor+=(ie-this.dissonanceFactor)*X;let $="major";return this.dissonanceFactor>.6?$="dissonant":this.dissonanceFactor>.25&&($="minor"),{dominantHue:C,support1Hue:M,support2Hue:g,accentHue:T,complementaryHue:B,fluidVelocity:this.fluidVelocity,zCoordinate:this.zCoordinate,amplitude:this.smoothedAmp,amplitudeDerivative:S,bpmFlowScale:R,randomAngle:this.wanderingAngle,isBurst:F||this.burstIntensity>.05,burstIntensity:this.burstIntensity,burstRadius:this.burstRadius,burstOrigin:this.burstOrigin,dissonanceFactor:this.dissonanceFactor,musicalMode:$,colorTempBias:P}}getDominantHue(){return this.dominantHue}getDissonanceFactor(){return this.dissonanceFactor}getZCoordinate(){return this.zCoordinate}}class Rn{analyser;fftSize=2048;freqData;timeData;prevFreqData;sampleRate;spectrumMapper;harmonicTheory;runningMax=.05;minGainFloor=.015;calibrationStartTime=0;calibrationFloor=1;calibrationCeil=0;isCalibrated=!1;fluxHistory=[];lastBeatTime=0;beatIntervals=[];rawBpm=120;smoothedBpm=120;shortEnergy=0;longEnergy=0;masterIntensity=.5;isEbb=!1;isSurge=!1;surgeTimer=999;ebbDuration=0;lastKickTime=0;kickIntensity=0;hiHatIntensity=0;midRangeSwirl=0;beatIntensity=0;chromaBins=new Float32Array(12);silenceDuration=0;constructor(e,n=44100){this.analyser=e,this.analyser.fftSize=this.fftSize,this.analyser.smoothingTimeConstant=.35,this.sampleRate=n;const t=e.frequencyBinCount;this.freqData=new Float32Array(t),this.timeData=new Float32Array(t),this.prevFreqData=new Float32Array(t),this.spectrumMapper=new Tt,this.harmonicTheory=new _n}update(e,n){this.analyser.getFloatFrequencyData(this.freqData),this.analyser.getFloatTimeDomainData(this.timeData);const t=this.analyser.frequencyBinCount,r=this.sampleRate/2/t,o=1/60;let a=0,c=0;const l=new Float32Array(t);for(let D=0;D<t;D++){const Y=this.freqData[D],te=Math.max(0,Math.min(1,Math.pow(10,(Y+20)/40)));l[D]=te,te>a&&(a=te);const le=this.timeData[D];c+=le*le}const u=Math.sqrt(c/t);this.calibrationStartTime===0&&u>.01&&(this.calibrationStartTime=e),this.calibrationStartTime>0&&e-this.calibrationStartTime<=10&&(this.calibrationFloor=Math.min(this.calibrationFloor,u),this.calibrationCeil=Math.max(this.calibrationCeil,u),this.isCalibrated=e-this.calibrationStartTime>=9.8),a>this.runningMax?this.runningMax=a*.85+this.runningMax*.15:this.runningMax=Math.max(this.minGainFloor,this.runningMax*.998);const h=this.isCalibrated&&this.calibrationCeil>this.calibrationFloor?1/Math.max(.04,this.calibrationCeil)*.85:1/Math.max(.02,this.runningMax),d=Math.min(16,h*n.sensitivity);for(let D=0;D<t;D++)l[D]=Math.min(2.5,l[D]*d);const f=Math.min(1,u*d);let v=0,y=0;for(let D=0;D<t;D++){const Y=l[D];v+=D*r*Y,y+=Y}const P=y>.001?v/y:1200,C=Math.max(0,Math.min(1,Math.log2(Math.max(80,P)/80)/6.5)),M=Math.floor(40/r),g=Math.ceil(75/r);let T=0;for(let D=M;D<=g;D++)T+=l[D];const B=T/Math.max(1,g-M+1);let m=0;for(let D=0;D<t;D++){const Y=l[D]-this.prevFreqData[D];Y>0&&(m+=Y),this.prevFreqData[D]=l[D]}m=Math.min(1,m/(t*.12));const E=B>.38&&m>.16&&e-this.lastKickTime>.22;E?(this.lastKickTime=e,this.kickIntensity=1):this.kickIntensity*=.85,this.fluxHistory.push(m),this.fluxHistory.length>50&&this.fluxHistory.shift();let x=0;for(const D of this.fluxHistory)x+=D;x/=Math.max(1,this.fluxHistory.length);let R=0;for(const D of this.fluxHistory)R+=Math.pow(D-x,2);const L=Math.sqrt(R/Math.max(1,this.fluxHistory.length)),_=Math.max(.1,x+L*1.35),b=e-this.lastBeatTime;let p=!1;if(m>_&&b>.25){if(p=!0,this.lastBeatTime>0&&b<1.4){this.beatIntervals.push(b),this.beatIntervals.length>12&&this.beatIntervals.shift();const D=[...this.beatIntervals].sort((le,Se)=>le-Se);let te=60/D[Math.floor(D.length/2)];for(;te<70;)te*=2;for(;te>180;)te/=2;this.rawBpm=te}this.lastBeatTime=e,this.beatIntensity=1}else this.beatIntensity*=.88,b>1.4&&f<.35&&(this.rawBpm=Math.max(70,this.rawBpm-o*20));const S=1-Math.exp(-o/5.5);this.smoothedBpm+=(this.rawBpm-this.smoothedBpm)*S;const w=Math.round(Math.max(70,Math.min(180,this.smoothedBpm)));this.chromaBins.fill(0);const z=Math.floor(110/r),F=Math.min(t-1,Math.floor(1400/r));for(let D=z;D<=F;D++){const Y=D*r,te=69+12*(Math.log(Y/440)/Math.LN2),Se=(Math.round(te)%12+12)%12;this.chromaBins[Se]+=l[D]*l[D]}const A=this.harmonicTheory.update(l,r,this.chromaBins,f,o,n,E,this.isSurge,B,w,p),I=this.spectrumMapper.processBands(l,r,this.chromaBins,w,o,n.paletteShiftMode??"shifting",n.paletteShiftSpeed??1,this.masterIntensity,m,C,E,B,A),V=1-Math.exp(-o/.2),U=1-Math.exp(-o/5);this.shortEnergy+=(f-this.shortEnergy)*V,this.longEnergy+=(f-this.longEnergy)*U;const G=this.shortEnergy/Math.max(.02,this.longEnergy);this.shortEnergy<this.longEnergy*.45&&this.shortEnergy<.15?(this.ebbDuration+=o,this.ebbDuration>.4&&(this.isEbb=!0)):(this.ebbDuration=Math.max(0,this.ebbDuration-o*2),this.shortEnergy>this.longEnergy*.7&&(this.isEbb=!1));let O=!1;(this.isEbb||this.shortEnergy<.22)&&(m>.24||f>.4)?(O=!0,this.isEbb=!1):m>.36&&G>1.35&&(O=!0),O?(this.isSurge=!0,this.surgeTimer=0,this.masterIntensity=1):(this.surgeTimer+=o,this.surgeTimer>1.5&&(this.isSurge=!1));const j=this.isEbb?.15:Math.max(.1,f);if(j>this.masterIntensity){const D=1-Math.exp(-o/.08);this.masterIntensity+=(j-this.masterIntensity)*D}else{const D=1-Math.exp(-o/1.5);this.masterIntensity+=(j-this.masterIntensity)*D}const K=(I.bands[8].amplitude+I.bands[9].amplitude)*.5,ie=K>.22&&m>.15;ie?this.hiHatIntensity=Math.min(1,K*1.5):this.hiHatIntensity*=.82;const X=(I.bands[4].amplitude+I.bands[5].amplitude)*.5;this.midRangeSwirl=this.midRangeSwirl*.94+X*.06;let $=0,H=0,N=0,q=0;for(const D of I.bands){const Y=At(D.lightness,D.chroma,D.effectiveHue);$+=Y.r*D.amplitude,H+=Y.g*D.amplitude,N+=Y.b*D.amplitude,q+=D.amplitude}if(q>.01)$/=q,H/=q,N/=q;else{const D=At(.25,.12,260);$=D.r,H=D.g,N=D.b}f<.015&&m<.02?this.silenceDuration+=o:this.silenceDuration=Math.max(0,this.silenceDuration-o*2);const pe={masterIntensity:this.masterIntensity,shortEnergy:this.shortEnergy,longEnergy:this.longEnergy,dynamicsRatio:G,isEbb:this.isEbb,isSurge:this.isSurge,surgeTimer:this.surgeTimer,ebbDepth:this.isEbb?Math.min(1,(this.longEnergy-this.shortEnergy)/Math.max(.01,this.longEnergy)):0,calibrationFloor:this.calibrationFloor,calibrationCeil:this.calibrationCeil,calibrationReady:this.isCalibrated};return{bpm:w,rawBpm:Math.round(this.rawBpm),energy:Math.max(.05,Math.min(1,this.masterIntensity)),brightness:Math.max(.08,Math.min(1,.35+this.masterIntensity*.5+I.pitchInfo.biasApplied)),hueSpreadDeg:I.hueSpreadDeg,colorTemperature:I.colorTemperature,spectrumBands:I.bands,pitchInfo:I.pitchInfo,ebbSurge:pe,harmonicLiquid:A,isBeat:p,beatIntensity:this.beatIntensity,isKick:E,kickIntensity:this.kickIntensity,isHiHat:ie,hiHatIntensity:this.hiHatIntensity,midRangeSwirl:Math.min(1,this.midRangeSwirl*2),isSilent:this.silenceDuration>2,activePreset:n.activePreset,dominantColor:{r:$,g:H,b:N,hex:bn($,H,N),lightness:this.masterIntensity}}}}class En{audioContext;currentStream=null;currentSourceNode=null;callbacks;currentMode="mic";selectedDeviceId="default";constructor(e,n){this.audioContext=e,this.callbacks=n,navigator.mediaDevices&&navigator.mediaDevices.addEventListener&&navigator.mediaDevices.addEventListener("devicechange",()=>{this.enumerateDevices()})}async init(e="default"){return this.selectedDeviceId=e,await this.enumerateDevices(),await this.startMic(e)}getMode(){return this.currentMode}getSelectedDeviceId(){return this.selectedDeviceId}async enumerateDevices(){if(!navigator.mediaDevices||!navigator.mediaDevices.enumerateDevices)return[];try{const n=(await navigator.mediaDevices.enumerateDevices()).filter(t=>t.kind==="audioinput").map((t,i)=>({deviceId:t.deviceId,label:t.label||`Audio Input ${i+1}`}));return this.callbacks.onDevicesUpdated(n),n}catch(e){return console.warn("Could not enumerate audio devices:",e),[]}}async startMic(e="default"){if(this.stopCurrentStream(),this.selectedDeviceId=e,this.currentMode="mic",this.audioContext.state==="suspended")try{await this.audioContext.resume()}catch(t){console.warn("AudioContext resume deferred to user gesture:",t)}const n={echoCancellation:!1,noiseSuppression:!1,autoGainControl:!1};e&&e!=="default"&&(n.deviceId={exact:e});try{const t=await navigator.mediaDevices.getUserMedia({audio:n,video:!1});return this.currentStream=t,this.attachStream(t,"mic"),await this.enumerateDevices(),!0}catch(t){const i=t.name==="NotAllowedError"||t.name==="PermissionDeniedError"?"Microphone permission was denied. Please allow microphone access or switch to Tab Audio (T).":`Failed to access microphone: ${t.message||t.name}`;return this.callbacks.onError(i),!1}}async startDisplayMedia(){this.stopCurrentStream(),this.currentMode="tab",this.audioContext.state==="suspended"&&await this.audioContext.resume();try{const e=await navigator.mediaDevices.getDisplayMedia({video:!0,audio:{echoCancellation:!1,noiseSuppression:!1,autoGainControl:!1}});e.getVideoTracks().forEach(i=>i.stop());const t=e.getAudioTracks();return t.length===0?(this.callbacks.onError('No audio track was selected in display media. Please check "Share tab audio" or "Share system audio".'),this.stopCurrentStream(),!1):(t[0].addEventListener("ended",()=>{this.callbacks.onError("Audio capture ended. Returning to microphone..."),this.startMic(this.selectedDeviceId)}),this.currentStream=e,this.attachStream(e,"tab"),!0)}catch(e){return e.name!=="NotAllowedError"&&this.callbacks.onError(`Display audio capture error: ${e.message||e.name}`),!1}}setDemoMode(){this.stopCurrentStream(),this.currentMode="demo",this.callbacks.onStreamReady(null,"demo")}attachStream(e,n){try{this.currentSourceNode=this.audioContext.createMediaStreamSource(e),this.callbacks.onStreamReady(e,n)}catch(t){this.callbacks.onError(`Audio node connection failed: ${t.message||t}`)}}getSourceNode(){return this.currentSourceNode}stopCurrentStream(){if(this.currentSourceNode){try{this.currentSourceNode.disconnect()}catch{}this.currentSourceNode=null}this.currentStream&&(this.currentStream.getTracks().forEach(e=>e.stop()),this.currentStream=null)}}class Mn{ctx;outputGain;isRunning=!1;currentMood="off";timerId=null;step=0;bpm=120;nextNoteTime=0;constructor(e,n){this.ctx=e,this.outputGain=e.createGain(),this.outputGain.gain.value=.85,this.outputGain.connect(n);try{this.outputGain.connect(e.destination)}catch(t){console.warn("Could not connect demo track to speaker output:",t)}}getMood(){return this.currentMood}isPlaying(){return this.isRunning}setMute(e){this.outputGain.gain.setValueAtTime(e?0:.85,this.ctx.currentTime)}start(e="dynamic"){this.stop(),this.currentMood=e,this.isRunning=!0,this.step=0,this.nextNoteTime=this.ctx.currentTime+.05,this.scheduleLoop()}stop(){this.isRunning=!1,this.currentMood="off",this.timerId!==null&&(window.clearTimeout(this.timerId),this.timerId=null)}setMood(e){e==="off"?this.stop():(this.currentMood=e,this.isRunning||this.start(e))}scheduleLoop=()=>{if(!this.isRunning||this.currentMood==="off")return;let e="high";if(this.currentMood==="dynamic"){const t=Math.floor(this.step/16)%36;t<8?e="low":t<24?e="high":(t<28,e="surge")}else this.currentMood==="low"?e="low":this.currentMood==="surge"?e="surge":e="high";this.bpm=e==="low"?68:135;const n=60/(this.bpm*4);for(;this.nextNoteTime<this.ctx.currentTime+.15;)this.triggerStep(this.step,this.nextNoteTime,e),this.nextNoteTime+=n,this.step++;this.timerId=window.setTimeout(this.scheduleLoop,25)};triggerStep(e,n,t){const i=e%16,r=i%4===0;if(t==="low"){if(i===0){const o=[55,55,41.2,55],a=Math.floor(e/16)%o.length,c=o[a];this.playPadSwell(c,n,60/68*3.8),this.playSubPulse(c,n,2)}}else if(t==="surge"){const o=e%32;if(o<16)return;o===16&&this.playMassiveDropHit(n),o>=16&&(r&&this.playKick(n),i%2===0&&this.playHiHat(n,.4))}else{r&&this.playKick(n),(i===4||i===12)&&this.playSnare(n);const o=i%4===2;this.playHiHat(n,o?.38:.15);const c=[130.81,130.81,164.81,130.81,196,164.81,196,261.63][e%8];i%2===0&&this.playBassStab(c,n);const l=[523.25,659.25,783.99,987.77,1046.5,1318.5,1046.5,783.99],u=l[e%l.length];e%2===1&&this.playLeadSynth(u,n)}}playKick(e){const n=this.ctx.createOscillator(),t=this.ctx.createGain();n.type="sine",n.frequency.setValueAtTime(130.8,e),n.frequency.exponentialRampToValueAtTime(32.7,e+.14),t.gain.setValueAtTime(1.1,e),t.gain.exponentialRampToValueAtTime(.001,e+.36),n.connect(t),t.connect(this.outputGain),n.start(e),n.stop(e+.36)}playSnare(e){const n=this.ctx.sampleRate*.2,t=this.ctx.createBuffer(1,n,this.ctx.sampleRate),i=t.getChannelData(0);for(let c=0;c<n;c++)i[c]=(Math.random()*2-1)*.7;const r=this.ctx.createBufferSource();r.buffer=t;const o=this.ctx.createBiquadFilter();o.type="highpass",o.frequency.value=750;const a=this.ctx.createGain();a.gain.setValueAtTime(.8,e),a.gain.exponentialRampToValueAtTime(.01,e+.22),r.connect(o),o.connect(a),a.connect(this.outputGain),r.start(e),r.stop(e+.22)}playHiHat(e,n){const t=this.ctx.sampleRate*.05,i=this.ctx.createBuffer(1,t,this.ctx.sampleRate),r=i.getChannelData(0);for(let l=0;l<t;l++)r[l]=Math.random()*2-1;const o=this.ctx.createBufferSource();o.buffer=i;const a=this.ctx.createBiquadFilter();a.type="highpass",a.frequency.value=7e3;const c=this.ctx.createGain();c.gain.setValueAtTime(n,e),c.gain.exponentialRampToValueAtTime(.001,e+.05),o.connect(a),a.connect(c),c.connect(this.outputGain),o.start(e),o.stop(e+.05)}playBassStab(e,n){const t=this.ctx.createOscillator(),i=this.ctx.createBiquadFilter(),r=this.ctx.createGain();t.type="sawtooth",t.frequency.setValueAtTime(e,n),i.type="lowpass",i.frequency.setValueAtTime(1400,n),i.frequency.exponentialRampToValueAtTime(220,n+.16),r.gain.setValueAtTime(.85,n),r.gain.exponentialRampToValueAtTime(.01,n+.16),t.connect(i),i.connect(r),r.connect(this.outputGain),t.start(n),t.stop(n+.17)}playLeadSynth(e,n){const t=this.ctx.createOscillator(),i=this.ctx.createGain();t.type="triangle",t.frequency.setValueAtTime(e,n),i.gain.setValueAtTime(.5,n),i.gain.exponentialRampToValueAtTime(.001,n+.13),t.connect(i),i.connect(this.outputGain),t.start(n),t.stop(n+.13)}playPadSwell(e,n,t){[{f:e*4,gain:.65},{f:e*4*1.2,gain:.35},{f:e*4*1.5,gain:.35}].forEach(({f:r,gain:o})=>{const a=this.ctx.createOscillator(),c=this.ctx.createBiquadFilter(),l=this.ctx.createGain();a.type="sine",a.frequency.setValueAtTime(r,n),c.type="lowpass",c.frequency.setValueAtTime(350,n),l.gain.setValueAtTime(.001,n),l.gain.linearRampToValueAtTime(o,n+t*.4),l.gain.exponentialRampToValueAtTime(.001,n+t),a.connect(c),c.connect(l),l.connect(this.outputGain),a.start(n),a.stop(n+t)})}playSubPulse(e,n,t){const i=this.ctx.createOscillator(),r=this.ctx.createGain();i.type="sine",i.frequency.setValueAtTime(e,n),r.gain.setValueAtTime(.001,n),r.gain.linearRampToValueAtTime(.22,n+.4),r.gain.exponentialRampToValueAtTime(.001,n+t),i.connect(r),r.connect(this.outputGain),i.start(n),i.stop(n+t)}playMassiveDropHit(e){this.playKick(e);const n=this.ctx.sampleRate*.6,t=this.ctx.createBuffer(1,n,this.ctx.sampleRate),i=t.getChannelData(0);for(let l=0;l<n;l++)i[l]=(Math.random()*2-1)*.9;const r=this.ctx.createBufferSource();r.buffer=t;const o=this.ctx.createBiquadFilter();o.type="bandpass",o.frequency.setValueAtTime(1500,e),o.Q.value=1;const a=this.ctx.createGain();a.gain.setValueAtTime(1,e),a.gain.exponentialRampToValueAtTime(.01,e+.6),r.connect(o),o.connect(a),a.connect(this.outputGain),r.start(e),r.stop(e+.6),[220,277.18,329.63,440,554.37,659.25].forEach(l=>{const u=this.ctx.createOscillator(),h=this.ctx.createGain();u.type="sawtooth",u.frequency.setValueAtTime(l,e),h.gain.setValueAtTime(.25,e),h.gain.exponentialRampToValueAtTime(.001,e+.5),u.connect(h),h.connect(this.outputGain),u.start(e),u.stop(e+.5)})}}class Pn{ctx=null;analyserNode=null;analyzer=null;inputManager=null;demoGenerator=null;callbacks;isInitialized=!1;constructor(e){this.callbacks=e}async initialize(e="default",n){if(this.isInitialized&&this.ctx)return this.ctx.state==="suspended"&&await this.ctx.resume(),n&&n!=="off"&&this.startDemo(n),!0;try{const t=window.AudioContext||window.webkitAudioContext;return this.ctx=new t({latencyHint:"interactive",sampleRate:44100}),this.analyserNode=this.ctx.createAnalyser(),this.analyserNode.fftSize=2048,this.analyzer=new Rn(this.analyserNode,this.ctx.sampleRate),this.demoGenerator=new Mn(this.ctx,this.analyserNode),this.inputManager=new En(this.ctx,{onStreamReady:(r,o)=>{if(o==="demo"){this.callbacks.onModeChanged("demo");return}if(r&&this.analyserNode){const a=this.inputManager?.getSourceNode();if(a)try{a.connect(this.analyserNode)}catch(c){console.error("Failed to connect source node to analyzer:",c)}}this.callbacks.onModeChanged(o)},onError:r=>this.callbacks.onError(r),onDevicesUpdated:r=>this.callbacks.onDevicesUpdated(r)}),this.isInitialized=!0,n&&n!=="off"?(this.startDemo(n),!0):(await this.inputManager.init(e)||(this.callbacks.onError("Microphone unavailable. Starting in ambient demo mode (press M to change)."),this.startDemo("dynamic")),!0)}catch(t){return this.callbacks.onError(`Audio initialization failed: ${t.message||t}`),!1}}async resume(){this.ctx&&this.ctx.state==="suspended"&&await this.ctx.resume()}update(e,n){return this.analyzer?this.analyzer.update(e,n):null}async selectDevice(e){return this.demoGenerator&&this.demoGenerator.stop(),this.inputManager?await this.inputManager.startMic(e):!1}async captureTabAudio(){return this.demoGenerator&&this.demoGenerator.stop(),this.inputManager?await this.inputManager.startDisplayMedia():!1}startDemo(e="dynamic"){this.inputManager&&this.inputManager.setDemoMode(),this.demoGenerator&&this.demoGenerator.start(e),this.callbacks.onModeChanged("demo")}setDemoMood(e){this.demoGenerator&&this.demoGenerator.setMood(e)}stop(){this.demoGenerator&&this.demoGenerator.stop()}getDemoMood(){return this.demoGenerator?this.demoGenerator.getMood():"off"}toggleDemoMute(e){this.demoGenerator&&this.demoGenerator.setMute(e)}getInputMode(){return this.inputManager?this.inputManager.getMode():"mic"}async getDevices(){return this.inputManager?await this.inputManager.enumerateDevices():[]}}const me={ink:{id:"ink",name:"Ink in Water",viscosityBase:.985,damping:.965,diffusion:.045,splatRadius:.16,vorticityScale:2.2,bloomStrength:.35,specularGloss:0,colorSaturation:1.25,hueSpreadScale:1.1},lava:{id:"lava",name:"Lava Lamp",viscosityBase:.994,damping:.982,diffusion:.012,splatRadius:.22,vorticityScale:1.2,bloomStrength:.45,specularGloss:0,colorSaturation:1.35,hueSpreadScale:.8},aurora:{id:"aurora",name:"Aurora Borealis",viscosityBase:.978,damping:.988,diffusion:.025,splatRadius:.14,vorticityScale:3.5,bloomStrength:.65,specularGloss:0,colorSaturation:1.4,hueSpreadScale:1.3},neon:{id:"neon",name:"Neon Club",viscosityBase:.962,damping:.992,diffusion:.018,splatRadius:.12,vorticityScale:4,bloomStrength:.85,specularGloss:0,colorSaturation:1.5,hueSpreadScale:1.6},ocean:{id:"ocean",name:"Deep Ocean",viscosityBase:.988,damping:.975,diffusion:.035,splatRadius:.18,vorticityScale:1.8,bloomStrength:.4,specularGloss:0,colorSaturation:1.3,hueSpreadScale:.9}};function _t(s,e,n){if(s!=="auto")return me[s];if(e<95){const t=Math.max(0,Math.min(1,(e-70)/25));return He(me.ocean,me.ink,t,"Auto (Ocean/Ink)")}else if(e<130){const t=Math.max(0,Math.min(1,(e-95)/35));return He(me.ink,me.aurora,t,"Auto (Aurora)")}else{const t=Math.max(0,Math.min(1,(e-130)/30));return He(me.aurora,me.neon,t,"Auto (Neon Club)")}}function ce(s,e,n){return s+(e-s)*n}function He(s,e,n,t){return{id:"auto",name:t,viscosityBase:ce(s.viscosityBase,e.viscosityBase,n),damping:ce(s.damping,e.damping,n),diffusion:ce(s.diffusion,e.diffusion,n),splatRadius:ce(s.splatRadius,e.splatRadius,n),vorticityScale:ce(s.vorticityScale,e.vorticityScale,n),bloomStrength:ce(s.bloomStrength,e.bloomStrength,n),specularGloss:ce(s.specularGloss,e.specularGloss,n),colorSaturation:ce(s.colorSaturation,e.colorSaturation,n),hueSpreadScale:ce(s.hueSpreadScale,e.hueSpreadScale,n)}}const kn=`#version 300 es
in vec2 aPosition;
out vec2 vUv;

void main() {
  vUv = aPosition * 0.5 + 0.5;
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`,Ln=`#version 300 es
precision highp float;

in vec2 vUv;
out vec4 fragColor;

// Uniforms
uniform vec2 uResolution;
uniform float uZ;                  // z_current = z_prev + FluidVelocity * dt
uniform float uAmplitude;          // A_curr (0..1)
uniform float uSensitivity;
uniform float uBpmFlowScale;       // BPM speed multiplier
uniform float uRandomAngle;        // BPM-driven wandering flow angle

// Palette Uniforms (Section 1)
uniform float uHueDom;             // H_dom (0..360)
uniform float uHueSup1;            // (H_dom + 25) % 360
uniform float uHueSup2;            // (H_dom - 25 + 360) % 360
uniform float uHueAccent;          // (H_dom + 60) % 360
uniform float uHueComp;            // (H_dom + 180) % 360

// Dissonance Factor (Section 4)
uniform float uDissonance;         // D_f (0.0 = Major/Consonance, 0.5 = Minor, 1.0 = Clash)

// Transient Surge (Section 3: Soft internal illumination swell, NO BALLS!)
uniform float uBurstIntensity;     // B (1.0 -> 0.0 decay)
uniform float uBurstRadius;
uniform vec2 uBurstOrigin;

// Visual Styling & HDR
uniform float uSpecularGloss;
uniform float uHdrIntensity;
uniform float uAspectRatio;

// -------------------------------------------------------------
// Pure Saturated Color Wheel (100% Saturation, Zero Pale / Pastel Wash)
// 0° = Red, 30° = Orange, 55° = Golden Amber, 120° = Emerald,
// 180° = Cyan, 215° = Cobalt Blue, 265° = Sapphire, 310° = Magenta
// -------------------------------------------------------------
vec3 hueToVibrantRgb(float hDeg, float brightness) {
  float h = mod(hDeg, 360.0) / 60.0;
  int i = int(floor(h));
  float f = h - float(i);
  float q = 1.0 - f;

  vec3 rgb;
  if (i == 0) rgb = vec3(1.0, f, 0.0);
  else if (i == 1) rgb = vec3(q, 1.0, 0.0);
  else if (i == 2) rgb = vec3(0.0, 1.0, f);
  else if (i == 3) rgb = vec3(0.0, q, 1.0);
  else if (i == 4) rgb = vec3(f, 0.0, 1.0);
  else rgb = vec3(1.0, 0.0, q);

  // Pure saturated color without desaturating into white
  return rgb * brightness;
}

// -------------------------------------------------------------
// Photographic Soft-Light Blending (Wrap-around diffused illumination, ZERO specular gloss)
// -------------------------------------------------------------
vec3 softLightBlend(vec3 base, vec3 blend) {
  vec3 c1 = base - (vec3(1.0) - 2.0 * blend) * base * (vec3(1.0) - base);
  vec3 c2 = base + (2.0 * blend - vec3(1.0)) * (sqrt(max(vec3(0.0), base)) - base);
  return mix(c1, c2, step(vec3(0.5), blend));
}

// -------------------------------------------------------------
// 3D Simplex Noise for Lava Lamp Convective Undulation
// -------------------------------------------------------------
vec4 permute(vec4 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);

  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);

  vec3 x1 = x0 - i1 + 1.0 * C.xxx;
  vec3 x2 = x0 - i2 + 2.0 * C.xxx;
  vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;

  i = mod(i, 289.0);
  vec4 p = permute(permute(permute(
             i.z + vec4(0.0, i1.z, i2.z, 1.0))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0))
           + i.x + vec4(0.0, i1.x, i2.x, 1.0));

  float n_ = 0.142857142857;
  vec3  ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);

  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);

  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);

  vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

  vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}

// -------------------------------------------------------------
// Watery Lava Lamp Fluid Simulation (Undulating Liquid Wax in Water)
// Version 4.0: Dynamic BPM Dance, Swirling Random Eddies, ZERO Ripples
// -------------------------------------------------------------
void calculateLavaFluid(
  vec2 uv,
  float zTime,
  float bpmScale,
  float randomAngle,
  out float lavaCore,
  out float lavaCurrents,
  out float waterBackground
) {
  // Solid aspect-ratio corrected coordinate space (ZERO spatial jitter/ripples)
  vec2 p0 = vec2(uv.x * uAspectRatio, uv.y) * 1.15;

  // Layer 1: Convective buoyancy & rolling currents (Silky, broad swells)
  vec2 warp1 = vec2(
    snoise(vec3(p0 * 0.65, zTime * 0.42)),
    snoise(vec3(p0 * 0.65 + vec2(4.2, 1.8), zTime * 0.42 + 1.3))
  );
  vec2 p1 = p0 + warp1 * 0.65;

  // Layer 2: True Rotational Curl Vortices (Swirling random eddies that dance to the rhythm!)
  float curlAngle1 = snoise(vec3(p1 * 0.95 + vec2(2.1, 7.4), zTime * 0.58 + 2.0)) * 3.14159;
  vec2 warp2 = vec2(cos(curlAngle1), sin(curlAngle1)) * 0.52;
  vec2 p2 = p1 + warp2;

  // Layer 3: Organic meandering eddy currents & fluid ribbons
  float curlAngle2 = snoise(vec3(p2 * 1.35 + vec2(8.5, 1.4), zTime * 0.75)) * 3.14159;
  vec2 warp3 = vec2(cos(curlAngle2), sin(curlAngle2)) * 0.38;
  vec2 p3 = p2 + warp3;

  // Lava density fields (butter-smooth, rounded, organic dancing fluid shapes)
  float s1 = snoise(vec3(p3 * 1.10, zTime * 0.62));
  float s2 = snoise(vec3(p2 * 1.40 + vec2(1.5, 4.3), zTime * 0.50 + 1.6));
  float s3 = snoise(vec3(p1 * 0.80 + vec2(5.2, 2.1), zTime * 0.32));

  lavaCore = clamp(s1 * 0.5 + 0.5, 0.0, 1.0);
  lavaCurrents = clamp(s2 * 0.5 + 0.5, 0.0, 1.0);
  waterBackground = clamp(s3 * 0.5 + 0.5, 0.0, 1.0);
}

void main() {
  vec2 uv = vUv;
  float bpmScale = uBpmFlowScale > 0.1 ? uBpmFlowScale : 1.0;
  float randomAngle = uRandomAngle;

  // 1. Calculate watery lava lamp density fields (ZERO vibration, smooth random flow)
  float lavaCore, lavaCurrents, waterBg;
  calculateLavaFluid(uv, uZ, bpmScale, randomAngle, lavaCore, lavaCurrents, waterBg);

  // -------------------------------------------------------------
  // 2. Pure Vibrant Colors (NO PALE WASH, ZERO SPECULAR GLOSS, ZERO FLICKER)
  // Deep, stable luminous saturation - color theory untouched!
  // -------------------------------------------------------------
  vec3 colWater = hueToVibrantRgb(uHueSup2, 0.46);
  vec3 colLavaBody = hueToVibrantRgb(uHueDom, 0.86);
  vec3 colLavaCurrents = hueToVibrantRgb(uHueSup1, 1.00);

  // Smooth liquid lava blending (like illuminated wax floating in colored water)
  // Soft, velvety sigmoids with ZERO sharp crest highlights or glossy ridges
  float waxMask = smoothstep(0.20, 0.75, lavaCore);
  float currentMask = smoothstep(0.35, 0.80, lavaCurrents) * waxMask;

  vec3 dominantLava = mix(colWater, colLavaBody, waxMask);
  dominantLava = mix(dominantLava, colLavaCurrents, currentMask);

  // -------------------------------------------------------------
  // 3. Tension & Minor Mode (Dual-Color Interacting Lava Lamp)
  // -------------------------------------------------------------
  vec3 finalLava;
  float df = clamp(uDissonance, 0.0, 0.85);

  if (df < 0.04) {
    finalLava = dominantLava;
  } else {
    // Dual-color lava: complementary color forms its own glowing fluid streams
    vec3 colCompWater = hueToVibrantRgb(uHueComp - 15.0, 0.46);
    vec3 colCompLava  = hueToVibrantRgb(uHueComp,        0.86);
    vec3 colCompCurrents = hueToVibrantRgb(uHueComp + 15.0, 1.00);

    float compWaxMask = smoothstep(0.20, 0.75, lavaCurrents);
    vec3 compLava = mix(colCompWater, colCompLava, compWaxMask);
    compLava = mix(compLava, colCompCurrents, smoothstep(0.35, 0.80, lavaCore) * 0.60);

    // Smooth convective fluid mixing: the two colored liquids roll past each other
    float mixBlend = clamp((lavaCore - (1.0 - df * 0.85)) * 1.8 + (waterBg - 0.5) * 0.4, 0.0, 1.0);
    mixBlend = smoothstep(0.0, 1.0, mixBlend);

    finalLava = mix(dominantLava, compLava, mixBlend);
  }

  // -------------------------------------------------------------
  // 4. Soft Light Effect Colors Burst (Tranquil Ambient Infusion, ZERO RIPPLES)
  // -------------------------------------------------------------
  if (uBurstIntensity > 0.001) {
    // Smooth, uniform room-filling soft light wash (ZERO ripples, ZERO waves, ZERO distortion!)
    float softBurstField = uBurstIntensity;

    // Burst colors: rich, vibrant harmonic infusion of complementary & accent hues
    vec3 burstColorComp = hueToVibrantRgb(uHueComp, 1.12);
    vec3 burstColorAccent = hueToVibrantRgb(uHueAccent, 1.08);
    vec3 mixedBurstDye = mix(burstColorComp, burstColorAccent, clamp(waterBg, 0.0, 1.0));

    // True Soft-Light blending: wraps the entire liquid field in luminous ambient color
    vec3 softLayer = softLightBlend(finalLava, mixedBurstDye);
    finalLava = mix(finalLava, softLayer, softBurstField * 0.65);

    // Subtle gentle radiance
    finalLava += mixedBurstDye * (softBurstField * 0.20);
  }

  // -------------------------------------------------------------
  // 5. Filmic Saturation-Preserving Tone Curve (Zero Gloss, Matte Glow)
  // -------------------------------------------------------------
  vec3 outColor = (finalLava * (vec3(1.0) + finalLava * 0.28)) / (vec3(1.0) + finalLava);

  // Peak HDR boost for bass drops
  if (uHdrIntensity > 0.0 && uAmplitude > 0.65) {
    outColor += outColor * (uAmplitude - 0.65) * uHdrIntensity * 0.45;
  }

  fragColor = vec4(outColor, 1.0);
}
`;class Dn{canvas;gl=null;program=null;quadVao=null;uLocs={};frameCount=0;lastFpsTime=performance.now();currentFps=60;currentFrameTime=16.6;activePresetName="Auto";constructor(e){this.canvas=e}async init(){const e=this.canvas.getContext("webgl2",{alpha:!1,depth:!1,stencil:!1,antialias:!1,powerPreference:"high-performance",desynchronized:!0});if(!e)return console.warn("WebGL2 not supported for CinematicFluidRenderer."),!1;this.gl=e;const n=e.createShader(e.VERTEX_SHADER);if(e.shaderSource(n,kn),e.compileShader(n),!e.getShaderParameter(n,e.COMPILE_STATUS))return console.error("CinematicFluid VS compile error:",e.getShaderInfoLog(n)),!1;const t=e.createShader(e.FRAGMENT_SHADER);if(e.shaderSource(t,Ln),e.compileShader(t),!e.getShaderParameter(t,e.COMPILE_STATUS))return console.error("CinematicFluid FS compile error:",e.getShaderInfoLog(t)),!1;if(this.program=e.createProgram(),e.attachShader(this.program,n),e.attachShader(this.program,t),e.linkProgram(this.program),!e.getProgramParameter(this.program,e.LINK_STATUS))return console.error("CinematicFluid link error:",e.getProgramInfoLog(this.program)),!1;const i=["uResolution","uZ","uAmplitude","uSensitivity","uHueDom","uHueSup1","uHueSup2","uHueAccent","uHueComp","uDissonance","uBurstIntensity","uBurstRadius","uBurstOrigin","uBpmFlowScale","uRandomAngle","uSpecularGloss","uHdrIntensity","uAspectRatio"];for(const o of i)this.uLocs[o]=e.getUniformLocation(this.program,o);this.quadVao=e.createVertexArray(),e.bindVertexArray(this.quadVao);const r=e.createBuffer();return e.bindBuffer(e.ARRAY_BUFFER,r),e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),e.STATIC_DRAW),e.enableVertexAttribArray(0),e.vertexAttribPointer(0,2,e.FLOAT,!1,0,0),e.bindVertexArray(null),this.resize(this.canvas.width||window.innerWidth,this.canvas.height||window.innerHeight),console.info("[CinematicFluidRenderer] Initialized successfully."),!0}resize(e,n){if(!this.gl)return;const t=Math.min(window.devicePixelRatio||1,2);this.canvas.width=Math.floor(e*t),this.canvas.height=Math.floor(n*t),this.gl.viewport(0,0,this.canvas.width,this.canvas.height)}render(e,n,t){const i=this.gl;if(!i||!this.program||!this.quadVao)return;const r=performance.now(),o=_t(n.activePreset,e.bpm,e.energy);this.activePresetName=o.name,i.useProgram(this.program),i.bindVertexArray(this.quadVao);const a=this.canvas.width||1920,c=this.canvas.height||1080,l=a/Math.max(1,c);this.uLocs.uResolution&&i.uniform2f(this.uLocs.uResolution,a,c),this.uLocs.uAspectRatio&&i.uniform1f(this.uLocs.uAspectRatio,l);const u=e.harmonicLiquid,h=u?u.zCoordinate:performance.now()*3e-4,d=u?u.amplitude:e.energy,f=u?u.dissonanceFactor:e.pitchInfo?.majorMinorScore<0?.5:0,v=u?u.dominantHue:30,y=u?u.support1Hue:(v+25)%360,P=u?u.support2Hue:(v-25+360)%360,C=u?u.accentHue:(v+60)%360,M=u?u.complementaryHue:(v+180)%360;this.uLocs.uZ&&i.uniform1f(this.uLocs.uZ,h),this.uLocs.uAmplitude&&i.uniform1f(this.uLocs.uAmplitude,d),this.uLocs.uSensitivity&&i.uniform1f(this.uLocs.uSensitivity,n.sensitivity||1),this.uLocs.uHueDom&&i.uniform1f(this.uLocs.uHueDom,v),this.uLocs.uHueSup1&&i.uniform1f(this.uLocs.uHueSup1,y),this.uLocs.uHueSup2&&i.uniform1f(this.uLocs.uHueSup2,P),this.uLocs.uHueAccent&&i.uniform1f(this.uLocs.uHueAccent,C),this.uLocs.uHueComp&&i.uniform1f(this.uLocs.uHueComp,M),this.uLocs.uDissonance&&i.uniform1f(this.uLocs.uDissonance,f);const g=u?u.burstIntensity:e.ebbSurge?.isSurge?1:0,T=u?u.burstRadius:.5,B=u?u.burstOrigin:[.5,.5];this.uLocs.uBurstIntensity&&i.uniform1f(this.uLocs.uBurstIntensity,g),this.uLocs.uBurstRadius&&i.uniform1f(this.uLocs.uBurstRadius,T),this.uLocs.uBurstOrigin&&i.uniform2f(this.uLocs.uBurstOrigin,B[0],B[1]);const m=u?u.bpmFlowScale:e.bpm/120,E=u?u.randomAngle:0;this.uLocs.uBpmFlowScale&&i.uniform1f(this.uLocs.uBpmFlowScale,m),this.uLocs.uRandomAngle&&i.uniform1f(this.uLocs.uRandomAngle,E),this.uLocs.uSpecularGloss&&i.uniform1f(this.uLocs.uSpecularGloss,o.specularGloss||.6),this.uLocs.uHdrIntensity&&i.uniform1f(this.uLocs.uHdrIntensity,n.hdrIntensity||.6),i.drawArrays(i.TRIANGLES,0,3),i.bindVertexArray(null),this.frameCount++;const x=performance.now();this.currentFrameTime=x-r,x-this.lastFpsTime>=1e3&&(this.currentFps=Math.round(this.frameCount*1e3/(x-this.lastFpsTime)),this.frameCount=0,this.lastFpsTime=x)}getStats(){return{fps:this.currentFps,frameTimeMs:parseFloat(this.currentFrameTime.toFixed(1)),resolutionScale:1,rendererType:"WebGL2",canvasFormat:"rgba8unorm",colorSpace:"srgb",hdrActive:!1,activePreset:this.activePresetName,jacobiIterations:0}}dispose(){this.gl&&this.program&&(this.gl.deleteProgram(this.program),this.program=null)}}class xi{agents=[];beatCounter=0;lastBeatState=!1;lastKickState=!1;lastHiHatState=!1;beatPhase=0;barPhase=0;beatDanceMomentum=0;floatFactor=0;currentKickCenter=[.5,.5];targetKickCenter=[.5,.5];vortex1={x:.35,y:.45,strength:0,spinSign:1,radius:.35};vortex2={x:.65,y:.55,strength:0,spinSign:-1,radius:.35};flowCurrent=[0,0];constructor(){this.initAgents()}initAgents(){this.agents=[];const e=1.6180339887;for(let n=0;n<10;n++){const t=.2+n%4*.2+(Math.random()-.5)*.08,i=.25+Math.floor(n/4)*.25+(Math.random()-.5)*.08;this.agents.push({x:Math.max(.1,Math.min(.9,t)),y:Math.max(.1,Math.min(.9,i)),vx:(Math.random()-.5)*.08,vy:(Math.random()-.5)*.08,heading:Math.random()*Math.PI*2,speed:.12,wanderSeedX:n*1.37+.5,wanderSeedY:n*2.19+1.2,freq1:.35+n*.11*e,freq2:.52+(n+3)*.09*e,targetX:.1+Math.random()*.8,targetY:.1+Math.random()*.8,burstTimer:0,retargetCooldown:Math.random()*.8})}}update(e,n,t,i){const r=(e.isKick||e.isBeat)&&!this.lastBeatState,o=e.isKick&&!this.lastKickState,a=e.isHiHat&&!this.lastHiHatState,c=Math.max(50,Math.min(220,e.bpm||115)),u=c/60*t*2*Math.PI;if(this.beatPhase+=u,this.barPhase+=u,r){this.beatCounter++;const b=this.beatPhase%(2*Math.PI);if(b<Math.PI?this.beatPhase-=b*.35:this.beatPhase+=(2*Math.PI-b)*.35,o){const p=this.beatCounter*2.399963,S=.2+this.beatCounter%3*.08,w=.16+(this.beatCounter+1)%3*.07;this.targetKickCenter=[Math.max(.15,Math.min(.85,.5+Math.cos(p)*S)),Math.max(.15,Math.min(.85,.5+Math.sin(p)*w))]}}const h=Math.min(1,t*(4+(1-this.floatFactor)*4));this.currentKickCenter[0]+=(this.targetKickCenter[0]-this.currentKickCenter[0])*h,this.currentKickCenter[1]+=(this.targetKickCenter[1]-this.currentKickCenter[1])*h;const d=e.pitchInfo.circleOfFifthsIndex/12*Math.PI*2,f=Math.cos(d)*.3,v=Math.sin(d)*.3;this.flowCurrent[0]+=(f-this.flowCurrent[0])*Math.min(1,t*2),this.flowCurrent[1]+=(v-this.flowCurrent[1])*Math.min(1,t*2);const y=c/115,P=Math.max(.38,Math.min(3.2,Math.pow(y,1.85)));let C=0;if(c<105||e.energy<.42||e.ebbSurge.isEbb||e.isSilent){const b=Math.max(0,Math.min(1,(108-c)/45)),p=Math.max(0,Math.min(1,(.5-e.energy)/.4));C=Math.max(b*.85,p),e.ebbSurge.isEbb&&(C=Math.max(C,.88)),e.isSilent&&(C=1)}(e.ebbSurge.isSurge||e.energy>.72||c>135)&&(C=0);const M=C>this.floatFactor?2.2:4.8;if(this.floatFactor+=(C-this.floatFactor)*Math.min(1,t*M),r||o||e.ebbSurge.isSurge){const b=(o?1:.65)*(1-this.floatFactor*.75);this.beatDanceMomentum=Math.min(2.4,this.beatDanceMomentum+b)}else{const b=.35/Math.max(.65,y);this.beatDanceMomentum*=Math.exp(-t/b)}const g=1-this.floatFactor*.85,T=(1+this.beatDanceMomentum*.95*Math.min(2,y))*g,B=.3*P*g+.05*this.floatFactor,m=i*B+this.beatPhase*.08*g,E=i*B*1.05+this.beatPhase*.06*g+2.8;this.vortex1.x=.5+Math.sin(m*1.1+.5)*(.33-this.floatFactor*.08)+Math.cos(i*.14)*.06,this.vortex1.y=.5+Math.cos(m*.9+1.2)*(.31-this.floatFactor*.08)+Math.sin(i*.16)*.06,this.vortex1.x=Math.max(.12,Math.min(.88,this.vortex1.x)),this.vortex1.y=Math.max(.12,Math.min(.88,this.vortex1.y)),this.vortex1.strength=(e.midRangeSwirl*.85+e.kickIntensity*.7+e.energy*.35)*P*T,this.floatFactor>.4&&(this.vortex1.strength=Math.max(.12,this.vortex1.strength*.4)),this.vortex1.spinSign=1,this.vortex2.x=.5+Math.cos(E+.3)*(.33-this.floatFactor*.08)+Math.sin(i*.12)*.06,this.vortex2.y=.5+Math.sin(E*1.15)*(.31-this.floatFactor*.08)+Math.cos(i*.18)*.06,this.vortex2.x=Math.max(.12,Math.min(.88,this.vortex2.x)),this.vortex2.y=Math.max(.12,Math.min(.88,this.vortex2.y)),this.vortex2.strength=(e.midRangeSwirl*.9+e.hiHatIntensity*.6+e.energy*.35)*P*T,this.floatFactor>.4&&(this.vortex2.strength=Math.max(.12,this.vortex2.strength*.4)),this.vortex2.spinSign=-1;const x=[],R=e.spectrumBands,L=e.ebbSurge.isEbb,_=e.ebbSurge.isSurge;for(let b=0;b<Math.min(this.agents.length,R.length);b++){const p=this.agents[b],S=R[b];if(S.amplitude<.001&&!_)continue;const w=b<=2,z=b>=3&&b<=6,F=b>=7,A=(i*.4+this.beatPhase*.22*g)*P*(1.1+S.amplitude*1.4),I=Math.sin(A*p.freq1+p.wanderSeedX)*.65+Math.cos(A*p.freq2*.7+p.wanderSeedY)*.45+Math.sin(A*(p.freq1+p.freq2)*.55+p.wanderSeedX*1.7)*.4,V=Math.cos(A*p.freq1*.8+p.wanderSeedY)*.65+Math.sin(A*p.freq2+p.wanderSeedX)*.45+Math.cos(A*(p.freq1+p.freq2)*.65+p.wanderSeedY*1.7)*.4,U=(.12+S.amplitude*.35+e.energy*.16)*P*T,G=.038+S.amplitude*.05+e.energy*.025;let O=U*(1-this.floatFactor)+G*this.floatFactor,j=I*(.45-this.floatFactor*.22),K=V*(.45-this.floatFactor*.22);p.retargetCooldown-=t;const ie=(1-this.floatFactor)*(.45+Math.random()*.55)/Math.max(.6,P)+this.floatFactor*(3.5+Math.random()*2),X=r||F&&a;if((p.retargetCooldown<=0||X&&this.floatFactor<.65)&&(p.targetX=.1+Math.random()*.8,p.targetY=.1+Math.random()*.8,p.retargetCooldown=ie,X&&this.floatFactor<.7)){const ne=this.barPhase*.5+p.wanderSeedX*1.5,re=Math.random()*Math.PI*2,se=ne*.35+re*.65,_e=(.24+Math.random()*.38)*P*T*(1-this.floatFactor*.8);p.vx+=Math.cos(se)*_e,p.vy+=Math.sin(se)*_e}const $=p.targetX-p.x,H=p.targetY-p.y,N=Math.hypot($,H);if(N>.03){const ne=(.52+S.amplitude*.88)*P*(1-this.floatFactor*.65)+.14*this.floatFactor;j+=$/N*ne,K+=H/N*ne}if(w&&(O*=1+S.amplitude*.5,e.isKick||e.kickIntensity>.2)){const ne=p.x-this.currentKickCenter[0],re=p.y-this.currentKickCenter[1],se=Math.max(.08,Math.hypot(ne,re)),_e=e.kickIntensity*1.1/se*T*(1-this.floatFactor*.75);j+=ne/se*_e,K+=re/se*_e}if(z){O*=1+S.amplitude*.7,j+=this.flowCurrent[0]*.7,K+=this.flowCurrent[1]*.7;const ne=p.x-this.vortex1.x,re=p.y-this.vortex1.y,se=Math.hypot(ne,re);se<this.vortex1.radius&&se>.02&&(j+=-re/se*this.vortex1.strength*this.vortex1.spinSign*.55,K+=ne/se*this.vortex1.strength*this.vortex1.spinSign*.55)}F&&(O*=1.2+S.amplitude*1.1,p.burstTimer-=t,a&&this.floatFactor<.6&&p.burstTimer<=0&&(p.burstTimer=.2+Math.random()*.25,p.targetX=.1+Math.random()*.8,p.targetY=.1+Math.random()*.8),p.burstTimer>0&&(O*=1.6+.4*g));const q=.08;p.x<q?j+=(q-p.x)*4.5:p.x>1-q&&(j-=(p.x-(1-q))*4.5),p.y<q?K+=(q-p.y)*4.5:p.y>1-q&&(K-=(p.y-(1-q))*4.5);const Oe=Math.min(1,t*(6.5-this.floatFactor*3.5));p.vx+=(j-p.vx)*Oe,p.vy+=(K-p.vy)*Oe;const pe=Math.hypot(p.vx,p.vy);if(pe>.001){const ne=Math.min(1,t*(4.5-this.floatFactor*2.5)),re=pe+(O-pe)*ne;p.vx=p.vx/pe*re,p.vy=p.vy/pe*re}p.x+=p.vx*t,p.y+=p.vy*t,p.x=Math.max(.04,Math.min(.96,p.x)),p.y=Math.max(.04,Math.min(.96,p.y));const D=1+this.floatFactor*.35,Y=n.splatRadius*(1.6+(10-b)*.08)*(1+S.amplitude*.35)*D,te=S.amplitude*(L?.3:1)*n.colorSaturation*(1+S.amplitude*.4),le=Math.atan2(p.vy,p.vx)+Math.PI*.5*(b%2===0?1:-1),Se=Math.sin(this.beatPhase+p.wanderSeedX)*.35*(.5+e.energy*.5)*g,Bt=(F?1.5:w?1.1:1.3)*T;if(x.push({posX:p.x,posY:p.y,velX:(p.vx+Math.cos(le)*Se)*Bt,velY:(p.vy+Math.sin(le)*Se)*Bt,oklab:S.oklab,amplitude:S.amplitude,radius:Y,intensity:te}),x.length>=24)break}if(e.harmonicLiquid&&(e.harmonicLiquid.isBurst||e.harmonicLiquid.burstIntensity>.05)){const b=e.harmonicLiquid.burstIntensity,p=e.harmonicLiquid.complementaryHue,S=ae(.55+b*.12,.36,p),w=e.harmonicLiquid.burstOrigin||this.currentKickCenter,z=6;for(let F=0;F<z;F++){const A=F/z*Math.PI*2+i*2.2,I=e.harmonicLiquid.burstRadius*.4%.85;x.push({posX:Math.max(.08,Math.min(.92,w[0]+Math.cos(A)*I)),posY:Math.max(.08,Math.min(.92,w[1]+Math.sin(A)*I)),velX:Math.cos(A)*(1.8+b*2.5)*P*T,velY:Math.sin(A)*(1.8+b*2.5)*P*T,oklab:[S.L,S.a,S.b],amplitude:b,radius:n.splatRadius*(1.8+b*.8),intensity:b*1.25})}}if(e.harmonicLiquid&&e.harmonicLiquid.dissonanceFactor>.2){const b=e.harmonicLiquid.dissonanceFactor,p=e.harmonicLiquid.complementaryHue,S=ae(.5+b*.1,.35,p),w=i*1.8*P+this.beatPhase*.15;x.push({posX:Math.max(.08,Math.min(.92,this.vortex2.x+Math.cos(w)*.14)),posY:Math.max(.08,Math.min(.92,this.vortex2.y+Math.sin(w)*.14)),velX:-Math.sin(w)*1.5*P*T,velY:Math.cos(w)*1.5*P*T,oklab:[S.L,S.a,S.b],amplitude:b*.85,radius:n.splatRadius*1.6,intensity:b*.95})}if(_)for(let b=0;b<8;b++){let p,S,w,z;if(b<4){const A=b/4*Math.PI*2+i*1.5,I=.14+b%2*.08;p=Math.max(.08,Math.min(.92,this.currentKickCenter[0]+Math.cos(A)*I)),S=Math.max(.08,Math.min(.92,this.currentKickCenter[1]+Math.sin(A)*I)),w=Math.cos(A)*2.4*P,z=Math.sin(A)*2.4*P}else{const I=(b-4)/4*Math.PI*2+.785;p=Math.max(.08,Math.min(.92,.5+Math.cos(I)*.38)),S=Math.max(.08,Math.min(.92,.5+Math.sin(I)*.32)),w=-Math.cos(I)*2*P,z=-Math.sin(I)*2*P}const F=R[b*2%10]||R[0];if(x.push({posX:p,posY:S,velX:w,velY:z,oklab:[Math.min(1.2,F.oklab[0]*1.35),F.oklab[1]*1.45,F.oklab[2]*1.45],amplitude:1,radius:n.splatRadius*2.2,intensity:1}),x.length>=36)break}return this.lastBeatState=e.isKick||e.isBeat,this.lastKickState=e.isKick,this.lastHiHatState=e.isHiHat,{splats:x,vortices:[this.vortex1,this.vortex2],kickCenter:this.currentKickCenter,globalFlow:this.flowCurrent}}}const Si=`
struct SolverUniforms {
  gridSize: vec2<f32>,
  texelSize: vec2<f32>,
  dt: f32,
  time: f32,
  damping: f32,
  vorticityScale: f32,
  diffusion: f32,
  dissipation: f32,
};

struct SplatUniforms {
  position: vec2<f32>,
  velocity: vec2<f32>,
  oklab: vec4<f32>, // (L, a, b, intensity)
  radius: f32,
  falloff: f32,
  aspectRatio: f32,
  padding: f32,
};

struct CompositeUniforms {
  screenSize: vec2<f32>,
  texelSize: vec2<f32>,
  hdrIntensity: f32,
  isHdr: f32,
  specularGloss: f32,
  edgeGlowStrength: f32,
  bloomStrength: f32,
  time: f32,
  padding: vec2<f32>,
  ambientLab: vec4<f32>, // (L, a, b, floorWeight)
};
`,Bn=`
${Si}

@group(0) @binding(0) var<uniform> solver: SolverUniforms;
@group(0) @binding(1) var sampLinear: sampler;

// Textures bound per pass
@group(0) @binding(2) var sourceTex: texture_2d<f32>;
@group(0) @binding(3) var extraTex: texture_2d<f32>; // e.g. velocity for dye advection, or divergence for jacobi

struct VertexOutput {
  @builtin(position) position: vec4<f32>,
  @location(0) uv: vec2<f32>,
};

@vertex
fn vs_quad(@builtin(vertex_index) vertexIndex: u32) -> VertexOutput {
  var pos = array<vec2<f32>, 3>(
    vec2<f32>(-1.0, -1.0),
    vec2<f32>( 3.0, -1.0),
    vec2<f32>(-1.0,  3.0)
  );
  var out: VertexOutput;
  out.position = vec4<f32>(pos[vertexIndex], 0.0, 1.0);
  out.uv = pos[vertexIndex] * 0.5 + 0.5;
  out.uv.y = 1.0 - out.uv.y;
  return out;
}

// 1. BFECC (Back and Forth Error Compensation and Correction) Advection
// Eliminates numerical diffusion and staircasing
@fragment
fn fs_advect_bfecc(in: VertexOutput) -> @location(0) vec4<f32> {
  let uv = in.uv;
  let texel = solver.texelSize;

  // Velocity sampled at uv
  let u = textureSample(extraTex, sampLinear, uv).xy;

  // Step 1: Forward advection: x* = x - u * dt
  let forwardCoord = uv - u * solver.dt * solver.texelSize * 60.0;
  let q_forward = textureSample(sourceTex, sampLinear, forwardCoord);

  // Step 2: Backward advection from forwardCoord: x** = x* + u* * dt
  let u_forward = textureSample(extraTex, sampLinear, forwardCoord).xy;
  let backwardCoord = forwardCoord + u_forward * solver.dt * solver.texelSize * 60.0;
  let q_backward = textureSample(sourceTex, sampLinear, backwardCoord);

  // Step 3: Error estimation and correction: q_corrected = q + 0.5 * (q - q_backward)
  let q_corrected = q_forward + 0.5 * (textureSample(sourceTex, sampLinear, uv) - q_backward);

  // Step 4: Bounded limiter using neighborhood min/max to avoid overshoot
  let q0 = textureSample(sourceTex, sampLinear, uv + vec2<f32>(texel.x, 0.0));
  let q1 = textureSample(sourceTex, sampLinear, uv - vec2<f32>(texel.x, 0.0));
  let q2 = textureSample(sourceTex, sampLinear, uv + vec2<f32>(0.0, texel.y));
  let q3 = textureSample(sourceTex, sampLinear, uv - vec2<f32>(0.0, texel.y));

  let minQ = min(min(q0, q1), min(q2, q3));
  let maxQ = max(max(q0, q1), max(q2, q3));
  let clampedResult = clamp(q_corrected, minQ, maxQ);

  return clampedResult * solver.damping;
}

// 2. Vorticity Confinement
// Keeps fluid swirling with lively vortices and curls
@fragment
fn fs_vorticity(in: VertexOutput) -> @location(0) vec4<f32> {
  let uv = in.uv;
  let texel = solver.texelSize;

  let vL = textureSample(sourceTex, sampLinear, uv - vec2<f32>(texel.x, 0.0)).xy;
  let vR = textureSample(sourceTex, sampLinear, uv + vec2<f32>(texel.x, 0.0)).xy;
  let vB = textureSample(sourceTex, sampLinear, uv - vec2<f32>(0.0, texel.y)).xy;
  let vT = textureSample(sourceTex, sampLinear, uv + vec2<f32>(0.0, texel.y)).xy;

  // Curl = (vT.x - vB.x) - (vR.y - vL.y)
  let curl = 0.5 * ((vT.x - vB.x) - (vR.y - vL.y));

  // Compute gradient of curl magnitude
  let cL = abs(textureSample(extraTex, sampLinear, uv - vec2<f32>(texel.x, 0.0)).x);
  let cR = abs(textureSample(extraTex, sampLinear, uv + vec2<f32>(texel.x, 0.0)).x);
  let cB = abs(textureSample(extraTex, sampLinear, uv - vec2<f32>(0.0, texel.y)).x);
  let cT = abs(textureSample(extraTex, sampLinear, uv + vec2<f32>(0.0, texel.y)).x);

  var eta = vec2<f32>(0.5 * (cR - cL), 0.5 * (cT - cB));
  let lenEta = length(eta);
  if (lenEta > 0.0001) {
    eta = eta / lenEta;
  } else {
    eta = vec2<f32>(0.0);
  }

  // Force perpendicular to gradient
  let force = vec2<f32>(eta.y, -eta.x) * curl * solver.vorticityScale * solver.dt;
  let baseVel = textureSample(sourceTex, sampLinear, uv).xy;

  return vec4<f32>(baseVel + force, curl, 1.0);
}

// 3. Divergence of Velocity Field
@fragment
fn fs_divergence(in: VertexOutput) -> @location(0) vec4<f32> {
  let uv = in.uv;
  let texel = solver.texelSize;

  let vL = textureSample(sourceTex, sampLinear, uv - vec2<f32>(texel.x, 0.0)).x;
  let vR = textureSample(sourceTex, sampLinear, uv + vec2<f32>(texel.x, 0.0)).x;
  let vB = textureSample(sourceTex, sampLinear, uv - vec2<f32>(0.0, texel.y)).y;
  let vT = textureSample(sourceTex, sampLinear, uv + vec2<f32>(0.0, texel.y)).y;

  let div = 0.5 * ((vR - vL) + (vT - vB));
  return vec4<f32>(div, 0.0, 0.0, 1.0);
}

// 4. Pressure Poisson Solver (Jacobi iteration)
@fragment
fn fs_jacobi(in: VertexOutput) -> @location(0) vec4<f32> {
  let uv = in.uv;
  let texel = solver.texelSize;

  let pL = textureSample(sourceTex, sampLinear, uv - vec2<f32>(texel.x, 0.0)).x;
  let pR = textureSample(sourceTex, sampLinear, uv + vec2<f32>(texel.x, 0.0)).x;
  let pB = textureSample(sourceTex, sampLinear, uv - vec2<f32>(0.0, texel.y)).x;
  let pT = textureSample(sourceTex, sampLinear, uv + vec2<f32>(0.0, texel.y)).x;

  let div = textureSample(extraTex, sampLinear, uv).x;

  let p = (pL + pR + pB + pT - div) * 0.25;
  return vec4<f32>(p, 0.0, 0.0, 1.0);
}

// 5. Subtract Pressure Gradient (enforces incompressibility)
@fragment
fn fs_subtract_gradient(in: VertexOutput) -> @location(0) vec4<f32> {
  let uv = in.uv;
  let texel = solver.texelSize;

  let pL = textureSample(extraTex, sampLinear, uv - vec2<f32>(texel.x, 0.0)).x;
  let pR = textureSample(extraTex, sampLinear, uv + vec2<f32>(texel.x, 0.0)).x;
  let pB = textureSample(extraTex, sampLinear, uv - vec2<f32>(0.0, texel.y)).x;
  let pT = textureSample(extraTex, sampLinear, uv + vec2<f32>(0.0, texel.y)).x;

  let vel = textureSample(sourceTex, sampLinear, uv).xy;
  let grad = 0.5 * vec2<f32>(pR - pL, pT - pB);

  return vec4<f32>(vel - grad, 0.0, 1.0);
}

// 6. Dye Diffusion & Dissipation
// Slightly diffuses dye every frame so edges soften and colors bleed like liquid paint
@fragment
fn fs_dye_diffuse(in: VertexOutput) -> @location(0) vec4<f32> {
  let uv = in.uv;
  let texel = solver.texelSize;

  let center = textureSample(sourceTex, sampLinear, uv);
  let dL = textureSample(sourceTex, sampLinear, uv - vec2<f32>(texel.x, 0.0));
  let dR = textureSample(sourceTex, sampLinear, uv + vec2<f32>(texel.x, 0.0));
  let dB = textureSample(sourceTex, sampLinear, uv - vec2<f32>(0.0, texel.y));
  let dT = textureSample(sourceTex, sampLinear, uv + vec2<f32>(0.0, texel.y));

  let neighbors = (dL + dR + dB + dT) * 0.25;
  let diffused = mix(center, neighbors, solver.diffusion);

  return diffused * solver.dissipation;
}
`,An=`
struct SplatPoint {
  position: vec2<f32>,
  velocity: vec2<f32>,
  oklab: vec4<f32>,     // (L, a, b, amplitude)
  radius: f32,
  intensity: f32,
  padding: vec2<f32>,
};

struct ForceUniforms {
  aspectRatio: f32,        // 0
  time: f32,               // 1
  dt: f32,                 // 2
  curlScale: f32,          // 3
  kickIntensity: f32,      // 4
  midRangeSwirl: f32,      // 5
  trebleSparkle: f32,      // 6
  isSurge: f32,            // 7
  splatCount: u32,         // 8
  ambientBlendRate: f32,   // 9
  kickCenter: vec2<f32>,   // 10, 11 (dynamic beat epicenter)
  ambientLab: vec4<f32>,   // 12, 13, 14, 15
  vortex1: vec4<f32>,      // 16..19 (posX, posY, strength, spinSign)
  vortex2: vec4<f32>,      // 20..23 (posX, posY, strength, spinSign)
  globalFlow: vec4<f32>,   // 24..27 (flowX, flowY, 0, 0)
};

@group(0) @binding(0) var<uniform> forces: ForceUniforms;
@group(0) @binding(1) var<storage, read> splats: array<SplatPoint>;
@group(0) @binding(2) var sampLinear: sampler;
@group(0) @binding(3) var currentTex: texture_2d<f32>;

struct VertexOutput {
  @builtin(position) position: vec4<f32>,
  @location(0) uv: vec2<f32>,
};

@vertex
fn vs_quad(@builtin(vertex_index) vertexIndex: u32) -> VertexOutput {
  var pos = array<vec2<f32>, 3>(
    vec2<f32>(-1.0, -1.0),
    vec2<f32>( 3.0, -1.0),
    vec2<f32>(-1.0,  3.0)
  );
  var out: VertexOutput;
  out.position = vec4<f32>(pos[vertexIndex], 0.0, 1.0);
  out.uv = pos[vertexIndex] * 0.5 + 0.5;
  out.uv.y = 1.0 - out.uv.y;
  return out;
}

// 2D Simplex & Multi-Scale Curl Noise
fn hash22(p: vec2<f32>) -> vec2<f32> {
  var p3 = fract(vec3<f32>(p.xyx) * vec3<f32>(0.1031, 0.1030, 0.0973));
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.xx + p3.yz) * p3.zy) * 2.0 - 1.0;
}

fn snoise(p: vec2<f32>) -> f32 {
  let K1 = 0.366025404;
  let K2 = 0.211324865;
  let i = floor(p + (p.x + p.y) * K1);
  let a = p - i + (i.x + i.y) * K2;
  let o = step(a.yx, a.xy);
  let b = a - o + K2;
  let c = a - 1.0 + 2.0 * K2;
  let h = max(0.5 - vec3<f32>(dot(a, a), dot(b, b), dot(c, c)), vec3<f32>(0.0));
  let n = h * h * h * h * vec3<f32>(dot(a, hash22(i)), dot(b, hash22(i + o)), dot(c, hash22(i + 1.0)));
  return dot(n, vec3<f32>(70.0));
}

fn curlNoise(p: vec2<f32>) -> vec2<f32> {
  let eps = 0.005;
  let n1 = snoise(p + vec2<f32>(0.0, eps));
  let n2 = snoise(p - vec2<f32>(0.0, eps));
  let n3 = snoise(p + vec2<f32>(eps, 0.0));
  let n4 = snoise(p - vec2<f32>(eps, 0.0));
  return vec2<f32>((n1 - n2) / (2.0 * eps), -(n3 - n4) / (2.0 * eps));
}

// Injects organic, non-circular velocity forces (chaotic curl, harmonic flow, dynamic gyres, hopping kick shockwave)
@fragment
fn fs_inject_velocity(in: VertexOutput) -> @location(0) vec4<f32> {
  let uv = in.uv;
  var vel = textureSample(currentTex, sampLinear, uv).xy;

  // 1. Organic multi-scale curl noise with music-driven temporal drift
  let curl1 = curlNoise(uv * 2.2 + vec2<f32>(forces.time * 0.09, forces.time * 0.06));
  let curl2 = curlNoise(uv * 4.5 - vec2<f32>(forces.time * 0.12, forces.time * 0.08));
  vel += (curl1 * 0.75 + curl2 * 0.25) * forces.curlScale * forces.dt * 18.0;

  // 2. Global Harmonic Meandering Current (drifts with circle-of-fifths melodic progression)
  vel += forces.globalFlow.xy * forces.dt * 7.0;

  // 3. Decentralized Multi-Vortices (Two independent drifting gyres spinning oppositely)
  // Vortex 1: Bass / Rhythm gyre
  let dV1 = (uv - forces.vortex1.xy) * vec2<f32>(forces.aspectRatio, 1.0);
  let rV1 = length(dV1);
  if (forces.vortex1.z > 0.01 && rV1 > 0.01) {
    let tan1 = vec2<f32>(-dV1.y, dV1.x) / rV1;
    let w1 = exp(-rV1 * 3.2) * forces.vortex1.z * forces.vortex1.w;
    vel += tan1 * w1 * forces.dt * 26.0;
  }

  // Vortex 2: Melodic / Vocal gyre
  let dV2 = (uv - forces.vortex2.xy) * vec2<f32>(forces.aspectRatio, 1.0);
  let rV2 = length(dV2);
  if (forces.vortex2.z > 0.01 && rV2 > 0.01) {
    let tan2 = vec2<f32>(-dV2.y, dV2.x) / rV2;
    let w2 = exp(-rV2 * 3.2) * forces.vortex2.z * forces.vortex2.w;
    vel += tan2 * w2 * forces.dt * 26.0;
  }

  // 4. Smooth Beat / Kick Momentum (ZERO water ripples)
  if (forces.kickIntensity > 0.01) {
    let toKick = (uv - forces.kickCenter) * vec2<f32>(forces.aspectRatio, 1.0);
    let rKick = length(toKick);
    let kickPush = exp(-rKick * 3.5);
    let radialDir = toKick / max(0.001, rKick);
    vel += radialDir * kickPush * forces.kickIntensity * 0.12;
  }

  // 5. Treble Sparkle (High transient micro-perturbations across screen)
  if (forces.trebleSparkle > 0.01) {
    let fineNoise = snoise(uv * 36.0 + vec2<f32>(forces.time * 3.5, forces.time * 2.2));
    vel += vec2<f32>(fineNoise, -fineNoise) * forces.trebleSparkle * 0.28;
  }

  // 6. Splats carrying actual momentum of autonomous wandering band agents
  let count = forces.splatCount;
  for (var i = 0u; i < count; i = i + 1u) {
    let splat = splats[i];
    let delta = (uv - splat.position) * vec2<f32>(forces.aspectRatio, 1.0);
    let d = length(delta);
    let radius = splat.radius;

    if (d < radius * 2.5) {
      let rNorm = d / radius;
      // Soft Gaussian falloff with smoothstep profile
      let falloff = exp(-rNorm * rNorm * 2.2) * smoothstep(2.5, 0.0, rNorm);
      vel += splat.velocity * falloff * splat.intensity * 0.7;
    }
  }

  return vec4<f32>(vel, 0.0, 1.0);
}

// Injects multi-band OKLab dye splats (soft Gaussian + smoothstep, edge-to-edge room lighting)
@fragment
fn fs_inject_dye(in: VertexOutput) -> @location(0) vec4<f32> {
  let uv = in.uv;
  var currentDye = textureSample(currentTex, sampLinear, uv); // (L, a, b, alpha)

  // Edge-to-edge room lighting: gently bleed ambient mood color across full screen
  if (forces.ambientBlendRate > 0.0) {
    currentDye = vec4<f32>(
      mix(currentDye.x, forces.ambientLab.x, forces.ambientBlendRate),
      mix(currentDye.y, forces.ambientLab.y, forces.ambientBlendRate),
      mix(currentDye.z, forces.ambientLab.z, forces.ambientBlendRate),
      1.0
    );
  }

  let count = forces.splatCount;
  for (var i = 0u; i < count; i = i + 1u) {
    let splat = splats[i];
    let delta = (uv - splat.position) * vec2<f32>(forces.aspectRatio, 1.0);
    let d = length(delta);
    let radius = splat.radius;

    if (d < radius * 3.0) {
      let rNorm = d / radius;
      // Soft Gaussian + smoothstep profile (never hard-edged discs!)
      let falloff = exp(-rNorm * rNorm * 1.5) * smoothstep(3.0, 0.0, rNorm);
      let weight = falloff * splat.intensity * 0.45;

      let splatL = splat.oklab.x;
      let splatA = splat.oklab.y;
      let splatB = splat.oklab.z;

      // Perceptual OKLab dye blending: higher amplitude preserves pure chroma without muddying
      currentDye.x = mix(currentDye.x, max(currentDye.x, splatL), min(0.85, weight * 0.9));
      currentDye.y = mix(currentDye.y, splatA, min(0.90, weight * 1.1));
      currentDye.z = mix(currentDye.z, splatB, min(0.90, weight * 1.1));
    }
  }

  return currentDye;
}
`,wn=`
${Si}
${yn}

@group(0) @binding(0) var<uniform> comp: CompositeUniforms;
@group(0) @binding(1) var sampLinear: sampler;
@group(0) @binding(2) var dyeTex: texture_2d<f32>;   // OKLab (L, a, b, alpha)
@group(0) @binding(3) var bloomTex: texture_2d<f32>; // Bloom blur texture

struct VertexOutput {
  @builtin(position) position: vec4<f32>,
  @location(0) uv: vec2<f32>,
};

@vertex
fn vs_quad(@builtin(vertex_index) vertexIndex: u32) -> VertexOutput {
  var pos = array<vec2<f32>, 3>(
    vec2<f32>(-1.0, -1.0),
    vec2<f32>( 3.0, -1.0),
    vec2<f32>(-1.0,  3.0)
  );
  var out: VertexOutput;
  out.position = vec4<f32>(pos[vertexIndex], 0.0, 1.0);
  out.uv = pos[vertexIndex] * 0.5 + 0.5;
  out.uv.y = 1.0 - out.uv.y;
  return out;
}

// Dithering noise to prevent banding
fn dither(uv: vec2<f32>, t: f32) -> f32 {
  return (fract(sin(dot(uv + vec2<f32>(t * 0.01), vec2<f32>(12.9898, 78.233))) * 43758.5453) - 0.5) * (1.0 / 255.0);
}

fn linear_to_srgb(c: vec3<f32>) -> vec3<f32> {
  let a = 12.92 * c;
  let b = 1.055 * pow(max(c, vec3<f32>(0.0)), vec3<f32>(1.0 / 2.4)) - 0.055;
  return select(b, a, c <= vec3<f32>(0.0031308));
}

@fragment
fn fs_composite(in: VertexOutput) -> @location(0) vec4<f32> {
  let uv = in.uv;
  let texel = comp.texelSize;

  // 1. Bilinear sample OKLab dye
  let lab = textureSample(dyeTex, sampLinear, uv);
  var L = lab.x;
  var a = lab.y;
  var b = lab.z;

  // 2. Room lighting ambient floor: guarantee rich edge-to-edge color (never whitish, never black!)
  let ambL = comp.ambientLab.x;
  let ambA = comp.ambientLab.y;
  let ambB = comp.ambientLab.z;

  // When dye is absent, smoothly blend into rich soulful ambient sea
  let dyeWeight = clamp(L / max(0.01, ambL * 1.15), 0.0, 1.0);
  L = max(L, ambL);
  a = mix(ambA, a, dyeWeight);
  b = mix(ambB, b, dyeWeight);

  // 3. Keep L in saturated, soulful sweet spot (never bleached with white!)
  L = clamp(L, 0.40, 0.75);

  // 4. Convert OKLab to Linear RGB (ZERO SPECULAR GLOSS: purely soft matte diffused light)
  var color = oklab_to_linear_rgb(L, a, b);

  // 5. Add Gentle Chromatic Bloom
  let bloom = textureSample(bloomTex, sampLinear, uv).rgb;
  color += bloom * color * (comp.bloomStrength * 0.35);

  // Add subtle dither
  color += vec3<f32>(dither(uv, comp.time));

  // 6. HDR vs SDR Tone Mapping
  if (comp.isHdr > 0.5) {
    // True HDR: peak headroom allows values > 1.0
    let peakHeadroom = 1.0 + comp.hdrIntensity * 1.8;
    color = min(color, vec3<f32>(peakHeadroom));
  } else {
    // Saturation-preserving vibrancy mapping:
    // Retains 100% chromatic saturation and bright soulful color-wheel hues
    let maxC = max(color.r, max(color.g, color.b));
    if (maxC > 1.0) {
      color = color / maxC;
    }
    // Radiant vibrancy curve (never dark, never whitish)
    color = pow(max(vec3<f32>(0.0), color), vec3<f32>(1.0 / 1.6));
  }

  return vec4<f32>(max(vec3<f32>(0.0), color), 1.0);
}
`,In=`
struct BloomUniforms {
  texelSize: vec2<f32>,
  direction: vec2<f32>, // (1, 0) for horizontal, (0, 1) for vertical
  threshold: f32,
  intensity: f32,
};

@group(0) @binding(0) var<uniform> bloom: BloomUniforms;
@group(0) @binding(1) var sampLinear: sampler;
@group(0) @binding(2) var inputTex: texture_2d<f32>;

struct VertexOutput {
  @builtin(position) position: vec4<f32>,
  @location(0) uv: vec2<f32>,
};

@vertex
fn vs_quad(@builtin(vertex_index) vertexIndex: u32) -> VertexOutput {
  var pos = array<vec2<f32>, 3>(
    vec2<f32>(-1.0, -1.0),
    vec2<f32>( 3.0, -1.0),
    vec2<f32>(-1.0,  3.0)
  );
  var out: VertexOutput;
  out.position = vec4<f32>(pos[vertexIndex], 0.0, 1.0);
  out.uv = pos[vertexIndex] * 0.5 + 0.5;
  out.uv.y = 1.0 - out.uv.y;
  return out;
}

// 9-tap separable Gaussian blur
const weights = array<f32, 5>(0.227027, 0.1945946, 0.1216216, 0.054054, 0.016216);

@fragment
fn fs_threshold(in: VertexOutput) -> @location(0) vec4<f32> {
  let color = textureSample(inputTex, sampLinear, in.uv).rgb;
  let luminance = dot(color, vec3<f32>(0.2126, 0.7152, 0.0722));
  
  // Extract pixels above threshold
  let excess = max(0.0, luminance - bloom.threshold);
  let factor = excess / max(0.001, luminance);
  return vec4<f32>(color * factor * bloom.intensity, 1.0);
}

@fragment
fn fs_blur(in: VertexOutput) -> @location(0) vec4<f32> {
  let uv = in.uv;
  let step = bloom.direction * bloom.texelSize * 1.5;

  var result = textureSample(inputTex, sampLinear, uv).rgb * weights[0];
  for (var i = 1; i < 5; i++) {
    let offset = step * f32(i);
    let sample1 = textureSample(inputTex, sampLinear, uv + offset).rgb;
    let sample2 = textureSample(inputTex, sampLinear, uv - offset).rgb;
    result += (sample1 + sample2) * weights[i];
  }

  return vec4<f32>(result, 1.0);
}
`;class Fn{canvas;ctx=null;device=null;motionEngine=new xi;presentationFormat="bgra8unorm";colorSpace="srgb";isHdr=!1;velWidth=384;velHeight=384;dyeWidth=1024;dyeHeight=1024;pipeAdvect;pipeVorticity;pipeDivergence;pipeJacobi;pipeSubtractGrad;pipeDyeDiffuse;pipeInjectVelocity;pipeInjectDye;pipeBloomThreshold;pipeBloomBlur;pipeComposite;sampler;texVelA;texVelB;texDyeA;texDyeB;texDivergence;texPressureA;texPressureB;texBloomThreshold;texBloomBlurA;texBloomBlurB;bufSolver;bufForces;bufSplats;bufComposite;bufBloomH;bufBloomV;frameCount=0;lastFpsTime=performance.now();currentFps=60;currentFrameTime=16.6;resolutionScale=1;activePresetName="Auto";constructor(e){this.canvas=e}async init(){if(!navigator.gpu)return!1;try{const e=await navigator.gpu.requestAdapter({powerPreference:"high-performance"});if(!e||(this.device=await e.requestDevice(),this.ctx=this.canvas.getContext("webgpu"),!this.ctx))return!1;this.isHdr=!!(window.matchMedia&&window.matchMedia("(dynamic-range: high)").matches);const n=navigator.gpu.getPreferredCanvasFormat();let t=!1;if(this.isHdr)try{this.ctx.configure({device:this.device,format:"rgba16float",colorSpace:"display-p3",toneMapping:{mode:"extended"},alphaMode:"opaque"}),this.presentationFormat="rgba16float",this.colorSpace="display-p3",t=!0}catch(i){console.info("Extended HDR canvas tone mapping not supported, falling back:",i)}return t||(this.presentationFormat=n,this.colorSpace="srgb",this.ctx.configure({device:this.device,format:n,alphaMode:"opaque"})),this.sampler=this.device.createSampler({magFilter:"linear",minFilter:"linear",addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge"}),await this.buildPipelines(),this.allocateTextures(this.canvas.width||window.innerWidth,this.canvas.height||window.innerHeight),!0}catch(e){return console.error("WebGPU initialization failed:",e),!1}}async buildPipelines(){const e=this.device,n=e.createShaderModule({code:Bn}),t=e.createShaderModule({code:An}),i=e.createShaderModule({code:In}),r=e.createShaderModule({code:wn}),o=(a,c,l)=>e.createRenderPipeline({layout:"auto",vertex:{module:a,entryPoint:"vs_quad"},fragment:{module:a,entryPoint:c,targets:[{format:l}]},primitive:{topology:"triangle-list"}});this.pipeAdvect=o(n,"fs_advect_bfecc","rgba16float"),this.pipeVorticity=o(n,"fs_vorticity","rgba16float"),this.pipeDivergence=o(n,"fs_divergence","rgba16float"),this.pipeJacobi=o(n,"fs_jacobi","rgba16float"),this.pipeSubtractGrad=o(n,"fs_subtract_gradient","rgba16float"),this.pipeDyeDiffuse=o(n,"fs_dye_diffuse","rgba16float"),this.pipeInjectVelocity=o(t,"fs_inject_velocity","rgba16float"),this.pipeInjectDye=o(t,"fs_inject_dye","rgba16float"),this.pipeBloomThreshold=o(i,"fs_threshold","rgba16float"),this.pipeBloomBlur=o(i,"fs_blur","rgba16float"),this.pipeComposite=o(r,"fs_composite",this.presentationFormat),this.bufSolver=e.createBuffer({size:64,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),this.bufForces=e.createBuffer({size:128,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),this.bufSplats=e.createBuffer({size:1536,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST}),this.bufComposite=e.createBuffer({size:64,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),this.bufBloomH=e.createBuffer({size:32,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),this.bufBloomV=e.createBuffer({size:32,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST})}allocateTextures(e,n){const t=this.device,i=e/n;this.velWidth=384,this.velHeight=Math.max(128,Math.round(384/Math.max(.5,i))),this.dyeWidth=1024,this.dyeHeight=Math.max(512,Math.round(1024/Math.max(.5,i)));const r=GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.COPY_DST|GPUTextureUsage.COPY_SRC,o=(u,h)=>t.createTexture({size:[u,h],format:"rgba16float",usage:r});this.texVelA?.destroy(),this.texVelB?.destroy(),this.texDyeA?.destroy(),this.texDyeB?.destroy(),this.texDivergence?.destroy(),this.texPressureA?.destroy(),this.texPressureB?.destroy(),this.texBloomThreshold?.destroy(),this.texBloomBlurA?.destroy(),this.texBloomBlurB?.destroy(),this.texVelA=o(this.velWidth,this.velHeight),this.texVelB=o(this.velWidth,this.velHeight),this.texDivergence=o(this.velWidth,this.velHeight),this.texPressureA=o(this.velWidth,this.velHeight),this.texPressureB=o(this.velWidth,this.velHeight),this.texDyeA=o(this.dyeWidth,this.dyeHeight),this.texDyeB=o(this.dyeWidth,this.dyeHeight);const a=new Float32Array(this.dyeWidth*this.dyeHeight*4);for(let u=0;u<this.dyeWidth*this.dyeHeight;u++)a[u*4+0]=.4,a[u*4+1]=-.06,a[u*4+2]=-.26,a[u*4+3]=1;this.device.queue.writeTexture({texture:this.texDyeA},a,{bytesPerRow:this.dyeWidth*16},{width:this.dyeWidth,height:this.dyeHeight});const c=Math.max(64,Math.floor(this.dyeWidth/4)),l=Math.max(64,Math.floor(this.dyeHeight/4));this.texBloomThreshold=o(c,l),this.texBloomBlurA=o(c,l),this.texBloomBlurB=o(c,l)}resize(e,n){if(!this.device||e<=0||n<=0)return;const t=Math.max(320,Math.round(e*this.resolutionScale)),i=Math.max(240,Math.round(n*this.resolutionScale));(this.canvas.width!==t||this.canvas.height!==i)&&(this.canvas.width=t,this.canvas.height=i,this.allocateTextures(t,i))}render(e,n,t){if(!this.device||!this.ctx)return;const i=this.device,r=performance.now(),o=Math.min(.04,t>0?t:.0166);this.frameCount++,r-this.lastFpsTime>500&&(this.currentFps=Math.round(this.frameCount*1e3/(r-this.lastFpsTime)),this.currentFrameTime=(r-this.lastFpsTime)/this.frameCount,this.frameCount=0,this.lastFpsTime=r);const a=_t(n.activePreset,e.bpm,e.energy);this.activePresetName=a.name;const c=Math.max(.45,Math.min(2,e.bpm/115)),l=o*c;a.viscosityBase-n.viscosityBias*.03;let u=a.damping,h=a.diffusion;e.ebbSurge.isEbb?(u=.986,h*=.6):e.ebbSurge.isSurge&&(u=.996,h*=1.4);const d=this.canvas.width/this.canvas.height,f=r*.001,v=this.motionEngine.update(e,a,l,f),y=[];let P=0;for(const V of v.splats)if(y.push(V.posX,V.posY,V.velX,V.velY,V.oklab[0],V.oklab[1],V.oklab[2],V.amplitude,V.radius,V.intensity,0,0),P++,P>=32)break;const C=new Float32Array(16);C[0]=this.velWidth,C[1]=this.velHeight,C[2]=1/this.velWidth,C[3]=1/this.velHeight,C[4]=l,C[5]=f,C[6]=u,C[7]=a.vorticityScale,C[8]=h,C[9]=.997,i.queue.writeBuffer(this.bufSolver,0,C);const M=e.colorTemperature?.baseLab[0]??.5,g=e.colorTemperature?.baseLab[1]??-.04,T=e.colorTemperature?.baseLab[2]??-.15,B=e.ebbSurge.isEbb?.008:.015+e.energy*.022,m=new Float32Array(32);m[0]=d,m[1]=f,m[2]=l,m[3]=e.ebbSurge.isEbb?.02:.08,m[4]=e.kickIntensity,m[5]=e.midRangeSwirl,m[6]=e.hiHatIntensity,m[7]=e.ebbSurge.isSurge?1:0;const E=new Uint32Array(m.buffer);E[8]=P,m[9]=B,m[10]=v.kickCenter[0],m[11]=v.kickCenter[1],m[12]=M,m[13]=g,m[14]=T,m[15]=1,m[16]=v.vortices[0].x,m[17]=v.vortices[0].y,m[18]=v.vortices[0].strength,m[19]=v.vortices[0].spinSign,m[20]=v.vortices[1].x,m[21]=v.vortices[1].y,m[22]=v.vortices[1].strength,m[23]=v.vortices[1].spinSign,m[24]=v.globalFlow[0],m[25]=v.globalFlow[1],m[26]=0,m[27]=0,i.queue.writeBuffer(this.bufForces,0,m),y.length>0&&i.queue.writeBuffer(this.bufSplats,0,new Float32Array(y));const x=new Float32Array(16);x[0]=this.canvas.width,x[1]=this.canvas.height,x[2]=1/this.dyeWidth,x[3]=1/this.dyeHeight,x[4]=n.hdrIntensity,x[5]=this.isHdr?1:0,x[6]=a.specularGloss,x[7]=.8,x[8]=a.bloomStrength,x[9]=f,x[10]=0,x[11]=0,x[12]=M,x[13]=g,x[14]=T,x[15]=1,i.queue.writeBuffer(this.bufComposite,0,x);const R=Math.max(64,Math.floor(this.dyeWidth/4)),L=Math.max(64,Math.floor(this.dyeHeight/4)),_=new Float32Array([1/R,1/L,1,0,.65,1,0,0]),b=new Float32Array([1/R,1/L,0,1,.65,1,0,0]);i.queue.writeBuffer(this.bufBloomH,0,_),i.queue.writeBuffer(this.bufBloomV,0,b);const p=i.createCommandEncoder(),S=(V,U,G)=>{const O=i.createBindGroup({layout:V.getBindGroupLayout(0),entries:G}),j=p.beginRenderPass({colorAttachments:[{view:U.createView(),loadOp:"load",storeOp:"store"}]});j.setPipeline(V),j.setBindGroup(0,O),j.draw(3),j.end()};S(this.pipeAdvect,this.texVelB,[{binding:0,resource:{buffer:this.bufSolver}},{binding:1,resource:this.sampler},{binding:2,resource:this.texVelA.createView()},{binding:3,resource:this.texVelA.createView()}]),S(this.pipeAdvect,this.texDyeB,[{binding:0,resource:{buffer:this.bufSolver}},{binding:1,resource:this.sampler},{binding:2,resource:this.texDyeA.createView()},{binding:3,resource:this.texVelB.createView()}]),S(this.pipeInjectVelocity,this.texVelA,[{binding:0,resource:{buffer:this.bufForces}},{binding:1,resource:{buffer:this.bufSplats}},{binding:2,resource:this.sampler},{binding:3,resource:this.texVelB.createView()}]),S(this.pipeInjectDye,this.texDyeA,[{binding:0,resource:{buffer:this.bufForces}},{binding:1,resource:{buffer:this.bufSplats}},{binding:2,resource:this.sampler},{binding:3,resource:this.texDyeB.createView()}]),S(this.pipeDyeDiffuse,this.texDyeB,[{binding:0,resource:{buffer:this.bufSolver}},{binding:1,resource:this.sampler},{binding:2,resource:this.texDyeA.createView()}]),S(this.pipeVorticity,this.texVelB,[{binding:0,resource:{buffer:this.bufSolver}},{binding:1,resource:this.sampler},{binding:2,resource:this.texVelA.createView()},{binding:3,resource:this.texVelA.createView()}]),S(this.pipeDivergence,this.texDivergence,[{binding:0,resource:{buffer:this.bufSolver}},{binding:1,resource:this.sampler},{binding:2,resource:this.texVelB.createView()}]);let w=this.texPressureA,z=this.texPressureB;for(let V=0;V<24;V++){S(this.pipeJacobi,z,[{binding:0,resource:{buffer:this.bufSolver}},{binding:1,resource:this.sampler},{binding:2,resource:w.createView()},{binding:3,resource:this.texDivergence.createView()}]);const U=w;w=z,z=U}S(this.pipeSubtractGrad,this.texVelA,[{binding:0,resource:{buffer:this.bufSolver}},{binding:1,resource:this.sampler},{binding:2,resource:this.texVelB.createView()},{binding:3,resource:w.createView()}]),p.copyTextureToTexture({texture:this.texDyeB},{texture:this.texDyeA},[this.dyeWidth,this.dyeHeight,1]),S(this.pipeBloomThreshold,this.texBloomThreshold,[{binding:0,resource:{buffer:this.bufBloomH}},{binding:1,resource:this.sampler},{binding:2,resource:this.texDyeB.createView()}]),S(this.pipeBloomBlur,this.texBloomBlurA,[{binding:0,resource:{buffer:this.bufBloomH}},{binding:1,resource:this.sampler},{binding:2,resource:this.texBloomThreshold.createView()}]),S(this.pipeBloomBlur,this.texBloomBlurB,[{binding:0,resource:{buffer:this.bufBloomV}},{binding:1,resource:this.sampler},{binding:2,resource:this.texBloomBlurA.createView()}]);let F;try{F=this.ctx.getCurrentTexture()}catch{return}const A=i.createBindGroup({layout:this.pipeComposite.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:this.bufComposite}},{binding:1,resource:this.sampler},{binding:2,resource:this.texDyeB.createView()},{binding:3,resource:this.texBloomBlurB.createView()}]}),I=p.beginRenderPass({colorAttachments:[{view:F.createView(),loadOp:"clear",storeOp:"store",clearValue:{r:.02,g:.02,b:.05,a:1}}]});I.setPipeline(this.pipeComposite),I.setBindGroup(0,A),I.draw(3),I.end(),i.queue.submit([p.finish()])}getStats(){return{fps:this.currentFps,frameTimeMs:parseFloat(this.currentFrameTime.toFixed(1)),resolutionScale:parseFloat(this.resolutionScale.toFixed(2)),rendererType:this.isHdr?"WebGPU (HDR)":"WebGPU (SDR)",canvasFormat:this.presentationFormat,colorSpace:this.colorSpace,hdrActive:this.isHdr,activePreset:this.activePresetName,jacobiIterations:24}}dispose(){this.texVelA?.destroy(),this.texVelB?.destroy(),this.texDyeA?.destroy(),this.texDyeB?.destroy(),this.texDivergence?.destroy(),this.texPressureA?.destroy(),this.texPressureB?.destroy(),this.texBloomThreshold?.destroy(),this.texBloomBlurA?.destroy(),this.texBloomBlurB?.destroy(),this.bufSolver?.destroy(),this.bufForces?.destroy(),this.bufSplats?.destroy(),this.bufComposite?.destroy(),this.bufBloomH?.destroy(),this.bufBloomV?.destroy()}}const ue=`#version 300 es
in vec2 aPosition;
out vec2 vUv;
void main() {
  vUv = aPosition * 0.5 + 0.5;
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`,Vn=`#version 300 es
precision highp float;

in vec2 vUv;
out vec4 fragColor;

uniform sampler2D uSourceTex;
uniform sampler2D uVelocityTex;
uniform vec2 uTexelSize;
uniform float uDt;
uniform float uDamping;

void main() {
  vec2 uv = vUv;
  vec2 u = texture(uVelocityTex, uv).xy;

  // Forward advection
  vec2 forwardCoord = uv - u * uDt * uTexelSize * 60.0;
  vec4 q_forward = texture(uSourceTex, forwardCoord);

  // Backward advection
  vec2 u_forward = texture(uVelocityTex, forwardCoord).xy;
  vec2 backwardCoord = forwardCoord + u_forward * uDt * uTexelSize * 60.0;
  vec4 q_backward = texture(uSourceTex, backwardCoord);

  // Corrected
  vec4 q_corrected = q_forward + 0.5 * (texture(uSourceTex, uv) - q_backward);

  // Limiter
  vec4 q0 = texture(uSourceTex, uv + vec2(uTexelSize.x, 0.0));
  vec4 q1 = texture(uSourceTex, uv - vec2(uTexelSize.x, 0.0));
  vec4 q2 = texture(uSourceTex, uv + vec2(0.0, uTexelSize.y));
  vec4 q3 = texture(uSourceTex, uv - vec2(0.0, uTexelSize.y));

  vec4 minQ = min(min(q0, q1), min(q2, q3));
  vec4 maxQ = max(max(q0, q1), max(q2, q3));

  fragColor = clamp(q_corrected, minQ, maxQ) * uDamping;
}
`,Un=`#version 300 es
precision highp float;

in vec2 vUv;
out vec4 fragColor;

uniform sampler2D uVelocityTex;
uniform vec2 uTexelSize;
uniform float uVorticityScale;
uniform float uDt;

void main() {
  vec2 uv = vUv;
  vec2 texel = uTexelSize;

  vec2 vL = texture(uVelocityTex, uv - vec2(texel.x, 0.0)).xy;
  vec2 vR = texture(uVelocityTex, uv + vec2(texel.x, 0.0)).xy;
  vec2 vB = texture(uVelocityTex, uv - vec2(0.0, texel.y)).xy;
  vec2 vT = texture(uVelocityTex, uv + vec2(0.0, texel.y)).xy;

  float curl = 0.5 * ((vT.x - vB.x) - (vR.y - vL.y));

  float cL = abs(curl); // approximate local gradient
  float cR = abs(curl);
  float cB = abs(curl);
  float cT = abs(curl);

  vec2 eta = vec2(0.5 * (cR - cL), 0.5 * (cT - cB));
  float lenEta = length(eta);
  if (lenEta > 0.0001) eta = eta / lenEta;
  else eta = vec2(0.0);

  vec2 force = vec2(eta.y, -eta.x) * curl * uVorticityScale * uDt;
  vec2 baseVel = texture(uVelocityTex, uv).xy;

  fragColor = vec4(baseVel + force, curl, 1.0);
}
`,On=`#version 300 es
precision highp float;

in vec2 vUv;
out vec4 fragColor;

uniform sampler2D uVelocityTex;
uniform vec2 uTexelSize;

void main() {
  vec2 uv = vUv;
  vec2 texel = uTexelSize;

  float vL = texture(uVelocityTex, uv - vec2(texel.x, 0.0)).x;
  float vR = texture(uVelocityTex, uv + vec2(texel.x, 0.0)).x;
  float vB = texture(uVelocityTex, uv - vec2(0.0, texel.y)).y;
  float vT = texture(uVelocityTex, uv + vec2(0.0, texel.y)).y;

  float div = 0.5 * ((vR - vL) + (vT - vB));
  fragColor = vec4(div, 0.0, 0.0, 1.0);
}
`,Nn=`#version 300 es
precision highp float;

in vec2 vUv;
out vec4 fragColor;

uniform sampler2D uPressureTex;
uniform sampler2D uDivergenceTex;
uniform vec2 uTexelSize;

void main() {
  vec2 uv = vUv;
  vec2 texel = uTexelSize;

  float pL = texture(uPressureTex, uv - vec2(texel.x, 0.0)).x;
  float pR = texture(uPressureTex, uv + vec2(texel.x, 0.0)).x;
  float pB = texture(uPressureTex, uv - vec2(0.0, texel.y)).x;
  float pT = texture(uPressureTex, uv + vec2(0.0, texel.y)).x;

  float div = texture(uDivergenceTex, uv).x;

  float p = (pL + pR + pB + pT - div) * 0.25;
  fragColor = vec4(p, 0.0, 0.0, 1.0);
}
`,Hn=`#version 300 es
precision highp float;

in vec2 vUv;
out vec4 fragColor;

uniform sampler2D uVelocityTex;
uniform sampler2D uPressureTex;
uniform vec2 uTexelSize;

void main() {
  vec2 uv = vUv;
  vec2 texel = uTexelSize;

  float pL = texture(uPressureTex, uv - vec2(texel.x, 0.0)).x;
  float pR = texture(uPressureTex, uv + vec2(texel.x, 0.0)).x;
  float pB = texture(uPressureTex, uv - vec2(0.0, texel.y)).x;
  float pT = texture(uPressureTex, uv + vec2(0.0, texel.y)).x;

  vec2 vel = texture(uVelocityTex, uv).xy;
  vec2 grad = 0.5 * vec2(pR - pL, pT - pB);

  fragColor = vec4(vel - grad, 0.0, 1.0);
}
`,zn=`#version 300 es
precision highp float;

in vec2 vUv;
out vec4 fragColor;

uniform sampler2D uDyeTex;
uniform vec2 uTexelSize;
uniform float uDiffusion;
uniform float uDissipation;

void main() {
  vec2 uv = vUv;
  vec2 texel = uTexelSize;

  vec4 center = texture(uDyeTex, uv);
  vec4 dL = texture(uDyeTex, uv - vec2(texel.x, 0.0));
  vec4 dR = texture(uDyeTex, uv + vec2(texel.x, 0.0));
  vec4 dB = texture(uDyeTex, uv - vec2(0.0, texel.y));
  vec4 dT = texture(uDyeTex, uv + vec2(0.0, texel.y));

  vec4 neighbors = (dL + dR + dB + dT) * 0.25;
  vec4 diffused = mix(center, neighbors, uDiffusion);

  fragColor = diffused * uDissipation;
}
`,wt=`#version 300 es
in vec2 aPosition;
out vec2 vUv;
void main() {
  vUv = aPosition * 0.5 + 0.5;
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`,qn=`#version 300 es
precision highp float;

in vec2 vUv;
out vec4 fragColor;

uniform sampler2D uDyeTex;
uniform vec2 uTexelSize;
uniform float uSpecularGloss;
uniform float uEdgeGlowStrength;
uniform float uHdrIntensity;
uniform float uTime;
uniform vec4 uAmbientLab;

${xn}

float dither(vec2 uv, float t) {
  return (fract(sin(dot(uv + vec2(t * 0.01), vec2(12.9898, 78.233))) * 43758.5453) - 0.5) * (1.0 / 255.0);
}

vec3 linear_to_srgb(vec3 c) {
  vec3 a = 12.92 * c;
  vec3 b = 1.055 * pow(max(c, vec3(0.0)), vec3(1.0 / 2.4)) - 0.055;
  return vec3(
    c.r <= 0.0031308 ? a.r : b.r,
    c.g <= 0.0031308 ? a.g : b.g,
    c.b <= 0.0031308 ? a.b : b.b
  );
}

void main() {
  vec2 uv = vUv;
  vec2 texel = uTexelSize;

  vec4 lab = texture(uDyeTex, uv);
  float L = lab.x;
  float a = lab.y;
  float b = lab.z;

  // Room lighting ambient floor: guarantee rich edge-to-edge color (never whitish, never black!)
  float ambL = uAmbientLab.x;
  float ambA = uAmbientLab.y;
  float ambB = uAmbientLab.z;

  float dyeWeight = clamp(L / max(0.01, ambL * 1.15), 0.0, 1.0);
  L = max(L, ambL);
  a = mix(ambA, a, dyeWeight);
  b = mix(ambB, b, dyeWeight);

  // Keep L in saturated, soulful sweet spot (never bleached with white!)
  L = clamp(L, 0.40, 0.75);

  // Convert OKLab to Linear RGB (ZERO SPECULAR GLOSS: purely soft matte diffused light)
  vec3 color = oklab_to_linear_rgb(L, a, b);

  // Dither
  color += vec3(dither(uv, uTime));

  // Saturation-preserving vibrancy mapping:
  // Retains 100% chromatic saturation and bright soulful color-wheel hues
  float maxC = max(color.r, max(color.g, color.b));
  if (maxC > 1.0) {
    color = color / maxC;
  }
  vec3 mapped = pow(max(vec3(0.0), color), vec3(1.0 / 1.6));

  fragColor = vec4(mapped, 1.0);
}
`,$n=`#version 300 es
precision highp float;

in vec2 vUv;
out vec4 fragColor;

uniform sampler2D uPrevVelocity;
uniform float uTime;
uniform float uDt;
uniform float uAspectRatio;
uniform float uCurlScale;
uniform float uKickIntensity;
uniform float uMidRangeSwirl;
uniform float uTrebleSparkle;
uniform int uSplatCount;

// Dynamic spatial flow uniforms (no circular carousel!)
uniform vec2 uKickCenter;
uniform vec4 uVortex1; // (x, y, strength, spinSign)
uniform vec4 uVortex2; // (x, y, strength, spinSign)
uniform vec2 uGlobalFlow;

// Max 24 splats
uniform vec2 uSplatPos[24];
uniform vec2 uSplatVel[24];
uniform float uSplatRadius[24];
uniform float uSplatIntensity[24];

vec2 hash22(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * vec3(0.1031, 0.1030, 0.0973));
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.xx + p3.yz) * p3.zy) * 2.0 - 1.0;
}

float snoise(vec2 p) {
  const float K1 = 0.366025404;
  const float K2 = 0.211324865;
  vec2 i = floor(p + (p.x + p.y) * K1);
  vec2 a = p - i + (i.x + i.y) * K2;
  vec2 o = step(a.yx, a.xy);
  vec2 b = a - o + K2;
  vec2 c = a - 1.0 + 2.0 * K2;
  vec3 h = max(0.5 - vec3(dot(a, a), dot(b, b), dot(c, c)), vec3(0.0));
  vec3 n = h * h * h * h * vec3(dot(a, hash22(i)), dot(b, hash22(i + o)), dot(c, hash22(i + 1.0)));
  return dot(n, vec3(70.0));
}

vec2 curlNoise(vec2 p) {
  float eps = 0.005;
  float n1 = snoise(p + vec2(0.0, eps));
  float n2 = snoise(p - vec2(0.0, eps));
  float n3 = snoise(p + vec2(eps, 0.0));
  float n4 = snoise(p - vec2(eps, 0.0));
  return vec2((n1 - n2) / (2.0 * eps), -(n3 - n4) / (2.0 * eps));
}

void main() {
  vec2 uv = vUv;
  vec2 vel = texture(uPrevVelocity, uv).xy;

  // 1. Organic multi-scale curl noise with music-driven temporal drift
  vec2 curl1 = curlNoise(uv * 2.2 + vec2(uTime * 0.09, uTime * 0.06));
  vec2 curl2 = curlNoise(uv * 4.5 - vec2(uTime * 0.12, uTime * 0.08));
  vel += (curl1 * 0.75 + curl2 * 0.25) * uCurlScale * uDt * 18.0;

  // 2. Global Harmonic Meandering Current
  vel += uGlobalFlow * uDt * 7.0;

  // 3. Decentralized Multi-Vortices (Two independent drifting gyres spinning oppositely)
  vec2 dV1 = (uv - uVortex1.xy) * vec2(uAspectRatio, 1.0);
  float rV1 = length(dV1);
  if (uVortex1.z > 0.01 && rV1 > 0.01) {
    vec2 tan1 = vec2(-dV1.y, dV1.x) / rV1;
    float w1 = exp(-rV1 * 3.2) * uVortex1.z * uVortex1.w;
    vel += tan1 * w1 * uDt * 26.0;
  }

  vec2 dV2 = (uv - uVortex2.xy) * vec2(uAspectRatio, 1.0);
  float rV2 = length(dV2);
  if (uVortex2.z > 0.01 && rV2 > 0.01) {
    vec2 tan2 = vec2(-dV2.y, dV2.x) / rV2;
    float w2 = exp(-rV2 * 3.2) * uVortex2.z * uVortex2.w;
    vel += tan2 * w2 * uDt * 26.0;
  }

  // 4. Smooth Beat / Kick Momentum (ZERO water ripples)
  if (uKickIntensity > 0.01) {
    vec2 toKick = (uv - uKickCenter) * vec2(uAspectRatio, 1.0);
    float rKick = length(toKick);
    float kickPush = exp(-rKick * 3.5);
    vec2 radialDir = toKick / max(0.001, rKick);
    vel += radialDir * kickPush * uKickIntensity * 0.12;
  }

  // 5. Treble Sparkle
  if (uTrebleSparkle > 0.01) {
    float fineNoise = snoise(uv * 36.0 + vec2(uTime * 3.5, uTime * 2.2));
    vel += vec2(fineNoise, -fineNoise) * uTrebleSparkle * 0.28;
  }

  // 6. Splat momentum
  for (int i = 0; i < 24; i++) {
    if (i >= uSplatCount) break;
    vec2 delta = (uv - uSplatPos[i]) * vec2(uAspectRatio, 1.0);
    float d = length(delta);
    float radius = uSplatRadius[i];
    if (d < radius * 2.5) {
      float rNorm = d / radius;
      float falloff = exp(-rNorm * rNorm * 2.2) * smoothstep(2.5, 0.0, rNorm);
      vel += uSplatVel[i] * falloff * uSplatIntensity[i] * 0.7;
    }
  }

  fragColor = vec4(vel, 0.0, 1.0);
}
`,Gn=`#version 300 es
precision highp float;

in vec2 vUv;
out vec4 fragColor;

uniform sampler2D uPrevDyeTex;
uniform float uAspectRatio;
uniform int uSplatCount;
uniform vec4 uAmbientLab;
uniform float uAmbientBlendRate;

// Max 24 splats
uniform vec2 uSplatPos[24];
uniform vec3 uSplatLab[24];
uniform float uSplatRadius[24];
uniform float uSplatIntensity[24];

void main() {
  vec2 uv = vUv;
  vec4 currentDye = texture(uPrevDyeTex, uv); // (L, a, b, alpha)

  // Edge-to-edge room lighting ambient bleed
  if (uAmbientBlendRate > 0.0) {
    currentDye.xyz = mix(currentDye.xyz, uAmbientLab.xyz, uAmbientBlendRate);
  }

  for (int i = 0; i < 24; i++) {
    if (i >= uSplatCount) break;
    vec2 delta = (uv - uSplatPos[i]) * vec2(uAspectRatio, 1.0);
    float d = length(delta);
    float radius = uSplatRadius[i];

    if (d < radius * 3.0) {
      float rNorm = d / radius;
      float falloff = exp(-rNorm * rNorm * 1.5) * smoothstep(3.0, 0.0, rNorm);
      float weight = falloff * uSplatIntensity[i] * 0.45;

      float splatL = uSplatLab[i].x;
      float splatA = uSplatLab[i].y;
      float splatB = uSplatLab[i].z;

      currentDye.x = mix(currentDye.x, max(currentDye.x, splatL), min(0.85, weight * 0.9));
      currentDye.y = mix(currentDye.y, splatA, min(0.90, weight * 1.1));
      currentDye.z = mix(currentDye.z, splatB, min(0.90, weight * 1.1));
    }
  }

  fragColor = currentDye;
}
`;class jn{canvas;gl=null;motionEngine=new xi;velWidth=384;velHeight=384;dyeWidth=768;dyeHeight=768;progAdvect;progVorticity;progDivergence;progJacobi;progSubtractGrad;progDyeDiffuse;progInjectVelocity;progInjectDye;progComposite;progAmbient;quadVao;internalFormat=0;texType=0;texVelA;texVelB;texDyeA;texDyeB;texDivergence;texPressureA;texPressureB;fboVelA;fboVelB;fboDyeA;fboDyeB;fboDiv;fboPressA;fboPressB;frameCount=0;lastFpsTime=performance.now();currentFps=60;currentFrameTime=16.6;activePresetName="Auto";constructor(e){this.canvas=e}async init(){const e=this.canvas.getContext("webgl2",{alpha:!1,depth:!1,stencil:!1,antialias:!1,powerPreference:"high-performance"});if(!e)return!1;this.gl=e;const n=e.getExtension("EXT_color_buffer_float");e.getExtension("OES_texture_float_linear"),n?(this.internalFormat=e.RGBA16F,this.texType=e.HALF_FLOAT):(this.internalFormat=e.RGBA8,this.texType=e.UNSIGNED_BYTE),this.progAdvect=this.createProgram(ue,Vn),this.progVorticity=this.createProgram(ue,Un),this.progDivergence=this.createProgram(ue,On),this.progJacobi=this.createProgram(ue,Nn),this.progSubtractGrad=this.createProgram(ue,Hn),this.progDyeDiffuse=this.createProgram(ue,zn),this.progInjectVelocity=this.createProgram(ue,$n),this.progInjectDye=this.createProgram(ue,Gn),this.progComposite=this.createProgram(wt,qn);const t=`#version 300 es
precision highp float;
in vec2 vUv;
out vec4 fragColor;
uniform sampler2D uDyeTex;
uniform vec4 uAmbientLab;   // OKLab color (L,a,b,intensity)
uniform float uBlendRate;
void main() {
  vec4 current = texture(uDyeTex, vUv);
  fragColor = mix(current, vec4(uAmbientLab.xyz, 1.0), uBlendRate);
}`;if(this.progAmbient=this.createProgram(wt.replace("aPosition","aPosition"),t),!this.progAdvect||!this.progComposite)return!1;this.quadVao=e.createVertexArray(),e.bindVertexArray(this.quadVao);const i=e.createBuffer();return e.bindBuffer(e.ARRAY_BUFFER,i),e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),e.STATIC_DRAW),e.enableVertexAttribArray(0),e.vertexAttribPointer(0,2,e.FLOAT,!1,0,0),e.bindVertexArray(null),this.allocateFramebuffers(this.canvas.width||window.innerWidth,this.canvas.height||window.innerHeight),this.seedInitialFluid(),!0}createProgram(e,n){const t=this.gl,i=t.createShader(t.VERTEX_SHADER);if(t.shaderSource(i,e),t.compileShader(i),!t.getShaderParameter(i,t.COMPILE_STATUS))return console.error(t.getShaderInfoLog(i)),null;const r=t.createShader(t.FRAGMENT_SHADER);if(t.shaderSource(r,n),t.compileShader(r),!t.getShaderParameter(r,t.COMPILE_STATUS))return console.error(t.getShaderInfoLog(r)),null;const o=t.createProgram();return t.attachShader(o,i),t.attachShader(o,r),t.linkProgram(o),t.getProgramParameter(o,t.LINK_STATUS)?o:(console.error(t.getProgramInfoLog(o)),null)}allocateFramebuffers(e,n){const t=this.gl,i=e/n;this.velWidth=384,this.velHeight=Math.max(128,Math.round(384/Math.max(.5,i))),this.dyeWidth=768,this.dyeHeight=Math.max(256,Math.round(768/Math.max(.5,i)));const r=(f,v)=>{const y=t.createTexture();t.bindTexture(t.TEXTURE_2D,y),t.texImage2D(t.TEXTURE_2D,0,this.internalFormat,f,v,0,t.RGBA,this.texType,null),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.LINEAR),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,t.LINEAR),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE);const P=t.createFramebuffer();return t.bindFramebuffer(t.FRAMEBUFFER,P),t.framebufferTexture2D(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,y,0),{tex:y,fbo:P}},o=r(this.velWidth,this.velHeight);this.texVelA=o.tex,this.fboVelA=o.fbo;const a=r(this.velWidth,this.velHeight);this.texVelB=a.tex,this.fboVelB=a.fbo;const c=r(this.velWidth,this.velHeight);this.texDivergence=c.tex,this.fboDiv=c.fbo;const l=r(this.velWidth,this.velHeight);this.texPressureA=l.tex,this.fboPressA=l.fbo;const u=r(this.velWidth,this.velHeight);this.texPressureB=u.tex,this.fboPressB=u.fbo;const h=r(this.dyeWidth,this.dyeHeight);this.texDyeA=h.tex,this.fboDyeA=h.fbo;const d=r(this.dyeWidth,this.dyeHeight);this.texDyeB=d.tex,this.fboDyeB=d.fbo,t.bindFramebuffer(t.FRAMEBUFFER,null)}seedInitialFluid(){const e=this.gl;if(this.internalFormat!==e.RGBA16F)return;const n=new Float32Array(this.dyeWidth*this.dyeHeight*4);for(let t=0;t<this.dyeHeight;t++)for(let i=0;i<this.dyeWidth;i++){const r=(t*this.dyeWidth+i)*4,o=i/this.dyeWidth-.5,a=t/this.dyeHeight-.5,c=Math.atan2(a,o),l=Math.sqrt(o*o+a*a),h=((c/Math.PI*.5+.5)*360+220)%360*Math.PI/180,d=.28,f=.4+l*.08;n[r]=f,n[r+1]=d*Math.cos(h),n[r+2]=d*Math.sin(h),n[r+3]=1}e.bindTexture(e.TEXTURE_2D,this.texDyeA),e.texSubImage2D(e.TEXTURE_2D,0,0,0,this.dyeWidth,this.dyeHeight,e.RGBA,e.FLOAT,n),e.bindTexture(e.TEXTURE_2D,null)}resize(e,n){!this.gl||e<=0||n<=0||(this.canvas.width!==e||this.canvas.height!==n)&&(this.canvas.width=e,this.canvas.height=n,this.allocateFramebuffers(e,n))}render(e,n,t){if(!this.gl)return;const i=this.gl,r=performance.now(),o=Math.min(.04,t>0?t:.0166);this.frameCount++,r-this.lastFpsTime>500&&(this.currentFps=Math.round(this.frameCount*1e3/(r-this.lastFpsTime)),this.currentFrameTime=(r-this.lastFpsTime)/this.frameCount,this.frameCount=0,this.lastFpsTime=r);const a=_t(n.activePreset,e.bpm,e.energy);this.activePresetName=a.name;const c=Math.max(.45,Math.min(2,e.bpm/115)),l=o*c;let u=a.damping,h=a.diffusion;e.ebbSurge.isEbb?(u=.986,h*=.6):e.ebbSurge.isSurge&&(u=.996,h*=1.4);const d=this.canvas.width/this.canvas.height,f=r*.001,v=e.colorTemperature?.baseLab[0]??.5,y=e.colorTemperature?.baseLab[1]??-.04,P=e.colorTemperature?.baseLab[2]??-.15,C=e.ebbSurge.isEbb?.008:.015+e.energy*.022,M=this.motionEngine.update(e,a,l,f),g=[],T=[],B=[],m=[],E=[];let x=0;for(const _ of M.splats)if(g.push(_.posX,_.posY),T.push(_.velX,_.velY),B.push(_.oklab[0],_.oklab[1],_.oklab[2]),m.push(_.radius),E.push(_.intensity),x++,x>=24)break;i.bindVertexArray(this.quadVao),i.bindFramebuffer(i.FRAMEBUFFER,this.fboVelB),i.viewport(0,0,this.velWidth,this.velHeight),i.useProgram(this.progAdvect),i.uniform2f(i.getUniformLocation(this.progAdvect,"uTexelSize"),1/this.velWidth,1/this.velHeight),i.uniform1f(i.getUniformLocation(this.progAdvect,"uDt"),l),i.uniform1f(i.getUniformLocation(this.progAdvect,"uDamping"),u),i.activeTexture(i.TEXTURE0),i.bindTexture(i.TEXTURE_2D,this.texVelA),i.uniform1i(i.getUniformLocation(this.progAdvect,"uSourceTex"),0),i.activeTexture(i.TEXTURE1),i.bindTexture(i.TEXTURE_2D,this.texVelA),i.uniform1i(i.getUniformLocation(this.progAdvect,"uVelocityTex"),1),i.drawArrays(i.TRIANGLES,0,3),i.bindFramebuffer(i.FRAMEBUFFER,this.fboVelA),i.viewport(0,0,this.velWidth,this.velHeight),i.useProgram(this.progInjectVelocity),i.uniform1f(i.getUniformLocation(this.progInjectVelocity,"uTime"),f),i.uniform1f(i.getUniformLocation(this.progInjectVelocity,"uDt"),l),i.uniform1f(i.getUniformLocation(this.progInjectVelocity,"uAspectRatio"),d),i.uniform1f(i.getUniformLocation(this.progInjectVelocity,"uCurlScale"),e.ebbSurge.isEbb?.02:.08),i.uniform1f(i.getUniformLocation(this.progInjectVelocity,"uKickIntensity"),e.kickIntensity),i.uniform1f(i.getUniformLocation(this.progInjectVelocity,"uMidRangeSwirl"),e.midRangeSwirl),i.uniform1f(i.getUniformLocation(this.progInjectVelocity,"uTrebleSparkle"),e.hiHatIntensity),i.uniform1i(i.getUniformLocation(this.progInjectVelocity,"uSplatCount"),x),i.uniform2f(i.getUniformLocation(this.progInjectVelocity,"uKickCenter"),M.kickCenter[0],M.kickCenter[1]),i.uniform4f(i.getUniformLocation(this.progInjectVelocity,"uVortex1"),M.vortices[0].x,M.vortices[0].y,M.vortices[0].strength,M.vortices[0].spinSign),i.uniform4f(i.getUniformLocation(this.progInjectVelocity,"uVortex2"),M.vortices[1].x,M.vortices[1].y,M.vortices[1].strength,M.vortices[1].spinSign),i.uniform2f(i.getUniformLocation(this.progInjectVelocity,"uGlobalFlow"),M.globalFlow[0],M.globalFlow[1]),x>0&&(i.uniform2fv(i.getUniformLocation(this.progInjectVelocity,"uSplatPos[0]"),new Float32Array(g)),i.uniform2fv(i.getUniformLocation(this.progInjectVelocity,"uSplatVel[0]"),new Float32Array(T)),i.uniform1fv(i.getUniformLocation(this.progInjectVelocity,"uSplatRadius[0]"),new Float32Array(m)),i.uniform1fv(i.getUniformLocation(this.progInjectVelocity,"uSplatIntensity[0]"),new Float32Array(E))),i.activeTexture(i.TEXTURE0),i.bindTexture(i.TEXTURE_2D,this.texVelB),i.uniform1i(i.getUniformLocation(this.progInjectVelocity,"uPrevVelocity"),0),i.drawArrays(i.TRIANGLES,0,3),i.bindFramebuffer(i.FRAMEBUFFER,this.fboDyeB),i.viewport(0,0,this.dyeWidth,this.dyeHeight),i.useProgram(this.progAdvect),i.uniform2f(i.getUniformLocation(this.progAdvect,"uTexelSize"),1/this.dyeWidth,1/this.dyeHeight),i.uniform1f(i.getUniformLocation(this.progAdvect,"uDt"),l),i.uniform1f(i.getUniformLocation(this.progAdvect,"uDamping"),.998),i.activeTexture(i.TEXTURE0),i.bindTexture(i.TEXTURE_2D,this.texDyeA),i.uniform1i(i.getUniformLocation(this.progAdvect,"uSourceTex"),0),i.activeTexture(i.TEXTURE1),i.bindTexture(i.TEXTURE_2D,this.texVelA),i.uniform1i(i.getUniformLocation(this.progAdvect,"uVelocityTex"),1),i.drawArrays(i.TRIANGLES,0,3),i.bindFramebuffer(i.FRAMEBUFFER,this.fboDyeA),i.viewport(0,0,this.dyeWidth,this.dyeHeight),i.useProgram(this.progInjectDye),i.uniform1f(i.getUniformLocation(this.progInjectDye,"uAspectRatio"),d),i.uniform1i(i.getUniformLocation(this.progInjectDye,"uSplatCount"),x),i.uniform4f(i.getUniformLocation(this.progInjectDye,"uAmbientLab"),v,y,P,1),i.uniform1f(i.getUniformLocation(this.progInjectDye,"uAmbientBlendRate"),C),x>0&&(i.uniform2fv(i.getUniformLocation(this.progInjectDye,"uSplatPos[0]"),new Float32Array(g)),i.uniform3fv(i.getUniformLocation(this.progInjectDye,"uSplatLab[0]"),new Float32Array(B)),i.uniform1fv(i.getUniformLocation(this.progInjectDye,"uSplatRadius[0]"),new Float32Array(m)),i.uniform1fv(i.getUniformLocation(this.progInjectDye,"uSplatIntensity[0]"),new Float32Array(E))),i.activeTexture(i.TEXTURE0),i.bindTexture(i.TEXTURE_2D,this.texDyeB),i.uniform1i(i.getUniformLocation(this.progInjectDye,"uPrevDyeTex"),0),i.drawArrays(i.TRIANGLES,0,3),i.bindFramebuffer(i.FRAMEBUFFER,this.fboDyeB),i.viewport(0,0,this.dyeWidth,this.dyeHeight),i.useProgram(this.progDyeDiffuse),i.uniform2f(i.getUniformLocation(this.progDyeDiffuse,"uTexelSize"),1/this.dyeWidth,1/this.dyeHeight),i.uniform1f(i.getUniformLocation(this.progDyeDiffuse,"uDiffusion"),h),i.uniform1f(i.getUniformLocation(this.progDyeDiffuse,"uDissipation"),.997),i.activeTexture(i.TEXTURE0),i.bindTexture(i.TEXTURE_2D,this.texDyeA),i.uniform1i(i.getUniformLocation(this.progDyeDiffuse,"uDyeTex"),0),i.drawArrays(i.TRIANGLES,0,3);{const _=this.texDyeA;this.texDyeA=this.texDyeB,this.texDyeB=_;const b=this.fboDyeA;this.fboDyeA=this.fboDyeB,this.fboDyeB=b}{let _=.32,b=0,p=-.08;if(e.spectrumBands.reduce((A,I)=>A+I.amplitude,0)>.001){let A=0,I=0,V=0,U=0;for(const G of e.spectrumBands){const O=Math.max(.03,G.amplitude);A+=G.oklab[0]*O,I+=G.oklab[1]*O,V+=G.oklab[2]*O,U+=O}_=A/U,b=I/U,p=V/U}_=Math.max(.28,Math.min(.72,_));const w=e.ebbSurge.isEbb?.004:.008+e.energy*.012;i.bindFramebuffer(i.FRAMEBUFFER,this.fboDyeB),i.viewport(0,0,this.dyeWidth,this.dyeHeight),i.useProgram(this.progAmbient),i.activeTexture(i.TEXTURE0),i.bindTexture(i.TEXTURE_2D,this.texDyeA),i.uniform1i(i.getUniformLocation(this.progAmbient,"uDyeTex"),0),i.uniform4f(i.getUniformLocation(this.progAmbient,"uAmbientLab"),_,b,p,1),i.uniform1f(i.getUniformLocation(this.progAmbient,"uBlendRate"),w),i.drawArrays(i.TRIANGLES,0,3);let z=this.texDyeA;this.texDyeA=this.texDyeB,this.texDyeB=z;let F=this.fboDyeA;this.fboDyeA=this.fboDyeB,this.fboDyeB=F}i.bindFramebuffer(i.FRAMEBUFFER,this.fboVelB),i.viewport(0,0,this.velWidth,this.velHeight),i.useProgram(this.progVorticity),i.uniform2f(i.getUniformLocation(this.progVorticity,"uTexelSize"),1/this.velWidth,1/this.velHeight),i.uniform1f(i.getUniformLocation(this.progVorticity,"uVorticityScale"),a.vorticityScale),i.uniform1f(i.getUniformLocation(this.progVorticity,"uDt"),l),i.activeTexture(i.TEXTURE0),i.bindTexture(i.TEXTURE_2D,this.texVelA),i.uniform1i(i.getUniformLocation(this.progVorticity,"uVelocityTex"),0),i.drawArrays(i.TRIANGLES,0,3),i.bindFramebuffer(i.FRAMEBUFFER,this.fboDiv),i.useProgram(this.progDivergence),i.uniform2f(i.getUniformLocation(this.progDivergence,"uTexelSize"),1/this.velWidth,1/this.velHeight),i.activeTexture(i.TEXTURE0),i.bindTexture(i.TEXTURE_2D,this.texVelB),i.uniform1i(i.getUniformLocation(this.progDivergence,"uVelocityTex"),0),i.drawArrays(i.TRIANGLES,0,3),i.useProgram(this.progJacobi),i.uniform2f(i.getUniformLocation(this.progJacobi,"uTexelSize"),1/this.velWidth,1/this.velHeight),i.activeTexture(i.TEXTURE1),i.bindTexture(i.TEXTURE_2D,this.texDivergence),i.uniform1i(i.getUniformLocation(this.progJacobi,"uDivergenceTex"),1);let R=this.texPressureA,L=this.fboPressB;for(let _=0;_<24;_++){i.bindFramebuffer(i.FRAMEBUFFER,L),i.activeTexture(i.TEXTURE0),i.bindTexture(i.TEXTURE_2D,R),i.uniform1i(i.getUniformLocation(this.progJacobi,"uPressureTex"),0),i.drawArrays(i.TRIANGLES,0,3);const b=L===this.fboPressB?this.texPressureB:this.texPressureA;L=L===this.fboPressB?this.fboPressA:this.fboPressB,R=b}i.bindFramebuffer(i.FRAMEBUFFER,this.fboVelA),i.useProgram(this.progSubtractGrad),i.uniform2f(i.getUniformLocation(this.progSubtractGrad,"uTexelSize"),1/this.velWidth,1/this.velHeight),i.activeTexture(i.TEXTURE0),i.bindTexture(i.TEXTURE_2D,this.texVelB),i.uniform1i(i.getUniformLocation(this.progSubtractGrad,"uVelocityTex"),0),i.activeTexture(i.TEXTURE1),i.bindTexture(i.TEXTURE_2D,R),i.uniform1i(i.getUniformLocation(this.progSubtractGrad,"uPressureTex"),1),i.drawArrays(i.TRIANGLES,0,3),i.bindFramebuffer(i.FRAMEBUFFER,null),i.viewport(0,0,this.canvas.width,this.canvas.height),i.useProgram(this.progComposite),i.uniform2f(i.getUniformLocation(this.progComposite,"uTexelSize"),1/this.dyeWidth,1/this.dyeHeight),i.uniform1f(i.getUniformLocation(this.progComposite,"uSpecularGloss"),a.specularGloss),i.uniform1f(i.getUniformLocation(this.progComposite,"uEdgeGlowStrength"),.8),i.uniform1f(i.getUniformLocation(this.progComposite,"uHdrIntensity"),n.hdrIntensity),i.uniform1f(i.getUniformLocation(this.progComposite,"uTime"),r*.001),i.uniform4f(i.getUniformLocation(this.progComposite,"uAmbientLab"),v,y,P,1),i.activeTexture(i.TEXTURE0),i.bindTexture(i.TEXTURE_2D,this.texDyeA),i.uniform1i(i.getUniformLocation(this.progComposite,"uDyeTex"),0),i.drawArrays(i.TRIANGLES,0,3),i.bindVertexArray(null)}getStats(){return{fps:this.currentFps,frameTimeMs:parseFloat(this.currentFrameTime.toFixed(1)),resolutionScale:1,rendererType:"WebGL2",canvasFormat:"rgba16f",colorSpace:"srgb",hdrActive:!1,activePreset:this.activePresetName,jacobiIterations:24}}dispose(){if(!this.gl)return;const e=this.gl;e.deleteTexture(this.texVelA),e.deleteTexture(this.texVelB),e.deleteTexture(this.texDyeA),e.deleteTexture(this.texDyeB),e.deleteTexture(this.texDivergence),e.deleteTexture(this.texPressureA),e.deleteTexture(this.texPressureB)}}class Wn{el;callbacks;constructor(e){typeof e=="function"?this.callbacks={onStartSolo:e,onStartPhoneRemote:()=>{},onStartTVReceiver:()=>{}}:this.callbacks=e,this.el=document.createElement("div"),this.el.className="start-screen",this.el.innerHTML=`
      <div class="start-content">
        <div class="start-badge">Living HDR Navier-Stokes Color Field</div>
        <h1 class="start-title">VibeField</h1>
        <p class="start-desc">
          Turns your screen into a living fluid color field dancing in real time to your music.
        </p>

        <div class="start-actions-group">
          <button class="start-button primary-action" id="btnStartApp">
            <span>Enter Visualizer (Fullscreen)</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
          </button>

          <div class="dual-screen-actions">
            <button class="start-sub-button" id="btnPhoneRemote">
              <span class="sub-icon">📱</span>
              <div class="sub-text">
                <span class="sub-title">Connect to TV</span>
                <span class="sub-desc">Phone as Room Mic & Remote</span>
              </div>
            </button>

            <button class="start-sub-button" id="btnTvReceiver">
              <span class="sub-icon">📺</span>
              <div class="sub-text">
                <span class="sub-title">Display on TV</span>
                <span class="sub-desc">4-Digit PIN (No TV Typing)</span>
              </div>
            </button>
          </div>
        </div>

        <div class="start-tips">
          <div class="tip-item"><kbd>F</kbd> Fullscreen</div>
          <div class="tip-item"><kbd>H</kbd> Controls & Settings</div>
          <div class="tip-item"><kbd>[</kbd> <kbd>]</kbd> <kbd>N</kbd> Color Temp</div>
          <div class="tip-item"><kbd>T</kbd> Capture Tab Audio</div>
          <div class="tip-item"><kbd>M</kbd> Demo Synth</div>
          <div class="tip-item"><kbd>B</kbd> Debug Overlay</div>
        </div>
      </div>
    `,document.body.appendChild(this.el),this.el.querySelector("#btnStartApp")?.addEventListener("click",o=>{o.stopPropagation(),this.dismiss("solo")}),this.el.querySelector("#btnPhoneRemote")?.addEventListener("click",o=>{o.stopPropagation(),this.dismiss("phone")}),this.el.querySelector("#btnTvReceiver")?.addEventListener("click",o=>{o.stopPropagation(),this.dismiss("tv")});const r=o=>{(o.key===" "||o.key==="Enter")&&(window.removeEventListener("keydown",r),this.dismiss("solo"))};window.addEventListener("keydown",r)}dismiss(e){this.el.classList.add("start-fade-out"),setTimeout(()=>{this.el.parentElement&&this.el.parentElement.removeChild(this.el)},600),e==="solo"?this.callbacks.onStartSolo():e==="phone"?this.callbacks.onStartPhoneRemote():e==="tv"&&this.callbacks.onStartTVReceiver()}}class Kn{container;constructor(){this.container=document.createElement("div"),this.container.className="toast-container",document.body.appendChild(this.container)}show(e,n=3200,t="info"){const i=document.createElement("div");i.className=`toast toast-${t}`,i.textContent=e,this.container.appendChild(i),requestAnimationFrame(()=>{i.classList.add("toast-visible")}),setTimeout(()=>{i.classList.remove("toast-visible"),setTimeout(()=>{i.parentElement&&i.parentElement.removeChild(i)},400)},n)}}class Xn{modal;isOpen=!1;settings;callbacks;deviceSelectEl=null;getColorTempLabel(e){return e>.05?`+${Math.round(e*100)}% Warm 🔥`:e<-.05?`${Math.round(e*100)}% Cool ❄`:"Neutral (Auto Harmonic) ⚪"}constructor(e,n){this.settings={...e},this.callbacks=n,this.modal=document.createElement("div"),this.modal.className="modal-backdrop settings-modal hidden",this.modal.innerHTML=`
      <div class="modal-card settings-card">
        <div class="modal-header">
          <h2>VibeField Controls</h2>
          <button class="modal-close-btn" aria-label="Close">&times;</button>
        </div>
        <p class="modal-subtitle">Press <kbd>H</kbd> or <kbd>Esc</kbd> to hide. Living, flowing liquid HDR color field.</p>

        <!-- Presets Selection -->
        <div class="setting-row">
          <label>Fluid & Color Presets (Keys 0-5)</label>
          <div class="presets-selector" id="presetButtons">
            <button class="preset-btn active" data-preset="auto">0 Auto</button>
            <button class="preset-btn" data-preset="ink">1 Ink in Water</button>
            <button class="preset-btn" data-preset="lava">2 Lava Lamp</button>
            <button class="preset-btn" data-preset="aurora">3 Aurora</button>
            <button class="preset-btn" data-preset="neon">4 Neon Club</button>
            <button class="preset-btn" data-preset="ocean">5 Deep Ocean</button>
          </div>
        </div>

        <div class="settings-grid">
          <!-- Audio Input -->
          <div class="setting-row">
            <div class="setting-label-row">
              <label for="settingDevice">Audio Input Source</label>
              <div class="setting-quick-actions">
                <button id="btnTabAudio" class="btn-action-sm">Capture Tab (T)</button>
                <button id="btnDemoAudio" class="btn-action-sm">Demo Synth (M)</button>
              </div>
            </div>
            <select id="settingDevice" class="setting-select"></select>
          </div>

          <!-- Sensitivity -->
          <div class="setting-row">
            <div class="setting-label-row">
              <label for="settingSensitivity">Audio Sensitivity & Auto-Gain</label>
              <span class="setting-val" id="valSensitivity">${this.settings.sensitivity.toFixed(2)}x</span>
            </div>
            <input type="range" id="settingSensitivity" min="0.2" max="3.0" step="0.05" value="${this.settings.sensitivity}">
          </div>

          <!-- Viscosity Bias -->
          <div class="setting-row">
            <div class="setting-label-row">
              <label for="settingViscosity">Viscosity Bias</label>
              <span class="setting-val" id="valViscosity">${this.settings.viscosityBias>0?"+":""}${this.settings.viscosityBias.toFixed(2)}</span>
            </div>
            <input type="range" id="settingViscosity" min="-1.0" max="1.0" step="0.05" value="${this.settings.viscosityBias}">
            <div class="setting-hint">Negative: splashy & turbulent. Positive: thick, slow oil or honey.</div>
          </div>

          <!-- Color Temperature Filter Range -->
          <div class="setting-row">
            <div class="setting-label-row">
              <label for="settingColorTemp">Color Temperature Filter</label>
              <span class="setting-val" id="valColorTemp">${this.getColorTempLabel(this.settings.colorTempBias??0)}</span>
            </div>
            <div class="setting-quick-actions" style="margin-top: 6px; margin-bottom: 8px;">
              <button id="btnTempCool" class="btn-action-sm ${(this.settings.colorTempBias??0)<-.3?"active-action":""}">❄ Cool (-1.0)</button>
              <button id="btnTempNeutral" class="btn-action-sm ${Math.abs(this.settings.colorTempBias??0)<=.05?"active-action":""}">⚪ Neutral (Auto)</button>
              <button id="btnTempWarm" class="btn-action-sm ${(this.settings.colorTempBias??0)>.3?"active-action":""}">🔥 Warm (+1.0)</button>
            </div>
            <input type="range" id="settingColorTemp" min="-1.0" max="1.0" step="0.05" value="${this.settings.colorTempBias??0}">
            <div class="setting-hint">Center is Neutral (functions normally with extracted key signature). Shift left for Cool (Sapphire/Cobalt); shift right for Warm (Ruby/Amber). Hotkeys: [ and ] or N to reset.</div>
          </div>

          <!-- Color Spectrum Rotation (Living Full Spectrum Wheel) -->
          <div class="setting-row">
            <div class="setting-label-row">
              <label>Color Spectrum Motion</label>
              <span class="setting-val" id="valShiftMode">${this.settings.paletteShiftMode==="fixed"?"Fixed Mood":"Dynamic Shifting ↺"}</span>
            </div>
            <div class="setting-quick-actions" style="margin-top: 6px; margin-bottom: 8px;">
              <button id="btnModeShifting" class="btn-action-sm ${this.settings.paletteShiftMode!=="fixed"?"active-action":""}">Dynamic Shifting ↺</button>
              <button id="btnModeFixed" class="btn-action-sm ${this.settings.paletteShiftMode==="fixed"?"active-action":""}">Fixed Mood</button>
            </div>
            <div class="setting-label-row">
              <label for="settingShiftSpeed" style="font-size: 0.85rem; opacity: 0.85;">Rotation Speed</label>
              <span class="setting-val" id="valShiftSpeed">${(this.settings.paletteShiftSpeed??1).toFixed(1)}x</span>
            </div>
            <input type="range" id="settingShiftSpeed" min="0.2" max="3.0" step="0.1" value="${this.settings.paletteShiftSpeed??1}">
            <div class="setting-hint">Dynamic: entire musical frequency scale is mapped across the 360° color wheel, continuously rotating with chords, bass hits & treble sharpness.</div>
          </div>

          <!-- HDR Intensity -->
          <div class="setting-row">
            <div class="setting-label-row">
              <label for="settingHdr">HDR Intensity & Peak Luminance</label>
              <span class="setting-val" id="valHdr">${this.settings.hdrIntensity.toFixed(2)}</span>
            </div>
            <input type="range" id="settingHdr" min="0.0" max="1.5" step="0.05" value="${this.settings.hdrIntensity}">
            <div class="setting-hint">Caps peak luminance above 1.0 on HDR monitors for room illumination. Default 0.6.</div>
          </div>

          <!-- Smart Light WebSocket -->
          <div class="setting-row">
            <div class="setting-label-row">
              <label for="chkSmartLights">Smart Light Broadcast (WLED / Hue)</label>
              <input type="checkbox" id="chkSmartLights" ${this.settings.enableSmartLights?"checked":""}>
            </div>
            <input type="text" id="txtSmartLightUrl" class="setting-text-input" placeholder="ws://localhost:8080/wled" value="${this.settings.smartLightWsUrl}">
            <div class="setting-hint">Broadcasts dominant color JSON ~10 times/sec for smart light bridges.</div>
          </div>
        </div>

        <!-- Capture Actions -->
        <div class="capture-actions-row">
          <button id="btnScreenshot" class="btn-secondary">📸 Screenshot (S)</button>
          <button id="btnRecord" class="btn-secondary">🎥 Record 30s WebM (R)</button>
        </div>

        <div class="shortcuts-card">
          <div class="shortcuts-title">Keyboard Shortcuts</div>
          <div class="shortcuts-grid">
            <div><kbd>0</kbd>–<kbd>5</kbd> Presets</div>
            <div><kbd>H</kbd> Controls Drawer</div>
            <div><kbd>F</kbd> Fullscreen</div>
            <div><kbd>D</kbd> Audio Devices</div>
            <div><kbd>T</kbd> Capture Tab Audio</div>
            <div><kbd>B</kbd> Telemetry HUD</div>
            <div><kbd>M</kbd> Cycle Demo Synth</div>
            <div><kbd>S</kbd> Screenshot / <kbd>R</kbd> Record</div>
          </div>
        </div>

        <div class="modal-footer">
          <button id="btnResetSettings" class="btn-secondary">Reset to Defaults</button>
          <button id="btnCloseSettings" class="btn-primary">Done</button>
        </div>
      </div>
    `,document.body.appendChild(this.modal),this.deviceSelectEl=this.modal.querySelector("#settingDevice"),this.bindEvents()}bindEvents(){const e=this.modal.querySelector(".modal-close-btn"),n=this.modal.querySelector("#btnCloseSettings");e?.addEventListener("click",()=>this.hide()),n?.addEventListener("click",()=>this.hide()),this.modal.addEventListener("click",E=>{E.target===this.modal&&this.hide()});const t=this.modal.querySelectorAll(".preset-btn");t.forEach(E=>{E.addEventListener("click",()=>{const x=E.dataset.preset;t.forEach(R=>R.classList.remove("active")),E.classList.add("active"),this.settings.activePreset=x,this.callbacks.onSelectPreset(x)})});const i=this.modal.querySelector("#settingSensitivity"),r=this.modal.querySelector("#valSensitivity");i.addEventListener("input",()=>{this.settings.sensitivity=parseFloat(i.value),r.textContent=`${this.settings.sensitivity.toFixed(2)}x`,this.callbacks.onUpdate(this.settings)});const o=this.modal.querySelector("#settingViscosity"),a=this.modal.querySelector("#valViscosity");o.addEventListener("input",()=>{this.settings.viscosityBias=parseFloat(o.value),a.textContent=`${this.settings.viscosityBias>0?"+":""}${this.settings.viscosityBias.toFixed(2)}`,this.callbacks.onUpdate(this.settings)});const c=this.modal.querySelector("#settingColorTemp"),l=this.modal.querySelector("#valColorTemp"),u=this.modal.querySelector("#btnTempCool"),h=this.modal.querySelector("#btnTempNeutral"),d=this.modal.querySelector("#btnTempWarm"),f=E=>{this.settings.colorTempBias=Math.max(-1,Math.min(1,E)),c&&(c.value=this.settings.colorTempBias.toString()),l&&(l.textContent=this.getColorTempLabel(this.settings.colorTempBias)),u?.classList.toggle("active-action",this.settings.colorTempBias<-.3),h?.classList.toggle("active-action",Math.abs(this.settings.colorTempBias)<=.05),d?.classList.toggle("active-action",this.settings.colorTempBias>.3),this.callbacks.onUpdate(this.settings)};c?.addEventListener("input",()=>{f(parseFloat(c.value))}),u?.addEventListener("click",()=>f(-1)),h?.addEventListener("click",()=>f(0)),d?.addEventListener("click",()=>f(1));const v=this.modal.querySelector("#btnModeShifting"),y=this.modal.querySelector("#btnModeFixed"),P=this.modal.querySelector("#valShiftMode"),C=this.modal.querySelector("#settingShiftSpeed"),M=this.modal.querySelector("#valShiftSpeed");v?.addEventListener("click",()=>{this.settings.paletteShiftMode="shifting",v.classList.add("active-action"),y.classList.remove("active-action"),P.textContent="Dynamic Shifting ↺",this.callbacks.onUpdate(this.settings)}),y?.addEventListener("click",()=>{this.settings.paletteShiftMode="fixed",y.classList.add("active-action"),v.classList.remove("active-action"),P.textContent="Fixed Mood",this.callbacks.onUpdate(this.settings)}),C?.addEventListener("input",()=>{this.settings.paletteShiftSpeed=parseFloat(C.value),M.textContent=`${this.settings.paletteShiftSpeed.toFixed(1)}x`,this.callbacks.onUpdate(this.settings)});const g=this.modal.querySelector("#settingHdr"),T=this.modal.querySelector("#valHdr");g.addEventListener("input",()=>{this.settings.hdrIntensity=parseFloat(g.value),T.textContent=this.settings.hdrIntensity.toFixed(2),this.callbacks.onUpdate(this.settings)});const B=this.modal.querySelector("#chkSmartLights"),m=this.modal.querySelector("#txtSmartLightUrl");B.addEventListener("change",()=>{this.settings.enableSmartLights=B.checked,this.callbacks.onUpdate(this.settings)}),m.addEventListener("change",()=>{this.settings.smartLightWsUrl=m.value,this.callbacks.onUpdate(this.settings)}),this.modal.querySelector("#btnScreenshot")?.addEventListener("click",()=>{this.callbacks.onTakeScreenshot()}),this.modal.querySelector("#btnRecord")?.addEventListener("click",()=>{this.callbacks.onToggleRecording()}),this.modal.querySelector("#btnResetSettings")?.addEventListener("click",()=>{this.callbacks.onReset()}),this.modal.querySelector("#btnTabAudio")?.addEventListener("click",()=>{this.hide(),this.callbacks.onCaptureTab()}),this.modal.querySelector("#btnDemoAudio")?.addEventListener("click",()=>{this.callbacks.onToggleDemo()})}setDevices(e,n){this.deviceSelectEl&&(this.deviceSelectEl.innerHTML="",e.forEach(t=>{const i=document.createElement("option");i.value=t.deviceId,i.textContent=t.label||"Default Audio Device",i.selected=t.deviceId===n,this.deviceSelectEl.appendChild(i)}))}setPreset(e){this.modal.querySelectorAll(".preset-btn").forEach(t=>{t.dataset.preset===e?t.classList.add("active"):t.classList.remove("active")}),this.settings.activePreset=e}updateValues(e){this.settings={...e},this.setPreset(this.settings.activePreset);const n=this.modal.querySelector("#valShiftMode");n&&(n.textContent=this.settings.paletteShiftMode==="fixed"?"Fixed Mood":"Dynamic Shifting ↺");const t=this.modal.querySelector("#settingShiftSpeed"),i=this.modal.querySelector("#valShiftSpeed");t&&i&&(t.value=(this.settings.paletteShiftSpeed??1).toString(),i.textContent=`${(this.settings.paletteShiftSpeed??1).toFixed(1)}x`);const r=this.modal.querySelector("#settingColorTemp"),o=this.modal.querySelector("#valColorTemp");r&&o&&(r.value=(this.settings.colorTempBias??0).toString(),o.textContent=this.getColorTempLabel(this.settings.colorTempBias??0));const a=this.modal.querySelector("#btnTempCool"),c=this.modal.querySelector("#btnTempNeutral"),l=this.modal.querySelector("#btnTempWarm");a?.classList.toggle("active-action",(this.settings.colorTempBias??0)<-.3),c?.classList.toggle("active-action",Math.abs(this.settings.colorTempBias??0)<=.05),l?.classList.toggle("active-action",(this.settings.colorTempBias??0)>.3)}toggle(){this.isOpen?this.hide():this.show()}show(){this.isOpen=!0,this.modal.classList.remove("hidden")}hide(){this.isOpen=!1,this.modal.classList.add("hidden")}getIsOpen(){return this.isOpen}}class Yn{modal;listElement;isOpen=!1;onSelectCallback;constructor(e){this.onSelectCallback=e,this.modal=document.createElement("div"),this.modal.className="modal-backdrop device-modal hidden",this.modal.innerHTML=`
      <div class="modal-card">
        <div class="modal-header">
          <h2>Select Audio Input Device</h2>
          <button class="modal-close-btn" aria-label="Close">&times;</button>
        </div>
        <p class="modal-subtitle">Press <kbd>D</kbd> or <kbd>Esc</kbd> to close. Direct raw input without filtering.</p>
        <div class="device-list" id="deviceList">
          <div class="device-loading">Loading audio devices...</div>
        </div>
      </div>
    `,document.body.appendChild(this.modal),this.listElement=this.modal.querySelector("#deviceList"),this.modal.querySelector(".modal-close-btn")?.addEventListener("click",()=>this.hide()),this.modal.addEventListener("click",t=>{t.target===this.modal&&this.hide()})}setDevices(e,n){if(this.listElement.innerHTML="",e.length===0){this.listElement.innerHTML='<div class="device-empty">No audio input devices found.</div>';return}e.forEach(t=>{const i=document.createElement("button");i.className=`device-item ${t.deviceId===n?"active":""}`,i.innerHTML=`
        <span class="device-icon">🎙️</span>
        <span class="device-name">${t.label||"Default Audio Device"}</span>
        ${t.deviceId===n?'<span class="device-badge">Selected</span>':""}
      `,i.addEventListener("click",()=>{this.onSelectCallback(t.deviceId),this.hide()}),this.listElement.appendChild(i)})}toggle(){this.isOpen?this.hide():this.show()}show(){this.isOpen=!0,this.modal.classList.remove("hidden")}hide(){this.isOpen=!1,this.modal.classList.add("hidden")}getIsOpen(){return this.isOpen}}class Jn{el;isVisible=!1;bpmEl;energyEl;energyBarEl;beatDotEl;dynamicsEl;hueSpreadEl;presetEl;fpsEl;rendererEl;pitchEl;tempEl;harmonicPalEl;dissonanceEl;fluidVelEl;jacobiEl;stripCols;constructor(){this.el=document.createElement("div"),this.el.className="debug-overlay hidden",this.el.innerHTML=`
      <div class="debug-card">
        <div class="debug-header">
          <span class="debug-title">VibeField Telemetry</span>
          <span class="debug-fps" id="dbgFps">60 FPS</span>
        </div>

        <div class="debug-row">
          <div class="debug-label">Tempo / BPM</div>
          <div class="debug-value-box">
            <span class="beat-dot" id="dbgBeatDot"></span>
            <span id="dbgBpm">120 BPM</span>
          </div>
        </div>

        <div class="debug-row">
          <div class="debug-label">Dynamics</div>
          <div class="dynamics-pill" id="dbgDynamics">Steady</div>
        </div>

        <div class="debug-row">
          <div class="debug-label">Energy</div>
          <div class="debug-bar-wrap">
            <div class="debug-bar" id="dbgEnergyBar"></div>
          </div>
          <span class="debug-val" id="dbgEnergy">0.50</span>
        </div>

        <div class="debug-row">
          <div class="debug-label">Color Mood</div>
          <div class="temperature-pill" id="dbgTemp">Cool Gradient</div>
        </div>

        <div class="debug-row">
          <div class="debug-label">Harmonic Palette</div>
          <span class="debug-val" id="dbgHarmonicPalette">30° / 210°</span>
        </div>

        <div class="debug-row">
          <div class="debug-label">Dissonance D_f</div>
          <span class="debug-val" id="dbgDissonance">0.00 (Major)</span>
        </div>

        <div class="debug-row">
          <div class="debug-label">Fluid Velocity</div>
          <span class="debug-val" id="dbgFluidVel">0.15</span>
        </div>

        <div class="debug-row">
          <div class="debug-label">Hue Spread</div>
          <span class="debug-val" id="dbgHueSpread">180°</span>
        </div>

        <div class="debug-row">
          <div class="debug-label">Harmonic Root</div>
          <span class="debug-val" id="dbgPitch">C Major</span>
        </div>

        <div class="debug-row">
          <div class="debug-label">Preset</div>
          <span class="debug-val highlight-val" id="dbgPreset">Auto</span>
        </div>

        <!-- 10-Band Spectrum-to-Hue Firing Strip -->
        <div class="debug-strip-section">
          <div class="strip-header">
            <span>Spectrum-to-Hue Live Firing Strip</span>
          </div>
          <div class="spectrum-hue-strip" id="dbgHueStrip">
            <!-- 10 log bands: violet to pink -->
          </div>
        </div>

        <div class="debug-footer">
          <span id="dbgRenderer">WebGPU (HDR)</span>
          <span id="dbgJacobi">24 Jacobi Passes</span>
        </div>
      </div>
    `,document.body.appendChild(this.el),this.bpmEl=this.el.querySelector("#dbgBpm"),this.energyEl=this.el.querySelector("#dbgEnergy"),this.energyBarEl=this.el.querySelector("#dbgEnergyBar"),this.beatDotEl=this.el.querySelector("#dbgBeatDot"),this.dynamicsEl=this.el.querySelector("#dbgDynamics"),this.hueSpreadEl=this.el.querySelector("#dbgHueSpread"),this.presetEl=this.el.querySelector("#dbgPreset"),this.fpsEl=this.el.querySelector("#dbgFps"),this.rendererEl=this.el.querySelector("#dbgRenderer"),this.pitchEl=this.el.querySelector("#dbgPitch"),this.tempEl=this.el.querySelector("#dbgTemp"),this.harmonicPalEl=this.el.querySelector("#dbgHarmonicPalette"),this.dissonanceEl=this.el.querySelector("#dbgDissonance"),this.fluidVelEl=this.el.querySelector("#dbgFluidVel"),this.jacobiEl=this.el.querySelector("#dbgJacobi");const e=this.el.querySelector("#dbgHueStrip");this.stripCols=[];for(let n=0;n<10;n++){const t=document.createElement("div");t.className="strip-band",t.innerHTML='<div class="strip-fill"></div>',e.appendChild(t),this.stripCols.push(t)}}update(e,n){if(!this.isVisible)return;this.bpmEl.textContent=`${e.bpm} BPM`,this.energyEl.textContent=e.energy.toFixed(2),this.energyBarEl.style.width=`${Math.round(e.energy*100)}%`,e.isBeat?this.beatDotEl.classList.add("pulse"):e.beatIntensity<.2&&this.beatDotEl.classList.remove("pulse"),e.ebbSurge.isSurge?(this.dynamicsEl.textContent="SURGE! 💥",this.dynamicsEl.className="dynamics-pill dynamics-surge"):e.ebbSurge.isEbb?(this.dynamicsEl.textContent="EBB 🌊",this.dynamicsEl.className="dynamics-pill dynamics-ebb"):e.ebbSurge.dynamicsRatio>1.2?(this.dynamicsEl.textContent="Building ▲",this.dynamicsEl.className="dynamics-pill dynamics-build"):(this.dynamicsEl.textContent="Flowing ▬",this.dynamicsEl.className="dynamics-pill"),this.hueSpreadEl.textContent=`${e.hueSpreadDeg}°`,this.presetEl.textContent=n.activePreset||e.activePreset;const t=e.pitchInfo.biasApplied>.05?"Maj":e.pitchInfo.biasApplied<-.05?"Min":"";if(this.pitchEl.textContent=`${e.pitchInfo.pitchName} ${t}`,e.colorTemperature&&this.tempEl&&(this.tempEl.textContent=e.colorTemperature.description,this.tempEl.className=e.colorTemperature.isWarm?"temperature-pill temp-warm":"temperature-pill temp-cold"),e.harmonicLiquid){const i=e.harmonicLiquid;if(this.harmonicPalEl&&(this.harmonicPalEl.textContent=`${Math.round(i.dominantHue)}° / ${Math.round(i.complementaryHue)}°`),this.dissonanceEl){const r=i.musicalMode==="major"?"Major":i.musicalMode==="minor"?"Minor":"Tense";this.dissonanceEl.textContent=`${i.dissonanceFactor.toFixed(2)} (${r})`}if(this.fluidVelEl){const r=i.isBurst?` (Burst ${(i.burstIntensity*100).toFixed(0)}%)`:"";this.fluidVelEl.textContent=`${i.fluidVelocity.toFixed(2)}${r}`}}this.fpsEl.textContent=`${n.fps} FPS`,this.rendererEl.textContent=`${n.rendererType} [${n.colorSpace}]`,this.jacobiEl&&(this.jacobiEl.textContent=n.jacobiIterations>0?`${n.jacobiIterations} Jacobi Passes`:"Soft-Light Convective Pass");for(let i=0;i<10;i++){const r=e.spectrumBands[i];if(r&&this.stripCols[i]){const o=this.stripCols[i].querySelector(".strip-fill"),a=Math.round(r.effectiveHue);o.style.backgroundColor=`hsl(${a}, 90%, ${Math.round(r.lightness*65)}%)`,o.style.height=`${Math.min(100,Math.round(r.amplitude*100))}%`,o.style.boxShadow=r.amplitude>.4?`0 0 8px hsl(${a}, 90%, 60%)`:"none"}}}toggle(){this.isVisible=!this.isVisible,this.isVisible?this.el.classList.remove("hidden"):this.el.classList.add("hidden")}show(){this.isVisible=!0,this.el.classList.remove("hidden")}hide(){this.isVisible=!1,this.el.classList.add("hidden")}}class Qn{canvas;mediaRecorder=null;recordedChunks=[];isRecording=!1;recordTimeout=null;onNotify;constructor(e,n){this.canvas=e,this.onNotify=n}takeScreenshot(){try{const e=this.canvas.toDataURL("image/png"),n=document.createElement("a"),t=new Date().toISOString().replace(/[:.]/g,"-");n.download=`vibefield-${t}.png`,n.href=e,document.body.appendChild(n),n.click(),document.body.removeChild(n),this.onNotify("Screenshot saved to Downloads (S)","success")}catch(e){this.onNotify(`Screenshot failed: ${e.message}`,"error")}}toggleRecording(){this.isRecording?this.stopRecording():this.startRecording(30)}startRecording(e=30){if(!this.isRecording)try{const n=this.canvas.captureStream(60);let t="video/webm;codecs=vp9";MediaRecorder.isTypeSupported(t)||(t="video/webm;codecs=vp8"),MediaRecorder.isTypeSupported(t)||(t="video/webm"),this.mediaRecorder=new MediaRecorder(n,{mimeType:t,videoBitsPerSecond:16e6}),this.recordedChunks=[],this.mediaRecorder.ondataavailable=i=>{i.data&&i.data.size>0&&this.recordedChunks.push(i.data)},this.mediaRecorder.onstop=()=>{this.saveVideo()},this.mediaRecorder.start(100),this.isRecording=!0,this.onNotify(`Recording started (${e}s limit, press R to stop)`,"info"),this.recordTimeout=window.setTimeout(()=>{this.isRecording&&this.stopRecording()},e*1e3)}catch(n){this.onNotify(`Recording error: ${n.message}`,"error")}}stopRecording(){!this.isRecording||!this.mediaRecorder||(this.isRecording=!1,this.recordTimeout!==null&&(window.clearTimeout(this.recordTimeout),this.recordTimeout=null),this.mediaRecorder.state!=="inactive"&&this.mediaRecorder.stop())}saveVideo(){if(this.recordedChunks.length===0)return;const e=new Blob(this.recordedChunks,{type:"video/webm"}),n=URL.createObjectURL(e),t=document.createElement("a"),i=new Date().toISOString().replace(/[:.]/g,"-");t.download=`vibefield-${i}.webm`,t.href=n,document.body.appendChild(t),t.click(),document.body.removeChild(t),setTimeout(()=>URL.revokeObjectURL(n),2e3),this.onNotify("Video saved to Downloads (R)","success")}getIsRecording(){return this.isRecording}}class Zn{ws=null;url="ws://localhost:8080/wled";isEnabled=!1;lastBroadcastTime=0;broadcastIntervalMs=100;isConnected=!1;retryTimer=null;constructor(e="ws://localhost:8080/wled",n=!1){this.url=e,this.isEnabled=n,this.isEnabled&&this.connect()}setEnabled(e){this.isEnabled=e,e&&!this.ws?this.connect():!e&&this.ws&&this.disconnect()}setUrl(e){this.url!==e&&(this.url=e,this.isEnabled&&(this.disconnect(),this.connect()))}getIsConnected(){return this.isConnected}connect(){if(!(this.ws||!this.isEnabled))try{this.ws=new WebSocket(this.url),this.ws.onopen=()=>{this.isConnected=!0,console.log(`[SmartLight] Connected to ${this.url}`)},this.ws.onclose=()=>{this.isConnected=!1,this.ws=null,this.isEnabled&&(this.retryTimer=window.setTimeout(()=>this.connect(),5e3))},this.ws.onerror=()=>{this.isConnected=!1}}catch{this.isConnected=!1,this.ws=null}}disconnect(){if(this.retryTimer!==null&&(window.clearTimeout(this.retryTimer),this.retryTimer=null),this.ws){try{this.ws.close()}catch{}this.ws=null}this.isConnected=!1}update(e){if(!this.isEnabled||!this.isConnected||!this.ws)return;const n=performance.now();if(n-this.lastBroadcastTime<this.broadcastIntervalMs)return;this.lastBroadcastTime=n;const t=e.dominantColor,i={timestamp:Date.now(),r:Math.round(Math.min(255,t.r*255)),g:Math.round(Math.min(255,t.g*255)),b:Math.round(Math.min(255,t.b*255)),hex:t.hex,brightness:Math.round(Math.min(255,t.lightness*255)),bpm:e.bpm,energy:e.energy,isBeat:e.isBeat,activePreset:e.activePreset};try{this.ws.send(JSON.stringify(i))}catch{}}dispose(){this.disconnect()}}class es{constructor(){this.encoder=new TextEncoder,this._pieces=[],this._parts=[]}append_buffer(e){this.flush(),this._parts.push(e)}append(e){this._pieces.push(e)}flush(){if(this._pieces.length>0){const e=new Uint8Array(this._pieces);this._parts.push(e),this._pieces=[]}}toArrayBuffer(){const e=[];for(const n of this._parts)e.push(n);return ts(e).buffer}}function ts(s){let e=0;for(const i of s)e+=i.byteLength;const n=new Uint8Array(e);let t=0;for(const i of s){const r=new Uint8Array(i.buffer,i.byteOffset,i.byteLength);n.set(r,t),t+=i.byteLength}return n}function Ci(s){return new is(s).unpack()}function Ti(s){const e=new ns,n=e.pack(s);return n instanceof Promise?n.then(()=>e.getBuffer()):e.getBuffer()}class is{constructor(e){this.index=0,this.dataBuffer=e,this.dataView=new Uint8Array(this.dataBuffer),this.length=this.dataBuffer.byteLength}unpack(){const e=this.unpack_uint8();if(e<128)return e;if((e^224)<32)return(e^224)-32;let n;if((n=e^160)<=15)return this.unpack_raw(n);if((n=e^176)<=15)return this.unpack_string(n);if((n=e^144)<=15)return this.unpack_array(n);if((n=e^128)<=15)return this.unpack_map(n);switch(e){case 192:return null;case 193:return;case 194:return!1;case 195:return!0;case 202:return this.unpack_float();case 203:return this.unpack_double();case 204:return this.unpack_uint8();case 205:return this.unpack_uint16();case 206:return this.unpack_uint32();case 207:return this.unpack_uint64();case 208:return this.unpack_int8();case 209:return this.unpack_int16();case 210:return this.unpack_int32();case 211:return this.unpack_int64();case 212:return;case 213:return;case 214:return;case 215:return;case 216:return n=this.unpack_uint16(),this.unpack_string(n);case 217:return n=this.unpack_uint32(),this.unpack_string(n);case 218:return n=this.unpack_uint16(),this.unpack_raw(n);case 219:return n=this.unpack_uint32(),this.unpack_raw(n);case 220:return n=this.unpack_uint16(),this.unpack_array(n);case 221:return n=this.unpack_uint32(),this.unpack_array(n);case 222:return n=this.unpack_uint16(),this.unpack_map(n);case 223:return n=this.unpack_uint32(),this.unpack_map(n)}}unpack_uint8(){const e=this.dataView[this.index]&255;return this.index++,e}unpack_uint16(){const e=this.read(2),n=(e[0]&255)*256+(e[1]&255);return this.index+=2,n}unpack_uint32(){const e=this.read(4),n=((e[0]*256+e[1])*256+e[2])*256+e[3];return this.index+=4,n}unpack_uint64(){const e=this.read(8),n=((((((e[0]*256+e[1])*256+e[2])*256+e[3])*256+e[4])*256+e[5])*256+e[6])*256+e[7];return this.index+=8,n}unpack_int8(){const e=this.unpack_uint8();return e<128?e:e-256}unpack_int16(){const e=this.unpack_uint16();return e<32768?e:e-65536}unpack_int32(){const e=this.unpack_uint32();return e<2**31?e:e-2**32}unpack_int64(){const e=this.unpack_uint64();return e<2**63?e:e-2**64}unpack_raw(e){if(this.length<this.index+e)throw new Error(`BinaryPackFailure: index is out of range ${this.index} ${e} ${this.length}`);const n=this.dataBuffer.slice(this.index,this.index+e);return this.index+=e,n}unpack_string(e){const n=this.read(e);let t=0,i="",r,o;for(;t<e;)r=n[t],r<160?(o=r,t++):(r^192)<32?(o=(r&31)<<6|n[t+1]&63,t+=2):(r^224)<16?(o=(r&15)<<12|(n[t+1]&63)<<6|n[t+2]&63,t+=3):(o=(r&7)<<18|(n[t+1]&63)<<12|(n[t+2]&63)<<6|n[t+3]&63,t+=4),i+=String.fromCodePoint(o);return this.index+=e,i}unpack_array(e){const n=new Array(e);for(let t=0;t<e;t++)n[t]=this.unpack();return n}unpack_map(e){const n={};for(let t=0;t<e;t++){const i=this.unpack();n[i]=this.unpack()}return n}unpack_float(){const e=this.unpack_uint32(),n=e>>31,t=(e>>23&255)-127,i=e&8388607|8388608;return(n===0?1:-1)*i*2**(t-23)}unpack_double(){const e=this.unpack_uint32(),n=this.unpack_uint32(),t=e>>31,i=(e>>20&2047)-1023,o=(e&1048575|1048576)*2**(i-20)+n*2**(i-52);return(t===0?1:-1)*o}read(e){const n=this.index;if(n+e<=this.length)return this.dataView.subarray(n,n+e);throw new Error("BinaryPackFailure: read index out of range")}}class ns{getBuffer(){return this._bufferBuilder.toArrayBuffer()}pack(e){if(typeof e=="string")this.pack_string(e);else if(typeof e=="number")Math.floor(e)===e?this.pack_integer(e):this.pack_double(e);else if(typeof e=="boolean")e===!0?this._bufferBuilder.append(195):e===!1&&this._bufferBuilder.append(194);else if(e===void 0)this._bufferBuilder.append(192);else if(typeof e=="object")if(e===null)this._bufferBuilder.append(192);else{const n=e.constructor;if(e instanceof Array){const t=this.pack_array(e);if(t instanceof Promise)return t.then(()=>this._bufferBuilder.flush())}else if(e instanceof ArrayBuffer)this.pack_bin(new Uint8Array(e));else if("BYTES_PER_ELEMENT"in e){const t=e;this.pack_bin(new Uint8Array(t.buffer,t.byteOffset,t.byteLength))}else if(e instanceof Date)this.pack_string(e.toString());else{if(e instanceof Blob)return e.arrayBuffer().then(t=>{this.pack_bin(new Uint8Array(t)),this._bufferBuilder.flush()});if(n==Object||n.toString().startsWith("class")){const t=this.pack_object(e);if(t instanceof Promise)return t.then(()=>this._bufferBuilder.flush())}else throw new Error(`Type "${n.toString()}" not yet supported`)}}else throw new Error(`Type "${typeof e}" not yet supported`);this._bufferBuilder.flush()}pack_bin(e){const n=e.length;if(n<=15)this.pack_uint8(160+n);else if(n<=65535)this._bufferBuilder.append(218),this.pack_uint16(n);else if(n<=4294967295)this._bufferBuilder.append(219),this.pack_uint32(n);else throw new Error("Invalid length");this._bufferBuilder.append_buffer(e)}pack_string(e){const n=this._textEncoder.encode(e),t=n.length;if(t<=15)this.pack_uint8(176+t);else if(t<=65535)this._bufferBuilder.append(216),this.pack_uint16(t);else if(t<=4294967295)this._bufferBuilder.append(217),this.pack_uint32(t);else throw new Error("Invalid length");this._bufferBuilder.append_buffer(n)}pack_array(e){const n=e.length;if(n<=15)this.pack_uint8(144+n);else if(n<=65535)this._bufferBuilder.append(220),this.pack_uint16(n);else if(n<=4294967295)this._bufferBuilder.append(221),this.pack_uint32(n);else throw new Error("Invalid length");const t=i=>{if(i<n){const r=this.pack(e[i]);return r instanceof Promise?r.then(()=>t(i+1)):t(i+1)}};return t(0)}pack_integer(e){if(e>=-32&&e<=127)this._bufferBuilder.append(e&255);else if(e>=0&&e<=255)this._bufferBuilder.append(204),this.pack_uint8(e);else if(e>=-128&&e<=127)this._bufferBuilder.append(208),this.pack_int8(e);else if(e>=0&&e<=65535)this._bufferBuilder.append(205),this.pack_uint16(e);else if(e>=-32768&&e<=32767)this._bufferBuilder.append(209),this.pack_int16(e);else if(e>=0&&e<=4294967295)this._bufferBuilder.append(206),this.pack_uint32(e);else if(e>=-2147483648&&e<=2147483647)this._bufferBuilder.append(210),this.pack_int32(e);else if(e>=-9223372036854776e3&&e<=9223372036854776e3)this._bufferBuilder.append(211),this.pack_int64(e);else if(e>=0&&e<=18446744073709552e3)this._bufferBuilder.append(207),this.pack_uint64(e);else throw new Error("Invalid integer")}pack_double(e){let n=0;e<0&&(n=1,e=-e);const t=Math.floor(Math.log(e)/Math.LN2),i=e/2**t-1,r=Math.floor(i*2**52),o=2**32,a=n<<31|t+1023<<20|r/o&1048575,c=r%o;this._bufferBuilder.append(203),this.pack_int32(a),this.pack_int32(c)}pack_object(e){const n=Object.keys(e),t=n.length;if(t<=15)this.pack_uint8(128+t);else if(t<=65535)this._bufferBuilder.append(222),this.pack_uint16(t);else if(t<=4294967295)this._bufferBuilder.append(223),this.pack_uint32(t);else throw new Error("Invalid length");const i=r=>{if(r<n.length){const o=n[r];if(e.hasOwnProperty(o)){this.pack(o);const a=this.pack(e[o]);if(a instanceof Promise)return a.then(()=>i(r+1))}return i(r+1)}};return i(0)}pack_uint8(e){this._bufferBuilder.append(e)}pack_uint16(e){this._bufferBuilder.append(e>>8),this._bufferBuilder.append(e&255)}pack_uint32(e){const n=e&4294967295;this._bufferBuilder.append((n&4278190080)>>>24),this._bufferBuilder.append((n&16711680)>>>16),this._bufferBuilder.append((n&65280)>>>8),this._bufferBuilder.append(n&255)}pack_uint64(e){const n=e/4294967296,t=e%2**32;this._bufferBuilder.append((n&4278190080)>>>24),this._bufferBuilder.append((n&16711680)>>>16),this._bufferBuilder.append((n&65280)>>>8),this._bufferBuilder.append(n&255),this._bufferBuilder.append((t&4278190080)>>>24),this._bufferBuilder.append((t&16711680)>>>16),this._bufferBuilder.append((t&65280)>>>8),this._bufferBuilder.append(t&255)}pack_int8(e){this._bufferBuilder.append(e&255)}pack_int16(e){this._bufferBuilder.append((e&65280)>>8),this._bufferBuilder.append(e&255)}pack_int32(e){this._bufferBuilder.append(e>>>24&255),this._bufferBuilder.append((e&16711680)>>>16),this._bufferBuilder.append((e&65280)>>>8),this._bufferBuilder.append(e&255)}pack_int64(e){const n=Math.floor(e/4294967296),t=e%2**32;this._bufferBuilder.append((n&4278190080)>>>24),this._bufferBuilder.append((n&16711680)>>>16),this._bufferBuilder.append((n&65280)>>>8),this._bufferBuilder.append(n&255),this._bufferBuilder.append((t&4278190080)>>>24),this._bufferBuilder.append((t&16711680)>>>16),this._bufferBuilder.append((t&65280)>>>8),this._bufferBuilder.append(t&255)}constructor(){this._bufferBuilder=new es,this._textEncoder=new TextEncoder}}let _i=!0,Ri=!0;function Me(s,e,n){const t=s.match(e);return t&&t.length>=n&&parseFloat(t[n],10)}function ge(s,e,n){if(!s.RTCPeerConnection)return;if(!Object.getOwnPropertyDescriptor(EventTarget.prototype,"addEventListener").writable){Rt("Unable to polyfill events");return}const i=s.RTCPeerConnection.prototype,r=i.addEventListener;i.addEventListener=function(a,c){if(a!==e)return r.apply(this,arguments);const l=u=>{const h=n(u);h&&(c.handleEvent?c.handleEvent(h):c(h))};return this._eventMap=this._eventMap||{},this._eventMap[e]||(this._eventMap[e]=new Map),this._eventMap[e].set(c,l),r.apply(this,[a,l])};const o=i.removeEventListener;i.removeEventListener=function(a,c){if(a!==e||!this._eventMap||!this._eventMap[e])return o.apply(this,arguments);if(!this._eventMap[e].has(c))return o.apply(this,arguments);const l=this._eventMap[e].get(c);return this._eventMap[e].delete(c),this._eventMap[e].size===0&&delete this._eventMap[e],Object.keys(this._eventMap).length===0&&delete this._eventMap,o.apply(this,[a,l])},Object.defineProperty(i,"on"+e,{get(){return this["_on"+e]},set(a){this["_on"+e]&&(this.removeEventListener(e,this["_on"+e]),delete this["_on"+e]),a&&this.addEventListener(e,this["_on"+e]=a)},enumerable:!0,configurable:!0})}function ss(s){return typeof s!="boolean"?new Error("Argument type: "+typeof s+". Please use a boolean."):(_i=s,s?"adapter.js logging disabled":"adapter.js logging enabled")}function rs(s){return typeof s!="boolean"?new Error("Argument type: "+typeof s+". Please use a boolean."):(Ri=!s,"adapter.js deprecation warnings "+(s?"disabled":"enabled"))}function Rt(){if(typeof window=="object"){if(_i)return;typeof console<"u"&&typeof console.log=="function"&&console.log.apply(console,arguments)}}function Et(s,e){Ri&&console.warn(s+" is deprecated, please use "+e+" instead.")}function os(s){const e={browser:null,version:null};if(typeof s>"u"||!s.navigator||!s.navigator.userAgent)return e.browser="Not a browser.",e;const{navigator:n}=s;if(n.userAgentData&&n.userAgentData.brands){const t=n.userAgentData.brands.find(i=>i.brand==="Chromium");if(t){const i=parseInt(t.version,10);if(i>=90)return{browser:"chrome",version:i}}}if(n.mozGetUserMedia)e.browser="firefox",e.version=parseInt(Me(n.userAgent,/Firefox\/(\d+)\./,1));else if(n.webkitGetUserMedia||s.isSecureContext===!1&&s.webkitRTCPeerConnection)e.browser="chrome",e.version=parseInt(Me(n.userAgent,/Chrom(e|ium)\/(\d+)\./,2))||null;else if(s.RTCPeerConnection&&n.userAgent.match(/AppleWebKit\/(\d+)\./))e.browser="safari",e.version=parseInt(Me(n.userAgent,/AppleWebKit\/(\d+)\./,1)),e.supportsUnifiedPlan=s.RTCRtpTransceiver&&"currentDirection"in s.RTCRtpTransceiver.prototype,e._safariVersion=Me(n.userAgent,/Version\/(\d+(\.?\d+))/,1);else return e.browser="Not a supported browser.",e;return e}function It(s){return Object.prototype.toString.call(s)==="[object Object]"}function Ei(s){return It(s)?Object.keys(s).reduce(function(e,n){const t=It(s[n]),i=t?Ei(s[n]):s[n],r=t&&!Object.keys(i).length;return i===void 0||r?e:Object.assign(e,{[n]:i})},{}):s}function mt(s,e,n){!e||n.has(e.id)||(n.set(e.id,e),Object.keys(e).forEach(t=>{t.endsWith("Id")?mt(s,s.get(e[t]),n):t.endsWith("Ids")&&e[t].forEach(i=>{mt(s,s.get(i),n)})}))}function Ft(s,e,n){const t=n?"outbound-rtp":"inbound-rtp",i=new Map;if(e===null)return i;const r=[];return s.forEach(o=>{o.type==="track"&&o.trackIdentifier===e.id&&r.push(o)}),r.forEach(o=>{s.forEach(a=>{a.type===t&&a.trackId===o.id&&mt(s,a,i)})}),i}const Vt=Rt;function Mi(s,e){if(e.version>=64)return;const n=s&&s.navigator;if(!n.mediaDevices)return;const t=function(a){if(typeof a!="object"||a.mandatory||a.optional)return a;const c={};return Object.keys(a).forEach(l=>{if(l==="require"||l==="advanced"||l==="mediaSource")return;const u=typeof a[l]=="object"?a[l]:{ideal:a[l]};u.exact!==void 0&&typeof u.exact=="number"&&(u.min=u.max=u.exact);const h=function(d,f){return d?d+f.charAt(0).toUpperCase()+f.slice(1):f==="deviceId"?"sourceId":f};if(u.ideal!==void 0){c.optional=c.optional||[];let d={};typeof u.ideal=="number"?(d[h("min",l)]=u.ideal,c.optional.push(d),d={},d[h("max",l)]=u.ideal,c.optional.push(d)):(d[h("",l)]=u.ideal,c.optional.push(d))}u.exact!==void 0&&typeof u.exact!="number"?(c.mandatory=c.mandatory||{},c.mandatory[h("",l)]=u.exact):["min","max"].forEach(d=>{u[d]!==void 0&&(c.mandatory=c.mandatory||{},c.mandatory[h(d,l)]=u[d])})}),a.advanced&&(c.optional=(c.optional||[]).concat(a.advanced)),c},i=function(a,c){if(e.version>=61)return c(a);if(a=JSON.parse(JSON.stringify(a)),a&&typeof a.audio=="object"){const l=function(u,h,d){h in u&&!(d in u)&&(u[d]=u[h],delete u[h])};a=JSON.parse(JSON.stringify(a)),l(a.audio,"autoGainControl","googAutoGainControl"),l(a.audio,"noiseSuppression","googNoiseSuppression"),a.audio=t(a.audio)}if(a&&typeof a.video=="object"){let l=a.video.facingMode;l=l&&(typeof l=="object"?l:{ideal:l});const u=e.version<66;if(l&&(l.exact==="user"||l.exact==="environment"||l.ideal==="user"||l.ideal==="environment")&&!(n.mediaDevices.getSupportedConstraints&&n.mediaDevices.getSupportedConstraints().facingMode&&!u)){delete a.video.facingMode;let h;if(l.exact==="environment"||l.ideal==="environment"?h=["back","rear"]:(l.exact==="user"||l.ideal==="user")&&(h=["front"]),h)return n.mediaDevices.enumerateDevices().then(d=>{d=d.filter(v=>v.kind==="videoinput");let f=d.find(v=>h.some(y=>v.label.toLowerCase().includes(y)));return!f&&d.length&&h.includes("back")&&(f=d[d.length-1]),f&&(a.video.deviceId=l.exact?{exact:f.deviceId}:{ideal:f.deviceId}),a.video=t(a.video),Vt("chrome: "+JSON.stringify(a)),c(a)})}a.video=t(a.video)}return Vt("chrome: "+JSON.stringify(a)),c(a)},r=function(a){return e.version>=64?a:{name:{PermissionDeniedError:"NotAllowedError",PermissionDismissedError:"NotAllowedError",InvalidStateError:"NotAllowedError",DevicesNotFoundError:"NotFoundError",ConstraintNotSatisfiedError:"OverconstrainedError",TrackStartError:"NotReadableError",MediaDeviceFailedDueToShutdown:"NotAllowedError",MediaDeviceKillSwitchOn:"NotAllowedError",TabCaptureError:"AbortError",ScreenCaptureError:"AbortError",DeviceCaptureError:"AbortError"}[a.name]||a.name,message:a.message,constraint:a.constraint||a.constraintName,toString(){return this.name+(this.message&&": ")+this.message}}},o=function(a,c,l){i(a,u=>{n.webkitGetUserMedia(u,c,h=>{l&&l(r(h))})})};if(n.getUserMedia=o.bind(n),n.mediaDevices.getUserMedia){const a=n.mediaDevices.getUserMedia.bind(n.mediaDevices);n.mediaDevices.getUserMedia=function(c){return i(c,l=>a(l).then(u=>{if(l.audio&&!u.getAudioTracks().length||l.video&&!u.getVideoTracks().length)throw u.getTracks().forEach(h=>{h.stop()}),new DOMException("","NotFoundError");return u},u=>Promise.reject(r(u))))}}}function Pi(s){s.MediaStream=s.MediaStream||s.webkitMediaStream}function ki(s,e){if(!(e.version>102))if(typeof s=="object"&&s.RTCPeerConnection&&!("ontrack"in s.RTCPeerConnection.prototype)){Object.defineProperty(s.RTCPeerConnection.prototype,"ontrack",{get(){return this._ontrack},set(t){this._ontrack&&this.removeEventListener("track",this._ontrack),this.addEventListener("track",this._ontrack=t)},enumerable:!0,configurable:!0});const n=s.RTCPeerConnection.prototype.setRemoteDescription;s.RTCPeerConnection.prototype.setRemoteDescription=function(){return this._ontrackpoly||(this._ontrackpoly=i=>{i.stream.addEventListener("addtrack",r=>{let o;s.RTCPeerConnection.prototype.getReceivers?o=this.getReceivers().find(c=>c.track&&c.track.id===r.track.id):o={track:r.track};const a=new Event("track");a.track=r.track,a.receiver=o,a.transceiver={receiver:o},a.streams=[i.stream],this.dispatchEvent(a)}),i.stream.getTracks().forEach(r=>{let o;s.RTCPeerConnection.prototype.getReceivers?o=this.getReceivers().find(c=>c.track&&c.track.id===r.id):o={track:r};const a=new Event("track");a.track=r,a.receiver=o,a.transceiver={receiver:o},a.streams=[i.stream],this.dispatchEvent(a)})},this.addEventListener("addstream",this._ontrackpoly)),n.apply(this,arguments)}}else ge(s,"track",n=>(n.transceiver||Object.defineProperty(n,"transceiver",{value:{receiver:n.receiver}}),n))}function Li(s){if(typeof s=="object"&&s.RTCPeerConnection&&!("getSenders"in s.RTCPeerConnection.prototype)&&"createDTMFSender"in s.RTCPeerConnection.prototype){const e=function(i,r){return{track:r,get dtmf(){return this._dtmf===void 0&&(r.kind==="audio"?this._dtmf=i.createDTMFSender(r):this._dtmf=null),this._dtmf},_pc:i}};if(!s.RTCPeerConnection.prototype.getSenders){s.RTCPeerConnection.prototype.getSenders=function(){return this._senders=this._senders||[],this._senders.slice()};const i=s.RTCPeerConnection.prototype.addTrack;s.RTCPeerConnection.prototype.addTrack=function(a,c){let l=i.apply(this,arguments);return l||(l=e(this,a),this._senders.push(l)),l};const r=s.RTCPeerConnection.prototype.removeTrack;s.RTCPeerConnection.prototype.removeTrack=function(a){r.apply(this,arguments);const c=this._senders.indexOf(a);c!==-1&&this._senders.splice(c,1)}}const n=s.RTCPeerConnection.prototype.addStream;s.RTCPeerConnection.prototype.addStream=function(r){this._senders=this._senders||[],n.apply(this,[r]),r.getTracks().forEach(o=>{this._senders.push(e(this,o))})};const t=s.RTCPeerConnection.prototype.removeStream;s.RTCPeerConnection.prototype.removeStream=function(r){this._senders=this._senders||[],t.apply(this,[r]),r.getTracks().forEach(o=>{const a=this._senders.find(c=>c.track===o);a&&this._senders.splice(this._senders.indexOf(a),1)})}}else if(typeof s=="object"&&s.RTCPeerConnection&&"getSenders"in s.RTCPeerConnection.prototype&&"createDTMFSender"in s.RTCPeerConnection.prototype&&s.RTCRtpSender&&!("dtmf"in s.RTCRtpSender.prototype)){const e=s.RTCPeerConnection.prototype.getSenders;s.RTCPeerConnection.prototype.getSenders=function(){const t=e.apply(this,[]);return t.forEach(i=>i._pc=this),t},Object.defineProperty(s.RTCRtpSender.prototype,"dtmf",{get(){return this._dtmf===void 0&&(this.track.kind==="audio"?this._dtmf=this._pc.createDTMFSender(this.track):this._dtmf=null),this._dtmf}})}}function Di(s,e){if(e.version>=67||!(typeof s=="object"&&s.RTCPeerConnection&&s.RTCRtpSender&&s.RTCRtpReceiver))return;if(!("getStats"in s.RTCRtpSender.prototype)){const t=s.RTCPeerConnection.prototype.getSenders;t&&(s.RTCPeerConnection.prototype.getSenders=function(){const o=t.apply(this,[]);return o.forEach(a=>a._pc=this),o});const i=s.RTCPeerConnection.prototype.addTrack;i&&(s.RTCPeerConnection.prototype.addTrack=function(){const o=i.apply(this,arguments);return o._pc=this,o}),s.RTCRtpSender.prototype.getStats=function(){const o=this;return this._pc.getStats().then(a=>Ft(a,o.track,!0))}}if(!("getStats"in s.RTCRtpReceiver.prototype)){const t=s.RTCPeerConnection.prototype.getReceivers;t&&(s.RTCPeerConnection.prototype.getReceivers=function(){const r=t.apply(this,[]);return r.forEach(o=>o._pc=this),r}),ge(s,"track",i=>(i.receiver._pc=i.srcElement,i)),s.RTCRtpReceiver.prototype.getStats=function(){const r=this;return this._pc.getStats().then(o=>Ft(o,r.track,!1))}}if(!("getStats"in s.RTCRtpSender.prototype&&"getStats"in s.RTCRtpReceiver.prototype))return;const n=s.RTCPeerConnection.prototype.getStats;s.RTCPeerConnection.prototype.getStats=function(){if(arguments.length>0&&arguments[0]instanceof s.MediaStreamTrack){const i=arguments[0];let r,o,a;return this.getSenders().forEach(c=>{c.track===i&&(r?a=!0:r=c)}),this.getReceivers().forEach(c=>(c.track===i&&(o?a=!0:o=c),c.track===i)),a||r&&o?Promise.reject(new DOMException("There are more than one sender or receiver for the track.","InvalidAccessError")):r?r.getStats():o?o.getStats():Promise.reject(new DOMException("There is no sender or receiver for the track.","InvalidAccessError"))}return n.apply(this,arguments)}}function Bi(s){s.RTCPeerConnection.prototype.getLocalStreams=function(){return this._shimmedLocalStreams=this._shimmedLocalStreams||{},Object.keys(this._shimmedLocalStreams).map(o=>this._shimmedLocalStreams[o][0])};const e=s.RTCPeerConnection.prototype.addTrack;s.RTCPeerConnection.prototype.addTrack=function(o,a){if(!a)return e.apply(this,arguments);this._shimmedLocalStreams=this._shimmedLocalStreams||{};const c=e.apply(this,arguments);return this._shimmedLocalStreams[a.id]?this._shimmedLocalStreams[a.id].indexOf(c)===-1&&this._shimmedLocalStreams[a.id].push(c):this._shimmedLocalStreams[a.id]=[a,c],c};const n=s.RTCPeerConnection.prototype.addStream;s.RTCPeerConnection.prototype.addStream=function(o){this._shimmedLocalStreams=this._shimmedLocalStreams||{},o.getTracks().forEach(l=>{if(this.getSenders().find(h=>h.track===l))throw new DOMException("Track already exists.","InvalidAccessError")});const a=this.getSenders();n.apply(this,arguments);const c=this.getSenders().filter(l=>a.indexOf(l)===-1);this._shimmedLocalStreams[o.id]=[o].concat(c)};const t=s.RTCPeerConnection.prototype.removeStream;s.RTCPeerConnection.prototype.removeStream=function(o){return this._shimmedLocalStreams=this._shimmedLocalStreams||{},delete this._shimmedLocalStreams[o.id],t.apply(this,arguments)};const i=s.RTCPeerConnection.prototype.removeTrack;s.RTCPeerConnection.prototype.removeTrack=function(o){return this._shimmedLocalStreams=this._shimmedLocalStreams||{},o&&Object.keys(this._shimmedLocalStreams).forEach(a=>{const c=this._shimmedLocalStreams[a].indexOf(o);c!==-1&&this._shimmedLocalStreams[a].splice(c,1),this._shimmedLocalStreams[a].length===1&&delete this._shimmedLocalStreams[a]}),i.apply(this,arguments)}}function Ai(s,e){if(!s.RTCPeerConnection)return;if(s.RTCPeerConnection.prototype.addTrack&&e.version>=65)return Bi(s);const n=s.RTCPeerConnection.prototype.getLocalStreams;s.RTCPeerConnection.prototype.getLocalStreams=function(){const u=n.apply(this);return this._reverseStreams=this._reverseStreams||{},u.map(h=>this._reverseStreams[h.id])};const t=s.RTCPeerConnection.prototype.addStream;s.RTCPeerConnection.prototype.addStream=function(u){if(this._streams=this._streams||{},this._reverseStreams=this._reverseStreams||{},u.getTracks().forEach(h=>{if(this.getSenders().find(f=>f.track===h))throw new DOMException("Track already exists.","InvalidAccessError")}),!this._reverseStreams[u.id]){const h=new s.MediaStream(u.getTracks());this._streams[u.id]=h,this._reverseStreams[h.id]=u,u=h}t.apply(this,[u])};const i=s.RTCPeerConnection.prototype.removeStream;s.RTCPeerConnection.prototype.removeStream=function(u){this._streams=this._streams||{},this._reverseStreams=this._reverseStreams||{},i.apply(this,[this._streams[u.id]||u]),delete this._reverseStreams[this._streams[u.id]?this._streams[u.id].id:u.id],delete this._streams[u.id]},s.RTCPeerConnection.prototype.addTrack=function(u,h){if(this.signalingState==="closed")throw new DOMException("The RTCPeerConnection's signalingState is 'closed'.","InvalidStateError");const d=[].slice.call(arguments,1);if(d.length!==1||!d[0].getTracks().find(y=>y===u))throw new DOMException("The adapter.js addTrack polyfill only supports a single  stream which is associated with the specified track.","NotSupportedError");if(this.getSenders().find(y=>y.track===u))throw new DOMException("Track already exists.","InvalidAccessError");this._streams=this._streams||{},this._reverseStreams=this._reverseStreams||{};const v=this._streams[h.id];if(v)v.addTrack(u),Promise.resolve().then(()=>{this.dispatchEvent(new Event("negotiationneeded"))});else{const y=new s.MediaStream([u]);this._streams[h.id]=y,this._reverseStreams[y.id]=h,this.addStream(y)}return this.getSenders().find(y=>y.track===u)};function r(l,u){let h=u.sdp;return Object.keys(l._reverseStreams||[]).forEach(d=>{const f=l._reverseStreams[d],v=l._streams[f.id];h=h.replace(new RegExp(v.id,"g"),f.id)}),new RTCSessionDescription({type:u.type,sdp:h})}function o(l,u){let h=u.sdp;return Object.keys(l._reverseStreams||[]).forEach(d=>{const f=l._reverseStreams[d],v=l._streams[f.id];h=h.replace(new RegExp(f.id,"g"),v.id)}),new RTCSessionDescription({type:u.type,sdp:h})}["createOffer","createAnswer"].forEach(function(l){const u=s.RTCPeerConnection.prototype[l],h={[l](){const d=arguments;return arguments.length&&typeof arguments[0]=="function"?u.apply(this,[v=>{const y=r(this,v);d[0].apply(null,[y])},v=>{d[1]&&d[1].apply(null,v)},arguments[2]]):u.apply(this,arguments).then(v=>r(this,v))}};s.RTCPeerConnection.prototype[l]=h[l]});const a=s.RTCPeerConnection.prototype.setLocalDescription;s.RTCPeerConnection.prototype.setLocalDescription=function(){return!arguments.length||!arguments[0].type?a.apply(this,arguments):(arguments[0]=o(this,arguments[0]),a.apply(this,arguments))};const c=Object.getOwnPropertyDescriptor(s.RTCPeerConnection.prototype,"localDescription");Object.defineProperty(s.RTCPeerConnection.prototype,"localDescription",{get(){const l=c.get.apply(this);return l.type===""?l:r(this,l)}}),s.RTCPeerConnection.prototype.removeTrack=function(u){if(this.signalingState==="closed")throw new DOMException("The RTCPeerConnection's signalingState is 'closed'.","InvalidStateError");if(!u._pc)throw new DOMException("Argument 1 of RTCPeerConnection.removeTrack does not implement interface RTCRtpSender.","TypeError");if(!(u._pc===this))throw new DOMException("Sender was not created by this connection.","InvalidAccessError");this._streams=this._streams||{};let d;Object.keys(this._streams).forEach(f=>{this._streams[f].getTracks().find(y=>u.track===y)&&(d=this._streams[f])}),d&&(d.getTracks().length===1?this.removeStream(this._reverseStreams[d.id]):d.removeTrack(u.track),this.dispatchEvent(new Event("negotiationneeded")))}}function gt(s,e){!s.RTCPeerConnection&&s.webkitRTCPeerConnection&&(s.RTCPeerConnection=s.webkitRTCPeerConnection),s.RTCPeerConnection&&e.version<53&&["setLocalDescription","setRemoteDescription","addIceCandidate"].forEach(function(n){const t=s.RTCPeerConnection.prototype[n],i={[n](){return arguments[0]=new(n==="addIceCandidate"?s.RTCIceCandidate:s.RTCSessionDescription)(arguments[0]),t.apply(this,arguments)}};s.RTCPeerConnection.prototype[n]=i[n]})}function wi(s,e){e.version>102||ge(s,"negotiationneeded",n=>{const t=n.target;if(!((e.version<72||t.getConfiguration&&t.getConfiguration().sdpSemantics==="plan-b")&&t.signalingState!=="stable"))return n})}const Ut=Object.freeze(Object.defineProperty({__proto__:null,fixNegotiationNeeded:wi,shimAddTrackRemoveTrack:Ai,shimAddTrackRemoveTrackWithNative:Bi,shimGetSendersWithDtmf:Li,shimGetUserMedia:Mi,shimMediaStream:Pi,shimOnTrack:ki,shimPeerConnection:gt,shimSenderReceiverGetStats:Di},Symbol.toStringTag,{value:"Module"}));function Ii(s,e){const n=s&&s.navigator;if(!n.mediaDevices)return;const t=s&&s.MediaStreamTrack;if(n.getUserMedia=function(i,r,o){Et("navigator.getUserMedia","navigator.mediaDevices.getUserMedia"),n.mediaDevices.getUserMedia(i).then(r,o)},!(e.version>55&&"autoGainControl"in n.mediaDevices.getSupportedConstraints())){const i=function(o,a,c){a in o&&!(c in o)&&(o[c]=o[a],delete o[a])},r=n.mediaDevices.getUserMedia.bind(n.mediaDevices);if(n.mediaDevices.getUserMedia=function(o){return typeof o=="object"&&typeof o.audio=="object"&&(o=JSON.parse(JSON.stringify(o)),i(o.audio,"autoGainControl","mozAutoGainControl"),i(o.audio,"noiseSuppression","mozNoiseSuppression")),r(o)},t&&t.prototype.getSettings){const o=t.prototype.getSettings;t.prototype.getSettings=function(){const a=o.apply(this,arguments);return i(a,"mozAutoGainControl","autoGainControl"),i(a,"mozNoiseSuppression","noiseSuppression"),a}}if(t&&t.prototype.applyConstraints){const o=t.prototype.applyConstraints;t.prototype.applyConstraints=function(a){return this.kind==="audio"&&typeof a=="object"&&(a=JSON.parse(JSON.stringify(a)),i(a,"autoGainControl","mozAutoGainControl"),i(a,"noiseSuppression","mozNoiseSuppression")),o.apply(this,[a])}}}}function as(s,e){s.navigator.mediaDevices&&(s.navigator.mediaDevices&&"getDisplayMedia"in s.navigator.mediaDevices||(s.navigator.mediaDevices.getDisplayMedia=function(t){if(!(t&&t.video)){const i=new DOMException("getDisplayMedia without video constraints is undefined");return i.name="NotFoundError",i.code=8,Promise.reject(i)}return t.video===!0?t.video={mediaSource:e}:t.video.mediaSource=e,s.navigator.mediaDevices.getUserMedia(t)}))}function Fi(s){typeof s=="object"&&s.RTCTrackEvent&&"receiver"in s.RTCTrackEvent.prototype&&!("transceiver"in s.RTCTrackEvent.prototype)&&Object.defineProperty(s.RTCTrackEvent.prototype,"transceiver",{get(){return{receiver:this.receiver}}})}function vt(s,e){typeof s!="object"||!(s.RTCPeerConnection||s.mozRTCPeerConnection)||(!s.RTCPeerConnection&&s.mozRTCPeerConnection&&(s.RTCPeerConnection=s.mozRTCPeerConnection),e.version<53&&["setLocalDescription","setRemoteDescription","addIceCandidate"].forEach(function(n){const t=s.RTCPeerConnection.prototype[n],i={[n](){return arguments[0]=new(n==="addIceCandidate"?s.RTCIceCandidate:s.RTCSessionDescription)(arguments[0]),t.apply(this,arguments)}};s.RTCPeerConnection.prototype[n]=i[n]}))}function Vi(s,e){if(typeof s!="object"||!(s.RTCPeerConnection||s.mozRTCPeerConnection)||e.version>=151)return;const n={inboundrtp:"inbound-rtp",outboundrtp:"outbound-rtp",candidatepair:"candidate-pair",localcandidate:"local-candidate",remotecandidate:"remote-candidate"},t=s.RTCPeerConnection.prototype.getStats;s.RTCPeerConnection.prototype.getStats=function(){const[r,o,a]=arguments;return this.signalingState==="closed"?Promise.resolve(new Map):t.apply(this,[r||null]).then(c=>{if(e.version<53&&!o)try{c.forEach(l=>{l.type=n[l.type]||l.type})}catch(l){if(l.name!=="TypeError")throw l;c.forEach((u,h)=>{c.set(h,Object.assign({},u,{type:n[u.type]||u.type}))})}return c}).then(o,a)}}function Ui(s){if(!(typeof s=="object"&&s.RTCPeerConnection&&s.RTCRtpSender)||s.RTCRtpSender&&"getStats"in s.RTCRtpSender.prototype)return;const e=s.RTCPeerConnection.prototype.getSenders;e&&(s.RTCPeerConnection.prototype.getSenders=function(){const i=e.apply(this,[]);return i.forEach(r=>r._pc=this),i});const n=s.RTCPeerConnection.prototype.addTrack;n&&(s.RTCPeerConnection.prototype.addTrack=function(){const i=n.apply(this,arguments);return i._pc=this,i}),s.RTCRtpSender.prototype.getStats=function(){return this.track?this._pc.getStats(this.track):Promise.resolve(new Map)}}function Oi(s){if(!(typeof s=="object"&&s.RTCPeerConnection&&s.RTCRtpSender)||s.RTCRtpSender&&"getStats"in s.RTCRtpReceiver.prototype)return;const e=s.RTCPeerConnection.prototype.getReceivers;e&&(s.RTCPeerConnection.prototype.getReceivers=function(){const t=e.apply(this,[]);return t.forEach(i=>i._pc=this),t}),ge(s,"track",n=>(n.receiver._pc=n.srcElement,n)),s.RTCRtpReceiver.prototype.getStats=function(){return this._pc.getStats(this.track)}}function Ni(s){!s.RTCPeerConnection||"removeStream"in s.RTCPeerConnection.prototype||(s.RTCPeerConnection.prototype.removeStream=function(n){Et("removeStream","removeTrack"),this.getSenders().forEach(t=>{t.track&&n.getTracks().includes(t.track)&&this.removeTrack(t)})})}function Hi(s){s.DataChannel&&!s.RTCDataChannel&&(s.RTCDataChannel=s.DataChannel)}function zi(s,e){if(!(typeof s=="object"&&s.RTCPeerConnection)||e.version>=110)return;const n=s.RTCPeerConnection.prototype.addTransceiver;n&&(s.RTCPeerConnection.prototype.addTransceiver=function(){this.setParametersPromises=[];let i=arguments[1]&&arguments[1].sendEncodings;i===void 0&&(i=[]),i=[...i];const r=i.length>0;r&&i.forEach(a=>{if("rid"in a&&!/^[a-z0-9]{0,16}$/i.test(a.rid))throw new TypeError("Invalid RID value provided.");if("scaleResolutionDownBy"in a&&!(parseFloat(a.scaleResolutionDownBy)>=1))throw new RangeError("scale_resolution_down_by must be >= 1.0");if("maxFramerate"in a&&!(parseFloat(a.maxFramerate)>=0))throw new RangeError("max_framerate must be >= 0.0")});const o=n.apply(this,arguments);if(r){const{sender:a}=o,c=a.getParameters();(!("encodings"in c)||c.encodings.length===1&&Object.keys(c.encodings[0]).length===0)&&(c.encodings=i,a.sendEncodings=i,this.setParametersPromises.push(a.setParameters(c).then(()=>{delete a.sendEncodings}).catch(()=>{delete a.sendEncodings})))}return o})}function qi(s,e){if(!(typeof s=="object"&&s.RTCRtpSender)||e.version>=110)return;const n=s.RTCRtpSender.prototype.getParameters;n&&(s.RTCRtpSender.prototype.getParameters=function(){const i=n.apply(this,arguments);return"encodings"in i||(i.encodings=[].concat(this.sendEncodings||[{}])),i})}function $i(s,e){if(!(typeof s=="object"&&s.RTCPeerConnection)||e.version>=110)return;const n=s.RTCPeerConnection.prototype.createOffer;s.RTCPeerConnection.prototype.createOffer=function(){return this.setParametersPromises&&this.setParametersPromises.length?Promise.all(this.setParametersPromises).then(()=>n.apply(this,arguments)).finally(()=>{this.setParametersPromises=[]}):n.apply(this,arguments)}}function Gi(s,e){if(!(typeof s=="object"&&s.RTCPeerConnection)||e.version>=110)return;const n=s.RTCPeerConnection.prototype.createAnswer;s.RTCPeerConnection.prototype.createAnswer=function(){return this.setParametersPromises&&this.setParametersPromises.length?Promise.all(this.setParametersPromises).then(()=>n.apply(this,arguments)).finally(()=>{this.setParametersPromises=[]}):n.apply(this,arguments)}}const Ot=Object.freeze(Object.defineProperty({__proto__:null,shimAddTransceiver:zi,shimCreateAnswer:Gi,shimCreateOffer:$i,shimGetDisplayMedia:as,shimGetParameters:qi,shimGetStats:Vi,shimGetUserMedia:Ii,shimOnTrack:Fi,shimPeerConnection:vt,shimRTCDataChannel:Hi,shimReceiverGetStats:Oi,shimRemoveStream:Ni,shimSenderGetStats:Ui},Symbol.toStringTag,{value:"Module"}));function ji(s){if(!(typeof s!="object"||!s.RTCPeerConnection)){if("getLocalStreams"in s.RTCPeerConnection.prototype||(s.RTCPeerConnection.prototype.getLocalStreams=function(){return this._localStreams||(this._localStreams=[]),this._localStreams}),!("addStream"in s.RTCPeerConnection.prototype)){const e=s.RTCPeerConnection.prototype.addTrack;s.RTCPeerConnection.prototype.addStream=function(t){this._localStreams||(this._localStreams=[]),this._localStreams.includes(t)||this._localStreams.push(t),t.getAudioTracks().forEach(i=>e.call(this,i,t)),t.getVideoTracks().forEach(i=>e.call(this,i,t))},s.RTCPeerConnection.prototype.addTrack=function(t,...i){return i&&i.forEach(r=>{this._localStreams?this._localStreams.includes(r)||this._localStreams.push(r):this._localStreams=[r]}),e.apply(this,arguments)}}"removeStream"in s.RTCPeerConnection.prototype||(s.RTCPeerConnection.prototype.removeStream=function(n){this._localStreams||(this._localStreams=[]);const t=this._localStreams.indexOf(n);if(t===-1)return;this._localStreams.splice(t,1);const i=n.getTracks();this.getSenders().forEach(r=>{i.includes(r.track)&&this.removeTrack(r)})})}}function Wi(s){if(!(typeof s!="object"||!s.RTCPeerConnection)&&("getRemoteStreams"in s.RTCPeerConnection.prototype||(s.RTCPeerConnection.prototype.getRemoteStreams=function(){return this._remoteStreams?this._remoteStreams:[]}),!("onaddstream"in s.RTCPeerConnection.prototype))){Object.defineProperty(s.RTCPeerConnection.prototype,"onaddstream",{get(){return this._onaddstream},set(n){this._onaddstream&&(this.removeEventListener("addstream",this._onaddstream),this.removeEventListener("track",this._onaddstreampoly)),this.addEventListener("addstream",this._onaddstream=n),this.addEventListener("track",this._onaddstreampoly=t=>{t.streams.forEach(i=>{if(this._remoteStreams||(this._remoteStreams=[]),this._remoteStreams.includes(i))return;this._remoteStreams.push(i);const r=new Event("addstream");r.stream=i,this.dispatchEvent(r)})})}});const e=s.RTCPeerConnection.prototype.setRemoteDescription;s.RTCPeerConnection.prototype.setRemoteDescription=function(){const t=this;return this._onaddstreampoly||this.addEventListener("track",this._onaddstreampoly=function(i){i.streams.forEach(r=>{if(t._remoteStreams||(t._remoteStreams=[]),t._remoteStreams.indexOf(r)>=0)return;t._remoteStreams.push(r);const o=new Event("addstream");o.stream=r,t.dispatchEvent(o)})}),e.apply(t,arguments)}}}function Ki(s){if(typeof s!="object"||!s.RTCPeerConnection)return;const e=s.RTCPeerConnection.prototype,n=e.createOffer,t=e.createAnswer,i=e.setLocalDescription,r=e.setRemoteDescription,o=e.addIceCandidate;e.createOffer=function(l,u){const h=arguments.length>=2?arguments[2]:arguments[0],d=n.apply(this,[h]);return u?(d.then(l,u),Promise.resolve()):d},e.createAnswer=function(l,u){const h=arguments.length>=2?arguments[2]:arguments[0],d=t.apply(this,[h]);return u?(d.then(l,u),Promise.resolve()):d};let a=function(c,l,u){const h=i.apply(this,[c]);return u?(h.then(l,u),Promise.resolve()):h};e.setLocalDescription=a,a=function(c,l,u){const h=r.apply(this,[c]);return u?(h.then(l,u),Promise.resolve()):h},e.setRemoteDescription=a,a=function(c,l,u){const h=o.apply(this,[c]);return u?(h.then(l,u),Promise.resolve()):h},e.addIceCandidate=a}function Xi(s){const e=s&&s.navigator;if(e.mediaDevices&&e.mediaDevices.getUserMedia){const n=e.mediaDevices,t=n.getUserMedia.bind(n);e.mediaDevices.getUserMedia=i=>t(Yi(i))}!e.getUserMedia&&e.mediaDevices&&e.mediaDevices.getUserMedia&&(e.getUserMedia=function(t,i,r){e.mediaDevices.getUserMedia(t).then(i,r)}.bind(e))}function Yi(s){return s&&s.video!==void 0?Object.assign({},s,{video:Ei(s.video)}):s}function Ji(s){if(!s.RTCPeerConnection)return;const e=s.RTCPeerConnection;s.RTCPeerConnection=function(t,i){if(t&&t.iceServers){const r=[];for(let o=0;o<t.iceServers.length;o++){let a=t.iceServers[o];a.urls===void 0&&a.url?(Et("RTCIceServer.url","RTCIceServer.urls"),a=JSON.parse(JSON.stringify(a)),a.urls=a.url,delete a.url,r.push(a)):r.push(t.iceServers[o])}t.iceServers=r}return new e(t,i)},s.RTCPeerConnection.prototype=e.prototype,"generateCertificate"in e&&Object.defineProperty(s.RTCPeerConnection,"generateCertificate",{get(){return e.generateCertificate}})}function Qi(s){typeof s=="object"&&s.RTCTrackEvent&&"receiver"in s.RTCTrackEvent.prototype&&!("transceiver"in s.RTCTrackEvent.prototype)&&Object.defineProperty(s.RTCTrackEvent.prototype,"transceiver",{get(){return{receiver:this.receiver}}})}function Zi(s){const e=s.RTCPeerConnection.prototype.createOffer;s.RTCPeerConnection.prototype.createOffer=function(t){if(t){typeof t.offerToReceiveAudio<"u"&&(t.offerToReceiveAudio=!!t.offerToReceiveAudio);const i=this.getTransceivers().find(o=>o.receiver.track.kind==="audio");t.offerToReceiveAudio===!1&&i?i.direction==="sendrecv"?i.setDirection?i.setDirection("sendonly"):i.direction="sendonly":i.direction==="recvonly"&&(i.setDirection?i.setDirection("inactive"):i.direction="inactive"):t.offerToReceiveAudio===!0&&!i&&this.addTransceiver("audio",{direction:"recvonly"}),typeof t.offerToReceiveVideo<"u"&&(t.offerToReceiveVideo=!!t.offerToReceiveVideo);const r=this.getTransceivers().find(o=>o.receiver.track.kind==="video");t.offerToReceiveVideo===!1&&r?r.direction==="sendrecv"?r.setDirection?r.setDirection("sendonly"):r.direction="sendonly":r.direction==="recvonly"&&(r.setDirection?r.setDirection("inactive"):r.direction="inactive"):t.offerToReceiveVideo===!0&&!r&&this.addTransceiver("video",{direction:"recvonly"})}return e.apply(this,arguments)}}function en(s){typeof s!="object"||s.AudioContext||(s.AudioContext=s.webkitAudioContext)}const Nt=Object.freeze(Object.defineProperty({__proto__:null,shimAudioContext:en,shimCallbacksAPI:Ki,shimConstraints:Yi,shimCreateOfferLegacy:Zi,shimGetUserMedia:Xi,shimLocalStreamsAPI:ji,shimRTCIceServerUrls:Ji,shimRemoteStreamsAPI:Wi,shimTrackEventTransceiver:Qi},Symbol.toStringTag,{value:"Module"}));function tn(s){return s&&s.__esModule&&Object.prototype.hasOwnProperty.call(s,"default")?s.default:s}var ze={exports:{}},Ht;function cs(){return Ht||(Ht=1,(function(s){const e={};e.generateIdentifier=function(){return Math.random().toString(36).substring(2,12)},e.localCName=e.generateIdentifier(),e.splitLines=function(n){return n.trim().split(`
`).map(t=>t.trim())},e.splitSections=function(n){return n.split(`
m=`).map((i,r)=>(r>0?"m="+i:i).trim()+`\r
`)},e.getDescription=function(n){const t=e.splitSections(n);return t&&t[0]},e.getMediaSections=function(n){const t=e.splitSections(n);return t.shift(),t},e.matchPrefix=function(n,t){return e.splitLines(n).filter(i=>i.indexOf(t)===0)},e.parseCandidate=function(n){let t;n.indexOf("a=candidate:")===0?t=n.substring(12).split(" "):t=n.substring(10).split(" ");const i={foundation:t[0],component:{1:"rtp",2:"rtcp"}[t[1]]||t[1],protocol:t[2].toLowerCase(),priority:parseInt(t[3],10),ip:t[4],address:t[4],port:parseInt(t[5],10),type:t[7]};for(let r=8;r<t.length;r+=2)switch(t[r]){case"raddr":i.relatedAddress=t[r+1];break;case"rport":i.relatedPort=parseInt(t[r+1],10);break;case"tcptype":i.tcpType=t[r+1];break;case"ufrag":i.ufrag=t[r+1],i.usernameFragment=t[r+1];break;default:i[t[r]]===void 0&&(i[t[r]]=t[r+1]);break}return i},e.writeCandidate=function(n){const t=[];t.push(n.foundation);const i=n.component;i==="rtp"?t.push(1):i==="rtcp"?t.push(2):t.push(i),t.push(n.protocol.toUpperCase()),t.push(n.priority),t.push(n.address||n.ip),t.push(n.port);const r=n.type;return t.push("typ"),t.push(r),r!=="host"&&n.relatedAddress&&n.relatedPort!==void 0&&(t.push("raddr"),t.push(n.relatedAddress),t.push("rport"),t.push(n.relatedPort)),n.tcpType&&n.protocol.toLowerCase()==="tcp"&&(t.push("tcptype"),t.push(n.tcpType)),(n.usernameFragment||n.ufrag)&&(t.push("ufrag"),t.push(n.usernameFragment||n.ufrag)),"candidate:"+t.join(" ")},e.parseIceOptions=function(n){return n.substring(14).split(" ")},e.parseRtpMap=function(n){let t=n.substring(9).split(" ");const i={payloadType:parseInt(t.shift(),10)};return t=t[0].split("/"),i.name=t[0],i.clockRate=parseInt(t[1],10),i.channels=t.length===3?parseInt(t[2],10):1,i.numChannels=i.channels,i},e.writeRtpMap=function(n){let t=n.payloadType;n.preferredPayloadType!==void 0&&(t=n.preferredPayloadType);const i=n.channels||n.numChannels||1;return"a=rtpmap:"+t+" "+n.name+"/"+n.clockRate+(i!==1?"/"+i:"")+`\r
`},e.parseExtmap=function(n){const t=n.substring(9).split(" ");return{id:parseInt(t[0],10),direction:t[0].indexOf("/")>0?t[0].split("/")[1]:"sendrecv",uri:t[1],attributes:t.slice(2).join(" ")}},e.writeExtmap=function(n){return"a=extmap:"+(n.id||n.preferredId)+(n.direction&&n.direction!=="sendrecv"?"/"+n.direction:"")+" "+n.uri+(n.attributes?" "+n.attributes:"")+`\r
`},e.parseFmtp=function(n){const t={},i=n.substring(n.indexOf(" ")+1).split(";");for(let r=0;r<i.length;r++){const[o,...a]=i[r].trim().split("=");t[o.trim()]=a.length?a.join("="):void 0}return t},e.writeFmtp=function(n){let t="",i=n.payloadType;if(n.preferredPayloadType!==void 0&&(i=n.preferredPayloadType),n.parameters&&Object.keys(n.parameters).length){const r=[];Object.keys(n.parameters).forEach(o=>{n.parameters[o]!==void 0?r.push(o+"="+n.parameters[o]):r.push(o)}),t+="a=fmtp:"+i+" "+r.join(";")+`\r
`}return t},e.parseRtcpFb=function(n){const t=n.substring(n.indexOf(" ")+1).split(" ");return{type:t.shift(),parameter:t.join(" ")}},e.writeRtcpFb=function(n){let t="",i=n.payloadType;return n.preferredPayloadType!==void 0&&(i=n.preferredPayloadType),n.rtcpFeedback&&n.rtcpFeedback.length&&n.rtcpFeedback.forEach(r=>{t+="a=rtcp-fb:"+i+" "+r.type+(r.parameter&&r.parameter.length?" "+r.parameter:"")+`\r
`}),t},e.parseSsrcMedia=function(n){const t=n.indexOf(" "),i={ssrc:parseInt(n.substring(7,t),10)},r=n.indexOf(":",t);return r>-1?(i.attribute=n.substring(t+1,r),i.value=n.substring(r+1)):i.attribute=n.substring(t+1),i},e.parseSsrcGroup=function(n){const t=n.substring(13).split(" ");return{semantics:t.shift(),ssrcs:t.map(i=>parseInt(i,10))}},e.getMid=function(n){const t=e.matchPrefix(n,"a=mid:")[0];if(t)return t.substring(6)},e.parseFingerprint=function(n){const t=n.substring(14).split(" ");return{algorithm:t[0].toLowerCase(),value:t[1].toUpperCase()}},e.getDtlsParameters=function(n,t){return{role:"auto",fingerprints:e.matchPrefix(n+t,"a=fingerprint:").map(e.parseFingerprint)}},e.writeDtlsParameters=function(n,t){let i="a=setup:"+t+`\r
`;return n.fingerprints.forEach(r=>{i+="a=fingerprint:"+r.algorithm+" "+r.value+`\r
`}),i},e.parseCryptoLine=function(n){const t=n.substring(9).split(" ");return{tag:parseInt(t[0],10),cryptoSuite:t[1],keyParams:t[2],sessionParams:t.slice(3)}},e.writeCryptoLine=function(n){return"a=crypto:"+n.tag+" "+n.cryptoSuite+" "+(typeof n.keyParams=="object"?e.writeCryptoKeyParams(n.keyParams):n.keyParams)+(n.sessionParams?" "+n.sessionParams.join(" "):"")+`\r
`},e.parseCryptoKeyParams=function(n){if(n.indexOf("inline:")!==0)return null;const t=n.substring(7).split("|");return{keyMethod:"inline",keySalt:t[0],lifeTime:t[1],mkiValue:t[2]?t[2].split(":")[0]:void 0,mkiLength:t[2]?t[2].split(":")[1]:void 0}},e.writeCryptoKeyParams=function(n){return n.keyMethod+":"+n.keySalt+(n.lifeTime?"|"+n.lifeTime:"")+(n.mkiValue&&n.mkiLength?"|"+n.mkiValue+":"+n.mkiLength:"")},e.getCryptoParameters=function(n,t){return e.matchPrefix(n+t,"a=crypto:").map(e.parseCryptoLine)},e.getIceParameters=function(n,t){const i=e.matchPrefix(n+t,"a=ice-ufrag:")[0],r=e.matchPrefix(n+t,"a=ice-pwd:")[0];return i&&r?{usernameFragment:i.substring(12),password:r.substring(10)}:null},e.writeIceParameters=function(n){let t="a=ice-ufrag:"+n.usernameFragment+`\r
a=ice-pwd:`+n.password+`\r
`;return n.iceLite&&(t+=`a=ice-lite\r
`),t},e.parseRtpParameters=function(n){const t={codecs:[],headerExtensions:[],fecMechanisms:[],rtcp:[]},r=e.splitLines(n)[0].split(" ");t.profile=r[2];for(let a=3;a<r.length;a++){const c=r[a],l=e.matchPrefix(n,"a=rtpmap:"+c+" ")[0];if(l){const u=e.parseRtpMap(l),h=e.matchPrefix(n,"a=fmtp:"+c+" ");switch(u.parameters=h.length?e.parseFmtp(h[0]):{},u.rtcpFeedback=e.matchPrefix(n,"a=rtcp-fb:"+c+" ").map(e.parseRtcpFb),t.codecs.push(u),u.name.toUpperCase()){case"RED":case"ULPFEC":t.fecMechanisms.push(u.name.toUpperCase());break}}}e.matchPrefix(n,"a=extmap:").forEach(a=>{t.headerExtensions.push(e.parseExtmap(a))});const o=e.matchPrefix(n,"a=rtcp-fb:* ").map(e.parseRtcpFb);return t.codecs.forEach(a=>{o.forEach(c=>{a.rtcpFeedback.find(u=>u.type===c.type&&u.parameter===c.parameter)||a.rtcpFeedback.push(c)})}),t},e.writeRtpDescription=function(n,t){let i="";i+="m="+n+" ",i+=t.codecs.length>0?"9":"0",i+=" "+(t.profile||"UDP/TLS/RTP/SAVPF")+" ",i+=t.codecs.map(o=>o.preferredPayloadType!==void 0?o.preferredPayloadType:o.payloadType).join(" ")+`\r
`,i+=`c=IN IP4 0.0.0.0\r
`,i+=`a=rtcp:9 IN IP4 0.0.0.0\r
`,t.codecs.forEach(o=>{i+=e.writeRtpMap(o),i+=e.writeFmtp(o),i+=e.writeRtcpFb(o)});let r=0;return t.codecs.forEach(o=>{o.maxptime>r&&(r=o.maxptime)}),r>0&&(i+="a=maxptime:"+r+`\r
`),t.headerExtensions&&t.headerExtensions.forEach(o=>{i+=e.writeExtmap(o)}),i},e.parseRtpEncodingParameters=function(n){const t=[],i=e.parseRtpParameters(n),r=i.fecMechanisms.indexOf("RED")!==-1,o=i.fecMechanisms.indexOf("ULPFEC")!==-1,a=e.matchPrefix(n,"a=ssrc:").map(d=>e.parseSsrcMedia(d)).filter(d=>d.attribute==="cname"),c=a.length>0&&a[0].ssrc;let l;const u=e.matchPrefix(n,"a=ssrc-group:FID").map(d=>d.substring(17).split(" ").map(v=>parseInt(v,10)));u.length>0&&u[0].length>1&&u[0][0]===c&&(l=u[0][1]),i.codecs.forEach(d=>{if(d.name.toUpperCase()==="RTX"&&d.parameters.apt){let f={ssrc:c,codecPayloadType:parseInt(d.parameters.apt,10)};c&&l&&(f.rtx={ssrc:l}),t.push(f),r&&(f=JSON.parse(JSON.stringify(f)),f.fec={ssrc:c,mechanism:o?"red+ulpfec":"red"},t.push(f))}}),t.length===0&&c&&t.push({ssrc:c});let h=e.matchPrefix(n,"b=");return h.length&&(h[0].indexOf("b=TIAS:")===0?h=parseInt(h[0].substring(7),10):h[0].indexOf("b=AS:")===0?h=parseInt(h[0].substring(5),10)*1e3*.95-2e3*8:h=void 0,t.forEach(d=>{d.maxBitrate=h})),t},e.parseRtcpParameters=function(n){const t={},i=e.matchPrefix(n,"a=ssrc:").map(a=>e.parseSsrcMedia(a)).filter(a=>a.attribute==="cname")[0];i&&(t.cname=i.value,t.ssrc=i.ssrc);const r=e.matchPrefix(n,"a=rtcp-rsize");t.reducedSize=r.length>0,t.compound=r.length===0;const o=e.matchPrefix(n,"a=rtcp-mux");return t.mux=o.length>0,t},e.writeRtcpParameters=function(n){let t="";return n.reducedSize&&(t+=`a=rtcp-rsize\r
`),n.mux&&(t+=`a=rtcp-mux\r
`),n.ssrc!==void 0&&n.cname&&(t+="a=ssrc:"+n.ssrc+" cname:"+n.cname+`\r
`),t},e.parseMsid=function(n){let t;const i=e.matchPrefix(n,"a=msid:");if(i.length===1)return t=i[0].substring(7).split(" "),{stream:t[0],track:t[1]};const r=e.matchPrefix(n,"a=ssrc:").map(o=>e.parseSsrcMedia(o)).filter(o=>o.attribute==="msid");if(r.length>0)return t=r[0].value.split(" "),{stream:t[0],track:t[1]}},e.parseSctpDescription=function(n){const t=e.parseMLine(n),i=e.matchPrefix(n,"a=max-message-size:");let r;i.length>0&&(r=parseInt(i[0].substring(19),10)),isNaN(r)&&(r=65536);const o=e.matchPrefix(n,"a=sctp-port:");if(o.length>0)return{port:parseInt(o[0].substring(12),10),protocol:t.fmt,maxMessageSize:r};const a=e.matchPrefix(n,"a=sctpmap:");if(a.length>0){const c=a[0].substring(10).split(" ");return{port:parseInt(c[0],10),protocol:c[1],maxMessageSize:r}}},e.writeSctpDescription=function(n,t){let i=[];return n.protocol!=="DTLS/SCTP"?i=["m="+n.kind+" 9 "+n.protocol+" "+t.protocol+`\r
`,`c=IN IP4 0.0.0.0\r
`,"a=sctp-port:"+t.port+`\r
`]:i=["m="+n.kind+" 9 "+n.protocol+" "+t.port+`\r
`,`c=IN IP4 0.0.0.0\r
`,"a=sctpmap:"+t.port+" "+t.protocol+` 65535\r
`],t.maxMessageSize!==void 0&&i.push("a=max-message-size:"+t.maxMessageSize+`\r
`),i.join("")},e.generateSessionId=function(){return Math.random().toString().substr(2,22)},e.writeSessionBoilerplate=function(n,t,i){let r;const o=t!==void 0?t:2;return n?r=n:r=e.generateSessionId(),`v=0\r
o=`+(i||"thisisadapterortc")+" "+r+" "+o+` IN IP4 127.0.0.1\r
s=-\r
t=0 0\r
`},e.getDirection=function(n,t){const i=e.splitLines(n);for(let r=0;r<i.length;r++)switch(i[r]){case"a=sendrecv":case"a=sendonly":case"a=recvonly":case"a=inactive":return i[r].substring(2)}return t?e.getDirection(t):"sendrecv"},e.getKind=function(n){return e.splitLines(n)[0].split(" ")[0].substring(2)},e.isRejected=function(n){return n.split(" ",2)[1]==="0"},e.parseMLine=function(n){const i=e.splitLines(n)[0].substring(2).split(" ");return{kind:i[0],port:parseInt(i[1],10),protocol:i[2],fmt:i.slice(3).join(" ")}},e.parseOLine=function(n){const i=e.matchPrefix(n,"o=")[0].substring(2).split(" ");return{username:i[0],sessionId:i[1],sessionVersion:parseInt(i[2],10),netType:i[3],addressType:i[4],address:i[5]}},e.isValidSDP=function(n){if(typeof n!="string"||n.length===0)return!1;const t=e.splitLines(n);for(let i=0;i<t.length;i++)if(t[i].length<2||t[i].charAt(1)!=="=")return!1;return!0},s.exports=e})(ze)),ze.exports}var nn=cs();const Te=tn(nn),ls=mn({__proto__:null,default:Te},[nn]);function Le(s){if(!s.RTCIceCandidate||s.RTCIceCandidate&&"foundation"in s.RTCIceCandidate.prototype)return;const e=s.RTCIceCandidate;s.RTCIceCandidate=function(t){if(typeof t=="object"&&t.candidate&&t.candidate.indexOf("a=")===0&&(t=JSON.parse(JSON.stringify(t)),t.candidate=t.candidate.substring(2)),t.candidate&&t.candidate.length){const i=new e(t),r=Te.parseCandidate(t.candidate);for(const o in r)o in i||Object.defineProperty(i,o,{value:r[o]});return i.toJSON=function(){return{candidate:i.candidate,sdpMid:i.sdpMid,sdpMLineIndex:i.sdpMLineIndex,usernameFragment:i.usernameFragment}},i}return new e(t)},s.RTCIceCandidate.prototype=e.prototype,ge(s,"icecandidate",n=>(n.candidate&&Object.defineProperty(n,"candidate",{value:new s.RTCIceCandidate(n.candidate),writable:"false"}),n))}function bt(s){!s.RTCIceCandidate||s.RTCIceCandidate&&"relayProtocol"in s.RTCIceCandidate.prototype||ge(s,"icecandidate",e=>{if(e.candidate){const n=Te.parseCandidate(e.candidate.candidate);n.type==="relay"&&(e.candidate.relayProtocol={0:"tls",1:"tcp",2:"udp"}[n.priority>>24])}return e})}function De(s,e){if(!s.RTCPeerConnection||e.browser==="chrome"&&e.version>102||e.browser==="firefox"&&e.version>=113)return;"sctp"in s.RTCPeerConnection.prototype||Object.defineProperty(s.RTCPeerConnection.prototype,"sctp",{get(){return typeof this._sctp>"u"?null:this._sctp}});const n=function(a){if(!a||!a.sdp)return!1;const c=Te.splitSections(a.sdp);return c.shift(),c.some(l=>{const u=Te.parseMLine(l);return u&&u.kind==="application"&&u.protocol.indexOf("SCTP")!==-1})},t=function(a){const c=a.sdp.match(/mozilla...THIS_IS_SDPARTA-(\d+)/);if(c===null||c.length<2)return-1;const l=parseInt(c[1],10);return l!==l?-1:l},i=function(a){let c=65536;return e.browser==="firefox"&&(e.version<57?a===-1?c=16384:c=2147483637:e.version<60?c=e.version===57?65535:65536:c=2147483637),c},r=function(a,c){let l=65536;e.browser==="firefox"&&e.version===57&&(l=65535);const u=Te.matchPrefix(a.sdp,"a=max-message-size:");return u.length>0?l=parseInt(u[0].substring(19),10):e.browser==="firefox"&&c!==-1&&(l=2147483637),l},o=s.RTCPeerConnection.prototype.setRemoteDescription;s.RTCPeerConnection.prototype.setRemoteDescription=function(){if(this._sctp=null,e.browser==="chrome"&&e.version>=76){const{sdpSemantics:c}=this.getConfiguration();c==="plan-b"&&Object.defineProperty(this,"sctp",{get(){return typeof this._sctp>"u"?null:this._sctp},enumerable:!0,configurable:!0})}if(n(arguments[0])){const c=t(arguments[0]),l=i(c),u=r(arguments[0],c);let h;l===0&&u===0?h=Number.POSITIVE_INFINITY:l===0||u===0?h=Math.max(l,u):h=Math.min(l,u);const d={};Object.defineProperty(d,"maxMessageSize",{get(){return h}}),this._sctp=d}return o.apply(this,arguments)}}function Be(s,e){if(!(s.RTCPeerConnection&&"createDataChannel"in s.RTCPeerConnection.prototype)||e.browser==="chrome"&&e.version>=149||e.browser==="firefox"&&e.version>60)return;function n(i,r){const o=i.send;i.send=function(){const c=arguments[0],l=c.length||c.size||c.byteLength;if(i.readyState==="open"&&r.sctp&&l>r.sctp.maxMessageSize)throw new TypeError("Message too large (can send a maximum of "+r.sctp.maxMessageSize+" bytes)");return o.apply(i,arguments)}}const t=s.RTCPeerConnection.prototype.createDataChannel;s.RTCPeerConnection.prototype.createDataChannel=function(){const r=t.apply(this,arguments);return n(r,this),r},ge(s,"datachannel",i=>(n(i.channel,i.target),i))}function yt(s){if(!s.RTCPeerConnection||"connectionState"in s.RTCPeerConnection.prototype)return;const e=s.RTCPeerConnection.prototype;Object.defineProperty(e,"connectionState",{get(){return{completed:"connected",checking:"connecting"}[this.iceConnectionState]||this.iceConnectionState},enumerable:!0,configurable:!0}),Object.defineProperty(e,"onconnectionstatechange",{get(){return this._onconnectionstatechange||null},set(n){this._onconnectionstatechange&&(this.removeEventListener("connectionstatechange",this._onconnectionstatechange),delete this._onconnectionstatechange),n&&this.addEventListener("connectionstatechange",this._onconnectionstatechange=n)},enumerable:!0,configurable:!0}),["setLocalDescription","setRemoteDescription"].forEach(n=>{const t=e[n];e[n]=function(){return this._connectionstatechangepoly||(this._connectionstatechangepoly=i=>{const r=i.target;if(r._lastConnectionState!==r.connectionState){r._lastConnectionState=r.connectionState;const o=new Event("connectionstatechange",i);r.dispatchEvent(o)}return i},this.addEventListener("iceconnectionstatechange",this._connectionstatechangepoly)),t.apply(this,arguments)}})}function xt(s,e){if(!s.RTCPeerConnection||e.browser==="chrome"&&e.version>=71||e.browser==="safari"&&e._safariVersion>=13.1)return;const n=s.RTCPeerConnection.prototype.setRemoteDescription;s.RTCPeerConnection.prototype.setRemoteDescription=function(i){if(i&&i.sdp&&i.sdp.indexOf(`
a=extmap-allow-mixed`)!==-1){const r=i.sdp.split(`
`).filter(o=>o.trim()!=="a=extmap-allow-mixed").join(`
`);s.RTCSessionDescription&&i instanceof s.RTCSessionDescription?arguments[0]=new s.RTCSessionDescription({type:i.type,sdp:r}):i.sdp=r}return n.apply(this,arguments)}}function Ae(s,e){if(!(s.RTCPeerConnection&&s.RTCPeerConnection.prototype))return;const n=s.RTCPeerConnection.prototype.addIceCandidate;!n||n.length===0||(s.RTCPeerConnection.prototype.addIceCandidate=function(){return arguments[0]?(e.browser==="chrome"&&e.version<78||e.browser==="firefox"&&e.version<68||e.browser==="safari")&&arguments[0]&&arguments[0].candidate===""?Promise.resolve():n.apply(this,arguments):(arguments[1]&&arguments[1].apply(null),Promise.resolve())})}function we(s,e){if(!(s.RTCPeerConnection&&s.RTCPeerConnection.prototype))return;const n=s.RTCPeerConnection.prototype.setLocalDescription;!n||n.length===0||(s.RTCPeerConnection.prototype.setLocalDescription=function(){let i=arguments[0]||{};if(typeof i!="object"||i.type&&i.sdp)return n.apply(this,arguments);if(i={type:i.type,sdp:i.sdp},!i.type)switch(this.signalingState){case"stable":case"have-local-offer":case"have-remote-pranswer":i.type="offer";break;default:i.type="answer";break}return i.sdp||i.type!=="offer"&&i.type!=="answer"?n.apply(this,[i]):(i.type==="offer"?this.createOffer:this.createAnswer).apply(this).then(o=>n.apply(this,[o]))})}const us=Object.freeze(Object.defineProperty({__proto__:null,removeExtmapAllowMixed:xt,shimAddIceCandidateNullOrEmpty:Ae,shimConnectionState:yt,shimMaxMessageSize:De,shimParameterlessSetLocalDescription:we,shimRTCIceCandidate:Le,shimRTCIceCandidateRelayProtocol:bt,shimSendThrowTypeError:Be},Symbol.toStringTag,{value:"Module"}));function hs({window:s}={},e={shimChrome:!0,shimFirefox:!0,shimSafari:!0}){const n=Rt,t=os(s),i={browserDetails:t,commonShim:us,extractVersion:Me,disableLog:ss,disableWarnings:rs,sdp:ls};switch(t.browser){case"chrome":if(!Ut||!gt||!e.shimChrome)return n("Chrome shim is not included in this adapter release."),i;if(t.version===null)return n("Chrome shim can not determine version, not shimming."),i;n("adapter.js shimming chrome."),i.browserShim=Ut,Ae(s,t),we(s),Mi(s,t),Pi(s),gt(s,t),ki(s,t),Ai(s,t),Li(s),Di(s,t),wi(s,t),Le(s),bt(s),yt(s),De(s,t),Be(s,t),xt(s,t);break;case"firefox":if(!Ot||!vt||!e.shimFirefox)return n("Firefox shim is not included in this adapter release."),i;n("adapter.js shimming firefox."),i.browserShim=Ot,Ae(s,t),we(s),Ii(s,t),vt(s,t),Vi(s,t),Fi(s),Ni(s),Ui(s),Oi(s),Hi(s),zi(s,t),qi(s,t),$i(s,t),Gi(s,t),Le(s),yt(s),De(s,t),Be(s,t);break;case"safari":if(!Nt||!e.shimSafari)return n("Safari shim is not included in this adapter release."),i;n("adapter.js shimming safari."),i.browserShim=Nt,Ae(s,t),we(s),Ji(s),Zi(s),Ki(s),ji(s),Wi(s),Qi(s),Xi(s),en(s),Le(s),bt(s),De(s,t),Be(s,t),xt(s,t);break;default:n("Unsupported browser!");break}return i}const zt=hs({window:typeof window>"u"?void 0:window});function ve(s,e,n,t){Object.defineProperty(s,e,{get:n,set:t,enumerable:!0,configurable:!0})}class sn{constructor(){this.chunkedMTU=16300,this._dataCount=1,this.chunk=e=>{const n=[],t=e.byteLength,i=Math.ceil(t/this.chunkedMTU);let r=0,o=0;for(;o<t;){const a=Math.min(t,o+this.chunkedMTU),c=e.slice(o,a),l={__peerData:this._dataCount,n:r,data:c,total:i};n.push(l),o=a,r++}return this._dataCount++,n}}}function ds(s){let e=0;for(const i of s)e+=i.byteLength;const n=new Uint8Array(e);let t=0;for(const i of s)n.set(i,t),t+=i.byteLength;return n}const qe=zt.default||zt,Re=new class{isWebRTCSupported(){return typeof RTCPeerConnection<"u"}isBrowserSupported(){const s=this.getBrowser(),e=this.getVersion();return this.supportedBrowsers.includes(s)?s==="chrome"?e>=this.minChromeVersion:s==="firefox"?e>=this.minFirefoxVersion:s==="safari"?!this.isIOS&&e>=this.minSafariVersion:!1:!1}getBrowser(){return qe.browserDetails.browser}getVersion(){return qe.browserDetails.version||0}isUnifiedPlanSupported(){const s=this.getBrowser(),e=qe.browserDetails.version||0;if(s==="chrome"&&e<this.minChromeVersion)return!1;if(s==="firefox"&&e>=this.minFirefoxVersion)return!0;if(!window.RTCRtpTransceiver||!("currentDirection"in RTCRtpTransceiver.prototype))return!1;let n,t=!1;try{n=new RTCPeerConnection,n.addTransceiver("audio"),t=!0}catch{}finally{n&&n.close()}return t}toString(){return`Supports:
    browser:${this.getBrowser()}
    version:${this.getVersion()}
    isIOS:${this.isIOS}
    isWebRTCSupported:${this.isWebRTCSupported()}
    isBrowserSupported:${this.isBrowserSupported()}
    isUnifiedPlanSupported:${this.isUnifiedPlanSupported()}`}constructor(){this.isIOS=typeof navigator<"u"?["iPad","iPhone","iPod"].includes(navigator.platform):!1,this.supportedBrowsers=["firefox","chrome","safari"],this.minFirefoxVersion=59,this.minChromeVersion=72,this.minSafariVersion=605}},fs=s=>!s||/^[A-Za-z0-9]+(?:[ _-][A-Za-z0-9]+)*$/.test(s),rn=()=>Math.random().toString(36).slice(2),qt={iceServers:[{urls:"stun:stun.l.google.com:19302"},{urls:["turn:eu-0.turn.peerjs.com:3478","turn:us-0.turn.peerjs.com:3478"],username:"peerjs",credential:"peerjsp"}],sdpSemantics:"unified-plan"};class ps extends sn{noop(){}blobToArrayBuffer(e,n){const t=new FileReader;return t.onload=function(i){i.target&&n(i.target.result)},t.readAsArrayBuffer(e),t}binaryStringToArrayBuffer(e){const n=new Uint8Array(e.length);for(let t=0;t<e.length;t++)n[t]=e.charCodeAt(t)&255;return n.buffer}isSecure(){return location.protocol==="https:"}constructor(...e){super(...e),this.CLOUD_HOST="0.peerjs.com",this.CLOUD_PORT=443,this.chunkedBrowsers={Chrome:1,chrome:1},this.defaultConfig=qt,this.browser=Re.getBrowser(),this.browserVersion=Re.getVersion(),this.pack=Ti,this.unpack=Ci,this.supports=(function(){const n={browser:Re.isBrowserSupported(),webRTC:Re.isWebRTCSupported(),audioVideo:!1,data:!1,binaryBlob:!1,reliable:!1};if(!n.webRTC)return n;let t;try{t=new RTCPeerConnection(qt),n.audioVideo=!0;let i;try{i=t.createDataChannel("_PEERJSTEST",{ordered:!0}),n.data=!0,n.reliable=!!i.ordered;try{i.binaryType="blob",n.binaryBlob=!Re.isIOS}catch{}}catch{}finally{i&&i.close()}}catch{}finally{t&&t.close()}return n})(),this.validateId=fs,this.randomToken=rn}}const ee=new ps,ms="PeerJS: ";class gs{get logLevel(){return this._logLevel}set logLevel(e){this._logLevel=e}log(...e){this._logLevel>=3&&this._print(3,...e)}warn(...e){this._logLevel>=2&&this._print(2,...e)}error(...e){this._logLevel>=1&&this._print(1,...e)}setLogFunction(e){this._print=e}_print(e,...n){const t=[ms,...n];for(const i in t)t[i]instanceof Error&&(t[i]="("+t[i].name+") "+t[i].message);e>=3?console.log(...t):e>=2?console.warn("WARNING",...t):e>=1&&console.error("ERROR",...t)}constructor(){this._logLevel=0}}var k=new gs,Mt={},vs=Object.prototype.hasOwnProperty,Z="~";function Pe(){}Object.create&&(Pe.prototype=Object.create(null),new Pe().__proto__||(Z=!1));function bs(s,e,n){this.fn=s,this.context=e,this.once=n||!1}function on(s,e,n,t,i){if(typeof n!="function")throw new TypeError("The listener must be a function");var r=new bs(n,t||s,i),o=Z?Z+e:e;return s._events[o]?s._events[o].fn?s._events[o]=[s._events[o],r]:s._events[o].push(r):(s._events[o]=r,s._eventsCount++),s}function Ie(s,e){--s._eventsCount===0?s._events=new Pe:delete s._events[e]}function Q(){this._events=new Pe,this._eventsCount=0}Q.prototype.eventNames=function(){var e=[],n,t;if(this._eventsCount===0)return e;for(t in n=this._events)vs.call(n,t)&&e.push(Z?t.slice(1):t);return Object.getOwnPropertySymbols?e.concat(Object.getOwnPropertySymbols(n)):e};Q.prototype.listeners=function(e){var n=Z?Z+e:e,t=this._events[n];if(!t)return[];if(t.fn)return[t.fn];for(var i=0,r=t.length,o=new Array(r);i<r;i++)o[i]=t[i].fn;return o};Q.prototype.listenerCount=function(e){var n=Z?Z+e:e,t=this._events[n];return t?t.fn?1:t.length:0};Q.prototype.emit=function(e,n,t,i,r,o){var a=Z?Z+e:e;if(!this._events[a])return!1;var c=this._events[a],l=arguments.length,u,h;if(c.fn){switch(c.once&&this.removeListener(e,c.fn,void 0,!0),l){case 1:return c.fn.call(c.context),!0;case 2:return c.fn.call(c.context,n),!0;case 3:return c.fn.call(c.context,n,t),!0;case 4:return c.fn.call(c.context,n,t,i),!0;case 5:return c.fn.call(c.context,n,t,i,r),!0;case 6:return c.fn.call(c.context,n,t,i,r,o),!0}for(h=1,u=new Array(l-1);h<l;h++)u[h-1]=arguments[h];c.fn.apply(c.context,u)}else{var d=c.length,f;for(h=0;h<d;h++)switch(c[h].once&&this.removeListener(e,c[h].fn,void 0,!0),l){case 1:c[h].fn.call(c[h].context);break;case 2:c[h].fn.call(c[h].context,n);break;case 3:c[h].fn.call(c[h].context,n,t);break;case 4:c[h].fn.call(c[h].context,n,t,i);break;default:if(!u)for(f=1,u=new Array(l-1);f<l;f++)u[f-1]=arguments[f];c[h].fn.apply(c[h].context,u)}}return!0};Q.prototype.on=function(e,n,t){return on(this,e,n,t,!1)};Q.prototype.once=function(e,n,t){return on(this,e,n,t,!0)};Q.prototype.removeListener=function(e,n,t,i){var r=Z?Z+e:e;if(!this._events[r])return this;if(!n)return Ie(this,r),this;var o=this._events[r];if(o.fn)o.fn===n&&(!i||o.once)&&(!t||o.context===t)&&Ie(this,r);else{for(var a=0,c=[],l=o.length;a<l;a++)(o[a].fn!==n||i&&!o[a].once||t&&o[a].context!==t)&&c.push(o[a]);c.length?this._events[r]=c.length===1?c[0]:c:Ie(this,r)}return this};Q.prototype.removeAllListeners=function(e){var n;return e?(n=Z?Z+e:e,this._events[n]&&Ie(this,n)):(this._events=new Pe,this._eventsCount=0),this};Q.prototype.off=Q.prototype.removeListener;Q.prototype.addListener=Q.prototype.on;Q.prefixed=Z;Q.EventEmitter=Q;Mt=Q;var be={};ve(be,"ConnectionType",()=>fe);ve(be,"PeerErrorType",()=>W);ve(be,"BaseConnectionErrorType",()=>St);ve(be,"DataConnectionErrorType",()=>Pt);ve(be,"SerializationType",()=>Ue);ve(be,"SocketEventType",()=>de);ve(be,"ServerMessageType",()=>J);var fe=(function(s){return s.Data="data",s.Media="media",s})({}),W=(function(s){return s.BrowserIncompatible="browser-incompatible",s.Disconnected="disconnected",s.InvalidID="invalid-id",s.InvalidKey="invalid-key",s.Network="network",s.PeerUnavailable="peer-unavailable",s.SslUnavailable="ssl-unavailable",s.ServerError="server-error",s.SocketError="socket-error",s.SocketClosed="socket-closed",s.UnavailableID="unavailable-id",s.WebRTC="webrtc",s})({}),St=(function(s){return s.NegotiationFailed="negotiation-failed",s.ConnectionClosed="connection-closed",s})({}),Pt=(function(s){return s.NotOpenYet="not-open-yet",s.MessageToBig="message-too-big",s})({}),Ue=(function(s){return s.Binary="binary",s.BinaryUTF8="binary-utf8",s.JSON="json",s.None="raw",s})({}),de=(function(s){return s.Message="message",s.Disconnected="disconnected",s.Error="error",s.Close="close",s})({}),J=(function(s){return s.Heartbeat="HEARTBEAT",s.Candidate="CANDIDATE",s.Offer="OFFER",s.Answer="ANSWER",s.Open="OPEN",s.Error="ERROR",s.IdTaken="ID-TAKEN",s.InvalidKey="INVALID-KEY",s.Leave="LEAVE",s.Expire="EXPIRE",s})({});const an="1.5.5";class ys extends Mt.EventEmitter{constructor(e,n,t,i,r,o=5e3){super(),this.pingInterval=o,this._disconnected=!0,this._messagesQueue=[];const a=e?"wss://":"ws://";this._baseUrl=a+n+":"+t+i+"peerjs?key="+r}start(e,n){this._id=e;const t=`${this._baseUrl}&id=${e}&token=${n}`;this._socket||!this._disconnected||(this._socket=new WebSocket(t+"&version="+an),this._disconnected=!1,this._socket.onmessage=i=>{let r;try{r=JSON.parse(i.data),k.log("Server message received:",r)}catch{k.log("Invalid server message",i.data);return}this.emit(de.Message,r)},this._socket.onclose=i=>{this._disconnected||(k.log("Socket closed.",i),this._cleanup(),this._disconnected=!0,this.emit(de.Disconnected))},this._socket.onopen=()=>{this._disconnected||(this._sendQueuedMessages(),k.log("Socket open"),this._scheduleHeartbeat())})}_scheduleHeartbeat(){this._wsPingTimer=setTimeout(()=>{this._sendHeartbeat()},this.pingInterval)}_sendHeartbeat(){if(!this._wsOpen()){k.log("Cannot send heartbeat, because socket closed");return}const e=JSON.stringify({type:J.Heartbeat});this._socket.send(e),this._scheduleHeartbeat()}_wsOpen(){return!!this._socket&&this._socket.readyState===1}_sendQueuedMessages(){const e=[...this._messagesQueue];this._messagesQueue=[];for(const n of e)this.send(n)}send(e){if(this._disconnected)return;if(!this._id){this._messagesQueue.push(e);return}if(!e.type){this.emit(de.Error,"Invalid message");return}if(!this._wsOpen())return;const n=JSON.stringify(e);this._socket.send(n)}close(){this._disconnected||(this._cleanup(),this._disconnected=!0)}_cleanup(){this._socket&&(this._socket.onopen=this._socket.onmessage=this._socket.onclose=null,this._socket.close(),this._socket=void 0),clearTimeout(this._wsPingTimer)}}class cn{constructor(e){this.connection=e}startConnection(e){const n=this._startPeerConnection();if(this.connection.peerConnection=n,this.connection.type===fe.Media&&e._stream&&this._addTracksToConnection(e._stream,n),e.originator){const t=this.connection,i={ordered:!!e.reliable},r=n.createDataChannel(t.label,i);t._initializeDataChannel(r),this._makeOffer()}else this.handleSDP("OFFER",e.sdp)}_startPeerConnection(){k.log("Creating RTCPeerConnection.");const e=new RTCPeerConnection(this.connection.provider.options.config);return this._setupListeners(e),e}_setupListeners(e){const n=this.connection.peer,t=this.connection.connectionId,i=this.connection.type,r=this.connection.provider;k.log("Listening for ICE candidates."),e.onicecandidate=o=>{!o.candidate||!o.candidate.candidate||(k.log(`Received ICE candidates for ${n}:`,o.candidate),r.socket.send({type:J.Candidate,payload:{candidate:o.candidate,type:i,connectionId:t},dst:n}))},e.oniceconnectionstatechange=()=>{switch(e.iceConnectionState){case"failed":k.log("iceConnectionState is failed, closing connections to "+n),this.connection.emitError(St.NegotiationFailed,"Negotiation of connection to "+n+" failed."),this.connection.close();break;case"closed":k.log("iceConnectionState is closed, closing connections to "+n),this.connection.emitError(St.ConnectionClosed,"Connection to "+n+" closed."),this.connection.close();break;case"disconnected":k.log("iceConnectionState changed to disconnected on the connection with "+n);break;case"completed":e.onicecandidate=()=>{};break}this.connection.emit("iceStateChanged",e.iceConnectionState)},k.log("Listening for data channel"),e.ondatachannel=o=>{k.log("Received data channel");const a=o.channel;r.getConnection(n,t)._initializeDataChannel(a)},k.log("Listening for remote stream"),e.ontrack=o=>{k.log("Received remote stream");const a=o.streams[0],c=r.getConnection(n,t);if(c.type===fe.Media){const l=c;this._addStreamToMediaConnection(a,l)}}}cleanup(){k.log("Cleaning up PeerConnection to "+this.connection.peer);const e=this.connection.peerConnection;if(!e)return;this.connection.peerConnection=null,e.onicecandidate=e.oniceconnectionstatechange=e.ondatachannel=e.ontrack=()=>{};const n=e.signalingState!=="closed";let t=!1;const i=this.connection.dataChannel;i&&(t=!!i.readyState&&i.readyState!=="closed"),(n||t)&&e.close()}async _makeOffer(){const e=this.connection.peerConnection,n=this.connection.provider;try{const t=await e.createOffer(this.connection.options.constraints);k.log("Created offer."),this.connection.options.sdpTransform&&typeof this.connection.options.sdpTransform=="function"&&(t.sdp=this.connection.options.sdpTransform(t.sdp)||t.sdp);try{await e.setLocalDescription(t),k.log("Set localDescription:",t,`for:${this.connection.peer}`);let i={sdp:t,type:this.connection.type,connectionId:this.connection.connectionId,metadata:this.connection.metadata};if(this.connection.type===fe.Data){const r=this.connection;i={...i,label:r.label,reliable:r.reliable,serialization:r.serialization}}n.socket.send({type:J.Offer,payload:i,dst:this.connection.peer})}catch(i){i!="OperationError: Failed to set local offer sdp: Called in wrong state: kHaveRemoteOffer"&&(n.emitError(W.WebRTC,i),k.log("Failed to setLocalDescription, ",i))}}catch(t){n.emitError(W.WebRTC,t),k.log("Failed to createOffer, ",t)}}async _makeAnswer(){const e=this.connection.peerConnection,n=this.connection.provider;try{const t=await e.createAnswer();k.log("Created answer."),this.connection.options.sdpTransform&&typeof this.connection.options.sdpTransform=="function"&&(t.sdp=this.connection.options.sdpTransform(t.sdp)||t.sdp);try{await e.setLocalDescription(t),k.log("Set localDescription:",t,`for:${this.connection.peer}`),n.socket.send({type:J.Answer,payload:{sdp:t,type:this.connection.type,connectionId:this.connection.connectionId},dst:this.connection.peer})}catch(i){n.emitError(W.WebRTC,i),k.log("Failed to setLocalDescription, ",i)}}catch(t){n.emitError(W.WebRTC,t),k.log("Failed to create answer, ",t)}}async handleSDP(e,n){n=new RTCSessionDescription(n);const t=this.connection.peerConnection,i=this.connection.provider;k.log("Setting remote description",n);const r=this;try{await t.setRemoteDescription(n),k.log(`Set remoteDescription:${e} for:${this.connection.peer}`),e==="OFFER"&&await r._makeAnswer()}catch(o){i.emitError(W.WebRTC,o),k.log("Failed to setRemoteDescription, ",o)}}async handleCandidate(e){k.log("handleCandidate:",e);try{await this.connection.peerConnection.addIceCandidate(e),k.log(`Added ICE candidate for:${this.connection.peer}`)}catch(n){this.connection.provider.emitError(W.WebRTC,n),k.log("Failed to handleCandidate, ",n)}}_addTracksToConnection(e,n){if(k.log(`add tracks from stream ${e.id} to peer connection`),!n.addTrack)return k.error("Your browser does't support RTCPeerConnection#addTrack. Ignored.");e.getTracks().forEach(t=>{n.addTrack(t,e)})}_addStreamToMediaConnection(e,n){k.log(`add stream ${e.id} to media connection ${n.connectionId}`),n.addStream(e)}}class ln extends Mt.EventEmitter{emitError(e,n){k.error("Error:",n),this.emit("error",new xs(`${e}`,n))}}class xs extends Error{constructor(e,n){typeof n=="string"?super(n):(super(),Object.assign(this,n)),this.type=e}}class un extends ln{get open(){return this._open}constructor(e,n,t){super(),this.peer=e,this.provider=n,this.options=t,this._open=!1,this.metadata=t.metadata}}class Fe extends un{static#e=this.ID_PREFIX="mc_";get type(){return fe.Media}get localStream(){return this._localStream}get remoteStream(){return this._remoteStream}constructor(e,n,t){super(e,n,t),this._localStream=this.options._stream,this.connectionId=this.options.connectionId||Fe.ID_PREFIX+ee.randomToken(),this._negotiator=new cn(this),this._localStream&&this._negotiator.startConnection({_stream:this._localStream,originator:!0})}_initializeDataChannel(e){this.dataChannel=e,this.dataChannel.onopen=()=>{k.log(`DC#${this.connectionId} dc connection success`),this.emit("willCloseOnRemote")},this.dataChannel.onclose=()=>{k.log(`DC#${this.connectionId} dc closed for:`,this.peer),this.close()}}addStream(e){k.log("Receiving stream",e),this._remoteStream=e,super.emit("stream",e)}handleMessage(e){const n=e.type,t=e.payload;switch(e.type){case J.Answer:this._negotiator.handleSDP(n,t.sdp),this._open=!0;break;case J.Candidate:this._negotiator.handleCandidate(t.candidate);break;default:k.warn(`Unrecognized message type:${n} from peer:${this.peer}`);break}}answer(e,n={}){if(this._localStream){k.warn("Local stream already exists on this MediaConnection. Are you answering a call twice?");return}this._localStream=e,n&&n.sdpTransform&&(this.options.sdpTransform=n.sdpTransform),this._negotiator.startConnection({...this.options._payload,_stream:e});const t=this.provider._getMessages(this.connectionId);for(const i of t)this.handleMessage(i);this._open=!0}close(){this._negotiator&&(this._negotiator.cleanup(),this._negotiator=null),this._localStream=null,this._remoteStream=null,this.provider&&(this.provider._removeConnection(this),this.provider=null),this.options&&this.options._stream&&(this.options._stream=null),this.open&&(this._open=!1,super.emit("close"))}}class Ss{constructor(e){this._options=e}_buildRequest(e){const n=this._options.secure?"https":"http",{host:t,port:i,path:r,key:o}=this._options,a=new URL(`${n}://${t}:${i}${r}${o}/${e}`);return a.searchParams.set("ts",`${Date.now()}${Math.random()}`),a.searchParams.set("version",an),fetch(a.href,{referrerPolicy:this._options.referrerPolicy})}async retrieveId(){try{const e=await this._buildRequest("id");if(e.status!==200)throw new Error(`Error. Status:${e.status}`);return e.text()}catch(e){k.error("Error retrieving ID",e);let n="";throw this._options.path==="/"&&this._options.host!==ee.CLOUD_HOST&&(n=" If you passed in a `path` to your self-hosted PeerServer, you'll also need to pass in that same path when creating a new Peer."),new Error("Could not get an ID from the server."+n)}}async listAllPeers(){try{const e=await this._buildRequest("peers");if(e.status!==200){if(e.status===401){let n="";throw this._options.host===ee.CLOUD_HOST?n="It looks like you're using the cloud server. You can email team@peerjs.com to enable peer listing for your API key.":n="You need to enable `allow_discovery` on your self-hosted PeerServer to use this feature.",new Error("It doesn't look like you have permission to list peers IDs. "+n)}throw new Error(`Error. Status:${e.status}`)}return e.json()}catch(e){throw k.error("Error retrieving list peers",e),new Error("Could not get list peers from the server."+e)}}}class Ve extends un{static#e=this.ID_PREFIX="dc_";static#t=this.MAX_BUFFERED_AMOUNT=8388608;get type(){return fe.Data}constructor(e,n,t){super(e,n,t),this.connectionId=this.options.connectionId||Ve.ID_PREFIX+rn(),this.label=this.options.label||this.connectionId,this.reliable=!!this.options.reliable,this._negotiator=new cn(this),this._negotiator.startConnection(this.options._payload||{originator:!0,reliable:this.reliable})}_initializeDataChannel(e){this.dataChannel=e,this.dataChannel.onopen=()=>{k.log(`DC#${this.connectionId} dc connection success`),this._open=!0,this.emit("open")},this.dataChannel.onmessage=n=>{k.log(`DC#${this.connectionId} dc onmessage:`,n.data)},this.dataChannel.onclose=()=>{k.log(`DC#${this.connectionId} dc closed for:`,this.peer),this.close()}}close(e){if(e?.flush){this.send({__peerData:{type:"close"}});return}this._negotiator&&(this._negotiator.cleanup(),this._negotiator=null),this.provider&&(this.provider._removeConnection(this),this.provider=null),this.dataChannel&&(this.dataChannel.onopen=null,this.dataChannel.onmessage=null,this.dataChannel.onclose=null,this.dataChannel=null),this.open&&(this._open=!1,super.emit("close"))}send(e,n=!1){if(!this.open){this.emitError(Pt.NotOpenYet,"Connection is not open. You should listen for the `open` event before sending messages.");return}return this._send(e,n)}async handleMessage(e){const n=e.payload;switch(e.type){case J.Answer:await this._negotiator.handleSDP(e.type,n.sdp);break;case J.Candidate:await this._negotiator.handleCandidate(n.candidate);break;default:k.warn("Unrecognized message type:",e.type,"from peer:",this.peer);break}}}class kt extends Ve{get bufferSize(){return this._bufferSize}_initializeDataChannel(e){super._initializeDataChannel(e),this.dataChannel.binaryType="arraybuffer",this.dataChannel.addEventListener("message",n=>this._handleDataMessage(n))}_bufferedSend(e){(this._buffering||!this._trySend(e))&&(this._buffer.push(e),this._bufferSize=this._buffer.length)}_trySend(e){if(!this.open)return!1;if(this.dataChannel.bufferedAmount>Ve.MAX_BUFFERED_AMOUNT)return this._buffering=!0,setTimeout(()=>{this._buffering=!1,this._tryBuffer()},50),!1;try{this.dataChannel.send(e)}catch(n){return k.error(`DC#:${this.connectionId} Error when sending:`,n),this._buffering=!0,this.close(),!1}return!0}_tryBuffer(){if(!this.open||this._buffer.length===0)return;const e=this._buffer[0];this._trySend(e)&&(this._buffer.shift(),this._bufferSize=this._buffer.length,this._tryBuffer())}close(e){if(e?.flush){this.send({__peerData:{type:"close"}});return}this._buffer=[],this._bufferSize=0,super.close()}constructor(...e){super(...e),this._buffer=[],this._bufferSize=0,this._buffering=!1}}class $e extends kt{close(e){super.close(e),this._chunkedData={}}constructor(e,n,t){super(e,n,t),this.chunker=new sn,this.serialization=Ue.Binary,this._chunkedData={}}_handleDataMessage({data:e}){const n=Ci(e),t=n.__peerData;if(t){if(t.type==="close"){this.close();return}this._handleChunk(n);return}this.emit("data",n)}_handleChunk(e){const n=e.__peerData,t=this._chunkedData[n]||{data:[],count:0,total:e.total};if(t.data[e.n]=new Uint8Array(e.data),t.count++,this._chunkedData[n]=t,t.total===t.count){delete this._chunkedData[n];const i=ds(t.data);this._handleDataMessage({data:i})}}_send(e,n){const t=Ti(e);if(t instanceof Promise)return this._send_blob(t);if(!n&&t.byteLength>this.chunker.chunkedMTU){this._sendChunks(t);return}this._bufferedSend(t)}async _send_blob(e){const n=await e;if(n.byteLength>this.chunker.chunkedMTU){this._sendChunks(n);return}this._bufferedSend(n)}_sendChunks(e){const n=this.chunker.chunk(e);k.log(`DC#${this.connectionId} Try to send ${n.length} chunks...`);for(const t of n)this.send(t,!0)}}class Cs extends kt{_handleDataMessage({data:e}){super.emit("data",e)}_send(e,n){this._bufferedSend(e)}constructor(...e){super(...e),this.serialization=Ue.None}}class Ts extends kt{_handleDataMessage({data:e}){const n=this.parse(this.decoder.decode(e)),t=n.__peerData;if(t&&t.type==="close"){this.close();return}this.emit("data",n)}_send(e,n){const t=this.encoder.encode(this.stringify(e));if(t.byteLength>=ee.chunkedMTU){this.emitError(Pt.MessageToBig,"Message too big for JSON channel");return}this._bufferedSend(t)}constructor(...e){super(...e),this.serialization=Ue.JSON,this.encoder=new TextEncoder,this.decoder=new TextDecoder,this.stringify=JSON.stringify,this.parse=JSON.parse}}class Lt extends ln{static#e=this.DEFAULT_KEY="peerjs";get id(){return this._id}get options(){return this._options}get open(){return this._open}get socket(){return this._socket}get connections(){const e=Object.create(null);for(const[n,t]of this._connections)e[n]=t;return e}get destroyed(){return this._destroyed}get disconnected(){return this._disconnected}constructor(e,n){super(),this._serializers={raw:Cs,json:Ts,binary:$e,"binary-utf8":$e,default:$e},this._id=null,this._lastServerId=null,this._destroyed=!1,this._disconnected=!1,this._open=!1,this._connections=new Map,this._lostMessages=new Map;let t;if(e&&e.constructor==Object?n=e:e&&(t=e.toString()),n={debug:0,host:ee.CLOUD_HOST,port:ee.CLOUD_PORT,path:"/",key:Lt.DEFAULT_KEY,token:ee.randomToken(),config:ee.defaultConfig,referrerPolicy:"strict-origin-when-cross-origin",serializers:{},...n},this._options=n,this._serializers={...this._serializers,...this.options.serializers},this._options.host==="/"&&(this._options.host=window.location.hostname),this._options.path&&(this._options.path[0]!=="/"&&(this._options.path="/"+this._options.path),this._options.path[this._options.path.length-1]!=="/"&&(this._options.path+="/")),this._options.secure===void 0&&this._options.host!==ee.CLOUD_HOST?this._options.secure=ee.isSecure():this._options.host==ee.CLOUD_HOST&&(this._options.secure=!0),this._options.logFunction&&k.setLogFunction(this._options.logFunction),k.logLevel=this._options.debug||0,this._api=new Ss(n),this._socket=this._createServerConnection(),!ee.supports.audioVideo&&!ee.supports.data){this._delayedAbort(W.BrowserIncompatible,"The current browser does not support WebRTC");return}if(t&&!ee.validateId(t)){this._delayedAbort(W.InvalidID,`ID "${t}" is invalid`);return}t?this._initialize(t):this._api.retrieveId().then(i=>this._initialize(i)).catch(i=>this._abort(W.ServerError,i))}_createServerConnection(){const e=new ys(this._options.secure,this._options.host,this._options.port,this._options.path,this._options.key,this._options.pingInterval);return e.on(de.Message,n=>{this._handleMessage(n)}),e.on(de.Error,n=>{this._abort(W.SocketError,n)}),e.on(de.Disconnected,()=>{this.disconnected||(this.emitError(W.Network,"Lost connection to server."),this.disconnect())}),e.on(de.Close,()=>{this.disconnected||this._abort(W.SocketClosed,"Underlying socket is already closed.")}),e}_initialize(e){this._id=e,this.socket.start(e,this._options.token)}_handleMessage(e){const n=e.type,t=e.payload,i=e.src;switch(n){case J.Open:this._lastServerId=this.id,this._open=!0,this.emit("open",this.id);break;case J.Error:this._abort(W.ServerError,t.msg);break;case J.IdTaken:this._abort(W.UnavailableID,`ID "${this.id}" is taken`);break;case J.InvalidKey:this._abort(W.InvalidKey,`API KEY "${this._options.key}" is invalid`);break;case J.Leave:k.log(`Received leave message from ${i}`),this._cleanupPeer(i),this._connections.delete(i);break;case J.Expire:this.emitError(W.PeerUnavailable,`Could not connect to peer ${i}`);break;case J.Offer:{const r=t.connectionId;let o=this.getConnection(i,r);if(o&&(o.close(),k.warn(`Offer received for existing Connection ID:${r}`)),t.type===fe.Media){const c=new Fe(i,this,{connectionId:r,_payload:t,metadata:t.metadata});o=c,this._addConnection(i,o),this.emit("call",c)}else if(t.type===fe.Data){const c=new this._serializers[t.serialization](i,this,{connectionId:r,_payload:t,metadata:t.metadata,label:t.label,serialization:t.serialization,reliable:t.reliable});o=c,this._addConnection(i,o),this.emit("connection",c)}else{k.warn(`Received malformed connection type:${t.type}`);return}const a=this._getMessages(r);for(const c of a)o.handleMessage(c);break}default:{if(!t){k.warn(`You received a malformed message from ${i} of type ${n}`);return}const r=t.connectionId,o=this.getConnection(i,r);o&&o.peerConnection?o.handleMessage(e):r?this._storeMessage(r,e):k.warn("You received an unrecognized message:",e);break}}}_storeMessage(e,n){this._lostMessages.has(e)||this._lostMessages.set(e,[]),this._lostMessages.get(e).push(n)}_getMessages(e){const n=this._lostMessages.get(e);return n?(this._lostMessages.delete(e),n):[]}connect(e,n={}){if(n={serialization:"default",...n},this.disconnected){k.warn("You cannot connect to a new Peer because you called .disconnect() on this Peer and ended your connection with the server. You can create a new Peer to reconnect, or call reconnect on this peer if you believe its ID to still be available."),this.emitError(W.Disconnected,"Cannot connect to new Peer after disconnecting from server.");return}const t=new this._serializers[n.serialization](e,this,n);return this._addConnection(e,t),t}call(e,n,t={}){if(this.disconnected){k.warn("You cannot connect to a new Peer because you called .disconnect() on this Peer and ended your connection with the server. You can create a new Peer to reconnect."),this.emitError(W.Disconnected,"Cannot connect to new Peer after disconnecting from server.");return}if(!n){k.error("To call a peer, you must provide a stream from your browser's `getUserMedia`.");return}const i=new Fe(e,this,{...t,_stream:n});return this._addConnection(e,i),i}_addConnection(e,n){k.log(`add connection ${n.type}:${n.connectionId} to peerId:${e}`),this._connections.has(e)||this._connections.set(e,[]),this._connections.get(e).push(n)}_removeConnection(e){const n=this._connections.get(e.peer);if(n){const t=n.indexOf(e);t!==-1&&n.splice(t,1)}this._lostMessages.delete(e.connectionId)}getConnection(e,n){const t=this._connections.get(e);if(!t)return null;for(const i of t)if(i.connectionId===n)return i;return null}_delayedAbort(e,n){setTimeout(()=>{this._abort(e,n)},0)}_abort(e,n){k.error("Aborting!"),this.emitError(e,n),this._lastServerId?this.disconnect():this.destroy()}destroy(){this.destroyed||(k.log(`Destroy peer with ID:${this.id}`),this.disconnect(),this._cleanup(),this._destroyed=!0,this.emit("close"))}_cleanup(){for(const e of this._connections.keys())this._cleanupPeer(e),this._connections.delete(e);this.socket.removeAllListeners()}_cleanupPeer(e){const n=this._connections.get(e);if(n)for(const t of n)t.close()}disconnect(){if(this.disconnected)return;const e=this.id;k.log(`Disconnect peer with ID:${e}`),this._disconnected=!0,this._open=!1,this.socket.close(),this._lastServerId=e,this._id=null,this.emit("disconnected",e)}reconnect(){if(this.disconnected&&!this.destroyed)k.log(`Attempting reconnection to server with ID ${this._lastServerId}`),this._disconnected=!1,this._initialize(this._lastServerId);else{if(this.destroyed)throw new Error("This peer cannot reconnect to the server. It has already been destroyed.");if(!this.disconnected&&!this.open)k.error("In a hurry? We're still trying to make the initial connection!");else throw new Error(`Peer ${this.id} cannot reconnect because it is not disconnected from the server!`)}}listAllPeers(e=n=>{}){this._api.listAllPeers().then(n=>e(n)).catch(n=>this._abort(W.ServerError,n))}}var $t=Lt;class Ct{peer=null;conn=null;currentPin="";isTv=!1;latencyMs=0;pingInterval=null;constructor(){}getPin(){return this.currentPin}getLatency(){return this.latencyMs}isConnected(){return!!this.conn&&this.conn.open}async initTV(e){return this.isTv=!0,this.destroy(),new Promise(n=>{const t=()=>{const i=Math.floor(1e3+Math.random()*9e3).toString();this.currentPin=i;const r=`vibefield-tv-${i}`,o=new $t(r,{debug:1,config:{iceServers:[{urls:"stun:stun.l.google.com:19302"},{urls:"stun:stun1.l.google.com:19302"},{urls:"stun:stun2.l.google.com:19302"}]}});o.on("open",a=>{console.log("[PeerBridge TV] Receiver registered with Peer ID:",a),this.peer=o,e.onPinReady(i),n(i)}),o.on("connection",a=>{console.log("[PeerBridge TV] Incoming connection from phone:",a.peer),this.conn=a,a.on("open",()=>{console.log("[PeerBridge TV] DataChannel open with phone!"),a.send({type:"PAIR_ACK",success:!0,pin:i}),e.onConnected()}),a.on("data",c=>{const l=c;!l||!l.type||(l.type==="MOOD_TICK"?e.onMoodTick(l.data):l.type==="UPDATE_SETTINGS"?e.onSettingsUpdate(l.settings):l.type==="PING"?a.send({type:"PONG",originalTimestamp:l.timestamp}):l.type==="DISCONNECT"&&e.onDisconnected())}),a.on("close",()=>{console.log("[PeerBridge TV] Phone connection closed"),this.conn=null,e.onDisconnected()}),a.on("error",c=>{console.warn("[PeerBridge TV] Connection error:",c),this.conn=null,e.onDisconnected()})}),o.on("error",a=>{console.warn("[PeerBridge TV] Peer error:",a.type,a),a.type==="unavailable-id"?(o.destroy(),t()):e.onError(a.message||"Peer network error")})};t()})}async connectToTV(e,n){return this.isTv=!1,this.destroy(),this.currentPin=e.trim(),new Promise(t=>{const i=`vibefield-phone-${Math.random().toString(36).slice(2,8)}`,r=`vibefield-tv-${this.currentPin}`;console.log(`[PeerBridge Phone] Initializing phone peer ${i} -> connecting to ${r}`);const o=new $t(i,{debug:1,config:{iceServers:[{urls:"stun:stun.l.google.com:19302"},{urls:"stun:stun1.l.google.com:19302"},{urls:"stun:stun2.l.google.com:19302"}]}});this.peer=o,o.on("open",()=>{console.log("[PeerBridge Phone] Phone peer open, establishing WebRTC DataChannel to TV...");const a=o.connect(r,{reliable:!1});this.conn=a;const c=setTimeout(()=>{a.open||(n.onError("Connection timed out. Please check that the PIN on the TV is correct."),t(!1))},12e3);a.on("open",()=>{clearTimeout(c),console.log("[PeerBridge Phone] Connected to TV successfully!"),this.startPingLoop(),n.onConnected(),t(!0)}),a.on("data",l=>{const u=l;!u||!u.type||(u.type==="PONG"?this.latencyMs=Math.round(performance.now()-u.originalTimestamp):u.type==="PAIR_ACK"&&console.log("[PeerBridge Phone] Pair confirmed by TV!"))}),a.on("close",()=>{console.log("[PeerBridge Phone] Connection to TV closed"),this.stopPingLoop(),this.conn=null,n.onDisconnected()}),a.on("error",l=>{clearTimeout(c),console.warn("[PeerBridge Phone] Connection error:",l),this.stopPingLoop(),this.conn=null,n.onError(l.message||"Failed to connect to TV"),t(!1)})}),o.on("error",a=>{console.warn("[PeerBridge Phone] Peer error:",a),n.onError(a.message||"Phone peer initialization error"),t(!1)})})}sendMoodTick(e){if(this.conn&&this.conn.open)try{this.conn.send({type:"MOOD_TICK",data:e,timestamp:performance.now()})}catch{}}sendSettings(e){if(this.conn&&this.conn.open)try{this.conn.send({type:"UPDATE_SETTINGS",settings:e})}catch(n){console.warn("[PeerBridge Phone] Failed to send settings update:",n)}}startPingLoop(){this.stopPingLoop(),this.pingInterval=window.setInterval(()=>{this.conn&&this.conn.open&&this.conn.send({type:"PING",timestamp:performance.now()})},1500)}stopPingLoop(){this.pingInterval!==null&&(clearInterval(this.pingInterval),this.pingInterval=null)}static isPresentationSupported(){return"PresentationRequest"in window}static async requestCast(e){if(!("PresentationRequest"in window))throw new Error("Web Presentation API not supported in this browser.");const n=new URL(window.location.href);n.searchParams.set("mode","tv"),e&&n.searchParams.set("pair",e);const i=await new window.PresentationRequest([n.toString()]).start();console.log("[Presentation] Connected to Cast receiver:",i.id)}destroy(){if(this.stopPingLoop(),this.conn){try{this.conn.send({type:"DISCONNECT"}),this.conn.close()}catch{}this.conn=null}if(this.peer){try{this.peer.destroy()}catch{}this.peer=null}}}var Ce={},Ge,Gt;function _s(){return Gt||(Gt=1,Ge=function(){return typeof Promise=="function"&&Promise.prototype&&Promise.prototype.then}),Ge}var je={},he={},jt;function ye(){if(jt)return he;jt=1;let s;const e=[0,26,44,70,100,134,172,196,242,292,346,404,466,532,581,655,733,815,901,991,1085,1156,1258,1364,1474,1588,1706,1828,1921,2051,2185,2323,2465,2611,2761,2876,3034,3196,3362,3532,3706];return he.getSymbolSize=function(t){if(!t)throw new Error('"version" cannot be null or undefined');if(t<1||t>40)throw new Error('"version" should be in range from 1 to 40');return t*4+17},he.getSymbolTotalCodewords=function(t){return e[t]},he.getBCHDigit=function(n){let t=0;for(;n!==0;)t++,n>>>=1;return t},he.setToSJISFunction=function(t){if(typeof t!="function")throw new Error('"toSJISFunc" is not a valid function.');s=t},he.isKanjiModeEnabled=function(){return typeof s<"u"},he.toSJIS=function(t){return s(t)},he}var We={},Wt;function Dt(){return Wt||(Wt=1,(function(s){s.L={bit:1},s.M={bit:0},s.Q={bit:3},s.H={bit:2};function e(n){if(typeof n!="string")throw new Error("Param is not a string");switch(n.toLowerCase()){case"l":case"low":return s.L;case"m":case"medium":return s.M;case"q":case"quartile":return s.Q;case"h":case"high":return s.H;default:throw new Error("Unknown EC Level: "+n)}}s.isValid=function(t){return t&&typeof t.bit<"u"&&t.bit>=0&&t.bit<4},s.from=function(t,i){if(s.isValid(t))return t;try{return e(t)}catch{return i}}})(We)),We}var Ke,Kt;function Rs(){if(Kt)return Ke;Kt=1;function s(){this.buffer=[],this.length=0}return s.prototype={get:function(e){const n=Math.floor(e/8);return(this.buffer[n]>>>7-e%8&1)===1},put:function(e,n){for(let t=0;t<n;t++)this.putBit((e>>>n-t-1&1)===1)},getLengthInBits:function(){return this.length},putBit:function(e){const n=Math.floor(this.length/8);this.buffer.length<=n&&this.buffer.push(0),e&&(this.buffer[n]|=128>>>this.length%8),this.length++}},Ke=s,Ke}var Xe,Xt;function Es(){if(Xt)return Xe;Xt=1;function s(e){if(!e||e<1)throw new Error("BitMatrix size must be defined and greater than 0");this.size=e,this.data=new Uint8Array(e*e),this.reservedBit=new Uint8Array(e*e)}return s.prototype.set=function(e,n,t,i){const r=e*this.size+n;this.data[r]=t,i&&(this.reservedBit[r]=!0)},s.prototype.get=function(e,n){return this.data[e*this.size+n]},s.prototype.xor=function(e,n,t){this.data[e*this.size+n]^=t},s.prototype.isReserved=function(e,n){return this.reservedBit[e*this.size+n]},Xe=s,Xe}var Ye={},Yt;function Ms(){return Yt||(Yt=1,(function(s){const e=ye().getSymbolSize;s.getRowColCoords=function(t){if(t===1)return[];const i=Math.floor(t/7)+2,r=e(t),o=r===145?26:Math.ceil((r-13)/(2*i-2))*2,a=[r-7];for(let c=1;c<i-1;c++)a[c]=a[c-1]-o;return a.push(6),a.reverse()},s.getPositions=function(t){const i=[],r=s.getRowColCoords(t),o=r.length;for(let a=0;a<o;a++)for(let c=0;c<o;c++)a===0&&c===0||a===0&&c===o-1||a===o-1&&c===0||i.push([r[a],r[c]]);return i}})(Ye)),Ye}var Je={},Jt;function Ps(){if(Jt)return Je;Jt=1;const s=ye().getSymbolSize,e=7;return Je.getPositions=function(t){const i=s(t);return[[0,0],[i-e,0],[0,i-e]]},Je}var Qe={},Qt;function ks(){return Qt||(Qt=1,(function(s){s.Patterns={PATTERN000:0,PATTERN001:1,PATTERN010:2,PATTERN011:3,PATTERN100:4,PATTERN101:5,PATTERN110:6,PATTERN111:7};const e={N1:3,N2:3,N3:40,N4:10};s.isValid=function(i){return i!=null&&i!==""&&!isNaN(i)&&i>=0&&i<=7},s.from=function(i){return s.isValid(i)?parseInt(i,10):void 0},s.getPenaltyN1=function(i){const r=i.size;let o=0,a=0,c=0,l=null,u=null;for(let h=0;h<r;h++){a=c=0,l=u=null;for(let d=0;d<r;d++){let f=i.get(h,d);f===l?a++:(a>=5&&(o+=e.N1+(a-5)),l=f,a=1),f=i.get(d,h),f===u?c++:(c>=5&&(o+=e.N1+(c-5)),u=f,c=1)}a>=5&&(o+=e.N1+(a-5)),c>=5&&(o+=e.N1+(c-5))}return o},s.getPenaltyN2=function(i){const r=i.size;let o=0;for(let a=0;a<r-1;a++)for(let c=0;c<r-1;c++){const l=i.get(a,c)+i.get(a,c+1)+i.get(a+1,c)+i.get(a+1,c+1);(l===4||l===0)&&o++}return o*e.N2},s.getPenaltyN3=function(i){const r=i.size;let o=0,a=0,c=0;for(let l=0;l<r;l++){a=c=0;for(let u=0;u<r;u++)a=a<<1&2047|i.get(l,u),u>=10&&(a===1488||a===93)&&o++,c=c<<1&2047|i.get(u,l),u>=10&&(c===1488||c===93)&&o++}return o*e.N3},s.getPenaltyN4=function(i){let r=0;const o=i.data.length;for(let c=0;c<o;c++)r+=i.data[c];return Math.abs(Math.ceil(r*100/o/5)-10)*e.N4};function n(t,i,r){switch(t){case s.Patterns.PATTERN000:return(i+r)%2===0;case s.Patterns.PATTERN001:return i%2===0;case s.Patterns.PATTERN010:return r%3===0;case s.Patterns.PATTERN011:return(i+r)%3===0;case s.Patterns.PATTERN100:return(Math.floor(i/2)+Math.floor(r/3))%2===0;case s.Patterns.PATTERN101:return i*r%2+i*r%3===0;case s.Patterns.PATTERN110:return(i*r%2+i*r%3)%2===0;case s.Patterns.PATTERN111:return(i*r%3+(i+r)%2)%2===0;default:throw new Error("bad maskPattern:"+t)}}s.applyMask=function(i,r){const o=r.size;for(let a=0;a<o;a++)for(let c=0;c<o;c++)r.isReserved(c,a)||r.xor(c,a,n(i,c,a))},s.getBestMask=function(i,r){const o=Object.keys(s.Patterns).length;let a=0,c=1/0;for(let l=0;l<o;l++){r(l),s.applyMask(l,i);const u=s.getPenaltyN1(i)+s.getPenaltyN2(i)+s.getPenaltyN3(i)+s.getPenaltyN4(i);s.applyMask(l,i),u<c&&(c=u,a=l)}return a}})(Qe)),Qe}var ke={},Zt;function hn(){if(Zt)return ke;Zt=1;const s=Dt(),e=[1,1,1,1,1,1,1,1,1,1,2,2,1,2,2,4,1,2,4,4,2,4,4,4,2,4,6,5,2,4,6,6,2,5,8,8,4,5,8,8,4,5,8,11,4,8,10,11,4,9,12,16,4,9,16,16,6,10,12,18,6,10,17,16,6,11,16,19,6,13,18,21,7,14,21,25,8,16,20,25,8,17,23,25,9,17,23,34,9,18,25,30,10,20,27,32,12,21,29,35,12,23,34,37,12,25,34,40,13,26,35,42,14,28,38,45,15,29,40,48,16,31,43,51,17,33,45,54,18,35,48,57,19,37,51,60,19,38,53,63,20,40,56,66,21,43,59,70,22,45,62,74,24,47,65,77,25,49,68,81],n=[7,10,13,17,10,16,22,28,15,26,36,44,20,36,52,64,26,48,72,88,36,64,96,112,40,72,108,130,48,88,132,156,60,110,160,192,72,130,192,224,80,150,224,264,96,176,260,308,104,198,288,352,120,216,320,384,132,240,360,432,144,280,408,480,168,308,448,532,180,338,504,588,196,364,546,650,224,416,600,700,224,442,644,750,252,476,690,816,270,504,750,900,300,560,810,960,312,588,870,1050,336,644,952,1110,360,700,1020,1200,390,728,1050,1260,420,784,1140,1350,450,812,1200,1440,480,868,1290,1530,510,924,1350,1620,540,980,1440,1710,570,1036,1530,1800,570,1064,1590,1890,600,1120,1680,1980,630,1204,1770,2100,660,1260,1860,2220,720,1316,1950,2310,750,1372,2040,2430];return ke.getBlocksCount=function(i,r){switch(r){case s.L:return e[(i-1)*4+0];case s.M:return e[(i-1)*4+1];case s.Q:return e[(i-1)*4+2];case s.H:return e[(i-1)*4+3];default:return}},ke.getTotalCodewordsCount=function(i,r){switch(r){case s.L:return n[(i-1)*4+0];case s.M:return n[(i-1)*4+1];case s.Q:return n[(i-1)*4+2];case s.H:return n[(i-1)*4+3];default:return}},ke}var Ze={},Ee={},ei;function Ls(){if(ei)return Ee;ei=1;const s=new Uint8Array(512),e=new Uint8Array(256);return(function(){let t=1;for(let i=0;i<255;i++)s[i]=t,e[t]=i,t<<=1,t&256&&(t^=285);for(let i=255;i<512;i++)s[i]=s[i-255]})(),Ee.log=function(t){if(t<1)throw new Error("log("+t+")");return e[t]},Ee.exp=function(t){return s[t]},Ee.mul=function(t,i){return t===0||i===0?0:s[e[t]+e[i]]},Ee}var ti;function Ds(){return ti||(ti=1,(function(s){const e=Ls();s.mul=function(t,i){const r=new Uint8Array(t.length+i.length-1);for(let o=0;o<t.length;o++)for(let a=0;a<i.length;a++)r[o+a]^=e.mul(t[o],i[a]);return r},s.mod=function(t,i){let r=new Uint8Array(t);for(;r.length-i.length>=0;){const o=r[0];for(let c=0;c<i.length;c++)r[c]^=e.mul(i[c],o);let a=0;for(;a<r.length&&r[a]===0;)a++;r=r.slice(a)}return r},s.generateECPolynomial=function(t){let i=new Uint8Array([1]);for(let r=0;r<t;r++)i=s.mul(i,new Uint8Array([1,e.exp(r)]));return i}})(Ze)),Ze}var et,ii;function Bs(){if(ii)return et;ii=1;const s=Ds();function e(n){this.genPoly=void 0,this.degree=n,this.degree&&this.initialize(this.degree)}return e.prototype.initialize=function(t){this.degree=t,this.genPoly=s.generateECPolynomial(this.degree)},e.prototype.encode=function(t){if(!this.genPoly)throw new Error("Encoder not initialized");const i=new Uint8Array(t.length+this.degree);i.set(t);const r=s.mod(i,this.genPoly),o=this.degree-r.length;if(o>0){const a=new Uint8Array(this.degree);return a.set(r,o),a}return r},et=e,et}var tt={},it={},nt={},ni;function dn(){return ni||(ni=1,nt.isValid=function(e){return!isNaN(e)&&e>=1&&e<=40}),nt}var oe={},si;function fn(){if(si)return oe;si=1;const s="[0-9]+",e="[A-Z $%*+\\-./:]+";let n="(?:[u3000-u303F]|[u3040-u309F]|[u30A0-u30FF]|[uFF00-uFFEF]|[u4E00-u9FAF]|[u2605-u2606]|[u2190-u2195]|u203B|[u2010u2015u2018u2019u2025u2026u201Cu201Du2225u2260]|[u0391-u0451]|[u00A7u00A8u00B1u00B4u00D7u00F7])+";n=n.replace(/u/g,"\\u");const t="(?:(?![A-Z0-9 $%*+\\-./:]|"+n+`)(?:.|[\r
]))+`;oe.KANJI=new RegExp(n,"g"),oe.BYTE_KANJI=new RegExp("[^A-Z0-9 $%*+\\-./:]+","g"),oe.BYTE=new RegExp(t,"g"),oe.NUMERIC=new RegExp(s,"g"),oe.ALPHANUMERIC=new RegExp(e,"g");const i=new RegExp("^"+n+"$"),r=new RegExp("^"+s+"$"),o=new RegExp("^[A-Z0-9 $%*+\\-./:]+$");return oe.testKanji=function(c){return i.test(c)},oe.testNumeric=function(c){return r.test(c)},oe.testAlphanumeric=function(c){return o.test(c)},oe}var ri;function xe(){return ri||(ri=1,(function(s){const e=dn(),n=fn();s.NUMERIC={id:"Numeric",bit:1,ccBits:[10,12,14]},s.ALPHANUMERIC={id:"Alphanumeric",bit:2,ccBits:[9,11,13]},s.BYTE={id:"Byte",bit:4,ccBits:[8,16,16]},s.KANJI={id:"Kanji",bit:8,ccBits:[8,10,12]},s.MIXED={bit:-1},s.getCharCountIndicator=function(r,o){if(!r.ccBits)throw new Error("Invalid mode: "+r);if(!e.isValid(o))throw new Error("Invalid version: "+o);return o>=1&&o<10?r.ccBits[0]:o<27?r.ccBits[1]:r.ccBits[2]},s.getBestModeForData=function(r){return n.testNumeric(r)?s.NUMERIC:n.testAlphanumeric(r)?s.ALPHANUMERIC:n.testKanji(r)?s.KANJI:s.BYTE},s.toString=function(r){if(r&&r.id)return r.id;throw new Error("Invalid mode")},s.isValid=function(r){return r&&r.bit&&r.ccBits};function t(i){if(typeof i!="string")throw new Error("Param is not a string");switch(i.toLowerCase()){case"numeric":return s.NUMERIC;case"alphanumeric":return s.ALPHANUMERIC;case"kanji":return s.KANJI;case"byte":return s.BYTE;default:throw new Error("Unknown mode: "+i)}}s.from=function(r,o){if(s.isValid(r))return r;try{return t(r)}catch{return o}}})(it)),it}var oi;function As(){return oi||(oi=1,(function(s){const e=ye(),n=hn(),t=Dt(),i=xe(),r=dn(),o=7973,a=e.getBCHDigit(o);function c(d,f,v){for(let y=1;y<=40;y++)if(f<=s.getCapacity(y,v,d))return y}function l(d,f){return i.getCharCountIndicator(d,f)+4}function u(d,f){let v=0;return d.forEach(function(y){const P=l(y.mode,f);v+=P+y.getBitsLength()}),v}function h(d,f){for(let v=1;v<=40;v++)if(u(d,v)<=s.getCapacity(v,f,i.MIXED))return v}s.from=function(f,v){return r.isValid(f)?parseInt(f,10):v},s.getCapacity=function(f,v,y){if(!r.isValid(f))throw new Error("Invalid QR Code version");typeof y>"u"&&(y=i.BYTE);const P=e.getSymbolTotalCodewords(f),C=n.getTotalCodewordsCount(f,v),M=(P-C)*8;if(y===i.MIXED)return M;const g=M-l(y,f);switch(y){case i.NUMERIC:return Math.floor(g/10*3);case i.ALPHANUMERIC:return Math.floor(g/11*2);case i.KANJI:return Math.floor(g/13);case i.BYTE:default:return Math.floor(g/8)}},s.getBestVersionForData=function(f,v){let y;const P=t.from(v,t.M);if(Array.isArray(f)){if(f.length>1)return h(f,P);if(f.length===0)return 1;y=f[0]}else y=f;return c(y.mode,y.getLength(),P)},s.getEncodedBits=function(f){if(!r.isValid(f)||f<7)throw new Error("Invalid QR Code version");let v=f<<12;for(;e.getBCHDigit(v)-a>=0;)v^=o<<e.getBCHDigit(v)-a;return f<<12|v}})(tt)),tt}var st={},ai;function ws(){if(ai)return st;ai=1;const s=ye(),e=1335,n=21522,t=s.getBCHDigit(e);return st.getEncodedBits=function(r,o){const a=r.bit<<3|o;let c=a<<10;for(;s.getBCHDigit(c)-t>=0;)c^=e<<s.getBCHDigit(c)-t;return(a<<10|c)^n},st}var rt={},ot,ci;function Is(){if(ci)return ot;ci=1;const s=xe();function e(n){this.mode=s.NUMERIC,this.data=n.toString()}return e.getBitsLength=function(t){return 10*Math.floor(t/3)+(t%3?t%3*3+1:0)},e.prototype.getLength=function(){return this.data.length},e.prototype.getBitsLength=function(){return e.getBitsLength(this.data.length)},e.prototype.write=function(t){let i,r,o;for(i=0;i+3<=this.data.length;i+=3)r=this.data.substr(i,3),o=parseInt(r,10),t.put(o,10);const a=this.data.length-i;a>0&&(r=this.data.substr(i),o=parseInt(r,10),t.put(o,a*3+1))},ot=e,ot}var at,li;function Fs(){if(li)return at;li=1;const s=xe(),e=["0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"," ","$","%","*","+","-",".","/",":"];function n(t){this.mode=s.ALPHANUMERIC,this.data=t}return n.getBitsLength=function(i){return 11*Math.floor(i/2)+6*(i%2)},n.prototype.getLength=function(){return this.data.length},n.prototype.getBitsLength=function(){return n.getBitsLength(this.data.length)},n.prototype.write=function(i){let r;for(r=0;r+2<=this.data.length;r+=2){let o=e.indexOf(this.data[r])*45;o+=e.indexOf(this.data[r+1]),i.put(o,11)}this.data.length%2&&i.put(e.indexOf(this.data[r]),6)},at=n,at}var ct,ui;function Vs(){if(ui)return ct;ui=1;const s=xe();function e(n){this.mode=s.BYTE,typeof n=="string"?this.data=new TextEncoder().encode(n):this.data=new Uint8Array(n)}return e.getBitsLength=function(t){return t*8},e.prototype.getLength=function(){return this.data.length},e.prototype.getBitsLength=function(){return e.getBitsLength(this.data.length)},e.prototype.write=function(n){for(let t=0,i=this.data.length;t<i;t++)n.put(this.data[t],8)},ct=e,ct}var lt,hi;function Us(){if(hi)return lt;hi=1;const s=xe(),e=ye();function n(t){this.mode=s.KANJI,this.data=t}return n.getBitsLength=function(i){return i*13},n.prototype.getLength=function(){return this.data.length},n.prototype.getBitsLength=function(){return n.getBitsLength(this.data.length)},n.prototype.write=function(t){let i;for(i=0;i<this.data.length;i++){let r=e.toSJIS(this.data[i]);if(r>=33088&&r<=40956)r-=33088;else if(r>=57408&&r<=60351)r-=49472;else throw new Error("Invalid SJIS character: "+this.data[i]+`
Make sure your charset is UTF-8`);r=(r>>>8&255)*192+(r&255),t.put(r,13)}},lt=n,lt}var ut={exports:{}},di;function Os(){return di||(di=1,(function(s){var e={single_source_shortest_paths:function(n,t,i){var r={},o={};o[t]=0;var a=e.PriorityQueue.make();a.push(t,0);for(var c,l,u,h,d,f,v,y,P;!a.empty();){c=a.pop(),l=c.value,h=c.cost,d=n[l]||{};for(u in d)d.hasOwnProperty(u)&&(f=d[u],v=h+f,y=o[u],P=typeof o[u]>"u",(P||y>v)&&(o[u]=v,a.push(u,v),r[u]=l))}if(typeof i<"u"&&typeof o[i]>"u"){var C=["Could not find a path from ",t," to ",i,"."].join("");throw new Error(C)}return r},extract_shortest_path_from_predecessor_list:function(n,t){for(var i=[],r=t;r;)i.push(r),n[r],r=n[r];return i.reverse(),i},find_path:function(n,t,i){var r=e.single_source_shortest_paths(n,t,i);return e.extract_shortest_path_from_predecessor_list(r,i)},PriorityQueue:{make:function(n){var t=e.PriorityQueue,i={},r;n=n||{};for(r in t)t.hasOwnProperty(r)&&(i[r]=t[r]);return i.queue=[],i.sorter=n.sorter||t.default_sorter,i},default_sorter:function(n,t){return n.cost-t.cost},push:function(n,t){var i={value:n,cost:t};this.queue.push(i),this.queue.sort(this.sorter)},pop:function(){return this.queue.shift()},empty:function(){return this.queue.length===0}}};s.exports=e})(ut)),ut.exports}var fi;function Ns(){return fi||(fi=1,(function(s){const e=xe(),n=Is(),t=Fs(),i=Vs(),r=Us(),o=fn(),a=ye(),c=Os();function l(C){return unescape(encodeURIComponent(C)).length}function u(C,M,g){const T=[];let B;for(;(B=C.exec(g))!==null;)T.push({data:B[0],index:B.index,mode:M,length:B[0].length});return T}function h(C){const M=u(o.NUMERIC,e.NUMERIC,C),g=u(o.ALPHANUMERIC,e.ALPHANUMERIC,C);let T,B;return a.isKanjiModeEnabled()?(T=u(o.BYTE,e.BYTE,C),B=u(o.KANJI,e.KANJI,C)):(T=u(o.BYTE_KANJI,e.BYTE,C),B=[]),M.concat(g,T,B).sort(function(E,x){return E.index-x.index}).map(function(E){return{data:E.data,mode:E.mode,length:E.length}})}function d(C,M){switch(M){case e.NUMERIC:return n.getBitsLength(C);case e.ALPHANUMERIC:return t.getBitsLength(C);case e.KANJI:return r.getBitsLength(C);case e.BYTE:return i.getBitsLength(C)}}function f(C){return C.reduce(function(M,g){const T=M.length-1>=0?M[M.length-1]:null;return T&&T.mode===g.mode?(M[M.length-1].data+=g.data,M):(M.push(g),M)},[])}function v(C){const M=[];for(let g=0;g<C.length;g++){const T=C[g];switch(T.mode){case e.NUMERIC:M.push([T,{data:T.data,mode:e.ALPHANUMERIC,length:T.length},{data:T.data,mode:e.BYTE,length:T.length}]);break;case e.ALPHANUMERIC:M.push([T,{data:T.data,mode:e.BYTE,length:T.length}]);break;case e.KANJI:M.push([T,{data:T.data,mode:e.BYTE,length:l(T.data)}]);break;case e.BYTE:M.push([{data:T.data,mode:e.BYTE,length:l(T.data)}])}}return M}function y(C,M){const g={},T={start:{}};let B=["start"];for(let m=0;m<C.length;m++){const E=C[m],x=[];for(let R=0;R<E.length;R++){const L=E[R],_=""+m+R;x.push(_),g[_]={node:L,lastCount:0},T[_]={};for(let b=0;b<B.length;b++){const p=B[b];g[p]&&g[p].node.mode===L.mode?(T[p][_]=d(g[p].lastCount+L.length,L.mode)-d(g[p].lastCount,L.mode),g[p].lastCount+=L.length):(g[p]&&(g[p].lastCount=L.length),T[p][_]=d(L.length,L.mode)+4+e.getCharCountIndicator(L.mode,M))}}B=x}for(let m=0;m<B.length;m++)T[B[m]].end=0;return{map:T,table:g}}function P(C,M){let g;const T=e.getBestModeForData(C);if(g=e.from(M,T),g!==e.BYTE&&g.bit<T.bit)throw new Error('"'+C+'" cannot be encoded with mode '+e.toString(g)+`.
 Suggested mode is: `+e.toString(T));switch(g===e.KANJI&&!a.isKanjiModeEnabled()&&(g=e.BYTE),g){case e.NUMERIC:return new n(C);case e.ALPHANUMERIC:return new t(C);case e.KANJI:return new r(C);case e.BYTE:return new i(C)}}s.fromArray=function(M){return M.reduce(function(g,T){return typeof T=="string"?g.push(P(T,null)):T.data&&g.push(P(T.data,T.mode)),g},[])},s.fromString=function(M,g){const T=h(M,a.isKanjiModeEnabled()),B=v(T),m=y(B,g),E=c.find_path(m.map,"start","end"),x=[];for(let R=1;R<E.length-1;R++)x.push(m.table[E[R]].node);return s.fromArray(f(x))},s.rawSplit=function(M){return s.fromArray(h(M,a.isKanjiModeEnabled()))}})(rt)),rt}var pi;function Hs(){if(pi)return je;pi=1;const s=ye(),e=Dt(),n=Rs(),t=Es(),i=Ms(),r=Ps(),o=ks(),a=hn(),c=Bs(),l=As(),u=ws(),h=xe(),d=Ns();function f(m,E){const x=m.size,R=r.getPositions(E);for(let L=0;L<R.length;L++){const _=R[L][0],b=R[L][1];for(let p=-1;p<=7;p++)if(!(_+p<=-1||x<=_+p))for(let S=-1;S<=7;S++)b+S<=-1||x<=b+S||(p>=0&&p<=6&&(S===0||S===6)||S>=0&&S<=6&&(p===0||p===6)||p>=2&&p<=4&&S>=2&&S<=4?m.set(_+p,b+S,!0,!0):m.set(_+p,b+S,!1,!0))}}function v(m){const E=m.size;for(let x=8;x<E-8;x++){const R=x%2===0;m.set(x,6,R,!0),m.set(6,x,R,!0)}}function y(m,E){const x=i.getPositions(E);for(let R=0;R<x.length;R++){const L=x[R][0],_=x[R][1];for(let b=-2;b<=2;b++)for(let p=-2;p<=2;p++)b===-2||b===2||p===-2||p===2||b===0&&p===0?m.set(L+b,_+p,!0,!0):m.set(L+b,_+p,!1,!0)}}function P(m,E){const x=m.size,R=l.getEncodedBits(E);let L,_,b;for(let p=0;p<18;p++)L=Math.floor(p/3),_=p%3+x-8-3,b=(R>>p&1)===1,m.set(L,_,b,!0),m.set(_,L,b,!0)}function C(m,E,x){const R=m.size,L=u.getEncodedBits(E,x);let _,b;for(_=0;_<15;_++)b=(L>>_&1)===1,_<6?m.set(_,8,b,!0):_<8?m.set(_+1,8,b,!0):m.set(R-15+_,8,b,!0),_<8?m.set(8,R-_-1,b,!0):_<9?m.set(8,15-_-1+1,b,!0):m.set(8,15-_-1,b,!0);m.set(R-8,8,1,!0)}function M(m,E){const x=m.size;let R=-1,L=x-1,_=7,b=0;for(let p=x-1;p>0;p-=2)for(p===6&&p--;;){for(let S=0;S<2;S++)if(!m.isReserved(L,p-S)){let w=!1;b<E.length&&(w=(E[b]>>>_&1)===1),m.set(L,p-S,w),_--,_===-1&&(b++,_=7)}if(L+=R,L<0||x<=L){L-=R,R=-R;break}}}function g(m,E,x){const R=new n;x.forEach(function(S){R.put(S.mode.bit,4),R.put(S.getLength(),h.getCharCountIndicator(S.mode,m)),S.write(R)});const L=s.getSymbolTotalCodewords(m),_=a.getTotalCodewordsCount(m,E),b=(L-_)*8;for(R.getLengthInBits()+4<=b&&R.put(0,4);R.getLengthInBits()%8!==0;)R.putBit(0);const p=(b-R.getLengthInBits())/8;for(let S=0;S<p;S++)R.put(S%2?17:236,8);return T(R,m,E)}function T(m,E,x){const R=s.getSymbolTotalCodewords(E),L=a.getTotalCodewordsCount(E,x),_=R-L,b=a.getBlocksCount(E,x),p=R%b,S=b-p,w=Math.floor(R/b),z=Math.floor(_/b),F=z+1,A=w-z,I=new c(A);let V=0;const U=new Array(b),G=new Array(b);let O=0;const j=new Uint8Array(m.buffer);for(let H=0;H<b;H++){const N=H<S?z:F;U[H]=j.slice(V,V+N),G[H]=I.encode(U[H]),V+=N,O=Math.max(O,N)}const K=new Uint8Array(R);let ie=0,X,$;for(X=0;X<O;X++)for($=0;$<b;$++)X<U[$].length&&(K[ie++]=U[$][X]);for(X=0;X<A;X++)for($=0;$<b;$++)K[ie++]=G[$][X];return K}function B(m,E,x,R){let L;if(Array.isArray(m))L=d.fromArray(m);else if(typeof m=="string"){let w=E;if(!w){const z=d.rawSplit(m);w=l.getBestVersionForData(z,x)}L=d.fromString(m,w||40)}else throw new Error("Invalid data");const _=l.getBestVersionForData(L,x);if(!_)throw new Error("The amount of data is too big to be stored in a QR Code");if(!E)E=_;else if(E<_)throw new Error(`
The chosen QR Code version cannot contain this amount of data.
Minimum version required to store current data is: `+_+`.
`);const b=g(E,x,L),p=s.getSymbolSize(E),S=new t(p);return f(S,E),v(S),y(S,E),C(S,x,0),E>=7&&P(S,E),M(S,b),isNaN(R)&&(R=o.getBestMask(S,C.bind(null,S,x))),o.applyMask(R,S),C(S,x,R),{modules:S,version:E,errorCorrectionLevel:x,maskPattern:R,segments:L}}return je.create=function(E,x){if(typeof E>"u"||E==="")throw new Error("No input text");let R=e.M,L,_;return typeof x<"u"&&(R=e.from(x.errorCorrectionLevel,e.M),L=l.from(x.version),_=o.from(x.maskPattern),x.toSJISFunc&&s.setToSJISFunction(x.toSJISFunc)),B(E,L,R,_)},je}var ht={},dt={},mi;function pn(){return mi||(mi=1,(function(s){function e(n){if(typeof n=="number"&&(n=n.toString()),typeof n!="string")throw new Error("Color should be defined as hex string");let t=n.slice().replace("#","").split("");if(t.length<3||t.length===5||t.length>8)throw new Error("Invalid hex color: "+n);(t.length===3||t.length===4)&&(t=Array.prototype.concat.apply([],t.map(function(r){return[r,r]}))),t.length===6&&t.push("F","F");const i=parseInt(t.join(""),16);return{r:i>>24&255,g:i>>16&255,b:i>>8&255,a:i&255,hex:"#"+t.slice(0,6).join("")}}s.getOptions=function(t){t||(t={}),t.color||(t.color={});const i=typeof t.margin>"u"||t.margin===null||t.margin<0?4:t.margin,r=t.width&&t.width>=21?t.width:void 0,o=t.scale||4;return{width:r,scale:r?4:o,margin:i,color:{dark:e(t.color.dark||"#000000ff"),light:e(t.color.light||"#ffffffff")},type:t.type,rendererOpts:t.rendererOpts||{}}},s.getScale=function(t,i){return i.width&&i.width>=t+i.margin*2?i.width/(t+i.margin*2):i.scale},s.getImageWidth=function(t,i){const r=s.getScale(t,i);return Math.floor((t+i.margin*2)*r)},s.qrToImageData=function(t,i,r){const o=i.modules.size,a=i.modules.data,c=s.getScale(o,r),l=Math.floor((o+r.margin*2)*c),u=r.margin*c,h=[r.color.light,r.color.dark];for(let d=0;d<l;d++)for(let f=0;f<l;f++){let v=(d*l+f)*4,y=r.color.light;if(d>=u&&f>=u&&d<l-u&&f<l-u){const P=Math.floor((d-u)/c),C=Math.floor((f-u)/c);y=h[a[P*o+C]?1:0]}t[v++]=y.r,t[v++]=y.g,t[v++]=y.b,t[v]=y.a}}})(dt)),dt}var gi;function zs(){return gi||(gi=1,(function(s){const e=pn();function n(i,r,o){i.clearRect(0,0,r.width,r.height),r.style||(r.style={}),r.height=o,r.width=o,r.style.height=o+"px",r.style.width=o+"px"}function t(){try{return document.createElement("canvas")}catch{throw new Error("You need to specify a canvas element")}}s.render=function(r,o,a){let c=a,l=o;typeof c>"u"&&(!o||!o.getContext)&&(c=o,o=void 0),o||(l=t()),c=e.getOptions(c);const u=e.getImageWidth(r.modules.size,c),h=l.getContext("2d"),d=h.createImageData(u,u);return e.qrToImageData(d.data,r,c),n(h,l,u),h.putImageData(d,0,0),l},s.renderToDataURL=function(r,o,a){let c=a;typeof c>"u"&&(!o||!o.getContext)&&(c=o,o=void 0),c||(c={});const l=s.render(r,o,c),u=c.type||"image/png",h=c.rendererOpts||{};return l.toDataURL(u,h.quality)}})(ht)),ht}var ft={},vi;function qs(){if(vi)return ft;vi=1;const s=pn();function e(i,r){const o=i.a/255,a=r+'="'+i.hex+'"';return o<1?a+" "+r+'-opacity="'+o.toFixed(2).slice(1)+'"':a}function n(i,r,o){let a=i+r;return typeof o<"u"&&(a+=" "+o),a}function t(i,r,o){let a="",c=0,l=!1,u=0;for(let h=0;h<i.length;h++){const d=Math.floor(h%r),f=Math.floor(h/r);!d&&!l&&(l=!0),i[h]?(u++,h>0&&d>0&&i[h-1]||(a+=l?n("M",d+o,.5+f+o):n("m",c,0),c=0,l=!1),d+1<r&&i[h+1]||(a+=n("h",u),u=0)):c++}return a}return ft.render=function(r,o,a){const c=s.getOptions(o),l=r.modules.size,u=r.modules.data,h=l+c.margin*2,d=c.color.light.a?"<path "+e(c.color.light,"fill")+' d="M0 0h'+h+"v"+h+'H0z"/>':"",f="<path "+e(c.color.dark,"stroke")+' d="'+t(u,l,c.margin)+'"/>',v='viewBox="0 0 '+h+" "+h+'"',P='<svg xmlns="http://www.w3.org/2000/svg" '+(c.width?'width="'+c.width+'" height="'+c.width+'" ':"")+v+' shape-rendering="crispEdges">'+d+f+`</svg>
`;return typeof a=="function"&&a(null,P),P},ft}var bi;function $s(){if(bi)return Ce;bi=1;const s=_s(),e=Hs(),n=zs(),t=qs();function i(r,o,a,c,l){const u=[].slice.call(arguments,1),h=u.length,d=typeof u[h-1]=="function";if(!d&&!s())throw new Error("Callback required as last argument");if(d){if(h<2)throw new Error("Too few arguments provided");h===2?(l=a,a=o,o=c=void 0):h===3&&(o.getContext&&typeof l>"u"?(l=c,c=void 0):(l=c,c=a,a=o,o=void 0))}else{if(h<1)throw new Error("Too few arguments provided");return h===1?(a=o,o=c=void 0):h===2&&!o.getContext&&(c=a,a=o,o=void 0),new Promise(function(f,v){try{const y=e.create(a,c);f(r(y,o,c))}catch(y){v(y)}})}try{const f=e.create(a,c);l(null,r(f,o,c))}catch(f){l(f)}}return Ce.create=e.create,Ce.toCanvas=i.bind(null,n.render),Ce.toDataURL=i.bind(null,n.renderToDataURL),Ce.toString=i.bind(null,function(r,o,a){return t.render(r,a)}),Ce}var Gs=$s();const js=tn(Gs);class Ws{el;pinContainer;qrCanvas;statusText;floatingBadge=null;constructor(){this.el=document.createElement("div"),this.el.className="tv-pairing-overlay",this.el.innerHTML=`
      <div class="tv-pairing-card">
        <div class="tv-brand-tag">
          <span class="live-dot"></span>
          <span>4K Display Receiver</span>
        </div>
        <h1 class="tv-pairing-title">VibeField</h1>
        <p class="tv-pairing-subtitle">
          Turn this screen into a living HDR fluid field driven by your phone’s microphone.
        </p>

        <div class="tv-pin-section">
          <div class="tv-pin-label">PAIRING PIN</div>
          <div class="tv-pin-digits" id="tvPinDigits">
            <span class="pin-box">·</span>
            <span class="pin-box">·</span>
            <span class="pin-box">·</span>
            <span class="pin-box">·</span>
          </div>
        </div>

        <div class="tv-qr-container">
          <canvas id="tvQrCanvas" width="180" height="180"></canvas>
          <div class="tv-qr-caption">
            <span>Or scan with phone camera to connect instantly</span>
          </div>
        </div>

        <div class="tv-pairing-status" id="tvPairingStatus">
          <div class="tv-spinner"></div>
          <span>Waiting for phone connection...</span>
        </div>

        <div class="tv-instructions">
          <div>✓ Zero TV typing required</div>
          <div>✓ Phone acts as room listener & remote</div>
          <div>✓ Native 4K 60fps WebGPU rendering locally</div>
        </div>
      </div>
    `,document.body.appendChild(this.el),this.pinContainer=this.el.querySelector("#tvPinDigits"),this.qrCanvas=this.el.querySelector("#tvQrCanvas"),this.statusText=this.el.querySelector("#tvPairingStatus")}setPin(e){if(!this.pinContainer)return;const n=e.split("");this.pinContainer.innerHTML=n.map(i=>`<span class="pin-box pin-active">${i}</span>`).join("");const t=new URL(window.location.href);t.searchParams.set("connect",e),t.searchParams.delete("mode"),js.toCanvas(this.qrCanvas,t.toString(),{width:180,margin:1,color:{dark:"#ffffff",light:"#0a0d14"}}).catch(i=>{console.warn("QR code generation failed:",i)})}onPairedSuccess(){this.statusText.innerHTML=`
      <span class="tv-success-icon">✓</span>
      <span style="color: #4ade80; font-weight: 600;">Phone Connected! Entering 4K Visualizer...</span>
    `,setTimeout(()=>{this.el.classList.add("tv-fade-out"),setTimeout(()=>{this.el.parentElement&&this.el.parentElement.removeChild(this.el)},700),this.showFloatingBadge()},1200)}showFloatingBadge(){this.floatingBadge||(this.floatingBadge=document.createElement("div"),this.floatingBadge.className="tv-floating-badge",this.floatingBadge.innerHTML=`
      <span class="live-dot green"></span>
      <span>TV Receiver • Phone Mic Live</span>
    `,document.body.appendChild(this.floatingBadge),setTimeout(()=>{this.floatingBadge&&this.floatingBadge.classList.add("faded")},5e3))}showDisconnectedNotice(){this.floatingBadge&&(this.floatingBadge.innerHTML=`
        <span class="live-dot orange"></span>
        <span>Phone Disconnected • Ambient Synth Active</span>
      `,this.floatingBadge.classList.remove("faded"))}destroy(){this.el.parentElement&&this.el.parentElement.removeChild(this.el),this.floatingBadge&&this.floatingBadge.parentElement&&this.floatingBadge.parentElement.removeChild(this.floatingBadge)}}class Ks{el;callbacks;settings;pinInputs=[];isConnected=!1;currentPin="";pairingSection;remoteSection;statusBadge;spectrumContainer;bpmBadge;energyFill;keyBadge;latencyBadge;constructor(e,n,t){this.settings={...e},this.callbacks=n,this.currentPin=t||"",this.el=document.createElement("div"),this.el.className="phone-remote-container",this.el.innerHTML=`
      <div class="phone-remote-header">
        <div class="phone-remote-brand">
          <span class="phone-remote-dot"></span>
          <span>VibeField Remote</span>
        </div>
        <button class="phone-exit-btn" id="btnExitRemote" title="Exit to Solo Mode">✕</button>
      </div>

      <!-- PAIRING SCREEN -->
      <div class="phone-pairing-panel" id="phonePairingPanel">
        <div class="phone-pairing-icon">📺</div>
        <h2 class="phone-pairing-title">Connect to TV</h2>
        <p class="phone-pairing-desc">
          Enter the 4-digit PIN displayed on your TV screen to start streaming live room music & controlling the display.
        </p>

        <div class="phone-pin-inputs">
          <input type="tel" maxlength="1" class="pin-digit-input" data-index="0" inputmode="numeric" />
          <input type="tel" maxlength="1" class="pin-digit-input" data-index="1" inputmode="numeric" />
          <input type="tel" maxlength="1" class="pin-digit-input" data-index="2" inputmode="numeric" />
          <input type="tel" maxlength="1" class="pin-digit-input" data-index="3" inputmode="numeric" />
        </div>

        <button class="phone-connect-btn" id="btnConnectTv">
          <span>Connect to TV</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </button>

        <div class="phone-cast-option" id="castOptionWrapper" style="display: none;">
          <div class="phone-divider"><span>OR</span></div>
          <button class="phone-cast-btn" id="btnCastScreen">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 16.1A5 5 0 0 1 5.9 20M2 12.05A9 9 0 0 1 9.95 20M2 8V6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-6"/><line x1="2" y1="20" x2="2.01" y2="20"/></svg>
            <span>Cast to Nearby Android TV / Chromecast</span>
          </button>
        </div>

        <div class="phone-pairing-error" id="pairingError" style="display: none;"></div>
      </div>

      <!-- CONNECTED REMOTE CONTROLLER -->
      <div class="phone-active-panel" id="phoneActivePanel" style="display: none;">
        <!-- Status Bar -->
        <div class="remote-status-card">
          <div class="remote-status-left">
            <span class="live-pulse"></span>
            <div>
              <div class="remote-tv-name">TV Screen Linked</div>
              <div class="remote-latency" id="remoteLatency">Latency: &lt;10ms</div>
            </div>
          </div>
          <button class="remote-disconnect-btn" id="btnDisconnect">Disconnect</button>
        </div>

        <!-- Audio Producer Status -->
        <div class="remote-card audio-status-card">
          <div class="card-title">
            <span>🎤 Live Room Audio</span>
            <span class="audio-source-badge" id="audioSourceBadge">Microphone</span>
          </div>
          
          <div class="remote-spectrum-strip" id="remoteSpectrum">
            <!-- 10 dynamic bars -->
            <div class="spec-bar"></div>
            <div class="spec-bar"></div>
            <div class="spec-bar"></div>
            <div class="spec-bar"></div>
            <div class="spec-bar"></div>
            <div class="spec-bar"></div>
            <div class="spec-bar"></div>
            <div class="spec-bar"></div>
            <div class="spec-bar"></div>
            <div class="spec-bar"></div>
          </div>

          <div class="remote-audio-stats">
            <div class="stat-pill"><span class="label">BPM:</span> <span class="val" id="remoteBpm">--</span></div>
            <div class="stat-pill"><span class="label">Key:</span> <span class="val" id="remoteKey">--</span></div>
            <div class="stat-pill"><span class="label">Energy:</span> <span class="val" id="remoteEnergy">--</span></div>
          </div>

          <div class="source-toggle-row">
            <button class="source-toggle-btn active" id="btnSourceMic">🎤 Room Mic</button>
            <button class="source-toggle-btn" id="btnSourceDemo">🎵 Demo Synth</button>
          </div>
        </div>

        <!-- Remote Controls -->
        <div class="remote-card">
          <div class="card-title">Visual Presets</div>
          <div class="preset-pill-grid">
            <button class="preset-pill" data-preset="auto">Auto Mood</button>
            <button class="preset-pill" data-preset="ink">1. Ink</button>
            <button class="preset-pill" data-preset="lava">2. Lava</button>
            <button class="preset-pill" data-preset="aurora">3. Aurora</button>
            <button class="preset-pill" data-preset="neon">4. Neon</button>
            <button class="preset-pill" data-preset="ocean">5. Ocean</button>
          </div>
        </div>

        <!-- Color Temperature Range -->
        <div class="remote-card">
          <div class="card-title">
            <span>Color Temperature</span>
            <span class="temp-val" id="tempValText">Neutral</span>
          </div>
          <div class="quick-temp-row">
            <button class="quick-temp-btn" id="btnTempCool">❄ Cool</button>
            <button class="quick-temp-btn active" id="btnTempNeutral">⚪ Neutral</button>
            <button class="quick-temp-btn" id="btnTempWarm">🔥 Warm</button>
          </div>
          <input type="range" min="-1.0" max="1.0" step="0.05" value="0.0" class="remote-slider" id="sliderColorTemp" />
        </div>

        <!-- Sensitivity & Viscosity -->
        <div class="remote-card">
          <div class="card-title">
            <span>Audio Sensitivity</span>
            <span class="temp-val" id="sensValText">1.0x</span>
          </div>
          <input type="range" min="0.2" max="3.0" step="0.1" value="1.0" class="remote-slider" id="sliderSensitivity" />

          <div class="card-title" style="margin-top: 16px;">
            <span>Fluid Viscosity</span>
            <span class="temp-val" id="viscValText">Balanced</span>
          </div>
          <input type="range" min="-1.0" max="1.0" step="0.1" value="0.0" class="remote-slider" id="sliderViscosity" />
        </div>
      </div>
    `,document.body.appendChild(this.el),this.initDOMElements(),this.bindEvents(),t&&t.length===4&&(this.setPin(t),this.attemptConnect(t))}initDOMElements(){this.pairingSection=this.el.querySelector("#phonePairingPanel"),this.remoteSection=this.el.querySelector("#phoneActivePanel"),this.pinInputs=Array.from(this.el.querySelectorAll(".pin-digit-input")),this.spectrumContainer=this.el.querySelector("#remoteSpectrum"),this.bpmBadge=this.el.querySelector("#remoteBpm"),this.keyBadge=this.el.querySelector("#remoteKey"),this.latencyBadge=this.el.querySelector("#remoteLatency");const e=this.el.querySelector("#castOptionWrapper");Ct.isPresentationSupported()&&e&&(e.style.display="block")}bindEvents(){this.pinInputs.forEach((g,T)=>{g.addEventListener("input",B=>{const m=g.value;m.length>=1&&(g.value=m[m.length-1],T<this.pinInputs.length-1&&this.pinInputs[T+1].focus()),this.checkAutoSubmit()}),g.addEventListener("keydown",B=>{B.key==="Backspace"&&!g.value&&T>0&&this.pinInputs[T-1].focus()}),g.addEventListener("paste",B=>{B.preventDefault();const m=B.clipboardData?.getData("text").trim()||"";m.length===4&&/^\d+$/.test(m)&&(this.setPin(m),this.checkAutoSubmit())})}),this.el.querySelector("#btnConnectTv")?.addEventListener("click",()=>{const g=this.getEnteredPin();g.length===4?this.attemptConnect(g):this.showError("Please enter all 4 digits of the PIN displayed on your TV.")}),this.el.querySelector("#btnCastScreen")?.addEventListener("click",async()=>{try{const g=this.getEnteredPin();await Ct.requestCast(g.length===4?g:void 0)}catch(g){this.showError(g.message||"Cast failed")}}),this.el.querySelector("#btnExitRemote")?.addEventListener("click",()=>{this.callbacks.onExitToSolo()}),this.el.querySelector("#btnDisconnect")?.addEventListener("click",()=>{this.callbacks.onDisconnect(),this.setConnectedState(!1)});const r=this.el.querySelectorAll(".preset-pill");r.forEach(g=>{g.addEventListener("click",()=>{const T=g.getAttribute("data-preset");r.forEach(B=>B.classList.remove("active")),g.classList.add("active"),this.settings.activePreset=T,this.callbacks.onSettingsChange({activePreset:T})})});const o=this.el.querySelector("#sliderColorTemp"),a=this.el.querySelector("#tempValText"),c=this.el.querySelector("#btnTempCool"),l=this.el.querySelector("#btnTempNeutral"),u=this.el.querySelector("#btnTempWarm"),h=g=>{o.value=g.toString(),g<=-.15?(a.textContent=`Cool (${Math.round(g*100)}%)`,c.classList.add("active"),l.classList.remove("active"),u.classList.remove("active")):g>=.15?(a.textContent=`Warm (+${Math.round(g*100)}%)`,c.classList.remove("active"),l.classList.remove("active"),u.classList.add("active")):(a.textContent="Neutral",c.classList.remove("active"),l.classList.add("active"),u.classList.remove("active"))};o?.addEventListener("input",()=>{const g=parseFloat(o.value);h(g),this.settings.colorTempBias=g,this.callbacks.onSettingsChange({colorTempBias:g})}),c?.addEventListener("click",()=>{h(-.6),this.callbacks.onSettingsChange({colorTempBias:-.6})}),l?.addEventListener("click",()=>{h(0),this.callbacks.onSettingsChange({colorTempBias:0})}),u?.addEventListener("click",()=>{h(.6),this.callbacks.onSettingsChange({colorTempBias:.6})});const d=this.el.querySelector("#sliderSensitivity"),f=this.el.querySelector("#sensValText");d?.addEventListener("input",()=>{const g=parseFloat(d.value);f.textContent=`${g.toFixed(1)}x`,this.settings.sensitivity=g,this.callbacks.onSettingsChange({sensitivity:g})});const v=this.el.querySelector("#sliderViscosity"),y=this.el.querySelector("#viscValText");v?.addEventListener("input",()=>{const g=parseFloat(v.value);y.textContent=g<-.1?"Fluid":g>.1?"Viscous":"Balanced",this.settings.viscosityBias=g,this.callbacks.onSettingsChange({viscosityBias:g})});const P=this.el.querySelector("#btnSourceMic"),C=this.el.querySelector("#btnSourceDemo"),M=this.el.querySelector("#audioSourceBadge");P?.addEventListener("click",()=>{P.classList.add("active"),C.classList.remove("active"),M.textContent="Microphone",this.callbacks.onToggleSource("mic")}),C?.addEventListener("click",()=>{C.classList.add("active"),P.classList.remove("active"),M.textContent="Demo Synth",this.callbacks.onToggleSource("demo")})}setPin(e){const n=e.split("");this.pinInputs.forEach((t,i)=>{t.value=n[i]||""})}getEnteredPin(){return this.pinInputs.map(e=>e.value).join("")}checkAutoSubmit(){const e=this.getEnteredPin();e.length===4&&this.attemptConnect(e)}async attemptConnect(e){const n=this.el.querySelector("#btnConnectTv");n&&(n.disabled=!0,n.innerHTML='<span class="tv-spinner-small"></span> Connecting...'),this.hideError();const t=await this.callbacks.onConnect(e);n&&(n.disabled=!1,n.innerHTML='<span>Connect to TV</span><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>'),t?(this.currentPin=e,this.setConnectedState(!0)):this.showError("Unable to connect to TV. Make sure the 4-digit PIN matches the TV screen.")}setConnectedState(e){this.isConnected=e,e?(this.pairingSection.style.display="none",this.remoteSection.style.display="block"):(this.pairingSection.style.display="block",this.remoteSection.style.display="none")}updateLiveTelemetry(e,n){if(this.isConnected&&(this.bpmBadge&&(this.bpmBadge.textContent=`${Math.round(e.bpm)} BPM`),this.keyBadge&&(this.keyBadge.textContent=e.pitchInfo?`${e.pitchInfo.pitchName} (${Math.round(e.harmonicLiquid?.dominantHue??0)}°)`:"--"),this.latencyBadge&&(this.latencyBadge.textContent=`Latency: ${n}ms`),this.spectrumContainer&&e.spectrumBands)){const t=this.spectrumContainer.querySelectorAll(".spec-bar");e.spectrumBands.forEach((i,r)=>{if(t[r]){const o=Math.max(8,Math.min(100,Math.round(i.amplitude*100)));t[r].style.height=`${o}%`}})}}showError(e){const n=this.el.querySelector("#pairingError");n&&(n.textContent=e,n.style.display="block")}hideError(){const e=this.el.querySelector("#pairingError");e&&(e.style.display="none")}destroy(){this.el.parentElement&&this.el.parentElement.removeChild(this.el)}}const yi="vibefield_settings_v2",pt={sensitivity:1,viscosityBias:0,colorTempBias:0,paletteBias:0,paletteShiftMode:"shifting",paletteShiftSpeed:1,hdrIntensity:.6,smoothing:.12,selectedDeviceId:"default",inputMode:"mic",activePreset:"auto",enableSmartLights:!1,smartLightWsUrl:"ws://localhost:8080/wled"};class Xs{canvas;renderer=null;audioEngine;notifications;settingsModal;deviceModal;debugOverlay;mediaCapture;smartLights;operatingMode="standalone";peerBridge=new Ct;tvPairingScreen=null;phoneRemoteView=null;remoteMood=null;settings;isStarted=!1;lastFrameTime=0;cursorTimer=null;constructor(){this.canvas=document.getElementById("vibeCanvas"),this.notifications=new Kn,this.debugOverlay=new Jn,this.settings=this.loadSettings(),this.smartLights=new Zn(this.settings.smartLightWsUrl,this.settings.enableSmartLights),this.mediaCapture=new Qn(this.canvas,(i,r)=>{this.notifications.show(i,3e3,r)}),this.audioEngine=new Pn({onError:i=>{console.warn("[AudioEngine]",i),this.notifications.show(i,4e3,"error")},onDevicesUpdated:i=>{this.deviceModal?.setDevices(i,this.settings.selectedDeviceId),this.settingsModal?.setDevices(i,this.settings.selectedDeviceId)},onModeChanged:i=>{const r={mic:"Microphone Audio Active",tab:"Tab / System Audio Active",demo:"Demo Synthesizer Active (Press M to cycle)"};this.notifications.show(r[i]||i,2500,"success")}}),this.deviceModal=new Yn(i=>{this.settings.selectedDeviceId=i,this.saveSettings(),this.audioEngine.selectDevice(i),this.notifications.show("Switched audio input device",2e3,"info")}),this.settingsModal=new Xn(this.settings,{onUpdate:i=>{this.settings={...i},this.saveSettings(),this.smartLights.setEnabled(this.settings.enableSmartLights),this.smartLights.setUrl(this.settings.smartLightWsUrl)},onReset:()=>{this.settings={...pt},this.saveSettings(),this.settingsModal.updateValues(this.settings),this.notifications.show("Settings reset to defaults",2e3,"info")},onSelectDevice:i=>{this.settings.selectedDeviceId=i,this.saveSettings(),this.audioEngine.selectDevice(i)},onCaptureTab:()=>{this.audioEngine.captureTabAudio()},onToggleDemo:()=>{this.cycleDemoMode()},onSelectPreset:i=>{this.setPreset(i)},onTakeScreenshot:()=>{this.mediaCapture.takeScreenshot()},onToggleRecording:()=>{this.mediaCapture.toggleRecording()}}),this.bindWindowEvents();const e=new URLSearchParams(window.location.search),n=e.get("connect")||e.get("pair"),t=e.get("mode");if(n)this.startPhoneRemote(n);else if(t==="tv")this.startTVReceiver();else if(t==="phone"||t==="remote")this.startPhoneRemote();else if(e.get("autostart")==="1"||t&&["low","high","surge","dynamic","ambient"].includes(t)){const i=e.get("mode")||"dynamic";e.get("preset")&&this.setPreset(e.get("preset"),!1),e.get("debug")==="1"&&this.debugOverlay.show(),this.start(i)}else new Wn({onStartSolo:()=>this.start(),onStartPhoneRemote:()=>this.startPhoneRemote(),onStartTVReceiver:()=>this.startTVReceiver()})}async startTVReceiver(){this.isStarted||(this.operatingMode="tv",this.isStarted=!0,await this.initRenderer(),this.handleResize(),await this.audioEngine.initialize(this.settings.selectedDeviceId,"dynamic"),this.tvPairingScreen=new Ws,await this.peerBridge.initTV({onPinReady:e=>{this.tvPairingScreen?.setPin(e)},onConnected:()=>{this.tvPairingScreen?.onPairedSuccess(),this.notifications.show("Phone Connected! Streaming live room audio in 4K.",4e3,"success")},onMoodTick:e=>{this.remoteMood=e},onSettingsUpdate:e=>{this.settings={...this.settings,...e},this.saveSettings(),e.activePreset&&this.setPreset(e.activePreset,!1)},onDisconnected:()=>{this.remoteMood=null,this.tvPairingScreen?.showDisconnectedNotice(),this.notifications.show("Phone disconnected. Ambient synth active.",3e3,"info")},onError:e=>{console.warn("[TV Receiver Peer Error]",e)}}),this.lastFrameTime=performance.now(),requestAnimationFrame(this.renderLoop))}async startPhoneRemote(e){this.operatingMode="phone",this.isStarted=!0,await this.audioEngine.initialize(this.settings.selectedDeviceId),this.phoneRemoteView=new Ks(this.settings,{onConnect:async n=>await this.peerBridge.connectToTV(n,{onConnected:()=>{this.notifications.show(`Connected to TV [ PIN: ${n} ]`,3e3,"success")},onError:t=>{this.notifications.show(t,4e3,"error")},onDisconnected:()=>{this.notifications.show("Disconnected from TV",2500,"info"),this.phoneRemoteView?.setConnectedState(!1)}}),onDisconnect:()=>{this.peerBridge.destroy(),this.notifications.show("Disconnected from TV",2e3,"info")},onSettingsChange:n=>{this.settings={...this.settings,...n},this.saveSettings(),this.peerBridge.sendSettings(n)},onToggleSource:n=>{n==="mic"?this.audioEngine.selectDevice(this.settings.selectedDeviceId):this.audioEngine.startDemo("dynamic")},onExitToSolo:()=>{window.location.href=window.location.pathname}},e),setInterval(()=>{const n=performance.now()*.001,t=this.audioEngine.update(n,this.settings);t&&(this.peerBridge.isConnected()&&this.peerBridge.sendMoodTick(t),this.phoneRemoteView?.updateLiveTelemetry(t,this.peerBridge.getLatency()))},1e3/60)}loadSettings(){try{const e=localStorage.getItem(yi);if(e)return{...pt,...JSON.parse(e)}}catch(e){console.warn("Failed to parse saved settings:",e)}return{...pt}}saveSettings(){try{localStorage.setItem(yi,JSON.stringify(this.settings))}catch(e){console.warn("Failed to save settings to localStorage:",e)}}setPreset(e,n=!0){if(this.settings.activePreset=e,this.saveSettings(),this.settingsModal.setPreset(e),n){const t={auto:"Preset: Auto (Adaptive Mood)",ink:"Preset 1: Ink in Water",lava:"Preset 2: Lava Lamp",aurora:"Preset 3: Aurora Borealis",neon:"Preset 4: Neon Club",ocean:"Preset 5: Deep Ocean"};this.notifications.show(t[e]||e,2500,"info")}}async initRenderer(){try{const e=new Fn(this.canvas);if(await e.init()){this.renderer=e;const t=e.getStats();console.log(`Initialized Navier-Stokes Fluid Engine: ${t.rendererType} (${t.canvasFormat}, ${t.colorSpace})`);return}}catch(e){console.warn("WebGPU initialization failed, falling back to WebGL2 Navier-Stokes:",e)}try{console.info("Initializing WebGL2 Navier-Stokes Fluid renderer...");const e=new jn(this.canvas);if(await e.init()){this.renderer=e,console.log("Initialized WebGL2 Navier-Stokes Fluid renderer.");return}}catch(e){console.warn("WebGL2 fluid initialization failed:",e)}try{const e=new Dn(this.canvas);if(await e.init()){this.renderer=e,console.log("Initialized Cinematic Fluid Renderer fallback.");return}}catch(e){console.warn("CinematicFluidRenderer fallback failed:",e)}this.notifications.show("Your browser does not support WebGPU or WebGL2.",8e3,"error")}async start(e){this.isStarted||(this.isStarted=!0,await this.initRenderer(),this.handleResize(),await this.audioEngine.initialize(this.settings.selectedDeviceId,e),setTimeout(()=>{this.notifications.show("VibeField active. Press H for settings, F for fullscreen, 0-5 for presets.",3800,"info")},800),this.lastFrameTime=performance.now(),requestAnimationFrame(this.renderLoop))}renderLoop=e=>{requestAnimationFrame(this.renderLoop);const n=(e-this.lastFrameTime)*.001;this.lastFrameTime=e;const t=e*.001;let i=null;this.operatingMode==="tv"&&this.remoteMood?i=this.remoteMood:i=this.audioEngine.update(t,this.settings),i||(i=this.createIdleMood(t)),this.renderer&&(this.renderer.render(i,this.settings,n),this.debugOverlay.update(i,this.renderer.getStats()),this.smartLights.update(i)),window.__vibefield={mood:i,stats:this.renderer?.getStats(),settings:this.settings}};createIdleMood(e){const n=(Math.sin(e*.6)+1)*.5,t=[];for(let r=0;r<10;r++){const o=r/9,a=o<=.5?265+-40*(o/.5):225+-30*((o-.5)/.5),c=.44+r*.012,l=.33,u=ae(c,l,a);t.push({index:r,name:`Band ${r}`,minHz:40*Math.pow(2,r*.8),maxHz:75*Math.pow(2,r*.8),centerHz:60*Math.pow(2,r*.8),amplitude:.15+n*.08,rawHue:a,effectiveHue:a,lightness:c,chroma:l,oklab:[u.L,u.a,u.b]})}const i=ae(.44+n*.04,.33,235);return{bpm:75,rawBpm:75,energy:.18+n*.06,brightness:.5,hueSpreadDeg:45,colorTemperature:{temperature:-.6,isWarm:!1,family:"cold",baseHue:235,baseLab:[i.L,i.a,i.b],description:"Cool Gradient (Sapphire, Cobalt & Aqua)",rotationAngle:235,isShifting:!1},spectrumBands:t,pitchInfo:{chroma12:new Array(12).fill(.08),dominantPitchClass:9,pitchName:"A",circleOfFifthsIndex:3,pitchRotationAngle:90,majorMinorScore:-.5,biasApplied:-.08},ebbSurge:{masterIntensity:.2,shortEnergy:.15,longEnergy:.2,dynamicsRatio:.75,isEbb:!1,isSurge:!1,surgeTimer:999,ebbDepth:0,calibrationFloor:.05,calibrationCeil:.8,calibrationReady:!0},isBeat:!1,beatIntensity:0,isKick:!1,kickIntensity:0,isHiHat:!1,hiHatIntensity:0,midRangeSwirl:.1,isSilent:!0,activePreset:this.settings.activePreset,harmonicLiquid:{dominantHue:30,support1Hue:55,support2Hue:5,accentHue:90,complementaryHue:210,fluidVelocity:.12,zCoordinate:e*.12,amplitude:.15+n*.05,amplitudeDerivative:0,bpmFlowScale:1,randomAngle:0,isBurst:!1,burstIntensity:0,burstRadius:0,burstOrigin:[.5,.5],dissonanceFactor:0,musicalMode:"major",colorTempBias:0},dominantColor:{r:.12,g:.18,b:.38,hex:"#1f2e61",lightness:.2}}}cycleDemoMode(){const e=this.audioEngine.getDemoMood();e==="off"?(this.audioEngine.startDemo("low"),this.notifications.show("Demo: Low Energy (Slow Ambient Sine Pad)",2800,"info")):e==="low"?(this.audioEngine.setDemoMood("high"),this.notifications.show("Demo: High Energy (135 BPM Four-on-the-Floor Beat)",2800,"info")):e==="high"?(this.audioEngine.setDemoMood("surge"),this.notifications.show("Demo: Ebb into Sudden Surge Drop Test!",2800,"info")):e==="surge"?(this.audioEngine.setDemoMood("dynamic"),this.notifications.show("Demo: Dynamic Progression Cycle",2800,"info")):(this.audioEngine.stop(),this.audioEngine.selectDevice(this.settings.selectedDeviceId),this.notifications.show("Demo Off: Returning to Microphone",2800,"info"))}adjustColorTempBias(e,n=!1){if(n)this.settings.colorTempBias=0;else{const i=this.settings.colorTempBias??0;this.settings.colorTempBias=Math.max(-1,Math.min(1,Math.round((i+e)*100)/100))}this.saveSettings(),this.settingsModal.updateValues(this.settings);const t=this.settings.colorTempBias;t>.04?this.notifications.show(`Color Temp Filter: +${Math.round(t*100)}% Warm 🔥`,2e3,"info"):t<-.04?this.notifications.show(`Color Temp Filter: ${Math.round(t*100)}% Cool ❄`,2e3,"info"):this.notifications.show("Color Temp Filter: Neutral (Auto Harmonic) ⚪",2e3,"info")}toggleFullscreen(){document.fullscreenElement?document.exitFullscreen().catch(e=>console.warn("Exit fullscreen error:",e)):document.documentElement.requestFullscreen().catch(e=>console.warn("Fullscreen error:",e))}handleResize(){const e=window.innerWidth,n=window.innerHeight;this.canvas.style.width=`${e}px`,this.canvas.style.height=`${n}px`,this.renderer&&this.renderer.resize(e,n)}resetCursorTimer(){document.body.classList.remove("cursor-hidden"),this.cursorTimer!==null&&window.clearTimeout(this.cursorTimer),this.cursorTimer=window.setTimeout(()=>{!this.settingsModal.getIsOpen()&&!this.deviceModal.getIsOpen()&&document.body.classList.add("cursor-hidden")},2e3)}bindWindowEvents(){window.addEventListener("resize",()=>this.handleResize()),window.addEventListener("mousemove",()=>this.resetCursorTimer()),window.addEventListener("keydown",()=>this.resetCursorTimer()),window.addEventListener("touchstart",()=>this.resetCursorTimer()),this.resetCursorTimer(),document.addEventListener("visibilitychange",()=>{document.visibilityState==="visible"&&this.audioEngine.resume()}),window.addEventListener("keydown",e=>{const n=e.target?.tagName;if(n==="INPUT"||n==="SELECT"||n==="TEXTAREA"){e.key==="Escape"&&e.target.blur();return}const t=e.key.toUpperCase();e.key==="0"?this.setPreset("auto"):e.key==="1"?this.setPreset("ink"):e.key==="2"?this.setPreset("lava"):e.key==="3"?this.setPreset("aurora"):e.key==="4"?this.setPreset("neon"):e.key==="5"?this.setPreset("ocean"):t==="H"?(e.preventDefault(),this.settingsModal.toggle()):t==="D"?(e.preventDefault(),this.deviceModal.toggle()):t==="T"?(e.preventDefault(),this.audioEngine.captureTabAudio()):t==="B"?(e.preventDefault(),this.debugOverlay.toggle()):t==="F"?(e.preventDefault(),this.toggleFullscreen()):t==="M"?(e.preventDefault(),this.cycleDemoMode()):t==="S"?(e.preventDefault(),this.mediaCapture.takeScreenshot()):t==="R"?(e.preventDefault(),this.mediaCapture.toggleRecording()):e.key==="["?(e.preventDefault(),this.adjustColorTempBias(-.25)):e.key==="]"?(e.preventDefault(),this.adjustColorTempBias(.25)):t==="N"?(e.preventDefault(),this.adjustColorTempBias(0,!0)):e.key==="Escape"&&(this.settingsModal.hide(),this.deviceModal.hide())})}}window.addEventListener("DOMContentLoaded",()=>{new Xs});
