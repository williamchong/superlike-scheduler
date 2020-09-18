<template>
  <v-app dark>
    <v-app-bar fixed app>
      <v-toolbar-title v-text="'Super Like Sceduler'" />
    </v-app-bar>

    <v-main>
      <v-container>
        <nuxt />
      </v-container>
    </v-main>
    <v-footer :absolute="!fixed" app>
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      fixed: false,
    };
  },
};
</script>
