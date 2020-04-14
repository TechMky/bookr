import './index.css';
import { ipcRenderer } from "electron";

const showModal: HTMLElement = document.getElementById('show-modal');
const closeModal: HTMLButtonElement = <HTMLButtonElement>document.getElementById('close-modal');
const modalWindow: HTMLElement = document.getElementById('modal');
const inputUrl: HTMLInputElement = <HTMLInputElement>document.getElementById('url');
const addItem: HTMLButtonElement = <HTMLButtonElement>document.getElementById('add-item');

const toggleAddItemButton = () => {

    if (addItem.disabled === true) {
        addItem.disabled = false;
        addItem.innerText = 'Add Item'
        addItem.style.opacity = '1';
        closeModal.style.display = 'flex';
    } else {
        addItem.disabled = true;
        addItem.innerText = 'Adding...'
        addItem.style.opacity = '0.5';
        closeModal.style.display = 'none';
    }
}

showModal.addEventListener('click', e => {
    modalWindow.style.display = 'flex';
    inputUrl.value = "";
    inputUrl.focus();
});

closeModal.addEventListener('click', e => {
    modalWindow.style.display = 'none';
})

//keyboard enter press
inputUrl.addEventListener('keyup', e => {
    if (e.key === 'Enter') {
        addItem.click();
    }
})

//adding an item
addItem.addEventListener('click', e => {
    
    //validate the input url
    if (inputUrl.value.length === 0) {
        //open a dialog here
        return;
    }
    //disable the button
    toggleAddItemButton()

    ipcRenderer.send('new-item', inputUrl.value);

})

ipcRenderer.on('new-item-success', (e, item) => {
    //enable the button
    toggleAddItemButton()
    inputUrl.value = "";
    inputUrl.focus();
})
