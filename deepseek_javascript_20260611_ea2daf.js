import { initScene, getSceneObjects } from './scene.js';
import { createAllPlants } from './particles.js';
import { initAudio, getAudioContext } from './audio.js';
import { setupInteraction } from './interaction.js';
import { initCaseDetail, getCaseData } from './case-detail.js';
import { loadAllNotes } from './storage.js';

let currentCaseId = 'dalloway-rose';
let grammarphoneStop = null;

async function initApp() {
    const sceneObjects = await initScene();
    const plants = createAllPlants(sceneObjects.scene);
    sceneObjects.plants = plants;

    setupInteraction(sceneObjects, handlePlantClick);
    initCaseDetail();       // 绑定案卷切换、笔记保存
    loadAllNotes();         // 预加载存储的笔记

    setupAudioInit();
    setupTitleBar();
    window.addEventListener('resize', sceneObjects.onResize);
}

function handlePlantClick(plantType) {
    // 映射植物类型到案件ID
    const caseMap = { rose: 'dalloway-rose', elm: 'septimus-elm', carnation: 'burton-carnation' };
    const caseId = caseMap[plantType];
    if (caseId) {
        openCaseOverlay(caseId);
    }
}

function openCaseOverlay(caseId) {
    const overlay = document.getElementById('case-overlay');
    overlay.classList.add('case-overlay--active');
    document.getElementById('hint-bar').style.opacity = '0';
    
    // 切换到对应标签
    const tabs = document.querySelectorAll('.case-tab');
    tabs.forEach(tab => tab.classList.remove('active'));
    const activeTab = document.querySelector(`.case-tab[data-case="${caseId}"]`);
    if (activeTab) activeTab.classList.add('active');
    
    // 更新案件内容
    updateCaseContent(caseId);
    currentCaseId = caseId;
}

function updateCaseContent(caseId) {
    const data = getCaseData(caseId);
    if (!data) return;
    
    document.getElementById('meta-location').textContent = data.location;
    document.getElementById('meta-witness').textContent = data.witness;
    document.getElementById('evidence-desc').textContent = data.desc;
    document.getElementById('case-title').textContent = data.title || '案件卷宗';
    
    // 重置留声机
    stopGramophone();
    document.getElementById('testimony-content').textContent = '（审讯室里十分安静。点击上方按钮，留声机将开始沙沙作响……）';
    document.getElementById('gramophone-status').textContent = '留声机发条已上紧';
    
    // 加载笔记
    const notes = localStorage.getItem(`notes_${caseId}`) || '';
    document.getElementById('case-notes').value = notes;
    document.getElementById('archive-display').textContent = notes || '（该案卷尚无归档笔记。在上方输入并点击归档后，笔记将永久陈列于此。）';
    
    setupGramophone(data.testimony);
}

function setupGramophone(testimonyText) {
    const playBtn = document.getElementById('gramophone-play');
    const stopBtn = document.getElementById('gramophone-stop');
    const disc = document.getElementById('gramophone-disc');
    const status = document.getElementById('gramophone-status');
    const volumeSlider = document.getElementById('gramophone-volume');
    
    let isPlaying = false;
    let typingTimer;
    let speechSynth = null;
    
    function stopPlayback() {
        isPlaying = false;
        disc.classList.remove('gramophone__disc--spinning');
        playBtn.disabled = false;
        stopBtn.disabled = true;
        if (speechSynth && window.speechSynthesis) window.speechSynthesis.cancel();
        const audio = getAudioContext();
        if (audio && audio.stopRustle) audio.stopRustle();
        clearTimeout(typingTimer);
        document.getElementById('testimony-content').classList.remove('typing');
    }
    
    playBtn.onclick = () => {
        if (isPlaying) return;
        isPlaying = true;
        disc.classList.add('gramophone__disc--spinning');
        playBtn.disabled = true;
        stopBtn.disabled = false;
        status.textContent = '针尖划过历史的暗流……';
        
        const audio = getAudioContext();
        if (audio && audio.playRustle) audio.playRustle(volumeSlider.value / 100);
        
        // Web Speech API 朗读（如果可用）
        if ('speechSynthesis' in window) {
            speechSynth = new SpeechSynthesisUtterance(testimonyText);
            speechSynth.lang = 'zh-CN';
            speechSynth.rate = 0.85;
            speechSynth.volume = volumeSlider.value / 100;
            speechSynth.onend = stopPlayback;
            window.speechSynthesis.speak(speechSynth);
        }
        
        // 同时进行打字机效果
        const box = document.getElementById('testimony-content');
        box.textContent = '';
        box.classList.add('typing');
        let i = 0;
        function type() {
            if (i < testimonyText.length && isPlaying) {
                box.textContent += testimonyText.charAt(i);
                i++;
                typingTimer = setTimeout(type, 25 + Math.random() * 35);
            } else if (i >= testimonyText.length) {
                stopPlayback();
                status.textContent = '证词读取完毕。';
            }
        }
        type();
    };
    
    stopBtn.onclick = stopPlayback;
    volumeSlider.oninput = () => {
        const vol = volumeSlider.value / 100;
        if (speechSynth) speechSynth.volume = vol;
        const audio = getAudioContext();
        if (audio && audio.setRustleVolume) audio.setRustleVolume(vol);
    };
    
    grammarphoneStop = stopPlayback;
}

function stopGramophone() {
    if (grammarphoneStop) grammarphoneStop();
}

function closeCaseOverlay() {
    const overlay = document.getElementById('case-overlay');
    overlay.classList.remove('case-overlay--active');
    document.getElementById('hint-bar').style.opacity = '1';
    stopGramophone();
}

function setupTitleBar() {
    const bar = document.getElementById('title-bar');
    bar.addEventListener('click', () => bar.classList.toggle('title-bar--collapsed'));
}

function setupAudioInit() {
    const prompt = document.getElementById('audio-prompt');
    document.getElementById('audio-init-btn').addEventListener('click', async () => {
        await initAudio();
        prompt.classList.add('audio-prompt--hidden');
    });
    // 5秒后若未初始化则半透明显示
    setTimeout(() => { if (!getAudioContext().isInitialized) prompt.style.opacity = '0.8'; }, 5000);
}

// 绑定关闭事件
document.getElementById('case-close').addEventListener('click', closeCaseOverlay);
document.querySelector('.case-overlay__backdrop').addEventListener('click', closeCaseOverlay);
document.getElementById('back-to-desk').addEventListener('click', closeCaseOverlay);

// 案卷标签切换
document.querySelectorAll('.case-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        const caseId = tab.dataset.case;
        updateCaseContent(caseId);
        document.querySelectorAll('.case-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
    });
});

// 笔记自动保存与显示
const notesArea = document.getElementById('case-notes');
notesArea.addEventListener('input', () => {
    const note = notesArea.value;
    localStorage.setItem(`notes_${currentCaseId}`, note);
    document.getElementById('archive-display').textContent = note || '（该案卷尚无归档笔记）';
    document.getElementById('notes-saved-indicator').classList.add('notes-saved--visible');
    setTimeout(() => document.getElementById('notes-saved-indicator').classList.remove('notes-saved--visible'), 2000);
});

window.closeCaseOverlay = closeCaseOverlay;
document.addEventListener('DOMContentLoaded', initApp);