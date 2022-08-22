const noteDateJson = localStorage.getItem('notes') || [];
let descriptions = JSON.parse(noteDateJson);

window.addEventListener('unload', () => {
   const noteDateJson = JSON.stringify(descriptions);
   localStorage.setItem('notes', noteDateJson);
});

function createWrapper(childs = [], cssClass = []) {
   const div = document.createElement('div');
   div.classList.add(...cssClass);
   div.append(...childs);

   return div;
}
function createElement(type, attributes = {}, cssClass = [], text) {
   const element = document.createElement(type);
   for (let attributeType in attributes) {
      element.setAttribute(attributeType, attributes[attributeType]);
   }
   element.classList.add(...cssClass);
   element.innerText = text;

   return element;
}
function createButton(label, cssClass = []) {
   const button = document.createElement('button');
   button.classList.add(...cssClass);
   button.innerText = label;

   return button;
}

function createHeader() {
   //create elems
   let notesDelete = createButton('Delete All', ['btn_header_del']);
   let noteAdd = createButton('Add', ['btn_header_add']);
   let noteEnter = createElement(
      'input',
      {
         type: 'text',
         placeholder: 'enter todo...',
      },
      ['input_header']
   );

   //event

   noteAdd.addEventListener('click', () => {
      let noteText = noteEnter.value;

      if (noteText.length === 0) {
         return;
      }
      descriptions.push({
         noteText,
         id: crypto.randomUUID(),
         isChecked: false,
      });

      updateNotesList(descriptions, notes);

      noteEnter.value = '';
   });

   notesDelete.addEventListener('click', () => {
      let deleteNote = document.querySelector('.notes');
      while (deleteNote.firstChild) {
         deleteNote.firstChild.remove();
      }

      let noteText = document.querySelector('.text_note');
      descriptions.push(noteText);
      updateNotesList((descriptions = []), notes);
   });

   const header = createWrapper([notesDelete, noteEnter, noteAdd], ['header']);

   return header;
}

function createNote(task) {
   //create elems

   let checkElem = createElement(
      'input',
      {
         type: 'checkbox',
         // id: 'checkbox',
      },
      ['input_note']
   );

   let noteText = createElement('p', {}, ['text_note'], task.noteText);

   let noteDelete = createButton('X', ['note_btn_del']);

   let getCurrentDate = () => {
      return `${new Date().getDate()}.${
         new Date().getMonth() + 1
      }.${new Date().getFullYear()}`;
   };

   let noteDate = getCurrentDate();

   // create wrappers

   let wrapDate = createWrapper([noteDate], ['note_btn_date']);

   let textWrapp = createWrapper([noteText], ['text_note']);

   let btnWrapp = createWrapper([noteDelete, wrapDate], ['note_wrapper_btn']);

   let note = createWrapper([checkElem, textWrapp, btnWrapp], ['note']);
   note.id = task.id;

   note.onclick = function (event) {
      let target = event.target;

      if (target === noteDelete) {
         let n = 0;
         let k = 0;
         noteDelete.parentElement.parentElement.remove();

         for (const iterator of descriptions) {
            for (let key in iterator) {
               if (
                  iterator[key] ===
                  noteDelete.parentElement.previousElementSibling.innerText
               ) {
                  k = n;
               }
               n++;
            }
            descriptions.splice(k, 1);
         }
      }

      if (target === checkElem) {
         task.isChecked = target.checked;

         if (target.checked) {
            note.classList.add('note_active');
            noteText.classList.add('text_active');
         } else {
            note.classList.remove('note_active');
            noteText.classList.remove('text_active');
         }
      }
   };

   if (note.isChecked === true) {
      note.classList.toggle('note_active');
      noteText.classList.toggle('text_active');
   }

   return note;
}

function updateNotesList(data = [], wrap) {
   let notes = data.map((task) => createNote(task));
   wrap.innerHTML = '';
   wrap.append(...notes);

   return wrap;
}

let notes = createWrapper([], ['notes']);

let wrapper = createWrapper(
   [createHeader(), updateNotesList(descriptions, notes)],
   ['wrapper']
);

let root = document.getElementById('root');
root.classList.add('container');
root.append(wrapper);
