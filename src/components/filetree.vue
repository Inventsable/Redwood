<template>
    <v-container id="treemenu" class="pl-1" :style="getTreeStyle()">
        <v-divider class="pb-2"></v-divider>
        <v-treeview
            v-model="tree"
            :open="open"
            :active="active"
            active-class="tree-active"
            :items="items"
            activatable
            item-key="name"
            open-on-click
        >
            <template slot="prepend" slot-scope="{ item, open }">
                <v-icon v-if="!item.file" class="pl-2">
                    {{ open ? 'mdi-folder-open' : 'mdi-folder' }}
                </v-icon>
                <v-icon v-else >
                    {{ files[item.file] }}
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
        files: {
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
                children: [
                    {
                        name: '.git'
                    },
                    {
                        name: 'node_modules'
                    },
                    {
                        name: 'public',
                        children: [
                            {
                                name: 'static',
                                children: [
                                    {
                                        name: 'logo.png',
                                        file: 'png'
                                    }
                                ]
                            },
                            {
                                name: 'favicon.ico',
                                file: 'png'
                            },
                            {
                                name: 'index.html',
                                file: 'html'
                            }
                        ]
                    },
                    {
                        name: '.gitignore',
                        file: 'txt'
                    },
                    {
                        name: 'babel.config.js',
                        file: 'js'
                    },
                    {
                        name: 'package.json',
                        file: 'json'
                    },
                    {
                        name: 'README.md',
                        file: 'md'
                    },
                    {
                        name: 'vue.config.js',
                        file: 'js'
                    },
                    {
                        name: 'yarn.lock',
                        file: 'txt'
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
            let folder = window.cep.fs.readdir(path);
            console.log(folder)
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
</style>
