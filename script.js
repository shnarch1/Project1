
var config = {
    trash_icon_url:'https://maxcdn.icons8.com/Android/PNG/24/Editing/delete-24.png',
    note_iamge:'notebg.png'
};

var my_notes = new Object;

var form = document.querySelector("#input-container > form");
form.addEventListener("submit",saveNote);

var textarea = document.querySelector("textarea");
textarea.addEventListener("invalid", popErrorMsg);

var date_input = document.querySelector("#input-date");
date_input.addEventListener("invalid", popErrorMsg);

var time_input = document.querySelector("#input-time");
time_input.addEventListener("invalid", popErrorMsg);

window.setInterval(autoDraft, 5000);

syncListAndBackup();
printAllNotesFromList();
loadDraft();

/*window.onload = function() {
    syncListAndBackup();
    printAllNotesFromList();
    loadDraft();
}*/

function autoDraft(){
    var draft = new Object;
    draft.text  = textarea.value;
    draft.date = date_input.value;
    draft.time = time_input.value;

    localStorage.setItem("draft", JSON.stringify(draft));
}

function loadDraft(){
    var draft = JSON.parse(localStorage.getItem("draft"));
    textarea.value = draft.text;
    date_input.value = draft.date;
    time_input.value = draft.time;
}

function popErrorMsg(e){
    var err_msg = document.querySelector("#err-msg");
    err_msg.style.display = "block";
}

function removeErrorMsg(e){
    var err_msg = document.querySelector("#err-msg");
    err_msg.style.display = "none";
}

function isErrorMSg(){
    var err_msg = document.querySelector("#err-msg");
    if (err_msg.style.display != "none"){
        return true;
    }
    else return false;
}

function isPast(time, date){

    var splited_time = time.split(":");
    var now = new Date();

    if (time != ""){
        date.setHours(parseInt(splited_time[0]), parseInt(splited_time[1]));
    }
    //console.log(date);
    //console.log(now);
    if (now > date){
        return true;
    }
    else
        return false;
}


function Note(text, date, time, id) {
    this._id = id;
    this.text = text;
    this.date = date;
    this.time = time;
}

function syncListAndBackup(){
    var notes_backup = localStorage.getItem("notes_backup");
    if (notes_backup != null){
        my_notes = JSON.parse(notes_backup);
    }
}

function createElement(tag_name, class_name){
    var element = document.createElement(tag_name);
    if  (class_name != null){
        element.classList.add(class_name);
    }
    return element;
}

function createImageElement(src, class_name){
    var img = createElement("img", class_name);
    img.src=src;
    return img;
}

function createParagraphElement(text, class_name) {
    var p_tag = createElement("p", class_name);
    p_tag.textContent = text;
    return p_tag;
}

function createNoteDOMElement(text, date, time) {
    var note = createElement("div", "note");
    var note_inner = createElement("div", "note-inner");
    var btn_container = createElement("div", "btn-container");
    var btn = createElement("button", "trash-btn");
    var trash_icon = createImageElement(config.trash_icon_url);
    var note_text = createParagraphElement(text, "note-text");
    var note_date = createParagraphElement(date, "note-date");
    var note_time = createParagraphElement(time, "note-time");

    btn.addEventListener("click",deleteNote);

    btn.appendChild(trash_icon);
    btn_container.appendChild(btn);
    note_inner.appendChild(btn_container);
    note_inner.appendChild(note_text);
    note_inner.appendChild(note_date);
    note_inner.appendChild(note_time);
    note.appendChild(note_inner);

    return note;
}

function setNoteElementID(dom_object, note_id){
    dom_object.setAttribute('data-note-id',note_id);
}

function createNoteObject(text, date, time){
    var new_note = new Note(text, date, time, new Date().getTime());
    return new_note;
}

function addNoteToList(new_note){
    my_notes[new_note._id] = new_note;
}

function removeNoteFromList(note){
    delete my_notes[note.dataset.noteId];
}

function backupNotesList(){
    localStorage.setItem("notes_backup",JSON.stringify(my_notes));
}

function printNote(note_element){

    notes_container = document.querySelector("#notes-container");
    notes_container.appendChild(note_element);
    setTimeout(function(){ note_element.classList.add("note-fade-in"); }, 100);

}


function printAllNotesFromList(){
    for (note_id in my_notes){
        note_element = createNoteDOMElement(my_notes[note_id].text, my_notes[note_id].date, my_notes[note_id].time);
        setNoteElementID(note_element, note_id);
        printNote(note_element);
    }
}

function removeNoteFromScreen(note){
    notes_container = note.parentNode;
    note.classList.remove("note-fade-in")
    setTimeout(function(){ notes_container.removeChild(note); }, 1000);
}

function saveNote(event){
    
    event.preventDefault();

    var text = document.querySelector("#input-text");
    var date = document.querySelector("#input-date");
    var time = document.querySelector("#input-time");

    if (isPast(time.value,date.valueAsDate)){
        popErrorMsg();
        return false;
    }

    new_note_object = createNoteObject(text.value, date.value, time.value);
    addNoteToList(new_note_object);
    backupNotesList();

    new_note_element = createNoteDOMElement(new_note_object.text, new_note_object.date, new_note_object.time);
    setNoteElementID(new_note_element, new_note_object._id);
    
    printNote(new_note_element);

    text.value = null;
    time.value = null;
    date.value = null;

    if(isErrorMSg()){
        removeErrorMsg();
    }
}

function findParentNodeByClassName(dom_object, class_name){
    while(dom_object.className.split(" ").indexOf(class_name) < 0){
        dom_object = dom_object.parentNode;
    }

    return dom_object;
}

function deleteNote(event){

    note_to_delete = findParentNodeByClassName(event.target, "note");
    removeNoteFromList(note_to_delete);
    removeNoteFromScreen(note_to_delete);
    backupNotesList();
}

