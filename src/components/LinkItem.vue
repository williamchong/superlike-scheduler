<template>
  <v-card>
    <v-img weight="200" height="200" :src="ogImage" />
    <v-card-title>{{ title }}</v-card-title>
    <v-card-subtitle>{{ user || 'User not found' }}</v-card-subtitle>
    <v-card-subtitle>{{ url }}</v-card-subtitle>
  </v-card>
</template>

<script>
// eslint-disable-next-line import/no-extraneous-dependencies
import { mapActions, mapGetters } from 'vuex';

export default {
  props: {
    url: {
      type: String,
      default: undefined,
    },
    likee: {
      type: String,
      default: undefined,
    },
  },
  computed: {
    ...mapGetters('link', ['getLinkInfo']),
    user() {
      return this.likee || (this.getLinkInfo(this.url) || {}).user;
    },
    title() {
      return (this.getLinkInfo(this.url) || {}).title;
    },
    ogImage() {
      return (this.getLinkInfo(this.url) || {}).image;
    },
  },
  watch: {
    url(u) {
      if (!this.getLinkInfo(u)) {
        this.fetchLinkInfo({ url: u });
      }
    },
  },
  mounted() {
    if (!this.getLinkInfo(this.url)) {
      this.fetchLinkInfo({ url: this.url });
    }
  },
  methods: {
    ...mapActions('link', ['fetchLinkInfo']),
  },
};
</script>
