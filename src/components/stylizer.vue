<template>
    <div></div>
</template>

<script>
export default {
    name: 'stylizer',
    data: () => ({
        theme: null,
        isMounted: false,
    }),
    computed: {
        app() {
            return this.$root.$children[0];
        },
        parent() {
            return this.app.$refs.mainscreen;
        }
    },
    mounted() {
        // this.init();
    },
    methods: {
        init() {
            if (!this.isMounted) {
                console.log('Stylizer mounted');
                this.app.csInterface.addEventListener('com.adobe.csxs.events.ThemeColorChanged', this.appThemeChanged);
                this.appThemeChanged();
                this.isMounted = true;
                console.log(this);
            }
        },
        appThemeChanged(event) {
            const skinInfo = JSON.parse(window.__adobe_cep__.getHostEnvironment()).appSkinInfo;
            this.findTheme(skinInfo);
        },
        findTheme(appSkin) {
            console.log(appSkin)
            if (this.app.appName !== 'AEFT') {
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
            } else if (this.app.appName == 'AEFT') {
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
            console.log('Assigning colors to After Effects UI gradient');
            this.app.setCSS('color-bg', this.toHex(appSkin.panelBackgroundColor.color), -10);
            this.app.setCSS('color-dark', this.toHex(appSkin.panelBackgroundColor.color), -15);
            this.app.setCSS('color-input-idle', this.toHex(appSkin.panelBackgroundColor.color, -12));
            this.app.setCSS('color-icon', this.toHex(appSkin.panelBackgroundColor.color, 30));
            this.app.setCSS('color-button-disabled', this.toHex(appSkin.panelBackgroundColor.color, 20));
            this.app.setCSS('color-scrollbar', this.toHex(appSkin.panelBackgroundColor.color, -5));
            this.app.setCSS('color-scrollbar-thumb', this.toHex(appSkin.panelBackgroundColor.color, 18));
            this.app.setCSS('color-scrollbar-thumb-hover', this.toHex(appSkin.panelBackgroundColor.color, 35));

            this.app.setCSS('input-border-radius', '5px');
        },
        toHex(color, delta) {
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
                hex = computeValue(color.red, delta) + computeValue(color.green, delta) + computeValue(color.blue, delta);
            }
            return "#" + hex;
        }
    }
}
</script>
