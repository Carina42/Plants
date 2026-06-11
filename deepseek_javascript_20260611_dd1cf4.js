export function loadAllNotes() {
    ['dalloway-rose','septimus-elm','burton-carnation'].forEach(id => {
        const note = localStorage.getItem(`notes_${id}`);
        if (note) console.log(`📝 已加载 ${id} 笔记`);
    });
}

export function saveNote(caseId, content) {
    localStorage.setItem(`notes_${caseId}`, content);
}

export function getNote(caseId) {
    return localStorage.getItem(`notes_${caseId}`) || '';
}