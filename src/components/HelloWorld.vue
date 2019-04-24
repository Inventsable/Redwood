<template>
  <div class="pt-3">
    <inputout ref="input" v-if="isMounted"/>
    <filetree />
  </div>
</template>

<script>
  import filetree from './filetree'
  import inputout from './inputOut'

  export default {
    components: {
      filetree,
      inputout,
    },
    data: () => ({
      isMounted: false,
    }),
    mounted() {
      this.isMounted = true;
    }
  }
</script>

<style>

</style>
