<template>
    <v-container id="tree" class="pl-1" :style="getTreeStyle()">
        <v-text-field
            prepend-inner-icon="search"
            v-model="search"
            class="pa-3"
            label="Search"
            dark
            flat
            solo-inverted
            hide-details
            clearable
            clear-icon="mdi-close-circle-outline"
        ></v-text-field>
        <v-divider class="pb-2"></v-divider>
        <v-treeview
            id="treemenu"
            v-model="tree"
            :open="open"
            :active="active"
            active-class="tree-active"
            :items="items"
            activatable
            item-key="name"
            item-text="name"
            open-on-click
            return-object
            :search="search"
            :filter="filter"
            
        >
            <!-- <template slot="prepend" slot-scope="{ item, open }"> -->
            <template v-slot:prepend="{ item, open }">
                <v-icon v-if="!item.ext" :class="item.children.length ? 'pl-2' : ''">
                    {{ item.children.length ? open ? 'mdi-folder-open' : 'mdi-folder' : 'mdi-folder-outline' }}
                </v-icon>
                <v-icon v-else >
                    {{ supportedExts.includes(item.ext) ? extIcons[item.ext] : extIcons.unknown }}
                </v-icon>
            </template>
        </v-treeview>
        <v-divider class="my-2"></v-divider>
    </v-container>
</template>

<script>
// const fs = require('fs');
// const path = require('path');

export default {
    name: 'filetree',
    data: () => ({
        valid: false,
        open: [],
        active: [],
        caseSensitive: false,
        fsError: [
            'NO_ERROR','ERR_UNKNOWN','ERR_INVALID_PARAMS','ERR_NOT_FOUND','ERR_CANT_READ','ERR_UNSUPPORTED_ENCODING','ERR_CANT_WRITE','ERR_OUT_OF_SPACE','ERR_NOT_FILE','ERR_NOT_DIRECTORY','ERR_FILE_EXISTS'
        ],
        ignores: [
            '.git', 
            'Adobe After Effects Auto-Save',
            'node_modules'
        ],
        search: null,
        rx: {
            fileExt: /\.[\w]*$/,
            lastFolder: /\/[^\/]*(\/)?$/,
        },
        supportedExts: [
            'html',
            'js',
            'jsx',
            'gitignore',
            'ai',
            'ico',
            'gif',
            'psd',
            'aep',
            'prproj',
            'json',
            'babelrc',
            'eslintignore',
            'editorconfig',
            'css',
            'md',
            'pdf',
            'png',
            'txt',
            'xls',
            'pkf',
            'wav',
            'mp3',
            'ssml',
            'vue',
            'xml',
            'debug',
            'nojekyll',
            'ts',
            'sesx',
            'npmignore',
            'browserslistrc',
            'yml',
        ],
        extIcons: {
            unknown: 'mdi-file-question',
            html: 'mdi-language-html5',
            jsx: 'mdi-nodejs',
            js: 'mdi-nodejs',
            gitignore: 'mdi-file-cancel',
            debug: 'mdi-file-search',
            ai: 'mdi-file-image',
            ico: 'mdi-file-image',
            gif: 'mdi-file-video',
            psd: 'mdi-file-image',
            aep: 'mdi-file-video',
            prproj: 'mdi-file-video',
            json: 'mdi-json',
            babelrc: 'mdi-nodejs',
            eslintignore: 'mdi-nodejs',
            editorconfig: 'mdi-nodejs',
            css: 'mdi-language-css3',
            md: 'mdi-markdown',
            xml: 'mdi-json',
            pdf: 'mdi-file-pdf',
            png: 'mdi-file-image',
            txt: 'mdi-file-document-outline',
            xls: 'mdi-file-excel',
            pkf: 'mdi-file-music',
            wav: 'mdi-file-music',
            mp3: 'mdi-file-music',
            vue: 'mdi-vuejs',
            nojekyll: 'mdi-file-nodejs',
            ts: 'mdi-language-typescript',
            sesx: 'mdi-file-music',
            ssml: 'mdi-file-music',
            npmignore: 'mdi-file-cancel',
            browserslistrc: 'mdi-web',
            yml: 'mdi-web',
        },
        tree: [],
        items: [],
        // fake: [
        //     {
        //         name: 'Root',
        //         elt: null,
        //         active: false,
        //         children: [
        //             {
        //                 name: '.git',
        //                 elt: null,
        //                 active: false,
        //             },
        //             {
        //                 name: 'node_modules',
        //                 elt: null,
        //                 active: false,
        //             },
        //             {
        //                 name: 'public',
        //                 elt: null,
        //                 active: false,
        //                 children: [
        //                     {
        //                         name: 'static',
        //                         elt: null,
        //                         active: false,
        //                         children: [
        //                             {
        //                                 name: 'logo.png',
        //                                 elt: null,
        //                                 active: false,
        //                                 ext: 'png'
        //                             }
        //                         ]
        //                     },
        //                     {
        //                         name: 'favicon.ico',
        //                         elt: null,
        //                         active: false,
        //                         ext: 'png'
        //                     },
        //                     {
        //                         name: 'index.html',
        //                         elt: null,
        //                         active: false,
        //                         ext: 'html'
        //                     }
        //                 ]
        //             },
        //             {
        //                 name: '.gitignore',
        //                 elt: null,
        //                 active: false,
        //                 ext: 'txt'
        //             },
        //             {
        //                 name: 'babel.config.js',
        //                 elt: null,
        //                 active: false,
        //                 ext: 'js'
        //             },
        //             {
        //                 name: 'package.json',
        //                 elt: null,
        //                 active: false,
        //                 ext: 'json'
        //             },
        //             {
        //                 name: 'README.md',
        //                 elt: null,
        //                 active: false,
        //                 ext: 'md'
        //             },
        //             {
        //                 name: 'vue.config.js',
        //                 elt: null,
        //                 active: false,
        //                 ext: 'js'
        //             },
        //             {
        //                 name: 'yarn.lock',
        //                 elt: null,
        //                 active: false,
        //                 ext: 'txt'
        //             }
        //         ]
        //     }
        // ]
    }),
    watch: {
        valid(state) {
            if (state)
                this.readDir(this.app.input.realoutput)
        }
    },
    computed: {
        app() {
            return this.$root.$children[0];
        },
        filter() {
            return this.caseSensitive
            ? (item, search, textKey) => item[textKey].indexOf(search) > -1
            : undefined
        },
        branches() {
            return document.querySelectorAll('.v-treeview-node');
        }
    },
    mounted() {
        console.log('Mounted');
        this.app.treemenu = this;

    },
    methods: {
        filewalker(dir, done) {
            let results = [];
            
        },
        getTreeStyle() {
            // font-size: 20px;
            return `
            `
        },
        readDir(path) {
            console.log(`Path to ${path}`)
            const self = this;
            let folder = window.cep.fs.readdir(path);
            if (!folder.err)
                this.items.push(
                    {
                        name: path.match(self.rx.lastFolder)[0].split('\/').join(''),
                        children: self.buildTreeForDisplay(folder.data, [], path),
                        active: false,
                        elt: null,
                    },
                );
            else
                console.log(`Error #${folder.err}`)
        },
        buildTreeBranch(data, master, rootpath) {

        },
        buildTreeForDisplay(data, master, rootpath) {
            console.log(`Master has ${master.length}`)
            console.log(`Root path is ${rootpath}`)
            console.log(data);
            let mirror = [];
            data.forEach(entry => {
                if (!this.ignores.includes(entry)) {
                    // let name;
                    // if (/\s/.test(entry))
                    //     name = entry.split(' ').join('\_')
                    // else
                    //     name = entry;
                    let result = {
                        name: entry,
                        elt: null,
                        active: false,
                    };
                    if (!window.cep.fs.readdir(rootpath + entry).err) {
                        result.children = this.buildTreeForDisplay(window.cep.fs.readdir(rootpath + entry).data, mirror, rootpath + entry)
                    } else {
                        // if (/adobe\safter\seffects\sauto\-save/i.test(entry)) {
                        //     let checker = window.cep.fs.readdir(rootpath + entry);
                        // }
                        if (this.rx.fileExt.test(entry)) {
                            result.ext = entry.match(this.rx.fileExt)[0].replace('\.', '');

                        } else {
                            console.log(`${entry} is probably a folder:`)
                            let errorMsg = this.fsError[window.cep.fs.readdir(rootpath + entry).err];
                            if (!/\/$/.test(rootpath)) {
                                result.children = this.buildTreeForDisplay(window.cep.fs.readdir(`${rootpath}/${entry}`).data, mirror, `${rootpath}/${entry}`)
                            }
                            console.log(`${rootpath + entry} ? ${errorMsg}`)

                        }
                        
                    }
    
                    mirror.push(result);
                }
            })
            console.log(mirror);
            return mirror;
        },
        buildEltForSelection() {
            console.log('Build selection');
            // Could scan for open via clientHeight, and label via innerText
            console.log(this.items)
            let branches = document.querySelectorAll('.v-treeview-node');
            console.log(branches)
        }
    }
}
</script>

<style>
.theme--light.v-icon {
  color: var(--color-main);
}

#treemenu .v-icon {
    /* padding-left: 6px; */
    font-size: 14px;
}

#tree .v-input__slot, #tree .v-input__control {
    min-height: 0px;
}

#searchBar {
    border: 2px solid red;
}

#searchBar .v-input__slot {
    min-height: 0px;
}

.v-treeview-node__label {
    color: var(--color-main);
    font-size: 1rem;
    /* font-weight: 300; */
}

.tree-active {
    background-color: var(--color-dark)
}

.v-treeview-node__root {
    height: 28px;
    min-height: 0px;
    padding-left: 6px;
}

.theme--dark.v-text-field--solo-inverted.v-text-field--solo > .v-input__control > .v-input__slot {
    background-color: var(--color-input-idle);
    border: 1.35px solid var(--color-border);
    border-radius: 20px;
}

.theme--dark.v-text-field--solo-inverted.v-text-field--solo.v-input--is-focused > .v-input__control > .v-input__slot {
    border: 1.35px solid var(--color-selection);
    border-radius: 20px;
}


</style>
