<template>
    <div></div>
</template>

<script>
export default {
    name: 'stylizer',
    data: () => ({
        theme: null,
    }),
    computed: {
        app() {
            return this.$root.$children[0];
        },
        parent() {
            return this.app.$refs.mainscreen;
        }
    },
    created() {
        console.log('Hello?')
        console.log('Where are you?')
    },
    mounted() {
        this.init();
    },
    methods: {
        init() {
            console.log('Stylizer mounted');
            this.app.csInterface.addEventListener(this.app.csInterface.THEME_COLOR_CHANGED_EVENT, this.appThemeChanged);
            this.appThemeChanged();
        },
        appThemeChanged(event) {
            const skinInfo = JSON.parse(window.__adobe_cep__.getHostEnvironment()).appSkinInfo;
            this.findTheme(skinInfo);
        },
        findTheme(appSkin) {
            console.log(appSkin)
            if (this.app.csInterface.hostEnvironment.appName !== 'AEFT') {
                if (appSkin.panelBackgroundColor.color.red > 230)
                    this.theme = 'lightest';
                else if (appSkin.panelBackgroundColor.color.red > 170)
                    this.theme = 'light';
                else if (appSkin.panelBackgroundColor.color.red > 80)
                    this.theme = 'dark';
                else
                    this.theme = 'darkest';
                this.assignTheme();
                // this.$root.updateStorage();
            } else {
                this.setGradientTheme(appSkin);
            }
        },
        assignTheme() {
            let app = this.$root.activeApp;
            //  this.$root.activeTheme;
            console.log('Assigning theme...')
            // for (var i = 0; i < this.cssOrder.length; i++) {
            //     let prop = this.cssOrder[i], value = this.styleList[app][theme][i];
            //     if (!/width|radius/.test(prop)) {
            //     this.$root.setCSS(`color-${prop}`, value);
            //     } else {
            //     this.$root.setCSS(prop, value);
            //     }
            // }
        },
        setGradientTheme(appSkin) {
            console.log('After Effects style changed.');
            this.setCSS('color-bg', this.toHex(appSkin.panelBackgroundColor.color));
            this.setCSS('color-icon', this.toHex(appSkin.panelBackgroundColor.color, 30));
            this.setCSS('color-button-disabled', this.toHex(appSkin.panelBackgroundColor.color, 20));
            this.setCSS('color-scrollbar', this.toHex(appSkin.panelBackgroundColor.color, -20));
            this.setCSS('color-scrollbar-thumb', this.toHex(appSkin.panelBackgroundColor.color, 5));
            this.setCSS('color-scrollbar-thumb-hover', this.toHex(appSkin.panelBackgroundColor.color, 10));
        },
        getCSS(prop) {
            return window.getComputedStyle(document.documentElement).getPropertyValue('--' + prop);
        },
        setCSS(prop, data) {
            document.documentElement.style.setProperty('--' + prop, data);
        },
        toHex(color, delta) {
            console.log(color)
            function computeValue(value, delta) {
                var computedValue = !isNaN(delta) ? value + delta : value;
                if (computedValue < 0) {
                    computedValue = 0;
                } else if (computedValue > 255) {
                    computedValue = 255;
                }

                computedValue = Math.round(computedValue).toString(16);
                return computedValue.length == 1 ? "0" + computedValue : computedValue;
            }

            var hex = "";
            if (color) {
                // with (color) {
                    hex = computeValue(color.red, delta) + computeValue(color.green, delta) + computeValue(color.blue, delta);
                // };
            }
            return "#" + hex;
        }
    }
}
</script>
