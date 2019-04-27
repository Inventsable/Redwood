<template>
    <div></div>
</template>

<script>
export default {
    data: () => ({

    }),
    methods: {
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
    }
}
</script>
