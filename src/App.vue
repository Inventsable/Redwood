<template>
  <v-app dark >
    <notification ref="notification" :text="notificationText" :color="notificationColor" />
    <stylizer ref="stylizer" />
    <v-content :style="getContentStyle()">
      <router-view />
    </v-content>
    <!-- <loadingicon @done="doneLoading()" v-show="!isLoaded"/> -->
  </v-app>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import notification from './components/notification.vue'
import stylizer from './components/stylizer.vue'

export default {
  name: 'App',
  components: {
    HelloWorld,
    notification,
    stylizer,
  },
  computed: {
    storage() {
      return window.localStorage;
    },
    menuString() { return JSON.stringify(this.context); },
    localhost() {
      if (this.isLoaded) {
        const debug = window.cep.fs.readFile(`${this.csInterface.getSystemPath(SystemPath.EXTENSION)}/.debug`);
        const port = new RegExp(`\\<Host\\sName\\=\\"${this.csInterface.hostEnvironment.appName}\\"\\sPort\\=\\"(\\d*)`);
        return `http://localhost:${debug.data.match(port)[1]}`;
      }
    },
    
  },
  data: () => ({
    macOS: false,
    csInterface: null,
    root: null,
    treemenu: null,
    input: null,
    rootLocation: null,
    lastRoute: null,
    isLoaded: false,
    hasNotification: false,
    notificationText: 'Extension is mounted',
    notificationColor: 'primary',
    context: {
      menu: [
        { id: "refresh", label: "Refresh panel", enabled: true, checkable: false, checked: false, },
        { label: "---" },
        { id: "localhost", label: "Launch debug", enabled: true, checkable: false, checked: false, },
      ]
    }
  }),
  created() {
    // console.log('App is created');
  },
  mounted() {
    console.clear();
    if (navigator.platform.indexOf('Win') > -1) { this.macOS = false; } else if (navigator.platform.indexOf('Mac') > -1) { this.macOS = true; }
    this.csInterface = new CSInterface;
    this.setContextMenu();
    this.root = this.csInterface.getSystemPath(SystemPath.EXTENSION);
    this.loadUniversalScripts();
    this.csInterface.addEventListener('console', this.consoler);

    this.doneLoading();
  },
  
  methods: {
    getContentStyle() {
      return `
        overflow: auto;
        max-height: calc(100vh - 10px);
      `
    },
    doneLoading() {
      this.isLoaded = true;
      console.log('Done loading!')
      this.$router.push({ name: 'home' })
      this.$refs.stylizer.init();
    },
    setContextMenu() {
      this.csInterface.setContextMenuByJSON(this.menuString, this.contextMenuClicked);
    },
    contextMenuClicked(id) {
      if (id == 'refresh') {
        location.replace(this.rootLocation);
      } else if (id == 'localhost') {
        cep.util.openURLInDefaultBrowser(this.localhost);
      }
    },
    loadUniversalScripts() {
      this.csInterface.evalScript(`$.evalFile('${this.root}/src/host/universal/json2.jsx')`)
      this.csInterface.evalScript(`$.evalFile('${this.root}/src/host/universal/Console.jsx')`)
      this.csInterface.evalScript(`$.evalFile('${this.root}/src/host/${this.csInterface.hostEnvironment.appName}/host.jsx')`)
      // console.log(`${this.root}/src/host/${this.csInterface.hostEnvironment.appName}/host.jsx`)
    },
    consoler(msg) {
      console.log(`${this.csInterface.hostEnvironment.appName}: ${msg.data}`);
    },
    getCSS(prop) {
      return window.getComputedStyle(document.documentElement).getPropertyValue('--' + prop);
    },
    setCSS(prop, data) {
      document.documentElement.style.setProperty('--' + prop, data);
    },
  }
  
}
</script>


<style>
:root {
  --color-bg: #323232;
  --color-dark: #1f1f1f;
  --color-selection: #46a0f5;
  --color-disabled: #525252;
  --color-hover: rgba(255,255,225,.2);
  --color-main: #b7b7b7;

  --color-icon: #a1a1a1;
  --color-border: #3e3e3e;
  --color-text-active: #1b1b1b;
  --color-text-default: #a1a1a1;
  --color-text-disabled: #525252;
  --color-input-focus: #fcfcfc;
  --color-input-idle: #262626;

  --color-scrollbar: #2a2a2a;
  --color-scrollbar-thumb: #3e3e3e;
  --color-scrollbar-thumb-hover: #525252;
  --scrollbar-width: 14px;
  --scrollbar-thumb-width: 14px;
  --scrollbar-thumb-radius: 20px;
}

body::-webkit-scrollbar {
  width: 0px;
  /* width: 0px; */
}

#app::-webkit-scrollbar {
  display: block;
}

.container {
  padding: 0px;
}

::-webkit-scrollbar {
  background-color: var(--color-scrollbar);
  width: var(--scrollbar-width);
}
::-webkit-scrollbar-thumb {
  width: var(--scrollbar-width);
  background: var(--color-scrollbar-thumb);
  border-radius: var(--scrollbar-thumb-radius);
}
::-webkit-scrollbar-thumb:hover {
  background: var(--color-scrollbar-thumb-hover);
}
::-webkit-scrollbar-resizer{
  display: none;
}
::-webkit-scrollbar-button {
  height: 0px;
}
</style>