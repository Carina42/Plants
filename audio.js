let audioCtx, masterGain, rustleGain;
let rustleSource = null;
let musicOscillators = [];
let initialized = false;

export async function initAudio() {
    if (initialized) return;
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    masterGain = audioCtx.createGain();
    masterGain.gain.value = 0.4;
    masterGain.connect(audioCtx.destination);
    
    rustleGain = audioCtx.createGain();
    rustleGain.gain.value = 0;
    rustleGain.connect(masterGain);
    
    startClassicalMusic();
    initialized = true;
    window._audioInitialized = true;
}

function startClassicalMusic() {
    const notes = [293.66,329.63,349.23,392,349.23,329.63,293.66,
                   261.63,293.66,329.63,349.23,392,349.23,329.63,
                   293.66,349.23,440,392,349.23,329.63,293.66,
                   261.63,293.66,329.63,293.66,261.63,246.94,220];
    const dur = 1.2;
    let idx = 0;
    function playNext() {
        if (!initialized) return;
        musicOscillators.forEach(o => { try{o.stop()}catch(e){} });
        musicOscillators = [];
        const freq = notes[idx % notes.length];
        const osc = audioCtx.createOscillator();
        osc.type = 'triangle';
        osc.frequency.value = freq;
        const env = audioCtx.createGain();
        env.gain.setValueAtTime(0, audioCtx.currentTime);
        env.gain.linearRampToValueAtTime(0.08, audioCtx.currentTime+0.05);
        env.gain.linearRampToValueAtTime(0, audioCtx.currentTime+dur);
        osc.connect(env).connect(masterGain);
        osc.start(); osc.stop(audioCtx.currentTime+dur+0.1);
        musicOscillators.push(osc);
        idx++;
        setTimeout(playNext, dur*1000);
    }
    playNext();
}

export function getAudioContext() {
    return {
        playRustle: (vol=0.6) => {
            if (!audioCtx) return;
            stopRustle();
            const bufferSize = audioCtx.sampleRate*2;
            const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i=0; i<bufferSize; i++) data[i] = (Math.random()*2-1)*0.5;
            const noise = audioCtx.createBufferSource();
            noise.buffer = buffer;
            noise.loop = true;
            const hp = audioCtx.createBiquadFilter();
            hp.type = 'highpass'; hp.frequency.value = 800;
            const lp = audioCtx.createBiquadFilter();
            lp.type = 'lowpass'; lp.frequency.value = 4000;
            noise.connect(hp); hp.connect(lp); lp.connect(rustleGain);
            rustleGain.gain.setValueAtTime(vol*0.12, audioCtx.currentTime);
            noise.start();
            rustleSource = { source: noise, filters: [hp,lp] };
        },
        stopRustle: () => {
            if (rustleSource) {
                try { rustleSource.source.stop(); } catch(e) {}
                rustleSource = null;
            }
            if (rustleGain) rustleGain.gain.setValueAtTime(0, audioCtx.currentTime);
        },
        setRustleVolume: (vol) => {
            if (rustleGain) rustleGain.gain.setValueAtTime(vol*0.12, audioCtx.currentTime);
        },
        isInitialized: initialized
    };
}

function stopRustle() {
    if (rustleSource) { try{rustleSource.source.stop()}catch(e){} rustleSource=null; }
}