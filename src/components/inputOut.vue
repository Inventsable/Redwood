<template>
    <v-layout v-if="isMounted">
      <v-flex class="px-3" id="output" xs12 >
        <v-text-field
            ref="output"
            v-model="output"
            spellcheck="false"
            :prepend-icon="getOutIcon()"
            @click:prepend="getOutputContext()"
            label="Output path"
            :rules="[rules.outputlength, rules.isfolder, rules.hasfolder]"
            @input="changeoutput()">
        </v-text-field>
			</v-flex>
    </v-layout>
</template>

<script>
export default {
  name: 'inputout',
  data: () => ({
        output: null,
		isMounted: false,
		valid: false,
    rules: {
      isfolder: value => {
				const pattern = /\.\w{2,5}$/
				return !pattern.test(value) || 'Must be a directory, not a file'
			},
			hasfolder: value => {
				let trailcheck = /[^\/|\\]$/;
				if (trailcheck.test(value))
					value = value + '/'
				if ((navigator.platform.indexOf('Win') > -1) && value) {
					value = value.split('\\').join('\/');
				}
				const data = window.cep.fs.readdir(value);
				return !data.err || `Folder doesn't exist.`
			},
			outputlength: value => {
				try {
					return !!value.length || 'Absolute path to output is required';
				} catch(err) {
					return false || 'Absolute path to output is required';
				}
			},
    },
  }),
  computed: {
    app() {
      return this.$root.$children[0];
    },
    parent() {
      return this.app.treemenu;
    },
    realoutput() {
			let trailcheck = /[^\/|\\]$/;
			let dupecheck = /\/{2,}$/;
			let fake = JSON.parse(JSON.stringify(this.output))
			if (trailcheck.test(this.output))
				fake = fake + '/'
			if (!this.macOS && fake) {
				fake = fake.split('\\').join('\/');
			}
			if (dupecheck.test(fake))
				fake = fake.replace(dupecheck, '\/');
			return fake
		},
  },
  mounted() {
        if (this.app.storage.getItem('output'))
            this.output = this.app.storage.getItem('output');
        console.log(this.output);

        this.isMounted = true;
        this.app.input = this;
  },
	methods: {
        getOutputContext() {
            if (this.parent.valid) {
                this.addTree();
            } else {
                // @@ Do nothing for now
                return;
            }
        },
        addTree() {
            console.log('Add new tree')
        },
		getOutIcon() {
            if (this.parent) {
                if (this.verifyoutput()) {
                    this.parent.valid = true;
                    return 'add';
                } else if (this.output) {
                    this.parent.valid = false;
                    return 'clear'
                } else {
                    this.parent.valid = false;
                    return 'folder'
                };
            }
		},
		verifyoutput() {
            if (this.parent) {
                try {
                    let folder = window.cep.fs.readdir(this.realoutput);
                    if (!folder.err) {
                        this.parent.validOut = true;
                        return true;
                    } else {
                        this.parent.validOut = false;
                        return false;
                    }
                } catch(err) {
                    this.parent.validOut = false;
                    return false;
                }
            }
		},
		changeoutput() {
			this.app.storage.setItem('output', this.output);
		},
	},
}
</script>

<style>

#output .v-icon {
    /* font-size: 22px; */
}
</style>
