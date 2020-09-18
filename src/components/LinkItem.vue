<template>
  <v-list-item three-line target="_blank" :href="url">
    {{ index }}
    <v-list-item-avatar>
      <v-img :src="ogImage" />
    </v-list-item-avatar>

    <v-list-item-content>
      <v-list-item-title>{{ title }}</v-list-item-title>
    </v-list-item-content>
    <v-list-item-content>
      <v-list-item-subtitle>
        <a target="_blank" :src="`https://${LIKE_CO_URL_BASE}/${user}`">
          {{ user || 'User not found' }}
        </a>
      </v-list-item-subtitle>
    </v-list-item-content>
    <v-list-item-content>
      Expected Super Like Time: {{ superLikeTime }}
    </v-list-item-content>

    <v-list-item-icon>
      <v-icon>mdi-calendar-remove</v-icon>
    </v-list-item-icon>
  </v-list-item>
</template>

<script>
// eslint-disable-next-line import/no-extraneous-dependencies
import { mapActions, mapGetters } from 'vuex';
import { LIKE_CO_URL_BASE } from '../constant';

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
    index: {
      type: Number,
      default: undefined,
    },
    superLikeTs: {
      type: Number,
      default: undefined,
    },
  },
  data() {
    return {
      LIKE_CO_URL_BASE,
    };
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
    superLikeTime() {
      return new Date(this.superLikeTs).toString();
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
