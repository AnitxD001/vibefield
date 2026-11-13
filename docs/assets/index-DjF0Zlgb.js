function mn(s,e){for(var i=0;i<e.length;i++){const t=e[i];if(typeof t!="string"&&!Array.isArray(t)){for(const n in t)if(n!=="default"&&!(n in s)){const r=Object.getOwnPropertyDescriptor(t,n);r&&Object.defineProperty(s,n,r.get?r:{enumerable:!0,get:()=>t[n]})}}}return Object.freeze(Object.defineProperty(s,Symbol.toStringTag,{value:"Module"}))}(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))t(n);new MutationObserver(n=>{for(const r of n)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&t(o)}).observe(document,{childList:!0,subtree:!0});function i(n){const r={};return n.integrity&&(r.integrity=n.integrity),n.referrerPolicy&&(r.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?r.credentials="include":n.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function t(n){if(n.ep)return;n.ep=!0;const r=i(n);fetch(n.href,r)}})();function ae(s,e,i){const t=i*Math.PI/180;return{L:s,a:e*Math.cos(t),b:e*Math.sin(t)}}function gn(s,e,i){const t=Math.sqrt(e*e+i*i);let r=Math.atan2(i,e)*180/Math.PI;return r<0&&(r+=360),{L:s,C:t,H:r}}function vn(s,e,i){const t=s+.3963377774*e+.2158037573*i,n=s-.1055613458*e-.0638541728*i,r=s-.0894841775*e-1.291485548*i,o=t*t*t,a=n*n*n,c=r*r*r,l=4.0767434796*o-3.3077115913*a+.2309699267*c,u=-1.2684380046*o+2.6097574011*a-.3413193965*c,h=-.0041960863*o-.7034186147*a+1.707614701*c;return{r:Math.max(0,l),g:Math.max(0,u),b:Math.max(0,h)}}function At(s,e,i){const t=ae(s,e,i);return vn(t.L,t.a,t.b)}function bn(s,e,i){const t=n=>{const r=Math.max(0,Math.min(1,n)),o=r<=.0031308?r*12.92:1.055*Math.pow(r,1/2.4)-.055;return Math.round(o*255).toString(16).padStart(2,"0")};return`#${t(s)}${t(e)}${t(i)}`}const yn=`
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
`,Sn=["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"],Cn=[{name:"Sub-bass",minHz:40,maxHz:75},{name:"Bass Low",minHz:75,maxHz:150},{name:"Bass High",minHz:150,maxHz:300},{name:"Low-mid",minHz:300,maxHz:600},{name:"Mid Low",minHz:600,maxHz:1200},{name:"Mid High",minHz:1200,maxHz:2400},{name:"High-mid",minHz:2400,maxHz:4e3},{name:"Presence",minHz:4e3,maxHz:6500},{name:"Treble Low",minHz:6500,maxHz:9500},{name:"Treble High",minHz:9500,maxHz:12e3}];function He(s,e,i){return{L:(1-i)*s.L+i*e.L,a:(1-i)*s.a+i*e.a,b:(1-i)*s.b+i*e.b}}class Tt{smoothedTemperature=-.6;smoothedPitchAngle=0;smoothedMajorMinor=0;static PITCH_TO_FIFTHS=[0,7,2,9,4,11,6,1,8,3,10,5];constructor(){}processBands(e,i,t,n,r,o="shifting",a=1,c=.5,l=.1,u=.5,h=!1,d=0,f){const g=this.analyzeChroma(t,r),y=f?f.dominantHue:30,P=f?f.support1Hue:(y+25)%360,C=f?f.support2Hue:(y-25+360)%360;f?f.accentHue:(y+60)%360;const M=f?f.complementaryHue:(y+180)%360,v=f?f.dissonanceFactor:0,R=ae(.44+c*.04,.33,C),A=ae(.5+c*.05,.36,y),m=ae(.56+c*.06,.35,P),E=ae(.52+c*.05,.36,M),x=[],_=[];for(let F=0;F<10;F++){const B=Cn[F],I=this.computeBandAmplitude(e,B.minHz,B.maxHz,i),V=F/9;let U;if(V<=.5){const O=V/.5;U=He(R,A,O)}else{const O=(V-.5)/.5;U=He(A,m,O)}if(v>.15&&(F===4||F===7||F===9||v>.5&&F>=5)){const O=Math.min(.85,(v-.15)*1.4);U=He(U,E,O)}const G=gn(U.L,U.a,U.b);x.push({index:F,name:B.name,minHz:B.minHz,maxHz:B.maxHz,centerHz:Math.sqrt(B.minHz*B.maxHz),amplitude:I,rawHue:G.H,effectiveHue:G.H,lightness:U.L,chroma:G.C,oklab:[U.L,U.a,U.b]}),I>.04&&_.push({hue:G.H,weight:I})}const L=Math.max(.44,Math.min(.54,.46+c*.05)),T=ae(L,.32,y),b=this.calculateHueSpread(_),p=y>=340||y<=90,S=f?f.colorTempBias:0;let w=`Harmonic: ${g.pitchName} (${Math.round(y)}°) • ${f?f.musicalMode.toUpperCase():"MAJOR"}`;S>.04?w=`Warm Filter (+${Math.round(S*100)}%): ${g.pitchName} (${Math.round(y)}°)`:S<-.04&&(w=`Cool Filter (${Math.round(S*100)}%): ${g.pitchName} (${Math.round(y)}°)`);const z={temperature:S!==0?S:p?.7:-.7,isWarm:S!==0?S>0:p,family:S>0||S===0&&p?"warm":"cold",baseHue:Math.round(y),baseLab:[T.L,T.a,T.b],description:w,rotationAngle:Math.round(y),isShifting:!1};return{bands:x,pitchInfo:g,hueSpreadDeg:Math.round(b),colorTemperature:z}}analyzeChroma(e,i){let t=0,n=0;const r=new Array(12);for(let v=0;v<12;v++){const R=e[v]||0;r[v]=R,R>n&&(n=R,t=v)}const o=Tt.PITCH_TO_FIFTHS[t],a=o*30,c=1-Math.exp(-i/2.8);let l=a-this.smoothedPitchAngle;l>180&&(l-=360),l<-180&&(l+=360),this.smoothedPitchAngle=(this.smoothedPitchAngle+l*c+360)%360;const u=e[t],h=e[(t+4)%12]||0,d=e[(t+3)%12]||0,f=e[(t+7)%12]||0,g=u+h*1.6+f*1.1,y=u+d*1.6+f*1.1,P=(g-y)/Math.max(.01,g+y),C=1-Math.exp(-i/2);this.smoothedMajorMinor+=(P-this.smoothedMajorMinor)*C;const M=Math.max(-.15,Math.min(.15,this.smoothedMajorMinor*.25));return{chroma12:r,dominantPitchClass:t,pitchName:Sn[t],circleOfFifthsIndex:o,pitchRotationAngle:this.smoothedPitchAngle,majorMinorScore:this.smoothedMajorMinor,biasApplied:M}}computeBandAmplitude(e,i,t,n){const r=Math.max(0,Math.floor(i/n)),o=Math.min(e.length-1,Math.ceil(t/n));if(r>o)return 0;let a=0,c=0;for(let l=r;l<=o;l++)a+=e[l],c++;return c>0?a/c:0}calculateHueSpread(e){if(e.length<2)return 50;let i=0,t=0,n=0;for(const a of e){const c=a.hue*Math.PI/180;i+=Math.sin(c)*a.weight,t+=Math.cos(c)*a.weight,n+=a.weight}if(n<=.001)return 50;const r=Math.sqrt(i*i+t*t)/n,o=Math.sqrt(Math.max(0,2*(1-r)));return Math.min(360,o*180/Math.PI)}}const Tn=[30,350,80,300,250,5,180,55,325,215,260,280];class _n{dominantHue=30;isInitialized=!1;streamAge=0;zCoordinate=0;prevAmplitude=0;smoothedAmp=0;fluidVelocity=.25;wanderingAngle=0;beatDanceMomentum=0;burstIntensity=0;burstRadius=0;burstOrigin=[.5,.5];timeSinceLastBurst=999;dissonanceFactor=0;constructor(){}update(e,i,t,n,r,o,a=!1,c=!1,l=0,u=120,h=!1){const d=Math.max(.001,Math.min(.1,r));this.streamAge+=d;let f=0,g=0,y=0;for(let H=0;H<12;H++){const N=t[H];y+=N,N>g&&(g=N,f=H)}if(y>.005){const H=Tn[f];if(!this.isInitialized)this.dominantHue=H,this.isInitialized=!0;else{const N=1-Math.exp(-d/6);let q=H-this.dominantHue;for(;q>180;)q-=360;for(;q<-180;)q+=360;this.dominantHue=(this.dominantHue+q*N+360)%360}}const P=Math.max(-1,Math.min(1,o.colorTempBias??0));let C=this.dominantHue;if(P>.001){let N=40-C;for(;N>180;)N-=360;for(;N<-180;)N+=360;C=(C+N*P+360)%360}else if(P<-.001){const N=Math.abs(P);let q=235-C;for(;q>180;)q-=360;for(;q<-180;)q+=360;C=(C+q*N+360)%360}const M=(C+25)%360,v=(C-25+360)%360,R=(C+60)%360,A=(C+180)%360,m=Math.max(0,Math.min(1,n)),E=1-Math.exp(-d/.4);this.smoothedAmp+=(m-this.smoothedAmp)*E;const x=Math.max(.45,Math.min(2.5,(u||115)/115)),_=Math.max(.35,Math.min(3.2,Math.pow(x,1.75)));a||h||c?this.beatDanceMomentum=Math.min(1.8,this.beatDanceMomentum+.6):this.beatDanceMomentum*=Math.exp(-d/.35);const L=1+this.beatDanceMomentum*.7*Math.min(1.6,x),T=.45*_;this.wanderingAngle+=(Math.sin(this.zCoordinate*.7)*.8+Math.cos(this.zCoordinate*.45+1.2)*.6)*T*d;const b=.36*(1+(o.viscosityBias||0)*-.35),p=(o.sensitivity||1)*1.1;this.fluidVelocity=(b+this.smoothedAmp*p)*_*L,this.zCoordinate+=this.fluidVelocity*d;const S=(m-this.prevAmplitude)/d;this.prevAmplitude=m,this.timeSinceLastBurst+=d;const z=this.streamAge>1&&(S>3.2&&m>.4||a&&l>.42||c);let F=!1;if(z&&this.timeSinceLastBurst>.28){this.burstIntensity=1,this.burstRadius=.04,this.timeSinceLastBurst=0,F=!0;const H=Math.sin(this.wanderingAngle)*.1,N=Math.cos(this.wanderingAngle)*.1;this.burstOrigin=[.5+H,.5+N]}else this.burstIntensity*=Math.exp(-d/.75),this.burstRadius+=d*1.55,this.burstIntensity<.005&&(this.burstIntensity=0);const B=f,I=(B+4)%12,V=(B+3)%12,U=(B+7)%12,G=(B+6)%12,O=t[B]+1.4*t[I]+t[U],j=t[B]+1.4*t[V]+t[U],K=1.6*t[G];let ie=0;K>O*.7&&K>j*.7?ie=.85:j>O*1.05?ie=.5:ie=0;const X=1-Math.exp(-d/.65);this.dissonanceFactor+=(ie-this.dissonanceFactor)*X;let $="major";return this.dissonanceFactor>.6?$="dissonant":this.dissonanceFactor>.25&&($="minor"),{dominantHue:C,support1Hue:M,support2Hue:v,accentHue:R,complementaryHue:A,fluidVelocity:this.fluidVelocity,zCoordinate:this.zCoordinate,amplitude:this.smoothedAmp,amplitudeDerivative:S,bpmFlowScale:_,randomAngle:this.wanderingAngle,isBurst:F||this.burstIntensity>.05,burstIntensity:this.burstIntensity,burstRadius:this.burstRadius,burstOrigin:this.burstOrigin,dissonanceFactor:this.dissonanceFactor,musicalMode:$,colorTempBias:P}}getDominantHue(){return this.dominantHue}getDissonanceFactor(){return this.dissonanceFactor}getZCoordinate(){return this.zCoordinate}}class Rn{analyser;fftSize=2048;freqData;timeData;prevFreqData;sampleRate;spectrumMapper;harmonicTheory;runningMax=.05;minGainFloor=.015;calibrationStartTime=0;calibrationFloor=1;calibrationCeil=0;isCalibrated=!1;fluxHistory=[];lastBeatTime=0;beatIntervals=[];rawBpm=120;smoothedBpm=120;shortEnergy=0;longEnergy=0;masterIntensity=.5;isEbb=!1;isSurge=!1;surgeTimer=999;ebbDuration=0;lastKickTime=0;kickIntensity=0;hiHatIntensity=0;midRangeSwirl=0;beatIntensity=0;chromaBins=new Float32Array(12);silenceDuration=0;constructor(e,i=44100){this.analyser=e,this.analyser.fftSize=this.fftSize,this.analyser.smoothingTimeConstant=.35,this.sampleRate=i;const t=e.frequencyBinCount;this.freqData=new Float32Array(t),this.timeData=new Float32Array(t),this.prevFreqData=new Float32Array(t),this.spectrumMapper=new Tt,this.harmonicTheory=new _n}update(e,i){this.analyser.getFloatFrequencyData(this.freqData),this.analyser.getFloatTimeDomainData(this.timeData);const t=this.analyser.frequencyBinCount,r=this.sampleRate/2/t,o=1/60;let a=0,c=0;const l=new Float32Array(t);for(let D=0;D<t;D++){const Y=this.freqData[D],te=Math.max(0,Math.min(1,Math.pow(10,(Y+20)/40)));l[D]=te,te>a&&(a=te);const le=this.timeData[D];c+=le*le}const u=Math.sqrt(c/t);this.calibrationStartTime===0&&u>.01&&(this.calibrationStartTime=e),this.calibrationStartTime>0&&e-this.calibrationStartTime<=10&&(this.calibrationFloor=Math.min(this.calibrationFloor,u),this.calibrationCeil=Math.max(this.calibrationCeil,u),this.isCalibrated=e-this.calibrationStartTime>=9.8),a>this.runningMax?this.runningMax=a*.85+this.runningMax*.15:this.runningMax=Math.max(this.minGainFloor,this.runningMax*.998);const h=this.isCalibrated&&this.calibrationCeil>this.calibrationFloor?1/Math.max(.04,this.calibrationCeil)*.85:1/Math.max(.02,this.runningMax),d=Math.min(16,h*i.sensitivity);for(let D=0;D<t;D++)l[D]=Math.min(2.5,l[D]*d);const f=Math.min(1,u*d);let g=0,y=0;for(let D=0;D<t;D++){const Y=l[D];g+=D*r*Y,y+=Y}const P=y>.001?g/y:1200,C=Math.max(0,Math.min(1,Math.log2(Math.max(80,P)/80)/6.5)),M=Math.floor(40/r),v=Math.ceil(75/r);let R=0;for(let D=M;D<=v;D++)R+=l[D];const A=R/Math.max(1,v-M+1);let m=0;for(let D=0;D<t;D++){const Y=l[D]-this.prevFreqData[D];Y>0&&(m+=Y),this.prevFreqData[D]=l[D]}m=Math.min(1,m/(t*.12));const E=A>.38&&m>.16&&e-this.lastKickTime>.22;E?(this.lastKickTime=e,this.kickIntensity=1):this.kickIntensity*=.85,this.fluxHistory.push(m),this.fluxHistory.length>50&&this.fluxHistory.shift();let x=0;for(const D of this.fluxHistory)x+=D;x/=Math.max(1,this.fluxHistory.length);let _=0;for(const D of this.fluxHistory)_+=Math.pow(D-x,2);const L=Math.sqrt(_/Math.max(1,this.fluxHistory.length)),T=Math.max(.1,x+L*1.35),b=e-this.lastBeatTime;let p=!1;if(m>T&&b>.25){if(p=!0,this.lastBeatTime>0&&b<1.4){this.beatIntervals.push(b),this.beatIntervals.length>12&&this.beatIntervals.shift();const D=[...this.beatIntervals].sort((le,Se)=>le-Se);let te=60/D[Math.floor(D.length/2)];for(;te<70;)te*=2;for(;te>180;)te/=2;this.rawBpm=te}this.lastBeatTime=e,this.beatIntensity=1}else this.beatIntensity*=.88,b>1.4&&f<.35&&(this.rawBpm=Math.max(70,this.rawBpm-o*20));const S=1-Math.exp(-o/5.5);this.smoothedBpm+=(this.rawBpm-this.smoothedBpm)*S;const w=Math.round(Math.max(70,Math.min(180,this.smoothedBpm)));this.chromaBins.fill(0);const z=Math.floor(110/r),F=Math.min(t-1,Math.floor(1400/r));for(let D=z;D<=F;D++){const Y=D*r,te=69+12*(Math.log(Y/440)/Math.LN2),Se=(Math.round(te)%12+12)%12;this.chromaBins[Se]+=l[D]*l[D]}const B=this.harmonicTheory.update(l,r,this.chromaBins,f,o,i,E,this.isSurge,A,w,p),I=this.spectrumMapper.processBands(l,r,this.chromaBins,w,o,i.paletteShiftMode??"shifting",i.paletteShiftSpeed??1,this.masterIntensity,m,C,E,A,B),V=1-Math.exp(-o/.2),U=1-Math.exp(-o/5);this.shortEnergy+=(f-this.shortEnergy)*V,this.longEnergy+=(f-this.longEnergy)*U;const G=this.shortEnergy/Math.max(.02,this.longEnergy);this.shortEnergy<this.longEnergy*.45&&this.shortEnergy<.15?(this.ebbDuration+=o,this.ebbDuration>.4&&(this.isEbb=!0)):(this.ebbDuration=Math.max(0,this.ebbDuration-o*2),this.shortEnergy>this.longEnergy*.7&&(this.isEbb=!1));let O=!1;(this.isEbb||this.shortEnergy<.22)&&(m>.24||f>.4)?(O=!0,this.isEbb=!1):m>.36&&G>1.35&&(O=!0),O?(this.isSurge=!0,this.surgeTimer=0,this.masterIntensity=1):(this.surgeTimer+=o,this.surgeTimer>1.5&&(this.isSurge=!1));const j=this.isEbb?.15:Math.max(.1,f);if(j>this.masterIntensity){const D=1-Math.exp(-o/.08);this.masterIntensity+=(j-this.masterIntensity)*D}else{const D=1-Math.exp(-o/1.5);this.masterIntensity+=(j-this.masterIntensity)*D}const K=(I.bands[8].amplitude+I.bands[9].amplitude)*.5,ie=K>.22&&m>.15;ie?this.hiHatIntensity=Math.min(1,K*1.5):this.hiHatIntensity*=.82;const X=(I.bands[4].amplitude+I.bands[5].amplitude)*.5;this.midRangeSwirl=this.midRangeSwirl*.94+X*.06;let $=0,H=0,N=0,q=0;for(const D of I.bands){const Y=At(D.lightness,D.chroma,D.effectiveHue);$+=Y.r*D.amplitude,H+=Y.g*D.amplitude,N+=Y.b*D.amplitude,q+=D.amplitude}if(q>.01)$/=q,H/=q,N/=q;else{const D=At(.25,.12,260);$=D.r,H=D.g,N=D.b}f<.015&&m<.02?this.silenceDuration+=o:this.silenceDuration=Math.max(0,this.silenceDuration-o*2);const pe={masterIntensity:this.masterIntensity,shortEnergy:this.shortEnergy,longEnergy:this.longEnergy,dynamicsRatio:G,isEbb:this.isEbb,isSurge:this.isSurge,surgeTimer:this.surgeTimer,ebbDepth:this.isEbb?Math.min(1,(this.longEnergy-this.shortEnergy)/Math.max(.01,this.longEnergy)):0,calibrationFloor:this.calibrationFloor,calibrationCeil:this.calibrationCeil,calibrationReady:this.isCalibrated};return{bpm:w,rawBpm:Math.round(this.rawBpm),energy:Math.max(.05,Math.min(1,this.masterIntensity)),brightness:Math.max(.08,Math.min(1,.35+this.masterIntensity*.5+I.pitchInfo.biasApplied)),hueSpreadDeg:I.hueSpreadDeg,colorTemperature:I.colorTemperature,spectrumBands:I.bands,pitchInfo:I.pitchInfo,ebbSurge:pe,harmonicLiquid:B,isBeat:p,beatIntensity:this.beatIntensity,isKick:E,kickIntensity:this.kickIntensity,isHiHat:ie,hiHatIntensity:this.hiHatIntensity,midRangeSwirl:Math.min(1,this.midRangeSwirl*2),isSilent:this.silenceDuration>2,activePreset:i.activePreset,dominantColor:{r:$,g:H,b:N,hex:bn($,H,N),lightness:this.masterIntensity}}}}class En{audioContext;currentStream=null;currentSourceNode=null;callbacks;currentMode="mic";selectedDeviceId="default";constructor(e,i){this.audioContext=e,this.callbacks=i,navigator.mediaDevices&&navigator.mediaDevices.addEventListener&&navigator.mediaDevices.addEventListener("devicechange",()=>{this.enumerateDevices()})}async init(e="default"){return this.selectedDeviceId=e,await this.enumerateDevices(),await this.startMic(e)}getMode(){return this.currentMode}getSelectedDeviceId(){return this.selectedDeviceId}async enumerateDevices(){if(!navigator.mediaDevices||!navigator.mediaDevices.enumerateDevices)return[];try{const i=(await navigator.mediaDevices.enumerateDevices()).filter(t=>t.kind==="audioinput").map((t,n)=>({deviceId:t.deviceId,label:t.label||`Audio Input ${n+1}`}));return this.callbacks.onDevicesUpdated(i),i}catch(e){return console.warn("Could not enumerate audio devices:",e),[]}}async startMic(e="default"){if(this.stopCurrentStream(),this.selectedDeviceId=e,this.currentMode="mic",this.audioContext.state==="suspended")try{await this.audioContext.resume()}catch(t){console.warn("AudioContext resume deferred to user gesture:",t)}const i={echoCancellation:!1,noiseSuppression:!1,autoGainControl:!1};e&&e!=="default"&&(i.deviceId={exact:e});try{const t=await navigator.mediaDevices.getUserMedia({audio:i,video:!1});return this.currentStream=t,this.attachStream(t,"mic"),await this.enumerateDevices(),!0}catch(t){const n=t.name==="NotAllowedError"||t.name==="PermissionDeniedError"?"Microphone permission was denied. Please allow microphone access or switch to Tab Audio (T).":`Failed to access microphone: ${t.message||t.name}`;return this.callbacks.onError(n),!1}}async startDisplayMedia(){this.stopCurrentStream(),this.currentMode="tab",this.audioContext.state==="suspended"&&await this.audioContext.resume();try{const e=await navigator.mediaDevices.getDisplayMedia({video:!0,audio:{echoCancellation:!1,noiseSuppression:!1,autoGainControl:!1}});e.getVideoTracks().forEach(n=>n.stop());const t=e.getAudioTracks();return t.length===0?(this.callbacks.onError('No audio track was selected in display media. Please check "Share tab audio" or "Share system audio".'),this.stopCurrentStream(),!1):(t[0].addEventListener("ended",()=>{this.callbacks.onError("Audio capture ended. Returning to microphone..."),this.startMic(this.selectedDeviceId)}),this.currentStream=e,this.attachStream(e,"tab"),!0)}catch(e){return e.name!=="NotAllowedError"&&this.callbacks.onError(`Display audio capture error: ${e.message||e.name}`),!1}}setDemoMode(){this.stopCurrentStream(),this.currentMode="demo",this.callbacks.onStreamReady(null,"demo")}attachStream(e,i){try{this.currentSourceNode=this.audioContext.createMediaStreamSource(e),this.callbacks.onStreamReady(e,i)}catch(t){this.callbacks.onError(`Audio node connection failed: ${t.message||t}`)}}getSourceNode(){return this.currentSourceNode}stopCurrentStream(){if(this.currentSourceNode){try{this.currentSourceNode.disconnect()}catch{}this.currentSourceNode=null}this.currentStream&&(this.currentStream.getTracks().forEach(e=>e.stop()),this.currentStream=null)}}class Mn{ctx;outputGain;isRunning=!1;currentMood="off";timerId=null;step=0;bpm=120;nextNoteTime=0;constructor(e,i){this.ctx=e,this.outputGain=e.createGain(),this.outputGain.gain.value=.85,this.outputGain.connect(i);try{this.outputGain.connect(e.destination)}catch(t){console.warn("Could not connect demo track to speaker output:",t)}}getMood(){return this.currentMood}isPlaying(){return this.isRunning}setMute(e){this.outputGain.gain.setValueAtTime(e?0:.85,this.ctx.currentTime)}start(e="dynamic"){this.stop(),this.currentMood=e,this.isRunning=!0,this.step=0,this.nextNoteTime=this.ctx.currentTime+.05,this.scheduleLoop()}stop(){this.isRunning=!1,this.currentMood="off",this.timerId!==null&&(window.clearTimeout(this.timerId),this.timerId=null)}setMood(e){e==="off"?this.stop():(this.currentMood=e,this.isRunning||this.start(e))}scheduleLoop=()=>{if(!this.isRunning||this.currentMood==="off")return;let e="high";if(this.currentMood==="dynamic"){const t=Math.floor(this.step/16)%36;t<8?e="low":t<24?e="high":(t<28,e="surge")}else this.currentMood==="low"?e="low":this.currentMood==="surge"?e="surge":e="high";this.bpm=e==="low"?68:135;const i=60/(this.bpm*4);for(;this.nextNoteTime<this.ctx.currentTime+.15;)this.triggerStep(this.step,this.nextNoteTime,e),this.nextNoteTime+=i,this.step++;this.timerId=window.setTimeout(this.scheduleLoop,25)};triggerStep(e,i,t){const n=e%16,r=n%4===0;if(t==="low"){if(n===0){const o=[55,55,41.2,55],a=Math.floor(e/16)%o.length,c=o[a];this.playPadSwell(c,i,60/68*3.8),this.playSubPulse(c,i,2)}}else if(t==="surge"){const o=e%32;if(o<16)return;o===16&&this.playMassiveDropHit(i),o>=16&&(r&&this.playKick(i),n%2===0&&this.playHiHat(i,.4))}else{r&&this.playKick(i),(n===4||n===12)&&this.playSnare(i);const o=n%4===2;this.playHiHat(i,o?.38:.15);const c=[130.81,130.81,164.81,130.81,196,164.81,196,261.63][e%8];n%2===0&&this.playBassStab(c,i);const l=[523.25,659.25,783.99,987.77,1046.5,1318.5,1046.5,783.99],u=l[e%l.length];e%2===1&&this.playLeadSynth(u,i)}}playKick(e){const i=this.ctx.createOscillator(),t=this.ctx.createGain();i.type="sine",i.frequency.setValueAtTime(130.8,e),i.frequency.exponentialRampToValueAtTime(32.7,e+.14),t.gain.setValueAtTime(1.1,e),t.gain.exponentialRampToValueAtTime(.001,e+.36),i.connect(t),t.connect(this.outputGain),i.start(e),i.stop(e+.36)}playSnare(e){const i=this.ctx.sampleRate*.2,t=this.ctx.createBuffer(1,i,this.ctx.sampleRate),n=t.getChannelData(0);for(let c=0;c<i;c++)n[c]=(Math.random()*2-1)*.7;const r=this.ctx.createBufferSource();r.buffer=t;const o=this.ctx.createBiquadFilter();o.type="highpass",o.frequency.value=750;const a=this.ctx.createGain();a.gain.setValueAtTime(.8,e),a.gain.exponentialRampToValueAtTime(.01,e+.22),r.connect(o),o.connect(a),a.connect(this.outputGain),r.start(e),r.stop(e+.22)}playHiHat(e,i){const t=this.ctx.sampleRate*.05,n=this.ctx.createBuffer(1,t,this.ctx.sampleRate),r=n.getChannelData(0);for(let l=0;l<t;l++)r[l]=Math.random()*2-1;const o=this.ctx.createBufferSource();o.buffer=n;const a=this.ctx.createBiquadFilter();a.type="highpass",a.frequency.value=7e3;const c=this.ctx.createGain();c.gain.setValueAtTime(i,e),c.gain.exponentialRampToValueAtTime(.001,e+.05),o.connect(a),a.connect(c),c.connect(this.outputGain),o.start(e),o.stop(e+.05)}playBassStab(e,i){const t=this.ctx.createOscillator(),n=this.ctx.createBiquadFilter(),r=this.ctx.createGain();t.type="sawtooth",t.frequency.setValueAtTime(e,i),n.type="lowpass",n.frequency.setValueAtTime(1400,i),n.frequency.exponentialRampToValueAtTime(220,i+.16),r.gain.setValueAtTime(.85,i),r.gain.exponentialRampToValueAtTime(.01,i+.16),t.connect(n),n.connect(r),r.connect(this.outputGain),t.start(i),t.stop(i+.17)}playLeadSynth(e,i){const t=this.ctx.createOscillator(),n=this.ctx.createGain();t.type="triangle",t.frequency.setValueAtTime(e,i),n.gain.setValueAtTime(.5,i),n.gain.exponentialRampToValueAtTime(.001,i+.13),t.connect(n),n.connect(this.outputGain),t.start(i),t.stop(i+.13)}playPadSwell(e,i,t){[{f:e*4,gain:.65},{f:e*4*1.2,gain:.35},{f:e*4*1.5,gain:.35}].forEach(({f:r,gain:o})=>{const a=this.ctx.createOscillator(),c=this.ctx.createBiquadFilter(),l=this.ctx.createGain();a.type="sine",a.frequency.setValueAtTime(r,i),c.type="lowpass",c.frequency.setValueAtTime(350,i),l.gain.setValueAtTime(.001,i),l.gain.linearRampToValueAtTime(o,i+t*.4),l.gain.exponentialRampToValueAtTime(.001,i+t),a.connect(c),c.connect(l),l.connect(this.outputGain),a.start(i),a.stop(i+t)})}playSubPulse(e,i,t){const n=this.ctx.createOscillator(),r=this.ctx.createGain();n.type="sine",n.frequency.setValueAtTime(e,i),r.gain.setValueAtTime(.001,i),r.gain.linearRampToValueAtTime(.22,i+.4),r.gain.exponentialRampToValueAtTime(.001,i+t),n.connect(r),r.connect(this.outputGain),n.start(i),n.stop(i+t)}playMassiveDropHit(e){this.playKick(e);const i=this.ctx.sampleRate*.6,t=this.ctx.createBuffer(1,i,this.ctx.sampleRate),n=t.getChannelData(0);for(let l=0;l<i;l++)n[l]=(Math.random()*2-1)*.9;const r=this.ctx.createBufferSource();r.buffer=t;const o=this.ctx.createBiquadFilter();o.type="bandpass",o.frequency.setValueAtTime(1500,e),o.Q.value=1;const a=this.ctx.createGain();a.gain.setValueAtTime(1,e),a.gain.exponentialRampToValueAtTime(.01,e+.6),r.connect(o),o.connect(a),a.connect(this.outputGain),r.start(e),r.stop(e+.6),[220,277.18,329.63,440,554.37,659.25].forEach(l=>{const u=this.ctx.createOscillator(),h=this.ctx.createGain();u.type="sawtooth",u.frequency.setValueAtTime(l,e),h.gain.setValueAtTime(.25,e),h.gain.exponentialRampToValueAtTime(.001,e+.5),u.connect(h),h.connect(this.outputGain),u.start(e),u.stop(e+.5)})}}class Pn{ctx=null;analyserNode=null;analyzer=null;inputManager=null;demoGenerator=null;callbacks;isInitialized=!1;constructor(e){this.callbacks=e}async initialize(e="default",i){if(this.isInitialized&&this.ctx)return this.ctx.state==="suspended"&&await this.ctx.resume(),i&&i!=="off"&&this.startDemo(i),!0;try{const t=window.AudioContext||window.webkitAudioContext;return this.ctx=new t({latencyHint:"interactive",sampleRate:44100}),this.analyserNode=this.ctx.createAnalyser(),this.analyserNode.fftSize=2048,this.analyzer=new Rn(this.analyserNode,this.ctx.sampleRate),this.demoGenerator=new Mn(this.ctx,this.analyserNode),this.inputManager=new En(this.ctx,{onStreamReady:(r,o)=>{if(o==="demo"){this.callbacks.onModeChanged("demo");return}if(r&&this.analyserNode){const a=this.inputManager?.getSourceNode();if(a)try{a.connect(this.analyserNode)}catch(c){console.error("Failed to connect source node to analyzer:",c)}}this.callbacks.onModeChanged(o)},onError:r=>this.callbacks.onError(r),onDevicesUpdated:r=>this.callbacks.onDevicesUpdated(r)}),this.isInitialized=!0,i&&i!=="off"?(this.startDemo(i),!0):(await this.inputManager.init(e)||(this.callbacks.onError("Microphone unavailable. Starting in ambient demo mode (press M to change)."),this.startDemo("dynamic")),!0)}catch(t){return this.callbacks.onError(`Audio initialization failed: ${t.message||t}`),!1}}async resume(){this.ctx&&this.ctx.state==="suspended"&&await this.ctx.resume()}update(e,i){return this.analyzer?this.analyzer.update(e,i):null}async selectDevice(e){return this.demoGenerator&&this.demoGenerator.stop(),this.inputManager?await this.inputManager.startMic(e):!1}async captureTabAudio(){return this.demoGenerator&&this.demoGenerator.stop(),this.inputManager?await this.inputManager.startDisplayMedia():!1}startDemo(e="dynamic"){this.inputManager&&this.inputManager.setDemoMode(),this.demoGenerator&&this.demoGenerator.start(e),this.callbacks.onModeChanged("demo")}setDemoMood(e){this.demoGenerator&&this.demoGenerator.setMood(e)}stop(){this.demoGenerator&&this.demoGenerator.stop()}getDemoMood(){return this.demoGenerator?this.demoGenerator.getMood():"off"}toggleDemoMute(e){this.demoGenerator&&this.demoGenerator.setMute(e)}getInputMode(){return this.inputManager?this.inputManager.getMode():"mic"}async getDevices(){return this.inputManager?await this.inputManager.enumerateDevices():[]}}const me={ink:{id:"ink",name:"Ink in Water",viscosityBase:.985,damping:.965,diffusion:.045,splatRadius:.16,vorticityScale:2.2,bloomStrength:.35,specularGloss:0,colorSaturation:1.25,hueSpreadScale:1.1},lava:{id:"lava",name:"Lava Lamp",viscosityBase:.994,damping:.982,diffusion:.012,splatRadius:.22,vorticityScale:1.2,bloomStrength:.45,specularGloss:0,colorSaturation:1.35,hueSpreadScale:.8},aurora:{id:"aurora",name:"Aurora Borealis",viscosityBase:.978,damping:.988,diffusion:.025,splatRadius:.14,vorticityScale:3.5,bloomStrength:.65,specularGloss:0,colorSaturation:1.4,hueSpreadScale:1.3},neon:{id:"neon",name:"Neon Club",viscosityBase:.962,damping:.992,diffusion:.018,splatRadius:.12,vorticityScale:4,bloomStrength:.85,specularGloss:0,colorSaturation:1.5,hueSpreadScale:1.6},ocean:{id:"ocean",name:"Deep Ocean",viscosityBase:.988,damping:.975,diffusion:.035,splatRadius:.18,vorticityScale:1.8,bloomStrength:.4,specularGloss:0,colorSaturation:1.3,hueSpreadScale:.9}};function _t(s,e,i){if(s!=="auto")return me[s];if(e<95){const t=Math.max(0,Math.min(1,(e-70)/25));return ze(me.ocean,me.ink,t,"Auto (Ocean/Ink)")}else if(e<130){const t=Math.max(0,Math.min(1,(e-95)/35));return ze(me.ink,me.aurora,t,"Auto (Aurora)")}else{const t=Math.max(0,Math.min(1,(e-130)/30));return ze(me.aurora,me.neon,t,"Auto (Neon Club)")}}function ce(s,e,i){return s+(e-s)*i}function ze(s,e,i,t){return{id:"auto",name:t,viscosityBase:ce(s.viscosityBase,e.viscosityBase,i),damping:ce(s.damping,e.damping,i),diffusion:ce(s.diffusion,e.diffusion,i),splatRadius:ce(s.splatRadius,e.splatRadius,i),vorticityScale:ce(s.vorticityScale,e.vorticityScale,i),bloomStrength:ce(s.bloomStrength,e.bloomStrength,i),specularGloss:ce(s.specularGloss,e.specularGloss,i),colorSaturation:ce(s.colorSaturation,e.colorSaturation,i),hueSpreadScale:ce(s.hueSpreadScale,e.hueSpreadScale,i)}}const kn=`#version 300 es
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
`;class Dn{canvas;gl=null;program=null;quadVao=null;uLocs={};frameCount=0;lastFpsTime=performance.now();currentFps=60;currentFrameTime=16.6;activePresetName="Auto";constructor(e){this.canvas=e}async init(){const e=this.canvas.getContext("webgl2",{alpha:!1,depth:!1,stencil:!1,antialias:!1,powerPreference:"high-performance",desynchronized:!0});if(!e)return console.warn("WebGL2 not supported for CinematicFluidRenderer."),!1;this.gl=e;const i=e.createShader(e.VERTEX_SHADER);if(e.shaderSource(i,kn),e.compileShader(i),!e.getShaderParameter(i,e.COMPILE_STATUS))return console.error("CinematicFluid VS compile error:",e.getShaderInfoLog(i)),!1;const t=e.createShader(e.FRAGMENT_SHADER);if(e.shaderSource(t,Ln),e.compileShader(t),!e.getShaderParameter(t,e.COMPILE_STATUS))return console.error("CinematicFluid FS compile error:",e.getShaderInfoLog(t)),!1;if(this.program=e.createProgram(),e.attachShader(this.program,i),e.attachShader(this.program,t),e.linkProgram(this.program),!e.getProgramParameter(this.program,e.LINK_STATUS))return console.error("CinematicFluid link error:",e.getProgramInfoLog(this.program)),!1;const n=["uResolution","uZ","uAmplitude","uSensitivity","uHueDom","uHueSup1","uHueSup2","uHueAccent","uHueComp","uDissonance","uBurstIntensity","uBurstRadius","uBurstOrigin","uBpmFlowScale","uRandomAngle","uSpecularGloss","uHdrIntensity","uAspectRatio"];for(const o of n)this.uLocs[o]=e.getUniformLocation(this.program,o);this.quadVao=e.createVertexArray(),e.bindVertexArray(this.quadVao);const r=e.createBuffer();return e.bindBuffer(e.ARRAY_BUFFER,r),e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),e.STATIC_DRAW),e.enableVertexAttribArray(0),e.vertexAttribPointer(0,2,e.FLOAT,!1,0,0),e.bindVertexArray(null),this.resize(this.canvas.width||window.innerWidth,this.canvas.height||window.innerHeight),console.info("[CinematicFluidRenderer] Initialized successfully."),!0}resize(e,i){if(!this.gl)return;const t=Math.min(window.devicePixelRatio||1,2);this.canvas.width=Math.floor(e*t),this.canvas.height=Math.floor(i*t),this.gl.viewport(0,0,this.canvas.width,this.canvas.height)}render(e,i,t){const n=this.gl;if(!n||!this.program||!this.quadVao)return;const r=performance.now(),o=_t(i.activePreset,e.bpm,e.energy);this.activePresetName=o.name,n.useProgram(this.program),n.bindVertexArray(this.quadVao);const a=this.canvas.width||1920,c=this.canvas.height||1080,l=a/Math.max(1,c);this.uLocs.uResolution&&n.uniform2f(this.uLocs.uResolution,a,c),this.uLocs.uAspectRatio&&n.uniform1f(this.uLocs.uAspectRatio,l);const u=e.harmonicLiquid,h=u?u.zCoordinate:performance.now()*3e-4,d=u?u.amplitude:e.energy,f=u?u.dissonanceFactor:e.pitchInfo?.majorMinorScore<0?.5:0,g=u?u.dominantHue:30,y=u?u.support1Hue:(g+25)%360,P=u?u.support2Hue:(g-25+360)%360,C=u?u.accentHue:(g+60)%360,M=u?u.complementaryHue:(g+180)%360;this.uLocs.uZ&&n.uniform1f(this.uLocs.uZ,h),this.uLocs.uAmplitude&&n.uniform1f(this.uLocs.uAmplitude,d),this.uLocs.uSensitivity&&n.uniform1f(this.uLocs.uSensitivity,i.sensitivity||1),this.uLocs.uHueDom&&n.uniform1f(this.uLocs.uHueDom,g),this.uLocs.uHueSup1&&n.uniform1f(this.uLocs.uHueSup1,y),this.uLocs.uHueSup2&&n.uniform1f(this.uLocs.uHueSup2,P),this.uLocs.uHueAccent&&n.uniform1f(this.uLocs.uHueAccent,C),this.uLocs.uHueComp&&n.uniform1f(this.uLocs.uHueComp,M),this.uLocs.uDissonance&&n.uniform1f(this.uLocs.uDissonance,f);const v=u?u.burstIntensity:e.ebbSurge?.isSurge?1:0,R=u?u.burstRadius:.5,A=u?u.burstOrigin:[.5,.5];this.uLocs.uBurstIntensity&&n.uniform1f(this.uLocs.uBurstIntensity,v),this.uLocs.uBurstRadius&&n.uniform1f(this.uLocs.uBurstRadius,R),this.uLocs.uBurstOrigin&&n.uniform2f(this.uLocs.uBurstOrigin,A[0],A[1]);const m=u?u.bpmFlowScale:e.bpm/120,E=u?u.randomAngle:0;this.uLocs.uBpmFlowScale&&n.uniform1f(this.uLocs.uBpmFlowScale,m),this.uLocs.uRandomAngle&&n.uniform1f(this.uLocs.uRandomAngle,E),this.uLocs.uSpecularGloss&&n.uniform1f(this.uLocs.uSpecularGloss,o.specularGloss||.6),this.uLocs.uHdrIntensity&&n.uniform1f(this.uLocs.uHdrIntensity,i.hdrIntensity||.6),n.drawArrays(n.TRIANGLES,0,3),n.bindVertexArray(null),this.frameCount++;const x=performance.now();this.currentFrameTime=x-r,x-this.lastFpsTime>=1e3&&(this.currentFps=Math.round(this.frameCount*1e3/(x-this.lastFpsTime)),this.frameCount=0,this.lastFpsTime=x)}getStats(){return{fps:this.currentFps,frameTimeMs:parseFloat(this.currentFrameTime.toFixed(1)),resolutionScale:1,rendererType:"WebGL2",canvasFormat:"rgba8unorm",colorSpace:"srgb",hdrActive:!1,activePreset:this.activePresetName,jacobiIterations:0}}dispose(){this.gl&&this.program&&(this.gl.deleteProgram(this.program),this.program=null)}}class xi{agents=[];beatCounter=0;lastBeatState=!1;lastKickState=!1;lastHiHatState=!1;beatPhase=0;barPhase=0;beatDanceMomentum=0;floatFactor=0;currentKickCenter=[.5,.5];targetKickCenter=[.5,.5];vortex1={x:.35,y:.45,strength:0,spinSign:1,radius:.35};vortex2={x:.65,y:.55,strength:0,spinSign:-1,radius:.35};flowCurrent=[0,0];constructor(){this.initAgents()}initAgents(){this.agents=[];const e=1.6180339887;for(let i=0;i<10;i++){const t=.2+i%4*.2+(Math.random()-.5)*.08,n=.25+Math.floor(i/4)*.25+(Math.random()-.5)*.08;this.agents.push({x:Math.max(.1,Math.min(.9,t)),y:Math.max(.1,Math.min(.9,n)),vx:(Math.random()-.5)*.08,vy:(Math.random()-.5)*.08,heading:Math.random()*Math.PI*2,speed:.12,wanderSeedX:i*1.37+.5,wanderSeedY:i*2.19+1.2,freq1:.35+i*.11*e,freq2:.52+(i+3)*.09*e,targetX:.1+Math.random()*.8,targetY:.1+Math.random()*.8,burstTimer:0,retargetCooldown:Math.random()*.8})}}update(e,i,t,n){const r=(e.isKick||e.isBeat)&&!this.lastBeatState,o=e.isKick&&!this.lastKickState,a=e.isHiHat&&!this.lastHiHatState,c=Math.max(50,Math.min(220,e.bpm||115)),u=c/60*t*2*Math.PI;if(this.beatPhase+=u,this.barPhase+=u,r){this.beatCounter++;const b=this.beatPhase%(2*Math.PI);if(b<Math.PI?this.beatPhase-=b*.35:this.beatPhase+=(2*Math.PI-b)*.35,o){const p=this.beatCounter*2.399963,S=.2+this.beatCounter%3*.08,w=.16+(this.beatCounter+1)%3*.07;this.targetKickCenter=[Math.max(.15,Math.min(.85,.5+Math.cos(p)*S)),Math.max(.15,Math.min(.85,.5+Math.sin(p)*w))]}}const h=Math.min(1,t*(4+(1-this.floatFactor)*4));this.currentKickCenter[0]+=(this.targetKickCenter[0]-this.currentKickCenter[0])*h,this.currentKickCenter[1]+=(this.targetKickCenter[1]-this.currentKickCenter[1])*h;const d=e.pitchInfo.circleOfFifthsIndex/12*Math.PI*2,f=Math.cos(d)*.3,g=Math.sin(d)*.3;this.flowCurrent[0]+=(f-this.flowCurrent[0])*Math.min(1,t*2),this.flowCurrent[1]+=(g-this.flowCurrent[1])*Math.min(1,t*2);const y=c/115,P=Math.max(.38,Math.min(3.2,Math.pow(y,1.85)));let C=0;if(c<105||e.energy<.42||e.ebbSurge.isEbb||e.isSilent){const b=Math.max(0,Math.min(1,(108-c)/45)),p=Math.max(0,Math.min(1,(.5-e.energy)/.4));C=Math.max(b*.85,p),e.ebbSurge.isEbb&&(C=Math.max(C,.88)),e.isSilent&&(C=1)}(e.ebbSurge.isSurge||e.energy>.72||c>135)&&(C=0);const M=C>this.floatFactor?2.2:4.8;if(this.floatFactor+=(C-this.floatFactor)*Math.min(1,t*M),r||o||e.ebbSurge.isSurge){const b=(o?1:.65)*(1-this.floatFactor*.75);this.beatDanceMomentum=Math.min(2.4,this.beatDanceMomentum+b)}else{const b=.35/Math.max(.65,y);this.beatDanceMomentum*=Math.exp(-t/b)}const v=1-this.floatFactor*.85,R=(1+this.beatDanceMomentum*.95*Math.min(2,y))*v,A=.3*P*v+.05*this.floatFactor,m=n*A+this.beatPhase*.08*v,E=n*A*1.05+this.beatPhase*.06*v+2.8;this.vortex1.x=.5+Math.sin(m*1.1+.5)*(.33-this.floatFactor*.08)+Math.cos(n*.14)*.06,this.vortex1.y=.5+Math.cos(m*.9+1.2)*(.31-this.floatFactor*.08)+Math.sin(n*.16)*.06,this.vortex1.x=Math.max(.12,Math.min(.88,this.vortex1.x)),this.vortex1.y=Math.max(.12,Math.min(.88,this.vortex1.y)),this.vortex1.strength=(e.midRangeSwirl*.85+e.kickIntensity*.7+e.energy*.35)*P*R,this.floatFactor>.4&&(this.vortex1.strength=Math.max(.12,this.vortex1.strength*.4)),this.vortex1.spinSign=1,this.vortex2.x=.5+Math.cos(E+.3)*(.33-this.floatFactor*.08)+Math.sin(n*.12)*.06,this.vortex2.y=.5+Math.sin(E*1.15)*(.31-this.floatFactor*.08)+Math.cos(n*.18)*.06,this.vortex2.x=Math.max(.12,Math.min(.88,this.vortex2.x)),this.vortex2.y=Math.max(.12,Math.min(.88,this.vortex2.y)),this.vortex2.strength=(e.midRangeSwirl*.9+e.hiHatIntensity*.6+e.energy*.35)*P*R,this.floatFactor>.4&&(this.vortex2.strength=Math.max(.12,this.vortex2.strength*.4)),this.vortex2.spinSign=-1;const x=[],_=e.spectrumBands,L=e.ebbSurge.isEbb,T=e.ebbSurge.isSurge;for(let b=0;b<Math.min(this.agents.length,_.length);b++){const p=this.agents[b],S=_[b];if(S.amplitude<.001&&!T)continue;const w=b<=2,z=b>=3&&b<=6,F=b>=7,B=(n*.4+this.beatPhase*.22*v)*P*(1.1+S.amplitude*1.4),I=Math.sin(B*p.freq1+p.wanderSeedX)*.65+Math.cos(B*p.freq2*.7+p.wanderSeedY)*.45+Math.sin(B*(p.freq1+p.freq2)*.55+p.wanderSeedX*1.7)*.4,V=Math.cos(B*p.freq1*.8+p.wanderSeedY)*.65+Math.sin(B*p.freq2+p.wanderSeedX)*.45+Math.cos(B*(p.freq1+p.freq2)*.65+p.wanderSeedY*1.7)*.4,U=(.12+S.amplitude*.35+e.energy*.16)*P*R,G=.038+S.amplitude*.05+e.energy*.025;let O=U*(1-this.floatFactor)+G*this.floatFactor,j=I*(.45-this.floatFactor*.22),K=V*(.45-this.floatFactor*.22);p.retargetCooldown-=t;const ie=(1-this.floatFactor)*(.45+Math.random()*.55)/Math.max(.6,P)+this.floatFactor*(3.5+Math.random()*2),X=r||F&&a;if((p.retargetCooldown<=0||X&&this.floatFactor<.65)&&(p.targetX=.1+Math.random()*.8,p.targetY=.1+Math.random()*.8,p.retargetCooldown=ie,X&&this.floatFactor<.7)){const ne=this.barPhase*.5+p.wanderSeedX*1.5,re=Math.random()*Math.PI*2,se=ne*.35+re*.65,_e=(.24+Math.random()*.38)*P*R*(1-this.floatFactor*.8);p.vx+=Math.cos(se)*_e,p.vy+=Math.sin(se)*_e}const $=p.targetX-p.x,H=p.targetY-p.y,N=Math.hypot($,H);if(N>.03){const ne=(.52+S.amplitude*.88)*P*(1-this.floatFactor*.65)+.14*this.floatFactor;j+=$/N*ne,K+=H/N*ne}if(w&&(O*=1+S.amplitude*.5,e.isKick||e.kickIntensity>.2)){const ne=p.x-this.currentKickCenter[0],re=p.y-this.currentKickCenter[1],se=Math.max(.08,Math.hypot(ne,re)),_e=e.kickIntensity*1.1/se*R*(1-this.floatFactor*.75);j+=ne/se*_e,K+=re/se*_e}if(z){O*=1+S.amplitude*.7,j+=this.flowCurrent[0]*.7,K+=this.flowCurrent[1]*.7;const ne=p.x-this.vortex1.x,re=p.y-this.vortex1.y,se=Math.hypot(ne,re);se<this.vortex1.radius&&se>.02&&(j+=-re/se*this.vortex1.strength*this.vortex1.spinSign*.55,K+=ne/se*this.vortex1.strength*this.vortex1.spinSign*.55)}F&&(O*=1.2+S.amplitude*1.1,p.burstTimer-=t,a&&this.floatFactor<.6&&p.burstTimer<=0&&(p.burstTimer=.2+Math.random()*.25,p.targetX=.1+Math.random()*.8,p.targetY=.1+Math.random()*.8),p.burstTimer>0&&(O*=1.6+.4*v));const q=.08;p.x<q?j+=(q-p.x)*4.5:p.x>1-q&&(j-=(p.x-(1-q))*4.5),p.y<q?K+=(q-p.y)*4.5:p.y>1-q&&(K-=(p.y-(1-q))*4.5);const Ne=Math.min(1,t*(6.5-this.floatFactor*3.5));p.vx+=(j-p.vx)*Ne,p.vy+=(K-p.vy)*Ne;const pe=Math.hypot(p.vx,p.vy);if(pe>.001){const ne=Math.min(1,t*(4.5-this.floatFactor*2.5)),re=pe+(O-pe)*ne;p.vx=p.vx/pe*re,p.vy=p.vy/pe*re}p.x+=p.vx*t,p.y+=p.vy*t,p.x=Math.max(.04,Math.min(.96,p.x)),p.y=Math.max(.04,Math.min(.96,p.y));const D=1+this.floatFactor*.35,Y=i.splatRadius*(1.6+(10-b)*.08)*(1+S.amplitude*.35)*D,te=S.amplitude*(L?.3:1)*i.colorSaturation*(1+S.amplitude*.4),le=Math.atan2(p.vy,p.vx)+Math.PI*.5*(b%2===0?1:-1),Se=Math.sin(this.beatPhase+p.wanderSeedX)*.35*(.5+e.energy*.5)*v,Bt=(F?1.5:w?1.1:1.3)*R;if(x.push({posX:p.x,posY:p.y,velX:(p.vx+Math.cos(le)*Se)*Bt,velY:(p.vy+Math.sin(le)*Se)*Bt,oklab:S.oklab,amplitude:S.amplitude,radius:Y,intensity:te}),x.length>=24)break}if(e.harmonicLiquid&&(e.harmonicLiquid.isBurst||e.harmonicLiquid.burstIntensity>.05)){const b=e.harmonicLiquid.burstIntensity,p=e.harmonicLiquid.complementaryHue,S=ae(.55+b*.12,.36,p),w=e.harmonicLiquid.burstOrigin||this.currentKickCenter,z=6;for(let F=0;F<z;F++){const B=F/z*Math.PI*2+n*2.2,I=e.harmonicLiquid.burstRadius*.4%.85;x.push({posX:Math.max(.08,Math.min(.92,w[0]+Math.cos(B)*I)),posY:Math.max(.08,Math.min(.92,w[1]+Math.sin(B)*I)),velX:Math.cos(B)*(1.8+b*2.5)*P*R,velY:Math.sin(B)*(1.8+b*2.5)*P*R,oklab:[S.L,S.a,S.b],amplitude:b,radius:i.splatRadius*(1.8+b*.8),intensity:b*1.25})}}if(e.harmonicLiquid&&e.harmonicLiquid.dissonanceFactor>.2){const b=e.harmonicLiquid.dissonanceFactor,p=e.harmonicLiquid.complementaryHue,S=ae(.5+b*.1,.35,p),w=n*1.8*P+this.beatPhase*.15;x.push({posX:Math.max(.08,Math.min(.92,this.vortex2.x+Math.cos(w)*.14)),posY:Math.max(.08,Math.min(.92,this.vortex2.y+Math.sin(w)*.14)),velX:-Math.sin(w)*1.5*P*R,velY:Math.cos(w)*1.5*P*R,oklab:[S.L,S.a,S.b],amplitude:b*.85,radius:i.splatRadius*1.6,intensity:b*.95})}if(T)for(let b=0;b<8;b++){let p,S,w,z;if(b<4){const B=b/4*Math.PI*2+n*1.5,I=.14+b%2*.08;p=Math.max(.08,Math.min(.92,this.currentKickCenter[0]+Math.cos(B)*I)),S=Math.max(.08,Math.min(.92,this.currentKickCenter[1]+Math.sin(B)*I)),w=Math.cos(B)*2.4*P,z=Math.sin(B)*2.4*P}else{const I=(b-4)/4*Math.PI*2+.785;p=Math.max(.08,Math.min(.92,.5+Math.cos(I)*.38)),S=Math.max(.08,Math.min(.92,.5+Math.sin(I)*.32)),w=-Math.cos(I)*2*P,z=-Math.sin(I)*2*P}const F=_[b*2%10]||_[0];if(x.push({posX:p,posY:S,velX:w,velY:z,oklab:[Math.min(1.2,F.oklab[0]*1.35),F.oklab[1]*1.45,F.oklab[2]*1.45],amplitude:1,radius:i.splatRadius*2.2,intensity:1}),x.length>=36)break}return this.lastBeatState=e.isKick||e.isBeat,this.lastKickState=e.isKick,this.lastHiHatState=e.isHiHat,{splats:x,vortices:[this.vortex1,this.vortex2],kickCenter:this.currentKickCenter,globalFlow:this.flowCurrent}}}const Si=`
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
`;class Fn{canvas;ctx=null;device=null;motionEngine=new xi;presentationFormat="bgra8unorm";colorSpace="srgb";isHdr=!1;velWidth=384;velHeight=384;dyeWidth=1024;dyeHeight=1024;pipeAdvect;pipeVorticity;pipeDivergence;pipeJacobi;pipeSubtractGrad;pipeDyeDiffuse;pipeInjectVelocity;pipeInjectDye;pipeBloomThreshold;pipeBloomBlur;pipeComposite;sampler;texVelA;texVelB;texDyeA;texDyeB;texDivergence;texPressureA;texPressureB;texBloomThreshold;texBloomBlurA;texBloomBlurB;bufSolver;bufForces;bufSplats;bufComposite;bufBloomH;bufBloomV;frameCount=0;lastFpsTime=performance.now();currentFps=60;currentFrameTime=16.6;resolutionScale=1;activePresetName="Auto";constructor(e){this.canvas=e}async init(){if(!navigator.gpu)return!1;try{const e=await navigator.gpu.requestAdapter({powerPreference:"high-performance"});if(!e||(this.device=await e.requestDevice(),this.ctx=this.canvas.getContext("webgpu"),!this.ctx))return!1;this.isHdr=!!(window.matchMedia&&window.matchMedia("(dynamic-range: high)").matches);const i=navigator.gpu.getPreferredCanvasFormat();let t=!1;if(this.isHdr)try{this.ctx.configure({device:this.device,format:"rgba16float",colorSpace:"display-p3",toneMapping:{mode:"extended"},alphaMode:"opaque"}),this.presentationFormat="rgba16float",this.colorSpace="display-p3",t=!0}catch(n){console.info("Extended HDR canvas tone mapping not supported, falling back:",n)}return t||(this.presentationFormat=i,this.colorSpace="srgb",this.ctx.configure({device:this.device,format:i,alphaMode:"opaque"})),this.sampler=this.device.createSampler({magFilter:"linear",minFilter:"linear",addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge"}),await this.buildPipelines(),this.allocateTextures(this.canvas.width||window.innerWidth,this.canvas.height||window.innerHeight),!0}catch(e){return console.error("WebGPU initialization failed:",e),!1}}async buildPipelines(){const e=this.device,i=e.createShaderModule({code:Bn}),t=e.createShaderModule({code:An}),n=e.createShaderModule({code:In}),r=e.createShaderModule({code:wn}),o=(a,c,l)=>e.createRenderPipeline({layout:"auto",vertex:{module:a,entryPoint:"vs_quad"},fragment:{module:a,entryPoint:c,targets:[{format:l}]},primitive:{topology:"triangle-list"}});this.pipeAdvect=o(i,"fs_advect_bfecc","rgba16float"),this.pipeVorticity=o(i,"fs_vorticity","rgba16float"),this.pipeDivergence=o(i,"fs_divergence","rgba16float"),this.pipeJacobi=o(i,"fs_jacobi","rgba16float"),this.pipeSubtractGrad=o(i,"fs_subtract_gradient","rgba16float"),this.pipeDyeDiffuse=o(i,"fs_dye_diffuse","rgba16float"),this.pipeInjectVelocity=o(t,"fs_inject_velocity","rgba16float"),this.pipeInjectDye=o(t,"fs_inject_dye","rgba16float"),this.pipeBloomThreshold=o(n,"fs_threshold","rgba16float"),this.pipeBloomBlur=o(n,"fs_blur","rgba16float"),this.pipeComposite=o(r,"fs_composite",this.presentationFormat),this.bufSolver=e.createBuffer({size:64,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),this.bufForces=e.createBuffer({size:128,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),this.bufSplats=e.createBuffer({size:1536,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST}),this.bufComposite=e.createBuffer({size:64,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),this.bufBloomH=e.createBuffer({size:32,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),this.bufBloomV=e.createBuffer({size:32,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST})}allocateTextures(e,i){const t=this.device,n=e/i;this.velWidth=384,this.velHeight=Math.max(128,Math.round(384/Math.max(.5,n))),this.dyeWidth=1024,this.dyeHeight=Math.max(512,Math.round(1024/Math.max(.5,n)));const r=GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.COPY_DST|GPUTextureUsage.COPY_SRC,o=(u,h)=>t.createTexture({size:[u,h],format:"rgba16float",usage:r});this.texVelA?.destroy(),this.texVelB?.destroy(),this.texDyeA?.destroy(),this.texDyeB?.destroy(),this.texDivergence?.destroy(),this.texPressureA?.destroy(),this.texPressureB?.destroy(),this.texBloomThreshold?.destroy(),this.texBloomBlurA?.destroy(),this.texBloomBlurB?.destroy(),this.texVelA=o(this.velWidth,this.velHeight),this.texVelB=o(this.velWidth,this.velHeight),this.texDivergence=o(this.velWidth,this.velHeight),this.texPressureA=o(this.velWidth,this.velHeight),this.texPressureB=o(this.velWidth,this.velHeight),this.texDyeA=o(this.dyeWidth,this.dyeHeight),this.texDyeB=o(this.dyeWidth,this.dyeHeight);const a=new Float32Array(this.dyeWidth*this.dyeHeight*4);for(let u=0;u<this.dyeWidth*this.dyeHeight;u++)a[u*4+0]=.4,a[u*4+1]=-.06,a[u*4+2]=-.26,a[u*4+3]=1;this.device.queue.writeTexture({texture:this.texDyeA},a,{bytesPerRow:this.dyeWidth*16},{width:this.dyeWidth,height:this.dyeHeight});const c=Math.max(64,Math.floor(this.dyeWidth/4)),l=Math.max(64,Math.floor(this.dyeHeight/4));this.texBloomThreshold=o(c,l),this.texBloomBlurA=o(c,l),this.texBloomBlurB=o(c,l)}resize(e,i){if(!this.device||e<=0||i<=0)return;const t=Math.max(320,Math.round(e*this.resolutionScale)),n=Math.max(240,Math.round(i*this.resolutionScale));(this.canvas.width!==t||this.canvas.height!==n)&&(this.canvas.width=t,this.canvas.height=n,this.allocateTextures(t,n))}render(e,i,t){if(!this.device||!this.ctx)return;const n=this.device,r=performance.now(),o=Math.min(.04,t>0?t:.0166);this.frameCount++,r-this.lastFpsTime>500&&(this.currentFps=Math.round(this.frameCount*1e3/(r-this.lastFpsTime)),this.currentFrameTime=(r-this.lastFpsTime)/this.frameCount,this.frameCount=0,this.lastFpsTime=r);const a=_t(i.activePreset,e.bpm,e.energy);this.activePresetName=a.name;const c=Math.max(.45,Math.min(2,e.bpm/115)),l=o*c;a.viscosityBase-i.viscosityBias*.03;let u=a.damping,h=a.diffusion;e.ebbSurge.isEbb?(u=.986,h*=.6):e.ebbSurge.isSurge&&(u=.996,h*=1.4);const d=this.canvas.width/this.canvas.height,f=r*.001,g=this.motionEngine.update(e,a,l,f),y=[];let P=0;for(const V of g.splats)if(y.push(V.posX,V.posY,V.velX,V.velY,V.oklab[0],V.oklab[1],V.oklab[2],V.amplitude,V.radius,V.intensity,0,0),P++,P>=32)break;const C=new Float32Array(16);C[0]=this.velWidth,C[1]=this.velHeight,C[2]=1/this.velWidth,C[3]=1/this.velHeight,C[4]=l,C[5]=f,C[6]=u,C[7]=a.vorticityScale,C[8]=h,C[9]=.997,n.queue.writeBuffer(this.bufSolver,0,C);const M=e.colorTemperature?.baseLab[0]??.5,v=e.colorTemperature?.baseLab[1]??-.04,R=e.colorTemperature?.baseLab[2]??-.15,A=e.ebbSurge.isEbb?.008:.015+e.energy*.022,m=new Float32Array(32);m[0]=d,m[1]=f,m[2]=l,m[3]=e.ebbSurge.isEbb?.02:.08,m[4]=e.kickIntensity,m[5]=e.midRangeSwirl,m[6]=e.hiHatIntensity,m[7]=e.ebbSurge.isSurge?1:0;const E=new Uint32Array(m.buffer);E[8]=P,m[9]=A,m[10]=g.kickCenter[0],m[11]=g.kickCenter[1],m[12]=M,m[13]=v,m[14]=R,m[15]=1,m[16]=g.vortices[0].x,m[17]=g.vortices[0].y,m[18]=g.vortices[0].strength,m[19]=g.vortices[0].spinSign,m[20]=g.vortices[1].x,m[21]=g.vortices[1].y,m[22]=g.vortices[1].strength,m[23]=g.vortices[1].spinSign,m[24]=g.globalFlow[0],m[25]=g.globalFlow[1],m[26]=0,m[27]=0,n.queue.writeBuffer(this.bufForces,0,m),y.length>0&&n.queue.writeBuffer(this.bufSplats,0,new Float32Array(y));const x=new Float32Array(16);x[0]=this.canvas.width,x[1]=this.canvas.height,x[2]=1/this.dyeWidth,x[3]=1/this.dyeHeight,x[4]=i.hdrIntensity,x[5]=this.isHdr?1:0,x[6]=a.specularGloss,x[7]=.8,x[8]=a.bloomStrength,x[9]=f,x[10]=0,x[11]=0,x[12]=M,x[13]=v,x[14]=R,x[15]=1,n.queue.writeBuffer(this.bufComposite,0,x);const _=Math.max(64,Math.floor(this.dyeWidth/4)),L=Math.max(64,Math.floor(this.dyeHeight/4)),T=new Float32Array([1/_,1/L,1,0,.65,1,0,0]),b=new Float32Array([1/_,1/L,0,1,.65,1,0,0]);n.queue.writeBuffer(this.bufBloomH,0,T),n.queue.writeBuffer(this.bufBloomV,0,b);const p=n.createCommandEncoder(),S=(V,U,G)=>{const O=n.createBindGroup({layout:V.getBindGroupLayout(0),entries:G}),j=p.beginRenderPass({colorAttachments:[{view:U.createView(),loadOp:"load",storeOp:"store"}]});j.setPipeline(V),j.setBindGroup(0,O),j.draw(3),j.end()};S(this.pipeAdvect,this.texVelB,[{binding:0,resource:{buffer:this.bufSolver}},{binding:1,resource:this.sampler},{binding:2,resource:this.texVelA.createView()},{binding:3,resource:this.texVelA.createView()}]),S(this.pipeAdvect,this.texDyeB,[{binding:0,resource:{buffer:this.bufSolver}},{binding:1,resource:this.sampler},{binding:2,resource:this.texDyeA.createView()},{binding:3,resource:this.texVelB.createView()}]),S(this.pipeInjectVelocity,this.texVelA,[{binding:0,resource:{buffer:this.bufForces}},{binding:1,resource:{buffer:this.bufSplats}},{binding:2,resource:this.sampler},{binding:3,resource:this.texVelB.createView()}]),S(this.pipeInjectDye,this.texDyeA,[{binding:0,resource:{buffer:this.bufForces}},{binding:1,resource:{buffer:this.bufSplats}},{binding:2,resource:this.sampler},{binding:3,resource:this.texDyeB.createView()}]),S(this.pipeDyeDiffuse,this.texDyeB,[{binding:0,resource:{buffer:this.bufSolver}},{binding:1,resource:this.sampler},{binding:2,resource:this.texDyeA.createView()}]),S(this.pipeVorticity,this.texVelB,[{binding:0,resource:{buffer:this.bufSolver}},{binding:1,resource:this.sampler},{binding:2,resource:this.texVelA.createView()},{binding:3,resource:this.texVelA.createView()}]),S(this.pipeDivergence,this.texDivergence,[{binding:0,resource:{buffer:this.bufSolver}},{binding:1,resource:this.sampler},{binding:2,resource:this.texVelB.createView()}]);let w=this.texPressureA,z=this.texPressureB;for(let V=0;V<24;V++){S(this.pipeJacobi,z,[{binding:0,resource:{buffer:this.bufSolver}},{binding:1,resource:this.sampler},{binding:2,resource:w.createView()},{binding:3,resource:this.texDivergence.createView()}]);const U=w;w=z,z=U}S(this.pipeSubtractGrad,this.texVelA,[{binding:0,resource:{buffer:this.bufSolver}},{binding:1,resource:this.sampler},{binding:2,resource:this.texVelB.createView()},{binding:3,resource:w.createView()}]),p.copyTextureToTexture({texture:this.texDyeB},{texture:this.texDyeA},[this.dyeWidth,this.dyeHeight,1]),S(this.pipeBloomThreshold,this.texBloomThreshold,[{binding:0,resource:{buffer:this.bufBloomH}},{binding:1,resource:this.sampler},{binding:2,resource:this.texDyeB.createView()}]),S(this.pipeBloomBlur,this.texBloomBlurA,[{binding:0,resource:{buffer:this.bufBloomH}},{binding:1,resource:this.sampler},{binding:2,resource:this.texBloomThreshold.createView()}]),S(this.pipeBloomBlur,this.texBloomBlurB,[{binding:0,resource:{buffer:this.bufBloomV}},{binding:1,resource:this.sampler},{binding:2,resource:this.texBloomBlurA.createView()}]);let F;try{F=this.ctx.getCurrentTexture()}catch{return}const B=n.createBindGroup({layout:this.pipeComposite.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:this.bufComposite}},{binding:1,resource:this.sampler},{binding:2,resource:this.texDyeB.createView()},{binding:3,resource:this.texBloomBlurB.createView()}]}),I=p.beginRenderPass({colorAttachments:[{view:F.createView(),loadOp:"clear",storeOp:"store",clearValue:{r:.02,g:.02,b:.05,a:1}}]});I.setPipeline(this.pipeComposite),I.setBindGroup(0,B),I.draw(3),I.end(),n.queue.submit([p.finish()])}getStats(){return{fps:this.currentFps,frameTimeMs:parseFloat(this.currentFrameTime.toFixed(1)),resolutionScale:parseFloat(this.resolutionScale.toFixed(2)),rendererType:this.isHdr?"WebGPU (HDR)":"WebGPU (SDR)",canvasFormat:this.presentationFormat,colorSpace:this.colorSpace,hdrActive:this.isHdr,activePreset:this.activePresetName,jacobiIterations:24}}dispose(){this.texVelA?.destroy(),this.texVelB?.destroy(),this.texDyeA?.destroy(),this.texDyeB?.destroy(),this.texDivergence?.destroy(),this.texPressureA?.destroy(),this.texPressureB?.destroy(),this.texBloomThreshold?.destroy(),this.texBloomBlurA?.destroy(),this.texBloomBlurB?.destroy(),this.bufSolver?.destroy(),this.bufForces?.destroy(),this.bufSplats?.destroy(),this.bufComposite?.destroy(),this.bufBloomH?.destroy(),this.bufBloomV?.destroy()}}const ue=`#version 300 es
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
`;class jn{canvas;gl=null;motionEngine=new xi;velWidth=384;velHeight=384;dyeWidth=768;dyeHeight=768;progAdvect;progVorticity;progDivergence;progJacobi;progSubtractGrad;progDyeDiffuse;progInjectVelocity;progInjectDye;progComposite;progAmbient;quadVao;internalFormat=0;texType=0;texVelA;texVelB;texDyeA;texDyeB;texDivergence;texPressureA;texPressureB;fboVelA;fboVelB;fboDyeA;fboDyeB;fboDiv;fboPressA;fboPressB;frameCount=0;lastFpsTime=performance.now();currentFps=60;currentFrameTime=16.6;activePresetName="Auto";constructor(e){this.canvas=e}async init(){const e=this.canvas.getContext("webgl2",{alpha:!1,depth:!1,stencil:!1,antialias:!1,powerPreference:"high-performance"});if(!e)return!1;this.gl=e;const i=e.getExtension("EXT_color_buffer_float");e.getExtension("OES_texture_float_linear"),i?(this.internalFormat=e.RGBA16F,this.texType=e.HALF_FLOAT):(this.internalFormat=e.RGBA8,this.texType=e.UNSIGNED_BYTE),this.progAdvect=this.createProgram(ue,Vn),this.progVorticity=this.createProgram(ue,Un),this.progDivergence=this.createProgram(ue,On),this.progJacobi=this.createProgram(ue,Nn),this.progSubtractGrad=this.createProgram(ue,Hn),this.progDyeDiffuse=this.createProgram(ue,zn),this.progInjectVelocity=this.createProgram(ue,$n),this.progInjectDye=this.createProgram(ue,Gn),this.progComposite=this.createProgram(wt,qn);const t=`#version 300 es
precision highp float;
in vec2 vUv;
out vec4 fragColor;
uniform sampler2D uDyeTex;
uniform vec4 uAmbientLab;   // OKLab color (L,a,b,intensity)
uniform float uBlendRate;
void main() {
  vec4 current = texture(uDyeTex, vUv);
  fragColor = mix(current, vec4(uAmbientLab.xyz, 1.0), uBlendRate);
}`;if(this.progAmbient=this.createProgram(wt.replace("aPosition","aPosition"),t),!this.progAdvect||!this.progComposite)return!1;this.quadVao=e.createVertexArray(),e.bindVertexArray(this.quadVao);const n=e.createBuffer();return e.bindBuffer(e.ARRAY_BUFFER,n),e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),e.STATIC_DRAW),e.enableVertexAttribArray(0),e.vertexAttribPointer(0,2,e.FLOAT,!1,0,0),e.bindVertexArray(null),this.allocateFramebuffers(this.canvas.width||window.innerWidth,this.canvas.height||window.innerHeight),this.seedInitialFluid(),!0}createProgram(e,i){const t=this.gl,n=t.createShader(t.VERTEX_SHADER);if(t.shaderSource(n,e),t.compileShader(n),!t.getShaderParameter(n,t.COMPILE_STATUS))return console.error(t.getShaderInfoLog(n)),null;const r=t.createShader(t.FRAGMENT_SHADER);if(t.shaderSource(r,i),t.compileShader(r),!t.getShaderParameter(r,t.COMPILE_STATUS))return console.error(t.getShaderInfoLog(r)),null;const o=t.createProgram();return t.attachShader(o,n),t.attachShader(o,r),t.linkProgram(o),t.getProgramParameter(o,t.LINK_STATUS)?o:(console.error(t.getProgramInfoLog(o)),null)}allocateFramebuffers(e,i){const t=this.gl,n=e/i;this.velWidth=384,this.velHeight=Math.max(128,Math.round(384/Math.max(.5,n))),this.dyeWidth=768,this.dyeHeight=Math.max(256,Math.round(768/Math.max(.5,n)));const r=(f,g)=>{const y=t.createTexture();t.bindTexture(t.TEXTURE_2D,y),t.texImage2D(t.TEXTURE_2D,0,this.internalFormat,f,g,0,t.RGBA,this.texType,null),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.LINEAR),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,t.LINEAR),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE);const P=t.createFramebuffer();return t.bindFramebuffer(t.FRAMEBUFFER,P),t.framebufferTexture2D(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,y,0),{tex:y,fbo:P}},o=r(this.velWidth,this.velHeight);this.texVelA=o.tex,this.fboVelA=o.fbo;const a=r(this.velWidth,this.velHeight);this.texVelB=a.tex,this.fboVelB=a.fbo;const c=r(this.velWidth,this.velHeight);this.texDivergence=c.tex,this.fboDiv=c.fbo;const l=r(this.velWidth,this.velHeight);this.texPressureA=l.tex,this.fboPressA=l.fbo;const u=r(this.velWidth,this.velHeight);this.texPressureB=u.tex,this.fboPressB=u.fbo;const h=r(this.dyeWidth,this.dyeHeight);this.texDyeA=h.tex,this.fboDyeA=h.fbo;const d=r(this.dyeWidth,this.dyeHeight);this.texDyeB=d.tex,this.fboDyeB=d.fbo,t.bindFramebuffer(t.FRAMEBUFFER,null)}seedInitialFluid(){const e=this.gl;if(this.internalFormat!==e.RGBA16F)return;const i=new Float32Array(this.dyeWidth*this.dyeHeight*4);for(let t=0;t<this.dyeHeight;t++)for(let n=0;n<this.dyeWidth;n++){const r=(t*this.dyeWidth+n)*4,o=n/this.dyeWidth-.5,a=t/this.dyeHeight-.5,c=Math.atan2(a,o),l=Math.sqrt(o*o+a*a),h=((c/Math.PI*.5+.5)*360+220)%360*Math.PI/180,d=.28,f=.4+l*.08;i[r]=f,i[r+1]=d*Math.cos(h),i[r+2]=d*Math.sin(h),i[r+3]=1}e.bindTexture(e.TEXTURE_2D,this.texDyeA),e.texSubImage2D(e.TEXTURE_2D,0,0,0,this.dyeWidth,this.dyeHeight,e.RGBA,e.FLOAT,i),e.bindTexture(e.TEXTURE_2D,null)}resize(e,i){!this.gl||e<=0||i<=0||(this.canvas.width!==e||this.canvas.height!==i)&&(this.canvas.width=e,this.canvas.height=i,this.allocateFramebuffers(e,i))}render(e,i,t){if(!this.gl)return;const n=this.gl,r=performance.now(),o=Math.min(.04,t>0?t:.0166);this.frameCount++,r-this.lastFpsTime>500&&(this.currentFps=Math.round(this.frameCount*1e3/(r-this.lastFpsTime)),this.currentFrameTime=(r-this.lastFpsTime)/this.frameCount,this.frameCount=0,this.lastFpsTime=r);const a=_t(i.activePreset,e.bpm,e.energy);this.activePresetName=a.name;const c=Math.max(.45,Math.min(2,e.bpm/115)),l=o*c;let u=a.damping,h=a.diffusion;e.ebbSurge.isEbb?(u=.986,h*=.6):e.ebbSurge.isSurge&&(u=.996,h*=1.4);const d=this.canvas.width/this.canvas.height,f=r*.001,g=e.colorTemperature?.baseLab[0]??.5,y=e.colorTemperature?.baseLab[1]??-.04,P=e.colorTemperature?.baseLab[2]??-.15,C=e.ebbSurge.isEbb?.008:.015+e.energy*.022,M=this.motionEngine.update(e,a,l,f),v=[],R=[],A=[],m=[],E=[];let x=0;for(const T of M.splats)if(v.push(T.posX,T.posY),R.push(T.velX,T.velY),A.push(T.oklab[0],T.oklab[1],T.oklab[2]),m.push(T.radius),E.push(T.intensity),x++,x>=24)break;n.bindVertexArray(this.quadVao),n.bindFramebuffer(n.FRAMEBUFFER,this.fboVelB),n.viewport(0,0,this.velWidth,this.velHeight),n.useProgram(this.progAdvect),n.uniform2f(n.getUniformLocation(this.progAdvect,"uTexelSize"),1/this.velWidth,1/this.velHeight),n.uniform1f(n.getUniformLocation(this.progAdvect,"uDt"),l),n.uniform1f(n.getUniformLocation(this.progAdvect,"uDamping"),u),n.activeTexture(n.TEXTURE0),n.bindTexture(n.TEXTURE_2D,this.texVelA),n.uniform1i(n.getUniformLocation(this.progAdvect,"uSourceTex"),0),n.activeTexture(n.TEXTURE1),n.bindTexture(n.TEXTURE_2D,this.texVelA),n.uniform1i(n.getUniformLocation(this.progAdvect,"uVelocityTex"),1),n.drawArrays(n.TRIANGLES,0,3),n.bindFramebuffer(n.FRAMEBUFFER,this.fboVelA),n.viewport(0,0,this.velWidth,this.velHeight),n.useProgram(this.progInjectVelocity),n.uniform1f(n.getUniformLocation(this.progInjectVelocity,"uTime"),f),n.uniform1f(n.getUniformLocation(this.progInjectVelocity,"uDt"),l),n.uniform1f(n.getUniformLocation(this.progInjectVelocity,"uAspectRatio"),d),n.uniform1f(n.getUniformLocation(this.progInjectVelocity,"uCurlScale"),e.ebbSurge.isEbb?.02:.08),n.uniform1f(n.getUniformLocation(this.progInjectVelocity,"uKickIntensity"),e.kickIntensity),n.uniform1f(n.getUniformLocation(this.progInjectVelocity,"uMidRangeSwirl"),e.midRangeSwirl),n.uniform1f(n.getUniformLocation(this.progInjectVelocity,"uTrebleSparkle"),e.hiHatIntensity),n.uniform1i(n.getUniformLocation(this.progInjectVelocity,"uSplatCount"),x),n.uniform2f(n.getUniformLocation(this.progInjectVelocity,"uKickCenter"),M.kickCenter[0],M.kickCenter[1]),n.uniform4f(n.getUniformLocation(this.progInjectVelocity,"uVortex1"),M.vortices[0].x,M.vortices[0].y,M.vortices[0].strength,M.vortices[0].spinSign),n.uniform4f(n.getUniformLocation(this.progInjectVelocity,"uVortex2"),M.vortices[1].x,M.vortices[1].y,M.vortices[1].strength,M.vortices[1].spinSign),n.uniform2f(n.getUniformLocation(this.progInjectVelocity,"uGlobalFlow"),M.globalFlow[0],M.globalFlow[1]),x>0&&(n.uniform2fv(n.getUniformLocation(this.progInjectVelocity,"uSplatPos[0]"),new Float32Array(v)),n.uniform2fv(n.getUniformLocation(this.progInjectVelocity,"uSplatVel[0]"),new Float32Array(R)),n.uniform1fv(n.getUniformLocation(this.progInjectVelocity,"uSplatRadius[0]"),new Float32Array(m)),n.uniform1fv(n.getUniformLocation(this.progInjectVelocity,"uSplatIntensity[0]"),new Float32Array(E))),n.activeTexture(n.TEXTURE0),n.bindTexture(n.TEXTURE_2D,this.texVelB),n.uniform1i(n.getUniformLocation(this.progInjectVelocity,"uPrevVelocity"),0),n.drawArrays(n.TRIANGLES,0,3),n.bindFramebuffer(n.FRAMEBUFFER,this.fboDyeB),n.viewport(0,0,this.dyeWidth,this.dyeHeight),n.useProgram(this.progAdvect),n.uniform2f(n.getUniformLocation(this.progAdvect,"uTexelSize"),1/this.dyeWidth,1/this.dyeHeight),n.uniform1f(n.getUniformLocation(this.progAdvect,"uDt"),l),n.uniform1f(n.getUniformLocation(this.progAdvect,"uDamping"),.998),n.activeTexture(n.TEXTURE0),n.bindTexture(n.TEXTURE_2D,this.texDyeA),n.uniform1i(n.getUniformLocation(this.progAdvect,"uSourceTex"),0),n.activeTexture(n.TEXTURE1),n.bindTexture(n.TEXTURE_2D,this.texVelA),n.uniform1i(n.getUniformLocation(this.progAdvect,"uVelocityTex"),1),n.drawArrays(n.TRIANGLES,0,3),n.bindFramebuffer(n.FRAMEBUFFER,this.fboDyeA),n.viewport(0,0,this.dyeWidth,this.dyeHeight),n.useProgram(this.progInjectDye),n.uniform1f(n.getUniformLocation(this.progInjectDye,"uAspectRatio"),d),n.uniform1i(n.getUniformLocation(this.progInjectDye,"uSplatCount"),x),n.uniform4f(n.getUniformLocation(this.progInjectDye,"uAmbientLab"),g,y,P,1),n.uniform1f(n.getUniformLocation(this.progInjectDye,"uAmbientBlendRate"),C),x>0&&(n.uniform2fv(n.getUniformLocation(this.progInjectDye,"uSplatPos[0]"),new Float32Array(v)),n.uniform3fv(n.getUniformLocation(this.progInjectDye,"uSplatLab[0]"),new Float32Array(A)),n.uniform1fv(n.getUniformLocation(this.progInjectDye,"uSplatRadius[0]"),new Float32Array(m)),n.uniform1fv(n.getUniformLocation(this.progInjectDye,"uSplatIntensity[0]"),new Float32Array(E))),n.activeTexture(n.TEXTURE0),n.bindTexture(n.TEXTURE_2D,this.texDyeB),n.uniform1i(n.getUniformLocation(this.progInjectDye,"uPrevDyeTex"),0),n.drawArrays(n.TRIANGLES,0,3),n.bindFramebuffer(n.FRAMEBUFFER,this.fboDyeB),n.viewport(0,0,this.dyeWidth,this.dyeHeight),n.useProgram(this.progDyeDiffuse),n.uniform2f(n.getUniformLocation(this.progDyeDiffuse,"uTexelSize"),1/this.dyeWidth,1/this.dyeHeight),n.uniform1f(n.getUniformLocation(this.progDyeDiffuse,"uDiffusion"),h),n.uniform1f(n.getUniformLocation(this.progDyeDiffuse,"uDissipation"),.997),n.activeTexture(n.TEXTURE0),n.bindTexture(n.TEXTURE_2D,this.texDyeA),n.uniform1i(n.getUniformLocation(this.progDyeDiffuse,"uDyeTex"),0),n.drawArrays(n.TRIANGLES,0,3);{const T=this.texDyeA;this.texDyeA=this.texDyeB,this.texDyeB=T;const b=this.fboDyeA;this.fboDyeA=this.fboDyeB,this.fboDyeB=b}{let T=.32,b=0,p=-.08;if(e.spectrumBands.reduce((B,I)=>B+I.amplitude,0)>.001){let B=0,I=0,V=0,U=0;for(const G of e.spectrumBands){const O=Math.max(.03,G.amplitude);B+=G.oklab[0]*O,I+=G.oklab[1]*O,V+=G.oklab[2]*O,U+=O}T=B/U,b=I/U,p=V/U}T=Math.max(.28,Math.min(.72,T));const w=e.ebbSurge.isEbb?.004:.008+e.energy*.012;n.bindFramebuffer(n.FRAMEBUFFER,this.fboDyeB),n.viewport(0,0,this.dyeWidth,this.dyeHeight),n.useProgram(this.progAmbient),n.activeTexture(n.TEXTURE0),n.bindTexture(n.TEXTURE_2D,this.texDyeA),n.uniform1i(n.getUniformLocation(this.progAmbient,"uDyeTex"),0),n.uniform4f(n.getUniformLocation(this.progAmbient,"uAmbientLab"),T,b,p,1),n.uniform1f(n.getUniformLocation(this.progAmbient,"uBlendRate"),w),n.drawArrays(n.TRIANGLES,0,3);let z=this.texDyeA;this.texDyeA=this.texDyeB,this.texDyeB=z;let F=this.fboDyeA;this.fboDyeA=this.fboDyeB,this.fboDyeB=F}n.bindFramebuffer(n.FRAMEBUFFER,this.fboVelB),n.viewport(0,0,this.velWidth,this.velHeight),n.useProgram(this.progVorticity),n.uniform2f(n.getUniformLocation(this.progVorticity,"uTexelSize"),1/this.velWidth,1/this.velHeight),n.uniform1f(n.getUniformLocation(this.progVorticity,"uVorticityScale"),a.vorticityScale),n.uniform1f(n.getUniformLocation(this.progVorticity,"uDt"),l),n.activeTexture(n.TEXTURE0),n.bindTexture(n.TEXTURE_2D,this.texVelA),n.uniform1i(n.getUniformLocation(this.progVorticity,"uVelocityTex"),0),n.drawArrays(n.TRIANGLES,0,3),n.bindFramebuffer(n.FRAMEBUFFER,this.fboDiv),n.useProgram(this.progDivergence),n.uniform2f(n.getUniformLocation(this.progDivergence,"uTexelSize"),1/this.velWidth,1/this.velHeight),n.activeTexture(n.TEXTURE0),n.bindTexture(n.TEXTURE_2D,this.texVelB),n.uniform1i(n.getUniformLocation(this.progDivergence,"uVelocityTex"),0),n.drawArrays(n.TRIANGLES,0,3),n.useProgram(this.progJacobi),n.uniform2f(n.getUniformLocation(this.progJacobi,"uTexelSize"),1/this.velWidth,1/this.velHeight),n.activeTexture(n.TEXTURE1),n.bindTexture(n.TEXTURE_2D,this.texDivergence),n.uniform1i(n.getUniformLocation(this.progJacobi,"uDivergenceTex"),1);let _=this.texPressureA,L=this.fboPressB;for(let T=0;T<24;T++){n.bindFramebuffer(n.FRAMEBUFFER,L),n.activeTexture(n.TEXTURE0),n.bindTexture(n.TEXTURE_2D,_),n.uniform1i(n.getUniformLocation(this.progJacobi,"uPressureTex"),0),n.drawArrays(n.TRIANGLES,0,3);const b=L===this.fboPressB?this.texPressureB:this.texPressureA;L=L===this.fboPressB?this.fboPressA:this.fboPressB,_=b}n.bindFramebuffer(n.FRAMEBUFFER,this.fboVelA),n.useProgram(this.progSubtractGrad),n.uniform2f(n.getUniformLocation(this.progSubtractGrad,"uTexelSize"),1/this.velWidth,1/this.velHeight),n.activeTexture(n.TEXTURE0),n.bindTexture(n.TEXTURE_2D,this.texVelB),n.uniform1i(n.getUniformLocation(this.progSubtractGrad,"uVelocityTex"),0),n.activeTexture(n.TEXTURE1),n.bindTexture(n.TEXTURE_2D,_),n.uniform1i(n.getUniformLocation(this.progSubtractGrad,"uPressureTex"),1),n.drawArrays(n.TRIANGLES,0,3),n.bindFramebuffer(n.FRAMEBUFFER,null),n.viewport(0,0,this.canvas.width,this.canvas.height),n.useProgram(this.progComposite),n.uniform2f(n.getUniformLocation(this.progComposite,"uTexelSize"),1/this.dyeWidth,1/this.dyeHeight),n.uniform1f(n.getUniformLocation(this.progComposite,"uSpecularGloss"),a.specularGloss),n.uniform1f(n.getUniformLocation(this.progComposite,"uEdgeGlowStrength"),.8),n.uniform1f(n.getUniformLocation(this.progComposite,"uHdrIntensity"),i.hdrIntensity),n.uniform1f(n.getUniformLocation(this.progComposite,"uTime"),r*.001),n.uniform4f(n.getUniformLocation(this.progComposite,"uAmbientLab"),g,y,P,1),n.activeTexture(n.TEXTURE0),n.bindTexture(n.TEXTURE_2D,this.texDyeA),n.uniform1i(n.getUniformLocation(this.progComposite,"uDyeTex"),0),n.drawArrays(n.TRIANGLES,0,3),n.bindVertexArray(null)}getStats(){return{fps:this.currentFps,frameTimeMs:parseFloat(this.currentFrameTime.toFixed(1)),resolutionScale:1,rendererType:"WebGL2",canvasFormat:"rgba16f",colorSpace:"srgb",hdrActive:!1,activePreset:this.activePresetName,jacobiIterations:24}}dispose(){if(!this.gl)return;const e=this.gl;e.deleteTexture(this.texVelA),e.deleteTexture(this.texVelB),e.deleteTexture(this.texDyeA),e.deleteTexture(this.texDyeB),e.deleteTexture(this.texDivergence),e.deleteTexture(this.texPressureA),e.deleteTexture(this.texPressureB)}}class Wn{el;callbacks;constructor(e){typeof e=="function"?this.callbacks={onStartSolo:e,onStartPhoneRemote:()=>{},onStartTVReceiver:()=>{}}:this.callbacks=e,this.el=document.createElement("div"),this.el.className="start-screen",this.el.innerHTML=`
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

          <div class="phone-tv-action-card">
            <button class="phone-tv-bt-btn" id="btnPhoneRemote">
              <div class="bt-action-left">
                <span class="bt-icon-circle">ᛒ</span>
                <div class="sub-text">
                  <span class="sub-title">Connect to TV via Bluetooth</span>
                  <span class="sub-desc">100% Phone-Initiated • Auto-opens on TV • Zero TV setup</span>
                </div>
              </div>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
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
    `,document.body.appendChild(this.el),this.el.querySelector("#btnStartApp")?.addEventListener("click",r=>{r.stopPropagation(),this.dismiss("solo")}),this.el.querySelector("#btnPhoneRemote")?.addEventListener("click",r=>{r.stopPropagation(),this.dismiss("phone")});const n=r=>{(r.key===" "||r.key==="Enter")&&(window.removeEventListener("keydown",n),this.dismiss("solo"))};window.addEventListener("keydown",n)}dismiss(e){this.el.classList.add("start-fade-out"),setTimeout(()=>{this.el.parentElement&&this.el.parentElement.removeChild(this.el)},600),e==="solo"?this.callbacks.onStartSolo():e==="phone"?this.callbacks.onStartPhoneRemote():e==="tv"&&this.callbacks.onStartTVReceiver()}}class Kn{container;constructor(){this.container=document.createElement("div"),this.container.className="toast-container",document.body.appendChild(this.container)}show(e,i=3200,t="info"){const n=document.createElement("div");n.className=`toast toast-${t}`,n.textContent=e,this.container.appendChild(n),requestAnimationFrame(()=>{n.classList.add("toast-visible")}),setTimeout(()=>{n.classList.remove("toast-visible"),setTimeout(()=>{n.parentElement&&n.parentElement.removeChild(n)},400)},i)}}class Xn{modal;isOpen=!1;settings;callbacks;deviceSelectEl=null;getColorTempLabel(e){return e>.05?`+${Math.round(e*100)}% Warm 🔥`:e<-.05?`${Math.round(e*100)}% Cool ❄`:"Neutral (Auto Harmonic) ⚪"}constructor(e,i){this.settings={...e},this.callbacks=i,this.modal=document.createElement("div"),this.modal.className="modal-backdrop settings-modal hidden",this.modal.innerHTML=`
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
    `,document.body.appendChild(this.modal),this.deviceSelectEl=this.modal.querySelector("#settingDevice"),this.bindEvents()}bindEvents(){const e=this.modal.querySelector(".modal-close-btn"),i=this.modal.querySelector("#btnCloseSettings");e?.addEventListener("click",()=>this.hide()),i?.addEventListener("click",()=>this.hide()),this.modal.addEventListener("click",E=>{E.target===this.modal&&this.hide()});const t=this.modal.querySelectorAll(".preset-btn");t.forEach(E=>{E.addEventListener("click",()=>{const x=E.dataset.preset;t.forEach(_=>_.classList.remove("active")),E.classList.add("active"),this.settings.activePreset=x,this.callbacks.onSelectPreset(x)})});const n=this.modal.querySelector("#settingSensitivity"),r=this.modal.querySelector("#valSensitivity");n.addEventListener("input",()=>{this.settings.sensitivity=parseFloat(n.value),r.textContent=`${this.settings.sensitivity.toFixed(2)}x`,this.callbacks.onUpdate(this.settings)});const o=this.modal.querySelector("#settingViscosity"),a=this.modal.querySelector("#valViscosity");o.addEventListener("input",()=>{this.settings.viscosityBias=parseFloat(o.value),a.textContent=`${this.settings.viscosityBias>0?"+":""}${this.settings.viscosityBias.toFixed(2)}`,this.callbacks.onUpdate(this.settings)});const c=this.modal.querySelector("#settingColorTemp"),l=this.modal.querySelector("#valColorTemp"),u=this.modal.querySelector("#btnTempCool"),h=this.modal.querySelector("#btnTempNeutral"),d=this.modal.querySelector("#btnTempWarm"),f=E=>{this.settings.colorTempBias=Math.max(-1,Math.min(1,E)),c&&(c.value=this.settings.colorTempBias.toString()),l&&(l.textContent=this.getColorTempLabel(this.settings.colorTempBias)),u?.classList.toggle("active-action",this.settings.colorTempBias<-.3),h?.classList.toggle("active-action",Math.abs(this.settings.colorTempBias)<=.05),d?.classList.toggle("active-action",this.settings.colorTempBias>.3),this.callbacks.onUpdate(this.settings)};c?.addEventListener("input",()=>{f(parseFloat(c.value))}),u?.addEventListener("click",()=>f(-1)),h?.addEventListener("click",()=>f(0)),d?.addEventListener("click",()=>f(1));const g=this.modal.querySelector("#btnModeShifting"),y=this.modal.querySelector("#btnModeFixed"),P=this.modal.querySelector("#valShiftMode"),C=this.modal.querySelector("#settingShiftSpeed"),M=this.modal.querySelector("#valShiftSpeed");g?.addEventListener("click",()=>{this.settings.paletteShiftMode="shifting",g.classList.add("active-action"),y.classList.remove("active-action"),P.textContent="Dynamic Shifting ↺",this.callbacks.onUpdate(this.settings)}),y?.addEventListener("click",()=>{this.settings.paletteShiftMode="fixed",y.classList.add("active-action"),g.classList.remove("active-action"),P.textContent="Fixed Mood",this.callbacks.onUpdate(this.settings)}),C?.addEventListener("input",()=>{this.settings.paletteShiftSpeed=parseFloat(C.value),M.textContent=`${this.settings.paletteShiftSpeed.toFixed(1)}x`,this.callbacks.onUpdate(this.settings)});const v=this.modal.querySelector("#settingHdr"),R=this.modal.querySelector("#valHdr");v.addEventListener("input",()=>{this.settings.hdrIntensity=parseFloat(v.value),R.textContent=this.settings.hdrIntensity.toFixed(2),this.callbacks.onUpdate(this.settings)});const A=this.modal.querySelector("#chkSmartLights"),m=this.modal.querySelector("#txtSmartLightUrl");A.addEventListener("change",()=>{this.settings.enableSmartLights=A.checked,this.callbacks.onUpdate(this.settings)}),m.addEventListener("change",()=>{this.settings.smartLightWsUrl=m.value,this.callbacks.onUpdate(this.settings)}),this.modal.querySelector("#btnScreenshot")?.addEventListener("click",()=>{this.callbacks.onTakeScreenshot()}),this.modal.querySelector("#btnRecord")?.addEventListener("click",()=>{this.callbacks.onToggleRecording()}),this.modal.querySelector("#btnResetSettings")?.addEventListener("click",()=>{this.callbacks.onReset()}),this.modal.querySelector("#btnTabAudio")?.addEventListener("click",()=>{this.hide(),this.callbacks.onCaptureTab()}),this.modal.querySelector("#btnDemoAudio")?.addEventListener("click",()=>{this.callbacks.onToggleDemo()})}setDevices(e,i){this.deviceSelectEl&&(this.deviceSelectEl.innerHTML="",e.forEach(t=>{const n=document.createElement("option");n.value=t.deviceId,n.textContent=t.label||"Default Audio Device",n.selected=t.deviceId===i,this.deviceSelectEl.appendChild(n)}))}setPreset(e){this.modal.querySelectorAll(".preset-btn").forEach(t=>{t.dataset.preset===e?t.classList.add("active"):t.classList.remove("active")}),this.settings.activePreset=e}updateValues(e){this.settings={...e},this.setPreset(this.settings.activePreset);const i=this.modal.querySelector("#valShiftMode");i&&(i.textContent=this.settings.paletteShiftMode==="fixed"?"Fixed Mood":"Dynamic Shifting ↺");const t=this.modal.querySelector("#settingShiftSpeed"),n=this.modal.querySelector("#valShiftSpeed");t&&n&&(t.value=(this.settings.paletteShiftSpeed??1).toString(),n.textContent=`${(this.settings.paletteShiftSpeed??1).toFixed(1)}x`);const r=this.modal.querySelector("#settingColorTemp"),o=this.modal.querySelector("#valColorTemp");r&&o&&(r.value=(this.settings.colorTempBias??0).toString(),o.textContent=this.getColorTempLabel(this.settings.colorTempBias??0));const a=this.modal.querySelector("#btnTempCool"),c=this.modal.querySelector("#btnTempNeutral"),l=this.modal.querySelector("#btnTempWarm");a?.classList.toggle("active-action",(this.settings.colorTempBias??0)<-.3),c?.classList.toggle("active-action",Math.abs(this.settings.colorTempBias??0)<=.05),l?.classList.toggle("active-action",(this.settings.colorTempBias??0)>.3)}toggle(){this.isOpen?this.hide():this.show()}show(){this.isOpen=!0,this.modal.classList.remove("hidden")}hide(){this.isOpen=!1,this.modal.classList.add("hidden")}getIsOpen(){return this.isOpen}}class Yn{modal;listElement;isOpen=!1;onSelectCallback;constructor(e){this.onSelectCallback=e,this.modal=document.createElement("div"),this.modal.className="modal-backdrop device-modal hidden",this.modal.innerHTML=`
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
    `,document.body.appendChild(this.modal),this.listElement=this.modal.querySelector("#deviceList"),this.modal.querySelector(".modal-close-btn")?.addEventListener("click",()=>this.hide()),this.modal.addEventListener("click",t=>{t.target===this.modal&&this.hide()})}setDevices(e,i){if(this.listElement.innerHTML="",e.length===0){this.listElement.innerHTML='<div class="device-empty">No audio input devices found.</div>';return}e.forEach(t=>{const n=document.createElement("button");n.className=`device-item ${t.deviceId===i?"active":""}`,n.innerHTML=`
        <span class="device-icon">🎙️</span>
        <span class="device-name">${t.label||"Default Audio Device"}</span>
        ${t.deviceId===i?'<span class="device-badge">Selected</span>':""}
      `,n.addEventListener("click",()=>{this.onSelectCallback(t.deviceId),this.hide()}),this.listElement.appendChild(n)})}toggle(){this.isOpen?this.hide():this.show()}show(){this.isOpen=!0,this.modal.classList.remove("hidden")}hide(){this.isOpen=!1,this.modal.classList.add("hidden")}getIsOpen(){return this.isOpen}}class Jn{el;isVisible=!1;bpmEl;energyEl;energyBarEl;beatDotEl;dynamicsEl;hueSpreadEl;presetEl;fpsEl;rendererEl;pitchEl;tempEl;harmonicPalEl;dissonanceEl;fluidVelEl;jacobiEl;stripCols;constructor(){this.el=document.createElement("div"),this.el.className="debug-overlay hidden",this.el.innerHTML=`
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
    `,document.body.appendChild(this.el),this.bpmEl=this.el.querySelector("#dbgBpm"),this.energyEl=this.el.querySelector("#dbgEnergy"),this.energyBarEl=this.el.querySelector("#dbgEnergyBar"),this.beatDotEl=this.el.querySelector("#dbgBeatDot"),this.dynamicsEl=this.el.querySelector("#dbgDynamics"),this.hueSpreadEl=this.el.querySelector("#dbgHueSpread"),this.presetEl=this.el.querySelector("#dbgPreset"),this.fpsEl=this.el.querySelector("#dbgFps"),this.rendererEl=this.el.querySelector("#dbgRenderer"),this.pitchEl=this.el.querySelector("#dbgPitch"),this.tempEl=this.el.querySelector("#dbgTemp"),this.harmonicPalEl=this.el.querySelector("#dbgHarmonicPalette"),this.dissonanceEl=this.el.querySelector("#dbgDissonance"),this.fluidVelEl=this.el.querySelector("#dbgFluidVel"),this.jacobiEl=this.el.querySelector("#dbgJacobi");const e=this.el.querySelector("#dbgHueStrip");this.stripCols=[];for(let i=0;i<10;i++){const t=document.createElement("div");t.className="strip-band",t.innerHTML='<div class="strip-fill"></div>',e.appendChild(t),this.stripCols.push(t)}}update(e,i){if(!this.isVisible)return;this.bpmEl.textContent=`${e.bpm} BPM`,this.energyEl.textContent=e.energy.toFixed(2),this.energyBarEl.style.width=`${Math.round(e.energy*100)}%`,e.isBeat?this.beatDotEl.classList.add("pulse"):e.beatIntensity<.2&&this.beatDotEl.classList.remove("pulse"),e.ebbSurge.isSurge?(this.dynamicsEl.textContent="SURGE! 💥",this.dynamicsEl.className="dynamics-pill dynamics-surge"):e.ebbSurge.isEbb?(this.dynamicsEl.textContent="EBB 🌊",this.dynamicsEl.className="dynamics-pill dynamics-ebb"):e.ebbSurge.dynamicsRatio>1.2?(this.dynamicsEl.textContent="Building ▲",this.dynamicsEl.className="dynamics-pill dynamics-build"):(this.dynamicsEl.textContent="Flowing ▬",this.dynamicsEl.className="dynamics-pill"),this.hueSpreadEl.textContent=`${e.hueSpreadDeg}°`,this.presetEl.textContent=i.activePreset||e.activePreset;const t=e.pitchInfo.biasApplied>.05?"Maj":e.pitchInfo.biasApplied<-.05?"Min":"";if(this.pitchEl.textContent=`${e.pitchInfo.pitchName} ${t}`,e.colorTemperature&&this.tempEl&&(this.tempEl.textContent=e.colorTemperature.description,this.tempEl.className=e.colorTemperature.isWarm?"temperature-pill temp-warm":"temperature-pill temp-cold"),e.harmonicLiquid){const n=e.harmonicLiquid;if(this.harmonicPalEl&&(this.harmonicPalEl.textContent=`${Math.round(n.dominantHue)}° / ${Math.round(n.complementaryHue)}°`),this.dissonanceEl){const r=n.musicalMode==="major"?"Major":n.musicalMode==="minor"?"Minor":"Tense";this.dissonanceEl.textContent=`${n.dissonanceFactor.toFixed(2)} (${r})`}if(this.fluidVelEl){const r=n.isBurst?` (Burst ${(n.burstIntensity*100).toFixed(0)}%)`:"";this.fluidVelEl.textContent=`${n.fluidVelocity.toFixed(2)}${r}`}}this.fpsEl.textContent=`${i.fps} FPS`,this.rendererEl.textContent=`${i.rendererType} [${i.colorSpace}]`,this.jacobiEl&&(this.jacobiEl.textContent=i.jacobiIterations>0?`${i.jacobiIterations} Jacobi Passes`:"Soft-Light Convective Pass");for(let n=0;n<10;n++){const r=e.spectrumBands[n];if(r&&this.stripCols[n]){const o=this.stripCols[n].querySelector(".strip-fill"),a=Math.round(r.effectiveHue);o.style.backgroundColor=`hsl(${a}, 90%, ${Math.round(r.lightness*65)}%)`,o.style.height=`${Math.min(100,Math.round(r.amplitude*100))}%`,o.style.boxShadow=r.amplitude>.4?`0 0 8px hsl(${a}, 90%, 60%)`:"none"}}}toggle(){this.isVisible=!this.isVisible,this.isVisible?this.el.classList.remove("hidden"):this.el.classList.add("hidden")}show(){this.isVisible=!0,this.el.classList.remove("hidden")}hide(){this.isVisible=!1,this.el.classList.add("hidden")}}class Qn{canvas;mediaRecorder=null;recordedChunks=[];isRecording=!1;recordTimeout=null;onNotify;constructor(e,i){this.canvas=e,this.onNotify=i}takeScreenshot(){try{const e=this.canvas.toDataURL("image/png"),i=document.createElement("a"),t=new Date().toISOString().replace(/[:.]/g,"-");i.download=`vibefield-${t}.png`,i.href=e,document.body.appendChild(i),i.click(),document.body.removeChild(i),this.onNotify("Screenshot saved to Downloads (S)","success")}catch(e){this.onNotify(`Screenshot failed: ${e.message}`,"error")}}toggleRecording(){this.isRecording?this.stopRecording():this.startRecording(30)}startRecording(e=30){if(!this.isRecording)try{const i=this.canvas.captureStream(60);let t="video/webm;codecs=vp9";MediaRecorder.isTypeSupported(t)||(t="video/webm;codecs=vp8"),MediaRecorder.isTypeSupported(t)||(t="video/webm"),this.mediaRecorder=new MediaRecorder(i,{mimeType:t,videoBitsPerSecond:16e6}),this.recordedChunks=[],this.mediaRecorder.ondataavailable=n=>{n.data&&n.data.size>0&&this.recordedChunks.push(n.data)},this.mediaRecorder.onstop=()=>{this.saveVideo()},this.mediaRecorder.start(100),this.isRecording=!0,this.onNotify(`Recording started (${e}s limit, press R to stop)`,"info"),this.recordTimeout=window.setTimeout(()=>{this.isRecording&&this.stopRecording()},e*1e3)}catch(i){this.onNotify(`Recording error: ${i.message}`,"error")}}stopRecording(){!this.isRecording||!this.mediaRecorder||(this.isRecording=!1,this.recordTimeout!==null&&(window.clearTimeout(this.recordTimeout),this.recordTimeout=null),this.mediaRecorder.state!=="inactive"&&this.mediaRecorder.stop())}saveVideo(){if(this.recordedChunks.length===0)return;const e=new Blob(this.recordedChunks,{type:"video/webm"}),i=URL.createObjectURL(e),t=document.createElement("a"),n=new Date().toISOString().replace(/[:.]/g,"-");t.download=`vibefield-${n}.webm`,t.href=i,document.body.appendChild(t),t.click(),document.body.removeChild(t),setTimeout(()=>URL.revokeObjectURL(i),2e3),this.onNotify("Video saved to Downloads (R)","success")}getIsRecording(){return this.isRecording}}class Zn{ws=null;url="ws://localhost:8080/wled";isEnabled=!1;lastBroadcastTime=0;broadcastIntervalMs=100;isConnected=!1;retryTimer=null;constructor(e="ws://localhost:8080/wled",i=!1){this.url=e,this.isEnabled=i,this.isEnabled&&this.connect()}setEnabled(e){this.isEnabled=e,e&&!this.ws?this.connect():!e&&this.ws&&this.disconnect()}setUrl(e){this.url!==e&&(this.url=e,this.isEnabled&&(this.disconnect(),this.connect()))}getIsConnected(){return this.isConnected}connect(){if(!(this.ws||!this.isEnabled))try{this.ws=new WebSocket(this.url),this.ws.onopen=()=>{this.isConnected=!0,console.log(`[SmartLight] Connected to ${this.url}`)},this.ws.onclose=()=>{this.isConnected=!1,this.ws=null,this.isEnabled&&(this.retryTimer=window.setTimeout(()=>this.connect(),5e3))},this.ws.onerror=()=>{this.isConnected=!1}}catch{this.isConnected=!1,this.ws=null}}disconnect(){if(this.retryTimer!==null&&(window.clearTimeout(this.retryTimer),this.retryTimer=null),this.ws){try{this.ws.close()}catch{}this.ws=null}this.isConnected=!1}update(e){if(!this.isEnabled||!this.isConnected||!this.ws)return;const i=performance.now();if(i-this.lastBroadcastTime<this.broadcastIntervalMs)return;this.lastBroadcastTime=i;const t=e.dominantColor,n={timestamp:Date.now(),r:Math.round(Math.min(255,t.r*255)),g:Math.round(Math.min(255,t.g*255)),b:Math.round(Math.min(255,t.b*255)),hex:t.hex,brightness:Math.round(Math.min(255,t.lightness*255)),bpm:e.bpm,energy:e.energy,isBeat:e.isBeat,activePreset:e.activePreset};try{this.ws.send(JSON.stringify(n))}catch{}}dispose(){this.disconnect()}}class es{constructor(){this.encoder=new TextEncoder,this._pieces=[],this._parts=[]}append_buffer(e){this.flush(),this._parts.push(e)}append(e){this._pieces.push(e)}flush(){if(this._pieces.length>0){const e=new Uint8Array(this._pieces);this._parts.push(e),this._pieces=[]}}toArrayBuffer(){const e=[];for(const i of this._parts)e.push(i);return ts(e).buffer}}function ts(s){let e=0;for(const n of s)e+=n.byteLength;const i=new Uint8Array(e);let t=0;for(const n of s){const r=new Uint8Array(n.buffer,n.byteOffset,n.byteLength);i.set(r,t),t+=n.byteLength}return i}function Ci(s){return new is(s).unpack()}function Ti(s){const e=new ns,i=e.pack(s);return i instanceof Promise?i.then(()=>e.getBuffer()):e.getBuffer()}class is{constructor(e){this.index=0,this.dataBuffer=e,this.dataView=new Uint8Array(this.dataBuffer),this.length=this.dataBuffer.byteLength}unpack(){const e=this.unpack_uint8();if(e<128)return e;if((e^224)<32)return(e^224)-32;let i;if((i=e^160)<=15)return this.unpack_raw(i);if((i=e^176)<=15)return this.unpack_string(i);if((i=e^144)<=15)return this.unpack_array(i);if((i=e^128)<=15)return this.unpack_map(i);switch(e){case 192:return null;case 193:return;case 194:return!1;case 195:return!0;case 202:return this.unpack_float();case 203:return this.unpack_double();case 204:return this.unpack_uint8();case 205:return this.unpack_uint16();case 206:return this.unpack_uint32();case 207:return this.unpack_uint64();case 208:return this.unpack_int8();case 209:return this.unpack_int16();case 210:return this.unpack_int32();case 211:return this.unpack_int64();case 212:return;case 213:return;case 214:return;case 215:return;case 216:return i=this.unpack_uint16(),this.unpack_string(i);case 217:return i=this.unpack_uint32(),this.unpack_string(i);case 218:return i=this.unpack_uint16(),this.unpack_raw(i);case 219:return i=this.unpack_uint32(),this.unpack_raw(i);case 220:return i=this.unpack_uint16(),this.unpack_array(i);case 221:return i=this.unpack_uint32(),this.unpack_array(i);case 222:return i=this.unpack_uint16(),this.unpack_map(i);case 223:return i=this.unpack_uint32(),this.unpack_map(i)}}unpack_uint8(){const e=this.dataView[this.index]&255;return this.index++,e}unpack_uint16(){const e=this.read(2),i=(e[0]&255)*256+(e[1]&255);return this.index+=2,i}unpack_uint32(){const e=this.read(4),i=((e[0]*256+e[1])*256+e[2])*256+e[3];return this.index+=4,i}unpack_uint64(){const e=this.read(8),i=((((((e[0]*256+e[1])*256+e[2])*256+e[3])*256+e[4])*256+e[5])*256+e[6])*256+e[7];return this.index+=8,i}unpack_int8(){const e=this.unpack_uint8();return e<128?e:e-256}unpack_int16(){const e=this.unpack_uint16();return e<32768?e:e-65536}unpack_int32(){const e=this.unpack_uint32();return e<2**31?e:e-2**32}unpack_int64(){const e=this.unpack_uint64();return e<2**63?e:e-2**64}unpack_raw(e){if(this.length<this.index+e)throw new Error(`BinaryPackFailure: index is out of range ${this.index} ${e} ${this.length}`);const i=this.dataBuffer.slice(this.index,this.index+e);return this.index+=e,i}unpack_string(e){const i=this.read(e);let t=0,n="",r,o;for(;t<e;)r=i[t],r<160?(o=r,t++):(r^192)<32?(o=(r&31)<<6|i[t+1]&63,t+=2):(r^224)<16?(o=(r&15)<<12|(i[t+1]&63)<<6|i[t+2]&63,t+=3):(o=(r&7)<<18|(i[t+1]&63)<<12|(i[t+2]&63)<<6|i[t+3]&63,t+=4),n+=String.fromCodePoint(o);return this.index+=e,n}unpack_array(e){const i=new Array(e);for(let t=0;t<e;t++)i[t]=this.unpack();return i}unpack_map(e){const i={};for(let t=0;t<e;t++){const n=this.unpack();i[n]=this.unpack()}return i}unpack_float(){const e=this.unpack_uint32(),i=e>>31,t=(e>>23&255)-127,n=e&8388607|8388608;return(i===0?1:-1)*n*2**(t-23)}unpack_double(){const e=this.unpack_uint32(),i=this.unpack_uint32(),t=e>>31,n=(e>>20&2047)-1023,o=(e&1048575|1048576)*2**(n-20)+i*2**(n-52);return(t===0?1:-1)*o}read(e){const i=this.index;if(i+e<=this.length)return this.dataView.subarray(i,i+e);throw new Error("BinaryPackFailure: read index out of range")}}class ns{getBuffer(){return this._bufferBuilder.toArrayBuffer()}pack(e){if(typeof e=="string")this.pack_string(e);else if(typeof e=="number")Math.floor(e)===e?this.pack_integer(e):this.pack_double(e);else if(typeof e=="boolean")e===!0?this._bufferBuilder.append(195):e===!1&&this._bufferBuilder.append(194);else if(e===void 0)this._bufferBuilder.append(192);else if(typeof e=="object")if(e===null)this._bufferBuilder.append(192);else{const i=e.constructor;if(e instanceof Array){const t=this.pack_array(e);if(t instanceof Promise)return t.then(()=>this._bufferBuilder.flush())}else if(e instanceof ArrayBuffer)this.pack_bin(new Uint8Array(e));else if("BYTES_PER_ELEMENT"in e){const t=e;this.pack_bin(new Uint8Array(t.buffer,t.byteOffset,t.byteLength))}else if(e instanceof Date)this.pack_string(e.toString());else{if(e instanceof Blob)return e.arrayBuffer().then(t=>{this.pack_bin(new Uint8Array(t)),this._bufferBuilder.flush()});if(i==Object||i.toString().startsWith("class")){const t=this.pack_object(e);if(t instanceof Promise)return t.then(()=>this._bufferBuilder.flush())}else throw new Error(`Type "${i.toString()}" not yet supported`)}}else throw new Error(`Type "${typeof e}" not yet supported`);this._bufferBuilder.flush()}pack_bin(e){const i=e.length;if(i<=15)this.pack_uint8(160+i);else if(i<=65535)this._bufferBuilder.append(218),this.pack_uint16(i);else if(i<=4294967295)this._bufferBuilder.append(219),this.pack_uint32(i);else throw new Error("Invalid length");this._bufferBuilder.append_buffer(e)}pack_string(e){const i=this._textEncoder.encode(e),t=i.length;if(t<=15)this.pack_uint8(176+t);else if(t<=65535)this._bufferBuilder.append(216),this.pack_uint16(t);else if(t<=4294967295)this._bufferBuilder.append(217),this.pack_uint32(t);else throw new Error("Invalid length");this._bufferBuilder.append_buffer(i)}pack_array(e){const i=e.length;if(i<=15)this.pack_uint8(144+i);else if(i<=65535)this._bufferBuilder.append(220),this.pack_uint16(i);else if(i<=4294967295)this._bufferBuilder.append(221),this.pack_uint32(i);else throw new Error("Invalid length");const t=n=>{if(n<i){const r=this.pack(e[n]);return r instanceof Promise?r.then(()=>t(n+1)):t(n+1)}};return t(0)}pack_integer(e){if(e>=-32&&e<=127)this._bufferBuilder.append(e&255);else if(e>=0&&e<=255)this._bufferBuilder.append(204),this.pack_uint8(e);else if(e>=-128&&e<=127)this._bufferBuilder.append(208),this.pack_int8(e);else if(e>=0&&e<=65535)this._bufferBuilder.append(205),this.pack_uint16(e);else if(e>=-32768&&e<=32767)this._bufferBuilder.append(209),this.pack_int16(e);else if(e>=0&&e<=4294967295)this._bufferBuilder.append(206),this.pack_uint32(e);else if(e>=-2147483648&&e<=2147483647)this._bufferBuilder.append(210),this.pack_int32(e);else if(e>=-9223372036854776e3&&e<=9223372036854776e3)this._bufferBuilder.append(211),this.pack_int64(e);else if(e>=0&&e<=18446744073709552e3)this._bufferBuilder.append(207),this.pack_uint64(e);else throw new Error("Invalid integer")}pack_double(e){let i=0;e<0&&(i=1,e=-e);const t=Math.floor(Math.log(e)/Math.LN2),n=e/2**t-1,r=Math.floor(n*2**52),o=2**32,a=i<<31|t+1023<<20|r/o&1048575,c=r%o;this._bufferBuilder.append(203),this.pack_int32(a),this.pack_int32(c)}pack_object(e){const i=Object.keys(e),t=i.length;if(t<=15)this.pack_uint8(128+t);else if(t<=65535)this._bufferBuilder.append(222),this.pack_uint16(t);else if(t<=4294967295)this._bufferBuilder.append(223),this.pack_uint32(t);else throw new Error("Invalid length");const n=r=>{if(r<i.length){const o=i[r];if(e.hasOwnProperty(o)){this.pack(o);const a=this.pack(e[o]);if(a instanceof Promise)return a.then(()=>n(r+1))}return n(r+1)}};return n(0)}pack_uint8(e){this._bufferBuilder.append(e)}pack_uint16(e){this._bufferBuilder.append(e>>8),this._bufferBuilder.append(e&255)}pack_uint32(e){const i=e&4294967295;this._bufferBuilder.append((i&4278190080)>>>24),this._bufferBuilder.append((i&16711680)>>>16),this._bufferBuilder.append((i&65280)>>>8),this._bufferBuilder.append(i&255)}pack_uint64(e){const i=e/4294967296,t=e%2**32;this._bufferBuilder.append((i&4278190080)>>>24),this._bufferBuilder.append((i&16711680)>>>16),this._bufferBuilder.append((i&65280)>>>8),this._bufferBuilder.append(i&255),this._bufferBuilder.append((t&4278190080)>>>24),this._bufferBuilder.append((t&16711680)>>>16),this._bufferBuilder.append((t&65280)>>>8),this._bufferBuilder.append(t&255)}pack_int8(e){this._bufferBuilder.append(e&255)}pack_int16(e){this._bufferBuilder.append((e&65280)>>8),this._bufferBuilder.append(e&255)}pack_int32(e){this._bufferBuilder.append(e>>>24&255),this._bufferBuilder.append((e&16711680)>>>16),this._bufferBuilder.append((e&65280)>>>8),this._bufferBuilder.append(e&255)}pack_int64(e){const i=Math.floor(e/4294967296),t=e%2**32;this._bufferBuilder.append((i&4278190080)>>>24),this._bufferBuilder.append((i&16711680)>>>16),this._bufferBuilder.append((i&65280)>>>8),this._bufferBuilder.append(i&255),this._bufferBuilder.append((t&4278190080)>>>24),this._bufferBuilder.append((t&16711680)>>>16),this._bufferBuilder.append((t&65280)>>>8),this._bufferBuilder.append(t&255)}constructor(){this._bufferBuilder=new es,this._textEncoder=new TextEncoder}}let _i=!0,Ri=!0;function Me(s,e,i){const t=s.match(e);return t&&t.length>=i&&parseFloat(t[i],10)}function ge(s,e,i){if(!s.RTCPeerConnection)return;if(!Object.getOwnPropertyDescriptor(EventTarget.prototype,"addEventListener").writable){Rt("Unable to polyfill events");return}const n=s.RTCPeerConnection.prototype,r=n.addEventListener;n.addEventListener=function(a,c){if(a!==e)return r.apply(this,arguments);const l=u=>{const h=i(u);h&&(c.handleEvent?c.handleEvent(h):c(h))};return this._eventMap=this._eventMap||{},this._eventMap[e]||(this._eventMap[e]=new Map),this._eventMap[e].set(c,l),r.apply(this,[a,l])};const o=n.removeEventListener;n.removeEventListener=function(a,c){if(a!==e||!this._eventMap||!this._eventMap[e])return o.apply(this,arguments);if(!this._eventMap[e].has(c))return o.apply(this,arguments);const l=this._eventMap[e].get(c);return this._eventMap[e].delete(c),this._eventMap[e].size===0&&delete this._eventMap[e],Object.keys(this._eventMap).length===0&&delete this._eventMap,o.apply(this,[a,l])},Object.defineProperty(n,"on"+e,{get(){return this["_on"+e]},set(a){this["_on"+e]&&(this.removeEventListener(e,this["_on"+e]),delete this["_on"+e]),a&&this.addEventListener(e,this["_on"+e]=a)},enumerable:!0,configurable:!0})}function ss(s){return typeof s!="boolean"?new Error("Argument type: "+typeof s+". Please use a boolean."):(_i=s,s?"adapter.js logging disabled":"adapter.js logging enabled")}function rs(s){return typeof s!="boolean"?new Error("Argument type: "+typeof s+". Please use a boolean."):(Ri=!s,"adapter.js deprecation warnings "+(s?"disabled":"enabled"))}function Rt(){if(typeof window=="object"){if(_i)return;typeof console<"u"&&typeof console.log=="function"&&console.log.apply(console,arguments)}}function Et(s,e){Ri&&console.warn(s+" is deprecated, please use "+e+" instead.")}function os(s){const e={browser:null,version:null};if(typeof s>"u"||!s.navigator||!s.navigator.userAgent)return e.browser="Not a browser.",e;const{navigator:i}=s;if(i.userAgentData&&i.userAgentData.brands){const t=i.userAgentData.brands.find(n=>n.brand==="Chromium");if(t){const n=parseInt(t.version,10);if(n>=90)return{browser:"chrome",version:n}}}if(i.mozGetUserMedia)e.browser="firefox",e.version=parseInt(Me(i.userAgent,/Firefox\/(\d+)\./,1));else if(i.webkitGetUserMedia||s.isSecureContext===!1&&s.webkitRTCPeerConnection)e.browser="chrome",e.version=parseInt(Me(i.userAgent,/Chrom(e|ium)\/(\d+)\./,2))||null;else if(s.RTCPeerConnection&&i.userAgent.match(/AppleWebKit\/(\d+)\./))e.browser="safari",e.version=parseInt(Me(i.userAgent,/AppleWebKit\/(\d+)\./,1)),e.supportsUnifiedPlan=s.RTCRtpTransceiver&&"currentDirection"in s.RTCRtpTransceiver.prototype,e._safariVersion=Me(i.userAgent,/Version\/(\d+(\.?\d+))/,1);else return e.browser="Not a supported browser.",e;return e}function It(s){return Object.prototype.toString.call(s)==="[object Object]"}function Ei(s){return It(s)?Object.keys(s).reduce(function(e,i){const t=It(s[i]),n=t?Ei(s[i]):s[i],r=t&&!Object.keys(n).length;return n===void 0||r?e:Object.assign(e,{[i]:n})},{}):s}function gt(s,e,i){!e||i.has(e.id)||(i.set(e.id,e),Object.keys(e).forEach(t=>{t.endsWith("Id")?gt(s,s.get(e[t]),i):t.endsWith("Ids")&&e[t].forEach(n=>{gt(s,s.get(n),i)})}))}function Ft(s,e,i){const t=i?"outbound-rtp":"inbound-rtp",n=new Map;if(e===null)return n;const r=[];return s.forEach(o=>{o.type==="track"&&o.trackIdentifier===e.id&&r.push(o)}),r.forEach(o=>{s.forEach(a=>{a.type===t&&a.trackId===o.id&&gt(s,a,n)})}),n}const Vt=Rt;function Mi(s,e){if(e.version>=64)return;const i=s&&s.navigator;if(!i.mediaDevices)return;const t=function(a){if(typeof a!="object"||a.mandatory||a.optional)return a;const c={};return Object.keys(a).forEach(l=>{if(l==="require"||l==="advanced"||l==="mediaSource")return;const u=typeof a[l]=="object"?a[l]:{ideal:a[l]};u.exact!==void 0&&typeof u.exact=="number"&&(u.min=u.max=u.exact);const h=function(d,f){return d?d+f.charAt(0).toUpperCase()+f.slice(1):f==="deviceId"?"sourceId":f};if(u.ideal!==void 0){c.optional=c.optional||[];let d={};typeof u.ideal=="number"?(d[h("min",l)]=u.ideal,c.optional.push(d),d={},d[h("max",l)]=u.ideal,c.optional.push(d)):(d[h("",l)]=u.ideal,c.optional.push(d))}u.exact!==void 0&&typeof u.exact!="number"?(c.mandatory=c.mandatory||{},c.mandatory[h("",l)]=u.exact):["min","max"].forEach(d=>{u[d]!==void 0&&(c.mandatory=c.mandatory||{},c.mandatory[h(d,l)]=u[d])})}),a.advanced&&(c.optional=(c.optional||[]).concat(a.advanced)),c},n=function(a,c){if(e.version>=61)return c(a);if(a=JSON.parse(JSON.stringify(a)),a&&typeof a.audio=="object"){const l=function(u,h,d){h in u&&!(d in u)&&(u[d]=u[h],delete u[h])};a=JSON.parse(JSON.stringify(a)),l(a.audio,"autoGainControl","googAutoGainControl"),l(a.audio,"noiseSuppression","googNoiseSuppression"),a.audio=t(a.audio)}if(a&&typeof a.video=="object"){let l=a.video.facingMode;l=l&&(typeof l=="object"?l:{ideal:l});const u=e.version<66;if(l&&(l.exact==="user"||l.exact==="environment"||l.ideal==="user"||l.ideal==="environment")&&!(i.mediaDevices.getSupportedConstraints&&i.mediaDevices.getSupportedConstraints().facingMode&&!u)){delete a.video.facingMode;let h;if(l.exact==="environment"||l.ideal==="environment"?h=["back","rear"]:(l.exact==="user"||l.ideal==="user")&&(h=["front"]),h)return i.mediaDevices.enumerateDevices().then(d=>{d=d.filter(g=>g.kind==="videoinput");let f=d.find(g=>h.some(y=>g.label.toLowerCase().includes(y)));return!f&&d.length&&h.includes("back")&&(f=d[d.length-1]),f&&(a.video.deviceId=l.exact?{exact:f.deviceId}:{ideal:f.deviceId}),a.video=t(a.video),Vt("chrome: "+JSON.stringify(a)),c(a)})}a.video=t(a.video)}return Vt("chrome: "+JSON.stringify(a)),c(a)},r=function(a){return e.version>=64?a:{name:{PermissionDeniedError:"NotAllowedError",PermissionDismissedError:"NotAllowedError",InvalidStateError:"NotAllowedError",DevicesNotFoundError:"NotFoundError",ConstraintNotSatisfiedError:"OverconstrainedError",TrackStartError:"NotReadableError",MediaDeviceFailedDueToShutdown:"NotAllowedError",MediaDeviceKillSwitchOn:"NotAllowedError",TabCaptureError:"AbortError",ScreenCaptureError:"AbortError",DeviceCaptureError:"AbortError"}[a.name]||a.name,message:a.message,constraint:a.constraint||a.constraintName,toString(){return this.name+(this.message&&": ")+this.message}}},o=function(a,c,l){n(a,u=>{i.webkitGetUserMedia(u,c,h=>{l&&l(r(h))})})};if(i.getUserMedia=o.bind(i),i.mediaDevices.getUserMedia){const a=i.mediaDevices.getUserMedia.bind(i.mediaDevices);i.mediaDevices.getUserMedia=function(c){return n(c,l=>a(l).then(u=>{if(l.audio&&!u.getAudioTracks().length||l.video&&!u.getVideoTracks().length)throw u.getTracks().forEach(h=>{h.stop()}),new DOMException("","NotFoundError");return u},u=>Promise.reject(r(u))))}}}function Pi(s){s.MediaStream=s.MediaStream||s.webkitMediaStream}function ki(s,e){if(!(e.version>102))if(typeof s=="object"&&s.RTCPeerConnection&&!("ontrack"in s.RTCPeerConnection.prototype)){Object.defineProperty(s.RTCPeerConnection.prototype,"ontrack",{get(){return this._ontrack},set(t){this._ontrack&&this.removeEventListener("track",this._ontrack),this.addEventListener("track",this._ontrack=t)},enumerable:!0,configurable:!0});const i=s.RTCPeerConnection.prototype.setRemoteDescription;s.RTCPeerConnection.prototype.setRemoteDescription=function(){return this._ontrackpoly||(this._ontrackpoly=n=>{n.stream.addEventListener("addtrack",r=>{let o;s.RTCPeerConnection.prototype.getReceivers?o=this.getReceivers().find(c=>c.track&&c.track.id===r.track.id):o={track:r.track};const a=new Event("track");a.track=r.track,a.receiver=o,a.transceiver={receiver:o},a.streams=[n.stream],this.dispatchEvent(a)}),n.stream.getTracks().forEach(r=>{let o;s.RTCPeerConnection.prototype.getReceivers?o=this.getReceivers().find(c=>c.track&&c.track.id===r.id):o={track:r};const a=new Event("track");a.track=r,a.receiver=o,a.transceiver={receiver:o},a.streams=[n.stream],this.dispatchEvent(a)})},this.addEventListener("addstream",this._ontrackpoly)),i.apply(this,arguments)}}else ge(s,"track",i=>(i.transceiver||Object.defineProperty(i,"transceiver",{value:{receiver:i.receiver}}),i))}function Li(s){if(typeof s=="object"&&s.RTCPeerConnection&&!("getSenders"in s.RTCPeerConnection.prototype)&&"createDTMFSender"in s.RTCPeerConnection.prototype){const e=function(n,r){return{track:r,get dtmf(){return this._dtmf===void 0&&(r.kind==="audio"?this._dtmf=n.createDTMFSender(r):this._dtmf=null),this._dtmf},_pc:n}};if(!s.RTCPeerConnection.prototype.getSenders){s.RTCPeerConnection.prototype.getSenders=function(){return this._senders=this._senders||[],this._senders.slice()};const n=s.RTCPeerConnection.prototype.addTrack;s.RTCPeerConnection.prototype.addTrack=function(a,c){let l=n.apply(this,arguments);return l||(l=e(this,a),this._senders.push(l)),l};const r=s.RTCPeerConnection.prototype.removeTrack;s.RTCPeerConnection.prototype.removeTrack=function(a){r.apply(this,arguments);const c=this._senders.indexOf(a);c!==-1&&this._senders.splice(c,1)}}const i=s.RTCPeerConnection.prototype.addStream;s.RTCPeerConnection.prototype.addStream=function(r){this._senders=this._senders||[],i.apply(this,[r]),r.getTracks().forEach(o=>{this._senders.push(e(this,o))})};const t=s.RTCPeerConnection.prototype.removeStream;s.RTCPeerConnection.prototype.removeStream=function(r){this._senders=this._senders||[],t.apply(this,[r]),r.getTracks().forEach(o=>{const a=this._senders.find(c=>c.track===o);a&&this._senders.splice(this._senders.indexOf(a),1)})}}else if(typeof s=="object"&&s.RTCPeerConnection&&"getSenders"in s.RTCPeerConnection.prototype&&"createDTMFSender"in s.RTCPeerConnection.prototype&&s.RTCRtpSender&&!("dtmf"in s.RTCRtpSender.prototype)){const e=s.RTCPeerConnection.prototype.getSenders;s.RTCPeerConnection.prototype.getSenders=function(){const t=e.apply(this,[]);return t.forEach(n=>n._pc=this),t},Object.defineProperty(s.RTCRtpSender.prototype,"dtmf",{get(){return this._dtmf===void 0&&(this.track.kind==="audio"?this._dtmf=this._pc.createDTMFSender(this.track):this._dtmf=null),this._dtmf}})}}function Di(s,e){if(e.version>=67||!(typeof s=="object"&&s.RTCPeerConnection&&s.RTCRtpSender&&s.RTCRtpReceiver))return;if(!("getStats"in s.RTCRtpSender.prototype)){const t=s.RTCPeerConnection.prototype.getSenders;t&&(s.RTCPeerConnection.prototype.getSenders=function(){const o=t.apply(this,[]);return o.forEach(a=>a._pc=this),o});const n=s.RTCPeerConnection.prototype.addTrack;n&&(s.RTCPeerConnection.prototype.addTrack=function(){const o=n.apply(this,arguments);return o._pc=this,o}),s.RTCRtpSender.prototype.getStats=function(){const o=this;return this._pc.getStats().then(a=>Ft(a,o.track,!0))}}if(!("getStats"in s.RTCRtpReceiver.prototype)){const t=s.RTCPeerConnection.prototype.getReceivers;t&&(s.RTCPeerConnection.prototype.getReceivers=function(){const r=t.apply(this,[]);return r.forEach(o=>o._pc=this),r}),ge(s,"track",n=>(n.receiver._pc=n.srcElement,n)),s.RTCRtpReceiver.prototype.getStats=function(){const r=this;return this._pc.getStats().then(o=>Ft(o,r.track,!1))}}if(!("getStats"in s.RTCRtpSender.prototype&&"getStats"in s.RTCRtpReceiver.prototype))return;const i=s.RTCPeerConnection.prototype.getStats;s.RTCPeerConnection.prototype.getStats=function(){if(arguments.length>0&&arguments[0]instanceof s.MediaStreamTrack){const n=arguments[0];let r,o,a;return this.getSenders().forEach(c=>{c.track===n&&(r?a=!0:r=c)}),this.getReceivers().forEach(c=>(c.track===n&&(o?a=!0:o=c),c.track===n)),a||r&&o?Promise.reject(new DOMException("There are more than one sender or receiver for the track.","InvalidAccessError")):r?r.getStats():o?o.getStats():Promise.reject(new DOMException("There is no sender or receiver for the track.","InvalidAccessError"))}return i.apply(this,arguments)}}function Bi(s){s.RTCPeerConnection.prototype.getLocalStreams=function(){return this._shimmedLocalStreams=this._shimmedLocalStreams||{},Object.keys(this._shimmedLocalStreams).map(o=>this._shimmedLocalStreams[o][0])};const e=s.RTCPeerConnection.prototype.addTrack;s.RTCPeerConnection.prototype.addTrack=function(o,a){if(!a)return e.apply(this,arguments);this._shimmedLocalStreams=this._shimmedLocalStreams||{};const c=e.apply(this,arguments);return this._shimmedLocalStreams[a.id]?this._shimmedLocalStreams[a.id].indexOf(c)===-1&&this._shimmedLocalStreams[a.id].push(c):this._shimmedLocalStreams[a.id]=[a,c],c};const i=s.RTCPeerConnection.prototype.addStream;s.RTCPeerConnection.prototype.addStream=function(o){this._shimmedLocalStreams=this._shimmedLocalStreams||{},o.getTracks().forEach(l=>{if(this.getSenders().find(h=>h.track===l))throw new DOMException("Track already exists.","InvalidAccessError")});const a=this.getSenders();i.apply(this,arguments);const c=this.getSenders().filter(l=>a.indexOf(l)===-1);this._shimmedLocalStreams[o.id]=[o].concat(c)};const t=s.RTCPeerConnection.prototype.removeStream;s.RTCPeerConnection.prototype.removeStream=function(o){return this._shimmedLocalStreams=this._shimmedLocalStreams||{},delete this._shimmedLocalStreams[o.id],t.apply(this,arguments)};const n=s.RTCPeerConnection.prototype.removeTrack;s.RTCPeerConnection.prototype.removeTrack=function(o){return this._shimmedLocalStreams=this._shimmedLocalStreams||{},o&&Object.keys(this._shimmedLocalStreams).forEach(a=>{const c=this._shimmedLocalStreams[a].indexOf(o);c!==-1&&this._shimmedLocalStreams[a].splice(c,1),this._shimmedLocalStreams[a].length===1&&delete this._shimmedLocalStreams[a]}),n.apply(this,arguments)}}function Ai(s,e){if(!s.RTCPeerConnection)return;if(s.RTCPeerConnection.prototype.addTrack&&e.version>=65)return Bi(s);const i=s.RTCPeerConnection.prototype.getLocalStreams;s.RTCPeerConnection.prototype.getLocalStreams=function(){const u=i.apply(this);return this._reverseStreams=this._reverseStreams||{},u.map(h=>this._reverseStreams[h.id])};const t=s.RTCPeerConnection.prototype.addStream;s.RTCPeerConnection.prototype.addStream=function(u){if(this._streams=this._streams||{},this._reverseStreams=this._reverseStreams||{},u.getTracks().forEach(h=>{if(this.getSenders().find(f=>f.track===h))throw new DOMException("Track already exists.","InvalidAccessError")}),!this._reverseStreams[u.id]){const h=new s.MediaStream(u.getTracks());this._streams[u.id]=h,this._reverseStreams[h.id]=u,u=h}t.apply(this,[u])};const n=s.RTCPeerConnection.prototype.removeStream;s.RTCPeerConnection.prototype.removeStream=function(u){this._streams=this._streams||{},this._reverseStreams=this._reverseStreams||{},n.apply(this,[this._streams[u.id]||u]),delete this._reverseStreams[this._streams[u.id]?this._streams[u.id].id:u.id],delete this._streams[u.id]},s.RTCPeerConnection.prototype.addTrack=function(u,h){if(this.signalingState==="closed")throw new DOMException("The RTCPeerConnection's signalingState is 'closed'.","InvalidStateError");const d=[].slice.call(arguments,1);if(d.length!==1||!d[0].getTracks().find(y=>y===u))throw new DOMException("The adapter.js addTrack polyfill only supports a single  stream which is associated with the specified track.","NotSupportedError");if(this.getSenders().find(y=>y.track===u))throw new DOMException("Track already exists.","InvalidAccessError");this._streams=this._streams||{},this._reverseStreams=this._reverseStreams||{};const g=this._streams[h.id];if(g)g.addTrack(u),Promise.resolve().then(()=>{this.dispatchEvent(new Event("negotiationneeded"))});else{const y=new s.MediaStream([u]);this._streams[h.id]=y,this._reverseStreams[y.id]=h,this.addStream(y)}return this.getSenders().find(y=>y.track===u)};function r(l,u){let h=u.sdp;return Object.keys(l._reverseStreams||[]).forEach(d=>{const f=l._reverseStreams[d],g=l._streams[f.id];h=h.replace(new RegExp(g.id,"g"),f.id)}),new RTCSessionDescription({type:u.type,sdp:h})}function o(l,u){let h=u.sdp;return Object.keys(l._reverseStreams||[]).forEach(d=>{const f=l._reverseStreams[d],g=l._streams[f.id];h=h.replace(new RegExp(f.id,"g"),g.id)}),new RTCSessionDescription({type:u.type,sdp:h})}["createOffer","createAnswer"].forEach(function(l){const u=s.RTCPeerConnection.prototype[l],h={[l](){const d=arguments;return arguments.length&&typeof arguments[0]=="function"?u.apply(this,[g=>{const y=r(this,g);d[0].apply(null,[y])},g=>{d[1]&&d[1].apply(null,g)},arguments[2]]):u.apply(this,arguments).then(g=>r(this,g))}};s.RTCPeerConnection.prototype[l]=h[l]});const a=s.RTCPeerConnection.prototype.setLocalDescription;s.RTCPeerConnection.prototype.setLocalDescription=function(){return!arguments.length||!arguments[0].type?a.apply(this,arguments):(arguments[0]=o(this,arguments[0]),a.apply(this,arguments))};const c=Object.getOwnPropertyDescriptor(s.RTCPeerConnection.prototype,"localDescription");Object.defineProperty(s.RTCPeerConnection.prototype,"localDescription",{get(){const l=c.get.apply(this);return l.type===""?l:r(this,l)}}),s.RTCPeerConnection.prototype.removeTrack=function(u){if(this.signalingState==="closed")throw new DOMException("The RTCPeerConnection's signalingState is 'closed'.","InvalidStateError");if(!u._pc)throw new DOMException("Argument 1 of RTCPeerConnection.removeTrack does not implement interface RTCRtpSender.","TypeError");if(!(u._pc===this))throw new DOMException("Sender was not created by this connection.","InvalidAccessError");this._streams=this._streams||{};let d;Object.keys(this._streams).forEach(f=>{this._streams[f].getTracks().find(y=>u.track===y)&&(d=this._streams[f])}),d&&(d.getTracks().length===1?this.removeStream(this._reverseStreams[d.id]):d.removeTrack(u.track),this.dispatchEvent(new Event("negotiationneeded")))}}function vt(s,e){!s.RTCPeerConnection&&s.webkitRTCPeerConnection&&(s.RTCPeerConnection=s.webkitRTCPeerConnection),s.RTCPeerConnection&&e.version<53&&["setLocalDescription","setRemoteDescription","addIceCandidate"].forEach(function(i){const t=s.RTCPeerConnection.prototype[i],n={[i](){return arguments[0]=new(i==="addIceCandidate"?s.RTCIceCandidate:s.RTCSessionDescription)(arguments[0]),t.apply(this,arguments)}};s.RTCPeerConnection.prototype[i]=n[i]})}function wi(s,e){e.version>102||ge(s,"negotiationneeded",i=>{const t=i.target;if(!((e.version<72||t.getConfiguration&&t.getConfiguration().sdpSemantics==="plan-b")&&t.signalingState!=="stable"))return i})}const Ut=Object.freeze(Object.defineProperty({__proto__:null,fixNegotiationNeeded:wi,shimAddTrackRemoveTrack:Ai,shimAddTrackRemoveTrackWithNative:Bi,shimGetSendersWithDtmf:Li,shimGetUserMedia:Mi,shimMediaStream:Pi,shimOnTrack:ki,shimPeerConnection:vt,shimSenderReceiverGetStats:Di},Symbol.toStringTag,{value:"Module"}));function Ii(s,e){const i=s&&s.navigator;if(!i.mediaDevices)return;const t=s&&s.MediaStreamTrack;if(i.getUserMedia=function(n,r,o){Et("navigator.getUserMedia","navigator.mediaDevices.getUserMedia"),i.mediaDevices.getUserMedia(n).then(r,o)},!(e.version>55&&"autoGainControl"in i.mediaDevices.getSupportedConstraints())){const n=function(o,a,c){a in o&&!(c in o)&&(o[c]=o[a],delete o[a])},r=i.mediaDevices.getUserMedia.bind(i.mediaDevices);if(i.mediaDevices.getUserMedia=function(o){return typeof o=="object"&&typeof o.audio=="object"&&(o=JSON.parse(JSON.stringify(o)),n(o.audio,"autoGainControl","mozAutoGainControl"),n(o.audio,"noiseSuppression","mozNoiseSuppression")),r(o)},t&&t.prototype.getSettings){const o=t.prototype.getSettings;t.prototype.getSettings=function(){const a=o.apply(this,arguments);return n(a,"mozAutoGainControl","autoGainControl"),n(a,"mozNoiseSuppression","noiseSuppression"),a}}if(t&&t.prototype.applyConstraints){const o=t.prototype.applyConstraints;t.prototype.applyConstraints=function(a){return this.kind==="audio"&&typeof a=="object"&&(a=JSON.parse(JSON.stringify(a)),n(a,"autoGainControl","mozAutoGainControl"),n(a,"noiseSuppression","mozNoiseSuppression")),o.apply(this,[a])}}}}function as(s,e){s.navigator.mediaDevices&&(s.navigator.mediaDevices&&"getDisplayMedia"in s.navigator.mediaDevices||(s.navigator.mediaDevices.getDisplayMedia=function(t){if(!(t&&t.video)){const n=new DOMException("getDisplayMedia without video constraints is undefined");return n.name="NotFoundError",n.code=8,Promise.reject(n)}return t.video===!0?t.video={mediaSource:e}:t.video.mediaSource=e,s.navigator.mediaDevices.getUserMedia(t)}))}function Fi(s){typeof s=="object"&&s.RTCTrackEvent&&"receiver"in s.RTCTrackEvent.prototype&&!("transceiver"in s.RTCTrackEvent.prototype)&&Object.defineProperty(s.RTCTrackEvent.prototype,"transceiver",{get(){return{receiver:this.receiver}}})}function bt(s,e){typeof s!="object"||!(s.RTCPeerConnection||s.mozRTCPeerConnection)||(!s.RTCPeerConnection&&s.mozRTCPeerConnection&&(s.RTCPeerConnection=s.mozRTCPeerConnection),e.version<53&&["setLocalDescription","setRemoteDescription","addIceCandidate"].forEach(function(i){const t=s.RTCPeerConnection.prototype[i],n={[i](){return arguments[0]=new(i==="addIceCandidate"?s.RTCIceCandidate:s.RTCSessionDescription)(arguments[0]),t.apply(this,arguments)}};s.RTCPeerConnection.prototype[i]=n[i]}))}function Vi(s,e){if(typeof s!="object"||!(s.RTCPeerConnection||s.mozRTCPeerConnection)||e.version>=151)return;const i={inboundrtp:"inbound-rtp",outboundrtp:"outbound-rtp",candidatepair:"candidate-pair",localcandidate:"local-candidate",remotecandidate:"remote-candidate"},t=s.RTCPeerConnection.prototype.getStats;s.RTCPeerConnection.prototype.getStats=function(){const[r,o,a]=arguments;return this.signalingState==="closed"?Promise.resolve(new Map):t.apply(this,[r||null]).then(c=>{if(e.version<53&&!o)try{c.forEach(l=>{l.type=i[l.type]||l.type})}catch(l){if(l.name!=="TypeError")throw l;c.forEach((u,h)=>{c.set(h,Object.assign({},u,{type:i[u.type]||u.type}))})}return c}).then(o,a)}}function Ui(s){if(!(typeof s=="object"&&s.RTCPeerConnection&&s.RTCRtpSender)||s.RTCRtpSender&&"getStats"in s.RTCRtpSender.prototype)return;const e=s.RTCPeerConnection.prototype.getSenders;e&&(s.RTCPeerConnection.prototype.getSenders=function(){const n=e.apply(this,[]);return n.forEach(r=>r._pc=this),n});const i=s.RTCPeerConnection.prototype.addTrack;i&&(s.RTCPeerConnection.prototype.addTrack=function(){const n=i.apply(this,arguments);return n._pc=this,n}),s.RTCRtpSender.prototype.getStats=function(){return this.track?this._pc.getStats(this.track):Promise.resolve(new Map)}}function Oi(s){if(!(typeof s=="object"&&s.RTCPeerConnection&&s.RTCRtpSender)||s.RTCRtpSender&&"getStats"in s.RTCRtpReceiver.prototype)return;const e=s.RTCPeerConnection.prototype.getReceivers;e&&(s.RTCPeerConnection.prototype.getReceivers=function(){const t=e.apply(this,[]);return t.forEach(n=>n._pc=this),t}),ge(s,"track",i=>(i.receiver._pc=i.srcElement,i)),s.RTCRtpReceiver.prototype.getStats=function(){return this._pc.getStats(this.track)}}function Ni(s){!s.RTCPeerConnection||"removeStream"in s.RTCPeerConnection.prototype||(s.RTCPeerConnection.prototype.removeStream=function(i){Et("removeStream","removeTrack"),this.getSenders().forEach(t=>{t.track&&i.getTracks().includes(t.track)&&this.removeTrack(t)})})}function Hi(s){s.DataChannel&&!s.RTCDataChannel&&(s.RTCDataChannel=s.DataChannel)}function zi(s,e){if(!(typeof s=="object"&&s.RTCPeerConnection)||e.version>=110)return;const i=s.RTCPeerConnection.prototype.addTransceiver;i&&(s.RTCPeerConnection.prototype.addTransceiver=function(){this.setParametersPromises=[];let n=arguments[1]&&arguments[1].sendEncodings;n===void 0&&(n=[]),n=[...n];const r=n.length>0;r&&n.forEach(a=>{if("rid"in a&&!/^[a-z0-9]{0,16}$/i.test(a.rid))throw new TypeError("Invalid RID value provided.");if("scaleResolutionDownBy"in a&&!(parseFloat(a.scaleResolutionDownBy)>=1))throw new RangeError("scale_resolution_down_by must be >= 1.0");if("maxFramerate"in a&&!(parseFloat(a.maxFramerate)>=0))throw new RangeError("max_framerate must be >= 0.0")});const o=i.apply(this,arguments);if(r){const{sender:a}=o,c=a.getParameters();(!("encodings"in c)||c.encodings.length===1&&Object.keys(c.encodings[0]).length===0)&&(c.encodings=n,a.sendEncodings=n,this.setParametersPromises.push(a.setParameters(c).then(()=>{delete a.sendEncodings}).catch(()=>{delete a.sendEncodings})))}return o})}function qi(s,e){if(!(typeof s=="object"&&s.RTCRtpSender)||e.version>=110)return;const i=s.RTCRtpSender.prototype.getParameters;i&&(s.RTCRtpSender.prototype.getParameters=function(){const n=i.apply(this,arguments);return"encodings"in n||(n.encodings=[].concat(this.sendEncodings||[{}])),n})}function $i(s,e){if(!(typeof s=="object"&&s.RTCPeerConnection)||e.version>=110)return;const i=s.RTCPeerConnection.prototype.createOffer;s.RTCPeerConnection.prototype.createOffer=function(){return this.setParametersPromises&&this.setParametersPromises.length?Promise.all(this.setParametersPromises).then(()=>i.apply(this,arguments)).finally(()=>{this.setParametersPromises=[]}):i.apply(this,arguments)}}function Gi(s,e){if(!(typeof s=="object"&&s.RTCPeerConnection)||e.version>=110)return;const i=s.RTCPeerConnection.prototype.createAnswer;s.RTCPeerConnection.prototype.createAnswer=function(){return this.setParametersPromises&&this.setParametersPromises.length?Promise.all(this.setParametersPromises).then(()=>i.apply(this,arguments)).finally(()=>{this.setParametersPromises=[]}):i.apply(this,arguments)}}const Ot=Object.freeze(Object.defineProperty({__proto__:null,shimAddTransceiver:zi,shimCreateAnswer:Gi,shimCreateOffer:$i,shimGetDisplayMedia:as,shimGetParameters:qi,shimGetStats:Vi,shimGetUserMedia:Ii,shimOnTrack:Fi,shimPeerConnection:bt,shimRTCDataChannel:Hi,shimReceiverGetStats:Oi,shimRemoveStream:Ni,shimSenderGetStats:Ui},Symbol.toStringTag,{value:"Module"}));function ji(s){if(!(typeof s!="object"||!s.RTCPeerConnection)){if("getLocalStreams"in s.RTCPeerConnection.prototype||(s.RTCPeerConnection.prototype.getLocalStreams=function(){return this._localStreams||(this._localStreams=[]),this._localStreams}),!("addStream"in s.RTCPeerConnection.prototype)){const e=s.RTCPeerConnection.prototype.addTrack;s.RTCPeerConnection.prototype.addStream=function(t){this._localStreams||(this._localStreams=[]),this._localStreams.includes(t)||this._localStreams.push(t),t.getAudioTracks().forEach(n=>e.call(this,n,t)),t.getVideoTracks().forEach(n=>e.call(this,n,t))},s.RTCPeerConnection.prototype.addTrack=function(t,...n){return n&&n.forEach(r=>{this._localStreams?this._localStreams.includes(r)||this._localStreams.push(r):this._localStreams=[r]}),e.apply(this,arguments)}}"removeStream"in s.RTCPeerConnection.prototype||(s.RTCPeerConnection.prototype.removeStream=function(i){this._localStreams||(this._localStreams=[]);const t=this._localStreams.indexOf(i);if(t===-1)return;this._localStreams.splice(t,1);const n=i.getTracks();this.getSenders().forEach(r=>{n.includes(r.track)&&this.removeTrack(r)})})}}function Wi(s){if(!(typeof s!="object"||!s.RTCPeerConnection)&&("getRemoteStreams"in s.RTCPeerConnection.prototype||(s.RTCPeerConnection.prototype.getRemoteStreams=function(){return this._remoteStreams?this._remoteStreams:[]}),!("onaddstream"in s.RTCPeerConnection.prototype))){Object.defineProperty(s.RTCPeerConnection.prototype,"onaddstream",{get(){return this._onaddstream},set(i){this._onaddstream&&(this.removeEventListener("addstream",this._onaddstream),this.removeEventListener("track",this._onaddstreampoly)),this.addEventListener("addstream",this._onaddstream=i),this.addEventListener("track",this._onaddstreampoly=t=>{t.streams.forEach(n=>{if(this._remoteStreams||(this._remoteStreams=[]),this._remoteStreams.includes(n))return;this._remoteStreams.push(n);const r=new Event("addstream");r.stream=n,this.dispatchEvent(r)})})}});const e=s.RTCPeerConnection.prototype.setRemoteDescription;s.RTCPeerConnection.prototype.setRemoteDescription=function(){const t=this;return this._onaddstreampoly||this.addEventListener("track",this._onaddstreampoly=function(n){n.streams.forEach(r=>{if(t._remoteStreams||(t._remoteStreams=[]),t._remoteStreams.indexOf(r)>=0)return;t._remoteStreams.push(r);const o=new Event("addstream");o.stream=r,t.dispatchEvent(o)})}),e.apply(t,arguments)}}}function Ki(s){if(typeof s!="object"||!s.RTCPeerConnection)return;const e=s.RTCPeerConnection.prototype,i=e.createOffer,t=e.createAnswer,n=e.setLocalDescription,r=e.setRemoteDescription,o=e.addIceCandidate;e.createOffer=function(l,u){const h=arguments.length>=2?arguments[2]:arguments[0],d=i.apply(this,[h]);return u?(d.then(l,u),Promise.resolve()):d},e.createAnswer=function(l,u){const h=arguments.length>=2?arguments[2]:arguments[0],d=t.apply(this,[h]);return u?(d.then(l,u),Promise.resolve()):d};let a=function(c,l,u){const h=n.apply(this,[c]);return u?(h.then(l,u),Promise.resolve()):h};e.setLocalDescription=a,a=function(c,l,u){const h=r.apply(this,[c]);return u?(h.then(l,u),Promise.resolve()):h},e.setRemoteDescription=a,a=function(c,l,u){const h=o.apply(this,[c]);return u?(h.then(l,u),Promise.resolve()):h},e.addIceCandidate=a}function Xi(s){const e=s&&s.navigator;if(e.mediaDevices&&e.mediaDevices.getUserMedia){const i=e.mediaDevices,t=i.getUserMedia.bind(i);e.mediaDevices.getUserMedia=n=>t(Yi(n))}!e.getUserMedia&&e.mediaDevices&&e.mediaDevices.getUserMedia&&(e.getUserMedia=function(t,n,r){e.mediaDevices.getUserMedia(t).then(n,r)}.bind(e))}function Yi(s){return s&&s.video!==void 0?Object.assign({},s,{video:Ei(s.video)}):s}function Ji(s){if(!s.RTCPeerConnection)return;const e=s.RTCPeerConnection;s.RTCPeerConnection=function(t,n){if(t&&t.iceServers){const r=[];for(let o=0;o<t.iceServers.length;o++){let a=t.iceServers[o];a.urls===void 0&&a.url?(Et("RTCIceServer.url","RTCIceServer.urls"),a=JSON.parse(JSON.stringify(a)),a.urls=a.url,delete a.url,r.push(a)):r.push(t.iceServers[o])}t.iceServers=r}return new e(t,n)},s.RTCPeerConnection.prototype=e.prototype,"generateCertificate"in e&&Object.defineProperty(s.RTCPeerConnection,"generateCertificate",{get(){return e.generateCertificate}})}function Qi(s){typeof s=="object"&&s.RTCTrackEvent&&"receiver"in s.RTCTrackEvent.prototype&&!("transceiver"in s.RTCTrackEvent.prototype)&&Object.defineProperty(s.RTCTrackEvent.prototype,"transceiver",{get(){return{receiver:this.receiver}}})}function Zi(s){const e=s.RTCPeerConnection.prototype.createOffer;s.RTCPeerConnection.prototype.createOffer=function(t){if(t){typeof t.offerToReceiveAudio<"u"&&(t.offerToReceiveAudio=!!t.offerToReceiveAudio);const n=this.getTransceivers().find(o=>o.receiver.track.kind==="audio");t.offerToReceiveAudio===!1&&n?n.direction==="sendrecv"?n.setDirection?n.setDirection("sendonly"):n.direction="sendonly":n.direction==="recvonly"&&(n.setDirection?n.setDirection("inactive"):n.direction="inactive"):t.offerToReceiveAudio===!0&&!n&&this.addTransceiver("audio",{direction:"recvonly"}),typeof t.offerToReceiveVideo<"u"&&(t.offerToReceiveVideo=!!t.offerToReceiveVideo);const r=this.getTransceivers().find(o=>o.receiver.track.kind==="video");t.offerToReceiveVideo===!1&&r?r.direction==="sendrecv"?r.setDirection?r.setDirection("sendonly"):r.direction="sendonly":r.direction==="recvonly"&&(r.setDirection?r.setDirection("inactive"):r.direction="inactive"):t.offerToReceiveVideo===!0&&!r&&this.addTransceiver("video",{direction:"recvonly"})}return e.apply(this,arguments)}}function en(s){typeof s!="object"||s.AudioContext||(s.AudioContext=s.webkitAudioContext)}const Nt=Object.freeze(Object.defineProperty({__proto__:null,shimAudioContext:en,shimCallbacksAPI:Ki,shimConstraints:Yi,shimCreateOfferLegacy:Zi,shimGetUserMedia:Xi,shimLocalStreamsAPI:ji,shimRTCIceServerUrls:Ji,shimRemoteStreamsAPI:Wi,shimTrackEventTransceiver:Qi},Symbol.toStringTag,{value:"Module"}));function tn(s){return s&&s.__esModule&&Object.prototype.hasOwnProperty.call(s,"default")?s.default:s}var qe={exports:{}},Ht;function cs(){return Ht||(Ht=1,(function(s){const e={};e.generateIdentifier=function(){return Math.random().toString(36).substring(2,12)},e.localCName=e.generateIdentifier(),e.splitLines=function(i){return i.trim().split(`
`).map(t=>t.trim())},e.splitSections=function(i){return i.split(`
m=`).map((n,r)=>(r>0?"m="+n:n).trim()+`\r
`)},e.getDescription=function(i){const t=e.splitSections(i);return t&&t[0]},e.getMediaSections=function(i){const t=e.splitSections(i);return t.shift(),t},e.matchPrefix=function(i,t){return e.splitLines(i).filter(n=>n.indexOf(t)===0)},e.parseCandidate=function(i){let t;i.indexOf("a=candidate:")===0?t=i.substring(12).split(" "):t=i.substring(10).split(" ");const n={foundation:t[0],component:{1:"rtp",2:"rtcp"}[t[1]]||t[1],protocol:t[2].toLowerCase(),priority:parseInt(t[3],10),ip:t[4],address:t[4],port:parseInt(t[5],10),type:t[7]};for(let r=8;r<t.length;r+=2)switch(t[r]){case"raddr":n.relatedAddress=t[r+1];break;case"rport":n.relatedPort=parseInt(t[r+1],10);break;case"tcptype":n.tcpType=t[r+1];break;case"ufrag":n.ufrag=t[r+1],n.usernameFragment=t[r+1];break;default:n[t[r]]===void 0&&(n[t[r]]=t[r+1]);break}return n},e.writeCandidate=function(i){const t=[];t.push(i.foundation);const n=i.component;n==="rtp"?t.push(1):n==="rtcp"?t.push(2):t.push(n),t.push(i.protocol.toUpperCase()),t.push(i.priority),t.push(i.address||i.ip),t.push(i.port);const r=i.type;return t.push("typ"),t.push(r),r!=="host"&&i.relatedAddress&&i.relatedPort!==void 0&&(t.push("raddr"),t.push(i.relatedAddress),t.push("rport"),t.push(i.relatedPort)),i.tcpType&&i.protocol.toLowerCase()==="tcp"&&(t.push("tcptype"),t.push(i.tcpType)),(i.usernameFragment||i.ufrag)&&(t.push("ufrag"),t.push(i.usernameFragment||i.ufrag)),"candidate:"+t.join(" ")},e.parseIceOptions=function(i){return i.substring(14).split(" ")},e.parseRtpMap=function(i){let t=i.substring(9).split(" ");const n={payloadType:parseInt(t.shift(),10)};return t=t[0].split("/"),n.name=t[0],n.clockRate=parseInt(t[1],10),n.channels=t.length===3?parseInt(t[2],10):1,n.numChannels=n.channels,n},e.writeRtpMap=function(i){let t=i.payloadType;i.preferredPayloadType!==void 0&&(t=i.preferredPayloadType);const n=i.channels||i.numChannels||1;return"a=rtpmap:"+t+" "+i.name+"/"+i.clockRate+(n!==1?"/"+n:"")+`\r
`},e.parseExtmap=function(i){const t=i.substring(9).split(" ");return{id:parseInt(t[0],10),direction:t[0].indexOf("/")>0?t[0].split("/")[1]:"sendrecv",uri:t[1],attributes:t.slice(2).join(" ")}},e.writeExtmap=function(i){return"a=extmap:"+(i.id||i.preferredId)+(i.direction&&i.direction!=="sendrecv"?"/"+i.direction:"")+" "+i.uri+(i.attributes?" "+i.attributes:"")+`\r
`},e.parseFmtp=function(i){const t={},n=i.substring(i.indexOf(" ")+1).split(";");for(let r=0;r<n.length;r++){const[o,...a]=n[r].trim().split("=");t[o.trim()]=a.length?a.join("="):void 0}return t},e.writeFmtp=function(i){let t="",n=i.payloadType;if(i.preferredPayloadType!==void 0&&(n=i.preferredPayloadType),i.parameters&&Object.keys(i.parameters).length){const r=[];Object.keys(i.parameters).forEach(o=>{i.parameters[o]!==void 0?r.push(o+"="+i.parameters[o]):r.push(o)}),t+="a=fmtp:"+n+" "+r.join(";")+`\r
`}return t},e.parseRtcpFb=function(i){const t=i.substring(i.indexOf(" ")+1).split(" ");return{type:t.shift(),parameter:t.join(" ")}},e.writeRtcpFb=function(i){let t="",n=i.payloadType;return i.preferredPayloadType!==void 0&&(n=i.preferredPayloadType),i.rtcpFeedback&&i.rtcpFeedback.length&&i.rtcpFeedback.forEach(r=>{t+="a=rtcp-fb:"+n+" "+r.type+(r.parameter&&r.parameter.length?" "+r.parameter:"")+`\r
`}),t},e.parseSsrcMedia=function(i){const t=i.indexOf(" "),n={ssrc:parseInt(i.substring(7,t),10)},r=i.indexOf(":",t);return r>-1?(n.attribute=i.substring(t+1,r),n.value=i.substring(r+1)):n.attribute=i.substring(t+1),n},e.parseSsrcGroup=function(i){const t=i.substring(13).split(" ");return{semantics:t.shift(),ssrcs:t.map(n=>parseInt(n,10))}},e.getMid=function(i){const t=e.matchPrefix(i,"a=mid:")[0];if(t)return t.substring(6)},e.parseFingerprint=function(i){const t=i.substring(14).split(" ");return{algorithm:t[0].toLowerCase(),value:t[1].toUpperCase()}},e.getDtlsParameters=function(i,t){return{role:"auto",fingerprints:e.matchPrefix(i+t,"a=fingerprint:").map(e.parseFingerprint)}},e.writeDtlsParameters=function(i,t){let n="a=setup:"+t+`\r
`;return i.fingerprints.forEach(r=>{n+="a=fingerprint:"+r.algorithm+" "+r.value+`\r
`}),n},e.parseCryptoLine=function(i){const t=i.substring(9).split(" ");return{tag:parseInt(t[0],10),cryptoSuite:t[1],keyParams:t[2],sessionParams:t.slice(3)}},e.writeCryptoLine=function(i){return"a=crypto:"+i.tag+" "+i.cryptoSuite+" "+(typeof i.keyParams=="object"?e.writeCryptoKeyParams(i.keyParams):i.keyParams)+(i.sessionParams?" "+i.sessionParams.join(" "):"")+`\r
`},e.parseCryptoKeyParams=function(i){if(i.indexOf("inline:")!==0)return null;const t=i.substring(7).split("|");return{keyMethod:"inline",keySalt:t[0],lifeTime:t[1],mkiValue:t[2]?t[2].split(":")[0]:void 0,mkiLength:t[2]?t[2].split(":")[1]:void 0}},e.writeCryptoKeyParams=function(i){return i.keyMethod+":"+i.keySalt+(i.lifeTime?"|"+i.lifeTime:"")+(i.mkiValue&&i.mkiLength?"|"+i.mkiValue+":"+i.mkiLength:"")},e.getCryptoParameters=function(i,t){return e.matchPrefix(i+t,"a=crypto:").map(e.parseCryptoLine)},e.getIceParameters=function(i,t){const n=e.matchPrefix(i+t,"a=ice-ufrag:")[0],r=e.matchPrefix(i+t,"a=ice-pwd:")[0];return n&&r?{usernameFragment:n.substring(12),password:r.substring(10)}:null},e.writeIceParameters=function(i){let t="a=ice-ufrag:"+i.usernameFragment+`\r
a=ice-pwd:`+i.password+`\r
`;return i.iceLite&&(t+=`a=ice-lite\r
`),t},e.parseRtpParameters=function(i){const t={codecs:[],headerExtensions:[],fecMechanisms:[],rtcp:[]},r=e.splitLines(i)[0].split(" ");t.profile=r[2];for(let a=3;a<r.length;a++){const c=r[a],l=e.matchPrefix(i,"a=rtpmap:"+c+" ")[0];if(l){const u=e.parseRtpMap(l),h=e.matchPrefix(i,"a=fmtp:"+c+" ");switch(u.parameters=h.length?e.parseFmtp(h[0]):{},u.rtcpFeedback=e.matchPrefix(i,"a=rtcp-fb:"+c+" ").map(e.parseRtcpFb),t.codecs.push(u),u.name.toUpperCase()){case"RED":case"ULPFEC":t.fecMechanisms.push(u.name.toUpperCase());break}}}e.matchPrefix(i,"a=extmap:").forEach(a=>{t.headerExtensions.push(e.parseExtmap(a))});const o=e.matchPrefix(i,"a=rtcp-fb:* ").map(e.parseRtcpFb);return t.codecs.forEach(a=>{o.forEach(c=>{a.rtcpFeedback.find(u=>u.type===c.type&&u.parameter===c.parameter)||a.rtcpFeedback.push(c)})}),t},e.writeRtpDescription=function(i,t){let n="";n+="m="+i+" ",n+=t.codecs.length>0?"9":"0",n+=" "+(t.profile||"UDP/TLS/RTP/SAVPF")+" ",n+=t.codecs.map(o=>o.preferredPayloadType!==void 0?o.preferredPayloadType:o.payloadType).join(" ")+`\r
`,n+=`c=IN IP4 0.0.0.0\r
`,n+=`a=rtcp:9 IN IP4 0.0.0.0\r
`,t.codecs.forEach(o=>{n+=e.writeRtpMap(o),n+=e.writeFmtp(o),n+=e.writeRtcpFb(o)});let r=0;return t.codecs.forEach(o=>{o.maxptime>r&&(r=o.maxptime)}),r>0&&(n+="a=maxptime:"+r+`\r
`),t.headerExtensions&&t.headerExtensions.forEach(o=>{n+=e.writeExtmap(o)}),n},e.parseRtpEncodingParameters=function(i){const t=[],n=e.parseRtpParameters(i),r=n.fecMechanisms.indexOf("RED")!==-1,o=n.fecMechanisms.indexOf("ULPFEC")!==-1,a=e.matchPrefix(i,"a=ssrc:").map(d=>e.parseSsrcMedia(d)).filter(d=>d.attribute==="cname"),c=a.length>0&&a[0].ssrc;let l;const u=e.matchPrefix(i,"a=ssrc-group:FID").map(d=>d.substring(17).split(" ").map(g=>parseInt(g,10)));u.length>0&&u[0].length>1&&u[0][0]===c&&(l=u[0][1]),n.codecs.forEach(d=>{if(d.name.toUpperCase()==="RTX"&&d.parameters.apt){let f={ssrc:c,codecPayloadType:parseInt(d.parameters.apt,10)};c&&l&&(f.rtx={ssrc:l}),t.push(f),r&&(f=JSON.parse(JSON.stringify(f)),f.fec={ssrc:c,mechanism:o?"red+ulpfec":"red"},t.push(f))}}),t.length===0&&c&&t.push({ssrc:c});let h=e.matchPrefix(i,"b=");return h.length&&(h[0].indexOf("b=TIAS:")===0?h=parseInt(h[0].substring(7),10):h[0].indexOf("b=AS:")===0?h=parseInt(h[0].substring(5),10)*1e3*.95-2e3*8:h=void 0,t.forEach(d=>{d.maxBitrate=h})),t},e.parseRtcpParameters=function(i){const t={},n=e.matchPrefix(i,"a=ssrc:").map(a=>e.parseSsrcMedia(a)).filter(a=>a.attribute==="cname")[0];n&&(t.cname=n.value,t.ssrc=n.ssrc);const r=e.matchPrefix(i,"a=rtcp-rsize");t.reducedSize=r.length>0,t.compound=r.length===0;const o=e.matchPrefix(i,"a=rtcp-mux");return t.mux=o.length>0,t},e.writeRtcpParameters=function(i){let t="";return i.reducedSize&&(t+=`a=rtcp-rsize\r
`),i.mux&&(t+=`a=rtcp-mux\r
`),i.ssrc!==void 0&&i.cname&&(t+="a=ssrc:"+i.ssrc+" cname:"+i.cname+`\r
`),t},e.parseMsid=function(i){let t;const n=e.matchPrefix(i,"a=msid:");if(n.length===1)return t=n[0].substring(7).split(" "),{stream:t[0],track:t[1]};const r=e.matchPrefix(i,"a=ssrc:").map(o=>e.parseSsrcMedia(o)).filter(o=>o.attribute==="msid");if(r.length>0)return t=r[0].value.split(" "),{stream:t[0],track:t[1]}},e.parseSctpDescription=function(i){const t=e.parseMLine(i),n=e.matchPrefix(i,"a=max-message-size:");let r;n.length>0&&(r=parseInt(n[0].substring(19),10)),isNaN(r)&&(r=65536);const o=e.matchPrefix(i,"a=sctp-port:");if(o.length>0)return{port:parseInt(o[0].substring(12),10),protocol:t.fmt,maxMessageSize:r};const a=e.matchPrefix(i,"a=sctpmap:");if(a.length>0){const c=a[0].substring(10).split(" ");return{port:parseInt(c[0],10),protocol:c[1],maxMessageSize:r}}},e.writeSctpDescription=function(i,t){let n=[];return i.protocol!=="DTLS/SCTP"?n=["m="+i.kind+" 9 "+i.protocol+" "+t.protocol+`\r
`,`c=IN IP4 0.0.0.0\r
`,"a=sctp-port:"+t.port+`\r
`]:n=["m="+i.kind+" 9 "+i.protocol+" "+t.port+`\r
`,`c=IN IP4 0.0.0.0\r
`,"a=sctpmap:"+t.port+" "+t.protocol+` 65535\r
`],t.maxMessageSize!==void 0&&n.push("a=max-message-size:"+t.maxMessageSize+`\r
`),n.join("")},e.generateSessionId=function(){return Math.random().toString().substr(2,22)},e.writeSessionBoilerplate=function(i,t,n){let r;const o=t!==void 0?t:2;return i?r=i:r=e.generateSessionId(),`v=0\r
o=`+(n||"thisisadapterortc")+" "+r+" "+o+` IN IP4 127.0.0.1\r
s=-\r
t=0 0\r
`},e.getDirection=function(i,t){const n=e.splitLines(i);for(let r=0;r<n.length;r++)switch(n[r]){case"a=sendrecv":case"a=sendonly":case"a=recvonly":case"a=inactive":return n[r].substring(2)}return t?e.getDirection(t):"sendrecv"},e.getKind=function(i){return e.splitLines(i)[0].split(" ")[0].substring(2)},e.isRejected=function(i){return i.split(" ",2)[1]==="0"},e.parseMLine=function(i){const n=e.splitLines(i)[0].substring(2).split(" ");return{kind:n[0],port:parseInt(n[1],10),protocol:n[2],fmt:n.slice(3).join(" ")}},e.parseOLine=function(i){const n=e.matchPrefix(i,"o=")[0].substring(2).split(" ");return{username:n[0],sessionId:n[1],sessionVersion:parseInt(n[2],10),netType:n[3],addressType:n[4],address:n[5]}},e.isValidSDP=function(i){if(typeof i!="string"||i.length===0)return!1;const t=e.splitLines(i);for(let n=0;n<t.length;n++)if(t[n].length<2||t[n].charAt(1)!=="=")return!1;return!0},s.exports=e})(qe)),qe.exports}var nn=cs();const Te=tn(nn),ls=mn({__proto__:null,default:Te},[nn]);function Le(s){if(!s.RTCIceCandidate||s.RTCIceCandidate&&"foundation"in s.RTCIceCandidate.prototype)return;const e=s.RTCIceCandidate;s.RTCIceCandidate=function(t){if(typeof t=="object"&&t.candidate&&t.candidate.indexOf("a=")===0&&(t=JSON.parse(JSON.stringify(t)),t.candidate=t.candidate.substring(2)),t.candidate&&t.candidate.length){const n=new e(t),r=Te.parseCandidate(t.candidate);for(const o in r)o in n||Object.defineProperty(n,o,{value:r[o]});return n.toJSON=function(){return{candidate:n.candidate,sdpMid:n.sdpMid,sdpMLineIndex:n.sdpMLineIndex,usernameFragment:n.usernameFragment}},n}return new e(t)},s.RTCIceCandidate.prototype=e.prototype,ge(s,"icecandidate",i=>(i.candidate&&Object.defineProperty(i,"candidate",{value:new s.RTCIceCandidate(i.candidate),writable:"false"}),i))}function yt(s){!s.RTCIceCandidate||s.RTCIceCandidate&&"relayProtocol"in s.RTCIceCandidate.prototype||ge(s,"icecandidate",e=>{if(e.candidate){const i=Te.parseCandidate(e.candidate.candidate);i.type==="relay"&&(e.candidate.relayProtocol={0:"tls",1:"tcp",2:"udp"}[i.priority>>24])}return e})}function De(s,e){if(!s.RTCPeerConnection||e.browser==="chrome"&&e.version>102||e.browser==="firefox"&&e.version>=113)return;"sctp"in s.RTCPeerConnection.prototype||Object.defineProperty(s.RTCPeerConnection.prototype,"sctp",{get(){return typeof this._sctp>"u"?null:this._sctp}});const i=function(a){if(!a||!a.sdp)return!1;const c=Te.splitSections(a.sdp);return c.shift(),c.some(l=>{const u=Te.parseMLine(l);return u&&u.kind==="application"&&u.protocol.indexOf("SCTP")!==-1})},t=function(a){const c=a.sdp.match(/mozilla...THIS_IS_SDPARTA-(\d+)/);if(c===null||c.length<2)return-1;const l=parseInt(c[1],10);return l!==l?-1:l},n=function(a){let c=65536;return e.browser==="firefox"&&(e.version<57?a===-1?c=16384:c=2147483637:e.version<60?c=e.version===57?65535:65536:c=2147483637),c},r=function(a,c){let l=65536;e.browser==="firefox"&&e.version===57&&(l=65535);const u=Te.matchPrefix(a.sdp,"a=max-message-size:");return u.length>0?l=parseInt(u[0].substring(19),10):e.browser==="firefox"&&c!==-1&&(l=2147483637),l},o=s.RTCPeerConnection.prototype.setRemoteDescription;s.RTCPeerConnection.prototype.setRemoteDescription=function(){if(this._sctp=null,e.browser==="chrome"&&e.version>=76){const{sdpSemantics:c}=this.getConfiguration();c==="plan-b"&&Object.defineProperty(this,"sctp",{get(){return typeof this._sctp>"u"?null:this._sctp},enumerable:!0,configurable:!0})}if(i(arguments[0])){const c=t(arguments[0]),l=n(c),u=r(arguments[0],c);let h;l===0&&u===0?h=Number.POSITIVE_INFINITY:l===0||u===0?h=Math.max(l,u):h=Math.min(l,u);const d={};Object.defineProperty(d,"maxMessageSize",{get(){return h}}),this._sctp=d}return o.apply(this,arguments)}}function Be(s,e){if(!(s.RTCPeerConnection&&"createDataChannel"in s.RTCPeerConnection.prototype)||e.browser==="chrome"&&e.version>=149||e.browser==="firefox"&&e.version>60)return;function i(n,r){const o=n.send;n.send=function(){const c=arguments[0],l=c.length||c.size||c.byteLength;if(n.readyState==="open"&&r.sctp&&l>r.sctp.maxMessageSize)throw new TypeError("Message too large (can send a maximum of "+r.sctp.maxMessageSize+" bytes)");return o.apply(n,arguments)}}const t=s.RTCPeerConnection.prototype.createDataChannel;s.RTCPeerConnection.prototype.createDataChannel=function(){const r=t.apply(this,arguments);return i(r,this),r},ge(s,"datachannel",n=>(i(n.channel,n.target),n))}function xt(s){if(!s.RTCPeerConnection||"connectionState"in s.RTCPeerConnection.prototype)return;const e=s.RTCPeerConnection.prototype;Object.defineProperty(e,"connectionState",{get(){return{completed:"connected",checking:"connecting"}[this.iceConnectionState]||this.iceConnectionState},enumerable:!0,configurable:!0}),Object.defineProperty(e,"onconnectionstatechange",{get(){return this._onconnectionstatechange||null},set(i){this._onconnectionstatechange&&(this.removeEventListener("connectionstatechange",this._onconnectionstatechange),delete this._onconnectionstatechange),i&&this.addEventListener("connectionstatechange",this._onconnectionstatechange=i)},enumerable:!0,configurable:!0}),["setLocalDescription","setRemoteDescription"].forEach(i=>{const t=e[i];e[i]=function(){return this._connectionstatechangepoly||(this._connectionstatechangepoly=n=>{const r=n.target;if(r._lastConnectionState!==r.connectionState){r._lastConnectionState=r.connectionState;const o=new Event("connectionstatechange",n);r.dispatchEvent(o)}return n},this.addEventListener("iceconnectionstatechange",this._connectionstatechangepoly)),t.apply(this,arguments)}})}function St(s,e){if(!s.RTCPeerConnection||e.browser==="chrome"&&e.version>=71||e.browser==="safari"&&e._safariVersion>=13.1)return;const i=s.RTCPeerConnection.prototype.setRemoteDescription;s.RTCPeerConnection.prototype.setRemoteDescription=function(n){if(n&&n.sdp&&n.sdp.indexOf(`
a=extmap-allow-mixed`)!==-1){const r=n.sdp.split(`
`).filter(o=>o.trim()!=="a=extmap-allow-mixed").join(`
`);s.RTCSessionDescription&&n instanceof s.RTCSessionDescription?arguments[0]=new s.RTCSessionDescription({type:n.type,sdp:r}):n.sdp=r}return i.apply(this,arguments)}}function Ae(s,e){if(!(s.RTCPeerConnection&&s.RTCPeerConnection.prototype))return;const i=s.RTCPeerConnection.prototype.addIceCandidate;!i||i.length===0||(s.RTCPeerConnection.prototype.addIceCandidate=function(){return arguments[0]?(e.browser==="chrome"&&e.version<78||e.browser==="firefox"&&e.version<68||e.browser==="safari")&&arguments[0]&&arguments[0].candidate===""?Promise.resolve():i.apply(this,arguments):(arguments[1]&&arguments[1].apply(null),Promise.resolve())})}function we(s,e){if(!(s.RTCPeerConnection&&s.RTCPeerConnection.prototype))return;const i=s.RTCPeerConnection.prototype.setLocalDescription;!i||i.length===0||(s.RTCPeerConnection.prototype.setLocalDescription=function(){let n=arguments[0]||{};if(typeof n!="object"||n.type&&n.sdp)return i.apply(this,arguments);if(n={type:n.type,sdp:n.sdp},!n.type)switch(this.signalingState){case"stable":case"have-local-offer":case"have-remote-pranswer":n.type="offer";break;default:n.type="answer";break}return n.sdp||n.type!=="offer"&&n.type!=="answer"?i.apply(this,[n]):(n.type==="offer"?this.createOffer:this.createAnswer).apply(this).then(o=>i.apply(this,[o]))})}const us=Object.freeze(Object.defineProperty({__proto__:null,removeExtmapAllowMixed:St,shimAddIceCandidateNullOrEmpty:Ae,shimConnectionState:xt,shimMaxMessageSize:De,shimParameterlessSetLocalDescription:we,shimRTCIceCandidate:Le,shimRTCIceCandidateRelayProtocol:yt,shimSendThrowTypeError:Be},Symbol.toStringTag,{value:"Module"}));function hs({window:s}={},e={shimChrome:!0,shimFirefox:!0,shimSafari:!0}){const i=Rt,t=os(s),n={browserDetails:t,commonShim:us,extractVersion:Me,disableLog:ss,disableWarnings:rs,sdp:ls};switch(t.browser){case"chrome":if(!Ut||!vt||!e.shimChrome)return i("Chrome shim is not included in this adapter release."),n;if(t.version===null)return i("Chrome shim can not determine version, not shimming."),n;i("adapter.js shimming chrome."),n.browserShim=Ut,Ae(s,t),we(s),Mi(s,t),Pi(s),vt(s,t),ki(s,t),Ai(s,t),Li(s),Di(s,t),wi(s,t),Le(s),yt(s),xt(s),De(s,t),Be(s,t),St(s,t);break;case"firefox":if(!Ot||!bt||!e.shimFirefox)return i("Firefox shim is not included in this adapter release."),n;i("adapter.js shimming firefox."),n.browserShim=Ot,Ae(s,t),we(s),Ii(s,t),bt(s,t),Vi(s,t),Fi(s),Ni(s),Ui(s),Oi(s),Hi(s),zi(s,t),qi(s,t),$i(s,t),Gi(s,t),Le(s),xt(s),De(s,t),Be(s,t);break;case"safari":if(!Nt||!e.shimSafari)return i("Safari shim is not included in this adapter release."),n;i("adapter.js shimming safari."),n.browserShim=Nt,Ae(s,t),we(s),Ji(s),Zi(s),Ki(s),ji(s),Wi(s),Qi(s),Xi(s),en(s),Le(s),yt(s),De(s,t),Be(s,t),St(s,t);break;default:i("Unsupported browser!");break}return n}const zt=hs({window:typeof window>"u"?void 0:window});function ve(s,e,i,t){Object.defineProperty(s,e,{get:i,set:t,enumerable:!0,configurable:!0})}class sn{constructor(){this.chunkedMTU=16300,this._dataCount=1,this.chunk=e=>{const i=[],t=e.byteLength,n=Math.ceil(t/this.chunkedMTU);let r=0,o=0;for(;o<t;){const a=Math.min(t,o+this.chunkedMTU),c=e.slice(o,a),l={__peerData:this._dataCount,n:r,data:c,total:n};i.push(l),o=a,r++}return this._dataCount++,i}}}function ds(s){let e=0;for(const n of s)e+=n.byteLength;const i=new Uint8Array(e);let t=0;for(const n of s)i.set(n,t),t+=n.byteLength;return i}const $e=zt.default||zt,Re=new class{isWebRTCSupported(){return typeof RTCPeerConnection<"u"}isBrowserSupported(){const s=this.getBrowser(),e=this.getVersion();return this.supportedBrowsers.includes(s)?s==="chrome"?e>=this.minChromeVersion:s==="firefox"?e>=this.minFirefoxVersion:s==="safari"?!this.isIOS&&e>=this.minSafariVersion:!1:!1}getBrowser(){return $e.browserDetails.browser}getVersion(){return $e.browserDetails.version||0}isUnifiedPlanSupported(){const s=this.getBrowser(),e=$e.browserDetails.version||0;if(s==="chrome"&&e<this.minChromeVersion)return!1;if(s==="firefox"&&e>=this.minFirefoxVersion)return!0;if(!window.RTCRtpTransceiver||!("currentDirection"in RTCRtpTransceiver.prototype))return!1;let i,t=!1;try{i=new RTCPeerConnection,i.addTransceiver("audio"),t=!0}catch{}finally{i&&i.close()}return t}toString(){return`Supports:
    browser:${this.getBrowser()}
    version:${this.getVersion()}
    isIOS:${this.isIOS}
    isWebRTCSupported:${this.isWebRTCSupported()}
    isBrowserSupported:${this.isBrowserSupported()}
    isUnifiedPlanSupported:${this.isUnifiedPlanSupported()}`}constructor(){this.isIOS=typeof navigator<"u"?["iPad","iPhone","iPod"].includes(navigator.platform):!1,this.supportedBrowsers=["firefox","chrome","safari"],this.minFirefoxVersion=59,this.minChromeVersion=72,this.minSafariVersion=605}},fs=s=>!s||/^[A-Za-z0-9]+(?:[ _-][A-Za-z0-9]+)*$/.test(s),rn=()=>Math.random().toString(36).slice(2),qt={iceServers:[{urls:"stun:stun.l.google.com:19302"},{urls:["turn:eu-0.turn.peerjs.com:3478","turn:us-0.turn.peerjs.com:3478"],username:"peerjs",credential:"peerjsp"}],sdpSemantics:"unified-plan"};class ps extends sn{noop(){}blobToArrayBuffer(e,i){const t=new FileReader;return t.onload=function(n){n.target&&i(n.target.result)},t.readAsArrayBuffer(e),t}binaryStringToArrayBuffer(e){const i=new Uint8Array(e.length);for(let t=0;t<e.length;t++)i[t]=e.charCodeAt(t)&255;return i.buffer}isSecure(){return location.protocol==="https:"}constructor(...e){super(...e),this.CLOUD_HOST="0.peerjs.com",this.CLOUD_PORT=443,this.chunkedBrowsers={Chrome:1,chrome:1},this.defaultConfig=qt,this.browser=Re.getBrowser(),this.browserVersion=Re.getVersion(),this.pack=Ti,this.unpack=Ci,this.supports=(function(){const i={browser:Re.isBrowserSupported(),webRTC:Re.isWebRTCSupported(),audioVideo:!1,data:!1,binaryBlob:!1,reliable:!1};if(!i.webRTC)return i;let t;try{t=new RTCPeerConnection(qt),i.audioVideo=!0;let n;try{n=t.createDataChannel("_PEERJSTEST",{ordered:!0}),i.data=!0,i.reliable=!!n.ordered;try{n.binaryType="blob",i.binaryBlob=!Re.isIOS}catch{}}catch{}finally{n&&n.close()}}catch{}finally{t&&t.close()}return i})(),this.validateId=fs,this.randomToken=rn}}const ee=new ps,ms="PeerJS: ";class gs{get logLevel(){return this._logLevel}set logLevel(e){this._logLevel=e}log(...e){this._logLevel>=3&&this._print(3,...e)}warn(...e){this._logLevel>=2&&this._print(2,...e)}error(...e){this._logLevel>=1&&this._print(1,...e)}setLogFunction(e){this._print=e}_print(e,...i){const t=[ms,...i];for(const n in t)t[n]instanceof Error&&(t[n]="("+t[n].name+") "+t[n].message);e>=3?console.log(...t):e>=2?console.warn("WARNING",...t):e>=1&&console.error("ERROR",...t)}constructor(){this._logLevel=0}}var k=new gs,Mt={},vs=Object.prototype.hasOwnProperty,Z="~";function Pe(){}Object.create&&(Pe.prototype=Object.create(null),new Pe().__proto__||(Z=!1));function bs(s,e,i){this.fn=s,this.context=e,this.once=i||!1}function on(s,e,i,t,n){if(typeof i!="function")throw new TypeError("The listener must be a function");var r=new bs(i,t||s,n),o=Z?Z+e:e;return s._events[o]?s._events[o].fn?s._events[o]=[s._events[o],r]:s._events[o].push(r):(s._events[o]=r,s._eventsCount++),s}function Ie(s,e){--s._eventsCount===0?s._events=new Pe:delete s._events[e]}function Q(){this._events=new Pe,this._eventsCount=0}Q.prototype.eventNames=function(){var e=[],i,t;if(this._eventsCount===0)return e;for(t in i=this._events)vs.call(i,t)&&e.push(Z?t.slice(1):t);return Object.getOwnPropertySymbols?e.concat(Object.getOwnPropertySymbols(i)):e};Q.prototype.listeners=function(e){var i=Z?Z+e:e,t=this._events[i];if(!t)return[];if(t.fn)return[t.fn];for(var n=0,r=t.length,o=new Array(r);n<r;n++)o[n]=t[n].fn;return o};Q.prototype.listenerCount=function(e){var i=Z?Z+e:e,t=this._events[i];return t?t.fn?1:t.length:0};Q.prototype.emit=function(e,i,t,n,r,o){var a=Z?Z+e:e;if(!this._events[a])return!1;var c=this._events[a],l=arguments.length,u,h;if(c.fn){switch(c.once&&this.removeListener(e,c.fn,void 0,!0),l){case 1:return c.fn.call(c.context),!0;case 2:return c.fn.call(c.context,i),!0;case 3:return c.fn.call(c.context,i,t),!0;case 4:return c.fn.call(c.context,i,t,n),!0;case 5:return c.fn.call(c.context,i,t,n,r),!0;case 6:return c.fn.call(c.context,i,t,n,r,o),!0}for(h=1,u=new Array(l-1);h<l;h++)u[h-1]=arguments[h];c.fn.apply(c.context,u)}else{var d=c.length,f;for(h=0;h<d;h++)switch(c[h].once&&this.removeListener(e,c[h].fn,void 0,!0),l){case 1:c[h].fn.call(c[h].context);break;case 2:c[h].fn.call(c[h].context,i);break;case 3:c[h].fn.call(c[h].context,i,t);break;case 4:c[h].fn.call(c[h].context,i,t,n);break;default:if(!u)for(f=1,u=new Array(l-1);f<l;f++)u[f-1]=arguments[f];c[h].fn.apply(c[h].context,u)}}return!0};Q.prototype.on=function(e,i,t){return on(this,e,i,t,!1)};Q.prototype.once=function(e,i,t){return on(this,e,i,t,!0)};Q.prototype.removeListener=function(e,i,t,n){var r=Z?Z+e:e;if(!this._events[r])return this;if(!i)return Ie(this,r),this;var o=this._events[r];if(o.fn)o.fn===i&&(!n||o.once)&&(!t||o.context===t)&&Ie(this,r);else{for(var a=0,c=[],l=o.length;a<l;a++)(o[a].fn!==i||n&&!o[a].once||t&&o[a].context!==t)&&c.push(o[a]);c.length?this._events[r]=c.length===1?c[0]:c:Ie(this,r)}return this};Q.prototype.removeAllListeners=function(e){var i;return e?(i=Z?Z+e:e,this._events[i]&&Ie(this,i)):(this._events=new Pe,this._eventsCount=0),this};Q.prototype.off=Q.prototype.removeListener;Q.prototype.addListener=Q.prototype.on;Q.prefixed=Z;Q.EventEmitter=Q;Mt=Q;var be={};ve(be,"ConnectionType",()=>fe);ve(be,"PeerErrorType",()=>W);ve(be,"BaseConnectionErrorType",()=>Ct);ve(be,"DataConnectionErrorType",()=>Pt);ve(be,"SerializationType",()=>Oe);ve(be,"SocketEventType",()=>de);ve(be,"ServerMessageType",()=>J);var fe=(function(s){return s.Data="data",s.Media="media",s})({}),W=(function(s){return s.BrowserIncompatible="browser-incompatible",s.Disconnected="disconnected",s.InvalidID="invalid-id",s.InvalidKey="invalid-key",s.Network="network",s.PeerUnavailable="peer-unavailable",s.SslUnavailable="ssl-unavailable",s.ServerError="server-error",s.SocketError="socket-error",s.SocketClosed="socket-closed",s.UnavailableID="unavailable-id",s.WebRTC="webrtc",s})({}),Ct=(function(s){return s.NegotiationFailed="negotiation-failed",s.ConnectionClosed="connection-closed",s})({}),Pt=(function(s){return s.NotOpenYet="not-open-yet",s.MessageToBig="message-too-big",s})({}),Oe=(function(s){return s.Binary="binary",s.BinaryUTF8="binary-utf8",s.JSON="json",s.None="raw",s})({}),de=(function(s){return s.Message="message",s.Disconnected="disconnected",s.Error="error",s.Close="close",s})({}),J=(function(s){return s.Heartbeat="HEARTBEAT",s.Candidate="CANDIDATE",s.Offer="OFFER",s.Answer="ANSWER",s.Open="OPEN",s.Error="ERROR",s.IdTaken="ID-TAKEN",s.InvalidKey="INVALID-KEY",s.Leave="LEAVE",s.Expire="EXPIRE",s})({});const an="1.5.5";class ys extends Mt.EventEmitter{constructor(e,i,t,n,r,o=5e3){super(),this.pingInterval=o,this._disconnected=!0,this._messagesQueue=[];const a=e?"wss://":"ws://";this._baseUrl=a+i+":"+t+n+"peerjs?key="+r}start(e,i){this._id=e;const t=`${this._baseUrl}&id=${e}&token=${i}`;this._socket||!this._disconnected||(this._socket=new WebSocket(t+"&version="+an),this._disconnected=!1,this._socket.onmessage=n=>{let r;try{r=JSON.parse(n.data),k.log("Server message received:",r)}catch{k.log("Invalid server message",n.data);return}this.emit(de.Message,r)},this._socket.onclose=n=>{this._disconnected||(k.log("Socket closed.",n),this._cleanup(),this._disconnected=!0,this.emit(de.Disconnected))},this._socket.onopen=()=>{this._disconnected||(this._sendQueuedMessages(),k.log("Socket open"),this._scheduleHeartbeat())})}_scheduleHeartbeat(){this._wsPingTimer=setTimeout(()=>{this._sendHeartbeat()},this.pingInterval)}_sendHeartbeat(){if(!this._wsOpen()){k.log("Cannot send heartbeat, because socket closed");return}const e=JSON.stringify({type:J.Heartbeat});this._socket.send(e),this._scheduleHeartbeat()}_wsOpen(){return!!this._socket&&this._socket.readyState===1}_sendQueuedMessages(){const e=[...this._messagesQueue];this._messagesQueue=[];for(const i of e)this.send(i)}send(e){if(this._disconnected)return;if(!this._id){this._messagesQueue.push(e);return}if(!e.type){this.emit(de.Error,"Invalid message");return}if(!this._wsOpen())return;const i=JSON.stringify(e);this._socket.send(i)}close(){this._disconnected||(this._cleanup(),this._disconnected=!0)}_cleanup(){this._socket&&(this._socket.onopen=this._socket.onmessage=this._socket.onclose=null,this._socket.close(),this._socket=void 0),clearTimeout(this._wsPingTimer)}}class cn{constructor(e){this.connection=e}startConnection(e){const i=this._startPeerConnection();if(this.connection.peerConnection=i,this.connection.type===fe.Media&&e._stream&&this._addTracksToConnection(e._stream,i),e.originator){const t=this.connection,n={ordered:!!e.reliable},r=i.createDataChannel(t.label,n);t._initializeDataChannel(r),this._makeOffer()}else this.handleSDP("OFFER",e.sdp)}_startPeerConnection(){k.log("Creating RTCPeerConnection.");const e=new RTCPeerConnection(this.connection.provider.options.config);return this._setupListeners(e),e}_setupListeners(e){const i=this.connection.peer,t=this.connection.connectionId,n=this.connection.type,r=this.connection.provider;k.log("Listening for ICE candidates."),e.onicecandidate=o=>{!o.candidate||!o.candidate.candidate||(k.log(`Received ICE candidates for ${i}:`,o.candidate),r.socket.send({type:J.Candidate,payload:{candidate:o.candidate,type:n,connectionId:t},dst:i}))},e.oniceconnectionstatechange=()=>{switch(e.iceConnectionState){case"failed":k.log("iceConnectionState is failed, closing connections to "+i),this.connection.emitError(Ct.NegotiationFailed,"Negotiation of connection to "+i+" failed."),this.connection.close();break;case"closed":k.log("iceConnectionState is closed, closing connections to "+i),this.connection.emitError(Ct.ConnectionClosed,"Connection to "+i+" closed."),this.connection.close();break;case"disconnected":k.log("iceConnectionState changed to disconnected on the connection with "+i);break;case"completed":e.onicecandidate=()=>{};break}this.connection.emit("iceStateChanged",e.iceConnectionState)},k.log("Listening for data channel"),e.ondatachannel=o=>{k.log("Received data channel");const a=o.channel;r.getConnection(i,t)._initializeDataChannel(a)},k.log("Listening for remote stream"),e.ontrack=o=>{k.log("Received remote stream");const a=o.streams[0],c=r.getConnection(i,t);if(c.type===fe.Media){const l=c;this._addStreamToMediaConnection(a,l)}}}cleanup(){k.log("Cleaning up PeerConnection to "+this.connection.peer);const e=this.connection.peerConnection;if(!e)return;this.connection.peerConnection=null,e.onicecandidate=e.oniceconnectionstatechange=e.ondatachannel=e.ontrack=()=>{};const i=e.signalingState!=="closed";let t=!1;const n=this.connection.dataChannel;n&&(t=!!n.readyState&&n.readyState!=="closed"),(i||t)&&e.close()}async _makeOffer(){const e=this.connection.peerConnection,i=this.connection.provider;try{const t=await e.createOffer(this.connection.options.constraints);k.log("Created offer."),this.connection.options.sdpTransform&&typeof this.connection.options.sdpTransform=="function"&&(t.sdp=this.connection.options.sdpTransform(t.sdp)||t.sdp);try{await e.setLocalDescription(t),k.log("Set localDescription:",t,`for:${this.connection.peer}`);let n={sdp:t,type:this.connection.type,connectionId:this.connection.connectionId,metadata:this.connection.metadata};if(this.connection.type===fe.Data){const r=this.connection;n={...n,label:r.label,reliable:r.reliable,serialization:r.serialization}}i.socket.send({type:J.Offer,payload:n,dst:this.connection.peer})}catch(n){n!="OperationError: Failed to set local offer sdp: Called in wrong state: kHaveRemoteOffer"&&(i.emitError(W.WebRTC,n),k.log("Failed to setLocalDescription, ",n))}}catch(t){i.emitError(W.WebRTC,t),k.log("Failed to createOffer, ",t)}}async _makeAnswer(){const e=this.connection.peerConnection,i=this.connection.provider;try{const t=await e.createAnswer();k.log("Created answer."),this.connection.options.sdpTransform&&typeof this.connection.options.sdpTransform=="function"&&(t.sdp=this.connection.options.sdpTransform(t.sdp)||t.sdp);try{await e.setLocalDescription(t),k.log("Set localDescription:",t,`for:${this.connection.peer}`),i.socket.send({type:J.Answer,payload:{sdp:t,type:this.connection.type,connectionId:this.connection.connectionId},dst:this.connection.peer})}catch(n){i.emitError(W.WebRTC,n),k.log("Failed to setLocalDescription, ",n)}}catch(t){i.emitError(W.WebRTC,t),k.log("Failed to create answer, ",t)}}async handleSDP(e,i){i=new RTCSessionDescription(i);const t=this.connection.peerConnection,n=this.connection.provider;k.log("Setting remote description",i);const r=this;try{await t.setRemoteDescription(i),k.log(`Set remoteDescription:${e} for:${this.connection.peer}`),e==="OFFER"&&await r._makeAnswer()}catch(o){n.emitError(W.WebRTC,o),k.log("Failed to setRemoteDescription, ",o)}}async handleCandidate(e){k.log("handleCandidate:",e);try{await this.connection.peerConnection.addIceCandidate(e),k.log(`Added ICE candidate for:${this.connection.peer}`)}catch(i){this.connection.provider.emitError(W.WebRTC,i),k.log("Failed to handleCandidate, ",i)}}_addTracksToConnection(e,i){if(k.log(`add tracks from stream ${e.id} to peer connection`),!i.addTrack)return k.error("Your browser does't support RTCPeerConnection#addTrack. Ignored.");e.getTracks().forEach(t=>{i.addTrack(t,e)})}_addStreamToMediaConnection(e,i){k.log(`add stream ${e.id} to media connection ${i.connectionId}`),i.addStream(e)}}class ln extends Mt.EventEmitter{emitError(e,i){k.error("Error:",i),this.emit("error",new xs(`${e}`,i))}}class xs extends Error{constructor(e,i){typeof i=="string"?super(i):(super(),Object.assign(this,i)),this.type=e}}class un extends ln{get open(){return this._open}constructor(e,i,t){super(),this.peer=e,this.provider=i,this.options=t,this._open=!1,this.metadata=t.metadata}}class Fe extends un{static#e=this.ID_PREFIX="mc_";get type(){return fe.Media}get localStream(){return this._localStream}get remoteStream(){return this._remoteStream}constructor(e,i,t){super(e,i,t),this._localStream=this.options._stream,this.connectionId=this.options.connectionId||Fe.ID_PREFIX+ee.randomToken(),this._negotiator=new cn(this),this._localStream&&this._negotiator.startConnection({_stream:this._localStream,originator:!0})}_initializeDataChannel(e){this.dataChannel=e,this.dataChannel.onopen=()=>{k.log(`DC#${this.connectionId} dc connection success`),this.emit("willCloseOnRemote")},this.dataChannel.onclose=()=>{k.log(`DC#${this.connectionId} dc closed for:`,this.peer),this.close()}}addStream(e){k.log("Receiving stream",e),this._remoteStream=e,super.emit("stream",e)}handleMessage(e){const i=e.type,t=e.payload;switch(e.type){case J.Answer:this._negotiator.handleSDP(i,t.sdp),this._open=!0;break;case J.Candidate:this._negotiator.handleCandidate(t.candidate);break;default:k.warn(`Unrecognized message type:${i} from peer:${this.peer}`);break}}answer(e,i={}){if(this._localStream){k.warn("Local stream already exists on this MediaConnection. Are you answering a call twice?");return}this._localStream=e,i&&i.sdpTransform&&(this.options.sdpTransform=i.sdpTransform),this._negotiator.startConnection({...this.options._payload,_stream:e});const t=this.provider._getMessages(this.connectionId);for(const n of t)this.handleMessage(n);this._open=!0}close(){this._negotiator&&(this._negotiator.cleanup(),this._negotiator=null),this._localStream=null,this._remoteStream=null,this.provider&&(this.provider._removeConnection(this),this.provider=null),this.options&&this.options._stream&&(this.options._stream=null),this.open&&(this._open=!1,super.emit("close"))}}class Ss{constructor(e){this._options=e}_buildRequest(e){const i=this._options.secure?"https":"http",{host:t,port:n,path:r,key:o}=this._options,a=new URL(`${i}://${t}:${n}${r}${o}/${e}`);return a.searchParams.set("ts",`${Date.now()}${Math.random()}`),a.searchParams.set("version",an),fetch(a.href,{referrerPolicy:this._options.referrerPolicy})}async retrieveId(){try{const e=await this._buildRequest("id");if(e.status!==200)throw new Error(`Error. Status:${e.status}`);return e.text()}catch(e){k.error("Error retrieving ID",e);let i="";throw this._options.path==="/"&&this._options.host!==ee.CLOUD_HOST&&(i=" If you passed in a `path` to your self-hosted PeerServer, you'll also need to pass in that same path when creating a new Peer."),new Error("Could not get an ID from the server."+i)}}async listAllPeers(){try{const e=await this._buildRequest("peers");if(e.status!==200){if(e.status===401){let i="";throw this._options.host===ee.CLOUD_HOST?i="It looks like you're using the cloud server. You can email team@peerjs.com to enable peer listing for your API key.":i="You need to enable `allow_discovery` on your self-hosted PeerServer to use this feature.",new Error("It doesn't look like you have permission to list peers IDs. "+i)}throw new Error(`Error. Status:${e.status}`)}return e.json()}catch(e){throw k.error("Error retrieving list peers",e),new Error("Could not get list peers from the server."+e)}}}class Ve extends un{static#e=this.ID_PREFIX="dc_";static#t=this.MAX_BUFFERED_AMOUNT=8388608;get type(){return fe.Data}constructor(e,i,t){super(e,i,t),this.connectionId=this.options.connectionId||Ve.ID_PREFIX+rn(),this.label=this.options.label||this.connectionId,this.reliable=!!this.options.reliable,this._negotiator=new cn(this),this._negotiator.startConnection(this.options._payload||{originator:!0,reliable:this.reliable})}_initializeDataChannel(e){this.dataChannel=e,this.dataChannel.onopen=()=>{k.log(`DC#${this.connectionId} dc connection success`),this._open=!0,this.emit("open")},this.dataChannel.onmessage=i=>{k.log(`DC#${this.connectionId} dc onmessage:`,i.data)},this.dataChannel.onclose=()=>{k.log(`DC#${this.connectionId} dc closed for:`,this.peer),this.close()}}close(e){if(e?.flush){this.send({__peerData:{type:"close"}});return}this._negotiator&&(this._negotiator.cleanup(),this._negotiator=null),this.provider&&(this.provider._removeConnection(this),this.provider=null),this.dataChannel&&(this.dataChannel.onopen=null,this.dataChannel.onmessage=null,this.dataChannel.onclose=null,this.dataChannel=null),this.open&&(this._open=!1,super.emit("close"))}send(e,i=!1){if(!this.open){this.emitError(Pt.NotOpenYet,"Connection is not open. You should listen for the `open` event before sending messages.");return}return this._send(e,i)}async handleMessage(e){const i=e.payload;switch(e.type){case J.Answer:await this._negotiator.handleSDP(e.type,i.sdp);break;case J.Candidate:await this._negotiator.handleCandidate(i.candidate);break;default:k.warn("Unrecognized message type:",e.type,"from peer:",this.peer);break}}}class kt extends Ve{get bufferSize(){return this._bufferSize}_initializeDataChannel(e){super._initializeDataChannel(e),this.dataChannel.binaryType="arraybuffer",this.dataChannel.addEventListener("message",i=>this._handleDataMessage(i))}_bufferedSend(e){(this._buffering||!this._trySend(e))&&(this._buffer.push(e),this._bufferSize=this._buffer.length)}_trySend(e){if(!this.open)return!1;if(this.dataChannel.bufferedAmount>Ve.MAX_BUFFERED_AMOUNT)return this._buffering=!0,setTimeout(()=>{this._buffering=!1,this._tryBuffer()},50),!1;try{this.dataChannel.send(e)}catch(i){return k.error(`DC#:${this.connectionId} Error when sending:`,i),this._buffering=!0,this.close(),!1}return!0}_tryBuffer(){if(!this.open||this._buffer.length===0)return;const e=this._buffer[0];this._trySend(e)&&(this._buffer.shift(),this._bufferSize=this._buffer.length,this._tryBuffer())}close(e){if(e?.flush){this.send({__peerData:{type:"close"}});return}this._buffer=[],this._bufferSize=0,super.close()}constructor(...e){super(...e),this._buffer=[],this._bufferSize=0,this._buffering=!1}}class Ge extends kt{close(e){super.close(e),this._chunkedData={}}constructor(e,i,t){super(e,i,t),this.chunker=new sn,this.serialization=Oe.Binary,this._chunkedData={}}_handleDataMessage({data:e}){const i=Ci(e),t=i.__peerData;if(t){if(t.type==="close"){this.close();return}this._handleChunk(i);return}this.emit("data",i)}_handleChunk(e){const i=e.__peerData,t=this._chunkedData[i]||{data:[],count:0,total:e.total};if(t.data[e.n]=new Uint8Array(e.data),t.count++,this._chunkedData[i]=t,t.total===t.count){delete this._chunkedData[i];const n=ds(t.data);this._handleDataMessage({data:n})}}_send(e,i){const t=Ti(e);if(t instanceof Promise)return this._send_blob(t);if(!i&&t.byteLength>this.chunker.chunkedMTU){this._sendChunks(t);return}this._bufferedSend(t)}async _send_blob(e){const i=await e;if(i.byteLength>this.chunker.chunkedMTU){this._sendChunks(i);return}this._bufferedSend(i)}_sendChunks(e){const i=this.chunker.chunk(e);k.log(`DC#${this.connectionId} Try to send ${i.length} chunks...`);for(const t of i)this.send(t,!0)}}class Cs extends kt{_handleDataMessage({data:e}){super.emit("data",e)}_send(e,i){this._bufferedSend(e)}constructor(...e){super(...e),this.serialization=Oe.None}}class Ts extends kt{_handleDataMessage({data:e}){const i=this.parse(this.decoder.decode(e)),t=i.__peerData;if(t&&t.type==="close"){this.close();return}this.emit("data",i)}_send(e,i){const t=this.encoder.encode(this.stringify(e));if(t.byteLength>=ee.chunkedMTU){this.emitError(Pt.MessageToBig,"Message too big for JSON channel");return}this._bufferedSend(t)}constructor(...e){super(...e),this.serialization=Oe.JSON,this.encoder=new TextEncoder,this.decoder=new TextDecoder,this.stringify=JSON.stringify,this.parse=JSON.parse}}class Lt extends ln{static#e=this.DEFAULT_KEY="peerjs";get id(){return this._id}get options(){return this._options}get open(){return this._open}get socket(){return this._socket}get connections(){const e=Object.create(null);for(const[i,t]of this._connections)e[i]=t;return e}get destroyed(){return this._destroyed}get disconnected(){return this._disconnected}constructor(e,i){super(),this._serializers={raw:Cs,json:Ts,binary:Ge,"binary-utf8":Ge,default:Ge},this._id=null,this._lastServerId=null,this._destroyed=!1,this._disconnected=!1,this._open=!1,this._connections=new Map,this._lostMessages=new Map;let t;if(e&&e.constructor==Object?i=e:e&&(t=e.toString()),i={debug:0,host:ee.CLOUD_HOST,port:ee.CLOUD_PORT,path:"/",key:Lt.DEFAULT_KEY,token:ee.randomToken(),config:ee.defaultConfig,referrerPolicy:"strict-origin-when-cross-origin",serializers:{},...i},this._options=i,this._serializers={...this._serializers,...this.options.serializers},this._options.host==="/"&&(this._options.host=window.location.hostname),this._options.path&&(this._options.path[0]!=="/"&&(this._options.path="/"+this._options.path),this._options.path[this._options.path.length-1]!=="/"&&(this._options.path+="/")),this._options.secure===void 0&&this._options.host!==ee.CLOUD_HOST?this._options.secure=ee.isSecure():this._options.host==ee.CLOUD_HOST&&(this._options.secure=!0),this._options.logFunction&&k.setLogFunction(this._options.logFunction),k.logLevel=this._options.debug||0,this._api=new Ss(i),this._socket=this._createServerConnection(),!ee.supports.audioVideo&&!ee.supports.data){this._delayedAbort(W.BrowserIncompatible,"The current browser does not support WebRTC");return}if(t&&!ee.validateId(t)){this._delayedAbort(W.InvalidID,`ID "${t}" is invalid`);return}t?this._initialize(t):this._api.retrieveId().then(n=>this._initialize(n)).catch(n=>this._abort(W.ServerError,n))}_createServerConnection(){const e=new ys(this._options.secure,this._options.host,this._options.port,this._options.path,this._options.key,this._options.pingInterval);return e.on(de.Message,i=>{this._handleMessage(i)}),e.on(de.Error,i=>{this._abort(W.SocketError,i)}),e.on(de.Disconnected,()=>{this.disconnected||(this.emitError(W.Network,"Lost connection to server."),this.disconnect())}),e.on(de.Close,()=>{this.disconnected||this._abort(W.SocketClosed,"Underlying socket is already closed.")}),e}_initialize(e){this._id=e,this.socket.start(e,this._options.token)}_handleMessage(e){const i=e.type,t=e.payload,n=e.src;switch(i){case J.Open:this._lastServerId=this.id,this._open=!0,this.emit("open",this.id);break;case J.Error:this._abort(W.ServerError,t.msg);break;case J.IdTaken:this._abort(W.UnavailableID,`ID "${this.id}" is taken`);break;case J.InvalidKey:this._abort(W.InvalidKey,`API KEY "${this._options.key}" is invalid`);break;case J.Leave:k.log(`Received leave message from ${n}`),this._cleanupPeer(n),this._connections.delete(n);break;case J.Expire:this.emitError(W.PeerUnavailable,`Could not connect to peer ${n}`);break;case J.Offer:{const r=t.connectionId;let o=this.getConnection(n,r);if(o&&(o.close(),k.warn(`Offer received for existing Connection ID:${r}`)),t.type===fe.Media){const c=new Fe(n,this,{connectionId:r,_payload:t,metadata:t.metadata});o=c,this._addConnection(n,o),this.emit("call",c)}else if(t.type===fe.Data){const c=new this._serializers[t.serialization](n,this,{connectionId:r,_payload:t,metadata:t.metadata,label:t.label,serialization:t.serialization,reliable:t.reliable});o=c,this._addConnection(n,o),this.emit("connection",c)}else{k.warn(`Received malformed connection type:${t.type}`);return}const a=this._getMessages(r);for(const c of a)o.handleMessage(c);break}default:{if(!t){k.warn(`You received a malformed message from ${n} of type ${i}`);return}const r=t.connectionId,o=this.getConnection(n,r);o&&o.peerConnection?o.handleMessage(e):r?this._storeMessage(r,e):k.warn("You received an unrecognized message:",e);break}}}_storeMessage(e,i){this._lostMessages.has(e)||this._lostMessages.set(e,[]),this._lostMessages.get(e).push(i)}_getMessages(e){const i=this._lostMessages.get(e);return i?(this._lostMessages.delete(e),i):[]}connect(e,i={}){if(i={serialization:"default",...i},this.disconnected){k.warn("You cannot connect to a new Peer because you called .disconnect() on this Peer and ended your connection with the server. You can create a new Peer to reconnect, or call reconnect on this peer if you believe its ID to still be available."),this.emitError(W.Disconnected,"Cannot connect to new Peer after disconnecting from server.");return}const t=new this._serializers[i.serialization](e,this,i);return this._addConnection(e,t),t}call(e,i,t={}){if(this.disconnected){k.warn("You cannot connect to a new Peer because you called .disconnect() on this Peer and ended your connection with the server. You can create a new Peer to reconnect."),this.emitError(W.Disconnected,"Cannot connect to new Peer after disconnecting from server.");return}if(!i){k.error("To call a peer, you must provide a stream from your browser's `getUserMedia`.");return}const n=new Fe(e,this,{...t,_stream:i});return this._addConnection(e,n),n}_addConnection(e,i){k.log(`add connection ${i.type}:${i.connectionId} to peerId:${e}`),this._connections.has(e)||this._connections.set(e,[]),this._connections.get(e).push(i)}_removeConnection(e){const i=this._connections.get(e.peer);if(i){const t=i.indexOf(e);t!==-1&&i.splice(t,1)}this._lostMessages.delete(e.connectionId)}getConnection(e,i){const t=this._connections.get(e);if(!t)return null;for(const n of t)if(n.connectionId===i)return n;return null}_delayedAbort(e,i){setTimeout(()=>{this._abort(e,i)},0)}_abort(e,i){k.error("Aborting!"),this.emitError(e,i),this._lastServerId?this.disconnect():this.destroy()}destroy(){this.destroyed||(k.log(`Destroy peer with ID:${this.id}`),this.disconnect(),this._cleanup(),this._destroyed=!0,this.emit("close"))}_cleanup(){for(const e of this._connections.keys())this._cleanupPeer(e),this._connections.delete(e);this.socket.removeAllListeners()}_cleanupPeer(e){const i=this._connections.get(e);if(i)for(const t of i)t.close()}disconnect(){if(this.disconnected)return;const e=this.id;k.log(`Disconnect peer with ID:${e}`),this._disconnected=!0,this._open=!1,this.socket.close(),this._lastServerId=e,this._id=null,this.emit("disconnected",e)}reconnect(){if(this.disconnected&&!this.destroyed)k.log(`Attempting reconnection to server with ID ${this._lastServerId}`),this._disconnected=!1,this._initialize(this._lastServerId);else{if(this.destroyed)throw new Error("This peer cannot reconnect to the server. It has already been destroyed.");if(!this.disconnected&&!this.open)k.error("In a hurry? We're still trying to make the initial connection!");else throw new Error(`Peer ${this.id} cannot reconnect because it is not disconnected from the server!`)}}listAllPeers(e=i=>{}){this._api.listAllPeers().then(i=>e(i)).catch(i=>this._abort(W.ServerError,i))}}var $t=Lt;class _s{peer=null;conn=null;currentPin="";isTv=!1;latencyMs=0;pingInterval=null;constructor(){}getPin(){return this.currentPin}getLatency(){return this.latencyMs}isConnected(){return!!this.conn&&this.conn.open}async initTV(e){return this.isTv=!0,this.destroy(),new Promise(i=>{const t=()=>{const n=Math.floor(1e3+Math.random()*9e3).toString();this.currentPin=n;const r=`vibefield-tv-${n}`,o=new $t(r,{debug:1,config:{iceServers:[{urls:"stun:stun.l.google.com:19302"},{urls:"stun:stun1.l.google.com:19302"},{urls:"stun:stun2.l.google.com:19302"}]}});o.on("open",a=>{console.log("[PeerBridge TV] Receiver registered with Peer ID:",a),this.peer=o,e.onPinReady(n),i(n)}),o.on("connection",a=>{console.log("[PeerBridge TV] Incoming connection from phone:",a.peer),this.conn=a,a.on("open",()=>{console.log("[PeerBridge TV] DataChannel open with phone!"),a.send({type:"PAIR_ACK",success:!0,pin:n}),e.onConnected()}),a.on("data",c=>{const l=c;!l||!l.type||(l.type==="MOOD_TICK"?e.onMoodTick(l.data):l.type==="UPDATE_SETTINGS"?e.onSettingsUpdate(l.settings):l.type==="PING"?a.send({type:"PONG",originalTimestamp:l.timestamp}):l.type==="DISCONNECT"&&e.onDisconnected())}),a.on("close",()=>{console.log("[PeerBridge TV] Phone connection closed"),this.conn=null,e.onDisconnected()}),a.on("error",c=>{console.warn("[PeerBridge TV] Connection error:",c),this.conn=null,e.onDisconnected()})}),o.on("error",a=>{console.warn("[PeerBridge TV] Peer error:",a.type,a),a.type==="unavailable-id"?(o.destroy(),t()):e.onError(a.message||"Peer network error")})};t()})}async connectToTV(e,i){return this.isTv=!1,this.destroy(),this.currentPin=e.trim(),new Promise(t=>{const n=`vibefield-phone-${Math.random().toString(36).slice(2,8)}`,r=`vibefield-tv-${this.currentPin}`;console.log(`[PeerBridge Phone] Initializing phone peer ${n} -> connecting to ${r}`);const o=new $t(n,{debug:1,config:{iceServers:[{urls:"stun:stun.l.google.com:19302"},{urls:"stun:stun1.l.google.com:19302"},{urls:"stun:stun2.l.google.com:19302"}]}});this.peer=o,o.on("open",()=>{console.log("[PeerBridge Phone] Phone peer open, establishing WebRTC DataChannel to TV...");const a=o.connect(r,{reliable:!1});this.conn=a;const c=setTimeout(()=>{a.open||(i.onError("Connection timed out. Please check that the PIN on the TV is correct."),t(!1))},12e3);a.on("open",()=>{clearTimeout(c),console.log("[PeerBridge Phone] Connected to TV successfully!"),this.startPingLoop(),i.onConnected(),t(!0)}),a.on("data",l=>{const u=l;!u||!u.type||(u.type==="PONG"?this.latencyMs=Math.round(performance.now()-u.originalTimestamp):u.type==="PAIR_ACK"&&console.log("[PeerBridge Phone] Pair confirmed by TV!"))}),a.on("close",()=>{console.log("[PeerBridge Phone] Connection to TV closed"),this.stopPingLoop(),this.conn=null,i.onDisconnected()}),a.on("error",l=>{clearTimeout(c),console.warn("[PeerBridge Phone] Connection error:",l),this.stopPingLoop(),this.conn=null,i.onError(l.message||"Failed to connect to TV"),t(!1)})}),o.on("error",a=>{console.warn("[PeerBridge Phone] Peer error:",a),i.onError(a.message||"Phone peer initialization error"),t(!1)})})}sendMoodTick(e){if(this.conn&&this.conn.open)try{this.conn.send({type:"MOOD_TICK",data:e,timestamp:performance.now()})}catch{}}sendSettings(e){if(this.conn&&this.conn.open)try{this.conn.send({type:"UPDATE_SETTINGS",settings:e})}catch(i){console.warn("[PeerBridge Phone] Failed to send settings update:",i)}}startPingLoop(){this.stopPingLoop(),this.pingInterval=window.setInterval(()=>{this.conn&&this.conn.open&&this.conn.send({type:"PING",timestamp:performance.now()})},1500)}stopPingLoop(){this.pingInterval!==null&&(clearInterval(this.pingInterval),this.pingInterval=null)}static isPresentationSupported(){return"PresentationRequest"in window}static async requestCast(e){if(!("PresentationRequest"in window))throw new Error("Web Presentation API not supported in this browser.");const i=new URL(window.location.href);i.searchParams.set("mode","tv"),e&&i.searchParams.set("pair",e);const n=await new window.PresentationRequest([i.toString()]).start();console.log("[Presentation] Connected to Cast receiver:",n.id)}destroy(){if(this.stopPingLoop(),this.conn){try{this.conn.send({type:"DISCONNECT"}),this.conn.close()}catch{}this.conn=null}if(this.peer){try{this.peer.destroy()}catch{}this.peer=null}}}class Ue{bluetoothDevice=null;gattServer=null;presentationConnection=null;isConnected=!1;connectedTvName="";static isBluetoothSupported(){return typeof navigator<"u"&&"bluetooth"in navigator}static isPresentationSupported(){return typeof window<"u"&&"PresentationRequest"in window}getConnectedName(){return this.connectedTvName||"Smart TV"}getIsConnected(){return this.isConnected}async connectAndLaunchTV(e){try{e.onStatus("Scanning for nearby TVs via Bluetooth...","info");let i="Smart TV";if(Ue.isBluetoothSupported())try{const r=await navigator.bluetooth.requestDevice({acceptAllDevices:!0,optionalServices:["generic_access","generic_attribute",6144,6145,6154,"0000180a-0000-1000-8000-00805f9b34fb"]});if(this.bluetoothDevice=r,i=r.name||"Smart TV",this.connectedTvName=i,e.onStatus(`Bluetooth paired with "${i}". Connecting...`,"info"),r.gatt)try{this.gattServer=await r.gatt.connect(),console.log("[Bluetooth] GATT server connected to TV:",i)}catch(o){console.warn("[Bluetooth] GATT connect note:",o)}r.addEventListener("gattserverdisconnected",()=>{console.log("[Bluetooth] TV disconnected"),this.isConnected=!1,e.onStatus(`TV "${i}" disconnected`,"info")})}catch(r){if(console.warn("[Bluetooth] User cancelled or BT error:",r),r.name==="NotFoundError")return e.onError("Bluetooth scan cancelled. Tap again to select your TV."),!1;e.onStatus("Connecting to TV wireless display...","info")}else e.onStatus("Opening TV wireless display launcher...","info");const t=new URL(window.location.origin+window.location.pathname);t.searchParams.set("mode","tv"),t.searchParams.set("autostart","1"),t.searchParams.set("source","phone_bt");let n=!1;if(Ue.isPresentationSupported())try{e.onStatus(`Launching VibeField on ${i}...`,"info");const o=await new window.PresentationRequest([t.toString()]).start();this.presentationConnection=o,n=!0,console.log("[Presentation] Auto-launched TV screen successfully:",o.id),o.addEventListener("connect",()=>{console.log("[Presentation] TV Receiver connection established")}),o.addEventListener("terminate",()=>{this.presentationConnection=null})}catch(r){console.warn("[Presentation] Presentation request note:",r)}return this.isConnected=!0,e.onStatus(`Connected to ${i}! TV screen active.`,"success"),e.onLaunched(i),!0}catch(i){return console.error("[TVBluetoothLauncher] Error connecting to TV:",i),e.onError(i.message||"Failed to connect to TV"),!1}}sendToTV(e){if(this.presentationConnection&&this.presentationConnection.state==="connected")try{this.presentationConnection.send(JSON.stringify(e))}catch{}}disconnect(){if(this.isConnected=!1,this.gattServer&&this.gattServer.connected){try{this.gattServer.disconnect()}catch{}this.gattServer=null}if(this.presentationConnection){try{this.presentationConnection.terminate()}catch{}this.presentationConnection=null}}}var Ce={},je,Gt;function Rs(){return Gt||(Gt=1,je=function(){return typeof Promise=="function"&&Promise.prototype&&Promise.prototype.then}),je}var We={},he={},jt;function ye(){if(jt)return he;jt=1;let s;const e=[0,26,44,70,100,134,172,196,242,292,346,404,466,532,581,655,733,815,901,991,1085,1156,1258,1364,1474,1588,1706,1828,1921,2051,2185,2323,2465,2611,2761,2876,3034,3196,3362,3532,3706];return he.getSymbolSize=function(t){if(!t)throw new Error('"version" cannot be null or undefined');if(t<1||t>40)throw new Error('"version" should be in range from 1 to 40');return t*4+17},he.getSymbolTotalCodewords=function(t){return e[t]},he.getBCHDigit=function(i){let t=0;for(;i!==0;)t++,i>>>=1;return t},he.setToSJISFunction=function(t){if(typeof t!="function")throw new Error('"toSJISFunc" is not a valid function.');s=t},he.isKanjiModeEnabled=function(){return typeof s<"u"},he.toSJIS=function(t){return s(t)},he}var Ke={},Wt;function Dt(){return Wt||(Wt=1,(function(s){s.L={bit:1},s.M={bit:0},s.Q={bit:3},s.H={bit:2};function e(i){if(typeof i!="string")throw new Error("Param is not a string");switch(i.toLowerCase()){case"l":case"low":return s.L;case"m":case"medium":return s.M;case"q":case"quartile":return s.Q;case"h":case"high":return s.H;default:throw new Error("Unknown EC Level: "+i)}}s.isValid=function(t){return t&&typeof t.bit<"u"&&t.bit>=0&&t.bit<4},s.from=function(t,n){if(s.isValid(t))return t;try{return e(t)}catch{return n}}})(Ke)),Ke}var Xe,Kt;function Es(){if(Kt)return Xe;Kt=1;function s(){this.buffer=[],this.length=0}return s.prototype={get:function(e){const i=Math.floor(e/8);return(this.buffer[i]>>>7-e%8&1)===1},put:function(e,i){for(let t=0;t<i;t++)this.putBit((e>>>i-t-1&1)===1)},getLengthInBits:function(){return this.length},putBit:function(e){const i=Math.floor(this.length/8);this.buffer.length<=i&&this.buffer.push(0),e&&(this.buffer[i]|=128>>>this.length%8),this.length++}},Xe=s,Xe}var Ye,Xt;function Ms(){if(Xt)return Ye;Xt=1;function s(e){if(!e||e<1)throw new Error("BitMatrix size must be defined and greater than 0");this.size=e,this.data=new Uint8Array(e*e),this.reservedBit=new Uint8Array(e*e)}return s.prototype.set=function(e,i,t,n){const r=e*this.size+i;this.data[r]=t,n&&(this.reservedBit[r]=!0)},s.prototype.get=function(e,i){return this.data[e*this.size+i]},s.prototype.xor=function(e,i,t){this.data[e*this.size+i]^=t},s.prototype.isReserved=function(e,i){return this.reservedBit[e*this.size+i]},Ye=s,Ye}var Je={},Yt;function Ps(){return Yt||(Yt=1,(function(s){const e=ye().getSymbolSize;s.getRowColCoords=function(t){if(t===1)return[];const n=Math.floor(t/7)+2,r=e(t),o=r===145?26:Math.ceil((r-13)/(2*n-2))*2,a=[r-7];for(let c=1;c<n-1;c++)a[c]=a[c-1]-o;return a.push(6),a.reverse()},s.getPositions=function(t){const n=[],r=s.getRowColCoords(t),o=r.length;for(let a=0;a<o;a++)for(let c=0;c<o;c++)a===0&&c===0||a===0&&c===o-1||a===o-1&&c===0||n.push([r[a],r[c]]);return n}})(Je)),Je}var Qe={},Jt;function ks(){if(Jt)return Qe;Jt=1;const s=ye().getSymbolSize,e=7;return Qe.getPositions=function(t){const n=s(t);return[[0,0],[n-e,0],[0,n-e]]},Qe}var Ze={},Qt;function Ls(){return Qt||(Qt=1,(function(s){s.Patterns={PATTERN000:0,PATTERN001:1,PATTERN010:2,PATTERN011:3,PATTERN100:4,PATTERN101:5,PATTERN110:6,PATTERN111:7};const e={N1:3,N2:3,N3:40,N4:10};s.isValid=function(n){return n!=null&&n!==""&&!isNaN(n)&&n>=0&&n<=7},s.from=function(n){return s.isValid(n)?parseInt(n,10):void 0},s.getPenaltyN1=function(n){const r=n.size;let o=0,a=0,c=0,l=null,u=null;for(let h=0;h<r;h++){a=c=0,l=u=null;for(let d=0;d<r;d++){let f=n.get(h,d);f===l?a++:(a>=5&&(o+=e.N1+(a-5)),l=f,a=1),f=n.get(d,h),f===u?c++:(c>=5&&(o+=e.N1+(c-5)),u=f,c=1)}a>=5&&(o+=e.N1+(a-5)),c>=5&&(o+=e.N1+(c-5))}return o},s.getPenaltyN2=function(n){const r=n.size;let o=0;for(let a=0;a<r-1;a++)for(let c=0;c<r-1;c++){const l=n.get(a,c)+n.get(a,c+1)+n.get(a+1,c)+n.get(a+1,c+1);(l===4||l===0)&&o++}return o*e.N2},s.getPenaltyN3=function(n){const r=n.size;let o=0,a=0,c=0;for(let l=0;l<r;l++){a=c=0;for(let u=0;u<r;u++)a=a<<1&2047|n.get(l,u),u>=10&&(a===1488||a===93)&&o++,c=c<<1&2047|n.get(u,l),u>=10&&(c===1488||c===93)&&o++}return o*e.N3},s.getPenaltyN4=function(n){let r=0;const o=n.data.length;for(let c=0;c<o;c++)r+=n.data[c];return Math.abs(Math.ceil(r*100/o/5)-10)*e.N4};function i(t,n,r){switch(t){case s.Patterns.PATTERN000:return(n+r)%2===0;case s.Patterns.PATTERN001:return n%2===0;case s.Patterns.PATTERN010:return r%3===0;case s.Patterns.PATTERN011:return(n+r)%3===0;case s.Patterns.PATTERN100:return(Math.floor(n/2)+Math.floor(r/3))%2===0;case s.Patterns.PATTERN101:return n*r%2+n*r%3===0;case s.Patterns.PATTERN110:return(n*r%2+n*r%3)%2===0;case s.Patterns.PATTERN111:return(n*r%3+(n+r)%2)%2===0;default:throw new Error("bad maskPattern:"+t)}}s.applyMask=function(n,r){const o=r.size;for(let a=0;a<o;a++)for(let c=0;c<o;c++)r.isReserved(c,a)||r.xor(c,a,i(n,c,a))},s.getBestMask=function(n,r){const o=Object.keys(s.Patterns).length;let a=0,c=1/0;for(let l=0;l<o;l++){r(l),s.applyMask(l,n);const u=s.getPenaltyN1(n)+s.getPenaltyN2(n)+s.getPenaltyN3(n)+s.getPenaltyN4(n);s.applyMask(l,n),u<c&&(c=u,a=l)}return a}})(Ze)),Ze}var ke={},Zt;function hn(){if(Zt)return ke;Zt=1;const s=Dt(),e=[1,1,1,1,1,1,1,1,1,1,2,2,1,2,2,4,1,2,4,4,2,4,4,4,2,4,6,5,2,4,6,6,2,5,8,8,4,5,8,8,4,5,8,11,4,8,10,11,4,9,12,16,4,9,16,16,6,10,12,18,6,10,17,16,6,11,16,19,6,13,18,21,7,14,21,25,8,16,20,25,8,17,23,25,9,17,23,34,9,18,25,30,10,20,27,32,12,21,29,35,12,23,34,37,12,25,34,40,13,26,35,42,14,28,38,45,15,29,40,48,16,31,43,51,17,33,45,54,18,35,48,57,19,37,51,60,19,38,53,63,20,40,56,66,21,43,59,70,22,45,62,74,24,47,65,77,25,49,68,81],i=[7,10,13,17,10,16,22,28,15,26,36,44,20,36,52,64,26,48,72,88,36,64,96,112,40,72,108,130,48,88,132,156,60,110,160,192,72,130,192,224,80,150,224,264,96,176,260,308,104,198,288,352,120,216,320,384,132,240,360,432,144,280,408,480,168,308,448,532,180,338,504,588,196,364,546,650,224,416,600,700,224,442,644,750,252,476,690,816,270,504,750,900,300,560,810,960,312,588,870,1050,336,644,952,1110,360,700,1020,1200,390,728,1050,1260,420,784,1140,1350,450,812,1200,1440,480,868,1290,1530,510,924,1350,1620,540,980,1440,1710,570,1036,1530,1800,570,1064,1590,1890,600,1120,1680,1980,630,1204,1770,2100,660,1260,1860,2220,720,1316,1950,2310,750,1372,2040,2430];return ke.getBlocksCount=function(n,r){switch(r){case s.L:return e[(n-1)*4+0];case s.M:return e[(n-1)*4+1];case s.Q:return e[(n-1)*4+2];case s.H:return e[(n-1)*4+3];default:return}},ke.getTotalCodewordsCount=function(n,r){switch(r){case s.L:return i[(n-1)*4+0];case s.M:return i[(n-1)*4+1];case s.Q:return i[(n-1)*4+2];case s.H:return i[(n-1)*4+3];default:return}},ke}var et={},Ee={},ei;function Ds(){if(ei)return Ee;ei=1;const s=new Uint8Array(512),e=new Uint8Array(256);return(function(){let t=1;for(let n=0;n<255;n++)s[n]=t,e[t]=n,t<<=1,t&256&&(t^=285);for(let n=255;n<512;n++)s[n]=s[n-255]})(),Ee.log=function(t){if(t<1)throw new Error("log("+t+")");return e[t]},Ee.exp=function(t){return s[t]},Ee.mul=function(t,n){return t===0||n===0?0:s[e[t]+e[n]]},Ee}var ti;function Bs(){return ti||(ti=1,(function(s){const e=Ds();s.mul=function(t,n){const r=new Uint8Array(t.length+n.length-1);for(let o=0;o<t.length;o++)for(let a=0;a<n.length;a++)r[o+a]^=e.mul(t[o],n[a]);return r},s.mod=function(t,n){let r=new Uint8Array(t);for(;r.length-n.length>=0;){const o=r[0];for(let c=0;c<n.length;c++)r[c]^=e.mul(n[c],o);let a=0;for(;a<r.length&&r[a]===0;)a++;r=r.slice(a)}return r},s.generateECPolynomial=function(t){let n=new Uint8Array([1]);for(let r=0;r<t;r++)n=s.mul(n,new Uint8Array([1,e.exp(r)]));return n}})(et)),et}var tt,ii;function As(){if(ii)return tt;ii=1;const s=Bs();function e(i){this.genPoly=void 0,this.degree=i,this.degree&&this.initialize(this.degree)}return e.prototype.initialize=function(t){this.degree=t,this.genPoly=s.generateECPolynomial(this.degree)},e.prototype.encode=function(t){if(!this.genPoly)throw new Error("Encoder not initialized");const n=new Uint8Array(t.length+this.degree);n.set(t);const r=s.mod(n,this.genPoly),o=this.degree-r.length;if(o>0){const a=new Uint8Array(this.degree);return a.set(r,o),a}return r},tt=e,tt}var it={},nt={},st={},ni;function dn(){return ni||(ni=1,st.isValid=function(e){return!isNaN(e)&&e>=1&&e<=40}),st}var oe={},si;function fn(){if(si)return oe;si=1;const s="[0-9]+",e="[A-Z $%*+\\-./:]+";let i="(?:[u3000-u303F]|[u3040-u309F]|[u30A0-u30FF]|[uFF00-uFFEF]|[u4E00-u9FAF]|[u2605-u2606]|[u2190-u2195]|u203B|[u2010u2015u2018u2019u2025u2026u201Cu201Du2225u2260]|[u0391-u0451]|[u00A7u00A8u00B1u00B4u00D7u00F7])+";i=i.replace(/u/g,"\\u");const t="(?:(?![A-Z0-9 $%*+\\-./:]|"+i+`)(?:.|[\r
]))+`;oe.KANJI=new RegExp(i,"g"),oe.BYTE_KANJI=new RegExp("[^A-Z0-9 $%*+\\-./:]+","g"),oe.BYTE=new RegExp(t,"g"),oe.NUMERIC=new RegExp(s,"g"),oe.ALPHANUMERIC=new RegExp(e,"g");const n=new RegExp("^"+i+"$"),r=new RegExp("^"+s+"$"),o=new RegExp("^[A-Z0-9 $%*+\\-./:]+$");return oe.testKanji=function(c){return n.test(c)},oe.testNumeric=function(c){return r.test(c)},oe.testAlphanumeric=function(c){return o.test(c)},oe}var ri;function xe(){return ri||(ri=1,(function(s){const e=dn(),i=fn();s.NUMERIC={id:"Numeric",bit:1,ccBits:[10,12,14]},s.ALPHANUMERIC={id:"Alphanumeric",bit:2,ccBits:[9,11,13]},s.BYTE={id:"Byte",bit:4,ccBits:[8,16,16]},s.KANJI={id:"Kanji",bit:8,ccBits:[8,10,12]},s.MIXED={bit:-1},s.getCharCountIndicator=function(r,o){if(!r.ccBits)throw new Error("Invalid mode: "+r);if(!e.isValid(o))throw new Error("Invalid version: "+o);return o>=1&&o<10?r.ccBits[0]:o<27?r.ccBits[1]:r.ccBits[2]},s.getBestModeForData=function(r){return i.testNumeric(r)?s.NUMERIC:i.testAlphanumeric(r)?s.ALPHANUMERIC:i.testKanji(r)?s.KANJI:s.BYTE},s.toString=function(r){if(r&&r.id)return r.id;throw new Error("Invalid mode")},s.isValid=function(r){return r&&r.bit&&r.ccBits};function t(n){if(typeof n!="string")throw new Error("Param is not a string");switch(n.toLowerCase()){case"numeric":return s.NUMERIC;case"alphanumeric":return s.ALPHANUMERIC;case"kanji":return s.KANJI;case"byte":return s.BYTE;default:throw new Error("Unknown mode: "+n)}}s.from=function(r,o){if(s.isValid(r))return r;try{return t(r)}catch{return o}}})(nt)),nt}var oi;function ws(){return oi||(oi=1,(function(s){const e=ye(),i=hn(),t=Dt(),n=xe(),r=dn(),o=7973,a=e.getBCHDigit(o);function c(d,f,g){for(let y=1;y<=40;y++)if(f<=s.getCapacity(y,g,d))return y}function l(d,f){return n.getCharCountIndicator(d,f)+4}function u(d,f){let g=0;return d.forEach(function(y){const P=l(y.mode,f);g+=P+y.getBitsLength()}),g}function h(d,f){for(let g=1;g<=40;g++)if(u(d,g)<=s.getCapacity(g,f,n.MIXED))return g}s.from=function(f,g){return r.isValid(f)?parseInt(f,10):g},s.getCapacity=function(f,g,y){if(!r.isValid(f))throw new Error("Invalid QR Code version");typeof y>"u"&&(y=n.BYTE);const P=e.getSymbolTotalCodewords(f),C=i.getTotalCodewordsCount(f,g),M=(P-C)*8;if(y===n.MIXED)return M;const v=M-l(y,f);switch(y){case n.NUMERIC:return Math.floor(v/10*3);case n.ALPHANUMERIC:return Math.floor(v/11*2);case n.KANJI:return Math.floor(v/13);case n.BYTE:default:return Math.floor(v/8)}},s.getBestVersionForData=function(f,g){let y;const P=t.from(g,t.M);if(Array.isArray(f)){if(f.length>1)return h(f,P);if(f.length===0)return 1;y=f[0]}else y=f;return c(y.mode,y.getLength(),P)},s.getEncodedBits=function(f){if(!r.isValid(f)||f<7)throw new Error("Invalid QR Code version");let g=f<<12;for(;e.getBCHDigit(g)-a>=0;)g^=o<<e.getBCHDigit(g)-a;return f<<12|g}})(it)),it}var rt={},ai;function Is(){if(ai)return rt;ai=1;const s=ye(),e=1335,i=21522,t=s.getBCHDigit(e);return rt.getEncodedBits=function(r,o){const a=r.bit<<3|o;let c=a<<10;for(;s.getBCHDigit(c)-t>=0;)c^=e<<s.getBCHDigit(c)-t;return(a<<10|c)^i},rt}var ot={},at,ci;function Fs(){if(ci)return at;ci=1;const s=xe();function e(i){this.mode=s.NUMERIC,this.data=i.toString()}return e.getBitsLength=function(t){return 10*Math.floor(t/3)+(t%3?t%3*3+1:0)},e.prototype.getLength=function(){return this.data.length},e.prototype.getBitsLength=function(){return e.getBitsLength(this.data.length)},e.prototype.write=function(t){let n,r,o;for(n=0;n+3<=this.data.length;n+=3)r=this.data.substr(n,3),o=parseInt(r,10),t.put(o,10);const a=this.data.length-n;a>0&&(r=this.data.substr(n),o=parseInt(r,10),t.put(o,a*3+1))},at=e,at}var ct,li;function Vs(){if(li)return ct;li=1;const s=xe(),e=["0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"," ","$","%","*","+","-",".","/",":"];function i(t){this.mode=s.ALPHANUMERIC,this.data=t}return i.getBitsLength=function(n){return 11*Math.floor(n/2)+6*(n%2)},i.prototype.getLength=function(){return this.data.length},i.prototype.getBitsLength=function(){return i.getBitsLength(this.data.length)},i.prototype.write=function(n){let r;for(r=0;r+2<=this.data.length;r+=2){let o=e.indexOf(this.data[r])*45;o+=e.indexOf(this.data[r+1]),n.put(o,11)}this.data.length%2&&n.put(e.indexOf(this.data[r]),6)},ct=i,ct}var lt,ui;function Us(){if(ui)return lt;ui=1;const s=xe();function e(i){this.mode=s.BYTE,typeof i=="string"?this.data=new TextEncoder().encode(i):this.data=new Uint8Array(i)}return e.getBitsLength=function(t){return t*8},e.prototype.getLength=function(){return this.data.length},e.prototype.getBitsLength=function(){return e.getBitsLength(this.data.length)},e.prototype.write=function(i){for(let t=0,n=this.data.length;t<n;t++)i.put(this.data[t],8)},lt=e,lt}var ut,hi;function Os(){if(hi)return ut;hi=1;const s=xe(),e=ye();function i(t){this.mode=s.KANJI,this.data=t}return i.getBitsLength=function(n){return n*13},i.prototype.getLength=function(){return this.data.length},i.prototype.getBitsLength=function(){return i.getBitsLength(this.data.length)},i.prototype.write=function(t){let n;for(n=0;n<this.data.length;n++){let r=e.toSJIS(this.data[n]);if(r>=33088&&r<=40956)r-=33088;else if(r>=57408&&r<=60351)r-=49472;else throw new Error("Invalid SJIS character: "+this.data[n]+`
Make sure your charset is UTF-8`);r=(r>>>8&255)*192+(r&255),t.put(r,13)}},ut=i,ut}var ht={exports:{}},di;function Ns(){return di||(di=1,(function(s){var e={single_source_shortest_paths:function(i,t,n){var r={},o={};o[t]=0;var a=e.PriorityQueue.make();a.push(t,0);for(var c,l,u,h,d,f,g,y,P;!a.empty();){c=a.pop(),l=c.value,h=c.cost,d=i[l]||{};for(u in d)d.hasOwnProperty(u)&&(f=d[u],g=h+f,y=o[u],P=typeof o[u]>"u",(P||y>g)&&(o[u]=g,a.push(u,g),r[u]=l))}if(typeof n<"u"&&typeof o[n]>"u"){var C=["Could not find a path from ",t," to ",n,"."].join("");throw new Error(C)}return r},extract_shortest_path_from_predecessor_list:function(i,t){for(var n=[],r=t;r;)n.push(r),i[r],r=i[r];return n.reverse(),n},find_path:function(i,t,n){var r=e.single_source_shortest_paths(i,t,n);return e.extract_shortest_path_from_predecessor_list(r,n)},PriorityQueue:{make:function(i){var t=e.PriorityQueue,n={},r;i=i||{};for(r in t)t.hasOwnProperty(r)&&(n[r]=t[r]);return n.queue=[],n.sorter=i.sorter||t.default_sorter,n},default_sorter:function(i,t){return i.cost-t.cost},push:function(i,t){var n={value:i,cost:t};this.queue.push(n),this.queue.sort(this.sorter)},pop:function(){return this.queue.shift()},empty:function(){return this.queue.length===0}}};s.exports=e})(ht)),ht.exports}var fi;function Hs(){return fi||(fi=1,(function(s){const e=xe(),i=Fs(),t=Vs(),n=Us(),r=Os(),o=fn(),a=ye(),c=Ns();function l(C){return unescape(encodeURIComponent(C)).length}function u(C,M,v){const R=[];let A;for(;(A=C.exec(v))!==null;)R.push({data:A[0],index:A.index,mode:M,length:A[0].length});return R}function h(C){const M=u(o.NUMERIC,e.NUMERIC,C),v=u(o.ALPHANUMERIC,e.ALPHANUMERIC,C);let R,A;return a.isKanjiModeEnabled()?(R=u(o.BYTE,e.BYTE,C),A=u(o.KANJI,e.KANJI,C)):(R=u(o.BYTE_KANJI,e.BYTE,C),A=[]),M.concat(v,R,A).sort(function(E,x){return E.index-x.index}).map(function(E){return{data:E.data,mode:E.mode,length:E.length}})}function d(C,M){switch(M){case e.NUMERIC:return i.getBitsLength(C);case e.ALPHANUMERIC:return t.getBitsLength(C);case e.KANJI:return r.getBitsLength(C);case e.BYTE:return n.getBitsLength(C)}}function f(C){return C.reduce(function(M,v){const R=M.length-1>=0?M[M.length-1]:null;return R&&R.mode===v.mode?(M[M.length-1].data+=v.data,M):(M.push(v),M)},[])}function g(C){const M=[];for(let v=0;v<C.length;v++){const R=C[v];switch(R.mode){case e.NUMERIC:M.push([R,{data:R.data,mode:e.ALPHANUMERIC,length:R.length},{data:R.data,mode:e.BYTE,length:R.length}]);break;case e.ALPHANUMERIC:M.push([R,{data:R.data,mode:e.BYTE,length:R.length}]);break;case e.KANJI:M.push([R,{data:R.data,mode:e.BYTE,length:l(R.data)}]);break;case e.BYTE:M.push([{data:R.data,mode:e.BYTE,length:l(R.data)}])}}return M}function y(C,M){const v={},R={start:{}};let A=["start"];for(let m=0;m<C.length;m++){const E=C[m],x=[];for(let _=0;_<E.length;_++){const L=E[_],T=""+m+_;x.push(T),v[T]={node:L,lastCount:0},R[T]={};for(let b=0;b<A.length;b++){const p=A[b];v[p]&&v[p].node.mode===L.mode?(R[p][T]=d(v[p].lastCount+L.length,L.mode)-d(v[p].lastCount,L.mode),v[p].lastCount+=L.length):(v[p]&&(v[p].lastCount=L.length),R[p][T]=d(L.length,L.mode)+4+e.getCharCountIndicator(L.mode,M))}}A=x}for(let m=0;m<A.length;m++)R[A[m]].end=0;return{map:R,table:v}}function P(C,M){let v;const R=e.getBestModeForData(C);if(v=e.from(M,R),v!==e.BYTE&&v.bit<R.bit)throw new Error('"'+C+'" cannot be encoded with mode '+e.toString(v)+`.
 Suggested mode is: `+e.toString(R));switch(v===e.KANJI&&!a.isKanjiModeEnabled()&&(v=e.BYTE),v){case e.NUMERIC:return new i(C);case e.ALPHANUMERIC:return new t(C);case e.KANJI:return new r(C);case e.BYTE:return new n(C)}}s.fromArray=function(M){return M.reduce(function(v,R){return typeof R=="string"?v.push(P(R,null)):R.data&&v.push(P(R.data,R.mode)),v},[])},s.fromString=function(M,v){const R=h(M,a.isKanjiModeEnabled()),A=g(R),m=y(A,v),E=c.find_path(m.map,"start","end"),x=[];for(let _=1;_<E.length-1;_++)x.push(m.table[E[_]].node);return s.fromArray(f(x))},s.rawSplit=function(M){return s.fromArray(h(M,a.isKanjiModeEnabled()))}})(ot)),ot}var pi;function zs(){if(pi)return We;pi=1;const s=ye(),e=Dt(),i=Es(),t=Ms(),n=Ps(),r=ks(),o=Ls(),a=hn(),c=As(),l=ws(),u=Is(),h=xe(),d=Hs();function f(m,E){const x=m.size,_=r.getPositions(E);for(let L=0;L<_.length;L++){const T=_[L][0],b=_[L][1];for(let p=-1;p<=7;p++)if(!(T+p<=-1||x<=T+p))for(let S=-1;S<=7;S++)b+S<=-1||x<=b+S||(p>=0&&p<=6&&(S===0||S===6)||S>=0&&S<=6&&(p===0||p===6)||p>=2&&p<=4&&S>=2&&S<=4?m.set(T+p,b+S,!0,!0):m.set(T+p,b+S,!1,!0))}}function g(m){const E=m.size;for(let x=8;x<E-8;x++){const _=x%2===0;m.set(x,6,_,!0),m.set(6,x,_,!0)}}function y(m,E){const x=n.getPositions(E);for(let _=0;_<x.length;_++){const L=x[_][0],T=x[_][1];for(let b=-2;b<=2;b++)for(let p=-2;p<=2;p++)b===-2||b===2||p===-2||p===2||b===0&&p===0?m.set(L+b,T+p,!0,!0):m.set(L+b,T+p,!1,!0)}}function P(m,E){const x=m.size,_=l.getEncodedBits(E);let L,T,b;for(let p=0;p<18;p++)L=Math.floor(p/3),T=p%3+x-8-3,b=(_>>p&1)===1,m.set(L,T,b,!0),m.set(T,L,b,!0)}function C(m,E,x){const _=m.size,L=u.getEncodedBits(E,x);let T,b;for(T=0;T<15;T++)b=(L>>T&1)===1,T<6?m.set(T,8,b,!0):T<8?m.set(T+1,8,b,!0):m.set(_-15+T,8,b,!0),T<8?m.set(8,_-T-1,b,!0):T<9?m.set(8,15-T-1+1,b,!0):m.set(8,15-T-1,b,!0);m.set(_-8,8,1,!0)}function M(m,E){const x=m.size;let _=-1,L=x-1,T=7,b=0;for(let p=x-1;p>0;p-=2)for(p===6&&p--;;){for(let S=0;S<2;S++)if(!m.isReserved(L,p-S)){let w=!1;b<E.length&&(w=(E[b]>>>T&1)===1),m.set(L,p-S,w),T--,T===-1&&(b++,T=7)}if(L+=_,L<0||x<=L){L-=_,_=-_;break}}}function v(m,E,x){const _=new i;x.forEach(function(S){_.put(S.mode.bit,4),_.put(S.getLength(),h.getCharCountIndicator(S.mode,m)),S.write(_)});const L=s.getSymbolTotalCodewords(m),T=a.getTotalCodewordsCount(m,E),b=(L-T)*8;for(_.getLengthInBits()+4<=b&&_.put(0,4);_.getLengthInBits()%8!==0;)_.putBit(0);const p=(b-_.getLengthInBits())/8;for(let S=0;S<p;S++)_.put(S%2?17:236,8);return R(_,m,E)}function R(m,E,x){const _=s.getSymbolTotalCodewords(E),L=a.getTotalCodewordsCount(E,x),T=_-L,b=a.getBlocksCount(E,x),p=_%b,S=b-p,w=Math.floor(_/b),z=Math.floor(T/b),F=z+1,B=w-z,I=new c(B);let V=0;const U=new Array(b),G=new Array(b);let O=0;const j=new Uint8Array(m.buffer);for(let H=0;H<b;H++){const N=H<S?z:F;U[H]=j.slice(V,V+N),G[H]=I.encode(U[H]),V+=N,O=Math.max(O,N)}const K=new Uint8Array(_);let ie=0,X,$;for(X=0;X<O;X++)for($=0;$<b;$++)X<U[$].length&&(K[ie++]=U[$][X]);for(X=0;X<B;X++)for($=0;$<b;$++)K[ie++]=G[$][X];return K}function A(m,E,x,_){let L;if(Array.isArray(m))L=d.fromArray(m);else if(typeof m=="string"){let w=E;if(!w){const z=d.rawSplit(m);w=l.getBestVersionForData(z,x)}L=d.fromString(m,w||40)}else throw new Error("Invalid data");const T=l.getBestVersionForData(L,x);if(!T)throw new Error("The amount of data is too big to be stored in a QR Code");if(!E)E=T;else if(E<T)throw new Error(`
The chosen QR Code version cannot contain this amount of data.
Minimum version required to store current data is: `+T+`.
`);const b=v(E,x,L),p=s.getSymbolSize(E),S=new t(p);return f(S,E),g(S),y(S,E),C(S,x,0),E>=7&&P(S,E),M(S,b),isNaN(_)&&(_=o.getBestMask(S,C.bind(null,S,x))),o.applyMask(_,S),C(S,x,_),{modules:S,version:E,errorCorrectionLevel:x,maskPattern:_,segments:L}}return We.create=function(E,x){if(typeof E>"u"||E==="")throw new Error("No input text");let _=e.M,L,T;return typeof x<"u"&&(_=e.from(x.errorCorrectionLevel,e.M),L=l.from(x.version),T=o.from(x.maskPattern),x.toSJISFunc&&s.setToSJISFunction(x.toSJISFunc)),A(E,L,_,T)},We}var dt={},ft={},mi;function pn(){return mi||(mi=1,(function(s){function e(i){if(typeof i=="number"&&(i=i.toString()),typeof i!="string")throw new Error("Color should be defined as hex string");let t=i.slice().replace("#","").split("");if(t.length<3||t.length===5||t.length>8)throw new Error("Invalid hex color: "+i);(t.length===3||t.length===4)&&(t=Array.prototype.concat.apply([],t.map(function(r){return[r,r]}))),t.length===6&&t.push("F","F");const n=parseInt(t.join(""),16);return{r:n>>24&255,g:n>>16&255,b:n>>8&255,a:n&255,hex:"#"+t.slice(0,6).join("")}}s.getOptions=function(t){t||(t={}),t.color||(t.color={});const n=typeof t.margin>"u"||t.margin===null||t.margin<0?4:t.margin,r=t.width&&t.width>=21?t.width:void 0,o=t.scale||4;return{width:r,scale:r?4:o,margin:n,color:{dark:e(t.color.dark||"#000000ff"),light:e(t.color.light||"#ffffffff")},type:t.type,rendererOpts:t.rendererOpts||{}}},s.getScale=function(t,n){return n.width&&n.width>=t+n.margin*2?n.width/(t+n.margin*2):n.scale},s.getImageWidth=function(t,n){const r=s.getScale(t,n);return Math.floor((t+n.margin*2)*r)},s.qrToImageData=function(t,n,r){const o=n.modules.size,a=n.modules.data,c=s.getScale(o,r),l=Math.floor((o+r.margin*2)*c),u=r.margin*c,h=[r.color.light,r.color.dark];for(let d=0;d<l;d++)for(let f=0;f<l;f++){let g=(d*l+f)*4,y=r.color.light;if(d>=u&&f>=u&&d<l-u&&f<l-u){const P=Math.floor((d-u)/c),C=Math.floor((f-u)/c);y=h[a[P*o+C]?1:0]}t[g++]=y.r,t[g++]=y.g,t[g++]=y.b,t[g]=y.a}}})(ft)),ft}var gi;function qs(){return gi||(gi=1,(function(s){const e=pn();function i(n,r,o){n.clearRect(0,0,r.width,r.height),r.style||(r.style={}),r.height=o,r.width=o,r.style.height=o+"px",r.style.width=o+"px"}function t(){try{return document.createElement("canvas")}catch{throw new Error("You need to specify a canvas element")}}s.render=function(r,o,a){let c=a,l=o;typeof c>"u"&&(!o||!o.getContext)&&(c=o,o=void 0),o||(l=t()),c=e.getOptions(c);const u=e.getImageWidth(r.modules.size,c),h=l.getContext("2d"),d=h.createImageData(u,u);return e.qrToImageData(d.data,r,c),i(h,l,u),h.putImageData(d,0,0),l},s.renderToDataURL=function(r,o,a){let c=a;typeof c>"u"&&(!o||!o.getContext)&&(c=o,o=void 0),c||(c={});const l=s.render(r,o,c),u=c.type||"image/png",h=c.rendererOpts||{};return l.toDataURL(u,h.quality)}})(dt)),dt}var pt={},vi;function $s(){if(vi)return pt;vi=1;const s=pn();function e(n,r){const o=n.a/255,a=r+'="'+n.hex+'"';return o<1?a+" "+r+'-opacity="'+o.toFixed(2).slice(1)+'"':a}function i(n,r,o){let a=n+r;return typeof o<"u"&&(a+=" "+o),a}function t(n,r,o){let a="",c=0,l=!1,u=0;for(let h=0;h<n.length;h++){const d=Math.floor(h%r),f=Math.floor(h/r);!d&&!l&&(l=!0),n[h]?(u++,h>0&&d>0&&n[h-1]||(a+=l?i("M",d+o,.5+f+o):i("m",c,0),c=0,l=!1),d+1<r&&n[h+1]||(a+=i("h",u),u=0)):c++}return a}return pt.render=function(r,o,a){const c=s.getOptions(o),l=r.modules.size,u=r.modules.data,h=l+c.margin*2,d=c.color.light.a?"<path "+e(c.color.light,"fill")+' d="M0 0h'+h+"v"+h+'H0z"/>':"",f="<path "+e(c.color.dark,"stroke")+' d="'+t(u,l,c.margin)+'"/>',g='viewBox="0 0 '+h+" "+h+'"',P='<svg xmlns="http://www.w3.org/2000/svg" '+(c.width?'width="'+c.width+'" height="'+c.width+'" ':"")+g+' shape-rendering="crispEdges">'+d+f+`</svg>
`;return typeof a=="function"&&a(null,P),P},pt}var bi;function Gs(){if(bi)return Ce;bi=1;const s=Rs(),e=zs(),i=qs(),t=$s();function n(r,o,a,c,l){const u=[].slice.call(arguments,1),h=u.length,d=typeof u[h-1]=="function";if(!d&&!s())throw new Error("Callback required as last argument");if(d){if(h<2)throw new Error("Too few arguments provided");h===2?(l=a,a=o,o=c=void 0):h===3&&(o.getContext&&typeof l>"u"?(l=c,c=void 0):(l=c,c=a,a=o,o=void 0))}else{if(h<1)throw new Error("Too few arguments provided");return h===1?(a=o,o=c=void 0):h===2&&!o.getContext&&(c=a,a=o,o=void 0),new Promise(function(f,g){try{const y=e.create(a,c);f(r(y,o,c))}catch(y){g(y)}})}try{const f=e.create(a,c);l(null,r(f,o,c))}catch(f){l(f)}}return Ce.create=e.create,Ce.toCanvas=n.bind(null,i.render),Ce.toDataURL=n.bind(null,i.renderToDataURL),Ce.toString=n.bind(null,function(r,o,a){return t.render(r,a)}),Ce}var js=Gs();const Ws=tn(js);class Ks{el;pinContainer;qrCanvas;statusText;floatingBadge=null;constructor(){this.el=document.createElement("div"),this.el.className="tv-pairing-overlay",this.el.innerHTML=`
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
    `,document.body.appendChild(this.el),this.pinContainer=this.el.querySelector("#tvPinDigits"),this.qrCanvas=this.el.querySelector("#tvQrCanvas"),this.statusText=this.el.querySelector("#tvPairingStatus")}setPin(e){if(!this.pinContainer)return;const i=e.split("");this.pinContainer.innerHTML=i.map(n=>`<span class="pin-box pin-active">${n}</span>`).join("");const t=new URL(window.location.href);t.searchParams.set("connect",e),t.searchParams.delete("mode"),Ws.toCanvas(this.qrCanvas,t.toString(),{width:180,margin:1,color:{dark:"#ffffff",light:"#0a0d14"}}).catch(n=>{console.warn("QR code generation failed:",n)})}onPairedSuccess(){this.statusText.innerHTML=`
      <span class="tv-success-icon">✓</span>
      <span style="color: #4ade80; font-weight: 600;">Phone Connected! Entering 4K Visualizer...</span>
    `,setTimeout(()=>{this.el.classList.add("tv-fade-out"),setTimeout(()=>{this.el.parentElement&&this.el.parentElement.removeChild(this.el)},700),this.showFloatingBadge()},1200)}showFloatingBadge(){this.floatingBadge||(this.floatingBadge=document.createElement("div"),this.floatingBadge.className="tv-floating-badge",this.floatingBadge.innerHTML=`
      <span class="live-dot green"></span>
      <span>TV Receiver • Phone Mic Live</span>
    `,document.body.appendChild(this.floatingBadge),setTimeout(()=>{this.floatingBadge&&this.floatingBadge.classList.add("faded")},5e3))}showDisconnectedNotice(){this.floatingBadge&&(this.floatingBadge.innerHTML=`
        <span class="live-dot orange"></span>
        <span>Phone Disconnected • Ambient Synth Active</span>
      `,this.floatingBadge.classList.remove("faded"))}destroy(){this.el.parentElement&&this.el.parentElement.removeChild(this.el),this.floatingBadge&&this.floatingBadge.parentElement&&this.floatingBadge.parentElement.removeChild(this.floatingBadge)}}class Xs{el;callbacks;settings;isConnected=!1;connectedTvName="Smart TV";pairingSection;remoteSection;spectrumContainer;bpmBadge;keyBadge;latencyBadge;statusTvName;pairingStatusMsg;constructor(e,i,t=!1){this.settings={...e},this.callbacks=i,this.isConnected=t,this.el=document.createElement("div"),this.el.className="phone-remote-container",this.el.innerHTML=`
      <div class="phone-remote-header">
        <div class="phone-remote-brand">
          <span class="phone-remote-dot"></span>
          <span>VibeField Phone Controller</span>
        </div>
        <button class="phone-exit-btn" id="btnExitRemote" title="Exit to Solo Mode">✕</button>
      </div>

      <!-- 100% USER-SIDE / PHONE-INITIATED PAIRING SCREEN -->
      <div class="phone-pairing-panel" id="phonePairingPanel">
        <div class="phone-bt-hero-badge">
          <span class="bt-glyph">ᛒ</span>
          <span>Bluetooth & Wireless TV Auto-Launch</span>
        </div>
        <h2 class="phone-pairing-title">Connect to TV</h2>
        <p class="phone-pairing-desc">
          Connect completely from your phone. Tapping below prompts your phone to pair via Bluetooth with your TV and automatically opens the visualizer on your TV screen.
          <br/><strong style="color: #38bdf8;">Zero interaction needed on your TV.</strong>
        </p>

        <div class="phone-bt-card">
          <button class="phone-connect-btn phone-bt-primary" id="btnConnectBt">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="m7 7 10 10-5 5V2l5 5L7 17"/></svg>
            <span>Connect to TV via Bluetooth</span>
          </button>

          <button class="phone-cast-btn" id="btnConnectCast" style="margin-top: 12px;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 16.1A5 5 0 0 1 5.9 20M2 12.05A9 9 0 0 1 9.95 20M2 8V6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-6"/><line x1="2" y1="20" x2="2.01" y2="20"/></svg>
            <span>Wireless Screen / Google Cast Launcher</span>
          </button>
        </div>

        <div class="phone-pairing-status" id="phonePairingStatus" style="display: none;"></div>

        <div class="phone-features-checklist">
          <div><span class="check-icon">✓</span> 100% Phone-initiated (Nothing from TV side)</div>
          <div><span class="check-icon">✓</span> Phone mic captures live room music</div>
          <div><span class="check-icon">✓</span> TV automatically wakes up in 4K fluid mode</div>
        </div>
      </div>

      <!-- CONNECTED REMOTE CONTROLLER -->
      <div class="phone-active-panel" id="phoneActivePanel" style="display: none;">
        <!-- Status Bar -->
        <div class="remote-status-card">
          <div class="remote-status-left">
            <span class="live-pulse"></span>
            <div>
              <div class="remote-tv-name" id="remoteTvName">Linked to Smart TV</div>
              <div class="remote-latency" id="remoteLatency">Bluetooth Linked • 60Hz Telemetry</div>
            </div>
          </div>
          <button class="remote-disconnect-btn" id="btnDisconnect">Disconnect</button>
        </div>

        <!-- Audio Producer Status -->
        <div class="remote-card audio-status-card">
          <div class="card-title">
            <span>🎤 Phone Room Microphone</span>
            <span class="audio-source-badge" id="audioSourceBadge">Live Listening</span>
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
          <div class="card-title">Visual Presets (TV Screen Updates Instantly)</div>
          <div class="preset-pill-grid">
            <button class="preset-pill active" data-preset="auto">Auto Mood</button>
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
            <span>Color Temperature Filter</span>
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
    `,document.body.appendChild(this.el),this.initDOMElements(),this.bindEvents(),this.isConnected&&this.setConnectedState(!0)}initDOMElements(){this.pairingSection=this.el.querySelector("#phonePairingPanel"),this.remoteSection=this.el.querySelector("#phoneActivePanel"),this.spectrumContainer=this.el.querySelector("#remoteSpectrum"),this.bpmBadge=this.el.querySelector("#remoteBpm"),this.keyBadge=this.el.querySelector("#remoteKey"),this.latencyBadge=this.el.querySelector("#remoteLatency"),this.statusTvName=this.el.querySelector("#remoteTvName"),this.pairingStatusMsg=this.el.querySelector("#phonePairingStatus")}bindEvents(){this.el.querySelector("#btnConnectBt")?.addEventListener("click",async()=>{this.showStatus("Prompting Bluetooth pairing on phone...","info");try{await this.callbacks.onConnectBluetooth()&&this.setConnectedState(!0)}catch(v){this.showStatus(v.message||"Bluetooth connection failed","error")}}),this.el.querySelector("#btnConnectCast")?.addEventListener("click",async()=>{this.showStatus("Prompting Wireless TV screen selector...","info");try{await this.callbacks.onConnectCast()&&this.setConnectedState(!0)}catch(v){this.showStatus(v.message||"Wireless launch failed","error")}}),this.el.querySelector("#btnExitRemote")?.addEventListener("click",()=>{this.callbacks.onExitToSolo()}),this.el.querySelector("#btnDisconnect")?.addEventListener("click",()=>{this.callbacks.onDisconnect(),this.setConnectedState(!1)});const r=this.el.querySelectorAll(".preset-pill");r.forEach(v=>{v.addEventListener("click",()=>{const R=v.getAttribute("data-preset");r.forEach(A=>A.classList.remove("active")),v.classList.add("active"),this.settings.activePreset=R,this.callbacks.onSettingsChange({activePreset:R})})});const o=this.el.querySelector("#sliderColorTemp"),a=this.el.querySelector("#tempValText"),c=this.el.querySelector("#btnTempCool"),l=this.el.querySelector("#btnTempNeutral"),u=this.el.querySelector("#btnTempWarm"),h=v=>{o.value=v.toString(),v<=-.15?(a.textContent=`Cool (${Math.round(v*100)}%)`,c.classList.add("active"),l.classList.remove("active"),u.classList.remove("active")):v>=.15?(a.textContent=`Warm (+${Math.round(v*100)}%)`,c.classList.remove("active"),l.classList.remove("active"),u.classList.add("active")):(a.textContent="Neutral",c.classList.remove("active"),l.classList.add("active"),u.classList.remove("active"))};o?.addEventListener("input",()=>{const v=parseFloat(o.value);h(v),this.settings.colorTempBias=v,this.callbacks.onSettingsChange({colorTempBias:v})}),c?.addEventListener("click",()=>{h(-.6),this.callbacks.onSettingsChange({colorTempBias:-.6})}),l?.addEventListener("click",()=>{h(0),this.callbacks.onSettingsChange({colorTempBias:0})}),u?.addEventListener("click",()=>{h(.6),this.callbacks.onSettingsChange({colorTempBias:.6})});const d=this.el.querySelector("#sliderSensitivity"),f=this.el.querySelector("#sensValText");d?.addEventListener("input",()=>{const v=parseFloat(d.value);f.textContent=`${v.toFixed(1)}x`,this.settings.sensitivity=v,this.callbacks.onSettingsChange({sensitivity:v})});const g=this.el.querySelector("#sliderViscosity"),y=this.el.querySelector("#viscValText");g?.addEventListener("input",()=>{const v=parseFloat(g.value);y.textContent=v<-.1?"Fluid":v>.1?"Viscous":"Balanced",this.settings.viscosityBias=v,this.callbacks.onSettingsChange({viscosityBias:v})});const P=this.el.querySelector("#btnSourceMic"),C=this.el.querySelector("#btnSourceDemo"),M=this.el.querySelector("#audioSourceBadge");P?.addEventListener("click",()=>{P.classList.add("active"),C.classList.remove("active"),M.textContent="Live Listening",this.callbacks.onToggleSource("mic")}),C?.addEventListener("click",()=>{C.classList.add("active"),P.classList.remove("active"),M.textContent="Demo Synth",this.callbacks.onToggleSource("demo")})}setConnectedState(e,i="Smart TV"){this.isConnected=e,this.connectedTvName=i,e?(this.pairingSection.style.display="none",this.remoteSection.style.display="block",this.statusTvName&&(this.statusTvName.textContent=`Linked to ${i}`)):(this.pairingSection.style.display="block",this.remoteSection.style.display="none")}updateLiveTelemetry(e,i){if(this.isConnected&&(this.bpmBadge&&(this.bpmBadge.textContent=`${Math.round(e.bpm)} BPM`),this.keyBadge&&(this.keyBadge.textContent=e.pitchInfo?`${e.pitchInfo.pitchName} (${Math.round(e.harmonicLiquid?.dominantHue??0)}°)`:"--"),this.latencyBadge&&(this.latencyBadge.textContent=`Latency: ${i}ms • 60Hz Telemetry`),this.spectrumContainer&&e.spectrumBands)){const t=this.spectrumContainer.querySelectorAll(".spec-bar");e.spectrumBands.forEach((n,r)=>{if(t[r]){const o=Math.max(8,Math.min(100,Math.round(n.amplitude*100)));t[r].style.height=`${o}%`}})}}showStatus(e,i="info"){this.pairingStatusMsg&&(this.pairingStatusMsg.textContent=e,this.pairingStatusMsg.style.display="block",this.pairingStatusMsg.className=`phone-pairing-status status-${i}`)}destroy(){this.el.parentElement&&this.el.parentElement.removeChild(this.el)}}const yi="vibefield_settings_v2",mt={sensitivity:1,viscosityBias:0,colorTempBias:0,paletteBias:0,paletteShiftMode:"shifting",paletteShiftSpeed:1,hdrIntensity:.6,smoothing:.12,selectedDeviceId:"default",inputMode:"mic",activePreset:"auto",enableSmartLights:!1,smartLightWsUrl:"ws://localhost:8080/wled"};class Ys{canvas;renderer=null;audioEngine;notifications;settingsModal;deviceModal;debugOverlay;mediaCapture;smartLights;operatingMode="standalone";peerBridge=new _s;bluetoothLauncher=new Ue;tvPairingScreen=null;phoneRemoteView=null;remoteMood=null;settings;isStarted=!1;lastFrameTime=0;cursorTimer=null;constructor(){this.canvas=document.getElementById("vibeCanvas"),this.notifications=new Kn,this.debugOverlay=new Jn,this.settings=this.loadSettings(),this.smartLights=new Zn(this.settings.smartLightWsUrl,this.settings.enableSmartLights),this.mediaCapture=new Qn(this.canvas,(n,r)=>{this.notifications.show(n,3e3,r)}),this.audioEngine=new Pn({onError:n=>{console.warn("[AudioEngine]",n),this.notifications.show(n,4e3,"error")},onDevicesUpdated:n=>{this.deviceModal?.setDevices(n,this.settings.selectedDeviceId),this.settingsModal?.setDevices(n,this.settings.selectedDeviceId)},onModeChanged:n=>{const r={mic:"Microphone Audio Active",tab:"Tab / System Audio Active",demo:"Demo Synthesizer Active (Press M to cycle)"};this.notifications.show(r[n]||n,2500,"success")}}),this.deviceModal=new Yn(n=>{this.settings.selectedDeviceId=n,this.saveSettings(),this.audioEngine.selectDevice(n),this.notifications.show("Switched audio input device",2e3,"info")}),this.settingsModal=new Xn(this.settings,{onUpdate:n=>{this.settings={...n},this.saveSettings(),this.smartLights.setEnabled(this.settings.enableSmartLights),this.smartLights.setUrl(this.settings.smartLightWsUrl)},onReset:()=>{this.settings={...mt},this.saveSettings(),this.settingsModal.updateValues(this.settings),this.notifications.show("Settings reset to defaults",2e3,"info")},onSelectDevice:n=>{this.settings.selectedDeviceId=n,this.saveSettings(),this.audioEngine.selectDevice(n)},onCaptureTab:()=>{this.audioEngine.captureTabAudio()},onToggleDemo:()=>{this.cycleDemoMode()},onSelectPreset:n=>{this.setPreset(n)},onTakeScreenshot:()=>{this.mediaCapture.takeScreenshot()},onToggleRecording:()=>{this.mediaCapture.toggleRecording()}}),this.bindWindowEvents();const e=new URLSearchParams(window.location.search),i=e.get("connect")||e.get("pair"),t=e.get("mode");if(i)this.startPhoneRemote(i);else if(t==="tv")this.startTVReceiver();else if(t==="phone"||t==="remote")this.startPhoneRemote();else if(e.get("autostart")==="1"||t&&["low","high","surge","dynamic","ambient"].includes(t)){const n=e.get("mode")||"dynamic";e.get("preset")&&this.setPreset(e.get("preset"),!1),e.get("debug")==="1"&&this.debugOverlay.show(),this.start(n)}else new Wn({onStartSolo:()=>this.start(),onStartPhoneRemote:()=>this.startPhoneRemote(),onStartTVReceiver:()=>this.startTVReceiver()})}async startTVReceiver(){if(this.isStarted)return;this.operatingMode="tv",this.isStarted=!0,await this.initRenderer(),this.handleResize(),await this.audioEngine.initialize(this.settings.selectedDeviceId,"dynamic");const e=new URLSearchParams(window.location.search);e.get("autostart")==="1"||e.get("source")==="phone_bt"?this.notifications.show("TV Connected via Phone Bluetooth • Native 4K Fluid Running",4e3,"success"):this.tvPairingScreen=new Ks,await this.peerBridge.initTV({onPinReady:t=>{this.tvPairingScreen?.setPin(t)},onConnected:()=>{this.tvPairingScreen?.onPairedSuccess(),this.notifications.show("Phone Connected! Streaming live room audio in 4K.",4e3,"success")},onMoodTick:t=>{this.remoteMood=t},onSettingsUpdate:t=>{this.settings={...this.settings,...t},this.saveSettings(),t.activePreset&&this.setPreset(t.activePreset,!1)},onDisconnected:()=>{this.remoteMood=null,this.tvPairingScreen?.showDisconnectedNotice(),this.notifications.show("Phone disconnected. Ambient synth active.",3e3,"info")},onError:t=>{console.warn("[TV Receiver Peer Error]",t)}}),this.lastFrameTime=performance.now(),requestAnimationFrame(this.renderLoop)}async startPhoneRemote(e){this.operatingMode="phone",this.isStarted=!0,await this.audioEngine.initialize(this.settings.selectedDeviceId),this.phoneRemoteView=new Xs(this.settings,{onConnectBluetooth:async()=>await this.bluetoothLauncher.connectAndLaunchTV({onStatus:(i,t)=>{this.notifications.show(i,3e3,t||"info"),this.phoneRemoteView?.showStatus(i,t)},onLaunched:i=>{this.phoneRemoteView?.setConnectedState(!0,i),this.notifications.show(`TV Active: ${i}! Streaming room microphone.`,4500,"success")},onError:i=>{this.notifications.show(i,4e3,"error"),this.phoneRemoteView?.showStatus(i,"error")}}),onConnectCast:async()=>await this.bluetoothLauncher.connectAndLaunchTV({onStatus:(i,t)=>{this.notifications.show(i,3e3,t||"info"),this.phoneRemoteView?.showStatus(i,t)},onLaunched:i=>{this.phoneRemoteView?.setConnectedState(!0,i)},onError:i=>{this.notifications.show(i,4e3,"error")}}),onDisconnect:()=>{this.bluetoothLauncher.disconnect(),this.peerBridge.destroy(),this.notifications.show("Disconnected from TV",2e3,"info")},onSettingsChange:i=>{this.settings={...this.settings,...i},this.saveSettings(),this.peerBridge.sendSettings(i),this.bluetoothLauncher.sendToTV({type:"UPDATE_SETTINGS",settings:i})},onToggleSource:i=>{i==="mic"?this.audioEngine.selectDevice(this.settings.selectedDeviceId):this.audioEngine.startDemo("dynamic")},onExitToSolo:()=>{window.location.href=window.location.pathname}}),setInterval(()=>{const i=performance.now()*.001,t=this.audioEngine.update(i,this.settings);t&&(this.peerBridge.isConnected()&&this.peerBridge.sendMoodTick(t),this.bluetoothLauncher.getIsConnected()&&this.bluetoothLauncher.sendToTV({type:"MOOD_TICK",data:t}),this.phoneRemoteView?.updateLiveTelemetry(t,this.peerBridge.getLatency()))},1e3/60)}loadSettings(){try{const e=localStorage.getItem(yi);if(e)return{...mt,...JSON.parse(e)}}catch(e){console.warn("Failed to parse saved settings:",e)}return{...mt}}saveSettings(){try{localStorage.setItem(yi,JSON.stringify(this.settings))}catch(e){console.warn("Failed to save settings to localStorage:",e)}}setPreset(e,i=!0){if(this.settings.activePreset=e,this.saveSettings(),this.settingsModal.setPreset(e),i){const t={auto:"Preset: Auto (Adaptive Mood)",ink:"Preset 1: Ink in Water",lava:"Preset 2: Lava Lamp",aurora:"Preset 3: Aurora Borealis",neon:"Preset 4: Neon Club",ocean:"Preset 5: Deep Ocean"};this.notifications.show(t[e]||e,2500,"info")}}async initRenderer(){try{const e=new Fn(this.canvas);if(await e.init()){this.renderer=e;const t=e.getStats();console.log(`Initialized Navier-Stokes Fluid Engine: ${t.rendererType} (${t.canvasFormat}, ${t.colorSpace})`);return}}catch(e){console.warn("WebGPU initialization failed, falling back to WebGL2 Navier-Stokes:",e)}try{console.info("Initializing WebGL2 Navier-Stokes Fluid renderer...");const e=new jn(this.canvas);if(await e.init()){this.renderer=e,console.log("Initialized WebGL2 Navier-Stokes Fluid renderer.");return}}catch(e){console.warn("WebGL2 fluid initialization failed:",e)}try{const e=new Dn(this.canvas);if(await e.init()){this.renderer=e,console.log("Initialized Cinematic Fluid Renderer fallback.");return}}catch(e){console.warn("CinematicFluidRenderer fallback failed:",e)}this.notifications.show("Your browser does not support WebGPU or WebGL2.",8e3,"error")}async start(e){this.isStarted||(this.isStarted=!0,await this.initRenderer(),this.handleResize(),await this.audioEngine.initialize(this.settings.selectedDeviceId,e),setTimeout(()=>{this.notifications.show("VibeField active. Press H for settings, F for fullscreen, 0-5 for presets.",3800,"info")},800),this.lastFrameTime=performance.now(),requestAnimationFrame(this.renderLoop))}renderLoop=e=>{requestAnimationFrame(this.renderLoop);const i=(e-this.lastFrameTime)*.001;this.lastFrameTime=e;const t=e*.001;let n=null;this.operatingMode==="tv"&&this.remoteMood?n=this.remoteMood:n=this.audioEngine.update(t,this.settings),n||(n=this.createIdleMood(t)),this.renderer&&(this.renderer.render(n,this.settings,i),this.debugOverlay.update(n,this.renderer.getStats()),this.smartLights.update(n)),window.__vibefield={mood:n,stats:this.renderer?.getStats(),settings:this.settings}};createIdleMood(e){const i=(Math.sin(e*.6)+1)*.5,t=[];for(let r=0;r<10;r++){const o=r/9,a=o<=.5?265+-40*(o/.5):225+-30*((o-.5)/.5),c=.44+r*.012,l=.33,u=ae(c,l,a);t.push({index:r,name:`Band ${r}`,minHz:40*Math.pow(2,r*.8),maxHz:75*Math.pow(2,r*.8),centerHz:60*Math.pow(2,r*.8),amplitude:.15+i*.08,rawHue:a,effectiveHue:a,lightness:c,chroma:l,oklab:[u.L,u.a,u.b]})}const n=ae(.44+i*.04,.33,235);return{bpm:75,rawBpm:75,energy:.18+i*.06,brightness:.5,hueSpreadDeg:45,colorTemperature:{temperature:-.6,isWarm:!1,family:"cold",baseHue:235,baseLab:[n.L,n.a,n.b],description:"Cool Gradient (Sapphire, Cobalt & Aqua)",rotationAngle:235,isShifting:!1},spectrumBands:t,pitchInfo:{chroma12:new Array(12).fill(.08),dominantPitchClass:9,pitchName:"A",circleOfFifthsIndex:3,pitchRotationAngle:90,majorMinorScore:-.5,biasApplied:-.08},ebbSurge:{masterIntensity:.2,shortEnergy:.15,longEnergy:.2,dynamicsRatio:.75,isEbb:!1,isSurge:!1,surgeTimer:999,ebbDepth:0,calibrationFloor:.05,calibrationCeil:.8,calibrationReady:!0},isBeat:!1,beatIntensity:0,isKick:!1,kickIntensity:0,isHiHat:!1,hiHatIntensity:0,midRangeSwirl:.1,isSilent:!0,activePreset:this.settings.activePreset,harmonicLiquid:{dominantHue:30,support1Hue:55,support2Hue:5,accentHue:90,complementaryHue:210,fluidVelocity:.12,zCoordinate:e*.12,amplitude:.15+i*.05,amplitudeDerivative:0,bpmFlowScale:1,randomAngle:0,isBurst:!1,burstIntensity:0,burstRadius:0,burstOrigin:[.5,.5],dissonanceFactor:0,musicalMode:"major",colorTempBias:0},dominantColor:{r:.12,g:.18,b:.38,hex:"#1f2e61",lightness:.2}}}cycleDemoMode(){const e=this.audioEngine.getDemoMood();e==="off"?(this.audioEngine.startDemo("low"),this.notifications.show("Demo: Low Energy (Slow Ambient Sine Pad)",2800,"info")):e==="low"?(this.audioEngine.setDemoMood("high"),this.notifications.show("Demo: High Energy (135 BPM Four-on-the-Floor Beat)",2800,"info")):e==="high"?(this.audioEngine.setDemoMood("surge"),this.notifications.show("Demo: Ebb into Sudden Surge Drop Test!",2800,"info")):e==="surge"?(this.audioEngine.setDemoMood("dynamic"),this.notifications.show("Demo: Dynamic Progression Cycle",2800,"info")):(this.audioEngine.stop(),this.audioEngine.selectDevice(this.settings.selectedDeviceId),this.notifications.show("Demo Off: Returning to Microphone",2800,"info"))}adjustColorTempBias(e,i=!1){if(i)this.settings.colorTempBias=0;else{const n=this.settings.colorTempBias??0;this.settings.colorTempBias=Math.max(-1,Math.min(1,Math.round((n+e)*100)/100))}this.saveSettings(),this.settingsModal.updateValues(this.settings);const t=this.settings.colorTempBias;t>.04?this.notifications.show(`Color Temp Filter: +${Math.round(t*100)}% Warm 🔥`,2e3,"info"):t<-.04?this.notifications.show(`Color Temp Filter: ${Math.round(t*100)}% Cool ❄`,2e3,"info"):this.notifications.show("Color Temp Filter: Neutral (Auto Harmonic) ⚪",2e3,"info")}toggleFullscreen(){document.fullscreenElement?document.exitFullscreen().catch(e=>console.warn("Exit fullscreen error:",e)):document.documentElement.requestFullscreen().catch(e=>console.warn("Fullscreen error:",e))}handleResize(){const e=window.innerWidth,i=window.innerHeight;this.canvas.style.width=`${e}px`,this.canvas.style.height=`${i}px`,this.renderer&&this.renderer.resize(e,i)}resetCursorTimer(){document.body.classList.remove("cursor-hidden"),this.cursorTimer!==null&&window.clearTimeout(this.cursorTimer),this.cursorTimer=window.setTimeout(()=>{!this.settingsModal.getIsOpen()&&!this.deviceModal.getIsOpen()&&document.body.classList.add("cursor-hidden")},2e3)}bindWindowEvents(){window.addEventListener("resize",()=>this.handleResize()),window.addEventListener("mousemove",()=>this.resetCursorTimer()),window.addEventListener("keydown",()=>this.resetCursorTimer()),window.addEventListener("touchstart",()=>this.resetCursorTimer()),this.resetCursorTimer(),document.addEventListener("visibilitychange",()=>{document.visibilityState==="visible"&&this.audioEngine.resume()}),window.addEventListener("keydown",e=>{const i=e.target?.tagName;if(i==="INPUT"||i==="SELECT"||i==="TEXTAREA"){e.key==="Escape"&&e.target.blur();return}const t=e.key.toUpperCase();e.key==="0"?this.setPreset("auto"):e.key==="1"?this.setPreset("ink"):e.key==="2"?this.setPreset("lava"):e.key==="3"?this.setPreset("aurora"):e.key==="4"?this.setPreset("neon"):e.key==="5"?this.setPreset("ocean"):t==="H"?(e.preventDefault(),this.settingsModal.toggle()):t==="D"?(e.preventDefault(),this.deviceModal.toggle()):t==="T"?(e.preventDefault(),this.audioEngine.captureTabAudio()):t==="B"?(e.preventDefault(),this.debugOverlay.toggle()):t==="F"?(e.preventDefault(),this.toggleFullscreen()):t==="M"?(e.preventDefault(),this.cycleDemoMode()):t==="S"?(e.preventDefault(),this.mediaCapture.takeScreenshot()):t==="R"?(e.preventDefault(),this.mediaCapture.toggleRecording()):e.key==="["?(e.preventDefault(),this.adjustColorTempBias(-.25)):e.key==="]"?(e.preventDefault(),this.adjustColorTempBias(.25)):t==="N"?(e.preventDefault(),this.adjustColorTempBias(0,!0)):e.key==="Escape"&&(this.settingsModal.hide(),this.deviceModal.hide())})}}window.addEventListener("DOMContentLoaded",()=>{new Ys});
