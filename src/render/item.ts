import { BrowserWindow, NativeImage } from "electron";
import { Item } from "./item.interface";
let offScreenWindow: BrowserWindow = null;
const STORED_ITEMS_KEY: string = 'stored-items'
exports.storedItems = []

exports.fetchItem = async function (itemUrl: string){

    offScreenWindow = new BrowserWindow({
        width: 500,
        height: 500,
        show: false,
        webPreferences: {
            
            offscreen: true,
            nodeIntegration: false
        }
    })

    await offScreenWindow.loadURL(itemUrl);

    const screenshot: NativeImage = await offScreenWindow.capturePage();

    const item: Item = {
        url: itemUrl,
        screenshot: screenshot.toDataURL(),
        title: offScreenWindow.getTitle()
    }

    offScreenWindow.close();
    offScreenWindow = null;
    
    return item;
}

//add item to DOM
exports.addItem = function (newItem:Item, container: HTMLElement, isNewItem: Boolean = false) {
    
    
    container.appendChild(this.getItemHTML(newItem));
    
    if (isNewItem == true) {
        this.storedItems.push(newItem);

        localStorage.setItem(STORED_ITEMS_KEY, JSON.stringify(this.storedItems));
    }
}

exports.getItemHTML = function (item:Item) : HTMLElement{
    const itemHtmlNode: HTMLDivElement = document.createElement('div')

    itemHtmlNode.classList.add('item')

    itemHtmlNode.innerHTML = `<img src="${item.screenshot}"><h3>${item.title}</h3>`

    return itemHtmlNode;
}

exports.loadItems = function (container: HTMLElement){
    this.storedItems = JSON.parse(localStorage.getItem(STORED_ITEMS_KEY))
    this.storedItems.forEach((item: Item) => {
        container.appendChild(this.getItemHTML(item))
    })
}

