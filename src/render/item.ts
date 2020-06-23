import { BrowserWindow, NativeImage, dialog, shell } from "electron";
import { Item } from "./item.interface";
const $ = require('jquery');
let offScreenWindow: BrowserWindow = null;
const STORED_ITEMS_KEY: string = 'stored-items'
export let storedItems:Array<Item> = []

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
        title: offScreenWindow.getTitle(),
        id: new Date().getTime()
    }

    offScreenWindow.close();
    offScreenWindow = null;
    
    return item;
}

//add item to DOM
export function addItem (newItem:Item, container: JQuery, isNewItem: Boolean = false) {
    
    
    container.append(this.getItemHTML(newItem));
    
    if (isNewItem == true) {
        this.storedItems.push(newItem);

        localStorage.setItem(STORED_ITEMS_KEY, JSON.stringify(this.storedItems));
    }
}

export function getItemHTML (item:Item) : string{

    const html = `
    <div class="card item shadow rounded-0 mb-1" data-url="${item.url}">
        <div class="row no-gutters">
            <div class="col-4 col-md-2">
                <img src="${item.screenshot}" class="card-img pl-1 img-fluid rounded-0" alt="...">
            </div>
            <div class="col-8 col-md-10">
                <div class="card-body h-100">
                    <div class="d-flex justify-content-between align-items-start">
                        <h5 class="card-title">${item.title}</h5>
                        <button class="btn btn-primary btn-sm delete" data-id='${item.id}'>X</button>
                    </div>
                    <p class="card-text d-none d-md-block">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
                    <p class="card-text"><small class="text-muted">Last updated 3 mins ago</small></p>
                </div>
            </div>
        </div>
    </div>
    `

    return html;
}

export function loadItems (container: JQuery){
    this.storedItems = JSON.parse(localStorage.getItem(STORED_ITEMS_KEY))

    if (!this.storedItems) {
        this.storedItems = []
    }
    this.storedItems.forEach((item: Item) => {
        $(container).append(this.getItemHTML(item))
    })
}



export function handleItemClick (e: JQuery.Event) {

    $('.item.selected').removeClass('selected')

    $(this).addClass('selected')

}

export function selectItem (direction: string) {

    const currentItem: JQuery = $('.item.selected')

    if (direction === 'ArrowUp' && currentItem.prev('.item').length > 0 ) {
        currentItem.removeClass('selected')
        currentItem.prev('.item').addClass('selected')
    }else if (direction === 'ArrowDown' && currentItem.next('.item').length > 0){
        currentItem.removeClass('selected')
        currentItem.next('.item').addClass('selected')
    }

}

export function handleItemDblClick(e: JQuery.Event) {
    
    const url: string = $(this).data('url');

    open(url);
}

export function handleDeleteItemClick(e: JQuery.Event) {
    e.stopPropagation();
    const id = $(this).data('id')
    
    $(this).parents('.card').siblings('.card').removeClass('selected')

    if ($(this).parents('.card').siblings('.card').prev().length > 0 ) {
        $(this).parents('.card').siblings('.card').prev().addClass('selected')    
    }else{
        $(this).parents('.card').siblings('.card').next().addClass('selected')    
    }
    
    $(this).parents('.card').remove()

    //store only those where id is not equal to delete id
    storedItems = storedItems.filter( item => item.id != id)
    
    //update local storage after delete
    localStorage.setItem(STORED_ITEMS_KEY, JSON.stringify(storedItems));
        
}

/**
 * Open a URL into OS default browser
 * @param url string
 */
export function open(url:string) {

    shell.openExternal(url)
}