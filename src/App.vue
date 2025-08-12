<template>
  <div id="app">
    <NavBar />
    <div class="container-fluid">
      <router-view/>
    </div>
  </div>
</template>

<script>
  import NavBar from './components/NavBar.vue';

  export default {
    name: 'App',
    components: {
      NavBar,
    },
  }
</script>

<style>
@import 'https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,400;0,700;1,400&display=swap';
@import 'https://fonts.googleapis.com/css2?family=Open+Sans:wght@700&display=swap';

#app {
  font-family: Courier New, Courier, Lucida Sans Typewriter, Lucida Typewriter, monospace;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #ddd;
  background-color: rgb(60, 63, 65);
}

html body {
  background-color: rgb(60, 63, 65);
}

.left-aligned-col {
  text-align: left;
}

.centered-col {
  text-align: center;
}

.centered-span {
  font-size: 20pt;
  vertical-align: middle;
}

.settings-box {
  background-color:rgb(43, 43, 43);
  align-items: center;
  display: flex;
  justify-content: center;
}
</style>
