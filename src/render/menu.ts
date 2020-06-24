import { Menu, MenuItemConstructorOptions, remote } from "electron";
import { open } from "./item";
import { addNewItem } from "./renderer";
import $ from 'jquery';

const menuTemplate: Array<any> = [
    {
        label: "BookMark",
        submenu: [
            {
                label: "Add BookMark",
                click: () => { addNewItem() },
                accelerator: "CmdOrCtrl+O"
            },
            {
                label: "Open BookMark",
                accelerator: "Enter",
                click: () => {
                    //if modal is not closed then do not open the a new window to read item
                    if ($('#modal').hasClass('show') == true) return
                    
                    if ($('div.card.selected').length == 0) {
                        alert('No BookMark Selected')
                        return 
                    }
                    $('div.card.selected').trigger('dblclick')

                },
                toolTip: "Open the selected BookMark in default Web Browser"
            },
            {
                label: "Delete BookMark",
                accelerator: "Delete",
                click: () => {
                    $('div.card.selected').find('.delete').trigger('click')
                }
            },
            
        ]
    },
    {
        role: "editMenu"
    },
    {
        role: "windowMenu"
    },
    {
        role: "help",
        submenu: [
            {
                label: "Learn More",
                click: () => { open("https://github.com/TechMky/bookr") }
            },
            {
                type: "separator"
            },
            {
                role: "forceReload"
            },
            {
                role: "toggleDevTools"
            }
        ]
    }
]

if (process.platform === 'darwin') {

    const asd: MenuItemConstructorOptions = {
        label: remote.app.getName(),
        submenu: [
            {
                role: "about"
            },
            {
                type: "separator"
            },
            {
                role: 'services'
            },
            {
                type: 'separator'
            },
            {
                role: 'hide'
            },
            {
                role: "hideOthers"
            },
            {
                role: 'unhide'
            },
            {
                type: 'separator'
            },
            {
                role: 'quit'
            }

        ]
    }

    menuTemplate.unshift(asd)
}else{

    menuTemplate[0].submenu.push({
        type: "separator"
    })
    menuTemplate[0].submenu.push({
        role: 'quit'
    })
    
}


const menu: Menu = remote.Menu.buildFromTemplate( menuTemplate as MenuItemConstructorOptions[] );
remote.Menu.setApplicationMenu(menu)