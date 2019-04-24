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
                <v-icon v-if="!item.ext" class="pl-2">
                    {{ open ? 'mdi-folder-open' : 'mdi-folder' }}
                </v-icon>
                <v-icon v-else >
                    {{ extIcons[item.ext] }}
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
        open: ['Root', 'public', 'static'],
        active: ['logo.png'],
        caseSensitive: false,
        search: null,
        extIcons: {
            html: 'mdi-language-html5',
            js: 'mdi-nodejs',
            json: 'mdi-json',
            md: 'mdi-markdown',
            pdf: 'mdi-file-pdf',
            png: 'mdi-file-image',
            txt: 'mdi-file-document-outline',
            xls: 'mdi-file-excel'
        },
        tree: [],
        items: [
            {
                name: 'Root',
                elt: null,
                active: false,
                children: [
                    {
                        name: '.git',
                        elt: null,
                        active: false,
                    },
                    {
                        name: 'node_modules',
                        elt: null,
                        active: false,
                    },
                    {
                        name: 'public',
                        elt: null,
                        active: false,
                        children: [
                            {
                                name: 'static',
                                elt: null,
                                active: false,
                                children: [
                                    {
                                        name: 'logo.png',
                                        elt: null,
                                        active: false,
                                        ext: 'png'
                                    }
                                ]
                            },
                            {
                                name: 'favicon.ico',
                                elt: null,
                                active: false,
                                ext: 'png'
                            },
                            {
                                name: 'index.html',
                                elt: null,
                                active: false,
                                ext: 'html'
                            }
                        ]
                    },
                    {
                        name: '.gitignore',
                        elt: null,
                        active: false,
                        ext: 'txt'
                    },
                    {
                        name: 'babel.config.js',
                        elt: null,
                        active: false,
                        ext: 'js'
                    },
                    {
                        name: 'package.json',
                        elt: null,
                        active: false,
                        ext: 'json'
                    },
                    {
                        name: 'README.md',
                        elt: null,
                        active: false,
                        ext: 'md'
                    },
                    {
                        name: 'vue.config.js',
                        elt: null,
                        active: false,
                        ext: 'js'
                    },
                    {
                        name: 'yarn.lock',
                        elt: null,
                        active: false,
                        ext: 'txt'
                    }
                ]
            }
        ]
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
        filter () {
            return this.caseSensitive
            ? (item, search, textKey) => item[textKey].indexOf(search) > -1
            : undefined
            // return (item, search, textKey) => item[textKey].indexOf(search) > -1
        },
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
            let folder = window.cep.fs.readdir(path);
            console.log(folder.data);
            // console.log(this.tree);
            console.log(this.active);
            this.buildTree();
        },
        buildTree() {
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
