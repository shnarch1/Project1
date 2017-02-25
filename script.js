/**
 * Created by avi on 09/02/17.
 */

//var form = document.querySelector("div");
//console.dir(form);

var config = {
    trash_icon_url:'http://www.endlessicons.com/wp-content/uploads/2012/12/trash-icon-614x460.png',
    note_iamge:'notebg.png'
}

var form = document.querySelector("#input-container form");
form.addEventListener("submit",save_note);

var my_notes = [];

window.onload = sync_storage();

function Note(text, date, time, id) {
    this._id = id;
    this.text = text;
    this.date = date;
    this.time = time;
};

function sync_storage(){
    var notes_backup = localStorage.getItem("notes_backup");
    if (notes_backup !=null){
        my_notes = JSON.parse(notes_backup);
    }
    console.dir(my_notes);
};

function add_and_backup_note(new_note){
    my_notes.push(new_note);
    localStorage.setItem("notes_backup",JSON.stringify(my_notes))
};



function save_note(event){
    event.preventDefault();
    var text = document.querySelector("#text-input > textarea");
    var date = document.querySelector("#date_input > input");
    var time = document.querySelector("#time_input > input");

    new_note = new Note(text.value, date.value, time.value, new Date().getTime());

    add_and_backup_note(new_note);
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
};

function createParagraphElement(text, class_name) {
    var p_tag = createElement("p", class_name);
    p_tag.textContent = text;
    return p_tag;
};

function createNoteElement(text, date, time){
    var note = createElement("div", "note");
    var note_img = createImageElement(config.note_iamge);
    var trash_icon = createImageElement(config.trash_icon_url, "note-trash-icon");
    var p = createParagraphElement(text, "note-text");

    note.appendChild(trash_icon);
    note.appendChild(note_img);
    note.appendChild(p);

    return note;
};

//var p = createParagraphElement("avi is here", "note-text")
//console.dir(p);

var note = createNoteElement("Hi, Avi is here!");
//console.dir(note);
section = document.querySelector("#notes-container")
section.appendChild(note);

//var p = createElement("p","note-text")
//document.body.appendChild(p)
//var p2 = createParagraphElement("p2","note-text" )
//document.body.appendChild(p2)
//console.dir(p2)