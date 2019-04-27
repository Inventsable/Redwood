<template>
    <v-container id="tree" class="pl-1">
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
            :open.sync="open"
            :active.sync="active"
            active-class="tree-active"
            :items="items"
            activatable
            item-key="path"
            item-text="name"
            open-on-click
            :search="search"
            :filter="filter"
        >
            <template v-slot:prepend="{ item, open }">
                <!-- If a folder -->
                <v-icon v-if="!item.ext" 
                    :color="hasDocDescendent(item) ? 'amber lighten-3' : ''"
                    :class="item.children.length ? 'pl-2' : ''" 
                    >
                    {{ item.children.length ? open ? 'mdi-folder-open' : 'mdi-folder' : 'mdi-folder-outline' }}
                </v-icon>
                <!-- If a file -->
                <v-icon :color="item.path == doc.path ? 'amber lighten-3' : ''" v-else>
                    {{ supportedExts.includes(item.ext) ? extIcons[item.ext] : extIcons.unknown }}
                </v-icon>
            </template>
            <template v-slot:label="{ item, open }">
                <div

                    :class="hasDocDescendent(item) ? 'amber--text text--lighten-3' : item.path == doc.path ? 'amber--text text--lighten-3' : ''" 
                    style="cursor:pointer;">
                    {{item.name}}
                </div>
            </template>
            <template v-slot:append="{ item, open }" >
                <div class="pr-4" 
                    @mouseenter="item.hover = true;"
                    @mouseleave="item.hover = false;"
                    >
                    <!-- If a folder -->
                    <v-btn icon 
                        v-show="item.children && item.hover"
                        v-for="action in getActions(item)" :key="item.path + action.name"
                        @click.stop @click="doAction(item, action)"
                        >
                        <v-icon>
                            {{action.icon}}
                        </v-icon>
                    </v-btn>
                    <!-- If a file -->
                    <v-tooltip top v-for="action in getActions(item)" :key="action.name">
                        <template v-slot:activator="{ on }">
                            <v-btn icon 
                                v-on="on"
                                v-show="!item.children"
                                @click.stop @click="doAction(item, action)"
                                >
                                <v-icon :color="item.path == doc.path ? 'amber lighten-3' : ''">
                                    {{action.icon}}
                                </v-icon>
                            </v-btn>
                        </template>
                        <span>{{action.tooltip}}</span>
                    </v-tooltip>
                    
                </div>
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
        timers: [],
        itemLength: 0,
        dirLength: 0,
        doc: {
            path: null,
            name: null,
            parent: null,
        },
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
            'svg',
        ],
        extIcons: {
            unknown: 'mdi-file-question',
            html: 'mdi-language-html5',
            jsx: 'mdi-nodejs',
            js: 'mdi-nodejs',
            svg: 'mdi-svg',
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
        branches: [],
        penList: [],
    }),
    watch: {
        valid(state) {
            if (state) {
                this.readDir(this.app.input.realoutput)
                let logdata = window.cep.fs.writeFile(`${this.app.root}/public/logdata.json`, JSON.stringify(this.items))
                if (!logdata.err)
                    console.log(`Log written succesfully`)
            }
        },
        open(list) {
            console.log(list);
        },
        active(list) {
            console.log(list)
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
        autobranches() {
            return document.querySelectorAll('.v-treeview-node');
        }
    },
    mounted() {
        this.app.treemenu = this;
        if (this.app.appName == 'ILST') {
            this.callDoc();
            this.app.csInterface.addEventListener('documentAfterActivate', this.callDoc);
        }
        if (this.items.length) {
            console.log('Start sync');
        }
    },
    methods: {
        hasDocDescendent(item) {
            if (item.children && item.children.length) {
                let check = item.children.find(child => {
                    return child.path == this.doc.path;
                })
                if (check) {
                    return true;
                } else {
                    item.children.forEach(child => {
                        if (child.children && child.children.length) {
                            let childcheck = child.children.find(grandchild => {
                                return grandchild.path == this.doc.path;
                            })
                            if (childcheck)
                                return true;
                        }
                    })
                }
            }
        },
        callDoc() {
            console.log('Calling doc')
            this.app.csInterface.evalScript('thisDoc()', this.getDoc)
        },
        getDoc(msg) {
            if (!this.app.macOS) {
                if (/^\/c\//.test(msg)) {
                    msg = msg.replace(/^\/c\//, `C\:\/`);
                }
            }
            this.doc.path = msg;
        },
        doAction(item, action) {
            console.log(`Doing ${action.name} on ${item.path}`)
            if (action.name == 'addText') {
                // Read file contents first then pass contents
                let msg = window.cep.fs.readFile(item.path);
                if (!msg.err) {
                    let mirror = [];
                    console.log(msg)
                    // Sending file with newlines causes ESTK to ignore, so replace them
                    if (/(\r\n|\r|\n)/gm.test(msg.data)) {
                        msg.data = msg.data.split(/(\r\n|\r|\n)/);
                        msg.data.forEach(item => {
                            if (item.length > 2)
                                mirror.push(item);
                        })
                        this.app.csInterface.evalScript(`${action.name}('${mirror}')`);
                    } else {
                        this.app.csInterface.evalScript(`${action.name}('${msg.data}')`);
                    }
                }
            } else {

                this.app.csInterface.evalScript(`${action.name}('${item.path}')`);
            }
        },
        getActions(item) {
            let result = [];
            // If item is the current document in Application
            if (item.path == this.doc.path) {
                result.push({
                    icon: 'save',
                    name: 'exporter',
                    tooltip: 'Quick export this file'
                })
            } else {
                // If a folder
                if (item.children) {
                    result.push({
                        icon: 'save',
                        name: 'quicksave',
                        tooltip: 'Quicksave',
                    })
                // If a specific file type
                } else if (item.ext == 'ai') {
                    result.push({
                        icon: 'save_alt',
                        name: 'openDoc',
                        tooltip: 'Open document'
                    })
                } else if (item.ext == 'jsx') {
                    result.push({
                        icon: 'edit',
                        name: 'runScript',
                        tooltip: 'Run this script'
                    })
                }
                // If a linkable asset or text
                if (/svg|png|jpg/.test(item.ext)) {
                    result.push({
                        icon: 'mdi-image-plus',
                        name: 'addImage',
                        tooltip: 'Place image into document'
                    })
                } else if (/txt|md/.test(item.ext)) {
                    result.push({
                        icon: 'mdi-clipboard-text-play',
                        name: 'addText',
                        tooltip: 'Place text into document'
                    })
                }
                
            }
            return result;
        },
        getPEN() {
            return this.checkPEN(Math.floor(Math.random() * 16777215).toString(16));
        },
        checkPEN(color) {
            let found = this.penList.find(pen => {
                return pen == color;
            })
            if (!found) {
                this.penList.push(color)
                return color;
            } else {
                return this.getPEN();
            }
        },
        
        
        clearAllTimers() {
            this.timers.forEach(timer => {
                clearInterval(timer);
            })
            console.log('Cleared')
        },
        checkItemChildren(list, count) {
            if (list.length) {
                list.forEach(item => {
                    // console.log(item.name)
                    count++;
                    if (item.children && item.children.length) {
                        count = this.checkItemChildren(item.children, count);
                    }
                })
            }
            return count;
        },
        checkItemLength(count=0) {
            this.items.forEach(item => {
                count++;
                if (item.children && item.children.length) {
                    count = this.checkItemChildren(item.children, count);
                }
            })
            return count;
        },
        // !! Something is wrong -- yields over 19k instead of 70;

        syncDirLength(path) {
            const self = this;
            this.timers.push(setInterval(() => {
                self.dirLength = self.checkDirLength(-1);
                console.log(`${self.dirLength} ?== ${self.itemLength}`)
                if (self.dirLength !== self.itemLength) {
                    console.log(`Something has changed: dir length is ${self.dirLength} ?== item length is ${self.itemLength}`)
                    self.readDir(self.app.input.realoutput)
                    console.log(`Root has been reloaded`)
                }
            }, 2000))
        },
        checkDirChildren(list, root, count) {
            if (list) {
                list.forEach(item => {
                    count++;
                    if (!this.ignores.includes(item)) { 
                        if (!window.cep.fs.readdir(root + item).err) {
                            count = this.checkDirChildren(window.cep.fs.readdir(root + item).data, root + item, count);
                        } else {
                            if (!this.rx.fileExt.test(item)) {
                                if (!window.cep.fs.readdir(`${root}/${item}`).err)
                                    count = this.checkDirChildren(window.cep.fs.readdir(`${root}/${item}`).data, `${root}/${item}`, count);  
                            }
                        }
                    }
                })
            }
            return count;
        },
        checkDirLength(count) {
            const root = this.app.input.realoutput;
            let dirChildren = window.cep.fs.readdir(root);
            if (!dirChildren.err) {
                dirChildren.data.forEach(item => {
                    count++;
                    if (!this.ignores.includes(item)) {
                        if (!window.cep.fs.readdir(root + item).err) {
                            count = this.checkDirChildren(window.cep.fs.readdir(root + item).data, root + item, count);
                        } else {
                            if (!this.rx.fileExt.test(item)) {
                                if (!window.cep.fs.readdir(`${root}/${item}`).err)
                                    count = this.checkDirChildren(window.cep.fs.readdir(`${root}/${item}`).data, `${root}/${item}`, count);  
                            }
                        }
                    }
                })
            }
            return count;
        },
        readDir(path) {
            console.log(`Path to ${path}`)
            const self = this;
            let finder = this.items.find(root => {
                return root.path == path;
            })
            if (finder) {
                this.items = this.items.filter(root => {
                    return root !== finder;
                })
                console.log(`Cleared older version`)
            } else {
                console.log(`This is brand new`)
            }
            let folder = window.cep.fs.readdir(path);
            if (!folder.err)
                this.items.push(
                    {
                        name: path.match(self.rx.lastFolder)[0].split('\/').join(''),
                        path: path,
                        children: self.buildTreeForDisplay(folder.data, [], path, 0, 0, 0),
                        active: false,
                        hover: false,
                        elt: null,
                        index: 0,
                        depth: 0,
                        pen: this.getPEN(),
                    },
                );
            this.itemLength = this.checkItemLength(0);
            if (!this.timers.length)
                this.syncDirLength();
                
        },
        buildTreeForDisplay(data, master, rootpath, index, depth, id) {
            let mirror = [];
            depth++, index = 0;
            data.forEach(entry => {
                id++;
                if (!this.ignores.includes(entry)) {
                    // @@ BUG
                    // Paths with spaces yield error3: can't find
                    let result = {
                        name: entry,
                        elt: null,
                        uid: `${entry};${depth};${index}`,
                        path: null,
                        active: false,
                        hover: false,
                        pen: this.getPEN(),
                        index: index++,
                        depth: depth,
                    };
                    if (!window.cep.fs.readdir(rootpath + entry).err) {
                        result.children = this.buildTreeForDisplay(window.cep.fs.readdir(rootpath + entry).data, mirror, rootpath + entry, index, depth, id)
                        result.path = rootpath + entry;
                    } else {
                        if (this.rx.fileExt.test(entry)) {
                            result.ext = entry.match(this.rx.fileExt)[0].replace('\.', '');
                            if (!/\/$/.test(rootpath)) {
                                result.path = `${rootpath}/${entry}`;
                            } else {
                                result.path = rootpath + entry;
                            }
                        } else {
                            const errorMsg = this.fsError[window.cep.fs.readdir(rootpath + entry).err];
                            // console.log(`${rootpath + entry} ? ${errorMsg}`)
                            if (!/\/$/.test(rootpath)) {
                                result.children = this.buildTreeForDisplay(window.cep.fs.readdir(`${rootpath}/${entry}`).data, mirror, `${rootpath}/${entry}`, index, depth, id)
                                result.path = `${rootpath}/${entry}`;
                            }
                        }
                        
                    }
                    mirror.push(result);
                }
            })
            // console.log(mirror);
            return mirror;
        },
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
