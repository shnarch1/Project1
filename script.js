/**
 * Created by avi on 09/02/17.
 */

//var form = document.querySelector("div");
//console.dir(form);



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