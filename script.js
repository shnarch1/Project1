/**
 * Created by avi on 09/02/17.
 */

//var form = document.querySelector("div");
//console.dir(form);

var config = {
    trash_icon_url:'http://www.endlessicons.com/wp-content/uploads/2012/12/trash-icon-614x460.png',
    note_iamge:'notebg.png'
};

var form = document.querySelector("#input-container > form");
form.addEventListener("submit",saveNote);

ta = document.querySelector("textarea")
ta.addEventListener("invalid", test);

function test(){
    console.log("alert");
}

var trash_icon = document.querySelector(".note-trash-icon")
trash_icon.addEventListener("click",deleteNote)
var my_notes = [];

window.onload = function() {
    syncListAndBackup()
    printAllNotesFromList();
};


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

//function add_and_backup_note(new_note){
//    my_notes.push(new_note);
//   localStorage.setItem("notes_backup",JSON.stringify(my_notes))
//};


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

function createNoteElement(text, date, time){
    var note = createElement("div", "note");
    var note_img = createImageElement(config.note_iamge, "note-img");
    var trash_icon = createImageElement(config.trash_icon_url, "note-trash-icon");
    var note_text = createParagraphElement(text, "note-text");
    var note_date = createParagraphElement(date, "note-date");
    var note_time = createParagraphElement(time, "note-time");
    note.appendChild(note_img);
    note.appendChild(trash_icon);
    note.appendChild(note_text);
    note.appendChild(note_date);
    note.appendChild(note_time);

    return note;
}


function setNoteElementID(dom_object, note_id){
    dom_object.note_id = note_id;
}

function createNoteObject(text, date, time){
    var new_note = new Note(text, date, time, new Date().getTime());
    return new_note;
}

function addNoteToList(new_note){
    my_notes.push(new_note);
}

function removeNoteFromList(note){
    for(var i =0; i<my_notes.length; i++){
        if (my_notes[i]._id == note.note_id){
            my_notes.splice(i,1);
            return true;
        }
    }
}

function backupNotesList(){
    localStorage.setItem("notes_backup",JSON.stringify(my_notes))
}

function printNote(note_element){

    notes_container = document.querySelector("#notes-container");
    notes_container.appendChild(note_element);
    note_element.className += " note-fade-in";

}

function printAllNotesFromList(){
    for(var i = 0; i < my_notes.length; i++){
        note_element = createNoteElement(my_notes[i].text, my_notes[i].date, my_notes[i].time);
        setNoteElementID(note_element, my_notes[i]._id);
        note_element.querySelector(".note-trash-icon").addEventListener("click",deleteNote);
    
        printNote(note_element);
    }
}

function removeNoteFromScreen(note){
    notes_container = note.parentNode;
    notes_container.removeChild(note);
}

function saveNote(event){
    
    event.preventDefault();

    var text = document.querySelector("#input-text");
    var date = document.querySelector("#input-date");
    var time = document.querySelector("#input-time");

    if (text.value == null){
        error_msg = createParagraphElement("Please fill all the fields in the form");
        form.appendChild(error_msg); 
    }

    //console.log(text.value);
    //console.log(date.value);
    //console.log(time.value);

    new_note_object = createNoteObject(text.value, date.value, time.value);
    //console.dir(new_note);
    addNoteToList(new_note_object);
    //console.dir(my_notes);
    backupNotesList();

    new_note_element = createNoteElement(new_note_object.text, new_note_object.date, new_note_object.time);
    setNoteElementID(new_note_element, new_note_object._id);
    //console.log(new_note_element);
    new_note_element.querySelector(".note-trash-icon").addEventListener("click",deleteNote);
    
    printNote(new_note_element);

    text.value = null;
    time.value = null;
    date.value = null;
}

function deleteNote(event){
    
    note_to_delete = event.target.parentNode;
    removeNoteFromList(note_to_delete);
    removeNoteFromScreen(note_to_delete);
    backupNotesList();
}


//var p = createParagraphElement("avi is here", "note-text")
//console.dir(p);

//var note = createNoteElement("Hi, Avi is here!");
//console.dir(note);
//section = document.querySelector("#notes-container")
//section.appendChild(note);

//var p = createElement("p","note-text")
//document.body.appendChild(p)
//var p2 = createParagraphElement("p2","note-text" )
//document.body.appendChild(p2)
//console.dir(p2)
