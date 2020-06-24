import './index.scss';
import { ipcRenderer } from "electron";
import { remote } from "electron";
import { Item } from './item.interface';
const $ = require('jquery');
require('popper.js')
require('bootstrap')
require('./menu')
const isUrl = require("is-valid-http-url");
import * as ItemHandler from "./item";

const showModal: HTMLElement = document.getElementById('show-modal');
const closeModal: HTMLButtonElement = <HTMLButtonElement>document.getElementById('close-modal');
const modalWindow: HTMLElement = document.getElementById('modal');
const inputUrl: HTMLInputElement = <HTMLInputElement>document.getElementById('url');
const addItemButton: HTMLButtonElement = <HTMLButtonElement>document.getElementById('add-item');
const itemsContainer: JQuery = $('#items');
const searchBar: HTMLInputElement = <HTMLInputElement> document.getElementById('search');

//these functions are used in menu items as keyboard shortcuts
export function addNewItem() {
    showModal.click()
}
document.addEventListener('readystatechange', e => {
    if (document.readyState === 'complete') {
        ItemHandler.loadItems(itemsContainer);

        if (ItemHandler.storedItems.length > 0) {
            document.querySelectorAll('.item')[0].classList.add('selected')
        }
    }
})

const toggleAddItemButton = () => {

    if (addItemButton.disabled === true) {
        addItemButton.disabled = false;
        addItemButton.innerText = 'Add Item'
        addItemButton.style.opacity = '1';
        closeModal.style.display = 'flex';
    } else {
        addItemButton.disabled = true;
        addItemButton.innerText = 'Adding...'
        addItemButton.style.opacity = '0.5';
        closeModal.style.display = 'none';
    }
}

searchBar.addEventListener('keyup', e => {
    const length = $('div.item').length
    const searchQuery = searchBar.value;
    const itemsArray: Array<HTMLDivElement> = Array.from(document.querySelectorAll('.item'))

    itemsArray.forEach(item => {
        
        const hasMatch: boolean = item.innerText.toLowerCase().includes(searchQuery)

        item.style.display = hasMatch ? 'flex': 'none'

    })
})

//dblclick listener for opening a new window to show content
itemsContainer.on('dblclick', '.item', null, ItemHandler.handleItemDblClick)

// // single click selection handler
itemsContainer.on('click', '.item', ItemHandler.handleItemClick)

itemsContainer.on('click', '.delete', ItemHandler.handleDeleteItemClick)

// up & down arrow key navigation for items
document.addEventListener('keydown', e => {
    
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        ItemHandler.selectItem(e.key)
        return;
    }

    //trigger the double click event if pressed enter on the container
    if (e.key === 'Enter') {

        //if modal is not closed then do not open the a new window to read item
        if (modalWindow.classList.contains('show') == true) return

        $(itemsContainer).find('.selected').trigger('dblclick')
    }
})

showModal.addEventListener('click', e => {
    $(modalWindow).modal('show');
    inputUrl.value = "";
    inputUrl.focus();
});

closeModal.addEventListener('click', e => {
    $(modalWindow).modal('hide')
})

//keyboard enter press
inputUrl.addEventListener('keyup', e => {
    if (e.key === 'Enter') {
        addItemButton.click();
    }
})

//adding an item
addItemButton.addEventListener('click', e => {
    
    let url: string = inputUrl.value
    //return if value is empty
    if ( url.length === 0) return;

    //try to add http if not present
    if (url.startsWith('http') == false) {
        url = `https://${url}`
    }

    //finally validate if proper url
    if (isUrl(url) === false) {
        remote.dialog.showErrorBox('Error', "Please enter a valid URL");
        return;
    }

    //disable the button
    toggleAddItemButton()

    ipcRenderer.send('new-item', url);

})

ipcRenderer.on('new-item-success', (e: Electron.IpcRendererEvent, item: Item) => {
    
    //enable the button even undefined
    toggleAddItemButton()

    if (item == undefined) return;
    
    ItemHandler.addItem(item, itemsContainer, true);

    closeModal.click();
    
    inputUrl.value = "";
})
