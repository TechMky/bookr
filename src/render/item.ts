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

    itemHtmlNode.innerHTML = `<img src="${item.screenshot}" class="pointer-none"><h3 class="pointer-none">${item.title}</h3>`

    return itemHtmlNode;
}

exports.loadItems = function (container: HTMLElement){
    this.storedItems = JSON.parse(localStorage.getItem(STORED_ITEMS_KEY))
    this.storedItems.forEach((item: Item) => {
        container.appendChild(this.getItemHTML(item))
    })
}



exports.handleItemClick = function (e: MouseEvent) {

    const target = <Element> e.target

    if (target && target.matches('.item')) {

        document.querySelectorAll('.items .selected')[0].classList.remove('selected')   
        target.classList.add('selected')
    }

}

exports.selectItem = function (direction: string) {

    const currentItem: any = <Element> document.getElementsByClassName('item selected')[0]

    if (direction === 'ArrowUp' && currentItem.previousSibling) {
        currentItem.classList.remove('selected');
        currentItem.previousSibling.classList.add('selected');
    }else if (direction === 'ArrowDown' && currentItem.nextSibling){
        currentItem.classList.remove('selected');
        currentItem.nextSibling.classList.add('selected');
    }

}
