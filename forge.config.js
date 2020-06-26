const path = require('path')

const iconDir = path.resolve(__dirname, 'src', 'images')

const config = {
    "packagerConfig": {
        "icon": path.resolve(iconDir, 'icon.icns')
    },
    "makers": [
        {
            "name": "@electron-forge/maker-squirrel",
            "config": (arch) => {
               
                return {
                    name: 'bookr',
                    authors: 'Yashasvi Sinha',
                    iconUrl: path.resolve(iconDir, 'icon.ico'),
                    setupIcon: path.resolve(iconDir, 'icon.ico'),
                    noMsi: true,
                    remoteReleases: '',
                    certificatePassword: process.env.WINDOWS_CERTIFICATE_PASSWORD,
                    certificateFile: "./private/bookr-certificate.pfx"
                }
            }
        },
        {
            "name": "@electron-forge/maker-zip",
            "platforms": [
                "darwin"
            ]
        },
        {
            "name": "@electron-forge/maker-deb",
            "config": {}
        },
        {
            "name": "@electron-forge/maker-rpm",
            "config": {}
        }
    ],
    "publishers": [
        {
            "name": "@electron-forge/publisher-github",
            "config": {
                "repository": {
                    "owner": "TechMky",
                    "name": "bookr",
                    "options": {
                        "protocol": "https",
                        "host": "api.github.com"
                    }
                },
                "draft": true
            }
        }
    ],
    "plugins": [
        [
            "@electron-forge/plugin-webpack",
            {
                "mainConfig": "./webpack.main.config.js",
                "renderer": {
                    "config": "./webpack.renderer.config.js",
                    "entryPoints": [
                        {
                            "html": "./src/render/index.html",
                            "js": "./src/render/renderer.ts",
                            "name": "main_window"
                        }
                    ]
                }
            }
        ]
    ]
}

module.exports = config;