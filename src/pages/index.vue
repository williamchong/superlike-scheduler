<template>
  <v-layout column justify-center align-center>
    <v-flex xs12 sm8 md6>
      <v-card>
        <div v-if="!isLoggedIn">
          <a :href="getOAuthLoginAPI">Login</a>
        </div>
        <div v-else>
          <link-item v-for="l in getLinkList" :key="l.id" :url="l.sourceURL" />
          <link-input @submit="onSubmitNewLink" />
        </div>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
// eslint-disable-next-line import/no-extraneous-dependencies
import { mapActions, mapGetters } from 'vuex';
import { getOAuthLoginAPI } from '../util/api';
import LinkItem from '../components/LinkItem';
import LinkInput from '../components/LinkInput';

export default {
  components: {
    LinkItem,
    LinkInput,
  },
  computed: {
    ...mapGetters('user', ['getUserId']),
    ...mapGetters('link', ['getLinkList', 'getLastLink']),
    getOAuthLoginAPI,
    isLoggedIn() {
      return this.getUserId;
    },
  },
  mounted() {
    this.fetchLinks();
  },
  methods: {
    ...mapActions('link', ['fetchLinks', 'addNewLink']),
    onSubmitNewLink({ url, likee }) {
      this.addNewLink({
        sourceURL: url,
        likee,
        prevId: this.getLastLink ? this.getLastLink.id : null,
        nextId: null,
      });
    },
  },
};
</script>
