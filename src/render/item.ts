import { BrowserWindow, NativeImage, dialog, shell } from "electron";
import { Item } from "./item.interface";
let offScreenWindow: BrowserWindow = null;
const STORED_ITEMS_KEY: string = 'stored-items'
export const storedItems:Array<Item> = []

export async function fetchItem (itemUrl: string): Promise<Item>{
    offScreenWindow = new BrowserWindow({
        width: 500,
        height: 500,
        show: false,
        webPreferences: {
            
            offscreen: true,
            nodeIntegration: false
        }
    })

    //if everything is fine then error will be false and incase of error value will be true
    //this is done as loadURL returns a Promise<void>
    let error: boolean  = await offScreenWindow.loadURL(itemUrl).then(() => false).catch((err: Error) => {
        dialog.showErrorBox('Error', err.message);
        return true;
    });

    if (error) return null;

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
export function addItem (newItem:Item, container: HTMLElement, isNewItem: Boolean = false) {
    
    
    container.appendChild(this.getItemHTML(newItem));
    
    if (isNewItem == true) {
        this.storedItems.push(newItem);

        localStorage.setItem(STORED_ITEMS_KEY, JSON.stringify(this.storedItems));
    }
}

export function getItemHTML (item:Item) : HTMLElement{
    const itemHtmlNode: HTMLDivElement = document.createElement('div')

    itemHtmlNode.classList.add('item')

    itemHtmlNode.setAttribute('data-url', item.url)

    itemHtmlNode.innerHTML = `<img src="${item.screenshot}" class="pointer-none"><h3 class="pointer-none">${item.title}</h3>`

    return itemHtmlNode;
}

export function loadItems (container: HTMLElement){
    this.storedItems = JSON.parse(localStorage.getItem(STORED_ITEMS_KEY))
    this.storedItems.forEach((item: Item) => {
        container.appendChild(this.getItemHTML(item))
    })
}



export function handleItemClick (e: MouseEvent) {

    const target = <Element> e.target

    if (target && target.matches('.item')) {

        document.querySelectorAll('.items .selected')[0].classList.remove('selected')   
        target.classList.add('selected')
    }

}

export function selectItem (direction: string) {

    const currentItem: any = <Element> document.getElementsByClassName('item selected')[0]

    if (direction === 'ArrowUp' && currentItem.previousSibling) {
        currentItem.classList.remove('selected');
        currentItem.previousSibling.classList.add('selected');
    }else if (direction === 'ArrowDown' && currentItem.nextSibling){
        currentItem.classList.remove('selected');
        currentItem.nextSibling.classList.add('selected');
    }

}

export function handleItemDblClick(e: MouseEvent) {
    
    const selectedItem: HTMLDivElement = <HTMLDivElement> document.getElementsByClassName('item selected')[0]

    open(selectedItem.dataset.url);
}

/**
 * Open a URL into OS default browser
 * @param url string
 */
export function open(url:string) {

    shell.openExternal(url)
}