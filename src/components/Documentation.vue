<template>
  <div class="row">
    <div class="col-6 mx-auto p-2 m-2 md">
      <span v-html="post"></span>
    </div>
  </div>
</template>

<script>
import MarkdownIt from 'markdown-it'

function display_post() {
  const filename = this.$route.params.filename
  const filename_regex = /^[a-zA-Z0-9-]+$/
  const matches = filename_regex.exec(filename)
  if (!matches) { this.$router.replace('/404') }

  var md = new MarkdownIt()
  fetch('../md/'+filename+'.txt')
    .then(response => response.text())
    .then(text => {
      if (!text.startsWith("#")) {
        this.$router.replace('/404');
      }
      this.post = md.render(text);
    })
}

export default {
  data() {
    return {
      post: 'Loading...',
    }
  },
  updated: display_post,
  mounted: display_post  // TODO updating does not seem to work
}
</script>

<style scoped>
.md {
  text-align: left;
  background-color: rgb(43, 43, 43);
}

span >>> img {
  margin: auto;
  display: block;
  max-width: 100%;
}

span >>> p {
  font-family: "Lora", serif;
  font-size: 20px;
}
span >>> li {
  font-family: "Lora", serif;
  font-size: 20px;
}
span >>> h1 {
  font-family: "Open Sans", sans-serif;
}
span >>> h2 {
  font-family: "Open Sans", sans-serif;
}
span >>> h3 {
  font-family: "Open Sans", sans-serif;
}
span >>> h4 {
  font-family: "Open Sans", sans-serif;
}
span >>> h5 {
  font-family: "Open Sans", sans-serif;
}
span >>> h6 {
  font-family: "Open Sans", sans-serif;
}
span >>> em {
  font-family: "Lora", serif;
}
span >>> code {
  color: #fff;
  background-color: rgb(56, 58, 60);
}
span >>> pre {
  background-color: rgb(56, 58, 60);
}

span >>> th {
  font-family: "Open Sans", sans-serif;
  padding: 5px;
}
span >>> td {
  color: #fff;
  padding: 5px;
}
span >>> table {
  background-color: rgb(56, 58, 60);
  margin-left: auto;
  margin-right: auto;
  margin-top: 10px;
  margin-bottom: 10px;
}
</style>