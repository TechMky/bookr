const config = {
    "packagerConfig": {},
    "makers": [
        {
            "name": "@electron-forge/maker-squirrel",
            "config": (arch) => {
               
                return {
                    name: 'bookr',
                    authors: 'Yashasvi Sinha',
                    // exe: 'electron-fiddle.exe',
                    // iconUrl: 'https://raw.githubusercontent.com/electron/fiddle/0119f0ce697f5ff7dec4fe51f17620c78cfd488b/assets/icons/fiddle.ico',
                    // loadingGif: './assets/loading.gif',
                    noMsi: true,
                    remoteReleases: '',
                    // setupExe: `electron-fiddle-${version}-${arch}-setup.exe`,
                    // setupIcon: path.resolve(iconDir, 'fiddle.ico'),
                    certificatePassword: "525245", //process.env.WINDOWS_CERTIFICATE_PASSWORD,
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