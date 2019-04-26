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
            :open.sync="open"
            :active.sync="active"
            active-class="tree-active"
            :items="items"
            activatable
            item-key="pen"
            @update:active="updateActiveBranches()"
            item-text="name"
            open-on-click
            return-object
            :search="search"
            :filter="filter"
            
        >
            <!-- <template slot="prepend" slot-scope="{ item, open }"> -->
            <template v-slot:prepend="{ item, open }">
                <v-icon v-if="!item.ext" :class="item.children.length ? 'pl-2' : ''"  >
                    {{ item.children.length ? open ? 'mdi-folder-open' : 'mdi-folder' : 'mdi-folder-outline' }}
                </v-icon>
                <v-icon v-else>
                    {{ supportedExts.includes(item.ext) ? extIcons[item.ext] : extIcons.unknown }}
                </v-icon>
            </template>
            <!-- <template v-slot:label="{ item, open }">
                <div style="cursor:pointer;">
                    {{item.name}}
                </div>
            </template> -->
            <template v-slot:append="{ item, open }" >
                <div class="pr-4" 
                    @mouseenter="item.hover = true;"
                    @mouseleave="item.hover = false;"
                    >
                    <v-btn icon 
                        v-show="item.children && item.hover"
                        v-for="action in getActions(item)" :key="item.path + action.name"
                        @click.stop @click="doAction(item, action)"
                        >
                        <v-icon>
                            {{action.icon}}
                        </v-icon>
                    </v-btn>
                    <v-btn icon 
                        v-show="!item.children"
                        v-for="action in getActions(item)" :key="action.name"
                        @click.stop @click="doAction(item, action)"
                        >
                        <v-icon>
                            {{action.icon}}
                        </v-icon>
                    </v-btn>
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
            console.log(`Open is ${this.open.length} ? ${this.autobranches.length}`)
            if (this.open.length !== this.branches.length) {
                setTimeout(() => {
                    this.buildMissingElts();
                }, 50);
            }
        },
        active(list) {
            console.log('Active is now:')
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
        console.log('Mounted');
        this.app.treemenu = this;

    },
    methods: {
        doAction(item, action) {
            console.log(`Do ${action.name} on ${item.path}`);
        },
        getActions(item) {
            let result = [];
            if (item.children) {
                result.push({
                    icon: 'save',
                    name: 'quicksave'
                })
            } else if (item.ext == 'ai') {
                result.push({
                    icon: 'save_alt',
                    name: 'export',
                })
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
        buildMissingElts() {
            console.log('Build missing elts');
            // Could scan for open via clientHeight, and label via innerText
            let branches = document.querySelectorAll('.v-treeview-node');
            console.log(`${branches.length} are visible`)
            const self = this;
            let mirror = [], result = null;
            branches.forEach(elt => {
                let name = elt.innerText.match(/[^\s]*/)[0], parentName = null, gParentName = null, ggParentName = null;
                if (elt.parentElement.classList.contains('v-treeview-node__children')) {
                    parentName = elt.parentElement.parentElement.children[0].children[1].children[1].innerText;
                    if (!elt.parentElement.parentElement.parentElement.classList.contains('v-treeview')) {
                        gParentName = elt.parentElement.parentElement.parentElement.parentElement.children[0].children[1].children[1].innerText;
                        if (!elt.parentElement.parentElement.parentElement.parentElement.parentElement.classList.contains('v-treeview')) {
                            ggParentName = elt.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.children[0].children[1].children[1].innerText;
                        }
                    }
                }
                // console.log()
                result = self.findInTree(ggParentName, gParentName, parentName, name, this.items, elt.innerHTML);
                // console.log(elt.innerHTML)
                mirror.push(elt.innerHTML);
            })
            console.log(this.items);
            console.log(mirror);
            this.convertElts(mirror);
        },
        findInTreeByHTML(rawhtml, list) {
            list.forEach(item => {
                if (item.elt == rawhtml)
                    return item;
                else if (item.children && item.children.length)
                    this.findInTreeByHTML(rawhtml, item.children);
            })
        },
        convertElts(list) {
            let branches = document.querySelectorAll('.v-treeview-node');
            branches.forEach((elt, index) => {
                if (elt.innerHTML == list[index]) {
                    console.log('----')
                    console.log(`Match found at:`)
                    console.log(elt);
                    let result = this.findInTreeByHTML(list[index], this.items);

                    console.log(result);
                    console.log('----')
                }
            })
        },
        findInTree(ggParentName, gParentName, parentName, name, list, elt) {
            let branches = document.querySelectorAll('.v-treeview-node');
            list.forEach(item => {
                if (ggParentName) {
                    if (item.name == ggParentName) {
                        item.children.forEach(child => {
                            if (child.children && child.children.length) {
                                child.children.forEach(grandchild => {
                                    if (grandchild.children && grandchild.children.length) {
                                        grandchild.children.forEach(greatgrandchild => {
                                            if (greatgrandchild.name == name) {
                                                console.log(`Found greatgranchild ${name} at ${greatgrandchild.depth}:${greatgrandchild.index}`);
                                                if (!greatgrandchild.elt)
                                                    greatgrandchild.elt = elt;
                                                return greatgrandchild;
                                            }
                                        })
                                    }
                                })
                            }
                        })
                    } else if (item.children) {
                        if (item.children.length) {
                            this.findInTree(ggParentName, gParentName, parentName, name, item.children);
                        }
                    }
                } else if (gParentName) {
                    if (item.name == gParentName) {
                        item.children.forEach(child => {
                            if (child.children && child.children.length) {
                                child.children.forEach(grandchild => {
                                    if (grandchild.name == name) {
                                        console.log(`Found granchild ${name} at ${grandchild.depth}:${grandchild.index}`);
                                        if (!grandchild.elt)
                                            grandchild.elt = elt;
                                        return grandchild;
                                    }
                                })
                            }
                        })
                    } else if (item.children) {
                        if (item.children.length) {
                            this.findInTree(ggParentName, gParentName, parentName, name, item.children);
                        }
                    }
                } else {
                    if (item.name == parentName) {
                        item.children.forEach(child => {
                            if (child.name == name) {
                                console.log(`Found ${name} at ${child.depth}:${child.index}`);
                                if (!child.elt)
                                    child.elt = elt;
                                return child;
                            }
                        })
                    } else if (item.children) {
                        if (item.children.length) {
                            this.findInTree(ggParentName, gParentName, parentName, name, item.children);
                        }
                    }
                }
            })
        },
        updateActiveBranches() {
            console.log('Tree updated')
        },
        checkItem(item) {
            console.log(`Checking ${item.name}`)
        },
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
            // console.log('Should be done')
            // setTimeout(() => {
            //     this.buildEltForSelection();
            // }, 1000);
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
                            // console.log(`${entry} is probably a folder:`)
                            let errorMsg = this.fsError[window.cep.fs.readdir(rootpath + entry).err];
                            if (!/\/$/.test(rootpath)) {
                                result.children = this.buildTreeForDisplay(window.cep.fs.readdir(`${rootpath}/${entry}`).data, mirror, `${rootpath}/${entry}`, index, depth, id)
                                result.path = `${rootpath}/${entry}`;
                            }
                            // console.log(`${rootpath + entry} ? ${errorMsg}`)
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
