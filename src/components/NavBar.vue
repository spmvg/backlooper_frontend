<template>
    <div>
      <nav class="navbar navbar-dark navbar-expand-md">
        <a href="/" class="ms-5 navbar-brand">backlooper.app</a>
        <button class="navbar-toggler mx-5" type="button" data-bs-toggle="collapse" data-bs-target="#navbarcollapseid">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse mx-3" id="navbarcollapseid">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item">
              <RouterLink to="/"
                          class="mx-1 nav-link"
                          routerLinkActive="active"
                          >
                HOME
              </RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink to="/docs/general"
                          class="mx-1
                          nav-link"
                          >
                DOCUMENTATION
              </RouterLink>
            </li>
            <li class="nav-item">
              <a href="https://github.com/spmvg/backlooper_backend"
                 class="mx-1
                 nav-link"
                 >
                GITHUB
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </div>
</template>
<style scoped>

.navbar-brand {
  font-family: "Courier New", Courier, monospace;
}

nav {
  background-color: rgb(43, 43, 43) !important;
}

.nav-link {
  font-family: "Open Sans", sans-serif;
  font-size: 22px;
  font-weight: bold;
}

.router-link-exact-active {
  color: #eee !important
}
</style>
