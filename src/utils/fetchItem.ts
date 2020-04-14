import { BrowserWindow, NativeImage } from "electron";
let offScreenWindow: BrowserWindow = null;

export interface Item {
    url: string,
    screenshot: string,
    title: string,
}

export async function fetchItem(itemUrl: string){

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
    
    return item;
}